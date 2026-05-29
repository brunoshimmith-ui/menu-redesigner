import { useNavigate } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Users, GraduationCap, ArrowUpDown, BarChart3, LayoutDashboard, Globe, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CalendarioEscolar } from "@/components/CalendarioEscolar";
import { AvisosImportantes } from "@/components/AvisosImportantes";
import { DicaDoDia } from "@/components/DicaDoDia";
import { ComparativoAnual } from "@/components/dashboards/ComparativoAnual";
import { Role } from "@/contexts/AuthContext";

const variantStyles: Record<string, string> = {
  green: "text-edu-green bg-edu-green-light",
  coral: "text-edu-coral bg-edu-coral-light",
  purple: "text-edu-purple bg-edu-purple-light",
  blue: "text-edu-blue bg-edu-blue-light",
  orange: "text-edu-orange bg-edu-orange-light",
};

const tools = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/menu", variant: "purple", desc: "Indicadores gerais." },
  { label: "Turmas", icon: GraduationCap, path: "/turmas", variant: "purple", desc: "Gerencie turmas." },
  { label: "Usuários", icon: Users, path: "/usuarios", variant: "blue", desc: "Pessoas e papéis." },
  { label: "Transferências", icon: ArrowUpDown, path: "/transferencias", variant: "blue", desc: "Movimentações." },
  { label: "Relatórios", icon: BarChart3, path: "/relatorios", variant: "green", desc: "Boletins e exportações." },
  { label: "Página Pública", icon: Globe, path: "/pagina-publica", variant: "orange", desc: "Vitrine da rede." },
];

const titleByRole: Record<string, string> = {
  coordenacao: "Painel da Coordenação",
  direcao: "Painel da Direção",
  administracao: "Painel Administrativo",
};

const statsByRole: Record<string, { label: string; value: string }[]> = {
  coordenacao: [
    { label: "Turmas acompanhadas", value: "12" },
    { label: "Professores", value: "38" },
    { label: "Alunos", value: "412" },
    { label: "Pendências pedagógicas", value: "7" },
  ],
  direcao: [
    { label: "Unidade", value: "1" },
    { label: "Turmas", value: "16" },
    { label: "Alunos", value: "548" },
    { label: "Servidores", value: "62" },
  ],
  administracao: [
    { label: "Unidades", value: "8" },
    { label: "Transferências em aberto", value: "9" },
    { label: "Documentos pendentes", value: "23" },
    { label: "Usuários cadastrados", value: "1.392" },
  ],
};

export function GestaoDashboard({ name, role }: { name: string; role: Role }) {
  const navigate = useNavigate();
  const title = titleByRole[role] || "Painel";
  const stats = statsByRole[role] || [];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">Olá, {name.split(" ")[0]}! 👋</h1>
        <p className="text-base text-muted-foreground mt-2">{title}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="bg-card rounded-3xl border border-border p-5 shadow-sm">
                <p className="text-xs text-muted-foreground mb-2">{s.label}</p>
                <p className="text-3xl font-bold text-foreground">{s.value}</p>
              </div>
            ))}
          </div>

          <div className="bg-card rounded-3xl border border-border p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-foreground mb-5">Acesso rápido</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {tools.map((q) => (
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

          <DicaDoDia role={role} />
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
