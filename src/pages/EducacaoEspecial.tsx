import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, HeartHandshake, Users, Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AlunoEspecial {
  id: string;
  nome: string;
  matricula: string;
  idade: number;
  dificuldade: string;
  nivelSuporte: "Leve" | "Moderado" | "Intenso";
  observacoes: string;
  responsavel: string;
}

interface TurmaEspecial {
  id: string;
  nome: string;
  turno: string;
  professor: string;
  totalAlunos: number;
  alunos: AlunoEspecial[];
}

const turmasEspeciais: TurmaEspecial[] = [
  {
    id: "1",
    nome: "AEE - Atendimento I",
    turno: "Matutino",
    professor: "Profa. Juliana Costa",
    totalAlunos: 6,
    alunos: [
      { id: "a1", nome: "Lucas Andrade", matricula: "EE2024001", idade: 9, dificuldade: "TEA - Transtorno do Espectro Autista", nivelSuporte: "Moderado", observacoes: "Necessita de rotina visual e tempo extra em avaliações. Boa interação com materiais sensoriais.", responsavel: "Cláudia Andrade" },
      { id: "a2", nome: "Mariana Beatriz", matricula: "EE2024002", idade: 10, dificuldade: "Dislexia", nivelSuporte: "Leve", observacoes: "Apresenta dificuldade em leitura fluente. Beneficia-se de leitura compartilhada e fonte ampliada.", responsavel: "Roberto Beatriz" },
      { id: "a3", nome: "Pedro Henrique", matricula: "EE2024003", idade: 8, dificuldade: "TDAH", nivelSuporte: "Moderado", observacoes: "Distrai-se com facilidade. Responde bem a comandos curtos e pausas durante atividades.", responsavel: "Sandra Henrique" },
    ],
  },
  {
    id: "2",
    nome: "AEE - Atendimento II",
    turno: "Vespertino",
    professor: "Prof. Ricardo Mendes",
    totalAlunos: 5,
    alunos: [
      { id: "b1", nome: "Sofia Carvalho", matricula: "EE2024004", idade: 11, dificuldade: "Deficiência Intelectual leve", nivelSuporte: "Moderado", observacoes: "Acompanha conteúdos com adaptação curricular. Excelente em atividades práticas.", responsavel: "Marina Carvalho" },
      { id: "b2", nome: "Gabriel Nascimento", matricula: "EE2024005", idade: 12, dificuldade: "Deficiência Auditiva", nivelSuporte: "Intenso", observacoes: "Usuário de LIBRAS. Necessita de intérprete em aulas regulares e materiais visuais.", responsavel: "Felipe Nascimento" },
      { id: "b3", nome: "Helena Ribeiro", matricula: "EE2024006", idade: 10, dificuldade: "Baixa Visão", nivelSuporte: "Moderado", observacoes: "Usa lupa eletrônica. Conteúdos devem ser impressos em fonte 18pt com alto contraste.", responsavel: "Tatiana Ribeiro" },
    ],
  },
  {
    id: "3",
    nome: "Sala de Recursos Multifuncionais",
    turno: "Integral",
    professor: "Profa. Beatriz Lopes",
    totalAlunos: 4,
    alunos: [
      { id: "c1", nome: "Rafael Monteiro", matricula: "EE2024007", idade: 13, dificuldade: "Síndrome de Down", nivelSuporte: "Intenso", observacoes: "Adaptação curricular individualizada. Ótima interação social e participação.", responsavel: "Ana Monteiro" },
      { id: "c2", nome: "Isabela Souza", matricula: "EE2024008", idade: 9, dificuldade: "Transtorno de Aprendizagem (Discalculia)", nivelSuporte: "Leve", observacoes: "Dificuldade com operações matemáticas. Uso de material concreto auxilia.", responsavel: "Paulo Souza" },
    ],
  },
];

const nivelColors: Record<string, string> = {
  Leve: "bg-edu-green-light text-edu-green",
  Moderado: "bg-edu-orange-light text-edu-orange",
  Intenso: "bg-edu-coral-light text-edu-coral",
};

const EducacaoEspecial = () => {
  const [selectedTurma, setSelectedTurma] = useState<TurmaEspecial | null>(null);
  const [search, setSearch] = useState("");

  if (selectedTurma) {
    const alunosFiltrados = selectedTurma.alunos.filter((a) =>
      a.nome.toLowerCase().includes(search.toLowerCase())
    );
    return (
      <PageShell title={selectedTurma.nome} description={`${selectedTurma.turno} • ${selectedTurma.professor}`}>
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => { setSelectedTurma(null); setSearch(""); }}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Voltar às turmas
          </Button>
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar aluno..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Alunos da turma ({alunosFiltrados.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {alunosFiltrados.map((aluno) => (
              <div key={aluno.id} className="rounded-2xl border border-border p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold text-[#1d2746]">{aluno.nome}</h3>
                      <Badge variant="outline" className="text-[10px]">{aluno.matricula}</Badge>
                      <Badge className={`${nivelColors[aluno.nivelSuporte]} border-0`}>
                        Suporte {aluno.nivelSuporte}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {aluno.idade} anos • Responsável: {aluno.responsavel}
                    </p>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-1 p-3 rounded-lg bg-edu-purple-light">
                    <p className="text-[10px] uppercase tracking-wide font-semibold text-edu-purple">Dificuldade</p>
                    <p className="text-sm font-medium text-foreground mt-1">{aluno.dificuldade}</p>
                  </div>
                  <div className="md:col-span-2 p-3 rounded-lg bg-muted/50">
                    <p className="text-[10px] uppercase tracking-wide font-semibold text-muted-foreground">Observações em sala</p>
                    <p className="text-sm text-foreground mt-1">{aluno.observacoes}</p>
                  </div>
                </div>
              </div>
            ))}
            {alunosFiltrados.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">Nenhum aluno encontrado.</p>
            )}
          </CardContent>
        </Card>
      </PageShell>
    );
  }

  const totalAlunos = turmasEspeciais.reduce((s, t) => s + t.totalAlunos, 0);

  return (
    <PageShell
      title="Educação Especial"
      description="Acompanhe os estudantes da educação especial, recursos e adaptações."
    >
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 flex items-center gap-3">
            <div className="p-3 rounded-xl bg-edu-purple-light">
              <HeartHandshake className="w-5 h-5 text-edu-purple" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Turmas AEE</p>
              <p className="text-2xl font-bold">{turmasEspeciais.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center gap-3">
            <div className="p-3 rounded-xl bg-edu-blue-light">
              <Users className="w-5 h-5 text-edu-blue" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Alunos atendidos</p>
              <p className="text-2xl font-bold">{totalAlunos}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center gap-3">
            <div className="p-3 rounded-xl bg-edu-green-light">
              <Users className="w-5 h-5 text-edu-green" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Profissionais</p>
              <p className="text-2xl font-bold">{turmasEspeciais.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Turmas com alunos especiais</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Turma</TableHead>
                <TableHead>Turno</TableHead>
                <TableHead>Profissional responsável</TableHead>
                <TableHead className="text-center">Alunos</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {turmasEspeciais.map((t) => (
                <TableRow
                  key={t.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => setSelectedTurma(t)}
                >
                  <TableCell className="font-medium">{t.nome}</TableCell>
                  <TableCell>{t.turno}</TableCell>
                  <TableCell>{t.professor}</TableCell>
                  <TableCell className="text-center">
                    <Badge className="bg-edu-purple-light text-edu-purple border-0">{t.totalAlunos}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </PageShell>
  );
};

export default EducacaoEspecial;
