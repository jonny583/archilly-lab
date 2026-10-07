# LAB-55 · A faixa é buraco no domínio do LOTE e não é buraco no domínio da VIA

**07/10/2026** · prompt da fila de 07/10, o terceiro, **caminho crítico do MVP**. Saiu da
minha lista de *"proposto ao chat"*, escrita no LAB-50 (D174), e era o pedaço que eu havia
deixado **NÃO ATRIBUÍDO** de propósito:

> *"Por que o motor desenha via sobre a face que ele mesmo reservou: NÃO ATRIBUÍDO. Tenho
> candidatas, e não medi nenhuma."*

---

## 0 · A resposta, e ela é uma assimetria

> **`util` — a gleba menos a faixa reservada — governa onde nasce QUADRA e LOTE. A REDE
> VIÁRIA recebe UM aparo, e ele é contra a DIVISA. A faixa é buraco no domínio do lote e
> não é buraco nenhum no domínio da via.**

```
sobreposicao  = 0    ← o LOTE respeitou a faixa (logo o `util` a excluiu, para o lote)
via-sobre-lote = 11   ← a VIA não respeitou
```

**A assimetria é a prova, e ela é feita com dois invariantes do próprio Generate.** Não
precisei do estado interno do motor para chegar nela.

---

## 1 · O mecanismo, lido no código do motor (só leitura)

```ts
// motor.ts:194 — a faixa sai da gleba disponível
const { restante, externos } = reservarFacesExternas(terreno, cfg, a, id);
// motor.ts:198 — e é `restante` que vira o chão do traçado
const util = erodir(rotacionar(restante, -a.angulo, centro), 0);
…
// formatos.ts:436, 589, 671… — QUADRA e LOTE nascem recortados por `util`
const q = quadraRet(util, rect, a.areaLote);
…
// motor.ts:247 — e a REDE VIÁRIA é aparada por… a DIVISA
const vias = apararRedeViaria(viasBrutas, terreno.perimetro);
```

**`apararRedeViaria(vias, terreno.perimetro)` é o único aparo que a rede recebe.** Ele corta
o eixo nos trechos que estão dentro do **perímetro** — e a faixa reservada está dentro do
perímetro. Então a via atravessa a faixa e fica em pé.

### E há um segundo andar, que é onde uma via CHEGA a ser recortada por `util`

```ts
// formatos.ts:826, dentro de `aplicarCulDeSac`
if (pct <= 0) return { vias: s.vias, bolsoes };            // ← com 0 %, NENHUMA é recortada
const vias0 = util
  ? s.vias.map((v) => (v.classe === "secundaria" ? recortarVia(v, util) : v))
  : s.vias;                                                // ← e a PRINCIPAL nunca é
```

Duas condições, e as duas falham aqui: a via **principal nunca** é recortada, e com
`pctCulDeSac = 0` **nem a secundária** é.

---

## 2 · As quatro medições, e a segunda é a que decide

A faixa **não foi reconstruída**: o LAB-50 registrou que **`prof` não é observável de fora**
(item 3 da lista dele), então a faixa é lida **nos lotes externos publicados** — o que o
motor de fato assentou nela. *Sobre o id `-eN`: ele diz **o que** o lote é, porque é a marca
que `reservarFacesExternas` estampa. **Onde** ele está continua sendo medido, nunca lido do
id — a lição do D161 foi medir a distância para dizer onde, não parar de ler o id para saber
o quê.*

| gleba | | externos | vias | entram na faixa | `via-sobre-lote` | `sobreposicao` | bulbos |
|---|---|---:|---:|---:|---:|---:|---:|
| `geo-antonina` | côncava | 33 | 10 | **2 de 10** | **11** | **0** | **0** |
| `ensaio-com-testada` | **convexa** | 51 | 11 | **2 de 11** | **15** | não medido¹ | **0** |

¹ `null` é *"não medido"*, nunca zero (D23): esta gleba é o controle convexo e não está entre
as cinco do LAB-48/LAB-53.

### As vias culpadas, uma a uma

| gleba | via | hierarquia | comprimento | pontas ao perímetro | ponta **dentro** de lote externo | eixo na faixa | ao acesso | invade |
|---|---|---|---:|---|---|---:|---:|---:|
| `geo-antonina` | **V2** | principal | 1 708,5 m | **0 / 0 m** | **sim** | 5 % | 9,6 m | 8 lotes |
| `geo-antonina` | **V10** | principal | 594,8 m | **0 / 0 m** | **sim** | 4 % | 86,7 m | 3 lotes |
| `ensaio-com-testada` | **V11** | **secundaria** | 589,8 m | **0 / 0 m** | **sim** | 23 % | 382,5 m | 15 lotes |
| `ensaio-com-testada` | **V1** | principal | 403,2 m | **0 / 0 m** | **sim** | 8 % | 0,3 m | 2 lotes |

