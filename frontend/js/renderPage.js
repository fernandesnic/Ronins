// router.js

// Importações dos módulos de conteúdo
import { produtos, adicionarProdutos } from './componentes/produtos.js';
import { equipe, adicionarEquipe } from './componentes/equipe.js'; 
import { sobre } from './componentes/sobre.js'
import { home } from "./componentes/home.js";
import { contato } from "./componentes/contato.js";
import { galeriatrofeus, adicionarTrofeus } from './componentes/galeriatrofeus.js'
import { checkout, initCheckout } from './componentes/checkout.js';
import { apoiase } from './componentes/apoiase.js'
import { login } from './componentes/login.js'
import { cadastro } from './componentes/cadastro.js'
import { calendario } from './componentes/calendario.js'
import { handleLoginSubmit, handleCadastroSubmit } from './auth.js';
// Páginas users e ADMINequipe removidas - funcionalidade disponível no tableManager
import { setupContatoForm } from './componentes/contatoHandler.js';
import { produtoDetalhe, initProdutoDetalhe } from './componentes/produtoDetalhe.js'; 
import { BACKEND_URL } from './url.js'; 
import { vendas, initVendasPage } from './componentes/ADMIN/vendas.js'
import { adicionarBotoes, ADMINtableManager } from './componentes/ADMIN/tableManager.js';
import { adicionarMensagens, mensagens } from './componentes/ADMIN/mensagens.js';

// IMPORTANTE: Atualizar header sempre
import { updateHeaderActions } from './auth.js';

const main = document.querySelector("#app");
const landing_page = home() + sobre() + contato()

const router = async () => {

    const hash = window.location.hash;

    // --- Rota de produto dinâmica (#produto/123) ---
    if (hash.startsWith('#produto/')) {
        const id = hash.split('/')[1];

        main.innerHTML = produtoDetalhe();
        await initProdutoDetalhe(id);

        updateHeaderActions();
        return;
    }

    switch (hash) {
        case '#home':
        case '#sobre':
        default:
            main.innerHTML = landing_page;
            setupContatoForm();
            break;

        case '#contato':
            main.innerHTML = contato();
            setupContatoForm();
            break;

        case '#produtos':
            main.innerHTML = produtos();
            await adicionarProdutos();
            break;

        case '#galeriatrofeus':
        case '#trofeus':
            main.innerHTML = galeriatrofeus();
            await adicionarTrofeus();
            break;

        case '#checkout':
            main.innerHTML = checkout();
            requestAnimationFrame(initCheckout);
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
            setupLoginForm();
            break;

        case '#cadastro':
            main.innerHTML = cadastro();
            setupCadastroForm();
            break;

        case '#calendario':
            main.innerHTML = calendario();
            break;

        case "#vendas":
            main.innerHTML = vendas();
            await initVendasPage();
            break;

        case "#ADMINtableManager":
            main.innerHTML = await ADMINtableManager();
            await adicionarBotoes();
            break;

        case "#mensagens":
            main.innerHTML = mensagens();
            adicionarMensagens();
            break;
    }

    // Atualiza os botões do header em TODA troca de rota
    updateHeaderActions();

    // Scroll seguro
    try {
        const el = document.querySelector(hash);
        if (el) el.scrollIntoView({ behavior: "smooth" });
    } catch { }
};

// Setup do Login
function setupLoginForm() {
    const form = main.querySelector('.login-container form');
    const link = main.querySelector('.register-link a');

    if (form) form.addEventListener('submit', handleLoginSubmit);
    if (link) {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.hash = '#cadastro';
        });
    }
}

// Setup do Cadastro
function setupCadastroForm() {
    const form = main.querySelector('.cadastro-container form');
    const link = main.querySelector('#link-to-login');

    if (form) form.addEventListener('submit', handleCadastroSubmit);
    if (link) {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.hash = '#login';
        });
    }
}

// Carregar página inicial
window.addEventListener("DOMContentLoaded", () => {
    router();
    updateHeaderActions(); // garante header certo ao abrir o site
});

// Quando mudar o hash
window.addEventListener("hashchange", router);
