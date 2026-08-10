# Carrefour Price Monitor

Bot para monitorear precios en Carrefour Argentina. Corre una vez al día con GitHub Actions, guarda los precios en una base de datos PostgreSQL (Neon) y envía un reporte por Telegram cuando hay cambios.

## Qué hace

- Scrapea los precios actuales usando Playwright.
- Guarda el historial diario en la base de datos.
- Compara los precios de hoy con los de ayer y con el primer registro cargado.
- Envía una alerta a Telegram solo con los productos que cambiaron de precio en el día.
- Muestra el impacto en el costo total de la canasta monitoreada.

## Stack

- **Python 3.11**
- **Playwright** (scraping)
- **PostgreSQL** (Neon)
- **Telegram Bot API**
- **GitHub Actions** (ejecución diaria)
