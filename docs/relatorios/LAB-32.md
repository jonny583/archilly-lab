# LAB-32 · A queda que eu publiquei sem investigar era o motor obedecendo

**04/10/2026 · `bun run lab32` · provas em
[`../provas/LAB-32/aderencia.json`](../provas/LAB-32/aderencia.json)**

O chat mandou, com a palavra certa: *"a aderência do Parcelamento caiu de 17,4 para
11,2 por cento depois do conserto do LAB-30 e você publicou sem investigar —
investigue agora, ache o culpado e diga se o número novo é o certo ou se há outro
defeito."*

Publiquei. E era um resultado suspeito do jeito exato que o §6 descreve: *"entreguei a
linha ao motor e ele passou a segui-la menos"* é uma frase que pede medição antes de
virar conclusão.

**A resposta curta:** o número novo está **certo como medida e errado como
comparação**, e o culpado tem duas metades — o **ranking do próprio motor**, que trocou
de partido, e a **minha régua**, que mede uma promessa que o campo do motor nunca fez.
Há sim outro defeito, e ele é meu. Dois, contando o que eu peguei dentro deste prompt.

---

## 1 · O que foi medido, e em que ordem

Três perguntas, nesta ordem, porque cada uma só faz sentido depois da anterior:

1. **a variante é a mesma?** A variante que representa o motor é a de melhor nota
   *dele*. Se entregar a via mudou qual vence, a comparação é entre dois desenhos;
2. **por partido, a aderência mudou?** Esta é a pergunta limpa — mesmo partido, com e
   sem a via, sem troca de variante para confundir;
3. **o que o campo `viaManual` faz no motor?** A pergunta que eu devia ter feito antes
   de eleger a régua, e não fiz.

---

## 2 · A variante trocou — e metade da queda é isso (D127)

| | partido | nota do motor | aderência |
|---|---|---|---|
| **sem a via** | `ortogonal` | 0,6175972674788088 | **17,4 %** |
| **com a via** | `espinha` | 0,6318235204138917 | **11,2 %** |

O 17,4 % era o ortogonal; o 11,2 % é a espinha. **São dois desenhos diferentes.** O
motor trocar de ideia sobre qual partido tem a melhor nota dele é direito dele — só não
é comparação, e eu publiquei como se fosse.

**A queda, decomposta:**

| parcela | quanto |
|---|---|
| o efeito da via **no mesmo partido** (ortogonal: 17,4 → 14,0 %) | **3,4 pp** |
| a **troca de partido** (ortogonal 14,0 → espinha 11,2 %) | **2,8 pp** |

---

## 3 · Por partido, com e sem a via — `antonina-com-via`

| partido | sem | com | Δ | vias |
|---|---|---|---|---|
| ortogonal | 17,4 % | 14,0 % | −3,4 pp | 25 → 32 |
| espinha | 14,0 % | 11,2 % | −2,8 pp | 29 → 23 |
| pente | 26,3 % | 29,6 % | **+3,3 pp** | 38 → 52 |
| diagonal | 17,2 % | 16,9 % | −0,2 pp | 35 → 31 |
| loop | 18,4 % | 14,5 % | −3,9 pp | 27 → 34 |
| cluster | 19,9 % | 19,4 % | −0,6 pp | 35 → 42 |
| radial | 16,8 % | 15,7 % | −1,1 pp | 100 → 95 |
| orgânico | 15,7 % | 17,0 % | **+1,3 pp** | 239 → 257 |
| superquadra | 8,0 % | 3,7 % | −4,3 pp | 9 → 11 |
| mioloVerde | 15,7 % | 17,0 % | **+1,2 pp** | 20 → 27 |

Nenhum partido se move mais de 4,3 pp. **A queda de 6,2 pp que eu publiquei não existe
em partido nenhum** — ela só aparece comparando partidos diferentes.

**E em `ensaio-com-via` nada se move:** nove dos dez partidos dão aderência idêntica aos
três decimais, e dois deles saem com o desenho **byte a byte igual**. Só o `loop` muda,
e para cima (+12,7 pp). A razão está no §5.

---

## 4 · O que o campo faz no motor, e a régua que eu devia ter usado

