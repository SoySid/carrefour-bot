import os
import requests
import time
import random
from datetime import date
from dotenv import load_dotenv
import psycopg2

load_dotenv()

TELEGRAM_TOKEN = os.getenv("TELEGRAM_TOKEN")
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID")
DATABASE_URL = os.getenv("DATABASE_URL")

# Categories we care about
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

def init_db(cursor):
    # Setup tables if they don't exist
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS productos (
        id VARCHAR(50) PRIMARY KEY,
        nombre VARCHAR(255),
        categoria VARCHAR(100),
        url TEXT,
        activo BOOLEAN DEFAULT TRUE
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
    # Add categoria column if upgrading from previous version
    cursor.execute("""
    ALTER TABLE productos ADD COLUMN IF NOT EXISTS categoria VARCHAR(100);
    """)

def fetch_products_for_category(category_id, category_name):
    products = []
    _from = 0
    _to = 49
    max_products = 2500  # API limit

    print(f"Scraping category: {category_name} (ID: {category_id})")

    while _from < max_products:
        url = f"https://www.carrefour.com.ar/api/catalog_system/pub/products/search?fq=C:/{category_id}/&_from={_from}&_to={_to}"
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }

        try:
            response = requests.get(url, headers=headers, timeout=10)

            if response.status_code != 200:
                print(f"  Error fetching {url}: {response.status_code}")
                # Wait longer on error and try again if it's 429
                if response.status_code == 429:
                    time.sleep(5)
                    continue
                break

            data = response.json()

            if not data:
                break # No more products in this category

            for item in data:
                try:
                    product_id = item.get("productId")
                    product_name = item.get("productName")
                    product_url = item.get("link", "")

                    # Carrefour API stores price inside items -> sellers -> commertialOffer -> Price
                    price = item["items"][0]["sellers"][0]["commertialOffer"]["Price"]

                    if product_id and product_name and price is not None:
                        products.append({
                            "id": str(product_id),
                            "nombre": product_name,
                            "categoria": category_name,
                            "url": product_url,
                            "precio": float(price)
                        })
                except (IndexError, KeyError, TypeError):
                    # Skip products with malformed data or missing prices
                    continue

            print(f"  Fetched {_from} to {_to}, got {len(data)} items")

            if len(data) < 50:
                break # Reached the end of the category

            _from += 50
            _to += 50

            # Be nice to the server
            time.sleep(random.uniform(1, 2))

        except Exception as e:
            print(f"  Exception while fetching {url}: {e}")
            break

    return products

def process_and_save_data():
    conn = psycopg2.connect(DATABASE_URL)
    cursor = conn.cursor()

    init_db(cursor)

    # 1. Fetch products from API for all target categories
    all_products_today = []

    for cat_id, cat_name in TARGET_CATEGORIES.items():
        products = fetch_products_for_category(cat_id, cat_name)
        all_products_today.extend(products)

    print(f"\nTotal products fetched: {len(all_products_today)}")

    if not all_products_today:
        print("No products fetched, aborting.")
        cursor.close()
        conn.close()
        return []

    # 2. Save products and prices to DB
    fecha_actual = date.today()

    for p in all_products_today:
        # Insert or update product info
        cursor.execute("""
            INSERT INTO productos (id, nombre, categoria, url, activo)
            VALUES (%s, %s, %s, %s, TRUE)
            ON CONFLICT (id) DO UPDATE SET
                nombre = EXCLUDED.nombre,
                categoria = EXCLUDED.categoria,
                url = EXCLUDED.url,
                activo = TRUE;
        """, (p['id'], p['nombre'], p['categoria'], p['url']))

        # Insert or update today's price
        cursor.execute("""
            INSERT INTO historial_precios (producto_id, fecha, precio)
            VALUES (%s, %s, %s)
            ON CONFLICT (producto_id, fecha)
            DO UPDATE SET precio = EXCLUDED.precio;
        """, (p['id'], fecha_actual, p['precio']))

    conn.commit()

    # We return the cursor and conn so we can reuse it for generating the report
    return conn, cursor, all_products_today

def calcular_variacion(dato1, dato2):
    if not dato2 or dato2 == 0:
        return 0.0
    return round(((float(dato1) - float(dato2)) / float(dato2)) * 100, 2)

def enviar_telegram(mensaje):
    if not TELEGRAM_TOKEN or not TELEGRAM_CHAT_ID:
        print("No se encontraron las credenciales de Telegram.")
        print(mensaje)
        return

    # Chunk message if it exceeds telegram limit
    max_length = 4000
    messages = [mensaje[i:i+max_length] for i in range(0, len(mensaje), max_length)]

    for msg in messages:
        url = f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendMessage"
        payload = {
            "chat_id": TELEGRAM_CHAT_ID,
            "text": msg,
            "parse_mode": "Markdown"
        }
        try:
            requests.post(url, json=payload)
        except Exception as e:
            print(f"Error enviando mensaje a Telegram: {e}")

