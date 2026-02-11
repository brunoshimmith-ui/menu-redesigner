import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const DISCIPLINAS_BASE = [
  "Língua Portuguesa",
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

const DISCIPLINA_COLORS: Record<string, string> = {
  "Língua Portuguesa": "bg-amber-200 border-amber-400 text-amber-900",
  "Matemática": "bg-green-200 border-green-400 text-green-900",
  "Inglês": "bg-blue-200 border-blue-400 text-blue-900",
  "Ciências": "bg-purple-200 border-purple-400 text-purple-900",
  "Ensino Religioso": "bg-pink-200 border-pink-400 text-pink-900",
  "História": "bg-orange-200 border-orange-400 text-orange-900",
  "Geografia": "bg-red-200 border-red-400 text-red-900",
  "Artes": "bg-teal-200 border-teal-400 text-teal-900",
  "Educação Física": "bg-indigo-200 border-indigo-400 text-indigo-900",
};

const turmasInfo: Record<string, { nivel: string; turma: string; edicao: string; escola: string }> = {
  "1": { nivel: "Ensino Fundamental I", turma: "1º Ano A", edicao: "2026", escola: "Escola Modelo" },
  "2": { nivel: "Ensino Fundamental I", turma: "1º Ano B", edicao: "2026", escola: "Escola Modelo" },
  "3": { nivel: "Ensino Fundamental I", turma: "2º Ano A", edicao: "2026", escola: "Escola Modelo" },
  "4": { nivel: "Ensino Fundamental I", turma: "2º Ano B", edicao: "2026", escola: "Escola Modelo" },
  "5": { nivel: "Ensino Fundamental II", turma: "6º Ano A", edicao: "2026", escola: "Escola Modelo" },
  "6": { nivel: "Ensino Fundamental II", turma: "6º Ano B", edicao: "2026", escola: "Escola Modelo" },
  "7": { nivel: "Ensino Fundamental II", turma: "7º Ano A", edicao: "2026", escola: "Escola Modelo" },
  "8": { nivel: "Infantil", turma: "Pré I", edicao: "2026", escola: "Escola Modelo" },
  "9": { nivel: "Infantil", turma: "Pré II", edicao: "2026", escola: "Escola Modelo" },
};

interface AulaSalva {
  id: string;
  disciplina: string;
  professor: string;
  diaSemana: number; // 0=Dom, 1=Seg...6=Sab
  horaInicio: string;
  horaTermino: string;
}

interface DisciplinaItem {
  id: string;
  disciplina: string;
  horaInicio: string;
  horaTermino: string;
  professor: string;
  diaSemana: number;
}

const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const HORAS = Array.from({ length: 14 }, (_, i) => {
  const h = i + 5;
  return `${String(h).padStart(2, "0")}:00`;
});

function getWeekDates(baseDate: Date) {
  const start = new Date(baseDate);
  start.setDate(start.getDate() - start.getDay());
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

function formatWeekRange(dates: Date[]) {
  const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  const first = dates[0];
  const last = dates[6];
  return `${months[first.getMonth()]} ${String(first.getDate()).padStart(2, "0")} – ${String(last.getDate()).padStart(2, "0")} (${first.getFullYear()})`;
}

const Disciplinas = () => {
  const navigate = useNavigate();
  const { turmaId } = useParams();
  const info = turmasInfo[turmaId || "1"] || turmasInfo["1"];

  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [viewMode, setViewMode] = useState<"Semana" | "Mês">("Semana");
  const [aulas, setAulas] = useState<AulaSalva[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Form state for adding disciplines
  const [formItems, setFormItems] = useState<DisciplinaItem[]>([
    { id: crypto.randomUUID(), disciplina: "", horaInicio: "07:00", horaTermino: "08:00", professor: "", diaSemana: 1 },
  ]);

  const weekDates = useMemo(() => getWeekDates(currentWeek), [currentWeek]);

  const navigateWeek = (dir: number) => {
    setCurrentWeek((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + dir * 7);
      return d;
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
  };

  // Form helpers
  const addFormItem = () => {
    setFormItems((prev) => [
      ...prev,
      { id: crypto.randomUUID(), disciplina: "", horaInicio: "07:00", horaTermino: "08:00", professor: "", diaSemana: 1 },
    ]);
  };

  const removeFormItem = (id: string) => {
    if (formItems.length === 1) return;
    setFormItems((prev) => prev.filter((d) => d.id !== id));
  };

  const updateFormItem = (id: string, field: keyof DisciplinaItem, value: string | number) => {
    setFormItems((prev) => prev.map((d) => (d.id === id ? { ...d, [field]: value } : d)));
  };

  const handleSalvar = () => {
    const incompletas = formItems.filter(
      (d) => !d.disciplina || !d.horaInicio || !d.horaTermino || !d.professor
    );
    if (incompletas.length > 0) {
      toast({ title: "Campos obrigatórios", description: "Preencha todos os campos antes de salvar.", variant: "destructive" });
      return;
    }
    const novas: AulaSalva[] = formItems.map((d) => ({
      id: crypto.randomUUID(),
      disciplina: d.disciplina,
      professor: d.professor,
      diaSemana: d.diaSemana,
      horaInicio: d.horaInicio,
      horaTermino: d.horaTermino,
    }));
    setAulas((prev) => [...prev, ...novas]);
    setFormItems([{ id: crypto.randomUUID(), disciplina: "", horaInicio: "07:00", horaTermino: "08:00", professor: "", diaSemana: 1 }]);
    setDialogOpen(false);
    toast({ title: "Aulas adicionadas!", description: `${novas.length} aula(s) adicionada(s) ao diário.` });
  };

  // Get aulas for a specific day/hour
  const getAulasForSlot = (dayIndex: number, hour: string) => {
    const hourNum = parseInt(hour.split(":")[0]);
    return aulas.filter((a) => {
      if (a.diaSemana !== dayIndex) return false;
      const startH = parseInt(a.horaInicio.split(":")[0]);
      const endH = parseInt(a.horaTermino.split(":")[0]);
      return hourNum >= startH && hourNum < endH;
    });
  };

  const isStartHour = (aula: AulaSalva, hour: string) => {
    return aula.horaInicio.startsWith(hour.split(":")[0].padStart(2, "0"));
  };

  const getAulaSpan = (aula: AulaSalva) => {
    const startH = parseInt(aula.horaInicio.split(":")[0]);
    const endH = parseInt(aula.horaTermino.split(":")[0]);
    return endH - startH;
  };

  // Track which slots are covered by a multi-hour block
  const renderedAulas = new Set<string>();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <Button variant="ghost" size="icon" onClick={() => navigate("/turmas")}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </div>
            <ThemeToggle />
          </header>

          <main className="flex-1 p-6 space-y-4">
            {/* Turma Header */}
            <div className="space-y-1">
              <h1 className="text-2xl font-bold">
                {info.nivel === "Ensino Fundamental II" ? "EFII" : info.nivel === "Ensino Fundamental I" ? "EFI" : info.nivel} – {info.turma}
              </h1>
              <p className="text-sm text-muted-foreground">
                {info.nivel} | Bimestres | {info.edicao} | {info.escola}
              </p>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="diario" className="space-y-4">
              <TabsList className="bg-muted/50">
                <TabsTrigger value="componentes">Componentes Curriculares</TabsTrigger>
                <TabsTrigger value="diario" className="text-accent data-[state=active]:text-accent">Diário</TabsTrigger>
                <TabsTrigger value="drive">Drive</TabsTrigger>
                <TabsTrigger value="avaliacoes">Avaliações</TabsTrigger>
                <TabsTrigger value="documentos">Emissão de Documentos</TabsTrigger>
              </TabsList>

              <TabsContent value="diario" className="space-y-4">
                {/* Action buttons row */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="icon" className="rounded-full bg-accent hover:bg-accent/90 text-accent-foreground">
                        <Plus className="w-5 h-5" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Adicionar Aulas ao Diário</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        {formItems.map((item, idx) => (
                          <div key={item.id} className="p-4 rounded-lg border bg-muted/30 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Aula {idx + 1}</span>
                              <Button variant="ghost" size="icon" className="text-destructive h-8 w-8" onClick={() => removeFormItem(item.id)} disabled={formItems.length === 1}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1.5">
                                <Label className="text-xs">Disciplina</Label>
                                <Select value={item.disciplina} onValueChange={(v) => updateFormItem(item.id, "disciplina", v)}>
                                  <SelectTrigger><SelectValue placeholder="Selecionar" /></SelectTrigger>
                                  <SelectContent>
                                    {DISCIPLINAS_BASE.map((d) => (
                                      <SelectItem key={d} value={d}>{d}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-1.5">
                                <Label className="text-xs">Dia da Semana</Label>
                                <Select value={String(item.diaSemana)} onValueChange={(v) => updateFormItem(item.id, "diaSemana", parseInt(v))}>
                                  <SelectTrigger><SelectValue /></SelectTrigger>
                                  <SelectContent>
                                    {DIAS_SEMANA.map((d, i) => (
                                      <SelectItem key={i} value={String(i)}>{d}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-1.5">
                                <Label className="text-xs">Hora Início</Label>
                                <Input type="time" value={item.horaInicio} onChange={(e) => updateFormItem(item.id, "horaInicio", e.target.value)} />
                              </div>
                              <div className="space-y-1.5">
                                <Label className="text-xs">Hora Término</Label>
                                <Input type="time" value={item.horaTermino} onChange={(e) => updateFormItem(item.id, "horaTermino", e.target.value)} />
                              </div>
                              <div className="col-span-2 space-y-1.5">
                                <Label className="text-xs">Professor</Label>
                                <Select value={item.professor} onValueChange={(v) => updateFormItem(item.id, "professor", v)}>
                                  <SelectTrigger><SelectValue placeholder="Selecionar" /></SelectTrigger>
                                  <SelectContent>
                                    {PROFESSORES.map((p) => (
                                      <SelectItem key={p} value={p}>{p}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
                        ))}
                        <div className="flex items-center justify-between pt-2">
                          <Button variant="outline" onClick={addFormItem} className="gap-2">
                            <Plus className="w-4 h-4" /> Adicionar Mais
                          </Button>
                          <Button onClick={handleSalvar} className="gap-2">
                            <Save className="w-4 h-4" /> Salvar Todas ({formItems.length})
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Badge className="bg-green-500 text-white border-0 cursor-pointer">Médias</Badge>
                  <Badge className="bg-blue-500 text-white border-0 cursor-pointer">Conteúdos</Badge>
                  <Badge className="bg-red-500 text-white border-0 cursor-pointer">Frequências</Badge>
                  <Badge className="bg-purple-500 text-white border-0 cursor-pointer">Complementares</Badge>
                  <Badge className="bg-teal-600 text-white border-0 cursor-pointer">Horário</Badge>
                </div>

                {/* Week navigation */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => navigateWeek(-1)}>
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => navigateWeek(1)}>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                  <span className="text-sm font-medium">{formatWeekRange(weekDates)}</span>
                  <div className="flex gap-1">
                    <Button variant={viewMode === "Mês" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("Mês")}>Mês</Button>
                    <Button variant={viewMode === "Semana" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("Semana")}>Semana</Button>
                  </div>
                </div>

                {/* Weekly grid */}
                <div className="border rounded-lg overflow-auto bg-card">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr>
                        <th className="border-b border-r p-2 w-16 text-muted-foreground font-normal"></th>
                        {weekDates.map((date, i) => (
                          <th
                            key={i}
                            className={`border-b border-r p-2 text-center font-medium min-w-[120px] ${isToday(date) ? "bg-primary/10 text-primary" : ""}`}
                          >
                            <div>{String(date.getDate()).padStart(2, "0")} {DIAS_SEMANA[i]}</div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {HORAS.map((hora) => (
                        <tr key={hora} className="h-14">
                          <td className="border-b border-r p-2 text-xs text-muted-foreground text-right align-top">
                            {hora}
                          </td>
                          {weekDates.map((_, dayIdx) => {
                            const slotAulas = getAulasForSlot(dayIdx, hora);
                            const startingAulas = slotAulas.filter((a) => isStartHour(a, hora));
                            const coveredKey = `${dayIdx}-${hora}`;

                            // Check if this cell is covered by a multi-hour aula already rendered
                            if (renderedAulas.has(coveredKey)) {
                              return null;
                            }

                            // Mark future hours as rendered for multi-hour aulas
                            let rowSpan = 1;
                            if (startingAulas.length > 0) {
                              const maxSpan = Math.max(...startingAulas.map(getAulaSpan));
                              rowSpan = maxSpan;
                              for (let s = 1; s < maxSpan; s++) {
                                const hIdx = HORAS.indexOf(hora);
                                if (hIdx + s < HORAS.length) {
                                  renderedAulas.add(`${dayIdx}-${HORAS[hIdx + s]}`);
                                }
                              }
                            }

                            return (
                              <td
                                key={dayIdx}
                                rowSpan={rowSpan > 1 ? rowSpan : undefined}
                                className={`border-b border-r p-1 align-top ${isToday(weekDates[dayIdx]) ? "bg-primary/5" : ""}`}
                              >
                                {startingAulas.map((aula) => (
                                  <div
                                    key={aula.id}
                                    className={`rounded p-1.5 border text-xs h-full ${DISCIPLINA_COLORS[aula.disciplina] || "bg-muted border-border"}`}
                                  >
                                    <div className="font-semibold text-[10px]">
                                      {aula.horaInicio} – {aula.horaTermino}
                                    </div>
                                    <div className="font-bold">{aula.disciplina}</div>
                                  </div>
                                ))}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-2">
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-muted-foreground inline-block" /> Prevista</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-500 inline-block" /> Dada</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500 inline-block" /> Falta</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-300 inline-block" /> Compensação</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-amber-500 inline-block" /> Sumário e/ou Frequência por preencher</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-yellow-400 inline-block" /> Aula por validar</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-purple-500 inline-block" /> Reposição de aulas</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-amber-200 inline-block" /> Aula de avaliação</span>
                </div>
              </TabsContent>

              <TabsContent value="componentes">
                <div className="text-center py-12 text-muted-foreground">
                  Componentes Curriculares — Em desenvolvimento
                </div>
              </TabsContent>
              <TabsContent value="drive">
                <div className="text-center py-12 text-muted-foreground">
                  Drive — Em desenvolvimento
                </div>
              </TabsContent>
              <TabsContent value="avaliacoes">
                <div className="text-center py-12 text-muted-foreground">
                  Avaliações — Em desenvolvimento
                </div>
              </TabsContent>
              <TabsContent value="documentos">
                <div className="text-center py-12 text-muted-foreground">
                  Emissão de Documentos — Em desenvolvimento
                </div>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Disciplinas;
