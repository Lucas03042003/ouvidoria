import mysql.connector
from flask import Flask, jsonify
import flask_cors

app = Flask(__name__)
flask_cors.CORS(app)  # Habilita CORS para todas as rotas

@app.route('/ativar-usuarios', methods=['POST'])
def ativar_usuarios():
    # Conexão com o banco de dados
    cnx = mysql.connector.connect(
        host="127.0.0.1",
        port="3306",
        user="root",
        password="lcn2505@K",
        database="ouvidoria"
    )

    cursor = cnx.cursor(dictionary=True)  # Retorna resultados como dicionários

    query = "SELECT * FROM usuarios"
    cursor.execute(query)

    resultado = cursor.fetchall()

    cursor.close()
    cnx.close()

    return jsonify(resultado), 200

@app.route('/ativar-tag', methods=['POST'])
def ativar_tags():
    # Conexão com o banco de dados
    cnx = mysql.connector.connect(
        host="127.0.0.1",
        port="3306",
        user="root",
        password="lcn2505@K",
        database="ouvidoria"
    )

    cursor = cnx.cursor(dictionary=True)  # Retorna resultados como dicionários

    query = "SELECT * FROM Tags"
    cursor.execute(query)

    resultado = cursor.fetchall()

    cursor.close()
    cnx.close()

    return jsonify(resultado), 200

@app.route('/ativar-fluxo', methods=['POST'])
def ativar_fluxo():
    # Conexão com o banco de dados
    cnx = mysql.connector.connect(
        host="127.0.0.1",
        port="3306",
        user="root",
        password="lcn2505@K",
        database="ouvidoria"
    )

    cursor = cnx.cursor(dictionary=True)  # Retorna resultados como dicionários

    query = "SELECT * FROM Fluxo"
    cursor.execute(query)

    resultado = cursor.fetchall()

    cursor.close()
    cnx.close()

    return jsonify(resultado), 200

if __name__ == '__main__':
    app.run(debug=True)