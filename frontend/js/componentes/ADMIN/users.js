export function users(){
    return `
     <section class="section">
            
            <div class="container">
                <h1>USUÁRIOS</h1>
                <p>
                    Essa é uma página restrita, apenas pessoas autorizadas podem acessá-la.<br>
                    Nela você poderá editar e excluir contas de usuários
                </p>
            
                <section id="users-grid">
                    <div class="header">
                        <p>NOME</p>
                        <p>EMAIL</p>
                        <p>SOCIO</p>
                        <p>ADMIN</p>
                    </div>
                </section>
            </div>
            
        </section>
    `
}

export async function adicionarUsuarios(){
    const usersContainer = document.querySelector("#users-grid");
    try {
        // 1. Pega o token salvo no localStorage
        const token = localStorage.getItem('authToken');

        if (!token) {
            throw new Error("Usuário não autenticado.");
        }

        // 2. Adiciona o token ao cabeçalho da requisição
        const response = await fetch("http://localhost:3000/api/private/list", {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Erro na API: ${response.status} ${response.statusText}`)
        } 

        const data = await response.json()

        const usersList = data.users;

        if (!usersList || usersList.length === 0) {
            usersContainer.innerHTML += "<p>Nenhum usuário encontrado.</p>";
            return;
        }

        usersList.forEach(item => {
            const div = document.createElement("div");
            div.classList.add("user")

            div.innerHTML = `
                <p>${item.nome}</p> 
                <p>${item.email}</p>
                <p>${item.is_socio ? 'Sim' : 'Não'}</p>
                <p>${item.is_admin ? 'Sim' : 'Não'}</p>
                <button class="btn">E</button>
                <button class="btn">X</button>
            `
            usersContainer.appendChild(div);
        })
        
    } catch (error) {
    console.error("Erro ao buscar e adicionar usuários:", error);
        // Mostra uma mensagem mais útil, indicando que o login pode ser necessário
        usersContainer.innerHTML = `<p style="color: red;">Falha ao carregar usuários. Você está logado? (${error.message})</p>`;   
     }
}
