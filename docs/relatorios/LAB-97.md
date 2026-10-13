# LAB-97 — A regra 2 do acesso ganhou guarda (item 900, a minha própria lista)

**Data:** 13/10/2026, disparo das 03:05 UTC · **Decisão:** D324 · **Conferido aqui, não no GitHub.**

## 1 · De onde veio a tarefa

A caixa só tinha o **900** (item contínuo: *trabalhe a sua própria lista quando a caixa
esvaziar*), contado na `origin/main` depois do `git fetch`. A lista desta casa é a
[`FILA.md`](../prompts/FILA.md), e a tarefa foi a **primeira proposta do LAB-96** (seção
*"Proposto ao chat, saído do item 029"*, item 1), que eu mesma tinha marcado como pegável pelo 900:

> **A regra 2 do acesso não tem guarda que a cumpra no código.** O vocabulário de recusa tem
> `"sem-via-publica"`, mas nenhuma função o produz.

**Por que esta e não outra:** das propostas abertas da FILA, é a única que **não espera ninguém**.
A do LAB-78 (parar a fileira externa) espera o olho do Jonny no desenho; a 2 do LAB-96 (classe do
custo no `ItemDeCusto`) muda o contrato de saída e é proposta ao chat; a 3 do LAB-96 espera dado do
arquivo de terreno; a do item 004 já foi desempatada (D244). E é da **primeira espécie** da dívida
própria: *regra sem guarda*.

## 2 · O defeito, medido antes do conserto

`avaliarPosicoes` (`external-engines/esteira/src/acesso-sugerido.ts`) recusava por duas razões só —
falta de declaração das faces e faixa de esquina. **Com as faces declaradas, uma posição sobre o
muro do vizinho passava como VÁLIDA**, e a `sugerirAcesso` a escolheria se ela rendesse mais lotes:
a sugestão *"plausível e impossível"* que o adendo do item 010 proíbe. A trava nova
"*o caso RUIM*" reprova contra o código de antes — está demonstrado na sabotagem (§4).

**Hoje era inofensivo**, e isso fica dito: nenhuma das sete glebas declara quais faces dão para via,
então toda posição caía antes na recusa por falta de dado. A prova do LAB-77 foi **reexecutada e
não mudou** (só o carimbo de hora, que eu não gravei — D182: prova que não mudou não se regrava).
O defeito estava a **um dado de distância** de sair: o dia em que o arquivo de terreno trouxer as
faces com via, que é exatamente o campo já pedido ao Generate no LAB-77.

## 3 · O que foi feito, arquivo por arquivo

| arquivo | o que mudou |
|---|---|
| `external-engines/esteira/src/acesso-sugerido.ts` | `sobreFaceComVia(ponto, anel, faces)` nova: projeta o ponto no anel e diz se a face onde ele cai dá para rua. `avaliarPosicoes` passa a recusar com `"sem-via-publica"` **antes** de olhar a faixa de esquina. `MOTIVOS_RESERVADOS` nova: lista fechada dos motivos que o vocabulário guarda e ninguém produz hoje, com o porquê — hoje só `"o-motor-recusou"` |
| `external-engines/esteira/tests/acesso-sugerido.test.ts` | 52 → **65** travas, em dois blocos novos: a regra 2 (oito) e o vocabulário sem palavra órfã, nos dois sentidos (cinco) |
| `docs/provas/LAB-52/varredura-de-chamadas.json` e `docs/provas/LAB-57/varredura-de-configuracao.json` | regeradas por estado: só o tamanho do universo mudou (linhas, bytes, parâmetros e campos lidos), nenhum achado — são função pura da árvore, D299 |
| `docs/DECISOES.md` | D324 |
| `docs/prompts/FILA.md` | a proposta 1 do LAB-96 marcada como feita |

## 4 · As provas — os dois lados, e as duas sabotagens

**Aprova o caso bom E reprova o ruim**, como o protocolo cobra de toda régua nova:

