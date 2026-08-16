"use strict";

// Классический script, не type="module" — см. комментарий в burger-menu.js.
window.DZVA = window.DZVA || {};

// Fallback-галерея для карточки товара: используется, пока для продукта нет
// GLB-модели для <model-viewer> (см. claude_development_t_z.md, шаг 7). Просто
// подмена src главного изображения по клику на миниатюру, без внешних библиотек.
window.DZVA.initGallery = function initGallery() {
  const galleries = document.querySelectorAll("[data-gallery]");
  if (!galleries.length) return;

  galleries.forEach((gallery) => {
    const main = gallery.querySelector("[data-gallery-main]");
    const thumbs = gallery.querySelectorAll("[data-gallery-thumb]");
    if (!main || !thumbs.length) return;

    thumbs.forEach((thumb) => {
      thumb.addEventListener("click", () => {
        const fullSrc = thumb.getAttribute("data-full");
        const fullAlt = thumb.getAttribute("data-alt") || "";
        if (!fullSrc) return;

        main.src = fullSrc;
        main.alt = fullAlt;

        thumbs.forEach((t) => t.classList.remove("product-viewer__thumb--active"));
        thumb.classList.add("product-viewer__thumb--active");
      });
    });
  });
};
