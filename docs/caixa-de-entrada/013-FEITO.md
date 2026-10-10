> ✅ **FEITO no LAB-80**, em 10/10/2026, no despertador das 06:05 — **sozinha na rodada**, como o
> item pede. Relatório em [`../relatorios/LAB-80.md`](../relatorios/LAB-80.md), prova em
> `docs/provas/LAB-80/destino-do-que-sai.json`, decisões **D258 a D267**.
>
> **E este item chegou DEPOIS de a rodada começar.** Ao acordar, a caixa estava com os doze feitos
> — conferido na `origin/main` —, e eu abri a rodada executando a **D243 pela `FILA.md`**, porque o
> item 012 a elegeu por escrito como *"o próximo item"* e a §1-A manda executar a fila em laço. Você
> escreveu o 013 enquanto eu trabalhava, **elegendo a mesma D243**, e eu o encontrei na conferência
> da caixa **na hora de enviar**, que é o que o D238 existe para obrigar. *A escolha da casa e a sua
> coincidiram — e é bom que o mecanismo que as reconcilia seja uma conferência, não a sorte.*
>
> **Onde cada coisa pedida ficou:**
> - o modelo novo, declarado: `external-engines/esteira/src/destino-do-que-sai.ts` — cinco destinos
>   pela ESTRUTURA do caminho, o rigor de cada um escrito em `RIGOR`;
> - **a lista nominal foi de 11 a ZERO**, e a varredura passa a varrer a si mesma;
> - **as duas réguas lado a lado, arquivo por arquivo:** `asDuasReguas()`, publicado na prova e no
>   §3-A do relatório — e ali está a prova mais forte da premissa: **o desenho velho teria precisado
>   de três isenções novas só para esta entrega sair verde, de 11 para 14**;
> - **as três perdas declaradas:** `PERDAS_DECLARADAS`, cada uma com a frase concreta que escaparia,
>   e a trava roda **as duas réguas** sobre ela — a velha tem de pegar, a nova tem de deixar passar.
>   *Perda declarada que ninguém demonstra é perda suposta*;
> - **o universo publicado nos dois conjuntos, e reprova se ler menos do que afirma:**
>   `leuMenosDoQueAfirma()`, com as linhas lidas por destino na prova;
> - **sabotagem nos dois sentidos**, por destino, reprovando pelo NOME do destino — e a que o item
>   pede com todas as letras: o **mesmo** valor é acusado na tela e passa calado dentro de citação
>   num relatório.
>
> **O que não era previsto e a medição achou:** duas isenções **mortas** (uma que nunca tropeçou em
> toda a sua história, D260); o `soOCodigo()` de que o modelo precisava **já existia**, com o buraco
> dele declarado em comentário (D258); a leitura *"afirma ou mostra?"* tinha **cinco** respostas
> nesta casa (D259); e a `soOCodigo()` **colapsava 422 linhas em 164**, cegando a varredura de
> chamadas em silêncio (D267).

# 013 · A D243 — escopar a varredura de custo por DESTINO, não por nome de arquivo

**Este item é a sua escolha, não a minha.** Você fechou o LAB-79 escrevendo:

> *"**A D243 É O PRÓXIMO ITEM**, anotada no topo da seção de propostas da
> `FILA.md` com as suas palavras sobre por que ela veio depois. NÃO COMECEI."*

Escolha que a casa já fundamentou vence a do chat. Vai a D243, e vai **sozinha**,
como você pediu.

## O que a decide

A lista nominal de exceções da `vazamento-de-custo.test.ts` foi de **6 para 11 em
três prompts**, e as duas últimas entradas são **relatórios de prompt** —
documentação *sobre* a regra, não regra nova. Pelo critério que você mesma
escreveu no item 006, isso quer dizer que **o errado passou a ser o desenho**:
continuar assim é **uma linha por relatório, para sempre.**

A proposta, nas suas palavras: declarar o conjunto do que pode chegar a um
**usuário** — hoje, aqui, **nada** além da bancada do navegador (§4) — e varrer
**esse** conjunto com rigor; o **registro** (relatório, decisão, recado) ganha
conferência própria, em que o valor citado tem de estar **dentro de citação ou de
bloco de código**.

E a prova de que o caminho funciona já é sua: no item 007 a régua das *condições
de conta* passou a pular **linha de citação** e dispensou **duas** entradas de
lista sem nome de arquivo nenhum. **Sinal estrutural no lugar de nome na lista.**

## Por que esta e por que não as outras duas propostas abertas

- **`PARAR A FILEIRA EXTERNA NO FIM DA FACE DECLARADA`** (LAB-78, D253) — fora:
  está `aguardando-o-jonny` por escrito, e o conserto **encurta a fileira e perde
  lotes que hoje entram**. Quantos é medição que o LAB-78 não fez, e prometer o
  número sem medir é a classe do D133. Mexe no desenho; espera o olho dele.
- **`ENTREGAR OS QUATRO CAMPOS NOVOS DE legais AO MOTOR`** (D226) — fora por
  mérito próprio e por ordem: **entregá-los MUDA O DESENHO** (a rampa publicada
  de `ensaio-com-via` se mexeu na hora). É prompt bom e é o seguinte, não este.
- **A D243 fica** porque é a única das três que **não toca desenho nenhum**, é a
  única que **apodrece sozinha enquanto ninguém a faz** (uma linha por relatório),
  e é a que você já declarou como próxima com o motivo escrito.

## Os três cuidados que você mesma registrou, e que este item respeita

1. **Sozinha na rodada.** *"Não começar na mesma rodada de outra coisa — é
   mudança de modelo de uma varredura de segurança."* Nada mais vem neste item.
2. **Não em silêncio.** Você escreveu que *"mexer no modelo de uma varredura de
   segurança no fim de uma rodada é exatamente o tipo de conserto que esta casa
   não faz em silêncio"*. Então este é o começo da rodada, e o modelo novo sai
   declarado: o conjunto do que chega ao usuário, escrito; o conjunto do
   registro, escrito; e o que cada um cobra.
3. **O universo publicado, nos dois conjuntos.** *Zero de zero não é aprovação* —
   e `every` sobre lista vazia é verdade. A varredura nova diz quantos arquivos
   leu em cada conjunto, e **reprova se ler menos do que afirma**.

## A fronteira, e ela não se atravessa

Mudança de modelo de varredura de segurança **pode encolher o que ela vê**. Então
a entrega traz as duas medições lado a lado: **o que a régua velha acusava e o
que a nova acusa**, arquivo por arquivo, e **o que deixou de ser olhado, com o
motivo**. Se o conjunto novo vê menos em algum ponto, isso sai escrito como
perda declarada — não como melhoria. Sabotagem nos dois sentidos, como de hábito:
valor de custo plantado **no destino de usuário** tem de ser acusado; o mesmo
valor **dentro de citação num relatório** tem de passar calado.

## Conferido antes de escrever este item

Lido da **origem**, não do disco: o seu recado do LAB-79, as duas linhas de
encerramento dele, e a `FILA.md` — a D243 no topo das propostas (linhas 218-234 e
2256-2262) e as duas propostas que ficaram de fora, com as condições
`aguardando-o-jonny` e `prompt-novo` escritas nelas. O seu despertador
(`trig_01XwSkTLT9zmyprNZcUiWy7f`, minuto 5) está **LIGADO**, conferido na conta.
