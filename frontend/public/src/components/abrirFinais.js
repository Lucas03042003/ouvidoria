window.abrirHome = function() {
    if (document.getElementById('btn-home').className != 'selecionado') {
        document.getElementById('btn-home').className = 'selecionado';
        document.getElementById('btn-finalizados').className = 'opcao';
        document.getElementById('btn-excluidos').className = 'opcao';
        
        let centro = document.getElementById("content-kanban");
        centro.innerHTML =`
            <div class="kanban" id="kanban">
            </div>
        `;
        
        fetchKanban();

        document.getElementById('btn-finalizados').addEventListener('click', abrirFinalizados);
        document.getElementById('btn-excluidos').addEventListener('click', abrirExluidos);
    };
};

window.abrirFinalizados = async function() {
    if (document.getElementById('btn-finalizados').className != 'selecionado') {
      // Atualiza os estilos dos botões
      document.getElementById('btn-finalizados').className = 'selecionado';
      document.getElementById('btn-home').className = 'opcao';
      document.getElementById('btn-excluidos').className = 'opcao';
  
      let centro = document.getElementById("content-kanban");
      let status = "finalizado";
  
      // Busca os cartões "finalizados"
      const todosOsCartoes = await fetchCartoes(false, status);
  
      centro.innerHTML = ``;
  
      // Agrupa os cartões em pares para criar "duplas-cards"
      const paresDeCartoes = [];
      for (let i = 0; i < todosOsCartoes.length; i += 2) {
        paresDeCartoes.push(todosOsCartoes.slice(i, i + 2));
      }
  
      let list = document.createElement('div');
      list.className = "finalizados-list";
      list.innerHTML = ``;
      centro.appendChild(list);
  
      paresDeCartoes.forEach(par=>{
        let dupla = document.createElement('div');
        dupla.className = "dupla-cards";
        list.appendChild(dupla);
  
        par.forEach(cartao=>{
          let nomeSimplificado = String(cartao.nomeAdmin).slice(0,10).concat("...")

          let card = document.createElement('div');
          card.className = "finalizados-cards";
          card.innerHTML = `
            <div class="badge-exfin" style="background-color: ${cartao.ccor_tag || '#ccc'}; color: ${cartao.ccor_texto || '#000'};">
              <span>${cartao.ctitulo_tag || 'Sem Tag'}</span>
            </div>
            <p><strong>Cliente:</strong> ${cartao.Cliente}</p>
            <p><strong>Data:</strong> ${new Date(
              cartao.Data_comentario
            ).toLocaleDateString()}</p>
            <p><strong>Conclusão:</strong> ${new Date(
              cartao.Data_conclusao
            ).toISOString().split('T')[0]}</p>
            <p><strong>Admin:</strong> ${nomeSimplificado}</p>
          `;
  
          dupla.appendChild(card);
  
          card.addEventListener('dblclick', function() {expandirCardFinal(cartao, status)});
  
        });
      });
  
      // Atualiza os eventos dos botões
      document.getElementById('btn-home').addEventListener('click', abrirHome);
      document.getElementById('btn-excluidos').addEventListener('click', abrirExluidos);
    };
};
  
window.abrirExluidos = async function() {
    if (document.getElementById('btn-excluidos').className != 'selecionado') {
      document.getElementById('btn-finalizados').className = 'opcao';
      document.getElementById('btn-home').className = 'opcao';
      document.getElementById('btn-excluidos').className = 'selecionado';
  
      let centro = document.getElementById("content-kanban");
      let status = "excluído";
      
      const todosOsCartoes = await fetchCartoes(false, status);
      console.log('aqui', todosOsCartoes);
  
      centro.innerHTML = ``;
  
      // Agrupa os cartões em pares para criar "duplas-cards"
      const paresDeCartoes = [];
      for (let i = 0; i < todosOsCartoes.length; i += 2) {
        paresDeCartoes.push(todosOsCartoes.slice(i, i + 2));
      }
  
      let list = document.createElement('div');
      list.className = "finalizados-list";
      list.innerHTML = ``;
      centro.appendChild(list);
  
      paresDeCartoes.forEach(par=>{
        let dupla = document.createElement('div');
        dupla.className = "dupla-cards";
        list.appendChild(dupla);
  
        par.forEach(cartao=>{
          let nomeSimplificado = String(cartao.nomeAdmin).slice(0,10).concat("...")

          let card = document.createElement('div');
          card.className = "finalizados-cards";
          card.innerHTML = `
            <div class="badge-exfin" style="background-color: ${cartao.ccor_tag || '#ccc'}; color: ${cartao.ccor_texto || '#000'};">
              <span>${cartao.ctitulo_tag || 'Sem Tag'}</span>
            </div>
            <p><strong>Cliente:</strong> ${cartao.Cliente}</p>
            <p><strong>Data:</strong> ${new Date(
              cartao.Data_comentario
            ).toLocaleDateString()}</p>
            <p><strong>Exclusão:</strong> ${new Date(
              cartao.Data_conclusao
            ).toLocaleDateString()}</p>
            <p><strong>Admin:</strong> ${nomeSimplificado}</p>
          `;
  
          dupla.appendChild(card);
  
          card.addEventListener('dblclick', function() {expandirCardFinal(cartao, status)});
  
        });
      });
  
      document.getElementById('btn-home').addEventListener('click', abrirHome);
      document.getElementById('btn-finalizados').addEventListener('click', abrirFinalizados);
    };
};

async function expandirCardFinal(cartao, stat) {

    let id_cartao = cartao.ID_Cartao;
    let cliente = cartao.Cliente;
    let data = cartao.Data_comentario;
    let tag = cartao.ctitulo_tag;
    let responsavel = cartao.nomeAdmin;
    let cor_tag = cartao.ccor_tag;
    let cor_texto_tag = cartao.ccor_texto;
    let comentario = cartao.Comentario;
  
    let status = "Exclusão";  
    if (stat == "finalizado") {
      status = "Finalização";
    }
  
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
            <a id="tag-select" class="badge-exfin" style="background-color: ${cor_tag  || '#ccc'}; color: ${cor_texto_tag || '#000'}; margin-bottom: 0px;">${tag}</a>
            </a>
            <p>Cliente: ${cliente}</p>
            <p>Data do comentário: ${data}</p>
            <p>${status}: ${new Date(cartao.Data_conclusao).toISOString().split('T')[0]}</p>
            <p>Responsável: ${responsavel}</p>
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
      </main>
    `;
  
    document.body.appendChild(configPanel);
    document.getElementById('closeConfig').addEventListener('click', fecharCard);
  
};
  