# LAB-95 · O `CLAUDE.md` enxugado: **52 383 → 18 527** caracteres, **79 regras**, **zero** linhas perdidas

**Prompt:** item **028** da caixa de entrada (pedido expresso do Jonny). · **Rodada:** despertador
das **15:08 de 12/10/2026** (UTC). · **Conferido aqui, não no GitHub** (§7).

> **O item NÃO está marcado como FEITO**, e é ele que manda assim: a meta é **15 000** caracteres,
> ficou em **18 527**, e *"não marque como FEITO até a meta: o próximo despertador continua este
> mesmo item."* O que está entregue está na `main`, verde. O que falta está no §6 deste relatório,
> **com número**.

---

## 1 · O passo que o item pediu primeiro: as guardas que leem o `CLAUDE.md`

| guarda | o que ela cobra | mudou de alvo? |
|---|---|---|
| `tests/regras.test.ts` | a §1-B existe, nomeia o `BALANCOS.md` e traz a razão dela | não |
| `tests/limites-com-sujeito.test.ts` | toda regra de forma diz **de que** é o limite; as seis seções de regra; a citação da Central é fonte | **sim** — a narrativa que ela usava como objeto saiu, e **a sabotagem foi refeita** (D319) |
| `tests/aritmetica-da-regra.test.ts` | a aritmética da tabela do ponto cego | **sim** — passou a ler a história (D318) |
| `ferramentas/lab63.ts` | publica a prova dessa aritmética | **sim** — pela **mesma função** da trava |
| `tests/disparos-em-vazio.test.ts` | a §1-A não manda desligar; o motivo velho riscado; os dois lugares | não |
| `tests/custo-por-uso.test.ts` | a §4-A: a ordem, as oito consequências, as três faixas | não |
| `tests/trava-de-estrutura.test.ts` | a §4-A diz se a trava é de palavra ou de estrutura | **sim** — lia a frase **crua** e o refluxo a quebrou (D320) |
| `tests/vazamento-de-custo.test.ts` | o `CLAUDE.md` é **registro** na varredura de custo | não |
| `tests/por-lugar.test.ts` | o que está parado no `CLAUDE.md`, com a marca de cada coisa | não — **mas ela pegou uma perda minha** (§4) |
| `ferramentas/lab81.ts` | o bloco de código dentro das seções de regra | não |

**Nove guardas e uma ferramenta leem a página; quatro mudaram de alvo**, e as três que quebraram
**quebraram por defeito delas, revelado pelo refluxo** — não pela mudança de lugar do texto.

---

## 2 · A conta, que é o entregável (D317)

| | antes | depois |
|---|---|---|
| **`CLAUDE.md`** | **52 383** caracteres (54 063 bytes) | **18 527** — **−64,6 %** |
| **`docs/HISTORIA_DAS_REGRAS.md`** | não existia | **56 483** |
| **regras no inventário** | **79** | **79** |
| **linhas do texto antigo perdidas** | — | **ZERO** |

**A história foi montada movendo as seções INTEIRAS, literais**, como estavam em `490c102` — onze
seções, uma por regra (`H1` a `H11`), cada uma dizendo em cima que é história e onde a regra vive
hoje. É por isso que *"zero linhas perdidas"* é **conferível**: a conta compara **linha por linha**
o texto antigo contra os dois arquivos de hoje, e a prova grava o `sha256` do antigo.

**E a conta das regras é dos DOIS lados** — é o que a faz uma conta e não uma declaração:

- a marca está no `CLAUDE.md` de hoje → **a regra continua valendo**;
- a marca está na história → **a regra existia antes**.

*Faltar no primeiro é regra apagada; faltar no segundo é lista inventada. Uma régua que olhasse um
lado só aprovaria exatamente o erro que o item proíbe.*

---

## 3 · O que o enxugar REVELOU: três instrumentos que casavam texto gravado

**Nenhum dos três quebrou por causa da mudança de gaveta.** Os três quebraram porque **refluir o
texto é o teste natural de toda régua que casa frase** — e eles não o tinham passado nunca.

