# LAB-41 · A ausência da ortogonal tinha causa: via fora da gleba

**04/10/2026 · `bun run lab41` · provas em
[`../provas/LAB-41/ortogonal-fora-da-gleba.json`](../provas/LAB-41/ortogonal-fora-da-gleba.json)**

O chat mandou: *"as posições de acesso em que a candidata ortogonal do Generate não
entrega nada aceitável, 5 de 6 numa gleba — investigue e diga se é defeito do motor ou
limite real do terreno."*

**A resposta não é nenhuma das duas como a pergunta as põe**, e o motivo é bom: o número
publicado era uma **ausência sem causa**.

---

## 1 · O que o número era, e o que ele é

O LAB-28 contava `posicoesMedidas` — quantas posições de acesso renderam resultado — e
publicava a diferença como ausência. **Ausência não é diagnóstico**, e havia três
hipóteses: o motor, o terreno, ou a ponte do Lab.

**Medido:** a candidata ortogonal **produz plano** em todas as posições. O plano é
**recusado pelo contrato do próprio Generate** (`contratos/motor-v1/esquema.ts`) porque
a **via sai da gleba**:

| gleba | posição | peça culpada | metros fora da divisa |
|---|---|---|---|
| `sintetico-50ha-ondulado` | 1 | via **VP-01** (principal) | **11,07** |
| | 2 | via VP-01 | **77,44** |
| | 3 | via VP-01 | **2,97** |
| | 4 | via VS-09 | **83,49** |
| | 5 | via VP-01 | **19,52** |
| `sintetico-10ha-plano` | 2 | via VP-01 | **17,14** |
| | 3 | via VS-05 | **4,87** |
| | 5 | via VS-03 | **15,05** |

**A recusa não é régua minha** — é o esquema deles, e o Lab é o mensageiro. (O mesmo
arquivo já documenta que a **quadra** transborda em todos os terrenos e nas duas
candidatas, e por isso ela sai como **aviso**; a **via** é recusa dura.)

---

## 2 · Seis hipóteses, e a medição que matou cada uma

| hipótese | o que a matou |
|---|---|
| o ponto de acesso cai fora da divisa — **defeito do Lab** | distância do ponto ao anel: **0 a 3 × 10⁻¹⁴ m** |
| **limite real do terreno** | a **espinha** entrega em **11 das 12** posições que a ortogonal recusa |
| **defeito geral** da candidata ortogonal | **36 pontos** de controle em três glebas, **todos** aceitos |
| gleba **côncava** | `geo-antonina` tem **11 vértices reflexos** e aceita 6/6 |
| a gleba **preenche pouco** o retângulo envolvente | `geo-antonina` preenche **43 %** e aceita 6/6 |
| os percentuais de **APP e lazer** | com `pctAPP`/`pctLazer` nulos, **os mesmos metros**, dígito por dígito |

A primeira era a mais importante de matar, e por isso foi a primeira: ponto de acesso
fora da divisa seria **defeito do Lab**, e é a forma que já custou o D119.

---

## 3 · O diagnóstico que fechou, e ele é de uma linha

Sobrou, por eliminação, um padrão nas cinco glebas: **passa quem tem `restricoes` que
descontam, ou quem é o próprio retângulo envolvente.**

Então o teste: **uma restrição de 100 m², posta FORA da gleba** — que não desconta área
útil nenhuma e só faz `restricoes` deixar de ser vazio.

| gleba | sem restrição | com a restrição de 100 m² **fora** da gleba |
|---|---|---|
| `sintetico-50ha-ondulado` | **1/6** | **6/6** |
| `sintetico-10ha-plano` | **3/6** | **6/6** |

> **A candidata ortogonal toma outro caminho quando `restricoes` está vazio, e nesse
> caminho a via não é aparada pela gleba.**

A restrição falsa é **diagnóstico, não conserto**: ela muda o plano (os lotes mudam), e
o que o Lab publica continua sendo a gleba como ela é.

---

## 4 · O mecanismo provável, lido no código deles — e o que eu NÃO provei

Em `engine/gerar-v1-motor.ts`, a montagem da `VP-01` nasce do **retângulo envolvente**
da massa: a posição transversal é a coordenada do acesso, limitada só para a **caixa**
caber no retângulo, e a extensão vai de ponta a ponta dele com 15 m de margem. Numa
gleba que **não é** o próprio retângulo, uma reta de ponta a ponta na coordenada do
acesso **sai do polígono**.

