> ## ✅ FEITO — **LAB-93**, no disparo das 23:06 de 11/10/2026 (entregue em 12/10)
>
> **Relatório:** [`docs/relatorios/LAB-93.md`](../relatorios/LAB-93.md) · **prova:**
> [`docs/provas/LAB-93/as-cinco-passagens.json`](../provas/LAB-93/as-cinco-passagens.json) ·
> **decisões:** D306 a D311.
>
> **O que foi feito, com arquivo e linha:**
>
> 1. **os quatro campos entregues** — o mapa, o que cada um decide, onde o motor o consome e a
>    procedência com `sha256` por trecho: `external-engines/testfit/adapter/src/legais-do-contrato.ts`.
>    A ponte passou a entregar os **três** que o contrato publica (`ida.ts:452-471`), e o quarto sai
>    `null` porque o `ParametrosV1` não declara a origem dele (`contrato-v1.ts:121-135`, treze campos);
> 2. **as passagens, CINCO e não duas** — `external-engines/esteira/src/passagens-dos-legais.ts`
>    (as cinco passagens, a impressão digital da GEOMETRIA e a conta com veredicto por campo) e
>    `external-engines/esteira/ferramentas/lab93.ts` (`bun run lab93`). **Delta de geometria: ZERO em
>    9 de 9 glebas**; o que nasceu foram avisos do motor sobre pista curta;
> 3. **as três perdas relidas, nomeadas e datadas** —
>    `external-engines/esteira/src/perdas-remedidas.ts`. Duas saíram da lista e viraram destino
>    `traduzido` (`inventario-das-idas.ts`); a terceira fica. As duas que saíram criaram promessa
>    nova, e a fixture `docs/fixtures/glebas-que-exercem-as-promessas/ensaio-com-rampa.entrada.json`
>    é quem a exercita (o universo foi de 60 para 62);
> 4. **a pergunta que o item acrescentou:** respondida **contra mim** — as duas coisas **não** eram
>    verdade ao mesmo tempo. Duas linhas do caso-válido do LAB-92 saíram **riscadas**
>    (`premissas-identicas.ts`), e a linha que liga as duas listas está escrita lá;
> 5. **travas:** `tests/legais-do-contrato.test.ts` (20, no portão) e
>    `tests/assinatura-da-geometria.test.ts` (5, fora dele porque usa a `impressao` do motor).
>    Portão: 39 → **40 arquivos**, 641 → **666 travas** — e o 666 é **medido por execução**: eu escrevi 661 somando de cabeça e a trava dos quatro lugares não desmentiu, porque ela os conferia **entre si** (D311).
>
> **O que o item pediu e eu NÃO pude dar:** o número da D226 (21,63 % → 17,92 %) **não reproduz**,
> e o campo que ela acusou é `null` na gleba citada. Ficou riscado **com a medição ao lado e sem
> culpado novo** — inventar a causa de um número que eu não tenho seria pior do que dizer que não
> sei.

# 026 — A D226: entregue os quatro campos de `legais` e meça as DUAS passagens

> **Vem da direção, 11/10/2026 às 18h38 UTC (varredura do chão).** **A escolha é
> SUA, não minha:** o recado do LAB-92 fecha dizendo *"Próximo na fila: a D226 (os
> quatro campos de `legais`)"*, e a §4 da minha rotina manda preferir a escolha que
> a casa já fundamentou. Este item só a autoriza e acrescenta **uma pergunta** que
> saiu de cruzar duas medições suas de rodadas diferentes.

## O que a D226 pede, nas suas palavras

O `Terreno["legais"]` do motor do Parcelamento ganhou quatro campos —
`caixaViariaMinima_m`, `faceQuadraMaxima_m`, `rampaMaximaDeVia_pct` e
`declividadeMaximaDeLote_pct` — e a ponte os manda **todos `null`**, de propósito,
com o motivo escrito ao lado em `external-engines/testfit/adapter/src/ida.ts:446`.

