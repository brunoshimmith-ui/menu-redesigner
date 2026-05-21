import { useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { HeaderWithNotifications } from "@/components/HeaderWithNotifications";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search, Users, Edit, BookOpen, Plus, ChevronDown, ChevronRight,
  Settings, Sparkles, Trash2,
} from "lucide-react";
import { useTurmas, Turma, turmasStore } from "@/lib/turmasStore";
import { NovaTurmaDialog } from "@/components/turmas/NovaTurmaDialog";
import { DisciplinaDialog } from "@/components/turmas/DisciplinaDialog";
import { HabilidadesDialog } from "@/components/turmas/HabilidadesDialog";
import { ConfigTurmaDialog } from "@/components/turmas/ConfigTurmaDialog";
import { toast } from "@/hooks/use-toast";

const Turmas = () => {
  const turmas = useTurmas();
  const [searchTerm, setSearchTerm] = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [openNova, setOpenNova] = useState(false);
  const [editing, setEditing] = useState<Turma | null>(null);
  const [discDialog, setDiscDialog] = useState<Turma | null>(null);
  const [habDialog, setHabDialog] = useState<Turma | null>(null);
  const [cfgDialog, setCfgDialog] = useState<Turma | null>(null);
  const navigate = useNavigate();

  const filtered = turmas.filter((t) => {
    const q = searchTerm.toLowerCase();
    return (
      `${t.ano} ${t.letra}`.toLowerCase().includes(q) ||
      t.nivel.toLowerCase().includes(q) ||
      t.coordenadores.join(" ").toLowerCase().includes(q)
    );
  });

  const toggleExpand = (id: string) =>
    setExpanded((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const remover = (t: Turma) => {
    if (confirm(`Remover turma ${t.ano} ${t.letra}?`)) {
      turmasStore.remove(t.id);
      toast({ title: "Turma removida" });
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />

        <div className="flex-1 flex flex-col">
          <HeaderWithNotifications />

          <main className="flex-1 p-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-edu-blue-light rounded-lg">
                    <Users className="w-5 h-5 text-edu-blue" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Todas as Turmas</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {filtered.length} turmas encontradas
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar turma..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Button onClick={() => { setEditing(null); setOpenNova(true); }}>
                    <Plus className="w-4 h-4" /> Nova Turma
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {filtered.length === 0 ? (
                  <div className="text-center py-16 border-2 border-dashed rounded-lg">
                    <Users className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                    <h3 className="font-semibold mb-1">Nenhuma turma criada</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Comece criando sua primeira turma a partir de um plano de estudo.
                    </p>
                    <Button onClick={() => { setEditing(null); setOpenNova(true); }}>
                      <Plus className="w-4 h-4" /> Criar primeira turma
                    </Button>
                  </div>
                ) : (
                  <div className="rounded-lg border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="w-10"></TableHead>
                          <TableHead>Edição</TableHead>
                          <TableHead>Nível</TableHead>
                          <TableHead>Turma</TableHead>
                          <TableHead>Turno</TableHead>
                          <TableHead>Coordenadores</TableHead>
                          <TableHead className="text-center">Alunos</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filtered.map((turma) => (
                          <Fragment key={turma.id}>
                            <TableRow className="hover:bg-muted/50">
                              <TableCell>
                                <Button size="icon" variant="ghost" onClick={() => toggleExpand(turma.id)} title="Expandir">
                                  {expanded.has(turma.id) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                </Button>
                              </TableCell>
                              <TableCell><Badge variant="outline">{turma.edicao}</Badge></TableCell>
                              <TableCell>
                                <Badge className={
                                  turma.nivel === "Infantil" ? "bg-edu-purple-light text-edu-purple border-0"
                                  : turma.nivel === "Fundamental I" ? "bg-edu-green-light text-edu-green border-0"
                                  : "bg-edu-blue-light text-edu-blue border-0"
                                }>{turma.nivel}</Badge>
                              </TableCell>
                              <TableCell className="font-medium">{turma.ano} {turma.letra}</TableCell>
                              <TableCell>{turma.turno}</TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {turma.coordenadores.length ? turma.coordenadores.join(", ") : "—"}
                              </TableCell>
                              <TableCell className="text-center">
                                <Badge variant="secondary">{turma.matriculas.length}</Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <Button variant="ghost" size="icon" title="Criar Disciplina"
                                          onClick={() => setDiscDialog(turma)}>
                                    <BookOpen className="w-4 h-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" title="Habilidades BNCC"
                                          onClick={() => setHabDialog(turma)}>
                                    <Sparkles className="w-4 h-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" title="Editar Turma"
                                          onClick={() => { setEditing(turma); setOpenNova(true); }}>
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" title="Configurações"
                                          onClick={() => setCfgDialog(turma)}>
                                    <Settings className="w-4 h-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" title="Abrir diário"
                                          onClick={() => navigate(`/turmas/${turma.id}/disciplinas`)}>
                                    <ChevronRight className="w-4 h-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" title="Remover"
                                          onClick={() => remover(turma)}>
                                    <Trash2 className="w-4 h-4 text-destructive" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                            {expanded.has(turma.id) && (
                              <TableRow className="bg-muted/20">
                                <TableCell colSpan={8} className="p-4">
                                  <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                      <h4 className="font-semibold text-sm">Disciplinas da turma</h4>
                                      <Button size="sm" variant="outline" onClick={() => setDiscDialog(turma)}>
                                        <Plus className="w-3 h-3" /> Adicionar
                                      </Button>
                                    </div>
                                    {turma.disciplinas.length === 0 ? (
                                      <p className="text-sm text-muted-foreground">Nenhuma disciplina criada ainda.</p>
                                    ) : (
                                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                        {turma.disciplinas.map((d) => (
                                          <div key={d.id} className="border rounded-md p-3 bg-background">
                                            <div className="flex items-center justify-between mb-1">
                                              <span className="font-medium text-sm">{d.nome}</span>
                                              <Badge variant="outline" className="text-xs">{d.tipoEnsino}</Badge>
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                              {d.professores.length} prof. · {d.habilidades.length} hab. · faltas máx {d.faltasMax}%
                                            </p>
                                            {d.anos.length > 0 && (
                                              <p className="text-xs text-muted-foreground mt-1">
                                                Anos: {d.anos.join(", ")}
                                              </p>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                    <div className="text-xs text-muted-foreground border-t pt-2">
                                      <strong>Código:</strong> {turma.codigo} ·{" "}
                                      <strong>Carga horária:</strong> {turma.cargaHoraria}h
                                    </div>
                                  </div>
                                </TableCell>
                              </TableRow>
                            )}
                          </Fragment>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </main>
        </div>
      </div>

      <NovaTurmaDialog open={openNova} onOpenChange={setOpenNova} turma={editing} />
      {discDialog && (
        <DisciplinaDialog open={!!discDialog} onOpenChange={(o) => !o && setDiscDialog(null)} turma={discDialog} />
      )}
      {habDialog && (
        <HabilidadesDialog open={!!habDialog} onOpenChange={(o) => !o && setHabDialog(null)} turma={habDialog} />
      )}
      {cfgDialog && (
        <ConfigTurmaDialog open={!!cfgDialog} onOpenChange={(o) => !o && setCfgDialog(null)} turma={cfgDialog} />
      )}
    </SidebarProvider>
  );
};

export default Turmas;
