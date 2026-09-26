// Iconos «app» generados en código (rejilla de 1024).
// Receta: squircle real + degradado de 2 tonos (claro arriba-izquierda), glifo simple con
// volumen (extrusión en 3 capas + sombra propia), brillo especular en el tercio superior,
// borde interior blanco al 20 % y ≤ 3 colores por icono. Luz siempre desde arriba-izquierda.
import type { SectionId } from '../types.ts';
import { SQUIRCLE_1024 } from './squircle.ts';

export type IconId = Exclude<SectionId, 'about'>;

interface IconSpec {
  bg: [string, string]; // degradado del fondo (claro → oscuro)
  face: [string, string]; // cara del glifo (arriba → abajo)
  side: string; // color de la extrusión
  accent: string; // tercer color (detalles)
  sideAccent?: string;
  glyph: (main: string, accent: string) => string;
}

// ── Glifos (centrados en 512,500, ~58 % del lienzo) ──
const rack = (m: string, a: string) => `
  <rect x="286" y="222" width="452" height="560" rx="72" fill="${m}"/>
  ${[0, 1, 2]
    .map((i) => {
      const y = 282 + i * 164;
      return `<rect x="338" y="${y}" width="348" height="112" rx="30" fill="${a === m ? m : '#16307a'}" opacity="${a === m ? 1 : 0.9}"/>
      <circle cx="398" cy="${y + 56}" r="20" fill="${a}"/><circle cx="458" cy="${y + 56}" r="20" fill="${a}" opacity="${a === m ? 1 : 0.55}"/>
      <rect x="540" y="${y + 44}" width="110" height="24" rx="12" fill="${m}" opacity="${a === m ? 1 : 0.35}"/>`;
    })
    .join('')}`;

const shield = (m: string, a: string) => `
  <path d="M512 196 L762 290 Q770 294 770 302 V500 Q770 700 512 836 Q254 700 254 500 V302 Q254 294 262 290 Z" fill="${m}"/>
  <path d="M430 504 V452 A82 82 0 0 1 594 452 V504" fill="none" stroke="${a}" stroke-width="44" stroke-linecap="round"/>
  <rect x="396" y="494" width="232" height="184" rx="44" fill="${a}"/>
  <circle cx="512" cy="572" r="26" fill="${m}"/><rect x="500" y="580" width="24" height="52" rx="12" fill="${m}"/>`;

const nodes = (m: string, a: string) => `
  <path d="M512 300 L318 668 L706 668 Z" fill="none" stroke="${a}" stroke-width="46" stroke-linejoin="round"/>
  <circle cx="512" cy="300" r="112" fill="${m}"/>
  <circle cx="318" cy="668" r="112" fill="${m}"/>
  <circle cx="706" cy="668" r="112" fill="${m}"/>`;

const chart = (m: string, a: string) => `
  <path d="M292 742 C292 520 360 380 470 360 C600 336 700 430 730 560" fill="none" stroke="${m}" stroke-width="84" stroke-linecap="round"/>
  <path d="M662 520 L744 612 L806 500" fill="none" stroke="${m}" stroke-width="84" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="292" cy="742" r="58" fill="${a}"/>`;

const briefcase = (m: string, a: string) => `
  <path d="M410 316 V286 Q410 246 450 246 H574 Q614 246 614 286 V316" fill="none" stroke="${m}" stroke-width="52" stroke-linecap="round"/>
  <rect x="228" y="312" width="568" height="444" rx="84" fill="${m}"/>
  <rect x="228" y="480" width="568" height="30" fill="${a}" opacity="${a === m ? 1 : 0.28}"/>
  <rect x="456" y="456" width="112" height="84" rx="26" fill="${a}"/>`;

const medal = (m: string, a: string) => `
  <path d="M398 574 L322 824 L412 790 L462 866 L520 648 Z" fill="${a === m ? m : '#fff4d6'}"/>
  <path d="M626 574 L702 824 L612 790 L562 866 L504 648 Z" fill="${a === m ? m : '#fff4d6'}"/>
  <circle cx="512" cy="450" r="254" fill="${m}"/>
  <path d="M512 306 L556 396 L656 410 L584 480 L602 580 L512 532 L422 580 L440 480 L368 410 L468 396 Z" fill="${a}"/>`;

const terminal = (m: string, a: string) => `
  <path d="M292 348 L474 500 L292 652" fill="none" stroke="${m}" stroke-width="92" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="534" y="614" width="232" height="92" rx="46" fill="${a}"/>`;

