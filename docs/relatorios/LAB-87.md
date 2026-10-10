# LAB-87 · As onze, reclassificadas — e "dentro desta casa" não era suficiente

**Prompt:** item **020** da caixa de entrada. · **Rodada:** despertador das 23:05 de 10/10/2026. ·
**Conferido aqui, não no GitHub** (§7).

---

## 1 · O item pediu dez, convidou a corrigir o denominador — e ele estava errado (D289)

O item 020 pediu as **dez** provas restantes das onze que o LAB-86 classificou como *"universo
DENTRO desta casa"*, e foi explícito: *"se alguma das dez, ao ser aberta, mostrar que depende de
fora, ela SAI — medição que descobre que o próprio denominador estava errado é entrega, não
desvio."*

**Aberta uma a uma, o denominador estava errado — e não pelo motivo previsto.** Nenhuma das dez
dependia de fora. O que havia era uma pergunta que a minha classificação do LAB-86 **nunca fez**.

> **A pergunta que eu fiz decide se recontar é BARATO. Ela não diz se recontar é POSSÍVEL, nem se
> é SIGNIFICATIVO.** Eu classifiquei pela **conta** e publiquei como se fosse pelo **sentido**.

### As três espécies que havia dentro de uma classe

| classe | quantas | o que a recontagem significa nela |
|---|---|---|
| **medição de ESTADO, com ferramenta** | **3** | a prova afirma um número sobre a árvore de agora: recontar **é** a conferência — a forma do D287 |
| **registro de EVENTO** | **7** | a prova afirma *"quebrei esta trava e o exit foi 0 → 1"*. **Medido: nenhuma das sete carrega número de topo** — não há o que recontar |
| **regerada pelo VERDE a cada rodada** | **1** | a prova no navegador é reescrita por `conferir.sh` em toda execução: **não pode** ficar velha |

3 + 7 + 1 = **11**, e a soma fecha — contada das linhas, não do texto (D212).

---

## 2 · As três de estado, e duas eram achado novo

### LAB-52 — a segunda prova velha, pelo mesmo motivo

| número | na prova | na mesma árvore | atraso |
|---|---|---|---|
| `arquivos` | 114 | **191** | 40,3 % do número de hoje |
| `linhas` | 32 114 | **52 245** | 38,5 % |
| `bytes` | 1 357 772 | **2 325 267** | 41,6 % |
| `parametrosExaminados` | 4 932 | **7 892** | 37,5 % |
| `camposExaminados` | 4 318 | **6 577** | 34,3 % |

E a trava tinha **quatro** limiares, entre eles `arquivos > 100` — que uma prova nascida com 114
passa para sempre. *A régua que achou a primeira achou a segunda no dia seguinte, no primeiro lugar
em que olhou.*

### LAB-04 — e esta é de outra espécie ainda: não tem GERADOR

Varrido todo `.ts` e `.sh` que o git carrega, **nada escreve `docs/provas/LAB-04/oraculo.json`**.
Ela foi escrita **à mão uma vez**, no PR #40, e nunca mais relida; o único lugar que a menciona é a
lista de exceções do §7.

> **Prova sem gerador é a forma mais estável de prova velha.** Ela não envelhece porque o prompt
> continuou trabalhando (D204): envelhece porque **nada no mundo a obriga a concordar com o
> código**. O limiar nem entra — aqui não havia conferência nenhuma.

A reimplementação é **função pura** sobre duas fixtures fixas, então a trava recomputa e compara o
`medido`, chave por chave. **O `esperado` não se reconta:** vem de **duas implementações
independentes** do `STRAIGHT_SKELETON_ANALYSIS.md` §4.3/§4.4, de fora desta casa — o que se cobra é
que o `medido` concorde com ele, que é para isso que um oráculo serve.

### E a primeira versão do lado ruim dela era uma tautologia

Eu escrevi `expect(faces).not.toBe(faces + 1)` — uma sabotagem que não sabota nada. Virou uma
**função de recontagem** que os dois sentidos chamam.

