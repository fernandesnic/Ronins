// router.js

// Importações dos módulos de conteúdo
import { produtos, adicionarProdutos } from './componentes/produtos.js';
import { equipe, adicionarEquipe } from './componentes/equipe.js'; 
import { sobre } from './componentes/sobre.js'
import { home } from "./componentes/home.js";
import { contato } from "./componentes/contato.js";
import { galeriatrofeus } from './componentes/galeriatrofeus.js'
import { checkout, initCheckout } from './componentes/checkout.js'; // ADICIONADO
import { apoiase } from './componentes/apoiase.js'
import { login } from './componentes/login.js'
import { cadastro } from './componentes/cadastro.js'
import { calendario } from './componentes/calendario.js'
import { handleLoginSubmit, handleCadastroSubmit } from './auth.js';
import { users, adicionarUsuarios, setupModalListeners } from './componentes/ADMIN/users.js'
import { ADMINequipe, ADMINadicionarJogador, setupModalListenersEquipe } from './componentes/ADMIN/equipe.js'

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
            case '#users':
                main.innerHTML = users();
                await adicionarUsuarios();
                break;
            case '#ADMINequipe':
                main.innerHTML = ADMINequipe();
                await ADMINadicionarJogador();
                setupModalListenersEquipe();
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

function renderUsersRoute() {
    const app = document.getElementById('app');
    if (!app) return console.error('#app não encontrado no DOM');

    try {
        // 1) Insere markup
        app.innerHTML = users();

        // 2) registra listeners (idempotente)
        setupModalListeners();

        // 3) popula lista
        adicionarUsuarios().catch(err => {
            console.error('adicionarUsuarios erro:', err);
            // mostra mensagem amigável
            const msg = `<div style="padding:20px;color:red;">Erro ao carregar usuários. Veja console (F12).</div>`;
            app.insertAdjacentHTML('afterbegin', msg);
        });

    } catch (err) {
        console.error('Erro ao renderizar rota users:', err);
        app.innerHTML = `<div style="padding:20px;color:red;">Ocorreu um erro ao renderizar a página de users. Verifique o console (F12).</div>`;
    }
}

// exemplo de uso (adapte conforme seu roteador)
if (location.hash === '#users') {
    renderUsersRoute();
}
