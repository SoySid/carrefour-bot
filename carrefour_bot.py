import os
import requests
from datetime import date
from dotenv import load_dotenv
import psycopg2
from playwright.sync_api import sync_playwright

load_dotenv()

# ---------------------------------------------------------
# CONFIGURACIÓN Y CREDENCIALES
# ---------------------------------------------------------
HEADLESS = os.getenv("HEADLESS", "true").lower() == "true"
TELEGRAM_TOKEN = os.getenv("TELEGRAM_TOKEN")
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID")
DATABASE_URL = os.getenv("DATABASE_URL")

def limpiar_funcion(dato):
    dato = dato.replace("$", "").replace(".", "").replace(",", ".").strip()
    return float(dato)

def calcular_variacion(dato1, dato2):
    if not dato2 or dato2 == 0:
        return 0.0
    return round(((dato1 - dato2) / dato2) * 100, 2)

def calcular_estado(variacion):
    if variacion > 0: return "subio"
    elif variacion < 0: return "bajo"
    return "igual"

def enviar_telegram(mensaje):
    if not TELEGRAM_TOKEN or not TELEGRAM_CHAT_ID:
        print("No se encontraron las credenciales de Telegram en el entorno.")
        return
    url = f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendMessage"
    payload = {
        "chat_id": TELEGRAM_CHAT_ID,
        "text": mensaje,
        "parse_mode": "Markdown"
    }
    try:
        requests.post(url, json=payload)
    except Exception as e:
        print(f"Error enviando mensaje a Telegram: {e}")

# ---------------------------------------------------------
# ETAPA 1: BASE DE DATOS Y LECTURA
# ---------------------------------------------------------
conn = psycopg2.connect(DATABASE_URL)
cursor = conn.cursor()

# Cargar únicamente los productos activos
cursor.execute("SELECT id, nombre, url FROM productos WHERE activo = TRUE")
productos = cursor.fetchall()

# Obtener los precios anteriores para calcular variaciones
cursor.execute("""
    SELECT DISTINCT ON (producto_id) producto_id, precio 
    FROM historial_precios 
    WHERE fecha < CURRENT_DATE 
    ORDER BY producto_id, fecha DESC
""")
precios_ayer = dict(cursor.fetchall())

cursor.execute("""
    SELECT DISTINCT ON (producto_id) producto_id, precio 
    FROM historial_precios 
    ORDER BY producto_id, fecha ASC
""")
precios_dia1 = dict(cursor.fetchall())

# ---------------------------------------------------------
# ETAPA 2: SCRAPING BLINDADO E INSERCIÓN EN NEON
# ---------------------------------------------------------
precios_hoy = {}
fecha_actual = date.today()

with sync_playwright() as p:
    browser = p.chromium.launch(
        headless=HEADLESS,
        slow_mo=1000 if not HEADLESS else 0
    )
    context = browser.new_context(
        user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    )
    page = context.new_page()

    for prod_id, nombre, url in productos:
        try:
            page.goto(url, wait_until="domcontentloaded", timeout=30000)
            contenedor = page.locator("span.valtech-carrefourar-product-price-0-x-sellingPrice")
            
            if contenedor.count() > 0:
                dato = contenedor.locator("span.valtech-carrefourar-product-price-0-x-currencyContainer").inner_text()
                precio = limpiar_funcion(dato)
                precios_hoy[prod_id] = {"nombre": nombre, "precio": precio}

                # Insertar o actualizar el precio del día en la BD
                cursor.execute("""
                    INSERT INTO historial_precios (producto_id, fecha, precio)
                    VALUES (%s, %s, %s)
                    ON CONFLICT (producto_id, fecha) 
                    DO UPDATE SET precio = EXCLUDED.precio;
                """, (prod_id, fecha_actual, precio))
            else:
                print(f"⚠️ Sin precio/stock para: {nombre}")
        except Exception as e:
            print(f"❌ Error scraping {nombre}: {e}")

    browser.close()

conn.commit()

# ---------------------------------------------------------
# ETAPA 3: REPORTE Y TELEGRAM
# ---------------------------------------------------------
lineas = [f"📊 *Reporte Carrefour - {fecha_actual}*\n"]

acum_hoy_ayer, acum_ayer = 0.0, 0.0
acum_hoy_dia1, acum_dia1 = 0.0, 0.0

for prod_id, data in precios_hoy.items():
    nombre = data["nombre"]
    precio_h = data["precio"]
    precio_a = precios_ayer.get(prod_id, precio_h)
    precio_d1 = precios_dia1.get(prod_id, precio_h)

    var_dia = calcular_variacion(precio_h, precio_a)
    var_acum = calcular_variacion(precio_h, precio_d1)

    lineas.append(
        f"• *{nombre}*: ${precio_h:.2f} | *Día:* {var_dia:+.2f}% ({calcular_estado(var_dia)}) | *Acum:* {var_acum:+.2f}% ({calcular_estado(var_acum)})"
    )

    if prod_id in precios_ayer:
        acum_hoy_ayer += precio_h
        acum_ayer += precio_a

    if prod_id in precios_dia1:
        acum_hoy_dia1 += precio_h
        acum_dia1 += precio_d1

var_dia_canasta = calcular_variacion(acum_hoy_ayer, acum_ayer)
var_acum_canasta = calcular_variacion(acum_hoy_dia1, acum_dia1)

lineas.append(f"\n📦 *Canasta del día:* {var_dia_canasta:+.2f}% ({calcular_estado(var_dia_canasta)})")
lineas.append(f"📦 *Canasta acumulada:* {var_acum_canasta:+.2f}% ({calcular_estado(var_acum_canasta)})")

informe = "\n".join(lineas)
print(informe)
enviar_telegram(informe)

cursor.close()
conn.close()