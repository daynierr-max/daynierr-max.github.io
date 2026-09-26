// /styleguide: muestra viva de los tokens y componentes en claro y oscuro.
import './styles/index.css';
import './styles/styleguide.css';
import { monogram, squirclePath } from './render/squircle.ts';
import { appIcon, ICON_ORDER } from './render/icons.ts';

const ICON_NAMES: Record<string, string> = {
  infra: 'Infra y Azure',
  security: 'Ciberseguridad',
  ai: 'IA y MCP',
  projects: 'Proyectos',
  experience: 'Experiencia',
  certs: 'Certificaciones',
  terminal: 'Terminal',
  contact: 'Contacto',
};

function iconsSection(): string {
  const sheet = (theme: 'light' | 'dark') => `<div class="sg-iconsheet" data-theme="${theme}" data-sheet="${theme}">
    <table><thead><tr><th scope="col">Icono</th><th scope="col">180</th><th scope="col">64</th><th scope="col">32</th></tr></thead><tbody>
    ${ICON_ORDER.map((id) => `<tr><th scope="row">${ICON_NAMES[id]}</th><td>${appIcon(id, 180)}</td><td>${appIcon(id, 64)}</td><td>${appIcon(id, 32)}</td></tr>`).join('')}
    </tbody></table></div>`;
  return `<section id="icons" class="sg-section"><h2>Iconos</h2>
  <p class="sg-muted">Squircle real (superelipse n=5) · degradado de 2 tonos · glifo con extrusión en 3 capas y sombra propia · brillo especular · borde interior al 20 % · luz desde arriba-izquierda · ≤ 3 colores.</p>
  <div class="sg-shelf-demo" data-theme="light"><div class="sg-shelf">${ICON_ORDER.map((id) => `<figure>${appIcon(id, 96)}<figcaption>${ICON_NAMES[id]}</figcaption></figure>`).join('')}</div></div>
  <div class="sg-iconsheets">${sheet('light')}${sheet('dark')}</div>
  <h3 class="sg-sub">1024 px</h3>
  <div class="sg-icon1024">${ICON_ORDER.map((id) => `<figure data-icon="${id}">${appIcon(id, 1024, ICON_NAMES[id])}<figcaption>${ICON_NAMES[id]} · 1024</figcaption></figure>`).join('')}</div>
</section>`;
}

const COLORS: [string, string][] = [
  ['--bg', 'Fondo'],
  ['--bg-elev', 'Fondo elevado'],
  ['--surface', 'Superficie'],
  ['--surface-2', 'Superficie 2'],
  ['--surface-3', 'Superficie 3'],
  ['--text', 'Texto'],
  ['--text-2', 'Secundario'],
  ['--text-3', 'Terciario'],
  ['--accent', 'Acento (texto)'],
  ['--accent-fill', 'Acento (relleno)'],
  ['--accent-on-fill', 'Acento s/ relleno'],
  ['--separator', 'Separador'],
  ['--fill', 'Relleno'],
];

const TYPE: [string, string, string][] = [
  ['--fs-72', '72 · Display', 'Daynier Rodríguez'],
  ['--fs-48', '48 · Título grande', 'Sistemas, Azure e IA'],
  ['--fs-34', '34 · Título 1', 'Historial de versiones'],
  ['--fs-28', '28 · Título 2', 'Vista previa'],
  ['--fs-22', '22 · Título 3', 'Novedades'],
  ['--fs-17', '17 · Cuerpo', 'Monitorización 24/7 y gestión de incidencias con escalado según procedimiento.'],
  ['--fs-15', '15 · Secundario', 'Madrid · Disponibilidad inmediata'],
  ['--fs-12', '12 · Etiqueta', 'EXPERIENCIA'],
];

const RADII: [string, string][] = [
  ['--r-xs', '8'],
  ['--r-sm', '12'],
  ['--r-card', '22 · tarjeta'],
  ['--r-sheet', '28 · hoja'],
  ['--r-pill', 'píldora'],
];

function specimen(theme: 'light' | 'dark'): string {
  return `<section class="sg-theme" data-theme="${theme}" aria-label="Tema ${theme === 'light' ? 'claro' : 'oscuro'}">
  <h3 class="sg-theme-title">${theme === 'light' ? 'Claro' : 'Oscuro'}</h3>

  <div class="sg-block"><h4>Barra de cristal</h4>
    <div class="sg-glass-demo">
      <div class="sg-blobs" aria-hidden="true"><span></span><span></span><span></span></div>
      <div class="bar sg-bar"><div class="bar-inner">
        <span class="bar-brand">${monogram(28)}<span class="bar-name">Daynier Rodríguez Ruíz</span></span>
        <div class="bar-actions"><span class="btn-icon">EN</span><span class="btn btn-secondary btn-sm">Leer ahora</span><span class="btn btn-primary btn-sm">Descargar CV</span></div>
      </div></div>
    </div>
  </div>

  <div class="sg-block"><h4>Color</h4>
    <ul class="sg-swatches">${COLORS.map(([v, n]) => `<li><span class="sg-swatch" style="background:var(${v})"></span><b>${n}</b><code data-var="${v}"></code></li>`).join('')}</ul>
  </div>

  <div class="sg-block"><h4>Botones</h4>
    <div class="sg-row">
      <button class="btn btn-primary btn-lg" type="button">Obtener CV</button>
      <button class="btn btn-secondary btn-lg" type="button">Leer ahora</button>
      <button class="btn btn-primary" type="button">Primario</button>
      <button class="btn btn-secondary" type="button">Secundario</button>
      <button class="btn btn-plain" type="button">Ver en GitHub ›</button>
      <button class="btn btn-primary btn-sm" type="button">Descargar CV</button>
      <button class="btn-icon" type="button" aria-label="Icono">EN</button>
    </div>
    <div class="sg-row"><span class="chip">Azure CLI</span><span class="chip">Bicep</span><span class="chip">Entra ID</span><span class="verified-badge">✔ Verificado</span></div>
  </div>

  <div class="sg-block"><h4>Sombras y superficies</h4>
    <div class="sg-row">
      <div class="sg-card" style="box-shadow:var(--ring)">ring</div>
      <div class="sg-card" style="box-shadow:var(--shadow-1),var(--ring)">shadow-1</div>
      <div class="sg-card" style="box-shadow:var(--shadow-2),var(--ring)">shadow-2</div>
    </div>
  </div>
</section>`;
}

