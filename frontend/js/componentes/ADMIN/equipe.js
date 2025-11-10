import { BACKEND_URL } from '../../url.js'; 

export function ADMINequipe(){
    return `
        <section class="section">
            <h1>Jogadores</h1>
            <button id="btn-open-create-modal" class="btn btn-primary" style="margin-bottom: 1rem;">Criar Novo Jogador</button>
            
            <div id="players-grid" class="table-grid"> 
                <div class="header">
                    <p>NOME</p><p>NUMERO CAMISA</p><p>CLASSIFICAÇÃO</p><p>NACIONALIDADE</p><p>IDADE</p><p>FOTO</p><p>TA NO TIME</p>
                </div>
            </div>
        </section>

        <div id="edit-modal-overlay" class="modal-overlay">
            <div class="modal-content">
                <h2 id="edit-modal-title">Editar Jogador</h2> 
                <form id="edit-player-form">
                    <input type="hidden" id="edit-player-id">
                    <div>
                        <label for="edit-nome">Nome:</label>
                        <input type="text" id="edit-nome" required>
                    </div>
                    <div>
                        <label for="edit-camisa">Numero da camisa:</label>
                        <input type="number" id="edit-camisa" required>
                    </div>
                    <div>
                        <label for="edit-classificacao">Classificação:</label>
                        <input type="text" id="edit-classificacao" required> </div>
                    <div>
                        <label for="edit-nacionalidade">Nacionaliade:</label>
                        <input type="text" id="edit-nacionalidade" required>
                    </div>
                    <div>
                        <label for="edit-idade">Idade:</label>
                        <input type="number" id="edit-idade" required>
                    </div>
                    <div>
                        <label for="edit-foto">Foto:</label>
                        <input type="text" id="edit-foto" required>
                    </div>
                    <div class="checkbox-group">
                        <label>
                            <input type="checkbox" id="edit-on_team">
                            Ta no time?
                        </label>
                    </div>

                    <div class="modal-buttons">
                        <button type="submit" class="btn">Salvar</button>
                        <button type="button" id="btn-cancel-edit" class="btn btn-secondary">Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    `
}

export async function ADMINadicionarJogador(){
    const jogadoresContainer = document.querySelector("#players-grid"); 
    if (!jogadoresContainer) {
        console.error('Container #players-grid não encontrado.');
        return;
    }
    try {

        const headerHTML = jogadoresContainer.querySelector(".header").outerHTML;
        jogadoresContainer.innerHTML = headerHTML;

        const token = localStorage.getItem('authToken');
        if (!token) {
            jogadoresContainer.innerHTML += "<p>Usuário não autenticado.</p>";
            return;
        }
    
        const response = await fetch(`${BACKEND_URL}/api/public/equipe`);
        const data = await response.json().catch(() => ({}));
    
        if (!response.ok) {
            const msg = data?.error || `Erro na API: ${response.status}`;
            throw new Error(msg);
        }
    
        const jogadores = data.jogadores;
        
        if (!jogadores || jogadores.length === 0) {
            jogadoresContainer.innerHTML += "<p>Nenhum jogador encontrado.</p>";
            return;
        }
    
        jogadores.forEach(item => {
            const div = document.createElement("div");
            div.classList.add("player");
            div.id = `player-row-${item.id}`;
    
            div.innerHTML = `
                <p>${item.nome || ''}</p>
                <p>${item.numero_camisa || ''}</p>
                <p>${item.classificacao || ''}</p>
                <p>${item.nacionalidade || ''}</p>
                <p>${item.idade || ''}</p>
                <p>${item.foto || ''}</p>
                <p>${item.on_team ? 'Sim' : 'Não'}</p>
                <button class="btn btn-edit"
                    data-id="${item.id}"
                    data-nome="${escapeHtml(item.nome || '')}"
                    data-camisa="${item.numero_camisa}"
                    data-classificacao="${item.classificacao}"
                    data-nacionalidade="${item.nacionalidade}"
                    data-idade="${item.idade}"
                    data-foto="${item.foto}"
                    data-on_team="${!!item.on_team}"
                    title="Editar"
                >E</button>
                <button class="btn btn-delete" data-id="${item.id}" title="Deletar">X</button>
            `;
            jogadoresContainer.appendChild(div);
        });
    
        setupClickListeners(jogadoresContainer);
    
    } catch (error) {
        console.error("Erro ao buscar e adicionar usuários:", error);
        jogadoresContainer.innerHTML += `<p style="color: red;">Falha ao carregar usuários. (${error.message})</p>`;
    }
}

