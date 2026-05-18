import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { HeaderWithNotifications } from "@/components/HeaderWithNotifications";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, UserCog, ArrowLeft, BookOpen, Clock, AlertTriangle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { NewUserDialog, NewUserRole } from "@/components/NewUserDialog";

interface Aluno {
  id: string;
  nome: string;
  matricula: string;
  turma: string;
  nivel: string;
  status: "Ativo" | "Inativo" | "Transferido";
  cpf: string;
  dataNascimento: string;
  endereco: string;
  nomeMae: string;
  nomePai: string;
  telefone: string;
  email: string;
  notas: { disciplina: string; nota1: number; nota2: number; nota3: number; nota4: number; media: number }[];
  faltas: { disciplina: string; total: number; permitidas: number }[];
  frequencia: number;
  documentos: { tipo: string; data: string; status: string; categoria: string }[];
}

const NOMES = [
  "Ana Beatriz Silva", "Bruno Henrique Costa", "Camila Rodrigues", "Daniel Oliveira Santos",
  "Emily Ferreira Lima", "Felipe Almeida", "Gabriela Souza", "Henrique Martins",
  "Isabela Pereira", "João Victor Ribeiro", "Karina Nascimento", "Leonardo Araújo",
  "Marina Gomes", "Nicolas Barbosa", "Olivia Carvalho", "Pedro Lucas Mendes",
  "Rafaela Monteiro", "Samuel Teixeira", "Tatiana Moreira", "Ulisses Fernandes",
  "Valentina Rocha", "William Dias", "Ximena Castro", "Yago Pinto",
  "Zara Lopes", "Arthur Cavalcanti", "Bianca Freitas", "Carlos Eduardo Nunes",
  "Diana Rezende", "Eduardo Vasconcelos",
];

const DISCIPLINAS = ["Português", "Matemática", "Inglês", "Ciências", "Ensino Religioso", "História", "Geografia", "Artes", "Educação Física"];
const TURMAS = ["1º Ano A", "1º Ano B", "2º Ano A", "2º Ano B", "6º Ano A", "6º Ano B", "7º Ano A", "Pré I", "Pré II"];

function gerarNota() {
  return Math.round((Math.random() * 6 + 4) * 10) / 10;
}

const CPFS = NOMES.map((_, i) => `${String(100 + i)}.${String(200 + i)}.${String(300 + i)}-${String(10 + i)}`);
const ENDERECOS = [
  "Rua das Flores, 123 - Centro", "Av. Brasil, 456 - Boa Vista", "Rua Amazonas, 789 - Jardim América",
  "Rua São Paulo, 321 - Vila Nova", "Av. Getúlio Vargas, 654 - Centro", "Rua Minas Gerais, 147 - Liberdade",
  "Rua Bahia, 258 - Santa Cruz", "Av. Independência, 369 - Parque das Nações", "Rua Paraná, 741 - Jardim Europa",
  "Rua Goiás, 852 - Centro", "Rua Ceará, 963 - Vila Rica", "Av. Atlântica, 159 - Praia Grande",
  "Rua Pernambuco, 267 - Centro", "Rua Sergipe, 378 - Nova Esperança", "Av. Santos Dumont, 489 - Aeroporto",
  "Rua Maranhão, 591 - Centro", "Rua Piauí, 602 - São Jorge", "Av. Rio Branco, 713 - Centro",
  "Rua Tocantins, 824 - Jardim Primavera", "Rua Amapá, 935 - Centro", "Rua Roraima, 146 - Vila Verde",
  "Av. Paulista, 257 - Centro", "Rua Acre, 368 - Boa Esperança", "Rua Rondônia, 479 - Centro",
  "Rua Mato Grosso, 580 - Jardim Sol", "Av. Atlântica, 691 - Praia", "Rua Alagoas, 702 - Centro",
  "Rua Paraíba, 813 - São Pedro", "Av. Beira Mar, 924 - Praia", "Rua Espírito Santo, 135 - Centro",
];

