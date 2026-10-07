# LAB-59 · O contrafactual de Antonina — e a resposta à pendência do Jonny

**07/10/2026** · gleba **`geo-antonina`** · motor **Laboratório de Parcelamento**
(`motor-testfit`) · semente `20260913` · contrato de motor **v1** · prova em
[`../provas/LAB-59/contrafactual-de-antonina.json`](../provas/LAB-59/contrafactual-de-antonina.json)

---

## A resposta, em uma linha — e ela responde o Jonny

> **Resolvidos os seis mecanismos do motor E o campo que falta no contrato do Generate,
> 16 das 20 candidatas passam a aprovar — a `ortogonal` de 1 228 lotes entre elas.
> E a nota DELE continua preferindo a `superquadra` de 33.**

Então a pergunta do Jonny tem resposta medida, e ela não é "o programa não consegue":

> **O plano de 1 228 lotes é válido.** O que escolhe o de 33 é a **nota do motor**, não a
> validade. A decisão que sobra para o Jonny é a que ele já tinha — *qual dos dois a régua de
> nota deve preferir* —, e agora sem a dúvida de se o grande era desenhável.

| cenário | o que se supõe resolvido | aprovam | a 1ª no ranking **dele** |
|---|---|---|---|
| **`hoje`** | nada | **0 de 20** | nenhuma |
| **`so-o-contrato`** | só o campo de rua pública existente do Generate | **0 de 20** | nenhuma |
| **`so-o-motor`** | só os seis mecanismos do LAB-58 | **0 de 20** | nenhuma |
| **`os-dois`** | os seis mecanismos **e** o campo | **16 de 20** | `superquadra`, **33 lotes**, nota **0,6226** |

**As duas pontas são necessárias, e nenhuma basta.** `so-o-motor` e `so-o-contrato` aprovam
zero: Antonina só zera com os dois, e isso é a confirmação medida do que o LAB-58 previu
pelo `oQueBloqueiaCadaGleba`.

**As quatro que não aprovam nem assim** carregam **uma violação cada** que os seis mecanismos
não nomeiam — ver §4.

---

## 1 · O que foi medido, e por quem

A pergunta é *"qual candidata aprovaria"*, e **aprovar é do Validator do Generate**. Então:

1. as **vinte** candidatas vêm da esteira **dele**, pela mesma montagem de opções que a porta
   comum usa (`variantesJulgadasDoTestfit` — uma montagem, dois leitores, D116);
2. o **Validator dele** julga cada plano;
3. cada violação recebe **o mecanismo do LAB-58**, pelos mesmos predicados;
4. a candidata **aprovaria** num cenário se **todas** as violações dela estiverem no que o
   cenário resolve;
5. entre as que aprovariam, a primeira é a de melhor **`notaDoMotor`** — **a escolha é dele.**
   Este prompt não escolhe variante: seria o Lab decidindo pelo motor (§4), e há trava.

**A aferição vem antes de tudo:** a 1ª do ranking tem de reproduzir o número que o LAB-53
mediu nesta gleba. Mediu: **`superquadra`, 40 violações, 40 no LAB-53.** *Contrafactual que
não reproduz o presente não mede futuro nenhum.*

---

## 2 · O DEFEITO DESTE PROMPT, e ele quase publicou o contrário da verdade

> **A primeira versão respondeu `1 de 20`, e a resposta certa é `16 de 20`.**

A primeira versão lia **três valores por lote** das provas anteriores — a distância à face
entregue (LAB-50), a testada com amostragem fina (LAB-54) e o contrafactual do campo
`faixaViaPublica` (LAB-53). Pelo **D116** isso parecia disciplina: *não se remede o que outra
prova já mediu.*

**O número denunciou: 696 violações saíram `MECANISMO-NAO-NOMEADO`, em 19 das 20
candidatas** — entre elas as **40** da `ortogonal` de 1 228 lotes. E eu estava a um passo de
escrever *"nem resolvido tudo a de 1 228 aprova"*, quando o que a medição dizia era
*"ela tem 40 violações que a MINHA régua não nomeia"*.

**A causa é uma só, e as três instâncias dela são a mesma:** aquelas provas mediram **a
candidata vencedora** de cada gleba. Os lotes externos dela são `v19-eN`; os da `ortogonal`
são `v1-eN`, os da `pente` são `v3-eN`, e **não existem lá**. A consulta devolvia
`undefined`, o predicado caía, e a violação saía órfã.

> **O D116 fala de remedir a MESMA grandeza do MESMO objeto. Ler de uma prova um valor POR
> OBJETO, para objetos que ela não contém, não é economia: é uma tabela de consulta que erra
> em silêncio** — e erra para o lado pior, o de atribuir ao desconhecido o que é falta de
> medição (D23).

**O conserto, e a progressão do número:**

| versão | `MECANISMO-NAO-NOMEADO` nas 20 | `os-dois` aprovam |
|---|---|---|
| três valores **lidos** | **696** | 1 de 20 |
| a face e a testada fina **medidas** | **238** | 1 de 20 |
| o contrafactual do contrato **medido** também | **4** | **16 de 20** |

