import mysql.connector
from mysql.connector import pooling
import logging
import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime
import re

# Configuração de logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Habilita CORS para todas as rotas

# Obter variáveis de ambiente ou usar valores padrão para desenvolvimento
DB_HOST = os.environ.get('DB_HOST', '127.0.0.1')
DB_PORT = os.environ.get('DB_PORT', '3306')
DB_USER = os.environ.get('DB_USER', 'root')
DB_PASSWORD = os.environ.get('DB_PASSWORD', 'lcn2505@K')
DB_NAME = os.environ.get('DB_NAME', 'primare_ouvidoria')

# Configuração do pool de conexões
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

# Função auxiliar para obter conexão do pool
def get_db_connection():
    try:
        return connection_pool.get_connection()
    except Exception as e:
        logger.error(f"Erro ao obter conexão do pool: {e}")
        raise

# Função para validar entrada
def validate_input(data, required_fields=None, field_types=None):
    """
    Valida os dados de entrada
    
    Args:
        data: Dicionário com os dados a serem validados
        required_fields: Lista de campos obrigatórios
        field_types: Dicionário com os tipos esperados para cada campo
    
    Returns:
        (bool, str): Tupla com resultado da validação e mensagem de erro
    """
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

# Função para sanitizar entrada
def sanitize_input(value):
    """
    Sanitiza valores de entrada para prevenir SQL injection e XSS
    """
    if isinstance(value, str):
        # Remove caracteres potencialmente perigosos
        return re.sub(r'[\'";\\]', '', value)
    return value

@app.route('/verificar-login', methods=['POST'])
def verificar_login():

        # Obtém os dados do corpo da requisição
        data = request.json
        email = data.get('email')
        senha = data.get('senha')

        cnx = get_db_connection()
        cursor = cnx.cursor(dictionary=True)
        query = "SELECT * FROM usuarios WHERE email = %s AND senha = %s"
        cursor.execute(query, (email, senha))
        resultado = cursor.fetchall()
        print(resultado)
        cursor.close()
        cnx.close()

        if len(resultado) > 0:
            return jsonify({"status":True, "permissoes":resultado[0]["permissoes"]})
        else:
            return jsonify({"status":False})

@app.route('/ativar-usuarios', methods=['POST'])
def ativar_usuarios():
    try:
        cnx = get_db_connection()
        cursor = cnx.cursor(dictionary=True)
        
        query = "SELECT id_user, email, permissoes FROM usuarios"
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

@app.route('/ativar-historico', methods=['POST']) 
def ativar_historico(): 
    try:
        # Validar entrada
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

@app.route('/ativar-historico-exfin', methods=['POST']) 
def ativar_historico_exfin(): 
    try:
        # Validar entrada
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

@app.route('/coletar-cartoes', methods=['POST'])
def coletar_cartoes():
    try:
        # Validar entrada
        data = request.json
        valid, error_msg = validate_input(data, required_fields=['status'])
        if not valid:
            return jsonify({"error": error_msg}), 400
            
        status = data.get('status')
        email = data.get('email')
        
        cnx = get_db_connection()
        cursor = cnx.cursor(dictionary=True)
        
        # Verificar permissões do usuário se email for fornecido
        user_query = "SELECT permissoes FROM usuarios WHERE email = %s"
        user_permission = None
        
        if email:
            cursor.execute(user_query, (email,))
            user_result = cursor.fetchone()
            if user_result:
                user_permission = user_result["permissoes"]
        
        # Consulta otimizada com JOIN e índices
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

        # Converter as datas para string
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

