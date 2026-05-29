import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  GraduationCap, BarChart3, FileText, Globe, PlayCircle, ChevronRight, CalendarPlus,
  Users, ClipboardCheck, BookOpen, AlertTriangle, TrendingUp, Clock, CheckCircle2, PenLine,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CalendarioEscolar } from "@/components/CalendarioEscolar";
import { AvisosImportantes } from "@/components/AvisosImportantes";
import { DicaDoDia } from "@/components/DicaDoDia";
import { ComparativoAnual } from "@/components/dashboards/ComparativoAnual";
import { AnotacoesProfessor } from "@/components/AnotacoesProfessor";
import { saveAvaliacao, avaliacoesByProf, Avaliacao } from "@/lib/store";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const tools = [
  { label: "Minhas Turmas", icon: GraduationCap, path: "/turmas", variant: "purple" },
  { label: "Relatórios", icon: BarChart3, path: "/relatorios", variant: "green" },
  { label: "Documentos", icon: FileText, path: "/documentos", variant: "blue" },
  { label: "Página Pública", icon: Globe, path: "/pagina-publica", variant: "orange" },
  { label: "Stepmeet", icon: PlayCircle, path: "/stepmeet", variant: "coral" },
];

const variantStyles: Record<string, string> = {
  green: "text-edu-green bg-edu-green-light",
  coral: "text-edu-coral bg-edu-coral-light",
  purple: "text-edu-purple bg-edu-purple-light",
  blue: "text-edu-blue bg-edu-blue-light",
  orange: "text-edu-orange bg-edu-orange-light",
};

const minhasTurmas = ["6º A", "7º A", "7º B", "8º C"];
const disciplinas = ["Matemática", "Português", "Ciências", "História", "Geografia"];

