import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Heart,
  Eye,
  MessageCircle,
  MapPin,
  Phone,
  Mail,
  Calendar,
  LogIn,
  School,
  Users,
  Sparkles,
  ChevronDown,
  Clock,
  GraduationCap,
} from "lucide-react";
import { useMunicipio } from "@/hooks/use-municipio";
import { toast } from "sonner";

interface Acao {
  id: string;
  titulo: string;
  autor: string;
  descricao: string;
  gradient: string;
  curtidas: number;
  visitas: number;
  liked: boolean;
}

const acoesIniciais: Acao[] = [
  {
    id: "1",
    titulo: "Entrega de kits escolares",
    autor: "Coord. Ana Paula",
    descricao:
      "Mais de 1.200 alunos receberam kits completos com material didático para o início do ano letivo.",
    gradient: "from-edu-blue to-edu-purple",
    curtidas: 248,
    visitas: 1320,
    liked: false,
  },
  {
    id: "2",
    titulo: "Feira de Ciências Municipal",
    autor: "Coord. Carlos Mendes",
    descricao:
      "Estudantes das escolas municipais apresentaram projetos sobre sustentabilidade e tecnologia.",
    gradient: "from-edu-orange to-edu-coral",
    curtidas: 192,
    visitas: 980,
    liked: true,
  },
  {
    id: "3",
    titulo: "Formação continuada de professores",
    autor: "Coord. Fernanda Alves",
    descricao:
      "Mais de 80 docentes participaram da capacitação em metodologias ativas e BNCC.",
    gradient: "from-edu-purple to-edu-blue",
    curtidas: 134,
    visitas: 610,
    liked: false,
  },
  {
    id: "4",
    titulo: "Olimpíada de Matemática",
    autor: "Coord. Roberto Lima",
    descricao:
      "Premiação dos melhores alunos do município com participação de 15 escolas.",
    gradient: "from-edu-coral to-edu-orange",
    curtidas: 301,
    visitas: 1540,
    liked: false,
  },
];

const fotosMunicipio = [
  { id: "f1", titulo: "Sede da SEMED", gradient: "from-edu-blue to-edu-purple" },
  { id: "f2", titulo: "Praça central", gradient: "from-emerald-400 to-cyan-500" },
  { id: "f3", titulo: "Escola modelo", gradient: "from-edu-orange to-edu-coral" },
  { id: "f4", titulo: "Biblioteca municipal", gradient: "from-violet-400 to-fuchsia-500" },
];

