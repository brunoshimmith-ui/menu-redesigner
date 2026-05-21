import { useState } from "react";
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
  PLANOS_ESTUDO,
} from "@/lib/planosEstudo";
import { Turma, turmasStore, newId } from "@/lib/turmasStore";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  turma: Turma;
}

export function DisciplinaDialog({ open, onOpenChange, turma }: Props) {
  const [nome, setNome] = useState("");
  const [anos, setAnos] = useState<string[]>([]);
  const [professores, setProfessores] = useState<string[]>([]);
  const [faltasMax, setFaltasMax] = useState(25);
  const [tipoEnsino, setTipoEnsino] = useState("Base Nacional");

  const plano = PLANOS_ESTUDO.find((p) => p.id === turma.planoId);
  const anosDisponiveis = plano?.anos ?? [];

  const toggle = (arr: string[], v: string, set: (s: string[]) => void) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const handleSave = () => {
    if (!nome) {
      toast({ title: "Selecione a disciplina", variant: "destructive" });
      return;
    }
    turmasStore.addDisciplina(turma.id, {
      id: newId(),
      nome, anos, professores, faltasMax, tipoEnsino,
      habilidades: [],
    });
    toast({ title: "Disciplina criada" });
    onOpenChange(false);
    setNome(""); setAnos([]); setProfessores([]); setFaltasMax(25); setTipoEnsino("Base Nacional");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Disciplina — {turma.ano} {turma.letra}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Disciplina *</Label>
            <Select value={nome} onValueChange={setNome}>
              <SelectTrigger><SelectValue placeholder="Selecione a disciplina" /></SelectTrigger>
              <SelectContent>
                {DISCIPLINAS_PADRAO.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Anos / Fase escolar (2026)</Label>
            <div className="grid grid-cols-3 gap-2 border rounded-md p-2">
              {anosDisponiveis.map((a) => (
                <label key={a} className="flex items-center gap-2 cursor-pointer text-sm">
                  <Checkbox checked={anos.includes(a)} onCheckedChange={() => toggle(anos, a, setAnos)} />
                  {a}
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Professores</Label>
            <ScrollArea className="h-32 border rounded-md p-2">
              {PROFESSORES_DISPONIVEIS.map((p) => (
                <label key={p} className="flex items-center gap-2 py-1 cursor-pointer text-sm">
                  <Checkbox checked={professores.includes(p)} onCheckedChange={() => toggle(professores, p, setProfessores)} />
                  {p}
                </label>
              ))}
            </ScrollArea>
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
          <Button onClick={handleSave}>Salvar Disciplina</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
