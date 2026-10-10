# LAB-82 · A REMEDIÇÃO ANTES DO PEDIDO — e o clone que importava era o OUTRO

**Prompt:** item **015** (chegou como `013`, renumerado por colisão — §1 abaixo). · **Rodada:**
despertador das 10:06 de 10/10/2026. · **Conferido aqui, não no GitHub** (§7).

---

## 1 · O item chegou com um número JÁ USADO, e a colisão deixou a `main` vermelha (D273)

O chat escreveu o item como `013.md`. O **`013` já estava usado**: o `013-FEITO.md` é a D243,
encomendada às 08h40 e entregue no LAB-80. A abertura do item novo diz *"os itens `001` a `012`
estão todos ✅. Este é o `013`"* — **a conta parou no `012`**, e o `013` e o `014` também estavam
feitos.

**E a guarda que eu escrevi uma rodada antes pegou, do pior jeito possível: com a `main`
vermelha.** O D268 fez a busca por número **recusar** a ambiguidade em vez de escolher o primeiro
da lista, e com os dois arquivos no disco ela estourou — **2 travas reprovadas na `main`**. *Ela
nasceu para o caso em que um `git merge` ressuscita o nome antigo. O primeiro caso de verdade foi
outro, e ela acertou nos dois.*

> **O número é a IDENTIDADE de um item** — é por ele que as travas acham os itens, justamente
> porque o NOME muda quando o item é concluído (D252). **Dois arquivos com o mesmo número não são
> um item com dois nomes: são dois itens com uma identidade**, e isso não se resolve escolhendo:
> resolve-se **movendo**.

O item novo virou **`015.md`**, com o conteúdo **intocado** e um cabeçalho explicando. **Nenhum
dos dois foi apagado, e eu não decidi qual valia.**

**E eu quase apaguei o item novo.** Ele tinha a aparência exata do defeito que eu conhecia — mesmo
número, mesma vizinhança, mesma forma do D268. O que me parou foi medir: `git log --diff-filter=A`
mostrou que o arquivo veio de um commit **do chat**, com **outro assunto**.

> **A aparência de um defeito conhecido é o disfarce mais eficiente de um fato novo.**

---

## 2 · A remedição que o item exige — e ela mudou o ENDEREÇO do pedido (D275)

O item manda remedir antes de escrever uma linha, e tem razão: *"pedido construído sobre medição de
clone atrasado é a D241 virando trabalho alheio."* E diz **qual** clone: o do **Generate**, com
`12208da` em `motor-v2`.

**Medido, três coisas, e duas desmentem a premissa:**

| o que o item supõe | o que a medição diz |
|---|---|
| há um `origin/motor-v2` a buscar | o clone é de **um ramo só**; e no remoto o `motor-v2` e o `main` apontam para o **MESMO** commit (`565d00c`), com `12208da` ancestral dele |
| *"o conserto é do motor, e o motor é do Generate"* | o veredito é **`motor-testfit`** em 2 de 2 — **outro** repositório (§2) |
| o clone a remedir é o do Generate | o do Generate está **47** commits atrás; o do **motor** está **56** — e é da árvore do motor que vem o plantio |

> **Quem decide qual clone precisa estar atualizado é o DONO do defeito, não o dono da régua.** A
> faixa e a divisa são do Generate, e foi por isso que o item olhou para lá — mas a medição do
> LAB-78 já tinha **absolvido a faixa pelo número**: cobertura **100 %** e largura **indiferente**
> (0,19 = 0,19). O que sobrou é **plantio**, e plantio é do motor.

### Como a remedição foi feita, em duas passagens, sem tocar na árvore do vizinho

1. **com os clones como estão** — 2 lotes, **13,18 m** e **10,43 m**, dono `motor-testfit`;
2. **contra o motor em `3680b9f`**, 56 commits à frente: **clone do clone** no diretório de
   rascunho, `paths` do `tsconfig` repontado e **devolvido byte a byte** (`git diff` vazio).
   Conferido que o repoint pegou: `import.meta.resolve("@testfit/api.ts")` apontando para o
   rascunho. **Resultado IDÊNTICO** — 13,18 m e 10,43 m, 2 lotes, mesmo dono.

