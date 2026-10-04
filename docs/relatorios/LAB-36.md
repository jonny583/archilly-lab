# LAB-36 · As regras que eram só afirmação — e duas estavam falsas

**04/10/2026 · `bun test tests/regras.test.ts` · 13 travas**

O chat mandou: *"as quatro regras sem teste que você listou viram guarda ou saem do
documento."*

---

## 1 · O primeiro achado é sobre o próprio pedido: a lista não existia

A lista saiu num **balanço pedido fora da fila**, foi para o chat e **não para um
arquivo**. Não havia como "pegar as quatro" — elas não estavam em lugar nenhum do
repositório.

> **O que vai ao chat e não vai a um arquivo não existe amanhã.** É a lição do
> `RECADOS.md` (§1), aplicada ao que eu respondo fora da fila. Desta vez custou uma
> varredura inteira para recuperar cinco linhas.

Então, em vez de confiar na memória, **varri o `CLAUDE.md` de novo**, regra por regra,
com uma pergunta só: *"o que, hoje, reprovaria se isto deixasse de ser verdade?"*

---

## 2 · Deram cinco, não quatro — e duas estavam FALSAS

| regra | estado antes | conserto |
|---|---|---|
| §4 *"não tem interface"* | ❌ **FALSA** — o HTML da bancada do navegador existe desde o LAB-01 | a regra **declara a exceção**; a guarda conta os HTML e um segundo reprova |
| §7 *"prova com gleba, motor, semente e contrato **em cada arquivo**"* | ❌ **FALSA em 9 de 32** | a regra vale para prova de **medição**; as exceções viram **lista declarada** em duas classes |
| §4 *"não reimplementa o Validator nem o Judge"* | ✅ verdadeira, sem guarda | guarda: o julgamento vem por `@generate/`, e nenhum arquivo define validador próprio |
| §4 *"conserto do Lab vem desligado por padrão"* | ✅ verdadeira, sem guarda | guarda: `aparar?` opcional, só sob pedido, e **quem liga declara o tamanho do corte** |
| §5 *"Testfit é nome interno"* | ✅ verdadeira, sem guarda | guarda: texto para o usuário nunca diz o nome, **e diz o certo** |

**E uma sexta, da mesma família:** §4 *"não escreve em repositório vizinho"*. Era
conferida à mão em toda rodada e dita em todo relatório — virou guarda, com a **conta de
quantos clones foram conferidos** publicada, para que *"0 clones conferidos"* não passe
por verde.

**Regra que ninguém pode desmentir não é regra, é slogan** — e duas já tinham deixado de
ser verdade sem que nada acusasse.

---

## 3 · A §4 da interface: a regra era falsa, o arquivo não

`external-engines/symbios/adapter/ferramentas/navegador/index.html` existe desde o
LAB-01. **Não é produto:** é a bancada onde o `.wasm` do Symbios carrega em Chromium de
verdade, e desde o LAB-31 é o sétimo passo do comando único (D123).

A regra dizia *"não tem interface"*, ponto. Duas saídas: apagar o arquivo (perderia a
prova no navegador) ou **escrever a exceção**. Escolhida a segunda, com guarda:

- **exatamente um HTML** no repositório, e naquele caminho;
- e a bancada **tem de continuar sendo bancada**: carrega o `prova.js` e **não tem
  `<form>` nem `<input>`**. Se um dia ganhar formulário, a exceção deixa de se
  justificar e a trava morde.

---

## 4 · A §7 das provas: duas classes de exceção, e a segunda é fechada

**`NAO_MEDEM_GLEBA` — sete, permanentes por natureza:**

| prova | por que |
|---|---|
| `LAB-04/oraculo.json` | oráculo de geometria contra a literatura, sem gleba |
| `LAB-07/diagnostico-relevo.json` | diagnóstico do interpolador do próprio Lab: não roda motor |
| `LAB-07/lab01-50ha-ondulado.entrada.json` | é uma **entrada** guardada como prova, não uma medição |
| `LAB-24/formato-proposto.json` | contrato de dado proposto ao Generate e ao Orçamento |
| `LAB-26/varredura.json` | o objeto medido é a **ficha de capacidades**, não uma gleba |
| `LAB-31/navegador.json` | mede o `.wasm` em Chromium, sem terreno |
| `LAB-31/sabotagem.json` | mede o script e o código de saída |

