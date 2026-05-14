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

  const getActiveIndex = () => {
    const step = getStep();
    if (step <= 0) return 0;
    return Math.round(track.scrollLeft / step);
  };

  let dots = [];
  if (dotsHost) {
    dotsHost.innerHTML = '';
    dots = slides.map((_, i) => {
      const d = document.createElement('button');
      d.type = 'button';
      d.className = 'reviews-dot';
      d.setAttribute('role', 'tab');
      d.setAttribute('aria-label', `Ir a la reseña ${i + 1}`);
      d.addEventListener('click', () => {
        track.scrollTo({ left: getStep() * i, behavior: 'smooth' });
      });
      dotsHost.appendChild(d);
      return d;
    });
  }

  const updateUI = () => {
    const idx = getActiveIndex();
    dots.forEach((d, i) => {
      d.classList.toggle('is-active', i === idx);
      d.setAttribute('aria-selected', i === idx ? 'true' : 'false');
    });
    if (prev) prev.disabled = track.scrollLeft <= 1;
    if (next) {
      const max = track.scrollWidth - track.clientWidth - 1;
      next.disabled = track.scrollLeft >= max;
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

  window.addEventListener('resize', updateUI, { passive: true });
  updateUI();
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-carousel]').forEach(initReviewsCarousel);
});
