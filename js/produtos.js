const produtosContainer = document.querySelector("#produtos-container");


async function adicionarProdutos(){
    const arquivo = await fetch("./assets/dados/produtos.json");
    const dados = await arquivo.json();
    dados.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("card", "product");
        div.innerHTML = `
            <img src="${item.imagem}" alt="${item.descricao}">
            <div class="card-content">
                <h4>${item.nome}</h4>
                <p>${item.preco}</p>
                <button class="btn dark">Comprar</button>
            </div>
        `
        produtosContainer.appendChild(div);
    });
}

adicionarProdutos();