document.addEventListener('DOMContentLoaded', () => {
    
    // Función de ayuda para determinar si es PC (desktop)
    const isDesktop = () => window.matchMedia('(min-width: 768px)').matches;

    // Función para obtener la imagen superior que se debe animar
    const getTopImage = () => {
        return isDesktop() 
            ? document.getElementById('baslide-after-desktop')
            : document.getElementById('baslide-after-mobile');
    };

    // --- LÓGICA PARA ANIMACIÓN DE TEXTO (Fade-in) ---
    const steps = document.querySelectorAll('.step');
    const textObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-active');
                } else {
                    entry.target.classList.remove('is-active');
                }
            });
        },
        {
            threshold: 0.1,
            rootMargin: '-30% 0px -30% 0px' 
        }
    );
    steps.forEach(step => {
        textObserver.observe(step);
    });

    // --- LÓGICA PARA EL baSlide AUTOMÁTICO (Fade Vertical) ---
    
    const firstStep = document.querySelector('.step:first-child');
    const lastStep = document.querySelector('.step:last-child');
    
    if (!firstStep || !lastStep) {
        console.warn('Scrollytelling baSlide: No se encontraron los steps necesarios.');
        return;
    }

    let ticking = false;

    function updateSlide() {
        const topImage = getTopImage();
        
        if (!topImage) {
            ticking = false;
            return;
        }
        
        const startY = firstStep.offsetTop; 
        const endY = lastStep.offsetTop;
        const scrollRange = endY - startY;
        
        if (scrollRange <= 0) {
            ticking = false;
            return;
        }

        const currentScroll = window.scrollY - startY;
        let progress = currentScroll / scrollRange;
        progress = Math.max(0, Math.min(1, progress));
        
        if (isNaN(progress)) {
            ticking = false;
            return;
        }
        
        const clipPercentage = progress * 100;

        // 🌟 FADE VERTICAL (De Arriba a Abajo) 🌟
        // Aplica el clip vertical independientemente del dispositivo.
        topImage.style.clipPath = `polygon(0 0, 100% 0, 100% ${clipPercentage}%, 0 ${clipPercentage}%)`;
        
        ticking = false;
    }

    // Escuchamos el evento de scroll y redimensionamiento
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateSlide);
            ticking = true;
        }
    });

    // Al redimensionar, la imagen superior cambia (por eso llamamos a updateSlide)
    window.addEventListener('resize', updateSlide); 
    
    // Ejecutar una vez al cargar
    updateSlide(); 
});
