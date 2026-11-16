(function () {
  const { createElement: h, useEffect, useRef, useState } = React;

  const projects = [
    {
      number: '01',
      name: 'HirMe',
      image: 'assets/projects/hirme.png',
      webp: 'assets/projects/hirme.webp',
      alt: 'HirMe hiring platform interface with job listings and AI match feedback',
      summary: 'AI-powered hiring platform',
      description: 'A full-stack job board built with Laravel. HirMe helps job seekers browse vacancies, find the right fit, and apply with a CV, with AI feedback that highlights gaps in their CV and what to improve. JobBackoffice is the management dashboard, giving admins and company owners the tools to manage the platform. Both apps share the same Eloquent models through the shared package.',
      tags: ['Laravel', 'PHP', 'OpenAI', 'Laravel Cloud', 'MariaDB'],
      github: 'https://github.com/Sama-Ali/hireme'
    },
    {
      number: '02',
      name: 'KeepFit',
      image: 'assets/projects/keepfit.png',
      webp: 'assets/projects/keepfit.webp',
      alt: 'KeepFit exercise discovery interface with workout cards and muscle details',
      summary: 'Exercise from home',
      description: 'A modern fitness web application for discovering more than 1,000 exercises by body part, target muscle, and equipment through a focused responsive interface.',
      tags: ['Next.js', 'React', 'REST API'],
      github: 'https://github.com/Sama-Ali/keepFit',
      live: 'https://keep-fit-feel-better.vercel.app/'
    },
    {
      number: '03',
      name: 'Al7roof',
      image: 'assets/projects/al7roof.png',
      webp: 'assets/projects/al7roof.webp',
      alt: 'Al7roof Arabic educational game with a hexagonal letters board and team scores',
      summary: 'Real-time Arabic game',
      description: 'An interactive Arabic letters game where two teams compete across a connected hexagonal board, answer questions, and see scores update in real time.',
      tags: ['React', 'Supabase', 'Material UI'],
      github: 'https://github.com/Sama-Ali/arabicLettersGame',
      live: 'https://arabiclettersgame.vercel.app'
    },
    {
      number: '04',
      name: "Let's Cook",
      image: 'assets/projects/lets-cook.png',
      webp: 'assets/projects/lets-cook.webp',
      alt: "Let's Cook recipe discovery interface with ingredient selections and matching meals",
      summary: 'Ingredient-based recipe',
      description: 'A “What’s in your fridge?” website that allows users to select ingredients and discover matching recipes.',
      tags: ['React', 'JavaScript', 'MUI', 'Recipe API'],
      github: 'https://github.com/Sama-Ali/let-sCook',
      live: 'https://let-s-cook-recipes.vercel.app/'
    },
    {
      number: '05',
      name: 'Irtaqi',
      image: 'assets/projects/irtaqi.png',
      alt: 'Irtaqi Quran practice platform with Arabic progress tracking interface',
      summary: 'Quran practice platform',
      description: 'A Quran practice platform with a modern Arabic-diacritics interface. It helps learners detect recitation mistakes and track their mastery over time.',
      tags: ['React', 'TypeScript', 'Supabase', 'STT Tashkeel AI', 'Quran Foundation API']
    },
    {
      number: '06',
      name: 'Farfosh',
      image: 'assets/projects/farfosh.png',
      alt: 'Farfosh children community application artwork',
      summary: 'Mobile community application',
      description: 'A children’s community application designed to balance screen time with real-world activities through engaging, age-friendly experiences.',
      tags: ['Flutter', 'Firebase']
    },
    {
      number: '07',
      name: 'TabbyEvents',
      image: 'assets/projects/tabby-events.jpeg',
      alt: 'TabbyEvents shared occasion budget planning concept',
      summary: 'Shared event budgeting',
      description: 'Tabby Events is a proposed feature enhancement for Tabby that helps users discover suitable services, manage budgets, and organize expenses for events and trips. It simplifies decision-making by recommending options that match users’ needs and budgets, making event planning easier and more affordable.',
      tags: ['User Interface Design', 'User Experience', 'React.js'],
      live: 'https://claude.ai/artifact/GNx8y8AnFdF4ZuPas9qyU2#1'
    },
    {
      number: '08',
      name: 'SurveyLand',
      image: 'assets/projects/surveyland.jpeg',
      alt: 'SurveyLand survey creation and insights platform',
      summary: 'Survey management platform',
      description: 'Web platform for creating and publishing surveys, managing questions, collecting responses, exporting results, and generating export files.',
      tags: ['Next.js', 'React', 'TypeScript', 'REST APIs', 'Atomic Design', 'Clean Architecture'],
      live: 'https://surveyland-r8.vercel.app',
      github: 'https://github.com/Sama-Ali/SurveyLand'
    }
  ];
  const displayOrder = [6, 7, 2, 4, 0, 1, 5, 3];

  function Projects() {
    const [selected, setSelected] = useState(null);
    const detailRef = useRef(null);

    useEffect(() => {
      if (selected !== null && detailRef.current) {
        detailRef.current.focus({ preventScroll: true });
        document.body.style.overflow = 'hidden';
        const closeOnEscape = (event) => {
          if (event.key === 'Escape') setSelected(null);
        };
        window.addEventListener('keydown', closeOnEscape);
        return () => {
          document.body.style.overflow = '';
          window.removeEventListener('keydown', closeOnEscape);
        };
      }
      return undefined;
    }, [selected]);

    const activeProject = selected === null ? null : projects[selected];

    const modal = activeProject && h('div', {
      className: 'project-modal-backdrop',
      onMouseDown: (event) => { if (event.target === event.currentTarget) setSelected(null); }
    },
      h('article', {
        className: 'project-modal',
        role: 'dialog',
        'aria-modal': 'true',
        'aria-labelledby': 'project-modal-title',
        ref: detailRef,
        tabIndex: -1
      },
        h('button', { className: 'project-modal-close', type: 'button', onClick: () => setSelected(null), 'aria-label': 'Close project details' }, '×'),
        h('div', { className: `project-modal-image project-card-${projects.indexOf(activeProject) + 1}` },
          h('picture', null,
            activeProject.webp && h('source', { srcSet: activeProject.webp, type: 'image/webp' }),
            h('img', { src: activeProject.image, alt: activeProject.alt, decoding: 'async' })
          )
        ),
        h('div', { className: 'project-modal-content' },
          h('p', { className: 'project-detail-label' }, 'Project details'),
          h('h3', { id: 'project-modal-title' }, activeProject.name),
          h('p', null, activeProject.description),
          h('div', { className: 'project-detail-tags' }, activeProject.tags.map((tag) => h('span', { key: tag }, tag))),
          (activeProject.live || activeProject.github) && h('div', { className: 'project-detail-links' },
            activeProject.live && h('a', { href: activeProject.live, target: '_blank', rel: 'noreferrer' }, h('span', null, 'Live site'), h('i', { 'aria-hidden': 'true' }, '↗')),
            activeProject.github && h('a', { href: activeProject.github, target: '_blank', rel: 'noreferrer' }, h('span', null, 'GitHub'), h('i', { 'aria-hidden': 'true' }, '↗'))
          )
        )
      )
    );

    return h(React.Fragment, null,
      h('div', { className: 'interactive-projects' },
      h('div', { className: 'project-card-grid' },
        displayOrder.map((projectIndex, displayIndex) => {
          const project = projects[projectIndex];
          return (
          h('button', {
            type: 'button',
            className: `project-card project-card-${projectIndex + 1}${selected === projectIndex ? ' is-active' : ''}`,
            key: project.name,
            onClick: () => setSelected(projectIndex),
            'aria-haspopup': 'dialog'
          },
            h('span', { className: 'project-card-image' },
              h('picture', null,
                project.webp && h('source', { srcSet: project.webp, type: 'image/webp' }),
                h('img', { src: project.image, alt: project.alt, loading: displayIndex > 0 ? 'lazy' : 'eager', decoding: 'async', fetchPriority: displayIndex === 0 ? 'high' : 'low' })
              ),
              h('span', { className: 'project-card-shade' })
            ),
            h('span', { className: 'project-card-copy' },
              h('strong', null, project.name),
              h('small', null, project.summary)
            )
          ));
        })
      )),
      modal && ReactDOM.createPortal(modal, document.body)
    );
  }

  const rootElement = document.getElementById('project-cards-root');
  if (rootElement) ReactDOM.createRoot(rootElement).render(h(Projects));
})();
