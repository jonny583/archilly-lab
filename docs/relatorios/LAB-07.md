# LAB-07 — O MOTOR DO TESTFIT NA ESTEIRA

**Data:** 13/09/2026 · **Escopo:** contrato de motor v1, ida e volta, julgamento
pelo Validator e pelo Judge do Generate

## Veredito

> ### Geometria utilizável: **SIM COM RESSALVAS**

O motor do Testfit atravessa a esteira inteira — terreno do contrato → motor →
parcelamento → Validator → Judge — nas três glebas, e devolve parcelamento de
qualidade. Medido sobre **47 variantes julgadas** (de 60 rodadas): **28 401
lotes** e **4 132 violações**, e a média esconde a notícia, porque o resultado é
muito desigual entre os dez partidos de traçado. Quatro deles ficam abaixo de
2 % de violação; um fica em 78 % e outro em 140 %.

**As ressalvas, em ordem de gravidade:**

1. **Nenhuma variante passa no contrato sem conserto.** Os eixos viários varrem a
   caixa envolvente da gleba e não são aparados pelo perímetro: **25 % a 40 % do
   comprimento de via nasce fora da divisa**, e o esquema recusa o arquivo antes
   de qualquer julgamento. Todos os números deste relatório vêm de uma passagem
   com **aparo feito pelo Lab** (§3).
2. **A calçada é declarada e não é reservada.** Medido: o vértice mais próximo de
   cada lote fica a exatamente `caixa_m / 2` do eixo — o lote encosta no
   meio-fio. Não há terra para a calçada que o motor promete (§4).
3. **Dois partidos estão quebrados.** `cluster` viola testada em **78 % dos
   lotes**; `organico` produz **165 sobreposições** de lote e é recusado pelo
   esquema em 5 das 6 rodadas. `radial` é recusado em 6 de 6 (§5).
4. **A superquadra nasce vazia — e é pior do que foi relatado.** O Testfit
   relatou 11 de 12; medido, **20 de 20**, e o plano vazio lidera o ranking do
   motor com nota 0,366 (§6).
5. **O motor não calcula greide.** Nenhuma via tem cota; `rampaMedia_pct` sai
   `null` no contrato e toda a conferência de rampa fica com o Validator (§7).

Nenhuma ressalva é impeditiva. As ressalvas 1, 3 e 4 são do motor e estão na
lista para o T02 (§9); a 2 é de projeto e precisa de decisão; a 5 é declarada.

---

## 1 · O que foi construído

```text
archilly-motor-entrada  (contrato v1, do Generate)
        │  idaParaOMotor()          ← adapter/src/ida.ts
        ▼
   EntradaMotor { terreno, padroes, ... }
        │  rodarMotor()             ← motor-testfit, src/lib/lab/api.ts
        ▼
   SaidaMotor { opcoes[] }
        │  voltaParaOContrato()     ← adapter/src/volta.ts
        ▼
archilly-motor-saida
        │  apararVias()             ← adapter/src/aparo.ts   (o conserto, §3)
        ▼
        │  montarParcelamentoExterno() + montarRelatorio()   ← do GENERATE
        ▼
   esquema → Validator (9 tipos) → Judge → relatório
```

**Nada de Validator próprio do Lab.** O julgamento é importado do Generate, não
reimplementado — é o que o §2.3 do prompt manda e o que o contrato promete:
*"o mesmo Validator e o mesmo Judge que roda nos motores dele — sem versão leve,
sem limiar mais frouxo por ser de fora"*.

| peça | onde |
|---|---|
| tipos do contrato | `external-engines/testfit/adapter/src/contrato-v1.ts` |
| ida | `adapter/src/ida.ts` |
| volta | `adapter/src/volta.ts` |
| aparo (o conserto declarado) | `adapter/src/aparo.ts` |
| esteira completa | `adapter/src/esteira.ts` |
| medições | `ferramentas/medir.ts` |
| diagnóstico do relevo | `ferramentas/diagnostico-relevo.ts` |
| a terceira gleba | `ferramentas/gleba-lab01.ts` |
| testes (14, verdes) | `tests/esteira.test.ts` |

---

## 2 · As três glebas

| gleba | área | origem | relevo |
|---|---|---|---|
| `ensaio-47ha` | 47,00 ha | gleba-padrão do Generate | **nenhum** |
| `geo-antonina` | 141,76 ha | gleba-padrão do Generate; 3 APPs que transbordam a divisa | **nenhum** |
| `lab01-50ha-ondulado` | 50,00 ha | a do LAB-01, convertida para o contrato | 575 curvas, 45 m de desnível |

