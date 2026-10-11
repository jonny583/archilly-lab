# LAB-91 · A trava que REGERA a varredura — e as duas espécies de prova

**Prompt:** item **024** da caixa de entrada, **com o adendo**. · **Rodada:** despertador das 07:06
de 11/10/2026 — o primeiro do intervalo novo, de **8 h**. · **Conferido aqui, não no GitHub** (§7).

---

## 1 · A proposta era minha, e estava aberta desde 07/10

> *"A trava que existe hoje confere a prova **contra si mesma**; ela não **regera** a varredura."*

O número que a fundamentou, medido no LAB-60 sobre o commit `4249027`:
`conferencia-desligada-por-arquivo` dizia **1** na prova commitada e **10** na mesma árvore, **com
o verde verde.**

### O que o LAB-86 já tinha feito, e o que FALTAVA

O D287 pôs a recontagem do **ESCOPO** — quantos arquivos, quantas linhas. **O defeito do LAB-60
não estava no escopo.**

> **Recontar o tamanho do universo não reconta o que a régua achou nele.**

Agora a trava **reexecuta** as duas varreduras — **configuração** e **chamadas** — chamando a
**mesma função** da ferramenta (D231), e compara **regra por regra e achado por achado**, cada
desacordo nomeando a regra e o arquivo. **Hoje as duas batem**, e isso é o verdadeiro conteúdo da
prova: *o número só vale porque foi reexecutado agora.*

---

## 2 · A pergunta de projeto, respondida por medição (D299)

O item pediu *quais provas podem ser regeradas sem ferir o D182* e autorizou a forma: *"a lista
escrita à mão é a resposta… o que não serve é a trava adivinhar."*

| espécie | regera? | por quê |
|---|---|---|
| **fotografia de um estado passado** | **nunca** | é o defeito que o D182 nasceu para impedir: o *"antes"* de uma aferição só vale no instante em que foi tirado |
| **função pura da árvore de AGORA** | **sempre** | *prova que não bate com a árvore de hoje não é prova, é lembrança* |

**Sete entradas com motivo por linha:** **3** função-da-árvore (LAB-57, LAB-52, LAB-04) e **4**
fotografia (LAB-48, LAB-02, LAB-31/sabotagem e LAB-60 — esta porque mede o **clone vizinho**, e
*recontar o que depende de fora é outra medição com o nome da antiga*, D288). A trava cobra a
lista **fechada nos dois sentidos**.

### E a régua pegou o código que eu acabara de escrever

A primeira versão da trava tinha um `try { … } catch { }` para pular o `LEIA-ME.md`, e **a
varredura de chamadas que esta rodada regera acusou a linha na hora** — `catch-que-engole`, neste
arquivo.

> **A resposta certa não era regerar a prova: era não engolir erro.** O item avisou com estas
> palavras — *"não regere a prova de ninguém para fazer a trava passar"*.

---

## 3 · Dois enganos meus de CONTAGEM, pegos pelas minhas travas (D301)

**O primeiro:** executada a proposta, baixei **duas** contagens de 14 para 13 por reflexo — e a
trava acusou. Elas não são a mesma coisa: uma conta **itens abertos** da lista, a outra conta
**etiquetas de condição** da `FILA.md`. **Nenhuma das duas mudou.**

> **Dois números com o mesmo valor não são o mesmo número** — *valor igual é a forma mais
> convincente de dois nomes diferentes.*

**O segundo é o achado:** a proposta morava em **dois lugares** — um item da lista e uma **seção de
prosa**. O item foi **riscado no LAB-86** como *"executada"*, e o que o LAB-86 fez foi recontar o
escopo. **A seção de prosa continuou aberta, e era ela que estava certa.**

> **A mesma proposta em dois lugares, e os dois discordaram: quem tinha razão era o que ninguém
> riscou.** *Riscar "executada" sobre metade do pedido fecha a porta com o trabalho dentro.*

O riscado foi **corrigido com a medição ao lado**, não desfeito — a parte do escopo **foi** feita
no LAB-86, e agora o item diz o que faltava e onde está a outra metade.

---

