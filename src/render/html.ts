import type { Certification, CV, Job, Lang, Project, SkillGroup } from '../types.ts';
import { UI } from '../i18n.ts';

const ESC: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const esc = (s: string): string => s.replace(/[&<>"']/g, (c) => ESC[c]);

export const GITHUB_USER = 'daynierr-max';
export const PDF_HREF = '/Daynier_Rodriguez_CV2026.pdf';

const ext = (href: string, label: string, cls = ''): string =>
  `<a${cls ? ` class="${cls}"` : ''} href="${esc(href)}" target="_blank" rel="noopener">${esc(label)}</a>`;

export function repoLinks(p: Project): string[] {
  const repos = p.repo == null ? [] : Array.isArray(p.repo) ? p.repo : [p.repo];
  return repos.map((r) => ext(`https://github.com/${GITHUB_USER}/${r}`, r));
}

export function projectItem(p: Project, lang: Lang): string {
  const ui = UI[lang];
  const links = [...(p.url ? [ext(p.url, p.url.replace(/^https?:\/\//, ''))] : []), ...repoLinks(p)];
  return `<li class="item">
  <h3 class="item-title">${esc(p.name)}</h3>
  <p>${esc(p.description)}</p>
  ${p.tech.length ? `<ul class="tags" aria-label="Stack">${p.tech.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}
  ${links.length ? `<p class="links"><span class="sr-only">${esc(p.url ? ui.site : ui.repo)}: </span>${links.join(' · ')}</p>` : ''}
</li>`;
}

export function jobItem(j: Job): string {
  return `<li class="item job">
  <h3 class="item-title">${esc(j.role)} <span class="at">· ${esc(j.company)}</span></h3>
  <p class="meta"><time datetime="${esc(j.start)}">${esc(j.period.split('–')[0].trim())}</time> – <time datetime="${esc(j.end)}">${esc(j.period.split('–')[1]?.trim() ?? '')}</time> · ${esc(j.location)}</p>
  ${j.context ? `<p class="context">${esc(j.context)}</p>` : ''}
  <ul class="bullets">${j.highlights.map((h) => `<li>${esc(h)}</li>`).join('')}</ul>
</li>`;
}

export function skillGroups(groups: SkillGroup[]): string {
  return `<dl class="skills">${groups
    .map((g) => `<div><dt>${esc(g.name)}</dt><dd>${g.items.map(esc).join(', ')}</dd></div>`)
    .join('')}</dl>`;
}

export function certItem(c: Certification, lang: Lang): string {
  const pending = /prepar|in preparation/i.test(c.status);
  const meta = [c.issuer, c.date].filter(Boolean).join(' · ');
  return `<li class="item cert${pending ? ' pending' : ''}">
  <h3 class="item-title">${esc(c.name)}</h3>
  ${c.detail ? `<p>${esc(c.detail)}</p>` : ''}
  <p class="meta">${esc(meta)}${pending ? ` · <strong>${esc(c.status)}</strong>` : ''}${
    c.credentialUrl ? ` · ${ext(c.credentialUrl, UI[lang].verified)}` : ''
  }</p>
</li>`;
}

export function contactList(cv: CV): string {
  return `<ul class="contact-list">
  <li><a href="mailto:${esc(cv.basics.email)}">${esc(cv.basics.email)}</a></li>
  ${cv.basics.profiles.map((p) => `<li>${ext(p.url, p.label)}</li>`).join('')}
  <li>${esc(cv.basics.location)}</li>
</ul>`;
}
