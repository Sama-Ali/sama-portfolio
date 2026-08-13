(function () {
  const root = document.getElementById('three-scene');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!root || !window.THREE || reducedMotion) return;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'low-power' });
  } catch (error) {
    root.remove();
    return;
  }

  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  root.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100);
  camera.position.z = 8;

  const count = window.innerWidth < 800 ? 220 : 620;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const palette = [new THREE.Color(0x168bff), new THREE.Color(0x31d7f5), new THREE.Color(0x9d8cff)];

  for (let i = 0; i < count; i += 1) {
    const radius = 2.5 + Math.random() * 6.5;
    const angle = Math.random() * Math.PI * 2;
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 5;
    const color = palette[i % palette.length];
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const material = new THREE.PointsMaterial({ size: 0.035, transparent: true, opacity: 0.42, vertexColors: true, blending: THREE.AdditiveBlending, depthWrite: false });
  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(2.6, 0.008, 8, 180),
    new THREE.MeshBasicMaterial({ color: 0x31d7f5, transparent: true, opacity: 0.12 })
  );
  ring.rotation.x = 1.15;
  scene.add(ring);

  let scrollTarget = window.scrollY;
  let scrollCurrent = scrollTarget;
  let pointerX = 0;
  let pointerY = 0;

  function resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  function onPointer(event) {
    pointerX = (event.clientX / window.innerWidth - 0.5) * 0.35;
    pointerY = (event.clientY / window.innerHeight - 0.5) * 0.25;
  }

  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('scroll', () => { scrollTarget = window.scrollY; }, { passive: true });
  window.addEventListener('pointermove', onPointer, { passive: true });
  resize();

  const clock = new THREE.Clock();
  let animationFrame = 0;
  function render() {
    const time = clock.getElapsedTime();
    scrollCurrent += (scrollTarget - scrollCurrent) * 0.055;
    const progress = scrollCurrent / Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    particles.rotation.y = time * 0.018 + progress * Math.PI * 1.35 + pointerX;
    particles.rotation.x += ((pointerY + progress * 0.18) - particles.rotation.x) * 0.025;
    particles.position.y = Math.sin(time * 0.22) * 0.18 - progress * 1.1;
    ring.rotation.z = time * 0.035 + progress * 2.2;
    ring.position.y = 1.1 - progress * 2.1;
    material.opacity = 0.28 + Math.sin(progress * Math.PI) * 0.2;
    renderer.render(scene, camera);
    animationFrame = requestAnimationFrame(render);
  }
  animationFrame = requestAnimationFrame(render);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(animationFrame);
    else animationFrame = requestAnimationFrame(render);
  });

  const revealTargets = document.querySelectorAll('.section-heading, .project-card, .experience-grid > h2, .timeline article, .contact-main > h2, .contact-links a, .work .eyebrow, .experience > .eyebrow, .contact > .eyebrow');
  revealTargets.forEach((element, index) => {
    element.classList.add('three-reveal');
    element.style.setProperty('--reveal-delay', `${Math.min(index % 4, 3) * 70}ms`);
  });
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('three-reveal-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });
  revealTargets.forEach((element) => revealObserver.observe(element));

  document.querySelectorAll('.contact-links a').forEach((link, index) => {
    link.classList.add('contact-link-reveal');
    link.style.setProperty('--contact-delay', `${180 + index * 170}ms`);
  });
  const contactObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('contact-link-visible');
        contactObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3, rootMargin: '0px 0px -4% 0px' });
  document.querySelectorAll('.contact-link-reveal').forEach((link) => contactObserver.observe(link));

})();
