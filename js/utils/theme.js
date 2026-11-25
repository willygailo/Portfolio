(function (window, document) {
  'use strict';

  var Portfolio = (window.Portfolio = window.Portfolio || {});
  var STORAGE_KEY = 'portfolio-theme';
  var THEME_COLORS = {
    dark: '#090d12',
    light: '#f4f7fb'
  };
  var currentTheme = 'dark';

  function normalizeTheme(theme) {
    return theme === 'light' ? 'light' : 'dark';
  }

  function readStoredTheme() {
    try {
      var saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') {
        return saved;
      }
    } catch (_err) {
      // Ignore storage access errors (e.g. restricted file:// or private mode)
    }
    return 'dark';
  }

  function writeStoredTheme(theme) {
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch (_err) {
      // Ignore storage write errors
    }
  }

  function createThemeIcon(isLight) {
    var SVG_NS = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('class', 'theme-toggle__icon');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('width', '18');
    svg.setAttribute('height', '18');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.setAttribute('aria-hidden', 'true');

    if (isLight) {
      // Moon icon indicating toggle back to dark mode
      var path = document.createElementNS(SVG_NS, 'path');
      path.setAttribute('d', 'M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z');
      svg.appendChild(path);
    } else {
      // Sun icon indicating toggle to light mode
      var circle = document.createElementNS(SVG_NS, 'circle');
      circle.setAttribute('cx', '12');
      circle.setAttribute('cy', '12');
      circle.setAttribute('r', '4');
      svg.appendChild(circle);

      var rays = [
        ['12', '2', '12', '4'],
        ['12', '20', '12', '22'],
        ['4.93', '4.93', '6.34', '6.34'],
        ['17.66', '17.66', '19.07', '19.07'],
        ['2', '12', '4', '12'],
        ['20', '12', '22', '12'],
        ['6.34', '17.66', '4.93', '19.07'],
        ['19.07', '4.93', '17.66', '6.34']
      ];
      for (var i = 0; i < rays.length; i += 1) {
        var line = document.createElementNS(SVG_NS, 'line');
        line.setAttribute('x1', rays[i][0]);
        line.setAttribute('y1', rays[i][1]);
        line.setAttribute('x2', rays[i][2]);
        line.setAttribute('y2', rays[i][3]);
        svg.appendChild(line);
      }
    }

    return svg;
  }

  function updateToggleButton(theme) {
    var btn = document.getElementById('theme-toggle');
    if (!btn) {
      return;
    }

    var isLight = theme === 'light';
    btn.setAttribute('aria-pressed', isLight ? 'true' : 'false');
    btn.setAttribute(
      'aria-label',
      isLight ? 'Switch to dark theme' : 'Switch to light theme'
    );
    btn.setAttribute(
      'title',
      isLight ? 'Switch to dark mode' : 'Switch to light mode'
    );

    var labelSlot = btn.querySelector('[data-theme-label], .theme-toggle__label');
    while (btn.firstChild) {
      btn.removeChild(btn.firstChild);
    }
    btn.appendChild(createThemeIcon(isLight));
    if (labelSlot) {
      labelSlot.textContent = isLight ? 'Dark' : 'Light';
      btn.appendChild(labelSlot);
    }
  }

  function updateThemeMeta(theme) {
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', THEME_COLORS[theme] || THEME_COLORS.dark);
    }
  }

  function applyTheme(theme) {
    currentTheme = normalizeTheme(theme);
    document.documentElement.dataset.theme = currentTheme;
    updateThemeMeta(currentTheme);
    updateToggleButton(currentTheme);
    return currentTheme;
  }

  function setTheme(theme) {
    var applied = applyTheme(theme);
    writeStoredTheme(applied);
    return applied;
  }

  function toggle() {
    var next = currentTheme === 'dark' ? 'light' : 'dark';
    return setTheme(next);
  }

  function getTheme() {
    return currentTheme;
  }

  function init() {
    applyTheme(readStoredTheme());

    var btn = document.getElementById('theme-toggle');
    if (btn && !btn.dataset.themeBound) {
      btn.dataset.themeBound = 'true';
      btn.addEventListener('click', function () {
        var next = toggle();
        if (Portfolio.dom && typeof Portfolio.dom.showToast === 'function') {
          Portfolio.dom.showToast(
            next === 'light' ? 'Light theme enabled' : 'Dark theme enabled',
            1600
          );
        }
      });
    }
  }

  Portfolio.theme = {
    init: init,
    getTheme: getTheme,
    setTheme: setTheme,
    toggle: toggle
  };
})(window, document);
