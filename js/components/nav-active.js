"use strict";

// Подсветка активного пункта меню: снимается с "Главная" при переходе по ссылке
// и следует за прокруткой при ручном скролле. Работает только с якорными ссылками
// (index.html#hero и т.п.), указывающими на секции текущей страницы — "Аналоги"
// (отдельная страница) в отслеживание не попадает.
window.DZVA.initNavActive = function initNavActive() {
  const links = Array.from(document.querySelectorAll(".site-nav__link"));
  if (!links.length) return;

  const sections = [];
  links.forEach((link) => {
    const url = new URL(link.getAttribute("href"), window.location.href);
    if (url.pathname !== window.location.pathname || !url.hash) return;
    const section = document.querySelector(url.hash);
    if (section) sections.push({ section, link });
  });
  if (!sections.length) return;

  sections.sort((a, b) => a.section.offsetTop - b.section.offsetTop);

  const HEADER_OFFSET = 96;

  function setActive(activeLink) {
    links.forEach((link) => {
      link.classList.toggle("site-nav__link--active", link === activeLink);
    });
  }

  function updateFromScroll() {
    const scrollY = window.scrollY || window.pageYOffset;
    const atBottom = window.innerHeight + scrollY >= document.documentElement.scrollHeight - 2;

    if (atBottom) {
      setActive(sections[sections.length - 1].link);
      return;
    }

    let current = sections[0].link;
    sections.forEach(({ section, link }) => {
      if (section.getBoundingClientRect().top - HEADER_OFFSET <= 0) {
        current = link;
      }
    });
    setActive(current);
  }

  links.forEach((link) => {
    link.addEventListener("click", () => {
      const url = new URL(link.getAttribute("href"), window.location.href);
      if (url.pathname === window.location.pathname && url.hash) {
        setActive(link);
      }
    });
  });

  // Без троттлинга через requestAnimationFrame: в некоторых окружениях (например,
  // headless-браузер без активного рендер-цикла) rAF может не сработать вовсе,
  // из-за чего подсветка "зависает". Список секций короткий (5-6 штук), поэтому
  // прямой вызов на каждый scroll не создаёт заметной нагрузки.
  window.addEventListener("scroll", updateFromScroll, { passive: true });
  window.addEventListener("resize", updateFromScroll);

  updateFromScroll();
};
