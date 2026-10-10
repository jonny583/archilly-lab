# LAB-78 · O sétimo mecanismo existe, e é do motor — item 011

**10/10/2026.** O LAB-59 deixou **quatro** candidatas de Antonina fora, uma violação cada, sem
mecanismo. A minha própria frase propôs a pergunta: *"pode ser um sétimo mecanismo do motor, ou a
largura e a divisa da faixa do Generate"*. O item 011 mandou **descobrir qual**.

**Resposta medida: é o MOTOR.** As duas hipóteses da faixa caem com número, e o mecanismo tem
nome.

**Conferido aqui, não no GitHub** (execução automática do CI desligada até 1º/11/2026).

---

## 1 · O sétimo mecanismo, caracterizado

> **A fileira externa TRANSBORDA O CANTO da face declarada e continua alguns metros na face
> vizinha, onde não há rua declarada — então não pode haver frente.**

| candidata | lote | **além da ponta da face** | face declarada | via interna | testada fina |
|---|---|---|---|---|---|
| `cluster` | `v16-e15` | **0,19 a 13,18 m** | 0,19 m | 5,54 m | 0 m |
| `pente` | `v3-e19` | **0,29 a 10,43 m** | 0,29 m | 0,04 m | 1,5 m |

Os dois estão **inteiramente fora** do segmento da face declarada, virando o canto em
`(-16,359; -689,672)` para a face vizinha — que tem **1 845,71 m** e **não recebe lotes de
frente**.

---

## 2 · A LARGURA da faixa cai, e como controle

O Lab construiu a faixa com **8 m** (LAB-48, LAB-59). O Generate constrói com
`Math.max(8, larguraEntrada / 2)`, e `PARAMS_PADRAO_V1.larguraEntrada = 20` → **10 m**. *Mais uma
vez o número do Lab não era o de quem declarou a regra* (D98, D104, D166).

**Mas a largura não podia explicar nada, e a geometria dizia isso antes da medição:**
`faixaViaPublica` cola o quadrilátero do lado de **FORA** da divisa e o estende para fora — **a
borda de dentro dela é a divisa**.

> **Alargar uma faixa que cresce para fora não fecha uma folga que está do lado de dentro.**

Medido: o lote do `cluster` fica a **0,19 m** da faixa de 8 m **e a 0,19 m** da de 10 m.
Idêntico. O controle saiu **indiferente**, como tinha de sair — e há trava de que ele saia assim,
porque se saísse diferente a geometria errada seria a minha.

---

## 3 · A DIVISA cai com a cobertura

A hipótese era que a face entregue atravessasse vários segmentos do anel e `divisaDoAcesso`
escolhesse um só. Medido:

```
face declarada: 180,22 m · divisa escolhida: 180,22 m · COBERTURA: 100 %
```

**A faixa cobre a face declarada inteira.** Não é curta. E a ida do Lab entrega
`facesLoteamento: [0]` — **só a face 0**, exatamente a declarada. **A ida está certa e a faixa
está certa.**

---

## 4 · Eu ia publicar um achado contra o GENERATE, e a cobertura me desmentiu

**A vigésima terceira ocorrência do §6, e a mais perto de sair desde o D119:** o veredicto já
estava escrito, com `dono: generate`, pronto para o recado.

A primeira versão do `deQuemEhAViolacao` dizia: *se a projeção do lote cai fora da extensão da
divisa → `faixa-alcance`, dono generate* — e devolveu isso para **os dois** lotes.

**O que me desmentiu foi um número da minha própria medição, na linha de cima da tela:** `A FAIXA
COBRE 100 % DA FACE ENTREGUE`. Se a faixa cobre a face inteira, um lote a 0,19 m dela **não pode**
estar fora do seu alcance. As duas afirmações não cabiam juntas.

Medido o que faltava — **quantos metros** além da ponta —, apareceu: **13,18 m** e **10,43 m**.
*Quem estava fora não era a faixa: era o lote.*

