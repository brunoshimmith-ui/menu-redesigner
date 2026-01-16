import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Top Header */}
          <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4">
            <SidebarTrigger />
            <div className="flex items-center gap-2">
              <ThemeToggle />
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 bg-pattern">
            <div className="max-w-4xl mx-auto">
              <div className="bg-card rounded-xl border border-border p-8 shadow-sm">
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Bem-vindo ao Sistema Educacional
                </h1>
                <p className="text-muted-foreground">
                  Selecione uma opção no menu lateral para começar.
                </p>
              </div>
            </div>
          </main>

          {/* Footer */}
          <footer className="border-t border-border bg-card py-4">
            <div className="flex flex-col items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <HelpCircle className="w-4 h-4" />
                FAQ
              </Button>
              <p className="text-xs text-muted-foreground">
                © 2026 Sistema Educacional. Todos os direitos reservados.
              </p>
            </div>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
