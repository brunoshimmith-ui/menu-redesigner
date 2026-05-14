import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  HeartHandshake,
  UserCog,
  ArrowUpDown,
  Globe,
  PlayCircle,
  BarChart3,
  FileText,
  Settings,
  Headphones,
  GraduationCap,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const menuItems = [
  { icon: Home, label: "Dashboard", path: "/menu", desc: "Visão geral e indicadores" },
  { icon: Users, label: "Turmas", path: "/turmas", desc: "Gerencie turmas, edições e turnos" },
  { icon: HeartHandshake, label: "Educação Especial", path: "/usuarios", desc: "Acompanhe estudantes e recursos" },
  { icon: UserCog, label: "Usuários", path: "/usuarios", desc: "Buscar alunos e ver trajetória" },
  { icon: ArrowUpDown, label: "Transferências", path: "/transferencias", desc: "Solicitações e movimentações" },
  { icon: Globe, label: "Página Pública", path: "/pagina-publica", desc: "Vitrine pública da escola" },
  { icon: PlayCircle, label: "Stepmeet", path: "/stepmeet", desc: "Reuniões online" },
  { icon: BarChart3, label: "Relatórios", path: "/relatorios", desc: "Gere e exporte relatórios" },
  { icon: FileText, label: "Documentos", path: "/documentos", desc: "Histórico, boletins e declarações" },
  { icon: Settings, label: "Configurações", path: "/configuracoes", desc: "Preferências e ajustes" },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Sidebar
      collapsible="icon"
      className="[&_[data-sidebar=sidebar]]:bg-[hsl(225_40%_12%)] [&_[data-sidebar=sidebar]]:text-slate-200"
    >
      {/* Header / Logo */}
      <SidebarHeader className="border-b border-white/10 p-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg flex-shrink-0">
            <GraduationCap className="w-6 h-6 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <h1 className="text-lg font-bold text-white tracking-tight">SEMEI</h1>
              <p className="text-[10px] text-slate-400 leading-tight">
                SISTEMA MUNICIPAL DE EDUCAÇÃO
              </p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      tooltip={`${item.label} — ${item.desc}`}
                      title={item.desc}
                      onClick={() => navigate(item.path)}
                      className={cn(
                        "gap-3 text-slate-300 hover:bg-white/5 hover:text-white transition-colors",
                        isActive && "bg-primary/15 text-white border-l-2 border-primary rounded-l-none"
                      )}
                    >
                      <item.icon className={cn("w-4 h-4", isActive && "text-primary")} />
                      <span className="truncate">{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Suporte footer */}
      <SidebarFooter className="border-t border-white/10 p-3">
        {!isCollapsed ? (
          <div className="rounded-lg p-3 bg-white/5">
            <div className="flex items-center gap-2 mb-1">
              <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/20">
                <Headphones className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Suporte</p>
                <p className="text-[10px] text-slate-400">Precisa de ajuda?</p>
              </div>
            </div>
            <button className="text-xs text-primary hover:underline mt-1">
              Abrir chamado →
            </button>
            <button
              onClick={handleLogout}
              className="w-full mt-3 flex items-center justify-center gap-2 text-xs text-slate-400 hover:text-white transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" /> Sair
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full p-2 rounded-md text-slate-400 hover:bg-white/5 hover:text-white"
            title="Sair"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
