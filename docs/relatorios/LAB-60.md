# LAB-60 · A configuração do motor, SÓ DE LEITURA — as três formas conferidas lá

**07/10/2026** · clone `../motor-testfit` em `4181e95`, lido e **não tocado** · prova em
[`../provas/LAB-60/configuracao-do-motor.json`](../provas/LAB-60/configuracao-do-motor.json)

---

## A resposta, em uma linha

> **As três formas estão vivas no motor** — e a quarta coisa que eu medi vale mais que as
> três: **ele não tem CI nenhum**, então os passos `lint`, `typecheck` e `test` existem e
> **ninguém os roda sozinho**.

---

## 1 · A LISTA NUMERADA, para o chat levar ao motor

Nada foi consertado e nada foi escrito no clone (§4). Os três clones vizinhos ficaram
**limpos**, zero alterações — conferido pela própria ferramenta, que **para** se achar
alteração.

### 1 · A regra LIGADA QUE NÃO PODE REPROVAR — a mais silenciosa das três

O `lint` do motor é **`"eslint ."`**, sem `--max-warnings 0`. E o `eslint.config.js` dele
declara **uma regra em `"warn"`**: `"react-refresh/only-export-components": ["warn", {…}]`.

> Essa regra **aparece** na saída do lint e **não derruba** o passo. Era exatamente o que
> este repositório tinha até o LAB-57, nos dois pacotes.

**O conserto:** acrescentar `--max-warnings 0` ao script de `lint` e tratar o que ele passar
a reprovar. Medido aqui antes do conserto: **zero avisos**, então nada estava escondido — mas
o mecanismo estava vivo.

### 2 · A regra DESLIGADA

- **1 regra de lint em `"off"`**: `"@typescript-eslint/no-unused-vars": "off"`
  (`eslint.config.js:41`);
- **1 desligador de conferência**: `"skipLibCheck": true` (`tsconfig.json:22`).

Nem toda regra desligada é defeito. **Desligada sem motivo escrito é que envelhece em
silêncio**, e é o D104 aplicado a configuração. **O conserto:** escrever o motivo ao lado,
no próprio arquivo, com a condição de revisitar — foi o que este repositório fez no LAB-57
e, para o `no-undef`, neste prompt.

### 3 · O desligador SEM MOTIVO ESCRITO

`skipLibCheck: true` está no `tsconfig.json` dele **sem comentário na linha nem acima dela**.
Ele salta a conferência de tipo **dentro das dependências**. Pode ser a escolha certa — é a
desta casa —, mas aqui ela é **medida e declarada**: com `false` dá **zero erros** nos dois
pacotes, e fica ligada porque sem ela uma atualização de `@types/*` derruba o verde por erro
dentro de dependência.

**O conserto:** medir com `false` e escrever o número ao lado da chave. Se der erro, o número
é o argumento.

### 4 · O CONTEXTO, e ele vale mais que as três

**Não existe `.github/workflows/` no motor.** O `package.json` dele declara `lint`, `test` e
`typecheck` — e **nada os roda sozinho**.

> **Regra que não pode reprovar e regra que ninguém roda falham do mesmo jeito**, e a segunda
> é a que este repositório pagou **duas semanas** para aprender: a suíte do `testfit` ficou
> vermelha, 14 de 14, porque eu rodava só o outro pacote (D110).

**O conserto:** um trabalho de CI que rode os três em todo push, e que **falhe com a receita**
se faltar alguma coisa — nunca pule (D124).

### 5 · O que a régua de texto NÃO alcança, enumerado

Padrão de texto só acha o nome que alguém escreveu nele. Então há uma segunda passagem que
**lê o JSON e classifica toda chave booleana** de `compilerOptions` — **41 chaves
examinadas** nos três arquivos:

| arquivo | chaves | afrouxam |
|---|---|---|
| `motor-testfit/tsconfig.json` | 21 | `skipLibCheck=true`, **`noUnusedLocals=false`**, **`noUnusedParameters=false`** |
| `esteira/tsconfig.json` | 10 | `skipLibCheck=true` |
| `testfit/tsconfig.json` | 10 | `skipLibCheck=true` |

