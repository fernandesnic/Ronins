export function login(){
    return `
    <main class="container">
        <form>
            <h1>Login Ronins</h1>
            <div class = "input-box">
                <input placeholder = "Usuário" type="email">
                <i class = "bx bxs-user"></i> <!--simbolozinho de usuario ao lado da caixa 'usuario'-->
            </div>
            <div class = "input-box">
                <input placeholder="Senha" type="password">
                <i class = "bx bxs-lock-alt"></i> <!--simbolozinho de cadeado ao lado da caixa 'senha'-->
            </div>

            <div class="remember-forgot">
                <label>
                <input type="checkbox">
                Lembrar senha
                </label>
                <a href="#">Esqueci minha senha</a> <!--'href="#"' o # serve para nao enviar para nenhum lugar, dps adaptar no projeto-->
            </div>

            <button type="submit" class="login">Login</button>

            <div class="register-link">
                <p>
                    Não tem uma conta? <a href="#"> Cadastre-se</a>
                </p>
            </div>

        </form>
     </main>
    `
}