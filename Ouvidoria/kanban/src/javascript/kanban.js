let todosOsKanbans = [];
window.todosOsCartoes = [];
 
async function fetchKanban() {
  try {
      const response = await fetch('http://127.0.0.1:5000/ativar-fluxo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      todosOsKanbans = await response.json();
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
        expandirCard(cartao.Cliente, cartao.Data_comentario, cartao.tag_titulo);
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
        e.currentTarget.classList.remove('cards-hover');
        const dragCard = document.querySelector('.kanban-card.dragging');
        if (dragCard) {
          e.currentTarget.appendChild(dragCard);
        }
      });
    });
  }
  
  function fecharCard() {
    const elemento = document.querySelector('.container');
    elemento.style.filter = 'none';
  
    const overlay = document.getElementById('overlay');
    if (overlay) {
      overlay.remove();
    }
  
    const configPanel = document.getElementById('configPanel');
    if (configPanel) {
      configPanel.remove();
    }
  }
  
  function confirmarCancelar() {
    let confirmar = confirm("Você irá deletar esse cartão. Deseja mesmo continuar?");
    if (confirmar) {
      fecharCard();
    }
  }
  
  function expandirCard(cliente, data, tag) {
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
    configPanel.innerHTML = `
      <main class="main-config" id="main_config">
        <div class="content-config">
          <a class="config-exit" id="closeConfig">x</a>
        </div>
        <h2>Cartão do paciente</h2>
        <div class="action-buttons">
          <a class="btn btn-check" href="#" title="Finalizar">✔</a>
          <a class="btn btn-cancel" onclick="confirmarCancelar()" href="#" title="Excluir">✖</a>
        </div>
      </main>
    `;
  
    document.body.appendChild(configPanel);
    
    document.getElementById('closeConfig').addEventListener('click', fecharCard);
  }

function configKanban() {
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

  card.addEventListener('dblclick', expandirCard);
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
};

fetchKanban();
configKanban();