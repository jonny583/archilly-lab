# LAB-17 — duas glebas COM via desenhada à mão, os quatro motores, e a D69

**Data:** 20/09/2026 · **Semente:** 20260913 · **Contrato:** `archilly-motor-entrada` v1
**Provas:** [`docs/provas/LAB-17/medicoes.json`](../provas/LAB-17/medicoes.json)
**Fixtures:** [`docs/fixtures/glebas-com-via-desenhada/`](../fixtures/glebas-com-via-desenhada/)
**Ferramenta:** `external-engines/esteira/ferramentas/lab17.ts` (`bun ferramentas/lab17.ts`)
**Testes:** `external-engines/esteira/tests/vias-desenhadas.test.ts` — 12 · a esteira inteira, **127 verdes**

---

## Em uma frase

**Os quatro motores ignoram a via que o urbanista desenha** — a maior aderência
medida é **30,7 %** e a menor **10,1 %** —, **os quatro declaram que a ignoram**,
e é a primeira vez que a pergunta pôde ser feita, porque agora existe gleba onde
fazê-la.

---

## 1 · Por que estas duas glebas precisaram existir

O LAB-13 foi mandado medir *"aderência a via desenhada à mão quando aplicável"* e
mediu que **não era aplicável em nenhuma das cinco glebas**: quatro não têm
atração nenhuma, e a quinta (`geo-antonina`) tem uma **testada de frente** de
180,2 m sobre a divisa, que é outra coisa (D64). A coluna saiu `null` nas cinco
linhas — o que é uma medição honesta, e também um buraco: a tela unificada
**existe para** o urbanista traçar a via principal com a mão e ver qual motor a
respeita.

As duas, montadas sobre as glebas-padrão com relevo, com o traçado gravado em
fixture para quem quiser refazer:

| gleba | sobre | área | traçado imposto | restrições |
|---|---|---|---|---|
| `ensaio-com-via` | `ensaio-47ha` | 47,0 ha | 1 principal + 3 secundárias · **2 554,51 m** | nenhuma |
| `antonina-com-via` | `geo-antonina` | 141,8 ha | 1 principal + 3 secundárias · **4 090,13 m** | 3 (uma hídrica) |

O traçado é **geométrico** — principal pelo meio do lado maior da caixa,
secundárias perpendiculares igualmente espaçadas, todas aparadas para dentro da
divisa. Ele **não é projeto de urbanismo**, e não tenta ser: existe para ser uma
**imposição conhecida** contra a qual se mede aderência. Traçado "bonito"
inventado por mim seria regra urbanística disfarçada de fixture, e o CLAUDE.md §4
proíbe (**D73**).

---

## 2 · A tabela — aderência ao traçado imposto

Aderência = fração do comprimento desenhado que cai **dentro da caixa** de
alguma via da saída do motor. A tolerância é meia caixa da via mais próxima,
o que é generoso de propósito: quem chegar perto ganha o ponto.

### `ensaio-com-via` — 47,0 ha, retângulo, traçado inequívoco

| motor | aderência | declarou seguir? | declarou ter ignorado? | lotes | violações | ms |
|---|---:|---|---|---:|---:|---:|
| Symbios Tensor + subdivisão do Lab | **27,5 %** | não | **sim** | 214 | 0 | 900 |
| Archilly Generate · ortogonal | **29,3 %** | não | **sim** | 974 | 0 | 600 |
| Archilly Generate · espinha | **20,5 %** | não | **sim** | 776 | 0 | 492 |
| Laboratório de Parcelamento | **11,3 %** | não | **sim** | 599 | 16 | 1 726 |

### `antonina-com-via` — 141,8 ha, terreno real, três APP

| motor | aderência | declarou seguir? | declarou ter ignorado? | lotes | violações | ms |
|---|---:|---|---|---:|---:|---:|
| Symbios Tensor + subdivisão do Lab | **30,7 %** | não | **sim** | 1 014 | 4 | 9 362 |
| Archilly Generate · ortogonal | **28,0 %** | não | **sim** | 1 389 | 1 | 630 |
| Laboratório de Parcelamento | **17,4 %** | não | **sim** | 1 386 | 15 | 6 516 |
| Archilly Generate · espinha | **10,1 %** | não | **sim** | 1 657 | 0 | 604 |

### O que a tabela diz, e o que ela não diz

