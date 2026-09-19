# LAB-13 — TRÊS MOTORES, CINCO GLEBAS, UMA RÉGUA SÓ

**Data:** 19/09/2026 · **Semente:** 20260913 · **Contrato:** motor v1
**Régua:** o Validator, o Judge e a `medirSobras` do **Generate** — os três, para
os quatro concorrentes, pelo mesmo caminho
**Para quê:** a base de comparação da decisão de família de unificar a tela de
parcelamento com vários motores por baixo

> **Sem recomendação de produto.** O prompt pediu números e uma leitura curta do
> que cada motor faz melhor. Qual deles deve ser o padrão depende do que se quer
> do terreno, e isso é do Jonny e do chat.

---

## A tabela

Mesmas cinco glebas, **mesmos parâmetros** (conferido e abortável — ver §5),
mesma semente, mesma régua.

`sobra` é a terra da massa que **não virou lote, nem leito, nem reserva**, medida
pela `medirSobras` do Generate a passo de 5 m. `irreg` é o número de lotes que
**não são retângulos** pela caixa girada (§4), e `med` é a mediana dessa
irregularidade.

### `completo` — 141,8 ha, 3 APP, relevo forte

| motor | lotes | vendável | % priv | violações | sobra | % da massa | peças | irreg | med | ms | det |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Generate · ortogonal | 1 605 | 61,41 ha | 43,3 | **0** | 66,83 ha | 47,1 | 33 | 66 | 0,000 | 1 632 | OK |
| Generate · espinha | **1 803** | **69,91 ha** | **49,3** | 1 | 48,72 ha | 34,4 | 165 | 226 | 0,000 | 1 651 | OK |
| Laboratório de Parcelamento | 1 060 | 42,44 ha | 29,9 | 25 | **19,44 ha** | **13,7** | 41 | 33 | 0,000 | 4 963 | OK |
| Symbios + subdivisão do Lab | 932 | 28,73 ha | 20,3 | 1 | 82,18 ha | 58,0 | 561 | 814 | 0,113 | 5 126 | OK |

### `sintetico-50ha-ondulado` — 50,0 ha, sem restrição

| motor | lotes | vendável | % priv | violações | sobra | % da massa | peças | irreg | med | ms | det |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Generate · ortogonal | **1 003** | **37,30 ha** | **74,6** | **0** | 4,33 ha | 8,7 | 30 | 60 | 0,000 | 395 | OK |
| Generate · espinha | 785 | 33,34 ha | 66,7 | **0** | 6,27 ha | 12,5 | 87 | 67 | 0,000 | 387 | OK |
| Laboratório de Parcelamento | 501 | 19,99 ha | 40,0 | 18 | **0,23 ha** | **0,5** | 11 | 14 | 0,000 | 1 923 | OK |
| Symbios + subdivisão do Lab | 318 | 9,59 ha | 19,2 | **0** | 26,26 ha | 52,5 | 257 | 301 | 0,141 | 1 159 | OK |

### `sintetico-10ha-plano` — 10,0 ha, quase sem desnível

| motor | lotes | vendável | % priv | violações | sobra | % da massa | peças | irreg | med | ms | det |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Generate · ortogonal | **171** | **6,96 ha** | **69,6** | **0** | 1,42 ha | 14,2 | 14 | 22 | 0,000 | **59** | OK |
| Generate · espinha | 139 | 6,07 ha | 60,7 | **0** | 1,76 ha | 17,6 | 32 | 23 | 0,000 | 60 | OK |
| Laboratório de Parcelamento | 124 | 4,90 ha | 49,0 | 29 | **0,06 ha** | **0,6** | 2 | 8 | 0,000 | 244 | OK |
| Symbios + subdivisão do Lab | 66 | 2,35 ha | 23,5 | **0** | 6,09 ha | 60,9 | 26 | 24 | 0,000 | 426 | OK |

### `ensaio-47ha` — 47,0 ha, retângulo sintético, sem restrição

