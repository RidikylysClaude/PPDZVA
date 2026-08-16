"use strict";

// Классический script, не type="module" — см. комментарий в burger-menu.js.
window.DZVA = window.DZVA || {};

// Живой фильтр карточек продукции по имени/коду/подзаголовку — без бэкенда,
// просто сравнение текста карточки с запросом (см. claude_development_t_z.md, раздел 3а).
window.DZVA.initProductSearch = function initProductSearch() {
  const input = document.getElementById("product-search");
  const cards = document.querySelectorAll(".product-card");
  const emptyState = document.querySelector("[data-search-empty]");
  if (!input || !cards.length) return;

  input.addEventListener("input", () => {
    const query = input.value.trim().toLowerCase();
    let visibleCount = 0;

    cards.forEach((card) => {
      const matches = !query || card.textContent.toLowerCase().includes(query);
      card.classList.toggle("product-card--hidden", !matches);
      if (matches) visibleCount += 1;
    });

    document.querySelectorAll(".products__group-title").forEach((title) => {
      const grid = title.nextElementSibling;
      if (!grid) return;
      const groupHasVisible = Array.from(grid.querySelectorAll(".product-card")).some(
        (card) => !card.classList.contains("product-card--hidden")
      );
      title.classList.toggle("product-card--hidden", !groupHasVisible);
    });

    if (emptyState) {
      emptyState.hidden = visibleCount !== 0;
    }
  });
};
