# LAB-22 — o que falta medir em cada motor, e a lacuna que era minha

**Data:** 03/10/2026 · **Semente:** 20260913
**Entrega para o chat:** [`docs/O_QUE_FALTA_MEDIR_POR_MOTOR.md`](../O_QUE_FALTA_MEDIR_POR_MOTOR.md)
**Testes:** `tests/porta.test.ts` — 14 (1 novo) · a esteira inteira

---

## Em uma frase

**O prompt pedia para escrever o que falta a cada motor, e a medição mudou a
lista:** o Laboratório de Parcelamento **mede a rampa desde 14/09**, e quem a
jogava fora era **a ponte do Lab** — a mesma que eu usei no LAB-18 para reportar
ao chat que *"o Parcelamento não reporta o pico"*.

---

## 1 · A lacuna que era minha

**O que eu ia escrever:** *"o Laboratório de Parcelamento não reporta o pico;
ainda escreve saída v1"*.

**O que eu medi, antes de escrever:**

| onde | o que está lá |
|---|---|
| `motor-testfit/src/lib/lab/relevo.ts` | `rampaDaVia` devolve **`media_pct` e `maxima_pct`**, desde o **T03 dele, de 14/09/2026** |
| `motor-testfit/src/lib/lab/motor.ts:245` | preenche **as duas** em cada via do `Plano`, quando há cota |
| `archilly-lab/external-engines/testfit/adapter/src/volta.ts:131` | **`rampaMedia_pct: null`**, com a justificativa *"o motor não calcula greide"* |

**A frase do meu adaptador era verdadeira quando foi escrita, no LAB-07, e
deixou de ser um dia depois.** Ficou três semanas, e no LAB-18 eu a repassei ao
chat como fato sobre o vizinho.

**O conserto:** a ponte lê as duas rampas e escreve saída **v2**. E a perda
declarada mudou de dono — onde dizia *"o motor não calcula greide"* agora diz
*"sem cota na ENTRADA ele devolve `null`, que é a resposta certa; a falta é da
gleba, não do motor"* (**D98**).

**É a terceira vez que a disciplina do §6 me pega:** a D75 (vértices em vez de
amostras, no LAB-17), a D93/D94 (o mesmo erro em régua diferente, no LAB-21) e
agora esta. **As três vezes eu estava a um passo de acusar o motor de outro
repositório.**

---

## 2 · O que a correção revelou: os dois que reportam, reportam errado

| motor | método | passo efetivo | direção do erro |
|---|---|---|---|
| **Symbios** (adaptador do Lab) | vértice a vértice | **0,47 m** (mediana) | **superestima** |
| **Parcelamento** (motor) | **12 amostras por via, fixo** | **83 a 157 m** | **subestima** |

**A causa é a mesma:** o passo não está amarrado à resolução do modelo de relevo,
cuja célula é de **5 m**. Um mede **1/10 da célula**; o outro, **17 a 31 células**.

| gleba | Parcelamento declara | o Lab mede | |
|---|---:|---:|---|
| `completo` | **16,84 %** | **51,54 %** | subestima **3,1×** |
| `sintetico-50ha-ondulado` | 10,15 % | 18,79 % | subestima 1,9× |

E o Symbios, na direção oposta, superestimava de **2,5× a 7,9×** (D94).

**Nenhum dos dois erros é visível sem uma segunda régua**, e os dois têm a cara
de um número certo. É a melhor justificativa que a D92 podia receber: **duas
réguas lado a lado, nunca somadas** (**D99**).

---

## 3 · A declaração de capacidade envelheceu sozinha — e o teste a pegou

No instante em que a ponte passou a carregar a rampa, **três testes de
falsificação do LAB-14 ficaram vermelhos**:

```
parcelamento declarou NÃO ler relevo e a saída mudou
parcelamento declarou NÃO calcular greide — recebido 0.756
```