function gerarAlunos(): Aluno[] {
  return NOMES.map((nome, i) => {
    const notas = DISCIPLINAS.map((d) => {
      const n1 = gerarNota(), n2 = gerarNota(), n3 = gerarNota(), n4 = gerarNota();
      return { disciplina: d, nota1: n1, nota2: n2, nota3: n3, nota4: n4, media: Math.round(((n1 + n2 + n3 + n4) / 4) * 10) / 10 };
    });
    const faltas = DISCIPLINAS.map((d) => ({
      disciplina: d,
      total: Math.floor(Math.random() * 15),
      permitidas: 20,
    }));
    const totalFaltas = faltas.reduce((s, f) => s + f.total, 0);
    const totalPossiveis = faltas.length * 80;
    const frequencia = Math.round(((totalPossiveis - totalFaltas) / totalPossiveis) * 1000) / 10;
    return {
      id: String(i + 1),
      nome,
      matricula: `2024${String(i + 1).padStart(4, "0")}`,
      turma: TURMAS[i % TURMAS.length],
      nivel: i % 3 === 0 ? "Fundamental I" : i % 3 === 1 ? "Fundamental II" : "Infantil",
      status: i === 19 ? "Transferido" : i === 27 ? "Inativo" : "Ativo",
      cpf: CPFS[i],
      dataNascimento: `${String((i % 28) + 1).padStart(2, "0")}/${String((i % 12) + 1).padStart(2, "0")}/2014`,
      endereco: ENDERECOS[i],
      nomeMae: `Maria ${nome.split(" ").slice(-1)[0]}`,
      nomePai: `José ${nome.split(" ").slice(-1)[0]}`,
      telefone: `(92) 9${String(8000 + i * 37)}-${String(1000 + i * 23)}`,
      email: `${nome.split(" ")[0].toLowerCase()}.${nome.split(" ").slice(-1)[0].toLowerCase()}@email.com`,
      notas,
      faltas,
      frequencia,
      documentos: [
        { tipo: "Histórico Escolar", data: "15/02/2024", status: i % 4 === 0 ? "Pendente" : "Disponível", categoria: "Histórico" },
        { tipo: "Boletim Escolar - 1º Bim", data: "15/04/2024", status: "Disponível", categoria: "Boletim" },
        { tipo: "Boletim Escolar - 2º Bim", data: "15/07/2024", status: i % 3 === 0 ? "Pendente" : "Disponível", categoria: "Boletim" },
        { tipo: "Declaração de Matrícula", data: "05/02/2024", status: "Disponível", categoria: "Declaração" },
        { tipo: "Declaração de Conclusão", data: "20/12/2024", status: i % 2 === 0 ? "Pendente" : "Disponível", categoria: "Declaração" },
        { tipo: "Declaração de Frequência", data: "01/08/2024", status: "Disponível", categoria: "Declaração" },
        { tipo: "Atividades Pendentes", data: "27/02/2026", status: `${Math.floor(Math.random() * 5)} pendentes`, categoria: "Atividades" },
        { tipo: "Certidão de Nascimento", data: "05/02/2024", status: "Entregue", categoria: "Pessoal" },
        { tipo: "Comprovante de Residência", data: "10/02/2024", status: i % 5 === 0 ? "Pendente" : "Entregue", categoria: "Pessoal" },
        { tipo: "Cartão de Vacinação", data: "05/02/2024", status: i % 7 === 0 ? "Pendente" : "Entregue", categoria: "Pessoal" },
      ],
    };
  });
}

const alunosData = gerarAlunos();

const statusColors: Record<string, string> = {
  Ativo: "bg-edu-green-light text-edu-green",
  Inativo: "bg-muted text-muted-foreground",
  Transferido: "bg-edu-orange-light text-edu-orange",
};

// ===== Usuários adicionais (não-alunos) =====
type Role = "Aluno" | "Professor" | "Diretor" | "Coordenador" | "Gestor" | "Administrativo" | "Suporte";

