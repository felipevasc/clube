import sqlite3
import os

db_path = r'c:/dev/clube/services/books/prisma/dev.db'

books = [
    ('seed-1', 'O Pequeno Príncipe', 'Antoine de Saint-Exupéry', '/api/media/seed-little-prince.png', 'Um piloto cai no deserto do Saara e encontra um pequeno príncipe que veio de outro asteroide. Uma fábula poética e filosófica sobre o que é verdadeiramente importante na vida.'),
    ('seed-2', 'O Alquimista', 'Paulo Coelho', '/api/media/seed-alchemist.png', 'Santiago, um jovem pastor, viaja da Espanha para o deserto egípcio em busca de um tesouro escondido. Uma jornada de autoconhecimento e fé em busca da \'Lenda Pessoal\'.'),
    ('seed-3', 'Harry Potter e a Pedra Filosofal', 'J.K. Rowling', '/api/media/seed-harry-potter.png', 'Harry descobre que é um bruxo no seu 11º aniversário e entra para a Escola de Magia e Bruxaria de Hogwarts, onde faz amigos e descobre o segredo da pedra filosofal.'),
    ('seed-4', 'O Hobbit', 'J.R.R. Tolkien', '/api/media/seed-hobbit.png', 'Bilbo Bolseiro é convocado por Gandalf para uma aventura épica com treze anões para recuperar o Reino de Erebor do temível dragão Smaug.'),
    ('seed-5', 'Orgulho e Preconceito', 'Jane Austen', '/api/media/seed-pride-prejudice.png', 'A história de Elizabeth Bennet e do arrogante Sr. Darcy, explorando as complexidades das relações sociais, caráter e sentimentos no século XIX.'),
    ('seed-6', 'O Grande Gatsby', 'F. Scott Fitzgerald', '/api/media/seed-gatsby.png', 'Nos anos 20, o misterioso milionário Jay Gatsby dedica sua vida a reconquistar Daisy Buchanan, em meio ao brilho e à decadência da era do jazz.'),
    ('seed-7', 'Admirável Mundo Novo', 'Aldous Huxley', '/api/media/seed-brave-new-world.png', 'Uma distopia onde a sociedade é controlada por manipulação genética e condicionamento, buscando a estabilidade e a felicidade a qualquer custo.')
]

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Delete existing seeds
cursor.execute("DELETE FROM Book WHERE id LIKE 'seed-%'")

# Insert new seeds
for b in books:
    cursor.execute("""
        INSERT OR REPLACE INTO Book (id, title, author, coverUrl, synopsis, createdAt)
        VALUES (?, ?, ?, ?, ?, datetime('now'))
    """, b)

conn.commit()
conn.close()
print("Successfully seeded 7 books with UTF-8 encoding.")
