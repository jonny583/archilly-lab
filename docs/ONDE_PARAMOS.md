# ONDE PARAMOS

> Para retomar numa nova sessão, diga:
>
> **"leia docs/ONDE_PARAMOS.md e me diga onde estamos"**

**Última atualização:** 20/09/2026 · **Último prompt executado:** LAB-16
**Estado:** **FILA ESGOTADA.** Os três prompts mandados pelo chat em 20/09 —
LAB-06, LAB-17 e LAB-16 — estão concluídos e mesclados. **Aguardando o chat.**

## O despertador deste repositório — **APAGADO em 20/09/2026**

Era **`trig_01ErsHXVhfTZziHEGGYcBjiJ`** · "Despertador da fila autônoma —
Archilly Lab (60 min)" · cron `5 * * * *`. Criado e apagado no mesmo dia, como
manda a **D62**: **disparo sem item pronto se apaga em vez de acordar de novo.**
Ele disparou **uma vez**, e teve o que fazer (o LAB-16). Com a fila esgotada, o
próximo disparo não teria, e por isso ele não existe mais. **O chat o recria
quando mandar fila nova.**

**Nota para quem for recriá-lo:** o despertador nasceu **sem os conectores do
GitHub** — o servidor avisou na criação. A sessão que ele acordar não terá
`mcp__github__*` e terá de mesclar por git direto (D29). Nesta rodada isso não
pesou, porque a sessão acordada era a mesma que já tinha os conectores.

**Antes dele não havia nenhum despertador do Lab.** O que existia na conta era
de outros aplicativos — Render, Pesquisa de Mercado, motor-v2 —, e neles não se
toca.

## O que o chat precisa decidir para a fila andar

1. **O motor que a D68 põe como PADRÃO é o que o Validator REPROVA** em
   `ensaio-47ha` (16 violações). A peça do LAB-06 trata o caso sem quebrar, mas
   **qual motor é o padrão** é decisão de produto;
2. **A tela unificada não distingue "rua que já existe" de "rua que você
   desenhou"** — o contrato v1 chama as duas de `via_existente` (D64). Pedido
   aberto ao Generate;
3. **Nenhum motor da família cumpre a regra dos 50 m da nascente**, e não é
   defeito de motor: o contrato v1 achata `app_nascente` em `app_hidrica` (D74).

---

## Em uma frase

**As três perguntas de 20/09 estão respondidas com número:** a peça de entrega
existe e está provada dos dois lados (LAB-06); os quatro motores **ignoram a via
que o urbanista desenha**, e nenhum mente sobre isso (LAB-17); e a régua de
forma parou de dar veredito de urbanista disfarçado de medição (LAB-16).

## A fila de 20/09 — **esgotada**

| Prompt | Estado |
|---|---|
| **LAB-06** — a peça pronta, e o teste de que apagar o Lab não quebra o Generate | **concluído em 20/09/2026** |
| **LAB-17** — duas glebas com via desenhada, os quatro motores, a D69 aplicada | **concluído em 20/09/2026** |
| **LAB-16** — consertar a régua de forma e reprovar as cinco glebas | **concluído em 20/09/2026** |

## O que o LAB-16 mediu

**A régua girada já era do LAB-13** (D63) — os 754 de 776 são o número da régua
VELHA, e a tabela do LAB-13 nunca a usou. O que ainda estava errado:

| defeito | medida |
|---|---|
| o corte de 1 % era meu, e mandava no resultado | Parcelamento em `geo-antonina`: **34 / 15 / 0** nos cortes de 1 %, 5 % e 10 % |
| "irregular" é veredito de urbanista | os marcados eram **trapézios, pentágonos e hexágonos** — esquina, curva, borda de APP |
| o arco de testada curva virava reta | um lote de **49 vértices** passava por retângulo com 10 % de perda |

**Na tabela do LAB-13 nenhum número muda** — a reprovação reproduziu os vinte
valores exatamente, o que é prova a mais de determinismo. **Muda o que a coluna
quer dizer:** o Symbios faz lote **não-ortogonal**, não lote deformado.

## O que o LAB-17 mediu

**Aderência ao traçado imposto** (fração do desenho que cai dentro da caixa de
alguma via da saída), com semente 20260913:

| motor | `ensaio-com-via` 47 ha | `antonina-com-via` 141,8 ha |
|---|---:|---:|
| Symbios Tensor + subdivisão do Lab | 27,5 % | **30,7 %** |
| Archilly Generate · ortogonal | **29,3 %** | 28,0 % |
| Archilly Generate · espinha | 20,5 % | 10,1 % |
| Laboratório de Parcelamento | 11,3 % | 17,4 % |

**Os quatro declaram que ignoram via desenhada, e os quatro ignoram** — a
declaração bate com o medido nas oito linhas. Entre 10 % e 31 % de
**coincidência**, zero de intenção. **Sem recomendação de produto.**

**D69 aplicada:** `VD1 × APP hídrica · 71,00 m` em `antonina-com-via`, marcada
*"desenhada por você — exige licença ambiental"*, com item de custo de
`obra: null` — ponte ou bueiro depende da vazão, que não chega no contrato.

## O que vai ao Generate — **pelo chat, não por commit**

1. [`entrega/registro-de-motores/`](../entrega/registro-de-motores/) — a peça,
   com `README.md` de instalação para o **GU-03**;
2. [`CONTRATO_MOTOR_UNIFICADO_v1.md`](CONTRATO_MOTOR_UNIFICADO_v1.md) — a porta;
3. **os três pedidos ao contrato v1:** um **tipo próprio para via desenhada à
   mão** separado de `via_existente`, `rampaMaxima_pct` por via na SAÍDA, e
   **`app_nascente` com o ponto da nascente e a linha do curso** (§10.5 do
   contrato). O terceiro o chat já repassou.

## Os dois achados que estão na mesa

**Em `ensaio-47ha`, o motor que a D68 põe como PADRÃO é justamente o que o
Validator REPROVA** — 16 violações —, enquanto os outros três entram no ranking.
A peça trata o caso sem quebrar. **O que fazer a respeito é do chat e do Jonny.**

**Sem um tipo para via desenhada à mão, a tela unificada não consegue distinguir
"respeitei a rua que já existe" de "respeitei o que você desenhou"** — as duas
chegam como `via_existente` (D64), e aqui a via desenhada precisou entrar assim,
**como remendo declarado**.

## O que depende do Jonny — **dois itens**

1. Confirmar o **"3× / 1,5 km"** (D61). Ele chegou por referência, não como
   decisão. Não trava nada;
