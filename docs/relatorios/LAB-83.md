# LAB-83 · O CARIMBO SAI DO MÓDULO RESOLVIDO — e o que não tem módulo a resolver diz isso

**Prompt:** item **016** da caixa de entrada. · **Rodada:** despertador de 10/10/2026. ·
**Conferido aqui, não no GitHub** (§7).

---

## 1 · A remedição primeiro, como o item mandou — e ela mudou o TAMANHO do conserto

O item abre com uma ordem de método: *"remeça primeiro, como você fez no LAB-82 — foi a remedição
que achou este buraco, e ela custa pouco: se o carimbo já estiver certo em algum caminho, isso muda
o tamanho do conserto antes de ele começar."*

Medido, antes de uma linha de conserto:

| vizinho | aparece em `paths`? | ponto de entrada |
|---|---|---|
| `motor-testfit` | sim, `@testfit/*` | `@testfit/api.ts` |
| `urban-create-hub-41d93a4d` | sim, `@generate/*` | `@generate/contratos/motor-v1/index.ts` |
| `urban-scout-tool` | **não** | **nenhum** |

**De três vizinhos, DOIS têm módulo a resolver e UM não tem.** O Geo não entra em `paths` nenhum
porque este laboratório **lê GeoJSON dele, de `docs/terrenos/`, e não código** — não há `import`
a resolver, porque não há `import`.

> **Carimbo que não tem módulo a resolver não é um carimbo pior: é um carimbo de outra pergunta.**

Para o Geo o carimbo honesto continua sendo o do caminho por convenção — e o conserto é fazê-lo
**dizer que é**, em vez de parecer igual aos outros dois. É por isso que o campo novo não é um
booleano: é `de: "modulo-resolvido" | "convencao"`.

*Se eu tivesse começado pelo código, teria escrito um resolvedor para três e descoberto no terceiro
que não havia o que resolver — e a saída provável seria um `catch` silencioso, que é o oposto do
que o item pede.*

---

## 2 · O conserto, com os três nomes que o item deu (D276)

1. **o carimbo sai do módulo resolvido.** `raizDoModuloResolvido()` chama o resolvedor no ponto de
   entrada declarado e sobe o diretório até achar a raiz de git (`raizDeGitAcima()`). É a mesma
   régua com que o LAB-82 conferiu que o repoint do `tsconfig` tinha pegado;
2. **o `HEAD` do caminho por convenção virou uma SEGUNDA linha**, em `pelaConvencao: { caminho,
   commit }`. Ele não desapareceu porque responde **outra** pergunta — *"que árvore está no
   disco"* — e essa pergunta continua valendo;
3. **divergindo, a prova diz as DUAS**, com `divergem: true` ao lado. A divergência é a notícia.

**O resolvedor é um parâmetro**, com `import.meta.resolve` por padrão. Não foi por elegância: é o
que permitiu **demonstrar** a divergência sem repontar o `tsconfig` de ninguém.

### A divergência foi DEMONSTRADA, não prevista

Apontando o `@testfit/` ao clone do rascunho em `3680b9f` — o mesmo repoint do LAB-82 — o carimbo
diz:

```
motor-testfit   de=modulo-resolvido  commit=3680b9f  convenção=6cf6396  DIVERGEM=true
```

É exatamente o caso do D274, agora **relatado em vez de escondido**: antes desta rodada a mesma
situação carimbava `6cf6396` e calava. **O texto da fixture não vai à prova** — vai o veredicto
(D262); a prova publica *"divergência RELATADA, com o commit do módulo e o da convenção lado a
lado"*, e não as linhas da montagem.

### E a trava do carimbo deixou de depender de REDE

A trava nova chamava `carimbarVizinhos()`, que faz `git fetch` nos três clones, e **estourou o
limite de 5 s do Bun**. O `fetch` passou a ser parâmetro, ligado por padrão; a trava passa `false`,
porque a pergunta dela é *de onde o carimbo saiu* e isso não precisa de rede. **De 5,9 s a 154 ms.**

> **Trava que depende de rede não reprova o código: reprova a conexão.**

---

## 3 · A ADOÇÃO, medida — porque o item mandou a medição decidir o escopo

