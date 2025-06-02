import mysql.connector
from mysql.connector import pooling
import logging
import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime
import re

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Configuração do sistema
DB_HOST = os.environ.get('DB_HOST', '127.0.0.1')
DB_PORT = os.environ.get('DB_PORT', '3306')
DB_USER = os.environ.get('DB_USER', 'root')
DB_PASSWORD = os.environ.get('DB_PASSWORD', 'lcn2505@K')
DB_NAME = os.environ.get('DB_NAME', 'primare_ouvidoria')

try:
    connection_pool = mysql.connector.pooling.MySQLConnectionPool(
        pool_name="ouvidoria_pool",
        pool_size=5,
        host=DB_HOST,
        port=DB_PORT,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME
    )
    logger.info("Pool de conexões inicializado com sucesso")
except Exception as e:
    logger.error(f"Erro ao inicializar pool de conexões: {e}")
    raise

def get_db_connection():
    try:
        return connection_pool.get_connection()
    except Exception as e:
        logger.error(f"Erro ao obter conexão do pool: {e}")
        raise

def validate_input(data, required_fields=None, field_types=None):

    if required_fields:
        for field in required_fields:
            if field not in data or data[field] is None:
                return False, f"Campo obrigatório ausente: {field}"
    
    if field_types:
        for field, expected_type in field_types.items():
            if field in data and data[field] is not None:
                if not isinstance(data[field], expected_type):
                    return False, f"Tipo inválido para o campo {field}. Esperado: {expected_type.__name__}"
    
    return True, ""

def sanitize_input(value):
    if isinstance(value, str):
        return re.sub(r'[\'";\\]', '', value)
    return value

# VERIFICAR SE O USUÁRIO ESTÁ AUTORIZADO A ACESSAR O SISTEMA
@app.route('/verificar-login', methods=['POST'])
def verificar_login():

        data = request.json
        email = data.get('email')
        senha = data.get('senha')

        cnx = get_db_connection()
        cursor = cnx.cursor(dictionary=True)
        query = "SELECT * FROM Usuarios WHERE email = %s AND senha = %s"
        cursor.execute(query, (email, senha))
        resultado = cursor.fetchall()
        print(resultado)
        cursor.close()
        cnx.close()

        if len(resultado) > 0:
            return jsonify({"status":True, "permissoes":resultado[0]["permissoes"]})
        else:
            return jsonify({"status":False})

# Permitir criação de um novo usuário
@app.route('/ativar-usuarios', methods=['POST'])
def ativar_usuarios():
    try:
        cnx = get_db_connection()
        cursor = cnx.cursor(dictionary=True)
        
        query = "SELECT id_user, email, permissoes FROM Usuarios"  # Corrigido para 'Usuarios'
        cursor.execute(query)
        resultado = cursor.fetchall()
        
        return jsonify(resultado), 200
    except Exception as e:
        logger.error(f"Erro ao ativar usuários: {e}")
        return jsonify({"error": "Erro ao processar requisição"}), 500
    finally:
        if cursor:
            cursor.close()
        if cnx:
            cnx.close()

# Criar novas tags
@app.route('/ativar-tag', methods=['POST'])
def ativar_tags():
    try:
        cnx = get_db_connection()
        cursor = cnx.cursor(dictionary=True)
        
        query = "SELECT * FROM Tags"
        cursor.execute(query)
        resultado = cursor.fetchall()
        
        return jsonify(resultado), 200
    except Exception as e:
        logger.error(f"Erro ao ativar tags: {e}")
        return jsonify({"error": "Erro ao processar requisição"}), 500
    finally:
        if cursor:
            cursor.close()
        if cnx:
            cnx.close()

# Criar novos fluxos
@app.route('/ativar-fluxo', methods=['POST'])
def ativar_fluxo():
    try:
        cnx = get_db_connection()
        cursor = cnx.cursor(dictionary=True)
        
        query = "SELECT * FROM Fluxo ORDER BY posicao"
        cursor.execute(query)
        resultado = cursor.fetchall()
        
        return jsonify(resultado), 200
    except Exception as e:
        logger.error(f"Erro ao ativar fluxo: {e}")
        return jsonify({"error": "Erro ao processar requisição"}), 500
    finally:
        if cursor:
            cursor.close()
        if cnx:
            cnx.close()

