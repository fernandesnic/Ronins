document.addEventListener('DOMContentLoaded', function() {
    // Header scroll effect
    
    const header = document.querySelector('header');
    window.addEventListener('scroll', function () {
        if(menu.classList.contains('active')){
            return
        }
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
            if(menu.classList.contains('active')){
                header.classList.remove('scrolled');
            }else if(window.scrollY > 50){
                header.classList.add('scrolled');
            }
        });
        menu.querySelectorAll('li').forEach(element => {
            element.addEventListener('click', () => {
                menu.classList.toggle('active')
            });
        });
    }

    // Scroll suave
    // document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    //     anchor.addEventListener('click', function (e) {
    //         e.preventDefault();
    //         document.querySelector(this.getAttribute('href')).scrollIntoView({
    //             behavior: 'smooth'
    //         });
    //     });
    // });
    
    // Atualiza ano no footer
    const yearSpan = document.querySelector('.copyright');
    if (yearSpan) {
        yearSpan.innerHTML = `&copy; ${new Date().getFullYear()} Ronins Rugby. Todos os direitos reservados.`;
    }
});