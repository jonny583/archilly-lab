# ONDE PARAMOS

> Para retomar numa nova sessão, diga:
>
> **"leia docs/ONDE_PARAMOS.md e me diga onde estamos"**

**Última atualização:** 04/10/2026 · **Último prompt executado:** LAB-35 ·
**A fila de 04/10 está em andamento: 5 de 7 feitos.**

# 🟢 O DESPERTADOR ESTÁ DE PÉ — fila nova, LAB-31 a LAB-37

**`trig_01XwSkTLT9zmyprNZcUiWy7f` · `enabled: true` desde 04/10/2026 · 60 min, minuto
:05.** É o **mesmo** despertador: o chat mandou **reabilitar em vez de recriar** pela
terceira vez, e isso preserva o histórico de disparos.

**O próximo é o LAB-36**, e a condição dele está cumprida (LAB-35 mesclado).

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
| **LAB-36** | as quatro regras sem teste **viram guarda ou saem do documento** | ⏳ **o próximo** |
| **LAB-37** | a dívida da testada de frente (D121) — tamanho escrito, executar se couber | ⏳ pronto |

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
