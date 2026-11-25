(function (window, document) {
  'use strict';

  var Portfolio = (window.Portfolio = window.Portfolio || {});
  var SVG_NS = 'http://www.w3.org/2000/svg';

  function createIconSvg(iconKey) {
    var svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('width', '18');
    svg.setAttribute('height', '18');
    svg.setAttribute('aria-hidden', 'true');

    if (iconKey === 'github') {
      svg.setAttribute('fill', 'currentColor');
      var ghPath = document.createElementNS(SVG_NS, 'path');
      ghPath.setAttribute(
        'd',
        'M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z'
      );
      svg.appendChild(ghPath);
      return svg;
    }

    if (iconKey === 'facebook') {
      svg.setAttribute('fill', 'currentColor');
      var fbPath = document.createElementNS(SVG_NS, 'path');
      fbPath.setAttribute(
        'd',
        'M22 12.061C22 6.504 17.523 2 12 2S2 6.504 2 12.061c0 5.022 3.657 9.184 8.438 9.939v-7.03h-2.54v-2.91h2.54V9.845c0-2.522 1.492-3.915 3.777-3.915 1.094 0 2.238.196 2.238.196v2.476h-1.26c-1.243 0-1.63.775-1.63 1.57v1.888h2.773l-.443 2.91h-2.33V22C18.343 21.245 22 17.083 22 12.061Z'
      );
      svg.appendChild(fbPath);
      return svg;
    }

    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');

    if (iconKey === 'smartphone') {
      var rect = document.createElementNS(SVG_NS, 'rect');
      rect.setAttribute('x', '5');
      rect.setAttribute('y', '2');
      rect.setAttribute('width', '14');
      rect.setAttribute('height', '20');
      rect.setAttribute('rx', '2');
      rect.setAttribute('ry', '2');
      var dot = document.createElementNS(SVG_NS, 'path');
      dot.setAttribute('d', 'M12 18h.01');
      svg.appendChild(rect);
      svg.appendChild(dot);
    } else if (iconKey === 'shield') {
      var shield = document.createElementNS(SVG_NS, 'path');
      shield.setAttribute('d', 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10');
      var check = document.createElementNS(SVG_NS, 'path');
      check.setAttribute('d', 'm9 12 2 2 4-4');
      svg.appendChild(shield);
      svg.appendChild(check);
    } else if (iconKey === 'code') {
      var p1 = document.createElementNS(SVG_NS, 'polyline');
      p1.setAttribute('points', '16 18 22 12 16 6');
      var p2 = document.createElementNS(SVG_NS, 'polyline');
      p2.setAttribute('points', '8 6 2 12 8 18');
      svg.appendChild(p1);
      svg.appendChild(p2);
    } else {
      var term1 = document.createElementNS(SVG_NS, 'polyline');
      term1.setAttribute('points', '4 17 10 11 4 5');
      var term2 = document.createElementNS(SVG_NS, 'line');
      term2.setAttribute('x1', '12');
      term2.setAttribute('y1', '19');
      term2.setAttribute('x2', '20');
      term2.setAttribute('y2', '19');
      svg.appendChild(term1);
      svg.appendChild(term2);
    }

    return svg;
  }

  function copyToClipboard(text) {
    if (
      navigator.clipboard &&
      typeof navigator.clipboard.writeText === 'function' &&
      window.isSecureContext
    ) {
      return navigator.clipboard.writeText(text).then(
        function () {
          return true;
        },
        function () {
          return fallbackCopy(text);
        }
      );
    }
    return Promise.resolve(fallbackCopy(text));
  }

  function fallbackCopy(text) {
    try {
      var textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.top = '-9999px';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      var copied = document.execCommand('copy');
      document.body.removeChild(textarea);
      return Boolean(copied);
    } catch (_err) {
      return false;
    }
  }

  function hydrateBentoStats(data) {
    var container = document.getElementById('bento-stats');
    var dom = Portfolio.dom;
    if (!container || !dom || !data || !data.profile || !Array.isArray(data.profile.stats)) {
      return;
    }

    dom.clear(container);
    var stats = data.profile.stats;

    for (var i = 0; i < stats.length; i += 1) {
      var stat = stats[i];
      container.appendChild(
        dom.el('article', { class: 'bento-card' }, [
          dom.el('span', { class: 'bento-card__label' }, stat.label || ''),
          dom.el('strong', { class: 'bento-card__value' }, stat.value || ''),
          dom.el('span', { class: 'bento-card__hint' }, stat.hint || '')
        ])
      );
    }
  }

  function hydrateSkills(data) {
    var container = document.getElementById('skills-container');
    var dom = Portfolio.dom;
    if (!container || !dom || !data || !Array.isArray(data.skills)) {
      return;
    }

    dom.clear(container);
    var groups = data.skills;

    for (var i = 0; i < groups.length; i += 1) {
      var group = groups[i];
      var pills = [];
      var items = Array.isArray(group.items) ? group.items : [];
      for (var j = 0; j < items.length; j += 1) {
        pills.push(dom.el('span', { class: 'skill-pill' }, items[j]));
      }

      container.appendChild(
        dom.el('article', { class: 'skill-group', dataset: { skillGroup: group.id || '' } }, [
          dom.el('div', { class: 'skill-group__header' }, [
            dom.el('span', { class: 'skill-group__icon', 'aria-hidden': 'true' }, [
              createIconSvg(group.icon)
            ]),
            dom.el('h3', { class: 'skill-group__title' }, group.title || '')
          ]),
          dom.el('div', { class: 'skill-group__pills' }, pills)
        ])
      );
    }
  }

  function hydrateSocials(data) {
    var container = document.getElementById('social-links');
    var dom = Portfolio.dom;
    if (!container || !dom || !data || !Array.isArray(data.socials)) {
      return;
    }

    dom.clear(container);
    var socials = data.socials;

    for (var i = 0; i < socials.length; i += 1) {
      var item = socials[i];
      var url = typeof item.url === 'string' && /^https?:\/\//i.test(item.url) ? item.url : '#';

      container.appendChild(
        dom.el(
          'a',
          {
            class: 'social-card',
            href: url,
            target: '_blank',
            rel: 'noopener noreferrer',
            dataset: { social: item.id || '' }
          },
          [
            dom.el('span', { class: 'social-card__icon', 'aria-hidden': 'true' }, [
              createIconSvg(item.icon)
            ]),
            dom.el('div', { class: 'social-card__body' }, [
              dom.el('div', { class: 'social-card__top' }, [
                dom.el('strong', { class: 'social-card__label' }, item.label || ''),
                dom.el('span', { class: 'social-card__handle' }, item.handle || '')
              ]),
              dom.el('p', { class: 'social-card__desc' }, item.description || '')
            ]),
            dom.el('span', { class: 'social-card__arrow', 'aria-hidden': 'true' }, '↗')
          ]
        )
      );
    }
  }

  function setupCopyHandle(data) {
    var btn = document.getElementById('copy-handle-btn');
    var dom = Portfolio.dom;
    if (!btn || btn.dataset.copyBound) {
      return;
    }
    btn.dataset.copyBound = 'true';

    btn.addEventListener('click', function () {
      var handle =
        btn.getAttribute('data-copy') ||
        (data && data.profile && data.profile.handle) ||
        '@willygailo';

      copyToClipboard(handle).then(function (ok) {
        if (dom) {
          dom.showToast(
            ok ? 'Copied ' + handle + ' to clipboard' : 'Handle: ' + handle
          );
        }
      });
    });
  }

  function setContactFeedback(feedbackEl, message, isError) {
    if (!feedbackEl) {
      return;
    }
    feedbackEl.textContent = message;
    feedbackEl.classList.toggle('is-error', Boolean(isError));
    feedbackEl.classList.toggle('is-success', !isError);
  }

  function setupContactForm() {
    var form = document.getElementById('contact-form');
    var dom = Portfolio.dom;
    if (!form || form.dataset.contactBound) {
      return;
    }
    form.dataset.contactBound = 'true';

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var nameInput = document.getElementById('contact-name');
      var topicSelect = document.getElementById('contact-topic');
      var messageInput = document.getElementById('contact-message');
      var feedbackEl = document.getElementById('contact-feedback');

      var name = nameInput ? nameInput.value.trim() : '';
      var topic = topicSelect ? topicSelect.value.trim() : 'General Message';
      var message = messageInput ? messageInput.value.trim() : '';

      if (name.length < 2) {
        setContactFeedback(
          feedbackEl,
          'Please enter your name (at least 2 characters).',
          true
        );
        if (nameInput) {
          nameInput.focus();
        }
        if (dom) {
          dom.showToast('Please enter your name');
        }
        return;
      }

      if (message.length < 5) {
        setContactFeedback(
          feedbackEl,
          'Please enter a short message (at least 5 characters).',
          true
        );
        if (messageInput) {
          messageInput.focus();
        }
        if (dom) {
          dom.showToast('Please write a brief message');
        }
        return;
      }

      var formattedMessage =
        'Hi Willy (@willygailo),\n' +
        'Topic: ' +
        topic +
        '\n' +
        'From: ' +
        name +
        '\n\n' +
        message;

      copyToClipboard(formattedMessage).then(function (copied) {
        if (copied) {
          setContactFeedback(
            feedbackEl,
            'Message for "' +
              topic +
              '" copied to clipboard. Send it via GitHub or Facebook.',
            false
          );
          if (dom) {
            dom.showToast('Inquiry copied to clipboard!');
          }
          form.reset();
        } else {
          setContactFeedback(
            feedbackEl,
            'Inquiry ready for ' + topic + ' from ' + name + ': "' + message + '"',
            false
          );
          if (dom) {
            dom.showToast('Inquiry prepared below');
          }
        }
      });
    });
  }

  function setupScrollReveals() {
    var targets = document.querySelectorAll(
      '.section, .bento-card, .terminal-card, .skill-group, .social-card'
    );
    if (!targets.length) {
      return;
    }

    var reducedMotion =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion || !('IntersectionObserver' in window)) {
      for (var i = 0; i < targets.length; i += 1) {
        targets[i].classList.add('is-visible');
      }
      return;
    }

    var observer = new window.IntersectionObserver(
      function (entries, obs) {
        for (var j = 0; j < entries.length; j += 1) {
          var entry = entries[j];
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        }
      },
      {
        root: null,
        rootMargin: '0px 0px -6% 0px',
        threshold: 0.05
      }
    );

    for (var k = 0; k < targets.length; k += 1) {
      targets[k].classList.add('reveal-ready');
      observer.observe(targets[k]);
    }
  }

  function boot() {
    var data = window.PortfolioData || {};

    if (Portfolio.theme && typeof Portfolio.theme.init === 'function') {
      Portfolio.theme.init();
    }

    hydrateBentoStats(data);
    hydrateSkills(data);
    hydrateSocials(data);
    setupCopyHandle(data);
    setupContactForm();

    if (Portfolio.nav && typeof Portfolio.nav.init === 'function') {
      Portfolio.nav.init();
    }
    if (Portfolio.modal && typeof Portfolio.modal.init === 'function') {
      Portfolio.modal.init();
    }
    if (Portfolio.projects && typeof Portfolio.projects.init === 'function') {
      Portfolio.projects.init();
    }
    if (Portfolio.terminal && typeof Portfolio.terminal.init === 'function') {
      Portfolio.terminal.init();
    }

    setupScrollReveals();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})(window, document);