2. **Dizer quando um lote tem forma ruim** (D76, novo no LAB-16): a partir de
   quanto de perda da caixa envolvente ele olharia e diria "esse está ruim". Hoje
   a tabela mostra **três respostas ao mesmo tempo** — 1 %, 5 % e 10 % —, porque
   escolher uma é decidir urbanismo. Não trava nada.

Os dois estão escritos para leigo em
[`PENDENCIAS_JONNY.md`](PENDENCIAS_JONNY.md).

## A regra dos 50 m da nascente — **escrita e NÃO APLICÁVEL**

A D69 manda: nascente nunca, raio de 50 m intocável. **Nenhum motor consegue
cumprir**, e a razão está medida: o contrato v1 achata `app_nascente` em
`app_hidrica`, sem o ponto e sem a linha do curso. A regra fica **escrita**
(`RAIO_DA_NASCENTE_M = 50`) **e marcada como não aplicável até o contrato trazer
a nascente** — e **sem aproximação inventada**, que é o que o chat pediu (D74).
Ela sai declarada em toda aplicação da D69, com ou sem travessia.

---

# O complemento à D61, e o LAB-17 que não existe · 20/09/2026

**D69 · Via desenhada à mão é intenção explícita.** O chat complementou a D61: a
rua que o usuário desenha **atravessa a APP sem precisar do critério** —
inclusive desenhada sozinha sobre a APP. **Nascente nunca** (raio de 50 m
intocável), a travessia segue a **mais curta e perpendicular ao curso**, aparece
marcada *"desenhada por você — exige licença ambiental"* e vai como **item de
custo** para o Orçamento.

**Registrado; NÃO aplicado.** O chat mandou aplicar no **LAB-17**, e ele **não
existe** — não há LAB-15, LAB-16 nem LAB-17, o mesmo vão do LAB-09 a LAB-12. Está
na [`prompts/FILA.md`](prompts/FILA.md) como proposto, com o escopo pronto.

**E um achado que trava dois dos quatro itens do LAB-17**, medido:

| onde | a nascente existe? |
|---|---|
| `archilly-terreno` (o formato do Geo) | **sim**, categoria própria |
| importador do Generate | **sim**, `app_nascente`, com rótulo e uso |
| **contrato de motor v1** | **NÃO** — achatada em `app_hidrica` |

**A nascente chega ao motor indistinguível de qualquer outra APP hídrica**, e o
ponto dela não chega. A regra que o Jonny declarou como a mais dura de todas é a
única que o contrato **não deixa cumprir**. Somada ao eixo do curso d'água, que
também não viaja, é a mesma falta: **o contrato v1 perde a hidrografia pelo
caminho.** Pedido ao Generate, no §10.5 do
[`CONTRATO_MOTOR_UNIFICADO_v1.md`](CONTRATO_MOTOR_UNIFICADO_v1.md).

**E o critério "3× / 1,5 km" chegou por referência**, não como decisão: a D61 o
pedia desde 15/09 e esta mensagem o cita como coisa sabida. Gravado com a leitura
mais direta, e **o item segue visível na lista do Jonny até alguém confirmar**.

---

## O próximo passo óbvio: **LAB-06**, e ele não foi executado

A decisão de família (D68) pede **registro de motores, botão liga/desliga por
motor e motor padrão**. O **LAB-06 da fila original** já era, palavra por
palavra, o prompt de entrega disso — e **nunca foi executado**. Está na
[`prompts/FILA.md`](prompts/FILA.md) como **proposto ao chat**: prompt fora da
fila não existe.

**LAB-09 a LAB-12 e LAB-15 a LAB-17 nunca existiram.** A fila original foi de
LAB-00 a LAB-08 e a de 19/09 começou no LAB-13. Não há prompt perdido nos vãos.

## O que espera o chat

1. **Mandar o LAB-06** — ou dizer que ele é do Generate, não do Lab.
2. **O nome do aplicativo de orçamento** — a mensagem de 15/09 cortou em "para o
   Or…", e o destino do item de custo da travessia segue sem confirmação.
3. **O delta contra o Padrão 1.2**, quando ele existir.
4. **As 4 violações** que sobraram em `geo-antonina` — suspeita escrita, **não
   medida**.
5. **As 96 quadras de esqueleto não confiável.**
6. **A quadra dentro de APP** — o recorte do LAB-05 é pela divisa.
7. **Achado para o Geo:** a D61 pede travessia **perpendicular ao curso d'água**,
   e a APP chega como polígono, não como linha.

---

# LAB-13 e LAB-14 — a tela unificada · 19/09/2026

Relatórios: [`relatorios/LAB-13.md`](relatorios/LAB-13.md) e
[`relatorios/LAB-14.md`](relatorios/LAB-14.md) · números crus:
[`provas/LAB-13/`](provas/LAB-13/)

### A tabela, em resumo

Quatro concorrentes (as duas candidatas do Generate contam separadas), cinco
glebas, **uma régua só** — Validator, Judge e `medirSobras`, todos do Generate.
**Determinismo OK em 20 de 20.**

| o que cada um faz melhor | o número que sustenta |
|---|---|
| **Generate · ortogonal** — mais aproveita terreno regular | 75,2 %, 74,6 % e 69,6 % de área privativa nas três glebas de forma simples; sobra em **poucas peças grandes** (7, 14, 30) |
| **Generate · espinha** — melhor acompanha forma difícil | passa a ortogonal nas duas glebas de contorno real: **1 803 × 1 605** e **1 657 × 1 389** |
| **Laboratório de Parcelamento** — menos desperdiça terra | sobra de **0,1 % a 13,7 %** da massa, contra 7 % a 58 % dos outros. **O preço:** é o único com violação do Validator nas cinco (15 a 29) |
| **Symbios + subdivisão do Lab** — o único que lê relevo | e o único com lote que **não é retângulo** (mediana 0,10 a 0,14). Entrega menos lote que todos (14 % a 23 %) |

**Sem recomendação de produto**, como o prompt mandou.

### A porta única

**O motor declara o que sabe fazer, e o que ele declara é conferível medindo.**
Onze campos, cada um com o experimento que o desmente, e **13 experimentos** que
rodam a cada `bun test`. Os quatro motores a implementam.

**E o teste achou dois defeitos que viraram cláusula do contrato:**

- **o Symbios estourava** em gleba sem relevo — *"tem 0 vértices cotados"*. Não é
  defeito: é exigência não declarada, e numa tela comum **motor que estoura
  derruba os outros junto**. Virou `exigeRelevo` e a proibição de exceção (D66);
