# LAB-19 — a regra de forma do chat, aplicada e na tabela

**Data:** 02/10/2026 · **Semente:** 20260913 · **Contrato:** `archilly-motor-entrada` v1
**Provas:** [`docs/provas/LAB-19/tabela.json`](../provas/LAB-19/tabela.json)
**Ferramenta:** `external-engines/esteira/ferramentas/lab19.ts` (`bun ferramentas/lab19.ts`)
**Testes:** `external-engines/esteira/tests/forma.test.ts` — 19 (7 novos) · a esteira inteira, **146 verdes**

---

## A regra, como o chat a deu

> **Área útil abaixo de 85 % do retângulo envolvente = "a conferir".
> Abaixo de 70 % = "ruim".**

É a resposta à pergunta que o LAB-16 abriu e **não quis responder sozinho**
(D76): o corte de 1 % que eu usava era meu, sem critério, e mandava no
resultado — 34 ou zero lotes conforme o corte, na mesma gleba.

**"Útil" aqui é a área do lote dividida pela área da caixa de MENOR área**, em
qualquer orientação (D63). Um retângulo preenche 100 %; um triângulo, 50 %.

**Quem decidiu foi o chat, não o Jonny.** Como no "3× / 1,5 km" (D61), está
valendo e está **à vista em [`PENDENCIAS_JONNY.md`](../PENDENCIAS_JONNY.md)** até
ele confirmar — e **não trava nada**, como o chat mandou (**D79**).

---

## Em uma frase

**Pela regra do chat, três dos quatro motores não têm problema de forma** — 0 a
1,9 % de lotes "ruim" —, e **o único com problema é o Symbios**, com 23 a 39 %
de lotes "a conferir" em quatro das cinco glebas.

---

## A tabela comparativa, com a coluna nova

A coluna nova são as três últimas: **ok · a conferir · ruim**.

### `completo` — 141,8 ha

| motor | lotes | vendável | viol | **ok** | **a conferir** | **ruim** | útil mediana |
|---|---:|---:|---:|---:|---:|---:|---:|
| Generate · ortogonal | 1 605 | 61,41 ha | 0 | **1 603** | 2 · 0,1 % | **0** | 1,000 |
| Generate · espinha | 1 803 | 69,91 ha | 1 | 1 767 | 1 · 0,1 % | **35 · 1,9 %** | 1,000 |
| Laboratório de Parcelamento | 1 060 | 42,44 ha | 25 | 1 059 | 1 · 0,1 % | **0** | 1,000 |
| Symbios + subdivisão do Lab | 932 | 28,73 ha | 1 | 550 | **308 · 33,0 %** | 74 · 7,9 % | 0,887 |

### `sintetico-50ha-ondulado` — 50,0 ha

| motor | lotes | vendável | viol | **ok** | **a conferir** | **ruim** | útil mediana |
|---|---:|---:|---:|---:|---:|---:|---:|
| Generate · ortogonal | 1 003 | 37,30 ha | 0 | **1 003** | 0 | **0** | 1,000 |
| Generate · espinha | 785 | 33,34 ha | 0 | 772 | 0 | 13 · 1,7 % | 1,000 |
| Laboratório de Parcelamento | 501 | 19,99 ha | 18 | 497 | 4 · 0,8 % | **0** | 1,000 |
| Symbios + subdivisão do Lab | 318 | 9,59 ha | 0 | 172 | **125 · 39,3 %** | 21 · 6,6 % | 0,859 |

### `sintetico-10ha-plano` — 10,0 ha

| motor | lotes | vendável | viol | **ok** | **a conferir** | **ruim** | útil mediana |
|---|---:|---:|---:|---:|---:|---:|---:|
| Generate · ortogonal | 171 | 6,96 ha | 0 | **171** | 0 | **0** | 1,000 |
| Generate · espinha | 139 | 6,07 ha | 0 | 132 | 0 | 7 · 5,0 % | 1,000 |
| Laboratório de Parcelamento | 124 | 4,90 ha | 29 | 120 | 4 · 3,2 % | **0** | 1,000 |
| Symbios + subdivisão do Lab | 66 | 2,35 ha | 0 | 49 | **15 · 22,7 %** | 2 · 3,0 % | 1,000 |

### `ensaio-47ha` — 47,0 ha

| motor | lotes | vendável | viol | **ok** | **a conferir** | **ruim** | útil mediana |
|---|---:|---:|---:|---:|---:|---:|---:|
| Generate · ortogonal | 974 | 35,33 ha | 0 | **974** | 0 | **0** | 1,000 |
| Generate · espinha | 776 | 30,28 ha | 0 | 760 | 2 · 0,3 % | 14 · 1,8 % | 1,000 |
| Laboratório de Parcelamento | 599 | 23,82 ha | 16 | 590 | 9 · 1,5 % | **0** | 1,000 |
| Symbios + subdivisão do Lab | 214 | 6,61 ha | 0 | 133 | **73 · 34,1 %** | 8 · 3,7 % | 0,896 |

