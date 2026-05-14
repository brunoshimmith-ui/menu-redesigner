import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { HeaderWithNotifications } from "@/components/HeaderWithNotifications";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Users,
  GraduationCap,
  UserCog,
  School,
  Globe,
  PlayCircle,
  ArrowUpDown,
  LayoutDashboard,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  CalendarPlus,
  Lightbulb,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const stats = [
  { label: "Turmas Ativas", value: "42", delta: "+6 este mês", icon: GraduationCap, variant: "purple", tip: "Total de turmas ativas no período letivo atual." },
  { label: "Alunos", value: "1.248", delta: "+38 este mês", icon: Users, variant: "green", tip: "Alunos matriculados em todas as turmas." },
  { label: "Professores", value: "96", delta: "+4 este mês", icon: UserCog, variant: "orange", tip: "Professores ativos cadastrados na rede." },
  { label: "Unidades", value: "8", delta: "Ativas", icon: School, variant: "blue", tip: "Unidades escolares vinculadas." },
] as const;

const quickAccess = [
  { label: "Todas as Turmas", desc: "Gerencie e visualize todas as turmas.", icon: GraduationCap, variant: "purple", path: "/turmas", tip: "Veja a lista de turmas, edições, turnos e coordenadores." },
  { label: "Educação Especial", desc: "Acompanhe os estudantes e recursos.", icon: Lightbulb, variant: "coral", path: "/usuarios", tip: "Acompanhamento individual de estudantes da educação especial." },
  { label: "Usuários", desc: "Gerencie usuários, permissões e acessos.", icon: UserCog, variant: "blue", path: "/usuarios", tip: "Buscar alunos, ver trajetória, notas e documentos." },
  { label: "Página Pública", desc: "Acesse as informações públicas da escola.", icon: Globe, variant: "orange", path: "/pagina-publica", tip: "Vitrine pública: informações abertas à comunidade." },
  { label: "Stepmeet", desc: "Realize ou participe de reuniões online.", icon: PlayCircle, variant: "coral", path: "/stepmeet", tip: "Salas de reunião online com a equipe escolar." },
  { label: "Transferências", desc: "Realize e acompanhe solicitações.", icon: ArrowUpDown, variant: "blue", path: "/transferencias", tip: "Solicite, aprove e acompanhe transferências de alunos." },
  { label: "Dashboard", desc: "Visualize indicadores e acompanhe os dados.", icon: LayoutDashboard, variant: "purple", path: "/menu", tip: "Indicadores gerais e acompanhamento em tempo real." },
  { label: "Relatórios", desc: "Gere relatórios e exporte dados.", icon: BarChart3, variant: "green", path: "/relatorios", tip: "Boletins, frequências e exportações em PDF/Excel." },
  { label: "Configurações", desc: "Configure preferências do sistema.", icon: Settings, variant: "gray", path: "/configuracoes", tip: "Preferências, integrações e ajustes do sistema." },
] as const;

const variantStyles: Record<string, string> = {
  green: "text-edu-green bg-edu-green-light",
  coral: "text-edu-coral bg-edu-coral-light",
  purple: "text-edu-purple bg-edu-purple-light",
  blue: "text-edu-blue bg-edu-blue-light",
  orange: "text-edu-orange bg-edu-orange-light",
  gray: "text-edu-gray bg-edu-gray-light",
};

interface Aviso {
  title: string;
  description: string;
  cta: string;
  color: string;
}

const initialAvisos: Aviso[] = [
  { title: "Reunião Pedagógica", description: "A reunião acontecerá no dia 24/05 às 14h.", cta: "Ver detalhes", color: "bg-edu-purple" },
  { title: "Atualização do Sistema", description: "Nova versão disponível a partir de 20/05.", cta: "Saiba mais", color: "bg-edu-blue" },
  { title: "Conselho de Classe", description: "Conselho do 1º bimestre marcado para 30/05 às 9h.", cta: "Ver pauta", color: "bg-edu-coral" },
  { title: "Prazo de Notas", description: "Lançamento de notas até 28/05.", cta: "Lançar agora", color: "bg-edu-orange" },
];