- **a rampa máxima não existe na saída do v1.** O indicador passou a chamar-se
  `rampaMediaMaxima_pct`, com o nome feio de propósito: ele lembra a falta (D67).

### Dois achados de medição, antes de virarem tabela

- **a régua de forma punia quem gira o lote pela rua**: 754 de 776 lotes da
  espinha marcados "irregulares" sendo retângulos. Com a caixa girada, **84** e
  mediana 0,000 (D63);
- **o aparo estava invertido**: "aparou 99,68 % do comprimento" é o complemento
  de 0,32 %. Ninguém apara 99 % de uma rede e ainda a julga.

---

# A decisão do Jonny sobre a travessia · 15/09/2026

**D61 · Travessia sobre APP é exceção, não padrão.** Transcrita antes de
interpretada, porque é regra urbanística e não é minha:

> o motor tenta primeiro ligar os dois lados **por fora da APP** e só propõe
> travessia se o desvio for desproporcional; quando propuser, **a mais curta e
> perpendicular ao curso**, declarada na tela e lançada como **item de custo
> (ponte ou bueiro)**.

**O que ela fecha:** a D58 tinha registrado que `geo-antonina` fica em dois
blocos porque uma APP hídrica de 14,4 ha corta a gleba, e que ligar os dois era
decisão de urbanismo. Está decidido: **pode**, por exceção e com ônus declarado.
Os 70,4 % continuam certos **enquanto houver caminho por fora**.

**O que ela ainda não permite fazer**, e por isso nenhuma travessia é proposta:

| o que falta | de quem é |
|---|---|
| o limiar de **"desproporcional"** — a decisão não trouxe número | **do Jonny** |
| o **eixo do curso d'água** — a APP chega como polígono, e "perpendicular ao curso" precisa da linha | **do Geo**, via chat |
| o **nome do aplicativo de orçamento** — a mensagem cortou em "para o Or…" | **do chat** |

**D62 · Despertador que acorda e não acha item pronto se apaga.** Antes valia só
para fila esgotada; agora vale também para a fila toda "aguardando". A medição
que a motivou: dos **7 disparos** do despertador anterior, **4 não tiveram o que
fazer** — a sessão ficou ociosa das 02:05 às 06:06 e os avisos chegaram os cinco
de uma vez.

---

# LF-FINAL-2 — a conferência, segunda volta · 15/09/2026

Relatório: [`relatorios/LF-FINAL-2.md`](relatorios/LF-FINAL-2.md)

> ### Conforme, com **um desvio consertado** e **um achado incômodo sobre mim mesmo**.

**O desvio (§9.3).** Classifiquei **cada** `toFixed` do núcleo, em vez de
contá-los juntos: dos 32, **20** são prosa para pessoa (borda, pela D47), **10**
são o `geojson.ts`, que é formato de exportação, **1** é o hash de determinismo,
declarado no próprio arquivo — e **1 era dado que viaja**, o `fechamento` do
esqueleto, arredondado dentro da geometria. Consertado: sai cru, e quem publica é
que arredonda (D59). **Agora são zero.**

**O achado (§1 do CLAUDE.md).** A regra do RECADO — no máximo 12 linhas — nunca
tinha sido medida. Medida: **7 dos 8 recados passaram do teto** (16, 21, 19, 19,
18, 19 e 16 linhas); só o do LAB-05 cabia. **Não reescrevi os sete** — o
`RECADOS.md` é registro do que foi enviado, e encolhê-los faria o arquivo mentir.
Virou **teste**, que mede o último recado a cada `bun test` (D60).

**O que estava em ordem:** os arquivos do §4 todos presentes; **zero link
interno quebrado** em todo `docs/`; decisões contíguas de D01 a D58, sem buraco e
sem repetida; `INDEX` cobrindo todo `.md` de `docs/`; chaves limpas pelo comando
publicado; os quatorze PR na `main`; **zero alterações** nos três clones
vizinhos — e, conferido pela primeira vez, **de quem são os commits deles**: os
14 de `motor-testfit` são da própria sessão dele, nenhum desta.

**A disciplina do §6 rendeu mais três** conclusões erradas desfeitas desde a
primeira conferência, somando **oito** no laboratório: a borda da quadra que era
o eixo (D52), a APP que separa `geo-antonina` (D58) e a régua do "atravessa" com
ponto cego (D55).

---

# LAB-05 — recortar a quadra, descartar a lasca · 15/09/2026

Relatório: [`relatorios/LAB-05.md`](relatorios/LAB-05.md) · números crus:
[`provas/LAB-05/`](provas/LAB-05/) · as saídas para o Generate julgar:
[`contratos/saidas/`](contratos/saidas/)

### A meta, nas cinco glebas

| | `completo` | `50ha` | `10ha` | `ensaio-47ha` | `geo-antonina` |
|---|---|---|---|---|---|
| **vértice de quadra além da folga de 5 cm** | 2 017 → **0** | 708 → **0** | 21 → **0** | 63 → **0** | 2 591 → **0** |
| pior distância fora | 162,79 m → 0 | 114,65 → 0 | 98,04 → 0 | 15,01 → 0 | **170,98 m → 0** |
| quadras recortadas → peças | 74 → 76 | 37 → 37 | 3 → 3 | 5 → 5 | 128 → 129 |
| **não recortaram** | 0 | 0 | 0 | 0 | 0 |
| lascas da D48 | 14 | 0 | 0 | 2 | 17 |
| determinismo | OK | OK | OK | OK | OK |

### O Judge

| | `ensaio-47ha` | `geo-antonina` |
|---|---|---|
| lotes, sem → com o recorte | 181 → **214** | 876 → **1 014** |
| área vendável | 5,59 → **6,61 ha** (14,07 %) | 25,88 → **29,85 ha** (21,06 %) |
| **Validator** | 0 → **0** | 4 → **4** |

**As violações não mudaram.** 33 e 138 lotes a mais, nenhuma violação a mais.

### O item que não era defeito

`geo-antonina` fragmenta a 70,4 % porque a gleba é **cortada em duas por uma APP
hídrica de 14,4 ha**. São **dois blocos** (42 899 m e 17 296 m), não vinte e
cinco pedaços; o menor vão entre eles, 72,45 m, está **200 de 201 pontos
amostrados dentro da APP**. Reconectar é lançar rua sobre APP — decisão de
urbanismo, não minha (D58). **Os 70,4 % são a resposta certa.**

### E o defeito do Lab que a conferência achou