**As duas glebas-padrão do Generate não trazem topografia** — `cotas: null`,
`curvas: []`, `classesDeclividade: null` nas duas. A terceira gleba existe por
isso: sem ela, o campo `relevo` do contrato atravessaria a esteira inteira sem
nunca ser exercitado, e o §2.6 não teria o que medir.

---

## 3 · A ressalva que bloqueia: as vias saem da gleba

### O que foi medido

| gleba | comprimento de via fora da divisa (mediana das 20 variantes) | pior variante |
|---|---|---|
| `ensaio-47ha` | **25,9 %** | 74,8 % |
| `geo-antonina` | **40,0 %** | 89,0 % |
| `lab01-50ha-ondulado` | **32,5 %** | 81,6 % |

O esquema do contrato recusa por isso, e a recusa é de formato — acontece antes
de qualquer julgamento:

```text
45 peça(s) do parcelamento saem da gleba — a pior é a via V1, a 69,11 m
para fora da divisa.
```

**Nenhuma das 60 variantes passou na passagem fiel.** Sem conserto, o LAB-07 não
mediria nada.

### O conserto, e o que ele não faz

`adapter/src/aparo.ts` recorta o eixo de cada via pelo perímetro e descarta o
que cai fora. **Só as vias.** Lote, quadra e área especial saem intactos, e a
razão é que aparar um lote mudaria a área e a testada dele — que são exatamente
os números que o Validator vai medir. Um lote aparado passaria numa régua que o
lote original reprova, e o relatório mentiria.

O aparo é do **Lab**, não do motor, e as duas passagens saem lado a lado em
`docs/provas/LAB-07/medicoes.json` (`fiel` e `julgado`) para não se confundirem.
A correção de verdade é do motor, e está na lista do T02.

---

## 4 · A calçada que não existe

O contrato quer `largura_m` = caixa total (pista + calçadas), e é ela que o
Generate usa para desenhar o leito e decidir se um lote tem frente. O motor
guarda dois campos: `caixa_m` (*"largura total da via, de meio-fio a meio-fio"*,
diz a ajuda dele) e `calcada_m` (*"largura da calçada em cada lado"*). A soma
parecia óbvia.

**Medido:** a distância do vértice mais próximo de cada lote ao eixo mais
próximo é **exatamente `caixa_m / 2`** — mediana 5,00 m para vias de
`caixa_m = 10`, com 223 dos 441 lotes no valor exato.

| | distância lote→eixo |
|---|---|
| mínima | 5,00 m |
| p10 | 5,00 m |
| **mediana** | **5,00 m** |
| p90 | 5,75 m |

**O lote encosta no meio-fio. A calçada declarada não é reservada em lugar
nenhum da geometria.**

A primeira versão do adaptador declarou `caixa_m + 2 × calcada_m`, e o Validator
devolveu o retrato do erro: **441 de 441 lotes sem frente e 429 com leito de rua
por cima**, porque o leito declarado invadia 3 m dentro de cada lote. Com
`largura_m = caixa_m` — o corredor que existe —, a mesma variante caiu para
**15 violações**.

O adaptador não pode declarar a calçada que o motor promete e não desenha. Item
para o T02, e decisão de projeto: ou o lote recua, ou a caixa passa a incluir a
calçada.

---

## 5 · O julgamento, por partido de traçado

O motor tem **dez partidos**; o padrão de fábrica dele é `["ortogonal"]`, um só.
A medição roda os dez, com 20 variantes por gleba — medir no padrão mediria um
décimo do motor.

### 5.1 Recusa de esquema (nem chega ao Validator) — 13 de 60

| partido | recusas | motivo |
|---|---|---|
| `radial` | **6 de 6** | lote fora da divisa, 1,15 a 1,19 m |
| `organico` | **5 de 6** | lote fora da divisa, 2,19 a 9,87 m |
| `loop` | 1 de 6 | área especial a 13,42 m para fora |
| `superquadra` | 1 de 6 | área especial a 3,39 m para fora |

Estas recusas são **depois** do aparo das vias: são lotes e áreas, não eixos.

### 5.2 Validator, nas 47 que passaram

