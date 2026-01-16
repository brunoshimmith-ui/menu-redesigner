import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Users,
  ArrowLeft,
  GraduationCap,
  ClipboardList,
  FileText,
  BookOpen,
  MessageSquare,
  Calendar,
} from "lucide-react";

interface Aluno {
  id: string;
  nome: string;
  matricula: string;
  dataNascimento: string;
  responsavel: string;
  status: "Ativo" | "Inativo";
}

const alunosData: Aluno[] = [
  { id: "1", nome: "Ana Carolina Silva", matricula: "2024001", dataNascimento: "15/03/2015", responsavel: "Maria Silva", status: "Ativo" },
  { id: "2", nome: "Bruno Santos Lima", matricula: "2024002", dataNascimento: "22/07/2015", responsavel: "José Lima", status: "Ativo" },
  { id: "3", nome: "Carla Mendes Oliveira", matricula: "2024003", dataNascimento: "10/01/2015", responsavel: "Paula Oliveira", status: "Ativo" },
  { id: "4", nome: "Daniel Costa Pereira", matricula: "2024004", dataNascimento: "05/09/2015", responsavel: "Carlos Pereira", status: "Ativo" },
  { id: "5", nome: "Eduarda Ferreira", matricula: "2024005", dataNascimento: "18/11/2015", responsavel: "Ana Ferreira", status: "Inativo" },
  { id: "6", nome: "Felipe Rodrigues", matricula: "2024006", dataNascimento: "30/04/2015", responsavel: "Roberto Rodrigues", status: "Ativo" },
  { id: "7", nome: "Gabriela Martins", matricula: "2024007", dataNascimento: "08/06/2015", responsavel: "Luciana Martins", status: "Ativo" },
  { id: "8", nome: "Henrique Alves", matricula: "2024008", dataNascimento: "25/02/2015", responsavel: "Marcos Alves", status: "Ativo" },
];

const notasData = [
  { disciplina: "Português", b1: 8.5, b2: 9.0, b3: 8.0, b4: 8.5, media: 8.5 },
  { disciplina: "Matemática", b1: 7.5, b2: 8.0, b3: 7.5, b4: 8.0, media: 7.75 },
  { disciplina: "Ciências", b1: 9.0, b2: 9.5, b3: 9.0, b4: 9.5, media: 9.25 },
  { disciplina: "História", b1: 8.0, b2: 8.5, b3: 8.0, b4: 8.5, media: 8.25 },
  { disciplina: "Geografia", b1: 8.5, b2: 8.0, b3: 8.5, b4: 8.0, media: 8.25 },
];

const frequenciaData = [
  { mes: "Janeiro", diasLetivos: 20, presencas: 18, faltas: 2, percentual: 90 },
  { mes: "Fevereiro", diasLetivos: 18, presencas: 17, faltas: 1, percentual: 94 },
  { mes: "Março", diasLetivos: 22, presencas: 21, faltas: 1, percentual: 95 },
  { mes: "Abril", diasLetivos: 20, presencas: 19, faltas: 1, percentual: 95 },
];

