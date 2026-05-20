import { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Bell, School, UserCircle, ChevronDown, ArrowRight, Home, Headphones } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import { chamadosSuporte } from "@/lib/chamados";

interface Notification {
  id: string;
  title: string;
  description: string;
  type: "pendencia" | "atualizacao" | "chamado";
  urgency?: "alta" | "media" | "baixa";
  read: boolean;
  route: string;
  time: string;
  from?: string;
}

const initialNotifications: Notification[] = [
  { id: "1", title: "Notas pendentes", description: "1º Ano A — Matemática: lançar notas do 2º bimestre", type: "pendencia", route: "/turmas/1/disciplinas", read: false, time: "Há 10 min" },
  { id: "2", title: "Conteúdo não registrado", description: "6º Ano A — Português: registrar conteúdo da aula de 25/02", type: "pendencia", route: "/turmas/5/disciplinas", read: false, time: "Há 30 min" },
  { id: "3", title: "Frequência pendente", description: "2º Ano A — Ciências: registrar frequência do dia 24/02", type: "pendencia", route: "/turmas/3/disciplinas", read: false, time: "Há 1h" },
  { id: "4", title: "Nova atualização da plataforma", description: "Versão 2.4 disponível: novo módulo de relatórios e exportação de boletins em PDF.", type: "atualizacao", route: "/menu", read: false, time: "Há 2h" },
  { id: "5", title: "Notas pendentes", description: "7º Ano A — História: lançar notas do 1º bimestre", type: "pendencia", route: "/turmas/7/disciplinas", read: true, time: "Ontem" },
  { id: "6", title: "Manutenção programada", description: "O sistema ficará indisponível no dia 01/03 das 22h às 23h para manutenção.", type: "atualizacao", route: "/menu", read: true, time: "2 dias atrás" },
];

const schoolOptions = ["SEMEI Iranduba - 01", "SEMEI Iranduba - 02", "SEMEI Iranduba - 03"];
const profileOptions = ["Suporte", "Administrador", "Gestor"];

const quickAccessAccounts = [
  { u: "stepforma", l: "Suporte" },
  { u: "professor", l: "Professor" },
  { u: "aluno", l: "Aluno" },
  { u: "coord", l: "Coordenação" },
  { u: "direcao", l: "Direção" },
  { u: "admin", l: "Admin" },
];

const urgencyBadge: Record<string, string> = {
  alta: "bg-edu-coral text-white",
  media: "bg-edu-orange text-white",
  baixa: "bg-edu-blue text-white",
};

