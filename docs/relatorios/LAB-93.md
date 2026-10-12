# LAB-93 · A D226 entregue — o delta de desenho é **zero**, e a causa do número era outra

**Prompt:** item **026** da caixa de entrada. · **Rodada:** despertador das **23:06 de
11/10/2026** (UTC), entregue em 12/10. · **Conferido aqui, não no GitHub** (§7).

---

## 1 · O que o item pedia, e o que ele acrescentou

O item **autorizou** a D226 — *"a escolha é SUA, não minha"* — e acrescentou uma pergunta tirada
de cruzar duas medições minhas. Então são três entregas: **entregar os quatro campos**, **medir as
duas passagens** e **reler as três perdas declaradas** desta ponte.

---

## 2 · A conta, campo por campo (D306)

Cinco passagens por gleba — `sem`, `só-caixa`, `só-face`, `só-rampa`, `os-três` — em **nove**
glebas. **E cinco, não duas, foi o que fez a diferença:** duas passagens respondem *se* algo se
moveu; uma passagem por campo responde **qual campo** moveu.

| campo | o contrato traz? | entregue, mudou o quê | veredicto |
|---|---|---|---|
| `caixaViariaMinima_m` | **9/9**, 8 m | **nada de geometria**; o motor passou a **AVISAR** (+10 a +40 avisos por gleba) | `entregue-so-passou-a-avisar` |
| `faceQuadraMaxima_m` | **9/9**, 200 m | **nada** | `entregue-nada-se-moveu` |
| `rampaMaximaDeVia_pct` | **1/9** (só a fixture nova) | **nada** | `entregue-nada-se-moveu` |
| `declividadeMaximaDeLote_pct` | o `ParametrosV1` **não publica** | não há passagem | `o-contrato-nao-publica` |

> **A geometria publicada é IDÊNTICA nas cinco passagens, em 9 de 9 glebas.**

**A decisão: entregar os três que o contrato publica** — e o motivo **não** é o delta de desenho,
que é zero. É que **a omissão não é neutra**: `null` ali não quer dizer *"sem limite"*, quer dizer
*"vale o padrão de fábrica do motor"*. É o **K = 17** do LAB-92 na porta ao lado. O que nasceu foi
**informação que o Lab jogava fora** — o motor avisando que a pista fica abaixo do mínimo que o
arquivo pediu.

---

## 3 · A D226 atribuiu a causa ao campo errado, e o número **não reproduz**

A D226 publicou, em cinco lugares, que *"o motor GANHOU a capacidade que esta ponte declara como
perda — ele não limita rampa de via, não calcula greide"*, com o número ao lado: a rampa de
`ensaio-com-via` caindo de **21,63 % para 17,92 %**.

- **a capacidade é outra:** o motor não ganhou a de **limitar**, ganhou a de **CONFERIR** contra a
  rampa que o arquivo pediu. As duas funções dele dizem isso por escrito — *"isto conta; não
  reprova e não conserta"* e *"isto mede, avisa e diz que reprova; não redesenha nada"*;
- **o número não pode ter vindo do campo acusado:** `parametros.rampaMaxima_pct` é **`null`** em
  `ensaio-com-via`;
- **e nem da face de quadra**, que não morde (§4 abaixo).

~~21,63 % → 17,92 % por entregar os campos de `legais`~~ fica **riscado com a medição ao lado, e
sem culpado novo**: *dizer "era isto" sem reproduzir seria inventar a causa de um número que eu
não tenho.*

---

## 4 · A rodada negou a minha leitura do fonte (D308) — a **trigésima** vez da §6

Eu declarei, lendo o fonte, que a `faceQuadraMaxima_m` **muda o desenho**: o `tetoDeFaceDeQuadra`
faz `min(alvo, legal)`, e isso entra na quebra de quadra. A rodada disse **não**, em 9 de 9.

O motivo é medido e é **desta ponte**: o mesmo campo do contrato já chegava por outro caminho —
`parametros.faceQuadraMax_m` vira a faixa degenerada `padroes.comprimentoQuadra`, que é de onde
sai o `alvo`. Então o `min` é `min(200, 200)`.

> **Leitura de fonte é hipótese; rodada é dado.** E quando um campo chega por dois caminhos, a
> régua que compara os dois **compara o campo consigo mesmo**.

E a **trava cobra a divergência declarada**, não a concordância: a lista pode discordar da rodada,
mas o motivo tem de estar **escrito** em `porQueNaoMordeAqui`.

### O instrumento que eu usei primeiro estava errado, e esse é o irmão deste achado

