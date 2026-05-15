import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { HeaderWithNotifications } from "@/components/HeaderWithNotifications";

interface PageShellProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

export function PageShell({ title, description, children }: PageShellProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <HeaderWithNotifications />
          <main className="flex-1 p-6 overflow-auto">
            <div className="max-w-7xl mx-auto space-y-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-[#1d2746]">{title}</h1>
                {description && (
                  <p className="text-base text-muted-foreground mt-2">{description}</p>
                )}
              </div>
              {children ?? (
                <div className="bg-card rounded-3xl border border-border p-12 shadow-sm text-center">
                  <p className="text-muted-foreground">
                    Esta seção está em construção. Em breve, novas funcionalidades estarão disponíveis aqui.
                  </p>
                </div>
              )}
            </div>
          </main>
          <footer className="border-t border-border bg-card py-4 text-center">
            <p className="text-xs text-muted-foreground">
              © 2026 SEMEI - Sistema Municipal de Educação de Iranduba. Todos os direitos reservados.
            </p>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
}
