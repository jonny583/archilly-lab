# LAB-66 · A dívida própria com o que sobrou — e o que sobrou era o §1

**08/10/2026** · fila de 08/10/2026, item final · `claude/stoic-ritchie-ijzqy3`

**O pedido:** o chat escreveu a regra do **bloco único** e mandou *"siga a fila: LAB-63, depois o
LAB-64 somado, depois o LAB-66"*. A dívida que sobrou era da minha própria entrega.

---

## 1 · A resposta, em quatro linhas

| | |
|---|---|
| **o que sobrou** | eu tinha implementado a regra do chat **ao contrário** — recado por último, listas acima |
| **a origem errada** | a **D214** nasceu dizendo que a leitura errada foi só minha; o chat corrigiu: *"a palavra ambígua foi minha"* |
| **o que se perdeu** | o recado do PR #85 **foi ao chat e não foi ao arquivo** — a §1-B acontecendo com o prompt que consertava a §1 |
| **o que a trava nova acusou** | o **precedente**: LAB-13 e LAB-14 têm **um recado para os dois**, e a régua casava o nome exato (D217) |

**Sabotagens: quatro, nenhuma passou** — e em duas delas ferramenta e trava **não** pegaram a
mesma coisa, o que fica dito em vez de escondido.

---

## 2 · A regra do chat, e o que ela desfaz do meu conserto anterior

> *"Tudo que ele precisa copiar sai dentro de um único bloco de código — o recado primeiro, nas
> suas doze linhas, e logo abaixo, no MESMO bloco, qualquer lista, texto para colar em outro lugar
> ou pedido a outro repositório, separado por uma linha de marca. Nunca dois blocos, nunca um texto
> na conversa acima do bloco."*

E a parte que corrige o que eu tinha feito:

> *"O limite de doze linhas é do RECADO e não do bloco: o bloco pode ser longo, e **partir o bloco
> para caber nas doze linhas é o defeito, não o conserto** — o custo dele é o número de cópias, não
> o tamanho do texto."*

**Eu tinha posto o recado por ÚLTIMO.** Está invertido: o recado abre, a linha
`--- O QUE VAI JUNTO ---` separa, e o resto vem abaixo. Quem lê de cima para baixo no celular
encontra o **estado** antes da lista, que é o ponto do §1 desde o começo (D215).

**E o ACUMULADO:** rodando mais de um prompt sem ele voltar, o bloco abre com
`ACUMULADO — inclui os recados X, Y e Z`. **O recado completo de cada prompt continua indo inteiro
para o arquivo** — *o acumulado é a forma de entregar, nunca a de registrar.*

---

## 3 · A correção da origem da D214, pedida por escrito

> *"Houve mal-entendido e a palavra ambígua foi minha — quando o Jonny pediu para 'unificar', ele
> falava dos BLOCOS que ele copia da tela, não de itens da fila."*

A D214 nasceu dizendo que a leitura errada foi só minha. **Não foi:** a palavra ambígua veio do
chat; eu escolhi a leitura errada dela **duas vezes**, e o sinal que eu ignorei continua sendo meu.
*Decisão com origem errada ensina a lição errada a quem a reler* — por isso a correção vem **dentro
da própria D214**, e não num item novo.

**E a soma do LAB-65 dentro do LAB-64 FICA**, ratificada: *"a razão é boa, são a mesma varredura, e
você acertou em riscar em vez de renumerar."*

---

## 4 · O recado que se perdeu (D216)

No dia em que a regra do bloco único foi escrita (PR #85), **o recado dela foi ao chat e não foi ao
`RECADOS.md`**. É literalmente a §1-B acontecendo com o prompt que consertava a §1.

Recuperado no mesmo dia, **sem reescrever o texto**, e **marcado como recuperado**.

**A trava nova:** todo relatório `docs/relatorios/LAB-xx.md` tem recado no arquivo citando aquele
prompt. **E o buraco dela fica declarado e medido**, porque esconder buraco de guarda é pior que não
ter guarda:

```
blocos no acumulado ................. 69   (69 abrem com o recado)
cabeçalhos .......................... 69   (1 composto: "LAB-13 e LAB-14")
relatórios de prompt ................ 57   (0 sem recado)
recados sem prompt nomeado .......... 9    ← o buraco: rodada sem relatório
```

**Rodada sem relatório — como a própria regra do bloco, que não é prompt de fila — não tem âncora
para a trava morder.** Para essas, o que resta é disciplina: *o recado vai ao arquivo no mesmo
commit em que vai ao chat.*

---

## 5 · E a trava nova acusou o PRECEDENTE (D217)

A primeira versão dela casava `— Lab · LAB-13 ===` **exato**, e acusou LAB-13 e LAB-14 de não terem
recado.

**Têm.** Têm **um recado só para os dois**, de 19/09/2026:
`=== RECADO PARA O CHAT — Lab · LAB-13 e LAB-14 ===`.

> **Régua que casa por nome exato mede ortografia, não conteúdo** (D137) — e desta vez o acusado era
> o **precedente** da forma que o chat acabou de escrever. **A prática inventou o ACUMULADO três
> semanas antes da regra**, em outra forma.

É a **décima sétima** ocorrência do ponto cego do §6, e a **oitava** da sub-família da régua que
varre texto. Pega dentro do prompt, pela própria trava. A §6 foi atualizada: **17 linhas, 17
declarado, 8 + 4 + 2 + 2 + 1 = 17**, e a guarda do LAB-63 confere a soma.

**O `RECADOS.md` NÃO foi reescrito** para a forma nova: ele é registro do que foi enviado, e
*registro não se maquia para caber em régua nova.*

---

## 6 · A sabotagem

| # | o que foi sabotado | ferramenta | travas |
|---|---|---|---|
| 1 | um bloco com a lista ACIMA do recado | `exit 1` | 1 de 8 cai |
| 2 | o recado de um prompt some do arquivo | `exit 1` | **0 de 8** |
| 3 | o cabeçalho composto perde um dos dois prompts | `exit 1` | 2 de 8 caem |
| 4 | bloco `ACUMULADO` sem nomear quais | **`exit 0`** | 1 de 8 cai |

**Em duas delas ferramenta e trava não pegaram a mesma coisa** — a nº 2 só a ferramenta, a nº 4 só a
trava. Os escopos são diferentes **de propósito**: a ferramenta varre o acumulado inteiro, a trava
confere a forma. *Dizer isso vale mais que fingir que as duas cobrem tudo.*

---

## 7 · O que NÃO foi feito

- **o `RECADOS.md` não foi reescrito** para a forma nova (§5);
- **nada foi escrito em repositório vizinho** (§4);
- **a fila não foi renumerada**: LAB-64 segue riscado como somado ao que o chat ratificou, e o
  LAB-65 dentro dele.

## 8 · Os clones vizinhos ficaram limpos

`git status` nos três: **0 alterações** em `urban-scout-tool`, `urban-create-hub-41d93a4d` e
`motor-testfit`. Nenhum foi tocado neste prompt.
