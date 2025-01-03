import mysql.connector
import logging
from flask import Flask, jsonify, request
import flask_cors
from datetime import datetime

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

@app.route('/ativar-historico', methods=['POST']) 
def ativar_historico(): 
	cnx = None 
	cursor = None 

	data = request.json 
	card_id = data.get('cardId') 
	
	cnx = get_db_connection() 
	cursor = cnx.cursor(dictionary=True) 

	query = "SELECT descricao FROM Historico WHERE cartao = %s" 
	cursor.execute(query, (card_id,))
	
	resultado = cursor.fetchall() 
	cursor.close() 
	cnx.close() 
	
	return jsonify(resultado), 200

@app.route('/coletar-cartoes', methods=['POST'])
def coletar_cartoes():
    cnx = None
    cursor = None
    try:
        cnx = get_db_connection()
        cursor = cnx.cursor(dictionary=True)

        query = """
        SELECT c.ID_Cartao, c.Cliente, c.Data_comentario, c.Comentario, 
               c.Etapa, c.Tag, c.Administrador, f.nome as nome_fluxo, f.id_fluxo, t.titulo as tag_titulo, 
               t.cor_tag, t.cor_texto as cor_texto_tag, u.email as admin_nome
        FROM Cartoes c
        LEFT JOIN Fluxo f ON c.Etapa = f.id_fluxo
        LEFT JOIN Tags t ON c.Tag = t.id_tag
        LEFT JOIN Usuarios u ON c.Administrador = u.id_user
        """
        cursor.execute(query)
        cartoes = cursor.fetchall()

        # Converter as datas para string
        for cartao in cartoes:
            cartao['Data_comentario'] = cartao['Data_comentario'].strftime('%Y-%m-%d')

        return jsonify(cartoes), 200

    except mysql.connector.Error as e:
        print(f"Database error: {e}")
        return jsonify({"error": f"Erro de banco de dados: {str(e)}"}), 500

    except Exception as e:
        print(f"Unexpected error: {e}")
        return jsonify({"error": f"Erro inesperado: {str(e)}"}), 500

    finally:
        if cursor:
            cursor.close()
        if cnx:
            cnx.close()