**As duas em negrito a régua de texto não vê** — o `oQueNaoPega` da regra sempre disse
*"desligador escrito com outro nome"*. O `tsconfig` dele é, no mais, **mais estrito que o
desta casa**: `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`,
`noImplicitOverride`, `noImplicitReturns` e `noPropertyAccessFromIndexSignature` todos
ligados. Isso vai dito porque a lista não é um veredicto sobre o repositório dele.

### 6 · O desligador POR ARQUIVO — e aqui a maioria NÃO é item

A régua achou **4** `@ts-nocheck`/`eslint-disable` no código dele. **Zero viram item**, e
isso foi **medido antes de não acusar** (D184):

| arquivo | por que não é item |
|---|---|
| `src/routeTree.gen.ts` (×2) | é arquivo **GERADO** pelo nome (`.gen.`): o conserto não sobreviveria à próxima geração |
| `tests/fixtures/render/estudo-importado.ts` | está nos `ignores` do `eslint.config.js` **dele**, com o motivo escrito |
| `tests/fixtures/render/zip.ts` | idem |

---

## 2 · O ESCOPO, como número

| | |
|---|---|
| arquivos que o git **dele** carrega | **369** |
| configuração encontrada | **12** |
| varrida | **10** |
| fora do escopo, **nomeada** | **2** (`bun.lock` e `vendor/archilly-central/package.json`) |
| linhas de configuração lidas | **313** |
| arquivos de código varridos | **112** (**18 458** linhas) |
| chaves de `compilerOptions` examinadas | **41** |
| regras | **7** |

O escopo começa no `git ls-files` **dele**, não numa lista minha, e o que ficou fora sai
nomeado com o motivo (D164). A régua é a **mesma** do LAB-57 — medir o vizinho com outra
régua não compararia nada.

---

## 3 · A VIAGEM CONSERTOU A RÉGUA, e isso é o achado de método

> **Régua que nunca saiu de casa não sabe o que não vê.**

Apontada ao clone, a varredura de seis regras disse **zero regras desligadas** e **zero em
`"warn"`** num `eslint.config.js` que traz **as duas escritas**. Três defeitos meus, em
cadeia:

### 3.1 · O cabeçalho prometia `"off"` e nenhuma regra o procurava

A varredura abre dizendo que a forma 1 é *"`projectService: false`, `strict: false`,
`"off"`"*. **Nenhuma das seis regras procurava `"off"`.** A promessa só foi desmentida quando
a régua saiu de casa. Nasceu a **`regra-em-off`** — e ela achou **dois desligadores neste
repositório** que seis regras não tinham visto (`"no-undef": "off"` nos dois
`eslint.config.js`), agora com o motivo escrito no próprio arquivo.

### 3.2 · O `regra-em-warn` só via uma das duas sintaxes

O padrão exigia a string **solta** depois dos dois pontos. **A forma de array é a normal
quando a regra tem opção** — `["warn", { … }]` passava invisível. É o D137: *régua que casa
por nome exato mede ortografia, não conteúdo.*

### 3.3 · A limpeza COMIA ARQUIVO INTEIRO, e a causa é um glob

**Este é o pior dos três.** A `semComentarios` eram duas regex, e a de bloco é
`/\/\*[\s\S]*?\*\//`. O `eslint.config.js` do motor traz `files: ["**/*.{ts,tsx}"]` — que
contém a sequência de **abre-comentário** — e, mais abaixo, `files: ["scripts/**/*.ts"]` —
que contém a de **fecha**. A regex casava **de dentro de uma string até dentro de outra** e
apagava **tudo no meio**, inclusive o bloco `rules` inteiro.

> **Limpeza que não sabe onde a string começa não limpa: ela corta.** E o corte é um falso
> **NEGATIVO** — a espécie do D164, em que zero de régua cega é indistinguível de zero de
> árvore limpa.

