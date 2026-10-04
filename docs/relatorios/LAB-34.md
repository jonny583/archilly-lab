# LAB-34 · O aviso vai onde a ordem aparece — e a pergunta era outra

**04/10/2026 · `bun run lab19` + `bun run lab20` · provas em
[`../provas/LAB-19/tabela.json`](../provas/LAB-19/tabela.json)**

> ### ⚠️ Aviso acrescentado em 04/10/2026 — a ausência tem CAUSA desde o LAB-41
>
> Este relatório publica, nas duas glebas sintéticas, que **a candidata ortogonal do
> Generate não entregou desenho aceito** em 5 de 6 e em 3 de 6 posições de acesso — e
> publica isso como **ausência contada**, sem motivo, porque motivo não havia.
>
> **O [LAB-41](LAB-41.md) mediu o motivo:** a candidata **produz plano**, e o plano é
> recusado pelo **contrato do próprio Generate** porque a **via sai da gleba**, de 1,2 a
> 83,5 m além da divisa. **Não é limite do terreno** — a espinha entrega em 11 das 12
> posições — e **não é defeito geral da ortogonal** — 36 pontos de controle em três
> glebas, todos aceitos. Uma restrição de **100 m² posta FORA da gleba**, que não
> desconta área nenhuma, leva as duas glebas a **6/6**.
>
> Os números deste relatório **seguem válidos**: eles medem o que foi aceito. O que muda
> é a leitura da ausência.

O chat mandou: *"a tabela comparativa ordena os motores num único ponto de acesso, e só
a seção do acesso avisa que isso muda até 108 por cento — ponha o aviso onde a ordem
aparece, não escondido."*

A primeira metade era mover o aviso. **A segunda metade é que o aviso respondia à
pergunta errada** — e isso só apareceu medindo.

---

## 1 · "Varia 108 %" e "a ordem muda" são afirmações diferentes

O aviso que existia dizia **quanto o número varia**. Mas:

> Um motor pode variar muito e continuar **sempre na frente**. Quem lê a coluna *lotes*
> dos quadros **ordena os motores com os olhos** — e a pergunta de quem ordena é se a
> ordem aguenta a entrada mudar.

Então a régua nova mede **a ordem**, não a amplitude.

---

## 2 · O medido, nas cinco glebas, com as seis posições de acesso

| gleba | posições comparáveis | ordens distintas | o 1º lugar muda? | quem não respondeu |
|---|---|---|---|---|
| `completo` | 4 de 6 | **3** | **sim** — espinha e ortogonal | espinha, em 2 pontos |
| `sintetico-50ha-ondulado` | **1** de 6 | — | **não há como saber** | ortogonal em 5, espinha em 1 |
| `sintetico-10ha-plano` | 3 de 6 | **2** | não | ortogonal, em 3 pontos |
| `ensaio-47ha` | **6 de 6** | **1** | não — ✅ **a ordem aguenta** | ninguém |
| `geo-antonina` | **6 de 6** | **3** | **sim** — espinha e ortogonal | ninguém |

**A ordem muda em 3 dos 5 terrenos; o primeiro lugar, em 2.**

**E na única gleba real com as seis posições completas, `geo-antonina`, ela muda de
forma que importaria para quem decide:**

| posição | 1º | 2º | 3º | 4º |
|---|---|---|---|---|
| 0 | **espinha** (1 672) | ortogonal (1 390) | Parcelamento (1 386) | Symbios (1 014) |
| 3 | **ortogonal** (1 941) | espinha (1 554) | Parcelamento (1 386) | Symbios (1 014) |
| 5 | **espinha** (1 917) | Parcelamento (1 393) | **ortogonal (1 346)** | Symbios (1 014) |

Na posição 5 a candidata ortogonal **cai para terceiro**, atrás do Parcelamento. Mesmo
terreno, mesmas regras, mesmo conferente: só a entrada mudou.

---

## 3 · A sétima vez do ponto cego — e esta era contra mim mesmo (D133)

**A primeira contagem que eu fiz dizia "a ordem muda em 4 das 5 glebas".** Estava
errada.

Nem todo motor responde em toda posição: no `sintetico-50ha-ondulado` a candidata
ortogonal entrega desenho aceito pelo contrato em **1 de 6** posições. Contando a ordem
nessas posições, ela *"muda"* — **mas o que mudou foi um motor sair da comparação**, que
é outra afirmação.