@app.route('/salvar-fluxos', methods=['POST'])
def salvar_fluxos():
    cnx = None
    cursor = None
    try:
        novos_fluxos = request.json
        cnx = get_db_connection()
        cursor = cnx.cursor(dictionary=True)

        # Iniciar uma transação
        cnx.start_transaction()

        # Buscar fluxos existentes
        cursor.execute("SELECT id_fluxo, nome FROM Fluxo")
        fluxos_existentes = {fluxo['id_fluxo']: fluxo['nome'] for fluxo in cursor.fetchall()}

        # Atualizar fluxos existentes e inserir novos
        update_query = "UPDATE Fluxo SET nome = %s, posicao = %s WHERE id_fluxo = %s"
        insert_query = "INSERT INTO Fluxo (id_fluxo, nome, posicao) VALUES (%s, %s, %s)"
        
        for fluxo in novos_fluxos:
            if fluxo['id_fluxo'] in fluxos_existentes:
                # Atualizar fluxo existente
                cursor.execute(update_query, (fluxo['nome'], fluxo['posicao'], fluxo['id_fluxo']))
            else:
                # Inserir novo fluxo
                cursor.execute(insert_query, (fluxo['id_fluxo'], fluxo['nome'], fluxo['posicao']))

        # Remover fluxos que não estão mais presentes
        fluxos_atuais = set(fluxo['id_fluxo'] for fluxo in novos_fluxos)
        fluxos_para_remover = set(fluxos_existentes.keys()) - fluxos_atuais
        
        if fluxos_para_remover:
            placeholders = ', '.join(['%s'] * len(fluxos_para_remover))
            delete_query = f"DELETE FROM Fluxo WHERE id_fluxo IN ({placeholders})"
            cursor.execute(delete_query, tuple(fluxos_para_remover))

        # Se chegou até aqui sem erros, commit da transação
        cnx.commit()
        
        return jsonify({"message": "Fluxos atualizados com sucesso!"}), 200

    except Exception as e:
        # Se ocorrer qualquer erro, fazer rollback
        if cnx:
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
        cursor = cnx.cursor(dictionary=True)

        # Iniciar uma transação
        cnx.start_transaction()

        # Buscar tags existentes
        cursor.execute("SELECT id_tag, titulo FROM Tags")
        tags_existentes = {tag['id_tag']: tag['titulo'] for tag in cursor.fetchall()}

        # Atualizar tags existentes e inserir novas
        update_query = "UPDATE Tags SET titulo = %s, cor_tag = %s, cor_texto = %s WHERE id_tag = %s"
        insert_query = "INSERT INTO Tags (id_tag, titulo, cor_tag, cor_texto) VALUES (%s, %s, %s, %s)"
        
        for tag in novas_tags:
            if tag['id_tag'] in tags_existentes:
                cursor.execute(update_query, (tag['titulo'], tag['cor_tag'], tag['cor_texto'], tag['id_tag']))
            else:
                cursor.execute(insert_query, (tag['id_tag'], tag['titulo'], tag['cor_tag'], tag['cor_texto']))

        # Remover tags que não estão mais presentes
        tags_atuais = set(tag['id_tag'] for tag in novas_tags)
        tags_para_remover = set(tags_existentes.keys()) - tags_atuais
        
        if tags_para_remover:
            # Verificar se alguma tag a ser removida está em uso
            placeholders = ', '.join(['%s'] * len(tags_para_remover))
            check_query = f"SELECT Tag FROM Cartoes WHERE Tag IN ({placeholders})"
            cursor.execute(check_query, tuple(tags_para_remover))
            tags_em_uso = set(row['Tag'] for row in cursor.fetchall())
            
            # Remover apenas as tags que não estão em uso
            tags_para_remover = tags_para_remover - tags_em_uso
            
            if tags_para_remover:
                placeholders = ', '.join(['%s'] * len(tags_para_remover))
                delete_query = f"DELETE FROM Tags WHERE id_tag IN ({placeholders})"
                cursor.execute(delete_query, tuple(tags_para_remover))

        # Commit da transação
        cnx.commit()
        
        return jsonify({"message": "Tags atualizadas com sucesso!"}), 200

    except Exception as e:
        if cnx:
            cnx.rollback()
        return jsonify({"error": str(e)}), 500

    finally:
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

@app.route('/atualizar-sistema', methods=['POST'])
def atualizar_sistema():
    cnx = None
    cursor = None
    try:
        novo_estado = request.json.get('config1')
        if novo_estado is None:
            return jsonify({"error": "config1 não fornecido no corpo da requisição"}), 400

        cnx = get_db_connection()
        cursor = cnx.cursor()

        # Iniciar uma transação
        cnx.start_transaction()

        # Atualizar o sistema com o valor recebido
        update_query = "UPDATE Config SET config1 = %s"
        cursor.execute(update_query, (novo_estado,))

        # Se chegou até aqui sem erros, commit da transação
        cnx.commit()
        
        return jsonify({"message": "Configurações atualizado com sucesso!", "novo_estado": novo_estado}), 200

    except mysql.connector.Error as e:
        logging.error(f"Database error: {e}")
        if cnx:
            cnx.rollback()
        return jsonify({"error": f"Erro de banco de dados: {str(e)}"}), 500

    except Exception as e:
        logging.error(f"Unexpected error: {e}")
        if cnx:
            cnx.rollback()
        return jsonify({"error": f"Erro inesperado: {str(e)}"}), 500

    finally:
        if cursor:
            cursor.close()
        if cnx:
            cnx.close()

