export function login(){
    return `
    <div class="login-container"> <div class = "form">
            <form>
                <div class = "form-header">
                    <div class="title">
                        <h1>Login Ronins</h1>
                    </div>
                </div>

                <div class = "input-group">
                    <div class = "input-box">
                        <label for="login-email">Usuário</label>
                        <input id="login-email" placeholder = "Digite seu email" type="email">
                        <i class = "bx bxs-user"></i>
                    </div>
                    <div class = "input-box">
                        <label for="login-pass">Senha</label>
                        <input id="login-pass" placeholder="Digite sua senha" type="password">
                        <i class = "bx bxs-lock-alt"></i>
                    </div>
                </div>

                <div class="remember-forgot">
                    <label>
                    <input type="checkbox">
                    Lembrar senha
                    </label>
                    <a href="#">Esqueci minha senha</a>
                </div>

                <div class="continue-button">
                    <button type="submit" class="login">Login</button>
                </div>

                <div class="register-link">
                    <p>
                        Não tem uma conta? <a href="#"> Cadastre-se</a>
                    </p>
                </div>

            </form>
        </div>

        <div class="form-image"></div>

     </div>
     `
}