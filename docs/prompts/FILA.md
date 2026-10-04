# FILA DO ARCHILLY LAB

**Esta é a fila oficial deste repositório.** Escrita pelo Claude do chat
(diretor da família) em 14/09/2026 e gravada aqui como fila autônoma: o Lab
trabalha sozinho, em laço, sem esperar mensagem do chat.

**Ao acordar:** `docs/ONDE_PARAMOS.md` → `git log` → esta fila.

---

## Como esta fila funciona

- **Um despertador**, a cada 60 minutos, preso a este repositório
  (minuto :05 — o id fica em [`../ONDE_PARAMOS.md`](../ONDE_PARAMOS.md)). Regra de família: **um por
  aplicativo; nunca se toca no despertador de outro repositório.**
- A cada despertador: pegar o **primeiro** prompt "pronto" cuja condição esteja
  cumprida, executá-lo **inteiro** (testes verdes, PR mesclado na `main`,
  `ONDE_PARAMOS` e `INDEX` atualizados, relatório em `docs/relatorios/`),
  terminar com o RECADO PARA O CHAT e **acrescentá-lo a**
  [`../relatorios/RECADOS.md`](../relatorios/RECADOS.md). **Um prompt por
  despertador.**
- O que depende do Jonny ou de outro repositório fica **"aguardando"**: pular
  para o seguinte e reavaliar a cada despertador.
- **Prompt fora desta lista não existe.** O que faltar entra aqui como
  *"proposto ao chat"*, sem executar. Não ampliar escopo.
- **Nunca tocar em outro repositório** — clone só para leitura quando um prompt
  mandar. Os achados para o Generate e para o Laboratório de Parcelamento vão
  **pelo chat**, não por commit lá.
- Toda conferência confere também `INDEX` e `ONDE_PARAMOS`.
- Fila esgotada: gravar o recado acumulado, escrever em `ONDE_PARAMOS` *"fila
  esgotada, aguardando o chat"* e **apagar o despertador**.

**Regras que nunca mudam:** o Lab **não tem Validator próprio** — julga sempre
com o Validator e o Judge do Generate; medições **em metros** e **em dados**
(JSON em `docs/provas/`), com gleba, motor, semente e versão do contrato;
determinismo provado; **nada de regra urbanística inventada** — regra nova é
*"proposto ao chat"*.

---

## 🟢 A FILA DE AGORA — 04/10/2026 (segunda), LAB-38 a LAB-42

Mandada pelo chat em 04/10/2026, com o **despertador reabilitado** pela quarta vez
(`enabled: true`, próximo disparo 15:05 UTC). **Os cinco prompts saíram da minha própria
lista de "proposto ao chat"** — é a segunda fila seguida em que o chat transforma em
trabalho o que eu havia listado como pendente.

| # | prompt | estado | condição |
|---|---|---|---|
| **LAB-38** | **CI para o comando único** — não há workflow neste repositório, então nada roda o verde sozinho. Criar e **provar quebrando um teste de propósito**. *"É o mesmo buraco do Orçamento e do Generate, e foi ele que deixou uma suíte vermelha duas semanas sem ninguém ver"* | ✅ **concluído em 04/10/2026** | nenhuma — prioridade |
| **LAB-39** | A **última trava que se repete**: o teste do D116 compara **duas provas entre si** — consertar para **medir**, não para comparar prova com prova | ✅ **concluído em 04/10/2026** | LAB-38 mesclado ✅ |
| **LAB-40** | **Fixtures** que exerçam as quatro promessas do LAB-35 **e a testada de frente fora de Antonina** — sem isso tudo que foi medido vale para uma gleba só | ✅ **concluído em 04/10/2026** | LAB-39 mesclado ✅ |
| **LAB-41** | As **posições de acesso em que a candidata ortogonal do Generate não entrega nada aceitável**, 5 de 6 numa gleba — investigar e dizer se é **defeito do motor ou limite real do terreno** | ✅ **concluído em 04/10/2026** | LAB-40 mesclado ✅ |
| **LAB-42** | Criar **`docs/relatorios/BALANCOS.md`** e registrar ali os balanços, inclusive os que foram **só para o chat**, para nenhuma lista precisar ser re-derivada de novo | ⏳ **pronto, é o próximo** | LAB-41 mesclado ✅ |

### A decisão que o chat tomou junto com a fila

**O ranking do Parcelamento preferir 33 lotes a 1 228 em `geo-antonina` (D140) NÃO se
resolve agora.** O Jonny **nunca abriu aquele motor**, então aquilo virou **pendência
dele**, registrada no `PENDENCIAS_JONNY.md` como **item 7**, com o número, a razão e as
**duas leituras possíveis** (produto de poucos lotes grandes, ou efeito indesejado da
entrega da testada).

**O que eu faço enquanto isso, por ordem do chat:** seguir rodando com o comportamento
atual e publicando o dado **como está, com a razão colada ao número** — *"não esconda e
não escolha por ele"*.

### O que o chat manteve, sem mudança

- **a régua de forma** segue **com o Jonny** e **não trava nada**;
- **a corda reta das vias curvas fica na V3**, sem mexer.

### LAB-41 · A ausência da ortogonal tinha causa — ✅ concluído em 04/10/2026

**Entregue:** [`../relatorios/LAB-41.md`](../relatorios/LAB-41.md),
`docs/provas/LAB-41/ortogonal-fora-da-gleba.json`, `ferramentas/lab41.ts`, a razão colada
ao número na página do Jonny, avisos no LAB-28 e no LAB-34, D150 e D151.

**A resposta não é nenhuma das duas que a pergunta oferecia.** A candidata ortogonal
**produz plano** em todas as posições, e o plano é recusado pelo **contrato do próprio
Generate** porque a **via sai da gleba** — de **2,97 a 83,49 m** além da divisa, a culpada
sendo a `VP-01` em 6 dos 9 casos.

**Seis hipóteses morreram com medição:** ponto fora da divisa (0 a 3e-14 m), limite do
terreno (a espinha entrega em 11 de 12), defeito geral da ortogonal (**36 pontos** de
controle, todos aceitos), gleba côncava (Antonina tem 11 reflexos e passa 6/6),
preenchimento do retângulo (43 % em Antonina, passa), e os percentuais de APP e lazer
(mesmos metros, dígito por dígito).

**O diagnóstico que fechou é de uma linha:** uma restrição de **100 m² posta FORA da
gleba**, que não desconta área nenhuma, leva `sintetico-50ha-ondulado` de 1/6 a **6/6** e
`sintetico-10ha-plano` de 3/6 a **6/6**. *A ortogonal toma outro caminho quando
`restricoes` está vazio, e nesse caminho a via não é aparada pela gleba.*

**Para o Generate: lista numerada de 6 itens no §5 do relatório**, com a reprodução, a
peça culpada, o mecanismo provável (a `VP-01` montada pelo retângulo envolvente) e um
teste de regressão barato. **Nada foi escrito no vizinho** — ele foi só lido.

**E o prompt pegou um defeito de método meu** (D151): eu tinha 21 pontos no acusado e 6 no
controle, e ia escrever *"só as sintéticas falham"*. **Controle que recebeu menos medição
que o acusado não é controle: é alívio.** Varridos os controles com a mesma régua, a frase
passou a ter base.

---

### LAB-40 · As fixtures que exercem as promessas — ✅ concluído em 04/10/2026

**Entregue:** [`../relatorios/LAB-40.md`](../relatorios/LAB-40.md),
`docs/fixtures/glebas-que-exercem-as-promessas/` (duas), `docs/provas/LAB-40/fixtures.json`,
`ferramentas/lab40.ts`, travas novas, D147 a D149, `CLAUDE.md` §6 com **onze** linhas.

**O número que sobrevive ao prompt:** das **60** promessas dos dois inventários, as que
**gleba nenhuma** exercitava eram **6** e hoje são **0** — e há trava varrendo as dez
glebas, nas duas direções (promessa nova sem fixture, fixture mutilada).

**O primeiro achado veio antes da primeira medição** (D147): a fixture fez a guarda da
ida **reprovar** `acessos[].segmento.a` e `.b`, dois campos sem destino escrito desde o
LAB-30. A regra existia e **nunca falou** — *campo que gleba nenhuma traz não existe para
a guarda*. É a tese do prompt provada pelo próprio prompt.

**A testada fora de Antonina muda as três coisas** que podiam carregar o resultado: face
**1** (não 0), **587,5 m** (não 180) e a linha **0,5 m fora** da divisa (não sobre ela).
`facesLoteamento = [1]`, face coberta a 100 %, toque de vértice a 0 %.

**E a §6 pegou a DÉCIMA PRIMEIRA vez, dentro do prompt** (D148): eu ia publicar *"aqui a
entrega não custa lote, 599 → 640"*. Medidas três amostragens, o sinal **muda** (−40, −4,
+41) — porque *"espinha, posição 1"* **não é a mesma variante** num conjunto de 2 e num de
20: 680 contra 599 na mesma gleba sem as faces. **Estável é a frente** (0 → 51), não o
total. *Posição no ranking é rótulo, e rótulo não é identidade.* O item 7 do Jonny recebeu
a ressalva escrita para leigo.

---

### LAB-39 · A trava que comparava duas provas, consertada para medir — ✅ concluído em 04/10/2026

**Entregue:** [`../relatorios/LAB-39.md`](../relatorios/LAB-39.md),
`docs/provas/LAB-39/confronto-refeito.json`, `esteira/ferramentas/lab39.ts`, 5 travas
novas em `tests/acesso.test.ts`, D144 a D146.

**A trava falhava nas duas direções:** falso verde porque as duas provas saem da **mesma**
fórmula — erradas do mesmo jeito, erram juntas; e falso vermelho porque regerada **uma** e
não a outra ela ficava vermelha **sem nada estar errado**. Agora cada arquivo é conferido
contra o `porPosicao` **dele**: **40 agregados, 10 confrontos, 240 posições cruas, 0
divergências**, em menos de 10 ms e **sem rodar motor nenhum**.

**Provado por sabotagem:** o `entreOsMotoresDeLote_pct` de `completo` trocado de 29,12
para **70** — o número errado que o D116 publicou — leva a suíte de **30 verdes a 3
vermelhas**. A trava antiga não pegaria isso se as duas provas o tivessem junto.

**Dois achados, e os dois são da mesma família do D116:**

- **a MONTAGEM do confronto também morava em dois lugares** (D145), e com ela a lista dos
  motores de lote em **duas grafias** — declarada no `lab28.ts`, derivada por
  `filter(… !== "symbios")` no `lab19.ts`. Hoje dão o mesmo conjunto; com um quinto motor,
  não. `MOTORES_DE_LOTE` e `confrontoDoAcesso()` passaram para a régua. *Trazer a fórmula
  para um lugar só não basta: a montagem também é a conta;*