interface OutroUsuario {
  id: string;
  nome: string;
  role: Exclude<Role, "Aluno">;
  escola: string;
  email: string;
  telefone: string;
  novo?: boolean;
}

const ESCOLAS = [
  "SEMEI Iranduba - 01",
  "SEMEI Iranduba - 02",
  "SEMEI Iranduba - 03",
];

const outrosUsuariosInicial: OutroUsuario[] = [
  { id: "p1", nome: "Marcos Rocha", role: "Professor", escola: ESCOLAS[0], email: "marcos.rocha@semei.edu", telefone: "(92) 99999-1111" },
  { id: "p2", nome: "Patrícia Lima", role: "Professor", escola: ESCOLAS[0], email: "patricia.lima@semei.edu", telefone: "(92) 99999-1112", novo: true },
  { id: "p3", nome: "Rafael Souza", role: "Professor", escola: ESCOLAS[1], email: "rafael.souza@semei.edu", telefone: "(92) 99999-1113" },
  { id: "p4", nome: "Beatriz Lopes", role: "Professor", escola: ESCOLAS[2], email: "beatriz.lopes@semei.edu", telefone: "(92) 99999-1114" },
  { id: "p5", nome: "Ricardo Mendes", role: "Professor", escola: ESCOLAS[1], email: "ricardo.mendes@semei.edu", telefone: "(92) 99999-1115", novo: true },
  { id: "p6", nome: "Juliana Costa", role: "Professor", escola: ESCOLAS[0], email: "juliana.costa@semei.edu", telefone: "(92) 99999-1116" },
  { id: "d1", nome: "Carlos Mendes", role: "Diretor", escola: ESCOLAS[0], email: "carlos.mendes@semei.edu", telefone: "(92) 99999-2001" },
  { id: "d2", nome: "Helena Vasconcelos", role: "Diretor", escola: ESCOLAS[1], email: "helena.v@semei.edu", telefone: "(92) 99999-2002" },
  { id: "d3", nome: "Marcelo Ferraz", role: "Diretor", escola: ESCOLAS[2], email: "marcelo.f@semei.edu", telefone: "(92) 99999-2003", novo: true },
  { id: "c1", nome: "Ana Paula Ribeiro", role: "Coordenador", escola: ESCOLAS[0], email: "ana.ribeiro@semei.edu", telefone: "(92) 99999-3001" },
  { id: "c2", nome: "Roberto Tavares", role: "Coordenador", escola: ESCOLAS[1], email: "roberto.t@semei.edu", telefone: "(92) 99999-3002" },
  { id: "c3", nome: "Larissa Pinheiro", role: "Coordenador", escola: ESCOLAS[2], email: "larissa.p@semei.edu", telefone: "(92) 99999-3003", novo: true },
  { id: "g1", nome: "Eduardo Albuquerque", role: "Gestor", escola: ESCOLAS[0], email: "eduardo.a@semei.edu", telefone: "(92) 99999-4001" },
  { id: "g2", nome: "Cláudia Bezerra", role: "Gestor", escola: ESCOLAS[1], email: "claudia.b@semei.edu", telefone: "(92) 99999-4002" },
  { id: "a1", nome: "Fernanda Alves", role: "Administrativo", escola: ESCOLAS[0], email: "fernanda.a@semei.edu", telefone: "(92) 99999-5001" },
  { id: "a2", nome: "José Carlos Lima", role: "Administrativo", escola: ESCOLAS[0], email: "jose.lima@semei.edu", telefone: "(92) 99999-5002", novo: true },
  { id: "a3", nome: "Mariana Brito", role: "Administrativo", escola: ESCOLAS[1], email: "mariana.b@semei.edu", telefone: "(92) 99999-5003" },
  { id: "a4", nome: "Paulo Henrique", role: "Administrativo", escola: ESCOLAS[2], email: "paulo.h@semei.edu", telefone: "(92) 99999-5004" },
  { id: "s1", nome: "Lucas Suporte", role: "Suporte", escola: ESCOLAS[0], email: "lucas.s@semei.edu", telefone: "(92) 99999-6001" },
  { id: "s2", nome: "Renata Atendimento", role: "Suporte", escola: ESCOLAS[1], email: "renata.a@semei.edu", telefone: "(92) 99999-6002", novo: true },
];