**1 · O lote respeitou a faixa.** `sobreposicao = 0` em `geo-antonina`. Se o corte de
semiplano tivesse saído degenerado e `restante` ficado inteiro, quadra e lote teriam nascido
sobre a faixa e haveria sobreposição entre interno e externo. **Zero mata a candidata do
corte degenerado**, e mata-a com o invariante do Generate, não com leitura de código.

**2 · A via termina na DIVISA, e é isto que separa as duas explicações.** As **quatro** vias
culpadas têm **as duas pontas a 0 m do perímetro**, e **todas as quatro** têm uma ponta
**dentro de um lote externo**. Se `util` as tivesse recortado, elas parariam na borda
**interna** da faixa, longe do perímetro. *A via acaba na divisa — e a divisa, ali, é terra
reservada.*

**3 · Ela ATRAVESSA e continua.** A fração do eixo sobre a faixa é de **4 % a 23 %**: é via
do plano, de divisa a divisa, cujo trecho final cai na faixa. Não é via desenhada sobre a
faixa. E são **2 de 10** e **2 de 11** vias — não todas: *como nenhum recorte existe, passa a
via que o partido por acaso traçou por ali.*

**4 · O recorte por `util` nem rodou, e isso se mede de fora.** O bulbo de retorno nasce
**só** no caminho do `aplicarCulDeSac`, e o contrato o publica como área especial `retorno`.
**Zero `retorno` nas duas glebas** ⇒ `pctCulDeSac = 0` ⇒ o `aplicarCulDeSac` retornou antes de
recortar via nenhuma. **É o que explica uma via SECUNDÁRIA estar entre as culpadas** — ela
seria a única recortável, e não houve recorte.

---

## 3 · As duas explicações mortas do LAB-50 continuam mortas — e a terceira candidata também

As duas do D174 estão escritas em `docs/provas/LAB-50/passagem-externa.json`, campo
`explicacoesMORTAS`, e **a prova do LAB-55 as repete**, para quem ler só ela não
ressuscitá-las. Há trava nos dois lugares.

| candidata | estado | o que a mata |
|---|---|---|
| concavidade | **morta no LAB-50** | o controle **convexo** tem **15** `via-sobre-lote` — **mais** que a côncava |
| derrame de meia-caixa | **morta no LAB-50** | o eixo culpado está a 0,1–0,8 m da RETA da face, **dentro** da faixa |
| corte degenerado (`sobra.length >= 3`) | **MORTA AGORA** | `sobreposicao = 0`: o lote respeitou a faixa, logo o corte funcionou |
| a via de ACESSO na mesma face | **não é o mecanismo** | ver abaixo |

### A candidata do acesso, com honestidade sobre o que a medição sustenta

**Ela não morre inteira, e eu digo isso em vez de arredondar.** Em `geo-antonina`, a pior
infratora — `V2`, 8 lotes — passa a **9,6 m** do ponto de acesso. **Não afirmo que o acesso
não tem parte nela.**

**O que morre é a candidata como MECANISMO**, e por dois números:

- em **toda** gleba há culpada **longe** do acesso: `V10` a **86,7 m**, `V11` a **382,5 m**;
- no controle convexo, a **pior de todas** (15 lotes) está a **382,5 m** do acesso, e a que
  **é** a via de acesso (`V1`, a 0,3 m) invade só **2**.

**E isto custou uma trava vermelha minha, que é o jeito certo de descobrir.** A primeira
versão da trava afirmava *"a pior infratora de CADA gleba está a mais de 50 m do acesso"* e
**reprovou**, por causa dos 9,6 m da `V2`. Afrouxar o limiar para 5 m seria a régua-enfeite
do D172. **A correção foi medir a afirmação que os números sustentam** — *em toda gleba há
culpada longe do acesso* —, não baixar a régua.

---

## 4 · O achado contra mim, pego dentro do prompt (D190)

A primeira versão da ferramenta leu a hierarquia da via no `resultado` **interno** do
Generate (`v.hierarquia`) e saiu **`null` em 4 de 4**. Eu estava a um passo de escrever *"a
hierarquia da via culpada não é observável de fora"* — que é exatamente a forma do item 3 do
LAB-50, e seria **falso**: a hierarquia mora na **SAÍDA**, que é onde o contrato a publica.

É a família do D135 e do D175, e do lado ruim: **o caminho errado não estourou, devolveu
`null`** — e `null` num campo que decide a atribuição vira uma frase publicável. Consertado
lendo `r.saida.vias[].hierarquia` por id, e o comentário no código diz por quê.

