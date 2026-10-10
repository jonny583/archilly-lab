> ✅ **FEITO no LAB-81**, em 10/10/2026, no despertador das 09:06. Relatório em
> [`../relatorios/LAB-81.md`](../relatorios/LAB-81.md), prova em
> `docs/provas/LAB-81/as-leituras.json`, decisões **D269 a D272**.
>
> **Antes de executar, medi a premissa — e ela estava um passo atrás.** Das três leituras que este
> item lista, **uma já estava pronta**: o `src/trava-de-estrutura.ts` foi passado para
> `lugaresDaPagina + afirmadoNaLinha` **no próprio LAB-80**, e foi ali que o D266 nasceu. O item foi
> escrito às 08h40 a partir do meu relatório, e o relatório descrevia o estado de antes daquela
> parte da rodada. *Item escrito a partir de um registro herda a idade do registro* (D269) — não é
> erro seu, é a forma do atraso. O escopo real foram **duas**.
>
> **E a sua fronteira foi acionada: UMA precisa ser diferente.** A `tests/verde.test.ts` varre o
> `conferir.sh` — um script de shell — e **a crase é o DADO dela**: ela extrai o caminho de dentro
> da crase para conferir no disco. Medido com a mentira plantada:
>
> | limpeza | na mentira | na citação |
> |---|---|---|
> | `semCitacoes` (a dela) | nega ✔ · acha `.github/workflows/verde.yml` ✔ | passa ✔ |
> | `semRiscadoNemCitado` | nega ✔ · acha **ZERO caminhos** ✘ | passa ✔ |
>
> A mais forte **cega a trava no caso exato para que ela nasceu**, e *parece* mais rigorosa — nega
> igual, deixa a citação passar igual, e só o dado desaparece. E `lugaresDaPagina` sobre aquele
> `.sh` devolve **0 de 147**: ali a leitura de Markdown é um nada, não um ganho. Ela fica com a
> leitura dela, com o motivo na tabela, no comentário **e numa trava que reprova se a
> `semRiscadoNemCitado` passar a preservar a crase** — porque nesse dia a UMA declarada perde o
> motivo. *Cinco iguais por conveniência é pior que quatro iguais e uma declarada.*
>
> **A ORDEM QUE VOCÊ MANDOU É O QUE SEPAROU O CONSERTO DO DESLIGAMENTO.** Na ordem inversa eu teria
> visto "a citação passa, o riscado passa, a cerca passa" — tudo verde — e entregado uma trava cega.
>
> **A quarta forma que você convidou apareceu, e não é uma forma:** a cerca, o `>` e o riscado nunca
> carregam o objeto da régua; **a crase carrega**. É a única marca de *"só mostra"* que às vezes é
> *"isto é o que eu vim medir"* — e é por isso que a família tem seis membros com perguntas
> declaradas, em vez de uma função com um argumento (D270).
>
> **O buraco comum, fechado:** `soAProsa()` tira citação **e bloco de código**. Nas seções de regra
> da `CLAUDE.md` são **20 linhas em bloco**, **17 na §1** — o molde do recado, exemplo e não regra
> sobre o recado. O veredito da régua dos limites é `[]` antes e depois, então a sua fronteira do
> veredito não foi tocada; e porque **vazio não prova nada**, a prova é plantada nos dois sentidos.
>
> **E há guarda contra a SEXTA nascer** (D271): *unificar sem guarda conserta o passado e deixa o
> futuro exatamente igual.* Ela varre todo `.ts` que o git carrega e reprova quem DEFINIR uma das
> leituras fora da casa — lendo os nomes que o código **usa**, não o texto, senão ela seria a sétima
> da família do D142/D155, acusando o arquivo que documenta a duplicação.
>
> **Coincidência casada como invariante:** procurei, e a desta rodada estava nos contadores da lista
> de propostas. Ao executar esta proposta, a lista caiu de 17 para 16 itens abertos — e **cinco
> lugares** contam esse número. Os cinco andaram juntos, com o motivo escrito em cada um.

# 014 — as TRÊS leituras que faltam: terminar a régua que ninguém terminou

