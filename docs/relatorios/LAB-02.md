# LAB-02 — RECORTE PELA GLEBA E PELAS RESTRIÇÕES

**Data:** 14/09/2026 · **Motor:** Symbios Tensor 0.4.1 · **Semente:** 20260913
**Régua:** o Validator e o Judge do **Generate**, pelo contrato de motor v1

---

## Veredito

> ### A meta foi atingida: **0 % de via fora da gleba**, nas três glebas.

E mais do que a meta: **0 % de via dentro de restrição que desconta**, e o
contrato de motor sai de **recusado** para **aceito com zero violações** nas
três. O que o LAB-01 deixou como a segunda das três ressalvas está resolvido.

| gleba | via fora da gleba | via em restrição | contrato |
|---|---|---|---|
| `completo` · 141,8 ha | **37,43 % → 0,00 %** | **19,55 % → 0,00 %** | recusado → **aceito, 0 violações** |
| `sintetico-50ha-ondulado` · 50 ha | **38,73 % → 0,00 %** | — (sem restrição) | recusado → **aceito, 0 violações** |
| `sintetico-10ha-plano` · 10 ha | **42,80 % → 0,00 %** | — (sem restrição) | recusado → **aceito, 0 violações** |

**O que o recorte custa, medido:**

1. **Comprimento.** A rede encolhe para 43 %, 61 % e 57 % do original. Não é
   perda: é a parte que nascia fora da terra do empreendimento.
2. **Conectividade.** O maior componente cai de 99,9 % para 97,6 % (`completo`),
   de 99,8 % para 98,0 % e de 99,4 % para 94,7 %. **O recorte não estilhaça a
   rede** — era o risco que o LAB-01 mandou conferir.
3. **Nada.** Rampa, quadra e cota ficam como o motor as fez.

**As três ressalvas que ficam, e nenhuma é do recorte:**

1. **A rampa nos cruzamentos não mudou** — 161,38 %, 64,10 % e 15,44 %, idênticas
   antes e depois. Recortar não conserta greide, e o LAB-01 já dizia que o
   defeito é estrutural (§4).
2. **E ninguém confere essa rampa.** O Generate **tem** a régua — 10 % máximo,
   12 % tolerado em trecho curto — mas ela roda no plano interno dele, não no
   caminho do motor externo. Somado a isso, o contrato só carrega a rampa
   **média** por via: um pico de 161 % num cruzamento é diluído até sumir (§5).
3. **O Symbios não roda nas duas glebas-padrão do Generate** — elas não têm
   relevo. É o LAB-03 (§6).

---

## 1 · O que foi construído

```text
ENTRADA v1 ──glebaParaOSymbios()──▶ Terreno ──gerarRedeViaria()──▶ vias + quadras
                                                                        │
                                              recortarPelaGleba() ◀─────┘
                                                      │ corta pelo perímetro
                                                      │ corta pelas restrições
                                                      ▼
                                   symbiosParaOContrato() ──▶ SAÍDA v1
                                                      │
                          Validator + Judge DO GENERATE ◀─┘
```

| peça | onde | o que faz |
|---|---|---|
| o recorte | `external-engines/symbios/adapter/src/recorte.ts` | corta eixo pela gleba e pelas restrições, com cota interpolada |
| ENTRADA v1 → `Terreno` | `external-engines/esteira/src/gleba-v1.ts` | a porta única, para os dois motores comerem do mesmo prato |
| terrenos do Lab → ENTRADA v1 | `external-engines/esteira/src/gleba-do-lab.ts` | |
| Symbios → SAÍDA v1 | `external-engines/esteira/src/symbios-para-contrato.ts` | |
| a medição | `external-engines/esteira/ferramentas/lab02.ts` | |
| testes (14, verdes) | `external-engines/esteira/tests/recorte.test.ts` | |

**`external-engines/esteira/` é pasta nova** (D31). O julgamento não é
propriedade de nenhum dos dois adaptadores, e o LAB-08 vai precisar dos dois
motores na mesma tabela; pôr a comparação dentro da pasta de um deles seria
arquivar errado desde o primeiro dia.

---

## 2 · O recorte, peça por peça

### O que bloqueia não é escolha do Lab

Quais restrições barram a rua **vem do dado**, não de uma lista que eu escrevi:
o campo `desconta` que o Geo já carimba, e que o contrato dele define como
*"esta área desconta da área líquida"*. Terra que não entra na área líquida não
recebe asfalto. Escrever aqui uma lista de categorias proibidas seria inventar
regra urbanística, que é do Jonny.