A régua que dizia quem atravessa a divisa amostrava o raio do centróide ao
vértice até `t = 0,9375`: **o vértice nunca era amostrado**. Oito quadras
declaravam estar 100 % dentro estando até **1,49 m** fora (D55). Consertada, e o
recorte passou a **não depender dela** — ele recorta tudo e deixa a interseção
responder (D56). Consequência em número publicado: `geo-antonina` vai de 698 para
701 quadras, e os 213 e 901 lotes do LAB-04, medidos com a régua cega, seriam 181
e 876 pela mesma estratégia.

### O recortador

Greiner–Hormann (1998) reimplementado — as bibliotecas prontas são copyleft ou
trariam dependência npm a um adaptador que não tem nenhuma (D14). A
degenerescência conhecida do algoritmo é **detectada e contornada** deslocando o
anel de décimos de milímetro, e o que não resolver vira **perda declarada**, nunca
peça torta (D57). Nas cinco glebas: **zero deslocamentos, zero perdas**.

---

# LAB-04 — o Symbios passa a fazer lote · 15/09/2026

Relatório: [`relatorios/LAB-04.md`](relatorios/LAB-04.md) · números crus:
[`provas/LAB-04/`](provas/LAB-04/) · as saídas para o Generate julgar:
[`contratos/saidas/`](contratos/saidas/)

### A tabela

| | **Symbios + Lab** | Testfit T02 | Generate `ortogonal` | Generate `espinha` |
|---|---|---|---|---|
| `ensaio-47ha` · **lotes** | **213** (era 0) | 599 | 974 | 776 |
| `ensaio-47ha` · área vendável | 65 936 m² (14,03 %) | 238 190 m² | 353 307 m² | 302 654 m² |
| `ensaio-47ha` · **violações** | **0** | 16 | 0 | 0 |
| `geo-antonina` · **lotes** | **901** (era 0) | 1 391 | 1 389 | 1 656 |
| `geo-antonina` · área vendável | 266 665 m² (18,81 %) | 555 573 m² | 508 581 m² | 617 219 m² |
| `geo-antonina` · **violações** | **4** (0,44 % dos lotes) | 53 (3,81 %) | 1 | 0 |
| determinismo | **OK** nas duas | OK | — | — |

### O oráculo bate, ponto a ponto

Retângulo 60 × 30 → nós em (15,15) e (45,15), offset 15; o L → mais um em
(15,45); as frentes de onda em 5 batem vértice a vértice. É o oráculo de **duas
implementações independentes** do `STRAIGHT_SKELETON_ANALYSIS.md` §4.4, e o
fechamento das faces dá **1,000**. Prova em
[`provas/LAB-04/oraculo.json`](provas/LAB-04/oraculo.json) e em teste que trava.

### O meio-fio não é o eixo — 369 violações ensinaram

A borda de uma quadra do Symbios **é o eixo da rua**: as quadras são faces do
grafo viário. Lote plantado nela deu `via-sobre-lote em 369 de 369 lotes`. O lote
passou a nascer a **meia caixa** do eixo (D52). **É o mesmo erro do LAB-07 com a
calçada (D18)** — e, de novo, quem o pegou foi a régua do Generate, não a
leitura do código.

### Onde o lote se perde, com número

Das 698 quadras de `geo-antonina`: **119 atravessam a divisa** (não loteadas —
é o item 2 do LAB-05), **86 têm esqueleto não confiável** (puladas e contadas,
D51), 334 são estreitas demais, e **159 dão lote**. Mais 3 726 peças descartadas
por área mínima. O aproveitamento das quadras fica em **22 %**: o traçado do
Symbios é orgânico, e quadra pequena e irregular não aceita lote retangular de
360 m².

### Quatro correções, todas cobradas pelo Validator

`via-sobre-lote` 41 → 0 (via de outra quadra passando por cima); o arquivo
recusado por 97 peças fora da gleba → aceito (pular quadra que atravessa);
`faixa-legal` 8 → 0 (o número de fatias preso pelos parâmetros, D53); `frente`
8 → 2 (a pergunta "tem rua?" refeita em cada fatia, D54). **Nenhuma inventou
regra** — área mínima, máxima e testada mínima já vinham da gleba.

---

# LF-FINAL — a conferência contra o Padrão · 14/09/2026

Relatório: [`relatorios/LF-FINAL.md`](relatorios/LF-FINAL.md)

> ### Conforme, com **uma ressalva declarada** e **três arquivos que faltavam**.

**A versão 1.2 não existe.** Procurei nos quatro clones; só há a **Versão 1 ·
13/09/2026**. A conferência foi feita contra ela, e a lacuna está declarada em
vez de trocada em silêncio.

**O que faltava, e foi escrito:** `docs/SEGURANCA.md` (a lista preenchida, com o
comando de prova ao lado de cada linha), `docs/ADOCAO_CENTRAL.md` (por que o Lab
**não** adota — sem conta, sem tela, sem IA) e `docs/referencia/` (para onde foi
a especificação, que estava no lugar errado, e a cópia do Padrão conferido).

**A ressalva:** 17 `toFixed` no núcleo produzem texto — todos em **prosa para
pessoa**. Nenhum número que viaja é formatado. Tirar o `toFixed` da prosa
pioraria a prosa; apertar ou não é interpretação do Padrão, e interpretação é do
chat.

**Chaves: limpo**, conferido com comando. E uma nota de método: a primeira busca
acusou quatro ocorrências que eram todas a palavra *de-**senha**-r*.

**`PENDENCIAS_JONNY.md` foi refeito do zero** e encolheu para **um item**: a
confirmação sobre a calçada.

---

# LAB-08 — os dois motores lado a lado · 14/09/2026

Relatório: [`relatorios/LAB-08.md`](relatorios/LAB-08.md) · números crus:
[`provas/LAB-08/`](provas/LAB-08/) · as saídas para o Generate julgar:
[`contratos/saidas/`](contratos/saidas/)

### `ensaio-47ha` — 47,0 ha, zero restrições

| | Symbios 0.4.1 | Testfit T02 | Generate `ortogonal` |
|---|---|---|---|
| lotes | **0** — não parcela | **599** | **974** |
| lote médio | — | **397,65 m²** | 362,74 m² |
| quadras | **94** | — | — |
| via fora da gleba | 5,21 % → **0 %** | **0 %** | — |
| violações | **0** | 16 | 0 |
| rampa no cruzamento | **77,43 %** | `null` | — |
| **quadro de áreas fecha?** | sim | **sim** | **NÃO — +15,8 %** |
| determinismo | OK | OK | — |

### `geo-antonina` — 141,8 ha, terreno real

