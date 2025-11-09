import BACKEND_URL from "../../url.js";

export function vendas(){
    return `
    <div class="vendas-container">
        <h1>PAINEL DE MONITORAMENTO DE VENDAS</h1>
        
        <section class="kpi-container">
            <div class="kpi-card">
                <h3>Receita Total</h3>
                <p id="kpi-receita" class="valor-monetario">R$ 0,00</p>
            </div>
            <div class="kpi-card">
                <h3>Total de Vendas</h3>
                <p id="kpi-total">0</p>
            </div>
            <div class="kpi-card">
                <h3>Entregas Pendentes</h3>
                <p id="kpi-pendentes">0</p>
            </div>
        </section>

        <section class="filtros">
            <label for="filtro-status">Filtrar por Status:</label>
            <select id="filtro-status">
                <option value="todos">Todos</option>
                <option value="pendente">Pendentes</option>
                <option value="entregue">Entregues</option>
            </select>
        </section>

        <section class="tabela-container">
            <table id="tabela-vendas">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Usuário</th>
                        <th>Forma Pagamento</th>
                        <th>Valor</th>
                        <th>Status</th>
                        <th>Data</th>
                        <th>Endereço</th>
                    </tr>
                </thead>
                <tbody id="corpo-tabela">
                    <!-- Preenchido dinamicamente -->
                </tbody>
            </table>
        </section>

        <template id="template-linha-venda">
            <tr>
                <td data-col="id"></td>
                <td data-col="usuario"></td>
                <td data-col="pagamento"></td>
                <td data-col="valor"></td>
                <td data-col="status">
                    <span class="status-badge"></span>
                </td>
                <td data-col="data"></td>
                <td data-col="endereco"></td>
            </tr>
        </template>
    </div>
`;
}

/// --- Funções Auxiliares (Mesma coisa) ---
function formatarMoeda(valor) {
  if (valor === null || valor === undefined) valor = 0;
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatarData(dataISO) {
  if (!dataISO) return '---';
  const data = new Date(dataISO);
  return data.toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short'
  });
}

// Guarda a lista completa de vendas
let todasAsVendas = [];

// --- Funções de Renderização ---

/**
 * Busca os KPIs do backend e preenche os cards.
 * AGORA ENVIANDO O TOKEN.
 */
async function carregarKpis() {
  const kpiReceitaEl = document.getElementById('kpi-receita');
  const kpiTotalEl = document.getElementById('kpi-total');
  const kpiPendentesEl = document.getElementById('kpi-pendentes');
  
  try {
    const token = localStorage.getItem('authToken'); // 1. Pegar o token
    if (!token) {
      throw new Error("Usuário não autenticado.");
    }

    const response = await fetch(`${BACKEND_URL}api/vendas/kpis`, {
      headers: { 'Authorization': `Bearer ${token}` } // 2. Enviar o token
    }); 

    if (!response.ok) throw new Error('Falha ao buscar KPIs');

    const data = await response.json();
    
    kpiReceitaEl.textContent = formatarMoeda(data.kpis.receitaTotal);
    kpiTotalEl.textContent = data.kpis.totalVendas;
    kpiPendentesEl.textContent = data.kpis.pendentes;

  } catch (error) {
    console.error('Erro ao carregar KPIs:', error);
    // Mostra erro na UI se falhar
    if (kpiReceitaEl) kpiReceitaEl.textContent = "Erro";
    if (kpiTotalEl) kpiTotalEl.textContent = "Erro";
    if (kpiPendentesEl) kpiPendentesEl.textContent = "Erro";
  }
}

/**
 * Filtra 'todasAsVendas' e renderiza a tabela.
 */
