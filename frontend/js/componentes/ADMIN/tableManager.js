import { BACKEND_URL } from '../../url.js'; 


export async function ADMINtableManager(){
    await getPrismaInfo()
    
    return `
    <section class="section">
        <h1>GERENCIADOR DE TABELAS</h1>
        <div class="flex-container">
            <aside id="table-list">
            </aside>
            <section id="table">
                <p>Seleciona alguma tabela</p>         
            </section>        
        </div>
    </section> 
    <div id="modal-overlay">
        <div id="modal-content">
            <h2></h2>
            <form>

            </form>
        </div>
    </div>
    
    `
}


// armazena os metadados das tabelas (tipo e nome das colunas)
let tablesInfo = {}

// armazena a tabela selecionada
let currentTable = null

// função pra pegar e armazenar metadados da tabela
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
    }catch(error){
        console.error(error)
    }
}

// função que adiciona os botões de seleção de tabela
export async function adicionarBotoes(){
    const tableList = document.querySelector("#table-list")
    if (!tableList){
        console.error('Container #table-list não encontrado.');
        return;
    }

    try{
        const tables = tablesInfo.tables
        // pra cada valor ele adiciona um botão
        for(let key in tables){
            const tableButton = document.createElement("button")
            tableButton.classList.add("btn")
            tableButton.innerHTML = `${key}`
            tableButton.dataset.table = key // guarda no botão o nome da tablea correspondente
            tableButton.addEventListener("click", ()=>{
                renderizarTabela(tableButton.dataset.table)
            }) // linka o botão com o renderizarTabela, e passa a tabela correspondente
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
        // pega as colunas da tabela selecionada
        const tableFields = tablesInfo.tables[tableName]
        // atualiza o currentTable pra tabela selecionada
        currentTable = tableName

        // limpa o container
        tableContainer.innerHTML = ""
        
        // ------------------------ ADICIONA O HEADER TABELA -------------------------------

        // cria o header da tabela


        const tableHeader = document.createElement("div")
        tableHeader.classList.add("table-line","header")
        tableHeader.style.setProperty("--num-columns", Object.keys(tableFields).length)
        const addButton = document.createElement("button")
        addButton.classList.add("btn", "add")
        addButton.innerHTML = "Adicionar"
        addButton.addEventListener("click", ()=>{
            handleCreate()
        })
        tableHeader.append(addButton)
        for(let field of tableFields){
            const p = document.createElement("p")
            p.innerHTML = `${field.name}`
            tableHeader.append(p)
        }
        //adiciona o header e botão
        tableContainer.append(tableHeader)


        // checa o token
        const token = localStorage.getItem('authToken');
        if (!token) {
            const p = document.createElement('p');
            p.textContent = "Usuário não autenticado.";
            tableContainer.appendChild(p);
            return;
        }

        // ----------------------- ADICIONA OS VALORES CADASTRADOS --------------------------

        // busca os valores no banco de dados
        const response = await fetch(`${BACKEND_URL}/api/private/tablemanager/list/${tableName}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json().catch(() => ({}));
        
        // pra cada linha adiciona os valores
        data.data.forEach( line => {
            tableContainer.append(createLine(line))
        });
    }catch(error){
        console.error(`Erro em renderizarTabela(${tableName})`, error)
    }
}


async function handleEdit(tableLineContainer){
    showModal("Editar", tableLineContainer.children)
    const modalForm = document.querySelector("#modal-content > form")
    const modalOverlay = document.querySelector("#modal-overlay")
    const submitButton = document.querySelector("#modal-content > form > div > .btn.submit")
    submitButton.addEventListener("click", async (e) => {
        e.preventDefault();
        const modalOverlay = document.querySelector("#modal-overlay")
        modalOverlay.classList.remove("show")
        const modalForm = document.querySelector("#modal-content > form")
        let dataToStore = {}
        for(const input of modalForm.children){
            if(input.tagName !== "INPUT") continue
            switch(input.type){
                case "checkbox":
                    dataToStore[input.name] = input.checked 
                    break;
                case "number":
                    dataToStore[input.name] = parseInt(input.value)
                    break;
                default:
                    dataToStore[input.name] = input.value
                    break;
            }
        }
        // pede confirmação
        if (!confirm('Confirma atualização dos dados?')) return;

        // checa o token
        const token = localStorage.getItem('authToken');
        if (!token) {
            const p = document.createElement('p');
            p.textContent = "Usuário não autenticado.";
            tableContainer.appendChild(p);
            return;
        }
        
        // faz a mudança
        const response = await fetch(`${BACKEND_URL}/api/private/tablemanager/update/${currentTable}/${tableLineContainer.lineToEdit}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToStore)
        });



        if(response.ok){
            for(const field of tableLineContainer.children){
                if(field.tagName !== "P") continue;
                if(dataToStore[field.dataset.fieldName] === undefined) continue;
                field.innerHTML = dataToStore[field.dataset.fieldName]
            }
            alert("Dados modificados com sucesso!");
        }else{
            alert(`Erro: ${response.message}`)
        }
    

    })

    for(const inputField of modalForm.children){
        if(inputField.tagName !== "INPUT") continue
        const array = [...tableLineContainer.children]
        const inputValue = array.find((element) => element.dataset.fieldName == inputField.name)
        tablesInfo.tables[currentTable]
        switch(inputField.type){
            case "checkbox":
                inputField.checked = inputValue.innerHTML == "true"
                break;
            default:
                inputField.value = inputValue.innerHTML
                break;
        }
        
    }
}

