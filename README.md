# Carrefour Price Monitor

Bot para monitorear precios en Carrefour Argentina de miles de productos de supermercado. Corre automáticamente una vez al día con GitHub Actions, almacena los precios en PostgreSQL (Neon) y envía un reporte ejecutivo por Telegram con la variación diaria y la inflación acumulada del mes.

## Qué hace

- **Catálogo completo sin truncar**: Desglosa las categorías mediante el árbol de subcategorías de VTEX (`fq=C:/padre/hijo/`), capturando la totalidad del catálogo (más de 25.000 productos) sin toparse con el límite de 2.500 de la API.
- **Filtro de stock real**: Solo monitorea productos con stock disponible (`AvailableQuantity > 0`), ignorando artículos agotados o con precios desactualizados.
- **Scraping concurrente y resiliente**: Emplea `ThreadPoolExecutor` con sesiones HTTP aisladas por hilo y reintentos automáticos (`urllib3.util.retry.Retry`) ante códigos 429 y 5xx.
- **Base de datos optimizada**: Inserción por lotes en PostgreSQL con transacciones atómicas e índices en fechas para consultas instantáneas.
- **Reporte ejecutivo limpio**: Mensaje compacto en Telegram que muestra la Canasta General (Día y Mes) y el desglose de categorías en una sola línea cada una, sin spam de productos de marketplace.
- **Prevención de ejecuciones duplicadas**: Si el bot ya corrió en el día, omite automáticamente cualquier intento redundante para no enviar reportes duplicados.
- **Alertas de fallos**: Si ocurre una excepción fatal durante la ejecución, envía inmediatamente una notificación de alerta a Telegram.

## Stack

- **Python 3.11+**
- **Requests + Urllib3** (API VTEX con reintentos nativos)
- **PostgreSQL / Neon** (`psycopg2-binary`)
- **Telegram Bot API**
- **GitHub Actions** (ejecución diaria a las 08:35 AM ART / 11:35 UTC)

## Formato del Reporte en Telegram

```text
📊 Reporte Carrefour - 2026-09-13

🛒 CANASTA SUPERMERCADO
• Día: +0.02% 📈 (🔺15 🔻4 ➖11,230)
• Acumulado Mes (Septiembre): +1.65% 📈

📋 Variación por Categoría:
🏷️ Almacén: +0.00% ⚪ (Mes: +1.19%)
🏷️ Desayuno y merienda: +0.00% ⚪ (Mes: +2.68%)
🏷️ Bebidas: +0.00% ⚪ (Mes: +0.45%)
🏷️ Lácteos y productos frescos: +0.00% ⚪ (Mes: +0.36%)
🏷️ Carnes y pescados: +0.00% ⚪ (Mes: +0.27%)
🏷️ Frutas y verduras: +0.05% 🔴 (Mes: +1.61%)
🏷️ Panadería: +0.00% ⚪ (Mes: +0.12%)
🏷️ Congelados: +0.00% ⚪ (Mes: +5.36%)
🏷️ Limpieza: +0.00% ⚪ (Mes: +0.76%)
🏷️ Perfumería y farmacia: +0.00% ⚪ (Mes: +1.14%)
🏷️ Mascotas: +0.00% ⚪ (Mes: +1.62%)
```

## Uso Local y Argumentos CLI

```bash
# Modo prueba (no guarda en base de datos ni envía a Telegram)
python carrefour_bot.py --dry-run

# Probar solo categorías específicas con límite de productos (ej. Panadería ID 336)
python carrefour_bot.py --dry-run --categories 336 --limit 10

# Ejecutar y guardar en BD pero sin enviar reporte a Telegram
python carrefour_bot.py --no-telegram

# Forzar ejecución aunque ya se haya ejecutado en la fecha de hoy
python carrefour_bot.py --force

# Configurar cantidad de hilos paralelos (por defecto: 4)
python carrefour_bot.py --workers 6
```

## Variables de Entorno (.env)

```env
TELEGRAM_TOKEN=tu_token_de_bot
TELEGRAM_CHAT_ID=tu_chat_id
DATABASE_URL=postgresql://usuario:password@host/neondb?sslmode=require
```
