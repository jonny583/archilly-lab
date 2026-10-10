# LAB-77 · O acesso sugerido — item 010 e o adendo que mudou a natureza dele

**10/10/2026.** O item 010 era a minha proposta do LAB-26 §2: medir quanto o resultado depende de
onde está o acesso. **O adendo do Jonny, de 09/10 às 20h12, mudou a natureza do item** — o que
era uma medição de sensibilidade passou a ter **regra urbanística por trás**, e ela é dele.

**Conferido aqui, não no GitHub** (a execução automática do CI está desligada até 1º/11/2026).

---

## 1 · A primeira coisa a medir, porque o adendo mandou

> *"Se o laboratório não souber hoje quais faces dão para rua, **isso é a primeira coisa a
> medir** — e pode ser que as glebas-padrão não digam, o que é um achado sobre as glebas (igual
> ao relevo: nenhuma das cinco tem cota)."*

Medido nas **sete** glebas:

```
7 glebas · 4 declaram algum acesso · 3 declaram NENHUM · 1 diz o segmento ·
0 dizem quais faces dão para via pública
```

| gleba | acessos | diz o `segmento`? | diz as faces com via? |
|---|---|---|---|
| `completo` | **0** | não | **não** |
| `sintetico-50ha-ondulado` | **0** | não | **não** |
| `sintetico-10ha-plano` | **0** | não | **não** |
| `ensaio-47ha` | 1 | não | **não** |
| `geo-antonina` | 1 | não | **não** |
| `ensaio-com-promessas` | 1 | **SIM** | **não** |
| `ensaio-com-testada` | 1 | não | **não** |

**ZERO das sete dizem quais faces dão para via pública**, e o campo não existe no contrato v1 —
não é que esteja vazio: **não há onde**. É o achado, e é sobre as **glebas** e sobre o
**contrato**, não sobre os motores.

### E são SETE, não cinco — o item diz "as cinco glebas-padrão" duas vezes

A lista da tabela do LAB-19 **tem sete desde o LAB-45**, e é a mesma que o `lab28` mede. O número
do item é de um estado anterior do repositório. *É a mesma lição que o LAB-76 pagou um prompt
antes: conferência que não publica o tamanho do universo que leu passa lendo zero.*

### O `segmento` é um TRECHO da divisa, não um índice de face

`ensaio-com-promessas` declara `segmento: {a: {380,0}, b: {420,0}}` com `ponto: null` — **40 m de
divisa**, não uma face. Então o contrato **já tem** idioma para dizer *"o acesso fica neste pedaço
da divisa"*, e é esse idioma que um campo de faces-com-via deveria seguir. **Mas nem `ponto` nem
`segmento` dizem onde há RUA**: os dois falam de onde o acesso está, não de onde a via existe.

---

## 2 · O achado maior: as DUAS metades do universo dependem do mesmo dado que falta

O adendo diz que o universo de posições deixa de ser o perímetro e passa a ser *as faces que dão
para via pública, menos a faixa de esquina*. A primeira metade depender do dado que falta é
evidente. **A segunda não é, e foi o que este prompt descobriu:**

> **A faixa de esquina não é geometria do ANEL: é geometria das RUAS.**

**Esquina é onde duas ruas se encontram**, não onde o anel da gleba muda de direção. Um vértice
entre uma face de rua e o muro do vizinho **não é esquina** — é um canto de terreno, e a regra dos
15 m não fala dele.

Está demonstrado por trava, num quadrado de 100 m com uma só face de rua:

| faces com via | esquinas de rua |
|---|---|
| só a face 0 | **nenhuma** — os vértices 0 e 1 encostam nela, mas do outro lado de cada um há muro |
| faces 0 e 1 (vizinhas) | **uma**, no vértice entre as duas |
| faces 0 e 2 (opostas) | **nenhuma** |
| as quatro | **quatro** |

Se eu tivesse lido o adendo depressa, teria tratado todo vértice do anel como esquina — e a faixa
de 15 m teria mordido cantos que não são esquina de nada. *Antes de eleger a régua, perguntar o
que a coisa é no mundo* (§6, a sexta ocorrência).

---

## 3 · O que se PODE medir sem o dado: um teto e um piso

Sem saber quais faces dão para via, o quanto a regra da esquina tira do perímetro **não é um
número — é um intervalo**:

- **o piso é ZERO**: se nenhum vértice for encontro de duas ruas, a regra não tira nada;
- **o teto é o caso em que TODO vértice é esquina de rua**.

Medido, com a faixa em uso de **15 m** e amostragem do perímetro a passo de 1 m:

