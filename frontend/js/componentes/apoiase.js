import { BACKEND_URL } from '../url.js';
import { isUserLoggedIn, getCurrentUser } from '../auth.js';

export function apoiase(){
    return `
    <section class="section dark-bg" id="apoie-intro">
            <div class="container">
                <h2>Jogue Conosco!</h2>
                <div class="cause-content">
                    <p>O Ronins Rugby é mantido pela paixão dos nossos atletas e pelo apoio fundamental da comunidade. Cada contribuição nos ajuda a cobrir custos essenciais como materiais esportivos, inscrições em campeonatos, transporte e primeiros socorros.</p>
                    <p>Escolha a modalidade de apoio que faz mais sentido para você e faça parte da nossa história!</p>
                </div>
            </div>
        </section>

        <section class="section" id="apoie-opcoes">
            <div class="container">
                <h2>Nossas Modalidades de Apoio</h2>
                <p style="text-align: center; max-width: 700px; margin: 0 auto 50px auto;">
                    Toda ajuda é bem-vinda, seja ela mensal ou pontual.
                </p>

                <div class="apoie-container">

                    <div class="apoie-option-card">
                        <h3>Seja um Apoiador Ronin</h3>
                        <div class="price"><span class="per-month">A partir de</span> R$ 15<span class="per-month">/mês</span></div>
                        <p>Nosso plano único de sócio-torcedor. Ajude de forma recorrente e ganhe benefícios!</p>
                        
                        <ul class="benefits-list">
                            <li><strong>10% de desconto</strong> em todos os produtos da loja.</li>
                            <li>Seu nome em <strong>destaque</strong> no Mural de Apoiadores.</li>
                            <li>Acesso a sorteios e eventos exclusivos do time.</li>
                        </ul>
                        
                        <button id="btn-tornar-apoiador" class="btn dark" style="width: 100%;">Quero Assinar</button>
                    </div>

                    <div class="apoie-option-card">
                        <h3>Doação Única</h3>
                        <div class="price">Qualquer Valor</div>
                        <p>Prefere uma contribuição pontual? Use nosso PIX e ajude com o valor que desejar.</p>

                        <div class="pix-details">
                            <img src="https://i.imgur.com/A9REO8c.png" alt="QR Code PIX para doação">
                            <h4>Chave PIX (E-mail)</h4>
                            <p class="pix-key">financeiro@roninsrugby.com.br</p>
                            
                            <button class="btn" id="btn-copiar-pix">
                                <span class="material-symbols-outlined">content_copy</span>
                                Copiar Chave
                            </button>
                        </div>
                    </div>

                </div> </div>
        </section>


        <section class="section dark-bg" id="mural-socios">
            <div class="container">
                <h2>Mural de Apoiadores</h2>
                <p style="text-align: center; max-width: 700px; margin: 0 auto 40px auto;">
                    Um agradecimento especial a todos que estão construindo essa história com a gente. Vocês são parte do time!
                </p>
                
                <div class="socios-wall" id="socios-wall">
                    <p style="text-align: center; color: var(--text-color);">Carregando apoiadores...</p>
                </div>
            </div>
        </section>
    `
}

