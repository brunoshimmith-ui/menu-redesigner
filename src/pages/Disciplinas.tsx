import { useState, useMemo, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { HeaderWithNotifications } from "@/components/HeaderWithNotifications";
import { Button } from "@/components/ui/button";

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
  const [replicateMode, setReplicateMode] = useState<"semanas" | "mes">("semanas");
  const [replicateMonth, setReplicateMonth] = useState(new Date().getMonth());
  const [replicateMonthYear, setReplicateMonthYear] = useState(new Date().getFullYear());
  const [replicateMonthEndDay, setReplicateMonthEndDay] = useState(31);

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
    let novasFinal: AulaSalva[] = novas;
    if (replicarOnSave) {
      if (replicateMode === "semanas" && replicateWeeks > 0) {
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
      } else if (replicateMode === "mes") {
        // Replicate across every week of the selected month up to end day, skipping holidays.
        // Ensures replicated aulas appear in the week view of every week within the target month.
        const monthStart = new Date(replicateMonthYear, replicateMonth, 1);
        const lastDayOfMonth = new Date(replicateMonthYear, replicateMonth + 1, 0).getDate();
        const endDay = Math.min(replicateMonthEndDay, lastDayOfMonth);
        const endDate = new Date(replicateMonthYear, replicateMonth, endDay);
        endDate.setHours(23, 59, 59, 999);

        // Does the currently viewed week intersect the target month?
        const currentWeekInMonth = weekDates.some(
          (d) => d.getMonth() === replicateMonth && d.getFullYear() === replicateMonthYear && d <= endDate
        );
        // If replicating to a different month, don't anchor novas to the current week
        if (!currentWeekInMonth) novasFinal = [];

        const cursor = new Date(monthStart);
        cursor.setDate(cursor.getDate() - cursor.getDay());
        const seenWeeks = new Set<string>();
        if (currentWeekInMonth) seenWeeks.add(currentWeekKey); // avoid duplicating novas in current week
        while (cursor <= endDate) {
          const targetWeek = getWeekDates(cursor);
          const targetKey = dateKey(targetWeek[0]);
          if (!seenWeeks.has(targetKey)) {
            seenWeeks.add(targetKey);
            novas.forEach((a) => {
              const dayDate = targetWeek[a.diaSemana];
              if (dayDate.getMonth() !== replicateMonth || dayDate.getFullYear() !== replicateMonthYear) return;
              if (dayDate > endDate) return;
              const k = dateKey(dayDate);
              if (holidayMap.has(k) || optionalMap.has(k)) { skipCount++; return; }
              replicadas.push({ ...a, id: crypto.randomUUID(), weekStart: targetKey });
            });
          }
          cursor.setDate(cursor.getDate() + 7);
        }

        // Jump view to the first week of the target month if we replicated elsewhere
        if (!currentWeekInMonth) {
          setCurrentWeek(new Date(replicateMonthYear, replicateMonth, 1));
        }
      }
    }

    setAulas((prev) => [...prev, ...novasFinal, ...replicadas]);
    setFormItems([{ id: crypto.randomUUID(), disciplina: "", horaInicio: "07:00", horaTermino: "08:00", professor: "", diaSemana: 1 }]);
    setDialogOpen(false);
    setSelectedSlots(new Set());
    setReplicarOnSave(false);
    toast({
      title: "Aulas adicionadas!",
      description: replicadas.length > 0
        ? `${novas.length} aula(s) criada(s) + ${replicadas.length} replicada(s). ${skipCount} pulada(s) por feriado.`
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

                        {/* Replicar para próximas semanas / mês */}
                        <div className="rounded-lg border border-dashed bg-muted/30 p-3 space-y-2">
                          <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                            <input
                              type="checkbox"
                              checked={replicarOnSave}
                              onChange={(e) => setReplicarOnSave(e.target.checked)}
                              className="h-4 w-4 rounded accent-primary"
                            />
                            <Copy className="w-4 h-4" /> Replicar estas aulas
                          </label>
                          {replicarOnSave && (
                            <div className="pl-6 space-y-2">
                              <div className="flex gap-1 bg-muted rounded-lg p-1 w-fit">
                                <Button type="button" size="sm" variant={replicateMode === "semanas" ? "default" : "ghost"} className="h-7 text-xs" onClick={() => setReplicateMode("semanas")}>Por semanas</Button>
                                <Button type="button" size="sm" variant={replicateMode === "mes" ? "default" : "ghost"} className="h-7 text-xs" onClick={() => setReplicateMode("mes")}>Por mês</Button>
                              </div>
                              {replicateMode === "semanas" ? (
                                <div className="flex items-center gap-2">
                                  <Label className="text-xs">Quantidade de semanas:</Label>
                                  <Input
                                    type="number"
                                    min={1}
                                    max={52}
                                    value={replicateWeeks}
                                    onChange={(e) => setReplicateWeeks(Math.max(1, Math.min(52, parseInt(e.target.value) || 1)))}
                                    className="h-8 w-20"
                                  />
                                </div>
                              ) : (
                                <div className="flex flex-wrap items-center gap-2">
                                  <Label className="text-xs">Mês:</Label>
                                  <Select value={String(replicateMonth)} onValueChange={(v) => setReplicateMonth(parseInt(v))}>
                                    <SelectTrigger className="h-8 w-32 text-xs"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                      {months.map((m, i) => (
                                        <SelectItem key={i} value={String(i)} className="text-xs">{m}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <Input
                                    type="number"
                                    min={2020}
                                    max={2099}
                                    value={replicateMonthYear}
                                    onChange={(e) => setReplicateMonthYear(parseInt(e.target.value) || new Date().getFullYear())}
                                    className="h-8 w-20"
                                  />
                                  <Label className="text-xs">Até o dia:</Label>
                                  <Input
                                    type="number"
                                    min={1}
                                    max={31}
                                    value={replicateMonthEndDay}
                                    onChange={(e) => setReplicateMonthEndDay(Math.max(1, Math.min(31, parseInt(e.target.value) || 1)))}
                                    className="h-8 w-20"
                                  />
                                </div>
                              )}
                              <p className="text-[11px] text-muted-foreground">
                                Feriados e pontos facultativos são pulados automaticamente. É possível replicar em meses anteriores ou futuros.
                              </p>
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

                  {/* Top horizontal SaaS nav with icons */}
                  {([
                    ["grade", "Grade semanal", CalendarRange],
                    ["medias", "Médias", TrendingUp],
                    ["conteudos", "Conteúdos", BookOpen],
                    ["frequencia", "Frequências", ClipboardList],
                    ["complementares", "Complementares", Sparkles],
                    ["horario", "Horário", Clock],
                  ] as const).map(([key, label, Icon]) => {
                    const active = diarioView === key;
                    return (
                      <button
                        key={key}
                        onClick={() => setDiarioView(key)}
                        className={`relative flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                          active
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {label}
                        {active && (
                          <span className="absolute -bottom-1 left-3 right-3 h-0.5 rounded-full bg-primary" />
                        )}
                      </button>
                    );
                  })}

                </div>

                {/* Slides — Dicas importantes */}
                {tipsEnabled && diarioView === "grade" && (
                  <TipsSlider view={diarioView} onClose={() => setTipsEnabled(false)} />
                )}

                {diarioView === "grade" && (
                  <>
                    {/* Toolbar: pills (semana anterior • intervalo • próxima semana • hoje) | mês • mês/semana */}
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9 rounded-xl gap-2 text-xs font-medium"
                          onClick={() => navigateWeek(-1)}
                        >
                          <ChevronLeft className="w-3.5 h-3.5" /> Semana anterior
                        </Button>
                        <div className="flex items-center gap-2 h-9 px-3 rounded-xl border bg-card text-xs font-semibold">
                          <CalendarIcon className="w-3.5 h-3.5 text-muted-foreground" />
                          {formatWeekRange(weekDates)}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9 rounded-xl gap-2 text-xs font-medium"
                          onClick={() => navigateWeek(1)}
                        >
                          Próxima semana <ChevronRight className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9 rounded-xl gap-1.5 text-xs font-semibold"
                          onClick={() => setCurrentWeek(new Date())}
                        >
                          <CalendarIcon className="w-3.5 h-3.5" /> Hoje
                        </Button>
                      </div>

                      <div className="flex items-center gap-2">
                        <Select value={String(currentWeek.getMonth())} onValueChange={(v) => goToMonth(parseInt(v))}>
                          <SelectTrigger className="h-9 w-32 text-xs rounded-xl">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {months.map((m, i) => (
                              <SelectItem key={i} value={String(i)} className="text-xs">{m}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className="flex gap-0.5 bg-muted rounded-xl p-1">
                          <Button variant={viewMode === "Mês" ? "default" : "ghost"} size="sm" className="h-7 rounded-lg text-xs" onClick={() => setViewMode("Mês")}>Mês</Button>
                          <Button variant={viewMode === "Semana" ? "default" : "ghost"} size="sm" className="h-7 rounded-lg text-xs" onClick={() => setViewMode("Semana")}>Semana</Button>
                        </div>
                      </div>
                    </div>

                    {/* Bimestre meta */}
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

                    {/* Modern alert card */}
                    {tipsEnabled && !isFutureWeek && (weekAulas.length === 0 || weekAulas.some((a) => !isAulaFilled(a))) && (() => {
                      const pendentes = weekAulas.filter((a) => !isAulaFilled(a)).length;
                      const empty = weekAulas.length === 0;
                      return (
                        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/70 dark:bg-amber-950/20 dark:border-amber-900/60 px-4 py-3">
                          <div className="shrink-0 w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
                            <AlertTriangle className="w-4 h-4 text-amber-700 dark:text-amber-300" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-semibold text-amber-900 dark:text-amber-100">
                              {empty ? "Semana sem preenchimento" : "Aulas pendentes de preenchimento"}
                            </p>
                            <p className="text-[12px] text-amber-800/80 dark:text-amber-200/80 leading-snug">
                              {empty
                                ? "Clique em uma célula para criar uma aula ou use + para várias."
                                : `${pendentes} ${pendentes === 1 ? "aula precisa" : "aulas precisam"} de objetivos, habilidades BNCC ou frequência.`}
                            </p>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Grid + right dashboard layout */}
                    <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_300px] gap-4 items-start">
                      {/* Weekly grid (≈80% via grid template) */}
                      <div className="border border-border rounded-2xl overflow-hidden bg-card shadow-sm">
                        <table className="w-full border-collapse text-xs table-fixed">
                          <thead>
                            <tr className="bg-muted/40">
                              <th className="border-b border-r border-border p-2 w-16 text-muted-foreground font-normal"></th>
                              {weekDates.map((date, i) => {
                                const k = dateKey(date);
                                const holiday = holidayMap.get(k);
                                const optional = optionalMap.get(k);
                                return (
                                  <th
                                    key={i}
                                    className={`border-b border-r border-border p-2 text-center font-medium ${isToday(date) ? "bg-primary/10 text-primary" : ""} ${holiday ? "bg-red-50 dark:bg-red-950/30" : optional ? "bg-amber-50 dark:bg-amber-950/30" : ""}`}
                                  >
                                    <div className="text-[13px] font-semibold leading-tight">
                                      <span className="text-foreground">{String(date.getDate()).padStart(2, "0")}</span>{" "}
                                      <span className="text-muted-foreground font-medium">{DIAS_SEMANA[i].charAt(0) + DIAS_SEMANA[i].slice(1).toLowerCase()}</span>
                                    </div>
                                    {holiday && (
                                      <div className="text-[10px] font-medium text-red-700 dark:text-red-400 truncate mt-1 flex items-center justify-center gap-1" title={holiday}>
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> {holiday}
                                      </div>
                                    )}
                                    {!holiday && optional && (
                                      <div className="text-[10px] font-medium text-amber-700 dark:text-amber-400 truncate mt-1 flex items-center justify-center gap-1" title={optional}>
                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Facultativo
                                      </div>
                                    )}
                                  </th>
                                );
                              })}
                            </tr>
                          </thead>
                          <tbody>
                            {HORAS.map((hora) => (
                              <tr key={hora} className="h-16">
                                <td className="border-b border-r border-border px-2 text-[11px] text-muted-foreground text-right align-top pt-1.5 font-medium">
                                  {hora}
                                </td>
                                {weekDates.map((_, dayIdx) => {
                                  const slotAulas = getAulasForSlot(dayIdx, hora);
                                  const startingAulas = slotAulas.filter((a) => isStartHour(a, hora));
                                  const coveredKey = `${dayIdx}-${hora}`;

                                  if (renderedAulas.has(coveredKey)) return null;

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
                                  const isOptional = optionalMap.has(dayKey);

                                  return (
                                    <td
                                      key={dayIdx}
                                      rowSpan={rowSpan > 1 ? rowSpan : undefined}
                                      onClick={() => !hasAula && !isHoliday && openSingleSlot(dayIdx, hora)}
                                      className={`border-b border-r border-border p-1 align-top transition-colors ${
                                        isToday(weekDates[dayIdx]) ? "bg-primary/5" : ""
                                      } ${isHoliday ? "bg-red-50/40 dark:bg-red-950/10" : isOptional ? "bg-amber-50/30 dark:bg-amber-950/10" : ""} ${!hasAula && !isHoliday ? "cursor-pointer hover:bg-accent/10" : ""}`}
                                    >
                                      {startingAulas.map((aula) => {
                                        const filled = isAulaFilled(aula);
                                        const draft = isAulaDraft(aula);
                                        let statusClass = "bg-slate-100 border-slate-300 text-slate-800 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700";
                                        if (isFutureWeek) {
                                          statusClass = "bg-slate-100/60 border-slate-300 text-slate-500 dark:bg-slate-800/60 dark:text-slate-400 dark:border-slate-700 opacity-70";
                                        } else if (filled) {
                                          statusClass = "bg-emerald-50 border-emerald-300 text-emerald-950 dark:bg-emerald-950/40 dark:border-emerald-700 dark:text-emerald-50";
                                        } else if (draft) {
                                          statusClass = "bg-amber-50 border-amber-300 text-amber-950 dark:bg-amber-950/40 dark:text-amber-50 dark:border-amber-700";
                                        }
                                        return (
                                          <div
                                            key={aula.id}
                                            className={`group relative w-full rounded-xl p-2 border text-[11px] h-full hover:shadow-md hover:-translate-y-px transition-all shadow-sm ${statusClass}`}
                                          >
                                            <button
                                              onClick={(e) => { e.stopPropagation(); openAula(aula); }}
                                              className="w-full text-left"
                                            >
                                              <div className="font-bold leading-tight text-[12.5px] flex items-center gap-1.5 pr-5">
                                                <BookOpen className="w-3 h-3 shrink-0 opacity-70" />
                                                <span className="truncate">{aula.disciplina}</span>
                                                {filled && !isFutureWeek && <span className="ml-auto text-emerald-600 dark:text-emerald-400 text-[11px]">✓</span>}
                                              </div>
                                              <div className="text-[10.5px] mt-1 opacity-80 flex items-center gap-1">
                                                <Clock className="w-2.5 h-2.5" />
                                                {aula.horaInicio} – {aula.horaTermino}
                                              </div>
                                              <div className="text-[10.5px] opacity-80 flex items-center gap-1 truncate">
                                                <UserIcon className="w-2.5 h-2.5 shrink-0" />
                                                <span className="truncate">{aula.professor}</span>
                                              </div>
                                              {draft && !filled && !isFutureWeek && (
                                                <div className="mt-1 inline-block text-[9px] px-1.5 py-0.5 rounded-md bg-amber-200/70 dark:bg-amber-700/40 text-amber-900 dark:text-amber-100 font-semibold">
                                                  rascunho
                                                </div>
                                              )}
                                            </button>
                                            <button
                                              onClick={(e) => { e.stopPropagation(); deleteAula(aula.id); }}
                                              title="Excluir aula"
                                              className="absolute top-1 right-1 p-0.5 rounded-md hover:bg-black/10 dark:hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
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

                      {/* Right dashboard panel */}
                      <aside className="space-y-4">
                        {/* Próximas aulas */}
                        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                          <div className="flex items-center gap-2 mb-3">
                            <CalendarIcon className="w-4 h-4 text-primary" />
                            <h3 className="text-sm font-semibold text-foreground">Próximas aulas de hoje</h3>
                          </div>
                          {(() => {
                            const today = new Date();
                            const todayIdx = today.getDay();
                            const isCurrentWeek = weekKind === "current";
                            const todays = isCurrentWeek
                              ? weekAulas
                                  .filter((a) => a.diaSemana === todayIdx)
                                  .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio))
                                  .slice(0, 4)
                              : [];
                            if (todays.length === 0) {
                              return (
                                <p className="text-xs text-muted-foreground py-3 text-center">
                                  Nenhuma aula programada para hoje.
                                </p>
                              );
                            }
                            return (
                              <ul className="space-y-2">
                                {todays.map((a) => (
                                  <li key={a.id} className="flex items-start gap-3 p-2 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => openAula(a)}>
                                    <div className="text-[11px] font-bold text-primary leading-tight min-w-[40px]">
                                      {a.horaInicio}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="text-[12.5px] font-semibold truncate">{a.disciplina}</div>
                                      <div className="text-[11px] text-muted-foreground truncate">{a.professor}</div>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            );
                          })()}
                        </div>

                        {/* Resumo da Semana */}
                        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                          <div className="flex items-center gap-2 mb-3">
                            <BarChart3 className="w-4 h-4 text-primary" />
                            <h3 className="text-sm font-semibold text-foreground">Resumo da Semana</h3>
                          </div>
                          {(() => {
                            const total = weekAulas.length;
                            const pendentes = weekAulas.filter((a) => !isAulaFilled(a)).length;
                            const validadas = weekAulas.filter(isAulaFilled).length;
                            const feriados = weekDates.filter((d) => holidayMap.has(dateKey(d)) || optionalMap.has(dateKey(d))).length;
                            const items = [
                              { label: "aulas criadas", value: total, color: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200" },
                              { label: "pendentes", value: pendentes, color: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200" },
                              { label: "validadas", value: validadas, color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200" },
                              { label: "feriados/facultativos", value: feriados, color: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-200" },
                            ];
                            return (
                              <ul className="space-y-2">
                                {items.map((it) => (
                                  <li key={it.label} className="flex items-center justify-between">
                                    <span className="text-[12.5px] text-muted-foreground capitalize">{it.label}</span>
                                    <span className={`text-[12px] font-bold px-2 py-0.5 rounded-lg ${it.color}`}>{it.value}</span>
                                  </li>
                                ))}
                              </ul>
                            );
                          })()}
                        </div>

                        {/* Legend */}
                        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                          <h3 className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Legenda</h3>
                          <ul className="space-y-1.5 text-[11.5px]">
                            <li className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-slate-100 border border-slate-300 dark:bg-slate-800 dark:border-slate-700 inline-block" /> Criada</li>
                            <li className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-amber-100 border border-amber-300 inline-block" /> Rascunho</li>
                            <li className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-300 inline-block" /> Validada</li>
                            <li className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-red-100 border border-red-300 inline-block" /> Feriado</li>
                            <li className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-amber-50 border border-amber-200 inline-block" /> Facultativo</li>
                          </ul>
                        </div>
                      </aside>
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

const TIPS_BY_VIEW: Record<string, string[]> = {
  grade: [
    "Clique em uma célula vazia para criar uma aula rapidamente.",
    "Use Replicar dentro da criação para copiar a grade por semanas ou por mês.",
    "Feriados e pontos facultativos são pulados automaticamente na replicação.",
    "Aulas em verde estão validadas; em amarelo são rascunhos pendentes.",
  ],
  medias: [
    "Lance AV1–AV4 e RP. A média e o status são calculados automaticamente.",
    "Média mínima para aprovação: 6,0.",
    "Alunos abaixo da média ficam destacados em vermelho.",
  ],
  conteudos: [
    "Preencha objetivo, habilidades BNCC e metodologia dentro de cada aula.",
    "Conteúdos preenchidos avançam o status da aula para rascunho.",
    "Use as habilidades BNCC sugeridas para acelerar o registro.",
  ],
  frequencia: [
    "Registre a frequência diariamente para evitar pendências.",
    "Alunos abaixo de 75% de presença são sinalizados em vermelho.",
    "Use Presença/Falta coletiva para acelerar a chamada.",
  ],
  complementares: [
    "Use para observações pedagógicas: comportamento, participação, dificuldades.",
    "Anotações ajudam no acompanhamento individual do aluno.",
  ],
  horario: [
    "Visualize a distribuição semanal das aulas e professores.",
    "O horário é gerado automaticamente a partir da grade.",
  ],
};

function TipsSlider({ view }: { view: string }) {
  const slides = TIPS_BY_VIEW[view] || [];
  const [idx, setIdx] = useState(0);
  useEffect(() => { setIdx(0); }, [view]);
  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [slides.length]);
  if (slides.length === 0) return null;
  const prev = () => setIdx((i) => (i - 1 + slides.length) % slides.length);
  const next = () => setIdx((i) => (i + 1) % slides.length);
  return (
    <div className="w-full max-w-[820px] mx-auto">
      <div className="relative rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 dark:border-blue-900/60 overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="shrink-0 w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
            <Lightbulb className="w-4 h-4 text-blue-700 dark:text-blue-200" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold text-blue-900 dark:text-blue-100 leading-none mb-1">
              Dicas importantes
            </p>
            <p key={idx} className="text-[12.5px] text-blue-900/90 dark:text-blue-100/90 leading-snug animate-in fade-in slide-in-from-right-2 duration-300">
              {slides[idx]}
            </p>
          </div>
          {slides.length > 1 && (
            <div className="flex items-center gap-1 shrink-0">
              <button onClick={prev} className="p-1 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/40" aria-label="Anterior">
                <ChevronLeft className="w-4 h-4 text-blue-700 dark:text-blue-200" />
              </button>
              <button onClick={next} className="p-1 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/40" aria-label="Próximo">
                <ChevronRight className="w-4 h-4 text-blue-700 dark:text-blue-200" />
              </button>
            </div>
          )}
        </div>
        {slides.length > 1 && (
          <div className="flex items-center justify-center gap-1.5 pb-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`h-1.5 rounded-full transition-all ${i === idx ? "w-6 bg-blue-600 dark:bg-blue-300" : "w-1.5 bg-blue-300 dark:bg-blue-700"}`}
                aria-label={`Ir para slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Disciplinas;

