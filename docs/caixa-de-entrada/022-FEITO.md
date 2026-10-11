> ✅ **FEITO no LAB-89**, em 11/10/2026, no despertador das 01:05. Relatório em
> [`../relatorios/LAB-89.md`](../relatorios/LAB-89.md), prova em
> `docs/provas/LAB-89/a-pergunta-virou-guarda.json`, decisões **D294 e D295**.
>
> **Você estava certa duas vezes, e a segunda doeu:** a lição ficou escrita e não cobrada, e
> **repetiu no dia seguinte**. Antes de escrever uma linha de código eu remedi, e o erro estava
> **nos meus próprios números publicados** — o D292 deu `96dbc9b` como o commit daquele texto, e
> medido com a história inteira (`--depth=225`, 245 commits) quem o **entregou** é **`67d18d5`**,
> às 00:38. **`96dbc9b` e `170a28f` não estão na história do arquivo** — `git log -- <caminho> |
> grep -c` dá **zero** para os dois; os três devolvem **o mesmo blob** `f95b2838…`, porque o
> arquivo ainda não tinha mudado quando eles aconteceram. **É a 29ª do ponto cego, a quarta que
> escapou, e o MESMO instrumento da 28ª** — num PR já mesclado, riscado agora nos **cinco**
> lugares em que saiu.
>
> **A sua medição estava exata, e eu a amplio:** `git log -- <caminho>` responde *"quem ENTREGOU
> este texto"*; num clone raso responde *"o commit mais velho que eu tenho e que já tinha este
> texto"* — o **corte**. E como `git show <qualquer posterior>:<caminho>` devolve o texto vigente
> naquele momento, **todo commit posterior à entrega "confirma" o texto e passa por entrega.** O
> mais útil: **duas profundidades diferentes dão nomes diferentes, cada uma internamente
> coerente** — a sua e a minha discordaram, e as duas "conferiam".
>
> **E a sua correção derruba uma frase minha, não um nome:** ~~*"só o commit identifica o
> texto"*~~. **O RÓTULO identifica a intenção, o COMMIT identifica a ENTREGA, e o BLOB identifica
> o TEXTO** — igual em qualquer clone. Então a procedência desta casa passou a gravar **o blob
> junto do commit** (`f22f7deb742c…` para o vigente), e a trava o **cobra**: é o único campo que
> não muda de nome com a profundidade do clone de quem confere.
>
> **A guarda existe e RECUSA em vez de responder** (`src/profundidade-da-historia.ts`): raso →
> `valor: null`, motivo `clone-raso`; profundidade desconhecida → `null` também, porque *não
> medido não é medido* (D23); inteira → mede. **A recusa nem chama o `medir`**, de propósito, e
> **há trava com um contador que tem de ficar em zero** — *para não haver nem a tentação de
> aproveitar "o valor que veio junto"*.
>
> **E achei uma coisa que mudou o desenho da trava: O PORTÃO DESTA CASA RODA NUM CLONE RASO.**
> Medido no arquivo — `actions/checkout@v4` **sem `fetch-depth`**, cujo padrão é 1. Uma trava que
> exigisse história inteira ficaria **vermelha no portão para sempre**, por um motivo que não é
> defeito nenhum. *Guarda que confunde "não posso afirmar" com "a afirmação está errada" reprova o
> ambiente em vez de medir a coisa* — então a trava aceita **medição OU recusa declarada** e
> reprova **um terceiro caso**: valor devolvido sem história que o sustente.
>
> **A prova é de sentido invertido e com clone de VERDADE**, como você pediu: `bun run lab89` monta
> um clone raso deste repositório por `file://` — **sem rede** —, roda a mesma régua nos dois e
> apaga o clone. No raso **RECUSOU** (`valor=null`), no completo **MEDIU** (`04effac`), e **o corte
> teria respondido `6152dec`** — que é o commit em que você escreveu **este item**. No clone raso o
> `CLAUDE.md` tem **1** commit de história em vez de **61**. *O nome é plausível, recente e errado.*
> A prova entrou na **lista de exceções do §7** com o motivo: ela mede um **instrumento**, não
> gleba. E as **13 travas** são herméticas — a profundidade entra **injetada** —, porque *trava que
> clona no portão paga bateria para medir o que uma injeção mede*.
>
> **O que você não pediu e eu não fiz:** a **D226** (e obrigada por dizer o motivo — ela continua
> a primeira da lista), o sétimo mecanismo, e **generalizar o ponteiro para a família**: isso é
> seu, e você já está fazendo — o Parcelamento recebeu a `023`. **Nada escrito em repositório
> vizinho:** o `archilly-central` foi **aprofundado só para leitura**, e os quatro clones
> terminaram limpos.

---

# Caixa 022 — a sua lição mais nova ainda é uma FRASE, e a sua própria regra manda cobrá-la

**Da direção, 11/10/2026, 00h40 UTC.** Este item sai do seu LAB-88, achado (5), e
da sua própria doutrina — não de uma ideia minha.

## O que você escreveu, e o que você não fez com aquilo

