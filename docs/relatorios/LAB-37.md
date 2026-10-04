# LAB-37 · A dívida da testada de frente, paga — e a D121 estava certa

**04/10/2026 · `bun run lab37` · provas em
[`../provas/LAB-37/testada-de-frente.json`](../provas/LAB-37/testada-de-frente.json)**

O chat mandou: *"a dívida da testada de frente — mapear a linha para as faces do
perímetro e entregá-la em `facesLoteamento`: escreva o tamanho e execute se couber."*

---

## 1 · O tamanho, escrito antes de executar

| peça | o quê |
|---|---|
| a régua | `facesCobertasPelaLinha` — qual aresta do perímetro a linha cobre, e com que fração |
| a ida | opção `facesLoteamento`, como a `viaManual` do LAB-30 |
| a esteira do adaptador | passagem adiante |
| o invólucro | calcula e passa |
| o inventário | a `divida` vira entrega |
| a porta | `respeitaTestadaDeFrente` **medido** |
| provas, travas, documentos | o de sempre |

**Comparável ao LAB-30. Cabe num prompt.** E caiu dentro: além do previsto, dois achados
que não estavam na conta (§5 e §6).

---

## 2 · O mapeamento, e a lição do D75 dentro dele

Só duas glebas têm testada de frente, as duas de Antonina, **180 m** cada.

| face | comprimento | coberta | entregue? |
|---|---|---|---|
| **0** | 180 m | **100 %** | ✅ |
| 1 | 1 846 m | 0 % | — |
| 19 | 55 m | **3 %** | ❌ o vértice compartilhado, não a testada |

Os dois parâmetros são **declarados**:

- **tolerância, 1 m** — a linha e o perímetro vêm de levantamentos diferentes e não
  coincidem ao centímetro. **De 1 a 5 m dá o mesmo resultado**, o que diz que a escolha
  não está mandando no número;
- **fração mínima, meia face** — e **sem ela a régua repetiria o D75**, em que uma régua
  de vértice pôs três de quatro vias desenhadas no balde errado. A face 19 encosta na
  linha no canto; canto não é testada.

**O que esta régua não decide:** se a face vai render lote. O motor pula face mais curta
que a testada do lote externo, e isso é decisão dele.

---

## 3 · O resultado: o motor respeita, e a D121 previu (D138)

| | sem as faces | com as faces |
|---|---|---|
| lotes com aresta na testada, em **10 de 10** partidos, nas **duas** glebas | **0** | **14 a 18** |

A **D121** dizia, por escrito, que enquanto a dívida durasse, `respeitaTestadaDeFrente:
false` era **dívida do Lab, não limitação do motor**. **Medido: ela estava certa.** A
declaração virou `true`, com o experimento do registro a desmentindo se voltar a mentir.

**E a dívida paga devolveu o alcance que ela custou.** O D121 registrou que fazer de
`atracoes` uma `divida` tirou a mordida da guarda genérica — dívida não reprova. Agora
`atracoes` é **entrega com três destinos** (`terreno.atracoes | viaManual |
facesLoteamento`), e a trava do D119 mostra a diferença: **a ida "como era" passou a ser
reprovada pela guarda genérica.**

**A categoria `divida` está vazia hoje.** O ajudante fica no código, sem uso, de
propósito: a próxima dívida não precisa reinventá-lo, e a gaveta vazia é a prova de que
ele cumpriu o que prometia — ser uma **confissão com prazo**.

---

## 4 · O achado que não estava na conta: o arnês da guarda (D139)

Declarado `atracoes` como entrega, a guarda **reprovou 6 campos em `geo-antonina`**,
dizendo que a testada não chegava. Eu tinha nas mãos *"a entrega não funciona"*.

**Ela estava certa sobre o que mediu e errada sobre a esteira.** O `rodarTestfit`
calculava a coluna vertebral **e** as faces; o arnês da guarda calculava **só a coluna**.
A guarda auditava um caminho que **não é o caminho**.

**Pior que reprovar à toa é medir outra coisa** — e a divergência nasceu **dentro da
guarda que existe para impedir exatamente isso** (D116). Consertado com
`oQueAEsteiraPassaPronto`, a única montagem, usada pelos dois; e há trava exigindo que
os dois arquivos a citem, porque o jeito de isto voltar é alguém "simplificar" um deles.

---

## 5 · O segundo achado: o ranking dele passou a preferir 33 lotes (D140)

