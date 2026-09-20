# LAB-16 — a régua de forma: metade já estava consertada, e o que faltava era outra coisa

**Data:** 20/09/2026 · **Semente:** 20260913 · **Contrato:** `archilly-motor-entrada` v1
**Provas:** [`docs/provas/LAB-16/forma.json`](../provas/LAB-16/forma.json)
**Ferramenta:** `external-engines/esteira/ferramentas/lab16.ts` (`bun ferramentas/lab16.ts`)
**Testes:** `external-engines/esteira/tests/forma.test.ts` — 12 · a esteira inteira, **139 verdes**

---

## Em uma frase

**O conserto que o chat pediu já tinha sido feito no LAB-13**, e a tabela de lá
**já usava a régua certa** — o que ainda estava errado era a régua publicar
**uma contagem só, num corte que ninguém escolheu, com um nome que é veredito de
urbanista**.

---

## 1 · O que já estava consertado — e não se conserta duas vezes

O chat escreveu: *"a sua régua de forma pune quem gira o lote (754 de 776
'irregulares' eram retângulos) — conserte a régua"*.

**Os 754 são o número da régua velha**, a dos eixos, e ela foi trocada no
**LAB-13** (D63). A régua em uso desde então é a `irregularidadeGirada` — a
**caixa de menor área em qualquer orientação** —, e a coluna `irreg` da tabela
do LAB-13 **já é ela**. Nos mesmos 776 lotes: **754 pela régua velha, 84 pela
régua em uso**.

A régua velha continua publicada **ao lado**, e de propósito: é a única forma de
se ver o tamanho do estrago que ela causava. Medido agora nas cinco glebas:

| gleba · motor | pela régua VELHA | pela régua em uso |
|---|---:|---:|
| `completo` · espinha | **1 803 de 1 803** | 226 |
| `completo` · Parcelamento | **1 060 de 1 060** | 33 |
| `completo` · Symbios | **932 de 932** | 814 |
| `ensaio-47ha` · espinha | **754 de 776** | 84 |
| `geo-antonina` · espinha | **1 524 de 1 657** | 51 |
| `geo-antonina` · Parcelamento | **1 386 de 1 386** | 34 |

Dizer que consertei a régua de novo seria mentir sobre trabalho. **Não
consertei: ela já estava.**

---

## 2 · O que ainda estava errado, e é mais fino

A régua publicava **um número só**: `naoRetangulares`, os lotes que perdem mais
de **1 %** da caixa de menor área. Dois defeitos, os dois medidos.

### 2.1 · O corte de 1 % é meu, não do Jonny — e ele manda no resultado

| gleba · motor | acima de 1 % | acima de 5 % | acima de 10 % |
|---|---:|---:|---:|
| `geo-antonina` · Parcelamento | **34** | 15 | **0** |
| `geo-antonina` · espinha | 51 | 26 | 15 |
| `completo` · ortogonal | 66 | 19 | 7 |
| `ensaio-47ha` · espinha | 84 | 36 | 29 |
| `geo-antonina` · Symbios | 939 | 818 | 630 |

**Três respostas para a mesma pergunta**, e a que saía na tabela era a de um
corte que ninguém escolheu. O caso do Laboratório de Parcelamento em
`geo-antonina` é o mais claro: **34 ou zero**, conforme o corte.

**A régua passa a publicar os três, sempre.** Publicar um só esconde que a
resposta depende dele (**D76**).

### 2.2 · "Irregular" é palavra de urbanista, e a régua não é urbanista

Medido: **o que a régua marcava não eram lotes deformados.** A composição dos
marcados, nas cinco glebas:

| gleba · motor | as formas, em ordem |
|---|---|
| `completo` · ortogonal | 1 526 retângulos · 34 pentágonos · 4 polígonos de 18 lados |
| `completo` · Parcelamento | 1 023 retângulos · 20 trapézios · 16 pentágonos |
| `ensaio-47ha` · Symbios | 82 pentágonos · 54 trapézios · 28 hexágonos · 24 retângulos |
| `geo-antonina` · Parcelamento | 1 347 retângulos · **30 trapézios** · 9 pentágonos |
| `geo-antonina` · Symbios | 422 pentágonos · 236 hexágonos · 154 trapézios · 76 quadriláteros |

