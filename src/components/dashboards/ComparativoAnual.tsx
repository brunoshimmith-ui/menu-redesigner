import { useMemo, useState } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
  BarChart, Bar,
} from "recharts";
import { cn } from "@/lib/utils";
import { Role } from "@/contexts/AuthContext";

// Dados simulados de comparação ano a ano por perfil.
// Estrutura: cada ponto representa um bimestre, com valores dos últimos 2 anos.
type Metric = { key: string; label: string; suffix?: string; series: { bim: string; "2025": number; "2026": number }[] };

const metricsByRole: Record<Role, Metric[]> = {
  suporte: [
    { key: "chamados", label: "Chamados resolvidos", series: [
      { bim: "1º Bim", "2025": 142, "2026": 168 },
      { bim: "2º Bim", "2025": 158, "2026": 181 },
      { bim: "3º Bim", "2025": 171, "2026": 195 },
      { bim: "4º Bim", "2025": 165, "2026": 188 },
    ]},
    { key: "sla", label: "SLA médio (h)", suffix: "h", series: [
      { bim: "1º Bim", "2025": 12, "2026": 8 },
      { bim: "2º Bim", "2025": 10, "2026": 7 },
      { bim: "3º Bim", "2025": 11, "2026": 6 },
      { bim: "4º Bim", "2025": 9, "2026": 5 },
    ]},
  ],
  professor: [
    { key: "freq", label: "Frequência média (%)", suffix: "%", series: [
      { bim: "1º Bim", "2025": 89, "2026": 94 },
      { bim: "2º Bim", "2025": 91, "2026": 95 },
      { bim: "3º Bim", "2025": 88, "2026": 93 },
      { bim: "4º Bim", "2025": 90, "2026": 95 },
    ]},
    { key: "media", label: "Média geral da turma", series: [
      { bim: "1º Bim", "2025": 7.2, "2026": 7.9 },
      { bim: "2º Bim", "2025": 7.4, "2026": 8.1 },
      { bim: "3º Bim", "2025": 7.1, "2026": 7.8 },
      { bim: "4º Bim", "2025": 7.5, "2026": 8.2 },
    ]},
  ],
  coordenacao: [
    { key: "aprov", label: "Aprovação (%)", suffix: "%", series: [
      { bim: "1º Bim", "2025": 84, "2026": 89 },
      { bim: "2º Bim", "2025": 86, "2026": 91 },
      { bim: "3º Bim", "2025": 85, "2026": 92 },
      { bim: "4º Bim", "2025": 87, "2026": 94 },
    ]},
    { key: "pend", label: "Pendências pedagógicas", series: [
      { bim: "1º Bim", "2025": 18, "2026": 11 },
      { bim: "2º Bim", "2025": 15, "2026": 9 },
      { bim: "3º Bim", "2025": 16, "2026": 7 },
      { bim: "4º Bim", "2025": 14, "2026": 7 },
    ]},
  ],
  direcao: [
    { key: "matriculas", label: "Matrículas ativas", series: [
      { bim: "1º Bim", "2025": 502, "2026": 548 },
      { bim: "2º Bim", "2025": 498, "2026": 552 },
      { bim: "3º Bim", "2025": 495, "2026": 549 },
      { bim: "4º Bim", "2025": 492, "2026": 546 },
    ]},
    { key: "evasao", label: "Evasão (%)", suffix: "%", series: [
      { bim: "1º Bim", "2025": 3.2, "2026": 1.8 },
      { bim: "2º Bim", "2025": 2.9, "2026": 1.6 },
      { bim: "3º Bim", "2025": 3.4, "2026": 1.9 },
      { bim: "4º Bim", "2025": 3.1, "2026": 1.5 },
    ]},
  ],
  administracao: [
    { key: "trans", label: "Transferências processadas", series: [
      { bim: "1º Bim", "2025": 22, "2026": 31 },
      { bim: "2º Bim", "2025": 28, "2026": 36 },
      { bim: "3º Bim", "2025": 25, "2026": 33 },
      { bim: "4º Bim", "2025": 30, "2026": 41 },
    ]},
    { key: "docs", label: "Documentos emitidos", series: [
      { bim: "1º Bim", "2025": 188, "2026": 245 },
      { bim: "2º Bim", "2025": 201, "2026": 268 },
      { bim: "3º Bim", "2025": 195, "2026": 252 },
      { bim: "4º Bim", "2025": 220, "2026": 289 },
    ]},
  ],
  aluno: [
    { key: "minhamedia", label: "Minha média", series: [
      { bim: "1º Bim", "2025": 7.0, "2026": 8.1 },
      { bim: "2º Bim", "2025": 7.3, "2026": 8.4 },
      { bim: "3º Bim", "2025": 7.1, "2026": 8.2 },
      { bim: "4º Bim", "2025": 7.5, "2026": 8.6 },
    ]},
    { key: "minhafreq", label: "Minha frequência (%)", suffix: "%", series: [
      { bim: "1º Bim", "2025": 92, "2026": 96 },
      { bim: "2º Bim", "2025": 94, "2026": 97 },
      { bim: "3º Bim", "2025": 91, "2026": 95 },
      { bim: "4º Bim", "2025": 93, "2026": 98 },
    ]},
  ],
};