A ressalva do item é a parte que manda: *"o escopo deste item é o CARIMBO, não a reescrita das
provas… quantas provas usam clone, quantas passam a trazer as duas linhas, e quantas ficam para
depois — com o motivo. Item que reescreve sessenta provas numa rodada é item que ninguém revisa.
Se a conta disser que a adoção cabe toda aqui, cabe; quem decide é a medição."*

| a conta | quanto |
|---|---|
| provas no repositório | **72** |
| provas que carimbam clone vizinho | **5** |
| ferramentas que chamam o carimbo | **2** (`lab68.ts`, `lab76.ts`) — e a `lab83.ts` desta rodada |
| provas que passam a trazer as duas linhas **agora** | **2** (`LAB-68/as-duas-pilhas.json`, `LAB-76/registro-de-motores.json`) |
| provas que ficam para depois | **ZERO** |

**A adoção cabe, e cabe porque é pequena** — não porque eu quis. O conserto é numa **função**, e as
provas que a usam são poucas. As outras **67** não carimbam clone nenhum: nelas não há nada a
adotar, e não houve prova reescrita. As três já carimbadas e não regeradas nesta rodada
(`LAB-60`, `LAB-63`, `LAB-82`) são **provas de estado de uma rodada passada** — regerá-las mudaria
o que elas mediram, que é o oposto do que uma prova é.

**Uma das duas precisou de mais que regerar.** O `lab76.ts` deriva a procedência dos clones de uma
estrutura própria, e o carimbo cru não aparecia nela; ganhou um campo `deOndeOCarimboSaiu` com
repo, `de`, commit, convenção e `divergem`. *Prova que deriva a procedência de outra coisa não
herda o conserto da fonte — ela tem de pedir.*

---

## 4 · O QUE O CARIMBO NÃO SABE, e o item mandou declarar junto

> O módulo resolvido diz **qual arquivo** foi carregado; ele não diz se aquela árvore tinha
> mudança **não commitada**.

O campo `limpo` do carimbo passa a medir a árvore **de onde o carimbo saiu**, o que ajuda — mas um
`git stash` no meio de uma rodada continua invisível para as **duas** fontes. Um clone sujo entrega
código que não corresponde a commit nenhum, e nenhuma delas conta isso.

*Guarda que não declara o próprio buraco mente pelo silêncio.*

---

## 5 · O disparo que a sessão não recebeu NÃO é disparo em vazio (D277)

Entre 11:06 e 18:06 o despertador disparou **oito** vezes. **Uma** notificação chegou na hora; as
outras **sete** chegaram **todas no mesmo instante**, às 18:06 — até **seis horas** de espera para a
mais antiga. **E a caixa tinha o item `016` desde as 10h55.**

> **Disparo que o despertador manda e a sessão não recebe não é disparo em vazio: é disparo
> PERDIDO.** Contá-lo como vazio diria ao chat *"você não abastece"*, quando o que aconteceu foi
> *"eu não estava ouvindo"*.

E a leitura trocada tem consequência prática, porque **a conta decide o intervalo**: sete vazios
falsos empurrariam o chat a **esticar** o despertador — o conserto exatamente oposto ao que sete
disparos perdidos pedem. A coluna de origem ganhou um terceiro valor no vocabulário fechado,
`entregue-em-lote`, ao lado de `observado` e `derivado`. **A conta passa a dizer as três coisas
separadas:** 21 observados · 5 em vazio · 7 entregues em lote.

**Nada foi feito no despertador.** *Ligar, desligar e reagendar é do chat; o meu trabalho é a
conta* (item 004).

---

## 6 · A TERCEIRA coincidência casada como invariante, na MESMA função (D278)

Mexer na conta dos itens abertos — 17 → 16, por **entrega** — obrigou a reler as cinco travas que
a contam. Numa delas havia isto:

```ts
expect(QUANTAS_CONDICOES.naFila).toBeGreaterThan(QUANTAS_CONDICOES.queAVarreduraDeFraseAlcancou);
```

Escrita **por mim, no LAB-80**, para substituir a coincidência que o D264 tinha pegado
(`naFila - 15 === 1`), e justificada por escrito no comentário ao lado: *"o número da varredura de
frase é histórico, então ele não anda, e a `FILA.md` só cresce."*

