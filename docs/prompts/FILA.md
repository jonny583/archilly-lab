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