const CanalPublico = () => {
  const navigate = useNavigate();
  const { municipio, municipios, setMunicipio } = useMunicipio();
  const [acoes, setAcoes] = useState(acoesIniciais);
  const [comentarios, setComentarios] = useState([
    { id: "1", autor: "Maria Souza", texto: "Adoro acompanhar as ações da nossa SEMED!" },
    { id: "2", autor: "João Pereira", texto: "Trabalho incrível com nossos professores." },
  ]);
  const [novoComentario, setNovoComentario] = useState("");
  const [escolaSelecionada, setEscolaSelecionada] = useState<string | null>(null);

  const toggleCurtir = (id: string) => {
    setAcoes((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, liked: !a.liked, curtidas: a.curtidas + (a.liked ? -1 : 1) } : a
      )
    );
  };

  const enviarComentario = () => {
    if (!novoComentario.trim()) return;
    setComentarios((prev) => [
      ...prev,
      { id: String(Date.now()), autor: "Visitante", texto: novoComentario },
    ]);
    setNovoComentario("");
    toast.success("Comentário publicado!");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* HERO com gradiente do sistema */}
      <header
        className="relative overflow-hidden text-white"
        style={{
          background:
            "linear-gradient(135deg, #0a1f4d 0%, #0a1838 45%, #07152c 100%)",
        }}
      >
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full blur-3xl bg-edu-purple/40" />
          <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full blur-3xl bg-edu-blue/40" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
              <School className="w-5 h-5" />
            </div>
            <div className="leading-tight">
              <p className="text-xs uppercase tracking-widest text-white/60">SEMED</p>
              <p className="text-sm font-semibold">Canal público</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={municipio.id}
              onChange={(e) => setMunicipio(e.target.value as typeof municipio.id)}
              className="h-10 rounded-full px-4 text-sm text-white bg-white/10 backdrop-blur border border-white/20 hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/30 transition-colors"
              aria-label="Selecionar município"
            >
              {municipios.map((m) => (
                <option key={m.id} value={m.id} className="text-slate-800">
                  {m.nome} — {m.uf}
                </option>
              ))}
            </select>
            <Button
              onClick={() => navigate("/login")}
              className="h-10 rounded-full px-5 bg-white/10 backdrop-blur border border-white/20 text-white hover:bg-white/20 font-semibold"
            >
              <LogIn className="w-4 h-4 mr-1" />
              Iniciar sessão
            </Button>
          </div>
        </div>

        <div className="relative max-w-6xl mx-auto px-6 pt-8 pb-16">
          <div className="flex items-center gap-2 text-white/70 text-sm">
            <MapPin className="w-4 h-4" />
            {municipio.nome}/{municipio.uf}
          </div>
          <h1 className="mt-2 text-4xl md:text-5xl font-bold leading-tight">
            Educação que transforma <br className="hidden md:block" />
            <span className="text-white/80">a comunidade de {municipio.nome}.</span>
          </h1>
          <p className="mt-4 text-white/70 max-w-2xl">
            Acompanhe as ações, projetos e conquistas da rede municipal de ensino.
            Conheça as escolas, veja fotos do município e participe.
          </p>

          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl">
            <div className="rounded-2xl bg-white/10 backdrop-blur p-4 border border-white/10">
              <p className="text-2xl font-bold">{municipio.escolas.length}</p>
              <p className="text-xs text-white/70 flex items-center gap-1">
                <School className="w-3 h-3" /> Escolas
              </p>
            </div>
            <div className="rounded-2xl bg-white/10 backdrop-blur p-4 border border-white/10">
              <p className="text-2xl font-bold">+5.2k</p>
              <p className="text-xs text-white/70 flex items-center gap-1">
                <Users className="w-3 h-3" /> Alunos
              </p>
            </div>
            <div className="rounded-2xl bg-white/10 backdrop-blur p-4 border border-white/10">
              <p className="text-2xl font-bold">+320</p>
              <p className="text-xs text-white/70 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Professores
              </p>
            </div>
            <div className="rounded-2xl bg-white/10 backdrop-blur p-4 border border-white/10">
              <p className="text-2xl font-bold">{acoes.length}</p>
              <p className="text-xs text-white/70 flex items-center gap-1">
                <Heart className="w-3 h-3" /> Ações recentes
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-10">
        {/* Fotos do município */}
        <section>
          <div className="flex items-end justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">Fotos do município</h2>
              <p className="text-sm text-muted-foreground">
                Um olhar sobre {municipio.nome} e suas escolas.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {fotosMunicipio.map((f) => (
              <div key={f.id} className="rounded-2xl overflow-hidden border bg-card">
                <div className={`h-32 bg-gradient-to-br ${f.gradient}`} />
                <div className="p-3">
                  <p className="text-sm font-medium">{f.titulo}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Ações dos coordenadores */}
        <section>
          <div className="mb-4">
            <h2 className="text-2xl font-bold">Ações dos coordenadores</h2>
            <p className="text-sm text-muted-foreground">
              Projetos e iniciativas conduzidas pela equipe pedagógica.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {acoes.map((a) => (
              <article key={a.id} className="rounded-2xl overflow-hidden border bg-card flex flex-col">
                <div className={`h-44 bg-gradient-to-br ${a.gradient}`} />
                <div className="p-5 space-y-3 flex-1 flex flex-col">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">
                      {a.autor}
                    </p>
                    <h3 className="text-lg font-semibold mt-1">{a.titulo}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground flex-1">{a.descricao}</p>
                  <div className="flex items-center justify-between text-sm pt-2 border-t">
                    <button
                      onClick={() => toggleCurtir(a.id)}
                      className="flex items-center gap-1.5 hover:text-edu-coral transition-colors"
                    >
                      <Heart className={`w-4 h-4 ${a.liked ? "fill-edu-coral text-edu-coral" : ""}`} />
                      {a.curtidas} curtidas
                    </button>
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Eye className="w-4 h-4" /> {a.visitas} visitas
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Escolas (lista expansível) */}
        <section>
          <Collapsible defaultOpen={false}>
            <CollapsibleTrigger className="w-full group">
              <div className="rounded-2xl border bg-card p-5 flex items-center justify-between hover:bg-muted/40 transition-colors">
                <div className="flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-xl bg-edu-blue/10 text-edu-blue flex items-center justify-center">
                    <School className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">Escolas da rede</h2>
                    <p className="text-sm text-muted-foreground">
                      {municipio.escolas.length} unidades em {municipio.nome}/{municipio.uf} — clique para expandir
                    </p>
                  </div>
                </div>
                <ChevronDown className="w-5 h-5 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {municipio.escolas.map((e) => (
                  <button
                    key={e}
                    onClick={() => setEscolaSelecionada(e)}
                    className="text-left rounded-xl border bg-card p-4 flex items-center gap-3 hover:border-edu-blue hover:shadow-md transition-all"
                  >
                    <div className="w-9 h-9 rounded-lg bg-edu-blue/10 text-edu-blue flex items-center justify-center shrink-0">
                      <School className="w-4 h-4" />
                    </div>
                    <p className="text-sm font-medium">{e}</p>
                  </button>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </section>

        {/* Dialog com detalhes da escola */}
        <Dialog open={!!escolaSelecionada} onOpenChange={(o) => !o && setEscolaSelecionada(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <School className="w-5 h-5 text-edu-blue" />
                {escolaSelecionada}
              </DialogTitle>
              <DialogDescription>
                Unidade da rede municipal de {municipio.nome}/{municipio.uf}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-edu-blue mt-0.5" />
                <span>{municipio.nome}/{municipio.uf} — endereço disponível na secretaria</span>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-edu-orange mt-0.5" />
                <span>Contato via SEMED — {municipio.nome}</span>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-edu-purple mt-0.5" />
                <span>contato@semed.{municipio.id}.gov.br</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-muted-foreground mt-0.5" />
                <span>Funcionamento: Segunda a Sexta, 7h às 17h</span>
              </div>
              <div className="flex items-start gap-2">
                <GraduationCap className="w-4 h-4 text-muted-foreground mt-0.5" />
                <span>Ensino oferecido conforme calendário municipal de {municipio.nome}.</span>
              </div>
              <div className="pt-2 border-t text-muted-foreground">
                Informações detalhadas da unidade são gerenciadas pela SEMED de {municipio.nome}.
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Mural */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" /> Mural da comunidade
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={novoComentario}
                  onChange={(e) => setNovoComentario(e.target.value)}
                  placeholder="Deixe seu comentário..."
                />
                <Button onClick={enviarComentario}>Publicar</Button>
              </div>
              <div className="space-y-3">
                {comentarios.map((c) => (
                  <div key={c.id} className="flex gap-3 p-3 rounded-xl bg-muted/40">
                    <Avatar className="w-9 h-9">
                      <AvatarFallback>{c.autor[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{c.autor}</p>
                      <p className="text-sm text-muted-foreground">{c.texto}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Contato */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl border bg-card p-5">
            <MapPin className="w-5 h-5 text-edu-blue" />
            <p className="mt-2 text-sm font-semibold">Endereço</p>
            <p className="text-sm text-muted-foreground">
              SEMED — {municipio.nome}/{municipio.uf}
            </p>
          </div>
          <div className="rounded-2xl border bg-card p-5">
            <Phone className="w-5 h-5 text-edu-orange" />
            <p className="mt-2 text-sm font-semibold">Telefone</p>
            <p className="text-sm text-muted-foreground">(00) 0000-0000</p>
          </div>
          <div className="rounded-2xl border bg-card p-5">
            <Mail className="w-5 h-5 text-edu-purple" />
            <p className="mt-2 text-sm font-semibold">E-mail</p>
            <p className="text-sm text-muted-foreground">
              contato@semed.{municipio.id}.gov.br
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t mt-10">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />© 2026 SEMED — {municipio.nome}/{municipio.uf}
          </div>
          <Button
            variant="outline"
            onClick={() => navigate("/login")}
            className="rounded-full"
          >
            <LogIn className="w-4 h-4 mr-1" />
            Acesso restrito
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default CanalPublico;
