# CV interactivo v2: auditoría y plan hacia un estilo App Store

Revisión hecha sobre el repo `daynierr-max/daynierr-max.github.io` (commit `3d6e394`), compilado y capturado a 1440×900 y 390×844. Las capturas están en `auditoria/`.

---

## 1. Diagnóstico: por qué se ve «novato»

La base técnica es buena: el CV está en JSON, hay tests y Lighthouse en verde, y la web respeta la accesibilidad y el modo de movimiento reducido. El problema está en el **acabado visual y en la jerarquía**, no en la arquitectura.

| # | Problema | Dónde | Por qué resta |
|---|---|---|---|
| 1 | **No hay mensaje de entrada.** Lo primero que se ve es una habitación sin explicar quién eres ni qué ofreces | Portada | En 5 s el reclutador tiene que leer tu puesto y tu propuesta, no descubrirlos |
| 2 | **Tipografía de sistema** (en Windows y Linux cae en Segoe o DejaVu) y el subtítulo del header en monoespaciada | Header y todo el sitio | Es la señal nº 1 de «plantilla». Apple trabaja con tipografía grande, apretada y muy contrastada |
| 3 | **Los hotspots son puntos naranjas genéricos** | Escena | Parecen marcadores de mapa, no una interfaz cuidada |
| 4 | **Iluminación plana**: caras de color sólido, sin sombras de contacto ni brillo en las pantallas; el rótulo «NIGHT OPS» en mayúsculas espaciadas | Escena | La ilustración queda «vectorial básica», lejos del nivel de la referencia |
| 5 | **Dos acentos compitiendo** (ámbar y cian) y un tercer color «papel» en el modo reclutador | Global | Falta un sistema de color: Apple usa un solo acento |
| 6 | **Paneles con aspecto de documento**: lista de texto, enlaces subrayados y píldoras mono | Panel lateral | Nada visual: sin iconos, capturas ni jerarquía de tarjeta |
| 7 | **El modo reclutador parece un Word**: una hoja crema de una columna, el perfil en un bloque de ~100 palabras y el PDF duplicado (en el header y en la hoja) | Modo reclutador | Es la vista que más se va a usar y es la menos trabajada |
| 8 | **Bug en móvil**: la pista «Haz clic en los objetos» flota encima de las tarjetas y dice «clic» en una pantalla táctil | Móvil (captura 04) | Error visible nada más entrar |
| 9 | **Las habilidades son un muro de texto** separado por comas | Modo reclutador | No se puede escanear |
| 10 | **Contenido pendiente**: falta el enlace a la credencial de Google Cybersecurity y la librería de skills no aparece en el PDF | Datos | Hay incoherencia entre la web y el PDF |

Datos que conviene confirmar:
- **Credencial de Coursera**: ya tienes el ID de verificación `XUCBUQ2O56IQ`. La URL habitual es `https://www.coursera.org/account/accomplishments/professional-cert/XUCBUQ2O56IQ`. Compruébala en el navegador antes de ponerla.
- **«Ruíz» con tilde**: según la RAE se escribe «Ruiz», sin tilde. Si en tu DNI o NIE aparece con tilde, mantenla; si no, corrígelo en la web y en el PDF.

---

## 2. Nueva dirección: «tu perfil como la ficha de una app»

La idea es presentarte con el lenguaje visual de una ficha de app en una tienda de Apple. Todo reclutador lo reconoce al instante y no necesita instrucciones para usarlo. La sala isométrica se mantiene, pero pasa a ser la **imagen protagonista** de la ficha en vez de toda la interfaz.

> Límite legal y de marca: se toma el *lenguaje de diseño* (tipografía, tarjetas, materiales, movimiento), **no** la marca. Nada de logo de Apple, ni la palabra «App Store», ni la fuente SF Pro (su licencia no permite usarla en webs), ni iconos de Apple. Tampoco se crean **valoraciones o reseñas inventadas**: una fila de estrellas falsas destruiría la credibilidad.

### Estructura de la página (de arriba abajo)

1. **Barra de cristal** fija con `backdrop-filter: blur(20px) saturate(180%)`: monograma, nombre, selector ES/EN, modo claro/oscuro y el botón «Descargar CV» en píldora.
2. **Cabecera de producto**
   - Icono «app» grande (squircle de 128–160 px) con tu monograma «DR» en material de cristal.
   - Nombre (display de 48–72 px, peso 700, tracking −0.03em), subtítulo en una línea y un botón azul **«Obtener CV»** (descarga el PDF) junto a otro secundario **«Leer ahora»** (abre el modo lectura).
