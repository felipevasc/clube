import sqlite3
import os

db_path = r'c:\dev\clube\services\groups\prisma\dev.db'

channels = [
    ('global', 'Geral', 'GLOBAL', None),
    ('fortaleza', 'Fortaleza', 'CITY', 'FORTALEZA'),
    ('brasilia', 'Brasília', 'CITY', 'BRASILIA'),
]

def seed():
    if not os.path.exists(db_path):
        print(f"Database not found at {db_path}")
        return

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Create tables if they don't exist (since prisma db push might have failed)
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS "Channel" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "type" TEXT NOT NULL,
        "cityCode" TEXT,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
    ''')

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS "ChannelMessage" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "channelId" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "text" TEXT NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "ChannelMessage_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel" ("id") ON DELETE CASCADE ON UPDATE CASCADE
    )
    ''')
    
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS "DirectMessage" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "fromUserId" TEXT NOT NULL,
        "toUserId" TEXT NOT NULL,
        "text" TEXT NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    
    cursor.execute('CREATE INDEX IF NOT EXISTS "DirectMessage_fromUserId_toUserId_idx" ON "DirectMessage"("fromUserId", "toUserId")')

    for cid, name, ctype, city in channels:
        cursor.execute('SELECT id FROM "Channel" WHERE id = ?', (cid,))
        if not cursor.fetchone():
            cursor.execute('INSERT INTO "Channel" (id, name, type, cityCode) VALUES (?, ?, ?, ?)', (cid, name, ctype, city))
            print(f"Seeded channel: {name}")
        else:
            print(f"Channel already exists: {name}")

    conn.commit()
    conn.close()

if __name__ == '__main__':
    seed()
