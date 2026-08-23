"use strict";

// Классический script, не type="module" — см. комментарий в burger-menu.js.
window.DZVA = window.DZVA || {};

// Лайтбокс для галереи товара: открывается по клику на главное изображение,
// список слайдов строится из тех же [data-gallery-thumb] кнопок, что и обычная
// галерея (gallery.js) — разметку со списком изображений дублировать не нужно.
window.DZVA.initLightbox = function initLightbox() {
  const lightbox = document.getElementById("lightbox");
  const overlay = document.getElementById("lightbox-overlay");
  const galleryEl = document.querySelector("[data-gallery]");
  if (!lightbox || !overlay || !galleryEl) return;

  const thumbButtons = galleryEl.querySelectorAll("[data-gallery-thumb]");
  const stage = galleryEl.querySelector(".product-viewer__stage");
  const images = Array.from(thumbButtons).map((thumb) => ({
    src: thumb.getAttribute("data-full"),
    alt: thumb.getAttribute("data-alt") || "",
  }));
  if (!stage || !images.length) return;

  const stageImg = lightbox.querySelector("[data-lightbox-image]");
  const thumbsWrap = lightbox.querySelector("[data-lightbox-thumbs]");
  let currentIndex = 0;

  const lbThumbs = images.map((img, index) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "lightbox__thumb";
    btn.setAttribute("aria-label", img.alt || `Изображение ${index + 1}`);
    const thumbImg = document.createElement("img");
    thumbImg.src = img.src;
    thumbImg.alt = "";
    thumbImg.loading = "lazy";
    btn.appendChild(thumbImg);
    btn.addEventListener("click", () => show(index));
    thumbsWrap.appendChild(btn);
    return btn;
  });

  function show(index) {
    currentIndex = (index + images.length) % images.length;
    const img = images[currentIndex];
    stageImg.src = img.src;
    stageImg.alt = img.alt;
    lbThumbs.forEach((t, i) => t.classList.toggle("lightbox__thumb--active", i === currentIndex));

    // Держим основную галерею на странице в синхроне, чтобы после закрытия
    // лайтбокса там оставалось выбрано то же изображение.
    thumbButtons.forEach((t, i) => t.classList.toggle("product-viewer__thumb--active", i === currentIndex));
    const mainImg = galleryEl.querySelector("[data-gallery-main]");
    if (mainImg) {
      mainImg.src = img.src;
      mainImg.alt = img.alt;
    }
  }

  function open(index) {
    show(index);
    lightbox.classList.add("active");
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function close() {
    lightbox.classList.remove("active");
    overlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  stage.classList.add("product-viewer__stage--zoomable");
  stage.addEventListener("click", () => open(currentIndex));

  // Клики по миниатюрам основной галереи не должны сбрасывать currentIndex
  // лайтбокса на 0 — держим его в курсе, какая миниатюра сейчас активна.
  thumbButtons.forEach((thumb, index) => {
    thumb.addEventListener("click", () => {
      currentIndex = index;
    });
  });

  lightbox.querySelectorAll("[data-lightbox-close]").forEach((el) => el.addEventListener("click", close));
  const lbPrev = lightbox.querySelector("[data-lightbox-prev]");
  const lbNext = lightbox.querySelector("[data-lightbox-next]");
  // При одном фото (см. products/digmat.html) листать нечего — прячем стрелки
  // и миниатюры, как gallery.js уже делает для стрелок в рамке фото.
  if (images.length < 2) {
    lbPrev.hidden = true;
    lbNext.hidden = true;
    thumbsWrap.hidden = true;
  } else {
    lbPrev.addEventListener("click", () => show(currentIndex - 1));
    lbNext.addEventListener("click", () => show(currentIndex + 1));
  }
  overlay.addEventListener("click", close);

  // .lightbox сам по себе — fixed на весь экран поверх .overlay (см. z-index в
  // токенах), поэтому клик по "фону" на самом деле попадает в .lightbox, а не
  // в overlay ниже — без этого обработчика оверлей никогда не получает клик и
  // закрыть лайтбокс можно было только крестиком/Esc. Закрываем по любому
  // клику вне картинки, кроме стрелок и миниатюр.
  lightbox.addEventListener("click", (event) => {
    const target = event.target;
    if (target.closest("[data-lightbox-image]")) return;
    if (target.closest(".lightbox__nav")) return;
    if (target.closest(".lightbox__thumb")) return;
    close();
  });

  document.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("active")) return;
    if (event.key === "Escape") close();
    if (event.key === "ArrowLeft") show(currentIndex - 1);
    if (event.key === "ArrowRight") show(currentIndex + 1);
  });
};
