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
📊 Reporte Carrefour - 2026-09-07

🛒 CANASTA GENERAL
• Día: -0.10% 📉
• Acumulado Mes (Septiembre): -0.46% 📉

📋 Variación por Categoría:
🏷️ Almacén: +0.03% 🔴 (Mes: +0.14%)
🏷️ Desayuno y merienda: +0.00% ⚪ (Mes: +0.08%)
🏷️ Bebidas: +0.00% ⚪ (Mes: -0.01%)
🏷️ Lácteos y productos frescos: -0.22% 🟢 (Mes: -0.46%)
🏷️ Carnes y pescados: +0.07% 🔴 (Mes: -0.71%)
🏷️ Frutas y verduras: +0.10% 🔴 (Mes: +0.60%)
🏷️ Panadería: +0.00% ⚪ (Mes: +0.09%)
🏷️ Congelados: +0.00% ⚪ (Mes: +0.02%)
🏷️ Limpieza: -0.02% 🟢 (Mes: -5.67%)
🏷️ Perfumería y farmacia: -0.52% 🟢 (Mes: +0.02%)
🏷️ Mundo Bebé: +0.00% ⚪ (Mes: -0.09%)
🏷️ Mascotas: +0.03% 🔴 (Mes: -1.13%)
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
