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
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { SuporteChamadoDialog } from "@/components/SuporteChamadoDialog";

import type { Role } from "@/contexts/AuthContext";

type Item = { icon: typeof Home; label: string; path: string; roles: Role[] };

const groups: { label: string; items: Item[] }[] = [
  {
    label: "Acadêmico",
    items: [
      { icon: Home, label: "Início", path: "/menu", roles: ["suporte", "professor", "coordenacao", "direcao", "administracao", "aluno"] },
      { icon: GraduationCap, label: "Turmas", path: "/turmas", roles: ["suporte", "professor", "coordenacao", "direcao", "administracao"] },
      { icon: Heart, label: "Educação Especial", path: "/educacao-especial", roles: ["suporte", "coordenacao", "direcao", "administracao"] },
    ],
  },
  {
    label: "Gestão",
    items: [
      { icon: Users, label: "Usuários", path: "/usuarios", roles: ["suporte", "coordenacao", "direcao", "administracao"] },
      { icon: ArrowLeftRight, label: "Transferências", path: "/transferencias", roles: ["suporte", "coordenacao", "direcao", "administracao"] },
      { icon: Globe, label: "Página Pública", path: "/pagina-publica", roles: ["suporte", "professor", "coordenacao", "direcao", "administracao", "aluno"] },
      { icon: Play, label: "Stepmeet", path: "/stepmeet", roles: ["suporte", "professor", "coordenacao", "direcao", "administracao"] },
    ],
  },
  {
    label: "Relatórios",
    items: [
      { icon: BarChart3, label: "Relatórios", path: "/relatorios", roles: ["suporte", "professor", "coordenacao", "direcao", "administracao"] },
      { icon: FileText, label: "Documentos", path: "/documentos", roles: ["suporte", "professor", "coordenacao", "direcao", "administracao", "aluno"] },
    ],
  },
  {
    label: "Sistema",
    items: [
      { icon: Settings, label: "Configurações", path: "/configuracoes", roles: ["suporte", "professor", "coordenacao", "direcao", "administracao", "aluno"] },
    ],
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();
  const role = user?.role || "suporte";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Sidebar
      collapsible="offcanvas"
      className="[&_[data-sidebar=sidebar]]:bg-gradient-to-b [&_[data-sidebar=sidebar]]:from-[#0a1f4d] [&_[data-sidebar=sidebar]]:via-[#0a1838] [&_[data-sidebar=sidebar]]:to-[#07152c] dark:[&_[data-sidebar=sidebar]]:from-[#0a1226] dark:[&_[data-sidebar=sidebar]]:via-[#070e1f] dark:[&_[data-sidebar=sidebar]]:to-[#050b1a] [&_[data-sidebar=sidebar]]:text-white [&_[data-sidebar=sidebar]]:border-r-0 dark:[&_[data-sidebar=sidebar]]:border-r dark:[&_[data-sidebar=sidebar]]:border-white/5"
    >
      <SidebarHeader className="border-b border-white/10 p-6">
        {!isCollapsed ? (
          <div className="text-center">
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
        {groups.map((group) => {
          const visible = group.items.filter((i) => i.roles.includes(role));
          if (visible.length === 0) return null;
          return (
            <SidebarGroup key={group.label} className="mb-2">
              {!isCollapsed && (
                <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.18em] text-white/40 px-4 mb-1">
                  {group.label}
                </SidebarGroupLabel>
              )}
              <SidebarGroupContent>
                <SidebarMenu className="gap-1">
                  {visible.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <SidebarMenuItem key={item.label}>
                        <SidebarMenuButton
                          onClick={() => navigate(item.path)}
                          className={cn(
                            "h-10 gap-3 px-4 rounded-xl text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none",
                            isActive && "bg-[#5b6cff] text-white hover:bg-[#5b6cff] hover:text-white shadow-[0_4px_12px_-2px_rgba(91,108,255,0.45)]"
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
          );
        })}
      </SidebarContent>

      <SidebarFooter className="p-4">
        {!isCollapsed ? (
          <div className="rounded-2xl p-4 bg-white/5">
            <div className="flex items-center gap-3 mb-2">
              <Headphones className="w-5 h-5 text-white" />
              <h3 className="font-semibold text-white">Suporte</h3>
            </div>
            <p className="text-xs opacity-70 mb-3">Precisa de ajuda?</p>
            <SuporteChamadoDialog
              trigger={
                <button className="text-sm text-[#6d7cff] font-semibold hover:underline">
                  Abrir chamado →
                </button>
              }
            />
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
