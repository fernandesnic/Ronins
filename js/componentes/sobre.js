export function sobre(){
    const content = `
        <section id="esporte" class="section">
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
                        <h3>Como o jogo é?</h3>
                        <p>O jogo é disputado em quadras de basquete, com quatro jogadores de cada time em quadra. Os
                            atletas usam cadeiras de rodas especialmente projetadas para o esporte.</p>
                        <p>O objetivo é atravessar a linha de gol do adversário com a bola, que deve ser quicada ou
                            passada a cada 10 segundos.</p>
                        <h3>Regras Principais</h3>
                        <p>Duração: 4 quartos de 8 minutos (tempo parado)
                            Pontuação: Gol = 1 ponto (ambas rodas + bola na linha)
                        </p>
                        <h3>Regras de posse:</h3>
                        <li>Quicar/passar a cada 10 segundos</li>
                        <li>Limite de 40 segundos por posse</li>
                        <li>12 segundos para cruzar o meio-campo</li>
                        <br>
                        <h3>Contato entre Cadeiras: Permitido, mas não são aceitos:</h3>
                        <li>Tocar no adversário</li>
                        <li>Contato perigoso (falta grave)</li>
                        <li>Bloquear com as mãos</li>
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
        </section>
        <!-- Seção Sobre o Time -->
        <section id="time" class="section dark-bg">
            <div class="container">
                <h2>Nossa História</h2>
                <p>Primeiro time de Rugby em Cadeira de Rodas da cidade de São Paulo, o Ronins Quad Rugby foi fundado em
                    2017 por um grupo de atletas liderado pelo atual presidente Lucas Junqueira, e pelo vice-presidente
                    Denis Cairiac. A equipe realiza seus treinamentos nas dependências do Centro de Treinamento
                    Paralímpico do CPB, na capital paulista. O Ronis conta com um treinador-atleta no comando de suas
                    atividades, tendo como técnico desde sua fundação Alexandre Taniguchi, um dos pioneiros da
                    modalidade no país.</p>

                <h3>Nossos Jogadores</h3>
                <div id="player-container" class="cards-container">
                    <!-- Jogador 1 -->
                    <!-- Repetir para outros jogadores -->
                </div>
            </div>
        </section>

        <!-- Seção Sobre a Causa -->
        <section id="causa" class="section">
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
                    <br>
                    <br>
                    <div class="cta">
                        <h3>Junte-se a nós!</h3>
                        <p>Seja um apoiador, patrocinador ou voluntário.</p>
                        <a href="#contato" class="btn dark">Quero ajudar</a>
                    </div>
                </div>
            </div>
        </section>

    `
    return content
}