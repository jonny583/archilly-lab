# Pendências do Jonny — Archilly Lab

**Este arquivo é a fila única do que depende de uma pessoa.** Se precisa de
você, está aqui. Dívida técnica **do código** é minha e não entra nesta lista.

Quem escreve: o Claude, a cada rodada. **Quem risca: você.** Item resolvido é
marcado, nunca apagado — para a decisão não se perder.

Refeito do zero em **14/09/2026**, no fim do LF-FINAL. Atualizado em
**15/09/2026**, depois da sua resposta sobre a travessia.

**Os endereços, prontos para clicar:**

- repositório: <https://github.com/jonny583/archilly-lab>
- onde paramos: [`docs/ONDE_PARAMOS.md`](https://github.com/jonny583/archilly-lab/blob/main/docs/ONDE_PARAMOS.md)
- índice de tudo: [`docs/INDEX.md`](https://github.com/jonny583/archilly-lab/blob/main/docs/INDEX.md)
- os recados, em ordem: [`docs/relatorios/RECADOS.md`](https://github.com/jonny583/archilly-lab/blob/main/docs/relatorios/RECADOS.md)

---

## Em cinco minutos

**Você respondeu a pergunta da ponte** — obrigado. A resposta está gravada e
valendo (D61): travessia sobre área de preservação é **exceção**, tenta-se
primeiro contornar, e quando ela for mesmo necessária sai **a mais curta e
perpendicular ao rio**, aparecendo na tela e virando **item de custo**.

**A sua resposta abriu uma pergunta nova**, e é a única coisa que depende de
você agora:

| # | o que | quanto custa | o que muda se você responder |
|---|---|---|---|
| **1** | **Quanto é "desvio desproporcional"?** — o número que decide quando contornar o rio deixa de valer a pena e a ponte entra | 3 min | sem ele o motor **não propõe travessia nenhuma**, por precaução |

Enquanto ele não vier, nada quebra: o desenho continua como está, com os dois
lados servidos cada um pela sua entrada.

---

## 1 · Quanto é "desvio desproporcional"?

**O que a sua regra diz.** A rua tenta primeiro dar a volta na área de
preservação. Só quando esse contorno for **desproporcional** é que a travessia
entra. Isso está certo e é o que vou seguir.

**O que falta.** *Desproporcional* precisa virar número, e número de urbanismo é
seu. Em Antonina, para você sentir o tamanho: os dois lados chegam a **72 metros
um do outro** no ponto mais próximo, mas o contorno por fora do rio é uma volta
muito maior — e "muito maior" é exatamente o que eu não posso decidir sozinho.

**Três formas de responder, qualquer uma serve** — escolha a que fizer sentido
para você:

- **por proporção:** "a ponte entra quando o contorno for mais de **N vezes** a
  travessia direta" (por exemplo, 5 vezes: a travessia de 72 m só se justifica se
  a volta passar de 360 m);
- **por distância:** "a ponte entra quando o contorno passar de **N metros**";
- **por tempo de percurso**, se for assim que você pensa a coisa.

**Enquanto não vier, o que acontece:** nenhuma travessia é proposta. É a escolha
mais conservadora, e é reversível — no dia em que o número chegar, o desenho é
refeito e a diferença aparece medida.

---

## 2 · ~~O rio corta o terreno de Antonina em dois. Pode haver ponte?~~ — **você respondeu em 15/09/2026**

**A sua resposta, e ela já está valendo:** a travessia é **exceção, não padrão**.
O motor tenta ligar os dois lados **por fora** da área de preservação; só propõe
ponte ou bueiro se a volta for desproporcional; quando propuser, faz a
**mais curta e perpendicular ao rio**, mostra na tela, e lança o custo dela
(ponte ou bueiro) para o aplicativo de orçamento.

Uma coisa a confirmar quando puder, de um segundo: **o nome do aplicativo de
orçamento veio cortado** na mensagem ("para o Or…"). Não adivinhei o destinatário
— está registrado como pendência de confirmação.

O que segue abaixo é a pergunta como ela foi feita, para o registro não se
perder.

**O que eu vi.** Ao desenhar as ruas de Antonina, elas saíram em **duas redes
separadas**, que não se falam. Não é um defeito do desenho: eu medi.

O terreno tem um **curso d'água com área de preservação de 14,4 hectares**
atravessando-o. Toda rua que ligava um lado ao outro passava por cima dele, e o
laboratório as cortou fora — porque a regra que você já deu é que rua não entra
em área de preservação.

**O tamanho da coisa:**

- de um lado, **43 km de rua**; do outro, **17 km**;
- o ponto onde os dois lados mais se aproximam tem **72 metros de distância** —
  e esses 72 metros são **quase todos dentro da área de preservação**.

**A pergunta, em uma linha:** *neste loteamento, pode haver uma travessia sobre o
curso d'água — uma ponte ou um bueiro — ou os dois lados ficam servidos cada um
pela sua entrada?*

- **Se pode:** eu religo as duas redes e o terreno vira um loteamento só.
- **Se não pode:** fica como está, e o relatório passa a dizer que os dois lados
  são dois loteamentos vizinhos, cada um com o seu acesso pela estrada de fora.

**Não estou decidindo nem um nem outro.** Enquanto você não disser, o desenho
fica como está — em dois —, que é o que a regra atual manda.

Onde está o número:
[`LAB-05.md`, §1](https://github.com/jonny583/archilly-lab/blob/main/docs/relatorios/LAB-05.md).

---

## 3 · ~~A calçada é da rua~~ — **confirmado pelo chat em 15/09/2026**

**O que está valendo:** a calçada fica **dentro da caixa da rua** (a faixa de
domínio), **nunca descontada do lote**. Decisão do chat, de 14/09.

**Por que a pergunta existiu.** O motor declara duas medidas por rua: a **caixa**
(de meio-fio a meio-fio) e a **calçada** (o passeio de cada lado). Parecia que a
rua fosse a soma das duas. Medi: o canto mais próximo de cada lote fica a
exatamente **metade da caixa** do eixo da rua — 5,00 m para uma rua de 10 m, em
223 dos 441 lotes conferidos. O lote encosta no meio-fio, e não havia terra
reservada para a calçada prometida.

Havia dois caminhos, e os dois mudam quantos lotes cabem no terreno:

- **(a) o lote recua** — a calçada sai da terra do lote. Lote menor, passeio
  garantido.
- **(b) a caixa já inclui a calçada** — o passeio sai da rua. Lote como está.

**O chat escolheu (b), e em 15/09 confirmou.** É o que está em todas as
medições, inclusive nas do LAB-04. Se um dia o certo para você for (a), me diga:
eu refaço a conta, e o número de lotes muda.

Onde está o número: [`LAB-07.md`, §4](https://github.com/jonny583/archilly-lab/blob/main/docs/relatorios/LAB-07.md).

---

## 4 · O que **não** depende de você

Isto está aqui para você não ficar procurando.

- **Quais traçados podem aparecer na tela** — decidido pelo chat: só entra quem
  passa no conferente. Depois das correções do laboratório de parcelamento,
  **o `pente` chegou a zero reprovações** e outros quatro ficaram abaixo de 3 %.
  Continuam fora `cluster`, `organico` e `radial`.
- **A superquadra que nasce vazia** — decidido: é defeito de pontuação do motor,
  já mandado como conserto. Nada para você.
- **Levar os achados aos outros aplicativos** — é do chat, não seu e não meu.
- **A fila do laboratório** — o chat escreveu uma nova em 15/09 (LAB-04, LAB-05
  e uma conferência final). O laboratório a executa sozinho.

---

## 5 · O que o laboratório descobriu e ainda não foi repassado

Não é pendência sua — **é do chat**. Fica registrado aqui para você saber que
existe, em uma linha cada:

- **O conferente do Generate não olha a rampa das ruas** de um motor de fora. A
  régua existe lá dentro, mas roda só no motor dele; e o arquivo de troca só
  carrega a rampa *média*, que esconde um pico de 161 % num cruzamento.
- **O quadro de áreas de referência do Generate, na gleba de ensaio, não
  fecha:** ele soma 15,8 % mais terra do que o terreno tem, porque anuncia 7 ha
  de área de preservação num terreno que declara nenhuma.
- **O jeito de o Generate calcular a altura do terreno faz o traçado virar
  grade** e parar de acompanhar o morro — e, em terreno plano, inventa curva
  onde não há.

---

## Já resolvidos — não precisa fazer nada

- ~~**Você usa `cluster`, `organico` ou `radial` na tela?**~~ — **decidido pelo
  chat em 14/09**, e desde então o laboratório de parcelamento corrigiu vários
  traçados. Não precisa mais de resposta.
- ~~**A superquadra nasce vazia — o que fazer?**~~ — **decidido em 14/09**:
  defeito de pontuação, mandado como conserto.
- ~~**Colar dois recados nos repositórios vizinhos**~~ — **passou para o chat em
  14/09.**
- ~~**A calçada: sai do lote ou da rua?**~~ — **decidido em 14/09** e
  **confirmado em 15/09**: é da rua. Está fechado — é o item 2 acima, riscado.
