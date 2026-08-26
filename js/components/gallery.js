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
    const thumbs = Array.from(gallery.querySelectorAll("[data-gallery-thumb]"));
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

    // Стрелки в рамке фото просто "нажимают" нужную миниатюру — переиспользуют
    // обработчик клика выше и синхронизацию с лайтбоксом (см. lightbox.js), не
    // дублируя логику подмены src/активного класса.
    const prevBtn = gallery.querySelector("[data-gallery-prev]");
    const nextBtn = gallery.querySelector("[data-gallery-next]");
    if (!prevBtn || !nextBtn) return;

    if (thumbs.length < 2) {
      prevBtn.hidden = true;
      nextBtn.hidden = true;
      return;
    }

    function step(delta) {
      const activeIndex = thumbs.findIndex((t) => t.classList.contains("product-viewer__thumb--active"));
      const nextIndex = ((activeIndex === -1 ? 0 : activeIndex) + delta + thumbs.length) % thumbs.length;
      thumbs[nextIndex].click();
    }

    // stopPropagation — иначе клик всплывает до .product-viewer__stage, на котором
    // lightbox.js вешает свой обработчик открытия лайтбокса (см. lightbox.js).
    prevBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      step(-1);
    });
    nextBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      step(1);
    });
  });
};