def generate_and_send_report(conn, cursor, all_products_today):
    fecha_actual = date.today()

    # Cargar historial de ayer
    cursor.execute("""
        SELECT DISTINCT ON (producto_id) producto_id, precio
        FROM historial_precios
        WHERE fecha < CURRENT_DATE
        ORDER BY producto_id, fecha DESC
    """)
    precios_ayer = {prod_id: float(precio) for prod_id, precio in cursor.fetchall()}

    # Cargar historial del día 1 (el primer precio registrado)
    cursor.execute("""
        SELECT DISTINCT ON (producto_id) producto_id, precio
        FROM historial_precios
        ORDER BY producto_id, fecha ASC
    """)
    precios_dia1 = {prod_id: float(precio) for prod_id, precio in cursor.fetchall()}

    # Agrupar datos por categoría
    categorias_stats = {}

    # Global basket
    acum_hoy_ayer, acum_ayer = 0.0, 0.0
    acum_hoy_dia1, acum_dia1 = 0.0, 0.0

    for p in all_products_today:
        prod_id = p['id']
        nombre = p['nombre']
        cat = p['categoria']
        precio_h = p['precio']

        precio_a = precios_ayer.get(prod_id, precio_h)
        precio_d1 = precios_dia1.get(prod_id, precio_h)

        var_dia = calcular_variacion(precio_h, precio_a)
        var_acum = calcular_variacion(precio_h, precio_d1)

        if cat not in categorias_stats:
            categorias_stats[cat] = {
                'acum_hoy_ayer': 0.0, 'acum_ayer': 0.0,
                'acum_hoy_dia1': 0.0, 'acum_dia1': 0.0,
                'productos_variacion_dia': []
            }

        # Add to category totals if present in history
        if prod_id in precios_ayer:
            categorias_stats[cat]['acum_hoy_ayer'] += precio_h
            categorias_stats[cat]['acum_ayer'] += precio_a
            acum_hoy_ayer += precio_h
            acum_ayer += precio_a

            if var_dia != 0:
                categorias_stats[cat]['productos_variacion_dia'].append({
                    'nombre': nombre,
                    'precio': precio_h,
                    'var_dia': var_dia
                })

        if prod_id in precios_dia1:
            categorias_stats[cat]['acum_hoy_dia1'] += precio_h
            categorias_stats[cat]['acum_dia1'] += precio_d1
            acum_hoy_dia1 += precio_h
            acum_dia1 += precio_d1

    # Formatear el reporte
    lineas = [f"📊 *Reporte Carrefour - {fecha_actual}*\n"]

    # Canasta General
    var_dia_general = calcular_variacion(acum_hoy_ayer, acum_ayer)
    var_acum_general = calcular_variacion(acum_hoy_dia1, acum_dia1)

    estado_dia = "📈" if var_dia_general > 0 else "📉" if var_dia_general < 0 else "➖"
    lineas.append(f"🛒 *CANASTA GENERAL*")
    lineas.append(f"• Día: {var_dia_general:+.2f}% {estado_dia}")
    lineas.append(f"• Acumulado: {var_acum_general:+.2f}%\n")

    # Por categoría
    for cat, stats in categorias_stats.items():
        var_cat_dia = calcular_variacion(stats['acum_hoy_ayer'], stats['acum_ayer'])
        var_cat_acum = calcular_variacion(stats['acum_hoy_dia1'], stats['acum_dia1'])

        estado_cat = "🔴" if var_cat_dia > 0 else "🟢" if var_cat_dia < 0 else "⚪"
        lineas.append(f"🏷️ *{cat}*")
        lineas.append(f"• Variación Día: {var_cat_dia:+.2f}% {estado_cat}")
        lineas.append(f"• Variación Acum.: {var_cat_acum:+.2f}%")

        # Top 3 subidas y bajadas
        variaciones = stats['productos_variacion_dia']
        if variaciones:
            variaciones.sort(key=lambda x: x['var_dia'], reverse=True)

            subidas = [v for v in variaciones if v['var_dia'] > 0][:3]
            bajadas = [v for v in variaciones if v['var_dia'] < 0]
            # Get bottom 3 elements if they exist (largest negatives)
            bajadas = sorted(bajadas, key=lambda x: x['var_dia'])[:3]

            if subidas:
                lineas.append("  🔺 *Top Subidas:*")
                for v in subidas:
                    lineas.append(f"    - {v['nombre']}: +{v['var_dia']}% (${v['precio']})")

            if bajadas:
                lineas.append("  🔻 *Top Bajadas:*")
                for v in bajadas:
                    lineas.append(f"    - {v['nombre']}: {v['var_dia']}% (${v['precio']})")

        lineas.append("") # Línea en blanco

    if len(lineas) == 4: # Solo está el header y la canasta general (sin subidas)
        lineas.append("No hubo variaciones de precio en las categorías hoy.")

    informe = "\n".join(lineas)
    enviar_telegram(informe)

def main():
    print("Iniciando bot de Carrefour (v2 - API)...")
    try:
        conn, cursor, all_products_today = process_and_save_data()
        if all_products_today:
            generate_and_send_report(conn, cursor, all_products_today)
            cursor.close()
            conn.close()
    except Exception as e:
        print(f"Error fatal: {e}")

if __name__ == "__main__":
    main()

