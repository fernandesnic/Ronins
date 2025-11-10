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
        const response = await fetch(`${BACKEND_URL}/api/public/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Erro ao fazer login.');

        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userData', JSON.stringify(data.user));
        showMessage('Login realizado com sucesso!');
        window.location.hash = '#home';
        window.location.reload();
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

    try {
        const response = await fetch(`${BACKEND_URL}/api/public/cadastro`, {
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
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
}

function isUserAdmin() {
    const user = getCurrentUser();
    return !!(user && user.is_admin);
}

export function logout(event) {
    if (event) event.preventDefault();
    localStorage.removeItem('userData');
    localStorage.removeItem('authToken');
    showMessage('Você foi desconectado.');
    window.location.hash = '#home';
    window.location.reload();
}

/**
 * Atualiza o botão de login/sair e adiciona o botão Users se for admin.
 */
export function updateHeaderActions() {
    const loginButton = document.querySelector('.btn-login');
    if (!loginButton) return;

    const loginLI = loginButton.closest('li');
    const menuList = loginLI ? loginLI.parentElement : null;
    if (!menuList) return;

    // Remove botões admin antigos se existirem
    const oldAdminButtons = menuList.querySelectorAll('.admin-button-li');
    oldAdminButtons.forEach(btn => btn.remove());

    // Limpa listeners antigos
    loginButton.onclick = null;
    loginButton.removeEventListener && loginButton.removeEventListener('click', logout);

    if (isUserLoggedIn()) {
        // Se for admin, insere botões antes do li do login
        if (isUserAdmin()) {
            // Botão Users
            const usersLI = document.createElement('li');
            usersLI.className = 'admin-button-li';
            usersLI.innerHTML = '<a href="#users" class="btn">Users</a>';
            menuList.insertBefore(usersLI, loginLI);

            // Botão Vendas
            const vendasLI = document.createElement('li');
            vendasLI.className = 'admin-button-li';
            vendasLI.innerHTML = '<a href="#vendas" class="btn">Vendas</a>';
            menuList.insertBefore(vendasLI, loginLI);
        }

        loginButton.textContent = 'Sair';
        loginButton.setAttribute('href', '#');
        loginButton.addEventListener('click', logout);
    } else {
        loginButton.textContent = 'Login';
        loginButton.setAttribute('href', '#login');
    }
}