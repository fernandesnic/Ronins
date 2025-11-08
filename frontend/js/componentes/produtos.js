export function produtos(){
    const content = `
        <section id="produtos" class="section">
            <div class="container">
                <h2>Nossos Produtos</h2>
                <p>Adquira nossos produtos e ajude a manter o time em atividade:</p>
                <div id="produtos-container" class="cards-container">
                    
                </div>
            </div>
        </section>
    `
    return content
}

export async function adicionarProdutos(){
    const produtosContainer = document.querySelector("#produtos-container");
    const arquivo = await fetch("assets/dados/produtos.json");
    const dados = await arquivo.json();
    dados.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("card", "product");
        const pid = item.id ?? item.nome;
        div.innerHTML = `
            <img src="${item.imagem}" alt="${item.descricao}">
            <div class="card-content">
                <h4>${item.nome}</h4>
                <p>${item.preco}</p>
                <button class="btn dark add-to-cart" data-id="${pid}" data-name="${item.nome}" data-price="${item.preco}">Adicionar ao carrinho</button>
            </div>
        `
        produtosContainer.appendChild(div);
    });

    setupCartWidget();
    produtosContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.add-to-cart');
        if (!btn) return;
        const id = btn.dataset.id;
        const name = btn.dataset.name;
        const price = btn.dataset.price;
        // NÃO abre automaticamente ao adicionar
        addToCart({ id, name, price });
    });
}

const CART_KEY = 'ronins_cart';
const CART_OPEN_CLASS = 'cart-open';

function loadCart() {
    try {
        return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch {
        return [];
    }
}
function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}
function addToCart(item) {
    const cart = loadCart();
    const idx = cart.findIndex(i => i.id === item.id);
    if (idx !== -1) {
        cart[idx].qty += 1;
    } else {
        cart.push({ id: item.id, name: item.name, price: item.price, qty: 1 });
    }
    saveCart(cart);
    renderCart();
}
function removeFromCart(id) {
    let cart = loadCart();
    cart = cart.filter(i => i.id !== id);
    saveCart(cart);
    renderCart();
}
function clearCart() {
    saveCart([]);
    renderCart();
}

function setupCartWidget() {
    if (document.querySelector('#cart-widget')) return; // já criado
    const widget = document.createElement('div');
    widget.id = 'cart-widget';
    widget.className = 'cart-widget';
    widget.style.zIndex = 9999;

    // estilo inline mínimo para garantir visibilidade (evita transparência indesejada)
    widget.style.position = 'absolute';
    widget.style.right = '16px';
    widget.style.top = '16px';
    widget.style.background = 'var(--bg-color1, #ffffff)';
    widget.style.opacity = '1';
    widget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.22)';

    widget.innerHTML = `
        <div id="cart-header" class="cart-header" role="toolbar">
            <button id="cart-button" class="cart-button" aria-label="Abrir carrinho" aria-expanded="false" tabindex="0">
                <!-- ícone de carrinho (SVG) -->
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 4h-2l-1 2h2l3.6 7.59-1.35 2.45A1 1 0 0 0 8.01 17h8.48a1 1 0 0 0 .9-.56l3.24-6.47A1 1 0 0 0 20.7 8H6.21" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
                    <circle cx="10" cy="20" r="1" fill="currentColor"></circle>
                    <circle cx="18" cy="20" r="1" fill="currentColor"></circle>
                </svg>
                <span id="cart-badge" class="cart-badge" aria-hidden="true">0</span>
            </button>
            <span id="cart-toggle" class="cart-toggle" aria-hidden="true">▾</span>
        </div>
        <div id="cart-body" class="cart-body" aria-hidden="true">
            <div id="cart-count" class="cart-count"></div>
            <div id="cart-items" class="cart-items"></div>
            <div class="cart-actions">
                <button id="cart-clear" class="btn dark">Limpar</button>
                <button id="cart-checkout" class="btn dark" style="margin-left:8px">Finalizar compra</button>
            </div>
        </div>
    `;

    // Anexa o widget DENTRO da seção de produtos para não "flutuar" em outras páginas
    const produtosSection = document.getElementById('produtos') || document.querySelector('#produtos-container');
    if (produtosSection) {
        // garante que o container tenha posicionamento para o absolute do widget
        const computed = window.getComputedStyle(produtosSection);
        if (computed.position === 'static' || !computed.position) {
            produtosSection.style.position = 'relative';
        }
        produtosSection.appendChild(widget);
    } else {
        // fallback: anexa ao body se a seção não existir
        document.body.appendChild(widget);
    }

    // Toggle abrir/fechar via botão e tecla (permitir controle acessível)
    const btn = widget.querySelector('#cart-button');
    const toggle = widget.querySelector('#cart-toggle');
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleCart();
    });
    btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleCart();
        }
    });
    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleCart();
    });

    // Ações internas do widget: impedir que cliques internos fechem o widget
    widget.addEventListener('click', (e) => {
        e.stopPropagation(); // evita que document click feche quando interagimos
        const rem = e.target.closest('.cart-remove');
        if (rem) {
            const id = rem.dataset.id;
            // remover não fecha mais o widget automaticamente
            removeFromCart(id);
            return;
        }
        if (e.target.id === 'cart-clear') {
            clearCart();
            return;
        }
        if (e.target.id === 'cart-checkout') {
            // ir para a página de checkout
            window.location.hash = '#checkout';
            return;
        }
    });

    // Fecha ao clicar fora da seção de produtos ou do widget
    document.addEventListener('click', (e) => {
        const widgetEl = document.getElementById('cart-widget');
        if (!widgetEl) return;

        // se o widget estiver dentro de produtos, considera clique fora da seção de produtos como "fora"
        const root = produtosSection || document.body;
        if (!root.contains(e.target)) closeCart();
    });

    renderCart();
    // manter fechado por padrão
    closeCart();
}

