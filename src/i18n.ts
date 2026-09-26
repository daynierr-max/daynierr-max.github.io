import type { Lang, SectionId } from './types.ts';
import cvEs from './data/cv.es.json' with { type: 'json' };
import cvEn from './data/cv.en.json' with { type: 'json' };
import type { CV } from './types.ts';

export const CVS: Record<Lang, CV> = { es: cvEs as CV, en: cvEn as CV };

export const SECTION_ORDER: SectionId[] = [
  'about',
  'infra',
  'security',
  'ai',
  'projects',
  'experience',
  'certs',
  'contact',
  'terminal',
];

interface UI {
  htmlTitle: string;
  metaDescription: string;
  recruiterMode: string;
  exploreMode: string;
  downloadPdf: string;
  switchLang: string;
  switchLangShort: string;
  hint: string;
  close: string;
  sceneLabel: string;
  cardsLabel: string;
  open: string;
  headings: {
    summary: string;
    skills: string;
    experience: string;
    projects: string;
    certs: string;
    education: string;
    languages: string;
    contact: string;
    availability: string;
  };
  sections: Record<SectionId, { title: string; object: string; teaser: string }>;
  repo: string;
  site: string;
  verified: string;
  inProgress: string;
  contactLead: string;
  writeMe: string;
  footer: string;
  terminal: {
    welcome: string;
    prompt: string;
    inputLabel: string;
    help: string;
    unknown: (cmd: string) => string;
    pdf: string;
  };
}

export const UI: Record<Lang, UI> = {
  es: {
    htmlTitle: 'Daynier Rodríguez — Sistemas, Azure, ciberseguridad e IA · CV interactivo',
    metaDescription:
      'CV interactivo de Daynier Rodríguez Ruíz, técnico de sistemas y soporte IT en Madrid: Microsoft Azure, ciberseguridad, bases de datos e IA aplicada (MCP). Modo reclutador y PDF a un clic.',
    recruiterMode: 'Modo reclutador',
    exploreMode: 'Volver a la sala',
    downloadPdf: 'Descargar PDF',
    switchLang: 'Switch to English',
    switchLangShort: 'EN',
    hint: 'Haz clic en los objetos · o pulsa Modo reclutador',
    close: 'Cerrar',
    sceneLabel: 'Sala de operaciones interactiva: cada objeto abre una sección del CV',
    cardsLabel: 'Secciones del CV',
    open: 'Abrir',
    headings: {
      summary: 'Perfil profesional',
      skills: 'Habilidades técnicas',
      experience: 'Experiencia profesional',
      projects: 'Proyectos',
      certs: 'Certificaciones y formación oficial',
      education: 'Formación académica',
      languages: 'Idiomas',
      contact: 'Contacto',
      availability: 'Disponibilidad',
    },
    sections: {
      about: { title: 'Sobre mí', object: 'Escritorio con monitores', teaser: 'Perfil, ubicación e idiomas' },
      infra: { title: 'Infraestructura y Azure', object: 'Rack de servidores', teaser: 'Sistemas, redes, virtualización y Azure' },
      security: { title: 'Ciberseguridad', object: 'Escudo holográfico', teaser: 'Google Cybersecurity, Cisco y buenas prácticas' },
      ai: { title: 'IA y MCP', object: 'Pantalla de nodos', teaser: 'Servidores MCP, skills agénticas y Anthropic Academy' },
      projects: { title: 'Proyectos', object: 'Pantalla con gráfico de rotación', teaser: 'Lo que he construido por mi cuenta' },
      experience: { title: 'Experiencia', object: 'Estantería con carpetas', teaser: 'Más de 10 años en sistemas y redes' },
      certs: { title: 'Certificaciones y formación', object: 'Tablón de corcho', teaser: 'Certificados oficiales y cursos' },
      terminal: { title: 'Terminal', object: 'Terminal flotante', teaser: 'Prueba help, whoami, skills…' },
      contact: { title: '¿Hablamos?', object: 'Ventana al amanecer', teaser: 'Email, LinkedIn y GitHub' },
    },
    repo: 'Repositorio',
    site: 'Web',
    verified: 'verificado',
    inProgress: 'en curso',
    contactLead: 'Disponibilidad inmediata en Madrid. La forma más rápida de hablar conmigo es por email o LinkedIn.',
    writeMe: 'Escríbeme',
    footer: 'Escena SVG generada por código · sin imágenes de terceros',
    terminal: {
      welcome: 'night-ops shell · escribe «help» para ver los comandos',
      prompt: 'daynier@night-ops:~$',
      inputLabel: 'Comando de terminal',
      help: 'Comandos: help · whoami · skills · contact · cv --pdf · clear · exit',
      unknown: (cmd) => `comando no encontrado: ${cmd} (prueba «help»)`,
      pdf: 'Descargando CV en PDF…',
    },
  },
  en: {
    htmlTitle: 'Daynier Rodríguez — Systems, Azure, cybersecurity & AI · Interactive CV',
    metaDescription:
      'Interactive CV of Daynier Rodríguez Ruíz, systems & IT support technician in Madrid: Microsoft Azure, cybersecurity, databases and applied AI (MCP). Recruiter mode and PDF in one click.',
    recruiterMode: 'Recruiter mode',
    exploreMode: 'Back to the room',
    downloadPdf: 'Download PDF',
    switchLang: 'Cambiar a español',
    switchLangShort: 'ES',
    hint: 'Click the objects · or press Recruiter mode',
    close: 'Close',
    sceneLabel: 'Interactive operations room: each object opens a CV section',
    cardsLabel: 'CV sections',
    open: 'Open',
    headings: {
      summary: 'Professional profile',
      skills: 'Technical skills',
      experience: 'Professional experience',
      projects: 'Projects',
      certs: 'Certifications & official training',
      education: 'Education',
      languages: 'Languages',
      contact: 'Contact',
      availability: 'Availability',
    },
    sections: {
      about: { title: 'About me', object: 'Desk with monitors', teaser: 'Profile, location and languages' },
      infra: { title: 'Infrastructure & Azure', object: 'Server rack', teaser: 'Systems, networking, virtualization and Azure' },
      security: { title: 'Cybersecurity', object: 'Holographic shield', teaser: 'Google Cybersecurity, Cisco and good practice' },
      ai: { title: 'AI & MCP', object: 'Node network screen', teaser: 'MCP servers, agentic skills and Anthropic Academy' },
      projects: { title: 'Projects', object: 'Rotation chart screen', teaser: 'Things I have built on my own' },
      experience: { title: 'Experience', object: 'Bookshelf with folders', teaser: '10+ years in systems and networks' },
      certs: { title: 'Certifications & training', object: 'Cork board', teaser: 'Official certificates and courses' },
      terminal: { title: 'Terminal', object: 'Floating terminal', teaser: 'Try help, whoami, skills…' },
      contact: { title: "Let's talk", object: 'Window at dawn', teaser: 'Email, LinkedIn and GitHub' },
    },
    repo: 'Repository',
    site: 'Website',
    verified: 'verified',
    inProgress: 'in progress',
    contactLead: 'Available immediately in Madrid. The fastest way to reach me is by email or LinkedIn.',
    writeMe: 'Email me',
    footer: 'SVG scene generated by code · no third-party images',
    terminal: {
      welcome: 'night-ops shell · type "help" to list commands',
      prompt: 'daynier@night-ops:~$',
      inputLabel: 'Terminal command',
      help: 'Commands: help · whoami · skills · contact · cv --pdf · clear · exit',
      unknown: (cmd) => `command not found: ${cmd} (try "help")`,
      pdf: 'Downloading PDF CV…',
    },
  },
};