**Medido, commit a commit:** `naFila` fez **15 → 16 → 17 → 16 → 17 → 16 → 17** (a última por
causa da §7 abaixo). Ela **não só cresce** — desceu **duas vezes**, e as duas por **entrega**
(LAB-81 e este). O `> 15` sobrevivia por **um** no momento em que eu o li, e duas entregas o
reprovam sem nada ter piorado. *Que a conta tenha voltado a 17 na mesma rodada não salva a trava:
salvar uma trava por sorte do dia é o que torna este defeito invisível.*

> **Coincidência consertada com outra coincidência é a mesma trava com uma vida mais longa** — e
> esta é a primeira das três cuja JUSTIFICATIVA ESCRITA é a parte que estava falsa.

A linha saiu e **nada tomou o lugar dela**: a relação entre a fila de hoje e um número de ontem não
é invariante nenhuma, é a medição de hoje — e a medição de hoje já está na linha de cima. O que
continua guardado é o que é mesmo invariante: o número histórico **pinado**, e a soma que **fecha**.

---

## 7 · E escrever a trava nova achou um nome de CI que deixou de ser verdade (D279)

A trava nova precisava ler **a máquina de verdade** — os três clones no disco —, e eu fui ver onde
ela cairia no CI. **O lugar onde ela cai é um trabalho cujo nome promete o contrário:**

> `guardas que não precisam dos clones vizinhos (NÃO é o verde)`

Esse trabalho lista `tests/commit-dos-vizinhos.test.ts`, e **duas travas desse arquivo exigem o
clone do `motor-testfit` no disco** — uma **desde o LAB-68** (conferida em `git show HEAD:`, logo
anterior a esta rodada) e **uma minha, desta**. Sem o clone as duas reprovam, e o trabalho que
existe **justamente** para rodar sem segredo falharia por falta do que o nome dele promete não
precisar.

> **O nome de um trabalho de CI é uma AFIRMAÇÃO sobre o que ele precisa, e nenhuma trava a
> confere.** A lista de arquivos é escrita à mão, os arquivos crescem sozinhos, e a afirmação
> envelhece como um comentário — com o agravante de morar num arquivo que **ninguém executa hoje**.
> *Afirmação desligada não é afirmação falsa: é afirmação que ninguém vai desmentir.*

**Não consertei, de propósito.** O conserto tem duas formas — tirar as travas que precisam de clone
desse trabalho, ou fazer o nome dizer a verdade — e escolher entre elas precisa de uma medição que
**eu não fiz**: quantas travas de cada um dos **30** arquivos da lista dependem do clone. Prometer o
número sem medir é a classe do D133, e ampliar escopo é o que a §1-A proíbe. Foi para a `FILA.md`
como proposta, `prompt-novo`.

**Então a conta dos itens abertos andou DUAS vezes e voltou a 17:** a do carimbo saiu por entrega,
esta entrou. *Saldo parado não é rodada parada* — as duas ficam escritas nos cinco lugares, e não
só o saldo.

---

## 8 · Entrega

- **prova:** [`docs/provas/LAB-83/carimbo-do-modulo-resolvido.json`](../provas/LAB-83/carimbo-do-modulo-resolvido.json)
  — na lista declarada de exceções do §7, porque mede **procedência** e não gleba;
- **decisões:** **D276** (o carimbo do módulo resolvido, com a adoção medida e o buraco declarado),
  **D277** (disparo perdido ≠ disparo em vazio), **D278** (a terceira coincidência) e **D279** (o
  nome do trabalho de CI que deixou de ser verdade, **proposto e não consertado**);
- **conta dos itens abertos:** andou **duas** vezes e ficou em **17** — uma saiu por entrega, uma
  entrou —, com as duas mudanças escritas nos **cinco** lugares que a contam mais a §4-A do
  `CLAUDE.md`;
- **os três clones vizinhos:** `git status` limpo nos três, e **nos commits em que estavam** —
  nada escrito em repositório vizinho (§4);
- **verde:** o comando único, **conferido aqui, não no GitHub** — **901** travas na esteira e
  **17** no `testfit`, 7 passos, `exit 0`. A lista do CI sem os clones vizinhos foi de 501 a
  **507**, em **30** arquivos. *(A rodada que veio em seguida, no disparo das 19:06, levou os
  números a **907** e **513** — e eles ficam onde foram medidos: este relatório guarda o verde
  DESTE prompt, não o do dia.)*