### `geo-antonina` — 141,8 ha

| motor | lotes | vendável | viol | **ok** | **a conferir** | **ruim** | útil mediana |
|---|---:|---:|---:|---:|---:|---:|---:|
| Generate · ortogonal | 1 389 | 50,86 ha | 1 | **1 389** | 0 | **0** | 1,000 |
| Generate · espinha | 1 657 | 61,74 ha | 0 | 1 648 | 0 | 9 · 0,5 % | 1,000 |
| Laboratório de Parcelamento | 1 386 | 55,50 ha | 15 | **1 386** | 0 | **0** | 1,000 |
| Symbios + subdivisão do Lab | 1 014 | 29,85 ha | 4 | 562 | **365 · 36,0 %** | 87 · 8,6 % | 0,866 |

---

## O que a tabela diz

### 1 · A regra do chat **absolveu** três motores que o corte de 1 % condenava

O LAB-16 mostrou que o corte de 1 % marcava **trapézios de rua curva** — lotes
normais. A regra do chat os solta, e o efeito é grande:

| gleba · motor | marcados pelo corte de 1 % | "a conferir" + "ruim" pela regra do chat |
|---|---:|---:|
| `geo-antonina` · Parcelamento | 34 | **0** |
| `completo` · Parcelamento | 33 | **1** |
| `completo` · ortogonal | 66 | **2** |
| `ensaio-47ha` · espinha | 84 | **16** |
| `geo-antonina` · Symbios | 939 | **452** |

**O trapézio de 1 m de recuo em 30 preenche 96,7 % da caixa** — pela régua
antiga era "irregular", pela regra do chat é **ok**. Há teste que fixa isso.

### 2 · O Symbios é o único com problema de forma — e é "a conferir", não "ruim"

Em quatro das cinco glebas, **um terço dos lotes do Symbios** cai em "a
conferir": 33,0 %, 39,3 %, 34,1 %, 36,0 %. Os "ruim" são bem menos — 3 a 8,6 %.

É coerente com o que o LAB-16 mediu: ele não faz lote **torto**, faz lote
**não-ortogonal** (pentágonos e hexágonos do traçado por campo tensor), e um
pentágono com o canto cortado preenche uns 80 % da caixa. **A faixa "a conferir"
do chat caiu exatamente em cima dessa população**, que é o que uma faixa
intermediária serve para fazer.

Na `sintetico-10ha-plano` a mediana dele é **1,000** e ainda assim 22,7 % estão
"a conferir": a maioria é retângulo perfeito, e a cauda é que pesa. **Mediana não
substitui a contagem** — as duas estão na tabela por isso.

### 3 · A candidata espinha tem a forma mais **bimodal** da mesa

Ela é o único motor com **mais "ruim" que "a conferir"** — 35 contra 1 em
`completo`, 13 contra 0 em `50ha-ondulado`, 7 contra 0 em `10ha-plano`.

Lido: **ela não faz lote levemente fora de esquadro; faz retângulo perfeito ou
desastre.** São poucos (0,5 a 5 % dos lotes), mas são lotes que preenchem menos
de 70 % da caixa — e a faixa do meio, que apanharia um erro gradual, fica vazia.
Para quem for olhar os casos, eles estão no `tabela.json`, em
`forma.porClasse` (**D80**).

---

## O que esta coluna NÃO é

**Não é régua de aprovação.** Quem aprova candidata é o **Validator do Generate**
(D20), e forma de lote **não é violação dele** — a prova está na tabela: o
Laboratório de Parcelamento em `10ha-plano` tem **29 violações e zero lotes
"ruim"**, e a ortogonal em `geo-antonina` tem **1 violação e zero "ruim"**. As
duas réguas medem coisas diferentes, e misturá-las faria a tela reprovar por
motivo que o Validator não deu.

**Não olha testada, relevo nem para quem o lote dá frente.** Um retângulo de 4 m
de testada sai "ok" aqui e é pior que um trapézio de 12 m que sai "a conferir".
A composição por forma (D77) continua publicada ao lado exatamente por isso.

---

## Os vizinhos ficaram limpos

`git status` nos três clones de leitura ao fim da rodada:
`urban-create-hub-41d93a4d`, `motor-testfit` e `urban-scout-tool` — **nenhuma
alteração**. Nada foi escrito em repositório vizinho (CLAUDE.md §4).

---

## O que fica pronto

- `external-engines/esteira/src/forma.ts` — `UTIL_A_CONFERIR`, `UTIL_RUIM`,
  `vereditoDeForma`, e o veredito dentro do perfil e da distribuição;
- `external-engines/esteira/ferramentas/lab19.ts` — a tabela comparativa inteira
  com a coluna nova;
- `docs/provas/LAB-19/tabela.json` — os números crus, **e a entrada do LAB-20**;
- 7 testes novos, inclusive as bordas exatas de 85 % e 70 %.
