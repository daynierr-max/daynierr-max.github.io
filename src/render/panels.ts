// Contenido de cada panel de la escena, generado desde el JSON del CV.
import type { Lang, SectionId } from '../types.ts';
import { CVS, UI } from '../i18n.ts';
import { certItem, contactList, esc, jobItem, PDF_HREF, projectItem, skillGroups } from './html.ts';

const pick = <T extends { id: string }>(xs: T[], ids: string[]) => xs.filter((x) => ids.includes(x.id));
const sub = (title: string, body: string) => `<section class="sub"><h3 class="sub-title">${esc(title)}</h3>${body}</section>`;

export function renderPanel(id: SectionId, lang: Lang): { kicker: string; title: string; body: string } {
  const cv = CVS[lang];
  const ui = UI[lang];
  const s = ui.sections[id];
  const h = ui.headings;
  const certs = (re: RegExp) => `<ul class="list">${cv.certifications.filter((c) => re.test(c.name + c.issuer)).map((c) => certItem(c, lang)).join('')}</ul>`;
  const projects = (ids: string[]) => `<ul class="list">${pick(cv.projects, ids).map((p) => projectItem(p, lang)).join('')}</ul>`;

  let body = '';
  switch (id) {
    case 'about':
      body = `<p class="lead">${esc(cv.basics.headline)}</p>
<p>${esc(cv.summary)}</p>
<p class="chips">${[cv.basics.location, ...cv.basics.availability].map((a) => `<span class="chip">${esc(a)}</span>`).join('')}</p>
${sub(h.languages, `<ul class="list inline">${cv.languages.map((l) => `<li><strong>${esc(l.language)}:</strong> ${esc(l.level)}</li>`).join('')}</ul>`)}`;
      break;
    case 'infra':
      body = `${skillGroups(pick(cv.skills, ['systems', 'virtualization', 'networking', 'cloud', 'itsm', 'databases']))}
${sub(h.projects, projects(['azure-lab-az104']))}
${sub(h.certs, certs(/AZ-104|IFCT/))}`;
      break;
    case 'security':
      body = `<p class="verified-badge"><span aria-hidden="true">✔</span> Google Cybersecurity Professional Certificate · ${esc(ui.verified)}</p>
${skillGroups(pick(cv.skills, ['security']))}
${sub(h.certs, certs(/Cyber|Cisco/))}`;
      break;
    case 'ai':
      body = `${skillGroups(pick(cv.skills, ['ai', 'scripting']))}
${sub(h.projects, projects(['tradingview-mcp', 'agent-skills', 'gemini-apps']))}
${sub(h.certs, certs(/Anthropic|AWS|BIG/))}`;
      break;
    case 'projects':
      body = `<ul class="list">${cv.projects.map((p) => projectItem(p, lang)).join('')}</ul>`;
      break;
    case 'experience':
      body = `<ol class="list timeline">${cv.experience.map(jobItem).join('')}</ol>`;
      break;
    case 'certs':
      body = `<ul class="list">${cv.certifications.map((c) => certItem(c, lang)).join('')}</ul>
${sub(h.education, `<ul class="list">${cv.education
        .map((e) => `<li class="item"><h3 class="item-title">${esc(e.degree)}</h3><p class="meta">${esc([e.school, e.detail, e.period].filter(Boolean).join(' · '))}</p></li>`)
        .join('')}</ul>`)}`;
      break;
    case 'contact':
      body = `<p class="lead">${esc(ui.contactLead)}</p>
${contactList(cv)}
<p class="panel-actions"><a class="btn btn-solid" href="mailto:${esc(cv.basics.email)}">${esc(ui.writeMe)}</a> <a class="btn btn-outline" href="${PDF_HREF}" download>${esc(ui.downloadPdf)}</a></p>`;
      break;
    case 'terminal':
      body = `<div class="term" data-terminal>
  <div class="term-log" role="log" aria-live="polite"><p>${esc(ui.terminal.welcome)}</p></div>
  <form class="term-line" autocomplete="off"><label for="term-input" class="term-prompt">${esc(ui.terminal.prompt)}</label><input id="term-input" name="cmd" spellcheck="false" autocapitalize="off" aria-label="${esc(ui.terminal.inputLabel)}" /></form>
</div>`;
      break;
  }
  return { kicker: s.object, title: s.title, body };
}