> **"ESTÁ FORA DA EXTENSÃO" NÃO DIZ DE QUEM É A CULPA.** A projeção responde **onde**; só o
> **quanto** responde **de quem**. Régua que conclui dono a partir de um booleano está adivinhando
> com cara de medição.

Conserto de **condição**, não de exceção: `faixa-alcance` passa a exigir **cobertura < 100 %**, e
há trava para os dois lados — cobertura de 100 % **nunca** vira achado contra o Generate, e
cobertura de 60 % com projeção fora vira (D254).

---

## 5 · Duas das quatro não foram medíveis, e isso sai declarado

`espinha/v12-l1093` e `mioloVerde/v20-e18` **não existem no plano desta rodada**:

```
espinha  -> 1 076 lotes (50 externos) — o id não está lá
mioloVerde -> 1 014 lotes (40 externos) — o id não está lá
```

O LAB-59 mediu com `motor-testfit` em **`4181e95`**; esta rodada roda em **`6cf6396`**. **O motor
andou entre as duas**, e id de lote não sobrevive a mudança de plantio. Sai como `naoAchados` com
o motivo, **nunca como zero** (D23). Remedi-las exige rodar no commit daquela rodada, e isso é
prompt.

**A quarta merece a linha separada que o item pediu** (a classe do D133 — *em parte faltava dado,
não mudava a ordem*). Pela prova do LAB-59, e **etiquetado como leitura da prova antiga, não
medição de hoje**: a do `espinha` é `amostragem-da-testada` — o motor reporta **8,72 m** e a mesma
função dele com passo fino devolve **10,22 m**, acima do mínimo de 10: **o lote passa**. Não é
mecanismo de plantio nem faixa, e não há o que consertar em motor nenhum. A do `mioloVerde` tem a
forma do `pente`.

---

## 6 · O conserto fica PROPOSTO, não executado

O item é explícito: *"se for o motor, caracterize o mecanismo e **proponha** o conserto na
`FILA.md` sem executar: mexer no plantio muda o desenho, e desenho espera o olho do Jonny."*

Está na `FILA.md` como **proposto ao chat**. **Nada no plantio foi tocado**, e nada foi escrito em
repositório vizinho (§4): **os três clones ficaram limpos**.

---

## 7 · E isto costura o LAB-78 ao LAB-77

**Não há rua na frente desses lotes porque ninguém declarou rua ali.** O motor não tem como saber
onde a rua termina: ele sabe qual face recebe lotes de frente, e transborda a ponta dela. O campo
que diria **quais faces dão para via pública** — o que o item 010 pediu e o LAB-77 mediu como
inexistente no contrato (D249) — é o mesmo que falta aqui.

> **Dois prompts seguidos, dois achados diferentes, o mesmo dado que falta.**

Com aquele campo, o motor poderia parar no fim da rua em vez de virar o canto — e a sugestão de
acesso do LAB-77 poderia sair. **Isso reforça o item 1 da lista que já foi ao Generate**, e não
cria item novo.

---

## 8 · Entrega

| o quê | onde |
|---|---|
| os veredictos e a conta | `external-engines/esteira/src/setimo-mecanismo.ts` |
| as travas | `external-engines/esteira/tests/setimo-mecanismo.test.ts` — **15** |
| a ferramenta | `external-engines/esteira/ferramentas/lab78.ts` · `bun run lab78` |
| a prova | `docs/provas/LAB-78/setimo-mecanismo.json` |

A prova traz **gleba, motor, semente e versão do contrato** — ela mede gleba, e por isso **não**
entra na lista de exceções do §7.

**VERDE: 821 travas na esteira + 17 no testfit, 7 passos, `exit 0`. Conferido aqui, não no
GitHub.** O `guardas-sem-clones` do CI vai de **412 para 427**.

**Decisões: D253** (o sétimo mecanismo é do motor — transbordo do canto), **D254** (eu ia acusar o
Generate, e a cobertura me desmentiu).
