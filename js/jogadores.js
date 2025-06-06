const playerContainer = document.querySelector("#player-container");


async function adicionarJogadores(){
    const arquivo = await fetch("./assets/dados/jogadores.json");
    const dados = await arquivo.json();
    dados.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("card", "player");
        div.innerHTML = `
            <img src="${item.imagem}" alt="${item.nome}">
            <div class="card-content">
                <h4>${item.nome}</h4>
                <p>${item.funcao}</p>
                <p>${item.descricao}</p>
            </div>
        `
        playerContainer.appendChild(div);
    });
}

adicionarJogadores();