3. **Fila de datos clave**, como la franja de métricas de una ficha, en columnas separadas por líneas finas. Los datos salen del JSON, sin inventar nada:
   `EXPERIENCIA 10+ años · CERTIFICACIONES 9 · UBICACIÓN Madrid · IDIOMAS ES · EN B2 · DISPONIBILIDAD Inmediata`
4. **Tarjeta protagonista: la sala isométrica.** Es el efecto wow:
   - Al hacer scroll, la tarjeta pasa de estar redondeada y metida en la página a ocupar toda la pantalla, con animación ligada al scroll (`animation-timeline: view()`).
   - Tiene capas con parallax e inclinación 3D suave (≤ 6°) que siguen al puntero.
   - Un interruptor **«Encender la luz»** cambia la sala de noche a amanecer transicionando variables CSS.
   - Los puntos naranjas se sustituyen por **mini-iconos de cristal** con etiqueta al pasar el ratón.
5. **Estantería de «apps»**: una fila horizontal con scroll-snap y 8 iconos squircle en 3D (Infra y Azure, Ciberseguridad, IA y MCP, Proyectos, Experiencia, Certificaciones, Terminal, Contacto). Cada uno abre su hoja con la **transición de tarjeta que se expande** (View Transitions API).
6. **Vista previa (proyectos)**: carrusel de tarjetas grandes con una captura o composición de cada proyecto, stack en chips y enlace «Ver en GitHub».
7. **Novedades — Versión 2026**: ASIR en curso, AZ-104 en preparación y último proyecto publicado.
8. **Historial de versiones (experiencia)**: una timeline en la que cada puesto es una versión (`v2014 · ETECSA`, `v2018 · Autónomo`, `v2023 · Pinkstone`, `v2025 · Televida`), con 2 o 3 logros por puesto.
9. **Información**: tabla al estilo de la sección final de una ficha, todo real. Proveedor: Daynier Rodríguez. Categoría: Sistemas y Cloud. Compatibilidad: Windows Server, Linux, Azure, M365. Idiomas: Español, Inglés (B2). Tamaño: el peso real del bundle. Ubicación: Madrid.
10. **Contacto**: una tarjeta grande con email, LinkedIn y GitHub, y el botón «Obtener CV» repetido.

### Sistema de diseño (tokens)

| Token | Valor |
|---|---|
| Tipografía | **Inter** (con variantes Display y Tight), autoalojada con `@fontsource-variable/inter` para respetar la CSP (`font-src 'self'`). La monoespaciada **solo** en la terminal |
| Escala | 12 / 15 / 17 (cuerpo) / 22 / 28 / 34 / 48 / 72, con interlineado 1.1 en titulares y 1.5 en texto |
| Acento único | Azul `#0A84FF` en oscuro y `#0071E3` en claro. El ámbar y el cian desaparecen de la interfaz y se quedan solo dentro de la ilustración |
| Neutros oscuros | Fondo `#000` y `#0B0B0F`, superficie `#1C1C1E`, superficie elevada `#2C2C2E`, texto `#F5F5F7`, secundario `#A1A1A6` |
| Neutros claros | Fondo `#F5F5F7`, superficie `#FFF`, texto `#1D1D1F`, secundario `#6E6E73` |
| Radios | Tarjetas de 22 px, hojas de 28 px e iconos en **squircle real** (trazado de superelipse, no `border-radius`) |
| Sombras | Suaves y en capas: `0 1px 2px rgb(0 0 0/.06), 0 8px 24px rgb(0 0 0/.12)`. En oscuro, un borde interior de 1 px en blanco al 8 % |
| Movimiento | Curvas tipo muelle con `linear()`, duración de 350–550 ms. Nada rebota más de una vez. Con `prefers-reduced-motion` todo pasa a fundidos de 150 ms |
| Modo claro/oscuro | Sigue al sistema, con conmutador guardado en `localStorage` |

### Receta de los iconos (estilo de los App Icons de Godly)
Se generan en código como SVG, sobre una rejilla de 1024 px:
1. Un fondo squircle con un degradado de dos tonos cercanos (el tono claro arriba a la izquierda).
2. Un glifo simple y **volumétrico**: extrusión de 2 o 3 capas, sombra propia y luz siempre desde arriba a la izquierda.
3. Un brillo especular: una elipse blanca en el tercio superior con una opacidad del 18–25 % y desenfoque.
4. Un borde interior de 1,5 px en blanco al 20 % y una sombra exterior suave.
5. Como mucho 3 colores por icono, con la misma dirección de luz en todos, para que el conjunto se vea como una familia.

