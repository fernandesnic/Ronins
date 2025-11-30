// --- Configuração ---
import { BACKEND_URL } from './url.js';

// --- Funções de Feedback ---
function showMessage(message, isError = false) {
    alert(message); 
}

// --- Funções de Submissão (Comunicação com Backend) ---
export async function handleLoginSubmit(event) {
    event.preventDefault();
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-pass');
    const submitButton = event.target.querySelector('button[type="submit"]');
    
    const email = emailInput?.value?.trim();
    const password = passwordInput?.value;

    if (!email || !password) {
        showMessage('Por favor, preencha e-mail e senha.', true);
        return;
    }

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage('Por favor, insira um e-mail válido.', true);
        return;
    }

    // Desabilita botão durante o processo
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Entrando...';
    }

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
    } finally {
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = 'Entrar';
        }
    }
}

export async function handleCadastroSubmit(event) {
    event.preventDefault();
    const firstName = document.getElementById('firstname')?.value?.trim() || '';
    const lastName = document.getElementById('lastname')?.value?.trim() || '';
    const emailInput = document.getElementById('cadastro-email');
    const passwordInput = document.getElementById('cadastro-password');
    const submitButton = event.target.querySelector('button[type="submit"]');
    
    const email = emailInput?.value?.trim();
    const password = passwordInput?.value;
    const nome = `${firstName} ${lastName}`.trim();

    if (!nome || !email || !password) {
        showMessage('Por favor, preencha nome, e-mail e senha.', true);
        return;
    }

    // Validações
    if (nome.length < 2) {
        showMessage('O nome deve ter pelo menos 2 caracteres.', true);
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage('Por favor, insira um e-mail válido.', true);
        return;
    }

    if (password.length < 6) {
        showMessage('A senha deve ter pelo menos 6 caracteres.', true);
        return;
    }

    // Desabilita botão durante o processo
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Cadastrando...';
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
    } finally {
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = 'Cadastrar';
        }
    }
}

// --- Funções de Estado de Autenticação (UI) ---
export function isUserLoggedIn() {
    return !!localStorage.getItem('authToken');
}

export function getCurrentUser() {
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

    const headerBtns = document.getElementById('header-btns');
    if (!headerBtns) return;

    const menuList = document.querySelector('.menu ul');
    
    // Remove botões admin antigos de ambos os lugares
    headerBtns.querySelectorAll('.admin-button-li').forEach(btn => btn.remove());
    if (menuList) {
        menuList.querySelectorAll('.admin-button-li').forEach(btn => btn.remove());
    }

    const logged = isUserLoggedIn();

    if (logged) {

        // Botões de admin
        if (isUserAdmin()) {

            const buttons = [
                { label: 'Admin', hash: '#ADMINtableManager' },
                { label: 'Vendas', hash: '#vendas' },
                { label: 'Emails', hash: '#mensagens' },
            ];

            // Insere os botões admin no #header-btns (desktop) e no menuList (mobile)
            buttons.forEach(item => {
                // Para desktop - dentro do #header-btns
                const btnDiv = document.createElement('div');
                btnDiv.className = 'admin-button-li';
                const link = document.createElement('a');
                link.href = item.hash;
                link.className = 'btn';
                link.textContent = item.label;
                link.setAttribute('aria-label', `Ir para página de ${item.label}`);
                btnDiv.appendChild(link);
                headerBtns.insertBefore(btnDiv, loginButton);
                
                // Para mobile - dentro do menuList
                if (menuList) {
                    const li = document.createElement('li');
                    li.className = 'admin-button-li';
                    const mobileLink = document.createElement('a');
                    mobileLink.href = item.hash;
                    mobileLink.className = 'btn';
                    mobileLink.textContent = item.label;
                    mobileLink.setAttribute('aria-label', `Ir para página de ${item.label}`);
                    li.appendChild(mobileLink);
                    // Insere antes do botão de tema
                    const themeButton = menuList.querySelector('#theme-switch')?.parentElement;
                    if (themeButton) {
                        menuList.insertBefore(li, themeButton);
                    } else {
                        menuList.appendChild(li);
                    }
                }
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
        if (loginButton.onclick) loginButton.onclick = null;

    }
}