function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

function setupClickListeners(container) {
    if (!container) return;
    if (container.dataset.listenerAttached === 'true') return;
    container.dataset.listenerAttached = 'true';

    container.addEventListener('click', (event) => {
        const target = event.target;
        if (!target) return;

        if (target.classList.contains('btn-delete')) {
            const id = target.dataset.id || target.closest('.player')?.id?.replace(/^player-row-/, '');
            const token = localStorage.getItem('authToken');
            if (!token) return alert('Usuário não autenticado.');
            if (!id) return console.error('ID ausente no botão de delete.');
            if (!confirm('Confirma exclusão do jogador?')) return;
            handleDelete(id, token);
            return;
        }

        if (target.classList.contains('btn-edit')) {
            const idFromData = target.dataset.id;
            const idFromRow = target.closest('.player')?.id?.replace(/^player-row-/, '');
            const fallbackId = idFromData || idFromRow || '';
            if (!fallbackId) {
                console.error('ID ausente no botão de edit. Element:', target);
                return;
            }
            const jogador = {
                id: String(fallbackId),
                nome: unescapeHtml(target.dataset.nome || target.getAttribute('data-nome') || ''),
                camisa: unescapeHtml(target.dataset.camisa || target.getAttribute('data-camisa') || ''),
                classificacao: unescapeHtml(target.dataset.classificacao || target.getAttribute('data-classificacao') || ''),
                nacionalidade: unescapeHtml(target.dataset.nacionalidade || target.getAttribute('data-nacionalidade') || ''),
                idade: unescapeHtml(target.dataset.idade || target.getAttribute('data-idade') || ''),
                foto: unescapeHtml(target.dataset.foto || target.getAttribute('data-foto') || ''),
                on_team: (target.dataset.on_team === 'true'),
            };
            openEditModal(jogador);
        }
    });
}


function unescapeHtml(str) {
    return String(str).replace(/&lt;|&gt;|&amp;|&quot;|&#39;/g, (m) => ({'&lt;':'<','&gt;':'>','&amp;':'&','&quot;':'"','&#39;':"'" }[m]));
}

function openEditModal(jogador = {}) { 
    const overlay = document.getElementById('edit-modal-overlay');
    const idEl = document.getElementById('edit-player-id');
    const modalTitle = document.getElementById('edit-modal-title'); 

    if (!overlay || !idEl || !modalTitle) {
        console.error('Modal ou seus componentes não encontrados no DOM.');
        return;
    }

    if (jogador && jogador.id) {
        modalTitle.textContent = 'Editar Jogador';
    } else {
        modalTitle.textContent = 'Criar Novo Jogador';
    }

    idEl.value = String(jogador.id || '');
    document.getElementById('edit-nome').value = jogador.nome || '';
    document.getElementById('edit-camisa').value = jogador.camisa || '';
    document.getElementById('edit-classificacao').value = jogador.classificacao || '';
    document.getElementById('edit-nacionalidade').value = jogador.nacionalidade || '';
    document.getElementById('edit-idade').value = jogador.idade || '';
    document.getElementById('edit-foto').value = jogador.foto || '';
    document.getElementById('edit-on_team').checked = !!jogador.on_team;

    overlay.style.display = 'flex';
    void overlay.offsetWidth;
    overlay.classList.add('show');
}

function closeEditModal() {
    const overlay = document.getElementById('edit-modal-overlay');
    const form = document.getElementById('edit-player-form');
    if (overlay) {
        overlay.classList.remove('show');
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 200); 
    }
    if (form) {
        form.reset(); 
        const idEl = document.getElementById('edit-player-id');
        if (idEl) idEl.value = '';
    }
}