| partido | variantes | lotes | violações | % dos lotes | por regra |
|---|---|---|---|---|---|
| `pente` | 6 | 3 394 | **2** | **0,06 %** | frente 2 |
| `diagonal` | 6 | 4 293 | 54 | 1,26 % | frente 44, testada 10 |
| `mioloVerde` | 6 | 3 490 | 56 | 1,60 % | frente 52, testada 4 |
| `ortogonal` | 6 | 4 631 | 96 | 2,07 % | frente 83, testada 10, face-quadra 3 |
| `espinha` | 6 | 4 825 | 129 | 2,67 % | testada 75, face-quadra 54 |
| `loop` | 5 | 3 418 | 179 | 5,24 % | testada 113, frente 64, face-quadra 2 |
| `cluster` | 6 | 3 976 | **3 092** | **77,77 %** | **testada 2 994**, frente 98 |
| `organico` | 1 | 374 | **524** | **140,11 %** | frente 316, **sobreposição 165**, testada 33 |
| `superquadra` | 5 | **0** | 0 | — | (nenhum lote) |
| **total** | **47** | **28 401** | **4 132** | **14,55 %** | |

**A leitura é que o motor é bom e a média não diz isso.** Quatro partidos ficam
abaixo de 2 %; `pente` produz 3 394 lotes com **duas** violações. Os 14,55 % da
média são quase inteiramente `cluster` (3 092 das 4 132) e `organico`.

`sobreposição` no `organico` é a violação mais grave da lista: **165 lotes
ocupam a mesma terra**. Não é imperfeição de borda — é plano inválido.

---

## 6 · §2.5 — a superquadra vazia, medida

O Testfit relatou: *"a superquadra nasce vazia em 11 de 12 variantes e o plano
vazio ganha o ranking"*. Medido na esteira:

| | relatado | medido |
|---|---|---|
| variantes vazias, com o formato isolado | 11 de 12 | **20 de 20** |
| o plano vazio lidera o ranking do motor | sim | **sim** — nota 0,366 com 0 lotes |
| na disputa aberta (10 partidos, 20 variantes) | — | 2 vazias; em primeiro, `espinha` com 585 lotes |

**É pior do que o relatado, e é contido.** Com o formato isolado, não há uma só
variante com lote — as 20 nascem vazias, e a primeira colocada tem nota positiva
mesmo sem produzir nada. Na disputa aberta o defeito não contamina o resultado:
um partido que produz lotes sempre ganha.

O que o número diz é que **a nota do motor premia um plano vazio**. Um plano com
zero lotes deveria ser eliminado, não ranqueado — é a diferença entre "esta
opção é ruim" e "esta opção não existe".

---

## 7 · Rampa — o que dá e o que não dá para medir

O §2.4 pede rampa máxima nos cruzamentos e ao longo da via. **O motor não
calcula greide**: nenhuma via tem cota em lugar nenhum do `Plano`, e é por isso
que `rampaMedia_pct` sai `null` no contrato. Medir a rampa do motor é impossível
— não há o que medir.

O que se pode medir é a rampa que o **terreno impõe**: se a via seguisse o chão,
qual seria a inclinação. Na única gleba com relevo, melhor variante:

| | mediana | p90 | máxima |
|---|---|---|---|
| ao longo da via (1 315 trechos) | 3,98 % | 16,68 % | 55,93 % |

**Nos cruzamentos, zero amostras** — a melhor variante era `espinha`, com poucos
eixos longos, e o detector de cruzamento (ponta de eixo a menos de meia caixa de
outro eixo) não encontrou nenhum. Numa variante `ortogonal` da mesma gleba o
mesmo detector achou 90 cruzamentos, com mediana de 2,07 % e máxima de 2,42 %.
O número existe, mas depende do partido, e não é comparável entre partidos —
fica registrado como tal, não como propriedade do motor.

---

## 8 · §2.6 — a interpolação do relevo

O LAB-01 encontrou um defeito: interpolar relevo a partir de vértices de curva
de nível por vizinhos mais próximos faz com que quase toda amostra tenha **todos
os vizinhos na mesma curva**, e a média deles é a cota daquela curva. O terreno
vira um bolo de casamento — terraços planos com degraus, gradiente zero no meio
de cada terraço.

Três interpoladores, a mesma nuvem (9 448 vértices de 575 curvas de 2 em 2 m):

