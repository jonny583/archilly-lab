# LAB-23 — a via desenhada à mão como coluna vertebral do traçado

> # ⚠ CORRIGIDO EM 03/10/2026 PELO LAB-30
>
> **A prova deste relatório era verdadeira e a conclusão era falsa.** A SAÍDA saía
> idêntica com e sem a via desenhada porque **a via nunca chegava ao motor** do
> Laboratório de Parcelamento: o campo `viaManual` existe nele desde sempre, e a ida
> do Lab não o preenchia.
>
> **Leia "os quatro ignoram" como "três dos quatro ignoram".** Medido no LAB-30:
> entregando a via, `antonina-com-via` vai de 25 para 32 vias.
>
> **E a frase mais cara deste relatório era esta:** *"o teste fica, e morde antes de
> qualquer relatório sair errado se um motor passar a respeitar a via"*. **Ele não
> mordeu** — porque lia a **prova congelada**, não o motor rodando. Teste de
> falsificação que lê prova velha não falsifica: repete. A trava foi **virada** (D90)
> e agora exige o que está medido.
>
> **O que continua valendo, inteiro:** a comparação da linha desenhada com as vias
> dos motores pela régua de rampa (§ sobre `antonina-com-via` e `ensaio-com-via`), e
> a ressalva da D103 — **quem desenhou a linha fui eu**, pela geometria da gleba.
>
> Ver **D119**, **D120** e **D121**.


**Data:** 03/10/2026 · **Semente:** 20260913
**Provas:** [`docs/provas/LAB-23/coluna-vertebral.json`](../provas/LAB-23/coluna-vertebral.json)
**Ferramenta:** `bun run lab23` · **Testes:** `tests/coluna-vertebral.test.ts` — 7

---

## Em uma frase

**Provado por diferença: os quatro motores ignoram a via desenhada — a saída é
byte a byte idêntica com e sem ela, nos oito casos.** E a pergunta nova tem
resposta **que depende da gleba**: no terreno real, a linha desenhada é **melhor
assentada que as vias dos quatro motores**; no retângulo sintético, é pior.

---

## 1 · A prova por diferença

O LAB-17 mediu que os quatro **declaram** `respeitaViaDesenhada: false`.
Declaração é promessa. Aqui é prova: a mesma gleba roda **com e sem** a via
desenhada no arquivo, e a SAÍDA é comparada **byte a byte**.

| gleba | ortogonal | espinha | Parcelamento | Symbios |
|---|---|---|---|---|
| `ensaio-com-via` | **idêntica** | **idêntica** | **idêntica** | **idêntica** |
| `antonina-com-via` | **idêntica** | **idêntica** | **idêntica** | **idêntica** |

**Oito de oito.** A declaração dos quatro é honesta, e agora está provada da
única forma que não depende de ninguém ser sincero.

**O teste fica**, e é o que importa para o futuro: se algum dia um motor passar a
respeitar a via, **este teste morde primeiro**, antes de qualquer relatório sair
errado (**D101**).

**O controle é cirúrgico, e isso também é testado:** tirar as vias desenhadas
não tira a **testada de frente** de `antonina-com-via`. Ela não é via desenhada
(D64), e apagá-la faria a comparação medir duas coisas ao mesmo tempo.

---

## 2 · A pergunta nova: quanto valeria respeitá-la?

Só ficou possível com a régua de rampa do LAB-21. A linha desenhada está **melhor
ou pior assentada no terreno** que as vias que o motor inventa?

### `antonina-com-via` — o terreno real

| de quem é a linha | rampa média | **pior trecho** | m acima de 15 % |
|---|---:|---:|---:|
| **a linha desenhada** | 3,62 % | **12,62 %** | **0 m** |
| Generate · ortogonal | 3,00 % | 24,48 % | 454 |
| Generate · espinha | 3,57 % | 23,03 % | 1 039 |
| Laboratório de Parcelamento | 3,44 % | 17,09 % | 2 084 |
| Symbios + subdivisão do Lab | 3,27 % | 27,73 % | 5 266 |

**A linha desenhada é a única que fica inteira abaixo do limite de 15 % do
Jonny** — zero metros acima —, e o pior trecho dela é **metade** do pior trecho
do melhor dos quatro motores. **No terreno real, respeitá-la seria ganho de
obra**, não só de gosto.

### `ensaio-com-via` — o retângulo sintético

| de quem é a linha | rampa média | **pior trecho** | m acima de 15 % |
|---|---:|---:|---:|
| **a linha desenhada** | 5,85 % | **30,91 %** | **40 m** |
| Generate · ortogonal | 5,84 % | 17,56 % | 206 |
| Generate · espinha | 5,46 % | 22,90 % | 308 |
| Laboratório de Parcelamento | 5,08 % | 17,92 % | 50 |
| Symbios + subdivisão do Lab | 5,36 % | 22,76 % | 700 |

**Aqui ela perde dos quatro no pior trecho** — 30,91 % contra 17,56 a 22,90 %.
Ela atravessa o morro sintético de frente, e os motores o contornam.

**A resposta depende da gleba, e as duas pontas estão fixadas em teste**, para
que uma leitura cômoda não sobreviva à medição (**D102**).

---

## 3 · A ressalva que muda a leitura, e ela é grande

**Quem desenhou a linha fui eu, não um urbanista.**

O traçado das duas glebas de referência é **geométrico** — principal pelo meio do
lado maior da caixa, secundárias perpendiculares igualmente espaçadas — e a
**D73** registra isso de propósito: *"ele existe para ser uma imposição conhecida
contra a qual se mede aderência, não para ser um bom partido"*.

**Então a frase "a linha da mão vence no terreno real" está errada se lida como
elogio ao urbanista.** O que foi medido é mais modesto e mais útil:

> **Em `antonina-com-via`, uma linha escolhida pela geometria da gleba — sem
> olhar o relevo — ficou melhor assentada que as vias dos quatro motores.**

E isso é um resultado **sobre os motores**, não sobre a linha: se uma reta
geométrica cega bate os quatro no pior trecho, **os quatro não estão usando o
relevo para escolher por onde a rua passa** — o que a D100 já mediu de outra
forma, porque **só o Symbios desvia pelo relevo**, e mesmo ele perde aqui.

**O que falta para fechar a pergunta de verdade:** uma via desenhada **por
pessoa**, numa gleba real. É item para o Jonny ou para o chat, e está na fila
como proposto — o Lab não inventa partido urbanístico (**D103**).

---

## 4 · O que este prompt NÃO mediu, e precisa ser dito

**Se respeitar a via desenhada daria mais lote, menos sobra ou menos violação.**
Isso exige **um motor que a respeite**, e nenhum dos quatro respeita — é o
achado do §1. O que se mede aqui é o **custo de terreno** da escolha, não o
**ganho de projeto** dela.

A ressalva está dentro do JSON de provas, em `oQueNaoEstaMedido`, pelo mesmo
motivo da D97: ressalva que fica só no relatório não viaja com o número.

---

## 5 · Os vizinhos ficaram limpos

`git status` nos três clones de leitura: `urban-create-hub-41d93a4d`,
`motor-testfit` e `urban-scout-tool` — **nenhuma alteração**.

---

## 6 · O que fica pronto

- `external-engines/esteira/ferramentas/lab23.ts` — a prova por diferença e a
  comparação de assentamento;
- `docs/provas/LAB-23/coluna-vertebral.json` — os números crus, com o que **não**
  foi medido declarado dentro;
- `external-engines/esteira/tests/coluna-vertebral.test.ts` — 7 testes, incluindo
  **as duas pontas** do resultado e o controle cirúrgico.