| | Symbios 0.4.1 | Testfit T02 | Generate `ortogonal` | Generate `espinha` |
|---|---|---|---|---|
| lotes | **0** | **1 391** | 1 389 | **1 656** |
| quadras | **698** | — | — | — |
| via fora da gleba | 54,57 % → **0 %** | **0 %** | — | — |
| violações | **0** | 53 | 1 | 0 |
| rampa no cruzamento | **113,54 %** | `null` | — | — |
| quadro fecha? | sim | sim | sim | sim |

## O T02 funcionou

| | LAB-07 (T00-A) | LAB-08 (T02) |
|---|---|---|
| recusadas pelo esquema **sem** o aparo | **60 de 60** | **0 de 20** · 2 de 20 |
| quanto o aparo do Lab ainda corta | **25 % a 40 %** | **0,32 %** · 0,17 % |

`pente` chegou a zero violações. `cluster` (77,9 %), `organico` (82,9 %) e
`radial` (100 % dos lotes) continuam quebrados, e `superquadra` continua vazia.

## Os "22 % a menos de lotes": a causa, com número

O número mudou e não é constante: **−38,5 %** em `ensaio-47ha` e **empate**
(1 391 × 1 389) em `geo-antonina`. E o lote do Testfit é **maior** (397,65 contra
362,74 m²) — ele não empacota pior, empacota em **menos terra**: 50,7 % da gleba
contra 75,2 %.

**A última linha explica o resto.** O quadro de referência do Generate em
`ensaio-47ha` soma **544 498 m² numa gleba de 470 000** — 15,8 % a mais do que a
terra existe. Privativa e viária sozinhas já ocupam 90,9 %, sobram 43 002 m², e o
quadro reivindica 117 500 para lazer e APP.

De onde vêm esses dois números? **Do parâmetro, não do desenho:** `areaAPP_m2` é
exatamente 15,0 % da gleba (`pctAPP: 15`) e `areaLazer_m2` exatamente 10,0 %
(`pctLazer: 10`) — e **`ensaio-47ha` declara `restricoes: []`**. O quadro anuncia
7,05 ha de APP numa gleba que não tem nenhuma.

Não é defeito geral: em `geo-antonina` o mesmo quadro fecha ao centavo. Quatro
testes fixam as quatro afirmações. **Daqui não dá para saber** se os lotes estão
por cima da APP ou se a APP não existe no desenho — é uma pergunta, com número,
para o Generate.

## Dois achados novos

- **O Testfit não usa relevo no traçado.** Mesma semente, gleba com e sem
  relevo: 599 e 599; 1 391 e 1 391, lote a lote. O T03 deles diz isso no título;
  a medição independente confirma — e é o que garante que a fixture do LAB-03
  não contaminou a comparação com os números do Generate.
- **O Symbios é o único dos três que entrega greide.** Somado ao achado do
  LAB-02 (o Validator não confere rampa, e o contrato só carrega a média), a
  única informação de greide que existe na família vem do motor que ainda não
  faz lote.

**O LAB-04 virou o próximo passo óbvio do Symbios:** ele entrega 94 e 698
quadras limpas; o que falta para disputar o Judge é subdividir quadra em lote.

---

# LAB-03 — o relevo · 14/09/2026

Relatório: [`relatorios/LAB-03.md`](relatorios/LAB-03.md) · números crus:
[`provas/LAB-03/`](provas/LAB-03/) · fixtures:
[`fixtures/glebas-padrao-com-relevo/`](fixtures/glebas-padrao-com-relevo/)

> ### O defeito de interpolação não estraga a rampa. Ele estraga o **traçado**.

Mesmo motor, mesma semente, mesma gleba, sobre dois mapas de alturas — o
corrigido (produção, desde o LAB-01) e o defeituoso (k = 6 vizinhos, que é o que
o Generate ainda usa).

**A rampa quase não se mexe:** a máxima em cruzamento vai de 269,96 % para
161,38 % na pior gleba, e nas outras duas a diferença é de ruído — com o
defeituoso saindo "melhor" na gleba plana.

**O traçado se mexe muito:** a fração do comprimento de via alinhada a uma única
direção salta de **12,6 % para 47,3 %** e de **11,3 % para 41,5 %**. O motor para
de seguir topografia e **cai em grade**.

E a prova mais limpa está na gleba **plana**, onde o sinal se inverte: ali a
grade é a resposta certa, o corrigido produz 97,2 % dela, e o defeituoso produz
**76,7 %** — ele **inventa sinuosidade** onde não há relevo, porque o traçado
segue a borda dos degraus do bolo de casamento.

| gleba | células sobre valor de curva | gradiente zero | rede alinhada |
|---|---|---|---|
| `completo` | 1,74 % → **35,79 %** | 0 % → **67,76 %** | 12,6 % → **47,3 %** |
| `sintetico-50ha-ondulado` | 0,20 % → **85,00 %** | 0 % → **73,33 %** | 11,3 % → **41,5 %** |
| `sintetico-10ha-plano` | 1,87 % → **49,81 %** | 0 % → **95,49 %** | 97,2 % → **76,7 %** |

*(corrigido → k = 6. Os 85 % e 73 % são exatamente os que o LAB-01 relatou.)*

**Para o Generate**, isto é o argumento que faltava no diagnóstico que o LAB-07
mandou: não é imprecisão de cota, é o traçado deixando de seguir o terreno — e,
em terreno plano, seguindo um terreno que não existe.

## As glebas-padrão ganharam relevo

`docs/fixtures/glebas-padrao-com-relevo/` — poligonal, restrições, acessos e
parâmetros **do Generate, intocados**; só o `relevo` é acrescentado, sintético e
**declarado** no próprio arquivo. O Generate não foi alterado; a proposta de
adotá-las lá está no relatório, para o chat repassar.

| gleba | curvas | desnível | o motor roda? |
|---|---|---|---|
| `ensaio-47ha` | 0 → **163** (5 121 vértices) | 30,07 m | **sim** — 96 trechos, 94 quadras, 0 % fora |
| `geo-antonina` | 0 → **250** (7 322 vértices) | 55,92 m | **sim** — 472 trechos, 698 quadras, 0 % fora |

**O LAB-08 deixou de ser impossível.** Falta só o T02 do outro motor.

**Uma ressalva, e é do recorte:** `geo-antonina` fragmenta muito mais que
qualquer gleba medida até aqui — 25 componentes, só **70,4 %** no maior (o pior
do LAB-02 tinha sido 94,7 %). A causa é a forma dela: 141,8 ha de contorno
recortado com três APP atravessando o meio. Reconectar a rede depois do corte
seria desenhar via que o motor não desenhou, então foi para a fila como proposta
ao chat.

