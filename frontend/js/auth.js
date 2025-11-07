// --- Configuração ---
const API_URL = 'http://localhost:3000/api';

// --- Funções de Feedback ---
function showMessage(message, isError = false) {
    alert(message); // Usando alert por simplicidade
}

// --- Funções de Submissão (Comunicação com Backend) ---

export async function handleLoginSubmit(event) {
    event.preventDefault();
    const email = document.getElementById('login-email')?.value;
    const password = document.getElementById('login-pass')?.value;

    if (!email || !password) {
        return showMessage('Por favor, preencha e-mail e senha.', true);
    }

    try {
        const response = await fetch(`${API_URL}/public/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Erro ao fazer login.');
        }

        localStorage.setItem('authToken', data.token);
        showMessage('Login realizado com sucesso!');
        window.location.hash = '#home'; // Volta para a página inicial após o login
    } catch (error) {
        showMessage(error.message, true);
    }
}

export async function handleCadastroSubmit(event) {
    event.preventDefault();

    const firstName = document.getElementById('firstname')?.value;
    const lastName = document.getElementById('lastname')?.value;
    const email = document.getElementById('cadastro-email')?.value;
    const password = document.getElementById('cadastro-password')?.value;

    // Combinando nome e sobrenome para o backend
    const nome = `${firstName} ${lastName}`.trim();

    try {
        const response = await fetch(`${API_URL}/public/cadastro`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Erro ao realizar o cadastro.');
        }

        showMessage('Cadastro realizado com sucesso! Redirecionando para o login...');
        window.location.hash = '#login';
    } catch (error) {
        showMessage(error.message, true);
    }
}