- **quatro provas declaram `contrato: "2"` e nenhuma entrada do repositório é `"2"`**
  (D146) — `lab25`, `lab26`, `lab28` e `lab30` têm o literal à mão, e todas as glebas
  declaram `"1"`. A guarda do §7 confere que a chave **existe**, nunca que ela
  **corresponde ao medido**: a forma do D137 um degrau acima. **Não consertado** (§1-A) —
  virou **LAB-43**, proposto ao chat.

---

### LAB-38 · O CI do comando único — ✅ concluído em 04/10/2026

**Entregue:** [`../relatorios/LAB-38.md`](../relatorios/LAB-38.md),
`.github/workflows/verde.yml`, 4 travas novas no `regras.test.ts`.

**O levantamento mudou o formato da resposta:** o verde completo lê **dois clones
privados** por caminho (D16), e este repositório é **público** — o `GITHUB_TOKEN` do
Actions não os alcança. Então o workflow tem **dois trabalhos, com nomes que não
enganam**: `guardas que não precisam dos clones vizinhos (NÃO é o verde)`, que roda hoje
e protege 64 travas, e `o verde completo`, que **falha com a receita** até alguém criar o
segredo (D141). *Um CI vermelho por falta de configuração é honesto; um CI verde que não
roda o verde é a mentira que o D110 custou duas semanas.*

**E o CI achou um defeito meu no PRIMEIRO disparo** (D143): a trava dos clones vizinhos,
do LAB-36, exigia *"pelo menos um clone conferido"* — e no runner não há nenhum, por um
motivo legítimo. Ela era verdadeira nesta máquina e falsa noutra, e **só um segundo
ambiente podia mostrar isso**.

---

## 🟢 A FILA DE AGORA — 04/10/2026, LAB-31 a LAB-37

Mandada pelo chat em 04/10/2026, com o **despertador reabilitado**
(`enabled: true`, próximo disparo 04/10 02:05 UTC). É a terceira vez que o chat manda
**reabilitar em vez de recriar** o mesmo despertador.

**Os sete prompts saíram da minha própria lista de dívidas** — o chat leu o balanço que
pedi fora da fila em 03/10 e transformou em fila o que eu tinha listado como "mal
resolvido", inclusive os erros meus que ninguém tinha cobrado.

| # | prompt | estado | condição |
|---|---|---|---|
| **LAB-31** | **"Verde" passa a ser UM comando só** que roda tudo — os dois pacotes, provas de navegador e o que mais existir; nada de suíte que fica fora e cala alarme. **Provar quebrando de propósito** um teste de cada pacote e mostrando que o comando único reprova | ✅ **concluído em 04/10/2026** | nenhuma — prioridade |
| **LAB-32** | A **aderência do Parcelamento caiu de 17,4 para 11,2 %** depois do conserto do LAB-30 e **eu publiquei sem investigar** — investigar, achar o culpado e dizer se o número novo é o certo ou se há outro defeito | ✅ **concluído em 04/10/2026** | LAB-31 mesclado ✅ |
| **LAB-33** | A **trava do LAB-23** continua lendo **prova congelada** em vez de medir — *"conserte de verdade, não vire o sinal"* | ✅ **concluído em 04/10/2026** | LAB-32 mesclado ✅ |
| **LAB-34** | A **tabela comparativa** ordena os motores num **único ponto de acesso**, e só a seção do acesso avisa que isso muda até **108 %** — *"ponha o aviso onde a ordem aparece, não escondido"* | ✅ **concluído em 04/10/2026** | LAB-33 mesclado ✅ |
| **LAB-35** | A guarda da ida cospe **310 avisos `mapa-velho`** — conferir se há **caso real escondido nesse volume** e reduzir o ruído | ✅ **concluído em 04/10/2026** | LAB-34 mesclado ✅ |
| **LAB-36** | As **quatro regras sem teste** que eu listei **viram guarda ou saem do documento** | ✅ **concluído em 04/10/2026** · eram **cinco**, e duas eram falsas | LAB-35 mesclado ✅ |
| **LAB-37** | A **dívida da testada de frente** (D121) — mapear a linha para as faces do perímetro — *"escreva o tamanho e execute se couber"* | ✅ **concluído em 04/10/2026** · **a fila ESGOTOU** | LAB-36 mesclado ✅ |

### O que o chat manteve, sem mudança

- **a régua de forma** (útil < 85 % / < 70 %) segue **com o Jonny** e **não trava
  nada** — é o único item na lista dele;
- **a corda reta das vias curvas fica na V3**, sem mexer (`volta.ts:125`).

### LAB-37 · A dívida da testada de frente, paga — ✅ concluído em 04/10/2026 · **a fila esgotou**

**Entregue:** [`../relatorios/LAB-37.md`](../relatorios/LAB-37.md),
`docs/provas/LAB-37/testada-de-frente.json`, `tests/testada-de-frente.test.ts` (12
travas), a tabela e a página do Jonny regeradas.

**O tamanho estava escrito e cabia:** a régua, a opção na ida, a passagem, o cálculo, o
inventário, a declaração, as travas. **Medido, a D121 estava certa:** lotes com aresta na
testada vão de **0 para 14 a 18**, em 10 de 10 partidos, nas duas glebas que têm testada,
e `respeitaTestadaDeFrente` virou `true`. A linha de 180 m cobre a **face 0** a 100 %; a
face 19 encosta a 3 % — o vértice, não a testada, e é por isso que a fração mínima da face
é parâmetro declarado (a lição do D75).

**A categoria `divida` está vazia hoje**, e a dívida paga **devolveu o alcance** que ela
custou: a ida "como era" passou a ser reprovada pela guarda genérica.

**Dois achados que não estavam na conta:** o **arnês da guarda** media um caminho que não
era o caminho — calculava a coluna vertebral e não as faces (D139, consertado com uma
montagem única) —, e **o ranking do próprio motor passou a preferir 33 lotes a 1 228** em
Antonina, uma vez que a testada validou um partido que antes desenhava zero (D140). O 33
é publicado **com a razão colada ao número**, pelo princípio do LAB-34.

---

### LAB-36 · As regras que eram só afirmação — ✅ concluído em 04/10/2026

**Entregue:** [`../relatorios/LAB-36.md`](../relatorios/LAB-36.md),
`esteira/tests/regras.test.ts` (13 travas), `CLAUDE.md` §4, §6 e §7 emendados.

**O primeiro achado é sobre o pedido: a lista não existia.** Ela saiu num balanço fora da
fila, foi para o chat e **não para um arquivo** — então eu varri o `CLAUDE.md` de novo,
regra por regra. *O que vai ao chat e não vai a um arquivo não existe amanhã.*

**Deram CINCO, não quatro, e DUAS estavam falsas:** §4 *"não tem interface"* (o HTML da
bancada do navegador existe desde o LAB-01) e §7 *"prova com gleba, motor, semente e
contrato em cada arquivo"* (**falsa em 9 de 32**). As duas foram **estreitadas para o que
é verdade**, com a exceção declarada e guardada; as outras três ganharam guarda. E uma
sexta, *"não escreve em repositório vizinho"*, virou teste com a **conta de clones
conferidos** publicada.

**A NONA vez do ponto cego** (D137): a primeira versão da guarda exigia a chave `"gleba"`
**literal** e reprovou **13 de 32** provas — eu tinha nas mãos *"um terço das provas viola
a §7"*. Era a régua **medindo ortografia, não conteúdo**: há prova que diz `glebas` no
plural, e SAÍDA que identifica a gleba em `entrada`.

---

### LAB-35 · Os 310 avisos — ✅ concluído em 04/10/2026

**Entregue:** [`../relatorios/LAB-35.md`](../relatorios/LAB-35.md),
`tests/promessas.test.ts` (4 travas), andar novo no `guarda-da-ida.test.ts` (5 travas),
prova regerada com `promessasQueNenhumaGlebaExercita`.

**Havia caso real, e são quatro.** Dos 68 campos que avisavam, **21 avisavam em TODAS as
sete glebas** — e aí *"campo opcional que esta gleba não exerce"* vira *"nenhuma gleba
exerce isto"*. Dezessete são `perda`/`interno` (nada tinha de chegar); **quatro são
PROMESSAS** que a guarda **nunca verificou**: `parametros.calcada_m`,
`atracoes[].geometria.aneis` e `acessos[].segmento` no Parcelamento, e `gleba.furos` no
Symbios. Caminho errado numa promessa que ninguém exerce é **invisível** — a forma exata
do D119.

**Exercitadas as quatro, com entradas montadas em teste: as quatro se sustentam.** O caso
real não era promessa quebrada, era promessa que ninguém tinha olhado.

**O ruído:** a regra 3 virou duas — `promessa-nao-exercitada` (99, o sinal) e
`mapa-velho` (187, calado no relatório e gravado na prova). Os 24 que faltam eram
entradas de **dívida** em glebas que não trazem o campo: não há o que confessar se o
contrato não trouxe nada.

**A OITAVA vez do ponto cego** (D135): dos quatro testes, **dois falharam e os dois eram
o meu teste** — a calçada chega como **faixa** `{min,max}`, e o furo mora em
`terreno.gleba.furos`. A segunda me deu nas mãos, por um instante, *"a ida não entrega o
furo"*: acusação à ponte, publicável, e falsa.

---

### LAB-34 · O aviso onde a ordem aparece — ✅ concluído em 04/10/2026

**Entregue:** [`../relatorios/LAB-34.md`](../relatorios/LAB-34.md),
`COMPARACAO_DOS_MOTORES.md` regerada, `instabilidadeDaOrdem` no `acesso.ts`, 8 travas
novas.

**A segunda metade do pedido era que o aviso respondia à pergunta errada:** *"varia
108 %"* e *"a ordem muda"* são afirmações diferentes — um motor pode variar muito e
continuar sempre na frente. Medido com as seis posições de acesso: **a ordem muda em 3
dos 5 terrenos, e o primeiro lugar em 2**. Em `geo-antonina`, na posição 5, a candidata
ortogonal **cai para terceiro**.

O aviso agora nasce **debaixo de cada um dos cinco quadros**, com o que foi medido
*naquela* gleba — inclusive o ✅ da `ensaio-47ha`, a única em que a ordem aguenta as seis
posições —, mais a legenda da coluna `Lotes` e um apontador na seção do acesso. **Aviso
igual em todo lugar vira decoração**, e há trava exigindo que os cinco não sejam o mesmo
texto.

**A SÉTIMA vez do ponto cego** (D133), e a primeira sem motor de vizinho envolvido: minha
primeira contagem dava *"4 de 5"* porque incluía posições em que **um motor não
respondeu** — e aí o que muda é um motor sair da comparação, não a ordem. Com a conta
certa, 3 de 5. A ausência não foi descartada: sai contada, nomeada e no aviso.

---

### LAB-33 · A trava que lia um arquivo — ✅ concluído em 04/10/2026

