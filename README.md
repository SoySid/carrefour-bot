# Carrefour Monitor de Precios

Monitor diario de precios en Carrefour Argentina para medir la variación interdiaria y la inflación acumulada del mes. Extrae el catálogo completo desde la API de VTEX, persiste el histórico en PostgreSQL y calcula un índice ponderado basado en la estructura de gasto de una canasta familiar.

El relevamiento corre de forma automática todas las mañanas mediante GitHub Actions, envía un resumen a Telegram y publica las series temporales en el [portal web](https://carrefour-bot-web.vercel.app).

## Metodología de Medición

A diferencia de un promedio simple de productos sueltos, donde rubros con miles de artículos secundarios (como tinturas o cosméticos) distorsionan el total, el índice utiliza criterios de canasta cerrada:

1. **Venta directa y stock real**: Solo se computan productos comercializados directamente por Carrefour (`sellerId = 1`) con disponibilidad efectiva para compra, ignorando publicaciones de vendedores externos en el marketplace.
2. **Ponderación por rubro**: Cada departamento aporta al índice general según su peso en el consumo habitual de un hogar:
   - Carnes y pescados: 22%
   - Almacén: 20%
   - Lácteos y productos frescos: 15%
   - Frutas y verduras: 10%
   - Panadería: 8%
   - Desayuno y merienda: 8%
   - Bebidas: 6%
   - Limpieza: 6%
   - Perfumería y farmacia (Higiene personal): 3%
   - Congelados: 2%
3. **Filtro de consumibles**: Se excluyen subcategorías ajenas al gasto recurrente de supermercado (artículos de bazar, cestos automáticos, mopas mecánicas, perfumería fina, maquillaje y ortopedia).
4. **Control de anomalías de carga**: Se descartan precios superiores a $100.000 por unidad y saltos puntuales irrealistas provocados por errores de tipeo o cambios temporales de unidad a bulto cerrado en la plataforma.

## Stack

- **Python 3.11+**: Scraper concurrente con `requests`, `urllib3` y manejo de reintentos exponenciales.
- **PostgreSQL (Neon)**: Base de datos relacional para almacenamiento de series de precios por artículo.
- **Next.js 14 + Tailwind CSS**: Portal web público con gráficos históricos y buscador de artículos.
- **Telegram Bot API**: Entrega matutina del reporte diario.
- **GitHub Actions**: Automatización programada diaria a las 08:35 ART.

## Ejemplo de Reporte en Telegram

```text
📊 Reporte Carrefour - 2026-10-19

🛒 CANASTA FAMILIAR PONDERADA
• Día: +0.00% ➖ (🔺0 🔻0 ➖11,187)
• Acumulado Mes (Octubre): +2.83% 📈

📋 Variación por Rubro (Ponderación IPC):
🏷️ Almacén (20%): +0.00% ⚪ (Mes: +3.90%)
🏷️ Desayuno y merienda (8%): +0.00% ⚪ (Mes: +2.85%)
🏷️ Bebidas (6%): +0.00% ⚪ (Mes: +1.96%)
🏷️ Lácteos y productos frescos (15%): +0.00% ⚪ (Mes: +3.36%)
🏷️ Carnes y pescados (22%): +0.00% ⚪ (Mes: +1.03%)
🏷️ Frutas y verduras (10%): +0.00% ⚪ (Mes: +3.48%)
🏷️ Panadería (8%): +0.00% ⚪ (Mes: +2.36%)
🏷️ Congelados (2%): +0.00% ⚪ (Mes: +3.13%)
🏷️ Limpieza (6%): +0.00% ⚪ (Mes: +3.89%)
🏷️ Perfumería y farmacia (3%): +0.00% ⚪ (Mes: +4.77%)
```

## Uso Local

Para ejecutar pruebas manuales o inspeccionar categorías específicas:

```bash
# Simulación sin escribir en base de datos ni enviar mensaje a Telegram
python carrefour_bot.py --dry-run

# Probar una categoría puntual con límite de productos (ej. Carnes ID 321)
python carrefour_bot.py --dry-run --categories 321 --limit 15

# Ejecución real en base de datos sin notificación a Telegram
python carrefour_bot.py --no-telegram

# Forzar ejecución aunque ya se haya registrado el día de hoy
python carrefour_bot.py --force
```

## Configuración (.env)

Copia o completa el archivo `.env` en la raíz del proyecto:

```env
TELEGRAM_TOKEN=tu_token_de_bot
TELEGRAM_CHAT_ID=tu_chat_id
DATABASE_URL=postgresql://usuario:password@host/neondb?sslmode=require
```