@app.route('/salvar-fluxos', methods=['POST'])
def salvar_fluxos():
    cnx = None
    cursor = None
    try:
        # Validar entrada
        novos_fluxos = request.json
        if not isinstance(novos_fluxos, list):
            return jsonify({"error": "Formato inválido. Esperado uma lista de fluxos."}), 400
            
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
            # Validar campos obrigatórios
            if 'id_fluxo' not in fluxo or 'nome' not in fluxo or 'posicao' not in fluxo:
                cnx.rollback()
                return jsonify({"error": "Campos obrigatórios ausentes em um ou mais fluxos"}), 400
                
            # Sanitizar entrada
            nome = sanitize_input(fluxo['nome'])
            
            if fluxo['id_fluxo'] in fluxos_existentes:
                # Atualizar fluxo existente
                cursor.execute(update_query, (nome, fluxo['posicao'], fluxo['id_fluxo']))
            else:
                # Inserir novo fluxo
                cursor.execute(insert_query, (fluxo['id_fluxo'], nome, fluxo['posicao']))

        # Remover fluxos que não estão mais presentes
        fluxos_atuais = set(fluxo['id_fluxo'] for fluxo in novos_fluxos)
        fluxos_para_remover = set(fluxos_existentes.keys()) - fluxos_atuais
        
        if fluxos_para_remover:
            # Verificar se algum fluxo a ser removido está em uso
            placeholders = ', '.join(['%s'] * len(fluxos_para_remover))
            check_query = f"SELECT Etapa FROM Cartoes WHERE Etapa IN ({placeholders})"
            cursor.execute(check_query, tuple(fluxos_para_remover))
            fluxos_em_uso = set(row['Etapa'] for row in cursor.fetchall())
            
            # Remover apenas os fluxos que não estão em uso
            fluxos_para_remover = fluxos_para_remover - fluxos_em_uso
            
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
        logger.error(f"Erro ao salvar fluxos: {e}")
        return jsonify({"error": "Erro ao processar requisição"}), 500

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
        # Validar entrada
        novas_tags = request.json
        if not isinstance(novas_tags, list):
            return jsonify({"error": "Formato inválido. Esperado uma lista de tags."}), 400
            
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
            # Validar campos obrigatórios
            if 'id_tag' not in tag or 'titulo' not in tag or 'cor_tag' not in tag or 'cor_texto' not in tag:
                cnx.rollback()
                return jsonify({"error": "Campos obrigatórios ausentes em uma ou mais tags"}), 400
                
            # Sanitizar entrada
            titulo = sanitize_input(tag['titulo'])
            cor_tag = sanitize_input(tag['cor_tag'])
            cor_texto = sanitize_input(tag['cor_texto'])
            
            if tag['id_tag'] in tags_existentes:
                cursor.execute(update_query, (titulo, cor_tag, cor_texto, tag['id_tag']))
            else:
                cursor.execute(insert_query, (tag['id_tag'], titulo, cor_tag, cor_texto))

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
        logger.error(f"Erro ao salvar tags: {e}")
        return jsonify({"error": "Erro ao processar requisição"}), 500

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
        # Validar entrada
        usuarios = request.json
        if not isinstance(usuarios, list):
            return jsonify({"error": "Formato inválido. Esperado uma lista de usuários."}), 400
            
        if not usuarios:
            return jsonify({"error": "Nenhum dado de usuário fornecido"}), 400

        cnx = get_db_connection()
        cursor = cnx.cursor(dictionary=True)

        # Iniciar uma transação
        cnx.start_transaction()

        for usuario in usuarios:
            # Validar campos obrigatórios
            if 'id_user' not in usuario:
                cnx.rollback()
                return jsonify({"error": "Campo id_user obrigatório ausente em um ou mais usuários"}), 400
                
            # Sanitizar entrada
            if 'email' in usuario:
                usuario['email'] = sanitize_input(usuario['email'])
            if 'senha' in usuario:
                usuario['senha'] = sanitize_input(usuario['senha'])
            if 'permissoes' in usuario:
                usuario['permissoes'] = sanitize_input(usuario['permissoes'])
                
            if usuario.get('permissoes') == "excluir":
                # Verificar se o usuário está associado a algum cartão
                check_query = "SELECT ID_Cartao FROM Cartoes WHERE Administrador = %s LIMIT 1"
                cursor.execute(check_query, (usuario.get("id_user"),))
                if cursor.fetchone():
                    return jsonify({"error": f"Não é possível excluir o usuário pois ele está associado a cartões"}), 400
                    
                cursor.execute("DELETE FROM Usuarios WHERE id_user = %s", (usuario.get("id_user"),))
            else:
                # Verificar se o usuário já existe
                cursor.execute("SELECT * FROM Usuarios WHERE id_user = %s", (usuario.get("id_user"),))
                old_user = cursor.fetchone()
                
                if old_user:
                    # Atualizar usuário existente
                    fields_to_update = []
                    values = []
                    
                    if 'email' in usuario and old_user['email'] != usuario['email']:
                        # Verificar se o novo email já existe
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
                    # Verificar campos obrigatórios para novo usuário
                    if 'email' not in usuario or 'senha' not in usuario or 'permissoes' not in usuario:
                        cnx.rollback()
                        return jsonify({"error": "Campos obrigatórios ausentes para novo usuário"}), 400
                        
                    # Verificar se o email já existe
                    cursor.execute("SELECT id_user FROM Usuarios WHERE email = %s", (usuario['email'],))
                    if cursor.fetchone():
                        cnx.rollback()
                        return jsonify({"error": f"O email {usuario['email']} já está em uso"}), 409
                        
                    # Inserir novo usuário
                    query = "INSERT INTO Usuarios (email, senha, permissoes) VALUES (%s, %s, %s)"
                    cursor.execute(query, (usuario.get("email"), usuario.get("senha"), usuario.get("permissoes")))

        # Se chegou até aqui sem erros, commit da transação
        cnx.commit()

        return jsonify({"message": "Usuários atualizados com sucesso!"}), 200

    except Exception as e:
        # Se ocorrer qualquer erro, fazer rollback
        if cnx:
            cnx.rollback()
        logger.error(f"Erro ao salvar usuários: {e}")
        return jsonify({"error": "Erro ao processar requisição"}), 500

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
        # Validar entrada
        data = request.json
        valid, error_msg = validate_input(data, required_fields=['config1'])
        if not valid:
            return jsonify({"error": error_msg}), 400
            
        novo_estado = data.get('config1')

        cnx = get_db_connection()
        cursor = cnx.cursor()

        # Iniciar uma transação
        cnx.start_transaction()

        # Atualizar o sistema com o valor recebido
        update_query = "UPDATE Config SET config1 = %s"
        cursor.execute(update_query, (novo_estado,))

        # Se chegou até aqui sem erros, commit da transação
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