function toggleCart() {
    const widget = document.getElementById('cart-widget');
    if (!widget) return;
    if (widget.classList.contains(CART_OPEN_CLASS)) closeCart();
    else openCart();
}
function openCart() {
    const widget = document.getElementById('cart-widget');
    if (!widget) return;
    widget.classList.add(CART_OPEN_CLASS);
    const btn = widget.querySelector('#cart-button');
    const toggle = widget.querySelector('#cart-toggle');
    const body = widget.querySelector('#cart-body');
    if (btn) btn.setAttribute('aria-expanded', 'true');
    if (toggle) toggle.textContent = '▴';
    if (body) body.setAttribute('aria-hidden', 'false');
}
function closeCart() {
    const widget = document.getElementById('cart-widget');
    if (!widget) return;
    widget.classList.remove(CART_OPEN_CLASS);
    const btn = widget.querySelector('#cart-button');
    const toggle = widget.querySelector('#cart-toggle');
    const body = widget.querySelector('#cart-body');
    if (btn) btn.setAttribute('aria-expanded', 'false');
    if (toggle) toggle.textContent = '▾';
    if (body) body.setAttribute('aria-hidden', 'true');
}

function renderCart() {
    const itemsContainer = document.querySelector('#cart-items');
    const countElem = document.querySelector('#cart-count');
    const badge = document.querySelector('#cart-badge');
    if (!itemsContainer || !countElem) return;
    const cart = loadCart();
    const totalQty = cart.reduce((s, i) => s + (i.qty || 0), 0);
    countElem.textContent = `Itens: ${totalQty}`;

    // atualiza badge
    if (badge) {
        if (totalQty > 0) {
            badge.textContent = totalQty;
            badge.style.display = 'inline-block';
        } else {
            badge.textContent = '0';
            badge.style.display = 'none';
        }
    }

    if (cart.length === 0) {
        itemsContainer.innerHTML = '<div class="cart-empty">Carrinho vazio</div>';
        return;
    }

    itemsContainer.innerHTML = cart.map(i => `
        <div class="cart-item" data-id="${i.id}">
            <div class="cart-item-info">
                <div class="cart-item-name">${i.name}</div>
                <div class="cart-item-meta">${i.price} x${i.qty}</div>
            </div>
            <div class="cart-item-actions">
                <button class="cart-remove btn" data-id="${i.id}">Remover</button>
            </div>
        </div>
    `).join('');
}
