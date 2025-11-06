export function contato(){
    const content = `
        <section id="contato" class="section">
            <div class="container">
                <h2>Entre em Contato</h2>
                    <p style="text-align: center; max-width: 600px; margin: 0 auto 50px auto;">
                        Tem alguma dúvida, sugestão ou interesse em patrocinar? Use o formulário abaixo ou nossos canais diretos.
                    </p>

                <div class="contact-grid">
                    <div class="contact-details">
                        <h3>Fale Conosco</h3>
                        <div class="contact-item">
                            <i class="fa-solid fa-envelope"></i>
                            <a href="mailto:roninsquadrugby@gmail.com">roninsquadrugby@gmail.com</a>
                        </div>
                        <div class="contact-item">
                            <i class="fa-solid fa-phone"></i>
                            <p>(11) 92903-6219</p>
                        </div>
                
                        <h3 style="margin-top: 40px;">Siga-nos</h3>
                        <div class="social-links">
                            <a href="https://www.instagram.com/roninsrugby?igsh=MW42cWxsdnA5MGY5MQ==" target="_blank" aria-label="Instagram">
                                <i class="fa-brands fa-instagram"></i>
                            </a>
                            <a href="https://www.facebook.com/roninsrugby/?locale=pt_BR" target="_blank" aria-label="Facebook">
                                <i class="fa-brands fa-facebook"></i>
                            </a>
                        </div>
                    </div>

                    <form class="contact-form">
                        <div class="form-group">
                            <label for="name">Nome</label>
                            <input type="text" id="name" name="name" required>
                        </div>
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" id="email" name="email" required>
                        </div>
                        <div class="form-group">
                            <label for="message">Mensagem</label>
                            <textarea id="message" name="message" rows="6" required></textarea>
                        </div>
                        <button type="submit" class="btn">Enviar Mensagem</button>
                    </form>
                </div>
            </div>
        </section>
    `
    return content
}