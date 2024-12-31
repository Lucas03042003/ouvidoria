import os
from mysql import connector

# Estabelecer conexão com o banco de dados MySQL específico
try:
    with connector.connect(
        host="127.0.0.1",
        port=3306,  # Certifique-se de usar um número inteiro para a porta
        user="root",
        password="lcn2505@K",
        database="rpg"  # Nome do banco de dados
    ) as database:
        print("Conexão bem-sucedida ao banco de dados 'trabalho_final'")

        # Criar um cursor para executar a consulta
        with database.cursor() as cursor:
            # Executar a consulta para listar todas as tabelas
            cursor.execute("SHOW TABLES")

            # Recuperar e imprimir o resultado
            tables = cursor.fetchall()
            print("Tabelas em 'trabalho_final':")
            for table in tables:
                print(table[0])

except connector.Error as e:
    print("Erro de conexão ou execução:", e)