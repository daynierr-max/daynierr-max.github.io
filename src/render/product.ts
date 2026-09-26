// Portada v2: el perfil como la ficha de una app. Todo el contenido sale de src/data/cv.*.json.
import type { CV, Job, Lang, Project } from '../types.ts';
import { CVS, UI } from '../i18n.ts';
import { esc, GITHUB_USER, PDF_HREF } from './html.ts';
import { appIcon, ICON_ORDER } from './icons.ts';
import { monogram } from './squircle.ts';

// ── Datos derivados (sin inventar: todo se calcula a partir del JSON) ──
const months = (j: Job) => {
  const [sy, sm] = j.start.split('-').map(Number);
  const [ey, em] = j.end.split('-').map(Number);
  return (ey - sy) * 12 + (em - sm) + 1;
};
/** Años de experiencia sumando la duración real de cada puesto, redondeado hacia abajo. */
export const experienceYears = (cv: CV) => Math.floor(cv.experience.reduce((a, j) => a + months(j), 0) / 12);
const isPending = (status: string) => /prepar/i.test(status);
export const earnedCerts = (cv: CV) => cv.certifications.filter((c) => !isPending(c.status));
const LANG_CODE: Record<string, string> = { Español: 'ES', Spanish: 'ES', Inglés: 'EN', English: 'EN' };
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const headlineParts = (cv: CV) => cv.basics.headline.split('|').map((s) => s.trim());

const ext = (href: string, label: string, cls = '') =>
  `<a${cls ? ` class="${cls}"` : ''} href="${esc(href)}" target="_blank" rel="noopener">${label}</a>`;

// Pequeños iconos de línea (propios, sin marcas)
const ICON = {
  mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/></svg>',
  person: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8.5" r="3.5"/><path d="M5 19.5c1.2-3.4 4-5 7-5s5.8 1.6 7 5"/></svg>',
  code: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8.5 7-5 5 5 5M15.5 7l5 5-5 5"/></svg>',
  chevL: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14.5 6-6 6 6 6"/></svg>',
  chevR: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9.5 6 6 6-6 6"/></svg>',
};

// ── 2 · Cabecera de producto ──
export function renderProductHead(lang: Lang): string {
  const cv = CVS[lang];
  const p = UI[lang].product;
  return `<header class="product-head" id="top">
  <div class="ph-icon">${monogram(160)}</div>
  <div class="ph-main">
    <h1 class="ph-name">${esc(cv.basics.name)}</h1>
    <p class="ph-sub">${esc(cv.basics.headline)}</p>
    <div class="ph-actions">
      <a class="btn btn-primary btn-lg" href="${PDF_HREF}" download data-cta>${esc(p.getCv)}</a>
      <button class="btn btn-secondary btn-lg" type="button" data-read>${esc(p.readNow)}</button>
      <span class="ph-note">${esc(p.getCvSub)}</span>
    </div>
  </div>
  <div class="ph-desc">
    <p id="ph-desc-text" class="ph-desc-text">${esc(cv.summary)}</p>
    <button class="btn-more" type="button" data-more aria-expanded="false" aria-controls="ph-desc-text" data-more-label="${esc(p.more)}" data-less-label="${esc(p.less)}">${esc(p.more)}</button>
  </div>
</header>`;
}

