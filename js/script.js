document.addEventListener('DOMContentLoaded', () => {
  const galleryImageFiles = [
    '740225063_122296787072020674_3727875182229818575_n.jpg',
    '761627930_122300038148020674_4766908021799672896_n.jpg',
    '761653495_122300020850020674_6414312975127481272_n.jpg',
    '762868559_122300038094020674_195292277954959082_n.jpg',
    '763103832_122300022152020674_3000536531009946342_n.jpg',
    '763708451_122300392628020674_5565899714864485187_n.jpg',
    '763847548_122300020946020674_8845207580251809983_n.jpg',
    '772495493_122301316526020674_471872914144394477_n.jpg',
    '772677150_122300990750020674_2281786011912593610_n.jpg',
    '777418265_122301750854020674_1858002744080450906_n.jpg',
    '791145069_122303623748020674_2558545395809288227_n.jpg',
    '800066284_122304708206020674_1336662242090812676_n.jpg',
    '812315061_122305787030020674_8892154217967521224_n.jpg',
    '832870721_122308357268020674_8871752450721486195_n.jpg',
    '833753894_122308358504020674_6312515338497763566_n.jpg'
  ];

  const getGalleryData = () => galleryImageFiles.map((fileName, index) => ({
    title: `Club Gallery ${index + 1}`,
    category: 'Club Gallery',
    image: `assets/images/gallery/${fileName}`,
    caption: 'Official club photo from a recent filmmaking and community activity.'
  }));

  const getEventData = () => [
    {
      title: 'BUWAN NG WIKA AT MATHSCI 2026',
      type: 'Featured video',
      status: 'upcoming',
      featured: true,
      date: '',
      time: 'Time to be confirmed',
      location: 'Assumption College of Davao',
      description: 'Official club video update for the school celebration of language, creativity, and academic pride.',
      notes: 'This latest event information is shared across the home and events pages so updates stay aligned.',
      poster: 'assets/images/cover/famas-cover.jpg',
      calendarUrl: '',
      source: 'shared'
    }
  ];

  const prefersReducedMotion = () => {
    if (!window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  };

  // Generate the dynamic footer year for each page that includes the element.
  const initializeFooterYear = () => {
    const yearNodes = document.querySelectorAll('#currentYear');
    yearNodes.forEach((node) => {
      node.textContent = new Date().getFullYear();
    });
  };

  // Mobile navigation toggle with accessibility state management.
  const initializeNavigation = () => {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-links');

    if (!navToggle || !navMenu) {
      return;
    }

    const updateToggleState = (isOpen) => {
      navMenu.classList.toggle('is-open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    };

    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.contains('is-open');
      updateToggleState(!isOpen);
    });

    navMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => updateToggleState(false));
    });

    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach((link) => {
      const href = link.getAttribute('href');
      const isCurrent = href && href.split('/').pop() === currentPath;

      link.classList.toggle('active', isCurrent);
      if (isCurrent) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  // Smooth scrolling for in-page links when the target exists.
  const initializeSmoothAnchors = () => {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    if (!anchorLinks.length) return;

    anchorLinks.forEach((link) => {
      link.addEventListener('click', (event) => {
        const href = link.getAttribute('href');
        if (!href || href === '#') return;

        const target = document.querySelector(href);
        if (!target) return;

        event.preventDefault();
        const offset = window.innerWidth < 768 ? 72 : 88;
        const targetY = target.getBoundingClientRect().top + window.scrollY - offset;

        window.scrollTo({
          top: targetY,
          behavior: prefersReducedMotion() ? 'auto' : 'smooth'
        });
      });
    });
  };

  // Reveal animations use IntersectionObserver when available; they degrade gracefully for reduced motion.
  const initializeRevealAnimations = () => {
    const revealItems = document.querySelectorAll('[data-reveal]');
    if (!revealItems.length) return;

    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
      revealItems.forEach((item) => item.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('visible');
          currentObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.16 }
    );

    revealItems.forEach((item) => observer.observe(item));
  };

  // Image fallback helper that prevents broken placeholders from breaking the layout.
  const addImageFallback = (imageNode, fallbackSrc = 'assets/images/gallery/gallery-placeholder-01.svg') => {
    if (!imageNode) return;

    imageNode.addEventListener('error', () => {
      if (!imageNode.dataset.fallbackUsed) {
        imageNode.dataset.fallbackUsed = 'true';
        imageNode.src = fallbackSrc;
      }
    });
  };

  // Shared form validation with clear accessible feedback and no fake submission claims.
  const getFieldLabel = (field) => {
    const label = field.closest('.field-group')?.querySelector('label')?.textContent || field.name || 'This field';
    return label.trim();
  };

  const validateFieldValue = (field, fieldType = 'text') => {
    const value = String(field.value || '').trim();
    if (!value) return false;

    if (fieldType === 'email') {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    return true;
  };

  const setFieldError = (field, message = '') => {
    const errorNode = field.closest('.field-group')?.querySelector('.field-error');
    if (errorNode) {
      errorNode.textContent = message;
    }
    field.setAttribute('aria-invalid', String(Boolean(message)));
  };

  const initializeValidatedForm = (form, options) => {
    if (!form) return;

    const { fields, successMessage, placeholderMessage, allowSuccessState = false } = options;
    const statusNode = form.querySelector('.form-status');

    const validateSingleField = (field, type = 'text') => {
      const isValid = validateFieldValue(field, type);
      if (!isValid) {
        setFieldError(field, `${getFieldLabel(field)} is required or contains an invalid value.`);
        return false;
      }
      setFieldError(field, '');
      return true;
    };

    fields.forEach(({ name, type }) => {
      const field = form.querySelector(`[name="${name}"]`);
      if (!field) return;

      field.addEventListener('blur', () => validateSingleField(field, type));
      field.addEventListener('input', () => {
        if (field.dataset.touched === 'true') {
          validateSingleField(field, type);
        }
      });
      field.dataset.touched = 'false';
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      let isValid = true;

      fields.forEach(({ name, type }) => {
        const field = form.querySelector(`[name="${name}"]`);
        if (!field) return;
        field.dataset.touched = 'true';
        if (!validateSingleField(field, type)) {
          isValid = false;
        }
      });

      if (!isValid) {
        if (statusNode) {
          statusNode.textContent = 'Please complete the required fields and provide a valid email address.';
          statusNode.classList.remove('is-success');
          statusNode.classList.add('is-error');
        }
        return;
      }

      if (statusNode) {
        if (allowSuccessState && successMessage) {
          statusNode.textContent = successMessage;
          statusNode.classList.remove('is-error');
          statusNode.classList.add('is-success');
        } else {
          statusNode.textContent = placeholderMessage || 'This form is a frontend placeholder and no message has been sent yet.';
          statusNode.classList.remove('is-success');
          statusNode.classList.add('is-error');
        }
      }

      form.reset();
      fields.forEach(({ name }) => {
        const field = form.querySelector(`[name="${name}"]`);
        if (!field) return;
        setFieldError(field, '');
        field.dataset.touched = 'false';
      });
    });
  };

  const initializeHomeHighlights = () => {
    const featuredNode = document.getElementById('homeFeaturedFilm');
    const teamGridNode = document.getElementById('homeTeamGrid');
    const listNode = document.getElementById('activitiesList');

    if (!featuredNode && !teamGridNode && !listNode) return;

    const latestEvent = getEventData()[0];

    if (featuredNode) {
      featuredNode.innerHTML = `
        <div class="film-poster" aria-label="Featured film thumbnail">
          <img src="${latestEvent.poster}" alt="Poster for ${latestEvent.title}" loading="lazy" />
          <a class="play-button" href="films.html" aria-label="Open the latest featured film project">
            <span>▶</span>
          </a>
        </div>

        <div class="film-info">
          <p class="status-label">Latest work in progress</p>
          <h3>${latestEvent.title}</h3>
          <p>${latestEvent.description}</p>
          <div class="section-action">
            <a class="btn btn-primary" href="films.html">Watch Project</a>
            <a class="text-link" href="films.html">View films</a>
          </div>
        </div>
      `;
      featuredNode.querySelectorAll('img').forEach((img) => addImageFallback(img, 'assets/images/gallery/gallery-placeholder-01.svg'));
    }

    if (teamGridNode) {
      teamGridNode.innerHTML = `
        <div class="empty-state">
          New member features will appear here when videos are posted.
        </div>
      `;
    }

    if (listNode) {
      listNode.innerHTML = `
        <article class="activity-item card">
          <span class="activity-date">2026</span>
          <h3>${latestEvent.title}</h3>
          <p>${latestEvent.description}</p>
        </article>
      `;
    }
  };

  // Home page event activity list (optional component).
  const initializeHomeActivities = () => {
    const listNode = document.getElementById('activitiesList');
    if (!listNode) return;
    initializeHomeHighlights();
  };

  // Member directory filter/search logic (only when the directory exists on the page).
  const initializeMemberDirectory = () => {
    const moderatorList = document.getElementById('moderatorList');
    const officersList = document.getElementById('officersList');
    const membersList = document.getElementById('membersList');
    const searchInput = document.getElementById('memberSearch');
    const positionFilter = document.getElementById('positionFilter');
    const noResultsNode = document.getElementById('memberNoResults');

    if (!moderatorList || !officersList || !membersList || !searchInput || !positionFilter) return;

    const moderatorData = [
      {
        name: 'Pague, Marc Jullan M.',
        position: 'Moderator',
        image: 'assets/images/members/moderator.png',
        bio: 'Moderator of the Filmmakers\' Society of Assumption College of Davao.',
        group: 'moderator'
      }
    ];

    const memberData = [
      {
        name: 'Demoral, Crisdalin',
        position: 'President • Production Head',
        image: 'assets/images/members/DEMORAL - PRODUCTION HEAD (PRESIDENT).jpg',
        bio: 'Executive leader overseeing production direction and club coordination.',
        group: 'officer'
      },
      {
        name: 'Reyes, Jasmine Jill',
        position: 'Vice President • Producer',
        image: 'assets/images/members/REYES - PRODUCER (VICE PRESIDENT) .jpg',
        bio: 'Executive officer supporting production planning and club leadership.',
        group: 'officer'
      },
      {
        name: 'Esio, Cassandra Rose',
        position: 'Secretary • Set Producer',
        image: 'assets/images/members/member-placeholder-04.svg',
        bio: 'Handles club documentation and set production support.',
        group: 'officer'
      },
      {
        name: 'Autenticeo, Gleyz Sabina C.',
        position: 'Production Officer • Head Scriptwriter',
        image: 'assets/images/members/member-placeholder-05.svg',
        bio: 'Leads script development and production coordination for club projects.',
        group: 'officer'
      },
      {
        name: 'Delcampo, Christopher',
        position: 'Treasurer • Director',
        image: 'assets/images/members/DEL CAMPO - DIRECTOR OF PHOTOGRAPHY (TREASURER).png',
        bio: 'Balances club operations while directing creative projects.',
        group: 'officer'
      },
      {
        name: 'Cabaluna, John Christian',
        position: 'Assistant Treasurer • Director',
        image: 'assets/images/members/member-placeholder-01.svg',
        bio: 'Supports financial management and directs creative work.',
        group: 'officer'
      },
      {
        name: 'Diaz, Marco Angelo R.',
        position: 'Head Camera Operator • Head Cinematographer',
        image: 'assets/images/members/member-placeholder-02.svg',
        bio: 'Leads the club\'s camera and cinematography operations.',
        group: 'officer'
      },
      {
        name: 'Ahamad, Celina J.',
        position: 'Camera Operator',
        image: 'assets/images/members/member-placeholder-03.svg',
        bio: 'Contributes to on-set camera production and visual coverage.',
        group: 'member'
      },
      {
        name: 'Licong, Armia Julie',
        position: 'Cinematographer',
        image: 'assets/images/members/member-placeholder-04.svg',
        bio: 'Helps shape the visual language of club projects with strong cinematography skills.',
        group: 'member'
      },
      {
        name: 'Marohom, Airah',
        position: 'Gimbal Operator',
        image: 'assets/images/members/member-placeholder-05.svg',
        bio: 'Supports smooth motion and dynamic coverage across productions.',
        group: 'member'
      },
      {
        name: 'Pasague, Jian Marco L.',
        position: 'SDE Editor',
        image: 'assets/images/members/member-placeholder-06.svg',
        bio: 'Handles post-production editing and sequence refinement for club projects.',
        group: 'member'
      },
      {
        name: 'Sarate, Julia Cassandra N.',
        position: 'Project Documentor',
        image: 'assets/images/members/member-placeholder-01.svg',
        bio: 'Documents key production developments and creative milestones.',
        group: 'member'
      },
      {
        name: 'Galan, Audrey Nicole Talledo',
        position: 'SDE Editor',
        image: 'assets/images/members/member-placeholder-02.svg',
        bio: 'Contributes to technical editing and post-production polish.',
        group: 'member'
      },
      {
        name: 'De Guzman, Miracle',
        position: 'Director',
        image: 'assets/images/members/member-placeholder-03.svg',
        bio: 'Works on directing and visual storytelling for club productions.',
        group: 'member'
      },
      {
        name: 'Gabica, Rachelle Santine D.',
        position: 'Cinematographer',
        image: 'assets/images/members/GABICA-CINEMATOGRAPHER.png',
        bio: 'Contributes to cinematic framing, composition, and visual storytelling.',
        group: 'member'
      },
      {
        name: 'Rosal, Nicole A.',
        position: 'Member',
        image: 'assets/images/members/member-placeholder-05.svg',
        bio: 'Active member contributing to the club\'s creative and production work.',
        group: 'member'
      },
      {
        name: 'Tan, Mayumi',
        position: 'Cinematographer',
        image: 'assets/images/members/member-placeholder-06.svg',
        bio: 'Supports the club\'s visual storytelling through camera and lighting work.',
        group: 'member'
      },
      {
        name: 'Montebon, Christopher Yuan',
        position: 'Director',
        image: 'assets/images/members/member-placeholder-01.svg',
        bio: 'Contributes to directing and creative decision-making for team projects.',
        group: 'member'
      },
      {
        name: 'Janiola, Hannah Sofia N.',
        position: 'Editor',
        image: 'assets/images/members/member-placeholder-02.svg',
        bio: 'Helps craft the final story through editing and post-production workflow.',
        group: 'member'
      },
      {
        name: 'Barcelita, Lady Shammah M.',
        position: 'Project Documentor',
        image: 'assets/images/members/member-placeholder-03.svg',
        bio: 'Keeps production records and documentation organized for club activities.',
        group: 'member'
      },
      {
        name: 'Canonigo, Ayesha Vernice V.',
        position: 'Running Producer',
        image: 'assets/images/members/member-placeholder-04.svg',
        bio: 'Supports production continuity and on-ground execution during projects.',
        group: 'member'
      },
      {
        name: 'Untal, Jourlyn Mae C.',
        position: 'Producer',
        image: 'assets/images/members/UNTAL - PRODUCER .jpg',
        bio: 'Helps coordinate project planning and production needs.',
        group: 'member'
      },
      {
        name: 'Jovenal, Ashley N.',
        position: 'Scriptwriter',
        image: 'assets/images/members/member-placeholder-06.svg',
        bio: 'Writes and develops story ideas for club productions.',
        group: 'member'
      },
      {
        name: 'Enario, Breiana Sofia R.',
        position: 'Camera Operator',
        image: 'assets/images/members/ENARIO - CINEMATOGRAPHER .jpeg',
        bio: 'Assists in camera work and visual recording for production needs.',
        group: 'member'
      },
      {
        name: 'Sandoval, Johanna',
        position: 'Gimbal Operator',
        image: 'assets/images/members/member-placeholder-02.svg',
        bio: 'Supports smooth movement and stable camera coverage in production scenes.',
        group: 'member'
      },
      {
        name: 'Aguilo, Grace',
        position: 'Cinematographer',
        image: 'assets/images/members/member-placeholder-03.svg',
        bio: 'Contributes to the aesthetic direction and visual composition of projects.',
        group: 'member'
      },
      {
        name: 'Sabang, Rogin Justine Grace B.',
        position: 'Editor',
        image: 'assets/images/members/member-placeholder-04.svg',
        bio: 'Supports editorial work and post-production storytelling for club films.',
        group: 'member'
      }
    ];

    const renderMemberCard = (member) => `
      <article class="member-card card">
        <img src="${member.image}" alt="Portrait of ${member.name}" loading="lazy" />
        <div class="member-card-body">
          <p class="member-role">${member.position}</p>
          <h3>${member.name}</h3>
          <p>${member.bio}</p>
        </div>
      </article>
    `;

    const renderMembers = () => {
      const searchTerm = searchInput.value.trim().toLowerCase();
      const selectedPosition = positionFilter.value;
      const allRecords = [...moderatorData, ...memberData];

      const filteredRecords = allRecords.filter((member) => {
        const matchesSearch = !searchTerm || member.name.toLowerCase().includes(searchTerm);
        const matchesPosition = selectedPosition === 'all' || member.position === selectedPosition;
        return matchesSearch && matchesPosition;
      });

      const moderatorMatches = filteredRecords.filter((member) => member.group === 'moderator');
      const officerMembers = filteredRecords.filter((member) => member.group === 'officer');
      const rosterMembers = filteredRecords.filter((member) => member.group === 'member');

      const visibleModerator = moderatorMatches;
      const visibleOfficers = officerMembers;
      const visibleRoster = rosterMembers;

      moderatorList.innerHTML = visibleModerator.map(renderMemberCard).join('');
      officersList.innerHTML = visibleOfficers.map(renderMemberCard).join('');
      membersList.innerHTML = visibleRoster.map(renderMemberCard).join('');

      if (noResultsNode) {
        noResultsNode.hidden = filteredRecords.length > 0;
      }

      moderatorList.querySelectorAll('img').forEach((img) => addImageFallback(img, 'assets/images/members/member-placeholder-01.svg'));
      officersList.querySelectorAll('img').forEach((img) => addImageFallback(img, 'assets/images/members/member-placeholder-02.svg'));
      membersList.querySelectorAll('img').forEach((img) => addImageFallback(img, 'assets/images/members/member-placeholder-03.svg'));
    };

    const populateFilters = () => {
      const uniquePositions = [...new Set([...moderatorData, ...memberData].map((member) => member.position))].sort();
      const currentValue = positionFilter.value || 'all';
      positionFilter.innerHTML = '<option value="all">All positions</option>' + uniquePositions
        .map((position) => `<option value="${position}">${position}</option>`)
        .join('');
      const matchingOption = [...positionFilter.options].find((option) => option.value === currentValue);
      if (matchingOption) {
        positionFilter.value = currentValue;
      }
    };

    searchInput.addEventListener('input', renderMembers);
    positionFilter.addEventListener('change', renderMembers);

    populateFilters();
    renderMembers();
  };

  // Film portfolio filters and modal details (only when the component exists).
  const initializeFilmPortfolio = () => {
    const featuredFilmNode = document.getElementById('featuredFilm');
    const filmGrid = document.getElementById('filmGrid');
    const filmFilter = document.getElementById('filmFilter');
    const noResultsNode = document.getElementById('filmNoResults');
    const filmModal = document.getElementById('filmModal');
    const closeFilmModalButton = document.getElementById('closeFilmModal');
    const filmModalContent = document.getElementById('filmModalContent');

    if (!featuredFilmNode || !filmGrid || !filmFilter) return;

    const filmData = [
      {
        title: 'BUWAN NG WIKA AT MATHSCI 2026',
        genre: 'Latest Work in Progress',
        year: '2026',
        poster: 'assets/images/cover/famas-cover.jpg',
        synopsis: 'Wika bilang sandigan, agham bilang pundasyon ng pagbabago at kaunlaran — a student-led celebration of language, science, creativity, and cultural pride.',
        description: 'A video showcase of the Buwan ng Wika and Math-Science celebration, reflecting student creativity, culture, and academic pride.',
        credits: [
          'Production Head: Crisdalin Demoral',
          'Producer: Jourlyn Untal',
          'Camera Director: Christopher Delcampo',
          'Head Cam Operator: Marco Angelo Diaz',
          'Gimbal Operator: Airah Marohom',
          'Camera Operator: Breiana Sofia Enario',
          'Camera Support: Celina Ahamad',
          'Editor: Audrey Nicole Galat'
        ],
        featured: true,
        videoUrl: 'assets/videos/buwan_ng_wika.mp4'
      }
    ];

    const uniqueGenres = [...new Set(filmData.map((film) => film.genre))].sort();
    filmFilter.innerHTML = '<option value="all">All categories</option>' + uniqueGenres
      .map((genre) => `<option value="${genre}">${genre}</option>`)
      .join('');

    const getFilteredFilms = () => {
      const selectedGenre = filmFilter.value;
      return selectedGenre === 'all' ? filmData : filmData.filter((film) => film.genre === selectedGenre);
    };

    const renderFeaturedFilm = () => {
      const featured = filmData.find((film) => film.featured) || filmData[0];
      if (!featured) return;

      const videoButton = featured.videoUrl
        ? `<button class="btn btn-primary film-open-modal" type="button" data-film-title="${featured.title}">Watch video</button>`
        : '<button class="btn btn-secondary" type="button" disabled>Video unavailable</button>';

      featuredFilmNode.innerHTML = `
        <div class="featured-film-poster">
          <img src="${featured.poster}" alt="Poster for ${featured.title}" loading="lazy" />
        </div>
        <div class="featured-film-content">
          <span class="film-label">Latest work in progress</span>
          <h2>${featured.title}</h2>
          <div class="featured-meta">
            <span>${featured.genre}</span>
            <span>${featured.year}</span>
          </div>
          <p>${featured.synopsis}</p>
          <div class="section-action">
            ${videoButton}
            <button class="btn btn-secondary film-open-modal" type="button" data-film-title="${featured.title}">View details</button>
          </div>
        </div>
      `;

      featuredFilmNode.querySelectorAll('img').forEach((img) => addImageFallback(img, 'assets/images/gallery/gallery-placeholder-01.svg'));
    };

    const renderFilmGrid = () => {
      const filteredFilms = getFilteredFilms();
      filmGrid.innerHTML = filteredFilms
        .map(
          (film) => `
            <article class="film-card">
              <div class="film-card-poster">
                <img src="${film.poster}" alt="Poster for ${film.title}" loading="lazy" />
              </div>
              <div class="film-card-body">
                <span class="film-tag">${film.genre}</span>
                <h3>${film.title}</h3>
                <div class="film-info-row">
                  <span>${film.year}</span>
                  <span>${film.genre}</span>
                </div>
                <p>${film.description}</p>
                <div class="film-card-actions">
                  <button class="btn btn-secondary film-open-modal" type="button" data-film-title="${film.title}">Details</button>
                  ${film.videoUrl ? `<a class="btn btn-primary" href="${film.videoUrl}" target="_blank" rel="noreferrer">Trailer</a>` : '<button class="btn btn-primary" type="button" disabled>Trailer unavailable</button>'}
                </div>
              </div>
            </article>
          `
        )
        .join('');

      filmGrid.querySelectorAll('img').forEach((img) => addImageFallback(img, 'assets/images/gallery/gallery-placeholder-01.svg'));
      if (noResultsNode) noResultsNode.hidden = filteredFilms.length > 0;
    };

    const openFilmModal = (filmTitle) => {
      if (!filmModal || !filmModalContent) return;
      const film = filmData.find((entry) => entry.title === filmTitle);
      if (!film) return;

      const isLocalVideo = film.videoUrl && (film.videoUrl.toLowerCase().endsWith('.mp4') || film.videoUrl.toLowerCase().includes('/video'));
      const videoMarkup = film.videoUrl
        ? isLocalVideo
          ? `<video class="film-modal-video" controls playsinline preload="metadata" poster="${film.poster}" src="${film.videoUrl}" title="${film.title}"></video>`
          : `<iframe class="film-modal-video" src="${film.videoUrl}" title="${film.title} trailer" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>`
        : '<div class="film-modal-video" style="display:grid;place-items:center;color:var(--muted);border:1px solid rgba(255,255,255,0.08);background:rgba(0,0,0,0.45);">Video not yet available for this project.</div>';

      const creditsMarkup = film.credits?.length
        ? film.credits.map((credit) => `<li>${credit}</li>`).join('')
        : '<li>Production credits are pending official confirmation.</li>';

      filmModalContent.innerHTML = `
        <div class="film-modal-body">
          <div>${videoMarkup}</div>
          <div class="film-modal-copy">
            <span class="film-label">${film.genre}</span>
            <h3 id="filmModalTitle">${film.title}</h3>
            <div class="film-modal-meta">
              <span>${film.year}</span>
              <span>${film.genre}</span>
            </div>
            <p>${film.synopsis}</p>
            <ul>${creditsMarkup}</ul>
          </div>
        </div>
      `;

      filmModal.hidden = false;
      filmModal.setAttribute('aria-hidden', 'false');
    };

    const closeModal = () => {
      if (!filmModal) return;
      filmModal.hidden = true;
      filmModal.setAttribute('aria-hidden', 'true');
    };

    filmFilter.addEventListener('change', renderFilmGrid);

    document.addEventListener('click', (event) => {
      const trigger = event.target.closest('.film-open-modal');
      if (!trigger) return;
      openFilmModal(trigger.dataset.filmTitle);
    });

    closeFilmModalButton?.addEventListener('click', closeModal);

    filmModal?.addEventListener('click', (event) => {
      if (event.target === filmModal) closeModal();
    });

    document.addEventListener('keydown', (event) => {
      if (filmModal && !filmModal.hidden && event.key === 'Escape') {
        closeModal();
      }
    });

    renderFeaturedFilm();
    renderFilmGrid();
  };

  // Gallery lightbox with keyboard navigation and filter support.
  const initializeGalleryLightbox = () => {
    const galleryFilter = document.getElementById('galleryFilter');
    const galleryGrid = document.getElementById('galleryGrid');
    const noResultsNode = document.getElementById('galleryNoResults');
    const modalNode = document.getElementById('galleryModal');
    const closeModalButton = document.getElementById('closeGalleryModal');
    const prevButton = document.getElementById('galleryPrev');
    const nextButton = document.getElementById('galleryNext');
    const imageNode = document.getElementById('galleryModalImage');
    const categoryNode = document.getElementById('galleryModalCategory');
    const titleNode = document.getElementById('galleryModalTitle');
    const captionNode = document.getElementById('galleryModalCaption');

    if (!galleryFilter || !galleryGrid) return;

    const galleryData = getGalleryData();

    const uniqueCategories = [...new Set(galleryData.map((item) => item.category))].sort();
    galleryFilter.innerHTML = '<option value="all">All categories</option>' + uniqueCategories
      .map((category) => `<option value="${category}">${category}</option>`)
      .join('');

    let filteredItems = [...galleryData];
    let currentIndex = 0;

    const getFilteredItems = () => {
      const selectedCategory = galleryFilter.value;
      return selectedCategory === 'all' ? [...galleryData] : galleryData.filter((item) => item.category === selectedCategory);
    };

    const renderGallery = () => {
      filteredItems = getFilteredItems();
      if (!filteredItems.length) {
        galleryGrid.innerHTML = '';
        if (noResultsNode) noResultsNode.hidden = false;
        return;
      }

      if (noResultsNode) noResultsNode.hidden = true;
      galleryGrid.innerHTML = filteredItems
        .map((item, index) => `
          <button type="button" class="gallery-tile ${index % 5 === 0 ? 'large' : index % 3 === 0 ? 'tall' : ''}" data-gallery-index="${index}" aria-label="Open ${item.title}">
            <img src="${item.image}" alt="${item.title}" loading="lazy" />
            <span class="gallery-tile-label">${item.category}</span>
          </button>
        `)
        .join('');

      galleryGrid.querySelectorAll('img').forEach((img) => addImageFallback(img, 'assets/images/gallery/gallery-placeholder-01.svg'));
    };

    const openModal = (index) => {
      if (!modalNode || !imageNode || !categoryNode || !titleNode || !captionNode) return;
      if (!filteredItems[index]) return;
      const item = filteredItems[index];
      currentIndex = index;
      imageNode.src = item.image;
      imageNode.alt = item.title;
      categoryNode.textContent = item.category;
      titleNode.textContent = item.title;
      captionNode.textContent = item.caption;
      modalNode.hidden = false;
      modalNode.setAttribute('aria-hidden', 'false');
      addImageFallback(imageNode, 'assets/images/gallery/gallery-placeholder-01.svg');
    };

    const closeModal = () => {
      if (!modalNode) return;
      modalNode.hidden = true;
      modalNode.setAttribute('aria-hidden', 'true');
    };

    const showNextItem = () => {
      if (!filteredItems.length) return;
      const nextIndex = (currentIndex + 1) % filteredItems.length;
      openModal(nextIndex);
    };

    const showPreviousItem = () => {
      if (!filteredItems.length) return;
      const previousIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
      openModal(previousIndex);
    };

    galleryFilter.addEventListener('change', () => {
      currentIndex = 0;
      renderGallery();
    });

    galleryGrid.addEventListener('click', (event) => {
      const tile = event.target.closest('.gallery-tile');
      if (!tile) return;
      openModal(Number(tile.dataset.galleryIndex));
    });

    closeModalButton?.addEventListener('click', closeModal);
    prevButton?.addEventListener('click', showPreviousItem);
    nextButton?.addEventListener('click', showNextItem);

    modalNode?.addEventListener('click', (event) => {
      if (event.target === modalNode) closeModal();
    });

    document.addEventListener('keydown', (event) => {
      if (!modalNode || modalNode.hidden) return;
      if (event.key === 'Escape') closeModal();
      if (event.key === 'ArrowRight') showNextItem();
      if (event.key === 'ArrowLeft') showPreviousItem();
    });

    renderGallery();
  };

  const initializeAboutGallery = () => {
    const aboutGalleryGrid = document.getElementById('aboutGalleryGrid');
    if (!aboutGalleryGrid) return;

    const galleryData = getGalleryData().slice(0, 5);
    aboutGalleryGrid.innerHTML = galleryData
      .map((item, index) => `
        <figure class="gallery-item ${index === 0 ? 'tall' : index === 2 ? 'wide' : ''}">
          <img src="${item.image}" alt="${item.title}" loading="lazy" />
        </figure>
      `)
      .join('');

    aboutGalleryGrid.querySelectorAll('img').forEach((img) => addImageFallback(img, 'assets/images/gallery/gallery-placeholder-01.svg'));
  };

  // Event list filters and optional cards (only when the event layout exists).
  const initializeEventList = () => {
    const filterNode = document.getElementById('eventFilter');
    const gridNode = document.getElementById('eventsGrid');
    const featuredNode = document.getElementById('featuredEvent');
    const emptyStateNode = document.getElementById('eventsEmptyState');
    const pastEventsNode = document.getElementById('pastEventsList');

    if (!filterNode || !gridNode) return;

    const eventData = getEventData();

    const formatDate = (value) => {
      if (!value) return 'Date to be confirmed';
      const parsedDate = new Date(value);
      if (Number.isNaN(parsedDate.getTime())) return 'Date to be confirmed';
      return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(parsedDate);
    };

    const upcomingEvents = eventData.filter((event) => event.status === 'upcoming');
    const pastEvents = eventData.filter((event) => event.status === 'past');

    const renderFeaturedEvent = () => {
      if (!featuredNode) return;
      if (!eventData.length) {
        featuredNode.innerHTML = '<div class="empty-state">No posted video events yet. New event updates will appear here.</div>';
        return;
      }

      const featureItem = eventData.find((event) => event.featured && event.status === 'upcoming') || upcomingEvents[0] || eventData[0];
      const calendarLink = featureItem.calendarUrl
        ? `<a class="btn btn-secondary" href="${featureItem.calendarUrl}" target="_blank" rel="noreferrer">Add to calendar</a>`
        : '<span class="event-link-placeholder">Calendar link available once the official event date and details are confirmed.</span>';

      featuredNode.innerHTML = `
        <article class="featured-event-card">
          <div class="featured-event-poster">
            <img src="${featureItem.poster}" alt="Poster for ${featureItem.title}" loading="lazy" />
          </div>
          <div class="featured-event-body">
            <p class="film-label">Featured announcement</p>
            <h3>${featureItem.title}</h3>
            <div class="event-meta-list">
              <span>${featureItem.type}</span>
              <span>${formatDate(featureItem.date)}</span>
              <span>${featureItem.time || 'Time to be confirmed'}</span>
            </div>
            <p>${featureItem.description}</p>
            <ul class="event-detail-list">
              <li><strong>Location:</strong> ${featureItem.location || 'Location to be confirmed'}</li>
              <li><strong>Notes:</strong> ${featureItem.notes}</li>
            </ul>
            ${calendarLink}
          </div>
        </article>
      `;

      featuredNode.querySelectorAll('img').forEach((img) => addImageFallback(img, 'assets/images/gallery/gallery-placeholder-01.svg'));
    };

    const renderPastHighlights = () => {
      if (!pastEventsNode) return;
      pastEventsNode.innerHTML = pastEvents
        .map(
          (event) => `
            <article class="activity-item card">
              <span class="activity-date">${formatDate(event.date)}</span>
              <h3>${event.title}</h3>
              <p>${event.description}</p>
            </article>
          `
        )
        .join('');
    };

    const getFilteredEvents = () => {
      const currentFilter = filterNode.value;
      if (currentFilter === 'past') return pastEvents;
      if (currentFilter === 'all') return eventData;
      return upcomingEvents;
    };

    const renderEvents = () => {
      const filtered = getFilteredEvents();

      if (!filtered.length) {
        gridNode.innerHTML = '<div class="empty-state">No posted videos yet. New club video posts will appear here.</div>';
        if (emptyStateNode) emptyStateNode.hidden = false;
        return;
      }

      if (emptyStateNode) emptyStateNode.hidden = true;
      gridNode.innerHTML = filtered
        .map(
          (event) => `
            <article class="event-card">
              <div class="event-poster">
                <img src="${event.poster}" alt="Poster for ${event.title}" loading="lazy" />
              </div>
              <div class="event-card-body">
                <div class="event-card-heading">
                  <span class="event-type">${event.type}</span>
                  <span class="event-status">${event.status === 'past' ? 'Past' : 'Upcoming'}</span>
                </div>
                <h3>${event.title}</h3>
                <ul class="event-detail-list">
                  <li><strong>Date:</strong> ${formatDate(event.date)}</li>
                  <li><strong>Time:</strong> ${event.time || 'Time to be confirmed'}</li>
                  <li><strong>Location:</strong> ${event.location || 'Location to be confirmed'}</li>
                </ul>
                <p>${event.description}</p>
                ${event.calendarUrl ? `<a class="text-link" href="${event.calendarUrl}" target="_blank" rel="noreferrer">Add to calendar</a>` : '<span class="event-link-placeholder">Calendar link available once the event details are verified.</span>'}
              </div>
            </article>
          `
        )
        .join('');

      gridNode.querySelectorAll('img').forEach((img) => addImageFallback(img, 'assets/images/gallery/gallery-placeholder-01.svg'));
    };

    filterNode.addEventListener('change', renderEvents);
    renderFeaturedEvent();
    renderPastHighlights();
    renderEvents();
  };

  // Initialize contact and join forms on pages where they appear.
  const joinForm = document.getElementById('joinForm');
  initializeValidatedForm(joinForm, {
    fields: [
      { name: 'name', type: 'text' },
      { name: 'email', type: 'email' },
      { name: 'interest', type: 'text' },
      { name: 'message', type: 'text' }
    ],
    placeholderMessage: 'This form is a frontend placeholder. No inquiry has been submitted yet. Please use the official club communication channels once they are confirmed.'
  });

  const contactForm = document.getElementById('contactForm');
  initializeValidatedForm(contactForm, {
    fields: [
      { name: 'name', type: 'text' },
      { name: 'email', type: 'email' },
      { name: 'subject', type: 'text' },
      { name: 'message', type: 'text' }
    ],
    placeholderMessage: 'This form is a frontend placeholder. No message has been sent because no verified backend or approved email service is configured for this static site.'
  });

  initializeFooterYear();
  initializeNavigation();
  initializeSmoothAnchors();
  initializeRevealAnimations();
  initializeHomeHighlights();
  initializeHomeActivities();
  initializeMemberDirectory();
  initializeFilmPortfolio();
  initializeGalleryLightbox();
  initializeAboutGallery();
  initializeEventList();
});
