document.addEventListener('DOMContentLoaded', function() {
    // Cache de elementos DOM
    const header = document.querySelector('header');
    const hamburguer = document.getElementById('hamburguer');
    const menu = document.querySelector('.menu ul');
    
    if (!header) return;

    // Throttle function para otimizar scroll
    let ticking = false;
    function handleScroll() {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                // Verifica se menu está ativo antes de verificar scroll
                const isMenuActive = menu && menu.classList.contains('active');
                
                if (!isMenuActive) {
                    if (window.scrollY > 50) {
                        header.classList.add('scrolled');
                    } else {
                        header.classList.remove('scrolled');
                    }
                }
                ticking = false;
            });
            ticking = true;
        }
    }

    // Header scroll effect (otimizado com throttle)
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Menu hamburguer funcional
    if (hamburguer && menu) {
        hamburguer.addEventListener('click', () => {
            menu.classList.toggle('active');
            if (menu.classList.contains('active')) {
                header.classList.remove('scrolled');
            } else if (window.scrollY > 50) {
                header.classList.add('scrolled');
            }
        });
        
        // Fecha menu ao clicar em item (apenas em mobile)
        menu.querySelectorAll('li a').forEach(link => {
            link.addEventListener('click', () => {
                if (hamburguer.checkVisibility && hamburguer.checkVisibility()) {
                    menu.classList.remove('active');
                }
            });
        });
    }

    // Atualiza ano no footer
    const yearSpan = document.querySelector('.copyright p');
    if (yearSpan) {
        yearSpan.textContent = `© ${new Date().getFullYear()} Ronins Quad Rugby. Todos os direitos reservados.`;
    }
});