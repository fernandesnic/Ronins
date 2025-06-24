const body = document.querySelector("body")

// Codigo pro menu de acessibilidade aparecer
const acessContainer = document.querySelector('#acessibilidade');
const acessBtn = acessContainer.querySelector('#mainBtn');
acessBtn.addEventListener("click", ()=>{
    acessContainer.classList.toggle('active');
    console.log("oi");
})

console.log("thau");


// Codigo para aumentar e diminuir a fonte
const incrFont = document.getElementById('incrFont');
const decrFont = document.getElementById('decrFont');
// Incializa uma variavel para usar como referencia para o tamanho do texto
let fontSize = 1;

decrFont.addEventListener("click", () => {
    // Quando o botão de diminuir fonte for clicado
    // ele diminui a variavel de referencia, até no minimo 0.8
    fontSize = Math.max(fontSize - 0.1, 0.8);

    // E então aplica ao html
    document.querySelector("html").style.fontSize = `${fontSize}em`;
});

// O mesmo do anterior com o efeito contrário
incrFont.addEventListener("click", () => {
    fontSize = Math.min(fontSize + 0.1, 1.8);
    document.querySelector("html").style.fontSize = `${fontSize}em`;
});

//Codigo de alto contraste
const highContrast = document.getElementById('highContrast'); //Botão de alto contraste
let highContrastOn = false;

highContrast.addEventListener("click", () => {
    if (highContrastOn == false) {
        highContrastOn = true;
        body.classList.toggle('high-contrast')
        console.log("Alto contraste ativado"); 
    } else {
        highContrastOn = false;
        body.classList.toggle('high-contrast')
        console.log("De volta às cores padrão");
        
        }
    }
)
