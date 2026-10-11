# LAB-92 · A esteira compara motores sob premissas idênticas? — **não**, e K = 17

**Prompt:** item **025** da caixa de entrada, **com os dois adendos**. · **Rodada:** despertador das
15:05 de 11/10/2026. · **Conferido aqui, não no GitHub** (§7).

---

## 1 · O chassi promoveu esta casa, e a pergunta é a única que só ela responde

O Jonny decidiu: *"o Generate é a arquitetura de software, em relação a **cabine do avião**… o que
roda na cabine, principal, tem que ser o Testfit"*, e *"**todos têm que estar na mesma base**"*.

Isso transforma a esteira de ferramenta de laboratório em **régua da competição**: se um ranking vai
ordenar motores diferentes, alguém tem de garantir que correram **nas mesmas condições**.

> **Hoje, a esteira compara motores sob premissas IDÊNTICAS? Não.**

---

## 2 · A conta, declarada (D302)

| | |
|---|---|
| **N = 13** | premissas que a esteira passa — `src/gleba-do-lab.ts`, bloco `PARAMETROS` |
| **M = 10** | com valor · **3** vão `null`: `calcada_m`, `pctAreaPublica`, `rampaMaxima_pct` |
| **K = 17** | caem no **padrão de fábrica de quem recebe** |
| | **4** nos dois motores do Generate · **13** no Parcelamento |
| **Symbios** | **zero** premissas — `parametros` é perda **em bloco** na ida |

### O K, um a um — porque *"K = 3 não diz o que consertar"* (adendo-2)

**Generate** (`generate-ortogonal`, `generate-espinha`) — os 4 campos de `PARAMS_PADRAO_V1` que a
esteira **nunca** sobrescreve:

| premissa | default | o que ela decide |
|---|---|---|
| `testadaMinimaLegal` | `NORMA_BR.testadaMinimaLegal` | **o motor se julga contra um limite que a esteira não passou** |
| `raioBulbo` | `7.5` | o bulbo de cul-de-sac consome área de via |
| `larguraEntrada` | `20` | a entrada do loteamento consome frente de gleba |
| **`regimeFachada`** | **`"condominio"`** | **se o lote dá frente para RUA PÚBLICA ou para via de condomínio** |

**Parcelamento** — **13 das 22** `ChaveFaixa` ficam de fábrica, porque a ida preenche **9** e o
tipo do motor diz, no próprio comentário, que o arquivo *"sobrepõe o default de fábrica"*:
`tolerancia`, `appRioPct`, `doacaoPct`, `doacaoTestadaMin`, `lagosPct`, `arborizacaoPct`,
`pctCulDeSac`, `interferenciaRelevo`, `ladoSuperquadra`, `numRadiais`, `curvatura`,
`testadaExterna`, `areaLoteExterna`.

> **Premissa omitida não é premissa ausente: é premissa inventada por quem recebe** — e cada motor
> inventa a sua. *Dois motores comparados assim competem em campos diferentes, e o ranking mente
> com aparência de rigor.*

**Medido na ORIGEM dos dois vizinhos**, não no clone: `gerar-v1.ts:456` (12 campos) e
`tipos.ts:124` (22 chaves).

---

## 3 · O caso válido que quase parece inválido, e ele é separado

Premissa que o motor **não tem como receber** não é inventada — é campo que o contrato não publica
ou consumidor que não existe. **Pedido ao dono do contrato, não achado contra o motor**, e as duas
listas são **disjuntas por (motor, premissa)**, com trava:

- **parcelamento:** `caixaViariaMin_m`, `pctAreaPublica`, `rampaMaxima_pct`;
- **generate:** `calcada_m`, `pctAreaPublica`, `rampaMaxima_pct` — não entram em `GerarV1Params`;
- **symbios: TODAS as 13** — ele traça via e extrai quadra, **não parcela em lote**.

---

## 4 · O que eu NÃO consigo igualar — e *"não consigo" nomeado vale mais que paridade fingida*

1. **o default de FÁBRICA de quem recebe** — a esteira só passa o que o contrato publica;
2. **o Symbios em métrica de lote** — recebeu zero premissas e não parcela: *qualquer ranking de
   lote que o inclua está somando coisas diferentes*;