@app.route('/api/atualizar-etapa-cartao', methods=['POST'])
def atualizar_etapa_cartao():
    cnx = None
    cursor = None
    try:
        # Validar entrada
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

        # Iniciar uma transação
        cnx.start_transaction()

        # Verificar se o cartão existe
        check_query = "SELECT ID_Cartao FROM Cartoes WHERE ID_Cartao = %s"
        cursor.execute(check_query, (card_id,))
        if not cursor.fetchone():
            cnx.rollback()
            return jsonify({"error": "Cartão não encontrado"}), 404
            
        # Verificar se o fluxo existe
        check_query = "SELECT id_fluxo FROM Fluxo WHERE id_fluxo = %s"
        cursor.execute(check_query, (new_fluxo_id,))
        if not cursor.fetchone():
            cnx.rollback()
            return jsonify({"error": "Fluxo não encontrado"}), 404

        # Atualizar a etapa do cartão
        update_query = "UPDATE Cartoes SET Etapa = %s WHERE ID_Cartao = %s"
        cursor.execute(update_query, (new_fluxo_id, card_id))
        
        horario = datetime.now().date()
        descricao = f'O cartão foi movido para a etapa "{new_fluxo_name}" por {email} no dia {horario}.'

        update_historico_query = "INSERT INTO Historico (cartao, descricao, data_mudanca) VALUES (%s, %s, %s)"
        cursor.execute(update_historico_query, (card_id, descricao, horario))

        # Commit da transação
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

@app.route('/atualizar-historico-msgs', methods=['POST'])
def atualizar_msg_historico():
    try:
        # Validar entrada
        data = request.json
        valid, error_msg = validate_input(data, required_fields=['cardId', 'mensagem'])
        if not valid:
            return jsonify({"error": error_msg}), 400
            
        card_id = data.get('cardId')
        msg = sanitize_input(data.get('mensagem'))
        data_obs = datetime.now().date()

        # Conexão com o banco de dados
        cnx = get_db_connection()
        cursor = cnx.cursor(dictionary=True)

        # Verificar se o cartão existe
        check_query = "SELECT ID_Cartao FROM Cartoes WHERE ID_Cartao = %s"
        cursor.execute(check_query, (card_id,))
        if not cursor.fetchone():
            return jsonify({"error": "Cartão não encontrado"}), 404

        # Inserir no banco de dados
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

