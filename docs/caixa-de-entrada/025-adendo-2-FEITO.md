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

# Adendo-2 ao 025 — o K que você está medindo tem nome, e o dono NUNCA quis aquele default

> **Vem do chat, 11/10/2026 às 09h05.** **Faça o `025`** — isto não muda o
> trabalho, **muda o peso dele**, e vale ler antes de escrever o relatório.

## O que ele disse, sem saber que você estava medindo exatamente isso

O `025` te mandou medir o **K**: quantas premissas caem no padrão de fábrica de
quem recebe em vez de vir da esteira, e o exemplo que eu dei foi o `pctAPP ?? 15`
e o `pctLazer ?? 10` do Generate. Horas depois, o Jonny:

> *"Daí se falou assim: «o Generate aplica 15% de APP e 10% de lazer». **Eu nunca
> fui a favor desse default.** Eu acho que isso **o usuário tem que pôr, não a
> gente.** Só que chegou uma época que ficou isso. Se desse para tirar esse
> default, seria interessante — **tinha que ser tudo zerado e tudo fácil de
> preencher.**"*

**Então o K não é higiene de laboratório: é um defeito que o dono do produto
reconhece e quer removido.** Medido pela direção, o default está escrito em **seis
lugares vivos** do Generate — o painel defaulta duas vezes, **os dois motores
defaultam de novo**, e o PDF uma vez. O Generate está medindo o preço de tirá-lo
nesta mesma rodada.

**O que isso muda no seu relatório, e é só ênfase:**

- **separe, no K, o default de TELA do default de MOTOR.** O de tela o usuário vê
  e corrige; o de **motor** é invisível e é o que **quebra a comparação** — motor
  que inventa 15% compete numa gleba com menos terra útil que o vizinho que
  recebeu zero, e o ranking ordena isso com toda a aparência de rigor. **O seu K
  de motor é o número que importa**, e ele vale ser dito em separado;
- **e diga qual premissa de cada motor é defaultada por ele mesmo.** Não a conta
  agregada: a lista. *"K = 3"* não diz o que consertar; *"APP, lazer e perfil de
  lote, no motor tal"* diz.

## E uma coisa que ele disse e que entra na sua medição como caso novo

> *"Essas áreas **tanto podem vir do que o usuário mesmo desenhou**, **ou de um
> percentual que ele escreve**. Mas ele é **livre para escolher qual das formas**."*

**Então área declarada tem DUAS formas de entrada**, e elas não são equivalentes
para um motor: um polígono desenhado tem **lugar**; um percentual não tem. **Na sua
medição, diga se a esteira hoje consegue passar as duas** — e, se passar só uma,
qual. Porque comparar um motor que recebeu *onde* com outro que recebeu *quanto*
é a mesma injustiça do K, numa camada acima.

## O que NÃO muda

**Nenhuma obra.** Você não conserta o default (é do Generate), não muda contrato
(é pedido) e não escreve em repositório vizinho. E segue valendo: **nenhum motor
se melhora antes do lançamento.**

## Conferência

A mesma do `025`: `./external-engines/conferir.sh`, os sete passos, **"conferido
aqui, não no GitHub"**, gatilho do CI **não se religa**. **Um envio só.**
