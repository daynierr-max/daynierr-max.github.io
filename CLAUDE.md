# CLAUDE.md — CV interactivo de Daynier Rodríguez

## Qué es este proyecto
Un CV web presentado como la **ficha de una app**, con la ilustración isométrica animada (una sala de operaciones nocturna) como imagen protagonista. Cada objeto de la sala y cada «app» de la estantería abre una sección del CV. Objetivo de negocio: que un reclutador entienda el perfil en **menos de 90 segundos** y piense «esta persona se toma su tiempo y hace cosas distintas».

## Regla de oro: no hacer perder tiempo
- **Leer ahora (modo lectura)** siempre a un toque desde la cabecera: muestra el CV clásico, legible y escaneable.
- **Descargar CV (PDF)** siempre visible en la barra (`/public/Daynier_Rodriguez_CV2026.pdf`). **Un solo botón de PDF por vista.**
- Pista inicial de 3 s que desaparece sola: «Haz clic en los objetos» con puntero y «Toca» en pantallas táctiles. Nunca tapa contenido.
- Nada bloquea el contenido: sin pantallas de carga largas, sin intros obligatorias, sin audio automático.
- Sonido: solo una gota breve (Web Audio, sin archivos) **al hacer clic** en un objeto de la sala, por decisión del usuario (26/09/2026). Nunca audio al cargar ni en bucle.

## Dirección visual (v2 · «tu perfil como la ficha de una app»)
Detalle completo en `PLAN_V2_APPSTORE.md`. Se presenta el perfil con el **lenguaje de diseño** de una ficha de app al estilo Apple: tipografía, tarjetas, materiales y movimiento.
- **Límite legal y de marca**: nada de logo de Apple, ni la palabra «App Store», ni la fuente SF Pro, ni iconos de Apple. **Prohibido inventar valoraciones, reseñas o estrellas.**
- La sala isométrica nocturna se mantiene como **imagen protagonista** de la ficha, no como toda la interfaz. Sigue siendo SVG generado por código, original (inspiración de género, sin copiar «9 to 5» de DeeKay) y sin imágenes de terceros.

### Estructura de la página (de arriba abajo)
1. **Barra de cristal** fija (`backdrop-filter: blur(20px) saturate(180%)`): monograma, nombre, ES/EN, claro/oscuro y el botón «Descargar CV» en píldora.
2. **Cabecera de producto**: icono squircle «DR» de 128–160 px, nombre en display de 48–72 px (peso 700, tracking −0.03em), subtítulo, botón primario «Obtener CV» (PDF) y secundario «Leer ahora» (modo lectura).
3. **Fila de datos clave** en columnas con separadores finos, todo desde el JSON: experiencia 10+ años · certificaciones · ubicación · idiomas · disponibilidad.
4. **Tarjeta protagonista con la sala**:
   - Se expande con el scroll (`animation-timeline: view()`, con fallback).
   - Parallax o inclinación ≤ 6° que sigue al puntero.
   - Interruptor «Encender la luz» que pasa de noche a amanecer.
   - Hotspots como mini-iconos de cristal (sin los puntos naranjas).
5. **Estantería de 8 «apps»** con scroll-snap: Infra y Azure, Ciberseguridad, IA y MCP, Proyectos, Experiencia, Certificaciones, Terminal y Contacto. Cada una abre su hoja con una transición de tarjeta que se expande (View Transitions API, con fallback).
6. **Vista previa**: carrusel de proyectos con stack en chips y «Ver en GitHub».
7. **Novedades — Versión 2026**: ASIR en curso, AZ-104 en preparación y último proyecto.
8. **Historial de versiones**: la experiencia como versiones (`v2014 · ETECSA` … `v2025 · Televida`).
9. **Información**: tabla final de la ficha, todo real (proveedor, categoría, compatibilidad, idiomas, tamaño real del bundle, ubicación).
10. **Contacto**: tarjeta grande con email, LinkedIn y GitHub, y «Obtener CV».

### Tokens del sistema de diseño
| Token | Valor |
|---|---|
| Tipografía | **Inter** variable, autoalojada (`@fontsource-variable/inter`, CSP `font-src 'self'`). Monoespaciada **solo** en la terminal |
| Escala | 12 / 15 / 17 (cuerpo) / 22 / 28 / 34 / 48 / 72 · interlineado 1.1 en titulares y 1.5 en texto |
| Acento único | Azul. **Relleno de botón** `#0071E3` (texto blanco, 4.6:1). **Texto/enlaces**: `#0066CC` en claro y `#2997FF` en oscuro. **Texto sobre relleno gris**: `#0062C4` / `#4AA8FF`. Todo ≥ 4.5:1, verificado por `tests/contrast.spec.ts`. El ámbar y el cian quedan solo dentro de la ilustración |
| Neutros oscuros | `#000` · `#0B0B0F` · superficie `#1C1C1E` · elevada `#2C2C2E` · texto `#F5F5F7` · secundario `#A1A1A6` |
| Neutros claros | `#F5F5F7` · superficie `#FFF` · texto `#1D1D1F` · secundario `#6E6E73` |
| Radios | Tarjetas de 22 px · hojas de 28 px · iconos en **squircle real** (trazado de superelipse) |
| Sombras | `0 1px 2px rgb(0 0 0/.06), 0 8px 24px rgb(0 0 0/.12)`; en oscuro, además, un borde interior de 1 px en blanco al 8 % |
| Movimiento | Curvas de muelle con `linear()`, de 350–550 ms y como mucho un rebote. Con reduced-motion, fundidos de 150 ms |
| Tema | Claro/oscuro según el sistema, con conmutador guardado en `localStorage` |

