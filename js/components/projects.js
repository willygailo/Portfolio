(function (window, document) {
  'use strict';

  var Portfolio = (window.Portfolio = window.Portfolio || {});
  var CATEGORIES = [
    { key: 'all', label: 'All' },
    { key: 'android', label: 'Android' },
    { key: 'security', label: 'Security' },
    { key: 'web', label: 'Web' }
  ];

  var activeCategory = 'all';
  var searchQuery = '';

  function getProjects() {
    if (
      window.PortfolioData &&
      Array.isArray(window.PortfolioData.projects)
    ) {
      return window.PortfolioData.projects;
    }
    return [];
  }

  function matchesFilters(project) {
    var category = String(project.category || '').toLowerCase();
    if (activeCategory !== 'all' && category !== activeCategory) {
      return false;
    }

    if (!searchQuery) {
      return true;
    }

    var haystackParts = [
      project.title,
      project.name,
      project.categoryLabel,
      project.category,
      project.summary,
      Array.isArray(project.tech) ? project.tech.join(' ') : '',
      Array.isArray(project.highlights) ? project.highlights.join(' ') : ''
    ];
    var haystack = haystackParts.join(' ').toLowerCase();
    return haystack.indexOf(searchQuery) !== -1;
  }

  function renderFilterChips() {
    var container = document.getElementById('project-filters');
    var dom = Portfolio.dom;
    if (!container || !dom) {
      return;
    }

    dom.clear(container);

    for (var i = 0; i < CATEGORIES.length; i += 1) {
      (function (cat) {
        var isSelected = activeCategory === cat.key;
        var chip = dom.el(
          'button',
          {
            type: 'button',
            class: isSelected ? 'filter-chip is-active' : 'filter-chip',
            'aria-pressed': isSelected ? 'true' : 'false',
            dataset: { filter: cat.key },
            onClick: function () {
              setFilter(cat.key);
            }
          },
          cat.label
        );
        container.appendChild(chip);
      })(CATEGORIES[i]);
    }
  }

  function updateChipStates() {
    var container = document.getElementById('project-filters');
    if (!container) {
      return;
    }
    var chips = container.querySelectorAll('[data-filter]');
    for (var i = 0; i < chips.length; i += 1) {
      var chip = chips[i];
      var isSelected = chip.getAttribute('data-filter') === activeCategory;
      chip.classList.toggle('is-active', isSelected);
      chip.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
    }
  }

  function createProjectCard(project) {
    var dom = Portfolio.dom;
    var techList = Array.isArray(project.tech) ? project.tech : [];
    var techPills = [];
    for (var i = 0; i < techList.length; i += 1) {
      techPills.push(dom.el('span', { class: 'tech-pill' }, techList[i]));
    }

    var headerBadges = [
      dom.el(
        'span',
        { class: 'badge project-card__badge' },
        project.categoryLabel || project.category || 'Project'
      )
    ];

    if (project.featured) {
      headerBadges.push(
        dom.el('span', { class: 'project-card__featured' }, 'Featured')
      );
    }

    var inspectBtn = dom.el(
      'button',
      {
        type: 'button',
        class: 'btn btn--secondary btn--sm project-card__inspect',
        'aria-label': 'Inspect ' + (project.title || project.name || 'project'),
        onClick: function (event) {
          event.stopPropagation();
          if (Portfolio.modal && typeof Portfolio.modal.open === 'function') {
            Portfolio.modal.open(project, inspectBtn);
          }
        }
      },
      'Inspect'
    );

    var actionChildren = [inspectBtn];

    if (typeof project.repoUrl === 'string' && /^https?:\/\//i.test(project.repoUrl)) {
      actionChildren.push(
        dom.el(
          'a',
          {
            class: 'btn btn--ghost btn--sm project-card__repo',
            href: project.repoUrl,
            target: '_blank',
            rel: 'noopener noreferrer',
            'aria-label': 'Open ' + (project.title || 'repository') + ' on GitHub',
            onClick: function (event) {
              event.stopPropagation();
            }
          },
          'GitHub'
        )
      );
    }

    var card = dom.el(
      'article',
      {
        class: 'project-card is-visible',
        dataset: {
          projectId: project.id || '',
          category: project.category || ''
        },
        onClick: function (event) {
          if (event.target && event.target.closest && event.target.closest('a, button')) {
            return;
          }
          if (Portfolio.modal && typeof Portfolio.modal.open === 'function') {
            Portfolio.modal.open(project, inspectBtn);
          }
        }
      },
      [
        dom.el('div', { class: 'project-card__header' }, headerBadges),
        dom.el(
          'h3',
          { class: 'project-card__title' },
          project.title || project.name || ''
        ),
        dom.el('p', { class: 'project-card__summary' }, project.summary || ''),
        dom.el('div', { class: 'project-card__tech' }, techPills),
        dom.el('div', { class: 'project-card__actions' }, actionChildren)
      ]
    );

    return card;
  }

  function render() {
    var grid = document.getElementById('projects-grid');
    var countEl = document.getElementById('project-count');
    var dom = Portfolio.dom;
    if (!grid || !dom) {
      return;
    }

    var allProjects = getProjects();
    var filtered = [];
    for (var i = 0; i < allProjects.length; i += 1) {
      if (matchesFilters(allProjects[i])) {
        filtered.push(allProjects[i]);
      }
    }

    if (countEl) {
      var noun = allProjects.length === 1 ? 'project' : 'projects';
      countEl.textContent =
        'Showing ' + filtered.length + ' of ' + allProjects.length + ' ' + noun;
    }

    dom.clear(grid);

    if (!filtered.length) {
      var resetBtn = dom.el(
        'button',
        {
          type: 'button',
          class: 'btn btn--secondary btn--sm',
          onClick: function () {
            resetFilters();
          }
        },
        'Reset filters'
      );

      grid.appendChild(
        dom.el('div', { class: 'projects-empty' }, [
          dom.el(
            'p',
            { class: 'projects-empty__text' },
            'No matching repositories found for the current filter.'
          ),
          resetBtn
        ])
      );
      return;
    }

    for (var j = 0; j < filtered.length; j += 1) {
      grid.appendChild(createProjectCard(filtered[j]));
    }
  }

  function setFilter(categoryKey) {
    activeCategory = String(categoryKey || 'all').toLowerCase();
    updateChipStates();
    render();
  }

  function setSearch(query) {
    searchQuery = String(query || '').trim().toLowerCase();
    render();
  }

  function resetFilters() {
    activeCategory = 'all';
    searchQuery = '';
    var searchInput = document.getElementById('project-search');
    if (searchInput) {
      searchInput.value = '';
    }
    updateChipStates();
    render();
  }

  function init() {
    renderFilterChips();

    var searchInput = document.getElementById('project-search');
    if (searchInput && !searchInput.dataset.searchBound) {
      searchInput.dataset.searchBound = 'true';
      var handleSearch = function () {
        setSearch(searchInput.value);
      };
      searchInput.addEventListener('input', handleSearch);
      searchInput.addEventListener('search', handleSearch);
    }

    render();
  }

  Portfolio.projects = {
    init: init,
    render: render,
    setFilter: setFilter,
    setSearch: setSearch,
    resetFilters: resetFilters
  };
})(window, document);
