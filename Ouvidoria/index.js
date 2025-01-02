// Array global para armazenar todas as informações
let todasOsFluxos = [];
let todasAsTags = [];
let todosOsUsuarios = [];

function expandirCardFinal(cliente, data, tag) {
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
      <main class="main-config" id="main_config">
        <div class="content-config">
          <a class="config-exit" id="closeConfig">x</a>
        </div>
        <h2>Cartão do paciente</h2>
      </main>
  `;

  document.body.appendChild(configPanel);
  
  // Adicionar evento para fechar as configurações
  document.getElementById('closeConfig').addEventListener('click', fecharCard);
};

function abrirFinalizados() {
  if (document.getElementById('btn-finalizados').className != 'selecionado') {
    document.getElementById('btn-finalizados').className = 'selecionado';
    document.getElementById('btn-home').className = 'opcao';
    document.getElementById('btn-excluidos').className = 'opcao';

    let centro = document.getElementById("content-kanban");
    centro.innerHTML =`
      <div class="finalizados-list">
        <div class="dupla-cards">
          <div class="finalizados-cards">
            <p><strong>Cliente:</strong> João Carlos</p>
            <p><strong>Tema:</strong> Banheiros</p>
            <p><strong>Data:</strong> 19/02/2025</p>
            <p><strong>Conclusão:</strong> 19/02/2025</p>
            <p><strong>Admin:</strong> Rafaela</p>
          </div>
          <div class="finalizados-cards">
            <p><strong>Cliente:</strong> João Carlos</p>
            <p><strong>Tema:</strong> Banheiros</p>
            <p><strong>Data:</strong> 19/02/2025</p>
            <p><strong>Conclusão:</strong> 19/02/2025</p>
            <p><strong>Admin:</strong> Rafaela</p>
          </div>
        </div>
        <div class="dupla-cards">
          <div class="finalizados-cards">
            <p><strong>Cliente:</strong> João Carlos</p>
            <p><strong>Tema:</strong> Banheiros</p>
            <p><strong>Data:</strong> 19/02/2025</p>
            <p><strong>Conclusão:</strong> 19/02/2025</p>
            <p><strong>Admin:</strong> Rafaela</p>
          </div>
          <div class="finalizados-cards">
            <p><strong>Cliente:</strong> João Carlos</p>
            <p><strong>Tema:</strong> Banheiros</p>
            <p><strong>Data:</strong> 19/02/2025</p>
            <p><strong>Conclusão:</strong> 19/02/2025</p>
            <p><strong>Admin:</strong> Rafaela</p>
          </div>
        </div>
      </div>
    `;

    document.querySelectorAll(".finalizados-cards").forEach(card => {
      card.addEventListener('dblclick', expandirCardFinal);
    });

    document.getElementById('btn-home').addEventListener('click', abrirHome);
    document.getElementById('btn-excluidos').addEventListener('click', abrirExluidos);

  };
};

function abrirHome() {
  if (document.getElementById('btn-home').className != 'selecionado') {
    document.getElementById('btn-home').className = 'selecionado';
    document.getElementById('btn-finalizados').className = 'opcao';
    document.getElementById('btn-excluidos').className = 'opcao';

    let centro = document.getElementById("content-kanban");
    centro.innerHTML =``;
    $('#content-kanban').load('kanban.html');
    fetchKanban();
    configKanban();

    document.getElementById('btn-finalizados').addEventListener('click', abrirFinalizados);
    document.getElementById('btn-excluidos').addEventListener('click', abrirExluidos);
  };
};

function abrirExluidos() {
  if (document.getElementById('btn-excluidos').className != 'selecionado') {
    document.getElementById('btn-finalizados').className = 'opcao';
    document.getElementById('btn-home').className = 'opcao';
    document.getElementById('btn-excluidos').className = 'selecionado';

    let centro = document.getElementById("content-kanban");
    centro.innerHTML =`
      <div class="finalizados-list">
        <div class="dupla-cards">
          <div class="finalizados-cards">
            <p><strong>Cliente:</strong> João Carlos</p>
            <p><strong>Tema:</strong> Banheiros</p>
            <p><strong>Data:</strong> 19/02/2025</p>
            <p><strong>Conclusão:</strong> 19/02/2025</p>
            <p><strong>Admin:</strong> Rafaela</p>
          </div>
          <div class="finalizados-cards">
            <p><strong>Cliente:</strong> João Carlos</p>
            <p><strong>Tema:</strong> Banheiros</p>
            <p><strong>Data:</strong> 19/02/2025</p>
            <p><strong>Conclusão:</strong> 19/02/2025</p>
            <p><strong>Admin:</strong> Rafaela</p>
          </div>
        </div>
        <div class="dupla-cards">
          <div class="finalizados-cards">
            <p><strong>Cliente:</strong> João Carlos</p>
            <p><strong>Tema:</strong> Banheiros</p>
            <p><strong>Data:</strong> 19/02/2025</p>
            <p><strong>Conclusão:</strong> 19/02/2025</p>
            <p><strong>Admin:</strong> Rafaela</p>
          </div>
          <div class="finalizados-cards">
            <p><strong>Cliente:</strong> João Carlos</p>
            <p><strong>Tema:</strong> Banheiros</p>
            <p><strong>Data:</strong> 19/02/2025</p>
            <p><strong>Conclusão:</strong> 19/02/2025</p>
            <p><strong>Admin:</strong> Rafaela</p>
          </div>
        </div>
      </div>
    `;

    document.querySelectorAll(".finalizados-cards").forEach(card => {
      card.style.backgroundColor = "#555";
      card.addEventListener('dblclick', expandirCardFinal);
    });

    document.getElementById('btn-home').addEventListener('click', abrirHome);
    document.getElementById('btn-finalizados').addEventListener('click', abrirFinalizados);
  };

};

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

  fetchTags();

  document.getElementById('closeConfig').addEventListener('click', desativarConfig);
  document.querySelector('.add-task').addEventListener('click', adicionarNovaTag);
};

async function fetchTags() {
  try {
      const response = await fetch('http://127.0.0.1:5000/ativar-tag', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      todasAsTags = await response.json();
      renderizarTags();
  } catch (error) {
      console.error('Erro ao ativar tags:', error);
  };
};

function renderizarTags() {
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
      adicionarEventoExclusao(id_tag);
  });

  atualizarTituloTags();
};

function adicionarEventoExclusao(id_tag) {
  const tagItem = document.querySelector(`.tag-item[data-id="${id_tag}"]`);
  const deleteButton = tagItem.querySelector('.delete-tag');
  
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
        renderizarTags();
      };
    };
  });
};

function atualizarCores(id_tag) {
  const btn = document.getElementById(`btn-cor${id_tag}`);
  const tagColorPicker = document.getElementById(`colorPickerTag${id_tag}`);
  const textColorPicker = document.getElementById(`colorPickerTxt${id_tag}`);

  tagColorPicker.addEventListener('input', function () {
      btn.style.backgroundColor = this.value;
      // Atualizar a cor da tag no array
      const tag = todasAsTags.find(t => t.id_tag === id_tag);
      if (tag) tag.cor_tag = this.value;
  });

  textColorPicker.addEventListener('input', function () {
      btn.style.color = this.value;
      // Atualizar a cor do texto no array
      const tag = todasAsTags.find(t => t.id_tag === id_tag);
      if (tag) tag.cor_texto = this.value;
  });
};

function atualizarTituloTags() {
  document.querySelectorAll('.tag-btn').forEach(tagBtn => {
      tagBtn.addEventListener('input', function() {
          const id_tag = parseInt(this.id.replace('btn-cor', ''));
          const novoTitulo = this.textContent.trim();
          
          const tag = todasAsTags.find(t => t.id_tag === id_tag);
          if (tag) {
              tag.titulo = novoTitulo;
              console.log(`Tag ${id_tag} atualizada: ${novoTitulo}`);
          };
      });
  });
};

function adicionarNovaTag() {
  const novoId = todasAsTags.length > 0 ? Math.max(...todasAsTags.map(t => t.id_tag)) + 1 : 1;
  const novaTag = {
      id_tag: novoId,
      titulo: 'Nova Tag',
      cor_tag: '#6faeff',
      cor_texto: '#f4f4f4'
  };

  todasAsTags.push(novaTag);
  renderizarTags();
};

async function enviarParaServidorTags() {
  atualizarTituloTags();
  todasAsTags.forEach(({ id_tag }) => {
    atualizarCores(id_tag);
  });

  fetch('http://127.0.0.1:5000/salvar-tags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todasAsTags)
  })
  .then(response => response.json())
  .then(data => console.log('Resposta do servidor:', data))
  .catch(error => console.error('Erro ao salvar tags:', error));

  alert("Alterações salvas com sucesso!");
};

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
          <span class="text_config_sis">Deletar somente colunas vazias</span>
      </div>
  `;

  fetchSistemaConfig();

  document.getElementById('closeConfig').addEventListener('click', desativarConfig);
  document.getElementById('toggle-container').addEventListener('click', salvarConfiguracao);
};

