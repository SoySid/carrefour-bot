# Carrefour Monitor Web

Portal web para consultar el índice de precios de la Canasta Familiar en Carrefour Argentina y visualizar la evolución histórica de productos de supermercado.

Producción: [https://carrefour-bot-web.vercel.app](https://carrefour-bot-web.vercel.app)

## Funcionalidades

- Resumen del día y acumulado del mes con ponderación por rubro según gasto de hogar.
- Tabla comparativa de los 10 rubros con detalle de artículos que subieron, bajaron o mantuvieron precio.
- Buscador de productos con gráfico interactivo de precios de los últimos 60 días.
- Mayores aumentos y bajas registradas en la última jornada.

## Desarrollo Local

```bash
cd web
npm install
npm run dev
```

El servidor local corre en `http://localhost:3000`.

## Despliegue

El frontend se despliega automáticamente en Vercel con cada commit en la rama `main`. Para compilar y desplegar manualmente desde la consola:

```bash
# Desde la raíz del repositorio
vercel --prod
```
