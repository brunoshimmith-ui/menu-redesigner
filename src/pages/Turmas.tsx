import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Search, Users, Edit, Eye, BookOpen } from "lucide-react";

interface Turma {
  id: string;
  edicao: string;
  nivel: string;
  turma: string;
  turno: string;
  coordenador: string;
  totalInscritos: number;
}

const turmasData: Turma[] = [
  { id: "1", edicao: "2024", nivel: "Fundamental I", turma: "1º Ano A", turno: "Manhã", coordenador: "Maria Silva", totalInscritos: 28 },
  { id: "2", edicao: "2024", nivel: "Fundamental I", turma: "1º Ano B", turno: "Tarde", coordenador: "Maria Silva", totalInscritos: 25 },
  { id: "3", edicao: "2024", nivel: "Fundamental I", turma: "2º Ano A", turno: "Manhã", coordenador: "João Santos", totalInscritos: 30 },
  { id: "4", edicao: "2024", nivel: "Fundamental I", turma: "2º Ano B", turno: "Tarde", coordenador: "João Santos", totalInscritos: 27 },
  { id: "5", edicao: "2024", nivel: "Fundamental II", turma: "6º Ano A", turno: "Manhã", coordenador: "Ana Costa", totalInscritos: 32 },
  { id: "6", edicao: "2024", nivel: "Fundamental II", turma: "6º Ano B", turno: "Tarde", coordenador: "Ana Costa", totalInscritos: 29 },
  { id: "7", edicao: "2024", nivel: "Fundamental II", turma: "7º Ano A", turno: "Manhã", coordenador: "Pedro Lima", totalInscritos: 31 },
  { id: "8", edicao: "2024", nivel: "Infantil", turma: "Pré I", turno: "Manhã", coordenador: "Carla Mendes", totalInscritos: 20 },
  { id: "9", edicao: "2024", nivel: "Infantil", turma: "Pré II", turno: "Tarde", coordenador: "Carla Mendes", totalInscritos: 22 },
];

const Turmas = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const filteredTurmas = turmasData.filter(
    (turma) =>
      turma.turma.toLowerCase().includes(searchTerm.toLowerCase()) ||
      turma.nivel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      turma.coordenador.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectTurma = (turmaId: string) => {
    navigate(`/turmas/${turmaId}/alunos`);
  };

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
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-edu-blue-light rounded-lg">
                    <Users className="w-5 h-5 text-edu-blue" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Todas as Turmas</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {filteredTurmas.length} turmas encontradas
                    </p>
                  </div>
                </div>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar turma..."
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
                        <TableHead>Edição</TableHead>
                        <TableHead>Nível</TableHead>
                        <TableHead>Turma</TableHead>
                        <TableHead>Turno</TableHead>
                        <TableHead>Coordenador</TableHead>
                        <TableHead className="text-center">Total Inscritos</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTurmas.map((turma) => (
                        <TableRow
                          key={turma.id}
                          className="cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => handleSelectTurma(turma.id)}
                        >
                          <TableCell>
                            <Badge variant="outline">{turma.edicao}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                turma.nivel === "Infantil"
                                  ? "bg-edu-purple-light text-edu-purple border-0"
                                  : turma.nivel === "Fundamental I"
                                  ? "bg-edu-green-light text-edu-green border-0"
                                  : "bg-edu-blue-light text-edu-blue border-0"
                              }
                            >
                              {turma.nivel}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">{turma.turma}</TableCell>
                          <TableCell>{turma.turno}</TableCell>
                          <TableCell>{turma.coordenador}</TableCell>
                          <TableCell className="text-center">
                            <Badge variant="secondary">{turma.totalInscritos}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Ver alunos"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSelectTurma(turma.id);
                                }}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Disciplinas"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/turmas/${turma.id}/disciplinas`);
                                }}
                              >
                                <BookOpen className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            </div>
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

export default Turmas;
