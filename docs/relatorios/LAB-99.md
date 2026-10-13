# LAB-99 — Oito caminhos do `CLAUDE.md` não resolviam da raiz (item 900, dívida própria)

**Data:** 13/10/2026, disparo das 11:07 UTC · **Decisão:** D326 · **Conferido aqui, não no GitHub.**

## 1 · De onde veio a tarefa

A caixa só tinha o **900**, contado na `origin/main` depois do `git fetch`. As propostas da `FILA.md`
que não esperam ninguém tinham acabado no LAB-97, e o LAB-98 deixou escrito que *"a dívida própria tem
outras espécies a varrer"*. Fui a ela.

**A espécie achada: regra sem guarda.** A §6 do `CLAUDE.md` manda *"confira o CAMINHO e a FORMA do
que você lê"* — e nada conferia os caminhos que a própria página cita. Segui cada um a partir da
raiz, que é de onde o leitor da página (o chat no GitHub, a sessão nova) parte.

## 2 · O defeito, medido antes do conserto

A trava nova, rodada contra a página como ela estava, reprovou com oito caminhos:

```
caminho que não resolve da raiz: src/onde-esta-o-padrao.ts
caminho que não resolve da raiz: tests/limites-com-sujeito.test.ts
caminho que não resolve da raiz: symbios/adapter/ferramentas/navegador/index.html
caminho que não resolve da raiz: src/inventario-das-pontes.ts
caminho que não resolve da raiz: src/varredura-de-segredos.ts
caminho que não resolve da raiz: src/cobranca-por-uso.ts
caminho que não resolve da raiz: src/trava-de-estrutura.ts
caminho que não resolve da raiz: src/texto-das-regras.ts
```

**Não há `src/` nem `tests/` na raiz deste repositório**: os oito existem dentro de
`external-engines/esteira/` (sete) e `external-engines/symbios/` (um).

