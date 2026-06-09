import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  GripVertical,
  Settings as SettingsIcon,
  LayoutDashboard,
  Bell,
  Palette,
  Images,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { useCanalSlides } from "@/hooks/use-canal-slides";
import type { CanalSlide } from "@/lib/canalPublicoStore";

const CAMPOS_PADRAO = [
  { id: "stats", label: "Cards de estatísticas", ativo: true },
  { id: "calendario", label: "Calendário escolar", ativo: true },
  { id: "avisos", label: "Avisos importantes (slider)", ativo: true },
  { id: "frequencia", label: "Frequência e desempenho", ativo: true },
  { id: "atividades", label: "Atividades recentes", ativo: true },
  { id: "reunioes", label: "Próximas reuniões", ativo: false },
  { id: "documentos-pendentes", label: "Documentos pendentes", ativo: false },
];

function SlideEditor({
  titulo,
  descricao,
  slides,
  onChange,
}: {
  titulo: string;
  descricao: string;
  slides: CanalSlide[];
  onChange: (s: CanalSlide[]) => void;
}) {
  const update = (id: string, patch: Partial<CanalSlide>) =>
    onChange(slides.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  const remove = (id: string) => onChange(slides.filter((s) => s.id !== id));

  const add = () =>
    onChange([
      ...slides,
      {
        id: `s-${Date.now()}`,
        titulo: "Novo slide",
        descricao: "",
        gradient: "from-edu-blue to-edu-purple",
      },
    ]);

  const handleFile = (id: string, file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => update(id, { imagem: String(reader.result) });
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-3">
      <div>
        <h3 className="font-semibold">{titulo}</h3>
        <p className="text-sm text-muted-foreground">{descricao}</p>
      </div>

      <div className="space-y-3">
        {slides.map((s) => (
          <div key={s.id} className="rounded-xl border p-4 space-y-3 bg-card">
            <div className="flex gap-3">
              <div className="w-24 h-24 rounded-lg overflow-hidden border shrink-0 bg-muted">
                {s.imagem ? (
                  <img src={s.imagem} alt={s.titulo} className="w-full h-full object-cover" />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${s.gradient ?? "from-edu-blue to-edu-purple"}`} />
                )}
              </div>
              <div className="flex-1 space-y-2">
                <Input
                  value={s.titulo}
                  onChange={(e) => update(s.id, { titulo: e.target.value })}
                  placeholder="Título do slide"
                />
                <Textarea
                  value={s.descricao}
                  onChange={(e) => update(s.id, { descricao: e.target.value })}
                  placeholder="Texto/descrição"
                  className="min-h-[60px]"
                />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Input
                value={s.imagem ?? ""}
                onChange={(e) => update(s.id, { imagem: e.target.value })}
                placeholder="URL da imagem (https://...)"
                className="flex-1 min-w-[200px]"
              />
              <label className="inline-flex items-center gap-2 h-10 px-3 rounded-md border cursor-pointer hover:bg-muted text-sm">
                <Upload className="w-4 h-4" />
                Enviar
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFile(s.id, e.target.files?.[0] ?? null)}
                />
              </label>
              <Button variant="ghost" size="icon" onClick={() => remove(s.id)} aria-label="Remover">
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Button variant="outline" onClick={add} className="gap-2">
        <Plus className="w-4 h-4" /> Adicionar slide
      </Button>
    </div>
  );
}

const Configuracoes = () => {
  const [campos, setCampos] = useState(CAMPOS_PADRAO);
  const [dragId, setDragId] = useState<string | null>(null);
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(true);
  const [tema, setTema] = useState<"claro" | "escuro" | "sistema">("sistema");

  const { hero, info, setHero, setInfo } = useCanalSlides();

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
          <CardTitle className="flex items-center gap-2">
            <Images className="w-5 h-5 text-edu-blue" /> Canal público — fotos e textos
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Edite os slides exibidos no cabeçalho e na vitrine principal do canal público.
          </p>
        </CardHeader>
        <CardContent className="space-y-8">
          <SlideEditor
            titulo="Cabeçalho (carrossel superior)"
            descricao="Imagens das escolas ou frases educacionais que aparecem no topo do canal."
            slides={hero}
            onChange={setHero}
          />
          <div className="border-t" />
          <SlideEditor
            titulo="Slides do canal (atendimento e eventos)"
            descricao="Funcionamento, eventos específicos de cada escola e iniciativas em destaque."
            slides={info}
            onChange={setInfo}
          />
        </CardContent>
      </Card>

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
