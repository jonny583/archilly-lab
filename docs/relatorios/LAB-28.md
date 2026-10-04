# LAB-28 · A sensibilidade ao acesso — e a manchete que a medição derrubou

**03/10/2026 · `bun run lab28` · provas em
[`../provas/LAB-28/acesso.json`](../provas/LAB-28/acesso.json) e, por motor e por
gleba, em [`../provas/LAB-19/tabela.json`](../provas/LAB-19/tabela.json)**

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

O chat mandou: *"se é a entrada de maior efeito do Lab, ela precisa estar na tabela e
na página do Jonny: meça nas cinco glebas e nos quatro motores, mostre quanto muda em
lotes e em área vendável, e escreva em uma frase o que isso significa para quem compra
terreno — porque é decisão de negócio, não de código."*

**Está medido, está nas duas, e a frase saiu diferente da que eu ia escrever.**

---

## 1 · O número, e ele é maior do que eu havia reportado

Eu havia dito ao chat **19 %**, de dois pontos escolhidos por serem os vértices mais
distantes do anel. Com **seis pontos igualmente espaçados por comprimento de arco**:

| gleba | Generate ortogonal | Generate espinha | Laboratório de Parcelamento | Symbios + Lab |
|---|---|---|---|---|
| `completo` 141,8 ha | 998–1 654 · **+65,7 %** | 860–1 791 · **+108,3 %** | 962–1 114 · +15,8 % | 932 · **0 %** |
| `geo-antonina` 141,8 ha | 1 346–1 941 · **+44,2 %** | 1 478–1 917 · +29,7 % | 1 386–1 454 · +4,9 % | 1 014 · **0 %** |
| `ensaio-47ha` 47 ha | 960–1 024 · +6,7 % | 721–745 · +3,3 % | 459–703 · **+53,2 %** | 214 · **0 %** |
| `sintetico-50ha` 50 ha | 1 041 · 0 % | 736–805 · +9,4 % | 510–596 · +16,9 % | 318 · **0 %** |
| `sintetico-10ha` 10 ha | 169–185 · +9,5 % | 123–141 · +14,6 % | 112–143 · +27,7 % | 66 · **0 %** |

**A área vendável acompanha quase exatamente** — em `completo`, a espinha vai de
30,96 a 64,67 ha (+108,9 %). Não é um lote pequeno a mais: é terra vendável.

**Dois pontos subestimam porque são dois.** "Os vértices mais distantes" é a maior
distância geométrica, que não tem nada a ver com rendimento. A correção está na D113,
e o número que eu dei ao chat **ficou pequeno**, não grande.

**O zero do Symbios é medição**, não falta dela: ele não recebe ponto de acesso, a ida
já declarava a perda, e o LAB-26 provou por diferença.

---

## 2 · A manchete que eu ia escrever, e por que ela caiu (D114)

Eu ia publicar: **"a entrada da rua pesa mais que a escolha do motor"**. Medido, é
**falsa como regra geral**:

| gleba | amplitude do acesso | entre os 3 motores de lote | o que pesa mais |
|---|---:|---:|---|
| `completo` | **+108,26 %** | +29,12 % | **a entrada** |
| `geo-antonina` | **+44,21 %** | +19,55 % | **a entrada** |
| `ensaio-47ha` | +53,16 % | +62,60 % | o programa |
| `sintetico-10ha-plano` | +27,68 % | +44,72 % | o programa |
| `sintetico-50ha-ondulado` | +16,86 % | +95,68 % | o programa |

**Duas de cinco.** E a primeira versão da conta dava **uma** de cinco, porque
comparava com a diferença entre **os quatro** motores — incluindo o Symbios, que
entrega **quadra** e cujos lotes vêm da subdivisão do Lab (D50). Isso infla a conta
até **355 %**, que não é uma escolha entre dois loteamentos: é a distância entre duas
**etapas de projeto**.

**As duas contas vão publicadas**, com a razão de cada uma. A manchete que fica é a
que **não** depende de comparação nenhuma:

> O **mesmo** programa, no **mesmo** terreno, com as **mesmas** regras, varia até
> **+108 %** em lotes só mudando por onde a rua entra.

**O ponto cego da §6 tem uma irmã.** Lá eu ia atribuir ao vizinho um defeito meu;
aqui eu ia atribuir à medição uma conclusão minha. As duas se consertam medindo antes.

---

## 3 · A frase para quem compra terreno

Está na página, em linguagem de leigo:

