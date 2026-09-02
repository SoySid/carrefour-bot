import re

with open("carrefour_bot.py", "r") as f:
    content = f.read()

# 1. Update imports
content = content.replace("import psycopg2", "import psycopg2\nimport psycopg2.extras")

# 2. Update process_and_save_data
old_save_block = """    for p in all_products_today:
        # Insert or update product info
        cursor.execute(\"\"\"
            INSERT INTO productos (id, nombre, categoria, url, activo)
            VALUES (%s, %s, %s, %s, TRUE)
            ON CONFLICT (id) DO UPDATE SET
                nombre = EXCLUDED.nombre,
                categoria = EXCLUDED.categoria,
                url = EXCLUDED.url,
                activo = TRUE;
        \"\"\", (p['id'], p['nombre'], p['categoria'], p['url']))

        # Insert or update today's price
        cursor.execute(\"\"\"
            INSERT INTO historial_precios (producto_id, fecha, precio)
            VALUES (%s, %s, %s)
            ON CONFLICT (producto_id, fecha)
            DO UPDATE SET precio = EXCLUDED.precio;
        \"\"\", (p['id'], fecha_actual, p['precio']))"""

new_save_block = """    productos_data = [(p['id'], p['nombre'], p['categoria'], p['url']) for p in all_products_today]
    psycopg2.extras.execute_values(
        cursor,
        \"\"\"
        INSERT INTO productos (id, nombre, categoria, url, activo)
        VALUES %s
        ON CONFLICT (id) DO UPDATE SET
            nombre = EXCLUDED.nombre,
            categoria = EXCLUDED.categoria,
            url = EXCLUDED.url,
            activo = TRUE;
        \"\"\",
        productos_data
    )

    precios_data = [(p['id'], fecha_actual, p['precio']) for p in all_products_today]
    psycopg2.extras.execute_values(
        cursor,
        \"\"\"
        INSERT INTO historial_precios (producto_id, fecha, precio)
        VALUES %s
        ON CONFLICT (producto_id, fecha)
        DO UPDATE SET precio = EXCLUDED.precio;
        \"\"\",
        precios_data
    )"""
content = content.replace(old_save_block, new_save_block)


# 3. Update enviar_telegram
old_telegram = """    # Chunk message if it exceeds telegram limit
    max_length = 4000
    messages = [mensaje[i:i+max_length] for i in range(0, len(mensaje), max_length)]

    for msg in messages:
        url = f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendMessage"
        payload = {
            "chat_id": TELEGRAM_CHAT_ID,
            "text": msg,
            "parse_mode": "Markdown"
        }
        try:
            requests.post(url, json=payload)
        except Exception as e:
            print(f"Error enviando mensaje a Telegram: {e}")"""
new_telegram = """    # Chunk message if it exceeds telegram limit, splitting by newline to preserve Markdown
    max_length = 4000
    messages = []
    current_msg = ""
    for line in mensaje.split("\\n"):
        if len(current_msg) + len(line) + 1 > max_length:
            messages.append(current_msg.strip())
            current_msg = line + "\\n"
        else:
            current_msg += line + "\\n"
    if current_msg.strip():
        messages.append(current_msg.strip())

    for msg in messages:
        url = f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendMessage"
        payload = {
            "chat_id": TELEGRAM_CHAT_ID,
            "text": msg,
            "parse_mode": "Markdown"
        }
        try:
            resp = requests.post(url, json=payload)
            resp.raise_for_status()
        except Exception as e:
            print(f"Error enviando mensaje a Telegram: {e}")"""
content = content.replace(old_telegram, new_telegram)

# 4. Update the formatting logic for categories
old_format = """    # Por categoría
    for cat, stats in categorias_stats.items():
        var_cat_dia = calcular_variacion(stats['acum_hoy_ayer'], stats['acum_ayer'])
        var_cat_acum = calcular_variacion(stats['acum_hoy_dia1'], stats['acum_dia1'])

        estado_cat = "🔴" if var_cat_dia > 0 else "🟢" if var_cat_dia < 0 else "⚪"
        lineas.append(f"🏷️ *{cat}*")
        lineas.append(f"• Variación Día: {var_cat_dia:+.2f}% {estado_cat}")
        lineas.append(f"• Variación Acum.: {var_cat_acum:+.2f}%")

        # Top 3 subidas y bajadas
        variaciones = stats['productos_variacion_dia']
        if variaciones:
            variaciones.sort(key=lambda x: x['var_dia'], reverse=True)

            subidas = [v for v in variaciones if v['var_dia'] > 0][:3]
            bajadas = [v for v in variaciones if v['var_dia'] < 0]
            # Get bottom 3 elements if they exist (largest negatives)
            bajadas = sorted(bajadas, key=lambda x: x['var_dia'])[:3]

            if subidas:
                lineas.append("  🔺 *Top Subidas:*")
                for v in subidas:
                    lineas.append(f"    - {v['nombre']}: +{v['var_dia']}% (${v['precio']})")

            if bajadas:
                lineas.append("  🔻 *Top Bajadas:*")
                for v in bajadas:
                    lineas.append(f"    - {v['nombre']}: {v['var_dia']}% (${v['precio']})")

        lineas.append("") # Línea en blanco

    if len(lineas) == 4: # Solo está el header y la canasta general (sin subidas)
        lineas.append("No hubo variaciones de precio en las categorías hoy.")"""

new_format = """    # Por categoría
    hubo_variaciones = False
    for cat, stats in categorias_stats.items():
        var_cat_dia = calcular_variacion(stats['acum_hoy_ayer'], stats['acum_ayer'])
        var_cat_acum = calcular_variacion(stats['acum_hoy_dia1'], stats['acum_dia1'])
        variaciones = stats['productos_variacion_dia']

        if var_cat_dia != 0 or variaciones:
            hubo_variaciones = True

            estado_cat = "🔴" if var_cat_dia > 0 else "🟢" if var_cat_dia < 0 else "⚪"
            lineas.append(f"🏷️ *{cat}*")
            lineas.append(f"• Variación Día: {var_cat_dia:+.2f}% {estado_cat}")
            lineas.append(f"• Variación Acum.: {var_cat_acum:+.2f}%")

            # Top 3 subidas y bajadas
            if variaciones:
                variaciones.sort(key=lambda x: x['var_dia'], reverse=True)

                subidas = [v for v in variaciones if v['var_dia'] > 0][:3]
                bajadas = [v for v in variaciones if v['var_dia'] < 0]
                # Get bottom 3 elements if they exist (largest negatives)
                bajadas = sorted(bajadas, key=lambda x: x['var_dia'])[:3]

                if subidas:
                    lineas.append("  🔺 *Top Subidas:*")
                    for v in subidas:
                        lineas.append(f"    - {v['nombre']}: +{v['var_dia']}% (${v['precio']})")

                if bajadas:
                    lineas.append("  🔻 *Top Bajadas:*")
                    for v in bajadas:
                        lineas.append(f"    - {v['nombre']}: {v['var_dia']}% (${v['precio']})")

            lineas.append("") # Línea en blanco

    if not hubo_variaciones:
        lineas.append("No hubo variaciones de precio en las categorías hoy.")"""

content = content.replace(old_format, new_format)

with open("carrefour_bot.py", "w") as f:
    f.write(content)