Lido o motor (`motor-testfit/src/lib/lab/motor.ts`, **só leitura**), `viaManual` faz
exatamente duas coisas:

| | o que faz |
|---|---|
| **`anguloBase()`** | a direção da linha passa a ser o **ângulo base do partido inteiro**, no lugar do ângulo da caixa envolvente da gleba |
| **`faixaDaViaManual()`** | a caixa da linha mais as calçadas viram **área bloqueada antes de qualquer lote nascer** |

**Nenhuma das duas é assentar eixo sobre a linha.** E a régua da aderência pergunta
*"há eixo gerado sobre este ponto da linha?"*. Pior que não medir a promessa: **alinhar
o partido gira a rede toda**, e girar a rede tira eixos de cima das outras três linhas
desenhadas. **A régua lê obediência como queda.**

Medidas as duas promessas do campo, as duas são **cumpridas**:

### (a) O ângulo base — fração do comprimento de eixo a menos de 10° da linha

| partido | sem a via | com a via |
|---|---|---|
| ortogonal | 0,0 % | **72,9 %** |
| pente | 0,0 % | **82,7 %** |
| loop | 0,0 % | **72,4 %** |
| mioloVerde | 0,0 % | **70,1 %** |
| orgânico | 0,0 % | **27,2 %** |
| radial | 0,2 % | 7,3 % |
| espinha | 0,0 % | 5,6 % |
| diagonal · cluster · superquadra | 0,0 % | 0,0 % |

Os cortes de 5°, 10° e 20° estão todos na prova. **O corte é parâmetro declarado, não
limite inventado** (§4): quem mede publica a fração em vários cortes e diz o que cada um
quer dizer.

### (b) A faixa livre de lote — lotes com o **centro** dentro da faixa

| partido | sem a via | com a via |
|---|---|---|
| todos os dez, nas duas glebas | 0 a 20 | **0** |

**Zero invasores em 10 de 10 partidos, nas duas glebas.** Vinham de 9 (ortogonal), 17
(espinha), 20 (diagonal), 16 (mioloVerde).

---

## 5 · Por que `ensaio` não se moveu e `antonina` se moveu inteira

No `ensaio-com-via` a principal desenhada corre **pelo meio do lado maior** do
retângulo — que **já é** a direção da caixa envolvente. O ângulo base muda de quase nada
para nada, e o desenho sai igual. Em `antonina-com-via`, real e irregular, a linha faz
ângulo com ela: alinhar o partido move a rede toda.

**A gleba sintética não tinha como mostrar o efeito.** É a segunda vez que a fixture
geométrica esconde um comportamento que a gleba real mostra — vale como argumento a mais
para a via desenhada **por pessoa** numa gleba real, que a D103 pede e eu não posso
inventar.

---

## 6 · A sexta vez do ponto cego — e esta eu peguei dentro do prompt (D128)

A régua da faixa, na primeira versão que eu escrevi hoje, contava **lotes com vértice
dentro da faixa**. Ela deu, no ortogonal de Antonina, **27 → 34 lotes**, e eu estava a
um passo de publicar *"o motor não cumpre a segunda promessa: dando-lhe a linha, ele põe
MAIS lote em cima dela"*.

**O lote que faz frente para a faixa encosta nela de direito** — a faixa é a caixa da
rua mais as calçadas, e tocar nela é o que "fazer frente" significa. Medir invasão por
vértice conta todo vizinho como invasor.

**Invasão é o CENTRO do lote dentro da faixa.** Medida assim, a promessa é cumprida com
folga. A vizinhança continua publicada, **ao lado e pelo nome** (`soEncostam`), e as
duas travas do teste são o par: o lote em cima (invasor) e o lote defronte (não).

**Com esta, o ponto cego da §6 já se repetiu seis vezes, e três delas eram réguas minhas
acusando a si mesmas.** A tabela das seis está no `CLAUDE.md` §6. A diferença desta: foi
pega **antes de sair** — não por disciplina nova, mas por eu desconfiar de um número que
caminhava para o lado que eu já queria.

---

## 7 · O que mudou no código

