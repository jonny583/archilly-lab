# LAB-25 · A guarda que impede a quarta vez

**03/10/2026 · `bun run lab25` · provas em
[`../provas/LAB-25/guarda-da-ponte.json`](../provas/LAB-25/guarda-da-ponte.json)**

O prompt foi curto e tinha veredito embutido: *"o seu ponto cego do §6 pegou você
três vezes no mesmo lugar — escreva a guarda que impede a quarta: um teste que
reprove quando a ponte do Lab descartar campo que o motor publica, e a regra no
documento. **Vale mais que qualquer medição nova.**"*

**A guarda ficou pronta, rodou uma vez, e achou a quarta vez na mesma hora.**

---

## 1 · O que ela achou, em 110 de 110 lotes

A ponte do Laboratório de Parcelamento escrevia `faceDeRua: null` em **todos** os
lotes, com este comentário:

> *"o motor sabe a testada mas não guarda de QUAL via ela é frente"*

**O motor guarda desde o T02 dele** (`face.ts`), e a tradução dele mesmo escreve
exatamente este campo (`contrato/traducao.ts:453`). O comentário não envelheceu
sozinho: **ele foi escrito antes do T02 e nunca mais foi conferido.**

É a mesma forma do **D98** — e a quinta linha de uma tabela que agora está no
`CLAUDE.md` §6:

| quando | o que eu ia dizer | o que era |
|---|---|---|
| D18 (LAB-07) | "441 de 441 lotes sem frente" | distância medida errado pelo adaptador |
| D75 (LAB-17) | "o motor erra a classe da via desenhada" | a régua media **vértice**, não linha |
| D93/D94 (LAB-21) | "o motor entrega rampa de 161 %" | a régua media **dentro** do segmento |
| D98 (LAB-22) | "o Parcelamento não reporta o pico" | a **ponte do Lab** jogava a medição fora |
| **D104 (LAB-25)** | *nada — eu não vi* | **a ponte jogava a via de frente fora** |

**A diferença que importa:** nas quatro primeiras quem achou fui eu, medindo
porque o número estava estranho. **Nesta, quem achou foi a guarda** — e o número
não estava estranho. `null` num campo que o contrato permite `null` é a coisa mais
invisível que existe.

---

## 2 · Como a guarda funciona, e por que não é mais uma lista para envelhecer

A tentação óbvia era escrever uma lista de campos conferidos à mão. Lista é
comentário com outro nome: envelhece igual. O desenho é outro — **duas peças**:

**1 · O inventário** (`src/inventario-das-pontes.ts`). Cada campo que um motor
publica tem um destino escrito: `atravessa`, `traduzido`, `perda` (com o motivo) ou
`interno`. É a justificativa que antes morava em comentário, agora num lugar que o
teste lê.

**2 · A guarda** (`src/guarda-da-ponte.ts`), que confere o inventário **contra o
motor rodando** — não contra o tipo dele. Tipo é promessa; objeto é fato. Três
regras:

| regra | o que pega | reprova? |
|---|---|---|
| `campo-vazio` | a SAÍDA sai `null` e o motor publica valor **na mesma linha** | **sim** |
| `campo-novo` | o motor publica campo que o inventário não conhece | **sim** |
| `mapa-velho` | o inventário descreve campo que nenhuma amostra traz | não — **avisa** |

**A `campo-vazio` não acredita no inventário.** O casamento é por **nome**, lido do
objeto que o motor devolveu. Uma ponte que declarasse a perda com motivo bem
escrito seria pega igual — era **literalmente** o caso do D98, onde o comentário
dizia *"o motor não calcula greide"* e o campo tinha o mesmo nome nos dois lados.
Há teste com inventário que mente de propósito, para provar isso.

**A `campo-novo` é a que pega o movimento do vizinho.** Quando o motor **ganha** um
campo — o que é exatamente o que aconteceu em 14/09 —, o inventário fica
incompleto e o teste fica vermelho **no mesmo dia**.

