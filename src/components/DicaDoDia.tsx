import { useEffect, useState } from "react";
import { Lightbulb, ChevronLeft, ChevronRight, BookOpen, ClipboardList, Users, TrendingUp, Award, Target, Calendar, FileCheck } from "lucide-react";
import { Role } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface Dica {
  icon: typeof Lightbulb;
  title: string;
  text: string;
}

const dicasPorPerfil: Record<Role, Dica[]> = {
  suporte: [
    { icon: ClipboardList, title: "Chamados em dia", text: "Responda os chamados pendentes em até 24h para manter a confiança da rede." },
    { icon: BookOpen, title: "Base de conhecimento", text: "Documente cada solução nova — isso reduz dúvidas recorrentes da equipe." },
    { icon: FileCheck, title: "Auditoria de acessos", text: "Revise semanalmente os logs de acesso para identificar comportamentos atípicos." },
    { icon: Users, title: "Treinamento contínuo", text: "Promova micro-treinamentos com coordenadores e diretores a cada novo recurso." },
  ],
  professor: [
    { icon: BookOpen, title: "Conteúdo do dia", text: "Mantenha o diário de classe preenchido todos os dias — conteúdo, frequência e observações." },
    { icon: ClipboardList, title: "Frequência diária", text: "Lance a frequência logo no início da aula. Dados em tempo real ajudam coordenação e família." },
    { icon: Award, title: "Notas em dia", text: "Lance as notas dentro do prazo do bimestre. Atrasos impactam o fechamento de toda a turma." },
    { icon: Calendar, title: "Avaliações planejadas", text: "Cadastre suas avaliações no calendário — os alunos são notificados automaticamente." },
    { icon: TrendingUp, title: "Acompanhe sua turma", text: "Use os relatórios para identificar alunos com baixa frequência ou notas em queda." },
    { icon: Target, title: "Plano de aula", text: "Use as anotações diárias para registrar sua rotina e replanejar a semana." },
  ],
  coordenacao: [
    { icon: Target, title: "Organização é tudo", text: "Um perfil organizado começa com check-ins semanais — agende reuniões curtas com professores." },
    { icon: TrendingUp, title: "Indicadores por turma", text: "Acompanhe frequência e médias por turma para atuar antes que o problema cresça." },
    { icon: ClipboardList, title: "Padronize comunicados", text: "Use os avisos importantes para alinhar a equipe pedagógica em um único canal." },
    { icon: Users, title: "Encaminhamentos", text: "Acompanhe os estudos de caso de educação especial junto à equipe AEE." },
    { icon: Calendar, title: "Calendário do bimestre", text: "Verifique início/fim dos bimestres e organize avaliações e conselhos com antecedência." },
  ],
  direcao: [
    { icon: BookOpen, title: "Visão estratégica", text: "Reuna-se mensalmente com a coordenação usando os relatórios consolidados como base." },
    { icon: TrendingUp, title: "Evolução por bimestre", text: "Compare indicadores entre bimestres e turmas para identificar tendências da unidade." },
    { icon: Users, title: "Liderança presente", text: "Mantenha canal aberto com coordenação, administração e suporte — decisões compartilhadas." },
    { icon: Award, title: "Reconheça resultados", text: "Use a Página Pública para destacar conquistas de alunos e professores da escola." },
    { icon: ClipboardList, title: "Conselho de classe", text: "Garanta que ATAs e relatórios estejam fechados antes do conselho de cada bimestre." },
  ],
  administracao: [
    { icon: ClipboardList, title: "Transferências em dia", text: "Verifique diariamente as transferências em aberto — não deixe passar de 48h." },
    { icon: FileCheck, title: "Documentação digital", text: "Mantenha históricos, declarações e atestados digitalizados no sistema." },
    { icon: Users, title: "Cadastros atualizados", text: "Audite os cadastros de usuários ativos uma vez por mês para manter a base limpa." },
    { icon: Calendar, title: "Agenda da secretaria", text: "Use o calendário para programar fechamentos administrativos do bimestre." },
  ],
  aluno: [
    { icon: BookOpen, title: "Estude um pouco todo dia", text: "30 minutos diários valem mais que 5 horas no fim de semana. Constância é tudo." },
    { icon: Calendar, title: "Use o calendário", text: "Confira o calendário para se preparar com antecedência para cada avaliação." },
    { icon: ClipboardList, title: "Anote em aula", text: "Anotações em sala aceleram a revisão em casa e ajudam a fixar o conteúdo." },
    { icon: TrendingUp, title: "Acompanhe suas notas", text: "Veja seu boletim no painel — saber onde precisa melhorar é o primeiro passo." },
    { icon: Award, title: "Frequência conta", text: "Estar presente é metade do aprendizado. Frequência alta = melhores resultados." },
    { icon: Target, title: "Referências extras", text: "Procure vídeos no Khan Academy, livros da biblioteca e podcasts educacionais." },
    { icon: Users, title: "Aprenda em grupo", text: "Estudar com colegas ajuda a tirar dúvidas e ver o conteúdo de outros ângulos." },
  ],
};

export function DicaDoDia({ role }: { role: Role }) {
  const items = dicasPorPerfil[role] || [];
  const [i, setI] = useState(0);

  useEffect(() => {
    if (items.length === 0) return;
    const t = setInterval(() => setI((s) => (s + 1) % items.length), 6000);
    return () => clearInterval(t);
  }, [items.length]);

  if (items.length === 0) return null;
  const current = items[i];
  const Icon = current.icon;

  return (
    <div className="bg-gradient-to-br from-edu-purple-light via-edu-purple-light to-edu-blue-light dark:from-edu-purple/20 dark:via-edu-purple/15 dark:to-edu-blue/20 border border-edu-purple/20 dark:border-edu-purple/40 rounded-3xl p-6 relative overflow-hidden shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-edu-purple dark:text-edu-purple-light" />
        <p className="text-sm font-bold text-edu-purple dark:text-edu-purple-light uppercase tracking-wider">Dica do dia</p>
      </div>

      <div className="relative min-h-[110px]">
        {items.map((d, idx) => {
          const DIcon = d.icon;
          return (
            <div
              key={idx}
              className={cn(
                "absolute inset-0 transition-all duration-500 flex items-start gap-4",
                idx === i ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4 pointer-events-none"
              )}
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/70 text-edu-purple flex-shrink-0">
                <DIcon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className="text-base font-bold text-foreground mb-1">{d.title}</p>
                <p className="text-sm text-foreground/75 leading-relaxed">{d.text}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between mt-4">
        <button
          onClick={() => setI((s) => (s - 1 + items.length) % items.length)}
          className="p-1.5 hover:bg-white/50 rounded-full transition-colors"
          aria-label="Anterior"
        >
          <ChevronLeft className="w-4 h-4 text-edu-purple" />
        </button>
        <div className="flex gap-1.5">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                idx === i ? "w-6 bg-edu-purple" : "w-1.5 bg-edu-purple/30 hover:bg-edu-purple/50"
              )}
              aria-label={`Dica ${idx + 1}`}
            />
          ))}
        </div>
        <button
          onClick={() => setI((s) => (s + 1) % items.length)}
          className="p-1.5 hover:bg-white/50 rounded-full transition-colors"
          aria-label="Próxima"
        >
          <ChevronRight className="w-4 h-4 text-edu-purple" />
        </button>
      </div>
    </div>
  );
}
