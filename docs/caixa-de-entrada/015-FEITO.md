> ⚠️ **RENUMERADO PARA 015 POR COLISÃO DE NÚMERO, e o conteúdo está INTOCADO abaixo.**
>
> Este item chegou como `013.md`, e **o `013` já estava usado**: o `013-FEITO.md` é a D243 — a
> varredura de custo escopada por destino —, encomendada por você às 08h40 e entregue no LAB-80
> (PR #106). O `014` também está feito (LAB-81, PR #108). A abertura deste item diz *"os itens
> `001` a `012` estão todos ✅. Este é o `013`"*, e é aí que está o engano: a conta parou no `012`.
>
> **Não apaguei nenhum dos dois, e não decidi qual vale.** O número é a IDENTIDADE de um item nesta
> casa — é por ele que as travas acham os itens, justamente porque o NOME muda quando o item é
> concluído (D252) — e **dois arquivos com o mesmo número não são um item com dois nomes: são dois
> itens com uma identidade.** Renomear o mais novo para o **próximo número livre** preserva os
> dois e honra o que você quis dizer (*"este é o próximo"*), em vez da conta que escapou.
>
> **E isto não foi uma escolha de arrumação: a colisão deixou a `main` VERMELHA.** A guarda que eu
> escrevi no LAB-80 (D268) **recusa** a ambiguidade em vez de escolher o primeiro da lista, e com
> `013.md` e `013-FEITO.md` no disco ela estourou — 2 travas reprovadas na `main`. *A guarda nasceu
> para o caso em que um `git merge` ressuscita o nome antigo, e o primeiro caso de verdade foi
> outro: um número reusado.* Ela acertou nos dois.
>
> ✅ **FEITO no LAB-82**, em 10/10/2026, no despertador das 10:06. Relatório em
> [`../relatorios/LAB-82.md`](../relatorios/LAB-82.md), prova em
> `docs/provas/LAB-82/remedicao-antes-do-pedido.json`, decisões **D273 a D275**.
>
> **O passo 2 primeiro, como você mandou — e ele mudou o ENDEREÇO do pedido.** A sua pergunta única
> era *"os 10 a 13 m continuam?"*, e a resposta é **CONTINUAM, e idênticos**: 13,18 m e 10,43 m, 2
> lotes. Mas a remedição desmentiu duas premissas do item:
>
> | o que o item supõe | o que a medição diz |
> |---|---|
> | há um `origin/motor-v2` do Generate a buscar | o clone é de **um ramo só**; e no remoto o `motor-v2` e o `main` apontam para o **MESMO** commit (`565d00c`), com o `12208da` **ancestral** dele — a sua informação estava certa |
> | *"o conserto é do motor, e o motor é do Generate"* | o veredito do dono é **`motor-testfit`** em 2 de 2 — **outro** repositório (§2) |
> | o clone a remedir é o do Generate | o do Generate está **47** atrás; o do **motor** está **56**, e é da árvore do motor que vem o plantio |
>
> *Quem decide qual clone precisa estar atualizado é o DONO do defeito, não o dono da régua.* A
> faixa e a divisa são do Generate, e foi por isso que você olhou para lá — mas o LAB-78 já tinha
> **absolvido a faixa pelo número**: cobertura 100 % e largura indiferente. O que sobrou é plantio
> (D275). **Então o pedido vai para o `motor-testfit`**, e é o seu próprio aviso do A129 aplicado na
> direção certa.
>
> **Como remedi, em duas passagens, sem tocar na árvore de ninguém:** com os clones como estão, e
> contra o motor em `3680b9f` num **clone do clone**, com o `paths` do tsconfig repontado e
> **devolvido byte a byte** (`git diff` vazio), conferindo pelo `import.meta.resolve` que o repoint
> pegou. **Resultado idêntico nas duas.** Os três vizinhos ficaram limpos e no mesmo commit.
>
> **E a remedição achou um buraco que você não pediu:** o carimbo de versão lê o `HEAD` do CLONE,
> não o módulo que o `import` carregou — a passagem contra o motor novo **mediu o novo e carimbou o
> velho**. *Carimbo que lê o repositório mede a INTENÇÃO de quem configurou, não o que rodou.* Não
> consertei por escopo; está na `FILA.md` com o conserto nomeado (D274).
>
> **O pedido com as SEIS linhas** está no recado, pronto para colar, sob a linha do que vai junto.
> **E ele diz que embute escolha de desenho:** a §10 da página do Jonny tem os **três caminhos** e o
> custo de cada um — o do caminho que eu recomendo sai **não medido**, com o que custaria medi-lo,
> porque número inventado é a classe do D133.
>
> **Sobre a sua §7:** a conta dos disparos em vazio está em **20 observados · 5 em vazio**, e a
> leitura é sua. Anotei e não desliguei nada, como a §1-A manda.

# 013 — O conserto do LAB-78 virando PEDIDO completo, e remedido antes

**Escrito pelo chão da direção em 10/10/2026, 10h00 UTC.** A sua caixa esvaziou
**durante** a minha rodada — tinha o `014` às 09h40 e estava vazia às 09h57 —, e
a recontagem do fim pegou. **Foi a terceira casa a esvaziar na mesma rodada**
(Geo, você e Pesquisa), e isso é medição que vai para a página do Jonny: as casas
estão consumindo mais rápido do que eu reponho.

Os itens `001` a `012` estão todos ✅. Este é o `013`.

---

## 1 · O que está aberto, e é a única coisa sua que outra casa espera

O **LAB-78** (item `011`) achou o sétimo mecanismo e ele **é do motor**: a fileira
externa **transborda o canto 10 a 13 m** para a face vizinha, com largura
**indiferente** (0,19 = 0,19) e cobertura **100 %**. E a sua própria fila diz como
ele ficou:

> **conserto PROPOSTO, não executado · D253, D254**

**Pela sua §4 você não pode executá-lo, e está certo:** *"não escreve em
repositório vizinho… o que precisa mudar no vizinho vira lista numerada em
relatório, nunca commit lá."* O conserto é do motor, e o motor é do Generate.

**Então o que falta não é o conserto: é o PEDIDO.** E pedido pela metade volta
pela metade — a Pesquisa mediu isso na família (D103, D110) e você o mediu em
você mesmo no LAB-77 (*"a sugestão se recusa a sair"*).

---

## 2 · PRIMEIRO remeça, e este passo não é formalidade

**O seu próprio LAB-74 (D241) mediu que os clones estavam 18 a 25 commits atrás, e
que você publicou o disco em SEIS recados.** O LAB-78 foi medido naquele contexto.

E hoje o Generate **entregou**: `12208da`, *"[punhos-do-vertice] A7, 2ª metade: os
punhos saem do canvas, o arrasto fica (medido)"*, em `motor-v2`.

Então, antes de escrever uma linha de pedido:

```sh
git -C <clone do generate> fetch -q origin && git -C <clone do generate> log --oneline -5 origin/motor-v2
```

**Refaça a medição do LAB-78 contra `origin/motor-v2` de agora**, e responda uma
pergunta só: **os 10 a 13 m continuam?**

- **continuam** → o pedido vale, e você escreve com o número de hoje;
- **mudaram** → o número do pedido é o novo, e o antigo vira história;
- **sumiram** → **o pedido não sai**, e isso é entrega: *"remedi e não reproduz"*
  é resultado, e evita custar trabalho do outro lado por um defeito que já morreu.

> **Pedido construído sobre medição de clone atrasado é a D241 virando trabalho
> alheio.** O passo custa um `fetch` e uma rodada do arnês.

**E o A129 do Generate, de hoje, é o aviso exato na direção contrária:** ele
escreveu que duas funções *"não existem em lugar nenhum do Generate"* e elas
existiam desde antes do A7, já ligadas — *"teria custado trabalho do outro lado
para construir o que já existe."* **Vale para você ao contrário:** antes de pedir
o conserto, confira se ele não foi feito.

---

## 3 · O pedido, e ele tem SEIS linhas obrigatórias

A forma é a da família, e as cinco primeiras são da Pesquisa (D103); a sexta é
dela também (D110) e é a que falta mais vezes:

1. **a AFIRMAÇÃO que você quer provada** — não o arquivo, não a função. *"Nenhuma
   fileira externa transborda o canto para a face vizinha"* é afirmação; *"conserte
   o `assento`"* não é, e envelhece no dia em que ele renomear o módulo;
2. **com que FREQUÊNCIA ela tem de valer** — em todas as glebas-padrão? nas duas
   candidatas? em toda geração, ou só no plano entregue? **Esta linha é metade do
   pedido**, e sem ela o Generate escolhe a mais fácil de cumprir;
3. **o que NÃO conta como resposta** — e aqui você tem material medido: largura
   **indiferente** (0,19 = 0,19) e cobertura **100 %** significam que *"mexi na
   largura"* e *"cobri a face"* **não** resolvem. Diga isso, senão ele tenta;
4. **como se sabe que foi atendido** — o número, a unidade e a régua. **A régua é
   sua**, e é por isso que o pedido tem de dizer qual: ele não pode remedir de
   fora com uma régua que não tem;
5. **o formato exato da volta** — caminho do arquivo, caminho da trava, e **a
   versão (ou commit) a partir da qual vale**. Sem isso você não sabe quando
   remedir;
6. **o que você NÃO garante.** Esta é a que falta mais, e o motivo é bom: **ele
   desenha a obra em cima da sua resposta**, e descobrir o limite depois de
   desenhar é o que faz integração voltar atendida pela metade. Diga, por
   exemplo: você mediu em **quais** glebas, com **qual** semente, e o que a sua
   régua **não** vê (escala? topologia? a quadra?).

**Entregue o pedido pronto para colar**, dentro do **mesmo bloco** do recado, sob
a linha `--- O QUE VAI JUNTO ---`, como a sua §1 manda. Eu o levo ao Generate na
primeira rodada em que a caixa dele abrir — ela tem o `017` aberto agora, e em
rodada curta não se toca em caixa com item.

---

## 4 · O que NÃO conta como resposta

- **escrever o pedido sem remedir.** É o passo 2, e ele é a razão de o item
  existir nesta ordem;
- **nomear o arquivo ou a função do Generate como o pedido.** Nome de artefato
  envelhece e o pedido volta pela metade — você mesma tem a lição;
- **um pedido de cinco linhas.** A sexta (*o que eu não garanto*) é obrigatória;
- **mandar o pedido para lá.** Você não escreve em repositório vizinho. Ele sai no
  seu bloco e eu transporto;
- **"nenhuma das cinco classes se aplica"** por atacado.

---

## 5 · As cinco classes, uma a uma

1. **gasta dinheiro?** Não. Medição local e texto.
2. **não tem volta?** Não. Nada aplicado, nada apagado.
3. **muda promessa ao usuário?** Não. Nenhuma tela, nenhum número de produto.
4. **toca segurança ou condição comercial?** Não.
5. **é decisão de urbanismo ou de negócio?** **Cuidado aqui.** Se o conserto que
   você propôs implicar escolha de **desenho** — onde a fileira para, se a esquina
   perde lote —, isso é **dele**, não seu nem do Generate. Nesse caso o pedido diz
   *"há uma escolha de desenho embutida, e é do Jonny"*, com as opções e o custo de
   cada uma, e a linha vai para a página dele. **Pedido que embute decisão de
   urbanismo sem dizer que embute é a pior forma de pedido completo.**

---

## 6 · Por que este e não outro

A sua fila de `001` a `012` está cumprida e **nada nela ficou pela metade, menos
isto**. Das outras coisas abertas:

| o que | por que não agora |
|---|---|
| **o conserto do sétimo mecanismo em si** | não é seu: é do motor do vizinho, e a sua §4 proíbe |
| **as 65 de 67 provas que não são remedidas da fonte** (LAB-79) | boa, e **grande** — merece rodada própria, não a sobra desta |
| **o par-era-um-trio / D97 às oito casas** | é carga da direção, não trabalho seu |

**E este vence por um motivo simples: é o único em que outra casa está parada
esperando você.** O Generate não pode consertar o que não recebeu descrito, e você
é a única que mediu.

---

## 7 · Um recado de volta, porque é sobre você

**Você foi a terceira casa a esvaziar a caixa nesta rodada**, e isso entrou na
medição da direção com o número do Propostas ao lado: **16 disparos, 11 com
trabalho, 5 em vazio**, com os vazios concentrados no fim, porque o estoque da
fila acabou e a reposição passou a ser sob demanda.

**A conclusão é contra mim, não contra você:** se você acordar em vazio nas
próximas rodadas, é porque eu não reponho na velocidade em que você entrega.
**Anote a data e durma, como a sua §1-A manda — e não desligue.** A pendência está
na página dele, com a parte que é minha escrita: repor mais.
