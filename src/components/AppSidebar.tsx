import { useNavigate, useLocation } from "react-router-dom";
import {
  Users,
  Globe,
  PlayCircle,
  LayoutDashboard,
  Settings,
  UserCog,
  ArrowUpDown,
  School,
  GraduationCap,
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
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", variant: "purple" as const, path: "/menu", desc: "Visão geral e indicadores" },
  { icon: Users, label: "Todas as Turmas", variant: "blue" as const, path: "/turmas", desc: "Gerencie turmas, edições e turnos" },
  { icon: GraduationCap, label: "Educação Especial", variant: "coral" as const, path: "/usuarios", desc: "Acompanhe estudantes e recursos" },
  { icon: UserCog, label: "Usuários", variant: "blue" as const, path: "/usuarios", desc: "Buscar alunos e ver trajetória" },
  { icon: ArrowUpDown, label: "Transferências", variant: "gray" as const, path: "/transferencias", desc: "Solicitações e movimentações" },
  { icon: Globe, label: "Página Pública", variant: "orange" as const, path: "/pagina-publica", desc: "Vitrine pública da escola" },
  { icon: PlayCircle, label: "Stepmeet", variant: "coral" as const, path: "/stepmeet", desc: "Reuniões online" },
  { icon: Settings, label: "Configurações", variant: "gray" as const, path: "/configuracoes", desc: "Preferências e ajustes" },
];

const variantStyles = {
  green: "text-edu-green bg-edu-green-light",
  coral: "text-edu-coral bg-edu-coral-light",
  purple: "text-edu-purple bg-edu-purple-light",
  blue: "text-edu-blue bg-edu-blue-light",
  orange: "text-edu-orange bg-edu-orange-light",
  gray: "text-edu-gray bg-edu-gray-light",
};


export function AppSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleMenuClick = (path: string) => {
    navigate(path);
  };

  return (
    <Sidebar collapsible="icon">
      {/* Header */}
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg flex-shrink-0">
            <GraduationCap className="w-6 h-6 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <h1 className="text-lg font-bold text-sidebar-foreground tracking-tight">SEMED</h1>
              <p className="text-xs text-muted-foreground">Sistema Educacional</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* User Profile Section */}
        {!isCollapsed && (
          <div className="p-4 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-xl flex-shrink-0">
                <School className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="overflow-hidden">
                <h2 className="text-sm font-bold text-sidebar-foreground truncate">
                  {user?.name || "Gestor Maravilha"}
                </h2>
                <p className="text-xs text-primary font-medium">#SEME00001</p>
              </div>
            </div>
          </div>
        )}



        {/* Menu Items */}
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    tooltip={item.label}
                    className={cn(
                      "gap-3",
                      location.pathname === item.path && "bg-sidebar-accent"
                    )}
                    onClick={() => handleMenuClick(item.path)}
                  >
                    <div className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0",
                      variantStyles[item.variant]
                    )}>
                      <item.icon className="w-4 h-4" />
                    </div>
                    <span className="truncate">{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-sidebar-border p-3">
        <Button 
          variant="destructive" 
          size="sm" 
          className={cn("w-full gap-2", isCollapsed && "px-0")}
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          {!isCollapsed && "Sair"}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