| onde | o quê |
|---|---|
| `esteira/src/motores/comum.ts` | `alinhamentoAViaDesenhada` e `lotesNaFaixaDaVia` — as duas réguas novas, **num lugar só** (a lição do D116: régua duplicada dá dois números para a mesma grandeza) |
| `esteira/src/porta/porta.ts` | `alinhaOPartidoAViaDesenhada` na ficha de capacidades, com a ressalva dos ±30° escrita nela |
| `esteira/src/porta/motores.ts` | os quatro motores declarando o campo — **medido em cada um**, não deduzido (o erro do LAB-26 foi declarar por dedução) |
| `esteira/src/porta/experimentos.ts` | o experimento do campo novo: a varredura vai de 14 para **15 falsificáveis** |
| `esteira/tests/alinhamento.test.ts` | 12 travas |
| `esteira/tests/porta.test.ts` | a guarda da existência passou a varrer a pasta de testes (D129) |

**A contagem avisou sozinha, de novo:** o `Record<keyof Capacidades>` do registro
reprovou no mesmo segundo em que o campo nasceu, e a guarda da existência reprovou o
teste novo por ele morar noutro arquivo — ver o §8.

---

## 8 · A guarda que reprovou o teste certo (D129)

A varredura da **existência** lia **apenas `tests/porta.test.ts`**, e reprovou o teste
novo por ele estar em `tests/alinhamento.test.ts`. Duas saídas: mudar o teste de arquivo
ou mudar a guarda.

**A regra do registro é *"todo campo tem quem o desminta"*, não *"todos os desmentidos
moram num arquivo"***. Forçar o segundo transformaria `porta.test.ts` em depósito.
A guarda passou a varrer `tests/*.test.ts` — continua lendo **o arquivo de verdade**,
que é a propriedade de que ela depende, e deixou de confundir *onde* a trava mora com
*se* ela existe.

---

## 9 · O que vai ao Laboratório de Parcelamento — **pelo chat, nunca por commit**

Um item, e é pequeno. Está escrito no §1-D do
[`../O_QUE_FALTA_MEDIR_POR_MOTOR.md`](../O_QUE_FALTA_MEDIR_POR_MOTOR.md):

1. **O sorteio de ±30° em cima do ângulo base** (`variacaoAngular`, no motor). O ângulo
   base obedece à linha, mas cada variante sorteia até 30° em cima dele — então, na
   variante que o ranking deles escolhe em `antonina-com-via`, o ganho de alinhamento é
   de **5,6 pp** e não de 72,9: a obediência existe e fica invisível. **Se o produto
   quer "o motor respeita a linha que eu desenhei"**, talvez o sorteio deva ser
   suprimido ou estreitado quando `viaManual` vier preenchida — linha desenhada à mão é
   intenção explícita (D69), e sortear em cima de uma intenção explícita é outra decisão
   do que sortear em cima de um ângulo de caixa envolvente. **Medição minha, decisão
   deles.**

**Nada a consertar do lado deles no resto.** É a terceira vez seguida que uma acusação
ao motor deles termina sendo defeito do Lab (§1-A, §1-B, §1-D do documento).

---

## 10 · O estado verde, e os vizinhos

```
./external-engines/conferir.sh
VERDE — 7 passos, e a cobertura conferida.   318 testes, exit 0
```

`git status` nos três clones somente-leitura: **limpos, nenhum arquivo alterado** — Geo
(`urban-scout-tool`), Generate (`urban-create-hub-41d93a4d`) e o motor do Laboratório de
Parcelamento (`motor-testfit`).

## 11 · Decisões

| | |
|---|---|
| **D127** | A queda que eu publiquei sem investigar era o motor **obedecendo** |
| **D128** | A **sexta** vez do ponto cego, e esta eu peguei dentro do próprio prompt |
| **D129** | A guarda da existência lia um arquivo só, e reprovou o teste certo |

## 12 · O que fica proposto ao chat

- **A aderência como ela aparece na tabela comparativa.** Se a régua da aderência mede
  uma promessa que só alguns motores fazem, publicá-la numa coluna só, sem dizer de qual
  promessa se trata, convida à mesma leitura errada que eu fiz. **Não mexi na tabela** —
  o LAB-34 é o prompt que trata do que a tabela esconde, e emendá-la aqui seria ampliar
  escopo (§1-A).
