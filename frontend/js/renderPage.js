// router.js

// Importações dos módulos de conteúdo
import { produtos, adicionarProdutos } from './componentes/produtos.js';
import { equipe, adicionarEquipe } from './componentes/equipe.js'; 
import { sobre } from './componentes/sobre.js'
import { home } from "./componentes/home.js";
import { contato } from "./componentes/contato.js";
import { galeriatrofeus } from './componentes/galeriatrofeus.js'
import { checkout, initCheckout } from './componentes/checkout.js';
import { apoiase } from './componentes/apoiase.js'
import { login } from './componentes/login.js'
import { cadastro } from './componentes/cadastro.js'
import { calendario } from './componentes/calendario.js'
import { handleLoginSubmit, handleCadastroSubmit } from './auth.js';
import { users, adicionarUsuarios, setupModalListeners } from './componentes/ADMIN/users.js'
import { ADMINequipe, ADMINadicionarJogador, setupModalListenersEquipe } from './componentes/ADMIN/equipe.js'
// Pede o export com o NOME "BACKEND_URL"
import { BACKEND_URL } from './url.js'; // <-- A CHAVE SÃO AS CHAVES {}

import { vendas, initVendasPage } from './componentes/ADMIN/vendas.js'


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
            case '#galeriatrofeus':
                main.innerHTML = galeriatrofeus();
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
                await adicionarEquipe();
                break;
            case '#login':
                main.innerHTML = login();
                setupLoginForm(); // Adiciona os listeners para o formulário de login
                break;
            case '#cadastro':
                main.innerHTML = cadastro();
                setupCadastroForm(); // Adiciona os listeners para o formulário de cadastro
                break;
            case '#calendario':
                main.innerHTML = calendario();
                break;
            
            // --- CORREÇÃO APLICADA AQUI ---
            case '#users':
                main.innerHTML = users();      // 1. Cria o HTML (incluindo o modal)
                setupModalListeners();   // 2. Ativa os listeners (agora vai funcionar sempre)
                await adicionarUsuarios(); // 3. Preenche a lista com os usuários
                break;
            // ---------------------------------

            case '#ADMINequipe':
                main.innerHTML = ADMINequipe();
                await ADMINadicionarJogador();
                setupModalListenersEquipe(); // (O seu código aqui já estava correto)
                break;
            case "#vendas":
                main.innerHTML = vendas();
                await initVendasPage();
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

// --- Funções para Configurar Formulários ---

function setupLoginForm() {
    const loginForm = main.querySelector('.login-container form');
    const registerLink = main.querySelector('.register-link a');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginSubmit);
    }
    if (registerLink) {
        registerLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.hash = '#cadastro'; // Navega para a página de cadastro
        });
    }
}

function setupCadastroForm() {
    const cadastroForm = main.querySelector('.cadastro-container form');
    const loginLink = main.querySelector('#link-to-login');

    if (cadastroForm) {
        cadastroForm.addEventListener('submit', handleCadastroSubmit);
    }
    if (loginLink) {
        loginLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.hash = '#login'; // Navega para a página de login
        });
    }
}

// Quando a página carregar pela primeira vez:
window.addEventListener("DOMContentLoaded", () => {
    router();
});

// Quando o link (hash) mudar, chama o router novamente
window.addEventListener("hashchange", router);


// --- BLOCO PROBLEMÁTICO REMOVIDO ---
// A função 'renderUsersRoute()' e o 'if (location.hash === '#users')'
// foram deletados daqui. A lógica agora está
// corretamente centralizada no 'switch' acima.