**Diz:** nenhum motor respeita via desenhada, e **nenhum deles mente sobre
isso**. Os quatro declaram `respeitaViaDesenhada: false` nas capacidades **e**
devolvem `naoAtendido: viasDesenhadas` na saída. A declaração bate com o medido
nas oito linhas — é a primeira vez que a coerência entre o que o motor diz de si
e o que ele faz pôde ser conferida com um caso em que a resposta certa é "não".

**Não diz** que 30,7 % é melhor que 10,1 % **como projeto**. Uma via que passa
por acaso perto do traçado não o está seguindo; ela só está, por sorte da malha,
caindo na mesma faixa. A aderência aqui mede **quanto do desenho sobreviveu ao
acaso**, e a leitura correta dos números é: *entre 10 % e 31 % de coincidência,
zero de intenção*. O que a tela precisa mostrar não é este número — é a
**ressalva**: "este motor ignorou a via que você desenhou".

**Sem recomendação de produto**, como no LAB-13.

---

## 3 · A D69 aplicada — e as duas metades dela que não são verificáveis

> **D69 (decisão de urbanismo do Jonny):** via desenhada à mão é **intenção
> explícita** e vale sempre como atração — atravessa a APP mesmo sem cumprir o
> critério dos 3× / 1,5 km, inclusive quando desenhada sozinha sobre a APP.
> Exceções que não caem: **nascente nunca** (raio de 50 m intocável), e a
> travessia continua sendo a **mais curta e perpendicular possível** ao curso.
> Na tela: *"desenhada por você — exige licença ambiental"*, e **item de custo**
> (ponte ou bueiro) na saída para o Orçamento.

### O que foi medido

Em `antonina-com-via`, a via principal desenhada atravessa a APP hídrica:

```
VD1 × APP — curso d'água (app_hidrica) · 71,00 m
marca: "desenhada por você — exige licença ambiental"
item de custo: 1 · obra: null · largura: 11,50 m (a caixa principal dos parâmetros)
```

Em `ensaio-com-via` não há restrição, e a D69 não tem o que dizer — **o que
também sai declarado**, em vez de sumir.

### Por que `obra` sai `null`

Escolher entre **ponte** e **bueiro** depende da **vazão do curso**, e a vazão
não está em lugar nenhum do que chega até aqui. Chutar pelo comprimento —
*"curto é bueiro, longo é ponte"* — daria ao Orçamento um número em que ele
confiaria. `null` é "não medido"; zero seria uma medição (D23).

### As duas metades que o contrato v1 não deixa verificar

| parte da D69 | aplicável hoje? | por quê |
|---|---|---|
| a via desenhada atravessa a APP | **sim** | a APP chega como polígono |
| a travessia é a **mais curta** | **sim** | mede-se o trecho dentro da APP |
| a marca da tela | **sim** | é rótulo |
| o **item de custo** | **sim** | comprimento e largura saem; o preço é do Orçamento |
| **perpendicular ao curso** | **NÃO** | o curso chega como **polígono de APP**, não como linha. Sem o eixo, "perpendicular" não tem a quê |
| **nascente: 50 m intocáveis** | **NÃO** | o contrato v1 achata `app_nascente` em `app_hidrica`. A nascente chega **indistinguível** de qualquer APP, e o ponto dela não chega |

**A regra dos 50 m fica escrita** — `RAIO_DA_NASCENTE_M = 50` em
`src/travessia.ts` — **e marcada como "não aplicável até o contrato trazer a
nascente"**, como o chat mandou. **Nenhuma aproximação foi inventada.** Chutar
"a APP mais redonda deve ser a nascente" ou "o eixo é o esqueleto do polígono"
seria pior que não fazer: daria um número em que alguém confiaria (**D74**).

As duas saem **sempre**, com ou sem travessia, e há teste que fixa isso: regra
que só aparece quando é violada é regra que o leitor supõe cumprida.

**O 3× / 1,5 km** segue como decisão do chat, **não do Jonny**, e está assim em
`docs/PENDENCIAS_JONNY.md` até ele confirmar.

---

## 4 · O defeito que esta medição encontrou — no Laboratório, não nos motores

A primeira passada imprimiu, para `antonina-com-via`:

```
vias desenhadas 1 (1 principal, 3 secundária) · 4090,13 m · testadas de frente 4
```

Quatro vias entraram, **uma** foi reconhecida, e apareceram **quatro** testadas
de frente numa gleba que tem **uma**. Resultado suspeito se mede antes de ter
culpado (CLAUDE.md §6) — e o culpado era meu.

