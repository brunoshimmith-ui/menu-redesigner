import { useEffect, useState } from "react";
import { Lightbulb, ChevronLeft, ChevronRight } from "lucide-react";
import { Role } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const dicas: Record<Role, string[]> = {
  suporte: [
    "Acompanhe os chamados pendentes diariamente para manter o suporte ágil.",
    "Mantenha a base de conhecimento sempre atualizada para reduzir dúvidas recorrentes.",
    "Verifique semanalmente os logs de acesso e segurança do sistema.",
  ],
  professor: [
    "Mantenha os conteúdos diários sempre preenchidos no diário escolar.",
    "Registre a frequência todos os dias para manter dados consistentes.",
    "Lance as notas dentro do prazo do bimestre para evitar atrasos.",
    "Planeje as avaliações com antecedência e cadastre no calendário.",
  ],
  coordenacao: [
    "Um sistema organizado começa com check-ins semanais com os professores.",
    "Acompanhe os indicadores de frequência por turma e atue preventivamente.",
    "Padronize avisos e comunicados para toda a equipe pedagógica.",
  ],
  direcao: [
    "Use os relatórios consolidados para reuniões estratégicas mensais.",
    "Mantenha um canal aberto com a coordenação e a administração.",
    "Acompanhe a evolução dos bimestres comparando dados entre turmas.",
  ],
  administracao: [
    "Verifique diariamente as transferências em aberto.",
    "Mantenha a documentação dos alunos sempre digitalizada e arquivada.",
    "Audite os cadastros de usuários ativos uma vez por mês.",
  ],
  aluno: [
    "Estudar todos os dias, mesmo que pouco, fortalece a memória.",
    "Use o calendário do sistema para se preparar para as avaliações.",
    "Faça anotações em sala — elas aceleram a revisão em casa.",
    "Procure referências extras: vídeos, livros e podcasts educacionais.",
  ],
};

export function DicaDoDia({ role }: { role: Role }) {
  const items = dicas[role] || [];
  const [i, setI] = useState(0);
  useEffect(() => {
    if (items.length === 0) return;
    const t = setInterval(() => setI((s) => (s + 1) % items.length), 6000);
    return () => clearInterval(t);
  }, [items.length]);

  return (
    <div className="bg-edu-purple-light border border-edu-purple/20 rounded-xl p-5 relative overflow-hidden">
      <div className="flex items-center gap-3 mb-2">
        <Lightbulb className="w-5 h-5 text-edu-purple" />
        <p className="text-base font-bold text-edu-purple">Dica do dia</p>
      </div>
      <div className="relative h-12">
        {items.map((d, idx) => (
          <p key={idx} className={cn("absolute inset-0 text-sm text-foreground/80 transition-opacity duration-500", idx === i ? "opacity-100" : "opacity-0")}>
            {d}
          </p>
        ))}
      </div>
      <div className="flex items-center justify-between mt-3">
        <button onClick={() => setI((s) => (s - 1 + items.length) % items.length)} className="p-1 hover:bg-white/40 rounded">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex gap-1.5">
          {items.map((_, idx) => (
            <span key={idx} className={cn("h-1.5 rounded-full transition-all", idx === i ? "w-6 bg-edu-purple" : "w-1.5 bg-edu-purple/30")} />
          ))}
        </div>
        <button onClick={() => setI((s) => (s + 1) % items.length)} className="p-1 hover:bg-white/40 rounded">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
