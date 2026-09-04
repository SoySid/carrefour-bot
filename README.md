# Carrefour Price Monitor

Bot para monitorear precios en Carrefour Argentina de miles de productos de supermercado. Corre diariamente con GitHub Actions, guarda los precios en una base de datos PostgreSQL (Neon) y envía un reporte resumido por Telegram agrupado por categorías.

## Qué hace

- **Catálogo completo sin truncar**: Desglosa las categorías mediante el árbol de subcategorías de VTEX (`fq=C:/padre/hijo/`), evitando el límite de 2.500 productos por endpoint y capturando más de 12.000 productos.
- **Scraping concurrente y resiliente**: Emplea `ThreadPoolExecutor` con sesiones HTTP aisladas por hilo y reintentos exponenciales automáticos ante errores 429 y 5xx.
- **Base de datos optimizada**: Almacenamiento por lotes en PostgreSQL con transacciones seguras e índices para análisis de series temporales.
- **Análisis de variaciones de precios**: Compara los precios del día contra el registro anterior más reciente y contra la línea base histórica (Día 1).
- **Reporte seguro en Telegram**: Genera un informe en HTML con chunking inteligente para evitar pérdidas de mensajes o fallos de parseo.
- **Alertas de fallos**: Notifica automáticamente al canal de Telegram si ocurre una excepción fatal durante la ejecución.

## Stack

- **Python 3.11+**
- **Requests + Urllib3** (API VTEX con reintentos nativos)
- **PostgreSQL / Neon** (`psycopg2-binary`)
- **Telegram Bot API**
- **GitHub Actions** (ejecución programada y bajo demanda)

## Uso Local y Argumentos CLI

El bot incluye parámetros de línea de comandos para facilitar depuración y pruebas locales:

```bash
# Modo prueba (no guarda en base de datos ni envía a Telegram)
python carrefour_bot.py --dry-run

# Probar solo categorías específicas con límite de productos (ej. Panadería ID 336)
python carrefour_bot.py --dry-run --categories 336 --limit 10

# Ejecutar y guardar en BD pero sin enviar reporte a Telegram
python carrefour_bot.py --no-telegram

# Configurar hilos de scraping paralelos (por defecto: 4)
python carrefour_bot.py --workers 6
```

## Variables de Entorno (.env)

```env
TELEGRAM_TOKEN=tu_token_de_bot
TELEGRAM_CHAT_ID=tu_chat_id
DATABASE_URL=postgresql://usuario:password@host/neondb?sslmode=require
```