@app.route('/atualizar-cartao', methods=['POST'])
def atualizar_cartao():
    try:
        # Validar entrada
        data = request.json
        valid, error_msg = validate_input(data, required_fields=['cardId'])
        if not valid:
            return jsonify({"error": error_msg}), 400
            
        card_id = data.get('cardId')
        
        # Sanitizar entradas
        cliente = sanitize_input(data.get('cliente', ''))
        comentario = sanitize_input(data.get('comentario', ''))
        tag_id = data.get('tag')
        titulo_tag = sanitize_input(data.get('titulo_tag', ''))
        cor_tag = sanitize_input(data.get('cor_tag', ''))
        cor_texto = sanitize_input(data.get('cor_texto', ''))
        
        # Conexão com o banco de dados
        cnx = get_db_connection()
        cursor = cnx.cursor(dictionary=True)
        
        # Verificar se o cartão existe
        check_query = "SELECT ID_Cartao FROM Cartoes WHERE ID_Cartao = %s"
        cursor.execute(check_query, (card_id,))
        if not cursor.fetchone():
            return jsonify({"error": "Cartão não encontrado"}), 404

        # Iniciar transação
        cnx.start_transaction()
        
        # Construir a query de atualização dinamicamente
        update_fields = []
        update_values = []
        
        if cliente:
            update_fields.append("Cliente = %s")
            update_values.append(cliente)
            
        if comentario:
            update_fields.append("Comentario = %s")
            update_values.append(comentario)
            
        if tag_id is not None:
            update_fields.append("Tag = %s")
            update_values.append(tag_id)
            
        if titulo_tag:
            update_fields.append("titulo_tag = %s")
            update_values.append(titulo_tag)
            
        if cor_tag:
            update_fields.append("cor_tag = %s")
            update_values.append(cor_tag)
            
        if cor_texto:
            update_fields.append("cor_texto = %s")
            update_values.append(cor_texto)
            
        if not update_fields:
            return jsonify({"message": "Nenhum campo para atualizar"}), 200
            
        # Adicionar o ID do cartão aos valores
        update_values.append(card_id)
        
        # Construir e executar a query
        update_query = f"UPDATE Cartoes SET {', '.join(update_fields)} WHERE ID_Cartao = %s"
        cursor.execute(update_query, tuple(update_values))
        
        # Registrar no histórico
        data_obs = datetime.now().date()
        descricao = f"O cartão foi atualizado em {data_obs}."
        
        historico_query = "INSERT INTO Historico (cartao, descricao, data_mudanca) VALUES (%s, %s, %s)"
        cursor.execute(historico_query, (card_id, descricao, data_obs))
        
        # Commit da transação
        cnx.commit()
        
        return jsonify({"message": "Cartão atualizado com sucesso"}), 200
    except Exception as e:
        if cnx:
            cnx.rollback()
        logger.error(f"Erro ao atualizar cartão: {e}")
        return jsonify({"error": "Erro ao processar requisição"}), 500
    finally:
        if cursor:
            cursor.close()
        if cnx:
            cnx.close()

