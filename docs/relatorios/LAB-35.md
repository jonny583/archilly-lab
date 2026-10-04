# LAB-35 · Os 310 avisos tinham quatro promessas que ninguém nunca verificou

**04/10/2026 · `bun run lab30` · provas em
[`../provas/LAB-30/guarda-da-ida.json`](../provas/LAB-30/guarda-da-ida.json)**

O chat mandou: *"a guarda da ida cospe 310 avisos `mapa-velho`; confira se há caso real
escondido nesse volume e reduza o ruído."*

**Havia caso real, e são quatro.** Achá-los foi uma questão de **classificar** em vez de
contar.

---

## 1 · A classificação, que é o que o volume escondia

Dos **68 campos** que avisavam, **21 avisavam em TODAS as sete glebas**.

E aí a frase do próprio diagnóstico deixa de valer. Ela dizia: *"pode ser campo opcional
que esta gleba não exerce"*. Em 21 campos a verdade é outra: **nenhuma gleba exerce
isto.**

| grupo | quantos | o que significa |
|---|---|---|
| ausentes em **algumas** glebas | 47 campos | campo opcional de verdade — a ausência não diz nada |
| ausentes em **todas**, destino `perda` ou `interno` | 17 campos | **nada tinha de chegar** ao motor; a ausência não diz nada |
| ausentes em **todas**, destino `entregue` ou `traduzido` | **4 campos** | ⚠️ **promessa que a guarda nunca verificou** |

---

## 2 · As quatro promessas

| ida | campo | destino prometido |
|---|---|---|
| parcelamento | `parametros.calcada_m` | `terreno.padroes` |
| parcelamento | `atracoes[].geometria.aneis` | `terreno.atracoes` |
| parcelamento | `acessos[].segmento` | `terreno.acesso` |
| symbios | `gleba.furos` | `gleba.furos` |

**Por que isso é grave, e não burocracia:** a regra `campo-nao-entregue` só morde quando
o contrato **traz valor**. Um caminho de destino errado numa entrada `entregue` ou
`traduzido` que gleba nenhuma exercita é **invisível** — e essa é, letra por letra, a
forma do **D119**: o motor tinha o campo `viaManual`, a ponte não o preenchia, e nada
acusava.

**Dois dos quatro casos têm a mesma cara do D119 de novo:**

- a perda declarada da ida diz, **por escrito**, que *"o motor recebe atração como
  POLÍGONO (ímã)"* — e **nenhuma fixture entrega atração poligonal**. Todas as atrações
  das sete glebas são **linha**. A frase nunca foi posta à prova;
- a ida do Symbios declara `gleba.furos` como **`entregue`** — e **nenhuma gleba tem
  furo**.

---

## 3 · O conserto: exercitar as quatro (D134)

Transformar *"nunca verificada"* em *"verificada"* é o único conserto que vale aqui.
`tests/promessas.test.ts` monta a entrada de cada caso e confere o destino:

| promessa | o que o teste faz | resultado |
|---|---|---|
| `parametros.calcada_m` | declara `calcada_m: 3.5` | chega em `terreno.padroes` como `{ min: 3.5, max: 3.5 }` ✅ |
| `atracoes[].geometria.aneis` | entrega uma atração **poligonal** | chega em `terreno.atracoes` como ímã, com o anel ✅ |
| `acessos[].segmento` | entrega o acesso como **segmento** | chega em `terreno.acesso`, **no meio do segmento** ✅ |
| `gleba.furos` (Symbios) | entrega uma gleba com **furo** | chega em `terreno.gleba.furos`, com o furo mandado ✅ |

**As quatro se sustentam.** O caso real não era promessa quebrada — era **promessa que
ninguém tinha olhado**, e agora está olhada.

---

## 4 · A redução do ruído

A regra 3 virou **duas**, porque as duas metades não têm o mesmo peso:

| regra | quando | o que é |
|---|---|---|
| `promessa-nao-exercitada` | destino `entregue`/`traduzido` e a gleba não traz | **o aviso que importa** |
| `mapa-velho` | destino `perda`/`interno` e a gleba não traz | **o aviso que não importa** — gravado na prova, calado no relatório |

**A conta:**

