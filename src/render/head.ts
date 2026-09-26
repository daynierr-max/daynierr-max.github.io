// Metadatos SEO: schema.org/Person generado desde el JSON (fuente única de verdad).
import { CVS } from '../i18n.ts';

export const SITE_URL = 'https://daynierr-max.github.io/';

export function renderJsonLd(): string {
  const cv = CVS.es;
  const person = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: cv.basics.name,
    jobTitle: cv.basics.headline.split('|')[0].trim(),
    description: cv.summary,
    url: SITE_URL,
    email: `mailto:${cv.basics.email}`,
    address: { '@type': 'PostalAddress', addressLocality: 'Madrid', addressCountry: 'ES' },
    sameAs: cv.basics.profiles.map((p) => p.url),
    knowsLanguage: ['es', 'en'],
    knowsAbout: cv.skills.flatMap((s) => s.items).slice(0, 40),
    hasCredential: cv.certifications
      .filter((c) => !/prepar/i.test(c.status))
      .map((c) => ({ '@type': 'EducationalOccupationalCredential', name: c.name, recognizedBy: { '@type': 'Organization', name: c.issuer } })),
  };
  return `<script type="application/ld+json">${JSON.stringify(person).replace(/</g, '\\u003c')}</script>`;
}
