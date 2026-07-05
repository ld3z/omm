// ==UserScript==
// @name         OhMyMathpad
// @version      1.0.0
// @description  Type pi, sqrt, etc. in WebAssign and get math symbols
// @match        *://*.webassign.net/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/ld3z/oh-my-mathpad/main/oh-my-mathpad.user.js
// @downloadURL  https://raw.githubusercontent.com/ld3z/oh-my-mathpad/main/oh-my-mathpad.user.js
// ==/UserScript==

(function () {
  'use strict';

  // GM_info is provided by the userscript manager even with @grant none,
  // and always reflects the installed script's @version.
  const VERSION = (typeof GM_info !== 'undefined' && GM_info?.script?.version) || 'unknown';
  console.info(`[OhMyMathpad] v${VERSION} loaded`);

  // Plain unicode-symbol replacements (inserted as literal text)
  const REPLACEMENTS = {
    'pi': 'π', 'inf': '∞', 'theta': 'θ', 'alpha': 'α',
    'beta': 'β', 'delta': 'δ', 'sigma': 'σ', 'mu': 'μ', 'lambda': 'λ',
    'gamma': 'γ', 'pm': '±', 'deg': '°', 'times': '×', 'div': '÷',
  };

  // Keywords that must trigger a real WIRIS toolbar button click,
  // because they need actual MathML structure (not a bare character)
  // to be gradable by WebAssign.
  const BUTTON_TRIGGERS = {
    'sqrt': 'Square root',
  };

  const keywords = [...Object.keys(REPLACEMENTS), ...Object.keys(BUTTON_TRIGGERS)]
    .sort((a, b) => b.length - a.length);
  let buffer = '';

  function clickWirisButton(el, label) {
    const boxId = el.dataset.webassignAutoformatBoxId;
    if (!boxId || typeof window.getMathTypeEditorRoot !== 'function') {
      console.warn('[OhMyMathpad] Missing boxId or getMathTypeEditorRoot; cannot trigger', label);
      return false;
    }

    const editorDiv = window.getMathTypeEditorRoot(boxId, el);
    if (!editorDiv) {
      console.warn('[OhMyMathpad] Could not resolve editor root for box', boxId);
      return false;
    }

    const btn = editorDiv.querySelector(
      `button[aria-label="${label}"], button[title="${label}"]`
    );
    if (!btn) {
      console.warn('[OhMyMathpad] Could not find WIRIS button labeled', label);
      return false;
    }

    btn.click();
    return true;
  }

  function backspaceEvent(type) {
    const ev = new KeyboardEvent(type, {
      key: 'Backspace', code: 'Backspace', keyCode: 8, which: 8,
      bubbles: true, cancelable: true,
    });
    // Legacy editors (WIRIS is compiled from Haxe) read keyCode/which, which
    // are 0 on synthetic events unless overridden on the instance.
    Object.defineProperty(ev, 'keyCode', { get: () => 8 });
    Object.defineProperty(ev, 'which', { get: () => 8 });
    return ev;
  }

  // Returns true if a page handler consumed (preventDefault-ed) the event,
  // i.e. the editor processed the backspace itself.
  function dispatchBackspace(el) {
    const consumedDown = !el.dispatchEvent(backspaceEvent('keydown'));
    // Firefox fires keypress for Backspace on real key presses, and legacy
    // editors may do their editing there instead of on keydown.
    const consumedPress = !consumedDown && !el.dispatchEvent(backspaceEvent('keypress'));
    if (!consumedDown && !consumedPress) {
      document.execCommand('delete', false, null);
      el.dispatchEvent(new InputEvent('input', { bubbles: true, cancelable: true, inputType: 'deleteContentBackward' }));
    }
    el.dispatchEvent(backspaceEvent('keyup'));
    return consumedDown || consumedPress;
  }

  // Select the characters of `prefix` before the caret and delete them in one
  // real editing operation. Returns false if the field doesn't actually hold
  // that text (e.g. the WIRIS mathpad's hidden proxy input stays empty).
  function deleteViaSelection(el, prefix) {
    const count = prefix.length;
    if (['INPUT', 'TEXTAREA'].includes(el.tagName)) {
      const end = el.selectionStart ?? el.value.length;
      if (end < count) return false;
      if (el.value.slice(end - count, end).toLowerCase() !== prefix.toLowerCase()) return false;
      el.setRangeText('', end - count, end, 'end');
      el.dispatchEvent(new InputEvent('input', { bubbles: true, cancelable: true, inputType: 'deleteContentBackward' }));
      return true;
    }
    const sel = (el.ownerDocument || document).getSelection();
    if (!sel || sel.rangeCount === 0 || typeof sel.modify !== 'function') return false;
    sel.collapseToEnd();
    for (let i = 0; i < count; i++) sel.modify('extend', 'backward', 'character');
    if (sel.isCollapsed) return false;
    return document.execCommand('delete', false, null);
  }

  async function deleteTypedChars(el, prefix) {
    const count = prefix.length;
    if (count <= 0) return;
    if (deleteViaSelection(el, prefix)) return;
    // Expected for the WIRIS mathpad: its proxy input never holds the typed
    // text, so the editor itself must process the deletions.
    let consumed = 0;
    for (let i = 0; i < count; i++) {
      if (dispatchBackspace(el)) consumed++;
      // Yield a tick so the field's own input/mirror handlers can process
      // each deletion before the next one fires.
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
    console.info(`[OhMyMathpad] Sent ${count} synthetic backspace(s); editor consumed ${consumed}`);
  }

  document.addEventListener('keydown', async function (e) {
    const el = e.target;
    const isEditable = el.isContentEditable ||
      ['INPUT', 'TEXTAREA'].includes(el.tagName);
    if (!isEditable) return;

    // Only track plain letters
    if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
      buffer = (buffer + e.key).slice(-10); // keep last 10 chars
    } else {
      buffer = '';
      return;
    }

    for (const kw of keywords) {
      if (buffer.toLowerCase().endsWith(kw.toLowerCase())) {
        e.preventDefault();
        e.stopPropagation();

        // The current key is prevented before insertion, so only the
        // already-typed prefix of the keyword (as actually typed, preserving
        // case) needs removing.
        await deleteTypedChars(el, buffer.slice(-kw.length, -1));

        if (BUTTON_TRIGGERS[kw]) {
          const ok = clickWirisButton(el, BUTTON_TRIGGERS[kw]);
          if (!ok) {
            // Fallback: at least insert the unicode glyph so typing isn't silently lost
            document.execCommand('insertText', false, '√');
          }
        } else {
          document.execCommand('insertText', false, REPLACEMENTS[kw]);
        }

        buffer = '';
        break;
      }
    }
  }, true);
})();