// ── 3 · Fila de datos clave ──
export function renderStats(lang: Lang): string {
  const cv = CVS[lang];
  const s = UI[lang].product.stats;
  const [city, country] = cv.basics.location.split(',').map((x) => x.trim());
  const langs = cv.languages.map((l) => LANG_CODE[l.language] ?? l.language.slice(0, 2).toUpperCase());
  const levels = cv.languages.map((l) => cap(l.level.split(/[ (]/)[0]));
  const avail = cv.basics.availability.find((a) => /inmediat|immediat/i.test(a)) ?? cv.basics.availability[0];
  const availValue = cap(avail.replace(/^(disponibilidad|available)\s+/i, ''));
  const permit = cv.basics.availability.find((a) => a !== avail) ?? '';
  const stat = (label: string, value: string, sub: string) =>
    `<li><span class="st-label">${esc(label)}</span><span class="st-value">${esc(value)}</span><span class="st-sub">${esc(sub)}</span></li>`;
  return `<ul class="stats" aria-label="${esc(UI[lang].headings.summary)}">
  ${stat(s.experience, `${experienceYears(cv)}+`, `${s.years} · ${s.yearsSub}`)}
  ${stat(s.certs, String(earnedCerts(cv).length), s.certsSub)}
  ${stat(s.location, city, country ?? '')}
  ${stat(s.languages, langs.join(' · '), levels.join(' · '))}
  ${stat(s.availability, availValue, permit)}
</ul>`;
}

// ── 5 · Estantería de apps ──
export function renderApps(lang: Lang): string {
  const ui = UI[lang];
  return `<section class="sec apps" aria-labelledby="apps-title">
  <h2 id="apps-title" class="sec-title">${esc(ui.product.appsTitle)}</h2>
  <ul class="shelf" aria-label="${esc(ui.product.appsLabel)}">${ICON_ORDER.map((id) => {
    const s = ui.sections[id];
    return `<li><button class="app" type="button" data-open="${id}" aria-label="${esc(`${s.title}: ${s.teaser}`)}">${appIcon(id, 88)}<span class="app-name">${esc(s.title)}</span></button></li>`;
  }).join('')}</ul>
</section>`;
}

// ── 6 · Vista previa (proyectos) ──
const ART = [
  ['#fb923c', '#db2777'],
  ['#22d3ee', '#0f766e'],
  ['#3b82f6', '#1e3a8a'],
  ['#8b5cf6', '#4338ca'],
  ['#38bdf8', '#1d4ed8'],
];

function projectLinks(p: Project, lang: Lang): string {
  const t = UI[lang].product;
  const repos = p.repo == null ? [] : Array.isArray(p.repo) ? p.repo : [p.repo];
  const links: string[] = [];
  if (p.url) links.push(ext(p.url, `${esc(t.site)} ›`, 'link-more'));
  if (repos.length === 1) links.push(ext(`https://github.com/${GITHUB_USER}/${repos[0]}`, `${esc(t.github)} ›`, 'link-more'));
  if (repos.length > 1)
    links.push(`<span class="link-group">GitHub: ${repos.map((r) => ext(`https://github.com/${GITHUB_USER}/${r}`, esc(r))).join(' · ')}</span>`);
  return links.length ? `<p class="pcard-links">${links.join('')}</p>` : '';
}

function projectCard(p: Project, i: number, lang: Lang): string {
  const [a, b] = ART[i % ART.length];
  const title = p.url ? p.url.replace(/^https?:\/\//, '') : Array.isArray(p.repo) ? p.repo[0] : (p.repo ?? p.id);
  return `<li class="pcard" style="--a:${a};--b:${b}">
  <div class="pcard-art" aria-hidden="true">
    <div class="pcard-window"><span class="dots"><i></i><i></i><i></i></span><span class="pcard-wtitle">${esc(title)}</span>
      <span class="bars"><i style="width:72%"></i><i style="width:54%"></i><i style="width:83%"></i><i style="width:40%"></i></span></div>
    <span class="pcard-chips">${p.tech.slice(0, 3).map((t) => `<b>${esc(t)}</b>`).join('')}</span>
  </div>
  <div class="pcard-body">
    <h3 class="pcard-title">${esc(p.name)}</h3>
    <p class="pcard-desc">${esc(p.description)}</p>
    ${p.tech.length ? `<ul class="tags" aria-label="Stack">${p.tech.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}
    ${projectLinks(p, lang)}
  </div>
</li>`;
}

export function renderPreview(lang: Lang): string {
  const cv = CVS[lang];
  const t = UI[lang].product;
  return `<section class="sec preview" aria-labelledby="preview-title">
  <div class="sec-head"><h2 id="preview-title" class="sec-title">${esc(t.preview)}</h2>
    <div class="carousel-nav"><button class="nav-btn" type="button" data-carousel="-1" aria-label="${esc(t.prev)}" aria-controls="carousel">${ICON.chevL}</button><button class="nav-btn" type="button" data-carousel="1" aria-label="${esc(t.next)}" aria-controls="carousel">${ICON.chevR}</button></div>
  </div>
  <ul class="carousel" id="carousel" tabindex="0" aria-label="${esc(t.preview)}">${cv.projects.map((p, i) => projectCard(p, i, lang)).join('')}</ul>
</section>`;
}

// ── 7 · Novedades ──
export function renderNews(lang: Lang): string {
  const cv = CVS[lang];
  const t = UI[lang].product;
  const study = cv.education.find((e) => /curso|progress/i.test(e.period)) ?? cv.education[0];
  const pending = cv.certifications.find((c) => isPending(c.status));
  const featured = cv.projects[0];
  const item = (label: string, title: string, meta: string) =>
    `<li><span class="news-label">${esc(label)}</span><h3 class="news-title">${esc(title)}</h3><p class="news-meta">${esc(meta)}</p></li>`;
  return `<section class="sec news" aria-labelledby="news-title">
  <div class="sec-head"><h2 id="news-title" class="sec-title">${esc(t.news)}</h2><span class="sec-meta">${esc(t.version)}</span></div>
  <ul class="news-list">
    ${item(t.newsItems.study, study.degree, [study.school, study.detail, study.period].filter(Boolean).join(' · '))}
    ${pending ? item(t.newsItems.cert, pending.name, [pending.issuer, pending.status].filter(Boolean).join(' · ')) : ''}
    ${item(t.newsItems.project, featured.name, featured.description)}
  </ul>
</section>`;
}

// ── 8 · Historial de versiones (experiencia) ──
export function renderVersions(lang: Lang): string {
  const cv = CVS[lang];
  const t = UI[lang].product;
  return `<section class="sec versions" aria-labelledby="versions-title">
  <h2 id="versions-title" class="sec-title">${esc(t.versions)}</h2>
  <ol class="version-list">${cv.experience
    .map(
      (j) => `<li class="version">
    <div class="v-head"><span class="v-tag">v${esc(j.start.slice(0, 4))}</span><h3 class="v-company">${esc(j.company)}</h3><span class="v-date">${esc(j.period)}</span></div>
    <p class="v-role">${esc(j.role)} · ${esc(j.location)}</p>
    ${j.context ? `<p class="v-context">${esc(j.context)}</p>` : ''}
    <ul class="v-notes">${j.highlights.slice(0, 3).map((h) => `<li>${esc(h)}</li>`).join('')}</ul>
  </li>`,
    )
    .join('')}</ol>
</section>`;
}

// ── 9 · Información ──
export function renderInfo(lang: Lang): string {
  const cv = CVS[lang];
  const t = UI[lang].product;
  const r = t.infoRows;
  const parts = headlineParts(cv);
  const systems = cv.skills.find((s) => s.id === 'systems')?.items ?? [];
  const compat = [systems.find((x) => /windows server/i.test(x)), systems.find((x) => /^linux/i.test(x)), systems.find((x) => /365/.test(x)), parts.find((x) => /azure/i.test(x))].filter(
    Boolean,
  ) as string[];
  const row = (k: string, v: string) => `<div><dt>${esc(k)}</dt><dd>${v}</dd></div>`;
  return `<section class="sec info" aria-labelledby="info-title">
  <h2 id="info-title" class="sec-title">${esc(t.info)}</h2>
  <dl class="info-list">
    ${row(r.provider, esc(cv.basics.name))}
    ${row(r.category, esc(parts[0]))}
    ${row(r.compatibility, esc(compat.join(', ')))}
    ${row(r.languages, cv.languages.map((l) => `${esc(l.language)} (${esc(l.level)})`).join(', '))}
    ${row(r.location, esc(cv.basics.location))}
    ${row(r.availability, esc(cv.basics.availability.join(' · ')))}
    ${row(r.size, '<span data-bundle-size>__BUNDLE_SIZE__</span>')}
    ${row(r.built, esc(t.builtValue))}
  </dl>
</section>`;
}

// ── 10 · Contacto ──
export function renderContact(lang: Lang): string {
  const cv = CVS[lang];
  const ui = UI[lang];
  const t = ui.product;
  const li = cv.basics.profiles.find((p) => p.network === 'LinkedIn');
  const gh = cv.basics.profiles.find((p) => p.network === 'GitHub');
  const row = (icon: string, label: string, value: string) =>
    `<span class="cr-icon">${icon}</span><span class="cr-text"><span class="cr-label">${esc(label)}</span><span class="cr-value">${esc(value)}</span></span><span class="cr-chev" aria-hidden="true">›</span>`;
  return `<section class="sec contact-card" id="contacto" aria-labelledby="contact-title">
  <h2 id="contact-title" class="sec-title">${esc(t.contact)}</h2>
  <p class="contact-lead">${esc(ui.contactLead)}</p>
  <ul class="contact-rows">
    <li><a href="mailto:${esc(cv.basics.email)}">${row(ICON.mail, 'Email', cv.basics.email)}</a></li>
    ${li ? `<li>${ext(li.url, row(ICON.person, li.network, li.label))}</li>` : ''}
    ${gh ? `<li>${ext(gh.url, row(ICON.code, gh.network, gh.label))}</li>` : ''}
  </ul>
  <div class="contact-actions"><a class="btn btn-primary btn-lg" href="${PDF_HREF}" download data-cta>${esc(t.getCv)}</a><a class="btn btn-secondary btn-lg" href="mailto:${esc(cv.basics.email)}">${esc(ui.writeMe)}</a></div>
</section>`;
}