@app.route('/criar-cartao', methods=['POST'])
def criar_cartao():
    try:
        # Validar entrada
        data = request.json
        required_fields = ['cliente', 'comentario', 'etapa', 'administrador', 'nome_admin']
        valid, error_msg = validate_input(data, required_fields=required_fields)
        if not valid:
            return jsonify({"error": error_msg}), 400
            
        # Sanitizar entradas
        cliente = sanitize_input(data.get('cliente'))
        comentario = sanitize_input(data.get('comentario'))
        etapa = data.get('etapa')
        tag = data.get('tag')
        titulo_tag = sanitize_input(data.get('titulo_tag', ''))
        cor_tag = sanitize_input(data.get('cor_tag', ''))
        cor_texto = sanitize_input(data.get('cor_texto', ''))
        administrador = data.get('administrador')
        nome_admin = sanitize_input(data.get('nome_admin'))
        status = "normal"  # Status padrão para novos cartões
        
        # Data atual para o comentário
        data_comentario = datetime.now().date()
        
        # Conexão com o banco de dados
        cnx = get_db_connection()
        cursor = cnx.cursor(dictionary=True)
        
        # Verificar se o administrador existe
        check_query = "SELECT id_user FROM Usuarios WHERE id_user = %s"
        cursor.execute(check_query, (administrador,))
        if not cursor.fetchone():
            return jsonify({"error": "Administrador não encontrado"}), 404
            
        # Verificar se a etapa existe
        check_query = "SELECT id_fluxo FROM Fluxo WHERE id_fluxo = %s"
        cursor.execute(check_query, (etapa,))
        if not cursor.fetchone():
            return jsonify({"error": "Etapa não encontrada"}), 404
            
        # Verificar se a tag existe (se fornecida)
        if tag:
            check_query = "SELECT id_tag FROM Tags WHERE id_tag = %s"
            cursor.execute(check_query, (tag,))
            if not cursor.fetchone():
                return jsonify({"error": "Tag não encontrada"}), 404
        
        # Iniciar transação
        cnx.start_transaction()
        
        # Inserir o novo cartão
        insert_query = """
        INSERT INTO Cartoes (Cliente, Data_comentario, Comentario, Etapa, Tag, 
                            titulo_tag, cor_tag, cor_texto, Administrador, Nome_admin, status)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        
        cursor.execute(insert_query, (
            cliente, data_comentario, comentario, etapa, tag,
            titulo_tag, cor_tag, cor_texto, administrador, nome_admin, status
        ))
        
        # Obter o ID do cartão inserido
        card_id = cursor.lastrowid
        
        # Registrar no histórico
        descricao = f"Cartão criado em {data_comentario}."
        
        historico_query = "INSERT INTO Historico (cartao, descricao, data_mudanca) VALUES (%s, %s, %s)"
        cursor.execute(historico_query, (card_id, descricao, data_comentario))
        
        # Commit da transação
        cnx.commit()
        
        return jsonify({
            "message": "Cartão criado com sucesso",
            "cardId": card_id
        }), 201
    except Exception as e:
        if cnx:
            cnx.rollback()
        logger.error(f"Erro ao criar cartão: {e}")
        return jsonify({"error": "Erro ao processar requisição"}), 500
    finally:
        if cursor:
            cursor.close()
        if cnx:
            cnx.close()

@app.route('/excluir-cartao', methods=['POST'])
def excluir_cartao():
    try:
        # Validar entrada
        data = request.json
        valid, error_msg = validate_input(data, required_fields=['cardId'])
        if not valid:
            return jsonify({"error": error_msg}), 400
            
        card_id = data.get('cardId')
        
        # Conexão com o banco de dados
        cnx = get_db_connection()
        cursor = cnx.cursor(dictionary=True)
        
        # Verificar se o cartão existe
        check_query = "SELECT ID_Cartao, status FROM Cartoes WHERE ID_Cartao = %s"
        cursor.execute(check_query, (card_id,))
        cartao = cursor.fetchone()
        
        if not cartao:
            return jsonify({"error": "Cartão não encontrado"}), 404
            
        if cartao['status'] != 'normal':
            return jsonify({"error": "Cartão já está excluído ou finalizado"}), 400
        
        # Iniciar transação
        cnx.start_transaction()
        
        # Atualizar o status do cartão para "excluido"
        update_query = "UPDATE Cartoes SET status = 'excluido' WHERE ID_Cartao = %s"
        cursor.execute(update_query, (card_id,))
        
        # Registrar no histórico
        data_obs = datetime.now().date()
        descricao = f"Cartão excluído em {data_obs}."
        
        historico_query = "INSERT INTO Historico (cartao, descricao, data_mudanca) VALUES (%s, %s, %s)"
        cursor.execute(historico_query, (card_id, descricao, data_obs))
        
        # Commit da transação
        cnx.commit()
        
        return jsonify({"message": "Cartão excluído com sucesso"}), 200
    except Exception as e:
        if cnx:
            cnx.rollback()
        logger.error(f"Erro ao excluir cartão: {e}")
        return jsonify({"error": "Erro ao processar requisição"}), 500
    finally:
        if cursor:
            cursor.close()
        if cnx:
            cnx.close()

@app.route('/finalizar-cartao', methods=['POST'])
def finalizar_cartao():
    try:
        # Validar entrada
        data = request.json
        valid, error_msg = validate_input(data, required_fields=['cardId'])
        if not valid:
            return jsonify({"error": error_msg}), 400
            
        card_id = data.get('cardId')
        
        # Conexão com o banco de dados
        cnx = get_db_connection()
        cursor = cnx.cursor(dictionary=True)
        
        # Verificar se o cartão existe
        check_query = "SELECT ID_Cartao, status FROM Cartoes WHERE ID_Cartao = %s"
        cursor.execute(check_query, (card_id,))
        cartao = cursor.fetchone()
        
        if not cartao:
            return jsonify({"error": "Cartão não encontrado"}), 404
            
        if cartao['status'] != 'normal':
            return jsonify({"error": "Cartão já está excluído ou finalizado"}), 400
        
        # Data atual para a conclusão
        data_conclusao = datetime.now().date()
        
        # Iniciar transação
        cnx.start_transaction()
        
        # Atualizar o status do cartão para "finalizado" e definir a data de conclusão
        update_query = "UPDATE Cartoes SET status = 'finalizado', Data_conclusao = %s WHERE ID_Cartao = %s"
        cursor.execute(update_query, (data_conclusao, card_id))
        
        # Registrar no histórico
        descricao = f"Cartão finalizado em {data_conclusao}."
        
        historico_query = "INSERT INTO Historico (cartao, descricao, data_mudanca) VALUES (%s, %s, %s)"
        cursor.execute(historico_query, (card_id, descricao, data_conclusao))
        
        # Commit da transação
        cnx.commit()
        
        return jsonify({
            "message": "Cartão finalizado com sucesso",
            "data_conclusao": data_conclusao.strftime('%Y-%m-%d')
        }), 200
    except Exception as e:
        if cnx:
            cnx.rollback()
        logger.error(f"Erro ao finalizar cartão: {e}")
        return jsonify({"error": "Erro ao processar requisição"}), 500
    finally:
        if cursor:
            cursor.close()
        if cnx:
            cnx.close()

@app.route('/restaurar-cartao', methods=['POST'])
def restaurar_cartao():
    try:
        # Validar entrada
        data = request.json
        valid, error_msg = validate_input(data, required_fields=['cardId'])
        if not valid:
            return jsonify({"error": error_msg}), 400
            
        card_id = data.get('cardId')
        
        # Conexão com o banco de dados
        cnx = get_db_connection()
        cursor = cnx.cursor(dictionary=True)
        
        # Verificar se o cartão existe
        check_query = "SELECT ID_Cartao, status FROM Cartoes WHERE ID_Cartao = %s"
        cursor.execute(check_query, (card_id,))
        cartao = cursor.fetchone()
        
        if not cartao:
            return jsonify({"error": "Cartão não encontrado"}), 404
            
        if cartao['status'] == 'normal':
            return jsonify({"error": "Cartão já está ativo"}), 400
        
        # Iniciar transação
        cnx.start_transaction()
        
        # Atualizar o status do cartão para "normal" e limpar a data de conclusão se estiver finalizado
        update_query = "UPDATE Cartoes SET status = 'normal', Data_conclusao = NULL WHERE ID_Cartao = %s"
        cursor.execute(update_query, (card_id,))
        
        # Registrar no histórico
        data_obs = datetime.now().date()
        descricao = f"Cartão restaurado em {data_obs}."
        
        historico_query = "INSERT INTO Historico (cartao, descricao, data_mudanca) VALUES (%s, %s, %s)"
        cursor.execute(historico_query, (card_id, descricao, data_obs))
        
        # Commit da transação
        cnx.commit()
        
        return jsonify({"message": "Cartão restaurado com sucesso"}), 200
    except Exception as e:
        if cnx:
            cnx.rollback()
        logger.error(f"Erro ao restaurar cartão: {e}")
        return jsonify({"error": "Erro ao processar requisição"}), 500
    finally:
        if cursor:
            cursor.close()
        if cnx:
            cnx.close()

@app.route('/health', methods=['GET'])
def health_check():
    """
    Endpoint para verificação de saúde da aplicação
    """
    try:
        # Verificar conexão com o banco de dados
        cnx = get_db_connection()
        cursor = cnx.cursor()
        cursor.execute("SELECT 1")
        cursor.fetchone()
        cursor.close()
        cnx.close()
        
        return jsonify({
            "status": "healthy",
            "database": "connected",
            "timestamp": datetime.now().isoformat()
        }), 200
    except Exception as e:
        logger.error(f"Health check falhou: {e}")
        return jsonify({
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }), 500

if __name__ == '__main__':
    # Obter porta do ambiente ou usar 5000 como padrão
    port = int(os.environ.get('PORT', 5000))
    
    # Em produção, usar gunicorn ou outro servidor WSGI
    # Em desenvolvimento, usar o servidor de desenvolvimento do Flask
    app.run(host='0.0.0.0', port=port)
