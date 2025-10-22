import { produtos, adicionarProdutos } from "./componentes/produtos.js";
import { adicionarJogadores } from "./componentes/sobre.js";
import { checkout, initCheckout } from "./componentes/checkout.js"; // ADICIONADO

const main = document.querySelector("#app");

// Guarda o HTML original da página principal para poder restaurá-lo depois
let initialMainHTML = '';

// Função que decide o que mostrar
const router = () => {
    const hash = window.location.hash;

    if (hash === '#produtos') {
        // Se o link for #produtos, carrega a página de produtos
        main.innerHTML = produtos();
        adicionarProdutos();
    } else if (hash === '#checkout') {
        // Página de checkout
        main.innerHTML = checkout();
        initCheckout();
    } else {
        // Para qualquer outro link (#home, #sobre, etc.), restaura o conteúdo principal
        main.innerHTML = initialMainHTML;
        // Recarrega os jogadores, pois o container deles foi recriado
        adicionarJogadores();
    }
};

// Quando a página carregar pela primeira vez:
window.addEventListener("DOMContentLoaded", () => {
    // 1. Salva o conteúdo principal que está no HTML
    initialMainHTML = main.innerHTML;
    
    // 2. Carrega os dados dinâmicos da página principal (os jogadores)
    adicionarJogadores();

    // 3. Verifica se o usuário já chegou na página com #produtos no link
    if (window.location.hash === '#produtos') {
        router();
    }
});

// Quando o link (hash) mudar, chama o router novamente
window.addEventListener("hashchange", router);