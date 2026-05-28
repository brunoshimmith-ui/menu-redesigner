import { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const SITUACOES = [
  { value: "diario", label: "Problema no Diário (notas, frequência, conteúdo)" },
  { value: "login", label: "Não consigo acessar / Login" },
  { value: "turmas", label: "Cadastro de Turmas / Disciplinas" },
  { value: "alunos", label: "Cadastro de Alunos" },
  { value: "documentos", label: "Emissão de Documentos / Boletim" },
  { value: "calendario", label: "Calendário / Avaliações" },
  { value: "comunicacao", label: "Avisos / Notificações" },
  { value: "outro", label: "Outro" },
];

const URGENCIAS = [
  { value: "baixa", label: "Baixa — não bloqueia o trabalho" },
  { value: "media", label: "Média — preciso resolver em breve" },
  { value: "alta", label: "Alta — está bloqueando minhas atividades" },
];

interface Props {
  trigger: React.ReactNode;
}

export function SuporteChamadoDialog({ trigger }: Props) {
  const [open, setOpen] = useState(false);
  const [situacao, setSituacao] = useState("");
  const [urgencia, setUrgencia] = useState("media");
  const [titulo, setTitulo] = useState("");
  const [observacao, setObservacao] = useState("");

  const handleSend = () => {
    if (!situacao || !titulo || !observacao) {
      toast({
        title: "Preencha os campos obrigatórios",
        description: "Selecione a situação, informe um título e descreva o ocorrido.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Chamado enviado!",
      description: "Nossa equipe de suporte entrará em contato em breve.",
    });
    setSituacao("");
    setUrgencia("media");
    setTitulo("");
    setObservacao("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Abrir chamado de suporte</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 pt-2">
          <div className="space-y-1.5">
            <Label className="text-xs">Em qual situação ocorreu o problema? *</Label>
            <Select value={situacao} onValueChange={setSituacao}>
              <SelectTrigger><SelectValue placeholder="Selecione a área" /></SelectTrigger>
              <SelectContent>
                {SITUACOES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Urgência</Label>
            <Select value={urgencia} onValueChange={setUrgencia}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {URGENCIAS.map((u) => (
                  <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Título resumido *</Label>
            <Input
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex: Não consigo lançar nota da AV2"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Descreva o que aconteceu *</Label>
            <Textarea
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              placeholder="Conte com seus detalhes: o que estava fazendo, qual a mensagem de erro, em qual tela..."
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handleSend} className="gap-2">
            <Send className="w-4 h-4" /> Enviar chamado
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