---

# LAB-02 — o recorte · 14/09/2026

Relatório: [`relatorios/LAB-02.md`](relatorios/LAB-02.md) · números crus:
[`provas/LAB-02/`](provas/LAB-02/)

> ### A meta foi atingida: **0 % de via fora da gleba**, nas três glebas.

| gleba | via fora da gleba | via em restrição | contrato |
|---|---|---|---|
| `completo` · 141,8 ha | **37,43 % → 0 %** | **19,55 % → 0 %** | recusado → **aceito, 0 violações** |
| `sintetico-50ha-ondulado` | **38,73 % → 0 %** | — | recusado → **aceito, 0 violações** |
| `sintetico-10ha-plano` | **42,80 % → 0 %** | — | recusado → **aceito, 0 violações** |

**O custo, medido:** a rede encolhe para 43–61 % do comprimento (a parte que
nascia fora da terra do empreendimento) e a conectividade cai pouco — o maior
componente vai de 99,9 % para 97,6 %, de 99,8 % para 98,0 % e de 99,4 % para
94,7 %. **O recorte não estilhaça a rede**, que era o risco que o LAB-01 mandou
conferir.

**Quem bloqueia a rua não é escolha do Lab** (D32): é o campo `desconta` que o
Geo já carimba. Em `completo` isso pegou `app_rio`, `app_declividade` e
`reserva_legal` — 34,4 ha ao todo.

## O achado que sai daqui: ninguém confere a rampa

O LAB-01 decidiu que "a conferência é do Validator". Fui conferir se o Validator
confere. **Não confere:**

- `invariantes.ts` do Generate tem onze tipos de violação, **todos geométricos**
  — nenhuma menção a rampa, declividade ou greide;
- a régua **existe** (`topografia.ts`: 10 % máximo, 12 % tolerado em trecho
  curto), mas roda sobre o plano **interno** do Generate, não sobre a saída de
  motor externo;
- e o contrato só carrega **`rampaMedia_pct`** por via: um pico de 161 % num
  cruzamento é diluído pela média até sumir.

A prova está na própria rodada: as três glebas passaram com **zero violações**
tendo 246, 51 e 1 arestas acima de 10 %.

**Para o chat repassar ao Generate**, duas coisas distintas: a régua de rampa não
alcança motor externo, e o contrato precisa de `rampaMaxima_pct` por via, ao lado
da média. Sem esse campo, nenhuma conferência de rampa é possível sobre o
contrato.

## O outro motor: 44 lotes tocando APP

O aparo do LAB-07 corta pelo perímetro e **não olha para as restrições**. Medida
a melhor variante daquele relatório contra as 3 APP de `geo-antonina`: **894,63 m
de via dentro de APP (4,59 %)** e **44 lotes de 1 429 tocando APP (1,76 ha)**.
Entra na lista do T02 do outro motor; a forma do conserto já está escrita em
`recorte.ts`.

## Duas conclusões erradas desfeitas por medir o "antes"

1. **"O recorte destrói a conectividade"** — a régua ligava só ponta com ponta, e
   a rede **crua** dava 472 componentes por ela. Causa: as cadeias quebram por
   tipo, então uma local termina no *meio* de uma principal. Com a régua certa, a
   rede crua é uma rede só (99,8 % no maior).
2. **"A rampa ao longo da via piorou de 10,01 % para 34,98 %"** — aquela aresta
   sempre teve 34,98 %; ela encostava num cruzamento que o corte levou embora, e
   mudou de balde. Nada piorou.

---

# LF-01 — a casa em ordem · 14/09/2026

Relatório: [`relatorios/LF-01.md`](relatorios/LF-01.md).

Não mexeu em motor nem em medição — arrumou a casa para o laço autônomo rodar
sozinho. O que mudou:

- **`prompts/FILA.md`** virou a fila oficial, com o histórico LAB-00…LAB-07
  preservado no fim.
- **`relatorios/RECADOS.md`** passou a existir: todo recado é acrescentado lá,
  com data. O pedido "me dá tudo desde o dia tal" virou uma leitura.
- **`INDEX.md`** passou a existir (D30): o `ONDE_PARAMOS` estava fazendo dois
  trabalhos, e o índice é o que quase não muda.
- **Três decisões do chat** gravadas em `DECISOES.md` — D26 (a calçada é da via,
  dentro da caixa, nunca descontada do lote), D27 (na tela só entra partido que
  passa no Validator; hoje só o `pente`), D28 (a superquadra vazia é defeito de
  pontuação, não decisão urbanística) — mais D29 (o laço autônomo) e D30.
- **`PENDENCIAS_JONNY.md`** encolheu: as três perguntas abertas viraram
  **duas confirmações**, e o repasse dos achados aos vizinhos saiu da lista dele
  — por decisão do chat, é do chat.

**Uma coisa do LF-01 não saiu como pedido.** A branch
`claude/stoic-ritchie-ijzqy3` deveria ser apagada (o diff dela contra a `main`
era vazio). O proxy de git deste ambiente **recusou a exclusão três vezes** —
ele aceita atualizar ref e recusa apagar ref —, e não há ferramenta de apagar
branch disponível aqui. Em vez disso, ela foi **reposta sobre a `main`**: aponta
para o mesmo commit e carrega zero conteúdo próprio. Ela também precisa existir,
porque é a branch de trabalho das rodadas seguintes. A exclusão literal é um
clique na interface do GitHub, se alguém quiser.

---

# LAB-07 — o motor do Testfit na esteira


**Relatório completo:** [`relatorios/LAB-07.md`](relatorios/LAB-07.md) ·
**números crus:** [`provas/LAB-07/`](provas/LAB-07/)

Terreno no contrato `archilly-motor-entrada` v1 → `idaParaOMotor` → `rodarMotor`
do Testfit → `voltaParaOContrato` → `archilly-motor-saida` → **o Validator e o
Judge do próprio Generate**, importados, nunca reimplementados. Três glebas, dez
partidos de traçado, 20 variantes cada — 60 no total.

> ### Geometria utilizável: **SIM COM RESSALVAS**

**47 variantes julgadas, 28 401 lotes, 4 132 violações (14,55 %)** — e a média
engana, porque o resultado é muito desigual por partido: `pente` 0,06 %,
`diagonal` 1,26 %, `mioloVerde` 1,60 %, `ortogonal` 2,07 %, `espinha` 2,67 %,
`loop` 5,24 %, **`cluster` 77,77 %**, **`organico` 140,11 %**.

### As cinco ressalvas

