import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus, Mail, MessageCircle, Cog } from "lucide-react";
import { toast } from "sonner";

export type NewUserRole =
  | "Aluno"
  | "Professor"
  | "Diretor"
  | "Coordenador"
  | "Gestor"
  | "Administrativo"
  | "Suporte";

const ROLES: NewUserRole[] = [
  "Aluno",
  "Professor",
  "Diretor",
  "Coordenador",
  "Gestor",
  "Administrativo",
  "Suporte",
];

interface Props {
  onCreate?: (data: { nome: string; role: NewUserRole; via: string; email?: string; telefone?: string }) => void;
}

export function NewUserDialog({ onCreate }: Props) {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<NewUserRole>("Professor");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");

  const isAluno = role === "Aluno";

  const handleSubmit = (via: "email" | "whatsapp" | "sistema") => {
    if (!nome.trim()) {
      toast.error("Informe o nome completo.");
      return;
    }
    if (via === "email" && !email.trim()) {
      toast.error("Informe o e-mail.");
      return;
    }
    if (via === "whatsapp" && !telefone.trim()) {
      toast.error("Informe o número de telefone.");
      return;
    }
    onCreate?.({ nome, role, via, email, telefone });
    toast.success(`Usuário ${nome} criado com sucesso via ${via}.`);
    setNome("");
    setEmail("");
    setTelefone("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <UserPlus className="w-4 h-4" /> Adicionar usuário
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Adicionar novo usuário</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          <Label>Perfil do usuário</Label>
          <Select value={role} onValueChange={(v) => setRole(v as NewUserRole)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {ROLES.map((r) => (<SelectItem key={r} value={r}>{r}</SelectItem>))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            {isAluno
              ? "Alunos são criados diretamente pelo sistema."
              : "Funcionários podem ser convidados por e-mail, WhatsApp ou criados pelo sistema."}
          </p>
        </div>

        {isAluno ? (
          <div className="space-y-3 pt-2">
            <div>
              <Label>Nome completo do aluno</Label>
              <Input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Maria Silva" />
            </div>
            <DialogFooter>
              <Button onClick={() => handleSubmit("sistema")} className="gap-2">
                <Cog className="w-4 h-4" /> Criar pelo sistema
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <Tabs defaultValue="email" className="pt-2">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="email" className="gap-1"><Mail className="w-3.5 h-3.5" /> E-mail</TabsTrigger>
              <TabsTrigger value="whatsapp" className="gap-1"><MessageCircle className="w-3.5 h-3.5" /> WhatsApp</TabsTrigger>
              <TabsTrigger value="sistema" className="gap-1"><Cog className="w-3.5 h-3.5" /> Sistema</TabsTrigger>
            </TabsList>

            <TabsContent value="email" className="space-y-3">
              <div><Label>Nome completo</Label><Input value={nome} onChange={(e) => setNome(e.target.value)} /></div>
              <div><Label>E-mail</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="usuario@semei.edu" /></div>
              <DialogFooter><Button onClick={() => handleSubmit("email")}>Enviar convite por e-mail</Button></DialogFooter>
            </TabsContent>

            <TabsContent value="whatsapp" className="space-y-3">
              <div><Label>Nome completo</Label><Input value={nome} onChange={(e) => setNome(e.target.value)} /></div>
              <div><Label>Telefone (WhatsApp)</Label><Input value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="(92) 99999-9999" /></div>
              <DialogFooter><Button onClick={() => handleSubmit("whatsapp")}>Enviar convite por WhatsApp</Button></DialogFooter>
            </TabsContent>

            <TabsContent value="sistema" className="space-y-3">
              <div><Label>Nome completo</Label><Input value={nome} onChange={(e) => setNome(e.target.value)} /></div>
              <div><Label>E-mail (opcional)</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
              <DialogFooter><Button onClick={() => handleSubmit("sistema")}>Criar pelo sistema</Button></DialogFooter>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
