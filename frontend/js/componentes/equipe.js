// Pede o export com o NOME "BACKEND_URL"
import { BACKEND_URL } from '../url.js'; // <-- A CHAVE SÃO AS CHAVES {}
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
                    <h3>Comissão Técnica</h3>
                    <div id="comissao-container" class="cards-container">
                        </div>
                </div>
            </div>
        </section>
    `;



}

export async function adicionarEquipe() {
    try{
        const response = await fetch(`${BACKEND_URL}/api/public/equipe`);

        const data = await response.json().catch(() => ({}));
        console.log(data)
        if (!response.ok) {
            const msg = data?.error || `Erro na API: ${response.status}`;
            throw new Error(msg);
        }

        const jogadores = data.jogadores
        const staff = data.staff
        adicionarJogadores(jogadores)
        adicionarStaff(staff)
    }catch{}
    
}


export async function adicionarJogadores(jogadores){
    const playerContainer = document.querySelector("#player-container");
    if(!playerContainer){
        console.error('Container #player-container não encontrado. Certifique-se que equipe() foi inserido no DOM antes de chamar adicionarEquipe().');
        return;
    }
    try{
        if (!jogadores || jogadores.length === 0) {
            playerContainer.innerHTML += "<p>Nenhum jogador encontrado.</p>";
            return;
        }
        jogadores.forEach(item => {
            if(!item.on_team){
                return
            }
            const div = document.createElement("div");
            div.classList.add("card", "player");
            div.innerHTML = `
                <img src="assets/photos/jogadores/${item.foto}" alt="Jogador: ${item.nome}">
                <div class="card-content">
                    <h4>${item.nome}</h4>
                    <p>Número da camisa: ${item.numero_camisa}</p>
                    <p>Classificação: ${item.classificacao}</p>
                    <p>Nacionalidade: ${item.nacionalidade}</p>
                </div>
            `
            playerContainer.appendChild(div);
        });
    }catch(error){
        console.error("Erro ao buscar e adicionar jogadores:", error);
        playerContainer.innerHTML += `<p style="color: red;">Falha ao carregar jogadores. (${error.message})</p>`;
    }
    
}

export async function adicionarStaff(staff){
    const comissaoContainer = document.querySelector("#comissao-container");
    if(!comissaoContainer){
        console.error('Container #comissao-container não encontrado. Certifique-se que equipe() foi inserido no DOM antes de chamar adicionarEquipe()')
        return;
    }
    try{

        if (!staff || staff.length === 0) {
            comissaoContainer.innerHTML += "<p>Nenhum membro da comissao encontrado.</p>";
            return;
        }

        staff.forEach(item => {
            const div = document.createElement("div");
            div.classList.add("card", "staff");
            div.innerHTML = `
                <img src="assets/photos/staff/${item.foto}" alt="${item.nome}">
                <div class="card-content">
                    <h4>${item.nome}</h4>
                    <p>${item.funcao}</p>
                    <p>${item.descricao}</p>
                </div>
            `
            comissaoContainer.appendChild(div);
        });
    }catch(error){
        console.error("Erro ao buscar e adicionar staff:", error);
        playerContainer.innerHTML += `<p style="color: red;">Falha ao carregar staff. (${error.message})</p>`;
    }
    
}