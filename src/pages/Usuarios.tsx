import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { HeaderWithNotifications } from "@/components/HeaderWithNotifications";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, UserCog, ArrowLeft, BookOpen, Clock, AlertTriangle, CheckCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

interface Aluno {
  id: string;
  nome: string;
  matricula: string;
  turma: string;
  nivel: string;
  status: "Ativo" | "Inativo" | "Transferido";
  notas: { disciplina: string; nota1: number; nota2: number; nota3: number; nota4: number; media: number }[];
  faltas: { disciplina: string; total: number; permitidas: number }[];
  frequencia: number;
  documentos: { tipo: string; data: string; status: string }[];
}

const NOMES = [
  "Ana Beatriz Silva", "Bruno Henrique Costa", "Camila Rodrigues", "Daniel Oliveira Santos",
  "Emily Ferreira Lima", "Felipe Almeida", "Gabriela Souza", "Henrique Martins",
  "Isabela Pereira", "João Victor Ribeiro", "Karina Nascimento", "Leonardo Araújo",
  "Marina Gomes", "Nicolas Barbosa", "Olivia Carvalho", "Pedro Lucas Mendes",
  "Rafaela Monteiro", "Samuel Teixeira", "Tatiana Moreira", "Ulisses Fernandes",
  "Valentina Rocha", "William Dias", "Ximena Castro", "Yago Pinto",
  "Zara Lopes", "Arthur Cavalcanti", "Bianca Freitas", "Carlos Eduardo Nunes",
  "Diana Rezende", "Eduardo Vasconcelos",
];

const DISCIPLINAS = ["Português", "Matemática", "Inglês", "Ciências", "Ensino Religioso", "História", "Geografia", "Artes", "Educação Física"];
const TURMAS = ["1º Ano A", "1º Ano B", "2º Ano A", "2º Ano B", "6º Ano A", "6º Ano B", "7º Ano A", "Pré I", "Pré II"];

function gerarNota() {
  return Math.round((Math.random() * 6 + 4) * 10) / 10;
}

function gerarAlunos(): Aluno[] {
  return NOMES.map((nome, i) => {
    const notas = DISCIPLINAS.map((d) => {
      const n1 = gerarNota(), n2 = gerarNota(), n3 = gerarNota(), n4 = gerarNota();
      return { disciplina: d, nota1: n1, nota2: n2, nota3: n3, nota4: n4, media: Math.round(((n1 + n2 + n3 + n4) / 4) * 10) / 10 };
    });
    const faltas = DISCIPLINAS.map((d) => ({
      disciplina: d,
      total: Math.floor(Math.random() * 15),
      permitidas: 20,
    }));
    const totalFaltas = faltas.reduce((s, f) => s + f.total, 0);
    const totalPossiveis = faltas.length * 80;
    const frequencia = Math.round(((totalPossiveis - totalFaltas) / totalPossiveis) * 1000) / 10;
    return {
      id: String(i + 1),
      nome,
      matricula: `2024${String(i + 1).padStart(4, "0")}`,
      turma: TURMAS[i % TURMAS.length],
      nivel: i % 3 === 0 ? "Fundamental I" : i % 3 === 1 ? "Fundamental II" : "Infantil",
      status: i === 19 ? "Transferido" : i === 27 ? "Inativo" : "Ativo",
      notas,
      faltas,
      frequencia,
      documentos: [
        { tipo: "Matrícula", data: "05/02/2024", status: "Entregue" },
        { tipo: "Certidão de Nascimento", data: "05/02/2024", status: "Entregue" },
        { tipo: "Comprovante de Residência", data: "10/02/2024", status: i % 5 === 0 ? "Pendente" : "Entregue" },
        { tipo: "Cartão de Vacinação", data: "05/02/2024", status: i % 7 === 0 ? "Pendente" : "Entregue" },
        { tipo: "Histórico Escolar", data: "15/02/2024", status: i % 4 === 0 ? "Pendente" : "Entregue" },
      ],
    };
  });
}

const alunosData = gerarAlunos();

const statusColors: Record<string, string> = {
  Ativo: "bg-edu-green-light text-edu-green",
  Inativo: "bg-muted text-muted-foreground",
  Transferido: "bg-edu-orange-light text-edu-orange",
};

