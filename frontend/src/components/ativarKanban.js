// Fazer com que a barra lateral de menu desapareça
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

// Fazer com que a barra lateral de menu apareça
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

    if (permissao == "admin") {
      const img = document.createElement("img");
      img.className = "img-config";
      img.src = "galeria/config.png";
      img.id = "config";
      img.alt = "Imagem de config";
      img.title = "Configurações";
  
      document.getElementById("menu").appendChild(img);
      document.getElementById('config').addEventListener('click', ativarConfig);
  }

    document.getElementById('menuBtn').addEventListener('click', desativarMenu);
    document.getElementById('btn-finalizados').addEventListener('click', abrirFinalizados);
    document.getElementById('btn-home').addEventListener('click', abrirHome);
    document.getElementById('btn-excluidos').addEventListener('click', abrirExluidos);

};

//Função renderizar kanbans, afim de fazer aparecer as colunas de fluxo
const renderizarKanban = function(todosOsKanbans) {
    const kanban = document.getElementById('kanban');
    
    // Ordenar fluxos por posição
    todosOsKanbans.sort((a, b) => a.posicao - b.posicao);

    //Organizar fluxos dentros do kanban-div
    const kanbanHTML = todosOsKanbans.map(({ id_fluxo, nome }) => `
          <div class="kanban-column" data-id=${String(id_fluxo)}>
              <div class="kanban-title">
                  <h2>
                      ${nome}
                  </h2>
              </div>
              <div class="kanban-cards">
              </div>
          </div>
    `).join('');
    
    kanban.innerHTML = kanbanHTML;
    
    fetchCartoes(true, "normal");
  
};

// Função para renderizar os cartões 
const renderizarCartoes = function(todosOsCartoes) {
    if (!Array.isArray(todosOsCartoes) || todosOsCartoes.length === 0) {
        console.log('Nenhum cartão para renderizar ou dados inválidos.');
        return;
    };

    // Limpar todas as colunas antes de renderizar
    document.querySelectorAll('.kanban-cards').forEach(column => {
        column.innerHTML = '';
    });

    todosOsCartoes.forEach(cartao => {

        const colunaKanban = document.querySelector(`.kanban-column[data-id="${cartao.id_fluxo}"]`);
        if (!colunaKanban) {
            console.error(`Coluna não encontrada para o fluxo: ${cartao.nome_fluxo || 'Desconhecido'}`);
            return;
        };

        let cardsContainer = colunaKanban.querySelector('.kanban-cards');
        if (!cardsContainer) {
            cardsContainer = document.createElement('div');
            cardsContainer.className = "kanban-cards";
            colunaKanban.appendChild(cardsContainer);
        };

        const cardElement = document.createElement('div');
        cardElement.className = 'kanban-card';
        cardElement.draggable = true;
        cardElement.dataset.id = cartao.ID_Cartao;

        cardElement.innerHTML = `
            <div class="badge" id="badge-${cartao.ID_Cartao}" style="background-color: ${cartao.cor_tag || '#ccc'}; color: ${cartao.cor_texto_tag || '#000'};">
                <span id="span-${cartao.ID_Cartao}">${cartao.tag_titulo || 'Sem Tag'}</span>
            </div>
            <div class="card-text">
                <a id="client">Cliente: ${cartao.Cliente || 'Sem Cliente'}</a>
                <a id="date">Data: ${cartao.Data_comentario || 'Sem Data'}</a>
            </div>
            <div class="card-infos">
                <div class="card-icons">
                </div>
            </div>
        `;

        cardsContainer.appendChild(cardElement);

        // Adicionar eventos ao cartão
        cardElement.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', cartao.ID_Cartao);
            e.currentTarget.classList.add('dragging');
        });

        cardElement.addEventListener('dragend', (e) => {
            e.currentTarget.classList.remove('dragging');
        });

        cardElement.addEventListener('dblclick', () => {
            expandirCard(cartao.ID_Cartao);
        });
    });

    // Adicionar eventos de receber cartões às colunas
    document.querySelectorAll('.kanban-cards').forEach(column => {
      column.addEventListener('dragover', (e) => {
          e.preventDefault();
          e.currentTarget.classList.add('cards-hover');
      });

      column.addEventListener('dragleave', (e) => {
          e.currentTarget.classList.remove('cards-hover');
      });

      column.addEventListener('drop', (e) => {
          e.preventDefault();
          e.currentTarget.classList.remove('cards-hover');
          const dragCard = document.querySelector('.kanban-card.dragging');
          if (dragCard) {
              const cardId = dragCard.getAttribute('data-id');
              const newFluxoId = column.closest('.kanban-column').getAttribute('data-id');

              // Move o cartão visualmente
              e.currentTarget.appendChild(dragCard);

              // Atualiza o banco de dados
              atualizarEtapaCartao(cardId, newFluxoId);
          }
      });
    });
};

