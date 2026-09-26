// Estructura de la página. Se prerenderiza en build (ES) y se reutiliza en runtime.
import type { Lang } from '../types.ts';
import { CVS, UI } from '../i18n.ts';
import { esc, PDF_HREF } from './html.ts';
import { renderRecruiter } from './recruiter.ts';
import { renderScene } from './scene.ts';
import { renderApps, renderContact, renderInfo, renderNews, renderPreview, renderProductHead, renderStats, renderVersions } from './product.ts';
import { monogram } from './squircle.ts';

// Iconos del conmutador de tema (trazos propios, estilo línea).
const SUN = `<svg class="theme-icon-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6"/></svg>`;
const MOON = `<svg class="theme-icon-dark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="M20.2 14.6A8.5 8.5 0 0 1 9.4 3.8a8.5 8.5 0 1 0 10.8 10.8Z"/></svg>`;

export function renderShell(lang: Lang): string {
  const ui = UI[lang];
  const cv = CVS[lang];
  return `<a class="skip" href="#main" data-t="skip">${lang === 'es' ? 'Saltar al contenido' : 'Skip to content'}</a>
<header class="bar">
  <div class="bar-inner">
    <a class="bar-brand" href="#top">${monogram(28)}<span class="bar-name">${esc(cv.basics.name)}</span></a>
    <div class="bar-actions">
      <button id="lang-toggle" class="btn-icon" type="button" lang="${lang === 'es' ? 'en' : 'es'}"><span class="sr-only">${esc(ui.switchLang)}: </span>${esc(ui.switchLangShort)}</button>
      <button id="theme-toggle" class="btn-icon" type="button" aria-label="${esc(ui.themeDark)}" data-label-dark="${esc(ui.themeDark)}" data-label-light="${esc(ui.themeLight)}">${SUN}${MOON}</button>
      <button id="recruiter-toggle" class="btn btn-secondary btn-sm bar-cta" type="button" aria-pressed="false" aria-controls="recruiter-view">${esc(ui.recruiterMode)}</button>
      <a id="pdf-link" class="btn btn-primary btn-sm bar-cta" href="${PDF_HREF}" download aria-label="${esc(ui.downloadPdf)}"><span class="lbl-long">${esc(ui.downloadPdf.replace(/\s*CV$/, ''))} </span>CV</a>
    </div>
  </div>
</header>
<main id="main" tabindex="-1">
  <div id="scene-view" class="product">
    ${renderProductHead(lang)}
    ${renderStats(lang)}
    <section class="hero" aria-labelledby="hero-title">
      <h2 id="hero-title" class="sr-only">${esc(ui.product.sceneTitle)}</h2>
      <p class="sr-only">${esc(ui.sceneLabel)}</p>
      ${renderScene(lang)}
    </section>
    ${renderApps(lang)}
    ${renderPreview(lang)}
    ${renderNews(lang)}
    ${renderVersions(lang)}
    ${renderInfo(lang)}
    ${renderContact(lang)}
  </div>
  <section id="recruiter-view" hidden>
    ${renderRecruiter(lang)}
  </section>
</main>
<dialog id="panel" aria-labelledby="panel-title">
  <div class="panel-inner">
    <header class="panel-head">
      <p class="panel-kicker" id="panel-kicker"></p>
      <h2 id="panel-title"></h2>
      <button class="panel-close" type="button" aria-label="${esc(ui.close)}" data-close>✕</button>
    </header>
    <div class="panel-body" id="panel-body"></div>
  </div>
</dialog>
<p id="hint" class="hint" role="status">${esc(ui.hint)}</p>
<footer class="foot"><p data-t="footer">© ${new Date().getFullYear()} ${esc(cv.basics.name)} · ${esc(ui.footer)}</p></footer>`;
}