const Usuarios = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAluno, setSelectedAluno] = useState<Aluno | null>(null);

  const filtered = alunosData.filter(
    (a) =>
      a.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.matricula.includes(searchTerm) ||
      a.turma.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (selectedAluno) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar />
          <div className="flex-1 flex flex-col">
            <HeaderWithNotifications />
            <main className="flex-1 p-6 space-y-6">
              {/* Back + header */}
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => setSelectedAluno(null)}>
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-foreground">{selectedAluno.nome}</h1>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-sm text-muted-foreground">Matrícula: {selectedAluno.matricula}</span>
                    <span className="text-sm text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">{selectedAluno.turma}</span>
                    <Badge className={`${statusColors[selectedAluno.status]} border-0`}>{selectedAluno.status}</Badge>
                  </div>
                </div>
              </div>

              {/* Summary cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6 flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-edu-green-light">
                      <CheckCircle className="w-6 h-6 text-edu-green" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Frequência</p>
                      <p className="text-2xl font-bold text-foreground">{selectedAluno.frequencia}%</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-edu-blue-light">
                      <BookOpen className="w-6 h-6 text-edu-blue" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Média Geral</p>
                      <p className="text-2xl font-bold text-foreground">
                        {(selectedAluno.notas.reduce((s, n) => s + n.media, 0) / selectedAluno.notas.length).toFixed(1)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-edu-coral-light">
                      <AlertTriangle className="w-6 h-6 text-edu-coral" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total de Faltas</p>
                      <p className="text-2xl font-bold text-foreground">
                        {selectedAluno.faltas.reduce((s, f) => s + f.total, 0)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="notas">
                <TabsList>
                  <TabsTrigger value="notas">Notas</TabsTrigger>
                  <TabsTrigger value="faltas">Faltas e Frequência</TabsTrigger>
                  <TabsTrigger value="documentos">Documentos</TabsTrigger>
                </TabsList>

                <TabsContent value="notas">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Boletim Escolar</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-lg border overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-muted/50">
                              <TableHead>Disciplina</TableHead>
                              <TableHead className="text-center">1º Bim</TableHead>
                              <TableHead className="text-center">2º Bim</TableHead>
                              <TableHead className="text-center">3º Bim</TableHead>
                              <TableHead className="text-center">4º Bim</TableHead>
                              <TableHead className="text-center">Média</TableHead>
                              <TableHead className="text-center">Situação</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedAluno.notas.map((n) => (
                              <TableRow key={n.disciplina}>
                                <TableCell className="font-medium">{n.disciplina}</TableCell>
                                <TableCell className="text-center">{n.nota1}</TableCell>
                                <TableCell className="text-center">{n.nota2}</TableCell>
                                <TableCell className="text-center">{n.nota3}</TableCell>
                                <TableCell className="text-center">{n.nota4}</TableCell>
                                <TableCell className="text-center font-bold">{n.media}</TableCell>
                                <TableCell className="text-center">
                                  <Badge className={`border-0 ${n.media >= 7 ? "bg-edu-green-light text-edu-green" : n.media >= 5 ? "bg-edu-orange-light text-edu-orange" : "bg-destructive/10 text-destructive"}`}>
                                    {n.media >= 7 ? "Aprovado" : n.media >= 5 ? "Recuperação" : "Reprovado"}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="faltas">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Frequência por Disciplina</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {selectedAluno.faltas.map((f) => {
                        const pct = Math.round(((f.permitidas - f.total) / f.permitidas) * 100);
                        return (
                          <div key={f.disciplina} className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span className="font-medium">{f.disciplina}</span>
                              <span className="text-muted-foreground">{f.total} faltas / {f.permitidas} permitidas — {pct}%</span>
                            </div>
                            <Progress value={pct} className="h-2" />
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="documentos">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Documentação</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-lg border overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-muted/50">
                              <TableHead>Documento</TableHead>
                              <TableHead>Data</TableHead>
                              <TableHead className="text-center">Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedAluno.documentos.map((d) => (
                              <TableRow key={d.tipo}>
                                <TableCell className="font-medium">{d.tipo}</TableCell>
                                <TableCell>{d.data}</TableCell>
                                <TableCell className="text-center">
                                  <Badge className={`border-0 ${d.status === "Entregue" ? "bg-edu-green-light text-edu-green" : "bg-edu-orange-light text-edu-orange"}`}>
                                    {d.status}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <HeaderWithNotifications />
          <main className="flex-1 p-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-edu-blue-light rounded-lg">
                    <UserCog className="w-5 h-5 text-edu-blue" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Usuários</CardTitle>
                    <p className="text-sm text-muted-foreground">{filtered.length} alunos encontrados</p>
                  </div>
                </div>
                <div className="relative w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar aluno por nome, matrícula ou turma..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>Nome</TableHead>
                        <TableHead>Matrícula</TableHead>
                        <TableHead>Turma</TableHead>
                        <TableHead>Nível</TableHead>
                        <TableHead className="text-center">Frequência</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.map((aluno) => (
                        <TableRow
                          key={aluno.id}
                          className="cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => setSelectedAluno(aluno)}
                        >
                          <TableCell className="font-medium">{aluno.nome}</TableCell>
                          <TableCell className="text-muted-foreground">{aluno.matricula}</TableCell>
                          <TableCell>{aluno.turma}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{aluno.nivel}</Badge>
                          </TableCell>
                          <TableCell className="text-center">{aluno.frequencia}%</TableCell>
                          <TableCell className="text-center">
                            <Badge className={`${statusColors[aluno.status]} border-0`}>{aluno.status}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Usuarios;