**O mesmo valia aqui**, em menor grau: `"node_modules/**"` tem abre e `"**/*.d.ts"` tem
fecha. Os dois `eslint.config.js` desta casa vinham sendo parcialmente apagados antes de
qualquer casamento, e a sorte foi a região cortada não cobrir o `"no-undef": "off"`.

**O conserto:** a `semComentarios` passou a ser um **varredor** que anda o texto uma vez
sabendo em que estado está — fora, comentário de linha, comentário de bloco, ou dentro de
`'`, `"` ou crase. O conteúdo de string é **preservado**, que é o que a separa da
`soOCodigo`. **O que ele não alcança vai dito:** literal de expressão regular que contenha
abre-comentário — distinguir isso de uma divisão exige a gramática inteira, e os padrões
deste repositório moram em `String.raw`, que o varredor acompanha.

*E uma ironia registrada: a primeira versão desse comentário trazia o exemplo do literal de
regex escrito por extenso, e a sequência de fecha-comentário dentro dele **fechou o próprio
comentário**. O `tsc` pegou na hora — é o D175 do lado bom.*

---

## 4 · A PROVA DO LAB-57 ESTAVA VELHA NO MOMENTO EM QUE FOI COMMITADA

Medido ao começar este prompt, no commit `4249027`, **sem mudar nada**:

| | a prova commitada dizia | a ferramenta dizia, na mesma árvore |
|---|---|---|
| `conferencia-desligada-por-arquivo` | **1** | **10** |

**A causa:** o último `bun run lab57` do LAB-57 rodou **antes** das edições finais daquele
mesmo prompt — as que escreveram os literais `@ts-ignore`, `@ts-nocheck` e `eslint-disable`
no texto dos declarados e na documentação da régua. A prova ficou com o número de antes, e
`naoDeclarados: []` era verdade **naquele instante**.

**E os 10 eram, 9 deles, a régua acusando o próprio fonte** — a sub-família do D155. A única
limpeza que resolveria (tirar comentários) **cegaria essa regra por completo**, porque é
dentro de comentário que o desligador vive. Então a exclusão é a mesma que a varredura de
segredos do LAB-47 já declara — *"nem o fonte dela própria"* —, e é **estreita**: só o
arquivo que define os padrões e as ferramentas e travas que publicam as chaves de achado.

**Depois do conserto, aqui:** 5 achados, **todos declarados**, `naoDeclarados: []`.

> **Prova gerada antes da última edição do que ela mede é prova velha — e nada no verde
> reprovava isso.** A trava que existe hoje confere a prova contra si mesma; ela não
> **regera** a varredura. Fica proposto ao chat: uma trava que reexecuta a varredura e exige
> que a prova bata.

---

## 5 · Entrega

- **Ferramenta:** `external-engines/esteira/ferramentas/lab60.ts` (`bun run lab60`)
- **Régua compartilhada, consertada:** `src/varredura-de-configuracao.ts` (7 regras, era 6) e
  `src/varredura-de-chamadas.ts` (`semComentarios` virou varredor)
- **Travas:** `external-engines/esteira/tests/configuracao-do-motor.test.ts` — **16**, e elas
  entram no trabalho do CI que não precisa dos clones vizinhos
- **Provas:** `docs/provas/LAB-60/configuracao-do-motor.json` e `sabotagem.json`, as duas na
  lista declarada de exceções do §7 (não medem gleba)
- **Decisões:** D202, D203, D204
- **Verde:** o comando único, sete passos, **565 travas** (548 esteira + 17 testfit), exit 0 — e
  o `--max-warnings 0` que o LAB-57 pôs **reprovou este prompt uma vez**, por espaço irregular
  num comentário: a segunda forma, agora capaz de reprovar, cobrando
- **Os três clones vizinhos ficaram limpos** (§4): `motor-testfit` em `4181e95`,
  `urban-create-hub-41d93a4d` em `5b7e9b4`, `urban-scout-tool` em `f38dc0c`, **zero
  alterações nos três** — e a própria ferramenta **reprova** se achar alteração
