export function cadastro(){
    return `
    <div class="cadastro-container"> <!-- ATUALIZADO: A classe agora é "cadastro-container" -->
        <div class="form-image">
            <img src="assets/img/undraw_windows_kqsk.svg">
        </div>
        <div class = "form">
            <form action = "#">
                <div class = "form-header">
                    <div class="title">
                        <h1>Cadastre-se</h1>
                    </div>
                    <div class = "login-button">
                        <button><a href="#" id="link-to-login">Entrar</a></button>
                    </div>
                </div>

                <div class="input-group">
                    <div class="input-box">
                        <label for="firstname">Nome</label>
                        <input id="firstname" type="text" name="firstname" placeholder ="Digite seu primeiro nome" required>
                    </div>

                    <div class="input-box">
                        <label for="lastname">Sobrenome</label>
                        <input id="lastname" type="text" name="lastname" placeholder ="Digite seu sobrenome" required>
                    </div>

                    <div class="input-box">
                        <label for="email">Email</label>
                        <input id="cadastro-email" type="email" name="email" placeholder ="Digite seu email" required>
                    </div>

                    <div class="input-box">
                        <label for="password">Senha</label>
                        <input id="cadastro-password" type="password" name="password" placeholder ="Digite sua senha" required>
                    </div>

                   
                </div>

                
                
                <div class="continue-button">
                    <button type="submit"><a href="#">Continuar</a></button>
                </div>


            </form>

        </div>

    </div>
    `
}