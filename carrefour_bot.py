import os
import sys
import time
import random
import logging
import argparse
import html
import threading
import concurrent.futures
from datetime import date
from dotenv import load_dotenv

import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

import psycopg2
import psycopg2.extras

# Asegurar compatibilidad UTF-8 para emojis en consola de Windows
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

# Configuración de Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)

load_dotenv()

TELEGRAM_TOKEN = os.getenv("TELEGRAM_TOKEN")
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID")
DATABASE_URL = os.getenv("DATABASE_URL")

# Categorías principales de Carrefour
TARGET_CATEGORIES = {
    161: "Almacén",
    222: "Desayuno y merienda",
    255: "Bebidas",
    292: "Lácteos y productos frescos",
    321: "Carnes y pescados",
    330: "Frutas y verduras",
    336: "Panadería",
    347: "Congelados",
    359: "Limpieza",
    402: "Perfumería y farmacia",
    451: "Mundo Bebé",
    471: "Mascotas"
}

# Variable local por hilo para sesiones de requests (Thread-safe)
thread_local = threading.local()

def get_session():
    """Retorna una sesión requests aislada por hilo con reintentos exponenciales automáticos."""
    if not hasattr(thread_local, "session"):
        session = requests.Session()
        retries = Retry(
            total=5,
            backoff_factor=1.5,
            status_forcelist=[429, 500, 502, 503, 504],
            raise_on_status=False
        )
        adapter = HTTPAdapter(max_retries=retries, pool_connections=10, pool_maxsize=10)
        session.mount("https://", adapter)
        session.mount("http://", adapter)
        thread_local.session = session
    return thread_local.session

