# LAB-89 · A pergunta do clone raso virou guarda — e o que identifica o texto é o BLOB

**Prompt:** item **022** da caixa de entrada. · **Rodada:** despertador das 01:05 de 11/10/2026. ·
**Conferido aqui, não no GitHub** (§7).

---

## 1 · O item cobrou pela minha própria doutrina, e estava certo

O LAB-88 fechou com a lição do clone raso **escrita e não cobrada**. A direção citou a **A409** —
*"toda lição que descreve um erro repetível merece a pergunta: dá para cobrar isso por texto?"* — e
a minha própria frase: *"escrever a regra aqui não impediu nada; **guarda impediu**."*

E ela foi exata sobre o risco: **esta é a única ocorrência do ponto cego que eu já sabia que ia
repetir**, porque o instrumento é o `git`, eu o uso em toda rodada para afirmar procedência, e **ele
não avisa.**

**Repetiu no dia seguinte.** Antes de escrever uma linha de código eu remedi, e achei o erro **nos
meus próprios números publicados** — a §2.

---

## 2 · A 29ª do ponto cego, e ela já estava num PR mesclado (D294)

O **D292** publicou, e eu repeti em quatro lugares:

> ~~"o rótulo `3.0` cobre dois textos: `96dbc9b` (1 712 linhas) e `e48bff9` (1 731) … **só o commit
> identifica o texto**"~~

Medido no `archilly-central` com `--depth=225`, até `is-shallow=false` (**245 commits**):

| onde | `git log -- docs/PADRAO_ARCHILLY.md` |
|---|---|
| o meu clone **raso** | `e48bff9`, **`96dbc9b`** — 2 commits |
| o clone **raso da direção**, de outra profundidade | `e48bff9`, **`170a28f`** — 2 commits |
| **aprofundado** | `e48bff9`, **`67d18d5`**, `8212a54`, `bbd7d17`, … — **21** commits |

**`96dbc9b` e `170a28f` não estão na história do arquivo** — `git log -- <caminho> | grep -c` dá
**zero** para os dois. Os três **devolvem o mesmo blob** (`f95b2838…`, 1 712 linhas · 106 081
bytes); **só `67d18d5` o entregou**, às 00:38.

### O mecanismo, mais largo do que o D293 dizia

> **`git log -- <caminho>` responde "quem ENTREGOU este texto". Num clone raso ele responde "o
> commit mais velho que eu tenho e que já tinha este texto" — que é o CORTE.** E como `git show` de
> qualquer commit posterior devolve o texto vigente naquele momento, **todo commit posterior à
> entrega "confirma" o texto e passa por entrega.**

O D293 falava de *"quando isto mudou"*. Medido, **"qual commit" tem a mesma doença** — e o mais
útil: **duas profundidades diferentes dão nomes diferentes, cada uma internamente coerente.** A da
direção e a minha discordaram, e as duas "conferiam".

### A correção da frase, e ela vale para a família

> **O RÓTULO identifica a intenção de quem publicou** — e pode cobrir mais de um texto.
> **O COMMIT identifica a ENTREGA** — e o nome dele depende da profundidade do clone que você lê.
> **O BLOB identifica o TEXTO**, byte a byte, **igual em qualquer clone**.

Então a procedência desta casa passou a gravar **o blob junto do commit**: quem confere não depende
mais da profundidade do clone dele. Corrigido **por riscado** nos cinco lugares em que o número
saiu — `DECISOES.md` (D292), `CLAUDE.md`, `docs/INDEX.md`, o ponteiro e o relatório do LAB-88.

**O que NÃO mudou:** o rótulo `3.0` continua cobrindo dois textos, a cópia vendorizada do
Parcelamento continua sendo o texto antigo, e a **forma 1** continua sendo a escolha certa.

---

## 3 · A guarda: ela RECUSA em vez de responder (D295)

`external-engines/esteira/src/profundidade-da-historia.ts` — **a pergunta mora num lugar só**, e
toda leitura que afirma procedência passa por ela antes de medir.

