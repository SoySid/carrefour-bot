import psycopg2

def get_schema():
    # Since I don't have the env var in my bash session locally without sourcing it from .env
    from dotenv import load_dotenv
    import os
    load_dotenv()
    DATABASE_URL = os.environ.get("DATABASE_URL")

    conn = psycopg2.connect(DATABASE_URL)
    cursor = conn.cursor()
    cursor.execute("""
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = 'productos';
    """)
    print(cursor.fetchall())

    cursor.execute("""
        SELECT conname, pg_get_constraintdef(c.oid)
        FROM pg_constraint c
        JOIN pg_class t ON c.conrelid = t.oid
        WHERE t.relname = 'productos';
    """)
    print("Constraints:", cursor.fetchall())

get_schema()