# Ativar configuração do sistema
@app.route('/ativar-sistema', methods=['POST'])
def ativar_sistema():
    try:
        cnx = get_db_connection()
        cursor = cnx.cursor(dictionary=True)
        
        query = "SELECT * FROM Config"
        cursor.execute(query)
        resultado = cursor.fetchall()
        
        return jsonify(resultado), 200
    except Exception as e:
        logger.error(f"Erro ao ativar sistema: {e}")
        return jsonify({"error": "Erro ao processar requisição"}), 500
    finally:
        if cursor:
            cursor.close()
        if cnx:
            cnx.close()

# Ativar histórico de cartões  
@app.route('/ativar-historico', methods=['POST']) 
def ativar_historico(): 
    try:
        data = request.json
        valid, error_msg = validate_input(data, required_fields=['cardId'])
        if not valid:
            return jsonify({"error": error_msg}), 400
            
        card_id = data.get('cardId')
        
        cnx = get_db_connection()
        cursor = cnx.cursor(dictionary=True)
        
        query = "SELECT descricao, data_mudanca FROM Historico WHERE cartao = %s ORDER BY data_mudanca DESC"
        cursor.execute(query, (card_id,))
        
        resultado = cursor.fetchall()
        
        return jsonify(resultado), 200
    except Exception as e:
        logger.error(f"Erro ao ativar histórico: {e}")
        return jsonify({"error": "Erro ao processar requisição"}), 500
    finally:
        if cursor:
            cursor.close()
        if cnx:
            cnx.close()

# Ativar histórico de cartões excluídos ou finalizados
@app.route('/ativar-historico-exfin', methods=['POST']) 
def ativar_historico_exfin(): 
    try:
        data = request.json
        valid, error_msg = validate_input(data, required_fields=['cardId'])
        if not valid:
            return jsonify({"error": error_msg}), 400
            
        card_id = data.get('cardId')
        
        cnx = get_db_connection()
        cursor = cnx.cursor(dictionary=True)
        
        query = "SELECT descricao FROM HistoricoExcFin WHERE cartao = %s"
        cursor.execute(query, (card_id,))
        
        resultado = cursor.fetchall()
        
        return jsonify(resultado), 200
    except Exception as e:
        logger.error(f"Erro ao ativar histórico excluído/finalizado: {e}")
        return jsonify({"error": "Erro ao processar requisição"}), 500
    finally:
        if cursor:
            cursor.close()
        if cnx:
            cnx.close()

# Coletar cartões com base no status e permissões do usuário
@app.route('/coletar-cartoes', methods=['POST'])
def coletar_cartoes():
    try:
        data = request.json
        valid, error_msg = validate_input(data, required_fields=['status'])
        if not valid:
            return jsonify({"error": error_msg}), 400
            
        status = data.get('status')
        email = data.get('email')
        
        cnx = get_db_connection()
        cursor = cnx.cursor(dictionary=True)
        
        user_query = "SELECT permissoes FROM Usuarios WHERE email = %s"
        user_permission = None
        
        if email:
            cursor.execute(user_query, (email,))
            user_result = cursor.fetchone()
            if user_result:
                user_permission = user_result["permissoes"]
        
        if user_permission == "user" and status == "normal":
            query = """
            SELECT c.ID_Cartao, c.Cliente, c.Data_comentario, c.Data_conclusao, 
                   c.titulo_tag as ctitulo_tag, c.cor_tag as ccor_tag, c.cor_texto as ccor_texto,
                   c.Comentario, c.Etapa, c.Tag, c.Administrador, c.Nome_admin as nomeAdmin, 
                   f.nome as nome_fluxo, f.id_fluxo, t.titulo as tag_titulo, 
                   t.cor_tag, t.cor_texto as cor_texto_tag, u.email as admin_nome
            FROM Cartoes c
            LEFT JOIN Fluxo f ON c.Etapa = f.id_fluxo
            LEFT JOIN Tags t ON c.Tag = t.id_tag
            LEFT JOIN Usuarios u ON c.Administrador = u.id_user
            WHERE c.status = %s AND u.email = %s
            ORDER BY c.Data_comentario DESC
            """      
            cursor.execute(query, (status, email))
        else:
            query = """
            SELECT c.ID_Cartao, c.Cliente, c.Data_comentario, c.Data_conclusao, 
                   c.titulo_tag as ctitulo_tag, c.cor_tag as ccor_tag, c.cor_texto as ccor_texto,
                   c.Comentario, c.Etapa, c.Tag, c.Administrador, c.Nome_admin as nomeAdmin, 
                   f.nome as nome_fluxo, f.id_fluxo, t.titulo as tag_titulo, 
                   t.cor_tag, t.cor_texto as cor_texto_tag, u.email as admin_nome
            FROM Cartoes c
            LEFT JOIN Fluxo f ON c.Etapa = f.id_fluxo
            LEFT JOIN Tags t ON c.Tag = t.id_tag
            LEFT JOIN Usuarios u ON c.Administrador = u.id_user
            WHERE c.status = %s
            ORDER BY c.Data_comentario DESC
            """
            cursor.execute(query, (status,))

        cartoes = cursor.fetchall()

        for cartao in cartoes:
            if cartao['Data_comentario']:
                cartao['Data_comentario'] = cartao['Data_comentario'].strftime('%Y-%m-%d')
            if cartao['Data_conclusao']:
                cartao['Data_conclusao'] = cartao['Data_conclusao'].strftime('%Y-%m-%d')

        return jsonify(cartoes), 200
    except Exception as e:
        logger.error(f"Erro ao coletar cartões: {e}")
        return jsonify({"error": "Erro ao processar requisição"}), 500
    finally:
        if cursor:
            cursor.close()
        if cnx:
            cnx.close()

