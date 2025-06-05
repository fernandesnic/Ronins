document.addEventListener('DOMContentLoaded', function () {
    // Header scroll effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Menu hamburguer funcional
    const hamburguer = document.getElementById('hamburguer');
    const menu = document.querySelector('.menu ul');

    if (hamburguer && menu) {
        hamburguer.addEventListener('click', () => {
            menu.classList.toggle('active');
        });
    }

    // Scroll suave
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Atualiza ano no footer
    const yearSpan = document.querySelector('.copyright');
    if (yearSpan) {
        yearSpan.innerHTML = `&copy; ${new Date().getFullYear()} Ronins Rugby. Todos os direitos reservados.`;
    }

    // Acessibilidade - Controle de fonte
    const incrFont = document.getElementById('incrFont');
    const decrFont = document.getElementById('decrFont');
    let fontSize = 1;

    if (incrFont && decrFont) {
        decrFont.addEventListener("click", () => {
            fontSize = Math.max(fontSize - 0.2, 0.8);
            document.documentElement.style.fontSize = `${fontSize}em`;
        });

        incrFont.addEventListener("click", () => {
            fontSize = Math.min(fontSize + 0.2, 1.8);
            document.documentElement.style.fontSize = `${fontSize}em`;
        });
    }
});