**Entregue:** [`../relatorios/LAB-33.md`](../relatorios/LAB-33.md),
`esteira/tests/coluna-vertebral.test.ts` refeito (12 travas, **todas medindo**).

**No LAB-30 eu virei o sinal e chamei de conserto; o teste continuou lendo um `JSON`.**
Agora os **oito** cenários (duas glebas × quatro motores × com e sem a via) rodam no
teste, e nenhuma asserção sai de arquivo.

**E o defeito de projeto que virar o sinal não tocava:** *"saída idêntica"* significa
duas coisas — *o motor ignora a linha* **ou** *a ponte não a entrega* —, e sem separá-las
o teste passa nas duas; foi a segunda que aconteceu por três semanas (D119). Três travas
novas medem **a ponte**, direto na `idaParaOMotor`, sem motor no meio. **É a trava que
teria mordido em 13/09.**

**A prova congelada virou detector de prova velha** (D131), com a regra geral escrita e a
**varredura nas outras seis** travas que leem `docs/provas/`: cinco são detectores
legítimos, **uma repete** — e essa está proposta ao chat, com o conserto barato
descrito, sem executar (§1-A).

**O preço, dito:** a suíte foi de **108 s para 176 s**. É o custo de o teste responder
pelo motor em vez de responder por um arquivo.

---

### LAB-32 · A queda da aderência — ✅ concluído em 04/10/2026

**Entregue:** [`../relatorios/LAB-32.md`](../relatorios/LAB-32.md),
`docs/provas/LAB-32/aderencia.json`, `esteira/tests/alinhamento.test.ts` (12 travas).

**O número novo está certo como medida e errado como comparação**, e o culpado tem duas
metades. A primeira: o **ranking do próprio motor** trocou o partido `ortogonal` (nota
0,6176) pela `espinha` (0,6318) — o 17,4 % era um desenho, o 11,2 % é outro. No mesmo
partido a queda é 17,4 → 14,0 %, e **nenhum dos dez partidos se move mais de 4,3 pp**.

A segunda: **a régua do Lab mede uma promessa que o campo do motor nunca fez.** Lido o
motor (só leitura), `viaManual` dá à linha o **ângulo base do partido** e transforma a
faixa dela em **área bloqueada** — nunca prometeu assentar eixo nela. E alinhar o
partido **gira a rede toda**, o que tira eixos de cima das outras linhas desenhadas:
**a régua lê obediência como queda.** Medidas as duas promessas, as duas são cumpridas —
alinhamento a 10° vai de 0,0 para 72,9 % (ortogonal), e lotes com o **centro** na faixa
vão a **0 em 10 de 10 partidos**, nas duas glebas.

Nasceu `alinhaOPartidoAViaDesenhada`, medido nos quatro motores; a varredura do LAB-26
foi de 14 para **15 falsificáveis** (D127). O LAB-17, o LAB-30 e a D120 ganharam aviso
no alto.

**E a SEXTA vez do ponto cego** (D128), esta pega **dentro do prompt**: a primeira versão
da régua da faixa contava lote com *vértice* dentro dela e dava "27 → 34", a conclusão
oposta. Invasão é o **centro** — lote que faz frente encosta de direito.

---

### LAB-31 · "Verde" é um comando só — ✅ concluído em 04/10/2026

**Entregue:** [`../relatorios/LAB-31.md`](../relatorios/LAB-31.md),
`docs/provas/LAB-31/sabotagem.json` e `navegador.json`,
`esteira/tests/verde.test.ts` (6 travas que leem o próprio script).

`./external-engines/conferir.sh` tem agora **sete passos** — `typecheck`, `lint` e
`test` nos dois pacotes, mais a **prova no navegador** —, duas guardas antes deles
(**cobertura**, que descobre todo `package.json` e reprova se achar um fora da lista,
D122; e a **precondição do `.wasm`**, que reprova com a receita em vez de pular, D124),
e roda **todos** os passos mesmo depois de um falhar.

**O achado:** a prova no navegador existia desde o LAB-01 e era **inteiramente
manual** — a última etapa era *ler os números na tela*. Rodou **uma vez, em
10/09/2026**, e nunca mais (D123). Agora a página publica `window.__prova` como dado e
um roteiro Playwright compara com os números daquele dia: os cinco bateram exatamente.

**A sabotagem, que o chat pediu** (D126): um teste quebrado de propósito em cada
frente → `exit 0 → exit 1`, com **quatro** passos nomeados (o `lint` do `esteira` caiu
junto, de graça, porque a sabotagem deixou um import sem uso). Os três arquivos
restaurados e conferidos.

**E o que o comando NÃO faz, dito em vez de suposto** (D125): **não há CI neste
repositório**. Criá-lo é *"proposto ao chat"* — está na seção das propostas.

---

## O quadro — a fila de 15/09/2026

Escrita pelo chat depois que a fila de 14/09 esgotou.

| # | prompt | estado | condição |
|---|---|---|---|
| **LAB-04** | Straight skeleton: subdividir as quadras do Symbios em lotes e disputar o Judge | ✅ **concluído em 15/09/2026** | nenhuma |
| **LAB-05** | Reconectar a rede, recortar quadra que atravessa, descartar lasca pela regra | ✅ **concluído em 15/09/2026** | LAB-04 mesclado ✅ |
| **LF-FINAL-2** | Conferência e docs | ✅ **concluído em 15/09/2026** | LAB-05 mesclado ✅ |

**A fila de 15/09 esgotou.** O despertador foi apagado, como esta fila manda.
O que vier agora vem do chat.

---

## Os prompts da fila de 15/09, por extenso

### LAB-04 · Straight skeleton — ✅ concluído em 15/09/2026

**Condição:** nenhuma.
**Escopo:** subdividir **as quadras limpas do Symbios** em lotes, **pelos
parâmetros da gleba**, e disputar o **Judge do Generate** — medindo **lotes,
área vendável e violações** contra o motor do Testfit e contra o motor interno
do Generate.
**O que já está decidido desde o LAB-00:** a implementação é **reimplementação
em TypeScript** a partir da literatura (Felkel & Obdržálek 1998; Aichholzer,
Aurenhammer, Alberts & Gärtner 1995; Aichholzer & Aurenhammer 1996). As duas
implementações prontas são **copyleft** e não entram no produto.
**O oráculo já existe** ([`../STRAIGHT_SKELETON_ANALYSIS.md`](../STRAIGHT_SKELETON_ANALYSIS.md),
§4.4 — duas implementações independentes concordando): retângulo 60 × 30 → nós
internos em (15, 15) e (45, 15) com offset 15; o L → mais um nó em (15, 45).
**Prova:** os dois casos do oráculo como teste; lotes, área vendável e violações
por gleba; JSON em `docs/provas/LAB-04/`.
**Entregue:** [`../relatorios/LAB-04.md`](../relatorios/LAB-04.md). **O oráculo
bate ponto a ponto**, nós e frentes de onda, com fechamento 1,000. O Symbios sai
de **0 lotes** para **213** em `ensaio-47ha` com **zero violação** e **901** em
`geo-antonina` com **4** — 0,44 % dos lotes, contra 3,81 % do motor de
parcelamento. Quatro defeitos do Lab foram pegos pela régua do Generate, e o
maior deles é que **a borda da quadra do Symbios é o eixo da rua, não o
meio-fio** (D52).

### LAB-05 · Reconectar, recortar quadra, descartar lasca — ✅ concluído em 15/09/2026

**Condição:** LAB-04 mesclado.
**Escopo:** três coisas, e as três já têm o porquê medido:
1. **Reconectar a rede depois do corte** — `geo-antonina` com relevo fragmenta a
   **70,4 %** no maior componente (LAB-03, Parte B);
2. **Recortar a quadra que atravessa a divisa** — hoje a que atravessa fica,
   medida (73, 36 e 3 nas três glebas do LAB-02);
3. **Descartar lasca pela regra D48** — abaixo do lado do lote mínimo da gleba.
**E rejulgar as três glebas** com o Validator e o Judge do Generate.
**Prova:** antes e depois nas três, tabela e JSON em `docs/provas/LAB-05/`.
**O que o LAB-04 mediu e entregou a ele:** em `geo-antonina`, **119 das 698
quadras atravessam a divisa** e ficam sem lote nenhum; em `ensaio-47ha`, 3 de 94.
E a rede fragmentada faz trecho de via sobrar dentro de quadra — 65 lotes
descartados por isso.
**Entregue:** [`../relatorios/LAB-05.md`](../relatorios/LAB-05.md). Itens 2 e 3
feitos: **zero quadra além da folga de 5 cm da divisa** nas cinco glebas (eram
2 591 vértices fora em `geo-antonina`, o pior a 170,98 m), e as lascas da D48
descartadas — menos de 0,31 % do comprimento em qualquer gleba. Os lotes sobem de
876 para **1 014** em `geo-antonina` e de 181 para **214** em `ensaio-47ha`,
**com as violações do Validator inalteradas**.
**O item 1 não era defeito:** medido, `geo-antonina` fragmenta porque uma **APP
hídrica de 14,4 ha corta a gleba em duas** — o menor vão entre os blocos está 200
de 201 pontos dentro dela. Reconectar é lançar rua sobre APP, que é decisão de
urbanismo (D58). Foi para o Jonny.
**E um defeito do Lab apareceu na conferência:** a régua que dizia quem atravessa
tinha ponto cego e declarava 1,0000 para quadra 1,49 m fora (D55, D56).

### LF-FINAL-2 · Conferência e docs — ✅ concluído em 15/09/2026

**Condição:** LAB-05 mesclado ✅.
**Escopo:** conferência contra o Padrão e os documentos em dia.
**Entregue:** [`../relatorios/LF-FINAL-2.md`](../relatorios/LF-FINAL-2.md).
**Conforme, com um desvio consertado e um achado incômodo.** O desvio: um número
que viaja saía arredondado dentro do núcleo, contra o §9.3 (D59). O achado: a
regra do RECADO — 12 linhas — foi **quebrada em 7 dos 8 recados**, e nunca tinha
sido medida; agora é teste (D60). Zero link quebrado, D01 a D58 sem buraco,
chaves limpas, vizinhos intocados, e a **Versão 1.2 do Padrão continua não
existindo** — a cópia do Lab é byte a byte igual à do repositório irmão.

---

## A fila de 19/09 — a tela unificada

O chat trouxe a **decisão de família**: a interface de parcelamento se unifica na
tela do Laboratório de Parcelamento, dentro do repositório do Generate, com
**vários motores sob a mesma tela** — todos visíveis, todos ligados por padrão,
motor padrão o do Parcelamento, escolha do usuário salva, e **só entra no ranking
candidata aprovada pelo Validator**.

| # | prompt | estado | condição |
|---|---|---|---|
| **LAB-13** | A comparação que serve de base: 5 glebas, 3 motores, uma tabela | ✅ **concluído em 19/09/2026** | nenhuma |
| **LAB-14** | `docs/CONTRATO_MOTOR_UNIFICADO_v1.md` — a porta única, provada com os três motores | ✅ **concluído em 19/09/2026** | LAB-13 |

