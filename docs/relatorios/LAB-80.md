# LAB-80 · O DESTINO DO QUE SAI — a varredura de custo escopada por destino

**Prompt:** **item 013** / D243 — a proposta que o chat elegeu no item 012 (*"ela é boa, está
certa, e é a **próxima**"*) e depois escreveu como item, **durante esta rodada**. · **Rodada:**
despertador das 06:05 de 10/10/2026. · **Conferido aqui, não no GitHub** (§7).

---

## 0 · A fila e a caixa apontaram para o mesmo item, e quem as reconciliou foi uma conferência

A caixa de entrada esgotou: o último item é o **012**, e todos estão `-FEITO`, conferido **contra
a origem** e não só contra o clone (D238). Pela `COMO_FUNCIONA.md`, caixa vazia é *"não invente
trabalho"* — e eu **não inventei**. O item 012 fechou **elegendo o próximo em texto**:

> **A D243 é o próximo item.** Não comece agora — ela é mudança de modelo de uma varredura de
> segurança, e isso não se faz na mesma rodada de outra coisa.

A proibição era **"na mesma rodada de outra coisa"**, e esta rodada não tem outra coisa. A D243
está na `FILA.md`, que a §1-A chama de **fila oficial** e manda este repositório executar em laço.
*Dormir com um item eleito por escrito seria o disparo em vazio contando uma rodada que tinha o
que fazer.* A conta dos disparos em vazio **não** recebeu esta data, de propósito: esta rodada
teve item.

### E o item 013 chegou DURANTE a rodada, pedindo a mesma D243

Encontrei-o na **conferência da caixa na hora de enviar** — o que o D238 existe para obrigar,
depois de eu, em 09/10, ter relatado uma caixa vazia que já tinha item há 35 minutos. O item 013 é
a D243, com as palavras *"escolha que a casa já fundamentou vence a do chat"*, e traz **três
pedidos que a `FILA.md` não tinha**: as duas réguas lado a lado, a perda declarada e o universo que
reprova se ler menos do que afirma. Os três estão atendidos, no §3-A.

> **Quando a fila e a caixa apontam para o mesmo item, quem reconcilia as duas é a conferência de
> envio — não a sorte.** Sem o D238, o recado desta rodada diria *"a caixa estava vazia"* no mesmo
> minuto em que o item que eu acabara de cumprir estava escrito nela.

---

## 1 · O que estava errado, e quem acusou foi o CRITÉRIO

A trava do vazamento de custo isentava arquivos por uma **lista nominal**. No item 006 eu dei a
essa lista um critério em vez de só um número:

> **O teto sobe quando a regra passa a ser ESCRITA em mais um lugar, e cada entrada nomeia qual
> regra enuncia. Se ele subir sem que uma regra nova tenha sido escrita, o que está errado é o
> DESENHO da lista, não o número.**

**Ele disparou um prompt depois** (D243): o teto foi de **9 para 11**, e as duas entradas novas
eram `docs/relatorios/LAB-73.md` e `docs/relatorios/LAB-74.md` — **relatórios de prompt**, que não
são regra nova: são documentação *sobre* a regra. Uma linha por relatório, para sempre.

---

## 2 · MEDI ANTES DE DESENHAR, e a medição mudou o desenho três vezes

### 2.1 · A causa: a frase que proíbe enumera o que proíbe

Das 11 entradas, **9 arquivos** eram de fato acusados. Lidas as linhas uma a uma, **a acusação
era quase sempre a mesma frase** — a da §4-A, que enumera numa linha exatamente os três nomes que
ela proíbe. Qualquer régua de proximidade a morde, e ela **tem de estar escrita em todo lugar onde
a regra vale**.

> **Lista de isenções que cresce porque a regra está escrita em mais lugares não mede vazamento:
> mede quantas vezes a casa repetiu a própria regra.**

E a saída estava na própria palavra do D243: *"o **valor** citado tem de estar dentro de citação
ou de bloco de código"*. **VALOR, não nome.** Nenhuma daquelas frases traz número; *"a margem de
lucro é 40 %"* traz. É o número na linha que separa **enunciar** de **vazar**.

### 2.2 · Duas isenções estavam MORTAS, e uma nunca tropeçou (D260)

| entrada | acusava algo hoje? | já acusou alguma vez? |
|---|---|---|
| `docs/DECISOES.md` | **não** | nenhuma das 5 regras de nome, em commit nenhum |
| `docs/relatorios/LAB-74.md` | **não** | **nunca**, nas 7 regras, em toda a sua história |

E `LAB-74.md` é **uma das duas entradas que dispararam o critério**. A lista jurava no próprio
comentário que *"cada entrada é um arquivo que tropeçou de verdade, não um padrão que adivinha
quais tropeçariam"*. **Essa entrada foi adivinhada.**

> **Lista de isenções sem revalidação envelhece igual a comentário** (D104). A §7 já cobra isso
> das provas — *"exceção na lista que deixou de precisar ser exceção"* — e a lista do custo não
> tinha a mesma guarda.

### 2.3 · `soOCodigo()` já existia, e eu quase escrevi a segunda (D258)

A régua do `codigo` precisa ler **posição de identificador**: um padrão que *procura* o nome não o
*usa*. Eu ia escrever o varredor — e a casa **já tinha** `soOCodigo()`, em
`src/varredura-de-chamadas.ts`, com o nome idêntico e a lição do D179 escrita ao lado. *Item 009:
**nome novo para coisa que já tem nome na casa é custo sem benefício**.*

O que faltava nela estava **declarado como buraco** no próprio comentário: *"literal de expressão
regular… aqui não vale o preço"*. Para a configuração era verdade; **para o custo não é** — os
nomes do nosso custo moram em literais de regex nus, e por isso a trava **acusava a si mesma em 13
linhas** e comprava a isenção com o próprio nome na lista. Então entrou a **terceira** limpeza da
família, não uma função paralela:

> **`semComentarios()` responde "o texto DECLARA isto?". `soOCodigo()`, "o código FAZ isto?". A
> nova, `semLiteraisDeRegex()`, responde "o código USA este nome?"** — e a pergunta mudou, então
> o preço da limpeza mudou com ela.

Medido: **zero** ocorrências de nome ou valor de custo em posição de identificador, nos **197**
arquivos de código. E a varredura de **chamada paga de IA**, que lia o texto cru e também comprava
isenção na lista, passou a ler o mesmo jeito — **zero, sem isenção nenhuma**.

---

## 3 · O desenho: a pergunta é PARA ONDE a linha vai

Todo arquivo que o git carrega recebe um **destino**, pela **estrutura do caminho** e não por uma
lista de nomes. O destino decide o rigor:

| destino | arquivos | o que é | régua |
|---|---|---|---|
| `tela` | **2** | o que um navegador desenha — só a bancada (§4) | nome **e** valor, no cru |
| `codigo` | **197** | o que roda aqui e nunca é desenhado | nome e valor, em **identificador** |
| `registro` | **219** | `docs/` inteiro mais o `CLAUDE.md` | **só o VALOR** |
| `dado` | **28** | o que entra e o que sai cru, fora de `docs/` | nome e valor, no cru |
| `upstream-intocavel` | **25** | cópia do motor original (§3) | nome e valor, no cru |

**2 + 197 + 219 + 28 + 25 = 471**, o universo inteiro. Partição que não soma não é partição, e há
trava que soma.

**`tela` é "tem um `.html` do lado"**, não um caminho escrito: um `.html` novo em qualquer pasta
traz a pasta para o rigor máximo sem ninguém lembrar de atualizar lista. **`upstream/` vem antes
de tudo**, porque um `.rs` de lá não é código desta casa — e um achado ali é **conflito entre duas
regras da casa** (§3 proíbe editar), não conserto meu. Hoje: zero.

### O resultado que importa

| | desenho velho | desenho novo |
|---|---|---|
| isenções nominais | **11** (e subindo) | **0** |
| a trava se varre a si mesma | não — era a 1ª linha da lista | **sim** |
| achados de vazamento | 0 | **0** |
| chamada paga de IA | 0, com isenção | **0, sem isenção** |

**Das 11 entradas do desenho velho, ZERO precisariam de isenção pela régua nova.**

---

## 4 · O ponto cego bateu DUAS vezes neste prompt, as duas contra réguas minhas

### 4.1 · O `fator` geométrico — o D137 outra vez, um campo ao lado

A primeira versão da régua do valor pedia só `fator` perto de número. Ela acusou **três** linhas,
e as três eram a razão entre **pico e média de uma rampa**: *"fator de 6,7×"*, *"fator de 13,2×"*,
*"um fator de 6 a 13"*. O `margem` desta casa já tinha sido curado desse jeito no LAB-67 — exige
dinheiro na linha, senão é folga da caixa envolvente, em metros.

> **Régua nova nasceu com a doença que a régua velha já tinha curado, um campo ao lado.**

`fator` e `margem` passaram a exigir **número E palavra de dinheiro** na mesma linha. **O buraco
fica declarado:** *"o fator é 3"*, escrito sem dinheiro na linha, **escapa** — e afrouxar para
pegá-lo devolve as três acusações geométricas. Há trava nos dois sentidos.

### 4.2 · A prova publicou as fixtures, e a varredura acusou a prova (D262)

A primeira versão da prova publicava o **texto plantado** da sabotagem. A varredura leu a prova e
**acusou-a em 7 linhas**. Sexta vez da forma do D155 nesta trava. O conserto é a disciplina que o
§4 já impõe ao segredo — *"registro nenhum repete mais de doze caracteres"*:

> **A prova publica o VEREDICTO, não a fixture.** O texto plantado mora no código, que é lido em
> posição de identificador; quem quiser o texto abre `SABOTAGEM` em `src/`.

### 4.3 · E um falso NEGATIVO, que não é acusação e por isso não entra na tabela (D261)

Ao trazer `docs/` inteiro para `registro`, a prova em JSON passou a ser lida pela limpeza de
Markdown — **que tira o que está entre aspas, porque ali aspas são citação**. Em JSON **toda chave
está entre aspas**: `"custoMedido": 0.012` seria apagado junto com o resto, e um vazamento de
verdade passaria em silêncio.

> **A limpeza certa para Markdown é a cegueira certa para JSON.** O D179 ensinou que *a pergunta
> decide a limpeza*; aqui é o **formato**. É a espécie de falso negativo do D164 — zero de régua
> cega é indistinguível de zero de árvore limpa.

O registro passou a ter **duas leituras por formato**, com trava que prova a cegueira: a mesma
linha é pega como `dados` e escapa como `markdown`.

---

## 3-A · A FRONTEIRA DO ITEM 013, e a prova mais forte da premissa saiu da própria entrega

O item 013 — que o chat escreveu **durante esta rodada**, elegendo a mesma D243 — põe uma fronteira
que não deixa escolha:

> *"Mudança de modelo de varredura de segurança **pode encolher o que ela vê**. Então a entrega
> traz as duas medições lado a lado… e o que deixou de ser olhado, com o motivo. Se o conjunto novo
> vê menos em algum ponto, isso sai escrito como **perda declarada** — não como melhoria."*

### As duas réguas, lado a lado, arquivo por arquivo

| a velha acusava | a nova acusa | estava isento por nome? | arquivo |
|---:|---:|:---:|---|
| **22** | 0 | SIM | `tests/vazamento-de-custo.test.ts` |
| **14** | 0 | **não** | `src/destino-do-que-sai.ts` |
| 4 | 0 | SIM | `docs/relatorios/LAB-67.md` |
| 3 | 0 | SIM | `docs/relatorios/RECADOS.md` |
| 2 | 0 | SIM | `CLAUDE.md` |
| 2 | 0 | SIM | `docs/caixa-de-entrada/005-FEITO.md` |
| 2 | 0 | SIM | `src/cobranca-por-uso.ts` |
| 1 | 0 | SIM | `docs/DECISOES.md` |
| 1 | 0 | SIM | `docs/INDEX.md` |
| 1 | 0 | SIM | `docs/relatorios/LAB-72.md` |
| 1 | 0 | SIM | `docs/relatorios/LAB-73.md` |
| 1 | 0 | **não** | `docs/relatorios/LAB-80.md` |
| 1 | 0 | **não** | `src/texto-das-regras.ts` |

**Olhe as três linhas marcadas "não".** São arquivos **desta entrega** — o módulo do modelo, o
relatório que você está lendo e o módulo da leitura. A régua velha os acusaria, e **o desenho velho
teria precisado de TRÊS isenções novas só para esta rodada sair verde: de 11 para 14.**

> **A premissa do D243 não precisou de argumento: a entrega que a conserta seria a próxima a pagar
> a conta dela.** *Uma linha por relatório, para sempre* — e esta rodada traria três.

### As TRÊS perdas, e cada uma sai DEMONSTRADA

O item pede perda declarada. Declarar é pouco: cada perda traz uma **frase concreta**, e a trava
roda **as duas réguas** sobre ela — a velha tem de pegar, a nova tem de deixar passar. *Perda
declarada que ninguém demonstra é perda suposta.*

| onde doía | o que deixou de ser visto | o que escaparia |
|---|---|---|
| `registro` | o **nome** do nosso custo sem número ao lado | *"o multiplicador da família fica no Admin"* |
| `registro` | `margem` perto de dinheiro **sem número** | *"preço com margem"* |
| `codigo` | o nome em comentário, string e literal de regex | `const aviso = "custo × 3";` |

**E a perda do código não é perda nos outros destinos, por desenho:** o valor que uma string de
código escreva num relatório, numa prova ou na tela é varrido **onde ele chega** — `tela` e `dado`
leem no cru, e há trava com o mesmo valor nos cinco destinos.

**E a ferramenta lê a própria prova**, porque a prova está dentro do que o git carrega — então ela
**converge em duas passagens**, e isso ficou declarado nela. É a ordem do D256 com a fonte sendo a
própria prova: *régua que se inclui no universo que mede não erra, ela atrasa uma passagem.* Foi
assim que a terceira ocorrência do D262 apareceu nesta rodada: a prova passou a publicar o
**motivo** de cada perda, o motivo **cita a frase proibida** para explicar por que ela deixou de ser
acusada, e **JSON não tem marca de citação** para protegê-la.

> **As duas formas do registro não podem carregar a mesma coisa:** o Markdown pode citar a frase
> proibida, porque tem como marcar citação; o JSON não tem, e por isso não pode. O texto inteiro das
> perdas mora em `PERDAS_DECLARADAS`, em `src/`, e no §3-A desta página — os dois lugares que podem
> carregá-lo.

**Zero de zero não é aprovação**, e o item cobra isso: a varredura publica **quantas linhas leu em
cada destino** e reprova se um destino tiver arquivo e ler zero linha, ou ficar sem arquivo nenhum.
As linhas lidas por destino saem **na prova**, e não aqui: elas andam a cada edição de um `.md`, e
número que anda a cada edição não se grava em dois lugares (D104). A ordem de grandeza é `tela` em
centenas, `codigo` e `upstream` em dezenas de milhares, `dado` em centenas de milhares e `registro`
em mais de um milhão. A régua disso também é sabotada nos dois sentidos.

---

## 4-A · A RÉGUA IRMÃ tinha a mesma doença, e levar o conserto a ela custou dois erros meus

A trava das **condições de conta** (`trava-de-estrutura.ts`) tinha a **mesma lista nominal**, com
três entradas, e o comentário dela dizia em texto que era *"a mesma classe que trava a lista do
vazamento de custo, e é o objeto da proposta ao chat (D243)"*. **Conserto que não entra em todos
os instrumentos que leem a mesma coisa é meio conserto** (D231) — então entrou.

**Medido, três entradas viraram DUAS:** o `LAB-74.md` é **isenção morta** também aqui, pela segunda
vez na mesma rodada e em listas diferentes; o `LAB-73.md` **fica**, e a `CLAUDE.md` fica.

### Erro meu nº 1: medi com régua mais estreita que a régua medida (D266)

O meu script parava no **primeiro** padrão que casava a linha. A régua medida usa `.some(...)` e
testa **todos**. Na linha 88 do `LAB-73.md` o *"quando compensar"* está entre aspas e dissolve, mas
**`ponto de equilíbrio` está nu** numa célula de tabela. Eu ia publicar *"três a UMA"*.

> **Régua de medição mais estreita que a régua medida dá o número para o lado OTIMISTA** — e o
> lado otimista é o que ninguém confere, porque ele confirma o conserto.

É a **vigésima sétima** do §6, e a primeira de uma **classe nova**: nem régua acusando a si mesma,
nem ponte, nem caminho, nem memória — **instrumento de medição discordando do instrumento medido**.

### Erro meu nº 2: levei METADE da cura (D266, segunda parte)

Troquei o `/^\s*>/` pela `afirmadoNaLinha()` e **perdi a proteção da citação** — que era exatamente
o conserto do item 007. As duas leituras respondem perguntas diferentes:

> **`lugaresDaPagina()` responde ONDE a linha está. `afirmadoNaLinha()` responde o que ela afirma
> DENTRO da linha.** A varredura de custo usa as duas; eu levei só uma.

A fixture que pegou foi uma que eu **acabara de escrever** para reforçar o outro sentido. *A
disciplina de conferir nos dois sentidos pagou dentro do mesmo prompt em que foi aplicada.*

---

## 4-B · E a limpeza da casa COLAPSAVA 422 LINHAS EM 164, em silêncio (D267)

O achado mais caro da rodada, e ele não é meu: é anterior a mim.

O esvaziador de strings da `soOCodigo()` casa de uma aspa à próxima **através de quebras de
linha**, e não sabe que uma aspa pode morar **dentro de um literal de regex**. Aplicado ao arquivo
que declara a própria limpeza — e que escreve uma classe de caracteres com as três aspas —, ele
casava daquela aspa até muito depois: **422 linhas viravam 164**.

**O efeito não era um erro: era cegueira.** A varredura de chamadas deixou de achar o único achado
benigno daquele arquivo — **de 1 para 0** — e um `?? 0` de verdade escrito ali passaria igual.

**Fechá-lo deixou de ser preço e passou a ser correção:** a `semLiteraisDeRegex()`, escrita neste
mesmo prompt para outra finalidade, entra **antes** do esvaziador. Depois: **445 → 443**, e as duas
que faltam são texto de comentário já apagado.

**Quem pegou foi a metade da trava que quase ninguém escreve:** a dos **FANTASMAS** da
`chamadas.test.ts`, que cobra que um benigno declarado **não desapareça**.

> **Lista de achados benignos sem a metade "nenhum deles sumiu" aprova o silêncio.** A metade que
> cobra "nenhum achado NOVO" protege contra defeito que entra; a que cobra "nenhum sumiu" protege
> contra a régua que **para de medir**.

---

## 4-C · Duas coisas que a conta cobrou, e as duas valem registro

**A segunda coincidência casada como invariante, duas linhas abaixo do comentário que a proíbe**
(D264): o `por-lugar.test.ts` conferia `naFila - queAVarreduraDeFraseAlcancou === 1`, que valia
porque `naFila` era 16 **naquele dia** — a mesma doença que o LAB-78 consertara na linha de cima,
escrita pela mesma mão no mesmo prompt. *Consertar uma coincidência não imuniza a função onde ela
estava.*

**A convenção que uma régua lê e ninguém escreveu** (D265): a conta dos disparos classifica uma
rodada como em vazio procurando as palavras `nada`, `vazio` ou `sem item` na coluna *"o que
achou"*. Funcionou em 15 linhas porque **todas as linhas em vazio usaram a palavra "nada"** —
convenção real, nunca escrita. A minha linha das 06:06 dizia *"nada NOVO na caixa"*, a régua leu o
`nada`, e a conta passou a declarar 4 contra 5 medidos. A linha foi reescrita e **a convenção foi
escrita ao lado da régua que a lê**.

---

## 5 · A dúvida que eu resolvi escolhendo, e as alternativas descartadas

**A leitura "esta linha afirma ou só mostra?" tinha CINCO respostas nesta casa** (D259), e eu
contei antes de escrever a sexta:

| onde | o que lê |
|---|---|
| `src/limites-com-sujeito.ts` | `semCitacoes()` — tira a **linha** de citação |
| `tests/moldura.test.ts` | `semRiscadoNemCitado()` — riscado, crase e citação curta |
| `tests/verde.test.ts` | um `semCitacoes` local, só citação curta |
| `src/trava-de-estrutura.ts` | `/^\s*>/` inline |
| `src/texto-das-regras.ts` | `comoARegraSeLe()` — tira o `>` do **meio** da frase |

**Nenhuma das cinco conhecia o BLOCO DE CÓDIGO**, e é ele que guarda os recados — foi o que fez a
varredura acusar o `RECADOS.md` por duas linhas que são recado gravado.

**O que eu fiz:** a leitura que esta varredura precisa mora em `src/texto-das-regras.ts`, com as
que já moravam lá, **e o `semRiscadoNemCitado()` saiu de dentro de `moldura.test.ts` para o mesmo
lugar** — a trava agora o importa, e as travas dela provam a mudança. É a regra daquele arquivo:
*conserto que mora dentro de um teste conserta um teste* (D248).

**O que eu NÃO fiz, e por quê:** unificar as cinco. É mudança em 5 arquivos e nas travas de três
deles, e o item 012 disse em que condição isso não se faz — *"não na mesma rodada de outra
coisa"*. Está na `FILA.md` como **proposta ao chat**, com a contagem.

---

## 6 · Entrega

- **Código:** `src/destino-do-que-sai.ts` (novo), `src/varredura-de-chamadas.ts`
  (`semLiteraisDeRegex`, `soOsNomesUsados`), `src/texto-das-regras.ts` (`lugaresDaPagina`,
  `semRiscadoNemCitado`, `afirmadoNaLinha`), `tests/moldura.test.ts` (passou a importar).
- **Trava:** `tests/vazamento-de-custo.test.ts`, reescrita — **39 travas**, lista nominal **zero**,
  guarda da guarda **por destino e nos dois sentidos**, reprovando pelo nome do destino.
- **Ferramenta:** `bun run lab80`. **Prova:** `docs/provas/LAB-80/destino-do-que-sai.json`.
- **Decisões:** D258 a D267. **§6 da `CLAUDE.md`:** vinte e quatro → **vinte e sete**, com uma
  **classe nova** na partição (instrumento de medição discordando do instrumento medido).
- **A régua irmã:** `src/trava-de-estrutura.ts` ganhou a mesma leitura, e a lista nominal dela foi
  de **três a duas** (D231).
- **A limpeza da casa:** `soOCodigo()` deixou de colapsar arquivo (D267).
- **Vizinhos:** `git status` limpo nos três clones, conferido ao fim da rodada (§4).
- **O verde, medido:** `./external-engines/conferir.sh` → **877 travas na esteira + 17 no testfit,
  7 passos, `exit 0`**, com a prova no navegador carregando o `.wasm` em Chromium de verdade
  (motor 0.4.1, 6 242 nós, 275 quadras). A lista do CI que roda sem os clones vizinhos foi de
  **452 para 483** travas. **Conferido aqui, não no GitHub** — a execução automática segue
  desligada desde 08/10, e a receita de religar é `docs/COMO_RELIGAR_O_CI.md`, dois passos, que
  **não** se executou agora.
