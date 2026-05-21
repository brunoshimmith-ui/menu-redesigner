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
  PLANOS_ESTUDO,
  CALENDARIOS_DISPONIVEIS,
  COORDENADORES_DISPONIVEIS,
} from "@/lib/planosEstudo";
import { Turma, turmasStore, newId } from "@/lib/turmasStore";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  turma?: Turma | null;
}

export function NovaTurmaDialog({ open, onOpenChange, turma }: Props) {
  const [planoId, setPlanoId] = useState("");
  const [ano, setAno] = useState("");
  const [letra, setLetra] = useState("A");
  const [nivel, setNivel] = useState("");
  const [turno, setTurno] = useState("");
  const [codigo, setCodigo] = useState("");
  const [cargaHoraria, setCargaHoraria] = useState(0);
  const [calendarioId, setCalendarioId] = useState("");
  const [coordenadores, setCoordenadores] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      if (turma) {
        setPlanoId(turma.planoId);
        setAno(turma.ano);
        setLetra(turma.letra);
        setNivel(turma.nivel);
        setTurno(turma.turno);
        setCodigo(turma.codigo);
        setCargaHoraria(turma.cargaHoraria);
        setCalendarioId(turma.calendarioId);
        setCoordenadores(turma.coordenadores);
      } else {
        setPlanoId(""); setAno(""); setLetra("A"); setNivel(""); setTurno("");
        setCodigo(""); setCargaHoraria(0); setCalendarioId(""); setCoordenadores([]);
      }
    }
  }, [open, turma]);

  const onPlanoChange = (id: string) => {
    setPlanoId(id);
    const p = PLANOS_ESTUDO.find((x) => x.id === id);
    if (p) {
      setNivel(p.nivel);
      setTurno(p.turno);
      setCodigo(p.codigo);
      setCargaHoraria(p.cargaHoraria);
      if (!p.anos.includes(ano)) setAno(p.anos[0] ?? "");
    }
  };

  const plano = PLANOS_ESTUDO.find((p) => p.id === planoId);

  const toggleCoord = (c: string) =>
    setCoordenadores((cur) => (cur.includes(c) ? cur.filter((x) => x !== c) : [...cur, c]));

  const handleSave = () => {
    if (!planoId || !ano || !letra || !calendarioId) {
      toast({ title: "Preencha todos os campos obrigatórios", variant: "destructive" });
      return;
    }
    const novo: Turma = {
      id: turma?.id ?? newId(),
      planoId, ano, letra: letra.toUpperCase(), nivel, turno, codigo, cargaHoraria,
      calendarioId, coordenadores,
      disciplinas: turma?.disciplinas ?? [],
      matriculas: turma?.matriculas ?? [],
      edicao: turma?.edicao ?? "2026",
    };
    turmasStore.upsert(novo);
    toast({ title: turma ? "Turma atualizada" : "Turma criada com sucesso" });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{turma ? "Editar Turma" : "Criar Nova Turma"}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-2">
          <div className="col-span-2 space-y-2">
            <Label>Plano de Estudo *</Label>
            <Select value={planoId} onValueChange={onPlanoChange}>
              <SelectTrigger><SelectValue placeholder="Selecione o plano" /></SelectTrigger>
              <SelectContent>
                {PLANOS_ESTUDO.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.nome}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Ano *</Label>
            <Select value={ano} onValueChange={setAno} disabled={!plano}>
              <SelectTrigger><SelectValue placeholder="Ano" /></SelectTrigger>
              <SelectContent>
                {plano?.anos.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Turma (Letra) *</Label>
            <Input value={letra} onChange={(e) => setLetra(e.target.value)} maxLength={2} />
          </div>

          <div className="space-y-2">
            <Label>Nível</Label>
            <Input value={nivel} onChange={(e) => setNivel(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Turno</Label>
            <Select value={turno} onValueChange={setTurno}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Manhã", "Tarde", "Noite", "Integral"].map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Código</Label>
            <Input value={codigo} onChange={(e) => setCodigo(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Carga Horária Total</Label>
            <Input
              type="number"
              value={cargaHoraria}
              onChange={(e) => setCargaHoraria(Number(e.target.value))}
            />
          </div>

          <div className="col-span-2 space-y-2">
            <Label>Calendário Escolar *</Label>
            <Select value={calendarioId} onValueChange={setCalendarioId}>
              <SelectTrigger><SelectValue placeholder="Selecione o calendário" /></SelectTrigger>
              <SelectContent>
                {CALENDARIOS_DISPONIVEIS.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-2 space-y-2">
            <Label>Coordenadores</Label>
            <ScrollArea className="h-32 border rounded-md p-2">
              {COORDENADORES_DISPONIVEIS.map((c) => (
                <label key={c} className="flex items-center gap-2 py-1 cursor-pointer">
                  <Checkbox checked={coordenadores.includes(c)} onCheckedChange={() => toggleCoord(c)} />
                  <span className="text-sm">{c}</span>
                </label>
              ))}
            </ScrollArea>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Voltar</Button>
          <Button onClick={handleSave}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
