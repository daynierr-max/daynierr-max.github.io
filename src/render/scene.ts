// Escena isométrica "Night Ops" (SVG generado por código) y tarjetas-objeto (vista móvil).
import type { Lang, SectionId } from '../types.ts';
import { CVS, SECTION_ORDER, UI } from '../i18n.ts';
import { esc } from './html.ts';
import {
  box,
  hull,
  onPlaneX,
  onPlaneY,
  onPlaneZ,
  P,
  path2,
  poly,
  screenBounds,
  VIEW_H,
  VIEW_W,
  type V2,
  type V3,
} from './iso.ts';

const W = 11; // ancho de la sala (x)
const D = 11; // fondo de la sala (y)
const H = 6.4; // altura de pared

const C = {
  floor: '#101b36',
  floorLine: '#1b2b52',
  wallR: '#16244a',
  wallL: '#111d3d',
  trim: '#2a3d6e',
  furniture: '#233259',
  dark: '#0c1427',
  screen: '#061122',
  bezel: '#0a1122',
  cyan: '#34e0ff',
  amber: '#ffb547',
  teal: '#1f8ea3',
  skin: '#c98d6a',
  hair: '#17110d',
};

// Caja(s) de mundo de cada objeto: definen la zona clicable (hotspot).
type WBox = [number, number, number, number, number, number];
const HOTSPOTS: Record<SectionId, { boxes: WBox[]; z: number; beacon?: number }> = {
  projects: { boxes: [[0.8, 0, 2.6, 3.8, 0, 4.8]], z: 1 },
  ai: { boxes: [[4.4, 0, 2.6, 7.6, 0, 4.8]], z: 1 },
  certs: { boxes: [[8.1, 0, 2.4, 10.4, 0, 4.6]], z: 1 },
  contact: { boxes: [[0, 3.9, 1.8, 0, 6.9, 5.0]], z: 1 },
  experience: { boxes: [[0, 1.0, 0, 1.15, 3.4, 4.2]], z: 2 },
  about: { boxes: [[4.2, 3.6, 0, 8.2, 5.4, 2.6], [5.8, 5.8, 0, 6.9, 6.9, 3.0]], z: 2 },
  terminal: { boxes: [[9.2, 4.4, 2.3, 10.9, 4.4, 3.7]], z: 3 },
  security: { boxes: [[9.1, 7.4, 0, 10.1, 8.4, 3.5]], z: 3, beacon: 80 },
  infra: { boxes: [[0.15, 8.3, 0, 1.45, 10, 4.6]], z: 3 },
};

// Pseudoaleatorio determinista: la escena es idéntica en cada build.
function rng(seed: number) {
  return () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
}

const defs = `<defs>
  <linearGradient id="g-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#16264e"/><stop offset="1" stop-color="#0a1328"/></linearGradient>
  <linearGradient id="g-wallR" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0f1a38"/><stop offset="1" stop-color="#1a2b58"/></linearGradient>
  <linearGradient id="g-wallL" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0c1631"/><stop offset="1" stop-color="#152347"/></linearGradient>
  <linearGradient id="g-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b2a5c"/><stop offset=".45" stop-color="#5a3f86"/><stop offset=".75" stop-color="#e2785c"/><stop offset="1" stop-color="#ffc47a"/></linearGradient>
  <linearGradient id="g-beam" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffc47a" stop-opacity=".34"/><stop offset="1" stop-color="#ffb547" stop-opacity="0"/></linearGradient>
  <radialGradient id="g-pool"><stop offset="0" stop-color="#ffc47a" stop-opacity=".3"/><stop offset="1" stop-color="#ffc47a" stop-opacity="0"/></radialGradient>
  <radialGradient id="g-cyanglow"><stop offset="0" stop-color="#34e0ff" stop-opacity=".32"/><stop offset="1" stop-color="#34e0ff" stop-opacity="0"/></radialGradient>
  <radialGradient id="g-sun"><stop offset="0" stop-color="#fff1d0"/><stop offset=".35" stop-color="#ffd08a" stop-opacity=".9"/><stop offset="1" stop-color="#ff9e5e" stop-opacity="0"/></radialGradient>
  <linearGradient id="g-shield" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#34e0ff" stop-opacity=".45"/><stop offset="1" stop-color="#34e0ff" stop-opacity=".08"/></linearGradient>
  <linearGradient id="g-cone" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#34e0ff" stop-opacity=".35"/><stop offset="1" stop-color="#34e0ff" stop-opacity="0"/></linearGradient>
</defs>`;

