> ✅ **FEITO no LAB-83**, em 10/10/2026. Relatório em
> [`../relatorios/LAB-83.md`](../relatorios/LAB-83.md), prova em
> `docs/provas/LAB-83/carimbo-do-modulo-resolvido.json`, decisões **D276 a D279**.
>
> **O item mandou remedir primeiro, e a remedição mudou o tamanho do conserto:** de três vizinhos,
> **dois** têm módulo a resolver e **um não tem**. O `urban-scout-tool` não aparece em `paths`
> nenhum, porque este laboratório lê **GeoJSON** do Geo e não **código** dele — para ele o carimbo
> honesto continua sendo o da convenção, agora **dito como tal** no campo `de`. *Carimbo que não
> tem módulo a resolver não é um carimbo pior: é um carimbo de outra pergunta.*
>
> **E a adoção cabia, porque a medição disse que cabia** — que era exatamente como você pôs a
> pergunta. Das **72** provas, **5** carimbam clone e **2** ferramentas chamam o carimbo; as duas já
> publicam a procedência nesta rodada. As outras 67 não carimbam clone nenhum, então não há nada a
> adotar nelas, e nenhuma prova foi reescrita.
>
> **A divergência foi DEMONSTRADA, não só prevista:** com o resolvedor apontado ao clone do
> rascunho em `3680b9f` — o mesmo repoint do LAB-82 —, o carimbo diz as **duas** linhas e
> `divergem` sai verdadeiro. E o limite que você mandou declarar está declarado: *o módulo
> resolvido diz qual arquivo foi carregado; ele não diz se aquela árvore tinha mudança não
> commitada.*
>
> **A sua lição do LAB-82 rendeu uma terceira vez, e contra mim:** ao mexer na conta dos itens
> abertos (17 → 16, por entrega) a trava `naFila > 15` apareceu, justificada por escrito com *"a
> FILA só cresce"*. **Medido: ela não só cresce** — fez 15 → 16 → 17 → 16 → 17 → 16 → 17, e as duas
> descidas foram por entrega. Era a **terceira** coincidência casada como invariante na mesma
> função, e a primeira cuja justificativa escrita é que estava falsa (D278).
>
> **E escrever a trava nova achou um nome de CI que deixou de ser verdade:** o trabalho
> `guardas que não precisam dos clones vizinhos` lista um arquivo com **duas** travas que precisam
> do clone no disco — uma desde o LAB-68, uma minha. *O nome de um trabalho de CI é uma afirmação
> sobre o que ele precisa, e nenhuma trava a confere.* **Não consertei**, porque escolher entre as
> duas formas de conserto precisa de uma medição que eu não fiz; foi para a `FILA.md` como
> proposta (D279). Então a conta dos abertos andou duas vezes e ficou em **17**.
>
> **As três árvores vizinhas ficaram limpas e nos commits em que estavam.** Nada foi escrito em
> repositório vizinho.

---

# 016 — O CARIMBO SAI DO MÓDULO RESOLVIDO (D274), e não do `HEAD` do clone

**Da direção, 10/10/2026, 10h55 UTC. Rodada do chão.**

## Por que ESTE, e não a D226

**A escolha é sua, não minha.** O seu recado do LAB-82 fecha com dois candidatos:
*"a D226 (os quatro campos de `legais`), que você chamou de 'o seguinte'; e a nova
do carimbo"*. Eu fui ler os dois na sua `FILA.md` antes de escolher, e a sua
própria entrada da D226 decide:

> *"entregá-los **MUDA O DESENHO** — a rampa publicada de `ensaio-com-via` se mexeu
> na hora."*

**Mudança de desenho espera o olho do Jonny**, e ele dormiu às 03h52. A D226 fica
**primeira da próxima caixa**, intacta, e nada se perde esperando: os quatro campos
saem `null` hoje, que é a verdade, e ninguém está bloqueado neles.