Você chegou a entregar os que o contrato declara e **mediu o efeito**: a rampa
máxima publicada de `ensaio-com-via` **caiu de 21,63 % para 17,92 %**. Daí a
decisão certa de não consertar em silêncio — o §4 proíbe mexer em geometria sem
medir, o §1-A proíbe ampliar escopo — e daí a frase que ficou pendurada:

> **três perdas declaradas desta ponte ficam sob suspeita de estarem velhas: o
> motor pode ter crescido por baixo delas.**

**É essa suspeita que este item manda resolver**, e é a única coisa que ele manda.

## A medição — DUAS passagens, e o número das duas publicado

1. **Entregue os quatro campos** a partir do que o contrato v1 publica, e deixe
   `null` só o que ele de fato não publica — `null` continua querendo dizer **NÃO
   MEDIDO**, nunca zero (D23);
2. **rode as duas passagens** — com e sem — nas glebas-padrão, e publique o
   **antes e o depois** de cada grandeza que se mover, como você fez com a rampa;
3. **releia as TRÊS perdas declaradas** desta ponte à luz do resultado. Perda que
   o motor já não tem **sai da lista**, com a medição ao lado; perda que continua
   **fica, remedida e datada**. *Comentário não se revalida sozinho — é a D104, e
   foi ela que deixou o `faceDeRua` envelhecer em silêncio.*

**Se entregar mudar o desenho** — e a rampa diz que muda —, **o que vale é
publicar o número, não escolher por mim.** Entregue, meça, declare o delta e diga
qual das duas passagens a esteira passa a usar **com o motivo escrito**. Se a
escolha mexer no ranking que o cliente veria, ela **para na fronteira** e vem para
a página dele.

## A pergunta que eu acrescento, e ela sai de cruzar DUAS medições suas

O LAB-92 classificou `caixaViariaMin_m` como **caso válido** — *"premissa que o
motor NÃO TEM COMO RECEBER: campo que o contrato não publica"* —, e a `ida.ts`
manda `legais.caixaViariaMinima_m: null` **para um campo que o motor tem**.

As duas coisas podem ser verdade ao mesmo tempo (o motor tem a vaga; o contrato
não tem o valor), e provavelmente são. **O que a D226 acrescenta é que a vaga
vazia NÃO é neutra:** a rampa provou que `null` ali não quer dizer *"sem limite"*
— quer dizer *"o motor aplica o default dele"*. Ou seja:

> **a lista de "caso válido" e a lista do K se encostam neste campo.** O caso é
> válido como **pedido ao dono do contrato**; o **efeito** é o mesmo do K — a
> premissa é inventada por quem recebe. *Premissa omitida não é premissa ausente*
> é a sua frase do LAB-92, e estes quatro campos são o quinto lugar onde ela mora.

**Meça se é isso.** Se for, as duas listas ganham a linha que as liga, e o pedido
ao dono do contrato ganha o número do que a omissão custa — que é o que faz um
pedido ser atendido em vez de arquivado.

## As fronteiras, e nenhuma se atravessa

- **nada escrito em repositório vizinho** — leitura na **ORIGEM**, nunca no clone
  (é a §4 e o disco-não-é-origem), e os clones terminam limpos;
- **nenhum motor se melhora** — o adendo-1 do 025 proíbe antes do lançamento, e
  este item não o revoga: entregar campo que o motor já aceita **não é melhorar o
  motor**, é parar de omitir premissa;
- **o gatilho do CI não se religa** — a régua cobra, não liga;
- **o despertador não se toca**, nem o desta casa nem o de ninguém;
- e **se o resultado virar decisão de urbanismo** (qual limite a competição usa),
  ele para na fronteira e vai para a página dele em linguagem de leigo.

## O que já está carregado, para não se remedir

A pergunta do **regime** (loteamento × condomínio) do seu LAB-92 **está na página
dele** e eu a levei; o **pedido ao Parcelamento** — publicar `tolerancia` e
`testadaExterna` — saiu nesta mesma rodada como a **caixa 026 daquela casa**, com
a sua medição citada; e o **payload do kit no `0.39.0`** já foi medido por quatro
casas: **não mandar remedir**, fechar é decisão do Jonny na Central.
