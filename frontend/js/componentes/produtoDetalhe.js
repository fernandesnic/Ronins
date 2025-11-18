// Pede o export com o NOME "BACKEND_URL"
import { BACKEND_URL } from '../url.js'; 
// --- IMPORTA O addToCart ---
import { addToCart } from './cart.js'; 

// -----------------------------------------------------------------------
// 1. O HTML (Sem mudanças)
// -----------------------------------------------------------------------
export function produtoDetalhe() {
    return `
    <section id="produto-detalhe" class="section">
        <div class="container">
            <a href="#produtos" class="link-voltar">&larr; Voltar para a loja</a>
            <div class="produto-detalhe-grid">
                <div class="produto-detalhe-imagem">
                    <img id="detalhe-img" src="assets/placeholder.jpg" alt="Carregando produto...">
                </div>
                <div class="produto-detalhe-info">
                    <h2 id="detalhe-nome">Carregando...</h2>
                    <div class="detalhe-preco">
                        <span id="detalhe-preco">R$ --,--</span>
                    </div>
                    <p id="detalhe-desc"></p>
                    <div class="detalhe-opcoes">
                        <div class="form-group">
                            <label for="select-tamanho">Tamanho:</label>
                            <select id="select-tamanho">
                                <option value="">Selecione...</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="select-cor">Cor:</label>
                            <select id="select-cor" disabled>
                                <option value="">Selecione um tamanho</option>
                            </select>
                        </div>
                    </div>
                    <div id="detalhe-estoque" class="detalhe-estoque"></div>
                    <button id="detalhe-add-cart" class="btn dark" disabled>
                        Selecione as opções
                    </button>
                </div>
            </div>
        </div>
    </section>
    `;
}

// -----------------------------------------------------------------------
// 2. A LÓGICA (Sem mudanças, exceto por remover as funções duplicadas)
// -----------------------------------------------------------------------
export async function initProdutoDetalhe(id) {
    // Referências aos elementos
    const img = document.getElementById('detalhe-img');
    const nome = document.getElementById('detalhe-nome');
    // ... (todas as outras referências: preco, desc, selects, etc.)
    const preco = document.getElementById('detalhe-preco');
    const desc = document.getElementById('detalhe-desc');
    const selectTamanho = document.getElementById('select-tamanho');
    const selectCor = document.getElementById('select-cor');
    const estoqueMsg = document.getElementById('detalhe-estoque');
    const btnAddCart = document.getElementById('detalhe-add-cart');


    let produtoData = null; 
    let variacoesData = []; 
    let variacaoSelecionada = null; 

    try {
        // PASSO 1: Buscar dados
        const response = await fetch(`${BACKEND_URL}/api/public/produto/${id}`);
        if (!response.ok) throw new Error("Produto não encontrado.");
        const data = await response.json();
        produtoData = data.produto;
        variacoesData = data.produto.variacoes;

        // PASSO 2: Popular informações básicas
        img.src = produtoData.foto_principal || 'assets/placeholder.jpg';
        nome.textContent = produtoData.nome;
        desc.textContent = produtoData.descricao;
        
        // PASSO 3: Popular <select> de Tamanhos
        const tamanhosUnicos = [...new Set(variacoesData.map(v => v.tamanho))];
        selectTamanho.innerHTML = '<option value="">Selecione...</option>'; 
        tamanhosUnicos.forEach(tamanho => {
            selectTamanho.innerHTML += `<option value="${tamanho}">${tamanho}</option>`;
        });

        // PASSO 4: Lógica de seleção (Tamanho -> Cor)
        selectTamanho.addEventListener('change', () => {
            const tamanhoEscolhido = selectTamanho.value;
            selectCor.innerHTML = '<option value="">Selecione...</option>';
            resetarSelecao(); 

            if (!tamanhoEscolhido) {
                selectCor.disabled = true;
                return;
            }

            const coresDisponiveis = variacoesData
                .filter(v => v.tamanho === tamanhoEscolhido)
                .map(v => v.cor);
                
            [...new Set(coresDisponiveis)].forEach(cor => {
                 selectCor.innerHTML += `<option value="${cor}">${cor}</option>`;
            });
            selectCor.disabled = false;
        });

        // PASSO 5: Lógica de seleção (Cor -> Preço/Estoque)
        selectCor.addEventListener('change', () => {
            const tamanhoEscolhido = selectTamanho.value;
            const corEscolhida = selectCor.value;

            if (!tamanhoEscolhido || !corEscolhida) {
                resetarSelecao();
                return;
            }

            variacaoSelecionada = variacoesData.find(v => 
                v.tamanho === tamanhoEscolhido && v.cor === corEscolhida
            );

            if (variacaoSelecionada) {
                preco.textContent = variacaoSelecionada.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                if (variacaoSelecionada.foto) img.src = variacaoSelecionada.foto; 

                if (variacaoSelecionada.estoque > 0) {
                    estoqueMsg.textContent = `Em estoque: ${variacaoSelecionada.estoque} unidades`;
                    estoqueMsg.style.color = 'green';
                    btnAddCart.textContent = 'Adicionar ao carrinho';
                    btnAddCart.disabled = false;
                } else {
                    estoqueMsg.textContent = 'Fora de estoque';
                    estoqueMsg.style.color = 'red';
                    btnAddCart.textContent = 'Indisponível';
                    btnAddCart.disabled = true;
                }
            }
        });

        // PASSO 6: Adicionar ao Carrinho (usa a função importada)
        btnAddCart.addEventListener('click', () => {
            if (variacaoSelecionada) {
                addToCart({
                    id: variacaoSelecionada.id, 
                    name: produtoData.nome,
                    price: variacaoSelecionada.preco,
                    tamanho: variacaoSelecionada.tamanho,
                    cor: variacaoSelecionada.cor,
                    img: variacaoSelecionada.foto || produtoData.foto_principal
                });
            }
        });

    } catch (error) {
        console.error("Erro ao carregar produto:", error);
        document.getElementById('produto-detalhe').innerHTML = 
            `<div class="container"><p style="color: red;">Erro: ${error.message}</p></div>`;
    }

    function resetarSelecao() {
        variacaoSelecionada = null;
        preco.textContent = 'R$ --,--';
        estoqueMsg.textContent = '';
        btnAddCart.textContent = 'Selecione as opções';
        btnAddCart.disabled = true;
        img.src = produtoData.foto_principal || 'assets/placeholder.jpg'; 
    }
}