function addfocus(){
    let parent = this.parentNode.parentNode
    parent.classList.add("focus")
};

function remfocus(){
    let parent = this.parentNode.parentNode
    if(this.value == ""){
        parent.classList.remove("focus")
    };
};

document.querySelectorAll(".form__input").forEach(input=>{
    input.addEventListener("focus",addfocus)
    input.addEventListener("blur",remfocus)
});

// Coletar usuários com a opção de rederizá-los
window.iniciarLogin = async function () {

    window.email = document.getElementById("email_value").value;
    window.senha = document.getElementById("key_value").value;

    try {
        const response = await fetch(`${window.BACKEND_URL}/verificar-login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: email,
                senha: senha,
            })
        });
  
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  
        const resultado = await response.json();

        if (resultado.status) { 
            window.permissao = resultado.permissoes;
            if (permissao != "desativado"){
                iniciar();
            } else {
                alert('Este usuário encontra-se desativado. Por favor, fale com um administrador!');
            };
        } else {
            alert('O usuário ou senha está errado(a). Por favor, tente novamente!');
        };

    } catch (error) {
        console.error('Erro ao ativar usuários:', error);
    };
};

window.iniciar = async function () {
    const body = document.getElementById("body__");
    body.innerHTML =`
    <div class="container" id="docker">
        <aside class="menu" id="menu">
            <a href="#" class="btn-menu-2" id="menuBtn">≡</a>
            <a href="#" class="selecionado" id="btn-home">Home</a>
            <a href="#" class="opcao" id="btn-finalizados">Finalizados</a>
            <a href="#" class="opcao" id="btn-excluidos">Excluídos</a>
        </aside>
        <div class="content" id="content">
            <div class="cabecalho">
                <img class="img-login" src="src/components/assets/img_login.png" alt="Imagem de Login" id="btn-login"/>
            </div>
            <div class="kanban-div" id="content-kanban">
                <div class="kanban" id="kanban">
                </div>
            </div>
        </div>
    </div>
    `;

    if (permissao == "admin") {
        const img = document.createElement("img");
        img.className = "img-config";
        img.src = "src/components/assets/config.png";
        img.id = "config";
        img.alt = "Imagem de config";
        img.title = "Configurações";
    
        document.getElementById("menu").appendChild(img);
        document.getElementById('config').addEventListener('click', ativarConfig);
    }

    await fetchKanban();
    document.getElementById('menuBtn').addEventListener('click', desativarMenu);
    document.getElementById('btn-finalizados').addEventListener('click', abrirFinalizados);
    document.getElementById('btn-home').addEventListener('click', abrirHome);
    document.getElementById('btn-excluidos').addEventListener('click', abrirExluidos);

};