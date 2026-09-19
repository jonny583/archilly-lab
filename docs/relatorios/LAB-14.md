# LAB-14 — A PORTA ÚNICA, E A PROVA DE QUE ELA É IMPLEMENTÁVEL

**Data:** 19/09/2026 · **Entrega:**
[`../CONTRATO_MOTOR_UNIFICADO_v1.md`](../CONTRATO_MOTOR_UNIFICADO_v1.md)
**Prova:** os quatro motores implementando a porta na esteira, e **treze
experimentos** que desmentem quem declarar errado

---

## O resultado em uma frase

**O contrato está escrito, os quatro motores o implementam, e cada capacidade que
eles declaram é desmentida por medição se for falsa** — o que fez o próprio teste
achar dois defeitos que viraram cláusula.

---

## 1 · A regra que sustenta o contrato inteiro

> **O motor declara o que sabe fazer, e o que ele declara é conferível medindo.**

Capacidade que não se pode desmentir é propaganda. Cada campo de `Capacidades`
foi escolhido por ser **falsificável**, e o experimento que o falsifica está
escrito em `tests/porta.test.ts`:

| campo | como se desmente |
|---|---|
| `entrega` | `lote` com saída sem lote, ou `quadra` com lotes |
| `leRelevo` | mesma gleba com e sem curvas de nível: mudou? |
| `exigeRelevo` | sem relevo, ele recusa — ou estoura, que é o proibido |
| `aceitaSemente` | duas sementes diferentes: mudou? |
| `determinista` | duas rodadas: a **SAÍDA inteira** bate? |
| `respeitaViaDesenhada` | via desenhada no miolo: ele a seguiu? |
| `respeitaTestadaDeFrente` | há lote com aresta na testada? |
| `respeitaRestricao` | tirar a APP muda a saída? |
| `calculaGreide` | a rampa vem em número, ou vem `null`? |

**Um motor que declarar errado quebra o teste.** É a diferença entre declaração e
propaganda.

---

## 2 · Os dois defeitos que o próprio teste achou

Os dois são a razão de esta prova valer mais que o documento.

### 2.1 · O Symbios **estourava** em gleba sem relevo

O experimento do `leRelevo` roda a mesma gleba com e sem curvas de nível. Sem
elas, o Symbios não devolveu resultado nenhum — **lançou exceção**:

```text
o terreno "Gleba Sintética 10 ha (plano)" tem 0 vértices cotados;
o mapa de alturas pede pelo menos 3 — sem relevo o traçador degenera
```

**Não é defeito dele: é exigência.** E exigência não declarada, numa tela com
vários motores lado a lado, é tela em branco na frente do urbanista — pior,
**motor que estoura derruba os outros junto**.

Virou duas cláusulas:

- **`exigeRelevo`**, campo novo de `Capacidades`;
- **a porta proíbe estourar**: o que o motor não consegue fazer volta como
  `postura: "recusei"`, com a razão escrita. Um teste trava isso.

### 2.2 · A rampa máxima **não existe** na saída do contrato

O experimento do `calculaGreide` reprovou o Symbios, que é o único dos quatro que
mede greide. Medido antes de atribuir: o defeito era do indicador, não do motor.

O contrato v1 carrega `vias[].rampaMedia_pct` e **nada mais**. `rampaMaxima_pct`
existe só na ENTRADA, como o limite que o usuário pede. **Nenhum motor consegue
reportar o pico por este contrato** — e o pico é o que reprova: o LAB-02 mediu
**161 % num cruzamento**, diluído numa média mansa.

O indicador passou a se chamar **`rampaMediaMaxima_pct`**, e o nome feio é
proposital: ele lembra a falta toda vez que alguém o lê. É achado já repassado ao
Generate, e agora está pedido no documento com o número ao lado.

---

## 3 · O que o LAB-13 entregou ao contrato

Os três itens que a medição do prompt anterior fez aparecer, e o que cada um
virou:

| o que o LAB-13 mediu | o que virou no contrato |
|---|---|
| `via_existente` quer dizer **duas coisas** — via desenhada à mão e testada de frente, com o mesmo tipo | dois campos separados na ENTRADA da porta, e o pedido de dois tipos no v1 (§3 do documento). Enquanto não vier, a separação é **por medição** — remendo declarado |
| a tabela só é legível porque cada linha carrega **o que aquele motor ignorou** | `Capacidades`, declarada pelo motor, em vez de conhecimento escrito à mão em cada adaptador |
| "não sei fazer" não tinha lugar | `naoAtendido`, com **campo, o que chegou, postura e consequência**. Três posturas legítimas; **ignorar em silêncio é a única proibida** |

---

## 4 · Os quatro motores, declarados

Todas as onze linhas de cada declaração são conferidas contra o comportamento
medido, a cada `bun test`.

| motor | entrega | lê relevo | exige relevo | semente | greide | geometrias |
|---|---|---|---|---|---|---|
| Generate · ortogonal | lote | não | não | não | não | 1 |
| Generate · espinha | lote | não | não | não | não | 1 |
| Laboratório de Parcelamento | lote | não | não | **sim** | não | **10** |
| Symbios + subdivisão do Lab | lote | **sim** | **sim** | **sim** | **sim** | 1 |

Duas linhas que valem comentário:

- **o Symbios declara `entrega: "lote"` e isso não é mentira.** A porta é da
  dupla — motor mais a subdivisão do Lab —, e o nome dela diz isso. Quem quiser o
  motor sozinho o encontra declarando `entrega: "quadra"`. O campo existe
  justamente para essa diferença caber no contrato (D50);
- **o do Parcelamento declara `substitui` no aparo.** O aparo é conserto **do
  Lab**, não do motor, e sem ele o contrato recusaria o arquivo. Declará-lo é o
  que impede alguém de ler a candidata dele como passagem limpa.

---

## 5 · O que ficou provado

- **93 testes verdes** na esteira, dos quais **13 são a prova da porta** e 13 a
  régua do LAB-13; 14 no adaptador do motor de parcelamento;
- **os quatro implementam a porta de verdade**, não por herança de tipo: cada um
  roda, declara e é conferido;
- **nenhum estoura**: a gleba plana, que derrubava o Symbios, hoje devolve recusa
  declarada;
- **`tsc --noEmit` e `eslint` limpos** nos dois projetos;
- **nada foi escrito em repositório vizinho** — `git status` limpo nos três
  clones. O contrato vai ao Generate **pelo chat**, como o prompt mandou.

---

## 6 · O que o contrato ainda não resolve

Está escrito no §10 do próprio documento, porque contrato que esconde o próprio
buraco é pior que contrato incompleto:

1. **`via_existente` ainda quer dizer duas coisas** no v1;
2. **`rampaMaxima_pct` não existe na SAÍDA** do v1 — o pico não viaja;
3. **a declaração pode estar incompleta**: um motor pode saber fazer algo que o
   contrato não pergunta. O contrato cresce quando alguém mede uma falta — foi
   assim que `respeitaTestadaDeFrente` e `exigeRelevo` nasceram;
4. **nada aqui fala de tela.** Ordem dos motores, cores, o que fica ligado por
   padrão: é do Generate e do Jonny. Este contrato para na porta.
