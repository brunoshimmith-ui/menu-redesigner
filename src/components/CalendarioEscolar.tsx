import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { holidays, optionalDays, bimestres, dateKey, toDate } from "@/lib/calendario";
import { getAvaliacoes } from "@/lib/store";

interface Props {
  /** Optional extra dates to mark (e.g. meetings) */
  extraDates?: { dates: Date[]; className: string; legend?: string }[];
  /** Filter avaliações by turma (for alunos) */
  filterTurma?: string;
  /** Filter avaliações by createdBy (for professor) */
  filterCreatedBy?: string;
  onSelect?: (d?: Date) => void;
  selected?: Date;
}

export function CalendarioEscolar({ extraDates = [], filterTurma, filterCreatedBy, onSelect, selected }: Props) {
  const [internal, setInternal] = useState<Date | undefined>(new Date());
  const date = selected ?? internal;
  const setDate = (d?: Date) => {
    if (!selected) setInternal(d);
    onSelect?.(d);
  };

  const holidayDates = holidays.map((h) => toDate(h.date));
  const optionalDates = optionalDays.map((o) => toDate(o.date));
  const bimestreStartDates = bimestres.map((b) => toDate(b.inicio));
  const bimestreEndDates = bimestres.map((b) => toDate(b.fim));

  const allAvals = getAvaliacoes().filter((a) => {
    if (filterTurma) return a.turma === filterTurma;
    if (filterCreatedBy) return a.createdBy === filterCreatedBy;
    return true;
  });
  const avalDates = allAvals.map((a) => toDate(a.date));

  const k = dateKey(date);
  const holidayForDay = holidays.find((h) => h.date === k);
  const optionalForDay = optionalDays.find((o) => o.date === k);
  const bimestreStart = bimestres.find((b) => b.inicio === k);
  const bimestreEnd = bimestres.find((b) => b.fim === k);
  const avalsForDay = allAvals.filter((a) => a.date === k);

  const modifiers: Record<string, Date[]> = {
    holiday: holidayDates,
    optional: optionalDates,
    bimestreStart: bimestreStartDates,
    bimestreEnd: bimestreEndDates,
    avaliacao: avalDates,
  };
  const modifiersClassNames: Record<string, string> = {
    holiday: "bg-edu-coral-light dark:bg-edu-coral/20 text-edu-coral dark:text-edu-coral-foreground font-bold",
    optional: "bg-edu-orange-light dark:bg-edu-orange/20 text-edu-orange dark:text-edu-orange-foreground font-semibold",
    bimestreStart: "ring-2 ring-edu-green",
    bimestreEnd: "ring-2 ring-edu-blue",
    avaliacao: "bg-edu-purple-light dark:bg-edu-purple/20 text-edu-purple dark:text-edu-purple-foreground font-bold",
  };
  extraDates.forEach((e, i) => {
    modifiers[`extra${i}`] = e.dates;
    modifiersClassNames[`extra${i}`] = e.className;
  });

  return (
    <div>
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        modifiers={modifiers}
        modifiersClassNames={modifiersClassNames}
        className="rounded-md pointer-events-auto"
      />

      <div className="mt-3 flex flex-wrap gap-2 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-edu-coral-light border border-edu-coral" />Feriado</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-edu-orange-light border border-edu-orange" />Facultativo</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm ring-2 ring-edu-green" />Início bim.</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm ring-2 ring-edu-blue" />Fim bim.</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-edu-purple-light border border-edu-purple" />Avaliação</span>
        {extraDates.map((e, i) => e.legend && (
          <span key={i} className="flex items-center gap-1"><span className={`w-2.5 h-2.5 rounded-sm ${e.className}`} />{e.legend}</span>
        ))}
      </div>

      <div className="mt-4 space-y-2">
        {holidayForDay && (
          <div className="flex items-start gap-2 p-2 rounded-md bg-edu-coral-light dark:bg-edu-coral/15">
            <Badge className="bg-edu-coral text-white border-0 text-[10px]">Feriado</Badge>
            <p className="text-xs font-medium flex-1">{holidayForDay.name}</p>
          </div>
        )}
        {optionalForDay && (
          <div className="flex items-start gap-2 p-2 rounded-md bg-edu-orange-light dark:bg-edu-orange/15">
            <Badge className="bg-edu-orange text-white border-0 text-[10px]">Facultativo</Badge>
            <p className="text-xs font-medium flex-1">{optionalForDay.name}</p>
          </div>
        )}
        {bimestreStart && (
          <div className="flex items-start gap-2 p-2 rounded-md bg-edu-green-light dark:bg-edu-green/15">
            <Badge className="bg-edu-green text-white border-0 text-[10px]">Bimestre</Badge>
            <p className="text-xs font-medium flex-1">Início do {bimestreStart.n}º bimestre</p>
          </div>
        )}
        {bimestreEnd && (
          <div className="flex items-start gap-2 p-2 rounded-md bg-edu-blue-light dark:bg-edu-blue/15">
            <Badge className="bg-edu-blue text-white border-0 text-[10px]">Bimestre</Badge>
            <p className="text-xs font-medium flex-1">Fim do {bimestreEnd.n}º bimestre</p>
          </div>
        )}
        {avalsForDay.map((a) => (
          <div key={a.id} className="flex items-start gap-2 p-2 rounded-md bg-edu-purple-light dark:bg-edu-purple/15">
            <Badge className="bg-edu-purple text-white border-0 text-[10px]">Avaliação</Badge>
            <div className="flex-1">
              <p className="text-xs font-medium">{a.title}</p>
              <p className="text-[10px] text-muted-foreground">{a.disciplina} • {a.turma}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
