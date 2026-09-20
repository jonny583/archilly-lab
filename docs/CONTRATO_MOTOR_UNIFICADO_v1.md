# CONTRATO DE MOTOR UNIFICADO — v1

**A porta única que qualquer motor precisa cumprir para rodar sob a tela comum
de parcelamento.**

Versão 1 · 19/09/2026 · escrito no **Archilly Lab** (LAB-14), para o **Archilly
Generate** adotar. O Lab não escreve no repositório do Generate: este documento
vai por quem o levou até aqui.

---

## O que este documento é

A família decidiu unificar a interface de parcelamento na tela do Laboratório de
Parcelamento, dentro do repositório do Generate, com **vários motores rodando sob
a mesma tela** — o motor interno do Generate, o do Laboratório de Parcelamento, o
Symbios e os que vierem. Todos visíveis, todos ligados por padrão, motor padrão o
do Laboratório de Parcelamento, escolha do usuário salva, e **só entra no ranking
candidata aprovada pelo Validator** — reprovada aparece com o motivo, não com o
resultado.

Este é o contrato que torna isso possível: **o que o motor recebe, o que ele
devolve, o que ele declara sobre si, e o que ele faz quando não sabe fazer algo.**

**O que ele NÃO é:** um contrato novo. Ele **envelopa** o contrato de motor v1 —
`archilly-motor-entrada` e `archilly-motor-saida` — que já existe, já é
validado por esquema e já atravessou seis prompts de medição. Trocar o contrato
seria jogar fora essa prova. O que falta é o que este documento acrescenta.

**A forma executável** está em
[`external-engines/esteira/src/porta/porta.ts`](../external-engines/esteira/src/porta/porta.ts),
e os três motores a implementam em
[`src/porta/motores.ts`](../external-engines/esteira/src/porta/motores.ts). A
prova está em
[`tests/porta.test.ts`](../external-engines/esteira/tests/porta.test.ts).

---

## 1 · A regra que sustenta tudo

> **O motor declara o que sabe fazer, e o que ele declara é conferível medindo.**

Capacidade que não se pode desmentir é propaganda. Todo campo de `Capacidades`
neste contrato foi escolhido por ser **falsificável**: existe um experimento que
prova a declaração falsa, e o experimento está escrito.

Isso não é rigor decorativo. Numa tela com vários motores lado a lado, o
urbanista compara duas propostas supondo que os dois motores receberam a mesma
coisa. Medido no LAB-13, nas cinco glebas: **três dos quatro concorrentes ignoram
o relevo**, **os quatro ignoram a atração da entrada**, **um não parcela em
lote** e **outro precisa de conserto do Lab** para o contrato aceitar o arquivo.
Nenhuma dessas faltas estava declarada em lugar nenhum. Todas foram descobertas
medindo, uma a uma.

---

## 2 · A ENTRADA — o que o motor recebe

A ENTRADA do contrato de motor v1, inteira, mais uma separação e um campo:

| campo | o que é | de onde vem |
|---|---|---|
| `terreno` | a poligonal da gleba, em metros, com furos | v1 · `gleba` |
| `restricoes` | APP, reserva legal, faixa não edificável, com `desconta` | v1 · `restricoes` |
| `viasDesenhadas` | **rua traçada à mão DENTRO da gleba** — o motor deve segui-la | **novo** · §3 |
| `testadasDeFrente` | **linha sobre a divisa**, onde a gleba encosta numa rua que já existe — o motor deve dar **lote de frente** para ela, nunca rua | **novo** · §3 |
| `atracoes` | o resto das atrações da entrada, como vieram | v1 · `atracoes` |
| `relevo` | curvas de nível, com cota | v1 · `relevo` |
| `acessos` | pontos de entrada do terreno, com papel | v1 · `acessos` |
| `parametros` | área mínima/alvo/máxima de lote, testada, caixas viárias, face de quadra, percentuais | v1 · `parametros` |
| `semente` | a semente da rodada | **explícita** · §5 |
| `geradoEm` | o carimbo que vai na saída, fixo, para a saída ser comparável | v1 |

---

## 3 · A separação que o v1 não faz, e que custou uma medição

**No contrato v1, duas coisas diferentes chegam com o mesmo tipo:**
`atracoes[].tipo = "via_existente"`.

| | o que é | o que o motor deve fazer | o que se mede |
|---|---|---|---|
| **via desenhada à mão** | rua que o urbanista traçou **dentro** da gleba | **seguir** a linha | quanto do comprimento tem eixo gerado a menos de meia caixa |
| **testada de frente** | linha onde a gleba encosta numa rua **que já existe**, sobre a divisa | dar **lote de frente**, e **nunca** rua em cima | quantos lotes têm aresta na linha |