> **Vem do chat, 10/10/2026 às 08h40.** A sua caixa esgotou com a 013. A
> escolha é **sua proposta**, saída do **LAB-80**, com a sua frase dentro:
>
> > *"Cinco respostas para a mesma pergunta não são cinco réguas: são uma régua
> > que ninguém terminou."*

## Por que esta, e por que não a outra

A outra proposta aberta — **parar a fileira externa no fim da face declarada**
— você mesma marcou: *"mexer no plantio muda o desenho, e desenho espera o olho
do Jonny"*, e **"não é medição que falta: é uma pessoa que decide"**. Ele dormiu
às 03h52. Ela fica onde está, e está certa onde está.

Esta é régua, não desenho. E é a que o **D231** descreve: *conserto que não
entra em todos os instrumentos que leem a mesma coisa é meio conserto.*

## O que o LAB-80 já fez, e o que falta

**Feito:** a leitura nova mora em `src/texto-das-regras.ts`, e o
`semRiscadoNemCitado()` **saiu de dentro** do `moldura.test.ts` para lá, com
aquela trava passando a importá-lo. **Duas das cinco.**

**Falta:**

| onde | o que lê hoje |
|---|---|
| `tests/verde.test.ts` | um `semCitacoes` **local**, só citação curta |
| `src/limites-com-sujeito.ts` | `semCitacoes()` — tira a **linha** de citação |
| `src/trava-de-estrutura.ts` | `/^\s*>/` **inline** |

**Três arquivos, e as travas de três deles.** É o tamanho que você mesma
declarou; não é surpresa, é escopo.

## O buraco que as cinco tinham em comum, e ele é o alvo

**Nenhuma das cinco conhecia o BLOCO DE CÓDIGO** — e foi por isso que a
varredura de custo acusou o `RECADOS.md` por duas linhas que são **recado
gravado**.

Então a leitura unificada precisa saber **três formas de "só mostra"**, não uma:

1. a **linha** de citação (`>` no começo);
2. o `>` e o riscado **no meio** da frase — que é o que o `comoARegraSeLe()` já
   resolve;
3. o **bloco de código**, que nenhuma das cinco via.

Se houver uma quarta forma que você encontre medindo, **ela entra**, e o fato de
ter aparecido agora é achado: *a pergunta não é "esta leitura está certa hoje?",
é "o que teria de aparecer no texto para ela errar?"* — a sua própria lição do
LAB-80, item 1 do recado da 013.

## O cuidado que decide se o conserto vale

**Prove pelos DOIS lados, nesta ordem — e a ordem é da Central, de hoje:**

1. primeiro que cada régua **continua achando o que achava** (o valor escrito
   dentro de uma frase, que é como o extrato vazou de verdade);
2. depois que **deixou de achar o que não devia** (a citação, o riscado, o
   bloco).

> **Na ordem inversa, um desligamento passa por conserto.**

E a sua própria, da 013: **coincidência casada como invariante**. Se alguma
trava conferir uma igualdade que vale *"porque hoje o número é esse"*, ela vai
quebrar quando o mundo melhorar — pergunte **o que teria de acontecer para ela
deixar de valer, e se isso é uma piora**.

## Pare na fronteira se

- unificar mudar o **veredito** de alguma das três travas sobre o código de
  hoje. Mudança de veredito não é efeito colateral: é **achado ou defeito**, e
  precisa de nome antes de passar;
- a quinta leitura revelar-se **diferente de propósito** — isto é, se alguma das
  três *precisa* ser mais frouxa ou mais rígida que as outras. Se precisar,
  **escreva o motivo ao lado dela** e deixe-a de fora. Cinco iguais por
  conveniência é pior que quatro iguais e uma declarada.

## Conferência

`./external-engines/conferir.sh` — os sete passos, com as duas guardas de
cobertura e precondição. **Declare "conferido aqui, não no GitHub"**, com o
número de travas, como você vem fazendo.

## A regra do chat até hoje às 15h

**Nenhuma pergunta ao Jonny.** O que for decisão dele vira linha em
`docs/PENDENCIAS_JONNY.md` e o trabalho segue pelo caminho mais conservador,
dizendo o que você assumiu.
