# ONDE PARAMOS

> Para retomar numa nova sessão, diga:
>
> **"leia docs/ONDE_PARAMOS.md e me diga onde estamos"**

**Última atualização:** 07/10/2026 · **Último prompt executado:** LAB-56 ·
**Fila de 07/10 (LAB-53 a LAB-57): 4 de 5. Próximo: LAB-57, o ÚLTIMO. Próxima decisão: D194.**

# 🟢 O DESPERTADOR ESTÁ LIGADO — falta UM prompt na fila

**`trig_01XwSkTLT9zmyprNZcUiWy7f` · `enabled: true`, a cada 60 min no minuto :05.** Reabilitado
pelo chat em 07/10 (a **oitava** vez que ele reabilita em vez de recriar — D112), e o prompt
guardado dele é **meu**, reescrito a cada prompt desde 06/10.

**Ao fechar o LAB-57 a fila esgota**, e então: o **BALANÇO é obrigatório** no
[`relatorios/BALANCOS.md`](relatorios/BALANCOS.md) (§1-B), gravado **junto** do último prompt
e não depois; e o despertador **se DESLIGA, não se apaga** — regra que o chat tornou
permanente em 07/10 e que foi corrigida na `CLAUDE.md` §1-A e na `FILA.md`.

| # | em uma linha | estado |
|---|---|---|
| **LAB-53** | as 36 violações que eram a **minha ponte** | ✅ **07/10** · 128 → **92** · PR #64 |
| **LAB-54** | as 27 `frente` não atribuídas — com a régua **dele** | ✅ **07/10** · **23 motor + 4 régua** · PR #67 |
| **LAB-55** | por que o motor desenha via **sobre** a face que reservou | ✅ **07/10** · a faixa é buraco só para o LOTE · PR #68 |
| **LAB-56** | a correção da **moldura do D159** | ✅ **07/10** · eram **cinco** e um **gerador** |
| **LAB-57** | o resto da varredura do **D178** + a lição das duas perguntas | 🟢 pronto · **o último** |

## ⚠️ E há uma pergunta aberta do chat, registrada e NÃO respondida

Em 07/10, fora da fila: **três sessões mediram "o mesmo" e deram números diferentes** — o
Generate **69** em duas saídas e **103** nas cinco glebas (17 do motor), o Testfit **181**
rodando a esteira do Generate inteira, e este Lab **128** e depois **92**.

