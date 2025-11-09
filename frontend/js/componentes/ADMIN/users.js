export function users(){
    return `
    <section class="section">
        <h1>Usuários</h1>
        <div id="users-grid" class="table-grid">
            <div class="header">
                <p>NOME</p><p>EMAIL</p><p>SOCIO</p><p>ADMIN</p>
            </div>
        </div>
    </section>

    <div id="edit-modal-overlay" class="modal-overlay">
        <div class="modal-content">
            <h2>Editar Usuário</h2>
            <form id="edit-user-form">
                <input type="hidden" id="edit-user-id">

                <div>
                    <label for="edit-nome">Nome:</label>
                    <input type="text" id="edit-nome" required>
                </div>

                <div class="checkbox-group">
                    <label>
                        <input type="checkbox" id="edit-is_socio">
                        É Sócio?
                    </label>
                </div>

                <div class="checkbox-group">
                    <label>
                        <input type="checkbox" id="edit-is_admin">
                        É Admin?
                    </label>
                </div>

                <div class="modal-buttons">
                    <button type="submit" class="btn">Salvar</button>
                    <button type="button" id="btn-cancel-edit" class="btn btn-secondary">Cancelar</button>
                </div>
            </form>
        </div>
    </div>
    `;
}

export async function adicionarUsuarios(){
    const usersContainer = document.querySelector("#users-grid");
    if (!usersContainer) {
        console.error('Container #users-grid não encontrado. Certifique-se que users() foi inserido no DOM antes de chamar adicionarUsuarios().');
        return;
    }

    try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            usersContainer.innerHTML += "<p>Usuário não autenticado.</p>";
            return;
        }

        const response = await fetch("http://localhost:3000/api/private/list", {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            const msg = data?.error || `Erro na API: ${response.status}`;
            throw new Error(msg);
        }

        const usersList = data.users || data; // aceita formatos variados

        if (!usersList || usersList.length === 0) {
            usersContainer.innerHTML += "<p>Nenhum usuário encontrado.</p>";
            return;
        }

        usersList.forEach(item => {
            const div = document.createElement("div");
            div.classList.add("user");
            div.id = `user-row-${item.id}`;

            div.innerHTML = `
                <p>${item.nome || ''}</p>
                <p>${item.email || ''}</p>
                <p>${item.is_socio ? 'Sim' : 'Não'}</p>
                <p>${item.is_admin ? 'Sim' : 'Não'}</p>
                <button class="btn btn-edit"
                    data-id="${item.id}"
                    data-nome="${escapeHtml(item.nome || '')}"
                    data-is_socio="${!!item.is_socio}"
                    data-is_admin="${!!item.is_admin}"
                    title="Editar"
                >E</button>
                <button class="btn btn-delete" data-id="${item.id}" title="Deletar">X</button>
            `;
            usersContainer.appendChild(div);
        });

        setupClickListeners(usersContainer);

    } catch (error) {
        console.error("Erro ao buscar e adicionar usuários:", error);
        usersContainer.innerHTML += `<p style="color: red;">Falha ao carregar usuários. (${error.message})</p>`;
    }
}

function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

// ----------------------------------------------------
// Helpers
// ----------------------------------------------------
function setupClickListeners(container) {
    if (!container) return;
    if (container.dataset.listenerAttached === 'true') return;
    container.dataset.listenerAttached = 'true';

    container.addEventListener('click', (event) => {
        const target = event.target;
        if (!target) return;

        if (target.classList.contains('btn-delete')) {
            const id = target.dataset.id || target.closest('.user')?.id?.replace(/^user-row-/, '');
            const token = localStorage.getItem('authToken');
            if (!token) return alert('Usuário não autenticado.');
            if (!id) return console.error('ID ausente no botão de delete.');
            if (!confirm('Confirma exclusão do usuário?')) return;
            handleDelete(id, token);
            return;
        }

        if (target.classList.contains('btn-edit')) {
            // tenta obter id por vários caminhos
            const idFromData = target.dataset.id;
            const idFromRow = target.closest('.user')?.id?.replace(/^user-row-/, '');
            const fallbackId = idFromData || idFromRow || '';
            if (!fallbackId) {
                console.error('ID ausente no botão de edit. Element:', target);
                return;
            }
            const user = {
                id: String(fallbackId),
                nome: unescapeHtml(target.dataset.nome || target.getAttribute('data-nome') || ''),
                is_socio: (target.dataset.is_socio === 'true'),
                is_admin: (target.dataset.is_admin === 'true')
            };
            openEditModal(user);
        }
    });
}

