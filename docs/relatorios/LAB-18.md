# LAB-18 — o contrato v2 revendorizado, e o que ele mudou

**Data:** 02/10/2026 · **Semente:** 20260913 · **Contrato:** lido em `["2", "1"]`
**Generate em:** `5b7e9b4` (02/10, 15h21) · **antes:** `22502b3` (10/09)
**Provas:** [`docs/provas/LAB-18/contrato-v2.json`](../provas/LAB-18/contrato-v2.json) · tabela refeita em [`LAB-19/tabela.json`](../provas/LAB-19/tabela.json)
**Ferramenta:** `bun run lab18` · **Testes:** `tests/contrato-v2.test.ts` — 8 · a esteira inteira, **164 verdes**

---

## Em uma frase

**O v2 entregou os três pedidos do Lab, e um deles já rendeu o número que o
LAB-02 achou e nenhum contrato carregava:** a pior rampa de uma via do Symbios em
`completo` é **161,38 %**, contra uma média mansa de **24,23 %** — um fator de
**6,7×** que a média escondia.

---

## 1 · A revendorização: o adaptador não quebrou, o tsconfig do Lab sim

O clone de leitura do Generate pulou de `22502b3` (10/09) para `5b7e9b4` (02/10).
**O adaptador compilou sem uma linha de mudança.** Quem quebrou foi o
**tsconfig do Lab**, com dois erros:

```
empreendimentos/types.ts: Cannot find module '@/lib/apontar'
empreendimentos/types.ts: Cannot find module '@/lib/funil'
```

**Medido antes de atribuir** (CLAUDE.md §6): não é defeito do contrato nem do
Generate. A cadeia é `engine/lot-rules.ts` → `empreendimentos/types.ts`, e esse
arquivo usa `@/`, que é o **alias interno do Generate**. Um repositório tem o
direito de usar o próprio alias no próprio código; **quem lê por caminho é que
tem de espelhá-lo** (D16). Uma linha no `paths`, no único lugar do Lab que sabe
onde os irmãos ficam, e o `tsc` voltou a ficar limpo (**D86**).

## 2 · O gate de versão era do Lab, e estava errado desde o LAB-08

Com o v2, **cinco testes ficaram vermelhos**:

```
esta esteira lê o contrato "1"; chegou versão "2"
```

O exportador do Generate agora emite `"2"`, e `glebaParaOSymbios` exigia
**igualdade exata**. Não era o contrato novo recusando o Lab: era **o Lab
recusando o contrato novo**.

A esteira passa a ler **`["2", "1"]`**, pela mesma regra que o Generate escreveu
no contrato deles — *"quem lê tem de aguentar o outro lado evoluir"*. O Lab deve
a eles a cortesia na direção contrária: as fixtures em `docs/fixtures/` declaram
`"1"` e são **prova de medição antiga**; refazê-las para caber na versão nova
falsificaria a prova (**D87**).

**E o que a v1 não carrega fica declarado**, em `FALTA_NA_V1`, com teste. Uma
entrada v1 e uma v2 não fizeram a mesma prova.

## 3 · Os três pedidos, um por um — e a resposta desconfortável de dois deles

| o pedido | o contrato entrega? | **há dado nas glebas?** |
|---|---|---|
| `app_nascente` + o **ponto** da nascente | **sim** — `tipos.ts:144` e `:157` | **não. Zero ocorrências** nas sete glebas medidas, incluindo as duas v2 **deles** |
| **eixo do curso** para a perpendicular | **sim** — `eixoDoCurso` | **não.** As três APP hídricas de `geo-antonina` seguem **sem eixo**, nas duas versões |
| `rampaMaxima_pct` **por via na saída** | **sim** — `tipos.ts:319` | **sim**, e rendeu — ver §4 |

**O bloqueio mudou de lugar, e isso é notícia:** os 50 m da nascente e a
travessia perpendicular estavam **impossíveis por falta de contrato** (D74).
Agora são **possíveis por contrato e impossíveis por falta de dado** — nenhum
levantamento declara nascente nem eixo de curso. **É achado para o Geo**, não
para o Generate, e é a primeira vez que o Lab pode dizer isso com número.

A regra dos 50 m continua **escrita e marcada** em `src/travessia.ts`, e
**nenhuma aproximação foi inventada** — a razão da D74 não mudou, só mudou de
responsável (**D88**).

