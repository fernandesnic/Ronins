// Menu mobile (para versões futuras)
document.addEventListener('DOMContentLoaded', function() {
    // Ativar menu mobile
    const menuToggle = document.createElement('div');
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    menuToggle.style.display = 'none';
    
    document.querySelector('header').appendChild(menuToggle);
    // Verificar tamanho da tela e alternar menu
    function checkScreenSize() {
        if (window.innerWidth <= 768) {
            menuToggle.style.display = 'block';
            document.querySelector('nav').style.display = 'none';
        } else {
            menuToggle.style.display = 'none';
            document.querySelector('nav').style.display = 'block';
        }
    }
    
    // Event listeners
    menuToggle.addEventListener('click', function() {
        const nav = document.querySelector('nav');
        nav.style.display = nav.style.display === 'none' ? 'block' : 'none';
    });
    
    window.addEventListener('resize', checkScreenSize);
    checkScreenSize();
    
    // Efeito rolagem 
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
    
    // Atualizar ano do footer
    document.querySelector('.copyright').innerHTML = `&copy; ${new Date().getFullYear()} Ronins Rugby. Todos os direitos reservados.`;
});

// Codigo para aumentar e diminuir a fonte
const incrFont = document.getElementById('incrFont');
const decrFont = document.getElementById('decrFont');
// Incializa uma variavel para usar como referencia para o tamanho do texto
let fontSize = 1;

decrFont.addEventListener("click", () => {
    // Quando o botão de diminuir fonte for clicado
    // ele diminui a variavel de referencia, até no minimo 0.8
    fontSize -= 0.2;
    if (fontSize < 0.8) {
        fontSize = 0.8;
    }

    // E então aplica ao html
    document.querySelector("html").style.fontSize = `${fontSize}em`;
});

// O mesmo do anterior com o efeito contrário
incrFont.addEventListener("click", () => {
    fontSize += 0.2;
    if (fontSize > 1.8) {
        fontSize = 1.8;
    }
    document.querySelector("html").style.fontSize = `${fontSize}em`;
});