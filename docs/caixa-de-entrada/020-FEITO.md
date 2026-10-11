> ✅ **FEITO no LAB-87**, em 10/10/2026, no despertador das 23:05. Relatório em
> [`../relatorios/LAB-87.md`](../relatorios/LAB-87.md), prova em
> `docs/provas/LAB-87/as-onze-reclassificadas.json`, decisões **D289, D290 e D291**.
>
> **O item convidou a corrigir o denominador, e ele estava errado — por um motivo que o convite não
> previu.** Nenhuma das dez dependia de fora. O que havia era uma pergunta que a minha
> classificação do LAB-86 **nunca fez**: *"o universo está dentro desta casa?"* decide se recontar
> é **barato**; ela não diz se recontar é **possível**, nem se é **significativo**. Abertas uma a
> uma, havia **três espécies** dentro de uma classe: **3** medem ESTADO com ferramenta (recontar
> **é** a conferência), **7** registram EVENTO (*"quebrei esta trava e o exit foi 0 → 1"* —
> medido: **nenhuma das sete carrega número de topo**) e **1** é regerada pelo verde a cada rodada
> (a prova no navegador: **não pode** ficar velha). 3 + 7 + 1 = **11**, somado das linhas.
>
> **O número que o item exigiu, e ele não é "2 de 10":** a forma cabe em **3**, e as **3** estão
> feitas — a do LAB-57 no item 019, a do **LAB-52** e a do **LAB-04** agora. As outras oito **não
> ficam para depois: elas não são desta forma.** *Lista que encolhe porque o item era menor do que
> parecia é ENTREGA; lista que encolhe porque alguém desistiu é DÍVIDA — e a diferença tem de
> estar escrita.*
>
> **Dois achados novos nas duas abertas.** O **LAB-52** estava velho pelo mesmo motivo do D287 e
> **pior**: 114 arquivos contra **191**, 32 114 linhas contra **52 245** — 40 % de atraso —, e a
> trava o conferia com **quatro** limiares, entre eles `arquivos > 100`, que uma prova nascida com
> 114 passa para sempre. O **LAB-04** é de outra espécie ainda: varrido todo `.ts` e `.sh` que o
> git carrega, **nada escreve `docs/provas/LAB-04/oraculo.json`** — foi escrita **à mão uma vez**,
> no PR #40, e nunca mais relida. *Prova sem gerador é a forma mais estável de prova velha: ela
> não envelhece porque o prompt continuou trabalhando — envelhece porque nada no mundo a obriga a
> concordar com o código.*
>
> **E o "todo `>` sai" precisou dizer `>` SOBRE O QUÊ** (D218 aplicado ao próprio item, D290): o
> limiar **sobre a prova guardada** foi **apagado** e trocado por recontagem exata; os dois sobre a
> **medição viva** **ficaram, com o motivo escrito ao lado**, porque são o D164 — *zero de régua
> parada é indistinguível de zero de árvore limpa*. *Limiar sobre medição VIVA guarda contra régua
> PARADA; limiar sobre prova GUARDADA não guarda nada* — apagá-los seria trocar um defeito por
> outro.
>
> **A duplicação que o item nomeou existia:** a trava do LAB-52 tinha a própria cópia do filtro do
> universo e o próprio laço. Ferramenta e trava passaram a chamar **a mesma função**
> (`src/escopo-das-chamadas.ts`), e o universo das duas varreduras **é diferente de propósito** —
> *duas varreduras da mesma casa podem ter universos diferentes sem que uma esteja errada; o que
> não podem é ter o universo escrito em dois lugares.*
>
> **E o lado ruim da trava do LAB-04 nasceu tautologia:** `expect(faces).not.toBe(faces + 1)`, uma
> sabotagem que não sabota nada. Virou uma **função de recontagem** que os dois sentidos chamam.
> *Trava cujo lado ruim compara coisa diferente do lado bom não prova que o lado bom mede: prova
> que os dois lados existem.*
>
> **As duas notas que não pediam ação, e a segunda pedia (D291):** o D231 virou régua de família,
> registrado sem ação. Já a nota do Padrão **valeu duas linhas, porque o que estava errado não era
> o número**: a **§1-C do `CLAUDE.md`** dizia, desde 08/10, que este repositório está *"sem cópia
> do Padrão Archilly e sem `VERSAO.txt` — **conferido aqui e é verdade**, nenhum dos dois existe na
> árvore"*, e **metade era falsa, com a metade falsa sendo a minha** — as três palavras *"conferido
> aqui"* são minhas, não da Central. O `VERSAO.txt` de fato não existe; **a cópia existia desde
> 14/09** (PR #12, `4081c27` — e não *"03/10, PR #40"*: erro de clone raso, corrigido por D293; e desde 11/10 aquele caminho é um PONTEIRO, D292), o **`docs/INDEX.md` a lista** como *"cópia trazida"*, e o `LF-FINAL-2` já a
> tinha conferido **byte a byte** contra a do `motor-testfit`. *A árvore se contradizia em duas
> páginas, e nenhuma das duas estava medindo.* **Declaração minha sobre o que a árvore TEM ou NÃO
> TEM é a mais fácil de todas de conferir — e por isso é a mais vergonhosa de deixar sem guarda:
> não precisa de clone, de rede, de motor nem de semente, precisa de um `existsSync`. O que
> faltava não era instrumento, era a pergunta**, e ela ficou um mês sem ser feita. A §1-C foi
> **riscada com a medição ao lado**, o fato virou **campo declarado** em vez de frase — *a primeira
> régua que eu escrevi aqui lia a prosa e não pegou o defeito, porque a mesma frase fala de dois
> arquivos com veredictos opostos* —, e **há guarda** nos dois sentidos e no erro simétrico. **O
> aviso do número congelado mora no `docs/INDEX.md` e NÃO dentro da cópia:** eu o escrevi dentro
> dela primeiro, e isso quebrava a única coisa que ela promete, ser byte a byte igual à do vizinho
> (`cmp` reconferido em 10/10 — **iguais**, e as duas casas na mesma Versão 1). *Aviso que estraga
> a prova da coisa avisada é um aviso no lugar errado.* **A cópia não foi atualizada para a 3.0** —
> *declarar um número velho é medição; trocá-lo sem a fonte seria inventar conteúdo que ninguém
> aqui leu.* E de passagem, a **nona da família do D248**: ao reescrever a §1-C a frase-marca *"o
> kit, quando chegar, é outro item"* caiu numa quebra de linha e a trava do item 007, que lia com
> `includes` cru, acusou a marca de ter saído do arquivo — *o conserto já morava em
> `src/texto-das-regras.ts` desde o LAB-77, e esta trava não o chamava.*
>
> **A D226 não foi tocada** — muda o desenho e espera o olho do Jonny, como o próprio item ordenou.

---

# 020 — as outras DEZ provas recontáveis, e nenhuma das 63 que dependem de fora

> **Da direção, 10/10/2026 às 23h25 UTC.** A sua caixa esgotou com o 019 (LAB-86,
> a D204 consertada por recontagem). **A escolha é sua, e você a mandou à fila com
> o motivo na mesma frase:** *"Recontei UMA, a que a D204 nomeou; **as outras dez
> foram à FILA**, porque são medição POR PROVA."*

## Por que esta, e por que não a D226

A sua lista tinha duas, e você mesma ordenou: a **D226** (os quatro campos de
`legais`) *"MUDA O DESENHO e espera o olho dele — e agora ela é a única da sua
lista que não é medição minha"*.

**Desenho espera o Jonny, e isto é madrugada.** A régua que mais decide numa fila
autônoma não é a prioridade, é se o item precisa do olho dele — e a D226 precisa.
As dez não.

## O alcance, que é seu e é a trava do escopo

| | |
|---|---|
| provas no total | **74** |
| universo **DENTRO** desta casa — a forma cabe | **11** |
| dependem de **FORA** (clone vizinho, commit, semente, gleba) | **63** |
| recontadas até agora | **1** (a da D204) |
| **o que este item pede** | **as 10 restantes das 11** |

**As 63 ficam fora, e a razão é a sua, medida:**

> *"RECONTAR O QUE DEPENDE DE FORA NÃO É MAIS RIGOR: É OUTRA MEDIÇÃO COM O NOME DA
> ANTIGA — e isso é LAB-79 medido, não opinião: o LAB-78 perdeu dois de quatro
> lotes assim, porque o motor andou de `4181e95` para `6cf6396`."*

**Se alguma das dez, ao ser aberta, mostrar que depende de fora, ela SAI** — e a
contagem 11/63 se corrige no relatório. *Medição que descobre que o próprio
denominador estava errado é entrega, não desvio.*

## O que o item pede, e o mecanismo já existe

1. **As dez passam a ser conferidas por RECONTAGEM**, não por limiar, chamando **a
   mesma função** que a ferramenta e a trava do 019 já chamam
   (`src/escopo-da-varredura.ts`). **Nenhuma segunda implementação da mesma
   pergunta** — foi o que você chamou pelo nome no 019, e é o D231 desta casa.
2. **Todo `>` sai.** A lição da sua rodada é a régua deste item:

   > *"RÉGUA QUE CONFERE UMA PROVA COM «MAIOR QUE» ACEITA QUALQUER PROVA VELHA QUE
   > JÁ FOSSE GRANDE O BASTANTE QUANDO NASCEU (…) num repositório que cresce, **o
   > limiar fica mais frouxo a cada commit sem ninguém mexer nele**."*

   Então a conferência de cada uma das dez é **comparação exata**, e onde houver
   limiar ele é **apagado**, não apertado.
3. **A ordem do `git add`, que você acabou de medir e que estas dez vão repetir:**

   > *"A PROVA TEM DE SER GERADA DEPOIS DO `git add`, NÃO DEPOIS DA ÚLTIMA
   > EDIÇÃO (…) o universo é o `git ls-files`, e ele muda no `git add`."*

   Dez provas regeradas é dez chances de cometer esse engano, que é **barato de
   cometer e invisível sem recontagem**. Já que agora é guarda e não disciplina, a
   guarda tem de pegá-lo nas dez.
4. **Os dois sentidos em cada uma**, como no 019: defeito plantado → acusa
   **nomeando a chave**; árvore intocada → **passa calada** (duas recontagens na
   mesma árvore batem, e régua que exigisse carimbo mais novo a cada commit
   reprovaria a árvore correta).
5. **Cada uma entra na lista do portão sem clones**, se couber — foi o buraco que
   você achou de passagem no 019: *"a `configuracao.test.ts` NUNCA ESTEVE na lista
   do trabalho que roda em todo envio"*. **Prova recontável que não roda no portão
   é prova que volta a envelhecer.**

## O ritmo, e ele é decisão sua

**Dez é muito para uma rodada.** Se ao abrir a primeira você medir que cada uma é
uma medição própria — e você já disse que são *"medição POR PROVA"* —, **faça as
que couberem com prova inteira e deixe o resto na lista fechada, com o número**.
A lista que só encolhe é a forma desta casa, e encolher de 10 para 6 com quatro
provas de verdade vale mais que dez rasas.

**O que não é aceitável é a lista ficar sem número.** Diga quantas ficaram e por
quê.

## O que NÃO é deste item

- **a D226** e os quatro campos de `legais` — desenho, espera o Jonny;
- **as 63 que dependem de fora**, por medição sua;
- **religar o CI**, que a régua cobra e não liga (a sua fronteira, atravessada
  zero vezes em duas rodadas);
- **nada escrito em repositório vizinho**, e as três árvores limpas no fim.

## Conferido aqui, não no GitHub

`./external-engines/conferir.sh` inteiro, com a conta de travas e a lista do
portão ditas no recado, como no 019.

---

## Levado pela direção — duas casas convergiram hoje no seu D231

O seu D231 (*conserto de régua aplicado em um instrumento só é meio conserto*)
foi medido hoje em **duas outras casas**, sem ninguém combinar: a **Central**
achou **cinco grafias** do rótulo de limite nos 21 conferidores que nove casas
rodam, e a **Pesquisa** adotou a grafia dela antes de a Central unificar. O
**Parcelamento** unificou o dele em casa com a mesma razão.

Fica dito porque a sua frase é a que explica os três casos, e porque ela está
virando régua de família. **Nada aqui espera resposta.**

E o kit: a Central publicou o **0.37.0** às 22:31 UTC, com a versão impressa na
primeira linha de todo conferidor dela. **Esta casa não vendoriza o kit** — então
isto não lhe pede nada; vai registrado porque a sua cópia do padrão em
`docs/referencia/PADRAO_ARCHILLY.md` está na **Versão 1, de 13/09**, e a Central
publica a **3.0**. *Não é item: é a mesma espécie da D204 — número congelado que
ninguém relê —, e você decide se vale uma linha.*
