# LAB-45 · As duas fixtures na tabela — e o que elas revelaram

**04/10/2026 · `bun run lab19` + `bun run lab28` + `bun run lab20` ·
provas em [`../provas/LAB-19/tabela.json`](../provas/LAB-19/tabela.json) e
[`../provas/LAB-28/acesso.json`](../provas/LAB-28/acesso.json)**

> ### ⚠️ Correção acrescentada em 05/10/2026 — o §4 deste relatório estava errado
>
> O §4 diz que os 33 lotes de Antonina são *"todos externos"* e conclui *"o plano não tem
> um único lote no miolo"*. **A base era o ID do lote** (`…-eN`, o apelido da passagem
> externa do motor), e não a posição.
>
> **Medido no [LAB-46](LAB-46.md): dos 33, só 14 encostam na testada** (≤ 0,5 m); 15 estão
> a **mais de 50 m** e o mais distante a **1 805,7 m** — o outro canto da gleba. *`-eN` é
> rótulo; distância é a coisa* (D161), e esta é a **décima terceira** vez do ponto cego —
> **a primeira desde o D119 que já havia saído** para o chat e para a página do Jonny.
>
> **O que segue de pé:** os 33 são todos da passagem externa do motor, 29 acusados pelo
> invariante `frente`, somando 1,03 ha (~310 m² cada). **O que cai:** *"todos na beira da
> rua"*.
O chat aprovou, terceiro da ordem: *"as duas fixtures novas com a tabela comparativa
regerada."*

---

## 1 · Por que elas tinham de entrar

As fixtures do LAB-40 existiam e eram medidas **pelas travas e pela ferramenta do
LAB-40** — e **não pela esteira inteira**. Nenhuma das cinco glebas antigas tem furo,
calçada declarada, atração poligonal, acesso como segmento ou testada de frente fora de
Antonina: a tabela comparava quatro motores em terreno que **não exercita caminho nenhum
dos novos**.

**A tabela e a prova do acesso passaram a ter SETE glebas.** A página do Jonny ganhou os
dois quadros, com nomes que dizem para que elas existem — *"montada com furo, calçada,
praça e acesso em faixa"* e *"montada com uma rua existente na lateral"* —, porque quem lê
precisa saber que não são terrenos de cliente.

---

## 2 · Três travas caíram, e as três estavam certas (D158)

Duas do LAB-39 e uma do LAB-34 diziam *"as cinco glebas"*.

> O **detector de prova velha** do LAB-39 compara os números crus da tabela com os da
> prova do acesso. **Conjunto de glebas diferente quebra a comparação por fora.**

**A prova do acesso foi com a tabela** — as mesmas sete —, e as travas passaram a dizer
sete. **A alternativa era afrouxar a comparação para caber a minha mudança**, ensinando o
detector a olhar só a interseção, e isso é o contrário do que o D143 deixou: *consertei sem
afrouxar*.

**Nas sete:** a ordem muda em **3** (as mesmas de antes) e o vencedor em **2**. As três
glebas em que a ordem aguenta as seis posições são `ensaio-47ha` e as **duas nascidas
dela** — coerência, não coincidência: são o mesmo retângulo a uma variável de distância
(D149).

**E um literal meu, da família do D153:** o `lab39.ts` imprimia `ARQUIVOS.length * 5`
confrontos, com o **cinco à mão**. O trabalho estava certo (56 agregados, 336 posições);
o **número impresso** ficou errado ao passar para sete. Agora é **contado**.

---

## 3 · O que as duas glebas novas revelaram (D159)

| gleba | lotes | violações | por regra |
|---|---|---|---|
| `ensaio-47ha` (base) | 599 | 16 | `testada: 10`, `face-quadra: 6` |
| `ensaio-com-testada` | 640 | **68** | **`frente: 47`**, `via-sobre-lote: 15`, `face-quadra: 6` |
| `ensaio-com-promessas` | 589 | 25 | **`massa: 19`**, `face-quadra: 6` |

**Os dois saltos estavam declarados — e agora têm preço:**

**Os 19 `massa`** são a **perda declarada** do inventário da ida, que diz por escrito: *"o
motor tem um perímetro só; gleba com furo entra como o anel externo, e **o furo vira área
que o motor acha livre**"*. Ele lotea sobre o furo, e o Validator do Generate — que
**conhece** o furo pela entrada — acusa. Era teoria; virou número.