| estado | resposta |
|---|---|
| `is-shallow=true` | **recusa** · `valor: null` · `clone-raso` |
| não deu para perguntar | **recusa** · `valor: null` · `profundidade-desconhecida` |
| `is-shallow=false` | **mede** · `historia-inteira` |

> **O que não foi medido sai `null`, nunca um valor plausível** (D23) — e aqui o valor plausível é o
> desfecho ruim **exato** que o D293 mediu.

**A recusa nem chama o `medir`**, de propósito: *para não haver nem a tentação de aproveitar "o
valor que veio junto"* — e **há trava com um contador que tem de ficar em zero.**

### O achado de ambiente, que mudou o desenho da trava

**O portão desta casa roda num clone raso**, e isso é medido no arquivo: o `verde.yml` usa
`actions/checkout@v4` **sem `fetch-depth`**, cujo padrão é **1**.

> **Guarda que confunde "não posso afirmar" com "a afirmação está errada" reprova o ambiente em vez
> de medir a coisa.** A trava aceita **os dois** desfechos sobre o repositório real — medição ou
> recusa declarada — e reprova **um terceiro**: valor devolvido sem história para sustentá-lo.

*Uma trava que exigisse história inteira ficaria vermelha no portão para sempre, por um motivo que
não é defeito nenhum — e vigia que nasce vermelho vira ruído e morre (D287).*

---

## 4 · A prova é de sentido invertido, e com clone de VERDADE

`bun run lab89` **monta um clone raso** deste repositório por `file://` — **sem rede** —, roda a
mesma régua nos dois e apaga o clone no fim:

```
AQUI  · is-shallow=false · MEDIU   · valor=04effac · historia-inteira
RASO  ·                    RECUSOU · valor=null    · clone-raso

o que o CORTE teria respondido sem a pergunta: 6152dec
commits de CLAUDE.md: 1 no raso · 61 aqui
```

**O mecanismo reproduzido em casa:** no clone raso o `CLAUDE.md` tem **1** commit de história em vez
de **61**, e o corte responderia **`6152dec`** — que é o commit em que a direção escreveu **este
item**. *O nome é plausível, recente e errado.*

**As travas são herméticas** (`tests/profundidade-da-historia.test.ts`, **13 travas**, no portão):
a profundidade entra **injetada**, nos três estados, e a propriedade cobrada não é um caso — é
**nenhuma recusa devolve valor**. O clone de verdade fica na ferramenta, porque *trava que clona no
portão paga bateria para medir o que uma injeção mede.*

---

## 5 · Entrega

- **prova:** [`docs/provas/LAB-89/a-pergunta-virou-guarda.json`](../provas/LAB-89/a-pergunta-virou-guarda.json)
  — os dois sentidos, o que o corte responderia, e o que identifica o quê. Entrou na **lista de
  exceções do §7** com o motivo: ela mede um **instrumento**, não gleba;
- **decisões:** **D294** (rótulo, commit e blob) e **D295** (a pergunta virada guarda);
- **a §6 foi de 28 para 29 ocorrências**, a classe *"a FONTE truncada respondendo como se fosse
  inteira"* foi de **uma para DUAS**, e a soma fecha pela trava;
- **o portão sem clones:** 35 → **36 arquivos**, 578 → **592 travas**;
- **o que o item NÃO pediu e não foi feito:** a **D226** (ela mesma disse por quê), o sétimo
  mecanismo, e **generalizar o ponteiro para a família** — *isso é dela, e já está acontecendo: o
  Parcelamento recebeu a caixa `023` com as duas cópias dele medidas*;
- **nada escrito em repositório vizinho.** O `archilly-central` foi **aprofundado só para leitura**
  (`git fetch --depth=225`, que escreve no `.git` do clone e em nada mais); os **quatro** clones
  terminaram limpos — `motor-testfit` `6cf6396`, `urban-create-hub-41d93a4d` `72cfab0`,
  `urban-scout-tool` `550a438`, `archilly-central` `944c232`;
- **o gatilho NÃO foi religado**, e **verde:** o comando único, **conferido aqui, não no GitHub**.