**`CONGELADAS_ANTES_DA_REGRA` — duas, conjunto FECHADO:** `LAB-06/ranking.json` e
`LAB-07/medicoes.json` não trazem a versão do contrato. **Não se regera prova congelada
para consertar etiqueta** (D118), então o dado que falta **mora na lista, nomeado**:
contrato `1` nas duas, como dizem os relatórios. **E há teste exigindo que esse conjunto
não cresça** — senão *"de antes da regra"* vira desculpa para prova nova incompleta.

**Uma omissão foi consertada de verdade:** `LAB-30/guarda-da-ida.json` não trazia
`semente`, e a guarda **roda os motores** — era falta, não exceção. Acrescentada, prova
regerada.

**As listas se auto-limpam**, como o LAB-33 ensinou: a guarda reprova a exceção que
aponta para arquivo inexistente **e** a que passou a cumprir a regra.

---

## 5 · A nona vez do ponto cego (D137)

A primeira versão da guarda do §7 exigia a chave `"gleba"` **literal**, e reprovou **13
de 32** provas. Eu tinha nas mãos *"um terço das provas do repositório viola a §7"* — um
número grande o bastante para parecer achado.

**Era a régua.** Há prova que identifica a gleba em **`glebas`** (plural), e arquivo de
**SAÍDA** que a identifica em `entrada`, com a versão do contrato dentro do bloco
`archilly` — como o contrato manda. **Exigir um nome só é medir ortografia, não
conteúdo.**

Declarados os nomes aceitos por conceito, sobraram **9**, e aí cada uma era um caso de
verdade. A lição entrou no `CLAUDE.md` §6:

> **Antes de acusar em volume, pergunte se a sua régua aceita os nomes que a coisa de
> fato usa.** Régua que casa por nome exato mede ortografia; régua que casa por conceito
> mede conteúdo — e é por isso que a guarda da ida resolve **caminho**, e não nome (D30).

**Nona vez da forma, quarta pega dentro do próprio prompt.** A diferença: o acusado não
era motor de vizinho nem ponte do Lab — **eram os arquivos de prova deste repositório**.

---

## 6 · O que mudou

| onde | o quê |
|---|---|
| `CLAUDE.md` §4 | a exceção da bancada do navegador, escrita, com a guarda citada |
| `CLAUDE.md` §7 | a regra das provas passou a valer para prova de **medição**, com as exceções declaradas |
| `CLAUDE.md` §6 | a nona linha da tabela do ponto cego, e a lição da régua que mede ortografia |
| `esteira/tests/regras.test.ts` | **13 travas**, uma família por regra |
| `esteira/ferramentas/lab30.ts` | a `semente` que faltava na prova da guarda da ida |

---

## 7 · O estado verde, e os vizinhos

```
./external-engines/conferir.sh
VERDE — 7 passos, e a cobertura conferida.   353 testes, exit 0
```

`git status` nos três clones somente-leitura: **limpos** — e isso agora é **teste**, não
só conferência minha: Geo (`urban-scout-tool`), Generate
(`urban-create-hub-41d93a4d`) e o motor do Laboratório de Parcelamento
(`motor-testfit`).

## 8 · Decisões

| | |
|---|---|
| **D136** | As regras que eram só afirmação viraram guarda — e **duas estavam falsas** |
| **D137** | A **nona** vez do ponto cego: a régua media **ortografia**, não conteúdo |

## 9 · O que fica proposto ao chat

- **O balanço fora da fila não tem onde morar.** Os RECADOS têm `RECADOS.md`; os
  relatórios têm `docs/relatorios/`. Uma resposta fora da fila — como o balanço de 03/10
  que originou este prompt — **não tem arquivo**, e some. Proponho um
  `docs/relatorios/BALANCOS.md`, na mesma forma do `RECADOS.md`. **Não executado:** é
  escopo novo e mexeria no `CLAUDE.md` §1, que é regra sua.
