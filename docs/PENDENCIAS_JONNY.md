# Pendências do Jonny — Archilly Lab

**Este arquivo é a fila única do que depende de uma pessoa.** Se precisa de
você, está aqui. Dívida técnica **do código** é minha e não entra nesta lista.

Quem escreve: o Claude, a cada rodada. **Quem risca: você.** Item resolvido é
marcado, nunca apagado — para a decisão não se perder.

Atualizado em **14/09/2026**, no fim do LF-01.

**Os endereços, prontos para clicar:**

- repositório: <https://github.com/jonny583/archilly-lab>
- onde paramos: [`docs/ONDE_PARAMOS.md`](https://github.com/jonny583/archilly-lab/blob/main/docs/ONDE_PARAMOS.md)
- índice de tudo: [`docs/INDEX.md`](https://github.com/jonny583/archilly-lab/blob/main/docs/INDEX.md)
- a fila: [`docs/prompts/FILA.md`](https://github.com/jonny583/archilly-lab/blob/main/docs/prompts/FILA.md)
- o relatório da última medição: [`docs/relatorios/LAB-07.md`](https://github.com/jonny583/archilly-lab/blob/main/docs/relatorios/LAB-07.md)

---

## A lista encolheu: o chat já decidiu três coisas

Em 14/09 o Claude do chat tomou três decisões que estavam nesta lista esperando
por você. **Elas já valem** — o que sobrou para você são duas confirmações, e
nenhuma trava a fila. Se você não disser nada, o trabalho continua com as
decisões do chat.

| # | o que | quanto custa | o que muda se você mudar |
|---|---|---|---|
| **1** | **Confirmar que a calçada é da rua**, e não do lote | 2 min | o tamanho do lote e quantos cabem na gleba |
| **2** | **Confirmar quais traçados podem aparecer na tela** | 2 min | o que o cliente vê como opção |

---

## 1 · A calçada é da rua — confirme ou mude

**O que o chat decidiu:** a calçada fica **dentro da caixa da rua** (a faixa de
domínio), **nunca descontada do lote**.

**O que eu tinha medido, e por que a pergunta existia.** O motor declara duas
medidas por rua: a **caixa** (de meio-fio a meio-fio) e a **calçada** (o passeio
de cada lado). Parecia que a rua fosse a soma das duas. Medi: o canto mais
próximo de cada lote fica a exatamente **metade da caixa** do eixo — 5,00 m para
uma rua de 10 m, em 223 dos 441 lotes conferidos. O lote encosta no meio-fio, e
não havia terra reservada para a calçada prometida.

Havia dois caminhos, e os dois mudam quantos lotes cabem no terreno:

- **(a) o lote recua** — a calçada sai da terra do lote. Lote menor.
- **(b) a caixa já inclui a calçada** — o passeio sai da rua. Lote como está.

**O chat escolheu (b), e é o que já está valendo em todas as medições.** Se para
você o certo é (a), me diga: eu refaço a conta e o número de lotes muda.

Onde está o número: [`LAB-07.md`, §4](https://github.com/jonny583/archilly-lab/blob/main/docs/relatorios/LAB-07.md).

---

## 2 · Quais traçados podem aparecer na tela — confirme ou mude

**O que o chat decidiu:** na tela de qualquer aplicativo da família só entra
traçado que **passe no conferente**. Hoje, **só o `pente`**. Os traçados
`cluster` e `organico` ficam **fora** até os números deles caírem para um
patamar aceito.

**Por que essa régua.** Rodei os dez traçados do motor, 60 opções no total, e
passei tudo pelo conferente do Generate:

| traçado | lotes | reprovações | leitura |
|---|---|---|---|
| `pente` | 3 394 | **2** | impecável |
| `diagonal`, `mioloVerde`, `ortogonal`, `espinha` | 17 239 | 335 | abaixo de 3 % |
| `loop` | 3 418 | 179 | 5 % |
| **`cluster`** | 3 976 | **3 092** | **78 % dos lotes com a frente fora da medida** |
| **`organico`** | 374 | **524** | **165 lotes desenhados em cima de outros lotes** |
| `radial` | — | — | **recusado nas 6 tentativas**: lote pisando fora da divisa |

Lote em cima de lote não é acabamento ruim — é planta inválida.

**O que eu preciso de você:** se você usa `cluster`, `organico` ou `radial` na
tela hoje, me diga — porque pela decisão do chat eles somem do menu até
melhorarem, e é melhor você saber disso antes de sentir falta. Se nunca usou,
não precisa responder nada.

**Observação sobre os quatro do meio** (`diagonal`, `mioloVerde`, `ortogonal`,
`espinha`, e o `loop`): eles estão abaixo de 5 %, mas pela decisão do chat só o
`pente` está liberado hoje. O LAB-02 vai medir de novo depois do recorte, e é
bem possível que quase todos passem — a maior parte das reprovações é de lote
que perde a frente por causa de rua que nasce fora do terreno.

---

## 3 · O que **não** depende mais de você

- **A superquadra vazia** — decidido pelo chat: é defeito de pontuação do motor
  (variante inválida), não escolha de urbanismo. Já foi mandado ao laboratório
  de parcelamento como conserto do T02. Nada para você fazer.
- **Colar os recados nos repositórios vizinhos** — saiu da sua lista. Por
  decisão do chat, o repasse dos achados para o Generate e para o laboratório de
  parcelamento é do chat, não seu e não meu.
- **A fila do laboratório** — ela agora anda sozinha. Um despertador acorda este
  repositório de hora em hora, ele pega o próximo item da fila e executa até o
  fim. Você não precisa mandar mensagem para o trabalho continuar.

---

## Já resolvidos — não precisa fazer nada

- ~~**A calçada: sai do lote ou da rua?**~~ — **decidido pelo chat em 14/09:**
  é da rua, dentro da caixa. Sobrou a confirmação (item 1 acima).
- ~~**Dois partidos quebrados: você usa?**~~ — **decidido pelo chat em 14/09:**
  só vai à tela quem passa no conferente. Sobrou a confirmação (item 2 acima).
- ~~**A superquadra nasce vazia — o que fazer?**~~ — **decidido pelo chat em
  14/09:** defeito de pontuação, já mandado ao T02. Nada para você.
- ~~**Colar dois recados nos repositórios vizinhos**~~ — **passou para o chat em
  14/09.**
