# LAB-05 — RECORTAR A QUADRA, DESCARTAR A LASCA, E O QUE NÃO SE RECONECTA

**Data:** 15/09/2026 · **Semente:** 20260913 · **Contrato:** motor v1
**Régua:** o Validator e o Judge do **Generate** (D20) · **Glebas:** as três do
LAB-02 e as duas glebas-padrão com o relevo do LAB-03

---

## O resultado em uma frase

**Nenhuma quadra passa mais da divisa** — de 2 591 vértices fora da folga de 5 cm
em `geo-antonina`, o pior a **170,98 m**, para **zero** — e os lotes sobem de 876
para **1 014**, com as violações do Validator inalteradas. **O terceiro item do
prompt, "reconectar a rede", não era defeito para consertar:** os dois blocos de
`geo-antonina` estão separados por uma **APP hídrica de 14,4 ha**, e ligá-los é
decisão de urbanismo, não minha.

---

## A tabela

| | `completo` | `50ha-ondulado` | `10ha-plano` | `ensaio-47ha` | `geo-antonina` |
|---|---|---|---|---|---|
| gleba | 141,8 ha | 50,0 ha | 10,0 ha | 47,0 ha | 141,8 ha |
| **vértice de quadra além da folga de 5 cm** | 2 017 → **0** | 708 → **0** | 21 → **0** | 63 → **0** | 2 591 → **0** |
| pior distância fora | 162,79 m → **0** | 114,65 m → **0** | 98,04 m → **0** | 15,01 m → **0** | 170,98 m → **0** |
| quadras que atravessavam | 74 → **0** | 37 → **0** | 3 → **0** | 5 → **0** | 128 → **0** |
| recortadas → peças | 74 → 76 | 37 → 37 | 3 → 3 | 5 → 5 | 128 → 129 |
| **não recortaram** (perda declarada) | **0** | **0** | **0** | **0** | **0** |
| deslocamentos contra degenerescência | **0** | **0** | **0** | **0** | **0** |
| lascas descartadas (D48) | 14 (118,7 m) | 0 | 0 | 2 (12,8 m) | 17 (157,3 m) |
| quanto isso é do comprimento | 0,31 % | 0 % | 0 % | 0,08 % | 0,26 % |
| conectividade no maior bloco | 97,58 → 97,71 % | 97,99 % | 94,68 % | 99,81 → 99,88 % | 70,40 → **70,46 %** |
| **determinismo** | **OK** | **OK** | **OK** | **OK** | **OK** |

Os números crus: [`../provas/LAB-05/medicoes.json`](../provas/LAB-05/medicoes.json).
As saídas no contrato v1: `docs/contratos/saidas/<gleba>.symbios-recortado.saida.json`.

### O Judge, nas duas glebas que têm lote

| | `ensaio-47ha` | | `geo-antonina` | |
|---|---|---|---|---|
| | **sem** o recorte | **com** | **sem** | **com** |
| quadras puladas por atravessar | 5 | **0** | 128 | **0** |
| **lotes** | 181 | **214** | 876 | **1 014** |
| área vendável | 5,59 ha (11,90 %) | **6,61 ha (14,07 %)** | 25,88 ha (18,26 %) | **29,85 ha (21,06 %)** |
| **Validator** | **0** | **0** | 4 | **4** |

**As violações não mudaram.** O recorte acrescentou 33 e 138 lotes sem acrescentar
uma violação sequer — que é o que se pede de um recorte: mais terra utilizável,
mesma qualidade.

Contra as referências do LAB-08 e dos vereditos do Generate:

| | Symbios + Lab | Testfit T02 | Generate `ortogonal` | Generate `espinha` |
|---|---|---|---|---|
| `ensaio-47ha` | **214** · 0 violações | 599 · 16 | 974 · 0 | 776 · 0 |
| `geo-antonina` | **1 014** · 4 violações (0,39 %) | 1 391 · 53 (3,81 %) | 1 389 · 1 | 1 656 · 0 |

---

## 1 · O item que não era defeito: a APP é que separa

O prompt trazia *"reconectar a rede depois do corte — `geo-antonina` fragmenta a
70,4 %"* como coisa a consertar. **Medido, não é.**