Tabla de iconos:

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

### Mejoras de la ilustración
- Caras con degradado en vez de color plano, y oclusión ambiental (sombras de contacto elípticas desenfocadas bajo cada mueble).
- Brillo (bloom) en pantallas y LEDs con un único filtro SVG compartido, para no penalizar el rendimiento.
- Profundidad atmosférica: el fondo de la sala, más frío y menos contrastado.
- Quitar el rótulo «NIGHT OPS» o convertirlo en un neón pequeño y sutil.
- Escena de amanecer al activar «Encender la luz»: cielo cálido, pantallas atenuadas y el avatar se estira.

### Modo lectura (antes «modo reclutador»)
- En escritorio, dos columnas. A la izquierda, fija: foto o monograma, contacto, idiomas, disponibilidad y certificaciones. A la derecha: resumen, experiencia y proyectos.
- El resumen en 3 líneas más 4 logros en viñetas, en vez del bloque de 100 palabras.
- Las habilidades, en grupos con chips (sin niveles inventados).
- Un solo botón de PDF.
- Hoja de estilos `@media print` para que Ctrl+P produzca un CV limpio.

---

## 3. Plan de trabajo

| Fase | Qué se hace | Criterio de cierre |
|---|---|---|
| **A. Correcciones rápidas** | Bug de la pista en móvil (ocultarla en táctil y usar «Toca»), un solo botón PDF, enlace Coursera, revisar «Ruíz», añadir skills al PDF o quitarlas de la web | Tests en verde y capturas sin solapes |
| **B. Sistema de diseño** | Tokens (color, tipo, radio, sombra, movimiento), Inter autoalojada, claro/oscuro, barra de cristal | Página de muestra `/styleguide` con todos los tokens |
| **C. Iconos** | Generador SVG de squircles y los 8 iconos con la receta anterior | Hoja de contacto de los iconos a 1024, 180, 64 y 32 px, legibles en todos los tamaños |
| **D. Ficha de producto** | Cabecera, fila de datos, estantería de apps, vista previa, novedades, historial de versiones, información y contacto | Se lee de arriba abajo en < 90 s y todo sale del JSON |
| **E. Ilustración y efecto wow** | Iluminación nueva, hotspots de cristal, scroll que expande la tarjeta, parallax, «Encender la luz» | 60 fps medidos, y con movimiento reducido la escena queda estática |
| **F. Hojas y transiciones** | Hojas tipo iOS (bottom sheet en móvil, modal centrado en escritorio) con View Transitions y fallback | Teclado, Esc, foco atrapado y restaurado |
| **G. Modo lectura e impresión** | Rediseño en dos columnas y `@media print` | Ctrl+P genera 2 páginas limpias |
| **H. Calidad y lanzamiento** | Actualizar los tests, Lighthouse, la imagen OG nueva y el README | Todo en verde y desplegado |

Recomendación: lanza **un goal por bloque** (A+B, C, D, E+F, G+H) y revisa las capturas entre bloques. El gusto visual lo tienes que validar tú.

---

## 4. Prompts para Claude Code

### 4.1 Prompt de arranque (pégalo primero)
```text
Lee CLAUDE.md, CONTENT_TODO.md y v2/PLAN_V2_APPSTORE.md (cópialo a la raíz del repo). Vamos a rediseñar el CV a la v2 descrita en ese plan: lenguaje visual de ficha de app en estilo Apple, sin usar marcas, logos, la fuente SF Pro ni reseñas inventadas.

Antes de tocar código:
1. Actualiza CLAUDE.md: sustituye la sección "Dirección visual" y el "Mapa de la escena" por la dirección v2 (estructura de página, tokens, receta de iconos, modo lectura). Mantén intactas las reglas de contenido, accesibilidad y rendimiento.
2. Crea una rama `v2-appstore`.
3. Enséñame un resumen de los cambios en CLAUDE.md y la lista de fases A–H, y espera mi OK.
```

### 4.2 Goals por bloque (uno detrás de otro, revisando entre medias)