E as provas viraram o que de fato são: **a calibração**. Todo lote que o LAB-50, o LAB-54 e o
LAB-53 contêm recebe aqui o mesmo número — tetos de 0,1 m, 0,01 m e igualdade booleana.
**Discordâncias: zero.**

**A precondição que fecha o caminho silencioso:** lote externo sem distância à face entregue,
numa gleba que entrega face, faz a ferramenta **parar**. `null` ali não é *"não há"*, é
*"não medi"* — e falta de medição que não estoura vira frase publicada (D175).

---

## 3 · A sabotagem, e ela reproduz o defeito de verdade

Prova em [`../provas/LAB-59/sabotagem.json`](../provas/LAB-59/sabotagem.json). Quatro, e as
**duas primeiras** devolvem cada uma das consultas ao lugar errado:

| # | o que se sabota | o que pegou |
|---|---|---|
| **1** | a distância à face volta a ser **lida** do LAB-50 | **a ferramenta PARA** (`exit 1`) pela precondição nova. Antes dela: `exit 0`, e as **travas** pegaram — 2 de 20 |
| **2** | o contrafactual do contrato volta a ser **lido** do LAB-53 | `exit 0`, e as **travas** pegaram — as **mesmas duas** |
| **3** | a "primeira entre as que aprovam" deixa de ser a de melhor nota **dele** | 2 travas — a do §4 e a da resposta ao Jonny |
| **4** | uma candidata aprova resolvendo **menos** e não resolvendo mais | 1 trava — a da contagem contada |

**As duas primeiras caem nas MESMAS duas travas, e elas são as que guardam a resposta do
Jonny:** *"a candidata de mais lotes aprova no cenário em que tudo foi resolvido"* e *"a nota
dele ainda prefere a de menos lotes"*. Nos dois casos o contrafactual passou a dizer
**1 de 20** — o contrário do medido.

> **A trava que vale é a que reprova a frase que você ia publicar.**

---

## 4 · O que SOBRA sem nome — 4 violações, caracterizadas

Resolvidos os dois lados, **quatro** candidatas ficam de fora, cada uma por **uma** violação
que os seis mecanismos do LAB-58 não nomeiam. Elas saem **caracterizadas**, nunca como balde
fechado (D23):

| candidata | lotes | a violação | o que se mediu nela |
|---|---|---|---|
| `espinha` | 1 198 | `testada` `v12-l1093` | **interna**, encosta no meio-fio (0 m), testada dele **8,72 m** e com amostragem fina **10,22 m** — acima do mínimo. Esta **sumiria** com a amostragem fina, e por isso não é do mecanismo 5 |
| `cluster` | 1 094 | `frente` `v16-e15` | **externa**, a **0,2 m** da face entregue, mas a **5,54 m** do contorno de qualquer via, e a faixa do Generate não a alcança |
| `mioloVerde` | 735 | `frente` `v20-e18` | **externa**, a **0,1 m** da face, encosta na via (0,01 m), testada fina **1,5 m** |
| `pente` | 961 | `frente` `v3-e19` | **externa**, a **0,3 m** da face, encosta na via (0,04 m), testada fina **1,5 m** |

**Três das quatro têm a MESMA forma das 11 do contrato** — lote externo sobre a rua entregue —
e **não somem** com a faixa que o `faixaViaPublica` do Generate constrói. Isso é um **sétimo
mecanismo, ou a largura/divisa da faixa**, e **não se nomeia aqui**: nomear mecanismo é o
LAB-58, e ampliar escopo é o que a `FILA.md` proíbe. Vai como **proposto ao chat**.

---

## 5 · Para o Jonny, e é o item 7 dele

A página do Jonny ganhou a resposta, em palavra de pessoa, **marcando e não apagando** o que
estava escrito antes: o plano de 1 228 lotes **é desenhável e válido**, e o que escolhe o de
33 é a nota. A decisão que sobra é dele, e é mais simples de enunciar do que era.

---

## 6 · Entrega

- **Ferramenta:** `external-engines/esteira/ferramentas/lab59.ts` (`bun run lab59`)
- **Uma montagem, dois leitores:** `variantesJulgadasDoTestfit`, em
  `src/motores/testfit.ts` — o `rodarTestfit` e este prompt usam as **mesmas** opções
- **Travas:** `external-engines/esteira/tests/contrafactual.test.ts` — **20**, e entram no
  trabalho do CI que não precisa dos clones vizinhos (leem só arquivo deste repositório)
- **Provas:** `docs/provas/LAB-59/contrafactual-de-antonina.json` e `sabotagem.json`
- **Decisões:** D200, D201
- **Verde:** o comando único, sete passos, **549 travas** (532 esteira + 17 testfit), exit 0
- **Os três clones vizinhos ficaram limpos** (§4): `motor-testfit` em `4181e95`,
  `urban-create-hub-41d93a4d` em `5b7e9b4`, `urban-scout-tool` em `f38dc0c`, **zero alterações**
