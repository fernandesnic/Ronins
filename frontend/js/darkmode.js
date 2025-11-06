const botaoTema = document.getElementById("theme-switch")
// ↑ essa linha identifica o botão de trocar o tema

function trocaTema(){ //assim como diz o nome, essa é a função que vai trocar o tema
    var element = document.body; //aqui a gente identifica o corpo da pag
    element.classList.toggle("dark-mode") //e aqui a gente liga/desliga a classe do modo escuro no corpo da pagina
}

botaoTema.addEventListener("click", () => { 
trocaTema()
//e aqui, por fim, a função é chamada quando se clica no botão
})