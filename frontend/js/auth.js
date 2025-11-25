// --- Configuração ---
import { BACKEND_URL } from './url.js';

// --- Funções de Feedback ---
function showMessage(message, isError = false) {
    alert(message); 
}

// --- Funções de Submissão (Comunicação com Backend) ---
export async function handleLoginSubmit(event) {
    event.preventDefault();
    const email = document.getElementById('login-email')?.value;
    const password = document.getElementById('login-pass')?.value;

    if (!email || !password) return showMessage('Por favor, preencha e-mail e senha.', true);

    try {
        const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Erro ao fazer login.');

        // Salva os dados da sessão
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userData', JSON.stringify(data.user));

        showMessage('Login realizado com sucesso!');

        // Atualiza header instantaneamente
        updateHeaderActions();
        window.location.hash = '#home';

    } catch (error) {
        showMessage(error.message, true);
    }
}

export async function handleCadastroSubmit(event) {
    event.preventDefault();
    const firstName = document.getElementById('firstname')?.value || '';
    const lastName = document.getElementById('lastname')?.value || '';
    const email = document.getElementById('cadastro-email')?.value;
    const password = document.getElementById('cadastro-password')?.value;
    const nome = `${firstName} ${lastName}`.trim();

    if (!nome || !email || !password) {
        showMessage('Por favor, preencha nome, e-mail e senha.', true);
        return;
    }

    try {
        const response = await fetch(`${BACKEND_URL}/api/auth/cadastro`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, email, password }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Erro ao realizar o cadastro.');

        showMessage('Cadastro realizado com sucesso! Redirecionando para o login...');
        window.location.hash = '#login';

    } catch (error) {
        showMessage(error.message, true);
    }
}

// --- Funções de Estado de Autenticação (UI) ---
export function isUserLoggedIn() {
    return !!localStorage.getItem('authToken');
}

function getCurrentUser() {
    try {
        const userData = localStorage.getItem('userData');
        return userData ? JSON.parse(userData) : null;
    } catch {
        return null;
    }
}

function isUserAdmin() {
    const user = getCurrentUser();
    if (!user) return false;

    return (
        user.is_admin === true ||
        user.isAdmin === true ||
        user.admin === true ||
        user.role === 'admin' ||
        (Array.isArray(user.roles) && user.roles.includes('admin'))
    );
}

export function logout(event) {
    if (event) event.preventDefault();
    localStorage.removeItem('userData');
    localStorage.removeItem('authToken');

    showMessage('Você foi desconectado.');
    updateHeaderActions();
    window.location.hash = '#home';
}

/**
 * Atualiza o botão de login/sair e adiciona o botão Users se for admin.
 */
export function updateHeaderActions() {
    const loginButton = document.getElementById('btn-login');
    if (!loginButton) return;

    const menuList = loginButton.closest('ul');
    if (!menuList) return;

    // Remove botões admin antigos
    menuList.querySelectorAll('.admin-button-li').forEach(btn => btn.remove());

    const logged = isUserLoggedIn();

    if (logged) {

        // Botões de admin
        if (isUserAdmin()) {

            const buttons = [
                { label: 'Admin', hash: '#ADMINtableManager' },
                { label: 'Emails', hash: '#mensagens' },

            ];

            buttons.forEach(item => {
                const li = document.createElement('ul');
                li.className = 'admin-button-li';
                li.innerHTML = `<a href="${item.hash}" class="btn">${item.label}</a>`;
                menuList.insertBefore(li, loginButton.parentElement);
            });
        }

        // Transformar botão em "Sair"
        loginButton.textContent = "Sair";
        loginButton.href = "#";
        loginButton.onclick = logout;

    } else {

        // Mostrar login
        loginButton.textContent = "Login";
        loginButton.href = "#login";

    }
}
