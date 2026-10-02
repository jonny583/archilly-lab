# LAB-20 — a comparação numa página, para quem não programa

**Data:** 02/10/2026 · **Página:** [`docs/COMPARACAO_DOS_MOTORES.md`](../COMPARACAO_DOS_MOTORES.md)
**Gerador:** `external-engines/esteira/ferramentas/lab20.ts` (`bun run lab20`)
**Entrada:** [`docs/provas/LAB-19/tabela.json`](../provas/LAB-19/tabela.json)
**Testes:** `external-engines/esteira/tests/pagina.test.ts` — 8 · a esteira inteira, **154 verdes**

---

## Em uma frase

**Tudo o que o laboratório mediu em dez prompts passou a caber numa página que o
Jonny abre num clique** — e há teste que a regera e **reprova se ela estiver
desatualizada**, porque tabela copiada à mão envelhece em silêncio.

---

## 1 · O problema, dito sem rodeio

A esteira só falava por linha de comando. Cinco glebas, quatro motores, dez
prompts de medição — e nada disso aparecia para quem não abrisse um terminal e
rodasse um `bun`. **O Jonny é arquiteto e urbanista, não programador, e o que ele
não consegue abrir, para ele não existe.**

---

## 2 · A página é MARKDOWN, e isso foi medida, não gosto

O prompt pedia *"uma página de tabela gerada em `docs/`"*. A escolha óbvia seria
HTML. **Ela estaria errada**, e a razão é do GitHub:

| formato | o que o Jonny vê ao clicar no link | precisa de quê |
|---|---|---|
| **Markdown** | **a página montada** — tabelas, negrito, títulos | **nada** |
| HTML | o **código-fonte**: `<table>`, `<td>`, `<tr>` | GitHub Pages ligado |

Uma página `.html` no repositório daria a ele uma tela de marcação — **o contrário
de "olhar sem abrir terminal"**. E Markdown é o meio que ele **já usa**:
`PENDENCIAS_JONNY.md` é lido assim, por link, desde 14/09.

**Servir HTML de verdade exigiria ligar o GitHub Pages**, que é configuração de
repositório. Está **proposto ao chat** na `FILA.md` — não ligado por minha conta
(**D81**).

---

## 3 · A página é GERADA, e há teste que a prende à medição

`tests/pagina.test.ts` **regera a página do zero** e reprova se o arquivo do
repositório estiver diferente. Então ou ela está em dia, ou a esteira fica
vermelha — e vermelho alguém vê.

É o mesmo remédio do teste do RECADO (LF-FINAL-2), e pela mesma razão: **sete de
oito recados passaram do teto enquanto a regra era só um texto**. O que não é
medido volta a acontecer (**D82**).

Os outros sete testes fixam o que a página não pode perder: os **cinco
terrenos**, os **quatro motores em cada quadro**, os **dois limiares da régua de
forma**, o aviso de que ela **não aprova nada**, a semente e o arquivo de provas.
E dois que são regra de casa: **"Testfit" não aparece** — é nome interno
(CLAUDE.md §5) — e **a página não recomenda motor**.

---

## 4 · O que a página traz, e por que nessa ordem

1. **como ler os quadros** — uma linha por coluna, em palavra de pessoa: *"terra
   dentro da área loteável que não virou lote nem rua. É prejuízo"*;
2. **a régua de forma**, explicada pelo retângulo em volta do lote, com os dois
   limiares e **o aviso de que ela não aprova nem reprova** (D80);
3. **cinco quadros**, um por terreno, com os quatro motores lado a lado;
4. **o que cada motor não soube fazer**;
5. **o que esta página NÃO diz**;
6. **de onde vêm os números** — semente, versão do contrato, arquivo de provas, e
   o comando para refazer.

A seção 4 vem **antes** da 5 de propósito: a ressalva tem de ser lida junto com o
quadro, não depois da conclusão.

---

## 5 · O defeito que apareceu na primeira versão da página

A seção *"o que cada motor não soube fazer"* saiu **ilegível**. O Laboratório de
Parcelamento tinha dez linhas, e cinco delas eram a mesma queixa com números
diferentes:

```
- 1 de 20 variantes foram recusadas pelo esquema e ficaram fora do ranking
- 13 de 20 variantes foram recusadas pelo esquema e ficaram fora do ranking
- 2 de 20 variantes foram recusadas pelo esquema e ficaram fora do ranking
- o Lab aparou 237.1 m de eixo que saía da gleba (0.65 % do comprimento)
- o Lab aparou 505.5 m de eixo que saía da gleba (0.32 % do comprimento)
```