**O que já não é mais trabalho do Lab:** o Generate implementou a regra inteira
da travessia no commit `b4c33cc` — *"o limiar do desvio, a via desenhada, o ponto
da nascente e o custo"* —, com o limiar que o Jonny confirmou (D84). O Lab não
precisa reimplementá-la, e não vai.

## 4 · A rampa: a média diluía o pico por um fator de 6 a 13

O Symbios **já calculava a rampa máxima por via desde o LAB-02**, em
`recorte.ts`. **Faltava onde escrevê-la** — e foi por isso que o LAB-13 batizou
o indicador `rampaMediaMaxima_pct`, de propósito feio (D67). Agora o v2 tem o
campo, a saída do Symbios declara **v2** e o pico viaja:

| gleba | maior rampa **média** | **pior** rampa | fator |
|---|---:|---:|---:|
| `completo` | 24,23 % | **161,38 %** | **6,7×** |
| `geo-antonina` | 10,97 % | **113,54 %** | **10,4×** |
| `ensaio-47ha` | 13,24 % | **77,43 %** | 5,8× |
| `sintetico-50ha-ondulado` | 11,53 % | **64,10 %** | 5,6× |
| `sintetico-10ha-plano` | 1,17 % | **15,44 %** | **13,2×** |

**Os 161 % são os mesmos que o LAB-02 mediu** num cruzamento e que a D67
registrou como *"diluído numa média mansa"*. O que mudou não foi o terreno: foi
o contrato passar a ter onde carregar a medida.

**Quem não reporta o pico sai `null`, não zero** (D23), e medido: **só o Symbios
o reporta.** As duas candidatas do Generate trazem o campo e o deixam `null`; o
Laboratório de Parcelamento ainda escreve saída **v1**. Os dois indicadores ficam
lado a lado — `rampaMediaMaxima_pct` e `rampaPior_pct` —, porque motor que só
fala v1 preenche apenas o primeiro, **e a diferença entre os dois é informação**
(**D89**).

## 5 · O que mudou na tabela do LAB-13

### 5.1 · Dois motores não se mexeram — ao centavo

| motor | lotes | vendável | violações | forma |
|---|---|---|---|---|
| Laboratório de Parcelamento | **=** nas 5 | **=** nas 5 | **=** nas 5 | **=** nas 5 |
| Symbios + subdivisão do Lab | **=** nas 5 | **=** nas 5 | **=** nas 5 | **=** nas 5 |

Sessenta e tantos commits do Generate, e **nenhum número deles mudou**. É a prova
mais forte de isolamento que a esteira já produziu: a regra de ouro diz que o
`external-engines/` pode ser apagado sem o Generate sentir, e isto mostra a seta
na direção contrária — **o Generate pode andar sem os motores de fora sentirem.**

### 5.2 · As candidatas do Generate perderam área vendável — e isso é melhoria

| gleba | motor | lotes | vendável |
|---|---|---:|---:|
| `completo` | ortogonal | 1 606 **(+1)** | 58,33 ha **(−3,09)** |
| `completo` | espinha | 1 805 **(+2)** | 64,94 ha **(−4,97)** |
| `sintetico-50ha-ondulado` | espinha | 788 **(+3)** | 28,51 ha **(−4,83)** |
| `sintetico-10ha-plano` | espinha | 137 **(−2)** | 5,00 ha **(−1,07)** |
| `geo-antonina` | espinha | 1 657 **(=)** | 59,62 ha **(−2,12)** |

**Mais lote e menos área vendável** é resultado desconfortável, e por isso foi
medido antes de atribuído. A medida que explica é a **área média do lote**:

| | antes | depois |
|---|---|---|
| faixa nas dez células | **362,7 a 436,7 m²** | **359,8 a 367,3 m²** |

O parâmetro das cinco glebas é **`areaAlvoLote_m2 = 360`**. As candidatas
**passavam do alvo em até 21 %**; agora batem nele. A área "perdida" não era
venda: era terra que o motor **dava de graça acima do alvo**, e que passou a ir
para via, lazer e sobra. Condiz com o commit deles
`[proporcao-do-lote] A17: a forma do lote vira teto`.

**A célula que não mudou confirma a leitura:** `ensaio-47ha` ortogonal estava em
**362,7 m²**, já no alvo — e é a única das dez intocada.

