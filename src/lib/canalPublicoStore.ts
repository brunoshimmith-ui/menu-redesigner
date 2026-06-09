// Store simples (localStorage) para slides exibidos no Canal Público.
// - heroSlides: carrossel do cabeçalho (imagens/textos educacionais)
// - infoSlides: carrossel principal (atendimento, eventos, etc.)

export interface CanalSlide {
  id: string;
  titulo: string;
  descricao: string;
  imagem?: string; // URL ou data URL; opcional (usa gradiente quando vazio)
  gradient?: string; // fallback tailwind gradient classes
}

const HERO_KEY = "canal_publico_hero_slides";
const INFO_KEY = "canal_publico_info_slides";
const EVENT = "canal_publico:change";

const defaultHero: CanalSlide[] = [
  {
    id: "h1",
    titulo: "Educar é transformar vidas",
    descricao: "Cada criança matriculada é uma história de futuro sendo construída.",
    gradient: "from-edu-blue to-edu-purple",
  },
  {
    id: "h2",
    titulo: "Nossas escolas, nosso orgulho",
    descricao: "Rede municipal comprometida com qualidade e acolhimento.",
    gradient: "from-edu-orange to-edu-coral",
  },
  {
    id: "h3",
    titulo: "Aprender, criar, evoluir",
    descricao: "Tecnologia e afeto caminham juntos em nossas salas de aula.",
    gradient: "from-emerald-400 to-cyan-500",
  },
];

const defaultInfo: CanalSlide[] = [
  {
    id: "i1",
    titulo: "Atendimento à comunidade",
    descricao: "Segunda a sexta, das 7h às 17h, nas unidades e na sede da SEMED.",
    gradient: "from-edu-blue to-edu-purple",
  },
  {
    id: "i2",
    titulo: "Matrículas abertas",
    descricao: "Período de matrícula e rematrícula com atendimento presencial e online.",
    gradient: "from-violet-400 to-fuchsia-500",
  },
  {
    id: "i3",
    titulo: "Festival cultural das escolas",
    descricao: "Evento anual reunindo apresentações artísticas de toda a rede municipal.",
    gradient: "from-edu-orange to-edu-coral",
  },
  {
    id: "i4",
    titulo: "Projeto leitura para todos",
    descricao: "Bibliotecas itinerantes levando livros às comunidades mais distantes.",
    gradient: "from-emerald-400 to-cyan-500",
  },
];

function read(key: string, fallback: CanalSlide[]): CanalSlide[] {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: CanalSlide[]) {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent(EVENT));
}

export const canalStore = {
  getHero: () => read(HERO_KEY, defaultHero),
  getInfo: () => read(INFO_KEY, defaultInfo),
  setHero: (s: CanalSlide[]) => write(HERO_KEY, s),
  setInfo: (s: CanalSlide[]) => write(INFO_KEY, s),
  subscribe: (cb: () => void) => {
    const h = () => cb();
    window.addEventListener(EVENT, h);
    return () => window.removeEventListener(EVENT, h);
  },
};