A primeira passada usava, como instrumento de *"o desenho mudou"*, a `assinaturaDaRodada` que a
esteira publica — a `impressao(plano)` **do próprio motor**, a régua do dono. O `Plano` dele
carrega `avisos`, `metricas`, `nota` e `indicadores` ao lado da geometria: entregue a
`caixaViariaMinima_m`, a assinatura mudou com lotes, vias, quadras e pior rampa **idênticos**.

> **Assinatura de RODADA não é assinatura de DESENHO.** Impressão digital só responde à pergunta
> de quem sabe o que entrou nela — a régua do dono estava certa sobre o que **ele** queria provar.

Nasceu a `assinaturaDaGeometria`, que projeta a SAÍDA no que é geometria e usa a `impressao` **do
motor** (refazer a canonicalização aqui seria a segunda régua do D116). Dois sentidos travados.

---

## 5 · O "não medido" que não podia virar "sem efeito"

Na primeira volta, `rampaMaxima_pct` vinha **`null` em 8 de 8** glebas: a passagem entregou `null`
e nada mudou **porque nada foi entregue**. *Passagem que entregou nada mediu a gleba, não o
campo*, e a conta tem veredicto próprio para isso (`nao-havia-o-que-entregar`), com trava.

Daí a fixture **`ensaio-com-rampa`** — a única desta casa que declara rampa máxima, **8 %** e não
15, porque 15 é o corte declarado do próprio motor e *entregar o default mede a si mesmo*. Com
valor de verdade, **continua não movendo nada**, e agora o motivo é **estrutural e medido**:
varrido o `src/` da origem do motor, quem lê o campo é só a `cortesDoArquivo` — e **a
`cortesDoArquivo` não é chamada por ninguém em `src/`**; os chamadores são os `scripts/` de
medição dele e os testes dele.

> **Porta aberta não é porta usada.** Entregá-lo é certo de qualquer forma: a porta é dele, e quem
> a usar depois vai achá-la cheia em vez de vazia.

---

## 6 · As três perdas sob suspeita, **nomeadas** (D307)

A frase da D226 saiu em **cinco lugares** e **em nenhum deles nomeia as três**. Medido: o bloco de
parâmetros do inventário tinha exatamente três `perda(...)`. A contagem estava **certa**; faltava
o nome.

| perda | veredicto | o que a medição disse |
|---|---|---|
| `parametros.caixaViariaMin_m` | **saiu da lista** | o piso independente existe: `viasComPistaCurta`. Entregue, 9 de 9 glebas ganham aviso |
| `parametros.rampaMaxima_pct` | **saiu da lista** | *"não limita rampa"* continua verdadeiro — e **não limitar não é não receber** |
| `parametros.pctAreaPublica` | **fica**, remedida e datada | nenhum dos quatro campos novos aponta para ela |

> **Três coisas suspeitas porque estão na mesma gaveta não são três coisas suspeitas:** vizinhança
> no arquivo não é vizinhança na causa.

As duas que saíram viraram destino `traduzido`, o que **criou promessa nova** — e a trava do
LAB-40 cobrou na hora que a da rampa não tinha gleba que a exercitasse. O universo de promessas
foi de **60 para 62**.

---

## 7 · A pergunta que o item acrescentou, respondida contra mim (D309)

O item cruzou o **caso válido** do LAB-92 (*"premissa que o motor NÃO TEM COMO RECEBER"*) com o
`null` que a `ida.ts` mandava para um campo que o motor tem, e apostou que *"as duas coisas podem
ser verdade ao mesmo tempo, e provavelmente são"*.

**Não são.** O motor recebe as duas, e a **tradução do próprio dono dele** já as mapeava, nas
mesmas palavras do contrato v1. Duas linhas do `O_QUE_O_MOTOR_NAO_RECEBE` saíram **riscadas**.

> **"O motor não tem como receber" e "a minha ponte não entrega" têm a mesma aparência do lado de
> fora, e culpas opostas.** O meu motivo de perda era verdadeiro sobre o que o motor **faz** e
> falso sobre o que ele **aceita** — e eu publiquei o segundo.

E o item estava certo na metade que importa: **a vaga vazia não é neutra**, e o efeito de omitir é
o mesmo do K = 17. A linha que liga as duas listas é: *caso válido se confere no que o motor
ACEITA, nunca no que ele faz com o que recebe.*

---

## 8 · E a régua do PORTÃO errava nos dois extremos (D310)

Pôr a trava nova na lista do trabalho sem clones fez a régua do portão reprová-la. Medido, ela
errava **nas duas direções**:

- **larga demais:** reprovou um teste cuja cadeia **não alcança clone nenhum** (um `import type` e
  um arquivo sem `import`);
- **estreita demais:** `../src/` **não estava** entre os prefixos — um teste da lista que
  importasse `../src/passagens-dos-legais.ts` (que importa `@testfit/api.ts`) **passaria**, e
  quebraria o CI;