**E a sua, a do carimbo, é a que não pode esperar — por um motivo que é seu
também:** este repositório existe para **medir o motor dos outros e dizer contra
que commit mediu**. Um carimbo errado não produz um número errado: produz um
número certo com **endereço errado**, que viaja para a casa vizinha como pedido.
Nesta mesma rodada você escreveu que *"a remedição MUDOU O ENDEREÇO DO PEDIDO"* —
então o endereço é a parte que mais se usa, e é a que está frouxa.

## O que você mesmo mediu, e é o enunciado (D274)

Ao remedir o sétimo mecanismo contra o motor em `3680b9f`, num clone do clone com
o `paths` repontado, a ferramenta **mediu o motor novo e carimbou o velho**
(`6cf6396`, o `HEAD` da árvore do vizinho, que não foi tocada).

> *"O código vem do resolvedor de módulos; o carimbo vem do `git rev-parse` do
> clone: duas fontes de verdade para 'qual motor rodou', e só uma sabe. Carimbo que
> lê o repositório mede a INTENÇÃO de quem configurou, não o que rodou — e acerta
> sempre que ninguém reponta nada, que é por que ninguém descobre que ele pode
> errar."*

## O conserto, com o nome que você deu

1. **o carimbo sai do MÓDULO RESOLVIDO** — `import.meta.resolve` do ponto de
   entrada do vizinho, que é a mesma régua com que você conferiu o repoint no
   LAB-82;
2. **o `HEAD` do clone vira uma SEGUNDA linha**, não desaparece: ele responde outra
   pergunta (*"que árvore está no disco"*) e continua valendo;
3. **divergindo, a prova diz as DUAS** — e a divergência é a notícia, não o erro.

## A RESSALVA É SUA, e ela manda no escopo

Você escreveu: *"é a proposta do D223 um degrau adiante, e **toca toda prova que
usa clone**"*.

**Então o escopo deste item é o CARIMBO, não a reescrita das provas.** Conserte a
fonte do carimbo e deixe a adoção nas provas medida e **declarada**: quantas provas
usam clone, quantas passam a trazer as duas linhas, e quantas ficam para depois —
com o motivo. *Item que reescreve sessenta provas numa rodada é item que ninguém
revisa.* Se a conta disser que a adoção cabe toda aqui, cabe; **quem decide é a
medição, e ela vai no relatório.**

**E remeça primeiro, como você fez no LAB-82** — foi a remedição que achou este
buraco, e ela custa pouco: se o carimbo já estiver certo em algum caminho, isso
muda o tamanho do conserto antes de ele começar.

## O que o carimbo NÃO pode saber, e isso se declara

O módulo resolvido diz **qual arquivo** foi carregado; ele não diz se aquela árvore
tinha **mudança não commitada**. Um clone sujo entrega código que não corresponde a
commit nenhum, e nenhuma das duas fontes conta isso. **Declare esse limite junto
com o conserto** — guarda que não declara o próprio buraco mente pelo silêncio, que
é regra desta casa.

## As fronteiras

- **nada se escreve em repositório vizinho** — se sair pedido, ele sai no seu bloco
  e eu transporto;
- as três árvores vizinhas ficam **limpas e no commit em que estavam**;
- **as cinco classes que param continuam valendo.** Nenhuma se aplica a este item,
  item por item: não gasta dinheiro (é código e prova locais), não tem volta
  (nenhuma migração, nenhum dado apagado), não muda promessa ao usuário (este
  repositório não tem usuário), não toca segurança nem dado pessoal, e **não é
  decisão de urbanismo** — é a procedência de uma medição.

**E a sua lição do LAB-82 vale aqui mais que em qualquer lugar:** *"a aparência de
um defeito conhecido é o disfarce mais eficiente de um fato novo."* Se ao consertar
o carimbo aparecer uma divergência que parece o D223, meça antes de classificar.
