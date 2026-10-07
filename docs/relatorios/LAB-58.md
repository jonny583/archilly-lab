# LAB-58 · As 81 violações do motor, agrupadas por MECANISMO

**07/10/2026** · motor **Laboratório de Parcelamento** (`motor-testfit`), o motor padrão da
tela unificada · semente `20260913` · contrato de motor **v1** · prova em
[`../provas/LAB-58/mecanismos-das-81.json`](../provas/LAB-58/mecanismos-das-81.json)

---

## A resposta, em uma linha

> **Seis mecanismos. Nenhuma violação fora deles.**
> 18 + 11 + 23 + 14 + 11 + 4 = **81**, e `MECANISMO-NAO-NOMEADO` ficou em **zero**.

E a linha que decide a ordem da fila do motor não é a contagem, é esta:

> **`ensaio-47ha` é bloqueada por UM mecanismo só.** Consertar o teto de face de quadra
> **zera uma gleba inteira**, sozinho — e é a única das cinco em que isso acontece.

---

## 1 · A LISTA NUMERADA, para a fila do motor

Cada item traz o que o motor faz, onde isso foi **lido** no código dele (só de leitura, §4),
a prova que sustenta, e o **predicado medido** que decide se uma violação é dele. Ordenada
por **quantas glebas o mecanismo destrava**, não por volume.

| # | mecanismo | violações | tipos | glebas |
|---|---|---|---|---|
| **1** | **o teto de face de quadra limita um eixo e deixa o outro correr** | **14** | `face-quadra` | 2 |
| **2** | **a quadra recebe fileira de lote em face que não é rua** | **23** | `frente` | 3 |
| **3** | **o corte do último lote da fileira encurta a TESTADA e preserva o fundo** | **11** | `testada` | 3 |
| **4** | **a fileira encosta na via só de esguelha** | **4** | `frente` | 1 |
| **5** | **a faixa do lote externo é um SEMIPLANO: não acaba onde a face acaba** | **18** | `frente` | 1 |
| **6** | **a rede viária é aparada pela DIVISA e não por `util`** | **11** | `via-sobre-lote` | 1 |

### 1 · O teto de face de quadra limita um eixo e deixa o outro correr — 14 violações

**O que o motor faz:** o `comprimentoQuadra` limita a quadra **num eixo só**. A quadra sai
uma tira: **duas faces curtas** dentro do teto e **duas faces longas** muito acima dele.

**A medição que nomeia isto:** nas **14** quadras acusadas, *todas* têm **duas faces acima do
teto e ao menos duas abaixo**. As faces longas vão de **312,14 m a 596,92 m** contra um teto de
**200 m**; as curtas, de **8,79 m a 111,55 m**. E em **10 das 14** a face curta é, a menos de
1 m, **duas profundidades de fileira** — isto é, duas fileiras de lote costas com costas, que é
o eixo que o teto de fato pegou.

> **Eu escrevi "68,3 m em 11 das 14" neste relatório, de cabeça, e eram DEZ.** A ferramenta
> passou a contar a lista, e a frase saiu do que ela contou. É o **D185** pela quarta vez em
> cinco prompts — *número que o próprio relatório lista ao lado não se escreve de memória* —, e
> esta foi pega **dentro** do prompt, ao conferir antes de publicar.

**Onde foi lido:** `motor-testfit · src/lib/lab/motor.ts`, a montagem das quadras. **Prova:**
LAB-48 §4 + as faces medidas no LAB-53 e aqui.

**Por que é o item 1:** `ensaio-47ha` tem **6 violações e nada mais** — este mecanismo é o
único que a bloqueia. Consertá-lo **zera a primeira gleba**. Em `sintetico-50ha-ondulado` ele
responde 8 das 17.

### 2 · A quadra recebe fileira de lote em face que não é rua — 23 violações

