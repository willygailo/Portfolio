(function (window, document) {
  'use strict';

  var Portfolio = (window.Portfolio = window.Portfolio || {});
  var CHIP_ORDER = ['whoami', 'stack', 'repos', 'socials', 'help', 'clear'];

  function getCommands() {
    if (
      window.PortfolioData &&
      window.PortfolioData.terminalCommands &&
      typeof window.PortfolioData.terminalCommands === 'object'
    ) {
      return window.PortfolioData.terminalCommands;
    }
    return {};
  }

  function appendLine(outputEl, text, modifierClass) {
    var dom = Portfolio.dom;
    if (!outputEl || !dom) {
      return;
    }
    var cls = modifierClass
      ? 'terminal-line ' + modifierClass
      : 'terminal-line';
    var line = dom.el('div', { class: cls }, text);
    outputEl.appendChild(line);
  }

  function appendCommandEcho(outputEl, rawCommand) {
    var dom = Portfolio.dom;
    if (!outputEl || !dom) {
      return;
    }
    var row = dom.el('div', { class: 'terminal-line terminal-line--cmd' }, [
      dom.el('span', { class: 'terminal-line__prompt' }, '$ '),
      dom.el('span', { class: 'terminal-line__input' }, rawCommand)
    ]);
    outputEl.appendChild(row);
  }

  function clearOutput() {
    var outputEl = document.getElementById('terminal-output');
    if (Portfolio.dom && outputEl) {
      Portfolio.dom.clear(outputEl);
    }
  }

  function runCommand(rawInput) {
    var outputEl = document.getElementById('terminal-output');
    if (!outputEl) {
      return;
    }

    var trimmed = String(rawInput || '').trim();
    if (!trimmed) {
      return;
    }

    var cmdName = trimmed.split(/\s+/)[0].toLowerCase();
    var commands = getCommands();
    var entry = Object.prototype.hasOwnProperty.call(commands, cmdName)
      ? commands[cmdName]
      : null;

    if (cmdName === 'clear' || (entry && entry.action === 'clear')) {
      clearOutput();
      return;
    }

    appendCommandEcho(outputEl, trimmed);

    if (entry && Array.isArray(entry.lines)) {
      for (var i = 0; i < entry.lines.length; i += 1) {
        appendLine(outputEl, entry.lines[i], 'terminal-line--result');
      }
    } else {
      appendLine(
        outputEl,
        'Unknown command "' + cmdName + '". Run "help" or tap a chip below.',
        'terminal-line--error'
      );
    }

    outputEl.scrollTop = outputEl.scrollHeight;
  }

  function renderChips() {
    var chipsEl = document.getElementById('terminal-chips');
    var dom = Portfolio.dom;
    if (!chipsEl || !dom) {
      return;
    }

    var commands = getCommands();
    dom.clear(chipsEl);

    var keys = [];
    for (var i = 0; i < CHIP_ORDER.length; i += 1) {
      if (Object.prototype.hasOwnProperty.call(commands, CHIP_ORDER[i])) {
        keys.push(CHIP_ORDER[i]);
      }
    }
    var extraKeys = Object.keys(commands);
    for (var j = 0; j < extraKeys.length; j += 1) {
      if (keys.indexOf(extraKeys[j]) === -1) {
        keys.push(extraKeys[j]);
      }
    }

    for (var k = 0; k < keys.length; k += 1) {
      (function (cmd) {
        var meta = commands[cmd];
        var chip = dom.el(
          'button',
          {
            type: 'button',
            class: 'terminal-chip',
            dataset: { command: cmd },
            title: meta && meta.description ? meta.description : cmd,
            onClick: function () {
              runCommand(cmd);
            }
          },
          cmd
        );
        chipsEl.appendChild(chip);
      })(keys[k]);
    }
  }

  function init() {
    renderChips();

    var outputEl = document.getElementById('terminal-output');
    if (outputEl && !outputEl.hasChildNodes()) {
      appendLine(
        outputEl,
        'Ready. Tap a command chip or type "help" below.',
        'terminal-line--muted'
      );
    }

    var form = document.getElementById('terminal-form');
    var input = document.getElementById('terminal-input');
    if (form && !form.dataset.terminalBound) {
      form.dataset.terminalBound = 'true';
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        if (!input) {
          return;
        }
        var value = input.value;
        if (!value || !value.trim()) {
          return;
        }
        runCommand(value);
        input.value = '';
      });
    }
  }

  Portfolio.terminal = {
    init: init,
    runCommand: runCommand,
    clear: clearOutput
  };
})(window, document);