# Salvar fluxos
@app.route('/salvar-fluxos', methods=['POST'])
def salvar_fluxos():
    cnx = None
    cursor = None
    try:
        novos_fluxos = request.json
        if not isinstance(novos_fluxos, list):
            return jsonify({"error": "Formato inválido. Esperado uma lista de fluxos."}), 400
            
        cnx = get_db_connection()
        cursor = cnx.cursor(dictionary=True)

        cnx.start_transaction()

        cursor.execute("SELECT id_fluxo, nome FROM Fluxo")
        fluxos_existentes = {fluxo['id_fluxo']: fluxo['nome'] for fluxo in cursor.fetchall()}

        update_query = "UPDATE Fluxo SET nome = %s, posicao = %s WHERE id_fluxo = %s"
        insert_query = "INSERT INTO Fluxo (id_fluxo, nome, posicao) VALUES (%s, %s, %s)"
        
        for fluxo in novos_fluxos:
            if 'id_fluxo' not in fluxo or 'nome' not in fluxo or 'posicao' not in fluxo:
                cnx.rollback()
                return jsonify({"error": "Campos obrigatórios ausentes em um ou mais fluxos"}), 400
                
            nome = sanitize_input(fluxo['nome'])
            
            if fluxo['id_fluxo'] in fluxos_existentes:
                cursor.execute(update_query, (nome, fluxo['posicao'], fluxo['id_fluxo']))
            else:
                cursor.execute(insert_query, (fluxo['id_fluxo'], nome, fluxo['posicao']))

        fluxos_atuais = set(fluxo['id_fluxo'] for fluxo in novos_fluxos)
        fluxos_para_remover = set(fluxos_existentes.keys()) - fluxos_atuais
        
        if fluxos_para_remover:
            placeholders = ', '.join(['%s'] * len(fluxos_para_remover))
            check_query = f"SELECT Etapa FROM Cartoes WHERE Etapa IN ({placeholders})"
            cursor.execute(check_query, tuple(fluxos_para_remover))
            fluxos_em_uso = set(row['Etapa'] for row in cursor.fetchall())
            
            fluxos_para_remover = fluxos_para_remover - fluxos_em_uso
            
            if fluxos_para_remover:
                placeholders = ', '.join(['%s'] * len(fluxos_para_remover))
                delete_query = f"DELETE FROM Fluxo WHERE id_fluxo IN ({placeholders})"
                cursor.execute(delete_query, tuple(fluxos_para_remover))

        cnx.commit()
        
        return jsonify({"message": "Fluxos atualizados com sucesso!"}), 200

    except Exception as e:
        if cnx:
            cnx.rollback()
        logger.error(f"Erro ao salvar fluxos: {e}")
        return jsonify({"error": "Erro ao processar requisição"}), 500

    finally:
        if cursor:
            cursor.close()
        if cnx:
            cnx.close()

