// router.js

// Importações dos módulos de conteúdo
import { produtos, adicionarProdutos } from "./componentes/produtos.js";
import { equipe, adicionarJogadores, adicionarStaff } from './componentes/equipe.js'; 
import { sobre } from './componentes/sobre.js'
import home from "./componentes/home.js";
import contato from "./componentes/contato.js";
import galeriadetrofeus from "./componentes/galeriatrofeus.js"
import { checkout, initCheckout } from "./componentes/checkout.js"; // ADICIONADO
import { apoiase } from "./componentes/apoiase.js"

const main = document.querySelector("#app");
const landing_page = home() + sobre() + contato()

// Função que decide o que mostrar
const router = async() => {
    const hash = window.location.hash;
    // Guarda o estado da página anterior para checar o scroll automatico
    try{
        const element = document.querySelector(hash);
        element.scrollIntoView()
        console.log("achei")
    }
    catch{
        scroll({
            "top": 0, 
            "behavior": "instant"
        });
        
        console.log("não achei")
        switch(hash){
            // Adiciona os módulos correspondentes a hash 
            case '#home':
            case '#sobre':
            case '#contato':
            default:
                main.innerHTML = landing_page;
                break;
            case '#produtos':
                main.innerHTML = produtos();
                await adicionarProdutos();
                break;
            case '#galeriadetrofeus':
                main.innerHTML = galeriadetrofeus();
                break;
            case '#checkout':
                main.innerHTML = checkout();
                initCheckout();
                break;
            case '#apoiase':
                main.innerHTML = apoiase();
                break;
            case '#equipe':
                main.innerHTML = equipe();
                await adicionarJogadores();
                await adicionarStaff();
                break;

        }

        try{
            const element = document.querySelector(hash);
            element.scrollIntoView()
            console.log("achei")
        }
        catch{
            console.log("não achei")
        }
    }
};

// Quando a página carregar pela primeira vez:
window.addEventListener("DOMContentLoaded", () => {
    router();
});

// Quando o link (hash) mudar, chama o router novamente
window.addEventListener("hashchange", router);