| motor | lotes | vendável | % priv | violações | sobra | % da massa | peças | irreg | med | ms | det |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Generate · ortogonal | **974** | **35,33 ha** | **75,2** | **0** | 3,48 ha | 7,4 | **7** | 46 | 0,000 | 342 | OK |
| Generate · espinha | 776 | 30,28 ha | 64,4 | **0** | 4,61 ha | 9,8 | 83 | 84 | 0,000 | 353 | OK |
| Laboratório de Parcelamento | 599 | 23,82 ha | 50,7 | 16 | **0,04 ha** | **0,1** | 4 | 10 | 0,000 | 1 393 | OK |
| Symbios + subdivisão do Lab | 214 | 6,61 ha | 14,1 | **0** | 27,13 ha | 58,0 | 195 | 187 | 0,104 | 579 | OK |

### `geo-antonina` — 141,8 ha, terreno real, 3 APP, 1 testada de frente

| motor | lotes | vendável | % priv | violações | sobra | % da massa | peças | irreg | med | ms | det |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Generate · ortogonal | 1 389 | 50,86 ha | 35,9 | 1 | 78,84 ha | 55,6 | **19** | 37 | 0,000 | 443 | OK |
| Generate · espinha | **1 657** | **61,74 ha** | **43,6** | **0** | 65,32 ha | 46,1 | 63 | 51 | 0,000 | 489 | OK |
| Laboratório de Parcelamento | 1 386 | 55,50 ha | 39,1 | 15 | **6,08 ha** | **4,3** | 22 | 34 | 0,000 | 5 825 | OK |
| Symbios + subdivisão do Lab | 1 014 | 29,85 ha | 21,1 | 4 | 65,15 ha | 46,0 | 874 | 939 | 0,134 | 7 978 | OK |

**Violações por regra**, que é como o prompt pediu:

| gleba | Generate ortogonal | Generate espinha | Parcelamento | Symbios + Lab |
|---|---|---|---|---|
| `completo` | — | `faixa-legal` 1 | `frente` 23, `testada` 2 | `sobreposicao` 1 |
| `50ha-ondulado` | — | — | `face-quadra` 8, `testada` 7, `frente` 3 | — |
| `10ha-plano` | — | — | `testada` 28, `frente` 1 | — |
| `ensaio-47ha` | — | — | `testada` 10, `face-quadra` 6 | — |
| `geo-antonina` | `face-quadra` 1 | — | `frente` 15 | `sobreposicao` 2, `frente` 2 |

Os números crus: [`../provas/LAB-13/medicoes.json`](../provas/LAB-13/medicoes.json).

---

## 1 · A leitura curta: o que cada um faz melhor

**Sem recomendação.** São quatro frases, cada uma sustentada por coluna da
tabela.

- **Generate · ortogonal — o que mais aproveita terreno regular.** 75,2 % de área
  privativa em `ensaio-47ha`, 74,6 % em `50ha`, 69,6 % em `10ha`: os três
  melhores da tabela, todos dele. E a sobra sai em **poucas peças grandes** (7,
  14, 30), que é sobra negociável — uma peça de 3 ha se estuda, trezentas lascas
  não. É também o mais rápido: 59 ms na gleba pequena.
- **Generate · espinha — o que melhor acompanha forma difícil.** Nas duas glebas
  de contorno real ele passa a ortogonal em lotes e em área: **1 803 contra
  1 605** em `completo`, **1 657 contra 1 389** em `geo-antonina`. Nas
  retangulares perde. É o motor cuja vantagem aparece exatamente onde a forma
  deixa de ser simples.
- **Laboratório de Parcelamento — o que menos desperdiça terra.** A sobra dele é
  de outra ordem de grandeza: **0,1 % a 13,7 %** da massa, contra 7 % a 58 % dos
  outros três. Em `ensaio-47ha`, 0,04 ha de sobra contra 3,48 ha do melhor
  concorrente — quase cem vezes menos. **O preço está na coluna ao lado:** é o
  único que carrega violação do Validator nas cinco glebas, de 15 a 29.