**O que sustenta:** o controle `ensaio-47ha` **é** o próprio retângulo e aceita 12/12; e
a varredura mostra o transbordo variando **continuamente** com a posição do acesso na
aresta — assinatura de montagem geométrica, não de sorte.

**O que não sustenta:** o preenchimento do retângulo não prediz a falha (43 % em
Antonina, que passa). **O que prediz é `restricoes` vazio** — e a linha que apara (ou
não) a via no caminho com restrições é **deles**, não minha. Fica dito como não medido.

---

## 5 · Para o Archilly Generate — lista numerada, nunca commit lá (§4)

1. **A candidata ortogonal entrega via fora da gleba quando a gleba não declara
   restrição que desconta.** Reprodução: `sintetico-10ha-plano` e
   `sintetico-50ha-ondulado` do Lab, acesso em 6 pontos por comprimento de arco — 8 dos
   12 planos são recusados pelo contrato de vocês, de **2,97 a 83,49 m** fora.
2. **Uma restrição de 100 m² posta FORA da gleba faz os 12 passarem.** É o diagnóstico
   mais curto do achado: o caminho de `restricoes` vazio é o que não apara.
3. **A peça culpada é quase sempre a `VP-01`** — a via principal, a que nasce no acesso.
   Em 6 dos 9 casos é ela; nos outros, uma secundária.
4. **A montagem da `VP-01` usa o retângulo envolvente da massa** e limita a posição
   transversal apenas para a caixa caber nele. Sugestão, e é só sugestão: a extensão
   longitudinal precisa ser cortada pelo **polígono**, não pelo retângulo.
5. **O transbordo varia continuamente com o ponto de acesso na aresta** — numa aresta ele
   cresce de 3,84 a 29,93 m; noutra, decresce de 124,88 m até aceitar. Serve de teste de
   regressão barato: varrer uma aresta e exigir zero recusas.
6. **A espinha não tem o problema** nas mesmas entradas (11 de 12), o que dá um caso de
   comparação dentro da própria casa.

---

## 6 · O defeito de método que este prompt pegou em mim (D151)

Eu tinha **21 pontos** nas glebas acusadas e **6** em cada controle, e ia escrever *"só
as sintéticas falham"*. A frase talvez seja verdadeira; **a evidência não a sustentava**.

> **Controle que recebeu menos medição que o acusado não é controle: é alívio.**

Varridos os controles com a mesma régua — 36 pontos —, nenhuma recusa, e aí a frase
passou a ter base. É parente do §6 pelo outro lado: ali a régua mede a coisa errada; aqui
a régua é certa e vem em **doses desiguais** — e engana do mesmo jeito.

**E uma segunda, menor:** eu ia publicar que o transbordo cresce com a **distância do
acesso ao vértice**. Na face 12 do `sintetico-50ha-ondulado` ele **diminui** (124,88 →
1,07 m → aceito). A assinatura é *"varia continuamente com a posição"*, que é mais fraca
e é a que os números sustentam.

---

## 7 · Entrega

| o quê | onde |
|---|---|
| a ferramenta (`bun run lab41`) | `external-engines/esteira/ferramentas/lab41.ts` |
| a prova: 12 posições com motivo, 36 de controle, 42 de varredura, o diagnóstico | [`../provas/LAB-41/ortogonal-fora-da-gleba.json`](../provas/LAB-41/ortogonal-fora-da-gleba.json) |
| a razão **colada ao número** na página do Jonny | `docs/COMPARACAO_DOS_MOTORES.md`, debaixo dos dois quadros afetados |
| o aviso nos relatórios que publicaram a ausência sem causa | [`LAB-28.md`](LAB-28.md), [`LAB-34.md`](LAB-34.md) |
| decisões | **D150**, **D151** |

**Verde:** `./external-engines/conferir.sh` — 7 passos, exit 0.

**Os clones vizinhos ficaram limpos** — `git status --porcelain` vazio nos três. O
Generate foi **lido**, inclusive o código da `VP-01` e o esquema da recusa, e **nada foi
escrito lá**: o que precisa mudar está na lista numerada do §5, e vai pelo chat.
