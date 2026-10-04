# LAB-44 · Um nome só para cada número do confronto

**04/10/2026 · `bun run lab28` + `bun run lab39` ·
`external-engines/esteira/src/acesso.ts`**

O chat aprovou, segundo da ordem: *"o nome único para cada número do confronto do acesso,
hoje com chaves diferentes em dois arquivos."* É o que o **D145** propôs durante o LAB-39.

---

## 1 · O defeito: os valores batiam, os nomes não

| a conta | tabela do LAB-19 | prova do LAB-28 |
|---|---|---|
| maior amplitude de um mesmo motor | `maiorAmplitude_pct` | `amplitudeDoAcesso_pct` |
| diferença entre os quatro motores | `entreOsQuatroMotores_pct` | `entreMotores_pct` |
| diferença entre os de lote | `entreOsMotoresDeLote_pct` | `entreOsDeLote_pct` |

> **Dois nomes para um número é meio caminho para dois números.**

No D116 eram duas **montagens** da mesma conta, e os valores divergiram (+29,12 % contra
+70 %). Aqui são dois **nomes** para a mesma saída, e **os valores batiam** — o que torna
esta forma mais sorrateira: nada acusava, porque não havia número errado. Só havia duas
maneiras de chamar o mesmo número em dois arquivos que o Jonny lê lado a lado.

---

## 2 · O conserto, e onde ele mora

**Valem os nomes da régua** (`ConfrontoDoAcesso`), e a ferramenta do LAB-28 **publica o
objeto inteiro** — `confronto` entra no JSON como a régua o devolveu, sem renomear no
caminho. Era o renomear ao publicar que criava o segundo nome.

A prova foi **regerada**, e os dois leitores perderam a tradução que existia só por causa
do defeito: `ferramentas/lab39.ts` e `tests/acesso.test.ts` agora leem `g.confronto`
direto.

---

## 3 · O que não é sobre nome: a lista virou DADO

```ts
export const CHAVES_DO_CONFRONTO = [
  "maiorAmplitude_pct",
  "entreOsQuatroMotores_pct",
  "entreOsMotoresDeLote_pct",
] as const;
```

**Tipo de TypeScript não existe em tempo de execução** — e era disso que o defeito
precisava para sobreviver num **arquivo publicado**: nenhuma trava podia conferir o JSON
contra um `interface`. Com a lista como dado:

- a **guarda confere as chaves do arquivo** contra ela;
- uma **trava de tipo** (`MesmasChaves`) impede que a lista e a interface divirjam — se
  uma ganhar ou perder chave sem a outra, **não compila**. O compilador cobra, em vez de
  eu lembrar.

**Provado por sabotagem, não por confiança:** renomeada uma chave na prova publicada, a
suíte vai de **31 verdes a 2 vermelhas** — a trava das chaves e, de carona, a do D144, que
não acha mais o número onde esperava. Desfeito, volta ao verde.

---

## 4 · Entrega

| o quê | onde |
|---|---|
| a lista como dado + a trava de tipo | `esteira/src/acesso.ts` |
| a ferramenta publicando o objeto da régua | `ferramentas/lab28.ts` |
| a prova regerada, com os nomes da régua | `docs/provas/LAB-28/acesso.json` |
| os leitores sem tradução | `ferramentas/lab39.ts`, `tests/acesso.test.ts` |
| a trava das chaves (+1) | `esteira/tests/acesso.test.ts` |
| decisão | **D157** |

**Verde:** `./external-engines/conferir.sh` — 7 passos, **401 travas** (eram 400), exit 0.

**Os clones vizinhos ficaram limpos** — `git status --porcelain` vazio nos três.

**A página do Jonny não mudou**, e é medição: ela lê a tabela do LAB-19, cujos nomes já
eram os da régua — o detector de página velha passou. **Não há `docs/provas/LAB-44/`:** a
prova deste prompt é a **prova do LAB-28 regerada** com os nomes certos, mais a trava; um
JSON novo só duplicaria o dado.

**Dois disparos do despertador caíram no meio deste prompt** (21:05 e 22:05) e os dois
foram atendidos pela mesma regra: *se o prompt anterior não fechou, termine-o antes de
começar qualquer coisa nova.*