function unescapeHtml(str) {
    return String(str).replace(/&lt;|&gt;|&amp;|&quot;|&#39;/g, (m) => ({'&lt;':'<','&gt;':'>','&amp;':'&','&quot;':'"','&#39;':"'" }[m]));
}

function openEditModal(user) {
    const overlay = document.getElementById('edit-modal-overlay');
    const idEl = document.getElementById('edit-user-id');
    if (!overlay || !idEl) {
        console.error('Modal não encontrado no DOM.');
        return;
    }

    // garante que o id esteja presente e salvo no hidden
    idEl.value = String(user.id || '');
    document.getElementById('edit-nome').value = user.nome || '';
    document.getElementById('edit-is_socio').checked = !!user.is_socio;
    document.getElementById('edit-is_admin').checked = !!user.is_admin;

    overlay.style.display = 'flex';
    void overlay.offsetWidth;
    overlay.classList.add('show');
}

function closeEditModal() {
    const overlay = document.getElementById('edit-modal-overlay');
    const form = document.getElementById('edit-user-form');
    if (overlay) {
        overlay.classList.remove('show');
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 200);
    }
    if (form) {
        form.reset();
        const idEl = document.getElementById('edit-user-id');
        if (idEl) idEl.value = '';
    }
}

export function setupModalListeners() {
    if (window.__users_modal_listeners_attached) return;
    window.__users_modal_listeners_attached = true;

    // fechar por cancelar / click no overlay
    document.addEventListener('click', (e) => {
        const target = e.target;
        if (!target) return;
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

    // submit do form: aceita ID como string (UUID ou numérico)
    document.addEventListener('submit', async (e) => {
        const form = e.target;
        if (!form || form.id !== 'edit-user-form') return;
        e.preventDefault();

        const token = localStorage.getItem('authToken');
        if (!token) {
            alert('Usuário não autenticado.');
            return;
        }

        // pega ID preferencialmente do hidden, se estiver vazio tenta buscar no DOM (último edit-open)
        let idRaw = String(document.getElementById('edit-user-id')?.value || '').trim();
        if (!idRaw) {
            // tenta encontrar o user-row com foco/selecionado
            const possible = document.querySelector('.user[id^="user-row-"]');
            idRaw = possible ? possible.id.replace(/^user-row-/, '') : '';
        }

        if (!idRaw) {
            console.error('ID do usuário inválido no submit do modal.');
            alert('ID do usuário inválido.');
            return;
        }

        const data = {
            nome: document.getElementById('edit-nome').value,
            is_socio: document.getElementById('edit-is_socio').checked,
            is_admin: document.getElementById('edit-is_admin').checked
        };

        try {
            const ok = await handleUpdate(idRaw, data, token);
            if (ok) closeEditModal();
            else alert('Falha ao atualizar usuário.');
        } catch (err) {
            console.error('Erro no submit do modal:', err);
            alert('Erro ao atualizar usuário.');
        }
    });
}

async function handleDelete(id, token) {
    try {
        const response = await fetch(`http://localhost:3000/api/private/delete/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
            const msg = data?.error || `Erro: ${response.status}`;
            throw new Error(msg);
        }
        const row = document.getElementById(`user-row-${id}`);
        if (row) row.remove();
        alert(data?.message || 'Usuário deletado com sucesso!');
    } catch (error) {
        console.error('Erro ao deletar:', error);
        alert('Erro ao deletar usuário: ' + error.message);
    }
}

async function handleUpdate(id, data, token) {
    try {
        const response = await fetch(`http://localhost:3000/api/private/update/${id}`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const body = await response.json().catch(() => ({}));

        if (!response.ok) {
            const msg = body?.error || `Erro na atualização: ${response.status}`;
            throw new Error(msg);
        }

        // atualiza a lista no frontend
        await adicionarUsuarios();

        alert(body?.message || 'Usuário atualizado com sucesso!');
        return true;
    } catch (error) {
        console.error('Erro ao atualizar:', error);
        alert('Erro ao atualizar usuário: ' + error.message);
        return false;
    }
}