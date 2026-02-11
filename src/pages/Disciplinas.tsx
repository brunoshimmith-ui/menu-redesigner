import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash2, BookOpen, Save, ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const DISCIPLINAS_BASE = [
  "Português",
  "Matemática",
  "Inglês",
  "Ciências",
  "Ensino Religioso",
  "História",
  "Geografia",
  "Artes",
  "Educação Física",
];

const PROFESSORES = [
  "Ana Paula Silva",
  "Carlos Eduardo Santos",
  "Fernanda Lima",
  "José Roberto Costa",
  "Mariana Oliveira",
  "Paulo Henrique Souza",
  "Renata Ferreira",
  "Sérgio Almeida",
  "Tatiana Ribeiro",
];

interface DisciplinaItem {
  id: string;
  disciplina: string;
  horaInicio: string;
  horaTermino: string;
  professor: string;
}

const Disciplinas = () => {
  const navigate = useNavigate();
  const { turmaId } = useParams();
  const [disciplinas, setDisciplinas] = useState<DisciplinaItem[]>([
    { id: crypto.randomUUID(), disciplina: "", horaInicio: "", horaTermino: "", professor: "" },
  ]);
  const [salvas, setSalvas] = useState<DisciplinaItem[]>([]);

  const disciplinasUsadas = disciplinas.map((d) => d.disciplina).filter(Boolean);

  const addDisciplina = () => {
    setDisciplinas((prev) => [
      ...prev,
      { id: crypto.randomUUID(), disciplina: "", horaInicio: "", horaTermino: "", professor: "" },
    ]);
  };

  const removeDisciplina = (id: string) => {
    if (disciplinas.length === 1) return;
    setDisciplinas((prev) => prev.filter((d) => d.id !== id));
  };

  const updateDisciplina = (id: string, field: keyof DisciplinaItem, value: string) => {
    setDisciplinas((prev) =>
      prev.map((d) => (d.id === id ? { ...d, [field]: value } : d))
    );
  };

  const handleSalvar = () => {
    const incompletas = disciplinas.filter(
      (d) => !d.disciplina || !d.horaInicio || !d.horaTermino || !d.professor
    );
    if (incompletas.length > 0) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos de cada disciplina antes de salvar.",
        variant: "destructive",
      });
      return;
    }
    setSalvas((prev) => [...prev, ...disciplinas]);
    setDisciplinas([
      { id: crypto.randomUUID(), disciplina: "", horaInicio: "", horaTermino: "", professor: "" },
    ]);
    toast({
      title: "Disciplinas salvas!",
      description: `${disciplinas.length} disciplina(s) adicionada(s) com sucesso.`,
    });
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </div>
            <ThemeToggle />
          </header>

          <main className="flex-1 p-6 space-y-6">
            {/* Formulário de adição */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Adicionar Disciplinas</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Selecione as disciplinas, horários e professores
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {disciplinas.map((item, index) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto_1fr_auto] gap-3 items-end p-4 rounded-lg border bg-muted/30"
                  >
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">
                        Disciplina <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={item.disciplina}
                        onValueChange={(v) => updateDisciplina(item.id, "disciplina", v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecionar" />
                        </SelectTrigger>
                        <SelectContent>
                          {DISCIPLINAS_BASE.map((d) => (
                            <SelectItem
                              key={d}
                              value={d}
                              disabled={
                                disciplinasUsadas.includes(d) && item.disciplina !== d
                              }
                            >
                              {d}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">
                        Hora Início <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        type="time"
                        value={item.horaInicio}
                        onChange={(e) => updateDisciplina(item.id, "horaInicio", e.target.value)}
                        className="w-[130px]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">
                        Hora Término <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        type="time"
                        value={item.horaTermino}
                        onChange={(e) => updateDisciplina(item.id, "horaTermino", e.target.value)}
                        className="w-[130px]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">
                        Professor <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={item.professor}
                        onValueChange={(v) => updateDisciplina(item.id, "professor", v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecionar" />
                        </SelectTrigger>
                        <SelectContent>
                          {PROFESSORES.map((p) => (
                            <SelectItem key={p} value={p}>
                              {p}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => removeDisciplina(item.id)}
                      disabled={disciplinas.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}

                <div className="flex items-center justify-between pt-2">
                  <Button variant="outline" onClick={addDisciplina} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Adicionar Disciplina
                  </Button>
                  <Button onClick={handleSalvar} className="gap-2">
                    <Save className="w-4 h-4" />
                    Salvar Todas ({disciplinas.length})
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Disciplinas salvas */}
            {salvas.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-lg">Diário Escolar — Disciplinas</CardTitle>
                    <Badge variant="secondary">{salvas.length} disciplina(s)</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead>Disciplina</TableHead>
                          <TableHead>Hora Início</TableHead>
                          <TableHead>Hora Término</TableHead>
                          <TableHead>Professor</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {salvas.map((d) => (
                          <TableRow key={d.id}>
                            <TableCell className="font-medium">{d.disciplina}</TableCell>
                            <TableCell>{d.horaInicio}</TableCell>
                            <TableCell>{d.horaTermino}</TableCell>
                            <TableCell>{d.professor}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Disciplinas;
