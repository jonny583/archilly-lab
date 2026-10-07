# LAB-54 · As 27 `frente` atribuídas — e a régua dele erra o RÓTULO, não o VEREDICTO

**07/10/2026** · prompt da fila de 07/10, o segundo, **caminho crítico do MVP**. Saiu da
minha lista de *"proposto ao chat"*, escrita no LAB-48 (§3.2) — **o único pedaço das 128
sem culpado**.

---

## 0 · A resposta, em quatro linhas

| das 27 | quem é | o que é |
|---:|---|---|
| **23** | **o MOTOR** | lote de miolo: **nenhum ponto da borda** a menos de ~0,62 m de superfície viária, e **zero m²** sobre leito. Não tem rua nenhuma perto |
| **4** | a **RÉGUA** — e só o **RÓTULO** dela | o lote encosta no leito, mas com **2,04 a 4,16 m** de frontagem contígua. A régua diz *"nenhuma aresta encosta em via"*, e o certo seria *"testada de 2 m"* |
| **0** | a ponte | — |
| **0** | o contrato | nenhuma das quatro glebas declara rua pública, então o contrafactual do campo que falta é `null` nas 27 |

**E a linha que decide se vale consertar:** das 4 — e das **11** no total das cinco glebas —
**nenhuma desapareceria**. A frontagem real é de **1,5 a 5,49 m** contra um mínimo declarado
de **10 m**, então o invariante seguinte acusaria `testada` no mesmo lote.

> **Régua que erra o RÓTULO e acerta o VEREDICTO não é régua errada — e consertá-la não
> derruba violação nenhuma.**

Eu estava a um passo de escrever *"a régua do Generate erra em 11 das 56"* e de pôr um item
de conserto no repositório do vizinho. **Ela acerta o veredicto em 11 de 11.**

---

## 1 · Como medir "POR QUÊ" sem trocar de régua

O LAB-48 parou exatamente aqui, e com razão:

> *"A minha régua é distância ao eixo menos meia-caixa, e a do Validator é `_testadaDoLote`
> contra as `superficiesDeFrente` dele. **As duas não são a mesma régua**, e usar a minha
> para dizer 'a régua dele erra em 8 casos' seria exatamente a forma do D93 e do D127."*

Mas rodar a régua dele responde **se** ela acusa, não **por quê**. E o porquê é o prompt.

### Como a função dele decide, lida no código (só leitura)

`urban-create-hub-41d93a4d` · `src/lib/engine/invariantes.ts` · `_testadaDoLote`:

```ts
const meio = _midpoint(a, b);                                   // ← o PONTO DO MEIO da aresta
…
if (_distAoContorno(meio, superficies[k]) <= TOL_APOIO_VIA_M) { frontal = true; break; }
```

Para cada aresta, o **meio** dela a até **0,75 m** do **contorno** de alguma superfície
viária. A testada é a maior **sequência contígua** de arestas frontais; zero frontais ⇒
violação `frente`, com o detalhe *"nenhuma aresta encosta em via"*.

**O meio da aresta é uma AMOSTRA.** Numa aresta de 34,16 m que encosta no leito só numa
ponta, o meio está a 17 m de lá — e a aresta inteira some do teste.

### O probe: mude a AMOSTRAGEM e deixe a função DELE responder

`densificar()` insere vértices ao longo das arestas: **mesma borda, mesma área, mesmo
polígono** — só os pontos que a função dele amostra mudam. Se ela passa a devolver
testada > 0, a conclusão é **dela sobre o mesmo polígono**, não uma régua minha discordando.

| | |
|---|---|
| **o positivo** | a escada 2 · 4 · 8 · 16 · 32 · 64 · 128 amostras por aresta, até a resposta dele virar — e a ferramenta registra **quantas bastaram** e **qual aresta** era a frontal perdida (densificando uma de cada vez) |
| **o negativo** | passagem fina com passo de **0,25 m**: nenhuma amostra a ≤ 0,75 m do contorno ⇒ **nenhum ponto da borda** a menos de ~**0,62 m**. Sem declarar o passo, *"continuou zero"* não prova nada (D164) |
| **a precondição** | **duas**, e a segunda nasceu de uma sabotagem — ver o §4 |