function room(): string {
  const grid: string[] = [];
  for (let i = 1; i < W; i++) {
    const [a, b] = [P(i, 0), P(i, D)];
    grid.push(`M${a[0]},${a[1]}L${b[0]},${b[1]}`);
  }
  for (let j = 1; j < D; j++) {
    const [a, b] = [P(0, j), P(W, j)];
    grid.push(`M${a[0]},${a[1]}L${b[0]},${b[1]}`);
  }
  return `<g class="room">
  ${box(0, 0, -0.4, W, D, 0.4, { top: C.floor, left: '#0b1430', right: '#08102a' })}
  ${poly([[0, 0, 0], [W, 0, 0], [W, D, 0], [0, D, 0]], 'url(#g-floor)')}
  <path d="${grid.join('')}" stroke="${C.floorLine}" stroke-width="1.2" opacity=".55" fill="none"/>
  ${box(-0.35, -0.35, 0, W + 0.35, 0.35, H, { top: C.trim, left: 'url(#g-wallR)', right: '#1d2d5c' })}
  ${box(-0.35, 0, 0, 0.35, D, H, { top: C.trim, left: '#1d2d5c', right: 'url(#g-wallL)' })}
  ${poly([[0, 0, 0], [W, 0, 0], [W, 0, 0.28], [0, 0, 0.28]], '#0d1733')}
  ${poly([[0, 0, 0], [0, D, 0], [0, D, 0.28], [0, 0, 0.28]], '#0a1430')}
</g>`;
}

function neon(): string {
  return `<g class="neon" transform="${onPlaneY(4.75, 0.02, 6.0)}">
  <text x="0" y="46" font-family="ui-monospace,Menlo,monospace" font-weight="800" font-size="48" letter-spacing="6" fill="none" stroke="${C.cyan}" stroke-width="10" opacity=".14">NIGHT OPS</text>
  <text x="0" y="46" font-family="ui-monospace,Menlo,monospace" font-weight="800" font-size="48" letter-spacing="6" fill="#aef6ff" stroke="${C.cyan}" stroke-width="1.5">NIGHT OPS</text>
</g>`;
}

// ── Ventana al amanecer (contacto) + haz de luz volumétrico ──
const WIN = { y0: 3.9, y1: 6.9, z0: 1.8, z1: 5.0 };
function windowObj(): string {
  const r = rng(7);
  const city: string[] = [];
  let x = 0;
  while (x < 300) {
    const w = 18 + r() * 26;
    const h = 30 + r() * 70;
    city.push(`<rect x="${x.toFixed(1)}" y="${(320 - h).toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}"/>`);
    for (let wy = 320 - h + 8; wy < 312; wy += 12)
      for (let wx = x + 4; wx < x + w - 5; wx += 8) if (r() > 0.72) city.push(`<rect class="lit" x="${wx.toFixed(1)}" y="${wy.toFixed(1)}" width="3" height="4"/>`);
    x += w + 2;
  }
  return `<g id="obj-contact" class="obj">
  <ellipse cx="${P(0, 5.4, 3.4)[0] + 40}" cy="${P(0, 5.4, 3.4)[1]}" rx="210" ry="190" fill="url(#g-pool)" class="win-glow"/>
  <g transform="${onPlaneX(0.02, WIN.y1, WIN.z1)}">
    <rect x="-16" y="-16" width="332" height="352" rx="4" fill="${C.trim}"/>
    <rect x="0" y="0" width="300" height="320" fill="url(#g-sky)"/>
    <circle cx="196" cy="300" r="110" fill="url(#g-sun)" class="sun"/>
    <circle cx="196" cy="300" r="34" fill="#fff1d0"/>
    <g fill="#0a1226">${city.join('')}</g>
    <rect x="146" y="0" width="8" height="320" fill="${C.trim}"/>
    <rect x="0" y="150" width="300" height="8" fill="${C.trim}"/>
    <polygon points="12,10 70,10 20,140 12,140" fill="#fff" opacity=".06"/>
    <g class="win-pane"><rect x="154" y="0" width="146" height="320" fill="#9fc6ff" opacity=".1"/><rect x="154" y="0" width="146" height="320" fill="none" stroke="${C.trim}" stroke-width="6"/></g>
    <rect x="-22" y="320" width="344" height="16" rx="2" fill="#2e4379"/>
  </g>
</g>`;
}