interface Meeting {
  date: string; // yyyy-mm-dd
  title: string;
  hour: string;
  notes?: string;
}

const Menu = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tip, setTip] = useState(true);

  // Slides
  const [slide, setSlide] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % initialAvisos.length), 5000);
    return () => clearInterval(t);
  }, []);

  // Calendar + meetings
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [meetings, setMeetings] = useState<Meeting[]>([
    { date: new Date().toISOString().slice(0, 10), title: "Reunião Pedagógica", hour: "14:00", notes: "Pauta: planejamento bimestral." },
  ]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newMeeting, setNewMeeting] = useState({ title: "", hour: "", notes: "" });

  const dateKey = (d?: Date) => (d ? d.toISOString().slice(0, 10) : "");
  const meetingsForDay = meetings.filter((m) => m.date === dateKey(selectedDate));
  const meetingDates = meetings.map((m) => new Date(m.date + "T00:00"));

  const handleCreateMeeting = () => {
    if (!selectedDate || !newMeeting.title || !newMeeting.hour) {
      toast.error("Preencha título, data e horário.");
      return;
    }
    setMeetings((prev) => [...prev, { date: dateKey(selectedDate), ...newMeeting }]);
    toast.success("Reunião marcada com sucesso!");
    setNewMeeting({ title: "", hour: "", notes: "" });
    setDialogOpen(false);
  };

  return (
    <SidebarProvider>
      <TooltipProvider delayDuration={200}>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar />

          <div className="flex-1 flex flex-col">
            <HeaderWithNotifications />

            <main className="flex-1 p-6 bg-pattern overflow-auto">
              <div className="max-w-7xl mx-auto space-y-6">
                {/* Greeting */}
                <div>
                  <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    Olá, {user?.name?.split(" ")[0] || "Bruno"}! <span>👋</span>
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Bem-vindo(a) de volta ao SEMEI Iranduba.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left: stats + quick + tip */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {stats.map((s) => (
                        <Tooltip key={s.label}>
                          <TooltipTrigger asChild>
                            <div className="bg-card rounded-xl border border-border p-4 hover:shadow-md transition-all hover:-translate-y-0.5 cursor-help">
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className="text-xs text-muted-foreground">{s.label}</p>
                                  <p className="text-2xl font-bold text-foreground mt-1">{s.value}</p>
                                  <p className="text-[10px] text-edu-green mt-1">{s.delta}</p>
                                </div>
                                <div className={cn("flex items-center justify-center w-10 h-10 rounded-lg", variantStyles[s.variant])}>
                                  <s.icon className="w-5 h-5" />
                                </div>
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>{s.tip}</TooltipContent>
                        </Tooltip>
                      ))}
                    </div>

                    {/* Quick access */}
                    <div>
                      <h2 className="text-sm font-semibold text-foreground mb-3">Acesso rápido</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {quickAccess.map((q) => (
                          <Tooltip key={q.label}>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => navigate(q.path)}
                                className="group text-left bg-card rounded-xl border border-border p-4 hover:shadow-md hover:-translate-y-0.5 hover:border-primary/40 transition-all flex items-center gap-3"
                              >
                                <div className={cn("flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0", variantStyles[q.variant])}>
                                  <q.icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-foreground truncate">{q.label}</p>
                                  <p className="text-xs text-muted-foreground line-clamp-1">{q.desc}</p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>{q.tip}</TooltipContent>
                          </Tooltip>
                        ))}
                      </div>
                    </div>

                    {/* Tip */}
                    {tip && (
                      <div className="bg-edu-purple-light border border-edu-purple/20 rounded-xl p-4 flex items-start gap-3 relative">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-edu-purple text-white flex-shrink-0">
                          <Lightbulb className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-foreground">Dica do dia</p>
                          <p className="text-xs text-muted-foreground">
                            Mantenha os dados da sua escola sempre atualizados para uma melhor gestão.
                          </p>
                        </div>
                        <button
                          onClick={() => setTip(false)}
                          className="text-muted-foreground hover:text-foreground"
                          aria-label="Fechar dica"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Right: avisos slides + calendar */}
                  <div className="space-y-6">
                    {/* Avisos slides */}
                    <div className="bg-card rounded-xl border border-border p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-foreground">Avisos importantes</h3>
                        <button className="text-xs text-primary hover:underline">Ver todos</button>
                      </div>

                      <div className="relative overflow-hidden rounded-lg">
                        <div
                          className="flex transition-transform duration-500 ease-in-out"
                          style={{ transform: `translateX(-${slide * 100}%)` }}
                        >
                          {initialAvisos.map((a, i) => (
                            <div key={i} className="min-w-full p-4 bg-muted/40 rounded-lg">
                              <div className="flex items-start gap-2">
                                <span className={cn("w-2 h-2 rounded-full mt-1.5 flex-shrink-0", a.color)} />
                                <div>
                                  <p className="text-sm font-semibold text-foreground">{a.title}</p>
                                  <p className="text-xs text-muted-foreground mt-1">{a.description}</p>
                                  <button className="text-xs text-primary hover:underline mt-2">{a.cta}</button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <button
                          onClick={() => setSlide((s) => (s - 1 + initialAvisos.length) % initialAvisos.length)}
                          className="p-1 rounded hover:bg-muted text-muted-foreground"
                          aria-label="Anterior"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <div className="flex gap-1.5">
                          {initialAvisos.map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setSlide(i)}
                              className={cn(
                                "h-1.5 rounded-full transition-all",
                                i === slide ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/30"
                              )}
                              aria-label={`Slide ${i + 1}`}
                            />
                          ))}
                        </div>
                        <button
                          onClick={() => setSlide((s) => (s + 1) % initialAvisos.length)}
                          className="p-1 rounded hover:bg-muted text-muted-foreground"
                          aria-label="Próximo"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Calendar */}
                    <div className="bg-card rounded-xl border border-border p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-semibold text-foreground">Calendário escolar</h3>
                        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" className="h-7 gap-1 text-xs">
                              <CalendarPlus className="w-3.5 h-3.5" />
                              Reunião
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Marcar reunião</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-3">
                              <div>
                                <label className="text-xs text-muted-foreground">Data selecionada</label>
                                <p className="text-sm font-medium">
                                  {selectedDate?.toLocaleDateString("pt-BR")}
                                </p>
                              </div>
                              <div>
                                <label className="text-xs text-muted-foreground">Título</label>
                                <Input
                                  value={newMeeting.title}
                                  onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                                  placeholder="Ex: Reunião Pedagógica"
                                />
                              </div>
                              <div>
                                <label className="text-xs text-muted-foreground">Horário</label>
                                <Input
                                  type="time"
                                  value={newMeeting.hour}
                                  onChange={(e) => setNewMeeting({ ...newMeeting, hour: e.target.value })}
                                />
                              </div>
                              <div>
                                <label className="text-xs text-muted-foreground">Pauta (opcional)</label>
                                <Textarea
                                  value={newMeeting.notes}
                                  onChange={(e) => setNewMeeting({ ...newMeeting, notes: e.target.value })}
                                  rows={3}
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
                              <Button onClick={handleCreateMeeting}>Salvar</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>

                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        modifiers={{ meeting: meetingDates }}
                        modifiersClassNames={{ meeting: "bg-edu-purple-light text-edu-purple font-bold" }}
                        className="rounded-md"
                      />

                      <div className="mt-3 space-y-2">
                        <p className="text-xs font-semibold text-foreground">
                          Reuniões em {selectedDate?.toLocaleDateString("pt-BR")}
                        </p>
                        {meetingsForDay.length === 0 ? (
                          <p className="text-xs text-muted-foreground">Nenhuma reunião marcada.</p>
                        ) : (
                          meetingsForDay.map((m, i) => (
                            <div key={i} className="flex items-start gap-2 p-2 rounded-md bg-muted/50">
                              <Badge className="bg-edu-purple text-white border-0 text-[10px]">{m.hour}</Badge>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-foreground">{m.title}</p>
                                {m.notes && <p className="text-[10px] text-muted-foreground line-clamp-2">{m.notes}</p>}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </TooltipProvider>
    </SidebarProvider>
  );
};

export default Menu;
