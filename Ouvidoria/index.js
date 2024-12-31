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
          <p class="add-task">Adicionar</p>
      </div>
  `;

  fetchTags();

  document.getElementById('closeConfig').addEventListener('click', desativarConfig);
};

async function fetchTags() {
  try {
      const response = await fetch('http://127.0.0.1:5000/ativar-tag', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      renderizarTags(data);
  } catch (error) {
      console.error('Erro ao ativar tags:', error);
  };
};

function renderizarTags(tags) {
  const tagsList = document.getElementById('tags-list');
  
  const tagsHTML = tags.map(({ cor_tag, cor_texto, id_tag, titulo }) => `
      <div class="tag-item">
          <span contenteditable="true" class="tag-btn" id="btn-cor${id_tag}" style="background-color: ${cor_tag}; color: ${cor_texto};">${titulo}</span>
          <div class="tag-details">
              <input type="color" id="colorPickerTag${id_tag}" class="color-input" value="${cor_tag}"> Cor da tag
              <input type="color" id="colorPickerTxt${id_tag}" class="color-input" value="${cor_texto}"> Cor do texto
          </div>
      </div>
  `).join('');

  tagsList.innerHTML = tagsHTML;

  // Adicionar event listeners para os color pickers
  tags.forEach(({ id_tag }) => {
      atualizarCores(`btn-cor${id_tag}`, `colorPickerTag${id_tag}`, `colorPickerTxt${id_tag}`);
  });
};

function atualizarCores(btnId, tagColorId, textColorId) {
  const btn = document.getElementById(btnId);
  const tagColorPicker = document.getElementById(tagColorId);
  const textColorPicker = document.getElementById(textColorId);

  tagColorPicker.addEventListener('input', function () {
      btn.style.backgroundColor = this.value;
  });

  textColorPicker.addEventListener('input', function () {
      btn.style.color = this.value;
  });
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
      <div class="toggle-container">
          <div class="toggle-switch" id="toggleSwitch"></div>
          <span class="text_config_sis">Deletar somente cartões vazios</span>
      </div>
  `;

  fetchSistemaConfig();

  document.getElementById('closeConfig').addEventListener('click', desativarConfig);
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
}

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

      const data = await response.json();
      renderizarFluxos(data);
  } catch (error) {
      console.error('Erro ao ativar fluxos:', error);
  };
};

function renderizarFluxos(fluxos) {
  const taskList = document.getElementById('task-list');
  
  // Ordenar fluxos por posição
  fluxos.sort((a, b) => a.posicao - b.posicao);

  const fluxosHTML = fluxos.map(({ id_fluxo, nome }) => `
      <div class="task-item" data-id="${id_fluxo}">
          <span contenteditable="true">${nome}</span>
          <a class="delete-button">×</a>
      </div>
  `).join('');

  taskList.innerHTML = fluxosHTML + '<p class="add-task">Adicionar</p>';

  // Adicionar event listeners para os botões de deletar
  document.querySelectorAll('.delete-button').forEach(button => {
      button.addEventListener('click', function() {
          this.closest('.task-item').remove();
      });
  });

  // Adicionar event listener para o botão "Adicionar"
  document.querySelector('.add-task').addEventListener('click', adicionarNovoFluxo);
};

function adicionarNovoFluxo() {
  const taskList = document.getElementById('task-list');
  const novoId = Date.now(); // Usar timestamp como ID temporário
  const novoFluxo = document.createElement('div');
  novoFluxo.className = 'task-item';
  novoFluxo.dataset.id = novoId;
  novoFluxo.innerHTML = `
      <span contenteditable="true">Novo Fluxo</span>
      <a class="delete-button">×</a>
  `;

  taskList.insertBefore(novoFluxo, taskList.lastElementChild);

  // Adicionar event listener para o novo botão de deletar
  novoFluxo.querySelector('.delete-button').addEventListener('click', function() {
      novoFluxo.remove();
  });
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

      const data = await response.json();
      renderizarUsuarios(data);
  } catch (error) {
      console.error('Erro ao ativar usuários:', error);
  };
};

function renderizarUsuarios(usuarios) {
  const listUsers = document.getElementById('list-users');
  const roles = ['administrador', 'atendente', 'desativado'];

  const usuariosHTML = usuarios.map(({ id_user, email, permissoes, senha }) => `
      <div class="user-item">
          <div class="user-info" id="${id_user}">
              <div class="user-avatar">${email[0].toUpperCase()}</div>
              <div class="user-details">
                  <span>${email}</span>
                  <span class="key-user">${senha}</span>
              </div>
          </div>
          <select class="user-role">
              ${roles.map(role => `
                  <option value="${role}" ${permissoes === role ? 'selected' : ''}>
                      ${role}
                  </option>
              `).join('')}
              <option value="excluir">excluir</option>
          </select>
      </div>
  `).join('');

  listUsers.innerHTML = usuariosHTML + '<p class="add-task">Adicionar</p>';
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
