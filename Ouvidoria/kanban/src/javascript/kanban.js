function fecharCard() {
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

function confirmarCancelar() {
    let confirmar = confirm("Você irá deletar esse cartão. Deseja mesmo continuar?");

    if(confirmar) {
        fecharCard();
    };
};

function expandirCard(cliente, data, tag) {
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
          <!-- Adicionando os novos links -->
          <div class="action-buttons">
            <a class="btn btn-check" href="#" title="Finalizar">✔</a>
            <a class="btn btn-cancel" onclick="confirmarCancelar()" href="#" title="Excluir">✖</a>
          </div>
        </main>
    `;

    document.body.appendChild(configPanel);
    
    // Adicionar evento para fechar as configurações
    document.getElementById('closeConfig').addEventListener('click', fecharCard);
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