- a lista à mão tinha **`@symbios/`, que não é clone** (resolve para dentro desta casa) e **não
  tinha `@/`, que é**.

> **Apelido que decide o portão não se escreve à mão: ele se LÊ de onde ele mora.**

Agora o fecho é **transitivo**, os apelidos são **derivados dos `paths` do `tsconfig.json`** (o
alvo resolvido **sai da raiz do repositório**), e `import type` **não é alcance** — sem isso o
fecho acusou `tests/contrato.test.ts`, que passa sem clone e está medido assim em 40 de 40 por
execução.

---

## 9-A · E eu ia publicar o número do portão errado, em quatro lugares (D311)

Escrevi **661** — 641 mais as 20 travas novas, somadas de cabeça — e esqueci as **cinco** que
entraram no próprio `regras.test.ts`. Contado, são **666**.

A trava que guarda esse número exige que os **quatro** lugares onde ele mora digam o mesmo, e
**nunca** o comparou com a realidade. Os quatro concordaram em 661 e a trava passou.

> **Quatro cópias de um número conferidas uma contra a outra provam que ninguém esqueceu de
> copiar, não que o número é verdade.** Consistência não é correção.

E o instrumento que poderia desmenti-la estava cego do mesmo lado: a medição **por execução** do
LAB-84 publicava `null` em **36 dos 40** arquivos — exatamente os que **passavam** —, porque lia só
a saída padrão e o `bun test` escreve o resumo na saída de **erro**.

> **Medição que só preenche o campo quando dá errado não é medição por execução: é relatório de
> falha.**

Consertados os dois: a prova publica `quantasTravasNaLista` (soma por execução, **`null` quando
qualquer arquivo não foi medido** — *soma com buraco não é soma*) e a trava dos quatro lugares
passa a **cobrar o número contra essa soma**.

---

## 9 · O que fica pedido, e o pedido NÃO é commit (§4)

**Ao Parcelamento (`motor-testfit`):**

1. **`cortesDoArquivo` não tem chamador em `src/`** — só nos `scripts/` e nos testes. Ou o motor
   passa a conferir com o corte do arquivo dentro do pipeline, ou o campo é porta decorativa;
2. **`faceQuadraMaxima_m` e o alvo da quadra chegam do MESMO campo** quando a entrada é o contrato
   v1, e aí o `min(alvo, legal)` nunca morde. Vale dizer isso no comentário dele, porque de dentro
   parece que há dois tetos;
3. e continua de pé o pedido do LAB-92: publicar no contrato as chaves que hoje só existem de
   fábrica, começando por `tolerancia` e `testadaExterna`.

**Ao dono do contrato de motor v1 (o Generate):**

4. **`declividadeMaximaLote_pct` não existe no `ParametrosV1`** e é **a única das cinco que é lei**
   (6.766, art. 3º, parágrafo único, III). O motor já a lê de forma tolerante; o contrato é que não
   a tem. Enquanto não tiver, daqui ela sai `null` — não medido, nunca zero.

**Ao Jonny:** nada novo. A pergunta do **regime** (loteamento × condomínio) do LAB-92 continua na
página dele, e é ela que decide **qual** limite a competição usa.

---

## 10 · Entrega

- **prova:** [`docs/provas/LAB-93/as-cinco-passagens.json`](../provas/LAB-93/as-cinco-passagens.json)
  — as cinco passagens das nove glebas, a conta por campo com veredicto, os deltas, as três perdas
  remedidas, a procedência do motor com `sha256` por trecho e o que isto **não** alcança;
- **fixture nova:** `docs/fixtures/glebas-que-exercem-as-promessas/ensaio-com-rampa.entrada.json`;
- **decisões:** **D306** (o delta é zero e a causa era outra), **D307** (as três nomeadas),
  **D308** (a rodada negou a leitura), **D309** (receber ≠ fazer), **D310** (alcance, não prefixo)
  e **D311** (a medição que só media quem falhava, e os quatro lugares conferidos entre si);
- **o portão sem clones:** 39 → **40 arquivos**, 641 → **666 travas** — e o 666 é **medido por
  execução**, não somado de cabeça: ver o §9-A;
- **nada escrito em repositório vizinho** — leitura na **origem** do `motor-testfit` (`11fcbad`,
  contra o clone que compila, `6cf6396`), com os trechos lidos **comparados byte a byte nos dois**;
  os **seis** clones limpos;
- **nenhum motor foi melhorado** (o adendo-1 do item 025 proíbe antes do lançamento): entregar
  campo que o motor já aceita **não é melhorar o motor**, é parar de omitir premissa;
- **o gatilho do CI não foi religado**;
- **verde:** o comando único, **conferido aqui, não no GitHub**.
