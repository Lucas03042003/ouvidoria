// Função inicial para coletar os fluxos do banco de dados e, desse modo, ativar o Kanban
window.fetchKanban = async function() {
    try {
        const response = await fetch('http://127.0.0.1:5000/ativar-fluxo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        });
  
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  
        const todosOsKanbans = await response.json();
        renderizarKanban(todosOsKanbans);
    } catch (error) {
        console.error('Erro ao ativar fluxos:', error);
    };
};

// Função para buscar os cartões no banco de dados e, desse modo, ativar a visualização dos cartões
window.fetchCartoes = async function(renderizar, status) {
    try {
        const response = await fetch('http://127.0.0.1:5000/coletar-cartoes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: status, email:window.email})
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const todosOsCartoes = await response.json();
        console.log('Cartões coletados:', todosOsCartoes);

        // Chama a função para renderizar os cartões
        if (renderizar) {
            renderizarCartoes(todosOsCartoes);
        } else {
            return todosOsCartoes;
        };
    } catch (error) {
        console.error('Erro ao coletar cartões:', error);
    };
};

// Coletar fluxos com a opção de renderizá-los
window.fetchFluxos = async function(renderizar) {
    try {
        const response = await fetch('http://127.0.0.1:5000/ativar-fluxo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        });
  
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  
        todosOsFluxos = await response.json();
        if (renderizar) {  
          renderizarFluxos(todosOsFluxos);
        } else {
            return todosOsFluxos
        };
    } catch (error) {
        console.error('Erro ao ativar fluxos:', error);
    };
};

// Coletar tags com a opção de renderizá-las
window.fetchTags = async function(renderizar) {
    try {
        const response = await fetch('http://127.0.0.1:5000/ativar-tag', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        });
  
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  
        window.todasAsTags = await response.json();
        if (renderizar) {  
          renderizarTags(todasAsTags);
        } else {
            return window.todasAsTags;
        };
    } catch (error) {
        console.error('Erro ao ativar tags:', error);
    };
};

// Coletar usuários com a opção de rederizá-los
window.fetchUsuarios = async function(renderizar) {
    try {
        const response = await fetch('http://127.0.0.1:5000/ativar-usuarios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        });
  
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  
        window.todosOsUsuarios = await response.json();
        if (renderizar) {    
            renderizarUsuarios(todosOsUsuarios);
        } else {
            return todosOsUsuarios;
        };
    } catch (error) {
        console.error('Erro ao ativar usuários:', error);
    };
};

// Coletar histórico de um cartão específico com a opção de rederizá-los
window.fetchHistorico = async function(id_cartao) {
    try {
        console.log('Iniciando fetchHistorico para o cartão:', id_cartao);
  
        const response = await fetch('http://127.0.0.1:5000/ativar-historico', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json', 
          },
          body: JSON.stringify({
            cardId: id_cartao
          })
        });
  
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        };
  
        const historicoData = await response.json();
        console.log('Histórico obtido:', historicoData);
  
        const todosOsHistoricos = historicoData;
        return todosOsHistoricos;
  
    } catch (error) {
        console.error('Erro ao ativar Histórico:', error);
        throw error;
    };
};

window.fetchSistemaConfig = async function() {
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