import { useState } from "react";
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
  UserCircle,
  GraduationCap,
  LogOut,
  ChevronDown,
  Bell,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const menuItems = [
  { icon: Users, label: "Todas as Turmas", variant: "blue" as const, path: "/turmas" },
  { icon: Globe, label: "Página Pública", variant: "orange" as const, path: "/pagina-publica" },
  { icon: PlayCircle, label: "Stepmeet", variant: "coral" as const, path: "/stepmeet" },
  { icon: LayoutDashboard, label: "Dashboard", variant: "purple" as const, path: "/dashboard" },
  { icon: Settings, label: "Configurações", variant: "gray" as const, path: "/configuracoes" },
  { icon: UserCog, label: "Usuários", variant: "blue" as const, path: "/usuarios" },
  { icon: ArrowUpDown, label: "Transferências", variant: "gray" as const, path: "/transferencias" },
];

const variantStyles = {
  green: "text-edu-green bg-edu-green-light",
  coral: "text-edu-coral bg-edu-coral-light",
  purple: "text-edu-purple bg-edu-purple-light",
  blue: "text-edu-blue bg-edu-blue-light",
  orange: "text-edu-orange bg-edu-orange-light",
  gray: "text-edu-gray bg-edu-gray-light",
};

const schoolOptions = ["SM-A(1)", "SM-B(2)", "SM-C(3)"];
const profileOptions = ["Suporte", "Administrador", "Gestor"];

export function AppSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [selectedSchool, setSelectedSchool] = useState("SM-A(1)");
  const [selectedProfile, setSelectedProfile] = useState("Suporte");
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

        {/* Selectors */}
        <div className="p-3 space-y-2 border-b border-sidebar-border">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={cn(
                "w-full flex items-center gap-3 p-2 rounded-lg hover:bg-sidebar-accent transition-colors",
                isCollapsed && "justify-center"
              )}>
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-edu-green-light flex-shrink-0">
                  <School className="w-4 h-4 text-edu-green" />
                </div>
                {!isCollapsed && (
                  <>
                    <div className="flex-1 text-left overflow-hidden">
                      <span className="text-[10px] text-muted-foreground block">Escola</span>
                      <span className="text-xs font-medium text-edu-green truncate block">
                        {selectedSchool}
                      </span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  </>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              {schoolOptions.map((option) => (
                <DropdownMenuItem
                  key={option}
                  onClick={() => setSelectedSchool(option)}
                  className={cn(option === selectedSchool && "bg-muted")}
                >
                  {option}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={cn(
                "w-full flex items-center gap-3 p-2 rounded-lg hover:bg-sidebar-accent transition-colors",
                isCollapsed && "justify-center"
              )}>
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-edu-coral-light flex-shrink-0">
                  <UserCircle className="w-4 h-4 text-edu-coral" />
                </div>
                {!isCollapsed && (
                  <>
                    <div className="flex-1 text-left overflow-hidden">
                      <span className="text-[10px] text-muted-foreground block">Perfil</span>
                      <span className="text-xs font-medium text-edu-coral truncate block">
                        {selectedProfile}
                      </span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  </>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              {profileOptions.map((option) => (
                <DropdownMenuItem
                  key={option}
                  onClick={() => setSelectedProfile(option)}
                  className={cn(option === selectedProfile && "bg-muted")}
                >
                  {option}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Notifications */}
        <div className="p-3 border-b border-sidebar-border">
          <button className={cn(
            "w-full flex items-center gap-3 p-2 rounded-lg hover:bg-sidebar-accent transition-colors",
            isCollapsed && "justify-center"
          )}>
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-edu-purple-light flex-shrink-0">
              <Bell className="w-4 h-4 text-edu-purple" />
              <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-edu-coral text-white">
                3
              </Badge>
            </div>
            {!isCollapsed && (
              <div className="flex-1 text-left overflow-hidden">
                <span className="text-xs font-medium text-sidebar-foreground truncate block">
                  Notificações
                </span>
                <span className="text-[10px] text-muted-foreground block">3 novas</span>
              </div>
            )}
          </button>
        </div>

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
