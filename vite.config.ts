import { defineConfig, type Plugin } from 'vite';
import { renderShell } from './src/render/shell.ts';
import { renderJsonLd } from './src/render/head.ts';

// Prerender: la escena, las tarjetas y el modo reclutador (ES) van en el HTML
// estático, así el contenido es indexable y pinta sin esperar al JS.
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

export default defineConfig({
  base: '/',
  plugins: [prerender()],
  build: {
    target: 'es2022',
    cssMinify: true,
    modulePreload: { polyfill: false },
    rollupOptions: { input: { main: 'index.html', styleguide: 'styleguide/index.html' } },
  },
});