## 4 · O adendo (1): o conjunto do `interpolador` fica FECHADO (D298)

Medido **na origem** dos dois vizinhos, nunca no clone:

| onde | o que a origem diz |
|---|---|
| `motor-testfit`, `formato-publicado.ts:142` | `interpolador: "bilinear" \| "idw"` |
| Generate, `indicadores-terreno.ts:146` | `"idw" \| "linear" \| "natural" \| "krigagem" \| "nenhum"` |
| Generate: quem **atribui** literal a `interpolador` | **ninguém** |
| Generate: `bilinear` em `.ts` | **zero** |

**Em comum: só `"idw"`** — a medição do Generate, conferida aqui. *E a primeira leitura, num clone
em `72cfab0` com a origem em `8b7c157`, deu o contrário: `krigagem` dava zero e eu quase publiquei
"o Generate não enumera nada disso". **Terceira vez na mesma noite** (D295).*

> **O conjunto fica FECHADO em `"bilinear" | "idw"`: os dois que a família PRODUZ e que eu MEDI.**

1. **`"bilinear"` fica, e NÃO é apelido de `"idw"`** — D37: o de k vizinhos *"faz o bolo de
   casamento"* e o de produção não; **apelidar apagaria a única informação que o campo carrega**;
2. **`"nenhum"` é recusado:** ausência já tem forma, **`null`** (D19/D23) — aceitá-lo criaria duas
   formas de dizer a mesma coisa (D116);
3. **`"linear"`, `"natural"`, `"krigagem"`** entram quando alguém os **implementar e medir**; hoje
   são **tipo sem produtor**;
4. **não morde hoje** — sem produtor de literal, nenhum valor atravessa. *É o GF-09 do Generate, e
   o dia da divergência não chegou: é isso que dá tempo de decidir em vez de inventar.*

**O pedido ao Generate vai em lista, nunca em commit lá** (§4): **estreitar o `Interpolador` para o
que ele produz**, ou declarar os cinco como aspiracionais **no próprio tipo**. Ao Parcelamento,
**nada**.

---

## 5 · O adendo (2): o `detalhe` medido, e o aviso não morde aqui (D300)

**Varrido todo `.ts` da esteira e do testfit: nenhum lugar extrai número de `detalhe`.** O único
que o toca é `ferramentas/lab48.ts:210` — `detalhe: v.detalhe ?? null` —, que **copia a frase para
dentro de uma prova**, e *copiar não é extrair*.

**Não virou proposta na `FILA.md`**, de propósito: *proposta para consertar o que a medição diz que
não existe é lista que envelhece sozinha.* E o achado que vem junto é a regra desta casa voltando
pela porta da frente: **o limite tem de viajar dentro do payload** — agora ele viaja.

---

## 6 · Entrega

- **prova:** [`docs/provas/LAB-91/a-varredura-regerada.json`](../provas/LAB-91/a-varredura-regerada.json)
  — as duas varreduras regeradas, as sete entradas das duas espécies, a lista fechando e o
  conjunto do interpolador com o motivo de cada recusado. Na **lista de exceções do §7**;
- **decisões:** **D298** (o conjunto do interpolador), **D299** (a trava que regera e as duas
  espécies), **D300** (o `detalhe` medido) e **D301** (os dois números e o riscado precoce);
- **o portão sem clones:** 37 → **38 arquivos**, 604 → **621 travas**;
- **a fila:** a proposta do LAB-60 está **executada**, e **nenhuma nasceu no lugar dela** — o aviso
  do `detalhe` foi medido e não virou item. A contagem de abertos **continua 14**, pelo D301;
- **nada escrito em repositório vizinho.** Leitura na **origem** de dois deles para o adendo; os
  **seis** clones terminaram limpos;
- **o gatilho do CI NÃO foi religado**, **a D226 não foi tocada** e o sétimo mecanismo também não;
- **o despertador mudou de intervalo** — *"fila autônoma (8 h · prioritária)"* —, e isso está
  anotado **na conta**, não tocado: *ligar, desligar e reagendar é do chat; o meu trabalho é a
  conta* (item 004);
- **verde:** o comando único, **conferido aqui, não no GitHub**.