**E o mecanismo é falsificável fora das cinco glebas:** há trava sintética, sem gleba
nenhuma, com um lote de 34 × 12 m que encosta num leito só nos 2 m da ponta. A função dele
devolve **0** como está e **> 0** densificada — e devolve **0** quando o leito está longe,
que é a trava de que o probe não cega a régua dele.

---

## 2 · As 27, uma a uma

### 23 são do motor, e a medição não deixa dúvida

Lotes de **290 a 402 m²**, maior aresta de **25,1 a 34,2 m**, **0 m² sobre leito de via** em
todos, e a função dele continua devolvendo **zero** com passo de 0,25 m. São as fileiras de
miolo: o motor desenhou lote onde não passa rua.

### 4 são a régua, e as quatro estão em `completo`

| lote | área | maior aresta | amostras que bastaram | **frontagem real** | mínimo | vira `testada`? |
|---|---:|---:|---:|---:|---:|---|
| `v1-l398` | 401,9 m² | 34,16 m | **8** | **2,04 m** | 10 m | **sim** |
| `v1-l568` | 386,4 m² | 34,16 m | **2** | **3,82 m** | 10 m | **sim** |
| `v1-l763` | 401,2 m² | 34,16 m | **2** | **4,16 m** | 10 m | **sim** |
| `v1-l957` | 401,9 m² | 34,16 m | **2** | **3,93 m** | 10 m | **sim** |

**Duas amostras por aresta bastam em três dos quatro** — ou seja, a frente está perto do
meio de uma aresta vizinha, não num canto improvável. E as **arestas que viram frontais são
sempre duas contíguas**, o que bate com a geometria de um lote de quina de fileira.

### A ponte e o contrato estão descartados, e por medição

O contrafactual do campo que falta (`faixaViaPublica`) **não foi remedido aqui** — ele foi
**lido** da prova do LAB-53 e cruzado por lote, porque medir a mesma pergunta duas vezes em
dois arquivos é a segunda montagem que o D116 proíbe. Nas 27 ele é `null`: **nenhuma das
quatro glebas declara rua pública**, então não há faixa a construir. Ponte: as 27 não têm
campo nenhum vindo da `amostra` no caminho, e o conserto do LAB-53 não as tocou — medido no
próprio LAB-53, as 81 não-`testada` eram os mesmos 81 lotes.

---

## 3 · O que isto acrescenta sobre Antonina, sem ser o prompt dela

As 29 de `geo-antonina` não eram a pergunta, mas a ferramenta as mede junto, e o cruzamento
**confirma a atribuição do LAB-48 com uma segunda régua independente**:

| das 29 | `someComAFaixaViaPublica` (LAB-53) | o probe de amostragem diz |
|---:|---|---|
| **18** | **não** | `motor-sem-via-perto` — **o motor, confirmado duas vezes** |
| **4** | **sim** | `motor-sem-via-perto` — só a rua pública as salva |
| **7** | **sim** | **também viram** com amostragem fina |

**Os 7 têm duas explicações, e a do contrato é a que vale:** com a rua pública declarada
eles **desaparecem**; com a amostragem fina eles só **trocam de etiqueta** (frontagem de
1,5 a 5,49 m). E os 7 são `v19-e5` a `v19-e13` — **os mesmos lotes das 11 `via-sobre-lote`**,
com 4,65 a 157,4 m² sobre leito de via. Um único mecanismo do motor, visto agora por **três**
invariantes.

---

## 4 · A sabotagem achou a minha precondição pela metade (D186)

Cinco sabotagens, e **a primeira passou**. Eu desloquei todos os pontos densificados em
**1 cm** esperando a precondição de área reprovar. Ela **aprovou** — e estava certa:

> **Deslocar TODOS os pontos é uma TRANSLAÇÃO, e translação não muda área nenhuma.**

A sabotagem era mal escolhida, mas o que ela revelou é um defeito de verdade: **a conta de
área não detecta translação**, e translação é o pior erro possível num probe que mede
**distância até o leito da via**. Um probe que escorregasse o lote 1 m para o lado da rua
faria a régua do Generate dizer *"tem frente"* sobre um lote que não tem — e a área
aprovaria.