| interpolador | amostras sobre um valor de curva | gradiente zero | declividade p10 / mediana / p90 / máx |
|---|---|---|---|
| **Testfit** — `campoRelevo`, IDW global sobre todos os pontos | **2,2 %** | **0 %** | 1,51 / 6,05 / 12,77 / 36,27 % |
| **Generate** — `criarModeloRelevo`, IDW sobre k = 6 vizinhos | **49,8 %** | **17,3 %** | **0** / 8,12 / 12,50 / 16,36 % |
| LAB-01 corrigido — entre níveis distintos | 0,3 % | 0 % | 1,91 / 6,51 / 10,53 / 14,40 % |

### O Testfit: **não afetado**

O `campoRelevo` dele pondera **todos** os pontos, não os k mais próximos. As
curvas distantes continuam contribuindo, e o terraço não se forma. O preço é
outro — é O(n) por consulta, 404 ms para uma grade de amostras contra 323 ms do
Generate, e o método suaviza demais — mas o defeito do LAB-01 não o atinge.

### O Generate: **afetado** — diagnóstico para repassar

**Metade das amostras cai exatamente sobre um valor de curva, e 17,3 % da grade
tem gradiente zero.** O p10 da declividade é **0 %** (os terraços) contra 1,51 %
e 1,91 % dos outros dois, e a máxima é 16,36 % contra 36,27 % e 14,40 % — o
terreno real tem inclinações que o modelo não vê.

O `criarModeloRelevo` **tem uma defesa**, e ela é boa: um piso de passo
calculado pela densidade do dado (`espacamento / 2`), com um comentário que
documenta a medição que o motivou (29 % de aviso falso de declividade crítica
num plano de 25 %). Nesta nuvem o piso não chegou a atuar — passo pedido 10 m,
espaçamento do dado 10,84 m, passo aplicado 10 m — e o terraço apareceu assim
mesmo, porque **o piso de passo não ataca a causa**: a causa é *quais* pontos
entram na média (k = 6 vizinhos, todos da mesma curva), não o tamanho da célula.

**O que sugerir ao Generate:** exigir que os vizinhos ponderados venham de pelo
menos **duas cotas distintas** — é a correção que o LAB-01 aplicou, e ela leva o
número de 49,8 % para 0,3 %. Só diagnóstico: o Lab não escreve no Generate.

---

## 9 · A lista para o T02 do Testfit

Em ordem de impacto. Nada aqui foi consertado — o repositório é de leitura.

1. **Aparar a rede viária pelo perímetro da gleba.** Hoje os eixos varrem a
   caixa envolvente e 25 % a 40 % do comprimento nasce fora da divisa. Não é só
   problema de contrato: é asfalto orçado em terra que não é do empreendimento.
   *Sem isto, nenhum arquivo do motor passa no contrato de motor v1.*
2. **Reservar a calçada, ou parar de declará-la.** O lote encosta a `caixa_m / 2`
   do eixo; a `calcada_m` de cada via não tem terra. Ou o lote recua
   `calcada_m`, ou a caixa passa a incluí-la — as duas são decisão de projeto,
   mas declarar sem reservar não é nenhuma das duas.
3. **`cluster`: 78 % dos lotes com testada fora da faixa.** 2 994 violações de
   testada em 3 976 lotes. O partido está quebrado, não imperfeito.
4. **`organico`: 165 lotes sobrepostos.** Lote em cima de lote é plano inválido;
   e ele ainda é recusado pelo esquema em 5 de 6 rodadas por lote fora da divisa
   (até 9,87 m).
5. **`radial`: recusado em 6 de 6**, por lote a 1,15–1,19 m fora da divisa. A
   distância é pequena e constante, o que sugere um erro de meio raio ou de
   arredondamento na borda — barato de achar.
6. **Eliminar o plano vazio do ranking.** O formato `superquadra` produz 20 de 20
   variantes sem um único lote, e a primeira colocada tem nota 0,366. Plano com
   zero lotes não é opção ruim: não é opção.
7. **Guardar de qual via cada lote faz frente.** O motor sabe a testada em metros
   mas não a via; o contrato aceita `null` e o Validator mede por conta própria,
   então nada quebra — mas o dado existe no momento do plantio e se perde.
8. **Considerar calcular greide.** Nenhuma via tem cota. Com o relevo já
   disponível no `Terreno`, a rampa média por trecho é barata, e é o campo que
   permitiria ao Validator cobrar rampa de um plano do Testfit.

---

## 10 · Perdas na ida e na volta

