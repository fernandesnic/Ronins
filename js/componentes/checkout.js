export function checkout(){
    return `
    <section id="checkout" class="section">
        <div class="container">
            <h2>Finalizar Pedido</h2>
            <div class="checkout-grid">
                <div class="checkout-left">
                    <h3>Endereço & Frete</h3>
                    <label for="cep">CEP</label>
                    <input type="text" id="cep" placeholder="Ex: 01001-000" />
                    <button id="calc-frete" class="btn">Calcular Frete</button>
                    <div id="frete-result" class="frete-result">Informe o CEP para calcular o frete.</div>

                    <h3 style="margin-top:18px">Pagamento</h3>
                    <div class="payment-methods">
                        <label><input type="radio" name="payment" value="pix" checked /> PIX</label>
                        <label><input type="radio" name="payment" value="card" /> Cartão</label>
                    </div>

                    <div id="payment-pix" class="payment-box">
                        <p>Escolha PIX para ver QR e copiar chave.</p>
                        <div class="pix-box">
                            <div class="pix-qr">[QR placeholder]</div>
                            <div><button id="copy-pix" class="btn">Copiar chave PIX</button></div>
                        </div>
                    </div>

                    <div id="payment-card" class="payment-box" style="display:none">
                        <label for="card-number">Número do cartão</label>
                        <input id="card-number" type="text" inputmode="numeric" placeholder="0000 0000 0000 0000" />
                        <label for="card-name">Nome no cartão</label>
                        <input id="card-name" type="text" placeholder="NOME COMPLETO" />
                        <div style="display:flex;gap:8px">
                            <div style="flex:1">
                                <label for="card-exp">Validade</label>
                                <input id="card-exp" type="text" placeholder="MM/AA" />
                            </div>
                            <div style="width:110px">
                                <label for="card-cvv">CVV</label>
                                <input id="card-cvv" type="text" placeholder="123" />
                            </div>
                        </div>
                    </div>

                </div>

                <aside class="checkout-right">
                    <h3>Resumo do Pedido</h3>
                    <div id="order-items" class="order-items"></div>
                    <div class="order-totals">
                        <div class="row"><span>Subtotal</span><strong id="subtotal">R$0,00</strong></div>
                        <div class="row"><span>Frete</span><strong id="shipping">R$0,00</strong></div>
                        <div class="row total"><span>Total</span><strong id="grandtotal">R$0,00</strong></div>
                    </div>
                    <button id="place-order" class="btn dark" style="width:100%; margin-top:12px">Pagar e finalizar</button>
                </aside>
            </div>
        </div>
    </section>
    `;
}

// inicializa comportamento da página
export function initCheckout(){
    const CART_KEY = 'ronins_cart';
    const elItems = document.getElementById('order-items');
    const elSubtotal = document.getElementById('subtotal');
    const elShipping = document.getElementById('shipping');
    const elGrand = document.getElementById('grandtotal');
    const elCEP = document.getElementById('cep');
    const elCalc = document.getElementById('calc-frete');
    const elFreteResult = document.getElementById('frete-result');
    const elPlace = document.getElementById('place-order');

    function loadCart(){
        try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
        catch { return []; }
    }
    function saveCart(cart){ localStorage.setItem(CART_KEY, JSON.stringify(cart)); }

    function fmt(v){
        return v.toLocaleString('pt-BR', { style:'currency', currency:'BRL' });
    }

    function renderOrder(){
        const cart = loadCart();
        elItems.innerHTML = '';
        let subtotal = 0;
        if (!cart.length) {
            elItems.innerHTML = '<div class="cart-empty">Nenhum item no carrinho.</div>';
        } else {
            cart.forEach(i => {
                const price = parseFloat(String(i.price).replace(/[^\d,.-]/g,'').replace(',','.')) || 0;
                subtotal += price * (i.qty || 1);
                const div = document.createElement('div');
                div.className = 'order-item';
                div.innerHTML = `<div class="oi-left"><strong>${i.name}</strong><div class="oi-meta">${i.qty} x ${fmt(price)}</div></div><div class="oi-right">${fmt(price * (i.qty||1))}</div>`;
                elItems.appendChild(div);
            });
        }
        elSubtotal.textContent = fmt(subtotal);
        // se shipping já calculado use, senão 0
        const shippingVal = Number(elShipping.dataset.value || 0);
        elShipping.textContent = fmt(shippingVal);
        elGrand.textContent = fmt(subtotal + shippingVal);
    }

    // frete simulado por CEP
    function calcFrete(cep){
        if (!cep) return { price: 0, text: 'Informe um CEP válido.' };
        const digits = cep.replace(/\D/g,'');
        if (digits.length < 8) return { price: 0, text: 'CEP inválido.' };
        const first = digits.charAt(0);
        let price = 35;
        if ('01'.includes(first)) price = 10;
        else if ('23'.includes(first)) price = 18;
        else if ('45'.includes(first)) price = 25;
        else price = 35;
        return { price, text: `Frete estimado R$${price.toFixed(2)} para o CEP ${cep}` };
    }

    elCalc.addEventListener('click', () => {
        const cep = (elCEP.value || '').trim();
        const res = calcFrete(cep);
        elFreteResult.textContent = res.text;
        elShipping.dataset.value = res.price;
        elShipping.textContent = res.price ? res.price.toLocaleString('pt-BR', { style:'currency', currency:'BRL' }) : 'R$0,00';
        renderOrder();
    });

    // pagamento alternância
    document.querySelectorAll('input[name="payment"]').forEach(r => {
        r.addEventListener('change', (e) => {
            const v = e.target.value;
            document.getElementById('payment-pix').style.display = v === 'pix' ? 'block' : 'none';
            document.getElementById('payment-card').style.display = v === 'card' ? 'block' : 'none';
        });
    });

    // copiar chave pix (exemplo)
    const copyBtn = document.getElementById('copy-pix');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const chave = 'ronins@pix.exemplo';
            navigator.clipboard?.writeText(chave).then(()=>{
                copyBtn.textContent = 'Copiado!';
                setTimeout(()=> copyBtn.textContent = 'Copiar chave PIX', 1500);
            }).catch(()=> alert('Não foi possível copiar.'));
        });
    }

    // finalizar pedido (simulado)
    elPlace.addEventListener('click', () => {
        const payment = document.querySelector('input[name="payment"]:checked').value;
        // validações simples
        const cart = loadCart();
        if (!cart.length) return alert('Carrinho vazio.');
        if (!elShipping.dataset.value) {
            if (!confirm('Frete não calculado. Continuar?')) return;
        }
        if (payment === 'card') {
            const num = document.getElementById('card-number').value.trim();
            const name = document.getElementById('card-name').value.trim();
            const exp = document.getElementById('card-exp').value.trim();
            const cvv = document.getElementById('card-cvv').value.trim();
            if (!num || !name || !exp || !cvv) return alert('Preencha os dados do cartão.');
            // aqui você integraria com gateway real
            alert('Pagamento com cartão simulado realizado. Obrigado!');
        } else {
            // PIX
            alert('Pagamento via PIX simulado. Obrigado!');
        }

        // Limpa carrinho e redireciona para home
        saveCart([]);
        window.location.hash = '#home';
    });

    // inicial render
    document.getElementById('shipping').dataset.value = 0;
    renderOrder();
}