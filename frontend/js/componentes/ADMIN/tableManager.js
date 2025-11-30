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
                <p>Selecione uma tabela ao lado</p>         
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
        if (!token) return;

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
    if (!tableList) return;

    try{
        const tables = tablesInfo.tables || {}
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
        console.error("Erro ao buscar tabelas:", error);
        tableList.innerHTML += `<p style="color: red;">Erro ao carregar menu.</p>`;
    }
}

export async function renderizarTabela(tableName){
    const tableContainer = document.querySelector("#table")
    if (!tableContainer) return;
    
    try{
        const tableFields = tablesInfo.tables[tableName]
        if (!tableFields) {
            tableContainer.innerHTML = '<p style="color: red;">Tabela não encontrada.</p>';
            return;
        }
        
        currentTable = tableName
        
        // 1. Limpa e mostra Loading
        tableContainer.innerHTML = '<p>Carregando dados...</p>'
        
        const token = localStorage.getItem('authToken');
        if (!token) {
            tableContainer.innerHTML = "<p>Usuário não autenticado.</p>";
            return;
        }

        // 2. Busca dados
        const response = await fetch(`${BACKEND_URL}/api/private/tablemanager/list/${tableName}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            tableContainer.innerHTML = `<p style="color: red;">Erro: ${error.error || error.message || 'Desconhecido'}</p>`;
            return;
        }
        
        const data = await response.json();
        
        // 3. Limpa Loading
        tableContainer.innerHTML = ""; 

        // 4. Cria Header
        const tableHeader = document.createElement("div")
        tableHeader.classList.add("table-line","header")
        // Conta apenas campos visíveis na definição
        tableHeader.style.setProperty("--num-columns", tableFields.length) 
        
        const addButton = document.createElement("button")
        addButton.classList.add("btn", "add")
        addButton.innerHTML = "Adicionar"
        addButton.addEventListener("click", () => handleCreate())
        
        tableHeader.append(addButton)
        
        for(let field of tableFields){
            const p = document.createElement("p")
            p.innerHTML = `${field.name}`
            tableHeader.append(p)
        }
        tableContainer.append(tableHeader)

        // 5. Cria Linhas
        if (!data.data || data.data.length === 0) {
            const emptyMsg = document.createElement('p');
            emptyMsg.textContent = 'Nenhum dado encontrado.';
            tableContainer.append(emptyMsg);
            return;
        }
        
        data.data.forEach( line => {
            // Passa os metadados da tabela para a função saber o que desenhar
            tableContainer.append(createLine(line, tableFields))
        });

    }catch(error){
        console.error(`Erro renderizarTabela(${tableName})`, error)
    }
}

// Função unificada para abrir modal e processar dados
// Função unificada para abrir modal e processar dados
// Função unificada para abrir modal e processar dados
function openFormModal(title, initialValues = null, onConfirmCallback) {
    const modalOverlay = document.querySelector("#modal-overlay")
    const modalContent = document.querySelector("#modal-content")
    const modalTitle = modalContent.querySelector("h2")
    const modalForm = modalContent.querySelector("form")
    
    // 1. Configura UI básica
    modalTitle.innerHTML = title
    modalForm.innerHTML = "" // Limpa campos antigos
    modalOverlay.classList.add("show")

    // 2. Gera os campos baseados na DEFINIÇÃO da tabela
    const tableFields = tablesInfo.tables[currentTable]
    
    for(const field of tableFields){
        // Pula campos automáticos ou sensíveis
        if(field.name === "id" || field.name === "password" || field.name === "createdAt") continue
        
        const container = document.createElement("div")
        const fieldLabel = document.createElement("label")
        fieldLabel.innerHTML = field.name.replace(/_/g, " ")
        
        // --- LOGICA DE CRIAÇÃO DE INPUTS ---
        let inputField;

        // A. Se for o campo FOTO (ou qualquer array de texto), cria um TEXTAREA
        if (field.name === 'foto' || field.name === 'fotos') {
            inputField = document.createElement("textarea");
            inputField.name = field.name;
            inputField.rows = 4; // Altura da caixa
            inputField.placeholder = "Cole um link por linha...";
            
            // Se tiver valores iniciais (Edição)
            if(initialValues && initialValues[field.name]) {
                const val = initialValues[field.name];
                // Se for um array, junta com quebra de linha pra mostrar pro usuário
                if(Array.isArray(val)){
                    inputField.value = val.join("\n");
                } else {
                    inputField.value = val; // Se for string única
                }
            }
        } 
        // B. Inputs normais
        else {
            inputField = document.createElement("input");
            inputField.name = field.name;

            // Lógica de Datas
            if (field.name.toLowerCase() === 'data' || field.name.includes('date')) {
                inputField.type = "datetime-local"; 
                if(initialValues && initialValues[field.name]) {
                    try {
                         const dateVal = new Date(initialValues[field.name]);
                         const isoLocal = new Date(dateVal.getTime() - (dateVal.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
                         inputField.value = isoLocal;
                    } catch(e) { console.log("Erro format data", e) }
                }
            } 
            // Lógica de Números/Checkbox/Texto
            else {
                switch(field.type){
                    case 'boolean':
                        inputField.type = "checkbox"
                        container.style.flexDirection = "row";
                        container.style.gap = "10px";
                        inputField.style.width = "auto";
                        if(initialValues) inputField.checked = initialValues[field.name] === true
                        break;
                    case 'integer': case 'float': case 'decimal':
                        inputField.type = "number"
                        if(initialValues) inputField.value = initialValues[field.name] || ""
                        break;
                    default:
                        inputField.type = "text"
                        if(initialValues) inputField.value = initialValues[field.name] || ""
                        break;
                }
            }
        }
        
        container.append(fieldLabel, inputField)
        modalForm.append(container)
    }

    // 3. Botões de Ação
    const buttonsContainer = document.createElement("div")
    buttonsContainer.style.display = "flex"; 
    buttonsContainer.style.justifyContent = "flex-end";
    buttonsContainer.style.gap = "10px";
    buttonsContainer.style.marginTop = "15px";
    
    const cancelButton = document.createElement("button")
    cancelButton.classList.add("btn", "cancel")
    cancelButton.innerHTML = "Cancelar"
    cancelButton.onclick = (e) => {
        e.preventDefault()
        modalOverlay.classList.remove("show")
    }

    const submitButton = document.createElement("button")
    submitButton.classList.add("btn", "submit")
    submitButton.innerHTML = "Confirmar"
    
    // --- LÓGICA DE ENVIO ---
    submitButton.onclick = async (e) => {
        e.preventDefault()
        
        let dataToStore = {}
        const inputs = modalForm.querySelectorAll("input, textarea") // Pega inputs E textareas
        
        for(const input of inputs){
            // 1. Tratamento para FOTOS (Textarea -> Array)
            if (input.tagName === "TEXTAREA" && (input.name === 'foto' || input.name === 'fotos')) {
                // Pega o texto, quebra nas linhas (\n), remove espaços e linhas vazias
                const links = input.value.split('\n').map(link => link.trim()).filter(link => link !== "");
                
                // Se tiver links, manda o array. Se vazio, manda null
                dataToStore[input.name] = links.length > 0 ? links : null;
            }
            // 2. Checkbox
            else if (input.type === "checkbox") {
                dataToStore[input.name] = input.checked
            } 
            // 3. Números
            else if (input.type === "number") {
                dataToStore[input.name] = input.value === "" ? null : Number(input.value);
            } 
            // 4. Datas
            else if (input.type === "datetime-local") {
                dataToStore[input.name] = input.value ? new Date(input.value).toISOString() : null;
            } 
            // 5. Texto normal
            else {
                dataToStore[input.name] = input.value;
            }
        }

        if (!confirm('Confirma a ação?')) return;

        submitButton.disabled = true;
        submitButton.textContent = 'Processando...';

        try {
            await onConfirmCallback(dataToStore);
            modalOverlay.classList.remove("show")
            await renderizarTabela(currentTable)
        } catch (error) {
            console.error(error);
            alert("Erro: " + (error.message || "Erro desconhecido"))
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Confirmar';
        }
    }

    buttonsContainer.append(cancelButton, submitButton)
    modalForm.append(buttonsContainer)
}

// ---------------- FUNÇÕES DE AÇÃO ----------------

async function handleCreate(){
    openFormModal("Criar Novo Registro", null, async (dataToStore) => {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${BACKEND_URL}/api/private/tablemanager/create/${currentTable}/`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(dataToStore)
        });

        if(!response.ok) {
            const err = await response.json();
            throw new Error(err.message || "Falha ao criar");
        }
        alert("Criado com sucesso!");
    });
}

