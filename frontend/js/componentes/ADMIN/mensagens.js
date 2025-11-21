import { BACKEND_URL } from '../../url.js'; 

export function mensagens(){
    return `
    <section class="section">
        <h1>Mensagens</h1>
        <div class="flex-container">
            <aside id="messages-list">
                <div id="search-options">
                    <label for="filtro-status">Filtrar por Status:</label>
                    <select id="filtro-status">
                        <option value="todos">Todos</option>
                        <option value="pendente">Pendentes</option>
                        <option value="entregue">Lidos</option>
                    </select>
                </div>
                <div id="scroll">
                </div>
            </aside>
            <section id="message-container">
                <div id="header">
                    <div id="owner">
                        <h3>de: Fulano</h3>
                        <h4>fulano@gamil.com</h4>
                    </div>
                    <h4>04/10/2025</h4>
                </div>
                <div id="content">
                    <p>
                        
                    </p>
                    
                </div>
                <button class="btn marcar-lido" id="marcar-lido">marcar como lido 🗹</button> 
            </section>        
        </div>
    </section>
    
    `
}

export async function adicionarMensagens(){
    const messagesList = document.querySelector("#scroll");
    const messageContainer = document.querySelector("#message-container")

    const token = localStorage.getItem('authToken');
    if (!token) {
        const p = document.createElement('p');
        p.textContent = "Usuário não autenticado.";
        messagesList.appendChild(p);
        return;
    }

    const response = await fetch(`${BACKEND_URL}/api/private/mensagem/list`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const dados = await response.json().catch(() => ({}));
    if(!response.ok){
        console.log(dados.error)
        return
    }

    if(dados.length <= 0){
        const error = document.createElement("p")
        error.style.textAlign = "center"
        error.innerText = `não há nenhuma mensagem para ler`
        messagesList.append(error)
        return
    }

    dados.messages.forEach(item => {
        messagesList.append(createButton(item))
    });
    messagesList.children[0].click()

    const marcarComoLido = document.querySelector("#marcar-lido")
    marcarComoLido.addEventListener("click", async () => {
        const childrenList = Array.from(messagesList.children)
        const currentMessage = childrenList.find(
            (element) => element.dataset.id === messageContainer.dataset.id
        )
        if(!currentMessage){
            console.error("erro, mensagem não encontrada na lista de mensagens")
            return
        }
        const token = localStorage.getItem('authToken');
        if (!token) {
            const p = document.createElement('p');
            p.textContent = "Usuário não autenticado.";
            messagesList.appendChild(p);
            return;
        }

        const lido = !(currentMessage.dataset.lido === 'true')
        console.log(currentMessage.dataset.lido === 'true')
        const response = await fetch(`${BACKEND_URL}/api/private/mensagem/update/mensagem/${currentMessage.dataset.id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                lido
            })
        });

        if(!response.ok){
            console.error(response.error)
            return
        }
        currentMessage.dataset.lido = lido
        setMarcarLido(lido)
        if(lido){
            currentMessage.classList.remove("novo")
        }else{
            currentMessage.classList.add("novo")
        }
    })

    
}

function setMarcarLido(value){
    if(value){
        const marcarComoLido = document.querySelector("#marcar-lido")
        marcarComoLido.classList.remove("marcar-lido")
        marcarComoLido.classList.add("remover-lido")
        marcarComoLido.innerText = "Desmarcar como lido"
    }else{
        const marcarComoLido = document.querySelector("#marcar-lido")
        marcarComoLido.classList.add("marcar-lido")
        marcarComoLido.classList.remove("remover-lido")
        marcarComoLido.innerText = "Marcar como lido"
    }
}

// roubei de vendas fds XDDD😝
function formatarData(dataISO) {
  if (!dataISO) return '---';
  const data = new Date(dataISO);
  return data.toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short'
  });
}

function createButton(message){
    const button = document.createElement("button")
    button.classList.add("btn")
    if(!message.lido) button.classList.add("novo")
    button.dataset.nome = message.nome
    button.dataset.email = message.email
    button.dataset.mensagem = message.mensagem
    button.dataset.criadoEm = formatarData(message.criadoEm)
    button.dataset.lido = message.lido
    button.dataset.id = message.id

    button.innerHTML =  `
    <div class="message-header">
        <p class="message-owner">${message.nome}</p>
        <p class="message-date">${formatarData(message.criadoEm)}</p>
    </div>
    
    <p class="message">${message.mensagem}</p>
    `
    const messageContainer = document.querySelector("#message-container")
    button.addEventListener("click", () => {
        const messagesList = document.querySelector("#scroll");
        const name = messageContainer.querySelector("#owner > h3")
        const email = messageContainer.querySelector("#owner > h4")
        const mensagem = messageContainer.querySelector("#content > p")
        const data = messageContainer.querySelector("#header > h4")
        name.innerText = button.dataset.nome
        email.innerText = button.dataset.email
        mensagem.innerText = button.dataset.mensagem
        data.innerText = button.dataset.criadoEm
        messageContainer.dataset.id = button.dataset.id
        
        const activeButtons = messagesList.querySelector(".active")
        if(activeButtons){

            activeButtons.classList.remove("active")
        }
        button.classList.add("active")
    
        setMarcarLido(button.dataset.lido === 'true')
    })
    return button
}
