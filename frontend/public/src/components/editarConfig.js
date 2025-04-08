// Abrir a aba de configurações
window.ativarConfig = function()  {
    const elemento = document.querySelector('.container');
    elemento.style.filter = 'blur(5px)';
    
    // Criar um overlay para prevenir interações
    const overlay = document.createElement('div');
    overlay.id = 'overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'; // Fundo semi-transparente
    overlay.style.zIndex = '1000'; // Certifique-se de que está acima de outros elementos
    
    // Adicionar o overlay ao body
    document.body.appendChild(overlay);
    
    // Criar e exibir o painel de configurações
    const configPanel = document.createElement('div');
    configPanel.className = 'body-config';
    configPanel.id = 'configPanel';
    configPanel.style.position = 'fixed';
    // configPanel.style.display = 'flex';
    configPanel.style.top = '50%';
    configPanel.style.left = '50%';
    configPanel.style.height = '50%';
    configPanel.style.width = '40%';
    configPanel.style.transform = 'translate(-50%, -50%)';
    configPanel.style.backgroundColor = '#333';
    configPanel.style.color = '#807E7E';
    // configPanel.style.padding = '20px';
    configPanel.style.borderRadius = '5px';
    configPanel.style.zIndex = '1001'; // Acima do overlay
    configPanel.innerHTML = `
        <aside class="sidebar-config">
          <button class="menu-item-config active" onclick="ativarFluxo()" id="btn-fluxo">Fluxo</button>
          <button class="menu-item-config" onclick="ativarSistema()" id="btn-sis">Sistema</button>
          <button class="menu-item-config" onclick="ativarUsuarios()" id="btn-users">Usuários</button>
          <button class="menu-item-config" onclick="ativarTags()" id="btn-tags">Tags</button>
        </aside>
        <main class="main-config" id="main_config">
        </main>
    `;

    document.body.appendChild(configPanel);

    const configMain = document.getElementById('main_config');
    configMain.innerHTML = `
        <div class="content-config">
            <a class="config-exit" id="closeConfig">x</a>
        </div>
        <div class="task-list" id="task-list"></div>
    `;
  
    fetchFluxos(true);
  
    document.getElementById('closeConfig').addEventListener('click', desativarConfig);
};

// Fechar aba de configurações
function desativarConfig() {
    const elemento = document.querySelector('.container');
    elemento.style.filter = 'none';

    // Remover o overlay
    const overlay = document.getElementById('overlay');
    if (overlay) {
        overlay.remove();
    }

    // Remover o painel de configurações
    const configPanel = document.getElementById('configPanel');
    if (configPanel) {
        configPanel.remove();
    }
};

// Remove a classe 'active' de todos os botões
function resetarAtivo() {
    const botoes = document.querySelectorAll('.menu-item-config');
    botoes.forEach((botao) => {
      botao.className = 'menu-item-config'; // Remove a classe 'active'
    });
  };

////////////////////////////////////////////////////////////////////
//Fluxos
////////////////////////////////////////////////////////////////////

// Função para ativar o botão "Fluxo"
function ativarFluxo() {
    const btnFluxo = document.getElementById('btn-fluxo');
    if (btnFluxo.classList.contains('active')) return;
  
    resetarAtivo();
    btnFluxo.classList.add('active');
  
    const configMain = document.getElementById('main_config');
    configMain.innerHTML = `
        <div class="content-config">
            <a class="config-exit" id="closeConfig">x</a>
        </div>
        <div class="task-list" id="task-list"></div>
    `;
  
    fetchFluxos(true);
  
    document.getElementById('closeConfig').addEventListener('click', desativarConfig);
};

// Renderizar os fluxos conforme o que foi recebido da base de dados
window.renderizarFluxos = function(todosOsFluxos) {
    const taskList = document.getElementById('task-list');
    
    // Ordenar fluxos por posição
    todosOsFluxos.sort((a, b) => a.posicao - b.posicao);
  
    const fluxosHTML = todosOsFluxos.map(({ id_fluxo, nome }) => `
        <div class="task-item" data-id="${id_fluxo}">
            <span contenteditable="true">${nome}</span>
            <a class="delete-button">×</a>
        </div>
    `).join('');
  
    taskList.innerHTML = fluxosHTML + '<div class="lista-actions"><a class="add-task"">Adicionar</a><a class="save-button">Salvar</a></div>';
  
    // Adicionar event listeners para os botões de deletar
    document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', function() {
            const idFluxo = parseInt(this.closest('.task-item').dataset.id);
            removerFluxo(idFluxo, todosOsFluxos);
        });
    });

    // Adicionar event listeners para os botões de salvar
    document.querySelectorAll('.save-button').forEach(button => {
        button.addEventListener('click', function() {
            salvarTudo(todosOsFluxos);
        });
    });
  
    // Adicionar event listener para o botão "Adicionar"
    document.querySelector('.add-task').addEventListener('click', adicionarNovoFluxo);
};