### 5.3 · Dois achados que o Lab mandou ao Generate estão CONSERTADOS

Dois testes do LAB-08 ficaram vermelhos **porque o defeito que eles fixavam
deixou de existir**:

| o achado, como o Lab o reportou | agora |
|---|---|
| *"o quadro de áreas não fecha: soma 15,8 % mais terra do que o terreno tem"* | **fecha ao centavo** — 470 000,00 de 470 000 |
| *"declara 7 ha de APP num terreno que declara nenhuma — é eco do parâmetro"* | **18 537,16 m² medidos**, e não 15 % de 470 000 = 70 500 |

Commit deles: `8fd954b [quadro-areas] GF-11: as partes do terreno voltam a somar
o terreno`. **Os dois testes continuam existindo, virados**: o que era *"não
fecha"* virou *"fecha ao centavo"*. Apagá-los perderia a guarda no lugar onde o
bug já esteve uma vez — e é onde já esteve que ele volta (**D90**).

### 5.4 · A página do Jonny foi regerada

A medição mudou, então `bun run lab20` correu e
[`COMPARACAO_DOS_MOTORES.md`](../COMPARACAO_DOS_MOTORES.md) está em dia — 19
linhas trocadas. O teste que a prende à medição (D82) fez o seu trabalho.

## 6 · O v2 confirmou a medição do Lab sobre a testada de frente

A atração de `geo-antonina`, na gleba v2 **deles**, chega agora como
**`testada_de_frente`** — não como `via_desenhada`. É exatamente o que o LAB-13
mediu e a **D64** registrou: a única atração daquela gleba é uma testada de 180,2 m
rente à divisa, e o lote mais próximo de qualquer motor estava a 605 m.

O Lab tinha medido; o contrato passou a ter como dizer. E eles escreveram a razão
**creditada**: *"`via_existente` FOI PARTIDA EM DUAS, a pedido do Laboratório
(§3)"*.

## 7 · Os vizinhos ficaram limpos

`git status` nos três clones de leitura ao fim da rodada:
`urban-create-hub-41d93a4d`, `motor-testfit` e `urban-scout-tool` — **nenhuma
alteração**. O reset do clone do Generate foi `git reset --hard origin/main`, que
é leitura: nada foi escrito lá.

## 8 · O que fica para outro repositório — lista numerada, nunca commit lá

**Para o Geo** (`urban-scout-tool`), e é novo:

1. **A nascente não viaja no levantamento.** O contrato de motor v2 tem
   `app_nascente` e o **ponto**, e **nenhuma das sete glebas medidas os
   preenche** — as três APP de `geo-antonina` seguem `app_hidrica` genérica.
   Enquanto o levantamento não distinguir, **a regra dos 50 m do Jonny não é
   verificável por motor nenhum**, e agora a falta é de dado, não de contrato;
2. **O eixo do curso d'água também não viaja.** `eixoDoCurso` existe no contrato
   e sai `null` nas três hídricas. Sem ele, *"travessia perpendicular ao curso"*
   não tem a quê — e o Generate já implementou a regra que o pede.

**Para o Generate** (`urban-create-hub-41d93a4d`), só agradecimento e uma nota:

3. Os **três pedidos entregues**, e **dois achados do Lab consertados** (o quadro
   que não fechava e o eco do parâmetro). A nota: as duas candidatas trazem
   `rampaMaxima_pct` e a deixam `null` nas cinco glebas — o campo existe e ainda
   não é preenchido.

## 9 · O que fica pronto

- `src/gleba-v1.ts` — `VERSOES_LIDAS = ["2","1"]`, `FALTA_NA_V1`, e os campos
  novos no tipo da entrada;
- `src/symbios-para-contrato.ts` — saída **v2**, com `rampaMaxima_pct` por via;
- `src/porta/porta.ts` e `src/porta/motores.ts` — o indicador `rampaPior_pct`,
  ao lado do nome feio que a D67 criou e que fica;
- `tsconfig.json` — o alias `@/` do Generate, espelhado;
- `tests/contrato-v2.test.ts` — 8 testes; `tests/relevo.test.ts` — dois virados;
- `ferramentas/lab18.ts` e `docs/provas/LAB-18/contrato-v2.json`.
