// Modo reclutador: el CV clásico, en HTML semántico y una sola columna.
import type { Lang } from '../types.ts';
import { CVS, UI } from '../i18n.ts';
import { certItem, contactList, esc, jobItem, projectItem, skillGroups } from './html.ts';

export function renderRecruiter(lang: Lang): string {
  const cv = CVS[lang];
  const ui = UI[lang];
  const h = ui.headings;
  return `<article class="sheet" aria-labelledby="r-title">
  <header class="sheet-head">
    <h2 id="r-title" class="sheet-name" tabindex="-1">${esc(cv.basics.name)}</h2>
    <p class="sheet-headline">${esc(cv.basics.headline)}</p>
    ${contactList(cv)}
    <p class="chips" aria-label="${esc(h.availability)}">${cv.basics.availability.map((a) => `<span class="chip">${esc(a)}</span>`).join('')}</p>
  </header>
  <section aria-labelledby="r-summary"><h2 id="r-summary">${esc(h.summary)}</h2><p>${esc(cv.summary)}</p></section>
  <section aria-labelledby="r-exp"><h2 id="r-exp">${esc(h.experience)}</h2><ol class="list">${cv.experience.map(jobItem).join('')}</ol></section>
  <section aria-labelledby="r-skills"><h2 id="r-skills">${esc(h.skills)}</h2>${skillGroups(cv.skills)}</section>
  <section aria-labelledby="r-proj"><h2 id="r-proj">${esc(h.projects)}</h2><ul class="list">${cv.projects.map((p) => projectItem(p, lang)).join('')}</ul></section>
  <section aria-labelledby="r-certs"><h2 id="r-certs">${esc(h.certs)}</h2><ul class="list">${cv.certifications.map((c) => certItem(c, lang)).join('')}</ul></section>
  <section aria-labelledby="r-edu"><h2 id="r-edu">${esc(h.education)}</h2><ul class="list">${cv.education
    .map(
      (e) =>
        `<li class="item"><h3 class="item-title">${esc(e.degree)}</h3><p class="meta">${esc(
          [e.school, e.detail, e.period].filter(Boolean).join(' · '),
        )}</p></li>`,
    )
    .join('')}</ul></section>
  <section aria-labelledby="r-lang"><h2 id="r-lang">${esc(h.languages)}</h2><ul class="list inline">${cv.languages
    .map((l) => `<li><strong>${esc(l.language)}:</strong> ${esc(l.level)}</li>`)
    .join('')}</ul></section>
</article>`;
}
