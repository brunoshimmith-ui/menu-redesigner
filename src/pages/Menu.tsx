import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSidebar } from "@/components/AppSidebar";
import { HeaderWithNotifications } from "@/components/HeaderWithNotifications";
import { useAuth } from "@/contexts/AuthContext";
import { SuporteDashboard } from "@/components/dashboards/SuporteDashboard";
import { ProfessorDashboard } from "@/components/dashboards/ProfessorDashboard";
import { GestaoDashboard } from "@/components/dashboards/GestaoDashboard";
import { AlunoDashboard } from "@/components/dashboards/AlunoDashboard";

const Menu = () => {
  const { user } = useAuth();
  const role = user?.role || "suporte";
  const name = user?.name || "Usuário";

  let content: JSX.Element;
  switch (role) {
    case "professor":
      content = <ProfessorDashboard name={name} />;
      break;
    case "aluno":
      content = <AlunoDashboard name={name} turma={user?.turma || "7º A"} />;
      break;
    case "coordenacao":
    case "direcao":
    case "administracao":
      content = <GestaoDashboard name={name} role={role} />;
      break;
    case "suporte":
    default:
      content = <SuporteDashboard name={name} />;
  }

  return (
    <SidebarProvider>
      <TooltipProvider delayDuration={200}>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar />
          <div className="flex-1 flex flex-col">
            <HeaderWithNotifications />
            <main className="flex-1 p-6 bg-pattern overflow-auto">{content}</main>
            <footer className="border-t border-border bg-card py-4 text-center">
              <p className="text-xs text-muted-foreground">
                © 2026 SEMEI - Sistema Municipal de Educação de Iranduba.
              </p>
            </footer>
          </div>
        </div>
      </TooltipProvider>
    </SidebarProvider>
  );
};

export default Menu;
