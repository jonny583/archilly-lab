# LAB-57 · O resto da varredura do D178 — e há TRÊS formas de desligar, não uma

**07/10/2026** · prompt da fila de 07/10, **o último**. A pergunta do chat: *existe OUTRA
configuração neste repositório que desliga conferência sem avisar?*

---

## 0 · A resposta, e o escopo vem antes dela

> **Sim, uma: `"lint": "eslint ."` sem `--max-warnings 0`.** Com a bandeira ausente, toda
> regra declarada com `"warn"` **aparece na saída e não reprova o passo** — e há uma, o
> `@typescript-eslint/no-explicit-any`, nos **dois** pacotes. Consertado aqui, com trava.
>
> **E duas que não estavam desligadas, estavam SEM MOTIVO ESCRITO:** o `skipLibCheck: true`
> dos dois `tsconfig.json`, numa linha sob um comentário que explica **outros dois flags**.

```
configuração que o git carrega .... 27 arquivos
   varridas ....................... 11
   fora do escopo, NOMEADAS ....... 16
linhas de configuração lidas ...... 647
arquivos de código varridos ....... 123   (34 166 linhas)
regras .............................. 6   (as três formas, duas cada)
```

**O escopo começa no `git ls-files`, não numa lista minha** — é a lição do LAB-47 (D164):
numa varredura, zero de régua parada é indistinguível de zero de árvore limpa. **E o que
ficou fora sai nomeado com o motivo:** o `upstream/`, que é intocável (§3); os lockfiles, que
prendem versão e não ligam conferência; e os `Cargo.toml`/`rust-toolchain.toml`, que o verde
cobre pela **precondição** do `.wasm` (D124) e não por conferência de tipo.

---

## 1 · As TRÊS formas de desligar conferência, e só a primeira é a óbvia

O D178 achou a primeira. Varrendo o resto, a classe tem três:

| forma | o que é | aqui |
|---|---|---|
| **a regra DESLIGADA** | `projectService: false`, `strict: false`, `"off"` | **0** — a do D178 foi consertada no LAB-52 |
| **a regra LIGADA QUE NÃO PODE REPROVAR** | `"warn"` num lint sem `--max-warnings 0` | **2**, nos dois pacotes — **consertado** |
| **o desligador SEM MOTIVO ESCRITO** | `skipLibCheck: true` sob um comentário que fala de outra coisa | **2** — **declarado** |

**A segunda é a mais silenciosa das três**, e é a que estava viva: o passo sai **verde** com
o aviso **impresso na tela**. Não há alarme a ouvir — há um alarme que ninguém lê.

**A terceira não é falsa, é muda** — e é a forma do D104 aplicada a configuração: o
comentário está lá, cobre as duas linhas de cima, e o leitor presume que cobre a de baixo.

---

## 2 · O conserto, e a medição que diz que ele não escondia nada

**`--max-warnings 0` nos dois pacotes.** E a medição antes de consertar: **zero avisos** em
`esteira` e em `testfit`. Então **nada estava sendo escondido hoje** — mas o mecanismo estava
vivo, e no dia em que um `any` aparecesse o verde continuaria dizendo VERDE.

> **Regra ligada que não pode reprovar é pior que regra ausente, pela mesma razão do D178:
> ela produz a aparência da conferência.**

**E a régua REFLETE o par, em vez de opinar sobre ele.** A mesma linha `"no-explicit-any":
"warn"` significa duas coisas opostas: com `--max-warnings 0` ela derruba o passo, sem ela
não. Então `regra-em-warn` recebe `lintReprovaAviso` — **medido no `package.json` do pacote**
— e deixa de acusar quando o par existe. *Achado que depende de outro arquivo não se resolve
por presunção.*

---

## 3 · O `skipLibCheck`, e por que ele FICA

Ele estava **nesta linha, logo abaixo** do comentário que explica
`noUncheckedIndexedAccess` e `exactOptionalPropertyTypes`. Atravessava sem declaração.

