from playwright.sync_api import sync_playwright
from datetime import date
from dotenv import load_dotenv  # <-- 1. Importar
import json
import os
import requests

load_dotenv()

# ---------------------------------------------------------
# CONFIGURACIÓN Y CREDENCIALES
# ---------------------------------------------------------
HEADLESS = os.getenv("HEADLESS", "true").lower() == "true"

TELEGRAM_TOKEN = os.getenv("TELEGRAM_TOKEN")
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID")

precios_hoy = {}

productos = [
    {"nombre": "Yerba", "url": "https://www.carrefour.com.ar/yerba-mate-sabor-hierbas-buenas-y-santas-500-grs-718429/p"},
    {"nombre": "Aceite", "url": "https://www.carrefour.com.ar/aceite-de-girasol-natura-15-l/p"},
    {"nombre": "Leche", "url": "https://www.carrefour.com.ar/leche-la-serenisima-clasica-3-1l-720719/p"}
]

def limpiar_funcion(dato):
    dato = dato.replace("$", "").replace(".", "").replace(",", ".").strip()
    return float(dato)

def calcular_variacion(dato1, dato2):
    if dato2 == 0:
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
# ETAPA 1: SCRAPING
# ---------------------------------------------------------
with sync_playwright() as p:
    browser = p.chromium.launch(
        headless=HEADLESS,
        slow_mo=1000 if not HEADLESS else 0
    )
    context = browser.new_context(
        user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    )
    page = context.new_page()

    for producto in productos:
        page.goto(producto["url"], wait_until="domcontentloaded")
        contenedor = page.locator("span.valtech-carrefourar-product-price-0-x-sellingPrice")
        dato = contenedor.locator("span.valtech-carrefourar-product-price-0-x-currencyContainer").inner_text()
        precios_hoy[producto["nombre"]] = limpiar_funcion(dato)

    browser.close()

# ---------------------------------------------------------
# ETAPA 2: PROCESAMIENTO Y CÁLCULOS
# ---------------------------------------------------------
fecha_actual = str(date.today())
registro_hoy = {"fecha": fecha_actual, "precios": precios_hoy}
nombre_archivo = "historial.json"

if not os.path.exists(nombre_archivo):
    datos = []
else:
    with open(nombre_archivo, "r") as archivo:
        datos = json.load(archivo)

registros_pasados = [r for r in datos if r["fecha"] != fecha_actual]

precios_ayer = registros_pasados[-1]["precios"] if registros_pasados else precios_hoy
precios_dia1 = datos[0]["precios"] if datos else precios_hoy

# Armado del reporte
lineas = [
    f"📊 *Reporte Carrefour - {fecha_actual}*\n"
]

for nombre, precio_hoy in precios_hoy.items():
    precio_ayer = precios_ayer.get(nombre, precio_hoy)
    precio_dia1 = precios_dia1.get(nombre, precio_hoy)

    var_dia = calcular_variacion(precio_hoy, precio_ayer)
    var_acum = calcular_variacion(precio_hoy, precio_dia1)

    lineas.append(
        f"• *{nombre}*: ${precio_hoy:.2f} | *Día:* {var_dia:+.2f}% ({calcular_estado(var_dia)}) | *Acum:* {var_acum:+.2f}% ({calcular_estado(var_acum)})"
    )

comunes_ayer = precios_hoy.keys() & precios_ayer.keys()
comunes_dia1 = precios_hoy.keys() & precios_dia1.keys()

var_dia_canasta = calcular_variacion(
    sum(precios_hoy[k] for k in comunes_ayer),
    sum(precios_ayer[k] for k in comunes_ayer)
)
var_acum_canasta = calcular_variacion(
    sum(precios_hoy[k] for k in comunes_dia1),
    sum(precios_dia1[k] for k in comunes_dia1)
)

lineas.append(f"\n📦 *Canasta del día:* {var_dia_canasta:+.2f}% ({calcular_estado(var_dia_canasta)})")
lineas.append(f"📦 *Canasta acumulada:* {var_acum_canasta:+.2f}% ({calcular_estado(var_acum_canasta)})")

informe = "\n".join(lineas)

# Consola y Telegram
print(informe)
enviar_telegram(informe)

# Guardar historial
registros_pasados.append(registro_hoy)
with open(nombre_archivo, "w") as archivo:
    json.dump(registros_pasados, archivo, indent=4)