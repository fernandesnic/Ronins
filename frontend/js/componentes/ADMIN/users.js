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
    const arquivo = await fetch("assets/dados/users.json");
    const dados = await arquivo.json();
    dados.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("user");
        div.innerHTML = `
            <p>${item.nome}</p> 
            <p>${item.email}</p>
            <p>${item.issocio}</p>
            <p>${item.isadmin}</p>
            <button class="btn">E</button>
            <button class="btn">X</button>
        `
        usersContainer.appendChild(div);
    });
}