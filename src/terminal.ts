// Easter egg: terminal con comandos. Se carga bajo demanda (chunk aparte).
import type { Lang } from './types.ts';
import { CVS, UI } from './i18n.ts';
import { PDF_HREF } from './render/html.ts';

export function mountTerminal(root: HTMLElement, lang: Lang, exit: () => void): void {
  const cv = CVS[lang];
  const ui = UI[lang].terminal;
  const log = root.querySelector<HTMLElement>('.term-log')!;
  const form = root.querySelector<HTMLFormElement>('form')!;
  const input = form.querySelector<HTMLInputElement>('input')!;
  const history: string[] = [];
  let cursor = 0;

  const print = (lines: string[], cls = '') => {
    for (const l of lines) {
      const p = document.createElement('p');
      if (cls) p.className = cls;
      p.textContent = l;
      log.append(p);
    }
    log.scrollTop = log.scrollHeight;
  };

  const commands: Record<string, () => void> = {
    help: () => print([ui.help]),
    whoami: () => print([cv.basics.name, cv.basics.headline, cv.basics.location]),
    skills: () => print(cv.skills.map((s) => `▸ ${s.name}: ${s.items.join(', ')}`)),
    contact: () => print([`email    ${cv.basics.email}`, ...cv.basics.profiles.map((p) => `${p.network.toLowerCase().padEnd(8)} ${p.url}`)]),
    'cv --pdf': () => {
      print([ui.pdf]);
      const a = document.createElement('a');
      a.href = PDF_HREF;
      a.download = '';
      a.click();
    },
    clear: () => log.replaceChildren(),
    exit,
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const raw = input.value.trim().replace(/\s+/g, ' ');
    input.value = '';
    if (!raw) return;
    history.push(raw);
    cursor = history.length;
    print([`${ui.prompt} ${raw}`], 'echo');
    const cmd = commands[raw.toLowerCase()] ?? (raw.toLowerCase() === 'cv' ? commands['cv --pdf'] : undefined);
    if (cmd) cmd();
    else print([ui.unknown(raw)], 'err');
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' && cursor > 0) input.value = history[--cursor];
    else if (e.key === 'ArrowDown') input.value = cursor < history.length - 1 ? history[++cursor] : ((cursor = history.length), '');
    else return;
    e.preventDefault();
  });

  input.focus();
}