function beam(): string {
  const d: V3 = [1, 0.32, -0.85];
  const corners: V3[] = [
    [0, WIN.y0, WIN.z0],
    [0, WIN.y1, WIN.z0],
    [0, WIN.y1, WIN.z1],
    [0, WIN.y0, WIN.z1],
  ];
  const floor: V3[] = corners.map(([x, y, z]) => {
    const t = z / -d[2];
    return [x + d[0] * t, y + d[1] * t, 0];
  });
  const vol = hull([...corners, ...floor].map(([x, y, z]) => P(x, y, z)));
  const xs = vol.map((p) => p[0]);
  const ys = vol.map((p) => p[1]);
  const [minX, maxX, minY, maxY] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const inside = (px: number, py: number) => {
    let c = false;
    for (let i = 0, j = vol.length - 1; i < vol.length; j = i++) {
      const [xi, yi] = vol[i];
      const [xj, yj] = vol[j];
      if (yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) c = !c;
    }
    return c;
  };
  const r = rng(42);
  const dust: string[] = [];
  let guard = 0;
  while (dust.length < 22 && guard++ < 500) {
    const px = minX + r() * (maxX - minX);
    const py = minY + r() * (maxY - minY);
    if (!inside(px, py)) continue;
    const i = dust.length;
    dust.push(
      `<circle class="dust" cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="${(1 + r() * 1.8).toFixed(1)}" style="--i:${i};--dx:${(r() * 30 - 10).toFixed(0)}px;--dy:${(-10 - r() * 26).toFixed(0)}px"/>`,
    );
  }
  return `<g id="beam" class="beam">
  <polygon points="${path2(vol)}" fill="url(#g-beam)" class="beam-vol"/>
  ${poly(floor, '#ffc47a', 'opacity=".13" class="beam-floor"')}
  <g fill="#ffe2b0">${dust.join('')}</g>
</g>`;
}

// ── Estantería con carpetas (experiencia) ──
function bookshelf(): string {
  const years = [...CVS.es.experience].reverse().map((j) => j.start.slice(0, 4));
  const r = rng(3);
  const shelves = [0, 1, 2, 3].map((s) => 20 + s * 100);
  const books: string[] = [];
  const palette = ['#2c4a86', '#1e6f86', '#5a3f86', '#8a5a2b', '#2f3d62', '#6b7b99'];
  shelves.forEach((top, s) => {
    let x = 16;
    const bottom = top + 92;
    if (s === 1 || s === 2) {
      // dos carpetas de experiencia por estante
      for (let k = 0; k < 2; k++) {
        const i = (s - 1) * 2 + k;
        books.push(`<g class="folder" style="--i:${i}"><rect x="${x}" y="${bottom - 78}" width="34" height="78" rx="2" fill="${i % 2 ? C.amber : C.cyan}"/><rect x="${x + 6}" y="${bottom - 66}" width="22" height="14" fill="#0b1427" opacity=".75"/><text x="${x + 17}" y="${bottom - 55}" font-size="10" font-family="ui-monospace,Menlo,monospace" text-anchor="middle" fill="#e8eef8">${years[i] ?? ''}</text></g>`);
        x += 38;
      }
    }
    while (x < 214) {
      const w = 10 + r() * 14;
      const h = 48 + r() * 34;
      if (x + w > 222) break;
      const lean = r() > 0.85;
      books.push(`<rect x="${x.toFixed(1)}" y="${(bottom - h).toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" rx="1.5" fill="${palette[Math.floor(r() * palette.length)]}"${lean ? ` transform="rotate(8 ${x.toFixed(1)} ${bottom})"` : ''}/>`);
      x += w + 2 + (lean ? 6 : 0);
    }
  });
  return `<g id="obj-experience" class="obj">
  ${box(0.02, 1.0, 0, 1.13, 2.4, 4.2, { top: '#34466f', left: '#1b2848', right: C.dark })}
  <g transform="${onPlaneX(1.15, 3.4, 4.2)}">
    <rect x="0" y="0" width="240" height="420" fill="#0a1122"/>
    <rect x="0" y="0" width="10" height="420" fill="#26375f"/><rect x="230" y="0" width="10" height="420" fill="#26375f"/>
    ${shelves.map((t) => `<rect x="0" y="${t + 92}" width="240" height="9" fill="#2c3f6b"/>`).join('')}
    <rect x="0" y="0" width="240" height="12" fill="#2c3f6b"/>
    ${books.join('')}
  </g>
</g>`;
}