**A árvore dos três vizinhos ficou limpa e no mesmo commit** (§4). O `fetch` só mexe nas
referências locais do clone, e isso já estava escrito na própria casa.

**A resposta à pergunta única do item — *"os 10 a 13 m continuam?"* — é: CONTINUAM, e idênticos.**
Então o pedido vale, e sai com o número de hoje.

---

## 3 · E a remedição achou um buraco no CARIMBO (D274)

Na passagem contra `3680b9f`, **o relatório saiu dizendo `6cf6396`** — o `HEAD` da árvore do
vizinho, que não foi tocada. O carimbo vem de `commit-dos-vizinhos.ts`, que lê
`git rev-parse HEAD` do clone; o código vem do **resolvedor de módulos**.

> **Carimbo de versão que lê o repositório, e não o módulo carregado, mede a INTENÇÃO de quem
> configurou — não o que rodou.** Ele acerta sempre que ninguém reponta nada, e é exatamente por
> isso que ninguém descobre que ele pode errar.

**Não consertado nesta rodada, por escopo** — trocar a fonte do carimbo muda a prova de toda rodada
que usa clone, que é a proposta do D223 inteira. Está na `FILA.md`, com o conserto nomeado: o
carimbo sai do **módulo resolvido**, e o `HEAD` do clone vira uma **segunda** linha; divergindo, a
prova diz as duas. *A remedição desta rodada não foi afetada — as duas passagens deram o mesmo
número, e a que importava está declarada pelo método, não pelo carimbo.*

---

## 4 · O PEDIDO, e a escolha de desenho que ele NÃO esconde

O pedido saiu com as **seis linhas** que o item exige, e está no recado, pronto para colar. Duas
notas sobre ele:

**Ele vai para o `motor-testfit`, não para o Generate** — é a consequência direta do §2, e é o
aviso do A129 do Generate aplicado na direção certa: *"teria custado trabalho do outro lado para
construir o que já existe"*; aqui seria pedir ao vizinho errado.

**E ele declara a escolha de desenho que embute.** A própria `FILA.md` já dizia que o conserto
*"encurta a fileira e encurtar perde lotes que hoje entram — quantos é medição que o LAB-78 não
fez"*. O item é explícito:

> *"Pedido que embute decisão de urbanismo sem dizer que embute é a pior forma de pedido
> completo."*

Então a escolha está na **§10 da página do Jonny**, em português de leigo, com **três caminhos e o
custo de cada um** — e o custo do caminho que eu recomendo sai **não medido**, com o que custaria
medi-lo, porque *número inventado é a classe do D133*.

---

## 5 · Entrega

- **A colisão resolvida:** `013.md` → `015.md`, conteúdo intocado, `main` verde de novo.
- **Ferramenta:** `bun run lab82`. **Prova:** `docs/provas/LAB-82/remedicao-antes-do-pedido.json`
  — os três clones contra a origem deles, a remedição nas duas passagens, e o buraco do carimbo.
- **Página do Jonny:** **§10** nova, com os três caminhos e a recomendação declarada como sugestão.
- **Decisões:** D273 a D275.
- **Trava nova:** `tests/leituras.test.ts` ganhou a guarda do **número repetido** na caixa — porque
  a colisão de hoje só ficou vermelha **por uma trava perguntar pelo `013`**, e uma colisão num
  número que ninguém busca passaria em silêncio. *Guarda que depende de alguém perguntar pelo caso
  não cobre o caso: cobre a pergunta.* Provada por sabotagem: plantado um sósia do `015`, ela
  reprova **nomeando os dois arquivos**; tirado o sósia, volta ao verde.
- **O verde, medido:** `./external-engines/conferir.sh` → **895 travas na esteira + 17 no testfit,
  7 passos, `exit 0`**. A lista do CI sem os clones vizinhos foi de 499 para **501**.
  **Conferido aqui, não no GitHub.**
- **Vizinhos:** `git status` limpo nos três, **no mesmo commit em que estavam** — `motor-testfit`
  em `6cf6396`, `urban-create-hub` em `72cfab0`, `urban-scout-tool` em `550a438`, conferido ao fim
  da rodada (§4). Nada foi escrito em repositório nenhum deles; o pedido sai no meu bloco.
