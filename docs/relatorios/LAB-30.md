# LAB-30 · A guarda da IDA — e a quinta vez do ponto cego, a mais cara de todas

**03/10/2026 · `bun run lab30` · provas em
[`../provas/LAB-30/guarda-da-ida.json`](../provas/LAB-30/guarda-da-ida.json)**

O chat mandou: *"a guarda da IDA, do LAB-25, se ainda não estiver fechada."* Não
estava. O LAB-25 fechou **motor → SAÍDA**; este fecha **contrato → motor**.

**E ela achou, no levantamento, antes mesmo de rodar, a quinta vez do ponto cego da
§6 — e a primeira que já tinha saído para o chat.**

---

## 1 · O achado (D119)

O motor do Laboratório de Parcelamento tem um campo de **entrada** chamado
`viaManual`: *"coluna vertebral desenhada à mão, quando houver"*. **A ida do Lab
nunca o preencheu.**

**Medido, preenchendo:**

| gleba | sem a via | com a via |
|---|---|---|
| `antonina-com-via` | 25 vias, 1 386 lotes | **32 vias**, 1 379 lotes |
| `ensaio-com-via` | 12 vias, 599 lotes | 12 vias, **585 lotes** |

**E o Lab publicou, duas vezes, que o MOTOR ignorava via desenhada:**

| onde | o que foi publicado | o que era |
|---|---|---|
| **LAB-17** | *"os quatro declaram que ignoram, e os quatro ignoram"* | três ignoram; o quarto nunca a recebeu |
| **LAB-23** | *"provado por diferença: SAÍDA idêntica nos oito casos"* | prova verdadeira, **conclusão falsa** |

**A diferença entre esta e as quatro anteriores** (D18, D75, D93/D94, D98, D104): as
outras foram pegas **antes de sair**. Esta já tinha saído, em dois recados, e ficou
publicada por duas semanas.

**E o detalhe que mais incomoda:** o LAB-23 escreveu que o teste dele *"morde antes de
qualquer relatório sair errado"*. **Não mordeu** — porque lia a **prova congelada**,
não o motor rodando. **Teste de falsificação que lê prova velha não falsifica:
repete.**

---

## 2 · O conserto, e o que ele revelou (D120)

A ida entrega a via. O **v2** tem tipo próprio (`via_desenhada`) e a ida o lê sozinha;
no **v1** a linha chega como `via_existente`, indistinguível da testada de frente, e
**quem separa é o remendo do LAB-13, na esteira**, que passa a linha pronta —
reescrever o remendo dentro do adaptador seria a segunda régua que o D20 proíbe e que
o D116 puniu há duas horas. O motor tem **uma** coluna vertebral: entra a mais longa,
e isso vai dito como escolha do Lab.

**Entregue a via, a declaração ficou impossível num campo só:**

| pergunta | o Parcelamento | régua |
|---|---|---|
| **lê** a via? (a SAÍDA muda?) | **sim** | com e sem a via, byte a byte |
| **assenta** o traçado nela? | **não** — 11 % | fração da linha com eixo a menos de meia caixa |

Mesmo caso do `leRelevo` (D100). `leViaDesenhada` nasce ao lado de
`respeitaViaDesenhada`, e a varredura do LAB-26 vai de **13 para 14 falsificáveis** —
o `Record<keyof Capacidades>` acusou o campo que faltava **no mesmo segundo** em que o
campo nasceu. É a melhor hora que aquele registro já teve.

**E o `naoAtendido` mudou de postura:** quem lê a via e não assenta nela não
*"ignorou"*, **substituiu**. *"A rua desenhada não aparece"* e *"ela entrou como coluna
vertebral e o traçado saiu por perto"* são dois desenhos diferentes.

---

## 3 · A guarda, e as três regras

| regra | o que pega | reprova? |
|---|---|---|
| `campo-nao-entregue` | o contrato trouxe valor e o destino declarado chegou vazio | **sim** |
| `campo-novo-no-contrato` | o contrato traz campo que o inventário não conhece | **sim** |
| `divida-do-lab` | **o motor TEM onde receber e a ida não entrega** | não — é contada |
| `mapa-velho` | o inventário descreve campo que esta gleba não traz | não — avisa |

**Ela difere da guarda da SAÍDA num ponto que decide o desenho:** lá os dois lados
compartilham nomes (`rampaMedia_pct` nos dois), e a regra podia casar por nome sem
acreditar no inventário. **Aqui os nomes não se parecem** — `gleba.anel` vira
`gleba.externo` —, então o inventário declara o **caminho de destino** e a guarda o
resolve no objeto que a ida de fato produziu.

