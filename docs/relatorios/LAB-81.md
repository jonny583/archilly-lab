# LAB-81 · AS CINCO LEITURAS, TERMINADAS — uma casa, uma pergunta cada

**Prompt:** item 014 — a minha própria proposta do LAB-80 (D259), escolhida pelo chat com a minha
frase dentro: *"cinco respostas para a mesma pergunta não são cinco réguas: são uma régua que
ninguém terminou."* · **Rodada:** despertador das 09:06 de 10/10/2026. · **Conferido aqui, não no
GitHub** (§7).

---

## 0 · A premissa do item estava UM PASSO ATRÁS, e medir isso foi o primeiro trabalho (D269)

O item lista **três** leituras a consertar, e uma delas — `src/trava-de-estrutura.ts` — aparece
como *"`/^\s*>/` **inline**"*. **Ela não é mais isso:** o LAB-80 já a passou para
`lugaresDaPagina + afirmadoNaLinha`, e foi lá que o D266 nasceu.

O item foi escrito às 08h40, **a partir do meu relatório**, e o relatório descrevia o estado de
**antes** daquela parte da rodada. Não é erro do chat: é a forma do atraso.

> **Item escrito a partir do meu relatório herda a idade do relatório.** Antes de executar, meça a
> premissa do item contra o código — senão o primeiro trabalho da rodada é consertar o que já
> estava consertado, e isso sai como entrega.

Medido: das três, **uma estava pronta**. Sobraram **duas** — e isso é o escopo real desta rodada.

---

## 1 · TERMINAR NÃO ERA FAZER AS CINCO IGUAIS, e foi a medição que decidiu (D270)

O item pôs a fronteira com todas as letras:

> *"Se alguma das três **precisa** ser mais frouxa ou mais rígida que as outras, escreva o motivo
> ao lado dela e deixe-a de fora. **Cinco iguais por conveniência é pior que quatro iguais e uma
> declarada.**"*

**Uma precisa.** A trava do LAB-51 varre o `conferir.sh` — um **script de shell** — procurando
frases que AFIRMAM que algo não existe, e **o caminho entre crases é o DADO dela**: ela extrai o
caminho de dentro da crase e confere no disco.

| limpeza | na mentira plantada | na citação plantada |
|---|---|---|
| `semCitacoes` (a dela) | nega ✔ · acha `.github/workflows/verde.yml` ✔ | passa ✔ |
| `semRiscadoNemCitado` | nega ✔ · acha **ZERO caminhos** ✘ | passa ✔ |

A limpeza mais forte **cega a trava no caso exato para que ela foi escrita** — e o pior é que ela
*parece* mais rigorosa: nega igual, passa igual, e só o **dado** desaparece.

E a leitura de Markdown ali é um **nada**: `lugaresDaPagina` sobre aquele `.sh` devolve
**0 citação e 0 cerca em 147 linhas**.

> **Unificar é dar UM LUGAR às leituras e UMA PERGUNTA a cada uma — não dar a mesma resposta a
> perguntas diferentes.** A limpeza que remove o dado de quem a chama não é mais rigorosa: é **um
> desligamento passando por conserto**.

**É por isso que a ordem da Central importa**, e ela estava no item: *provar primeiro que cada
régua **continua achando o que achava**, e só depois que deixou de achar o que não devia.* Na ordem
inversa, eu teria visto *"a citação passa, o riscado passa, a cerca passa"* — tudo verde — e
entregado uma trava cega.

---

## 2 · A QUARTA FORMA que o item convidou não é uma forma nova: é uma marca que às vezes é o DADO

O item disse: *"Se houver uma quarta forma que você encontre medindo, **ela entra**, e o fato de
ter aparecido agora é achado."*

Encontrei — e não é uma quarta marca. É uma **propriedade** que separa a crase das outras três:

> **A cerca, o `>` e o riscado NUNCA carregam o objeto da régua. A CRASE CARREGA.** É a única marca
> de *"só mostra"* que às vezes é *"isto é o que eu vim medir"*.

Daí a família ter **seis membros com perguntas diferentes** em vez de uma função com um argumento:
a escolha entre elas não é de rigor, é de **qual é o objeto**.

---

## 3 · O buraco comum às cinco, fechado: o BLOCO DE CÓDIGO

Nenhuma das cinco o conhecia, e foi por isso que a varredura de custo acusou o `RECADOS.md` por
duas linhas que são **recado gravado** (D259). A leitura nova, `soAProsa()`, tira **citação e
bloco de código**.

Medido nas seções de **regra** da `CLAUDE.md`: **312 linhas**, 9 em citação e **20 em bloco de
código** — **17 delas na §1**, que são o **molde do recado**: exemplo, não regra sobre o recado.