### LAB-13 · A comparação que serve de base — ✅ concluído

**Entregue:** [`../relatorios/LAB-13.md`](../relatorios/LAB-13.md). Cinco glebas,
quatro concorrentes (as duas candidatas do Generate contam separadas), **uma
régua só** — Validator, Judge e `medirSobras`, todos do Generate, e todos
alcançados pelo mesmo caminho. **Determinismo OK em 20 de 20.** Sem recomendação
de produto, como o prompt mandou.

**Dois achados:** a régua de forma punia quem gira o lote pela rua (D63), e
**nenhuma das cinco glebas tem via desenhada à mão** — a única atração que existe
é uma testada de frente sobre a divisa, que é outra coisa (D64).

### LAB-14 · O contrato de motor unificado — ✅ concluído

**Entregue:** [`../CONTRATO_MOTOR_UNIFICADO_v1.md`](../CONTRATO_MOTOR_UNIFICADO_v1.md)
e [`../relatorios/LAB-14.md`](../relatorios/LAB-14.md). A porta está escrita, os
quatro motores a implementam, e **cada capacidade declarada é desmentida por
medição se for falsa** — 13 experimentos.

**O teste achou dois defeitos que viraram cláusula:** o Symbios **estourava** em
gleba sem relevo (virou `exigeRelevo` e a proibição de exceção, D66), e a rampa
máxima **não existe na saída do contrato v1** (virou `rampaMediaMaxima_pct`, com
o nome feio de propósito, D67).

**O contrato vai ao Generate pelo chat.** O Lab não escreve no repositório
vizinho.

## A fila de 03/10, segunda parte — a guarda contra o próprio ponto cego

Mandada pelo chat em 03/10/2026, com **o despertador que já está de pé**
(`trig_01XwSkTLT9zmyprNZcUiWy7f`).

| # | prompt | estado | condição |
|---|---|---|---|
| **LAB-25** | **A guarda que impede a quarta vez:** um teste que reprove quando a ponte do Lab descartar campo que o motor publica, e a regra escrita no documento. *"Vale mais que qualquer medição nova."* | ✅ **concluído em 03/10/2026** | nenhuma |
| **LAB-26** | Partir `leRelevo` em duas (**já feito no LAB-22, D100**) e **varrer as outras capacidades declaradas** que o teste de falsificação ainda não cobre | ✅ **concluído em 03/10/2026** | LAB-25 mesclado ✅ |
| **LAB-27** | Manter [`O_QUE_FALTA_MEDIR_POR_MOTOR.md`](../O_QUE_FALTA_MEDIR_POR_MOTOR.md) atualizado e **avisar quando mudar** | 🔁 **contínuo · 1ª atualização em 03/10/2026** | LAB-26 mesclado ✅ |

### ⚠ A regra do contínuo — leia antes de acordar de novo (D111)

**O LAB-27 só é item pronto quando há mudança para carregar.** Um item que nunca
acaba manteria o despertador vivo para sempre: ele acorda, declara *"o LAB-27 está
pronto"*, não acha nada e se mantém. É o desperdício que a D62 mediu — 4 dos 7
disparos de 15/09 sem o que fazer.

**Sem mudança no documento, NÃO há item pronto**: gravar o recado, escrever o
motivo em `ONDE_PARAMOS` e **apagar o despertador**. O chat o recria com fila nova.

**Estado agora:** a fila de 03/10 está **cumprida** (LAB-21, 24, 22, 23, 25, 26 e a
1ª rodada do 27) e os achados novos estão todos *"proposto ao chat"*.

## 🔴 A fila de 03/10 (terceira parte) ESGOTOU — o despertador está DESLIGADO

**`enabled: false` em 03/10/2026, 16:06 UTC.** O disparo das 16:05 não achou item
pronto: as três partes da fila de 03/10 estão cumpridas (dez prompts, LAB-21 a LAB-30)
e os achados novos estão todos *"proposto ao chat"*. É o caso da D62.

**Desligado e não apagado** (D112), escolha que o chat ratificou ao mandar reabilitar
em vez de recriar. **O que vem agora vem do chat.**

## A fila de 03/10, terceira parte — o acesso, a identidade e a guarda que falta

Mandada pelo chat em 03/10/2026, com o **despertador reabilitado** (`enabled: true`
às 13:58 UTC). O chat registrou que **a decisão de desligar em vez de apagar foi
melhor que a letra da regra** (D112), e mandou reabilitar em vez de recriar.

| # | prompt | estado | condição |
|---|---|---|---|
| **LAB-28** | **A sensibilidade ao acesso** — o mais importante: medir nas cinco glebas e nos quatro motores quanto muda em **lotes** e em **área vendável**, pôr na tabela e na página do Jonny, e dizer **em uma frase o que significa para quem compra terreno** | ✅ **concluído em 03/10/2026** | nenhuma |
| **LAB-29** | **A identidade que viaja no contrato** — ler `MOTOR_NOME` e `MOTOR_VERSAO` do próprio motor, alcançando as provas congeladas do LAB-02 e do LAB-07 e o rótulo na mesa do Generate | ✅ **concluído em 03/10/2026** | LAB-28 mesclado ✅ |
| **LAB-30** | **A guarda da IDA** (do LAB-25), *"se ainda não estiver fechada"* — e ela **não estava** | ✅ **concluído em 03/10/2026** · a fila ESGOTOU | LAB-29 mesclado ✅ |

### O que o chat manteve, sem mudança

- **a régua de forma** (útil < 85 % / < 70 %) segue **decisão do chat** até o Jonny
  confirmar — o único item na lista dele, e não trava nada;
- **a corda reta das vias curvas fica na V3**, sem mexer (`volta.ts:125`).

### LAB-30 · A guarda da IDA — ✅ concluído em 03/10/2026 · **a fila esgotou**

**Entregue:** [`../relatorios/LAB-30.md`](../relatorios/LAB-30.md),
`docs/provas/LAB-30/guarda-da-ida.json`, `tests/guarda-da-ida.test.ts` (20 travas).

**Ela achou a QUINTA vez do ponto cego da §6, e a primeira que já tinha saído para o
chat** (D119): o motor do Parcelamento tem `viaManual` — *"coluna vertebral desenhada
à mão"* — e **a ida do Lab nunca o preencheu**. Entregando, `antonina-com-via` vai de
**25 para 32 vias**. O LAB-17 e o LAB-23 publicaram que **o motor** ignorava a via;
quem a ignorava era a ponte. **Os dois relatórios foram corrigidos no alto**, a D101
ganhou a ressalva, e a trava do LAB-23 foi **virada** (D90).

**Entregue a via, "respeitar" virou duas perguntas** (D120): ele **lê** a via (a saída
muda) e **não assenta** nela (aderência 11 %). `leViaDesenhada` nasceu ao lado de
`respeitaViaDesenhada`, e a varredura do LAB-26 foi de 13 para 14 falsificáveis — o
registro acusou o campo faltando **no mesmo segundo** em que ele nasceu.

**E nasceu um destino novo, a DÍVIDA DECLARADA** (D121): a testada de frente tem
`facesLoteamento` esperando no motor e a ida não entrega. Não é `perda` — o motor tem
onde receber. Ela **não reprova e é publicada**, com o campo que espera e o que falta
fazer. **Custou alcance, e isso vai dito:** a guarda genérica deixou de pegar o caso
do D119, e quem o impede de voltar são duas travas específicas.

### Proposto ao chat — a dívida da testada de frente

Mapear a linha da testada de frente para as **faces do perímetro** que ela cobre, e
entregá-la em `facesLoteamento`. Enquanto não for feito,
`respeitaTestadaDeFrente: false` no Parcelamento é **dívida do Lab, não limitação do
motor** — e está escrito assim no inventário. **Não executado:** é geometria nova, e
prompt fora da fila não existe.

### LAB-29 · A identidade que viaja no contrato — ✅ concluído em 03/10/2026

**Entregue:** [`../relatorios/LAB-29.md`](../relatorios/LAB-29.md),
`tests/identidade.test.ts` (10 travas) e [`../provas/LEIA-ME.md`](../provas/LEIA-ME.md).

**As duas etiquetas eram minhas** (D117): `motor-testfit` é o nome do **repositório**
e `T00-A` é o nome de um **prompt do Lab**. O motor publica as duas, e documenta a
versão — *"sobe quando o desenho muda de forma que o Generate veja"*. Agora são
importadas, e a separação é o coração: **`motor` é de quem É, `archilly.origem` é de
quem RODOU.**

**O Symbios não tem o que importar** (é WASM de Rust): o Lab guarda a constante **com
a fonte citada ao `upstream/VERSION`** e um teste lê aquele arquivo. Intocável não
quer dizer ilegível.

**O rótulo na mesa do Generate**, que era o terceiro pedido:
`externo · motor-testfit vT00-A+espinha` virou
`externo · laboratorio-de-parcelamento v1.0+espinha`.

**As provas congeladas foram alcançadas e NÃO regeradas** (D118): cinco arquivos do
LAB-07 e do LAB-08 guardam o rótulo antigo, porque são registro de uma medição daquele
dia. Em lugar de reescrevê-los, o `provas/LEIA-ME.md` diz o que cada etiqueta queria
dizer — **com teste exigindo que ele exista e cite as três coisas.**

### LAB-28 · A sensibilidade ao acesso — ✅ concluído em 03/10/2026

**Entregue:** [`../relatorios/LAB-28.md`](../relatorios/LAB-28.md),
`docs/provas/LAB-28/acesso.json`, a coluna na
[`../COMPARACAO_DOS_MOTORES.md`](../COMPARACAO_DOS_MOTORES.md) e o bloco `acesso` por
motor na `provas/LAB-19/tabela.json`.

**O número que eu havia dado ao chat era pequeno:** 19 %, de dois pontos. Com seis
pontos por comprimento de arco, a candidata espinha do Generate vai de **860 a 1 791
lotes** em `completo` — **+108,3 %**, com a área vendável indo de 30,96 a 64,67 ha. O
Symbios dá **0 %** nas cinco, e isso é medição (D113).

**A manchete caiu, e isso é o principal** (D114): *"a entrada pesa mais que a escolha
do motor"* vale em **2 das 5** glebas, não em todas — e a primeira versão da conta
dava 1 de 5, porque incluía o Symbios, que entrega quadra. **As duas contas estão
publicadas.** O que fica é a frase que não compara nada: *o mesmo programa, no mesmo
terreno, varia até +108 % só mudando por onde a rua entra.*

**Na página, três cuidados em linguagem de leigo** (D115): o melhor ponto pode não
existir na vida real; a variação medida é o mínimo e não o máximo; e **o Lab não
escolhe a entrada** — isso é decisão do Jonny.