@app.route('/api/atualizar-etapa-cartao', methods=['POST'])
def atualizar_etapa_cartao():
    cnx = None
    cursor = None
    try:
        data = request.json
        card_id = data.get('cardId')
        new_fluxo_id = data.get('newFluxoId')
        new_fluxo_name = data.get('nomeFluxo')

        if not card_id or not new_fluxo_id:
            return jsonify({"error": "Dados incompletos"}), 400

        cnx = get_db_connection()
        cursor = cnx.cursor(dictionary=True)

        # Iniciar uma transação
        cnx.start_transaction()

        # Atualizar a etapa do cartão
        update_query = "UPDATE Cartoes SET Etapa = %s WHERE ID_Cartao = %s"
        cursor.execute(update_query, (new_fluxo_id, card_id))

        # Verificar se a atualização foi bem-sucedida
        if cursor.rowcount == 0:
            cnx.rollback()
            return jsonify({"error": "Cartão não encontrado ou nenhuma alteração feita"}), 404
        
        horario = datetime.now().date()
        descricao = f'O cartão foi movido para a etapa "{new_fluxo_name}" no dia {horario}.'

        update_historico_query = "INSERT INTO Historico (cartao, descricao, data_mudanca) VALUES (%s, %s, %s)"
        cursor.execute(update_historico_query, (card_id,descricao,horario))

        # Commit da transação
        cnx.commit()

        return jsonify({
            "message": "Etapa do cartão atualizada com sucesso",
            "cardId": card_id,
            "newFluxoId": new_fluxo_id,
            "nomeFluxo": new_fluxo_name
        }), 200

    except mysql.connector.Error as e:
        logging.error(f"Database error: {e}")
        if cnx:
            cnx.rollback()
        return jsonify({"error": f"Erro de banco de dados: {str(e)}"}), 500

    except Exception as e:
        logging.error(f"Unexpected error: {e}")
        if cnx:
            cnx.rollback()
        return jsonify({"error": f"Erro inesperado: {str(e)}"}), 500

    finally:
        if cursor:
            cursor.close()
        if cnx:
            cnx.close()

@app.route('/atualizar-historico-msgs', methods=['POST'])
def atualizar_msg_historico():
    try:
        data = request.json
        card_id = data.get('cardId')
        msg = data.get('mensagem')
        data_obs = datetime.now().date()

        # Conexão com o banco de dados
        cnx = get_db_connection()
        cursor = cnx.cursor(dictionary=True)

        # Inserir no banco de dados
        query = "INSERT INTO Historico (cartao, descricao, data_mudanca) VALUES (%s, %s, %s)"
        cursor.execute(query, (card_id, msg, data_obs))
        
        # Confirmar a transação
        cnx.commit()

        # Fechar o cursor e a conexão
        cursor.close()
        cnx.close()

        # Retornar uma resposta de sucesso
        return jsonify({"success": True, "message": "Histórico atualizado com sucesso"}), 200

    except Exception as e:
        # Tratar erros
        return jsonify({"success": False, "error": str(e)}), 500
    