def init_db(cursor):
    """Inicializa tablas, columnas e índices necesarios en PostgreSQL."""
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS productos (
        id VARCHAR(50) PRIMARY KEY,
        nombre TEXT,
        categoria VARCHAR(100),
        url TEXT,
        activo BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS historial_precios (
        producto_id VARCHAR(50) REFERENCES productos(id),
        fecha DATE,
        precio NUMERIC(10, 2),
        PRIMARY KEY (producto_id, fecha)
    );
    """)

    # Migraciones si las columnas no existen o para ajustar tipos
    cursor.execute("""
    ALTER TABLE productos ADD COLUMN IF NOT EXISTS categoria VARCHAR(100);
    ALTER TABLE productos ADD COLUMN IF NOT EXISTS activo BOOLEAN DEFAULT TRUE;
    ALTER TABLE productos ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    ALTER TABLE productos ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    ALTER TABLE productos ALTER COLUMN nombre TYPE TEXT;
    """)

    # Índices para acelerar búsquedas y reportes históricos
    cursor.execute("""
    CREATE INDEX IF NOT EXISTS idx_historial_precios_fecha ON historial_precios (fecha);
    CREATE INDEX IF NOT EXISTS idx_historial_precios_prod_fecha_desc ON historial_precios (producto_id, fecha DESC);
    CREATE INDEX IF NOT EXISTS idx_historial_precios_prod_fecha_asc ON historial_precios (producto_id, fecha ASC);
    """)

def discover_category_tasks(target_categories, use_subcategories=True):
    """
    Obtiene las tareas de escaneo. Si use_subcategories es True, consulta el árbol VTEX
    y desglosa en subcategorías con su ruta padre (fq=C:/padre/hijo/) para evitar el tope
    de 2500 productos de VTEX y capturar los productos correctamente.
    """
    if not use_subcategories:
        return [(str(cat_id), name, name) for cat_id, name in target_categories.items()]

    try:
        session = get_session()
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "application/json"
        }
        resp = session.get("https://www.carrefour.com.ar/api/catalog_system/pub/category/tree/2", headers=headers, timeout=15)
        if resp.status_code == 200:
            tree_data = resp.json()
            tree_map = {c["id"]: c for c in tree_data}
            tasks = []
            for cat_id, cat_name in target_categories.items():
                cat_info = tree_map.get(cat_id)
                children = cat_info.get("children", []) if cat_info else []
                if children:
                    for child in children:
                        path = f"{cat_id}/{child['id']}"
                        tasks.append((path, cat_name, child.get("name", cat_name)))
                else:
                    tasks.append((str(cat_id), cat_name, cat_name))
            logging.info(f"Árbol de categorías VTEX cargado: {len(tasks)} subcategorías encontradas.")
            return tasks
    except Exception as e:
        logging.warning(f"No se pudo obtener el árbol de subcategorías ({e}). Se usarán las categorías principales.")

    return [(str(cat_id), name, name) for cat_id, name in target_categories.items()]

def fetch_products_for_task(category_path, parent_cat_name, task_name, limit=None):
    """
    Descarga los productos de una categoría o subcategoría dada paginando de a 50 ítems.
    """
    session = get_session()
    products = []
    _from = 0
    _to = 49
    max_vtex_limit = 2500  # Límite por endpoint en VTEX

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json"
    }

    logging.info(f"Escaneando: {parent_cat_name} -> {task_name} (Ruta: {category_path})")

    while _from < max_vtex_limit:
        url = f"https://www.carrefour.com.ar/api/catalog_system/pub/products/search?fq=C:/{category_path}/&_from={_from}&_to={_to}"

        try:
            response = session.get(url, headers=headers, timeout=15)

            if response.status_code not in (200, 206):
                logging.warning(f"  [{task_name}] HTTP {response.status_code} en {url}. Finalizando tarea.")
                break

            data = response.json()
            if not data or not isinstance(data, list):
                break

            for item in data:
                try:
                    product_id = item.get("productId")
                    product_name = item.get("productName")
                    product_url = item.get("link", "")

                    if product_url and not product_url.startswith("http"):
                        product_url = f"https://www.carrefour.com.ar{product_url}"

                    items_list = item.get("items")
                    if not items_list:
                        continue

                    primary_item = items_list[0]
                    sellers = primary_item.get("sellers")
                    if not sellers:
                        continue

                    commertial_offer = sellers[0].get("commertialOffer")
                    if not commertial_offer:
                        continue

                    # Filtro estricto de stock: solo productos efectivamente disponibles para compra
                    try:
                        available_qty = int(float(commertial_offer.get("AvailableQuantity", 0)))
                    except (ValueError, TypeError):
                        available_qty = 0

                    if available_qty <= 0:
                        continue

                    raw_price = commertial_offer.get("Price")
                    if raw_price is None:
                        continue

                    price = float(raw_price)
                    # Validar que el precio sea mayor a cero para evitar datos corruptos
                    if price <= 0:
                        continue

                    if product_id and product_name:
                        products.append({
                            "id": str(product_id).strip(),
                            "nombre": str(product_name).strip(),
                            "categoria": parent_cat_name,
                            "url": str(product_url).strip(),
                            "precio": price
                        })

                        if limit and len(products) >= limit:
                            break
                except (IndexError, KeyError, TypeError, ValueError):
                    continue

            if limit and len(products) >= limit:
                break

            if len(data) < 50:
                break  # Fin del catálogo en esta subcategoría

            _from += 50
            _to += 50

            time.sleep(random.uniform(0.3, 0.7))

        except Exception as e:
            logging.error(f"  Excepción al consultar {url}: {e}")
            break

    logging.info(f"  Completado {task_name}: {len(products)} productos encontrados.")
    return products

def fetch_all_products(tasks, max_workers=4, limit=None):
    """Ejecuta la extracción de productos en paralelo mediante un ThreadPoolExecutor."""
    seen_products = {}
    logging.info(f"Iniciando escaneo con {max_workers} hilos de ejecución...")

    with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = [
            executor.submit(fetch_products_for_task, cat_id, parent_cat, task_name, limit)
            for cat_id, parent_cat, task_name in tasks
        ]

        for future in concurrent.futures.as_completed(futures):
            try:
                products = future.result()
                for p in products:
                    # Deduplicación por ID de producto
                    seen_products[p["id"]] = p
            except Exception as e:
                logging.error(f"Error en hilo de procesamiento: {e}")

    return list(seen_products.values())

def save_products_and_prices(conn, cursor, all_products_today):
    """Guarda productos y precios en PostgreSQL usando inserción por lotes."""
    fecha_actual = date.today()

    productos_data = [
        (p["id"], p["nombre"], p["categoria"], p["url"])
        for p in all_products_today
    ]

    psycopg2.extras.execute_values(
        cursor,
        """
        INSERT INTO productos (id, nombre, categoria, url, activo, updated_at)
        VALUES %s
        ON CONFLICT (id) DO UPDATE SET
            nombre = EXCLUDED.nombre,
            categoria = EXCLUDED.categoria,
            url = EXCLUDED.url,
            activo = TRUE,
            updated_at = CURRENT_TIMESTAMP;
        """,
        productos_data,
        template="(%s, %s, %s, %s, TRUE, CURRENT_TIMESTAMP)",
        page_size=1000
    )

    precios_data = [
        (p["id"], fecha_actual, p["precio"])
        for p in all_products_today
    ]

    psycopg2.extras.execute_values(
        cursor,
        """
        INSERT INTO historial_precios (producto_id, fecha, precio)
        VALUES %s
        ON CONFLICT (producto_id, fecha)
        DO UPDATE SET precio = EXCLUDED.precio;
        """,
        precios_data,
        page_size=1000
    )

    conn.commit()

def calcular_variacion(dato1, dato2):
    """Calcula el porcentaje de variación entre dos valores numéricos."""
    if not dato2 or float(dato2) <= 0:
        return 0.0
    return round(((float(dato1) - float(dato2)) / float(dato2)) * 100, 2)

def chunk_message(text, max_length=4000):
    """Divide un mensaje en partes de hasta 4000 caracteres respetando saltos de línea."""
    chunks = []
    current_chunk = []
    current_length = 0

    for line in text.split("\n"):
        line_len = len(line) + 1
        if current_length + line_len > max_length and current_chunk:
            chunks.append("\n".join(current_chunk).strip())
            current_chunk = [line]
            current_length = line_len
        else:
            current_chunk.append(line)
            current_length += line_len

    if current_chunk:
        chunks.append("\n".join(current_chunk).strip())

    return [c for c in chunks if c]

def enviar_telegram(mensaje, parse_mode="HTML"):
    """Envía un mensaje formateado a Telegram en partes seguras."""
    if not TELEGRAM_TOKEN or not TELEGRAM_CHAT_ID:
        logging.warning("No se encontraron credenciales de Telegram (TELEGRAM_TOKEN/TELEGRAM_CHAT_ID).")
        print("\n--- MENSAJE PARA TELEGRAM ---\n", mensaje)
        return

    chunks = chunk_message(mensaje)
    for i, msg in enumerate(chunks):
        url = f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendMessage"
        payload = {
            "chat_id": TELEGRAM_CHAT_ID,
            "text": msg,
            "parse_mode": parse_mode,
            "disable_web_page_preview": True
        }
        try:
            resp = requests.post(url, json=payload, timeout=15)
            resp.raise_for_status()
            if len(chunks) > 1 and i < len(chunks) - 1:
                time.sleep(0.5)
        except Exception as e:
            logging.error(f"Error enviando mensaje a Telegram: {e}")

def notificar_error_telegram(error_msg):
    """Notifica una alerta de falla crítica al canal de Telegram."""
    if TELEGRAM_TOKEN and TELEGRAM_CHAT_ID:
        fecha = date.today().isoformat()
        escaped_err = html.escape(str(error_msg))
        alerta = (
            f"🚨 <b>Alerta Carrefour Bot - {fecha}</b>\n\n"
            f"❌ Se produjo un error fatal durante la ejecución:\n"
            f"<code>{escaped_err}</code>"
        )
        enviar_telegram(alerta, parse_mode="HTML")

def generate_and_send_report(conn, cursor, all_products_today, send_telegram_flag=True):
    """Calcula variaciones respecto a ayer y día 1, y envía el reporte a Telegram."""
    fecha_actual = date.today()

    # Cargar precios anteriores más recientes (previos a la fecha de hoy)
    cursor.execute("""
        SELECT DISTINCT ON (producto_id) producto_id, precio
        FROM historial_precios
        WHERE fecha < CURRENT_DATE
        ORDER BY producto_id, fecha DESC
    """)
    precios_ayer = {prod_id: float(precio) for prod_id, precio in cursor.fetchall()}

    # Cargar base del mes (cierre del mes previo o primer registro del mes en curso)
    cursor.execute("""
        SELECT DISTINCT ON (producto_id) producto_id, precio
        FROM historial_precios
        WHERE fecha < DATE_TRUNC('month', CURRENT_DATE)
        ORDER BY producto_id, fecha DESC
    """)
    precios_mes_ant = {prod_id: float(precio) for prod_id, precio in cursor.fetchall()}

    cursor.execute("""
        SELECT DISTINCT ON (producto_id) producto_id, precio
        FROM historial_precios
        WHERE fecha >= DATE_TRUNC('month', CURRENT_DATE)
        ORDER BY producto_id, fecha ASC
    """)
    precios_mes_act = {prod_id: float(precio) for prod_id, precio in cursor.fetchall()}

    # Base del mes: si existía antes del 1° del mes se usa el cierre anterior; si no, el primer registro de este mes
    precios_base_mes = {**precios_mes_act, **precios_mes_ant}

    MESES_ES = {
        1: "Enero", 2: "Febrero", 3: "Marzo", 4: "Abril",
        5: "Mayo", 6: "Junio", 7: "Julio", 8: "Agosto",
        9: "Septiembre", 10: "Octubre", 11: "Noviembre", 12: "Diciembre"
    }
    nombre_mes = MESES_ES.get(fecha_actual.month, "")

    # Caso especial: Primer día en que corre el bot (no hay registros previos para comparar)
    if not precios_ayer:
        lineas = [
            f"📊 <b>Reporte Carrefour - {fecha_actual}</b>\n",
            "🛒 <b>CANASTA GENERAL</b>",
            f"📌 <i>Primer día de escaneo: {len(all_products_today):,} productos registrados como base inicial.</i>",
            f"<i>A partir de mañana se mostrarán las variaciones del día y el acumulado de {nombre_mes}.</i>"
        ]
        informe = "\n".join(lineas)
        if send_telegram_flag:
            enviar_telegram(informe, parse_mode="HTML")
        else:
            print("\n--- REPORTE GENERADO (MODO SIN TELEGRAM) ---")
            print(informe)
        return

    categorias_stats = {}
    acum_hoy_ayer, acum_ayer = 0.0, 0.0
    acum_hoy_mes, acum_mes = 0.0, 0.0

    for p in all_products_today:
        prod_id = p["id"]
        nombre = p["nombre"]
        cat = p["categoria"]
        precio_h = p["precio"]

        precio_a = precios_ayer.get(prod_id)
        precio_m = precios_base_mes.get(prod_id)

        if cat not in categorias_stats:
            categorias_stats[cat] = {
                "acum_hoy_ayer": 0.0, "acum_ayer": 0.0,
                "acum_hoy_mes": 0.0, "acum_mes": 0.0,
                "productos_variacion_dia": []
            }

        # Variación Día a Día (solo productos que ya existían previamente)
        if precio_a is not None and precio_a > 0:
            var_dia = calcular_variacion(precio_h, precio_a)
            categorias_stats[cat]["acum_hoy_ayer"] += precio_h
            categorias_stats[cat]["acum_ayer"] += precio_a
            acum_hoy_ayer += precio_h
            acum_ayer += precio_a

            if var_dia != 0:
                categorias_stats[cat]["productos_variacion_dia"].append({
                    "nombre": nombre,
                    "precio": precio_h,
                    "var_dia": var_dia
                })

        # Variación Acumulada del Mes en Curso
        if precio_m is not None and precio_m > 0:
            categorias_stats[cat]["acum_hoy_mes"] += precio_h
            categorias_stats[cat]["acum_mes"] += precio_m
            acum_hoy_mes += precio_h
            acum_mes += precio_m

    # Formatear el reporte en HTML
    lineas = [f"📊 <b>Reporte Carrefour - {fecha_actual}</b>\n"]

    # Canasta General
    var_dia_general = calcular_variacion(acum_hoy_ayer, acum_ayer)
    var_mes_general = calcular_variacion(acum_hoy_mes, acum_mes)

    estado_dia = "📈" if var_dia_general > 0 else "📉" if var_dia_general < 0 else "➖"
    estado_mes = "📈" if var_mes_general > 0 else "📉" if var_mes_general < 0 else "➖"

    lineas.append("🛒 <b>CANASTA GENERAL</b>")
    lineas.append(f"• Día: {var_dia_general:+.2f}% {estado_dia}")
    lineas.append(f"• Acumulado Mes ({nombre_mes}): {var_mes_general:+.2f}% {estado_mes}\n")

    # Por categoría (ordenadas según orden natural de categorías)
    cat_order = list(TARGET_CATEGORIES.values())
    sorted_cats = sorted(
        categorias_stats.items(),
        key=lambda x: cat_order.index(x[0]) if x[0] in cat_order else 99
    )

    hubo_variaciones = False
    for cat, stats in sorted_cats:
        var_cat_dia = calcular_variacion(stats["acum_hoy_ayer"], stats["acum_ayer"])
        var_cat_mes = calcular_variacion(stats["acum_hoy_mes"], stats["acum_mes"])
        variaciones = stats["productos_variacion_dia"]

        if var_cat_dia != 0 or var_cat_mes != 0 or variaciones:
            hubo_variaciones = True
            estado_cat = "🔴" if var_cat_dia > 0 else "🟢" if var_cat_dia < 0 else "⚪"
            lineas.append(f"🏷️ <b>{html.escape(cat)}: {var_cat_dia:+.2f}% {estado_cat}</b> (Mes: {var_cat_mes:+.2f}%)")

            if variaciones:
                variaciones.sort(key=lambda x: x["var_dia"], reverse=True)
                subidas = [v for v in variaciones if v["var_dia"] > 0][:1]
                bajadas = sorted([v for v in variaciones if v["var_dia"] < 0], key=lambda x: x["var_dia"])[:1]

                if subidas:
                    s = subidas[0]
                    nombre_safe = html.escape(s["nombre"])
                    lineas.append(f"  🔺 {nombre_safe}: +{s['var_dia']:.2f}% (${s['precio']:,.2f})")

                if bajadas:
                    b = bajadas[0]
                    nombre_safe = html.escape(b["nombre"])
                    lineas.append(f"  🔻 {nombre_safe}: {b['var_dia']:.2f}% (${b['precio']:,.2f})")

            lineas.append("")

    if not hubo_variaciones:
        lineas.append("No hubo variaciones de precio en las categorías hoy.")

    informe = "\n".join(lineas)

    if send_telegram_flag:
        enviar_telegram(informe, parse_mode="HTML")
    else:
        print("\n--- REPORTE GENERADO (MODO SIN TELEGRAM) ---")
        print(informe)

def parse_args():
    """Configuración de argumentos CLI para depuración y pruebas."""
    parser = argparse.ArgumentParser(description="Carrefour Price Monitor Bot")
    parser.add_argument("--dry-run", action="store_true", help="Escanea sin guardar en BD ni enviar Telegram")
    parser.add_argument("--no-telegram", action="store_true", help="No envía el reporte a Telegram")
    parser.add_argument("--categories", type=str, help="IDs de categorías separadas por coma (ej. 161,336)")
    parser.add_argument("--workers", type=int, default=4, help="Cantidad de hilos paralelos")
    parser.add_argument("--limit", type=int, default=None, help="Límite de productos por tarea (útil para pruebas)")
    parser.add_argument("--no-subcategories", action="store_true", help="Usa categorías principales sin desglosar en subcategorías")
    return parser.parse_args()

def main():
    args = parse_args()
    logging.info("Iniciando bot de Carrefour (v3 - Robusto & Escalable)...")

    if args.dry_run:
        logging.info("MODO DRY-RUN ACTIVO: No se afectará la base de datos ni Telegram.")

    # Selección de categorías
    target_cats = TARGET_CATEGORIES
    if args.categories:
        try:
            cat_ids = [int(x.strip()) for x in args.categories.split(",")]
            target_cats = {cid: TARGET_CATEGORIES.get(cid, f"Categoría {cid}") for cid in cat_ids}
            logging.info(f"Categorías seleccionadas: {target_cats}")
        except ValueError:
            logging.error("Formato inválido para --categories. Ingrese IDs numéricos (ej. 161,336).")
            sys.exit(1)

    try:
        # Descubrir tareas de scraping
        tasks = discover_category_tasks(target_cats, use_subcategories=not args.no_subcategories)

        # Extracción de productos en paralelo
        all_products = fetch_all_products(tasks, max_workers=args.workers, limit=args.limit)
        logging.info(f"Total de productos únicos obtenidos: {len(all_products)}")

        if not all_products:
            logging.warning("No se obtuvieron productos. Finalizando ejecución.")
            return

        if args.dry_run:
            logging.info(f"Dry-run finalizado con éxito ({len(all_products)} productos extraídos).")
            sample = all_products[:5]
            for s in sample:
                logging.info(f"  Muestra: [{s['categoria']}] {s['nombre']} - ${s['precio']:,.2f}")
            return

        if not DATABASE_URL:
            raise ValueError("DATABASE_URL no configurada en variables de entorno.")

        # Persistencia en base de datos y reporte con gestión segura de conexiones
        logging.info("Conectando a PostgreSQL...")
        conn = psycopg2.connect(DATABASE_URL)
        try:
            with conn:
                with conn.cursor() as cursor:
                    init_db(cursor)
                    save_products_and_prices(conn, cursor, all_products)
                    logging.info("Productos e historial de precios guardados exitosamente.")

            with conn.cursor() as cursor:
                logging.info("Generando reporte diario...")
                send_tg = not args.no_telegram
                generate_and_send_report(conn, cursor, all_products, send_telegram_flag=send_tg)
        finally:
            conn.close()
            logging.info("Conexión a PostgreSQL cerrada limpiamente.")

        logging.info("Proceso completado exitosamente.")

    except Exception as e:
        logging.exception(f"Falla crítica en la ejecución: {e}")
        if not args.dry_run and not args.no_telegram:
            notificar_error_telegram(e)
        sys.exit(1)

if __name__ == "__main__":
    main()

