# LAB-46 · As três amostragens em Antonina — e um erro meu que já tinha saído

**05/10/2026 · `bun run lab46` · provas em
[`../provas/LAB-46/antonina-tres-amostragens.json`](../provas/LAB-46/antonina-tres-amostragens.json)**

O chat aprovou, quarto da ordem: *"medir em Antonina as três amostragens do D148 — é o
que decide se o 33 contra 1.228 é caso único ou a mesma troca vista de outro ângulo. **O
Jonny quer ver este resultado.**"*

---

## 1 · A resposta: é a mesma troca, e o ângulo é a ESCOLHA DA VARIANTE

| amostragem | sem as faces | com as faces | delta | do plano escolhido |
|---|---|---|---|---|
| 2 variantes · espinha | **0 aceitas** | **1 088** | — | 50 com id `-eN`, **16** encostam |
| 2 variantes · ortogonal | 1 386 | **1 228** | **−158** | 49 com id, **16** encostam |
| completo, 20 aceitas | 1 386 (ortogonal) | **33** (superquadra) | **−1 353** | 33 com id, **14** encostam |

> **Com a MESMA entrega, restringindo o formato à ortogonal, o motor desenha 1 228
> lotes** — exatamente o partido que o ranking dele preferiu não usar na amostragem
> completa. **O 33 aparece em 1 de 3 amostragens**, e é a que o Lab publica.

Então o 33 **não é esquisitice do terreno**: é artefato de **qual variante o ranking
escolhe quando pode escolher entre 20**. Os 1 228 lotes estão ao alcance do mesmo motor,
com a mesma entrada.

**Dois achados que vieram junto, e nenhum é defeito:**

1. **na espinha com 2 variantes, SEM as faces nada passa** (zero aceitas) e **com** elas
   saem **1 088** lotes. Ali a entrega **viabiliza** um plano que não existia — o oposto
   do caso da amostragem completa, na mesma gleba;
2. **a entrega custa lote nas duas amostragens comparáveis** (−158 na ortogonal). No
   `ensaio-com-testada` o sinal variava; aqui é negativo onde dá para medir — e **continua
   não sendo comparável entre amostragens**, pela razão do D148.

**O que isto não decide:** o que a régua de nota do Parcelamento **deve** premiar. É do
Jonny e do motor do vizinho. O que muda é que a decisão dele agora se enuncia simples: *a
nota deve preferir o plano de 33 ou o de 1 228?* — porque **os dois estão ao alcance do
mesmo motor com a mesma entrada**.

---

## 2 · E um erro meu, que JÁ TINHA SAÍDO (D161)

No LAB-45 eu publiquei — no relatório, no recado e **no item 7 do Jonny**:

> *"Os 33 lotes são, todos os 33, lotes da beira da rua que já existe."*

**A base era o ID do lote.** O motor chama de `…-eN` os lotes da passagem externa; eu
contei ids e chamei aquilo de *"beira da rua"*.

| distância do lote à testada | quantos dos 33 |
|---|---|
| **≤ 0,5 m** — encostam | **14** |
| 1 a 5 m | 1 |
| 5 a 20 m | 1 |
| 20 a 50 m | 2 |
| **> 50 m** | **15** |

A distância máxima é **1 805,7 m** — o outro canto de uma gleba de 141,8 ha. E o padrão se
repete nas três amostragens: **50 e 16**, **49 e 16**, **33 e 14**.

> **`-eN` é rótulo. Distância é a coisa.**

**Terceira vez desta sub-família** — D148 (posição no ranking não é identidade), D155
(comentário não é código), esta (id não é geometria) — e **a primeira desde o D119 que já
havia saído** para o chat e para a página do Jonny. As doze anteriores, sete delas foram
pegas dentro do próprio prompt.

**O que segue de pé:** os 33 são **todos** da passagem externa, 29 acusados pelo
invariante `frente`, somando 1,03 ha (~310 m² cada) — a leitura *"poucos lotes grandes"*
continua enfraquecida **por área**, não por posição. **O que cai:** *"todos na beira da
rua"*.

**Corrigido, não apagado:** o item 7 e o §4 do LAB-45 trazem a frase **riscada** com a
medição ao lado. Apagar tiraria do registro a única coisa útil que o erro tem. E a
ferramenta publica agora a **distribuição de distâncias**, não a contagem de ids.

---

## 3 · Para o Laboratório de Parcelamento — lista numerada, nunca commit lá (§4)

1. **Por que a passagem externa põe lote a 1,8 km da face entregue?** `facesLoteamento`
   entregou **uma** face, de **180 m**, e saíram 33 a 50 lotes com id `-eN`, dos quais 14
   a 16 encostam nela. Pode ser que `facesLoteamento` signifique algo mais amplo para o
   motor, pode ser que a passagem externa corra o perímetro inteiro. **Não medi, e não
   acuso** — é pergunta.
2. **A nota premia um plano de 33 lotes sobre um de 1 228 na mesma entrada** — e o de
   1 228 é o que o próprio motor desenha quando o formato é fixado em ortogonal. Se isso
   é intencional, não há nada a fazer; se não, é na régua de nota.
3. **Sem a testada, a espinha com 2 variantes não entrega nada aceitável em Antonina** —
   e com ela entrega 1 088 lotes. O dado é favorável a vocês, e vai dito.

---

## 4 · Entrega

| o quê | onde |
|---|---|
| a ferramenta (`bun run lab46`) | `external-engines/esteira/ferramentas/lab46.ts` |
| a prova: 3 amostragens × 2 pernas, com a distribuição de distâncias | [`../provas/LAB-46/antonina-tres-amostragens.json`](../provas/LAB-46/antonina-tres-amostragens.json) |
| o item 7 do Jonny: a resposta, e a correção riscada | `docs/PENDENCIAS_JONNY.md` |
| o aviso de correção no relatório do LAB-45 | [`LAB-45.md`](LAB-45.md) |
| decisões | **D160**, **D161** · `CLAUDE.md` §6 agora tem **treze** linhas |

**Verde:** `./external-engines/conferir.sh` — 7 passos, exit 0.

**Os clones vizinhos ficaram limpos** — `git status --porcelain` vazio nos três.

**O que NÃO foi medido, e vai declarado:** `antonina-com-via`. Ela tem **via desenhada**
além da testada, e a via desenhada muda o ângulo do partido (D127) — duas variáveis de uma
vez responderiam outra pergunta, que é a disciplina do D149.