**Os 47 `frente`** são a consequência de o contrato não ter como dizer *"este lote faz
frente para uma rua que já existe, fora da gleba"*. **Medido:** o motor cria **51 lotes
externos** e **os 51** publicam `faceDeRua: null` — ele mesmo diz que não fazem frente
para via **do plano**; o invariante `frente` do Generate (*"nenhuma aresta encosta em
via"*) acusa **47**. Na base, sem testada: **0 e 0**.

> ~~**O mesmo lote é "de frente para a rua existente" por uma régua e "sem frente para rua"
> pela outra — e as duas estão certas sobre o que medem.**~~
>
> ⚠️ **A MOLDURA ESTAVA ERRADA — corrigida no LAB-56 (D168, D191).** Não são duas réguas
> discordando: **é UMA régua e UM campo que falta.** Lido o `invariantes.ts` do Generate, ele
> aceita por escrito *"a RUA PÚBLICA, quando existe"* como superfície de frente; o campo
> existe (`resultado.faixaViaPublica`), o invariante o usa, e há até bandeira por lote
> (`deLoteamentoFachada`) que troca o mínimo de testada. **A régua dele CONCORDA com o
> motor** — ela aceitaria esses lotes se soubesse que a rua existe. O que falta é campo no
> **contrato de motor v1** onde um motor declare a rua pública existente, então o tradutor
> do próprio Generate não tem o que traduzir.
>
> **E a correção tem limite, também medido (LAB-54):** em `geo-antonina`, das 29 acusadas,
> **11 somem** com o campo preenchido e **18 NÃO** — essas 18 estão a **15,7 a 1 805,7 m** da
> face entregue e são do motor. Dizer *"é só o campo que falta"* seria o erro simétrico.
> **Em `ensaio-com-testada` o contrafactual NÃO foi medido**, então aqui não há número para
> as 47 — `null` é não medido (D23).
>
> *Riscado e não apagado* (D161): a frase saiu em cinco documentos e num gerador, e apagá-la
> tiraria do registro a única coisa útil que ela tem.

---

## 4 · E isto FECHA o D140

Em `geo-antonina`, o partido que o ranking do motor escolheu tem **33 lotes, e os 33 são
externos**: `faceDeRua: null` em todos, **29** acusados por `frente`. **O plano não tem um
único lote no miolo do terreno.**

A primeira das duas leituras do item 7 do Jonny — *"produto de poucos lotes grandes"* —
**está enfraquecida pela medição**: os 33 somam **1,03 ha**, cerca de **310 m² cada**. A
segunda — efeito colateral — fica reforçada. **A decisão segue dele**, porque é régua de
nota e não código; o que mudou é que agora ela se toma sabendo **o que** são os 33 lotes.
O item 7 recebeu isso escrito para leigo, com a tabela das duas leituras.

**A razão vai colada ao número** (LAB-34): a linha dos lotes externos nasce no
`naoSoubeFazer` do motor e a página a levanta para **debaixo do quadro**. **Achado ao LER a
página gerada**, como no D116: o casador usava `startsWith` e a minha linha **começa com o
número** — ela nunca subia, ia para a lista do fim, onde os números são normalizados para
`…`. O casador media **posição** do marcador, não conteúdo.

---

## 5 · Para o Archilly Generate — lista numerada, nunca commit lá (§4)

1. **O contrato não tem como declarar "lote com frente para rua existente, fora da
   gleba".** Medido: 51 lotes externos, 47 contados como `frente` ("sem frente para rua").
   Hoje a única saída do motor é `faceDeRua: null`, e isso é indistinguível de *"não sei"*.
2. **Sugestão, e é só sugestão:** um `faceDeRua` que aceite referência a via **externa**
   declarada na entrada (a testada que o Geo entrega), ou um campo irmão
   (`frenteExterna: true`). Quem decide é vocês — e **se é lote válido** é decisão de
   urbanismo, do Jonny.
3. **`via-sobre-lote: 15`** aparece só na gleba com testada: 15 lotes *"invadindo o leito
   da rua"*. **Não investiguei** — está declarado como não medido.
4. **A perda do furo tem preço medido:** 19 violações `massa` quando a gleba tem furo,
   porque o contrato leva um perímetro só. Se um dia o motor aceitar furo, o ganho é este
   número.

---

## 6 · Entrega

| o quê | onde |
|---|---|
| as sete glebas na tabela e na prova do acesso | `ferramentas/lab19.ts`, `lab28.ts` |
| os nomes na página, dizendo para que as fixtures existem | `ferramentas/lab20.ts` |
| a razão colada ao número (lote externo + `faceDeRua`) | `src/motores/testfit.ts` |
| o casador por conteúdo, não por posição | `ferramentas/lab20.ts` |
| o confronto **contado**, não multiplicado | `ferramentas/lab39.ts` |
| as três travas falando de sete | `tests/acesso.test.ts` |
| o item 7 do Jonny, com o que são os 33 lotes | `docs/PENDENCIAS_JONNY.md` |
| decisões | **D158**, **D159** |

**Verde:** `./external-engines/conferir.sh` — 7 passos, **401 travas**, exit 0.

**Os clones vizinhos ficaram limpos** — `git status --porcelain` vazio nos três. O Generate
foi **lido** (o invariante `frente` e o rótulo dele) e **nada escrito lá**.

**Não há `docs/provas/LAB-45/`:** a prova deste prompt **são as duas provas regeradas com
sete glebas** — a tabela e o acesso — mais a página. Um JSON novo duplicaria o dado.
