import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Heart, Eye, MessageCircle, MapPin, Phone, Mail, Calendar } from "lucide-react";
import { toast } from "sonner";

interface Foto {
  id: string;
  titulo: string;
  gradient: string;
  curtidas: number;
  visitas: number;
  liked: boolean;
}

const galeriaInicial: Foto[] = [
  { id: "1", titulo: "Festa Junina 2025", gradient: "from-orange-400 to-pink-500", curtidas: 124, visitas: 580, liked: false },
  { id: "2", titulo: "Feira de Ciências", gradient: "from-blue-400 to-purple-500", curtidas: 89, visitas: 410, liked: false },
  { id: "3", titulo: "Olimpíada de Matemática", gradient: "from-emerald-400 to-cyan-500", curtidas: 156, visitas: 720, liked: true },
  { id: "4", titulo: "Sarau Literário", gradient: "from-rose-400 to-amber-500", curtidas: 67, visitas: 290, liked: false },
  { id: "5", titulo: "Aula de Campo", gradient: "from-lime-400 to-teal-500", curtidas: 98, visitas: 350, liked: false },
  { id: "6", titulo: "Formatura 5º Ano", gradient: "from-violet-400 to-fuchsia-500", curtidas: 203, visitas: 890, liked: true },
];

interface Comentario { id: string; autor: string; texto: string }

const PaginaPublica = () => {
  const [galeria, setGaleria] = useState(galeriaInicial);
  const [comentarios, setComentarios] = useState<Comentario[]>([
    { id: "1", autor: "Maria Souza", texto: "Adoro essa escola! Meus filhos amam estudar aqui." },
    { id: "2", autor: "João Pereira", texto: "Profissionais excelentes e atenciosos." },
  ]);
  const [novoComentario, setNovoComentario] = useState("");

  const toggleCurtir = (id: string) => {
    setGaleria((prev) =>
      prev.map((f) => f.id === id ? { ...f, liked: !f.liked, curtidas: f.curtidas + (f.liked ? -1 : 1) } : f)
    );
  };

  const enviarComentario = () => {
    if (!novoComentario.trim()) return;
    setComentarios((prev) => [...prev, { id: String(Date.now()), autor: "Você", texto: novoComentario }]);
    setNovoComentario("");
    toast.success("Comentário publicado!");
  };

  return (
    <PageShell title="Página Pública" description="Vitrine pública da escola — interaja com a comunidade.">
      <Card>
        <div className="h-40 bg-gradient-to-r from-edu-blue via-edu-purple to-edu-coral rounded-t-3xl" />
        <CardContent className="pt-6">
          <h2 className="text-2xl font-bold">SEMEI Iranduba - 01</h2>
          <p className="text-muted-foreground mt-1">Educação de qualidade para a comunidade de Iranduba há 25 anos.</p>
          <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Av. Brasil, 1234 - Iranduba/AM</span>
            <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> (92) 3344-5566</span>
            <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> contato@semei.edu.br</span>
            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Seg-Sex 7h às 17h</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Galeria de eventos</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {galeria.map((foto) => (
              <div key={foto.id} className="rounded-2xl overflow-hidden border bg-card">
                <div className={`h-44 bg-gradient-to-br ${foto.gradient}`} />
                <div className="p-4 space-y-2">
                  <p className="font-semibold">{foto.titulo}</p>
                  <div className="flex items-center justify-between text-sm">
                    <button onClick={() => toggleCurtir(foto.id)} className="flex items-center gap-1 hover:text-edu-coral transition-colors">
                      <Heart className={`w-4 h-4 ${foto.liked ? "fill-edu-coral text-edu-coral" : ""}`} /> {foto.curtidas}
                    </button>
                    <span className="flex items-center gap-1 text-muted-foreground"><Eye className="w-4 h-4" /> {foto.visitas}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><MessageCircle className="w-5 h-5" /> Mural da comunidade</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input value={novoComentario} onChange={(e) => setNovoComentario(e.target.value)} placeholder="Deixe seu comentário..." />
            <Button onClick={enviarComentario}>Publicar</Button>
          </div>
          <div className="space-y-3">
            {comentarios.map((c) => (
              <div key={c.id} className="flex gap-3 p-3 rounded-xl bg-muted/40">
                <Avatar className="w-9 h-9"><AvatarFallback>{c.autor[0]}</AvatarFallback></Avatar>
                <div>
                  <p className="text-sm font-medium">{c.autor}</p>
                  <p className="text-sm text-muted-foreground">{c.texto}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </PageShell>
  );
};

export default PaginaPublica;