**O que o motor faz:** `quadraRet` distribui os lotes sobre a quadra **sem perguntar quais
faces dela são via**. Onde a quadra tem rua de um lado só, a fileira do outro lado nasce
voltada para o miolo.

**A medição que nomeia isto:** a distância da borda do lote ao **contorno** da via mais
próxima vai de **1,24 m a 34,16 m**, e **11 das 23 estão a exatamente uma profundidade de
fileira** (34,16 m, ±0,5 m) — isto é, *a rua mais próxima é a que serve a fileira gêmea, do
outro lado do fundo*. Na quadra `Q48` de `completo` a escada aparece inteira em treze lotes
seguidos: 11,76 → 23,53 → 34,16 → 34,16 … → 23,53 → 11,76, em passos de uma testada de lote,
saturando na profundidade.

**Onde foi lido:** `motor-testfit · src/lib/lab/formatos.ts · quadraRet`. **Prova:** a classe
`motor-sem-via-perto` do LAB-54 + a distância medida aqui.

### 3 · O corte do último lote encurta a TESTADA e preserva o fundo — 11 violações

**O que o motor faz:** o último lote de cada fileira é o resto do corte da fileira contra a
borda da quadra. O corte sai pela diagonal, e **o lote paga a diferença na frente**.

**A medição que nomeia isto, e ela é unânime:** nas **11**, *todas* têm **5 vértices** (um a
mais que o lote regular), *todas* mantêm uma aresta de **34,16 m** — a profundidade modal da
fileira, medida como a moda da maior aresta entre os lotes da mesma quadra —, *todas* estão a
**0 m** do contorno da via (o lote **encosta** no meio-fio), e a testada que a função do
Generate mede vai de **3,56 m a 9,59 m** contra o mínimo de **10 m**. Área de **316 a 393 m²**:
o lote é cheio, é a frente que é curta.

> **A frente existe. Ela é curta.** Este mecanismo não é o da fileira sem rua: é o oposto.

**Onde foi lido:** `motor-testfit · src/lib/lab/formatos.ts · quadraRet`, o recorte do último
lote. **Prova:** as 11 `testada` do LAB-53 + a geometria medida aqui.

### 4 · A fileira encosta na via só de esguelha — 4 violações

**O que o motor faz:** a fileira não fica paralela à via que a serve. O lote **encosta** no
leito, mas por um trecho curto e **longe do meio de qualquer aresta**.

**A medição:** as 4 estão a **0 m** do contorno (encostam), e a testada que aparece com
amostragem de 0,25 m fica **abaixo do mínimo**. Duas delas são lotes **perfeitamente
regulares** (11,76 × 34,16 m) que tocam a rua em **2,04 m**.

**E aqui o rótulo é do Generate e o veredicto é do motor** (D184): o Validator diz `frente`
porque a amostra dele é o **meio** da aresta; o LAB-54 mediu que consertar a amostra derruba
**zero** violações — as 4 viram `testada` no mesmo lote. *Consertar o rótulo é item de
mensagem; consertar a esguelha é item de contagem.*

### 5 · A faixa do lote externo é um SEMIPLANO — 18 violações

**O que o motor faz:** para cada face entregue, `reservarFacesExternas` corta a gleba por um
**semiplano** à distância `prof` da **reta** da face, e distribui os lotes pela caixa
envolvente dessa faixa. **A reta é infinita e a face não.**

**A medição:** as 18 estão a mais de 0,5 m da face entregue (3 entre 0,5 e 50 m, **15 a mais
de 50 m**), e a distância delas à via mais próxima vai de **10,25 m a 62,37 m** — não há rua
nenhuma por perto, porque ali não há face.

**Onde foi lido:** `motor-testfit · src/lib/lab/motor.ts · reservarFacesExternas`. **Prova:**
LAB-50 (D173).

### 6 · A rede viária é aparada pela DIVISA e não por `util` — 11 violações