// ── Rack de servidores (infraestructura) ──
function rack(): string {
  const units: string[] = [];
  const ledColors = [C.cyan, '#7dff9b', C.amber];
  for (let u = 0; u < 10; u++) {
    const y = 16 + u * 43;
    units.push(`<rect x="10" y="${y}" width="150" height="36" rx="2" fill="#141e36"/>
    <path d="M22 ${y + 12}h70M22 ${y + 18}h70M22 ${y + 24}h70" stroke="#26345a" stroke-width="2"/>
    ${[0, 1, 2].map((k) => `<circle class="led" cx="${118 + k * 12}" cy="${y + 18}" r="3.4" fill="${ledColors[(u + k) % 3]}" style="--i:${u * 3 + k}"/>`).join('')}`);
  }
  return `<g id="obj-infra" class="obj">
  <ellipse cx="${P(1.2, 9.2)[0]}" cy="${P(1.2, 9.2)[1]}" rx="120" ry="40" fill="url(#g-cyanglow)" opacity=".7"/>
  ${box(0.15, 8.3, 0, 1.3, 1.7, 4.6, { top: '#2a3a63', left: '#18223d', right: '#0d1528' })}
  <g transform="${onPlaneX(1.45, 10, 4.6)}">
    <rect x="4" y="6" width="162" height="448" rx="3" fill="#070c18"/>
    ${units.join('')}
  </g>
</g>`;
}

// ── Pantallas de pared ──
function wallScreen(id: SectionId, x: number, w: number, content: string): string {
  const c = P(x + w / 200, 0, 3.7);
  return `<g id="obj-${id}" class="obj">
  <ellipse cx="${c[0]}" cy="${c[1]}" rx="${w * 0.75}" ry="${w * 0.55}" fill="url(#g-cyanglow)" class="screen-glow"/>
  <g transform="${onPlaneY(x, 0.03, 4.8)}">
    <rect x="-10" y="-10" width="${w + 20}" height="240" rx="6" fill="${C.bezel}"/>
    <rect x="0" y="0" width="${w}" height="220" fill="${C.screen}"/>
    <g class="flicker">${content}</g>
  </g>
</g>`;
}

function rrg(): string {
  const mono = 'font-family="ui-monospace,Menlo,monospace" font-size="9"';
  return wallScreen(
    'projects',
    0.8,
    300,
    `<rect x="0" y="0" width="150" height="110" fill="#0f2d57" opacity=".55"/>
    <rect x="150" y="0" width="150" height="110" fill="#0f4436" opacity=".55"/>
    <rect x="150" y="110" width="150" height="110" fill="#4a3a10" opacity=".5"/>
    <rect x="0" y="110" width="150" height="110" fill="#4a1426" opacity=".5"/>
    <path d="M150 8V212M8 110H292" stroke="#3a5d93" stroke-width="1.5"/>
    <g ${mono} fill="#9fb0c9"><text x="8" y="14">IMPROVING</text><text x="292" y="14" text-anchor="end">LEADING</text><text x="292" y="212" text-anchor="end">WEAKENING</text><text x="8" y="212">LAGGING</text></g>
    <path d="M70 170C52 120 96 72 150 64S252 84 244 144 188 196 160 164" fill="none" stroke="#6b7b99" stroke-width="2" opacity=".35" transform="translate(12 -20) scale(.8)"/>
    <path class="rrg-path" pathLength="1" d="M70 170C52 120 96 72 150 64S252 84 244 144 188 196 160 164" fill="none" stroke="${C.amber}" stroke-width="3" stroke-linecap="round"/>
    <circle class="rrg-dot" cx="160" cy="164" r="6" fill="${C.amber}"/>
    <text x="8" y="28" ${mono} fill="${C.cyan}">RRG · 12w</text>`,
  );
}