const roleColors: Record<Role, string> = {
  Aluno: "bg-edu-blue-light text-edu-blue",
  Professor: "bg-edu-purple-light text-edu-purple",
  Diretor: "bg-edu-coral-light text-edu-coral",
  Coordenador: "bg-edu-orange-light text-edu-orange",
  Gestor: "bg-edu-green-light text-edu-green",
  Administrativo: "bg-muted text-foreground",
  Suporte: "bg-edu-orange-light text-edu-orange",
};

const Usuarios = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAluno, setSelectedAluno] = useState<Aluno | null>(null);
  const [roleFilters, setRoleFilters] = useState<Role[]>([]);
  const [escolaFilter, setEscolaFilter] = useState<string>("todas");
  const [outrosUsuarios, setOutrosUsuarios] = useState<OutroUsuario[]>(outrosUsuariosInicial);

  // Lista unificada para a tabela
  const alunosComoUsuario = alunosData.map((a) => ({
    id: `aluno-${a.id}`,
    nome: a.nome,
    role: "Aluno" as Role,
    escola: ESCOLAS[0],
    email: a.email,
    telefone: a.telefone,
    novo: parseInt(a.matricula.slice(-2)) > 25,
    _alunoRef: a,
  }));
  const outrosComoUsuario = outrosUsuarios.map((u) => ({ ...u, _alunoRef: null as Aluno | null }));
  const todos = [...alunosComoUsuario, ...outrosComoUsuario];

  const filtered = todos.filter((u) => {
    const matchSearch =
      u.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = roleFilters.length === 0 || roleFilters.includes(u.role);
    const matchEscola = escolaFilter === "todas" || u.escola === escolaFilter;
    return matchSearch && matchRole && matchEscola;
  });

  // Estatísticas por papel
  const stats: { role: Role; total: number; novos: number; color: string }[] = (
    ["Aluno", "Professor", "Diretor", "Coordenador", "Gestor", "Administrativo"] as Role[]
  ).map((role) => {
    const list = todos.filter((u) => u.role === role && (escolaFilter === "todas" || u.escola === escolaFilter));
    return { role, total: list.length, novos: list.filter((u) => u.novo).length, color: roleColors[role] };
  });

  const toggleRole = (r: Role) =>
    setRoleFilters((prev) => (prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]));

  if (selectedAluno) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar />
          <div className="flex-1 flex flex-col">
            <HeaderWithNotifications />
            <main className="flex-1 p-6 space-y-6">
              {/* Back + header */}
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => setSelectedAluno(null)}>
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-foreground">{selectedAluno.nome}</h1>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-sm text-muted-foreground">Matrícula: {selectedAluno.matricula}</span>
                    <span className="text-sm text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">{selectedAluno.turma}</span>
                    <Badge className={`${statusColors[selectedAluno.status]} border-0`}>{selectedAluno.status}</Badge>
                  </div>
                </div>
              </div>

              {/* Summary cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6 flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-edu-green-light">
                      <CheckCircle className="w-6 h-6 text-edu-green" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Frequência</p>
                      <p className="text-2xl font-bold text-foreground">{selectedAluno.frequencia}%</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-edu-blue-light">
                      <BookOpen className="w-6 h-6 text-edu-blue" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Média Geral</p>
                      <p className="text-2xl font-bold text-foreground">
                        {(selectedAluno.notas.reduce((s, n) => s + n.media, 0) / selectedAluno.notas.length).toFixed(1)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-edu-coral-light">
                      <AlertTriangle className="w-6 h-6 text-edu-coral" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total de Faltas</p>
                      <p className="text-2xl font-bold text-foreground">
                        {selectedAluno.faltas.reduce((s, f) => s + f.total, 0)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="notas">
                <TabsList>
                  <TabsTrigger value="notas">Notas</TabsTrigger>
                  <TabsTrigger value="faltas">Faltas e Frequência</TabsTrigger>
                  <TabsTrigger value="documentos">Documentos</TabsTrigger>
                </TabsList>

                <TabsContent value="notas">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Boletim Escolar</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-lg border overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-muted/50">
                              <TableHead>Disciplina</TableHead>
                              <TableHead className="text-center">1º Bim</TableHead>
                              <TableHead className="text-center">2º Bim</TableHead>
                              <TableHead className="text-center">3º Bim</TableHead>
                              <TableHead className="text-center">4º Bim</TableHead>
                              <TableHead className="text-center">Média</TableHead>
                              <TableHead className="text-center">Situação</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedAluno.notas.map((n) => (
                              <TableRow key={n.disciplina}>
                                <TableCell className="font-medium">{n.disciplina}</TableCell>
                                <TableCell className="text-center">{n.nota1}</TableCell>
                                <TableCell className="text-center">{n.nota2}</TableCell>
                                <TableCell className="text-center">{n.nota3}</TableCell>
                                <TableCell className="text-center">{n.nota4}</TableCell>
                                <TableCell className="text-center font-bold">{n.media}</TableCell>
                                <TableCell className="text-center">
                                  <Badge className={`border-0 ${n.media >= 7 ? "bg-edu-green-light text-edu-green" : n.media >= 5 ? "bg-edu-orange-light text-edu-orange" : "bg-destructive/10 text-destructive"}`}>
                                    {n.media >= 7 ? "Aprovado" : n.media >= 5 ? "Recuperação" : "Reprovado"}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="faltas">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Frequência por Disciplina</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {selectedAluno.faltas.map((f) => {
                        const pct = Math.round(((f.permitidas - f.total) / f.permitidas) * 100);
                        return (
                          <div key={f.disciplina} className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span className="font-medium">{f.disciplina}</span>
                              <span className="text-muted-foreground">{f.total} faltas / {f.permitidas} permitidas — {pct}%</span>
                            </div>
                            <Progress value={pct} className="h-2" />
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="documentos">
                  <div className="space-y-6">
                    {/* Informações Básicas do Aluno */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Informações do Aluno</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[
                            { label: "Nome Completo", value: selectedAluno.nome },
                            { label: "CPF", value: selectedAluno.cpf },
                            { label: "Data de Nascimento", value: selectedAluno.dataNascimento },
                            { label: "Matrícula", value: selectedAluno.matricula },
                            { label: "Turma", value: selectedAluno.turma },
                            { label: "Nível", value: selectedAluno.nivel },
                            { label: "Endereço", value: selectedAluno.endereco },
                            { label: "Nome da Mãe", value: selectedAluno.nomeMae },
                            { label: "Nome do Pai", value: selectedAluno.nomePai },
                            { label: "Telefone", value: selectedAluno.telefone },
                            { label: "E-mail", value: selectedAluno.email },
                            { label: "Status", value: selectedAluno.status },
                          ].map((item) => (
                            <div key={item.label} className="space-y-1">
                              <span className="text-xs text-muted-foreground">{item.label}</span>
                              <p className="text-sm font-medium text-foreground">{item.value}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Documentação Escolar */}
                    {["Histórico", "Boletim", "Declaração", "Atividades", "Pessoal"].map((cat) => {
                      const docs = selectedAluno.documentos.filter((d) => d.categoria === cat);
                      if (docs.length === 0) return null;
                      return (
                        <Card key={cat}>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-base">{cat === "Pessoal" ? "Documentos Pessoais" : cat}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="rounded-lg border overflow-hidden">
                              <Table>
                                <TableHeader>
                                  <TableRow className="bg-muted/50">
                                    <TableHead>Documento</TableHead>
                                    <TableHead>Data</TableHead>
                                    <TableHead className="text-center">Status</TableHead>
                                    <TableHead className="text-right">Ação</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {docs.map((d) => (
                                    <TableRow key={d.tipo}>
                                      <TableCell className="font-medium">{d.tipo}</TableCell>
                                      <TableCell>{d.data}</TableCell>
                                      <TableCell className="text-center">
                                        <Badge className={cn(
                                          "border-0",
                                          d.status === "Disponível" || d.status === "Entregue"
                                            ? "bg-edu-green-light text-edu-green"
                                            : d.status === "Pendente"
                                            ? "bg-edu-orange-light text-edu-orange"
                                            : "bg-edu-blue-light text-edu-blue"
                                        )}>
                                          {d.status}
                                        </Badge>
                                      </TableCell>
                                      <TableCell className="text-right">
                                        {(d.status === "Disponível" || d.status === "Entregue") && (
                                          <Button variant="ghost" size="sm" className="text-xs">
                                            Visualizar
                                          </Button>
                                        )}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </TabsContent>
              </Tabs>
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <HeaderWithNotifications />
          <main className="flex-1 p-6 space-y-6">
            {/* Stats por papel */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {stats.map((s) => (
                <Card key={s.role}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={`${s.color} border-0 text-[10px]`}>{s.role}</Badge>
                      {s.novos > 0 && (
                        <span className="text-[10px] font-semibold text-edu-green">+{s.novos} novos</span>
                      )}
                    </div>
                    <p className="text-2xl font-bold text-[#1d2746]">{s.total}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Total cadastrados</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader className="space-y-4">
                <div className="flex flex-row items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-edu-blue-light rounded-lg">
                      <UserCog className="w-5 h-5 text-edu-blue" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Usuários</CardTitle>
                      <p className="text-sm text-muted-foreground">{filtered.length} usuário(s) encontrado(s)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="relative w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar por nome ou e-mail..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    <select
                      value={escolaFilter}
                      onChange={(e) => setEscolaFilter(e.target.value)}
                      className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                    >
                      <option value="todas">Todas as escolas</option>
                      {ESCOLAS.map((e) => (
                        <option key={e} value={e}>{e}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Filtros de papel */}
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs text-muted-foreground self-center mr-1">Filtrar por:</span>
                  {(["Professor", "Diretor", "Coordenador", "Gestor", "Administrativo", "Aluno"] as Role[]).map((r) => {
                    const active = roleFilters.includes(r);
                    return (
                      <button
                        key={r}
                        onClick={() => toggleRole(r)}
                        className={cn(
                          "px-3 py-1 rounded-full text-xs font-medium border transition-colors",
                          active
                            ? `${roleColors[r]} border-transparent`
                            : "bg-background border-border text-muted-foreground hover:bg-muted"
                        )}
                      >
                        {r}
                      </button>
                    );
                  })}
                  {roleFilters.length > 0 && (
                    <button
                      onClick={() => setRoleFilters([])}
                      className="text-xs text-primary hover:underline ml-2"
                    >
                      Limpar
                    </button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>Nome</TableHead>
                        <TableHead>Função</TableHead>
                        <TableHead>Escola</TableHead>
                        <TableHead>E-mail</TableHead>
                        <TableHead>Telefone</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.map((u) => (
                        <TableRow
                          key={u.id}
                          className={cn("transition-colors", u._alunoRef && "cursor-pointer hover:bg-muted/50")}
                          onClick={() => u._alunoRef && setSelectedAluno(u._alunoRef)}
                        >
                          <TableCell className="font-medium">{u.nome}</TableCell>
                          <TableCell>
                            <Badge className={`${roleColors[u.role]} border-0`}>{u.role}</Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{u.escola}</TableCell>
                          <TableCell className="text-muted-foreground text-xs">{u.email}</TableCell>
                          <TableCell className="text-muted-foreground text-xs">{u.telefone}</TableCell>
                          <TableCell className="text-center">
                            {u.novo ? (
                              <Badge className="bg-edu-green-light text-edu-green border-0">Novo</Badge>
                            ) : (
                              <Badge variant="outline">Ativo</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                      {filtered.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-sm text-muted-foreground py-8">
                            Nenhum usuário encontrado com os filtros aplicados.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Usuarios;
