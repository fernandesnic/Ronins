export function produtos(){
    const content = `
        <section id="produtos" class="section dark-bg">
            <div class="container">
                <h2>Nossos Produtos</h2>
                <p>Adquira nossos produtos e ajude a manter o time em atividade:</p>
                <div id="produtos-container" class="cards-container">
                    
                </div>
            </div>
        </section>
    `
    return content
}

export async function adicionarProdutos(){
    const produtosContainer = document.querySelector("#produtos-container");
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
