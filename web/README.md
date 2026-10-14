# Carrefour Monitor - Portal Web

Plataforma pública interactiva construida con **Next.js 14 (App Router)**, **Tailwind CSS** y **Neon PostgreSQL** para consultar en tiempo real el índice de precios, la inflación acumulada de la canasta de supermercado y la evolución histórica de productos en Carrefour Argentina.

## Características

- **Índice en Vivo**: Variación porcentual del día y acumulada del mes en curso, con desglose de artículos que subieron, bajaron o mantuvieron precio.
- **Buscador de Catálogo con Historial**: Búsqueda instantánea con series temporales y trazado de curvas históricas de precios mediante SVG interactivo nativo.
- **Termómetro por Categorías**: Monitoreo de 12 rubros con adaptación responsive (grilla en escritorio y carrusel snap horizontal en móvil).
- **Top Movimientos**: Mayores aumentos y mejores ofertas detectadas en el último corte matutino.
- **Cero Fricción con la Base de Datos**: Integración con `@neondatabase/serverless` e ISR (Incremental Static Regeneration cada 1 hora) para máxima velocidad de respuesta sin agotar conexiones.

## Desarrollo Local

```bash
cd web
npm install
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`.

## Despliegue en Vercel

1. Importar el repositorio en [Vercel](https://vercel.com).
2. En la configuración del proyecto:
   - **Root Directory**: `web`
   - **Framework Preset**: `Next.js`
3. En la sección **Environment Variables**:
   - `DATABASE_URL`: Pegar la cadena de conexión de Neon (`postgresql://...`).
4. Presionar **Deploy**.
