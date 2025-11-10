import { BACKEND_URL } from '../url.js'; 

// 1. A função "casca"
export function galeriatrofeus() {
    return `
    <section class="section">
        <h1>Galeria de troféus</h1>
    </section>
    
    <div id="galeria-container" class="galeria-container">
        <p class="loading-trofeus">Carregando troféus...</p>
    </div>
    `;
}

export async function adicionarTrofeus() {
    const container = document.getElementById("galeria-container");
    if (!container) return;

    try {
        const response = await fetch(`${BACKEND_URL}/api/public/trofeus`);
        const data = await response.json();

        if (!response.ok) throw new Error(data.error);

        const { trofeus } = data;

        if (!trofeus || trofeus.length === 0) {
            container.innerHTML = "<p>Nenhum troféu encontrado.</p>";
            return;
        }

        container.innerHTML = ""; 

        trofeus.forEach((campeonato, index) => {
            const section = document.createElement("section");
            section.className = "section trophy-section";
            if (index % 2 === 0) section.classList.add("dark-bg");
            
            const fotosArray = campeonato.foto || []; 
            const fotosHTML = fotosArray.map(url => `
                <div class="image-content">
                    <img src="${url}" alt="Foto do troféu ${campeonato.nome}">
                </div>
            `).join('');

            const elencoArray = campeonato.elenco || [];
            const elencoHTML = elencoArray.map(item => {
                if (item.jogador) {
                    return `<li>${item.jogador.nome} (Jogador)</li>`;
                }
                if (item.staff) {
                    return `<li>${item.staff.nome} (${item.staff.funcao || 'Staff'})</li>`;
                }
                return ''; 
            }).join('');

            section.innerHTML = `
                <div class="container">
                    <h2>${campeonato.nome} - ${campeonato.ano}</h2>
                    
                    <h3>Fotos</h3>
                    <div class="content-grid">
                        ${fotosArray.length > 0 ? fotosHTML : '<p>Sem fotos para este campeonato.</p>'}
                    </div>

                    <h3 class="elenco-title">Elenco</h3>
                    <div class="elenco-grid">
                        ${elencoArray.length > 0 ? `<ul>${elencoHTML}</ul>` : '<p>Elenco não cadastrado.</p>'}
                    </div>
                </div>
            `;
            container.appendChild(section);
        });

    } catch (error) {
        console.error("Erro ao carregar troféus:", error);
        container.innerHTML = "<p style='color: red;'>Falha ao carregar troféus.</p>";
    }
}