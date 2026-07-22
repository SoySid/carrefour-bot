from playwright.sync_api import sync_playwright
from datetime import date
import json
import os

lista_precios=[]

productos = [
    {"nombre": "Yerba", "url": "https://www.carrefour.com.ar/yerba-mate-sabor-hierbas-buenas-y-santas-500-grs-718429/p"},
    {"nombre": "Aceite", "url": "https://www.carrefour.com.ar/aceite-de-girasol-natura-15-l/p"},
    {"nombre": "Leche", "url": "https://www.carrefour.com.ar/leche-la-serenisima-clasica-3-1l-720719/p"}

]

def limpiar_funcion(dato):
    dato=dato.replace("$","")
    dato=dato.replace(".","")
    dato=dato.replace(",",".")
    dato=dato.strip()
    precio=float(dato)
    return precio

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False, slow_mo=1000)
    context = browser.new_context(
        user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    )
    page = context.new_page()

    for producto in productos:
        page.goto(producto["url"])
        contenedor = page.locator("span.valtech-carrefourar-product-price-0-x-sellingPrice")
        dato = contenedor.locator("span.valtech-carrefourar-product-price-0-x-currencyContainer").inner_text()
        precio_actual=limpiar_funcion(dato)
        lista_precios.append({"nombre":producto["nombre"],"precio":precio_actual})

    registro_hoy={
        "fecha": str(date.today()),
        "registros": lista_precios 
    }

    nombre_archivo = "historial_precios.json"

    if not os.path.exists(nombre_archivo):
        with open(nombre_archivo, "w") as archivo:
            json.dump([registro_hoy], archivo)
        print("Aumento del dia: 0%")
        print("Aumento acumulado: 0%")
    else:
        with open("historial_precios.json", "r") as archivo:
            datos = json.load(archivo)
            registro_ayer=datos[-1]
        for lista in lista_precios:
            nombre_buscado=lista["nombre"]
            precio_hoy=lista["precio"]
            
            for registro in registro_ayer["registros"]:
                if nombre_buscado==registro["nombre"]:
                    precio_ayer=registro["precio"]
                    variacion = ((precio_hoy - precio_ayer) / precio_ayer) * 100
                    variacion=round(variacion,2)
                    if variacion>0:
                        estado="subio"
                    elif variacion<0:
                        estado="bajo"
                    else:
                        estado="igual"
            print(f"Producto: {nombre_buscado}, precio ayer: {precio_ayer}, precio hoy: {precio_hoy}, variacion: {variacion}, estado: {estado}")
        datos.append(registro_hoy)
        with open(nombre_archivo, "w") as archivo:
            json.dump(datos, archivo)

    browser.close()