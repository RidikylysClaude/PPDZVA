"use strict";

// Порядок подключения в HTML: burger-menu.js, popup.js, product-search.js, gallery.js,
// spec-table.js, analytics.js, затем main.js. Init-функции безопасны на страницах без
// соответствующей разметки — каждая проверяет наличие своих элементов и выходит, если их нет.
document.addEventListener("DOMContentLoaded", function () {
  window.DZVA.initBurgerMenu();
  window.DZVA.initPopup();
  window.DZVA.initAnalytics();
  window.DZVA.initProductSearch();
  window.DZVA.initGallery();
  window.DZVA.initSpecTable();
});
