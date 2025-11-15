import { BACKEND_URL } from '../../url.js'; 


export async function ADMINtableManager(){
    await getPrismaInfo()
    
    return ` 
    <div class="flex-container">
        <aside id="table-list">
        </aside>
        <aside>
        </aside>
        <section id="table">         
        </section>
            
    </div>
    `
}

let tablesInfo = {}

async function getPrismaInfo(){
    try{
        const token = localStorage.getItem('authToken');
        if (!token) {
            const p = document.createElement('p');
            p.textContent = "Usuário não autenticado.";
            usersContainer.appendChild(p);
            return;
        }

        const response = await fetch(`${BACKEND_URL}/api/private/tablemanager/list`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        tablesInfo = await response.json().catch(() => ({}));
    }catch{

    }
}


export async function adicionarBotoes(){
    const tableList = document.querySelector("#table-list")
    if (!tableList){
        console.error('Container #table-list não encontrado.');
        return;
    }

    try{
        const tables = tablesInfo.tables
        for(let key in tables){
            const tableButton = document.createElement("button")
            tableButton.classList.add("btn")
            tableButton.innerHTML = `${key}`
            tableButton.dataset.table = key
            tableButton.addEventListener("click", ()=>{
                renderizarTabela(tableButton.dataset.table)
            })
            tableList.append(tableButton)
        }
    }catch(error){
        console.error("Erro ao buscar e adicionar tabelas:", error);
        tableList.innerHTML += `<p style="color: red;">Falha ao carregar tabelas. (${error.message})</p>`;
    }
}

export async function renderizarTabela(tableName){
    const tableContainer = document.querySelector("#table")
    if (!tableContainer){
        console.error('Container #table não encontrado.');
        return;
    }
    
    try{
        const tableFields = tablesInfo.tables[tableName]
        const tableHeader = document.createElement("div")
        tableHeader.classList.add("table-line","header")
        tableHeader.style.setProperty("--num-columns", Object.keys(tableFields).length)
        for(let field of tableFields){
            const p = document.createElement("p")
            p.innerHTML = `${field.name}`
            tableHeader.append(p)
        }
        tableContainer.innerHTML = ""
        tableContainer.append(tableHeader)

        const token = localStorage.getItem('authToken');
        if (!token) {
            const p = document.createElement('p');
            p.textContent = "Usuário não autenticado.";
            usersContainer.appendChild(p);
            return;
        }

        const response = await fetch(`${BACKEND_URL}/api/private/tablemanager/list/${tableName}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json().catch(() => ({}));
        
        data.data.forEach( line => {
            const tableLineContainer = document.createElement("div")
            tableLineContainer.classList.add("table-line")
            for(let key in line){
                const p = document.createElement("p")
                p.innerHTML = `${line[key]}`
                tableLineContainer.append(p)
                tableLineContainer.style.setProperty("--num-columns", Object.keys(line).length)
                console.log("adicionei campo")
            }
            tableContainer.append(tableLineContainer)
            console.log("adicionei linha")
        });
        

    }catch(error){
        console.error(`Erro em renderizarTabela(${tableName})`, error)
    }
}