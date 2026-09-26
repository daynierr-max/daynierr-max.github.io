# CLAUDE.md — CV interactivo de Daynier Rodríguez

## Qué es este proyecto
Un CV web interactivo con una **ilustración isométrica animada en bucle** como interfaz. El reclutador explora una sala (un "centro de operaciones" nocturno) y cada objeto abre una sección del CV. Objetivo de negocio: que un reclutador entienda el perfil en **menos de 90 segundos** y piense "esta persona se toma su tiempo y hace cosas distintas".

## Regla de oro: no hacer perder tiempo
- **Modo reclutador** siempre visible (botón fijo arriba a la derecha): un clic muestra el CV clásico en una sola columna, legible y escaneable.
- **Descargar PDF** siempre visible junto a él (`/public/Daynier_Rodriguez_CV2026.pdf`).
- Pista inicial de 3 s ("Haz clic en los objetos · o pulsa Modo reclutador") que desaparece sola.
- Nada bloquea el contenido: sin pantallas de carga largas, sin intros obligatorias, sin audio automático.

## Dirección visual
- Inspiración de **género**: ilustración isométrica en bucle, oscura y vibrante (tipo "9 to 5" de DeeKay). **No copiar esa obra**: ni su composición, ni su personaje, ni su oficina roja con puerta EXIT. La escena es original.
- Escena propia: sala de operaciones nocturna, vista isométrica 2:1. Paleta base azul noche / cian / ámbar (no rojo). Luz volumétrica desde una ventana, polvo flotando, pantallas que parpadean.
- Personaje: avatar original y genérico (sin parecido a ningún personaje conocido), trabajando en su puesto, animación sutil (teclear, girar la silla, respirar).
- Todo dibujado con **SVG generado por código** (formas isométricas desde funciones utilitarias), sin imágenes externas de terceros.

## Mapa de la escena → secciones del CV
| Objeto (hotspot) | Sección | Micro-interacción |
|---|---|---|
| Escritorio con monitores + avatar | Sobre mí / perfil | El avatar se gira y "saluda" |
| Rack de servidores con LEDs | Infraestructura y Azure | Los LEDs se encienden en secuencia |
| Escudo holográfico / candado | Ciberseguridad (Google Cybersecurity Certificate) | El escudo pulsa y muestra "verified" |
| Pantalla de nodos conectados por cables | IA y MCP (servidores MCP, skills agénticas, Anthropic Academy) | Los cables se iluminan de nodo a nodo |
| Pantalla con gráfico de rotación (RRG) | Proyectos personales (screener sectorial, herramientas propias) | El gráfico anima su trayectoria |
| Estantería con carpetas | Experiencia laboral (timeline) | Las carpetas se abren en orden |
| Tablón de corcho con diplomas | Certificaciones y formación | Las chinchetas caen una a una |
| Terminal flotante | Easter egg: terminal con comandos `help`, `whoami`, `skills`, `contact`, `cv --pdf` | Cursor parpadeante |
| Puerta / ventana al amanecer | Contacto ("¿Hablamos?") | Se abre y entra luz |

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