**Medido com `skipLibCheck: false`: ZERO erros, nos dois pacotes.** Então ele não esconde
nada. E **fica ligado assim mesmo**, pelo princípio que o próprio arquivo já escrevia três
parágrafos acima:

> *"Um typecheck que acusa erro alheio e não tem como consertá-lo é um typecheck que se
> aprende a ignorar."*

Com ele em `false`, uma atualização de `@types/*` derruba o verde por erro **dentro de
dependência**, que ninguém aqui conserta. A assimetria decide: **o que se perde é medido
(zero) e o que se arrisca não é.** Agora está escrito no arquivo, com a medição e com a
condição de revisitar — *o conserto da terceira forma é a declaração, não o desligamento.*

---

## 4 · E o comentário envelheceu DUAS ORDENS DE GRANDEZA (D196)

O mesmo comentário dizia:

> ~~*"Ligá-los aqui faz o `tsc` acusar **20 erros** dentro do repositório DELES"*~~ ·
> ~~*"O código deste adaptador foi escrito e **passou com os dois flags ligados**"*~~

**Remedido, ligando os dois flags: 1 604 erros.** Deles, **1 600 no repositório do Generate**
— e **QUATRO AQUI**:

```
ferramentas/lab03.ts:192    TS2532   Object is possibly 'undefined'
ferramentas/lab05.ts:328    TS18048  'q.areaRecortada_m2' is possibly 'undefined'
ferramentas/lab30.ts:109    TS2379   exactOptionalPropertyTypes
src/motores/generate.ts:130 TS2379   exactOptionalPropertyTypes
```

**A decisão não muda** — 1 600 erros alheios são o argumento inteiro —, **mas a segunda
metade da frase estava FALSA por quatro**, e isso é dívida declarada, não arredondamento.
Riscado e não apagado (D161), com os quatro nomeados por arquivo e linha.

> **Número dentro de comentário envelhece em silêncio, e este envelheceu oitenta vezes.**

---

## 5 · As duas formas que NÃO existem aqui, e o zero é MEDIDO

| | |
|---|---|
| `passo-que-engole-falha` | **0** — nenhum `\|\| true`, `continue-on-error`, `--passWithNoTests` no `conferir.sh`, no `verde.yml` ou nos `package.json` |
| `teste-desligado` | **0** — nenhum `.only(`, `.skip(`, `.todo(`, `xdescribe`, `xit(` em 123 arquivos |

**O `.only` merece a menção:** ele **reduz a suíte a um teste** e o resto sai verde **por não
ter rodado**. Seria a forma mais barata e mais destrutiva do D110, e há trava agora.

### E o `conferir.sh` NÃO tem `set -e` — isso é CERTO, e é o contra-exemplo do prompt

Ausência de `set -e` tem a cara exata do defeito desta classe, e aqui é a decisão certa: o §7
exige que o verde **rode todos os passos mesmo depois de um falhar**, porque quem conserta
quer a lista inteira. O script acumula `falhou=1` e sai `exit 1` no fim; cada passo passa pelo
`passo()`, e as duas guardas também setam `falhou`. **Há trava exigindo que `set -e` NÃO
apareça**, e que o acumulador e o `exit 1` continuem lá.

*Não é toda configuração frouxa que é defeito: é a frouxa e NÃO DECLARADA.*

---

## 6 · As CINCO LINHAS, para o chat distribuir à família

> **1.** Há **duas perguntas** sobre um texto de programa, e elas pedem **limpezas
> opostas**: *"o código FAZ isto?"* esvazia o conteúdo das strings, porque ali o código só
> **fala sobre**; *"a configuração DECLARA isto?"* **preserva** a string, porque é na string
> que a declaração mora.
> **2.** Ter as duas ferramentas não basta — **a pergunta decide qual delas**, e errar a
> pergunta é a mesma família de ler um nome no lugar errado da gramática.
> **3.** Medido, caro: no LAB-56 eu usei a de "código FAZ" para examinar uma **nota que era
> string**, e a sabotagem **passou** — um prompt depois de eu ter escrito a regra.
> **4.** O sintoma é sempre o mesmo: a régua fica **verde por não ter olhado**, e verde por
> não olhar é indistinguível de verde por estar limpo.
> **5.** O conserto é de método: **toda régua de texto declara, no próprio código, qual
> limpeza usa e por quê** — e a trava confere que a declaração existe.

