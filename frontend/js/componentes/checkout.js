// IMPORTA FUNÇÕES DO CARRINHO
import { loadCart, saveCart } from './cart.js';

// HTML DO CHECKOUT
export function checkout() {
    return `
    <section id="checkout" class="section">
        <div class="container">

            <h2>Finalizar Pedido</h2>

            <div id="order-items" class="order-items"></div>

            <div class="checkout-totals">
                <div class="line">
                    <span>Subtotal:</span>
                    <strong id="subtotal">R$ 0,00</strong>
                </div>
                <div class="line">
                    <span>Frete:</span>
                    <strong id="shipping" data-value="0">R$ 0,00</strong>
                </div>
                <div class="line total">
                    <span>Total:</span>
                    <strong id="grandtotal">R$ 0,00</strong>
                </div>
            </div>

            <div class="frete-box">
                <label for="cep">CEP:</label>
                <input id="cep" type="text" placeholder="00000-000">
                <button id="calc-frete" class="btn">Calcular Frete</button>
                <p id="frete-result"></p>
            </div>

            <div class="payment-box">
                <h3>Forma de pagamento</h3>

                <label><input type="radio" name="payment" value="pix" checked> PIX</label>
                <label><input type="radio" name="payment" value="card"> Cartão de Crédito</label>

                <div id="payment-pix" class="payment-method">
                    <p>Chave PIX: <strong>ronins@pix.exemplo</strong></p>
                    <button id="copy-pix" class="btn">Copiar chave PIX</button>
                </div>

                <div id="payment-card" class="payment-method" style="display:none;">
                    <p>Pagamento no cartão será habilitado em breve.</p>
                </div>
            </div>

            <button id="place-order" class="btn big">Pagar e finalizar</button>

        </div>
    </section>
    `;
}

// ------------------------------------------------------
// INICIALIZADOR DO CHECKOUT
// ------------------------------------------------------
export function initCheckout() {

    // ELEMENTOS
    const elItems      = document.getElementById('order-items');
    const elSubtotal   = document.getElementById('subtotal');
    const elShipping   = document.getElementById('shipping');
    const elGrand      = document.getElementById('grandtotal');
    const elCEP        = document.getElementById('cep');
    const elCalc       = document.getElementById('calc-frete');
    const elFreteRes   = document.getElementById('frete-result');
    const elPlace      = document.getElementById('place-order');

    // FORMATADOR
    const fmt = v => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    // --------------------------------------------------
    // RENDERIZA ITENS + TOTAL
    // --------------------------------------------------
    function renderOrder() {
        const cart = loadCart();
        elItems.innerHTML = '';
        let subtotal = 0;

        if (!cart.length) {
            elItems.innerHTML = '<div class="cart-empty">Nenhum item no carrinho.</div>';
        } else {
            cart.forEach(i => {
                const price = Number(i.price) || 0;
                const qty   = i.qty || 1;
                subtotal += price * qty;

                const details = [i.tamanho, i.cor].filter(Boolean).join(' / ');

                const div = document.createElement('div');
                div.className = 'order-item';
                div.innerHTML = `
                    <div class="oi-left">
                        <strong>${i.name}</strong>
                        <small>${details}</small>
                        <div class="oi-meta">${qty} x ${fmt(price)}</div>
                    </div>
                    <div class="oi-right">${fmt(price * qty)}</div>
                `;
                elItems.appendChild(div);
            });
        }

        elSubtotal.textContent = fmt(subtotal);

        const shipValue = Number(elShipping.dataset.value || 0);
        elGrand.textContent = fmt(subtotal + shipValue);
    }

    // --------------------------------------------------
    // CALCULAR FRETE
    // --------------------------------------------------
    function calcFrete(cep) {
        if (!cep) return { price: 0, text: 'Informe um CEP válido.' };

        const digits = cep.replace(/\D/g, '');
        if (digits.length < 8) return { price: 0, text: 'CEP inválido.' };

        const first = digits.charAt(0);
        let price = 35;

        if ('01'.includes(first)) price = 10;
        else if ('23'.includes(first)) price = 18;
        else if ('45'.includes(first)) price = 25;

        return { price, text: `Frete estimado R$${price.toFixed(2)} para o CEP ${cep}` };
    }

    elCalc.addEventListener('click', () => {
        const cep = elCEP.value.trim();
        const res = calcFrete(cep);

        elFreteRes.textContent = res.text;
        elShipping.dataset.value = res.price;
        elShipping.textContent = fmt(res.price);

        renderOrder();
    });

    // --------------------------------------------------
    // TROCA DE MÉTODO DE PAGAMENTO
    // --------------------------------------------------
    document.querySelectorAll('input[name="payment"]').forEach(radio => {
        radio.addEventListener('change', e => {
            const v = e.target.value;
            document.getElementById('payment-pix').style.display  = v === 'pix'  ? 'block' : 'none';
            document.getElementById('payment-card').style.display = v === 'card' ? 'block' : 'none';
        });
    });

    // BOTÃO COPIAR PIX
    const copyBtn = document.getElementById('copy-pix');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const chave = 'ronins@pix.exemplo';
            navigator.clipboard?.writeText(chave).then(() => {
                copyBtn.textContent = 'Copiado!';
                setTimeout(() => copyBtn.textContent = 'Copiar chave PIX', 1500);
            });
        });
    }

    // --------------------------------------------------
    // FINALIZAR PEDIDO
    // --------------------------------------------------
    elPlace.addEventListener('click', async () => {
        try {
            elPlace.disabled = true;
            elPlace.textContent = "Processando...";

            const payment = document.querySelector('input[name="payment"]:checked').value;
            const cep = elCEP.value.trim();
            const cart = loadCart();

            if (!cart.length) {
                alert('Carrinho vazio.');
                elPlace.disabled = false;
                elPlace.textContent = "Pagar e finalizar";
                return;
            }

            const produtosParaApi = cart.map(item => ({
                id: item.id,
                qty: item.qty
            }));

            const token = localStorage.getItem('ronins_token');
            if (!token) {
                alert("Erro: Você não está logado.");
                window.location.hash = '#login';
                return;
            }

            const body = {
                forma_pagamento: payment,
                endereco_cep: cep || null,
                produtos: produtosParaApi
            };

            const response = await fetch(`${BACKEND_URL}/api/checkout/`, { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(body),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Falha ao criar o pedido.");

            alert('Pedido realizado com sucesso!');
            saveCart([]);
            window.location.hash = '#home';

        } catch (err) {
            console.error(err);
            alert(`Erro: ${err.message}`);
            elPlace.disabled = false;
            elPlace.textContent = "Pagar e finalizar";
        }
    });

    // RENDER INICIAL
    elShipping.dataset.value = 0;
    renderOrder();
}