# Salvar tags
@app.route('/salvar-tags', methods=['POST'])
def salvar_tags():
    cnx = None
    cursor = None
    try:
        novas_tags = request.json
        if not isinstance(novas_tags, list):
            return jsonify({"error": "Formato inválido. Esperado uma lista de tags."}), 400
            
        cnx = get_db_connection()
        cursor = cnx.cursor(dictionary=True)

        cnx.start_transaction()

        cursor.execute("SELECT id_tag, titulo FROM Tags")
        tags_existentes = {tag['id_tag']: tag['titulo'] for tag in cursor.fetchall()}

        update_query = "UPDATE Tags SET titulo = %s, cor_tag = %s, cor_texto = %s WHERE id_tag = %s"
        insert_query = "INSERT INTO Tags (id_tag, titulo, cor_tag, cor_texto) VALUES (%s, %s, %s, %s)"
        
        for tag in novas_tags:
            if 'id_tag' not in tag or 'titulo' not in tag or 'cor_tag' not in tag or 'cor_texto' not in tag:
                cnx.rollback()
                return jsonify({"error": "Campos obrigatórios ausentes em uma ou mais tags"}), 400
                
            titulo = sanitize_input(tag['titulo'])
            cor_tag = sanitize_input(tag['cor_tag'])
            cor_texto = sanitize_input(tag['cor_texto'])
            
            if tag['id_tag'] in tags_existentes:
                cursor.execute(update_query, (titulo, cor_tag, cor_texto, tag['id_tag']))
            else:
                cursor.execute(insert_query, (tag['id_tag'], titulo, cor_tag, cor_texto))

        tags_atuais = set(tag['id_tag'] for tag in novas_tags)
        tags_para_remover = set(tags_existentes.keys()) - tags_atuais
        
        if tags_para_remover:
            placeholders = ', '.join(['%s'] * len(tags_para_remover))
            check_query = f"SELECT Tag FROM Cartoes WHERE Tag IN ({placeholders})"
            cursor.execute(check_query, tuple(tags_para_remover))
            tags_em_uso = set(row['Tag'] for row in cursor.fetchall())
            
            tags_para_remover = tags_para_remover - tags_em_uso
            
            if tags_para_remover:
                placeholders = ', '.join(['%s'] * len(tags_para_remover))
                delete_query = f"DELETE FROM Tags WHERE id_tag IN ({placeholders})"
                cursor.execute(delete_query, tuple(tags_para_remover))

        cnx.commit()
        
        return jsonify({"message": "Tags atualizadas com sucesso!"}), 200

    except Exception as e:
        if cnx:
            cnx.rollback()
        logger.error(f"Erro ao salvar tags: {e}")
        return jsonify({"error": "Erro ao processar requisição"}), 500

    finally:
        if cursor:
            cursor.close()
        if cnx:
            cnx.close()
    
