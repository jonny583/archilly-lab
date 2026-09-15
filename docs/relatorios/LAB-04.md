# LAB-04 — O SYMBIOS PASSA A FAZER LOTE

**Data:** 15/09/2026 · **Semente:** 20260913 · **Contrato:** motor v1
**Régua:** o Validator e o Judge do **Generate**, sem versão leve e sem limiar
mais frouxo (D20) · **Glebas:** as duas glebas-padrão do Generate, com o relevo
que o LAB-03 lhes deu

---

## O resultado em uma frase

**O Symbios saiu de 0 lotes e entrou na disputa:** 213 lotes em `ensaio-47ha`
com **zero violação**, e 901 em `geo-antonina` com **4** — contra as 53 do
Testfit T02 na mesma gleba. Ele ainda entrega **menos lote** que os outros dois,
e o relatório mede exatamente onde o lote se perde.

**O que se compara passa a ser "Symbios + subdivisão do Lab"**, não o Symbios
sozinho. O motor entrega rede viária e quadras; quem faz lote é o esqueleto reto
escrito aqui. Comparar um motor com uma dupla sem avisar seria trapaça de
medição, e a tabela diz isso em toda linha.

---

## A tabela

Mesma gleba, mesma semente, mesmo Validator, mesmo Judge.

### `ensaio-47ha` — 47,0 ha, retângulo sintético, zero restrições

| | **Symbios + Lab** | **Testfit T02** | Generate `ortogonal` | Generate `espinha` |
|---|---|---|---|---|
| **lotes** | **213** (era **0** no LAB-08) | **599** (`espinha`) | **974** | 776 |
| área vendável | 65 936 m² (**14,03 %** da gleba) | 238 190 m² (50,7 %) | 353 307 m² (75,2 %) | 302 654 m² (64,4 %) |
| lote médio | 309,56 m² | 397,65 m² | 362,74 m² | 390,02 m² |
| testada mediana | 15,39 m | — | — | — |
| **violações** | **0** | **16** (testada 10, face-quadra 6) | 0 | 0 |
| quadras loteáveis | 91 de 94 (27,1 ha) | — | — | — |
| tempo da subdivisão | 253 ms | — | — | — |
| **determinismo** | **OK** | **OK** | — | — |

### `geo-antonina` — 141,8 ha, terreno real, 3 APP

| | **Symbios + Lab** | **Testfit T02** | Generate `ortogonal` | Generate `espinha` |
|---|---|---|---|---|
| **lotes** | **901** (era **0**) | **1 391** (`espinha`) | 1 389 | **1 656** |
| área vendável | 266 665 m² (**18,81 %** da gleba) | 555 573 m² | 508 581 m² | 617 219 m² |
| lote médio | 295,96 m² | 399,41 m² | 366,15 m² | 372,72 m² |
| testada mediana | 15,44 m | — | — | — |
| **violações** | **4** (sobreposição 2, frente 2) | **53** (testada 42, face-quadra 11) | 1 | 0 |
| **violação por lote** | **0,44 %** | **3,81 %** | 0,07 % | 0 % |
| quadras loteáveis | 579 de 698 (121,1 ha) | — | — | — |
| tempo da subdivisão | 3 368 ms | — | — | — |
| **determinismo** | **OK** | **OK** | — | — |

Os números crus: [`../provas/LAB-04/medicoes.json`](../provas/LAB-04/medicoes.json).
As saídas no contrato v1: `docs/contratos/saidas/<gleba>.symbios-loteado.saida.json`.

---

## 1 · O oráculo bate, ponto a ponto

O prompt exigia os dois casos do oráculo como teste. Eles não são números
escolhidos por mim: são **duas implementações independentes** — uma delas em
Rust, com aritmética inteira exata — concordando entre si
([`../STRAIGHT_SKELETON_ANALYSIS.md`](../STRAIGHT_SKELETON_ANALYSIS.md), §4.3 e
§4.4). É o que dá a eles valor de oráculo.

| caso | esperado | medido aqui |
|---|---|---|
| retângulo 60 × 30 · nós | (15, 15) e (45, 15), offset 15 | **igual**, a 3 casas |
| retângulo · frente de onda em 5 | (5,5) (55,5) (55,25) (5,25) | **igual** |
| L 60 × 60 com recorte 30 × 30 · nós | mais um em (15, 45), offset 15 | **igual** |
| L · frente de onda em 5 | (5,5) (55,5) (55,25) (25,25) (25,55) (5,55) | **igual** |

