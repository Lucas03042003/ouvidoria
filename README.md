# Sistema de Ouvidoria (SAC)

Um sistema de Serviço de Atendimento ao Cliente (SAC) que permite gerenciar feedbacks e solicitações de clientes através de um quadro Kanban.

## 🚀 Funcionalidades

### Para Clientes
- Página de cadastro de solicitações (cadastrar.html)
- Formulário intuitivo para envio de comentários
- Campos para dados pessoais e mensagem

### Para Administradores
- Sistema de login com diferentes níveis de permissão
- Quadro Kanban para gerenciamento de solicitações (index.html)
- Acompanhamento do status das solicitações em colunas personalizáveis:
- Tags para priorização customizáveis
- Histórico de alterações por cartão

## 📁 Estrutura do Projeto

```
ouvidoria/
├── backend/
│   └── back_end.py    # API Flask com endpoints do sistema
├── database/
│   └── database.sql   # Esquema do banco de dados MySQL
├── frontend/
│   └── public/
│       ├── index.html     # Página principal com Kanban
│       ├── cadastrar.html # Formulário para clientes
│       └── src/
│           ├── components/  # JavaScript components
│           ├── styles/     # Arquivos CSS
│           └── config.js   # Configurações do frontend
└── app.spec.yaml      # Especificação para deploy
```

## 🛠️ Tecnologias Utilizadas

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Python com Flask
- **Banco de Dados**: MySQL
- **Deploy**: Railway e Vercel

## 💾 Banco de Dados

O sistema utiliza as seguintes tabelas:

- `Cartoes`: Armazena as solicitações dos clientes
- `Tags`: Níveis de prioridade
- `Usuarios`: Administradores do sistema
- `Fluxo`: Etapas do Kanban
- `Historico`: Registro de alterações
- `Config`: Configurações do sistema

## 🔒 Segurança

- Sistema de autenticação para área administrativa
- Diferentes níveis de permissão (admin, user)
- Sanitização de inputs
- Validação de dados

## 🚀 Deploy

O projeto está configurado para deploy no Railway através do arquivo `nixpacks.toml`, que define:

- Serviços Backend
- Variáveis de ambiente

## 🛣️ Fluxo do Sistema

1. Cliente acessa `cadastrar.html` e envia solicitação
2. Sistema cria cartão no banco de dados
3. Administrador acessa `index.html` e faz login
4. Cartões aparecem no Kanban para gerenciamento
5. Administrador pode:
   - Mover cartões entre colunas
   - Atribuir prioridades
   - Adicionar observações
   - Configurar o fluxo kanban
   - Cofigurar as tags disponíveis, sem que isso afete os cartões finalizados ou excluídos
   - Adicionar novos usuários ao sistema
   - Finalizar solicitações

## 🔧 Configuração

1. Clone o repositório
2. Execute o script do banco de dados
3. Configure o config.js para mudar o host do seu banco de dados
4. Instale as dependências do backend
5. Inicie o servidor Flask
