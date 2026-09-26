// Utilidades de proyección isométrica 2:1.
// Mundo: x hacia la derecha-abajo, y hacia la izquierda-abajo, z hacia arriba.

export const S = 58; // px por unidad en x/y
export const Z = 56; // px por unidad en z
export const OX = 700;
export const OY = 400;
export const VIEW_W = 1400;
export const VIEW_H = 1060;

export type V3 = [number, number, number];
export type V2 = [number, number];

const r1 = (n: number) => Math.round(n * 10) / 10;

export const P = (x: number, y: number, z = 0): V2 => [OX + (x - y) * S, OY + ((x + y) * S) / 2 - z * Z];

export const pts = (ps: V3[]): string => ps.map(([x, y, z]) => P(x, y, z).map(r1).join(',')).join(' ');

export const poly = (ps: V3[], fill: string, extra = ''): string => `<polygon points="${pts(ps)}" fill="${fill}"${extra ? ' ' + extra : ''}/>`;

/** Oscurece (amt < 0) o aclara (amt > 0) un color hex. */
export function shade(hex: string, amt: number): string {
  const n = parseInt(hex.slice(1), 16);
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) =>
    Math.max(0, Math.min(255, Math.round(amt < 0 ? c * (1 + amt) : c + (255 - c) * amt))),
  );
  return '#' + ch.map((c) => c.toString(16).padStart(2, '0')).join('');
}

export interface Faces {
  top: string;
  left: string; // cara en y+d (mira hacia abajo-izquierda)
  right: string; // cara en x+w (mira hacia abajo-derecha)
}

export const faces = (base: string): Faces => ({ top: shade(base, 0.12), left: shade(base, -0.18), right: shade(base, -0.38) });

/** Caja sólida: dibuja solo las tres caras visibles. */
export function box(x: number, y: number, z: number, w: number, d: number, h: number, c: string | Faces, attrs = ''): string {
  const f = typeof c === 'string' ? faces(c) : c;
  const X = x + w;
  const Y = y + d;
  const T = z + h;
  return `<g${attrs ? ' ' + attrs : ''}>${poly(
    [
      [x, Y, z],
      [X, Y, z],
      [X, Y, T],
      [x, Y, T],
    ],
    f.left,
  )}${poly(
    [
      [X, y, z],
      [X, Y, z],
      [X, Y, T],
      [X, y, T],
    ],
    f.right,
  )}${poly(
    [
      [x, y, T],
      [X, y, T],
      [X, Y, T],
      [x, Y, T],
    ],
    f.top,
  )}</g>`;
}

const m = (a: number, b: number, c: number, d: number, [e, f]: V2) => `matrix(${[a, b, c, d, e, f].map((n) => r1(n * 1000) / 1000).join(' ')})`;

// Transformaciones para dibujar en 2D sobre un plano. 1 unidad local = 1/100 de unidad de mundo.
/** Plano y = cte (pared derecha, frentes de monitor): u → +x, v → −z. */
export const onPlaneY = (x: number, y: number, z: number) => m(S / 100, S / 200, 0, Z / 100, P(x, y, z));
/** Plano x = cte (pared izquierda): u → −y, v → −z. */
export const onPlaneX = (x: number, y: number, z: number) => m(S / 100, -S / 200, 0, Z / 100, P(x, y, z));
/** Plano z = cte (suelo, superficies): u → +x, v → +y. */
export const onPlaneZ = (x: number, y: number, z: number) => m(S / 100, S / 200, -S / 100, S / 200, P(x, y, z));

/** Caja envolvente en pantalla de un conjunto de cajas de mundo [x0,y0,z0,x1,y1,z1]. */
export function screenBounds(boxes: [number, number, number, number, number, number][]): { x: number; y: number; w: number; h: number } {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const [x0, y0, z0, x1, y1, z1] of boxes) {
    for (const x of [x0, x1]) for (const y of [y0, y1]) for (const z of [z0, z1]) {
      const [sx, sy] = P(x, y, z);
      minX = Math.min(minX, sx);
      maxX = Math.max(maxX, sx);
      minY = Math.min(minY, sy);
      maxY = Math.max(maxY, sy);
    }
  }
  return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
}

/** Envolvente convexa (monotone chain) de puntos de pantalla. */
export function hull(points: V2[]): V2[] {
  const p = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o: V2, a: V2, b: V2) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower: V2[] = [];
  for (const q of p) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], q) <= 0) lower.pop();
    lower.push(q);
  }
  const upper: V2[] = [];
  for (const q of p.reverse()) {
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], q) <= 0) upper.pop();
    upper.push(q);
  }
  return [...lower.slice(0, -1), ...upper.slice(0, -1)];
}

export const path2 = (ps: V2[]) => ps.map(([x, y]) => `${r1(x)},${r1(y)}`).join(' ');
