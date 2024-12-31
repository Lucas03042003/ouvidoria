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
  if (document.getElementById('btn-tags').className != 'menu-item-config active') {
    resetarAtivo();
    const tag = document.getElementById('btn-tags');
    const configMain = document.getElementById('main_config');

    tag.className = 'menu-item-config active';

    configMain.innerHTML = `
    <div class="content-config">
        <a class="config-exit" id="closeConfig">x</a>
    </div>
    <div class="tag-container">
      <div class="tags-list">
        <div class="tag-item">
          <span contenteditable="true" class="tag-btn" id="btn-cor1">Banheiros</span>
          <div class="tag-details">
            <input type="color" id="colorPickerTag1" class="color-input" value="#6faeff"> Cor da tag
            <input type="color" id="colorPickerTxt1" class="color-input" value="#f4f4f4"> Cor do texto
          </div>
        </div>

        <div class="tag-item">
          <span contenteditable="true" class="tag-btn" id="btn-cor2">Banheiros</span>
          <div class="tag-details">
            <input type="color" id="colorPickerTag2" class="color-input" value="#6faeff"> Cor da tag
            <input type="color" id="colorPickerTxt2" class="color-input" value="#f4f4f4"> Cor do texto
          </div>
        </div>

        <div class="tag-item">
          <span contenteditable="true" class="tag-btn" id="btn-cor3">Banheiros</span>
          <div class="tag-details">
            <input type="color" id="colorPickerTag3" class="color-input" value="#6faeff"> Cor da tag
            <input type="color" id="colorPickerTxt3" class="color-input" value="#f4f4f4"> Cor do texto
          </div>
        </div>
      </div>
      <p class="add-task">Adicionar</p>
    </div>
    `;

    // Função para atualizar as cores de fundo e texto dos botões
    const atualizarCores = (btnId, tagColorId, textColorId) => {
      const btn = document.getElementById(btnId);
      const tagColorPicker = document.getElementById(tagColorId);
      const textColorPicker = document.getElementById(textColorId);

      // Atualizar a cor de fundo do botão
      tagColorPicker.addEventListener('input', function () {
        btn.style.backgroundColor = this.value;
      });

      // Atualizar a cor do texto do botão
      textColorPicker.addEventListener('input', function () {
        btn.style.color = this.value;
      });
    };

    // Associar os inputs de cor aos botões
    atualizarCores('btn-cor1', 'colorPickerTag1', 'colorPickerTxt1');
    atualizarCores('btn-cor2', 'colorPickerTag2', 'colorPickerTxt2');
    atualizarCores('btn-cor3', 'colorPickerTag3', 'colorPickerTxt3');

    // Adicionar evento para fechar as configurações
    document.getElementById('closeConfig').addEventListener('click', desativarConfig);
  };
};

// Função para ativar o botão "Sistema"
function ativarSistema() {

    if (document.getElementById('btn-sis').className != 'menu-item-config active') {
        resetarAtivo(); // Remove a classe 'active' de todos os botões
        const sistema = document.getElementById('btn-sis');
        const configMain = document.getElementById('main_config');

        sistema.className = 'menu-item-config active'; // Ativa o botão "Sistema"

        configMain.innerHTML = `
            <div class="content-config">
                <a class="config-exit" id="closeConfig">x</a>
            </div>
            <div class="toggle-container">
              <div class="toggle-switch active"></div>
              <span class="text_config_sis">Deletar somente cartões vazios</span>
            </div>
        `;
        
        // Adicionar evento para fechar as configurações
        document.getElementById('closeConfig').addEventListener('click', desativarConfig);

        // Script para alternar o estado do botão
        document.querySelector('.toggle-switch').addEventListener('click', function () {
          this.classList.toggle('active');
        });
    };
};

