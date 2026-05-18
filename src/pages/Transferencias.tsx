import { useMemo, useState } from "react";
import { PageShell } from "@/components/PageShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, ArrowRight, ArrowLeft, Shuffle, GraduationCap } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from "recharts";
import { toast } from "sonner";

const ESCOLAS = ["SEMEI Iranduba - 01", "SEMEI Iranduba - 02", "SEMEI Iranduba - 03"];
const TURMAS = ["1º Ano A", "1º Ano B", "2º Ano A", "6º Ano A", "7º Ano A"];

const alunos = Array.from({ length: 20 }).map((_, i) => ({
  id: String(i + 1),
  nome: ["Ana Silva", "Bruno Costa", "Camila Rodrigues", "Daniel Santos", "Emily Lima", "Felipe Almeida",
    "Gabriela Souza", "Henrique Martins", "Isabela Pereira", "João Ribeiro", "Karina Nascimento",
    "Leonardo Araújo", "Marina Gomes", "Nicolas Barbosa", "Olivia Carvalho", "Pedro Mendes",
    "Rafaela Monteiro", "Samuel Teixeira", "Tatiana Moreira", "Valentina Rocha"][i],
  matricula: `2024${String(i + 1).padStart(4, "0")}`,
  turma: TURMAS[i % TURMAS.length],
  escola: ESCOLAS[i % ESCOLAS.length],
}));

const movimentacoesData = [
  { mes: "Jan", Transferidos: 4, Remanejados: 2 },
  { mes: "Fev", Transferidos: 7, Remanejados: 5 },
  { mes: "Mar", Transferidos: 3, Remanejados: 8 },
  { mes: "Abr", Transferidos: 5, Remanejados: 4 },
  { mes: "Mai", Transferidos: 9, Remanejados: 6 },
];

type Acao = "saida" | "entrada" | "remanejamento" | null;

const Transferencias = () => {
  const [escola, setEscola] = useState(ESCOLAS[0]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<typeof alunos[0] | null>(null);
  const [acao, setAcao] = useState<Acao>(null);
  const [destino, setDestino] = useState("");
  const [motivo, setMotivo] = useState("");

  const filtrados = useMemo(
    () => alunos.filter((a) => a.escola === escola && a.nome.toLowerCase().includes(search.toLowerCase())),
    [escola, search]
  );

  const totalTransferidos = movimentacoesData.reduce((s, m) => s + m.Transferidos, 0);
  const totalRemanejados = movimentacoesData.reduce((s, m) => s + m.Remanejados, 0);

  const confirmar = () => {
    if (!destino) return toast.error("Selecione o destino.");
    toast.success(
      `${acao === "saida" ? "Transferência de saída" : acao === "entrada" ? "Transferência de entrada" : "Remanejamento"} de ${selected?.nome} para ${destino} registrado.`
    );
    setAcao(null);
    setSelected(null);
    setDestino("");
    setMotivo("");
  };

  return (
    <PageShell title="Transferências" description="Acompanhe movimentações, transferências e remanejamentos de alunos.">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Transferidos (2026)</p><p className="text-3xl font-bold text-edu-blue">{totalTransferidos}</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Remanejados (2026)</p><p className="text-3xl font-bold text-edu-orange">{totalRemanejados}</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Escola atual</p><p className="text-lg font-semibold text-foreground">{escola}</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Movimentações por mês</CardTitle></CardHeader>
        <CardContent style={{ height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={movimentacoesData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Transferidos" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Remanejados" fill="hsl(var(--accent))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-3 justify-between">
            <CardTitle>Buscar aluno para movimentação</CardTitle>
            <div className="flex items-center gap-2 flex-wrap">
              <Select value={escola} onValueChange={setEscola}>
                <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
                <SelectContent>{ESCOLAS.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent>
              </Select>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Pesquisar aluno..." className="pl-9" />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filtrados.map((a) => (
              <div key={a.id} className="border rounded-xl p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-edu-blue-light flex items-center justify-center"><GraduationCap className="w-5 h-5 text-edu-blue" /></div>
                  <div>
                    <p className="font-medium">{a.nome}</p>
                    <p className="text-xs text-muted-foreground">{a.matricula} • {a.turma}</p>
                  </div>
                </div>
                <Button size="sm" onClick={() => setSelected(a)}>Selecionar</Button>
              </div>
            ))}
            {filtrados.length === 0 && <p className="text-sm text-muted-foreground col-span-2 text-center py-6">Nenhum aluno encontrado.</p>}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selected && !acao} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{selected?.nome}</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Selecione o tipo de movimentação:</p>
          <div className="grid grid-cols-1 gap-2 pt-2">
            <Button variant="outline" className="justify-start gap-2" onClick={() => setAcao("saida")}>
              <ArrowRight className="w-4 h-4" /> Transferência de saída
            </Button>
            <Button variant="outline" className="justify-start gap-2" onClick={() => setAcao("entrada")}>
              <ArrowLeft className="w-4 h-4" /> Transferência de entrada
            </Button>
            <Button variant="outline" className="justify-start gap-2" onClick={() => setAcao("remanejamento")}>
              <Shuffle className="w-4 h-4" /> Remanejamento
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!acao} onOpenChange={(o) => !o && setAcao(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {acao === "saida" && "Transferência de saída"}
              {acao === "entrada" && "Transferência de entrada"}
              {acao === "remanejamento" && "Remanejamento"} — {selected?.nome}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>{acao === "remanejamento" ? "Nova turma" : "Escola de destino"}</Label>
              <Select value={destino} onValueChange={setDestino}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {(acao === "remanejamento" ? TURMAS : ESCOLAS.filter((e) => e !== escola)).map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Motivo / observações</Label>
              <Textarea value={motivo} onChange={(e) => setMotivo(e.target.value)} rows={3} />
            </div>
          </div>
          <DialogFooter><Button onClick={confirmar}>Confirmar</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
};

export default Transferencias;
