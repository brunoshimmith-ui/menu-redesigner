import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import { ArrowUp, ArrowDown, X, Plus } from "lucide-react";
import { COORDENADORES_DISPONIVEIS, ALUNOS_MOCK } from "@/lib/planosEstudo";
import { Turma, turmasStore, MatriculaAluno } from "@/lib/turmasStore";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  turma: Turma;
}

export function ConfigTurmaDialog({ open, onOpenChange, turma }: Props) {
  const [coords, setCoords] = useState<string[]>([]);
  const [alocarTodas, setAlocarTodas] = useState(true);
  const [matriculas, setMatriculas] = useState<MatriculaAluno[]>([]);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    if (open) {
      setCoords(turma.coordenadores);
      setMatriculas([...turma.matriculas].sort((a, b) => a.ordem - b.ordem));
      setBusca("");
    }
  }, [open, turma]);

  const toggleCoord = (c: string) =>
    setCoords((cur) => (cur.includes(c) ? cur.filter((x) => x !== c) : [...cur, c]));

  const salvarCoord = () => {
    turmasStore.setCoordenadores(turma.id, coords);
    toast({
      title: "Coordenadores atualizados",
      description: alocarTodas ? "Alocados em todas as disciplinas." : undefined,
    });
  };

  const adicionarAluno = (nome: string) => {
    if (matriculas.some((m) => m.nome === nome)) return;
    setMatriculas([...matriculas, { nome, ordem: matriculas.length + 1 }]);
  };
  const removerAluno = (nome: string) => {
    setMatriculas(matriculas.filter((m) => m.nome !== nome).map((m, i) => ({ ...m, ordem: i + 1 })));
  };
  const mover = (idx: number, dir: -1 | 1) => {
    const novo = [...matriculas];
    const alvo = idx + dir;
    if (alvo < 0 || alvo >= novo.length) return;
    [novo[idx], novo[alvo]] = [novo[alvo], novo[idx]];
    setMatriculas(novo.map((m, i) => ({ ...m, ordem: i + 1 })));
  };
  const salvarMatriculas = () => {
    turmasStore.setMatriculas(turma.id, matriculas);
    toast({ title: "Matrículas salvas", description: `${matriculas.length} aluno(s).` });
  };

  const candidatos = ALUNOS_MOCK.filter(
    (a) => a.toLowerCase().includes(busca.toLowerCase()) && !matriculas.some((m) => m.nome === a),
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configurações — {turma.ano} {turma.letra}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="coord">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="coord">Coordenador</TabsTrigger>
            <TabsTrigger value="mat">Matrículas</TabsTrigger>
            <TabsTrigger value="status">Status</TabsTrigger>
          </TabsList>

          <TabsContent value="coord" className="space-y-4">
            <Label>Selecionar Coordenadores</Label>
            <ScrollArea className="h-48 border rounded-md p-2">
              {COORDENADORES_DISPONIVEIS.map((c) => (
                <label key={c} className="flex items-center gap-2 py-1 cursor-pointer text-sm">
                  <Checkbox checked={coords.includes(c)} onCheckedChange={() => toggleCoord(c)} />
                  {c}
                </label>
              ))}
            </ScrollArea>
            <div className="flex items-center justify-between p-3 border rounded-md">
              <div>
                <Label>Alocar em todas as disciplinas</Label>
                <p className="text-xs text-muted-foreground">Opcional</p>
              </div>
              <Switch checked={alocarTodas} onCheckedChange={setAlocarTodas} />
            </div>
            <div className="flex justify-end">
              <Button onClick={salvarCoord}>Salvar Coordenadores</Button>
            </div>
          </TabsContent>

          <TabsContent value="mat" className="space-y-4">
            <div className="space-y-2">
              <Label>Buscar aluno</Label>
              <Input placeholder="Digite o nome..." value={busca} onChange={(e) => setBusca(e.target.value)} />
              {busca && (
                <div className="border rounded-md max-h-40 overflow-y-auto">
                  {candidatos.length === 0 ? (
                    <p className="p-2 text-sm text-muted-foreground">Nenhum aluno encontrado.</p>
                  ) : (
                    candidatos.map((a) => (
                      <button
                        key={a}
                        onClick={() => adicionarAluno(a)}
                        className="w-full text-left px-3 py-2 hover:bg-accent text-sm flex items-center justify-between"
                      >
                        {a} <Plus className="w-4 h-4" />
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Matrículas ({matriculas.length})</Label>
              <div className="border rounded-md divide-y">
                {matriculas.length === 0 && (
                  <p className="p-3 text-sm text-muted-foreground">Nenhum aluno matriculado.</p>
                )}
                {matriculas.map((m, idx) => (
                  <div key={m.nome} className="flex items-center justify-between p-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-6 text-xs text-muted-foreground">{m.ordem}.</span>
                      <span>{m.nome}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button size="icon" variant="ghost" onClick={() => mover(idx, -1)}>
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => mover(idx, 1)}>
                        <ArrowDown className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => removerAluno(m.nome)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={salvarMatriculas}>Salvar Matrículas</Button>
            </div>
          </TabsContent>

          <TabsContent value="status" className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-md">
              <div>
                <Label>Turma {turma.ativa ? "ativa" : "inativa"}</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  {turma.ativa
                    ? "Desative para ocultar a turma das listagens padrão."
                    : "Ative para a turma voltar a aparecer nas listagens padrão."}
                </p>
              </div>
              <Switch
                checked={turma.ativa}
                onCheckedChange={(v) => {
                  turmasStore.setAtiva(turma.id, v);
                  toast({ title: v ? "Turma ativada" : "Turma inativada" });
                }}
              />
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