**A `mapa-velho` avisa e não reprova, de propósito.** `travado`, `externo` e
`conteudo` são opcionais: faltam numa gleba e aparecem noutra. Guarda que grita sem
razão é guarda que se aprende a desligar, e a utilidade inteira desta depende de
ela nunca gritar à toa. Medido: **30 avisos** nas cinco glebas, **zero** falsos
positivos entre os que reprovam.

---

## 3 · A guarda prova que sabe ficar vermelha (D106)

Um teste que só ficou verde nunca provou nada. O andar 2 de
`tests/guarda-da-ponte.test.ts` **sabota a ponte de propósito**, três vezes:

1. escrever `null` na rampa que o motor mede — o **D98 reencenado**;
2. escrever `null` no `faceDeRua` — o **D104 reencenado**;
3. **apagar uma entrada do inventário** — tem de virar `campo-novo`.

As três exigem o achado. É o mesmo princípio da D101: **prova por diferença, não
por palavra.**

---

## 4 · O que o conserto comprou, medido — e é pouco, e está dito

A pergunta seguinte não é de fé: **o número que estava sendo descartado estava
certo?** A resposta sai de graça, porque **o Generate não acredita no `faceDeRua`
que recebe de fora**: o `paraResultado` dele o descarta e o `paraSaida` o recalcula
com a régua do invariante (`faceMaisProxima`). São duas réguas independentes sobre
a mesma geometria.

| gleba | a ponte publica | concordam | divergem | concordância |
|---|---:|---:|---:|---:|
| `completo` | 1 047 / 1 060 | 965 | 76 | **92,70 %** |
| `sintetico-50ha-ondulado` | 501 / 501 | 487 | 11 | **97,79 %** |
| `sintetico-10ha-plano` | 124 / 124 | 116 | 7 | **94,31 %** |
| `ensaio-47ha` | 599 / 599 | 598 | 1 | **99,83 %** |
| `geo-antonina` | 1 378 / 1 386 | 1 256 | 117 | **91,48 %** |

**O campo descartado era bom.** Onde divergem, **as duas réguas estão certas**: a do
motor é *um dos dois lados do comprimento da testada*; a do Generate é *a faixa de
leito mais perto de qualquer vértice do lote*. Num lote de esquina elas escolhem
ruas diferentes, e o contrato é singular de propósito.

**E agora a parte desconfortável, que é a que importa:** regerei a tabela do LAB-19
inteira depois do conserto e **nenhum número medido mudou** — só o tempo de parede.
Porque o Generate recalcula o campo, **encher `faceDeRua` não compra ponto no
Judge**. O conserto conserta a **honestidade do Lab** e serve quem lê o campo (tela,
exportação, Orçamento). Dizer que melhorou a comparação seria vender ganho que não
houve.

---

## 5 · A §6 contra a minha própria régua de conferência

A primeira versão do cruzamento das duas réguas acusou **"os ids de via não
batem"** em `completo` e em `geo-antonina`. Era achado meu, inventado: o
`paraResultado` classifica uma das vias como principal e o `paraSaida` emite
`[...principal, ...secundarias]`, o que **sobe aquela via para a frente da lista**
(em `completo`, a V19). Os **26 ids são os mesmos 26** — eu estava comparando
*ordem* onde o casamento é por *nome*.

**Medido antes de atribuir, de novo**, e desta vez contra o instrumento que eu
tinha acabado de escrever para me vigiar. A conferência agora compara conjuntos, e
registra à parte que a ordem muda em duas das cinco glebas.

---

## 6 · A consequência que só existe porque o campo deixou de ser `null` (D107)

O aparo do Lab descarta a via que cai inteiramente fora da gleba. Com
`faceDeRua: null` fixo isso não tinha consequência; agora tem — um lote podia
apontar para via **que não está mais no arquivo**, e o esquema do Generate
**recusa o desenho inteiro** nesse caso.

