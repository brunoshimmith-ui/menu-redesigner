import { useState, useEffect } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Pencil, BookOpen, ClipboardCheck, ArrowLeft, ArrowRight, Save, Calendar, Clock, User, FileText,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { BNCC_HABILIDADES, ALUNOS_TURMA } from "@/lib/bncc";
import { cn } from "@/lib/utils";

const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const PROFESSORES = [
  "Ana Paula Silva", "Carlos Eduardo Santos", "Fernanda Lima",
  "José Roberto Costa", "Mariana Oliveira", "Paulo Henrique Souza",
];

export type AulaStatus = "criada" | "preenchida";

export interface AulaSalva {
  id: string;
  disciplina: string;
  professor: string;
  diaSemana: number;
  horaInicio: string;
  horaTermino: string;
  status?: AulaStatus;
  observacao?: string;
  isAvaliacao?: boolean;
  isFalta?: boolean;
  recorrente?: boolean;
  replicar?: { ativo: boolean; semanas: number };

  weekStart?: string; // ISO yyyy-mm-dd of Sunday of the week this aula belongs to
  conteudo?: {
    objetivo: string;
    habilidades: string[];
    metodologia: string;
  };
  frequencia?: {
    registros: Record<string, "P" | "F" | "FJ">;
    observacao: string;
  };
}

type Tab = "menu" | "editar" | "conteudo" | "frequencia";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  aula: AulaSalva | null;
  aulas: AulaSalva[];
  onSave: (a: AulaSalva) => void;
  onNavigate: (a: AulaSalva) => void;
}