### Uma nota sobre o texto guardado no despertador

O prompt que o despertador dispara ainda nomeia **a fila de 03/10 na primeira
versão** (LAB-21, 22, 23). Não foi reescrito, porque o chat mandou reabilitar e não
reescrever — e **o passo 1 do próprio prompt manda ler esta fila primeiro**, que é a
oficial (CLAUDE.md §1-A). Quem acordar: **vale o que está aqui**, não a lista do
despertador.

---

## 🔴 A fila de 03/10 (segunda parte) esgotou — e o despertador foi RELIGADO depois

**`trig_01XwSkTLT9zmyprNZcUiWy7f` · `enabled: false` em 03/10/2026, 11:07 UTC.** O
disparo das 11:05 não achou item pronto, que é o caso da D62. O LAB-27 é contínuo e
não havia mudança para carregar (D111).

**Desligado, não apagado, e a diferença é declarada** (D112): apagar a rotina apaga
as sessões que ela iniciou, e ela está presa à sessão onde o dia de trabalho está
registrado. O efeito pedido é o mesmo — ele não acorda mais.

**O que vem agora vem do chat** — e veio: a terceira parte da fila, acima. O
despertador foi **reabilitado** às 13:58 UTC, preservando o histórico de disparos,
que era a saída mais barata das duas.

### Duas notas de estado, para não refazer trabalho

**1 · O LAB-26 já está metade feito.** `leRelevo` **foi partida em duas no
LAB-22** — `leRelevo` e `relevoMudaOTracado`, cada uma com o seu teste de
falsificação (D100). O que sobra do LAB-26 é a **varredura**: quais capacidades
declaradas **ainda não têm experimento** que as desminta.

**2 · A corda reta das vias curvas fica na V3, sem mexer.** Decisão do chat em
03/10. O fato, para quem for pegá-la: a ponte do Lab publica cada via como a
**reta entre as duas pontas do eixo** (`volta.ts:125`), e o tipo `eixo` do motor
é de dois pontos. **Não tocado nesta rodada.**

**3 · A régua de forma** (útil < 85 % / < 70 %) segue como **decisão do chat**
até o Jonny confirmar, e **não trava nada** — é o único item na lista dele.

---

### LAB-25 · A guarda que impede a quarta vez — ✅ concluído em 03/10/2026

**Entregue:** [`../relatorios/LAB-25.md`](../relatorios/LAB-25.md) e
`docs/provas/LAB-25/guarda-da-ponte.json`.

**Ela achou a quarta vez na primeira rodada** (D104): a ponte do Parcelamento
escrevia `faceDeRua: null` em 110 de 110 lotes, atrás de um comentário escrito
**antes** do T02 do motor e nunca mais conferido. O motor mede desde então.

**O desenho, para não envelhecer como a lista que ela substitui** (D105):
inventário de destino por campo + três regras conferidas **contra o motor
rodando** — `campo-vazio` e `campo-novo` reprovam, `mapa-velho` avisa. A
`campo-vazio` **não acredita no inventário**: casa por nome, lido do objeto que o
motor devolveu.

**E ela prova que sabe ficar vermelha** (D106): três testes sabotam a ponte de
propósito e exigem o achado.

**O que o conserto comprou, medido:** o campo descartado concorda com a régua
independente do Generate em **91,5 % a 99,8 %** dos lotes nas cinco glebas — era
bom. Mas o Generate **recalcula** o campo ao ler, então encher `faceDeRua`
**não muda número nenhum da tabela** (regerada, só os tempos de parede mudaram).
O ganho é de honestidade e de quem lê o campo — tela, exportação, Orçamento.

### LAB-26 · A varredura das capacidades — ✅ concluído em 03/10/2026

**Entregue:** [`../relatorios/LAB-26.md`](../relatorios/LAB-26.md) e
`docs/provas/LAB-26/varredura.json`.

**Três campos não tinham experimento** (D108) — `respeitaAcesso`, `geometrias` e
`versao` —, e o `porta.ts` afirmava em prosa que o teste falsificava todos. Agora
quem sustenta a frase é `src/porta/experimentos.ts`, com dois testes de varredura:
**cobertura** (campo novo sem experimento reprova) e **existência** (nome citado
que não existe reprova). 13 falsificáveis, 1 conferido, 1 sem régua.

**A declaração falsa estava num dos três** (D109): o Parcelamento dizia
`respeitaAcesso: false` e vai de **703 para 603 lotes** quando o acesso se move
992,6 m. A ida dele passa o acesso ao motor desde o LAB-07 — a declaração era do
Lab. O Symbios continua `false`, agora provado.

**E o pior achado não é de capacidade** (D110): a suíte do pacote **`testfit`
estava vermelha, 14 de 14, há duas semanas** — as glebas-padrão do Generate
viraram v2 e o portão da ida ainda gateava `"1"` (gêmeo do D87). Dois daqueles
testes eram as travas do D98 e do D104: **a suíte invisível calou os próprios
alarmes.** Agora `./external-engines/conferir.sh` roda os dois pacotes, e o
`CLAUDE.md` §7 diz que *"testes verdes"* é isso.

### LAB-27 · O documento vivo — 🔁 1ª atualização em 03/10/2026

**Entregue:** [`../relatorios/LAB-27.md`](../relatorios/LAB-27.md). Sem ferramenta
própria: este prompt não mede, carrega o que outros mediram.

**O que mudou no
[`O_QUE_FALTA_MEDIR_POR_MOTOR.md`](../O_QUE_FALTA_MEDIR_POR_MOTOR.md)** — dois
achados do LAB-26 que são sobre o motor do vizinho, não sobre o Lab:

- **§1-B (nova)** — a ficha de capacidades do Lab dizia, **por escrito e para
  fora**, que o motor do Parcelamento ignora o ponto de acesso. Falso: **703 → 603
  lotes**. Ficha voltada para fora atribuindo limitação que o motor não tem se
  **avisa**, não se conserta calado;
- **§1-C (nova)** — eles publicam `MOTOR_NOME` e `MOTOR_VERSAO` e a ponte do Lab
  escreve outros dois. Com a única pergunta que o documento faz a eles hoje: *a
  versão subiu no T02 e no T03?* Se não subiu, ela não serve para o Lab saber que
  precisa remedir;
- **§6 (ampliada)** — a estatística do LAB-26: das 15 declarações, três sem
  experimento, e a falsa numa delas. Um em três.

### Proposto ao chat — três, nenhum executado

**1 · A sensibilidade ao acesso na tabela comparativa.** Mover o acesso mexe no
resultado **mais que qualquer outra entrada que o Lab mede** — 19 % em lotes na
candidata ortogonal de `geo-antonina`. As cinco glebas declaram **um** acesso e
ninguém mediu quanto o resultado depende dele (LAB-26, §2).

**2 · A identidade que viaja no contrato.** O motor do Parcelamento publica
`MOTOR_NOME = "laboratorio-de-parcelamento"` e `MOTOR_VERSAO = "1.0"`; a ponte do
Lab escreve `"motor-testfit"` e um rótulo de prompt. Mesma forma do D104, um nível
acima. Ler de lá alcança provas congeladas e o rótulo na mesa do Generate — passa
do escopo de uma varredura (LAB-26, §3).

**3 · A guarda da IDA.** A guarda do LAB-25 cobre o sentido **motor → SAÍDA**, que
é o que ele pediu. O sentido **ENTRADA → motor** tem a mesma forma de risco (campo
do contrato que a ponte não entrega ao motor) e o mesmo mecanismo serve.

**Nenhum dos três executado**, porque prompt fora da fila não existe.

---

### LAB-23 · A via desenhada como coluna vertebral — ✅ concluído em 03/10/2026

**Entregue:** [`../relatorios/LAB-23.md`](../relatorios/LAB-23.md) e
`docs/provas/LAB-23/coluna-vertebral.json`.

**Provado por diferença** (D101): a mesma gleba com e sem a via desenhada, SAÍDA
comparada byte a byte — **idêntica nos oito casos**. Os quatro ignoram a via, e
a declaração deles é honesta. **O teste fica**: se um motor passar a respeitá-la,
ele morde antes de qualquer relatório sair errado.

**A pergunta nova, e a resposta depende da gleba** (D102): em `antonina-com-via`
a linha desenhada tem pior trecho de **12,62 %** e **zero** metros acima de
15 % — contra 17,09 % a 27,73 % dos quatro motores. Em `ensaio-com-via` ela
**perde**, com 30,91 %. **As duas pontas estão em teste**, para a leitura não
sobreviver à medição.

**A ressalva que muda tudo** (D103): **quem desenhou a linha fui eu**, pela
geometria da gleba (D73) — não um urbanista. Então a conclusão não é *"a mão
vence a máquina"*; é um resultado **sobre os motores**: uma reta geométrica
**cega para o relevo** bate os quatro no pior trecho. **Falta uma via desenhada
por pessoa, numa gleba real** — proposto ao chat.

---

## A fila de 03/10 — a rampa que virou número, e a via desenhada como espinha

Mandada pelo chat em 03/10/2026, com **um despertador de 60 minutos** que se
apaga ao esgotar (D62).

| # | prompt | estado | condição |
|---|---|---|---|
| **LAB-21** | Medir, em todas as glebas e motores, **quantos trechos e cruzamentos passam dos limites de rampa**; coluna na tabela e na página do Jonny, separando **média** e **pico**, e a página dizendo que a média esconde o pico | ✅ **concluído em 03/10/2026** | nenhuma |
| **LAB-24** | **Resposta do Jonny:** 30 % é do **LOTE** (reprova, é lei) e 15 % é da **RUA** (só **aviso**). Bloco de indicadores de terreno igual para os quatro motores | ✅ **concluído em 03/10/2026** | nenhuma |
| **LAB-22** | Só o Symbios reporta o pico — escrever, **por motor**, o que falta medir, e mandar **pelo chat** | ✅ **concluído em 03/10/2026** | nenhuma |
| **LAB-23** | **Via desenhada à mão como coluna vertebral do traçado**: medir o que muda nos quatro motores quando a via vem do arquivo em vez de ser inventada | ✅ **concluído em 03/10/2026** | nenhuma |

### LAB-22 · O que falta medir em cada motor — ✅ concluído em 03/10/2026

**Entregue:** [`../O_QUE_FALTA_MEDIR_POR_MOTOR.md`](../O_QUE_FALTA_MEDIR_POR_MOTOR.md)
(a lista para o chat levar) e [`../relatorios/LAB-22.md`](../relatorios/LAB-22.md).

**A medição mudou a lista, e a primeira lacuna era MINHA** (D98): o Laboratório
de Parcelamento **mede a rampa desde o T03 dele, de 14/09**, e quem a jogava fora
era **a ponte do Lab** — a mesma que eu usei no LAB-18 para reportar ao chat que
*"o Parcelamento não reporta o pico"*. A frase do meu adaptador era verdadeira no
LAB-07 e venceu um dia depois; ficou três semanas. **Terceira vez que o §6 me
pega no mesmo ponto cego** (D75, D93/D94, e esta).

