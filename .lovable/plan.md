# Plano: Gestão completa de Turmas

Vou reestruturar a página `/turmas` para permitir criar turmas com pré-preenchimento via Plano de Estudo e expor 5 ações por turma (Criar Disciplina, Editar Turma, Engrenagem com Coordenador/Matrículas, Habilidades BNCC, expandir).

## 1. Catálogos base (novo `src/lib/planosEstudo.ts`)
Estrutura de dados em memória (sem backend) que alimenta os selects e pré-preenchimentos.

- **Planos de Estudo**: `EFI`, `EFII`, `EJA`, `Infantil`, `Médio`. Cada plano define:
  - `anos` disponíveis (ex.: EFI → 1º ao 5º; EFII → 6º ao 9º; Infantil → Maternal, Pré I, Pré II)
  - `nivel` (Fundamental I / II, Infantil, EJA, Médio)
  - `turno` padrão
  - `codigo` base (ex.: `EFI-2026`)
  - `cargaHorariaTotal` (ex.: 800h)
- **Disciplinas pré-definidas**: Língua Portuguesa, Matemática, Arte, Inglês, Ensino Religioso, Ciências, História, Geografia, Educação Física.
- **Tipos de ensino**: Base Nacional, Parte Diversificada, Atividade Complementar, Flexibilização, Aprofundamento Curricular, Formação Geral.
- **Professores** e **Coordenadores** mock (lista).
- **Alunos** mock para matrícula.

## 2. Store local de turmas (`src/lib/turmasStore.ts`)
Hook `useTurmas()` com `localStorage`. Modelo:
```text
Turma { id, planoId, ano, letra, nivel, turno, codigo,
        cargaHoraria, calendarioId, coordenadores[], disciplinas[],
        matriculas[] }
Disciplina { id, nome, anos[], professores[], faltasMax=25,
             tipoEnsino, habilidadesBncc[] }
```
Substitui o `turmasData` estático.

## 3. Página `src/pages/Turmas.tsx`
- Botão **“Criar nova turma”** no topo abre `NovaTurmaDialog`.
- Tabela passa a renderizar turmas do store; se vazia, mostra empty state com CTA.
- Coluna **Ações** com 5 ícones:
  1. `ChevronDown` — expandir linha (mostra disciplinas criadas)
  2. `BookOpen` — Criar Disciplina (`DisciplinaDialog`)
  3. `Sparkles` — Habilidades BNCC (`HabilidadesDialog`)
  4. `Edit` — Editar turma (reabre `NovaTurmaDialog` em modo edição)
  5. `Settings` — Engrenagem (`ConfigTurmaDialog` com abas Coordenador / Matrículas)

## 4. Novos componentes em `src/components/turmas/`

- **`NovaTurmaDialog.tsx`**
  - Select Plano de Estudo → ao escolher, preenche Nível, Turno, Código, Carga Horária (editáveis).
  - Select Ano (vindo do plano).
  - Input “Letra da turma” (A, B, C…).
  - Select Calendário (lista de calendários escolares de `calendario.ts`).
  - Multi-select Coordenadores.
  - Botões “Salvar” e “Voltar”.

- **`DisciplinaDialog.tsx`**
  - Select disciplina (lista pré-definida).
  - Multi-select anos (1º ao 9º filtrado pelo plano da turma, ano letivo 2026).
  - Multi-select professores.
  - Input “% máximo de faltas” pré-preenchido `25`.
  - Select Tipo de Ensino (6 opções).
  - Salvar adiciona à turma; aparece quando linha é expandida.

- **`HabilidadesDialog.tsx`**
  - Lista habilidades BNCC da disciplina selecionada, agrupadas por ano (usa `BNCC_HABILIDADES` existente + extensão por ano).
  - Checkboxes para marcar habilidades trabalhadas.

- **`ConfigTurmaDialog.tsx`** (Tabs)
  - **Coordenador**: adicionar múltiplos coordenadores + switch “Alocar em todas as disciplinas”.
  - **Matrículas**: input de busca de alunos, lista filtrada, ao clicar aluno é alocado em todas as disciplinas. Tabela com ordem de chamada e botões ↑/↓ para reordenar.

## 5. Integração
- `Disciplinas.tsx` continua funcionando lendo do store quando a turma existir.
- Cores e tokens semânticos do design system existentes (sem cores diretas).

## Detalhes técnicos
- Persistência: `localStorage` via hook simples (`useSyncExternalStore` ou `useState` + efeito).
- Validação leve com mensagens em `toast`.
- Reaproveita `Dialog`, `Tabs`, `Select`, `Checkbox`, `Switch`, `Command` (busca) do shadcn.
- Sem alterações de backend.

Confirma para eu implementar?