A fragmentação não é farelo: é **um bloco de 17 296 m separado de um de
42 899 m**, mais 739 m em 23 pedacinhos. Dois blocos, não vinte e cinco.

Por que eles se separaram:

| | |
|---|---|
| vias da rede **crua** que ligavam os dois blocos | **17** |
| comprimento delas **fora da gleba** | 10 037 m |
| comprimento delas **dentro de APP** | 1 682 m |
| menor vão entre os dois blocos | **72,45 m** |
| desse vão, quanto está dentro de APP | **200 de 201 pontos amostrados** |

As restrições de `geo-antonina` são três APP hídricas — 14,4 ha, 2,0 ha e
1,0 ha. **A gleba tem um curso d'água atravessando-a**, e o corte fez exatamente
o que tinha de fazer: tirou a rua de cima dele.

Ligar os dois blocos significa **lançar via sobre APP** — uma travessia. Isso é
regra urbanística, e o CLAUDE.md §4 é explícito: *não decide urbanismo*. Foi para
[`../PENDENCIAS_JONNY.md`](../PENDENCIAS_JONNY.md) como pergunta, e para a fila
como proposto ao chat. **Os 70,4 % são a resposta certa, não o defeito.**

O que sobra de fragmentação genuína — os 23 pedacinhos — é lasca de corte, e é o
item 3 que a trata: 17 delas saíram pela D48, e os componentes caíram de 25 para
19 sem que uma via de verdade fosse tocada.

---

## 2 · O recorte da quadra, e por que precisou de algoritmo novo

O `lotear.ts` corta lote por semiplano, e lá isso basta. Aqui não: **a gleba não
é convexa**, e uma quadra que sai e volta pela divisa devolve **duas peças**.
Semiplano não faz nenhuma das duas coisas.

`@symbios/poligono.ts` é **Greiner–Hormann** (1998), escrito aqui a partir da
descrição — como o esqueleto reto do LAB-04, e pela mesma razão: as bibliotecas
prontas são copyleft ou trariam dependência npm a um adaptador que **não tem
nenhuma** por decisão (D14).

**A degenerescência, que é o buraco conhecido do algoritmo:** ele pressupõe que
travessia nenhuma cai exatamente em cima de um vértice — e cai, porque quadra e
gleba compartilham vértice. Aqui ela é **detectada e contornada**: o recorte é
refeito com o anel deslocado de décimos de milímetro, numa sequência fixa e
determinística, e o maior deslocamento (0,2 mm) está três ordens de grandeza
abaixo da folga de divisa do contrato, que é 5 cm. **Nas cinco glebas reais,
nenhum deslocamento foi preciso** — a degenerescência aparece nos casos
sintéticos dos testes, onde ela é fabricada de propósito.

Se os oito deslocamentos falhassem, a função devolve `null` e a quadra é **perda
declarada** — nunca peça torta. É a mesma regra do esqueleto não confiável (D51).
**Nas cinco glebas, zero perdas.**

---

## 3 · A lasca, pela régua da própria gleba (D48)

A D48 diz: trecho **criado pelo corte** mais curto que o lado do lote mínimo da
gleba é resto de corte, não rua. O lado sai de `areaMinLote_m2` pela raiz
quadrada — 14,14 m nas cinco glebas.

E ela diz também o que **não** fazer: *não descarta trecho curto que o motor
desenhou inteiro*. Por isso o recorte marca quais trechos nasceram do corte (a
via foi partida, ou encurtada) e só esses passam pela régua. **Um teste trava
isso**: se um trecho curto intacto sumisse, a regra teria passado do que a D48
autoriza.

Resultado: 33 lascas nas cinco glebas, 288,8 m no total — **menos de um terço de
um por cento** do comprimento em qualquer delas.

---

## 4 · O defeito que a medição encontrou: a régua do "atravessa" tinha ponto cego

Este é o achado do prompt, e ele é do **Lab**, não do motor — a terceira rodada
seguida em que "medir antes de atribuir" (CLAUDE.md §6) muda o culpado.

Com o recorte pronto, conferi o resultado com régua independente: **algum
vértice de quadra passa da divisa?** A resposta deveria ser não, e foram
**8 quadras** nas duas glebas-padrão, a pior **1,49 m** fora.