**A mensagem do chat chegou CORTADA** em *"disse 181, todas de"*, e a frase **não foi
completada por dedução**. O balanço com a minha ficha completa e **as cinco perguntas que
decidem** está em [`relatorios/BALANCOS.md`](relatorios/BALANCOS.md), §7 (PR #66). A resposta
curta: **os quatro números não são o mesmo objeto** — o meu 92 soma **cinco planos** de
**oitenta e seis** candidatos, um por gleba, o vencedor da nota do próprio motor.

## O que o LAB-56 fez — e o achado é que a frase saía de uma MÁQUINA

**Eram CINCO documentos vivos e UM GERADOR, não os três que eu havia contado** (D191). A
frase saía de `naoSoubeFazer`, em `src/motores/testfit.ts`, e dali ia para a
`COMPARACAO_DOS_MOTORES.md` **três vezes** e para `docs/provas/LAB-19/tabela.json`.

> **Corrigir os cinco documentos e deixar o gerador faria a frase voltar sozinha na próxima
> `bun run lab19`** — a forma do D104 com uma máquina atrás, e nenhuma varredura de documento
> avisaria, porque no instante seguinte à regeração o documento estaria "correto" por um
> ciclo.

*E eu contei três porque lembrei três:* o D185 — **conte a lista, não a memória** — vale para
*quantos lugares*, não só para *quantos lotes*.

**A causa certa, escrita nos cinco:** há **uma** régua e **um** campo que falta. O
`invariantes.ts` do Generate aceita a rua pública existente, tem o campo (`faixaViaPublica`) e
o usa; falta campo no **contrato de motor v1** para declará-la. **Com o limite medido**
(LAB-54): das 29 de Antonina, **11 somem** com o campo e **18 não** — essas 18 estão a 15,7 a
1 805,7 m da face e são do motor. *Dizer que é só o campo que falta seria o erro simétrico.*

**Dois lugares NÃO foram tocados, e é decisão:** o `RECADOS.md` é o arquivo do que **saiu**
para o chat — reescrever recado entregue seria falsificar o registro —, e o `LAB-48.md` é o
relatório que **achou** o erro. Lista fechada, com motivo, e guarda contra exceção fantasma.

**QUATRO defeitos da minha própria trava, neste prompt, e nenhum pelo olho** (D192, D193):
ela reprovou a **minha frase de conserto** (régua não distingue *X* de *não X*); eu usei a
**limpeza errada** das duas que o D179 criou — `soOCodigo()` esvazia string, e a nota do
gerador **é** uma string; varri o **arquivo todo**, e o `INDEX.md` tem dezenas de linhas com
`11` e `18` noutros assuntos; e usei janela de **25 linhas** num arquivo de **uma linha por
relatório**. **Os três últimos eram de ESCOPO** — *o volume era da minha régua, não da coisa*.

**E a guarda da exceção fantasma mordeu dentro do prompt que a usou:** estreitado o padrão, o
`LAB-54.md` deixou de ser acusado e a trava o **expulsou da lista de exceções**.

## O que o LAB-55 respondeu — e é uma ASSIMETRIA

```
sobreposicao   = 0     ← o LOTE respeitou a faixa reservada
via-sobre-lote = 11    ← a VIA não respeitou
```

> **`util` (a gleba menos a faixa) governa onde nasce QUADRA e LOTE. A REDE VIÁRIA recebe UM
> aparo, e ele é contra a DIVISA** (`apararRedeViaria(vias, terreno.perimetro)`). A faixa é
> buraco no domínio do lote e não é buraco nenhum no domínio da via.

**A assinatura, medida:** as **quatro** vias culpadas (duas glebas) têm **as duas pontas a 0 m
do perímetro** e **uma ponta DENTRO de um lote externo**, atravessando a faixa em **4 % a
23 %** do eixo. *Via recortada por `util` pararia na borda interna da faixa, longe do
perímetro* — é a medida que separa as duas explicações. E são **2 de 10** vias, não todas:
como nenhum recorte existe, passa a via que o partido por acaso traçou por ali.

**O segundo andar também se mede de fora:** **zero bulbo de retorno** nas duas glebas ⇒
`pctCulDeSac = 0` ⇒ o `aplicarCulDeSac` (o único lugar que recortaria via por `util`, e só a
**secundária**) **nem rodou**. É o que explica uma via secundária entre as culpadas, ao lado
de três principais, que ele nunca recortaria.

**Mais duas candidatas morreram** (D189). O **corte degenerado** morreu pela **AUSÊNCIA** de
uma violação: se `restante` tivesse ficado inteiro, quadra e lote teriam nascido sobre a faixa
e haveria `sobreposicao` — e ela é **zero**. *Violação que não aconteceu é medição, e o
invariante que ficou calado disse mais que os onze que falaram.* A **via de acesso** morre
**só como mecanismo**: a pior infratora de Antonina passa a **9,6 m** do acesso e eu digo
isso em vez de arredondar; o que a mata é haver culpada longe em toda gleba (86,7 m e
382,5 m) e a pior de todas no controle estar a 382,5 m. **A trava que afirmava demais ficou
vermelha, e a correção foi estreitar a conclusão, não baixar o limiar** (D172).

**O achado contra mim** (D190): li a hierarquia da via no `resultado` **interno** do Generate e
saiu **`null` em 4 de 4** — ela mora na **SAÍDA**. Eu estava a um passo de publicar *"não é
observável de fora"*. Caminho errado que **devolve `null`** em campo que **classifica** vira
frase publicável (D175). **16ª** vez do ponto cego da §6, e a décima pega dentro do prompt.

## O que o LAB-54 respondeu — e o RÓTULO não é o VEREDICTO

**As 27: 23 do MOTOR, 4 da RÉGUA. Nem ponte nem contrato.** Os 23 são lote de miolo —
**0 m²** sobre leito de via e borda a mais de **0,62 m** de qualquer superfície viária.

**O método, e ele serve para qualquer régua de vizinho** (D183): rodar a régua dele responde
*se* ela acusa, nunca *por quê*. A função dele (`_testadaDoLote`) testa o **ponto do MEIO** de
cada aresta contra o contorno das superfícies viárias, com 0,75 m — e numa aresta de 34 m que
encosta só numa ponta, o meio está a 17 m de lá. Então: **mude a AMOSTRAGEM e deixe a função
DELE responder de novo.** Densificar o polígono muda só os pontos que ela testa; quem muda de
resposta é o código dele sobre o mesmo polígono.

```
frente que sumiria com amostragem fina ....... 11
das quais só TROCAM de etiqueta (viram testada)  11
das quais de fato SOMEM .......................... 0
```

**É o achado do prompt** (D184): a frontagem real dessas 11 é de **1,5 a 5,49 m** contra um
mínimo de 10. Eu estava a um passo de abrir um conserto na régua do Generate por *"errar em 11
das 56"* — **ela acerta o veredicto em 11 de 11**, e erra só a mensagem. Virou item de
MENSAGEM na lista para eles, **fora do caminho crítico**. *Medir o SALDO antes de propor o
conserto.*

**A sabotagem pegou a minha precondição pela metade** (D186): deslocar todos os pontos
densificados em 1 cm é uma **translação**, e translação **não muda área nenhuma** — num probe
que mede **distância** até o leito, era o pior erro possível. Agora são duas precondições:
área **e** cada ponto novo sobre a borda original. **Terceira vez em três prompts que a
sabotagem pega o que eu não vi** (D179, D181, D186).

**E a minha própria varredura do LAB-52 reprovou o verde** (D187), com o **primeiro achado
verdadeiro** dela — um prompt depois do dia em que ela fechou com *28 de 28 falso positivo*.
No código novo, `const testadaFina = Number(…)` sem `Number.isFinite`: e `NaN > 0` é `false`,
então um `NaN` classificaria o lote como `motor-sem-via-perto` — **o Lab acusando o motor do
vizinho por um número que não é número**, no prompt cuja tese é não atribuir sem medir.
Consertado estourando, **não** com uma entrada nova em `BENIGNOS`. *Régua cujo primeiro
resultado é 28 de 28 falso positivo não está errada: está sem caso ainda.*

**E uma frase do LAB-48 era FALSA** (D185): *"oito estão a 0,2 m ou menos"* — são **cinco**, e
a lista com os números estava **impressa na linha de cima do próprio relatório**. Corrigida
**riscando** (D161), com a medição ao lado: a régua dele confirma **4 dos 5**, e discorda em
`v12-l469`. É a **15ª** vez do ponto cego da §6, e a nona pega dentro do prompt.

## O que o LAB-53 fez — e o número é 128 → 92

**A ponte escrevia o ALVO sorteado da variante no campo cujo nome é MÍNIMO.** A entrada declara
`testadaMinLote_m = 10` m; o que chegava ao Validator do Generate era **11,70820393249937** m
— o meio da faixa que a minha ida monta —, e ele passava a medir o motor **contra o próprio
alvo dele**, com 2 % de folga: 47 lotes de 316 m² reprovados por **1,94 cm** de déficit
mediano.

**Eram TRÊS campos, não um** (`testadaMinLote_m`, `caixaViariaMin_m`, `faceQuadraMax_m`), e a
regra tem **três saídas**: do contrato; `null` quando o motor **não honra** o limite — publicar
ali o número do contrato seria *inventar obediência* —; e **nunca o sorteado**.

```
LAB-48 (diagnóstico) ...... 128 violações   ← o arquivo de prova ficou INTACTO
LAB-53 (aferição) .......... 92 violações   −36, exatamente as previstas
  as 81 nao-testada ........ os MESMOS 81 lotes, id por id
  as 11 testada que sobram . subconjunto das 47 — 3,56 a 9,59 m contra 10 m declarados
```

**A previsão do LAB-48 bateu nas cinco glebas** (25 · 17 · 4 · 6 · 40), e o contrafactual
*"somem com o mínimo declarado"* foi a **0** — a medição conferindo-se sozinha.

**A sabotagem achou defeito na minha própria trava** (D181): devolvido `faceQuadraMax_m` ao
sorteio, a trava que compara com o valor do contrato **PASSOU**, porque a ida fixa aquela faixa
em `(200, 200)` e o sorteado coincide com o limite. Quem pegou foi a trava **diferencial** —
duas amostras, o limite parado e o alvo em movimento. **Segunda vez em dois prompts que a
sabotagem pega a trava e não eu**: deixou de ser zelo e passou a ser método.

**E a prova do LAB-48 quase foi apagada** (D182): a ferramenta é a mesma, de propósito, e a
primeira rodada sobregravou o diagnóstico que o chat quer comparar com o do Generate.
Restaurada do git; agora **o destino do arquivo sai da medição** do estado da ponte, e a
legenda `ehDiagnostico` deixou de ser texto fixo.

**Honesto, e é do §7:** o `tsc` do pacote `testfit` reprovou a trava nova (um `number | null`
em `toBe`) **depois** de eu já ter rodado o typecheck — eu o rodei antes de escrever o teste e
não de novo. Quem pegou foi **o comando único**, e é para isso que ele existe.

## 📋 O registro de 06/10 — quando a fila foi aberta

### Como ela chegou

**`trig_01XwSkTLT9zmyprNZcUiWy7f` · `enabled: true` em 06/10/2026** — a **sétima** vez que o
chat reabilita em vez de recriar (D112).

**E uma autorização nova, registrada aqui porque é onde o despertador vive:**

> *"REESCREVA você mesma o prompt guardado do despertador, que envelheceu. É seu, e você tem a
> minha autorização para mantê-lo atualizado daqui em diante, sem me perguntar."*

**Feito antes de tudo.** Ele trazia o LAB-47 como *"aguardando"* e dizia *"a próxima é a
D154"* quando já era a D166. Reescrito com a fila nova, as contagens de travas e a própria
autorização dentro dele. **Daqui em diante, manter esse prompt em dia é tarefa minha a cada
fila.**

**Sobre *"que se apaga ao esgotar"*:** o chat pediu isso **e** deu o id deste para reusar. As
duas coisas só convivem com **desligar** — apagar perde o id que ele reabilita desde 03/10
(D112, seis vezes). Desligo e escrevo o motivo; se ele quiser apagado de verdade, é uma linha.

## A fila de 06/10, na ordem que o chat aprovou

| # | em uma linha | estado |
|---|---|---|
| **LAB-48** | o motor **PADRÃO** reprova no Validator nas cinco glebas — **diagnóstico, não conserto** | ✅ **06/10/2026** |
| **LAB-49** | o **detector de prova velha** para LAB-25 e LAB-30 (D156) | ✅ **06/10/2026** |
| **LAB-50** | por que a passagem externa põe lote a **1,8 km** da face entregue (D161) | ✅ **06/10/2026** |
| **LAB-51** | o `conferir.sh` ainda afirma que **não há CI** aqui, falso desde o LAB-38 | ✅ **06/10/2026** |
| **LAB-52** | achado da **Central**: erro de chamada não conferido, e identificador de conta como argumento | 🟢 pronto |

## O que o LAB-51 fez — e a régua nasceu geral

O alto do `conferir.sh`, **o arquivo mais lido do repositório**, afirmava *"Não há CI neste
repositório (não existe `.github/workflows`)"*. **Verdade no LAB-31, falsa desde o LAB-38** —
oito dias, e ninguém viu. A forma exata do D104.

**Duas metades:** a afirmação consertada **com a frase falsa citada e datada** (apagá-la
tiraria do registro a única coisa útil que ela tem), e **a guarda** — *regra sem guarda é
slogan* (D136). Toda linha que **afirma** *"não existe"*/*"não há"* tem os caminhos entre
crases conferidos contra o disco, e o script **tem de nomear o CI**: tirar a mentira não
basta, **silêncio também envelhece**.

**E a régua ia reprovar o próprio conserto** (D177) — o cabeçalho **cita** a frase falsa, e a
citação carrega o caminho que existe. **Quarta vez da sub-família do D137/D142/D155, e a
primeira pega ANTES de escrever a régua.** O `semCitacoes()` tira as citações marcadas, um
degrau acima do `semComentarios()` do LAB-43.

**Sabotagem:** a frase histórica de volta sem a marca derruba **as duas** travas (8 → 6 pass ·
2 fail); e uma afirmação falsa sobre **um caminho qualquer** também — a régua é **geral**.

## O que o LAB-50 respondeu — a faixa é um SEMIPLANO

**A resposta:** o motor tira da face entregue só a **direção** e a **origem**, corta a gleba
pela **RETA INFINITA** que passa por ela, e distribui os lotes pela **caixa envolvente** da
faixa. `rect.maxX - rect.minX` é a largura da **faixa**, não o comprimento da **face**.

**E a prova é a gleba de controle, não o argumento:**

| | `geo-antonina` · 141,8 ha · 20 vértices · côncava | `ensaio-com-testada` · 47 ha · 4 vértices · **convexa** |
|---|---|---|
| perpendicular à RETA | **20,1 m** (teto 32) | **0 m** |
| **ao LONGO** da reta | **1 805,6 m** | **0 m** |
| lotes a ≤ 0,5 m do segmento | 14 de 33 | **51 de 51** |

Numa gleba convexa o semiplano sobre a reta **é** a faixa sobre a face. Em Antonina a reta de
uma face de 180 m **volta a entrar no terreno**, e a faixa vai com ela: os 15 lotes distantes
não estão em outra face, estão **na mesma reta**.

**A hipótese 2 do chat caiu por medição:** a passagem **não** corre o perímetro — 1 face de 20
vértices, 1 de 4.

**E a quarta previsão FALHOU, que é o que rendeu mais** (D174): matou **duas** explicações
minhas para as 11 `via-sobre-lote` — a concavidade (acontece na convexa também, 9 lotes) e o
derrame de meia-caixa (o eixo das vias culpadas está a **0,1 a 0,8 m da reta**, dentro da
faixa). **O porquê fica NÃO ATRIBUÍDO**, com as duas mortas escritas na prova.

**29 das 40 violações de Antonina saem de `reservarFacesExternas`** — o LAB-48 atribuiu ao
"motor" genericamente, e agora têm mecanismo nomeado.

## O que o LAB-49 fez — e o escopo dele sai como número

**A dívida era do LAB-33:** ele criou o detector de prova velha e o deu a **duas** provas; as
do LAB-25 e do LAB-30 ficaram sem e **apodreceram caladas** até o LAB-43 (72 → 74 campos do
inventário; a variante de 33 lotes em Antonina). *Prova que ninguém reconfere é afirmação com
data.*

**O detector mede da FONTE** (D144): inventário recontado do módulo, glebas relidas das
fixtures, contrato de `contratoDasEntradas()`, e **uma** trava rodando o motor — a do
`faceDeRua` de Antonina, ~6 s, com o teto de tempo escrito em 60 s e o porquê ao lado.

```
LAB-25/guarda-da-ponte.json   5/8  alcançadas
LAB-30/guarda-da-ida.json     6/11 alcançadas
TOTAL                        11/19 chaves — e as quatro de fora têm motivo escrito
```

**Provado por sabotagem, e DUAS das quatro são as mentiras históricas** (74 → 72 campos; 33 →
1 228 lotes): **15 pass · 0 fail → 14 · 1, exit 1** nos quatro casos, e 15 · 0 depois de
restaurar.

**E dois achados contra mim** (D172): o escopo deu **9 de 19** e raspou por baixo da minha
própria trava — **consertei medindo mais, não baixando a régua**, o contrário exato do D143;
e eu quase declarei velha uma prova que não está, comparando um número de **7** glebas com
um de **10**. *O conjunto medido é parte do número.*

**A trava não entra no CI sem clones** (roda o motor do Parcelamento, clone privado), então o
número daquele trabalho continua **98**.

## O que o LAB-48 achou — quatro invariantes, QUATRO culpados

```
MOTOR ................ 54  (42 %)
PONTE DESTE LAB ...... 36  (28 %)   ← e eu ia publicar como defeito do motor
CONTRATO/TRADUTOR .... 11  ( 9 %)   ← no Generate
AINDA NÃO ATRIBUÍDAS . 27  (21 %)
```

| invariante | n | de quem é | conserto |
|---|---:|---|---|
| `testada` | 47 | **36 da minha ponte** + 11 do motor | **aqui** + lá |
| `frente` | 56 | 11 do contrato do Generate · 18 do motor · **27 em aberto** | lá · lá · medir |
| `face-quadra` | 14 | do **motor** (hipótese de ponte medida e morta) | lá |
| `via-sobre-lote` | 11 | do **motor**, a passagem externa | lá |

**A resposta à pergunta do chat é SIM, e continua sim:** descontando as 36 minhas e as 11 do
contrato — **37 % das violações** —, **nenhuma das cinco glebas limpa** (25, 17, 4, 6, 29). O
ranking só deixa de nascer vazio com as 54 do motor e as 27 em aberto.

## ⚠️ A DÉCIMA QUARTA vez do ponto cego — e 36 de 128 eram minhas

A entrada declara testada mínima de **10 m**. A minha **ida** monta
`padroes["testada"] = faixa(10 ; 13,4164)` e o motor sorteia o **alvo** da variante —
**11,70820393249937 m**, o meio da faixa. A minha **volta** escreve esse alvo em
`parametrosUsados.testadaMinLote_m`, **o campo cujo nome é MÍNIMO**.

O Validator então mede o motor contra **o próprio alvo dele**, com 2 % de folga, e o acusa por
**1,94 cm** em lotes de 316 m². **Rodando com os 10 m declarados: 36 das 47 somem.** As 11 que
sobram têm testada de 3,56 a 9,59 m e são do motor, de verdade.

> **Campo cujo nome diz MÍNIMO e cujo valor é um ALVO não é um campo errado: é uma acusação
> automática.**

**Não consertado**, de propósito: o chat pediu o diagnóstico antes, para comparar com o do
Generate. O conserto é **uma linha** e está em *"proposto ao chat"*, **com a guarda ao lado** —
senão a regra nasce slogan (D136).

## E uma correção de moldura que já havia saído (D168)

O D159 dizia *"duas réguas discordando"* sobre o lote que faz frente para rua existente. **Lido
o `invariantes.ts` do Generate, elas não discordam:** ele tem o conceito pronto
(`faixaViaPublica`, *"a RUA PÚBLICA, quando existe… corre por FORA do terreno"*) e **aceitaria**
esses lotes. É **uma régua e um campo que falta** — o contrato de motor v1 não tem onde um motor
declare a rua existente, então o tradutor do Generate não tem o que traduzir.

Provado com a geometria **deles**: preenchendo o campo com a função do próprio Generate,
Antonina vai de 40 para 29 — **somem exatamente os 11 lotes que estão a 0 m da testada**. Os
outros 18 estão a 15,7 m até **1 805,7 m**, e esses são o LAB-50.

**A correção dos três lugares onde a moldura saiu** (LAB-45, item 7 do Jonny, nota da tabela)
é **entrega e não diagnóstico**: está proposta ao chat, não executada.

## 📋 O registro de 05/10 — quando a fila anterior esgotou e o despertador parou

> **Histórico.** O despertador foi religado pelo chat em 06/10, com a fila acima. O que segue
> é o registro daquele dia, mantido porque a conferência que precedeu o desligamento é o que
> dá valor à regra.

**`trig_01XwSkTLT9zmyprNZcUiWy7f` · `enabled: false` em 05/10/2026, 04:06 UTC.**

**O que aconteceu, na ordem:** o chat religou o despertador em 05/10 ao mandar a frase
inteira do LAB-47 (a **sexta** vez que ele **reabilita em vez de recriar**, D112); o LAB-47
foi executado e mesclado nos PRs **#56** e **#57**; e **o disparo das 04:05 não achou item
pronto** — os cinco prompts da fila de 04/10 (terceira), **LAB-43 a LAB-47**, estão feitos
e mesclados, e o que resta na `FILA.md` está todo em *"proposto ao chat"*, que por definição
**não se executa**.

É o caso da **D62**, e o desligamento é **desligamento, não apagamento** (D112, ratificado
cinco vezes pelo chat, que mandou reabilitar em vez de recriar). **O chat religa quando
mandar fila nova.**

**Conferido antes de declarar o disparo vazio:** nada pendente — `git status` limpo, os dois
PRs do LAB-47 mesclados na `main` (`f3ebc39`), a branch sem commit à frente da `main`, e
nenhum item *"pronto"* na fila. *Disparo que acorda e não tem o que fazer é desperdício
medido: dos 7 disparos do despertador de 15/09, **4 não tiveram o que fazer**.*

**Uma coisa envelheceu, e fica dita:** o **prompt guardado** deste despertador ainda descreve
o LAB-47 como *"⛔ AGUARDANDO"* e manda pular, e ainda diz *"a próxima é a D154"* (já é a
**D166**). Ele **não engana** — o passo 1 dele manda ler este arquivo primeiro, e este
arquivo está certo —, mas quem o religar com fila nova deve reescrevê-lo. **Não o reescrevi
por mim:** o prompt é do chat, e eu não mexo no que ele guarda sem ele pedir.

**O saldo da fila está em [`relatorios/BALANCOS.md`](relatorios/BALANCOS.md), §4** — pela
§1-B, que o chat ratificou.

## O que o LAB-47 fez — e o estado de hoje tinha um número ruim

**Fase (a), a medição.** Plantados **cinco segredos de formato real** (chave de IA, token do
GitHub, chave da AWS, credencial de banco na URL, senha) num arquivo `src/` **versionado**:

```
VERDE — 7 passos · 401 travas · exit 0 · ninguém acusou
```

E é pior que *"ninguém procurou"*: o `tsc` **compilou** o arquivo (ele está no
`--listFiles`) e o `eslint` nele saiu **0**. A rede do lado do servidor também não estava
lá — medido: este repositório **não tem GitHub Advanced Security habilitada**.

**Fase (b), a varredura.** 13 regras sobre **tudo que o git carrega**, sem pasta de fora e
**sem auto-exclusão** — ela varre o próprio fonte dela, e por isso todo exemplo falso é
montado em pedaços. **Zero falso positivo** em 317 arquivos e 27,8 MB. O teto de **doze
caracteres** é trava, e é **por regra**: prefixo público mostra 12, senha mostra 4.

**A prova nas duas escalas:** 13 de 13 formatos; e **o mesmo arquivo plantado** leva o
comando único de **exit 0 (401 travas)** a **exit 1 (415 travas)**. **A chave foi apagada e
nunca entrou em commit nenhum** — o que importa, porque o histórico é justamente o que a
varredura não vê.

**Dois achados contra mim, os dois pegos dentro do prompt:** o teto de 2 MB que eu mesma pus
**já excluía cinco arquivos e 13 MB** (D164 — *escopo não encolhe por decisão, encolhe por
comodidade*; o que o pegou foi publicar o escopo como **número**, não como prosa); e o
`verde.yml` citava **64** travas num lugar e **83** noutro, **dentro do mesmo arquivo**
(D165).

## 📋 O registro de como o LAB-47 chegou — e por que esperar foi certo

O pedido chegou **terminando no verbo** (*"faça o mesmo teste aqui, escreva"*) e ficou
`aguardando` por um disparo. A frase inteira pedia **duas coisas em ordem**: medir o estado
de hoje e **só depois** escrever a varredura. Eu havia listado as duas leituras possíveis
sem escolher — **adivinhar era meio a meio**, e a metade errada teria entregado a varredura
**sem o número que virou o achado do prompt**.

> **Esperar custou um disparo do despertador. Adivinhar teria custado a medição.**

## A fila, na ordem que o chat aprovou

| # | em uma linha | estado |
|---|---|---|
| **LAB-43** | as quatro provas que declaram `contrato: "2"` quando entrada nenhuma é `"2"` (D146) | ✅ **04/10/2026** |
| **LAB-44** | um **nome só** para cada número do confronto do acesso (D145) | ✅ **04/10/2026** |
| **LAB-45** | as duas fixtures novas **na tabela**, com ela regerada | ✅ **04/10/2026** |
| **LAB-46** | medir **em Antonina as três amostragens** do D148 — **o Jonny quer ver** | ✅ **05/10/2026** |
| **LAB-47** | a chave de IA plantada no código — **e nada procurava segredo na árvore** | ✅ **05/10/2026** |

## O que o LAB-46 fez — a resposta que o Jonny queria ver, e um erro meu que já tinha saído

| amostragem em `geo-antonina` | sem as faces | com as faces |
|---|---|---|
| 2 variantes · espinha | **0 aceitas** | **1 088** lotes |
| 2 variantes · ortogonal | 1 386 | **1 228** |
| completo, 20 aceitas | 1 386 | **33** |

**O 33 aparece em 1 de 3 amostragens** — a que o Lab publica. **Com a mesma entrega,
fixado o formato em ortogonal, o motor desenha 1 228 lotes**: o partido que o ranking dele
preferiu não usar. Então o 33 **não é esquisitice do terreno**, é artefato de **qual
variante o ranking escolhe entre 20**. E o contrário apareceu na mesma gleba: na espinha,
**sem** a testada **nada passa**; com ela, 1 088 lotes — ali a entrega **viabiliza** o
plano.

**A decisão do Jonny fica mais simples de enunciar, e continua dele:** *a nota deve
preferir o plano de 33 ou o de 1 228?* — porque os dois estão ao alcance do mesmo motor,
com a mesma entrada.

## ⚠️ A DÉCIMA TERCEIRA vez do ponto cego, e a primeira desde o D119 que JÁ TINHA SAÍDO

No LAB-45 eu publiquei — relatório, recado e **página do Jonny** — que os 33 lotes eram
*"todos da beira da rua que já existe"*. **A base era o ID do lote** (`-eN`, o apelido da
passagem externa do motor).

**Medido: 14 de 33 encostam** na testada; 15 estão a **mais de 50 m**, o mais distante a
**1 805,7 m** — o outro canto da gleba. *`-eN` é rótulo; distância é a coisa* (D161).

**Corrigido riscado, não apagado**, no item 7 e no relatório do LAB-45: apagar tiraria do
registro a única coisa útil que o erro tem. O que segue de pé: os 33 são todos da passagem
externa, 29 acusados pelo invariante `frente`, e somam 1,03 ha (~310 m² cada).

---

## O que o LAB-45 fez — as duas fixtures na tabela, e o que elas revelaram

**A tabela e a prova do acesso passaram a SETE glebas.** As fixtures do LAB-40 eram
medidas pelas travas e pela ferramenta dele, **não pela esteira inteira** — e nenhuma das
cinco antigas tem furo, calçada declarada, atração poligonal, acesso em segmento ou
testada fora de Antonina.

**Três travas caíram, e as três estavam certas** (D158): diziam *"as cinco glebas"*, e o
detector de prova velha do LAB-39 compara a tabela com a prova do acesso — **conjunto
diferente quebra a comparação por fora**. A prova do acesso **foi com a tabela**, em vez de
eu afrouxar a comparação para caber a mudança (o contrário do D143).

**Dois números que estavam DECLARADOS e nunca tinham preço** (D159): os **19 `massa`** da
gleba com furo são a **perda declarada** do inventário — *"o furo vira área que o motor acha
livre"* —, e os **47 `frente`** da gleba com testada vêm de o contrato não ter como dizer
*"este lote faz frente para rua que já existe, fora da gleba"*: **51 lotes externos, os 51
com `faceDeRua: null`**, 47 acusados pelo invariante do Generate. ~~*O mesmo lote é "de
frente para a rua existente" por uma régua e "sem frente para rua" pela outra, e as duas
estão certas.*~~ ⚠️ **MOLDURA CORRIGIDA no LAB-56 (D168, D191): não são duas réguas, é UMA
régua e UM campo que falta** — o `invariantes.ts` do Generate aceita *"a RUA PÚBLICA, quando
existe"*, tem o campo (`faixaViaPublica`) e o usa; falta campo no **contrato de motor v1**
para declará-la. **E com limite medido:** em Antonina, das 29, **11 somem** com o campo e
**18 não** (essas são do motor, a 15,7–1 805,7 m da face).

**E ISTO FECHA O D140:** em Antonina o partido que o ranking escolheu tem **33 lotes, e os
33 são externos** — **nenhum no miolo**, 29 acusados por `frente`. A leitura *"produto de
poucos lotes grandes"* **caiu com a medição**: os 33 somam 1,03 ha, cerca de 310 m² cada. O
item 7 do Jonny recebeu isso escrito para leigo, com a tabela das duas leituras, e **a
decisão segue dele**.

---

## O que o LAB-44 fez — um nome só para cada número do confronto

**O defeito era mais sorrateiro que o do D116.** Ali eram duas **montagens** da mesma
conta e os valores divergiram; aqui eram dois **nomes** para a mesma saída, e **os valores
batiam** — nada acusava, porque não havia número errado. Só havia
`amplitudeDoAcesso_pct` na prova do LAB-28 e `maiorAmplitude_pct` na tabela do LAB-19,
nos dois arquivos que o Jonny lê lado a lado.

**Valem os nomes da régua**, e a ferramenta **publica o objeto inteiro, sem renomear no
caminho** — era o renomear ao publicar que criava o segundo nome. A prova foi regerada, e
os dois leitores perderam a tradução que só existia por causa disso.

**E o que não é sobre nome:** a lista virou **DADO** (`CHAVES_DO_CONFRONTO`), porque
**tipo de TypeScript não existe em tempo de execução** — e era disso que o defeito
precisava para sobreviver num arquivo **publicado**. Hoje a guarda confere as chaves do
JSON contra a lista, e uma trava de tipo impede que lista e interface divirjam: se uma
mudar sem a outra, **não compila**. **Provado por sabotagem:** chave renomeada na prova →
31 verdes viram 2 vermelhas.

**Dois disparos do despertador caíram no meio deste prompt** (21:05 e 22:05), e os dois
foram atendidos pela regra de sempre: *termine o prompt aberto antes de começar outro.*

---

## O que o LAB-43 fez — a etiqueta do contrato sai do medido

**Quatro provas declaravam `contrato: "2"` e entrada nenhuma do repositório é `"2"`.** O
conserto é de **causa**: `contratoDasEntradas()` tira a versão **das entradas que a
ferramenta mede**, mora num lugar só, e **reprova conjunto misto** em vez de eleger a
primeira. As quatro provas foram regeradas e dizem **`"1"`**.

**A guarda é sobre a FERRAMENTA** — conferir a prova exigiria saber quais glebas ela mediu.
São sete travas, e a que impede o apodrecimento é a lista das **treze** ferramentas antigas
que ainda escrevem literal: **cada valor tem de ser igual à versão que todas as entradas
declaram**, então uma entrada `"2"` nova faz cada caso virar decisão (D118 proíbe regerar
prova congelada para consertar etiqueta).

**A régua errou primeiro, e é a DÉCIMA SEGUNDA vez** (D155): ela reprovou o arquivo que eu
**acabara de consertar**, porque o comentário do conserto **citava** o defeito. Terceira
vez da mesma sub-família (D137, D142, esta). *Comentário é onde um nome significa "eu estou
falando sobre", não "eu faço".*

**E a regeração revelou DUAS PROVAS VELHAS e caladas** (D156): a do LAB-30 desde o LAB-40
(inventário de 72 para 74 campos) e a do LAB-25 desde o LAB-37 (em Antonina a variante
escolhida virou a de 33 lotes). **Nenhuma das duas tem detector de prova velha** — o
LAB-33 deu detector só ao LAB-23 e ao LAB-28, e as duas estão propostas ao chat. Com elas
veio um número que **não atribuo sem medir**: a ponte publica `faceDeRua: null` nos 33
lotes e a régua do Generate mede 5.

---

## ⛔ O LAB-47 está travado, e o motivo é de uma linha

O pedido do chat **termina no verbo**: *"faça o mesmo teste aqui, escreva"*. Não executo
instrução lida pela metade — adivinhar o que foi pedido é exatamente o defeito que a §6
cataloga. **Dois pedidos ao chat:** reenviar a frase inteira, e confirmar a numeração (ele
o chamou de "LAB-44", mas esse número já é o do nome único do confronto nesta fila; ficou
**LAB-47**, o próximo livre).

**E nada foi escrito:** nenhuma chave, de nenhum formato, entrou em arquivo deste
repositório.

## A §1-B ficou, ratificada pelo chat

*"A regra fica — arquivo que depende de alguém lembrar é o defeito que você mesma
catalogou."* A seção do `CLAUDE.md` e a guarda dela seguem como estão.

---

## O que o LAB-42 fez — o balanço ganhou arquivo

**O prejuízo que ele fecha foi medido:** o balanço de 03/10 foi para o chat e **não para um
arquivo**; no dia seguinte a lista dele teve de ser **re-derivada** com uma varredura
inteira do `CLAUDE.md` — e ao ser recuperada era **cinco linhas, não quatro, e duas estavam
falsas** (D136, D137).

**O [`relatorios/BALANCOS.md`](relatorios/BALANCOS.md) tem duas partes, e a divisão é a
lição do D116:** o §1 guarda os balanços que foram **só para o chat** — transcritos, ou
**reconstruídos com etiqueta de reconstrução e a fonte de cada linha** —, e o §2 é
**índice** dos que já moram num recado, porque copiá-los criaria a segunda montagem. O §3
já traz o saldo desta fila.

**E o arquivo registra o que o balanço ERROU:** o de 03/10 dizia *"quatro regras sem
teste"* quando eram **cinco, e duas eram slogan**. *Balanço recuperado se confere, não se
obedece.*

**A regra é a §1-B do `CLAUDE.md`**, ao lado da do RECADO. O chat ordenou o **arquivo**; a
regra é o que o mantém alimentado — sem ela ele volta a depender de eu lembrar, que é a
forma do D104. **Se o chat preferir sem ela, é uma seção a remover.** Tem guarda: 6 travas
no `balancos.test.ts` e 1 no `regras.test.ts`, **provadas por sabotagem**.

**O achado do caminho** (D153): pôr o teste novo na lista do CI levou o número de travas
protegidas de **64** a **76** — e ele estava **à mão em quatro arquivos**. *Número com
quatro casas envelhece em três delas.* Ganhou trava de concordância, e a **primeira versão
dela reprovou por defeito dela mesma**, casando por uma das frases em vez do número (a
forma do D137). Os números **históricos** não se mexem: recado antigo reescrito falsifica o
registro.

---

## O que o LAB-41 fez — a ausência da ortogonal tinha causa

**A pergunta do chat era binária e a resposta não é nenhuma das duas.** A candidata
ortogonal do Generate **produz plano** em todas as posições de acesso; o plano é recusado
pelo **contrato do próprio Generate** porque a **via sai da gleba** — de **2,97 a 83,49 m**
além da divisa, a culpada sendo a `VP-01` (a principal, a que nasce no acesso) em 6 dos 9
casos. **A recusa não é régua minha.**

**Seis hipóteses morreram, cada uma com a medição que a matou:** ponto de acesso fora da
divisa (0 a 3 × 10⁻¹⁴ m — era a mais importante de matar, porque seria defeito do Lab),
limite do terreno (a **espinha** entrega em **11 das 12** posições recusadas), defeito
geral da ortogonal (**36 pontos** de controle em três glebas, todos aceitos), gleba
côncava (Antonina tem 11 vértices reflexos e aceita 6/6), preenchimento do retângulo
envolvente (43 % em Antonina, aceita), e os percentuais de APP e lazer (os mesmos metros,
dígito por dígito).

**O diagnóstico que fechou é de uma linha:** uma restrição de **100 m² posta FORA da
gleba** — que não desconta área útil nenhuma — leva `sintetico-50ha-ondulado` de **1/6 a
6/6** e `sintetico-10ha-plano` de **3/6 a 6/6**.

> **A ortogonal toma outro caminho quando `restricoes` está vazio, e nesse caminho a via
> não é aparada pela gleba.**

**Mecanismo provável, lido no código deles:** a `VP-01` nasce do **retângulo envolvente**
da massa, e numa gleba que não é o próprio retângulo uma reta de ponta a ponta na
coordenada do acesso sai do polígono. **O que não foi medido** vai dito: a linha que apara
a via no caminho com restrições é deles.

**Seis itens numerados para o Generate** no §5 do relatório, com reprodução e teste de
regressão barato. **Nada escrito no vizinho** — só leitura, e os três clones ficaram limpos.

**A razão está colada ao número na página do Jonny**, debaixo dos dois quadros afetados, e
os relatórios LAB-28 e LAB-34 ganharam o aviso: eles publicavam a ausência **sem causa**.

**E o prompt pegou um defeito de MÉTODO meu** (D151): 21 pontos no acusado contra 6 no
controle, e eu ia escrever *"só as sintéticas falham"*. **Controle que recebeu menos
medição que o acusado não é controle: é alívio.**

---

## O que o LAB-40 fez — as fixtures que exercem as promessas

**O número que sobrevive ao prompt:** das **60** promessas dos dois inventários da ida, as
que **gleba nenhuma** exercitava eram **6** e hoje são **0** — e há trava varrendo as dez
glebas do repositório, nas duas direções. As entradas montadas **em memória** do LAB-35
viraram **duas fixtures em disco**, em `docs/fixtures/glebas-que-exercem-as-promessas/`,
nascidas de `ensaio-47ha` **a uma variável de distância** (D149).

**O primeiro achado veio antes da primeira medição** (D147): a fixture fez a guarda da ida
**reprovar** `acessos[].segmento.a` e `.b` — dois campos sem destino escrito desde o
LAB-30, numa regra que existia e **nunca falou**, porque *campo que gleba nenhuma traz não
existe para a guarda*. Cega por cinco prompts.

**A testada fora de Antonina** muda as três coisas que podiam carregar o resultado: face
**1**, **587,5 m**, linha **0,5 m fora** da divisa. `facesLoteamento = [1]`, face coberta a
100 %, toque de vértice a 0 % (em Antonina era 3 %).

**E a §6 pegou a DÉCIMA PRIMEIRA vez, dentro do prompt** (D148). Eu ia publicar *"aqui a
entrega da testada não custa lote — 599 → 640"*. Nas três amostragens o sinal **muda**:
−40, −4, **+41**. A causa não é o motor: *"espinha, posição 1"* **não é a mesma variante**
num conjunto de 2 e num de 20 — **680 contra 599 na mesma gleba sem as faces**. **Estável
é a frente** (0 → 51 lotes virados para a rua existente), não o total.

> **Posição no ranking é rótulo. Rótulo não é identidade.**

O item 7 do Jonny recebeu a medição nova **com a ressalva**: o 33 contra 1 228 continua
sendo estranheza de Antonina, e eu **não** afirmo que é caso único, porque não medi o mesmo
lá. Medir as três amostragens em Antonina está *"proposto ao chat"*.

---

## O que o LAB-39 fez — a trava que comparava duas provas passou a MEDIR

A última das sete travas que leem `docs/provas/` e que o **D131** reprovou. Ela dizia *"a
tabela do LAB-19 e a prova do LAB-28 trazem os mesmos números"* — e falhava **nas duas
direções**: falso verde porque as duas saem da **mesma** fórmula (erradas do mesmo jeito,
erram juntas) e falso vermelho porque regerada **uma** e não a outra ela ficava vermelha
**sem nada estar errado**. Era essa a *"trava que se repete"* do chat.

**Agora cada arquivo é conferido contra o `porPosicao` dele:** o agregado publicado tem de
**seguir** dos números crus que o próprio arquivo carrega. **40 agregados, 10 confrontos,
240 posições cruas, 0 divergências**, em menos de 10 ms, **sem rodar motor nenhum** —
medir ao vivo seriam 240 rodadas com Validator e Judge.

**Provado por sabotagem** (D144): o `entreOsMotoresDeLote_pct` de `completo` trocado de
29,12 para **70** — o número errado que o D116 publicou — leva a suíte de **30 verdes a 3
vermelhas**, e o arquivo foi restaurado.

**Dois achados, os dois da família do D116:**

- **a MONTAGEM do confronto também morava em dois lugares** (D145), com a lista dos
  motores de lote em **duas grafias**. *Trazer a fórmula para um lugar só não basta: a
  montagem também é a conta.* `MOTORES_DE_LOTE` e `confrontoDoAcesso()` passaram para
  `src/acesso.ts`, e a montagem única **reproduz os 10 confrontos publicados sem regerar
  nada**;
- **quatro provas declaram `contrato: "2"` e nenhuma entrada do repositório é `"2"`**
  (D146). A guarda do §7 confere que a chave **existe**, nunca que ela **corresponde ao
  medido** — a forma do D137 um degrau acima. **Não consertado** (§1-A): virou **LAB-43**,
  proposto ao chat, com o valor certo nomeado no D146.

---

## O que o LAB-38 fez — o CI, e o que ele não pode rodar

**O levantamento mudou o formato da resposta.** O verde completo lê **dois clones
vizinhos** por caminho (a exceção medida do D16): `motor-testfit` e
`urban-create-hub-41d93a4d`. **Medido: este repositório é PÚBLICO e os dois vizinhos são
PRIVADOS**, e o `GITHUB_TOKEN` do Actions só alcança o próprio repositório.

**Então o workflow tem dois trabalhos, e os nomes não enganam** (D141):

| trabalho | o que faz |
|---|---|
| `guardas que não precisam dos clones vizinhos (NÃO é o verde)` | roda **hoje, sem segredo**: 114 travas que leem arquivo do próprio repositório — a página do Jonny atualizada, o formato do RECADO, a cobertura do `conferir.sh`, as regras do `CLAUDE.md` — e as de geometria pura |
| `o verde completo (precisa do segredo VIZINHOS_TOKEN)` | **falha com a receita** até alguém criar o segredo (D124): token *fine-grained*, `Contents: Read-only` nos dois repositórios, e a ressalva de que segredo em repositório público é decisão de quem configura |

> **Um CI vermelho por falta de configuração é honesto; um CI verde que não roda o verde
> é a mentira que o D110 custou duas semanas.**

**E a lista do trabalho 1 tem guarda**, porque lista é o que envelhece: o `regras.test.ts`
lê o YAML e reprova se algum teste citado importar dos vizinhos.

**O CI ACHOU UM DEFEITO MEU NO PRIMEIRO DISPARO** (D143): a trava dos clones vizinhos, do
LAB-36, exigia *"pelo menos um clone conferido"* — e no runner não há nenhum, por um
motivo legítimo. **Eu rodei aquela trava dezenas de vezes aqui e ela sempre passou, porque
esta máquina tem os clones.** Era verdadeira sobre um ambiente e falsa sobre outro, e só
um segundo ambiente podia mostrar. É a tese do prompt provada pelo próprio prompt.

---

# A fila anterior de 04/10 — CUMPRIDA, inteira · sete prompts

## Os sete prompts de 04/10, em uma linha cada

| prompt | o que ficou |
|---|---|
| **LAB-31** | "verde" é UM comando, sete passos, provado por sabotagem |
| **LAB-32** | a queda da aderência era o motor **obedecendo** — a régua media outra promessa |
| **LAB-33** | a trava do LAB-23 passou a **medir**; prova congelada virou detector de prova velha |
| **LAB-34** | o aviso foi para **debaixo de cada quadro**: a ordem muda em 3 dos 5 terrenos |
| **LAB-35** | nos 310 avisos havia **4 promessas** que gleba nenhuma exercitava |
| **LAB-36** | eram **cinco** regras sem teste, e **duas estavam falsas** |
| **LAB-37** | a **dívida paga**: a testada de frente entregue, e a D121 estava certa |

**O ponto cego da §6 foi pego CINCO vezes nesta fila** (D128, D133, D135, D137 e o arnês
do D139), e **as cinco dentro do próprio prompt, antes de sair**. A tabela das nove está
no `CLAUDE.md` §6.

## A fila de 04/10 — sete prompts, todos tirados da minha própria lista de dívidas

O chat leu o balanço que pediu fora da fila em 03/10 e **transformou em fila o que eu
tinha listado como "mal resolvido"** — inclusive os erros meus que ninguém tinha
cobrado. A fila por extenso está em [`prompts/FILA.md`](prompts/FILA.md).

| # | em uma linha | estado |
|---|---|---|
| **LAB-31** | "verde" é UM comando que roda tudo, provado por sabotagem | ✅ **04/10/2026** |
| **LAB-32** | a queda da aderência era o motor **obedecendo** — e a sexta vez do ponto cego | ✅ **04/10/2026** |
| **LAB-33** | a trava passou a **medir**, e a prova congelada virou detector de prova velha | ✅ **04/10/2026** |
| **LAB-34** | o aviso ficou **debaixo de cada quadro** — e a pergunta certa era se a **ordem** muda | ✅ **04/10/2026** |
| **LAB-35** | havia: **4 promessas** que gleba nenhuma exercitava — a guarda nunca as verificou | ✅ **04/10/2026** |
| **LAB-36** | eram **cinco**, e **duas eram falsas** — viraram guarda ou se estreitaram | ✅ **04/10/2026** |
| **LAB-37** | a dívida da testada de frente (D121) — tamanho escrito, executar se couber | ⏳ **o próximo, e o último** |

## O que o LAB-37 fez — a última dívida, paga

**O chat mandou:** *"a dívida da testada de frente — mapear a linha para as faces do
perímetro e entregá-la em `facesLoteamento`: escreva o tamanho e execute se couber."*
**Cabia, e caiu dentro.**

A **testada de frente** chega ao contrato como linha, e o motor tem `facesLoteamento`
esperando desde sempre. A ida do Lab nunca entregou — era a **única `divida`** do
inventário, do LAB-30 ao LAB-37.

**O mapeamento, medido:** em `geo-antonina`, a linha de 180 m cobre a **face 0** do
perímetro **a 100 %**; a face 19 encosta nela **a 3 %** — o vértice compartilhado, não a
testada. Daí a **fração mínima da face** ser parâmetro declarado: sem ela a régua
repetiria o D75. A tolerância de 1 m dá o mesmo que 5 m.

**O resultado:**

| | sem as faces | com as faces |
|---|---|---|
| lotes com aresta na testada, em **10 de 10** partidos, nas **duas** glebas | **0** | **14 a 18** |

**A D121 dizia que `respeitaTestadaDeFrente: false` era dívida do Lab e não limitação do
motor. Medido: estava certa.** A declaração virou `true`. **A categoria `divida` está
vazia hoje**, e pagar a dívida **devolveu o alcance** que ela custou: a ida "como era"
passou a ser reprovada pela guarda genérica, o que não podia acontecer enquanto o campo
fosse `divida`.

**Dois achados que não estavam na conta:**

1. **o arnês da guarda media um caminho que não era o caminho** (D139): o `rodarTestfit`
   calculava a coluna vertebral **e** as faces, e o arnês calculava só a coluna. A guarda
   reprovou 6 campos dizendo que a testada não chegava — **certa sobre o que mediu,
   errada sobre a esteira**. Pior que reprovar à toa é medir outra coisa, e a divergência
   nasceu dentro da guarda que existe para impedir isso (D116). Agora há **uma** montagem,
   e trava exigindo que os dois arquivos a citem;
2. **o ranking do próprio motor passou a preferir 33 lotes a 1 228** em Antonina (D140),
   porque a testada validou um partido que antes desenhava zero. **A escolha da variante
   segue sendo do motor** — escolher por mim seria o Lab decidindo —, e o 33 é publicado
   **com a razão colada ao número**, pelo princípio que o chat ensinou no LAB-34.

**E os detectores de prova velha fizeram o trabalho deles:** mudar a ponte invalidou as
provas do LAB-23 e do LAB-28, e as duas acusaram sozinhas. Regeradas, mais a tabela e a
página do Jonny.

## O que o LAB-36 fez — e as duas regras que eram FALSAS

**O primeiro achado é sobre o próprio pedido: a lista das "quatro regras" não existia em
lugar nenhum.** Ela saiu num balanço pedido fora da fila, foi para o chat e **não para um
arquivo**. Então varri o `CLAUDE.md` de novo, regra por regra, com uma pergunta só: *"o
que, hoje, reprovaria se isto deixasse de ser verdade?"*

> **O que vai ao chat e não vai a um arquivo não existe amanhã.**

| regra | estado antes | conserto |
|---|---|---|
| §4 *"não tem interface"* | ❌ **FALSA** — o HTML da bancada do navegador existe desde o LAB-01 | exceção declarada + guarda que conta os HTML |
| §7 *"prova com as quatro chaves **em cada arquivo**"* | ❌ **FALSA em 9 de 32** | vale para prova de **medição**; exceções em lista declarada, em duas classes |
| §4 *"não reimplementa o Validator"* | ✅ sem guarda | guarda |
| §4 *"conserto vem desligado por padrão"* | ✅ sem guarda | guarda |
| §5 *"Testfit é nome interno"* | ✅ sem guarda | guarda |
| §4 *"não escreve em vizinho"* | conferido à mão | **virou teste**, com a conta de clones conferidos |

**Regra que ninguém pode desmentir não é regra, é slogan** — e duas já tinham deixado de
ser verdade sem que nada acusasse.

**A NONA vez do ponto cego** (D137): a primeira versão da guarda do §7 exigia a chave
`"gleba"` **literal** e reprovou **13 de 32** provas. Eu tinha nas mãos *"um terço das
provas do repositório viola a §7"*. **Era a régua, medindo ortografia e não conteúdo** —
há prova que diz `glebas` no plural, e arquivo de SAÍDA que identifica a gleba em
`entrada`, com o contrato dentro do bloco `archilly`. Declarados os nomes aceitos por
conceito, sobraram 9, e aí cada uma era caso de verdade.

**Uma omissão consertada de verdade:** `LAB-30/guarda-da-ida.json` não trazia `semente`,
e a guarda roda os motores — era falta, não exceção.

## O que o LAB-35 achou dentro dos 310 avisos

**Havia caso real, e são quatro.** Dos **68 campos** que avisavam, **21 avisavam em TODAS
as sete glebas** — e aí o próprio diagnóstico fica falso: *"campo opcional que esta gleba
não exerce"* vira **"nenhuma gleba exerce isto"**.

| grupo | quantos |
|---|---|
| ausentes em **algumas** glebas (opcional de verdade) | 47 campos |
| ausentes em **todas**, destino `perda`/`interno` (nada tinha de chegar) | 17 campos |
| ausentes em **todas**, destino `entregue`/`traduzido` | ⚠️ **4 campos** |

**As quatro promessas que a guarda nunca verificou:** `parametros.calcada_m` →
`terreno.padroes`, `atracoes[].geometria.aneis` → `terreno.atracoes` e
`acessos[].segmento` → `terreno.acesso` no Parcelamento, e `gleba.furos` → `gleba.furos`
no Symbios. **Caminho errado numa promessa que ninguém exerce é invisível**, porque a
regra `campo-nao-entregue` só morde com valor no contrato — a forma exata do D119.

**Exercitadas as quatro, com entradas montadas em teste: as quatro se sustentam.** O caso
real não era promessa quebrada, era promessa que ninguém tinha olhado.

**O ruído, partido:** a regra 3 virou duas — `promessa-nao-exercitada` (**99**, o sinal) e
`mapa-velho` (**187**, calado no relatório e gravado na prova). Os 24 restantes eram
entradas de **dívida** em glebas que não trazem o campo, e não há o que confessar se o
contrato não trouxe nada.

**A OITAVA vez do ponto cego** (D135): dos quatro testes, **dois falharam na primeira
rodada e os dois eram o meu teste** — a calçada chega como **faixa** `{min,max}`, e o furo
mora em `terreno.gleba.furos` (no Symbios a gleba é um `Poligono {externo, furos}`). A
segunda me deu nas mãos, por um instante, *"a ida do Lab não entrega o furo"*: acusação à
ponte, publicável, e **falsa**. A regra que as oito ensinam entrou no `CLAUDE.md` §6.

## O que o LAB-34 fez — e a pergunta que o aviso não respondia

**O chat mandou:** *"a tabela comparativa ordena os motores num único ponto de acesso, e
só a seção do acesso avisa que isso muda até 108 % — ponha o aviso onde a ordem aparece,
não escondido."*

**A segunda metade era mais séria que a primeira:** *"varia 108 %"* e *"a ordem muda"*
são afirmações diferentes — um motor pode variar muito e continuar sempre na frente.
Quem lê a coluna `lotes` **ordena os motores com os olhos**, e essa era a pergunta sem
resposta.

| gleba | posições comparáveis | ordens distintas | 1º lugar muda? |
|---|---|---|---|
| `completo` | 4 de 6 | **3** | **sim** |
| `sintetico-50ha-ondulado` | **1** de 6 | — | não há como saber |
| `sintetico-10ha-plano` | 3 de 6 | **2** | não |
| `ensaio-47ha` | **6 de 6** | **1** | ✅ **a ordem aguenta** |
| `geo-antonina` | **6 de 6** | **3** | **sim** |

**A ordem muda em 3 dos 5 terrenos; o primeiro lugar, em 2.** Em `geo-antonina`, na
posição 5, a candidata ortogonal **cai para terceiro**, atrás do Parcelamento.

**Onde o aviso ficou:** debaixo de **cada** um dos cinco quadros, com o que foi medido
naquela gleba; na legenda da coluna `Lotes`; e um apontador na seção do acesso de volta
para os quadros. Há trava exigindo que os cinco avisos **não** sejam o mesmo texto —
aviso igual em todo lugar vira decoração, e um dos cinco é um ✅.

**A SÉTIMA vez do ponto cego da §6** (D133), e a primeira **sem motor de vizinho
envolvido**: minha primeira contagem dava *"4 de 5"* porque incluía posições em que um
motor **não respondeu** — e aí o que muda é um motor sair da comparação, não a ordem.
Conferi também que os seis pontos são os mesmos para os quatro motores, índice a índice,
antes de comparar. Com a conta certa: **3 de 5**. A ausência não foi descartada: sai
contada, nomeada e escrita no aviso.

## O que o LAB-33 fez — e o defeito que virar o sinal não tocava

**O chat mandou:** *"a trava do LAB-23 continua lendo prova congelada em vez de medir;
conserte de verdade, não vire o sinal."* No LAB-30 eu virei o sinal e chamei de conserto;
**o teste continuou lendo um `JSON`**.

**Agora os motores rodam no teste.** Os oito cenários — duas glebas × quatro motores ×
com e sem a via — são medidos no processo, num memo. **Nenhuma asserção sai de arquivo.**

**O defeito de projeto, que é a parte que importa:** *"saída idêntica"* significa **duas**
coisas — *o motor ignora a linha* **ou** *a ponte não a entrega*. Sem separá-las o teste
passa nas duas, e foi a segunda que aconteceu por três semanas (D119). Três travas novas
medem **a ponte**, direto na `idaParaOMotor`, sem motor no meio: no v2 ela lê a
`via_desenhada` sozinha, sem via não inventa `viaManual`, e respeita a linha que recebe
pronta. **É a trava que teria mordido em 13/09.**

**A regra geral que saiu disso** (D131):

> Teste que **lê** prova congelada para responder à pergunta não falsifica: ele
> **repete**. O único uso honesto de um arquivo de prova dentro de um teste é ser
> **comparado** com a medição feita ali, para acusar que o arquivo envelheceu.

Com **varredura nas outras seis** travas que leem `docs/provas/`: cinco são detectores
legítimos, **uma repete** — o teste do D116, que compara duas provas entre si. Está
**proposta ao chat** com o conserto barato descrito, e **não executada** (§1-A).

**O preço, dito em vez de escondido:** a suíte do `esteira` foi de **108 s para 176 s**.
É o custo de o teste responder pelo motor em vez de responder por um arquivo — e o LAB-23
custou dois relatórios publicados com a conclusão trocada.

## O que o LAB-32 achou — e o veredito que o chat pediu

**O chat cobrou:** *"a aderência caiu de 17,4 para 11,2 % depois do conserto do LAB-30 e
você publicou sem investigar."* Publiquei.

**O veredito:** o número novo está **certo como medida e errado como comparação**, e o
culpado tem duas metades — nenhuma é o motor desrespeitando a linha.

| parcela | quanto | o que é |
|---|---|---|
| troca de partido | **2,8 pp** | o ranking do motor trocou `ortogonal` (0,6176) por `espinha` (0,6318): **eu comparei dois desenhos** |
| a via no mesmo partido | **3,4 pp** | ortogonal: 17,4 → 14,0 %. Nenhum dos dez partidos se move mais de 4,3 pp |

**E a segunda parcela é a minha régua medindo outra coisa.** Lido o motor (só leitura),
`viaManual` faz duas coisas: a direção da linha vira o **ângulo base do partido**, e a
faixa dela vira **área bloqueada**. Nenhuma é assentar eixo na linha. Alinhar o partido
**gira a rede toda**, e girar a rede tira eixos de cima das outras linhas desenhadas —
**a régua lê obediência como queda.**

**As duas promessas, medidas, são cumpridas:**

| promessa | sem a via | com a via |
|---|---|---|
| alinhamento a 10° (ortogonal) | 0,0 % | **72,9 %** — e pente 82,7 %, loop 72,4 %, mioloVerde 70,1 % |
| lotes com o **centro** na faixa | 9 a 20 | **0, em 10 de 10 partidos, nas duas glebas** |

Nasceu `alinhaOPartidoAViaDesenhada`, **medido nos quatro** (os outros três dão
alinhamento idêntico com e sem a via). A varredura do LAB-26 foi de 14 para **15
falsificáveis**, e o registro acusou o campo no mesmo segundo em que ele nasceu (D127).

**A SEXTA vez do ponto cego da §6** (D128), e esta eu peguei **dentro do prompt**: a
primeira versão da régua da faixa contava lote com *vértice* dentro dela, deu "27 → 34"
e eu ia publicar que o motor põe mais lote em cima da linha. **Invasão é o centro** — o
lote que faz frente encosta na faixa de direito.

**Por que o `ensaio` não se moveu e o `antonina` se moveu inteira:** no ensaio a linha
desenhada corre pelo meio do lado maior, que **já é** a direção da caixa envolvente. A
gleba sintética não tinha como mostrar o efeito — mais um argumento para a via desenhada
**por pessoa** numa gleba real (D103).

**Corrigido do que estava publicado:** aviso no alto do LAB-30 e do LAB-17, ressalva na
D120, §1-D no `O_QUE_FALTA_MEDIR_POR_MOTOR.md` (o documento **mudou**, como o LAB-27
manda avisar), e a contagem do LAB-26.

## O que o LAB-31 fez — e o que ele achou de graça

**"Verde" é `./external-engines/conferir.sh`, e agora são SETE passos:** `typecheck`,
`lint` e `test` nos dois pacotes, mais a **prova no navegador** (o `.wasm` do Symbios
carregando em Chromium de verdade). Antes deles, duas guardas: **cobertura** — descobre
todo `package.json` do repositório e reprova se achar um fora da lista (D122) — e a
**precondição do `.wasm`**, que reprova **com a receita** em vez de pular (D124). O
script roda **todos** os passos mesmo depois de um falhar.

**O achado que eu não fui procurar** (D123): a prova no navegador existia desde o
LAB-01 e era **inteiramente manual** — a última etapa era *ler os números na tela*.
Rodou **uma vez, em 10/09/2026**, e nunca mais. Agora a página publica
`window.__prova` como dado e um roteiro Playwright compara com os números daquele dia:
os cinco bateram exatamente (0.4.1 · 6 242 nós · 6 514 arestas · 275 quadras · 193 174
bytes). O `ms` **não** é conferido, e está dito por quê.

**E um defeito do §6 pego pela própria comparação, no primeiro uso dela:** eu escrevi
`r.arestas.filter(a => a.ativa).length` — as arestas são **tuplas** `[ia, ib, tipo]`, e
a prova teria publicado **0 arestas em silêncio, para sempre**, como se fosse medição.

**A sabotagem que o chat pediu** (D126): um teste quebrado de propósito em cada frente
→ `exit 0 → exit 1`, com **quatro** passos nomeados — o `lint` do `esteira` caiu junto,
de graça, porque a sabotagem deixou um import sem uso. Três arquivos restaurados e
conferidos.

**O que o comando NÃO faz, dito em vez de suposto** (D125): **não há CI neste
repositório**. Nada roda o `conferir.sh` automaticamente; quem o roda sou eu, antes do
commit. Criar o CI está em *"proposto ao chat"*.

## O que espera decisão do chat

1. **o CI** (D125) — sem ele, "verde" é *"verde quando alguém lembra"*;
2. **a pergunta ao Parcelamento** (LAB-29): o `MOTOR_VERSAO` deles está em `1.0` e o Lab
   agora **depende** dele. Entre o T00-A e o T05 o desenho mudou de forma visível ao
   Generate pelo menos duas vezes;
3. **a via desenhada por PESSOA, numa gleba real** (D103) — a linha das fixtures é
   geométrica, desenhada por mim.

> A **dívida da testada de frente** (D121) saiu desta lista: virou o **LAB-37**.

---

# A fila de 03/10 — CUMPRIDA, inteira · dez prompts

## Os doze prompts de 03/10, em uma linha cada

| prompt | o que ficou |
|---|---|
| **LAB-21** | a rampa por trecho e cruzamento; os 161 % do LAB-18 eram a discretização do motor |
| **LAB-24** | o bloco de terreno: 30 % no lote reprova, 15 % na rua só avisa |
| **LAB-22** | a lacuna da rampa era da ponte do Lab, não do motor |
| **LAB-23** | a via desenhada medida contra as vias dos motores — **conclusão corrigida pelo LAB-30** |
| **LAB-25** | a guarda da SAÍDA, que achou o `faceDeRua` descartado em 110 de 110 lotes |
| **LAB-26** | a varredura: 3 capacidades sem experimento, e a suíte do `testfit` vermelha há duas semanas |
| **LAB-27** | o documento vivo, com os dois achados que são do vizinho |
| **LAB-28** | a sensibilidade ao acesso: **+108 %** em lotes só mudando a entrada |
| **LAB-29** | a identidade do contrato passou a ser a que o motor publica |
| **LAB-30** | a guarda da IDA, e a **quinta** vez do ponto cego — a primeira já publicada |

**O ponto cego da §6 foi pego cinco vezes nesta fila** (D104, D114, D116, D119 e a
régua de `parametros` do LAB-30), e **três delas eram réguas minhas acusando a si
mesmas**. A tabela das cinco está no `CLAUDE.md` §6.

## ⚠ O que o LAB-30 achou, e o que foi CORRIGIDO do que já estava publicado

**A quinta vez do ponto cego da §6, e a primeira que já tinha saído para o chat**
(D119): o motor do Parcelamento tem `viaManual` — *"coluna vertebral desenhada à
mão"* — e **a ida do Lab nunca o preencheu**. Entregando a via:

| gleba | sem a via | com a via |
|---|---|---|
| `antonina-com-via` | 25 vias, 1 386 lotes | **32 vias**, 1 379 lotes |
| `ensaio-com-via` | 12 vias, 599 lotes | 12 vias, **585 lotes** |

**O LAB-17 e o LAB-23 publicaram que o MOTOR ignorava a via desenhada.** Quem a
ignorava era a ponte. Os dois relatórios ganharam aviso no alto, a **D101** ganhou a
ressalva (*prova por diferença só vale se a diferença chegou ao motor*), e a trava do
LAB-23 foi **virada** — ela lia a **prova congelada** em vez de medir, e por isso não
mordeu.

**"Respeitar a via" eram duas perguntas** (D120): ele **lê** (a saída muda) e **não
assenta** (aderência 11 %). Separadas em `leViaDesenhada` e `respeitaViaDesenhada`.

**Nasceu a DÍVIDA DECLARADA** (D121): a testada de frente tem `facesLoteamento`
esperando no motor e a ida não entrega. Não reprova, **é publicada**, e enquanto durar,
`respeitaTestadaDeFrente: false` é dívida do Lab e não limitação do motor.

## O que o LAB-29 fez

**As duas etiquetas de identidade eram minhas** (D117): a SAÍDA dizia
`nome: "motor-testfit"` (o nome do **repositório**) e `versao: "T00-A+espinha"` (o nome
de um **prompt do Lab**). O motor publica as duas, em `contrato/tipos.ts`. Agora são
**importadas**, e a separação é o coração do conserto:

| campo | de quem é |
|---|---|
| `motor.nome`, `motor.versao` | **do motor** — importados |
| `archilly.origem` | **do Lab** — quem rodou |

Enquanto a etiqueta do Lab morava em `motor.versao`, ela **tinha** de envelhecer: o
motor foi ao T05 e o campo continuou dizendo T00-A.

**O Symbios é WASM de Rust e não tem o que importar:** a constante é citada ao
`upstream/VERSION` e **um teste lê aquele arquivo**. Intocável não quer dizer ilegível.

**O rótulo na mesa do Generate:** `externo · laboratorio-de-parcelamento v1.0+espinha`.

**As provas congeladas não foram regeradas** (D118) — são registro de uma medição
daquele dia. Em lugar disso há [`provas/LEIA-ME.md`](provas/LEIA-ME.md), com teste
exigindo que ele exista e explique a etiqueta antiga.

## O que o LAB-28 mediu, e a manchete que ele derrubou

**O número que eu havia dado ao chat era PEQUENO.** Eu disse 19 %, de dois pontos.
Com **seis pontos por comprimento de arco** no perímetro:

| gleba | quem varia mais | lotes | amplitude |
|---|---|---|---|
| `completo` | Generate espinha | 860 → 1 791 | **+108,3 %** |
| `ensaio-47ha` | Laboratório de Parcelamento | 459 → 703 | **+53,2 %** |
| `geo-antonina` | Generate ortogonal | 1 346 → 1 941 | **+44,2 %** |
| `sintetico-10ha-plano` | Laboratório de Parcelamento | 112 → 143 | +27,7 % |
| `sintetico-50ha-ondulado` | Laboratório de Parcelamento | 510 → 596 | +16,9 % |

A área vendável acompanha quase exatamente. O Symbios dá **0 %** nas cinco, e é
medição: ele não recebe ponto de acesso.

**A manchete que eu ia escrever era falsa** (D114): *"a entrada pesa mais que a
escolha do motor"* vale em **2 das 5** glebas. A que fica é a que não compara nada —
*o mesmo programa, no mesmo terreno, varia até +108 % só mudando por onde a rua
entra.* **O ponto cego da §6 tem uma irmã:** lá eu ia atribuir ao vizinho um defeito
meu; aqui, à medição uma conclusão minha.

**A amplitude é um PISO** (D113): seis pontos não varrem o perímetro, e a ressalva
viaja **no objeto** (`amplitudeEhPiso: true`), não só na prosa.

## O que espera decisão do chat — três achados, nenhum executado

1. **a sensibilidade ao acesso na tabela comparativa** — é a entrada de maior efeito
   que o Lab mede (19 % em lotes na candidata ortogonal de `geo-antonina`) e nenhuma
   das cinco glebas a mede (D109);
2. **a identidade que viaja no contrato** — ler `MOTOR_NOME` e `MOTOR_VERSAO` do
   próprio motor em vez de etiqueta do Lab. Alcança provas congeladas do LAB-02 e do
   LAB-07 e o rótulo que o Generate mostra na mesa (LAB-26, §3);
3. **a guarda da IDA** — o LAB-25 cobriu motor → SAÍDA; falta ENTRADA → motor.

**Nota dos disparos:** seis despertadores de 03/10 (06:05 a 11:05). Os quatro
primeiros caíram **durante** execução — nenhum foi disparo vazio. O de 10:05 pegou o
LAB-27 com mudança para carregar. **O de 11:05 foi o primeiro sem item pronto, e
desligou o despertador.**

## ⚠ "Testes verdes" mudou de significado (D110)

**O comando é `./external-engines/conferir.sh`**, e ele roda `typecheck`, `lint` e
`test` nos **dois** pacotes (`esteira` e `testfit`). Rodando só o primeiro — como
todo relatório meu fez até aqui —, a suíte do `testfit` ficou **vermelha, 14 de 14,
por duas semanas**, e dois daqueles testes eram as travas do D98 e do D104.

## A fila nova de 03/10 — a guarda contra o próprio ponto cego

| Prompt | Estado |
|---|---|
| **LAB-25** — o teste que reprova quando a ponte descarta campo que o motor publica | **concluído em 03/10/2026** |
| **LAB-26** — varrer as capacidades que o teste de falsificação ainda não cobre | **concluído em 03/10/2026** |
| **LAB-27** — manter o `O_QUE_FALTA_MEDIR_POR_MOTOR.md` e avisar quando mudar | **contínuo · 1ª rodada em 03/10/2026** |

**Três notas de estado, para não refazer trabalho:**

1. **o LAB-26 já está metade feito** — `leRelevo` foi partida em duas no LAB-22
   (D100), com teste para cada. Sobra a **varredura**;
2. **a corda reta das vias curvas fica na V3, sem mexer** (decisão do chat em
   03/10). O fato: a ponte publica cada via como a reta entre as duas pontas do
   eixo (`volta.ts:125`);
3. **a régua de forma** segue como decisão do chat até o Jonny confirmar, e não
   trava nada.

## O que o LAB-23 mediu

**Provado por diferença** (D101): a mesma gleba com e sem a via desenhada, SAÍDA
byte a byte — **idêntica nos oito casos**. Os quatro ignoram, e a declaração
deles é honesta. **O teste fica**, e morde se algum passar a respeitar.

**A resposta depende da gleba** (D102):

| gleba | a linha desenhada | os quatro motores |
|---|---|---|
| `antonina-com-via` (real) | pior trecho **12,62 %**, **zero** m acima de 15 % | 17,09 % a 27,73 % |
| `ensaio-com-via` (sintético) | pior trecho **30,91 %** | 17,56 % a 22,90 % |

**As duas pontas estão em teste**, para a leitura não sobreviver à medição.

**A ressalva que muda a leitura** (D103): **quem desenhou a linha fui eu**, pela
geometria da gleba (D73). Então não é *"a mão vence a máquina"* — é um resultado
**sobre os motores**: uma reta **cega para o relevo** bate os quatro no pior
trecho do terreno real. **Falta uma via desenhada por pessoa**, numa gleba real —
proposto ao chat.

## O que o LAB-26 achou

**Três campos de `Capacidades` não tinham experimento** (D108) — `respeitaAcesso`,
`geometrias` e `versao` —, e o `porta.ts` afirmava **em prosa** que o teste
falsificava todos. Mesmo defeito do LAB-25, uma camada acima. Agora quem sustenta
a frase é `src/porta/experimentos.ts` + dois testes de varredura: **cobertura** e
**existência**.

**A declaração falsa estava num dos três** (D109). O Parcelamento dizia
`respeitaAcesso: false`:

| gleba | acesso movido | lotes |
|---|---:|---|
| `ensaio-47ha` | 992,6 m | **703 → 603** |
| `geo-antonina` | 2 255,3 m | 1 454 → 1 393 |
| `sintetico-10ha-plano` | 504,5 m | **112 → 138** |

A ida dele passa o acesso ao motor desde o LAB-07. **Campo sem experimento é campo
que ninguém conferiu**, e dos quinze era justamente num dos três descobertos que a
mentira estava.

**O pior achado não é de capacidade** (D110): a suíte do pacote `testfit` estava
**vermelha, 14 de 14**, desde que as glebas-padrão do Generate viraram v2 — o
portão da ida ainda gateava `"1"`, gêmeo do D87. Dois daqueles testes eram as
travas do D98 e do D104: **a suíte invisível calou os próprios alarmes.** Três
coisas alargadas numa terra e não na outra, no mesmo prompt (o portão, o `@/*` do
`tsconfig` e o `bun test`).

## O que o LAB-25 fez — e o que a guarda achou na primeira rodada

O §6 me pegou **três vezes no mesmo lugar**, sempre com a mesma forma: o Lab a um
passo de acusar o motor de um vizinho por um defeito do Lab. A pior era a D98,
porque a justificativa estava **escrita num comentário** — *"o motor não calcula
greide"* — e **comentário não se revalida sozinho**.

**A guarda ficou pronta, rodou uma vez, e achou a quarta vez** (D104): a ponte do
Parcelamento escrevia `faceDeRua: null` em **110 de 110 lotes**, atrás do
comentário *"o motor não guarda de QUAL via ela é frente"*. O motor guarda **desde
o T02 dele** — o comentário foi escrito **antes** disso e nunca mais foi conferido.

| quando | o que eu ia atribuir ao vizinho | o que era |
|---|---|---|
| **D75** (LAB-17) | 3 de 4 vias desenhadas no balde errado | régua minha, olhando vértice |
| **D93/D94** (LAB-21) | pico de rampa de 161 % | régua minha, mesmo erro de forma |
| **D98** (LAB-22) | *"o Parcelamento não reporta o pico"* | **a minha ponte descartava a rampa** |
| **D104** (LAB-25) | *nada — eu não vi* | **a minha ponte descartava a via de frente** |

**O desenho da guarda** (D105): inventário de destino por campo
(`atravessa` / `traduzido` / `perda` / `interno`), conferido **contra o motor
rodando**. `campo-vazio` e `campo-novo` reprovam; `mapa-velho` avisa. A
`campo-vazio` **não acredita no inventário** — casa por nome, no objeto devolvido.
E há três testes que **sabotam a ponte de propósito** para provar que ela sabe
ficar vermelha (D106).

**O que o conserto comprou, medido:** o campo descartado concorda com a régua
independente do Generate em **91,5 % a 99,8 %** dos lotes, nas cinco glebas — era
bom. Mas o Generate **recalcula** o campo ao ler, então **nenhum número da tabela
mudou** (regerada; só os tempos de parede). O ganho é de honestidade e de quem lê o
campo: tela, exportação, Orçamento. **Não é ganho de comparação, e está dito.**

**Consequência de encher o campo** (D107): o aparo descarta via que sai da gleba, e
lote apontando para via ausente faz o Generate **recusar o arquivo inteiro**. O
aparo agora apaga essa face e **conta** (`facesApagadas`); na gleba inteira é zero.

## O que depende do Jonny — **um item, e não trava**

Confirmar a **régua de forma** (D79).

## O que vai ao chat

1. **[`O_QUE_FALTA_MEDIR_POR_MOTOR.md`](O_QUE_FALTA_MEDIR_POR_MOTOR.md)** — o
   chat repassa ao Generate e ao Testfit; o LAB-27 mantém e avisa quando mudar;
2. **o formato de indicadores de terreno** (LAB-24);
3. **os dois achados do Geo** (D88): nascente e eixo do curso sem dado;
4. **proposto:** uma via desenhada **por pessoa**, numa gleba real (D103);
5. **proposto:** a **guarda da IDA** — o LAB-25 cobriu motor → SAÍDA; o sentido
   ENTRADA → motor tem o mesmo risco e o mesmo mecanismo serve (LAB-25, §8);
6. **aviso do LAB-27:** o `O_QUE_FALTA_MEDIR_POR_MOTOR.md` **mudou** — §1-A (o
   `faceDeRua` era falta minha, e o número descartado era bom) e §7 (pedido ao
   Generate: avisar quando ele recalcular o campo e divergir);
7. **proposto:** medir a **sensibilidade ao acesso** na tabela comparativa — é a
   entrada de maior efeito que o Lab mede, 19 % em lotes, e ninguém a mede (D109);
8. **proposto:** a **identidade que viaja no contrato** — o motor do Parcelamento
   publica o próprio nome e a própria versão, e a ponte do Lab escreve outros
   (D108, §3 do relatório do LAB-26).

# A fila de 20/09 — a entrega e as duas correções · 20/09/2026

## Em uma frase

**As três perguntas de 20/09 estão respondidas com número:** a peça de entrega
existe e está provada dos dois lados (LAB-06); os quatro motores **ignoram a via
que o urbanista desenha**, e nenhum mente sobre isso (LAB-17); e a régua de
forma parou de dar veredito de urbanista disfarçado de medição (LAB-16).

## A fila de 20/09 — **esgotada**

| Prompt | Estado |
|---|---|
| **LAB-06** — a peça pronta, e o teste de que apagar o Lab não quebra o Generate | **concluído em 20/09/2026** |
| **LAB-17** — duas glebas com via desenhada, os quatro motores, a D69 aplicada | **concluído em 20/09/2026** |
| **LAB-16** — consertar a régua de forma e reprovar as cinco glebas | **concluído em 20/09/2026** |

## O que o LAB-16 mediu

**A régua girada já era do LAB-13** (D63) — os 754 de 776 são o número da régua
VELHA, e a tabela do LAB-13 nunca a usou. O que ainda estava errado:

| defeito | medida |
|---|---|
| o corte de 1 % era meu, e mandava no resultado | Parcelamento em `geo-antonina`: **34 / 15 / 0** nos cortes de 1 %, 5 % e 10 % |
| "irregular" é veredito de urbanista | os marcados eram **trapézios, pentágonos e hexágonos** — esquina, curva, borda de APP |
| o arco de testada curva virava reta | um lote de **49 vértices** passava por retângulo com 10 % de perda |

**Na tabela do LAB-13 nenhum número muda** — a reprovação reproduziu os vinte
valores exatamente, o que é prova a mais de determinismo. **Muda o que a coluna
quer dizer:** o Symbios faz lote **não-ortogonal**, não lote deformado.

## O que o LAB-17 mediu

**Aderência ao traçado imposto** (fração do desenho que cai dentro da caixa de
alguma via da saída), com semente 20260913:

| motor | `ensaio-com-via` 47 ha | `antonina-com-via` 141,8 ha |
|---|---:|---:|
| Symbios Tensor + subdivisão do Lab | 27,5 % | **30,7 %** |
| Archilly Generate · ortogonal | **29,3 %** | 28,0 % |
| Archilly Generate · espinha | 20,5 % | 10,1 % |
| Laboratório de Parcelamento | 11,3 % | 17,4 % |

**Os quatro declaram que ignoram via desenhada, e os quatro ignoram** — a
declaração bate com o medido nas oito linhas. Entre 10 % e 31 % de
**coincidência**, zero de intenção. **Sem recomendação de produto.**

**D69 aplicada:** `VD1 × APP hídrica · 71,00 m` em `antonina-com-via`, marcada
*"desenhada por você — exige licença ambiental"*, com item de custo de
`obra: null` — ponte ou bueiro depende da vazão, que não chega no contrato.

## O que vai ao Generate — **pelo chat, não por commit**

1. [`entrega/registro-de-motores/`](../entrega/registro-de-motores/) — a peça,
   com `README.md` de instalação para o **GU-03**;
2. [`CONTRATO_MOTOR_UNIFICADO_v1.md`](CONTRATO_MOTOR_UNIFICADO_v1.md) — a porta;
3. **os três pedidos ao contrato v1:** um **tipo próprio para via desenhada à
   mão** separado de `via_existente`, `rampaMaxima_pct` por via na SAÍDA, e
   **`app_nascente` com o ponto da nascente e a linha do curso** (§10.5 do
   contrato). O terceiro o chat já repassou.

## Os dois achados que estão na mesa

**Em `ensaio-47ha`, o motor que a D68 põe como PADRÃO é justamente o que o
Validator REPROVA** — 16 violações —, enquanto os outros três entram no ranking.
A peça trata o caso sem quebrar. **O que fazer a respeito é do chat e do Jonny.**

**Sem um tipo para via desenhada à mão, a tela unificada não consegue distinguir
"respeitei a rua que já existe" de "respeitei o que você desenhou"** — as duas
chegam como `via_existente` (D64), e aqui a via desenhada precisou entrar assim,
**como remendo declarado**.

## O que dependia do Jonny em 20/09 — **o segundo item foi respondido pelo chat**

1. Confirmar o **"3× / 1,5 km"** (D61). Ele chegou por referência, não como
   decisão. Segue aberto, e não trava nada;
2. **Dizer quando um lote tem forma ruim** (D76). **Respondido pelo chat em
   02/10** — útil < 85 % é "a conferir", < 70 % é "ruim" (D79) —, aplicado no
   LAB-19 e à espera do OK do Jonny.

## A regra dos 50 m da nascente — **escrita e NÃO APLICÁVEL**

A D69 manda: nascente nunca, raio de 50 m intocável. **Nenhum motor consegue
cumprir**, e a razão está medida: o contrato v1 achata `app_nascente` em
`app_hidrica`, sem o ponto e sem a linha do curso. A regra fica **escrita**
(`RAIO_DA_NASCENTE_M = 50`) **e marcada como não aplicável até o contrato trazer
a nascente** — e **sem aproximação inventada**, que é o que o chat pediu (D74).
Ela sai declarada em toda aplicação da D69, com ou sem travessia.

---

# O complemento à D61, e o LAB-17 que não existe · 20/09/2026

**D69 · Via desenhada à mão é intenção explícita.** O chat complementou a D61: a
rua que o usuário desenha **atravessa a APP sem precisar do critério** —
inclusive desenhada sozinha sobre a APP. **Nascente nunca** (raio de 50 m
intocável), a travessia segue a **mais curta e perpendicular ao curso**, aparece
marcada *"desenhada por você — exige licença ambiental"* e vai como **item de
custo** para o Orçamento.

**Registrado; NÃO aplicado.** O chat mandou aplicar no **LAB-17**, e ele **não
existe** — não há LAB-15, LAB-16 nem LAB-17, o mesmo vão do LAB-09 a LAB-12. Está
na [`prompts/FILA.md`](prompts/FILA.md) como proposto, com o escopo pronto.

**E um achado que trava dois dos quatro itens do LAB-17**, medido:

| onde | a nascente existe? |
|---|---|
| `archilly-terreno` (o formato do Geo) | **sim**, categoria própria |
| importador do Generate | **sim**, `app_nascente`, com rótulo e uso |
| **contrato de motor v1** | **NÃO** — achatada em `app_hidrica` |

**A nascente chega ao motor indistinguível de qualquer outra APP hídrica**, e o
ponto dela não chega. A regra que o Jonny declarou como a mais dura de todas é a
única que o contrato **não deixa cumprir**. Somada ao eixo do curso d'água, que
também não viaja, é a mesma falta: **o contrato v1 perde a hidrografia pelo
caminho.** Pedido ao Generate, no §10.5 do
[`CONTRATO_MOTOR_UNIFICADO_v1.md`](CONTRATO_MOTOR_UNIFICADO_v1.md).

**E o critério "3× / 1,5 km" chegou por referência**, não como decisão: a D61 o
pedia desde 15/09 e esta mensagem o cita como coisa sabida. Gravado com a leitura
mais direta, e **o item segue visível na lista do Jonny até alguém confirmar**.

---

## O próximo passo óbvio: **LAB-06**, e ele não foi executado

A decisão de família (D68) pede **registro de motores, botão liga/desliga por
motor e motor padrão**. O **LAB-06 da fila original** já era, palavra por
palavra, o prompt de entrega disso — e **nunca foi executado**. Está na
[`prompts/FILA.md`](prompts/FILA.md) como **proposto ao chat**: prompt fora da
fila não existe.

**LAB-09 a LAB-12 e LAB-15 a LAB-17 nunca existiram.** A fila original foi de
LAB-00 a LAB-08 e a de 19/09 começou no LAB-13. Não há prompt perdido nos vãos.

## O que espera o chat

1. **Mandar o LAB-06** — ou dizer que ele é do Generate, não do Lab.
2. **O nome do aplicativo de orçamento** — a mensagem de 15/09 cortou em "para o
   Or…", e o destino do item de custo da travessia segue sem confirmação.
3. **O delta contra o Padrão 1.2**, quando ele existir.
4. **As 4 violações** que sobraram em `geo-antonina` — suspeita escrita, **não
   medida**.
5. **As 96 quadras de esqueleto não confiável.**
6. **A quadra dentro de APP** — o recorte do LAB-05 é pela divisa.
7. **Achado para o Geo:** a D61 pede travessia **perpendicular ao curso d'água**,
   e a APP chega como polígono, não como linha.

---

# LAB-13 e LAB-14 — a tela unificada · 19/09/2026

Relatórios: [`relatorios/LAB-13.md`](relatorios/LAB-13.md) e
[`relatorios/LAB-14.md`](relatorios/LAB-14.md) · números crus:
[`provas/LAB-13/`](provas/LAB-13/)

### A tabela, em resumo

Quatro concorrentes (as duas candidatas do Generate contam separadas), cinco
glebas, **uma régua só** — Validator, Judge e `medirSobras`, todos do Generate.
**Determinismo OK em 20 de 20.**

| o que cada um faz melhor | o número que sustenta |
|---|---|
| **Generate · ortogonal** — mais aproveita terreno regular | 75,2 %, 74,6 % e 69,6 % de área privativa nas três glebas de forma simples; sobra em **poucas peças grandes** (7, 14, 30) |
| **Generate · espinha** — melhor acompanha forma difícil | passa a ortogonal nas duas glebas de contorno real: **1 803 × 1 605** e **1 657 × 1 389** |
| **Laboratório de Parcelamento** — menos desperdiça terra | sobra de **0,1 % a 13,7 %** da massa, contra 7 % a 58 % dos outros. **O preço:** é o único com violação do Validator nas cinco (15 a 29) |
| **Symbios + subdivisão do Lab** — o único que lê relevo | e o único com lote que **não é retângulo** (mediana 0,10 a 0,14). Entrega menos lote que todos (14 % a 23 %) |

**Sem recomendação de produto**, como o prompt mandou.

### A porta única

**O motor declara o que sabe fazer, e o que ele declara é conferível medindo.**
Onze campos, cada um com o experimento que o desmente, e **13 experimentos** que
rodam a cada `bun test`. Os quatro motores a implementam.

**E o teste achou dois defeitos que viraram cláusula do contrato:**

- **o Symbios estourava** em gleba sem relevo — *"tem 0 vértices cotados"*. Não é
  defeito: é exigência não declarada, e numa tela comum **motor que estoura
  derruba os outros junto**. Virou `exigeRelevo` e a proibição de exceção (D66);
- **a rampa máxima não existe na saída do v1.** O indicador passou a chamar-se
  `rampaMediaMaxima_pct`, com o nome feio de propósito: ele lembra a falta (D67).

### Dois achados de medição, antes de virarem tabela

- **a régua de forma punia quem gira o lote pela rua**: 754 de 776 lotes da
  espinha marcados "irregulares" sendo retângulos. Com a caixa girada, **84** e
  mediana 0,000 (D63);
- **o aparo estava invertido**: "aparou 99,68 % do comprimento" é o complemento
  de 0,32 %. Ninguém apara 99 % de uma rede e ainda a julga.

---

# A decisão do Jonny sobre a travessia · 15/09/2026

**D61 · Travessia sobre APP é exceção, não padrão.** Transcrita antes de
interpretada, porque é regra urbanística e não é minha:

> o motor tenta primeiro ligar os dois lados **por fora da APP** e só propõe
> travessia se o desvio for desproporcional; quando propuser, **a mais curta e
> perpendicular ao curso**, declarada na tela e lançada como **item de custo
> (ponte ou bueiro)**.

**O que ela fecha:** a D58 tinha registrado que `geo-antonina` fica em dois
blocos porque uma APP hídrica de 14,4 ha corta a gleba, e que ligar os dois era
decisão de urbanismo. Está decidido: **pode**, por exceção e com ônus declarado.
Os 70,4 % continuam certos **enquanto houver caminho por fora**.

**O que ela ainda não permite fazer**, e por isso nenhuma travessia é proposta:

| o que falta | de quem é |
|---|---|
| o limiar de **"desproporcional"** — a decisão não trouxe número | **do Jonny** |
| o **eixo do curso d'água** — a APP chega como polígono, e "perpendicular ao curso" precisa da linha | **do Geo**, via chat |
| o **nome do aplicativo de orçamento** — a mensagem cortou em "para o Or…" | **do chat** |

**D62 · Despertador que acorda e não acha item pronto se apaga.** Antes valia só
para fila esgotada; agora vale também para a fila toda "aguardando". A medição
que a motivou: dos **7 disparos** do despertador anterior, **4 não tiveram o que
fazer** — a sessão ficou ociosa das 02:05 às 06:06 e os avisos chegaram os cinco
de uma vez.

---

# LF-FINAL-2 — a conferência, segunda volta · 15/09/2026

Relatório: [`relatorios/LF-FINAL-2.md`](relatorios/LF-FINAL-2.md)

> ### Conforme, com **um desvio consertado** e **um achado incômodo sobre mim mesmo**.

**O desvio (§9.3).** Classifiquei **cada** `toFixed` do núcleo, em vez de
contá-los juntos: dos 32, **20** são prosa para pessoa (borda, pela D47), **10**
são o `geojson.ts`, que é formato de exportação, **1** é o hash de determinismo,
declarado no próprio arquivo — e **1 era dado que viaja**, o `fechamento` do
esqueleto, arredondado dentro da geometria. Consertado: sai cru, e quem publica é
que arredonda (D59). **Agora são zero.**

**O achado (§1 do CLAUDE.md).** A regra do RECADO — no máximo 12 linhas — nunca
tinha sido medida. Medida: **7 dos 8 recados passaram do teto** (16, 21, 19, 19,
18, 19 e 16 linhas); só o do LAB-05 cabia. **Não reescrevi os sete** — o
`RECADOS.md` é registro do que foi enviado, e encolhê-los faria o arquivo mentir.
Virou **teste**, que mede o último recado a cada `bun test` (D60).

**O que estava em ordem:** os arquivos do §4 todos presentes; **zero link
interno quebrado** em todo `docs/`; decisões contíguas de D01 a D58, sem buraco e
sem repetida; `INDEX` cobrindo todo `.md` de `docs/`; chaves limpas pelo comando
publicado; os quatorze PR na `main`; **zero alterações** nos três clones
vizinhos — e, conferido pela primeira vez, **de quem são os commits deles**: os
14 de `motor-testfit` são da própria sessão dele, nenhum desta.

**A disciplina do §6 rendeu mais três** conclusões erradas desfeitas desde a
primeira conferência, somando **oito** no laboratório: a borda da quadra que era
o eixo (D52), a APP que separa `geo-antonina` (D58) e a régua do "atravessa" com
ponto cego (D55).

---

# LAB-05 — recortar a quadra, descartar a lasca · 15/09/2026

Relatório: [`relatorios/LAB-05.md`](relatorios/LAB-05.md) · números crus:
[`provas/LAB-05/`](provas/LAB-05/) · as saídas para o Generate julgar:
[`contratos/saidas/`](contratos/saidas/)

### A meta, nas cinco glebas

| | `completo` | `50ha` | `10ha` | `ensaio-47ha` | `geo-antonina` |
|---|---|---|---|---|---|
| **vértice de quadra além da folga de 5 cm** | 2 017 → **0** | 708 → **0** | 21 → **0** | 63 → **0** | 2 591 → **0** |
| pior distância fora | 162,79 m → 0 | 114,65 → 0 | 98,04 → 0 | 15,01 → 0 | **170,98 m → 0** |
| quadras recortadas → peças | 74 → 76 | 37 → 37 | 3 → 3 | 5 → 5 | 128 → 129 |
| **não recortaram** | 0 | 0 | 0 | 0 | 0 |
| lascas da D48 | 14 | 0 | 0 | 2 | 17 |
| determinismo | OK | OK | OK | OK | OK |

### O Judge

| | `ensaio-47ha` | `geo-antonina` |
|---|---|---|
| lotes, sem → com o recorte | 181 → **214** | 876 → **1 014** |
| área vendável | 5,59 → **6,61 ha** (14,07 %) | 25,88 → **29,85 ha** (21,06 %) |
| **Validator** | 0 → **0** | 4 → **4** |

**As violações não mudaram.** 33 e 138 lotes a mais, nenhuma violação a mais.

### O item que não era defeito

`geo-antonina` fragmenta a 70,4 % porque a gleba é **cortada em duas por uma APP
hídrica de 14,4 ha**. São **dois blocos** (42 899 m e 17 296 m), não vinte e
cinco pedaços; o menor vão entre eles, 72,45 m, está **200 de 201 pontos
amostrados dentro da APP**. Reconectar é lançar rua sobre APP — decisão de
urbanismo, não minha (D58). **Os 70,4 % são a resposta certa.**

### E o defeito do Lab que a conferência achou

A régua que dizia quem atravessa a divisa amostrava o raio do centróide ao
vértice até `t = 0,9375`: **o vértice nunca era amostrado**. Oito quadras
declaravam estar 100 % dentro estando até **1,49 m** fora (D55). Consertada, e o
recorte passou a **não depender dela** — ele recorta tudo e deixa a interseção
responder (D56). Consequência em número publicado: `geo-antonina` vai de 698 para
701 quadras, e os 213 e 901 lotes do LAB-04, medidos com a régua cega, seriam 181
e 876 pela mesma estratégia.

### O recortador

Greiner–Hormann (1998) reimplementado — as bibliotecas prontas são copyleft ou
trariam dependência npm a um adaptador que não tem nenhuma (D14). A
degenerescência conhecida do algoritmo é **detectada e contornada** deslocando o
anel de décimos de milímetro, e o que não resolver vira **perda declarada**, nunca
peça torta (D57). Nas cinco glebas: **zero deslocamentos, zero perdas**.

---

# LAB-04 — o Symbios passa a fazer lote · 15/09/2026

Relatório: [`relatorios/LAB-04.md`](relatorios/LAB-04.md) · números crus:
[`provas/LAB-04/`](provas/LAB-04/) · as saídas para o Generate julgar:
[`contratos/saidas/`](contratos/saidas/)

### A tabela

| | **Symbios + Lab** | Testfit T02 | Generate `ortogonal` | Generate `espinha` |
|---|---|---|---|---|
| `ensaio-47ha` · **lotes** | **213** (era 0) | 599 | 974 | 776 |
| `ensaio-47ha` · área vendável | 65 936 m² (14,03 %) | 238 190 m² | 353 307 m² | 302 654 m² |
| `ensaio-47ha` · **violações** | **0** | 16 | 0 | 0 |
| `geo-antonina` · **lotes** | **901** (era 0) | 1 391 | 1 389 | 1 656 |
| `geo-antonina` · área vendável | 266 665 m² (18,81 %) | 555 573 m² | 508 581 m² | 617 219 m² |
| `geo-antonina` · **violações** | **4** (0,44 % dos lotes) | 53 (3,81 %) | 1 | 0 |
| determinismo | **OK** nas duas | OK | — | — |

### O oráculo bate, ponto a ponto

Retângulo 60 × 30 → nós em (15,15) e (45,15), offset 15; o L → mais um em
(15,45); as frentes de onda em 5 batem vértice a vértice. É o oráculo de **duas
implementações independentes** do `STRAIGHT_SKELETON_ANALYSIS.md` §4.4, e o
fechamento das faces dá **1,000**. Prova em
[`provas/LAB-04/oraculo.json`](provas/LAB-04/oraculo.json) e em teste que trava.

### O meio-fio não é o eixo — 369 violações ensinaram

A borda de uma quadra do Symbios **é o eixo da rua**: as quadras são faces do
grafo viário. Lote plantado nela deu `via-sobre-lote em 369 de 369 lotes`. O lote
passou a nascer a **meia caixa** do eixo (D52). **É o mesmo erro do LAB-07 com a
calçada (D18)** — e, de novo, quem o pegou foi a régua do Generate, não a
leitura do código.

### Onde o lote se perde, com número

Das 698 quadras de `geo-antonina`: **119 atravessam a divisa** (não loteadas —
é o item 2 do LAB-05), **86 têm esqueleto não confiável** (puladas e contadas,
D51), 334 são estreitas demais, e **159 dão lote**. Mais 3 726 peças descartadas
por área mínima. O aproveitamento das quadras fica em **22 %**: o traçado do
Symbios é orgânico, e quadra pequena e irregular não aceita lote retangular de
360 m².

### Quatro correções, todas cobradas pelo Validator

`via-sobre-lote` 41 → 0 (via de outra quadra passando por cima); o arquivo
recusado por 97 peças fora da gleba → aceito (pular quadra que atravessa);
`faixa-legal` 8 → 0 (o número de fatias preso pelos parâmetros, D53); `frente`
8 → 2 (a pergunta "tem rua?" refeita em cada fatia, D54). **Nenhuma inventou
regra** — área mínima, máxima e testada mínima já vinham da gleba.

---

# LF-FINAL — a conferência contra o Padrão · 14/09/2026

Relatório: [`relatorios/LF-FINAL.md`](relatorios/LF-FINAL.md)

> ### Conforme, com **uma ressalva declarada** e **três arquivos que faltavam**.

**A versão 1.2 não existe.** Procurei nos quatro clones; só há a **Versão 1 ·
13/09/2026**. A conferência foi feita contra ela, e a lacuna está declarada em
vez de trocada em silêncio.

**O que faltava, e foi escrito:** `docs/SEGURANCA.md` (a lista preenchida, com o
comando de prova ao lado de cada linha), `docs/ADOCAO_CENTRAL.md` (por que o Lab
**não** adota — sem conta, sem tela, sem IA) e `docs/referencia/` (para onde foi
a especificação, que estava no lugar errado, e a cópia do Padrão conferido).

**A ressalva:** 17 `toFixed` no núcleo produzem texto — todos em **prosa para
pessoa**. Nenhum número que viaja é formatado. Tirar o `toFixed` da prosa
pioraria a prosa; apertar ou não é interpretação do Padrão, e interpretação é do
chat.

**Chaves: limpo**, conferido com comando. E uma nota de método: a primeira busca
acusou quatro ocorrências que eram todas a palavra *de-**senha**-r*.

**`PENDENCIAS_JONNY.md` foi refeito do zero** e encolheu para **um item**: a
confirmação sobre a calçada.

---

# LAB-08 — os dois motores lado a lado · 14/09/2026

Relatório: [`relatorios/LAB-08.md`](relatorios/LAB-08.md) · números crus:
[`provas/LAB-08/`](provas/LAB-08/) · as saídas para o Generate julgar:
[`contratos/saidas/`](contratos/saidas/)

### `ensaio-47ha` — 47,0 ha, zero restrições

| | Symbios 0.4.1 | Testfit T02 | Generate `ortogonal` |
|---|---|---|---|
| lotes | **0** — não parcela | **599** | **974** |
| lote médio | — | **397,65 m²** | 362,74 m² |
| quadras | **94** | — | — |
| via fora da gleba | 5,21 % → **0 %** | **0 %** | — |
| violações | **0** | 16 | 0 |
| rampa no cruzamento | **77,43 %** | `null` | — |
| **quadro de áreas fecha?** | sim | **sim** | **NÃO — +15,8 %** |
| determinismo | OK | OK | — |

### `geo-antonina` — 141,8 ha, terreno real

| | Symbios 0.4.1 | Testfit T02 | Generate `ortogonal` | Generate `espinha` |
|---|---|---|---|---|
| lotes | **0** | **1 391** | 1 389 | **1 656** |
| quadras | **698** | — | — | — |
| via fora da gleba | 54,57 % → **0 %** | **0 %** | — | — |
| violações | **0** | 53 | 1 | 0 |
| rampa no cruzamento | **113,54 %** | `null` | — | — |
| quadro fecha? | sim | sim | sim | sim |

## O T02 funcionou

| | LAB-07 (T00-A) | LAB-08 (T02) |
|---|---|---|
| recusadas pelo esquema **sem** o aparo | **60 de 60** | **0 de 20** · 2 de 20 |
| quanto o aparo do Lab ainda corta | **25 % a 40 %** | **0,32 %** · 0,17 % |

`pente` chegou a zero violações. `cluster` (77,9 %), `organico` (82,9 %) e
`radial` (100 % dos lotes) continuam quebrados, e `superquadra` continua vazia.

## Os "22 % a menos de lotes": a causa, com número

O número mudou e não é constante: **−38,5 %** em `ensaio-47ha` e **empate**
(1 391 × 1 389) em `geo-antonina`. E o lote do Testfit é **maior** (397,65 contra
362,74 m²) — ele não empacota pior, empacota em **menos terra**: 50,7 % da gleba
contra 75,2 %.

**A última linha explica o resto.** O quadro de referência do Generate em
`ensaio-47ha` soma **544 498 m² numa gleba de 470 000** — 15,8 % a mais do que a
terra existe. Privativa e viária sozinhas já ocupam 90,9 %, sobram 43 002 m², e o
quadro reivindica 117 500 para lazer e APP.

De onde vêm esses dois números? **Do parâmetro, não do desenho:** `areaAPP_m2` é
exatamente 15,0 % da gleba (`pctAPP: 15`) e `areaLazer_m2` exatamente 10,0 %
(`pctLazer: 10`) — e **`ensaio-47ha` declara `restricoes: []`**. O quadro anuncia
7,05 ha de APP numa gleba que não tem nenhuma.

Não é defeito geral: em `geo-antonina` o mesmo quadro fecha ao centavo. Quatro
testes fixam as quatro afirmações. **Daqui não dá para saber** se os lotes estão
por cima da APP ou se a APP não existe no desenho — é uma pergunta, com número,
para o Generate.

## Dois achados novos

- **O Testfit não usa relevo no traçado.** Mesma semente, gleba com e sem
  relevo: 599 e 599; 1 391 e 1 391, lote a lote. O T03 deles diz isso no título;
  a medição independente confirma — e é o que garante que a fixture do LAB-03
  não contaminou a comparação com os números do Generate.
- **O Symbios é o único dos três que entrega greide.** Somado ao achado do
  LAB-02 (o Validator não confere rampa, e o contrato só carrega a média), a
  única informação de greide que existe na família vem do motor que ainda não
  faz lote.

**O LAB-04 virou o próximo passo óbvio do Symbios:** ele entrega 94 e 698
quadras limpas; o que falta para disputar o Judge é subdividir quadra em lote.

---

# LAB-03 — o relevo · 14/09/2026

Relatório: [`relatorios/LAB-03.md`](relatorios/LAB-03.md) · números crus:
[`provas/LAB-03/`](provas/LAB-03/) · fixtures:
[`fixtures/glebas-padrao-com-relevo/`](fixtures/glebas-padrao-com-relevo/)

> ### O defeito de interpolação não estraga a rampa. Ele estraga o **traçado**.

Mesmo motor, mesma semente, mesma gleba, sobre dois mapas de alturas — o
corrigido (produção, desde o LAB-01) e o defeituoso (k = 6 vizinhos, que é o que
o Generate ainda usa).

**A rampa quase não se mexe:** a máxima em cruzamento vai de 269,96 % para
161,38 % na pior gleba, e nas outras duas a diferença é de ruído — com o
defeituoso saindo "melhor" na gleba plana.

**O traçado se mexe muito:** a fração do comprimento de via alinhada a uma única
direção salta de **12,6 % para 47,3 %** e de **11,3 % para 41,5 %**. O motor para
de seguir topografia e **cai em grade**.

E a prova mais limpa está na gleba **plana**, onde o sinal se inverte: ali a
grade é a resposta certa, o corrigido produz 97,2 % dela, e o defeituoso produz
**76,7 %** — ele **inventa sinuosidade** onde não há relevo, porque o traçado
segue a borda dos degraus do bolo de casamento.

| gleba | células sobre valor de curva | gradiente zero | rede alinhada |
|---|---|---|---|
| `completo` | 1,74 % → **35,79 %** | 0 % → **67,76 %** | 12,6 % → **47,3 %** |
| `sintetico-50ha-ondulado` | 0,20 % → **85,00 %** | 0 % → **73,33 %** | 11,3 % → **41,5 %** |
| `sintetico-10ha-plano` | 1,87 % → **49,81 %** | 0 % → **95,49 %** | 97,2 % → **76,7 %** |

*(corrigido → k = 6. Os 85 % e 73 % são exatamente os que o LAB-01 relatou.)*

**Para o Generate**, isto é o argumento que faltava no diagnóstico que o LAB-07
mandou: não é imprecisão de cota, é o traçado deixando de seguir o terreno — e,
em terreno plano, seguindo um terreno que não existe.

## As glebas-padrão ganharam relevo

`docs/fixtures/glebas-padrao-com-relevo/` — poligonal, restrições, acessos e
parâmetros **do Generate, intocados**; só o `relevo` é acrescentado, sintético e
**declarado** no próprio arquivo. O Generate não foi alterado; a proposta de
adotá-las lá está no relatório, para o chat repassar.

| gleba | curvas | desnível | o motor roda? |
|---|---|---|---|
| `ensaio-47ha` | 0 → **163** (5 121 vértices) | 30,07 m | **sim** — 96 trechos, 94 quadras, 0 % fora |
| `geo-antonina` | 0 → **250** (7 322 vértices) | 55,92 m | **sim** — 472 trechos, 698 quadras, 0 % fora |

**O LAB-08 deixou de ser impossível.** Falta só o T02 do outro motor.

**Uma ressalva, e é do recorte:** `geo-antonina` fragmenta muito mais que
qualquer gleba medida até aqui — 25 componentes, só **70,4 %** no maior (o pior
do LAB-02 tinha sido 94,7 %). A causa é a forma dela: 141,8 ha de contorno
recortado com três APP atravessando o meio. Reconectar a rede depois do corte
seria desenhar via que o motor não desenhou, então foi para a fila como proposta
ao chat.

---

# LAB-02 — o recorte · 14/09/2026

Relatório: [`relatorios/LAB-02.md`](relatorios/LAB-02.md) · números crus:
[`provas/LAB-02/`](provas/LAB-02/)

> ### A meta foi atingida: **0 % de via fora da gleba**, nas três glebas.

| gleba | via fora da gleba | via em restrição | contrato |
|---|---|---|---|
| `completo` · 141,8 ha | **37,43 % → 0 %** | **19,55 % → 0 %** | recusado → **aceito, 0 violações** |
| `sintetico-50ha-ondulado` | **38,73 % → 0 %** | — | recusado → **aceito, 0 violações** |
| `sintetico-10ha-plano` | **42,80 % → 0 %** | — | recusado → **aceito, 0 violações** |

**O custo, medido:** a rede encolhe para 43–61 % do comprimento (a parte que
nascia fora da terra do empreendimento) e a conectividade cai pouco — o maior
componente vai de 99,9 % para 97,6 %, de 99,8 % para 98,0 % e de 99,4 % para
94,7 %. **O recorte não estilhaça a rede**, que era o risco que o LAB-01 mandou
conferir.

**Quem bloqueia a rua não é escolha do Lab** (D32): é o campo `desconta` que o
Geo já carimba. Em `completo` isso pegou `app_rio`, `app_declividade` e
`reserva_legal` — 34,4 ha ao todo.

## O achado que sai daqui: ninguém confere a rampa

O LAB-01 decidiu que "a conferência é do Validator". Fui conferir se o Validator
confere. **Não confere:**

- `invariantes.ts` do Generate tem onze tipos de violação, **todos geométricos**
  — nenhuma menção a rampa, declividade ou greide;
- a régua **existe** (`topografia.ts`: 10 % máximo, 12 % tolerado em trecho
  curto), mas roda sobre o plano **interno** do Generate, não sobre a saída de
  motor externo;
- e o contrato só carrega **`rampaMedia_pct`** por via: um pico de 161 % num
  cruzamento é diluído pela média até sumir.

A prova está na própria rodada: as três glebas passaram com **zero violações**
tendo 246, 51 e 1 arestas acima de 10 %.

**Para o chat repassar ao Generate**, duas coisas distintas: a régua de rampa não
alcança motor externo, e o contrato precisa de `rampaMaxima_pct` por via, ao lado
da média. Sem esse campo, nenhuma conferência de rampa é possível sobre o
contrato.

## O outro motor: 44 lotes tocando APP

O aparo do LAB-07 corta pelo perímetro e **não olha para as restrições**. Medida
a melhor variante daquele relatório contra as 3 APP de `geo-antonina`: **894,63 m
de via dentro de APP (4,59 %)** e **44 lotes de 1 429 tocando APP (1,76 ha)**.
Entra na lista do T02 do outro motor; a forma do conserto já está escrita em
`recorte.ts`.

## Duas conclusões erradas desfeitas por medir o "antes"

1. **"O recorte destrói a conectividade"** — a régua ligava só ponta com ponta, e
   a rede **crua** dava 472 componentes por ela. Causa: as cadeias quebram por
   tipo, então uma local termina no *meio* de uma principal. Com a régua certa, a
   rede crua é uma rede só (99,8 % no maior).
2. **"A rampa ao longo da via piorou de 10,01 % para 34,98 %"** — aquela aresta
   sempre teve 34,98 %; ela encostava num cruzamento que o corte levou embora, e
   mudou de balde. Nada piorou.

---

# LF-01 — a casa em ordem · 14/09/2026

Relatório: [`relatorios/LF-01.md`](relatorios/LF-01.md).

Não mexeu em motor nem em medição — arrumou a casa para o laço autônomo rodar
sozinho. O que mudou:

- **`prompts/FILA.md`** virou a fila oficial, com o histórico LAB-00…LAB-07
  preservado no fim.
- **`relatorios/RECADOS.md`** passou a existir: todo recado é acrescentado lá,
  com data. O pedido "me dá tudo desde o dia tal" virou uma leitura.
- **`INDEX.md`** passou a existir (D30): o `ONDE_PARAMOS` estava fazendo dois
  trabalhos, e o índice é o que quase não muda.
- **Três decisões do chat** gravadas em `DECISOES.md` — D26 (a calçada é da via,
  dentro da caixa, nunca descontada do lote), D27 (na tela só entra partido que
  passa no Validator; hoje só o `pente`), D28 (a superquadra vazia é defeito de
  pontuação, não decisão urbanística) — mais D29 (o laço autônomo) e D30.
- **`PENDENCIAS_JONNY.md`** encolheu: as três perguntas abertas viraram
  **duas confirmações**, e o repasse dos achados aos vizinhos saiu da lista dele
  — por decisão do chat, é do chat.

**Uma coisa do LF-01 não saiu como pedido.** A branch
`claude/stoic-ritchie-ijzqy3` deveria ser apagada (o diff dela contra a `main`
era vazio). O proxy de git deste ambiente **recusou a exclusão três vezes** —
ele aceita atualizar ref e recusa apagar ref —, e não há ferramenta de apagar
branch disponível aqui. Em vez disso, ela foi **reposta sobre a `main`**: aponta
para o mesmo commit e carrega zero conteúdo próprio. Ela também precisa existir,
porque é a branch de trabalho das rodadas seguintes. A exclusão literal é um
clique na interface do GitHub, se alguém quiser.

---

# LAB-07 — o motor do Testfit na esteira


**Relatório completo:** [`relatorios/LAB-07.md`](relatorios/LAB-07.md) ·
**números crus:** [`provas/LAB-07/`](provas/LAB-07/)

Terreno no contrato `archilly-motor-entrada` v1 → `idaParaOMotor` → `rodarMotor`
do Testfit → `voltaParaOContrato` → `archilly-motor-saida` → **o Validator e o
Judge do próprio Generate**, importados, nunca reimplementados. Três glebas, dez
partidos de traçado, 20 variantes cada — 60 no total.

> ### Geometria utilizável: **SIM COM RESSALVAS**

**47 variantes julgadas, 28 401 lotes, 4 132 violações (14,55 %)** — e a média
engana, porque o resultado é muito desigual por partido: `pente` 0,06 %,
`diagonal` 1,26 %, `mioloVerde` 1,60 %, `ortogonal` 2,07 %, `espinha` 2,67 %,
`loop` 5,24 %, **`cluster` 77,77 %**, **`organico` 140,11 %**.

### As cinco ressalvas

1. **Nenhuma variante passa no contrato sem conserto** — 25 % a 40 % do
   comprimento de via nasce fora da divisa, e o esquema recusa antes de julgar.
   Todos os números vêm de uma passagem com **aparo feito pelo Lab**, que corta
   **só o eixo das vias** e vem desligado por padrão.
2. **A calçada é declarada e não é reservada.** Medido: o lote encosta a
   `caixa_m / 2` do eixo. Declarar `caixa + 2 × calçada` produziu 441 de 441
   lotes sem frente; declarar a caixa real levou a mesma variante a 15 violações.
3. **Dois partidos quebrados** — `cluster` (2 994 violações de testada) e
   `organico` (165 lotes sobrepostos). `radial` é recusado em 6 de 6.
4. **`superquadra` nasce vazia em 20 de 20**, e o plano vazio lidera o ranking do
   motor com nota 0,366 — pior do que os 11 de 12 que o próprio Testfit relatou.
5. **O motor não calcula greide**: `rampaMedia_pct` sai `null`, e a rampa fica
   inteiramente com o Validator.

### O que passou

- **Determinismo:** mesma semente → arquivo de contrato byte a byte idêntico
  (`2709e86fed2b7181` duas vezes); semente diferente → arquivo diferente.
- **Fechamento de áreas:** 0,00 % de erro nas 60 variantes.
- **Tempo:** 1,5 s (`ensaio-47ha`), 2,1 s (`lab01-50ha-ondulado`), 9,5 s
  (`geo-antonina`) para 20 variantes cada.
- **A régua do próprio Testfit** (`medirPlano`) sobre as 60: **zero** lote fora
  da área e **zero** fora da tolerância.

### Dois achados que atravessam repositórios

1. **O defeito de relevo do LAB-01 atinge o Generate, e não o Testfit.** Mesma
   nuvem, mesma régua: `criarModeloRelevo` do Generate deixa **49,8 %** das
   amostras sobre um valor de curva e **17,3 %** da grade com gradiente zero; o
   `campoRelevo` do Testfit, que pondera **todos** os pontos em vez dos k mais
   próximos, fica em 2,2 % e 0 %. Diagnóstico para repassar ao Generate, com a
   correção sugerida: exigir vizinhos de **pelo menos duas cotas distintas**.
   Só diagnóstico — o Lab não escreve no Generate.
2. **As duas glebas-padrão do Generate não têm relevo nenhum** (`curvas: []`,
   `cotas: null`). É por isso que a terceira gleba deste prompt é a do LAB-01 —
   sem ela, o campo `relevo` do contrato atravessaria a esteira sem nunca ser
   exercitado.

### Onde está o código

```text
external-engines/testfit/          (sem upstream/: o motor é da família — D16)
├── adapter/src/
│   ├── contrato-v1.ts   os tipos do contrato
│   ├── ida.ts           contrato → EntradaMotor, com as perdas declaradas
│   ├── volta.ts         plano → contrato, com as perdas declaradas
│   ├── aparo.ts         o conserto: corta SÓ eixo de via, desligado por padrão
│   └── esteira.ts       a esteira inteira, com o Validator e o Judge do Generate
├── ferramentas/         medir.ts · diagnostico-relevo.ts · gleba-lab01.ts
└── tests/               14 testes, verdes
```

Os caminhos dos dois repositórios irmãos estão **num lugar só**: os `paths` do
`external-engines/testfit/tsconfig.json`.

---

# LAB-01 — o adaptador do Symbios

## O que existe agora

```text
external-engines/symbios/
├── upstream/            symbios-tensor 0.4.1 (c3f2875) — INTOCADO, verificado com cmp
├── archilly/
│   ├── wasm/            ponte Rust → .wasm de 189 KB, ZERO imports
│   ├── probe/           medições do LAB-00
│   └── wasm-probe/      prova de compilação do LAB-00
└── adapter/             O ADAPTADOR (LAB-01)
    ├── src/             9 arquivos, zero dependências npm
    └── ferramentas/     geração de terrenos, medições, diagnóstico, navegador
docs/terrenos/           4 terrenos no contrato archilly-terreno 1.1
outputs/lab01/           medições cruas, GeoJSON por terreno, captura do navegador
```

Uma função: `gerarRedeViaria(motor, terreno, parametros, seed)`.

## O veredito do LAB-01

> **Geometria utilizável: SIM COM RESSALVAS**

Relatório completo com todas as medições:
[`relatorios/LAB01_ADAPTADOR.md`](relatorios/LAB01_ADAPTADOR.md).
Decisões numeradas e o porquê de cada uma: [`DECISOES.md`](DECISOES.md).

### O que passou, com folga

- **Ida e volta georreferenciada:** pior erro **2 × 10⁻¹⁰ m** contra a meta de
  0,01 m — oito ordens de grandeza de folga.
- **Determinismo:** mesma seed → mesmo SHA-256 da geometria; seed diferente →
  saída diferente.
- **Uso C:** eixos do Archilly entram, quadras saem. Grade 3×3 com vão de 120 m
  → 4 quadras de 14 400 m², exatas.
- **Navegador:** `.wasm` instancia em 19,7 ms e roda o pipeline completo em
  **151 ms** no Chromium, carregado com `WebAssembly.instantiate(bytes, {})` —
  objeto de imports vazio, sem `wasm-bindgen`, sem glue.
- **Quadras com tamanho de loteamento:** mediana entre 1 600 e 1 900 m².
- **Escala:** 200 ha em 5,7 s no total, dos quais só 631 ms são do motor.

### As três ressalvas

1. **A rampa não é respeitada nos cruzamentos.** Ao longo de uma via o clamp
   fecha sem exceção (pior caso: 10,04 % contra 10 % pedidos); em nó de grau 3 ou
   mais aparecem 49 %, 69 %, 365 %. Testado e descartado: não é o encadeamento do
   adaptador, não é relevo extrapolado, **e não é falta de convergência** (10 e
   1 000 passes dão resultado idêntico). É estrutural — o clamp opera por cadeia,
   e nó compartilhado por várias cadeias não pode ser movido sem quebrar as
   outras. **Decisão: o Adapter não corrige; a conferência é do Validator.**
2. **38 % do comprimento de via nasce fora da gleba.** O motor gera sobre um
   retângulo e a gleba é irregular. Recortar não é cosmético: pode deixar trecho
   isolado dentro da gleba, e o recorte precisa de verificação de conectividade
   depois.
3. **O traçado é cru.** As principais fecham anéis em torno dos morros — geometria
   de qualidade, o que um projetista faria numa encosta. As locais descem em leque
   a partir dos cumes, e nos cumes dezenas convergem num ponto. É o mesmo lugar
   onde a rampa estoura. Ver a captura em `outputs/lab01/navegador.png`.

## Três achados que mudam premissas anteriores

1. **O O(N²) do LAB-00 não é o problema que parecia.** Aquele relatório registrou
   128 s num mundo de 4 km². Medido agora em terreno real com espaçamento de
   loteamento: **631 ms em 200 ha**. A diferença é calibração — os 128 s foram
   com os defaults do upstream, que põem uma via a cada 15 m. **Nenhum contorno é
   necessário até 200 ha**, e processar por setores criaria costura visível (o
   mesmo defeito que o `CityStreamer` do upstream admite ter).

2. **O contrato de entrada não é o `archilly.geo.2`.** O prompt o nomeia, mas ele
   é o pacote para o **Archilly Studio 2D/3D** e leva estado de aplicativo. O
   contrato que alimenta um motor de loteamento é o **`archilly-terreno`** (1.1),
   que é GeoJSON com poligonal, restrições recortadas e curvas cotadas — e é o
   que o Generate consome.

3. **Os estudos de prova do Geo não têm geometria.** `estudos-de-prova.ts` é
   entrada de dossiê e prancha: `vertices: []`, testadas com coordenadas de
   exemplo, mapa substituído por um PNG de 1×1. Prova formatação, não geometria.
   Os terrenos em `docs/terrenos/` usam os **números** reais dos estudos com
   **geometria construída**, e cada arquivo declara isso na `procedencia`.

## Um defeito nosso que vale para o Generate

A interpolação de relevo do adaptador usava k-vizinhos — o mesmo método do
`criarModeloRelevo` do Generate. Como os vértices ao longo de uma curva de nível
são muito mais próximos entre si do que a distância entre curvas, **85 % das
células caíam exatamente sobre um valor de curva e 73 % da grade tinha gradiente
zero**. O terreno virava um bolo de casamento — terraços planos com degraus — e o
campo tensorial seguia a borda dos degraus, não a topografia.

Corrigido aqui (interpolação entre cotas distintas). **Se o `criarModeloRelevo`
do Generate for alimentado com vértices de curva de nível, tem o mesmo defeito.**

**O LAB-07 verificou, e a suspeita procede:** 49,8 % das amostras sobre um valor
de curva e 17,3 % da grade com gradiente zero, medidos com o próprio
`criarModeloRelevo` sobre a mesma nuvem. Continua sendo só diagnóstico — o Lab
não escreve no Generate. Números em `relatorios/LAB-07.md`, §8.

## Próximo passo — LAB-02

Recorte pela gleba e pelas restrições, e passagem pelo Validator. Em ordem:

1. **Recortar pela gleba** e **conferir conectividade depois** — é onde o recorte
   machuca, e 38 % do comprimento vai embora.
2. **Recortar pelas restrições** — APP, reserva legal e faixa não edificável já
   viajam carregadas no `Terreno`; falta usá-las.
3. **Passar pelo Validator**, com atenção à rampa **nos cruzamentos**. É a
   reprovação que já se pode antecipar.

**O LAB-07 adiantou três coisas para ele:** o caminho até o Validator e o Judge
do Generate está aberto e provado a partir do Lab; o recorte de eixo viário pelo
perímetro já está escrito em `external-engines/testfit/adapter/src/aparo.ts`, e
como **os dois motores** deixam cerca de um terço da rede fora da divisa, vale
escrever o recorte do LAB-02 pensando em servir aos dois; e o contrato de motor
v1 funciona como porta — 60 arquivos passaram pelo esquema, 47 chegaram ao
Validator, e o que recusou recusou pelo motivo certo.

**O que o LAB-02 não deve fazer:** consertar a rampa dentro do Adapter. Se o
Adapter consertar geometria, o LAB-03 compara o conserto do Adapter com o motor
Geométrico, não o Symbios.

Uma alternativa que vale medir no LAB-02: **rebaixar o relevo fora da gleba
abaixo do `water_level`** faz o motor evitar aquela área sozinho, e recortaria
antes em vez de depois. Não foi feito aqui porque o recorte é do LAB-02 e porque
criar um penhasco na divisa tem efeito colateral no campo tensorial (ver D12).

## Como reproduzir tudo

```shell
cd external-engines/symbios/archilly/wasm
rustup target add wasm32-unknown-unknown
RUSTFLAGS='--cfg getrandom_backend="custom"' cargo build --release --target wasm32-unknown-unknown

cd ../../adapter
node --experimental-strip-types ferramentas/gerar-terrenos.ts
node --experimental-strip-types ferramentas/medir.ts
node --experimental-strip-types ferramentas/diagnostico-rampa.ts
cd ferramentas/navegador && npx http-server -p 8099 .
```

Requer `cargo` e Node 22+. **Nenhuma dependência npm.**

O LAB-07 é outra pilha, porque compila fonte de três repositórios ao mesmo tempo
(D17). Requer **Bun** e os dois clones irmãos ao lado deste repositório:

```shell
git clone https://github.com/jonny583/motor-testfit              ../motor-testfit
git clone https://github.com/jonny583/urban-create-hub-41d93a4d  ../urban-create-hub-41d93a4d

cd external-engines/testfit
bun install
bun run gleba && bun run medir && bun run relevo
bun test && bun run typecheck && bun run lint
```

Uma dependência do Generate precisa estar instalada para o Validator rodar:
`bun add --no-save zod@^3` **dentro do clone dele** (`node_modules` é ignorado
pelo git de lá; o Lab não escreve naquele repositório).

## Integridade do upstream

`external-engines/symbios/upstream/` continua verificado arquivo a arquivo com
`cmp` contra o commit `c3f287556b98cc616d4263d163e6643ae32111ff`: **byte a byte
idêntico**. Toda a ponte do LAB-01 vive em `archilly/wasm/` e depende do upstream
por caminho, sem modificá-lo.

`external-engines/testfit/` **não tem `upstream/`**, de propósito: o motor é da
própria família e uma cópia congelada aqui envelheceria em silêncio (D16). Ele é
lido por caminho, e o caminho está num lugar só — os `paths` do `tsconfig.json`.

Os repositórios do Geo (`jonny583/urban-scout-tool`), do Generate
(`jonny583/urban-create-hub-41d93a4d`, `main`) e do motor do Testfit
(`jonny583/motor-testfit`) foram clonados **somente para leitura** e terminaram
as rodadas sem uma alteração sequer — conferido com `git status` nos três.
