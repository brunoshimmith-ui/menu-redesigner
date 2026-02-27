import { Bell } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface HeaderWithNotificationsProps {
  notificationCount?: number;
}

export function HeaderWithNotifications({ notificationCount = 3 }: HeaderWithNotificationsProps) {
  return (
    <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4">
      <SidebarTrigger />
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5 text-muted-foreground" />
          {notificationCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] bg-destructive text-destructive-foreground">
              {notificationCount}
            </Badge>
          )}
        </Button>
        <ThemeToggle />
      </div>
    </header>
  );
}
