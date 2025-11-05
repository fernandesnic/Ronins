// router.js

// Importações dos módulos de conteúdo
import { produtos, adicionarProdutos } from "./componentes/produtos.js";
import { equipe, adicionarJogadores, adicionarStaff } from './componentes/equipe.js'; 


const main = document.querySelector("#app");

// Guarda o HTML original da página principal para poder restaurá-lo depois
let initialMainHTML = ''; 

// Função que decide o que mostrar
const router = () => {
 const hash = window.location.hash;

if (hash === '#produtos') {
// Rota #PRODUTOS
 main.innerHTML = produtos();
 adicionarProdutos();
        
    } else if (hash === '#equipe') { 
        // Rota #EQUIPE: Carrega o conteúdo da equipe e isola a página
        main.innerHTML = equipe(); 
        // É fundamental recarregar os jogadores na nova estrutura de DOM:
        adicionarJogadores();
        adicionarStaff(); 
        
    } else {
 // Rota PADRÃO: Restaura o conteúdo principal (#home, #sobre, #contato)
 main.innerHTML = initialMainHTML;
 }
};

// Quando a página carregar pela primeira vez:
window.addEventListener("DOMContentLoaded", () => {
    // 1. Salva o conteúdo principal que está no HTML
    initialMainHTML = main.innerHTML;

    // 3. Verifica se o usuário já chegou na página com #produtos no link
    if (window.location.hash === '#produtos') {
        router();
    }
});

// Quando o link (hash) mudar, chama o router novamente
window.addEventListener("hashchange", router);