1. **a sabotagem do D218 parou de morder em silêncio** (D319): ela achava o fim da frase por
   `"(D218)."`, que o enxugar tirou de dentro da frase. `indexOf` deu `-1`, o recorte montou um
   texto que a régua não acusava, e o teste **passou**. *Sabotagem que não acha o que sabotar é um
   teste que passa* — e ela falha para o lado que diz que está tudo bem. Refeita, e agora **afirma
   que achou o alvo** antes de sabotar;
2. **uma trava acusou a página de não trazer uma regra que estava ali** (D320, décima vez da família
   do D248): `toContain` cru contra uma frase que o refluxo quebrou em duas linhas. O conserto já
   existia nesta casa — `aRegraEstaEscrita` —, e o inventário novo nasceu usando-o;
3. **a régua do limite lê por FRASE, e a frase sabotada tinha ficado colada à anterior** por `**.`:
   as duas viravam uma, e o sujeito da primeira cobria a segunda. A §1 foi repontuada. *Pontuação
   não é estilo quando uma régua divide por ponto final.*

---

## 4 · E uma guarda achou uma perda minha, que é o serviço dela

Ao encurtar a §1-C eu escrevi *"Esta regra é comportamento de sessão e NÃO espera o kit."* e **deixei
cair a segunda metade** — *"a regra vale assim mesmo; o kit, quando chegar, é outro item"*.

A `por-lugar.test.ts` reprovou: `marca-ausente: CLAUDE.md não traz mais "o kit, quando chegar, é
outro item"`. Ela guarda **as oito coisas paradas** desta casa, cada uma com a marca que a
identifica — e o kit é uma delas.

> **Encurtar apaga, e apagar é a única forma de errar este item.** A frase voltou. *A guarda que
> achou não lia o `CLAUDE.md` à procura de regra: ela lia à procura de uma coisa parada — e foi
> por isso que pegou.*

---

## 5 · O que NÃO mudou

- **nenhum comportamento, nenhum código de produto, nenhum `vendor/`, nenhuma tarefa agendada**;
- **nenhuma regra foi reescrita "para melhorar"** — encurtada, sim; de sentido, nenhuma;
- **nada foi apagado:** o que saiu da página foi **movido**, e a conta prova.

---

## 6 · A meta não foi alcançada, e o chão está medido (D321)

> **⚠ Esta seção estava errada — ver §8 e a D322.** A meta cabia: 12 706 caracteres, no despertador seguinte.

**Ficou em 18 527; faltam 3 527.** O que impede, pedaço por pedaço:

| caracteres | o que é |
|---|---|
| **1 285** | a citação literal da Central (§1-C) |
| **387** | a citação literal do Jonny (§4-A) |
| **200** | o molde do recado — é o formato que a §1 manda seguir |
| **36** | o comando do verde |
| **565** | a lista de onde mora cada coisa — o item a pediu explicitamente |
| **2 473** | **soma do que não se corta nem se edita** |

Sobram **16 054** para **79 regras**, títulos e ponteiros: **203 caracteres por regra**.

> **Baixar de 15 000 exige tirar regra ou editar citação literal — e o item proíbe as duas.** Então
> o que falta não é esforço de redação: **é uma decisão que não é minha.**

**As duas saídas, e as duas são do chat:**

1. **a meta muda** para o que o conteúdo permite (18 500 corta 64,6 %, que já é a alavanca que o
   item buscava);
2. **alguma regra sai da página** e passa a viver só na história — e aí *regra que vira uma frase
   continua sendo regra, mas regra que sai da página deixa de ser lida.*

Não escolhi por conta: é a §4 desta casa (*não decide urbanismo* tem irmã — **não decide o que a
própria página deixa de mandar**).

---

## 7 · Entrega

- **arquivo novo:** [`docs/HISTORIA_DAS_REGRAS.md`](HISTORIA_DAS_REGRAS.md) — onze seções, índice,
  e cada uma com o texto literal que saía do `CLAUDE.md`;