> **Por onde a entrada pode passar é parte do preço do terreno, e se descobre antes
> de comprar, olhando a rua que já existe do lado de fora.** Dois terrenos do mesmo
> tamanho e do mesmo preço não valem o mesmo se um só admite entrada pelo canto
> ruim: a diferença cai direto no número de lotes que se vende.

**E os três cuidados, porque sem eles a frase vira promessa** (D115):

1. **o melhor ponto pode não existir na vida real** — o Lab põe a entrada em seis
   pontos **sem perguntar se há rua ali fora**. Se o melhor cai no fundo do terreno,
   não serve; e a coluna continua útil, porque mostra **quanto se perde** por não
   poder usá-lo;
2. **a variação medida é o mínimo, não o máximo** — seis pontos não varrem o
   perímetro (D113);
3. **o Lab não escolhe a entrada.** Depende da rua de fora, da faixa de domínio e da
   licença: é decisão de projeto, e é do Jonny (CLAUDE.md §4). O Lab mede o custo.

---

## 3-A · E um defeito meu, pego ao ler a página antes de mesclar (D116)

O confronto do §2 nasceu calculado **em dois lugares** — na ferramenta e, de novo, no
gerador da página —, com referências diferentes para o rendimento de cada motor nas
glebas que não declaram acesso:

| onde | referência |
|---|---|
| `lab28.ts` | a **primeira posição amostrada** |
| a página | o número da **linha da tabela** (a gleba como veio, sem acesso) |

**`completo` saía com +29,12 % num arquivo e +70 % no outro.** Mesma gleba, mesma
pergunta, dois números — e os dois iam ser publicados, em arquivos que se leem lado a
lado.

**É o defeito que o D20 proíbe no Validator**, cometido por mim numa grandeza minha,
dois dias depois de eu escrever a guarda do LAB-25 contra a mesma família de erro. E
o que o pegou **não foi um teste**: foi ler a página gerada antes de mesclar.

**Consertado na raiz:** `referenciaDe()` e `amplitudePctDe()` moram na régua, o
`lab19` calcula o confronto **uma vez** e o grava em `tabela.json`, a página **lê**, e
o `lab28` importa as mesmas funções. A regra que fica vale além do acesso: número que
aparece em dois arquivos é **calculado uma vez e copiado**, nunca calculado duas.

## 4 · Como se mede, e o que custa

A régua é a [`acesso.ts`](../../external-engines/esteira/src/acesso.ts): o acesso vai
a **seis pontos por comprimento de arco** no perímetro, o motor roda em cada um, e
**quem conta lotes e área vendável é o Validator do Generate** — o mesmo da tabela,
nunca uma contagem minha (D20).

**Por arco, e não por vértice.** Um anel de levantamento tem os vértices amontoados
onde a divisa é recortada: `anel[i * k]` poria quase todas as amostras no mesmo canto.
É o terceiro lugar em que esse erro de forma aparece (D75, D93) e **o primeiro em que
ele entrou no teste antes de entrar na medição** — `tests/acesso.test.ts` tem um anel
com dez vértices num lado só, e exige que as amostras se espalhem.

**O acesso declarado na gleba é medido à parte** dos seis, e não se mistura: os seis
são hipóteses do Lab; o declarado é o único que alguém afirmou existir. Das cinco
glebas, duas o declaram.

**Custo:** 7 rodadas por motor por gleba (6 + o declarado), cada uma com Validator e
Judge. `ensaio-47ha` leva 4,5 s na candidata ortogonal e 13,3 s no Parcelamento. Seis
e não trinta é escolha de custo, declarada (D113).

---

## 5 · Conferência

- **`./external-engines/conferir.sh` verde nos dois pacotes** — `esteira` com **255
  testes** (22 novos: 19 da régua do acesso, 3 da página) e `testfit` com 14 —
  **269 no total** —, `typecheck` e `lint` limpos em ambos.
- **A tabela e a página foram REGERADAS** (`bun run lab19`, `bun run lab20`): a coluna
  nova está nas cinco e o teste que reprova página velha passou.
- **Clones vizinhos limpos:** `git status` em `motor-testfit`,
  `urban-create-hub-41d93a4d` e `urban-scout-tool` — **sem nenhuma alteração**.
- **Mesclado por PR**; os conectores do GitHub estavam de pé.
- **Decisões:** D113 (seis pontos, por arco, amplitude é piso), D114 (a manchete
  caiu), D115 (a coluna entra, com os três cuidados), D116 (duas réguas para a mesma
  grandeza, cometido por mim — a fórmula mora na régua, a página lê).