**Perguntar "o motor seguiu esta linha?" a uma testada de frente premia o
defeito:** um motor que pusesse rua exatamente sobre a divisa marcaria 100 % de
aderência estando errado.

Medido em `geo-antonina`, a única das cinco glebas com atração: a única linha é
*"Testada de frente L1"*, 180,2 m, com os **dois extremos a 0,00 m da divisa**. É
testada. E o lote mais próximo de qualquer um dos quatro motores está a **605 m**
dela — nenhum dos quatro lê a atração, e por isso nenhum tinha razão para chegar
lá.

**O que o contrato v1 precisa ganhar:** dois tipos distintos, `via_desenhada` e
`testada_de_frente`, no lugar do `via_existente` único. Enquanto não ganhar, quem
implementa a porta separa **por medição** — a linha cujo ponto médio está a menos
de 1 m da divisa é testada —, e isso é **remendo, declarado como tal**.

---

## 4 · A SAÍDA — o que o motor devolve

| campo | o que é |
|---|---|
| `saida` | o parcelamento na **SAÍDA do contrato de motor v1**, sem mudança. `null` quando o motor recusou |
| `indicadores` | os números, **crus** · §6 |
| `semente` | a semente efetivamente usada. `null` quando o motor não lê semente |
| `geometria` | qual partido de traçado saiu |
| `naoAtendido` | **o que o motor não soube fazer** · §7 |
| `ms` | tempo de parede do motor |

---

## 5 · As capacidades — o que o motor declara sobre si

Cada uma com o experimento que a desmente. **Um motor que declarar errado quebra
o teste**, não passa despercebido.

| campo | o que pergunta | como se desmente |
|---|---|---|
| `entrega` | faz **lote** ou para na **quadra**? | `lote` com saída sem lote, ou `quadra` com lotes |
| `leRelevo` | o traçado muda quando o relevo muda? | mesma gleba com e sem curvas: mudou? |
| `exigeRelevo` | ele **precisa** de relevo para rodar? | sem relevo, ele recusa — ou estoura, que é o proibido |
| `respeitaViaDesenhada` | segue a rua traçada à mão? | via desenhada no miolo: mediu aderência? |
| `respeitaTestadaDeFrente` | dá **lote de frente** para a linha da divisa? | há lote com aresta na testada? |
| `respeitaAcesso` | o traçado nasce do acesso declarado? | muda o acesso: mudou o traçado? |
| `respeitaRestricao` | tira APP e reserva da conta? | tira a APP: a saída mudou? |
| `aceitaSemente` | a semente muda o resultado? | duas sementes: mudou? |
| `determinista` | mesma entrada, mesma saída? | duas rodadas: a **SAÍDA inteira** bate? |
| `calculaGreide` | calcula cota ao longo da via? | a saída traz rampa, ou `null`? |
| `geometrias` | que partidos ele oferece | ao menos um |

**`entrega: "quadra"` não é inferioridade.** Um motor de quadra entrega a etapa
anterior, e quem o puser na tela precisa saber que o lote virá de outro lugar. É
o caso do Symbios: a subdivisão dele é do Lab.

**O vocabulário de `geometrias` é aberto.** Um motor pode declarar um partido que
a lista não prevê, e a tela o mostra como veio. Fechar o vocabulário obrigaria o
contrato a mudar toda vez que um motor inventa um traçado — e contrato que muda
por causa de um motor é o contrário do que ele serve.

---

## 6 · Os indicadores, em número cru

Número cru, e não texto formatado: quem formata é a tela (§9.3 do Padrão
Archilly). E **o que o motor não mede sai `null`, nunca zero** — zero é uma
medição, `null` é "não medido".

| indicador | unidade |
|---|---|
| `lotes` | contagem |
| `areaPrivativa_m2` | m² |
| `areaViaria_m2` | m² |
| `comprimentoDeVia_m` | m |
| `quadras` | contagem |
| `rampaMediaMaxima_pct` | porcento · **e o nome é uma denúncia** |

**Por que "média máxima" e não "máxima".** O contrato v1 carrega
`vias[].rampaMedia_pct` e **nada mais**. `rampaMaxima_pct` só existe na ENTRADA,
como o limite que o usuário pede. Nenhum motor consegue reportar o **pico** por
este contrato — e o pico é o que reprova: o LAB-02 mediu **161 % num cruzamento**,
diluído numa média mansa.

**Pedido ao Generate:** `rampaMaxima_pct` por via na SAÍDA. É o achado que já foi
repassado, e é a razão de este indicador ter um nome feio: o nome feio lembra a
falta.