Em `completo` isso pegou três áreas, 34,4 ha ao todo:

| restrição | área |
|---|---|
| `app_rio` | 5,1 ha |
| `app_declividade` | 0,9 ha |
| `reserva_legal` | 28,4 ha |

### Por que não é o `apararVias` do LAB-07

O aparo do outro adaptador recorta um **segmento de dois pontos** e fica com o
maior pedaço — devolver dois inventaria uma via que o motor não desenhou. Aqui a
via é uma **polilinha** de dezenas de vértices cotados, e quando ela sai e volta
a entrar **os dois trechos de dentro são estrada que o motor desenhou**. Ficar
só com o maior jogaria fora rua de verdade.

Então aqui todo trecho livre sobrevive, com id próprio, e a fragmentação vira
número: 10 vias partidas em `completo`, 1 em `sintetico-50ha`, 0 em
`sintetico-10ha`.

### A cota no ponto de corte

Interpolada **linearmente entre as duas cotas conhecidas daquele segmento** —
que é exatamente a superfície que o motor assume entre dois nós. Reamostrar o
mapa de alturas daria ao ponto novo uma cota fora da reta entre os vizinhos,
criando um degrau e uma rampa que o motor nunca produziu. Um teste trava isso:
nenhum trecho cortado pode ter rampa maior que a da via de origem.

### As lascas

Cortar produz fragmentos curtos. Medidos: **3 trechos abaixo de 5 m em
`completo`, somando 4,87 m**; zero nas outras duas. Não descartei nenhum —
descartar exigiria um limiar, e limiar é regra. Ficam medidos.

---

## 3 · A tabela completa

| | `completo` | `sintetico-50ha-ondulado` | `sintetico-10ha-plano` |
|---|---|---|---|
| área | 141,8 ha | 50,0 ha | 10,0 ha |
| tempo | 4 644 ms | 1 365 ms | 467 ms |
| **trechos** | 498 → 287 | 150 → 111 | 14 → 11 |
| descartados inteiros | 225 | 40 | 3 |
| partidos em dois ou mais | 10 | 1 | 0 |
| **comprimento** | 90 203 → 38 840 m | 29 347 → 17 980 m | 3 381 → 1 937 m |
| **fora da gleba** | 37,43 % → **0 %** | 38,73 % → **0 %** | 42,80 % → **0 %** |
| **em restrição** | 19,55 % → **0 %** | — | — |
| quadras | 678 → 533 | 164 → 135 | 5 → 5 |
| quadras atravessando a divisa | 73 | 36 | 3 |
| **componentes** | 13 → 29 | 7 → 11 | 3 → 4 |
| **no maior componente** | 99,9 % → **97,6 %** | 99,8 % → **98,0 %** | 99,4 % → **94,7 %** |
| comprimento isolado | 939 m | 361 m | 103 m |
| lascas (< 5 m) | 3 (4,87 m) | 0 | 0 |
| **contrato** | recusado → aceito | recusado → aceito | recusado → aceito |
| **violações do Validator** | **0** | **0** | **0** |

A recusa de antes era sempre a mesma, e de formato: *"224 peça(s) do
parcelamento saem da gleba"*, *"89 peça(s)"*, *"12 peça(s)"*.

---

## 4 · A rampa nos cruzamentos — o outro número do LAB-01

| | `completo` | `sintetico-50ha` | `sintetico-10ha` |
|---|---|---|---|
| **máxima em cruzamento, antes** | 161,38 % | 64,10 % | 15,44 % |
| **máxima em cruzamento, depois** | **161,38 %** | **64,10 %** | **15,44 %** |
| mediana de todas as arestas | 10,00 % | 9,98 % | 1,14 % |
| p99 | 27,22 % | 12,65 % | 10,01 % |
| arestas acima de 10 %, antes → depois | 612 → 246 | 81 → 51 | 1 → 1 |

**O recorte não conserta rampa**, e não deveria: ele corta no plano, não no
perfil. As arestas ruins que somem são as que ficavam fora da gleba. O máximo
não se move um centésimo — é a mesma aresta, no mesmo cruzamento.

Isso confirma o LAB-01: o clamp do motor opera por cadeia, e um nó compartilhado
por várias cadeias não pode ser movido sem quebrar as outras.

### Um cuidado de medição que custou uma conclusão errada

A primeira versão classificava cada aresta pelo grau do nó **na rede que estava
sendo medida**. O resultado foi uma manchete falsa: *"a rampa ao longo da via
piorou de 10,01 % para 34,98 % depois do corte"*.