**Bloque 1: correcciones y sistema de diseño (A+B)**
```text
/goal Las fases A y B de PLAN_V2_APPSTORE.md están completas y lo demuestras en la conversación: (1) en 390×844 la pista inicial no se solapa con ningún elemento y en dispositivos táctiles dice "Toca" o no aparece (test Playwright que lo comprueba con boundingBox); (2) solo existe un botón de descarga del PDF visible por vista (test); (3) certifications[2].credentialUrl tiene la URL de Coursera con el ID XUCBUQ2O56IQ; (4) Inter autoalojada con @fontsource-variable/inter y la CSP sin cambios (font-src 'self'), sin peticiones a dominios externos (test que lo verifica con page.on('request')); (5) existe /styleguide con colores, escala tipográfica, radios, sombras, botones y la barra de cristal en modo claro y oscuro, y muestras las rutas de sus capturas; (6) `npm run build` sale con 0 y `npm run test` pasa al 100 %. No cambies los textos del CV salvo lo indicado. O detente tras 25 turnos e informa.
```

**Bloque 2: iconos (C)**
```text
/goal La fase C está completa: existe src/render/icons.ts, que genera los 8 iconos squircle (trazado de superelipse, no border-radius) siguiendo la receta de PLAN_V2_APPSTORE.md (degradado de 2 tonos, glifo con volumen, brillo especular, borde interior, luz desde arriba a la izquierda, ≤3 colores); existe /styleguide#icons con cada icono a 1024, 180, 64 y 32 px sobre fondo claro y oscuro; muestras las rutas de esas capturas y confirmas que las revisaste y que los 8 se ven como una familia coherente y se distinguen a 32 px; build y tests en verde. O detente tras 20 turnos.
```

**Bloque 3: ficha de producto (D)**
```text
/goal La fase D está completa: la portada tiene, en este orden, la barra de cristal, la cabecera de producto (icono DR, nombre en display, subtítulo, botones "Obtener CV" y "Leer ahora"), la fila de datos clave, la tarjeta protagonista con la sala, la estantería de 8 apps con scroll-snap, la vista previa de proyectos, las novedades, el historial de versiones, la información y el contacto; todo el texto sale de src/data/cv.*.json (el test busca en el HTML renderizado cada valor del JSON) y en ES y EN; no hay valoraciones ni reseñas; en 1440×900 el nombre, el puesto y "Obtener CV" son visibles sin hacer scroll, y en 390×844 no hay scroll horizontal; muestras las capturas de escritorio y móvil en claro y oscuro; build, tests y `npm run lhci` (≥90 rendimiento, ≥95 el resto) en verde. O detente tras 30 turnos.
```

**Bloque 4: ilustración, efecto wow y hojas (E+F)**
```text
/goal Las fases E y F están completas: la sala tiene caras con degradado, sombras de contacto, bloom mediante un solo filtro SVG compartido y hotspots de cristal con icono (sin los puntos naranjas); la tarjeta protagonista se expande con el scroll (animation-timeline con fallback con IntersectionObserver), tiene parallax o inclinación de ≤6° con el puntero y el interruptor "Encender la luz" alterna noche y amanecer; las secciones se abren en hojas (bottom sheet en ≤768 px y modal en escritorio) con View Transitions y fallback; `npm run fps` reporta ≥55 fps de media durante el bucle y el scroll; con prefers-reduced-motion no hay parallax, expansión ni bucle (test); teclado: Tab llega a cada hotspot, Enter abre, Esc cierra y el foco vuelve al origen (test); capturas de noche, amanecer y hoja abierta en escritorio y móvil; build y tests en verde; JS inicial <150 KB gzip. O detente tras 35 turnos.
```

**Bloque 5: modo lectura, impresión y lanzamiento (G+H)**
```text
/goal Las fases G y H están completas: el modo lectura tiene dos columnas en ≥1024 px (columna lateral fija con contacto, idiomas, disponibilidad y certificaciones) y una en móvil, el resumen en ≤3 líneas más 4 viñetas, las habilidades agrupadas en chips y un solo botón de PDF; `@media print` genera un PDF de ≤2 páginas A4 sin la escena ni la barra (test con page.pdf() que cuenta las páginas); la imagen OG está regenerada con el nuevo diseño; README actualizado; `npm run build`, `npm run test` y `npm run lhci` (rendimiento ≥90, accesibilidad, buenas prácticas y SEO ≥95) en verde; rama fusionada en main, workflow de GitHub Pages en verde y la URL pública indicada; `git status` limpio. O detente tras 25 turnos.
```

---

## 5. Revisión humana entre bloques
Después de cada bloque, abre las capturas y responde con cambios concretos: «el icono de IA se confunde con el de contacto», «la cabecera necesita más aire», «el amanecer demasiado naranja». Los goals garantizan que la web funciona; si produce el efecto wow lo decides tú.