async function fetchSistemaConfig() {
  try {
    const response = await fetch('http://127.0.0.1:5000/ativar-sistema', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    configurarToggleSwitch(data[0].config1);
  } catch (error) {
    console.error('Erro ao ativar sistema:', error);
  };
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

async function salvarConfiguracao() {
  const toggleSwitch = document.getElementById('toggleSwitch');
  const isActive = toggleSwitch.classList.contains('active');

  try {
    const response = await fetch('http://127.0.0.1:5000/atualizar-sistema', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ config1: isActive }) // Envia o estado atual do switch
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    console.log('Sistema atualizado:', data);
    
  } catch (error) {
    console.error('Erro ao atualizar sistema:', error);
    alert('Erro ao salvar a configuração. Por favor, tente novamente.');
  };
};

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

  fetchFluxos();

  document.getElementById('closeConfig').addEventListener('click', desativarConfig);
};

async function fetchFluxos() {
  try {
      const response = await fetch('http://127.0.0.1:5000/ativar-fluxo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      todosOsFluxos = await response.json();
      renderizarFluxos();
  } catch (error) {
      console.error('Erro ao ativar fluxos:', error);
  };
};

function renderizarFluxos() {
  const taskList = document.getElementById('task-list');
  
  // Ordenar fluxos por posição
  todosOsFluxos.sort((a, b) => a.posicao - b.posicao);

  const fluxosHTML = todosOsFluxos.map(({ id_fluxo, nome }) => `
      <div class="task-item" data-id="${id_fluxo}">
          <span contenteditable="true">${nome}</span>
          <a class="delete-button">×</a>
      </div>
  `).join('');

  taskList.innerHTML = fluxosHTML + '<div class="lista-actions"><a class="add-task"">Adicionar</a><a onclick="salvarTudo()" class="save-button">Salvar</a></div>';

  // Adicionar event listeners para os botões de deletar
  document.querySelectorAll('.delete-button').forEach(button => {
      button.addEventListener('click', function() {
          const idFluxo = parseInt(this.closest('.task-item').dataset.id);
          removerFluxo(idFluxo);
      });
  });

  // Adicionar event listener para o botão "Adicionar"
  document.querySelector('.add-task').addEventListener('click', adicionarNovoFluxo);
};

function adicionarNovoFluxo() {
  
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
  renderizarFluxos();
};

function removerFluxo(idFluxo) {
  const cartoesEmFluxo = todosOsCartoes.filter(cartao => {
    console.log('Verificando cartão:', cartao);
    return cartao.id_fluxo == idFluxo; 
  });

  if (cartoesEmFluxo.length > 0) {
    alert(`Não é possível excluir esta tag. Ela está possui ${cartoesEmFluxo.length} cartão(ões).`);
  } else {
    if (confirm('Tem certeza que deseja excluir essa etapa?')) {
      todosOsFluxos = todosOsFluxos.filter(fluxo => fluxo.id_fluxo !== idFluxo);
      renderizarFluxos();
    };
  };
};

function salvarTudo() {
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

// Função auxiliar para enviar dados para o servidor
function enviarParaServidorFluxo(dados) {
  fetch('http://127.0.0.1:5000/salvar-fluxos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
  })
  .then(response => response.json())
  .then(data => console.log('Resposta do servidor:', data))
  .catch(error => console.error('Erro ao salvar fluxos:', error));
};

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

  fetchUsuarios();

  document.getElementById('closeConfig').addEventListener('click', desativarConfig);
};