---

## 7 · O que o motor faz quando não sabe fazer algo

**Três respostas legítimas. A quarta — ignorar em silêncio — é a única
proibida.**

| postura | o que significa | o que a tela faz |
|---|---|---|
| `recusei` | não gerou, e disse por quê | não mostra candidata deste motor |
| `ignorei` | gerou ignorando o que não sabe ler, e disse o que ignorou | mostra a candidata **com a ressalva ao lado** |
| `substitui` | gerou pondo outra coisa no lugar, e disse o quê | idem |

Cada item de `naoAtendido` traz quatro coisas: **o campo** que não soube usar,
**o que chegou** nele, **a postura**, e **a consequência** — escrita em
português, para pessoa, porque quem lê a tela é gente.

**E o motor nunca estoura.** Motor que lança exceção derruba a tela comum, e numa
tela com vários motores lado a lado ele derruba os outros junto. O que ele não
consegue fazer volta como `recusei`, com a razão escrita.

**Isto não é preferência de estilo.** O teste da porta rodou a gleba plana contra
os quatro motores e o Symbios **estourou** — *"tem 0 vértices cotados; o mapa de
alturas pede pelo menos 3"*. Não era defeito dele: era **exigência não
declarada**. Virou o campo `exigeRelevo`, e a exceção virou recusa.

---

## 8 · O que o Validator decide, e o que ele não decide

**Só entra no ranking candidata aprovada pelo Validator.** A reprovada aparece
**com o motivo**, não com o resultado.

O Validator é o do Generate, sem versão leve e sem limiar mais frouxo por o motor
ser de fora. Um motor externo julgado por régua mais frouxa que a do motor da
casa é comparação que não vale.

**O que o Validator não decide:** qual motor é melhor. Ele diz o que é ilegal, e
o Judge ordena o que é legal. Qual traçado serve ao terreno é escolha de quem
desenha.

---

## 9 · A prova de que este contrato é implementável

Não é este documento. São **quatro implementações e treze experimentos**, em
`external-engines/esteira/`:

| motor | `entrega` | `leRelevo` | `aceitaSemente` | `calculaGreide` | `exigeRelevo` |
|---|---|---|---|---|---|
| Generate · ortogonal | lote | não | não | não | não |
| Generate · espinha | lote | não | não | não | não |
| Laboratório de Parcelamento | lote | não | sim | não | não |
| Symbios + subdivisão do Lab | lote | **sim** | sim | **sim** | **sim** |

Todas as onze linhas de cada declaração são conferidas contra o comportamento
medido, motor por motor, a cada `bun test`. **Os dois defeitos que este teste
achou viraram campos do contrato** — `exigeRelevo` e a proibição de estourar.

---

## 10 · O que este contrato ainda não resolve

Escrito aqui para não se perder, e porque contrato que esconde o próprio buraco é
pior que contrato incompleto:

1. **`via_existente` ainda quer dizer duas coisas** no v1. Enquanto não houver
   tipo separado, quem implementa a porta separa por medição — remendo (§3).
2. **`rampaMaxima_pct` não existe na SAÍDA** do v1. O pico, que é o que reprova,
   não tem como viajar (§6).
3. **A declaração pode estar incompleta.** Um motor pode saber fazer algo que o
   contrato não pergunta, e ninguém saberá. O contrato cresce quando alguém mede
   uma falta — foi assim que `respeitaTestadaDeFrente` e `exigeRelevo` nasceram.
4. **Nada aqui fala de tela.** Ordem dos motores, cores, o que fica ligado por
   padrão: é do Generate e do Jonny. Este contrato para na porta.
5. **A hidrografia se perde pelo caminho, e isso torna uma regra do Jonny
   incumprível.** A D69 diz *"nascente nunca — raio de 50 m intocável"*. Medido:
   `app_nascente` existe no `archilly-terreno` (o formato do Geo) **e** no
   importador do Generate, com rótulo e uso próprios — mas o **enum de
   `restricoes` do contrato v1 não o tem**, e a nascente é achatada em
   `app_hidrica`. O motor recebe um polígono igual a qualquer outra APP e **não
   tem como saber** qual é nascente, nem onde está o ponto dela para medir os
   50 m. O mesmo vale para o **eixo do curso d'água**, que a D61 pede para
   traçar a travessia perpendicular e que chega só como polígono.

   **Pedido ao Generate, com as duas partes:** `app_nascente` como tipo próprio
   no enum, e a **geometria de ponto** da nascente e de **linha** do curso, além
   do polígono da APP. Enquanto não vierem, a exceção que o Jonny declarou como
   a mais dura de todas é a única que o contrato não deixa cumprir.