export function ProfessorDashboard({ name }: { name: string }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const today = new Date();
  const dateLong = today.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" });

  const [open, setOpen] = useState(false);
  const [aTitle, setATitle] = useState("");
  const [aDate, setADate] = useState("");
  const [aTurma, setATurma] = useState("");
  const [aDisc, setADisc] = useState("");
  const [minhas, setMinhas] = useState<Avaliacao[]>([]);

  useEffect(() => {
    setMinhas(avaliacoesByProf(name));
  }, [name]);

  const handleSave = () => {
    if (!aTitle || !aDate || !aTurma || !aDisc) return toast.error("Preencha todos os campos.");
    const av: Avaliacao = {
      id: crypto.randomUUID(), title: aTitle, date: aDate, turma: aTurma, disciplina: aDisc, createdBy: name,
    };
    saveAvaliacao(av);
    toast.success(`Avaliação criada! Alunos da ${aTurma} foram notificados.`);
    setATitle(""); setADate(""); setATurma(""); setADisc("");
    setOpen(false);
    setMinhas(avaliacoesByProf(name));
  };

  // ===== KPIs simulados =====
  const totalTurmas = minhasTurmas.length;
  const totalAlunos = 112;
  const proximasAvaliacoes = minhas.filter((a) => new Date(a.date) >= new Date(today.toDateString())).length;
  const frequenciaMedia = 94;
  const conteudosPendentes = 3;
  const notasPendentes = 7;
  const aulasHoje = 4;

  const kpis = [
    { label: "Minhas turmas", value: totalTurmas, sub: "ativas no bimestre", icon: GraduationCap, color: "edu-purple", bg: "edu-purple-light" },
    { label: "Alunos ao todo", value: totalAlunos, sub: "matriculados", icon: Users, color: "edu-blue", bg: "edu-blue-light" },
    { label: "Aulas hoje", value: aulasHoje, sub: "na sua agenda", icon: Clock, color: "edu-green", bg: "edu-green-light" },
    { label: "Frequência média", value: `${frequenciaMedia}%`, sub: "últimos 30 dias", icon: TrendingUp, color: "edu-orange", bg: "edu-orange-light" },
  ];

  const pendencias = [
    { label: "Conteúdos por lançar", value: conteudosPendentes, icon: BookOpen, color: "edu-purple", path: "/turmas" },
    { label: "Frequências a registrar", value: 2, icon: ClipboardCheck, color: "edu-blue", path: "/turmas" },
    { label: "Notas a lançar", value: notasPendentes, icon: PenLine, color: "edu-coral", path: "/turmas" },
    { label: "Avaliações marcadas", value: proximasAvaliacoes, icon: AlertTriangle, color: "edu-orange", path: "/turmas" },
  ];

  // Resumo por turma simulado
  const resumoTurmas = [
    { turma: "6º A", alunos: 28, frequencia: 96, pendentes: 1, proximaAval: "Matemática • 22/05" },
    { turma: "7º A", alunos: 30, frequencia: 92, pendentes: 2, proximaAval: "Português • 25/05" },
    { turma: "7º B", alunos: 27, frequencia: 95, pendentes: 0, proximaAval: "—" },
    { turma: "8º C", alunos: 27, frequencia: 93, pendentes: 3, proximaAval: "Ciências • 28/05" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header com data */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Bem-vindo(a), Prof. {name.split(" ")[0]}! 👋
          </h1>
          <p className="text-base text-muted-foreground mt-2">Seu painel pedagógico do dia.</p>
        </div>
        <Badge variant="secondary" className="text-sm py-2 px-4 capitalize">{dateLong}</Badge>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div key={k.label} className="bg-card rounded-2xl border border-border p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center", `bg-${k.bg}`)}>
                <k.icon className={cn("w-5 h-5", `text-${k.color}`)} />
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">{k.value}</p>
            <p className="text-sm font-semibold text-foreground mt-1">{k.label}</p>
            <p className="text-xs text-muted-foreground">{k.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Pendências */}
          <div className="bg-card rounded-3xl border border-border p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-edu-purple" /> Suas pendências
              </h2>
              <Badge variant="secondary" className="text-xs">Atualizado agora</Badge>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {pendencias.map((p) => (
                <button
                  key={p.label}
                  onClick={() => navigate(p.path)}
                  className="rounded-2xl border border-border p-4 text-left hover:shadow-md hover:-translate-y-0.5 transition-all"
                >
                  <p.icon className={cn("w-5 h-5 mb-2", `text-${p.color}`)} />
                  <p className="text-2xl font-bold">{p.value}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-snug">{p.label}</p>
                </button>
              ))}
            </div>
          </div>

          <ComparativoAnual role="professor" />




          {/* Resumo por turma */}
          <div className="bg-card rounded-3xl border border-border p-6 shadow-sm">
            <h2 className="text-xl font-bold text-foreground mb-4">Resumo por turma</h2>
            <div className="space-y-2">
              {resumoTurmas.map((t) => (
                <button
                  key={t.turma}
                  onClick={() => navigate("/turmas")}
                  className="w-full grid grid-cols-12 items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted/40 transition-colors text-left"
                >
                  <Badge className="col-span-2 bg-edu-purple text-white border-0 justify-center">{t.turma}</Badge>
                  <div className="col-span-2 text-xs">
                    <p className="font-semibold">{t.alunos}</p>
                    <p className="text-muted-foreground">alunos</p>
                  </div>
                  <div className="col-span-2 text-xs">
                    <p className="font-semibold text-edu-green">{t.frequencia}%</p>
                    <p className="text-muted-foreground">freq.</p>
                  </div>
                  <div className="col-span-2 text-xs">
                    <p className={cn("font-semibold", t.pendentes > 0 ? "text-edu-coral" : "text-muted-foreground")}>
                      {t.pendentes}
                    </p>
                    <p className="text-muted-foreground">pendências</p>
                  </div>
                  <div className="col-span-3 text-xs">
                    <p className="font-semibold truncate">{t.proximaAval}</p>
                    <p className="text-muted-foreground">próxima avaliação</p>
                  </div>
                  <ChevronRight className="col-span-1 w-4 h-4 text-muted-foreground justify-self-end" />
                </button>
              ))}
            </div>
          </div>

          {/* Ferramentas */}
          <div className="bg-card rounded-3xl border border-border p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-foreground mb-5">Acesso rápido</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {tools.map((t) => (
                <button key={t.label} onClick={() => navigate(t.path)} className="group bg-card rounded-2xl border border-border p-5 hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-3">
                  <div className={cn("flex items-center justify-center w-11 h-11 rounded-xl", variantStyles[t.variant])}>
                    <t.icon className="w-5 h-5" />
                  </div>
                  <span className="font-semibold flex-1 text-left">{t.label}</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>


          {/* Minhas avaliações */}
          <div className="bg-card rounded-3xl border border-border p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-foreground">Minhas avaliações</h3>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-1"><CalendarPlus className="w-4 h-4" /> Nova avaliação</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Criar avaliação</DialogTitle></DialogHeader>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-muted-foreground">Título</label>
                      <Input value={aTitle} onChange={(e) => setATitle(e.target.value)} placeholder="Ex: Prova bimestral" />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Data</label>
                      <Input type="date" value={aDate} onChange={(e) => setADate(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Turma</label>
                      <Select value={aTurma} onValueChange={setATurma}>
                        <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                        <SelectContent>
                          {minhasTurmas.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Disciplina</label>
                      <Select value={aDisc} onValueChange={setADisc}>
                        <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                        <SelectContent>
                          {disciplinas.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button onClick={handleSave}>Criar e notificar alunos</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            {minhas.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">Nenhuma avaliação criada ainda.</p>
            ) : (
              <div className="space-y-2">
                {minhas.slice(0, 5).map((a) => (
                  <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl border border-border">
                    <Badge className="bg-edu-purple text-white border-0">{new Date(a.date + "T00:00").toLocaleDateString("pt-BR")}</Badge>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{a.title}</p>
                      <p className="text-xs text-muted-foreground">{a.disciplina} • {a.turma}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <AnotacoesProfessor />
          <DicaDoDia role="professor" />
        </div>

        <div className="space-y-6">
          <AvisosImportantes />
          <div className="bg-card rounded-3xl border border-border p-6 shadow-sm">
            <h3 className="text-xl font-bold text-foreground mb-3">Calendário escolar</h3>
            <CalendarioEscolar filterCreatedBy={name} />
          </div>
        </div>
      </div>
    </div>
  );
}