| gleba | vértices | perímetro | faixa 15 m | faixa 25 m |
|---|---|---|---|---|
| `completo` | 20 | 5 228 m | 0 a **11,47 %** | 0 a **19,14 %** |
| `sintetico-50ha-ondulado` | 14 | 2 920 m | 0 a **14,38 %** | 0 a **23,97 %** |
| `sintetico-10ha-plano` | 10 | 1 338 m | 0 a **22,48 %** | 0 a **37,42 %** |
| `ensaio-47ha` | 4 | 2 775 m | 0 a **4,40 %** | 0 a **7,28 %** |
| `geo-antonina` | 20 | 5 486 m | 0 a **10,96 %** | 0 a **18,14 %** |
| `ensaio-com-promessas` | 4 | 2 775 m | 0 a **4,40 %** | 0 a **7,28 %** |
| `ensaio-com-testada` | 4 | 2 775 m | 0 a **4,40 %** | 0 a **7,28 %** |

**O teto é calculado por amostragem, e não por fórmula**, de propósito: faixas de vértices
vizinhos **se sobrepõem** em divisa recortada, e somar `2 × faixa` contaria o mesmo trecho duas
vezes — daria teto acima de 100 %. O passo viaja na prova: ninguém compara um teto de passo 1 m
com outro de passo 10 m.

### E as seis posições que o LAB-28 varre, contra a faixa

| gleba | das 6, quantas cairiam na faixa (no teto) | o acesso declarado |
|---|---|---|
| `completo` | 2 | não declara |
| `sintetico-50ha-ondulado` | 2 | não declara |
| `sintetico-10ha-plano` | 3 | não declara |
| `ensaio-47ha` | 2 | **fora** da faixa |
| `geo-antonina` | 1 | **fora** da faixa |
| `ensaio-com-promessas` | 2 | não declara `ponto` |
| `ensaio-com-testada` | 2 | **fora** da faixa |

**Nenhum dos acessos declarados cairia na faixa nem no teto** — e, pela regra 4, não importaria:
*"já se o usuário escolher um ponto na esquina, deixa ele"*. A faixa vale para o que o aplicativo
**sugere**, não para o que ele **permite**.

---

## 4 · O produto: a sugestão, e hoje ela se RECUSA a sair

```
frase: — NENHUMA
porque não: NÃO HÁ O QUE SUGERIR: nenhuma gleba desta casa declara quais faces dão para
via pública, e sem isso qualquer ponto proposto pode estar sobre a divisa do vizinho — a
sugestão plausível e impossível que o adendo proíbe. A curva continua medível; o PRODUTO não.
```

**Esta recusa é a entrega, não a falta dela.** O adendo é explícito: propor acesso por cima da
divisa do vizinho é *"o pior tipo de sugestão: plausível e impossível"*. Eu poderia ter varrido o
perímetro e publicado uma curva bonita — era o que o item 010 pedia **antes** do adendo. Com o
adendo, aquela curva seria um gerador de sugestões impossíveis.

> **Entre uma medição que sai com premissa inventada e uma recusa que nomeia o dado que falta, a
> recusa é a que se pode auditar.**

A máquina está pronta e provada nos dois lados: **dado o campo, a sugestão sai** — a trava monta
*"se o acesso mudar para cá, você ganha 12 lotes"*, na frase dele, com singular para um lote, e
**recusa quando o ganho é zero ou negativo**, porque mudança sem ganho é ruído.

---

## 5 · As cinco regras dele, e o que cada uma virou em código

| regra | o que virou |
|---|---|
| 1 · é **sugestão**, nunca ordem | `sugerirAcesso` devolve uma **frase de ganho**, nunca um veredicto; o acesso do usuário nunca é alterado |
| 2 · posição sem rua não é posição | `FacesComVia` é **entrada declarada obrigatória**; `null` recusa tudo com motivo nomeado |
| 3 · não se faz acesso perto de esquina | faixa **por parâmetro**, padrão 15 m, 25 m documentado — e **trava que reprova** 15 ou 25 escrito no corpo de qualquer função |
| 4 · se ele escolher a esquina, deixa | a posição do usuário **atravessa sempre**, marcada `doUsuario`, até sem o dado declarado |
| 5 · o usuário escolhe de quais ruas aceita | **não é do laboratório**: é tela, e vai ao Generate como item numerado (§7 abaixo) |

**Os 15 e os 25 não moram na lógica**, e isso é trava de estrutura, não promessa: ela varre o
corpo de cada `export function`, sem comentários, e reprova os dois números. Só as **constantes
do topo** podem dizê-los — elas *são* o padrão de fábrica. *Tudo tem padrão de fábrica que o
usuário pode mudar; é como o sal na panela, a gosto.*

