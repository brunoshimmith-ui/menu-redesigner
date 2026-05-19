import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Plus, ChevronLeft, ChevronRight, Megaphone } from "lucide-react";
import { Role, useAuth } from "@/contexts/AuthContext";
import { avisosFor, saveAviso, Aviso, avaliacoesByProf, avaliacoesByTurma } from "@/lib/store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const allRoles: { value: Role; label: string }[] = [
  { value: "professor", label: "Professor" },
  { value: "aluno", label: "Aluno" },
  { value: "coordenacao", label: "Coordenação" },
  { value: "direcao", label: "Direção" },
  { value: "administracao", label: "Administração" },
  { value: "suporte", label: "Suporte" },
];

const canCreateRoles: Role[] = ["suporte", "administracao", "coordenacao", "direcao"];

export function AvisosImportantes() {
  const { user } = useAuth();
  const role = user?.role || "professor";
  const [items, setItems] = useState<Aviso[]>([]);
  const [slide, setSlide] = useState(0);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [date, setDate] = useState("");
  const [audAll, setAudAll] = useState(true);
  const [aud, setAud] = useState<Role[]>([]);

  const reload = () => {
    const base = avisosFor(role);
    // Avaliações viram avisos automáticos
    const extra: Aviso[] = [];
    if (role === "aluno" && user?.turma) {
      avaliacoesByTurma(user.turma).forEach((a) => extra.push({
        id: `av-${a.id}`,
        title: `📝 Avaliação: ${a.title}`,
        message: `${a.disciplina} • Turma ${a.turma}. Prepare-se!`,
        date: a.date,
        audience: ["aluno"],
        createdBy: a.createdBy,
      }));
    }
    if (role === "professor" && user?.name) {
      avaliacoesByProf(user.name).forEach((a) => extra.push({
        id: `av-${a.id}`,
        title: `📝 ${a.title}`,
        message: `Avaliação agendada para ${a.turma} (${a.disciplina}).`,
        date: a.date,
        audience: ["professor"],
        createdBy: a.createdBy,
      }));
    }
    const merged = [...extra, ...base].sort((a, b) => b.date.localeCompare(a.date));
    setItems(merged);
  };
  useEffect(reload, [role, user?.turma, user?.name]);

  useEffect(() => {
    if (items.length === 0) return;
    const t = setInterval(() => setSlide((s) => (s + 1) % items.length), 5000);
    return () => clearInterval(t);
  }, [items.length]);

  const canCreate = canCreateRoles.includes(role);

  const handleSave = () => {
    if (!title || !message || !date) return toast.error("Preencha título, mensagem e data.");
    saveAviso({
      id: crypto.randomUUID(),
      title, message, date,
      audience: audAll ? "all" : aud,
      createdBy: user?.name || "",
    });
    toast.success("Aviso publicado!");
    setTitle(""); setMessage(""); setDate(""); setAudAll(true); setAud([]);
    setOpen(false);
    reload();
  };

  const toggleAud = (r: Role) =>
    setAud((p) => p.includes(r) ? p.filter((x) => x !== r) : [...p, r]);

  return (
    <div className="bg-card rounded-3xl border border-border p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-edu-purple" /> Avisos importantes
        </h3>
        {canCreate && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="h-7 gap-1 text-xs">
                <Plus className="w-3.5 h-3.5" /> Criar
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Novo aviso importante</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground">Título</label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Reunião Pedagógica" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Mensagem</label>
                  <Textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Data</label>
                  <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <Checkbox checked={audAll} onCheckedChange={(v) => setAudAll(!!v)} />
                    Visível para todos
                  </label>
                  {!audAll && (
                    <div className="mt-2 grid grid-cols-2 gap-1.5 p-2 rounded-md border border-border">
                      {allRoles.map((r) => (
                        <label key={r.value} className="flex items-center gap-2 text-xs cursor-pointer">
                          <Checkbox checked={aud.includes(r.value)} onCheckedChange={() => toggleAud(r.value)} />
                          {r.label}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                <Button onClick={handleSave}>Publicar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-6">Nenhum aviso no momento.</p>
      ) : (
        <>
          <div className="relative overflow-hidden rounded-lg">
            <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${slide * 100}%)` }}>
              {items.map((a, i) => (
                <div key={a.id} className={cn("min-w-full p-5 rounded-2xl", i % 2 === 0 ? "bg-edu-purple-light" : "bg-edu-blue-light")}>
                  <div className="flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-edu-purple mt-1.5" />
                    <div>
                      <p className="text-sm font-bold">{a.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{a.message}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" className="text-[10px]">{new Date(a.date + "T00:00").toLocaleDateString("pt-BR")}</Badge>
                        <span className="text-[10px] text-muted-foreground">por {a.createdBy}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between mt-3">
            <button onClick={() => setSlide((s) => (s - 1 + items.length) % items.length)} className="p-1 hover:bg-muted rounded">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex gap-1.5">
              {items.map((_, i) => (
                <button key={i} onClick={() => setSlide(i)} className={cn("h-1.5 rounded-full transition-all", i === slide ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/30")} />
              ))}
            </div>
            <button onClick={() => setSlide((s) => (s + 1) % items.length)} className="p-1 hover:bg-muted rounded">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