- **prova:** [`docs/provas/LAB-95/nada-se-perdeu.json`](../provas/LAB-95/nada-se-perdeu.json) — as
  três contas, o inventário das 79, o `sha256` do antes e o chão por pedaço;
- **inventário e régua:** `src/enxugar-o-claude.ts`; a leitura da história num lugar só:
  `src/historia-das-regras.ts`; ferramenta `bun run lab95`;
- **trava:** `tests/enxugar-o-claude.test.ts` (13, no portão), com os dois sentidos: regra tirada da
  página reprova, marca que não existia antes reprova, ponteiro sem seção reprova;
- **decisões:** **D317** (a conta), **D318** (a guarda que mudou de alvo), **D319** (a sabotagem
  refeita), **D320** (o texto cru) e **D321** (a meta não alcançada, com o chão);
- **o portão sem clones:** 41 → **42 arquivos**, 685 → **698 travas**, medidas por execução;
- **nada escrito em repositório vizinho**; os **seis** clones limpos;
- **o item 028 continua ABERTO**, por ordem dele;
- **verde:** o comando único, **conferido aqui, não no GitHub**.

---

## 8 · O segundo despertador (19:07): a meta alcançada, e a D321 desmentida (D322)

**12 706 caracteres** (meta 15 000), **79 regras × 79**, **zero linhas perdidas**, citações
literais intactas. O item 028 está **FEITO**.

**A §6 deste relatório estava errada.** Ela dizia que baixar exigia tirar regra ou editar citação.
Os *"203 por regra"* eram o gasto da redação de então, e eu os li como o mínimo. **Medido tentando:**
as mesmas 79 cabem a ~130 por regra. A conta do chão segue de pé (agora 2 308: 1 285 + 387 + 200 +
36 + ~400 da lista de onde mora cada coisa, que perdeu palavras e nenhum item).

**O que se cortou, por seção:** a §6 virou uma lista de onze linhas (era uma por regra, cada uma com
o relato); a §4 e a §7 perderam o relato que ainda carregavam; a §1-B e a §1-A viraram parágrafo;
as citações da §1-C e da §4-A não foram tocadas.

**As guardas que acusaram, e o que cada uma pegou:**

| guarda | o que acusou | conserto |
|---|---|---|
| `tests/regras.test.ts` | a frase *"698 travas que leem arquivo do próprio repositório"* sumiu da página | voltou — **numa linha só**, porque a régua casa a frase sem atravessar quebra |
| `tests/custo-por-uso.test.ts` | a §4-A deixou de dizer que contratar acontece **fora da árvore** | voltou, com *"guarda que não declara o próprio buraco mente pelo silêncio"* |
| `bun run lab95` | duas linhas de abertura do texto antigo que **não estavam na história** e iam se perder | voltaram literais |

**E uma que estava vermelha na `main` antes de eu mexer:** `configuracao.test.ts` (LAB-57) contava
**569** arquivos na árvore contra **568** na prova — o `docs/caixa-de-entrada/900.md`, escrito pela
direção às 14:25, entrou depois da última regeração. Regerada (`bun run lab57`). A do LAB-81 também
foi regerada: ela publica as linhas das seções de regra da página, e a página mudou.

**Três nuances que eu cortei e devolvi por conta própria**, lendo o diff antes de enviar: o
*"nunca `Lab`"* do nome do aplicativo no recado, o *"quem roda o verde completo é a sessão, antes do
commit"* e o buraco declarado da guarda da §4-A. *Encurtar apaga — e a lista de marcas não cobre
tudo o que uma frase dizia.*

**Verde, conferido aqui, não no GitHub — com um buraco desta máquina, dito:** o `.wasm` do Symbios
não pôde ser compilado aqui (o `rust-toolchain.toml` fixa a 1.96.1 e o host `static.rust-lang.org`
está bloqueado pela política de rede desta sessão). Então a **precondição**, a **prova no navegador**
e os testes que carregam o `.wasm` falham **antes e depois** desta mudança, iguais; **todo o resto
passa**. Esta entrega mexe só em texto, e nenhuma das travas que o `.wasm` sustenta lê o `CLAUDE.md`.