**O que o motor faz:** `apararRedeViaria(viasBrutas, terreno.perimetro)` é o **único** aparo
que a rede recebe. A faixa que `reservarFacesExternas` tirou da gleba é buraco **só no
domínio do LOTE** (`quadraRet(util, …)`), não no da **VIA** — então o leito atravessa os
lotes externos. O recorte por cul-de-sac não salva: só roda com `pctCulDeSac > 0` e só sobre
a secundária.

**Onde foi lido:** `motor-testfit · src/lib/lab/motor.ts · apararRedeViaria` e
`aplicarCulDeSac`. **Prova:** LAB-55 (D188), com **4 de 4** vias culpadas tendo as duas
pontas na divisa.

---

## 2 · O que bloqueia cada gleba — a coluna que ordena a fila

| gleba | candidata vencedora | violações | mecanismos que a bloqueiam | o que falta para ZERAR |
|---|---|---|---|---|
| **`ensaio-47ha`** | espinha (1º de 20) | 6 | **1** (o teto de face) | **um mecanismo** |
| `sintetico-10ha-plano` | espinha (1º de 20) | 4 | 2 (fileira sem rua 1 · último lote 3) | dois mecanismos |
| `sintetico-50ha-ondulado` | espinha (1º de 19) | 17 | 3 (teto 8 · último lote 6 · fileira sem rua 3) | três mecanismos |
| `completo` | ortogonal (1º de 7) | 25 | 3 (fileira sem rua 19 · esguelha 4 · último lote 2) | três mecanismos |
| `geo-antonina` | superquadra (1º de 20) | 40 | 2 (semiplano 18 · rede não aparada 11) | dois mecanismos **+ o campo que falta no contrato do Generate** (11) |

**Três mecanismos — o teto de face, a fileira sem rua e o último lote da fileira — bloqueiam
quatro das cinco glebas.** Os dois de Antonina são dela sozinha, e Antonina **não zera só com
o motor**: as 11 restantes são o campo de rua pública existente que o contrato v1 não tem.

---

## 3 · O que este prompt NÃO remediu, e por quê

Quatro provas respondem quatro perguntas, e remedi-las daria um **segundo número para a mesma
pergunta** — o que o D116 proíbe. Então foram **lidas**: as 92 do LAB-53, a classe de cada
`frente` do LAB-54, a distância à face entregue do LAB-50, e a rede aparada pela divisa do
LAB-55. **E a lista de hoje foi conferida contra a do LAB-53, chave por chave**: zero só aqui,
zero só lá.

A medição nova é **uma**: a distância da borda do lote ao **contorno** da via mais próxima.

---

## 4 · A SABOTAGEM QUE PASSOU, e o que ela mudou

> **A primeira sabotagem saiu `exit 0`.** Prova em
> [`../provas/LAB-58/sabotagem.json`](../provas/LAB-58/sabotagem.json).

A calibração da régua nova comparava a minha distância com a **classe** que o LAB-54 mediu
com a função do Generate, **e só nos lotes de `frente`**. Troquei o `distAoContorno` pelo
`distanciaAoPoligono` do motor — que devolve **zero para ponto DENTRO** do polígono, isto é,
que diz *"encosta na rua"* para o lote que está **debaixo** do leito — e a ferramenta
**aprovou**.

**Por que passou:** a diferença entre as duas réguas só aparece em lote que está dentro da
superfície viária, e esses são os **`via-sobre-lote`** — que **não têm classe no LAB-54**,
porque o LAB-54 classificou só `frente`.

> **A trava mediu um escopo onde o defeito não podia aparecer.** É o D164 pelo avesso:
> publicar o escopo como número não basta se o escopo **exclui o lugar do defeito**.

**O conserto:** a calibração passou a exigir, **em todo lote acusado**, que a minha distância
**reconstrua o número que a função dele devolve** (teto 1e-6 m) — o critério do meio da
aresta a 0,75 m do contorno e a maior sequência contígua, com a minha distância no lugar da
dele. Refeita a sabotagem: **`exit 1`, 15 lotes**, com a mensagem *"a função DELE devolve
0 m e a MINHA distância reconstrói 13,16 m — a régua é minha e está errada"*.

