import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, Printer, FileText, Upload, Folder, FileDown, User } from "lucide-react";
import { ALUNOS_TURMA } from "@/lib/bncc";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import type { AulaSalva } from "@/components/AulaActionsDialog";

const BIMESTRES = ["1º Bimestre", "2º Bimestre", "3º Bimestre", "4º Bimestre"];
const AVALIACOES = ["AV1", "RP1", "AV2", "RP2", "AV3", "RP3", "AV4", "RP4"];
const ALL = "__all__";

const seededNota = (aluno: string, disc: string, bim: number, av: string) => {
  const seed = (aluno + disc + bim + av).split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return ((seed % 60) / 10 + 4).toFixed(1);
};

const disciplinasDe = (aulas: AulaSalva[]) =>
  Array.from(new Set(aulas.map((a) => a.disciplina))).sort();

/* ============ COMPONENTES CURRICULARES ============ */
export function ComponentesCurricularesPanel({ aulas }: { aulas: AulaSalva[] }) {
  const disciplinas = disciplinasDe(aulas);
  const COORDENADOR = "Profa. Mariana Coordenadora";

  const porDisciplina = disciplinas.map((d) => ({
    disciplina: d,
    professores: Array.from(new Set(aulas.filter((a) => a.disciplina === d).map((a) => a.professor))),
  }));

  if (disciplinas.length === 0) {
    return <EmptyState text="Cadastre aulas no diário para visualizar os componentes curriculares." />;
  }

  return (
    <div className="space-y-4">
      <div className="border rounded-lg p-4 bg-muted/30">
        <p className="text-xs font-semibold text-muted-foreground">Coordenador(a) Pedagógico(a)</p>
        <p className="text-base font-bold">{COORDENADOR}</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {porDisciplina.map(({ disciplina, professores }) => (
          <div key={disciplina} className="border rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-edu-orange">{disciplina}</h3>
              <Badge variant="secondary">{professores.length} prof.</Badge>
            </div>
            <ul className="space-y-1">
              {professores.map((p) => (
                <li key={p} className="text-sm flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-muted-foreground" /> {p}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============ DRIVE ============ */
type Doc = { id: string; nome: string; disciplina: string; aluno?: string; tamanho: string };

export function DrivePanel({ aulas }: { aulas: AulaSalva[] }) {
  const disciplinas = disciplinasDe(aulas);
  const [tab, setTab] = useState<"disciplina" | "aluno">("disciplina");
  const [filtroDisc, setFiltroDisc] = useState<string>(ALL);
  const [docs, setDocs] = useState<Doc[]>([
    { id: "1", nome: "Plano de aula - Frações.pdf", disciplina: "Matemática", tamanho: "245 KB" },
    { id: "2", nome: "Lista de exercícios.docx", disciplina: "Matemática", tamanho: "120 KB" },
    { id: "3", nome: "Texto - Machado de Assis.pdf", disciplina: "Língua Portuguesa", tamanho: "380 KB" },
    { id: "4", nome: "Ficha do aluno - Ana.pdf", disciplina: "Língua Portuguesa", aluno: ALUNOS_TURMA[0], tamanho: "90 KB" },
  ]);

  const handleUpload = () => {
    const novo: Doc = {
      id: crypto.randomUUID(),
      nome: `Novo documento ${docs.length + 1}.pdf`,
      disciplina: disciplinas[0] || "Geral",
      tamanho: `${Math.floor(Math.random() * 500 + 50)} KB`,
    };
    setDocs((d) => [...d, novo]);
    toast({ title: "Documento enviado", description: novo.nome });
  };

  const filtered = docs.filter((d) => {
    if (filtroDisc !== ALL && d.disciplina !== filtroDisc) return false;
    if (tab === "aluno") return !!d.aluno;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 border rounded-md p-0.5">
          <Button variant={tab === "disciplina" ? "default" : "ghost"} size="sm" onClick={() => setTab("disciplina")}>
            Por disciplina
          </Button>
          <Button variant={tab === "aluno" ? "default" : "ghost"} size="sm" onClick={() => setTab("aluno")}>
            Por aluno
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Label className="text-xs">Disciplina:</Label>
          <Select value={filtroDisc} onValueChange={setFiltroDisc}>
            <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Todas</SelectItem>
              {disciplinas.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button size="sm" onClick={handleUpload} className="gap-1">
            <Upload className="w-4 h-4" /> Enviar documento
          </Button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState text="Nenhum documento neste filtro." />
      ) : (
        <div className="border rounded-lg divide-y">
          {filtered.map((d) => (
            <div key={d.id} className="flex items-center justify-between p-3 hover:bg-muted/30">
              <div className="flex items-center gap-3">
                <Folder className="w-5 h-5 text-edu-orange" />
                <div>
                  <p className="text-sm font-medium">{d.nome}</p>
                  <p className="text-xs text-muted-foreground">
                    {d.disciplina}{d.aluno ? ` • ${d.aluno}` : ""} • {d.tamanho}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <FileDown className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============ AVALIAÇÕES ============ */
export function AvaliacoesPanel({ aulas }: { aulas: AulaSalva[] }) {
  const disciplinas = disciplinasDe(aulas);
  const [disciplina, setDisciplina] = useState<string>(disciplinas[0] || "");
  const [bim, setBim] = useState(0);
  const [notas, setNotas] = useState<Record<string, string>>({});

  if (disciplinas.length === 0) {
    return <EmptyState text="Cadastre aulas no diário para registrar avaliações." />;
  }

  const key = (aluno: string, av: string) => `${disciplina}|${bim}|${aluno}|${av}`;
  const getNota = (aluno: string, av: string) => notas[key(aluno, av)] ?? seededNota(aluno, disciplina, bim, av);

  const setNota = (aluno: string, av: string, v: string) => {
    setNotas((p) => ({ ...p, [key(aluno, av)]: v }));
  };

  const calcMedia = (aluno: string) => {
    const vals = AVALIACOES.filter((a) => a.startsWith("AV")).map((av) => parseFloat(getNota(aluno, av)) || 0);
    return vals.reduce((a, b) => a + b, 0) / vals.length;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
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
        </div>
      </div>

      <div className="border rounded-lg overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-muted/50">
            <tr>
              <th className="p-2 text-left">Aluno</th>
              {AVALIACOES.map((a) => <th key={a} className="p-2 text-center w-16">{a}</th>)}
              <th className="p-2 text-center">Média</th>
              <th className="p-2 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {ALUNOS_TURMA.map((aluno) => {
              const media = calcMedia(aluno);
              const aprovado = media >= 6;
              return (
                <tr key={aluno} className="border-t">
                  <td className="p-2 font-medium">{aluno}</td>
                  {AVALIACOES.map((av) => (
                    <td key={av} className="p-1">
                      <Input
                        className="h-8 text-center text-xs"
                        value={getNota(aluno, av)}
                        onChange={(e) => setNota(aluno, av, e.target.value)}
                      />
                    </td>
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

/* ============ EMISSÃO DE DOCUMENTOS ============ */
export function EmissaoDocumentosPanel() {
  const [open, setOpen] = useState(false);
  const [aluno, setAluno] = useState<string>("");
  const [tipo, setTipo] = useState<"FICHA_INDIVIDUAL" | "BOLETIM" | "FICHA_DESCRITIVA">("BOLETIM");

  const emitir = (a: string, t: typeof tipo) => {
    setAluno(a);
    setTipo(t);
    setOpen(true);
  };

  const tipoLabel = {
    FICHA_INDIVIDUAL: "Ficha Individual",
    BOLETIM: "Boletim Escolar",
    FICHA_DESCRITIVA: "Ficha Descritiva",
  }[tipo];

  return (
    <div className="space-y-4">
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="p-2 text-left w-12">#</th>
              <th className="p-2 text-left">Aluno</th>
              <th className="p-2 text-center">Documentos</th>
            </tr>
          </thead>
          <tbody>
            {ALUNOS_TURMA.map((a, i) => (
              <tr key={a} className="border-t">
                <td className="p-2">{i + 1}</td>
                <td className="p-2 font-medium">{a}</td>
                <td className="p-2">
                  <div className="flex justify-center gap-2 flex-wrap">
                    <Button size="sm" variant="outline" className="gap-1" onClick={() => emitir(a, "FICHA_INDIVIDUAL")}>
                      <FileText className="w-3.5 h-3.5" /> Ficha Individual
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1" onClick={() => emitir(a, "BOLETIM")}>
                      <FileText className="w-3.5 h-3.5" /> Boletim Escolar
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1" onClick={() => emitir(a, "FICHA_DESCRITIVA")}>
                      <FileText className="w-3.5 h-3.5" /> Ficha Descritiva
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{tipoLabel} — {aluno}</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-muted-foreground space-y-2 py-2">
            <p>Documento pronto para emissão.</p>
            <p>Aluno: <b className="text-foreground">{aluno}</b></p>
            <p>Tipo: <b className="text-foreground">{tipoLabel}</b></p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={() => { window.print(); setOpen(false); }} className="gap-1">
              <Printer className="w-4 h-4" /> Imprimir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return <div className="text-center py-12 text-sm text-muted-foreground border rounded-lg">{text}</div>;
}