`linhasDaEntrada` separava "via desenhada" de "testada de frente" pela **mediana
da distância dos VÉRTICES à divisa**. Uma via que **atravessa** a gleba tem as
duas pontas na divisa — e só tem duas pontas. Mediana de dois zeros é zero, e as
três secundárias mais a principal foram para o balde errado.

**O conserto:** a régua **amostra a linha de 5 em 5 m** em vez de olhar só os
vértices. A distinção volta a ser a que interessa — a testada de frente corre
rente à divisa **do começo ao fim**, a via que atravessa tem o **miolo longe**
dela. Depois do conserto: **4 desenhadas, 1 testada de frente**, que é o que
existe na gleba.

**O que isso contamina, e o que não contamina:** os números de aderência do
**primeiro** rodar foram descartados e **não estão neste relatório** — só os da
passada corrigida. O LAB-13 **não é afetado**: lá a separação devolveu
`null`/testada de frente em todas as cinco glebas, e continua devolvendo, porque
nenhuma delas tem via que atravesse. O teste que fixa os dois lados da régua está
em `tests/vias-desenhadas.test.ts` (**D75**).

É o quinto defeito do Lab que a disciplina "medir antes de atribuir" pegou antes
de virar acusação ao motor de outro repositório.

---

## 5 · O que isto pede ao Generate — pelo chat, nunca por commit

Três pedidos ao contrato v1, dois deles já abertos e um reforçado aqui:

1. **`app_nascente` como tipo próprio**, mais a **geometria de PONTO** da
   nascente. Hoje o contrato a achata em `app_hidrica` e **nenhum motor da
   família consegue cumprir a regra dos 50 m** — nem o interno. *(o chat já
   repassou)*
2. **A geometria de LINHA do curso d'água**, além do polígono da APP. Sem o
   eixo, "travessia perpendicular ao curso" não é verificável por ninguém.
3. **Um tipo para "via desenhada à mão"**, separado de `via_existente`. Hoje as
   duas coisas chegam com o mesmo rótulo (D64), e aqui a via desenhada precisou
   entrar como `via_existente` — **remendo, e declarado como tal** no cabeçalho
   de `src/vias-desenhadas.ts`. Sem o tipo, a tela unificada não consegue
   distinguir "respeitei a rua que já existe" de "respeitei o que você desenhou".

Os três estão no §10.5 do
[`CONTRATO_MOTOR_UNIFICADO_v1.md`](../CONTRATO_MOTOR_UNIFICADO_v1.md).

---

## 6 · Os vizinhos ficaram limpos

`git status` nos três clones de leitura ao fim da rodada:
`urban-create-hub-41d93a4d`, `motor-testfit` e `urban-scout-tool` — **nenhuma
alteração**. Nada foi escrito em repositório vizinho, como manda o CLAUDE.md §4.

---

## 7 · O despertador — criado nesta rodada, e **sem conectores**

O chat mandou *"crie UM despertador de 60 minutos junto com esta fila"*. **Não
havia nenhum despertador do Lab na conta** — o que existia era de outros
aplicativos (Render, Pesquisa de Mercado, motor-v2), e neles não se toca. O
`ONDE_PARAMOS` de ontem dizia que o do Lab estava ligado; **estava errado**, e
isto o corrige.

Criado: **`trig_01ErsHXVhfTZziHEGGYcBjiJ`**, cron `5 * * * *`, com a ordem de
**se apagar quando um disparo não achar item pronto** (D62).

**Ele nasceu sem os conectores do GitHub** — o servidor avisou na criação. A
sessão que ele acordar **não terá `mcp__github__*`** e deve mesclar por git
direto, `git merge --no-ff` na `main`, declarando isso no relatório e no recado.
É exatamente o caso previsto na **D29**, e o prompt do despertador já carrega a
instrução.

---

## 8 · O que fica pronto

- `external-engines/esteira/src/vias-desenhadas.ts` — o traçado imposto e a
  montagem das duas glebas;
- `external-engines/esteira/src/travessia.ts` — a D69 aplicada, com o que dela
  não é verificável, declarado;
- `external-engines/esteira/ferramentas/lab17.ts` — a medição;
- `external-engines/esteira/tests/vias-desenhadas.test.ts` — 12 testes;
- `docs/fixtures/glebas-com-via-desenhada/` — as duas entradas v1, gravadas;
- `docs/provas/LAB-17/medicoes.json` — os números crus.