- **Symbios + subdivisão do Lab — o único que lê o relevo.** Nenhum dos outros
  três olha as curvas de nível; ele traça pelo campo tensorial delas. Entrega
  menos lote que todos (14 % a 23 % de área privativa) e é o único com lote que
  **não é retângulo** (mediana 0,10 a 0,14), porque o lote dele nasce de face de
  esqueleto e não de fatia de grade. Passa limpo no Validator em 3 das 5.

E uma linha que vale para os quatro: **determinismo OK em 20 de 20 rodadas** —
cinco glebas, quatro motores, cada um rodado duas vezes e comparado saída
inteira contra saída inteira.

---

## 2 · O que a tabela NÃO diz, e por que ela não pode dizer

O prompt pediu "aderência a via desenhada à mão **quando aplicável**". Medido:
**não é aplicável em nenhuma das cinco glebas**, e a razão é mais interessante
que o número.

**Nenhuma das cinco tem via desenhada à mão.** Quatro não têm atração nenhuma. A
quinta, `geo-antonina`, tem uma — e ela **não é uma via desenhada**: é a
*"Testada de frente L1"*, 180,2 m, com os **dois extremos a 0,00 m da divisa**.

A diferença não é de nome, é de pergunta:

| | o que é | o que o motor deve fazer | o que se mede |
|---|---|---|---|
| **via desenhada à mão** | rua que o urbanista traçou **dentro** da gleba | **seguir** a linha | quanto do comprimento tem eixo gerado a menos de meia caixa |
| **testada de frente** | linha onde a gleba encosta numa rua **que já existe**, sobre a divisa | dar **lote de frente** para ela, e **nunca** rua em cima | quantos lotes têm aresta na linha |

Perguntar "o motor seguiu esta linha?" a uma testada de frente **premiaria o
defeito**: um motor que pusesse rua exatamente sobre a divisa marcaria 100 % de
aderência estando errado. Por isso as duas são separadas por **medição** — a
linha cujo ponto médio está a menos de 1 m da divisa é testada —, e a aderência
sai `null` nas cinco, nunca zero (D23).

**E a pergunta certa, feita:** quantos lotes fazem frente para a testada de
`geo-antonina`? **Zero, nos quatro motores.** Não é tolerância curta: o lote mais
próximo de qualquer um deles está a **605 m** da linha. Nenhum dos quatro lê a
atração, e por isso nenhum tinha razão para chegar lá.

**Isto é achado para o contrato**, e o LAB-14 o trata: o contrato v1 chama as
duas coisas de `atracoes[].tipo = "via_existente"`, e um motor que quisesse
obedecer não teria como saber qual das duas recebeu.

---

## 3 · O que garante que esta comparação é legítima

Três conferências, e as três rodam junto com a medição:

**(a) A mesma porta para os quatro.** Todos entregam SAÍDA v1, e é a SAÍDA que é
julgada — **inclusive o motor interno do Generate**. Ele produz `ResultadoMotor`
direto e medi-lo por aí seria mais curto, mas ele seria o único a não atravessar
o contrato, e qualquer perda de tradução ficaria invisível justamente no motor de
referência.

**(b) A mesma massa.** A `medirSobras` decompõe a **massa urbanizável**, e ela
saiu **idêntica entre os quatro motores** em cada gleba — 141,8 / 50,0 / 10,0 /
46,8 / 141,7 ha. Comparar "% da massa" só vale se a massa for a mesma, e é.

**(c) A conta fecha.** `massa ≈ lote + leito + sobra` é identidade contábil da
própria `medirSobras`. Nas 20 medições ela fecha entre **0,988 e 1,000** — o
resto é o piso que descarta lasca abaixo do corte, que a função declara.

**(d) Os mesmos parâmetros.** A ferramenta **aborta** se as cinco glebas não
declararem parâmetros idênticos. Não é enfeite: medir com parâmetros diferentes é
medir outra coisa, e a conferência é barata.

---

## 4 · Um defeito de régua, pego antes de virar tabela