### Receta de iconos (SVG en código, rejilla de 1024)
1. Fondo squircle con un degradado de dos tonos cercanos (el claro arriba a la izquierda).
2. Glifo simple con volumen (2–3 capas de extrusión y sombra propia), luz desde arriba a la izquierda.
3. Brillo especular: una elipse blanca en el tercio superior, al 18–25 %.
4. Borde interior de 1,5 px en blanco al 20 % y sombra exterior suave.
5. Como mucho 3 colores por icono y la misma luz en todos, para que formen una familia.

| Icono | Glifo | Degradado |
|---|---|---|
| Infra y Azure | rack con LEDs | azul marino → azul |
| Ciberseguridad | escudo con candado | índigo → violeta |
| IA y MCP | 3 nodos conectados | verde azulado → cian |
| Proyectos | gráfico con curva | naranja → rosa |
| Experiencia | maletín / carpeta | grafito → gris |
| Certificaciones | medalla o sello | dorado → ámbar |
| Terminal | `>_` | negro → grafito |
| Contacto | sobre / avión de papel | azul → celeste |

### Ilustración
- Caras con degradado, sombras de contacto bajo los muebles y bloom en pantallas y LEDs con **un único filtro SVG compartido**.
- Fondo más frío y menos contrastado. El rótulo «NIGHT OPS» se elimina o se convierte en un neón pequeño y sutil.
- Amanecer («Encender la luz»): cielo cálido, pantallas atenuadas y el avatar se estira.
- Se conservan las micro-interacciones por objeto: saludo, LEDs en secuencia, escudo «verified», cables, RRG, carpetas, chinchetas, cursor y ventana.
- **Rendimiento del bloque E+F (medido con `npm run fps` en Chrome con GPU; ≥ 55 fps en bucle, hover, inclinación y scroll)**:
  - Nada de `backdrop-filter` sobre la sala animada (chips e interruptor usan cristal semitransparente): desenfocar una escena que cambia cada frame costaba ~15 fps.
  - La expansión con el scroll anima **solo `transform`** (+ `will-change`); animar `border-radius` repintaba la franja y el scroll caía a ~40 fps.
  - La inclinación 3D es un «diorama»: al inclinarse, el bucle de la sala se pausa; al señalar un objeto se endereza y solo ese objeto se anima. Inclinar una capa que se anima cada frame caía a ~25 fps.
  - El bloom usa un único filtro (`#f-bloom`) y solo sobre capas de brillo estáticas.
- **Escena v2 (aplicada)**: avatar estilo figura de juguete (gorra, barba, auriculares cian), taza a la derecha del ratón, zamioculca en maceta cubo, hover que ilumina el objeto y atenúa el resto (con `opacity` y el bucle del resto en pausa, para mantener 60 fps), y **ciclo día/noche de 24 h con la posición real del sol en Madrid** (NOAA; ventana al oeste: el rayo directo solo entra por la tarde). Código en `src/scene-fx.ts`; desde la consola: `skyCycle.demo(60)`, `skyCycle.at('07:45')`, `skyCycle.live()`.

### Modo lectura (antes «modo reclutador»)
- En ≥ 1024 px, dos columnas: la lateral fija con monograma, contacto, idiomas, disponibilidad y certificaciones; la principal con resumen, experiencia y proyectos. En móvil, una columna.
- Resumen en ≤ 3 líneas más 4 viñetas; habilidades agrupadas en chips, sin niveles inventados; **un solo botón de PDF por vista**.
- `@media print`: CV limpio de ≤ 2 páginas A4, sin la escena ni la barra.

## Contenido
- **Fuente única de verdad:** `src/data/cv.es.json` y `src/data/cv.en.json`.
- Los datos se extraen del CV real (`/docs/Daynier_Rodriguez_CV2026.pdf` o el .docx que se aporte). **Prohibido inventar** empresas, fechas, cifras, logros o tecnologías. Si falta un dato, dejar `"TODO"` y listarlo en `CONTENT_TODO.md`.
- No mencionar motivos de salida de empleos anteriores.
- Bilingüe ES / EN con selector; ES por defecto.

## Stack
- Vite + TypeScript (vanilla o Preact, sin frameworks pesados).
- SVG inline + CSS animations; GSAP solo si hace falta para timelines.
- Playwright para tests e2e; Lighthouse CI para rendimiento/accesibilidad.
- Despliegue: GitHub Pages desde GitHub Actions (usuario `daynierr-max`).

## Requisitos no negociables
- `prefers-reduced-motion`: animaciones detenidas, escena estática, todo accesible igual.
- Teclado: todos los hotspots alcanzables con Tab, activables con Enter/Espacio, foco visible, `Esc` cierra paneles.
- Lectores de pantalla: cada hotspot es un `<button>` con `aria-label`; el modo reclutador es HTML semántico.
- Móvil (375 px): la escena se convierte en carrusel/scroll vertical de "tarjetas-objeto"; sin scroll horizontal.
- Rendimiento: JS inicial < 150 KB gzip, LCP < 2,5 s, 60 fps en el bucle (usar `transform`/`opacity`, nada de animar `top/left`).
- SEO/compartir: `<title>`, meta description, Open Graph con imagen generada de la escena, `schema.org/Person`.

## Comandos
- `npm run dev` · `npm run build` · `npm run preview`
- `npm run test` (Playwright) · `npm run lhci` (Lighthouse CI)

## Forma de trabajar
- Commits pequeños por fase. Antes de dar una fase por cerrada: build + tests en verde.
- Tras cada cambio visual, hacer captura con Playwright (`/screenshots/`) de escritorio (1440×900) y móvil (375×812) y revisarla.