> **Área preservada não prova borda preservada.** A área é invariante por translação e por
> rotação; o que este probe precisa garantir é que **cada ponto novo está SOBRE a borda
> original**.

A precondição passou a ser **duas**: a área (teto 1e-6 m²) **e** a distância de cada ponto
novo à borda original (teto 1e-9 m). Com ela, a sabotagem da translação reprova — e há uma
sabotagem a mais, que **remove a segunda metade** e também reprova.

**É a terceira vez em três prompts que a sabotagem pega o que eu não vi** (D179, D181, D186).

| sabotagem | antes do D186 | agora |
|---|---|---|
| 1 · `densificar` **translada** os pontos | **PASSOU** 🔴 | **reprova** |
| 5 · a precondição confere **só a área** | — | **reprova** |
| 2 · o saldo deixa de ser zero | reprova | reprova |
| 3 · a ferramenta para de importar a régua dele | reprova | reprova |
| 4 · classe fora do conjunto fechado | reprova | reprova |

---

## 4-A · E a varredura do LAB-52 reprovou o meu código novo — o primeiro achado VERDADEIRO dela

O verde deste prompt **falhou**, e quem falhou foi a minha própria varredura de chamadas, a do
LAB-52 que fechou com *28 de 28 falso positivo* (D179). O achado:

```ts
const testadaFina = Number(_testadaDoLote(…).toFixed(2));   // e nenhum Number.isFinite no arquivo
```

**E a degradação aqui é uma acusação publicável:** `NaN > 0` é `false`, então um `NaN` faria o
lote cair em **`motor-sem-via-perto`** — o Lab acusando o motor do vizinho por um número que
não é número, **no prompt cuja tese é não atribuir sem medir**. Consertado com um
`testadaDele()` que **estoura com a frase inteira**, e **não** com uma entrada nova em
`BENIGNOS`: declarar benigno o que é real é afrouxar a régua quando ela nos reprova (D172,
D187). Os números não mudaram — o `NaN` nunca aconteceu, e a trava é preventiva.

**E quem pegou foi o comando único**, não eu: eu havia rodado `typecheck`, `test` do arquivo
novo e a própria ferramenta antes do commit. É a segunda vez no mesmo dia (a primeira foi o
`tsc` do `testfit` no LAB-53).

## 5 · E uma frase do LAB-48 é FALSA contra a lista impressa ao lado dela (D185)

O LAB-48 §3.2 escreveu:

> ~~*"**Oito estão a 0,2 m ou menos da borda do leito** — uma delas encostando (−0,05 m)."*~~

**São CINCO.** A lista está impressa na linha de cima do próprio relatório —
`−0,05 · 0,0 · 0,0 · 0,0 · 0,2 · 1,2 · 1,6 · 3,1 · …` —, e cinco dela são ≤ 0,2 m. O **oito**
é a contagem até **3,1 m**, não até 0,2. Eu escrevi o número **de memória, com a lista ao
lado**.

**Corrigido riscando, não apagando** (D161). E a parte útil: **a régua dele confirma 4 dos
meus 5**. O quinto, `v12-l469`, está a **exatamente 0,2 m** pela minha régua e **continua
zero** pela dele com passo de 0,25 m — a borda dele está a mais de 0,62 m de qualquer
superfície. *As duas réguas discordam num lote, e a dele é a que vale, porque o invariante é
dele.* É o D93/D127 medido em vez de argumentado.

> **Número que o próprio relatório lista ao lado não se escreve de memória.**

---

## 6 · Para o Generate — lista numerada, nada escrito lá

**Nada foi escrito no vizinho.** Os três clones foram conferidos ao fim da rodada e estão
limpos (§4): `motor-testfit` em `4181e95`, `urban-create-hub-41d93a4d` em `5b7e9b4`,
`urban-scout-tool` em `f38dc0c`, `git status` vazio nos três.