const Alunos = () => {
  const { turmaId } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAluno, setSelectedAluno] = useState<Aluno | null>(null);

  const filteredAlunos = alunosData.filter(
    (aluno) =>
      aluno.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aluno.matricula.includes(searchTerm)
  );

  const handleSelectAluno = (aluno: Aluno) => {
    setSelectedAluno(aluno);
  };

  if (selectedAluno) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar />

          <div className="flex-1 flex flex-col">
            <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4">
              <SidebarTrigger />
              <div className="flex items-center gap-2">
                <ThemeToggle />
              </div>
            </header>

            <main className="flex-1 p-6">
              <div className="mb-6">
                <Button
                  variant="ghost"
                  className="gap-2"
                  onClick={() => setSelectedAluno(null)}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Voltar para lista
                </Button>
              </div>

              <Card className="mb-6">
                <CardHeader className="flex flex-row items-center gap-4 pb-4">
                  <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-xl">
                    <GraduationCap className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{selectedAluno.nome}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Matrícula: {selectedAluno.matricula} • Responsável: {selectedAluno.responsavel}
                    </p>
                    <Badge className={selectedAluno.status === "Ativo" ? "bg-edu-green-light text-edu-green border-0" : "bg-edu-coral-light text-edu-coral border-0"}>
                      {selectedAluno.status}
                    </Badge>
                  </div>
                </CardHeader>
              </Card>

              <Tabs defaultValue="notas" className="space-y-4">
                <TabsList className="grid grid-cols-5 w-full max-w-2xl">
                  <TabsTrigger value="notas" className="gap-2">
                    <BookOpen className="w-4 h-4" />
                    Notas
                  </TabsTrigger>
                  <TabsTrigger value="frequencia" className="gap-2">
                    <Calendar className="w-4 h-4" />
                    Frequência
                  </TabsTrigger>
                  <TabsTrigger value="ficha" className="gap-2">
                    <ClipboardList className="w-4 h-4" />
                    Ficha Individual
                  </TabsTrigger>
                  <TabsTrigger value="boletim" className="gap-2">
                    <FileText className="w-4 h-4" />
                    Boletim
                  </TabsTrigger>
                  <TabsTrigger value="parecer" className="gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Parecer
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="notas">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-edu-blue" />
                        Notas por Disciplina
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Disciplina</TableHead>
                            <TableHead className="text-center">1º Bim</TableHead>
                            <TableHead className="text-center">2º Bim</TableHead>
                            <TableHead className="text-center">3º Bim</TableHead>
                            <TableHead className="text-center">4º Bim</TableHead>
                            <TableHead className="text-center">Média</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {notasData.map((nota) => (
                            <TableRow key={nota.disciplina}>
                              <TableCell className="font-medium">{nota.disciplina}</TableCell>
                              <TableCell className="text-center">{nota.b1}</TableCell>
                              <TableCell className="text-center">{nota.b2}</TableCell>
                              <TableCell className="text-center">{nota.b3}</TableCell>
                              <TableCell className="text-center">{nota.b4}</TableCell>
                              <TableCell className="text-center">
                                <Badge className={nota.media >= 7 ? "bg-edu-green-light text-edu-green border-0" : "bg-edu-coral-light text-edu-coral border-0"}>
                                  {nota.media}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="frequencia">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-edu-purple" />
                        Frequência Mensal
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Mês</TableHead>
                            <TableHead className="text-center">Dias Letivos</TableHead>
                            <TableHead className="text-center">Presenças</TableHead>
                            <TableHead className="text-center">Faltas</TableHead>
                            <TableHead className="text-center">Percentual</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {frequenciaData.map((freq) => (
                            <TableRow key={freq.mes}>
                              <TableCell className="font-medium">{freq.mes}</TableCell>
                              <TableCell className="text-center">{freq.diasLetivos}</TableCell>
                              <TableCell className="text-center">{freq.presencas}</TableCell>
                              <TableCell className="text-center">{freq.faltas}</TableCell>
                              <TableCell className="text-center">
                                <Badge className={freq.percentual >= 75 ? "bg-edu-green-light text-edu-green border-0" : "bg-edu-coral-light text-edu-coral border-0"}>
                                  {freq.percentual}%
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="ficha">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <ClipboardList className="w-5 h-5 text-edu-orange" />
                        Ficha Individual
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-muted rounded-lg">
                            <p className="text-sm text-muted-foreground">Nome Completo</p>
                            <p className="font-medium">{selectedAluno.nome}</p>
                          </div>
                          <div className="p-4 bg-muted rounded-lg">
                            <p className="text-sm text-muted-foreground">Data de Nascimento</p>
                            <p className="font-medium">{selectedAluno.dataNascimento}</p>
                          </div>
                          <div className="p-4 bg-muted rounded-lg">
                            <p className="text-sm text-muted-foreground">Matrícula</p>
                            <p className="font-medium">{selectedAluno.matricula}</p>
                          </div>
                          <div className="p-4 bg-muted rounded-lg">
                            <p className="text-sm text-muted-foreground">Responsável</p>
                            <p className="font-medium">{selectedAluno.responsavel}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="boletim">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="w-5 h-5 text-edu-coral" />
                        Boletim Escolar
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8">
                        <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">
                          O boletim do aluno pode ser gerado e impresso aqui.
                        </p>
                        <Button className="mt-4">Gerar Boletim PDF</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="parecer">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-edu-green" />
                        Parecer Descritivo
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 bg-muted rounded-lg">
                          <p className="text-sm text-muted-foreground mb-2">1º Bimestre</p>
                          <p className="text-sm">
                            O aluno demonstra excelente participação nas atividades em sala de aula. 
                            Possui boa capacidade de concentração e realiza as tarefas propostas com dedicação.
                            Apresenta bom relacionamento com os colegas e respeita as regras da escola.
                          </p>
                        </div>
                        <div className="p-4 bg-muted rounded-lg">
                          <p className="text-sm text-muted-foreground mb-2">2º Bimestre</p>
                          <p className="text-sm">
                            Continua demonstrando evolução significativa em todas as disciplinas.
                            Participa ativamente das atividades em grupo e colabora com os colegas.
                            Recomenda-se continuar incentivando a leitura em casa.
                          </p>
                        </div>
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
          <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4">
            <SidebarTrigger />
            <div className="flex items-center gap-2">
              <ThemeToggle />
            </div>
          </header>

          <main className="flex-1 p-6">
            <div className="mb-6">
              <Button
                variant="ghost"
                className="gap-2"
                onClick={() => navigate("/turmas")}
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar para turmas
              </Button>
            </div>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-edu-green-light rounded-lg">
                    <Users className="w-5 h-5 text-edu-green" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Alunos da Turma</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {filteredAlunos.length} alunos encontrados
                    </p>
                  </div>
                </div>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar aluno..."
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
                        <TableHead>Data Nascimento</TableHead>
                        <TableHead>Responsável</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAlunos.map((aluno) => (
                        <TableRow
                          key={aluno.id}
                          className="cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => handleSelectAluno(aluno)}
                        >
                          <TableCell className="font-medium">{aluno.nome}</TableCell>
                          <TableCell>{aluno.matricula}</TableCell>
                          <TableCell>{aluno.dataNascimento}</TableCell>
                          <TableCell>{aluno.responsavel}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                aluno.status === "Ativo"
                                  ? "bg-edu-green-light text-edu-green border-0"
                                  : "bg-edu-coral-light text-edu-coral border-0"
                              }
                            >
                              {aluno.status}
                            </Badge>
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

export default Alunos;
