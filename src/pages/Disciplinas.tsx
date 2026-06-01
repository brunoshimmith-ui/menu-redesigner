import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { HeaderWithNotifications } from "@/components/HeaderWithNotifications";
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
  ChevronLeft,
  ChevronRight,
  Copy,
  CalendarDays,
  X,
  CalendarRange,
  TrendingUp,
  BookOpen,
  ClipboardList,
  Sparkles,
  Clock,
  Lightbulb,
  ChevronDown,
  AlertTriangle,
  Calendar as CalendarIcon,
  BarChart3,
  User as UserIcon,
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "@/hooks/use-toast";
import { AulaActionsDialog, type AulaSalva } from "@/components/AulaActionsDialog";
import {
  MediasPanel, ConteudosPanel, FrequenciaPanel, ComplementaresPanel, HorarioPanel,
} from "@/components/diario/DiarioPanels";
import {
  ComponentesCurricularesPanel, DrivePanel, AvaliacoesPanel, EmissaoDocumentosPanel,
} from "@/components/diario/TabPanels";
import { TipsToggle, useDiarioTips } from "@/components/diario/DiarioTips";
import { holidays, optionalDays, bimestres, dateKey, toDate } from "@/lib/calendario";


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
  "Língua Portuguesa": "bg-amber-400 border-amber-600 text-amber-950 dark:bg-amber-500 dark:text-amber-50 dark:border-amber-400",
  "Matemática": "bg-emerald-400 border-emerald-600 text-emerald-950 dark:bg-emerald-500 dark:text-emerald-50 dark:border-emerald-400",
  "Inglês": "bg-sky-400 border-sky-600 text-sky-950 dark:bg-sky-500 dark:text-sky-50 dark:border-sky-400",
  "Ciências": "bg-violet-400 border-violet-600 text-violet-950 dark:bg-violet-500 dark:text-violet-50 dark:border-violet-400",
  "Ensino Religioso": "bg-pink-400 border-pink-600 text-pink-950 dark:bg-pink-500 dark:text-pink-50 dark:border-pink-400",
  "História": "bg-orange-400 border-orange-600 text-orange-950 dark:bg-orange-500 dark:text-orange-50 dark:border-orange-400",
  "Geografia": "bg-red-400 border-red-600 text-red-950 dark:bg-red-500 dark:text-red-50 dark:border-red-400",
  "Artes": "bg-teal-400 border-teal-600 text-teal-950 dark:bg-teal-500 dark:text-teal-50 dark:border-teal-400",
  "Educação Física": "bg-indigo-400 border-indigo-600 text-indigo-950 dark:bg-indigo-500 dark:text-indigo-50 dark:border-indigo-400",
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

// AulaSalva é importado de AulaActionsDialog

interface DisciplinaItem {
  id: string;
  disciplina: string;
  horaInicio: string;
  horaTermino: string;
  professor: string;
  diaSemana: number;
}