export function AulaActionsDialog({ open, onOpenChange, aula, aulas, onSave, onNavigate }: Props) {
  const [tab, setTab] = useState<Tab>("menu");
  const [draft, setDraft] = useState<AulaSalva | null>(null);

  useEffect(() => {
    setDraft(aula ? { ...aula } : null);
    setTab("menu");
  }, [aula]);

  if (!draft) return null;

  const update = <K extends keyof AulaSalva>(k: K, v: AulaSalva[K]) =>
    setDraft((d) => (d ? { ...d, [k]: v } : d));

  const habilidadesDaDisciplina = BNCC_HABILIDADES[draft.disciplina] || [];

  // próxima aula no mesmo dia/professor
  const sortedSameDay = aulas
    .filter((a) => a.diaSemana === draft.diaSemana)
    .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));
  const idx = sortedSameDay.findIndex((a) => a.id === draft.id);
  const prev = idx > 0 ? sortedSameDay[idx - 1] : null;
  const next = idx >= 0 && idx < sortedSameDay.length - 1 ? sortedSameDay[idx + 1] : null;

  const handleSave = (markFilled = false) => {
    const updated: AulaSalva = {
      ...draft,
      status: markFilled
        ? "preenchida"
        : draft.conteudo?.objetivo && draft.frequencia
          ? "preenchida"
          : draft.status || "criada",
    };
    onSave(updated);
    toast({ title: "Aula salva!", description: "As alterações foram aplicadas." });
  };

  const toggleHabilidade = (cod: string) => {
    const cur = draft.conteudo?.habilidades || [];
    const has = cur.includes(cod);
    update("conteudo", {
      objetivo: draft.conteudo?.objetivo || "",
      metodologia: draft.conteudo?.metodologia || "",
      habilidades: has ? cur.filter((h) => h !== cod) : [...cur, cod],
    });
  };

  const setFreq = (aluno: string, v: "P" | "F" | "FJ") => {
    const regs = { ...(draft.frequencia?.registros || {}) };
    regs[aluno] = v;
    update("frequencia", {
      registros: regs,
      observacao: draft.frequencia?.observacao || "",
    });
  };

  const setAllFreq = (v: "P" | "F") => {
    const regs: Record<string, "P" | "F" | "FJ"> = {};
    ALUNOS_TURMA.forEach((a) => (regs[a] = v));
    update("frequencia", {
      registros: regs,
      observacao: draft.frequencia?.observacao || "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {tab !== "menu" && (
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setTab("menu")}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            <span className="text-base">
              {draft.disciplina} • {DIAS_SEMANA[draft.diaSemana]} {draft.horaInicio}-{draft.horaTermino}
            </span>
            <Badge
              className={cn(
                "ml-2 border-0 text-white",
                draft.status === "preenchida" ? "bg-edu-green" : "bg-edu-blue"
              )}
            >
              {draft.status === "preenchida" ? "Preenchida" : "Criada"}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        {tab === "menu" && (
          <div className="space-y-3 pt-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => setTab("editar")}
                className="rounded-2xl border border-border p-5 text-left hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <Pencil className="w-6 h-6 text-edu-blue mb-2" />
                <p className="font-semibold">Editar aula</p>
                <p className="text-xs text-muted-foreground">Data, horário, professor, observações</p>
              </button>
              <button
                onClick={() => setTab("conteudo")}
                className="rounded-2xl border border-border p-5 text-left hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <BookOpen className="w-6 h-6 text-edu-purple mb-2" />
                <p className="font-semibold">Conteúdo</p>
                <p className="text-xs text-muted-foreground">Objetivo, habilidades BNCC, metodologia</p>
              </button>
              <button
                onClick={() => setTab("frequencia")}
                className="rounded-2xl border border-border p-5 text-left hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <ClipboardCheck className="w-6 h-6 text-edu-coral mb-2" />
                <p className="font-semibold">Frequência</p>
                <p className="text-xs text-muted-foreground">Chamada de alunos</p>
              </button>
            </div>

            {/* Fluxo entre aulas */}
            <div className="flex items-center justify-between pt-2 border-t border-border mt-3">
              <Button
                size="sm" variant="outline"
                disabled={!prev}
                onClick={() => prev && onNavigate(prev)}
                className="gap-1"
              >
                <ArrowLeft className="w-4 h-4" /> Aula anterior
              </Button>
              <span className="text-xs text-muted-foreground">
                {idx + 1} de {sortedSameDay.length} aulas em {DIAS_SEMANA[draft.diaSemana]}
              </span>
              <Button
                size="sm" variant="outline"
                disabled={!next}
                onClick={() => next && onNavigate(next)}
                className="gap-1"
              >
                Próxima aula <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {tab === "editar" && (
          <div className="space-y-3 pt-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs flex items-center gap-1"><Calendar className="w-3 h-3" /> Dia (reagendamento)</Label>
                <Select value={String(draft.diaSemana)} onValueChange={(v) => update("diaSemana", parseInt(v))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {DIAS_SEMANA.map((d, i) => <SelectItem key={i} value={String(i)}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs flex items-center gap-1"><User className="w-3 h-3" /> Professor</Label>
                <Select value={draft.professor} onValueChange={(v) => update("professor", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PROFESSORES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs flex items-center gap-1"><Clock className="w-3 h-3" /> Hora início</Label>
                <Input type="time" value={draft.horaInicio} onChange={(e) => update("horaInicio", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs flex items-center gap-1"><Clock className="w-3 h-3" /> Hora término</Label>
                <Input type="time" value={draft.horaTermino} onChange={(e) => update("horaTermino", e.target.value)} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Observação</Label>
              <Textarea value={draft.observacao || ""} onChange={(e) => update("observacao", e.target.value)} placeholder="Notas, ajustes, lembretes..." />
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <label className="flex items-center gap-2 text-sm">
                <Checkbox checked={!!draft.isAvaliacao} onCheckedChange={(v) => update("isAvaliacao", !!v)} />
                Aula de avaliação
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox checked={!!draft.isFalta} onCheckedChange={(v) => update("isFalta", !!v)} />
                Falta
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox checked={!!draft.recorrente} onCheckedChange={(v) => update("recorrente", !!v)} />
                Salvar para recorrência
              </label>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setTab("menu")}>Cancelar</Button>
              <Button onClick={() => { handleSave(); setTab("menu"); }} className="gap-1">
                <Save className="w-4 h-4" /> Salvar alterações
              </Button>
            </DialogFooter>
          </div>
        )}

        {tab === "conteudo" && (
          <div className="space-y-4 pt-3">
            <div className="space-y-1.5">
              <Label className="text-xs flex items-center gap-1">
                <FileText className="w-3 h-3" /> Objetivo de conhecimento / Conteúdo
              </Label>
              <Textarea
                value={draft.conteudo?.objetivo || ""}
                onChange={(e) => update("conteudo", { ...(draft.conteudo || { habilidades: [], metodologia: "" }), objetivo: e.target.value })}
                placeholder="Descreva o objetivo da aula e o conteúdo a ser trabalhado..."
                rows={3}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">
                Habilidades / Competências BNCC — {draft.disciplina}
              </Label>
              {habilidadesDaDisciplina.length === 0 ? (
                <p className="text-xs text-muted-foreground">Nenhuma habilidade cadastrada para essa disciplina.</p>
              ) : (
                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {habilidadesDaDisciplina.map((h) => {
                    const checked = (draft.conteudo?.habilidades || []).includes(h.codigo);
                    return (
                      <label key={h.codigo} className={cn(
                        "flex items-start gap-2 p-2 rounded-lg border cursor-pointer transition-colors",
                        checked ? "border-edu-purple bg-edu-purple-light/30" : "border-border hover:bg-muted/40"
                      )}>
                        <Checkbox checked={checked} onCheckedChange={() => toggleHabilidade(h.codigo)} />
                        <div className="flex-1">
                          <p className="text-xs font-semibold">{h.codigo}</p>
                          <p className="text-xs text-muted-foreground">{h.descricao}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">DESDP / Metodologia</Label>
              <Textarea
                value={draft.conteudo?.metodologia || ""}
                onChange={(e) => update("conteudo", { ...(draft.conteudo || { objetivo: "", habilidades: [] }), metodologia: e.target.value })}
                placeholder="Estratégias, recursos e abordagem metodológica..."
                rows={3}
              />
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setTab("menu")}>Cancelar</Button>
              <Button onClick={() => { handleSave(true); setTab("menu"); }} className="gap-1">
                <Save className="w-4 h-4" /> Salvar conteúdo
              </Button>
            </DialogFooter>
          </div>
        )}

        {tab === "frequencia" && (
          <div className="space-y-3 pt-3">
            <div className="flex flex-wrap items-center gap-2">
              <Button size="sm" variant="outline" className="gap-1" onClick={() => setAllFreq("P")}>
                Presença coletiva
              </Button>
              <Button size="sm" variant="outline" className="gap-1" onClick={() => setAllFreq("F")}>
                Falta coletiva
              </Button>
              <span className="text-xs text-muted-foreground ml-auto">
                P = Presente • F = Falta • FJ = Falta justificada
              </span>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <div className="max-h-64 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/40 sticky top-0">
                    <tr>
                      <th className="text-left p-2 text-xs font-semibold">Aluno</th>
                      <th className="p-2 text-xs font-semibold w-16 text-center">P</th>
                      <th className="p-2 text-xs font-semibold w-16 text-center">F</th>
                      <th className="p-2 text-xs font-semibold w-16 text-center">FJ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ALUNOS_TURMA.map((aluno) => {
                      const v = draft.frequencia?.registros?.[aluno];
                      return (
                        <tr key={aluno} className="border-t border-border">
                          <td className="p-2 text-xs">{aluno}</td>
                          {(["P", "F", "FJ"] as const).map((opt) => (
                            <td key={opt} className="p-2 text-center">
                              <button
                                onClick={() => setFreq(aluno, opt)}
                                className={cn(
                                  "w-7 h-7 rounded-full text-[10px] font-bold border transition-colors",
                                  v === opt
                                    ? opt === "P" ? "bg-edu-green text-white border-edu-green"
                                    : opt === "F" ? "bg-edu-coral text-white border-edu-coral"
                                    : "bg-edu-orange text-white border-edu-orange"
                                    : "border-border hover:bg-muted"
                                )}
                              >
                                {opt}
                              </button>
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Observação geral da chamada</Label>
              <Textarea
                value={draft.frequencia?.observacao || ""}
                onChange={(e) => update("frequencia", { registros: draft.frequencia?.registros || {}, observacao: e.target.value })}
                placeholder="Anotações gerais sobre a frequência..."
              />
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setTab("menu")}>Cancelar</Button>
              <Button onClick={() => { handleSave(true); setTab("menu"); }} className="gap-1">
                <Save className="w-4 h-4" /> Salvar frequência
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
