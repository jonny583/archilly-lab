# LAB-88 · O Padrão não mora aqui — e a versão não identifica o texto

**Prompt:** item **021** da caixa de entrada. · **Rodada:** despertador das 00:05 de 11/10/2026. ·
**Conferido aqui, não no GitHub** (§7).

---

## 1 · O item respondeu a uma oferta minha com "não mando o texto", e mandou medir

O LAB-87 fechou oferecendo: *"se você quiser a cópia em 3.0, mande o texto e eu gravo."* A direção
recusou **e deu o motivo em número**, com três formas na mesa e uma ordem: *"eu não escolho por
você — quem mede o custo de cada forma é quem roda o verde."*

**Tudo foi medido na ORIGEM**, com `git show`, e não em cópia no disco:

| | |
|---|---|
| a fonte | `jonny583/archilly-central`, **privado**, `main`, `docs/PADRAO_ARCHILLY.md` |
| o vigente | **Versão 3.0 · 10/10/2026**, commit **`e48bff9`** (20:36:15Z), **1 731 linhas · 107 395 bytes** |
| a cópia que havia aqui | **Versão 1 · 13/09**, **145 linhas · 12 716 bytes** |
| a fração | **8,4 % das linhas · 11,8 % dos bytes** |

A direção disse *"8 % dele"*; conferido, **8,4 % em linha e 11,8 % em byte**. *Não era uma versão
velha do mesmo documento: era um oitavo dele, com o título de um documento normativo.*

---

## 2 · A medição que decidiu não estava no item (D292)

> **O rótulo `"Versão 3.0 · 10/10/2026"` cobre DOIS TEXTOS DIFERENTES na origem.**

| commit | quando | linhas | bytes |
|---|---|---|---|
| `96dbc9b` | 10/10 03:35Z | 1 712 | 106 081 |
| `e48bff9` | 10/10 20:36Z | **1 731** | **107 395** |

**+19 linhas e +1 314 bytes com o mesmo número.** E a cópia vendorizada do Parcelamento
(`vendor/archilly-central/padroes/`, a que o item achou) é **byte a byte igual à PRIMEIRA**: ela já
está atrás **sem que o número mude**.

> *Isto é o D148 aplicado a um documento: carimbar a versão numa cópia é carimbar o **rótulo**, e
> rótulo não é identidade. **Só o commit identifica o texto.***

**É esta linha que mata a forma 3** (*congelar e declarar*): declarar *"Versão 1, 8 % do vigente"*
declara um rótulo — e quem abrisse o arquivo leria 145 linhas com cara de norma, com o aviso
morando no índice de **outra** página.

---

## 3 · E a forma 2 cai por MEDIÇÃO, não por preguiça

A forma 2 pedia uma trava que **reprova quando o commit da origem muda**. Medido:

- `jonny583/archilly-central` é **privado**; este repositório é **público**;
- o verde roda **sem rede** por desenho, e o trabalho de CI que roda em todo envio **não tem
  segredo** — o `GITHUB_TOKEN` do Actions não alcança repositório privado de fora;
- seria um **terceiro** vizinho privado a pedir na §11 da página do Jonny, que já espera por dois
  desde o LAB-38.

> **Uma trava que não alcança a origem fica VERDE por não achar o objeto** — e *guarda que não acha
> o objeto não está aprovando, está sem medir nada* (D213). O item avisou que a §11 podia morder
> aqui; mordeu.

---

## 4 · A escolha: FORMA 1 — ponteiro com procedência, no MESMO caminho

`docs/referencia/PADRAO_ARCHILLY.md` deixou de ser a cópia e passou a dizer **onde está a fonte,
qual commit foi lido, quando, de que tamanho e como se lê da origem**.

**O caminho é o mesmo de propósito:** é onde quem procura o Padrão chega, é onde o aviso serve, e
**nenhum link morreu** — o `LF-FINAL`, o `LF-FINAL-2` e o `INDEX` apontam para ele.

