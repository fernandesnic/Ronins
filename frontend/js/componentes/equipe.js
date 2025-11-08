/**
 * Função que retorna a string HTML da seção de Equipe.
 * @returns {string} O HTML completo da página de Equipe.
 */
export function equipe() {
    return `
        <section id="equipe-page" class="section">
            <div id="time" class="section-content"> 
                <div class="container">
                    <h2>Nossa História</h2>
                    <p>
                        Ronins Quad Rugby é o pioneiro e primeiro time de Rugby em Cadeira de Rodas da cidade de São Paulo. Fundado em 2017 por um grupo visionário de atletas liderado pelo atual presidente Lucas Junqueira e com a colaboração inicial do cofundador Denis Cairiac, o Ronins nasceu com a missão clara de utilizar o esporte como um poderoso meio de superação e transformação de vida.

O trabalho da equipe vai muito além das quatro linhas. Com uma visão voltada para o futuro e para o desenvolvimento da modalidade, o Ronins se destaca ativamente na formação de novos atletas e na constante busca por aprimoramento através de intercâmbio de experiências com outras equipes, elevando o nível do esporte adaptado no país.

Essa dedicação incansável culminou em um ano histórico: o Ronins Quad Rugby sagrou-se Campeão Brasileiro de Rugby em Cadeira de Rodas em 2025, alcançando o título nacional pela primeira vez e marcando uma de suas maiores conquistas desde a fundação. Este triunfo é a prova de que a resiliência e o espírito de equipe são as marcas inegáveis do Ronins.
                    </p>

                    <h3>Nossos Jogadores</h3>
                    <div id="player-container" class="cards-container">
                        </div>
                    <h5>Comissão Técnica</h5>
                    <div id="comissao-container" class="cards-container">
                        </div>
                </div>
            </div>
        </section>
    `;



}

export async function adicionarJogadores(){
    const playerContainer = document.querySelector("#player-container");
    const arquivo = await fetch("assets/dados/jogadores.json");
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

export async function adicionarStaff(){
    const comissaoContainer = document.querySelector("#comissao-container");
    const arquivo = await fetch("assets/dados/staff.json");
    const dados = await arquivo.json();
    dados.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("card", "staff");
        div.innerHTML = `
            <img src="${item.imagem}" alt="${item.nome}">
            <div class="card-content">
                <h4>${item.nome}</h4>
                <p>${item.funcao}</p>
                <p>${item.descricao}</p>
            </div>
        `
        comissaoContainer.appendChild(div);
    });
}