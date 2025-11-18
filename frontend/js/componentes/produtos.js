// Pede o export com o NOME "BACKEND_URL"
import { BACKEND_URL } from '../url.js';

// Importa o widget do carrinho
import { setupCartWidget } from './cart.js';


/* ==============================
   SEÇÃO HTML DOS PRODUTOS
============================== */
export function produtos() {
    return `
        <section id="produtos" class="section section-produtos">
            <div class="container">
                <h2 class="section-title">Nossos Produtos</h2>
                <p class="section-subtitle">
                    Adquira nossos produtos e ajude a manter o time em atividade:
                </p>

                <!-- Container onde os cards serão inseridos -->
                <div id="produtos-container" class="cards-container loading">
                    <p class="loading-text">Carregando produtos...</p>
                </div>
            </div>
        </section>
    `;
}


/* ==============================
   FUNÇÃO QUE CARREGA OS PRODUTOS
============================== */
export async function adicionarProdutos() {
    const container = document.querySelector("#produtos-container");
    if (!container) return;

    try {
        container.innerHTML = `<p class="loading-text">Carregando produtos...</p>`;

        const response = await fetch(`${BACKEND_URL}/api/public/produto/`);
        const json = await response.json();

        const produtos = json.produtos || [];

        container.innerHTML = "";

        if (produtos.length === 0) {
            container.innerHTML = `
                <p class="empty-text">Nenhum produto disponível no momento.</p>
            `;
            return;
        }

        produtos.forEach(item => {
            const card = document.createElement("div");
            card.classList.add("card", "product-card");

            card.innerHTML = `
                <img src="${item.foto_principal || 'assets/placeholder.jpg'}" 
                     class="product-img"
                     alt="${item.descricao || item.nome}">

                <div class="card-content">
                    <h4 class="product-title">${item.nome}</h4>

                    <a href="#produto/${item.id}" 
                       class="btn dark product-btn" 
                       data-id="${item.id}">
                        Ver detalhes
                    </a>
                </div>
            `;

            container.appendChild(card);
        });

        setupCartWidget();

    } catch (error) {
        console.error("Erro ao carregar produtos:", error);

        container.innerHTML = `
            <p class="error-text">
                Erro ao carregar produtos. Tente novamente mais tarde.
            </p>
        `;
    }
}
