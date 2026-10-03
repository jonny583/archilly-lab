# LAB-24 — o bloco de indicadores de terreno

**Data:** 03/10/2026 · **Semente:** 20260913 · **Contrato:** lido em `["2","1"]`
**Provas:** [`docs/provas/LAB-24/terreno.json`](../provas/LAB-24/terreno.json) · formato: [`formato-proposto.json`](../provas/LAB-24/formato-proposto.json)
**Ferramenta:** `bun run lab24` · **Testes:** `tests/terreno.test.ts` — 17 · a esteira inteira, **200 verdes**

---

## Em uma frase

**Os quatro motores reprovam pela lei no terreno de teste** — de 49 a 113 lotes
com parte acima de 30 % —, e **os dois indicadores ordenam os motores ao
contrário**: o Symbios é o que põe mais rua em declive e o que põe **menos**
lote.

---

## 1 · A resposta do Jonny, e a assimetria que ela traz

| o quê | limite | força | fonte |
|---|---|---|---|
| **LOTE** | **30 %** de declividade do terreno | **reprova** | Lei 6.766/1979, art. 3º — confirmado por ele como limite do **lote** |
| **RUA** | **15 %** de rampa | **só avisa** | prática dele |

**Nas palavras dele, sobre a rua:** *"trecho acima pode ser resolvido com
terraplenagem ou com mudança de traçado, e isso é decisão de projeto com custo,
que o motor não toma"*.

**Isto fecha a D91** com uma precisão que eu não tinha: os 30 % que o
`normas/br.ts` do Generate cita não eram "do terreno" de forma vaga — são **do
lote**. E o número da rua, que não existia em lugar nenhum da família, agora
existe, **e não é da mesma natureza**: um é lei, o outro é ofício (**D95**).

**O que mudou no meu comportamento, e é a parte que importa:** a régua da rua
**não ganhou veredito nenhum**. Há teste que reprova se alguém acrescentar um
campo `reprova`, `passa` ou `aprovado` ao bloco da via. A única linha deste
relatório que dá veredito é `lote.reprovaPelaLei` — e dá porque o Jonny disse
que dá.

---

## 2 · O bloco, igual para os quatro motores

| campo | o que é | para quem |
|---|---|---|
| `via.comprimentoAcimaDoLimite_m` | metros lineares de eixo acima de 15 % | Orçamento (serviço por metro) |
| `via.areaAcimaDoLimite_m2` | m² de leito — comprimento × caixa da via | Orçamento (terraplenagem) |
| `via.pctDoComprimento` e `pctDaArea` | os dois em % do total | tela do Generate (comparável entre motores) |
| `lote.areaAcimaDoLimite_m2` e `pctDaArea` | m² de lote acima de 30 %, e % da área vendável | Orçamento e tela |
| `lote.lotesComParteAcima` / `lotesPrincipalmenteAcima` | quantos têm **alguma** parte, e quantos têm **a maior parte** | tela |
| `lote.reprovaPelaLei` | **o único veredito do bloco** | tela |
| `via.pior` e `lote.pior` | valor, **id da peça** e **ponto** | tela (destacar no desenho) |

**Por que `lotesPrincipalmenteAcima` existe ao lado de `lotesComParteAcima`:**
porque um lote que encosta num talude por 2 m² não é o mesmo problema que um lote
inteiro na encosta, e a lei não distingue — mas quem decide o projeto distingue.
Em `completo`, os números são **95 contra 3**, **113 contra 3**, **67 contra 1**,
**49 contra 2**: quase tudo é borda (**D96**).

---

## 3 · A tabela

| gleba | motor | m rua > 15 % | % | m² lote > 30 % | % vend. | lotes | reprova |
|---|---|---:|---:|---:|---:|---:|---|
| `completo` | ortogonal | 1 202 | 9,7 % | **5 704** | 0,98 % | 95 | **SIM** |
| `completo` | espinha | 2 179 | 10,9 % | **7 153** | 1,10 % | 113 | **SIM** |
| `completo` | Parcelamento | 3 441 | 13,9 % | 3 595 | 0,85 % | 67 | **SIM** |
| `completo` | Symbios | **5 183** | **14,3 %** | **2 938** | 1,02 % | **49** | **SIM** |
| `sintetico-50ha-ondulado` | ortogonal | 10 | 0,1 % | 0 | 0 % | 0 | não |
| `sintetico-50ha-ondulado` | Symbios | 96 | 0,6 % | 0 | 0 % | 0 | não |
| `sintetico-10ha-plano` | todos | **0** | 0 % | **0** | 0 % | 0 | não |
| `ensaio-47ha` | Parcelamento | 50 | 0,8 % | 0 | 0 % | 0 | não |
| `ensaio-47ha` | Symbios | 700 | 4,5 % | 0 | 0 % | 0 | não |
| `geo-antonina` | ortogonal, espinha, Parcelamento | **0** | 0 % | 0 | 0 % | 0 | não |
| `geo-antonina` | Symbios | 157 | 0,3 % | 0 | 0 % | 0 | não |

