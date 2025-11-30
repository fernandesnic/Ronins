// Arquivo: componentes/contatoHandler.js
import { BACKEND_URL } from '../url.js'; 


export function setupContatoForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return; 

    const submitButton = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); 

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Validação básica
        if (!data.name || !data.email || !data.message) {
            alert('Por favor, preencha todos os campos.');
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
            return;
        }
        
        // Validação de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            alert('Por favor, insira um e-mail válido.');
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
            return;
        }

        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Enviando...';
        submitButton.disabled = true;

        try {
            const response = await fetch(`${BACKEND_URL}/api/public/contato`, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();

            if (response.ok) {
                alert('Mensagem enviada com sucesso! Obrigado.');
                form.reset();
            } else {
                throw new Error(result.error || 'Falha ao enviar a mensagem.');
            }

        } catch (error) {
            console.error('Erro no formulário de contato:', error);
            alert(`Erro: ${error.message}`);
        } finally {
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
        }
    });
}