// Função para buscar apoiadores do backend
export async function adicionarApoiadores() {
    const sociosWall = document.getElementById('socios-wall');
    if (!sociosWall) {
        console.error('Container #socios-wall não encontrado.');
        return;
    }

    try {
        const response = await fetch(`${BACKEND_URL}/api/public/apoiadores`);
        
        if (!response.ok) {
            throw new Error('Erro ao carregar apoiadores');
        }

        const data = await response.json();
        const apoiadores = data.apoiadores || [];

        // Limpa o container
        sociosWall.innerHTML = '';

        if (apoiadores.length === 0) {
            sociosWall.innerHTML = '<p style="text-align: center; color: var(--text-color);">Ainda não temos apoiadores cadastrados. Seja o primeiro!</p>';
            return;
        }

        // Ordena por meses (mais meses = destaque)
        const apoiadoresOrdenados = apoiadores
            .filter(ap => ap.is_active !== false) // Filtra apenas ativos
            .sort((a, b) => (b.meses || 0) - (a.meses || 0));

        // Renderiza os apoiadores
        apoiadoresOrdenados.forEach(apoiador => {
            const span = document.createElement('span');
            span.className = 'socio-nome';
            
            // Destaque para quem tem 6+ meses
            if (apoiador.meses >= 6) {
                span.classList.add('destaque');
            }
            
            // Formata o nome (mostra apenas primeiro nome e inicial do sobrenome)
            const nomeFormatado = formatarNome(apoiador.apoiador);
            span.textContent = nomeFormatado;
            span.title = `${apoiador.apoiador} - ${apoiador.meses} ${apoiador.meses === 1 ? 'mês' : 'meses'} de apoio`;
            
            sociosWall.appendChild(span);
        });

        // Adiciona mensagem final se houver muitos
        if (apoiadoresOrdenados.length > 0) {
            const mais = document.createElement('span');
            mais.className = 'socio-nome';
            mais.textContent = '... e muitos outros!';
            sociosWall.appendChild(mais);
        }

    } catch (error) {
        console.error('Erro ao carregar apoiadores:', error);
        sociosWall.innerHTML = `
            <p style="text-align: center; color: var(--text-color);">
                Erro ao carregar apoiadores. Tente recarregar a página.
            </p>
        `;
    }
}

// Função auxiliar para formatar nome (primeiro nome + inicial do sobrenome)
function formatarNome(nomeCompleto) {
    if (!nomeCompleto) return '';
    
    const partes = nomeCompleto.trim().split(' ');
    if (partes.length === 1) return partes[0];
    
    const primeiroNome = partes[0];
    const ultimoNome = partes[partes.length - 1];
    const inicial = ultimoNome.charAt(0).toUpperCase();
    
    return `${primeiroNome} ${inicial}.`;
}

// Função para verificar se usuário já é apoiador
export async function verificarSeJaEApoiador(nomeUsuario) {
    if (!nomeUsuario) return false;
    
    try {
        const response = await fetch(`${BACKEND_URL}/api/public/apoiadores`);
        if (!response.ok) return false;
        
        const data = await response.json();
        const apoiadores = data.apoiadores || [];
        
        return apoiadores.some(ap => 
            ap.apoiador === nomeUsuario && ap.is_active !== false
        );
    } catch (error) {
        console.error('Erro ao verificar apoiador:', error);
        return false;
    }
}