A fórmula de irregularidade do Generate é `1 − área / área da caixa`, com a
**caixa alinhada aos eixos**. Aplicada ao lote, ela **pune quem gira o lote pela
rua** — e a candidata espinha gira.

Primeira passada: **754 de 776 lotes** da espinha em `ensaio-47ha` marcados
"irregulares", mediana **0,657**. E eles são retângulos.

A correção é a caixa de **menor área em qualquer orientação** (Freeman & Shapira,
1975: a caixa mínima tem um lado colinear com uma aresta do fecho convexo, então
basta testar as arestas). Retângulo girado dá **zero**, esteja em que ângulo
estiver. Com ela, os mesmos 776 lotes dão **84 irregulares e mediana 0,000**.

As duas réguas saem no JSON: a dos eixos mantém continuidade com o que o Generate
já publicou, a girada é a que responde "o lote tem forma boa?". **A tabela usa a
girada.**

Um teste trava isso: retângulo girado a 15°, 30°, 45° e 63° tem de dar zero.

---

## 5 · Dois números que não bateram, e o que se fez com cada um

**O aparo, invertido.** A primeira passada dizia *"o Lab aparou 158 428,9 m de
eixo (99,68 % do comprimento)"*. Ninguém apara 99 % de uma rede e ainda a julga:
`comprimentoAparado_m` é o que **restou**, não o que saiu, e 99,68 % é o
complemento dos 0,32 % que o LAB-08 publicou. Corrigido, o aparo corta **0,17 %
a 0,65 %** conforme a gleba.

**Um lote de diferença no veredito publicado.** A candidata espinha em
`geo-antonina` dá **1 657 lotes** aqui e **1 656** no veredito que o Generate
publicou em 10/09. Conferido: a ENTRADA é **idêntica** à deles (anel, restrições,
acessos e parâmetros, campo a campo), **nenhum commit tocou o motor deles desde
aquela data**, e os parâmetros derivados batem com os padrões da casa. A
diferença é de **um lote em 1 656 — 0,06 %** e **não foi rastreada**. A suspeita
é arredondamento de coordenada na restrição, que o script deles passa crua e que
aqui atravessa o esquema do contrato; **suspeita não é medição**, e fica assim
declarada. Os números desta tabela vêm de **rodar o motor deles agora**, não de
ler o arquivo publicado.

---

## 6 · O que ficou provado

- **determinismo:** 20 de 20 — cinco glebas × quatro motores, cada rodada feita
  duas vezes e comparada SAÍDA inteira contra SAÍDA inteira. Não a contagem de
  lotes: duas geometrias diferentes podem dar o mesmo número, e foi assim que a
  régua de determinismo errou no LAB-08;
- **o que cada motor não soube fazer sai escrito**, por gleba, no JSON. É o campo
  que impede a tabela de mentir por omissão — três dos quatro ignoram o relevo,
  os quatro ignoram a atração, e um deles precisa do aparo do Lab para o contrato
  aceitar o arquivo;
- **nada foi escrito em repositório vizinho.** `git status` limpo nos três
  clones;
- **testes:** 80 verdes na esteira (13 novos, deste prompt) e 14 no adaptador do
  motor de parcelamento; `tsc --noEmit` e `eslint` limpos nos dois.

---

## 7 · O que isto entrega ao LAB-14

Três coisas que a medição fez aparecer, e que a porta única precisa resolver:

1. **`via_existente` quer dizer duas coisas.** Via desenhada à mão e testada de
   frente chegam com o mesmo tipo, e o motor não tem como distinguir. §2.
2. **O motor precisa declarar o que sabe fazer.** A tabela só é legível porque
   cada linha carrega o que aquele motor ignorou — e hoje isso é conhecimento do
   Lab, escrito à mão em cada adaptador, não declaração do motor.
3. **"Não sei fazer" precisa de lugar no contrato.** O Symbios não parcela em
   lote; o do Parcelamento não calcula greide; três dos quatro não leem relevo.
   Hoje cada uma dessas faltas é descoberta medindo.