Prova em [`../provas/LAB-04/oraculo.json`](../provas/LAB-04/oraculo.json) e, como
teste que trava, em `external-engines/esteira/tests/esqueleto.test.ts`. O
fechamento das faces dá **1,000** nos dois.

O L é o caso que importa: ele tem canto reflexo, que é exatamente onde recuo
ingênuo se auto-intersecta. A frente de onda o trata certo, e é por isso que o
`offsetInterno` deste arquivo serve de recuo de APP e de profundidade de lote.

---

## 2 · Três defeitos que o oráculo e o Validator pegaram

Nenhum deles era do motor. Os três são do Lab, e os três seriam atribuídos ao
Symbios se a régua não estivesse ali — é a disciplina do CLAUDE.md §6 rendendo
pela terceira rodada seguida.

### 2.1 · Os eventos simultâneos — o retângulo devolvia UM nó

A primeira esteira processava **um evento por iteração**. No retângulo os dois
nós nascem no **mesmo instante**, e o segundo era descartado. Passou a processar
todos os eventos do instante `tMin` juntos, em ordem fixa (aresta → vértice →
divisão), que é o que também garante o determinismo.

### 2.2 · Faltava um tipo de evento inteiro

O nó (15, 45) do L **não sai** de evento de aresta nem de divisão: ele é um
vértice reflexo encontrando **outro vértice**. Sem esse terceiro tipo, o L perdia
o nó e as faces não fechavam. A literatura chama isso de *vertex event*; aqui ele
parte a frente de onda em dois laços.

### 2.3 · As faces saíam em gravata

