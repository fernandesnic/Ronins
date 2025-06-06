// Codigo pro menu de acessibilidade aparecer
const acessContainer = document.querySelector('#acessibilidade');
const acessBtn = acessContainer.querySelector('span');
acessBtn.addEventListener("click", ()=>{
    acessContainer.classList.toggle('active');
})




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
const highContrast = document.getElementById('highContrast');
const root = document.querySelector(':root');
let highContrastOn = false;
highContrast.addEventListener("click", () => {
    if (highContrastOn == false) {
        highContrastOn = true;
        root.style.setProperty('--bg-color1', 'black')
        root.style.setProperty('--bg-color2', 'black')
        root.style.setProperty('--text-color', 'white')
        root.style.setProperty('--border-color', 'white')
        root.style.setProperty('--title-color', 'yellow')

    }else{
        highContrastOn = false;
        root.style.setProperty('--bg-color1', 'rgb(27, 27, 27)')
        root.style.setProperty('--bg-color2', 'rgb(19, 19, 19)')
        root.style.setProperty('--text-color', 'rgb(158, 158, 158)')
        root.style.setProperty('--border-color', 'transparent')
        root.style.setProperty('--title-color', 'white')
    }
})
