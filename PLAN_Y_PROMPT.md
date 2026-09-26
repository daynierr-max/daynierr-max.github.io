# CV interactivo "Night Ops" — Plan de trabajo y prompt para Claude Code

## 1. El GOAL
**Que un reclutador, en menos de 90 segundos, entienda quién eres, qué sabes hacer y cómo contactarte, y se quede con la idea de que te tomaste el tiempo de construir algo distinto.**

Métricas de éxito del producto:
- Modo reclutador y PDF a **1 clic** desde cualquier punto.
- Carga < 2,5 s, 60 fps, Lighthouse ≥ 90 en rendimiento y ≥ 95 en accesibilidad.
- Funciona en móvil, con teclado y con animaciones reducidas.
- Cero datos inventados: todo sale de tu CV real.

## 2. Concepto
Una sala de operaciones nocturna en vista isométrica, animada en bucle (mismo género que la ilustración que te gustó, pero con escena, paleta y personaje propios). Tú trabajas en tu puesto; alrededor hay objetos que cuentan tu perfil: rack de servidores (Azure/infra), escudo (ciberseguridad), red de nodos (IA/MCP), pantalla con gráfico de rotación (proyectos propios), estantería (experiencia), tablón (certificaciones), una terminal oculta (easter egg) y una ventana al amanecer (contacto). El mapa completo está en `CLAUDE.md`.

Por qué funciona: el diseño ya demuestra lo que dices saber (código, automatización, cuidado por el detalle), y el modo reclutador evita que la creatividad se convierta en un obstáculo.

## 3. Fases

| Fase | Entregable | Criterio de cierre |
|---|---|---|
| 0. Preparación (tú) | Repo creado, `CLAUDE.md` y tu CV en `/docs` | Archivos en el repo |
| 1. Esqueleto | Vite + TS, estructura, CI, deploy vacío en GitHub Pages | Build y deploy en verde |
| 2. Contenido | `cv.es.json` / `cv.en.json` extraídos de tu CV + `CONTENT_TODO.md` | Tú revisas y apruebas los datos |
| 3. Modo reclutador | CV clásico semántico + botón PDF + selector de idioma | Legible, imprimible, accesible |
| 4. Escena estática | Sala isométrica SVG con todos los objetos y hotspots | Capturas escritorio y móvil correctas |
| 5. Animación | Bucle ambiental + micro-interacciones + paneles | 60 fps, reduced-motion respetado |
| 6. Easter eggs | Terminal con comandos | Funciona con teclado |
| 7. Calidad | Tests Playwright, Lighthouse CI, OG image, SEO | Todo en verde |
| 8. Lanzamiento | URL pública, enlace en CV PDF, LinkedIn y README de GitHub | Enlace compartido |

## 4. Lo que necesitas hacer antes (fase 0)
1. Crea el repo en GitHub: `daynierr-max/cv` (o `daynierr-max.github.io` si quieres la URL raíz).
2. Clónalo, copia dentro `CLAUDE.md` (de esta carpeta) y crea `/docs/` con tu `Daynier_Rodriguez_CV2026.pdf` (o .docx).
3. Abre Claude Code en esa carpeta. Recomendado: **auto mode**, para que el goal avance sin pedirte permiso en cada comando.

## 5. Prompt de arranque (pégalo primero)

```text
Lee CLAUDE.md y el CV que hay en /docs. Vamos a construir el CV interactivo descrito ahí.

Antes de escribir código:
1. Extrae todos los datos del CV a src/data/cv.es.json y crea la versión en inglés cv.en.json. No inventes nada; lo que falte, márcalo "TODO" y lístalo en CONTENT_TODO.md.
2. Muéstrame un resumen del contenido extraído y la lista de TODO, y espera mi confirmación.

Después, trabaja por las fases 1 a 8 de PLAN_Y_PROMPT.md en orden, con un commit por fase.
```

## 6. Comando /goal (pégalo cuando hayas aprobado el contenido)

`/goal` hace que Claude Code siga trabajando turno tras turno hasta que un evaluador confirme que la condición se cumple. Como el evaluador solo lee la conversación (no ejecuta nada), la condición pide que Claude muestre las pruebas en el transcript.

```text
/goal El CV interactivo descrito en CLAUDE.md está terminado y desplegado, y lo demuestras mostrando en la conversación la salida de cada comprobación: (1) `npm run build` termina con código 0; (2) `npm run test` (Playwright) pasa al 100 % e incluye tests de: cada hotspot abre su sección con clic y con teclado (Tab + Enter), Esc cierra el panel, el botón "Modo reclutador" y el enlace al PDF son visibles y funcionan desde la carga inicial, el selector ES/EN cambia los textos, con prefers-reduced-motion no hay animaciones en marcha, y a 375 px de ancho no hay scroll horizontal; (3) `npm run lhci` da rendimiento ≥ 90, accesibilidad ≥ 95, buenas prácticas ≥ 95 y SEO ≥ 95; (4) el JS inicial pesa menos de 150 KB gzip según la salida del build; (5) muestras las rutas de las capturas de escritorio (1440×900) y móvil (375×812) de la escena y del modo reclutador, y confirmas que las revisaste; (6) `git status` limpio y el workflow de GitHub Pages terminó en verde con la URL pública indicada. Restricciones: no modificar los datos de src/data/*.json salvo corregir erratas de formato; no inventar contenido; no usar imágenes de terceros ni copiar la obra "9 to 5" de DeeKay. O detente tras 40 turnos e informa de lo que falta.
```

Consejos:
- `/goal` sin argumentos te muestra el estado; `/goal clear` lo detiene.
- Si prefieres ir por partes, usa un goal por fase (por ejemplo, solo las fases 1–3) y revisa entre medias. Para un proyecto visual suele dar mejor resultado, porque el gusto estético lo tienes que validar tú.

## 7. Revisión humana (lo que el goal no puede juzgar)
Tras cada fase visual, revisa tú las capturas y responde con cambios concretos ("el rack más grande", "menos cian", "la animación del avatar más lenta"). El goal garantiza que funciona; tú decides si impresiona.

## 8. Lanzamiento
- Pon la URL en la cabecera del CV en PDF, en el "Destacado" de LinkedIn y en el README de perfil de GitHub.
- Añade una línea en el CV PDF: "Versión interactiva: <url>". El PDF sigue siendo lo que se sube a los portales de empleo; la web es el factor diferenciador cuando alguien hace clic.