E vale dizer o que esse bloco **não** é: ele **não julga nada**. Nenhuma violação deste
prompt sai dele; ele existe **para ser refutado**. Não é Validator leve (§4).

---

## 5 · A chave da junção — e ela me pegou dentro do prompt

Numa exploração deste prompt eu juntei a classe do LAB-54 pelo par **`(gleba, lote)`**, e não
por **`(gleba, tipo, lote)`**. **Sete dos 85 lotes acusados têm mais de uma violação**, e o
par curto deu à `via-sobre-lote` a classe da `frente` do mesmo lote. **A contagem saiu 18 onde
eram 22.**

**Mas a trava que eu escrevi para isso me reprovou**, e a conclusão ficou mais estreita (D189):
medida **dentro das 81**, a resposta é **zero** — nas 81 do motor cada lote carrega **uma**
violação. Medidos nas **92**, os sete existem, e são **exatamente** os sete cuja `frente` é do
**contrato** e cuja `via-sobre-lote` é do **motor**.

> **A chave curta não erra em qualquer lugar: ela erra exatamente na fronteira entre o que é
> do contrato e o que é do motor** — a única fronteira que este prompt precisa acertar. Daí os
> 18 onde eram 22.

A trava mudou de escopo por causa disso, e a prova publica os três números: 7 nas 92, 7 deles
na fronteira, **0** entre as 81.

---

## 6 · A conta que não mudou

| | |
|---|---|
| as 92 do LAB-53 | **92**, chave por chave, conferidas |
| do contrato do Generate | **11** (as de Antonina a ≤ 0,5 m da face, com `faixaViaPublica`) |
| do motor | **81** |
| mecanismos distintos | **6** |
| `MECANISMO-NAO-NOMEADO` | **0** |

**E uma precisão que vale registrar**, porque o recado do LAB-55 pode ser lido errado: **as 11
do contrato NÃO são as 11 "régua-no-meio-da-aresta" do LAB-54.** São conjuntos diferentes do
mesmo tamanho. As do contrato são 11 lotes de Antonina a ≤ 0,5 m da face entregue — **7
régua + 4 sem-via**. As da régua são 11 em duas glebas — **7 em Antonina (essas sim, as
mesmas) + 4 em `completo`**, e as 4 de `completo` estão **dentro das 81**, como o mecanismo 4.

---

## 7 · Entrega

- **Ferramenta:** `external-engines/esteira/ferramentas/lab58.ts` (`bun run lab58`)
- **Os mecanismos como DADO:** `external-engines/esteira/src/mecanismos-das-violacoes.ts` —
  seis predicados sobre campos medidos, com a decisão isolada em `decidirMecanismo` para que o
  caminho do estouro seja alcançável por teste
- **Travas:** `external-engines/esteira/tests/mecanismos.test.ts` — **24**, e **elas entraram no
  trabalho do CI que não precisa dos clones vizinhos**: lêem só arquivo deste repositório
  (o `src/` dos mecanismos não importa `@generate/*` nem `@testfit/*`, e as provas vêm do
  disco). O número passou de **114 para 138**, nos quatro arquivos que o citam, com a trava de
  concordância conferindo
- **Provas:** `docs/provas/LAB-58/mecanismos-das-81.json` e `sabotagem.json`
- **Decisões:** D197, D198, D199
- **Verde:** o comando único, sete passos
- **Os três clones vizinhos ficaram limpos** (§4): `motor-testfit` em `4181e95`,
  `urban-create-hub-41d93a4d` em `5b7e9b4`, `urban-scout-tool` em `f38dc0c`, **zero alterações
  nos três** — a leitura do código do motor foi leitura, e toda ela está citada por arquivo e
  função nos seis mecanismos