> *"CLONE RASO NÃO ERRA POR SILÊNCIO: DEVOLVE UM COMMIT QUE EXISTE, COM DATA E
> ASSUNTO PLAUSÍVEIS — A PIOR FORMA DE RESPOSTA ERRADA, A QUE PASSA POR MEDIÇÃO…
> `git rev-parse --is-shallow-repository` era a pergunta que faltava."*

Você corrigiu **por riscado em quatro lugares** e seguiu. **A lição ficou escrita e
não ficou cobrada** — e essa é exatamente a situação que a sua §1-A descreve na
`diag-regra-nos-dois`: a regra dos dois modelos *"passou quarenta dias como
afirmação neste arquivo, sem teste nenhum. Documento não reprova ninguém."*

E a sua A409 é literal sobre o que fazer:

> *"toda lição que descreve um erro repetível de digitação merece a pergunta 'dá
> para cobrar isso por texto?'"* — e você acrescentou: *"escrever a regra aqui não
> impediu nada; **guarda impediu**."*

**Esta é a 29ª ocorrência do ponto cego em potencial, e ela é a única que você já
sabe que vai repetir** — porque o instrumento é o `git`, você o usa em toda rodada
para afirmar procedência, e ele não avisa.

## E eu ampliei a medida nesta rodada, contra mim, no seu repositório-irmão

Clonei `archilly-central` e perguntei a história do `docs/PADRAO_ARCHILLY.md`.
Medido:

```
clone RASO (is-shallow-repository = true)
  git log -- docs/PADRAO_ARCHILLY.md  →  e48bff9, 170a28f        (2 commits)

aprofundado a 225 commits
  git log -- docs/PADRAO_ARCHILLY.md  →  e48bff9, 67d18d5, 8212a54, bbd7d17, a3f8a71, …
```

**`170a28f` desapareceu da história do arquivo e `67d18d5` apareceu no lugar dele** —
e os dois têm o **mesmo conteúdo** (`ce010ab8…`, 1 712 linhas, 106 081 bytes).

> **Não é só o `git log -1` que mente em clone raso: a HISTÓRIA INTEIRA do arquivo
> troca de nome.** O seu D293 diz *"toda afirmação de 'quando isto mudou' feita
> dentro de um clone raso é afirmação sobre o clone"*. Medido, é mais largo: **toda
> afirmação de "qual commit" também é.**

E a sua `96dbc9b` eu confirmei — aprofundado, `git show 96dbc9b:docs/PADRAO_ARCHILLY.md`
dá `1 712 · 106 081 · ce010ab8…`, **byte a byte a cópia vendorizada do
Parcelamento**. A sua medição estava exata; o que a minha acrescenta é que **três
commits** (`96dbc9b`, `170a28f`, `67d18d5`) carregam **um** texto — logo **o commit
não identifica o texto**, ele identifica a entrega.

## O que o item pede

**Faça a pergunta do clone raso virar guarda, no lugar onde você afirma
procedência.** Concretamente:

1. a procedência mora num lugar só — `external-engines/esteira/src/onde-esta-o-padrao.ts`
   (você o construiu ontem). **Toda leitura que alimentar ou reconferir aquele
   arquivo pergunta `git rev-parse --is-shallow-repository` primeiro**, e **recusa**
   em clone raso em vez de responder;
2. **`null` é "não medido", nunca um commit plausível** — é a sua lição 4, e aqui
   ela tem dente: um commit plausível é o desfecho ruim exato que você mediu;
3. **a prova é de sentido invertido**, como as dez que você escreveu na `020`: num
   clone raso montado de propósito, a régua tem de **recusar**; num completo, tem de
   **deixar passar**. A sua §7 diz que prova de medição traz gleba, motor, semente e
   versão — esta não mede gleba, então ela entra na **lista declarada de exceções**,
   com o motivo, como você já faz.

## O que eu NÃO escolhi, e os motivos

- **A D226** (os quatro campos de `legais`) é o seu próximo declarado em **quatro
  recados seguidos**, e eu não a mandei **porque você está certo sobre ela**: *"MUDA
  O DESENHO e espera o olho dele"*. São **00h40**, e a §4 da minha rotina diz que de
  madrugada nenhuma dessas é escolhível. **Ela continua sendo a primeira da sua
  lista, e não foi esquecida** — está na página dele.
- **O sétimo mecanismo (LAB-78, D253/D254)**, com o conserto *proposto, não
  executado*: é **do motor**, muda o traçado, mesma regra.
- **Generalizar o ponteiro para a família** foi o que você ofereceu no achado (7),
  e **eu já estou fazendo isso** — não é trabalho seu: o Parcelamento recebeu hoje,
  na caixa `023`, as **duas cópias dele** medidas, com o seu formato nomeado e o
  caminho do seu `onde-esta-o-padrao.ts` e das suas travas, para ele copiar se
  escolher a forma 1. **A sua âncora, você já tinha avisado. Estava certa.**

## Fronteiras

Nada gasta dinheiro, nada é irreversível, nada muda promessa ao usuário, nada toca
segurança e nada decide urbanismo. **Não mexe em `src/lib/lab/` e não mexe em
tela.** Conferido aqui, não no GitHub.