async function handleDelete(tableLineContainer){
    // pede confirmação
    if (!confirm('Confirma exclusão dos dados?')) return;

    // checa o token
    const token = localStorage.getItem('authToken');
    if (!token) {
        const p = document.createElement('p');
        p.textContent = "Usuário não autenticado.";
        usersContainer.appendChild(p);
        return;
    }

    // remove a linha
    const lineremoved = await fetch(`${BACKEND_URL}/api/private/tablemanager/delete/${currentTable}/${tableLineContainer.lineToEdit}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    tableLineContainer.remove()
}

async function handleCreate(){
    showModal("Criar")
    const submitButton = document.querySelector("#modal-content > form > div > .btn.submit")
    submitButton.addEventListener("click", async (e)=>{
        e.preventDefault()
        const modalOverlay = document.querySelector("#modal-overlay")
        modalOverlay.classList.remove("show")
        const modalForm = document.querySelector("#modal-content > form")
        let dataToStore = {}
        for(const input of modalForm.children){
            if(input.tagName !== "INPUT") continue
            switch(input.type){
                case "checkbox":
                    dataToStore[input.name] = input.checked 
                    break;
                default:
                    dataToStore[input.name] = input.value
                    break;
            }
        }
        
        // pede confirmação
        if (!confirm('Confirma criação dos dados?')) return;

        // checa o token
        const token = localStorage.getItem('authToken');
        if (!token) {
            const p = document.createElement('p');
            p.textContent = "Usuário não autenticado.";
            tableContainer.appendChild(p);
            return;
        }
        
        // faz a mudança
        const response = await fetch(`${BACKEND_URL}/api/private/tablemanager/create/${currentTable}/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToStore)
        });



        if(response.ok){
            renderizarTabela(currentTable)
            // document.querySelector("#table").append(createLine({,...dataToStore}))
            alert("Dados criados com sucesso!");
        }else{
            alert(`Erro: ${response.message}`)
        }
    
    })
}

function createLine(lineInfo){
     // cria o tableLineContainer
    const tableLineContainer = document.createElement("div")
    tableLineContainer.classList.add("table-line")
    tableLineContainer.lineToEdit = lineInfo.id

    // cria o buttonsContainer
    const buttonsContainer = document.createElement("div")
    buttonsContainer.classList.add("btnsContainer")
    
    // cria deleteButton
    const deleteButton = document.createElement("button")
    deleteButton.classList.add("btn", "delete")
    deleteButton.innerHTML = "X" // TODO: colocar um icone talvez
    deleteButton.addEventListener("click", () => {
        handleDelete(tableLineContainer)
    }) // no clique ele passa o editType e a linha a ser editada
    buttonsContainer.append(deleteButton)

    // cria editButton
    const editButton = document.createElement("button")
    editButton.classList.add("btn", "edit")
    editButton.innerHTML = "E" // TODDO: colocar um icone talvez
    editButton.addEventListener("click", ()=>{
        handleEdit(tableLineContainer)
    }) // no clique ele passa o editType e a linha a ser editada
    buttonsContainer.append(editButton)

    // adiciona o buttonsContainer no tableLineContainer
    tableLineContainer.append(buttonsContainer)

    for(let key in lineInfo){
        const p = document.createElement("p")
        p.innerHTML = `${lineInfo[key]}`
        const index = tablesInfo.tables[currentTable].findIndex(obj => obj.name === key)
        p.dataset.dataType = tablesInfo.tables[currentTable][index].type // adiciona o tipo
        p.dataset.fieldName = tablesInfo.tables[currentTable][index].name // e o nome do campo
        tableLineContainer.append(p) // adiciona no tableLineContainer
    }

    // add the tableLineContainer to the tableContainer e ajusta a quantiadde de colunas no css
    tableLineContainer.style.setProperty("--num-columns", (Object.keys(lineInfo).length))

    return tableLineContainer
}

function showModal(title){
    // aciona o modal
    const modalOverlay = document.querySelector("#modal-overlay")
    modalOverlay.classList.add("show")
    
    // muda o titulo
    const modalTitle = document.querySelector("#modal-content > h2")
    modalTitle.innerHTML = title

    // limpa e adiciona os campos pra editar no form
    const modalForm = document.querySelector("#modal-content > form")
    modalForm.innerHTML = ""
    const tableFields = tablesInfo.tables[currentTable]
    for(const field of tableFields){
        // se nn for um p ou for um id/senha, continua
        if(field.name === "id" || field.name === "password") continue
        const fieldLabel = document.createElement("label") // cria um label com o dataset do valor
        fieldLabel.innerHTML = field.name
        const inputField = document.createElement("input") 
        inputField.name = field.name
        switch(field.type){
            case 'boolean':
                inputField.type = "checkbox"
                break;
            case 'integer':
                inputField.type = "number"
                break;
        }
        
        modalForm.append(fieldLabel)
        modalForm.append(inputField)
    }

    // cria e adiciona o botão de cancelar
    const buttonsContainer = document.createElement("div")
    buttonsContainer.classList.add("buttonsContainer")
    const cancelButton = document.createElement("button")
    cancelButton.classList.add("btn", "cancel")
    cancelButton.innerHTML = "Cancelar"
    cancelButton.addEventListener("click", (e)=>{
        e.preventDefault()
        modalOverlay.classList.remove("show")
    })
    buttonsContainer.append(cancelButton)
    
    const submitButton = document.createElement("button")
    submitButton.classList.add("btn", "submit")
    submitButton.innerHTML = "Confirmar"

    buttonsContainer.append(submitButton)
    modalForm.append(buttonsContainer)
}