**`campo-novo-no-contrato` é a regra que pegaria a v2:** `nascente` e `eixoDoCurso`
entraram **dentro** de uma `restricoes` já declarada, e é por isso que a guarda achata
os caminhos dentro das listas. Declarar só `restricoes` deixaria passar exactamente o
caso que a motivou. Hoje as duas idas as declaram como perda — sem dado em gleba
nenhuma (D88) —, e **o dia em que o Geo as trouxer, isto fica vermelho.**

**Resultado nas sete glebas** (as cinco da tabela e as duas com via desenhada):
`campo-nao-entregue: 0`, `campo-novo-no-contrato: 0`, `divida-do-lab: 18`,
`mapa-velho: 310`.

---

## 4 · A dívida declarada, e o que ela custou (D121)

A guarda achou um segundo caso, e ele **não é limite do motor**: a **testada de
frente** chega como linha, e o motor tem `facesLoteamento` — *"faces do perímetro que
recebem lotes virados para a rua existente"* — esperando. **A ida não entrega.**

Chamar isso de `perda` seria mentir (`perda` = *"o motor não tem onde receber"*).
Deixar fora do inventário faria a guarda reprovar, e **guarda vermelha por dívida
conhecida vira guarda desligada.** Então nasceu um destino que **não reprova e é
publicado**, nomeando o campo que espera e o que falta fazer.

**E ela custou alcance, o que vai dito:** com `atracoes` entrando como dívida, a
guarda **genérica** deixou de pegar o caso do D119 — a linha tem três destinos
possíveis e qual vale depende do tipo, que no v1 só se descobre medindo. **Quem
impede o D119 de voltar são duas travas específicas:** a ida preenche `viaManual`, e
com ela o motor desenha diferente. Guarda genérica tem alcance genérico; dizer isso é
melhor que fingir que uma cobre a outra.

**Consequência para a porta:** enquanto a dívida existir,
`respeitaTestadaDeFrente: false` no Parcelamento é **dívida do Lab, não limitação do
motor** — escrito assim no inventário, onde quem for pegá-la vai ler.

---

## 5 · O que foi corrigido do que já estava publicado

- **relatório do LAB-17** e **do LAB-23**: aviso no alto, não reescritos — eles são o
  registro do que foi concluído naquele dia (a mesma regra da D118);
- **D101** (*"declaração se prova por diferença"*): o princípio está certo e vale mais
  do que nunca; a aplicação estava errada. A correção acrescenta a ele: **prova por
  diferença só vale se a diferença chegou ao motor**;
- **as provas dos dois** foram regeradas, e a trava do LAB-23 **virada, não apagada**
  (D90): agora exige o que está medido — três dos quatro ignoram, e o Parcelamento
  muda;
- **a perda que a ida declarava** sobre atração-linha dizia que ela *"é justamente a
  que não entra"*. Era falsa desde sempre, e foi corrigida.

---

## 6 · O que o LAB-30 NÃO fez

- **Não entregou a testada de frente ao `facesLoteamento`.** É a dívida do §4,
  declarada e contada, e **proposta ao chat**: mapear a linha para as faces do
  perímetro que ela cobre é geometria nova.
- **Não remediu a tabela comparativa.** As cinco glebas dela não trazem via desenhada
  — `geo-antonina` traz uma testada de frente, que é a dívida acima. Conferido: nenhum
  número da tabela muda.
- **Não fez o teste do LAB-23 medir em vez de ler a prova.** Ele foi virado e continua
  lendo a prova regerada; o que mede de verdade é o `guarda-da-ida.test.ts`. Fazer
  aquele medir custaria minutos por rodada — e vai como nota, não como silêncio.

---

## 7 · Conferência

- **`./external-engines/conferir.sh` verde nos dois pacotes** — `esteira` com **286
  testes** (21 novos: 20 da guarda da ida e 1 da capacidade nova, mais um virado) e
  `testfit` com 14 — **300 no total** —, `typecheck` e `lint` limpos em ambos.
- **Clones vizinhos limpos:** `git status` em `motor-testfit`,
  `urban-create-hub-41d93a4d` e `urban-scout-tool` — **sem nenhuma alteração**. O
  campo `viaManual` foi **lido** de lá, nunca escrito.
- **Provas regeradas:** LAB-17 e LAB-23 (a medição mudou), e a nova do LAB-30.
- **Mesclado por PR**; os conectores do GitHub estavam de pé.
- **Decisões:** D119 (a quinta vez, e a primeira publicada), D120 (ler e assentar são
  duas perguntas), D121 (a dívida declarada, e o alcance que ela custou).
