// Squircle real: superelipse |x/a|^n + |y/b|^n = 1 (no border-radius).
// n ≈ 5 da la curvatura continua típica de los iconos de app.

const r2 = (n: number) => Math.round(n * 100) / 100;

/** Trazado SVG de una superelipse inscrita en (x, y, w, h). */
export function squirclePath(x: number, y: number, w: number, h: number, n = 5, steps = 96): string {
  const a = w / 2;
  const b = h / 2;
  const cx = x + a;
  const cy = y + b;
  const e = 2 / n;
  const pts: string[] = [];
  for (let i = 0; i < steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    const c = Math.cos(t);
    const s = Math.sin(t);
    pts.push(`${r2(cx + a * Math.sign(c) * Math.abs(c) ** e)},${r2(cy + b * Math.sign(s) * Math.abs(s) ** e)}`);
  }
  return `M${pts.join('L')}Z`;
}

/** Trazado del squircle en coordenadas relativas (0..1) para clip-path: path() escalable vía viewBox. */
export const SQUIRCLE_1024 = squirclePath(0, 0, 1024, 1024);

let uid = 0;

/** Monograma «DR» en material de cristal sobre squircle azul. */
export function monogram(size: number, label = ''): string {
  const id = `mono${uid++}`;
  return `<svg class="monogram" width="${size}" height="${size}" viewBox="0 0 1024 1024" ${label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"'} focusable="false">
  <defs>
    <linearGradient id="${id}-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3a9bff"/><stop offset="1" stop-color="#0058c7"/></linearGradient>
    <linearGradient id="${id}-glyph" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#d6e8ff"/></linearGradient>
    <radialGradient id="${id}-spec" cx=".35" cy=".05" r=".75"><stop offset="0" stop-color="#fff" stop-opacity=".45"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/></radialGradient>
    <clipPath id="${id}-clip"><path d="${SQUIRCLE_1024}"/></clipPath>
  </defs>
  <g clip-path="url(#${id}-clip)">
    <rect width="1024" height="1024" fill="url(#${id}-bg)"/>
    <ellipse cx="420" cy="120" rx="620" ry="360" fill="url(#${id}-spec)"/>
    <text x="512" y="668" text-anchor="middle" font-family="Inter Variable, Inter, system-ui, sans-serif" font-weight="760" font-size="460" letter-spacing="-28" fill="#003a8c" opacity=".45" transform="translate(0 16)">DR</text>
    <text x="512" y="668" text-anchor="middle" font-family="Inter Variable, Inter, system-ui, sans-serif" font-weight="760" font-size="460" letter-spacing="-28" fill="url(#${id}-glyph)">DR</text>
  </g>
  <path d="${SQUIRCLE_1024}" fill="none" stroke="#fff" stroke-opacity=".22" stroke-width="12" transform="translate(6 6) scale(.988)"/>
</svg>`;
}
