"use strict";

// Классический script, не type="module" — см. комментарий в burger-menu.js.
window.DZVA = window.DZVA || {};

window.DZVA.YANDEX_METRIKA_ID = 111879487;

// Без сбора персональных данных и форм — только обезличенная статистика посещений
// и переходов по товарам (см. claude_development_t_z.md, решение 9).
window.DZVA.initAnalytics = function initAnalytics() {
  var id = window.DZVA.YANDEX_METRIKA_ID;
  if (!id) return;

  /* eslint-disable */
  (function (m, e, t, r, i, k, a) {
    m[i] =
      m[i] ||
      function () {
        (m[i].a = m[i].a || []).push(arguments);
      };
    m[i].l = 1 * new Date();
    (k = e.createElement(t)),
      (a = e.getElementsByTagName(t)[0]),
      (k.async = 1),
      (k.src = r),
      a.parentNode.insertBefore(k, a);
  })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
  /* eslint-enable */

  // Только стандартные, официально задокументированные опции — ssr/url/referrer
  // из исходного сниппета (для SPA/SSR-сценариев, нам не нужны на статическом
  // многостраничном сайте) убраны: подозреваются в подавлении автоматической
  // отправки хита о просмотре страницы (проверка счётчика в кабинете Метрики
  // не находила счётчик даже при полностью корректной загрузке tag.js).
  window.ym(id, "init", {
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: false,
  });
};
