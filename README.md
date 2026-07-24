```markdown
# 🛒 Carrefour Price Monitor Bot

Scraper automatizado desarrollado en Python que monitorea diariamente precios de productos en Carrefour Argentina, registra su historial de variaciones en formato JSON y envía reportes automáticos vía Telegram.

---

## 🛠️ Tecnologías Utilizadas

* **Python 3.11** — Lenguaje principal de desarrollo.
* **Playwright** — Extrae precios evitando bloqueos mediante simulación de navegador Chromium e interceptación de recursos.
* **GitHub Actions** — CI/CD para la automatización diaria de ejecuciones sin servidor.
* **Telegram Bot API** — Canal de notificaciones en tiempo real.

---

## 🚀 Arquitectura y Funcionamiento

1. **Planificación:** Un workflow de GitHub Actions ejecuta el script de forma programada mediante un cron job.
2. **Extracción:** Playwright inicia una instancia *headless*, aborta peticiones de imágenes, medios y fuentes para maximizar velocidad, y obtiene los precios actualizados.
3. **Persistencia:** El script calcula la variación diaria y acumulada contra registros previos y guarda el historial en un archivo `historial_YYYY_MM.json`.
4. **Notificación:** Formatea los datos y los envía en una tabla al chat de Telegram configurado.
5. **Auto-commit:** GitHub Actions realiza un commit y push automático para persistir los datos actualizados dentro del repositorio.

---

## 📌 Estado del Proyecto y Roadmap

Actualmente el bot funciona como una **Prueba de Concepto (PoC)** validada sobre una muestra reducida de productos esenciales (Yerba, Aceite, Leche) para asegurar la estabilidad del pipeline, el manejo de selectores dinámicos y la consistencia en el guardado de datos.

### 🔮 Próximos pasos
- [ ] **Ampliación de la Canasta:** Escalar la muestra de productos para replicar una canasta de alimentos similar a la del INDEC.
- [ ] **Paralelización de Scraping:** Optimizar la recolección concurrente mediante procesamiento asíncrono (`asyncio` / Playwright async) para procesar volúmenes más grandes de URLs sin superar tiempos de ejecución.
- [ ] **Mapeo Dinámico de Categorías:** Configurar el scraper por categorías completas en lugar de URLs estáticas.

---

## ⚙️ Configuración e Instalación Local

Si querés probar el proyecto localmente:

1. Clonar el repositorio:
   ```bash
   git clone [https://github.com/SoySid/carrefour-bot.git](https://github.com/SoySid/carrefour-bot.git)
   cd carrefour-bot

```

2. Instalar dependencias:
```bash
pip install -r requirements.txt
python -m playwright install chromium

```


3. Configurar variables de entorno:
```bash
export TELEGRAM_TOKEN="tu_token"
export TELEGRAM_CHAT_ID="tu_chat_id"

```


4. Ejecutar el scraper:
```bash
python carrefour_bot.py

```



```

```