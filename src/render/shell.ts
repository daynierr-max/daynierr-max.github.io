// Estructura de la página. Se prerenderiza en build (ES) y se reutiliza en runtime.
import type { Lang } from '../types.ts';
import { CVS, UI } from '../i18n.ts';
import { esc, PDF_HREF } from './html.ts';
import { renderRecruiter } from './recruiter.ts';
import { renderScene, renderCards } from './scene.ts';

export function renderShell(lang: Lang): string {
  const ui = UI[lang];
  const cv = CVS[lang];
  return `<a class="skip" href="#main" data-t="skip">${lang === 'es' ? 'Saltar al contenido' : 'Skip to content'}</a>
<header class="topbar">
  <h1 class="brand"><span class="brand-name">${esc(cv.basics.name)}</span><span class="brand-role" data-t="role">${esc(
    cv.basics.headline.split('|').slice(0, 3).join('·'),
  )}</span></h1>
  <div class="actions">
    <button id="lang-toggle" class="btn btn-ghost" type="button" lang="${lang === 'es' ? 'en' : 'es'}"><span class="sr-only">${esc(ui.switchLang)}: </span>${esc(ui.switchLangShort)}</button>
    <button id="recruiter-toggle" class="btn btn-solid" type="button" aria-pressed="false" aria-controls="recruiter-view">${esc(ui.recruiterMode)}</button>
    <a id="pdf-link" class="btn btn-outline" href="${PDF_HREF}" download aria-label="${esc(ui.downloadPdf)}"><span class="lbl-long">${esc(ui.downloadPdf.replace(/\s*PDF$/, ''))} </span>PDF</a>
  </div>
</header>
<main id="main" tabindex="-1">
  <section id="scene-view" aria-label="${esc(ui.sceneLabel)}">
    ${renderScene(lang)}
    ${renderCards(lang)}
  </section>
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
