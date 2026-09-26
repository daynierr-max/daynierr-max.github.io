// Fija el tema antes del primer pintado (evita el destello del tema equivocado).
(function () {
  var t = null;
  try { t = localStorage.getItem('cv-theme'); } catch (e) {}
  if (t !== 'light' && t !== 'dark') t = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', t);
})();
