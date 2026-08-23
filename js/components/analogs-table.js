"use strict";

// Классический script, не type="module" — см. комментарий в burger-menu.js.
window.DZVA = window.DZVA || {};

// Живой фильтр строк таблицы аналогов по коду/бренду/категории/продукту — без
// бэкенда, тот же паттерн, что product-search.js (см. claude_development_t_z.md, раздел 3а).
window.DZVA.initAnalogsTable = function initAnalogsTable() {
  const input = document.getElementById("analogs-search");
  const rows = document.querySelectorAll(".analogs-table__row");
  const emptyState = document.querySelector("[data-analogs-empty]");
  const tableWrap = document.querySelector("[data-analogs-table-wrap]");
  if (!input || !rows.length) return;

  input.addEventListener("input", () => {
    const query = input.value.trim().toLowerCase();
    let visibleCount = 0;

    rows.forEach((row) => {
      const matches = !query || row.textContent.toLowerCase().includes(query);
      row.classList.toggle("analogs-table__row--hidden", !matches);
      if (matches) visibleCount += 1;
    });

    if (emptyState) emptyState.hidden = visibleCount !== 0;
    if (tableWrap) tableWrap.hidden = visibleCount === 0;
  });
};
