# LAB-40 · As fixtures que exercem as promessas — e a testada fora de Antonina

**04/10/2026 · `docs/fixtures/glebas-que-exercem-as-promessas/` · provas em
[`../provas/LAB-40/fixtures.json`](../provas/LAB-40/fixtures.json)**

O chat mandou: *"fixtures que exerçam as quatro promessas do LAB-35 e a testada de
frente fora de Antonina; sem isso tudo que você mediu vale para uma gleba só."*

---

## 1 · Por que entrada em memória não bastava, e isso não é formalidade

O LAB-35 achou **quatro promessas do inventário da ida que gleba nenhuma exercitava** e
as provou com entrada montada **dentro do teste**. O LAB-37 pagou a dívida da testada de
frente e mediu nas **duas únicas glebas que a têm, as duas de Antonina** — mesma face (a
0), mesmo comprimento (180 m), linha **sobre** a divisa.

> Entrada montada no teste exercita o caminho **naquele teste**. Quem roda a esteira
> inteira — a tabela, o acesso, as duas guardas das pontes — continua sem passar por ele.

**E a prova de que isso importa veio em quinze minutos de trabalho**, antes de qualquer
medição: ver §3.

---

## 2 · As duas fixtures, e por que duas

As duas nascem de `ensaio-47ha` — retângulo de **800 × 587,5 m**, 47 ha, quatro vértices
— trocando **uma coisa de cada vez** sobre a mesma base (D149). Retângulo de propósito:
as faces do perímetro têm índice e comprimento que se conferem de cabeça, e **face** é o
que a testada de frente endereça.

| fixture | o que exerce |
|---|---|
| `ensaio-com-promessas` | furo da gleba, `calcada_m`, atração **poligonal**, acesso como **segmento** |
| `ensaio-com-testada` | a **testada de frente**, sozinha |

**Separadas porque a segunda é MEDIÇÃO e a primeira é EXERCÍCIO.** O furo tira área e o
ímã puxa o traçado; medir *"o que a testada rende"* numa gleba com ímã responderia outra
pergunta. Para a promessa o que importa é o campo **chegar**; para a testada, o
**número**.

Três detalhes do método que o D149 registra, porque a próxima fixture vai imitá-los: o
**acesso como segmento tem o meio no ponto que a base declarava** (troca a forma, não o
lugar); a **procedência mora no arquivo**, em `archilly.origem`, não num `LEIA-ME` ao
lado (D104); e a **área declarada é a de verdade** — 460 000 m², não 470 000, porque o
furo de 100 m vale 10 000 m² e o adaptador do Symbios avisa acima de 2 % de divergência:
os 10 000 são **2,1 %**, e declarar a área do anel passaria **raspando** do avisador.

---

## 3 · O primeiro achado veio antes da primeira medição (D147)

A fixture nova fez a guarda da ida **reprovar**:

```
ensaio-com-promessas · parcelamento · REPROVAM:
  acessos[].segmento.a : campo-novo-no-contrato
  acessos[].segmento.b : campo-novo-no-contrato
```

`acessos[].segmento` estava declarado desde o LAB-30; **as pontas dele, não**. A guarda
tem a regra exata para isso — a que pegaria a v2 — e ela **nunca falou**:

> **Campo que gleba nenhuma traz não existe para a guarda.** A regra varre os caminhos
> que o contrato trouxe; sem gleba que declare acesso como segmento, não há
> `segmento.a` para achar sem destino.

Ficou cega por cinco prompts. É a tese do prompt provada pelo próprio prompt, e a razão
de `cobreFilhos` não servir aqui: irmão não declarado é o que a regra existe para pegar.

---

## 4 · O número que sobrevive ao prompt: 6 → 0

Os quatro campos do LAB-35 eram a lista **daquele dia**. A conta que vale amanhã sai dos
**inventários**, não dos achados:

| | antes | depois |
|---|---|---|
| promessas (`entregue` ou `traduzido`) nos dois inventários | **60** | 60 |
| promessas que **gleba nenhuma** exercita | **6** | **0** |

Os seis: as quatro do LAB-35 mais as duas pontas do segmento, que só existiram como
promessa depois do D147. **E há trava** — `promessas.test.ts` varre as dez glebas do
repositório e reprova nas duas direções: promessa nova sem fixture que a exerça, e
fixture mutilada que deixe de exercer uma. Custo: **51 ms**, porque auditar a ida monta a
entrada do motor e não roda o motor.

