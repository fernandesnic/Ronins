export function sobre(){
    const content = `
        <section id="sobre">
            <div id="esporte" class="section">
                <div class="container">
                    <h2>O Rugby em Cadeira de Rodas</h2>
                    <div class="content-grid">
                        <div class="text-content">
                            <h3>O que é o Rugby em Cadeira de Rodas?</h3>
                            <p>Também conhecido como Quad Rugby, é um esporte paralímpico emocionante desenvolvido
                                especialmente para atletas com deficiência nos membros superiores e inferiores.</p>
                            <h3>Classificação dos atletas</h3>
                            <p> Os atletas são classificados por nível de funcionalidade em uma escala de 0.5 a 3.5 pontos
                                (sendo 3.5 o maior potencial funcional). Cada equipe pode ter até 4 jogadores em quadra
                                simultaneamente, com a soma total de pontos não podendo exceder 8, garantindo o equilíbrio
                                do jogo.</p>
                            <p>
                                Caso queira ver todas regras
                                <a href="https://worldwheelchair.rugby/wp-content/uploads/2025/02/241223-Wheelchair-Rugby-International-Rules-WWR-FINAL.pdf"
                                    target="_blank">clique aqui</a>
                            </p>
                        </div>
                        <div class="image-content">
                            <img src="assets/photos/Wheelchair Quad Rugby.png" alt="Rugby em cadeira de rodas">
                        </div>
                    </div>
                </div>
            </div>
            <div id="time" class="section dark-bg">
                <div class="container">
                    <h2>Nossa História</h2>
                    <p>Primeiro time de Rugby em Cadeira de Rodas da cidade de São Paulo, o Ronins Quad Rugby foi fundado em
                        2017 por um grupo de atletas liderado pelo atual presidente Lucas Junqueira, e pelo vice-presidente
                        Denis Cairiac...</p>

                    <h3>Nossos Jogadores</h3>
                    <div id="player-container" class="cards-container">
                    </div>
                </div>
            </div>
            <div id="causa" class="section">
                <div class="container">
                    <h2>Nossa Causa</h2>
                    <div class="cause-content">
                        <p>Acreditamos no poder transformador do esporte para pessoas com deficiência. Através do rugby,
                            promovemos:</p>
                        <ul>
                            <li>Inclusão social</li>
                            <li>Autoestima e superação</li>
                            <li>Saúde física e mental</li>
                            <li>Visibilidade para a causa da pessoa com deficiência</li>
                        </ul>
                        <div class="cta">
                            <h3>Junte-se a nós!</h3>
                            <p>Seja um apoiador, patrocinador ou voluntário.</p>
                            <a href="#contato" class="btn dark">Quero ajudar</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `
    return content
}

export async function adicionarJogadores(){
    const playerContainer = document.querySelector("#player-container");
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
