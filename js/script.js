// ===================================================================
// PARTE 1: IMPORTS E VARIÁVEIS GLOBAIS
// (Coisas que o script precisa saber antes de tudo)
// ===================================================================

// Importa as funções que criam o HTML das páginas
import { produtos, adicionarProdutos } from "./componentes/produtos.js";
import { adicionarJogadores } from "./componentes/sobre.js"; 
// Importe suas outras páginas aqui, se tiver (ex: home.js, contato.js)

// Variáveis globais para o router e o carrinho
const main = document.querySelector("#app"); // Onde o conteúdo da página é injetado
let initialMainHTML = ''; // Guarda o HTML da página inicial
let carrinho = []; // O array do nosso carrinho


// ===================================================================
// PARTE 2: LÓGICA PRINCIPAL (CARRINHO E ROUTER)
// (Funções que definem o que o site faz)
// ===================================================================

// --- Funções do Carrinho ---

const adicionarAoCarrinho = (produto) => {
    const itemExistente = carrinho.find(item => item.id === produto.id);

    if (itemExistente) {
        itemExistente.quantidade++;
    } else {
        carrinho.push({ ...produto, quantidade: 1 });
    }
    
    console.log("Carrinho:", carrinho);
    atualizarContadorCarrinho();
};

const atualizarContadorCarrinho = () => {
    // Atualiza o contador no link do header
    const cartCountElement = document.querySelector("#cart-count");
    if (cartCountElement) {
        const totalItens = carrinho.reduce((soma, item) => soma + item.quantidade, 0);
        cartCountElement.textContent = totalItens;
    }
    
    // Atualiza o contador no widget flutuante (se ele existir)
    // A função renderCart() do widget cuida disso, então não precisamos duplicar.
};

const renderizarCarrinho = () => {
    // Esta é a PÁGINA do carrinho (ex: /#carrinho), não o widget flutuante.
    if (carrinho.length === 0) {
        main.innerHTML = `
            <section class="section">
                <div class="container" style="text-align: center;">
                    <h2>Seu carrinho está vazio.</h2>
                    <a href="#produtos" class="btn">Ver produtos</a>
                </div>
            </section>
        `;
        return;
    }

    const total = carrinho.reduce((soma, item) => soma + (item.preco * item.quantidade), 0);

    main.innerHTML = `
        <section class="section">
            <div class="container">
                <h2>Seu Carrinho</h2>
                ${carrinho.map(item => `
                    <div class="carrinho-item" style="display: flex; justify-content: space-between; padding: 10px; border-bottom: 1px solid var(--border-color);">
                        <p>${item.nome} (x${item.quantidade})</p>
                        <p>R$ ${(item.preco * item.quantidade).toFixed(2)}</p>
                    </div>
                `).join('')}
                <hr style="margin: 20px 0;">
                <h3 style="text-align: right;">Total: R$ ${total.toFixed(2)}</h3>
            </div>
        </section>
    `;
};

// --- Função do Router (Controlador de Páginas) ---

const router = () => {
    const hash = window.location.hash || '#home'; // Se não tiver hash, vai para #home

    // Seleciona o link de menu ativo
    document.querySelectorAll('.menu ul li a').forEach(link => {
        if (link.getAttribute('href') === hash) {
            link.classList.add('active'); // Você pode criar um estilo .active no CSS
        } else {
            link.classList.remove('active');
        }
    });

    // Decide qual página mostrar
    switch (hash) {
        case '#home':
            main.innerHTML = initialMainHTML;
            if (typeof adicionarJogadores === 'function') {
                adicionarJogadores(); // Recarrega os jogadores na home
            }
            break;
        case '#produtos':
            main.innerHTML = produtos();
            adicionarProdutos(adicionarAoCarrinho); // Conecta o botão "Comprar"
            break;
        case '#carrinho':
            renderizarCarrinho(); // Mostra a página de checkout
            break;
        case '#sobre':
            // Adicione a lógica da sua página sobre aqui
            // ex: main.innerHTML = renderizarSobre();
            break;
        case '#contato':
            // Adicione a lógica da sua página contato aqui
            // ex: main.innerHTML = renderizarContato();
            break;
        default:
            main.innerHTML = initialMainHTML; // Volta para home
            if (typeof adicionarJogadores === 'function') {
                adicionarJogadores();
            }
            break;
    }
};