# Salvar usuários
@app.route('/salvar-usuarios', methods=['POST'])
def salvar_usuarios():
    cnx = None
    cursor = None
    try:
        usuarios = request.json
        if not isinstance(usuarios, list):
            return jsonify({"error": "Formato inválido. Esperado uma lista de usuários."}), 400
            
        if not usuarios:
            return jsonify({"error": "Nenhum dado de usuário fornecido"}), 400

        cnx = get_db_connection()
        cursor = cnx.cursor(dictionary=True)

        cnx.start_transaction()

        for usuario in usuarios:
            if 'id_user' not in usuario:
                cnx.rollback()
                return jsonify({"error": "Campo id_user obrigatório ausente em um ou mais usuários"}), 400
                
            if 'email' in usuario:
                usuario['email'] = sanitize_input(usuario['email'])
            if 'senha' in usuario:
                usuario['senha'] = sanitize_input(usuario['senha'])
            if 'permissoes' in usuario:
                usuario['permissoes'] = sanitize_input(usuario['permissoes'])
                
            if usuario.get('permissoes') == "excluir":
                check_query = "SELECT ID_Cartao FROM Cartoes WHERE Administrador = %s LIMIT 1"
                cursor.execute(check_query, (usuario.get("id_user"),))
                if cursor.fetchone():
                    return jsonify({"error": f"Não é possível excluir o usuário pois ele está associado a cartões"}), 400
                    
                cursor.execute("DELETE FROM Usuarios WHERE id_user = %s", (usuario.get("id_user"),))
            else:
                cursor.execute("SELECT * FROM Usuarios WHERE id_user = %s", (usuario.get("id_user"),))
                old_user = cursor.fetchone()
                
                if old_user:
                    fields_to_update = []
                    values = []
                    
                    if 'email' in usuario and old_user['email'] != usuario['email']:
                        cursor.execute("SELECT id_user FROM Usuarios WHERE email = %s AND id_user != %s", 
                                      (usuario['email'], usuario.get("id_user")))
                        if cursor.fetchone():
                            cnx.rollback()
                            return jsonify({"error": f"O email {usuario['email']} já está em uso"}), 409
                            
                        fields_to_update.append("email = %s")
                        values.append(usuario['email'])
                        
                    if 'permissoes' in usuario and old_user["permissoes"] != usuario['permissoes']:
                        fields_to_update.append("permissoes = %s")
                        values.append(usuario['permissoes'])
                        
                    if 'senha' in usuario and old_user["senha"] != usuario['senha']:
                        fields_to_update.append("senha = %s")
                        values.append(usuario['senha'])
                    
                    if fields_to_update:
                        values.append(usuario.get("id_user"))
                        query = "UPDATE Usuarios SET " + ", ".join(fields_to_update) + " WHERE id_user = %s"
                        cursor.execute(query, tuple(values))
                else:
                    if 'email' not in usuario or 'senha' not in usuario or 'permissoes' not in usuario:
                        cnx.rollback()
                        return jsonify({"error": "Campos obrigatórios ausentes para novo usuário"}), 400
                        
                    cursor.execute("SELECT id_user FROM Usuarios WHERE email = %s", (usuario['email'],))
                    if cursor.fetchone():
                        cnx.rollback()
                        return jsonify({"error": f"O email {usuario['email']} já está em uso"}), 409
                        
                    query = "INSERT INTO Usuarios (email, senha, permissoes) VALUES (%s, %s, %s)"
                    cursor.execute(query, (usuario.get("email"), usuario.get("senha"), usuario.get("permissoes")))

        cnx.commit()

        return jsonify({"message": "Usuários atualizados com sucesso!"}), 200

    except Exception as e:
        if cnx:
            cnx.rollback()
        logger.error(f"Erro ao salvar usuários: {e}")
        return jsonify({"error": "Erro ao processar requisição"}), 500

    finally:
        if cursor:
            cursor.close()
        if cnx:
            cnx.close()

# Atualizar configurações do sistema
@app.route('/atualizar-sistema', methods=['POST'])
def atualizar_sistema():
    cnx = None
    cursor = None
    try:
        data = request.json
        valid, error_msg = validate_input(data, required_fields=['config1'])
        if not valid:
            return jsonify({"error": error_msg}), 400
            
        novo_estado = data.get('config1')

        cnx = get_db_connection()
        cursor = cnx.cursor()

        cnx.start_transaction()

        update_query = "UPDATE Config SET config1 = %s"
        cursor.execute(update_query, (novo_estado,))

        cnx.commit()
        
        return jsonify({"message": "Configurações atualizadas com sucesso!", "novo_estado": novo_estado}), 200

    except Exception as e:
        if cnx:
            cnx.rollback()
        logger.error(f"Erro ao atualizar sistema: {e}")
        return jsonify({"error": "Erro ao processar requisição"}), 500

    finally:
        if cursor:
            cursor.close()
        if cnx:
            cnx.close()