1. **Nenhuma variante passa no contrato sem conserto** — 25 % a 40 % do
   comprimento de via nasce fora da divisa, e o esquema recusa antes de julgar.
   Todos os números vêm de uma passagem com **aparo feito pelo Lab**, que corta
   **só o eixo das vias** e vem desligado por padrão.
2. **A calçada é declarada e não é reservada.** Medido: o lote encosta a
   `caixa_m / 2` do eixo. Declarar `caixa + 2 × calçada` produziu 441 de 441
   lotes sem frente; declarar a caixa real levou a mesma variante a 15 violações.
3. **Dois partidos quebrados** — `cluster` (2 994 violações de testada) e
   `organico` (165 lotes sobrepostos). `radial` é recusado em 6 de 6.
4. **`superquadra` nasce vazia em 20 de 20**, e o plano vazio lidera o ranking do
   motor com nota 0,366 — pior do que os 11 de 12 que o próprio Testfit relatou.
5. **O motor não calcula greide**: `rampaMedia_pct` sai `null`, e a rampa fica
   inteiramente com o Validator.

### O que passou

- **Determinismo:** mesma semente → arquivo de contrato byte a byte idêntico
  (`2709e86fed2b7181` duas vezes); semente diferente → arquivo diferente.
- **Fechamento de áreas:** 0,00 % de erro nas 60 variantes.
- **Tempo:** 1,5 s (`ensaio-47ha`), 2,1 s (`lab01-50ha-ondulado`), 9,5 s
  (`geo-antonina`) para 20 variantes cada.
- **A régua do próprio Testfit** (`medirPlano`) sobre as 60: **zero** lote fora
  da área e **zero** fora da tolerância.

### Dois achados que atravessam repositórios

1. **O defeito de relevo do LAB-01 atinge o Generate, e não o Testfit.** Mesma
   nuvem, mesma régua: `criarModeloRelevo` do Generate deixa **49,8 %** das
   amostras sobre um valor de curva e **17,3 %** da grade com gradiente zero; o
   `campoRelevo` do Testfit, que pondera **todos** os pontos em vez dos k mais
   próximos, fica em 2,2 % e 0 %. Diagnóstico para repassar ao Generate, com a
   correção sugerida: exigir vizinhos de **pelo menos duas cotas distintas**.
   Só diagnóstico — o Lab não escreve no Generate.
2. **As duas glebas-padrão do Generate não têm relevo nenhum** (`curvas: []`,
   `cotas: null`). É por isso que a terceira gleba deste prompt é a do LAB-01 —
   sem ela, o campo `relevo` do contrato atravessaria a esteira sem nunca ser
   exercitado.

### Onde está o código

```text
external-engines/testfit/          (sem upstream/: o motor é da família — D16)
├── adapter/src/
│   ├── contrato-v1.ts   os tipos do contrato
│   ├── ida.ts           contrato → EntradaMotor, com as perdas declaradas
│   ├── volta.ts         plano → contrato, com as perdas declaradas
│   ├── aparo.ts         o conserto: corta SÓ eixo de via, desligado por padrão
│   └── esteira.ts       a esteira inteira, com o Validator e o Judge do Generate
├── ferramentas/         medir.ts · diagnostico-relevo.ts · gleba-lab01.ts
└── tests/               14 testes, verdes
```

Os caminhos dos dois repositórios irmãos estão **num lugar só**: os `paths` do
`external-engines/testfit/tsconfig.json`.

---

# LAB-01 — o adaptador do Symbios

## O que existe agora

```text
external-engines/symbios/
├── upstream/            symbios-tensor 0.4.1 (c3f2875) — INTOCADO, verificado com cmp
├── archilly/
│   ├── wasm/            ponte Rust → .wasm de 189 KB, ZERO imports
│   ├── probe/           medições do LAB-00
│   └── wasm-probe/      prova de compilação do LAB-00
└── adapter/             O ADAPTADOR (LAB-01)
    ├── src/             9 arquivos, zero dependências npm
    └── ferramentas/     geração de terrenos, medições, diagnóstico, navegador
docs/terrenos/           4 terrenos no contrato archilly-terreno 1.1
outputs/lab01/           medições cruas, GeoJSON por terreno, captura do navegador
```

Uma função: `gerarRedeViaria(motor, terreno, parametros, seed)`.

## O veredito do LAB-01

> **Geometria utilizável: SIM COM RESSALVAS**

Relatório completo com todas as medições:
[`relatorios/LAB01_ADAPTADOR.md`](relatorios/LAB01_ADAPTADOR.md).
Decisões numeradas e o porquê de cada uma: [`DECISOES.md`](DECISOES.md).

### O que passou, com folga

- **Ida e volta georreferenciada:** pior erro **2 × 10⁻¹⁰ m** contra a meta de
  0,01 m — oito ordens de grandeza de folga.
- **Determinismo:** mesma seed → mesmo SHA-256 da geometria; seed diferente →
  saída diferente.
- **Uso C:** eixos do Archilly entram, quadras saem. Grade 3×3 com vão de 120 m
  → 4 quadras de 14 400 m², exatas.
- **Navegador:** `.wasm` instancia em 19,7 ms e roda o pipeline completo em
  **151 ms** no Chromium, carregado com `WebAssembly.instantiate(bytes, {})` —
  objeto de imports vazio, sem `wasm-bindgen`, sem glue.
- **Quadras com tamanho de loteamento:** mediana entre 1 600 e 1 900 m².
- **Escala:** 200 ha em 5,7 s no total, dos quais só 631 ms são do motor.

### As três ressalvas

1. **A rampa não é respeitada nos cruzamentos.** Ao longo de uma via o clamp
   fecha sem exceção (pior caso: 10,04 % contra 10 % pedidos); em nó de grau 3 ou
   mais aparecem 49 %, 69 %, 365 %. Testado e descartado: não é o encadeamento do
   adaptador, não é relevo extrapolado, **e não é falta de convergência** (10 e
   1 000 passes dão resultado idêntico). É estrutural — o clamp opera por cadeia,
   e nó compartilhado por várias cadeias não pode ser movido sem quebrar as
   outras. **Decisão: o Adapter não corrige; a conferência é do Validator.**
2. **38 % do comprimento de via nasce fora da gleba.** O motor gera sobre um
   retângulo e a gleba é irregular. Recortar não é cosmético: pode deixar trecho
   isolado dentro da gleba, e o recorte precisa de verificação de conectividade
   depois.
