// Municípios atendidos e suas escolas municipais.
// Fontes públicas (escol.as / escolas.com.br) consultadas em 2026.
// A lista pode evoluir; ajustar aqui mantém o restante do sistema sincronizado.

export type MunicipioId = "iranduba" | "belo-monte" | "ouro-branco";

export interface Municipio {
  id: MunicipioId;
  nome: string;
  uf: string;
  escolas: string[];
}

export const MUNICIPIOS: Municipio[] = [
  {
    id: "iranduba",
    nome: "Iranduba",
    uf: "AM",
    escolas: [
      "EM São Cristóvão",
      "EM Castelo Branco I",
      "EM Creuza Abess Farah",
      "EM Divino Espírito Santo",
      "EM Independência",
      "EM Jovino Coelho",
      "EM Marcos Benício Rios",
      "EM Chico Mendes",
      "EM Dona Mieko",
      "EM Prof. Moacir Hilário",
      "EM Vila Nova",
      "EM Nossa Senhora da Conceição",
      "EM Nossa Senhora Aparecida",
      "EM Pedro Silvestre",
      "EM Procópio Maranhão",
      "EM Sagrado Coração de Jesus",
      "EM São Francisco (Rio Negro)",
      "EM São Francisco (Rio Solimões)",
      "EM São José",
      "EM Novo Amanhecer",
    ],
  },
  {
    id: "belo-monte",
    nome: "Belo Monte",
    uf: "AL",
    escolas: [
      "EM Aprígio Machado Feitosa",
      "EM João José de Melo",
      "EM Nossa Senhora dos Prazeres",
      "EM São José",
      "EM Santo Antônio",
      "EM Coronel Joaquim Freitas Melro",
      "EM Irmã Verônica",
      "Escola de 1º Grau Raimunda Souto Feitosa",
      "Creche Municipal São José",
      "Creche Dona Betinha",
      "Creche de Piranhas",
      "Creche de Olho D'Água Novo",
    ],
  },
  {
    id: "ouro-branco",
    nome: "Ouro Branco",
    uf: "AL",
    escolas: [
      "CMEI Profª Edvânia Soares Cabral",
      "Creche Cria Eliane Alves Paranhos Ferreira",
      "EMEB Antônio Xavier de Carvalho",
      "EMEB Augusto Alves da Graça",
      "EMEB Coronel Lucena",
      "EMEB João Gerônimo de Carvalho",
      "EMEB Joaquim Francisco dos Santos",
      "EMEB José de Melo Gama",
      "EMEB José Virgínio Gomes",
      "EMEB Lúcio Rodrigues Limeira",
      "EMEB Maria Ivo de Carvalho",
      "EMEB Padre Cícero",
      "EMEB Pedro Rodrigues Carvalho",
      "EMEB Presidente Kennedy",
      "EMEB Profª Valdomira Martins de Souza",
      "EMEB Rui Barbosa",
      "EMEB Rui Palmeira",
      "EMEB Santo Antônio",
      "EMEB São Benedito",
      "EMEB Josefa Ferreira da Silva",
    ],
  },
];

const STORAGE_KEY = "municipio_atual";
const EVENT = "municipio:change";

export function getMunicipioAtual(): Municipio {
  if (typeof window === "undefined") return MUNICIPIOS[0];
  const id = localStorage.getItem(STORAGE_KEY) as MunicipioId | null;
  return MUNICIPIOS.find((m) => m.id === id) || MUNICIPIOS[0];
}

export function setMunicipioAtual(id: MunicipioId) {
  localStorage.setItem(STORAGE_KEY, id);
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function subscribeMunicipio(cb: () => void): () => void {
  const handler = () => cb();
  window.addEventListener(EVENT, handler);
  return () => window.removeEventListener(EVENT, handler);
}