function nodes(): string {
  const n: [number, number, string][] = [
    [160, 110, 'MCP'],
    [60, 50, 'Claude'],
    [260, 48, 'FastMCP'],
    [58, 172, 'Python'],
    [262, 172, 'SQLite'],
    [160, 28, 'Ollama'],
    [160, 196, 'Gemini'],
  ];
  const edges: [number, number][] = [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [1, 5], [2, 5], [3, 6], [4, 6]];
  return wallScreen(
    'ai',
    4.4,
    320,
    `<g stroke="#27416f" stroke-width="2">${edges.map(([a, b]) => `<line x1="${n[a][0]}" y1="${n[a][1]}" x2="${n[b][0]}" y2="${n[b][1]}"/>`).join('')}</g>
    <g stroke="${C.cyan}" stroke-width="3" stroke-linecap="round">${edges
      .map(([a, b], i) => `<line class="edge" style="--i:${i}" x1="${n[a][0]}" y1="${n[a][1]}" x2="${n[b][0]}" y2="${n[b][1]}"/>`)
      .join('')}</g>
    ${n
      .map(
        ([x, y, t], i) =>
          `<g class="node" style="--i:${i}"><circle cx="${x}" cy="${y}" r="${i ? 9 : 20}" fill="${i ? '#0d2446' : '#0e3a52'}" stroke="${i ? C.cyan : C.amber}" stroke-width="2"/><text x="${x}" y="${i ? y + (y > 110 ? -14 : 22) : y + 4}" font-family="ui-monospace,Menlo,monospace" font-size="${i ? 10 : 11}" font-weight="700" text-anchor="middle" fill="${i ? '#bfe9ff' : C.amber}">${t}</text></g>`,
      )
      .join('')}`,
  );
}

// ── Tablón de corcho (certificaciones) ──
function corkboard(): string {
  const r = rng(11);
  const specks = Array.from({ length: 60 }, () => `<circle cx="${(8 + r() * 214).toFixed(0)}" cy="${(8 + r() * 204).toFixed(0)}" r="${(0.8 + r() * 1.4).toFixed(1)}"/>`).join('');
  const papers: [number, number, number, number, number][] = [
    [18, 18, 70, 52, -4],
    [100, 14, 60, 76, 3],
    [168, 24, 50, 60, -2],
    [22, 90, 64, 80, 2],
    [96, 104, 74, 54, -3],
    [176, 100, 44, 90, 4],
  ];
  const pins = [C.amber, C.cyan, '#ff6b6b', '#7dff9b', C.amber, C.cyan];
  return `<g id="obj-certs" class="obj">
  <g transform="${onPlaneY(8.1, 0.03, 4.6)}">
    <rect x="-10" y="-10" width="250" height="240" rx="4" fill="#4a3522"/>
    <rect x="0" y="0" width="230" height="220" fill="#7a5a3a"/>
    <g fill="#5e4329">${specks}</g>
    ${papers
      .map(
        ([x, y, w, h, rot], i) => `<g transform="rotate(${rot} ${x + w / 2} ${y})">
      <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#ece6d8"/>
      <path d="M${x + 8} ${y + 14}h${w - 16}M${x + 8} ${y + 22}h${w - 24}M${x + 8} ${y + 30}h${w - 20}" stroke="#8f9bb0" stroke-width="2"/>
      ${i % 2 === 0 ? `<circle cx="${x + w - 14}" cy="${y + h - 14}" r="7" fill="${C.amber}"/>` : ''}
      <circle class="pin" style="--i:${i}" cx="${x + w / 2}" cy="${y + 4}" r="5" fill="${pins[i]}" stroke="#0008" stroke-width="1"/>
    </g>`,
      )
      .join('')}
  </g>
</g>`;
}

