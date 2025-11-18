import { BACKEND_URL } from '../url.js';

const CART_KEY = 'ronins_cart';

/* -----------------------------
    FUNÇÕES DE CONTROLE DO CART
------------------------------*/

export function loadCart() {
    try {
        return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch {
        return [];
    }
}

export function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function clearCart() {
    saveCart([]);
    renderCart();
}

export function addToCart(item) {
    const cart = loadCart();
    const idx = cart.findIndex(i => i.id === item.id);

    if (idx !== -1) {
        cart[idx].qty += 1;
    } else {
        cart.push({ ...item, qty: 1 });
    }

    saveCart(cart);
    renderCart();

    alert(`${item.name} (${item.tamanho} / ${item.cor}) foi adicionado!`);
}

function removeFromCart(id) {
    let cart = loadCart();
    cart = cart.filter(i => i.id !== parseInt(id));
    saveCart(cart);
    renderCart();
}

/* -----------------------------
    WIDGET DO CARRINHO
------------------------------*/

export function setupCartWidget() {
    if (document.querySelector('#cart-widget')) return;

    const widget = document.createElement('div');
    widget.id = 'cart-widget';
    widget.className = 'cart-widget';

    widget.innerHTML = `
        <div id="cart-header" class="cart-header" role="toolbar">
            <button id="cart-button" class="cart-button" aria-label="Abrir carrinho" aria-expanded="false" tabindex="0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 4h-2l-1 2h2l3.6 7.59-1.35 2.45A1 1 0 0 0 8.01 17h8.48a1 1 0 0 0 .9-.56l3.24-6.47A1 1 0 0 0 20.7 8H6.21"
                        stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
                    <circle cx="10" cy="20" r="1" fill="currentColor"></circle>
                    <circle cx="18" cy="20" r="1" fill="currentColor"></circle>
                </svg>
                <span id="cart-badge" class="cart-badge">0</span>
            </button>
            <span id="cart-toggle" class="cart-toggle">▾</span>
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

    /* Posicionamento no DOM */
    const produtosSection = document.getElementById('produtos') || document.querySelector('#produtos-container');

    if (produtosSection) {
        const computed = window.getComputedStyle(produtosSection);
        if (computed.position === 'static' || !computed.position) {
            produtosSection.style.position = 'relative';
        }
        produtosSection.appendChild(widget);
    } else {
        document.body.appendChild(widget);
    }

    /* Eventos */
    const btn = widget.querySelector('#cart-button');
    const toggle = widget.querySelector('#cart-toggle');

    btn.addEventListener('click', (e) => { e.stopPropagation(); toggleCart(); });
    toggle.addEventListener('click', (e) => { e.stopPropagation(); toggleCart(); });

    widget.addEventListener('click', (e) => {
        e.stopPropagation();

        const removeBtn = e.target.closest('.cart-remove');
        if (removeBtn) {
            removeFromCart(removeBtn.dataset.id);
            return;
        }

        if (e.target.id === 'cart-clear') {
            clearCart();
            return;
        }

        if (e.target.id === 'cart-checkout') {
            window.location.hash = '#checkout';
            return;
        }
    });

    document.addEventListener('click', (e) => {
        const widgetEl = document.getElementById('cart-widget');
        if (!widgetEl) return;
        if (!widgetEl.contains(e.target)) closeCart();
    });

    renderCart();
    closeCart();
}

/* -----------------------------
    ABRIR / FECHAR WIDGET
------------------------------*/

function toggleCart() {
    const widget = document.getElementById('cart-widget');
    if (!widget) return;

    widget.classList.contains('cart-open') ? closeCart() : openCart();
}

function openCart() {
    const widget = document.getElementById('cart-widget');
    if (!widget) return;

    widget.classList.add('cart-open');
    widget.querySelector('#cart-button')?.setAttribute('aria-expanded', 'true');
    widget.querySelector('#cart-toggle').textContent = '▴';
    widget.querySelector('#cart-body').setAttribute('aria-hidden', 'false');
}

function closeCart() {
    const widget = document.getElementById('cart-widget');
    if (!widget) return;

    widget.classList.remove('cart-open');
    widget.querySelector('#cart-button')?.setAttribute('aria-expanded', 'false');
    widget.querySelector('#cart-toggle').textContent = '▾';
    widget.querySelector('#cart-body').setAttribute('aria-hidden', 'true');
}

/* -----------------------------
    RENDERIZAÇÃO DO CARRINHO
------------------------------*/

function renderCart() {
    const itemsContainer = document.querySelector('#cart-items');
    const countElem = document.querySelector('#cart-count');
    const badge = document.querySelector('#cart-badge');

    if (!itemsContainer || !countElem) return;

    const cart = loadCart();
    const totalQty = cart.reduce((s, i) => s + (i.qty || 0), 0);

    countElem.textContent = `Itens: ${totalQty}`;

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
        itemsContainer.innerHTML = `<div class="cart-empty">Carrinho vazio</div>`;
        return;
    }

    itemsContainer.innerHTML = cart.map(i => {
        const price = parseFloat(i.price) || 0;
        const qty = i.qty || 1;
        const details = [i.tamanho, i.cor].filter(Boolean).join(' / ');

        return `
            <div class="cart-item" data-id="${i.id}">
                <div class="cart-item-info">
                    <div class="cart-item-name">${i.name}</div>
                    <small>${details}</small>
                    <div class="cart-item-meta">
                        ${price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} x${qty}
                    </div>
                </div>

                <button class="cart-remove btn" data-id="${i.id}">Remover</button>
            </div>
        `;
    }).join('');
}
