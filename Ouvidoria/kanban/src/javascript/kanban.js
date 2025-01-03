window.todosOsKanbans = [];
window.todosOsCartoes = [];
 
async function fetchKanban(recarregar) {
  try {
      const response = await fetch('http://127.0.0.1:5000/ativar-fluxo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      window.todosOsKanbans = await response.json();
      renderizarKanban();
  } catch (error) {
      console.error('Erro ao ativar fluxos:', error);
  };
};

function renderizarKanban() {
  const kanban = document.getElementById('kanban');
  
  // Ordenar fluxos por posição
  todosOsKanbans.sort((a, b) => a.posicao - b.posicao);

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

  fetchCartoes(true);

};

async function fetchCartoes(renderizar) {
    try {
      const response = await fetch('http://127.0.0.1:5000/coletar-cartoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  
      window.todosOsCartoes = await response.json();
      console.log('Cartões coletados:', window.todosOsCartoes);
      
      // Aqui você pode chamar uma função para renderizar os cartões
      if (renderizar) {
        renderizarCartoes(todosOsCartoes);
      };
    } catch (error) {
      console.error('Erro ao coletar cartões:', error);
    };
  };
  
// Função para renderizar os cartões 
function renderizarCartoes(cartoes) {
  if (!Array.isArray(cartoes) || cartoes.length === 0) {
      console.log('Nenhum cartão para renderizar ou dados inválidos.');
      return;
  }

  // Limpar todas as colunas antes de renderizar
  document.querySelectorAll('.kanban-cards').forEach(column => {
      column.innerHTML = '';
  });

  cartoes.forEach(cartao => {
      if (!cartao || typeof cartao !== 'object') {
          console.error('Cartão inválido:', cartao);
          return;
      }

      const colunaKanban = document.querySelector(`.kanban-column[data-id="${cartao.id_fluxo}"]`);
      if (!colunaKanban) {
          console.error(`Coluna não encontrada para o fluxo: ${cartao.nome_fluxo || 'Desconhecido'}`);
          return;
      }

      let cardsContainer = colunaKanban.querySelector('.kanban-cards');
      if (!cardsContainer) {
          cardsContainer = document.createElement('div');
          cardsContainer.className = "kanban-cards";
          colunaKanban.appendChild(cardsContainer);
      }

      const cardElement = document.createElement('div');
      cardElement.className = 'kanban-card';
      cardElement.draggable = true;
      cardElement.dataset.id = cartao.ID_Cartao;

      cardElement.innerHTML = `
          <div class="badge" style="background-color: ${cartao.cor_tag || '#ccc'}; color: ${cartao.cor_texto_tag || '#000'};">
              <span>${cartao.tag_titulo || 'Sem Tag'}</span>
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
          expandirCard(cartao.ID_Cartao, cartao.Cliente, cartao.Data_comentario, cartao.tag_titulo, cartao.admin_nome, cartao.cor_tag, cartao.cor_texto_tag, cartao.Comentario);
      });
  });

  // Adicionar eventos às colunas
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
  
function fecharCard() {
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
  
function confirmarCancelar() {
    let confirmar = confirm("Você irá deletar esse cartão. Deseja mesmo continuar?");
    if (confirmar) {
      fecharCard();
    };
};

async function expandirCard(id_cartao, cliente, data, tag, responsavel, cor_tag, cor_texto_tag, comentario) {
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
  await fetchUsuarios(false);
  console.log(todosOsUsuarios);

  await fetchTags(false);
  console.log(todasAsTags);

  // Criar o select de responsáveis
  const responsaveisOptions = todosOsUsuarios ? todosOsUsuarios.map(user => 
      `<option value="${user.id_user}" ${user.email === responsavel ? 'selected' : ''}>${user.email}</option>`
  ).join('') : '';

  const tagsOptions = todasAsTags ? todasAsTags.map(tagItem => 
    `<option value="${tagItem.id_tag}" id="TagItem${tagItem.id_tag}"
             style="background-color: ${tagItem.cor_tag}; color: ${tagItem.cor_texto}"
             ${tagItem.titulo === tag ? 'selected' : ''}>
        ${tagItem.titulo}
     </option>`
  ).join('') : '';

  configPanel.innerHTML = `
    <main class="main-info" id="main_config">
      <div class="content-config">
        <a class="config-exit" id="closeConfig">x</a>
      </div>
      <h2>Cartão do Comentário</h2>
      <div class="container-informacoes">
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
            <select id="responsavel-select" style="background-color: transparent; color: inherit; border: 1px solid #807E7E;">
              ${responsaveisOptions}
            </select>
          </p>
        </div>
        <div class="informacoes">
          <p>Comentário:</p>
          <p>${comentario}</p>
        </div>
      </div>
      <div class="action-buttons">
        <a class="btn btn-check" href="#" title="Finalizar">✔</a>
        <a class="btn btn-cancel" onclick="confirmarCancelar()" href="#" title="Excluir">✖</a>
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

};

async function atualizarNovaTag(id_cartao) {
  let selection = document.getElementById("tag-select");
  let newTag = selection.options[selection.selectedIndex].text;
  let newTagId = selection.options[selection.selectedIndex].value;

  // let id_tag = "TagItem" + newTagId
  // let option = document.getElementById(id_tag)

  // let backColor = option.backgroundColor
  // let colorFont = option.color

  await fetchTags(false);
  tag_nova = todasAsTags.filter(tag => tag.titulo === newTag);

  let backColor = tag_nova['0'].cor_tag;
  let colorFont = tag_nova['0'].cor_texto;

  fetch('http://127.0.0.1:5000/atualizar-tag-cartao', {  
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        cardId: id_cartao,
        newTag: newTag
    })
  })
  .then(response => {
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log('Responsável atualizado com sucesso:', data.message);
  })
  .catch(error => {
    console.error('Erro ao atualizar responsável do cartão:', error);
  });

  todosOsCartoes = todosOsCartoes.map(cartao => {
    if (cartao.ID_Cartao === 1) {
        return { ...cartao, tag_titulo: newTag, cor_tag: backColor, cor_texto_tag: colorFont};
    }
    return cartao;
  });

  renderizarCartoes(todosOsCartoes.filter(cartao => cartao.ID_Cartao === id_cartao));
};

function atualizarNovoResponsavel(id_cartao) {
  var selection = document.getElementById("responsavel-select");
  var newResponsavel = selection.options[selection.selectedIndex].text;

  fetch('http://127.0.0.1:5000/atualizar-responsavel', {  
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        cardId: id_cartao,
        newResponsavel: newResponsavel
    })
  })
  .then(response => {
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log('Responsável atualizado com sucesso:', data.message);
  })
  .catch(error => {
    console.error('Erro ao atualizar responsável do cartão:', error);
  });
};

function atualizarEtapaCartao(cardId, newFluxoId) {
  fetch('http://127.0.0.1:5000/api/atualizar-etapa-cartao', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          cardId: cardId,
          newFluxoId: newFluxoId
      })
  })
  .then(response => {
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
  })
  .then(data => {
      console.log('Etapa do cartão atualizada com sucesso:', data);
      // Atualiza o objeto local do cartão
      const cartao = window.todosOsCartoes.find(c => c.ID_Cartao == cardId);
      if (cartao) {
          cartao.id_fluxo = newFluxoId;
      }
  })
  .catch(error => {
      console.error('Erro ao atualizar etapa do cartão:', error);
      // Aqui você pode adicionar lógica para reverter a mudança visual
  });
};

fetchKanban();