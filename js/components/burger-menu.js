"use strict";

// Классический script (не type="module") — ES-модули блокируются CORS при открытии
// сайта напрямую через file://, без локального сервера. Общее пространство имён: window.DZVA.
window.DZVA = window.DZVA || {};

window.DZVA.initBurgerMenu = function initBurgerMenu() {
  const burger = document.querySelector(".site-nav__burger");
  const list = document.querySelector(".site-nav__list");
  if (!burger || !list) return;

  burger.addEventListener("click", () => {
    const isOpen = burger.getAttribute("aria-expanded") === "true";
    burger.setAttribute("aria-expanded", String(!isOpen));
    list.classList.toggle("site-nav__list--open", !isOpen);
  });

  list.querySelectorAll(".site-nav__link").forEach((link) => {
    link.addEventListener("click", () => {
      burger.setAttribute("aria-expanded", "false");
      list.classList.remove("site-nav__list--open");
    });
  });
};
