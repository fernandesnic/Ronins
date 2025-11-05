// router.js

// Importações dos módulos de conteúdo
import { produtos, adicionarProdutos } from "./componentes/produtos.js";
import { adicionarJogadores } from "./componentes/sobre.js"; 
import { equipe } from './componentes/equipe.js'; 


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
 adicionarJogadores(); 
        
    } else if (hash === '#equipe') { 
        // Rota #EQUIPE: Carrega o conteúdo da equipe e isola a página
        main.innerHTML = equipe(); 
        // É fundamental recarregar os jogadores na nova estrutura de DOM:
        adicionarJogadores(); 
        
    } else {
 // Rota PADRÃO: Restaura o conteúdo principal (#home, #sobre, #contato)
 main.innerHTML = initialMainHTML;
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