export function HeaderWithNotifications() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login } = useAuth();
  const [notifications, setNotifications] = useState(initialNotifications);
  const [selectedSchool, setSelectedSchool] = useState("SEMEI Iranduba - 01");
  const [selectedProfile, setSelectedProfile] = useState("Suporte");
  const [open, setOpen] = useState(false);
  const [quickOpen, setQuickOpen] = useState(false);

  const allNotifications = useMemo<Notification[]>(() => {
    if (user?.role === "suporte") {
      const chamadosAsNotif: Notification[] = chamadosSuporte.map((c) => ({
        id: `chamado-${c.id}`,
        title: `📞 ${c.title}`,
        description: `${c.from} (${c.role}): ${c.description}`,
        type: "chamado",
        urgency: c.urgency,
        read: c.read,
        route: "/menu",
        time: c.time,
        from: c.from,
      }));
      return [...chamadosAsNotif, ...notifications];
    }
    return notifications;
  }, [user?.role, notifications]);

  const unreadCount = allNotifications.filter((n) => !n.read).length;

  const handleNotificationClick = (notif: Notification) => {
    if (notif.id.startsWith("chamado-")) {
      // marca chamado como lido localmente
      const idx = chamadosSuporte.findIndex((c) => `chamado-${c.id}` === notif.id);
      if (idx >= 0) chamadosSuporte[idx].read = true;
    } else {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
      );
    }
    setOpen(false);
    navigate(notif.route);
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    chamadosSuporte.forEach((c) => (c.read = true));
  };

  return (
    <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        {location.pathname !== "/menu" && (
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 h-8 text-xs"
            onClick={() => navigate("/menu")}
          >
            <Home className="w-3.5 h-3.5" />
            Menu principal
          </Button>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* School selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card hover:bg-muted transition-colors">
              <div className="flex items-center justify-center w-7 h-7 rounded-md bg-edu-green-light">
                <School className="w-3.5 h-3.5 text-edu-green" />
              </div>
              <span className="text-xs text-muted-foreground hidden sm:inline">Escola:</span>
              <span className="text-xs font-semibold text-foreground hidden sm:inline">{selectedSchool}</span>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {schoolOptions.map((opt) => (
              <DropdownMenuItem key={opt} onClick={() => setSelectedSchool(opt)} className={cn(opt === selectedSchool && "bg-muted")}>
                {opt}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Profile selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-muted transition-colors">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-edu-purple-light">
                <UserCircle className="w-5 h-5 text-edu-purple" />
              </div>
              <div className="hidden sm:flex flex-col items-start leading-tight">
                <span className="text-xs font-semibold text-foreground">Bruno</span>
                <span className="text-[10px] text-muted-foreground">{selectedProfile}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            {profileOptions.map((opt) => (
              <DropdownMenuItem key={opt} onClick={() => setSelectedProfile(opt)} className={cn(opt === selectedProfile && "bg-muted")}>
                {opt}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Quick access (apenas para suporte): troca rápida de perfil */}
        {user?.role === "suporte" && (
          <DropdownMenu open={quickOpen} onOpenChange={setQuickOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5 h-9 text-xs">
                <Users className="w-3.5 h-3.5 text-edu-purple" />
                <span className="hidden sm:inline">Acesso rápido</span>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <div className="px-2 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                Entrar como
              </div>
              {quickAccessAccounts.map((p) => (
                <DropdownMenuItem
                  key={p.u}
                  onClick={() => {
                    const ok = login(p.u, "12345678");
                    if (ok) {
                      setQuickOpen(false);
                      navigate("/menu");
                    }
                  }}
                  className="cursor-pointer gap-2"
                >
                  <UserCircle className="w-4 h-4 text-edu-purple" />
                  <span className="text-xs">{p.l}</span>
                </DropdownMenuItem>
              ))}
              <div className="px-2 py-1.5 text-[10px] text-muted-foreground border-t border-border mt-1">
                Senha padrão: <span className="font-mono">12345678</span>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Notifications */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5 text-muted-foreground" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] bg-destructive text-destructive-foreground border-0">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-96 p-0">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <h3 className="text-sm font-semibold text-foreground">Notificações</h3>
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="text-xs text-primary hover:underline">
                  Marcar todas como lidas
                </button>
              )}
            </div>
            <ScrollArea className="max-h-96">
              {allNotifications.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">Nenhuma notificação</p>
              ) : (
                allNotifications.map((notif) => (
                  <button
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif)}
                    className={cn(
                      "w-full text-left px-4 py-3 border-b border-border last:border-0 hover:bg-muted/50 transition-colors flex gap-3",
                      !notif.read && "bg-primary/5"
                    )}
                  >
                    <div className={cn(
                      "mt-0.5 w-2 h-2 rounded-full flex-shrink-0",
                      !notif.read ? "bg-primary" : "bg-transparent"
                    )} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold text-foreground">{notif.title}</span>
                        {notif.type === "chamado" ? (
                          <>
                            <Badge className="text-[10px] px-1.5 py-0 border-0 bg-edu-purple text-white gap-1">
                              <Headphones className="w-2.5 h-2.5" /> Chamado
                            </Badge>
                            {notif.urgency && (
                              <Badge className={cn("text-[10px] px-1.5 py-0 border-0", urgencyBadge[notif.urgency])}>
                                {notif.urgency.toUpperCase()}
                              </Badge>
                            )}
                          </>
                        ) : (
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                            {notif.type === "pendencia" ? "Pendência" : "Atualização"}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notif.description}</p>
                      <span className="text-[10px] text-muted-foreground mt-1 block">{notif.time}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 mt-1" />
                  </button>
                ))
              )}
            </ScrollArea>
          </PopoverContent>
        </Popover>

        <ThemeToggle />
      </div>
    </header>
  );
}
