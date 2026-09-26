import './styles/index.css';
import type { Lang, SectionId } from './types.ts';
import { UI } from './i18n.ts';
import { renderShell } from './render/shell.ts';
import { renderPanel } from './render/panels.ts';
import { mountTerminal } from './terminal.ts';

const LANG_KEY = 'cv-lang';
const THEME_KEY = 'cv-theme';
const $ = <T extends HTMLElement>(sel: string) => document.querySelector<T>(sel)!;

let lang: Lang = 'es';
let lastTrigger: HTMLElement | null = null;

function storedLang(): Lang | null {
  const q = new URLSearchParams(location.search).get('lang');
  if (q === 'es' || q === 'en') return q;
  try {
    const v = localStorage.getItem(LANG_KEY);
    return v === 'es' || v === 'en' ? v : null;
  } catch {
    return null;
  }
}

type Theme = 'light' | 'dark';
const currentTheme = (): Theme => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');

function syncThemeButton(): void {
  const btn = document.querySelector<HTMLElement>('#theme-toggle');
  if (!btn) return;
  btn.setAttribute('aria-label', (currentTheme() === 'dark' ? btn.dataset.labelLight : btn.dataset.labelDark) ?? '');
}

function setTheme(t: Theme, persist: boolean): void {
  document.documentElement.dataset.theme = t;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', t === 'dark' ? '#000000' : '#f5f5f7');
  syncThemeButton();
  if (!persist) return;
  try {
    localStorage.setItem(THEME_KEY, t);
  } catch {
    /* sin almacenamiento: el tema no se recuerda */
  }
}

function storedTheme(): Theme | null {
  try {
    const v = localStorage.getItem(THEME_KEY);
    return v === 'light' || v === 'dark' ? v : null;
  } catch {
    return null;
  }
}

function isRecruiter(): boolean {
  return location.hash === '#cv';
}

function syncRecruiter(focus = false): void {
  const on = isRecruiter();
  $('#scene-view').hidden = on;
  $('#recruiter-view').hidden = !on;
  const btn = $('#recruiter-toggle');
  btn.setAttribute('aria-pressed', String(on));
  btn.textContent = on ? UI[lang].exploreMode : UI[lang].recruiterMode;
  document.body.classList.toggle('mode-recruiter', on);
  if (focus && on) $('#r-title').focus();
}

function setLang(next: Lang, keepFocus = false): void {
  lang = next;
  const ui = UI[lang];
  document.documentElement.lang = lang;
  document.title = ui.htmlTitle;
  document.querySelector('meta[name="description"]')?.setAttribute('content', ui.metaDescription);
  const panel = document.querySelector<HTMLDialogElement>('#panel');
  if (panel?.open) panel.close();
  $('#app').innerHTML = renderShell(lang);
  syncRecruiter();
  syncThemeButton();
  hideHint(0);
  if (keepFocus) $('#lang-toggle').focus();
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch {
    /* almacenamiento no disponible: el idioma no se recuerda */
  }
}

// En pantallas táctiles la pista dice «Toca» en vez de «Haz clic».
function syncHintText(): void {
  const hint = document.querySelector('#hint');
  if (hint && matchMedia('(hover: none)').matches) hint.textContent = UI[lang].hintTouch;
}

function hideHint(delay: number): void {
  window.setTimeout(() => document.querySelector('#hint')?.classList.add('is-hidden'), delay);
}

function openPanel(id: SectionId, trigger: HTMLElement): void {
  const dialog = $<HTMLDialogElement>('#panel');
  const { kicker, title, body } = renderPanel(id, lang);
  $('#panel-kicker').textContent = kicker;
  $('#panel-title').textContent = title;
  $('#panel-body').innerHTML = body;
  dialog.dataset.section = id;
  lastTrigger = trigger;
  dialog.showModal();
  $('#panel-body').scrollTop = 0;
  if (id === 'terminal') {
    // Carga síncrona (≈0,7 KB): nada de lo que se teclee al abrir se pierde.
    mountTerminal($('[data-terminal]'), lang, () => dialog.close());
  } else {
    $<HTMLButtonElement>('.panel-close').focus();
  }
}

function activate(id: string | undefined, on: boolean): void {
  if (!id) return;
  document.querySelector(`#obj-${id}`)?.classList.toggle('is-active', on);
}

function bind(): void {
  document.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    const opener = t.closest<HTMLElement>('[data-open]');
    if (opener) {
      activate(opener.dataset.open, true);
      openPanel(opener.dataset.open as SectionId, opener);
      return;
    }
    if (t.closest('#recruiter-toggle')) {
      if (isRecruiter()) history.pushState(null, '', location.pathname + location.search);
      else history.pushState(null, '', '#cv');
      syncRecruiter(true);
      return;
    }
    if (t.closest('#theme-toggle')) {
      setTheme(currentTheme() === 'dark' ? 'light' : 'dark', true);
      return;
    }
    if (t.closest('#lang-toggle')) {
      setLang(lang === 'es' ? 'en' : 'es', true);
      return;
    }
    if (t.closest('[data-close]')) {
      $<HTMLDialogElement>('#panel').close();
      return;
    }
    // Clic en el fondo (fuera del contenido) cierra el panel.
    if (t.id === 'panel') $<HTMLDialogElement>('#panel').close();
  });

  for (const ev of ['pointerover', 'focusin'] as const) {
    document.addEventListener(ev, (e) => activate((e.target as HTMLElement).closest<HTMLElement>('.hotspot')?.dataset.open, true));
  }
  for (const ev of ['pointerout', 'focusout'] as const) {
    document.addEventListener(ev, (e) => {
      const hs = (e.target as HTMLElement).closest<HTMLElement>('.hotspot');
      if (hs && !$<HTMLDialogElement>('#panel').open) activate(hs.dataset.open, false);
    });
  }

  document.addEventListener(
    'close',
    (e) => {
      if ((e.target as HTMLElement).id !== 'panel') return;
      const dialog = e.target as HTMLDialogElement;
      activate(dialog.dataset.section, false);
      lastTrigger?.focus();
    },
    true,
  );

  window.addEventListener('popstate', () => syncRecruiter());

  // Sin elección guardada, el tema sigue al sistema en vivo.
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!storedTheme()) setTheme(e.matches ? 'dark' : 'light', false);
  });

  // La terminal nunca envía el formulario (aunque se pulse Enter antes de montarse).
  document.addEventListener('submit', (e) => {
    if ((e.target as HTMLElement).closest('.term-line')) e.preventDefault();
  });

  // Atajo oculto: la tecla ` (o ~) abre la terminal desde cualquier punto.
  document.addEventListener('keydown', (e) => {
    if (e.key !== '`' && e.key !== '~') return;
    if ((e.target as HTMLElement).closest('input, textarea') || $<HTMLDialogElement>('#panel').open) return;
    e.preventDefault();
    const trigger = document.querySelector<HTMLElement>('[data-open="terminal"]:not([hidden])') ?? document.body;
    openPanel('terminal', document.activeElement instanceof HTMLElement ? document.activeElement : trigger);
  });
}

function init(): void {
  bind();
  const initial = storedLang();
  if (initial && initial !== 'es') setLang(initial);
  else lang = 'es';
  syncRecruiter();
  setTheme(storedTheme() ?? currentTheme(), false);
  syncHintText();
  hideHint(3000);
}

init();
