# LAB-27 · O documento vivo — primeira atualização, e a regra do contínuo

**03/10/2026 · sem ferramenta própria: este prompt não mede, ele carrega o que
outros mediram.**

O LAB-27 pede duas coisas: **manter**
[`../O_QUE_FALTA_MEDIR_POR_MOTOR.md`](../O_QUE_FALTA_MEDIR_POR_MOTOR.md)
atualizado e **avisar quando mudar**. Ele é **contínuo** — não tem entrega única.

---

## 1 · O que mudou no documento

O LAB-26 produziu dois achados que são **sobre o motor do vizinho**, e não sobre o
Lab. Os dois entraram:

| seção | o quê |
|---|---|
| **§1-B** (nova) | a ficha de capacidades do Lab dizia, **por escrito e para fora**, que o motor do Parcelamento ignora o ponto de acesso. É falso — **703 → 603 lotes** quando o acesso se move 992,6 m — e o erro era do Lab |
| **§1-C** (nova) | eles **publicam** `MOTOR_NOME` e `MOTOR_VERSAO`, e a ponte do Lab escreve outros dois. Mesma forma do D104, um nível acima |
| **§6** (ampliada) | a estatística do LAB-26: das 15 declarações da ficha, **três não tinham experimento**, e a falsa estava numa delas. Um em três |

**Por que o §1-B é aviso e não conserto calado:** aquela ficha é **voltada para
fora**. Enquanto dizia `false`, qualquer leitura da porta do Lab atribuiria ao motor
deles uma limitação que ele não tem. Consertar em silêncio deixaria a atribuição
errada circulando sem que o dono dela soubesse.

**E o §1-C traz a única pergunta que o documento faz hoje ao Parcelamento:** o
`MOTOR_VERSAO` deles diz *"sobe quando o desenho muda de forma que o Generate
veja"*, e está em `1.0`. Entre o T00-A e o T05 o desenho mudou de forma visível ao
Generate **pelo menos duas vezes** — o greide do T03 e a via de frente do T02, as
duas que o Lab mediu. Se a versão não subiu nessas, **ela não serve para o Lab saber
que precisa remedir** — e é exatamente para isso que o Lab quer usá-la.

---

## 2 · A regra do contínuo (D111)

Um item que nunca acaba pode manter um despertador vivo para sempre: ele acorda,
declara *"o LAB-27 está pronto"*, não acha nada e se mantém. É o desperdício que a
D62 mediu — **4 dos 7 disparos de 15/09 sem o que fazer**.

A regra ficou escrita na fila, para quem acordar depois:

> **O LAB-27 só é item pronto quando há mudança para carregar.** Sem mudança,
> **não há item pronto**: vale a D62 — gravar o recado, escrever o motivo em
> `ONDE_PARAMOS` e **apagar o despertador**.

**Neste disparo havia mudança**, e é por isso que ele foi executado. **No próximo,
previsivelmente, não haverá**: a fila de 03/10 está cumprida e os três achados
novos estão *"proposto ao chat"*, sem execução.

---

## 3 · O que NÃO entrou

- **O conserto da identidade** (ler `MOTOR_NOME`/`MOTOR_VERSAO` do próprio motor).
  Muda o que viaja no contrato, alcança provas congeladas do LAB-02 e do LAB-07 e o
  rótulo que o Generate mostra na mesa. **Proposto ao chat.**
- **A sensibilidade ao acesso na tabela comparativa.** É a entrada de maior efeito
  que o Lab mede e ninguém a mede. **Proposto ao chat.**
- **A guarda da IDA.** **Proposto ao chat**, desde o LAB-25.

Prompt fora da fila não existe, e ampliar escopo num prompt cujo trabalho é
*carregar recado* seria o pior lugar para começar.

---

## 4 · Conferência

- **`./external-engines/conferir.sh` verde nos dois pacotes** — 247 testes
  (233 + 14), `typecheck` e `lint` limpos em ambos. Nenhum código mudou neste
  prompt: a conferência roda porque *"testes verdes"* passou a ser uma afirmação
  sobre os dois pacotes (D110), e afirmação que não se confere é o assunto desta
  semana inteira.
- **Clones vizinhos limpos:** `git status` em `motor-testfit`,
  `urban-create-hub-41d93a4d` e `urban-scout-tool` — **sem nenhuma alteração**. O
  documento é lista, não commit.
- **Mesclado por PR**; o despertador acordou **com** os conectores do GitHub.
- **Decisão:** D111 (o contínuo não mantém despertador vivo sem mudança).
