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
    cnx = None
    cursor = None
    try:
        novos_fluxos = request.json
        cnx = get_db_connection()
        cursor = cnx.cursor()

        # Iniciar uma transação
        cnx.start_transaction()

        # Armazenar os fluxos antigos antes de deletá-los
        cursor.execute("SELECT * FROM Fluxo")
        fluxos_antigos = cursor.fetchall()

        # Deletar todos os fluxos existentes
        cursor.execute("DELETE FROM Fluxo")

        # Inserir os novos fluxos
        insert_query = "INSERT INTO Fluxo (id_fluxo, nome, posicao) VALUES (%s, %s, %s)"
        for fluxo in novos_fluxos:
            cursor.execute(insert_query, (fluxo['id_fluxo'], fluxo['nome'], fluxo['posicao']))

        # Se chegou até aqui sem erros, commit da transação
        cnx.commit()
        
        return jsonify({"message": "Fluxos atualizados com sucesso!"}), 200

    except Exception as e:
        # Se ocorrer qualquer erro, fazer rollback
        if cnx:
            cnx.rollback()
            
            # Tentar restaurar os fluxos antigos
            try:
                for fluxo in fluxos_antigos:
                    cursor.execute(insert_query, fluxo)
                cnx.commit()
            except:
                # Se falhar ao restaurar, pelo menos o banco estará vazio
                cnx.rollback()
        
        return jsonify({"error": str(e)}), 500

    finally:
        # Fechar cursor e conexão, independentemente do resultado
        if cursor:
            cursor.close()
        if cnx:
            cnx.close()

@app.route('/salvar-tags', methods=['POST'])
def salvar_tags():
    cnx = None
    cursor = None
    try:
        novas_tags = request.json
        cnx = get_db_connection()
        cursor = cnx.cursor()

        # Iniciar uma transação
        cnx.start_transaction()

        # Armazenar as tags antigas antes de deletá-las
        cursor.execute("SELECT * FROM Tags")
        tags_antigas = cursor.fetchall()

        # Deletar todas as tags existentes
        cursor.execute("DELETE FROM Tags")

        # Inserir as novas tags
        insert_query = "INSERT INTO Tags (id_tag, titulo, cor_tag, cor_texto) VALUES (%s, %s, %s, %s)"
        for tag in novas_tags:
            cursor.execute(insert_query, (
                tag['id_tag'],
                tag['titulo'],
                tag['cor_tag'],
                tag['cor_texto']
            ))

        # Se chegou até aqui sem erros, commit da transação
        cnx.commit()
        
        return jsonify({"message": "Tags atualizadas com sucesso!"}), 200

    except Exception as e:
        # Se ocorrer qualquer erro, fazer rollback
        if cnx:
            cnx.rollback()
            
            # Tentar restaurar as tags antigas
            try:
                for tag in tags_antigas:
                    cursor.execute(insert_query, tag)
                cnx.commit()
            except:
                # Se falhar ao restaurar, pelo menos o banco estará vazio
                cnx.rollback()
        
        return jsonify({"error": str(e)}), 500

    finally:
        # Fechar cursor e conexão, independentemente do resultado
        if cursor:
            cursor.close()
        if cnx:
            cnx.close()
    
@app.route('/salvar-usuarios', methods=['POST'])
def salvar_usuarios():
    cnx = None
    cursor = None
    try:
        novos_usuarios = request.json
        cnx = get_db_connection()
        cursor = cnx.cursor()

        # Iniciar uma transação
        cnx.start_transaction()

        # Armazenar os usuários antigos antes de deletá-los
        cursor.execute("SELECT * FROM Usuarios")
        usuarios_antigos = cursor.fetchall()

        # Deletar todos os usuários existentes
        cursor.execute("DELETE FROM Usuarios")

        # Inserir os novos usuários
        insert_query = "INSERT INTO Usuarios (id_user, email, permissoes, senha) VALUES (%s, %s, %s, %s)"
        for usuario in novos_usuarios:
            cursor.execute(insert_query, (
                usuario['id_user'],
                usuario['email'],
                usuario['permissoes'],
                usuario['senha']  # Nota: Considere usar hash para senhas em produção
            ))

        # Se chegou até aqui sem erros, commit da transação
        cnx.commit()
        
        return jsonify({"message": "Usuários atualizados com sucesso!"}), 200

    except Exception as e:
        # Se ocorrer qualquer erro, fazer rollback
        if cnx:
            cnx.rollback()
            
            # Tentar restaurar os usuários antigos
            try:
                for usuario in usuarios_antigos:
                    cursor.execute(insert_query, usuario)
                cnx.commit()
            except:
                # Se falhar ao restaurar, pelo menos o banco estará vazio,
                # que é melhor do que ter dados parcialmente atualizados
                cnx.rollback()
        
        return jsonify({"error": str(e)}), 500

    finally:
        # Fechar cursor e conexão, independentemente do resultado
        if cursor:
            cursor.close()
        if cnx:
            cnx.close()

if __name__ == '__main__':
    app.run(debug=True)