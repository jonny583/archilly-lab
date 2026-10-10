# LAB-86 · A PROVA VELHA — e o limiar que a deixava passar

**Prompt:** item **019** da caixa de entrada. · **Rodada:** despertador das 22:05 de 10/10/2026. ·
**Conferido aqui, não no GitHub** (§7).

---

## 1 · Remedi antes de consertar, e o defeito estava VIVO (D287)

O item traz a **D204** — *"prova gerada antes da última edição do que ela mede é prova velha"* — e a
primeira coisa foi rodar `bun run lab57` na árvore de hoje e comparar com a prova commitada.

| o que a prova dizia | o que a MESMA árvore dizia | atraso |
|---|---|---|
| 364 arquivos que o git carrega | **498** | 26,9 % do número de hoje |
| 128 arquivos de código varridos | **187** | 31,6 % |
| 36 157 linhas de código lidas | **50 714** | 28,7 % |
| 662 linhas de configuração lidas | **761** | 13,0 % |

**Pior do que o D204 descreveu:** ele falava de *uma edição* de atraso; medido, são **semanas**, e
a prova ainda carregava **dois caminhos mortos** (`probe/target/` e `wasm-probe/target/`, pastas de
compilação que não existem mais).

---

## 2 · Por que a trava não pegou — e é a lição da rodada

A trava **lia** a prova, e conferia com **limiar**:

```ts
expect(p.escopo["configuracoesEncontradas"]).toBeGreaterThan(20);
expect(p.escopo["configuracoesVarridas"]).toBeGreaterThan(5);
expect(p.escopo["linhasDeCodigoLidas"]).toBeGreaterThan(10000);
```

Uma prova congelada em **36 157** linhas passa `> 10000` para sempre.

> **Régua que confere uma prova com `maior que` aceita qualquer prova velha que já fosse grande o
> bastante quando nasceu.** O limiar mede se o número é **plausível**; só a recontagem mede se ele é
> **verdade** — e num repositório que cresce, *o limiar fica mais frouxo a cada commit, sem ninguém
> mexer nele.*

É a família do **D164** pelo outro lado: ali o perigo era o zero de régua parada ser indistinguível
do zero de árvore limpa; aqui é **o número grande de ontem** ser indistinguível do número certo de
hoje.

---

## 3 · A forma escolhida, com o motivo — e o carimbo recusado por medição

O item ofereceu duas e pediu o motivo escrito.

| forma | o veredicto |
|---|---|
| **recontar e comparar** *(escolhida)* | o universo desta varredura é o `git ls-files` **deste** repositório: sem clone, sem rede, sem motor. Recontar custa **~0,3 s** e a comparação é **exata**, número por número |
| comparar carimbos | **o carimbo do disco não é o do git.** Numa sessão nova todo arquivo tem a data do checkout, e a comparação vira **vácuo** — *guarda que não acha o objeto não está aprovando: está sem medir nada* (D213). O item avisou, e o vácuo cai exatamente onde a trava mais precisaria valer: **no CI, depois de um checkout limpo** |

E a recontagem responde de graça **o caso válido que quase parece inválido**, que o item nomeou: a
prova que **não mudou porque nada que ela mede mudou** passa, porque os números batem. *Uma régua
que exigisse carimbo mais novo a cada commit reprovaria a árvore correta, e vigia que nasce vermelho
vira ruído e morre.*

### A medição mora num lugar só, e isso foi exigência do item

A conta estava **dentro da ferramenta**. Escrevê-la de novo dentro da trava criaria duas
implementações da mesma pergunta — *duas listas para a mesma pergunta divergem*, e o **D231** já
cobrou esta casa por meio conserto num instrumento só. Então ela saiu para
`src/escopo-da-varredura.ts`, e **a ferramenta e a trava chamam a mesma função.**

### O universo começa no LUGAR, como o item exigiu

`git ls-files`, não uma lista escrita à mão ao lado — *lista à mão não vê o arquivo que nasceu
depois dela*, e aí a trava fica verde **por não ter olhado**.

---

## 4 · Demonstrado nos dois sentidos, e o vigia acusou o próprio trabalho

- **o lado ruim**, plantado de ponta a ponta: uma linha acrescentada a um arquivo que a prova mede,
  **sem regerar a prova**. A trava reprovou **nomeando a chave** — `linhasDeCodigoLidas`, na prova
  **50 714**, na árvore **50 716**. O arquivo foi devolvido **byte a byte**, `sha256` conferido;
