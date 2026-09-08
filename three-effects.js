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

  // A focused, lightweight Three.js layer for the skills cards.
  const skillsRoot = document.getElementById('skills-three');
  if (!skillsRoot) return;

  let skillsRenderer;
  try {
    skillsRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'low-power' });
  } catch (error) {
    skillsRoot.hidden = true;
    return;
  }

  skillsRenderer.setClearColor(0x000000, 0);
  skillsRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
  skillsRoot.appendChild(skillsRenderer.domElement);

  const skillsScene = new THREE.Scene();
  const skillsCamera = new THREE.PerspectiveCamera(48, 1, 0.1, 100);
  skillsCamera.position.z = 7;

  const skillPalette = [new THREE.Color(0x31d7f5), new THREE.Color(0x9d8cff), new THREE.Color(0x168bff)];
  const skillPointCount = 100;
  const skillPositions = new Float32Array(skillPointCount * 3);
  const skillColors = new Float32Array(skillPointCount * 3);
  for (let i = 0; i < skillPointCount; i += 1) {
    const color = skillPalette[i % skillPalette.length];
    skillPositions[i * 3] = (Math.random() - 0.5) * 10;
    skillPositions[i * 3 + 1] = (Math.random() - 0.5) * 6;
    skillPositions[i * 3 + 2] = (Math.random() - 0.5) * 3;
    skillColors[i * 3] = color.r;
    skillColors[i * 3 + 1] = color.g;
    skillColors[i * 3 + 2] = color.b;
  }
  const skillPointsGeometry = new THREE.BufferGeometry();
  skillPointsGeometry.setAttribute('position', new THREE.BufferAttribute(skillPositions, 3));
  skillPointsGeometry.setAttribute('color', new THREE.BufferAttribute(skillColors, 3));
  const skillPoints = new THREE.Points(skillPointsGeometry, new THREE.PointsMaterial({
    size: 0.035,
    transparent: true,
    opacity: 0.58,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }));
  skillsScene.add(skillPoints);

  const skillForms = new THREE.Group();
  const formMaterial = new THREE.MeshBasicMaterial({ color: 0x31d7f5, wireframe: true, transparent: true, opacity: 0.18 });
  const formMaterialTwo = new THREE.MeshBasicMaterial({ color: 0x9d8cff, wireframe: true, transparent: true, opacity: 0.14 });
  const formOne = new THREE.Mesh(new THREE.IcosahedronGeometry(1.05, 1), formMaterial);
  const formTwo = new THREE.Mesh(new THREE.OctahedronGeometry(0.8, 1), formMaterialTwo);
  const formThree = new THREE.Mesh(new THREE.TorusKnotGeometry(0.52, 0.012, 64, 8), formMaterial);
  formOne.position.set(-3.8, 1.1, -1.6);
  formTwo.position.set(3.6, -1.15, -1.2);
  formThree.position.set(0.5, 2.3, -2.1);
  skillForms.add(formOne, formTwo, formThree);
  skillsScene.add(skillForms);

  let skillsVisible = false;
  let skillsPointerX = 0;
  let skillsPointerY = 0;
  const skillCards = [...document.querySelectorAll('.skills-group')].map((card, index) => ({
    card,
    index,
    tilt: new THREE.Vector2(),
    targetTilt: new THREE.Vector2(),
  }));
  const skillBubbles = [...document.querySelectorAll('.skill-set b')].map((bubble, index) => ({
    bubble,
    index,
    offset: new THREE.Vector3(),
    targetOffset: new THREE.Vector3(),
  }));
  function resizeSkillsScene() {
    const { width, height } = skillsRoot.getBoundingClientRect();
    if (!width || !height) return;
    skillsRenderer.setSize(width, height, false);
    skillsCamera.aspect = width / height;
    skillsCamera.updateProjectionMatrix();
  }
  function moveSkillsScene(event) {
    const rect = skillsRoot.getBoundingClientRect();
    skillsPointerX = ((event.clientX - rect.left) / rect.width - 0.5) * 0.32;
    skillsPointerY = ((event.clientY - rect.top) / rect.height - 0.5) * 0.22;
    skillCards.forEach((item) => item.targetTilt.set(0, 0));
    skillBubbles.forEach((item) => item.targetOffset.set(0, 0, 0));
    const card = event.target.closest?.('.skills-group');
    if (!card) return;
    const cardRect = card.getBoundingClientRect();
    const cardX = (event.clientX - cardRect.left) / cardRect.width - 0.5;
    const cardY = (event.clientY - cardRect.top) / cardRect.height - 0.5;
    const cardMotion = skillCards.find((item) => item.card === card);
    cardMotion?.targetTilt.set(-cardY * 4.5, cardX * 5.5);
    skillBubbles.forEach((item) => {
      if (item.bubble.closest('.skills-group') !== card) return;
      const bubbleRect = item.bubble.getBoundingClientRect();
      const bubbleX = bubbleRect.left + bubbleRect.width / 2;
      const bubbleY = bubbleRect.top + bubbleRect.height / 2;
      const distanceX = (bubbleX - event.clientX) / cardRect.width;
      const distanceY = (bubbleY - event.clientY) / cardRect.height;
      item.targetOffset.set(
        THREE.MathUtils.clamp(distanceX * 13, -7, 7),
        THREE.MathUtils.clamp(distanceY * 13, -7, 7),
        Math.max(0, 1 - Math.hypot(distanceX, distanceY) * 1.8)
      );
    });
  }
  const skillsObserver = new IntersectionObserver((entries) => {
    skillsVisible = entries[0].isIntersecting;
    if (skillsVisible) resizeSkillsScene();
  }, { threshold: 0.08 });
  skillsObserver.observe(skillsRoot);
  window.addEventListener('resize', resizeSkillsScene, { passive: true });
  window.addEventListener('pointermove', moveSkillsScene, { passive: true });
  resizeSkillsScene();

  const skillsClock = new THREE.Clock();
  function renderSkillsScene() {
    if (skillsVisible && !document.hidden) {
      const time = skillsClock.getElapsedTime();
      skillPoints.rotation.y = time * 0.035 + skillsPointerX;
      skillPoints.rotation.x += (skillsPointerY - skillPoints.rotation.x) * 0.018;
      skillForms.rotation.y = time * 0.095 + skillsPointerX * 0.8;
      skillForms.rotation.x += (skillsPointerY * 0.55 - skillForms.rotation.x) * 0.018;
      formOne.rotation.x = time * 0.18;
      formTwo.rotation.y = -time * 0.24;
      formThree.rotation.z = time * 0.14;
      skillCards.forEach((item) => {
        item.tilt.x = THREE.MathUtils.lerp(item.tilt.x, item.targetTilt.x, 0.08);
        item.tilt.y = THREE.MathUtils.lerp(item.tilt.y, item.targetTilt.y, 0.08);
        const floatY = Math.sin(time * 1.05 + item.index * 1.7) * 1.4;
        item.card.style.setProperty('--skills-card-y', `${floatY.toFixed(2)}px`);
        item.card.style.setProperty('--skills-tilt-x', `${item.tilt.x.toFixed(2)}deg`);
        item.card.style.setProperty('--skills-tilt-y', `${item.tilt.y.toFixed(2)}deg`);
      });
      skillBubbles.forEach((item) => {
        item.offset.lerp(item.targetOffset, 0.11);
        const floatX = Math.cos(time * 1.05 + item.index * 0.64) * 1.1 + item.offset.x;
        const floatY = Math.sin(time * 1.35 + item.index * 0.86) * 2.8 + item.offset.y;
        item.bubble.style.setProperty('--skills-bubble-x', `${floatX.toFixed(2)}px`);
        item.bubble.style.setProperty('--skills-bubble-y', `${floatY.toFixed(2)}px`);
        item.bubble.style.setProperty('--skills-bubble-rotate', `${(item.offset.x * 0.55).toFixed(2)}deg`);
        item.bubble.style.setProperty('--skills-bubble-scale', (1 + item.offset.z * 0.055).toFixed(3));
      });
      skillsRenderer.render(skillsScene, skillsCamera);
    }
    requestAnimationFrame(renderSkillsScene);
  }
  renderSkillsScene();

})();