**Uma lista que o leitor desiste de ler não informa nada** — e esta é a página de
quem não programa. O conserto: queixas que são a mesma coisa com números
diferentes viram **uma linha**, com os números trocados por reticências e **em
quantos dos cinco terrenos** ela apareceu.

**O que o conserto NÃO faz:** reescrever a frase do motor. As palavras continuam
as dele, e a página diz isso — *"as frases são do próprio motor, não minhas"*.
Melhorar a redação de outro motor seria pôr palavra na boca dele (**D83**).

**E um defeito dentro do conserto, pego em seguida:** tirar os números comeu
`D51` e `LAB-08`, que são **identificadores**, não medidas — e são o único
ponteiro que a frase dá para o relatório técnico. A régua passou a poupar o
número que vem depois de letra, dígito ou hífen. Há teste que fixa os dois lados.

---

## 6 · O que a página NÃO é

**Não é recomendação de produto.** O LAB-13 foi explícito, e a página repete a
razão em voz de pessoa: *"o motor que faz mais lotes é o que deixa mais terra sem
lote; o que deixa menos sobra é o que o conferente mais aponta. Quem escolhe é
você."*

**Não é interface.** O CLAUDE.md §4 diz que este repositório **não tem
interface**, e isto não é uma: é um arquivo de texto gerado por medição, no
`docs/`, como todos os outros. Não há servidor, não há botão, não há estado.

---

## 7 · Os vizinhos ficaram limpos

`git status` nos três clones de leitura ao fim da rodada:
`urban-create-hub-41d93a4d`, `motor-testfit` e `urban-scout-tool` — **nenhuma
alteração**.

---

## 8 · O LAB-18 segue aguardando — reavaliado neste disparo

Conferido em 02/10 às 14h, no clone de leitura do Generate: `origin/main` =
**`8223873`** (de hoje, 13h52). **O contrato v2 não saiu:** `app_nascente` tem
zero ocorrências em `src/lib/contratos/`, `tipos.ts:150` ainda é
`"via_existente" | "ponto_de_interesse" | "outra"`, e não existe `motor-v2/`.
A `main` deles andou; o contrato, não.

---

## 9 · O reforço do mesmo dia, a pedido do chat

O chat pediu, depois da entrega, que a página **nomeasse o Validator** e
deixasse claro que a coluna de forma **informa** e quem aprova é ele. A página já
dizia isso, mas em palavra de leigo — *"o conferente do Archilly Generate"* — e
**nunca usava o nome que a família usa**. Para o Jonny ler o chat e a página e
saber que falam da mesma coisa, o nome tem de aparecer.

O que mudou:

1. **a abertura** nomeia a régua: *"o conferente do Archilly Generate — o
   Validator, no nome que ele tem no código"*;
2. **a legenda da coluna** passou a dizer *"é ele que diz se a proposta passa"*;
3. **uma seção própria**, *"Esta coluna INFORMA; quem aprova é o Validator"*, com
   uma **tabela dos desencontros entre as duas réguas**.

**A tabela dos desencontros é computada, não escrita.** Ela mostra os dois
extremos — muito apontamento com forma limpa, e forma ruim com Validator quieto —
escolhidos **pela medição**: 29 apontamentos com zero lotes de forma ruim no
Laboratório de Parcelamento em terreno plano, 4 apontamentos com 87 lotes ruins
no Symbios em Antonina.

**Escrever esses três números à mão seria o defeito que a D82 combate**, e pior
que na tabela: o exemplo é justamente o que o leitor acredita. Então eles saem do
`tabela.json`, e há teste que confere que a tabela tem quatro linhas e duas
pontas.

**Um defeito corrigido junto:** a página apontava a régua de forma como *"item 2
de `PENDENCIAS_JONNY.md`"*, e com o limiar da travessia fechado (D84) ela passou a
ser **o item 1** — o único. O texto agora diz *"o item que sobrou"*, que não
quebra quando a lista muda.

---

## 10 · O que fica pronto

- `docs/COMPARACAO_DOS_MOTORES.md` — a página, 169 linhas, gerada;
- `external-engines/esteira/ferramentas/lab20.ts` — o gerador;
- `external-engines/esteira/tests/pagina.test.ts` — 8 testes;
- `bun run lab16`, `bun run lab19` e `bun run lab20` no `package.json` — as três
  ferramentas que faltavam no atalho.
