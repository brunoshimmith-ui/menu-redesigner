import { useNavigate } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Users, GraduationCap, UserCog, School, Globe, PlayCircle, ArrowUpDown,
  LayoutDashboard, BarChart3, Settings, ChevronRight, Lightbulb, Headphones,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CalendarioEscolar } from "@/components/CalendarioEscolar";
import { AvisosImportantes } from "@/components/AvisosImportantes";
import { DicaDoDia } from "@/components/DicaDoDia";
import { ComparativoAnual } from "@/components/dashboards/ComparativoAnual";

const stats = [
  { label: "Unidades", value: "8", icon: School, variant: "blue" },
  { label: "Turmas", value: "42", icon: GraduationCap, variant: "purple" },
  { label: "Alunos", value: "1.248", icon: Users, variant: "green" },
  { label: "Professores", value: "96", icon: UserCog, variant: "orange" },
];

const quickAccess = [
  { label: "Todas as Turmas", desc: "Gerencie todas as turmas.", icon: GraduationCap, variant: "purple", path: "/turmas" },
  { label: "Educação Especial", desc: "Acompanhe estudantes.", icon: Lightbulb, variant: "coral", path: "/educacao-especial" },
  { label: "Usuários", desc: "Permissões e acessos.", icon: UserCog, variant: "blue", path: "/usuarios" },
  { label: "Página Pública", desc: "Vitrine da rede.", icon: Globe, variant: "orange", path: "/pagina-publica" },
  { label: "Stepmeet", desc: "Reuniões online.", icon: PlayCircle, variant: "coral", path: "/stepmeet" },
  { label: "Transferências", desc: "Acompanhe solicitações.", icon: ArrowUpDown, variant: "blue", path: "/transferencias" },
  { label: "Dashboard", desc: "Indicadores.", icon: LayoutDashboard, variant: "purple", path: "/menu" },
  { label: "Relatórios", desc: "Boletins e exportações.", icon: BarChart3, variant: "green", path: "/relatorios" },
  { label: "Configurações", desc: "Preferências.", icon: Settings, variant: "gray", path: "/configuracoes" },
];

const variantStyles: Record<string, string> = {
  green: "text-edu-green bg-edu-green-light",
  coral: "text-edu-coral bg-edu-coral-light",
  purple: "text-edu-purple bg-edu-purple-light",
  blue: "text-edu-blue bg-edu-blue-light",
  orange: "text-edu-orange bg-edu-orange-light",
  gray: "text-edu-gray bg-edu-gray-light",
};

export function SuporteDashboard({ name }: { name: string }) {
  const navigate = useNavigate();
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground flex items-center gap-2">
          Olá, {name.split(" ")[0]}! <Headphones className="w-7 h-7 text-edu-purple" />
        </h1>
        <p className="text-base text-muted-foreground mt-2">
          Painel de Suporte — acompanhe escolas, turmas e indicadores em tempo real.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {stats.map((s) => (
              <div key={s.label} className="bg-card rounded-3xl border border-border p-6 shadow-sm">
                <p className="text-sm text-muted-foreground mb-3">{s.label}</p>
                <p className="text-4xl font-bold text-foreground">{s.value}</p>
              </div>
            ))}
          </div>


          {/* Quick access */}
          <div className="bg-card rounded-3xl border border-border p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-foreground mb-6">Acesso rápido</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickAccess.map((q) => (
                <Tooltip key={q.label}>
                  <TooltipTrigger asChild>
                    <button onClick={() => navigate(q.path)} className="group text-left bg-card rounded-2xl border border-border p-5 hover:shadow-md hover:-translate-y-0.5 transition-all flex items-start gap-3">
                      <div className={cn("flex items-center justify-center w-11 h-11 rounded-xl flex-shrink-0", variantStyles[q.variant])}>
                        <q.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-bold text-foreground">{q.label}</p>
                        <p className="text-xs text-muted-foreground mt-1">{q.desc}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground mt-1" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>{q.desc}</TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>

          <DicaDoDia role="suporte" />
        </div>

        <div className="space-y-6">
          <AvisosImportantes />
          <div className="bg-card rounded-3xl border border-border p-6 shadow-sm">
            <h3 className="text-xl font-bold text-foreground mb-3">Calendário escolar</h3>
            <CalendarioEscolar />
          </div>
        </div>
      </div>
    </div>
  );
}