function curve(): string {
  // Muestra la curva --ease-spring a partir de sus puntos de linear().
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--ease-spring');
  const pts = [...raw.matchAll(/([\d.]+)(?:\s+([\d.]+)%)?/g)].map((m) => [m[2] ? +m[2] / 100 : NaN, +m[1]]);
  pts.forEach((p, i) => {
    if (Number.isNaN(p[0])) p[0] = i === 0 ? 0 : i === pts.length - 1 ? 1 : NaN;
  });
  for (let i = 1; i < pts.length - 1; i++) if (Number.isNaN(pts[i][0])) pts[i][0] = (pts[i - 1][0] + pts[i + 1][0]) / 2;
  const poly = pts.map(([x, y]) => `${(x * 300).toFixed(1)},${(150 - y * 120).toFixed(1)}`).join(' ');
  return `<svg class="sg-curve" viewBox="-10 -10 320 180" role="img" aria-label="Curva de muelle con un único rebote suave">
    <line x1="0" y1="30" x2="300" y2="30" stroke="currentColor" stroke-opacity=".2" stroke-dasharray="4 4"/>
    <polyline points="${poly}" fill="none" stroke="var(--accent)" stroke-width="3" stroke-linejoin="round"/>
  </svg>`;
}

function render(): void {
  const root = document.querySelector<HTMLElement>('#sg')!;
  root.innerHTML = `
<header class="sg-head">
  ${monogram(64, 'Monograma DR')}
  <div><h1>Sistema de diseño</h1><p>Tokens, tipografía y componentes del CV v2 · Inter variable autoalojada · acento único</p></div>
  <nav class="sg-nav" aria-label="Secciones"><a href="#tipografia">Tipografía</a><a href="#radios">Radios</a><a href="#temas">Temas</a><a href="#movimiento">Movimiento</a><a href="#icons">Iconos</a></nav>
</header>

<section id="tipografia" class="sg-section"><h2>Tipografía · Inter</h2>
  <div class="sg-type">${TYPE.map(([v, label, sample]) => `<div class="sg-type-row"><span class="sg-type-label">${label}</span><span class="sg-type-sample" style="font-size:var(${v});${/72|48|34/.test(v) ? 'letter-spacing:var(--track-display);line-height:var(--lh-tight);font-weight:700' : /28|22/.test(v) ? 'letter-spacing:var(--track-title);font-weight:700;line-height:1.2' : v === '--fs-12' ? 'font-weight:600;letter-spacing:.02em' : ''}">${sample}</span></div>`).join('')}</div>
</section>

<section id="radios" class="sg-section"><h2>Radios</h2>
  <div class="sg-row">${RADII.map(([v, n]) => `<div class="sg-radius" style="border-radius:var(${v})"><span>${n}</span></div>`).join('')}
    <div class="sg-radius sg-squircle"><span>squircle n=5</span></div>
  </div>
</section>

<section id="temas" class="sg-section"><h2>Temas</h2><div class="sg-themes">${specimen('light')}${specimen('dark')}</div></section>

<section id="movimiento" class="sg-section"><h2>Movimiento</h2>
  <div class="sg-row sg-motion">${curve()}
    <div><p><code>--ease-spring</code> · ${getComputedStyle(document.documentElement).getPropertyValue('--dur-1')} / ${getComputedStyle(document.documentElement).getPropertyValue('--dur-2')} · un solo rebote (≈5 %). Con <code>prefers-reduced-motion</code>: fundidos de 150 ms.</p>
    <button class="btn btn-secondary" type="button" id="sg-play">Reproducir</button><div class="sg-track"><span class="sg-dot"></span></div></div>
  </div>
</section>

${iconsSection()}`;

  for (const code of root.querySelectorAll<HTMLElement>('code[data-var]')) {
    code.textContent = getComputedStyle(code).getPropertyValue(code.dataset.var!).trim();
  }
  const sq = root.querySelector<HTMLElement>('.sg-squircle');
  if (sq) sq.style.clipPath = `path('${squirclePath(0, 0, 90, 90)}')`;
  root.querySelector('#sg-play')?.addEventListener('click', () => root.querySelector('.sg-track')?.classList.toggle('is-on'));
}

render();
