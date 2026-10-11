> ✅ **FEITO no LAB-92**, em 11/10/2026, no despertador das 15:05. Relatório em
> [`../relatorios/LAB-92.md`](../relatorios/LAB-92.md), prova em
> `docs/provas/LAB-92/premissas-identicas.json`, decisões **D302 a D305**.
>
> **A resposta é NÃO, e o número é K = 17.** Medido por LUGAR, e na ORIGEM dos dois vizinhos:
> **N = 13** premissas a esteira passa (bloco `PARAMETROS` do `src/gleba-do-lab.ts`), **3** delas
> `null`, e **17 caem no padrão de fábrica de quem recebe** — **4** nos dois motores do Generate e
> **13** no Parcelamento. **O Symbios recebe ZERO**: `parametros` é perda **em bloco** na ida,
> porque ele traça via e extrai quadra e **não parcela em lote**.
>
> **O K de MOTOR, um a um, como o adendo-2 pediu.** No Generate são os 4 campos de
> `PARAMS_PADRAO_V1` que a esteira nunca sobrescreve: `testadaMinimaLegal` (o motor se julga contra
> um limite que eu não passei), `raioBulbo` (7.5), `larguraEntrada` (20) e — **o mais pesado** —
> **`regimeFachada: "condominio"`**, que decide se o lote dá frente para **rua pública** ou para
> via de condomínio, e portanto **o que conta como violação de testada**. No Parcelamento são
> **13 das 22 `ChaveFaixa`**: a ida preenche 9, e o tipo do motor diz no próprio comentário que o
> arquivo *"sobrepõe o default de fábrica"* — entre as 13 estão `tolerancia`, `pctCulDeSac`,
> `doacaoPct`, `arborizacaoPct` e `testadaExterna`.
>
> **E o número que o dono recusa está escrito por MIM:** `pctAPP: 15` e `pctLazer: 10` são o default
> do Generate, e a esteira **os passa explicitamente** nas quatro glebas-padrão — eu os copiei das
> glebas-padrão dele. *Passar o default explicitamente não é o motor inventá-lo, mas o número é o
> mesmo, e a escolha do usuário some.* **Igualar assim é igualar no número que ele nunca quis.**
>
> **O caso válido que quase parece inválido está em lista SEPARADA e disjunta** (com trava):
> `caixaViariaMin_m`, `pctAreaPublica` e `rampaMaxima_pct` no Parcelamento; `calcada_m`,
> `pctAreaPublica` e `rampaMaxima_pct` no Generate; e **as 13 inteiras** no Symbios. *Isso é pedido
> ao dono do contrato, não achado contra o motor.*
>
> **O QUE EU NÃO CONSIGO IGUALAR, nomeado em cinco linhas** — e a maior é o **Symbios em métrica de
> lote**: ele recebeu zero premissas e não parcela, então *qualquer ranking de lote que o inclua
> está somando coisas diferentes.* Junto com ela: o default de fábrica de cada dono, o
> `regimeFachada`, a `tolerancia` do Parcelamento (que **não existe no contrato v1**, logo não é
> igualável nem por fora) e o 15/10 que o dono recusa.
>
> **DO ADENDO-2 — as duas formas de área declarada: a esteira passa AS DUAS**, polígono
> (`restricoes[]`/`atracoes[]`) e porcentagem (`pctAPP`/`pctLazer`). **E o achado está no
> cruzamento:** medido nos `.geojson`, **só `completo` traz área declarada como polígono** (`app` e
> `reserva_legal`), e **as quatro glebas recebem 15 %/10 %** porque o bloco de parâmetros é um só —
> então **na `completo` as duas chegam juntas e NADA declara qual manda** (D303). *Um polígono tem
> lugar; uma porcentagem não. Somar os dois é contar a mesma terra duas vezes* — a injustiça do K
> numa camada acima.
>
> **DO ADENDO-1 — motor COMPOSTO cabe na porta** (D305): ela expõe três implementações, cada uma
> com `id`, e cada rodada chama uma; um composto seria uma quarta chamando duas, e o ranking seguiria
> funcionando **porque tudo é indexado por `id`**. **O que falta não é encaixe: é a regra de
> JUNÇÃO** — de quem é cada parte do plano quando dois motores respondem pela mesma gleba —, e *isso
> não é instrumento, é desenho.*
>
> **E A TRAVA QUE EU ESCREVI ME CORRIGIU** (D304): ela procurou a frase *"esta casa mede e pede"* no
> módulo e deu **falso** — a frase está lá, num JSDoc quebrado em duas linhas, e o normalizador do
> `.md` devolveu `… mede e * pede …`, porque tira o `>` da citação e **não** o ` * ` do JSDoc.
> **Duas gramáticas, dois normalizadores:** alargar o do `.md` faria uma linha de **lista** virar
> prosa. O leitor novo nasceu em `src/texto-das-regras.ts`, não dentro do teste, com os dois
> sentidos travados.
>
> **NADA FOI CONSERTADO**, como o item mandou. **Os pedidos, em lista e nunca em commit lá:** ao
> chassi/Generate — as premissas num lugar só e nenhum default de motor, `regimeFachada` no contrato
> v1, tirar o `?? 15`/`?? 10`, e **declarar a precedência** entre área desenhada e porcentagem; ao
> Parcelamento — publicar `tolerancia` e `testadaExterna`, que mudam contagem de violação. **E ao
> Jonny**, na página dele e em linguagem de leigo (§12 nova): **em que regime a competição roda**,
> loteamento ou condomínio — porque hoje a escolha está sendo feita **por omissão, por um programa**,
> e regra urbanística é dele.
>
> **Fronteiras:** nenhum motor melhorado (o adendo-1 proíbe antes do lançamento), nada escrito em
> repositório vizinho, os **seis** clones limpos, **a D226 não tocada** e **o gatilho do CI não
> religado**.

