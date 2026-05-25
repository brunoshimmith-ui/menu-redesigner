// Catálogos base para criação de turmas

export interface PlanoEstudo {
  id: string;
  nome: string;
  nivel: string;
  turno: string;
  codigo: string;
  cargaHoraria: number;
  anos: string[];
}

export const PLANOS_ESTUDO: PlanoEstudo[] = [
  {
    id: "infantil",
    nome: "Educação Infantil",
    nivel: "Infantil",
    turno: "Manhã",
    codigo: "INF-2026",
    cargaHoraria: 800,
    anos: ["Maternal", "Pré I", "Pré II"],
  },
  {
    id: "efi",
    nome: "Ensino Fundamental I (EFI)",
    nivel: "Fundamental I",
    turno: "Manhã",
    codigo: "EFI-2026",
    cargaHoraria: 800,
    anos: ["1º Ano", "2º Ano", "3º Ano", "4º Ano", "5º Ano"],
  },
  {
    id: "efii",
    nome: "Ensino Fundamental II (EFII)",
    nivel: "Fundamental II",
    turno: "Tarde",
    codigo: "EFII-2026",
    cargaHoraria: 1000,
    anos: ["6º Ano", "7º Ano", "8º Ano", "9º Ano"],
  },
  {
    id: "eja",
    nome: "EJA - Educação de Jovens e Adultos",
    nivel: "EJA",
    turno: "Noite",
    codigo: "EJA-2026",
    cargaHoraria: 1200,
    anos: ["1ª Etapa", "2ª Etapa", "3ª Etapa", "4ª Etapa"],
  },
  {
    id: "medio",
    nome: "Ensino Médio",
    nivel: "Médio",
    turno: "Manhã",
    codigo: "EM-2026",
    cargaHoraria: 1000,
    anos: ["1º Ano EM", "2º Ano EM", "3º Ano EM"],
  },
];

export const DISCIPLINAS_PADRAO = [
  "Língua Portuguesa",
  "Matemática",
  "Arte",
  "Inglês",
  "Ensino Religioso",
  "Ciências",
  "História",
  "Geografia",
  "Educação Física",
];

export const TIPOS_ENSINO = [
  "Base Nacional",
  "Parte Diversificada",
  "Atividade Complementar",
  "Flexibilização",
  "Aprofundamento Curricular",
  "Formação Geral",
];

export const ESTRUTURAS_AVALIACAO = [
  "Bimestral (4 fases)",
  "Trimestral (3 fases)",
  "Semestral (2 fases)",
  "Anual (1 fase)",
  "Por ciclo",
];

export const PROFESSORES_DISPONIVEIS = [
  "Prof. Carlos Andrade",
  "Profa. Mariana Lopes",
  "Prof. Rafael Pinto",
  "Profa. Júlia Ferreira",
  "Prof. Eduardo Nogueira",
  "Profa. Beatriz Campos",
  "Prof. Marcos Vieira",
  "Profa. Patrícia Souza",
];

export const COORDENADORES_DISPONIVEIS = [
  "Coord. Maria Silva",
  "Coord. João Santos",
  "Coord. Ana Costa",
  "Coord. Pedro Lima",
  "Coord. Carla Mendes",
];

export const ALUNOS_MOCK = [
  "Ana Beatriz Oliveira",
  "Bruno Henrique Silva",
  "Camila Rocha Souza",
  "Daniel Martins Costa",
  "Eduarda Lima Pereira",
  "Felipe Andrade Gomes",
  "Gabriela Nunes Ribeiro",
  "Henrique Carvalho Dias",
  "Isabela Moreira Alves",
  "João Pedro da Silva",
  "Larissa Cardoso Melo",
  "Mateus Ferreira Pinto",
  "Natália Ribeiro Tavares",
  "Otávio Almeida Brito",
  "Paula Mendonça Reis",
  "Rafael Duarte Vieira",
  "Sofia Barbosa Pires",
  "Thiago Macedo Castro",
];

export const CALENDARIOS_DISPONIVEIS = [
  { id: "cal-2026-am", nome: "Calendário 2026 - SEMED Amazonas" },
  { id: "cal-2026-iranduba", nome: "Calendário 2026 - Iranduba" },
  { id: "cal-2026-manaus", nome: "Calendário 2026 - Manaus" },
];
