"use strict";

// Порядок подключения в HTML: burger-menu.js, popup.js, product-search.js, gallery.js,
// lightbox.js, webui-gallery.js, spec-table.js, analogs-table.js, nav-active.js, analytics.js, затем main.js.
// Не все страницы подключают все компонентные скрипты (например, lightbox.js есть только
// на карточках товара) — поэтому вызываем через runInit, который проверяет, что init-функция
// вообще существует, а не только что она "безопасна для страниц без разметки".
function runInit(name) {
  const init = window.DZVA[name];
  if (typeof init === "function") init();
}

document.addEventListener("DOMContentLoaded", function () {
  runInit("initBurgerMenu");
  runInit("initPopup");
  runInit("initProductSearch");
  runInit("initGallery");
  runInit("initLightbox");
  runInit("initWebUIGallery");
  runInit("initSpecTable");
  runInit("initAnalogsTable");
  runInit("initNavActive");
});

// Метрика — отдельно, после полной загрузки страницы (не DOMContentLoaded): сам тег
// грузится асинхронно (k.async=1 в analytics.js), но именно вызов инициализации на
// критичном пути DOMContentLoaded конкурировал за основной поток с рендером
// (см. handoff.md, п.13 — bootup-time тега доходил до ~4с под мобильным CPU-троттлингом
// в Lighthouse). Счётчику не важно, на пару сотен мс раньше или позже он стартует.
window.addEventListener("load", function () {
  runInit("initAnalytics");
});
