import mysql.connector
from flask import Flask, jsonify, request
import flask_cors

app = Flask(__name__)
flask_cors.CORS(app)  # Habilita CORS para todas as rotas

# Função auxiliar para criar conexão com o banco de dados
def get_db_connection():
    return mysql.connector.connect(
        host="127.0.0.1",
        port="3306",
        user="root",
        password="lcn2505@K",
        database="ouvidoria"
    )

@app.route('/ativar-usuarios', methods=['POST'])
def ativar_usuarios():
    cnx = get_db_connection()
    cursor = cnx.cursor(dictionary=True)
    query = "SELECT * FROM usuarios"
    cursor.execute(query)
    resultado = cursor.fetchall()
    cursor.close()
    cnx.close()
    return jsonify(resultado), 200

@app.route('/ativar-tag', methods=['POST'])
def ativar_tags():
    cnx = get_db_connection()
    cursor = cnx.cursor(dictionary=True)
    query = "SELECT * FROM Tags"
    cursor.execute(query)
    resultado = cursor.fetchall()
    cursor.close()
    cnx.close()
    return jsonify(resultado), 200

@app.route('/ativar-fluxo', methods=['POST'])
def ativar_fluxo():
    cnx = get_db_connection()
    cursor = cnx.cursor(dictionary=True)
    query = "SELECT * FROM Fluxo"
    cursor.execute(query)
    resultado = cursor.fetchall()
    cursor.close()
    cnx.close()
    return jsonify(resultado), 200

@app.route('/ativar-sistema', methods=['POST'])
def ativar_sistema():
    cnx = get_db_connection()
    cursor = cnx.cursor(dictionary=True)
    query = "SELECT * FROM Config"
    cursor.execute(query)
    resultado = cursor.fetchall()
    cursor.close()
    cnx.close()
    return jsonify(resultado), 200

@app.route('/salvar-fluxos', methods=['POST'])
def salvar_fluxos():
    try:
        novos_fluxos = request.json
        cnx = get_db_connection()
        cursor = cnx.cursor()

        # Deletar todos os fluxos existentes
        cursor.execute("DELETE FROM Fluxo")

        # Inserir os novos fluxos
        insert_query = "INSERT INTO Fluxo (id_fluxo, nome, posicao) VALUES (%s, %s, %s)"
        for fluxo in novos_fluxos:
            cursor.execute(insert_query, (fluxo['id_fluxo'], fluxo['nome'], fluxo['posicao']))

        cnx.commit()
        cursor.close()
        cnx.close()

        return jsonify({"message": "Fluxos atualizados com sucesso!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)