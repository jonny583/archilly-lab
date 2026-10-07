# LAB-61 · A dívida própria com o que sobrou — e o que sobrou era A LISTA

**07/10/2026** · prova em
[`../provas/LAB-61/a-minha-lista-de-propostas.json`](../provas/LAB-61/a-minha-lista-de-propostas.json)
· **este prompt FECHA a fila de 07/10 (segunda)**

---

## A resposta, em uma linha

> **De 14 itens abertos na minha lista de propostas, CINCO já estavam executados — e DOIS
> eram cópias de itens riscados na mesma lista.**

E isso não é desarrumação de arquivo. **Aquela lista é o que o chat lê para escrever fila:**
quatro das filas que ele mandou saíram dela — *"três dos cinco saíram da minha própria
lista"*, *"é a quarta fila seguida assim"*. Se ele tivesse lido a lista naquele dia, poderia
ter **mandado de volta trabalho já entregue**.

---

## 1 · Onde eu PROCUREI a dívida — e a resposta foi medida, não escolhida

| onde | o que achei |
|---|---|
| `src/inventario-das-idas.ts`, categoria `divida` | **VAZIA** desde o LAB-37 (D138) — era a testada de frente, e foi paga |
| `src/inventario-das-pontes.ts`, `perda(...)` | são **perdas declaradas**, com motivo medido: não são dívida |
| `TODO`/`FIXME`/`XXX` no código | **ZERO** — este repositório não usa marcador de dívida em comentário, e é de propósito (D104) |
| `FILA.md`, *"Proposto ao chat — não executar"* | **aqui estava**, e é a pior das quatro |

---

## 2 · O que estava podre, com linha e número

Medido na árvore do commit `961890b`, **sem mudar nada** — e o "antes" sai do `git show`,
não da minha memória (D185):

```
ANTES: 27 itens · 13 riscados · 14 abertos · 18 PROBLEMAS
  aberto-sem-motivo .............. 14
  copia-de-item-riscado ...........  2
  proposta-que-vive-so-em-prosa ...  2
```

**Os CINCO que já estavam executados e seguiam abertos:**

| o item | quem o executou | como se sabe |
|---|---|---|
| *o conserto das 36 violações que são a minha ponte* (D166) | **LAB-53** | 128 → **92**, com a guarda (D180, D181) |
| *por que a passagem externa põe lote a 1,8 km* (D161) | **LAB-50** | **e era CÓPIA** do item riscado na mesma lista |
| *detector de prova velha para o LAB-25 e o LAB-30* (D156) | **LAB-49** | **e era CÓPIA** do item riscado na mesma lista |
| *um nome só para cada número do confronto* (D145) | **LAB-44** | o relatório existe e é o título dele |
| *CI para o comando único* (D125) | **LAB-38** | `.github/workflows/verde.yml` existe |

**E DUAS propostas viviam só em prosa** — as do LAB-59 e do LAB-60, nascidas nesta mesma
fila, em seções de relatório no meio de duas mil linhas. Proposta que o chat acha por sorte
não é proposta.

---

## 3 · A régua, e por que a CÓPIA pede DOIS sinais

A régua mora em `src/varredura-das-propostas.ts` e cobra **cinco** coisas:

1. item **riscado** diz **qual prompt** o executou (`✅ **executado no LAB-xx**`);
2. item **aberto** diz **por que** segue aberto (`**Segue aberto:** \`motivo\``), de um
   vocabulário **fechado** de seis motivos;
3. nenhum item aberto é **cópia** de um riscado;
4. nenhum motivo foge do vocabulário;
5. nenhuma proposta vive **só em prosa**.

### A cópia, e a régua que eu tive de ESTREITAR

A primeira versão casava **só pelo número da decisão**: item aberto que cita uma decisão já
citada num riscado era cópia. Ela achou as duas cópias de verdade — **e acusou uma terceira
que não é cópia**: o item do `faceDeRua` nulo cita `D156` porque foi o **LAB-43 que o
achou**, o mesmo prompt que propôs o detector de prova velha. Mesma origem, achado
diferente.

> **Régua que eu afrouxaria para caber no meu número é enfeite** (D172). Então ela foi
> **estreitada**, não o número: cópia é decisão compartilhada **E** título sobreposto.

