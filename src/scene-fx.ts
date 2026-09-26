// Efectos de la escena: hover iluminado, sonido de gota y ciclo día/noche de 24 h.
// initSceneFx() se llama cada vez que se monta la escena (carga inicial y cambio de idioma).

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
    playDrop?: () => void;
    skyCycle?: {
      live: () => void;
      demo: (secondsPerDay?: number) => void;
      at: (hhmm: string) => { el: number; az: number };
      sunPosition: (date: Date) => { el: number; az: number };
      readonly mode: string;
    };
  }
}

const NS = 'http://www.w3.org/2000/svg';
type Pt = [number, number];

// ─────────────── 7.1 · Hover iluminado ───────────────
function initHover(svg: SVGSVGElement): void {
  const light = (key: string | null | undefined) => {
    svg.querySelectorAll(':scope > g.is-lit').forEach((g) => g.classList.remove('is-lit'));
    const obj = key ? svg.querySelector(`#obj-${key}`) : null;
    svg.classList.toggle('has-lit', !!obj);
    if (obj) obj.classList.add('is-lit');
  };
  document.querySelectorAll<HTMLElement>('.hotspot[data-open]').forEach((btn) => {
    btn.addEventListener('pointerenter', () => light(btn.dataset.open));
    btn.addEventListener('pointerleave', () => light(null));
    btn.addEventListener('focus', () => light(btn.dataset.open));
    btn.addEventListener('blur', () => light(null));
  });
}

// ─────────────── 7.2 · Sonido de gota ───────────────
let audio: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (!audio) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    audio = new AC();
  }
  if (audio.state === 'suspended') void audio.resume();
  return audio;
}

// Una gota: tono senoidal que sube rápido de frecuencia (la burbuja que resuena) y se apaga.
function blip(ac: AudioContext, dest: AudioNode, t: number, from: number, to: number, dur: number, level: number): void {
  const osc = ac.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(from, t);
  osc.frequency.exponentialRampToValueAtTime(to, t + dur * 0.45);
  const g = ac.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(level, t + 0.006);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g).connect(dest);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

function drop(): void {
  const ac = getCtx();
  if (!ac) return;
  const t = ac.currentTime;
  const k = 0.92 + Math.random() * 0.16; // ligera variación en cada gota
  const master = ac.createGain();
  master.gain.value = 0.45;
  const lp = ac.createBiquadFilter(); // suaviza el brillo para que suene más «acuoso»
  lp.type = 'lowpass';
  lp.frequency.value = 3500;
  master.connect(lp).connect(ac.destination);
  blip(ac, master, t, 520 * k, 1500 * k, 0.16, 0.8); // «plop» principal
  blip(ac, master, t + 0.07, 900 * k, 1900 * k, 0.07, 0.18); // pequeño rebote
}

function initSound(): void {
  window.playDrop = drop;
  document.querySelectorAll<HTMLElement>('.hotspot[data-open]').forEach((btn) => btn.addEventListener('click', drop));
}

// ─────────────── 7.3 · Ciclo día/noche (sol real de Madrid, ecuaciones NOAA) ───────────────
const LAT = 40.4168;
const LON = -3.7038;
const WINDOW_FACING = 270; // la ventana mira al oeste (atardeceres)
const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (e0: number, e1: number, x: number) => {
  const t = clamp((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};

export function sunPosition(date: Date): { el: number; az: number } {
  const start = Date.UTC(date.getUTCFullYear(), 0, 1);
  const doy = Math.floor((date.getTime() - start) / 864e5) + 1;
  const hr = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;
  const g = ((2 * Math.PI) / 365) * (doy - 1 + (hr - 12) / 24);
  const eqt = 229.18 * (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g) - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g));
  const decl =
    0.006918 - 0.399912 * Math.cos(g) + 0.070257 * Math.sin(g) - 0.006758 * Math.cos(2 * g) + 0.000907 * Math.sin(2 * g) - 0.002697 * Math.cos(3 * g) + 0.00148 * Math.sin(3 * g);
  const tst = hr * 60 + eqt + 4 * LON;
  const ha = rad(tst / 4 - 180);
  const lat = rad(LAT);
  const cosZ = Math.sin(lat) * Math.sin(decl) + Math.cos(lat) * Math.cos(decl) * Math.cos(ha);
  const el = 90 - deg(Math.acos(clamp(cosZ, -1, 1)));
  const az = (deg(Math.atan2(Math.sin(ha), Math.cos(ha) * Math.sin(lat) - Math.tan(decl) * Math.cos(lat))) + 180 + 360) % 360;
  return { el, az };
}

