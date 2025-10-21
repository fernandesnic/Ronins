import { produtos, adicionarProdutos } from "./componentes/produtos.js";
import { sobre, adicionarJogadores } from "./componentes/sobre.js";
import home from "./componentes/home.js";
import contato from "./componentes/contato.js";
import galeriadetrofeus from "./componentes/galeriatrofeus.js"
const main = document.querySelector("#app");

// Função que decide o que mostrar
const router = () => {
    const hash = window.location.hash;
    
    switch(hash){
        // Se o link for #home, #sobre, #contato ou qualquer outro, 
        // ele adiciona os modulos no html e recarrega os jogadores
        case '#home':
        case '#sobre':
        case '#contato':
        default:
            main.innerHTML = home();
            main.innerHTML += sobre();
            main.innerHTML += contato();
            adicionarJogadores();
            break;
        // Se o link for #produtos, muda pra página de produtos
        case '#produtos':
            main.innerHTML = produtos();
            adicionarProdutos();
            break;
        // Se o link for #galeria-de-trofeus, muda a pagina pra galeria
        case '#galeriadetrofeus':
            main.innerHTML = galeriadetrofeus();
            break;
    }

    // if (hash === '#produtos') {
    //     // Se o link for #produtos, carrega a página de produtos
    //     main.innerHTML = produtos();
    //     adicionarProdutos();
    // } else {
    //     // Para qualquer outro link (#home, #sobre, etc.), restaura o conteúdo principal
    //     main.innerHTML = initialMainHTML;
    //     // Recarrega os jogadores, pois o container deles foi recriado
    //     adicionarJogadores();
    // }
};

// Quando a página carregar pela primeira vez:
window.addEventListener("DOMContentLoaded", () => {
    router();
    // // 1. Salva o conteúdo principal que está no HTML
    // initialMainHTML = main.innerHTML;
    
    // // 2. Carrega os dados dinâmicos da página principal (os jogadores)
    // adicionarJogadores();

    // // 3. Verifica se o usuário já chegou na página com #produtos no link
    // if (window.location.hash === '#produtos') {
    //     router();
    // }
});

// Quando o link (hash) mudar, chama o router novamente
window.addEventListener("hashchange", router);