// Atualizar posição do cartão no banco de dados modificando o IdFluxo com base no Id do cartão
window.atualizarEtapaCartao = async function(cardId, newFluxoId) {

    // Recarregar todos os fluxos
    const todosOsFluxos = await fetchFluxos(false);
    console.log('teste', todosOsFluxos);
  
    let fluxoFiltrado = todosOsFluxos.find(fluxo => fluxo.id_fluxo === Number(newFluxoId));
  
    let nomeFluxo = fluxoFiltrado.nome; 
    console.log(nomeFluxo);
  
    fetch('http://127.0.0.1:5000/api/atualizar-etapa-cartao', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            cardId: cardId,
            newFluxoId: newFluxoId,
            nomeFluxo: nomeFluxo
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
    })
    .catch(error => {
        console.error('Erro ao atualizar etapa do cartão:', error);
    });
};

// Atualizar Histórico, especialmente ao adicionar uma mensagem no cartão expandido
window.atualizarHistorico = async function(msg, id_cartao) {

    await fetch('http://127.0.0.1:5000/atualizar-historico-msgs', {  
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          cardId: id_cartao,
          mensagem: msg
      })
    })    
    .then(response => {
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .catch(error => {
      console.error('Erro ao atualizar responsável do cartão:', error);
    });
  
};

// atualizar novo responsável com base no id do cartão
window.atualizarNovoResponsavel = function(id_cartao) {
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

    let msg = `O responsável do cartão foi modificada para ${newResponsavel}.`

    const textMsg = document.createElement('p');
    textMsg.innerHTML = `- ${msg}`;
  
    const historico = document.getElementById("info-txt-historico");
    historico.appendChild(textMsg);
};

// atualizar nova tag no histórico com base no cartão selecionado
window.atualizarNovaTag = async function(id_cartao) {
    let selection = document.getElementById("tag-select");
    let newTag = selection.options[selection.selectedIndex].text;
    let newTagId = selection.options[selection.selectedIndex].value;
  
    todasAsTags = await fetchTags(false);
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
      titulo = data['newTag'];
    })
    .catch(error => {
      console.error('Erro ao atualizar responsável do cartão:', error);
    });
  
    adicionarTagHistorico(newTag);
    modificarCartao(id_cartao, newTag, backColor, colorFont);
};
  
function adicionarTagHistorico(newTag) {
  
    let new_tag = newTag;
    let msg = `A tag do cartão foi modificada para ${new_tag}.`
  
    const textMsg = document.createElement('p');
    textMsg.innerHTML = `- ${msg}`;
  
    const historico = document.getElementById("info-txt-historico");
    historico.appendChild(textMsg);
  
};

function modificarCartao(id_cartao, novoTitulo, novaCorTag, novaCorTexto) {

    console.log(`Atualizando badge para o ID_Cartao: ${id_cartao}`);
  
    let badge = document.getElementById(`badge-${id_cartao}`);
    let span = document.getElementById(`span-${id_cartao}`);
    
    if (!badge) {
      console.error(`Elemento badge-${id_cartao} não encontrado!`);
    } else {
      console.log(`Badge encontrado:`, badge);
    }
    
    if (!span) {
      console.error(`Elemento span-${id_cartao} não encontrado!`);
    } else {
      console.log(`Span encontrado:`, span);
    }
    badge.style.backgroundColor = novaCorTag || '#ccc';
    badge.style.color = novaCorTexto || '#000';
    span.textContent = novoTitulo || 'Sem Tag';
  
};

// Função auxiliar para enviar mudanças na configuração de fluxos para o servidor
window.enviarParaServidorFluxo = function(dados) {
  fetch('http://127.0.0.1:5000/salvar-fluxos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
  })
  .then(response => response.json())
  .then(data => console.log('Resposta do servidor:', data))
  .catch(error => console.error('Erro ao salvar fluxos:', error));
};

// Enviar informações de configuração para a base de dados
window.salvarConfiguracao = async function() {
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

// Enviar alterações nas configurações de usuários para o servidor
window.enviarParaServidorUsers = function() {
  
  fetch('http://127.0.0.1:5000/salvar-usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(window.todosOsUsuarios)
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

// Enviar mudanças nas tags
async function enviarParaServidorTags() {
  atualizarTituloTags();
  window.todasAsTags.forEach(({ id_tag }) => {
    atualizarCores(id_tag);
  });

  fetch('http://127.0.0.1:5000/salvar-tags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(window.todasAsTags)
  })
  .then(response => response.json())
  .then(data => console.log('Resposta do servidor:', data))
  .catch(error => console.error('Erro ao salvar tags:', error));

  alert("Alterações salvas com sucesso!");
};

// Atualizar status de um cartão
window.mudarStatus = async function(id_cartao, status, titulo, cor_tag, cor_texto, nomeAdmin) {
  try {
    console.log('Iniciando mudarStatus para o cartão:', id_cartao);
  
    const response = await fetch('http://127.0.0.1:5000/atualizar-status', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
      },
      body: JSON.stringify({
        cardId: id_cartao,
        status: status,
        titulo: titulo,
        cor_tag: cor_tag,
        cor_texto: cor_texto,
        Nome_admin: nomeAdmin
      })
    });
  
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    };
  
  } catch (error) {
      console.error('Erro ao atualizar status:', error);
      throw error;
  };
};