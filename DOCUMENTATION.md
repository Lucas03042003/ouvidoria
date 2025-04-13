# Documentação do Projeto Ouvidoria - Otimizado para DigitalOcean App Platform

## Visão Geral

Este documento descreve as otimizações realizadas no sistema de Ouvidoria para prepará-lo para implantação na DigitalOcean App Platform. O sistema consiste em um backend Flask com API REST, um frontend estático HTML/CSS/JS, e um banco de dados MySQL.

## Otimizações Realizadas

### 1. Segurança

- **Remoção de credenciais hardcoded**: Substituídas por variáveis de ambiente
- **Implementação de validação de entrada**: Adicionada validação para todas as rotas da API
- **Sanitização de dados**: Implementada para prevenir SQL injection e XSS
- **Tratamento adequado de erros**: Melhorado para não expor informações sensíveis

### 2. Performance

- **Pool de conexões**: Implementado para gerenciar conexões com o banco de dados
- **Otimização de consultas SQL**: Melhoradas para usar índices e joins eficientemente
- **Padronização de tratamento de erros**: Implementada em todas as rotas
- **Remoção de transações desnecessárias**: Otimizado para operações de leitura

### 3. Configuração

- **Correção de caminhos**: Alterados de Windows (backslash) para Unix (forward slash)
- **Variáveis de ambiente**: Configuradas para armazenar informações sensíveis
- **Healthcheck**: Adicionado endpoint para monitoramento da aplicação
- **Logging**: Implementado sistema de logging adequado para produção

### 4. Estrutura do Código

- **Organização de funções**: Melhorada para maior legibilidade e manutenção
- **Documentação de código**: Adicionados comentários explicativos
- **Padronização de estilo**: Aplicada em todo o código

## Arquitetura do Sistema

### Backend (Flask)

- **Endpoints da API**:
  - `/ativar-usuarios`: Retorna lista de usuários
  - `/ativar-tag`: Retorna lista de tags
  - `/ativar-fluxo`: Retorna lista de fluxos
  - `/ativar-sistema`: Retorna configurações do sistema
  - `/ativar-historico`: Retorna histórico de um cartão
  - `/coletar-cartoes`: Retorna cartões filtrados por status
  - `/salvar-fluxos`: Atualiza fluxos de trabalho
  - `/salvar-tags`: Atualiza tags
  - `/salvar-usuarios`: Atualiza usuários
  - `/atualizar-sistema`: Atualiza configurações do sistema
  - `/api/atualizar-etapa-cartao`: Atualiza etapa de um cartão
  - `/atualizar-historico-msgs`: Adiciona mensagem ao histórico
  - `/atualizar-cartao`: Atualiza informações de um cartão
  - `/criar-cartao`: Cria novo cartão
  - `/excluir-cartao`: Marca cartão como excluído
  - `/finalizar-cartao`: Marca cartão como finalizado
  - `/restaurar-cartao`: Restaura cartão excluído/finalizado
  - `/health`: Endpoint para verificação de saúde da aplicação

### Frontend (HTML/CSS/JS)

- **Páginas**:
  - `index.html`: Página principal com login e Kanban
  - `cadastrar.html`: Página para cadastro de novos cartões

- **Componentes**:
  - Kanban interativo com drag-and-drop
  - Sistema de login
  - Gerenciamento de tags
  - Gerenciamento de fluxos
  - Gerenciamento de usuários

### Banco de Dados (MySQL)

- **Tabelas**:
  - `Config`: Configurações do sistema
  - `Tags`: Tags para categorização de cartões
  - `Usuarios`: Usuários do sistema
  - `Fluxo`: Etapas do fluxo de trabalho
  - `Cartoes`: Cartões de feedback/reclamações
  - `Historico`: Histórico de alterações nos cartões

## Configuração para DigitalOcean App Platform

O arquivo `app.spec.yaml` foi atualizado para configurar corretamente a aplicação para implantação na DigitalOcean App Platform, incluindo:

- Configuração de serviços (API e frontend)
- Variáveis de ambiente para conexão com o banco de dados
- Configuração de healthcheck
- Configuração de CORS
- Configuração do banco de dados MySQL

## Instruções de Implantação

Consulte o documento separado com instruções detalhadas para:
1. Testar a aplicação localmente
2. Implantar na DigitalOcean App Platform

## Próximos Passos Recomendados

1. **Implementar autenticação mais robusta**: Considerar JWT ou OAuth
2. **Adicionar testes automatizados**: Implementar testes unitários e de integração
3. **Melhorar a interface do usuário**: Modernizar o design e melhorar a experiência do usuário
4. **Implementar backup automático**: Configurar backup regular do banco de dados
5. **Configurar CI/CD**: Automatizar o processo de implantação
