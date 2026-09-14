# ONDE PARAMOS

> Para retomar numa nova sessão, diga:
>
> **"leia docs/ONDE_PARAMOS.md e me diga onde estamos"**

**Última atualização:** 14/09/2026 · **Último prompt executado:** LF-FINAL
**Estado:** **fila esgotada, aguardando o chat.** O despertador de 60 minutos
foi apagado, como a própria fila manda.

---

## Em uma frase

**Os dois motores atravessam o Lab de ponta a ponta, julgados pela régua do
Generate, e a fila que o chat escreveu acabou.** O Symbios entrega rede viária e
quadras com **zero violações** e 0 % de via fora da divisa, mas **não faz lote**;
o motor de parcelamento, depois do T02, passa no contrato **sem precisar do
conserto do Lab** e chega a zero violações no melhor partido. O que sobra são
três achados para o chat repassar e cinco propostas na fila.

## A fila — esgotada

Roteiro em [`prompts/FILA.md`](prompts/FILA.md). Tudo executado em 14/09:

| Prompt | Estado |
|---|---|
| **LF-01** — casa em ordem | concluído em 14/09/2026 |
| **LAB-02** — recorte pela gleba e pelas restrições | concluído em 14/09/2026 |
| **LAB-03** — relevo: interpolação medida, glebas-padrão com relevo | concluído em 14/09/2026 |
| **LAB-08** — Testfit × Symbios, lado a lado | concluído em 14/09/2026 |
| **LF-FINAL** — conferência contra o Padrão | **concluído em 14/09/2026** |

Antes disso: **LAB-00** (09/09), **LAB-01** (10/09) e **LAB-07** (13/09).
**LAB-04, LAB-05 e LAB-06** da fila antiga continuam de pé e não foram
executados — o LAB-04 virou proposta de prioridade, ver abaixo.

## O que espera o chat

Está em [`prompts/FILA.md`](prompts/FILA.md), seção *proposto ao chat*:

1. **O delta contra o Padrão 1.2**, quando ele existir — **a versão 1.2 não
   existe em nenhum repositório legível**; a conferência foi feita contra a
   Versão 1. O `TF-FINAL` do repositório irmão está travado pela mesma razão.
2. **A ressalva do §9.3** — 17 `toFixed` no núcleo, todos em prosa para pessoa
   (avisos, erros, `Perda.oQueHavia`). O dado que viaja está cru. Aperta ou não?
3. **LAB-04 · straight skeleton** — virou o próximo passo óbvio do Symbios: ele
   entrega 94 e 698 quadras limpas, e o que falta para disputar o Judge é
   subdividir quadra em lote.
4. **Reconectar a rede depois do corte** — `geo-antonina` fragmenta a 70,4 %.
5. **Recortar a quadra que atravessa a divisa** e **descartar lasca de corte**.

## Os três achados que ainda não foram repassados

Nenhum é pendência do Jonny — **são do chat**, por decisão dele:

1. **GENERATE · ninguém confere a rampa** de um motor externo. `invariantes.ts`
   tem onze violações, todas geométricas; a régua existe em `topografia.ts`
   (10 %/12 %) mas roda só no plano interno; e o contrato só carrega
   `rampaMedia_pct`, que dilui um pico de 161 % num cruzamento. Pede
   `rampaMaxima_pct` por via. *(LAB-02, §5)*
2. **GENERATE · o quadro de áreas de `ensaio-47ha` não fecha** — soma 544 498 m²
   numa gleba de 470 000 (+15,8 %), porque `areaAPP_m2` é exatamente 15,0 % da
   gleba e `areaLazer_m2` exatamente 10,0 % — ecos dos parâmetros — **numa gleba
   que declara zero restrições**. Em `geo-antonina` o mesmo quadro fecha.
   *(LAB-08, §2)*
3. **GENERATE · a interpolação de relevo faz o traçado virar grade** e, em
   terreno plano, inventar curva onde não há. É o argumento que faltava no
   diagnóstico do LAB-07. Correção: exigir vizinhos de duas cotas distintas.
   *(LAB-03)*

E uma proposta: **adotar `docs/fixtures/glebas-padrao-com-relevo/`** — as duas
glebas-padrão não têm topografia e são inúteis para qualquer motor que leia
relevo.

## O laço autônomo — desligado

O despertador `trig_01DFdwqF4nUDLQAod5w4WH1m` (minuto :05, de hora em hora) foi
**apagado** no fim do LF-FINAL, porque a fila acabou. Era a regra escrita na
própria fila. Quando o chat mandar prompt novo, um despertador novo se cria.

**Limitação que vale registrar para a próxima vez:** aquele despertador nasceu
**sem conectores do GitHub**. As sessões que ele acordou tiveram sorte — as
ferramentas estavam disponíveis —, mas o prompt dele carregava o contorno (mesclar
por `git merge --no-ff`) justamente porque isso podia faltar. Um despertador
criado pela interface do claude.ai não tem esse problema.

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