3. **o `regimeFachada`** — não há como pedir regime de loteamento, e os dois motores do Generate
   correm em condomínio;
4. **a `tolerancia` do Parcelamento** — a chave que decide quantos lotes passam raspando **não
   existe no contrato v1**, então não é igualável nem por fora;
5. **o número que o próprio dono recusa** — `pctAPP: 15` e `pctLazer: 10` são o default do Generate,
   e **a esteira os passa explicitamente**: *igualar assim é igualar no número que ele nunca quis.*

---

## 5 · Os dois adendos, respondidos

### As duas formas de área declarada (D303)

| forma | passa? | nas glebas-padrão |
|---|---|---|
| **polígono desenhado** | sim (`restricoes[]`/`atracoes[]`) | **só `completo.geojson`** (`app`, `reserva_legal`) |
| **porcentagem** | sim (`pctAPP`/`pctLazer`) | **todas as quatro** — o bloco de parâmetros é um só |

> **Na `completo` as duas chegam juntas — a APP desenhada E 15 % de APP — e nada declara qual
> manda.** *Um polígono tem lugar; uma porcentagem não. Somar os dois é contar a mesma terra duas
> vezes* — a injustiça do K numa camada acima.

### O motor COMPOSTO (D305)

A porta tem **três** implementações, cada uma com `id`, e cada rodada chama **uma**. Um composto
**caberia** — quarta implementação, `id` próprio, chamando duas —, e o ranking seguiria funcionando
porque **tudo é indexado por `id`**.

> **O que falta não é encaixe: é a regra de JUNÇÃO** — de quem é cada parte do plano quando dois
> motores respondem pela mesma gleba. *A esteira mede o que o `id` entregar; ela não sabe dizer
> qual metade é de quem.*

---

## 6 · E a trava que eu escrevi me corrigiu (D304)

Ela procurava a frase *"esta casa mede e pede"* no módulo e deu **falso**. A frase está lá, num
JSDoc quebrado em duas linhas, e o normalizador do `.md` devolveu `… mede e * pede …`: **ele tira o
`>` da citação e não o ` * ` do JSDoc.**

> **Duas gramáticas, dois normalizadores** — alargar o do `.md` faria uma linha de lista virar
> prosa. Nasceu `comoOComentarioSeLe` **em `src/texto-das-regras.ts`**, não dentro do teste (D248),
> com os dois sentidos travados.

---

## 7 · O que fica pedido, e o pedido NÃO é commit (§4)

**Ao chassi / ao Generate:**

1. **as premissas num lugar só, e nenhum default de motor** — o K de 17 é o pré-requisito do
   ranking que o cliente vai ver;
2. **`regimeFachada` no contrato de motor v1** — hoje é o default mais pesado, e invisível;
3. **tirar o `pctAPP ?? 15` / `pctLazer ?? 10`** — o dono já disse que nunca os quis, e eles estão
   em seis lugares vivos (medição da direção);
4. **declarar a precedência entre área desenhada e porcentagem** quando as duas chegam.

**Ao Parcelamento:** publicar no contrato as chaves que hoje só existem de fábrica — começando por
**`tolerancia`** e **`testadaExterna`**, que mudam contagem de violação.

**Ao Jonny**, em linguagem de leigo e na página dele (§12 nova): **em que regime a competição
roda** — loteamento ou condomínio? Hoje a escolha está sendo feita **por omissão, por um programa**.

---

## 8 · Entrega

- **prova:** [`docs/provas/LAB-92/premissas-identicas.json`](../provas/LAB-92/premissas-identicas.json)
  — a conta, o K linha por linha, o que o motor não recebe, as duas formas, as glebas e o limite.
  Na **lista de exceções do §7**;
- **decisões:** **D302** (K = 17), **D303** (as duas formas), **D304** (o leitor de comentário) e
  **D305** (o motor composto);
- **o portão sem clones:** 38 → **39 arquivos**, 621 → **641 travas**;
- **nada consertado e nada escrito em repositório vizinho** — leitura na **origem** dos dois, os
  **seis** clones limpos;
- **nenhum motor foi melhorado** (o adendo-1 proíbe antes do lançamento), **a D226 não foi
  tocada**, **o gatilho do CI não foi religado**;
- **verde:** o comando único, **conferido aqui, não no GitHub**.
