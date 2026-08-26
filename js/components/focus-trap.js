"use strict";

// Классический script, не type="module" — см. комментарий в burger-menu.js.
window.DZVA = window.DZVA || {};

// Общая логика для модальных оверлеев (попап заявки, лайтбокс фото, лайтбокс
// веб-интерфейса): запереть Tab внутри диалога, пока он открыт, и вернуть фокус
// туда, откуда его открыли, при закрытии — см. claude_development_t_z.md, п.12.
window.DZVA.FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Возвращает обработчик keydown, который нужно повесить на сам диалог —
// вызывающий код сам решает, когда его включать (диалог уже открыт).
window.DZVA.trapTabKey = function trapTabKey(dialog) {
  return function handleKeydown(event) {
    if (event.key !== "Tab") return;

    const focusable = Array.from(dialog.querySelectorAll(window.DZVA.FOCUSABLE_SELECTOR)).filter(
      (el) => el.offsetParent !== null
    );
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };
};

// Фокус на первый фокусируемый элемент диалога (обычно кнопка-крестик).
// requestAnimationFrame — диалог показывается через CSS-класс (visibility/opacity
// в переходе), браузер должен успеть пересчитать стили в новом кадре, иначе
// element.focus() на только что показанном элементе иногда молча не срабатывает.
window.DZVA.focusFirst = function focusFirst(dialog) {
  requestAnimationFrame(() => {
    const first = dialog.querySelector(window.DZVA.FOCUSABLE_SELECTOR);
    if (first) first.focus();
  });
};
