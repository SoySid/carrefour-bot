from playwright.sync_api import sync_playwright

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
    page.goto("https://www.carrefour.com.ar/yerba-mate-sabor-hierbas-buenas-y-santas-500-grs-718429/p")
    dato = page.locator("span.valtech-carrefourar-product-price-0-x-sellingPrice").inner_text()
        
    precio_actual=limpiar_funcion(dato)
    print(precio_actual)