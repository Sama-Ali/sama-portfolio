document.getElementById('year').textContent = new Date().getFullYear();

window.addEventListener('load', () => {
  requestAnimationFrame(() => document.body.classList.add('is-ready'));
  window.setTimeout(() => document.querySelector('.page-intro')?.remove(), 1700);
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.project, .timeline article, .capabilities > div, .skills-group').forEach((element) => observer.observe(element));

const trackedSections = [...document.querySelectorAll('main > section[id]')];
const indicatorLinks = [...document.querySelectorAll('.section-indicator a')];
const timeline = document.querySelector('.timeline');

function updateScrollDetails() {
  const marker = window.innerHeight * 0.46;
  let activeSection = trackedSections[0]?.id;
  trackedSections.forEach((section) => {
    if (section.getBoundingClientRect().top <= marker) activeSection = section.id;
  });
  indicatorLinks.forEach((link) => {
    const active = link.dataset.section === activeSection;
    link.classList.toggle('is-active', active);
    if (active) link.setAttribute('aria-current', 'true');
    else link.removeAttribute('aria-current');
  });

  if (timeline) {
    const rect = timeline.getBoundingClientRect();
    const progress = Math.min(1, Math.max(0, (window.innerHeight * .72 - rect.top) / (rect.height + window.innerHeight * .3)));
    timeline.style.setProperty('--timeline-progress', progress.toFixed(3));
  }
}

let scrollFrame = 0;
window.addEventListener('scroll', () => {
  if (scrollFrame) return;
  scrollFrame = requestAnimationFrame(() => {
    updateScrollDetails();
    scrollFrame = 0;
  });
}, { passive: true });
window.addEventListener('resize', updateScrollDetails, { passive: true });
updateScrollDetails();

// Load the decorative Three.js scene only after the useful page is interactive.
const canRunThree = window.innerWidth >= 900
  && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  && (navigator.deviceMemory === undefined || navigator.deviceMemory >= 4);

if (canRunThree) {
  const loadThreeScene = () => {
    const threeScript = document.createElement('script');
    threeScript.src = 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.min.js';
    threeScript.onload = () => {
      const effectsScript = document.createElement('script');
      effectsScript.src = 'three-effects.js';
      document.body.appendChild(effectsScript);
    };
    document.body.appendChild(threeScript);
  };
  window.addEventListener('load', () => {
    if ('requestIdleCallback' in window) requestIdleCallback(loadThreeScene, { timeout: 3500 });
    else window.setTimeout(loadThreeScene, 2200);
  }, { once: true });
}
