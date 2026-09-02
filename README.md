# Carrefour Price Monitor

Bot para monitorear precios en Carrefour Argentina de miles de productos de supermercado. Corre una vez al día con GitHub Actions, guarda los precios en una base de datos PostgreSQL (Neon) y envía un reporte resumido por Telegram agrupado por categorías.

## Qué hace

- Extrae los catálogos completos (Almacén, Lácteos, Carnes, Bebidas, etc.) usando la API de VTEX de Carrefour (mucho más rápido que scrapers visuales).
- Guarda el historial diario y el registro de productos en la base de datos de manera automática.
- Compara los precios de hoy con los de ayer y con el primer registro (Día 1).
- Envía un reporte condensado a Telegram mostrando el porcentaje de variación global, la variación por cada categoría, y el top 3 de los productos que más subieron y bajaron de precio en cada una, evitando hacer spam.

## Stack

- **Python 3.11**
- **Requests** (consumo de API)
- **PostgreSQL** (Neon)
- **Telegram Bot API**
- **GitHub Actions** (ejecución diaria)
