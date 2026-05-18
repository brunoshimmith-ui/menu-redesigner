import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Plus, Video, Calendar, Users, Clock, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";

interface Reuniao {
  id: string;
  titulo: string;
  data: string;
  hora: string;
  pauta: string;
  participantes: string[];
  link: string;
}

const USUARIOS = [
  "Carlos Mendes", "Ana Paula Ribeiro", "Marcos Rocha", "Patrícia Lima",
  "Helena Vasconcelos", "Roberto Tavares", "Eduardo Albuquerque", "Fernanda Alves",
];

const Stepmeet = () => {
  const [reunioes, setReunioes] = useState<Reuniao[]>([
    { id: "1", titulo: "Reunião pedagógica", data: "20/05/2026", hora: "14:00", pauta: "Avaliação do 1º bimestre", participantes: ["Carlos Mendes", "Ana Paula Ribeiro"], link: "stepmeet.io/abc-123" },
  ]);
  const [open, setOpen] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [pauta, setPauta] = useState("");
  const [participantes, setParticipantes] = useState<string[]>([]);

  const criar = () => {
    if (!titulo || !data || !hora) return toast.error("Preencha título, data e hora.");
    setReunioes((p) => [...p, {
      id: String(Date.now()), titulo, data, hora, pauta, participantes,
      link: `stepmeet.io/${Math.random().toString(36).slice(2, 8)}`,
    }]);
    toast.success("Reunião agendada!");
    setOpen(false); setTitulo(""); setData(""); setHora(""); setPauta(""); setParticipantes([]);
  };

  return (
    <PageShell title="Stepmeet" description="Crie e participe de reuniões online.">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="w-4 h-4" /> Nova reunião</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Agendar reunião</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Título</Label><Input value={titulo} onChange={(e) => setTitulo(e.target.value)} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Data</Label><Input type="date" value={data} onChange={(e) => setData(e.target.value)} /></div>
                <div><Label>Hora</Label><Input type="time" value={hora} onChange={(e) => setHora(e.target.value)} /></div>
              </div>
              <div><Label>Pauta</Label><Textarea value={pauta} onChange={(e) => setPauta(e.target.value)} rows={3} /></div>
              <div>
                <Label>Participantes</Label>
                <div className="grid grid-cols-2 gap-2 mt-2 max-h-40 overflow-auto p-2 border rounded-md">
                  {USUARIOS.map((u) => (
                    <label key={u} className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={participantes.includes(u)}
                        onCheckedChange={(c) => setParticipantes((p) => c ? [...p, u] : p.filter((x) => x !== u))}
                      />
                      {u}
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter><Button onClick={criar}>Agendar</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reunioes.map((r) => (
          <Card key={r.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Video className="w-5 h-5 text-edu-blue" /> {r.titulo}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center gap-4 text-muted-foreground">
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {r.data}</span>
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {r.hora}</span>
              </div>
              {r.pauta && <p className="text-muted-foreground">{r.pauta}</p>}
              <div className="flex items-center gap-2 flex-wrap">
                <Users className="w-4 h-4 text-muted-foreground" />
                {r.participantes.map((p) => <Badge key={p} variant="secondary" className="text-xs">{p}</Badge>)}
              </div>
              <div className="flex items-center gap-2 pt-2">
                <LinkIcon className="w-4 h-4 text-muted-foreground" />
                <code className="text-xs flex-1">{r.link}</code>
                <Button size="sm" onClick={() => toast.success("Entrando na reunião...")}>Entrar</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
};

export default Stepmeet;