A lista completa, item a item e com o motivo, está em
`docs/provas/LAB-07/medicoes.json` (`perdasNaIda` e `perdasNaVolta` por gleba).
O resumo:

### Ida — o contrato tem o que o motor não consome

| campo | gravidade | o que acontece |
|---|---|---|
| `atracoes[]` em **linha** | **alta** | o motor só entende atração como polígono. As vias do entorno viajam no contrato como linha — a forma natural delas — e é justamente a que não entra. Em `geo-antonina`, a via existente foi descartada |
| `gleba.furos` | alta | o motor recebe o perímetro como anel simples; o traçado passaria por cima do furo. Nenhuma das três glebas tem furo, então não doeu |
| `acessos[].segmento` | alta | o motor tem um único ponto de acesso; uma testada liberada de 200 m viraria o ponto médio |
| `parametros.rampaMaxima_pct` | alta | o motor não limita rampa |
| `acessos[].sugerido` | média | o motor não distingue acesso marcado de palpite; nas três glebas o acesso era palpite |
| `relevo.curvas` | média | viram vértices soltos; a informação de qual curva cada vértice pertence se perde |
| `geo` | média | o `archilly-terreno` inteiro (matrícula, CAR, INCRA, zoneamento) fica de fora do desenho |
| `restricoes[].baseLegal` | baixa | o `Elemento` do motor não tem campo de base legal |

### Volta — o motor tem o que o contrato não recebe

| campo | gravidade | o que acontece |
|---|---|---|
| `vias[].calcada_m` | **alta** | declarada e não reservada — §4 |
| `vias[].rampaMedia_pct` | alta | sai `null`: o motor não calcula greide |
| `areas[]` tipo `comercio` / `estacionamento` | média | o contrato tem seis tipos e nenhum é terra privada. Declarar como `institucional` diria que é doação ao município. A área foi absorvida em `areaNaoAproveitada_m2` |
| `quadroDeAreas.areaViaria_m2` | média | o motor não mede a área dos corredores: calcula `bruta − quadras − especiais`. Num plano que não preenche a gleba, engorda com terra que não é rua |
| `lotes[].externo` | média | a distinção loteamento × condomínio não existe no contrato |
| `plano.avisos` | média | o contrato não tem canal para aviso do motor |
| `lotes[].faceDeRua` | baixa | sai `null`, como o contrato prefere |
| `plano.nota` / `formato` | baixa | a nota do motor não tem campo (de propósito: quem julga é o Judge). O partido vai embutido em `motor.versao` |

---

## 11 · As outras medições do §2.4

### Tempo

| gleba | ida | motor | volta + julgamento | total |
|---|---|---|---|---|
| `ensaio-47ha` (47 ha) | 0,9 ms | 427 ms | 1 096 ms | **1,5 s** |
| `lab01-50ha-ondulado` (50 ha) | 1,2 ms | 577 ms | 1 563 ms | **2,1 s** |
| `geo-antonina` (141,76 ha) | 0,5 ms | 1 963 ms | 7 585 ms | **9,5 s** |

Vinte variantes por gleba, dez partidos. **A tradução é de graça** (1 ms); o que
custa é o motor e, mais que ele, o julgamento — o Validator mede vértice a
vértice, e 28 mil lotes custam.

### A "dobra" dos lotes — a régua do próprio Testfit

Somando as 60 variantes (35 326 lotes desenhados):

| medida | total |
|---|---|
| fora da faixa de testada | 202 |
| fora da faixa de área | **0** |
| fora da tolerância de área | **0** |
| **sobrepostos** | **1 062** |
| fora da quadra | 1 892 |
| fora da gleba | 123 |

Área e tolerância: **zero em 35 mil lotes** — o motor acerta o que promete
entregar. Os 1 062 sobrepostos são quase todos do `organico`, e batem com o que
o Validator do Generate viu por outro caminho: duas réguas independentes
apontando o mesmo partido.

### Fechamento de áreas

**0,00 % de diferença em todas as 60 variantes.** A soma das partes bate com a
área bruta em todas elas.

### Determinismo — passa

| | |
|---|---|
| semente 20260913, execução 1 | `2709e86fed2b7181` |
| semente 20260913, execução 2 | `2709e86fed2b7181` |
| semente 20260914 | `87d0bc7338f406f1` |

