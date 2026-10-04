# LAB-26 · A varredura das capacidades — e a suíte que estava vermelha há duas semanas

**03/10/2026 · `bun run lab26` · provas em
[`../provas/LAB-26/varredura.json`](../provas/LAB-26/varredura.json)**

O prompt pediu duas coisas: partir `leRelevo` em duas — **já feito no LAB-22**
(D100) — e **varrer as outras capacidades declaradas que o teste de falsificação
ainda não cobre**.

A varredura achou três campos descobertos, **a declaração falsa estava num
deles**, e no caminho achou uma coisa pior, que não é sobre capacidade nenhuma.

---

## 1 · A frase que não se revalidava (D108)

O `porta.ts` do LAB-14 afirma, no alto:

> *"Cada campo é falsificável, e o `tests/porta.test.ts` falsifica todos."*

**A segunda metade era falsa.** Contados os 15 campos de `Capacidades` contra os
testes que existiam:

| campo | tinha experimento? |
|---|---|
| `entrega`, `leRelevo`, `relevoMudaOTracado`, `exigeRelevo`, `aceitaSemente`, `determinista`, `calculaGreide`, `respeitaViaDesenhada`, `respeitaTestadaDeFrente`, `respeitaRestricao` | **sim** — dez |
| **`respeitaAcesso`** | **não — nenhuma menção no arquivo de teste** |
| **`geometrias`** | **não** — só `length >= 1`, que não desmente nada |
| **`versao`** | **não** |
| `id` | conferido (não colide), não é capacidade |
| `nome` | rótulo de tela — não há o que medir |

É o mesmo defeito que o LAB-25 tirou dos comentários da ponte, **uma camada
acima**: uma afirmação sobre o futuro morando em prosa. Lá era *"o motor não
calcula greide"*; aqui era *"o teste falsifica todos"*.

**A peça que impede a repetição** é `src/porta/experimentos.ts`: cada campo aponta
para o **nome do teste** que o desmente, e dois testes de varredura sustentam a
frase — **cobertura** (campo novo sem experimento reprova no mesmo dia) e
**existência** (nome citado que não existe no arquivo de teste reprova). A segunda
é a que dá peso à primeira.

Contagem publicada e **testada**: **13 falsificáveis, 1 conferido, 1 sem régua.**

> **Atualizada desde então, e o teste é que avisou:** 14 no LAB-30 (`leViaDesenhada`)
> e **15 no LAB-32** (`alinhaOPartidoAViaDesenhada`). Cada vez que uma pergunta se
> partiu em duas, a trava da contagem acusou no mesmo segundo. **E a guarda da
> existência mudou no LAB-32:** ela lia só `porta.test.ts`, e reprovou um teste novo
> por ele morar noutro arquivo — a regra é *"todo campo tem quem o desminta"*, não
> *"todos os desmentidos num arquivo"*. Agora ela varre a pasta de testes.

---

## 2 · O campo descoberto era o que guardava a mentira (D109)

O Laboratório de Parcelamento declarava `respeitaAcesso: false`. Movendo o ponto
de acesso entre os dois vértices mais distantes do anel — mover pouco não
distingue *"não lê"* de *"lê e mudou pouco"*:

| gleba | acesso movido | Generate ortogonal | Generate espinha | Parcelamento | Symbios |
|---|---:|---|---|---|---|
| `ensaio-47ha` | 992,6 m | 966 → 978 | 724 → 721 | **703 → 603** | 214 → 214 |
| `geo-antonina` | 2 255,3 m | **1 723 → 1 390** | 1 513 → 1 782 | 1 454 → 1 393 | 1 014 → 1 014 |
| `sintetico-10ha-plano` | 504,5 m | 175 → 174 | 123 → 123 | **112 → 138** | 66 → 66 |

A ida deste adaptador **passa o acesso** ao motor (`Terreno.acesso`, `ida.ts`,
desde o LAB-07) e o motor parte dali. **A declaração era do Lab, não do motor.**

O Symbios continua `false`, e agora **provado**: geometria byte a byte idêntica
nas três glebas. Ele não recebe ponto de acesso, e a ida já declarava a perda.

**O argumento inteiro da porta, numa linha:** dos quinze campos, o único com
declaração falsa era um dos três sem experimento. Não é coincidência — **campo sem
experimento é campo que ninguém conferiu.**

**E um achado de tamanho**, que a tabela comparativa não mede: mover o acesso mexe
no resultado **mais que qualquer outra entrada que o Lab mede** — 19 % de
diferença em lotes na candidata ortogonal, em `geo-antonina`. As glebas da tabela
declaram **um** acesso e ninguém mediu a sensibilidade a ele. **Proposto ao chat.**

---

## 3 · Duas terras, e a versão envelhecendo numa delas

