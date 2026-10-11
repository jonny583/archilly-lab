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

# Adendo ao 025 — a definição de MOTOR, e o seu motor entra como está

> **Vem do chat, 11/10/2026 às 08h59.** Completa o `025`. **Faça o `025`**; isto é
> contexto, com uma frase a acrescentar no fim.

## 1 · MOTOR é só a geração do loteamento. Nada mais.

> *"**Quando eu digo motor, eu só estou falando da geração do loteamento ou do
> condomínio.**"*

A fronteira importa para a sua medição: quando você for enumerar as premissas,
**enumere as que o PASSO DE GERAÇÃO recebe** — não as de validação, de nota nem de
relatório. E a esteira, a régua, o oráculo e as glebas-padrão **não são motor**:
são instrumento, e instrumento não se pluga.

## 2 · O seu motor entra no menu COMO ESTÁ — e ele nunca o viu rodar

Palavras dele, e vale saber que é assim que esta casa aparece na mesa do dono:

> *"Não quero abandonar um que eu nunca testei, **o Lab** — então eu quero ver o
> desempenho do Lab, o que ele faz."*

> *"Já tá bom demais todos os que são gerados no Generate, todos os do Testfit,
> mais o motor Lab, **tá ótimo já**."*

**Duas consequências:**

1. **não se melhora motor agora.** O esforço é do encaixe, até o lançamento. Item
   que proponha afinar motor volta à fila como *"depois do lançamento"*;
2. **mas ele quer VER o desempenho.** Isto é exatamente o que a sua esteira faz, e
   é a sua medição do `025` com outro propósito: se as premissas não forem
   idênticas, a comparação que ele vai olhar **não compara nada**. A pergunta do K
   deixou de ser higiene e passou a ser pré-requisito do ranking que o cliente vê.

## 3 · A frase a acrescentar no fim do `025`

> *"Daqui a pouco a gente faz um que é a **mistura do Testfit com outro motor**, e
> assim vai. Esse é um processo que não termina."*

**Uma frase, medida:** a sua esteira hoje consegue medir um motor **composto** —
um que chame dois outros e junte as saídas —, ou ela pressupõe um motor por
rodada? **Não construa.** É para o chassi saber se o encaixe precisa prever isso,
e você é quem tem o instrumento para responder.

## Conferência

A mesma do `025`. **"Conferido aqui, não no GitHub"**, e o gatilho do CI **não se
religa**. **Um envio só.**