A prova é sobre a **SAÍDA DO CONTRATO**, não só sobre a assinatura do motor: o
JSON inteiro das variantes é **idêntico byte a byte** entre as duas execuções, e
diferente com outra semente. O `geradoEm` do contrato é carimbado com constante
pela ponte, justamente para não quebrar essa comparação — o motor não põe data
na saída de propósito, e o contrato exige o campo.

---

## 12 · Testfit × Symbios, na mesma gleba

Os dois rodaram em `sintetico-50ha-ondulado` (50 ha, 45 m de desnível).

| | **Symbios** (LAB-01) | **Testfit** (LAB-07) |
|---|---|---|
| o que entrega | rede viária + quadras | rede viária + quadras + **lotes** + áreas |
| lotes | **nenhum** — `BuildingLot` é pegada de edificação | **680** (melhor variante julgada, `espinha`) |
| área privativa | — | 270 679 m² |
| vias | 157 trechos, 28 837 m | 28 991 m (mediana das 20 variantes) |
| quadras | 167, mediana 1 902 m² | por variante, ver `medicoes.json` |
| comprimento fora da gleba | 38,0 % | 32,5 % (mediana) |
| rampa | **calcula** — mediana 10,0 %, máx 69,9 %, com clamp | **não calcula** greide |
| tempo | 770 ms (1 solução) | 2 141 ms (20 variantes, 10 partidos) |
| passa no contrato de motor v1 | não medido (LAB-01 é anterior ao contrato) | só com aparo |
| determinístico | sim | sim |

**Os dois erram a mesma coisa e acertam coisas diferentes.** Ambos deixam um
terço da rede viária fora da divisa — é o mesmo defeito, em motores sem
parentesco, e sugere que *aparar pelo perímetro* é uma responsabilidade que
nenhum dos dois assume e que o Archilly vai ter de assumir.

No resto são complementares: o Symbios sabe topografia (segue curva de nível,
limita rampa) e **não faz lote**; o Testfit faz lote muito bem (zero erro de área
em 35 mil) e **ignora o relevo** por completo no traçado. A combinação óbvia —
rede do Symbios, parcelamento do Testfit — é hipótese para um prompt adiante,
não conclusão deste.

---

## 13 · Reproduzir

```sh
# os dois repositórios irmãos, SÓ LEITURA, ao lado deste
git clone https://github.com/jonny583/motor-testfit              ../motor-testfit
git clone https://github.com/jonny583/urban-create-hub-41d93a4d  ../urban-create-hub-41d93a4d

cd external-engines/testfit
bun install
bun run gleba      # gera a terceira gleba a partir do terreno do LAB-01
bun run medir      # docs/provas/LAB-07/medicoes.json
bun run relevo     # docs/provas/LAB-07/diagnostico-relevo.json
bun test           # 14 testes
bun run typecheck
bun run lint
```

O caminho dos repositórios irmãos está num lugar só: os `paths` do
`external-engines/testfit/tsconfig.json`.

**Uma dependência do Generate precisa estar instalada** para o Validator rodar:
`zod`. O clone dele não traz `node_modules`; `bun add --no-save zod@^3` dentro
dele resolve, e `node_modules` é ignorado pelo git de lá — o Lab não escreve
naquele repositório.

Saídas: `docs/provas/LAB-07/` — `medicoes.json` (números crus),
`diagnostico-relevo.json`, `medir.txt`, `diagnostico-relevo.txt`, a ENTRADA da
terceira gleba e a melhor SAÍDA de cada uma das três.

---

## 14 · O que o LAB-02 recebe deste prompt

O LAB-07 furou a fila e não muda o que o LAB-02 tem de fazer, mas deixa três
coisas para ele:

1. **O aparo pelo perímetro é problema de dois motores, não de um.** Symbios e
   Testfit deixam ~⅓ da rede fora da divisa, sem nenhum parentesco entre eles.
   O recorte que o LAB-02 vai escrever para o Symbios provavelmente serve para
   os dois, e vale escrevê-lo com isso em mente.
2. **O caminho para o Validator está aberto e provado.** `montarParcelamentoExterno`
   + `montarRelatorio` do Generate rodam a partir do Lab, com `zod` instalado no
   clone. O LAB-02 não precisa descobrir isso de novo.
3. **O contrato de motor v1 é a porta, e ela funciona.** Sessenta arquivos
   passaram pelo esquema; 47 chegaram ao Validator. O que recusou, recusou com
   mensagem legível e pelo motivo certo.
