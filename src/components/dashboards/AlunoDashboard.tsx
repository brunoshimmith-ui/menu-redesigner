import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Calendar as CalendarIcon, TrendingUp, IdCard, MapPin, Users as UsersIcon, Flag } from "lucide-react";
import { CalendarioEscolar } from "@/components/CalendarioEscolar";
import { AvisosImportantes } from "@/components/AvisosImportantes";
import { DicaDoDia } from "@/components/DicaDoDia";
import { avaliacoesByTurma } from "@/lib/store";
import { useEffect, useState } from "react";

const dadosAluno = {
  nomeCompleto: "João Pedro da Silva Souza",
  cpf: "123.456.789-00",
  rg: "MG-12.345.678",
  pai: "Carlos Eduardo Souza",
  mae: "Maria da Silva Souza",
  endereco: "Rua das Acácias, 250 — Bairro Centro",
  nacionalidade: "Brasileira",
  cidade: "Iranduba — AM",
};


const disciplinas = [
  { nome: "Matemática", b1: 8.5, b2: 7.8, b3: 9.0, b4: 0, freq: 95 },
  { nome: "Português", b1: 9.0, b2: 8.5, b3: 8.0, b4: 0, freq: 98 },
  { nome: "Ciências", b1: 7.5, b2: 8.0, b3: 7.0, b4: 0, freq: 92 },
  { nome: "História", b1: 8.0, b2: 7.5, b3: 8.2, b4: 0, freq: 96 },
  { nome: "Geografia", b1: 8.8, b2: 9.0, b3: 8.5, b4: 0, freq: 97 },
];

export function AlunoDashboard({ name, turma }: { name: string; turma: string }) {
  const [proxAvals, setProxAvals] = useState(avaliacoesByTurma(turma));
  useEffect(() => { setProxAvals(avaliacoesByTurma(turma)); }, [turma]);

  const today = new Date().toISOString().slice(0, 10);
  const futuras = proxAvals.filter((a) => a.date >= today).sort((a, b) => a.date.localeCompare(b.date));

  const media = (
    disciplinas.reduce((acc, d) => acc + (d.b1 + d.b2 + d.b3 + d.b4) / 4, 0) / disciplinas.length
  ).toFixed(1);
  const freqMedia = Math.round(disciplinas.reduce((a, d) => a + d.freq, 0) / disciplinas.length);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">Olá, {name.split(" ")[0]}! 📚</h1>
        <p className="text-base text-muted-foreground mt-2">Turma {turma} — acompanhe sua jornada letiva.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Stats pessoais */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-card rounded-3xl border border-border p-5 shadow-sm">
              <p className="text-xs text-muted-foreground mb-2">Média geral</p>
              <p className="text-3xl font-bold text-edu-green">{media}</p>
            </div>
            <div className="bg-card rounded-3xl border border-border p-5 shadow-sm">
              <p className="text-xs text-muted-foreground mb-2">Frequência</p>
              <p className="text-3xl font-bold text-edu-blue">{freqMedia}%</p>
            </div>
            <div className="bg-card rounded-3xl border border-border p-5 shadow-sm">
              <p className="text-xs text-muted-foreground mb-2">Disciplinas</p>
              <p className="text-3xl font-bold text-edu-purple">{disciplinas.length}</p>
            </div>
            <div className="bg-card rounded-3xl border border-border p-5 shadow-sm">
              <p className="text-xs text-muted-foreground mb-2">Próx. avaliações</p>
              <p className="text-3xl font-bold text-edu-coral">{futuras.length}</p>
            </div>
          </div>

          {/* Disciplinas */}
          <div className="bg-card rounded-3xl border border-border p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-foreground mb-5 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-edu-purple" /> Meu boletim
            </h2>
            <div className="space-y-3">
              {disciplinas.map((d) => (
                <div key={d.nome} className="p-3 rounded-xl border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold">{d.nome}</p>
                    <Badge variant="secondary">Freq: {d.freq}%</Badge>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    {[d.b1, d.b2, d.b3, d.b4].map((n, i) => (
                      <div key={i} className="p-2 rounded bg-muted/40">
                        <p className="text-[10px] text-muted-foreground">{i + 1}º Bim</p>
                        <p className="text-sm font-bold">{n > 0 ? n.toFixed(1) : "—"}</p>
                      </div>
                    ))}
                  </div>
                  <Progress value={d.freq} className="mt-2 h-1.5" />
                </div>
              ))}
            </div>
          </div>

          {/* Próximas avaliações */}
          <div className="bg-card rounded-3xl border border-border p-6 shadow-sm">
            <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-edu-coral" /> Próximas avaliações
            </h3>
            {futuras.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">Nenhuma avaliação agendada.</p>
            ) : (
              <div className="space-y-2">
                {futuras.slice(0, 5).map((a) => (
                  <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl border border-border">
                    <Badge className="bg-edu-coral text-white border-0">{new Date(a.date + "T00:00").toLocaleDateString("pt-BR")}</Badge>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{a.title}</p>
                      <p className="text-xs text-muted-foreground">{a.disciplina} • criado por {a.createdBy}</p>
                    </div>
                    <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <DicaDoDia role="aluno" />
        </div>

        <div className="space-y-6">
          <AvisosImportantes />
          <div className="bg-card rounded-3xl border border-border p-6 shadow-sm">
            <h3 className="text-xl font-bold text-foreground mb-3">Meu calendário</h3>
            <CalendarioEscolar filterTurma={turma} />
          </div>
        </div>
      </div>
    </div>
  );
}