// Adicionar um novo fluxo ao clicar no botão  
async function adicionarNovoFluxo() {

    const todosOsFluxos = await fetchFluxos(false);

    document.querySelectorAll('.task-item').forEach(item => {
      const idFluxo = parseInt(item.dataset.id);
      const nome = item.querySelector('span').textContent;
      const fluxo = todosOsFluxos.find(f => f.id_fluxo === idFluxo);
      if (fluxo) {
          fluxo.nome = nome;
      };
    });
  
    const novoId = todosOsFluxos.length > 0 ? Math.max(...todosOsFluxos.map(f => f.id_fluxo)) + 1 : 1;
    const novaPosicao = todosOsFluxos.length > 0 ? Math.max(...todosOsFluxos.map(f => f.posicao)) + 1 : 1;
    const novoFluxo = {
        id_fluxo: novoId,
        nome: 'Novo Fluxo',
        posicao: novaPosicao
    };
  
    todosOsFluxos.push(novoFluxo);
    renderizarFluxos(todosOsFluxos);
};
  
// Remover fluxo
async function removerFluxo(idFluxo, todosOsFluxos) {
    const todosOsCartoes = await fetchCartoes(false, "normal");
    const cartoesEmFluxo = todosOsCartoes.filter(cartao => {
      console.log('Verificando cartão:', cartao);
      return cartao.id_fluxo == idFluxo; 
    });
  
    if (cartoesEmFluxo.length > 0) {
      alert(`Não é possível excluir esta tag. Ela está possui ${cartoesEmFluxo.length} cartão(ões).`);
    } else {
      if (confirm('Tem certeza que deseja excluir essa etapa?')) {
        todosOsFluxos = todosOsFluxos.filter(fluxo => fluxo.id_fluxo !== idFluxo);
        renderizarFluxos(todosOsFluxos);
      };
    };
};
  
// Salvar todas as mudanças
async function salvarTudo(todosOsFluxos) {

    // Atualizar os nomes dos fluxos com base no conteúdo atual dos spans
    document.querySelectorAll('.task-item').forEach(item => {
        const idFluxo = parseInt(item.dataset.id);
        const nome = item.querySelector('span').textContent;
        const fluxo = todosOsFluxos.find(f => f.id_fluxo === idFluxo);
        if (fluxo) {
            fluxo.nome = nome;
        };
    });
  
    // Exibir o conteúdo atualizado de todosOsFluxos
    console.log('Conteúdo de todosOsFluxos:');
    console.table(todosOsFluxos);
  
    // Enviar os dados para o servidor
    enviarParaServidorFluxo(todosOsFluxos);
  
    alert("Alterações salvas com sucesso!");
  
    fetchKanban();
  
};

////////////////////////////////////////////////////////
//Sistema
////////////////////////////////////////////////////////

// Função para ativar o botão "Sistema"
function ativarSistema() {
    const btnSis = document.getElementById('btn-sis');
    if (btnSis.classList.contains('active')) return;
  
    resetarAtivo();
    btnSis.classList.add('active');
  
    const configMain = document.getElementById('main_config');
    configMain.innerHTML = `
        <div class="content-config">
            <a class="config-exit" id="closeConfig">x</a>
        </div>
        <div class="toggle-container" id="toggle-container">
            <div class="toggle-switch" id="toggleSwitch"></div>
            <span class="text_config_sis">Permitir que atendentes excluam cartões</span>
        </div>
    `;
  
    fetchSistemaConfig();
  
    document.getElementById('closeConfig').addEventListener('click', desativarConfig);
    document.getElementById('toggle-container').addEventListener('click', window.salvarConfiguracao);
};
  
function configurarToggleSwitch(isActive) {
    const toggleSwitch = document.getElementById('toggleSwitch');
    
    if (isActive) {
      toggleSwitch.classList.add('active');
    } else {
      toggleSwitch.classList.remove('active');
    }
  
    // Adiciona um event listener apenas para alternar visualmente o switch
    toggleSwitch.addEventListener('click', function() {
      this.classList.toggle('active');
      console.log('Estado do toggle alterado (apenas visual)');
    });
};

/////////////////////////////////////////////////////////////////
//Usuários
////////////////////////////////////////////////////////////////

window.todosOsUsuarios = [];