// ===================================================================
// PARTE 3: INICIALIZAÇÃO (DOMContentLoaded)
// (Código que roda ASSIM que o HTML da página termina de carregar)
// ===================================================================

document.addEventListener('DOMContentLoaded', function() {
    
    // --- Lógica do Header, Scroll e Menu Hambúrguer ---
    const menu = document.querySelector('.menu ul'); 
    const header = document.querySelector('header');
    const hamburguer = document.getElementById('hamburguer');

    if (header && menu) { 
        window.addEventListener('scroll', function () {
            if(menu.classList.contains('active')){
                return
            }
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    if (hamburguer && menu) {
        hamburguer.addEventListener('click', () => {
            menu.classList.toggle('active');
            if(header && menu.classList.contains('active')){
                header.classList.remove('scrolled');
            }else if(header && window.scrollY > 50){
                header.classList.add('scrolled');
            }
        });
    }

    // --- Lógica do Footer (Atualiza o ano) ---
    const yearSpan = document.querySelector('.copyright');
    if (yearSpan) {
        yearSpan.innerHTML = `&copy; ${new Date().getFullYear()} Ronins Rugby. Todos os direitos reservados.`;
    }

    // --- Lógica de Acessibilidade (do seu código) ---
    const widgetAcessibilidade = document.getElementById('acessibilidade');
    
    // Verifica se o widget de acessibilidade EXISTE nesta página
    if (widgetAcessibilidade) {
        const botaoPrincipalAcessibilidade = document.getElementById('mainBtn');
        const aumentarFonteBtn = document.getElementById('incrFont');
        const diminuirFonteBtn = document.getElementById('decrFont');
        const altoContrasteBtn = document.getElementById('highContrast');
        const body = document.querySelector("body");
        
        let fontSize = 1; // Variável de controle da fonte

        // Abrir/Fechar o menu
        if (botaoPrincipalAcessibilidade) {
            botaoPrincipalAcessibilidade.addEventListener('click', () => {
                widgetAcessibilidade.classList.toggle('active');
            });
        }

        // Aumentar fonte
        if (aumentarFonteBtn) {
            aumentarFonteBtn.addEventListener('click', () => {
                fontSize = Math.min(fontSize + 0.1, 1.8); // Limite de 1.8
                document.querySelector("html").style.fontSize = `${fontSize}em`;
            });
        }

        // Diminuir fonte
        if (diminuirFonteBtn) {
            diminuirFonteBtn.addEventListener('click', () => {
                fontSize = Math.max(fontSize - 0.1, 0.8); // Limite de 0.8
                document.querySelector("html").style.fontSize = `${fontSize}em`;
            });
        }

        // Alto Contraste
        if (altoContrasteBtn && body) {
            altoContrasteBtn.addEventListener('click', () => {
                body.classList.toggle('high-contrast');
            });
        }
    }
    
    // --- Inicialização do Router ---
    // (Só roda se o 'main' existir, ou seja, não na página 'apoie-se')
    if (main) {
        // 1. Salva o HTML da página inicial (index.html)
        initialMainHTML = main.innerHTML;
        
        // 2. Carrega os dados da home (jogadores)
        if (typeof adicionarJogadores === 'function') {
            adicionarJogadores();
        }
        
        // 3. Verifica se a página já carregou com um hash (ex: /#produtos)
        if (window.location.hash) {
            router();
        }
    }
    
    // 4. Inicia o contador do carrinho em TODAS as páginas
    atualizarContadorCarrinho();

}); // --- FIM DO DOMContentLoaded ---


// ===================================================================
// PARTE 4: LISTENERS GLOBAIS
// (Eventos que "ouvem" o navegador o tempo todo)
// ===================================================================

// "Ouve" quando o usuário clica em links (muda o hash)
// Só roda se o 'main' existir
if (main) {
    window.addEventListener("hashchange", router);
}