**De onde veio, medido pelo `git`:** contando `` `src/`` e `esteira/src` na página commit a commit,
o `CLAUDE.md` tinha **4 caminhos inteiros e 5 curtos** até o LAB-94 (`cdc71da`) e passou a **0 e 6**
no enxugar do LAB-95 (`099d0b4`). O enxugar encurtou o ponteiro para caber na meta, e nenhuma das
travas que ele montou olhava isso: elas conferem que a **regra** ficou e que o ponteiro de
**história** resolve — não que o **arquivo** citado existe. A história (`HISTORIA_DAS_REGRAS.md`)
guarda o texto antigo palavra por palavra, com os caminhos inteiros — por isso a conta *"zero linhas
perdidas"* estava certa e o ponteiro estava errado ao mesmo tempo.

## 3 · O que foi feito, arquivo por arquivo

| arquivo | o que mudou |
|---|---|
| `external-engines/esteira/src/caminhos-da-pagina.ts` | novo: `citados` lê os trechos entre crases fora dos blocos cercados e separa **caminho** (tem barra), **nome** (sem barra, com extensão) e **anatomia do motor**; `conferirOsCaminhos` devolve os problemas **e o tamanho do universo lido** |
| `external-engines/esteira/tests/caminhos-da-pagina.test.ts` | novo, **8 travas**: duas da leitura, cinco da régua dos dois lados (com o estado de antes como caso ruim), e a da página de hoje, com piso de universo |
| `CLAUDE.md` | os oito caminhos com o prefixo inteiro; seis linhas rearrumadas para não passar de ~100 colunas, **sem partir nenhuma frase que uma guarda casa** |
| `.github/workflows/verde.yml` | a trava nova na lista do `guardas-sem-clones` (lê só este repositório) |
| `external-engines/esteira/tests/nome-do-trabalho.test.ts` | a lista vai de 42 para **43** arquivos, com a linha do porquê |
| `external-engines/esteira/tests/recado.test.ts` | a trava que prova que o recado ausente reprova usava **`LAB-99`** como prompt inventado — e o LAB-99 passou a existir. Trocado por `LAB-9999`, com a linha do porquê: o inventado tem de ser um número que a fila não alcança, ou a trava vira bomba de data |
| `CLAUDE.md`, `ONDE_PARAMOS.md`, `FILA.md`, `verde.yml` (2×) | 719 → **727** travas — e quem obrigou foi a trava do LAB-98, que reconta por execução |
| `docs/provas/LAB-84` | regerada por `bun run lab84`: 43 de 43 passam sem os clones, 727 travas |
| `docs/provas/LAB-95` | regerada por `bun run lab95`: página **12 900** caracteres (meta 15 000), 79 regras × 79, zero linhas perdidas |
| `docs/provas/LAB-52`, `LAB-57`, `item-004` | regeradas por estado — tamanho do universo das varreduras e a linha nova da conta dos disparos |

## 4 · A trava, dos dois lados

- **Lado ruim, o estado real de antes:** os oito acima, 7 pass · 1 fail.
- **Sabotagem 1**, um caminho devolvido ao curto (`src/cobranca-por-uso.ts`): reprova e o nomeia.
- **Sabotagem 2**, uma pasta da anatomia com um erro de digitação (`upstrea/`): reprova **duas vezes** —
  o caminho que não resolve e a exceção declarada que a página deixou de citar.
- **Lado bom, depois do conserto:** 8 pass. Universo lido: **33 trechos** (23 caminhos, 7 nomes, 3 da
  anatomia).

## 5 · As escolhas que a regra não responde, e as que descartei

**Caminho resolve DA RAIZ, sem tolerância.** Aceitar `src/x.ts` porque existe
`external-engines/*/src/x.ts` é exatamente a tolerância que deixou o defeito passar: quem escreve sabe
de qual pacote fala, quem lê no GitHub não.

**Nome sem barra é nome, não caminho.** `verde.yml` e `tsconfig.json` aparecem na página como nomes
(*"pelos `paths` do `tsconfig.json`"*); a régua só cobra que algum arquivo tenha aquele nome. Há dois
`tsconfig.json` com os mesmos `paths` — os dois pacotes —, e a frase vale para os dois.

**A anatomia do motor é exceção declarada, e conferida nos dois sentidos.** `upstream/`, `archilly/`
e `adapter/` (§3, a regra de ouro) não são pastas da raiz: são as três pastas de dentro de cada motor.
A exceção só vale se a página as cita **e** se algum motor de `external-engines/` as tem; exceção que
não se confere dos dois lados vira porta.

**Descartei:** declarar uma convenção *"caminhos da página são relativos à esteira"* (metade da página
cita a raiz e outra parte cita três motores — convenção para metade é ambiguidade escrita); e varrer
nesta rodada as outras páginas (próxima seção).

## 6 · O que esta régua NÃO alcança, dito

- trechos com `<`, `*` ou espaço (molde, padrão, comando), extensão sozinha (`.md`, `.wasm`) e o que
  está dentro de bloco cercado;
- se o arquivo citado é o **certo** — ela diz que existe, não que é aquele;
- **qualquer página que não seja o `CLAUDE.md`.** Medi: `ONDE_PARAMOS.md` 9, `FILA.md` 38,
  `INDEX.md` 5 e `DECISOES.md` 70 linhas com caminho curto `` `src/…` `` ou `` `tests/…` `` — mas
  grande parte é relato datado de rodada, que não se reescreve. Separar o que é ponteiro vivo do que
  é história é trabalho de outra rodada; ficou **proposto** na `FILA.md`.

## 7 · Um achado de passagem: a `main` estava vermelha desde o LAB-98

A rodada de antes, na `main` intocada, deu **1 007 pass · 10 fail**, e não os *9 fail do `.wasm`* que
o LAB-98 publicou. A décima era a prova do LAB-57: `arquivosQueOGitCarrega` **571** na prova contra
**574** na árvore do `HEAD` — os três arquivos que o LAB-98 criou (o módulo, a trava e o relatório)
entraram no `git` **depois** de a prova ser regerada. É o mesmo mecanismo do achado (3) do LAB-95.
Aqui o `git add` veio **antes** de regerar; a prova de agora conta 576 contra 576.

## 8 · Conferido aqui, não no GitHub

`./external-engines/conferir.sh` nesta máquina, com os três vizinhos clonados com a história inteira
(eram rasos; aprofundei) e no `origin/main` (Generate `218f2b1`, Laboratório de Parcelamento
`2a3bb7b`, Geo `d5ae859`), `git status` limpo nos três ao fim:

- esteira **1 016 pass · 9 fail** (antes, na `main` intocada: 1 007 · 10 — §7); as 9 são todas do
  `.wasm` do Symbios (`ENOENT` no `archilly_symbios_wasm.wasm`), iguais antes e depois;
- testfit **17 · 0**; typecheck e lint limpos nos dois pacotes;
- `bun run lab84`: **43 de 43 passam sem os clones**, 727 travas;
- precondição do `.wasm` e prova de navegador falham **antes e depois**, iguais.

Receita da máquina nova, a mesma do LAB-96: `bun install --frozen-lockfile` na esteira e no
testfit, e o `zod` no clone do Generate por `npm pack zod@3` extraído em `node_modules/zod`. E este
próprio repositório veio **raso**: o `bun run lab95` recusou com a receita (D295), e foi preciso
`git fetch --unshallow`.

## 9 · O que fica

- **Nada depende do Jonny.**
- **Proposto ao chat / à minha lista:** os caminhos curtos nas outras páginas (§6).
