document.addEventListener('DOMContentLoaded', () => {
  // --- SOLUCIÓN PARA WORDPRESS ---
  // Mueve el wrapper de la imagen fuera del contenedor del post
  // y lo adjunta directamente al <body>.
  // Esto evita conflictos de z-index y overflow con el tema.
  const wrapper = document.querySelector('.baslide-wrapper');
  if (wrapper) {
    document.body.appendChild(wrapper);
  }
  // --- FIN DE LA SOLUCIÓN ---
  
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
  // --- LÓGICA PARA EL baSlide AUTOMÁTICO ---
  const topImage = document.getElementById('baslide-after');
  const firstStep = document.querySelector('.step:first-child');
  const lastStep = document.querySelector('.step:last-child');
  
  // Comprobación por si no se encuentra algún elemento
  if (!topImage || !firstStep || !lastStep) {
    console.warn('Scrollytelling baSlide: No se encontraron todos los elementos necesarios (imagen o steps).');
    return;
  }
  let ticking = false;
  function updateSlide() {
    // 1. Calcular el rango total de scroll para la animación
    const startY = firstStep.offsetTop; 
    const endY = lastStep.offsetTop;
    const scrollRange = endY - startY;
    
    // Evitar división por cero si solo hay un step
    if (scrollRange <= 0) {
      topImage.style.clipPath = `polygon(0 0, 0% 0, 0% 100%, 0 100%)`;
      ticking = false;
      return;
    }
    // 2. Calcular el scroll actual dentro de ese rango
    const currentScroll = window.scrollY - startY;
    
    // 3. Calcular el progreso (de 0.0 a 1.0)
    let progress = currentScroll / scrollRange;
    
    // 4. Limitar el progreso entre 0 y 1
    progress = Math.max(0, Math.min(1, progress));
    // 5. Aplicar el progreso al clip-path
    if (!isNaN(progress)) {
      const clipPercentage = progress * 100;
      topImage.style.clipPath = `polygon(0 0, ${clipPercentage}% 0, ${clipPercentage}% 100%, 0 100%)`;
    }
    
    ticking = false;
  }
  // Escuchamos el evento de scroll
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateSlide);
      ticking = true;
    }
  });
  
  // Ejecutar una vez al cargar por si la página no carga al inicio
  updateSlide(); 
});