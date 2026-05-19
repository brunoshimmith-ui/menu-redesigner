export const holidays: { date: string; name: string }[] = [
  { date: "2026-01-01", name: "Confraternização Universal" },
  { date: "2026-02-16", name: "Carnaval" },
  { date: "2026-02-17", name: "Carnaval" },
  { date: "2026-04-03", name: "Sexta-feira Santa" },
  { date: "2026-04-21", name: "Tiradentes" },
  { date: "2026-05-01", name: "Dia do Trabalho" },
  { date: "2026-06-04", name: "Corpus Christi" },
  { date: "2026-09-05", name: "Elevação do Amazonas a Província" },
  { date: "2026-09-07", name: "Independência do Brasil" },
  { date: "2026-10-12", name: "Nossa Senhora Aparecida" },
  { date: "2026-10-19", name: "Aniversário de Iranduba" },
  { date: "2026-11-02", name: "Finados" },
  { date: "2026-11-15", name: "Proclamação da República" },
  { date: "2026-11-20", name: "Consciência Negra" },
  { date: "2026-12-25", name: "Natal" },
];

export const optionalDays: { date: string; name: string }[] = [
  { date: "2026-02-18", name: "Quarta-feira de Cinzas (até 12h)" },
  { date: "2026-06-05", name: "Após Corpus Christi" },
  { date: "2026-10-28", name: "Dia do Servidor Público" },
  { date: "2026-12-24", name: "Véspera de Natal" },
  { date: "2026-12-31", name: "Véspera de Ano Novo" },
];

// 4 bimestres (definidos pelo suporte)
export const bimestres = [
  { n: 1, inicio: "2026-02-03", fim: "2026-04-17" },
  { n: 2, inicio: "2026-04-20", fim: "2026-06-30" },
  { n: 3, inicio: "2026-07-28", fim: "2026-10-02" },
  { n: 4, inicio: "2026-10-05", fim: "2026-12-18" },
];

export const dateKey = (d?: Date) => (d ? d.toISOString().slice(0, 10) : "");
export const toDate = (s: string) => new Date(s + "T00:00");
