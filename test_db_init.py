import os
import psycopg2
from dotenv import load_dotenv
from carrefour_bot import init_db

load_dotenv()
DATABASE_URL = os.environ.get("DATABASE_URL")

conn = psycopg2.connect(DATABASE_URL)
cursor = conn.cursor()

init_db(cursor)

conn.commit()
print("DB initialized successfully")
cursor.close()
conn.close()
