import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { NotebookPen, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getAnotacoes, saveAnotacao, deleteAnotacao, Anotacao } from "@/lib/store";
import { toast } from "sonner";

export function AnotacoesProfessor() {
  const { user } = useAuth();
  const u = user?.username || "anon";
  const [items, setItems] = useState<Anotacao[]>([]);
  const [text, setText] = useState("");

  useEffect(() => setItems(getAnotacoes(u)), [u]);

  const handleAdd = () => {
    if (!text.trim()) return;
    const a: Anotacao = { id: crypto.randomUUID(), date: new Date().toISOString(), text: text.trim() };
    saveAnotacao(u, a);
    setItems(getAnotacoes(u));
    setText("");
    toast.success("Anotação salva!");
  };

  const handleDel = (id: string) => {
    deleteAnotacao(u, id);
    setItems(getAnotacoes(u));
  };

  return (
    <div className="bg-card rounded-3xl border border-border p-6 shadow-sm">
      <h3 className="text-xl font-bold text-foreground flex items-center gap-2 mb-4">
        <NotebookPen className="w-5 h-5 text-edu-blue" /> Rotina diária / Anotações
      </h3>
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        placeholder="Planeje seu dia: aulas, atividades, observações..."
      />
      <div className="flex justify-end mt-2">
        <Button size="sm" onClick={handleAdd}>Salvar anotação</Button>
      </div>

      <div className="mt-4 space-y-2 max-h-64 overflow-auto">
        {items.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-4">Nenhuma anotação ainda.</p>
        ) : items.map((a) => (
          <div key={a.id} className="flex items-start gap-2 p-3 rounded-md bg-muted/40">
            <Badge variant="secondary" className="text-[10px] mt-0.5">
              {new Date(a.date).toLocaleDateString("pt-BR")} {new Date(a.date).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
            </Badge>
            <p className="text-xs flex-1 whitespace-pre-wrap">{a.text}</p>
            <button onClick={() => handleDel(a.id)} className="text-muted-foreground hover:text-destructive">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
