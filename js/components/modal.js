(function (window, document) {
  'use strict';

  var Portfolio = (window.Portfolio = window.Portfolio || {});
  var SWIPE_CLOSE_THRESHOLD = 70;

  var modalEl = null;
  var panelEl = null;
  var handleEl = null;
  var lastFocusedEl = null;
  var isOpen = false;
  var touchStartY = null;
  var touchDeltaY = 0;
  var isDragging = false;

  function getFocusableElements(container) {
    if (!container) {
      return [];
    }
    var selector =
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    var nodes = container.querySelectorAll(selector);
    var visible = [];
    for (var i = 0; i < nodes.length; i += 1) {
      var node = nodes[i];
      if (!node.hidden && node.offsetParent !== null) {
        visible.push(node);
      }
    }
    return visible;
  }

  function populateModal(project) {
    var badgeEl = document.getElementById('modal-badge');
    var titleEl = document.getElementById('modal-title');
    var summaryEl = document.getElementById('modal-summary');
    var featuresEl = document.getElementById('modal-features');
    var techEl = document.getElementById('modal-tech');
    var githubLinkEl = document.getElementById('modal-github-link');

    if (badgeEl) {
      badgeEl.textContent =
        project.categoryLabel || project.category || 'Project';
    }
    if (titleEl) {
      titleEl.textContent = project.title || 'Project Details';
    }
    if (summaryEl) {
      summaryEl.textContent =
        project.summary || project.description || '';
    }

    if (featuresEl) {
      while (featuresEl.firstChild) {
        featuresEl.removeChild(featuresEl.firstChild);
      }
      var highlights = Array.isArray(project.highlights)
        ? project.highlights
        : Array.isArray(project.features)
          ? project.features
          : [];
      for (var i = 0; i < highlights.length; i += 1) {
        var li = document.createElement('li');
        li.textContent = String(highlights[i]);
        featuresEl.appendChild(li);
      }
    }

    if (techEl) {
      while (techEl.firstChild) {
        techEl.removeChild(techEl.firstChild);
      }
      var techList = Array.isArray(project.tech) ? project.tech : [];
      for (var j = 0; j < techList.length; j += 1) {
        var pill = document.createElement('span');
        pill.className = 'tech-pill';
        pill.textContent = String(techList[j]);
        techEl.appendChild(pill);
      }
    }

    if (githubLinkEl) {
      var url = typeof project.repoUrl === 'string' ? project.repoUrl : '';
      if (/^https?:\/\//i.test(url)) {
        githubLinkEl.setAttribute('href', url);
        githubLinkEl.setAttribute('target', '_blank');
        githubLinkEl.setAttribute('rel', 'noopener noreferrer');
        githubLinkEl.hidden = false;
      } else {
        githubLinkEl.removeAttribute('href');
        githubLinkEl.hidden = true;
      }
    }
  }

  function resetDragStyles() {
    if (!panelEl) {
      return;
    }
    panelEl.style.transform = '';
    panelEl.style.transition = '';
  }

  function open(project, triggerEl) {
    if (!modalEl) {
      init();
    }
    if (!modalEl || !project) {
      return;
    }

    lastFocusedEl =
      triggerEl ||
      (document.activeElement instanceof window.HTMLElement
        ? document.activeElement
        : null);

    populateModal(project);
    resetDragStyles();

    if (panelEl) {
      panelEl.scrollTop = 0;
    }

    modalEl.hidden = false;
    isOpen = true;
    document.body.classList.add('modal-open');

    window.requestAnimationFrame(function () {
      if (modalEl) {
        modalEl.classList.add('is-open');
      }
    });

    var closeBtn = document.getElementById('modal-close');
    if (closeBtn) {
      closeBtn.focus();
    } else if (panelEl) {
      panelEl.setAttribute('tabindex', '-1');
      panelEl.focus();
    }
  }

  function close() {
    if (!modalEl || !isOpen) {
      return;
    }

    isOpen = false;
    modalEl.classList.remove('is-open');
    modalEl.hidden = true;
    document.body.classList.remove('modal-open');
    resetDragStyles();
    touchStartY = null;
    touchDeltaY = 0;
    isDragging = false;

    if (lastFocusedEl && typeof lastFocusedEl.focus === 'function') {
      lastFocusedEl.focus();
    }
    lastFocusedEl = null;
  }

  function handleKeyDown(event) {
    if (!isOpen) {
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }

    if (event.key === 'Tab') {
      var focusables = getFocusableElements(panelEl || modalEl);
      if (!focusables.length) {
        event.preventDefault();
        return;
      }

      var first = focusables[0];
      var last = focusables[focusables.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === first || !modalEl.contains(document.activeElement)) {
          event.preventDefault();
          last.focus();
        }
      } else if (
        document.activeElement === last ||
        !modalEl.contains(document.activeElement)
      ) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  function handleTouchStart(event) {
    if (!isOpen || !panelEl || !event.touches || event.touches.length !== 1) {
      return;
    }

    var startedOnHandle =
      handleEl && (event.target === handleEl || handleEl.contains(event.target));

    if (panelEl.scrollTop <= 0 || startedOnHandle) {
      touchStartY = event.touches[0].clientY;
      touchDeltaY = 0;
      isDragging = true;
      panelEl.style.transition = 'none';
    } else {
      touchStartY = null;
      isDragging = false;
    }
  }

  function handleTouchMove(event) {
    if (!isOpen || !isDragging || touchStartY === null || !panelEl || !event.touches.length) {
      return;
    }

    var delta = event.touches[0].clientY - touchStartY;
    if (delta > 0) {
      touchDeltaY = delta;
      panelEl.style.transform = 'translateY(' + Math.min(delta, 240) + 'px)';
    } else {
      touchDeltaY = 0;
      panelEl.style.transform = '';
    }
  }

  function handleTouchEnd() {
    if (!isOpen || !isDragging || !panelEl) {
      return;
    }

    var shouldClose = touchDeltaY > SWIPE_CLOSE_THRESHOLD;
    isDragging = false;
    touchStartY = null;

    if (shouldClose) {
      close();
    } else {
      panelEl.style.transition = 'transform 180ms ease-out';
      panelEl.style.transform = '';
      window.setTimeout(function () {
        if (panelEl && !isDragging) {
          panelEl.style.transition = '';
        }
      }, 200);
    }

    touchDeltaY = 0;
  }

  function init() {
    modalEl = document.getElementById('project-modal');
    if (!modalEl) {
      return;
    }

    panelEl = modalEl.querySelector('.bottom-sheet__panel');
    handleEl = modalEl.querySelector('.bottom-sheet__handle');

    if (modalEl.dataset.modalBound) {
      return;
    }
    modalEl.dataset.modalBound = 'true';

    modalEl.addEventListener('click', function (event) {
      var target = event.target;
      if (target && target.closest && target.closest('[data-modal-close]')) {
        event.preventDefault();
        close();
      }
    });

    document.addEventListener('keydown', handleKeyDown);

    var dragTarget = panelEl || modalEl;
    dragTarget.addEventListener('touchstart', handleTouchStart, { passive: true });
    dragTarget.addEventListener('touchmove', handleTouchMove, { passive: true });
    dragTarget.addEventListener('touchend', handleTouchEnd, { passive: true });
    dragTarget.addEventListener('touchcancel', handleTouchEnd, { passive: true });
  }

  Portfolio.modal = {
    init: init,
    open: open,
    close: close
  };
})(window, document);
