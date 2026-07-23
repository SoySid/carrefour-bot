from playwright.sync_api import sync_playwright
from datetime import date
import json
import logging
import os
import requests

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

lista_precios = []

productos = [
    {"nombre": "Yerba", "url": "https://www.carrefour.com.ar/yerba-mate-sabor-hierbas-buenas-y-santas-500-grs-718429/p"},
    {"nombre": "Aceite", "url": "https://www.carrefour.com.ar/aceite-de-girasol-natura-15-l/p"},
    {"nombre": "Leche", "url": "https://www.carrefour.com.ar/leche-la-serenisima-clasica-3-1l-720719/p"}
]

def limpiar_funcion(dato):
    dato = dato.replace("$", "")
    dato = dato.replace(".", "")
    dato = dato.replace(",", ".")
    dato = dato.strip()
    precio = float(dato)
    return precio

def calcular_variacion(dato1, dato2):
    if dato2 == 0:
        return 0.0
    variacion = ((dato1 - dato2) / dato2) * 100
    variacion = round(variacion, 2)
    return variacion

def calcular_estado(variacion):
    if variacion > 0:
        estado = "subio"
    elif variacion < 0:
        estado = "bajo"
    else:
        estado = "igual"
    return estado

def calcular_variacion_canasta(lista1, lista2):
    precios_hoy = sum(lista1)
    precios_anterior = sum(lista2)
    variacion = calcular_variacion(precios_hoy, precios_anterior)
    return variacion

def interceptar_recursos(route):
    if route.request.resource_type in ["image", "media", "font"]:
        route.abort()
    else:
        route.continue_()

def enviar_telegram(mensaje):
    token = os.getenv("TELEGRAM_TOKEN")
    chat_id = os.getenv("TELEGRAM_CHAT_ID")

    if not token or not chat_id:
        logging.error("Falta TELEGRAM_TOKEN o TELEGRAM_CHAT_ID")
        return

    url = f"https://api.telegram.org/bot{token}/sendMessage"
    datos = {"chat_id": chat_id, "text": mensaje, "parse_mode": "HTML"}

    try:
        response = requests.post(url, json=datos)
        if response.status_code == 200:
            logging.info("Mensaje enviado a Telegram exitosamente")
        else:
            logging.error(f"Error al enviar a Telegram: {response.text}")
    except Exception as e:
        logging.error(f"Error enviando Telegram: {e}")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False, slow_mo=200)
    context = browser.new_context(
        user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    )
    page = context.new_page()

    page.route("**/*", interceptar_recursos)

    for producto in productos:
        try:
            page.goto(producto["url"], wait_until="domcontentloaded", timeout=15000)
            contenedor = page.locator("span.valtech-carrefourar-product-price-0-x-sellingPrice")
            elemento_precio = contenedor.locator("span.valtech-carrefourar-product-price-0-x-currencyContainer")

            elemento_precio.wait_for(state="visible", timeout=10000)
            dato = elemento_precio.inner_text()
            precio_actual = limpiar_funcion(dato)

            if precio_actual <= 0:
                logging.error(f"Precio invalido ({precio_actual}) detectado en: {producto['nombre']}")
                continue

            lista_precios.append({"nombre": producto["nombre"], "precio": precio_actual})
            logging.info(f"Procesado con exito: {producto['nombre']} - ${precio_actual}")

        except Exception as e:
            logging.error(f"Error al procesar {producto['nombre']}: {e}")

    browser.close()

if not lista_precios:
    logging.error("No se pudo obtener ningun precio valido. Se detiene la ejecucion.")
    exit()

fecha_hoy_str = str(date.today())
registro_hoy = {
    "fecha": fecha_hoy_str,
    "registros": lista_precios
}

nombre_archivo = f"historial_{date.today().strftime('%Y_%m')}.json"

if not os.path.exists(nombre_archivo):
    with open(nombre_archivo, "w") as archivo:
        json.dump([registro_hoy], archivo, indent=4)
    print("Aumento del dia: 0%")
    print("Aumento acumulado: 0%")

    mensaje_telegram = f"<b>📊 Reporte Carrefour - {fecha_hoy_str}</b>\n\n"
    mensaje_telegram += "Primer día de registro, todavía no hay variación.\n\n"
    for producto in lista_precios:
        mensaje_telegram += f"<b>{producto['nombre']}</b>: ${producto['precio']:.2f}\n"
else:
    with open(nombre_archivo, "r") as archivo:
        datos = json.load(archivo)
        registro_ayer = datos[-1]
        registro_dia1 = datos[0]["registros"]
        lista_precios_hoy = [item["precio"] for item in lista_precios]
        lista_precios_dia1 = [item["precio"] for item in datos[0]["registros"]]
        lista_precios_ayer = [item["precio"] for item in datos[-1]["registros"]]

    mensaje_telegram = f"<b>📊 Reporte Carrefour - {fecha_hoy_str}</b>\n\n"
    mensaje_telegram += "<code>"

    print("=" * 95)
    print(f"{'PRODUCTO':<10} | {'HOY':<10} | {'AYER':<10} | {'VAR. DIA':<12} | {'VAR. ACUM.':<12}")
    print("=" * 95)

    for lista in lista_precios:
        nombre_buscado = lista["nombre"]
        precio_hoy = lista["precio"]
        precio_dia1 = precio_hoy
        precio_ayer = precio_hoy

        for registro in registro_dia1:
            if nombre_buscado == registro["nombre"]:
                precio_dia1 = registro["precio"]
                break

        for registro in registro_ayer["registros"]:
            if nombre_buscado == registro["nombre"]:
                precio_ayer = registro["precio"]
                break

        variacion_acumulada = calcular_variacion(precio_hoy, precio_dia1)
        estado_acumulado = calcular_estado(variacion_acumulada)
        variacion_dia = calcular_variacion(precio_hoy, precio_ayer)
        estado_dia = calcular_estado(variacion_dia)

        print(f"{nombre_buscado:<10} | ${precio_hoy:>8.2f} | ${precio_ayer:>8.2f} | {variacion_dia:>5.2f}% ({estado_dia:<5}) | {variacion_acumulada:>5.2f}% ({estado_acumulado:<5})")
        mensaje_telegram += f"{nombre_buscado:<10} | HOY: ${precio_hoy:>8.2f} | DIA: {variacion_dia:+.2f}% ({estado_dia}) | ACUM: {variacion_acumulada:+.2f}% ({estado_acumulado})\n"

    var_dia_canasta = calcular_variacion_canasta(lista_precios_hoy, lista_precios_ayer)
    var_acum_canasta = calcular_variacion_canasta(lista_precios_hoy, lista_precios_dia1)

    print("=" * 95)
    print(f"CANASTA DIA: {var_dia_canasta:>6.2f}% ({calcular_estado(var_dia_canasta)}) | CANASTA ACUMULADA: {var_acum_canasta:>6.2f}% ({calcular_estado(var_acum_canasta)})")
    print("=" * 95)

    mensaje_telegram += "</code>\n\n"
    mensaje_telegram += f"<b>📦 Canasta del día:</b> {var_dia_canasta:+.2f}% ({calcular_estado(var_dia_canasta)})\n"
    mensaje_telegram += f"<b>📦 Canasta acumulada:</b> {var_acum_canasta:+.2f}% ({calcular_estado(var_acum_canasta)})"

    if datos and datos[-1]["fecha"] == fecha_hoy_str:
        datos[-1] = registro_hoy
    else:
        datos.append(registro_hoy)

    with open(nombre_archivo, "w") as archivo:
        json.dump(datos, archivo, indent=4)

enviar_telegram(mensaje_telegram)