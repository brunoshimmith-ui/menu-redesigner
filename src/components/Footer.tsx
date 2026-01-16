import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="w-full bg-muted/50 border-t border-border py-6">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-3">
        <Button variant="outline" size="sm" className="gap-2">
          <HelpCircle className="w-4 h-4" />
          FAQ
        </Button>
        <p className="text-xs text-muted-foreground">
          © 2026 Sistema Educacional. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