1. **O `_testadaDoLote` amostra o MEIO da aresta, e a mensagem que ele gera engana.** Em
   **11 lotes das cinco glebas** ele diz *"nenhuma aresta encosta em via"* sobre lote que
   encosta com 1,5 a 5,49 m. **E o conserto não vale número:** medido, as 11 só trocariam
   `frente` por `testada` e **zero desapareceriam**. Então isto é item de **MENSAGEM**, não
   de contagem — vale para quem lê o relatório, e **não está no caminho crítico do MVP**. Se
   algum dia valer, a correção é amostrar mais de um ponto por aresta (duas amostras
   bastaram em 3 dos 4 casos de `completo`), ou medir a distância do **segmento** ao contorno
   em vez do ponto do meio.
2. **As 23 `frente` de miolo são do motor do Parcelamento**, e a prova as nomeia com gleba,
   lote, área e maior aresta. Não há rua perto: 0 m² sobre leito e borda a mais de 0,62 m de
   qualquer superfície viária.
3. **A atribuição de Antonina do LAB-48 está CONFIRMADA por uma segunda régua** — 18 do
   motor, 11 do campo que falta —, e os 7 que também viram com amostragem fina são os mesmos
   `v19-e5`…`v19-e13` das `via-sobre-lote`. **Um mecanismo do motor visto por três
   invariantes**, e é o LAB-55.

---

## 7 · Entrega

| o quê | onde |
|---|---|
| o probe, testável | [`src/probe-de-amostragem.ts`](../../external-engines/esteira/src/probe-de-amostragem.ts) |
| a ferramenta | [`ferramentas/lab54.ts`](../../external-engines/esteira/ferramentas/lab54.ts) · `bun run lab54` |
| as travas (15) | [`tests/frente.test.ts`](../../external-engines/esteira/tests/frente.test.ts) |
| a prova | [`docs/provas/LAB-54/frente-nao-atribuida.json`](../provas/LAB-54/frente-nao-atribuida.json) |

A prova **mede gleba**, e traz gleba, motor, semente e contrato — sem exceção a declarar. A
suíte vai de **450 para 465 travas**; o trabalho do CI sem clones **continua em 114**, porque
`frente.test.ts` importa do Generate e precisa do clone privado (pôr lá seria o D143 de
novo).

## 8 · As decisões

- **D183** — **as 27 estão atribuídas: 23 do motor, 4 da régua.** E o método vale mais que o
  número: para perguntar *"por que a régua DELE diz zero"* sem trocar de régua, **mude a
  AMOSTRAGEM e deixe a função dele responder** — densificar o polígono muda só os pontos que
  ela testa, e quem muda de resposta é o código dele sobre o mesmo polígono;
- **D184** — **régua que erra o RÓTULO e acerta o VEREDICTO não é régua errada.** Os 11
  lotes em que a amostragem fina muda a resposta têm frontagem real de 1,5 a 5,49 m contra
  10 m de mínimo: **11 trocam `frente` por `testada` e ZERO desaparecem.** Eu estava a um
  passo de pôr um conserto na régua do vizinho que não derrubaria violação nenhuma — *medir
  o SALDO antes de propor o conserto é o que separou um item de contagem de um item de
  mensagem;*
- **D185** — **a frase *"oito estão a 0,2 m ou menos"* do LAB-48 é falsa contra a lista
  impressa ao lado dela: são cinco.** Corrigida riscando (D161). *Número que o próprio
  relatório lista ao lado não se escreve de memória* — e a régua dele confirma 4 dos 5,
  discordando em `v12-l469`;
- **D187** — **a varredura de chamadas do LAB-52 teve o primeiro achado VERDADEIRO**, um
  prompt depois e no meu próprio código. *Régua cujo primeiro resultado é 28 de 28 falso
  positivo não está errada: está sem caso ainda;*
- **D186** — **área preservada não prova borda preservada.** A primeira precondição do probe
  era só a área, e a sabotagem da **translação** passou por ela: deslocar todos os pontos
  não muda área nenhuma, e num probe que mede **distância** isso é o pior erro possível.
  Agora são duas precondições, e a segunda é a distância de cada ponto novo à borda
  original. **Terceira vez em três prompts que a sabotagem pega o que eu não vi** (D179,
  D181, D186).
