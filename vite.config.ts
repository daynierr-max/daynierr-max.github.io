import { gzipSync } from 'node:zlib';
import { defineConfig, type Plugin } from 'vite';
import { renderShell } from './src/render/shell.ts';
import { renderJsonLd } from './src/render/head.ts';

// Prerender: la portada y el modo lectura (ES) van en el HTML estático, así el contenido
// es indexable y pinta sin esperar al JS.
function prerender(): Plugin {
  return {
    name: 'cv-prerender',
    transformIndexHtml: {
      order: 'pre',
      handler: (html) =>
        html.replace('<!--app:shell-->', renderShell('es')).replace('<!--app:jsonld-->', renderJsonLd()),
    },
  };
}

// Tamaño real de la portada (JS + CSS en gzip), medido sobre el propio bundle.
// Se deja en <meta name="x-bundle-size"> y en la tabla «Información».
function bundleSize(): Plugin {
  return {
    name: 'cv-bundle-size',
    transformIndexHtml: {
      order: 'post',
      handler: (html, ctx) => {
        if (!ctx.bundle || !html.includes('__BUNDLE_SIZE__')) return html.replaceAll('__BUNDLE_SIZE__', '—');
        let bytes = 0;
        for (const item of Object.values(ctx.bundle)) {
          if (item.fileName.includes('styleguide')) continue;
          if (item.type === 'chunk') bytes += gzipSync(item.code).length;
          else if (item.fileName.endsWith('.css')) bytes += gzipSync(item.source).length;
        }
        const label = `${Math.round(bytes / 1024)} KB (JS + CSS, gzip)`;
        return html
          .replaceAll('__BUNDLE_SIZE__', label)
          .replace('</head>', `  <meta name="x-bundle-size" content="${label}" />\n  </head>`);
      },
    },
  };
}

export default defineConfig({
  base: '/',
  plugins: [prerender(), bundleSize()],
  build: {
    target: 'es2022',
    cssMinify: true,
    modulePreload: { polyfill: false },
    rollupOptions: { input: { main: 'index.html', styleguide: 'styleguide/index.html' } },
  },
});
