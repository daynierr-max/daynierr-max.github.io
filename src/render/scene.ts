// Escena isométrica (fase 4) y tarjetas-objeto (vista móvil).
import type { Lang } from '../types.ts';
import { SECTION_ORDER, UI } from '../i18n.ts';
import { esc } from './html.ts';

export function renderScene(_lang: Lang): string {
  return '';
}

export function renderCards(lang: Lang): string {
  const ui = UI[lang];
  return `<ul class="cards" aria-label="${esc(ui.cardsLabel)}">${SECTION_ORDER.map((id) => {
    const s = ui.sections[id];
    return `<li><button class="card" type="button" data-open="${id}"><span class="card-kicker">${esc(s.object)}</span><span class="card-title">${esc(s.title)}</span><span class="card-teaser">${esc(s.teaser)}</span></button></li>`;
  }).join('')}</ul>`;
}