---

## 5 · Para o Laboratório de Parcelamento — lista numerada, nada escrito lá

**Nada foi escrito no vizinho.** Os três clones foram conferidos ao fim da rodada e estão
limpos (§4): `motor-testfit` em `4181e95`, `urban-create-hub-41d93a4d` em `5b7e9b4`,
`urban-scout-tool` em `f38dc0c`, `git status` vazio nos três.

1. **A rede viária precisa ser aparada por `util`, e não só pela divisa.** Hoje
   `apararRedeViaria(viasBrutas, terreno.perimetro)` (`motor.ts:247`) é o único aparo, e a
   faixa de `reservarFacesExternas` já saiu de `restante` — então basta aparar pelo polígono
   que o traçado de fato pode usar. **Custo medido: 11 `via-sobre-lote` em `geo-antonina` e
   15 no ensaio convexo**, de 4,65 a 157,4 m² cada, com a via terminando **dentro** de lote
   externo nas quatro culpadas.
2. **O recorte do `aplicarCulDeSac` tem dois buracos declarados** (`formatos.ts:826`): ele
   **só** recorta via `secundaria`, e **não roda** quando `pctCulDeSac = 0`. Medido: **zero
   bulbo de retorno** nas duas glebas, logo nenhuma via foi recortada por `util` nesta
   rodada — e **três das quatro culpadas são `principal`**, que ele nunca recortaria.
3. **`prof` continua não observável de fora** (item 3 do LAB-50, ainda vivo). Publicá-lo em
   `parametrosUsados` custa uma linha e teria poupado este prompt de ler a faixa pelos lotes.

---

## 6 · Entrega

| o quê | onde |
|---|---|
| a ferramenta | [`ferramentas/lab55.ts`](../../external-engines/esteira/ferramentas/lab55.ts) · `bun run lab55` |
| as travas (11) | [`tests/via-sobre-faixa.test.ts`](../../external-engines/esteira/tests/via-sobre-faixa.test.ts) |
| a prova | [`docs/provas/LAB-55/via-sobre-a-faixa.json`](../provas/LAB-55/via-sobre-a-faixa.json) |

A prova **mede gleba**, e traz gleba, motor, semente e contrato — sem exceção a declarar. A
suíte vai de **465 para 476 travas**; o CI sem clones **continua em 114** (a trava nova lê a
prova, mas a ferramenta importa de `@generate` e de `@testfit`, e o arquivo de teste fica
fora daquele trabalho por coerência com o D143).

**Seis sabotagens, seis reprovações:** a sobreposição deixando de ser zero; a via passando a
terminar longe do perímetro; os bulbos aparecendo; toda culpada colada no acesso; o controle
convexo zerando; e a prova deixando de repetir as duas explicações mortas.

## 7 · As decisões

- **D188** — **a faixa reservada é buraco no domínio do LOTE e não é buraco no domínio da
  VIA.** `util` recorta quadra e lote; a rede viária recebe um aparo só, e é contra a
  **divisa** (`apararRedeViaria(vias, terreno.perimetro)`). A prova é a **assimetria** —
  `sobreposicao = 0` ao lado de `via-sobre-lote = 11` —, mais a assinatura do aparo: as
  **quatro** vias culpadas têm as duas pontas a **0 m do perímetro** e uma ponta **dentro de
  um lote externo**, atravessando a faixa em 4 % a 23 % do eixo. *Via que fosse recortada por
  `util` pararia na borda interna da faixa, longe do perímetro;*
- **D189** — **a terceira candidata morre pela ausência de uma violação, e a quarta morre só
  como mecanismo.** O corte degenerado morre porque `sobreposicao = 0`: se `restante` tivesse
  ficado inteiro, o lote teria invadido a faixa. *Violação que NÃO aconteceu é medição — e
  aqui foi ela que matou a candidata.* A do acesso não morre inteira: a pior infratora de
  Antonina passa a 9,6 m do acesso, e eu digo isso em vez de arredondar; o que morre é ela
  como mecanismo, porque em toda gleba há culpada longe (86,7 m e 382,5 m) e no controle a
  pior de todas está a 382,5 m. **A trava que afirmava demais ficou vermelha, e a correção
  foi medir a afirmação certa, não baixar o limiar** (D172);
- **D190** — **a hierarquia da via mora na SAÍDA, não no `resultado` interno do Generate.** Eu
  a li do lugar errado, saiu `null` em 4 de 4, e eu estava a um passo de publicar *"não é
  observável de fora"*. Família do D135 e do D175, no lado ruim: **o caminho errado devolveu
  `null` em vez de estourar**, e `null` num campo que decide a atribuição vira frase
  publicável. Pego dentro do prompt.