function plant(): string {
  const [cx, cy] = P(10.35, 1.75, 1.35);
  const leaves = [
    [-26, -6, 30, 12, -35],
    [24, -4, 30, 11, 30],
    [-8, -30, 12, 32, -8],
    [10, -26, 12, 30, 14],
    [-30, 12, 28, 10, -10],
    [30, 14, 26, 10, 12],
  ]
    .map(([x, y, rx, ry, rot], i) => `<ellipse cx="${cx + x}" cy="${cy + y}" rx="${rx}" ry="${ry}" transform="rotate(${rot} ${cx + x} ${cy + y})" fill="${i % 2 ? '#2aa37a' : '#1f7a5a'}"/>`)
    .join('');
  return `<g class="plant">${box(10.0, 1.4, 0, 0.7, 0.7, 0.62, '#2b3c6b')}<g class="sway">${leaves}</g></g>`;
}

// ── Escritorio, monitores, silla y avatar (sobre mí) ──
function monitorScreen(x: number, seed: number): string {
  const r = rng(seed);
  const colors = [C.cyan, C.amber, '#9fb0c9', '#7dff9b', '#9fb0c9'];
  const lines = Array.from({ length: 7 }, (_, i) => {
    const indent = Math.floor(r() * 3) * 10;
    return `<rect class="code" style="--i:${i}" x="${10 + indent}" y="${12 + i * 11}" width="${(30 + r() * 80).toFixed(0)}" height="5" rx="2" fill="${colors[Math.floor(r() * colors.length)]}"/>`;
  }).join('');
  return `<g transform="${onPlaneY(x + 0.05, 3.905, 2.5)}"><rect x="0" y="0" width="150" height="90" fill="${C.screen}"/><g class="flicker">${lines}</g></g>`;
}

function avatar(): string {
  const [ax, ay] = P(6.35, 6.25, 1.0);
  const hoodie = C.teal;
  return `<g class="avatar" transform="translate(${ax.toFixed(1)} ${ay.toFixed(1)})">
  <g class="torso"><path d="M-23 2 L23 2 L30 -66 Q2 -84 -26 -68 Z" fill="${hoodie}"/><path d="M-6 -70 Q4 -60 14 -72" stroke="#16707f" stroke-width="3" fill="none"/></g>
  <g class="arm arm-left"><path d="M-20 -62 L8 -38 L70 -62" stroke="#197a8c" stroke-width="13" stroke-linecap="round" stroke-linejoin="round" fill="none"/><circle cx="72" cy="-62" r="6.5" fill="${C.skin}"/></g>
  <g class="arm arm-type"><path d="M24 -66 L52 -42 L92 -58" stroke="${hoodie}" stroke-width="13" stroke-linecap="round" stroke-linejoin="round" fill="none"/><circle cx="94" cy="-58" r="6.5" fill="${C.skin}"/></g>
  <g class="arm arm-wave"><path d="M24 -66 L52 -96 L58 -132" stroke="${hoodie}" stroke-width="13" stroke-linecap="round" stroke-linejoin="round" fill="none"/><circle cx="59" cy="-138" r="8" fill="${C.skin}"/></g>
</g>`;
}

function head(): string {
  const [ax, ay] = P(6.35, 6.25, 1.0);
  return `<g class="head" transform="translate(${(ax + 10).toFixed(1)} ${(ay - 100).toFixed(1)})"><g class="head-inner">
  <rect x="-6" y="10" width="12" height="12" fill="#b37a5a"/>
  <circle r="18" fill="${C.skin}"/>
  <path d="M-18 2 A18 18 0 0 1 17 -6 Q4 -2 -2 -10 Q-8 0 -18 2 Z" fill="${C.hair}"/>
  <path d="M-19 4 A18 18 0 0 1 -6 -16 L-14 12 Z" fill="${C.hair}"/>
  <g class="face"><circle cx="11" cy="-1" r="2" fill="#1a1410"/><path d="M6 8 Q11 12 15 7" stroke="#6b3f2a" stroke-width="2" fill="none" stroke-linecap="round"/></g>
  <path d="M-19 -2 A19 19 0 0 1 19 -4" stroke="#1b2745" stroke-width="5" fill="none"/>
  <ellipse cx="-17" cy="2" rx="6" ry="9" fill="${C.cyan}"/>
</g></g>`;
}