### 3.1 · Os dois indicadores ordenam os motores AO CONTRÁRIO

Em `completo`, o único terreno onde os limites têm o que dizer:

| | mais rua em declive | mais lote em declive |
|---|---|---|
| 1º | **Symbios** — 5 183 m | **espinha** — 7 153 m² |
| 4º | **ortogonal** — 1 202 m | **Symbios** — 2 938 m² |

**O Symbios é o primeiro numa coluna e o último na outra.** Lido com cuidado:
ele **põe a rua na encosta e o lote no plano**, e a ortogonal faz o contrário —
rua curta em declive, mais lote sobre terreno inclinado.

**Qual dos dois é melhor é decisão de projeto, não de medição.** Rua em declive
vira terraplenagem de leito, que é obra do loteador; lote em declive acima de
30 % **reprova**, e aí não é questão de custo. A tabela põe os dois lado a lado
exatamente porque trocar um pelo outro é a escolha que alguém tem de fazer.

### 3.2 · Os quatro reprovam, e a área é pequena

**Todos os quatro motores reprovam pela lei em `completo`** — e a área envolvida
é **menos de 1,1 % da área vendável** em todos. É o caso em que um veredito
binário e um número contam histórias diferentes, e as duas são verdadeiras: **a
lei não tem faixa de tolerância**, e **1 % de área é um problema de ajuste, não
de partido**.

**O Lab não resolve essa tensão** — ela é de projeto. O que o bloco faz é não
esconder nenhuma das duas metades.

### 3.3 · A gleba plana é o controle

`sintetico-10ha-plano`: **zero** em todas as colunas, nos quatro motores. Régua
que acusasse declive em terreno plano estaria medindo a si mesma.

---

## 4 · O formato proposto para o Generate e o Orçamento

Em [`docs/provas/LAB-24/formato-proposto.json`](../provas/LAB-24/formato-proposto.json),
e **vai pelo chat** — o Lab não escreve nos repositórios deles.

Ele leva o esquema **e uma instância preenchida de verdade** (o caso de
`completo` com a candidata espinha). Proposta de formato sem exemplo é convite a
interpretar errado.

O que ele declara, além dos campos:

- **para que serve cada campo**, separado em *tela do Generate* e *entrada de
  custo do Orçamento*;
- **as unidades** — metro, metro quadrado, porcento, e `onde` no CRS da ENTRADA;
- **quatro regras**: `null` é não medido e nunca zero; **nenhum campo de via dá
  veredito**; `lote.reprovaPelaLei` é o **único** veredito; e **não há volume de
  corte e aterro** aqui, porque isso pede o greide projetado, que nenhum motor
  da família entrega.

**O último item é o mais importante da proposta**, e é o que evita o mal-entendido
caro: o Orçamento recebe **a área e o comprimento sujeitos a terraplenagem**, que
é a **entrada** do cálculo de volume, não o volume (**D97**).

---

## 5 · Na página do Jonny

Seção nova, *"Terreno em declive: o que vai dar terraplenagem"*, com:

- **a frase do para que serve**, como o chat pediu: comparar planos e estimar
  terraplenagem;
- **o quadro das duas forças**, dizendo qual reprova e qual avisa, e **por que** a
  da rua só avisa — nas palavras dele;
- **um quadro por terreno**, com os quatro motores, os metros, os m², as
  porcentagens e **o nome da peça pior** (`VT-02`, `L1655`) para achar no desenho;
- a ressalva de que **não calcula volume**.

Há teste para a seção, as duas forças, a frase *"a coluna da rua não diz 'passa'
nem 'não passa'"*, o nome da peça em cada linha e a ressalva do volume.

---

## 6 · Os vizinhos ficaram limpos

`git status` nos três clones de leitura: `urban-create-hub-41d93a4d`,
`motor-testfit` e `urban-scout-tool` — **nenhuma alteração**.

---

## 7 · O que fica pronto

- `src/terreno-indicadores.ts` — os dois limites com as fontes, a declividade
  medida **nas duas direções**, a fração do lote acima do limite, e o bloco;
- `ferramentas/lab24.ts`, `docs/provas/LAB-24/terreno.json` e
  `formato-proposto.json`;
- `tests/terreno.test.ts` — 17 testes, inclusive o que proíbe veredito na via;
- o bloco no `lab19.ts` (tabela) e a seção no `lab20.ts` (página do Jonny);
- a pergunta da rampa de rua **saiu** da lista do Jonny: ele a respondeu.