`ladoEsq` e `ladoDir` estavam cruzados na montagem da face. O sintoma: as faces
do quadrado somavam **2 500 de 5 000 m²** — metade. O teste de propriedade ("as
faces somam a área do anel") é o que mostrou, e ele ficou: vale para qualquer
polígono, não só para os do oráculo.

---

## 3 · O meio-fio não é o eixo — a lição de 369 violações

**A borda de uma quadra do Symbios é o eixo da rua, não o meio-fio.** As quadras
são faces do grafo viário: o que as delimita é a linha de centro. A primeira
versão plantou o lote encostado nessa borda, e o Validator do Generate devolveu o
retrato do erro, sem margem para dúvida:

```text
720 violações · via-sobre-lote 369 de 369 lotes · frente 310
```

O leito da rua, com `largura_m` centrada no eixo, cobria metade de cada lote. O
lote passou a nascer a **meia caixa** do eixo — mais a tolerância de
simplificação, 0,25 m — e as 720 caíram para 68.

É o mesmo erro que o LAB-07 cometeu com a calçada (D18), e a mesma lição: **o
adaptador declara a geometria que existe, não a que parece.**

---

## 4 · Mais três correções, cada uma cobrada pelo Validator

| o que o Validator disse | a causa | a correção | o efeito |
|---|---|---|---|
| `via-sobre-lote` 41 de 252, depois do recuo | **outra** via cruzando a quadra — a rede fragmenta no recorte do LAB-02 | `viaCobre()`: o lote não nasce se o leito de qualquer via o toca | 41 → **0** |
| o arquivo inteiro **recusado** em `geo-antonina`: 97 peças fora da gleba, a pior a 32,06 m | quadra que **atravessa a divisa** | pular a quadra com `fracaoDentroDaGleba < 1` | recusa → aceito; **é o LAB-05** |
| `faixa-legal` 8 — "área 667,5 acima do máximo 600" | a aresta era fatiada em `floor(comprimento / testadaAlvo)`: aresta de 26 m com testada alvo de 13,4 m dá **um** lote de 26 m de testada | o número de fatias preso entre dois limites **que saem dos próprios parâmetros** da gleba | 8 → **0** |
| `frente` 8 — "nenhuma aresta encosta em via" | a pergunta "esta aresta tem rua?" era feita no **meio da aresta**; a rua podia cobrir só um pedaço dela | refazer a mesma pergunta, com a mesma régua, no meio de **cada fatia** | 8 → **2** |

Nenhuma dessas correções inventou regra: área mínima, área máxima e testada
mínima saem de `parametros` da gleba, e o recuo sai da `largura_m` da via.

---

## 5 · Onde o lote se perde — os 3 700 descartes

O Symbios entrega **menos lote** que os outros dois motores, e a conta de onde
ele se perde está inteira. Em `geo-antonina`, das 698 quadras:

| | quadras | por quê |
|---|---|---|
| atravessam a divisa | **119** (17 %) | não loteadas — o lote cairia fora da gleba e o esquema recusa o arquivo. **É o item 2 do LAB-05.** |
| esqueleto não confiável | **86** (15 % das loteáveis) | a quadra é degenerada demais e as faces não fecham. **Declarado, não mascarado** — face aberta produz polígono absurdo, e um já deu erro de área de 5×10¹⁰ %. |
| loteadas, mas sem nenhum lote | 334 | quadra estreita: nenhuma peça passa na área mínima |
| **com lote** | **159** | 901 lotes |

E das peças que o esqueleto produziu: **3 726 descartadas por área mínima**, 65
por via por cima, 16 por não ter rua na própria fatia, 0 por área máxima, 0 por
testada.

O aproveitamento das quadras fica em **22 %** — contra os 50 a 75 % que os outros
motores tiram da gleba inteira. A leitura honesta: as quadras do Symbios são
**muitas e pequenas** (698 quadras em 141,8 ha), o traçado dele é orgânico, e
quadra pequena com forma irregular não aceita lote retangular de 360 m². O ganho
do LAB-05 sai principalmente das 119 quadras que atravessam a divisa.

---

## 6 · As 4 violações que sobraram, e por que elas ficam

Elas ficam **medidas e declaradas**, não consertadas às pressas:

- **2 de `sobreposicao`**, de **0,56 m² e 0,70 m²** — dois lotes vizinhos se
  tocando por um triângulo fino. A suspeita é a tolerância de simplificação de
  0,25 m no anel, que move a aresta compartilhada entre duas faces vizinhas.
  **Não foi medida**, e por isso não é atribuída aqui;
- **2 de `frente`**, das 8 originais. As 6 que caíram vieram da régua por fatia;
  as 2 restantes são, pela mesma suspeita, aresta que a simplificação afastou da
  via mais do que a folga de 0,75 m que o Generate concede.

**0,44 % dos lotes.** O Testfit T02, na mesma gleba, entrega 3,81 %. Consertar
essas 4 é candidato a item do LAB-05, onde a geometria de borda já vai ser
mexida — mas entra na fila como **proposto ao chat**, não por decisão minha.

---

## 7 · O que ficou provado

- **determinismo:** as duas glebas rodadas duas vezes na mesma configuração
  devolvem lote por lote a mesma geometria, casa decimal por casa decimal. A
  subdivisão é função pura da quadra e dos parâmetros — não há semente nela;
- **tempo:** 253 ms em `ensaio-47ha` (91 quadras) e 3,4 s em `geo-antonina` (579
  quadras), contra 6,2 s do motor. O esqueleto tem orçamento duro de 250 ms por
  quadra e **sempre devolve**: travar em silêncio seria pior que devolver
  incompleto e dizer que está incompleto;
- **nada foi escrito em repositório vizinho.** `git status` limpo nos três
  clones (`motor-testfit`, `urban-create-hub-41d93a4d`, `urban-scout-tool`);
- **testes:** 48 verdes na esteira (21 novos, deste prompt) e 14 no adaptador do
  Testfit; `tsc --noEmit` e `eslint` limpos nos dois.

---

## 8 · O que fica para o LAB-05

1. as **119 quadras** de `geo-antonina` (e as 3 de `ensaio-47ha`) que atravessam
   a divisa — item 2 do LAB-05, já na fila;
2. a rede fragmentada, que é o que faz trecho de via sobrar dentro de quadra e
   custou 65 lotes descartados por `viaCobre` — item 1 do LAB-05;
3. **proposto ao chat:** medir as 4 violações que sobraram e o efeito de baixar a
   tolerância de simplificação; e medir as 86 quadras de esqueleto não confiável,
   para saber se é forma degenerada da quadra ou limite da esteira.
