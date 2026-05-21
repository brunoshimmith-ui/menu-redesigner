import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { BNCC_HABILIDADES } from "@/lib/bncc";
import { Turma, turmasStore } from "@/lib/turmasStore";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  turma: Turma;
}

export function HabilidadesDialog({ open, onOpenChange, turma }: Props) {
  const [disciplinaId, setDisciplinaId] = useState("");
  const disciplina = turma.disciplinas.find((d) => d.id === disciplinaId);
  const [marcadas, setMarcadas] = useState<string[]>([]);

  const onSelect = (id: string) => {
    setDisciplinaId(id);
    const d = turma.disciplinas.find((x) => x.id === id);
    setMarcadas(d?.habilidades ?? []);
  };

  const habilidades = disciplina ? BNCC_HABILIDADES[disciplina.nome] ?? [] : [];

  // Agrupar por ano (extraído do código tipo EF05MA → 5º Ano)
  const grupos = habilidades.reduce<Record<string, typeof habilidades>>((acc, h) => {
    const m = h.codigo.match(/EF(\d{2})/);
    const ano = m ? `${parseInt(m[1])}º Ano` : "Geral";
    (acc[ano] ||= []).push(h);
    return acc;
  }, {});

  const toggle = (c: string) =>
    setMarcadas((cur) => (cur.includes(c) ? cur.filter((x) => x !== c) : [...cur, c]));

  const salvar = () => {
    if (!disciplina) return;
    turmasStore.updateDisciplina(turma.id, { ...disciplina, habilidades: marcadas });
    toast({ title: "Habilidades atualizadas" });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Habilidades BNCC — {turma.ano} {turma.letra}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Disciplina</Label>
            <Select value={disciplinaId} onValueChange={onSelect}>
              <SelectTrigger><SelectValue placeholder="Selecione a disciplina" /></SelectTrigger>
              <SelectContent>
                {turma.disciplinas.map((d) => (
                  <SelectItem key={d.id} value={d.id}>{d.nome}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {disciplina && (
            <ScrollArea className="h-96 border rounded-md p-3">
              {Object.keys(grupos).length === 0 && (
                <p className="text-sm text-muted-foreground">Nenhuma habilidade cadastrada para esta disciplina.</p>
              )}
              {Object.entries(grupos).map(([ano, hs]) => (
                <div key={ano} className="mb-4">
                  <h4 className="font-semibold text-sm mb-2 text-primary">{ano}</h4>
                  <div className="space-y-2">
                    {hs.map((h) => (
                      <label key={h.codigo} className="flex items-start gap-2 cursor-pointer text-sm">
                        <Checkbox
                          checked={marcadas.includes(h.codigo)}
                          onCheckedChange={() => toggle(h.codigo)}
                          className="mt-0.5"
                        />
                        <span>
                          <span className="font-mono text-xs text-muted-foreground">{h.codigo}</span> — {h.descricao}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </ScrollArea>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Fechar</Button>
          <Button onClick={salvar} disabled={!disciplina}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
