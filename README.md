```markdown
# Carrefour Price Monitor Bot

Scraper automatizado en Python para monitorear precios en Carrefour Argentina. Registra el historial diario en archivos JSON y envía alertas mediante la API de Telegram. Ejecutado sin servidor mediante GitHub Actions.

---

## Tecnologías

* **Python 3.11**
* **Playwright** (Navegación Chromium headless e interceptación de peticiones para optimización)
* **GitHub Actions** (Ejecución programada vía cron job y persistencia de datos)
* **Telegram Bot API** (Notificaciones)

---

## Estado del Proyecto y Roadmap

Actualmente el bot opera como una **Prueba de Concepto (PoC)** sobre 3 productos clave para validar la estabilidad de selectores, manejo de red y almacenamiento.

- [ ] Ampliar la muestra a una canasta representativa tipo INDEC.
- [ ] Implementar arquitectura asíncrona (`asyncio` + Playwright async) para procesamiento paralelo de URLs.
- [ ] Scraping por categorías completas en lugar de listado estático.

---

## Ejecución Local

1. Clonar e instalar dependencias:
   ```bash
   git clone [https://github.com/SoySid/carrefour-bot.git](https://github.com/SoySid/carrefour-bot.git)
   cd carrefour-bot
   pip install -r requirements.txt
   python -m playwright install chromium

```

2. Variables de entorno:
```bash
export TELEGRAM_TOKEN="tu_token"
export TELEGRAM_CHAT_ID="tu_chat_id"

```


3. Correr script:
```bash
python carrefour_bot.py

```