// Função para tornar usuário um apoiador
export async function tornarApoiador() {
    // Verifica se está logado
    if (!isUserLoggedIn()) {
        alert('Por favor, faça login para se tornar um apoiador.');
        window.location.hash = '#login';
        return;
    }

    const user = getCurrentUser();
    if (!user) {
        alert('Erro ao obter dados do usuário. Faça login novamente.');
        window.location.hash = '#login';
        return;
    }

    // Verifica se já é apoiador
    const jaEApoiador = await verificarSeJaEApoiador(user.nome);
    if (jaEApoiador) {
        alert('Você já é um apoiador! Obrigado pelo seu apoio contínuo! ❤️');
        return;
    }

    // Confirmação
    if (!confirm(`Deseja se tornar um apoiador do Ronins Rugby?\n\nVocê receberá:\n- 10% de desconto em todos os produtos\n- Seu nome no Mural de Apoiadores\n- Acesso a eventos exclusivos`)) {
        return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('Sessão expirada. Por favor, faça login novamente.');
        window.location.hash = '#login';
        return;
    }

    const btnTornarApoiador = document.getElementById('btn-tornar-apoiador');
    const originalText = btnTornarApoiador?.textContent;
    
    if (btnTornarApoiador) {
        btnTornarApoiador.disabled = true;
        btnTornarApoiador.textContent = 'Processando...';
    }

    try {
        // Cria o apoiador no backend
        const response = await fetch(`${BACKEND_URL}/api/private/apoiadores/create/apoiador`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                apoiador: user.nome,
                meses: 1,
                is_active: true
            })
        });

        const data = await response.json();

        if (response.ok) {
            // Atualiza o usuário para ser sócio
            const updateUserResponse = await fetch(`${BACKEND_URL}/api/private/user/update/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    is_socio: true
                })
            });
            
            const userUpdateData = await updateUserResponse.json();

            if (updateUserResponse.ok && userUpdateData.item) {
                // Atualiza localStorage com dados atualizados do servidor
                const updatedUser = userUpdateData.item;
                localStorage.setItem('userData', JSON.stringify(updatedUser));
            } else if (updateUserResponse.ok) {
                // Fallback: atualiza apenas o campo is_socio
                const updatedUser = { ...user, is_socio: true };
                localStorage.setItem('userData', JSON.stringify(updatedUser));
            }

            alert('Parabéns! Você agora é um Apoiador Ronin! 🎉\n\nSeu nome aparecerá no Mural de Apoiadores e você já pode aproveitar os benefícios!');
            
            // Recarrega a lista de apoiadores
            await adicionarApoiadores();
        } else {
            // Verifica se já é apoiador (caso tenha sido criado entre a verificação e agora)
            if (data.error && (data.error.includes('já existe') || data.error.includes('already') || data.error.includes('unique'))) {
                alert('Você já é um apoiador! Obrigado pelo seu apoio contínuo! ❤️');
            } else {
                throw new Error(data.error || data.message || 'Erro ao se tornar apoiador');
            }
        }
    } catch (error) {
        console.error('Erro ao tornar apoiador:', error);
        alert(`Erro: ${error.message || 'Não foi possível processar sua solicitação. Tente novamente mais tarde.'}`);
    } finally {
        if (btnTornarApoiador) {
            btnTornarApoiador.disabled = false;
            btnTornarApoiador.textContent = originalText || 'Quero Assinar';
        }
    }
}

// Setup dos event listeners
export async function setupApoiaseListeners() {
    // Botão tornar apoiador
    const btnTornarApoiador = document.getElementById('btn-tornar-apoiador');
    if (btnTornarApoiador) {
        // Verifica se usuário já é apoiador e atualiza o botão
        if (isUserLoggedIn()) {
            const user = getCurrentUser();
            if (user) {
                const jaEApoiador = await verificarSeJaEApoiador(user.nome);
                if (jaEApoiador || user.is_socio) {
                    btnTornarApoiador.textContent = 'Você já é um Apoiador! ❤️';
                    btnTornarApoiador.disabled = true;
                    btnTornarApoiador.style.opacity = '0.7';
                    btnTornarApoiador.style.cursor = 'not-allowed';
                } else {
                    btnTornarApoiador.addEventListener('click', tornarApoiador);
                }
            } else {
                btnTornarApoiador.addEventListener('click', tornarApoiador);
            }
        } else {
            btnTornarApoiador.addEventListener('click', () => {
                alert('Por favor, faça login para se tornar um apoiador.');
                window.location.hash = '#login';
            });
        }
    }

    // Botão copiar PIX
    const btnCopiarPix = document.getElementById('btn-copiar-pix');
    if (btnCopiarPix) {
        btnCopiarPix.addEventListener('click', async () => {
            const pixKey = 'financeiro@roninsrugby.com.br';
            try {
                await navigator.clipboard.writeText(pixKey);
                btnCopiarPix.innerHTML = '<span class="material-symbols-outlined">check</span> Copiado!';
                setTimeout(() => {
                    btnCopiarPix.innerHTML = '<span class="material-symbols-outlined">content_copy</span> Copiar Chave';
                }, 2000);
            } catch (error) {
                // Fallback para navegadores mais antigos
                const textArea = document.createElement('textarea');
                textArea.value = pixKey;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                btnCopiarPix.innerHTML = '<span class="material-symbols-outlined">check</span> Copiado!';
                setTimeout(() => {
                    btnCopiarPix.innerHTML = '<span class="material-symbols-outlined">content_copy</span> Copiar Chave';
                }, 2000);
            }
        });
    }
}