@app.route('/atualizar-tag-cartao', methods=['POST'])
def atualizar_tag_cartao():
    cnx = None
    cursor = None
    try:
        data = request.json
        card_id = data.get('cardId')
        new_tag = data.get('newTag')

        if not card_id or not new_tag:
            return jsonify({"error": "Dados incompletos"}), 400

        cnx = get_db_connection()
        cursor = cnx.cursor(dictionary=True)

        # Iniciar uma transação
        cnx.start_transaction()

        # Atualizar a etapa do cartão
        update_query = "UPDATE Cartoes SET Tag = (select id_tag from Tags where titulo=%s) where ID_Cartao = %s;"
        cursor.execute(update_query, (new_tag, card_id))

        # Verificar se a atualização foi bem-sucedida
        if cursor.rowcount == 0:
            cnx.rollback()
            return jsonify({"error": "Cartão não encontrado ou nenhuma alteração feita"}), 404

        dia = datetime.now().date()
        description = f"A tag do cartão foi modificada para {new_tag} no dia {dia}."

        # Atualizar a etapa do cartão
        update_query = "INSERT INTO Historico (cartao, descricao, data_mudanca) VALUES (%s, %s, %s);"
        cursor.execute(update_query, (card_id, description, dia))

        # Commit da transação
        cnx.commit()

        return jsonify({
            "message": "Responsável do cartão atualizada com sucesso",
            "cardId": card_id,
            "newTag": new_tag
        }), 200

    except mysql.connector.Error as e:
        logging.error(f"Database error: {e}")
        if cnx:
            cnx.rollback()
        return jsonify({"error": f"Erro de banco de dados: {str(e)}"}), 500

    except Exception as e:
        logging.error(f"Unexpected error: {e}")
        if cnx:
            cnx.rollback()
        return jsonify({"error": f"Erro inesperado: {str(e)}"}), 500

    finally:
        if cursor:
            cursor.close()
        if cnx:
            cnx.close()

@app.route('/atualizar-responsavel', methods=['POST'])
def atualizar_responsavel():
    cnx = None
    cursor = None
    try:
        data = request.json
        card_id = data.get('cardId')
        new_responsavel = data.get('newResponsavel')

        if not card_id or not new_responsavel:
            return jsonify({"error": "Dados incompletos"}), 400

        cnx = get_db_connection()
        cursor = cnx.cursor(dictionary=True)

        # Iniciar uma transação
        cnx.start_transaction()

        # Atualizar a etapa do cartão
        update_query = "UPDATE Cartoes SET Administrador = (select id_user from Usuarios where email=%s) where ID_Cartao = %s;"
        cursor.execute(update_query, (new_responsavel, card_id))

        # Verificar se a atualização foi bem-sucedida
        if cursor.rowcount == 0:
            cnx.rollback()
            return jsonify({"error": "Cartão não encontrado ou nenhuma alteração feita"}), 404

        dia = datetime.now().date()
        description = f"O responsável do cartão foi modificada para {new_responsavel} no dia {dia}."

        # Atualizar a etapa do cartão
        update_query = "INSERT INTO Historico (cartao, descricao, data_mudanca) VALUES (%s, %s, %s);"
        cursor.execute(update_query, (card_id, description, dia))

        # Commit da transação
        cnx.commit()

        return jsonify({
            "message": "Responsável do cartão atualizada com sucesso",
            "cardId": card_id,
            "newResponsavel": new_responsavel
        }), 200

    except mysql.connector.Error as e:
        logging.error(f"Database error: {e}")
        if cnx:
            cnx.rollback()
        return jsonify({"error": f"Erro de banco de dados: {str(e)}"}), 500

    except Exception as e:
        logging.error(f"Unexpected error: {e}")
        if cnx:
            cnx.rollback()
        return jsonify({"error": f"Erro inesperado: {str(e)}"}), 500

    finally:
        if cursor:
            cursor.close()
        if cnx:
            cnx.close()
            
@app.route('/api/cartoes-exc-fin', methods=['GET'])
def fetch_cartoes_exc_fin():
    try:
        # Obter o parâmetro de status da URL (valor padrão: None)
        status = request.args.get('status', None)

        # Conexão com o banco de dados
        cnx = get_db_connection()
        cursor = cnx.cursor(dictionary=True)

        # Query SQL com filtro de status, se fornecido
        if status:
            query = "SELECT * FROM CartoesExcFin WHERE status = %s"
            cursor.execute(query, (status,))
        else:
            query = "SELECT * FROM CartoesExcFin"
            cursor.execute(query)

        # Obter os resultados
        resultado = cursor.fetchall()

        # Fechar conexões
        cursor.close()
        cnx.close()

        # Retornar os resultados como JSON
        return jsonify(resultado), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
if __name__ == '__main__':
    app.run(debug=True)