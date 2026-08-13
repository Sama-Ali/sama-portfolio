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

document.querySelectorAll('.project, .timeline article, .capabilities > div').forEach((element) => observer.observe(element));