**O que a correção revelou** (D99): **os dois motores que reportam, reportam
errado, em direções opostas** — o Symbios **superestima** (vértice a vértice,
0,47 m de mediana) e o Parcelamento **subestima** (12 amostras fixas por via,
passo de 83 a 157 m). A célula do relevo é de 5 m: um mede um décimo dela, o
outro 17 a 31 vezes. **Nenhum dos dois erros é visível sem uma segunda régua.**

**A declaração de capacidade envelheceu sozinha, e o teste a pegou** (D100): no
instante em que a ponte passou a carregar a rampa, três testes de falsificação do
LAB-14 ficaram vermelhos. E `leRelevo` **precisou ser partida em duas**, porque o
Parcelamento é o primeiro motor que **lê** o relevo e **não desvia** por ele —
com um campo só, uma das duas verdades teria de virar mentira.

---

### LAB-24 · O bloco de indicadores de terreno — ✅ concluído em 03/10/2026

**Entregue:** [`../relatorios/LAB-24.md`](../relatorios/LAB-24.md),
`docs/provas/LAB-24/terreno.json`, o **formato proposto** em
`formato-proposto.json`, o bloco na tabela e a seção *"Terreno em declive"* na
página do Jonny.

**A resposta dele traz uma assimetria** (D95): **30 % no LOTE reprova** (lei) e
**15 % na RUA só avisa**, porque *"o trecho se resolve com terraplenagem ou
mudança de traçado, e isso é decisão de projeto com custo"*. A régua da rua
**não ganhou veredito nenhum**, e há teste que reprova quem acrescentar um.

**Medido: os quatro motores REPROVAM** em `completo` — 95, 113, 67 e 49 lotes com
parte acima de 30 % —, e em nenhuma outra gleba. Mas **"parte acima" e
"principalmente acima" saem os dois** (D96): são **95 contra 3**, **113 contra
3**, **67 contra 1**, **49 contra 2**. Quase tudo é borda encostando no talude.

**O achado da rodada: os dois indicadores ordenam os motores AO CONTRÁRIO.** O
Symbios é **1º** em rua em declive (5 183 m) e **último** em lote em declive
(2 938 m²) — ele manda a rua para a encosta e guarda o plano para o lote; a
ortogonal faz o inverso. Qual presta é decisão de projeto.

**O formato proposto declara, dentro do JSON, que não é volume de corte e
aterro** (D97): volume pede o greide projetado, que nenhum motor entrega. É o
mal-entendido mais caro possível no caminho, porque o número tem a cara certa.

---

### LAB-21 · A rampa, trecho e cruzamento — ✅ concluído em 03/10/2026

**Entregue:** [`../relatorios/LAB-21.md`](../relatorios/LAB-21.md),
`docs/provas/LAB-21/rampa.json`, a coluna na tabela e **duas colunas** na página
do Jonny, com a seção *"A rampa das ruas: a média esconde o pior trecho"*.

**A notícia ruim primeiro: os 161,38 % do LAB-18 são artefato** (D94). Medida
como rampa de rua, a mesma via dá **41,84 %**. A causa é `rampaMaxima_pct`
calculada **vértice a vértice** sobre segmentos de mediana **0,47 m** — mede o
degrau da grade de relevo, não o greide. A prova mais limpa: em
`sintetico-10ha-plano`, praticamente plana, o motor declara **15,44 %** e o Lab
mede **1,96 %**. O número saiu daqui, foi ao chat e voltou como prompt; a
correção vai com nome.

**Três defeitos da minha régua, pegos antes de publicar** (D93): o pico de
1053 %, que era a discretização do motor; o passo menor que a célula do mapa; e
**zero cruzamentos** numa malha de quinze vias, porque eu procurava nas pontas e
numa grade as ruas se cruzam no meio.

**Duas réguas, nunca somadas** (D92): o que o motor **declara** e o que o Lab
**mede** passando o eixo pelo relevo. A segunda vale para os quatro — e mediu
**34,71 %** e **46,70 %** nas candidatas do Generate, que declaram `null`.

**O que a tabela mostra:** em `completo` as quatro **médias empatam** entre 6,1 %
e 7,7 %, e os **piores trechos** vão de **34,7 % a 51,5 %**. Quem olhasse só a
média não veria diferença nenhuma entre os quatro motores. A gleba plana é o
controle: zero metros acima de 8 % nos quatro.

**Item novo do Jonny:** a inclinação máxima de uma **rua** (D91).

---

### Uma ressalva de partida no LAB-21, antes de executar

O prompt diz *"limites legais de rampa"*. **O Lab não tem esse limite, e não o
invento** (CLAUDE.md §4). Procurei na família antes de escrever isto:

| o que existe | onde | o que é |
|---|---|---|
| **declividade máxima parcelável: 30 %** | `normas/br.ts` do Generate, citando **Lei 6.766/1979, art. 3º, § único, III** | limite do **TERRENO**: acima de 30 % não se parcela sem exigência específica |
| uso restrito de 25° a 45°, APP acima de 45° | idem, Código Florestal | limite do **TERRENO**, e **em grau**, não em porcento |
| **limite de rampa de VIA** | **não existe** — `grep "rampa\|greide"` em `normas/` não acha nada | — |

**E as duas coisas não são a mesma.** Uma rua pode ser cortada numa encosta de
40 % e ter greide de 8 %; o terreno é um número, o greide é outro. O próprio
comentário da norma avisa: *"ATENÇÃO À UNIDADE… misturá-las é erro silencioso"*.

**Como o LAB-21 vai proceder, então:** publica a **distribuição** das rampas por
trecho e por cruzamento, e a contagem acima de **vários cortes declarados**,
incluindo os 30 % da lei **com o significado dele dito** (terreno, não greide).
**Qual é a rampa máxima de via** vira item do Jonny — é urbanismo, e nenhum
documento da família a tem.

---

## A fila de 02/10 — o contrato v2, a regra de forma, e a tabela para o Jonny

Mandada pelo chat em 02/10/2026, com **um despertador de 60 minutos** que se
apaga quando a fila esgotar (D62). Ordem explícita do chat: **não parar por nada
que dependa do Jonny.**

| # | prompt | estado | condição |
|---|---|---|---|
| **LAB-18** | Revendorizar o **contrato v2** do Generate e rodar a esteira de novo nas cinco glebas, dizendo o que muda na tabela do LAB-13 | ✅ **concluído em 02/10/2026** | cumprida às 15h21 (`5b7e9b4`) |
| **LAB-19** | Aplicar a regra de forma decidida pelo chat (**útil < 85 % = "a conferir"; < 70 % = "ruim"**), pôr a coluna na tabela e medir os quatro motores | ✅ **concluído em 02/10/2026** | nenhuma |
| **LAB-20** | Deixar o resultado legível para quem não programa: **página de tabela gerada em `docs/`**, motores lado a lado, sem terminal | ✅ **concluído em 02/10/2026** · reforçado no mesmo dia a pedido do chat | nenhuma |

### LAB-20 · A página para quem não programa — ✅ concluído em 02/10/2026

**Entregue:** [`../COMPARACAO_DOS_MOTORES.md`](../COMPARACAO_DOS_MOTORES.md) —
169 linhas, **gerada** por `ferramentas/lab20.ts` a partir do `tabela.json` do
LAB-19 —, e [`../relatorios/LAB-20.md`](../relatorios/LAB-20.md).

**É Markdown, e isso foi medido** (D81): o GitHub **renderiza Markdown** e mostra
**HTML como código-fonte**. Uma página `.html` daria ao Jonny uma tela de
`<table>` — o contrário de "olhar sem terminal". Markdown é o meio que ele já usa.

**É gerada, e há teste que a prende à medição** (D82): `tests/pagina.test.ts`
regera a página e reprova se o arquivo estiver diferente. Tabela copiada à mão
envelhece em silêncio, e o precedente é a regra do RECADO — sete de oito recados
passaram do teto enquanto ela era só um texto.

**Defeito pego na primeira versão** (D83): a seção de ressalvas saiu ilegível, com
cinco linhas que eram a mesma queixa com números diferentes. Agora elas agrupam,
com "em quantos dos cinco terrenos". **Sem reescrever a frase do motor** — o que
ele declara não ter feito é dado dele. E o conserto comeu `D51` e `LAB-08`, que
são identificadores: a régua passou a poupá-los, com teste dos dois lados.

---

### Proposto ao chat: **ligar o GitHub Pages**

Se o chat quiser a comparação como **página HTML de verdade** — com cor, com
destaque, imprimível —, o que falta é **ligar o GitHub Pages** no repositório.
Isso é configuração de repositório, e eu **não liguei por minha conta**. O
gerador já separa dados de apresentação, então a versão HTML sai do mesmo
`tabela.json` sem medir nada de novo.

---

### LAB-19 · A regra de forma do chat — ✅ concluído em 02/10/2026

**Entregue:** [`../relatorios/LAB-19.md`](../relatorios/LAB-19.md) e
`docs/provas/LAB-19/tabela.json` — que é também **a entrada do LAB-20**.

**A regra (D79):** útil < 85 % = "a conferir"; < 70 % = "ruim". "Útil" é a área
do lote sobre a área da caixa de **menor** área, em qualquer orientação. Escrita
em útil, não em irregularidade, para ninguém ter de fazer a conta de cabeça.

**O que ela fez:** **absolveu** o que o meu corte de 1 % condenava à toa — em
`geo-antonina` o Laboratório de Parcelamento vai de **34 marcados a zero**,
porque os 34 eram trapézios de rua curva (96,7 % de preenchimento).

**O que apareceu:** **três dos quatro motores não têm problema de forma** (0 a
1,9 % de "ruim"). O **Symbios** é o único com problema, e é "a conferir", não
"ruim": **33,0 · 39,3 · 22,7 · 34,1 · 36,0 %** nas cinco glebas — pentágonos e
hexágonos do campo tensor, exatamente a população que a faixa do meio serve para
pegar.

**Achado novo:** a candidata **espinha é bimodal** — mais "ruim" que "a
conferir" (35 contra 1 em `completo`). Ela faz retângulo perfeito **ou**
desastre; a faixa do meio fica vazia.

**A coluna informa, não aprova** (D80): quem aprova é o Validator do Generate, e
forma de lote não é violação dele. A prova está na tabela — 29 violações com
zero "ruim" num caso, 1 violação com 382 fora do "ok" noutro.

---

### LAB-18 · O contrato v2, revendorizado — ✅ concluído em 02/10/2026

**Entregue:** [`../relatorios/LAB-18.md`](../relatorios/LAB-18.md) e
`docs/provas/LAB-18/contrato-v2.json`. Clone do Generate de `22502b3` (10/09) a
`5b7e9b4` (02/10).

