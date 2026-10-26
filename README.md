# Carrefour Monitor de Precios

> Relevamiento diario y automatizado de precios en Carrefour Argentina para medir la variación interdiaria y la inflación mensual acumulada mediante una canasta familiar ponderada.

[![Scrape Carrefour Daily](https://github.com/SoySid/carrefour-bot/actions/workflows/carrefour.yml/badge.svg)](https://github.com/SoySid/carrefour-bot/actions/workflows/carrefour.yml)
[![Latest Release](https://img.shields.io/github/v/release/SoySid/carrefour-bot?label=Release&color=2ea44f)](https://github.com/SoySid/carrefour-bot/releases/latest)
[![Portal Web](https://img.shields.io/badge/Portal_Web-En_L%C3%ADnea-blue)](https://carrefour-bot-web.vercel.app)

---

## Arquitectura del Sistema

```mermaid
flowchart LR
    subgraph Extracción
        API[API REST VTEX<br/>Catálogo Carrefour] -->|Paginación concurrente| BOT[Scraper Python 3.11<br/>GitHub Actions]
    end

    subgraph Almacenamiento
        BOT -->|Series de precios diarias| DB[(PostgreSQL en Neon<br/>Almacenamiento relacional)]
    end

    subgraph Distribución
        BOT -->|Reporte matutino| TG[Telegram Bot API<br/>Canal privado]
        DB -->|Consultas y análisis| WEB[Portal Web<br/>Next.js 14 + Tailwind]
    end
```

---

## Metodología de Medición

A diferencia de un promedio simple de productos sueltos, donde rubros con miles de artículos secundarios (como tinturas o cosméticos) distorsionan el total, el índice utiliza criterios de canasta cerrada:

1. **Venta directa y stock real**: Solo se computan productos comercializados directamente por Carrefour (`sellerId = 1`) con disponibilidad efectiva para compra, ignorando publicaciones de terceros en el marketplace.
2. **Ponderación por rubro**: Cada departamento aporta al índice general según su peso en el consumo habitual de un hogar:

| Rubro | Ponderación | Cobertura |
| :--- | :---: | :--- |
| **Carnes y pescados** | 22% | Cortes vacunos, pollo, cerdo y pescadería fresca |
| **Almacén** | 20% | Aceites, pastas, harinas, arroz, legumbres y conservas |
| **Lácteos y productos frescos** | 15% | Leches, quesos, mantecas y yogures |
| **Frutas y verduras** | 10% | Frutas y hortalizas frescas de estación |
| **Panadería** | 8% | Panificados frescos y de molde |
| **Desayuno y merienda** | 8% | Café, té, yerba, galletitas y cereales |
| **Bebidas** | 6% | Aguas, jugos, gaseosas e infusiones |
| **Limpieza** | 6% | Lavandinas, detergentes y jabón para ropa |
| **Perfumería y farmacia** | 3% | Cuidado e higiene personal diaria |
| **Congelados** | 2% | Verduras y alimentos congelados preparados |

> [!NOTE]
> **Filtros de integridad**: Se excluyen subcategorías no esenciales de supermercado (bazar, cestos, mopas, perfumería fina, maquillaje y ortopedia) y se descartan precios mayores a $100.000 o saltos diarios extremos provocados por equivocaciones tipográficas temporales en la plataforma.

---

## Uso Local

| Comando | Modo | Descripción |
| :--- | :---: | :--- |
| `python carrefour_bot.py --dry-run` | Simulación | Corre el relevamiento sin escribir en PostgreSQL ni enviar notificación. |
| `python carrefour_bot.py --no-telegram` | Producción local | Guarda los precios en base de datos sin disparar el mensaje de Telegram. |
| `python carrefour_bot.py --categories 321 --limit 15` | Muestreo | Evalúa una categoría puntual (ej. Carnes ID 321) con límite de productos. |
| `python carrefour_bot.py --force` | Forzado | Ejecuta el proceso aunque ya exista un corte guardado para el día de hoy. |

> [!TIP]
> El portal web interactivo se ejecuta localmente desde el subdirectorio `web/` con `npm run dev`.

---

<details>
<summary><b>Variables de Entorno (.env)</b></summary>

Crea un archivo `.env` en la raíz del proyecto tomando como referencia `.env.example`:

| Variable | Requerida | Descripción |
| :--- | :---: | :--- |
| `DATABASE_URL` | Sí | Cadena de conexión PostgreSQL (formato Neon con `sslmode=require`). |
| `TELEGRAM_TOKEN` | Opcional | Token de autenticación del bot provisto por BotFather. |
| `TELEGRAM_CHAT_ID` | Opcional | Identificador de chat o canal de Telegram receptor. |

```env
TELEGRAM_TOKEN=tu_token_de_bot
TELEGRAM_CHAT_ID=tu_chat_id
DATABASE_URL=postgresql://usuario:password@host/neondb?sslmode=require
```

</details>

<details>
<summary><b>Ejemplo de Reporte Diario en Telegram</b></summary>

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

</details>