- **o lado bom:** duas recontagens seguidas na mesma árvore batem, e a trava passa calada;
- **e o mecanismo se provou DENTRO da rodada, sem eu plantar nada:** ao registrar o script `lab86`
  no `package.json` — arquivo de configuração que a varredura lê — a recontagem acusou na hora,
  **760 → 761**.

> *A prova mais honesta de que um vigia funciona é ele acusar o trabalho de quem o estava
> escrevendo.*

---

## 5 · O alcance, porque o item mandou a medição decidir o tamanho (D288)

Das **74** provas desta casa:

| quantas | a classe | o que decide |
|---|---|---|
| **11** | universo **dentro** desta casa | recontagem barata, exata, sem rede — **é onde a forma cabe** |
| **63** | dependem de **fora** | medem contra clone vizinho, commit, semente ou gleba |

> **Recontar o que depende de fora não é mais rigor: é outra medição com o nome da antiga.**

E isso é **LAB-79 medido**, não opinião: *"regerá-la em silêncio não atualiza a medição — TROCA A
PERGUNTA. O LAB-78 perdeu dois de quatro lotes exatamente assim, porque o motor andou de `4181e95`
para `6cf6396`."*

**Nesta rodada foi recontada UMA** — a que o D204 nomeou. As outras dez do universo de dentro são
medição **por prova**, e foram para a `FILA.md`: *item que reescreve setenta provas numa rodada é
item que ninguém revisa.*

**E nenhuma segunda lista nasceu**, como o item exigiu: a classe de uma prova sai do que ela
**cita**, e a lista de exceções de medição continua sendo a do §7.

---

## 6 · O que o conserto NÃO resolve — e a trava corrigiu a MINHA declaração, no mesmo verde

Eu havia escrito que *"a prova tem de ser a última coisa gerada na rodada"*. **Medido: é mais
estreito, e foi o verde que me corrigiu.** Rodei o `lab57` como última ferramenta, commitei, e a
trava reprovou:

| número | na prova | na árvore, depois do commit |
|---|---|---|
| `arquivosQueOGitCarrega` | 498 | **502** |
| `arquivosDeCodigoVarridos` | 187 | **188** |
| `linhasDeCodigoLidas` | 50 716 | **50 914** |

**O universo é o `git ls-files`, e ele muda no `git add`** — não quando o arquivo é escrito. Os
quatro arquivos novos desta rodada estavam no disco e **não rastreados** quando a prova foi gerada.

> **A prova tem de ser gerada depois do `git add`, não depois da última edição.** *Quando o
> universo de uma medição é "o que o git carrega", o instante que importa não é o da escrita: é o do
> `add`* — e os dois estão a um comando de distância, o que torna o engano barato de cometer e
> invisível sem recontagem.

A ordem continua exigida. **O que mudou é que ela deixou de ser disciplina e passou a ser guarda** —
e era o silêncio o defeito do D204, não a ordem.

---

## 7 · Entrega

- **prova:** [`docs/provas/LAB-86/a-prova-velha.json`](../provas/LAB-86/a-prova-velha.json) — o
  defeito medido, a forma com o motivo, a demonstração nos dois sentidos e o alcance;
- **a prova do LAB-57 foi regerada**, e agora **não pode mais ficar velha em silêncio**;
- **decisões:** **D287** (o limiar que aceita prova velha, e a forma escolhida) e **D288** (o
  alcance: 11 de 74, e por que as 63 não);
- **o gatilho NÃO foi religado** — *a régua cobra, não liga*;
- **os três clones vizinhos:** `git status` limpo e nos commits em que estavam;
- **verde:** o comando único, **conferido aqui, não no GitHub** — **937** travas na esteira e
  **17** no `testfit`, 7 passos, `exit 0`. A lista do CI foi de 535 a **550**, em **33**
  arquivos: a `configuracao.test.ts` **estava de fora desde sempre** e é limpa de clone, então
  o portão que roda em todo envio não exercia a trava do D204 — remedido por execução, **33 de
  33 passam sem os clones**;
- **conta dos itens abertos:** ficou em **15** — uma saiu por entrega (a D204) e uma entrou (as
  outras dez provas recontáveis), então o saldo não andou e as duas ficam escritas.
