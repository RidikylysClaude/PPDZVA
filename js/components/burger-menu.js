"use strict";

// Классический script (не type="module") — ES-модули блокируются CORS при открытии
// сайта напрямую через file://, без локального сервера. Общее пространство имён: window.DZVA.
window.DZVA = window.DZVA || {};

window.DZVA.initBurgerMenu = function initBurgerMenu() {
  const burger = document.querySelector(".site-nav__burger");
  const list = document.querySelector(".site-nav__list");
  if (!burger || !list) return;

  function closeMenu() {
    burger.setAttribute("aria-expanded", "false");
    list.classList.remove("site-nav__list--open");
  }

  burger.addEventListener("click", () => {
    const isOpen = burger.getAttribute("aria-expanded") === "true";
    burger.setAttribute("aria-expanded", String(!isOpen));
    list.classList.toggle("site-nav__list--open", !isOpen);
  });

  list.querySelectorAll(".site-nav__link").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // Esc закрывает меню и возвращает фокус на бургер — тот же паттерн, что у
  // попапа/лайтбокса (см. popup.js, lightbox.js).
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (burger.getAttribute("aria-expanded") !== "true") return;
    closeMenu();
    burger.focus();
  });
};
