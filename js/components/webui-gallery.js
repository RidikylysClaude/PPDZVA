"use strict";

// Классический script, не type="module" — см. комментарий в burger-menu.js.
window.DZVA = window.DZVA || {};

// Просмотр скриншотов веб-интерфейса в полный размер (секция "Wi-Fi веб-интерфейс"
// на карточке товара). В отличие от lightbox.js для фото товара, здесь каждый
// скриншот самостоятелен — открывается один в один, без стрелок и миниатюр.
window.DZVA.initWebUIGallery = function initWebUIGallery() {
  const lightbox = document.getElementById("webui-lightbox");
  const overlay = document.getElementById("webui-lightbox-overlay");
  const shots = document.querySelectorAll("[data-webui-shot]");
  if (!lightbox || !overlay || !shots.length) return;

  const stageImg = lightbox.querySelector("[data-webui-lightbox-image]");

  function open(src, alt) {
    stageImg.src = src;
    stageImg.alt = alt;
    lightbox.classList.add("active");
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function close() {
    lightbox.classList.remove("active");
    overlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  shots.forEach((shot) => {
    shot.addEventListener("click", () => {
      const fullSrc = shot.getAttribute("data-full");
      const fullAlt = shot.getAttribute("data-alt") || "";
      if (!fullSrc) return;
      open(fullSrc, fullAlt);
    });
  });

  lightbox.querySelectorAll("[data-webui-lightbox-close]").forEach((el) => el.addEventListener("click", close));
  overlay.addEventListener("click", close);

  // См. комментарий в lightbox.js — .lightbox перекрывает .overlay по z-index,
  // так что клик по "фону" нужно ловить прямо на .lightbox, иначе overlay его
  // не увидит и закрыть можно только крестиком/Esc.
  lightbox.addEventListener("click", (event) => {
    if (event.target.closest("[data-webui-lightbox-image]")) return;
    close();
  });

  document.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("active")) return;
    if (event.key === "Escape") close();
  });
};