**O adaptador não quebrou — o tsconfig do Lab sim** (D86): dois erros de `@/`,
que é o alias interno do Generate. Quem lê por caminho tem de espelhá-lo; uma
linha nos `paths`.

**O gate de versão era do Lab, e estava errado desde o LAB-08** (D87): cinco
testes vermelhos com *"esta esteira lê o contrato "1"; chegou versão "2""*. A
esteira passa a ler `["2","1"]`, pela regra que o Generate escreveu — e as
fixtures em `"1"` ficam, porque são **prova de medição antiga**.

**Os três pedidos, e a resposta desconfortável de dois** (D88): nascente e eixo
do curso **existem no contrato e não têm dado em gleba nenhuma** — nem nas duas
v2 deles. O bloqueio **mudou de endereço**: era falta de contrato, agora é falta
de levantamento. **Achado para o Geo.**

**A rampa rendeu** (D89): o Symbios já media a máxima desde o LAB-02 e não tinha
onde escrevê-la. Agora a saída dele é v2 e o pico viaja — `completo` dá média
**24,23 %** e pior **161,38 %**, fator de **6,7×**; `10ha-plano` dá 1,17 % contra
15,44 %, fator de **13,2×**. Os dois indicadores ficam lado a lado, porque motor
que só fala v1 preenche só o antigo.

**Na tabela do LAB-13:** Parcelamento e Symbios **não mexeram um centavo** em
sessenta e tantos commits do Generate — a prova de isolamento mais forte que a
esteira já deu. As candidatas do Generate **ganharam lote e perderam área
vendável**, e medido: a área média do lote **convergiu de 362–437 m² para
360–367 m²**, com `areaAlvoLote_m2 = 360`. Não é perda, é o motor **deixando de
passar do alvo**.

**E dois achados do Lab estão CONSERTADOS** (D90): o quadro de áreas fecha ao
centavo e a APP deixou de ser eco do parâmetro (`8fd954b`). Os dois testes do
LAB-08 **viraram do lado contrário** em vez de serem apagados — é no lugar onde
o bug já esteve que ele volta.

**A página do Jonny foi regerada**, porque a medição mudou.

---

## A fila de 20/09 — a entrega e as duas correções

Mandada pelo chat, com **um despertador de 60 minutos** que se apaga quando não
houver item pronto (D62).

| # | prompt | estado | condição |
|---|---|---|---|
| **LAB-06** | A peça pronta atrás do contrato unificado: registro, liga/desliga, escolha salva, e o teste de que apagar o Lab não quebra o Generate | ✅ **concluído em 20/09/2026** | nenhuma |
| **LAB-17** | Duas glebas de referência **com via desenhada**, os quatro motores nelas, e a D69 aplicada | ✅ **concluído em 20/09/2026** | nenhuma |
| **LAB-16** | Consertar a régua de forma e reprovar as cinco glebas do LAB-13 | ✅ **concluído em 20/09/2026** | nenhuma |

### LAB-06 · A peça pronta — ✅ concluído em 20/09/2026

**Entregue:** [`../relatorios/LAB-06.md`](../relatorios/LAB-06.md) e
[`../../entrega/registro-de-motores/`](../../entrega/registro-de-motores/).
**Quem instala é a sessão do Generate, no GU-03** — o Lab não escreve lá.

A peça vive **fora de `external-engines/`** (D70), não importa **nada** — nem npm
—, e o teste de que apagar o Lab não a quebra é feito **por leitura dos `import`
e por execução com motor de mentira**. Acrescenta o que a D68 pedia e o contrato
não cobria: **como a reprovada aparece** (D72) — com o motivo, nunca com o
desenho, e **nunca ranking vazio em silêncio**.

**Achado da demonstração:** em `ensaio-47ha`, o motor que a D68 põe como
**padrão** é justamente o que o Validator **reprova**. A peça trata o caso sem
quebrar; o que fazer a respeito é do chat e do Jonny.

---

### LAB-16 · A régua de forma — ✅ concluído em 20/09/2026

**Entregue:** [`../relatorios/LAB-16.md`](../relatorios/LAB-16.md) e
`docs/provas/LAB-16/forma.json`.

**Metade do conserto já estava feita, e isso está dito com todas as letras:** a
régua girada é do **LAB-13** (D63), e a coluna `irreg` da tabela de lá **já era
ela**. Os 754 de 776 são o número da régua VELHA. Fingir um segundo conserto
seria mentir sobre trabalho.

**O que ainda estava errado, medido:**

1. **o corte de 1 % era meu** e mandava no resultado — o Laboratório de
   Parcelamento em `geo-antonina` dá **34 / 15 / 0** nos cortes de 1 %, 5 % e
   10 %. A régua passa a publicar **os três, sempre** (D76);
2. **"irregular" é veredito de urbanista.** O que a régua marcava eram
   **trapézios, pentágonos e hexágonos** — lote de esquina, lote na curva. A
   régua passa a publicar a **composição por forma**, e nenhuma palavra dela
   julga (D77). O que é forma ruim virou item do Jonny;
3. **o arco de testada curva** era achatado em reta pela classificação, e fazia
   um lote de 49 vértices passar por retângulo com 10 % de perda. Agora o arco é
   **um lado, contado** (D78). Medido: 101 lotes com lado curvo na espinha em
   `completo`; o Symbios e o Parcelamento, **zero**.

**O que muda na tabela do LAB-13: nenhum número.** A reprovação reproduziu os
vinte valores exatamente — prova a mais de determinismo, dois prompts e dias
diferentes. **O que muda é o que a coluna quer dizer**, e a leitura do Symbios
("814 de 932 irregulares") estava errada: ele faz lote **não-ortogonal**, não
lote deformado.

---

### LAB-17 · As glebas com via desenhada — ✅ concluído em 20/09/2026

**Entregue:** [`../relatorios/LAB-17.md`](../relatorios/LAB-17.md),
`docs/provas/LAB-17/medicoes.json` e
`docs/fixtures/glebas-com-via-desenhada/` (as duas entradas v1, gravadas).

**Duas glebas de referência**, montadas sobre as glebas-padrão com relevo, cada
uma com **1 via principal + 3 secundárias desenhadas**: `ensaio-com-via`
(47,0 ha, 2 554,51 m de traçado) e `antonina-com-via` (141,8 ha, 4 090,13 m,
três APP). O traçado é **geométrico, não é projeto** (D73).

**Aderência ao traçado imposto, os quatro motores:** entre **10,1 %** e
**30,7 %**. **Nenhum motor respeita via desenhada — e nenhum mente sobre isso:**
os quatro declaram `respeitaViaDesenhada: false` e devolvem
`naoAtendido: viasDesenhadas`. A declaração bate com o medido nas oito linhas.
**Sem recomendação de produto.**

**D69 aplicada:** em `antonina-com-via`, `VD1 × APP hídrica · 71,00 m`, marcada
*"desenhada por você — exige licença ambiental"*, com **1 item de custo** de
`obra: null` (ponte ou bueiro depende da vazão, que não chega no contrato).

**As duas metades não verificáveis saem declaradas, sem aproximação inventada**
(D74): a **nascente** (o contrato v1 achata `app_nascente` em `app_hidrica`) e a
**perpendicular ao curso** (o curso chega como polígono, não como linha). A
regra dos 50 m fica **escrita** e marcada *"não aplicável até o contrato trazer
a nascente"*. O **3× / 1,5 km** segue como decisão do chat até o Jonny confirmar.

**Defeito do Lab que esta medição pegou (D75):** a régua que separa via
desenhada de testada de frente olhava os **vértices**, e uma via que atravessa a
gleba tem as duas pontas na divisa — **três das quatro** foram para o balde
errado. Agora a régua **amostra de 5 em 5 m**. Os números da primeira passada
foram descartados; **o LAB-13 não é afetado**.

**Pedido ao Generate reforçado:** um **tipo próprio para via desenhada à mão**,
separado de `via_existente` (D64) — sem ele a tela unificada não distingue
"respeitei a rua que existe" de "respeitei o que você desenhou".

---

### Proposto ao chat, e é o outro passo óbvio: **LAB-06**

A decisão de família (D68) pede registro de motores, botão liga/desliga por
motor e motor padrão — e o **LAB-06 da fila original** já era, palavra por
palavra, o prompt de entrega disso:

> *"Entrega ao Generate: peça pronta atrás do contrato de motor, **registro de
> motores**, **botão liga/desliga por motor**, e o teste de que **apagar o Lab
> inteiro não quebra o Generate**."*

**Não executado**, porque prompt fora da fila não existe. O que o LAB-14 entregou
cobre a porta; o que falta é o registro e a entrega — e parte disso é **tela**,
que é do Generate, não do Lab.

**Nota de numeração:** **LAB-09, LAB-10, LAB-11 e LAB-12 nunca existiram.** A
fila original foi de LAB-00 a LAB-08 e a fila de 19/09 começou no LAB-13; a
numeração pulou e não há prompt perdido no vão.

---

## A fila nova de 15/09 — **os itens não chegaram**

*(Resolvido em 19/09: os prompts chegaram — são o LAB-13 e o LAB-14 acima. O
nome do aplicativo de orçamento segue cortado.)*

O chat anunciou fila nova com despertador de 60 minutos, **mas a mensagem cortou
antes de listar os prompts** — ela termina em *"lançada como item de custo (ponte
ou bueiro) para o Or"*. O que veio inteiro foi a **decisão de urbanismo** (D61) e
a **regra nova do despertador** (D62), e as duas estão gravadas e mescladas.

**Nenhum despertador foi criado**, de propósito: pela D62 ele se apagaria no
primeiro disparo por não achar item pronto, e teria morrido antes de a lista
chegar. **Quando os prompts vierem, o despertador nasce com eles.**

O candidato mais óbvio, que só o chat pode promover a prompt:

- **aplicar a D61 em `geo-antonina`** — medir o contorno por fora da APP, medir a
  travessia mais curta e perpendicular ao curso, e comparar. **Bloqueado por
  duas coisas**, e nenhuma é minha: o **limiar de "desproporcional"**, que é do
  Jonny, e o **eixo do curso d'água**, que o Geo não manda (a restrição chega
  como polígono de APP, não como linha).

---

## Proposto ao chat — não executar

- **O delta contra o Padrão 1.2**, quando ele existir. A conferência do LF-FINAL
  foi feita contra a Versão 1, que é a única legível (D43). O `TF-FINAL` do
  repositório irmão espera o mesmo documento.
- **As 4 violações que sobraram em `geo-antonina`** (2 de sobreposição, de 0,56 e
  0,70 m², e 2 de frente) e o efeito de baixar a tolerância de simplificação de
  0,25 m. A suspeita está escrita no LAB-04, §6, e **não foi medida** — por isso
  não foi atribuída.