// Paletas del cielo según la elevación del sol: noche astronómica (-18°), náutica (-12°),
// hora azul (-6° a -4°), hora dorada (-4° a +6°) y día.
const SKY: [number, string[]][] = [
  [-18, ['#05081a', '#0a1030', '#101a40', '#16224e']],
  [-12, ['#070c24', '#0f1a44', '#1c2a5e', '#2a3a72']],
  [-6, ['#101a4a', '#233873', '#4a5a9a', '#8a7fb0']],
  [-3, ['#1b2a5c', '#43408a', '#b0628a', '#f08a6a']],
  [0, ['#1b2a5c', '#5a3f86', '#e2785c', '#ffc47a']],
  [4, ['#2a4f8f', '#6a7fb8', '#f0a878', '#ffd49a']],
  [10, ['#2c64b0', '#5d95d4', '#a9c9e6', '#f3dcb8']],
  [25, ['#2366c4', '#4f93dc', '#8fc0ea', '#cfe4f5']],
  [60, ['#1a5fc4', '#3f8ae0', '#7db8ee', '#bfdcf6']],
];
const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a: string, b: string, t: number) =>
  '#' + hex(a).map((v, i) => Math.round(v + (hex(b)[i] - v) * t).toString(16).padStart(2, '0')).join('');

function skyAt(el: number): string[] {
  if (el <= SKY[0][0]) return SKY[0][1];
  for (let i = 1; i < SKY.length; i++) {
    if (el <= SKY[i][0]) {
      const [e0, c0] = SKY[i - 1];
      const [e1, c1] = SKY[i];
      const t = (el - e0) / (e1 - e0);
      return c0.map((c, k) => mix(c, c1[k], t));
    }
  }
  return SKY[SKY.length - 1][1];
}

// Geometría isométrica del rayo. Mundo: X hacia dentro desde la pared de la ventana,
// Y a lo largo de ella (Y=0 pared del fondo), h altura en px. Si cambian las coordenadas
// de la ventana en scene.ts (WIN), hay que actualizar esta constante.
const toScreen = (X: number, Y: number, h = 0): Pt => [700 + 0.58 * X - 0.58 * Y, 400 + 0.29 * X + 0.29 * Y - h];
const WIN_PX: Pt[] = [[388, 279], [688, 279], [688, 100], [388, 100]]; // [Y, altura] de las esquinas del hueco
const ROOM = 1100;

function clipToFloor(poly: Pt[]): Pt[] {
  // Sutherland–Hodgman contra el cuadrado 0..ROOM
  const edges = [(p: Pt) => p[0] >= 0, (p: Pt) => p[0] <= ROOM, (p: Pt) => p[1] >= 0, (p: Pt) => p[1] <= ROOM];
  const lerpTo = (a: Pt, b: Pt, k: number, v: number): Pt => {
    const t = (v - a[k]) / (b[k] - a[k]);
    return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  };
  const bounds: [number, number][] = [[0, 0], [0, ROOM], [1, 0], [1, ROOM]];
  let out = poly;
  edges.forEach((inside, i) => {
    const inp = out;
    out = [];
    inp.forEach((cur, j) => {
      const prev = inp[(j + inp.length - 1) % inp.length];
      const [k, v] = bounds[i];
      if (inside(cur)) {
        if (!inside(prev)) out.push(lerpTo(prev, cur, k, v));
        out.push(cur);
      } else if (inside(prev)) out.push(lerpTo(prev, cur, k, v));
    });
  });
  return out;
}

