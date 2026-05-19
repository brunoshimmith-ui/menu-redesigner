import { Role } from "@/contexts/AuthContext";

const read = <T,>(key: string, fallback: T): T => {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
};
const write = (key: string, v: unknown) => localStorage.setItem(key, JSON.stringify(v));

// ===== Avisos importantes =====
export interface Aviso {
  id: string;
  title: string;
  message: string;
  date: string;
  audience: Role[] | "all";
  createdBy: string;
}
const AVISOS_KEY = "semei_avisos";
export const getAvisos = (): Aviso[] => read(AVISOS_KEY, []);
export const saveAviso = (a: Aviso) => write(AVISOS_KEY, [a, ...getAvisos()]);
export const avisosFor = (role: Role): Aviso[] =>
  getAvisos().filter((a) => a.audience === "all" || a.audience.includes(role));

// ===== Avaliações criadas por professor =====
export interface Avaliacao {
  id: string;
  title: string;
  date: string;
  turma: string;
  disciplina: string;
  createdBy: string;
}
const AVAL_KEY = "semei_avaliacoes";
export const getAvaliacoes = (): Avaliacao[] => read(AVAL_KEY, []);
export const saveAvaliacao = (a: Avaliacao) => write(AVAL_KEY, [a, ...getAvaliacoes()]);
export const avaliacoesByProf = (user: string): Avaliacao[] =>
  getAvaliacoes().filter((a) => a.createdBy === user);
export const avaliacoesByTurma = (turma: string): Avaliacao[] =>
  getAvaliacoes().filter((a) => a.turma === turma);

// ===== Anotações (rotina diária do professor) =====
export interface Anotacao {
  id: string;
  date: string;
  text: string;
}
const anotKey = (user: string) => `semei_anotacoes_${user}`;
export const getAnotacoes = (user: string): Anotacao[] => read(anotKey(user), []);
export const saveAnotacao = (user: string, a: Anotacao) =>
  write(anotKey(user), [a, ...getAnotacoes(user)]);
export const deleteAnotacao = (user: string, id: string) =>
  write(anotKey(user), getAnotacoes(user).filter((x) => x.id !== id));