---

# 025 — O chassi foi decidido, e a sua esteira passa a ser a régua da competição

> **Vem do chat, 11/10/2026 às 08h49.** O Jonny ditou a decisão de arquitetura do
> produto. **Este item grava e mede uma coisa só. Não constrói.**

## A decisão, nas palavras dele

> *"O Generate é a arquitetura de software, em relação a **cabine do avião**. As
> telas, as lógicas, o juiz. Mas o que roda na cabine, principal, tem que ser o
> Testfit."*

> *"Não quero abandonar o que eu já fiz do ortogonal, espinha de peixe, **não
> quero abandonar um que eu nunca testei, o Lab**. Então eu quero ver o desempenho
> do Lab, o que ele faz, só que **todos têm que estar na mesma base**."*

> *"Quero algumas funções que **afetem a todos os motores**. Por exemplo, mais
> áreas verdes. Vou pôr ali mais áreas verdes em todos. Então tá, **vai gerar de
> novo todos para ter um juiz sobre as mesmas bases técnicas de competição.**
> Tudo isso tem que ser premissas que vão para todos os motores. **Por isso que
> eles têm que estar unificados no mesmo lugar.**"*

> *"Não são os únicos motores. Depois a gente vai criar outros. Daqui a pouco sai
> uma API que faz isso, ou um MCP, a gente vai querer integrar. **O motor não
> termina.**"*

**Em uma frase:** o Generate deixa de ser um motor com tela e passa a ser **uma
tela com encaixe para motores**. O Testfit é o motor padrão; o ortogonal e a
espinha do Generate são duas peças do menu; **o Lab é outra**, e os futuros
entram pelo mesmo encaixe.

## O que isto muda para esta casa — e é a sua razão de existir, promovida

A sua esteira já clona repositórios **só para leitura** e mede motor. A decisão
dele transforma isso de ferramenta de laboratório em **a régua da competição**:
se o ranking vai ordenar motores diferentes, alguém tem de garantir que eles
correram **nas mesmas condições**. Esse alguém é esta casa.

## A medição desta rodada — UMA, e é a que ninguém mais pode fazer

> **Hoje, a sua esteira compara motores sob premissas IDÊNTICAS?**

Meça **por LUGAR, não por palavra** — enumere onde a premissa entra e leia cada
um:

1. **que premissas a sua esteira passa a cada motor** quando mede as
   glebas-padrão? Enumere os campos, não a intenção;
2. **alguma delas cai no padrão de fábrica do motor em vez de vir da esteira?**
   Este é o defeito que a decisão dele nomeia sem saber: o Generate aplica
   `pctAPP ?? 15` e `pctLazer ?? 10` quando ninguém passa — então **premissa
   omitida não é premissa ausente, é premissa inventada por quem recebe**, e cada
   motor inventa a sua. Dois motores comparados assim competem em campos
   diferentes, e o ranking mente com aparência de rigor;
3. **a conta, declarada:** N premissas, das quais M vêm da esteira e K caem no
   padrão de quem recebe. **K > 0 é o achado**, e ele é o pré-requisito do
   ranking do chassi;
4. e **o que a sua esteira NÃO consegue igualar** — diga. *"Não consigo"*
   nomeado vale mais que uma comparação que finge paridade.

**Não conserte nada.** Se K > 0, o conserto é do chassi (as premissas num lugar
só) e vira pedido, não commit em repositório vizinho — a sua §4 proíbe, e você a
respeitou duas vezes esta semana.

## O caso válido que quase parece inválido

Premissa que o motor **não tem como receber** não é premissa inventada: é campo
que o contrato não publica. Esse caso entra numa lista separada, com o nome do
campo — e aí é pedido ao dono do contrato, que é o Generate.

## Pare na fronteira se

- a medição pedir para **mudar o contrato**. É pedido, em lista, e a direção leva;
- pedir para plugar o seu motor no Generate. Não é este item, e é obra do chassi;
- aparecer decisão de **nome** de motor. É dele, e é depois.

## Conferência

`./external-engines/conferir.sh`, os sete passos. **Declare "conferido aqui, não
no GitHub"** — e o gatilho do CI **não se religa**: a régua cobra, não liga.

**Um envio só.**

## A regra do chat

**Nenhuma pergunta ao Jonny.** O que depender dele vira linha em
`docs/PENDENCIAS_JONNY.md`, em linguagem de leigo.