**Isso é o teste funcionando**, não quebrando. O Parcelamento declarava
`calculaGreide: false` e `leRelevo: false`; as duas eram verdade em 13/09 e
**passaram a ser mentira em 14/09, porque o motor melhorou**. Nenhuma pessoa
mexeu na declaração; ela apodreceu no lugar.

**É o melhor argumento que tenho a favor de declaração falsificável:** ela não
depende de alguém lembrar.

### 3.1 · E `leRelevo` precisou ser partida em duas

Ao consertar a declaração, apareceu um conflito que o campo único escondia:

| pergunta | o Parcelamento |
|---|---|
| o relevo muda a **SAÍDA**? | **sim** — ele mede a rampa de cada via |
| o relevo muda o **TRAÇADO**? | **não** — medido no LAB-08, lote a lote: 599 e 599, 1 391 e 1 391 |

**Com um campo só, uma das duas verdades teria de virar mentira.** O doc do
`leRelevo` perguntava *"o traçado muda?"* e o teste comparava **a saída inteira**
— e até aqui isso nunca importou, porque nos motores de antes ler relevo e
desviar por ele eram a mesma coisa.

**O Parcelamento é o primeiro em que não são**, e por isso a capacidade virou
duas: `leRelevo` e `relevoMudaOTracado`, **cada uma com o seu teste de
falsificação** — o segundo compara só a geometria, descartando os campos de
rampa (**D100**).

**Por que a distinção importa ao urbanista, e não é burocracia:** um motor que
**mede** a rampa e **não desvia** por ela **informa**, mas não projeta com o
terreno. São duas coisas que alguém escolhendo motor precisa distinguir.

---

## 4 · O que sobrou de verdade para cada motor

A lista inteira, escrita para ser lida por eles, está em
[`docs/O_QUE_FALTA_MEDIR_POR_MOTOR.md`](../O_QUE_FALTA_MEDIR_POR_MOTOR.md). Em
resumo:

| motor | o que falta |
|---|---|
| **Parcelamento** | **uma coisa só:** trocar `AMOSTRAS_POR_VIA = 12` por **passo em metros**, não maior que a célula do relevo |
| **Symbios** | nada para eles — o defeito era do adaptador do Lab, e está consertado |
| **Generate · ortogonal** | **o cálculo.** Campo presente, `null` em todas as vias; o Lab mede **34,71 %** em `completo` |
| **Generate · espinha** | idem, e **é a mais urgente**: **46,70 %** em `completo`, e **2 179 m** de rua acima de 15 % contra 1 202 m da ortogonal |

**E `null` está certo enquanto não medirem** — zero diria "rua plana", e zero é
uma medição (D23). O pedido não é trocar o `null`; é medir.

**Uma nota que pode poupar trabalho deles**, e que só se vê lendo o repositório:
o Generate **já tem** `declividade(p)` em `engine/topografia.ts`. Falta percorrer
o eixo com passo fixo — não o modelo.

---

## 5 · Os vizinhos ficaram limpos

`git status` nos três clones de leitura ao fim da rodada — **nenhuma alteração**.
Tudo o que foi consertado está em `archilly-lab/external-engines/testfit/`, que é
**o adaptador do Lab**, não o repositório deles.

---

## 6 · O que fica pronto

- `external-engines/testfit/adapter/src/volta.ts` — lê as duas rampas do plano e
  escreve saída **v2**; a perda declarada mudou de dono;
- `external-engines/testfit/adapter/src/contrato-v1.ts` — `rampaMaxima_pct` no
  tipo da via, `CONTRATO = "2"`;
- `external-engines/esteira/src/porta/porta.ts` — `leRelevo` partida em duas, com
  o porquê e o como-se-desmente de cada;
- `external-engines/esteira/src/porta/motores.ts` — as quatro declarações
  corrigidas, cada uma com a medição ao lado;
- `external-engines/esteira/tests/porta.test.ts` — o teste de
  `relevoMudaOTracado`, que compara só a geometria;
- `docs/O_QUE_FALTA_MEDIR_POR_MOTOR.md` — a entrega para o chat.
