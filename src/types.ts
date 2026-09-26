export type Lang = 'es' | 'en';

export interface Profile {
  network: string;
  label: string;
  url: string;
}

export interface SkillGroup {
  id: string;
  name: string;
  items: string[];
}

export interface Job {
  role: string;
  company: string;
  location: string;
  start: string;
  end: string;
  period: string;
  context: string;
  highlights: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  tech: string[];
  url: string | null;
  repo: string | string[] | null;
}

export interface Certification {
  name: string;
  detail?: string;
  issuer: string;
  date: string;
  status: string;
  credentialUrl?: string | null;
}

export interface Education {
  degree: string;
  school: string;
  detail: string;
  period: string;
}

export interface CV {
  meta: { lang: Lang; source: string; pdf: string };
  basics: {
    name: string;
    headline: string;
    location: string;
    email: string;
    availability: string[];
    profiles: Profile[];
  };
  summary: string;
  skills: SkillGroup[];
  experience: Job[];
  projects: Project[];
  certifications: Certification[];
  education: Education[];
  languages: { language: string; level: string }[];
}

export type SectionId =
  | 'about'
  | 'infra'
  | 'security'
  | 'ai'
  | 'projects'
  | 'experience'
  | 'certs'
  | 'terminal'
  | 'contact';