Não era do recortador — as quadras culpadas **não tinham passado por ele**. Elas
declaravam `fracaoDentroDaGleba` = **1,0000**.

A causa, em uma linha: `fracaoDentro` amostra o raio do centróide a cada vértice
em `t = (k + 0,5) / 8`, que vai de 0,0625 a **0,9375**. **O vértice nunca é
amostrado.** Uma quadra com a ponta de fora dava 1,0000 e ninguém a recortava.

Duas correções, e a segunda torna a primeira não-crítica:

1. a amostra passou a ir até `t = 1` — mesmo método, mesmas 8 amostras, mesmo
   custo, e agora o extremo da amostra alcança o extremo da coisa medida (D55);
2. **o recorte deixou de perguntar a ela.** Ele recorta **todas** as quadras e
   deixa a interseção responder: quadra já inteira dentro volta idêntica (D56).

A segunda importa porque a amostragem continua sendo estimativa — uma quadra
pode ter todo vértice dentro e ainda inchar para fora numa reentrância, e amostra
nenhuma pega isso.

**O que isso muda em número já publicado, e que fique dito:** com a régua
consertada aparecem mais quadras atravessando — `ensaio-47ha` 3 → 5,
`geo-antonina` 119 → 128, `completo` 73 → 74, `50ha` 36 → 37 — e `geo-antonina`
passa de 698 para **701 quadras**. Os **213 e 901 lotes do LAB-04** foram medidos
com a régua cega; com ela consertada, a mesma estratégia de pular a quadra que
atravessa dá **181 e 876** — porque agora se sabe que eram mais. O recorte então
os leva a **214 e 1 014**. O ganho do LAB-05 é 33 e 138 lotes; o resto é a régua
dizendo a verdade.

---

## 5 · O que ficou provado

- **a meta:** zero vértice de quadra além da folga de 5 cm do contrato, nas
  cinco glebas. Conferido com régua independente da que faz o recorte — por
  **distância** à divisa, não por teste booleano, porque vértice em cima da
  divisa cai dos dois lados conforme o arredondamento;
- **determinismo:** as cinco glebas recortadas duas vezes devolvem a mesma
  geometria, ponto por ponto, em quadra e em via;
- **desligado é desligado:** sem opção nenhuma, o recorte devolve exatamente o
  que o LAB-02 publicou — as duas coisas do LAB-05 se pedem, e a medição sai nas
  duas passagens (CLAUDE.md §4). Um teste trava isso;
- **tempo:** 126 ms para recortar 702 quadras de `geo-antonina`, contra 6,2 s do
  motor;
- **nada foi escrito em repositório vizinho.** `git status` limpo nos três
  clones (`motor-testfit`, `urban-create-hub-41d93a4d`, `urban-scout-tool`);
- **testes:** 64 verdes na esteira (16 novos, deste prompt) e 14 no adaptador do
  motor de parcelamento; `tsc --noEmit` e `eslint` limpos nos dois.

---

## 6 · O que fica para depois

**Para o Jonny** (já em `PENDENCIAS_JONNY.md`): a gleba de Antonina é cortada em
duas por um curso d'água. **Pode haver travessia?** Sem ela, um terço do terreno
só se alcança dando a volta por fora — e "por fora" é terra que não é da gleba.

**Proposto ao chat, sem executar:**

1. **as 4 violações que sobraram** em `geo-antonina` (2 de sobreposição, de 0,56
   e 0,70 m², e 2 de frente) — a suspeita segue a mesma do LAB-04, §6, e segue
   **não medida**;
2. **as 96 quadras de esqueleto não confiável** (eram 86 antes do recorte; o
   recorte cria peça nova e algumas delas também não fecham). É forma degenerada
   da quadra ou limite da esteira? Hoje são puladas e contadas (D51);
3. **a quadra dentro de APP.** O recorte de agora é pela **divisa**. Quadra que
   cai dentro de APP continua de pé, e o Validator do Generate não a acusa —
   nenhum dos onze invariantes olha restrição de motor externo. Medir quanto é, e
   se deve ser recortada também, é escopo novo e não foi ampliado aqui.