# Atualizar etapa do cartão
@app.route('/api/atualizar-etapa-cartao', methods=['POST'])
def atualizar_etapa_cartao():
    cnx = None
    cursor = None
    try:
        data = request.json
        valid, error_msg = validate_input(data, required_fields=['cardId', 'newFluxoId'])
        if not valid:
            return jsonify({"error": error_msg}), 400
            
        card_id = data.get('cardId')
        new_fluxo_id = data.get('newFluxoId')
        new_fluxo_name = data.get('nomeFluxo')
        email = data.get('login')

        cnx = get_db_connection()
        cursor = cnx.cursor(dictionary=True)

        cnx.start_transaction()

        check_query = "SELECT ID_Cartao FROM Cartoes WHERE ID_Cartao = %s"
        cursor.execute(check_query, (card_id,))
        if not cursor.fetchone():
            cnx.rollback()
            return jsonify({"error": "Cartão não encontrado"}), 404
            
        check_query = "SELECT id_fluxo FROM Fluxo WHERE id_fluxo = %s"
        cursor.execute(check_query, (new_fluxo_id,))
        if not cursor.fetchone():
            cnx.rollback()
            return jsonify({"error": "Fluxo não encontrado"}), 404

        update_query = "UPDATE Cartoes SET Etapa = %s WHERE ID_Cartao = %s"
        cursor.execute(update_query, (new_fluxo_id, card_id))
        
        horario = datetime.now().date()
        descricao = f'O cartão foi movido para a etapa "{new_fluxo_name}" por {email} no dia {horario}.'

        update_historico_query = "INSERT INTO Historico (cartao, descricao, data_mudanca) VALUES (%s, %s, %s)"
        cursor.execute(update_historico_query, (card_id, descricao, horario))

        cnx.commit()

        return jsonify({
            "message": "Etapa do cartão atualizada com sucesso",
            "cardId": card_id,
            "newFluxoId": new_fluxo_id,
            "nomeFluxo": new_fluxo_name
        }), 200

    except Exception as e:
        if cnx:
            cnx.rollback()
        logger.error(f"Erro ao atualizar etapa do cartão: {e}")
        return jsonify({"error": "Erro ao processar requisição"}), 500

    finally:
        if cursor:
            cursor.close()
        if cnx:
            cnx.close()

# Atualizar histórico de mensagens do cartão
@app.route('/atualizar-historico-msgs', methods=['POST'])
def atualizar_msg_historico():
    try:
        data = request.json
        valid, error_msg = validate_input(data, required_fields=['cardId', 'mensagem'])
        if not valid:
            return jsonify({"error": error_msg}), 400
            
        card_id = data.get('cardId')
        msg = sanitize_input(data.get('mensagem'))
        data_obs = datetime.now().date()

        cnx = get_db_connection()
        cursor = cnx.cursor(dictionary=True)

        check_query = "SELECT ID_Cartao FROM Cartoes WHERE ID_Cartao = %s"
        cursor.execute(check_query, (card_id,))
        if not cursor.fetchone():
            return jsonify({"error": "Cartão não encontrado"}), 404

        query = "INSERT INTO Historico (cartao, descricao, data_mudanca) VALUES (%s, %s, %s)"
        cursor.execute(query, (card_id, msg, data_obs))
        cnx.commit()

        return jsonify({"message": "Mensagem adicionada ao histórico com sucesso"}), 200
    except Exception as e:
        logger.error(f"Erro ao atualizar histórico de mensagens: {e}")
        return jsonify({"error": "Erro ao processar requisição"}), 500
    finally:
        if cursor:
            cursor.close()
        if cnx:
            cnx.close()