Conferi antes de publicar duas coisas, nesta ordem:

1. **as posições batem entre motores?** Sim — os seis pontos são os mesmos para os
   quatro, índice a índice (conferido ponto a ponto). Se não batessem, eu estaria
   comparando entradas diferentes entre si, e a tabela acima seria lixo;
2. **as ausências estão inflando a instabilidade?** Sim. Com a conta certa — só posições
   em que **todos** responderam — dá **3 de 5**, não 4.

**A ausência não foi descartada:** sai contada e nomeada (`naoResponderam`), e vai no
aviso da página, porque *"este programa não desenha nada aceitável se a rua entrar
aqui"* também é resposta — no espírito do D23.

**É a sétima vez da forma do §6, e a segunda pega dentro do próprio prompt.** A
diferença desta: **não havia motor de vizinho envolvido.** Eu ia acusar a mim mesmo de
instabilidade que era ausência de dado.

---

## 4 · Onde o aviso ficou

| onde | o quê |
|---|---|
| **debaixo de cada um dos cinco quadros** | o aviso medido *daquela* gleba: *"NÃO aguenta, 3 ordens, o primeiro lugar muda"*, ou *"aguenta, não mudou nenhuma vez"*, ou *"não dá para dizer"* |
| **a legenda da coluna `Lotes`** | o número é **daquele ponto de entrada**, é a coluna que convida a ordenar, e em terreno nenhum é propriedade só do programa |
| **a seção do acesso** | um apontador de volta para os quadros, com os números medidos (3 de 5, 2 de 5) |

**Aviso igual em todo lugar vira decoração**, e há trava exigindo que os cinco **não**
sejam o mesmo texto — justamente porque um dos cinco é um ✅.

---

## 5 · O que mudou no código

| onde | o quê |
|---|---|
| `esteira/src/acesso.ts` | `instabilidadeDaOrdem` — a régua, **num lugar só** (D116), com a armadilha das ausências escrita nela |
| `esteira/ferramentas/lab19.ts` | chama a régua e grava `ordemDoAcesso` em `tabela.json` |
| `esteira/ferramentas/lab20.ts` | `avisoDaOrdem` escreve o aviso debaixo de cada quadro; a legenda e a seção do acesso ganham o apontador. **Lê da medição, não recalcula** |
| `esteira/tests/acesso.test.ts` | 6 travas, incluindo o par do D133 — posição sem resposta fica fora da ordem, e a ausência aparece contada |
| `esteira/tests/pagina.test.ts` | 2 travas: o aviso colado a **cada** quadro, coerente com o medido, e os cinco não sendo o mesmo texto |

**Um defeito meu, no próprio teste:** a primeira versão da trava contava os avisos
filtrando pela frase *"entrada da rua"* — que só as glebas **instáveis** usam. Deu 4 de 5
e acusou a **página**. A conferência que vale é **por posição**: cada quadro tem de ter o
seu aviso colado. Filtro por prosa é régua frágil medindo texto gerado, e está dito no
arquivo.

---

## 6 · O estado verde, e os vizinhos

```
./external-engines/conferir.sh
VERDE — 7 passos, e a cobertura conferida.   331 testes, exit 0
```

`git status` nos três clones somente-leitura: **limpos, nenhum arquivo alterado** — Geo
(`urban-scout-tool`), Generate (`urban-create-hub-41d93a4d`) e o motor do Laboratório de
Parcelamento (`motor-testfit`).

## 7 · Decisões

| | |
|---|---|
| **D132** | O aviso vai onde a ordem aparece — e *"varia 108 %"* não era a pergunta |
| **D133** | A **sétima** vez do ponto cego: contar ordem onde um motor não respondeu |

## 8 · O que fica proposto ao chat

- **As posições em que a candidata ortogonal do Generate não entrega nada aceitável.**
  No `sintetico-50ha-ondulado` são **5 de 6**; no `sintetico-10ha-plano`, 3 de 6. Isso
  está publicado como ausência, mas **não foi investigado** — pode ser limite do motor,
  pode ser a gleba sintética, pode ser a ponte (e a §6 diz que a terceira hipótese merece
  medição antes de qualquer acusação). Enquanto não for medido, `sintetico-50ha-ondulado`
  tem **uma** posição comparável e a tabela dele não sustenta ordem nenhuma. **Não
  executado** — é escopo novo.