const expandirCard = async function(id_cartao) {

    const todosOsCartoes = await fetchCartoes(false, "normal");
    const cartao = todosOsCartoes.find(cartao => cartao.ID_Cartao === id_cartao);
  
    let id_fluxo = cartao.id_fluxo;
    let cliente = cartao.Cliente;
    let data = cartao.Data_comentario;
    let tag = cartao.tag_titulo;
    let responsavel = cartao.admin_nome;
    let cor_tag = cartao.cor_tag;
    let cor_texto_tag = cartao.cor_texto_tag;
    let comentario = cartao.Comentario;
  
    const elemento = document.querySelector('.container');
    elemento.style.filter = 'blur(5px)';
    
    const overlay = document.createElement('div');
    overlay.id = 'overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.zIndex = '1000';
    
    document.body.appendChild(overlay);
    
    const configPanel = document.createElement('div');
    configPanel.className = 'body-config';
    configPanel.id = 'configPanel';
    configPanel.style.position = 'fixed';
    configPanel.style.top = '50%';
    configPanel.style.left = '50%';
    configPanel.style.height = '50%';
    configPanel.style.width = '40%';
    configPanel.style.transform = 'translate(-50%, -50%)';
    configPanel.style.backgroundColor = '#333';
    configPanel.style.color = '#807E7E';
    configPanel.style.borderRadius = '5px';
    configPanel.style.zIndex = '1001';
  
    // Aguardar a conclusão de fetchUsuariosExpansao
    todosOsUsuarios = await fetchUsuarios(false);
    console.log(todosOsUsuarios);
  
    todasAsTags = await fetchTags(false);
    console.log(todasAsTags);

    let responsaveisOptions = `${email}`;
    let responsavalSelect = `<a id="responsavel-select">${responsaveisOptions}</a>`;
    if (window.permissao == "admin") {
      responsaveisOptions = todosOsUsuarios ? todosOsUsuarios.map(user => 
          `<option value="${user.id_user}" ${user.email === responsavel ? 'selected' : ''}>${user.email}</option>`
      ).join('') : '';

      responsavalSelect = `
        <select id="responsavel-select" style="background-color: transparent; color: inherit; border: 1px solid #807E7E;">
          ${responsaveisOptions}
        </select>
      `;
    };
  
    const tagsOptions = todasAsTags ? todasAsTags.map(tagItem => 
      `<option value="${tagItem.id_tag}" id="TagItem${tagItem.id_tag}"
               style="background-color: ${tagItem.cor_tag}; color: ${tagItem.cor_texto}"
               ${tagItem.titulo === tag ? 'selected' : ''}>
          ${tagItem.titulo}
       </option>`
    ).join('') : '';
  
    todosOsHistoricos = await fetchHistorico(id_cartao);
    console.log('teste novo', todosOsHistoricos)
  
    const historico = todosOsHistoricos ? todosOsHistoricos.map(histo => 
      `<p>- ${histo.descricao}</p>`
    ).join('') : '';
  
    configPanel.innerHTML = `
      <main class="main-info" id="main_config">
        <div class="content-config">
          <a class="config-exit" id="closeConfig">x</a>
        </div>
        <h2>Cartão do Comentário</h2>
        <div class="container-informacoes" id="container-informacoes">
          <div class="informacoes">
            <a>
            Tag:
            <select id="tag-select" class="badge" style="background-color: ${cor_tag}; color: ${cor_texto_tag};">
              ${tagsOptions}
            </select>
            </a>
            <p>Cliente: ${cliente}</p>
            <p>Data do comentário: ${data}</p>
            <p>
              Responsável:
              ${responsavalSelect}
            </p>
          </div>
          <div class="informacoes">
            <p>Comentário:</p>
            <p>${comentario}</p>
          </div>
          <div class="informacoes" id="info-txt-historico">
            <h4>Histórico:</h4>
            <p></p>
            ${historico}
          </div>
          <div class="informacoes" id="msgbox-infos">
          </div>
        </div>
        <div class="action-buttons">
          <a class="btn btn-check" onclick="confirmarMudar(${id_cartao}, ${id_fluxo}, 'finalizado')" title="Finalizar">✔</a>
          <a class="btn btn-cancel" onclick="confirmarMudar(${id_cartao}, ${id_fluxo}, 'excluído')" title="Excluir">✖</a>
        </div>
      </main>
    `;
  
    document.body.appendChild(configPanel);
    document.getElementById('closeConfig').addEventListener('click', fecharCard);
  
    // Adicionar event listener para o select de responsáveis
    const responsavelSelect = document.getElementById('responsavel-select');
    responsavelSelect.addEventListener('change', function() {
        atualizarNovoResponsavel(id_cartao);
    });
  
    const tagSelect = document.getElementById('tag-select');
    tagSelect.addEventListener('change', function() {
        atualizarNovaTag(id_cartao);
    });
  
    adicionarCaixaTxt(id_cartao);
  
};
  