**A faixa em uso é 15 m, e o laboratório DIZ que usou** — o adendo manda isso em vez de adivinhar
se a gleba ocupa a quadra inteira, e reconhecer isso é pendência dele.

---

## 6 · QUATRO vezes o defeito estava do MEU lado, e as quatro foram pegas dentro do prompt

**A primeira: a minha trava reprovou o adendo certo.** Ela procurava o literal `"15 metros"`, e no
arquivo a regra está escrita como `**15\n> metros**` — quebra de linha, marca de bloco de citação
**e** negrito, os três dentro do número. **Quarta vez desta forma nesta casa** (LAB-74 §5,
LAB-75 §6, item 008, e esta).

E a lição nova é pior do que a repetição: **o conserto já existia** — inline, dentro de
`disparos-em-vazio.test.ts`, escrito no LAB-75 — e eu reescrevi o erro por não saber que ele
estava lá.

> **Conserto que mora dentro de um teste conserta um teste.** O que mais de uma trava precisa
> chamar mora em `src/` — a mesma lição que o D247 tirou das ferramentas, um prompt antes, agora
> das travas.

O normalizador subiu para `src/texto-das-regras.ts`, as duas travas o chamam, e ele tem travas
próprias — inclusive uma que confere que ele **não afrouxa** o que não é espaço: *"15 metro"* e
*"faixa de esquinas"* continuam reprovando (D248).

**A segunda: eu contei errado as glebas, e a ferramenta me corrigiu.** Eu havia escrito que
*"cinco das sete declaram `acessos: []`"* e que *"zero das sete declaram o `segmento`"*. Rodada a
ferramenta: são **três** sem acesso e **quatro** com, e **uma declara o `segmento`**. Eu tinha
lido **duas** das quatro fixtures e completado o resto de cabeça — a forma do D185, *contar de
memória o que estava ao lado*. O que **não** mudou foi o achado: **zero das sete** dizem as faces
com via (D250).

**A terceira: a régua que conta as ocorrências do §6 PAROU DE MEDIR.** Ao atualizar a §6 para
`VINTE E DUAS`, o `totalDeclarado` saiu **`null`** — o regex capturava **uma palavra só** e o mapa
de literais ia até `vinte`. E o problema não é o nulo: **com o total nulo, a trava da soma não
dispara.** A guarda que existe para a §6 não mentir sobre o próprio tamanho **deixou de medir, em
silêncio, no prompt em que a §6 cresceu**. Terceira vez da pior forma desta casa — a suíte do
`testfit` vermelha por duas semanas (D110), a prova no navegador rodando uma vez em um mês (D123),
o `exit 0, 0 testes` do item 003: *nas três, nada falhou — nada mediu*. Consertada por
**composição** (`lerNumeroEmPalavra` soma `<dezena> e <unidade>`) e não por mais um literal, porque
`"vinte e duas": 22` no mapa consertaria este prompt e quebraria o próximo — e o próximo é certo,
já que a lista do ponto cego só cresce (D251).

**A quarta, e foi o VERDE que a pegou: a minha trava quebrou quando eu marquei o item como
feito.** Ela lia `010-adendo.md`; o item virou `010-adendo-FEITO.md`, que é o que a caixa manda
fazer — e o arquivo de teste passou a **estourar ao carregar**. O verde saiu `765 pass · 1 fail`, e
o `fail` **não era um teste**: era o arquivo inteiro não abrindo. A contagem da lista caiu de 409
para 372, e **foi a queda que delatou** — *teste que não carrega não aparece como reprovado,
aparece como ausente*. Agora o item se acha pelo **número**, nos dois estados (D252).

---

## 7 · O que precisa mudar no vizinho — lista numerada, nunca commit lá (§4)

**Para o Archilly Generate**, que é o dono do contrato e da tela:

1. **Criar no contrato de entrada o campo que diz onde há via pública.** É o que falta para
   qualquer sugestão de acesso existir. Recomendo seguir o idioma que o contrato **já tem** para
   localizar coisa na divisa — o `segmento: {a, b}` que o `ensaio-com-promessas` usa —, e não
   índice de face: índice de face quebra quando o anel é reamostrado, e trecho não.