// Função para ativar o botão "Fluxo"
function ativarFluxo() {
    if (document.getElementById('btn-fluxo').className != 'menu-item-config active') {
        resetarAtivo();
        const fluxo = document.getElementById('btn-fluxo');
        const configMain = document.getElementById('main_config');

        fluxo.className = 'menu-item-config active';

        configMain.innerHTML = `
            <div class="content-config">
                <a class="config-exit" id="closeConfig">x</a>
            </div>
            <div class="task-list">
                <div class="task-item">
                  <span contenteditable="true">Recepção da solicitação</span>
                  <a class="delete-button">×</a>
                </div>
                <div class="task-item">
                  <span contenteditable="true">Classificação</span>
                  <a class="delete-button">×</a>
                </div>
                <div class="task-item">
                  <span contenteditable="true">Encaminhamento</span>
                  <a class="delete-button">×</a>
                </div>
                <p class="add-task">Adicionar</p>
            </div>
        `;

        document.getElementById('closeConfig').addEventListener('click', desativarConfig);

    };
};

// Função para ativar o botão "Usuários"
function ativarUsuarios() {
    
    if (document.getElementById('btn-users').className != 'menu-item-config active') {
        resetarAtivo();
        const usuarios = document.getElementById('btn-users');
        const configMain = document.getElementById('main_config');
        
        usuarios.className = 'menu-item-config active';
        
        configMain.innerHTML = `
            <div class="content-config">
                <a class="config-exit" id="closeConfig">x</a>
            </div>
            <div class="list-users" id="list-users">
              <div class="user-item">
                <div class="user-info">
                  <div class="user-avatar">U</div>
                  <div class="user-details">
                    <span>User@gmail.com</span>
                    <span class="key-user" contenteditable="true">********</span>
                  </div>
                </div>
                <select class="user-role">
                  <option selected>Administrador</option>
                  <option>Atendente</option>
                  <option>Desativado</option>
                  <option>Excluir</option>
                </select>
              </div>

              <div class="user-item">
                <div class="user-info">
                  <div class="user-avatar">U</div>
                  <div class="user-details">
                    <span>User@gmail.com</span>
                    <span class="key-user" contenteditable="true">********</span>
                  </div>
                </div>
                <select class="user-role">
                  <option>Administrador</option>
                  <option selected>Atendente</option>
                  <option>Desativado</option>
                  <option>Excluir</option>
                </select>
              </div>

              <div class="user-item">
                <div class="user-info">
                  <div class="user-avatar">U</div>
                  <div class="user-details">
                    <span>User@gmail.com</span>
                    <span class="key-user" contenteditable="true">********</span>
                  </div>
                </div>
                <select class="user-role">
                  <option>Administrador</option>
                  <option selected>Atendente</option>
                  <option>Desativado</option>
                  <option>Excluir</option>
                </select>
              </div>

              <div class="user-item">
                <div class="user-info">
                  <div class="user-avatar">U</div>
                  <div class="user-details">
                    <span>User@gmail.com</span>
                    <span class="key-user" contenteditable="true">********</span>
                  </div>
                </div>
                <select class="user-role">
                  <option>Administrador</option>
                  <option selected>Atendente</option>
                  <option>Desativado</option>
                  <option>Excluir</option>
                </select>
              </div>
              <p class="add-task">Adicionar</p>
            </div>
        `;

        document.getElementById('closeConfig').addEventListener('click', desativarConfig);
    }; 
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
            <div class="content-config">
                <a class="config-exit" id="closeConfig">x</a>
            </div>
            <div class="task-list">
                <div class="task-item">
                  <span contenteditable="true">Recepção da solicitação</span>
                  <a class="delete-button">×</a>
                </div>
                <div class="task-item">
                  <span contenteditable="true">Classificação</span>
                  <a class="delete-button">×</a>
                </div>
                <div class="task-item">
                  <span contenteditable="true">Encaminhamento</span>
                  <a class="delete-button">×</a>
                </div>
                <p class="add-task">Adicionar</p>
            </div>
        </main>
    `;

    document.body.appendChild(configPanel);
    
    // Adicionar evento para fechar as configurações
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