`versao` também não tinha experimento, e tinha **duas respostas**: `"T02"` na porta
e `"T00-A"` na esteira. Agora há **um lugar só** para cada motor, e o experimento
exige que a versão declarada seja a que a SAÍDA carrega (o sufixo do partido é
permitido, de propósito — é o que impede a opção de virar anônima na mesa).

**O achado mais fundo, e ele passa do escopo deste prompt:** as duas eram **rótulo
de prompt do Lab, não versão do motor**. O motor publica a própria, em
`contrato/tipos.ts` — `MOTOR_VERSAO = "1.0"` e
`MOTOR_NOME = "laboratorio-de-parcelamento"` —, e a ponte do Lab escreve
`"motor-testfit"` na SAÍDA. É a **mesma forma do D104**, um nível acima: o Lab
inventando onde o motor publica. **Ler de lá é a correção de raiz, e está proposta
ao chat**, porque muda a identidade que viaja no contrato — e isso alcança provas
congeladas e o rótulo que o Generate mostra na mesa.

---

## 4 · O pior achado, e ele não é sobre capacidade nenhuma (D110)

**A suíte do pacote `testfit` estava vermelha, 14 de 14, há duas semanas.** Todo
relatório meu dizia *"testes verdes"* — rodando **só** o pacote `esteira`.

**A causa, medida antes de atribuir:** as glebas-padrão que aquela suíte carrega
vêm do repositório do Generate, e elas **viraram v2** quando ele publicou o
contrato v2 (commit `5b70e5f`, *"as três coisas que o Laboratório pediu"*). O
`ida.ts` do adaptador gateava `versao !== "1"` e passou a **recusar a própria
fixture**.

**Não é defeito do vizinho.** É o **gêmeo exato do D87**: o LAB-18 alargou este
mesmo portão em `esteira/src/gleba-v1.ts` e **não alargou o do `testfit`**.

**E a parte que dói:** dois dos 14 vermelhos eram **as travas das minhas próprias
correções**.

| teste | o que ele exigia | o que era |
|---|---|---|
| *"o CRS da saída é o mesmo da entrada"* | `saida.archilly.versao === "1"` | o LAB-22 passou a escrever **v2** |
| *"nada é inventado: faceDeRua e rampa saem nulos"* | os dois `null` | eram o **D98** e o **D104** |

**Se a suíte estivesse rodando, ela teria mordido nas duas ocasiões.** A suíte
invisível silenciou os próprios alarmes — e eu passei três semanas atribuindo ao
motor do vizinho uma falta que um teste meu, parado, já sabia apontar.

**Consertado em três partes:** o portão alargado para `["2","1"]`; os **três testes
virados, não apagados** (D90), com a história no cabeçalho de cada um — o *"nada é
inventado"* continua valendo e passou a medir a coisa certa, que o que a ponte
publica venha do motor; e **`external-engines/conferir.sh`**, que roda `typecheck`,
`lint` e `test` dos **dois** pacotes e falha se qualquer um falhar. O `CLAUDE.md`
§7 passa a dizer que *"testes verdes"* é este comando.

**O `@/*` faltava aqui também** (gêmeo do D86): o `tsconfig.json` do `testfit` não
espelhava o alias interno do Generate. **Três coisas alargadas numa terra e não na
outra, no mesmo prompt** — e a lição é a mesma das quatro vezes da §6: o que existe
em dois lugares envelhece em um deles.

---

## 5 · O que o LAB-26 NÃO fez

- **Não mediu a sensibilidade ao acesso na tabela comparativa.** O achado do §2
  pede isso, e é prompt novo — **proposto ao chat**.
- **Não mudou a identidade que viaja no contrato** (`motor.nome`, `motor.versao`
  lidos do próprio motor). **Proposto ao chat**, com a razão no §3.
- **Não varreu a declaração do que o motor sabe e o contrato não pergunta.** É o
  limite que o `porta.ts` já declara: capacidade que nenhum campo expõe continua
  invisível, e nenhuma varredura de campos a alcança.

---

## 6 · Conferência

- **`./external-engines/conferir.sh` verde nos dois pacotes**: `esteira` com **233
  testes** (6 novos) e `testfit` com **14** — **247 no total** —, `typecheck` e
  `lint` limpos em ambos. É a primeira vez que esta linha do relatório é verdade
  por inteiro.
- **Clones vizinhos limpos:** `git status` em `motor-testfit`,
  `urban-create-hub-41d93a4d` e `urban-scout-tool` — **sem nenhuma alteração**.
- **A página do Jonny não foi regerada:** a tabela do LAB-19 não usa a porta, e
  nenhum número dela muda com este prompt.
- **Mesclado por PR**; este despertador acordou **com** os conectores do GitHub.
- **Decisões:** D108 (a frase virou registro conferido), D109 (`respeitaAcesso`
  era falso), D110 (a segunda suíte vermelha, e o que "testes verdes" passa a
  significar).
