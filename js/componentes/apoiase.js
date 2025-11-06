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
                        <h3>Seja um Sócio Ronin</h3>
                        <div class="price">R$ 20<span class="per-month">/mês</span></div>
                        <p>Nosso plano único de sócio-torcedor. Ajude de forma recorrente e ganhe benefícios!</p>
                        
                        <ul class="benefits-list">
                            <li><strong>10% de desconto</strong> em todos os produtos da loja.</li>
                            <li>Seu nome em <strong>destaque</strong> no Mural de Apoiadores.</li>
                            <li>Acesso a sorteios e eventos exclusivos do time.</li>
                        </ul>
                        
                        <a href="#" class="btn dark" style="width: 100%;">Quero Assinar</a>
                    </div>

                    <div class="apoie-option-card">
                        <h3>Doação Única</h3>
                        <div class="price">Qualquer Valor</div>
                        <p>Prefere uma contribuição pontual? Use nosso PIX e ajude com o valor que desejar.</p>

                        <div class="pix-details">
                            <img src="https://i.imgur.com/A9REO8c.png" alt="QR Code PIX para doação">
                            <h4>Chave PIX (E-mail)</h4>
                            <p class="pix-key">financeiro@roninsrugby.com.br</p>
                            
                            <button class="btn" onclick="navigator.clipboard.writeText('financeiro@roninsrugby.com.br')">
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
                
                <div class="socios-wall">
                    <span class="socio-nome destaque">Maria S.</span>
                    <span class="socio-nome">Carlos A.</span>
                    <span class="socio-nome">João P.</span>
                    <span class="socio-nome">Ana L.</span>
                    <span class="socio-nome">Ricardo F.</span>
                    <span class="socio-nome destaque">Fernanda M.</span>
                    <span class="socio-nome">Lucas G.</span>
                    <span class="socio-nome">Beatriz R.</span>
                    <span class="socio-nome">Thiago N.</span>
                    <span class="socio-nome destaque">Juliana K.</span>
                    <span class="socio-nome">Marcos V.</span>
                    <span class="socio-nome">Patrícia Z.</span>
                    <span class="socio-nome">... e muitos outros!</span>
                </div>
            </div>
        </section>
    `
}