O aparo volta esse campo para `null` e **conta** em `facesApagadas`. Três saídas
eram possíveis, e as outras duas são piores: deixar o id morto faz o Generate
recusar tudo; apontar para a via sobrevivente mais próxima é o Lab inventando
frente que o motor não mediu.

**Medido:** na gleba inteira, `facesApagadas = 0`. Numa gleba minúscula de teste,
que descarta quase toda a rede, ele apaga, e o teste exige a conta.

**O cabeçalho do `aparo.ts`** dizia *"só as vias são tocadas; lote, quadra e área
especial saem exatamente como o motor os desenhou"*. **Ficou falso com este
conserto, e foi corrigido no mesmo commit** — que é exatamente a disciplina que a
guarda existe para criar.

---

## 7 · As duas pontes auditadas, e a que não existe

| ponte | arquivo | o que ela traduz |
|---|---|---|
| **parcelamento** | `testfit/adapter/src/volta.ts` | o `Plano` do motor → SAÍDA v2 |
| **symbios** | `esteira/src/symbios-para-contrato.ts` | `Via`/`Quadra` do adaptador → SAÍDA v2 |

**As duas candidatas do Generate não têm ponte do Lab:** elas escrevem o contrato
no repositório delas. **Não há o que o Lab possa descartar nelas** — e é por isso
que a guarda tem duas pontes e não quatro.

**O Symbios tem duas pontes em série** (WASM → `contrato.ts` do adaptador → SAÍDA) e
só a segunda está auditada: a primeira recebe vetor cru do WASM, sem campo nomeado
para inventariar.

**Amostras auditadas** (`geo-antonina`, a maior): 25 vias, 1 386 lotes, 55 áreas e o
`Plano` inteiro na ponte do Parcelamento; 455 vias e 702 quadras na do Symbios.

**Resultado final, nas cinco glebas:** `campo-vazio: 0`, `campo-novo: 0`,
`mapa-velho: 30`. **Zero achados que reprovam** — nenhuma das duas pontes descarta
hoje campo que o motor publique.

---

## 8 · O que esta guarda NÃO faz

- **Não confere a ida** (ENTRADA do contrato → entrada do motor). O mecanismo
  serve igual, e a falta está na fila como **proposto ao chat**.
- **Não diz se o valor está certo**, só se ele foi perdido. Campo que atravessa com
  conta errada é outro problema, e a régua dele é o Validator.
- **Não alcança o que o motor não publica.** Capacidade que o motor tem e nenhum
  campo expõe continua invisível — é o limite que a porta do LAB-14 já declara, e é
  o que o LAB-26 vai varrer.

---

## 9 · Conferência

- `bun run typecheck`, `bun run lint`, `bun test` — **verdes**: **227 testes**, 18
  deles novos (209 antes).
- **Clones vizinhos limpos:** `git status` em `motor-testfit`,
  `urban-create-hub-41d93a4d` e `urban-scout-tool` — **sem nenhuma alteração**. O
  achado para o Parcelamento e o pedido ao Generate foram para
  [`../O_QUE_FALTA_MEDIR_POR_MOTOR.md`](../O_QUE_FALTA_MEDIR_POR_MOTOR.md) (§1-A e
  §7, novos), que o chat leva — **nunca commit lá**.
- **A página do Jonny não foi regerada** porque nenhuma medição mudou: a tabela do
  LAB-19 saiu idêntica fora dos tempos de parede, e isso está medido no §4.
- **Mesclado por PR.** Este despertador acordou **com** os conectores do GitHub,
  diferente dos de 15/09 (D29) — então a entrega seguiu o caminho normal, e não o
  `git merge --no-ff` de emergência.
- **Decisões:** D104 (a quarta vez, achada pela guarda), D105 (o inventário
  conferido substitui o comentário), D106 (a guarda prova que sabe ficar vermelha),
  D107 (o aparo apaga a face órfã).
