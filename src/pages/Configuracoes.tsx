import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { GripVertical, Settings as SettingsIcon, LayoutDashboard, Bell, Palette } from "lucide-react";
import { toast } from "sonner";

const CAMPOS_PADRAO = [
  { id: "stats", label: "Cards de estatísticas", ativo: true },
  { id: "calendario", label: "Calendário escolar", ativo: true },
  { id: "avisos", label: "Avisos importantes (slider)", ativo: true },
  { id: "frequencia", label: "Frequência e desempenho", ativo: true },
  { id: "atividades", label: "Atividades recentes", ativo: true },
  { id: "reunioes", label: "Próximas reuniões", ativo: false },
  { id: "documentos-pendentes", label: "Documentos pendentes", ativo: false },
];

const Configuracoes = () => {
  const [campos, setCampos] = useState(CAMPOS_PADRAO);
  const [dragId, setDragId] = useState<string | null>(null);
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(true);
  const [tema, setTema] = useState<"claro" | "escuro" | "sistema">("sistema");

  const toggle = (id: string) =>
    setCampos((p) => p.map((c) => c.id === id ? { ...c, ativo: !c.ativo } : c));

  const onDrop = (id: string) => {
    if (!dragId || dragId === id) return;
    setCampos((p) => {
      const from = p.findIndex((c) => c.id === dragId);
      const to = p.findIndex((c) => c.id === id);
      const arr = [...p];
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      return arr;
    });
    setDragId(null);
  };

  const salvar = () => toast.success("Configurações salvas!");

  return (
    <PageShell title="Configurações" description="Personalize a organização do painel principal e suas preferências.">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><LayoutDashboard className="w-5 h-5 text-edu-blue" /> Organização do painel principal</CardTitle>
          <p className="text-sm text-muted-foreground">Arraste para reordenar e ative/desative os blocos visíveis no painel.</p>
        </CardHeader>
        <CardContent className="space-y-2">
          {campos.map((c) => (
            <div
              key={c.id}
              draggable
              onDragStart={() => setDragId(c.id)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => onDrop(c.id)}
              className="flex items-center gap-3 p-3 border rounded-xl bg-card hover:bg-muted/40 transition-colors cursor-move"
            >
              <GripVertical className="w-4 h-4 text-muted-foreground" />
              <span className="flex-1 font-medium">{c.label}</span>
              <Switch checked={c.ativo} onCheckedChange={() => toggle(c.id)} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Bell className="w-5 h-5 text-edu-orange" /> Notificações</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between"><Label>Receber por e-mail</Label><Switch checked={notifEmail} onCheckedChange={setNotifEmail} /></div>
          <div className="flex items-center justify-between"><Label>Notificações push</Label><Switch checked={notifPush} onCheckedChange={setNotifPush} /></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Palette className="w-5 h-5 text-edu-purple" /> Aparência</CardTitle></CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {(["claro", "escuro", "sistema"] as const).map((t) => (
              <Button key={t} variant={tema === t ? "default" : "outline"} onClick={() => setTema(t)} className="capitalize">
                {t}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={salvar} className="gap-2"><SettingsIcon className="w-4 h-4" /> Salvar configurações</Button>
      </div>
    </PageShell>
  );
};

export default Configuracoes;
