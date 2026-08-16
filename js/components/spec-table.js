"use strict";

// Классический script, не type="module" — см. комментарий в burger-menu.js.
window.DZVA = window.DZVA || {};

// Прогрессивное раскрытие таблицы характеристик: часть строк скрыта атрибутом
// hidden, кнопка их показывает/прячет (см. claude_development_t_z.md, шаг 5).
window.DZVA.initSpecTable = function initSpecTable() {
  const toggle = document.querySelector("[data-spec-toggle]");
  if (!toggle) return;

  const wrap = toggle.closest("[data-spec-table]");
  const label = toggle.querySelector("[data-spec-toggle-label]");
  const extraRows = wrap ? wrap.querySelectorAll(".spec-table__row--extra") : [];
  if (!extraRows.length || !label) return;

  const labelShow = label.textContent.trim();
  const labelHide = toggle.getAttribute("data-label-collapse") || "Свернуть характеристики";

  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    extraRows.forEach((row) => {
      row.hidden = expanded;
    });
    toggle.setAttribute("aria-expanded", String(!expanded));
    label.textContent = expanded ? labelShow : labelHide;
  });
};