> *Trava cujo lado ruim compara uma coisa diferente do lado bom não prova que o lado bom mede:
> prova que os dois lados existem.*

---

## 3 · Todo `>` sai — onde a regra vale, e não onde ela mudaria de alvo (D290)

O item foi categórico: *"**Todo `>` sai** (…) onde houver limiar ele é **apagado**, não apertado."*
Ao abrir a trava do LAB-52 havia limiares de **duas espécies**:

| onde | o que havia | o que foi feito |
|---|---|---|
| sobre a **prova guardada** | `prova.escopo.arquivos > 100` | **apagado**, trocado por recontagem exata |
| sobre a **medição viva** | `parametrosExaminados > 3000`, `camposExaminados > 2500` | **ficaram**, com o motivo escrito ao lado |

> **Limiar sobre medição VIVA guarda contra régua PARADA; limiar sobre prova GUARDADA não guarda
> nada.** O mesmo `>` é certo num lugar e inútil no outro — e o que muda não é o operador: é **se o
> número do outro lado é recontado agora ou lembrado de ontem.**

Os que ficaram são o **D164** (*zero de régua parada é indistinguível de zero de árvore limpa*):
se a varredura parar de olhar, o número cai **numa trava e não num silêncio**. Apagá-los seria
**trocar um defeito por outro** — perder o D164 para curar o D287.

*E isto é o D218 aplicado ao item: "todo `>` sai" precisa dizer `>` **sobre o quê**.*

### E a trava do LAB-52 duplicava a varredura — o defeito que o item nomeou

Ela tinha a **própria cópia** do filtro do universo e o **próprio laço**, ao lado da ferramenta que
faz o mesmo. Passou a chamar a mesma função (`src/escopo-das-chamadas.ts`).

**E o universo das duas é diferente, de propósito:** a do LAB-57 parte de `git ls-files`; a do
LAB-52, de `ls-files --cached --others`.

> **Duas varreduras da mesma casa podem ter universos diferentes sem que uma esteja errada — o que
> não podem é ter o universo escrito em dois lugares.** E o instante em que cada uma fica velha é
> outro: a do LAB-57 muda no `git add`; **esta muda assim que o arquivo EXISTE**, porque `--others`
> já o vê — *é a mais fácil de deixar velha das duas*, e reprovou **duas vezes** durante esta
> rodada, por isso mesmo.

---

## 4 · A resposta ao número que o item exigiu

O item autorizou fazer menos *"com o número e o porquê"*, e exigiu: *"o que não é aceitável é a
lista ficar sem número."*

**A resposta honesta não é "fiz 2 das 10 e 8 ficaram".** É: **a forma cabe em 3, e as 3 estão
feitas.** As outras oito **não ficam para depois — elas não são desta forma**: sete registram
evento e uma é regerada pelo verde a cada rodada.

> **Lista que encolhe porque o item era menor do que parecia é ENTREGA; lista que encolhe porque
> alguém desistiu é DÍVIDA — e a diferença tem de estar escrita.**

**Há guarda** (`tests/as-onze.test.ts`, 7 travas): a soma contada das linhas, o vocabulário das três
classes **fechado**, cada arquivo conferido **contra o disco** e não contra o booleano publicado
(*trava que acredita no campo da prova não confere a prova: repete*), as três de estado obrigadas a
dizer **em que rodada** foram recontadas, e as sete de evento obrigadas a **não ter número de
topo**.

---

## 5 · O que o item trouxe e não pede nada — e a linha que ele me deixou decidir

- **o D231 virou régua de família**, medido em três casas no mesmo dia. Fica registrado, sem ação;
- **a cópia do Padrão Archilly desta casa está na Versão 1, de 13/09**, e a Central publica a
  **3.0**. O item disse que *"não é item: é a mesma espécie da D204 — número congelado que ninguém
  relê"*, e me deixou decidir se vale uma linha. **Valeu duas, porque o que estava errado não era
  o número** — está na §5-A, logo abaixo.

## 5-A · A nota que não era item achou uma afirmação falsa minha (D291)