async function handleEdit(lineId, currentData){
    openFormModal("Editar Registro", currentData, async (dataToStore) => {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${BACKEND_URL}/api/private/tablemanager/update/${currentTable}/${lineId}`, {
            method: 'PUT',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(dataToStore)
        });

        if(!response.ok) {
            const err = await response.json();
            throw new Error(err.message || "Falha ao atualizar");
        }
        alert("Atualizado com sucesso!");
    });
}

async function handleDelete(lineId, elementToRemove){
    if (!confirm('Tem certeza que deseja excluir?')) return;

    const token = localStorage.getItem('authToken');
    try {
        const response = await fetch(`${BACKEND_URL}/api/private/tablemanager/delete/${currentTable}/${lineId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            elementToRemove.remove();
            alert('Excluído com sucesso!');
        } else {
            const result = await response.json();
            alert(`Erro: ${result.message || 'Falha ao excluir'}`);
        }
    } catch (error) {
        console.error(error);
        alert('Erro de conexão.');
    }
}

// ---------------- UTILITÁRIOS ----------------

function createLine(lineInfo, tableFields){
    const tableLineContainer = document.createElement("div")
    tableLineContainer.classList.add("table-line")
    
    // Container de botões
    const buttonsContainer = document.createElement("div")
    buttonsContainer.classList.add("btnsContainer")
    
    const deleteButton = document.createElement("button")
    deleteButton.classList.add("btn", "delete")
    deleteButton.innerHTML = "X"
    deleteButton.onclick = () => handleDelete(lineInfo.id, tableLineContainer)
    buttonsContainer.append(deleteButton)

    const editButton = document.createElement("button")
    editButton.classList.add("btn", "edit")
    editButton.innerHTML = "E"
    // Passamos o ID e o Objeto inteiro da linha para facilitar o preenchimento do form
    editButton.onclick = () => handleEdit(lineInfo.id, lineInfo)
    buttonsContainer.append(editButton)

    tableLineContainer.append(buttonsContainer)

    // Renderiza APENAS os campos que estão na definição da tabela
    for(let fieldDef of tableFields){
        const p = document.createElement("p")
        
        // Pega o valor baseado no nome definido no schema
        let value = lineInfo[fieldDef.name]

        // Tratamento simples para valores
        if (typeof value === 'object' && value !== null) {
            p.innerHTML = "[Obj]" 
        } else if (value === null || value === undefined) {
            p.innerHTML = "-" 
        } else {
            // Se for string de data ISO grande, corta pra ficar bonito na tabela
            if(typeof value === 'string' && value.includes('T') && value.length > 20 && !isNaN(Date.parse(value))){
                value = new Date(value).toLocaleDateString('pt-BR');
            }
            p.innerHTML = value.toString()
        }
        
        p.dataset.fieldName = fieldDef.name
        tableLineContainer.append(p)
    }

    // Ajusta CSS Grid
    tableLineContainer.style.setProperty("--num-columns", tableFields.length)

    return tableLineContainer
}