function ativarUsuarios() {
    const btnUsers = document.getElementById('btn-users');
    if (btnUsers.classList.contains('active')) return;
  
    resetarAtivo();
    btnUsers.classList.add('active');
  
    const configMain = document.getElementById('main_config');
    configMain.innerHTML = `
        <div class="content-config">
            <a class="config-exit" id="closeConfig">x</a>
        </div>
        <div class="list-users" id="list-users"></div>
    `;
  
    fetchUsuarios(true);
  
    document.getElementById('closeConfig').addEventListener('click', desativarConfig);
};
  
window.renderizarUsuarios = async function(todosOsUsuarios) {
    const listUsers = document.getElementById('list-users');
    const roles = ['administrador', 'atendente', 'desativado'];
    
    listUsers.innerHTML = '';  
    
    for (let i = 0; i < todosOsUsuarios.length; i++) {
        const usuario = todosOsUsuarios[i];
        const userItem = await criarElementoUsuario(usuario, roles, false);
        listUsers.appendChild(userItem);

        // Checa se é o último usuário e então adiciona os botões
        if (i === todosOsUsuarios.length - 1) {
            const addButtons = document.createElement('div');
            addButtons.className = 'lista-actions';
            addButtons.innerHTML = `
                <a class="add-task">Adicionar</a>
                <a class="save-button">Salvar</a>
            `;
            listUsers.appendChild(addButtons);

            addButtons.querySelector('.add-task').addEventListener('click', function () {adicionarNovoUsuario(todosOsUsuarios)});
            addButtons.querySelector('.save-button').addEventListener('click', enviarParaServidorUsers);
        }
    }
};
  
async function criarElementoUsuario(usuario, roles, editarUtm) {
    const userItem = document.createElement('div');
    userItem.className = 'user-item';
  
    // Verifica se o usuário é administrador de algum cartão
    const todosOsCartoes = await fetchCartoes(false, "normal");
    const isAdminDeAlgumCartao = todosOsCartoes.some(cartao => cartao.Administrador == usuario.id_user); 

    userItem.innerHTML = `
        <div class="user-info" id="${usuario.id_user}">
            <div class="user-avatar">${usuario.email[0].toUpperCase()}</div>
            <div class="user-details">
                <span class="user-email" contenteditable=${editarUtm}>${usuario.email}</span>
                <span class="key-user" contenteditable=${editarUtm}>${usuario.senha}</span>
            </div>
        </div>
        <select class="user-role">
            ${roles.map(role => `
                <option value="${role}" ${usuario.permissoes === role ? 'selected' : ''}>
                    ${role}
                </option>
            `).join('')}
            ${!isAdminDeAlgumCartao ? '<option value="excluir">excluir</option>' : ''}
        </select>
    `;
  
    // Adicionar event listeners para atualizar os dados do usuário
    userItem.querySelector('.user-email').addEventListener('input', () => atualizarUsuario(usuario.id_user, userItem, window.todosOsUsuarios));
    userItem.querySelector('.key-user').addEventListener('input', () => atualizarUsuario(usuario.id_user, userItem, window.todosOsUsuarios));
    userItem.querySelector('.user-role').addEventListener('change', () => atualizarUsuario(usuario.id_user, userItem, window.todosOsUsuarios));
  
    return userItem;
};
  
function atualizarUsuario(id_u, userItem) {
    const id_user = parseInt(id_u);
    const email = userItem.querySelector('.user-email').textContent;
    const senha = userItem.querySelector('.key-user').textContent;
    const permissoes = userItem.querySelector('.user-role').value;
  
    console.log(id_user, email, senha);
  
    const usuario = window.todosOsUsuarios.find(u => u.id_user === id_user);
    if (usuario) {
        usuario.email = email;
        usuario.senha = senha;
        usuario.permissoes = permissoes;
    };
};
  
async function adicionarNovoUsuario(todosOsUsuarios) {

    const novoId = window.todosOsUsuarios.length > 0 ? Math.max(...todosOsUsuarios.map(u => u.id_user)) + 1 : 1;

    const novoUsuario = {
        id_user: novoId,
        email: 'novo@email.com',
        permissoes: 'atendente',
        senha: 'nova_senha'
    };

    window.todosOsUsuarios.push(novoUsuario);
    const listUsers = document.getElementById('list-users');
    const roles = ['administrador', 'atendente', 'desativado'];
    const novoElemento = await criarElementoUsuario(novoUsuario, roles, true);
    // Inserir o novo usuário antes dos botões de ação
    listUsers.insertBefore(novoElemento, listUsers.lastChild);
};

/////////////////////////////////////////////////////////////////
//Tags
////////////////////////////////////////////////////////////////

window.todasAsTags = [];