3. **O traçado é cru.** As principais fecham anéis em torno dos morros — geometria
   de qualidade, o que um projetista faria numa encosta. As locais descem em leque
   a partir dos cumes, e nos cumes dezenas convergem num ponto. É o mesmo lugar
   onde a rampa estoura. Ver a captura em `outputs/lab01/navegador.png`.

## Três achados que mudam premissas anteriores

1. **O O(N²) do LAB-00 não é o problema que parecia.** Aquele relatório registrou
   128 s num mundo de 4 km². Medido agora em terreno real com espaçamento de
   loteamento: **631 ms em 200 ha**. A diferença é calibração — os 128 s foram
   com os defaults do upstream, que põem uma via a cada 15 m. **Nenhum contorno é
   necessário até 200 ha**, e processar por setores criaria costura visível (o
   mesmo defeito que o `CityStreamer` do upstream admite ter).

2. **O contrato de entrada não é o `archilly.geo.2`.** O prompt o nomeia, mas ele
   é o pacote para o **Archilly Studio 2D/3D** e leva estado de aplicativo. O
   contrato que alimenta um motor de loteamento é o **`archilly-terreno`** (1.1),
   que é GeoJSON com poligonal, restrições recortadas e curvas cotadas — e é o
   que o Generate consome.

3. **Os estudos de prova do Geo não têm geometria.** `estudos-de-prova.ts` é
   entrada de dossiê e prancha: `vertices: []`, testadas com coordenadas de
   exemplo, mapa substituído por um PNG de 1×1. Prova formatação, não geometria.
   Os terrenos em `docs/terrenos/` usam os **números** reais dos estudos com
   **geometria construída**, e cada arquivo declara isso na `procedencia`.

## Um defeito nosso que vale para o Generate

A interpolação de relevo do adaptador usava k-vizinhos — o mesmo método do
`criarModeloRelevo` do Generate. Como os vértices ao longo de uma curva de nível
são muito mais próximos entre si do que a distância entre curvas, **85 % das
células caíam exatamente sobre um valor de curva e 73 % da grade tinha gradiente
zero**. O terreno virava um bolo de casamento — terraços planos com degraus — e o
campo tensorial seguia a borda dos degraus, não a topografia.

Corrigido aqui (interpolação entre cotas distintas). **Se o `criarModeloRelevo`
do Generate for alimentado com vértices de curva de nível, tem o mesmo defeito.**

**O LAB-07 verificou, e a suspeita procede:** 49,8 % das amostras sobre um valor
de curva e 17,3 % da grade com gradiente zero, medidos com o próprio
`criarModeloRelevo` sobre a mesma nuvem. Continua sendo só diagnóstico — o Lab
não escreve no Generate. Números em `relatorios/LAB-07.md`, §8.

## Próximo passo — LAB-02

Recorte pela gleba e pelas restrições, e passagem pelo Validator. Em ordem:

1. **Recortar pela gleba** e **conferir conectividade depois** — é onde o recorte
   machuca, e 38 % do comprimento vai embora.
2. **Recortar pelas restrições** — APP, reserva legal e faixa não edificável já
   viajam carregadas no `Terreno`; falta usá-las.
3. **Passar pelo Validator**, com atenção à rampa **nos cruzamentos**. É a
   reprovação que já se pode antecipar.

**O LAB-07 adiantou três coisas para ele:** o caminho até o Validator e o Judge
do Generate está aberto e provado a partir do Lab; o recorte de eixo viário pelo
perímetro já está escrito em `external-engines/testfit/adapter/src/aparo.ts`, e
como **os dois motores** deixam cerca de um terço da rede fora da divisa, vale
escrever o recorte do LAB-02 pensando em servir aos dois; e o contrato de motor
v1 funciona como porta — 60 arquivos passaram pelo esquema, 47 chegaram ao
Validator, e o que recusou recusou pelo motivo certo.

**O que o LAB-02 não deve fazer:** consertar a rampa dentro do Adapter. Se o
Adapter consertar geometria, o LAB-03 compara o conserto do Adapter com o motor
Geométrico, não o Symbios.

Uma alternativa que vale medir no LAB-02: **rebaixar o relevo fora da gleba
abaixo do `water_level`** faz o motor evitar aquela área sozinho, e recortaria
antes em vez de depois. Não foi feito aqui porque o recorte é do LAB-02 e porque
criar um penhasco na divisa tem efeito colateral no campo tensorial (ver D12).

## Como reproduzir tudo

```shell
cd external-engines/symbios/archilly/wasm
rustup target add wasm32-unknown-unknown
RUSTFLAGS='--cfg getrandom_backend="custom"' cargo build --release --target wasm32-unknown-unknown

cd ../../adapter
node --experimental-strip-types ferramentas/gerar-terrenos.ts
node --experimental-strip-types ferramentas/medir.ts
node --experimental-strip-types ferramentas/diagnostico-rampa.ts
cd ferramentas/navegador && npx http-server -p 8099 .
```

Requer `cargo` e Node 22+. **Nenhuma dependência npm.**

O LAB-07 é outra pilha, porque compila fonte de três repositórios ao mesmo tempo
(D17). Requer **Bun** e os dois clones irmãos ao lado deste repositório:

```shell
git clone https://github.com/jonny583/motor-testfit              ../motor-testfit
git clone https://github.com/jonny583/urban-create-hub-41d93a4d  ../urban-create-hub-41d93a4d

cd external-engines/testfit
bun install
bun run gleba && bun run medir && bun run relevo
bun test && bun run typecheck && bun run lint
```

Uma dependência do Generate precisa estar instalada para o Validator rodar:
`bun add --no-save zod@^3` **dentro do clone dele** (`node_modules` é ignorado
pelo git de lá; o Lab não escreve naquele repositório).

## Integridade do upstream

`external-engines/symbios/upstream/` continua verificado arquivo a arquivo com
`cmp` contra o commit `c3f287556b98cc616d4263d163e6643ae32111ff`: **byte a byte
idêntico**. Toda a ponte do LAB-01 vive em `archilly/wasm/` e depende do upstream
por caminho, sem modificá-lo.

`external-engines/testfit/` **não tem `upstream/`**, de propósito: o motor é da
própria família e uma cópia congelada aqui envelheceria em silêncio (D16). Ele é
lido por caminho, e o caminho está num lugar só — os `paths` do `tsconfig.json`.

Os repositórios do Geo (`jonny583/urban-scout-tool`), do Generate
(`jonny583/urban-create-hub-41d93a4d`, `main`) e do motor do Testfit
(`jonny583/motor-testfit`) foram clonados **somente para leitura** e terminaram
as rodadas sem uma alteração sequer — conferido com `git status` nos três.
