"use strict";

// Поведение сохранено по смыслу как в исходном сайте: кнопка "Оставить заявку"
// не отправляет данные, а показывает попап с телефоном/почтой (см. claude_development_t_z.md, п.3).
// Классический script, не type="module" — см. комментарий в burger-menu.js.
window.DZVA = window.DZVA || {};

window.DZVA.initPopup = function initPopup() {
  const popup = document.getElementById("popup");
  const overlay = document.getElementById("overlay");
  if (!popup || !overlay) return;

  let lastFocused = null;
  const trapTabKey = window.DZVA.trapTabKey(popup);

  function open(event) {
    event.preventDefault();
    lastFocused = document.activeElement;
    popup.classList.add("active");
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
    popup.addEventListener("keydown", trapTabKey);
    window.DZVA.focusFirst(popup);
  }

  function close() {
    popup.classList.remove("active");
    overlay.classList.remove("active");
    document.body.style.overflow = "";
    popup.removeEventListener("keydown", trapTabKey);
    if (lastFocused) lastFocused.focus();
  }

  // querySelectorAll, а не querySelector — на странице несколько кнопок "Оставить заявку"
  // (шапка, hero, футер), в исходном коде это был баг: срабатывала только первая.
  document.querySelectorAll("[data-popup-open]").forEach((el) => {
    el.addEventListener("click", open);
  });

  document.querySelectorAll("[data-popup-close]").forEach((el) => {
    el.addEventListener("click", close);
  });

  overlay.addEventListener("click", close);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close();
  });
};