Entregue a testada em `geo-antonina`, **o ranking do próprio motor passou a preferir
`superquadra` com 33 lotes sobre `ortogonal` com 1 228** — nota **0,6226** contra
**0,5881**. Antes da entrega o `superquadra` desenhava **zero** lotes e era inválido; com
os lotes externos da testada passou a valer, e virou o primeiro.

| saída | por que não |
|---|---|
| escolher a variante por mim (a de mais lotes) | **o Lab decidindo pelo motor** — a regra é a melhor nota DELE desde o LAB-13 |
| não entregar a testada na rodada da tabela | **esconder dado do motor**, que é o pecado do D119 |

**Feito: entregar, publicar o 33, e dizer a razão onde o número aparece.** O
`rodarTestfit` publica, quando a variante de mais lotes tem **o dobro ou mais** (corte
declarado), uma linha com os dois partidos, os dois números e as duas notas. E o gerador
da página passa a pôr essa linha **debaixo do quadro do terreno** — porque a seção do
fim **agrupa as queixas e elide os números**, deixando o 33 sem explicação justamente
onde ele é lido.

**É o princípio do LAB-34 aplicado a outro número:** *"ponha o aviso onde o número
aparece, não escondido"*.

---

## 6 · Os detectores de prova velha fizeram o trabalho deles

Mudar a ponte invalidou **duas provas publicadas**, e as duas acusaram sozinhas:

| trava | o que disse |
|---|---|
| `coluna-vertebral.test.ts` (LAB-33) | *"os números publicados não batem com os medidos agora — regere com `bun run lab23`"* |
| `acesso.test.ts` (D116) | *"a tabela do LAB-19 e a prova do LAB-28 não trazem os mesmos números"* |

Regeradas as duas, mais a tabela e a página do Jonny. **É o mecanismo do D131
funcionando no primeiro uso real:** prova congelada serve para acusar que envelheceu.

---

## 7 · O que mudou no código

| onde | o quê |
|---|---|
| `esteira/src/motores/comum.ts` | `facesCobertasPelaLinha` e `oQueAEsteiraPassaPronto` — as duas num lugar só |
| `testfit/adapter/src/ida.ts` | a opção `facesLoteamento`, e a entrega |
| `testfit/adapter/src/esteira.ts` | passagem adiante |
| `esteira/src/motores/testfit.ts` | calcula, passa, e **declara** o que entrou e o que a escolha custou |
| `esteira/src/guarda-em-acao.ts` | o arnês passou a usar a função única (D139) |
| `esteira/src/inventario-das-idas.ts` | a `divida` virou entrega com três destinos |
| `esteira/src/porta/motores.ts` | `respeitaTestadaDeFrente: true`, medido |
| `esteira/ferramentas/lab20.ts` | o aviso que explica um número vai **debaixo do quadro** |
| `esteira/tests/testada-de-frente.test.ts` | 12 travas |
| `esteira/tests/guarda-da-ida.test.ts` | o andar da dívida **virado por medição**, não por sinal |

---

## 8 · O que vai ao Laboratório de Parcelamento — **pelo chat, nunca por commit**

1. **A nota de vocês prefere 33 lotes a 1 228 na mesma gleba** (`geo-antonina`, com a
   testada de frente entregue): `superquadra` nota 0,6226 contra `ortogonal` 0,5881.
   Pode ser intencional — plano de poucos lotes grandes é um produto —, mas **se não
   for, está medido**. O que mudou foi a testada passar a render lotes externos, o que
   validou um partido que antes desenhava zero lotes.
2. **O item do LAB-32 segue de pé:** o sorteio de ±30° em cima do ângulo base
   (`variacaoAngular`) torna invisível a obediência à via desenhada na variante que o
   ranking escolhe.

---

## 9 · O estado verde, e os vizinhos

```
./external-engines/conferir.sh
VERDE — 7 passos, e a cobertura conferida.   368 testes, exit 0
```

`git status` nos três clones somente-leitura: **limpos** — e desde o LAB-36 isso é
**teste**, não só conferência minha.

## 10 · Decisões

| | |
|---|---|
| **D138** | A dívida da testada de frente foi **paga**, e a D121 estava certa |
| **D139** | O **arnês da guarda** media um caminho que não era o caminho |
| **D140** | A escolha da variante segue sendo do motor — e **quando custa lote, sai dito** |

## 11 · O que fica proposto ao chat

- **Fixture com testada de frente em gleba que não seja Antonina.** As duas únicas
  glebas com testada são as duas de Antonina, e a face coberta é a mesma (face 0, 180 m).
  A régua está travada por teste de unidade com quadrado sintético, mas **a medição
  real tem uma só forma**. Escopo novo, não executado.