Ao abrir a nota para escrever a linha, a **§1-C do `CLAUDE.md`** dizia, desde 08/10, que este
repositório está *"**sem cópia do Padrão Archilly e sem `VERSAO.txt`** — conferido aqui e é
verdade, nenhum dos dois existe na árvore."*

**Metade era falsa, e a metade falsa era a minha** — as três palavras *"conferido aqui"* são
minhas, não da Central:

| o que a frase afirmava | o disco |
|---|---|
| `VERSAO.txt` não existe | **certo** |
| a cópia do Padrão não existe | **FALSO** — `docs/referencia/PADRAO_ARCHILLY.md`, trazida em **03/10**, PR #40 |

E não era preciso procurar: o **`docs/INDEX.md` a lista** como *"cópia trazida"*, e o `LF-FINAL-2`
já a tinha conferido **byte a byte** contra a do `motor-testfit`. *A árvore se contradizia em duas
páginas, e nenhuma das duas estava medindo* — o `src/lugares-das-condicoes.ts` repetia a frase
falsa num terceiro lugar.

> **Declaração minha sobre o que a árvore TEM ou NÃO TEM é a mais fácil de todas de conferir — e
> por isso é a mais vergonhosa de deixar sem guarda.** Não precisa de clone, de rede, de motor nem
> de semente: precisa de um `existsSync`. **O que faltava não era instrumento, era a pergunta**, e
> ela ficou **um mês** sem ser feita. E *"conferido aqui"* é a parte que mais convence e a única
> que não deixa rastro.

**A §1-C foi riscada com a medição ao lado**, o fato virou **campo declarado**
(`oQueODiscoDeveDizer`) em vez de frase — *a primeira régua que eu escrevi aqui lia a prosa e
**não pegou** o defeito, porque a mesma frase fala de dois arquivos com veredictos opostos* —, e
**há guarda**, nos dois sentidos e no erro simétrico.

**E o aviso do número congelado mora no `docs/INDEX.md`, NÃO dentro da cópia.** Eu o escrevi
dentro dela primeiro, e isso quebrava a única coisa que aquela cópia promete: ser **byte a byte
igual** à do `motor-testfit` (`cmp` reconferido em 10/10 — **iguais**, e as duas casas estão na
mesma Versão 1). *Aviso que estraga a prova da coisa avisada é um aviso no lugar errado.* **A
cópia não foi atualizada para a 3.0:** *declarar um número velho é medição; trocá-lo sem a fonte
seria inventar conteúdo que ninguém aqui leu.*

**E a trava do item 007 me reprovou pela quebra de linha — a nona da família do D248:** ao
reescrever a §1-C, a frase-marca *"o kit, quando chegar, é outro item"* caiu numa quebra de linha
e o `conferirOsLugares`, que lia com `includes` cru, acusou a marca de ter **saído do arquivo**.
*O conserto já morava em `src/texto-das-regras.ts` desde o LAB-77, e esta trava não o chamava.*

---

## 6 · Entrega

- **prova:** [`docs/provas/LAB-87/as-onze-reclassificadas.json`](../provas/LAB-87/as-onze-reclassificadas.json)
  — as onze uma a uma, com a classe, o motivo e a rodada;
- **decisões:** **D289** (o denominador e as três espécies), **D290** (o limiar vivo contra o
  guardado) e **D291** (o *"conferido aqui"* sobre uma árvore que dizia o contrário);
- **duas provas velhas consertadas** (LAB-52 por recontagem, LAB-04 por recomputação) e **uma
  terceira já feita** no item 019;
- **o gatilho NÃO foi religado** — *a régua cobra, não liga*;
- **os três clones vizinhos:** `git status` limpo e nos commits em que estavam;
- **o portão sem clones:** a `as-onze.test.ts` entrou nele — *prova recontável que não roda no
  portão é prova que volta a envelhecer*, e era o item a dizer isso. Ele foi de **33 para 34
  arquivos**, e de **550 para 568 travas**, 34 de 34 passando sem os clones;
- **verde:** o comando único, **conferido aqui, não no GitHub**.