function renderizarTabela() {
  const filtroStatus = document.getElementById('filtro-status').value;
  const corpoTabela = document.getElementById('corpo-tabela');
  const templateLinha = document.getElementById('template-linha-venda');

  corpoTabela.innerHTML = ''; // Limpa a tabela

  const vendasFiltradas = todasAsVendas.filter(venda => {
    if (filtroStatus === 'todos') return true;
    if (filtroStatus === 'pendente') return !venda.foi_entregue;
    if (filtroStatus === 'entregue') return venda.foi_entregue;
    return false;
  });

  if (vendasFiltradas.length === 0) {
     corpoTabela.innerHTML = `<tr><td colspan="6">Nenhuma venda encontrada.</td></tr>`;
     return;
  }

  for (const venda of vendasFiltradas) {
    const linha = templateLinha.content.cloneNode(true);
    const nomeUsuario = venda.user ? venda.user.nome : 'Usuário Deletado';

    linha.querySelector('[data-col="id"]').textContent = venda.id;
    linha.querySelector('[data-col="usuario"]').textContent = nomeUsuario;
    linha.querySelector('[data-col="pagamento"]').textContent = venda.forma_pagamento;
    linha.querySelector('[data-col="valor"]').textContent = formatarMoeda(venda.preco_final);
    linha.querySelector('[data-col="data"]').textContent = formatarData(venda.criadoEm);

    const badge = linha.querySelector('.status-badge');
    badge.textContent = venda.foi_entregue ? 'Entregue' : 'Pendente';
    badge.classList.add(venda.foi_entregue ? 'status-entregue' : 'status-pendente');
    // Adiciona atributos para o toggle
    badge.style.cursor = 'pointer';
    badge.setAttribute('data-id', venda.id);
    badge.setAttribute('data-status', venda.foi_entregue ? 'true' : 'false');
    badge.title = 'Clique para alterar o status';

    const rua = venda.endereco_rua || '';
    const num = venda.endereco_numero || '';
    const cidade = venda.endereco_cidade || '';
    const estado = venda.endereco_estado || '';
        const cep = venda.endereco_cep || '';  


    const enderecoFormatado = `${rua}${num ? ', ' + num : ''} - ${cidade}/${estado}${cep ? ' - CEP: ' + cep : ''}`;

    if (!rua && !cidade) {
    linha.querySelector('[data-col="endereco"]').textContent = '---';
    } else {
    linha.querySelector('[data-col="endereco"]').textContent = enderecoFormatado;
    }

    corpoTabela.appendChild(linha);
  }

  // Adiciona os event listeners para os badges
  document.querySelectorAll('.status-badge').forEach(badge => {
    badge.addEventListener('click', toggleStatus);
  });
}

/**
 * Toggle o status de entrega de uma venda
 */
async function toggleStatus(event) {
  const badge = event.currentTarget;
  const id = badge.getAttribute('data-id');
  const currentStatus = badge.getAttribute('data-status') === 'true';
  
  try {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('Usuário não autenticado');

    const response = await fetch(`${BACKEND_URL}/api/vendas/update/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ foi_entregue: !currentStatus })
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || 'Erro ao atualizar status');
    }

    // Atualiza a lista e recarrega os dados
    await Promise.all([
      carregarKpis(),
      buscarTodasVendas()
    ]);

  } catch (error) {
    console.error('Erro ao toggle status:', error);
    alert('Erro ao alterar status: ' + error.message);
  }
}

/**
 * Busca a lista completa de vendas 1 vez.
 */
async function buscarTodasVendas() {
  const corpoTabela = document.getElementById('corpo-tabela');
  try {
    const token = localStorage.getItem('authToken'); // 1. Pegar o token
    if (!token) {
       throw new Error("Usuário não autenticado.");
    }

    const response = await fetch(`${BACKEND_URL}api/vendas/list`, {
      headers: { 'Authorization': `Bearer ${token}` } // 2. Enviar o token
    }); 

    if (!response.ok) {
       const data = await response.json().catch(() => ({}));
       const msg = data?.error || `Erro na API: ${response.status}`;
       throw new Error(msg);
    }

    const data = await response.json();
    todasAsVendas = data.vendas || []; // Garante que é um array

    renderizarTabela();

  } catch (error) {
    console.error('Erro ao buscar vendas:', error);
    if (corpoTabela) {
      corpoTabela.innerHTML = 
        `<tr><td colspan="6" style="color: red;">${error.message}</td></tr>`;
    }
  }
}

// --- Função Principal de Inicialização ---

/**
 * Função principal para "ativar" a página de vendas.
 */
export async function initVendasPage() {
  const filtroStatusEl = document.getElementById('filtro-status');

  if (!filtroStatusEl) {
    console.error("Erro: Elementos da página de vendas não encontrados.");
    return;
  }

  filtroStatusEl.addEventListener('change', renderizarTabela);

  // Carga inicial dos dados (agora em paralelo)
  await Promise.all([
     carregarKpis(),
     buscarTodasVendas()
  ]);
}