const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const HORAS = Array.from({ length: 11 }, (_, i) => {
  const h = i + 7;
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
  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set());
  const [aulaActionsOpen, setAulaActionsOpen] = useState(false);
  const [activeAula, setActiveAula] = useState<AulaSalva | null>(null);
  const [diarioView, setDiarioView] = useState<"grade" | "medias" | "conteudos" | "frequencia" | "complementares" | "horario">("grade");
  const { enabled: tipsEnabled, setEnabled: setTipsEnabled } = useDiarioTips();
  const [replicarOnSave, setReplicarOnSave] = useState(false);
  const [replicateWeeks, setReplicateWeeks] = useState(4);

  const weekDates = useMemo(() => getWeekDates(currentWeek), [currentWeek]);
  const currentWeekKey = dateKey(weekDates[0]);

  // Holiday lookup
  const holidayMap = useMemo(() => {
    const m = new Map<string, string>();
    holidays.forEach((h) => m.set(h.date, h.name));
    return m;
  }, []);
  const optionalMap = useMemo(() => {
    const m = new Map<string, string>();
    optionalDays.forEach((h) => m.set(h.date, h.name));
    return m;
  }, []);

  const currentBimestre = useMemo(() => {
    const k = dateKey(weekDates[0]);
    return bimestres.find((b) => k >= b.inicio && k <= b.fim) || null;
  }, [weekDates]);

  // Aulas filtered to current week (or legacy aulas without weekStart show in any week)
  const weekAulas = useMemo(
    () => aulas.filter((a) => !a.weekStart || a.weekStart === currentWeekKey),
    [aulas, currentWeekKey]
  );

  const getWeekKind = (): "past" | "current" | "future" => {
    const today = new Date();
    const startToday = new Date(today);
    startToday.setDate(today.getDate() - today.getDay());
    startToday.setHours(0, 0, 0, 0);
    const startWeek = new Date(weekDates[0]);
    startWeek.setHours(0, 0, 0, 0);
    if (startWeek.getTime() === startToday.getTime()) return "current";
    return startWeek.getTime() > startToday.getTime() ? "future" : "past";
  };
  const weekKind = getWeekKind();
  const isFutureWeek = weekKind === "future";

  const isAulaFilled = (a: AulaSalva) => {
    const hasContent = !!(a.conteudo?.objetivo?.trim() && (a.conteudo?.habilidades?.length ?? 0) > 0);
    const hasFreq = !!(a.frequencia && Object.keys(a.frequencia.registros || {}).length > 0);
    return hasContent && hasFreq;
  };
  const isAulaDraft = (a: AulaSalva) => {
    const hasContent = !!(a.conteudo?.objetivo?.trim() || (a.conteudo?.habilidades?.length ?? 0) > 0);
    const hasFreq = !!(a.frequencia && Object.keys(a.frequencia.registros || {}).length > 0);
    return (hasContent || hasFreq) && !isAulaFilled(a);
  };

  const openAula = (a: AulaSalva) => {
    if (isFutureWeek) {
      toast({
        title: "Aula bloqueada",
        description: "Esta aula não pode ser preenchida pois está fora da semana atual. Será liberada a partir da data inicial.",
      });
      return;
    }
    setActiveAula(a);
    setAulaActionsOpen(true);
  };

  const updateAula = (updated: AulaSalva) => {
    setAulas((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    setActiveAula(updated);
  };


  // Form state for adding disciplines
  const [formItems, setFormItems] = useState<DisciplinaItem[]>([
    { id: crypto.randomUUID(), disciplina: "", horaInicio: "07:00", horaTermino: "08:00", professor: "", diaSemana: 1 },
  ]);

  const openSingleSlot = (dayIdx: number, hora: string) => {
    if (isFutureWeek) {
      toast({
        title: "Semana bloqueada",
        description: "Esta semana ainda não foi liberada. Aulas só podem ser criadas/preenchidas a partir da data inicial.",
      });
      return;
    }
    const startH = parseInt(hora.split(":")[0]);
    setFormItems([
      {
        id: crypto.randomUUID(),
        disciplina: "",
        horaInicio: hora,
        horaTermino: `${String(startH + 1).padStart(2, "0")}:00`,
        professor: "",
        diaSemana: dayIdx,
      },
    ]);
    setSelectedSlots(new Set());
    setDialogOpen(true);
  };

  const openDialogFromSelection = () => {
    if (selectedSlots.size === 0) return;
    const items: DisciplinaItem[] = Array.from(selectedSlots).sort().map((key) => {
      const [day, hora] = key.split("-");
      const startH = parseInt(hora.split(":")[0]);
      return {
        id: crypto.randomUUID(),
        disciplina: "",
        horaInicio: hora,
        horaTermino: `${String(startH + 1).padStart(2, "0")}:00`,
        professor: "",
        diaSemana: parseInt(day),
      };
    });
    setFormItems(items);
    setDialogOpen(true);
  };


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
      status: "criada",
      weekStart: currentWeekKey,
    }));

    // Replicate to next weeks if requested
    const replicadas: AulaSalva[] = [];
    let skipCount = 0;
    if (replicarOnSave && replicateWeeks > 0) {
      for (let w = 1; w <= replicateWeeks; w++) {
        const target = new Date(weekDates[0]);
        target.setDate(target.getDate() + w * 7);
        const targetWeek = getWeekDates(target);
        const targetKey = dateKey(targetWeek[0]);
        novas.forEach((a) => {
          const dayDate = targetWeek[a.diaSemana];
          const k = dateKey(dayDate);
          if (holidayMap.has(k) || optionalMap.has(k)) { skipCount++; return; }
          replicadas.push({ ...a, id: crypto.randomUUID(), weekStart: targetKey });
        });
      }
    }

    setAulas((prev) => [...prev, ...novas, ...replicadas]);
    setFormItems([{ id: crypto.randomUUID(), disciplina: "", horaInicio: "07:00", horaTermino: "08:00", professor: "", diaSemana: 1 }]);
    setDialogOpen(false);
    setSelectedSlots(new Set());
    setReplicarOnSave(false);
    toast({
      title: "Aulas adicionadas!",
      description: replicadas.length > 0
        ? `${novas.length} aula(s) criada(s) + ${replicadas.length} replicada(s) em ${replicateWeeks} semana(s). ${skipCount} pulada(s) por feriado.`
        : `${novas.length} aula(s) adicionada(s) ao diário.`,
    });
  };

  const deleteAula = (id: string) => {
    setAulas((prev) => prev.filter((a) => a.id !== id));
    toast({ title: "Aula excluída" });
  };



  const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  const goToMonth = (m: number) => {
    const d = new Date(currentWeek.getFullYear(), m, 1);
    setCurrentWeek(d);
  };

  // Get aulas for a specific day/hour (filtered by current week)
  const getAulasForSlot = (dayIndex: number, hour: string) => {
    const hourNum = parseInt(hour.split(":")[0]);
    return weekAulas.filter((a) => {
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
          <HeaderWithNotifications />

          <main className="flex-1 p-6 space-y-4">
            {/* Turma Header */}
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-slate-700 dark:text-slate-200">
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
                  <Dialog open={dialogOpen} onOpenChange={(open) => {
                    setDialogOpen(open);
                    if (!open) setSelectedSlots(new Set());
                  }}>
                    <DialogTrigger asChild>
                      <Button size="icon" className="rounded-full bg-accent hover:bg-accent/90 text-accent-foreground">
                        <Plus className="w-5 h-5" />
                      </Button>
                    </DialogTrigger>
                    {selectedSlots.size > 0 && (
                      <Button size="sm" variant="outline" className="gap-1" onClick={openDialogFromSelection}>
                        <Plus className="w-4 h-4" /> Adicionar nas {selectedSlots.size} selecionadas
                      </Button>
                    )}
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
                        </div>

                        {/* Replicar para próximas semanas */}
                        <div className="rounded-lg border border-dashed bg-muted/30 p-3 space-y-2">
                          <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                            <input
                              type="checkbox"
                              checked={replicarOnSave}
                              onChange={(e) => setReplicarOnSave(e.target.checked)}
                              className="h-4 w-4 rounded accent-primary"
                            />
                            <Copy className="w-4 h-4" /> Replicar estas aulas para as próximas semanas
                          </label>
                          {replicarOnSave && (
                            <div className="flex items-center gap-2 pl-6">
                              <Label className="text-xs">Quantidade de semanas:</Label>
                              <Input
                                type="number"
                                min={1}
                                max={52}
                                value={replicateWeeks}
                                onChange={(e) => setReplicateWeeks(Math.max(1, Math.min(52, parseInt(e.target.value) || 1)))}
                                className="h-8 w-20"
                              />
                              <span className="text-[11px] text-muted-foreground">
                                Feriados e pontos facultativos são pulados automaticamente.
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex justify-end pt-2">
                          <Button onClick={handleSalvar} className="gap-2">
                            <Save className="w-4 h-4" /> Salvar Todas ({formItems.length})
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {([
                    ["grade", "Grade semanal", "bg-slate-500"],
                    ["medias", "Médias", "bg-green-500"],
                    ["conteudos", "Conteúdos", "bg-blue-500"],
                    ["frequencia", "Frequências", "bg-red-500"],
                    ["complementares", "Complementares", "bg-purple-500"],
                    ["horario", "Horário", "bg-teal-600"],
                  ] as const).map(([key, label, color]) => (
                    <Badge
                      key={key}
                      onClick={() => setDiarioView(key)}
                      className={`${color} text-white border-0 cursor-pointer ${diarioView === key ? "ring-2 ring-offset-2 ring-foreground/40" : "opacity-70 hover:opacity-100"}`}
                    >
                      {label}
                    </Badge>
                  ))}

                  <div className="ml-auto">
                    <TipsToggle enabled={tipsEnabled} onChange={setTipsEnabled} />
                  </div>
                </div>

                {/* Contextual tips per screen — centered, 70% width */}
                <div className="w-full max-w-[980px] mx-auto space-y-2">
                {tipsEnabled && diarioView === "grade" && (
                  <TipBanner variant="tip" title="Dica — Grade semanal" dismissKey="grade">
                    Clique em uma célula vazia para criar 1 aula ou use <b>+</b> para várias.
                    Dentro da criação, marque <b>Replicar</b> para copiar a grade para as próximas semanas (feriados são pulados automaticamente).
                  </TipBanner>
                )}
                {tipsEnabled && diarioView === "medias" && (
                  <TipBanner variant="info" title="Dica — Médias" dismissKey="medias">
                    Lance as notas AV1–AV4 e recuperações (RP). A média e o status (Aprovado/Reprovado) são calculados automaticamente. Média mínima: 6,0.
                  </TipBanner>
                )}
                {tipsEnabled && diarioView === "conteudos" && (
                  <TipBanner variant="info" title="Dica — Conteúdos" dismissKey="conteudos">
                    Os conteúdos refletem o que foi registrado em cada aula. Preencha <b>Objetivo</b>, <b>Habilidades BNCC</b> e <b>Metodologia</b> dentro de cada aula da grade.
                  </TipBanner>
                )}
                {tipsEnabled && diarioView === "frequencia" && (
                  <TipBanner variant="warn" title="Atenção — Frequência" dismissKey="freq">
                    A frequência deve ser registrada <b>diariamente</b>. Alunos com presença abaixo de 75% serão sinalizados em vermelho.
                  </TipBanner>
                )}
                {tipsEnabled && diarioView === "complementares" && (
                  <TipBanner variant="info" title="Dica — Complementares" dismissKey="comp">
                    Use este espaço para registrar observações pedagógicas que complementam o diário (comportamento, participação, dificuldades).
                  </TipBanner>
                )}
                {tipsEnabled && diarioView === "horario" && (
                  <TipBanner variant="info" title="Dica — Horário" dismissKey="hor">
                    Visualize a distribuição semanal de aulas e professores. As aulas são geradas a partir dos lançamentos na grade.
                  </TipBanner>
                )}
                </div>

                {diarioView === "grade" && (
                  <>
                    {/* Toolbar — week navigation + month filter + replicate */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => navigateWeek(-1)}>
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => navigateWeek(1)}>
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                        <span className="text-sm font-medium">{formatWeekRange(weekDates)}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Select value={String(currentWeek.getMonth())} onValueChange={(v) => goToMonth(parseInt(v))}>
                          <SelectTrigger className="h-8 w-36 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {months.map((m, i) => (
                              <SelectItem key={i} value={String(i)} className="text-xs">{m}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>


                        <div className="flex gap-1">
                          <Button variant={viewMode === "Mês" ? "default" : "ghost"} size="sm" className="h-8" onClick={() => setViewMode("Mês")}>Mês</Button>
                          <Button variant={viewMode === "Semana" ? "default" : "ghost"} size="sm" className="h-8" onClick={() => setViewMode("Semana")}>Semana</Button>
                        </div>
                      </div>
                    </div>

                    {/* Bimestre / week meta info */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="w-3.5 h-3.5" />
                        {currentBimestre
                          ? <>Bimestre {currentBimestre.n}: <b className="text-foreground">{toDate(currentBimestre.inicio).toLocaleDateString("pt-BR")}</b> a <b className="text-foreground">{toDate(currentBimestre.fim).toLocaleDateString("pt-BR")}</b></>
                          : "Fora do período letivo"}
                      </span>
                      {weekDates.some((d) => holidayMap.has(dateKey(d)) || optionalMap.has(dateKey(d))) && (
                        <span className="flex items-center gap-1 text-amber-700 dark:text-amber-400">
                          • Esta semana tem feriado / ponto facultativo
                        </span>
                      )}
                    </div>

                    {/* Empty-week warning — centered, 70% width */}
                    <div className="w-full max-w-[980px] mx-auto space-y-2">
                    {tipsEnabled && !isFutureWeek && weekAulas.length === 0 && (
                      <TipBanner variant="warn" title="Semana sem preenchimento">
                        Esta semana ainda não tem aulas lançadas. Lembre-se de registrar <b>conteúdos</b>, <b>frequência</b> e, quando houver, <b>notas</b>.
                        Clique em uma célula para criar uma aula ou use <b>+</b> para várias.
                      </TipBanner>
                    )}
                    {tipsEnabled && !isFutureWeek && weekAulas.length > 0 && weekAulas.every((a) => !isAulaFilled(a)) && (
                      <TipBanner variant="warn" title="Aulas pendentes de preenchimento">
                        As aulas desta semana foram criadas mas ainda não têm <b>objetivo</b>, <b>habilidades BNCC</b> e <b>frequência</b> registrados.
                      </TipBanner>
                    )}
                    </div>

                    {/* Weekly grid — centered, wider for prominence */}
                    <div className="border rounded-lg overflow-auto bg-card w-full max-w-[1400px] mx-auto">
                      <table className="w-full border-collapse text-xs table-fixed">
                        <thead>
                          <tr>
                            <th className="border-b border-r p-1.5 w-14 text-muted-foreground font-normal"></th>
                            {weekDates.map((date, i) => {
                              const k = dateKey(date);
                              const holiday = holidayMap.get(k);
                              const optional = optionalMap.get(k);
                              return (
                                <th
                                  key={i}
                                  className={`border-b border-r p-1.5 text-center font-medium ${isToday(date) ? "bg-primary/10 text-primary" : ""} ${holiday ? "bg-red-50 dark:bg-red-950/30" : optional ? "bg-amber-50 dark:bg-amber-950/30" : ""}`}
                                >
                                  <div className="text-[12px]">{String(date.getDate()).padStart(2, "0")} {DIAS_SEMANA[i]}</div>
                                  {holiday && (
                                    <div className="text-[10px] font-normal text-red-700 dark:text-red-400 truncate" title={holiday}>
                                      🔴 {holiday}
                                    </div>
                                  )}
                                  {!holiday && optional && (
                                    <div className="text-[10px] font-normal text-amber-700 dark:text-amber-400 truncate" title={optional}>
                                      🟡 Facultativo
                                    </div>
                                  )}
                                </th>
                              );
                            })}
                          </tr>
                        </thead>
                        <tbody>
                          {HORAS.map((hora) => (
                            <tr key={hora} className="h-12">
                              <td className="border-b border-r px-1.5 text-[11px] text-muted-foreground text-right align-top pt-1">
                                {hora}
                              </td>
                              {weekDates.map((_, dayIdx) => {
                                const slotAulas = getAulasForSlot(dayIdx, hora);
                                const startingAulas = slotAulas.filter((a) => isStartHour(a, hora));
                                const coveredKey = `${dayIdx}-${hora}`;

                                if (renderedAulas.has(coveredKey)) {
                                  return null;
                                }

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

                                const hasAula = startingAulas.length > 0;
                                const dayKey = dateKey(weekDates[dayIdx]);
                                const isHoliday = holidayMap.has(dayKey);

                                return (
                                  <td
                                    key={dayIdx}
                                    rowSpan={rowSpan > 1 ? rowSpan : undefined}
                                    onClick={() => !hasAula && !isHoliday && openSingleSlot(dayIdx, hora)}
                                    className={`border-b border-r p-1 align-top transition-colors ${
                                      isToday(weekDates[dayIdx]) ? "bg-primary/5" : ""
                                    } ${isHoliday ? "bg-red-50/40 dark:bg-red-950/10" : ""} ${!hasAula && !isHoliday ? "cursor-pointer hover:bg-accent/20" : ""}`}
                                  >
                                    {startingAulas.map((aula) => {
                                      const filled = isAulaFilled(aula);
                                      const draft = isAulaDraft(aula);
                                      // Cinza claro por padrão; verde forte quando validada
                                      let statusClass = "bg-slate-200 border-slate-400 text-slate-800 dark:bg-slate-700 dark:text-slate-100 dark:border-slate-500";
                                      if (isFutureWeek) {
                                        statusClass = "bg-slate-200/60 border-slate-400 text-slate-500 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-600 opacity-70";
                                      } else if (filled) {
                                        statusClass = "bg-emerald-500 border-emerald-700 text-white dark:bg-emerald-600 dark:border-emerald-400";
                                      } else if (draft) {
                                        statusClass = "bg-amber-200 border-amber-500 text-amber-900 dark:bg-amber-600/70 dark:text-amber-50 dark:border-amber-400";
                                      }
                                      return (
                                        <div
                                          key={aula.id}
                                          className={`relative w-full rounded-md p-1.5 border text-[11px] h-full hover:ring-2 hover:ring-primary/60 transition shadow-sm ${statusClass}`}
                                        >
                                          <button
                                            onClick={(e) => { e.stopPropagation(); openAula(aula); }}
                                            className="w-full text-left"
                                          >
                                            <div className="font-semibold text-[10px] flex items-center justify-between pr-4">
                                              <span>{aula.horaInicio}–{aula.horaTermino}</span>
                                              {filled && !isFutureWeek && <span title="Validada">✓</span>}
                                              {draft && !filled && !isFutureWeek && (
                                                <span className="text-[9px] px-1 rounded bg-black/10 dark:bg-white/10" title="Rascunho">rascunho</span>
                                              )}
                                            </div>
                                            <div className="font-bold truncate leading-tight text-[12px]">{aula.disciplina}</div>
                                            <div className="text-[10px] opacity-80 truncate leading-tight">{aula.professor}</div>
                                          </button>
                                          <button
                                            onClick={(e) => { e.stopPropagation(); deleteAula(aula.id); }}
                                            title="Excluir aula"
                                            className="absolute top-0.5 right-0.5 p-0.5 rounded hover:bg-black/20 opacity-60 hover:opacity-100"
                                          >
                                            <X className="w-3 h-3" />
                                          </button>
                                        </div>
                                      );
                                    })}
                                  </td>
                                );

                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>


                    {/* Legend — status das aulas */}
                    <div className="flex flex-wrap gap-3 text-[12px] text-muted-foreground pt-1">
                      <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-slate-200 border border-slate-400 inline-block" /> Criada</span>
                      <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-200 border border-amber-500 inline-block" /> Rascunho</span>
                      <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-500 border border-emerald-700 inline-block" /> Validada</span>
                      <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-slate-300/70 border border-slate-500 inline-block" /> Semana futura</span>
                      <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-100 border border-red-300 inline-block" /> Feriado</span>
                      <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-100 border border-amber-300 inline-block" /> Ponto facultativo</span>
                    </div>

                  </>
                )}

                {diarioView === "medias" && <MediasPanel aulas={aulas} />}
                {diarioView === "conteudos" && <ConteudosPanel aulas={aulas} />}
                {diarioView === "frequencia" && <FrequenciaPanel aulas={aulas} />}
                {diarioView === "complementares" && <ComplementaresPanel aulas={aulas} />}
                {diarioView === "horario" && <HorarioPanel aulas={aulas} />}


              </TabsContent>

              <TabsContent value="componentes">
                <ComponentesCurricularesPanel aulas={aulas} />
              </TabsContent>
              <TabsContent value="drive">
                <DrivePanel aulas={aulas} />
              </TabsContent>
              <TabsContent value="avaliacoes">
                <AvaliacoesPanel aulas={aulas} />
              </TabsContent>
              <TabsContent value="documentos">
                <EmissaoDocumentosPanel />
              </TabsContent>
            </Tabs>

            <AulaActionsDialog
              open={aulaActionsOpen}
              onOpenChange={setAulaActionsOpen}
              aula={activeAula}
              aulas={aulas}
              onSave={updateAula}
              onNavigate={(a) => setActiveAula(a)}
            />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Disciplinas;