Medido: aquela aresta **sempre teve 34,98 %**. Ela encostava num cruzamento e
era contada como aresta de cruzamento; o corte levou embora a via que fazia o
cruzamento, e ela mudou de balde. Nada piorou — a régua trocou de gaveta.

Por isso a tabela acima traz também a distribuição sobre **todas** as arestas,
que é imune à troca de balde e comparável sempre.

---

## 5 · O achado que sai deste prompt: ninguém confere a rampa

O LAB-01 decidiu, e está escrito lá: *"o Adapter não corrige; a conferência é do
Validator"*. **Fui conferir se o Validator confere. Não confere.**

- `src/lib/engine/invariantes.ts` do Generate — o Validator que julga um
  parcelamento externo — tem **onze tipos de violação**, todos geométricos
  (sobreposição, faixa-legal, testada, frente, massa, via-sobre-lote,
  face-quadra, polígono-não-simples, fora-do-contorno, id-repetido). **Nenhuma
  menção a rampa, declividade ou greide.**
- A régua **existe** no Generate, em `src/lib/engine/topografia.ts`:
  `LIMITES_TOPOGRAFIA.rampaMaxPct = 10`, `rampaToleradaPct = 12` para trecho
  curto, e a função `rampasDoEixo`. Mas ela é chamada sobre
  `plano.rede.principal` / `plano.rede.secundarias` — a estrutura **interna** do
  motor dele. A saída de um motor externo nunca passa por ali.
- E mesmo que passasse: o contrato de motor v1 carrega, por via, apenas
  **`rampaMedia_pct`**. Um pico de 161 % num cruzamento, dentro de uma via de
  centenas de metros, é diluído pela média até desaparecer. **O contrato não tem
  canal para a rampa de trecho.**

É a prova disso nesta rodada: as três glebas passaram com **zero violações**
tendo 246, 51 e 1 arestas acima de 10 %.

**Para o chat repassar ao Generate**, e são duas coisas distintas:

1. **A régua de rampa não alcança motor externo.** Ou `invariantes.ts` ganha a
   conferência, ou o caminho externo chama `rampasDoEixo` — ele já existe e já
   tem os limites certos.
2. **O contrato precisa de um canal para a rampa de trecho.** Sugestão medida, e
   é de uma linha: `rampaMaxima_pct` por via, ao lado da média que já existe.
   Sem ele, nenhuma conferência de rampa é possível sobre o contrato, por mais
   completo que o Validator fique.

---

## 6 · O Symbios não come as glebas-padrão do Generate

Tentei as três glebas do LAB-07 e duas não rodam:

| gleba | curvas de nível | vértices cotados | resultado |
|---|---|---|---|
| `ensaio-47ha` | **0** | **0** | recusa: *"tem 0 vértices cotados; o mapa de alturas pede pelo menos 3"* |
| `geo-antonina` | **0** | **0** | mesma recusa |

Não é falha da ponte: o Symbios **é** um motor de campo tensorial sobre mapa de
alturas. Sem cotas não há campo, e o adaptador recusa em vez de fabricar um
terreno plano e fingir que mediu alguma coisa. A perda sai declarada na ida,
com gravidade alta.

O LAB-07 já tinha registrado que as duas glebas-padrão não carregam topografia.
O LAB-02 mostra a consequência: **enquanto elas não tiverem relevo, os dois
motores não podem ser comparados na mesma gleba** — que é exatamente o que o
LAB-08 pede. É o LAB-03, e ele agora tem uma razão medida para existir.

Por isso o trio deste prompt é outro, e cada uma está aqui por um motivo:

| gleba | por que |
|---|---|
| `completo` | a única com **restrição de verdade** — sem ela, "recortar pelas restrições" não teria o que morder |
| `sintetico-50ha-ondulado` | a gleba do LAB-01 e do LAB-07: **relevo forte**, e o elo com as duas medições anteriores |
| `sintetico-10ha-plano` | o extremo oposto: quase sem desnível, onde o campo tensorial degenera para grade |

---

## 7 · O outro motor: o que o aparo do LAB-07 não olhava

"Violações por partido" é vocabulário do outro motor — o Symbios não tem partido
de traçado, tem campo tensorial. **A tabela por partido do LAB-07 continua
valendo** e não foi refeita: ela já media a rede aparada pelo perímetro.

O que o LAB-02 acrescenta é a segunda lâmina, que ninguém tinha passado: **o
aparo do LAB-07 corta pelo perímetro e não olha para as restrições.** Em
`geo-antonina` há 3 APP hídricas que descontam. Medi a melhor variante daquele
relatório contra elas:

| | medido |
|---|---|
| via dentro de APP | **894,63 m** de 19 471 m — **4,59 %** |
| lotes tocando APP | **44** de 1 429 — **3,08 %** |
| área desses lotes | **1,76 ha** |

**Quarenta e quatro lotes encostando em área de preservação permanente**, num
arquivo que passou no contrato. O contrato é explícito sobre o tamanho disso:
*"contar APP como terra vendável é o erro mais caro de um estudo de
viabilidade"*.

A correção é conhecida e está escrita: o aparo tem de olhar restrição, como o
recorte do Symbios passou a olhar. **Entra na lista do T02 do outro motor**, e
o trabalho já está feito de um lado — `recorte.ts` mostra a forma.

---

## 8 · O que não foi feito, e por quê

- **Quadra que atravessa a divisa não é recortada.** Uma quadra inteiramente
  fora é descartada (inequívoco, não inventa geometria); uma que atravessa
  precisaria de interseção polígono × polígono côncavo, e recortá-la mudaria a
  área dela, que é número que o Validator mede. O contrato já trata quadra fora
  da divisa como **exceção declarada** — vira aviso, não recusa, e nesta rodada
  não gerou nem aviso. Ficam medidas: 73, 36 e 3. **Proposta ao chat**, não
  decisão minha.
- **Lote não existe neste motor**, então não há o que recortar. O Judge marca
  `numLotes: 0`, e é verdade: enquanto não houver subdivisão de quadra (o
  LAB-04, o straight skeleton), o Symbios entrega a etapa anterior à do outro
  motor. Não é falha da ponte, e está declarado como perda.
- **A rampa não foi corrigida.** O LAB-01 proibiu, e continua certo: se o
  Adapter consertar geometria, o LAB-03 compara o conserto do Lab com o motor
  Geométrico, não o Symbios.

---

## 9 · Perdas na ida e na volta

### Ida — a ENTRADA v1 tem o que o Symbios não consome

| campo | gravidade | o que acontece |
|---|---|---|
| `relevo.curvas` vazio | **alta** | o mapa de alturas nem se monta — §6 |
| `acessos` | alta | o Symbios não ancora a rede em entrada nenhuma |
| `atracoes` | alta | não há onde pendurar um ímã num campo tensorial |
| `restricoes[].geometria` em linha ou ponto | alta | sem área não dá para bloquear sem inventar largura de faixa |
| `parametros` de lote | média | o motor não parcela |
| `crs.origemGeografica` nulo | média | a saída fica em metros locais |

### Volta — o Symbios tem o que o contrato não recebe

| campo | gravidade | o que acontece |
|---|---|---|
| `lotes` | **alta** | não existem: o motor não subdivide quadra |
| `areasEspeciais` | média | o motor não conhece lazer, doação nem institucional |
| `quadroDeAreas.areaViaria_m2` | média | o motor devolve **eixo**, não leito: a área é comprimento × faixa, e o cruzamento é contado duas vezes |

Ao contrário do outro motor, **`rampaMedia_pct` viaja preenchida**: o Symbios
mede greide. Um teste trava isso.

---

## 10 · Reproduzir

```sh
cd external-engines/esteira
bun install
bun run lab02       # docs/provas/LAB-02/
bun test            # 14 testes
bun run typecheck && bun run lint
```

Saídas: `docs/provas/LAB-02/medicoes.json` (números crus, com gleba, motor,
semente e versão do contrato em cada registro) e a SAÍDA cortada de cada gleba,
para o LAB-08 e para o Generate poderem julgar de novo.

**Uma alteração no adaptador do LAB-01**, só de tipo: `Motor.carregar` passou a
compilar e instanciar em dois passos. Comportamento idêntico — a forma curta faz
isso por dentro —, mas a forma longa não é ambígua quando dois conjuntos de
tipos (Node no adaptador, Bun na esteira) olham o mesmo arquivo.

---

## 11 · O que o LAB-03 recebe

1. **A razão medida para existir**: sem relevo nas glebas-padrão, os dois
   motores não pisam na mesma terra, e o LAB-08 fica impossível.
2. **A porta única já construída**: `glebaParaOSymbios` e `glebaDoLab`. Uma
   gleba-padrão com relevo é um arquivo a mais, não um caminho a mais.
3. **O número de rampa para comparar**: 161,38 % / 64,10 % / 15,44 % no
   cruzamento, com a interpolação atual. O LAB-03 troca a interpolação e mede de
   novo — e a tabela do §4 é o antes.
