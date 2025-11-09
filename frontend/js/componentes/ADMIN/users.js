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
        console.error('Container #users-grid não encontrado.');
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

        const usersList = data.users || data;

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

    } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        usersContainer.innerHTML += `<p style="color: red;">Falha ao carregar usuários. (${error.message})</p>`;
    }
}

function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

// ----------------------------------------------------
// Helpers
// ----------------------------------------------------
function unescapeHtml(str) {
    return String(str).replace(/&lt;|&gt;|&amp;|&quot;|&#39;/g, (m) => ({'&lt;':'<','&gt;':'>','&amp;':'&','&quot;':'"','&#39;':"'" }[m]));
}

export function setupModalListeners() {
    // Remove the guard clause to ensure listeners are always attached
    // if (window.__users_listeners_attached) return;
    // window.__users_listeners_attached = true;

    // Click handler for edit and delete buttons
    document.body.addEventListener('click', async (e) => {
        const target = e.target;
        if (!target) return;

        // Edit button handler
        if (target.classList.contains('btn-edit')) {
            e.preventDefault();
            console.log('Edit button clicked:', target.dataset); // Debug log

            const user = {
                id: target.dataset.id,
                nome: unescapeHtml(target.dataset.nome || ''),
                is_socio: target.dataset.is_socio === 'true',
                is_admin: target.dataset.is_admin === 'true'
            };

            if (!user.id) {
                console.error('ID ausente no botão de edit:', target);
                return;
            }

            openEditModal(user);
            return;
        }

        // Delete button handler
        if (target.classList.contains('btn-delete')) {
            e.preventDefault();
            const id = target.dataset.id;
            const token = localStorage.getItem('authToken');
            if (!token) return alert('Usuário não autenticado.');
            if (!id) return console.error('ID ausente no botão de delete.');
            if (!confirm('Confirma exclusão do usuário?')) return;
            await handleDelete(id, token);
            return;
        }

        // Modal close handlers
        if (target.id === 'btn-cancel-edit' || 
            (target.id === 'edit-modal-overlay' && target === e.currentTarget)) {
            e.preventDefault();
            closeEditModal();
        }
    });

    // Form submit handler
    document.body.addEventListener('submit', async (e) => {
        const form = e.target;
        if (!form || form.id !== 'edit-user-form') return;
        e.preventDefault();

        try {
            const token = localStorage.getItem('authToken');
            if (!token) throw new Error('Usuário não autenticado');

            const idEl = document.getElementById('edit-user-id');
            const idRaw = idEl?.value?.trim();

            if (!idRaw) throw new Error('ID do usuário inválido');

            const nome = document.getElementById('edit-nome')?.value?.trim();
            if (!nome) throw new Error('Nome é obrigatório');

            const data = {
                nome,
                is_socio: document.getElementById('edit-is_socio')?.checked || false,
                is_admin: document.getElementById('edit-is_admin')?.checked || false
            };

            console.log('Submitting update:', { id: idRaw, data }); // Debug log

            const ok = await handleUpdate(idRaw, data, token);
            if (ok) {
                closeEditModal();
                await adicionarUsuarios(); // Recarrega a lista
            }
        } catch (err) {
            console.error('Erro no submit do formulário:', err);
            alert(err.message || 'Erro ao atualizar usuário');
        }
    });
}

function openEditModal(user) {
    console.log('Opening modal for user:', user); // Debug log

    const overlay = document.getElementById('edit-modal-overlay');
    const idEl = document.getElementById('edit-user-id');
    const nomeEl = document.getElementById('edit-nome');
    const socioEl = document.getElementById('edit-is_socio');
    const adminEl = document.getElementById('edit-is_admin');

    if (!overlay || !idEl || !nomeEl || !socioEl || !adminEl) {
        console.error('Elementos do modal não encontrados:', {
            overlay: !!overlay,
            idEl: !!idEl,
            nomeEl: !!nomeEl,
            socioEl: !!socioEl,
            adminEl: !!adminEl
        });
        return;
    }

    // Preenche os campos
    idEl.value = String(user.id || '');
    nomeEl.value = user.nome || '';
    socioEl.checked = !!user.is_socio;
    adminEl.checked = !!user.is_admin;

    // Exibe o modal
    overlay.style.display = 'flex';
    // Força reflow
    void overlay.offsetWidth;
    overlay.classList.add('show');
}

function closeEditModal() {
    const overlay = document.getElementById('edit-modal-overlay');
    const form = document.getElementById('edit-user-form');
    
    if (overlay) {
        overlay.classList.remove('show');
        overlay.style.display = 'none';
    }
    
    if (form) {
        form.reset();
        const idEl = document.getElementById('edit-user-id');
        if (idEl) idEl.value = '';
    }
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
    console.log('Attempting to update user:', { id, data }); // Debug log

    try {
        const response = await fetch(`http://localhost:3000/api/private/update/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        console.log('Update response status:', response.status); // Debug log

        const body = await response.json().catch(err => {
            console.error('Error parsing response:', err);
            return {};
        });

        console.log('Update response body:', body); // Debug log

        if (!response.ok) {
            const msg = body?.error || `Erro na atualização: ${response.status}`;
            throw new Error(msg);
        }

        // atualiza a lista no frontend
        await adicionarUsuarios();

        alert(body?.message || 'Usuário atualizado com sucesso!');
        return true;

    } catch (error) {
        console.error('Erro detalhado ao atualizar:', {
            message: error.message,
            error: error
        });
        alert(`Erro ao atualizar usuário: ${error.message}`);
        return false;
    }
}