- no muro do vizinho (`(50, 100)` no quadrado com rua só no sul e no leste) → `sem-via-publica`;
- na rua, longe da esquina (`(50, 0)`) → válida;
- no muro perto de um canto que **não** é esquina → `sem-via-publica`, e não "faixa de esquina":
  **a regra 2 vem antes da 3**, senão o motivo dado a quem lê a curva seria o errado;
- a milímetros da divisa → projetado nela, o muro continua muro e a rua continua rua;
- faces declaradas **vazias** (`[]`, "nenhuma rua") recusam tudo pela regra 2 — e **não** pela falta
  de dado: lista vazia é medição, `null` é "não declarado" (D23);
- **regra 4:** a escolha do usuário atravessa até no muro;
- a **sugestão** nunca aponta para o muro, mesmo com o muro rendendo 999 lotes contra 10 da rua.

**Sabotagem 1** — desligar a verificação nova (`if (false && …)`): **4 travas reprovam**.
**Sabotagem 2** — trocar o motivo produzido por `"dentro-da-faixa-de-esquina"`: **4 reprovam**,
entre elas a do vocabulário (*"todo motivo NÃO reservado tem quem o produza"*). Nas duas, o arquivo
foi restaurado e a suíte voltou a 65 · 0.

## 5 · A escolha que a regra não responde, e as que descartei

**O ponto exatamente no vértice entre a rua e o muro conta como RUA.** É o fim da testada de rua,
e o fim da testada ainda é rua. Descartei o lado "conservador" (recusar o vértice): onde há esquina,
a faixa de 15 m já o recusa; onde não há, recusaria a ponta de uma rua de verdade e não protegeria
nada. A tolerância do empate é **1 mm**, da ordem do `TOL_DIVISA_M` do Generate.

**A trava do vocabulário procura o literal ao lado de `motivo:`**, e não a palavra em qualquer
lugar: o nome dentro de comentário não produz nada, e a régua de palavra solta passaria verde com o
próprio comentário que descreve a regra (D104). Ela recorta a declaração do vocabulário e a lista
dos reservados antes de procurar, e **tem trava própria provando que o recorte achou os dois
blocos** — senão leria a declaração como produção, que é o vigia que não vigia.

**`"o-motor-recusou"` foi para a lista dos reservados, e não para o código.** Ele também não tinha
produtor — **um segundo órfão, que a FILA não listava** e a trava nova achou na primeira rodada.
Produzi-lo exigiria rodar motor por posição, que o LAB-77 decidiu não fazer; apagá-lo do vocabulário
mexeria no que o LAB-77 desenhou para o dia em que a curva rodar. Declarar é o meio: fechado nos dois
sentidos, o dia em que alguém o produzir a trava cobra que saia da lista.

## 6 · Conferido aqui, não no GitHub

`./external-engines/conferir.sh` nesta máquina, com os três vizinhos clonados com a história inteira
e no `origin/main` (Generate `73b6430`, Laboratório de Parcelamento `bc2ca8c`, Geo `dfaf0be`),
`git status` limpo nos três ao fim:

- esteira **1 001 pass · 9 fail** (eram 988 · 9; +13 travas); as 9 são as mesmas do LAB-95 e do
  LAB-96, todas do `.wasm` do Symbios, que não existe nesta máquina;
- testfit **17 · 0**; typecheck e lint limpos nos dois pacotes;
- precondição do `.wasm` e prova de navegador falham **antes e depois**, iguais.

**Máquina nova, a mesma receita do LAB-96:** `bun install --frozen-lockfile` na esteira e no
testfit, e o `zod` no clone do Generate por `npm pack zod@3` extraído em `node_modules/zod`.

## 7 · O que fica

- **Nada depende do Jonny** — e, a pedido dele, nada desta casa volta a ele antes da integração.
- **Proposto ao chat, nada novo.** As propostas 2 e 3 do LAB-96 continuam como estavam.
- A lista desta casa, depois deste: as propostas que **não** esperam ninguém acabaram. O próximo
  disparo com a caixa só com o 900 deve procurar na dívida própria (as cinco espécies) antes de
  anotar disparo em vazio.