# Atualizar cartão
@app.route('/atualizar-tag-cartao', methods=['POST', 'OPTIONS'])
def atualizar_cartao():
    if request.method == 'OPTIONS':
        return '', 204
        
    try:
        data = request.json
        card_id = data.get('cardId')
        tag_id = data.get('tag')
        titulo_tag = data.get('titulo_tag')
        cor_tag = data.get('cor_tag')
        cor_texto = data.get('cor_texto')
        login = data.get('login')
        
        cnx = get_db_connection()
        cursor = cnx.cursor(dictionary=True)
        
        # Atualiza a tag do cartão com todas as informações
        update_query = """
            UPDATE Cartoes 
            SET Tag = %s, titulo_tag = %s, cor_tag = %s, cor_texto = %s 
            WHERE ID_Cartao = %s
        """
        cursor.execute(update_query, (tag_id, titulo_tag, cor_tag, cor_texto, card_id))
        
        # Adiciona ao histórico
        data_mudanca = datetime.now().date()
        historico_query = """
            INSERT INTO Historico (cartao, descricao, data_mudanca) 
            VALUES (%s, %s, %s)
        """
        descricao = f"Tag alterada para '{titulo_tag}' por {login}"
        cursor.execute(historico_query, (card_id, descricao, data_mudanca))
        
        cnx.commit()
        
        return jsonify({"message": "Tag atualizada com sucesso", "newTag": titulo_tag}), 200

    except Exception as e:
        logger.error(f"Erro ao atualizar tag: {e}")
        return jsonify({"error": str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if cnx:
            cnx.close()

#   Criar cartão no cadastrar.html
@app.route('/criar-cartao', methods=['POST'])
def criar_cartao():
        
        data = request.json
        nome = data.get('nome')
        msg = data.get('mensagem')
        data_obs = datetime.now().date()

        # Conexão com o banco de dados
        cnx = get_db_connection()
        cursor = cnx.cursor(dictionary=True)

        # Escolher primeira etapa do fluxo
        GetFluxo = "select * from Fluxo"
        cursor.execute(GetFluxo)
        FluxoUm = cursor.fetchall()[0]

        # Se não houver a tag "sem tag" na lista, ela será criada
        GetTags = "select * from Tags"
        cursor.execute(GetTags)
        tags = cursor.fetchall()

        SemTagID = ''
        sem_tag = True
        for tag in tags:
            if "sem" in tag['titulo'].lower() and "tag" in tag['titulo'].lower():
                sem_tag = False
                SemTagID = tag["id_tag"]
        
        if sem_tag:
            MakeTag = "INSERT INTO Tags (titulo, cor_tag, cor_texto) VALUES ('Sem Tag', '#333', 'F4F4F4')"
            cursor.execute(MakeTag)
            cnx.commit()

            GetSemTag = "select * from Tags where titulo = 'Sem Tag'"
            cursor.execute(GetSemTag)
            SemTagID = cursor.fetchall()[0]["id_tag"]

        # Inserir no banco de dados
        query = "INSERT INTO Cartoes (Cliente, Data_comentario, Comentario, Etapa, Tag, Administrador, status) VALUES (%s, %s, %s, %s, %s, %s, 'normal')"
        cursor.execute(query, (nome, data_obs, msg, FluxoUm["id_fluxo"], SemTagID, 1))
        cnx.commit()

        # Fechar o cursor e a conexão
        cursor.close()
        cnx.close()

        # Retornar uma resposta de sucesso
        return jsonify({"success": True}), 200

# Atualizar status do cartão
@app.route('/atualizar-status', methods=['POST'])
def atualizar_status():
    try:
        dados = request.get_json()

        card_id = dados.get('cardId')
        status = dados.get('status')
        titulo = dados.get('titulo')
        cor_tag = dados.get('cor_tag')
        cor_texto = dados.get('cor_texto')
        nome_admin = dados.get('Nome_admin')

        if not all([card_id, status, titulo, cor_tag, cor_texto, nome_admin]):
            return jsonify({"erro": "Dados incompletos"}), 400

        conexao = get_db_connection()
        cursor = conexao.cursor()

        # Verifica se o cartão existe
        cursor.execute("SELECT * FROM Cartoes WHERE ID_Cartao = %s", (card_id,))
        cartao = cursor.fetchone()

        if not cartao:
            return jsonify({"erro": "Cartão não encontrado"}), 404

        # Atualiza os campos que não são foreign keys
        update_query = """
            UPDATE Cartoes 
            SET status = %s, 
                titulo_tag = %s, 
                cor_tag = %s, 
                cor_texto = %s, 
                Nome_admin = %s 
            WHERE ID_Cartao = %s
        """

        valores = (status, titulo, cor_tag, cor_texto, nome_admin, card_id)

        cursor.execute(update_query, valores)
        conexao.commit()

        data_atual = datetime.now().strftime('%Y-%m-%d')
        descricao = f"O cartão foi movido para a etapa '{status}' por {nome_admin} no dia {data_atual}."

        insert_historico = """
            INSERT INTO Historico (cartao, descricao, data_mudanca)
            VALUES (%s, %s, %s)
        """
        cursor.execute(insert_historico, (card_id, descricao, datetime.now().date()))

        conexao.commit()

        return jsonify({"mensagem": "Cartão atualizado e histórico registrado com sucesso!"}), 200


    except Exception as e:
        print("Erro no MySQL:", e)
        return jsonify({"erro": str(e)}), 500

    except Exception as e:
        print("Erro geral:", e)
        return jsonify({"erro": str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if conexao:
            conexao.close()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    
    app.run(host='0.0.0.0', port=port)