async function fetchUsuarios() {
  try {
      const response = await fetch('http://127.0.0.1:5000/ativar-usuarios', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      todosOsUsuarios = await response.json();
      renderizarUsuarios();
  } catch (error) {
      console.error('Erro ao ativar usuários:', error);
  };
};

function renderizarUsuarios() {
  const listUsers = document.getElementById('list-users');
  const roles = ['administrador', 'atendente', 'desativado'];

  listUsers.innerHTML = '';  // Limpar a lista antes de renderizar

  todosOsUsuarios.forEach(usuario => {
      const userItem = criarElementoUsuario(usuario, roles);
      listUsers.appendChild(userItem);
  });

  // Adicionar os botões "Adicionar" e "Salvar" no final da lista
  const addButtons = document.createElement('div');
  addButtons.className = 'lista-actions';
  addButtons.innerHTML = `
      <a class="add-task">Adicionar</a>
      <a class="save-button">Salvar</a>
  `;
  listUsers.appendChild(addButtons);

  // Adicionar event listeners aos botões
  addButtons.querySelector('.add-task').addEventListener('click', adicionarNovoUsuario);
  addButtons.querySelector('.save-button').addEventListener('click', enviarParaServidorUsers);
};

function criarElementoUsuario(usuario, roles) {
  const userItem = document.createElement('div');
  userItem.className = 'user-item';

  // Verifica se o usuário é administrador de algum cartão
  const isAdminDeAlgumCartao = window.todosOsCartoes.some(cartao => cartao.Administrador == usuario.id_user);

  userItem.innerHTML = `
      <div class="user-info" id="${usuario.id_user}">
          <div class="user-avatar">${usuario.email[0].toUpperCase()}</div>
          <div class="user-details">
              <span class="user-email" contenteditable="true">${usuario.email}</span>
              <span class="key-user" contenteditable="true">${usuario.senha}</span>
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

  return userItem;
};

function atualizarUsuario(userItem) {
  const id_user = parseInt(userItem.dataset.id);
  const email = userItem.querySelector('.user-email').textContent;
  const senha = userItem.querySelector('.key-user').textContent;
  const permissoes = userItem.querySelector('.user-role').value;

  const usuario = todosOsUsuarios.find(u => u.id_user === id_user);
  if (usuario) {
      usuario.email = email;
      usuario.senha = senha;
      usuario.permissoes = permissoes;
  };
};

function adicionarNovoUsuario() {
  const novoId = todosOsUsuarios.length > 0 ? Math.max(...todosOsUsuarios.map(u => u.id_user)) + 1 : 1;
  const novoUsuario = {
      id_user: novoId,
      email: 'novo@email.com',
      permissoes: 'atendente',
      senha: 'nova_senha'
  };

  todosOsUsuarios.push(novoUsuario);
  
  const listUsers = document.getElementById('list-users');
  const roles = ['administrador', 'atendente', 'desativado'];
  const novoElemento = criarElementoUsuario(novoUsuario, roles);
  
  // Inserir o novo usuário antes dos botões de ação
  listUsers.insertBefore(novoElemento, listUsers.lastChild);
};

function enviarParaServidorUsers() {
  const usuariosParaSalvar = todosOsUsuarios.filter(usuario => usuario.permissoes !== 'excluir');

  fetch('http://127.0.0.1:5000/salvar-usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(usuariosParaSalvar)
  })
  .then(response => response.json())
  .then(data => {
      console.log('Resposta do servidor:', data);
      alert("Alterações salvas com sucesso!");
  })
  .catch(error => {
      console.error('Erro ao salvar usuários:', error);
      alert("Erro ao salvar alterações. Por favor, tente novamente.");
  });
};

// Remove a classe 'active' de todos os botões
function resetarAtivo() {
  const botoes = document.querySelectorAll('.menu-item-config');
  botoes.forEach((botao) => {
    botao.className = 'menu-item-config'; // Remove a classe 'active'
  });
};

function ativarConfig()  {
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
  
    fetchFluxos();
  
    document.getElementById('closeConfig').addEventListener('click', desativarConfig);
  };

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

function desativarMenu() {

    var btn_home_class = document.getElementById("btn-home").className
    var btn_final_class = document.getElementById("btn-finalizados").className
    var btn_excl_class = document.getElementById("btn-excluidos").className

    // Recria o botão principal
    const mainBtn = document.createElement('div');
    mainBtn.className = 'content-2';
    mainBtn.id = "content2"
    mainBtn.innerHTML = `
        <a class="btn-menu" id="mainBtn">≡</a>
    `;

    const docker = document.getElementById('docker');
    docker.removeChild(menu);
    docker.insertBefore(mainBtn, content);

    document.getElementById('mainBtn').addEventListener('click', function() {ativarMenu(btn_home_class, btn_final_class, btn_excl_class)});
};

function ativarMenu(btn_home_class, btn_final_class, btn_excl_class) {
    // Cria o menu
    const menu = document.createElement('div');
    menu.className = 'menu';
    menu.id = 'menu';

    if (btn_home_class == 'selecionado') {
      menu.innerHTML = `
      <a href="#" class="btn-menu-2" id="menuBtn">≡</a>
      <a href="#" class="selecionado" id="btn-home">Home</a>
      <a href="#" class="opcao" id="btn-finalizados">Finalizados</a>
      <a href="#" class="opcao" id="btn-excluidos">Excluídos</a>
      <img class="img-config" src="galeria/config.png" alt="Imagem de config" id="config"/>
      `;
    };    
    if (btn_final_class == 'selecionado') {
      menu.innerHTML = `
      <a href="#" class="btn-menu-2" id="menuBtn">≡</a>
      <a href="#" class="opcao" id="btn-home">Home</a>
      <a href="#" class="selecionado" id="btn-finalizados">Finalizados</a>
      <a href="#" class="opcao" id="btn-excluidos">Excluídos</a>
      <img class="img-config" src="galeria/config.png" alt="Imagem de config" id="config"/>
      `;
    };    
    if (btn_excl_class == 'selecionado') {
      menu.innerHTML = `
      <a href="#" class="btn-menu-2" id="menuBtn">≡</a>
      <a href="#" class="opcao" id="btn-home">Home</a>
      <a href="#" class="opcao" id="btn-finalizados">Finalizados</a>
      <a href="#" class="selecionado" id="btn-excluidos">Excluídos</a>
      <img class="img-config" src="galeria/config.png" alt="Imagem de config" id="config"/>
      `;
    };

    const docker = document.getElementById('docker');
    docker.removeChild(content2);
    docker.insertBefore(menu, content);

    document.getElementById('menuBtn').addEventListener('click', desativarMenu);
    document.getElementById('config').addEventListener('click', ativarConfig);
    document.getElementById('btn-finalizados').addEventListener('click', abrirFinalizados);
    document.getElementById('btn-home').addEventListener('click', abrirHome);
    document.getElementById('btn-excluidos').addEventListener('click', abrirExluidos);

};

// Seleciona todos os elementos com a classe '.kanban-card' e adiciona eventos a cada um deles
document.querySelectorAll('.kanban-card').forEach(card => {
    // Evento disparado quando começa a arrastar um card
    card.addEventListener('dragstart', e => {
        // Adiciona a classe 'dragging' ao card que está sendo arrastado
        e.currentTarget.classList.add('dragging');
    });
  
    // Evento disparado quando termina de arrastar o card
    card.addEventListener('dragend', e => {
        // Remove a classe 'dragging' quando o card é solto
        e.currentTarget.classList.remove('dragging');
    });
});

// Seleciona todos os elementos com a classe '.kanban-cards' (as colunas) e adiciona eventos a cada um deles
document.querySelectorAll('.kanban-cards').forEach(column => {
    // Evento disparado quando um card arrastado passa sobre uma coluna (drag over)
    column.addEventListener('dragover', e => {
        // Previne o comportamento padrão para permitir o "drop" (soltar) do card
        e.preventDefault();
        // Adiciona a classe 'cards-hover'
        e.currentTarget.classList.add('cards-hover');
    });
  
    // Evento disparado quando o card sai da área da coluna (quando o card é arrastado para fora)
    column.addEventListener('dragleave', e => {
        // Remove a classe 'cards-hover' quando o card deixa de estar sobre a coluna
        e.currentTarget.classList.remove('cards-hover');
    });
  
    // Evento disparado quando o card é solto (drop) dentro da coluna
    column.addEventListener('drop', e => {
        // Remove a classe 'cards-hover', já que o card foi solto
        e.currentTarget.classList.remove('cards-hover');
    
        // Seleciona o card que está sendo arrastado (que tem a classe 'dragging')
        const dragCard = document.querySelector('.kanban-card.dragging');

        // Anexa (move) o card arrastado para a coluna onde foi solto
        e.currentTarget.appendChild(dragCard);
    });
});

document.getElementById('config').addEventListener('click', ativarConfig);
document.getElementById('menuBtn').addEventListener('click', desativarMenu);
document.getElementById('btn-finalizados').addEventListener('click', abrirFinalizados);
document.getElementById('btn-home').addEventListener('click', abrirHome);
document.getElementById('btn-excluidos').addEventListener('click', abrirExluidos);
