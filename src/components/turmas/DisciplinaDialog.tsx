import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import {
  DISCIPLINAS_PADRAO,
  TIPOS_ENSINO,
  PROFESSORES_DISPONIVEIS,
  ESTRUTURAS_AVALIACAO,
} from "@/lib/planosEstudo";
import { Turma, turmasStore, newId, DisciplinaTurma } from "@/lib/turmasStore";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  turma: Turma;
  disciplina?: DisciplinaTurma | null;
}

export function DisciplinaDialog({ open, onOpenChange, turma, disciplina }: Props) {
  const isEdit = !!disciplina;
  const [nome, setNome] = useState("");
  const [professores, setProfessores] = useState<string[]>([]);
  const [professorSubstituto, setProfessorSubstituto] = useState<string>("none");
  const [estruturaAvaliacao, setEstruturaAvaliacao] = useState("Bimestral (4 fases)");
  const [faltasMax, setFaltasMax] = useState(25);
  const [tipoEnsino, setTipoEnsino] = useState("Base Nacional");

  useEffect(() => {
    if (open) {
      setNome(disciplina?.nome ?? "");
      setProfessores(disciplina?.professores ?? []);
      setProfessorSubstituto(disciplina?.professorSubstituto ?? "none");
      setEstruturaAvaliacao(disciplina?.estruturaAvaliacao ?? "Bimestral (4 fases)");
      setFaltasMax(disciplina?.faltasMax ?? 25);
      setTipoEnsino(disciplina?.tipoEnsino ?? "Base Nacional");
    }
  }, [open, disciplina]);

  const toggle = (arr: string[], v: string, set: (s: string[]) => void) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const substitutosDisponiveis = PROFESSORES_DISPONIVEIS.filter((p) => !professores.includes(p));

  const handleSave = () => {
    if (!nome) {
      toast({ title: "Selecione a disciplina", variant: "destructive" });
      return;
    }
    const anos = [turma.ano]; // turma já está vinculada a um único ano
    const sub = professorSubstituto === "none" ? undefined : professorSubstituto;
    if (isEdit && disciplina) {
      turmasStore.updateDisciplina(turma.id, {
        ...disciplina,
        nome,
        anos,
        professores,
        professorSubstituto: sub,
        estruturaAvaliacao,
        faltasMax,
        tipoEnsino,
      });
      toast({ title: "Disciplina atualizada" });
    } else {
      turmasStore.addDisciplina(turma.id, {
        id: newId(),
        nome,
        anos,
        professores,
        professorSubstituto: sub,
        estruturaAvaliacao,
        faltasMax,
        tipoEnsino,
        habilidades: [],
      });
      toast({ title: "Disciplina criada" });
    }
    onOpenChange(false);
  };

  const titulo = isEdit
    ? `Edição de ${disciplina?.nome} — ${turma.ano} ${turma.letra}`
    : `Nova disciplina — ${turma.ano} ${turma.letra}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{titulo}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Disciplina *</Label>
            {isEdit ? (
              <Input value={nome} readOnly className="font-medium text-edu-orange" />
            ) : (
              <Select value={nome} onValueChange={setNome}>
                <SelectTrigger><SelectValue placeholder="Selecione a disciplina" /></SelectTrigger>
                <SelectContent>
                  {DISCIPLINAS_PADRAO.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="space-y-2">
            <Label>Turma</Label>
            <Input value={`${turma.ano} ${turma.letra}`} readOnly />
            <p className="text-xs text-muted-foreground">
              Disciplina vinculada exclusivamente a esta turma.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Estrutura de avaliação (fase escolar)</Label>
            <Select value={estruturaAvaliacao} onValueChange={setEstruturaAvaliacao}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {ESTRUTURAS_AVALIACAO.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Professores titulares</Label>
            <ScrollArea className="h-32 border rounded-md p-2">
              {PROFESSORES_DISPONIVEIS.map((p) => (
                <label key={p} className="flex items-center gap-2 py-1 cursor-pointer text-sm">
                  <Checkbox
                    checked={professores.includes(p)}
                    onCheckedChange={() => {
                      toggle(professores, p, setProfessores);
                      if (professorSubstituto === p) setProfessorSubstituto("none");
                    }}
                  />
                  {p}
                </label>
              ))}
            </ScrollArea>
          </div>

          <div className="space-y-2">
            <Label>Professor substituto</Label>
            <Select value={professorSubstituto} onValueChange={setProfessorSubstituto}>
              <SelectTrigger><SelectValue placeholder="Selecione (opcional)" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">— Nenhum —</SelectItem>
                {substitutosDisponiveis.map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">Assumirá as aulas em ausências do titular.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>% Máximo de faltas</Label>
              <Input type="number" min={0} max={100} value={faltasMax}
                     onChange={(e) => setFaltasMax(Number(e.target.value))} />
              <p className="text-xs text-muted-foreground">Lei: máx. 25%</p>
            </div>
            <div className="space-y-2">
              <Label>Tipo de Ensino</Label>
              <Select value={tipoEnsino} onValueChange={setTipoEnsino}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TIPOS_ENSINO.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSave}>{isEdit ? "Salvar alterações" : "Salvar Disciplina"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