function deskArea(): string {
  const leg = (x: number, y: number) => box(x, y, 0, 0.12, 0.12, 1.2, '#0e172d');
  return `<g id="obj-about" class="obj">
  <g transform="${onPlaneZ(3.5, 3.1, 0.01)}"><ellipse cx="260" cy="210" rx="270" ry="200" fill="#16244a" stroke="#22386b" stroke-width="3"/></g>
  ${leg(4.3, 3.7)}${leg(8.0, 3.7)}
  ${box(6.95, 3.75, 0, 1.15, 1.5, 1.2, '#1c2848')}
  ${box(4.2, 3.6, 1.2, 4.0, 1.8, 0.12, C.furniture)}
  ${leg(4.3, 5.25)}
  ${box(5.25, 3.9, 1.32, 0.2, 0.2, 0.3, '#0e162b')}${box(7.05, 3.9, 1.32, 0.2, 0.2, 0.3, '#0e162b')}
  ${box(4.55, 3.8, 1.55, 1.6, 0.1, 1.0, C.bezel)}${monitorScreen(4.55, 5)}
  ${box(6.35, 3.8, 1.55, 1.6, 0.1, 1.0, C.bezel)}${monitorScreen(6.35, 9)}
  <g transform="${onPlaneZ(4.5, 3.95, 1.33)}"><rect width="340" height="70" fill="${C.cyan}" opacity=".07"/></g>
  ${box(5.7, 4.55, 1.32, 1.3, 0.45, 0.05, '#1a2744')}
  <g transform="${onPlaneZ(5.75, 4.6, 1.38)}" fill="#2b3b66">${Array.from({ length: 3 }, (_, r) => Array.from({ length: 10 }, (_, c) => `<rect x="${c * 12 + 2}" y="${r * 11 + 3}" width="9" height="8" rx="1"/>`).join('')).join('')}</g>
  ${box(7.35, 4.7, 1.32, 0.18, 0.28, 0.04, '#26365f')}
  ${box(4.6, 4.7, 1.32, 0.24, 0.24, 0.32, '#d9cdb8')}
  <path class="steam" d="M${P(4.72, 4.82, 1.7)[0]} ${P(4.72, 4.82, 1.7)[1]}q6 -10 0 -18q-6 -8 0 -16" stroke="#cfd8e8" stroke-width="2" fill="none" opacity=".45"/>
  <g transform="${onPlaneZ(5.8, 5.8, 0.02)}"><ellipse cx="55" cy="55" rx="60" ry="60" fill="#0a1226" opacity=".7"/></g>
  ${box(6.25, 6.2, 0, 0.18, 0.18, 0.85, '#0e162b')}
  ${box(5.85, 5.85, 0.85, 1.0, 0.95, 0.16, '#22325a')}
  ${avatar()}
  ${box(5.9, 6.75, 1.0, 0.9, 0.14, 1.12, '#22325a')}
  ${head()}
</g>`;
}

// ── Escudo holográfico (ciberseguridad) ──
function shield(): string {
  const [cx, cy] = P(9.6, 7.9, 2.45);
  const top: V2[] = [P(9.15, 7.45, 0.56), P(10.05, 7.45, 0.56), P(10.05, 8.35, 0.56), P(9.15, 8.35, 0.56)];
  const cone = hull([...top, [cx - 40, cy - 30], [cx + 40, cy - 30]]);
  return `<g id="obj-security" class="obj">
  ${box(9.1, 7.4, 0, 1.0, 1.0, 0.55, { top: '#2b3d6b', left: '#1a2748', right: '#101a33' })}
  <g transform="${onPlaneZ(9.2, 7.5, 0.56)}"><ellipse cx="40" cy="40" rx="36" ry="36" fill="${C.cyan}" opacity=".55" class="emitter"/></g>
  <polygon points="${path2(cone)}" fill="url(#g-cone)" class="cone"/>
  <g class="holo" transform="translate(${cx.toFixed(1)} ${cy.toFixed(1)})">
    <ellipse class="ring" cx="0" cy="58" rx="46" ry="12" fill="none" stroke="${C.cyan}" stroke-width="2"/>
    <g class="shield-body">
      <path d="M0 -50 L40 -35 L36 10 Q29 36 0 50 Q-29 36 -36 10 L-40 -35 Z" fill="url(#g-shield)" stroke="${C.cyan}" stroke-width="2.5"/>
      <path d="M0 -38 L30 -27 L27 8 Q22 27 0 38 Q-22 27 -27 8 L-30 -27 Z" fill="none" stroke="${C.cyan}" stroke-width="1" opacity=".5"/>
      <g class="lock"><path d="M-9 -4 V-12 A9 9 0 0 1 9 -12 V-4" fill="none" stroke="#dff9ff" stroke-width="3.5"/><rect x="-13" y="-5" width="26" height="20" rx="3" fill="#dff9ff"/><circle cx="0" cy="4" r="3" fill="#0e3a52"/></g>
      <path class="check" d="M-14 2 L-4 12 L16 -10" fill="none" stroke="#7dff9b" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
    <text class="verified" x="0" y="-62" text-anchor="middle" font-family="ui-monospace,Menlo,monospace" font-size="13" font-weight="800" letter-spacing="3" fill="#7dff9b">VERIFIED</text>
  </g>
</g>`;
}

