function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  if (menu) menu.classList.toggle('open');
}

function closeMobileMenu() {
  document.querySelectorAll('.mobile-menu').forEach((m) => m.classList.remove('open'));
}

function initReviewsCarousel(root) {
  const track = root.querySelector('[data-carousel-track]');
  const prev = root.querySelector('[data-carousel-prev]');
  const next = root.querySelector('[data-carousel-next]');
  const dotsHost = root.parentElement.querySelector('[data-carousel-dots]');
  const slides = track ? Array.from(track.children) : [];
  if (!track || slides.length === 0) return;

  const getStep = () => {
    const first = slides[0];
    const second = slides[1];
    if (!second) return first.getBoundingClientRect().width;
    return second.getBoundingClientRect().left - first.getBoundingClientRect().left;
  };

  const getMaxScroll = () => Math.max(0, track.scrollWidth - track.clientWidth);

  /** Puntos = posiciones reales de scroll (p. ej. 6 tarjetas y 3 visibles → 4 páginas), no una por tarjeta. */
  const getPageCount = () => {
    const step = getStep();
    if (step <= 0) return 1;
    const max = getMaxScroll();
    return Math.max(1, Math.min(slides.length, Math.floor(max / step) + 1));
  };

  const getActiveIndex = () => {
    const step = getStep();
    if (step <= 0) return 0;
    const max = getMaxScroll();
    const pageCount = getPageCount();
    let idx = Math.round(track.scrollLeft / step);
    if (max > 0 && track.scrollLeft >= max - 2) idx = pageCount - 1;
    return Math.max(0, Math.min(pageCount - 1, idx));
  };

  let dots = [];

  const buildDots = () => {
    if (!dotsHost) return;
    dotsHost.innerHTML = '';
    dots = [];
    const pageCount = getPageCount();
    for (let i = 0; i < pageCount; i++) {
      const d = document.createElement('button');
      d.type = 'button';
      d.className = 'reviews-dot';
      d.setAttribute('role', 'tab');
      d.setAttribute('aria-label', `Ir a la página ${i + 1} del carrusel`);
      d.addEventListener('click', () => {
        const step = getStep();
        const max = getMaxScroll();
        track.scrollTo({ left: Math.min(i * step, max), behavior: 'smooth' });
      });
      dotsHost.appendChild(d);
      dots.push(d);
    }
  };

  buildDots();

  const updateUI = () => {
    const idx = getActiveIndex();
    dots.forEach((d, i) => {
      d.classList.toggle('is-active', i === idx);
      d.setAttribute('aria-selected', i === idx ? 'true' : 'false');
    });
    if (prev) prev.disabled = track.scrollLeft <= 1;
    if (next) {
      const max = getMaxScroll();
      next.disabled = track.scrollLeft >= max - 1;
    }
  };

  if (prev) prev.addEventListener('click', () => {
    track.scrollBy({ left: -getStep(), behavior: 'smooth' });
  });
  if (next) next.addEventListener('click', () => {
    track.scrollBy({ left: getStep(), behavior: 'smooth' });
  });

  let scrollRaf = 0;
  track.addEventListener('scroll', () => {
    if (scrollRaf) return;
    scrollRaf = requestAnimationFrame(() => {
      scrollRaf = 0;
      updateUI();
    });
  }, { passive: true });

  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); track.scrollBy({ left: getStep(), behavior: 'smooth' }); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); track.scrollBy({ left: -getStep(), behavior: 'smooth' }); }
  });

  window.addEventListener('resize', () => {
    buildDots();
    updateUI();
  }, { passive: true });
  updateUI();
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-carousel]').forEach(initReviewsCarousel);
});
