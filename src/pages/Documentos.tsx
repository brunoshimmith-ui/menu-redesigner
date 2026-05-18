import { useMemo, useState } from "react";
import { PageShell } from "@/components/PageShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, FileText, Download, Upload, FileHeart, FilePlus } from "lucide-react";
import { toast } from "sonner";

const TURMAS = ["Todas as turmas", "1º Ano A", "1º Ano B", "2º Ano A", "6º Ano A", "7º Ano A"];
const CATEGORIAS = ["Todas", "Histórico Escolar", "Atestado Médico", "Declarações", "Boletins", "Atividades"];

interface Doc {
  id: string;
  aluno: string;
  turma: string;
  categoria: string;
  titulo: string;
  data: string;
  inseridoPor: string;
}

const docs: Doc[] = [
  { id: "1", aluno: "Ana Beatriz Silva", turma: "1º Ano A", categoria: "Atestado Médico", titulo: "Atestado - 2 dias", data: "12/05/2026", inseridoPor: "Profa. Marina" },
  { id: "2", aluno: "Bruno Costa", turma: "1º Ano A", categoria: "Histórico Escolar", titulo: "Histórico 2025", data: "15/01/2026", inseridoPor: "Secretaria" },
  { id: "3", aluno: "Camila Rodrigues", turma: "2º Ano A", categoria: "Declarações", titulo: "Declaração de Matrícula", data: "05/02/2026", inseridoPor: "Secretaria" },
  { id: "4", aluno: "Daniel Santos", turma: "6º Ano A", categoria: "Boletins", titulo: "Boletim 1º Bim", data: "20/04/2026", inseridoPor: "Sistema" },
  { id: "5", aluno: "Emily Lima", turma: "1º Ano B", categoria: "Atestado Médico", titulo: "Atestado - 5 dias", data: "08/05/2026", inseridoPor: "Prof. Carlos" },
  { id: "6", aluno: "Felipe Almeida", turma: "7º Ano A", categoria: "Atividades", titulo: "Trabalho de Ciências", data: "10/05/2026", inseridoPor: "Profa. Beatriz" },
];

const Documentos = () => {
  const [search, setSearch] = useState("");
  const [turma, setTurma] = useState(TURMAS[0]);
  const [categoria, setCategoria] = useState(CATEGORIAS[0]);

  const filtrados = useMemo(() => docs.filter((d) =>
    (turma === TURMAS[0] || d.turma === turma) &&
    (categoria === CATEGORIAS[0] || d.categoria === categoria) &&
    (d.aluno.toLowerCase().includes(search.toLowerCase()) || d.titulo.toLowerCase().includes(search.toLowerCase()))
  ), [search, turma, categoria]);

  return (
    <PageShell title="Documentos" description="Centralize históricos, atestados e documentação inserida por professores e equipe.">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3 flex-wrap justify-between">
            <CardTitle className="flex items-center gap-2"><FileHeart className="w-5 h-5 text-edu-coral" /> Pesquisar documentação</CardTitle>
            <Button className="gap-2" onClick={() => toast.success("Abrindo formulário de envio...")}>
              <Upload className="w-4 h-4" /> Inserir documento
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar aluno ou documento..." className="pl-9" />
            </div>
            <Select value={turma} onValueChange={setTurma}>
              <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
              <SelectContent>{TURMAS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={categoria} onValueChange={setCategoria}>
              <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
              <SelectContent>{CATEGORIAS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{filtrados.length} documento(s) encontrado(s)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {filtrados.map((d) => (
            <div key={d.id} className="flex items-center justify-between p-4 border rounded-xl hover:bg-muted/40 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-edu-blue-light flex items-center justify-center">
                  <FileText className="w-5 h-5 text-edu-blue" />
                </div>
                <div>
                  <p className="font-medium">{d.titulo}</p>
                  <p className="text-xs text-muted-foreground">{d.aluno} • {d.turma} • Inserido por {d.inseridoPor}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{d.categoria}</Badge>
                <span className="text-xs text-muted-foreground">{d.data}</span>
                <Button size="sm" variant="outline" onClick={() => toast.success("Download iniciado!")}><Download className="w-4 h-4" /></Button>
              </div>
            </div>
          ))}
          {filtrados.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <FilePlus className="w-10 h-10 mx-auto mb-3 opacity-50" />
              Nenhum documento encontrado.
            </div>
          )}
        </CardContent>
      </Card>
    </PageShell>
  );
};

export default Documentos;
