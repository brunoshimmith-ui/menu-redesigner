export interface Chamado {
  id: number;
  from: string;
  role: string;
  title: string;
  description: string;
  urgency: "alta" | "media" | "baixa";
  time: string;
  read: boolean;
}

export const chamadosSuporte: Chamado[] = [
  { id: 1, from: "Prof. Marcos Rocha", role: "Professor", title: "Não consigo lançar notas", description: "Erro ao salvar notas do 2º bimestre da turma 7º A.", urgency: "alta", time: "Há 5 min", read: false },
  { id: 2, from: "Ana Paula", role: "Coordenação", title: "Dúvida sobre fechamento de bimestre", description: "Como gerar o relatório consolidado do bimestre?", urgency: "media", time: "Há 1 h", read: false },
  { id: 3, from: "Carlos Mendes", role: "Direção", title: "Solicitar novo perfil de usuário", description: "Preciso criar um novo perfil para secretária.", urgency: "baixa", time: "Há 3 h", read: false },
  { id: 4, from: "Fernanda Alves", role: "Administração", title: "Erro ao gerar declaração", description: "Declaração de matrícula não está gerando o PDF.", urgency: "alta", time: "Há 4 h", read: true },
];