const plane = (m: string, a: string) => `
  <path d="M232 488 L804 248 L612 812 L500 580 Z" fill="${m}"/>
  <path d="M500 580 L804 248 L612 812 Z" fill="${a}"/>`;

export const ICONS: Record<IconId, IconSpec> = {
  infra: { bg: ['#3b82f6', '#1e3a8a'], face: ['#ffffff', '#dbe7ff'], side: '#9fb7ea', accent: '#5ef0ff', sideAccent: '#9fb7ea', glyph: rack },
  security: { bg: ['#8b5cf6', '#4338ca'], face: ['#ffffff', '#e4dcff'], side: '#b3a3ee', accent: '#5b3fd6', sideAccent: '#b3a3ee', glyph: shield },
  ai: { bg: ['#22d3ee', '#0f766e'], face: ['#ffffff', '#d6fbff'], side: '#8fd9dd', accent: '#e6fdff', sideAccent: '#8fd9dd', glyph: nodes },
  projects: { bg: ['#fb923c', '#db2777'], face: ['#ffffff', '#ffe4ef'], side: '#f3a3bf', accent: '#ffe8a3', sideAccent: '#f3a3bf', glyph: chart },
  experience: { bg: ['#6b7280', '#27272a'], face: ['#ffffff', '#e5e7eb'], side: '#a1a1aa', accent: '#fbbf24', sideAccent: '#a1a1aa', glyph: briefcase },
  certs: { bg: ['#fcd34d', '#d97706'], face: ['#ffffff', '#fff1c7'], side: '#f0c46a', accent: '#e38b06', sideAccent: '#f0c46a', glyph: medal },
  terminal: { bg: ['#3f3f46', '#09090b'], face: ['#ffffff', '#e4e4e7'], side: '#71717a', accent: '#34d399', sideAccent: '#1f8f68', glyph: terminal },
  contact: { bg: ['#38bdf8', '#1d4ed8'], face: ['#ffffff', '#e0f2fe'], side: '#8fc3ef', accent: '#cfe6fb', sideAccent: '#8fc3ef', glyph: plane },
};

export const ICON_ORDER: IconId[] = ['infra', 'security', 'ai', 'projects', 'experience', 'certs', 'terminal', 'contact'];

let seq = 0;

/** SVG del icono. `size` en px CSS; `label` vacío = decorativo. */
export function appIcon(id: IconId, size: number, label = ''): string {
  const s = ICONS[id];
  const k = `ic${seq++}${id}`;
  const depth = [18, 12, 6];
  return `<svg class="app-icon" width="${size}" height="${size}" viewBox="0 0 1024 1024" ${label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"'} focusable="false">
  <defs>
    <linearGradient id="${k}b" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${s.bg[0]}"/><stop offset="1" stop-color="${s.bg[1]}"/></linearGradient>
    <linearGradient id="${k}f" x1="0" y1="0" x2=".35" y2="1"><stop offset="0" stop-color="${s.face[0]}"/><stop offset="1" stop-color="${s.face[1]}"/></linearGradient>
    <radialGradient id="${k}s" cx=".3" cy="0" r=".9"><stop offset="0" stop-color="#fff" stop-opacity=".24"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/></radialGradient>
    <linearGradient id="${k}v" x1="0" y1="0" x2="0" y2="1"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".22"/></linearGradient>
    <filter id="${k}d" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="16"/></filter>
    <clipPath id="${k}c"><path d="${SQUIRCLE_1024}"/></clipPath>
  </defs>
  <g clip-path="url(#${k}c)">
    <rect width="1024" height="1024" fill="url(#${k}b)"/>
    <rect width="1024" height="1024" fill="url(#${k}v)"/>
    <g opacity=".34" filter="url(#${k}d)" transform="translate(14 34)">${s.glyph('#0b0b1a', '#0b0b1a')}</g>
    ${depth.map((d) => `<g transform="translate(${d * 0.35} ${d})">${s.glyph(s.side, s.sideAccent ?? s.side)}</g>`).join('')}
    ${s.glyph(`url(#${k}f)`, s.accent)}
    <ellipse cx="400" cy="90" rx="700" ry="330" fill="url(#${k}s)"/>
  </g>
  <path d="${SQUIRCLE_1024}" fill="none" stroke="#fff" stroke-opacity=".2" stroke-width="10" transform="translate(5 5) scale(.99)"/>
</svg>`;
}