---

## 5 · A testada de frente fora de Antonina

A fixture muda as três coisas que podiam estar carregando o resultado:

| | Antonina | `ensaio-com-testada` |
|---|---|---|
| face entregue | **0** | **1** |
| comprimento | 180 m | **587,5 m** |
| a linha | **sobre** a divisa | **0,5 m fora** dela |

**A classificação e a cobertura passam nas duas réguas declaradas**, e sem empatar com
nenhuma: a linha a meio metro entra como **testada** (tolerância de 1 m, pela mediana das
amostras — a lição do D75) e cobre a **face 1 a 100 %**. As faces vizinhas tocam a linha
no canto a **0 %** e ficam fora — em Antonina esse toque era de 3 %, e é por isso que a
fração mínima da face é parâmetro declarado. `facesLoteamento = [1]`.

---

## 6 · E aqui a §6 pegou a décima primeira vez (D148)

Eu tinha a frase pronta: *"aqui a entrega não custa lote — 599 para 640, mais 41; a
inversão de Antonina é daquela gleba"*. Escrita como **teste**, com o conjunto de
variantes reduzido, a mesma pergunta deu o **contrário**. Então medi as três:

| amostragem | sem as faces | com as faces | na testada |
|---|---|---|---|
| 2 variantes · espinha | 680 | **640 (−40)** | 0 → **51** |
| 2 variantes · ortogonal | 441 | **437 (−4)** | 2 → **50** |
| completo, 20 aceitas | 599 | **640 (+41)** | 0 → **51** |

**Estável é a FRENTE, não o total.** E a causa não é o motor: *"espinha, posição 1"*
**não é a mesma variante** num conjunto de 2 e num de 20 — **680 contra 599 na mesma
gleba, sem as faces**. O rótulo bate, a geometria não.

> **Posição no ranking é RÓTULO. Rótulo não é identidade.**

A minha própria verificação tinha o defeito: eu havia escrito um campo `mesmoPartido`
comparando **formato + posição** — régua afirmando identidade onde só viu etiqueta. Hoje
chama `mesmoRotuloDeVariante` e diz o que vê. É a sexta vez que o ponto cego é pego
**dentro** do prompt (D128, D133, D135, D137, D142, esta).

**O que publico, então:** a frente nas três amostragens, os três deltas, e a frase
honesta — *fixada a amostragem, a frente troca lote de dentro por lote de frente; entre
amostragens, o total não é comparável*. **O que não publico:** que Antonina é caso
isolado. Para isso faltaria medir a mesma coisa lá, e não foi medido — e o item 7 do
Jonny recebeu exatamente esta ressalva, escrita para leigo.

---

## 7 · Entrega

| o quê | onde |
|---|---|
| as duas fixtures | `docs/fixtures/glebas-que-exercem-as-promessas/` |
| a ferramenta (`bun run lab40`) | `external-engines/esteira/ferramentas/lab40.ts` |
| a prova: 60 promessas, 6 → 0, e as três amostragens | [`../provas/LAB-40/fixtures.json`](../provas/LAB-40/fixtures.json) |
| os dois irmãos do segmento, declarados | `esteira/src/inventario-das-idas.ts` |
| as travas: promessas por fixture + a varredura das dez glebas | `esteira/tests/promessas.test.ts` (9) |
| a testada fora de Antonina | `esteira/tests/testada-de-frente.test.ts` (+3) |
| a trava da ida com as glebas novas, e o nome corrigido | `esteira/tests/guarda-da-ida.test.ts` |
| decisões | **D147**, **D148**, **D149** · `CLAUDE.md` §6 agora tem **onze** linhas |

**Verde:** `./external-engines/conferir.sh` — 7 passos, **385 testes** (eram 377), exit 0.

**Os clones vizinhos ficaram limpos** — `git status --porcelain` vazio nos três, como
manda o §4.

**A página do Jonny não mudou**, e isso é medição e não suposição: as duas fixtures são
glebas **novas**, fora do conjunto da tabela comparativa, e o detector de página velha
passou. Pôr as duas na tabela é escopo novo — está *"proposto ao chat"*.
