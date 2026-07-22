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

def calcular_variacion(dato1,dato2):
    variacion=((dato1-dato2)/dato2)*100
    variacion=round(variacion,2)
    return variacion

def calcular_estado(variacion):
    if variacion>0:
        estado="subio"
    elif variacion<0:
        estado="bajo"
    else:
        estado="igual"
    return estado

def calcular_variacion_canasta(lista1,lista2):
    precios_hoy=sum(lista1)
    precios_anterior=sum(lista2)

    variacion= calcular_variacion(precios_hoy,precios_anterior)
    return variacion


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
            registro_dia1=datos[0]["registros"]
            lista_precios_hoy = [item["precio"] for item in lista_precios]
            lista_precios_dia1 = [item["precio"] for item in datos[0]["registros"]]
            lista_precios_ayer = [item["precio"] for item in datos[-1]["registros"]]

        for lista in lista_precios:
            nombre_buscado=lista["nombre"]
            precio_hoy=lista["precio"]

            for registro in registro_dia1:
                precio_dia1=registro["precio"]
                
                if nombre_buscado==registro["nombre"]:
                   precio_dia1=registro["precio"]
                   variacion_acumulada=calcular_variacion(precio_hoy,precio_dia1)
                   estado_acumulado=calcular_estado(variacion_acumulada)

            for registro in registro_ayer["registros"]:
                if nombre_buscado==registro["nombre"]:
                    precio_ayer=registro["precio"]
                    variacion_dia=calcular_variacion(precio_hoy,precio_ayer)
                    estado_dia=calcular_estado(variacion_dia)
            
            print(f"Producto: {nombre_buscado}, precio ayer: {precio_ayer}, precio hoy: {precio_hoy}, variacion del dia: {variacion_dia}, estado: {estado_dia}, variacion acumulada:{variacion_acumulada}, estado:{estado_acumulado}")
        print(f"Variacion de la canasta en el dia:{calcular_variacion_canasta(lista_precios_hoy,lista_precios_ayer)}")
        print(f"Variacion de la canasta acumulada:{calcular_variacion_canasta(lista_precios_hoy,lista_precios_dia1)}")
        datos.append(registro_hoy)
        with open(nombre_archivo, "w") as archivo:
            json.dump(datos, archivo)

    browser.close()