São **lote de esquina, lote na curva, lote encostado na APP**. Um trapézio numa
rua curva é um lote **normal** — e chamá-lo de irregular é **decidir urbanismo**,
que é do Jonny (CLAUDE.md §4).

**A régua passa a publicar a composição por forma, e nenhuma das palavras dela é
um juízo** (**D77**). `trapézio` não quer dizer ruim e `retângulo` não quer
dizer bom: um retângulo de 4 m de testada é pior que um trapézio de 12 m. Há
teste que morde se alguém acrescentar "irregular" ou "ruim" ao vocabulário.

**O que separa lote bom de lote ruim virou item em
[`docs/PENDENCIAS_JONNY.md`](../PENDENCIAS_JONNY.md)**, não escolha minha.

---

## 3 · O terceiro defeito, que só apareceu porque classifiquei as formas

Ao pôr nome nas formas, apareceram lotes com irregularidade de **0,099** cujos
quatro cantos davam **90,0°**. Impossível: um retângulo preenche a própria caixa.

Resultado suspeito se mede antes de ter culpado (CLAUDE.md §6). Medido: **o
polígono tinha 49 vértices.** Era um lote de **testada curva**, e a tolerância de
colinearidade da classificação tinha achatado o arco numa reta.

**A régua não estava errada; a classificação estava.** O conserto: os lados são
formados juntando arestas vizinhas que viram pouco — assim o arco vira **um
lado**, em vez de quarenta de meio grau — e um lado que soma mais de 5° de giro
sai contado como **curvo**, em vez de alisado em silêncio (**D78**).

Medido: **101 lotes com lado curvo** na candidata espinha em `completo`, 41 em
`50ha-ondulado`, 31 em `ensaio-47ha`, 28 em `geo-antonina`. O ortogonal tem 3, e
o Laboratório de Parcelamento e o Symbios, **zero** — eles não fazem testada em
arco. É informação que a contagem sozinha não dava.

---

## 4 · O que muda na tabela do LAB-13

**Nenhum número muda.** A coluna `irreg` já era a régua girada no corte de 1 %, e
a reprovação das cinco glebas **reproduziu os vinte valores exatamente** — 66,
226, 33, 814 · 60, 67, 14, 301 · 22, 23, 8, 24 · 46, 84, 10, 187 · 37, 51, 34,
939. Isso é uma prova a mais de determinismo: **dois prompts diferentes, dias
diferentes, o mesmo número.**

**O que muda é o que a coluna quer dizer.** Ela sozinha era enganosa, em três
frentes:

| antes | agora |
|---|---|
| uma contagem, no corte de 1 % | a contagem nos **três** cortes, e a distribuição inteira |
| chamada de "irregulares" | chamada pelo que é: **acima de tal corte**, sem veredito |
| sem dizer o que são | com a **composição por forma**, e os lotes de **lado curvo** |

**A leitura do LAB-13 que precisa ser corrigida** é a do Symbios. A tabela diz
"814 de 932 irregulares", e isso lido como "o motor faz lote deformado" está
errado: são **402 pentágonos, 213 hexágonos, 114 trapézios e 96 retângulos**. O
Symbios **não faz lote torto — ele faz lote não-ortogonal**, que é o que um
traçado por campo tensor produz. Se isso é bom ou ruim é do Jonny, e a tabela
não tinha o direito de já ter respondido.

Nenhuma outra coluna do LAB-13 é tocada: lotes, área vendável, % privativa,
violações, sobras, determinismo e tempo saem do Validator, do Judge e da
`medirSobras` do Generate, e a régua de forma não entra em nenhum deles.

---

## 5 · Os vizinhos ficaram limpos

`git status` nos três clones de leitura ao fim da rodada:
`urban-create-hub-41d93a4d`, `motor-testfit` e `urban-scout-tool` — **nenhuma
alteração**. Nada foi escrito em repositório vizinho (CLAUDE.md §4).

---

## 6 · O que fica pronto

- `external-engines/esteira/src/forma.ts` — a régua: perfil por lote, lados,
  arco, classe, e a distribuição com os três cortes;
- `external-engines/esteira/ferramentas/lab16.ts` — a reprovação das cinco
  glebas;
- `external-engines/esteira/tests/forma.test.ts` — 12 testes;
- `docs/provas/LAB-16/forma.json` — os números crus;
- um item novo em `docs/PENDENCIAS_JONNY.md`: **o que conta como lote de forma
  ruim**.
