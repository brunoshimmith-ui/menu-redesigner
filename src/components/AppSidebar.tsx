import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  GraduationCap,
  Heart,
  Users,
  ArrowLeftRight,
  Globe,
  Play,
  BarChart3,
  FileText,
  Settings,
  Headphones,
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
  { icon: GraduationCap, label: "Turmas", path: "/turmas", desc: "Gerencie turmas, edições e turnos" },
  { icon: Heart, label: "Educação Especial", path: "/educacao-especial", desc: "Acompanhe estudantes e recursos" },
  { icon: Users, label: "Usuários", path: "/usuarios", desc: "Buscar alunos e ver trajetória" },
  { icon: ArrowLeftRight, label: "Transferências", path: "/transferencias", desc: "Solicitações e movimentações" },
  { icon: Globe, label: "Página Pública", path: "/pagina-publica", desc: "Vitrine pública da escola" },
  { icon: Play, label: "Stepmeet", path: "/stepmeet", desc: "Reuniões online" },
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
      collapsible="offcanvas"
      className="[&_[data-sidebar=sidebar]]:bg-[#1a2547] [&_[data-sidebar=sidebar]]:text-white [&_[data-sidebar=sidebar]]:border-r-0"
    >
      {/* Header / Logo */}
      <SidebarHeader className="border-b border-white/10 p-6">
        {!isCollapsed ? (
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white">SEMEI</h1>
            <p className="text-[10px] font-medium opacity-60 mt-2 leading-tight uppercase tracking-[0.2em]">
              Sistema Municipal<br />de Educação
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <span className="text-lg font-bold text-white">S</span>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="px-3 pt-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      onClick={() => navigate(item.path)}
                      className={cn(
                        "h-11 gap-3 px-4 rounded-2xl text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none",
                        isActive && "bg-[#3dc7e0] text-[#1a2547] font-semibold hover:bg-[#3dc7e0] hover:text-[#1a2547]"
                      )}
                    >
                      <item.icon className="w-4 h-4" />
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
      <SidebarFooter className="p-4">
        {!isCollapsed ? (
          <div className="rounded-2xl p-4 bg-white/5">
            <div className="flex items-center gap-3 mb-2">
              <Headphones className="w-5 h-5 text-white" />
              <h3 className="font-semibold text-white">Suporte</h3>
            </div>
            <p className="text-xs opacity-70 mb-3">Precisa de ajuda?</p>
            <button className="text-sm text-[#3dc7e0] font-semibold hover:underline">
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