**O veredito não mudou** — `limitesSemSujeito` dá `[]` antes e depois —, então a fronteira do item
(*"pare se mudar o veredito"*) não foi tocada. **E vazio não prova nada**, então a prova é plantada,
na ordem da Central:

1. a regra sem sujeito **em prosa nua** → **achada** (a régua continua achando);
2. a mesma frase **em citação** → não achada; **dentro de um bloco de código** → não achada;
3. e depois da cerca fechar, a prosa **volta a contar** — a cerca não é uma porta que fica aberta.

**`soAProsa` esvazia as linhas, não as remove:** o número da linha não pode mentir para quem for
ler o achado. *Limpeza que encurta o texto faz a régua apontar para a linha errada.*

---

## 4 · A GUARDA QUE IMPEDE A SEXTA DE NASCER (D271)

O problema do D259 não foi uma leitura errada: foi **uma leitura nova nascendo dentro de cada trava
que precisava dela**.

> **Unificar sem guarda conserta o passado e deixa o futuro exatamente igual.**

A guarda varre todo `.ts` que o git carrega e reprova se qualquer arquivo **que não seja a casa**
DEFINIR uma das leituras. Ela lê **os nomes que o código USA** (`soOsNomesUsados`), não o texto —
então `import`, chamada, re-export e **comentário que cita o nome** não contam (D257). Os dois
lados estão plantados.

E a tabela `AS_LEITURAS` — quem lê, o que responde, **e por que não a vizinha** — é conferida
**contra os `import` de verdade**, com sabotagem nos dois sentidos: instrumento que não importa o
que diz importar reprova **pelo nome dele**, e instrumento que desaparece do disco também.

---

## 5 · O que fica declarado, e não consertado

**A `verde.test.ts` fica com a leitura dela**, e o motivo mora em três lugares que não envelhecem
juntos por acaso: na tabela `AS_LEITURAS` (`porQueNaoAOutra`), no comentário da própria trava, e
numa trava que **reprova se a `semRiscadoNemCitado` passar a preservar a crase** — porque nesse dia
a UMA declarada perde o motivo e a tabela tem de ser refeita.

*Diferença declarada que ninguém reconfere é a mesma coisa que diferença esquecida.*

---

## 5-A · A convenção do D265 me pegou uma rodada depois de eu a declarar (D272)

A linha desta rodada na conta dos disparos dizia *"logo depois do disparo **em vazio**"*. A régua
lê a palavra `vazio` naquela coluna — **a convenção que eu mesma declarei no D265** — e contou a
rodada como vazia: 5 declarados contra 6 medidos.

**Duas vezes em duas rodadas, as duas minhas, as duas pegas pela trava.**

> **Convenção que o autor dela quebra na rodada seguinte não está mal obedecida: está escrita no
> lugar errado.**

Virar campo seria o conserto certo, e **não foi feito de propósito**: o item 014 é sobre as
leituras de texto, e trocar o modelo da conta dos disparos no meio dele é ampliar escopo (§1-A). O
que foi feito é o que cabia — a régua passou a **nomear as parcelas**:

> **Régua que acusa uma CONTA tem de nomear as PARCELAS.** O total diz que algo está errado; a
> parcela diz **o quê**. Sem ela, cada divergência custa a reconstrução inteira — que eu acabei de
> fazer duas vezes.

---

## 6 · Entrega

- **Código:** `src/texto-das-regras.ts` (a família: `soAProsa`, `semCitacoes`, `AS_LEITURAS`,
  `conferirAsLeituras`), `src/limites-com-sujeito.ts` (passou a `soAProsa`),
  `tests/verde.test.ts` (passou a importar), `tests/limites-com-sujeito.test.ts`.
- **Trava nova:** `tests/leituras.test.ts` — **11 travas**, na ordem da Central, com a UMA
  diferente demonstrada e a guarda da sexta plantada nos dois lados. Entrou na lista do CI.
- **Ferramenta:** `bun run lab81`. **Prova:** `docs/provas/LAB-81/as-leituras.json`.
- **Decisões:** D269 a D272. **§6 da `CLAUDE.md`: fica em VINTE E SETE** — nenhuma das três é
  ocorrência do ponto cego: não houve acusação errada nem número publicado errado. *Guarda que
  cresce a conta do ponto cego sem ocorrência nova dilui a conta.*
- **O verde, medido:** `./external-engines/conferir.sh` → **893 travas na esteira + 17 no testfit,
  7 passos, `exit 0`**, com a prova no navegador carregando o `.wasm` em Chromium de verdade. A
  lista do CI que roda sem os clones vizinhos foi de **486 para 499** travas. **Conferido aqui, não
  no GitHub** — a execução automática segue desligada desde 08/10, receita em
  `docs/COMO_RELIGAR_O_CI.md`, dois passos, não executados agora.
- **Vizinhos:** `git status` limpo nos três clones, conferido ao fim da rodada (§4).
