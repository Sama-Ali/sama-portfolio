(function () {
  const { createElement: h, useEffect, useRef } = React;

  const cloudConfig = [
    { name: 'one', speed: 0.055, direction: 1 },
    { name: 'two', speed: 0.09, direction: -1 },
    { name: 'three', speed: 0.035, direction: 1 },
    { name: 'four', speed: 0.075, direction: -1 },
    { name: 'five', speed: 0.12, direction: 1 }
  ];

  function Cloudscape() {
    const sceneRef = useRef(null);
    const layerRefs = useRef([]);

    useEffect(() => {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reducedMotion) return undefined;

      let frame;
      let targetScroll = window.scrollY;
      let currentScroll = targetScroll;
      let targetX = 0;
      let targetY = 0;
      let currentX = 0;
      let currentY = 0;

      const onScroll = () => {
        targetScroll = window.scrollY;
      };

      const onPointerMove = (event) => {
        targetX = (event.clientX / window.innerWidth - 0.5) * 18;
        targetY = (event.clientY / window.innerHeight - 0.5) * 12;
      };

      const onPointerLeave = () => {
        targetX = 0;
        targetY = 0;
      };

      const animate = () => {
        currentScroll += (targetScroll - currentScroll) * 0.075;
        currentX += (targetX - currentX) * 0.06;
        currentY += (targetY - currentY) * 0.06;

        if (sceneRef.current) {
          sceneRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
        }

        layerRefs.current.forEach((layer, index) => {
          if (!layer) return;
          const config = cloudConfig[index];
          const phase = currentScroll * config.speed * 0.025;
          const vertical = Math.sin(phase + index * 0.7) * 86 * config.direction;
          const horizontal = Math.cos(phase * 0.7 + index) * 18;
          layer.style.transform = `translate3d(${horizontal}px, ${vertical}px, 0)`;
        });

        frame = requestAnimationFrame(animate);
      };

      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('pointermove', onPointerMove, { passive: true });
      document.documentElement.addEventListener('mouseleave', onPointerLeave);
      frame = requestAnimationFrame(animate);

      return () => {
        cancelAnimationFrame(frame);
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('pointermove', onPointerMove);
        document.documentElement.removeEventListener('mouseleave', onPointerLeave);
      };
    }, []);

    return h(
      'div',
      { className: 'cloudscape', ref: sceneRef },
      cloudConfig.map((cloud, index) =>
        h(
          'div',
          {
            className: 'cloud-layer',
            key: cloud.name,
            ref: (element) => { layerRefs.current[index] = element; }
          },
          h('div', { className: `cloud cloud-${cloud.name}` })
        )
      ),
      h('div', { className: 'cloud-haze' })
    );
  }

  const rootElement = document.getElementById('cloud-root');
  if (rootElement) {
    ReactDOM.createRoot(rootElement).render(h(Cloudscape));
  }
})();
