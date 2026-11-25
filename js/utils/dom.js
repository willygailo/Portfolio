(function (window, document) {
  'use strict';

  var Portfolio = (window.Portfolio = window.Portfolio || {});
  var toastHideTimer = null;
  var toastCleanupTimer = null;

  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function appendChildSafe(parent, child) {
    if (child === null || child === undefined || typeof child === 'boolean') {
      return;
    }
    if (Array.isArray(child)) {
      for (var i = 0; i < child.length; i += 1) {
        appendChildSafe(parent, child[i]);
      }
      return;
    }
    if (child instanceof window.Node) {
      parent.appendChild(child);
      return;
    }
    parent.appendChild(document.createTextNode(String(child)));
  }

  function el(tag, attrs, children) {
    var node = document.createElement(tag);

    if (attrs && typeof attrs === 'object') {
      var keys = Object.keys(attrs);
      for (var i = 0; i < keys.length; i += 1) {
        var key = keys[i];
        var val = attrs[key];

        if (val === null || val === undefined || val === false) {
          continue;
        }

        if (key === 'class' || key === 'className') {
          node.className = Array.isArray(val) ? val.filter(Boolean).join(' ') : String(val);
        } else if (key === 'text' || key === 'textContent') {
          node.textContent = String(val);
        } else if (key === 'dataset' && typeof val === 'object') {
          var dataKeys = Object.keys(val);
          for (var j = 0; j < dataKeys.length; j += 1) {
            var dk = dataKeys[j];
            if (val[dk] !== null && val[dk] !== undefined) {
              node.dataset[dk] = String(val[dk]);
            }
          }
        } else if (key === 'style' && typeof val === 'object') {
          Object.assign(node.style, val);
        } else if (key.indexOf('on') === 0 && typeof val === 'function') {
          node.addEventListener(key.slice(2).toLowerCase(), val);
        } else if (key === 'hidden' || key === 'disabled' || key === 'checked' || key === 'required') {
          node[key] = Boolean(val);
        } else if (val === true) {
          node.setAttribute(key, '');
        } else {
          node.setAttribute(key, String(val));
        }
      }
    }

    if (arguments.length >= 3) {
      appendChildSafe(node, children);
    }

    return node;
  }

  function clear(node) {
    if (!node) {
      return;
    }
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }
  }

  function showToast(message, duration) {
    var toast = qs('#toast');
    if (!toast || !message) {
      return;
    }

    var hideDelay = typeof duration === 'number' && duration > 0 ? duration : 2600;

    if (toastHideTimer) {
      window.clearTimeout(toastHideTimer);
      toastHideTimer = null;
    }
    if (toastCleanupTimer) {
      window.clearTimeout(toastCleanupTimer);
      toastCleanupTimer = null;
    }

    toast.textContent = String(message);
    toast.hidden = false;

    window.requestAnimationFrame(function () {
      toast.classList.add('is-visible');
    });

    toastHideTimer = window.setTimeout(function () {
      toast.classList.remove('is-visible');
      toastCleanupTimer = window.setTimeout(function () {
        toast.hidden = true;
        toastCleanupTimer = null;
      }, 220);
      toastHideTimer = null;
    }, hideDelay);
  }

  Portfolio.dom = {
    qs: qs,
    qsa: qsa,
    el: el,
    clear: clear,
    showToast: showToast
  };
})(window, document);