**E o texto da Versão 1 não se perdeu:** está em **`4081c27`** (14/09, PR #12), com a receita de
leitura escrita no ponteiro. *Arquivo que sai da árvore continua no histórico; o que a saída tira é
a autoridade de parecer vigente.*

**A procedência mora num lugar só** — `external-engines/esteira/src/onde-esta-o-padrao.ts` —, que é
o que a ferramenta e a trava leem (D231).

**Há guarda** (`tests/padrao-da-familia.test.ts`, 10 travas, **no portão sem clones**): cada campo
cobrado no arquivo **com o commit inclusive**, cada campo apagado um a um acusando, a cópia
recolada acusando `e-a-copia-de-novo`, o ponteiro ausente **não passando calado**, e as três
medições que escolheram a forma escritas em código.

### E uma trava minha MUDOU DE OBJETO, com o motivo escrito

A trava do LAB-87 exigia a frase *"congelada na Versão 1"* no `docs/INDEX.md` e a **proibia** dentro
da cópia. Com a cópia fora, mantê-la obrigaria o índice a repetir para sempre um número que a casa
acabou de tirar do caminho.

> **Trava cuja coisa cobrada deixou de existir não fica "passando": ela passa a cobrar uma frase que
> ficou falsa** — *regra que sobrevive ao seu objeto vira trabalho para manter a mentira.*

---

## 5 · O ponto cego bateu em mim duas vezes nesta rodada, com o MESMO instrumento (D293)

**É a vigésima oitava ocorrência da §6, e a terceira que ESCAPOU** (com o D119 e o D161).

**A primeira vez, dentro da rodada:** o item deu o commit `e48bff9`, de 20:36. Clonei a origem com
`--depth 1`, perguntei quando o arquivo mudou, e a resposta foi **`944c232`, de 23:48** — três horas
depois. *A frase pronta era "a procedência que você me mandou já estava velha quando chegou"*, e ela
casava bem demais com o argumento do próprio item. Medido com `--depth=50`: o último commit do
arquivo **é `e48bff9`**; `944c232` é só o **HEAD**, o commit do **corte**.

**A segunda vez já estava publicada, e era minha:** o **D291**, de ontem, diz que a cópia foi
*"trazida em 03/10 no PR #40"*. Medido com história inteira: **`4081c27`, 14/09, PR #12** — o commit
da própria conferência do `LF-FINAL` — e **um único commit em toda a vida do arquivo**. O
`03/10 / PR #40` era o **corte** do clone raso **desta sessão**, e saiu em **quatro lugares** e num
PR mesclado.

> **Clone raso não erra por silêncio: devolve um commit QUE EXISTE, com data e assunto plausíveis.**
> É a pior forma de resposta errada — *a que passa por medição.* A régua do *"quando isto entrou"*
> não é o `git log`: é o `git log` **mais a profundidade**, e
> `git rev-parse --is-shallow-repository` era a pergunta que faltava.

**Corrigido por RISCADO**, com a medição ao lado, nos quatro lugares: `docs/DECISOES.md` (D291),
`CLAUDE.md` §1-C, `docs/INDEX.md` e o relatório do LAB-87. *Número publicado em quatro lugares se
corrige nos quatro* (D231). **O recado do LAB-87 não foi editado** — recado é registro do que foi
enviado; a correção viaja no recado desta rodada.

---

## 6 · Entrega

- **prova:** [`docs/provas/LAB-88/onde-esta-o-padrao.json`](../provas/LAB-88/onde-esta-o-padrao.json)
  — a fonte, a fração, os dois textos do rótulo e as três formas com o que cada uma custa;
- **decisões:** **D292** (o ponteiro, e a versão que não identifica) e **D293** (o clone raso);
- **a §6 foi de 27 para 28 ocorrências**, com a classe nova (*a fonte truncada respondendo como se
  fosse inteira*) e a soma fechando pela trava;
- **o portão sem clones:** 34 → **35 arquivos**, 568 → **578 travas**;
- **nada escrito em repositório vizinho.** `jonny583/archilly-central` foi **clonado só para
  leitura** nesta rodada, para a procedência sair de `git show` e não de memória; os **quatro**
  clones terminaram limpos (`motor-testfit` `6cf6396`, `urban-create-hub-41d93a4d` `72cfab0`,
  `urban-scout-tool` `550a438`, `archilly-central` `944c232`);
- **o gatilho NÃO foi religado**, e **a D226 não foi tocada**;
- **verde:** o comando único, **conferido aqui, não no GitHub**.
