import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, Printer, Eye, FileText } from "lucide-react";
import { ALUNOS_TURMA } from "@/lib/bncc";
import { cn } from "@/lib/utils";
import type { AulaSalva } from "@/components/AulaActionsDialog";

const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const BIMESTRES = ["1º Bimestre", "2º Bimestre", "3º Bimestre", "4º Bimestre"];
const AVALIACOES = ["AV1", "RP1", "AV2", "RP2", "AV3", "RP3", "AV4", "RP4"];

// Helper: gera notas mock determinísticas por aluno/disciplina/bimestre
const seededNota = (aluno: string, disc: string, bim: number, av: string) => {
  const seed = (aluno + disc + bim + av).split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return ((seed % 60) / 10 + 4).toFixed(1); // 4.0 — 10.0
};

const disciplinasDe = (aulas: AulaSalva[]) =>
  Array.from(new Set(aulas.map((a) => a.disciplina))).sort();

const ALL = "__all__";

/* ============ MÉDIAS ============ */
export function MediasPanel({ aulas }: { aulas: AulaSalva[] }) {
  const disciplinas = disciplinasDe(aulas);
  const [disciplina, setDisciplina] = useState<string>(disciplinas[0] || "");
  const [bim, setBim] = useState(0);
  const [printOpen, setPrintOpen] = useState(false);
  const [filtroPeriodo, setFiltroPeriodo] = useState<"PERIODO" | "COMPLETO">("PERIODO");
  const [filtroDisc, setFiltroDisc] = useState<string>(ALL);

  if (disciplinas.length === 0) {
    return <EmptyState text="Crie aulas no diário para visualizar as médias." />;
  }

  const calcMedia = (aluno: string) => {
    const notas = AVALIACOES.filter((a) => a.startsWith("AV")).map((av) =>
      parseFloat(seededNota(aluno, disciplina, bim, av)),
    );
    return (notas.reduce((a, b) => a + b, 0) / notas.length).toFixed(1);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div className="flex items-center gap-2">
          <Label className="text-xs">Disciplina:</Label>
          <Select value={disciplina} onValueChange={setDisciplina}>
            <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
            <SelectContent>
              {disciplinas.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setBim((b) => Math.max(0, b - 1))} disabled={bim === 0}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm font-semibold w-28 text-center">{BIMESTRES[bim]}</span>
          <Button variant="outline" size="icon" onClick={() => setBim((b) => Math.min(3, b + 1))} disabled={bim === 3}>
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Dialog open={printOpen} onOpenChange={setPrintOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1"><Eye className="w-4 h-4" /> Visualizar / Imprimir</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Emitir documento de médias</DialogTitle></DialogHeader>
              <div className="space-y-3 pt-2">
                <div className="space-y-1.5">
                  <Label className="text-xs">Período</Label>
                  <Select value={filtroPeriodo} onValueChange={(v: "PERIODO" | "COMPLETO") => setFiltroPeriodo(v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PERIODO">PERÍODO (bimestre atual)</SelectItem>
                      <SelectItem value="COMPLETO">COMPLETO (todos os bimestres)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Disciplina</Label>
                  <Select value={filtroDisc} onValueChange={setFiltroDisc}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ALL}>Todas as disciplinas</SelectItem>
                      {disciplinas.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setPrintOpen(false)}>Cancelar</Button>
                <Button onClick={() => { window.print(); setPrintOpen(false); }} className="gap-1">
                  <Printer className="w-4 h-4" /> Imprimir
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="border rounded-lg overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-muted/50">
            <tr>
              <th className="p-2 text-left">Ordem</th>
              <th className="p-2 text-left">Aluno</th>
              {AVALIACOES.map((a) => <th key={a} className="p-2 text-center w-12">{a}</th>)}
              <th className="p-2 text-center">Média</th>
              <th className="p-2 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {ALUNOS_TURMA.map((aluno, i) => {
              const media = parseFloat(calcMedia(aluno));
              const aprovado = media >= 6;
              return (
                <tr key={aluno} className="border-t">
                  <td className="p-2">{i + 1}</td>
                  <td className="p-2 font-medium">{aluno}</td>
                  {AVALIACOES.map((av) => (
                    <td key={av} className="p-2 text-center">{seededNota(aluno, disciplina, bim, av)}</td>
                  ))}
                  <td className="p-2 text-center font-bold">{media.toFixed(1)}</td>
                  <td className="p-2 text-center">
                    <Badge className={cn("border-0 text-white", aprovado ? "bg-edu-green" : "bg-edu-coral")}>
                      {aprovado ? "APROVADO" : "REPROVADO"}
                    </Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ============ CONTEÚDOS ============ */
export function ConteudosPanel({ aulas }: { aulas: AulaSalva[] }) {
  const disciplinas = disciplinasDe(aulas);
  const [disciplina, setDisciplina] = useState<string>(ALL);
  const [printOpen, setPrintOpen] = useState(false);

  const filtradas = aulas
    .filter((a) => (disciplina === ALL ? true : a.disciplina === disciplina))
    .filter((a) => a.conteudo?.objetivo || a.conteudo?.metodologia)
    .sort((a, b) => a.diaSemana - b.diaSemana || a.horaInicio.localeCompare(b.horaInicio));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Label className="text-xs">Disciplina:</Label>
          <Select value={disciplina} onValueChange={setDisciplina}>
            <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Todas</SelectItem>
              {disciplinas.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <Dialog open={printOpen} onOpenChange={setPrintOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1"><Eye className="w-4 h-4" /> Visualizar / Imprimir</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Emitir relatório de conteúdos</DialogTitle></DialogHeader>
            <p className="text-sm text-muted-foreground">Será impressa a relação de conteúdos da disciplina <b>{disciplina === ALL ? "Todas" : disciplina}</b>.</p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setPrintOpen(false)}>Cancelar</Button>
              <Button onClick={() => { window.print(); setPrintOpen(false); }} className="gap-1">
                <Printer className="w-4 h-4" /> Imprimir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {filtradas.length === 0 ? (
        <EmptyState text="Nenhuma aula com conteúdo preenchido." />
      ) : (
        <div className="space-y-3">
          {filtradas.map((a) => (
            <div key={a.id} className="border rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-edu-orange">{a.disciplina}</span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <FileText className="w-3 h-3" /> {DIAS_SEMANA[a.diaSemana]} • {a.horaInicio} – {a.horaTermino}
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground">Objetivo de conhecimento</p>
                <p className="text-sm">{a.conteudo?.objetivo || "—"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground">Habilidades / Competências BNCC</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {(a.conteudo?.habilidades || []).length === 0 ? (
                    <span className="text-xs">—</span>
                  ) : (
                    a.conteudo!.habilidades.map((h) => <Badge key={h} variant="secondary" className="text-[10px]">{h}</Badge>)
                  )}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground">DESDP / Metodologia</p>
                <p className="text-sm">{a.conteudo?.metodologia || "—"}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============ FREQUÊNCIA ============ */
export function FrequenciaPanel({ aulas }: { aulas: AulaSalva[] }) {
  const disciplinas = disciplinasDe(aulas);
  const [disciplina, setDisciplina] = useState<string>(ALL);
  const dias = Array.from({ length: 30 }, (_, i) => i + 1);

  // mock: status por aluno x dia (determinístico)
  const status = (aluno: string, dia: number) => {
    const s = (aluno.charCodeAt(0) + dia + disciplina.length) % 10;
    if (s === 1) return "F";
    if (s === 2) return "FJ";
    return "P";
  };

  const stats = useMemo(() => {
    return ALUNOS_TURMA.map((aluno) => {
      let p = 0, f = 0, fj = 0;
      dias.forEach((d) => {
        const s = status(aluno, d);
        if (s === "P") p++; else if (s === "F") f++; else fj++;
      });
      const total = p + f + fj;
      return { aluno, p, f, fj, pct: ((p / total) * 100).toFixed(0) };
    });
  }, [disciplina]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Label className="text-xs">Disciplina:</Label>
        <Select value={disciplina} onValueChange={setDisciplina}>
          <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Todas as disciplinas</SelectItem>
            {disciplinas.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
          </SelectContent>
        </Select>
        <span className="text-xs text-muted-foreground ml-auto">P=Presente • F=Falta • FJ=Falta justificada</span>
      </div>

      <div className="border rounded-lg overflow-x-auto">
        <table className="w-full text-[11px]">
          <thead className="bg-muted/50 sticky top-0">
            <tr>
              <th className="p-1.5 text-left w-12">Ordem</th>
              <th className="p-1.5 text-left min-w-[180px]">Aluno</th>
              {dias.map((d) => <th key={d} className="p-1 text-center w-7">{d}</th>)}
              <th className="p-1.5 text-center bg-muted">Mês</th>
              <th className="p-1.5 text-center bg-muted">Período</th>
              <th className="p-1.5 text-center bg-muted">Acumulado</th>
              <th className="p-1.5 text-center bg-muted">% Presença</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((row, i) => (
              <tr key={row.aluno} className="border-t">
                <td className="p-1.5">{i + 1}</td>
                <td className="p-1.5 font-medium">{row.aluno}</td>
                {dias.map((d) => {
                  const s = status(row.aluno, d);
                  return (
                    <td key={d} className={cn(
                      "p-0.5 text-center font-bold",
                      s === "P" ? "text-edu-green" : s === "F" ? "text-edu-coral" : "text-edu-orange",
                    )}>{s}</td>
                  );
                })}
                <td className="p-1.5 text-center bg-muted/30">{row.f + row.fj}</td>
                <td className="p-1.5 text-center bg-muted/30">{row.f + row.fj}</td>
                <td className="p-1.5 text-center bg-muted/30">{row.f + row.fj}</td>
                <td className={cn("p-1.5 text-center font-bold bg-muted/30",
                  parseInt(row.pct) >= 75 ? "text-edu-green" : "text-edu-coral")}>{row.pct}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ============ COMPLEMENTARES ============ */
export function ComplementaresPanel({ aulas }: { aulas: AulaSalva[] }) {
  const observacoes = aulas
    .filter((a) => a.frequencia?.observacao || a.observacao)
    .map((a) => ({ aula: a, texto: a.frequencia?.observacao || a.observacao || "" }));

  return (
    <div className="space-y-3">
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="p-2 text-left w-12">Ordem</th>
              <th className="p-2 text-left">Aluno</th>
              <th className="p-2 text-left">Observações dos professores</th>
            </tr>
          </thead>
          <tbody>
            {ALUNOS_TURMA.map((aluno, i) => {
              const obs = observacoes.length > 0 && i < observacoes.length
                ? observacoes[i % observacoes.length].texto
                : "Sem observações registradas.";
              return (
                <tr key={aluno} className="border-t align-top">
                  <td className="p-2">{i + 1}</td>
                  <td className="p-2 font-medium">{aluno}</td>
                  <td className="p-2 text-muted-foreground">{obs}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ============ HORÁRIO ============ */
export function HorarioPanel({ aulas }: { aulas: AulaSalva[] }) {
  const horarios = Array.from(
    new Set(aulas.map((a) => `${a.horaInicio}-${a.horaTermino}`)),
  ).sort();

  if (aulas.length === 0) return <EmptyState text="Nenhuma aula cadastrada ainda." />;

  return (
    <div className="border rounded-lg overflow-x-auto">
      <table className="w-full text-xs">
        <thead className="bg-muted/50">
          <tr>
            <th className="p-2 text-left w-28">Horário</th>
            {[1, 2, 3, 4, 5].map((d) => (
              <th key={d} className="p-2 text-center">{DIAS_SEMANA[d]}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {horarios.map((h) => {
            const [ini, fim] = h.split("-");
            return (
              <tr key={h} className="border-t">
                <td className="p-2 font-medium">{ini} – {fim}</td>
                {[1, 2, 3, 4, 5].map((d) => {
                  const aula = aulas.find(
                    (a) => a.diaSemana === d && a.horaInicio === ini && a.horaTermino === fim,
                  );
                  return (
                    <td key={d} className="p-2 text-center">
                      {aula ? (
                        <div className="rounded-md p-1.5 bg-edu-orange/10 border border-edu-orange/30">
                          <div className="text-edu-orange font-semibold">{aula.disciplina}</div>
                          <div className="text-[10px] text-muted-foreground">{aula.professor}</div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground/40">—</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ============ helpers ============ */
function EmptyState({ text }: { text: string }) {
  return <div className="text-center py-12 text-sm text-muted-foreground border rounded-lg">{text}</div>;
}
