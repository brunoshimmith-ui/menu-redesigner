# Plano: Páginas principais por perfil

Vou reestruturar o `Menu` (dashboard) para renderizar uma experiência diferente conforme o perfil logado, e adicionar os recursos novos pedidos.

## 1. Modelo de perfis e contexto de auth

- Estender `AuthContext` para incluir `role`: `"suporte" | "professor" | "coordenacao" | "direcao" | "administracao" | "aluno"` e `name`.
- Login `stepforma/12345678` continua como **Suporte** (visão completa atual).
- Adicionar credenciais de demonstração:
  - `professor / 12345678` → Professor (Ana Silva)
  - `coord / 12345678` → Coordenação
  - `direcao / 12345678` → Direção
  - `admin / 12345678` → Administração
  - `aluno / 12345678` → Aluno (João Pedro, 7º A)
- Sidebar (`AppSidebar`) passa a filtrar itens conforme `role`:
  - Suporte/Admin/Coord/Direção: todos os itens atuais.
  - Professor: Dashboard, Turmas, Relatórios, Documentos, Página Pública, Stepmeet, Configurações.
  - Aluno: Dashboard, Página Pública, Documentos, Configurações.

## 2. Página principal (`/menu`) por perfil

`Menu.tsx` vira um roteador interno que escolhe o dashboard:

### Suporte (atual + melhorias)
- Cards globais: escolas, turmas, total de alunos por escola/turma.
- **Notificações de chamada/suporte**: lista de tickets enviados por professores/coordenação/direção/administração com status e botão "Responder". Mock de chamados.

### Professor
- Header: "Bem-vindo, Prof. {nome}" + data atual por extenso.
- Grid de ferramentas: Minhas Turmas, Relatórios, Documentos, Página Pública, Stepmeet.
- **Calendário** (react-day-picker já presente) com marcadores:
  - Feriados nacionais 2026 pré-cadastrados.
  - Início/fim dos 4 bimestres (definidos pelo Suporte — mock).
  - Avaliações criadas pelo professor (modal "Nova avaliação" com data, turma, disciplina).
- **Bloco Anotações / Rotina diária**: textarea persistido em `localStorage` por usuário, lista de entradas por data.
- **Avisos importantes**: reuniões agendadas (Stepmeet) + avaliações criadas pelo próprio professor.
- **Dica do dia**: carrossel com mensagens sobre preencher conteúdos/frequência/notas.

### Coordenação / Direção / Administração
- Mesmas seções do Suporte para navegação (Usuários, Transferências, Relatórios, Dashboard, Turmas, Página Pública) com dados de contexto.
- Avisos importantes, calendário e dica do dia conforme perfil.
- Botão **"Criar aviso importante"** (somente Suporte/Admin/Coord/Direção) — abre dialog com:
  - Título, mensagem, data.
  - Filtro "Visível para": Todos | Seleção múltipla (Professor, Aluno, Coord, Direção, Admin, Suporte).
  - Persistido em `localStorage` (`avisos_importantes`) e listado em todos os dashboards conforme filtro.

### Aluno
- Header: "Olá, {nome} — {turma}".
- Mini-dashboard pessoal: disciplinas, notas por bimestre, frequência, progresso letivo.
- **Avisos importantes**: avaliações criadas pelos professores das suas turmas (mesma store) + avisos direcionados a "aluno".
- **Dica do dia**: importância dos estudos, referências de aprendizado.
- Calendário read-only com feriados e datas de avaliação.

## 3. Componentes novos / reutilizáveis

- `src/components/dashboards/SuporteDashboard.tsx`
- `src/components/dashboards/ProfessorDashboard.tsx`
- `src/components/dashboards/GestaoDashboard.tsx` (coord/direção/admin)
- `src/components/dashboards/AlunoDashboard.tsx`
- `src/components/CalendarioEscolar.tsx` — calendário com modificadores para feriado, bimestre, avaliação; props opcionais para criar avaliação.
- `src/components/AvisosImportantes.tsx` — lista + dialog de criação (gated por role).
- `src/components/DicaDoDia.tsx` — carrossel (embla já disponível) com dicas por role.
- `src/components/AnotacoesProfessor.tsx` — rotina diária em localStorage.
- `src/lib/calendario.ts` — feriados 2026, bimestres mock.
- `src/lib/store.ts` — helpers de localStorage para avisos, avaliações, anotações.

## 4. Detalhes técnicos

- Tudo client-side (sem backend), usando `localStorage` para avisos/avaliações/anotações.
- Sem mudanças de schema — apenas frontend.
- Reutilizar tokens do design system (sem cores hardcoded).
- Alunos recebem avaliações filtrando por `turmaId` do aluno mock.

## 5. Fora de escopo (não vou mexer)

- Páginas existentes (`Turmas`, `Usuarios`, `Transferencias` etc.) permanecem como estão — apenas o `/menu` muda e o sidebar filtra.
- Sem alterações no fluxo de criação de usuário já existente.

Confirma para eu implementar?
