import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Eye } from "lucide-react";
import { toast } from "sonner";

const TURMAS = ["1º Ano A", "1º Ano B", "2º Ano A", "6º Ano A", "7º Ano A"];

const tipos = [
  { id: "ata-classe", label: "ATAs de Classe", desc: "Registros das reuniões de classe", color: "bg-edu-blue-light text-edu-blue" },
  { id: "ata-resultado", label: "ATAs de Resultados", desc: "Resultados finais por bimestre/ano", color: "bg-edu-purple-light text-edu-purple" },
  { id: "boletim", label: "Boletins Escolares", desc: "Boletim consolidado dos alunos", color: "bg-edu-green-light text-edu-green" },
];

const Relatorios = () => {
  const [turma, setTurma] = useState(TURMAS[0]);

  const itens = (tipo: string) =>
    Array.from({ length: 4 }).map((_, i) => ({
      id: `${tipo}-${i}`,
      titulo: `${tipo === "boletim" ? "Boletim" : tipo === "ata-classe" ? "ATA de Classe" : "ATA de Resultados"} — ${turma} — ${i + 1}º Bimestre`,
      data: `${10 + i}/0${i + 2}/2026`,
      status: i < 2 ? "Disponível" : "Em geração",
    }));

  return (
    <PageShell title="Relatórios" description="Centralize ATAs de Classe, ATAs de Resultados e Boletins Escolares.">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3 flex-wrap justify-between">
            <CardTitle>Filtros</CardTitle>
            <Select value={turma} onValueChange={setTurma}>
              <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
              <SelectContent>{TURMAS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="ata-classe">
        <TabsList>
          {tipos.map((t) => <TabsTrigger key={t.id} value={t.id}>{t.label}</TabsTrigger>)}
        </TabsList>

        {tipos.map((t) => (
          <TabsContent key={t.id} value={t.id}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5 text-edu-blue" /> {t.label}</CardTitle>
                <p className="text-sm text-muted-foreground">{t.desc}</p>
              </CardHeader>
              <CardContent className="space-y-2">
                {itens(t.id).map((i) => (
                  <div key={i.id} className="flex items-center justify-between p-4 border rounded-xl hover:bg-muted/40 transition-colors">
                    <div className="flex items-center gap-3">
                      <Badge className={`${t.color} border-0`}>{i.status}</Badge>
                      <div>
                        <p className="font-medium">{i.titulo}</p>
                        <p className="text-xs text-muted-foreground">Gerado em {i.data}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={() => toast.success("Visualizando relatório...")}><Eye className="w-4 h-4" /></Button>
                      <Button size="sm" variant="outline" onClick={() => toast.success("Download iniciado!")}><Download className="w-4 h-4 mr-1" /> PDF</Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </PageShell>
  );
};

export default Relatorios;