- **As 96 quadras de esqueleto não confiável** em `geo-antonina` (eram 86 antes
  do recorte): é forma degenerada da quadra ou limite da esteira? Hoje elas são
  puladas e contadas (D51), que é a resposta honesta, mas não é a resposta.
- **A travessia sobre a APP de `geo-antonina`** — é do Jonny, e está em
  `PENDENCIAS_JONNY.md`. Sem ela, um terço da gleba só se alcança por fora, e
  "por fora" é terra que não é dela (D58).
- **A quadra dentro de APP.** O recorte do LAB-05 é pela **divisa**; quadra que
  cai dentro de APP continua de pé, e nenhum dos onze invariantes do Validator a
  acusa. Medir quanto é, e se deve ser recortada também, é escopo novo.
- **O eixo do curso d'água, para o Geo.** A D61 manda a travessia sair
  **perpendicular ao curso** — e o Lab recebe a restrição como **polígono de
  APP**, não como a linha d'água. Sem o eixo, "perpendicular" não tem a quê. É
  achado para o Geo, e o chat é que o leva.
- **O balanço fora da fila não tem onde morar** (LAB-36). Os RECADOS têm `RECADOS.md`;
  os relatórios têm `docs/relatorios/`. Uma resposta fora da fila — como o balanço de
  03/10 que originou o LAB-36 — **não tem arquivo, e some**: foi por isso que a lista das
  "quatro regras" teve de ser re-derivada. Proponho um `docs/relatorios/BALANCOS.md`, na
  forma do `RECADOS.md`. **Não executado:** mexeria no `CLAUDE.md` §1, que é regra sua.
- ~~**Fixtures que exerçam as quatro promessas** (LAB-35)~~ — ✅ **executado no LAB-40**:
  duas fixtures em `docs/fixtures/glebas-que-exercem-as-promessas/`, as promessas sem
  exercício de **6 para 0**, e dois campos sem destino achados no caminho (D147).
- ~~**As posições em que a candidata ortogonal do Generate não entrega nada aceitável**
  (LAB-34)~~ — ✅ **executado no LAB-41**: a candidata **produz** plano, e o contrato do
  próprio Generate o recusa porque a **via sai da gleba** (2,97 a 83,49 m). Não é limite do
  terreno nem defeito geral dela; é o caminho de `restricoes` vazio, e uma restrição de
  100 m² fora da gleba leva as duas a 6/6 (D150).
- ~~**A última trava que repete** (LAB-33, D131)~~ — ✅ **executado no LAB-39**, com o
  desenho proposto: o agregado refeito dos números crus de cada arquivo, sem rodar motor
  nenhum. 40 agregados, 10 confrontos, 240 posições, 0 divergências (D144).
- **As duas fixtures novas na TABELA comparativa** (LAB-40). `ensaio-com-promessas` e
  `ensaio-com-testada` existem e são medidas pela ferramenta do LAB-40 e pelas travas, mas
  **não entram na tabela** do LAB-19/LAB-20 — entrariam como duas glebas novas, e isso é
  regerar a tabela inteira (5 glebas × 4 motores × 6 posições de acesso) e a página do
  Jonny. **Não executado** — escopo novo, e vale decidir junto com o LAB-43, que também
  pede regeração.
- **Medir em Antonina a mesma pergunta das três amostragens** (LAB-40, D148). O 33 contra
  1 228 foi medido numa amostragem só; o `ensaio-com-testada` mostrou que o **sinal do
  total muda com o conjunto de variantes**. Medir as três em Antonina diria se aquele caso
  é extremo ou se é a mesma troca vista por um ângulo ruim — e é o que falta para eu poder
  dizer ao Jonny que Antonina é caso único. **Não executado** — escopo novo.
- **LAB-43 · a etiqueta do contrato, que quatro provas declaram errada** (LAB-39, D146).
  `lab25.ts`, `lab26.ts`, `lab28.ts` e `lab30.ts` publicam `contrato: "2"` escrito à mão,
  e **nenhuma entrada deste repositório declara `"2"`** — todas as glebas e as quatro
  fixtures dizem `"1"`. O conserto no código é **uma linha por ferramenta**
  (`entrada.archilly.versao`, como o `lab23.ts` já faz) **mais uma guarda** que confira o
  valor contra o medido, e não só a presença da chave. O que pesa é que a etiqueta só
  muda no arquivo quando a prova é **regerada** — e o LAB-28 são 5 glebas × 4 motores × 6
  posições com Validator e Judge. Proponho **casar com o próximo prompt que regere essas
  provas por outro motivo**. **Não executado** (§1-A); o valor certo está nomeado no D146.
- **Um nome só para cada número do confronto do acesso** (LAB-39, D145). As mesmas três
  contas saem com chaves diferentes nos dois arquivos — `amplitudeDoAcesso_pct` ×
  `maiorAmplitude_pct`, `entreMotores_pct` × `entreOsQuatroMotores_pct`. **Dois nomes para
  um número é meio caminho para dois números**, e foi assim que o D116 começou. Unificar
  mexe na forma de duas provas publicadas **e** na página do Jonny, então vai junto do
  prompt que regerar as provas. **Não executado** — escopo novo.
- **CI para o comando único** (LAB-31, D125). O `conferir.sh` existe, roda tudo e está
  provado que reprova — mas **não existe `.github/workflows` neste repositório**, então
  **nada o executa automaticamente**: quem o roda sou eu, antes do commit, e se eu
  esquecer nada pinta vermelho. Um workflow de uma página resolveria, e ele precisaria
  do `rustup target add wasm32-unknown-unknown` e do Chromium do Playwright no
  executor. ✅ **executado no LAB-38** — e o que falta hoje é só o segredo
  `VIZINHOS_TOKEN`, que é do Jonny (item 6 da página dele).

---

## Histórico — a fila autônoma de 14/09/2026, esgotada

Os cinco rodaram e foram mesclados no mesmo dia.

| # | prompt | entregue em |
|---|---|---|
| LF-01 | Casa em ordem | [`LF-01.md`](../relatorios/LF-01.md) |
| LAB-02 | Recorte pela gleba e pelas restrições — **0 % de via fora da divisa** | [`LAB-02.md`](../relatorios/LAB-02.md) |
| LAB-03 | Relevo: a interpolação medida no traçado, e as glebas-padrão com relevo | [`LAB-03.md`](../relatorios/LAB-03.md) |
| LAB-08 | Testfit × Symbios, lado a lado | [`LAB-08.md`](../relatorios/LAB-08.md) |
| LF-FINAL | Conferência contra o Padrão | [`LF-FINAL.md`](../relatorios/LF-FINAL.md) |

### As propostas daquela fila, e o que o chat decidiu em 15/09

| proposta | destino |
|---|---|
| ressalva do §9.3 — prosa formatada no núcleo | **resolvida: prosa para pessoa é borda, os 17 ficam** (D47) |
| descartar lasca de corte | **resolvida: abaixo do lote mínimo da gleba** (D48) — executa no LAB-05 |
| LAB-04 · straight skeleton | **virou o primeiro da fila nova** |
| reconectar a rede depois do corte | **virou parte do LAB-05** |
| recortar a quadra que atravessa a divisa | **virou parte do LAB-05** |
| delta contra o Padrão 1.2 | **segue esperando** o documento existir |

---

## Histórico — a fila anterior, LAB-00 a LAB-06

A fila original do laboratório, escrita na especificação
([`../referencia/LABORATORIO.md`](../referencia/LABORATORIO.md)) e gravada aqui no LAB-FILA. Ela
**continua valendo como roteiro de longo prazo**; a fila autônoma acima é o que
se executa agora.

| Prompt | Entrega | Condição para começar |
|---|---|---|
| LAB-00 | Investigação dos candidatos e prova mínima de compilação (Symbios Tensor, straight skeleton, PackingSolver; Unreal/Terasology/CityEngine só como referência) | — |
| LAB-01 | Adaptador mínimo do Symbios: terreno do Archilly → mapa de alturas → Symbios → grafo viário de volta, em metros e georreferenciado | LAB-00 concluir "seguir" para o Symbios |
| LAB-02 | Recorte do resultado pelo limite da gleba e pelas restrições (APP, faixa não edificável, cursos d'água) e passagem pelo Validator do Generate | LAB-01 devolver geometria utilizável |
| LAB-03 | Comparação no Judge: Geométrico × Fishbone × Symbios, mesmo terreno e mesmos parâmetros; relatório por etapa (rede viária, quadras, lotes) | LAB-02 passar no Validator |
| LAB-04 | Straight skeleton como componente de subdivisão de quadras, testado contra quadras reais do Generate | LAB-00 escolher a implementação e confirmar licença |
| LAB-05 | Motor vencedor compilado para WebAssembly (ou empacotado como serviço) e provado rodando no navegador com um terreno do Generate | LAB-03 mostrar valor mensurável em pelo menos uma etapa |
| LAB-06 | Entrega ao Generate: peça pronta atrás do contrato de motor, registro de motores, botão liga/desliga por motor, e o teste de que apagar o Lab inteiro não quebra o Generate | LAB-05 |
| LAB-07 | O motor do laboratório de parcelamento na esteira: ida e volta pelo contrato de motor v1, julgado pelo Validator e pelo Judge do Generate | fora da cadeia acima — o motor é da família e o contrato v1 já existia |

**O que foi concluído dessa fila:**

- **LAB-00 — 09/09/2026.** Symbios Tensor segue para a Etapa B/C, restrito aos
  Usos B (rede viária) e C (quadras). Straight skeleton e PackingSolver ficam
  como referência. Ver [`../TRIAGEM.md`](../TRIAGEM.md).
- **LAB-01 — 10/09/2026.** Adaptador mínimo de ida e volta, veredito
  **"geometria utilizável: SIM COM RESSALVAS"**. Ver
  [`../relatorios/LAB01_ADAPTADOR.md`](../relatorios/LAB01_ADAPTADOR.md).
- **LAB-07 — 13/09/2026.** O motor do laboratório de parcelamento atravessa a
  esteira inteira pelo contrato de motor v1, com o mesmo veredito. 47 variantes
  julgadas, 28 401 lotes, 4 132 violações, muito desiguais entre os dez
  partidos. Ver [`../relatorios/LAB-07.md`](../relatorios/LAB-07.md).
- **LAB-04 — liberado, e roda DEPOIS do LAB-02/03, nunca em paralelo.** A
  licença foi confirmada e as duas implementações são copyleft, então a decisão
  já tem resposta: **reimplementar em TypeScript** a partir da literatura
  (Felkel & Obdržálek 1998; Aichholzer et al. 1995/1996), com as duas
  implementações GPL como oráculo. Casos de teste verificados em
  [`../STRAIGHT_SKELETON_ANALYSIS.md`](../STRAIGHT_SKELETON_ANALYSIS.md).
- **LAB-05 e LAB-06 — aguardando**, em cadeia a partir do LAB-03.
