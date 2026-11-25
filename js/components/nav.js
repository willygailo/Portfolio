(function (window, document) {
  'use strict';

  var Portfolio = (window.Portfolio = window.Portfolio || {});
  var observer = null;
  var manualLockUntil = 0;

  function prefersReducedMotion() {
    return Boolean(
      window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }

  function setActiveNav(targetId) {
    var items = document.querySelectorAll('.bottom-nav [data-nav-target]');
    for (var i = 0; i < items.length; i += 1) {
      var item = items[i];
      var isMatch = item.getAttribute('data-nav-target') === targetId;
      item.classList.toggle('is-active', isMatch);
      if (isMatch) {
        item.setAttribute('aria-current', 'page');
      } else {
        item.removeAttribute('aria-current');
      }
    }
  }

  function scrollToSection(targetId) {
    if (!targetId) {
      return;
    }
    var section = document.getElementById(targetId);
    if (!section) {
      return;
    }

    manualLockUntil = Date.now() + 650;
    setActiveNav(targetId);

    section.scrollIntoView({
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      block: 'start'
    });
  }

  function setupScrollSpy() {
    var sections = document.querySelectorAll('section[data-section]');
    if (!sections.length) {
      return;
    }

    if (!('IntersectionObserver' in window)) {
      setActiveNav(sections[0].getAttribute('data-section') || sections[0].id);
      return;
    }

    if (observer) {
      observer.disconnect();
    }

    var ratios = {};
    for (var i = 0; i < sections.length; i += 1) {
      var id = sections[i].getAttribute('data-section') || sections[i].id;
      ratios[id] = 0;
    }

    observer = new window.IntersectionObserver(
      function (entries) {
        for (var j = 0; j < entries.length; j += 1) {
          var entry = entries[j];
          var key =
            entry.target.getAttribute('data-section') || entry.target.id;
          ratios[key] = entry.isIntersecting ? entry.intersectionRatio : 0;
        }

        if (Date.now() < manualLockUntil) {
          return;
        }

        var bestId = null;
        var bestRatio = 0;
        var keys = Object.keys(ratios);
        for (var k = 0; k < keys.length; k += 1) {
          var sectionId = keys[k];
          if (ratios[sectionId] > bestRatio) {
            bestRatio = ratios[sectionId];
            bestId = sectionId;
          }
        }

        if (bestId) {
          setActiveNav(bestId);
        }
      },
      {
        root: null,
        rootMargin: '-20% 0px -45% 0px',
        threshold: [0.05, 0.2, 0.4, 0.65]
      }
    );

    for (var s = 0; s < sections.length; s += 1) {
      observer.observe(sections[s]);
    }
  }

  function init() {
    var navItems = document.querySelectorAll('.bottom-nav [data-nav-target]');
    for (var i = 0; i < navItems.length; i += 1) {
      (function (item) {
        if (item.dataset.navBound) {
          return;
        }
        item.dataset.navBound = 'true';
        item.addEventListener('click', function (event) {
          var targetId = item.getAttribute('data-nav-target');
          if (!targetId) {
            return;
          }
          event.preventDefault();
          scrollToSection(targetId);
        });
      })(navItems[i]);
    }

    var ctaProjects = document.getElementById('cta-projects');
    if (ctaProjects && !ctaProjects.dataset.navBound) {
      ctaProjects.dataset.navBound = 'true';
      ctaProjects.addEventListener('click', function (event) {
        event.preventDefault();
        scrollToSection('projects');
      });
    }

    setActiveNav('home');
    setupScrollSpy();
  }

  Portfolio.nav = {
    init: init,
    scrollToSection: scrollToSection,
    setActiveNav: setActiveNav
  };
})(window, document);