// ── Terminal flotante (easter egg) ──
function terminal(): string {
  const [sx, sy] = P(10.05, 4.55, 0);
  return `<g id="obj-terminal" class="obj">
  <ellipse cx="${sx}" cy="${sy}" rx="70" ry="22" fill="url(#g-cyanglow)" class="term-shadow"/>
  <g class="float"><g transform="${onPlaneY(9.2, 4.4, 3.7)}">
    <rect x="0" y="0" width="170" height="120" rx="6" fill="#03101d" opacity=".94" stroke="${C.cyan}" stroke-width="2"/>
    <rect x="0" y="0" width="170" height="18" rx="6" fill="#0d2440"/>
    <circle cx="12" cy="9" r="3.5" fill="#ff6b6b"/><circle cx="24" cy="9" r="3.5" fill="${C.amber}"/><circle cx="36" cy="9" r="3.5" fill="#7dff9b"/>
    <g font-family="ui-monospace,Menlo,monospace" font-size="12" fill="#bfe9ff">
      <text x="10" y="40"><tspan fill="#7dff9b">$</tspan> whoami</text>
      <text x="10" y="58">daynier</text>
      <text x="10" y="80"><tspan fill="#7dff9b">$</tspan> help</text>
    </g>
    <rect class="cursor" x="10" y="92" width="9" height="14" fill="${C.amber}"/>
  </g></g>
</g>`;
}

export function renderScene(lang: Lang): string {
  const ui = UI[lang];
  const svg = `<svg class="scene-svg" viewBox="0 0 ${VIEW_W} ${VIEW_H}" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
${defs}
${room()}
${neon()}
${rrg()}
${nodes()}
${corkboard()}
${windowObj()}
${beam()}
${bookshelf()}
${plant()}
${deskArea()}
${terminal()}
${shield()}
${rack()}
</svg>`;
  const pct = (n: number, t: number) => `${((n / t) * 100).toFixed(2)}%`;
  const buttons = SECTION_ORDER.map((id) => {
    const b = screenBounds(HOTSPOTS[id].boxes);
    const s = ui.sections[id];
    return `<button class="hotspot" type="button" data-open="${id}" aria-label="${esc(`${s.title}: ${s.object}`)}" style="left:${pct(b.x, VIEW_W)};top:${pct(b.y, VIEW_H)};width:${pct(b.w, VIEW_W)};height:${pct(b.h, VIEW_H)};z-index:${HOTSPOTS[id].z}${HOTSPOTS[id].beacon ? `;--beacon-y:${HOTSPOTS[id].beacon}%` : ''}"><span class="hs-label" aria-hidden="true">${esc(s.title)}</span></button>`;
  }).join('');
  return `<div class="stage">${svg}<div class="hotspots">${buttons}</div></div>`;
}

export function renderCards(lang: Lang): string {
  const ui = UI[lang];
  return `<ul class="cards" aria-label="${esc(ui.cardsLabel)}">${SECTION_ORDER.map((id) => {
    const s = ui.sections[id];
    return `<li><button class="card" type="button" data-open="${id}"><span class="card-kicker">${esc(s.object)}</span><span class="card-title">${esc(s.title)}</span><span class="card-teaser">${esc(s.teaser)}</span></button></li>`;
  }).join('')}</ul>`;
}