function ativarTags() {
    const btnTags = document.getElementById('btn-tags');
    if (btnTags.classList.contains('active')) return;
  
    resetarAtivo();
    btnTags.classList.add('active');
  
    const configMain = document.getElementById('main_config');
    configMain.innerHTML = `
        <div class="content-config">
            <a class="config-exit" id="closeConfig">x</a>
        </div>
        <div class="tag-container">
            <div class="tags-list" id="tags-list"></div>
            <div class="lista-actions">
              <a class="add-task"">Adicionar</a>
              <a onclick="enviarParaServidorTags()" class="save-button">Salvar</a>
            </div>
        </div>
    `;
  
    fetchTags(true);
  
    document.getElementById('closeConfig').addEventListener('click', desativarConfig);
    document.querySelector('.add-task').addEventListener('click', adicionarNovaTag);
};
  
window.renderizarTags = function(todasAsTags) {
    const tagsList = document.getElementById('tags-list');
  
    const tagsHTML = todasAsTags.map(({ cor_tag, cor_texto, id_tag, titulo }) => `
        <div class="tag-item" data-id="${id_tag}">
            <span contenteditable="true" class="tag-btn" id="btn-cor${id_tag}" style="background-color: ${cor_tag}; color: ${cor_texto};">${titulo}</span>
            <div class="tag-details">
                <input type="color" id="colorPickerTag${id_tag}" class="color-input" value="${cor_tag}"> Cor da tag
                <input type="color" id="colorPickerTxt${id_tag}" class="color-input" value="${cor_texto}"> Cor do texto
                <a class="delete-tag">x</a>
            </div>
        </div>
    `).join('');
  
    tagsList.innerHTML = tagsHTML;
  
    // Adicionar event listeners para os color pickers e botões de exclusão
    todasAsTags.forEach(({ id_tag }) => {
        atualizarCores(id_tag);
        adicionarEventoExclusao(id_tag, window.todasAsTags);
    });
  
    atualizarTituloTags();
};
  
async function adicionarEventoExclusao(id_tag, todasAsTags) {
    const tagItem = document.querySelector(`.tag-item[data-id="${id_tag}"]`);
    const deleteButton = tagItem.querySelector('.delete-tag');

    const todosOsCartoes = await fetchCartoes(false, "normal");
    
    deleteButton.addEventListener('click', function() {
      console.log('Tentando excluir tag com id:', id_tag);
      console.log('todosOsCartoes:', todosOsCartoes);
  
      const cartoesComTag = todosOsCartoes.filter(cartao => {
        console.log('Verificando cartão:', cartao);
        return cartao.Tag == id_tag; 
      });
      
      console.log('Cartões com a tag:', cartoesComTag);
  
      if (cartoesComTag.length > 0) {
        alert(`Não é possível excluir esta tag. Ela está sendo usada em ${cartoesComTag.length} cartão(ões).`);
        console.log('Cartões usando esta tag:', cartoesComTag);
      } else {
        if (confirm('Tem certeza que deseja excluir esta tag?')) {
          todasAsTags = todasAsTags.filter(tag => tag.id_tag !== id_tag);
          window.todasAsTags = todasAsTags;
          renderizarTags(todasAsTags);
        };
      };
    });
};
  
window.atualizarCores = function(id_tag) {
    const btn = document.getElementById(`btn-cor${id_tag}`);
    const tagColorPicker = document.getElementById(`colorPickerTag${id_tag}`);
    const textColorPicker = document.getElementById(`colorPickerTxt${id_tag}`);
  
    tagColorPicker.addEventListener('input', function () {
        btn.style.backgroundColor = this.value;
        // Atualizar a cor da tag no array
        const tag = window.todasAsTags.find(t => t.id_tag === id_tag);
        if (tag) tag.cor_tag = this.value;
    });
  
    textColorPicker.addEventListener('input', function () {
        btn.style.color = this.value;
        // Atualizar a cor do texto no array
        const tag = window.todasAsTags.find(t => t.id_tag === id_tag);
        if (tag) tag.cor_texto = this.value;
    });
};
  
function atualizarTituloTags() {
    document.querySelectorAll('.tag-btn').forEach(tagBtn => {
        tagBtn.addEventListener('input', function() {
            const id_tag = parseInt(this.id.replace('btn-cor', ''));
            const novoTitulo = this.textContent.trim();
            
            const tag = window.todasAsTags.find(t => t.id_tag === id_tag);
            if (tag) {
                tag.titulo = novoTitulo;
                console.log(`Tag ${id_tag} atualizada: ${novoTitulo}`);
            };
        });
    });
};
  
function adicionarNovaTag() {
    const novoId = window.todasAsTags.length > 0 ? Math.max(...todasAsTags.map(t => t.id_tag)) + 1 : 1;
    const novaTag = {
        id_tag: novoId,
        titulo: 'Nova Tag',
        cor_tag: '#6faeff',
        cor_texto: '#f4f4f4'
    };
  
    window.todasAsTags.push(novaTag);
    renderizarTags(window.todasAsTags);
};