function adicionarCaixaTxt(id_cartao) {
    // Criar o container principal
    const caixaTexto = document.createElement('div');
    caixaTexto.className = 'message-box';
    
    // Criar o input
    const inputTexto = document.createElement('input');
    inputTexto.type = 'text';
    inputTexto.id = 'message-box-input';
    inputTexto.className = 'message-box-input';
    inputTexto.placeholder = 'Escreva uma observação aqui...';
    
    // Criar o botão
    const botaoEnviar = document.createElement('button');
    botaoEnviar.className = 'message-box-button';
    botaoEnviar.id = "botaoEnviarTxt";
    botaoEnviar.innerHTML = '&#9654;'; // Seta
    
    // Adicionar os elementos ao container
    caixaTexto.appendChild(inputTexto);
    caixaTexto.appendChild(botaoEnviar);
    
    const infos = document.getElementById("msgbox-infos");
    infos.appendChild(caixaTexto);
    
    document.getElementById("botaoEnviarTxt").addEventListener('click', function() {
      enviarMsgTxt(id_cartao);
    });
}; 
  
  function enviarMsgTxt(id_cartao) {
    
    const input = document.getElementById("message-box-input");
    let msg = input.value;
  
    if (msg != '') {
  
    const textMsg = document.createElement('p');
    textMsg.innerHTML = `- ${msg}`;
  
    const historico = document.getElementById("info-txt-historico");
    historico.appendChild(textMsg);
  
    input.value = '';
  
    atualizarHistorico(msg, id_cartao);
  
    };
};

window.fecharCard = function() {
    const elemento = document.querySelector('.container');
    elemento.style.filter = 'none';
  
    const overlay = document.getElementById('overlay');
    if (overlay) {
      overlay.remove();
    };
  
    const configPanel = document.getElementById('configPanel');
    if (configPanel) {
      configPanel.remove();
    };
};

///////////////////////////////////////////////////////////////
// Funções que controlam a mudança de status de um cartão, de normal para exclúido ou finalizado
window.confirmarMudar = async function(id_cartao, id_fluxo, status) {
  
  const todosOsCartoes = await fetchCartoes(false, "normal");

  const cartao = todosOsCartoes.find(cartao => cartao.ID_Cartao === id_cartao);
  let cor_tag = cartao.cor_tag;
  let cor_texto = cartao.cor_texto_tag;
  let titulo = cartao.tag_titulo;
  let nomeAdmin = cartao.admin_nome;
  
  let texto = "Você irá finalizar as atividades com esse cartão. Deseja mesmo continuar?";

  if (status == "excluído") {
    texto = "Você irá deletar esse cartão. Deseja mesmo continuar?";
  };

  confirmar = confirm(texto);

  if (confirmar) {
    fecharCard();
    await mudarStatus(id_cartao, status, titulo, cor_tag, cor_texto, nomeAdmin);
    deletarUI(id_cartao, id_fluxo);
  };
};

function deletarUI(id_cartao, id_fluxo) {

  const colunaKanban = document.querySelector(`.kanban-column[data-id="${id_fluxo}"]`);
  const kanbanCard = colunaKanban.querySelector('.kanban-cards');
  const elemento = document.querySelector(`.kanban-card[data-id="${id_cartao}"]`);

  kanbanCard.removeChild(elemento);
};