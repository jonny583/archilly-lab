> # ✅ FEITO — 09/10/2026, LAB-73
>
> Relatório: [`docs/relatorios/LAB-73.md`](../relatorios/LAB-73.md). As três respostas estão
> **medidas**, não opinadas.
>
> | a pergunta do item | a resposta, e onde |
> |---|---|
> | 1 · a trava é **estrutura** ou **palavra**? | **PALAVRA**, dito com a palavra na `CLAUDE.md` §4-A — e **quanto** ela deixa passar está contado: dos **12** compromissos de formato real ela pega **4**, **8 escapam** (`src/trava-de-estrutura.ts`) |
> | …e existe **tipo** onde a mensalidade caberia? | **AQUI NÃO HÁ ONDE** — varrido todo `.ts`/`.tsx` que o git carrega: **zero** campos de recorrência, e nenhum tipo de preço de fonte paga. Não há campo a tirar |
> | 2 · **condições de volta** sob a regra antiga | **ZERO de quinze.** As 15 são `prompt-novo` (6), `nao-medido` (3), `aguardando-outro-repositorio` (3), `escopo-novo`, `depois-do-mvp`, `aguardando-o-jonny` — todas esperam pessoa, repositório, prompt ou medição. **Nenhuma é uma conta** |
> | 3 · o **recorte**, dimensionado | `docs/PENDENCIAS_JONNY.md` **§8**, para leigo: **aqui não há fonte paga para recortar**; o tamanho é **pequeno neste app**, **médio a grande na família**, e só vale **quando houver a primeira fonte paga**. **Não foi construído** |
>
> **O exemplo do item estava errado a meu respeito, e a conclusão dele certa:** *franquia mínima*
> e *teste grátis* **não** passam pela minha régua — há padrão para os dois. Medido, o problema é
> **pior**: são outros oito que escapam. *Conferir o exemplo é o que mede o tamanho real do
> problema.*
>
> **E a régua de ESTRUTURA caiu no defeito da de palavra (D240):** ela incluía `plano` e acusou
> `plano: Plano` — **o plano de loteamento**, o objeto central desta casa. *"Campo que não existe
> não se esquece" é verdade, mas campo cujo NOME eu adivinhei tem a mesma doença, só mudada de
> lugar.* 19ª ocorrência do ponto cego da §6, pega dentro do prompt.
>
> **Nada contratado, nenhum preço inventado, o CI não religado. Verde conferido aqui, não no
> GitHub.** Guarda nova: `tests/trava-de-estrutura.test.ts`, 10 travas.

---

# A TRAVA DA COBRANÇA POR USO: a frase não protege, a AUSÊNCIA DO CAMPO protege

**Vem do chat, 09/10/2026, levando o que a Pesquisa de Mercado mediu hoje.**

Você já gravou a regra de cobrança por USO — este item não a repete. Ele traz
**três coisas medidas depois**, por quem a gravou antes de você, e as duas
primeiras pedem conferência no que você acabou de escrever.

## 1 · A trava forte é a ESTRUTURA, não a conferência de palavra

A Pesquisa escreveu a trava dela e depois percebeu o que ela de fato protege:

> **Não escreva "recusar mensalidade" numa conferência. Tire o campo onde a
> mensalidade caberia.**

O tipo de preço de fonte dela tem dois campos de dinheiro, e **os dois são por
evento**. Nunca houve campo de mês. E a razão é a mesma do `contaParaDebito` da
casa dela: **campo que não existe não se esquece.**

Por que a conferência de palavra não basta, com os dois casos concretos da
própria regra: **franquia mínima** e **teste grátis que vira cobrança** passam
por qualquer varredura de texto — nenhum dos dois diz "mensalidade" — e **não
passam por um tipo sem campo de recorrência**.

**O que fazer:** olhe a trava que você escreveu. Se ela procura palavra, diga
isso por escrito e diga o que ela **não** pega. Se o seu aplicativo tem um tipo
que representa preço de fonte paga, confira se existe campo onde um valor
mensal, uma franquia ou um mínimo caberiam — e, se existir, **o conserto é
tirar o campo**, não acrescentar aviso.

Se o seu aplicativo **não tem** tipo de preço de fonte, a resposta é "aqui não
há onde", e ela é válida — escreva assim.

## 2 · As CONDIÇÕES DE VOLTA foram escritas sob a regra antiga

Esta é a que ninguém foi procurar, e é a que mais custa.

A Pesquisa tinha uma fonte **arquivada** por cobrar assinatura, em 10/09 — um
mês antes de a regra existir —, e a decisão dela dizia que a fonte voltaria
*"quando o volume mensal pagar os US$ 10"*. Isto é **uma conta**, e a regra nova
diz o contrário: uso, mesmo mais caro.

> **Condição de volta que contradiz regra de família é condição que alguém vai
> cumprir sem perceber** — e vai cumprir achando que está obedecendo, porque
> estava escrita por nós.

**O que fazer:** procure, nas suas decisões e nos seus itens parados ou
arquivados, toda **condição de retorno** que fale de volume, de ponto de
equilíbrio ou de "quando compensar". Releia cada uma contra a regra nova.
Corrija as que contradizem, dizendo o que a condição era antes — não apague.

**"Nenhuma delas fala de volume"** é resposta, e é a boa.

## 3 · O requisito de arquitetura: três casas mediram e NENHUMA o tem

A regra pede que fonte paga possa ser **ligada e desligada por recorte** — por
estado, por conta, por operação — **sem tocar em código**. Medido em três
aplicativos hoje: o liga/desliga existe, e o **recorte** não. O status mora em
código, e mudá-lo é um envio e um build.

Isso é **obra**, não conserto, e **não se faz neste item**. Registre o tamanho
dela em quem depende do Jonny, com o que ela destrava, e siga.

## O que NÃO fazer

- **Não contrate nada, não abra conta, não cadastre chave, não inicie teste** —
  nem para testar. A regra é explícita: nenhuma sessão contrata.
- **Não invente número de preço** para preencher tabela. E a mesma falta, numa
  forma que o Orçamento pegou hoje: **inventar valor de vocabulário fechado é
  tão ruim quanto inventar número** — ele escreveu numa régua uma palavra que a
  régua não conhecia, e a suíte o corrigiu.
- **Não religue a conferência do GitHub.**

## Como sei que deu certo

A sua trava tem uma frase dizendo **se ela é estrutura ou palavra**, e o que ela
não pega. As condições de volta foram varridas, com o número delas escrito —
inclusive se for zero. E a obra do recorte está dimensionada em vez de prometida.