function hull(pts: Pt[]): Pt[] {
  const p = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cr = (o: Pt, a: Pt, b: Pt) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo: Pt[] = [];
  const up: Pt[] = [];
  for (const q of p) {
    while (lo.length > 1 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop();
    lo.push(q);
  }
  for (const q of p.reverse()) {
    while (up.length > 1 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop();
    up.push(q);
  }
  return lo.slice(0, -1).concat(up.slice(0, -1));
}
const fmt = (pts: Pt[]) => pts.map((p) => p.map((v) => v.toFixed(1)).join(',')).join(' ');

let skyTimer: number | undefined;

function initSky(svg: SVGSVGElement): void {
  const win = svg.querySelector<SVGGElement>('#obj-contact > g');
  const defs = svg.querySelector('defs');
  if (!win || !defs) return;
  const kids = [...win.children];
  const skyRect = kids.find((e) => e.getAttribute('fill') === 'url(#g-sky)');
  const sunGlow = win.querySelector<SVGCircleElement>('.sun');
  const sunCore = sunGlow?.nextElementSibling as SVGCircleElement | null;
  const city = kids.find((e) => e.tagName === 'g' && e.getAttribute('fill') === '#0a1226');
  if (!skyRect || !sunGlow || !sunCore || !city) return;

  // Preparar la ventana: recorte, estrellas y luna
  if (!svg.querySelector('#win-clip')) {
    defs.insertAdjacentHTML('beforeend', '<clipPath id="win-clip"><rect x="0" y="0" width="300" height="320"/></clipPath>');
    const inner = document.createElementNS(NS, 'g');
    inner.setAttribute('clip-path', 'url(#win-clip)');
    skyRect.after(inner);
    inner.append(skyRect);
    const stars = document.createElementNS(NS, 'g');
    stars.setAttribute('class', 'stars');
    for (let i = 0; i < 34; i++) {
      const c = document.createElementNS(NS, 'circle');
      c.setAttribute('cx', (Math.random() * 300).toFixed(1));
      c.setAttribute('cy', (Math.random() * 210).toFixed(1));
      c.setAttribute('r', (Math.random() * 1.1 + 0.5).toFixed(2));
      c.setAttribute('fill', '#e9f0ff');
      c.style.setProperty('--i', String(i));
      stars.append(c);
    }
    inner.append(stars);
    inner.insertAdjacentHTML(
      'beforeend',
      '<g class="moon"><circle r="30" fill="#cfd9ff" opacity=".12"/><circle r="15" fill="#eef2fb"/>' +
        '<circle cx="-4" cy="-3" r="3" fill="#d5dcec"/><circle cx="5" cy="4" r="2.2" fill="#d5dcec"/></g>',
    );
    inner.append(sunGlow, sunCore, city);
  }

  const stars = win.querySelector<SVGGElement>('.stars')!;
  const moon = win.querySelector<SVGGElement>('.moon')!;
  const skyStops = [...svg.querySelectorAll('#g-sky stop')];
  const sunStops = [...svg.querySelectorAll('#g-sun stop')];
  const poolStop = svg.querySelector('#g-pool stop');
  const winGlow = svg.querySelector<SVGElement>('#obj-contact .win-glow');
  const beam = svg.querySelector<SVGGElement>('#beam');
  const patch = svg.querySelector<SVGPolygonElement>('.beam-patch');
  const patchWrap = svg.querySelector<SVGGElement>('.beam-patch-wrap');
  const patchGrad = svg.querySelector('#g-patch');
  if (!beam || !patch || !patchWrap || !patchGrad || !poolStop || !winGlow) return;
  const beamVol = beam.querySelector<SVGPolygonElement>('.beam-vol')!;
  const beamStops = [...svg.querySelectorAll('#g-beam stop')];
  const patchStops = [...patchGrad.querySelectorAll('stop')];

  // Envoltorios para regular la intensidad del sol directo sin pisar las animaciones existentes
  let beamSun = beam.querySelector<SVGGElement>('.beam-sun');
  if (!beamSun) {
    beamSun = document.createElementNS(NS, 'g');
    beamSun.setAttribute('class', 'beam-sun');
    beamSun.append(...beam.childNodes);
    beam.append(beamSun);
  }
  let patchSun = patchWrap.querySelector<SVGGElement>('.beam-patch-sun');
  if (!patchSun) {
    patchSun = document.createElementNS(NS, 'g');
    patchSun.setAttribute('class', 'beam-patch-sun');
    patchSun.append(patch);
    patchWrap.append(patchSun);
  }

  function render(date: Date): void {
    const { el, az } = sunPosition(date);
    const rel = ((az - WINDOW_FACING + 540) % 360) - 180; // acimut relativo a la ventana (0 = de frente)

    // Cielo
    const sky = skyAt(el);
    skyStops.forEach((s, i) => s.setAttribute('stop-color', sky[i]));

    // Sol dentro del marco: el horizonte está en y≈305 (base de los edificios)
    const sx = 150 + rel * 3.2;
    const sy = 305 - el * 6;
    const sunVis = smooth(-3, 1, el);
    [sunGlow!, sunCore!].forEach((c) => {
      c.setAttribute('cx', sx.toFixed(1));
      c.setAttribute('cy', sy.toFixed(1));
    });
    sunCore!.setAttribute('fill', mix('#ffd9a0', '#fffbef', smooth(2, 25, el)));
    sunCore!.setAttribute('r', (34 - 8 * smooth(0, 30, el)).toFixed(1)); // más grande junto al horizonte
    sunGlow!.style.opacity = String(sunVis);
    sunCore!.style.opacity = String(sunVis);
    sunStops[1]?.setAttribute('stop-color', mix('#ff9e5e', '#fff0c8', smooth(2, 25, el)));

    // Luna (aprox. opuesta al sol) y estrellas
    const night = smooth(-4, -14, el);
    const mRel = ((az + 180 - WINDOW_FACING + 540) % 360) - 180;
    moon.setAttribute('transform', `translate(${(150 + mRel * 3.2).toFixed(1)} ${(305 + el * 6).toFixed(1)})`);
    moon.style.opacity = String(smooth(-2, -8, el));
    stars.style.opacity = String(night);

    // Ciudad: silueta de noche; de día más visible y con menos ventanas encendidas
    const day = smooth(-2, 12, el);
    city!.setAttribute('fill', mix('#0a1226', '#34466d', day));
    city!.querySelectorAll<SVGElement>('.lit').forEach((l) => (l.style.opacity = String(1 - 0.85 * day)));

    // Resplandor de la ventana sobre la pared y el suelo
    poolStop!.setAttribute('stop-color', el > -6 ? mix('#ffc47a', '#dbeaff', smooth(4, 25, el)) : '#8aa2ff');
    winGlow!.style.opacity = (0.35 + 0.65 * Math.max(day, 0.4 * smooth(-12, -4, el))).toFixed(2);

    // Rayo directo: solo si el sol está sobre el horizonte y entra por la ventana
    const cosEl = Math.cos(rad(el));
    const LX = -Math.sin(rad(az)) * cosEl; // avance hacia el interior
    const LY = Math.cos(rad(az)) * cosEl; // deriva a lo largo de la pared
    const intensity = smooth(0.5, 6, el) * smooth(0.05, 0.35, LX);
    beamSun!.style.opacity = intensity.toFixed(3);
    patchSun!.style.opacity = intensity.toFixed(3);
    patchWrap!.style.display = intensity < 0.01 ? 'none' : '';
    if (intensity >= 0.01) {
      const d = Math.tan(rad(el)) / LX;
      const s = LY / LX;
      const floor = clipToFloor(WIN_PX.map(([Y, h]): Pt => {
        const X = h / d;
        return [X, Y + s * X];
      }));
      const pts = floor.map(([X, Y]) => toScreen(X, Y));
      patch!.setAttribute('points', fmt(pts));
      // Con el sol muy bajo el rayo no llega al suelo dentro de la sala: el haz termina en el
      // borde abierto (X = ROOM) a la altura que tenga allí, y cruza el escritorio.
      const ends = WIN_PX.map(([Y, h]) => {
        const X = Math.min(h / d, ROOM);
        return toScreen(X, Y + s * X, Math.max(0, h - d * X));
      });
      beamVol.setAttribute('points', fmt(hull(WIN_PX.map(([Y, h]) => toScreen(0, Y, h)).concat(pts, ends))));
      // Degradado de la mancha: del borde cercano a la ventana al más lejano
      const near = toScreen(100 / d, 538 + (s * 100) / d);
      const far = toScreen(279 / d, 538 + (s * 279) / d);
      patchGrad!.setAttribute('x1', near[0].toFixed(1));
      patchGrad!.setAttribute('y1', near[1].toFixed(1));
      patchGrad!.setAttribute('x2', far[0].toFixed(1));
      patchGrad!.setAttribute('y2', far[1].toFixed(1));
      // Color: anaranjado con el sol bajo, casi blanco a mediodía
      const warm = smooth(4, 30, el);
      beamStops[0]?.setAttribute('stop-color', mix('#ffb35c', '#fff2d6', warm));
      beamStops[1]?.setAttribute('stop-color', mix('#ff9e3d', '#ffe9c2', warm));
      patchStops[0]?.setAttribute('stop-color', mix('#ffc47a', '#fff4de', warm));
      patchStops[1]?.setAttribute('stop-color', mix('#ffa347', '#ffe7bd', warm));
    }
  }

  // Reloj
  let mode = 'live';
  const stop = () => window.clearInterval(skyTimer);
  const live = () => {
    mode = 'live';
    stop();
    render(new Date());
    skyTimer = window.setInterval(() => render(new Date()), 30000);
  };
  const demo = (secondsPerDay = 60) => {
    mode = 'demo';
    stop();
    const base = new Date();
    base.setUTCHours(0, 0, 0, 0);
    const t0 = performance.now();
    skyTimer = window.setInterval(() => {
      const frac = ((performance.now() - t0) / 1000 / secondsPerDay) % 1;
      render(new Date(base.getTime() + frac * 864e5));
    }, 50);
  };
  const at = (hhmm: string) => {
    // hora de Madrid
    stop();
    mode = 'fixed';
    const [h, m] = hhmm.split(':').map(Number);
    const now = new Date();
    const madrid = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Madrid' }));
    const offset = madrid.getTime() - new Date(now.toLocaleString('en-US', { timeZone: 'UTC' })).getTime();
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), h, m) - offset);
    render(d);
    return sunPosition(d);
  };
  window.skyCycle = {
    live,
    demo,
    at,
    sunPosition,
    get mode() {
      return mode;
    },
  };
  live();
}

export function initSceneFx(): void {
  const svg = document.querySelector<SVGSVGElement>('.scene-svg');
  if (!svg) return;
  initHover(svg);
  initSound();
  initSky(svg);
}