2. **A tela em que o usuário escolhe de quais ruas aceita acesso** (regra 5 do Jonny, as palavras
   dele: *"seria interessante o usuário de alguma forma poder escolher as ruas que ele permite o
   acesso"*). A ideia nasceu aqui e **o lugar dela é lá**; este laboratório não tem tela.
3. **Onde a sugestão aparece**, quando existir: ela é uma frase com número — *"se o acesso mudar
   para cá, você ganha N lotes"* — e **nunca** uma correção do que o usuário escolheu. A posição
   dele fica no topo da lista, como *"a sua"*.

**Para o levantamento (Geo, `urban-scout-tool`)**, uma linha só:

4. **Nenhum dos sete terrenos diz quais lados têm rua.** É a mesma forma da nascente que não
   viaja: quando o campo existir no contrato, alguém tem de preenchê-lo na captação.

**Os três clones vizinhos ficaram limpos** — nada foi escrito em nenhum deles.

---

## 8 · O que virou pendência do Jonny, e NÃO foi decidido

O adendo manda escrever duas coisas na página dele, em nível de leigo, com a minha recomendação
ao lado, e **não decidir**. Estão na **§9** de `docs/PENDENCIAS_JONNY.md`:

- **9-A · como se reconhece que a gleba ocupa a quadra inteira** (o que separa os 15 m dos 25 m).
  Minha recomendação: quando o terreno tiver **rua em volta de todos os lados**. Enquanto ele não
  responder, o laboratório usa **15 m e diz que usou**;
- **9-B · se a faixa se mede em linha reta ou ao longo da divisa.** Hoje o código mede em **linha
  reta** e isso está **declarado** (`REGUA_DA_FAIXA`), para ninguém confundir com decisão dele.
  Minha recomendação: **ao longo da divisa** — é o que o fiscal mede com a trena, e a linha reta
  pode cortar por fora da calçada em divisa oblíqua.

Mais a §9-C, que não é pergunta: a regra 5 já está anotada para o Generate.

---

## 9 · O que eu NÃO fiz, e por quê

**A curva da sensibilidade ao acesso não foi refeita aqui.** Ela já existe: `sensibilidadeAoAcesso`
varre o perímetro por comprimento de arco, publica `posicoes`/`posicoesMedidas`, trata recusa como
`null`, e `instabilidadeDaOrdem` já responde *"a oscilação muda a ORDEM dos motores?"* — que é a
pergunta 2 do item. Refazer aquilo seria a segunda montagem que o D116 proíbe. **O que faltava não
era a curva: era o universo de posições válidas**, e ele depende do campo que não existe.

Então as três perguntas do item 010 ficam assim:

| a pergunta do item | o estado |
|---|---|
| 1 · de quanto é a oscilação | **já medida** pelo LAB-28/LAB-19, no perímetro inteiro — que o adendo agora diz ser o universo **errado** |
| 2 · ela muda a ORDEM dos motores | **já medida** (`instabilidadeDaOrdem`) |
| 3 · a posição declarada é boa, ruim ou mediana | **não respondível hoje**: 3 das 7 não declaram posição, e as 4 que declaram não dizem se o ponto tem rua |

**E a pergunta 1 ganhou uma ressalva que ela não tinha:** a amplitude publicada foi medida sobre
um universo que inclui posições **impossíveis** — pontos sobre a divisa do vizinho. *Entrada que
ninguém variou é premissa disfarçada de dado*, diz o item; e **variar uma entrada por valores
impossíveis é a mesma doença com o sinal trocado**. A amplitude do acesso continua sendo um piso,
e agora se sabe que ela é um piso **de um universo maior do que o válido**.

---

## 10 · Entrega

| o quê | onde |
|---|---|
| as cinco regras, a faixa, a sugestão | `external-engines/esteira/src/acesso-sugerido.ts` |
| o normalizador e o achador de item (D248, D252) | `external-engines/esteira/src/texto-das-regras.ts` |
| as travas | `external-engines/esteira/tests/acesso-sugerido.test.ts` — **41** |
| a ferramenta | `external-engines/esteira/ferramentas/lab77.ts` · `bun run lab77` |
| a prova | `docs/provas/LAB-77/acesso-sugerido.json` |
| as duas perguntas dele | `docs/PENDENCIAS_JONNY.md` §9 |

**VERDE: 806 travas na esteira + 17 no testfit, 7 passos, `exit 0`. Conferido aqui, não no
GitHub.** O `guardas-sem-clones` do CI vai de **366 para 412**.

**Decisões: D248** (o normalizador num lugar só), **D249** (a esquina é das ruas, e a recusa é a
entrega), **D250** (eu contei as glebas de memória, e a ferramenta me corrigiu), **D251** (a régua
do ponto cego parou de medir ao chegar a vinte e duas), **D252** (trava que cita um item pelo nome
quebra quando o item é concluído).
