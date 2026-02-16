import sqlite3
import os

db_path = 'c:/dev/clube/services/books/prisma/dev.db'

if not os.path.exists(db_path):
    print(f"Error: Database not found at {db_path}")
    exit(1)

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

try:
    # Check if column exists
    cursor.execute("PRAGMA table_info(Book)")
    columns = [row[1] for row in cursor.fetchall()]
    
    if 'genre' not in columns:
        print("Adding 'genre' column...")
        cursor.execute("ALTER TABLE Book ADD COLUMN genre TEXT DEFAULT ''")
    else:
        print("'genre' column already exists.")

    # Add index if it doesn't exist
    try:
        print("Adding index...")
        cursor.execute("CREATE INDEX IF NOT EXISTS Book_genre_idx ON Book(genre)")
    except Exception as e:
        print(f"Index notice: {e}")

    conn.commit()
    print("Success: Database updated.")
except Exception as e:
    print(f"Error updating database: {e}")
finally:
    conn.close()
