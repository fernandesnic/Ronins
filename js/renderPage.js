import { produtos, adicionarProdutos } from "./componentes/produtos.js";
import { sobre, adicionarJogadores } from "./componentes/sobre.js";
import home from "./componentes/home.js";
import contato from "./componentes/contato.js";
import galeriadetrofeus from "./componentes/galeriatrofeus.js"
const main = document.querySelector("#app");
const landing_page = home() + sobre() + contato()

// Função que decide o que mostrar
const router = async() => {
    const hash = window.location.hash;
    // Guarda o estado da página anterior para checar o scroll automatico
    const previous_page = main.innerHTML
    
    switch(hash){
        // Adiciona os módulos correspondentes a hash 
        case '#home':
        case '#sobre':
        case '#contato':
        default:
            main.innerHTML = landing_page;
            await adicionarJogadores();
            break;
        case '#produtos':
            main.innerHTML = produtos();
            await adicionarProdutos();
            break;
        case '#galeriadetrofeus':
            main.innerHTML = galeriadetrofeus();
            break;
    }

    // Se a página anterior for diferente da atual, ele scrolla pro inicio
    if(previous_page != main.innerHTML){
        scroll({
            "top": 0, 
            "behavior": "instant"
        });
    }
    
    // Se tiver algum elemento com o id da hash, ele scrolla até ele
    try{
        const element = document.querySelector(hash);
        element.scrollIntoView()
        console.log("achei")
    }
    catch{
        console.log("não achei")
    }

    
};

// Quando a página carregar pela primeira vez:
window.addEventListener("DOMContentLoaded", () => {
    router();
});

// Quando o link (hash) mudar, chama o router novamente
window.addEventListener("hashchange", router);