E o título **não** se casa por igualdade — a cópia diz *"põe lote"* num item e *"o motor põe
lote"* no outro, e régua de título exato mede **ortografia** (D137). O que se mede é
**sobreposição de palavras significativas**, com limiar **0,6**. Os três casos, medidos na
árvore de antes:

| item | sobreposição com o riscado que compartilha a decisão |
|---|---|
| *a passagem externa do motor…* | **1,00** → cópia |
| *DETECTOR DE PROVA VELHA…* | **1,00** → cópia |
| *o `faceDeRua` nulo nos 33 lotes* | **0,00** → **não** é cópia |

*E o comentário do limiar dizia "1,00 e 0,88" na primeira versão, escrito de cabeça. Medido,
são dois 1,00 — e foi a própria ferramenta que desmentiu, dentro do prompt (D185).*

---

## 4 · A SABOTAGEM QUE PASSOU, e ela consertou a régua

> **A terceira sabotagem saiu `exit 0`.** Prova em
> [`../provas/LAB-61/sabotagem.json`](../provas/LAB-61/sabotagem.json).

Tirei de um item a citação de origem `(LAB-59)` e deixei só o caminho da prova. A ferramenta
**aprovou** — porque a conferência aceitava `texto.includes("LAB-59")`, e o nome do prompt
aparece em `docs/provas/LAB-59/contrafactual-de-antonina.json`.

> **Régua que lê MENÇÃO em vez da citação é o D142 outra vez.** Lá ela leu a palavra em vez
> do `import`; aqui, o caminho de arquivo em vez da origem.

Consertada para exigir a citação de **origem** — `(LAB-xx`, a forma que esta lista sempre
usou. Refeita a sabotagem: **`exit 1`**, com a linha nomeada.

**As outras duas pegaram de primeira:** devolver a cópia ao detector de um sinal derruba 2
travas de 19 (e o falso positivo do `faceDeRua` volta); devolver um item executado ao estado
aberto faz a **ferramenta parar** e derruba 3 travas.

---

## 5 · O que foi PAGO

```
AGORA: 29 itens · 18 riscados · 11 abertos · 0 PROBLEMAS

os 11 abertos, por motivo DECLARADO:
  prompt-novo ....................... 3
  nao-medido ........................ 3
  aguardando-outro-repositorio ...... 2
  depois-do-mvp ..................... 1
  aguardando-o-jonny ................ 1
  escopo-novo ....................... 1
```

- os **cinco** executados foram **riscados com o prompt que os fez**, e o texto de antes
  ficou ao lado — riscar, não apagar (D161);
- os **dois** que eram cópia dizem isso em cada um;
- os **nove** que seguem abertos ganharam o **motivo declarado**;
- as **duas** propostas que viviam só em prosa entraram na lista, com a citação de origem.

---

## 6 · Entrega

- **Régua:** `external-engines/esteira/src/varredura-das-propostas.ts`
- **Ferramenta:** `external-engines/esteira/ferramentas/lab61.ts` (`bun run lab61`) — ela
  **para** se a lista tiver problema, e o "antes" sai do `git show`
- **Travas:** `external-engines/esteira/tests/propostas.test.ts` — **19**, e elas entram no
  trabalho do CI que não precisa dos clones vizinhos
- **Provas:** `docs/provas/LAB-61/a-minha-lista-de-propostas.json` e `sabotagem.json`, as
  duas na lista declarada de exceções do §7 (não medem gleba)
- **Decisões:** D205, D206
- **O BALANÇO da fila** está em [`BALANCOS.md`](BALANCOS.md), §9 — gravado **junto** deste
  prompt, como a §1-B manda
- **Verde:** o comando único, sete passos, **584 travas** (567 esteira + 17 testfit), exit 0
- **Os três clones vizinhos ficaram limpos** (§4): `motor-testfit` em `4181e95`,
  `urban-create-hub-41d93a4d` em `5b7e9b4`, `urban-scout-tool` em `f38dc0c`, **zero alterações**
- **O despertador foi DESLIGADO** (`enabled: false`), não apagado — a fila esgotou, 4 de 4