export function setupModalListenersEquipe() {
    if (window.__equipe_modal_listeners_attached) return;
    window.__equipe_modal_listeners_attached = true;

    document.addEventListener('click', (e) => {
        const target = e.target;
        if (!target) return;

        if (target.id === 'btn-open-create-modal') {
            e.preventDefault();
            openEditModal({}); 
            return;
        }

        if (target.id === 'btn-cancel-edit') {
            e.preventDefault();
            closeEditModal();
            return;
        }
        
        if (target.id === 'edit-modal-overlay') {
            closeEditModal();
            return;
        }
    });

    document.addEventListener('submit', async (e) => {
        const form = e.target;
        if (!form || form.id !== 'edit-player-form') return;
        
        e.preventDefault();

        const token = localStorage.getItem('authToken');
        if (!token) {
            alert('Usuário não autenticado.');
            return;
        }

        let idRaw = String(document.getElementById('edit-player-id')?.value || '').trim();

        const data = {
            nome: document.getElementById('edit-nome').value,
            numero_camisa: parseInt(document.getElementById('edit-camisa').value, 10),
            classificacao: document.getElementById('edit-classificacao').value,
            nacionalidade: document.getElementById('edit-nacionalidade').value,
            idade: parseInt(document.getElementById('edit-idade').value, 10),
            foto: document.getElementById('edit-foto').value,
            on_team: document.getElementById('edit-on_team').checked,
        };

        if (isNaN(data.numero_camisa)) data.numero_camisa = 0; 
        if (isNaN(data.idade)) data.idade = 0;

        try {
            let ok = false;
            
            if (idRaw) {
                ok = await handleUpdate(idRaw, data, token);
            } else {
                ok = await handleCreate(data, token);
            }
            
            if (ok) {
                 closeEditModal();
            } else {
                 alert('Falha ao salvar jogador.');
            }

        } catch (err) {
            console.error('Erro no submit do modal:', err);
            alert('Erro ao salvar jogador.');
        }
    });
}



async function handleDelete(id, token) {
    try {
        const response = await fetch(`${BACKEND_URL}/api/private/equipe/delete/jogador/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
            const msg = data?.error || `Erro: ${response.status}`;
            throw new Error(msg);
        }
        const row = document.getElementById(`player-row-${id}`);
        if (row) row.remove();
        alert(data?.message || 'Jogador deletado com sucesso!');
    } catch (error) {
        console.error('Erro ao deletar:', error);
        alert('Erro ao deletar jogador: ' + error.message);
    }
}

async function handleUpdate(id, data, token) {
    try {
        const response = await fetch(`${BACKEND_URL}/api/private/equipe/update/jogador/${id}`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const body = await response.json().catch(() => ({}));

        if (!response.ok) {
            const msg = body?.error || `Erro na atualização: ${response.status}`;
            throw new Error(msg);
        }

        await ADMINadicionarJogador(); // Recarrega a lista

        alert(body?.message || 'Jogador atualizado com sucesso!');
        return true;
    } catch (error) {
        console.error('Erro ao atualizar:', error);
        alert('Erro ao atualizar jogador: ' + error.message);
        return false;
    }
}

async function handleCreate(data, token) {
    try {
        const response = await fetch(`${BACKEND_URL}/api/private/equipe/create/jogador`, { 
            method: 'POST', 
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(data) 
        });

        const body = await response.json().catch(() => ({}));

        if (!response.ok) {
            const msg = body?.error || `Erro na criação: ${response.status}`;
            throw new Error(msg);
        }

        await ADMINadicionarJogador(); // Recarrega a lista

        alert(body?.message || 'Jogador criado com sucesso!');
        return true;
    } catch (error) {
        console.error('Erro ao criar:', error);
        alert('Erro ao criar jogador: ' + error.message);
        return false;
    }
}