```
antes:  mapa-velho 310
agora:  promessa-nao-exercitada  99   (sinal, e 4 delas em TODAS as glebas)
        mapa-velho              187   (calado no relatório, gravado na prova)
        + 24 que eram entradas de DÍVIDA em glebas que não trazem o campo
```

Os 24 somem porque **não há o que confessar se o contrato não trouxe nada**: a regra 3
passou a pular as entradas de dívida, e a regra da dívida só fala quando há valor.

**E o que o relatório lê agora** é `avisosQueImportam` — tudo menos `mapa-velho`. A
ferramenta imprime, por gleba, *"N promessa(s) não exercitada(s) · M mapa-velho
(calado)"*, e no fim a **lista curta** das que gleba nenhuma exercita.

**Guarda que grita à toa se desliga**, e esta gritava 310 vezes por rodada.

---

## 5 · A oitava vez do ponto cego — e as duas foram do meu teste (D135)

Dos quatro testes, **dois falharam na primeira rodada**. Os dois pareciam defeito da
ponte do Lab. **Os dois eram o meu teste:**

| o que eu ia dizer | o que era |
|---|---|
| *"a calçada declarada não chega ao motor"* | o motor recebe padrão como **faixa**: `{ min: 3.5, max: 3.5 }`. A promessa estava certa |
| *"a ida do Symbios não entrega o furo"* | no Symbios a gleba é um `Poligono { externo, furos }` — o furo mora em **`terreno.gleba.furos`**. O caminho do inventário estava certo; o do meu teste, errado |

A segunda assusta: eu tive nas mãos, por um instante, *"o inventário promete entregar o
furo e a ida não entrega"* — acusação à ponte, publicável, e **falsa**.

**Os dois tropeços ficaram escritos nos próprios testes**, no lugar onde a asserção mora,
porque é ali que o próximo a mexer vai ler. E a regra entrou no `CLAUDE.md` §6:

> **Antes de acusar a ponte de não entregar, confira o CAMINHO e a FORMA do que você está
> lendo** — e antes de dizer que um número mudou, confira se ele **existe**. Oito de oito
> vezes o defeito estava na régua antes de estar no medido, e em **três** delas a régua
> era o teste que eu acabara de escrever.

---

## 6 · O que mudou no código

| onde | o quê |
|---|---|
| `esteira/src/guarda-da-ida.ts` | a regra 3 partida em duas; `promessasNaoExercitadas` e `avisosQueImportam`; dívida ausente deixou de virar aviso |
| `esteira/ferramentas/lab30.ts` | agrega entre glebas e publica `promessasQueNenhumaGlebaExercita`; o console separa sinal de ruído |
| `esteira/tests/promessas.test.ts` | 4 travas, uma por promessa, com os dois tropeços documentados |
| `esteira/tests/guarda-da-ida.test.ts` | 5 travas do andar novo: a partição, o silêncio do `mapa-velho`, a promessa exercitada que não avisa, e a dívida que não vira ruído |

---

## 7 · O estado verde, e os vizinhos

```
./external-engines/conferir.sh
VERDE — 7 passos, e a cobertura conferida.   340 testes, exit 0
```

`git status` nos três clones somente-leitura: **limpos, nenhum arquivo alterado** — Geo
(`urban-scout-tool`), Generate (`urban-create-hub-41d93a4d`) e o motor do Laboratório de
Parcelamento (`motor-testfit`).

## 8 · Decisões

| | |
|---|---|
| **D134** | Os 310 avisos tinham caso real dentro, e a regra 3 era duas |
| **D135** | A **oitava** vez do ponto cego, e as duas foram caminho do meu teste |

## 9 · O que fica proposto ao chat

- **As quatro promessas estão exercitadas por teste, não por fixture.** O teste monta a
  entrada em memória, o que prova o caminho — mas **nenhuma gleba do repositório** tem
  furo, atração poligonal, calçada declarada ou acesso como segmento. Quem rodar a
  esteira inteira continua sem exercer esses caminhos. **Criar fixtures com eles é escopo
  novo** e não foi feito; se o chat quiser, é um prompt pequeno.
- **A nascente e o `eixoDoCurso` seguem sem dado em gleba nenhuma** (D88, D103), agora
  medidos como `mapa-velho` em 7 de 7 — nada novo, mas agora o número existe.