export function ComparativoAnual({ role }: { role: Role }) {
  const metrics = metricsByRole[role] || [];
  const [active, setActive] = useState(metrics[0]?.key);
  const metric = useMemo(() => metrics.find((m) => m.key === active) || metrics[0], [metrics, active]);

  if (!metric) return null;

  const last2025 = metric.series.reduce((a, p) => a + p["2025"], 0) / metric.series.length;
  const last2026 = metric.series.reduce((a, p) => a + p["2026"], 0) / metric.series.length;
  const delta = last2026 - last2025;
  const pct = last2025 ? ((delta / last2025) * 100).toFixed(1) : "0";
  // Para métricas em que "menor é melhor" (SLA, evasão, pendências) inverter sinal
  const lowerIsBetter = ["sla", "evasao", "pend"].includes(metric.key);
  const isPositive = lowerIsBetter ? delta < 0 : delta > 0;
  const Icon = delta === 0 ? Minus : isPositive ? TrendingUp : TrendingDown;
  const useBar = metric.key === "chamados" || metric.key === "trans" || metric.key === "docs" || metric.key === "matriculas";

  return (
    <div className="bg-card rounded-3xl border border-border p-6 shadow-sm">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Comparativo anual</h2>
          <p className="text-xs text-muted-foreground mt-0.5">2025 x 2026 — evolução por bimestre</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {metrics.map((m) => (
            <button
              key={m.key}
              onClick={() => setActive(m.key)}
              className={cn(
                "text-xs px-3 py-1.5 rounded-full border transition-colors",
                m.key === metric.key
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted/30 hover:bg-muted/50 border-border"
              )}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-baseline gap-3 mb-3">
        <span className="text-3xl font-bold">
          {last2026.toFixed(metric.suffix === "%" ? 1 : metric.series[0]["2026"] < 20 ? 1 : 0)}
          {metric.suffix ?? ""}
        </span>
        <span className={cn("inline-flex items-center gap-1 text-sm font-semibold", isPositive ? "text-edu-green" : delta === 0 ? "text-muted-foreground" : "text-edu-coral")}>
          <Icon className="w-4 h-4" />
          {Math.abs(parseFloat(pct))}% {isPositive ? "melhor" : delta === 0 ? "estável" : "pior"} que 2025
        </span>
      </div>

      <div className="h-56 w-full">
        <ResponsiveContainer>
          {useBar ? (
            <BarChart data={metric.series}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="bim" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="2025" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="2026" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          ) : (
            <LineChart data={metric.series}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="bim" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="2025" stroke="hsl(var(--muted-foreground))" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="2026" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 4 }} />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      <p className="text-[11px] text-muted-foreground mt-3">
        Comparativo entre o mesmo período do ano anterior. Valores em destaque mostram a variação acumulada.
      </p>
    </div>
  );
}
