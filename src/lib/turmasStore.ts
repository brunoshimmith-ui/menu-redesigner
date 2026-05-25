import { useSyncExternalStore } from "react";

export interface DisciplinaTurma {
  id: string;
  nome: string;
  anos: string[];
  professores: string[];
  faltasMax: number;
  tipoEnsino: string;
  habilidades: string[]; // códigos BNCC marcados
}

export interface MatriculaAluno {
  nome: string;
  ordem: number;
}

export interface Turma {
  id: string;
  planoId: string;
  ano: string;
  letra: string;
  nivel: string;
  turno: string;
  codigo: string;
  cargaHoraria: number;
  calendarioId: string;
  coordenadores: string[];
  disciplinas: DisciplinaTurma[];
  matriculas: MatriculaAluno[];
  edicao: string;
  ativa: boolean;
}

const STORAGE_KEY = "stepforma:turmas";

const seed: Turma[] = [
  {
    id: "1",
    planoId: "efii",
    ano: "6º Ano",
    letra: "A",
    nivel: "Fundamental II",
    turno: "Manhã",
    codigo: "EFII-2026",
    cargaHoraria: 1000,
    calendarioId: "cal-2026-am",
    coordenadores: ["Coord. Ana Costa"],
    disciplinas: [],
    matriculas: [],
    edicao: "2026",
    ativa: true,
  },
];

const load = (): Turma[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seed;
    const parsed: Turma[] = JSON.parse(raw);
    return parsed.map((t) => ({ ...t, ativa: t.ativa ?? true }));
  } catch {
    return seed;
  }
};

let state: Turma[] = load();
const listeners = new Set<() => void>();

const persist = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
  listeners.forEach((l) => l());
};

export const turmasStore = {
  getAll: () => state,
  subscribe: (l: () => void) => {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  upsert: (t: Turma) => {
    const idx = state.findIndex((x) => x.id === t.id);
    state = idx >= 0 ? state.map((x, i) => (i === idx ? t : x)) : [...state, t];
    persist();
  },
  remove: (id: string) => {
    state = state.filter((t) => t.id !== id);
    persist();
  },
  addDisciplina: (turmaId: string, d: DisciplinaTurma) => {
    state = state.map((t) =>
      t.id === turmaId ? { ...t, disciplinas: [...t.disciplinas, d] } : t,
    );
    persist();
  },
  updateDisciplina: (turmaId: string, d: DisciplinaTurma) => {
    state = state.map((t) =>
      t.id === turmaId
        ? { ...t, disciplinas: t.disciplinas.map((x) => (x.id === d.id ? d : x)) }
        : t,
    );
    persist();
  },
  removeDisciplina: (turmaId: string, disciplinaId: string) => {
    state = state.map((t) =>
      t.id === turmaId
        ? { ...t, disciplinas: t.disciplinas.filter((x) => x.id !== disciplinaId) }
        : t,
    );
    persist();
  },
  setCoordenadores: (turmaId: string, coords: string[]) => {
    state = state.map((t) => (t.id === turmaId ? { ...t, coordenadores: coords } : t));
    persist();
  },
  setMatriculas: (turmaId: string, ms: MatriculaAluno[]) => {
    state = state.map((t) => (t.id === turmaId ? { ...t, matriculas: ms } : t));
    persist();
  },
  setAtiva: (turmaId: string, ativa: boolean) => {
    state = state.map((t) => (t.id === turmaId ? { ...t, ativa } : t));
    persist();
  },
};

export const useTurmas = () =>
  useSyncExternalStore(turmasStore.subscribe, turmasStore.getAll, turmasStore.getAll);

export const newId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