---

## 7 · Entrega

| o quê | onde |
|---|---|
| a varredura, 6 regras como dado | [`src/varredura-de-configuracao.ts`](../../external-engines/esteira/src/varredura-de-configuracao.ts) |
| a ferramenta | [`ferramentas/lab57.ts`](../../external-engines/esteira/ferramentas/lab57.ts) · `bun run lab57` |
| as travas (11) | [`tests/configuracao.test.ts`](../../external-engines/esteira/tests/configuracao.test.ts) |
| a prova | [`docs/provas/LAB-57/varredura-de-configuracao.json`](../provas/LAB-57/varredura-de-configuracao.json) |

A prova **não mede gleba** — ela mede a árvore de configuração deste repositório —, então
entra na **lista declarada de exceções** do `regras.test.ts`, com o motivo, como as do LAB-47
e do LAB-52.

**Cinco sabotagens, cinco reprovações:** o lint voltando a não reprovar aviso; o
`skipLibCheck` perdendo o motivo; o número velho voltando ao comentário; o `conferir.sh`
passando a usar `set -e`; e **um `.only` plantado na suíte**.

A suíte vai de **494 para 505 travas** (488 no `esteira` + 17 no `testfit`); o CI sem clones
**continua em 114**.

**Nada foi escrito no vizinho.** Os três clones foram conferidos e estão limpos (§4):
`motor-testfit` em `4181e95`, `urban-create-hub-41d93a4d` em `5b7e9b4`, `urban-scout-tool` em
`f38dc0c`.

**E uma anotação de escopo que vale para a varredura de segredos:** quatro arquivos ignorados
existem em disco, todos artefato de build (`target/` do Rust, o `.wasm` do navegador). Mas o
`.gitignore` do **upstream** ignora `/.claude` e `.mcp.json` — dois nomes que costumam
carregar credencial. **Medido: nenhum dos dois existe.** Se um dia existirem ali, a varredura
de segredos (que lê `git ls-files --exclude-standard`) **não os verá**, e upstream é
intocável. Fica **declarado**, e a proposta de a varredura passar a NOMEAR o que é ignorado
vai à fila como *"proposto ao chat"*.

## 8 · As decisões

- **D194** — **há TRÊS formas de desligar conferência, e a segunda é a mais silenciosa**: a
  regra **ligada que não pode reprovar**. `"lint": "eslint ."` sem `--max-warnings 0` fazia
  toda regra em `"warn"` aparecer na saída e **não** derrubar o passo. Consertado nos dois
  pacotes, com trava. **Medido antes: zero avisos** — nada estava escondido, e o mecanismo
  estava vivo. *E a régua reflete o par em vez de opinar: `regra-em-warn` recebe
  `lintReprovaAviso`, medido no `package.json`, porque a mesma linha significa duas coisas
  opostas conforme o script;*
- **D195** — **desligador sob comentário que fala de outra coisa é a forma do D104 em
  configuração.** O `skipLibCheck: true` ficava logo abaixo do motivo de **outros dois
  flags**. Medido com `false`: **zero erros** nos dois pacotes — e ele **fica**, pelo
  princípio que o arquivo já escrevia (*typecheck que acusa erro alheio se aprende a
  ignorar*), agora **declarado**, com a medição e a condição de revisitar. *O conserto da
  terceira forma é a declaração, não o desligamento;*
- **D196** — **o número do comentário envelheceu oitenta vezes.** *"20 erros"* → medidos
  **1 604**, com **1 600 no vizinho** e **QUATRO AQUI** — e a frase *"o código deste
  adaptador passou com os dois flags ligados"* estava **falsa por quatro**. A decisão não
  muda; a dívida fica nomeada por arquivo e linha, e a frase velha **riscada, não apagada**
  (D161).
