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
    
    // Efeito de rolagem suave
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
    
    // Atualizar ano do footer
    document.querySelector('.footer-bottom p').innerHTML = 
        `&copy; ${new Date().getFullYear()} Ronins Rugby. Todos os direitos reservados.`;
});
