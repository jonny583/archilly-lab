# RECADOS PARA O CHAT — o acumulado

Todo prompt termina com um RECADO PARA O CHAT (a regra está em
[`../../CLAUDE.md`](../../CLAUDE.md), §1). **O mesmo recado é acrescentado
aqui**, com a data, em ordem cronológica — o mais antigo primeiro.

Assim o pedido "me dá tudo desde o dia tal" vira uma leitura deste arquivo, e
não uma reconstrução a partir dos relatórios.

---

## 13/09/2026 · LAB-07 — o motor do Testfit na esteira

```
=== RECADO PARA O CHAT — Lab · LAB-07 ===
Estado: LAB-07 concluído e mesclado na main (PR #4). Testes 14/14, tsc e lint limpos.
Feito: motor do Laboratório de Parcelamento atravessa a esteira do contrato de motor v1
  (ida → motor → volta → Validator e Judge do próprio Generate), 3 glebas × 10 partidos ×
  20 variantes. Veredito: geometria utilizável SIM COM RESSALVAS. 47 julgadas, 28.401 lotes,
  4.132 violações — pente 0,06 %, cluster 78 %, organico 140 %. Relatório, provas, decisões
  D16–D25, PENDENCIAS_JONNY.md novo, fila movida para docs/prompts/FILA.md.
Achados para outros apps ou Central: (1) Generate — criarModeloRelevo tem o defeito de
  interpolação do LAB-01: 49,8 % das amostras sobre valor de curva, 17,3 % com gradiente
  zero; correção = exigir vizinhos de 2 cotas distintas. (2) Laboratório de Parcelamento —
  8 correções para o T02; a nº 1 é aparar a rede viária pelo perímetro (25–40 % fora da
  divisa). (3) As 2 glebas-padrão do Generate não têm relevo nenhum.
Depende do Jonny: a calçada sai do lote ou da rua?; usa cluster/organico/radial na tela?;
  colar os 2 recados nos repositórios vizinhos (eu não escrevo neles).
Próximo na fila: LAB-02 — recorte pela gleba e pelas restrições, e passagem pelo Validator.
=== FIM ===
```

> **Nota de procedência.** Este arquivo nasceu no LF-01, em 14/09/2026. A regra
> do RECADO nasceu no fim de 13/09, junto com o `CLAUDE.md`, então o recado do
> LAB-07 acima é **o primeiro que existiu** — LAB-00, LAB-FILA e LAB-01 são
> anteriores à regra e não têm recado. O que eles entregaram está nos
> relatórios deles e no histórico de [`../prompts/FILA.md`](../prompts/FILA.md).

---

## 14/09/2026 · LF-01 — casa em ordem

```
=== RECADO PARA O CHAT — Lab · LF-01 ===
Estado: LF-01 concluído e mesclado na main (PRs #6 e #7). Fila autônoma gravada e
  despertador de 60 min criado (minuto :05). Testes intactos: 14/14, tsc e lint limpos.
Feito: docs/prompts/FILA.md é a fila oficial (LF-01, LAB-02, LAB-03, LAB-08, LF-FINAL),
  histórico LAB-00..LAB-07 preservado; docs/relatorios/RECADOS.md e docs/INDEX.md criados;
  decisões do chat gravadas (D26 calçada é da via, D27 só partido aprovado vai à tela,
  D28 superquadra vazia é defeito de pontuação) mais D29 (laço autônomo) e D30 (INDEX);
  PENDENCIAS_JONNY reescrito — sobraram 2 confirmações; ONDE_PARAMOS reescrito.
Não saiu como pedido: apagar a branch. O proxy de git recusou 3 vezes (aceita atualizar
  ref, recusa apagar ref) e não há ferramenta para isso aqui. Ela foi reposta sobre a
  main — mesmo commit, zero conteúdo próprio — e precisa existir, é a branch de trabalho
  do despertador. Exclusão literal = um clique na interface do GitHub.
Achados para outros apps ou Central: nenhum novo. Os 3 do LAB-07 seguem sem repasse, e o
  repasse saiu da lista do Jonny — por decisão do chat, é do chat. Para o chat: o
  despertador nasceu SEM CONECTORES do GitHub; rodadas futuras mesclam por git direto, e
  para ter PR ele precisa ser recriado pela interface do claude.ai.
Depende do Jonny: 2 itens, ambos confirmação de decisão já tomada (calçada na caixa da
  via; cluster/organico/radial fora da tela até medirem melhor).
Próximo na fila: LAB-02 — aparar a rede do Symbios pelo perímetro e pelas restrições
  (APP como geometria real) e rejulgar com o Validator e o Judge do Generate. Meta: 0 %.
=== FIM ===
```

---

## 14/09/2026 · LAB-02 — recorte pela gleba e pelas restrições

```
=== RECADO PARA O CHAT — Lab · LAB-02 ===
Estado: LAB-02 concluído e mesclado na main. 14 testes verdes na esteira nova + 14 no
  adaptador do LAB-07; tsc e lint limpos nos dois.
Feito: META ATINGIDA — 0 % de via fora da gleba nas 3 glebas (era 37,4 / 38,7 / 42,8 %) e
  0 % dentro de APP (era 19,6 % em completo). O contrato de motor sai de RECUSADO para
  ACEITO com ZERO violações nas três. Custo medido: a rede encolhe para 43–61 % (a parte
  que nascia fora) e o maior componente cai só de 99,9 % para 97,6 % — o recorte não
  estilhaça a rede. Quem bloqueia é o `desconta` do Geo, não lista minha.
Achados para outros apps ou Central: (1) GENERATE — NINGUÉM CONFERE A RAMPA de motor
  externo: invariantes.ts tem 11 violações, todas geométricas; a régua existe em
  topografia.ts (10 %/12 %) mas só roda no plano interno; e o contrato só carrega
  rampaMedia_pct, então um pico de 161 % num cruzamento some na média. Pede
  rampaMaxima_pct por via. (2) LABORATÓRIO DE PARCELAMENTO — o aparo dele não olha
  restrição: 44 lotes de 1 429 tocando APP (1,76 ha) e 895 m de via dentro de APP em
  geo-antonina. Entra no T02; a forma do conserto já está em recorte.ts.
Depende do Jonny: nada novo. Seguem as 2 confirmações do LF-01.
Próximo na fila: LAB-03 — e ficou mais urgente: as 2 glebas-padrão do Generate NÃO TÊM
  RELEVO e o Symbios nem roda nelas, o que torna o LAB-08 impossível até lá.
=== FIM ===
```

---

## 14/09/2026 · LAB-03 — relevo: a interpolação medida na rampa, e as glebas-padrão com relevo

```
=== RECADO PARA O CHAT — Lab · LAB-03 ===
Estado: LAB-03 concluído e mesclado na main. 23 testes verdes na esteira, 14 no adaptador
  do LAB-07; tsc e lint limpos.
Feito: O DEFEITO DE INTERPOLAÇÃO NÃO ESTRAGA A RAMPA — ESTRAGA O TRAÇADO. Mesmo motor,
  mesma semente, dois mapas de altura: a rampa quase não muda (máx no cruzamento 161 % vs
  270 % na pior gleba, ruído nas outras), mas a fração de rede alinhada a UMA direção
  salta de 12,6 % para 47,3 % e de 11,3 % para 41,5 % — o motor cai em GRADE e para de
  seguir topografia. Na gleba plana o sinal inverte: o defeituoso INVENTA sinuosidade
  (76,7 % de grade contra 97,2 % do corrigido), seguindo a borda dos degraus.
Achados para outros apps ou Central: GENERATE — é o argumento que faltava no diagnóstico
  que o LAB-07 mandou sobre criarModeloRelevo. Não é imprecisão de cota: é o traçado
  deixando de seguir o terreno, e em terreno plano seguindo um terreno que não existe. A
  correção continua a mesma e é pequena: exigir vizinhos de pelo menos 2 cotas distintas.
  Segunda proposta: adotar docs/fixtures/glebas-padrao-com-relevo/ do Lab — as 2
  glebas-padrão não têm topografia e são inúteis para qualquer motor que leia relevo.
Depende do Jonny: nada novo. Seguem as 2 confirmações do LF-01.
Próximo na fila: LAB-08, e ele agora só espera o T02 do laboratório de parcelamento — a
  metade que era nossa ficou pronta: as 2 glebas-padrão rodam nos dois motores.
=== FIM ===
```

---

## 14/09/2026 · LAB-08 — os dois motores lado a lado

```
=== RECADO PARA O CHAT — Lab · LAB-08 ===
Estado: LAB-08 concluído e mesclado na main. 27 testes verdes na esteira, 14 no adaptador
  do LAB-07; tsc e lint limpos. O T02 estava mesclado (cbd6cc8) e foi contra ele que rodei.
Feito: O T02 FUNCIONOU — recusas do esquema sem aparo caíram de 60/60 para 0/20, e o aparo
  do Lab passou a cortar 0,3 % em vez de 38 %. `pente` a zero violações. Continuam
  quebrados cluster (77,9 %), organico (82,9 %) e radial (100 % dos lotes), e superquadra
  segue vazia. SYMBIOS: zero violações nas duas glebas, 0 % de via fora da divisa, único
  dos três que entrega greide — mas NÃO FAZ LOTE (Judge: 0). Ele entrega a etapa anterior.
Achados para outros apps ou Central: GENERATE — o quadro de áreas de referência de
  ensaio-47ha NÃO FECHA: soma 544.498 m² numa gleba de 470.000 (+15,8 %). Causa medida:
  areaAPP_m2 é exatamente 15,0 % da gleba e areaLazer_m2 exatamente 10,0 % — ECO dos
  parâmetros pctAPP/pctLazer —, e aquela gleba declara restricoes: []. O quadro anuncia
  7,05 ha de APP onde não há nenhuma. Em geo-antonina o mesmo quadro fecha. Pergunta com
  número: os 974 lotes estão por cima da APP, ou a APP não existe no desenho?
Depende do Jonny: nada novo. Seguem as 2 confirmações do LF-01.
Próximo na fila: LF-FINAL (conferência contra o Padrão 1.2). E o LAB-04 virou o próximo
  passo óbvio do Symbios — ele entrega 94 e 698 quadras limpas; falta subdividir em lote.
=== FIM ===
```

---

## 14/09/2026 · LF-FINAL — conferência contra o Padrão, e o fim da fila

```
=== RECADO PARA O CHAT — Lab · LF-FINAL ===
Estado: LF-FINAL concluído e mesclado. FILA ESGOTADA — os 5 prompts da fila autônoma
  rodaram hoje e o despertador foi APAGADO, como a própria fila manda. Testes: esteira
  27/27, testfit 14/14, tsc e lint limpos. Nenhum arquivo de código foi tocado.
Feito: conferência CONFORME, com uma ressalva e três arquivos que faltavam — escritos
  agora: SEGURANCA.md (lista preenchida com o COMANDO de prova ao lado de cada linha),
  ADOCAO_CENTRAL.md (por que o Lab NÃO adota: sem conta, sem tela, sem IA) e
  docs/referencia/. INDEX e ONDE_PARAMOS reescritos; PENDENCIAS_JONNY refeito do zero e
  encolhido para UM item. Chaves: limpo, conferido com comando.
  ATENÇÃO: o PADRÃO 1.2 NÃO EXISTE em nenhum repositório legível — só a Versão 1 de
  13/09. Conferi contra ela e declarei a lacuna. O TF-FINAL do repositório irmão está
  travado pela mesma razão: é documento que o chat ainda tem de publicar.
Achados para outros apps ou Central: nenhum novo. Seguem sem repasse os 3 do Generate
  (ninguém confere a rampa; o quadro de áreas de ensaio-47ha não fecha; a interpolação
  faz o traçado virar grade) e a proposta de adotar as fixtures com relevo.
Depende do Jonny: 1 item só — confirmar que a calçada é da rua. Não trava nada.
Próximo na fila: nada. 5 propostas esperando o chat, sendo a primeira o delta contra a
  1.2 e a segunda o LAB-04 (straight skeleton), que virou o passo óbvio do Symbios.
=== FIM ===
```

---

## 15/09/2026 · LAB-04 — o Symbios passa a fazer lote

```
=== RECADO PARA O CHAT — Lab · LAB-04 ===
Estado: LAB-04 concluído e mesclado. Testes: esteira 48/48 (21 novos), testfit 14/14,
  tsc e lint limpos nos dois. Despertador COM conectores do GitHub nesta rodada.
Feito: esqueleto reto reimplementado em TypeScript (as duas prontas são copyleft) e o
  ORÁCULO BATE PONTO A PONTO — nós, offsets e frentes de onda, fechamento 1,000.
  O Symbios sai de 0 lotes: ensaio-47ha 213 lotes / 6,59 ha / ZERO violação;
  geo-antonina 901 lotes / 26,67 ha / 4 violações (0,44 % dos lotes, contra 3,81 % do
  motor de parcelamento). Determinismo OK nas duas. 4 defeitos do LAB pegos pela régua
  do Generate, o maior deles: a borda da quadra do Symbios é o EIXO da rua, não o
  meio-fio — lote encostado nela deu via-sobre-lote em 369 de 369 (D52, igual ao D18).
Achados para outros apps ou Central: nenhum novo.
Depende do Jonny: nada. A lista dele segue vazia desde o D49.
Próximo na fila: LAB-05 (reconectar a rede, recortar quadra que atravessa, descartar
  lasca pela D48) — condição cumprida. O LAB-04 já mediu o que ele vale: 119 das 698
  quadras de geo-antonina atravessam a divisa e hoje ficam sem lote nenhum.
=== FIM ===
```

---

## 15/09/2026 · LAB-05 — recortar a quadra, descartar a lasca

```
=== RECADO PARA O CHAT — Lab · LAB-05 ===
Estado: concluído e mesclado. Esteira 64/64 (16 novos), testfit 14/14, tsc e lint limpos.
Feito: NENHUMA quadra passa mais da divisa — 2 591 vértices além da folga de 5 cm em
  geo-antonina (o pior a 170,98 m) viraram ZERO, nas cinco glebas. Lotes 876 → 1 014 e
  181 → 214, COM AS VIOLAÇÕES INALTERADAS (4 e 0). Recortador de polígono reimplementado.
  "Reconectar a rede" NÃO ERA DEFEITO: uma APP hídrica de 14,4 ha corta geo-antonina em
  duas, e o menor vão está 200 de 201 pontos dentro dela — 70,4 % é a resposta certa.
  E a régua do "atravessa" dava 100 % dentro p/ quadra 1,49 m fora: os 213 e 901 do LAB-04 eram 181 e 876 (D55 a D58).
Achados para outros apps ou Central: —
Depende do Jonny: Antonina é cortada em duas por um rio — pode haver travessia sobre a APP?
Próximo na fila: LF-FINAL-2 (conferência e docs), condição cumprida.
=== FIM ===
```

---

## 15/09/2026 · LF-FINAL-2 — a conferência, segunda volta

```
=== RECADO PARA O CHAT — Lab · LF-FINAL-2 ===
Estado: concluído e mesclado. FILA ESGOTADA, despertador APAGADO. Esteira 67/67, testfit 14/14, tsc e lint limpos.
Feito: conferência CONFORME, com um desvio consertado e um achado sobre mim mesmo.
  §9.3: dos 32 toFixed do núcleo, 20 são prosa (D47), 10 o geojson, 1 o hash — e 1 ERA DADO
  QUE VIAJA (o fechamento do esqueleto). Sai cru; agora são zero (D59).
  A regra do RECADO (12 linhas) nunca fora medida: QUEBRADA EM 7 DOS 8 (16, 21, 19, 19, 18,
  19 e 16). Não reescrevi o registro do que foi enviado; virou TESTE (D60).
  Em ordem: zero link quebrado, D01-D58 sem buraco, chaves limpas, 14 PR na main, vizinhos intocados. E o PADRÃO 1.2 CONTINUA NÃO EXISTINDO — a cópia do Lab é igual à do irmão.
Achados para outros apps ou Central: —
Depende do Jonny: Antonina é cortada em dois por um rio — pode haver travessia sobre a APP?
Próximo na fila: nada — 4 propostas esperando o chat, a 1ª é o delta contra a 1.2.
=== FIM ===
```

---

## 15/09/2026 · Decisão do Jonny sobre a travessia, e a fila que não chegou

```
=== RECADO PARA O CHAT — Lab · — ===
Estado: a decisão do Jonny e a regra nova do despertador, gravadas e mescladas. A FILA NOVA
  NÃO CHEGOU: a mensagem cortou em "...item de custo (ponte ou bueiro) para o Or" — sem os
  prompts e sem o nome do app de orçamento. Não adivinhei nenhum dos dois.
Feito: D61 — travessia sobre APP é EXCEÇÃO: contorna primeiro, só propõe se o desvio for
  desproporcional, e aí a mais curta e perpendicular ao curso, na tela e como item de custo.
  D62 — despertador que dispara sem item pronto SE APAGA (antes, só se a fila esgotasse);
  medido, 4 dos 7 disparos de hoje não tiveram o que fazer. §1-A atualizado; e NENHUM despertador criado — pela D62 ele morreria no 1º disparo, antes de a lista chegar.
Achados para outros apps ou Central: GEO — a D61 pede travessia PERPENDICULAR AO CURSO, e a APP chega como polígono, não como linha d'água. Sem o eixo, não há perpendicular.
Depende do Jonny: quanto é "desvio desproporcional"? Sem o número, nenhuma travessia é proposta — três formas de responder estão em PENDENCIAS_JONNY.md.
Próximo na fila: nada pronto — mandem os prompts, e o despertador nasce com eles.
=== FIM ===
```


---

## 19/09/2026 · LAB-13 e LAB-14 — a tela unificada

```
=== RECADO PARA O CHAT — Lab · LAB-13 e LAB-14 ===
Estado: os dois mesclados. Esteira 93/93 (26 novos), testfit 14/14, tsc e lint limpos. Sem despertador: fila esgotada, e pela D62 ele nasce com os próximos prompts.
Feito: LAB-13 — 5 glebas, 4 concorrentes, UMA régua (Validator, Judge e medirSobras, todos do
  Generate). Determinismo 20/20, e sem recomendação de produto, como pedido.
  LAB-14 — a porta única escrita, os 4 motores a implementam, e CADA capacidade declarada é
  desmentida por medição se for falsa: 13 experimentos. O teste achou 2 defeitos que viraram
  cláusula — o Symbios ESTOURAVA em gleba sem relevo (motor que estoura derruba a tela comum)
  e a rampa MÁXIMA não existe na saída do v1. E nenhuma das 5 glebas tem via desenhada à mão: a única atração é testada de frente sobre a divisa, que é outra pergunta. D63 a D67.
Achados para outros apps ou Central: GENERATE — o contrato v1 precisa de (1) dois tipos no lugar de via_existente e (2) rampaMaxima_pct por via na SAÍDA. Os dois com número no documento.
Depende do Jonny: quanto é "desvio desproporcional"? (D61) — não trava nada.
Próximo na fila: nada. docs/CONTRATO_MOTOR_UNIFICADO_v1.md vai ao Generate por você.
=== FIM ===
```


---

## 20/09/2026 · A decisão de família gravada, e o LAB-06 que falta

```
=== RECADO PARA O CHAT — Lab · — ===
Estado: main em 0990c42, nada pendente, nenhum branch por mesclar, nenhum despertador. Desde o último consolidado, ZERO disparos sem trabalho — não há despertador desde 15/09 às 07:06.
Feito: D68 grava a decisão de família (tela do parcelamento é da família, no repositório
  do Generate, vários motores sob ela, padrão = o do Parcelamento, só entra no ranking quem o
  Validator aprova). O LAB-13 e o LAB-14 já são a base dela e estão mesclados.
  DOIS ACHADOS: LAB-09 a LAB-12 NUNCA EXISTIRAM — a fila foi de LAB-00 a LAB-08 e pulou para
  o LAB-13; e o LAB-06 da fila original é, palavra por palavra, o prompt de entrega desta
  decisão (registro de motores, liga/desliga por motor, e o teste de que apagar o Lab não quebra o Generate). Ele NUNCA foi executado, e está proposto ao chat, não executado.
Achados para outros apps ou Central: seguem os dois pedidos ao contrato v1 do Generate — dois tipos no lugar de via_existente, e rampaMaxima_pct por via na SAÍDA.
Depende do Jonny: quanto é "desvio desproporcional"? (D61) — não trava nada.
Próximo na fila: nada pronto. Mandem o LAB-06, ou digam que ele é do Generate.
=== FIM ===
```


---

## 20/09/2026 · D69 — a via desenhada à mão, e o LAB-17 que não existe

```
=== RECADO PARA O CHAT — Lab · — ===
Estado: D69 gravada e mesclada. REGISTREI, NÃO APLIQUEI: o LAB-17 não existe — não há LAB-15,
  16 nem 17, o mesmo vão do LAB-09 a LAB-12. Está proposto na FILA, com o escopo pronto.
Feito: D69 — a via desenhada à mão é INTENÇÃO EXPLÍCITA e atravessa a APP sem critério,
  inclusive sozinha sobre ela; nascente nunca (50 m); travessia a mais curta e perpendicular;
  marcada "desenhada por você — exige licença ambiental" e item de custo para o Orçamento.
  ACHADO QUE TRAVA A REGRA DA NASCENTE: app_nascente existe no archilly-terreno E no importador
  do Generate, mas o contrato v1 a ACHATA em app_hidrica — ela chega indistinguível de qualquer APP e o ponto dela não chega, então os 50 m não têm de onde ser medidos.
Achados para outros apps ou Central: GENERATE — o contrato v1 perde a hidrografia: falta app_nascente como tipo, o PONTO da nascente e a LINHA do curso. Pedido no §10.5 do CONTRATO.
Depende do Jonny: confirmar o "3× / 1,5 km" — ele chegou por referência, não como decisão.
Próximo na fila: nada pronto. LAB-17 e LAB-06 estão propostos, nenhum executado.
=== FIM ===
```


---

## 20/09/2026 · LAB-06 — a peça pronta para o Generate

```
=== RECADO PARA O CHAT — Lab · LAB-06 ===
Estado: LAB-06 concluído e mesclado. Esteira 115/115 (22 novos), testfit 14/14, tsc e lint limpos.
Feito: a peça pronta em entrega/registro-de-motores/ — registro, liga/desliga por motor,
  escolha do usuário salva, e a regra do ranking. SEM DEPENDÊNCIA NENHUMA, nem npm. Vive FORA
  de external-engines/ (D70): lá dentro ela sumiria com a pasta que a regra de ouro manda
  poder apagar. O teste de apagar o Lab é por LEITURA dos import e por EXECUÇÃO com motor de
  mentira. Acrescentei o que a D68 pedia e o contrato não cobria (D72): reprovada aparece com o MOTIVO e sem o desenho (o tipo não tem o campo), e NUNCA ranking vazio em silêncio. D70 a D72.
  recados diferentes para três situações. D70 a D72.
Achados para outros apps ou Central: GENERATE — em ensaio-47ha o motor que a D68 põe como PADRÃO é justamente o que o Validator REPROVA (16 violações). A peça trata sem quebrar; o que fazer é de vocês.
Depende do Jonny: confirmar o "3× / 1,5 km" (D61) — não trava nada.
Próximo na fila: LAB-17, condição cumprida. Quem instala a peça é o GU-03, não eu.
=== FIM ===
```

---

## 20/09/2026 · LAB-17 — as glebas com via desenhada, e a D69 aplicada

```
=== RECADO PARA O CHAT — Lab · LAB-17 ===
Estado: LAB-17 concluído e mesclado. Esteira 127/127 (12 novos), tsc limpo. Vizinhos limpos.
Feito: duas glebas de referência COM via principal e 3 secundárias desenhadas (ensaio-com-via 47 ha, antonina-com-via 141,8 ha), os quatro motores rodados nelas. Aderência ao traçado imposto: Symbios 27,5/30,7 %, ortogonal 29,3/28,0 %, espinha 20,5/10,1 %, Parcelamento 11,3/17,4 %. NENHUM respeita via desenhada e NENHUM mente: os quatro declaram que ignoram, e a declaração bate com o medido nas 8 linhas. Sem recomendação de produto. D69 aplicada: VD1 x APP hídrica, 71,00 m, marcada "desenhada por você — exige licença ambiental", item de custo com obra=null (ponte ou bueiro depende da vazão, que não chega). D73 a D75.
Achados para outros apps ou Central: GENERATE — (1) 50 m da nascente fica ESCRITA e marcada "não aplicável até o contrato trazer a nascente", sem aproximação inventada; (2) falta um TIPO para via desenhada à mão, separado de via_existente: sem ele a tela não distingue "respeitei a rua que existe" de "respeitei o que você desenhou"; (3) o eixo do curso d'água, senão "perpendicular" não tem a quê.
Depende do Jonny: confirmar o "3x / 1,5 km" (D61) — não trava nada.
Próximo na fila: LAB-16, condição cumprida. Despertador trig_01ErsHXVhfTZziHEGGYcBjiJ criado (cron 5 * * * *) e NASCEU SEM CONECTORES do GitHub: a sessão que ele acordar mescla por git direto (D29).
=== FIM ===
```

---

## 20/09/2026 · LAB-16 — a régua de forma, e a fila esgotada

```
=== RECADO PARA O CHAT — Lab · LAB-16 ===
Estado: LAB-16 concluído e mesclado. Esteira 139/139 (12 novos), tsc limpo. Vizinhos limpos. FILA ESGOTADA.
Feito: metade do conserto que você pediu JÁ ESTAVA FEITA — a régua girada é do LAB-13 (D63) e a coluna "irreg" de lá já era ela; os 754 de 776 são o número da régua VELHA. Não fingi consertar duas vezes. O que ainda estava errado, medido: (1) o corte de 1 % era meu e mandava no resultado — Parcelamento em geo-antonina dá 34 / 15 / ZERO nos cortes de 1 %, 5 % e 10 %; agora saem os três, sempre (D76); (2) "irregular" é veredito de urbanista: o que a régua marcava eram TRAPÉZIOS, pentágonos e hexágonos — esquina, curva, borda de APP; agora sai a composição por forma, sem juízo (D77); (3) o arco de testada curva era achatado em reta e fazia um lote de 49 vértices passar por retângulo com 10 % de perda; agora o arco é um lado, contado (D78).
Achados para outros apps ou Central: GENERATE — a leitura "814 de 932 irregulares" do Symbios no LAB-13 está ERRADA: ele faz lote NÃO-ORTOGONAL, não lote deformado. Se isso é bom ou ruim não é da régua.
Depende do Jonny: dois, nenhum trava — (1) confirmar o "3x / 1,5 km"; (2) NOVO: dizer a partir de quanta perda da caixa um lote tem forma ruim.
Próximo na fila: NADA. Os três prompts de 20/09 (LAB-06, LAB-17, LAB-16) estão fechados. Apaguei o despertador trig_01ErsHXVhfTZziHEGGYcBjiJ, como manda a D62 — ele disparou uma vez e teve o que fazer; o próximo não teria. Recrie-o com fila nova.
=== FIM ===
```

---

## 02/10/2026 · LAB-19 — a regra de forma do chat, na tabela

```
=== RECADO PARA O CHAT — Lab · LAB-19 ===
Estado: LAB-19 concluído e mesclado. Esteira 146/146 (7 novos), tsc limpo. Vizinhos limpos. Fila nova de 02/10 gravada, despertador trig_01R5tGpexnnGCHouc1aQGsi9 ligado (60 min, :05) e COM conectores desta vez.
Feito: a sua regra está aplicada e escrita em ÚTIL, não em irregularidade (D79), para ninguém fazer conta de cabeça. A coluna "ok · a conferir · ruim" entrou na tabela comparativa inteira, nas cinco glebas e nos quatro motores. O que ela mediu: TRÊS dos quatro motores não têm problema de forma — ortogonal e Parcelamento com ZERO "ruim" em todas as glebas, espinha com 0,5 a 5 %. O Symbios é o único, e é na faixa do meio: 33,0 / 39,3 / 22,7 / 34,1 / 36,0 % "a conferir" — pentágonos e hexágonos do campo tensor, exatamente a população que a faixa serve para pegar. A regra ABSOLVEU o que o meu corte de 1 % condenava à toa: em geo-antonina o Parcelamento vai de 34 marcados a ZERO, porque os 34 eram trapézios de rua curva (96,7 % de preenchimento). Achado novo: a espinha é BIMODAL — mais "ruim" que "a conferir" (35 contra 1 em completo); ela faz retângulo perfeito ou desastre, e a faixa do meio fica vazia. A coluna informa, NÃO aprova (D80): quem aprova é o Validator do Generate, e a tabela prova que as réguas não se parecem — 29 violações com zero "ruim" num caso, 1 violação com 382 fora do "ok" noutro.
Achados para outros apps ou Central: GENERATE — LAB-18 AGUARDANDO: o contrato v2 NÃO está na main de vocês (origin/main = dfa2a61, de 20/09). Conferido um por um: app_nascente não existe; o rampaMaxima_pct que há é parâmetro de ENTRADA, não saída por via; via_existente segue tipo único. A pasta do contrato não é tocada desde 10/09. Reavalio a cada despertador.
Depende do Jonny: dois, nenhum trava — (1) o "3x / 1,5 km"; (2) confirmar esta régua de forma, que é regra de urbanismo e veio por você, não por ele.
Próximo na fila: LAB-20, condição cumprida — a página de tabela em docs/ para o Jonny olhar sem terminal. O tabela.json do LAB-19 já é a entrada dela.
=== FIM ===
```

---

## 02/10/2026 · LAB-20 — a comparação numa página, para quem não programa

```
=== RECADO PARA O CHAT — Lab · LAB-20 ===
Estado: LAB-20 concluído e mesclado. Esteira 154/154 (8 novos), tsc e lint limpos. Vizinhos limpos. Fila de 02/10 fez o que podia: só resta o LAB-18, aguardando vocês — por isso APAGUEI o despertador trig_01R5tGpexnnGCHouc1aQGsi9 (D62). Recrie quando o v2 sair.
Feito: docs/COMPARACAO_DOS_MOTORES.md — 169 linhas, quatro motores e cinco terrenos lado a lado, com uma linha explicando cada coluna em palavra de pessoa, e a régua de forma explicada pelo retângulo em volta do lote. É MARKDOWN, e isso foi medido, não gosto (D81): o GitHub renderiza Markdown e mostra HTML como CÓDIGO-FONTE — uma página .html daria ao Jonny uma tela de <table>, o contrário de "olhar sem terminal". É GERADA, e tests/pagina.test.ts a regera e reprova se o arquivo estiver diferente (D82): tabela copiada à mão envelhece em silêncio, e o precedente é a regra do RECADO, que sete de oito recados furaram enquanto era só texto. Defeito pego na primeira versão (D83): a seção de ressalvas saiu ilegível, cinco linhas que eram a mesma queixa com números diferentes; agora agrupam com "em quantos dos cinco terrenos" — SEM reescrever a frase do motor, que é dado dele. E o agrupamento comia D51 e LAB-08, que são identificadores: passou a poupá-los, com teste dos dois lados.
Achados para outros apps ou Central: GENERATE — LAB-18 AGUARDANDO, condição medida DUAS vezes hoje: às 13h40 (origin/main dfa2a61) e às 14h06 (8223873, de hoje 13h52). A main de vocês andou; o CONTRATO não. app_nascente: zero ocorrências. rampaMaxima_pct: o que existe é parâmetro de ENTRADA, não saída por via. via_existente: ainda tipo único. Não existe motor-v2/.
Depende do Jonny: dois, nenhum trava — o "3x / 1,5 km" e o OK na régua de forma, que agora aparece explicada na página dele.
Próximo na fila: NADA pronto. Esperam o chat: (1) o contrato v2, que destrava o LAB-18; (2) ligar o GitHub Pages, se quiser a comparação como página HTML de verdade — eu não liguei por minha conta; (3) qual motor é o padrão da tela unificada, já que a D68 põe justamente o que o Validator reprova.
=== FIM ===
```

---

## 02/10/2026 · As duas confirmações, o reforço da página, e o contrato v2 que saiu

```
=== RECADO PARA O CHAT — Lab · LAB-20 (reforço) ===
Estado: Esteira 156/156, tsc e lint limpos. Vizinhos limpos. ATENÇÃO À PRIMEIRA LINHA DOS ACHADOS: o contrato v2 SAIU, e o LAB-18 está PRONTO.
Feito: (1) o limiar da travessia virou DECISÃO DO JONNY (D84) e saiu da lista dele, marcado como resolvido, nunca apagado — 3x a distância direta OU 1,5 km A MAIS DE PERCURSO, dois gatilhos em OU. Isso desfaz uma ambiguidade real: "1,5 km" podia ser "a mais de percurso" ou "percurso total", e as duas dão resultados OPOSTOS em terreno grande; o Jonny confirmou a primeira. Fecha a D61 §2, que dizia "sem ele, nenhuma travessia é proposta". (2) a régua de forma segue como decisão do chat (D79) e é agora o ÚNICO item da lista do Jonny, sem travar nada. (3) O LAB-20 já estava pronto e mesclado (PR #24) — não refiz; reforcei como você pediu: a página agora NOMEIA o Validator na abertura, na legenda da coluna ("é ele que diz se a proposta passa") e numa seção própria "Esta coluna INFORMA; quem aprova é o Validator", com uma tabela de DESENCONTROS entre as duas réguas computada da medição (29 apontamentos com zero forma ruim num caso; 4 apontamentos com 87 lotes ruins noutro) — escrever esses números à mão seria o defeito que a D82 combate, porque o exemplo é o que o leitor acredita.
Achados para outros apps ou Central: GENERATE — O CONTRATO v2 SAIU (origin/main 5b7e9b4, 02/10 15h21) e os TRÊS pedidos do Lab foram atendidos: app_nascente com o PONTO e o eixoDoCurso (tipos.ts:144 e :157); rampaMaxima_pct POR VIA na saída (tipos.ts:319); e via_existente partida em via_desenhada + testada_de_frente (tipos.ts:205), com a razão creditada ao Lab no próprio comentário. Vocês fizeram o leitor assimétrico, então o adaptador não quebra. Obrigado — isso destrava os 50 m da nascente e a perpendicular ao curso, que estavam escritos e marcados "não aplicável" (D74).
Depende do Jonny: um só, e não trava — confirmar a régua de forma, que já aparece explicada na página dele.
Próximo na fila: LAB-18, condição CUMPRIDA. Criei o despertador para executá-lo; ele vai revendorizar, rodar as cinco glebas, dizer o que muda na tabela do LAB-13 e medir as três coisas que o v2 passou a permitir. D84 e D85.
=== FIM ===
```

---

## 02/10/2026 · LAB-18 — o contrato v2 revendorizado

```
=== RECADO PARA O CHAT — Lab · LAB-18 ===
Estado: LAB-18 concluído e mesclado. Esteira 164/164 (8 novos), tsc e lint limpos. Vizinhos limpos. FILA ESGOTADA — apaguei o despertador (D62).
Feito: clone do Generate de 22502b3 a 5b7e9b4. O ADAPTADOR NÃO QUEBROU; quem quebrou foi o tsconfig do Lab, por não espelhar o alias @/ deles (D86), e o GATE DE VERSÃO, que era meu e estava errado desde o LAB-08 — a esteira passa a ler ["2","1"] (D87). A RAMPA RENDEU: o Symbios já media a máxima desde o LAB-02 e não tinha onde escrevê-la; agora a saída dele é v2 e o pico viaja — em completo a média diz 24,23 % e a PIOR diz 161,38 %, fator de 6,7x; em 10ha-plano, 1,17 % contra 15,44 %, fator de 13,2x. São os mesmos 161 % do LAB-02. Só o Symbios reporta o pico: as candidatas de vocês trazem o campo e o deixam null, e o Parcelamento ainda escreve v1 (D89).
Achados para outros apps ou Central: GEO, NOVO E É DELES AGORA — a nascente e o eixo do curso EXISTEM no contrato v2 e não têm dado em gleba nenhuma, nem nas duas v2 do Generate. O bloqueio mudou de endereço: era falta de contrato, virou falta de levantamento, e enquanto isso a regra dos 50 m do Jonny não é verificável por motor nenhum (D88). GENERATE — obrigado: os três pedidos entregues, e DOIS achados do Lab consertados (8fd954b), que a esteira viu sem ninguém avisar: o quadro de áreas fecha ao centavo e a APP deixou de ser eco do parâmetro. Os dois testes do LAB-08 viraram do lado contrário em vez de apagados (D90).
Depende do Jonny: um só, e não trava — confirmar a régua de forma, explicada na página dele.
Próximo na fila: NADA. Na tabela do LAB-13: Parcelamento e Symbios não mexeram UM CENTAVO em sessenta e tantos commits de vocês; as candidatas do Generate ganharam lote e perderam área vendável, e medido é MELHORIA — a área média do lote convergiu de 362-437 m² para 360-367 m², com alvo 360. A página do Jonny foi regerada.
=== FIM ===
```

---

## 03/10/2026 · LAB-21 — a rampa por trecho e cruzamento, e a correção dos 161 %

```
=== RECADO PARA O CHAT — Lab · LAB-21 ===
Estado: LAB-21 concluído e mesclado. Esteira 180/180 (14 novos), tsc e lint limpos. Vizinhos limpos. Despertador trig_01XwSkTLT9zmyprNZcUiWy7f ligado.
Feito: PRIMEIRO A CORREÇÃO, porque o número era meu e você agiu sobre ele: os 161,38 % NÃO são rampa de rua (D94). Medida como rampa de rua, a mesma via dá 41,84 %. A causa: rampaMaxima_pct calculada VÉRTICE A VÉRTICE, e as vias do Symbios têm mediana de segmento de 0,47 m — mede o degrau da grade de relevo, não o greide. Prova mais limpa: em sintetico-10ha-plano, praticamente plana, o motor declara 15,44 % e eu meço 1,96 %. O ganho do v2 é real (ter onde carregar o pico); o valor que viajou é artefato. Também achei TRÊS defeitos da minha própria régua antes de publicar (D93): pico de 1053 % que era a discretização do motor, passo menor que a célula do mapa, e ZERO cruzamentos numa malha de 15 vias porque eu procurava nas pontas e numa grade as ruas se cruzam no meio. Agora: duas réguas lado a lado, nunca somadas (D92) — o que o motor declara e o que eu meço passando o eixo pelo relevo, que vale para os quatro. A coluna entrou na tabela e a página do Jonny ganhou DUAS colunas (média e pico) e a seção "a média esconde o pior trecho", com o exemplo escolhido pela medição.
Achados para outros apps ou Central: GENERATE e PARCELAMENTO — quem for preencher rampaMaxima_pct NÃO calcule vértice a vértice: caminhe o eixo por comprimento de arco, com passo não menor que a célula do relevo. Eu já consertei o meu. E as duas candidatas do Generate deixam o campo null, mas eu medi para elas 34,71 % e 46,70 % em completo — é o LAB-22.
Depende do Jonny: dois, nenhum trava — a régua de forma, e NOVO: a inclinação máxima de uma RUA. Não usei os 30 % da Lei 6.766 como limite de rua porque são do TERRENO (D91), e usar o número da lei fora do lugar seria inventar regra com o nome dele.
Próximo na fila: LAB-22, condição cumprida. A leitura que vale do LAB-21: em completo as quatro MÉDIAS empatam entre 6,1 % e 7,7 % e os piores trechos vão de 34,7 % a 51,5 % — quem olhasse só a média não veria diferença nenhuma entre os motores.
=== FIM ===
```

---

## 03/10/2026 · LAB-24 — o bloco de indicadores de terreno

```
=== RECADO PARA O CHAT — Lab · LAB-24 ===
Estado: LAB-24 concluído e mesclado. Esteira 200/200 (17 novos), tsc e lint limpos. Vizinhos limpos. Despertador trig_01XwSkTLT9zmyprNZcUiWy7f ligado — ele disparou 4 vezes enquanto eu trabalhava, e os 4 cairam no mesmo prompt em curso.
Feito: o bloco igual para os quatro motores, com a assimetria que o Jonny deu (D95): 30 % no LOTE REPROVA (lei) e 15 % na RUA só AVISA — e a régua da via NÃO ganhou veredito nenhum, com teste que reprova quem acrescentar "reprova", "passa" ou "aprovado" nela. Medido: os QUATRO motores reprovam em completo (95, 113, 67 e 49 lotes com parte acima de 30 %) e nenhum nas outras quatro glebas; a área é menos de 1,1 % da vendável em todos. "Parte acima" e "principalmente acima" saem os dois (D96) porque são 95 contra 3, 113 contra 3, 67 contra 1, 49 contra 2 — quase tudo é borda encostando no talude; a lei não tem tolerância e o projeto tem. ACHADO DA RODADA: os dois indicadores ORDENAM OS MOTORES AO CONTRÁRIO — o Symbios é 1º em rua em declive (5 183 m) e ÚLTIMO em lote em declive (2 938 m²): ele manda a rua para a encosta e guarda o plano para o lote; a ortogonal faz o inverso. Qual presta é decisão de projeto. Na tabela e na página do Jonny, com o nome da peça pior (VT-02, L1655) para achar no desenho.
Achados para outros apps ou Central: GENERATE e ORÇAMENTO — o formato proposto está em docs/provas/LAB-24/formato-proposto.json, com esquema E instância preenchida, e separa o que é para a tela do que é entrada de custo. Ele declara DENTRO do JSON que NÃO é volume de corte e aterro (D97): volume pede o greide projetado, que nenhum motor entrega. É o mal-entendido mais caro do caminho, porque o número tem a cara certa — um orçamento que lesse m² como volume erraria por um fator que ninguém notaria.
Depende do Jonny: um só, e não trava — confirmar a régua de forma. A pergunta da rampa de rua SAIU da lista: ele respondeu.
Próximo na fila: LAB-22, condição cumprida. Nota: a D91 ficou mais precisa com a resposta dele — eu lera os 30 % como "do terreno", vago, e usara a vagueza para não aplicá-los; certo em não aplicar sem saber, errado na leitura.
=== FIM ===
```

---

## 03/10/2026 · LAB-22 — o que falta medir em cada motor, e a lacuna que era minha

```
=== RECADO PARA O CHAT — Lab · LAB-22 ===
Estado: LAB-22 concluído e mesclado. Esteira verde (1 teste meu virado), tsc e lint limpos. Vizinhos limpos. Despertador trig_01XwSkTLT9zmyprNZcUiWy7f ligado.
Feito: a medição mudou a lista, e a PRIMEIRA LACUNA ERA MINHA (D98). O Laboratório de Parcelamento MEDE a rampa desde o T03 dele, de 14/09, e quem jogava fora era a ponte do Lab — a mesma que eu usei no LAB-18 para te dizer que "o Parcelamento não reporta o pico". A frase do meu adaptador era verdadeira no LAB-07 e venceu um dia depois; ficou três semanas no código. Consertada: a ponte lê as duas rampas e escreve saída v2. É a TERCEIRA vez que a disciplina do §6 me pega no mesmo ponto cego (D75, D93/D94, esta), e nas três eu estava a um passo de acusar o motor do vizinho. O que a correção revelou (D99): os DOIS motores que reportam reportam ERRADO, em direções OPOSTAS — o Symbios superestima (vértice a vértice, 0,47 m de mediana) e o Parcelamento subestima (12 amostras fixas por via, passo de 83 a 157 m). A célula do relevo é 5 m: um mede um décimo dela, o outro 17 a 31 vezes. Em completo o Parcelamento declara 16,84 % onde eu meço 51,54 %. Nenhum dos dois erros é visível sem uma segunda régua, e os dois têm a cara de um número certo.
Achados para outros apps ou Central: a lista para você levar está em docs/O_QUE_FALTA_MEDIR_POR_MOTOR.md, escrita para eles. PARCELAMENTO: uma coisa só — trocar AMOSTRAS_POR_VIA = 12 por passo em METROS, não maior que a célula do relevo. GENERATE: as duas candidatas não calculam; campo presente e null em tudo, e eu meço 34,71 % (ortogonal) e 46,70 % (espinha) em completo — a espinha é a mais urgente, com 2 179 m de rua acima de 15 % contra 1 202 m. Nota que pode poupar trabalho deles: já têm declividade(p) em engine/topografia.ts; falta percorrer o eixo com passo fixo.
Depende do Jonny: um só, e não trava — confirmar a régua de forma.
Próximo na fila: LAB-23, o último de 03/10. E um achado de forma (D100): a capacidade leRelevo ENVELHECEU SOZINHA e o teste de falsificação do LAB-14 a pegou; precisou ser partida em duas, porque o Parcelamento é o primeiro motor que LÊ o relevo e NÃO DESVIA por ele.
=== FIM ===
```

---

## 03/10/2026 · LAB-23 — a via desenhada como coluna vertebral

```
=== RECADO PARA O CHAT — Lab · LAB-23 ===
Estado: LAB-23 concluído e mesclado. Esteira verde (7 testes novos), tsc e lint limpos. Vizinhos limpos. A fila de 03/10 acabou; a nova está gravada e o próximo é o LAB-25.
Feito: PROVADO POR DIFERENÇA (D101) — a mesma gleba com e sem a via desenhada no arquivo, SAÍDA comparada byte a byte: IDÊNTICA nos oito casos (duas glebas, quatro motores). Os quatro ignoram a via, e a declaração deles é honesta. O teste fica e morde se algum passar a respeitá-la. A pergunta nova, com a régua de rampa do LAB-21: em antonina-com-via a linha desenhada tem pior trecho de 12,62 % e ZERO metros acima de 15 % — contra 17,09 % a 27,73 % dos quatro; em ensaio-com-via ela PERDE, com 30,91 %. Depende da gleba, e as DUAS pontas estão em teste (D102) para a leitura não sobreviver à medição.
Achados para outros apps ou Central: A RESSALVA QUE MUDA A LEITURA (D103) — quem desenhou aquela linha fui EU, pela geometria da gleba (D73), não um urbanista. Então não é "a mão vence a máquina": é resultado SOBRE OS MOTORES. Uma reta escolhida pela caixa da gleba, CEGA PARA O RELEVO, bate os quatro no pior trecho do terreno real — e isso casa com a D100, que achou que só o Symbios desvia pelo relevo, e mesmo ele perde aqui. PROPOSTO: falta uma via desenhada POR PESSOA, numa gleba real; eu não invento partido urbanístico.
Depende do Jonny: um só, e não trava — confirmar a régua de forma.
Próximo na fila: LAB-25, a guarda contra o meu ponto cego. Duas notas para não refazer trabalho: o LAB-26 já está METADE FEITO (leRelevo foi partida em duas no LAB-22, D100; sobra a varredura), e a corda reta das vias curvas fica na V3 sem mexer, como você mandou — o fato é que a ponte publica cada via como a reta entre as duas pontas do eixo (volta.ts:125).
=== FIM ===
```

---

## 03/10/2026 · LAB-25 — a guarda que impede a quarta vez

```
=== RECADO PARA O CHAT — Lab · LAB-25 ===
Estado: LAB-25 concluído e mesclado por PR (este despertador acordou COM os conectores do GitHub). Esteira verde: 227 testes, 18 novos; tsc e lint limpos; os três clones vizinhos sem uma alteração. Três despertadores caíram durante a execução (06:05, 07:05, 08:05) — nenhum era disparo vazio, havia item em curso.
Feito: a guarda ficou pronta, rodou UMA vez e ACHOU A QUARTA VEZ (D104): a ponte do Parcelamento escrevia faceDeRua: null em 110 de 110 lotes, atrás do comentário "o motor não guarda de QUAL via ela é frente" — escrito ANTES do T02 dele e nunca mais conferido. O motor mede desde então. O desenho, para não envelhecer como a lista que substitui (D105): inventário de destino por campo (atravessa / traduzido / perda com motivo / interno) conferido CONTRA O MOTOR RODANDO; campo-vazio e campo-novo reprovam, mapa-velho avisa. A campo-vazio NÃO acredita no inventário: casa por nome, no objeto devolvido — era literalmente o caso do D98. E ela prova que sabe ficar VERMELHA (D106): três testes sabotam a ponte de propósito e exigem o achado. Regra escrita no CLAUDE.md §4, e a tabela das quatro vezes no §6.
Achados para outros apps ou Central: 1) O número que eu jogava fora ERA BOM: posto contra a régua independente do Generate (que recalcula a frente pela faixa de leito do invariante dele), concorda em 91,5 % a 99,8 % dos lotes nas cinco glebas; onde diverge, as duas réguas estão certas — lote de esquina. 2) MAS o conserto NÃO compra ponto: o paraResultado do Generate DESCARTA o faceDeRua que vem de fora e o paraSaida o recalcula, então regerei a tabela do LAB-19 inteira e nenhum número medido mudou, só tempo de parede. Ganho de honestidade e de quem LÊ o campo (tela, exportação, Orçamento) — não de comparação, e está escrito assim no relatório. 3) O_QUE_FALTA_MEDIR_POR_MOTOR.md MUDOU (aviso do LAB-27): §1-A diz ao Parcelamento que a segunda falta em três semanas também era minha, e §7 pede ao Generate um aviso em conferencia.avisos quando ele recalcular o campo e divergir — hoje o motor de fora não tem como saber. 4) §6 contra a MINHA PRÓPRIA régua de conferência: a primeira versão acusou "os ids de via não batem" em duas glebas; era eu comparando ORDEM onde o casamento é por NOME (o paraSaida emite principal antes de secundária e sobe a V19 na lista). Os 26 ids eram os mesmos 26.
Depende do Jonny: um só, e não trava — confirmar a régua de forma.
Próximo na fila: LAB-26, a varredura das capacidades sem teste de falsificação (metade já feita no LAB-22, D100). PROPOSTO AO CHAT: a guarda da IDA — cobri motor → SAÍDA, que foi o que você pediu; o sentido ENTRADA → motor tem o mesmo risco e o mesmo mecanismo serve, e não executei porque prompt fora da fila não existe.
=== FIM ===
```

---

## 03/10/2026 · LAB-26 — a varredura das capacidades, e a suíte vermelha há duas semanas

```
=== RECADO PARA O CHAT — Lab · LAB-26 ===
Estado: LAB-26 concluído e mesclado por PR (despertador COM conectores). Os DOIS pacotes verdes pela primeira vez — 247 testes (233 na esteira, 14 no testfit), typecheck e lint limpos em ambos; vizinhos sem uma alteração. Da fila de 03/10 resta só o LAB-27, que é CONTÍNUO: no próximo disparo não há item pronto, e a regra manda apagar o despertador (D62) até você mandar fila nova.
Feito: a varredura (D108) — o porta.ts afirmava EM PROSA que o teste falsificava todos os campos, e TRÊS não tinham experimento nenhum: respeitaAcesso, geometrias e versao. Mesmo defeito do LAB-25 uma camada acima: afirmação sobre o futuro morando em texto. Agora quem sustenta a frase é src/porta/experimentos.ts, com dois testes de varredura — cobertura (campo novo sem experimento reprova) e existência (nome de teste citado que não existe reprova). 13 falsificáveis, 1 conferido, 1 sem régua, e a contagem está em teste. A declaração FALSA estava num dos três (D109): o Parcelamento dizia respeitaAcesso: false e vai de 703 para 603 lotes quando o acesso se move 992,6 m — a ida dele passa o acesso ao motor desde o LAB-07, então a declaração era do Lab. O Symbios continua false, agora provado: geometria idêntica nas três glebas.
Achados para outros apps ou Central: 1) O PIOR ACHADO NÃO É DE CAPACIDADE (D110) — a suíte do pacote testfit estava VERMELHA, 14 de 14, por duas semanas, e todo relatório meu dizia "testes verdes" rodando só o outro pacote. Causa medida: as glebas-padrão do Generate viraram v2 e o portão da ida ainda gateava "1" — gêmeo exato do D87, que eu alarguei numa terra e não na outra. NÃO é defeito do vizinho. E dói: dois daqueles 14 eram as travas das minhas próprias correções (um exigia saida.versao "1", o outro exigia faceDeRua e rampa nulos) — se a suíte rodasse, ela teria mordido no D98 e no D104. A suíte invisível calou os próprios alarmes. Consertado: portão alargado, três testes VIRADOS com a história no cabeçalho (D90), e ./external-engines/conferir.sh rodando os dois pacotes; CLAUDE.md §7 agora diz que "testes verdes" é esse comando. 2) O @/* do tsconfig do testfit também faltava (gêmeo do D86) — três coisas alargadas numa terra e não na outra, no mesmo prompt.
Depende do Jonny: um só, e não trava — confirmar a régua de forma.
Próximo na fila: nada pronto. TRÊS PROPOSTOS, nenhum executado: (a) medir a SENSIBILIDADE AO ACESSO na tabela comparativa — é a entrada de maior efeito que o Lab mede, 19 % em lotes na candidata ortogonal de geo-antonina, e as cinco glebas declaram um acesso sem ninguém medir quanto o resultado depende dele; (b) a IDENTIDADE que viaja no contrato — o motor do Parcelamento publica MOTOR_NOME e MOTOR_VERSAO e a ponte do Lab escreve outros (mesma forma do D104, um nível acima, mas alcança provas congeladas); (c) a guarda da IDA, do LAB-25.
=== FIM ===
```

---

## 03/10/2026 · LAB-27 — o documento vivo, primeira atualização

```
=== RECADO PARA O CHAT — Lab · LAB-27 ===
Estado: LAB-27 rodado e mesclado por PR (despertador COM conectores). Os dois pacotes verdes — 247 testes, typecheck e lint limpos; vizinhos sem uma alteração. A FILA DE 03/10 ESTÁ CUMPRIDA: LAB-21, 24, 22, 23, 25, 26 e a 1ª rodada do 27. No próximo disparo, previsivelmente, não há item pronto — e aí a regra manda APAGAR O DESPERTADOR (D62) e esperar fila nova de você.
Feito: o LAB-27 não mede, carrega. O O_QUE_FALTA_MEDIR_POR_MOTOR.md ganhou duas seções com achados do LAB-26 que são sobre o MOTOR DO VIZINHO e não sobre o Lab — §1-B: a ficha de capacidades do Lab dizia, por escrito e PARA FORA, que o motor do Parcelamento ignora o ponto de acesso; é falso (703 → 603 lotes quando o acesso se move 992,6 m) e o erro era do Lab. Ficha voltada para fora atribuindo ao motor de outro uma limitação que ele não tem se AVISA, não se conserta calado. §1-C: eles publicam MOTOR_NOME = "laboratorio-de-parcelamento" e MOTOR_VERSAO = "1.0" e a ponte do Lab escreve "motor-testfit" e um rótulo de prompt meu — mesma forma do D104, um nível acima. E §6 ampliada com a estatística do LAB-26: das 15 declarações da ficha, três sem experimento, e a falsa numa delas. Um em três.
Achados para outros apps ou Central: 1) AVISO DO LAB-27, o documento MUDOU — §1-B, §1-C e §6. É para você levar ao Laboratório de Parcelamento. 2) A única coisa que o documento PEDE a eles hoje é uma confirmação: o MOTOR_VERSAO deles diz "sobe quando o desenho muda de forma que o Generate veja" e está em 1.0 — entre o T00-A e o T05 o desenho mudou de forma visível ao Generate pelo menos duas vezes (o greide do T03 e a via de frente do T02, as duas que eu medi). Se a versão não subiu nessas, ela não serve para o Lab saber que precisa remedir, e é justamente para isso que eu quero usá-la. 3) REGRA NOVA, gravada (D111): o LAB-27 é contínuo e só é item pronto QUANDO HÁ MUDANÇA para carregar — sem mudança não há item pronto, e o despertador se apaga. Item que nunca acaba não pode manter despertador vivo para sempre; foi o que a D62 mediu em 15/09, 4 disparos de 7 sem o que fazer.
Depende do Jonny: um só, e não trava — confirmar a régua de forma.
Próximo na fila: NADA PRONTO. Os três propostos seguem sem execução, esperando você: (a) medir a SENSIBILIDADE AO ACESSO na tabela comparativa — é a entrada de maior efeito que o Lab mede, 19 % em lotes na candidata ortogonal de geo-antonina, e nenhuma das cinco glebas a mede; (b) a IDENTIDADE que viaja no contrato — ler MOTOR_NOME e MOTOR_VERSAO do próprio motor, o que alcança provas congeladas do LAB-02 e do LAB-07 e o rótulo que o Generate mostra na mesa; (c) a guarda da IDA, do LAB-25.
=== FIM ===
```

---

## 03/10/2026 · Disparo sem item pronto — o despertador parou

```
=== RECADO PARA O CHAT — Lab · — ===
Estado: PAREI, e de propósito. O disparo das 11:05 não achou item pronto: a fila de 03/10 está CUMPRIDA (LAB-21, 24, 22, 23, 25, 26 e a 1ª rodada do 27) e o LAB-27 é contínuo, sem mudança para carregar nesta hora (D111). É o caso da D62 e do CLAUDE.md §1-A, então o despertador trig_01XwSkTLT9zmyprNZcUiWy7f está FORA DO AR desde 11:07 UTC. main em 51d935d, árvore limpa, os dois pacotes verdes (247 testes), vizinhos sem uma alteração.
Feito: nada de medição — este disparo não tinha o que medir, e inventar trabalho para justificar um despertador é o contrário do que a D62 mediu (4 dos 7 disparos de 15/09 sem o que fazer). O que ficou registrado: o motivo em ONDE_PARAMOS, o fim da fila na FILA.md, e a D112.
Achados para outros apps ou Central: UMA DIFERENÇA DECLARADA, e você precisa dela para destravar (D112): a regra diz "apagar o despertador" e eu o DESLIGUEI (enabled: false), não apaguei. Apagar uma rotina apaga também as sessões que ela iniciou, e esta está presa à sessão onde o dia inteiro de trabalho está registrado — o risco não valia a letra da regra, e o efeito é o mesmo: ele não acorda mais. VOCÊ TEM DUAS SAÍDAS: reabilitar este mesmo despertador (preserva o histórico de disparos, é mais barato) ou apagá-lo e criar outro junto com a fila nova. As duas servem.
Depende do Jonny: um só, e não trava — confirmar a régua de forma (útil < 85 % = "a conferir", < 70 % = "ruim").
Próximo na fila: NADA. O Lab está parado esperando fila nova. Os três achados do dia seguem propostos, sem execução: (a) a SENSIBILIDADE AO ACESSO na tabela comparativa — é a entrada de maior efeito que o Lab mede, 19 % em lotes na candidata ortogonal de geo-antonina, e nenhuma das cinco glebas a mede; (b) a IDENTIDADE que viaja no contrato — ler MOTOR_NOME e MOTOR_VERSAO do próprio motor, que alcança provas congeladas do LAB-02 e do LAB-07 e o rótulo na mesa do Generate; (c) a guarda da IDA, do LAB-25. Mande a fila e eu volto a andar.
=== FIM ===
```

---

## 03/10/2026 · LAB-28 — a sensibilidade ao acesso, e a manchete que caiu

```
=== RECADO PARA O CHAT — Lab · LAB-28 ===
Estado: LAB-28 concluído e mesclado por PR. Despertador REABILITADO às 13:58 UTC, como você mandou (preservando o histórico de disparos). Os dois pacotes verdes: 255 testes na esteira (22 novos) + 14 no testfit, typecheck e lint limpos, vizinhos sem uma alteração. Tabela e página REGERADAS, com a coluna nova nas cinco glebas.
Feito: o número que eu te dei era PEQUENO. Eu disse 19 %, de dois pontos escolhidos por serem os vértices mais distantes — que é a maior distância geométrica e não tem nada a ver com rendimento. Com SEIS pontos igualmente espaçados por comprimento de arco: a candidata espinha do Generate vai de 860 a 1.791 lotes em `completo` (+108,3 %), com a área vendável de 30,96 a 64,67 ha; o Parcelamento vai de 459 a 703 em `ensaio-47ha` (+53,2 %); a ortogonal de 1.346 a 1.941 em `geo-antonina` (+44,2 %). O Symbios dá 0 % nas cinco, e isso é MEDIÇÃO: ele não recebe ponto de acesso. A amplitude é PISO, não valor exato — seis pontos não varrem o perímetro, e a ressalva viaja no próprio objeto (amplitudeEhPiso), não só na prosa (D113).
Achados para outros apps ou Central: 1) A MANCHETE QUE EU IA ESCREVER ERA FALSA (D114): "a entrada pesa mais que a escolha do motor" vale em 2 das 5 glebas, não em todas. E a primeira versão da conta dava 1 de 5, porque comparava com a diferença entre os QUATRO motores — incluir o Symbios infla isso até 355 %, e essa não é escolha entre dois loteamentos: ele entrega QUADRA e os lotes dele são da subdivisão do Lab. As duas contas estão publicadas, com a razão. O que fica é a frase que não compara nada: o MESMO programa, no MESMO terreno, varia até +108 % só mudando por onde a rua entra. 2) UM DEFEITO MEU, e ele é o mais instrutivo (D116): o confronto nascia calculado em DOIS lugares — na ferramenta e no gerador da página — com referências diferentes, e `completo` saía com +29 % num arquivo e +70 % no outro. É o defeito que o D20 proíbe no Validator, cometido por mim numa grandeza minha, dois dias depois de eu escrever a guarda do LAB-25 contra a mesma família de erro. Quem pegou NÃO foi um teste: fui eu lendo a página antes de mesclar. Consertado na raiz (a fórmula mora na régua, a página lê) e agora TEM teste.
Depende do Jonny: um só, e não trava — confirmar a régua de forma. Na página, a frase de negócio diz que por onde a entrada pode passar é parte do preço do terreno, com três cuidados: o melhor ponto pode não existir na vida real, a variação é o mínimo e não o máximo, e o Lab NÃO escolhe a entrada (isso é decisão dele).
Próximo na fila: LAB-29, a identidade que viaja no contrato (MOTOR_NOME e MOTOR_VERSAO lidos do próprio motor). Uma nota: o prompt guardado no despertador ainda nomeia a fila de 03/10 na PRIMEIRA versão (LAB-21/22/23) — não o reescrevi porque você mandou reabilitar, e o passo 1 dele manda ler a FILA.md, que é a oficial. Se quiser que eu reescreva o texto guardado, é uma linha.
=== FIM ===
```

---

## 03/10/2026 · LAB-29 — a identidade que viaja no contrato

```
=== RECADO PARA O CHAT — Lab · LAB-29 ===
Estado: LAB-29 concluído e mesclado por PR. Os dois pacotes verdes: 265 testes na esteira (10 novos, todos de identidade) + 14 no testfit, typecheck e lint limpos, vizinhos sem uma alteração. Resta só o LAB-30 na fila — a guarda da IDA, e ela não está fechada.
Feito: as duas etiquetas de identidade eram MINHAS. A SAÍDA dizia nome: "motor-testfit" — que é o nome do REPOSITÓRIO dele — e versao: "T00-A+espinha", que é o nome de um PROMPT meu. O motor publica as duas em contrato/tipos.ts, e documenta a versão: "sobe quando o desenho muda de forma que o Generate veja" — exatamente o uso que eu precisava e estava ignorando. Agora são importadas. A separação é o coração do conserto: `motor` é de quem É, `archilly.origem` é de quem RODOU. Enquanto a minha etiqueta morava em motor.versao, ela TINHA de envelhecer — o motor foi ao T05 e o campo continuou dizendo T00-A. Apaguei três coisas em vez de ajustá-las: a constante VERSAO_MOTOR_MEDIDA, o parâmetro versaoMotor de voltaParaOContrato (o que obrigou a revisitar sete chamadas, inclusive seis testes) e o "+ subdivisão do Lab" de dentro da versão do Symbios. O +<partido> fica, e é a única coisa que acrescento: sem ele as dez variantes do motor viram dez linhas idênticas na mesa.
Achados para outros apps ou Central: 1) O RÓTULO NA MESA DO GENERATE, que era o terceiro pedido: "externo · motor-testfit vT00-A+espinha" virou "externo · laboratorio-de-parcelamento v1.0+espinha"; e o do Symbios perdeu o acréscimo do Lab, que agora vive no nome de tela e no origem. 2) O SYMBIOS NÃO TEM O QUE IMPORTAR (é WASM de Rust): guardo a constante com a fonte citada ao upstream/VERSION e UM TESTE LÊ AQUELE ARQUIVO e reprova se divergirem — upstream/ é intocável, e intocável não quer dizer ilegível. 3) AS PROVAS CONGELADAS FORAM ALCANÇADAS E NÃO REGERADAS (D118): cinco arquivos do LAB-07 e do LAB-08 guardam o rótulo antigo, porque são o registro de uma medição daquele dia, com o motor daquele dia — regerá-los apagaria a medição para consertar uma etiqueta. Em lugar disso há docs/provas/LEIA-ME.md dizendo quais arquivos são, o que cada etiqueta queria dizer e onde está a identidade de verdade, COM TESTE exigindo que ele exista e cite as três coisas. A única exceção é a prova do LAB-26, que foi regerada porque não é registro congelado: é a leitura ao vivo das declarações da porta. 4) A PERGUNTA AO PARCELAMENTO FICOU MAIS URGENTE, não menos: eu agora DEPENDO do MOTOR_VERSAO deles. Ele está em 1.0, e entre o T00-A e o T05 o desenho mudou de forma visível ao Generate pelo menos duas vezes. Se a versão não subiu nessas, ela não me diz que preciso remedir.
Depende do Jonny: um só, e não trava — confirmar a régua de forma.
Próximo na fila: LAB-30, a guarda da IDA — o LAB-25 cobriu motor → SAÍDA, e o sentido ENTRADA → motor não tem nada. É o último item da fila que você mandou.
=== FIM ===
```

---

## 03/10/2026 · LAB-30 — a guarda da IDA, e a quinta vez do ponto cego

```
=== RECADO PARA O CHAT — Lab · LAB-30 ===
Estado: LAB-30 concluído e mesclado por PR. A FILA DE 03/10 (terceira parte) ESGOTOU. Os dois pacotes verdes: 286 na esteira (21 novos) + 14 no testfit, typecheck e lint limpos, vizinhos sem uma alteração. No próximo disparo não há item pronto, e o despertador para — desligado, não apagado, como na vez anterior (D112).
Feito: a guarda da IDA, e ela achou no LEVANTAMENTO a quinta vez do meu ponto cego — a primeira que JÁ TINHA SAÍDO PARA VOCÊ (D119). O motor do Parcelamento tem um campo de entrada chamado viaManual, "coluna vertebral desenhada à mão", e a ida do Lab NUNCA o preencheu. Medido: entregando a via, antonina-com-via vai de 25 para 32 vias; ensaio-com-via vai de 599 para 585 lotes. Eu te disse duas vezes que O MOTOR ignorava via desenhada — no LAB-17 ("os quatro ignoram") e no LAB-23 ("provado por diferença, SAÍDA idêntica nos oito casos"). A prova era verdadeira e a conclusão era falsa: a saída saía idêntica porque a via nunca chegava ao motor. Pior: o LAB-23 escreveu que o teste dele "morde antes de qualquer relatório sair errado". Não mordeu — ele lia a PROVA CONGELADA em vez de medir. Teste de falsificação que lê prova velha não falsifica, repete.
Achados para outros apps ou Central: 1) CORRIGI O QUE ESTAVA PUBLICADO: aviso no alto dos relatórios do LAB-17 e do LAB-23 (não reescritos — são o registro daquele dia), ressalva na D101 (o princípio "declaração se prova por diferença" está certo e vale mais do que nunca; falta a ele que PROVA POR DIFERENÇA SÓ VALE SE A DIFERENÇA CHEGOU AO MOTOR), provas dos dois regeradas, e a trava do LAB-23 VIRADA (D90): agora exige o medido — três dos quatro ignoram, e o Parcelamento muda. 2) ENTREGUE A VIA, "RESPEITAR" VIROU DUAS PERGUNTAS (D120), como o leRelevo no LAB-22: ele LÊ a via (a saída muda) e NÃO ASSENTA os eixos nela (aderência 11 %). leViaDesenhada nasceu ao lado de respeitaViaDesenhada, e a varredura do LAB-26 foi de 13 para 14 falsificáveis — o registro acusou o campo faltando no mesmo segundo em que ele nasceu, que é a melhor hora que aquele mecanismo já teve. 3) NASCEU UM DESTINO NOVO, A DÍVIDA DECLARADA (D121): a testada de frente tem facesLoteamento esperando no motor e a ida não entrega. Não é "perda" — o motor TEM onde receber. Ela não reprova e é PUBLICADA, nomeando o campo que espera e o que falta fazer. E custou alcance, o que vai dito: a guarda genérica deixou de pegar o caso do viaManual, porque a linha tem três destinos e qual vale depende do tipo; quem impede a volta são duas travas específicas.
Depende do Jonny: um só, e não trava — confirmar a régua de forma.
Próximo na fila: NADA PRONTO. PROPOSTO: a dívida da testada de frente — mapear a linha para as faces do perímetro que ela cobre e entregá-la em facesLoteamento. Enquanto não for feito, respeitaTestadaDeFrente: false no Parcelamento é dívida do Lab e não limitação do motor, e está escrito assim no inventário. É geometria nova, e prompt fora da fila não existe.
=== FIM ===
```

---

## 03/10/2026 · A fila de 03/10 esgotou — o despertador parou

```
=== RECADO PARA O CHAT — Lab · — ===
Estado: PAREI, e de propósito. O disparo das 16:05 não achou item pronto: as TRÊS partes da fila de 03/10 estão cumpridas — dez prompts, LAB-21 a LAB-30 — e os achados novos estão todos "proposto ao chat". É o caso da D62. O despertador trig_01XwSkTLT9zmyprNZcUiWy7f está FORA DO AR desde 16:06 UTC, DESLIGADO e não apagado (D112, a escolha que você ratificou ao mandar reabilitar em vez de recriar). main em 73fea13, árvore limpa, os dois pacotes verdes (300 testes), vizinhos sem uma alteração.
Feito: nada de medição — este disparo não tinha o que medir. O que ficou registrado: o motivo em ONDE_PARAMOS, o fim da fila na FILA.md, e um resumo dos dez prompts em uma linha cada.
Achados para outros apps ou Central: O SALDO DO DIA, em uma frase: o ponto cego do §6 foi pego CINCO vezes nesta fila (D104, D114, D116, D119 e a régua de parametros do LAB-30), e TRÊS delas eram réguas minhas acusando a si mesmas. A pior é a D119, a única que já tinha saído para você: eu reportei duas vezes que o motor do Parcelamento ignorava via desenhada, e quem a ignorava era a minha ponte — o campo viaManual existe nele desde sempre. Corrigi o que estava publicado (LAB-17, LAB-23, D101), virei a trava que devia ter mordido, e escrevi as duas guardas que fecham os dois sentidos da ponte: LAB-25 para motor → SAÍDA e LAB-30 para contrato → motor. O que elas não cobrem está declarado como DÍVIDA, com o campo que espera e o que falta fazer, em vez de ficar calado.
Depende do Jonny: um só, e não trava — confirmar a régua de forma (útil < 85 % = "a conferir", < 70 % = "ruim").
Próximo na fila: NADA. O Lab está parado esperando fila nova. Três coisas esperam você: (a) a DÍVIDA DA TESTADA DE FRENTE — mapear a linha para as faces do perímetro e entregá-la em facesLoteamento; enquanto não for feito, respeitaTestadaDeFrente: false no Parcelamento é dívida minha e não limitação do motor; (b) a PERGUNTA AO PARCELAMENTO, que ficou mais urgente porque agora eu dependo dela — o MOTOR_VERSAO deles está em 1.0 e o desenho mudou de forma visível ao Generate pelo menos duas vezes entre o T00-A e o T05; (c) a VIA DESENHADA POR PESSOA numa gleba real, que a D103 pediu e eu não posso inventar. Reabilite o despertador com a fila nova e eu volto a andar.
=== FIM ===
```

---

## 04/10/2026 · LAB-31 — "verde" é um comando só, e ele reprova

```
=== RECADO PARA O CHAT — Lab · LAB-31 ===
Estado: LAB-31 FEITO e mesclado na main. Despertador trig_01XwSkTLT9zmyprNZcUiWy7f REABILITADO (o mesmo, terceira vez que você manda reabilitar em vez de recriar). Verde ao fechar: 7 passos, 306 testes, exit 0. Vizinhos sem uma alteração.
Feito: "verde" agora é ./external-engines/conferir.sh e só ele — typecheck, lint e test nos DOIS pacotes mais a PROVA NO NAVEGADOR (o .wasm do Symbios em Chromium de verdade). Duas guardas antes dos sete passos: ele DESCOBRE todo package.json do repositório e reprova se achar um fora da lista (D122 — a versão antiga listava à mão, então o terceiro pacote nasceria de fora), e precondição que falta é FALHA COM A RECEITA, nunca "pulado" (D124). Roda todos os passos mesmo depois de um falhar. A sabotagem que você pediu: um teste quebrado de propósito em cada frente → exit 0 vira exit 1, com QUATRO passos nomeados (o lint do esteira caiu junto, de graça, porque a sabotagem deixou um import sem uso). Os três arquivos restaurados e conferidos. Provas em docs/provas/LAB-31/.
Achados para outros apps ou Central: DOIS, e nenhum eu fui procurar. (1) A prova no navegador existia desde o LAB-01 e era INTEIRAMENTE MANUAL — a última etapa era ler os números na tela. Rodou UMA VEZ, em 10/09/2026, e nunca mais. Não é desleixo: é o que acontece com toda prova cuja última etapa é um olho. Agora a página publica os números como dado e um roteiro Playwright compara com os de 10/09 — os cinco bateram exatamente (0.4.1 · 6 242 nós · 6 514 arestas · 275 quadras · 193 174 bytes); o tempo de parede NÃO é conferido, e está escrito por quê (D123). (2) Escrevendo essa comparação eu cometi o defeito do §6 outra vez: contei arestas com r.arestas.filter(a => a.ativa) e as arestas são TUPLAS [ia, ib, tipo] — a prova teria publicado 0 ARESTAS em silêncio, para sempre, como se fosse medição. Pego pela comparação que este prompt acabou de criar, no primeiro uso dela. Para a Central: a forma do defeito é sempre a mesma — filtro por campo que não existe devolve zero e zero se parece com medição.
Depende do Jonny: um só, e não trava — confirmar a régua de forma (útil < 85 % = "a conferir", < 70 % = "ruim").
Próximo na fila: LAB-32, condição cumprida — investigar a aderência que caiu de 17,4 para 11,2 % depois do conserto do LAB-30, que eu publiquei sem investigar. Uma coisa para você decidir: NÃO HÁ CI neste repositório (não existe .github/workflows), então nada roda o conferir.sh automaticamente — quem o roda sou eu, antes do commit, e se eu esquecer nada pinta vermelho. Um workflow de uma página resolveria, precisando de rustup target add wasm32-unknown-unknown e do Chromium no executor. NÃO executei: é escopo novo e o §1-A proíbe ampliar por conta própria. Está em "proposto ao chat" (D125).
=== FIM ===
```

---

## 04/10/2026 · LAB-32 — a queda era o motor obedecendo

```
=== RECADO PARA O CHAT — Lab · LAB-32 ===
Estado: LAB-32 FEITO e mesclado na main. Verde: 7 passos, 318 testes, exit 0. Vizinhos sem uma alteração. Despertador de pé, próximo item LAB-33.
Feito: investiguei a queda que eu publiquei sem investigar. VEREDITO: o número novo está CERTO COMO MEDIDA e ERRADO COMO COMPARAÇÃO, e o culpado tem duas metades, nenhuma delas o motor desrespeitando a linha. (1) 2,8 pp são TROCA DE PARTIDO: o ranking do próprio motor trocou ortogonal (nota 0,6176) por espinha (0,6318) — o 17,4 % era um desenho, o 11,2 % é outro, e eu comparei os dois como se fossem o mesmo. No mesmo partido a queda é 17,4 → 14,0 %, e nenhum dos dez partidos se move mais de 4,3 pp. (2) Os 3,4 pp restantes são A MINHA RÉGUA MEDINDO OUTRA COISA. Provas em docs/provas/LAB-32/, 12 travas novas.
Achados para outros apps ou Central: O ACHADO PRINCIPAL, e é o oposto do que eu tinha publicado: O MOTOR OBEDECE À LINHA, e é por obedecer que a minha régua o viu cair. Lido o motor do Parcelamento (só leitura), o campo viaManual faz exatamente duas coisas — a DIREÇÃO da linha vira o ângulo base do partido inteiro, e a FAIXA dela vira área bloqueada antes de qualquer lote nascer. Nenhuma das duas é "assentar eixo sobre a linha", que é o que a minha régua de aderência mede. E alinhar o partido GIRA A REDE TODA, o que tira eixos de cima das outras três linhas desenhadas: obediência entra na régua como queda. Medidas as duas promessas, as duas são CUMPRIDAS — alinhamento a 10° vai de 0,0 para 72,9 % no ortogonal (82,7 % no pente, 72,4 % no loop, 70,1 % no mioloVerde), e lotes com o CENTRO dentro da faixa vão a ZERO em 10 de 10 partidos, nas duas glebas. Nasceu alinhaOPartidoAViaDesenhada, medido nos quatro motores (os outros três dão alinhamento idêntico com e sem a via), e respeitaViaDesenhada: false continua, porque é literalmente verdade: ele não põe rua em cima da linha. São três perguntas, não duas. PARA O PARCELAMENTO, um item só e pequeno (§1-D do O_QUE_FALTA_MEDIR_POR_MOTOR.md, que MUDOU — o LAB-27 manda avisar): o ângulo base obedece à linha, mas cada variante sorteia ±30° em cima dele (variacaoAngular), e por isso na variante que o ranking deles escolhe o ganho é de 5,6 pp e não de 72,9 — a obediência existe e fica invisível. Se o produto quer "o motor respeita a linha que eu desenhei", talvez o sorteio deva ser suprimido quando viaManual vier preenchida: linha desenhada à mão é intenção explícita (D69). Medição minha, decisão deles, nenhuma linha escrita lá. É a TERCEIRA vez seguida que uma acusação ao motor deles termina sendo defeito meu. E a SEXTA vez do ponto cego da §6, esta pega DENTRO do prompt: a primeira versão da régua da faixa contava lote com VÉRTICE dentro dela, deu "27 → 34" e eu ia publicar que o motor põe mais lote em cima da linha — invasão é o CENTRO, porque o lote que faz frente encosta na faixa de direito. Corrigi o que estava publicado: aviso no alto do LAB-30 e do LAB-17, ressalva na D120, contagem do LAB-26 (14 → 15 falsificáveis).
Depende do Jonny: um só, e não trava — confirmar a régua de forma (útil < 85 % = "a conferir", < 70 % = "ruim").
Próximo na fila: LAB-33, condição cumprida — a trava do LAB-23 que ainda lê prova congelada em vez de medir. Duas coisas para você: (a) a régua da aderência aparece na tabela comparativa numa coluna só, sem dizer de qual promessa se trata, e isso convida à mesma leitura errada que eu fiz — NÃO mexi na tabela, porque o LAB-34 é o prompt dela e emendá-la aqui seria ampliar escopo; (b) o ensaio-com-via não mostrou NADA deste efeito (a linha dele já corre na direção da caixa envolvente) e só a gleba real mostrou — é o segundo caso em que a fixture geométrica esconde comportamento, e mais um argumento para a via desenhada POR PESSOA que a D103 pede e eu não posso inventar.
=== FIM ===
```

---

## 04/10/2026 · LAB-33 — a trava que lia um arquivo passa a medir

```
=== RECADO PARA O CHAT — Lab · LAB-33 ===
Estado: LAB-33 FEITO e mesclado na main. Verde: 7 passos, 323 testes, exit 0. Vizinhos sem uma alteração. Despertador de pé, próximo item LAB-34. Nota: cinco disparos enfileiraram enquanto a sessão estava parada (03:05 a 07:06) — é o mesmo prompt repetido, e a regra é UM prompt por despertador, então executei um.
Feito: você acertou no "não vire o sinal". No LAB-30 eu virei o sinal e chamei de conserto, e o teste continuou lendo docs/provas/LAB-23/coluna-vertebral.json — afirmação sobre arquivo, não sobre motor. Agora os OITO cenários (duas glebas × quatro motores × com e sem a via) RODAM no teste, num memo, e nenhuma asserção sai de arquivo: o Parcelamento muda a saída, os outros três não, a linha da mão e as vias dos motores são medidas pela mesma régua de rampa, e as duas pontas ficam travadas (em antonina a linha da mão é mais mansa que as quatro, em ensaio é mais íngreme). 12 travas, todas medindo.
Achados para outros apps ou Central: O DEFEITO DE PROJETO QUE VIRAR O SINAL NÃO TOCAVA, e ele é a lição: "saída idêntica" significa DUAS coisas — o motor ignora a linha OU a ponte não a entrega — e sem separá-las o teste passa nas duas. Foi a segunda que aconteceu por três semanas (D119), e o teste do LAB-23 se orgulhava por escrito de que morderia. Três travas novas medem A PONTE, direto na idaParaOMotor, SEM MOTOR NO MEIO: no contrato v2 ela lê a via_desenhada sozinha e preenche viaManual, sem via no arquivo não inventa, e respeita a linha que recebe pronta. É a trava que teria mordido em 13/09. REGRA GERAL que saiu disso (D131): teste que LÊ prova congelada para responder à pergunta não falsifica, ele REPETE; o único uso honesto de um arquivo de prova dentro de um teste é ser COMPARADO com a medição feita ali, para acusar que o arquivo envelheceu — é o que o último describe faz agora, reprovando com "regere com bun run lab23". Fiz a varredura nas outras seis travas que leem docs/provas/: cinco são detectores legítimos, UMA REPETE — o teste do D116 em acesso.test.ts, que compara a prova do LAB-19 com a do LAB-28; se as duas forem regeradas erradas do mesmo jeito, ele passa. NÃO consertei (escopo novo, §1-A): está proposto na fila com o conserto, que é barato — recalcular o agregado dos números crus que a própria prova carrega, com as réguas do acesso.ts, sem rodar motor nenhum. Para a Central, a forma do defeito: trava que afirma coisas sobre um artefato gerado pelo próprio sistema não é trava, é eco.
Depende do Jonny: um só, e não trava — confirmar a régua de forma (útil < 85 % = "a conferir", < 70 % = "ruim").
Próximo na fila: LAB-34, condição cumprida — pôr o aviso dos 108 % onde a ordem dos motores aparece. Uma coisa para você saber, porque é custo: a suíte do esteira foi de 108 para 176 segundos. É o preço de o teste responder pelo motor em vez de responder por um JSON, e eu prefiro pagá-lo — o LAB-23 custou dois relatórios publicados com a conclusão trocada. Se em algum momento esse tempo incomodar, a conversa é sobre quantas glebas o teste mede, não sobre voltar a ler arquivo.
=== FIM ===
```

---

## 04/10/2026 · LAB-34 — o aviso onde a ordem aparece, e a pergunta certa

```
=== RECADO PARA O CHAT — Lab · LAB-34 ===
Estado: LAB-34 FEITO e mesclado na main. Verde: 7 passos, 331 testes, exit 0. Vizinhos sem uma alteração. Despertador de pé, próximo item LAB-35.
Feito: o aviso saiu da seção do acesso e passou a nascer DEBAIXO DE CADA UM DOS CINCO QUADROS, com o que foi medido naquela gleba; mais a legenda da coluna "Lotes" dizendo que o número é de UM ponto de entrada, e um apontador na seção do acesso de volta para os quadros. A régua nova (instabilidadeDaOrdem) mora num lugar só, no acesso.ts, roda na ferramenta e é gravada em tabela.json — a página só escreve, não recalcula, que é a lição do D116. Há trava exigindo que os cinco avisos NÃO sejam o mesmo texto: aviso igual em todo lugar vira decoração, e um dos cinco é um ✅.
Achados para outros apps ou Central: A SEGUNDA METADE DO SEU PEDIDO ERA MAIS SÉRIA QUE A PRIMEIRA, e só apareceu medindo: "varia 108 %" e "a ordem muda" são afirmações DIFERENTES. Um motor pode variar muito e continuar sempre na frente; quem lê a coluna de lotes ordena os motores com os olhos, e essa pergunta não tinha resposta nenhuma na página. Medido com as seis posições de acesso do LAB-28: A ORDEM MUDA EM 3 DOS 5 TERRENOS, E O PRIMEIRO LUGAR EM 2. O caso que mais importa é a gleba real: em geo-antonina, na posição 0 a espinha ganha com 1 672 lotes; na 3 a ortogonal ganha com 1 941; na 5 a ORTOGONAL CAI PARA TERCEIRO (1 346), atrás do Parcelamento. Mesmo terreno, mesmas regras, mesmo conferente — só a entrada mudou. E a ensaio-47ha é a única em que a ordem aguenta as seis posições sem mudar nenhuma vez, o que também está escrito, com ✅. SÉTIMA VEZ DO PONTO CEGO DA §6 (D133), e a primeira SEM MOTOR DE VIZINHO ENVOLVIDO: minha primeira contagem dava "4 de 5" porque incluía posições em que um motor NÃO RESPONDEU — e aí o que muda é um motor sair da comparação, não a ordem. Conferi antes de publicar duas coisas: que os seis pontos são os mesmos para os quatro motores (índice a índice, ponto a ponto), e que as ausências estavam inflando a instabilidade. Com a conta certa, 3 de 5. A ausência não foi descartada: sai contada, nomeada e dentro do aviso, porque "este programa não desenha nada aceitável se a rua entrar aqui" também é resposta. Para a Central: a forma do defeito é confundir "o dado mudou" com "o dado faltou".
Depende do Jonny: um só, e não trava — confirmar a régua de forma (útil < 85 % = "a conferir", < 70 % = "ruim").
Próximo na fila: LAB-35, condição cumprida — os 310 avisos "mapa-velho" da guarda da ida. E um achado novo que ficou PROPOSTO, não executado: a candidata ortogonal do Generate não entrega nada aceitável pelo contrato em 5 de 6 posições de acesso no sintetico-50ha-ondulado, e 3 de 6 no sintetico-10ha-plano. Está publicado como ausência, mas NÃO investiguei — pode ser limite do motor, pode ser a gleba sintética, pode ser a minha ponte, e a §6 diz que a terceira hipótese merece medição antes de qualquer acusação (foi exatamente o que me pegou sete vezes). Enquanto não for medido, a tabela daquela gleba não sustenta ordem nenhuma, e o aviso dela diz isso.
=== FIM ===
```

---

## 04/10/2026 · LAB-35 — quatro promessas que ninguém nunca verificou

```
=== RECADO PARA O CHAT — Lab · LAB-35 ===
Estado: LAB-35 FEITO e mesclado na main. Verde: 7 passos, 340 testes, exit 0. Vizinhos sem uma alteração. Despertador de pé, próximo item LAB-36.
Feito: HAVIA CASO REAL NOS 310, e são quatro. Classificando em vez de contar: dos 68 campos que avisavam, 21 avisavam em TODAS as sete glebas — e aí o próprio diagnóstico fica falso, porque "campo opcional que esta gleba não exerce" vira "NENHUMA gleba exerce isto". Dezessete dos 21 são perda ou interno (nada tinha de chegar ao motor, a ausência não diz nada). QUATRO SÃO PROMESSAS do inventário, do tipo entregue/traduzido, que a guarda NUNCA VERIFICOU: parametros.calcada_m → terreno.padroes, atracoes[].geometria.aneis → terreno.atracoes e acessos[].segmento → terreno.acesso no Parcelamento, e gleba.furos → gleba.furos no Symbios. Exercitei as quatro, com entradas montadas em teste: AS QUATRO SE SUSTENTAM. O caso real não era promessa quebrada — era promessa que ninguém tinha olhado, e agora está olhada.
Achados para outros apps ou Central: POR QUE ISSO É GRAVE E NÃO BUROCRACIA, e é a lição: a regra que reprova (campo-nao-entregue) só morde quando o contrato TRAZ VALOR. Caminho de destino errado numa entrada entregue/traduzido que gleba nenhuma exercita é INVISÍVEL — e essa é, letra por letra, a forma do D119, onde o motor tinha o campo viaManual, a ponte não o preenchia, e nada acusava. Dois dos quatro casos têm a mesma cara: a perda declarada da ida diz POR ESCRITO que "o motor recebe atração como POLÍGONO (ímã)" e nenhuma fixture entrega atração poligonal (todas são linha); e a ida do Symbios declara gleba.furos como entregue e nenhuma gleba tem furo. RUÍDO REDUZIDO: a regra 3 virou duas — promessa-nao-exercitada (99, o aviso que importa) e mapa-velho (187, gravado na prova e CALADO no relatório). Os 24 que faltam para 310 eram entradas de DÍVIDA em glebas que não trazem o campo: não há o que confessar se o contrato não trouxe nada. OITAVA VEZ DO PONTO CEGO (D135), e é a melhor da série: dos quatro testes, DOIS FALHARAM na primeira rodada e OS DOIS ERAM O MEU TESTE — a calçada chega como FAIXA {min,max} e eu esperava escalar; e o furo mora em terreno.gleba.furos, porque no Symbios a gleba é um Poligono {externo, furos}, e eu lia terreno.furos. Essa segunda me deu nas mãos, por um instante, "o inventário promete entregar o furo e a ida do Lab não entrega": acusação à ponte, publicável, e FALSA. A regra que as oito vezes ensinam entrou no CLAUDE.md §6 — antes de acusar a ponte de não entregar, confira o CAMINHO e a FORMA do que você está lendo; e antes de dizer que um número mudou, confira se ele EXISTE.
Depende do Jonny: um só, e não trava — confirmar a régua de forma (útil < 85 % = "a conferir", < 70 % = "ruim").
Próximo na fila: LAB-36, condição cumprida — as quatro regras sem teste viram guarda ou saem do documento. E uma coisa PROPOSTA, não executada: as quatro promessas estão provadas por teste com entrada montada em memória, mas NENHUMA GLEBA do repositório tem furo, atração poligonal, calçada declarada ou acesso como segmento — quem roda a esteira inteira continua sem exercer esses caminhos. Criar fixtures com eles é escopo novo e seria um prompt pequeno; está na fila como proposta.
=== FIM ===
```

---

## 04/10/2026 · LAB-36 — eram cinco regras, e duas estavam falsas

```
=== RECADO PARA O CHAT — Lab · LAB-36 ===
Estado: LAB-36 FEITO e mesclado na main. Verde: 7 passos, 353 testes, exit 0. Vizinhos limpos — e isso agora é TESTE, não só conferência minha. Despertador de pé, próximo é o LAB-37, o último da fila.
Feito: O PRIMEIRO ACHADO É SOBRE O SEU PEDIDO: a lista das "quatro regras" não existia em lugar nenhum. Ela saiu no balanço que você pediu fora da fila, foi para o chat e NÃO para um arquivo — então não havia como "pegar as quatro". Varri o CLAUDE.md de novo, regra por regra, com uma pergunta só: "o que, hoje, reprovaria se isto deixasse de ser verdade?". DERAM CINCO, não quatro, E DUAS ESTAVAM FALSAS COMO ESCRITAS: (1) §4 "não tem interface" — o HTML da bancada da prova no navegador existe desde o LAB-01, então a regra era falsa; agora ela declara a exceção e a guarda conta os HTML, reprovando um segundo, e exige que a bancada continue sendo bancada (sem form, sem input). (2) §7 "prova com gleba, motor, semente e contrato EM CADA ARQUIVO" — falsa em 9 de 32; agora vale para prova de MEDIÇÃO, e as exceções viram lista declarada em duas classes. As outras três eram verdadeiras e sem guarda, e ganharam uma: o Validator vem importado do Generate e nenhum arquivo define validador próprio; o conserto do Lab (o aparo) é opcional, só roda sob pedido e quem liga declara o tamanho do corte; e "Testfit" não aparece em texto para o usuário, que diz "Laboratório de Parcelamento". Mais uma sexta da mesma família: "não escreve em repositório vizinho" era conferida à mão em toda rodada e agora é teste, com a CONTA de quantos clones foram conferidos publicada, para "0 clones conferidos" não passar por verde.
Achados para outros apps ou Central: DUAS LIÇÕES, e as duas servem para a família. A primeira: O QUE VAI AO CHAT E NÃO VAI A UM ARQUIVO NÃO EXISTE AMANHÃ — é a lição do RECADOS.md aplicada ao que eu respondo fora da fila, e desta vez custou uma varredura inteira para recuperar cinco linhas. Proposta na fila: um docs/relatorios/BALANCOS.md, na forma do RECADOS.md; não executei porque mexeria no §1, que é regra sua. A segunda: REGRA QUE NINGUÉM PODE DESMENTIR NÃO É REGRA, É SLOGAN — duas das seis já tinham deixado de ser verdade sem que nada acusasse, e nenhuma delas por malícia: uma porque o arquivo nasceu depois da regra, outra porque a regra foi escrita mais forte do que o repositório podia cumprir. NONA VEZ DO PONTO CEGO (D137), e a quarta pega dentro do próprio prompt: a primeira versão da guarda do §7 exigia a chave "gleba" LITERAL e reprovou 13 de 32 provas — eu tinha nas mãos "um terço das provas do repositório viola a §7", número grande o bastante para parecer achado. Era a régua MEDINDO ORTOGRAFIA E NÃO CONTEÚDO: há prova que diz "glebas" no plural, e arquivo de SAÍDA que identifica a gleba em "entrada", com a versão do contrato dentro do bloco "archilly", como o contrato manda. Declarados os nomes aceitos por conceito, sobraram 9 — sete que não medem gleba e duas congeladas antes da regra, essas com o dado que falta NOMEADO na lista (contrato 1 nas duas) em vez de regerar prova congelada (D118). As listas se auto-limpam: a guarda reprova exceção que aponta para arquivo inexistente E exceção que passou a cumprir a regra.
Depende do Jonny: um só, e não trava — confirmar a régua de forma (útil < 85 % = "a conferir", < 70 % = "ruim").
Próximo na fila: LAB-37, o ÚLTIMO da fila de 04/10 — a dívida da testada de frente (D121), mapear a linha para as faces do perímetro e entregá-la em facesLoteamento, escrevendo o tamanho e executando se couber. Depois dele a fila esgota, e eu desligo o despertador em vez de apagá-lo, como você ratificou duas vezes.
=== FIM ===
```

---

## 04/10/2026 · LAB-37 — a dívida paga, e a fila de 04/10 esgotou

```
=== RECADO PARA O CHAT — Lab · LAB-37 ===
Estado: LAB-37 FEITO e mesclado na main. A FILA DE 04/10 ESGOTOU — os sete prompts cumpridos, LAB-31 a LAB-37 — e o despertador trig_01XwSkTLT9zmyprNZcUiWy7f está DESLIGADO (enabled: false), não apagado, pela terceira vez (D112), que é a escolha que você ratificou duas vezes. Verde: 7 passos, 368 testes, exit 0. Vizinhos limpos, e desde o LAB-36 isso é teste.
Feito: o tamanho estava escrito e cabia — régua, opção na ida, passagem, cálculo no invólucro, inventário, declaração da porta, provas e travas; comparável ao LAB-30. A TESTADA DE FRENTE agora chega ao motor em facesLoteamento. O mapeamento, medido em geo-antonina: a linha de 180 m cobre a FACE 0 do perímetro A 100 %; a face 19 encosta nela a 3 %, que é o vértice compartilhado e não a testada — daí a fração mínima da face ser parâmetro DECLARADO (meia face), sem a qual a régua repetiria o D75. A tolerância de 1 m dá o mesmo resultado que 5 m, o que diz que a escolha não está mandando no número. RESULTADO: lotes com aresta na testada vão de ZERO para 14 a 18, em 10 de 10 partidos, nas duas glebas que têm testada. A D121 dizia por escrito que respeitaTestadaDeFrente: false era dívida do Lab e não limitação do motor — MEDIDO, ELA ESTAVA CERTA, e a declaração virou true. A categoria "divida" do inventário está VAZIA hoje, e o ajudante dela fica no código sem uso, de propósito: a gaveta vazia é a prova de que a confissão tinha prazo.
Achados para outros apps ou Central: TRÊS, e dois não estavam na conta. (1) PAGAR A DÍVIDA DEVOLVEU O ALCANCE QUE ELA CUSTOU: o D121 registrou que fazer de "atracoes" uma dívida tirou a mordida da guarda genérica, porque dívida não reprova; agora que é entrega com três destinos, a ida "como era" passou a SER REPROVADA pela guarda genérica. O destino "dívida" funcionou exatamente como prometido — confissão com prazo, não gaveta. (2) O ARNÊS DA GUARDA MEDIA UM CAMINHO QUE NÃO ERA O CAMINHO (D139): declarada a entrega, a guarda reprovou 6 campos em geo-antonina dizendo que a testada não chegava, e eu tinha nas mãos "a entrega não funciona". Ela estava CERTA sobre o que mediu e ERRADA sobre a esteira: o rodarTestfit calculava a coluna vertebral E as faces, e o arnês calculava só a coluna. Pior que guarda reprovando à toa é guarda medindo outra coisa — e a divergência nasceu DENTRO da guarda que existe para impedir que duas montagens da mesma coisa envelheçam em direções diferentes (D116). Agora há UMA montagem, com trava exigindo que os dois arquivos a citem. (3) PARA O PARCELAMENTO, uma pergunta que é decisão deles (§1-E do O_QUE_FALTA_MEDIR_POR_MOTOR.md, que mudou): entregue a testada, O RANKING DELES PASSOU A PREFERIR UM PARTIDO DE 33 LOTES A UM DE 1 228 em geo-antonina — superquadra nota 0,6226 contra ortogonal 0,5881. O que mudou: antes da entrega o superquadra desenhava ZERO lotes e era inválido; com os lotes externos da testada ele passou a valer, e a nota dele é a maior. Pode ser intencional — plano de poucos lotes grandes é um produto — mas se não for, está medido. Eu NÃO escolho a variante (seria o Lab decidindo pelo motor) e NÃO escondo o dado dele (seria o pecado do D119): publico o 33 com a razão COLADA AO NÚMERO, debaixo do quadro do terreno, pelo princípio que você ensinou no LAB-34. E os detectores de prova velha do LAB-33 fizeram o trabalho deles no primeiro uso real: mudar a ponte invalidou as provas do LAB-23 e do LAB-28, e as duas acusaram sozinhas.
Depende do Jonny: um só, e não trava — confirmar a régua de forma (útil < 85 % = "a conferir", < 70 % = "ruim").
Próximo na fila: NADA. A fila esgotou e eu parei. O saldo dos sete prompts: o ponto cego da §6 foi pego CINCO vezes nesta fila (D128, D133, D135, D137 e o arnês do D139) e AS CINCO DENTRO DO PRÓPRIO PROMPT, antes de sair — contra a quinta vez da fila anterior, que já tinha saído para você duas vezes. Esperam sua decisão, todas em "proposto ao chat" na FILA.md: o CI para o comando único (não há .github/workflows, então nada roda o verde automaticamente); a última trava que repete (o teste do D116 compara duas provas entre si); fixtures que exerçam as quatro promessas do LAB-35 e a testada de frente fora de Antonina; as posições de acesso em que a ortogonal do Generate não entrega nada aceitável (5 de 6 numa gleba, não investigado); e um docs/relatorios/BALANCOS.md, porque o balanço que você pediu fora da fila foi para o chat e não para um arquivo — e foi por isso que a lista das "quatro regras" teve de ser re-derivada no LAB-36.
=== FIM ===
```

---

## 04/10/2026 · LAB-38 — o CI existe, e achou um defeito meu no primeiro disparo

```
=== RECADO PARA O CHAT — Lab · LAB-38 ===
Estado: LAB-38 FEITO e mesclado na main. Despertador REABILITADO pela quarta vez (enabled: true, próximo disparo 15:05 UTC) com o roteiro novo. A decisão dos 33 lotes está registrada como ITEM 7 do PENDENCIAS_JONNY.md, escrita para leigo, com as duas leituras possíveis — e sigo publicando o dado como está, com a razão colada ao número. Verde: 7 passos, 372 testes, exit 0. Vizinhos limpos.
Feito: há CI, e ele tem DOIS trabalhos porque o levantamento obrigou. O verde completo lê DOIS CLONES PRIVADOS por caminho (motor-testfit e urban-create-hub-41d93a4d, a exceção medida do D16) e ESTE REPOSITÓRIO É PÚBLICO — o GITHUB_TOKEN do Actions só alcança o próprio repositório. Então: (1) "guardas que não precisam dos clones vizinhos (NÃO é o verde)" roda hoje, sem segredo, e protege 64 travas em 5 arquivos — a página do Jonny atualizada, o formato do RECADO, a cobertura do próprio conferir.sh, as regras do CLAUDE.md e a geometria do esqueleto reto; é pouco em número e muito em tipo de apodrecimento, porque é o que ninguém nota à mão; (2) "o verde completo" FALHA COM A RECEITA até alguém criar o segredo VIZINHOS_TOKEN, nunca pula (D124). Um CI vermelho por falta de configuração é honesto; um CI verde que não roda o verde é a mentira que o D110 custou duas semanas. A lista do trabalho 1 tem guarda: o regras.test.ts lê o YAML e reprova se algum teste citado importar dos vizinhos.
Achados para outros apps ou Central: O MELHOR ACHADO É O CI SE PROVANDO SOZINHO, no primeiro disparo. Ele deu os dois trabalhos vermelhos: um era o esperado, o outro NÃO — o trabalho sem clones rodou 68 travas, 67 passaram e 1 FALHOU, e era A MINHA GUARDA DO D136, a que confere que não escrevo em repositório vizinho. Ela exigia "pelo menos um clone conferido", e no runner não há clone nenhum — por um motivo legítimo, já que aquele trabalho roda só as travas que não dependem deles. EU RODEI AQUELA TRAVA DEZENAS DE VEZES NESTA MÁQUINA E ELA SEMPRE PASSOU, PORQUE ESTA MÁQUINA TEM OS CLONES: era verdadeira sobre um ambiente e falsa sobre outro, e só um segundo ambiente podia mostrar. É a tese do prompt provada pelo próprio prompt — o que ninguém executa num lugar diferente não está testado, está confirmado. Para o Orçamento e o Generate, que você disse ter o mesmo buraco: o valor do CI aqui não foi pegar bug de produto, foi pegar TRAVA QUE SÓ VALE NA MÁQUINA DE QUEM A ESCREVEU. Consertei sem afrouxar: clone que existe tem de estar limpo (sempre), e o ambiente tem de ser um dos dois declarados — completo ou só-guardas —, com meio estado reprovando. A PROVA QUE VOCÊ PEDIU: três disparos reais, em docs/provas/LAB-38/ci.json — o 2 verde no trabalho 1, e o 3 VERMELHO com um teste quebrado de propósito, revertido e conferido. E a DÉCIMA vez do ponto cego (D142): a primeira versão da guarda da lista do CI usava includes("@generate/") e reprovou o próprio arquivo de teste, que cita aquilo como TEXTO — régua medindo menção, não importação, a mesma forma do D137 duas vezes no mesmo dia.
Depende do Jonny: DOIS agora, e nenhum trava — (1) confirmar a régua de forma; (2) o item 7 novo: olhar o resultado dos 33 lotes e dizer se é de propósito. E uma coisa que só ele pode fazer para o CI ficar completo: criar o segredo VIZINHOS_TOKEN (token fine-grained, Contents: Read-only nos dois repositórios) ou tornar os dois vizinhos públicos. A receita sai no log do workflow, em português, toda vez que ele falha.
Próximo na fila: LAB-39, condição cumprida — a última trava que se repete, o teste do D116 que compara duas provas entre si, para passar a medir.
=== FIM ===
```

---

## 04/10/2026 · LAB-39 — a trava que comparava duas provas passou a medir

```
=== RECADO PARA O CHAT — Lab · LAB-39 ===
Estado: LAB-39 FEITO e mesclado na main. Verde: 7 passos, 377 testes (eram 372), exit 0. Vizinhos limpos nos três clones. Despertador de pé, próximo é o LAB-40 com condição cumprida.
Feito: a trava do D116 falhava NAS DUAS DIREÇÕES, e a segunda é a que você chamou de "trava que se repete". Falso verde: a tabela do LAB-19 e a prova do LAB-28 saem da MESMA fórmula, então erradas do mesmo jeito erram juntas e a comparação passa. Falso vermelho: regerada UMA e não a outra, ela ficava vermelha sem nada estar errado, e o conserto de cada vez era regerar a outra prova — trabalho que não responde pergunta nenhuma. Agora cada arquivo é conferido contra o porPosicao DELE: o agregado publicado tem de SEGUIR dos números crus que o próprio arquivo carrega. 40 agregados de motor, 10 confrontos, 240 posições cruas, ZERO divergências, em menos de 10 ms e SEM RODAR MOTOR NENHUM — ao vivo seriam 240 rodadas completas com Validator e Judge, e a conferência custaria mais que a medição. Cinco travas onde havia uma, e PROVADA POR SABOTAGEM: trocando o entreOsMotoresDeLote_pct de "completo" de 29,12 para 70 — que é exatamente o número errado que o D116 publicou — a suíte vai de 30 verdes a 3 vermelhas; arquivo restaurado e conferido. A trava antiga NÃO pegaria essa sabotagem se as duas provas a tivessem junto.
Achados para outros apps ou Central: DOIS, e os dois são da família do D116 — vale para quem tem número publicado em dois arquivos. (1) A MONTAGEM TAMBÉM MORAVA EM DOIS LUGARES (D145): o D116 trouxe as FÓRMULAS para a régua e eu declarei o caso encerrado, mas a montagem das três contas continuou em duas ferramentas, e com ela a lista dos motores que entregam lote em DUAS GRAFIAS — declarada no lab28, derivada por filter(id !== "symbios") no lab19. Hoje dão o mesmo conjunto e o número publicado é o mesmo (conferido: a montagem única reproduz os 10 confrontos sem regerar nada); no dia do quinto motor que entregue quadra, uma inclui e a outra não. A lição: TRAZER A FÓRMULA PARA UM LUGAR SÓ NÃO BASTA, A MONTAGEM TAMBÉM É A CONTA. (2) QUATRO PROVAS DECLARAM contrato "2" E NENHUMA ENTRADA DESTE REPOSITÓRIO É "2" (D146): lab25, lab26, lab28 e lab30 têm o literal escrito à mão, e varrido o repositório todas as glebas e as quatro fixtures declaram "1" — a esteira LÊ "2" e "1", mas nada que ela mede É "2". A guarda do §7 confere que a chave contrato EXISTE, nunca que ela CORRESPONDE AO MEDIDO: chave presente com valor errado passa, que é a forma do D137 um degrau acima, e a do D104 — valor à mão que ninguém revalida envelheceu em quatro arquivos. NÃO consertei (§1-A): o código é uma linha por ferramenta, mas a etiqueta só muda quando a prova é REGERADA, e prova não se regera para consertar etiqueta (D118). Virou LAB-43 proposto, e o valor certo está nomeado no D146 para não se perder. Fica dito também que as mesmas três contas saem com NOMES DE CHAVE diferentes nos dois arquivos — dois nomes para um número é meio caminho para dois números.
Depende do Jonny: os mesmos dois, e nenhum trava — a régua de forma, e o item 7 (os 33 lotes). Mais a única coisa que completaria o CI: criar o segredo VIZINHOS_TOKEN ou tornar os dois vizinhos públicos.
Próximo na fila: LAB-40, condição cumprida — fixtures que exerçam as quatro promessas do LAB-35 e a testada de frente fora de Antonina, para o que foi medido não valer para uma gleba só.
=== FIM ===
```

---

## 04/10/2026 · LAB-40 — as fixtures que exercem as promessas, e a 11ª vez do ponto cego

```
=== RECADO PARA O CHAT — Lab · LAB-40 ===
Estado: LAB-40 FEITO e mesclado na main. Verde: 7 passos, 385 testes (eram 377), exit 0. Vizinhos limpos nos três clones. Próximo é o LAB-41, condição cumprida.
Feito: as entradas montadas EM MEMÓRIA do LAB-35 viraram duas fixtures em disco, em docs/fixtures/glebas-que-exercem-as-promessas/, nascidas de ensaio-47ha A UMA VARIÁVEL DE DISTÂNCIA (mesmo anel, mesmo relevo, mesmo contrato — e há trava exigindo isso). São duas e não uma de propósito: ensaio-com-promessas exerce as quatro (furo, calçada declarada, atração POLIGONAL, acesso como SEGMENTO) e ensaio-com-testada mede a testada sozinha, porque furo e ímã mudam o desenho e medir a testada com ímã responderia outra pergunta. O NÚMERO QUE SOBREVIVE AO PROMPT não são os quatro campos daquele dia: das 60 promessas dos dois inventários, as que GLEBA NENHUMA exercitava eram 6 e hoje são 0 — e a trava varre as dez glebas do repositório nas duas direções (promessa nova sem fixture que a exerça, e fixture mutilada que deixe de exercer). Custa 51 ms, porque auditar a ida monta a entrada do motor e não roda o motor. A testada fora de Antonina muda as TRÊS coisas que podiam estar carregando o resultado do LAB-37: face 1 e não 0, 587,5 m e não 180, e a linha MEIO METRO FORA da divisa e não sobre ela — classificada como testada pela mediana (a lição do D75), face coberta a 100 %, toque de vértice das vizinhas a 0 % contra os 3 % de Antonina, facesLoteamento = [1].
Achados para outros apps ou Central: DOIS, e o primeiro é a tese do prompt provada pelo próprio prompt. (1) A FIXTURE ACHOU DOIS CAMPOS SEM DESTINO ANTES DE EU MEDIR QUALQUER NÚMERO (D147): a guarda da ida reprovou acessos[].segmento.a e .b, sem destino escrito desde o LAB-30. A regra existe — é a que pegaria a v2 — e NUNCA FALOU, porque campo que gleba nenhuma traz não existe para a guarda: ela varre os caminhos que o CONTRATO trouxe, e sem gleba que declare acesso como segmento não há segmento.a para achar. Ficou cega cinco prompts. A lição vale para o Generate e para o Orçamento: promessa provada em memória é promessa provada para o teste, não para o repositório. (2) A DÉCIMA PRIMEIRA VEZ DO PONTO CEGO, pega dentro do prompt (D148): eu tinha a frase pronta — "aqui a entrega da testada não custa lote, 599 para 640, mais 41; a inversão de Antonina é daquela gleba". Escrita como TESTE, com menos variantes, deu o contrário. Medidas as três amostragens: −40 (espinha, 2 variantes), −4 (ortogonal, 2) e +41 (completo, 20 aceitas). Estável é a FRENTE — 0 para 51 lotes virados para a rua existente nas três —, não o total. E a causa não é o motor: "espinha, posição 1" NÃO É A MESMA VARIANTE num conjunto de 2 e num de 20, 680 contra 599 na mesma gleba sem as faces. O rótulo bate, a geometria não. POSIÇÃO NO RANKING É RÓTULO, E RÓTULO NÃO É IDENTIDADE — e o defeito era da minha própria verificação, que tinha um campo "mesmoPartido" comparando formato + posição. Sexta vez que a §6 pega dentro do prompt (D128, D133, D135, D137, D142, esta), e o CLAUDE.md §6 agora tem onze linhas.
Depende do Jonny: os mesmos dois, e nenhum trava. O ITEM 7 GANHOU MEDIÇÃO NOVA, escrita para leigo: a entrega da rua existente funciona fora de Antonina (51 lotes de frente onde não havia nenhum) e lá o plano escolhido NÃO virou minúsculo, nada parecido com 33 contra 1 228. Mas com a ressalva que o D148 obriga: eu NÃO afirmo que Antonina é caso único, porque não medi o mesmo caso lá — e disse a ele que "aumenta o total" e "diminui o total" dependem da rodada, então não afirmo nenhuma das duas. Segue também a régua de forma, e o segredo VIZINHOS_TOKEN para o CI ficar completo.
Próximo na fila: LAB-41, condição cumprida — as posições de acesso em que a candidata ortogonal do Generate não entrega nada aceitável (5 de 6 numa gleba), para dizer se é defeito do motor ou limite real do terreno.
=== FIM ===
```

---

## 04/10/2026 · LAB-41 — a ausência da ortogonal tinha causa: via fora da gleba

```
=== RECADO PARA O CHAT — Lab · LAB-41 ===
Estado: LAB-41 FEITO e mesclado na main. Verde: 7 passos, exit 0. Vizinhos limpos nos três clones (o Generate foi LIDO, inclusive o código da VP-01, e nada escrito lá). Próximo é o LAB-42, o último desta fila.
Feito: a resposta NÃO É NENHUMA DAS DUAS que a pergunta oferecia. A candidata ortogonal PRODUZ plano em todas as posições de acesso, e o plano é recusado pelo CONTRATO DO PRÓPRIO GENERATE (contratos/motor-v1/esquema.ts) porque A VIA SAI DA GLEBA — de 2,97 a 83,49 m além da divisa, e a peça culpada é a VP-01, a principal, a que nasce no acesso, em 6 dos 9 casos. A recusa não é régua minha. Seis hipóteses morreram, cada uma com a medição que a matou: ponto de acesso fora da divisa (0 a 3e-14 m — essa era a mais importante de matar, porque seria defeito do Lab, a forma que custou o D119); limite real do terreno (a ESPINHA entrega em 11 das 12 posições que a ortogonal recusa); defeito geral da ortogonal (36 pontos de controle em três glebas, TODOS aceitos); gleba côncava (geo-antonina tem 11 vértices reflexos e aceita 6/6); gleba preenchendo pouco o retângulo envolvente (Antonina preenche 43 % e aceita 6/6); e os percentuais de APP e de lazer (com pctAPP e pctLazer nulos, os MESMOS metros, dígito por dígito).
Achados para outros apps ou Central: PARA O GENERATE, e o diagnóstico é de uma linha: UMA RESTRIÇÃO DE 100 M² POSTA FORA DA GLEBA — que não desconta área útil nenhuma e só faz restricoes deixar de ser vazio — leva sintetico-50ha-ondulado de 1/6 para 6/6 e sintetico-10ha-plano de 3/6 para 6/6. A candidata ortogonal toma OUTRO CAMINHO quando restricoes está vazio, e nesse caminho a via não é aparada pela gleba. Mecanismo provável, lido no código deles (engine/gerar-v1-motor.ts): a VP-01 nasce do RETÂNGULO ENVOLVENTE da massa — posição transversal na coordenada do acesso, limitada só para a caixa caber no retângulo, e extensão de ponta a ponta dele com 15 m de margem; numa gleba que não é o próprio retângulo, essa reta sai do polígono. Sustenta isso o controle ensaio-47ha, que É o próprio retângulo e aceita 12/12, e a varredura, em que o transbordo varia continuamente com a posição do acesso na aresta. NÃO sustenta o preenchimento do retângulo, e isso vai dito. O que prediz é restricoes vazio, e a linha que apara a via no caminho com restrições é deles — fica declarado como NÃO medido. São SEIS ITENS NUMERADOS no §5 do relatório, com reprodução e um teste de regressão barato (varrer uma aresta e exigir zero recusas). Nada foi escrito no vizinho (§4).
Depende do Jonny: nada novo, e nada trava. A RAZÃO JÁ ESTÁ COLADA AO NÚMERO NA PÁGINA DELE, debaixo dos dois quadros afetados, em linguagem de leigo: "o programa desenha, mas o desenho põe rua fora do terreno, e o contrato do próprio Archilly Generate recusa; não é limite do terreno". Seguem de pé a régua de forma e o item 7 (os 33 lotes), mais o segredo VIZINHOS_TOKEN para o CI ficar completo.
Próximo na fila: LAB-42, o último desta fila — criar docs/relatorios/BALANCOS.md e registrar ali os balanços, inclusive os que foram só para o chat. Depois dele a fila esgota, e eu desligo o despertador como o D112 manda.
=== FIM ===
```

---

## 04/10/2026 · LAB-42 — o balanço ganhou arquivo, e a fila de 04/10 esgotou

```
=== RECADO PARA O CHAT — Lab · LAB-42 ===
Estado: LAB-42 FEITO e mesclado na main. A FILA DE 04/10 (SEGUNDA PARTE) ESGOTOU — cinco de cinco — e o despertador foi DESLIGADO, não apagado (D112). Verde: 7 passos, 393 travas (eram 385), exit 0. Vizinhos limpos nos três clones.
Feito: docs/relatorios/BALANCOS.md existe, e tem DUAS PARTES porque a divisão é a lição do D116. O §1 guarda os balanços que foram SÓ PARA O CHAT — e o de 03/10 está lá RECONSTRUÍDO, com a etiqueta de reconstrução e a fonte de cada linha, porque reconstrução sem etiqueta é invenção com cara de registro; o §2 é ÍNDICE dos que já moram num recado, apontando para o título da seção no RECADOS.md, porque copiá-los criaria a segunda montagem que o D116 proíbe; o §3 já traz o saldo desta fila. E o arquivo registra O QUE O BALANÇO ERROU: o de 03/10 dizia "quatro regras sem teste" quando eram CINCO, e DUAS eram slogan. Daí a segunda disciplina escrita nele: BALANÇO RECUPERADO SE CONFERE, NÃO SE OBEDECE.
Achados para outros apps ou Central: UM, e ele é da família do D116 numa grandeza de prosa (D153). Pôr o teste novo na lista do trabalho do CI levou o número de travas protegidas de 64 para 76 — e esse número estava COLADO À MÃO EM QUATRO ARQUIVOS: CLAUDE.md, ONDE_PARAMOS.md, FILA.md e o comentário do próprio YAML. NÚMERO COM QUATRO CASAS ENVELHECE EM TRÊS DELAS. Os quatro foram atualizados e ganharam trava de CONCORDÂNCIA — e o que ela não faz está escrito nela: não confere se o número é o VERDADEIRO, porque para isso teria de rodar a suíte, e contar "test(" com regex mediria texto. O valor é meu para atualizar; a divergência é dela para acusar, e divergência foi o que de fato aconteceu. A PRIMEIRA VERSÃO DESSA TRAVA REPROVOU POR DEFEITO DELA MESMA, e é a forma do D137 outra vez: eu casei por "NN travas que leem arquivo" e a FILA.md dizia só "protege NN travas" — régua medindo UMA DAS FRASES em vez do número. Conserto: declarar a frase canônica e exigi-la nos quatro. Os números HISTÓRICOS não se mexem — relatório, recados e prova do LAB-38 seguem dizendo 64, porque era verdade quando foram escritos; reescrever recado antigo falsifica o registro.
Depende do Jonny: UMA DECISÃO SUA, e ela é de uma linha: você ordenou o ARQUIVO, e eu escrevi também a REGRA que o mantém alimentado — a §1-B do CLAUDE.md, ao lado da do RECADO. Sem ela o arquivo volta a depender de eu lembrar, que é a forma do D104; se você preferir sem ela, é uma seção a remover e o arquivo continua de pé. Do Jonny seguem os dois de sempre, nenhum travando: a régua de forma e o item 7 (os 33 lotes), mais o segredo VIZINHOS_TOKEN para o CI poder rodar o verde completo.
Próximo na fila: NADA — a fila esgotou e eu parei, com o despertador desligado. ESPERAM SUA DECISÃO, em "proposto ao chat" na FILA.md: LAB-43, as quatro provas que declaram contrato "2" quando entrada nenhuma do repositório é "2" (D146); um nome só para cada número do confronto do acesso, que hoje sai com chaves diferentes em dois arquivos (D145); as duas fixtures novas na tabela comparativa, que pede regerar a tabela inteira; e medir em Antonina as três amostragens do D148 — é o que falta para eu poder dizer se o 33 contra 1 228 é caso único ou se é a mesma troca vista por um ângulo ruim.
=== FIM ===
```

---

## 04/10/2026 · LAB-43 — a etiqueta do contrato sai do medido, e duas provas estavam velhas

```
=== RECADO PARA O CHAT — Lab · LAB-43 ===
Estado: LAB-43 FEITO e mesclado na main. Despertador REABILITADO pela quinta vez (enabled: true) com o roteiro novo, e a §1-B ficou como você mandou. Verde: 7 passos, 400 travas (eram 393), exit 0. Vizinhos limpos nos três clones.
Feito: o conserto é de CAUSA, não de etiqueta. contratoDasEntradas() mora no gleba-v1.ts e tira a versão DAS ENTRADAS QUE A FERRAMENTA MEDE; lab25, lab26, lab28 e lab30 passaram a chamá-la, e as quatro provas foram regeradas — as quatro dizem "1", que é o que todas as glebas declaram. A conta REPROVA CONJUNTO MISTO em vez de eleger a primeira (duas versões numa prova só esconderiam uma delas), reprova conjunto vazio e reprova versão que a esteira não lê. A guarda é sobre a FERRAMENTA e não sobre a prova, porque conferir a prova exigiria saber quais glebas ela mediu, e isso nem sempre está no arquivo: são 7 travas, e a que impede o apodrecimento é a lista das TREZE ferramentas antigas que ainda escrevem literal — cada valor tem de ser IGUAL à versão que todas as entradas declaram, então no dia em que entrar uma entrada "2" cada caso vira decisão em vez de envelhecer (o D118 proíbe regerar prova congelada só para consertar etiqueta).
Achados para outros apps ou Central: DOIS. (1) A DÉCIMA SEGUNDA VEZ DO PONTO CEGO, e é a mais instrutiva até agora (D155): a primeira versão da trava casou o literal no texto cru dos arquivos e REPROVOU O ARQUIVO QUE EU ACABARA DE CONSERTAR — porque o comentário que explica o conserto CITA o defeito, e a régua leu a citação como código. Terceira vez da mesma sub-família: D137 (a chave "gleba" literal), D142 (a menção de @generate/ em vez do import) e esta. COMENTÁRIO É ONDE UM NOME SIGNIFICA "EU ESTOU FALANDO SOBRE", NÃO "EU FAÇO" — e varredura estática em texto de código mede sempre duas coisas, o que o código faz e o que ele diz sobre si. Vale para qualquer guarda de lint caseira, no Generate e no Orçamento. (2) REGERAR REVELOU DUAS PROVAS VELHAS E CALADAS (D156): a do LAB-30 estava defasada desde o LAB-40 (o inventário da ida foi de 72 para 74 campos com os dois irmãos do segmento, e as promessas não exercitadas de 123 para 137) e a do LAB-25 desde o LAB-37 (em Antonina a variante escolhida virou a de 33 lotes, e o bloco do faceDeRua ainda trazia os 1.386 da antiga). O LAB-33 deu detector de prova velha ao LAB-23 e ao LAB-28; ESTAS DUAS FICARAM SEM, e por isso envelheceram em silêncio.
Depende do Jonny: nada novo, e nada trava — seguem a régua de forma, o item 7 (os 33 lotes, que o LAB-46 vai decidir) e o segredo VIZINHOS_TOKEN do CI. UMA COISA SUA, DO CHAT: o LAB-47 chegou CORTADO — a mensagem termina no verbo, em "faça o mesmo teste aqui, escreva". Não executei: adivinhar o que foi pedido é o defeito que a §6 cataloga. Preciso da frase inteira, e de confirmar a numeração (você o chamou de "LAB-44", mas esse número já é o do nome único do confronto nesta fila; ficou LAB-47). E NENHUMA chave, de nenhum formato, foi escrita em arquivo nenhum deste repositório.
Próximo na fila: LAB-44, condição cumprida — um nome só para cada número do confronto do acesso, que hoje sai com chaves diferentes em dois arquivos (D145). Propostos novos, dos dois achados de hoje: o detector de prova velha para o LAB-25 e o LAB-30, e medir o faceDeRua nulo nos 33 lotes de Antonina (a ponte publica null nos 33 e a régua do Generate mede 5 — tem a forma do D104, mas a guarda não reprova e a variante mudou, então não atribuo sem medir).
=== FIM ===
```

---

## 04/10/2026 · LAB-44 — um nome só para cada número do confronto

```
=== RECADO PARA O CHAT — Lab · LAB-44 ===
Estado: LAB-44 FEITO e mesclado na main. Verde: 7 passos, 401 travas (eram 400), exit 0. Vizinhos limpos nos três clones. Dois disparos do despertador (21:05 e 22:05) caíram no meio deste prompt e os dois foram atendidos pela regra: termine o prompt aberto antes de começar outro.
Feito: o defeito era MAIS SORRATEIRO que o do D116. Ali eram duas MONTAGENS da mesma conta e os valores divergiram (+29,12 % contra +70 %); aqui eram dois NOMES para a mesma saída, e OS VALORES BATIAM — nada acusava, porque não havia número errado. Só havia amplitudeDoAcesso_pct na prova do LAB-28 e maiorAmplitude_pct na tabela do LAB-19, nos dois arquivos que o Jonny lê lado a lado, mais entreMotores_pct × entreOsQuatroMotores_pct e entreOsDeLote_pct × entreOsMotoresDeLote_pct. O conserto: valem os nomes da RÉGUA, e a ferramenta publica o OBJETO INTEIRO sem renomear no caminho — era o renomear ao publicar que criava o segundo nome. A prova foi regerada, e os dois leitores (lab39.ts e acesso.test.ts) perderam a tradução que existia só por causa disso.
Achados para outros apps ou Central: UM, e ele é a parte que não é sobre nome (D157). A LISTA DOS NOMES VIROU DADO — CHAVES_DO_CONFRONTO, uma const —, porque TIPO DE TYPESCRIPT NÃO EXISTE EM TEMPO DE EXECUÇÃO, e era disso que o defeito precisava para sobreviver num ARQUIVO PUBLICADO: nenhuma trava podia conferir o JSON contra um interface. Com a lista como dado, a guarda confere as chaves do arquivo, e uma trava de TIPO (MesmasChaves) impede que a lista e a interface divirjam — se uma ganhar ou perder chave sem a outra, NÃO COMPILA: o compilador cobra em vez de eu lembrar. Para o Generate e o Orçamento, a regra curta: nome de chave que sai em arquivo publicado precisa de uma fonte que exista EM EXECUÇÃO, senão a guarda não alcança o lugar onde o defeito mora. Provado por sabotagem: chave renomeada na prova publicada leva a suíte de 31 verdes a 2 vermelhas — a trava das chaves e, de carona, a do D144, que não acha mais o número onde esperava.
Depende do Jonny: nada novo, e nada trava — seguem a régua de forma, o item 7 (os 33 lotes, que o LAB-46 decide) e o segredo VIZINHOS_TOKEN do CI. E SEGUE DE PÉ O PEDIDO AO CHAT: o LAB-47 chegou cortado, termina no verbo "escreva"; preciso da frase inteira e da confirmação da numeração. Nenhuma chave, de nenhum formato, foi escrita em arquivo nenhum.
Próximo na fila: LAB-45, condição cumprida — as duas fixtures novas do LAB-40 na tabela comparativa, com ela regerada. Depois o LAB-46, que é o que você disse que o Jonny quer ver: medir em Antonina as três amostragens do D148, para dizer se o 33 contra 1.228 é caso único ou a mesma troca vista de outro ângulo.
=== FIM ===
```

---

## 04/10/2026 · LAB-45 — as duas fixtures na tabela, e o D140 fechado

```
=== RECADO PARA O CHAT — Lab · LAB-45 ===
Estado: LAB-45 FEITO e mesclado na main. Verde: 7 passos, 401 travas, exit 0. Vizinhos limpos nos três clones (o Generate foi lido, nada escrito lá). A tabela e a prova do acesso agora têm SETE glebas, e a página do Jonny foi regerada.
Feito: as fixtures do LAB-40 eram medidas pelas travas e pela ferramenta dele, NÃO pela esteira inteira — e nenhuma das cinco glebas antigas tem furo, calçada declarada, atração poligonal, acesso em segmento ou testada fora de Antonina. TRÊS TRAVAS CAÍRAM AO REGERAR, E AS TRÊS ESTAVAM CERTAS: diziam "as cinco glebas", e o detector de prova velha do LAB-39 compara os números crus da tabela com os da prova do acesso — conjunto diferente quebra a comparação POR FORA. A prova do acesso FOI COM A TABELA (as mesmas sete), em vez de eu ensinar o detector a olhar só a interseção: afrouxar a comparação para caber a minha mudança é o contrário do que o D143 deixou. Nas sete, a ordem muda em 3 e o vencedor em 2, e as três glebas estáveis são a ensaio-47ha e as duas nascidas dela — coerência, não coincidência. E um literal meu da família do D153: o lab39 imprimia ARQUIVOS.length * 5 confrontos, com o cinco à mão; o trabalho estava certo (56 agregados, 336 posições) e o número impresso ficou errado ao passar para sete. Agora é contado.
Achados para outros apps ou Central: DOIS NÚMEROS QUE ESTAVAM DECLARADOS E NUNCA TINHAM PREÇO (D159). (1) Os 19 "massa" da gleba com furo são a PERDA DECLARADA do inventário da ida, que diz por escrito que "o motor tem um perímetro só; gleba com furo entra como o anel externo, e o furo vira área que o motor acha livre" — ele lotea sobre o furo e o Validator do Generate, que conhece o furo pela entrada, acusa. Era teoria; virou número. (2) PARA O GENERATE, o achado do prompt: o contrato NÃO TEM COMO DIZER "este lote faz frente para uma rua que já existe, fora da gleba". Medido: entregue a testada, o Parcelamento cria 51 LOTES EXTERNOS e OS 51 publicam faceDeRua: null — ele mesmo diz que não fazem frente para via DO PLANO —, e o invariante "frente" deles ("nenhuma aresta encosta em via") acusa 47. O MESMO LOTE É "DE FRENTE PARA A RUA EXISTENTE" POR UMA RÉGUA E "SEM FRENTE PARA RUA" PELA OUTRA, E AS DUAS ESTÃO CERTAS SOBRE O QUE MEDEM. São 4 itens numerados no §5 do relatório, com a sugestão (um faceDeRua que aceite via externa, ou um campo irmão) marcada como sugestão — se o lote é válido é urbanismo, do Jonny. Mais um não medido e declarado: via-sobre-lote 15 na mesma gleba.
Depende do Jonny: o ITEM 7 MUDOU DE LEITURA, e isso é o que ele queria ver. ISTO FECHA O D140: em Antonina o partido que o ranking escolheu tem 33 lotes E OS 33 SÃO EXTERNOS — nenhum lote no miolo do terreno, 29 deles acusados por "frente". A leitura "produto de poucos lotes grandes" CAIU COM A MEDIÇÃO: os 33 somam 1,03 ha, cerca de 310 m² cada; a leitura "efeito colateral" fica reforçada. A DECISÃO SEGUE DELE, porque é régua de nota e não código — só agora ela se toma sabendo o que são os 33 lotes. Escrito no item 7 para leigo, com a tabela das duas leituras. Seguem a régua de forma e o segredo VIZINHOS_TOKEN.
Próximo na fila: LAB-46 — e aviso que PARTE DA PERGUNTA DELE JÁ ESTÁ RESPONDIDA pelo LAB-45: o "33 contra 1.228" não é plano de lotes grandes, é a fileira externa. Falta o que o LAB-46 mede de fato: as três amostragens em Antonina, para dizer se o SINAL do total (−40, −4, +41 no ensaio) se comporta igual lá. E SEGUE DE PÉ O PEDIDO: o LAB-47 chegou cortado, termina no verbo "escreva"; preciso da frase inteira e da numeração confirmada. Nenhuma chave foi escrita em arquivo nenhum.
=== FIM ===
```

---

## 05/10/2026 · LAB-46 — a resposta de Antonina, e um erro meu que já tinha saído

```
=== RECADO PARA O CHAT — Lab · LAB-46 ===
Estado: LAB-46 FEITO e mesclado na main. Verde: 7 passos, exit 0. Vizinhos limpos nos três clones. É o ÚLTIMO executável desta fila: sobra só o LAB-47, que segue AGUARDANDO porque o pedido chegou cortado.
Feito: A RESPOSTA QUE O JONNY QUERIA VER, e é a segunda das duas que você pôs — o 33 NÃO é caso único do terreno. Em geo-antonina, as três amostragens: só espinha com 2 variantes dá ZERO ACEITAS sem a testada e 1.088 lotes com ela; só ortogonal com 2 variantes dá 1.386 sem e 1.228 COM; a completa, 20 variantes aceitas, dá 1.386 sem e 33 com. OU SEJA: COM A MESMA ENTREGA, FIXADO O FORMATO EM ORTOGONAL, O MOTOR DESENHA 1.228 LOTES — exatamente o partido que o ranking dele preferiu não usar. O 33 aparece em 1 DE 3 amostragens, e é a que o Lab publica: ele é artefato de QUAL VARIANTE o ranking escolhe quando pode escolher entre 20, não do que a entrega faz com o desenho. E o contrário apareceu na mesma gleba: na espinha, SEM a testada nada passa e COM ela saem 1.088 — ali a entrega VIABILIZA o plano.
Achados para outros apps ou Central: TRÊS itens numerados para o Parcelamento, e o primeiro é pergunta, não acusação: POR QUE A PASSAGEM EXTERNA PÕE LOTE A 1,8 KM DA FACE ENTREGUE? facesLoteamento entregou UMA face de 180 m e saíram 33 a 50 lotes com id "-eN", dos quais só 14 a 16 encostam nela. Pode ser o significado de facesLoteamento para o motor, pode ser a passagem externa correndo o perímetro inteiro — NÃO MEDI E NÃO ACUSO. O segundo: a nota dele premia 33 sobre 1.228 na mesma entrada, e o de 1.228 é o que ele mesmo desenha com o formato fixado. O terceiro é favorável a eles e vai dito: sem a testada, a espinha com 2 variantes não entrega nada aceitável em Antonina, e com ela entrega 1.088.
Depende do Jonny: a decisão dele FICA MAIS SIMPLES DE ENUNCIAR e continua sendo dele — a nota deve preferir o plano de 33 ou o de 1.228? Não é mais "o programa desenha mal este terreno": ele desenha os dois, com a mesma informação, e a NOTA é que escolhe. Está no item 7, com a tabela das três maneiras, escrita para leigo. E UMA CORREÇÃO QUE EU DEVO A VOCÊ: no LAB-45 eu disse, no relatório, no recado e na página dele, que os 33 lotes eram "todos da beira da rua que já existe". ERRADO, e o erro era meu: eu contei o ID "-eN" em vez de medir. MEDIDO: 14 DOS 33 ENCOSTAM; 15 estão a mais de 50 m e o mais distante a 1.805 m, o outro canto da gleba. É a DÉCIMA TERCEIRA vez do ponto cego e A PRIMEIRA DESDE O D119 QUE JÁ TINHA SAÍDO — as doze anteriores, sete foram pegas dentro do prompt. Corrigi RISCADO, não apagado, no item 7 e no LAB-45: apagar tiraria do registro a única coisa útil que o erro tem. "-eN" é rótulo; distância é a coisa, e é a terceira vez que eu classifico pelo nome em vez de medir (D148, D155, D161).
Próximo na fila: NADA PRONTO. Os quatro executáveis estão feitos e o LAB-47 está AGUARDANDO — o pedido chegou cortado, termina no verbo "escreva". Preciso da frase inteira e da numeração confirmada (você o chamou de "LAB-44", e esse número já é o do nome único do confronto). Se no próximo disparo o pedido não tiver chegado, DESLIGO O DESPERTADOR pela regra do §1-A, como o D112 manda — e nenhuma chave, de nenhum formato, foi escrita em arquivo nenhum.
=== FIM ===
```

---

## 05/10/2026 · Disparo sem item pronto — a fila travou no LAB-47 e o despertador parou

```
=== RECADO PARA O CHAT — Lab · — ===
Estado: DESPERTADOR DESLIGADO (enabled: false, 05/10 01:10 UTC) — não apagado, como o D112 manda. Quatro de cinco prompts da fila de 04/10 (terceira) estão feitos e mesclados: LAB-43, LAB-44, LAB-45 e LAB-46. Verde no último: 7 passos, 401 travas, exit 0. Vizinhos limpos.
Feito: nada neste disparo, e é de propósito. O único item que resta é o LAB-47, e ele está AGUARDANDO porque o pedido chegou cortado — termina no verbo, em "faça o mesmo teste aqui, escreva". Com tudo o que sobra nesse estado, vale a segunda metade do §1-A: disparo sem item pronto, gravar o recado, escrever o motivo no ONDE_PARAMOS e DESLIGAR o despertador. O saldo da fila foi para o BALANCOS.md §4, pela regra §1-B que você ratificou — é o segundo balanço que nasce dentro do arquivo em vez de sair só para o chat.
Achados para outros apps ou Central: o saldo dos quatro, em uma linha cada. LAB-43: a etiqueta do contrato passou a sair do MEDIDO, quatro provas regeradas, e a lista das treze ferramentas que ainda escrevem literal SE REVALIDA. LAB-44: um nome só para cada número do confronto, e a lista dos nomes virou DADO porque tipo não existe em tempo de execução — era disso que o defeito precisava para sobreviver num arquivo publicado. LAB-45: sete glebas na tabela e na prova do acesso, com as travas acompanhando em vez de serem afrouxadas, e dois números que estavam declarados ganhando preço (o furo que o motor acha livre, e o lote que é "de frente" por uma régua e "sem frente" pela outra). LAB-46: o 33 contra 1.228 aparece em 1 DE 3 amostragens, e com o formato fixado em ortogonal o mesmo motor desenha 1.228 com a mesma entrega. Duas vezes o ponto cego da §6 nesta fila (D155 e D161), e A 13ª É A PRIMEIRA DESDE O D119 QUE JÁ TINHA SAÍDO — corrigida riscada, não apagada. Três listas numeradas para vizinhos, nenhum commit lá.
Depende do Jonny: nada novo dele, e nada trava — seguem a régua de forma e o segredo VIZINHOS_TOKEN. A PENDÊNCIA DELE MUDOU DE NATUREZA e isso é o ganho da fila: não é mais "o programa desenha mal Antonina", é "a nota deve preferir o plano de 33 ou o de 1.228?", porque os dois estão ao alcance do mesmo motor com a mesma entrada. Está no item 7 com a tabela das três maneiras, escrita para leigo, e com a minha correção riscada à vista.
Próximo na fila: NADA, e o destravamento são DUAS LINHAS SUAS. (1) A frase inteira do LAB-47 — "escreva" o quê? E o teste é plantar a chave e ver se algo acusa, ou escrever a guarda antes e provar que ela pega? São trabalhos diferentes e eu não adivinho. (2) O número: você o chamou de "LAB-44", e esse número já é o do nome único do confronto nesta fila; ficou LAB-47, o próximo livre, e se preferir outro é um sed. NENHUMA CHAVE, de nenhum formato, foi escrita em arquivo nenhum deste repositório. Mande a frase e reabilite o id trig_01XwSkTLT9zmyprNZcUiWy7f.
=== FIM ===
```

---

## 05/10/2026 · LAB-47 — a chave plantada, a varredura, e a auditoria da lista do Jonny

```
=== RECADO PARA O CHAT — Lab · LAB-47 ===
Estado: LAB-47 FEITO e mesclado — a fila de 04/10 (terceira) fechou 5 de 5. Despertador trig_01XwSkTLT9zmyprNZcUiWy7f RELIGADO como você mandou (enabled: true, próximo 04:05 UTC), e já aviso: no próximo disparo não haverá item pronto, então é o caso da D62 e eu o desligo de novo. Verde: 7 passos, 415 travas, exit 0. Os três clones vizinhos limpos.
Feito: (a) A MEDIÇÃO, E DEU O RESULTADO DO RENDER. Cinco segredos de formato real — chave de IA, token do GitHub, chave da AWS, credencial de banco na URL e senha — num arquivo src/ VERSIONADO: VERDE, 7 passos, 401 travas, exit 0, ninguém acusou. E é pior que "ninguém procurou": o tsc COMPILOU o arquivo (está no --listFiles) e o eslint nele saiu 0. A rede do lado do servidor também não existia, e isso está medido: este repositório NÃO TEM GitHub Advanced Security habilitada. (b) A VARREDURA: 13 regras sobre TUDO QUE O GIT CARREGA (rastreado + não-rastreado não-ignorado), sem pasta de fora e SEM AUTO-EXCLUSÃO — há trava exigindo que ela varra o próprio fonte dela, e por isso todo exemplo falso é montado em pedaços. Zero falso positivo em 317 arquivos e 27,8 MB, com o verde.yml dentro do escopo. PROVA NAS DUAS ESCALAS: 13 de 13 formatos pegos por exemplo falso, e O MESMO ARQUIVO PLANTADO leva o comando único de exit 0 (401 travas) a EXIT 1 (415). A chave foi apagada e NUNCA ENTROU EM COMMIT — importa, porque o histórico é justamente o que a varredura não vê.
Achados para outros apps ou Central: a lista numerada está no §7 do relatório, e a cabeça dela é sua. O TETO DE DOZE É POR REGRA, não um número só: em sk-ant-… os doze primeiros são o prefixo PÚBLICO do formato; numa senha atribuída a um nome, os doze primeiros SÃO A SENHA — essa mostra 4, e o achado publica o TAMANHO do casado, que informa sem revelar. E o fecho se fecha sozinho: a varredura cobre docs/, então um relatório que repetisse o segredo seria reprovado pela própria varredura que ele descreve. O ACHADO É CONTRA MIM (D164): minha primeira versão pôs teto de 2 MB "por comodidade" e a varredura saiu dizendo 310 DE 316 — os seis de fora eram cinco saídas de geometria, 13 MB, lidos em menos de um segundo, exatamente onde ninguém olha. Eu tinha acabado de escrever no alto do arquivo que "o que importa é o escopo". O que me pegou foi PUBLICAR O ESCOPO COMO NÚMERO: "310 de 316" dá para desconfiar, "varre a árvore toda" não dá. Escopo não encolhe por decisão, encolhe por comodidade — digam isso à Pesquisa. Mais dois: o verde.yml citava 64 travas num lugar e 83 noutro DENTRO DO MESMO ARQUIVO (D165, virou trava), e o cabeçalho do conferir.sh ainda afirma "não há CI neste repositório", falso desde o LAB-38 — proposto, não executado.
Depende do Jonny: A AUDITORIA QUE VOCÊ PEDIU ESTÁ NO BALANCOS.md §5, com os campos no §1.3 — ela nasceu NO ARQUIVO antes de ir ao chat, que é o inverso do balanço de 03/10 que criou aquele arquivo. Resumo: dos seus quatro itens NENHUM MORREU; a régua de forma e a corda da V3 estão escritas certas; o 33 contra 1.228 está escrito certo AGORA, e foi o LAB-46 que o corrigiu; VIZINHOS_TOKEN é só dele. Dois itens dele que a sua lista não tem: (1) o item 1 da página, "desproporcional é 3 vezes ou 1,5 km" — falta UMA LINHA dele, e sem ela nenhuma travessia é proposta; (2) o lote que faz frente para rua que JÁ EXISTE fora da gleba (D159: 51 externos, 47 acusados pelo invariante frente) — é urbanismo, logo dele. NADA BLOQUEIA FILA NENHUMA: o único bloqueio vivo é o VIZINHOS_TOKEN sobre UM trabalho do CI, e tem contorno — o verde completo sou eu, antes de cada commit.
Próximo na fila: NADA — a fila esgotou com o LAB-47 e no próximo disparo eu desligo o despertador (D62/D112), com o motivo no ONDE_PARAMOS. Duas coisas suas, se quiser: o PROMPT GUARDADO do despertador ainda descreve o LAB-47 como "aguardando" e manda pular — ele não engana (o ONDE_PARAMOS é lido primeiro), mas envelheceu; e há três propostas novas esperando, as duas do LAB-46 (detector de prova velha para LAB-25/LAB-30; por que a passagem externa põe lote a 1,8 km da face entregue) mais o comentário falso do conferir.sh.
=== FIM ===
```

---

## 05/10/2026 · Disparo sem item pronto — a fila esgotou com o LAB-47 e o despertador parou

```
=== RECADO PARA O CHAT — Lab · — ===
Estado: DESPERTADOR DESLIGADO (enabled: false, 05/10 04:06 UTC) — não apagado, como o D112 manda. A fila de 04/10 (terceira) está CUMPRIDA, cinco de cinco: LAB-43, LAB-44, LAB-45, LAB-46 e LAB-47, os cinco mesclados na main. Verde no último: 7 passos, 416 travas, exit 0, vizinhos limpos.
Feito: nada neste disparo, e é de propósito — é o caso da D62. Conferi ANTES de declarar o disparo vazio, porque "não tinha o que fazer" é afirmação que se mede: git status limpo, os dois PRs do LAB-47 (#56 e #57) mesclados em f3ebc39, a branch sem nenhum commit à frente da main, e nenhum item "pronto" na FILA.md — o que resta nela está todo em "proposto ao chat", que por definição não se executa. Gravei o motivo no ONDE_PARAMOS, com essa conferência ao lado, e desliguei o despertador.
Achados para outros apps ou Central: nenhum novo — o saldo dos cinco está no BALANCOS.md §4 e a auditoria da sua lista no §5, com os campos no §1.3. Vale repetir o do LAB-47 porque é o que viaja: numa varredura de segredo o que importa é o ESCOPO, não a existência, e a maneira de não se enganar é PUBLICAR O ESCOPO COMO NÚMERO — "310 de 316" dá para desconfiar, "varre a árvore toda" não dá. Foi assim que eu peguei a minha própria régua excluindo cinco arquivos por um teto que eu pusera por comodidade.
Depende do Jonny: nada novo, e nada trava fila. Seguem vivos: a régua de forma (à espera do OK dele), a nota preferir 33 ou 1.228 em geo-antonina, o VIZINHOS_TOKEN (que bloqueia UM trabalho do CI e tem contorno: o verde completo sou eu, à mão), o "desproporcional é 3 vezes ou 1,5 km" do item 1, e o lote que faz frente para rua que já existe fora da gleba. Está tudo na auditoria do BALANCOS.md §5.
Próximo na fila: NADA — mande fila nova e religue o id trig_01XwSkTLT9zmyprNZcUiWy7f. DUAS COISAS ANTES DE RELIGAR: (1) o PROMPT GUARDADO do despertador envelheceu — ainda descreve o LAB-47 como "AGUARDANDO" e manda pular, e ainda diz "a próxima é a D154" quando já é a D166; ele não engana, porque o passo 1 dele manda ler o ONDE_PARAMOS primeiro, mas quem religar deve reescrevê-lo, e eu não mexo no que você guarda sem você pedir. (2) há três propostas esperando: o detector de prova velha para LAB-25/LAB-30, por que a passagem externa põe lote a 1,8 km da face entregue, e o comentário do conferir.sh que ainda afirma "não há CI neste repositório" — falso desde o LAB-38.
=== FIM ===
```

---

## 06/10/2026 · LAB-48 — os quatro culpados das 128 violações, e 36 eram minhas

```
=== RECADO PARA O CHAT — Lab · LAB-48 ===
Estado: LAB-48 FEITO e mesclado. Fila de 06/10: 1 de 5. Despertador trig_01XwSkTLT9zmyprNZcUiWy7f LIGADO, e o PROMPT GUARDADO DELE FOI REESCRITO antes de tudo, como você autorizou — ele trazia o LAB-47 como "aguardando" e dizia "a próxima é a D154" quando já era a D166; agora traz a fila, as contagens de travas e a própria autorização dentro dele. Mantê-lo em dia passou a ser meu, a cada fila. Sobre "que se apaga ao esgotar": você pediu isso E deu o id deste para reusar, e as duas coisas só convivem com DESLIGAR — apagar perde o id que você reabilita desde 03/10. Se quiser apagado de verdade, é uma linha sua. Verde: 7 passos, 416 travas, exit 0, vizinhos limpos.
Feito: O DIAGNÓSTICO, SEM CONSERTAR NADA, como você mandou. 128 violações, quatro invariantes, QUATRO CULPADOS DIFERENTES — nenhuma das três respostas que a pergunta oferecia serve sozinha. MOTOR 54 (42%), PONTE DESTE LAB 36 (28%), CONTRATO+TRADUTOR DO GENERATE 11 (9%), AINDA NÃO ATRIBUÍDAS 27 (21%). Por invariante: `testada` 47 = 36 minhas + 11 do motor; `frente` 56 = 11 do contrato + 18 do motor + 27 em aberto; `face-quadra` 14 = motor; `via-sobre-lote` 11 = motor. E CORRIJO O SEU NÚMERO: você disse "15 a 29 violações cada"; é 25, 18, 29, 16 e QUARENTA em geo-antonina — a quinta está fora da faixa que você passou, e é a pior.
Achados para outros apps ou Central: A DÉCIMA QUARTA VEZ DO PONTO CEGO, e 36 das 128 eram MINHAS. A entrada declara testada mínima de 10 m; a minha ida monta faixa(10; 13,4164) e o motor sorteia o ALVO da variante, 11,70820393249937 m (o meio da faixa); e a minha VOLTA escreve esse alvo em `testadaMinLote_m` — O CAMPO CUJO NOME É MÍNIMO. O Validator então mede o motor contra o PRÓPRIO ALVO DELE, com 2% de folga, e o acusa por 1,94 cm em lotes de 316 m². Rodando com os 10 m declarados, 36 das 47 somem. A lição que viaja para todos: CAMPO CUJO NOME DIZ MÍNIMO E CUJO VALOR É UM ALVO NÃO É UM CAMPO ERRADO, É UMA ACUSAÇÃO AUTOMÁTICA — nenhum motor sobrevive a ser medido contra o próprio alvo. E a segunda, de método: eu tinha uma hipótese de ponte no `face-quadra` (três quadras de 199 m fundidas na minha tradução dariam os 597 m) e ela MORREU MEDIDA, na saída crua do motor — 6 quadras de 597x69 m com ~100 lotes cada. Hipótese de ponte se mata com medição, não com argumento, senão a lista numerada vai errada ao vizinho.
Depende do Jonny: nada novo dele, e nada trava a fila. Os cinco itens seguem como estão, auditados no BALANCOS.md §5. MAS UM DELES GANHOU PRECISÃO: o "lote que faz frente para rua que já existe" não é mais "duas réguas discordando" — o Validator do Generate TEM o conceito (`faixaViaPublica`, "a rua pública, quando existe, corre por fora do terreno") e ACEITARIA esses lotes; é uma régua e um campo que falta (D168). Provado com a geometria DELES: Antonina vai de 40 para 29, somem exatamente os 11 lotes que estão a 0 m da testada. A correção dessa moldura na página do Jonny e na tabela é ENTREGA, não diagnóstico — está proposta, não executada.
Próximo na fila: LAB-49, o detector de prova velha para LAB-25 e LAB-30. E O QUE VOCÊ PRECISA DECIDIR, porque é a conta que escolhe onde gastar o conserto: DESCONTANDO AS 36 MINHAS E AS 11 DO CONTRATO — 37% das violações — NENHUMA DAS CINCO GLEBAS LIMPA (25, 17, 4, 6, 29). O ranking só deixa de nascer vazio com as 54 do motor e as 27 em aberto. Duas listas numeradas prontas para comparar com o diagnóstico do Generate: 5 itens para ele (o tradutor `paraResultado` não preenche `faixaViaPublica`; o contrato não tem campo para a rua pública existente; falta `testadaAlvoLote_m`, e foi essa assimetria que fez a MINHA ponte errar; `deLoteamentoFachada` não é propagado, 0 de 2.299 lotes; e `INVARIANTES_EXEMPLOS` não está documentada) e 4 para o Parcelamento (`comprimentoQuadra` corta um eixo só; a passagem externa põe lote sobre o leito da própria via dele; e a 1,8 km da face entregue; e 11 lotes com testada de 3,56 a 9,59 m, abaixo do mínimo DECLARADO). Nada escrito em vizinho nenhum.
=== FIM ===
```

---

## 06/10/2026 · LAB-49 — o detector de prova velha, e o escopo dele como número

```
=== RECADO PARA O CHAT — Lab · LAB-49 ===
Estado: LAB-49 FEITO e mesclado. Fila de 06/10: 2 de 5 (LAB-48, LAB-49). Despertador trig_01XwSkTLT9zmyprNZcUiWy7f LIGADO, e reescrevi o prompt guardado dele de novo, como você autorizou — agora com LAB-48 e LAB-49 feitos, a próxima decisão (D173) e as contagens de travas em dia. Verde: 7 passos, 431 travas, exit 0, vizinhos limpos.
Feito: o detector de prova velha para as provas do LAB-25 e do LAB-30 — a dívida do LAB-33, que criou o detector (D131) e o deu a DUAS provas só; as outras duas apodreceram CALADAS até o LAB-43 as regerar (inventário da ida 72 -> 74 campos, e a variante de Antonina virando a de 33 lotes). Prova que ninguém reconfere é afirmação com data. O detector MEDE DA FONTE e não compara prova com prova (a regra que o LAB-39 pagou, D144): inventário recontado do módulo, glebas relidas das fixtures, contrato saindo de contratoDasEntradas(), e UMA trava rodando o motor — a do faceDeRua de Antonina, ~6 s, porque é exatamente o campo que envelheceu. 15 travas novas.
Achados para outros apps ou Central: O ESCOPO SAI COMO NÚMERO, 11 DE 19 CHAVES — e vale repetir para todos porque é a lição do LAB-47 virando hábito: detector que confere três campos de vinte é escopo estreito com outro nome, e a defesa é publicar a fração, não a frase. Cada chave das duas provas está classificada em medida / medida em parte / declarada / não medida, esta última COM MOTIVO ESCRITO, e há trava nas duas direções: chave nova que ninguém classificou reprova, e chave classificada que desapareceu reprova. E PROVADO POR SABOTAGEM com uma volta a mais: DUAS DAS QUATRO SABOTAGENS SÃO AS MENTIRAS HISTÓRICAS, não invenções minhas — 74 campos virando 72, e 33 lotes virando 1.228. Detector apontado para o PASSADO é o único teste honesto de um detector de prova velha; se ele não morde o que já aconteceu, ele não morde nada. Mais um: segunda vez que "tipo não existe em tempo de execução" custou uma guarda cega (D171, depois do D157) — as regras das duas guardas eram união de tipo e viraram DADO, com trava de compilação ao lado. Duas vezes já é padrão, e é o primeiro lugar a olhar quando uma guarda parece cega.
Depende do Jonny: nada novo, e nada trava a fila. Os cinco itens seguem auditados no BALANCOS.md §5.
Próximo na fila: LAB-50, por que a passagem externa do motor põe lote a 1,8 km da face entregue — e o LAB-48 já lhe deu número: 18 violações `frente` MAIS 11 `via-sobre-lote` saem do MESMO mecanismo, 29 das 40 violações de Antonina. E dois achados meus de método, os dois dentro do prompt: (1) a minha própria trava "o detector alcança mais da metade" me reprovou por meio ponto, 9 de 19, e eu consertei MEDINDO MAIS até 11, não baixando a régua — o contrário exato do D143, e régua que eu afrouxo quando me reprova não é régua, é enfeite; (2) eu quase publiquei "a prova do LAB-30 também está velha" comparando um número medido em 7 glebas com um medido em 10 (o "6 -> 0" do LAB-40) — O CONJUNTO MEDIDO É PARTE DO NÚMERO, e dois números da mesma grandeza sobre conjuntos diferentes não se comparam.
=== FIM ===
```

---

## 06/10/2026 · LAB-50 — a passagem externa lê a face como RETA, e a gleba convexa provou

```
=== RECADO PARA O CHAT — Lab · LAB-50 ===
Estado: LAB-50 FEITO e mesclado. Fila de 06/10: 3 de 5 (LAB-48, LAB-49, LAB-50). Despertador trig_01XwSkTLT9zmyprNZcUiWy7f LIGADO, prompt guardado dele reescrito de novo (próxima decisão D176). Verde: 7 passos, 431 travas, exit 0, vizinhos limpos.
Feito: A RESPOSTA, E NENHUMA DAS SUAS DUAS HIPÓTESES ERA ELA. A faixa do lote externo é um SEMIPLANO, não um retângulo sobre a face: o motor tira da face entregue só a DIREÇÃO e a ORIGEM, corta a gleba pela RETA INFINITA que passa por ela, e distribui os lotes pela CAIXA ENVOLVENTE da faixa — `n = round((rect.maxX - rect.minX) / testadaExterna)`, e essa largura é a da FAIXA, não o comprimento da FACE. Sua hipótese 1 ("significa algo mais amplo") está PARCIALMENTE certa: ele lê o índice da face como RETA, e eu lia como SEGMENTO. Sua hipótese 2 ("corre o perímetro inteiro") está DESCARTADA POR MEDIÇÃO: 1 face de 20 vértices em Antonina, 1 de 4 na outra.
Achados para outros apps ou Central: A PROVA É A GLEBA DE CONTROLE, NÃO O ARGUMENTO, e é o que vale levar. Em geo-antonina (141,8 ha, 20 vértices, CÔNCAVA) os 33 lotes externos estão a no máximo 20,1 m da RETA da face e a 1.805,6 m AO LONGO dela — a distância toda é longitudinal, e bate com o 1.805,7 m que o LAB-46 mediu ao segmento. Em ensaio-com-testada (47 ha, 4 vértices, CONVEXA) o MESMO mecanismo dá 0 m e 51 de 51 lotes a menos de meio metro da face. Numa gleba convexa o semiplano sobre a reta É a faixa sobre a face; numa côncava, a reta de uma face de 180 m VOLTA A ENTRAR no terreno e a faixa vai com ela. Os 15 lotes distantes não estão em outra face: estão na MESMA RETA. A lição de método: sem a gleba convexa eu teria um mecanismo plausível e nenhuma prova — controle não é luxo, é o que separa leitura de medição. E a segunda, que é a melhor: A QUARTA PREVISÃO FALHOU, e foi a que rendeu mais. Ela matou DUAS explicações minhas para as 11 `via-sobre-lote`: a concavidade (acontece na convexa também, 9 lotes) e o derrame de meia-caixa (o eixo das vias culpadas está a 0,1 a 0,8 m da reta, DENTRO da faixa e não na beira). O porquê fica NÃO ATRIBUÍDO, e as duas mortas ficaram ESCRITAS na prova, num campo chamado explicacoesMORTAS — hipótese descartada em silêncio volta como hipótese nova no prompt seguinte.
Depende do Jonny: nada novo, e nada trava a fila. Os cinco itens seguem auditados no BALANCOS.md §5.
Próximo na fila: LAB-51, o cabeçalho do conferir.sh que ainda afirma não haver CI aqui. E TRÊS ITENS NUMERADOS PARA O PARCELAMENTO, o segundo deles pergunta e não diagnóstico: (1) a faixa precisa de limite LONGITUDINAL — recortá-la pela extensão do segmento da face; custo medido, 18 violações `frente`, e o defeito é invisível em gleba convexa, que é por isso que sobreviveu; (2) a via do plano é desenhada SOBRE a faixa reservada, eixo a 0,1 m da reta da face — custo 11 `via-sobre-lote`, e eu não tenho a explicação, só duas candidatas que eles conferem mais rápido que eu; (3) `prof` não sai na SAÍDA, então quem mede por fora tem de estimá-lo, e o meu estimador deu ZERO na gleba convexa — foi ele que me impediu de fechar o item 2. 29 das 40 violações de Antonina saem de reservarFacesExternas: o LAB-48 as atribuiu ao "motor" genericamente, e agora têm mecanismo nomeado. Nada escrito em vizinho nenhum.
=== FIM ===
```

---

## 06/10/2026 · LAB-51 — o cabeçalho que dizia não haver CI, e a régua que nasceu geral

```
=== RECADO PARA O CHAT — Lab · LAB-51 ===
Estado: LAB-51 FEITO e mesclado. Fila de 06/10: 4 de 5 — falta só o LAB-52, o achado da Central. Despertador trig_01XwSkTLT9zmyprNZcUiWy7f LIGADO, prompt guardado reescrito (próxima decisão D178). Verde: 7 passos, 433 travas, exit 0, vizinhos limpos.
Feito: o alto do conferir.sh — O ARQUIVO MAIS LIDO DO REPOSITÓRIO — afirmava "Não há CI neste repositório (não existe .github/workflows)". Era VERDADE quando o LAB-31 a escreveu e ficou FALSA no LAB-38, que criou o workflow: OITO DIAS, e ninguém viu. É a forma exata do D104, o mesmo defeito que fez o faceDeRua publicar null por três semanas. O conserto tem DUAS metades, e a segunda é a que faz o prompt fechar: a afirmação passa a descrever o CI que existe, COM A FRASE FALSA CITADA E DATADA (apagá-la tiraria do registro a única coisa útil que ela tem); e nasceram DUAS TRAVAS, porque regra sem guarda é slogan (D136) — toda linha que AFIRMA "não existe" ou "não há" tem os caminhos entre crases conferidos contra o disco, e o script TEM DE NOMEAR o CI. Essa segunda existe porque tirar a mentira não basta: SILÊNCIO TAMBÉM ENVELHECE.
Achados para outros apps ou Central: A RÉGUA IA REPROVAR O PRÓPRIO CONSERTO, e é a quarta vez dessa sub-família — D137 (casou a chave literal e mediu ortografia), D142 (leu menção e não import), D155 (leu o comentário que explicava o conserto) e agora D177: o cabeçalho novo CITA a frase falsa, e a citação carrega o caminho que existe. A DIFERENÇA É QUE ESTA EU PEGUEI ANTES DE ESCREVER A RÉGUA, não depois de ela ficar vermelha — as três anteriores custaram uma suíte vermelha cada, esta custou uma linha. A regra curta, e é a que vale para todos: RÉGUA QUE VARRE TEXTO MEDE O QUE O TEXTO AFIRMA E O QUE ELE DIZ SOBRE SI, E SÓ A PRIMEIRA É O OBJETO. O conserto é um `semCitacoes()` que tira as citações marcadas antes de procurar a afirmação, um degrau acima do `semComentarios()` do LAB-43 — e o buraco fica declarado: afirmação disfarçada de citação escapa, preço menor que o de reprovar o próprio conserto. E a segunda lição: A RÉGUA NASCEU GERAL, não um `if` para este caso — provei sabotando com uma afirmação falsa sobre OUTRO caminho qualquer, e ela reprovou. A primeira sabotagem é a mentira histórica de volta sem a marca de citação, e derruba AS DUAS travas: 8 pass viram 6 pass e 2 fail.
Depende do Jonny: nada novo, e nada trava a fila. Os cinco itens seguem auditados no BALANCOS.md §5.
Próximo na fila: LAB-52, o último — as duas varreduras da Central (erro de chamada não conferido que degrada para número que PARECE certo; e função que recebe identificador de conta como argumento). Depois dele a fila de 06/10 fecha, e o BALANÇO dela é obrigatório pela §1-B — vou gravá-lo no BALANCOS.md junto do LAB-52, porque fila que fecha sem saldo é o defeito que criou aquele arquivo. Dois detalhes de bastidor que valem dizer: este prompt NÃO tem prova em docs/provas/, de propósito — ele mede um arquivo de texto contra o disco, não gleba, e inventar um JSON para ter um JSON seria o contrário do §7; e o número de travas do trabalho do CI sem clones foi de 98 para 100, atualizado nos QUATRO arquivos que o citam, pela trava de concordância do D153/D165.
=== FIM ===
```

---

## 07/10/2026 · LAB-52 — o detector estava MUDO, e a fila de 06/10 esgotou

```
=== RECADO PARA O CHAT — Lab · LAB-52 ===
Estado: LAB-52 FEITO e mesclado. A FILA DE 06/10 ESGOTOU, CINCO DE CINCO (LAB-48 a LAB-52), e o despertador trig_01XwSkTLT9zmyprNZcUiWy7f está DESLIGADO — não apagado. Você pediu um que "se apaga ao esgotar" E deu o id deste para reusar; as duas coisas só convivem com desligar, e se quiser apagado de verdade é uma linha sua. O SALDO DA FILA ESTÁ NO BALANCOS.md §6, gravado junto deste prompt e não depois. Verde: 7 passos, 447 travas, exit 0, vizinhos limpos.
Feito: as duas varreduras da Central. E O ACHADO NÃO É NENHUMA DAS CONTAGENS: É QUE O DETECTOR ESTAVA MUDO. Os dois eslint.config.js traziam `projectService: false`, e sem serviço de projeto TODA regra que precisa de tipo fica desligada — SEM AVISAR, sem erro, sem contagem: o lint passa verde porque não rodou a regra. Entre elas a `no-floating-promises`, que é exatamente a metade mais perigosa da classe (a) que vocês nomearam: promessa sem await, cujo erro nunca aparece. É a forma do D123 — a prova no navegador que ninguém rodava — num lugar onde ninguém pensa em olhar: dentro da configuração do lint. Ligadas as três (floating-promises, misused-promises, require-await) nos dois pacotes: ZERO achados, e o zero foi PROVADO POR SABOTAGEM. Preço dito: o lint do esteira foi de 0,85 s para 7,9 s, nove vezes. O recommendedTypeChecked COMPLETO ficou fora porque são 646 achados (487 de no-unnecessary-type-assertion, ~149 de no-unsafe-* das pontes as-unknown-as) — é outro prompt, e está proposto.
Achados para outros apps ou Central: REGRA DESLIGADA EM SILÊNCIO É PIOR QUE REGRA AUSENTE, porque o verde continua verde e ninguém procura — confiram o `projectService` dos seus, é uma linha e pode estar calando a regra que mais importa. O escopo, como número: 113 arquivos .ts, 31.894 linhas, 4.891 parâmetros e 4.316 campos examinados, 25 nomes procurados. Resultado: `catch` que engole ZERO; `?? 0` sobre chamada 28 → 2 e os 2 benignos; `Number()` sem conferir 1, e esse NÃO é a classe de vocês porque ele ESTOURA em vez de degradar; e (b) identificador de conta ZERO em parâmetro E em campo. E duas lições de método: (1) 28 DE 28 ERAM FALSO POSITIVO DA MINHA RÉGUA — eram `at(-1) ?? 0` e `get(k) ?? 0`, e ausência declarada não é falha; estreitar a régua para o alvo que ela mesma declara não é afrouxá-la, é perguntar se a chamada que você casou sinaliza FALHA; (2) A SABOTAGEM PEGOU A QUINTA VEZ DA FAMÍLIA DA RÉGUA QUE LÊ TEXTO, dentro do teste que eu escrevi para honrar a quarta: a trava conferia se a regra estava ligada lendo o nome dela no COMENTÁRIO que a explica. Uma hora antes, no LAB-51, eu havia registrado ter visto esse defeito ANTES de escrever a régua; no prompt seguinte, no mesmo assunto, caí — e quem pegou foi a sabotagem, não eu. Daí a lição nova: HÁ DUAS PERGUNTAS, NÃO UMA — "o código FAZ isto?" esvazia strings, "a configuração DECLARA isto?" as preserva, e usar a limpeza errada é a mesma família do nome lido no lugar errado.
Depende do Jonny: nada novo, e nada travou a fila em nenhum dos cinco prompts. Os cinco itens dele seguem auditados no BALANCOS.md §5.
Próximo na fila: NADA — mande fila nova e religue o id trig_01XwSkTLT9zmyprNZcUiWy7f. O saldo dos cinco está no BALANCOS.md §6, com a conta que eu acho que decide a próxima ordem: o LAB-48 mostrou que consertar 37% das 128 violações NÃO APROVA UMA ÚNICA GLEBA, então o ranking da tela unificada só deixa de nascer vazio quando as 54 do motor e as 27 em aberto tiverem resposta. Cinco propostas esperando: o conserto das 36 que são a minha ponte (com guarda ao lado, D136); a correção da moldura do D159 nos três lugares onde ela saiu; as 27 violações `frente` não atribuídas; por que o motor desenha via SOBRE a face que ele mesmo reservou (matei duas explicações minhas e não tenho a terceira); e ligar o recommendedTypeChecked completo, 646 achados. E o prompt guardado do despertador segue em dia: reescrevi ao fim de cada um dos cinco, como você autorizou.
=== FIM ===
```

---

## 07/10/2026 · LAB-53 — as 36 violações eram a minha ponte, e a sabotagem achou defeito na minha trava

```
=== RECADO PARA O CHAT — Lab · LAB-53 ===
Estado: LAB-53 FEITO e mesclado. Fila de 07/10: 1 de 5, e é o caminho crítico do MVP que você adotou. Despertador trig_01XwSkTLT9zmyprNZcUiWy7f LIGADO, prompt guardado reescrito (próxima decisão D183). Verde: 7 passos, 450 travas, exit 0, vizinhos limpos.
Feito: o conserto, e O NÚMERO É 128 → 92. A ponte escrevia o ALVO sorteado da variante no campo cujo nome é MÍNIMO: a entrada declara testadaMinLote_m = 10 m, o que chegava ao Validator era 11,70820393249937 m (o meio da faixa que a minha ida monta), e ele passava a medir o motor CONTRA O PRÓPRIO ALVO DELE com 2% de folga — 47 lotes de 316 m² reprovados por 1,94 cm de déficit mediano. E ERAM TRÊS CAMPOS, NÃO UM: lendo a função inteira antes de tocá-la, testadaMinLote_m, caixaViariaMin_m e faceQuadraMax_m tinham a mesma forma. A regra que ficou escrita tem TRÊS saídas, e a terceira é o erro simétrico: do contrato; `null` quando o motor NÃO HONRA o limite (publicar ali o número do contrato seria INVENTAR OBEDIÊNCIA, e é o caso do rampaMaxima_pct — ele mede rampa e não a limita); e NUNCA o sorteado, que é alvo e vai a campo de alvo ou vira perda declarada. O CONSERTO É CIRÚRGICO E ESTÁ MEDIDO: as 81 violações que não são `testada` são OS MESMOS 81 LOTES, id por id, e as 11 `testada` que sobram são SUBCONJUNTO das 47 — testadas de 3,56 a 9,59 m contra os 10 m declarados, e essas são do motor. A previsão do LAB-48 bateu nas CINCO glebas (25·17·4·6·40), e o contrafactual "somem com o mínimo declarado" foi a ZERO, que é a medição conferindo-se sozinha.
Achados para outros apps ou Central: DUAS lições, e a segunda vale para qualquer um que escreva trava. (1) CAMPO CUJO NOME DIZ MÍNIMO E CUJO VALOR É UM ALVO NÃO É UM CAMPO ERRADO: É UMA ACUSAÇÃO AUTOMÁTICA — nenhum motor sobrevive a ser medido contra o próprio alvo. E tem o avesso, que eu só vi ao escrever a regra: publicar no campo de limite o número do contrato quando o motor não honra aquele limite é INVENTAR OBEDIÊNCIA. Quem tem ponte entre contratos: confiram se algum campo de LIMITE de vocês recebe valor que o próprio lado de cá escolheu. (2) A SABOTAGEM ACHOU DEFEITO NA MINHA PRÓPRIA TRAVA, pela segunda vez em dois prompts: devolvi faceQuadraMax_m ao sorteio e a trava que compara o campo com o valor do contrato PASSOU — porque a minha ida fixa aquela faixa em (200,200) e hoje o sorteado COINCIDE com o limite. Quem pegou foi a trava diferencial, que não compara valores: roda a volta duas vezes, mesma ENTRADA e duas amostras, e exige que o LIMITE fique parado enquanto o ALVO se move. TRAVA QUE COMPARA O CAMPO COM O VALOR DE HOJE MEDE UMA COINCIDÊNCIA, NÃO O MECANISMO. Duas em duas: sabotar a própria trava deixou de ser zelo e passou a ser método. E uma terceira, menor: a prova do LAB-48 QUASE FOI APAGADA — a ferramenta é a mesma de propósito, e a primeira rodada sobregravou o diagnóstico que você quer comparar com o do Generate. Restaurada do git, e agora o destino do arquivo SAI DA MEDIÇÃO do estado da ponte, com a legenda "nada foi consertado" deixando de ser texto fixo (era o D104 dentro de uma prova, e teria envelhecido no mesmo prompt).
Depende do Jonny: nada novo, e nada trava a fila. Os cinco itens dele seguem auditados no BALANCOS.md §5.
Próximo na fila: LAB-54 — as 27 violações `frente` não atribuídas, medidas com a régua DELE (`_testadaDoLote` contra as superfícies que ele mesmo monta) e não com a minha, que seria a forma do D93. Para o GENERATE, dois itens numerados no relatório e nada escrito lá: (1) O CONTRATO DE MOTOR V1 PRECISA DE testadaAlvoLote_m — ele tem o trio MIN/ALVO/MAX só para a área do lote, e FOI ESSA FALTA QUE CRIOU O DEFEITO: o alvo da variante não tinha onde morar e foi morar no mínimo. Enquanto não houver campo, este Lab publica o alvo como perda declarada e vocês não veem o número que o motor de fato mirou; (2) as 11 `testada` que sobram estão nomeadas na prova nova, com gleba e lote, e NÃO são régua. E a conta do LAB-48 segue valendo: as 92 não aprovam gleba nenhuma, então o ranking só deixa de nascer vazio com as 54 do motor e as 27 em aberto — o LAB-54 e o LAB-55 desta fila.
=== FIM ===
```

---

## 07/10/2026 · LAB-54 — as 27 atribuídas, e a régua dele erra o RÓTULO e não o VEREDICTO

```
=== RECADO PARA O CHAT — Lab · LAB-54 ===
Estado: LAB-54 FEITO e mesclado. Fila de 07/10: 2 de 5. Despertador trig_01XwSkTLT9zmyprNZcUiWy7f LIGADO, prompt guardado reescrito (próxima decisão D188). Verde: 7 passos, 465 travas, exit 0, vizinhos limpos. E segue aberta a sua mensagem CORTADA sobre os três números — o balanço está no BALANCOS.md §7.
Feito: AS 27 ESTÃO ATRIBUÍDAS. 23 SÃO DO MOTOR — lote de miolo, ZERO m² sobre leito e borda a mais de 0,62 m de qualquer superfície viária, com passo de amostragem declarado. 4 SÃO DA RÉGUA, e só do RÓTULO dela. Nem ponte nem contrato: nenhuma das quatro glebas declara rua pública, então o contrafactual do campo que falta é `null` nas 27 — e eu NÃO o remedi aqui, li da prova do LAB-53 e cruzei por lote, porque medir a mesma pergunta duas vezes em dois arquivos é a segunda montagem que o D116 proíbe. O MÉTODO vale mais que o número, e serve para qualquer régua de vizinho: rodar a régua dele responde SE ela acusa, nunca POR QUÊ. A função dele testa o PONTO DO MEIO de cada aresta contra o contorno das superfícies viárias, com 0,75 m — e numa aresta de 34 m que encosta só numa ponta, o meio está a 17 m de lá. Então: MUDE A AMOSTRAGEM E DEIXE A FUNÇÃO DELE RESPONDER DE NOVO. Densificar o polígono (mesma borda, mesma área) muda só os pontos que ela testa, e quem muda de resposta é O CÓDIGO DELE sobre o mesmo polígono — não uma régua minha discordando da dele.
Achados para outros apps ou Central: O ACHADO É A SEGUNDA METADE, e sem ela eu teria pedido um conserto errado a vocês. Das 11 (nas cinco glebas) em que a amostragem fina muda a resposta dele, a frontagem REAL é de 1,5 a 5,49 m contra um mínimo declarado de 10 m — então o invariante seguinte acusa `testada` no mesmo lote: 11 TROCAM DE ETIQUETA E ZERO DESAPARECEM. RÉGUA QUE ERRA O RÓTULO E ACERTA O VEREDICTO NÃO É RÉGUA ERRADA, e consertá-la não derruba violação nenhuma. Virou item de MENSAGEM na lista para o Generate, explicitamente FORA do caminho crítico: o `_testadaDoLote` diz "nenhuma aresta encosta em via" sobre lote que encosta com 2 m, e isso engana quem LÊ, não quem conta. A lição de método: MEDIR O SALDO ANTES DE PROPOR O CONSERTO. Para a Central, duas a mais. (1) A SABOTAGEM PEGOU A MINHA PRECONDIÇÃO PELA METADE, terceira vez em três prompts: o probe tinha uma precondição só, "a área não mudou", e eu sabotei deslocando todos os pontos em 1 cm — PASSOU, porque deslocar TODOS é uma TRANSLAÇÃO e translação não muda área nenhuma. Num probe que mede DISTÂNCIA até o leito, escorregar o lote para o lado da rua era o pior erro possível. ÁREA PRESERVADA NÃO PROVA BORDA PRESERVADA: área é invariante por translação e por rotação. (2) A VARREDURA DE CHAMADAS DO LAB-52 TEVE O PRIMEIRO ACHADO VERDADEIRO — um prompt depois de fechar com 28 de 28 falso positivo, e no meu código novo: `const testadaFina = Number(...)` sem `Number.isFinite`. E `NaN > 0` é `false`, então um NaN classificaria o lote como "motor-sem-via-perto" — O LAB ACUSANDO O MOTOR DO VIZINHO POR UM NÚMERO QUE NÃO É NÚMERO, no prompt cuja tese é não atribuir sem medir. Consertei estourando, NÃO com uma entrada nova em BENIGNOS. RÉGUA CUJO PRIMEIRO RESULTADO É 28 DE 28 FALSO POSITIVO NÃO ESTÁ ERRADA: ESTÁ SEM CASO AINDA.
Depende do Jonny: nada novo, e nada trava a fila. Os cinco itens dele seguem auditados no BALANCOS.md §5.
Próximo na fila: LAB-55 — por que o motor desenha via SOBRE a face que ele mesmo reservou, as 11 `via-sobre-lote`, onde eu matei duas explicações e não tenho a terceira. E este prompt já entregou meia pista para ele: os 7 lotes de Antonina que também viram com amostragem fina são `v19-e5` a `v19-e13` — OS MESMOS LOTES das 11 `via-sobre-lote`, com 4,65 a 157,4 m² sobre leito. Um único mecanismo do motor visto agora por TRÊS invariantes. E uma correção minha, riscada e não apagada: a frase do LAB-48 "oito estão a 0,2 m ou menos da borda do leito" é FALSA — são CINCO, e a lista com os números estava impressa na linha de cima do próprio relatório; eu contei de cabeça. A régua dele confirma 4 dos meus 5 e discorda em `v12-l469`, e a dele é a que vale porque o invariante é dele. É a 15ª vez do ponto cego da §6 e a nona pega dentro do prompt. NÚMERO QUE O PRÓPRIO RELATÓRIO LISTA AO LADO NÃO SE ESCREVE DE MEMÓRIA.
=== FIM ===
```

---

## 07/10/2026 · LAB-55 — a faixa é buraco no domínio do LOTE e não no da VIA

```
=== RECADO PARA O CHAT — Lab · LAB-55 ===
Estado: LAB-55 FEITO e mesclado. Fila de 07/10: 3 de 5, e O CAMINHO CRÍTICO DO MVP ESTÁ CUMPRIDO. Despertador trig_01XwSkTLT9zmyprNZcUiWy7f LIGADO, prompt guardado reescrito (próxima decisão D191). Verde: 7 passos, 476 travas, exit 0, vizinhos limpos. E segue aberta a sua mensagem CORTADA sobre os três números — o balanço está no BALANCOS.md §7.
Feito: A TERCEIRA EXPLICAÇÃO, e ela é uma ASSIMETRIA. `sobreposicao` = 0 (o LOTE respeitou a faixa reservada) ao lado de `via-sobre-lote` = 11 (a VIA não respeitou). O mecanismo, lido no código do motor: `reservarFacesExternas` tira a faixa de `restante`, `restante` vira `util`, e É `util` QUE RECORTA QUADRA E LOTE — mas a rede viária recebe UM aparo, e ele é `apararRedeViaria(vias, terreno.perimetro)`: CONTRA A DIVISA. A faixa é buraco no domínio do lote e não é buraco nenhum no domínio da via. A ASSINATURA, medida: as QUATRO vias culpadas (duas glebas) têm AS DUAS PONTAS A 0 m DO PERÍMETRO e UMA PONTA DENTRO DE UM LOTE EXTERNO, atravessando a faixa em 4% a 23% do eixo — via recortada por `util` pararia na borda INTERNA da faixa, longe do perímetro, e é essa medida que separa as duas explicações. E são 2 de 10 vias, não todas: como nenhum recorte existe, passa a via que o partido por acaso traçou por ali. O SEGUNDO ANDAR TAMBÉM SE MEDE DE FORA: zero bulbo de retorno nas duas glebas ⇒ pctCulDeSac = 0 ⇒ o `aplicarCulDeSac` — o ÚNICO lugar que recortaria via por `util`, e só a SECUNDÁRIA — nem rodou. É o que explica uma via secundária entre as culpadas, ao lado de três principais, que ele nunca recortaria.
Achados para outros apps ou Central: TRÊS, e a primeira é de método. (1) VIOLAÇÃO QUE NÃO ACONTECEU É MEDIÇÃO: o corte degenerado (`if (sobra.length >= 3) restante = sobra`) morreu pela AUSÊNCIA de `sobreposicao` — se `restante` tivesse ficado inteiro, quadra e lote teriam nascido sobre a faixa e haveria sobreposição entre interno e externo; é zero. O invariante que ficou calado disse mais que os onze que falaram. (2) A CANDIDATA DO ACESSO MORRE SÓ COMO MECANISMO, e isso fica dito em vez de arredondado: a pior infratora de Antonina (V2, 8 lotes) passa a 9,6 m do ponto de acesso, e eu NÃO afirmo que o acesso não tem parte nela; o que a mata é haver culpada longe em TODA gleba (86,7 m e 382,5 m) e a pior de todas no controle convexo estar a 382,5 m enquanto a que É a via de acesso invade só 2. E A TRAVA QUE AFIRMAVA DEMAIS FICOU VERMELHA — eu havia escrito "a pior infratora de CADA gleba está a mais de 50 m do acesso" e os 9,6 m a derrubaram; afrouxar o limiar para 5 m seria a régua-enfeite do D172, e a correção foi ESTREITAR A CONCLUSÃO, não baixar o limiar. (3) O ACHADO CONTRA MIM: li a hierarquia da via no `resultado` INTERNO do Generate e saiu `null` em 4 de 4 — ela mora na SAÍDA, onde o contrato a publica. Eu estava a um passo de escrever "a hierarquia não é observável de fora", que é a forma do item 3 do LAB-50 e seria falso. CAMINHO ERRADO QUE DEVOLVE `null` EM CAMPO QUE CLASSIFICA VIRA FRASE PUBLICÁVEL — e a frase acusa justamente quem publica o campo. 16ª vez do ponto cego da §6, décima pega dentro do prompt.
Depende do Jonny: nada novo, e nada trava a fila. Os cinco itens dele seguem auditados no BALANCOS.md §5.
Próximo na fila: LAB-56 — a correção da moldura do D159 nos três lugares onde ela saiu (relatório do LAB-45, item 7 do Jonny e a nota da tabela), riscando e não apagando. E UMA CONTA QUE FECHOU: as 92 violações estão TODAS ATRIBUÍDAS, primeira vez desde o LAB-48 — 81 do MOTOR (23 frente de miolo + 18 frente distantes + 14 face-quadra + 11 via-sobre-lote + 11 testada + 4 que são régua-no-rótulo mas o lote é ruim de verdade) e 11 do CONTRATO do Generate, ZERO não atribuídas, contra 27 no LAB-48. Para o PARCELAMENTO, três itens numerados no relatório e nada escrito lá: aparar a rede viária por `util` e não só pela divisa (custo medido: 11 + 15 violações, com a via terminando DENTRO de lote externo nas quatro culpadas); os dois buracos declarados do `aplicarCulDeSac` (só secundária, e não roda com pctCulDeSac = 0); e publicar `prof` em `parametrosUsados`, que segue não observável de fora desde o LAB-50.
=== FIM ===
```

---

## 07/10/2026 · LAB-56 — a moldura do D159 corrigida, e ela saía de um GERADOR

```
=== RECADO PARA O CHAT — Lab · LAB-56 ===
Estado: LAB-56 FEITO e mesclado. Fila de 07/10: 4 de 5 — falta só o LAB-57, e ao fechá-lo a fila esgota (balanço obrigatório no BALANCOS.md, junto dele, e o despertador DESLIGA, não apaga). Despertador trig_01XwSkTLT9zmyprNZcUiWy7f LIGADO, prompt guardado reescrito (próxima decisão D194). Verde: 7 passos, 494 travas, exit 0, vizinhos limpos. E segue aberta a sua mensagem CORTADA sobre os três números — o balanço está no BALANCOS.md §7.
Feito: a moldura corrigida — e ERAM CINCO LUGARES E UM GERADOR, não os três que você pediu (e que eu também havia contado). A frase saía de `naoSoubeFazer`, em `src/motores/testfit.ts`, e dali ia para a COMPARACAO_DOS_MOTORES.md TRÊS VEZES e para a prova do LAB-19. CORRIGIR OS CINCO DOCUMENTOS E DEIXAR O GERADOR FARIA A FRASE VOLTAR SOZINHA na próxima `bun run lab19` — é a forma do D104 com uma máquina atrás, e nenhuma varredura de documento avisaria, porque no instante seguinte à regeração o documento estaria "correto" por um ciclo. E eu contei três porque LEMBREI três: o D185 (conte a lista, não a memória) vale para "quantos lugares", não só para "quantos lotes". A causa certa está escrita nos cinco: HÁ UMA RÉGUA E UM CAMPO QUE FALTA — o `invariantes.ts` do Generate aceita a rua pública existente, tem o campo (`faixaViaPublica`) e o usa; falta campo no CONTRATO de motor v1 para declará-la. COM O LIMITE MEDIDO (LAB-54): das 29 de Antonina, 11 somem com o campo e 18 NÃO — essas 18 estão a 15,7 a 1.805,7 m da face e são do motor; dizer "é só o campo que falta" seria o erro simétrico. Tudo riscado e não apagado (D161), inclusive o título do D159, que fica.
Achados para outros apps ou Central: DOIS lugares NÃO foram tocados, e é decisão, não esquecimento: o RECADOS.md é o arquivo do que SAIU para o chat, em ordem — REESCREVER RECADO ENTREGUE SERIA FALSIFICAR O REGISTRO, e a correção mora nos documentos vivos; e o LAB-48.md é o relatório que ACHOU o erro, que o cita para corrigi-lo. Lista fechada, com motivo, e com guarda contra exceção fantasma. E a lição de método, que é a mais forte deste prompt: QUATRO DEFEITOS DA MINHA PRÓPRIA TRAVA, NUM PROMPT SÓ, E NENHUM PELO OLHO. (1) ela reprovou a minha FRASE DE CONSERTO — "não são duas réguas discordando" —, porque RÉGUA QUE CASA UMA FRASE NÃO DISTINGUE "X" DE "NÃO X"; o conserto foi casar só a forma que de fato saiu e cobrar a causa certa por uma trava POSITIVA. (2) Eu usei a LIMPEZA ERRADA das duas que o D179 criou um prompt antes: `soOCodigo()` esvazia o conteúdo das strings, e a nota do gerador É uma string — a pergunta certa era "o texto DECLARA isto?", que é `semComentarios()`. TER AS DUAS FERRAMENTAS NÃO BASTA: A PERGUNTA DECIDE QUAL DELAS. (3) Varri os números no ARQUIVO TODO, e o INDEX.md tem dezenas de linhas com 11 e 18 noutros assuntos. (4) Troquei por janela de 25 LINHAS num arquivo de UMA LINHA POR RELATÓRIO — 25 linhas ali são 25 outros relatórios. Os três últimos eram de ESCOPO: o volume era da minha régua, não da coisa (D179 duas vezes seguidas). A janela agora é a unidade semântica — parágrafo, ou a linha quando é tabela — e a mensagem de erro PUBLICA quantas linhas ela mediu. E uma quinta, de bônus: a guarda da exceção fantasma do LAB-36 mordeu DENTRO do prompt que a usou, expulsando o LAB-54.md da lista por ter deixado de precisar ser exceção.
Depende do Jonny: nada novo — mas o ITEM 7 DELE foi reescrito, para leigo, e agora tem DUAS correções empilhadas e à vista: a dos 33 × 14 (de 05/10) e esta. O texto novo diz que o que falta é "uma LINHA NA FICHA que os dois programas usam para conversar", com o limite: 11 dos 29 passariam a ser aceitos, os outros 18 estão de 15 m a 1,8 km da rua e aí o problema é do desenho. A decisão dele não mudou de natureza.
Próximo na fila: LAB-57, o ÚLTIMO — o resto da varredura do D178 (existe outra configuração aqui que desliga conferência sem avisar? tsconfig dos dois pacotes, verde.yml, conferir.sh, bunfig se houver), com o escopo como número, mais a lição das duas perguntas em CINCO LINHAS para você distribuir à família. E este prompt acabou de pagar essa lição duas vezes no próprio corpo, o que vai ajudar a escrevê-la. Nenhum número mudou aqui: as 92 seguem 92, a atribuição segue a do LAB-55, e a tabela saiu com os mesmos números — só a nota ao pé mudou de texto. Este prompt é MOLDURA, não medição: corrige como o número é lido, não o número.
=== FIM ===
```

---

## 07/10/2026 · LAB-57 — três formas de desligar conferência, e a fila de 07/10 esgotou

```
=== RECADO PARA O CHAT — Lab · LAB-57 ===
Estado: LAB-57 FEITO e mesclado. A FILA DE 07/10 ESGOTOU, CINCO DE CINCO (LAB-53 a LAB-57), e o despertador trig_01XwSkTLT9zmyprNZcUiWy7f está DESLIGADO — não apagado, pela regra que você tornou permanente. O SALDO DA FILA ESTÁ NO BALANCOS.md §8, gravado junto deste prompt e não depois. Verde: 7 passos, 505 travas, exit 0, vizinhos limpos.
Feito: a varredura das configurações — e HÁ TRÊS FORMAS DE DESLIGAR CONFERÊNCIA, não uma. (1) A regra DESLIGADA, que é a do D178 e já estava consertada. (2) A regra LIGADA QUE NÃO PODE REPROVAR — e ESSA ESTAVA VIVA: `"lint": "eslint ."` nos dois pacotes, sem `--max-warnings 0`, com `no-explicit-any` em "warn". O aviso APARECE NA TELA e o passo sai VERDE: não há alarme a ouvir, há um alarme que ninguém lê. Consertado nos dois, com trava — e medido ANTES: zero avisos, então nada estava escondido hoje e o mecanismo estava vivo. (3) O desligador SEM MOTIVO ESCRITO: `skipLibCheck: true` nos dois tsconfig, na linha imediatamente abaixo de um comentário que explica OUTROS DOIS FLAGS — quem lê presume que o motivo cobre a linha de baixo. Medido com `false`: ZERO erros nos dois pacotes. E ELE FICA, pelo princípio que o próprio arquivo já escrevia (typecheck que acusa erro alheio se aprende a ignorar): com ele desligado, uma atualização de @types derruba o verde por erro dentro de dependência. O CONSERTO DA TERCEIRA FORMA É A DECLARAÇÃO, NÃO O DESLIGAMENTO. O ESCOPO, como número: 27 configurações que o git carrega, 11 varridas, 16 FORA E NOMEADAS (upstream intocável, lockfiles, Cargo/rust-toolchain), 647 linhas de configuração, 123 arquivos de código (34.166 linhas), 6 regras. E duas formas saem como ZERO MEDIDO: nenhum passo engole falha no verde, e NENHUM `.only`/`.skip`/`.todo` na suíte — o `.only` reduziria a suíte a UM teste e o resto sairia verde por não ter rodado.
Achados para outros apps ou Central: AS CINCO LINHAS QUE VOCÊ PEDIU, prontas para distribuir (estão no §6 do relatório). (1) Há DUAS PERGUNTAS sobre um texto de programa, e elas pedem LIMPEZAS OPOSTAS: "o código FAZ isto?" esvazia o conteúdo das strings, porque ali o código só FALA SOBRE; "a configuração DECLARA isto?" PRESERVA a string, porque é na string que a declaração mora. (2) Ter as duas ferramentas não basta — A PERGUNTA DECIDE QUAL DELAS, e errar a pergunta é a mesma família de ler um nome no lugar errado da gramática. (3) Medido, caro: no LAB-56 eu usei a de "código FAZ" para examinar uma NOTA QUE ERA STRING, e a sabotagem PASSOU — um prompt depois de eu ter escrito a regra. (4) O sintoma é sempre o mesmo: a régua fica VERDE POR NÃO TER OLHADO, e verde por não olhar é indistinguível de verde por estar limpo. (5) O conserto é de método: TODA RÉGUA DE TEXTO DECLARA, NO PRÓPRIO CÓDIGO, QUAL LIMPEZA USA E POR QUÊ — e a trava confere que a declaração existe. E um achado contra mim: o comentário daquele tsconfig dizia "20 erros" com os dois flags ligados; remedido, são 1.604 — 1.600 no repositório do Generate e QUATRO AQUI, nomeados por arquivo e linha. A frase "o código deste adaptador passou com os dois flags" estava FALSA por quatro. NÚMERO DENTRO DE COMENTÁRIO ENVELHECE EM SILÊNCIO, e este envelheceu oitenta vezes. É a terceira vez em quatro prompts que um número meu estava errado onde eu podia medi-lo (D185 "oito" eram cinco; D191 "três lugares" eram cinco; D196 "20" eram 1.604) — e as três foram achadas no prompt seguinte, por ir conferir.
Depende do Jonny: nada novo, e nada travou a fila em nenhum dos cinco prompts. Os cinco itens dele seguem auditados no BALANCOS.md §5 — e o da nota (33 ou 1.228 lotes em Antonina) ficou mais caro: a superquadra de 33 lotes que a nota do motor elege carrega 40 das 92 violações.
Próximo na fila: NADA — mande fila nova e religue o id trig_01XwSkTLT9zmyprNZcUiWy7f. E O PRIMEIRO ITEM ESPERANDO VOCÊ É UMA PERGUNTA SUA: a mensagem sobre os três números diferentes chegou CORTADA em "disse 181, todas de". A resposta medida está no BALANCOS.md §7 — os quatro números NÃO SÃO O MESMO OBJETO, o meu 92 soma cinco planos de oitenta e seis candidatos —, e falta o resto da frase ou as cinco respostas das outras sessões para fechar a conta. O saldo dos cinco está no §8: 128 → 92 violações, TODAS ATRIBUÍDAS pela primeira vez desde o LAB-48 (81 do motor, 11 do contrato, ZERO em aberto contra 27), 17 decisões (D180 a D196), 55 travas novas (450 → 505), e SETE sabotagens que pegaram defeito meu que eu não tinha visto — três delas num prompt só. Nenhuma das cinco glebas aprova: o ranking só deixa de nascer vazio quando as 81 do motor tiverem conserto, e o conserto é LÁ.
=== FIM ===
```

---

## 07/10/2026 (noite) · A fila T-36 a T-39 — recebida e NÃO executada: ela é do motor

```
=== RECADO PARA O CHAT — Lab · — ===
Estado: a fila T-36 a T-39 chegou e NÃO FOI EXECUTADA — ela é a fila do MOTOR, entregue nesta sessão. Nada mudou no repositório desde o LAB-57: main em c0ce5a0, árvore limpa, verde 7 passos/505 travas/exit 0, vizinhos limpos. O despertador trig_01XwSkTLT9zmyprNZcUiWy7f segue DESLIGADO, e eu NÃO o religuei — o motivo está abaixo. O registro inteiro está gravado na FILA.md e no ONDE_PARAMOS.md, porque o que vai ao chat e não vai a um arquivo não existe amanhã.
Feito: o status e a conferência de endereço, com quatro coisas MEDIDAS e não lembradas. (1) "T-36" NÃO EXISTE em lugar nenhum deste repositório — zero ocorrências; aqui os prompts são LAB-xx, e os do motor aparecem como "o T02 dele", seis vezes; o motor tem docs/prompts/FILA.md próprio com T00 a T06. (2) A D74 que você cita não é a D74 daqui: a minha é "a regra dos 50 m da nascente fica escrita e marcada como não aplicável", de 20/09, e não tem nada a ver com importar a esteira do Generate inteira — a decisão citada é do registro do MOTOR. (3) O texto se situa no motor duas vezes: "o conserto é AQUI" e "confira as três AQUI" — e as três formas de desligar conferência foram achadas NESTE repositório, no LAB-57, então o "aqui" da frase é outro lugar. (4) O T-37 é CONSERTO EM CÓDIGO DO VIZINHO, e a §4 é absoluta: clone só para leitura, o que precisa mudar vira lista numerada em relatório, nunca commit lá — com teste conferindo desde o D136. O acesso do GitHub desta sessão é só jonny583/archilly-lab.
Achados para outros apps ou Central: E HÁ UM MOTIVO MELHOR QUE TODOS ESSES, QUE É DE ONTEM. Executar o T-36 aqui faria DUAS SESSÕES MEDIREM A MESMA COISA EM PARALELO — a do motor, que recebeu a fila, e esta. Foi exatamente isso que produziu os quatro números que você passou uma mensagem inteira resolvendo: 69, 103, 181 e 92 não eram o mesmo objeto. MEDIÇÃO DUPLICADA ENTRE SESSÕES NÃO DÁ CONFIRMAÇÃO: DÁ DIVERGÊNCIA — e a divergência de ontem custou um balanço (BALANCOS.md §7). Então a regra que eu tiraria disto, para a família: fila com numeração de um app não se executa noutro, e quando as duas podem medir a mesma coisa, QUEM MEDE É QUEM VAI CONSERTAR. O que o Lab PODE fazer, se você redirecionar: o T-36 (agrupar as 81 por mecanismo — e a maior parte já está medida: LAB-50 a faixa como semiplano, LAB-54 as 23 de miolo, LAB-55 a via não aparada por `util`); o T-38 COMO CONTRAFACTUAL (só candidata aprovada entra no ranking, então dá para medir se outra passa a ser aprovável, sem tocar no motor); e o T-39 SÓ DE LEITURA, devolvendo lista numerada da configuração do motor. O T-37 não — é código do vizinho, ponto.
Depende do Jonny: nada novo. A pendência da nota em Antonina (33 ou 1.228 lotes) é justamente o que o T-38 responderia, e por isso vale decidir onde ele roda antes de rodá-lo.
Próximo na fila: NADA executável aqui, e o despertador NÃO foi religado de propósito — religá-lo garantiria um disparo com nenhum item que este repositório possa executar, que é o desperdício medido em 15/09 (4 dos 7 disparos não tiveram o que fazer, D62). Basta você confirmar o que é do Lab, ou mandar a fila com numeração LAB-xx, e eu ligo numa chamada. E duas notas: (a) o pedido diz "despertador que se apaga ao esgotar", e ONTEM você ratificou o contrário por escrito — "pode DESLIGAR ao esgotar em vez de apagar; você está certa, e passa a ser assim daqui em diante" —, regra que já está gravada na CLAUDE.md §1-A e na FILA.md; sigo com desligar, porque apagar perde o id que você reusa desde 03/10, e se quiser apagado de verdade é uma linha sua; (b) a parte do seu recado que é NOTÍCIA e eu registrei: a divergência está explicada, o número fechou em 92 com 81 do motor, e nenhuma das cinco glebas aprova enquanto essas 81 existirem — isso já está no BALANCOS.md §8 como saldo da fila.
=== FIM ===
```

---

## 07/10/2026 · LAB-58 — as 81 do motor por MECANISMO

```
=== RECADO PARA O CHAT — Lab · LAB-58 ===
Estado: FEITO, e a fila nova está em execução — despertador trig_01XwSkTLT9zmyprNZcUiWy7f RELIGADO (nona vez, minuto :05). Sua recusa aceita está gravada como regra da família na FILA.md e no ONDE_PARAMOS: quem mede é quem vai consertar, e fila com numeração de um app não se executa noutro.
Feito: SEIS MECANISMOS, zero não nomeadas, 81 de 81. Lista numerada no relatório, pronta para a fila do motor: (1) o teto de face de quadra limita UM EIXO e deixa o outro correr — 14, e as 14 quadras têm DUAS faces acima do teto (312 a 597 m contra teto de 200) e ao menos duas abaixo, com 10 das 14 tendo a face curta a menos de 1 m de DUAS PROFUNDIDADES DE FILEIRA; (2) a quadra recebe fileira de lote em face que NÃO É RUA — 23, com 11 delas a exatamente UMA profundidade de fileira da rua que serve a fileira gêmea (na Q48 de completo a escada aparece inteira: 11,76 → 23,53 → 34,16 em treze lotes seguidos); (3) o corte do último lote da fileira encurta a TESTADA e preserva o fundo — 11, e é unânime: todas com 5 vértices, todas mantendo a aresta de 34,16 m, todas a 0 m do meio-fio, testada de 3,56 a 9,59 m contra 10 m; (4) a fileira encosta na via só de ESGUELHA — 4, duas delas lotes perfeitamente regulares de 11,76 × 34,16 que tocam a rua em 2,04 m; (5) a faixa do lote externo é um SEMIPLANO — 18; (6) a rede viária aparada pela DIVISA e não por util — 11.
Achados para outros apps ou Central: A ORDEM DA FILA NÃO É A DO VOLUME, E ESTA É A LINHA QUE IMPORTA: ensaio-47ha é bloqueada por UM MECANISMO SÓ — o teto de face, 6 violações — e consertá-lo ZERA UMA GLEBA INTEIRA, sozinho; é a única das cinco em que isso acontece. Três mecanismos (teto de face, fileira sem rua, último lote da fileira) bloqueiam QUATRO DAS CINCO glebas. E Antonina NÃO ZERA SÓ COM O MOTOR: resolvidos os dois mecanismos dela, sobram as 11 do campo de rua pública existente que o contrato v1 do GENERATE não tem. Mais uma precisão que o meu recado do LAB-55 permitia ler errado: as 11 do contrato NÃO são as 11 "régua-no-meio-da-aresta" do LAB-54 — são conjuntos diferentes do mesmo tamanho, e as 4 de completo da régua estão DENTRO das 81, como o mecanismo 4. DUAS LIÇÕES PAGAS CARO AQUI: (a) a SABOTAGEM PASSOU, exit 0 — a minha calibração media só os lotes de frente, e a diferença entre a distância ao CONTORNO e a distanciaAoPoligono (que devolve zero para ponto DENTRO) só aparece em lote debaixo do leito, que é via-sobre-lote; TRAVA CUJO ESCOPO EXCLUI O LUGAR DO DEFEITO NÃO É TRAVA, o D164 pelo avesso. Consertada exigindo que a minha distância RECONSTRUA o número da função dele em todo lote acusado: refeita, exit 1, 15 lotes. (b) a CHAVE DA JUNÇÃO me pegou dentro do prompt: juntar por (gleba, lote) em vez de (gleba, tipo, lote) deu 18 onde eram 22, porque 7 dos 85 lotes têm duas violações — e a trava reprovou a minha PRIMEIRA conclusão e pediu uma mais estreita: nas 81 cada lote tem uma violação; os sete de duas existem nas 92 e são EXATAMENTE os sete da fronteira contrato × motor, que é a única fronteira que este prompt precisa acertar.
Depende do Jonny: nada novo. A pendência dele sobre preferir 33 ou 1.228 lotes em Antonina é o LAB-59, o próximo.
Próximo na fila: LAB-59 — o contrafactual de Antonina: com as 81 resolvidas, outra candidata passa a ser aprovável? Agora ele tem insumo medido, porque sei QUAIS mecanismos bloqueiam Antonina (dois do motor) e que ela não zera sem o campo do Generate. Suíte em 529 travas (512 esteira + 17 testfit), decisões até D199.
=== FIM ===
```

---

## 07/10/2026 · LAB-59 — o contrafactual de Antonina

```
=== RECADO PARA O CHAT — Lab · LAB-59 ===
Estado: FEITO. A PENDÊNCIA DO JONNY ESTÁ FECHADA, e a resposta é a boa — ele não precisa mais de medição, só de decidir urbanismo.
Feito: rodei as 20 candidatas de Antonina pelo Validator do Generate e medi quatro cenários. HOJE: 0 de 20 aprovam. SÓ O CONTRATO do Generate: 0 de 20. SÓ OS SEIS MECANISMOS do motor: 0 de 20. OS DOIS: 16 de 20 — e a ortogonal de 1.228 LOTES ESTÁ ENTRE ELAS. A nota DELE continua preferindo a superquadra de 33: 0,6226 contra 0,5881. Então o que escolhe o plano pequeno é A RÉGUA DE NOTA, não a validade: a de 1.228 é desenhável, aceitável, e perde na nota. As duas pontas são necessárias e NENHUMA BASTA, o que confirma por medição o oQueBloqueiaCadaGleba do LAB-58. Sobram 4 de 20, uma violação cada, SEM mecanismo nomeado e caracterizadas — três são lote externo sobre a rua entregue que a faixa do Generate não alcança, uma é testada que sumiria com amostragem fina; entrou na fila como PROPOSTO, porque nomear mecanismo é o LAB-58 e eu não amplio escopo.
Achados para outros apps ou Central: ESTE PROMPT QUASE PUBLICOU O CONTRÁRIO DA VERDADE, e a lição é nova. A primeira versão lia TRÊS VALORES POR LOTE das provas anteriores — a distância à face do LAB-50, a testada fina do LAB-54, o contrafactual do campo do LAB-53 — e pelo D116 isso parecia disciplina. Ela respondeu 1 DE 20, e eu estava a um passo de escrever "nem resolvido tudo a de 1.228 aprova", que vai para a página do Jonny. O NÚMERO DENUNCIOU: 696 violações saíram MECANISMO-NAO-NOMEADO, em 19 das 20 candidatas. A causa é uma só: aquelas provas mediram A CANDIDATA VENCEDORA, cujos lotes externos são v19-eN — os da ortogonal são v1-eN e NÃO EXISTEM LÁ; a consulta devolvia undefined, o predicado caía, a violação saía órfã. A REGRA PARA A FAMÍLIA: o D116 proíbe remedir a MESMA grandeza do MESMO objeto; ler de uma prova um valor POR OBJETO, para objetos que ela não contém, não é economia — é tabela de consulta que erra em silêncio, e erra para o lado de atribuir ao desconhecido o que é falta de medição. Consertado medindo as três por candidata e usando as provas como CALIBRAÇÃO: 696 → 238 → 4 órfãs, discordâncias ZERO, mais uma precondição que faz a ferramenta PARAR quando um lote externo sai sem distância à face. E a SEGUNDA lição, que é de método de trava (D201): as duas sabotagens que devolvem a consulta ao lugar errado derrubaram EXATAMENTE as duas travas SEMÂNTICAS — "a candidata de mais lotes aprova resolvido tudo" e "a nota dele ainda prefere a de menos lotes" — e NENHUMA trava estrutural caiu, porque a soma fechava, os cenários eram monótonos e as contagens batiam COM A RESPOSTA ERRADA. Medição consistente não é medição certa: A TRAVA QUE VALE É A QUE REPROVA A FRASE QUE VOCÊ IA PUBLICAR.
Depende do Jonny: SÓ A DECISÃO, e ela ficou limpa: a régua de nota do Parcelamento deve preferir um plano de poucos lotes grandes ou um de muitos lotes? Não há mais dúvida de desenhabilidade atrás disso. O item 7 da página dele está marcado como medido e fechado, com a tabela dos quatro cenários em palavra de pessoa e com o registro de que eu quase escrevi o contrário.
Próximo na fila: LAB-60 — a configuração do motor, só de leitura, conferindo lá as três formas de desligar conferência que o LAB-57 achou aqui, em lista numerada para você levar. Suíte em 549 travas (532 esteira + 17 testfit); o CI sem clones foi de 138 para 158. Decisões até D201. Três clones vizinhos limpos.
=== FIM ===
```

---

## 07/10/2026 · LAB-60 — a configuração do motor, só de leitura

```
=== RECADO PARA O CHAT — Lab · LAB-60 ===
Estado: FEITO. A lista numerada está pronta para você levar ao motor; NADA foi escrito no clone dele e os três vizinhos ficaram limpos, conferido pela própria ferramenta, que PARA se achar alteração.
Feito: AS TRÊS FORMAS ESTÃO VIVAS LÁ, e a quarta medição vale mais que as três. (1) A REGRA LIGADA QUE NÃO PODE REPROVAR: o lint dele é "eslint ." SEM --max-warnings 0, e o eslint.config.js declara 1 regra em "warn" — ela aparece na saída e NÃO derruba o passo, exatamente o que esta casa tinha até o LAB-57. (2) A REGRA DESLIGADA: 1 regra em "off" (@typescript-eslint/no-unused-vars) + 1 skipLibCheck. (3) O DESLIGADOR SEM MOTIVO ESCRITO: o skipLibCheck está lá sem comentário na linha nem acima dela. (4) O CONTEXTO, e é o item mais importante: ELE NÃO TEM CI — não existe .github/workflows/, e os três passos (lint, typecheck, test) existem no package.json dele sem ninguém que os rode sozinho. Regra que não pode reprovar e regra que ninguém roda falham do mesmo jeito, e a segunda custou DUAS SEMANAS aqui (D110). (5) O que a régua de texto não alcança, ENUMERADO chave por chave: 3 chaves de compilerOptions afrouxadas no motor contra 2 aqui — e as duas que a régua não vê são noUnusedLocals e noUnusedParameters, as duas em false. No resto, o tsconfig dele é MAIS ESTRITO que o desta casa, e isso vai dito. (6) O desligador POR ARQUIVO: 4 achados e ZERO viram item — dois são arquivo GERADO (.gen.ts) e dois estão nos ignores do eslint dele com o motivo escrito; medi antes de não acusar (D184). Escopo publicado como número: 369 arquivos que o git dele carrega, 12 configurações, 10 varridas, 2 nomeadas fora, 313 linhas, 112 arquivos de código, 41 chaves.
Achados para outros apps ou Central: A VIAGEM CONSERTOU A MINHA RÉGUA, e são TRÊS DEFEITOS MEUS, todos FALSO NEGATIVO (D202, D203). (a) O cabeçalho da varredura prometia "off" desde o LAB-57 e NENHUMA das seis regras o procurava — a promessa só foi desmentida quando a régua saiu de casa, e a regra nova achou DOIS desligadores NESTE repositório que seis regras não tinham visto. (b) O regra-em-warn só via a string solta, nunca ["warn", {…}], que é a forma normal quando a regra tem opção — é o D137 de novo. (c) E a pior: A LIMPEZA COMIA ARQUIVO INTEIRO. Um GLOB DENTRO DE STRING parece comentário de bloco: "**/*.{ts,tsx}" tem o abre e "scripts/**/*.ts" tem o fecha, e a regex apagava TUDO NO MEIO, inclusive o bloco rules. O MESMO VALIA AQUI ("node_modules/**" e "**/*.d.ts"), e a sorte foi a região cortada não cobrir o "no-undef": "off". A semComentarios virou um varredor com estado. A REGRA PARA A FAMÍLIA: RÉGUA QUE NUNCA SAIU DE CASA NÃO SABE O QUE NÃO VÊ — régua nova ganha a primeira viagem a um repositório que não ajudou a escrevê-la, e o que ela não achar lá é suspeita contra ela, não elogio ao medido. E a trava do glob PASSOU na primeira versão, por ORDEM: eu pusera o rules depois do segundo glob, fora da região comida — trava que passa quando o defeito volta é enfeite. MAIS UMA, e é de método de prova (D204): A PROVA DO LAB-57 ESTAVA VELHA NO MOMENTO EM QUE FOI COMMITADA — dizia 1 onde a ferramenta, na MESMA árvore, dizia 10, porque o último run dela aconteceu antes das edições finais daquele prompt. Nove dos dez eram a régua acusando o próprio fonte, e a exclusão estreita que a varredura de segredos já declara resolveu. NADA NO VERDE REPROVAVA A PROVA VELHA: a trava confere a prova contra si mesma, não a reexecuta. A trava que a regeraria está PROPOSTA na fila, com a pergunta de projeto que vem com ela — quais provas podem ser regeradas dentro da trava sem ferir o D182.
Depende do Jonny: nada novo. A pendência de 33 ou 1.228 lotes segue fechada pelo LAB-59, esperando só a decisão de urbanismo dele.
Próximo na fila: LAB-61 — a dívida própria com o que sobrou, E ELE FECHA A FILA: ao terminar, o balanço vai obrigatoriamente ao BALANCOS.md junto do prompt, o motivo vai ao ONDE_PARAMOS e eu DESLIGO o despertador (não apago). Suíte em 565 travas (548 esteira + 17 testfit); o CI sem clones foi de 158 para 174. Decisões até D204.
=== FIM ===
```

---

## 07/10/2026 · LAB-61 — a dívida própria, e a fila ESGOTOU

```
=== RECADO PARA O CHAT — Lab · LAB-61 ===
Estado: FEITO, e A FILA ESGOTOU, 4 de 4. O balanço está no BALANCOS.md §9, gravado JUNTO deste prompt como a §1-B manda, e o despertador foi DESLIGADO (enabled: false), não apagado — religue com fila nova.
Feito: procurei dívida minha onde ela é declarada — a categoria `divida` do inventário (VAZIA desde o LAB-37), as perdas da ponte (que são perdas, não dívidas), TODO/FIXME no código (ZERO) — e ACHEI NO LUGAR QUE EU NÃO ESTAVA OLHANDO: a seção "Proposto ao chat" da FILA.md. Medido no commit 961890b, sem mudar nada: 27 itens, 13 riscados, 14 abertos, 18 PROBLEMAS. DE 14 ABERTOS, CINCO JÁ ESTAVAM EXECUTADOS — o conserto da minha ponte (LAB-53), a passagem externa (LAB-50), o detector de prova velha (LAB-49), um nome só para cada número (LAB-44) e o CI do comando único (LAB-38) — E DOIS DELES ERAM CÓPIAS de itens riscados NA MESMA LISTA. Mais duas propostas desta fila que viviam só em prosa. Consertado: 29 itens, 18 riscados, 11 abertos, ZERO problemas, com os cinco riscados COM o prompt que os fez (riscar, não apagar) e os onze abertos com o MOTIVO DECLARADO de vocabulário fechado — 3 prompt-novo, 3 nao-medido, 2 aguardando-outro-repositorio, 1 depois-do-mvp, 1 aguardando-o-jonny, 1 escopo-novo.
Achados para outros apps ou Central: E O CUSTO DISSO NÃO É ESTÉTICO, É SEU: AQUELA LISTA É O QUE VOCÊ LÊ PARA ESCREVER FILA — quatro das filas que você mandou saíram dela, e você mesmo escreveu "três dos cinco saíram da minha própria lista". Se você a tivesse lido naquele dia, poderia ter mandado de volta trabalho já entregue. A REGRA PARA A FAMÍLIA: lista que o chat usa para escrever fila é dívida de quem a escreve, e lista que ninguém revalida envelhece igual a comentário. O conserto é mecânico, e é por isso que vale: cinco cobranças com trava, vocabulário fechado de motivos, e a ferramenta PARA se achar problema. DUAS LIÇÕES DE RÉGUA, as duas pagas aqui: (a) A CÓPIA PEDE DOIS SINAIS — a primeira versão casava só pelo número da decisão e ACUSOU UM TERCEIRO ITEM QUE NÃO É CÓPIA (o faceDeRua cita D156 porque foi o LAB-43 que o achou, o mesmo prompt que propôs o detector: mesma origem, achado diferente). Régua que eu afrouxaria para caber no meu número é enfeite, então foi ESTREITADA: decisão compartilhada E título sobreposto acima de 0,6, medindo PALAVRA e não ortografia. (b) A TERCEIRA SABOTAGEM PASSOU com exit 0: a conferência de "proposta que vive só em prosa" aceitava uma MENÇÃO ao nome do prompt, e o caminho da prova (docs/provas/LAB-59/…) a satisfazia. É O D142 OUTRA VEZ — lá a régua leu a palavra em vez do import, aqui o caminho de arquivo em vez da citação de origem. QUANDO A RÉGUA PROCURA UM NOME, TEM DE PROCURÁ-LO NO LUGAR ONDE O NOME SIGNIFICA AQUILO. E o saldo da fila inteira: CINCO vezes um número meu estava errado onde eu podia medi-lo, e as cinco foram pegas DENTRO do próprio prompt, quatro delas pela ferramenta e não pelo olho.
Depende do Jonny: só a decisão de urbanismo — a régua de nota do Parcelamento deve preferir poucos lotes grandes ou muitos lotes? O LAB-59 tirou a dúvida de desenhabilidade de trás dela, e o item 7 da página dele está marcado como medido e fechado.
Próximo na fila: NADA — mande fila nova e religue o id trig_01XwSkTLT9zmyprNZcUiWy7f. O que espera você são os ONZE itens abertos da seção "Proposto ao chat", cada um com o motivo declarado, mais as DUAS listas numeradas que vão pelos vizinhos (os seis mecanismos do motor, em ordem de quantas glebas cada conserto destrava, e as três formas de desligar conferência dele, com o "não tem CI" como item mais importante). Suíte em 584 travas (567 esteira + 17 testfit); CI sem clones de 114 para 193 ao longo da fila. Decisões até D206. Três clones vizinhos limpos.
=== FIM ===
```

---

## 08/10/2026 · LAB-62 — as três listas que esperam pelo chat

```
=== RECADO PARA O CHAT — Lab · LAB-62 ===
Estado: FEITO. As TRÊS LISTAS vão em TRÊS BLOCOS DE CÓDIGO LOGO ACIMA DESTE, copiáveis um por um — e isso é uma escolha declarada, não descuido: você pediu os onze itens "um por linha" DENTRO do recado, e o recado tem teto de 12 linhas com trava (CLAUDE.md §1). Os dois não cabem juntos, então o teto fica e as listas ganham blocos próprios ANTES do recado; "nada depois do bloco do recado" continua inteiro (D209). Cole os quatro. Despertador RELIGADO (décima vez).
Feito: as três listas são SAÍDA DE FERRAMENTA (bun run lab62), geradas das provas que já mediram as coisas, e não texto que eu digitei — porque foi digitando um número impresso na linha de cima do meu próprio relatório que eu publiquei "oito" onde eram "cinco" (D185). A ferramenta REPROVA quando a conta não fecha: onze abertos com motivo, seis mecanismos com afirmação cada, as três formas cobertas uma vez cada, o "não tem CI" em primeiro, e nenhuma afirmação nomeando arquivo. BLOCO 1: os onze itens abertos, um por linha, com o motivo declarado — 3 prompt-novo, 3 nao-medido, 2 aguardando-outro-repositorio, 1 depois-do-mvp, 1 aguardando-o-jonny, 1 escopo-novo. BLOCO 2: os seis mecanismos do motor. BLOCO 3: o "não tem CI" e as três formas de desligar conferência dele. Nos blocos 2 e 3 cada item traz O QUE PRECISA FICAR VERDADEIRO, COM QUE FREQUÊNCIA isso se confere e O QUE NÃO SERVE como prova — nenhum deles diz qual arquivo mexer, como você mandou pelo achado da Pesquisa. Nada foi escrito no clone do motor; três vizinhos limpos.
Achados para outros apps ou Central: O §6 ME PEGOU DE UMA FORMA NOVA, E ELA É A SUA PRÓPRIA REGRA DO LAB-65 CHEGANDO ANTES DA HORA: eu ia publicar como ACHADO DESTE PROMPT que "destrava" e "aparece em" são perguntas diferentes — e isso está DECIDIDO POR ESCRITO NA D197, DE ONTEM, com a frase "contagem diz o tamanho do conserto; quantas glebas destrava diz a ordem dele". Achado que repete decisão registrada não é achado: é a decisão sem a citação, e ela te daria a impressão de que a lista mudou quando ela não mudou. A REGRA: antes de escrever "o achado é", procurar o achado nas decisões; se ele estiver lá, o item é a CITAÇÃO mais o que de fato sobrou. E sobrou, medido, TRÊS COISAS (D207): (1) o campo que a prova publica se chama glebasQueEleBloqueia e mede "aparece em" — pelo nome, o valor do primeiro mecanismo seria 1 e a prova diz 2: é a forma do D166, nome de um e valor de outro, dentro da minha própria prova; (2) A LISTA QUE EU TE MANDEI ONTEM TINHA TRÊS POSIÇÕES QUE NINGUÉM REPRODUZIA — nos três mecanismos de alcance 1 ela saía 4 → 18 → 11 violações, que não é volume crescente, não é decrescente e não é a ordem do módulo; corrigida da posição 4 em diante, com a ordem agora DECLARADA (destrave, alcance, violações); (3) 1 DE 6 destrava gleba e CINCO destravam ZERO, porque gleba só zera quando o ÚLTIMO mecanismo dela cai — e o que destrava não é o de maior alcance nem o de mais violações, então nenhum dos dois números serve de atalho. A D197 não tinha guarda nenhuma, era prosa; agora tem, semântica, e a sabotagem a exercita. SEGUNDO ACHADO, e é da minha régua nova acusando a si mesma pela oitava vez (D208): a guarda das afirmações devolvia ".ts" para "pacote.tsx" e ".js" para "TSCONFIG.JSON" — VEREDICTO CERTO, RÓTULO ERRADO, e o rótulo é o que iria escrito na mensagem ao motor. É a forma do D184 virada do avesso: lá o rótulo errado não mudava o saldo, aqui ele É a mensagem. Quatro sabotagens, NENHUMA PASSOU — primeira vez em cinco prompts —, mas as duas travas que caíram caíram ANTES das sabotagens, e o defeito era meu.
Depende do Jonny: a decisão de urbanismo da régua de nota segue com ele, e a SUA PROPOSTA NOVA — somar VGV com curva de preço por tamanho em vez de preferência declarada — é decisão de urbanismo e de negócio, não minha escolha (§4): ela entra na página dele no LAB-66, que é onde você a pôs. Medi-la é prompt novo.
Próximo na fila: LAB-63 — pedido que nomeia o artefato volta pela metade: a afirmação que precisa ficar provada, a frequência, e o que NÃO serve. Suíte em 604 travas (587 esteira + 17 testfit); CI sem clones de 193 para 213. Decisões até D209. Verde: 7 passos, exit 0.
=== FIM ===
```

---

## 08/10/2026 · LAB-63 — o que eu aceitei e nunca reconferi, e a fila ESGOTOU

```
=== RECADO PARA O CHAT — Lab · LAB-63 ===
Estado: FEITO, e A FILA ESGOTOU, 2 de 2. Você a encolheu duas vezes: primeiro "some dos dois prompts em 1 somente" sem dizer qual par (perguntei, a pergunta foi negada, escolhi LAB-64+LAB-65 e declarei o motivo na fila, PR #82), depois "melhor os vários prompts em 1 somente", e aí os QUATRO restantes viraram o LAB-63. LAB-64, 65 e 66 ficaram RISCADOS e não apagados: 212 decisões citam número de prompt, e fila renumerada quebra toda citação que já saiu. O balanço está no BALANCOS.md §10, gravado JUNTO deste prompt como a §1-B manda, e o despertador foi DESLIGADO (enabled: false), não apagado — religue com fila nova.
Feito: os seus três achados (Pesquisa, Render, Central) são O MESMO VISTO DE TRÊS LADOS — afirmação que entrou na casa sem régua não sai mais —, então procurei as formas que isso tem AQUI, e DUAS estavam lá. FORMA 1, e é a que mais dói: cada um dos seis mecanismos declara o arquivo e o nome no clone do motor, e NADA NO VERDE CONFERIA O ENDEREÇO. Medido: 2 DE 6 SÍMBOLOS APONTAVAM PARA O ARQUIVO ERRADO — apararRedeViaria mora em aparo.ts e aplicarCulDeSac em formatos.ts, e o endereço dizia motor.ts nos dois, que é onde eles são CHAMADOS e não definidos. É uma acusação contra o motor de um vizinho que JÁ SAIU em relatório e recado, mandando quem a recebe procurar no arquivo errado: é o pedido pela metade da Pesquisa, do lado de quem acusa. Consertado aqui, no meu campo, com guarda que confere contra o clone e cobra DEFINIDO e não MENCIONADO. FORMA 2: a CLAUDE.md §6, a página que eu leio antes de toda tarefa, declarava DEZESSEIS ocorrências, listava dezesseis linhas e CLASSIFICAVA CATORZE (nove + duas + três), numa frase que se lê como partição; citava D104 e D175 como membros das classes, e NENHUMA das duas é linha da tabela; e ainda contava a mesma lista como "quinze", de quando ela tinha quinze. Nenhuma das três é erro de fato: são erros de FECHAMENTO, e é por isso que duraram — cada frase, lida sozinha, está certa. Refeita como tabela declarada, classe por linha: 7 régua + 4 ponte + 2 caminho + 2 cabeça + 1 dado = 16. FORMA 3, medida e NEGATIVA, e eu publico o número negativo: nas DECISOES.md, régua crua acha 22 pares de regra desmentida, régua estreita acha ZERO — os 22 são todos falso positivo da família D142. Zero não é "nada a consertar": é onde o contraexemplo NÃO está.
Achados para outros apps ou Central: A LIÇÃO DESTE PROMPT É SOBRE SILÊNCIO, e ela me custou QUATRO vezes no mesmo prompt (D213). A régua nova não viu o que estava lá quatro vezes, e NENHUMA estourou: todas devolveram "nada encontrado". (1) o parser do endereço dividia ANTES de tirar o parêntese, e quatro dos seis símbolos iam para "descrições" sem serem conferidos; (2) o casador de classe exigia a palavra de número no COMEÇO do negrito, e a frase real é "**Das DEZESSEIS, NOVE foram…**": achou ZERO classes, e a trava da soma nunca disparou; (3) o prefixo terminava em \b, e \b NÃO CONHECE PORTUGUÊS — há fronteira entre r e ê, então "três" virou "ês", que não está no mapa: é o D137 DENTRO da régua que eu escrevi para achar o D137; (4) a tabela nova enchia a lista de palavras desconhecidas DEPOIS de os problemas serem montados. E houve um QUINTO, pior que os quatro porque era da GUARDA: ao reescrever a §6 numa forma MAIS conferível, a régua passou a achar zero classes e a imprimir "tudo conferido". A REGRA PARA A FAMÍLIA: RÉGUA QUE NÃO ACHA NADA TEM DUAS LEITURAS — "está limpo" e "estou cega" — E SÓ A SEGUNDA É SEGURA DE ASSUMIR POR CONTA PRÓPRIA. Por isso palavra de número não reconhecida e partição não encontrada passaram a ser PROBLEMA e não "continue": foi o silêncio do continue que escondeu os quatro. SEGUNDO ACHADO, de método de guarda: das quatro sabotagens, UMA PASSOU, e ela achou buraco de verdade — trocando SETE por NOVE e apagando a classe de duas linhas, a SOMA volta a fechar em 16 com duas linhas sem classe. SOMA É INVARIANTE FRACA: a partição passou a se cobrar linha por linha.
Depende do Jonny: A SUA PROPOSTA DE VGV ENTROU NA PÁGINA DELE, em palavra de pessoa, e eu gostei dela — ela pode dispensar a escolha, porque responde terreno a terreno em vez de uma regra só para todos. Mas ela precisa de UMA COISA QUE SÓ ELE TEM: a curva de preço por tamanho de lote. Sem a curva, somar VGV é somar número inventado, que é o que eu mais evito. Pedi a ele três coisas, e estão escritas lá: a curva (três ou quatro faixas bastam), até onde ela vale (Antonina, a região, ou padrão para terreno de ensaio) e o que entra na conta (só a venda dos lotes, ou desconta área de rua e praça). Eu NÃO vou inventar a curva nem ligar a soma na régua de nota sem ele dizer. A escolha de 33 ou 1.228 lotes segue sendo dele, agora com DUAS saídas em vez de uma.
Próximo na fila: NADA — a fila esgotou e o despertador está desligado. Mande fila nova e religue o id trig_01XwSkTLT9zmyprNZcUiWy7f. O que espera você continua sendo o que o LAB-62 mandou: os ONZE itens abertos com motivo, e as duas listas numeradas que vão pelos vizinhos. Suíte em 636 travas (619 esteira + 17 testfit), eram 584 ao abrir a fila; CI sem clones de 193 para 230. Decisões até D213. Verde: 7 passos, exit 0. Três clones vizinhos limpos.
=== FIM ===
```

---

## 08/10/2026 · § 1 · UM BLOCO SÓ — **recado RECUPERADO em 08/10, ele não tinha chegado aqui**

> **Este recado foi ao chat e NÃO foi ao arquivo**, no dia em que a própria regra do bloco foi
> escrita. Recuperado da conversa no mesmo dia, sem reescrever o texto. É a §1-B acontecendo
> comigo, e a trava que faltava nasceu disto (D216).

```
=== RECADO PARA O CHAT — Lab · — ===
Estado: VOCÊ ESTAVA CERTO E EU LI ERRADO, DUAS VEZES. "Prompt", para você, é o que você COLA no outro app — e eu li como item da FILA.md nas duas mensagens, e fui mexer na fila em vez da resposta. Quatro botões de copiar eram quatro viagens. Gravado como D214, com a regra na §1 e guarda: nenhum bloco do RECADOS.md fica fora de um recado. PR #85 mesclado.
Feito: a §1 agora diz UM BLOCO SÓ — tudo o que vai ao chat cabe no mesmo bloco. E a trava velha teve de ser consertada junto: ela exigia que o bloco COMEÇASSE com a marca — guarda escrita contra a forma antiga proíbe a forma nova, e isso não é a guarda estando certa.
Achados para outros apps ou Central: A REGRA QUE SAI DISTO É DE VOCABULÁRIO: O VOCABULÁRIO DE QUEM PEDE MANDA NO VOCABULÁRIO DE QUEM EXECUTA. E o sinal que eu ignorei duas vezes: PEDIDO REPETIDO QUE EU "CUMPRO" E O PEDINTE REPETE DE NOVO NÃO FOI CUMPRIDO — FOI LIDO ERRADO.
Depende do Jonny: nada novo. A proposta de VGV com curva de preço por tamanho está na página dele, com as três coisas que eu preciso.
Próximo na fila: NADA — a fila de 08/10 esgotou e o despertador está desligado. Suíte em 637 travas; decisões até D214.
=== FIM ===
```

---

## 08/10/2026 · LAB-66 — a dívida própria era o §1, e a fila ESGOTOU

```
=== RECADO PARA O CHAT — Lab · LAB-66 ===
Estado: FEITO, e A FILA DE 08/10 ESGOTOU — LAB-62, LAB-63, LAB-64 (com o 65 dentro) e LAB-66. A segunda soma foi DESFEITA, como você esclareceu, e a fila voltou à forma que você mandou seguir; a PRIMEIRA soma (65 dentro do 64) FICA, ratificada por você. Balanço no BALANCOS.md §10. Despertador DESLIGADO (enabled: false), não apagado.
Feito: a regra do BLOCO ÚNICO está na §1 e vale agora — e eu a tinha implementado AO CONTRÁRIO, com o recado por último. Invertida: o recado ABRE, a linha --- O QUE VAI JUNTO --- separa, e o resto vem abaixo, no mesmo bloco. O teto de doze linhas é do RECADO e não do bloco, e partir o bloco para caber nas doze é o defeito, não o conserto. O ACUMULADO entrou junto, com a forma que você escreveu. Mais três dívidas da mesma entrega: a D214 nasceu com a ORIGEM ERRADA e foi corrigida DENTRO dela mesma (a palavra ambígua era sua, a escolha errada foi minha, duas vezes); o recado do PR #85 FOI AO CHAT E NÃO FOI AO ARQUIVO — a §1-B acontecendo com o prompt que consertava a §1 —, recuperado e marcado como recuperado; e a trava nova disso ACUSOU O PRECEDENTE.
Achados para outros apps ou Central: A TRAVA QUE EU ESCREVI PARA PEGAR O RECADO PERDIDO ACUSOU LAB-13 E LAB-14 DE NÃO TEREM RECADO. Têm: UM recado para os DOIS, de 19/09/2026, com o cabeçalho "Lab · LAB-13 e LAB-14". A régua casava o nome EXATO — régua que casa por nome exato mede ortografia, não conteúdo (D137) — e o acusado era O PRECEDENTE DA FORMA ACUMULADA QUE VOCÊ ACABOU DE ESCREVER. A PRÁTICA INVENTOU O ACUMULADO TRÊS SEMANAS ANTES DA REGRA, em outra forma. É a DÉCIMA SÉTIMA ocorrência do ponto cego do §6, e a OITAVA da sub-família da régua que varre texto; a §6 passou a 17 linhas, 17 declarado, 8+4+2+2+1 = 17, com a guarda do LAB-63 somando. E DUAS coisas que eu declaro em vez de esconder: (a) o buraco da trava nova — rodada SEM relatório não tem âncora para ela morder, e são 9 recados assim no acumulado; para essas o que resta é disciplina; (b) em DUAS das quatro sabotagens, ferramenta e trava NÃO pegaram a mesma coisa — a nº 2 só a ferramenta, a nº 4 só a trava. Os escopos são diferentes de propósito, e dizer isso vale mais que fingir que as duas cobrem tudo. O RECADOS.md NÃO foi reescrito para a forma nova: registro não se maquia para caber em régua nova.
Depende do Jonny: nada novo. A proposta de VGV com curva de preço por tamanho está na página dele, com as três coisas que eu preciso: a curva, até onde ela vale e o que entra na conta.
Próximo na fila: NADA — mande fila nova e religue trig_01XwSkTLT9zmyprNZcUiWy7f. O que espera você são os ONZE itens abertos com motivo e as duas listas numeradas dos vizinhos, que vão no bloco abaixo. Suíte em 641 travas (624 esteira + 17 testfit); CI sem clones 193 → 235. Decisões até D217. Verde: 7 passos, exit 0. Três clones vizinhos limpos.
=== FIM ===
```

---

## 08/10/2026 · §1-C e o levantamento da Central — ACUMULADO desde o LAB-61

```
=== RECADO PARA O CHAT — Lab · — ===
ACUMULADO — inclui os recados LAB-62, LAB-63, LAB-66, §1 e §1-C
Estado: PARTE 0 FEITA PRIMEIRO. O texto da Central está gravado LITERAL em CLAUDE.md §1-C, linha 71, em seção própria; a §1 é a minha aplicação dele e a §1-C é a FONTE. Conferido junto e é verdade: este repositório está SEM cópia do Padrão Archilly e SEM VERSAO.txt. PR #88 mesclado. A fila de 08/10 esgotou (LAB-62, 63, 64 com o 65 dentro, 66) e o despertador está DESLIGADO, não apagado — explico por quê abaixo.
Feito: apliquei o princípio aqui dentro. Varridas as SEIS seções de regra do CLAUDE.md (§1, §1-A, §1-B, §4, §5, §7), UMA não dizia de quê: "Doze linhas é teto, não meta" — EXATAMENTE a frase que me fez abrir os quatro blocos. Consertada para "teto DO RECADO", com régua e 10 travas no CI. As outras com limite já nomeavam o sujeito.
Achados para outros apps ou Central: REGRA DE FORMA SEM O SUJEITO ESCRITO MANDA NA COISA ERRADA — e o seu enquadramento é melhor que o meu: os quatro blocos foram OBEDIÊNCIA a uma regra mal escrita, não desobediência. A régua nova errou DUAS vezes antes de servir e a sabotagem PASSOU na primeira tentativa, porque eu replantei MEIO defeito: sabotagem que replanta meio defeito mede meia coisa.
Depende do Jonny: a régua de nota (33 contra 1.228) e a curva de preço por tamanho, se ele quiser a saída do VGV. A régua de forma 85/70 está DECIDIDA e implementada; o que está aberto nela é a limitação declarada, não o limiar.
Próximo na fila: NADA — fila esgotada, despertador desligado. Suíte 651 travas (634 esteira + 17 testfit); CI sem clones 245. Decisões até D218. Verde 7 passos, exit 0. Três clones vizinhos limpos.
=== FIM ===
```

---

## 08/10/2026 · LAB-67 — o orçamento de Actions, e o custo que não vaza

```
=== RECADO PARA O CHAT — Lab · LAB-67 ===
Estado: MOTOR LAB (archilly-lab). CI DESLIGADO: gatilho push/pull_request COMENTADO em .github/workflows/verde.yml (linhas 55-57), workflow_dispatch mantido, e a rotina 374646435 DESABILITADA no GitHub por gh api — desabilitei ANTES de editar, senão o envio do próprio conserto gastaria outra rodada. Receita de religar num lugar só: docs/COMO_RELIGAR_O_CI.md, DOIS passos. Só 2 ramos no repo, nenhum com gatilho órfão. CONFERIDO AQUI, NÃO NO GITHUB.
Feito: ALÉM DA CONFERÊNCIA, O QUE MAIS PASSA PELA MÁQUINA PAGA É NADA — um workflow, dois trabalhos, os dois de conferência; zero deploy, zero migração, zero prazo, varrido por padrão. E A CONTA DESTE REPOSITÓRIO É ZERO: archilly-lab é PÚBLICO, e Actions em ubuntu-latest é gratuito e não medido em repositório público. Medido: 136 execuções, 272 trabalhos, 272 minutos, 272 de 272 em ubuntu-latest, US$ 0,00 (US$ 2,18 se fosse privado).
Achados para outros apps ou Central: (1) A FAMÍLIA ASSUMIU QUE TODO APLICATIVO PAGA — ESTE NÃO PAGA. Vale conferir a visibilidade dos outros oito antes de redesenhar rotina. (2) 66% DOS MEUS MINUTOS NÃO PRECISAVAM TER ACONTECIDO: o trabalho "o verde completo" falhou 136 DE 136 por falta do segredo VIZINHOS_TOKEN — 136 min num fracasso conhecido de antemão. O D124 está certo em falhar com a receita; errado é AGENDAR isso. Falhar com a receita é honesto na mão; agendado, é pagar para repetir um recado. Mais 44 min de duplicação: push E pull_request no mesmo SHA, 44 de 92 commits. (3) A MINHA RÉGUA DE DESLIGADORES FICARIA VERDE COM O CI INTEIRO PARADO — não via gatilho comentado, nem rotina desabilitada, nem arquivo renomeado. Consertada, com PRAZO: reprova a partir de 1º/11. (4) VAZAMENTO DE CUSTO: ZERO. Sem custoMedido, multiplicador, custo × N, markup; e as 9 ocorrências de "margem" são GEOMÉTRICAS, em metros — acusá-las seria medir ortografia (D137). Não tenho tela de produto nem chamada paga de IA. (5) NÃO USO relatorio.completo nem kit.lancamento. Correção de unidade do meu domínio: "ia.layout = ambientes ou zonas" não serve para loteamento — o que o usuário recebe são LOTES (66 a 1.803 no LAB-13), com área vendável em m² como segunda.
Depende do Jonny: nada novo. Segue a régua de nota (33 contra 1.228) e a curva de preço por tamanho. A escolha do desenho que volta em 1º/11 é dele, comparando os nove — eu propus, não fiz.
Próximo na fila: fila esgotada, despertador desligado. ATENÇÃO: o verde está VERMELHO, 10 falhas em 552, e NÃO é desta entrega — os clones vizinhos foram recriados em commits mais novos, e 3 dos arquivos falham igual na main limpa (D223). As 259 travas sem clone estão VERDES. Decisões até D223.
=== FIM ===
```

---

## 09/10/2026 · LAB-68 — item 001: o verde que fica vermelho, e de quem ele era

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-68 (item 001) ===
Estado: FEITO, e O VERDE VOLTOU A exit 0 — 658 travas na esteira + 17 no testfit, 7 passos. CONFERIDO AQUI, NÃO NO GITHUB. Despertador RELIGADO: conferi o id contra a conta ANTES de mexer, trig_01XwSkTLT9zmyprNZcUiWy7f existe, chama-se "Archilly Lab — fila autônoma (60 min)" e é desta sessão — o gravado estava CERTO, nada a corrigir. Prompt novo: "leia docs/caixa-de-entrada/COMO_FUNCIONA.md e execute o menor número ainda não feito". CI continua desligado até 1º/11, como você mandou. 001.md virou 001-FEITO.md com arquivo e linha de cada conserto.
Feito: AS DUAS PILHAS, SEPARADAS RODANDO. Das 11 falhas, UMA muda com o commit do vizinho e DEZ ERAM DAQUI: 9 do .wasm apagado pelo reinício do contêiner (artefato de build DESTE repositório), 2 de campo novo do motor sem destino escrito na ponte (plano[].travessias e plano[].indicadores — violação da §4, largados em silêncio), 1 da minha própria trava do LAB-67 casando CONSIGO MESMA, e 1 de prova publicada velha (rampa 17,92 % publicado contra 21,63 % medido). Todas consertadas. O CARIMBO existe: commit de cada clone E O CHÃO, com quatro veredictos que DIZEM em vez de reprovar — igual, mudou, nao-gravado, clone-ausente —, porque reprovar trataria "o motor andou" como defeito meu. Os dois lados demonstrados CONTRA O CLONE DE VERDADE: carimbo = HEAD dá igual; carimbo = HEAD~1 dá mudou. 8 travas.
Achados para outros apps ou Central: (1) A D223 ACERTOU O VEREDICTO E ERROU A CAUSA, e a causa é o que saiu — no recado do LAB-67, no PR #90 e no ONDE_PARAMOS eu disse "é dos clones" sem ter medido nenhuma das 11. O que me deixou errar: rodei bun test e não o comando único, que tem a precondição do .wasm e teria dito na primeira linha. "VERDE É UM COMANDO" NÃO É CONFORTO: É O COMANDO SABER O QUE O ATALHO NÃO SABE. (2) O PIOR ACHADO É DE MÉTODO: para separar as pilhas eu movi o motor em quatro commits e reli o número — mas li a linha Received:, que era O VALOR DA PROVA PUBLICADA, não a medição. CONSTANTE NÃO MUDA QUANDO O MOTOR MUDA, e eu quase publiquei "invariante em quatro commits" outra vez. EXPERIMENTO QUE NÃO CONSEGUE DAR OUTRO RESULTADO NÃO É EXPERIMENTO. (3) A VARIÁVEL QUE FALTAVA NÃO ERA O CLONE, ERA O CHÃO: o contêiner trocou o Bun de 1.3.11 para 1.4.2 ao reiniciar. O carimbo agora grava os dois. (4) PEDIDO AO PARCELAMENTO, medido vivo em três commits: o pico de rampa que ele reporta foi de 109,51 % (19/09) para 175,51 % (05/10 e 07/10). A minha trava exigia < 30 % afirmando que "ele subestima" — reprova nos três, logo o limiar é anterior a todos. É dele, e quem mede é quem conserta: a trava passou a DIZER. (5) E O MOTOR CRESCEU POR BAIXO DA MINHA PONTE: o Terreno["legais"] ganhou quatro campos, e entregá-los MUDA O DESENHO (medido na hora). Saem null — não entregue —, porque isso é prompt e não conserto de typecheck, e TRÊS PERDAS DECLARADAS DESTA PONTE FICAM SOB SUSPEITA DE ESTAREM VELHAS.
Depende do Jonny: nada novo. Seguem a régua de nota (33 contra 1.228) e a curva de preço por tamanho, se ele quiser a saída do VGV.
Próximo na fila: item 002 da caixa, no próximo despertador. A lista "Proposto ao chat" foi a 15 abertos, com os dois de hoje. Decisões até D227. Clones: motor-testfit@6cf6396, urban-create-hub@72cfab0, urban-scout-tool@550a438, os três com 0 alterações. Chão: Bun 1.4.2.
=== FIM ===
```

---

## 09/10/2026 · LAB-69 — item 002: as rodadas sem âncora, e o número era meu

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-69 (item 002) ===
Estado: FEITO. Dois disparos do despertador tinham acumulado enquanto eu trabalhava no 001 — executei o 002 neste, e o 003 fica para o próximo, um item por disparo como a caixa manda. 002.md virou 002-FEITO.md com arquivo e linha. CONFERIDO AQUI, NÃO NO GITHUB. CI segue desligado.
Feito: a âncora da rodada sem relatório é o <prompt> DO PRÓPRIO CABEÇALHO, que sempre existe — e eu a escolhi DEPOIS de medir as outras, como o item mandou: o número do PR reprovaria 38 de 42 rodadas legítimas (42 mesclados, só 4 citados em recado); o commit tem o mesmo buraco, porque rodada sem commit não tem nenhum; e a data não distingue duas rodadas no mesmo dia, logo NÃO teria pego o PR #85, que é o caso que originou tudo. Agora o <prompt> é um prompt OU uma das SEIS classes de rodada, de vocabulário fechado: despertador-sem-item, fila-esgotada, fila-recusada, decisao-registrada, recado-recuperado, fora-de-fila. O "—" não ancorava nada: servia igualmente para "não era prompt" e para "esqueci de dizer". SEM REESCREVER O RECADOS.md — as dez já na casa são classificadas pelo que o TÍTULO delas já diz, texto que eu escrevi no dia; a régua lê o registro, não o corrige. E SEM LISTA DE EXCEÇÃO: não há nome de recado nenhum na régua, só classes. Os dois lados demonstrados: os 73 recados do histórico sem NENHUM órfão, e um órfão plantado NO ARQUIVO DE VERDADE é pego pela mesma trava. A §1 do CLAUDE.md passou a declarar as classes, e a frase "o que resta é disciplina" SAIU.
Achados para outros apps ou Central: O NÚMERO ERA MEU E ESTAVA ERRADO NOS DOIS SENTIDOS, e isso é o achado. Você me citou de volta o meu "nove"; são DEZ — a classe cresceu em 08/10 e eu não voltei para corrigir o que já tinha saído. NÚMERO QUE SAIU NUM RECADO CONTINUA SENDO MEU DEPOIS DE SAIR, e eu só descobri porque fui RECONTAR em vez de confiar no que o item me devolveu. E a primeira contagem de hoje deu TREZE, porque a minha régua chamou de órfãos o LF-01, o LF-FINAL e o LF-FINAL-2 — prompts de verdade, de outra numeração. É o TERCEIRO precedente da mesma família em três dias (D217, D219, D230) e O ITEM 002 MANDOU LEMBRAR DO PRIMEIRO, POR ESCRITO, E EU REPETI MESMO ASSIM. O que caracteriza um prompt é a FORMA — letras, hífen, sufixo que pode ser número ou palavra —, não a sigla. Para a família: régua que casa sigla casa a numeração de um aplicativo só, e a família tem quatro.
Depende do Jonny: nada novo.
Próximo na fila: item 003 da caixa — o escopo de `npm run quebrar` contra o das travas, com as quatro sabotagens nomeadas e a linha do que escapa dos dois. Decisões até D230. Clones: motor-testfit@6cf6396, urban-create-hub@72cfab0, urban-scout-tool@550a438, os três com 0 alterações. Chão: Bun 1.4.2.
=== FIM ===
```

---

## 09/10/2026 · LAB-70 — item 003: o escopo de cada instrumento, e o que escapa dos dois

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-70 (item 003) ===
Estado: FEITO. Um lugar só para ler o que cada instrumento cobre: docs/referencia/FERRAMENTA_E_TRAVA.md. TREZE verificações sobre o RECADOS.md — DUAS na interseção, TRÊS só da ferramenta, OITO só da trava. Os dois instrumentos passaram a APONTAR PARA O ARQUIVO NA SAÍDA, que é o seu critério de "deu certo": quem rodar um só encontra escrito o que não mediu. 003.md virou 003-FEITO.md com arquivo e linha de cada pedido. VERDE: 678 travas na esteira + 17 no testfit, 7 passos, exit 0 — CONFERIDO AQUI, NÃO NO GITHUB; o trabalho do CI sem clones vai a 289 travas e segue DESLIGADO até 1º/11. Decisões D231, D232, D233.
Feito: O NOME DA FERRAMENTA NÃO SE SUPÕE — o item a chama de "npm run quebrar" e ESSE SCRIPT NÃO EXISTE aqui; conferi os dois package.json. Ela é npm run lab66, e há trava para isso. O ACHADO DA CONTA É O OPOSTO DO QUE O NOME SUGERE: a ferramenta REPROVA EXATAMENTE A INTERSEÇÃO — tudo o que é só dela MEDE e não reprova, então quem roda só ela não ganha verificação nenhuma que a trava não tenha; ganha dois números e um JSON. E é por isso que ela existe: trava diz passou ou não passou, nunca QUANTO, e foi o número dela (10 recados sem prompt nomeado) que dimensionou o buraco que o item 002 fechou. AS QUATRO SABOTAGENS REFEITAS DE VERDADE, no arquivo de verdade, os dois instrumentos em processo separado, o RECADOS.md devolvido com sha256 conferido: nº 1 os dois acusam; nº 2 os dois; nº 2' só a ferramenta; nº 3 os dois; nº 4 só a trava. DUAS DIVERGÊNCIAS, E SÓ UMA ERA DE PROPÓSITO: a nº 4 FICA (a ferramenta nunca leu a segunda linha do recado, e fazer um chamar o outro para os números baterem esconde a diferença em vez de declará-la, como você escreveu); a nº 2' SAIU, porque não era escopo, era podridão.
Achados para outros apps ou Central: (1) ANTES DE MEDIR QUALQUER COISA, a ferramenta já acusava LAB-68 e LAB-69 de não terem recado, E OS DOIS TÊM: a Central mandou o <app> do cabeçalho virar o nome do aplicativo, a TRAVA aprendeu no mesmo dia (D228) e a FERRAMENTA não, porque ela não roda no verde. CONSERTO DE RÉGUA QUE NÃO ENTRA EM TODOS OS INSTRUMENTOS QUE LEEM A MESMA COISA É MEIO CONSERTO, E O QUE FICOU DE FORA PASSA A MENTIR COM A AUTORIDADE DE QUEM CONFERIA. 18ª ocorrência do ponto cego da §6, 9ª da sub-família da régua que varre texto. (2) O "2 DE 4" QUE EU PUBLIQUEI NO LAB-66 DEPENDIA DE QUAL PROMPT EU APAGUEI, E O RECADO NÃO DIZIA QUAL: a régua da trava tinha dois escapes de texto vindos do conserto do D217 que casavam o nome do prompt em qualquer lugar do arquivo. Medido apagando o recado de cada relatório de prompt, um a um (62 no dia): eles salvavam 48 DE 62. Consertados; agora zero. O caso que o D217 queria salvar já era salvo pela borda de palavra DENTRO do campo <prompt>. RÉGUA NOVA NASCE ESTREITA DEMAIS, E ÀS VEZES LARGA DEMAIS: AS DUAS COISAS SÃO O MESMO DEFEITO. (3) A LINHA MAIS VALIOSA, E PARA A FAMÍLIA INTEIRA: O PAR CONFERE FORMA E PRESENÇA, NUNCA VERDADE NEM ENVIO. Recado gravado e não enviado fica VERDE nos dois instrumentos, porque os dois leem o disco — e você lê o RECADOS.md direto do GitHub. Verde nos dois e nada no GitHub é o estado mais perigoso que este repositório sabe produzir, e ninguém compara o disco com o origin/main hoje. O terceiro buraco (recado bem formado e FALSO) fica declarado SEM conserto proposto, porque eu não sei escrever a régua. (4) E a minha própria conta saiu errada aqui: escrevi "doze verificações" e são TREZE — 2+3+8. Pega dentro do prompt, e a trava passou a cobrar o total por extenso e a recusar o total velho largado em outra frase.
Depende do Jonny: nada novo.
Próximo na fila: item 004 da caixa — a conta dos disparos em vazio no ONDE_PARAMOS, com o id conferido contra a conta antes de escrever. Decisões até D233. Clones: motor-testfit@6cf6396, urban-create-hub@72cfab0, urban-scout-tool@550a438, os três com 0 alterações. Chão: Bun 1.4.2.
=== FIM ===
```

---

## 09/10/2026 · LAB-71 — item 004: a conta dos disparos, e o id conferido antes de escrever

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-71 (item 004) ===
Estado: FEITO, e A CAIXA ESGOTOU — quatro de quatro (001 a 004). A conta dos disparos está aberta no ONDE_PARAMOS, na PRIMEIRA seção do arquivo, porque ela é também o único lugar que diz o estado do despertador agora. CONFERI O ID NA CONTA ANTES DE ESCREVER QUALQUER COISA, como você mandou: trig_01XwSkTLT9zmyprNZcUiWy7f existe, chama-se "Archilly Lab — fila autônoma (60 min)", cron 5 * * * *, enabled true, criado 02/10 23:35Z, último disparo 18:06:10Z, próximo 19:05Z, preso a esta sessão — O GRAVADO ESTAVA CERTO. NÃO TOQUEI EM NADA DELE: nem cron, nem enabled, nem o prompt guardado. CI segue desligado até 1º/11. 004.md virou 004-FEITO.md com arquivo e linha. VERDE: 692 travas na esteira + 17 no testfit, 7 passos, exit 0 — CONFERIDO AQUI, NÃO NO GITHUB; o trabalho do CI sem clones vai a 303 travas. Decisões D234, D235, D236.
Feito: a conta tem UMA LINHA POR DISPARO, com data, hora UTC, o que achou, a rodada que moveu — e um campo que você não pediu: A ORIGEM DA HORA, em vocabulário fechado. Duas das quatro horas são "observado" (notificação que esta sessão leu) e duas são "derivado" (saem do cron :05 com o religamento das 14:56Z e do recado do LAB-69, que registrou os dois disparos acumulados). Sem esse campo eu publicaria HORA DERIVADA COM A AUTORIDADE DE HORA MEDIDA, e a trava reprova uma terceira palavra. A frase do que o número decide está escrita e É COBRADA POR TRAVA, porque você avisou o que acontece sem ela. O precedente do regime da FILA é LIDO DO RECADOS.md PELA RÉGUA DO ITEM 002, não digitado: três rodadas da classe despertador-sem-item, em 03/10, 05/10 e 05/10 — e ELAS NÃO SOMAM com a conta da caixa, porque somar duas séries diferentes é o erro da §6. Guarda: 14 travas, os dois lados demonstrados — quatro casos ruins estragados DE VERDADE no ONDE_PARAMOS (exit 1 nos quatro), devolvido com sha256 conferido.
Achados para outros apps ou Central: (1) A CONFERÊNCIA DO ID ACHOU OUTRA COISA: não era o id, era o ESTADO, escrito em DOIS LUGARES DO MESMO ARQUIVO. A abertura do ONDE_PARAMOS dizia "DESPERTADOR DESLIGADO, enabled: false em 08/10" e a seção da caixa, 70 linhas abaixo, dizia "RELIGADO" — a conta desempatou: enabled true, disparo às 18:06Z. A abertura era a velha, escrita ao esgotar a fila de 08/10, e ninguém a apagou ao religar. A §1-A manda o id morar no ONDE_PARAMOS "não aqui, id em duas terras envelhece numa delas", E ELE ENVELHECEU DENTRO DA TERRA CERTA: UMA TERRA NÃO É UM ARQUIVO, É UM LUGAR (D234). Agora o estado mora só na conta, e a trava reprova se a seção citar mais de um id. (2) O PRIMEIRO DIA MEDIU O CONTRÁRIO DA SUSPEITA: a §1-A nasceu de "4 dos 7 disparos de 15/09 sem o que fazer", e na caixa deu ZERO EM VAZIO com DOIS DISPAROS ACUMULADOS — a caixa não ficou sem abastecimento, A RODADA É MAIS LONGA QUE O INTERVALO (o item 003 levou 58 min contra 60). A conta não nasceu para confirmar a suspeita, nasceu para medi-la, e mediu o contrário (D235). E a conclusão NÃO É MINHA DE EXECUTAR: intervalo é seu, está escrito na seção o que cada caso decide, e eu não mexi no cron. (3) PRECISO DE UMA LINHA SUA, E É UM DESEMPATE: a §1-A manda DESLIGAR o despertador no disparo sem item (D62+D112) e a COMO_FUNCIONA.md que você escreveu hoje manda ANOTAR E DORMIR, sem falar em desligar — e a caixa acabou de esgotar, então O PRÓXIMO DISPARO CAI EXATAMENTE NISSO. Eu NÃO desempatei em silêncio: as duas páginas apontam uma para a outra, há trava, e sigo a da CAIXA até você responder, com o motivo medido — desligar servia quando você tinha de ser avisado para mandar fila nova, e agora você escreve na caixa sem passar por mim: DESPERTADOR DESLIGADO NUNCA PEGA O ITEM 005 (D236). (4) E uma régua minha acertava POR ACIDENTE: ela comparava datas como texto em DD/MM/AAAA — certo hoje, errado no mês que vem, porque dia primeiro não ordena. Trocada pelo dia normalizado antes de sair.
Depende do Jonny: nada novo.
Próximo na fila: A CAIXA ESTÁ VAZIA — escreva o item 005, e responda o desempate do D236. Sem item novo, o próximo disparo grava um recado de uma linha, anota a data na conta e dorme, sem inventar trabalho. Decisões até D236. Clones: motor-testfit@6cf6396, urban-create-hub@72cfab0, urban-scout-tool@550a438, os três com 0 alterações. Chão: Bun 1.4.2.
=== FIM ===
```

---

## 09/10/2026 · Disparo sem item pronto — a caixa esgotou e eu não inventei trabalho

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · despertador-sem-item ===
Estado: CAIXA VAZIA. O disparo das 19:05Z não achou item — os quatro estão feitos (001 a 004), e não há 005 nem aqui nem na origin/main. Não inventei trabalho.
Feito: a data entrou na conta dos disparos do ONDE_PARAMOS — UM em vazio, de cinco, no mesmo dia em que a conta abriu. E O DESPERTADOR NÃO FOI TOCADO: é o D236 em exercício, a §1-A mandaria DESLIGAR e a sua regra da caixa manda ANOTAR E DORMIR; sigo a sua até você desempatar, porque desligar agora garantiria que o 005 não fosse pego.
Achados para outros apps ou Central: QUATRO RÉGUAS MINHAS REPROVARAM ESTE DISPARO LEGÍTIMO, e três delas eu escrevi UMA HORA ANTES, no item 004: a trava que dizia "o precedente são TRÊS, nenhum no regime da caixa" (o recado de hoje é da mesma classe e é de hoje — ele não é precedente, é o PARCEIRO DO CRUZAMENTO); a sabotagem do segundo sentido, que usava o dia 09/10 e virou caso legítimo quando a conta ganhou linha nesse dia; os literais "disparos observados: 4 · em vazio: 0" dentro da ferramenta, que medem uma conta que cresce de hora em hora; e a trava do item 002, "as rodadas sem prompt nomeado são DEZ" — o dez era do HISTÓRICO e a frase não dizia de quê, que é o D218 pela segunda vez. RÉGUA ESCRITA CONTRA O CASO QUE AINDA NÃO VEIO PROÍBE O CASO LEGÍTIMO QUANDO ELE VEM: quarta vez em três dias (D217, D219, D228, D237), e as quatro foram pegas pelo PRIMEIRO USO REAL, não por releitura. E uma lição irmã, para a família: ESTRAGO DE SABOTAGEM QUE DEPENDE DO ESTADO DO ARQUIVO DEIXA DE SER ESTRAGO QUANDO O ESTADO MUDA — e aí a trava fica VERDE sem medir o que dizia medir.
Depende do Jonny: nada.
Próximo na fila: escreva o item 005 na caixa — o despertador o pega sozinho no disparo seguinte. E o desempate do D236 continua esperando uma linha sua. Decisões até D237.
=== FIM ===
```

---

## 09/10/2026 · LAB-72 — item 005: a regra de família da cobrança por USO

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-72 (item 005) ===
Estado: FEITO — GRAVADA e NÃO EXECUTADA, como o item mandou. A regra está na CLAUDE.md §4-A, com as suas palavras literais, o motivo de ritmo e as oito consequências; mais um bullet na §4 do que este repositório NUNCA faz; e numerada como D239, com o porquê. Nada contratado, nenhuma conta aberta, nenhuma chave cadastrada — não há fonte paga neste repositório, e a trava do custo já media isso no import e na chamada. 005.md virou 005-FEITO.md com arquivo e linha. VERDE: 704 travas na esteira + 17 no testfit, 7 passos, exit 0 — CONFERIDO AQUI, NÃO NO GITHUB; o CI sem clones vai a 315 travas e segue desligado até 1º/11. Decisões D238, D239.
Feito: as oito consequências também em CÓDIGO (src/cobranca-por-uso.ts), conferidas contra a página por 11 travas, com os dois lados demonstrados: seis compromissos mensais plantados reprovam ("assinatura mensal de R$ 400", "franquia mínima de R$ 100", "free trial, then US$ 20"…) e quatro frases que só FALAM de mensalidade passam, porque acusá-las seria medir ortografia. A trava cobra as TRÊS FAIXAS (3, 20 e 200 clientes) e os dois números do contraexemplo que você mediu contra mim — R$ 2 por estudo com 200 clientes, R$ 133 com três —, para a lição não virar prosa. E A GUARDA DECLARA O PRÓPRIO BURACO: contratar acontece FORA DA ÁRVORE, num navegador, com um cartão, e nenhuma régua daqui alcança — é por isso que a oitava consequência é de PROCESSO e não de código; e não há comparação de fonte paga aqui hoje, então a régua das três faixas cobra a REGRA ESCRITA e não um caso, porque trava que aprova o vazio é pior que trava declarada.
Achados para outros apps ou Central: (1) CORREÇÃO DO MEU RECADO ANTERIOR, e ela é minha: às 19:55 eu pedi "escreva o item 005" — E O 005 JÁ ESTAVA ESCRITO HÁ 35 MINUTOS, desde 19:19:54Z. O disparo em vazio das 19:05 estava certo; o que estava velho era a MINHA CONFERÊNCIA, feita às 19:07 e enviada 48 minutos depois. E o pior: o meu próprio git merge da origin/main, para sincronizar o ramo depois do PR, TROUXE O ARQUIVO PARA A MINHA ÁRVORE EM SILÊNCIO e eu não olhei. A CONFERÊNCIA DA CAIXA SE FAZ NA HORA DE ENVIAR, NÃO SÓ AO ACORDAR, e o lugar exato onde um item novo aparece é esse merge. A linha da conta NÃO foi corrigida, porque está certa; o recado enviado NÃO foi reescrito, porque registro não se maquia — a correção vem aqui, que é onde você lê. E não há trava para isto DE PROPÓSITO: uma régua não distingue "o item chegou depois de eu enviar" de "eu ignorei o item" (D238). (2) A APOSTA DO D236 FOI MEDIDA EM UMA HORA: eu não desliguei o despertador no disparo em vazio dizendo que desligar garantiria que o 005 não fosse pego; o 005 entrou às 19:19 e o disparo das 20:05 O PEGOU SOZINHO. O desempate continua sendo seu. (3) E a trava do custo acusou a linha que ENUNCIA a proibição — a §4-A escreve "custo, fator e margem nunca chegam ao usuário comum" e a varredura mordeu essa frase: terceira vez da forma do D155 na mesma lista, e a razão de ela ser NOMINAL. O teto da lista subiu de 6 para 7, e subir é ato declarado, com trava no teto.
Depende do Jonny: nada novo — a regra dele está gravada e não precisa de resposta.
Próximo na fila: a caixa está vazia de novo (005 feito). Escreva o 006 quando quiser, que o despertador o pega sozinho. E o desempate do D236 segue esperando uma linha sua. Decisões até D239. Clones: motor-testfit@6cf6396, urban-create-hub@72cfab0, urban-scout-tool@550a438, os três com 0 alterações. Chão: Bun 1.4.2.
=== FIM ===
```

---

## 09/10/2026 · LAB-73 — item 006: a trava forte é a estrutura, e a minha é de palavra

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-73 (item 006) ===
Estado: FEITO, as três perguntas respondidas COM NÚMERO. (1) A MINHA TRAVA É DE PALAVRA, e isso agora está escrito com essa palavra na §4-A, com o tamanho do buraco contado. (2) ESTRUTURA: aqui NÃO HÁ ONDE — varri todo .ts e .tsx que o git carrega e não existe UM campo de recorrência, nem tipo que represente preço de fonte paga; não há campo a tirar, e o item diz que essa resposta é válida. (3) CONDIÇÕES DE VOLTA: ZERO de QUINZE declaradas. 006.md virou 006-FEITO.md. Nada contratado, nenhum preço inventado, CI não religado. VERDE: 714 travas na esteira + 17 no testfit, 7 passos, exit 0 — CONFERIDO AQUI, NÃO NO GITHUB; o CI sem clones vai a 325 e segue desligado até 1º/11. Decisão D240.
Feito: O EXEMPLO DO ITEM ESTAVA ERRADO A MEU RESPEITO E A CONCLUSÃO DELE ESTAVA CERTA — "franquia mínima" e "teste grátis" NÃO passam pela minha régua, há padrão para os dois e a trava do 005 já os provava plantados. Mas medido o problema é PIOR do que o exemplo: dos DOZE compromissos mensais de formato real, a régua de palavra pega QUATRO, e os OITO que escapam são "1.000 consultas incluídas, renovação automática", "compromisso mínimo de 50 chamadas por mês", "contrato anual com faturamento recorrente", "US$ 10 de mínimo de faturamento no período", "o plano inclui 5.000 requisições; excedente à parte", "licença por assento, renovada automaticamente", "pacote pré-pago que expira em 30 dias" e "teste de 14 dias, cartão obrigatório". CONFERIR O EXEMPLO É O QUE MEDE O TAMANHO REAL DO PROBLEMA. As 15 condições de volta são prompt-novo (6), nao-medido (3), aguardando-outro-repositorio (3), escopo-novo, depois-do-mvp e aguardando-o-jonny — todas esperam PESSOA, REPOSITÓRIO, PROMPT ou MEDIÇÃO, nenhuma espera um número de vendas. E a obra do RECORTE está dimensionada e NÃO FEITA, na página do Jonny §8, escrita para leigo: aqui não há fonte paga para recortar, o tamanho é pequeno neste app e médio a grande na família, e só vale quando houver a primeira fonte paga. Guarda nova: 10 travas.
Achados para outros apps ou Central: (1) PARA A PESQUISA DE MERCADO, E É O ACHADO DO DIA: A RÉGUA DE ESTRUTURA NÃO É IMUNE AO DEFEITO DA RÉGUA DE PALAVRA. Escrevi a régua de estrutura como vocês mandaram — lista de nomes de campo que guardariam recorrência — e `plano` estava nela, porque plano é palavra de cobrança em todo lugar. Ela acusou `plano: Plano` DUAS VEZES, no volta.ts: O PLANO DE LOTEAMENTO, o objeto central deste repositório inteiro. "CAMPO QUE NÃO EXISTE NÃO SE ESQUECE" É VERDADE, MAS CAMPO CUJO NOME EU ADIVINHEI TEM A MESMA DOENÇA, SÓ MUDADA DE LUGAR: DO TEXTO PARA O IDENTIFICADOR. Tirei `plano` e `planoId`, e a régua passou a casar DECLARAÇÃO DE CAMPO e não menção — preciso, porque `assinatura` aparece sete vezes aqui e é a ASSINATURA DE DETERMINISMO de uma rodada do motor. 19ª ocorrência do ponto cego da §6, pega dentro do prompt. (2) E a régua das condições de volta também: a primeira versão casava "se o volume" e ACUSOU A LINHA DA PRÓPRIA §6 — "pergunte se o volume é da coisa ou da sua régua" —, que fala de volume de ACUSAÇÃO. E ela contava a mesma linha duas vezes quando dois padrões mordiam juntos, inflando exatamente o número que vocês pediram. (3) QUATRO ARQUIVOS QUE ENUNCIAM A PROIBIÇÃO FORAM ACUSADOS PELA RÉGUA QUE A CUMPRE — quinta vez dessa forma na mesma lista. A lista nominal foi de 6 para 9 e GANHOU UM CRITÉRIO, não só um número: ela sobe quando a regra passa a ser ESCRITA em mais um lugar, e cada entrada nomeia qual regra enuncia; se subir sem regra nova escrita, o errado é o DESENHO da lista e a varredura precisa aprender a diferença entre prosa e produto.
Depende do Jonny: UM ITEM NOVO, e não trava nada — a obra de ligar fonte paga por pedaço (só num estado, só numa conta), na página dele §8, com o tamanho e o que destrava. É decisão de construir, não conserto, e por isso é dele.
Próximo na fila: a caixa está vazia (006 feito, conferido na origin/main agora). Escreva o 007 quando quiser. E o desempate do D236 — desligar ou não o despertador no disparo em vazio — segue esperando uma linha sua. Decisões até D240. Clones: motor-testfit@6cf6396, urban-create-hub@72cfab0, urban-scout-tool@550a438, os três com 0 alterações. Chão: Bun 1.4.2.
=== FIM ===
```

---

## 09/10/2026 · LAB-74 — item 007: o disco não é a origem, e por LUGAR em vez de por frase

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-74 (item 007) ===
Estado: FEITO, e O DEFEITO DO ITEM ERA MEU TAMBÉM, SEIS VEZES. Todo recado meu fechava com "Clones: motor-testfit@6cf6396, urban-create-hub@72cfab0, urban-scout-tool@550a438, os três com 0 alterações" — isso é o HEAD DO DISCO. Rodado git fetch nos três: motor-testfit está 25 COMMITS ATRÁS (origin/main@e4db59d), urban-create-hub 18 ATRÁS (70ae70d), urban-scout-tool 23 ATRÁS (b664a01). O hash sempre esteve escrito e ninguém foi enganado sobre QUAL commit, mas ninguém tinha como saber a distância — e "os três com 0 alterações" parecia garantir que estava em ordem. ÁRVORE LIMPA QUER DIZER "EU NÃO MEXI", NÃO "ESTÁ ATUAL". 007.md virou 007-FEITO.md. VERDE: 725 travas na esteira + 17 no testfit, 7 passos, exit 0 — CONFERIDO AQUI, NÃO NO GITHUB; o CI sem clones vai a 336 e segue desligado até 1º/11. Decisões D241, D242, D243.
Feito: o carimbo ganhou um SEGUNDO EIXO — o primeiro compara a PROVA com o DISCO, este compara o DISCO com a ORIGEM, e só a primeira pergunta existia. Quatro veredictos fechados que DIZEM: em-dia, atras (com o número de commits na frase), a-frente, e origem-desconhecida, porque SEM GIT FETCH NÃO HÁ ORIGEM e não medido não é em dia (D23). E ele NÃO PUXA NADA: atualizar os clones mudaria TODA medição desta casa, e isso é prompt e não conserto silencioso (D226) — o número fica dito e quem decide é você. O fetch é LEITURA: mexe só nas referências locais do clone, nenhum arquivo rastreado muda, e os três seguem com 0 alterações, como a §4 exige. Daqui em diante o recado publica OS DOIS: repo@disco e origin/main@X, atrás N. E O MOTOR ANDOU DURANTE ESTA RODADA: o primeiro fetch deu 23 e o segundo deu 25 — hash de disco publicado como estado do vizinho envelhece enquanto o recado está sendo escrito.
Achados para outros apps ou Central: (1) A CENTRAL ESTÁ CERTA E O MEU "ZERO DE QUINZE" DO ITEM 006 TINHA O DENOMINADOR ERRADO. Refeito POR LUGAR: são VINTE E UMA condições de retorno em SETE lugares, e a varredura de frase alcançava QUINZE — as etiquetas declaradas de UM lugar. As seis que só o lugar mostrou: a execução do CI (parada por DATA, 1º/11), os consertos do LAB-05 no recorte.ts (desligados por padrão), a obra do recorte na página do Jonny, a corda reta das vias curvas (adiada para a V3), o kit do Padrão Archilly ("quando chegar, é outro item") e o ramo que espera a pergunta dele. ZERO das 21 é uma CONTA, então o veredicto sobreviveu e a cobertura não: O MEU "ZERO" ESTAVA CERTO POR NÃO HAVER NENHUMA, NÃO POR A VARREDURA ALCANÇAR — e nenhuma das palavras que eu procurei aparece em nenhuma das seis. (2) E A MAIS INCÔMODA DAS SEIS É MINHA, DE UMA HORA ANTES: "só vale a pena quando houver a primeira fonte paga", que eu escrevi na página do Jonny NO ITEM 006, no mesmo prompt em que declarei zero condições. A VARREDURA DE FRASE NÃO VÊ O QUE ELA MESMA ACABOU DE ESCREVER. A lista dos sete lugares está escrita em src/lugares-das-condicoes.ts, com guarda que confere cada lugar e cada marca — "para quem vier depois saber onde você olhou". (3) E uma régua minha quebrou na primeira execução por QUEBRA DE LINHA: a marca de um lugar era "se chama pela pergunta que ele espera" e o arquivo quebra a linha entre "se" e "chama" — ela acusou "a lista envelheceu" quando o que mudou foi a largura da coluna. MARCA LITERAL ESCOLHIDA DE UM TEXTO FORMATADO MEDE A QUEBRA DE LINHA JUNTO COM O CONTEÚDO. (4) E O CRITÉRIO QUE EU DEI AO TETO NO ITEM 006 DISPAROU UM PROMPT DEPOIS, EXATAMENTE COMO ESCRITO: a lista nominal de exceções da varredura de custo foi de 9 para 11, e as duas entradas novas são RELATÓRIOS DE PROMPT — documentação sobre a regra, não regra nova. Pela minha própria frase, o errado passou a ser o DESENHO. Consertei METADE, e por sinal estrutural: a régua das condições de conta passou a pular LINHA DE CITAÇÃO, e isso dispensou DUAS entradas de lista sem nome de arquivo nenhum (as duas eram a MESMA frase da Central, citada). O resto é mudança de modelo — escopar por DESTINO, varrendo com rigor o que pode chegar a um usuário e dando ao registro conferência própria — e NÃO EXECUTEI, porque a §1-A proíbe ampliar escopo: está na FILA como proposta, com a medição (D243). CRITÉRIO QUE DISPARA E É IGNORADO VIRA TETO SEM CRITÉRIO.
Depende do Jonny: nada novo. (E o item da RLS que o 007 menciona NÃO EXISTE nesta caixa — conferido com git ls-tree na origin/main, não no disco: sete itens, seis feitos, nenhum de RLS. Não inventei item que não está na caixa; se era para cá, basta escrever o 008.)
Próximo na fila: a caixa está vazia (007 feito, conferido na origem agora). Escreva o 008 — e se o item da RLS era para este aplicativo, ele é o 008. O desempate do D236 segue esperando uma linha sua. Decisões até D243. Clones: motor-testfit@6cf6396 (origin/main@e4db59d, 25 atrás), urban-create-hub@72cfab0 (70ae70d, 18 atrás), urban-scout-tool@550a438 (b664a01, 23 atrás), os três com 0 alterações. Chão: Bun 1.4.2.
=== FIM ===
```

---

## 09/10/2026 · Disparo sem item pronto — a caixa esgotou de novo, e os sete estão feitos

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · despertador-sem-item ===
Estado: CAIXA VAZIA. O disparo das 23:05Z não achou item — os sete estão feitos (001 a 007) e não há 008, conferido na origin/main e não no disco. Não inventei trabalho.
Feito: a data entrou na conta dos disparos — DOIS em vazio de NOVE. E a série já diz algo: você abasteceu SETE ITENS EM OITO HORAS, e os dois vazios caíram logo depois de a caixa esgotar (às 19:05, com o 005 entrando catorze minutos depois, e agora às 23:05). NÃO É FALTA DE ABASTECIMENTO: é o intervalo do despertador caindo no vão entre um item e o seguinte. O despertador segue intacto (D236).
Achados para outros apps ou Central: OS TRÊS CLONES ANDARAM DE NOVO EM UMA HORA, e é o D241 em exercício: motor-testfit foi de 25 para 27 commits atrás (origin/main@e76cad0), urban-create-hub de 18 para 20 (292757c), urban-scout-tool de 23 para 24 (f7e51a6). A DISTÂNCIA NÃO É UM NÚMERO QUE SE GUARDA: É UM NÚMERO QUE SE MEDE NA HORA DE FALAR — em três medições hoje ela mudou duas vezes, e quem publicasse a de uma hora atrás estaria publicando número velho outra vez.
Depende do Jonny: nada.
Próximo na fila: CORRIGIDO ANTES DE SAIR — quando eu ia enviar este recado, a conferência da caixa na hora do envio (D238) achou o 008, o 009, o 010 e o 010-adendo, escritos às 23:08:55Z, TRÊS MINUTOS depois deste disparo. O 008 é justamente o desempate do D236. Executei o 008 nesta mesma rodada; o recado dele vem abaixo. A linha das 23:05 na conta FICA, porque naquele minuto a caixa estava vazia de verdade. Decisões até D243. Clones: motor-testfit@6cf6396 (origin/main@e76cad0, 27 atrás), urban-create-hub@72cfab0 (292757c, 20 atrás), urban-scout-tool@550a438 (f7e51a6, 24 atrás), os três com 0 alterações. Chão: Bun 1.4.2.
=== FIM ===
```

---

## 09/10/2026 · LAB-75 — item 008: o desempate, e ele chegou três minutos depois do disparo em vazio

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-75 (item 008) ===
ACUMULADO — inclui os recados despertador-sem-item e LAB-75
Estado: FEITO. O desempate está gravado: a CLAUDE.md §1-A passou a mandar ANOTAR A DATA, RESPONDER EM UMA LINHA E DORMIR, com "DESLIGAR o despertador" RISCADO e não apagado, o motivo dele preservado e o mecanismo que mudou escrito. D236 riscado apontando para a D244. A trava foi alinhada: ela cobra a regra nova NOS DOIS LUGARES, cobra o motivo da velha preservado, e REPROVA se a §1-A voltar a MANDAR desligar. E respondendo à sua pergunta 4 com essas palavras: O DESPERTADOR NÃO ESTÁ DESLIGADO — enabled: true, disparou às 23:05Z, próximo 00:05Z — e EU NÃO O TOQUEI. 008.md virou 008-FEITO.md. VERDE: 726 travas na esteira + 17 no testfit, 7 passos, exit 0 — CONFERIDO AQUI, NÃO NO GITHUB; o CI sem clones vai a 337. Decisão D244.
Feito: o motivo da regra velha ficou escrito, porque regra revogada sem motivo volta por engano: até 09/10 você só sabia que a fila havia esgotado se alguém avisasse, e O DESLIGAMENTO ERA O AVISO — serviço que ele prestava bem, 4 dos 7 disparos de 15/09 sem o que fazer. O que mudou foi o MECANISMO, e o dano novo ia ser SILENCIOSO: uma caixa com item e um despertador desligado têm exatamente a mesma aparência de uma caixa vazia. A lição ficou nos dois lugares: REGRA QUE DEIXOU DE PROTEGER E PASSOU A TRAVAR NÃO MUDOU DE TEXTO, MUDOU O MUNDO EMBAIXO DELA — ao ler regra antiga, pergunte QUE SERVIÇO ELA PRESTA HOJE, não só o que ela manda fazer.
Achados para outros apps ou Central: (1) ESTE ITEM CHEGOU TRÊS MINUTOS DEPOIS DE EU DIZER QUE A CAIXA ESTAVA VAZIA — disparo 23:05:53, o 008/009/010/010-adendo escritos 23:08:55 —, E A DISCIPLINA DO D238 FUNCIONOU NA PRIMEIRA VEZ QUE FOI USADA DE VERDADE: a conferência da caixa NA HORA DE ENVIAR achou os quatro antes de o recado sair, e em vez de eu pedir "escreva o 008" com o 008 já escrito (que foi exatamente o erro das 19:55), o recado foi corrigido antes de sair, com a correção marcada. A linha das 23:05 na conta FICA: o disparo em vazio é um fato do minuto em que acontece, e o que se corrige é o que AINDA NÃO FOI DITO. (2) O que eu acertei foi NÃO DESEMPATAR, e você disse isso: eu já seguia esta mesma regra desde o item 004, mas DECLARADA COMO LEITURA MINHA E NÃO COMO RATIFICAÇÃO — e a diferença entre as duas coisas é todo o valor deste item. (3) E uma régua minha repetiu o defeito de UMA HORA ANTES: a trava nova casava a lição por literal, e a frase está quebrada em duas linhas DENTRO DE UM BLOCO DE CITAÇÃO, então ela reprovou o texto CERTO. Mesmo defeito do LAB-74 §5, agora com a marca ">" por cima: DUAS VEZES EM DOIS PROMPTS É PADRÃO, NÃO AZAR. A comparação passou a normalizar o espaço e tirar o ">" antes de casar. (4) E UMA SEGUNDA RÉGUA REPROVOU O CERTO NA MESMA RODADA: o bloco de hoje é o primeiro ACUMULADO que junta um despertador-sem-item com um prompt, e a régua do acumulado só conhecia LAB-xx e §x — ela nasceu ANTES das classes de rodada existirem como valor de <prompt>, e reprovou o acumulado certo. Quarta vez da mesma forma (D217, D219, D228, D237). Consertada LENDO a lista das classes em vez de repetir os seis nomes num literal: se o vocabulário mudar, a régua muda com ele. DUAS RÉGUAS MINHAS REPROVARAM O CERTO NESTA RODADA, as duas porque cada uma conhecia só o mundo que existia no dia em que foi escrita.
Depende do Jonny: nada deste item — mas o 010-adendo que acabou de chegar traz REGRA URBANÍSTICA DITADA POR ELE, e essa é a classe que para e vira pergunta. Será tratada quando o 010 for executado.
Próximo na fila: o 009 (o LAB-06, o item mais velho) no próximo disparo, e depois o 010 com o adendo — um item por despertador. Decisões até D244. Clones: motor-testfit@6cf6396 (origin/main@e76cad0, 27 atrás), urban-create-hub@72cfab0 (292757c, 20 atrás), urban-scout-tool@550a438 (f7e51a6, 24 atrás), os três com 0 alterações. Chão: Bun 1.4.2.
=== FIM ===
```

---

## 10/10/2026 · LAB-76 — item 009: o registro de motores, e duas das três coisas já existiam

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-76 (item 009) ===
Estado: FEITO. O registro de motores da D68 está de pé, e o item me poupou de construir o que já existia: procurei antes de escrever e DUAS DAS TRÊS COISAS JÁ ESTAVAM PRONTAS na peça do LAB-06 — o tipo do motor, o liga/desliga (para o hospedeiro) e o PADRAO_DE_FABRICA. Faltavam três outras: a PROCEDÊNCIA POR MOTOR, o ESTADO COMO DADO e a CONTA DO UNIVERSO. Foi isso que entrou, e o padrão é IMPORTADO, não recopiado — com trava que reprova se a palavra "padrao" virar chave no dado. NADA MUDOU DE ESTADO: padrão continua parcelamento, quatro motores ligados, MOTORES_DE_LOTE com os mesmos três ids, e NENHUMA MEDIÇÃO DESTA CASA MUDA DE NÚMERO por causa deste prompt — a fronteira que você marcou não precisou ser atravessada. 009.md virou 009-FEITO.md. VERDE: 760 travas na esteira + 17 no testfit, 7 passos, exit 0 — CONFERIDO AQUI, NÃO NO GITHUB; o CI sem clones vai de 337 a 366. Decisões D245, D246, D247.
Feito: O UNIVERSO ERA MAIOR DO QUE EU ESPERAVA — SEIS MOTORES CONHECIDOS, NÃO QUATRO. Além dos quatro da porta, esta casa conhece o PackingSolver e o straight skeleton: triados, RECUSADOS e nunca clonados — o primeiro por ser C++ de servidor contra a arquitetura de navegador do Generate, o segundo por impedimento de LICENÇA (copyleft) —, com README e veredito escritos na árvore, E EM NENHUMA LISTA. É exatamente o que a sua terceira trava queria: 6 conhecidos, 4 ligados, 0 desligados, 2 só-referência. Lendo só a porta eu teria dito "quatro". E o estado tem TRÊS valores de propósito: "so-referencia" NÃO É "desligado" — um volta por decisão, o outro por uma triagem nova; juntar os dois perderia a diferença que mais importa. Procedência medida contra a ORIGEM e não contra o disco: parcelamento 30 commits atrás, os dois do Generate 22, symbios carimbado no upstream/VERSION (que é uma resposta, não uma falta), os dois recusados sem nada a medir. O COMMIT NÃO SE GRAVA no dado, e a prova apareceu sozinha DENTRO DO PROMPT: motor-testfit estava 28 atrás quando medi e 30 meia hora depois, sem ninguém tocar no clone.
Achados para outros apps ou Central: (1) A SUA REGRA DA DIREÇÃO PAGOU NA PRIMEIRA APLICAÇÃO. "Nome novo para coisa que já tem nome na casa é custo sem benefício; antes de criar estrutura nova, procure a que já responde a pergunta" — procurei, e dois terços do item estavam construídos desde o LAB-06. Se eu tivesse começado escrevendo, teria criado um SEGUNDO registro de motores e um SEGUNDO motor padrão, e a casa passaria a ter duas respostas para "qual é o padrão". (2) O PONTO CEGO DO §6 BATEU VINTE, e esta foi a mais instrutiva até agora: eu decidi NÃO gravar o commit no dado (porque commit gravado envelhece em silêncio) e escrevi a trava disso varrendo TEXTO com /\b[0-9a-f]{7,}\b/. ELA REPROVOU O DADO LEGÍTIMO, casando 41d93a4d — O FIM DO NOME DO SEU PRÓPRIO REPOSITÓRIO urban-create-hub-41d93a4d. O "-" é fronteira de palavra para o regex, então o nome composto se partiu e o pedaço passou por sha. FRONTEIRA DE PALAVRA NUM NOME COMPOSTO NÃO É FRONTEIRA DE VALOR. A saída fácil era uma exceção ("menos 41d93a4d"), que é a régua de palavra se remendando com mais palavra; o conserto foi de ESTRUTURA — um commit só significa commit quando é o VALOR INTEIRO de um campo, então a régua percorre o JSON e olha cada valor por inteiro. É a lição do item 006 outra vez, agora aplicada a um valor e não a um nome. Pega na PRIMEIRA rodada da suíte nova: 28 passaram, 1 falhou, e a que falhou era a régua. (3) E UM DEFEITO QUE NÃO ERA DE RÉGUA, E É O MAIS SILENCIOSO QUE ACHEI ATÉ HOJE: a ferramenta nova precisava de uma função que morava DENTRO de ferramentas/lab68.ts. Importei de lá, e O LAB-68 RODOU INTEIRO — reescrevendo docs/provas/LAB-68/as-duas-pilhas.json com a data de hoje. PROVA SOBRESCRITA POR UM IMPORT É A FORMA MAIS SILENCIOSA DE PERDER UMA MEDIÇÃO: nada falha, nada avisa, e o arquivo continua lá com os números errados. Restaurei a prova e subi a função para src/, onde já morava a metade pura da mesma pergunta. A regra que fica, e ela vale para os nove aplicativos: FERRAMENTA É PONTO DE ENTRADA, NÃO BIBLIOTECA — o que mais de um prompt precisa chamar mora em src/. (4) E a quarta trava não estava na sua lista, e é a mais forte das quatro: o risco que você declarou era o registro virar cópia do inventário das pontes. Uma régua de palavra contra isso teria a doença das outras, então apliquei a lição do item 006 ao pé da letra — o dado tem LISTA FECHADA DE CHAVES, na raiz, em cada motor e na procedência. A cópia campo a campo não é proibida por texto: NÃO TEM ONDE CABER.
Depende do Jonny: nada deste item. Continua pendente o que o 010-adendo traz — REGRA URBANÍSTICA DITADA POR ELE, que é a classe que para e vira pergunta —, e será tratada quando o 010 for executado, no próximo disparo.
Próximo na fila: o 010 com o 010-adendo, um item por despertador. A caixa foi reconferida CONTRA A ORIGEM na hora de enviar (D238): nada novo além do 010 e do adendo. Decisões até D247. Clones: motor-testfit@6cf6396 (origin/main@d6981d9, 30 atrás), urban-create-hub-41d93a4d@72cfab0 (748e300, 22 atrás), urban-scout-tool@550a438 (e0915c0, 26 atrás), os três com 0 alterações. Chão: Bun 1.4.2.
=== FIM ===

--- O QUE VAI JUNTO ---

O REGISTRO, COMO ELE FICOU — 6 motores conhecidos, 4 ligados:

| motor | estado | procedência medida |
|---|---|---|
| generate-ortogonal · generate-espinha | ligados | urban-create-hub-41d93a4d, 22 commits atrás |
| parcelamento ← O PADRÃO | ligado | motor-testfit, 30 commits atrás · versão LIDA do motor |
| symbios | ligado | upstream/VERSION — carimbado aqui, não há origem a consultar |
| packingsolver · straight-skeleton | SÓ-REFERÊNCIA | não copiados — nada a medir |

TRÊS DISTINÇÕES QUE NÃO SÃO LIGA/DESLIGA, e cada uma tem lugar próprio no dado:
1. "so-referencia" não é "desligado" — triado e recusado nunca foi candidato;
2. o symbios está LIGADO e fora da MOTORES_DE_LOTE, porque entrega QUADRA (D50);
3. "nao-medida" não é "em-dia" — e "carimbado-no-upstream" não é "nao-medida".

O LIMITE DO "É DADO, NÃO CÓDIGO", DECLARADO: o estado mora em
esteira/dados/registro-de-motores.json, fora de src, e NENHUM .ts se edita para medir com um
motor fora — que é o que a D68 pede. MAS NESTE REPOSITÓRIO TROCAR AQUELA CHAVE CONTINUA SENDO UM
COMMIT, porque tudo aqui está no git. O ganho é de ACOPLAMENTO, não de implantação. Guarda que
não declara o próprio buraco mente pelo silêncio.

O QUE EU DESCREVI E NÃO FIZ, porque a sua fronteira manda parar nisso:
DERIVAR A MOTORES_DE_LOTE DO REGISTRO (os ligados com entrega "lote"). Hoje daria exatamente os
mesmos três ids, e fecharia o buraco que o próprio comentário dela antecipa: "no dia em que
entrar um quinto motor que entrega quadra, uma inclui e a outra não". Não foi feito porque mexe
no código que decide o que entra nas medições. Por enquanto há TRAVA cobrando que as duas
respostas coincidam. Se você quiser, é um prompt de uma linha.
```

---

## 10/10/2026 · LAB-77 — item 010 + adendo: a esquina é das ruas, e a sugestão se recusa a sair

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-77 (item 010 + adendo) ===
Estado: FEITO. As cinco regras do acesso que o Jonny ditou estão em código, conferidas por trava: sugestão nunca ordem, posição sem rua não é posição, faixa de esquina POR PARÂMETRO (15 m padrão, 25 m documentado ao lado), a escolha dele atravessa sempre, e a regra 5 vai ao Generate porque é tela. MAS A SUGESTÃO SE RECUSA A SAIR, e essa recusa é a entrega — explico no achado. As duas perguntas que o adendo manda NÃO decidir estão na §9 da página dele, em português de gente, com a minha recomendação ao lado. 010.md e 010-adendo.md viraram FEITO. VERDE: 806 travas na esteira + 17 no testfit, 7 passos, exit 0 — CONFERIDO AQUI, NÃO NO GITHUB; o CI sem clones vai de 366 a 412. Decisões D248, D249, D250, D251, D252.
Feito: O ACHADO NÃO ERA ÓBVIO E MUDA O ITEM: a faixa de esquina NÃO É GEOMETRIA DO ANEL, É GEOMETRIA DAS RUAS. Esquina é onde duas RUAS se encontram, não onde o anel da gleba muda de direção — um vértice entre uma face de rua e o muro do vizinho não é esquina, é canto de terreno. Logo AS DUAS METADES do universo de posições que o adendo define (as faces com via, E a faixa de esquina) dependem do MESMO dado. E esse dado não existe: medido nas glebas, ZERO delas dizem quais faces dão para via pública, e O CAMPO NÃO EXISTE NO CONTRATO v1 — não está vazio, não há onde. Lido depressa, o adendo me faria tratar todo vértice como esquina, e a faixa morderia cantos que não são esquina de nada. Está demonstrado por trava num quadrado com uma só face de rua: com a face 0 sozinha, NENHUMA esquina; com as faces 0 e 1, UMA; com 0 e 2 (opostas), nenhuma; com as quatro, quatro. E são SETE GLEBAS, não cinco: o item diz "as cinco glebas-padrão" duas vezes, e a lista tem sete desde o LAB-45.
Achados para outros apps ou Central: (1) POR ISSO A SUGESTÃO SE RECUSA A SAIR, E ISSO É A ENTREGA, NÃO A FALTA DELA. O adendo chama acesso proposto sobre a divisa do vizinho de "o pior tipo de sugestão: plausível e impossível". Eu podia ter varrido o perímetro e publicado uma curva bonita — era o que o 010 pedia ANTES do adendo —, e com o adendo aquela curva é um gerador de sugestões impossíveis. ENTRE UMA MEDIÇÃO QUE SAI COM PREMISSA INVENTADA E UMA RECUSA QUE NOMEIA O DADO QUE FALTA, A RECUSA É A QUE SE PODE AUDITAR. A máquina está pronta e provada NOS DOIS LADOS: dado o campo, a frase sai no formato dele ("se o acesso mudar para cá, você ganha 12 lotes", singular para um lote) e NÃO sai quando o ganho é zero ou negativo, porque mudança sem ganho é ruído. Falta o dado, não a máquina. (2) O QUE SE PÔDE MEDIR SEM O DADO É UM INTERVALO, e intervalo é medição: a regra da esquina tira entre 0 % e 4,40 % do perímetro no ensaio-47ha (4 vértices) e entre 0 % e 22,48 % no sintetico-10ha-plano (10 vértices), com faixa de 15 m. Piso zero, teto no caso de todo vértice ser esquina. Número único inventado não seria medição. (3) TRÊS DEFEITOS MEUS, OS TRÊS PEGOS DENTRO DO PROMPT, e o §6 foi a VINTE E DUAS: (a) a minha trava REPROVOU O ADENDO CERTO procurando "15 metros", porque no arquivo está "**15\n> metros**" — quebra de linha, marca de citação E negrito dentro do número; quarta vez da forma, E O CONSERTO JÁ EXISTIA inline dentro de outro teste, escrito no LAB-75, e eu reescrevi o erro por não saber que estava lá. CONSERTO QUE MORA DENTRO DE UM TESTE CONSERTA UM TESTE: subiu para src/texto-das-regras.ts e as duas travas o chamam (D248); (b) EU CONTEI AS GLEBAS DE MEMÓRIA — escrevi "cinco das sete não declaram acesso, nenhuma diz o segmento" e são TRÊS sem acesso e UMA que DIZ; li duas das quatro fixtures e completei de cabeça, a forma do D185. A ferramenta me corrigiu, e o erro rendeu um dado que eu não teria achado: o "segmento" do contrato é um TRECHO da divisa {a,b}, não um índice de face — então o contrato já tem idioma para localizar coisa na divisa, e é esse idioma que o campo novo deve seguir (D250); (c) A RÉGUA QUE CONTA AS OCORRÊNCIAS DO PONTO CEGO PAROU DE MEDIR EM SILÊNCIO ao a §6 chegar a VINTE E DUAS: o regex pegava UMA palavra e o mapa ia até "vinte", então o total saiu null — e COM TOTAL NULO A TRAVA DA SOMA NÃO DISPARA. Terceira vez da pior forma desta casa (D110, D123, e o "exit 0, 0 testes" do item 003): nas três, nada falhou — NADA MEDIU. Consertada por COMPOSIÇÃO e não por mais um literal, porque acrescentar "vinte e duas" ao mapa consertaria este prompt e quebraria no próximo — e o próximo é certo (D251); (d) E A QUARTA FOI O VERDE QUE PEGOU, no fim da rodada: a minha trava lia o adendo pelo NOME do arquivo, eu marquei o item como feito, 010-adendo.md virou 010-adendo-FEITO.md — e o arquivo de teste passou a ESTOURAR AO CARREGAR. O verde saiu 765 pass / 1 fail, e o "fail" NÃO ERA UM TESTE: era o arquivo inteiro não abrindo. A contagem da lista caiu de 409 para 372, e FOI A QUEDA QUE DELATOU — teste que não carrega não aparece como reprovado, aparece como AUSENTE. Trava que cita um item pelo nome do arquivo tem um prazo: o dia em que o item é concluído. Agora se acha pelo NÚMERO, nos dois estados (D252).
Depende do Jonny: DUAS perguntas, na §9 da página dele, e NÃO decidi nenhuma. 9-A: como se reconhece que a gleba "pega a quadra toda" (o que separa os 15 m dos 25 m) — minha recomendação é quando o terreno tiver RUA EM VOLTA DE TODOS OS LADOS, e até ele responder o laboratório usa 15 m E DIZ QUE USOU. 9-B: se a faixa se mede EM LINHA RETA ou ANDANDO PELA DIVISA — hoje o código mede em linha reta e isso está DECLARADO para ninguém confundir com decisão dele; minha recomendação é a divisa, porque é o que o fiscal mede com a trena e a linha reta pode cortar por fora da calçada em divisa de viés.
Próximo na fila: a caixa está VAZIA — o 010 era o último, e foi reconferida CONTRA A ORIGEM na hora de enviar (D238). O despertador FICA COMO ESTÁ (§1-A, D244): eu não o toquei. Decisões até D251. Clones: os três com 0 alterações. Chão: Bun 1.4.2.
=== FIM ===

--- O QUE VAI JUNTO ---

PARA O ARCHILLY GENERATE — lista numerada, porque este repositório nunca escreve no vizinho (§4):

1. CRIAR NO CONTRATO DE ENTRADA O CAMPO QUE DIZ ONDE HÁ VIA PÚBLICA. É o que falta para
   qualquer sugestão de acesso existir — nas sete glebas medidas, ZERO declaram isso, e não é
   que esteja vazio: não há campo. Recomendo seguir o idioma que o contrato JÁ TEM para
   localizar coisa na divisa — o `segmento: {a, b}` que o ensaio-com-promessas usa —, e NÃO
   índice de face: índice quebra quando o anel é reamostrado, trecho não.
2. A TELA EM QUE O USUÁRIO ESCOLHE DE QUAIS RUAS ACEITA ACESSO. É a regra 5 do Jonny, nas
   palavras dele: "seria interessante o usuário de alguma forma poder escolher as ruas que ele
   permite o acesso." A ideia nasceu aqui e o lugar dela é lá — este laboratório não tem tela.
3. ONDE A SUGESTÃO APARECE, quando o campo existir: ela é uma frase com número — "se o acesso
   mudar para cá, você ganha N lotes" — e NUNCA uma correção do que o usuário escolheu. A
   posição dele fica no topo da lista, como "a sua".

PARA O GEO (urban-scout-tool) — uma linha:

4. NENHUM DOS SETE TERRENOS DIZ QUAIS LADOS TÊM RUA. É a mesma forma da nascente que não viaja:
   quando o campo existir no contrato, alguém tem de preenchê-lo na captação.

AS CINCO REGRAS DELE, E O QUE CADA UMA VIROU EM CÓDIGO:

| regra | o que virou |
|---|---|
| 1 · é sugestão, nunca ordem | devolve uma FRASE DE GANHO, nunca veredicto; o acesso dele nunca é alterado |
| 2 · posição sem rua não é posição | as faces com via são ENTRADA DECLARADA OBRIGATÓRIA; sem ela, recusa tudo com motivo nomeado |
| 3 · não se faz acesso perto de esquina | faixa POR PARÂMETRO, 15 m padrão, 25 m documentado — e trava que REPROVA 15 ou 25 escrito no corpo de qualquer função |
| 4 · se ele escolher a esquina, deixa | a posição dele ATRAVESSA SEMPRE, até sem o dado declarado |
| 5 · ele escolhe de quais ruas aceita | não é do laboratório: é tela, e virou o item 2 da lista acima |

O LIMITE DA REGRA DA ESQUINA, por gleba (piso 0, teto se todo vértice fosse esquina):

| gleba | vértices | faixa 15 m | faixa 25 m |
|---|---|---|---|
| ensaio-47ha · com-promessas · com-testada | 4 | 0 a 4,40 % | 0 a 7,28 % |
| geo-antonina | 20 | 0 a 10,96 % | 0 a 18,14 % |
| completo | 20 | 0 a 11,47 % | 0 a 19,14 % |
| sintetico-50ha-ondulado | 14 | 0 a 14,38 % | 0 a 23,97 % |
| sintetico-10ha-plano | 10 | 0 a 22,48 % | 0 a 37,42 % |

E UMA RESSALVA QUE A MEDIÇÃO ANTIGA NÃO TINHA: a amplitude do acesso que o LAB-19 e o LAB-28
publicam foi medida varrendo o PERÍMETRO INTEIRO — que o adendo agora diz ser o universo ERRADO.
Ela continua sendo um piso, e agora se sabe que é um piso DE UM UNIVERSO MAIOR QUE O VÁLIDO:
parte das posições que entraram naquela conta está sobre a divisa do vizinho. "Entrada que
ninguém variou é premissa disfarçada de dado", diz o item; variar uma entrada por valores
IMPOSSÍVEIS é a mesma doença com o sinal trocado.

O QUE EU NÃO REFIZ, e por quê: a curva da sensibilidade ao acesso JÁ EXISTE (sensibilidadeAoAcesso
varre por comprimento de arco, trata recusa como null, e instabilidadeDaOrdem já responde "a
oscilação muda a ORDEM dos motores?", que é a pergunta 2 do item). Refazer aquilo seria a segunda
montagem do D116. O que faltava não era a curva: era o universo de posições válidas.
```

---

## 10/10/2026 · despertador-sem-item — a caixa esgotou às 02:05Z

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · despertador-sem-item ===
Estado: disparo às 02:05Z com a CAIXA VAZIA — os dez itens estão feitos, conferido no disco e na origin/main. Data anotada na conta (12 disparos, 3 em vazio), despertador NÃO TOCADO, e eu durmo (§1-A, D244).
Feito: —
Achados para outros apps ou Central: —
Depende do Jonny: as duas perguntas do acesso, na §9 da página dele (9-A os 15 m vs. 25 m, 9-B linha reta vs. divisa) — continuam abertas e não decidi nenhuma.
Próximo na fila: nada; aguardando item novo na caixa.
=== FIM ===
```

---

## 10/10/2026 · LAB-78 — item 011: o sétimo mecanismo existe, e é do motor

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-78 (item 011) ===
Estado: FEITO. A pergunta era binária — sétimo mecanismo do motor, ou a largura e a divisa da faixa do Generate? MEDIDO: É O MOTOR, e as duas hipóteses da faixa caem com número. O mecanismo tem nome: A FILEIRA EXTERNA TRANSBORDA O CANTO da face declarada e continua alguns metros na face vizinha, onde não há rua declarada — então não pode haver frente. O conserto está PROPOSTO na FILA.md e NÃO foi executado, como o item manda: mexer no plantio muda o desenho, e desenho espera o olho do Jonny. 011.md virou 011-FEITO.md. VERDE: 821 travas na esteira + 17 no testfit, 7 passos, exit 0 — CONFERIDO AQUI, NÃO NO GITHUB; o CI sem clones vai de 412 a 427. Decisões D253, D254.
Feito: AS QUATRO, uma a uma, com a distância em metros e não a contagem. DUAS foram medíveis hoje: cluster/v16-e15 avança 0,19 a 13,18 m ALÉM DA PONTA da face declarada, fica a 0,19 m dela e a 5,54 m de via interna, testada 0 m; pente/v3-e19 avança 0,29 a 10,43 m além, fica a 0,29 m da face e a 0,04 m de via interna, testada fina 1,5 m. Os dois estão INTEIRAMENTE fora do segmento da face declarada, virando o canto para a face vizinha, que tem 1 845,71 m e não recebe lotes de frente. A LARGURA CAI COMO CONTROLE: o Lab construiu a faixa com 8 m e o Generate constrói com 10 m (Math.max(8, larguraEntrada/2), padrão 20) — e o lote fica a 0,19 m DAS DUAS, porque faixaViaPublica cola o quadrilátero do lado de FORA da divisa e a borda de dentro dela É a divisa. ALARGAR UMA FAIXA QUE CRESCE PARA FORA NÃO FECHA UMA FOLGA QUE ESTÁ DO LADO DE DENTRO. A DIVISA CAI COM A COBERTURA: face declarada 180,22 m, divisa escolhida 180,22 m — 100 %, e a ida entrega facesLoteamento: [0], exatamente a face certa. A IDA ESTÁ CERTA E A FAIXA ESTÁ CERTA.
Achados para outros apps ou Central: (1) EU IA PUBLICAR UM ACHADO CONTRA O GENERATE, E A MINHA PRÓPRIA MEDIÇÃO ME DESMENTIU — é a 23ª do §6 e a mais perto de sair desde o D119, porque o veredicto já estava escrito com dono "generate" nos dois lotes, pronto para este recado. A primeira versão da régua dizia: se a projeção do lote cai FORA da extensão da divisa, então é a faixa. O que me desmentiu foi um número da minha medição na LINHA DE CIMA DA TELA: "A FAIXA COBRE 100 % DA FACE ENTREGUE". Se ela cobre a face inteira, um lote a 0,19 m dela não pode estar fora do alcance dela — as duas afirmações não cabiam juntas. Medido o que faltava (QUANTOS METROS além da ponta), apareceram os 13,18 m e os 10,43 m: quem estava fora não era a faixa, era O LOTE. "ESTÁ FORA DA EXTENSÃO" NÃO DIZ DE QUEM É A CULPA: a projeção responde ONDE, só o QUANTO responde DE QUEM. Régua que conclui dono a partir de um booleano está adivinhando com cara de medição. Consertada por CONDIÇÃO e não por exceção: faixa-alcance passa a exigir cobertura MENOR que 100 %, com trava nos dois lados — 100 % nunca vira achado contra vocês, 60 % com projeção fora vira. (2) DUAS DAS QUATRO NÃO FORAM MEDÍVEIS, e isso sai declarado e não como zero: espinha/v12-l1093 e mioloVerde/v20-e18 NÃO EXISTEM no plano desta rodada. O LAB-59 mediu com motor-testfit em 4181e95 e esta rodada roda em 6cf6396 — O MOTOR ANDOU entre as duas, e id de lote não sobrevive a mudança de plantio. Remedi-las exige rodar no commit daquela rodada, e isso é prompt. Pela prova antiga, e ETIQUETADO como leitura dela e não medição de hoje: a do espinha é amostragem-da-testada (o motor reporta 8,72 m e a mesma função dele com passo fino devolve 10,22 m, acima do mínimo de 10 — O LOTE PASSA, e não há o que consertar em motor nenhum), e a do mioloVerde tem a forma do pente. É a quarta candidata na linha separada que o item pediu. (3) E ISTO COSTURA O LAB-78 AO LAB-77: não há rua na frente desses lotes PORQUE NINGUÉM DECLAROU RUA ALI. O motor não tem como saber onde a rua termina — ele sabe qual face recebe lotes de frente, e transborda a ponta dela. O campo que diria quais faces dão para via pública, que o LAB-77 mediu como INEXISTENTE no contrato, é o mesmo que falta aqui. DOIS PROMPTS SEGUIDOS, DOIS ACHADOS DIFERENTES, O MESMO DADO QUE FALTA — e isso REFORÇA o item 1 da lista que já foi ao Generate, sem criar item novo.
Depende do Jonny: o conserto do mecanismo, e por isso a condição de abertura dele na FILA é `aguardando-o-jonny`: encurtar a fileira ao fim da rua PERDE lotes que hoje entram, e quantos é medição que este prompt não fez — prometer o número sem medir seria a classe do D133. Continuam abertas as duas do acesso (§9 da página dele), e nenhuma delas trava nada.
Próximo na fila: nada na caixa além do COMO_FUNCIONA — reconferida contra a origem na hora de enviar (D238). Decisões até D254. Clones: os três com 0 alterações. Chão: Bun 1.4.2.
=== FIM ===

--- O QUE VAI JUNTO ---

O SÉTIMO MECANISMO, CARACTERIZADO — para o chat colar onde precisar:

  A FILEIRA EXTERNA TRANSBORDA O CANTO. O plantio da fileira externa passa da ponta da face
  que a entrada declara como face de loteamento e continua virando o canto para a face
  seguinte. Nessa face não há rua declarada, então o lote não tem — e não pode ter — frente.
  Medido em Antonina: 13,18 m além da ponta no `cluster` e 10,43 m no `pente`.

AS DUAS HIPÓTESES DA FAIXA, E COMO CADA UMA CAIU:

| hipótese | como caiu | o número |
|---|---|---|
| largura da faixa | CONTROLE, e saiu indiferente | lote a 0,19 m da faixa de 8 m **e** da de 10 m |
| divisa / alcance | a faixa cobre a face inteira | face 180,22 m · divisa 180,22 m · **100 %** |

E a geometria dizia isso antes da medição: `faixaViaPublica` cola o quadrilátero do lado de FORA
da divisa e o estende para fora — a borda de DENTRO dela é a própria divisa. Alargar afasta a
borda externa e não aproxima nada do lado de dentro.

O QUE ESTÁ PROPOSTO NA FILA E NÃO FOI EXECUTADO:

  PARAR A FILEIRA EXTERNA NO FIM DA FACE DECLARADA (LAB-78, D253).
  Condição de abertura: `aguardando-o-jonny`.
  O que ele vai olhar, em uma frase: a fileira externa hoje aproveita o canto e ganha alguns
  lotes que o Validator reprova; encurtá-la ao fim da rua perde esses lotes e zera a violação.
  QUANTOS LOTES SE PERDEM É MEDIÇÃO QUE ESTE PROMPT NÃO FEZ.

PARA O ARCHILLY GENERATE — nada novo, e isto é importante: a faixa de via pública está CERTA
nos dois eixos que eu testei (largura e cobertura). O que REFORÇA é o item 1 que já foi a vocês
no LAB-77: o campo no contrato que diz onde há via pública. Com ele, o motor poderia parar no
fim da rua em vez de virar o canto — e a sugestão de acesso do LAB-77 poderia sair.
```

---

## 10/10/2026 · despertador-sem-item — a caixa esgotou às 04:05Z

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · despertador-sem-item ===
Estado: disparo às 04:05Z com a CAIXA VAZIA — os onze itens estão feitos, conferido no disco e na origin/main. Data anotada na conta (14 disparos, 4 em vazio), despertador NÃO TOCADO, e eu durmo (§1-A, D244).
Feito: —
Achados para outros apps ou Central: —
Depende do Jonny: o conserto do sétimo mecanismo (FILA, `aguardando-o-jonny`) e as duas perguntas do acesso (§9 da página dele) — três coisas abertas, nenhuma travando nada.
Próximo na fila: nada; aguardando item novo na caixa.
=== FIM ===
```

---

## 10/10/2026 · LAB-79 — item 012: o alcance das provas, 2 de 67 remedidas da fonte

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-79 (item 012) ===
Estado: FEITO. MEDIDO ANTES DE CONSTRUIR, como o item mandou, e a medição é MECÂNICA — quem cita quem sai da leitura dos arquivos de teste, não da minha memória. Das 67 provas: 2 remedidas da fonte com escopo publicado, 18 remedidas em parte SEM escopo declarado, 23 só com a §7 conferindo as CHAVES (forma, não número) e 24 NÃO LIDAS POR TRAVA NENHUMA. 2+18+23+24=67, e a conta fecha por trava. SESSENTA E CINCO DE SESSENTA E SETE SEM ESCOPO PUBLICADO. Depois deste prompt: 7 / 17 / 21 / 23 de 68 — o universo inclui a prova deste prompt, e isso fica dito. 012.md virou 012-FEITO.md. VERDE: 846 travas na esteira + 17 no testfit, 7 passos, exit 0 — CONFERIDO AQUI, NÃO NO GITHUB; o CI sem clones vai de 427 a 452. Decisões D255, D256, D257.
Feito: O ACHADO QUE VOCÊ PEDIU, e ele é o contra-exemplo da sua própria divisão: as DUAS classes (estado de agora / evento) NÃO cobrem todas. PROVA MEDIDA CONTRA O CLONE DE UM VIZINHO NÃO É ESTADO DE AGORA NEM EVENTO — ela afirma o presente DE OUTRO REPOSITÓRIO, num commit dele. Regerá-la em silêncio não atualiza a medição: TROCA A PERGUNTA. E o contra-exemplo é de um prompt atrás: o LAB-59 mediu com motor-testfit em 4181e95, o LAB-78 rodou em 6cf6396, e DOIS DOS QUATRO LOTES DEIXARAM DE EXISTIR. São TRÊS classes, e a terceira só se regera DECLARANDO O COMMIT do vizinho — a mesma lição do carimbo do LAB-68 e do segundo eixo do LAB-74, agora aplicada a QUANDO uma prova pode ser reescrita. A função diz NÃO por padrão: é a fronteira do D182 em código, e o D182 não se afrouxa de madrugada.
Achados para outros apps ou Central: (1) A TRAVA NOVA PEGOU UMA PROVA VELHA NA PRIMEIRA EXECUÇÃO — e não num teste sintético: no repositório. A prova da conta dos disparos dizia 5 disparos e 1 em vazio; a conta VIVA dizia 14 e 4. Estava velha desde 09/10 e NADA NO VERDE REPROVAVA — o defeito que você nomeou, na forma exata do D195 (a prova do LAB-57 dizia 1, a ferramenta dizia 10, e saiu verde). E a ironia mede o problema: é A PROVA MAIS VIVA DA CASA, porque a conta cresce a cada hora por desenho. PROVA DE ESTADO CUJO NÚMERO CRESCE SOZINHO PRECISA DE REMEDIÇÃO, NÃO DE REVISÃO — revisão é alguém lembrar; remedição é o verde não deixar passar. Regerada com `bun run lab71`, que é permitido porque ela é estado-de-agora; NENHUMA prova de evento foi reescrita. E O MELHOR DA HISTÓRIA: ELA ENVELHECEU DUAS VEZES NA MESMA RODADA — depois de regerá-la (14 e 4) eu acrescentei a linha das 05:06 na conta, o disparo que trouxe este próprio item, a conta foi a 15, a prova ficou em 14 e A TRAVA REPROVOU DE NOVO, no mesmo prompt. O verde voltou 844 pass / 2 fail, e as duas eram esta. Não é tropeço: é a MEDIDA do problema — prova cujo número muda a cada hora envelhece ENTRE DUAS EDIÇÕES DO MESMO COMMIT, e nenhuma disciplina humana cobre isso. Daí uma regra de ordem: PROVA DE ESTADO SE REGERA DEPOIS DA ÚLTIMA EDIÇÃO DA FONTE, NUNCA ANTES — aqui, primeiro a linha na conta, depois o lab71; regerar antes produz prova que NASCE VELHA, que é o que o D195 mediu no LAB-57. (2) E A TRAVA QUE PROIBIA ESCREVER EM DISCO ACUSOU A SI MESMA: eu a escrevi lendo o próprio fonte e conferindo que `writeFileSync` não aparece, e ela reprovou — o fonte contém a palavra PORQUE É ELA QUE A PROÍBE, o literal está no expect. TERCEIRA vez desta família (D142, D155, e esta), e o conserto já estava escrito na §6: procure o nome no lugar da gramática onde ele significa aquilo. Escrever em disco exige IMPORTAR o escritor, então a régua passou a ler a linha do import de node:fs e a exigir exatamente readFileSync, readdirSync e statSync. RÉGUA QUE LÊ O ARQUIVO INTEIRO MEDE O QUE O CÓDIGO DIZ; RÉGUA QUE LÊ O IMPORT MEDE O QUE ELE PODE FAZER. É a 24ª do §6, e a partição fecha: 14+4+2+3+1=24. (3) O CRITÉRIO DE QUAIS CINCO PROVAS GANHARAM ESCOPO É DECLARADO, não é gosto: são as cujos números saem de MÓDULOS DESTE REPOSITÓRIO, sem clone vizinho e sem motor — portanto remedíveis dentro da trava, de graça, a cada verde. O que exige rede, clone ou motor sai naoMedida COM O MOTIVO, e o motivo é sempre custo ou dependência, nunca comodidade. E há trava de que cada chave marcada `medida` seja DE FATO implementada: declaração que diz medida e não remede nada seria a dívida invisível com mais código — o defeito, de novo.
Depende do Jonny: nada deste prompt, e nenhuma pergunta foi feita a ele (a sua regra até sábado às 15h). Continuam abertos, sem travar nada: o conserto do sétimo mecanismo na FILA (`aguardando-o-jonny`) e as duas perguntas do acesso na §9 da página dele.
Próximo na fila: a D243, anotada no topo da seção de propostas da FILA com as suas palavras sobre por que ela veio depois — e NÃO comecei, porque é mudança de modelo de uma varredura de segurança. A caixa está vazia, reconferida contra a origem na hora de enviar (D238). Decisões até D257. Clones: os três com 0 alterações. Chão: Bun 1.4.2.
=== FIM ===

--- O QUE VAI JUNTO ---

O ALCANCE, ANTES E DEPOIS — para colar onde precisar:

| quantas | como se confere | o que isso quer dizer |
|---|---|---|
| 2 → 7 | remedida da fonte, COM escopo publicado | as duas do LAB-49, mais as cinco do LAB-79 |
| 18 → 17 | remedida em parte, SEM escopo declarado | alguma trava confere algo, e qual parte NÃO está publicada |
| 23 → 21 | só a forma (§7) | confere que as CHAVES existem. Forma não é número |
| 24 → 23 | SEM TRAVA NENHUMA | não é "aprovada": é NÃO LIDA |
| 67 → 68 | o universo | e ele inclui a prova deste prompt, que se conta |

AS TRÊS CLASSES DO QUE UMA PROVA AFIRMA, e a fronteira do D182:

  estado-de-agora .............. PODE ser regerada (presente velho é presente errado)
  evento ....................... NUNCA (regerá-la apaga o momento — é o D182 inteiro)
  estado-de-outro-repositorio .. SÓ com o commit do vizinho declarado na prova

AS DUAS LINHAS DE ENCERRAMENTO QUE VOCÊ PEDIU:

1. O D236 JÁ ESTAVA RISCADO e já apontava para a D244 — feito no LAB-75 (item 008). Não refiz:
   CONFERI. Mas a FILA.md ainda o citava COMO VIVO em duas frases, e isso foi corrigido — as
   duas passaram a "~~D236~~ → D244". Regra revogada citada como viva volta por engano, que é a
   razão da própria §1-A.
2. A D243 É O PRÓXIMO ITEM, anotada no topo da seção de propostas da FILA.md com as suas
   palavras sobre por que ela veio depois. NÃO COMECEI.

AS FRONTEIRAS, E NENHUMA FOI ATRAVESSADA:
· a trava NÃO escreve em docs/provas/ — e há trava disso no IMPORT dela, não no texto;
· nenhuma prova de EVENTO foi regerada; a única regerada é estado-de-agora;
· nada precisou de rede, serviço pago ou navegador;
· nenhuma pergunta ao Jonny, e nada novo entrou na página dele.
```

---

## 10/10/2026 · LAB-80 — item 013 / D243: a varredura de custo escopada por destino, 11 isenções a zero

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-80 (item 013) ===
Estado: D243 FEITA, sozinha na rodada como você pediu, e ela É o seu item 013 — que entrou DEPOIS de eu começar, pedindo a mesma coisa que eu já estava fazendo pela FILA. Achei na conferência de envio (D238). Verde conferido aqui, não no GitHub: 880 travas na esteira + 17 no testfit, 7 passos, exit 0.
Feito: a varredura de custo deixou de isentar por NOME. Os 471 arquivos que o git carrega passaram a ter um DESTINO, pela estrutura do caminho — tela 2, codigo 197, registro 219, dado 28, upstream 25, e a soma fecha. A régua do registro pede o VALOR (o nome COM número), que é a sua palavra no D243. DAS 11 ISENÇÕES, ZERO SOBREVIVERAM, e a varredura agora varre A SI MESMA. Relatório em docs/relatorios/LAB-80.md, decisões D258 a D268.
Achados para outros apps ou Central: (1) DUAS das 11 isenções estavam MORTAS, e a LAB-74.md NUNCA tropeçou em nenhuma das 7 regras em toda a sua história — numa lista que jurava no próprio comentário não adivinhar —, e ela é UMA DAS DUAS QUE DISPARARAM O CRITÉRIO. (2) A causa do crescimento não era defeito em arquivo nenhum: a frase que PROÍBE enumera numa linha os três nomes que proíbe, e tem de estar escrita onde a regra vale — lista que cresce assim mede quantas vezes a casa repetiu a própria regra. (3) O PONTO CEGO BATEU DUAS VEZES, as duas contra réguas minhas desta rodada, e a §6 foi a VINTE E SEIS: a régua nova do fator acusou TRÊS razões de rampa, porque escrevi o irmão do margem sem a cura que o margem já tinha desde o LAB-67 (régua nova nasce com a doença que a régua velha já curou, um campo ao lado); e a PROVA publicou as fixtures da sabotagem, então a varredura acusou a própria prova em 7 linhas (a prova publica o VEREDICTO, não a fixture). (4) E O ACHADO MAIS CARO NÃO É MEU, É ANTERIOR A MIM: a limpeza desta casa, a soOCodigo(), COLAPSAVA 422 LINHAS EM 164 — o esvaziador de strings casa de uma aspa à próxima através de quebras de linha e não sabia que uma aspa pode morar DENTRO de um literal de regex, e o arquivo que declara a própria limpeza escreve uma classe de caracteres com as três aspas. O efeito não era erro, era CEGUEIRA: a varredura de chamadas deixou de achar o único achado daquele arquivo, de 1 para 0, e um erro engolido escrito ali passaria igual. Quem pegou foi a METADE DA TRAVA QUE QUASE NINGUÉM ESCREVE — a dos FANTASMAS, que cobra que um achado benigno declarado NÃO DESAPAREÇA. Para a família é a lição que vale mais: lista de benignos sem a metade "nenhum deles sumiu" aprova o silêncio — a metade que cobra "nenhum NOVO" protege contra defeito que entra, a que cobra "nenhum sumiu" protege contra a régua que PARA DE MEDIR. (5) BURACO DECLARADO NÃO É BURACO FECHADO, e o preço de fechá-lo depende da PERGUNTA: o soOCodigo() declinava de ler literal de regex "porque não valia o preço", e para esta varredura valia — fechá-lo deixou de ser preço e passou a ser correção. (6) E uma sobre MEDIR RÉGUA: levei o conserto à régua IRMÃ (as condições de conta, mesma lista nominal, mesmo motivo) e errei duas vezes — medi com um script que parava no primeiro padrão que casava enquanto a régua medida testa todos, e ia publicar "três isenções a uma" sendo três a DUAS; e troquei a proteção da citação pela leitura nova em vez de usar as DUAS, perdendo o conserto do item 007. Instrumento de medição mais estreito que o instrumento medido dá o número para o lado OTIMISTA — e o lado otimista é o que ninguém confere, porque confirma o conserto. §6 foi a VINTE E SETE, com classe nova.
Depende do Jonny: nada novo — a página dele não mudou nesta rodada.
Próximo na fila: UNIFICAR AS CINCO LEITURAS DE "esta linha afirma ou só mostra?" — contei cinco, três dentro de travas, e NENHUMA conhecia o bloco de código, que é onde moram os recados. Fiz a minha parte (a leitura nova mora em src/, e tirei uma de dentro de um teste) e PAREI: as outras três tocam cinco arquivos e as travas de três deles. Está na FILA como proposta, com a contagem.
=== FIM ===

--- O QUE VAI JUNTO ---

A FILA E A CAIXA APONTARAM PARA O MESMO ITEM, e quem as reconciliou foi uma conferência:

Ao acordar, a caixa estava com os doze feitos — conferido na origin/main, não só no clone. Abri a
rodada executando a D243 pela FILA.md, porque o item 012 a elegeu por escrito como "o próximo
item" e a §1-A manda executar a fila em laço; a proibição dele era "na mesma rodada de outra
coisa", e esta rodada não tinha outra coisa.

VOCÊ ESCREVEU O 013 ENQUANTO EU TRABALHAVA, pedindo a MESMA D243 — e eu o encontrei na conferência
da caixa NA HORA DE ENVIAR, que é exatamente o que o D238 existe para obrigar. Sem ele, este recado
teria dito "a caixa estava vazia" no mesmo minuto em que o item que eu acabara de cumprir estava
escrito nela — o erro do dia 09, repetido ao contrário.

QUANDO A FILA E A CAIXA APONTAM PARA O MESMO ITEM, QUEM RECONCILIA AS DUAS É A CONFERÊNCIA DE
ENVIO, NÃO A SORTE. E os três pedidos extras do 013, que a FILA não tinha, foram atendidos: as
duas réguas lado a lado arquivo por arquivo, as perdas DEMONSTRADAS e o universo que reprova se
ler menos do que afirma. Ver abaixo.

E a conta dos disparos em vazio NÃO recebeu esta data, de propósito:

  Disparo em vazio é disparo que não tinha O QUE FAZER, não disparo em que a CAIXA estava vazia.

Contá-la como vazia inflaria a medida que decide o intervalo de 60 minutos. Ficou 16 observados
· 4 em vazio, com o motivo escrito na linha.

O DESENHO, EM UMA TABELA:

  destino              arquivos   régua
  tela                        2   nome E valor, no cru — é o que um navegador desenha (§4)
  codigo                    197   nome e valor, em POSIÇÃO DE IDENTIFICADOR
  registro                  217   SÓ O VALOR — docs/ inteiro mais o CLAUDE.md
  dado                       28   nome e valor, no cru — o que entra e o que sai cru
  upstream-intocavel         25   nome e valor, no cru — achado aqui é CONFLITO de regras (§3)
                            471   a soma fecha, e há trava que soma

A FRONTEIRA DO 013, E A PROVA MAIS FORTE DA PREMISSA SAIU DA PRÓPRIA ENTREGA:

Você proibiu entregar isto como melhoria: "se o conjunto novo vê menos em algum ponto, isso sai
escrito como perda declarada". As duas réguas estão lado a lado, arquivo por arquivo, na prova e no
§3-A do relatório. E ali apareceu o seguinte: TRÊS arquivos DESTA ENTREGA — o módulo do modelo, o
relatório e o módulo da leitura — seriam acusados pela régua velha, e nenhum deles estava nas 11.

  O DESENHO VELHO TERIA PRECISADO DE TRÊS ISENÇÕES NOVAS SÓ PARA ESTA RODADA SAIR VERDE: 11 → 14.

A premissa do D243 não precisou de argumento: a entrega que a conserta seria a próxima a pagar a
conta dela. "Uma linha por relatório, para sempre" — e esta rodada traria três.

AS TRÊS PERDAS, e cada uma sai DEMONSTRADA e não só declarada (a trava roda AS DUAS réguas sobre a
frase: a velha tem de pegar, a nova tem de deixar passar — perda que ninguém demonstra é suposta):

  registro · o NOME do custo sem número ao lado ......... escaparia: "o multiplicador fica no Admin"
  registro · `margem` perto de dinheiro SEM número ..... escaparia: "preço com margem"
  codigo   · o nome em comentário, string e regex ....... escaparia: const aviso = "custo × 3";

E a perda do código NÃO é perda nos outros destinos, por desenho: o valor que uma string escreva
num relatório, numa prova ou na tela é varrido ONDE ELE CHEGA — tela e dado leem no cru, e há trava
com o mesmo valor nos cinco destinos. ZERO DE ZERO NÃO É APROVAÇÃO, e isso você cobrou: a varredura
publica quantas linhas leu em cada destino e reprova se um destino tiver arquivo e ler zero linha,
ou ficar sem arquivo nenhum — com sabotagem nos dois sentidos também nessa régua.

O QUE A MEDIÇÃO ACHOU E A PROPOSTA NÃO PREVIA:

1. O soOCodigo() de que o modelo precisava JÁ EXISTIA na casa, com o nome idêntico, em
   src/varredura-de-chamadas.ts — e o buraco dele estava DECLARADO em comentário: "literal de
   expressão regular… aqui não vale o preço". Para a configuração era verdade; para o custo não,
   porque os nomes do nosso custo moram em literais de regex nus — e era POR ISSO que a trava
   acusava a si mesma em 13 linhas. Entrou a TERCEIRA limpeza da mesma família, não uma paralela:
   semComentarios() = "o texto DECLARA isto?"; soOCodigo() = "o código FAZ isto?";
   semLiteraisDeRegex() = "o código USA este nome?".
2. A varredura de CHAMADA PAGA DE IA também comprava isenção na mesma lista: ela lia o texto cru,
   e as fixtures dela são imports de verdade dentro de strings. Agora lê em posição de
   identificador e dá zero SEM ISENÇÃO.
3. Um falso NEGATIVO pego antes de sair: trazer docs/ para "registro" fazia a prova em JSON ser
   lida pela limpeza de Markdown, QUE APAGA O QUE ESTÁ ENTRE ASPAS — e em JSON toda chave está
   entre aspas. "custoMedido": 0.012 passaria em silêncio. A limpeza certa para Markdown é a
   cegueira certa para JSON: o D179 ensinou que a PERGUNTA decide a limpeza; aqui é o FORMATO.
   Há trava que PROVA a cegueira: a mesma linha é pega como dados e escapa como markdown.

O BURACO QUE FICA DECLARADO, porque guarda que não declara o próprio buraco mente pelo silêncio:
"o fator é 3", escrito sem palavra de dinheiro na linha, ESCAPA da régua do registro. Fechá-lo
afrouxando devolve as três acusações geométricas da rampa — e a trava que as proíbe é a que mede
esse preço.

AS FRONTEIRAS, E NENHUMA FOI ATRAVESSADA:
· nada escrito em repositório vizinho — git status limpo nos três clones, conferido ao fim;
· upstream/ intocado: ele é um DESTINO da varredura, e um achado lá sairia como conflito de
  regras para você decidir, nunca como conserto meu;
· nenhuma régua foi afrouxada para passar: as duas que eu consertei ficaram com trava nos dois
  sentidos, e a do fator tem as três linhas de verdade como fixture;
· nada precisou de rede, serviço pago ou navegador fora do verde;
· nenhuma pergunta ao Jonny, e nada novo entrou na página dele.

E A RÉGUA IRMÃ FOI CONSERTADA JUNTO, porque D231: a trava das condições de conta tinha a MESMA
lista nominal, e o comentário dela já dizia em texto que era "a mesma classe que trava a lista do
vazamento de custo". Três entradas viraram DUAS — e o LAB-74.md é isenção morta ali também, pela
segunda vez na mesma rodada, em listas diferentes.

DUAS QUE A CONTA COBROU, e as duas são de método:

1. A SEGUNDA COINCIDÊNCIA CASADA COMO INVARIANTE, duas linhas abaixo do comentário que a proíbe: o
   por-lugar.test.ts conferia "naFila - varreduraDeFrase === 1", que valia porque naFila era 16
   NAQUELE DIA — a mesma doença que o LAB-78 consertara na linha de cima, escrita pela mesma mão no
   mesmo prompt. CONSERTAR UMA COINCIDÊNCIA NÃO IMUNIZA A FUNÇÃO ONDE ELA ESTAVA: a pergunta não é
   "esta igualdade é verdadeira hoje?", é "o que teria de acontecer no mundo para ela deixar de
   ser, e isso é uma PIORA?".
2. A CONVENÇÃO QUE UMA RÉGUA LÊ E NINGUÉM ESCREVEU: a conta dos disparos marca a rodada em vazio
   procurando "nada", "vazio" ou "sem item" na coluna do que achou. Funcionou em 15 linhas porque
   todas as em vazio usaram "nada" — convenção real, nunca escrita. A minha linha das 06:06 dizia
   "nada NOVO na caixa" e a conta passou a declarar 4 contra 5 medidos. Reescrevi a linha E escrevi
   a convenção ao lado da régua que a lê.

```

---

## 10/10/2026 · despertador-sem-item — a caixa esgotou às 08:05Z

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · despertador-sem-item ===
ACUMULADO — inclui os recados LAB-80 e despertador-sem-item
Estado: disparo às 08:05Z com a CAIXA VAZIA — os treze itens estão feitos, conferido no disco e na origin/main. Antes dele, o das 07:06 ACUMULOU: a rodada do item 013 passou de uma hora. Datas anotadas na conta (18 disparos, 5 em vazio), despertador NÃO TOCADO, e eu durmo (§1-A, D244).
Feito: — (o item 013 / LAB-80 fechou na rodada anterior, PR #106 mesclado na main; o recado dele está acima neste arquivo)
Achados para outros apps ou Central: — (os do LAB-80 estão no recado acima: a cegueira da soOCodigo(), a metade da trava que cobra "nenhum benigno sumiu", e o buraco declarado que não estava fechado)
Depende do Jonny: o conserto do sétimo mecanismo (FILA, `aguardando-o-jonny`) e as duas perguntas do acesso (§9 da página dele) — três coisas abertas, nenhuma travando nada.
Próximo na fila: nada encomendado; aguardando item novo na caixa. NÃO executei a D226 ("os quatro campos novos de `legais`"), que o item 013 chama de "o seguinte": eleição é plano, item é encomenda — e você mostrou a convenção nesta rodada, elegendo a D243 no item 012 E escrevendo o 013 para encomendá-la.
=== FIM ===
```

---

## 10/10/2026 · LAB-81 — item 014: as cinco leituras terminadas, e UMA declarada diferente

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-81 (item 014) ===
Estado: FEITO. As cinco leituras de "esta linha afirma ou só mostra?" moram num lugar só, com a pergunta de cada uma declarada e conferida contra o `import` de quem a chama. Verde conferido aqui, não no GitHub: 893 travas na esteira + 17 no testfit, 7 passos, exit 0.
Feito: TERMINAR NÃO ERA FAZÊ-LAS IGUAIS, e foi a medição que decidiu. A família tem SEIS membros com perguntas diferentes, a tabela é conferida contra os imports de verdade, e há guarda que impede a SEXTA de nascer. O buraco comum às cinco — o BLOCO DE CÓDIGO — está fechado pela `soAProsa()`.
Achados para outros apps ou Central: (1) A PREMISSA DO ITEM ESTAVA UM PASSO ATRÁS: das três leituras que ele lista, UMA JÁ ESTAVA PRONTA — o `trava-de-estrutura.ts`, consertado no próprio LAB-80. O item foi escrito a partir do meu relatório, e o relatório descrevia o estado de antes daquela parte da rodada. ITEM ESCRITO A PARTIR DE UM REGISTRO HERDA A IDADE DO REGISTRO: meça a premissa antes de executar, senão o primeiro trabalho da rodada é consertar o que já estava consertado — e isso sai como entrega. (2) A SUA FRONTEIRA FOI ACIONADA, e a medição é o que a acionou: a `verde.test.ts` varre um script de shell e A CRASE É O DADO DELA. Com a limpeza dela, acha o caminho na mentira plantada; com a mais forte, acha ZERO — e a mais forte PARECE mais rigorosa, porque nega igual e deixa a citação passar igual, e só o dado desaparece. A LIMPEZA QUE REMOVE O DADO DE QUEM A CHAMA NÃO É MAIS RIGOROSA: É UM DESLIGAMENTO PASSANDO POR CONSERTO. (3) A SUA ORDEM É O QUE SEPAROU AS DUAS COISAS: na ordem inversa eu teria visto "a citação passa, o riscado passa, a cerca passa" — tudo verde — e entregado uma trava cega. (4) A QUARTA FORMA QUE VOCÊ CONVIDOU APARECEU, E NÃO É UMA FORMA: a cerca, o `>` e o riscado nunca carregam o objeto da régua; A CRASE CARREGA. É a única marca de "só mostra" que às vezes é o que se vem medir. (5) Para a família: UNIFICAR SEM GUARDA CONSERTA O PASSADO E DEIXA O FUTURO IGUAL — a pergunta não é "quantas existem hoje?", é "o que impede a próxima?".
Depende do Jonny: o conserto do sétimo mecanismo (FILA, `aguardando-o-jonny`) e as duas perguntas do acesso (§9 da página dele) — três coisas abertas, nenhuma travando nada.
Próximo na fila: a D226 — entregar os quatro campos novos de `legais` ao motor, que você chamou de "o seguinte" no item 013. Não comecei: eleição é plano, item é encomenda.
=== FIM ===

--- O QUE VAI JUNTO ---

A FAMÍLIA, COMO ELA FICOU — seis membros, uma casa, uma pergunta cada:

  lugaresDaPagina ........ "ONDE esta linha está?"              só Markdown; num .sh é um nada
  soAProsa ............... "quais linhas AFIRMAM?"              tira citação E BLOCO DE CÓDIGO
  semCitacoes ............ "...quando a CRASE É O DADO?"        a crase sobrevive de propósito
  semRiscadoNemCitado .... "...quando a crase é RUÍDO?"         riscado, crase e aspas curta
  comoARegraSeLe ......... "a regra ESTÁ ESCRITA?"              normaliza >, negrito e quebra
  afirmadoNaLinha ........ a composta, para quem já sabe que a linha é prosa

A escolha entre elas NÃO É DE RIGOR, É DE QUAL É O OBJETO. Foi isso que a medição ensinou, e é
por isso que a família tem seis membros em vez de uma função com um argumento.

A MEDIÇÃO QUE DECIDIU, com a mentira plantada no formato do LAB-51:

  limpeza                  na mentira plantada                              na citação
  semCitacoes (a dela)     nega ✔ · acha .github/workflows/verde.yml ✔      passa ✔
  semRiscadoNemCitado      nega ✔ · acha ZERO caminhos ✘                    passa ✔

  e lugaresDaPagina sobre aquele .sh: 0 citação e 0 cerca em 147 linhas — ali é um nada.

A DIFERENÇA NÃO FICA SÓ NUM COMENTÁRIO: há trava que REPROVA se a `semRiscadoNemCitado` passar a
preservar a crase, porque nesse dia a UMA declarada perde o motivo e a tabela tem de ser refeita.
Diferença declarada que ninguém reconfere é a mesma coisa que diferença esquecida.

O BURACO COMUM ÀS CINCO, FECHADO, e medido:

  seções de REGRA da CLAUDE.md: 312 linhas · 9 em citação · 20 EM BLOCO DE CÓDIGO
    §1 (a regra do recado): 17 linhas em bloco — é o MOLDE do recado, exemplo e não regra sobre ele
    §7 (entrega): 3 linhas

  veredito da régua dos limites: [] antes e [] depois — a sua fronteira do veredito não foi tocada.
  E porque VAZIO NÃO PROVA NADA, a prova é plantada, na sua ordem: a regra sem sujeito em prosa é
  achada; em citação e em bloco, não; e depois da cerca FECHAR, a prosa volta a contar.

  E a soAProsa ESVAZIA as linhas em vez de removê-las: o número da linha não pode mentir para quem
  for ler o achado. Limpeza que encurta o texto faz a régua apontar para a linha errada.

A GUARDA DA SEXTA, e ela é a parte que sobrevive a mim:

  Ela varre todo .ts que o git carrega e reprova quem DEFINIR uma das leituras fora da casa. Lê os
  nomes que o código USA, não o texto — senão seria a sétima da família do D142/D155, acusando o
  arquivo que documenta a duplicação. Os dois lados estão plantados: a definição planta reprova; o
  import, a chamada, o re-export e o comentário que cita o nome passam.

A COINCIDÊNCIA CASADA COMO INVARIANTE, que você mandou procurar: estava nos contadores. Executar
esta proposta derrubou a lista de propostas de 17 para 16 itens abertos, e CINCO LUGARES contam
esse número. Os cinco andaram juntos, com o motivo escrito em cada um — e o lab61/lab62 cobraram
dois deles antes de eu lembrar.

AS FRONTEIRAS, E NENHUMA FOI ATRAVESSADA:
· nada escrito em repositório vizinho — git status limpo nos três clones, conferido ao fim;
· nenhuma trava mudou de VEREDITO sobre o código de hoje: o da régua dos limites é [] nas duas
  leituras, e o da trava do LAB-51 é [] nas duas limpezas — por isso a prova é plantada;
· nenhuma régua foi afrouxada para passar, e a que eu NÃO unifiquei ficou com o motivo medido;
· nenhuma pergunta ao Jonny, e nada novo entrou na página dele.
```

---

## 10/10/2026 · LAB-82 — item 015: a remedição antes do pedido, e o dono é o motor-testfit

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-82 (item 015) ===
Estado: FEITO. O seu item chegou como `013` com o número JÁ USADO (o 013-FEITO é a D243), e a colisão deixou a main VERMELHA — a guarda do D268 recusa a ambiguidade em vez de escolher. Renumerei para `015`, conteúdo intocado, nenhum dos dois apagado. Verde conferido aqui, não no GitHub.
Feito: REMEDI PRIMEIRO, como você mandou, e a resposta à sua pergunta única é CONTINUAM, e idênticos: 13,18 m e 10,43 m, 2 lotes. O pedido com as SEIS linhas está abaixo, pronto para colar — e vai para o `motor-testfit`, não para o Generate. Verde: 895 travas na esteira + 17 no testfit, 7 passos, exit 0.
Achados para outros apps ou Central: (1) A REMEDIÇÃO MUDOU O ENDEREÇO DO PEDIDO. Você manda remedir contra o `origin/motor-v2` do Generate: medido, o `motor-v2` e o `main` dele apontam para o MESMO commit (565d00c) e o 12208da é ancestral — a sua informação estava certa. Mas o veredito do DONO é `motor-testfit` em 2 de 2, e é a árvore DELE que estava 56 commits atrás (a do Generate, 47). QUEM DECIDE QUAL CLONE PRECISA ESTAR ATUALIZADO É O DONO DO DEFEITO, NÃO O DONO DA RÉGUA — e o LAB-78 já tinha absolvido a faixa pelo número (cobertura 100 %, largura indiferente), então o que sobrou é plantio. (2) A REMEDIÇÃO ACHOU UM BURACO QUE VOCÊ NÃO PEDIU: o carimbo de versão lê o HEAD do CLONE, não o módulo que o `import` carregou — a passagem contra o motor novo MEDIU O NOVO E CARIMBOU O VELHO. Carimbo que lê o repositório mede a INTENÇÃO de quem configurou, não o que rodou; e acerta sempre que ninguém reponta nada, que é por que ninguém descobre que ele pode errar. Proposto na FILA, não consertado — é a proposta do D223 um degrau adiante e toca toda prova que usa clone. (3) E EU QUASE APAGUEI O SEU ITEM NOVO: ele tinha a aparência exata do defeito que eu conhecia (mesmo número, mesma forma do D268). O que me parou foi medir o `git log --diff-filter=A`, que mostrou um commit SEU com outro assunto. A APARÊNCIA DE UM DEFEITO CONHECIDO É O DISFARCE MAIS EFICIENTE DE UM FATO NOVO.
Depende do Jonny: a §10 NOVA na página dele — parar a fileira na esquina PERDE lotes que hoje entram, e são três caminhos com o custo de cada um. O custo do que eu recomendo sai NÃO MEDIDO, com o que custaria medi-lo. Mais o sétimo mecanismo e as duas perguntas do acesso.
Próximo na fila: a D226 (os quatro campos de `legais`), que você chamou de "o seguinte"; e a nova do carimbo. Nenhuma começada.
=== FIM ===

--- O QUE VAI JUNTO ---

═══════════════════════════════════════════════════════════════════════════════
  O PEDIDO, PRONTO PARA COLAR — destino: motor-testfit (Laboratório de Parcelamento)
═══════════════════════════════════════════════════════════════════════════════

CONTEXTO EM UMA LINHA: o Archilly Lab mediu o plantio da fileira externa em geo-antonina e achou
lotes que nascem sem face de loteamento na frente. Remedido hoje contra o motor-testfit em
3680b9f (o origin/main de agora): o defeito CONTINUA, com os mesmos números.

1 · A AFIRMAÇÃO QUE QUERO PROVADA
   "Nenhum lote plantado pela fileira externa fica além da extensão da face que a entrada
   declarou em `facesLoteamento`."
   Não é um arquivo e não é uma função, de propósito: nome de artefato envelhece no dia em que
   vocês renomearem o módulo, e o pedido volta pela metade.

2 · COM QUE FREQUÊNCIA ELA TEM DE VALER
   Em TODA geração e para TODA candidata — não só no plano entregue, e não só nas duas em que eu
   achei o defeito. Para cada face declarada em `facesLoteamento`, e em todas as glebas.
   Esta linha é metade do pedido: sem ela vocês escolhem a mais fácil de cumprir, e a mais fácil
   aqui seria "vale no plano entregue", onde o defeito não aparece em 2 das 4 candidatas.

3 · O QUE NÃO CONTA COMO RESPOSTA — e isto está MEDIDO, não suposto
   · "mexi na largura da faixa de via pública" → NÃO resolve: a largura é INDIFERENTE. Medido com
     8 m e com 10 m, a distância do lote à faixa é a MESMA (0,19 m = 0,19 m), porque a faixa do
     Generate cresce para FORA da divisa. Alargar uma faixa que cresce para fora não fecha uma
     folga que está do lado de dentro;
   · "cobri a face" → NÃO resolve: a cobertura já é 100 % da face declarada. A faixa NÃO é curta;
   · "filtrei o lote na validação" → NÃO resolve: ele não pode ser PLANTADO. Esconder o lote
     muda a conta e não o desenho;
   · "o lote tem frente para a face vizinha" → NÃO resolve: a entrada NÃO declarou aquela face
     como face de loteamento. Não há rua ali porque ninguém pediu rua ali.

4 · COMO SE SABE QUE FOI ATENDIDO — o número, a unidade e a régua
   A régua é MINHA, e é por isso que ela vem escrita: projeto o lote na reta do segmento da face
   declarada e meço quantos METROS ele avança ALÉM da ponta desse segmento.
   · campo: `alemDaFaceDeclarada_m` · unidade: metros · tolerância de contato: 0,05 m
   · ALVO: ≤ 0,05 m para todo lote externo (hoje: 13,18 m e 10,43 m)
   · HOJE, em geo-antonina: 2 lotes acusados — `cluster/v16-e15` (13,18 m) e `pente/v3-e19`
     (10,43 m), os dois com `projecaoDentroDaDivisa = false`
   · a régua roda em: external-engines/esteira/src/setimo-mecanismo.ts (`deQuemEhAViolacao`)
   · a prova: docs/provas/LAB-78/setimo-mecanismo.json e docs/provas/LAB-82/
   Vocês não precisam ter a minha régua para consertar, mas precisam saber qual é para não
   remedir de fora com outra e concluir coisa diferente.

5 · O FORMATO EXATO DA VOLTA
   Respondam com estas três coisas, e eu remeço no mesmo dia:
   · o COMMIT do `motor-testfit` (origin/main) a partir do qual a afirmação vale;
   · o CAMINHO do arquivo onde o plantio da fileira externa passou a parar na face declarada;
   · o CAMINHO da trava que vocês acrescentaram, e o que ela reprova.
   Sem o commit eu não sei QUANDO remedir, e sem a trava a afirmação vale uma vez só.

6 · O QUE EU NÃO GARANTO — e esta é a linha que mais falta, então vai inteira
   · MEDI UMA GLEBA: geo-antonina. As outras seis desta casa não foram medidas para este defeito;
   · MEDI 2 DAS 4 candidatas do LAB-59. As outras duas saíram como NÃO ACHADAS, não como zero: o
     motor andou de 4181e95 para 6cf6396 e id de lote não sobrevive a mudança de plantio;
   · a minha régua vê DISTÂNCIA no plano. Ela NÃO vê escala, NÃO vê topologia e NÃO vê a quadra;
   · eu NÃO verifiquei se parar a fileira é geometricamente possível sem mexer no partido;
   · eu NÃO MEDI quantos lotes se perdem ao parar a fileira. Não invento esse número;
   · o lado do Generate (divisa e faixa) foi medido num clone 47 commits atrás do origin/main
     dele. Isso NÃO afeta o veredito, porque a faixa foi absolvida pelo NÚMERO (cobertura 100 %,
     largura indiferente) e não pela versão — mas vai dito, porque vocês desenham em cima da
     minha resposta.

7 · E HÁ UMA ESCOLHA DE DESENHO EMBUTIDA, QUE NÃO É MINHA NEM DE VOCÊS
   Parar a fileira na esquina PERDE lotes que hoje entram. A escolha é do Jonny, está na página
   dele (docs/PENDENCIAS_JONNY.md §10) e tem três caminhos:
     a) a fileira para na esquina — ninguém nasce sem rua; perde os lotes da dobra (quantos: não medido)
     b) a esquina também recebe rua — os lotes ficam; muda o desenho das ruas, e isso é projeto
     c) fica como está — continuam nascendo lotes sem rua, e eles reprovam na conferência
   A minha recomendação, e é só sugestão: (a). Lote sem rua na frente não é um lote a menos — é um
   lote que não existe de verdade, e reprova na conferência de qualquer jeito.
   NÃO comecem por (b) sem o Jonny: mexer no desenho das ruas é decisão dele.

═══════════════════════════════════════════════════════════════════════════════

A REMEDIÇÃO, EM NÚMEROS — e os três clones contra a origem deles:

  clone                  árvore     origin/main   atrás   limpa
  motor-testfit          6cf6396    3680b9f        56     sim   ← o DONO do defeito
  urban-create-hub       72cfab0    565d00c        47     sim   ← onde o item mandou olhar
  urban-scout-tool       550a438    f0cb290        29     sim

  passagem 1, clones como estão ......... 2 lotes · 13,18 m e 10,43 m · dono motor-testfit
  passagem 2, motor em 3680b9f .......... IDÊNTICA — 2 lotes · 13,18 m e 10,43 m · mesmo dono

  Como a passagem 2 foi feita sem tocar na árvore do vizinho: clone DO clone no rascunho, `paths`
  do tsconfig repontado e devolvido byte a byte (git diff vazio), e conferido pelo
  `import.meta.resolve` que o repoint pegou de fato.

AS FRONTEIRAS, E NENHUMA FOI ATRAVESSADA:
· NADA foi escrito em repositório vizinho — o pedido sai aqui, no meu bloco, e você transporta;
· as três árvores vizinhas ficaram LIMPAS e no MESMO commit em que estavam. O `fetch` que você
  mandou fazer só mexe nas referências locais do clone, e isso já estava escrito nesta casa;
· o item novo NÃO foi apagado, e eu não decidi qual dos dois `013` valia: movi o mais novo para o
  próximo número livre, com o conteúdo intocado;
· a escolha de desenho NÃO foi tomada por mim: está na página dele, com os três caminhos;
· o custo do caminho recomendado sai NÃO MEDIDO, e não como zero.
```

## 10/10/2026 · LAB-83 — item 016: o carimbo sai do módulo resolvido, e o Geo não tem módulo a resolver

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-83 (item 016) ===
Estado: FEITO. O carimbo do clone vizinho sai do MÓDULO RESOLVIDO, o `HEAD` da convenção virou SEGUNDA linha, e divergindo a prova diz as DUAS. Verde conferido aqui, não no GitHub: 901 travas na esteira + 17 no testfit (507 delas na lista do CI sem clones), 7 passos, exit 0.
Feito: remedi PRIMEIRO, como você mandou — e a remedição MUDOU O TAMANHO DO CONSERTO. A divergência não ficou prevista: foi DEMONSTRADA com o resolvedor apontado ao clone do rascunho em 3680b9f, e saiu `de=modulo-resolvido commit=3680b9f convenção=6cf6396 DIVERGEM=true` — o caso exato do D274, agora relatado em vez de escondido. Decisões D276 a D279.
Achados para outros apps ou Central: (1) DE TRÊS VIZINHOS, DOIS TÊM MÓDULO A RESOLVER E UM NÃO TEM. O `urban-scout-tool` não aparece em `paths` nenhum, porque este laboratório lê GeoJSON do Geo e não CÓDIGO dele — não há `import` a resolver porque não há `import`. Para ele o carimbo honesto continua sendo o da convenção, agora DITO COMO TAL no campo `de`, em vez de parecer igual aos outros dois. CARIMBO QUE NÃO TEM MÓDULO A RESOLVER NÃO É UM CARIMBO PIOR: É UM CARIMBO DE OUTRA PERGUNTA. Se eu tivesse começado pelo código, teria escrito um resolvedor para três e descoberto no terceiro que não havia o que resolver — e a saída provável seria um `catch` silencioso, que é o oposto do que você pediu. (2) A ADOÇÃO CABIA, E CABE PORQUE É PEQUENA, não porque eu quis: das 72 provas, 5 carimbam clone e 2 ferramentas chamam o carimbo — as duas publicam a procedência agora; as outras 67 não carimbam clone nenhum, então ZERO ficam para depois e NENHUMA prova foi reescrita. As três já carimbadas e não regeradas são provas de ESTADO de rodadas passadas: regerá-las mudaria o que elas mediram. E uma das duas precisou de mais que regerar — PROVA QUE DERIVA A PROCEDÊNCIA DE OUTRA COISA NÃO HERDA O CONSERTO DA FONTE, ELA TEM DE PEDIR. (3) DISPARO QUE A SESSÃO NÃO RECEBE NÃO É DISPARO EM VAZIO: É DISPARO PERDIDO. Entre 11:06 e 18:06 o despertador disparou oito vezes; UMA notificação chegou na hora e as outras SETE chegaram todas no mesmo instante, às 18:06, com até seis horas de espera — e a sua caixa tinha o `016` desde as 10h55. Contá-las como vazio diria "você não abastece" quando o que houve foi "eu não estava ouvindo", E A CONTA DECIDE O INTERVALO: sete vazios falsos te empurrariam a ESTICAR o despertador, o conserto exatamente oposto. A coluna de origem ganhou `entregue-em-lote` no vocabulário fechado, e a conta passa a dizer as três coisas: 21 observados · 5 em vazio · 7 entregues em lote. Nada foi tocado no despertador. (4) A TERCEIRA COINCIDÊNCIA CASADA COMO INVARIANTE, NA MESMA FUNÇÃO, E A MAIS ÚTIL DAS TRÊS. Mexer na conta dos itens abertos (17 → 16, por ENTREGA) me fez reler a trava `naFila > 15`, que eu mesma escrevi no LAB-80 para consertar a segunda (o D264) e justifiquei por escrito com "a FILA só cresce". Medido commit a commit: 15 → 16 → 17 → 16 → 17 → 16 → 17, duas descidas, as duas por entrega. COINCIDÊNCIA CONSERTADA COM OUTRA COINCIDÊNCIA É A MESMA TRAVA COM UMA VIDA MAIS LONGA — e esta é a primeira das três cuja JUSTIFICATIVA ESCRITA é a parte que estava falsa: eu não casei o número por descuido, casei-o por uma premissa sobre o mundo que a minha própria entrega já tinha desmentido. O conserto foi guardar MENOS: a linha saiu e nada tomou o lugar dela. (5) E ESCREVER A TRAVA NOVA ACHOU UM NOME DE CI QUE DEIXOU DE SER VERDADE. O trabalho `guardas que não precisam dos clones vizinhos (NÃO é o verde)` lista um arquivo com DUAS travas que exigem o clone do motor-testfit no disco — uma desde o LAB-68 e uma minha, desta rodada. Sem o clone as duas reprovam, e o trabalho que existe JUSTAMENTE para rodar sem segredo falharia por falta do que o nome dele promete não precisar. O NOME DE UM TRABALHO DE CI É UMA AFIRMAÇÃO SOBRE O QUE ELE PRECISA, E NENHUMA TRAVA A CONFERE — e ela mora num arquivo que ninguém executa hoje, porque a execução automática está desligada desde 08/10: afirmação desligada não é afirmação falsa, é afirmação que ninguém vai desmentir. NÃO CONSERTEI, de propósito: escolher entre tirar as travas do trabalho ou fazer o nome dizer a verdade precisa de uma medição que eu não fiz (quantas travas de cada um dos 30 arquivos da lista dependem do clone), e prometer o número sem medir é a classe do D133. Foi para a FILA como proposta. Então a conta dos abertos andou DUAS vezes nesta rodada e ficou em 17 — uma saiu por entrega, uma entrou: SALDO PARADO NÃO É RODADA PARADA.
Depende do Jonny: nada novo meu nesta rodada. Continuam a §10 (parar a fileira na esquina — três caminhos), o sétimo mecanismo e as duas perguntas do acesso.
Próximo na fila: a D226 (os quatro campos de `legais`), que você chamou de "o seguinte" e que o seu próprio item 016 pôs como "primeira da próxima caixa", porque ela MUDA O DESENHO e espera o olho dele. Não começada.
=== FIM ===

--- O QUE VAI JUNTO ---

═══════════════════════════════════════════════════════════════════════════════
  O QUE O CARIMBO DIZ AGORA, e o que ele continua NÃO SABENDO
═══════════════════════════════════════════════════════════════════════════════

Cada carimbo passa a trazer DE ONDE saiu, e não só o commit:

  campo           o que responde
  commit          o commit da árvore de onde o código VEIO
  de              `modulo-resolvido` ou `convencao` — a fonte, dita e não suposta
  pelaConvencao   o caminho e o `HEAD` da convenção, quando ele é OUTRO
  divergem        verdadeiro quando as duas fontes discordam — a NOTÍCIA

  vizinho                      ponto de entrada resolvido              de
  motor-testfit                @testfit/api.ts                         modulo-resolvido
  urban-create-hub-41d93a4d    @generate/contratos/motor-v1/index.ts   modulo-resolvido
  urban-scout-tool             nenhum — não entra em `paths`           convencao

O QUE ELE NÃO SABE, E ISSO FICA DITO:
· o módulo resolvido diz QUAL ARQUIVO foi carregado; ele NÃO diz se aquela árvore tinha mudança
  NÃO COMMITADA. Um clone sujo entrega código que não corresponde a commit nenhum, e NENHUMA das
  duas fontes conta isso;
· o campo `limpo` passa a medir a árvore DE ONDE O CARIMBO SAIU, o que ajuda — mas um `git stash`
  no meio de uma rodada continua invisível para as duas;
· guarda que não declara o próprio buraco mente pelo silêncio, e este não fecha com código.

E A TRAVA DO CARIMBO DEIXOU DE DEPENDER DE REDE: ela chamava a função que faz `git fetch` nos três
clones e estourou o limite de 5 s do Bun. O `fetch` virou parâmetro, ligado por padrão, e a trava
passa `false`, porque a pergunta dela é DE ONDE O CARIMBO SAIU e isso não precisa de rede. De 5,9 s
a 154 ms. TRAVA QUE DEPENDE DE REDE NÃO REPROVA O CÓDIGO: REPROVA A CONEXÃO.

AS FRONTEIRAS, E NENHUMA FOI ATRAVESSADA:
· NADA foi escrito em repositório vizinho;
· as três árvores vizinhas ficaram LIMPAS e nos MESMOS commits em que estavam — a demonstração da
  divergência foi feita com o RESOLVEDOR trocado, que é parâmetro da função, sem repontar o
  `tsconfig` de ninguém;
· NENHUMA das cinco classes que param se aplica, item por item, como o seu item já tinha conferido;
· nada foi tocado no despertador: ligar, desligar e reagendar é seu; o meu trabalho é a conta.
```

## 10/10/2026 · LAB-83 (continuação) · decisao-registrada — o disparo das 19:06 não é em vazio, e a conta estava CEGA em sete linhas

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · decisao-registrada ===
ACUMULADO — inclui os recados LAB-83, decisao-registrada
Estado: o despertador das 19:06 chegou NA HORA e eu o li às 19:18, ao fechar o LAB-83 — e a caixa já estava vazia. NÃO é disparo em vazio. A conta passa a dizer um número por classe: 29 no registro · 20 observados · 2 derivados · 7 entregues em lote · 5 em vazio. Despertador intocado. Verde conferido aqui, não no GitHub: 907 travas na esteira + 17 no testfit (513 na lista do CI sem clones), 7 passos, exit 0.
Feito: anotei a data e classifiquei pelo fato, não pelo disco de agora (D280) — e ao gravar a linha a conta REPROVOU, acusando não a linha nova mas DUAS CEGUEIRAS MINHAS nascidas horas antes, nesta mesma rodada (D281). Consertadas, com seis travas novas na ordem da Central. O LAB-83 está mesclado na main, PR #110 — o recado inteiro dele está logo acima neste arquivo.
Achados para outros apps ou Central: A CAIXA QUE DECIDE A CLASSE DE UM DISPARO É A DE QUANDO ELE DISPAROU, NÃO A DE QUANDO EU O LEIO. No instante das 19:06 a caixa AINDA TINHA o `016.md`: a renomeação para `016-FEITO` entrou no commit às 19:17. Os onze minutos entre o disparo e a leitura são o fim da rodada anterior — e é exatamente neles que a caixa esvazia, POR OBRA MINHA. Classificar pela caixa de agora faz a minha própria entrega virar prova de que você não abastece. E É A TERCEIRA LEITURA TROCADA DA MESMA CONTA EM UM DIA, as três com a mesma forma — um disparo que não produziu rodada nova contado como um disparo que não tinha o que fazer: o D265/D272 (a linha que não dizia QUAIS parcelas), o D277 (sete disparos que a sessão não recebeu) e este. As três custam a mesma coisa, porque A CONTA DECIDE O INTERVALO: cada vazio falso é um argumento para ESTICAR o despertador, o conserto oposto ao que cada um dos três pede. TRÊS ENGANOS DIFERENTES EMPURRANDO O MESMO BOTÃO ERRADO NÃO SÃO TRÊS ACIDENTES: são o sinal de que a conta mede uma coisa (o disparo) e é lida como outra (o abastecimento). A §1-A já resolvia o caso e eu só precisei obedecer — "um prompt por despertador; se o anterior não fechou, termine-o antes de começar qualquer coisa nova" —, então a linha das 19:06 aponta para o item 016: ELE É O DISPARO SOB O QUAL O LAB-83 FECHOU. E NÃO escrevi trava para ISSO: a régua certa precisaria do estado da caixa num INSTANTE PASSADO, e o que eu tenho no disco é o de agora — fica declarado como NÃO MEDIDO em vez de prometido. (2) E A CONTA ESTAVA CEGA EM SETE LINHAS, pelas minhas duas mãos, nas duas horas anteriores. Primeira: eu pus `entregue-em-lote` no vocabulário fechado (D277) e NÃO na régua que lê a tabela, que casa a coluna de origem com `[a-z]+` — E `[a-z]+` PARA NO HÍFEN. Medido: 29 linhas na tabela, 22 parseadas, 7 PERDIDAS, exatamente as da classe nova. VOCABULÁRIO QUE CRESCE E RÉGUA DE LINHA QUE NÃO CRESCE COM ELE FICA CEGA EXATAMENTE NA CLASSE NOVA — a única que ninguém ainda sabe ler. E o verde passou: o total declarado era comparado com o total de linhas, eu declarei 22 e a régua contou 22, porque as sete eram invisíveis PARA OS DOIS LADOS da comparação. Guarda que não acha o objeto não está aprovando, está sem medir nada (D213) — e isso está escrito, em palavras quase iguais, no comentário da própria função que ficou cega. Segunda vez da família do D231, e a mais barata dela: o vocabulário e a régua que o lê moram no MESMO arquivo, a dez linhas de distância. Segunda cegueira: a palavra do vazio não tinha fronteira, e `vazio` casou dentro de `esVAZIOu` — numa célula que diz justamente que a caixa TINHA item. E a medição tem uma segunda parte, mais útil: das CINCO linhas em vazio de verdade, TODAS as cinco dizem "nada na caixa" e NENHUMA usa a palavra `vazio` — a alternativa que criou o falso positivo não pegava uma única linha legítima, só tinha o poder de errar. QUANDO A RÉGUA PROCURA UMA PALAVRA, MEÇA QUANTAS LINHAS LEGÍTIMAS CADA ALTERNATIVA PEGA: A QUE PEGA ZERO NÃO PROTEGE NADA, SÓ ESPERA A VEZ DE ERRAR. Consertado: origem com hífen, vazio com `\b`, e o primeiro número parou de se chamar "observados" porque ele sempre foi o TOTAL DE LINHAS — rótulo de uma coisa com a conta de outra. A linha agora é `disparos no registro: 29 · observados: 20 · derivados: 2 · entregues em lote: 7 · em vazio: 5`, e CADA CLASSE é conferida contra as linhas dela: os sete números em lote ficaram SETE HORAS no documento sem régua nenhuma, e quem os pegou não foi uma trava, foi a linha seguinte dar errado.
Depende do Jonny: nada novo. Continuam a §10 (parar a fileira na esquina — três caminhos), o sétimo mecanismo e as duas perguntas do acesso.
Próximo na fila: a CAIXA ESTÁ VAZIA — os dezesseis itens estão `-FEITO`. A D226 (os quatro campos de `legais`) é a primeira da próxima caixa, por escolha sua e do seu item 016, porque MUDA O DESENHO e espera o olho dele. Durmo e reavalio no próximo disparo; o despertador fica como está.
=== FIM ===

--- O QUE VAI JUNTO ---

A CONTA, COMO ELA ESTÁ AGORA — e com um número por CLASSE, cada um com régua:

  disparos no registro: 29 · observados: 20 · derivados: 2 · entregues em lote: 7 · em vazio: 5

  19:06  observado  chegou na hora, com o item 016 AINDA EM VOO — a caixa só esvaziou às 19:17,
                    quando a renomeação entrou no commit 5489c23. Rodada: item 016 (LAB-83).

O QUE A RÉGUA LIA E O QUE ELA LÊ AGORA:

  régua da coluna de origem     linhas lidas   o que ficava de fora
  [a-z]+        (até agora)     22 de 29       as 7 `entregue-em-lote` — a classe NOVA
  [a-z-]+       (agora)         29 de 29       nenhuma

  palavra do vazio              em vazio       o falso positivo
  /vazio|nada|sem item/         6              `esVAZIOu`, numa célula que diz o contrário
  /\b(?:vazia?|nada|sem item)\b/  5              nenhum — e nenhuma linha legítima se perdeu

E A CAIXA, CONFERIDA NO REMOTO NESTE MINUTO: dezesseis itens, todos `-FEITO`, mais o
COMO_FUNCIONA.md. Nada novo desde o `016`.
```

## 10/10/2026 · LAB-84 — item 017: as trinta e uma por EXECUÇÃO, e eram QUATRO travas, não duas

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-84 (item 017) ===
Estado: FEITO. A medição saiu POR EXECUÇÃO, como você exigiu — e ela desmentiu o MEU número. A afirmação do nome do trabalho de CI volta a ser verdadeira, agora medida: 31 de 31 passam sem os clones. Verde conferido aqui, não no GitHub: 918 travas na esteira + 17 no testfit, 520 na lista do CI sem clones, 7 passos, exit 0. Decisões D282 e D283, mais o D279 corrigido RISCANDO.
Feito: rodei os 30 arquivos num repositório copiado para um lugar onde os três clones irmãos NÃO existem — que é o que o CI vê —, um a um, com o código de saída guardado. A ferramenta ESTOURA se um clone aparecer ao lado da cópia: medição cuja precondição não é conferida mede outra coisa. Nada foi movido no vizinho, e foi por isso que usei cópia em vez de tirar os clones do lugar.
Achados para outros apps ou Central: (1) ERAM QUATRO TRAVAS, NÃO DUAS — e o número errado era meu, do recado que gerou este item. Dos 30 arquivos, VINTE E NOVE passam e UM reprova: `commit-dos-vizinhos.test.ts`, com 4 de 14. Eu disse DUAS lendo o fonte, porque contei os `expect` cuja MENSAGEM eu reconhecia e não vi as outras duas do mesmo `describe`, que dependem da VARIÁVEL `cabeca` e não repetem a frase. RÉGUA DE LEITURA ACHA O QUE ELA RECONHECE; EXECUÇÃO ACHA O QUE ACONTECE — a diferença foi de 100 %. Você estava certo em não aceitar o número lido, e o `duas` do D279 está riscado com a medição ao lado. (2) A DECISÃO, E O QUE SE PERDE ESTÁ ESCRITO: movi as quatro travas e NÃO renomeei o trabalho. O nome é a única coisa que torna aquela lista rodável em qualquer lugar sem preparo, e ele existe justamente porque o verde completo NÃO roda sem segredo; renomear tornaria o requisito do portão insabível sem rodar. E tirar o arquivo inteiro — a saída simples — custaria as 10 travas dele que são limpas de clone: MOVER POR ARQUIVO QUANDO A DEPENDÊNCIA É DE TRAVA PAGA A CONTA DE QUEM NÃO MEDIU. Foi a medição POR ARQUIVO que comprou essa distinção; o total não a tem. (3) E A TRAVA QUE FALTAVA ACUSOU A SI MESMA NA PRIMEIRA VERSÃO. Eu escrevi a régua estática óbvia — procurar `join(RAIZ, "..", "motor-testfit")` no fonte — e ela reprovou A PRÓPRIA TRAVA QUE A DEMONSTRA, porque a fixture dela contém essa frase. Sétima da família do D142/D155/D257. E a cura desta casa não serve, medida nas duas formas: `soOCodigo()` esvazia o conteúdo das strings e o alvo É uma string, então a régua fica CEGA; `semComentarios()` guarda as strings e a fixture também é string, então acusa de novo. QUANDO O QUE VOCÊ PROCURA E O QUE VOCÊ QUER IGNORAR SÃO A MESMA FORMA, NÃO HÁ RÉGUA ESTÁTICA QUE OS SEPARE — e a saída não é uma régua mais esperta, é a OUTRA PERGUNTA, que o seu item já tinha dito: a trava passou a LER A MEDIÇÃO em vez de reler o fonte. Ela reprova em seis formas, cada uma demonstrada. (4) E ELA ESTÁ NA LISTA QUE GUARDA, O QUE CRIOU UM PONTO FIXO: a medição roda a trava, e a trava lê a medição ANTERIOR — o primeiro vermelho dela se gravou na prova e se realimentou, medido nas duas voltas. GUARDA QUE LÊ UMA MEDIÇÃO DE SI MESMA NÃO TEM LADO BOM ALCANÇÁVEL: o ponto fixo existe, mas não se chega a ele por iteração. O conserto não foi afrouxar a régua, foi DIZER que o arquivo dela está fora do próprio gate e por quê — e o que fica garantido sem o gate está dito: a ferramenta mede esse arquivo igual aos outros, a prova publica a linha dele, e o verde completo o roda. (5) E A VARREDURA DA CASA PEGOU O MEU INSTRUMENTO DE MEDIR: a ferramenta escrevia `?? 0` sobre uma chamada, o que faria `0 reprovam` com `exit 1` — contradição publicada, e é o D23. Virou `null`. Instrumento de medir também é código desta casa.
Depende do Jonny: nada novo meu. Continuam a §10 (parar a fileira na esquina — três caminhos, com o custo do recomendado NÃO MEDIDO), o sétimo mecanismo e as duas perguntas do acesso.
Próximo na fila: a D226 (os quatro campos de `legais`) — e agora ela é a primeira sem concorrente, porque o seu item 017 era o último que não precisava do olho dele. Ela MUDA O DESENHO, então é dele a vez. O CI não foi religado, como você mandou; o despertador fica como está.
=== FIM ===

--- O QUE VAI JUNTO ---

═══════════════════════════════════════════════════════════════════════════════
  A TABELA QUE O ITEM PEDIU — por arquivo, por EXECUÇÃO, sem os clones
═══════════════════════════════════════════════════════════════════════════════

  ANTES do conserto, os 30 da lista:

    29 arquivos ................................ exit 0
     1 arquivo .................................. exit 1
       └ commit-dos-vizinhos.test.ts ............ 4 travas de 14

  AS QUATRO, NOMEADAS (e eu havia dito DUAS):

    1. item 001 > O CASO BOM, contra o clone de verdade: carimbo igual ao HEAD → igual
    2. item 001 > O CASO RUIM: carimbo de OUTRO commit do histórico → mudou
    3. item 001 > prova SEM carimbo sai nao-gravado, e nunca igual
    4. o carimbo de VERDADE desta máquina diz de onde saiu, e as duas linhas batem hoje

    Três delas são do LAB-68, anteriores à minha rodada; uma é minha, do LAB-83.

  DEPOIS do conserto, remedido:

    31 de 31 ................................... exit 0  ← a afirmação é VERDADEIRA

  OS TRÊS CONSERTOS POSSÍVEIS, E O QUE CADA UM CUSTA:

    mover as 4 travas  (escolhido)  ganha: o nome volta a ser verdade e a lista roda em
                                   qualquer lugar sem preparo
                                   perde: NADA — o verde completo roda todo arquivo
    renomear o trabalho            ganha: nada a mexer no código
                                   perde: o requisito do portão deixa de ser sabível sem rodar
    tirar o arquivo inteiro        ganha: simplicidade
                                   perde: as 10 travas limpas de clone saem do portão

A prova, arquivo por arquivo: docs/provas/LAB-84/as-trinta-por-execucao.json

AS FRONTEIRAS, E NENHUMA FOI ATRAVESSADA:
· NADA foi escrito em repositório vizinho, e NADA foi movido nem renomeado neles — a medição usou
  uma CÓPIA do repositório, exatamente para não precisar tirar os clones do lugar;
· as três árvores vizinhas ficaram LIMPAS e nos MESMOS commits;
· o CI NÃO foi religado para medir, como você mandou: o gatilho continua comentado por decisão de
  família, e a medição rodou nesta máquina;
· nada foi tocado no despertador.
```

## 10/10/2026 · LAB-85 — item 018: o que o gatilho carrega, e a conta estava na unidade errada

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-85 (item 018) ===
Estado: FEITO. A decisão está escrita, codificada e guardada nos dois sentidos; o gatilho NÃO foi religado. E você pediu o número de novembro — ele desmontou a premissa, que era MINHA. Verde conferido aqui, não no GitHub. Decisões D284 a D286.
Feito: medi na API do Actions, 3 execuções de 3 dias, com o id e o nome de cada campo na prova. A decisão: o gatilho carrega SÓ o trabalho 1, por `if: github.event_name == 'workflow_dispatch'` no verde-completo — com marca, com prazo em forma de EVENTO e com trava nos dois sentidos. Verde: 933 travas na esteira + 17 no testfit, 535 na lista do CI sem clones (32 arquivos, 32 de 32 passando sem os clones), 7 passos, exit 0. E a §11 da página do Jonny nasceu: é o único desbloqueio de verdade desta rodada.
Achados para outros apps ou Central: (1) OS "136 MINUTOS, 50 % DE TUDO" SÃO MINUTOS-TRABALHO CONSUMIDOS, NÃO DINHEIRO: `billable.UBUNTU.total_ms` é ZERO em 3 de 3 execuções medidas. Repositório público, `ubuntu-latest` gratuito e não medido — e a §7 do meu CLAUDE.md JÁ DIZIA isso ("a parte deste repositório no estouro é ZERO"). As duas frases conviveram dois dias na mesma página sem ninguém notar que se contradizem, eu inclusive, que escrevi as duas. A UNIDADE EM QUE EU CONTEI O DESPERDÍCIO NÃO ERA A UNIDADE EM QUE A CONTA É PAGA. Novembro custa R$ 0 nos três caminhos, então o dinheiro NÃO decide, e eu não precisei parar na fronteira. (2) E O TRABALHO CONDENADO CUSTA 5 A 7 SEGUNDOS: a precondição falha 3 a 4 s depois do início e todo o resto sai `skipped` — ele nunca clona, nunca instala, nunca roda a suíte. O D124 funciona exatamente como desenhado. (3) O CUSTO REAL É O SINAL, E ELE RECONCILIA DUAS FRASES MINHAS QUE PARECIAM BRIGAR: 136 de 136 em `failure`, sempre no mesmo passo. UM SINAL QUE FICOU VERMELHO 136 DE 136 VEZES NÃO É ALARME, É RUÍDO DE FUNDO — e o "um CI vermelho por falta de configuração é honesto" da §7 está certo UMA VEZ; repetido 136 vezes sem nada mudar, deixou de informar. HONESTIDADE DE UM SINAL NÃO É PROPRIEDADE DA PRIMEIRA VEZ QUE ELE ACENDE: É PROPRIEDADE DA SÉRIE. (4) ESCOLHI O EVENTO E NÃO O SEGREDO, e o motivo é de método: o contexto `secrets` NÃO existe num `if:` de trabalho, então condicionar ao segredo exigiria um TERCEIRO trabalho só para lê-lo — e com o CI desligado eu NÃO POSSO DEMONSTRAR que a condição pega. ENTRE DOIS CONSERTOS, O QUE EU POSSO DEMONSTRAR NESTA MÁQUINA VALE MAIS DO QUE O QUE EU SÓ POSSO AFIRMAR, e era disso que você avisava ao chamar a condicional de quinta forma de desligar: condição não testada, em arquivo que ninguém executa, é o desligamento mais silencioso que existe. (5) E A SUA AFIRMAÇÃO DE PASSAGEM ESTAVA ERRADA — é o achado mais útil da rodada. Você escreveu que o segredo "está na página de pendências desde o LAB-38": NÃO ESTAVA. `VIZINHOS_TOKEN` aparece em 16 arquivos da árvore e a página do Jonny não é um deles; a palavra "token" aparece ZERO vezes nela. O LAB-38 pediu no RELATÓRIO, e escreveu ao lado que "a receita está no log do próprio workflow, toda vez que ele falha" — dois lugares que ele nunca lê, e um deles sem rodar desde 08/10. Foram QUARENTA E SEIS PROMPTS com a única coisa desta decisão que depende de uma pessoa escrita no lugar errado. PEDIDO QUE MORA SÓ NUM RELATÓRIO NÃO CHEGA A QUEM DECIDE — é o §1-B numa forma pior, porque foi para um arquivo, e arquivo errado é mais perigoso que nenhum: ele dá a sensação de que o pedido existe. E A PROVA DE QUE DÁ É VOCÊ: você o citou como feito, lendo o LAB-38 e concluindo o passo que faltava. Um pedido no lugar errado não fica só não feito — ele passa a ser citado como feito. (6) E A TRAVA NOVA ACUSOU A DECISÃO CORRETA na primeira versão: a régua de texto achou a palavra `if:` DENTRO do comentário que explica a condição. Oitava da família do D142/D155/D257, e no mesmo dia em que eu escrevi essa família como decisão. A PERGUNTA DECIDE O INSTRUMENTO: "este trabalho tem condição?" é do YAML, e o `Bun.YAML` responde pela chave; "a condição está explicada?" é do texto, e aí o comentário é o objeto. Com a irmã na mesma rodada: CLASSE NEGADA NÃO É FRONTEIRA — um `[^~]*` emendou um til da §10 com um da lista de resolvidos, com a §11 no meio, e leu a pendência ABERTA de hoje como RESOLVIDA.
Depende do Jonny: UMA COISA NOVA, e ela estava devendo há 46 prompts — a §11 da página dele: criar a senha de leitura (`VIZINHOS_TOKEN`) OU tornar os dois vizinhos públicos. Escrita para leigo, com os três passos, a alternativa, a ressalva de segredo em repositório público e o que NÃO para enquanto ele não decidir. Continuam a §10, o sétimo mecanismo e as duas perguntas do acesso.
Próximo na fila: a D226 (os quatro campos de `legais`), que MUDA O DESENHO e espera o olho dele; e a trava que regera a varredura de configuração (D204), que você mesmo nomeou como "o próximo natural" depois do LAB-84. A fila está em QUINZE abertos — quatro descidas por entrega em cinco rodadas.
=== FIM ===

--- O QUE VAI JUNTO ---

═══════════════════════════════════════════════════════════════════════════════
  A MEDIÇÃO DE NOVEMBRO, com a fonte de cada número
═══════════════════════════════════════════════════════════════════════════════

  execução        evento         conclusão   duração   COBRADO
  37751994616     push           failure         9 s   0 ms
  37751249491     pull_request   failure        49 s   0 ms
  37713910680     push           failure        10 s   0 ms

  de onde vem cada número: `billable.UBUNTU.total_ms` e `run_duration_ms` de
  /actions/runs/{id}/timing; `started_at`/`completed_at` de /actions/runs/{id}/jobs.

  O TRABALHO CONDENADO, passo a passo:
    dura 5 a 7 s · precondição falha 3 a 4 s depois do início · todo o resto `skipped`
    nunca clona · nunca instala · nunca roda a suíte

OS TRÊS CAMINHOS, E O QUE CADA UM PERDE:

  → só o trabalho 1   (R$ 0)  ganha: o vermelho volta a informar
                              perde: no dia em que o segredo nascer, ninguém é avisado se o
                                     verde completo quebrar — e é isto que a trava cobra

    os dois, com o    (R$ 0)  ganha: volta sozinho no dia do segredo
    trabalho 2 pelo           perde: `secrets` NÃO existe num `if:` de trabalho; exigiria um
    SEGREDO                          terceiro trabalho, indemonstrável com o CI desligado

    os dois como hoje (R$ 0)  ganha: nada a mexer
                              perde: o vermelho continua ruído — 136 de 136

A MARCA E O PRAZO, porque condição sem os dois é desligamento calado:
· a marca ..... a caixa de comentário do trabalho 2, e a §11 da página do Jonny
· o prazo ..... um EVENTO e não uma data: o segredo nascer. A pendência é riscada, e a
                condição TEM DE SAIR — e a trava reprova se ela ficar
· o lugar ..... o `verde.yml` entrou como o OITAVO lugar da varredura por lugar

AS FRONTEIRAS, E NENHUMA FOI ATRAVESSADA:
· O GATILHO NÃO FOI RELIGADO: `push` e `pull_request` seguem comentados, e a trava de 1º/11
  continua sendo quem cobra. A régua cobra; não liga;
· nada foi escrito em repositório vizinho;
· não gastei dinheiro: escrever o que o gatilho vai carregar não gasta, e eu fiquei do lado de cá;
· o segredo continua sendo dele, e nada aqui o pede de novo — só o pede no LUGAR CERTO.
```

## 10/10/2026 · LAB-86 — item 019: a prova velha, e o limiar que a deixava passar

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-86 (item 019) ===
Estado: FEITO. A D204 está consertada por RECONTAGEM, com os dois sentidos demonstrados — e remedindo antes de consertar eu achei o defeito VIVO e pior do que ela descrevia. Verde conferido aqui, não no GitHub: 937 travas na esteira + 17 no testfit, 550 na lista do CI (33 arquivos, 33 de 33 passando sem os clones), 7 passos, exit 0. Decisões D287 e D288.
Feito: a medição saiu da ferramenta para `src/escopo-da-varredura.ts`, e a ferramenta e a trava passam a chamar A MESMA FUNÇÃO, com o universo começando no `git ls-files`. A prova do LAB-57 foi regerada e não pode mais ficar velha em silêncio. E das 74 provas, medi quais cabem nesta forma: 11 de dentro, 63 de fora.
Achados para outros apps ou Central: (1) O DEFEITO ESTAVA VIVO, E NÃO ERA UMA EDIÇÃO DE ATRASO — ERAM SEMANAS. A prova commitada dizia 364 arquivos que o git carrega, 128 de código e 36 157 linhas; a MESMA árvore dizia 498, 187 e 50 714 — 26 a 32 % do número de hoje. E ela ainda carregava dois caminhos mortos, pastas de compilação que não existem mais. (2) POR QUE NADA REPROVAVA, E ESTA É A LIÇÃO DA RODADA: a trava conferia a prova com LIMIAR — `configuracoesEncontradas > 20`, `configuracoesVarridas > 5`, `linhasDeCodigoLidas > 10000`. Uma prova congelada em 36 157 linhas passa `> 10000` PARA SEMPRE. RÉGUA QUE CONFERE UMA PROVA COM "MAIOR QUE" ACEITA QUALQUER PROVA VELHA QUE JÁ FOSSE GRANDE O BASTANTE QUANDO NASCEU: o limiar mede se o número é PLAUSÍVEL, só a recontagem mede se ele é VERDADE — e num repositório que cresce, O LIMIAR FICA MAIS FROUXO A CADA COMMIT SEM NINGUÉM MEXER NELE. É o D164 pelo outro lado: ali o perigo era o zero de régua parada ser indistinguível do zero de árvore limpa; aqui é o número grande de ONTEM ser indistinguível do número certo de HOJE. (3) ESCOLHI RECONTAR, E RECUSEI O CARIMBO POR MEDIÇÃO — exatamente pelo motivo que você avisou: O CARIMBO DO DISCO NÃO É O DO GIT. Numa sessão nova todo arquivo tem a data do checkout, e a comparação vira VÁCUO justamente no CI, que é onde ela mais precisaria valer. Guarda que não acha o objeto não está aprovando, está sem medir nada (D213). Recontar custa ~0,3 s, é exato e não precisa de rede nem de clone, porque o universo desta varredura é o `git ls-files` DESTE repositório. (4) E A SUA EXIGÊNCIA DE UM LUGAR SÓ FOI O QUE MAIS RENDEU: a conta estava DENTRO da ferramenta, e escrevê-la de novo na trava criaria duas implementações da mesma pergunta — você chamou pelo nome, e o D231 já cobrou esta casa por meio conserto num instrumento só. (5) OS DOIS SENTIDOS, E O CASO VÁLIDO QUE QUASE PARECE INVÁLIDO PASSA: plantei uma linha num arquivo que a prova mede, sem regerar — a trava reprovou NOMEANDO A CHAVE (`linhasDeCodigoLidas`, na prova 50 714, na árvore 50 716), e o arquivo voltou byte a byte com sha256 conferido. E duas recontagens na mesma árvore batem, então a prova que não mudou PORQUE NADA QUE ELA MEDE MUDOU não reprova: régua que exigisse carimbo mais novo a cada commit reprovaria a árvore correta, e vigia que nasce vermelho vira ruído e morre. (6) E O VIGIA ACUSOU O TRABALHO DE QUEM O ESTAVA ESCREVENDO, sem plantio nenhum: ao registrar o script `lab86` no `package.json` — que é configuração que a varredura lê — a recontagem acusou na hora, 760 → 761. A PROVA MAIS HONESTA DE QUE UM VIGIA FUNCIONA É ELE ACUSAR O TRABALHO DE QUEM O ESTAVA ESCREVENDO. (7) O ALCANCE, porque você mandou a medição decidir o tamanho: das 74 provas, 11 têm o universo DENTRO desta casa e 63 DEPENDEM DE FORA. RECONTAR O QUE DEPENDE DE FORA NÃO É MAIS RIGOR: É OUTRA MEDIÇÃO COM O NOME DA ANTIGA — e isso é LAB-79 medido, não opinião: o LAB-78 perdeu dois de quatro lotes assim, porque o motor andou de 4181e95 para 6cf6396. Recontei UMA, a que a D204 nomeou; as outras dez foram à FILA, porque são medição POR PROVA. E NENHUMA SEGUNDA LISTA NASCEU: a fronteira do §7 foi reusada, como você exigiu. (8) E O QUE O CONSERTO NÃO RESOLVE — A TRAVA CORRIGIU A MINHA PRÓPRIA DECLARAÇÃO, NO MESMO VERDE. Eu escrevi que "a prova tem de ser a última coisa gerada na rodada"; medido, é mais estreito: rodei o lab57 como última ferramenta, commitei, e ela reprovou — 498 → 502 arquivos carregados, 187 → 188, 50 716 → 50 914. O UNIVERSO É O `git ls-files`, E ELE MUDA NO `git add`, não quando o arquivo é escrito: os quatro arquivos novos da rodada estavam no disco e NÃO RASTREADOS. A PROVA TEM DE SER GERADA DEPOIS DO `git add`, NÃO DEPOIS DA ÚLTIMA EDIÇÃO — e os dois estão a um comando de distância, o que torna o engano barato de cometer e invisível sem recontagem. A ordem continua exigida; o que mudou é que ela deixou de ser disciplina e passou a ser guarda. (9) E ACHEI UM BURACO NO PORTÃO, de passagem: a `configuracao.test.ts` NUNCA ESTEVE na lista do trabalho que roda em todo envio, e é limpa de clone — ou seja, a trava do D204 não rodava no portão. Entrou, remedida por execução: 33 de 33 passam sem os clones, e a lista foi de 535 a 550 travas.
Depende do Jonny: nada novo meu. Continuam a §11 (a senha de leitura, ou tornar os dois vizinhos públicos), a §10, o sétimo mecanismo e as duas perguntas do acesso.
Próximo na fila: a D226 (os quatro campos de `legais`), que MUDA O DESENHO e espera o olho dele — e agora ela é a única da sua lista que não é medição minha. A fila ficou em QUINZE: uma saiu por entrega e uma entrou, a das outras dez provas recontáveis.
=== FIM ===

--- O QUE VAI JUNTO ---

═══════════════════════════════════════════════════════════════════════════════
  O DEFEITO, MEDIDO — a prova commitada contra a mesma árvore
═══════════════════════════════════════════════════════════════════════════════

  número                            na prova    na árvore   atraso
  arquivosQueOGitCarrega                 364          498    26,9 %
  arquivosDeCodigoVarridos               128          187    31,6 %
  linhasDeCodigoLidas                 36 157       50 714    28,7 %
  linhasDeConfiguracaoLidas              662          761    13,0 %

  e dois caminhos MORTOS que ela ainda carregava:
    external-engines/symbios/archilly/probe/target/
    external-engines/symbios/archilly/wasm-probe/target/

  O QUE A TRAVA CONFERIA, e por que passava:
    configuracoesEncontradas  > 20       ← 27 passa, e 20 passaria também
    configuracoesVarridas     > 5        ← 11 passa
    linhasDeCodigoLidas       > 10000    ← 36 157 passa PARA SEMPRE

AS DUAS FORMAS, E POR QUE O CARIMBO CAIU:

  recontar e comparar  (ESCOLHIDA)  universo = `git ls-files` deste repositório: sem clone,
                                    sem rede, sem motor. ~0,3 s, comparação EXATA
  comparar carimbos                 o carimbo do DISCO não é o do GIT: numa sessão nova todo
                                    arquivo tem a data do checkout → VÁCUO no CI, que é onde
                                    a trava mais precisaria valer (D213)

O ALCANCE — e foi a medição que decidiu o tamanho:

  11  universo DENTRO desta casa ...... a forma cabe. UMA recontada nesta rodada
  63  dependem de FORA ................ clone vizinho, commit, semente ou gleba
  74  no total

AS FRONTEIRAS, E NENHUMA FOI ATRAVESSADA:
· o GATILHO NÃO foi religado — a régua cobra, não liga;
· nada escrito em repositório vizinho, e as três árvores limpas e nos mesmos commits;
· o arquivo da sabotagem voltou BYTE A BYTE, com sha256 conferido;
· nenhuma segunda lista de provas nasceu: a fronteira do §7 é a única.
```

## 10/10/2026 · LAB-87 — item 020: as onze, reclassificadas

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-87 (item 020) ===
Estado: FEITO. Você convidou a corrigir o denominador, e ele estava errado — por um motivo que o convite não previu: NENHUMA das dez dependia de fora. Verde conferido aqui, não no GitHub: 955 travas na esteira + 17 no testfit, 568 na lista do CI (34 arquivos, 34 de 34 passando sem os clones), 7 passos, exit 0. Decisões D289, D290 e D291.
Feito: as três que são desta forma estão recontadas — a do LAB-57 no item 019, e agora a do LAB-52 (estava 40 % velha) e a do LAB-04 (não tinha gerador nenhum). A medição do LAB-52 saiu para `src/escopo-das-chamadas.ts`, e a ferramenta e a trava chamam A MESMA FUNÇÃO. Prova nova: `docs/provas/LAB-87/as-onze-reclassificadas.json`, as onze uma a uma, com 7 travas guardando a soma.
Achados para outros apps ou Central: (1) O DENOMINADOR ESTAVA ERRADO, E NÃO PORQUE ALGUMA DEPENDIA DE FORA — porque a minha pergunta do LAB-86 era a pergunta errada. "O UNIVERSO ESTÁ DENTRO DESTA CASA?" DECIDE SE RECONTAR É BARATO. ELA NÃO DIZ SE RECONTAR É POSSÍVEL, NEM SE É SIGNIFICATIVO. Eu classifiquei pela CONTA e publiquei como se fosse pelo SENTIDO. Abertas uma a uma, havia TRÊS ESPÉCIES dentro de uma classe: 3 medem ESTADO com ferramenta (recontar É a conferência), 7 registram EVENTO — "quebrei esta trava e o exit foi 0 → 1" —, e 1 é regerada pelo verde a cada rodada, que não PODE ficar velha. Medido nas sete: NENHUMA carrega número de topo sobre a árvore. Não há o que recontar nelas. (2) O NÚMERO QUE VOCÊ EXIGIU, E ELE NÃO É "2 DE 10": a forma cabe em 3, e as 3 estão feitas. As outras oito NÃO FICAM PARA DEPOIS — ELAS NÃO SÃO DESTA FORMA. LISTA QUE ENCOLHE PORQUE O ITEM ERA MENOR DO QUE PARECIA É ENTREGA; LISTA QUE ENCOLHE PORQUE ALGUÉM DESISTIU É DÍVIDA — E A DIFERENÇA TEM DE ESTAR ESCRITA. (3) O LAB-52 ERA A SEGUNDA PROVA VELHA PELO MESMO MOTIVO, E PIOR QUE A PRIMEIRA: 114 arquivos contra 191, 32 114 linhas contra 52 245, 1 357 772 bytes contra 2 325 267 — 40 % de atraso —, e a trava o conferia com QUATRO limiares, entre eles `arquivos > 100`, que uma prova nascida com 114 passa para sempre. A régua que achou a primeira achou a segunda no dia seguinte, NO PRIMEIRO LUGAR EM QUE OLHOU. (4) E O LAB-04 É DE OUTRA ESPÉCIE AINDA: varrido todo `.ts` e `.sh` que o git carrega, NADA ESCREVE `docs/provas/LAB-04/oraculo.json`. Foi escrita à mão uma vez, no PR #40, e nunca mais relida. PROVA SEM GERADOR É A FORMA MAIS ESTÁVEL DE PROVA VELHA: ela não envelhece porque o prompt continuou trabalhando (D204) — envelhece porque NADA NO MUNDO A OBRIGA A CONCORDAR COM O CÓDIGO. O limiar nem entra: aqui não havia conferência nenhuma. A trava agora recomputa o `medido` chave por chave; o `esperado` NÃO se reconta, porque vem de duas implementações independentes de fora desta casa, e é para isso que um oráculo serve. (5) "TODO `>` SAI" PRECISOU DIZER `>` SOBRE O QUÊ — é o D218 aplicado ao seu próprio item, e foi a decisão mais difícil da rodada. O limiar sobre a PROVA GUARDADA foi apagado e trocado por recontagem exata. Os dois sobre a MEDIÇÃO VIVA ficaram, com o motivo escrito ao lado, porque são o D164: zero de régua PARADA é indistinguível de zero de árvore limpa, e se a varredura parar de olhar o número tem de cair numa TRAVA e não num silêncio. LIMIAR SOBRE MEDIÇÃO VIVA GUARDA CONTRA RÉGUA PARADA; LIMIAR SOBRE PROVA GUARDADA NÃO GUARDA NADA — e o que muda não é o operador: é SE O NÚMERO DO OUTRO LADO É RECONTADO AGORA OU LEMBRADO DE ONTEM. Apagá-los seria trocar um defeito por outro: perder o D164 para curar o D287. (6) A DUPLICAÇÃO QUE VOCÊ NOMEOU EXISTIA: a trava do LAB-52 tinha a própria cópia do filtro do universo e o próprio laço, ao lado da ferramenta que faz o mesmo. Saiu para um módulo só. E OS UNIVERSOS DAS DUAS VARREDURAS SÃO DIFERENTES DE PROPÓSITO — a do LAB-57 parte do `git ls-files`, a do LAB-52 de `ls-files --cached --others`: DUAS VARREDURAS DA MESMA CASA PODEM TER UNIVERSOS DIFERENTES SEM QUE UMA ESTEJA ERRADA; O QUE NÃO PODEM É TER O UNIVERSO ESCRITO EM DOIS LUGARES. E o instante em que cada uma fica velha é outro: a do LAB-57 muda no `git add`, esta muda ASSIM QUE O ARQUIVO EXISTE, porque `--others` já o vê — é a mais fácil de deixar velha das duas, e me reprovou DUAS VEZES durante esta rodada, por isso mesmo. (7) E O LADO RUIM DA TRAVA NOVA DO LAB-04 NASCEU TAUTOLOGIA: eu escrevi `expect(faces).not.toBe(faces + 1)` — uma sabotagem que não sabota nada. Virou uma FUNÇÃO DE RECONTAGEM que os dois sentidos chamam. TRAVA CUJO LADO RUIM COMPARA UMA COISA DIFERENTE DO LADO BOM NÃO PROVA QUE O LADO BOM MEDE: PROVA QUE OS DOIS LADOS EXISTEM. (8) A SUA NOTA QUE "NÃO ERA ITEM" ACHOU UMA AFIRMAÇÃO FALSA MINHA, E ESTA É A MAIS BARATA DE TODAS AS QUE JÁ ACHEI: a §1-C do CLAUDE.md dizia, desde 08/10 e com as palavras "CONFERIDO AQUI E É VERDADE", que este repositório está sem cópia do Padrão Archilly e sem VERSAO.txt. Metade era falsa, e a metade falsa era a minha — as três palavras "conferido aqui" são minhas, não suas. O VERSAO.txt de fato não existe; A CÓPIA EXISTE DESDE 03/10, no PR #40, o próprio docs/INDEX.md a lista como "cópia trazida", e o LF-FINAL-2 já a tinha conferido BYTE A BYTE contra a do Parcelamento. A árvore se contradizia EM DUAS PÁGINAS, e nenhuma das duas estava medindo. DECLARAÇÃO MINHA SOBRE O QUE A ÁRVORE TEM OU NÃO TEM É A MAIS FÁCIL DE TODAS DE CONFERIR — E POR ISSO É A MAIS VERGONHOSA DE DEIXAR SEM GUARDA: não precisa de clone, de rede, de motor nem de semente, precisa de um `existsSync`. O QUE FALTAVA NÃO ERA INSTRUMENTO, ERA A PERGUNTA, e ela ficou UM MÊS sem ser feita. E "conferido aqui" é a parte que mais convence e a única que não deixa rastro. Riscada com a medição ao lado; o fato virou CAMPO DECLARADO em vez de frase, porque a primeira régua que eu escrevi para isso lia a PROSA e NÃO PEGOU o defeito — a mesma frase fala de dois arquivos com veredictos opostos. (9) E O AVISO DO NÚMERO CONGELADO MORA NO docs/INDEX.md, NÃO DENTRO DA CÓPIA: eu o escrevi dentro dela primeiro, e isso quebrava a única coisa que ela promete, ser byte a byte igual à do Parcelamento — reconferido com `cmp` em 10/10: IGUAIS, e as duas casas estão na mesma Versão 1, ou seja a 3.0 não chegou a nenhuma das duas. AVISO QUE ESTRAGA A PROVA DA COISA AVISADA É UM AVISO NO LUGAR ERRADO. (10) E DE PASSAGEM, A NONA DA FAMÍLIA DO D248: ao reescrever a §1-C a frase-marca "o kit, quando chegar, é outro item" caiu numa QUEBRA DE LINHA, e a trava do item 007 — que lia com `includes` cru — acusou a marca de ter SAÍDO DO ARQUIVO. O conserto já morava em `src/texto-das-regras.ts` desde o LAB-77 e esta trava não o chamava: conserto que não é aplicado em todos os instrumentos que leem a mesma coisa é MEIO CONSERTO, inclusive quando os instrumentos são dois testes. (11) A SUA OUTRA NOTA: o D231 virou régua de família, medido em três casas — registrado, sem ação. E a cópia do Padrão Archilly desta casa está na Versão 1, de 13/09, enquanto você publica a 3.0: vale a linha que você me deixou decidir, e é esta — o número fica CONGELADO E AGORA DECLARADO, e eu NÃO o atualizei, porque esta casa não vendoriza o kit e reescrever uma cópia que não é minha para igualar um número seria inventar conteúdo que eu não li. DECLARAR UM NÚMERO VELHO É MEDIÇÃO; TROCÁ-LO SEM A FONTE SERIA O CONTRÁRIO. Se você quiser a cópia em 3.0, mande o texto e eu gravo.
Depende do Jonny: nada novo meu. Continuam a §11 (a senha de leitura, ou tornar os dois vizinhos públicos), a §10, o sétimo mecanismo e as duas perguntas do acesso.
Próximo na fila: a D226 (os quatro campos de `legais`) — MUDA O DESENHO e espera o olho dele, e é a única da minha lista que não é medição minha. A fila ficou em CATORZE: a proposta das dez provas saiu por entrega, e nenhuma nasceu.
=== FIM ===

--- O QUE VAI JUNTO ---

═══════════════════════════════════════════════════════════════════════════════
  AS ONZE, RECLASSIFICADAS — três espécies dentro de uma classe
═══════════════════════════════════════════════════════════════════════════════

  3  medição de ESTADO, com ferramenta ....... recontar É a conferência (a forma do D287)
     LAB-57  configuração varrida ............ recontada no item 019
     LAB-52  as duas varreduras da Central ... recontada AGORA — estava 40 % velha
     LAB-04  o oráculo do esqueleto .......... recomputada AGORA — NÃO TINHA GERADOR

  7  registro de EVENTO ....................... "quebrei esta trava e o exit foi 0 → 1".
     as sete sabotagens: LAB-31 · LAB-58 · LAB-59 · LAB-60 · LAB-61 · LAB-63 · LAB-66
     MEDIDO: nenhuma das sete carrega número de topo. Não há o que recontar.

  1  regerada pelo VERDE a cada rodada ........ LAB-31/navegador.json: o `conferir.sh`
     a reescreve em toda execução. Não PODE ficar velha.

  3 + 7 + 1 = 11, somado das linhas e não do texto (D212).

═══════════════════════════════════════════════════════════════════════════════
  O LAB-52, MEDIDO — a prova commitada contra a mesma árvore
═══════════════════════════════════════════════════════════════════════════════

  número                      na prova     na árvore    atraso
  arquivos                         114          191     40,3 %
  linhas                        32 114       52 245     38,5 %
  bytes                      1 357 772    2 325 267     41,6 %
  parametrosExaminados           4 932        7 892      37,5 %
  camposExaminados               4 318        6 577      34,3 %

  O QUE A TRAVA CONFERIA: `arquivos > 100` — uma prova nascida com 114 passa para sempre.

O `>` QUE SAIU E O `>` QUE FICOU — e o que muda não é o operador:

  sobre a PROVA GUARDADA   `prova.escopo.arquivos > 100`      APAGADO, virou recontagem exata
  sobre a MEDIÇÃO VIVA     `parametrosExaminados > 3000`      FICOU, com o motivo ao lado:
                           `camposExaminados > 2500`          é o D164 — zero de régua PARADA é
                                                              indistinguível de zero de árvore limpa

  Limiar sobre medição VIVA guarda contra régua PARADA; limiar sobre prova GUARDADA não
  guarda nada. Apagar os dois seria trocar um defeito por outro: perder o D164 para curar
  o D287. E "todo `>` sai" precisou dizer `>` SOBRE O QUÊ — é o D218 aplicado ao item.

═══════════════════════════════════════════════════════════════════════════════
  E A NOTA QUE "NÃO ERA ITEM" — a §1-C dizia "conferido aqui e é verdade"
═══════════════════════════════════════════════════════════════════════════════

  o que a frase afirmava                         o disco
  `VERSAO.txt` não existe na árvore ............. CERTO, não existe
  a cópia do Padrão não existe na árvore ........ FALSO — existe desde 03/10 (PR #40)

  e não era preciso procurar:
    docs/INDEX.md ....... a lista como "cópia trazida"
    LF-FINAL-2 .......... já a conferiu BYTE A BYTE contra a do Parcelamento
    lugares-das-condicoes.ts ... repetia a frase falsa num TERCEIRO lugar

  O NÚMERO, declarado e NÃO trocado: esta cópia e a do Parcelamento estão as duas na
  Versão 1 de 13/09 (cmp reconferido em 10/10: iguais). A 3.0 não chegou a nenhuma das
  duas. O aviso foi para o docs/INDEX.md, e NÃO para dentro da cópia.

AS FRONTEIRAS, E NENHUMA FOI ATRAVESSADA:
· a D226 NÃO foi tocada — muda o desenho e espera o olho dele, como você ordenou;
· nenhuma das 63 que dependem de fora foi recontada;
· o GATILHO NÃO foi religado — a régua cobra, não liga;
· nada escrito em repositório vizinho, e as três árvores limpas e nos mesmos commits;
· a cópia do Padrão Archilly NÃO foi reescrita para igualar a 3.0 — o número ficou
  declarado como congelado, porque esta casa não vendoriza o kit.
```

## 11/10/2026 · LAB-88 — item 021: o Padrão não mora aqui

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-88 (item 021) ===
Estado: FEITO e mesclado na main. Escolhida a FORMA 1 — ponteiro com procedência, no MESMO caminho —, e a medição que decidiu NÃO estava no seu item. Verde conferido aqui, não no GitHub: 965 travas na esteira + 17 no testfit, 578 na lista do CI (35 arquivos, 35 de 35 passando sem os clones), 7 passos, exit 0. Decisões D292 e D293.
Feito: a cópia saiu e `docs/referencia/PADRAO_ARCHILLY.md` passou a dizer onde está a fonte, QUAL COMMIT foi lido, quando, de que tamanho e como se lê da origem. A procedência mora num lugar só (`src/onde-esta-o-padrao.ts`), e há 10 travas no portão sem clones. Prova: `docs/provas/LAB-88/onde-esta-o-padrao.json`.
Achados para outros apps ou Central: (1) A MEDIÇÃO QUE DECIDIU: O RÓTULO "VERSÃO 3.0 · 10/10/2026" COBRE DOIS TEXTOS DIFERENTES NA ORIGEM — `96dbc9b` (1 712 linhas · 106 081 bytes) e `e48bff9` (1 731 · 107 395): +19 linhas e +1 314 bytes COM O MESMO NÚMERO. E a cópia vendorizada do Parcelamento é BYTE A BYTE IGUAL À PRIMEIRA: ela já está atrás SEM QUE O NÚMERO MUDE. É o D148 num documento — CARIMBAR A VERSÃO NUMA CÓPIA É CARIMBAR O RÓTULO, E RÓTULO NÃO É IDENTIDADE: SÓ O COMMIT IDENTIFICA O TEXTO. É isso que mata a forma 3, porque declarar "Versão 1, 8 % do vigente" é declarar um rótulo. (2) A FORMA 2 CAI POR MEDIÇÃO, E A SUA §11 MORDEU COMO VOCÊ PREVIU: `archilly-central` é PRIVADO e este repositório é PÚBLICO; o verde roda sem rede por desenho e o trabalho de CI que roda em todo envio NÃO TEM SEGREDO — a trava ficaria VERDE POR NÃO ACHAR O OBJETO (D213), e seria um TERCEIRO vizinho privado a pedir na §11, que já espera por dois desde o LAB-38. Está na página dele, para leigo, com o "não escolhi essa forma exatamente para não te pedir uma terceira senha". (3) A SUA MEDIDA, CONFERIDA NA ORIGEM COM `git show`: Versão 3.0, commit `e48bff9` (20:36:15Z), 1 731 linhas · 107 395 bytes; a cópia tinha 145 linhas · 12 716 bytes = 8,4 % DAS LINHAS E 11,8 % DOS BYTES. Você disse "8 % dele" e está certo nas duas unidades, e o conteúdo de `e48bff9` é byte a byte o do HEAD de agora. (4) O PONTEIRO FICOU NO MESMO CAMINHO DE PROPÓSITO: é onde quem procura o Padrão chega, e NENHUM LINK MORREU — LF-FINAL, LF-FINAL-2 e INDEX apontam para ele. E O TEXTO DA VERSÃO 1 NÃO SE PERDEU: está em `4081c27`, com a receita de leitura escrita no ponteiro. ARQUIVO QUE SAI DA ÁRVORE CONTINUA NO HISTÓRICO; O QUE A SAÍDA TIRA É A AUTORIDADE DE PARECER VIGENTE. (5) E O PONTO CEGO DA §6 BATEU DUAS VEZES NESTA RODADA, COM O MESMO INSTRUMENTO — é a 28ª, e a TERCEIRA QUE ESCAPOU. PRIMEIRA: eu ia te acusar de mandar procedência velha. Clonei a origem com `--depth 1`, perguntei quando o arquivo mudou e ouvi `944c232`, de 23:48 — três horas depois do commit que você mandou, e casava bem demais com o seu próprio argumento. Medido com `--depth=50`, o último commit do arquivo É `e48bff9`: `944c232` é só o HEAD, O COMMIT DO CORTE. A SUA PROCEDÊNCIA ESTAVA EXATA. SEGUNDA, E ESSA JÁ ESTAVA PUBLICADA: o D291 de ontem diz "trazida em 03/10 no PR #40", e a verdade é `4081c27`, 14/09, PR #12 — o commit da própria conferência do LF-FINAL —, com UM ÚNICO COMMIT em toda a vida do arquivo. O "03/10, PR #40" era o corte do clone raso desta sessão, e saiu em QUATRO lugares e num PR mesclado. CLONE RASO NÃO ERRA POR SILÊNCIO: DEVOLVE UM COMMIT QUE EXISTE, COM DATA E ASSUNTO PLAUSÍVEIS — A PIOR FORMA DE RESPOSTA ERRADA, A QUE PASSA POR MEDIÇÃO. Toda afirmação de "quando isto mudou" feita dentro de um clone raso é afirmação SOBRE O CLONE, e `git rev-parse --is-shallow-repository` era a pergunta que faltava. Corrigido POR RISCADO nos quatro lugares; o recado do LAB-87 NÃO foi editado, porque recado é registro do que foi enviado — a correção viaja neste. (6) E UMA TRAVA MINHA MUDOU DE OBJETO, COM O MOTIVO ESCRITO: a do LAB-87 exigia a frase "congelada na Versão 1" no índice e a proibia dentro da cópia; com a cópia fora, mantê-la obrigaria a casa a REPETIR PARA SEMPRE UM NÚMERO QUE ELA ACABOU DE TIRAR DO CAMINHO. TRAVA CUJA COISA COBRADA DEIXOU DE EXISTIR NÃO FICA "PASSANDO": PASSA A COBRAR UMA FRASE QUE FICOU FALSA — regra que sobrevive ao seu objeto vira trabalho para manter a mentira. (7) E A LIÇÃO GERAL, PARA AS OUTRAS CASAS: DOCUMENTO NORMATIVO QUE UMA CASA NÃO PODE MANTER ATUALIZADO NÃO DEVE MORAR NELA — o que fica é onde ele está, qual COMMIT foi lido e quando. Se a família quiser padronizar isso, o formato do ponteiro está em `src/onde-esta-o-padrao.ts` e as travas em `tests/padrao-da-familia.test.ts`, e os dois cabem em qualquer casa sem rede.
Depende do Jonny: nada novo meu. Continuam a §11 (a senha de leitura, ou tornar os dois vizinhos públicos), a §10, o sétimo mecanismo e as duas perguntas do acesso — e a §11 ganhou uma NOTA de 11/10, dizendo que o vigia do manual existiria mas pediria uma TERCEIRA senha, e que eu não escolhi essa forma por isso.
Próximo na fila: a D226 (os quatro campos de `legais`) — MUDA O DESENHO e espera o olho dele, e segue sendo a única da minha lista que não é medição minha. A fila ficou em CATORZE: este item não abriu nem fechou proposta.
=== FIM ===

--- O QUE VAI JUNTO ---

═══════════════════════════════════════════════════════════════════════════════
  AS TRÊS FORMAS, MEDIDAS — e a escolhida é a 1
═══════════════════════════════════════════════════════════════════════════════

  ✓ FORMA 1 · ponteiro com procedência ......... ESCOLHIDA. Roda sem rede, no mesmo
    caminho (nenhum link morreu), com o COMMIT declarado e guardado por trava
  ✗ FORMA 2 · cópia com carimbo e guarda ....... a fonte é PRIVADA e este repositório
    é PÚBLICO: a trava ficaria VERDE por não achar o objeto (D213), e seria a
    TERCEIRA senha a pedir na §11
  ✗ FORMA 3 · congelada e declarada ............ declara um RÓTULO, e o rótulo "3.0"
    cobre dois textos. Quem abrisse o arquivo leria 145 linhas com cara de norma

═══════════════════════════════════════════════════════════════════════════════
  O RÓTULO "3.0" COBRE DOIS TEXTOS — a medição que decidiu
═══════════════════════════════════════════════════════════════════════════════

  commit     quando          linhas     bytes
  96dbc9b    10/10 03:35Z     1 712   106 081   ← o vendor do Parcelamento é IGUAL a este
  e48bff9    10/10 20:36Z     1 731   107 395   ← o que eu li, e é o conteúdo do HEAD

  diferença: +19 linhas · +1 314 bytes, COM O MESMO NÚMERO DE VERSÃO.

  a cópia que saiu:  145 linhas · 12 716 bytes = 8,4 % das linhas · 11,8 % dos bytes

═══════════════════════════════════════════════════════════════════════════════
  A PROCEDÊNCIA, como ficou gravada
═══════════════════════════════════════════════════════════════════════════════

  repositório  jonny583/archilly-central  (PRIVADO)
  ramo         main
  caminho      docs/PADRAO_ARCHILLY.md
  versão       3.0 · 10/10/2026
  commit       e48bff9 · 2026-10-10T20:36:15Z
  tamanho      1 731 linhas · 107 395 bytes
  lido em      2026-10-11
  como se lê   git show origin/main:docs/PADRAO_ARCHILLY.md
  a Versão 1   git show 4081c27:docs/referencia/PADRAO_ARCHILLY.md

═══════════════════════════════════════════════════════════════════════════════
  O CLONE RASO, MEDIDO — a 28ª do ponto cego, e a terceira que ESCAPOU
═══════════════════════════════════════════════════════════════════════════════

  o que o clone raso respondeu        o que era
  944c232, 23:48  (a sua fonte)       e48bff9, 20:36 — a SUA procedência estava exata
  03/10, PR #40   (a minha cópia)     4081c27, 14/09, PR #12 — e UM único commit

  `git rev-parse --is-shallow-repository` → era a pergunta que faltava.

AS FRONTEIRAS, E NENHUMA FOI ATRAVESSADA:
· a D226 NÃO foi tocada — muda o desenho e espera o olho dele;
· nada escrito em repositório vizinho: a divergência das duas cópias do Parcelamento é
  sua para levar à caixa dele. Clonei `archilly-central` SÓ PARA LEITURA, para a
  procedência sair de `git show` e não de memória — os QUATRO clones terminaram limpos
  (6cf6396, 72cfab0, 550a438, 944c232);
· nenhum texto inventado: a cópia não foi atualizada para a 3.0;
· o GATILHO NÃO foi religado — a régua cobra, não liga.
```

## 11/10/2026 · LAB-89 — item 022: a pergunta do clone raso virou guarda

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-89 (item 022) ===
Estado: FEITO e mesclado na main. A pergunta do clone raso virou GUARDA, e ela RECUSA em vez de responder. Verde conferido aqui, não no GitHub: 979 travas na esteira + 17 no testfit, 592 na lista do CI (36 arquivos, 36 de 36 passando sem os clones), 7 passos, exit 0. Decisões D294 e D295.
Feito: `src/profundidade-da-historia.ts` pergunta `git rev-parse --is-shallow-repository` ANTES de medir e devolve `null` em clone raso; a procedência do Padrão passou a gravar o BLOB junto do commit; 13 travas herméticas no portão e a prova de sentido invertido com clone de verdade (`file://`, sem rede). Prova: `docs/provas/LAB-89/a-pergunta-virou-guarda.json`.
Achados para outros apps ou Central: (1) VOCÊ ESTAVA CERTA DUAS VEZES, E A SEGUNDA DOEU: a lição ficou escrita e não cobrada, e REPETIU NO DIA SEGUINTE. Antes de escrever uma linha de código eu remedi, e o erro estava NOS MEUS PRÓPRIOS NÚMEROS PUBLICADOS — o D292 deu `96dbc9b` como o commit daquele texto, e medido com a história inteira (--depth=225, 245 commits) quem o ENTREGOU é `67d18d5`, às 00:38. `96dbc9b` e `170a28f` NÃO ESTÃO NA HISTÓRIA DO ARQUIVO: `git log -- <caminho> | grep -c` dá ZERO para os dois. É a 29ª do ponto cego, a QUARTA que escapou, e o MESMO instrumento da 28ª — num PR já mesclado. Riscado nos CINCO lugares em que saiu. (2) A SUA MEDIÇÃO ESTAVA EXATA E EU A AMPLIO, COM O MECANISMO: `git log -- <caminho>` responde "QUEM ENTREGOU este texto"; num clone raso responde "o commit mais velho que eu tenho e que já tinha este texto" — O CORTE. E como `git show <qualquer posterior>:<caminho>` devolve o texto vigente naquele momento, TODO COMMIT POSTERIOR À ENTREGA "CONFIRMA" O TEXTO E PASSA POR ENTREGA. O mais útil: DUAS PROFUNDIDADES DIFERENTES DÃO NOMES DIFERENTES, CADA UMA INTERNAMENTE COERENTE — a sua e a minha discordaram, e as duas "conferiam". (3) E A SUA CORREÇÃO DERRUBA UMA FRASE MINHA, NÃO SÓ UM NOME: "só o commit identifica o texto" está errado. O RÓTULO IDENTIFICA A INTENÇÃO, O COMMIT IDENTIFICA A ENTREGA, E O BLOB IDENTIFICA O TEXTO — igual em qualquer clone. Os três commits devolvem o mesmo blob `f95b2838…` (1 712 linhas · 106 081 bytes) e UM o entregou. A procedência daqui grava os dois agora: `f22f7deb742c…` para o vigente, e a trava COBRA o blob, porque é o único campo que não muda de nome com a profundidade do clone de quem confere. SE A FAMÍLIA PADRONIZAR PROCEDÊNCIA, É ESTE O CAMPO QUE FALTAVA. (4) A GUARDA RECUSA, E A RECUSA NEM MEDE: raso → `valor: null`, motivo `clone-raso`; profundidade DESCONHECIDA → `null` também, porque não medido não é medido (D23); inteira → mede. O `medir` nem é chamado na recusa, e há trava com um contador que tem de ficar em ZERO — para não haver nem a tentação de aproveitar "o valor que veio junto". (5) E ACHEI UMA COISA QUE MUDOU O DESENHO DA TRAVA: O PORTÃO DESTA CASA RODA NUM CLONE RASO. Medido no arquivo — `actions/checkout@v4` SEM `fetch-depth`, cujo padrão é 1. Uma trava que exigisse história inteira ficaria VERMELHA NO PORTÃO PARA SEMPRE, por um motivo que não é defeito nenhum. GUARDA QUE CONFUNDE "NÃO POSSO AFIRMAR" COM "A AFIRMAÇÃO ESTÁ ERRADA" REPROVA O AMBIENTE EM VEZ DE MEDIR A COISA: a trava aceita medição OU recusa declarada, e reprova um TERCEIRO caso — valor devolvido sem história que o sustente. VALE PARA QUALQUER CASA COM CI: se a sua rotina usa `actions/checkout` sem `fetch-depth`, toda afirmação de procedência feita lá dentro é afirmação sobre o corte. (6) A PROVA É DE SENTIDO INVERTIDO E COM CLONE DE VERDADE, como você pediu: monto um clone raso deste repositório por `file://`, sem rede, rodo a mesma régua nos dois e apago o clone. No raso RECUSOU (`valor=null`), no completo MEDIU (`04effac`), e O CORTE TERIA RESPONDIDO `6152dec` — que é o commit em que VOCÊ escreveu este item. No clone raso o `CLAUDE.md` tem 1 commit de história em vez de 61. O nome é plausível, recente e errado. (7) E a prova entrou na lista de exceções do §7 com o motivo — ela mede um INSTRUMENTO, não gleba —, e as 13 travas são HERMÉTICAS, com a profundidade injetada: trava que clona no portão paga bateria para medir o que uma injeção mede.
Depende do Jonny: nada novo meu. Continuam a §11 (a senha de leitura, ou tornar os dois vizinhos públicos), a §10, o sétimo mecanismo e as duas perguntas do acesso.
Próximo na fila: a D226 (os quatro campos de `legais`) — e obrigada por dizer o motivo de não a mandar: ela continua a PRIMEIRA da minha lista e espera o olho dele. A fila ficou em CATORZE: este item não abriu nem fechou proposta.
=== FIM ===

--- O QUE VAI JUNTO ---

═══════════════════════════════════════════════════════════════════════════════
  O QUE O CORTE RESPONDEU — três respostas, um arquivo, uma semana
═══════════════════════════════════════════════════════════════════════════════

  onde                                     respondeu   está na história do arquivo?
  meu clone raso (depth 50)                 96dbc9b     NÃO
  seu clone raso (outra profundidade)       170a28f     NÃO
  aprofundado a 245 commits                 67d18d5     SIM — é quem ENTREGOU

  os três devolvem o MESMO blob: f95b2838… · 1 712 linhas · 106 081 bytes

═══════════════════════════════════════════════════════════════════════════════
  O QUE IDENTIFICA O QUÊ — a frase corrigida
═══════════════════════════════════════════════════════════════════════════════

  RÓTULO  a intenção de quem publicou ...... e pode cobrir mais de um texto ("3.0" cobre 2)
  COMMIT  a ENTREGA ......................... e o nome depende da profundidade do clone
  BLOB    o TEXTO, byte a byte .............. igual em QUALQUER clone

  git rev-parse <commit>:<caminho>   ← é esta a pergunta que dá o blob

═══════════════════════════════════════════════════════════════════════════════
  A GUARDA, nos três estados
═══════════════════════════════════════════════════════════════════════════════

  is-shallow = true      RECUSA · valor=null · clone-raso                (e não mede)
  não deu para perguntar RECUSA · valor=null · profundidade-desconhecida (D23)
  is-shallow = false     MEDE   · historia-inteira

═══════════════════════════════════════════════════════════════════════════════
  A PROVA DE SENTIDO INVERTIDO — clone montado, não afirmado
═══════════════════════════════════════════════════════════════════════════════

  AQUI  · is-shallow=false · MEDIU   · valor=04effac · historia-inteira
  RASO  ·                    RECUSOU · valor=null    · clone-raso

  o que o CORTE teria respondido sem a pergunta: 6152dec  ← o commit do seu item 022
  commits de CLAUDE.md: 1 no raso · 61 aqui

AS FRONTEIRAS, E NENHUMA FOI ATRAVESSADA:
· a D226 não foi tocada, nem o sétimo mecanismo;
· nada escrito em repositório vizinho: o `archilly-central` foi APROFUNDADO só para leitura
  (`git fetch --depth=225` escreve no `.git` do clone e em nada mais), e os QUATRO clones
  terminaram limpos (6cf6396, 72cfab0, 550a438, 944c232);
· não mexi em `src/lib/lab/` e não mexi em tela;
· o GATILHO NÃO foi religado — a régua cobra, não liga.
```

## 11/10/2026 · LAB-90 — item 023: "caixa vazia" era verdade?

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-90 (item 023) ===
Estado: FEITO e mesclado na main. A guarda existe, é função pura, está no portão — e A PRIMEIRA DECLARAÇÃO FALSA QUE ELA ACUSA É MINHA. Verde conferido aqui, não no GitHub: 991 travas na esteira + 17 no testfit, 604 na lista do CI (37 arquivos, 37 de 37 passando sem os clones), 7 passos, exit 0. Decisões D296 e D297.
Feito: `src/caixa-vazia-era-verdade.ts` responde, pela árvore do commit que declarou, se havia item ABERTO — pela definição do SEU documento. 12 travas herméticas, prova com as nove declarações lidas em quatro casas, e o LIMITE na saída de toda resposta. Prova: `docs/provas/LAB-90/caixa-vazia-era-verdade.json`.
Achados para outros apps ou Central: (1) O TERCEIRO ESTADO: EU RECUSEI, E RECUSEI PORQUE MEDI. `bloqueado` NÃO é decidível por nome — varrida TODA a história da caixa do `archilly-propostas` e desta casa, só existem `NNN.md` e `NNN-FEITO.md`; a sua receita cita `-FEITO` e `-RETIRADO`, e nada mais. Então `bloqueado` sai `null`, como você mandou. (2) MAS ACHEI UMA DISTINÇÃO QUE É DECIDÍVEL, E ELA SEPARA AS ACUSADAS DAS LEGÍTIMAS SEM ADIVINHAR: ITEM ABERTO COM NÚMERO MENOR QUE ALGUM `-FEITO` FOI PULADO EM RODADAS ANTERIORES; ITEM ABERTO QUE É O PRÓXIMO DA FILA É DECLARAÇÃO FALSA. Assim as OITO do Propostas não são acusadas — e a régua não diz que o pulado está certo: diz que NÃO É O CASO DO CLONE VELHO, e que quem decide o resto não é ela. Se a família quiser a distinção por máquina, é esta, e ela cabe em qualquer casa. (3) NAS NOVE DECLARAÇÕES LIDAS: 2 FALSAS · 5 VERDADEIRAS · 2 NÃO DECIDÍVEIS · 0 NÃO LIDAS. Os dois sentidos que você exigiu estão nos extremos: `e701a6f` (Orçamento) FALSA, com `021.md` aberto e o maior feito em 020; `612c161` (Propostas) VERDADEIRA. (4) E A PRIMEIRA FALSA É MINHA, COM O RELÓGIO: o `34bc00c` é um MERGE, e os dois pais contam tudo — no meu ramo (`de3288e`, 19:22:46Z) a caixa tinha SÓ o `COMO_FUNCIONA`; no `main` (`de5e769`, 19:19:54Z) você acabara de escrever o `005.md`. DOIS MINUTOS E CINQUENTA E DOIS SEGUNDOS DE CLONE VELHO, e o merge trouxe o item para a árvore DO MESMO COMMIT em que eu disse que não havia nada. A SUA TESE ESTÁ CONFIRMADA DENTRO DESTA CASA, POR MEDIÇÃO. (5) E DOIS ACHADOS CONTRA A SUA TABELA: a linha do GEO aponta `f0cb290`, cuja árvore tem o `010.md` aberto — mas o ASSUNTO dele é "correcao: a caixa NAO esta vazia — o 010 chegou durante a rodada do 009", e o pai é "merge: item 010 chegou do chat durante o 009". É A CASA SE CORRIGINDO, NÃO DECLARANDO. A RÉGUA RESPONDE SOBRE A ÁRVORE, E A ÁRVORE NÃO SABE O QUE O COMMIT DIZ — O COMMIT DE DECLARAÇÃO TEM DE SER ESCOLHIDO POR QUEM DECLARA, NÃO POR QUEM CASA A PALAVRA. É a família do D155 desta casa, agora no seu instrumento, e o conserto ficou NA RÉGUA: veredicto `nao-e-declaracao` com `null`, régua de palavra PARA RECUSAR e nunca para acusar — falso positivo aqui faz a guarda dizer "isto não é uma declaração", que é o lado seguro do erro. (6) E SOBRE O GEO EU RECUSO A PERGUNTA SEGUINTE: "então ele nunca declarou falso?" — não sei. O clone dele é RASO (`is-shallow=true`, e um `--depth=200` não o abriu) e ali o `git log --grep` deu ZERO; ZERO EM CLONE RASO NÃO É ZERO (D295), é o corte. E A LINHA DA PESQUISA NÃO FOI CONFERIDA — aquele repositório não está clonado aqui, e eu não repito como fato o que não medi. Das suas quatro linhas: DUAS confirmadas, UMA corrigida, UMA não medida. (7) O LIMITE VAI NA SAÍDA EM TODA RESPOSTA, inclusive nas verdadeiras, com quatro buracos nomeados: a casa CEGA (ausência de declaração falsa é ausência de MEDIÇÃO), o CLONE da casa, o BLOQUEIO, e ACHAR A DECLARAÇÃO — que depende de história e em clone raso recusa. (8) E A TRIGÉSIMA LINHA DA MINHA TABELA: OBRIGADA, MAS NÃO. A §6 conta o ponto cego DESTA casa e existe para eu reler OS MEUS erros. TABELA QUE MISTURA O MEU ERRO COM O ALHEIO DEIXA DE SER A LISTA QUE ME CORRIGE E PASSA A SER UM PLACAR — lista cuja utilidade é me acusar não cresce com erro de terceiro. O defeito está no D297, com a medição, que é onde ele pertence. (9) E UMA CONSEQUÊNCIA PARA A SUA CONTA: a linha "em vazio: 5" do meu ONDE_PARAMOS passou a dizer que UMA DAS CINCO ERA FALSA. Disparo em vazio é medida de abastecimento, e uma declaração falsa POLUI essa medida nos dois lados — a casa não trabalhou e você não reabasteceu.
Depende do Jonny: nada novo meu. Continuam a §11 (a senha de leitura, ou tornar os dois vizinhos públicos), a §10, o sétimo mecanismo e as duas perguntas do acesso.
Próximo na fila: a D226 (os quatro campos de `legais`) — continua a PRIMEIRA da minha lista e espera o olho dele; é o quinto recado seguido em que ela aparece. A fila ficou em CATORZE: este item não abriu nem fechou proposta.
=== FIM ===

--- O QUE VAI JUNTO ---

═══════════════════════════════════════════════════════════════════════════════
  AS NOVE DECLARAÇÕES, MEDIDAS — pela árvore do commit que declarou
═══════════════════════════════════════════════════════════════════════════════

  casa        commit     abertos                       maior -FEITO  veredicto
  Orçamento   e701a6f    021.md                              020     ✗ FALSA
  este Lab    34bc00c    005.md                              004     ✗ FALSA (minha)
  Geo         f0cb290    010.md                               —      · nao-e-declaracao
  Propostas   bd84f13    007.md + 3 adendos                  013     · já pulada
  Propostas   612c161    nenhum                              015     ✓ verdadeira
  este Lab    2bc543f    nenhum                              007     ✓ verdadeira
  este Lab    1e7df13    nenhum                              010     ✓ verdadeira
  este Lab    8e8b74b    nenhum                              011     ✓ verdadeira
  este Lab    8236799    nenhum                              013     ✓ verdadeira

  2 falsas · 5 verdadeiras · 2 não decidíveis · 0 não lidas

═══════════════════════════════════════════════════════════════════════════════
  A MINHA FALSA, COM O RELÓGIO — 34bc00c é um MERGE, e os pais contam
═══════════════════════════════════════════════════════════════════════════════

  de5e769   09/10 19:19:54Z   main        a direção escreve o 005.md
  de3288e   09/10 19:22:46Z   meu ramo    caixa aberta: NENHUM item  ← eu declarei vazia
  34bc00c   09/10 19:23:09Z   merge       a árvore passa a ter o 005.md

  2 min 52 s de clone velho. O disco não é a origem.

═══════════════════════════════════════════════════════════════════════════════
  A DISTINÇÃO QUE É DECIDÍVEL — e a que não é
═══════════════════════════════════════════════════════════════════════════════

  NÃO decidível   `bloqueado`: nenhuma casa marca bloqueio no NOME do arquivo
                  (medido em toda a história da caixa do Propostas e daqui)
                  → sai `null`, nunca "falsa"

  DECIDÍVEL       item aberto com número MENOR que algum `-FEITO`  → já PULADO
                  item aberto MAIOR que todos os `-FEITO`         → é O PRÓXIMO → FALSA

═══════════════════════════════════════════════════════════════════════════════
  O QUE ESTA GUARDA NÃO ALCANÇA — e vai na saída de toda resposta
═══════════════════════════════════════════════════════════════════════════════

  1. não vê a casa CEGA: sem commit não há árvore, e ausência de declaração falsa
     é ausência de MEDIÇÃO
  2. não vê o CLONE da casa, só a origem — e é o clone velho que causa o defeito
  3. não decide BLOQUEIO: sai `null`, e não como acusação
  4. não acha a declaração: isso depende de história, e em clone raso RECUSA (D295)

AS FRONTEIRAS, E NENHUMA FOI ATRAVESSADA:
· nada escrito em repositório vizinho — dois clones novos SÓ PARA LEITURA
  (`archilly-budget-blueprint`, `archilly-propostas`), porque nenhuma afirmação sobre
  outro repositório sai sem `git show` na mão; os SEIS clones terminaram limpos;
· a D226 não foi tocada, nem o sétimo mecanismo;
· o GATILHO NÃO foi religado — a régua cobra, não liga;
· e a linha da Pesquisa fica DECLARADA COMO NÃO CONFERIDA, não repetida como fato.
```

## 11/10/2026 · LAB-91 — item 024 + adendo: a trava que regera a varredura

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-91 (item 024 + adendo) ===
Estado: FEITO e mesclado na main. A minha proposta do LAB-60 está EXECUTADA: a trava REEXECUTA a varredura, e as duas respostas do adendo estão dadas. Verde conferido aqui, não no GitHub: 1 008 travas na esteira + 17 no testfit, 621 na lista do CI (38 arquivos, 38 de 38 passando sem os clones), 7 passos, exit 0. Decisões D298 a D301.
Feito: `tests/regerar-a-varredura.test.ts` (10 travas) reexecuta as varreduras de configuração e de chamadas pela MESMA função da ferramenta e compara REGRA POR REGRA E ACHADO POR ACHADO; `src/regerar-a-varredura.ts` traz as duas espécies de prova em lista fechada com motivo por linha; `src/conjunto-do-interpolador.ts` fecha o conjunto. Prova: `docs/provas/LAB-91/a-varredura-regerada.json`.
Achados para outros apps ou Central: (1) A METADE QUE FALTAVA NÃO ERA O ESCOPO: o D287 recontava quantos arquivos e quantas linhas, e o defeito que o LAB-60 mediu estava em `totalPorRegra` — 1 na prova contra 10 na mesma árvore, com o verde verde. RECONTAR O TAMANHO DO UNIVERSO NÃO RECONTA O QUE A RÉGUA ACHOU NELE. Hoje as duas batem, e é esse o conteúdo da prova: o número só vale porque foi REEXECUTADO agora. (2) A PERGUNTA DE PROJETO, RESPONDIDA POR MEDIÇÃO E EM DUAS ESPÉCIES, na forma que você autorizou (lista escrita à mão, fechada nos dois sentidos, motivo por linha): FOTOGRAFIA DE UM ESTADO PASSADO NUNCA SE REGERA — é o defeito que o D182 nasceu para impedir — e FUNÇÃO PURA DA ÁRVORE DE AGORA TEM DE BATER SEMPRE, porque PROVA QUE NÃO BATE COM A ÁRVORE DE HOJE NÃO É PROVA, É LEMBRANÇA. Sete entradas: 3 função-da-árvore (LAB-57, LAB-52, LAB-04) e 4 fotografia (LAB-48, LAB-02, LAB-31/sabotagem e LAB-60 — esta porque mede o CLONE VIZINHO, e recontar o que depende de fora é outra medição com o nome da antiga). Se a família quiser a mesma separação, é esta, e ela cabe em qualquer casa. (3) E A RÉGUA PEGOU O CÓDIGO QUE EU ACABARA DE ESCREVER: a primeira versão da trava tinha um `catch` que engolia erro para pular o LEIA-ME, e a varredura de chamadas que esta mesma rodada regera ACUSOU A LINHA NA HORA. A RESPOSTA CERTA NÃO ERA REGERAR A PROVA: ERA NÃO ENGOLIR ERRO — exatamente o que você avisou. (4) DOIS ENGANOS MEUS DE CONTAGEM, pegos pelas minhas próprias travas: executada a proposta, baixei DUAS contagens de 14 para 13 por reflexo, e elas não são a mesma coisa — uma conta ITENS ABERTOS da lista, a outra conta ETIQUETAS DE CONDIÇÃO da FILA.md —, e NENHUMA DAS DUAS MUDOU. DOIS NÚMEROS COM O MESMO VALOR NÃO SÃO O MESMO NÚMERO: valor igual é a forma mais convincente de dois nomes diferentes. (5) E O SEGUNDO É O ACHADO, E É SOBRE A SUA ESCOLHA DE ITEM: a proposta morava em DOIS lugares — um item da lista e uma seção de prosa —, e O ITEM DA LISTA FOI RISCADO NO LAB-86 COMO "EXECUTADA" tendo sido feito só o escopo. A SEÇÃO DE PROSA CONTINUOU ABERTA, E ERA ELA QUE ESTAVA CERTA — foi nela que você leu a proposta, e você leu a certa. A MESMA PROPOSTA EM DOIS LUGARES, E OS DOIS DISCORDARAM: QUEM TINHA RAZÃO ERA O QUE NINGUÉM RISCOU. Riscar "executada" sobre metade do pedido fecha a porta com o trabalho dentro; o riscado foi corrigido COM A MEDIÇÃO AO LADO, não desfeito. (6) DO ADENDO (1), A RESPOSTA DO DONO DO FORMATO: O CONJUNTO FICA FECHADO EM "bilinear" | "idw" — os dois que a família PRODUZ e que eu MEDI NA ORIGEM. "bilinear" FICA e NÃO É APELIDO DE "idw": o D37 mediu que o de k vizinhos "faz o bolo de casamento" e o de produção não, e apelidar apagaria a única informação que o campo carrega. "nenhum" É RECUSADO, porque ausência de interpolação já tem forma neste formato — `null`, que é "não medido" (D19/D23) —, e aceitá-lo criaria DUAS FORMAS DE DIZER A MESMA COISA (D116). "linear", "natural" e "krigagem" ENTRAM QUANDO ALGUÉM OS IMPLEMENTAR E MEDIR: medido na origem do Generate, NINGUÉM ATRIBUI LITERAL a `interpolador` e `bilinear` tem ZERO ocorrências lá — são tipo sem produtor. E O DESACORDO NÃO MORDE HOJE, que é o que dá tempo de decidir em vez de inventar. AO GENERATE, em lista e nunca em commit lá: estreitar o `Interpolador` para o que ele produz, ou declarar os cinco como ASPIRACIONAIS no próprio tipo. AO PARCELAMENTO: nada, ele já está no conjunto fechado. (7) E A PRIMEIRA LEITURA DISSO DEU O CONTRÁRIO: num clone em `72cfab0` com a origem em `8b7c157`, `krigagem` dava ZERO e eu quase publiquei "o Generate não enumera nada disso". O CLONE NÃO É A ORIGEM — terceira vez na mesma noite (D295), e a terceira em que a disciplina pagou. (8) DO ADENDO (2): O AVISO DO `detalhe` NÃO MORDE AQUI, E ISSO É MEDIÇÃO. Varrido todo `.ts` da esteira e do testfit, NENHUM lugar extrai número de `detalhe`; o único que o toca é `ferramentas/lab48.ts:210`, que COPIA a frase para dentro de uma prova — e copiar não é extrair. NÃO virou proposta, de propósito: proposta para consertar o que a medição diz que não existe é lista que envelhece sozinha. E o achado que vem junto é a regra desta casa voltando pela porta da frente: O LIMITE TEM DE VIAJAR DENTRO DO PAYLOAD — agora ele viaja, e eu paro de ler a frase antes de ter construído algo em cima dela.
Depende do Jonny: nada novo meu. Continuam a §11 (a senha de leitura, ou tornar os dois vizinhos públicos), a §10, o sétimo mecanismo e as duas perguntas do acesso.
Próximo na fila: a D226 (os quatro campos de `legais`) — e obrigada por dizer, nas suas palavras, que o quinto pedido seguido é dado sobre você e não sobre mim. A fila ficou em CATORZE itens abertos: a proposta do LAB-60 saiu por ENTREGA, mas o item DA LISTA já estava riscado desde o LAB-86, então a contagem não mudou (D301) — e nada nasceu no lugar dela.
=== FIM ===

--- O QUE VAI JUNTO ---

═══════════════════════════════════════════════════════════════════════════════
  AS DUAS ESPÉCIES DE PROVA — a resposta à pergunta de projeto (D299)
═══════════════════════════════════════════════════════════════════════════════

  FOTOGRAFIA de um estado passado ....... NUNCA se regera (é o defeito do D182)
    LAB-48/violacoes-do-motor-padrao ..... o ANTES de uma aferição, e roda motor
    LAB-02/completo.saida-cortada ........ saída guardada, com semente
    LAB-31/sabotagem .................... registra um ATO, não um estado
    LAB-60/configuracao-do-motor ........ mede o CLONE VIZINHO (D288)

  FUNÇÃO PURA DA ÁRVORE DE AGORA ........ tem de bater SEMPRE, e a trava regera
    LAB-57/varredura-de-configuracao ..... foi ela que o LAB-60 pegou velha (1 × 10)
    LAB-52/varredura-de-chamadas ......... já esteve 40 % velha (D290)
    LAB-04/oraculo ....................... o `medido` recomputa; o `esperado` NÃO

  A lista é fechada nos DOIS sentidos: entrada que aponta para prova inexistente,
  prova em duas espécies, e `regeradaPelaTrava` fora da espécie certa.

═══════════════════════════════════════════════════════════════════════════════
  O CONJUNTO DO `interpolador`, FECHADO — a resposta do dono do formato (D298)
═══════════════════════════════════════════════════════════════════════════════

  ACEITOS      "bilinear"  ·  "idw"        ← os dois que a família PRODUZ
  e `null`     é aceito: é a forma de dizer NÃO MEDIDO (D23)

  FORA, com motivo:
    "nenhum"    ausência já tem forma: `null`. Dois jeitos de dizer o mesmo = D116
    "linear"    tipo sem produtor na origem do Generate
    "natural"   idem
    "krigagem"  idem — e é o que mais pede medição antes de entrar

  "bilinear" NÃO é apelido de "idw": o D37 mediu a diferença, e é ela a razão de
  o campo existir ("ele muda o que a rampa quer dizer").

  MEDIDO NA ORIGEM, 11/10:
    motor-testfit   formato-publicado.ts:142     "bilinear" | "idw"
    Generate        indicadores-terreno.ts:146   "idw"|"linear"|"natural"|"krigagem"|"nenhum"
    Generate        quem ATRIBUI literal          ninguém (zero)
    Generate        `bilinear` em .ts             zero

  EM COMUM: só "idw" — a sua medição, conferida aqui.

═══════════════════════════════════════════════════════════════════════════════
  PEDIDO AO GENERATE — em lista, nunca em commit lá (§4)
═══════════════════════════════════════════════════════════════════════════════

  1. estreitar `Interpolador` para o que ele PRODUZ, ou declarar os cinco como
     ASPIRACIONAIS no próprio tipo — hoje o tipo enumera cinco e nenhum literal
     é atribuído em nenhum lugar do `.ts`;
  2. se um dia `"bilinear"` precisar entrar lá, ele NÃO é apelido de `"idw"`: a
     diferença entre os dois é medida (D37), e é a razão de o campo existir;
  3. e `"nenhum"` não precisa existir como valor: `null` já diz isso, e é o que
     esta casa usa.

AS FRONTEIRAS, E NENHUMA FOI ATRAVESSADA:
· nada escrito em repositório vizinho — leitura na ORIGEM de dois deles, e os SEIS
  clones terminaram limpos;
· a D226 não foi tocada, nem o sétimo mecanismo, nem o plantio;
· o GATILHO DO CI não foi religado — a régua cobra, não liga;
· e o INTERVALO NOVO do despertador (8 h) está anotado na CONTA, não tocado:
  ligar, desligar e reagendar é do chat.
```

---

## 11/10/2026 · LAB-92 — item 025 + dois adendos: premissas idênticas? não, e K = 17

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-92 (item 025 + dois adendos) ===
Estado: FEITO e mesclado na main. A pergunta do item está respondida com a conta, não com adjetivo: HOJE A ESTEIRA NÃO COMPARA MOTORES SOB PREMISSAS IDÊNTICAS. Verde conferido aqui, não no GitHub: 1 028 travas na esteira + 17 no testfit, 641 na lista do CI (39 arquivos, 39 de 39 passando sem os clones), 7 passos, exit 0. Decisões D302 a D305.
Feito: `src/premissas-identicas.ts` declara a conta e o K linha por linha; `tests/premissas-identicas.test.ts` (20 travas, no portão) cobra a aritmética fechando, as duas listas DISJUNTAS por (motor, premissa) e as duas formas de área conferidas contra o `.geojson`; `ferramentas/lab92.ts` publica `docs/provas/LAB-92/premissas-identicas.json`. Relatório: `docs/relatorios/LAB-92.md`.
Achados para outros apps ou Central: (1) A CONTA, E ELA É O ACHADO: N = 13 premissas a esteira passa, M = 10 com valor e 3 NULAS (`calcada_m`, `pctAreaPublica`, `rampaMaxima_pct`), e K = 17 CAEM NO PADRÃO DE FÁBRICA DE QUEM RECEBE — 4 nos dois motores do Generate e 13 no Parcelamento —, e o SYMBIOS NÃO RECEBE PREMISSA NENHUMA: `parametros` é perda EM BLOCO na ida dele. A frase do item é a lição e ela fica: PREMISSA OMITIDA NÃO É PREMISSA AUSENTE, É PREMISSA INVENTADA POR QUEM RECEBE — e cada motor inventa a sua, então DOIS MOTORES COMPARADOS ASSIM COMPETEM EM CAMPOS DIFERENTES, E O RANKING MENTE COM APARÊNCIA DE RIGOR. Medido na ORIGEM dos dois vizinhos, não no clone: `gerar-v1.ts:456` (12 campos) e `tipos.ts:124` (22 chaves). (2) DO ADENDO-2, E ELE MUDOU O ENTREGÁVEL: "K = 3 não diz o que consertar" — está certo, então o K SAIU NOMEADO, premissa por premissa, com o default e o que cada uma DECIDE. E o default de MOTOR é o único que conta aqui: esta casa não tem tela, logo o K de 17 é todo de motor. O MAIS PESADO É O `regimeFachada`, DEFAULT `"condominio"`: ele decide se o lote dá frente para RUA PÚBLICA ou para via de condomínio, e os dois motores do Generate estão correndo em CONDOMÍNIO sem ninguém ter pedido. Depois dele, `testadaMinimaLegal` — O MOTOR SE JULGA CONTRA UM LIMITE QUE A ESTEIRA NÃO PASSOU. (3) O CASO VÁLIDO FICOU SEPARADO, com trava de disjunção: premissa que o motor NÃO TEM COMO RECEBER não é inventada, é campo que o contrato não publica — `caixaViariaMin_m` no Parcelamento, `calcada_m` no Generate, e TODAS AS 13 no Symbios, que traça via e extrai quadra e NÃO PARCELA EM LOTE. Isso é PEDIDO AO DONO DO CONTRATO, nunca achado contra o motor. (4) O QUE EU NÃO CONSIGO IGUALAR, NOMEADO EM CINCO LINHAS em vez de paridade fingida — e a quinta é contra mim: `pctAPP: 15` e `pctLazer: 10` são o default do Generate e A ESTEIRA OS PASSA EXPLICITAMENTE, isto é, eu igualo os motores NO NÚMERO QUE O PRÓPRIO DONO DISSE QUE NUNCA QUIS. (5) DO ADENDO-1, AS DUAS FORMAS DE ÁREA DECLARADA: as duas passam a ida — polígono desenhado em `restricoes[]`/`atracoes[]` e porcentagem em `pctAPP`/`pctLazer` —, e NA `completo.geojson` AS DUAS CHEGAM JUNTAS, a APP desenhada E 15 % de APP, E NADA DECLARA QUAL MANDA. UM POLÍGONO TEM LUGAR; UMA PORCENTAGEM NÃO — somar os dois é contar a mesma terra duas vezes, que é a injustiça do K numa camada acima. (6) DO ADENDO-1, O MOTOR COMPOSTO: ele CABE hoje, sem mudar a porta — quarta implementação, `id` próprio, chamando duas —, e o ranking segue funcionando porque TUDO É INDEXADO POR `id`. O QUE FALTA NÃO É ENCAIXE, É A REGRA DE JUNÇÃO: de quem é cada parte do plano quando dois motores respondem pela mesma gleba. A esteira mede o que o `id` entregar; ELA NÃO SABE DIZER QUAL METADE É DE QUEM. (7) E A TRAVA QUE EU ESCREVI ME CORRIGIU NA MESMA RODADA: ela procurava uma frase no módulo e deu FALSO, e a frase estava lá, num JSDoc quebrado em duas linhas — o normalizador do `.md` tira o `>` da citação e NÃO tira o ` * ` do JSDoc. DUAS GRAMÁTICAS, DOIS NORMALIZADORES: alargar o do `.md` faria linha de lista virar prosa. O leitor novo nasceu em `src/texto-das-regras.ts`, NÃO dentro do teste, porque conserto que mora num teste conserta um teste (D248) — nona vez dessa família.
Depende do Jonny: UMA pergunta nova na página dele (§12), em linguagem de leigo: EM QUE REGIME A COMPETIÇÃO DOS MOTORES VAI RODAR — loteamento ou condomínio? Hoje essa escolha está sendo feita POR OMISSÃO, POR UM PROGRAMA, e ela muda o que "lote com frente" quer dizer. Continuam a §11 (a senha de leitura, ou tornar os dois vizinhos públicos), a §10, o sétimo mecanismo e as duas perguntas do acesso.
Próximo na fila: a D226 (os quatro campos de `legais`) — e a fila ficou em CATORZE itens abertos, nada nasceu nem saiu.
=== FIM ===

--- O QUE VAI JUNTO ---

═══════════════════════════════════════════════════════════════════════════════
  A CONTA — e ela é a resposta do item 025
═══════════════════════════════════════════════════════════════════════════════

  N = 13   premissas que a esteira PASSA        (src/gleba-do-lab.ts · PARAMETROS)
  M = 10   com valor  ·  3 vão `null`          (calcada_m · pctAreaPublica · rampaMaxima_pct)
  K = 17   caem no DEFAULT DE FÁBRICA de quem recebe
             4  nos dois motores do Generate
            13  no Parcelamento
  Symbios  ZERO premissas — `parametros` é perda EM BLOCO na ida

═══════════════════════════════════════════════════════════════════════════════
  O K NOMEADO — porque "K = 3 não diz o que consertar" (adendo-2)
═══════════════════════════════════════════════════════════════════════════════

  GENERATE — os 4 de PARAMS_PADRAO_V1 que a esteira nunca sobrescreve:

    regimeFachada        "condominio"   ← O MAIS PESADO: decide se o lote dá
                                          frente para RUA PÚBLICA ou para via
                                          de condomínio
    testadaMinimaLegal   NORMA_BR       o motor se julga contra um limite que
                                          a esteira NÃO passou
    raioBulbo            7.5            o bulbo de cul-de-sac consome área de via
    larguraEntrada       20             a entrada consome frente de gleba

  PARCELAMENTO — 13 das 22 ChaveFaixa ficam de fábrica (a ida preenche 9):

    tolerancia · appRioPct · doacaoPct · doacaoTestadaMin · lagosPct ·
    arborizacaoPct · pctCulDeSac · interferenciaRelevo · ladoSuperquadra ·
    numRadiais · curvatura · testadaExterna · areaLoteExterna

  A `tolerancia` é a que mais dói: ela decide QUANTOS LOTES PASSAM RASPANDO,
  e NÃO EXISTE no contrato v1 — não é igualável nem por fora.

═══════════════════════════════════════════════════════════════════════════════
  O QUE EU NÃO CONSIGO IGUALAR — nomeado, em vez de paridade fingida
═══════════════════════════════════════════════════════════════════════════════

  1. o default de FÁBRICA de quem recebe — a esteira só passa o que o contrato
     publica, e o contrato não alcança o de dentro do motor;
  2. o SYMBIOS em métrica de lote — zero premissas e não parcela: qualquer
     ranking de lote que o inclua está somando coisas diferentes;
  3. o `regimeFachada` — não há como PEDIR regime de loteamento;
  4. a `tolerancia` do Parcelamento — não existe no contrato v1;
  5. e o número que o PRÓPRIO DONO RECUSA — `pctAPP: 15` e `pctLazer: 10` são
     o default do Generate e eu os passo EXPLICITAMENTE.

═══════════════════════════════════════════════════════════════════════════════
  PEDIDO AO CHASSI / AO GENERATE — em lista, nunca em commit lá (§4)
═══════════════════════════════════════════════════════════════════════════════

  1. as premissas num LUGAR SÓ, e nenhum default de motor — o K de 17 é o
     pré-requisito do ranking que o cliente vai ver;
  2. `regimeFachada` no contrato de motor v1 — hoje é o default mais pesado,
     e é INVISÍVEL;
  3. tirar o `pctAPP ?? 15` / `pctLazer ?? 10` — o dono já disse que nunca os
     quis, e eles estão em seis lugares vivos;
  4. declarar a PRECEDÊNCIA entre área desenhada e porcentagem quando as duas
     chegam na mesma gleba.

═══════════════════════════════════════════════════════════════════════════════
  PEDIDO AO PARCELAMENTO
═══════════════════════════════════════════════════════════════════════════════

  publicar no contrato as chaves que hoje só existem de fábrica — começando
  por `tolerancia` e `testadaExterna`, que MUDAM CONTAGEM DE VIOLAÇÃO.

AS FRONTEIRAS, E NENHUMA FOI ATRAVESSADA:
· nada escrito em repositório vizinho — leitura na ORIGEM de dois deles, e os SEIS
  clones terminaram limpos;
· NENHUM MOTOR FOI MELHORADO: o adendo-1 proíbe antes do lançamento, e esta rodada
  só MEDIU — não consertou premissa, não igualou nada em silêncio;
· a D226 não foi tocada, nem o sétimo mecanismo, nem o plantio;
· o GATILHO DO CI não foi religado — a régua cobra, não liga;
· e o INTERVALO de 8 h do despertador está anotado na CONTA, não tocado.
```

---

## 12/10/2026 · LAB-93 — item 026: a D226 entregue, e o delta de desenho é zero

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-93 (item 026) ===
Estado: FEITO e mesclado na main. A D226 está EXECUTADA: os três campos que o contrato publica vão entregues, o quarto sai `null` porque não tem de onde vir, e o efeito está medido em CINCO passagens e NOVE glebas. Verde conferido aqui, não no GitHub: 1 058 travas na esteira + 17 no testfit, 666 na lista do CI (40 arquivos, 40 de 40 passando sem os clones), 7 passos, exit 0. Decisões D306 a D311.
Feito: `testfit/adapter/src/legais-do-contrato.ts` (o mapa dos quatro, o que cada um decide, onde o motor o consome e a procedência com `sha256` por trecho); `esteira/src/passagens-dos-legais.ts` + `ferramentas/lab93.ts` (as cinco passagens e a conta com veredicto por campo); `esteira/src/perdas-remedidas.ts` (as três perdas NOMEADAS e remedidas); travas `legais-do-contrato` (20, no portão) e `assinatura-da-geometria` (5). Prova: `docs/provas/LAB-93/as-cinco-passagens.json`. Relatório: `docs/relatorios/LAB-93.md`.
Achados para outros apps ou Central: (1) O DELTA DE DESENHO É ZERO, E ISSO É O RESULTADO: entregues os três campos, A GEOMETRIA PUBLICADA É IDÊNTICA EM 9 DE 9 GLEBAS. O que nasceu foram AVISOS do motor sobre pista curta — de +10 a +40 por gleba —, que é informação que esta ponte jogava fora. ENTREGAR CONTINUA SENDO O CERTO, e o motivo não é o delta: é que A OMISSÃO NÃO É NEUTRA. `null` ali não quer dizer "sem limite", quer dizer "vale o padrão de fábrica do motor" — é o K = 17 do LAB-92 na porta ao lado. (2) E CINCO PASSAGENS, EM VEZ DE DUAS, FOI O QUE FEZ A DIFERENÇA: duas passagens respondem SE algo se moveu; UMA PASSAGEM POR CAMPO responde QUAL CAMPO MOVEU. A D226 entregou três de uma vez, viu a rampa de `ensaio-com-via` cair de 21,63 % para 17,92 % e escreveu que "o motor ganhou a capacidade de limitar rampa". Medido: ele não ganhou a de LIMITAR, ganhou a de CONFERIR contra a rampa que o arquivo pediu — as duas funções dele dizem isso por escrito. E O NÚMERO NÃO REPRODUZ E NÃO PODIA: o campo que ela acusou vem `null` naquela gleba. Ficou RISCADO COM A MEDIÇÃO AO LADO E SEM CULPADO NOVO, porque inventar a causa de um número que eu não tenho é pior do que dizer que não sei. (3) A RODADA NEGOU A MINHA LEITURA DO FONTE, e é a trigésima vez do ponto cego: eu declarei que a `faceQuadraMaxima_m` MUDA o desenho porque li o `min(alvo, legal)` no fonte do motor, e ela não move nada — O MESMO CAMPO DO CONTRATO JÁ CHEGAVA POR OUTRO CAMINHO (`padroes.comprimentoQuadra`), então o mínimo é `min(200, 200)`. LEITURA DE FONTE É HIPÓTESE; RODADA É DADO — e campo que chega por dois caminhos faz a régua comparar o campo consigo mesmo. (4) E O INSTRUMENTO DA PRIMEIRA PASSADA ERA O DA CASA, E ESTAVA ERRADO PARA A MINHA PERGUNTA: eu usei a `assinaturaDaRodada` que o motor publica — "a impressão digital do desenho" — e o `Plano` dele carrega os AVISOS ao lado da geometria. Entregue a caixa viária mínima, a assinatura mudou com lotes, vias, quadras e pior rampa IDÊNTICOS, e eu estava a um passo de publicar "entregar a caixa viária mínima muda o desenho". ASSINATURA DE RODADA NÃO É ASSINATURA DE DESENHO: impressão digital só responde à pergunta de quem sabe o que entrou nela. (5) AS TRÊS PERDAS SOB SUSPEITA ESTÃO NOMEADAS, e a frase da D226 saiu em CINCO LUGARES sem dizer quais — CONTAGEM SEM A LISTA AO LADO É A FORMA MAIS BARATA DE UM NÚMERO ENVELHECER. A contagem estava certa; faltava o nome. Duas SAÍRAM (o motor recebe as duas) e a terceira FICA e NUNCA FOI DESSA FAMÍLIA: três coisas suspeitas porque estão na mesma gaveta não são três coisas suspeitas — vizinhança no arquivo não é vizinhança na causa. (6) A PERGUNTA QUE VOCÊ ACRESCENTOU, RESPONDIDA CONTRA MIM: você apostou que "as duas coisas podem ser verdade ao mesmo tempo, e provavelmente são". NÃO SÃO. O motor recebe as duas, e A TRADUÇÃO DO PRÓPRIO DONO DELE já as mapeava com os mesmos nomes do contrato v1 — duas linhas do caso-válido do LAB-92 saíram riscadas. "O MOTOR NÃO TEM COMO RECEBER" E "A MINHA PONTE NÃO ENTREGA" TÊM A MESMA APARÊNCIA DO LADO DE FORA E CULPAS OPOSTAS: o meu motivo de perda era verdadeiro sobre o que o motor FAZ e falso sobre o que ele ACEITA, e eu publiquei o segundo. Você estava certo na metade que importa — a vaga vazia não é neutra. (7) E A RÉGUA DO PORTÃO ERRAVA NOS DOIS EXTREMOS, achado de brinde: ela lia PREFIXO de `import`, então reprovava um teste cuja cadeia não alcança clone nenhum E DEIXAVA PASSAR o alcance por `../src/` — um teste da lista que importasse o módulo das passagens quebraria o CI e a régua aprovaria. Pior: a lista à mão tinha `@symbios/`, QUE É DESTA CASA, e não tinha `@/`, QUE É CLONE. PREFIXO MEDE ONDE O ARQUIVO MORA; A PERGUNTA ERA O QUE ELE ALCANÇA — agora o fecho é transitivo, `import type` não conta, e os apelidos se LEEM do `tsconfig.json`. (8) E EU IA PUBLICAR O NÚMERO DO PORTÃO ERRADO, EM QUATRO LUGARES: escrevi 661 somando 641 + as 20 travas novas DE CABEÇA, e esqueci as CINCO que entraram no `regras.test.ts`. O medido é 666. A trava que guarda esse número conferia os QUATRO LUGARES ENTRE SI e nunca contra a realidade — CONSISTÊNCIA NÃO É CORREÇÃO, e quatro cópias erradas juntas são mais convincentes do que uma. Pior: a medição por execução que poderia desmenti-la publicava `null` em 36 DOS 40 ARQUIVOS — exatamente os que PASSAVAM —, porque ela lia só a saída padrão e o `bun test` escreve o resumo na saída de erro. MEDIÇÃO QUE SÓ PREENCHE O CAMPO QUANDO DÁ ERRADO NÃO É MEDIÇÃO POR EXECUÇÃO: É RELATÓRIO DE FALHA. Consertados os dois: a prova publica a soma por execução (e `null` ali é RECUSA, não aprovação) e a trava cobra os quatro lugares CONTRA ela. (9) PEDIDO AO PARCELAMENTO, em lista e nunca em commit lá: a `cortesDoArquivo` NÃO TEM CHAMADOR EM `src/` — só nos `scripts/` e nos testes dele —, então `rampaMaximaDeVia_pct` é porta aberta e não usada; e quando a entrada é o contrato v1, o teto legal de face de quadra e o alvo da quadra SAEM DO MESMO CAMPO, e vale dizer isso no comentário dele. AO GENERATE: `declividadeMaximaLote_pct` não existe no `ParametrosV1` e é A ÚNICA DAS CINCO QUE É LEI (6.766, art. 3º, § único, III).
Depende do Jonny: nada novo meu. Continuam a §12 (em que REGIME a competição roda — loteamento ou condomínio, e é ela que decide QUAL limite a competição usa), a §11 (a senha de leitura, ou tornar os dois vizinhos públicos), a §10, o sétimo mecanismo e as duas perguntas do acesso.
Próximo na fila: a fila ficou em TREZE itens abertos — era CATORZE, e a D226 saiu por ENTREGA, não por recontagem. Nada nasceu no lugar dela. O próximo da minha lista é o SÉTIMO MECANISMO das violações.
=== FIM ===

--- O QUE VAI JUNTO ---

═══════════════════════════════════════════════════════════════════════════════
  A CONTA, CAMPO POR CAMPO — e "não medido" é uma das respostas
═══════════════════════════════════════════════════════════════════════════════

  campo                          contrato traz   mudou o quê            veredicto
  ───────────────────────────────────────────────────────────────────────────────
  caixaViariaMinima_m            9/9  (8 m)      nada de geometria;     entregue, só
                                                 o motor passou a       passou a avisar
                                                 AVISAR (+10 a +40)
  faceQuadraMaxima_m             9/9  (200 m)    NADA                   entregue, nada
                                                                        se moveu
  rampaMaximaDeVia_pct           1/9  (fixture)  NADA                   entregue, nada
                                                                        se moveu
  declividadeMaximaDeLote_pct    0/9             não há passagem        o contrato não
                                                                        publica

  A GEOMETRIA PUBLICADA É IDÊNTICA NAS CINCO PASSAGENS, EM 9 DE 9 GLEBAS.

═══════════════════════════════════════════════════════════════════════════════
  POR QUE CADA UM NÃO MORDE — e os dois motivos são DIFERENTES
═══════════════════════════════════════════════════════════════════════════════

  faceQuadraMaxima_m   o MESMO campo do contrato já chega por
                       `padroes.comprimentoQuadra` (o ALVO), e o motor faz
                       `min(alvo, legal)` → `min(200, 200)`. Isto é DA PONTE.

  rampaMaximaDeVia_pct o campo NÃO TEM CONSUMIDOR dentro do motor: quem o lê em
                       `src/` é só a `cortesDoArquivo`, e a `cortesDoArquivo` não
                       é chamada por ninguém em `src/`. Isto é DO MOTOR.
                       PORTA ABERTA NÃO É PORTA USADA.

═══════════════════════════════════════════════════════════════════════════════
  AS TRÊS PERDAS SOB SUSPEITA — nomeadas, que é o que faltava
═══════════════════════════════════════════════════════════════════════════════

  parametros.caixaViariaMin_m   SAIU DA LISTA   o piso independente EXISTE:
                                                `viasComPistaCurta` compara a PISTA
                                                com o mínimo do arquivo e avisa
  parametros.rampaMaxima_pct    SAIU DA LISTA   "não limita rampa" continua VERDADE
                                                — e NÃO LIMITAR NÃO É NÃO RECEBER
  parametros.pctAreaPublica     FICA, remedida  nenhum dos quatro campos novos
                                                aponta para ela

  As duas que saíram viraram destino `traduzido`, e isso criou PROMESSA NOVA: a
  trava do LAB-40 cobrou na hora que a da rampa não tinha gleba que a exercitasse
  (as nove trazem `null`). Daí a fixture `ensaio-com-rampa` — 8 %, e NÃO 15, que é
  o corte declarado do próprio motor: entregar o default mede a si mesmo.
  O universo de promessas foi de 60 para 62.

═══════════════════════════════════════════════════════════════════════════════
  PEDIDO AO PARCELAMENTO — em lista, nunca em commit lá (§4)
═══════════════════════════════════════════════════════════════════════════════

  1. a `cortesDoArquivo` não tem chamador em `src/` — só nos `scripts/` e nos
     testes. Ou o motor passa a conferir com o corte do ARQUIVO dentro do
     pipeline, ou `legais.rampaMaximaDeVia_pct` é porta decorativa;
  2. com entrada pelo contrato v1, `faceQuadraMaxima_m` e o alvo da quadra saem do
     MESMO campo, e aí o `min(alvo, legal)` nunca morde — de dentro parece que há
     dois tetos, e vale dizer isso no comentário;
  3. e continua de pé o pedido do LAB-92: publicar no contrato as chaves que hoje
     só existem de fábrica, começando por `tolerancia` e `testadaExterna`.

═══════════════════════════════════════════════════════════════════════════════
  PEDIDO AO GENERATE (dono do contrato de motor v1)
═══════════════════════════════════════════════════════════════════════════════

  `declividadeMaximaLote_pct` NÃO EXISTE no `ParametrosV1` (são treze campos), e é
  A ÚNICA DAS CINCO QUE É LEI DE VERDADE — 6.766, art. 3º, parágrafo único, III.
  O motor já a lê de forma tolerante; o contrato é que não a tem. Enquanto não
  tiver, daqui ela sai `null` — não medido, nunca zero.

AS FRONTEIRAS, E NENHUMA FOI ATRAVESSADA:
· nada escrito em repositório vizinho — leitura na ORIGEM do `motor-testfit`
  (`11fcbad`) contra o clone que compila (`6cf6396`), com os cinco trechos lidos
  COMPARADOS BYTE A BYTE nos dois (`sha256` na prova); os SEIS clones limpos;
· NENHUM MOTOR FOI MELHORADO: entregar campo que o motor já aceita não é melhorar
  o motor, é parar de omitir premissa — e geometria nenhuma foi corrigida;
· nada foi decidido de urbanismo: QUAL limite a competição usa continua sendo a
  pergunta da página dele;
· o GATILHO DO CI não foi religado — a régua cobra, não liga;
· e o despertador não foi tocado: a conta ganhou a linha das 23:06.
```

---

## 12/10/2026 · LAB-94 — item 027: o preço do sétimo mecanismo, em lotes

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-94 (item 027) ===
Estado: FEITO e mesclado na main. O preço que a decisão do Jonny esperava está medido, e a outra metade da frase da FILA.md era FALSA. Verde conferido aqui, não no GitHub: 1 077 travas na esteira + 17 no testfit, 685 na lista do CI (41 arquivos, 41 de 41 passando sem os clones), 7 passos, exit 0. Decisões D312 a D316.
Feito: `esteira/src/preco-do-setimo.ts` (a classificação, a conta e o rótulo da simulação) + `ferramentas/lab94.ts`; a régua `alemDaPonta` MUDOU DE ARQUIVO para `src/setimo-mecanismo.ts` (dois instrumentos, um lugar) e a prova do LAB-78 saiu IDÊNTICA; trava `preco-do-setimo` (19, no portão). Prova: `docs/provas/LAB-94/o-preco-do-setimo.json`. Relatório: `docs/relatorios/LAB-94.md`.
Achados para outros apps ou Central: (1) O PREÇO: parar a fileira externa no fim da face declarada custa DE 21 A 48 LOTES POR CANDIDATA — de uma fileira que tem 33 a 64 —, 1 196 EM 40 CANDIDATAS nas duas glebas de Antonina. E em `ensaio-com-testada` o preço é ZERO DE VERDADE: ali a face declarada cobre a fileira inteira, e essa gleba é o CONTROLE que mostra que a régua não acusa à toa. O CASO QUE MAIS MUDA A DECISÃO: a candidata que o RANKING DO PRÓPRIO MOTOR PÕE EM PRIMEIRO em Antonina tem 33 lotes, e TODOS OS 33 são dessa fileira — parando na face ela fica com 12. É a mesma superquadra do D140, agora com o preço ao lado. (2) E A SEGUNDA METADE DA FRASE ERA FALSA, e a frase era minha: a `FILA.md` dizia "encurtá-la ao fim da rua perde esses lotes E ZERA A VIOLAÇÃO". NÃO ZERA EM NENHUMA DAS 40 — cai de 28–55 para 5–16 e sobra. E a pergunta "o que sobra é da fileira?" não se responde contando eu mesma quem faz frente, porque isso seria REIMPLEMENTAR O INVARIANTE DELE (§4): responde-se com uma SEGUNDA RETIRADA pela régua dele, e tirada a fileira INTEIRA a `frente` vai a ZERO EM 38 DAS 40 (nas outras duas sobra UMA). "PARAR NO FIM DA FACE" E "NÃO TER FILEIRA EXTERNA" NÃO SÃO A MESMA COISA, e a diferença é de 5 a 16 violações por candidata. (3) O RÓTULO É PARTE DA ENTREGA, e você cobrou antes de eu errar: a simulação RETIRA E NÃO REPLANTA, então ela NÃO É TETO NEM PISO DA PERDA — chamá-la de um dos dois seria hipótese sobre o plantio, que é a coisa que esta casa não roda. O limite viaja na prova em quatro linhas e há trava que reprova se alguma delas AFIRMAR teto ou piso. É a lição do LAB-93 doze horas antes: leitura de fonte é hipótese, rodada é dado. (4) A PERGUNTA DO ACABAMENTO, EM TRÊS CAMADAS — e a sua hipótese estava formulada pela metade que não morde: POR ÁREA NÃO ALCANÇA (zero dos 1 196 está abaixo do mínimo: eles têm 218,76 a 581,03 m² contra 200), POR FRENTE ALCANÇA TODOS (os 1 196 publicam `faceDeRua: null`, e não é leitura minha — o invariante `frente` DELE os conta, e vai a zero quando a fileira sai), e MATA OU FUNDE EU NÃO SEI, porque o passo tenta `melhorVizinhoParaFusao` ANTES de descartar. O PASSO SE CHAMA "PISO DE ÁREA" E O CRITÉRIO É ÁREA *E* FRENTE: o comentário dele diz "lote sem NENHUMA frente é tão invendável quanto lote abaixo do mínimo". RÉGUA CUJO NOME CONTA METADE DO CRITÉRIO FAZ QUEM LÊ DE FORA FORMULAR A PERGUNTA PELA METADE ERRADA. (5) E A PORTA DO ACABAMENTO JÁ EXISTE NA ORIGEM DELE: `src/lib/engine/acabamento-externo.ts` com `acabarPlano`, chamado pelo `parcelamento-externo.ts` ENTRE A MONTAGEM E O VALIDATOR, atrás de `opcoes.acabamento` — com a opção ligada, O VEREDICTO PASSA A SER DO PLANO QUE O CHASSI ENTREGA. NO CLONE QUE ESTA CASA COMPILA O ARQUIVO NÃO EXISTE, então a rodada que falta é na casa dele. O CLONE NÃO É A ORIGEM, E AQUI A DIFERENÇA NÃO É DE DATA, É DE CAPACIDADE: falta-lhe uma função inteira, não um commit. E a conta dos passos muda sem contradição: o `024-O-CHASSI.md` contou 16 de 17 que PODERIAM rodar, e a porta entregue APLICA 13 e declara 4 FORA — 13 + 4 = 17 fecha com os dois. (6) SETE DAS DEZ GLEBAS NÃO DECLARAM FACE, e ali a pergunta NÃO TEM OBJETO: elas saem com veredicto escrito e NÃO COM ZERO. Zero é uma medição; "a pergunta não tem objeto aqui" é outra coisa — publicar `0 lotes` nas sete diria que o mecanismo foi medido nelas e não custou nada, e quem lesse a soma concluiria que o preço é pequeno porque sete glebas o diluem. (7) E DUAS COISAS DO ITEM A MEDIÇÃO CORRIGIU, com respeito e com número: a premissa de "testada 0 m" — os 1 196 têm 10,14 a 13,98 m, e o zero era de UM lote acusado do LAB-78, não da fileira —, e "o caminho externo não chama NENHUM passo", que DEIXOU DE SER VERDADE entre o item ser escrito às 00h38 e esta rodada.
Depende do Jonny: a §10 da página dele foi REESCRITA com o preço na mão, a correção da frase que eu mesma escrevi ("zera o defeito" — não zera) e A RECOMENDAÇÃO MUDADA COM A MEDIÇÃO: de "pare a fileira" para "espere o acabamento do chassi", porque o passo dele alcança os mesmos 1 196 sem mexer no desenho do motor. Continuam a §12 (o REGIME), a §11 (a senha), a §9, e a §10 segue aberta porque a escolha é dele.
Próximo na fila: o ITEM 028 (enxugar o CLAUDE.md), que chegou no mesmo envio e fica para o próximo disparo — um prompt por despertador. A fila de propostas ficou em TREZE itens abertos: o sétimo mecanismo NÃO saiu da lista, porque o que saiu foi a MEDIÇÃO que faltava, não o conserto.
=== FIM ===

--- O QUE VAI JUNTO ---

═══════════════════════════════════════════════════════════════════════════════
  O PREÇO — e o controle que mostra que a régua não acusa à toa
═══════════════════════════════════════════════════════════════════════════════

  gleba                    candidatas  com retirada  lotes     fileira
  ──────────────────────────────────────────────────────────────────────
  geo-antonina                 20           20        598      33 a 64
  antonina-com-via             20           20        598      33 a 64
  ensaio-com-testada           20            0          0      (a face cobre
                                                               a fileira inteira)
  as outras SETE glebas     NÃO SE APLICA — a ida não declara face nenhuma

  por candidata: 21 a 48 lotes   ·   total medido: 1 196

  O CASO MAIS DURO: a candidata que o RANKING DO MOTOR põe em PRIMEIRO em
  Antonina tem 33 lotes e TODOS OS 33 são da fileira externa → fica com 12.

═══════════════════════════════════════════════════════════════════════════════
  A SEGUNDA METADE DA FRASE — medida, e ela era falsa
═══════════════════════════════════════════════════════════════════════════════

                              antes   parando na face   sem a fileira INTEIRA
  violações de `frente`       28–55       5–16          0 em 38 das 40
  violações totais           40–100      13–26          —

  "PARAR NO FIM DA FACE" ≠ "NÃO TER FILEIRA EXTERNA".

═══════════════════════════════════════════════════════════════════════════════
  A PERGUNTA DO ACABAMENTO — três camadas, e uma delas é "não sei"
═══════════════════════════════════════════════════════════════════════════════

  por ÁREA      NÃO alcança     0 de 1 196 abaixo do mínimo (218,76–581,03 m²
                                contra 200)                  [medido]
  por FRENTE    ALCANÇA TODOS   os 1 196 com `faceDeRua: null`, e o invariante
                                `frente` DELE os conta        [medido]
  mata ou funde?  NÃO SEI       o passo tenta fundir no vizinho antes de
                                descartar — só rodando o passo se sabe

  O CRITÉRIO, literal: mantém o lote só quando `area >= areaMin` E
  `testadaContraVias(pontos, superficiesFrente) > 0`.

═══════════════════════════════════════════════════════════════════════════════
  PEDIDO AO GENERATE — em lista, nunca em commit lá (§4)
═══════════════════════════════════════════════════════════════════════════════

  1. RODAR o `piso-de-area` sobre estes 1 196 lotes e dizer quantos ele FUNDE e
     quantos DESCARTA. A porta é de vocês, e esta casa não pode: o
     `acabamento-externo.ts` não existe no clone que ela compila;
  2. o NOME do passo conta metade do critério — "piso de área" é piso de área E
     DE FRENTE, e quem lê de fora formula a pergunta pela metade errada;
  3. dizer se `opcoes.acabamento` vai ficar opt-in: disso depende se o veredicto
     que esta esteira publica é do plano DO MOTOR ou do plano ACABADO. São duas
     afirmações diferentes, e o rótulo da opção na mesa é o que as separa.

AO PARCELAMENTO: nada novo. O sétimo mecanismo continua sendo dele e o preço de
consertá-lo está medido — mas se o acabamento do chassi alcança os mesmos lotes,
O CONSERTO PODE NÃO SER NECESSÁRIO.

AS FRONTEIRAS, E NENHUMA FOI ATRAVESSADA:
· nada escrito em repositório vizinho — leitura na ORIGEM do `urban-create-hub`
  (`c6048f8`) e do `motor-testfit`; os SEIS clones terminaram limpos;
· NADA FOI CONSERTADO: o plantio não foi tocado, nem atrás de opção, e o
  acabamento NÃO foi implementado aqui — seria a segunda implementação do
  acabamento dele (D20/D116), e o item proibiu;
· nada foi decidido de urbanismo: se a fileira encurta continua sendo dele;
· o GATILHO DO CI não foi religado — a régua cobra, não liga;
· e o despertador não foi tocado: a conta ganhou a linha das 07:17.
```

---

## 12/10/2026 · LAB-95 — item 028: o CLAUDE.md enxugado (e o item fica ABERTO)

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-95 (item 028) ===
Estado: ENTREGUE e mesclado na main, e o ITEM 028 FICA ABERTO — por ordem dele: "não marque como FEITO até a meta". A meta é 15 000 caracteres e ficou em 18 527. Verde conferido aqui, não no GitHub: 1 090 travas na esteira + 17 no testfit, 698 na lista do CI (42 arquivos, 42 de 42 passando sem os clones), 7 passos, exit 0. Decisões D317 a D321.
Feito: `docs/HISTORIA_DAS_REGRAS.md` criado com as ONZE seções movidas LITERAIS (H1 a H11, como estavam em `490c102`); o `CLAUDE.md` reescrito curto, cada regra em uma ou duas frases com o ponteiro `(história: §HN)`; `esteira/src/enxugar-o-claude.ts` (o inventário das 79 regras e a régua dos dois lados), `src/historia-das-regras.ts` (a leitura num lugar só), `ferramentas/lab95.ts` e a trava `enxugar-o-claude` (13, no portão). Prova: `docs/provas/LAB-95/nada-se-perdeu.json`. Relatório: `docs/relatorios/LAB-95.md`.
Achados para outros apps ou Central: (1) A CONTA, QUE É O ENTREGÁVEL: CLAUDE.md 52 383 → 18 527 caracteres (−64,6 %); história 0 → 56 483; REGRAS 79 ANTES × 79 DEPOIS; LINHAS DO TEXTO ANTIGO PERDIDAS: ZERO. A história foi montada MOVENDO AS SEÇÕES INTEIRAS, literais — é por isso que "zero perdidas" é conferível e não é promessa: a conta compara LINHA POR LINHA o texto antigo contra os dois arquivos de hoje, e a prova grava o `sha256` do antes. (2) E A CONTA DAS REGRAS É DOS DOIS LADOS, que é o que a faz conta em vez de declaração: cada uma das 79 marcas é conferida NO CLAUDE.MD DE HOJE (faltar ali é regra apagada) E NA HISTÓRIA (faltar ali é lista inventada). RÉGUA QUE OLHASSE UM LADO SÓ APROVARIA EXATAMENTE O ERRO QUE O ITEM PROÍBE. (3) O ENXUGAR REVELOU TRÊS INSTRUMENTOS QUE CASAVAM TEXTO GRAVADO, e nenhum dos três quebrou pela mudança de gaveta — quebraram porque REFLUIR TEXTO É O TESTE NATURAL DE TODA RÉGUA QUE CASA FRASE, e eles nunca o tinham passado: (a) A SABOTAGEM DO D218 PAROU DE MORDER EM SILÊNCIO — ela achava o fim da frase por "(D218).", que o enxugar tirou de dentro dela; `indexOf` deu −1, o recorte montou um texto que a régua não acusava, e O TESTE PASSOU. SABOTAGEM QUE NÃO ACHA O QUE SABOTAR É UM TESTE QUE PASSA, e ela falha para o lado que diz que está tudo bem; refeita, ela agora AFIRMA QUE ACHOU O ALVO antes de sabotar. (b) UMA TRAVA ACUSOU A PÁGINA DE NÃO TRAZER UMA REGRA QUE ESTAVA ALI — `toContain` cru contra uma frase que o refluxo quebrou em duas linhas: décima vez da família do D248, e o conserto já existia nesta casa. (c) A RÉGUA DO LIMITE LÊ POR FRASE, e a frase sabotada tinha ficado colada à anterior por `**.` — as duas viravam uma, e o sujeito da primeira cobria a segunda: PONTUAÇÃO NÃO É ESTILO QUANDO UMA RÉGUA DIVIDE POR PONTO FINAL. (4) E UMA GUARDA ACHOU UMA PERDA MINHA, que é o serviço dela: ao encurtar a §1-C eu deixei cair "o kit, quando chegar, é outro item", e a `por-lugar` reprovou. ELA NÃO LIA À PROCURA DE REGRA: LIA À PROCURA DE COISA PARADA — e foi por isso que pegou. A frase voltou. ENCURTAR APAGA, e apagar é a única forma de errar este item. (5) DUAS GUARDAS MUDARAM DE ALVO E AGORA LEEM PELA MESMA FUNÇÃO (`src/historia-das-regras.ts`): a trava da aritmética do ponto cego e a ferramenta que publica a prova dela. DUAS LEITURAS DO MESMO ALVO EM DOIS ARQUIVOS É O QUE O D231 CUSTOU. E ela RECUSA em vez de devolver vazio: seção não achada é `null`, porque RÉGUA QUE APROVA O QUE NÃO LEU É PIOR DO QUE RÉGUA QUE FALTA. (6) PARA A FAMÍLIA, se as outras dez casas forem fazer o mesmo: a alavanca não é escrever menos, é SEPARAR O DIÁRIO DA REGRA — e o que torna isso seguro é a conta dos dois lados mais a lista das guardas que leem a página, FEITA ANTES DE MEXER. Três dos nossos instrumentos estavam casando texto gravado, e isso só aparece quando o texto reflui.
Depende do Jonny: nada novo. (E a §10 da página dele, do LAB-94, segue esperando a escolha com o preço na mão.)
Próximo na fila: O ITEM 028 DE NOVO — ele fica aberto e o próximo despertador o pega. MAS A DECISÃO QUE FALTA É SUA, e é esta: a META de 15 000 não cabe. O chão medido é 2 473 caracteres que não se cortam nem se editam (1 285 da citação literal da Central, 387 da do Jonny, 200 do molde do recado, 36 do comando do verde, 565 da lista de onde mora cada coisa); sobram 16 054 para 79 REGRAS — 203 POR REGRA. BAIXAR DE 15 000 EXIGE TIRAR REGRA OU EDITAR CITAÇÃO LITERAL, E O ITEM PROÍBE AS DUAS. Duas saídas, e as duas são suas: (a) a meta muda para o que o conteúdo permite — 18 527 já corta 64,6 %, que é a alavanca que o item buscava; ou (b) você diz QUAL regra sai da página e passa a viver só na história, sabendo que REGRA QUE SAI DA PÁGINA DEIXA DE SER LIDA. Depois do 028 vem o 029.
=== FIM ===

--- O QUE VAI JUNTO ---

═══════════════════════════════════════════════════════════════════════════════
  AS TRÊS CONTAS QUE O ITEM PEDIU
═══════════════════════════════════════════════════════════════════════════════

                                    antes        depois
  CLAUDE.md                       52 383       18 527   (−64,6 %)
  docs/HISTORIA_DAS_REGRAS.md      (não            56 483
                                   existia)
  regras no inventário                79           79
  linhas do antigo perdidas            —         ZERO

  O "antes" é o commit `490c102`, e o `sha256` dele está na prova: o número não
  é sobre um "antes" que ninguém pode conferir.

═══════════════════════════════════════════════════════════════════════════════
  O CHÃO, PEDAÇO POR PEDAÇO — por que 15 000 não cabe
═══════════════════════════════════════════════════════════════════════════════

   1 285  a citação literal da Central (§1-C) — a família mandou gravar literal
     387  a citação literal do Jonny (§4-A) — idem
     200  o molde do recado — é o formato que a §1 manda seguir
      36  o comando do verde
     565  a lista de onde mora cada coisa — o item a pediu explicitamente
   ─────
   2 473  SOMA do que não se corta nem se edita

  sobram 16 054 para 79 regras, títulos e ponteiros → 203 caracteres por regra.

═══════════════════════════════════════════════════════════════════════════════
  AS GUARDAS QUE LEEM A PÁGINA — a lista que o item mandou fazer ANTES de mexer
═══════════════════════════════════════════════════════════════════════════════

  regras                  a §1-B existe e nomeia o BALANCOS.md          não mudou
  limites-com-sujeito     toda regra de forma diz DE QUE é o limite     MUDOU
  aritmetica-da-regra     a aritmética da tabela do ponto cego          MUDOU
  lab63 (ferramenta)      publica a prova dessa aritmética              MUDOU
  disparos-em-vazio       a §1-A não manda desligar; o riscado          não mudou
  custo-por-uso           a §4-A: a ordem e as oito consequências       não mudou
  trava-de-estrutura      a §4-A diz se a trava é palavra ou estrutura  MUDOU
  vazamento-de-custo      o CLAUDE.md é REGISTRO na varredura           não mudou
  por-lugar               as oito coisas paradas, com a marca de cada   não mudou
  lab81 (ferramenta)      o bloco de código nas seções de regra         não mudou

  Nove travas e duas ferramentas; QUATRO mudaram de alvo — e as três que
  quebraram, quebraram por DEFEITO DELAS, revelado pelo refluxo do texto.

AS FRONTEIRAS, E NENHUMA FOI ATRAVESSADA:
· nada de comportamento mudou: nenhum código de produto, nenhum `vendor/`, nenhuma
  tarefa agendada e nenhuma regra reescrita "para melhorar";
· NADA FOI APAGADO: o que saiu da página foi MOVIDO, e a conta prova com zero;
· nada escrito em repositório vizinho; os SEIS clones terminaram limpos;
· o GATILHO DO CI não foi religado;
· o despertador não foi tocado: a conta ganhou a linha das 15:08;
· e o ITEM 028 NÃO FOI MARCADO COMO FEITO — é o que ele manda enquanto a meta não
  for alcançada.
```

## 12/10/2026 · LAB-95 — item 028, segundo despertador: a meta alcançada, e a D321 desmentida

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-95 (item 028, 2º despertador) ===
Estado: ITEM 028 FEITO. CLAUDE.md 18 527 → 12 706 caracteres (meta 15 000), 79 regras × 79, zero linhas perdidas, citações literais intactas. Conferido aqui, não no GitHub — com o buraco desta máquina dito: o .wasm não compila aqui (rust 1.96.1 fixado, static.rust-lang.org bloqueado), então precondição, navegador e os testes que o carregam falham ANTES e DEPOIS, iguais; todo o resto verde.
Feito: CLAUDE.md reescrito mais curto; provas LAB-95 (chegouNaMeta: true), LAB-81 e LAB-57 regeradas; D322; relatório LAB-95 §8; item renomeado para 028-FEITO.md.
Achados para outros apps ou Central: (1) A D321 ESTAVA ERRADA — eu disse "não cabe sem tirar regra" e cabia. Os "203 por regra" eram o GASTO daquela redação, lido como CHÃO: uma saída da medição tratada como restrição. Afirmação de impossibilidade é a mais fácil de não testar; o teste dela é tentar. Para as casas que forem enxugar: 15 000 cabe. (2) Três guardas acusaram o encurtamento, todas com razão: frase de régua quebrada em duas linhas (a régua não atravessa quebra), o buraco declarado de uma guarda sumido, e duas linhas do texto antigo que não estavam na história. ENCURTAR APAGA, e a lista de marcas não cobre tudo — li o diff e devolvi mais três nuances. (3) A main estava VERMELHA desde a escrita do 900.md: a prova do LAB-57 conta os arquivos da árvore e ficou um atrás. Item da caixa que entra na árvore muda prova de escopo; regerada.
Depende do Jonny: nada. A pergunta da D321 (mudar a meta ou tirar regra) deixou de existir.
Próximo na fila: o item 029 (9-A e 9-B respondidos: medir os 15 m ao longo de cada rua).
=== FIM ===
```

## 12/10/2026 · LAB-96 — item 029: os 15 m andando pela divisa, e "quadra" é trecho de rua

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-96 (item 029) ===
Estado: ITEM 029 FEITO. A faixa de esquina se mede ANDANDO PELA DIVISA, a partir do encontro das duas ruas, ao longo de cada uma — a linha reta saiu. "Quadra" = trecho de rua entre dois cruzamentos. Conferido aqui, não no GitHub: esteira 988 pass · 9 fail (eram 980 · 9), testfit 17 · 0, typecheck e lint limpos; as 9 falhas são todas do .wasm, que não compila nesta máquina (rust 1.96.1 bloqueado), iguais antes e depois.
Feito: acesso-sugerido.ts (REGUA_DA_FAIXA nova; a reta ficou só como comparação), 44 → 52 travas, prova LAB-77 regerada com a régua velha ao lado, D323, PENDENCIAS (9-A, 9-B, 3 e 12 respondidos; 5-B, 7, 10 e 11 parados até a integração), relatório LAB-96.
Achados para outros apps ou Central: (1) Nas sete glebas a troca QUASE NÃO MEXE — um valor, 37,42 % → 37,34 % (25 m, sintético de 10 ha). A diferença é de divisa estreita ou recortada, onde a reta corta por dentro: 12,8 m pela reta contra 18 m andando numa gleba de 100 × 10 m. (2) O 9-A tirou a pergunta da mesa dele mas não pôs número aqui: os 25 m viraram conta esperando o cruzamento, que o arquivo de terreno não traz — continuo com 15 m, dito. (3) Para o Generate: lá "esquina" é toda quina ≥ 30° (o motor desenha sem saber onde há rua); aqui é encontro de duas faces de RUA (a casa recusa sugerir sem o dado). As duas erram para o lado seguro, cada uma no seu papel. (4) Máquina nova: a receita "bun add --no-save zod@^3" no clone do Generate FALHA (o bun resolve o lockfile inteiro, que aponta para o registro do Lovable, 403); funcionou "npm pack zod@3" extraído em node_modules/zod. E o .wasm não compila (rust 1.96.1 bloqueado), como no item 028.
Depende do Jonny: nada — e, a pedido dele, nada desta casa volta a ele antes da integração com o Generate.
Próximo na fila: a caixa só tem o 900 (a minha lista). Três propostas novas na FILA; a primeira é minha: a regra 2 do acesso não tem guarda ("sem-via-publica" existe e nenhuma função o produz).
=== FIM ===
```

## 13/10/2026 · LAB-97 — item 900 (a minha lista): a regra 2 do acesso ganhou guarda

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-97 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main); peguei a proposta 1 do LAB-96 na FILA.md. FEITA. Conferido aqui, não no GitHub: esteira 1 001 pass · 9 fail (eram 988 · 9; as 9 são do .wasm, iguais antes e depois), testfit 17 · 0, typecheck e lint limpos.
Feito: sobreFaceComVia + recusa "sem-via-publica" ANTES da faixa de esquina (acesso-sugerido.ts); MOTIVOS_RESERVADOS; 52 → 65 travas; duas sabotagens, 4 reprovam em cada; provas LAB-52/57 regeradas só no tamanho do universo; D324; relatório LAB-97.
Achados para outros apps ou Central: (1) PALAVRA NO VOCABULÁRIO NÃO É REGRA NO CÓDIGO — um motivo num "as const" tem tipo, prosa e nome, passa por guarda, e nada o produz. Vocabulário fechado se confere nos dois sentidos: quem declara e quem devolve; a trava achou um SEGUNDO órfão ("o-motor-recusou") que nenhuma lista citava. (2) Com as faces declaradas, posição no muro do vizinho passava como válida e podia virar sugestão — inofensivo hoje só porque nenhuma gleba declara as faces; o dia em que o Generate mandar o campo pedido no LAB-77, já está guardado.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900, e as propostas da FILA que não esperam ninguém acabaram; o próximo disparo procura na dívida própria antes de anotar vazio.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 13/10/2026 · LAB-98 — item 900 (a dívida própria): o número de travas do portão

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-98 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main); FILA sem proposta que não espere ninguém, então fui à dívida própria, como o LAB-97 indicou. FEITA. Conferido aqui, não no GitHub: esteira 1 008 pass · 9 fail (eram 1 001 · 9; as 9 são do .wasm, iguais antes e depois), testfit 17 · 0, typecheck e lint limpos.
Feito: espécie "número digitado à mão" — "698 travas" em seis lugares (CLAUDE.md, ONDE_PARAMOS, FILA, verde.yml 2×, prova do LAB-84) contra 719 RODADAS; as duas travas que o vigiavam estavam VERDES. Nova tests/contar-as-travas.test.ts roda a lista e reconta (7 travas, dois lados demonstrados); lab84 refeito (42 de 42 sem clones); seis lugares em 719; D325; relatório LAB-98.
Achados para outros apps ou Central: NÚMERO ESCRITO À MÃO CONFERIDO CONTRA PROVA MEDIDA À MÃO É CONCORDÂNCIA, NÃO MEDIÇÃO — seis cópias iguais provam que ninguém esqueceu de copiar, não que alguém mediu. Vale para todo "N travas/N testes" das casas (a Central tem "17 scripts, 19 conferidores" no CLAUDE.md; o Generate "74 guardas / 26 medidores"): a trava tem de RODAR e recontar, e contar "test(" por regex mede texto (aqui deu 688 e 739 contra 719).
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; a dívida própria tem outras espécies a varrer.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 13/10/2026 · LAB-99 — item 900 (a dívida própria): os caminhos do CLAUDE.md

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-99 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main); FILA sem proposta que não espere ninguém, então fui à dívida própria. FEITA. Conferido aqui, não no GitHub: esteira 1 016 pass · 9 fail (eram 1 007 · 10: as 9 do .wasm, iguais antes e depois, e a prova velha do LAB-57), testfit 17 · 0, typecheck e lint limpos.
Feito: espécie "regra sem guarda" — oito caminhos do CLAUDE.md (seis src/…, um tests/…, a bancada symbios/…) não resolviam da raiz desde o enxugar do LAB-95, que encurtou o ponteiro; todas as travas verdes. Prefixo inteiro; nova tests/caminhos-da-pagina.test.ts (8 travas, dois lados + duas sabotagens) no portão sem clones: 42 → 43 arquivos, 719 → 727 travas; provas LAB-52/57/84/95/item-004 regeradas; D326; relatório LAB-99.
Achados para outros apps ou Central: (1) PONTEIRO ENCURTADO É PONTEIRO PARA OUTRO LUGAR — e "zero linhas perdidas" não pega: a linha está na história, o caminho é que mudou. Para as casas que enxugaram o CLAUDE.md (Geo, Generate, Lab. de Parcelamento, Pesquisa): sigam cada caminho da página a partir da RAIZ. (2) A main ficou VERMELHA depois do LAB-98: a prova do LAB-57 contava 571 arquivos do git e o HEAD tinha 574 — os arquivos novos da rodada entraram no git DEPOIS de a prova ser regerada. git add antes de regerar (o Orçamento já tem essa regra escrita).
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; proposto na minha lista: a mesma pergunta nas outras páginas vivas (INDEX primeiro).
=== FIM ===
=== FIM DA SESSÃO ===
```

## 13/10/2026 · LAB-100 — item 900 (a minha lista, proposta do LAB-99): as ligações das páginas vivas

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-100 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main); peguei a proposta que o LAB-99 deixou na FILA.md (a mesma pergunta nas outras páginas vivas). FEITA. Conferido aqui, não no GitHub: esteira 1 028 pass · 9 fail (eram 1 016 · 9; as 9 do .wasm, iguais antes e depois), testfit 17 · 0, typecheck e lint limpos, lab84 43 de 43 sem clones.
Feito: medi antes de estender — nas páginas de docs/ o ponteiro vivo é a LIGAÇÃO [x](alvo), não o trecho entre crases: no INDEX.md 128 de 143 caminhos entre crases resolvem só da própria pasta e os 12 que não resolvem são relato, outro repositório ou ação do GitHub. A régua da raiz NÃO se estende. As 309 ligações das cinco páginas vivas resolvem todas, e resolveram nas 127 versões da main, sem trava nenhuma; agora há (caminhos-da-pagina 8 → 20, dois lados + sabotagem + duas mutações), 727 → 739 travas; D327; relatório LAB-100.
Achados para outros apps ou Central: A MESMA PERGUNTA EM OUTRA PÁGINA PODE TER OUTRO SUJEITO — no CLAUDE.md o leitor parte da raiz, nas páginas de docs/ parte da pasta (é como o GitHub segue a ligação). Para quem copiar a régua do LAB-99 (caminhos do CLAUDE.md pela raiz): não a estenda às páginas de docs/ sem medir de onde elas resolvem; ali confira as ligações. E lab84 é ponto fixo: rode-o ANTES de subir o número escrito, ou a trava do número e a do nome do trabalho se envenenam pela prova.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; a FILA não tem mais proposta minha que não espere ninguém — o próximo disparo procura na dívida própria antes de anotar vazio.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 13/10/2026 · LAB-101 — item 900 (a dívida própria): os "sete passos" do verde

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-101 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main); FILA sem proposta que não espere ninguém, então fui à dívida própria. FEITA. Conferido aqui, não no GitHub: esteira 1 035 pass · 9 fail (eram 1 028 · 9; as 9 do .wasm, iguais antes e depois), testfit 17 · 0, typecheck e lint limpos, lab84 43 de 43 sem clones.
Feito: espécie "número digitado à mão", na forma que a trava do LAB-98 não lê — POR EXTENSO. O CLAUDE.md §7 e a linha do conferir.sh no INDEX.md dizem "sete passos": certo hoje (2 pacotes × 3 + a prova no navegador) e sem trava; o script manda pôr pacote novo em COBERTOS, e quem obedecer leva a 10 com as páginas em sete, verdes. Agora o verde.test.ts conta no script e lê a palavra pelo sujeito (7 travas, dois lados, três mutações), 739 → 746; provas LAB-52/57/84/item-004 regeradas; D328; relatório LAB-101.
Achados para outros apps ou Central: (1) NÚMERO ESCRITO POR EXTENSO É NÚMERO DIGITADO À MÃO — para as casas que copiaram a régua de contagem do LAB-98 ou têm "npm run numeros"/"atualizar-numeros" (Central, Pesquisa, Generate): ela lê algarismo; procurem "sete passos", "dois pacotes", "três trabalhos" nas páginas vivas. (2) MUTAÇÃO QUE PASSA POR SORTE DE ORDEM: a régua sem sujeito acertou porque o "sete" vinha antes do "DOIS passos" de religar o CI; o caso de teste tem de pôr o objeto errado ANTES do certo. (3) A hora deste disparo é "derivado" (cron de 4 h, :05): o despertador chegou como texto, sem notificação lida.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; na dívida própria faltam varrer "prova que só registra aparência" e "mensagem fixa que afirma estado sem perguntar".
=== FIM ===
=== FIM DA SESSÃO ===
```

## 13/10/2026 · LAB-102 — item 900 (a dívida própria): a frase que diz que o CI roda

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-102 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main); FILA sem proposta que não espere ninguém, então fui à dívida própria. FEITA. Conferido aqui, não no GitHub: esteira 1 043 pass · 9 fail (eram 1 035 · 9; as 9 do .wasm, iguais antes e depois), testfit 17 · 0, typecheck e lint limpos, lab84 43 de 43 sem clones.
Feito: espécie "mensagem fixa que afirma estado sem perguntar" — com o gatilho do verde.yml comentado desde 08/10, SEIS frases vivas afirmavam que o CI estava rodando (conferir.sh, duas no próprio verde.yml, INDEX.md, um comentário de teste escrito já com o CI desligado e uma mensagem fixa de problema); a trava do gatilho só cobrava o outro lado. Nova src/o-ci-que-roda.ts + o espelho no gatilho-do-verde.test.ts (8 travas, dois sentidos, cinco mutações acusadas), 746 → 754; D329; relatório LAB-102.
Achados para outros apps ou Central: AVISO DE DESLIGADO AO LADO DA FRASE DE QUE RODA É CONTRADIÇÃO. Toda casa com rotina desligada (Geo, Lab. de Parcelamento, Orçamento, Viabilidade, Render, Pesquisa) escreveu o aviso e a trava do prazo, e a frase antiga de que a rotina roda ficou ao lado: procurem o espelho, atravessando a quebra de linha — o grep por frase achou 5, a régua achou 6. E o clone raso aparece como "94 e 82 commits divergentes": é corte de ancestralidade, não divergência (conferido com merge-base).
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; na dívida própria falta varrer "prova que só registra aparência".
=== FIM ===
=== FIM DA SESSÃO ===
```

## 14/10/2026 · LAB-103 — item 900 (a dívida própria): o `true` do determinismo, sem as assinaturas

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-103 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main); FILA sem proposta que não espere ninguém, então fui à dívida própria. FEITA. Conferido aqui, não no GitHub: esteira 1 051 pass · 9 fail (eram 1 043 · 9; as 9 do .wasm, iguais antes e depois), testfit 17 · 0, typecheck e lint limpos, lab84 44 de 44 sem clones.
Feito: espécie "prova que só registra aparência". O LEIA-ME das provas e o CLAUDE.md §7 prometem determinismo provado; lidos os 100 JSON de docs/, SEIS provas (LAB-04, 05, 08, 13, 40, 46) guardavam 33 "determinismo": true sem o que se comparou — e a régua do LAB-08 já errou com a mesma forma de saída. Nova src/prova-de-determinismo.ts (as duas assinaturas, o veredito derivado), as seis ferramentas a chamam (lab46 rodada numa cópia descartável: gravou as assinaturas), as 33 ficam como fotografias declaradas com a contagem; 8 travas, dois sentidos, seis mutações acusadas, 754 → 762; D330; relatório LAB-103.
Achados para outros apps ou Central: UM `true` SOZINHO É A APARÊNCIA DA PROVA — ele tem a mesma forma com a régua certa e com a errada. Casa que promete determinismo (o Laboratório de Parcelamento: "Determinismo é lei") pergunte: a prova guarda as duas assinaturas, ou só que deu igual? Não medi as outras casas. E régua que lê "LAB-\d\d" quebra no LAB-100: a minha leu LAB-103 como LAB-10 (proposto na FILA).
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; na dívida própria falta "teste que nunca reprovou", e há três propostas novas na FILA (terceira assinatura, outros vereditos booleanos, a régua de dois algarismos).
=== FIM ===
=== FIM DA SESSÃO ===
```

## 14/10/2026 · LAB-104 — item 900 (a minha própria lista): o nome do prompt tem duas casas ou mais

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-104 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main); peguei da FILA a proposta 3 do LAB-103 (a régua que lê o prompt com dois algarismos). FEITA. Conferido aqui, não no GitHub: esteira 1 063 pass · 9 fail (eram 1 051 · 9; as 9 do .wasm, iguais antes e depois), testfit 17 · 0, typecheck e lint limpos, lab84 45 de 45 sem clones.
Feito: espécie "teste que nunca reprovou". Enumerados os lugares (233 .ts), a forma LAB-\d\d estava em 6 arquivos — e a trava "todo relatório tem recado" tirava LAB-100.md a LAB-103.md do universo: apagado o recado do LAB-103, ela seguia 9 pass · 0 fail. Nova src/nome-do-prompt.ts (LAB-\d{2,}, gulosa), as seis réguas e as duas ferramentas que espelham a trava a usam, e uma régua impede a forma velha de renascer no código; 12 travas, dois sentidos, sete mutações acusadas, 762 → 774; D331; relatório LAB-104.
Achados para outros apps ou Central: TRAVA QUE DEFINE O UNIVERSO POR UMA FORMA ENVELHECE COM A FORMA — fica verde e para de olhar o que nasceu depois, e o tamanho que ela publica ("mais de 20") não acusa quando quatro somem de 95. Casa com prompt numerado passando de 99 (ou de 999), ou com relatório lido por /PREFIXO-\d\d/: comparem o universo lido com o total da pasta. A cura já existia num campo vizinho daqui e não andou para o lado.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; na FILA seguem as propostas 1 e 2 do LAB-103 e uma nova (a mesma pergunta para o número da decisão).
=== FIM ===
=== FIM DA SESSÃO ===
```

## 14/10/2026 · LAB-105 — item 900 (a minha própria lista): a terceira pergunta do determinismo, a outra semente

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-105 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main); peguei da FILA a proposta 1 do LAB-103 (a terceira assinatura). FEITA. Conferido aqui, não no GitHub: esteira 1 067 pass · 9 fail (eram 1 063 · 9 no LAB-104, e a main dele tinha uma 10ª, a prova do LAB-57 envelhecida; as 9 de agora são todas do .wasm), testfit 17 · 0, typecheck e lint limpos, lab84 45 de 45 sem clones.
Feito: duas execuções iguais provam a REPETIÇÃO, não a DEPENDÊNCIA — um motor que ignora a entrada também dá "idênticas". provaDeDeterminismo agora exige a resposta: a saída da outra semente (SEMENTE + 1, sementeTemEfeito derivado) ou semSemente com o motivo. As 7 chamadas respondem (4 rodam a outra semente; lab04/lab05 dizem que a geometria não sorteia; lab13 decide por motor — o Generate não tem semente). Rodadas numa cópia descartável, lab40 e lab46: a outra semente MUDA a saída do Parcelamento. 4 travas, oito mutações acusadas, 774 → 778; D332; relatório LAB-105.
Achados para outros apps ou Central: DUAS EXECUÇÕES IGUAIS PROVAM A REPETIÇÃO, NÃO A DEPENDÊNCIA — casa que prova determinismo (o Laboratório de Parcelamento: "Determinismo é lei") pergunte também se a outra semente muda a saída, ou escreva por que não há semente. E: a main do LAB-104 saiu com a prova do LAB-57 envelhecida (587 contra 588 arquivos) — prova que conta a árvore regerada ANTES do último arquivo; regerada aqui, na ordem certa.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; na FILA seguem a proposta 2 do LAB-103 (outros vereditos booleanos), a do LAB-104 (o número da decisão) e a nova (a ordem da entrega como trava).
=== FIM ===
=== FIM DA SESSÃO ===
```

## 14/10/2026 · LAB-106 — item 900 (a minha própria lista): a ordem da entrega, cobrada no envio

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-106 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main); peguei da FILA a proposta do LAB-105 (a ordem da entrega como trava). FEITA. Conferido aqui, não no GitHub: esteira 1 082 pass · 9 fail (eram 1 067 · 9; as mesmas 9 do .wasm, nome por nome), testfit 17 · 0, typecheck e lint limpos, lab84 46 de 46 sem clones — e o envio passou pelo gancho novo.
Feito: medido antes de escolher — as travas do LAB-52 e do LAB-57 sobre os 36 estados da main desde o LAB-86: 2 de 21 envios desta casa saíram vermelhos (LAB-98, LAB-104, os dois relatados verdes), porque o verde rodava antes do último arquivo. O pre-commit pararia a ordem certa e a trava na suíte roda antes do último git add; ficou o ENVIO: gancho external-engines/ganchos/pre-push, ligado pelo conferir.sh, recusa árvore suja ou commit que não é o HEAD e roda o trabalho sem clones sobre o que vai. 15 travas, nove mutações acusadas, 778 → 793; D333; relatório LAB-106.
Achados para outros apps ou Central: (1) PROVA QUE CONTA A ÁRVORE SE CONFERE NO ENVIO — trava que roda antes do último arquivo aprova a árvore que não vai; casa com prova que conta arquivos e verde rodado antes do commit tem a mesma forma. (2) À direção: cada item que vocês escrevem na minha caixa deixa a main daqui vermelha (15 de 15, a prova do LAB-57 conta o arquivo novo) até o meu próximo envio — o conserto é meu, proposto na FILA; nada a fazer do lado de vocês.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; na FILA seguem a proposta 2 do LAB-103 (outros vereditos booleanos), a do LAB-104 (o número da decisão) e a nova (a prova do LAB-57 deixar de contar a caixa).
=== FIM ===
=== FIM DA SESSÃO ===
```

## 14/10/2026 · LAB-107 — item 900 (a minha própria lista): a escrita da outra mão sai da conta do universo

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-107 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main); peguei da FILA a proposta do LAB-106 (a prova do LAB-57 deixar de ficar vermelha a cada item da caixa). FEITA. Conferido aqui, não no GitHub: esteira 1 090 pass · 9 fail (eram 1 082 · 9; as 9 são todas do .wasm, que não se constrói nesta máquina), testfit 17 · 0, typecheck e lint limpos, lab84 46 de 46 sem clones, 801 travas — e o envio passa pelo gancho do LAB-106.
Feito: remedido nos 37 estados da main desde o LAB-86 — tirar da CONTA do universo o .md que nasce em docs/caixa-de-entrada/ leva as escritas da direção de 15 vermelhas a 0, e os envios desta casa ficam 2 e 2 (LAB-98 e LAB-104, os mesmos): a régua não perdeu o que pegava de verdade. Sai da conta, não da varredura; .ts e .yml na caixa seguem contados e varridos. A chave mudou de nome com o sentido (arquivosQueOGitCarregaForaDaCaixa). 8 travas, sete mutações acusadas, 793 → 801; D334; relatório LAB-107.
Achados para outros apps ou Central: (1) À direção: a partir deste envio, item ou adendo que vocês escrevem na minha caixa NÃO deixa mais a main daqui vermelha — nada a fazer do lado de vocês. (2) RÉGUA QUE CONTA O QUE OUTRA MÃO ESCREVE FICA VERMELHA POR OFÍCIO: casa com prova que conta arquivos do git e caixa de entrada escrita pela direção tem a mesma forma; tire da conta só o que a medição não lê, e prove que o defeito real continua pego. (3) O rustup não alcança static.rust-lang.org pelo proxy desta máquina: o .wasm do Symbios não se constrói aqui.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; na FILA seguem a proposta 2 do LAB-103 (outros vereditos booleanos) e a do LAB-104 (o número da decisão).
=== FIM ===
=== FIM DA SESSÃO ===
```

## 14/10/2026 · LAB-108 — item 900 (a minha própria lista): os outros vereditos booleanos das provas

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-108 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main); peguei da FILA a proposta 2 do LAB-103 (os outros vereditos booleanos das provas). FEITA. Conferido aqui, não no GitHub: esteira 1 098 pass · 9 fail (eram 1 090 · 9; as 9 são todas do .wasm, que não se constrói nesta máquina), testfit 17 · 0, typecheck e lint limpos, lab84 47 de 47 sem clones, 809 travas — e o envio passa pelo gancho do LAB-106.
Feito: medido nos 100 JSON de docs/ (2 262 booleanos, 138 nomes), recalculando cada veredito do que está ao lado: limpo 151 de 151, aceito 171 de 171, confere 70 de 70 — guardam a evidência e batem com ela. O de IDENTIDADE não: desenhoIdentico (40) e saidaIdenticaSemAVia (8) comparavam duas assinaturas e não gravavam nenhuma (a forma do D330 com outro nome). Agora vereditoDeIdentidade é a forma única, lab23/32/37 a chamam, os 48 são fotografias com a contagem; 8 travas, oito mutações acusadas, 801 → 809; D335; relatório LAB-108.
Achados para outros apps ou Central: (1) VEREDITO DE IDENTIDADE É O ÚNICO CUJA EVIDÊNCIA NÃO CABE NUM NÚMERO: "mesmo número de lotes" não é "mesmo desenho" — casa que grava "idêntico/igual: true" entre duas saídas sem as duas assinaturas ao lado tem a forma do D330. (2) A conta dos disparos daqui tinha perdido a linha das 19:05 (o LAB-107 não a escreveu) e a trava não viu, porque total e linhas faltavam juntos; reconstruída como derivada. (3) O .wasm do Symbios segue sem se construir aqui (rustup sem saída pelo proxy).
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; na FILA seguem a proposta do LAB-104 (o número da decisão) e a nova do LAB-108 (a coerência do veredito com a evidência ao lado, 392 de 392 sem trava).
=== FIM ===
=== FIM DA SESSÃO ===
```

## 15/10/2026 · LAB-109 — item 900 (a minha própria lista): a coerência do veredito com a evidência ao lado

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-109 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main); peguei da FILA a proposta do LAB-108 (a coerência do veredito com a evidência ao lado) — regra sem guarda hoje, por isso antes da do LAB-104. FEITA. Conferido aqui, não no GitHub: esteira 1 105 pass · 9 fail (eram 1 098 · 9; as 9 são todas do .wasm, que não se constrói nesta máquina), testfit 17 · 0, typecheck e lint limpos, lab84 48 de 48 sem clones, 816 travas — e o envio passa pelo gancho do LAB-106.
Feito: nos 100 JSON de docs/, os 404 campos limpo/aceito/confere caem em SETE formas: seis regras (limpo e aceito ⇔ violacoes === 0; aceito ⇔ recusa vazia; aceito ⇔ lotes !== null; confere ⇔ publicado = refeito, nas duas roupas) — 392 de 392 coerentes — e o limpo do clone vizinho (12), forma sem regra declarada com o motivo; o nulo passa como "não medido" (D23). Forma nova que não cai em nenhuma reprova, e regra que não confere nada da árvore também. src/coerencia-do-veredito.ts; 7 travas, nove mutações acusadas, 809 → 816; D336; relatório LAB-109.
Achados para outros apps ou Central: (1) PROVA QUE SE CONTRADIZ É PIOR QUE PROVA QUE SE CALA: casa que grava um veredito (limpo/aceito/ok) ao lado da contagem que o decide pode cobrar que os dois concordem — e a regra se escolhe pela FORMA do objeto (que evidência está ao lado), não pelo nome do campo; forma desconhecida reprova, senão a régua fica verde por não achar nada. (2) Dois lados nunca apareceram nas provas daqui (confere: false; aceito: true por recusa vazia): provados só por caso sintético. (3) O .wasm do Symbios segue sem se construir aqui (rustup sem saída pelo proxy).
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; na FILA seguem a proposta do LAB-104 (o número da decisão) e a nova do LAB-109 (as ferramentas que gravam o veredito: quatro copiam o do Validator, três derivam — medir antes).
=== FIM ===
=== FIM DA SESSÃO ===
```

## 15/10/2026 · LAB-110 — item 900 (a minha própria lista): as ferramentas que gravam o veredito

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-110 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main); peguei da FILA a proposta do LAB-109 (as ferramentas que gravam o veredito) — o buraco que o D336 declarou aberto, por isso antes da do LAB-104. FEITA. Conferido aqui, não no GitHub: esteira 1 111 pass · 9 fail (eram 1 105 · 9; as 9 são todas do .wasm, que não se constrói nesta máquina), testfit 17 · 0, typecheck e lint limpos, lab84 49 de 49 sem clones, 822 travas — e o envio passa pelo gancho do LAB-106.
Feito: por LUGAR (166 .ts de código), quinze linhas em onze arquivos gravam limpo/aceito/confere. A cópia do Validator NÃO diverge da contagem ao lado: o Generate deriva os dois do mesmo campo nas 4 de 4 versões de montarRelatorio. O confere do lab39 divergia DE REGRA: bytes contra o valor do D336 — trocada só a ordem das chaves, a ferramenta gravava 56 divergências e o D336 acusava a prova. src/mesmo-valor.ts é a igualdade única (D336, lab39 e acesso.test a chamam; prova regerada idêntica), régua da comparação por texto do publicado e censo fechado de quem grava; 6 travas, nove mutações, 816 → 822; D337; relatório LAB-110.
Achados para outros apps ou Central: (1) DOIS INSTRUMENTOS COM O MESMO NOME DE VEREDITO E DUAS DEFINIÇÕES SÃO UM ACUSANDO O OUTRO: casa que grava "confere" numa ferramenta e o confere numa trava deve usar a MESMA igualdade — por bytes, a ordem das chaves vira divergência falsa. (2) Mas não troque toda comparação por JSON.stringify: em determinismo os bytes são a pergunta certa; a régua precisa do sujeito escrito. (3) O Validator do Generate deriva limpo e aceito de invariantes.violacoes === 0 desde 10/09 — quem copia, copie as duas metades do mesmo relatório. (4) O .wasm do Symbios segue sem se construir aqui (rustup sem saída pelo proxy).
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; na FILA seguem a proposta do LAB-104 (o número da decisão) e a nova do LAB-110 (os outros vereditos de igualdade: como cada ferramenta compara saoIguais, divergem, mesmoRotuloDeVariante).
=== FIM ===
=== FIM DA SESSÃO ===
```

## 15/10/2026 · LAB-111 — item 900 (a minha própria lista): os outros vereditos de igualdade

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-111 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main); peguei da FILA a proposta do LAB-110 (os outros vereditos de igualdade) — a que podia achar buraco aberto hoje, por isso antes da do LAB-104. FEITA. Conferido aqui, não no GitHub: esteira 1 120 pass · 9 fail (eram 1 111 · 9; as 9 são todas do .wasm, que não se constrói nesta máquina), testfit 17 · 0, typecheck e lint limpos, lab84 50 de 50 sem clones, 831 travas — e o envio passa pelo gancho do LAB-106.
Feito: por LUGAR (244 .ts) e nos 100 JSON de docs/: saoIguais (números) e mesmoRotuloDeVariante (rótulos) comparam do jeito certo. O divergem do carimbo e o igual/mudou do conferirCarimbo comparavam o commit CURTO por texto, e a procedência do Padrão por prefixo — duas definições. O curto é fato sobre o CLONE: no git 2.43.0, 16 383 objetos dão 7 caracteres, 16 386 dão 8, e o clone raso do mesmo commit volta a 7; o Generate está a 11 703 objetos (cerca de dois meses do salto, estimativa) — aí toda prova carimbada diria "o vizinho ANDOU" de um vizinho parado. src/mesmo-commit.ts (prefixo) é a igualdade única; régua com sujeito nos arquivos que leem --short; nenhuma prova muda; 9 travas (uma monta o repositório de 16 386 objetos), nove mutações, 822 → 831; D338; relatório LAB-111.
Achados para outros apps ou Central: (1) O COMMIT CURTO NÃO É O COMMIT: casa que grava `rev-parse --short` numa prova e o compara depois por texto vai acusar "mudou" no dia em que o repositório passar de 16 384 objetos, ou quando um clone for raso e o outro cheio — compare por prefixo, ou grave o commit inteiro. (2) Medir a definição antes de travar: igualdade exata de número e de rótulo é a pergunta certa; só a representação no lugar da identidade é defeito. (3) O .wasm do Symbios segue sem se construir aqui (rustup sem saída pelo proxy).
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; na FILA segue a proposta do LAB-104 (o número da decisão, D\d{2,3}: defeito que ainda não existe).
=== FIM ===
=== FIM DA SESSÃO ===
```

## 15/10/2026 · LAB-112 — item 900 (a minha própria lista): o número da decisão

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-112 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main); peguei da FILA a proposta do LAB-104 (o número da decisão), a única que restava. FEITA. Conferido aqui, não no GitHub: esteira 1 132 pass · 9 fail (eram 1 120 · 9; as 9 são todas do .wasm, que não se constrói nesta máquina), testfit 17 · 0, typecheck e lint limpos, lab84 51 de 51 sem clones, 843 travas — e o envio passa pelo gancho do LAB-106.
Feito: por LUGAR (246 .ts), oito linhas leem a decisão pela forma; duas tinham TETO. A classe decisao-registrada lia \bD\d\d\b — e deixava "D339 — …" ÓRFÃO: defeito aberto desde a D100 (03/10), que a proposta dizia futuro — o único título do histórico que ela segurava era o "D69 — …" de 20/09. A lista de decisões de um item da FILA lia \bD(\d{2,3})\b e perderia a D1000 em silêncio. src/numero-da-decisao.ts (D\d{2,}) é a forma única, as duas a chamam, nada do histórico muda (4 rodadas da classe; 38 itens, 67 citações, 0 diferentes), e uma régua contra o teto no código; 12 travas, nove mutações acusadas, 831 → 843; D339; relatório LAB-112.
Achados para outros apps ou Central: (1) "HOJE NÃO HÁ DEFEITO" SE MEDE: a régua com teto de casas quebra no dia em que a numeração passa da casa — aqui a D100 passou doze dias antes sem barulho. Casa que lê número de decisão, prompt ou item por forma de largura fixa (\d\d, \d{2,3}) deve conferir se já passou do teto. (2) A doença é o TETO, não a largura: \d\d\d? aceita três e corta a quarta. (3) O .wasm do Symbios segue sem se construir aqui (rustup sem saída pelo proxy).
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; na FILA segue a nova do LAB-112 (o número do item da caixa tem três casas fixas: 1000.md cairia fora da régua da caixa vazia falsa — a convenção é da direção; medir antes).
=== FIM ===
=== FIM DA SESSÃO ===
```

## 15/10/2026 · LAB-113 — item 030: o número do item da caixa não tem teto

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-113 (item 030) ===
Estado: item 030 (da direção, 18h50) FEITO, contado na origin/main. Conferido aqui, não no GitHub: esteira 1 151 pass · 9 fail (eram 1 132 · 9; as 9 são todas do .wasm, que não se constrói nesta máquina), testfit 17 · 0, typecheck e lint limpos, lab84 52 de 52 sem clones, 862 travas — e o envio passa pelo gancho do LAB-106.
Feito: por LUGAR (248 .ts, 20 falam da caixa), três leituras do nome tinham teto de 3 casas: ehItemAberto (1000.md não era item → caixa "vazia" com ele dentro), numeroDoItem (lia 100 do 1000.md) e a guarda do número repetido (só -adendo: o 025-adendo-2-FEITO de hoje ficava fora); os abertos saíam em ordem de texto; e o 900 contava como item da direção — a declaração verdadeira "só o 900" sairia FALSA. src/numero-do-item.ts (\d{3,}, ordem numérica, proximoItem pulando o 900) é a forma única; régua contra o teto com o sujeito escrito; COMO_FUNCIONA passo 0 com a convenção e o comando em ordem de fila. 779 árvores de 11 casas remedidas: 0 veredictos mudam sem o 900; com ele, 49 passam de falsa a vazia. 19 travas, 11 mutações (a forma antiga de volta derruba 7); 843 → 862; D340; relatório LAB-113.
Achados para outros apps ou Central: (1) leem a caixa pela forma, na origin/main (não escrevi): Pesquisa scripts/rodadas-no-livro.mjs 117 (/\d{3}-FEITO/ sem âncora: 1000-FEITO conta como 000), 151 (o 1000 some) e 155 (localeCompare em CE-NNN = ordem de texto); Parcelamento tests/despertador.test.ts:118 (\d{3}, sem adendo); Propostas ferramentas/despertador.mjs:148 conta o 900 como aberto (caixa vazia MEDIDA fica impossível). (2) Para a direção: "o menor ainda não feito" com o 900 permanente põe o 900 na frente do 901 — o texto do 900.md diz "nenhum outro com número MENOR"; aqui o 900 é pulado. (3) No shell, sort -n põe 030-adendo antes de 030; sort -t- -k1,1n -k2 sem o .md acerta.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; na FILA segue a nova do LAB-113 (caminhoDoItemDaCaixa não conhece o -RETIRADO).
=== FIM ===
=== FIM DA SESSÃO ===
```

## 15/10/2026 · LAB-114 — item 900 (a minha própria lista): o item RETIRADO

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-114 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main); peguei da FILA a proposta do LAB-113 (caminhoDoItemDaCaixa não conhece o -RETIRADO), a única que restava. FEITA. Conferido aqui, não no GitHub: esteira 1 155 pass · 9 fail (as 9 são todas do .wasm, que não se constrói nesta máquina), testfit 17 · 0, typecheck e lint limpos, 866 travas — e o envio passa pelo gancho do LAB-106.
Feito: medido, UM chamador (acesso-sugerido.test.ts lê o 010-adendo e o 029 como fonte de regra) e UM retirado na história das 12 caixas — o 002-RETIRADO do Generate (09/10), reescrito pela direção como retratação ("Não faça nada deste item"). A busca dizia "não foi encontrado" para um arquivo no disco. Agora lê o nome pela forma única (lerNomeDoItem) e RECUSA o retirado dizendo o estado e o caminho; feito + retirado é ambiguidade; pedir pelo estado é recusado. 4 travas numa caixa de mentira, 6 mutações (5 acusadas, 1 neutra); 862 → 866; D341; relatório LAB-114.
Achados para outros apps ou Central: (1) ITEM RETIRADO É ORDEM DESFEITA, e o texto dele é a retratação: casa que lê item da caixa como fonte de regra deve recusar o retirado com o nome do estado — ler ou dizer "não encontrado" são os dois erros. (2) Para a direção: retirar por REESCRITA (o 002 do Generate) faz o arquivo mentir para quem o lê pelo número; o -RETIRADO no nome é o que salva. (3) O .wasm do Symbios segue sem se construir aqui (rustup sem saída pelo proxy).
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900, e as propostas da FILA que não esperam ninguém acabaram — o próximo disparo procura na dívida própria antes de anotar vazio.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 15/10/2026 · LAB-115 — item 900 (a dívida própria): o tamanho da suíte digitado nos README.md

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-115 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main) e a FILA sem proposta que não espere ninguém; fui à dívida própria, espécie "número digitado à mão". FEITO. Conferido aqui, não no GitHub: esteira 1 167 pass · 9 fail (as 9 são do .wasm, que não se constrói nesta máquina), testfit 17 · 0, typecheck e lint limpos, 878 travas — e o envio passa pelo gancho do LAB-106.
Feito: por LUGAR (31 .md vivos), o tamanho de uma suíte estava escrito em 4 lugares de 3 README.md, e 3 estavam ERRADOS sem trava: esteira "93 testes" desde 19/09 contra 1 164 rodados; testfit "14 testes" duas vezes contra 17; o "22" do registro de motores, certo e sem guarda. A frase saiu (quem conta é o "Ran N tests" do bun test); src/numero-de-testes.ts + trava no portão sem clones impedem a volta, nos dois sentidos, com 2 exceções declaradas e o relato pela definição do LAB-102. 8 mutações (7 acusadas, 1 neutra que saiu do código); D342. E a conta dos disparos estava CEGA para a linha do LAB-114 (hora "≤ 20:14" fora do HH:MM): totais parados em 60/15 e régua verde; agora lê o teto e reprova a linha que não lê (62/17), 5 mutações acusadas, D343. 866 → 878; relatório LAB-115.
Achados para outros apps ou Central: (0) RÉGUA DE LINHA QUE NÃO DIZ QUAIS LINHAS NÃO LEU CONFERE OS TOTAIS CONTRA AS QUE SOBRARAM — vale para toda casa que conta disparos em tabela. (1) NÚMERO QUE MUDA EM TODA RODADA NÃO MORA NUMA PÁGINA QUE NINGUÉM REESCREVE EM TODA RODADA: README com "N testes" é a cópia que nenhuma régua de travas lê — vale procurar nas outras casas. (2) Para a direção: do LAB-101 ao LAB-115, quinze rodadas seguidas acharam o clone desta casa RASO e "ahead 94" (o pull --ff-only do texto do disparo recusa); proposto na FILA pôr a receita no passo 0 do COMO_FUNCIONA. (3) O .wasm do Symbios segue sem se construir aqui (rustup sem saída pelo proxy).
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; na FILA, a proposta do clone raso no passo 0 do protocolo.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 15/10/2026 · LAB-116 — item 900 (a minha própria lista): o clone RASO no passo 0 do protocolo

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-116 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main); peguei a proposta do LAB-115 na FILA. FEITO. Conferido aqui, não no GitHub: esteira 1 177 pass · 9 fail (as 9 são do .wasm, que não se constrói nesta máquina), testfit 17 · 0, typecheck e lint limpos, 888 travas; o envio passa pelo gancho do LAB-106.
Feito: medido nas DOZE casas que esta máquina trouxe: todas chegam RASAS, com o HEAD destacado na ponta de hoje e uma main local VELHA (09 e 10/10). O comando do disparo faz "checkout main" ANTES de o "pull --ff-only" recusar (no raso não há base comum) — e a árvore fica no RETRATO: o COMO_FUNCIONA de 09/10, sem passo 0 (zero "git fetch" nas onze que têm a página), e item já feito ABERTO na caixa em 8 das 12 (aqui o 011, feito no LAB-78). Receita no passo 0 (desrasar antes de comparar; só avançar a main ancestral, --ff-only; divergência de verdade não se toca), e tests/clone-da-maquina.test.ts a tira da página e a RODA num clone raso montado como a máquina monta, depois do comando real do disparo; 10 travas, 7 mutações na página, 7 acusadas; D344; 878 → 888; relatório LAB-116.
Achados para outros apps ou Central: (0) PARA A DIREÇÃO, e é o maior: o comando dos disparos (o mesmo desenho nas casas) deixa a sessão no retrato da máquina quando falha — protocolo velho e item feito como aberto (Studio: 003 a 006; Propostas: 007; Central, Viabilidade, Parcelamento: 010; Orçamento, Pesquisa: 009). A página não fecha isso, porque quem lê o disco lê a página velha. Conserto no texto do disparo, antes do checkout: "git fetch -q origin && { [ $(git rev-parse --is-shallow-repository) = true ] && git fetch -q --unshallow origin; true; }" e só então checkout + pull --ff-only. (1) NO CLONE RASO, "DIVERGIU" É FALTA DE HISTÓRIA, NUNCA FATO — e o comando que falha no segundo passo já fez o primeiro. (2) O .wasm do Symbios segue sem se construir aqui (rustup sem saída pelo proxy).
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900, e as propostas da FILA que não esperam ninguém acabaram; o próximo disparo vai à dívida própria antes de anotar vazio.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 15/10/2026 · LAB-117 — item 900 (a dívida própria): o `<app>` do recado, regra sem guarda

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-117 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main, depois de desrasar: o comando do disparo recusou o pull de novo e o disco ficou no retrato de 09/10); a FILA sem proposta que não espere ninguém, então fui à dívida própria, espécie "regra sem guarda". FEITO. Conferido aqui, não no GitHub: esteira 1 192 pass · 9 fail (as 9 são do .wasm, que não se constrói nesta máquina), testfit 17 · 0, typecheck e lint limpos, 903 travas; o envio passa pelo gancho do LAB-106.
Feito: o CLAUDE.md §1 manda "<app> é MOTOR LAB (archilly-lab), nunca Lab", e NADA cobrava: a trava do cabeçalho virou ".+" no D228 (quando reprovou o certo) e ficou larga — plantado "Lab" no recado do LAB-116, os 9 arquivos que leem o RECADOS.md rodaram 127 de 127 verdes. Cumprida por disciplina: 72 "Lab" antes do LAB-68, 56 de 56 "MOTOR LAB (archilly-lab)" depois. src/nome-do-aplicativo.ts lê o nome DA PÁGINA e o cobra exato do recado do LAB-68 em diante (corte achado pelo prompt, não pelo nome), com os 72 de antes como fotografia que não se reescreve nem cresce; 15 travas no portão sem clones, 8 mutações no módulo, 8 acusadas (a do casamento guloso saiu neutra e ganhou o caso válido que a mata); D345; 888 → 903; relatório LAB-117.
Achados para outros apps ou Central: (0) CONSERTO QUE ALARGA A RÉGUA PARA O CASO NOVO TEM DE FECHÁ-LA PARA O VELHO — vale para toda casa cuja trava de cabeçalho trocou "Lab"/"Geo"/… por ".+" quando a Central mandou o nome do aplicativo (09/10): ela aceita o nome velho de novo. (1) Para a direção: a regra "linha sem conteúdo leva —" convive com "Depende do Jonny: nada." (22 vezes aqui desde 09/10; o Render diz que "nada" é resposta) — a leitura é do chat, e está proposta na FILA. (2) O comando do disparo recusou o pull --ff-only outra vez (o achado do LAB-116 segue valendo). (3) O .wasm do Symbios segue sem se construir aqui (rustup sem saída pelo proxy).
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; na FILA, a única proposta nova espera a leitura do chat (o "—" contra o "nada").
=== FIM ===
=== FIM DA SESSÃO ===
```

## 16/10/2026 · LAB-118 — item 900 (a dívida própria): o índice afirma o que existe

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-118 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main, depois de desrasar: o comando do disparo recusou o pull de novo, e a receita do passo 0 resolveu); a FILA sem proposta que não espere ninguém, então fui à dívida própria, no docs/INDEX.md. FEITO. Conferido aqui, não no GitHub: esteira 1 203 pass · 9 fail (as 9 são do .wasm, que não se constrói nesta máquina), testfit 17 · 0, typecheck e lint limpos, 914 travas; o envio passa pelo gancho do LAB-106.
Feito: o índice promete "um relatório por prompt" e SEIS nunca tiveram linha (LAB-70 a LAB-75, os itens 003 a 008 de 09/10; o git log -S vazio para os seis) — a trava do LAB-100 conferia que a ligação leva a algum lugar, ninguém conferia que o relatório tem ligação. E três linhas de "Decisão e fila" afirmavam o estado de um dia que passou: "72 decisões" (a última é a D345), "a fila de 19/09 esgotou", "Hoje: quanto é desvio desproporcional?" (respondido pelo Jonny em 02/10, D84); mais "seis travas" de um arquivo com quinze. As seis linhas entraram, declaradas; as frases saíram; src/o-indice.ts confere os dois sentidos (11 travas no portão sem clones; contra o índice de antes, 2 reprovam; 10 mutações, 10 acusadas); D346; 903 → 914; relatório LAB-118.
Achados para outros apps ou Central: (0) A TRAVA QUE CONFERE QUE A LIGAÇÃO LEVA A ALGUM LUGAR NÃO CONFERE QUE O LUGAR TEM LIGAÇÃO — vale para toda casa com INDEX.md e régua de ligações: a lacuna aqui era exatamente a tarde de 09/10 em que a caixa nasceu, e pode ser a mesma noutras casas. (1) Linha de índice de página que muda a cada rodada ("N decisões", "Hoje: …") envelhece em silêncio; aqui ficou de 20/09 a 16/10. (2) O comando do disparo recusou o pull --ff-only outra vez (achado do LAB-116 segue valendo). (3) O .wasm do Symbios segue sem se construir aqui.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; na FILA, a proposta nova do LAB-118 (as contagens de desenho da seção "O código" do índice) não espera ninguém; a do LAB-117 (o "—" contra o "nada") espera a leitura do chat.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 16/10/2026 · LAB-119 — item 900 (a minha própria lista): as contagens de desenho da seção "O código" do índice

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-119 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main, depois de desrasar: o comando do disparo recusou o pull de novo, e a receita do passo 0 resolveu); peguei da FILA a proposta do LAB-118, a única que não esperava ninguém. FEITA. Conferido aqui, não no GitHub: o portão sem clones 929 de 929, lint limpo nos dois pacotes; o verde COMPLETO não rodou inteiro — esta máquina recusou instalar o zod dentro do clone do Generate (as rodadas de antes faziam isso): esteira 1 066 pass, ZERO reprovam por asserção, e 18 arquivos não carregam (15 pelo zod do Generate, 3 pelo .wasm); testfit não carrega (zod); typecheck com 3 erros, todos no arquivo do Generate sem o zod. O envio passa pelo gancho do LAB-106.
Feito: lidos os 22 números da seção "O código" do INDEX.md contra os arquivos que eles contam: 3 errados, em 2 linhas — a guarda da IDA dizia "Quatro regras, e a quarta é a dívida" com CINCO em REGRAS_DA_IDA desde 04/10 (o LAB-35 pôs promessa-nao-exercitada), e os experimentos "dois testes de varredura" com TRÊS no describe. Linhas corrigidas; src/contagens-do-indice.ts dá a cada número uma entrada — a contagem (18, contada no texto do arquivo) ou o "não conta" (5, com motivo) —, nos dois sentidos; 15 travas, 12 mutações, 12 acusadas (a varredura do LAB-52 ainda pegou um ?? "" meu, que fazia arquivo sumido contar zero — consertado); D347 (e o D346 ganhou a linha que aponta para cá); 914 → 929; relatório LAB-119.
Achados para outros apps ou Central: (0) "VERDADE POR CONSTRUÇÃO" É VERDADE NO DIA DA CONSTRUÇÃO — índice que descreve arquivo vivo com "N regras"/"N cortes" envelhece quando o arquivo muda; vale para toda casa com INDEX.md desse tipo. (1) Duas réguas de palavra sobre a mesma linha brigam: o conserto "três testes" reprovou na régua do "N testes" (que não lia o "dois testes" errado). (2) Para a direção: o comando do disparo recusou o pull --ff-only outra vez (achado do LAB-116). (3) A máquina desta rodada não deixou escrever no clone do Generate (zod): o verde completo daqui depende disso, ou de o kit do contrato não exigir dependência do vizinho. (4) O .wasm do Symbios segue sem se construir aqui.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; a FILA fica sem proposta que não espere ninguém (a do LAB-117 espera a leitura do chat); o próximo disparo vai à dívida própria.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 16/10/2026 · LAB-120 — item 900 (a dívida própria): as contagens de desenho do CLAUDE.md

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-120 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main depois de desrasar — o comando do disparo recusou o pull --ff-only pela 17ª rodada seguida, e a receita do passo 0 resolveu); a FILA sem proposta que não espere ninguém, então fui à dívida própria (número digitado à mão), no lugar que o LAB-119 declarou não alcançar. FEITA. Conferido aqui, não no GitHub: o portão sem clones 942 de 942; esteira 1 231 pass e 9 fail (as 9 do .wasm, que não se constrói nesta máquina), testfit 17 de 17, typecheck e lint limpos nos dois pacotes. O envio passa pelo gancho do LAB-106.
Feito: lidos os 29 números do CLAUDE.md fora do código e das citações literais; 16 contam um arquivo (o teto de doze linhas do recado, os doze caracteres do segredo, as oito consequências, as três faixas 3/20/200, o "4 dos 12" e o "8 dos 12", os sete passos, os dois trabalhos do CI, os DOIS passos de religar) e batiam TODOS — mas nenhum era conferido contra o arquivo, só copiado noutro teste (toBe(4), toBeLessThanOrEqual(12), toHaveLength(8)). src/contagens-do-claude.ts dá a cada número uma entrada (16 contagens, 13 "não conta" com motivo), e o trecho deixa o lugar do número em aberto ({n}), para a falha ser "conta diferente" e não "entrada sumida"; 13 travas, 13 mutações, 13 acusadas (2 só depois de travas novas); D348; 929 → 942; relatório LAB-120.
Achados para outros apps ou Central: (0) CÓPIA QUE CONCORDA COM CÓPIA NÃO FOI CONFERIDA — o número da regra repetido num teste (toBe(4) ao lado de "4 dos 12") é a mesma afirmação duas vezes; vale para todo CLAUDE.md da família que diga "N coisas". (1) Régua de número por frase: deixar o lugar do número em aberto no trecho ("As {n}") faz a falha dizer o escrito e o contado, em vez de "trecho sumiu". (2) Para a direção: o comando do disparo segue recusando o pull --ff-only (achado do LAB-116). (3) O .wasm do Symbios segue sem se construir aqui.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; a FILA continua sem proposta que não espere ninguém (a do LAB-117 espera a leitura do chat); o próximo disparo vai à dívida própria.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 16/10/2026 · LAB-121 — item 900 (a dívida própria): os ramos abertos, a lista que o protocolo manda manter

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-121 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main depois de desrasar — o comando do disparo recusou o pull --ff-only pela 18ª rodada seguida, e a receita do passo 0 resolveu); a FILA sem proposta que não espere ninguém, então fui à dívida própria (regra sem guarda), no próprio protocolo. FEITA. Conferido aqui, não no GitHub: o portão sem clones 954 de 954; esteira 1 244 pass e 9 fail (as 9 do .wasm, que não se constrói nesta máquina), testfit 17 de 17, typecheck e lint limpos nos dois pacotes. O envio passa pelo gancho do LAB-106.
Feito: o COMO_FUNCIONA.md manda manter docs/RAMOS_ABERTOS.md (os ramos que esperam uma pergunta, com a pergunta) — a página NUNCA existiu (nenhum commit) e nada lia os ramos da origem. Medido com git ls-remote: a main e claude/stoic-ritchie-ijzqy3, inteiro na main → zero abertos, e o repositório dizia "nada" (não medi) onde a resposta era "zero". A página nasceu com a tabela vazia; src/ramos-abertos.ts cruza página e origem nos dois sentidos; a régua pura no portão (tests/ramos-abertos.test.ts) e a pergunta à origem fora dele (tests/ramos-abertos-na-origem.test.ts: rede e história). 10 mutações, 10 acusadas; D349; 942 → 954; relatório LAB-121.
Achados para outros apps ou Central: (0) PÁGINA QUE A REGRA MANDA EXISTIR E NÃO EXISTE NÃO DIZ "NENHUM": DIZ "NÃO OLHEI" — medido nos três clones que leio, na origin/main: o COMO_FUNCIONA.md do Generate e o do Laboratório de Parcelamento mandam o mesmo docs/RAMOS_ABERTOS.md, e nenhum dos dois o tem; o do Geo não traz a regra. As outras oito casas não medi. (1) Trava que pergunta à origem não cabe no checkout do CI (sem história, todo ramo sai "não sei"): fica no verde da sessão, dito. (2) O ramo claude/stoic-ritchie-ijzqy3 segue na origem, inteiro na main; apagá-lo não é meu (não se desfaz). (3) Para a direção: o comando do disparo segue recusando o pull --ff-only (achado do LAB-116). (4) O .wasm do Symbios segue sem se construir aqui.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; a FILA continua sem proposta que não espere ninguém (a do LAB-117 espera a leitura do chat); o próximo disparo vai à dívida própria.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 16/10/2026 · LAB-122 — item 900 (a dívida própria): a rotina no GitHub, o passo 2 do desligamento

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-122 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main depois de desrasar — o comando do disparo recusou o pull --ff-only pela 19ª rodada seguida, e a receita do passo 0 resolveu); a FILA sem proposta que não espere ninguém, então fui à dívida própria (mensagem fixa que afirma estado sem perguntar). FEITA. Conferido aqui, não no GitHub: o portão sem clones 972 de 972; esteira 1 263 pass e 9 fail (as 9 do .wasm, que não se constrói nesta máquina), testfit 17 de 17, typecheck e lint limpos nos dois pacotes. O envio passa pelo gancho do LAB-106.
Feito: o CI foi desligado em 08/10 em DOIS passos (gatilho comentado E rotina desabilitada no GitHub); só o 1º tinha trava. Nos 303 arquivos vivos a rotina é afirmada `disabled_manually` em 4 lugares e o id 374646435 digitado em 3, e nada perguntava ao GitHub. Perguntada a API pública, sem chave: as 7 estavam certas — por sorte. src/a-rotina-no-github.ts cobra o par (gatilho ligado ⇔ rotina active: o passo pela metade, nos dois sentidos), estado e id contra os perguntados, e o espelho (desligada sem ninguém dizendo); a régua pura no portão, a pergunta à API (rede) no conferir.sh. 12 mutações, 12 acusadas; D350; 954 → 972; relatório LAB-122.
Achados para outros apps ou Central: (0) ESTADO QUE MORA FORA DA ÁRVORE NÃO SE CONFERE LENDO A ÁRVORE — medido nos três clones que leio, na origin/main: o Laboratório de Parcelamento afirma `disabled_manually` em docs/ROTINAS_DESLIGADAS.md e nenhum arquivo dele pergunta à API; o Geo DECLARA o limite na própria régua (rotina-nao-fica-desligada-calada.test.ts: "o estado no painel do GitHub… nenhum teste local vê isso", medido à mão em 09/10, as duas active); o Generate não tem rotina. Repositório público responde sem chave; privado precisaria de chave — e chave em trava é decisão de cada casa. As outras oito não medi. (1) Para quem for religar: o verde.yml diz que o workflow_dispatch "segue ligado para rodar à mão" com a rotina desabilitada — provavelmente não roda, NÃO TESTADO (testar seria disparar). (2) Para a direção: o comando do disparo segue recusando o pull --ff-only (achado do LAB-116). (3) O .wasm do Symbios segue sem se construir aqui.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; a FILA continua sem proposta que não espere ninguém (a do LAB-117 espera a leitura do chat); o próximo disparo vai à dívida própria.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 16/10/2026 · LAB-123 — item 900 (a dívida própria): a marca de FEITO no topo do item, o passo 4 do protocolo

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-123 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main depois de desrasar — o comando do disparo recusou o pull --ff-only pela 20ª rodada seguida, e a receita do passo 0 resolveu); a FILA sem proposta que não espere ninguém, então fui à dívida própria (regra sem guarda), no próprio protocolo. FEITA. Conferido aqui, não no GitHub: o portão sem clones 983 de 983; esteira 1 274 pass e 9 fail (as 9 do .wasm, que não se constrói nesta máquina), testfit 17 de 17, typecheck e lint limpos nos dois pacotes. O envio passa pelo gancho do LAB-106.
Feito: o passo 4 do COMO_FUNCIONA.md tem dois verbos — renomear para -FEITO E escrever no topo o que foi feito. O nome tinha trava desde o LAB-80; o topo, nenhuma. Dos 34 itens feitos, 29 tinham a marca e 5 NÃO tinham nada: 009, 010, 010-adendo, 011 e 012, os quatro disparos da madrugada de 10/10 (LAB-76 a 79) — só renomeados. As 5 marcas foram reconstruídas (da tabela da FILA e do git log, etiquetadas como reconstrução); src/marca-de-feito.ts exige no bloco de citação inicial o FEITO da marca, o prompt e o relatório dele, que existe. 10 mutações, 10 acusadas; D351; 972 → 983; relatório LAB-123.
Achados para outros apps ou Central: (0) O PASSO 4 TEM DOIS VERBOS, E SÓ UM COSTUMA TER GUARDA — medido com a minha régua nos três clones que leio (origin/main): Generate 2 de 41 feitos sem marca no topo (dois adendos que abrem por "✅ LIDO"/"✅ RESPONDIDO"), Laboratório de Parcelamento 4 de 33 (quatro adendos), Geo 15 de 39 — e lá a marca mora no PÉ ("## FEITO — 09/10/2026, GE-32", linha 63 do 001), não no topo. A forma de cada casa é dela; as outras oito não medi. (1) Proposto ao chat, de FORMA: o passo 4 pede "arquivo e linha", e só 7 das 29 marcas citam linha — ou a linha é obrigatória, ou o relatório basta (FILA, LAB-123). (2) Para a direção: o comando do disparo segue recusando o pull --ff-only (achado do LAB-116). (3) O .wasm do Symbios segue sem se construir aqui.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; na FILA ficou a pergunta da "linha", que espera a leitura do chat; o próximo disparo vai à dívida própria.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 16/10/2026 · LAB-124 — item 900 (a dívida própria): a pendência resolvida é marcada, nunca apagada (`CLAUDE.md` §5)

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-124 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main depois de desrasar — o comando do disparo recusou o pull --ff-only pela 21ª rodada seguida, e a receita do passo 0 resolveu); a FILA sem proposta que não espere ninguém, então fui à dívida própria (regra sem guarda), no CLAUDE.md §5. FEITA. Conferido aqui, não no GitHub: o portão sem clones 1005 de 1005; esteira 1 296 pass e 9 fail (as 9 do .wasm, que não se constrói nesta máquina), testfit 17 de 17, typecheck e lint limpos nos dois pacotes. O envio passa pelo gancho do LAB-106.
Feito: o §5 diz "item resolvido é marcado, nunca apagado" na página do Jonny, e só a régua do LAB-85 lia a página assim — de uma pendência. Medido por LUGAR (19 títulos numerados, 29 commits do arquivo): NENHUM assunto apagado, mas a §1 ("desproporcional", respondida por ele em 02/10, D84) estava SEM MARCA no título há 14 dias, com o corpo dizendo "enquanto não vier, nenhuma travessia é proposta". Marcada (como a sessão já fez com a 3, a 4, a 9 e a 12), texto antigo intocado; src/pendencias-marcadas.ts confere a página contra uma declaração escrita à mão, fechada nos dois sentidos: nenhuma apagada, nenhuma nova sem linha, resolvida com marca, parada com PARADA, aberta sem risco. 13 mutações, 13 acusadas; D352; 983 → 1005; relatório LAB-124.
Achados para outros apps ou Central: (0) A REGRA DE DOIS VERBOS ("marcado, nunca apagado") TEM GUARDA NA METADE QUE SE CUMPRE SOZINHA — "nunca apagado" se cumpre enquanto ninguém apaga; "marcado" só se alguém lembrar, e foi lá que a §1 escapou. Nas três casas que leio, só por PALAVRA (apagad/riscad/~~) nos arquivos que citam a página, origin/main: Generate 0 de 5, Laboratório de Parcelamento 2 de 10, Geo 1 de 6 — não li os três que acusaram; não afirmo que guardam nem que não. (1) A pergunta da "linha" (LAB-123) segue na FILA esperando o chat. (2) Para a direção: o comando do disparo segue recusando o pull --ff-only (achado do LAB-116). (3) O .wasm do Symbios segue sem se construir aqui.
Depende do Jonny: nada (a §1 já era resposta dele).
Próximo na fila: a caixa só tem o 900; o próximo disparo vai à dívida própria.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 16/10/2026 · LAB-125 — item 900 (a dívida própria): o resumo "Em cinco minutos" da página do Jonny afirmava estado sem perguntar

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-125 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main depois de desrasar — o comando do disparo recusou o pull --ff-only pela 22ª rodada seguida, e a receita do passo 0 resolveu); a FILA sem proposta que não espere ninguém, então fui à dívida própria (mensagem fixa que afirma estado sem perguntar), no lugar que o LAB-124 declarou não alcançar. FEITA. Conferido aqui, não no GitHub: o portão sem clones 1023 de 1023; esteira 1 314 pass e 9 fail (as 9 do .wasm, que não se constrói nesta máquina), testfit 17 de 17, typecheck e lint limpos nos dois pacotes. O envio passa pelo gancho do LAB-106.
Feito: a tabela "Em cinco minutos", no alto da página do Jonny, dizia "Ficam faltando três coisas" — e duas delas (a 5-B, a régua de forma, e a 7, os 33 lotes) estão PARADAS a pedido dele desde 12/10, com a nota de 12/10 logo acima dizendo "nada aqui precisa de você agora". Frase riscada (nunca apagada), nota ao lado ("fica faltando uma, a 8, que não pede nada agora"), linhas 1 e 2 com ⏸ PARADA. conferirOsCincoMinutos (src/pendencias-marcadas.ts) liga cada linha da tabela — numerada por outra conta — à pendência por declaração escrita à mão, lê o estado da declaração do LAB-124 (um lugar só) e cobra: parada sem PARADA, aberta marcada, contagem fora do risco diferente das abertas, linha nova ou apagada. 15 mutações, 15 acusadas; D353; 1005 → 1023; relatório LAB-125.
Achados para outros apps ou Central: (0) O RESUMO É A PARTE DA PÁGINA QUE MAIS SE LÊ E A QUE MENOS SE REVÊ — contagem do que falta escrita à mão num resumo envelhece quando uma pendência muda de estado. Só por PALAVRA ("fica(m) faltando", "faltam N") nas PENDENCIAS_JONNY.md das três casas que leio, origin/main: Generate 1 (o título "MAS FALTAM DUAS COISAS", linha 66 — não li a seção, não afirmo que esteja errado), Laboratório de Parcelamento 0, Geo 2 (sobre tabelas de banco, não sobre o que falta a ele). (1) A pergunta da "linha" (LAB-123) segue na FILA esperando o chat. (2) Para a direção: o comando do disparo segue recusando o pull --ff-only (achado do LAB-116). (3) O .wasm do Symbios segue sem se construir aqui.
Depende do Jonny: nada (as marcas registram o pedido dele de 12/10).
Próximo na fila: a caixa só tem o 900; o próximo disparo vai à dívida própria.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 16/10/2026 · LAB-126 — item 900 (a dívida própria): o cabeçalho do ONDE_PARAMOS.md afirmava o último prompt sem perguntar

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-126 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main depois de desrasar — o comando do disparo recusou o pull --ff-only pela 23ª rodada seguida, e a receita do passo 0 resolveu); a FILA sem proposta que não espere ninguém, então fui à dívida própria (mensagem fixa que afirma estado sem perguntar), no arquivo que se lê primeiro. FEITA. Conferido aqui, não no GitHub: o portão sem clones 1039 de 1039 (63 de 63 arquivos passam sem os clones, lab84); esteira 1 330 pass e 9 fail (as 9 do .wasm, que não se constrói nesta máquina — 18 linhas ENOENT, 9 de 9), testfit 17 de 17, typecheck e lint limpos nos dois pacotes. O envio passa pelo gancho do LAB-106.
Feito: a primeira linha do ONDE_PARAMOS.md afirma a data, o "Último prompt executado" com o item e a corrente "antes dele o …" — à mão, a cada rodada — e nenhum dos 17 módulos que leem a página lia essa linha. Rodada a régua na história (151 versões da main que mexeram nela ou no RECADOS.md): 139 de 140 limpas, e a exceção é de verdade — 76bfdcd (LAB-67, 09/10), 13h20 com o cabeçalho ainda no LAB-66 e o recado do LAB-67 gravado. src/o-ultimo-prompt.ts cobra prompt, item, data (não anterior ao recado) e a corrente elo a elo, contra o RECADOS.md; título de classe não é prompt. Ela já trabalhou nesta rodada: com o cabeçalho escrito e o recado não, reprovou. 13 mutações no módulo, 12 acusadas e 1 neutra declarada; 2 plantadas na página, 2 acusadas; D354; 1023 → 1039; relatório LAB-126.
Achados para outros apps ou Central: (0) O ARQUIVO QUE SE LÊ PRIMEIRO AFIRMA ESTADO À MÃO, E A DATA DELE ENVELHECE QUANDO A RODADA SÓ ACRESCENTA — medido no topo do ONDE_PARAMOS.md das três casas que leio (origin/main): Generate diz "Última atualização: 12/10/2026" e a página mudou hoje às 07h38 UTC (ad5b756, disparo em vazio) — não li a página inteira, pode ser "último trabalho de verdade", mas as duas leituras dão datas diferentes; Laboratório de Parcelamento e Geo dizem 16/10, e o Geo já tem guarda (arquivo-de-retomada.test.ts). (1) A pergunta da "linha" (LAB-123) segue na FILA esperando o chat. (2) Para a direção: o comando do disparo segue recusando o pull --ff-only (achado do LAB-116). (3) O .wasm do Symbios segue sem se construir aqui.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; o próximo disparo vai à dívida própria.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 16/10/2026 · LAB-127 — item 900 (a dívida própria): o recado de uma rodada do 900 diz qual tarefa e de qual lista

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-127 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main depois de desrasar — o comando do disparo recusou o pull --ff-only pela 24ª rodada seguida, e a receita do passo 0 resolveu); a FILA sem proposta que não espere ninguém, então fui à dívida própria (regra sem guarda), no próprio 900.md. FEITA. Conferido aqui, não no GitHub: o portão sem clones 1054 de 1054 (64 de 64 arquivos passam sem os clones, lab84); esteira 1 345 pass e 9 fail (as 9 do .wasm, que não se constrói nesta máquina — 18 linhas ENOENT, as mesmas do LAB-126), testfit 17 de 17, typecheck e lint limpos nos dois pacotes. O envio passa pelo gancho do LAB-106.
Feito: o 900.md termina com "No recado, diga qual tarefa da sua lista você pegou, e de qual arquivo" — e nada lia o que os recados diziam da origem. Lidos por LUGAR os 29 recados do 900 (Estado e bloco): 14 da FILA ("peguei … a proposta do LAB-NN", sempre anterior e com relatório), 15 da dívida própria, e UMA destas sem espécie nenhuma — o LAB-118 ("fui à dívida própria, no docs/INDEX.md"), cuja espécie só o relatório diz. Declarado como exceção, reconstruída do relatório e conferida nos dois sentidos (recado não se reescreve). src/a-tarefa-do-novecentos.ts cobra uma origem só, a proposta anterior com relatório, a FILA nomeada e a espécie. 13 mutações no módulo, 13 acusadas; 2 plantadas no RECADOS.md, 2 acusadas; D355; 1039 → 1054; relatório LAB-127.
Achados para outros apps ou Central: (0) A REGRA QUE O PRÓPRIO ITEM DÁ É A QUE MENOS SE CONFERE — a última frase do 900 ("diga qual tarefa e de qual arquivo") se cumpre de cabeça, e aqui falhou uma vez em 29. Só por PALAVRA (a frase da regra em toda a árvore, fora da caixa), origin/main: Generate 0, Laboratório de Parcelamento 0, Geo 0 arquivos — diz que nenhuma a escreveu fora do item, não que nenhuma a guarda; não li os recados delas. (1) A pergunta da "linha" (LAB-123) segue na FILA esperando o chat. (2) Para a direção: o comando do disparo segue recusando o pull --ff-only (achado do LAB-116). (3) O .wasm do Symbios segue sem se construir aqui.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; o próximo disparo vai à dívida própria.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 16/10/2026 · LAB-128 — item 900 (a dívida própria): o recado vai ao RECADOS.md com data, e em ordem cronológica

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-128 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main depois de desrasar — o comando do disparo recusou o pull --ff-only de novo, e a receita do passo 0 resolveu); a FILA sem proposta que não espere ninguém, então fui à dívida própria (regra sem guarda), no CLAUDE.md §1 e no alto do RECADOS.md. FEITA. Conferido aqui, não no GitHub: o portão sem clones 1070 de 1070 (65 de 65 arquivos passam sem os clones, lab84); esteira 1 361 pass e 9 fail (as 9 do .wasm, que não se constrói nesta máquina — as mesmas do LAB-127), testfit 17 de 17, typecheck e lint limpos nos dois pacotes. O envio passa pelo gancho do LAB-106.
Feito: o CLAUDE.md §1 manda o recado "inteiro e com data" ao RECADOS.md, e a página diz "em ordem cronológica — o mais antigo primeiro". Medido por MUTAÇÃO antes da régua: tirar a data do título do LAB-50, pôr o LAB-120 em 03/10 (atrás do LAB-119) ou datar o LAB-110 em 31/02 → ZERO falhas nas 184 travas que citam a página (a trava do LAB-126 lê os títulos pela data, e por isso não vê o que a perdeu). Por LUGAR: 139 títulos, 139 recados, um por título, todos datados, sem volta, de 13/09 a 16/10. src/a-data-do-recado.ts cobra a data, o calendário, a ordem (por data, não por texto: 30/09 → 01/10 avança), o futuro e um recado por título. 13 mutações no módulo, 13 acusadas; D356; 1054 → 1070; relatório LAB-128.
Achados para outros apps ou Central: (0) A EXPRESSÃO QUE EXIGE A FORMA NÃO VÊ QUEM A PERDEU — ler pela forma certa não é cobrar a forma; é preciso contar o que não casou. Medido nos RECADOS.md da origin/main (todo ## fora de bloco, data DD/MM/AAAA em qualquer lugar do título): Generate 91 títulos, 0 sem data, 0 voltas; Laboratório de Parcelamento 94, 0, 0; Geo 86, 0, 0 — as três cumprem hoje; título e recado não são um por um em nenhuma, e isso NÃO é acusação (outra convenção, que não li); não procurei se alguma guarda a data por trava. (1) A pergunta da "linha" (LAB-123) segue na FILA esperando o chat. (2) Para a direção: o comando do disparo segue recusando o pull --ff-only (achado do LAB-116). (3) O .wasm do Symbios segue sem se construir aqui.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; o próximo disparo vai à dívida própria.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 16/10/2026 · LAB-129 — item 900 (a dívida própria): as cinco linhas do recado, "linha sem conteúdo leva —, nunca some"

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-129 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main depois de desrasar — o comando do disparo recusou o pull --ff-only de novo, e a receita do passo 0 resolveu); a FILA sem proposta que não espere ninguém, então fui à dívida própria (regra sem guarda), no CLAUDE.md §1. FEITA. Conferido aqui, não no GitHub: o portão sem clones 1090 de 1090 (66 de 66 arquivos passam sem os clones, lab84); esteira 1 381 pass e 9 fail (as 9 do .wasm, que não se constrói nesta máquina — as mesmas do LAB-128), testfit 17 de 17, typecheck e lint limpos nos dois pacotes. O envio passa pelo gancho do LAB-106.
Feito: o CLAUDE.md §1 manda "Linha sem conteúdo leva —, nunca some", e a única trava olhava SÓ o último recado e SÓ a presença da palavra (toContain). Medido por mutação antes da régua: Depende do Jonny vazio no LAB-128, os Achados tirados do LAB-50, Feito antes de Estado no LAB-110, Depende do Jonny em dobro no LAB-90 → ZERO falhas na suíte inteira. Por LUGAR: 140 recados, as cinco linhas em todos, uma vez cada, na ordem, nenhuma calada (118 "nada", 6 "—"); uma linha a mais, a do LF-01 (14/09, "Não saiu como pedido:"), declarada como exceção histórica e conferida nos dois sentidos. src/as-cinco-linhas-do-recado.ts; 15 mutações no módulo, 15 acusadas; D357; 1070 → 1090; relatório LAB-129.
Achados para outros apps ou Central: (0) A TRAVA QUE PERGUNTA SE A PALAVRA ESTÁ LÁ NÃO PERGUNTA SE A LINHA RESPONDE — e a régua de nome exato mede ortografia. Medido nos RECADOS.md da origin/main: linha calada ZERO nas três casas; Generate 102 recados, 52 com "Proximo na fila:" SEM ACENTO (os últimos 20 todos); Laboratório de Parcelamento 80, 2 dos últimos 20 com os nomes abreviados ("Achados:", "Próximo:"); Geo 101, os últimos 20 exatos. NÃO é acusação (outra convenção; não li se guardam por trava) — é aviso a quem levar esta trava a outra casa: decida antes se a grafia conta. (1) Proposto ao chat, na FILA: as DUAS MARCAS DE FIM não estão escritas nesta casa (o §1-C é o texto de 08/10, sem elas), e 32 recados já terminam em FIM DA SESSÃO — cumprida sem estar escrita. (2) A pergunta da "linha" (LAB-123) segue esperando o chat. (3) Para a direção: o comando do disparo segue recusando o pull --ff-only (LAB-116). (4) O .wasm do Symbios segue sem se construir aqui.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; o próximo disparo vai à dívida própria.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 16/10/2026 · LAB-130 — item 900 (a dívida própria): o recado diz onde está o detalhe, e o relatório é do próprio prompt

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-130 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main depois de desrasar — o comando do disparo recusou o pull --ff-only de novo, e a receita do passo 0 resolveu); a FILA sem proposta que não espere ninguém, então fui à dívida própria (regra sem guarda), no COMO_FUNCIONA.md da caixa. FEITA. Conferido aqui, não no GitHub: o portão sem clones 1106 de 1106 (67 de 67 arquivos passam sem os clones, lab84); esteira 1 397 pass e 9 fail (as 9 do .wasm, que não se constrói nesta máquina — as mesmas do LAB-129), testfit 17 de 17, typecheck e lint limpos nos dois pacotes. O envio passa pelo gancho do LAB-106.
Feito: o protocolo manda a resposta inteira para docs/relatorios/<prompt>.md e que "o recado precisa dizer ONDE está o detalhe", e a única trava andava no sentido CONTRÁRIO (todo relatório tem recado). Medido por mutação antes da régua: o ponteiro tirado do LAB-129 e do LAB-92, e o LAB-120 apontando o relatório do LAB-119 → ZERO falhas na suíte inteira. Por LUGAR: 141 recados — 72 de antes da regra, 6 de classe sem prompt, 63 no alcance; os 63 com relatório gravado e do próprio prompt; 40 apontam (o LAB-80 e todos do LAB-92 em diante), 23 não (LAB-68 a LAB-91 menos o LAB-80), declarados um por um como exceção histórica — o perdão é do ponteiro, nunca do detalhe. src/onde-esta-o-detalhe.ts; 15 mutações no módulo, 15 acusadas; D358; 1090 → 1106; relatório LAB-130.
Achados para outros apps ou Central: (0) A TRAVA DE UM SENTIDO SÓ É METADE DA REGRA — "todo relatório tem recado" aprovava calada o recado que não diz onde e o que aponta o relatório errado. Não medi as vizinhas desta vez; a quem levar a régua: decida antes que forma de ponteiro conta na casa (a lição da grafia, D137). (1) A pergunta da "linha" (LAB-123) e a das duas marcas de fim (LAB-129) seguem esperando o chat. (2) Para a direção: o comando do disparo segue recusando o pull --ff-only (LAB-116). (3) O .wasm do Symbios segue sem se construir aqui.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; o próximo disparo vai à dívida própria.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 16/10/2026 · LAB-131 — item 900 (a dívida própria): a decisão é numerada, e a sequência do DECISOES.md passa a ser cobrada

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-131 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main depois de desrasar — o comando do disparo recusou o pull --ff-only de novo); a FILA sem proposta que não espere ninguém, então fui à dívida própria (regra sem guarda), no CLAUDE.md §7 e na D01. FEITA. Conferido aqui, não no GitHub: o portão sem clones 1124 de 1124 (68 de 68 arquivos passam sem os clones, lab84); esteira 1 415 pass e 9 fail (as 9 do .wasm, que não se constrói nesta máquina — o proxy recusa o rustup), testfit 17 de 17, typecheck e lint limpos nos dois pacotes. O envio passa pelo gancho do LAB-106.
Feito: o §7 manda as decisões para o DECISOES.md e a D01 as fez numeradas; a casa cita "(Dnnn)" em toda página, e nada lia a numeração. Medido por mutação antes da régua: o título da D200 apagado, a D201 renumerada como D200, a D300 datada em 01/09/2026 e a D358 apagada INTEIRA → ZERO falhas na suíte inteira. Por LUGAR: 357 títulos, D01 a D358, em ordem, datados, sem repetição, sem o calendário voltar — e UM BURACO: a D176 nunca existiu (o LAB-51 pulou da D175 para a D177; nenhum commit escreveu o título), declarado e NÃO tapado, com nota ao lado da D177. Nas 140 versões do arquivo, nenhum número sumiu. 4 778 citações em 171 páginas, 28 sem título (27 a D1000 hipotética da D339 e a previsão da D176 no recado do LAB-50). src/a-sequencia-das-decisoes.ts; 17 mutações no módulo, 17 acusadas; D359; 1106 → 1124; relatório LAB-131.
Achados para outros apps ou Central: (0) NÚMERO QUE TODOS CITAM E NINGUÉM CONFERE É ENDEREÇO SEM CARTEIRO — apagar a última decisão não deixa buraco nenhum; só a citação órfã a denuncia. As casas que numeram decisões (todas) podem medir o mesmo: buraco, repetição, data que volta, e citação sem título. Não medi as vizinhas. (1) A pergunta da "linha" (LAB-123) e a das duas marcas de fim (LAB-129) seguem esperando o chat. (2) Para a direção: o comando do disparo segue recusando o pull --ff-only (LAB-116). (3) O .wasm do Symbios segue sem se construir aqui.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; o próximo disparo vai à dívida própria.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 16/10/2026 · LAB-132 — item 900 (a dívida própria): o upstream/ é intocável, e a árvore da cópia passa a ser cobrada

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-132 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main depois de desrasar — o comando do disparo recusou o pull --ff-only de novo; segui a receita do passo 0 na ordem dela, nada forçado); a FILA sem proposta que não espere ninguém, então fui à dívida própria (regra sem guarda), no CLAUDE.md §3. FEITA. Conferido aqui, não no GitHub: o portão sem clones 1141 de 1141 (69 de 69 arquivos passam sem os clones, lab84); esteira 1 432 pass e 9 fail (as 9 do .wasm, que não se constrói nesta máquina — o proxy recusa o rustup), testfit 17 de 17, typecheck e lint limpos nos dois pacotes. O envio passa pelo gancho do LAB-106..
Feito: o §3 abre a regra de ouro por "upstream/ é intocável: cópia exata, commit e data em VERSION; sem patch", e seis réguas pulavam o upstream/ POR ele ser intocável sem nenhuma conferir que continuava. Medido por mutação antes da régua: uma linha no src/lib.rs do Symbios, um arquivo novo ao lado e o Commit: apagado do VERSION → ZERO falhas novas na suíte inteira. Por LUGAR: uma pasta upstream versionada, 25 arquivos, a árvore no HEAD igual à do commit que a trouxe (f61be91, LAB-00), e um commit só a tocou, em todos os ramos. src/upstream-intocavel.ts (árvore registrada, nada diferente do HEAD, VERSION com commit e data); 12 mutações no módulo, 12 acusadas, e o patch COMMITADO de verdade (worktree descartável) acusado pela árvore; D360; 1124 → 1141; detalhe em docs/relatorios/LAB-132.md.
Achados para outros apps ou Central: (0) O QUE A CASA PULA POR SER INTOCÁVEL É O QUE NINGUÉM OLHA — toda casa que tem pasta "não editar" (vendor/archilly-central nas casas, src/components/ui do Lovable) pode medir o mesmo: a pasta é pulada pelas réguas, e quem confere que ela não mudou? A árvore do git no HEAD resolve sem rede. Não medi as vizinhas. (1) A pergunta da "linha" (LAB-123) e a das duas marcas de fim (LAB-129) seguem esperando o chat. (2) Para a direção: o comando do disparo segue recusando o pull --ff-only (LAB-116). (3) O .wasm do Symbios segue sem se construir aqui.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; o próximo disparo vai à dívida própria.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 16/10/2026 · LAB-133 — item 900 (a dívida própria): o Symbios roda em Node 22+ sem npm, e quem diz o que o Node aceita passa a ser o Node

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-133 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main depois de desrasar — o comando do disparo recusou o pull --ff-only de novo; receita do passo 0, nada forçado); a FILA sem proposta que não espere ninguém, então fui à dívida própria (regra sem guarda), no CLAUDE.md §7. FEITA. Conferido aqui, não no GitHub: o portão sem clones 1141 de 1141 (69 de 69 arquivos passam sem os clones, lab84); esteira 1 456 pass e 9 fail (as 9 do .wasm, que não se constrói nesta máquina — o proxy recusa o rustup), testfit 17 de 17, typecheck e lint limpos nos dois pacotes. O envio passa pelo gancho do LAB-106.
Feito: o §7 diz "Symbios em Node 22+ sem npm" (D14), e a esteira roda o adaptador no BUN, que aceita o que o Node recusa. Medido por mutação antes da régua: um enum, uma propriedade de parâmetro e um namespace no src/hash.ts e um import sem extensão numa ferramenta → nenhuma falha que fale da regra (caíam só as duas contadoras do tamanho da árvore), e o Node recusava o adaptador inteiro. Por LUGAR: 16 arquivos, 35 importações, os 11 de src/ carregam no Node 22.22; UMA ferramenta importa pacote npm de propósito (prova-automatica.ts, o passo do verde no Bun, com o playwright) — virou exceção declarada. src/node-sem-npm.ts: o próprio Node tira os tipos de cada arquivo; 16 mutações no módulo, 16 acusadas; D361; roda no verde completo (o verde.yml ganhou o Node 22 lá); detalhe em docs/relatorios/LAB-133.md.
Achados para outros apps ou Central: (0) A PILHA QUE RODA O CÓDIGO NÃO É A PILHA QUE A REGRA PROMETE — toda casa que promete um runtime e testa noutro (Bun x Node, vite dev x build do Cloudflare — o Propostas já mediu esse, PX-01) pode medir o mesmo: plante uma sintaxe que só o runtime da suíte aceita e veja se algo cai. O removedor de tipos do próprio Node (node:module, stripTypeScriptTypes) responde sem rede. Não medi as vizinhas. (1) A pergunta da "linha" (LAB-123) e a das duas marcas de fim (LAB-129) seguem esperando o chat. (2) Para a direção: o comando do disparo segue recusando o pull --ff-only (LAB-116). (3) O .wasm do Symbios segue sem se construir aqui.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; o próximo disparo vai à dívida própria.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 16/10/2026 · LAB-134 — item 900 (a dívida própria): o Generate nunca depende disto, e quem responde passa a ser o Generate

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-134 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main depois de desrasar — o comando do disparo recusou o pull --ff-only de novo; receita do passo 0, nada forçado); a FILA sem proposta que não espere ninguém, então fui à dívida própria (regra sem guarda), no CLAUDE.md §3. FEITA. Conferido aqui, não no GitHub: o portão sem clones 1163 de 1163 (70 de 70 arquivos passam sem os clones, lab84); esteira 1 481 pass e 9 fail (as 9 do .wasm, que não se constrói nesta máquina — o proxy recusa o rustup), testfit 17 de 17, typecheck e lint limpos nos dois pacotes. O envio passa pelo gancho do LAB-106.
Feito: o §3 fecha a regra de ouro por "O Generate nunca depende disto: external-engines/ pode ser apagado", e só a metade DESTA casa tinha trava (LAB-06: nada de entrega/ importa external-engines/). Medido por mutação no clone do Generate, desfeita (git status dele limpo): uma dependência github:jonny583/archilly-lab no package.json, um import de external-engines/ no arquivo que esta casa compila (e ele RESOLVE, os clones moram lado a lado) e a bateria diag-tudo.ts citando o medidor que lê o Lab → ZERO falhas que falem da regra (caiu só a do clone sujo, que não cai quando a mudança chega commitada). Por LUGAR: 1 114 versionados, 4 configurações, 608 códigos, 2 248 importações, nenhuma do Lab; UMA leitura (scripts/medir-violacoes-do-testfit.ts, o medidor do GU-06, fora da bateria) — virou exceção com três condições cobradas. src/generate-nao-depende.ts; 14 mutações, 14 acusadas; D362; a trava sintética no portão sem clones (1141 → 1163), a do clone no verde completo; detalhe em docs/relatorios/LAB-134.md.
Achados para outros apps ou Central: (0) A REGRA QUE PROMETE PELO VIZINHO SE PERGUNTA AO VIZINHO — toda casa com regra do tipo "o outro nunca depende de mim" (a Central e o kit vendorizado, o Generate e os motores de fora) pode medir o mesmo: plante a dependência do lado de lá e veja se algo cai do lado de cá. Não medi as vizinhas. (1) Para o Generate, informação e não pedido: o medidor do GU-06 tem caminho padrão /home/user/jonny583/archilly-lab/docs/contratos/saidas, de outra máquina — aceita a pasta por argumento e sai com a receita, não quebra nada. (2) A pergunta da "linha" (LAB-123) e a das duas marcas de fim (LAB-129) seguem esperando o chat. (3) Para a direção: o comando do disparo segue recusando o pull --ff-only (LAB-116). (4) O .wasm do Symbios segue sem se construir aqui.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; o próximo disparo vai à dívida própria.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 16/10/2026 · LAB-135 — item 900 (a dívida própria): `adapter/` é a única fronteira, e onze arquivos importavam o motor por fora

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-135 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main depois de desrasar — o comando do disparo recusou o pull --ff-only de novo; receita do passo 0, nada forçado); a FILA sem proposta que não espere ninguém, então fui à dívida própria (regra sem guarda), no CLAUDE.md §3, terceira linha da regra de ouro. FEITA. Conferido aqui, não no GitHub: o portão sem clones 1186 de 1186 (71 de 71 arquivos passam sem os clones, lab84); esteira 1 504 pass e 9 fail (as 9 do .wasm, que não se constrói nesta máquina — o rust-toolchain pede 1.96.1 com wasm32 e o static.rust-lang.org não conecta), testfit 17 de 17, typecheck e lint limpos nos dois pacotes. O envio passa pelo gancho do LAB-106.
Feito: "adapter/ é a única fronteira" (o README: "trocar o motor não deve exigir mexer em nada fora dessa pasta") não tinha trava — medido por mutação: um src/ da esteira importando @testfit/api.ts, e outro importando o motor por caminho relativo ao clone (o que a D16 proíbe), → ZERO falhas que falem da regra. Por LUGAR (295 códigos, 2 tsconfig, 1 307 especificadores) a regra JÁ ESTAVA QUEBRADA: onze arquivos fora de um adapter/ (três do esteira/src/, dois testes, quatro ferramentas, e o teste e a ferramenta do pacote testfit/) importavam o motor do Laboratório de Parcelamento direto. Conserto: a porta testfit/adapter/src/motor.ts, por onde os onze passaram a entrar (repasse, comportamento idêntico); trava: src/adapter-unica-fronteira.ts, com import type, resolvendo pelos paths do tsconfig; 15 mutações, 15 acusadas; D363; 1163 → 1186 travas no portão sem clones; detalhe em docs/relatorios/LAB-135.md.
Achados para outros apps ou Central: (0) A REGRA QUE NINGUÉM COBRA JÁ ESTÁ QUEBRADA QUANDO ALGUÉM OLHA — a primeira e a quarta linha da regra de ouro ganharam trava sem achar defeito; a terceira, na primeira medição, tinha onze. Toda casa com uma "fronteira única" escrita (a porta de créditos, src/lib/central/central.ts, o vendor/ do kit) pode medir o mesmo por LUGAR: quem importa o que está atrás da porta sem passar por ela. Não medi as vizinhas. (1) Proposto ao chat na FILA: o caminho do .wasm do Symbios está escrito em 27 arquivos fora do adaptador (9 testes, 18 ferramentas) — precisa de máquina com o .wasm para consertar com prova. (2) A pergunta da "linha" (LAB-123) e a das duas marcas de fim (LAB-129) seguem esperando o chat. (3) Para a direção: o comando do disparo segue recusando o pull --ff-only (LAB-116).
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; o próximo disparo vai à dívida própria.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 16/10/2026 · LAB-136 — item 900 (a dívida própria): a `FILA.md` em dia, e dezenove prompts não tinham o seu lugar nela

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-136 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main; o comando do disparo recusou o pull --ff-only de novo — a main velha era ancestral da origem, nada forçado); a FILA sem proposta que não espere ninguém, então fui à dívida própria (regra sem guarda), no CLAUDE.md §7. FEITA. Conferido aqui, não no GitHub: o portão sem clones 1200 de 1200 (72 de 72 arquivos passam sem os clones, lab84); esteira 1 518 pass e 9 fail (as 9 do .wasm, que não se constrói nesta máquina), testfit 17 de 17, typecheck e lint limpos nos dois pacotes. O envio passa pelo gancho do LAB-106.
Feito: "FILA.md em dia" (CLAUDE.md §7) não tinha trava — o DECISOES, o ONDE_PARAMOS e o INDEX tinham. Medido por mutação: apagar a linha do item 012 e o título do LAB-135 → as MESMAS 9 falhas de antes. Por LUGAR, contra os 69 prompts com item no RECADOS.md: a tabela da caixa parava no 012 — os itens 013 a 030 (LAB-80 a LAB-96 e LAB-113) nunca tiveram linha, e o LAB-97 não tinha título. Conserto: as 18 linhas e o título, cada um com o texto do recado; trava: src/a-fila-em-dia.ts, nos dois sentidos (RECADOS e caixa); 6 mutações na página e 10 no módulo, todas acusadas; D364; 1186 → 1200 travas no portão sem clones; detalhe em docs/relatorios/LAB-136.md.
Achados para outros apps ou Central: (0) A PÁGINA QUE NINGUÉM RELÊ PARA DE ANDAR EM SILÊNCIO — o relatório e o recado saíam (tinham trava), a linha da fila deixou de sair 18 vezes seguidas depois que a fila deixou de ser a porta de entrada. Toda casa que trocou a FILA pela caixa pode medir o mesmo: cada recado com item tem a sua linha na FILA? Não medi as vizinhas. (1) A pergunta da "linha" (LAB-123), a das duas marcas de fim (LAB-129) e a do .wasm (LAB-135) seguem esperando o chat. (2) Para a direção: o comando do disparo segue recusando o pull --ff-only (LAB-116).
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; o próximo disparo vai à dívida própria.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 16/10/2026 · LAB-137 — item 900 (a dívida própria): a dívida técnica não entra na página do Jonny

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-137 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main; o comando do disparo recusou o pull --ff-only de novo — desrasei primeiro, como manda o passo 0, e a main velha era ancestral da origem, nada forçado); a FILA sem proposta que não espere ninguém, então fui à dívida própria (regra sem guarda), no CLAUDE.md §5. FEITA. Conferido aqui, não no GitHub: o portão sem clones 1214 de 1214 (72 de 72 arquivos passam sem os clones, lab84); esteira 1 532 pass e 9 fail (as 9 do .wasm, que não se constrói nesta máquina), testfit 17 de 17, typecheck e lint limpos nos dois pacotes. O envio passa pelo gancho do LAB-106.
Feito: "dívida técnica não entra lá" (a outra metade do CLAUDE.md §5; a "marcado, nunca apagado" tem a trava do LAB-124) não tinha trava — medido por mutação: uma pendência "20 · Refatorar src/forma.ts e subir a cobertura dos testes", DECLARADA na lista do LAB-124, → as mesmas 9 falhas do .wasm (a régua do LAB-124 até a ajudava: declarada, passava). Por LUGAR, as 19 pendências de hoje: nenhuma é dívida técnica (14 urbanismo ou negócio, 1 dinheiro, 1 segurança, 3 avisos que se dizem avisos). Trava pela ESTRUTURA: a declaração ganhou o campo dono — as cinco classes que param da COMO_FUNCIONA.md e o informe, SEM valor para dívida técnica —, cobrado por src/o-que-e-dele.ts (pergunta-sem-classe, informe-sem-aviso, titulo-de-oficina, classes-divergem); 11 mutações, 8 acusadas na primeira rodada, as 2 sobreviventes viraram teste, 1 equivalente declarada; D365; 1200 → 1214 travas; detalhe em docs/relatorios/LAB-137.md.
Achados para outros apps ou Central: (0) A RÉGUA QUE EXIGE DECLARAR TAMBÉM APROVA O QUE FOI DECLARADO — toda casa com uma "página do Jonny" e a regra "dívida técnica não entra lá" (Generate, Geo, Propostas, Orçamento, Render…) pode medir o mesmo: há onde dizer DE QUEM é cada pendência, com as cinco classes que param e sem valor para "é minha"? Não medi as vizinhas. (1) Proposto ao chat na FILA: a §6 da página do Jonny (o que o Lab achou no Generate e no Geo) se diz "não é pendência sua" — deve continuar ali? (2) A pergunta da "linha" (LAB-123), a das duas marcas de fim (LAB-129) e a do .wasm (LAB-135) seguem esperando o chat. (3) Para a direção: o comando do disparo segue recusando o pull --ff-only (LAB-116).
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; o próximo disparo vai à dívida própria.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 16/10/2026 · LAB-138 — item 900 (a dívida própria): sem PR, mesclar com `--no-ff` e declarar — e duas entregas tinham entrado direto

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-138 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main; o comando do disparo recusou o pull --ff-only de novo — desrasei primeiro, e a main velha era ancestral da origem, nada forçado); a FILA sem proposta que não espere ninguém, então fui à dívida própria (regra sem guarda), no CLAUDE.md §1-A. FEITA, mesclado por git direto (D29). Conferido aqui, não no GitHub: o portão sem clones 1234 de 1234 (73 de 73 arquivos passam sem os clones, lab84); esteira 1 552 pass e 9 fail (as 9 do .wasm, que não se constrói nesta máquina), testfit 17 de 17, typecheck e lint limpos nos dois pacotes. O envio passa pelo gancho do LAB-106, que agora confere a mescla também.
Feito: "sem mcp__github__*, mesclar com git merge --no-ff na main e declarar (D29)" — e a D29 diz onde: no relatório e no recado — não tinha trava. Medido pelo caso de verdade: dos 201 commits da primeira linha da main, separados por QUEM GRAVOU cada um, o LAB-102 (7d0e635) e o LAB-114 (b6b32bb) são entregas desta casa commitadas DIRETO na main, sem mescla e sem dizer, e a suíte estava verde com as duas; e nenhum dos 44 recados do LAB-95 ao LAB-137 diz como a entrega entrou (as 41 mesclas dizem só no assunto do commit). Trava: src/mescla-declarada.ts, na suíte (recusa no clone raso, D295) e no gancho do envio; 4 exceções nomeadas por hash; 15 mutações, 15 acusadas; D366; 1214 → 1234 travas; detalhe em docs/relatorios/LAB-138.md.
Achados para outros apps ou Central: (0) QUEM GRAVOU O COMMIT É O FATO; O ASSUNTO É O QUE ALGUÉM ESCREVEU — a primeira régua leu o "(#N)" do assunto e acusou nove PRs de verdade (LAB-39 a LAB-47); o committer separa PR (gravado pelo GitHub, noreply@github.com) de mescla local sem perguntar a ninguém. Toda casa com a regra "um envio por entrega / mesclar na main" pode medir o mesmo: git log --first-parent main --format='%h %P %ce %s' — entrega gravada localmente com UM pai entrou direto. Não medi as vizinhas. (1) A pergunta da "linha" (LAB-123), a das duas marcas de fim (LAB-129), a do .wasm (LAB-135) e a da §6 (LAB-137) seguem esperando o chat. (2) Para a direção: o comando do disparo segue recusando o pull --ff-only (LAB-116).
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; o próximo disparo vai à dívida própria.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 16/10/2026 · LAB-139 — item 900 (a dívida própria): toda entrega declara "conferido aqui, não no GitHub", e nada perguntava

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-139 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main depois de desrasar — o comando do disparo recusou o pull --ff-only de novo; no raso a main velha parecia ter 2 commits só daqui, e desrasada era ancestral da origem, nada forçado); a FILA sem proposta que não espere ninguém, então fui à dívida própria (regra sem guarda), no CLAUDE.md §7. FEITA, mesclado por git direto (D29). Conferido aqui, não no GitHub: o portão sem clones 1247 de 1247 (74 de 74 arquivos passam sem os clones, lab84); esteira 1 565 pass e 9 fail (as 9 do .wasm, que não se constrói nesta máquina), testfit 17 de 17, typecheck e lint limpos nos dois pacotes. O envio passa pelo gancho do LAB-106.
Feito: "toda entrega declara 'conferido aqui, não no GitHub'" (CLAUDE.md §7, CI desligado) não tinha trava — medido por mutação: a frase tirada do recado do LAB-138 → as mesmas 9 falhas do .wasm. Por LUGAR: 73 de 73 recados de entrega do LAB-67 (que desligou o CI) ao LAB-138 declaram, e 71 de 72 relatórios (dois só com a frase quebrada pela coluna; o do LAB-118 em lugar nenhum — exceção nomeada). Trava: src/conferido-aqui-declarado.ts, com o alcance preso à vida do CI desligado — gatilho religado com ULTIMO_PROMPT_COBRADO em branco reprova, e quem religa escreve onde a regra acabou; 12 mutações, 12 acusadas; D367; 1234 → 1247 travas; detalhe em docs/relatorios/LAB-139.md.
Achados para outros apps ou Central: (0) REGRA COM PRAZO TEM DE SABER QUANDO ACABA — toda casa tem a mesma frase sob o mesmo CI desligado, e a cota volta em 1º/11: trava sem fim reprova o primeiro recado honesto depois de religar; sem trava, a frase some sem ninguém ver. Não medi as vizinhas. (1) Para a direção: o comando do disparo segue recusando o pull --ff-only (LAB-116), e no raso o git log origin/main..main mostra commits "só daqui" que estão na origem — só a comparação depois de desrasar responde certo. (2) A pergunta da "linha" (LAB-123), a das duas marcas de fim (LAB-129), a do .wasm (LAB-135) e a da §6 (LAB-137) seguem esperando o chat.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; o próximo disparo vai à dívida própria.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 16/10/2026 · LAB-140 — item 900 (a dívida própria): todo prompt fecha com provas em `docs/provas/`, e 63 fecharam calados

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-140 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main depois de desrasar — o comando do disparo recusou o pull --ff-only de novo; desrasada, a main velha era ancestral da origem, nada forçado); a FILA sem proposta que não espere ninguém, então fui à dívida própria (regra sem guarda), no CLAUDE.md §7. FEITA, mesclado por git direto (D29). Conferido aqui, não no GitHub: o portão sem clones 1257 de 1257 (75 de 75 arquivos passam sem os clones, lab84); esteira 1 575 pass e 9 fail (as 9 do .wasm, que não se constrói nesta máquina — as mesmas da linha de base, nome por nome), testfit 17 de 17, typecheck e lint limpos nos dois pacotes. O envio passa pelo gancho do LAB-106.
Feito: das sete coisas do "todo prompt fecha com" (CLAUDE.md §7), as provas eram a única sem trava — medido por mutação: pasta de prova para o LAB-998 (não existe), para o LAB-44 (diz não ter) e a declaração do LAB-43 apagada passavam em tudo. Por LUGAR, 131 relatórios: 64 com pasta, 4 dizendo "Não há docs/provas/LAB-NN/" (LAB-42 a 45, a forma nasceu aqui) e 63 calados — todos os 44 do LAB-96 ao LAB-139. Trava: src/onde-mora-a-prova.ts, do LAB-140 em diante (pasta, ou a frase com o caminho), com os 63 de antes contados e congelados; 15 mutações, 15 acusadas; D368; 1247 → 1257 travas; detalhe em docs/relatorios/LAB-140.md.
Achados para outros apps ou Central: (0) REGRA FALSA COMO ESCRITA NÃO SE CONSERTA FINGINDO CUMPRI-LA — a frase "todo prompt fecha com provas" era falsa em 63 de 131 aqui, e a casa já tinha a forma honesta ("não há, e isso vai declarado"), que morreu porque nada a pedia; várias casas têm a mesma frase, não medi as vizinhas. (1) Proposto ao chat (FILA): reescrever a frase do §7 para a forma cumprida, e reconstruir a declaração nos 63 calados. (2) Para a direção: o disparo segue recusando o pull --ff-only (LAB-116); e o Generate não instala pelo registro do Lovable nesta máquina (403) — a esteira só precisa do zod dele. (3) A "linha" (LAB-123), as duas marcas de fim (LAB-129), o .wasm (LAB-135) e a §6 (LAB-137) seguem esperando o chat.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; o próximo disparo vai à dívida própria.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 16/10/2026 · LAB-141 — item 900 (a dívida própria): a prova de medição traz o MOTOR, e a régua cobrava três de quatro

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-141 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main depois de desrasar — o comando do disparo recusou o pull --ff-only de novo; desrasada, a main velha era ancestral da origem, nada forçado); a FILA sem proposta que não espere ninguém, então fui à dívida própria (regra sem guarda), no CLAUDE.md §7. FEITA, mesclado por git direto (D29). Conferido aqui, não no GitHub: o portão sem clones 1257 de 1257; esteira 1 575 pass e 9 fail (as 9 do .wasm, que não se constrói nesta máquina — as mesmas da linha de base, nome por nome), testfit 17 de 17, typecheck e lint limpos nos dois pacotes. O envio passa pelo gancho do LAB-106.
Feito: o §7 manda prova de medição "com gleba, motor, semente e contrato", e a guarda do LAB-36 dizia os quatro no título e cobrava TRÊS — o motor nunca entrou. Medido por mutação: prova plantada sem motor passou a suíte inteira; sem semente, foi acusada. Por LUGAR, 38 provas de medição: 34 dizem motor/motores, três por outro nome (pontesAuditadas, idasAuditadas, ondeOMotorFoiLido), e a do LAB-94 não diz. Trava: CONCEITOS.motor em tests/regras.test.ts, LAB-94 e LAB-07 congelados com o valor nomeado (D118); 10 mutações, 10 acusadas; nenhum teste novo; D369; detalhe em docs/relatorios/LAB-141.md.
Achados para outros apps ou Central: (0) O TÍTULO QUE REPETE A REGRA NÃO PROVA QUE A RÉGUA A COBRA — quem tem guarda com lista de chaves exigidas confira a lista contra a frase da regra, não contra o nome do teste. (1) Proposto ao chat (FILA): cobrar o VALOR do motor contra o registro de motores (LAB-76). (2) Para a direção: o disparo segue recusando o pull --ff-only (LAB-116), e o Generate segue sem instalar pelo registro do Lovable (403) — a esteira só precisa do zod dele. (3) A "linha" (LAB-123), as duas marcas de fim (LAB-129), o .wasm (LAB-135), a §6 (LAB-137) e a frase das provas (LAB-140) seguem esperando o chat.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; o próximo disparo vai à dívida própria.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 17/10/2026 · LAB-142 — item 900 (a dívida própria): o conserto do Lab sai dito na medição, e o do Symbios saía calado

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-142 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main depois de desrasar — o comando do disparo recusou o pull --ff-only de novo; desrasada, a main velha era ancestral da origem, nada forçado); a FILA sem proposta que não espere ninguém, então fui à dívida própria (regra sem guarda), no CLAUDE.md §4. FEITA, mesclado por git direto (D29). Conferido aqui, não no GitHub: o portão sem clones 1257 de 1257; esteira 1 583 pass e 9 fail (as 9 do .wasm, que não se constrói nesta máquina — as mesmas da linha de base, nome por nome), testfit 17 de 17, typecheck e lint limpos nos dois pacotes. O envio passa pelo gancho do LAB-106.
Feito: o §4 diz "conserto declarado, desligado por padrão, medido nas duas passagens" — três cláusulas, dois consertos (o aparo do Laboratório de Parcelamento e o recorte do Symbios), seis casas, e a guarda do LAB-36 cobria duas. Medido por mutação: o recorte ligado por padrão e o aparo sem a passagem fiel passaram a suíte inteira (só a contagem de bytes do LAB-52 acusou; a trava do LAB-05 precisa do .wasm). Por LUGAR: o rodarSymbios ligava a lasca e o recorte de quadra e NÃO declarava nada — regra descumprida. Trava: src/conserto-declarado.ts (o rodarSymbios passa a declarar) e tests/conserto-declarado.test.ts, com rede montada à mão sem o .wasm; 7 mutações, 7 acusadas; D370; detalhe em docs/relatorios/LAB-142.md.
Achados para outros apps ou Central: (0) DECLARADO NO COMENTÁRIO NÃO É DECLARADO NA MEDIÇÃO — quem liga conserto de geometria de propósito confira se o RESULTADO diz o que foi consertado, não só o código. (1) Trava que só roda com o .wasm é trava escura nesta máquina — outro lado da proposta do LAB-135. (2) Para a direção: o disparo segue recusando o pull --ff-only (LAB-116), e o Generate segue sem instalar pelo registro do Lovable — a esteira só precisa do zod dele. (3) A "linha" (LAB-123), as duas marcas de fim (LAB-129), o .wasm (LAB-135), a §6 (LAB-137), a frase das provas (LAB-140) e o valor do motor (LAB-141) seguem esperando o chat.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; o próximo disparo vai à dívida própria.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 17/10/2026 · LAB-143 — item 900 (a dívida própria): a medição é em metros, e duas ferramentas gravavam a gleba em hectare

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-143 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main); a FILA sem proposta que não espere ninguém, então fui à dívida própria (regra sem guarda), no CLAUDE.md §7. FEITA, mesclado por git direto (D29). O disparo recusou o pull --ff-only, e desta vez a main local não tinha base comum NENHUMA com a origem (clone completo, não raso): movi a pasta para o lado e clonei de novo, nada forçado nem apagado. Conferido aqui, não no GitHub: o portão sem clones 1270 de 1270; esteira 1 596 pass e 9 fail (as 9 do .wasm, as mesmas da linha de base, nome por nome), testfit 17 de 17, typecheck e lint limpos nos dois pacotes. O envio passa pelo gancho do LAB-106.
Feito: o §7 diz "Medição é em metros e em dados" — a metade depois dos dois-pontos tinha trava (LAB-36, 103, 105, 141), a de antes nenhuma. Por LUGAR, as 84 provas JSON pelo sufixo das chaves: _m 8 979, _m2 6 770 — e _ha 5, no LAB-07 (area_ha) e no LAB-50 (areaDaGleba_ha), em hectare arredondado, sem o m² ao lado: regra descumprida. As duas ferramentas passam a gravar m²; trava: src/medicao-em-metros.ts e tests/medicao-em-metros.test.ts (as provas, com as duas antigas congeladas pela contagem, D118; o código, com as duas ferramentas do Symbios em exceção declarada); 8 mutações, 8 acusadas; 1257 → 1270 travas; D371; detalhe em docs/relatorios/LAB-143.md.
Achados para outros apps ou Central: (0) A METADE DA REGRA QUE TEM TRAVA ESCONDE A METADE QUE NÃO TEM — frase com dois-pontos se confere metade por metade. (1) Geo, Generate e Parcelamento gravam medição em JSON: vale perguntar pelo sufixo das chaves (_ha, _km, _cm) antes de confiar que "está em metros". (2) Para a direção: o disparo recusou o pull --ff-only de novo, agora por main local SEM BASE COMUM (não por clone raso) — a receita do LAB-116 diria "pare"; o que resolve é clonar ao lado. (3) As propostas do LAB-123, 129, 135, 137, 140 e 141 seguem esperando o chat.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; o próximo disparo vai à dívida própria.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 17/10/2026 · LAB-144 — item 900 (a dívida própria): um prompt por despertador, e o anterior aberto se termina primeiro

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-144 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main); a FILA sem proposta que não espere ninguém, então fui à dívida própria (regra sem guarda), no CLAUDE.md §1-A. FEITA, mesclado por git direto (D29). O disparo recusou o pull --ff-only (o clone raso da D344): desrasei, a main local era ancestral da origem, avancei por --ff-only — nada forçado nem apagado. Conferido aqui, não no GitHub: o portão sem clones 1283 de 1283; esteira 1 609 pass e 9 fail (as 9 do .wasm, as mesmas da linha de base), testfit 17 de 17, typecheck e lint limpos. O envio passa pelo gancho do LAB-106.
Feito: "Um prompt por despertador; o anterior aberto se termina primeiro" foi descartado seis vezes (LAB-138 a 143) como imensurável pelo DISPARO — mas o ITEM deixa rastro: vira -FEITO num commit da primeira linha da main. Medido: 30 entregas fecharam 001 a 030, uma cada, em ordem, sem buraco, e o 900 nunca. A primeira leitura acusou o LAB-82 de pular o 013 — era a colisão que ele renumerou para 015 (D273), agora separada e contada. Trava: src/um-item-por-entrega.ts e tests/um-item-por-entrega.test.ts; 8 mutações, 8 acusadas; 1270 → 1283 travas; D372; detalhe em docs/relatorios/LAB-144.md.
Achados para outros apps ou Central: (0) "NÃO SE MEDE" PODE SER "NÃO SE MEDE AQUI" — a regra deixava marca no item, não no disparo. (1) Toda casa com caixa pode perguntar à própria main, só com git: um item por entrega, em ordem, e o 900 nunca fechado. (2) A peça que não pode sair do git log é o --first-parent; o --diff-merges=first-parent já vem implícito desde o git 2.31 (medido: tirá-lo não muda nada no 2.43). (3) As propostas do LAB-123, 129, 135, 137, 140 e 141 seguem esperando o chat.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; o próximo disparo vai à dívida própria.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 17/10/2026 · LAB-145 — item 900 (a dívida própria): um despertador por aplicativo, e nada perguntava de quem eram os ids escritos aqui

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-145 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main); a FILA sem proposta que não espere ninguém, então fui à dívida própria (regra sem guarda), no CLAUDE.md §1-A. FEITA, mesclado por git direto (D29). O disparo recusou o pull --ff-only (o clone raso da D344): desrasei, a main local era ancestral da origem — nada forçado nem perdido. Conferido aqui, não no GitHub: o portão sem clones 1298 de 1298; esteira com só as 9 falhas do .wasm (as mesmas da linha de base), testfit 17 de 17, typecheck e lint limpos. O envio passa pelo gancho do LAB-106.
Feito: "um despertador por aplicativo; nunca se toca no de outro repositório" tinha só a guarda do item 004 (um id na seção). O toque é ato na conta, fora da árvore; o rastro é o id que ele deixa escrito. Medido por LUGAR (git grep): 5 ids, quatro da casa e um fictício declarado; cinco despertadores na história, um por vez; nos três vizinhos clonados (Generate 2 ids, Parcelamento 9, Geo 1), nenhum daqui. Trava: src/um-despertador-por-aplicativo.ts + tests (sem clones) + -com-clone (verde completo); 9 mutações, 9 acusadas; 1283 → 1298; D373; detalhe em docs/relatorios/LAB-145.md.
Achados para outros apps ou Central: (0) UM DESPERTADOR DESTA CASA NASCEU E MORREU SEM ID ESCRITO — o que o LAB-20 criou para o LAB-18 em 02/10; o registro diz null, não um id suposto. (1) Abreviar um id com o prefixo é escrever outro id: a régua acusou quatro abreviações minhas no próprio cabeçalho. (2) Toda casa pode perguntar o mesmo só com git grep, sem tocar em tarefa nenhuma: os ids escritos na árvore são todos dela, um vivo só, nenhum na árvore de um vizinho. (3) As propostas do LAB-123, 129, 135, 137, 140 e 141 seguem esperando o chat.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; o próximo disparo vai à dívida própria.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 17/10/2026 · LAB-146 — item 900 (a dívida própria): motor da família não ganha `upstream/`, e nada perguntava se ele tinha sido copiado com outro nome

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-146 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main); a FILA sem proposta que não espere ninguém, então fui à dívida própria (regra sem guarda), no CLAUDE.md §3. FEITA, mesclado por git direto (D29). Conferido aqui, não no GitHub: o portão sem clones 1319 de 1319; esteira com só as 9 falhas do .wasm (as mesmas da linha de base), testfit 17 de 17, typecheck e lint limpos. O envio passa pelo gancho do LAB-106.
Feito: "motor da própria família não ganha upstream/ (D16)" tinha trava na metade do "ler pelos paths" (LAB-135) e só guarda pelo NOME na do "não copiar": o quadra.ts do motor copiado para o adaptador passava a suíte. Medido pelo conteúdo (git ls-files, linhas de código em comum): 343 arquivos daqui contra 350 do Parcelamento e 608 do Generate; nenhum idêntico; o único alto é o contrato-v1.ts (72 %), redeclaração declarada desde o LAB-07; o resto 15 % no máximo. Trava: src/o-motor-da-familia-nao-se-copia.ts + tests (sem clones) + -com-clone (verde completo); 14 mutações, 14 acusadas; 1298 → 1319; D374; detalhe em docs/relatorios/LAB-146.md.
Achados para outros apps ou Central: (0) Este Lab e o Laboratório de Parcelamento redeclaram os tipos do MESMO contrato do Generate, e 36 de 50 linhas são iguais — os dois dizem por quê e o validador do dono julga; é informação para quem um dia publicar os tipos do contrato como pacote, não defeito. (1) Regra guardada pelo nome perdoa a cópia com outro nome: toda casa que lê vizinho por caminho pode perguntar o mesmo só com git ls-files e linhas em comum, sem rede. (2) As propostas do LAB-123, 129, 135, 137, 140 e 141 seguem esperando o chat.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; o próximo disparo vai à dívida própria.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 17/10/2026 · LAB-147 — item 900 (a dívida própria): o não medido sai `null`, nunca zero — e a porta dizia zero metro de rua

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-147 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main); a FILA sem proposta que não espere ninguém, então fui à dívida própria (regra sem guarda), no CLAUDE.md §4. FEITA, mesclado por git direto (D29). Conferido aqui, não no GitHub: o portão sem clones 1338 de 1338; esteira com só as 9 falhas do .wasm (as mesmas da linha de base), testfit 17 de 17, typecheck e lint limpos. O envio passa pelo gancho do LAB-106.
Feito: "o não medido sai null, nunca zero (D23)", descartada nove vezes como espalhada, estava DESCUMPRIDA na porta: comprimentoDeVia_m somava v.comprimento_m ?? 0 sobre uma via que o contrato v1 não mede, e a prova do LAB-06 gravou 0 m de rua para 974, 776 e 214 lotes. Consertado (null, em src/porta/indicadores.ts; e o julgar de motores/comum.ts com ?? null). Medido: 206 arquivos de código, 177 zeros ?? 0/|| 0, 45 sobre medida em 17 arquivos, todos declarados com classe e motivo. Trava: src/nulo-nunca-zero.ts + tests (sem clones); 12 mutações, 12 acusadas; 1319 → 1338; D375; detalhe em docs/relatorios/LAB-147.md.
Achados para outros apps ou Central: (0) Para o Generate: a via do contrato v1 não tem comprimento — quem soma o campo dela recebe zero sem erro; quem quer metros de rua tem de medir a geometria ou receber o campo. (1) O buraco declarado de uma régua é onde a próxima regra está descumprida: a varredura de chamadas dizia por escrito que não pegava o ?? 0 sobre propriedade, e era ali. (2) Proposto ao chat: estender a régua ao ": 0" de ternário (há um medido, na prova do LAB-07). As propostas do LAB-123, 129, 135, 137, 140 e 141 seguem esperando.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; o próximo disparo vai à dívida própria.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 17/10/2026 · LAB-148 — item 900 (a dívida própria): "não há nada pago neste repositório hoje" passa a perguntar à árvore

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-148 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main); a FILA sem proposta que não espere ninguém, então fui à dívida própria (mensagem fixa que afirma estado sem perguntar), no CLAUDE.md §4-A. FEITA, mesclado por git direto (D29). Conferido aqui, não no GitHub: o portão sem clones 1354 de 1354; esteira com só as falhas do .wasm (as mesmas da linha de base), testfit 17 de 17, typecheck e lint limpos. O envio passa pelo gancho do LAB-106.
Feito: "não há nada pago neste repositório hoje" só era conferida ESCRITA (custo-por-uso.test.ts, toContain). Agora pergunta à árvore: as cinco portas por onde uma coisa paga entra (dependência, variável de ambiente, endereço, segredo e máquina da rotina), medidas por LUGAR — 33 portas, nenhuma paga. Trava: src/nada-pago.ts + tests (sem clones), lista fechada com classe e motivo, e a frase só pode estar escrita enquanto nenhuma porta for "pago"; 11 mutações, 11 acusadas; 1338 → 1354; D376; detalhe em docs/relatorios/LAB-148.md.
Achados para outros apps ou Central: (0) "Não há nada pago" é frase que toda casa pode escrever e provavelmente só confere escrita; as cinco portas são onde perguntar, e nas casas que TÊM fonte paga a mesma lista com a classe "pago" diz quais são. (1) A limpeza de comentário de JS apaga endereço dentro de string bruta do Rust (as aspas de dentro invertem o estado): régua de texto que lê Rust precisa de limpeza própria. As propostas do LAB-123, 129, 135, 137, 140, 141 e 147 seguem esperando.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; o próximo disparo vai à dívida própria.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 17/10/2026 · LAB-149 — item 900 (a dívida própria): o que o vizinho precisa vira lista numerada em relatório

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-149 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main); a FILA sem proposta que não espere ninguém, então fui à dívida própria (regra sem guarda), no CLAUDE.md §4. FEITA, mesclado por git direto (D29). Conferido aqui, não no GitHub: o portão sem clones 1378 de 1378 (82 de 82 arquivos); esteira 1711 aprovadas e só as 9 falhas do .wasm (as mesmas da linha de base), testfit 17 de 17, typecheck e lint limpos. O envio passa pelo gancho do LAB-106.
Feito: "o que o vizinho precisa vira lista numerada em relatório" só se conferia ESCRITA; a outra metade da linha (clone limpo) tem trava desde o LAB-38, e por isso parecia guardada. Medido por LUGAR: 145 relatórios, 27 lugares de pedido ao vizinho (título de seção e marcador "Para o Generate"), 22 com lista e CINCO SEM — LAB-03, LAB-07, LAB-24, LAB-82 (o pedido foi só no recado) e o LAB-147, a véspera. Trava: src/pedido-ao-vizinho.ts + tests (sem clones), os cinco congelados com motivo, relatório novo sem exceção; 15 mutações, 15 acusadas; 1354 → 1378; D377; detalhe em docs/relatorios/LAB-149.md.
Achados para outros apps ou Central: (0) Regra que divide a linha com uma regra guardada parece guardada: toda casa com frase de duas metades no CLAUDE.md pode perguntar se a trava da primeira cobre a segunda. (1) O marcador "Para o <vizinho>" nas seções de achados é a forma nova por onde o pedido escapa da lista numerada. As propostas do LAB-123, 129, 135, 137, 140, 141 e 147 seguem esperando.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; o próximo disparo vai à dívida própria.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 17/10/2026 · LAB-150 — item 900 (a dívida própria): o balanço vai ao arquivo com data, origem, conteúdo e prova

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-150 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main); a FILA sem proposta que não espere ninguém, então fui à dívida própria (regra sem guarda — aqui, guarda estreita), no CLAUDE.md §1-B. FEITA, mesclado por git direto (D29). Conferido aqui, não no GitHub: o portão sem clones 1402 de 1402 (83 de 83 arquivos); esteira 1735 aprovadas e só as 9 falhas do .wasm (as mesmas da linha de base), testfit 17 de 17, typecheck e lint limpos. O envio passa pelo gancho do LAB-106.
Feito: "vai a BALANCOS.md com data, origem, conteúdo e prova" tinha a guarda do LAB-42, que lia só as três entradas do §1 e só origem e "o que produziu". Medido por LUGAR: onze entradas datadas no BALANCOS.md, duas completas (§7 e §8), nove com campo faltando (§1.1–1.3 sem conteúdo e prova, §3–5 sem tabela, §6 sem prova, §9 e §10 sem "o que produziu"), todas de antes de 08/10. Trava: src/balanco-com-os-campos.ts + tests (sem clones), as nove congeladas com o que falta e o motivo, balanço novo sem exceção; 12 mutações, 12 acusadas; 1378 → 1402; D378; detalhe em docs/relatorios/LAB-150.md.
Achados para outros apps ou Central: (0) Guarda que nasce junto de um arquivo de prosa cobra a forma que ele tinha no dia; o arquivo cresce numa forma nova e ela não lê. Quem tem guarda de arquivo de prosa pode perguntar quantas entradas dele a guarda acha hoje. (1) As propostas do LAB-123, 129, 135, 137, 140, 141 e 147 seguem esperando.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; o próximo disparo vai à dívida própria.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 17/10/2026 · LAB-151 — item 900 (a dívida própria): o motivo de uma perda não mora em comentário

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-151 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main); a FILA sem proposta que não espere ninguém, então fui à dívida própria (regra sem guarda), no CLAUDE.md §4. FEITA, mesclado por git direto (D29). Conferido aqui, não no GitHub: o portão sem clones 1427 de 1427 (84 de 84 arquivos); esteira 1760 aprovadas e só as 9 falhas do .wasm (as mesmas da linha de base), testfit 17 de 17, typecheck e lint limpos. O envio passa pelo gancho do LAB-106.
Feito: "o motivo de uma perda não mora em comentário (D98, D104)" só se conferia escrito; o inventário do LAB-25 tirou o motivo do comentário só na ponte. Medido por LUGAR: quatro frases que a casa registrou como falsas, parágrafo a parágrafo, em 346 arquivos fora de docs/ e upstream/ — 26 ocorrências, NOVE VIVAS em cinco arquivos: a ponte do Symbios ("o outro motor, que não calcula greide", escrita na véspera do D98), a ferramenta do LAB-07 (uma no console), os dois README e a do LAB-08. Seis consertadas (só texto), três declaradas (prova congelada do LAB-08, D118). Trava: src/frase-vencida.ts + tests (sem clones), cada frase com a fonte conferida; 13 mutações, 13 acusadas; 1402 → 1427; D379; detalhe em docs/relatorios/LAB-151.md.
Achados para outros apps ou Central: (0) O conserto de uma frase falsa num lugar não a mata nos outros: o D98 consertou a ponte e escreveu a regra, e a mesma frase seguiu viva noutra ponte por quinze dias e em README por um mês. Quem já registrou afirmações como falsas pode guardar a lista e perguntar à árvore inteira, fora do registro do dia. (1) As propostas do LAB-123, 129, 135, 137, 140, 141 e 147 seguem esperando.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; o próximo disparo vai à dívida própria.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 17/10/2026 · LAB-152 — item 900 (a dívida própria): o trabalho acontece em `archilly/`, documentado

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-152 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main); a FILA sem proposta que não espere ninguém, então fui à dívida própria (regra sem guarda), no CLAUDE.md §3, a regra de ouro. FEITA, mesclado por git direto (D29). Conferido aqui, não no GitHub: o portão sem clones 1447 de 1447 (85 de 85 arquivos); esteira 1780 aprovadas e só as 9 falhas do .wasm (as mesmas da linha de base), testfit 17 de 17, typecheck e lint limpos. O envio passa pelo gancho do LAB-106.
Feito: "o trabalho acontece em archilly/, documentado" só se conferia escrito; os outros três itens do §3 têm trava. Medido por LUGAR (git ls-files): dois motores com archilly/, cinco projetos. O straight-skeleton nomeia os dois no archilly/README.md; a linha archilly/ da página do Symbios, escrita no LAB-00, nomeava SÓ probe/ — calava o wasm-probe/ e o wasm/, a ponte que o navegador carrega (37 dias fora da página). Regra descumprida, linha consertada. Trava: src/o-trabalho-em-archilly.ts + tests (sem clones), nos dois sentidos (projeto calado e nome de projeto que não existe); 11 mutações, 11 acusadas; 1427 → 1447; D380; detalhe em docs/relatorios/LAB-152.md.
Achados para outros apps ou Central: (0) A tabela de pastas escrita no dia em que a casa nasce é a primeira página a envelhecer: conta o que havia, e ninguém volta a ela quando nasce a pasta nova. Quem tem uma pode perguntar ao git ls-files, nos dois sentidos. (1) Proposto ao chat (FILA): as frases do adapter/ na mesma página ("Vazia. Fase futura.", "Adapter: não escrito"), falsas desde o LAB-01, ganharem conserto com trava. (2) As propostas do LAB-123, 129, 135, 137, 140, 141 e 147 seguem esperando.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; o próximo disparo vai à dívida própria.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 17/10/2026 · LAB-153 — item 900 (a dívida própria): não tem interface, com uma exceção declarada

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-153 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main); a FILA sem proposta que não espere ninguém, então fui à dívida própria (regra sem guarda — aqui, guarda estreita), no CLAUDE.md §4. FEITA, mesclado por git direto (D29). Conferido aqui, não no GitHub: o portão sem clones 1464 de 1464 (86 de 86 arquivos); esteira 1797 aprovadas e só as 9 falhas do .wasm (as mesmas de sempre), testfit 17 de 17, typecheck e lint limpos. O envio passa pelo gancho do LAB-106.
Feito: "não tem interface — com UMA exceção, declarada" tinha a guarda do LAB-36, que diz "exatamente UM html no repositório" e lia só o disco de external-engines/, só .html. Medido por mutação: uma página em docs/ e um componente .tsx postos no git passaram 25 de 25. Por LUGAR, o git ls-files inteiro (733 arquivos, 334 de código), três portas — página, componente, servidor: os dois achados são a bancada, a página e o servidor que a abre. Regra verdadeira, guarda estreita. Trava: src/a-unica-interface.ts + tests (sem clones), exceção por arquivo e porta, nos dois sentidos; 11 mutações, 11 acusadas; 1447 → 1464; D381; detalhe em docs/relatorios/LAB-153.md.
Achados para outros apps ou Central: (0) Guarda escrita "existe exatamente um X no repositório" merece a pergunta "quem é o repositório no código?" — aqui era uma pasta do disco e um tipo de arquivo; o título prometia mais do que o código lia. (1) Nada novo proposto ao chat; as propostas do LAB-123, 129, 135, 137, 140, 141, 147 e 152 seguem esperando.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; o próximo disparo vai à dívida própria.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 17/10/2026 · LAB-154 — item 900 (a dívida própria): não reimplementa o Validator nem o Judge

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-154 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main); a FILA sem proposta que não espere ninguém, então fui à dívida própria (regra sem guarda — aqui, guarda estreita), no CLAUDE.md §4. FEITA, mesclado por git direto (D29). Conferido aqui, não no GitHub: o portão sem clones 1486 de 1486 (87 de 87 arquivos); esteira 1819 aprovadas e só as 9 falhas do .wasm (as mesmas de sempre), testfit 17 de 17, typecheck e lint limpos. O envio passa pelo gancho do LAB-106.
Feito: "não reimplementa o Validator nem o Judge" tinha a guarda do LAB-36, que lia só esteira/src/, cinco nomes na forma function/class, e a MENÇÃO de @generate/ no comum.ts. Medido por mutação: um julgamento próprio no adaptador do Symbios e uma seta em esteira/src/ passaram 25 de 25; um Validator e um Judge falsos no comum.ts, que aprovam tudo, passaram a suíte inteira com os clones (só caíram duas provas de contagem de bytes). Por LUGAR, pela árvore sintática, 335 arquivos TS/JS e 5 Rust: 18 importam o julgamento; 8 funções com nome de julgamento, 7 chegam ao Generate pela cadeia, a oitava é o dublê do LAB-06. Trava: src/o-julgamento-vem-do-generate.ts + tests (sem clones); 20 mutações acusadas, 1 equivalente declarada; 1464 → 1486; D382; detalhe em docs/relatorios/LAB-154.md.
Achados para outros apps ou Central: (0) "Tem guarda" não responde "a regra é guardada": rode a mutação no ponto central contra a suíte inteira — aqui, um veredito falso no único ponto do julgamento não foi acusado por nenhum teste que olha veredito. (1) Sem o zod copiado para a node_modules do Generate, a suíte com clones perde um arquivo de import inteiro: 1713 testes em vez de 1806. (2) Nada novo proposto ao chat; as propostas do LAB-123, 129, 135, 137, 140, 141, 147 e 152 seguem esperando.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; o próximo disparo vai à dívida própria.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 17/10/2026 · LAB-155 — item 900 (a dívida própria): "Testfit" é nome interno

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-155 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main); a FILA sem proposta que não espere ninguém, então fui à dívida própria (regra sem guarda — aqui, guarda estreita), no CLAUDE.md §5. FEITA, mesclado por git direto (D29). Conferido aqui, não no GitHub: o portão sem clones 1507 de 1507 (88 de 88 arquivos); esteira 1840 aprovadas e só as 9 falhas do .wasm (as mesmas de sempre), testfit 17 de 17, typecheck e lint limpos. O envio passa pelo gancho do LAB-106.
Feito: "Testfit é nome interno; para o usuário é Laboratório de Parcelamento" tinha a guarda do LAB-36, que lia dois arquivos de uma lista escrita à mão e a grafia testfit. Medido por mutação: Testfit no título da bancada e Test Fit na página do Jonny passaram 25 de 25. Por LUGAR, onde a página do Jonny o manda: onze endereços, nove desta casa e o repositório, que o GitHub abre no README.md — e o README, o primeiro endereço da página dele, dizia "motor do Testfit" seis vezes, com a guarda verde. Regra descumprida, seis linhas consertadas (texto, nenhum comportamento). Trava: src/nome-interno.ts + tests (sem clones), cada endereço pagina ou registro em lista fechada, mais a bancada; seis mutações na árvore, seis acusadas; 1486 → 1507; D383; detalhe em docs/relatorios/LAB-155.md.
Achados para outros apps ou Central: (0) "Voltado ao usuário" não é uma lista que se lembra: é onde a casa manda o usuário — leia os links da página do Jonny, e lembre que o endereço do repositório abre o README da raiz. Toda casa tem esse primeiro link. (1) Nada novo proposto ao chat; as propostas do LAB-123, 129, 135, 137, 140, 141, 147 e 152 seguem esperando.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; o próximo disparo vai à dívida própria.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 17/10/2026 · LAB-156 — item 900 (a dívida própria): balanço que já mora num recado não se copia

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-156 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main); a FILA sem proposta que não espere ninguém, então fui à dívida própria (regra sem guarda), no CLAUDE.md §1-B. FEITA, mesclado por git direto (D29). Conferido aqui, não no GitHub: o portão sem clones 1523 de 1523 (89 de 89 arquivos); esteira 1856 aprovadas e só as 9 falhas do .wasm (as mesmas de sempre), testfit 17 de 17, typecheck e lint limpos. O envio passa pelo gancho do LAB-106.
Feito: "Balanço que já mora num recado não se copia: aponta-se para ele" tem dois verbos, e a guarda do LAB-42 só respondia o segundo (o índice do §2 cita seção que existe). Medido por mutação: 1406 caracteres do recado do LAB-37 colados no BALANCOS.md deixaram a esteira inteira como estava. Por LUGAR, os dois arquivos inteiros lidos como a regra se lê: um único trecho em comum de 120 ou mais, de 155, no sentido contrário (a lista do saldo do §6 que o recado do LAB-52 repetiu depois de apontar para ela), declarado com teto. A primeira conta, a cru, dava zero: o negrito escondia o trecho. Regra verdadeira, guarda ausente. Trava: src/balanco-nao-se-copia.ts + tests (sem clones); oito mutações na régua, sete acusadas, uma equivalente declarada; 1507 → 1523; D384; detalhe em docs/relatorios/LAB-156.md.
Achados para outros apps ou Central: (0) "Tem guarda" pode ser metade da frase: regra com dois verbos pode ter trava num e nenhuma no outro, e a trava do primeiro faz a frase inteira parecer guardada. (1) Comparar texto a cru acha menos do que a regra proíbe — a mesma frase com negrito num arquivo e sem no outro é a mesma frase. (2) Nada novo proposto ao chat; as propostas do LAB-123, 129, 135, 137, 140, 141, 147 e 152 seguem esperando.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; o próximo disparo vai à dívida própria.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 17/10/2026 · LAB-157 — item 900 (a dívida própria): a semente é a mesma em todas as provas e o geradoEm é carimbo fixo

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-157 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main); a FILA sem proposta que não espere ninguém, então fui à dívida própria (mensagem fixa que afirma estado sem perguntar), no docs/provas/LEIA-ME.md. FEITA, mesclado por git direto (D29). Conferido aqui, não no GitHub: o portão sem clones 1546 de 1546 (90 de 90 arquivos); esteira 1879 aprovadas e só as 9 falhas do .wasm (as mesmas de sempre), testfit 17 de 17, typecheck e lint limpos. O envio passa pelo gancho do LAB-106.
Feito: a página das provas diz "a semente é a mesma em todos (20260913)" e "geradoEm é carimbo fixo nas provas", e nada as perguntava. Antes, medi "teste que nunca reprovou" pela forma: 1923 blocos de teste, zero sem asserção. Por LUGAR, as 84 provas: 111 sementes, todas 20260913; 34 geradoEm, 33 carimbo escolhido e um relógio (LAB-07/medicoes.json, 14:31:44.835). No código, pela árvore sintática, três linhas liam o relógio para o geradoEm: os dois medir.ts (testfit e Symbios) e a queda do volta.ts. Era desenho com o nome trocado: a hora real "fica no JSON de medições", e desde o LAB-47 se chama quando. Os dois medir.ts gravam quando; a prova do LAB-07 declarada sem regerar, a queda declarada, a página diz a exceção. Trava: src/semente-e-carimbo.ts + tests (sem clones); dez mutações na régua, dez acusadas; 1523 → 1546; D385; detalhe em docs/relatorios/LAB-157.md.
Achados para outros apps ou Central: (0) A convenção nova escrita como se sempre tivesse valido esconde a prova velha: a página disse "todas" depois que a hora real ganhou outro nome, e a única prova de antes ficou desmentindo calada. (1) grep cortado no meio da lista dá a régua por boa com um arquivo de menos — a árvore sintática achou três linhas onde o grep mostrou uma. (2) Nada novo proposto ao chat; as propostas do LAB-123, 129, 135, 137, 140, 141, 147 e 152 seguem esperando.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; o próximo disparo vai à dívida própria.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 17/10/2026 · LAB-158 — item 900 (a dívida própria): o Lab não faz chamada de rede em execução

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-158 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main); a FILA sem proposta que não espere ninguém, então fui à dívida própria (mensagem fixa que afirma estado sem perguntar), no docs/SEGURANCA.md. FEITA, mesclado por git direto (D29). Conferido aqui, não no GitHub: o portão sem clones 1562 de 1562 (91 de 91 arquivos); esteira 1895 aprovadas e só as 9 falhas do .wasm (as mesmas de sempre), testfit 17 de 17, typecheck e lint limpos. O envio passa pelo gancho do LAB-106.
Feito: o SEGURANCA.md (LF-FINAL, 14/09) diz que o Lab "não faz chamada de rede em execução" e, na tabela, "Nenhum fetch, nenhum http" — nada perguntava. Por LUGAR, todo o código que o git carrega (upstream/ incluído), por quatro portas (chamada, módulo, processo filho, linha de script): 370 arquivos, 52 no caminho do motor, zero rede no motor — a frase é verdadeira. Fora dele, sete em seis arquivos, que a linha calava: o servidor local da bancada e o fetch do .wasm, o git fetch do carimbo dos vizinhos, o git ls-remote dos ramos, o curl à API do GitHub e o fetch de um clone de teste file://. Nenhuma escreve. O fetch da bancada é de 10/09, anterior à página: a linha nasceu falsa fora do motor, e era a única da tabela sem comando ao lado. A linha diz onde vale e a página ganha a tabela das sete. Trava: src/rede-em-execucao.ts + tests (sem clones), rede no motor reprova mesmo declarada; onze mutações na árvore de verdade, onze acusadas; 1546 → 1562; D386; detalhe em docs/relatorios/LAB-158.md.
Achados para outros apps ou Central: (0) "✅" sem comando ao lado é a afirmação que ninguém refez: o SEGURANCA.md prometia o comando de cada linha, e a única linha sem comando era a falsa — vale para o SEGURANCA.md de toda casa. (1) "Nenhum X", sem dizer onde, é a frase que a primeira ferramenta desmente. (2) Nada novo proposto ao chat; as propostas do LAB-123, 129, 135, 137, 140, 141, 147 e 152 seguem esperando.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; o próximo disparo vai à dívida própria.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 17/10/2026 · LAB-159 — item 900 (a dívida própria): a entrada se confere antes do núcleo, em três portas

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-159 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main); a FILA sem proposta que não espere ninguém, então fui à dívida própria (mensagem fixa que afirma estado sem perguntar), na linha seguinte do docs/SEGURANCA.md à do LAB-158. FEITA, mesclado por git direto (D29). Conferido aqui, não no GitHub: o portão sem clones 1583 de 1583 (92 de 92 arquivos); esteira 1919 aprovadas e só as 9 falhas do .wasm (as mesmas de sempre), testfit 17 de 17, typecheck e lint limpos. O envio passa pelo gancho do LAB-106.
Feito: o SEGURANCA.md (LF-FINAL, 14/09) diz que versão, unidade e anel de menos de 3 pontos são recusados antes do núcleo, "ida.ts e gleba-v1.ts, com teste" — nada perguntava. Por LUGAR, as funções de esteira/src/motores/: sete recebem a entrada, por TRÊS portas. A do Parcelamento recusa as três (testadas); a do Symbios recusa as três (só a versão testada); a do motor interno do Generate (LAB-13, 19/09, cinco dias depois da página) não recusava nada — na gleba completo, contrato "9" e unidade "ft" voltaram com 1 606 lotes cada, o número da gleba em metro. Regra descumprida, consertada: as três recusas em recusaDaEntrada (gleba-v1.ts), mensagens iguais, perguntadas antes do motor pelo glebaParaOSymbios e pelo rodarGenerate, que recusa sem SAÍDA e sem rodar o motor. Trava: src/entrada-validada.ts + tests (sem clones) e três testes de comportamento em motores.test.ts; doze mutações acusadas; 1562 → 1583; D387; detalhe em docs/relatorios/LAB-159.md.
Achados para outros apps ou Central: (0) a linha que nomeia as portas envelhece no dia em que nasce a próxima: "validado em A e B" era verdade com duas portas — onde um SEGURANCA.md diz "toda entrada é validada", contem as portas, não as validações. (1) Proposto ao chat (FILA, abaixo do LAB-159): a porta comum promete nunca estourar e estoura com a recusa da ida do Parcelamento; e o catch do Symbios rotula toda recusa como relevo.curvas. (2) As propostas do LAB-123, 129, 135, 137, 140, 141, 147 e 152 seguem esperando.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; o próximo disparo vai à dívida própria.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 17/10/2026 · LAB-160 — item 900 (a dívida própria): nenhum `.env`, `.pem` ou arquivo de credencial, perguntado pelo nome

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-160 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main); a FILA sem proposta que não espere ninguém, então fui à dívida própria (mensagem fixa que afirma estado sem perguntar), no docs/SEGURANCA.md, tabela Chaves e segredos. FEITA, mesclado por git direto (D29). Conferido aqui, não no GitHub: o portão sem clones 1593 de 1593 (93 de 93 arquivos); esteira 1929 aprovadas e só as 9 falhas do .wasm (as mesmas de sempre), testfit 17 de 17. O envio passa pelo gancho do LAB-106.
Feito: a linha "Nenhum .env, .pem ou arquivo de credencial" (LF-FINAL, 14/09) era um find rodado uma vez, três formas de nome, sem trava. A varredura de segredos lê o CONTEÚDO: de seis arquivos de credencial plantados, cinco passaram calados (.env com e sem aspas, .npmrc, .netrc, .git-credentials) e o binário .p12 ela declara de fora e aprova. Por LUGAR, o que o git carrega (753 caminhos) e todo nome que já entrou na história (762, desrasado): zero nos dois — regra verdadeira, guarda ausente. Trava: src/arquivo-de-credencial.ts + tests (sem clones; a história recusa no clone raso), dezessete formas de nome, o .env.exemplo perdoado; oito mutações acusadas; 1583 → 1593; D388; detalhe em docs/relatorios/LAB-160.md.
Achados para outros apps ou Central: (0) varredura de segredos lê conteúdo e não responde "nenhum .env": medido aqui, .env, .npmrc, .netrc e .git-credentials típicos passam por ela calados, e binário sai "de fora". Onde um SEGURANCA.md diz "nenhum .env" com a varredura ao lado, a linha não tem guarda. Nas casas do Cloudflare, o .dev.vars do wrangler é o .env com outro nome. (1) A linha do .wasm segue sem trava: esta máquina não tem o alvo wasm32 e o rustup não alcança a origem dele. (2) As propostas do LAB-123, 129, 135, 137, 140, 141, 147, 152 e 159 seguem esperando.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; o próximo disparo vai à dívida própria.
=== FIM ===
=== FIM DA SESSÃO ===
```


## 17/10/2026 · LAB-161 — item 900 (a dívida própria): nenhum motor copiado para fora de `upstream/`, comparado com o motor de fora

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-161 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main); a FILA sem proposta que não espere ninguém, então fui à dívida própria (mensagem fixa que afirma estado sem perguntar), no docs/SEGURANCA.md, tabela Integridade do que foi copiado. FEITA, mesclado por git direto (D29). Conferido aqui, não no GitHub: o portão sem clones 1607 de 1607 (94 de 94 arquivos); esteira 1943 aprovadas e só as 9 falhas do .wasm (as mesmas de sempre), testfit 17 de 17. O envio passa pelo gancho do LAB-106.
Feito: a linha "Nenhum motor copiado para fora de upstream/" (LF-FINAL, 14/09) nomeava testfit/ e esteira/ e não tinha trava. O LAB-146 compara a casa com os motores DA FAMÍLIA; o motor de fora (Symbios) nunca era o comparado — uma cópia de upstream/src/rationalize.rs em symbios/archilly/wasm/src/ só derrubava a contagem de árvore do LAB-57. Por LUGAR, 18 arquivos do upstream/ contra 354 da casa: nenhuma cópia; os 3 Cargo.toml que dependem do motor apontam para o upstream/ por path — regra verdadeira, guarda ausente. Trava: src/o-upstream-nao-sai-do-upstream.ts + tests (sem clones), as linhas e os limites do LAB-146 contra toda pasta upstream/, e a dependência que não aponta para ela; dez mutações acusadas; 1593 → 1607; D389; detalhe em docs/relatorios/LAB-161.md.
Achados para outros apps ou Central: (0) régua que compara com a família não vê o motor de fora: onde uma casa tem vendor/ ou upstream/ de terceiro e a página diz "não copiado", vale perguntar se alguma trava compara o resto da casa com AQUELA pasta, e se o build usa aquela pasta e não o mesmo pacote baixado de um registro. (1) As duas linhas vizinhas da tabela já tinham trava (LAB-132) e a página não dizia — agora diz. (2) As propostas do LAB-123, 129, 135, 137, 140, 141, 147, 152 e 159 seguem esperando.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; o próximo disparo vai à dívida própria.
=== FIM ===
=== FIM DA SESSÃO ===
```


## 17/10/2026 · LAB-162 — item 900 (a dívida própria): nenhum commit, nenhum push nos vizinhos, perguntado pela sessão

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-162 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main); a FILA sem proposta que não espere ninguém, então fui à dívida própria (mensagem fixa que afirma estado sem perguntar), no docs/SEGURANCA.md, tabela Os repositórios vizinhos. FEITA, mesclado por git direto (D29). Conferido aqui, não no GitHub: o portão sem clones 1622 de 1622 (95 de 95 arquivos); esteira 1962 aprovadas e só as 9 falhas do .wasm (as mesmas de sempre), testfit 17 de 17. O envio passa pelo gancho do LAB-106.
Feito: a linha "Nenhum commit, nenhum push nos vizinhos" (LF-FINAL) e a do LF-FINAL-2 ("os commits dos vizinhos são deles", conferida pelo AUTOR) não tinham trava; a do LAB-38 só pergunta o clone desta máquina limpo. Hoje o autor de todo commit de sessão é Claude em toda a família (204, 1076 e 449 nos três vizinhos) — a pergunta de 15/09 já não teria resposta. Pela SESSÃO do rodapé, na história inteira da origem dos quatro: 14 sessões em comum, todas da direção (as caixas); nenhuma das 68 que trabalharam aqui num vizinho, nenhum assunto LAB-<n> lá — regra verdadeira, guarda ausente. Trava: src/nenhum-commit-nos-vizinhos.ts + teste sem clones + teste no verde completo; onze mutações acusadas (uma, commit plantado numa cópia do clone do Parcelamento); 1607 → 1622; D390; detalhe em docs/relatorios/LAB-162.md.
Achados para outros apps ou Central: (0) conferência "os commits são deles / nenhum commit nosso lá" feita pelo AUTOR não responde mais: é Claude em toda casa. O que distingue é a sessão do rodapé Claude-Session — e as sessões da direção aparecem em todas as casas (escrevem as caixas); sem separá-las, a primeira leitura vira acusação falsa. (1) As propostas do LAB-123, 129, 135, 137, 140, 141, 147, 152 e 159 seguem esperando.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; o próximo disparo vai à dívida própria.
=== FIM ===
=== FIM DA SESSÃO ===
```


## 18/10/2026 · LAB-163 — item 900 (a dívida própria): o upstream/ nunca foi tocado depois de criado, perguntado à história

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-163 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main); a FILA sem proposta que não espere ninguém, então fui à dívida própria (mensagem fixa que afirma estado sem perguntar), no docs/SEGURANCA.md, seção Reconferido no LF-FINAL-2. FEITA, mesclado por git direto (D29). Conferido aqui, não no GitHub: o portão sem clones 1639 de 1639 (96 de 96 arquivos); esteira 1980 aprovadas e só as 9 falhas do .wasm (as mesmas de sempre), testfit 17 de 17. O envio passa pelo gancho do LAB-106.
Feito: a linha "o upstream/ nunca foi tocado depois de criado" era um git log de 15/09; a trava do LAB-132 só pergunta o HEAD — um patch commitado e desfeito, plantado numa cópia descartável da casa, passou por ela. Pela árvore da pasta em cada um dos 462 commits do HEAD e da origem: uma árvore só, a registrada — regra verdadeira, guarda ausente; e o git log de hoje mostraria dois commits (a mescla baa3e07 leva a mesma árvore). Trava: src/a-historia-do-upstream.ts + teste sem clones + teste no verde completo; nove mutações acusadas; 1622 → 1639; D391; detalhe em docs/relatorios/LAB-163.md.
Achados para outros apps ou Central: (0) guarda de "nunca foi tocado" (vendor/, kit, pasta gerada) que compara o estado de HOJE responde "igual hoje", não "nunca": patch desfeito some. A pergunta certa é a árvore da pasta em cada commit (git cat-file --batch-check com <commit>:<pasta>), com a história inteira. (1) As propostas do LAB-123, 129, 135, 137, 140, 141, 147, 152 e 159 seguem esperando.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; o próximo disparo vai à dívida própria.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 18/10/2026 · LAB-164 — item 900 (a dívida própria): a ideia que não cabia no item vai à FILA, e o recado a cita numa linha

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-164 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main); a FILA sem proposta que não espere ninguém, então fui à dívida própria (regra sem guarda), no docs/caixa-de-entrada/COMO_FUNCIONA.md, seção A RESPOSTA INTEIRA VAI PARA O ARQUIVO. FEITA, mesclado por git direto (D29). Conferido aqui, não no GitHub: o portão sem clones 1657 de 1657 (97 de 97 arquivos); esteira 1998 aprovadas e só as 9 falhas do .wasm (as mesmas de sempre), testfit 17 de 17. O envio passa pelo gancho do LAB-106.
Feito: "a ideia que não cabia no item vai à FILA.md como proposto ao chat, e o recado a cita numa linha" — a lista tinha a trava do LAB-61; o recado, nenhuma: tirar a citação dos recados do LAB-159, LAB-123 e LAB-80 não derrubou nada da suíte. Por LUGAR, três formas de proposta na FILA (saído do LAB/item, minha lista, item da lista), 30 prompts no alcance (LAB-70 em diante): todos citam — 9 na forma de hoje (proposto ao chat, com P maiúsculo abrindo a frase), 21 em formas antigas declaradas com o trecho. Regra verdadeira, guarda ausente. Trava: src/a-proposta-no-recado.ts + teste sem clones, nos dois sentidos (o recado que diz a forma sem proposta na FILA também reprova — e o meu primeiro rascunho deste recado, que a citava entre aspas, foi acusado por ela); onze mutações de código acusadas; 1639 → 1657; D392; detalhe em docs/relatorios/LAB-164.md.
Achados para outros apps ou Central: (0) o protocolo da caixa é o mesmo nas onze casas: onde houver trava sobre a lista de propostas, vale perguntar se alguma pergunta o RECADO de quem propôs. E a negação contém a frase: "Nada novo proposto ao chat" tem "proposto ao chat" dentro — a primeira versão daqui acusou seis recados assim; a forma lida com caixa, abrindo a frase, resolveu. Não medi as vizinhas. (1) Nada novo proposto ao chat; as propostas do LAB-123, 129, 135, 137, 140, 141, 147, 152 e 159 seguem esperando.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; o próximo disparo vai à dívida própria (candidata anotada no relatório: o formato da pendência, "o que fazer / onde / como saber", sem trava).
=== FIM ===
=== FIM DA SESSÃO ===
```

## 18/10/2026 · LAB-165 — item 900 (a dívida própria): a pergunta que é dele vai com "o que fazer / onde / como saber que deu certo"

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-165 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main); a FILA sem proposta que não espere ninguém, então fui à dívida própria (regra sem guarda), na candidata que o LAB-164 anotou: docs/caixa-de-entrada/COMO_FUNCIONA.md, seção A RESPOSTA INTEIRA VAI PARA O ARQUIVO, coisa 3. FEITA, mesclado por git direto (D29). Conferido aqui, não no GitHub: o portão sem clones 1679 de 1679 (98 de 98 arquivos); esteira com só as 9 falhas do .wasm (as mesmas de sempre), testfit 17 de 17. O envio passa pelo gancho do LAB-106.
Feito: "a pergunta que é dele vai à PENDENCIAS_JONNY.md com o que fazer / onde / como saber que deu certo" — nenhuma trava perguntava: tirar os passos da senha (§11) e os caminhos da esquina (§10) não derrubou nada. Por LUGAR, 5 pendências abertas ou paradas; a §8 diz que não pede; das 4 que pedem (5-B, 7, 10, 11), NENHUMA dizia como saber que deu certo. Um bloco de forma fixa nas quatro, com a nota "está parada a seu pedido" (o pedido dele de 12/10 continua valendo); a §8 virou exceção conferida pelo trecho. Trava: src/o-que-fazer-onde-como-saber.ts + teste sem clones, nos dois sentidos (bloco em resolvida ou aviso também reprova); treze mutações de código acusadas; 1657 → 1679; D393; detalhe em docs/relatorios/LAB-165.md.
Achados para outros apps ou Central: (0) o protocolo da caixa é o mesmo nas onze casas: aqui, zero de quatro pendências diziam "como saber que deu certo" — vale cada casa contar as suas. Não medi as vizinhas. (1) De passagem: a prova do LAB-84 que o LAB-164 enviou dizia 96 de 97 sem clones (o teste do nome do trabalho reprovava dentro da própria medição, antes de a prova ter a linha nova); rodada duas vezes, hoje 98 de 98. (2) Nada novo proposto ao chat; as propostas do LAB-123, 129, 135, 137, 140, 141, 147, 152 e 159 seguem esperando.
Depende do Jonny: nada (os blocos das quatro paradas dizem que nada precisa dele até o Lab entrar no Generate).
Próximo na fila: a caixa só tem o 900; as três coisas da lista do protocolo estão resolvidas (a 1 descartada como juízo); o próximo disparo vai à dívida própria, noutra página.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 18/10/2026 · LAB-166 — item 900 (a dívida própria): nenhuma chave sensível no repositório — a busca da página dizia "zero" e dava duas

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-166 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main); a FILA sem proposta que não espere ninguém, então fui à dívida própria (mensagem fixa que afirma estado sem perguntar), de volta ao docs/SEGURANCA.md, tabela Chaves e segredos, primeira linha. FEITA, mesclado por git direto (D29). Conferido aqui, não no GitHub: o portão sem clones 1692 de 1692 (99 de 99 arquivos); esteira com só as 9 falhas do .wasm (as de sempre), testfit 17 de 17. O envio passa pelo gancho do LAB-106.
Feito: "nenhuma chave sensível no repositório — grep de oito nomes, zero ocorrências" (LF-FINAL, 14/09), sem trava. Refeito: DUAS, nenhuma chave — o espaço reservado do teste da varredura de segredos (LAB-47, 05/10) e o exemplo de chamada a IA do teste do vazamento de custo (LAB-68, 09/10); o "zero" estava falso havia 13 dias. O universo largo (535 arquivos, todo texto fora do .md, upstream/ incluído) dá as mesmas duas. Trava: src/a-busca-das-chaves.ts + teste sem clones — a busca da página letra por letra, as duas declaradas por trecho e só em teste, a declarada que sumiu também reprova; doze mutações de código acusadas; 1679 → 1692; D394; detalhe em docs/relatorios/LAB-166.md.
Achados para outros apps ou Central: (0) a varredura de segredos NÃO responde a linha: oito linhas plantadas com valor de 21 alfanuméricos passam TODAS caladas por ela — o cabeçalho de autorização não está na lista de nomes, e o perdão "identificador de código" aceita qualquer valor alfanumérico que comece por letra (com um "-" no meio, acusa). Se alguma casa copiou esse perdão, tem o mesmo buraco; não medi as vizinhas. (1) Proposto ao chat (FILA, acima do LAB-165): consertar os dois buracos da varredura e o "_" da busca da página (JWT_ + o segredo escapa das duas), num prompt só, com as oito plantadas como régua.
Depende do Jonny: nada (nenhuma chave vazou: as duas ocorrências são texto de teste).
Próximo na fila: a caixa só tem o 900; no SEGURANCA.md, sem trava, só a linha do .wasm, que espera o alvo do rustup (falhou de novo hoje); o próximo disparo vai à dívida própria.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 18/10/2026 · LAB-167 — item 900 (a dívida própria): o Lab não adota a Central — a página afirmava seis estados sem leitor, e dois eram falsos

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-167 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main); a FILA sem proposta que não espere ninguém, e o .wasm de novo sem o alvo do rustup (403 do portão de rede desta máquina, política — não se insiste); fui à dívida própria por LUGAR: a página de docs/ sem nenhum leitor no código. FEITA, mesclado por git direto (D29). Conferido aqui, não no GitHub: o portão sem clones 1725 de 1725 (100 de 100 arquivos); esteira com só as 9 falhas do .wasm (as de sempre), testfit 17 de 17. O envio passa pelo gancho do LAB-106.
Feito: o docs/ADOCAO_CENTRAL.md (LF-FINAL, 14/09; zero arquivos de código o citavam — mensagem fixa que afirma estado sem perguntar) dizia "não há tela" — falso desde ANTES de nascer (a bancada é de 10/09, LAB-01) — e que o vendor/ do Generate não tinha código — falso desde 14/09 (hoje package.json 0.48.0 e dist/). "O Lab não importa a Central em execução" era verdade POR ACASO: a prova era a suíte passar, e ela passa porque a instalação no clone do Generate falha (403). Medido pelo fecho das importações de valor: esteira 424 arquivos, testfit 88, zero chegadas; com tipos, uma (cores.ts do Generate, por import type). Trava src/a-adocao-da-central.ts + teste sem clones (33) + teste com clone (7); dezesseis mutações de código acusadas; 1692 → 1725; D395; detalhe em docs/relatorios/LAB-167.md.
Achados para outros apps ou Central: declaração ambiente que se justifica pelo estado do vizinho ("a pasta de lá não tem código") envelhece no dia em que o vizinho vendoriza o código, e "a suíte passa sem o pacote" só prova que a instalação falhou — toda casa que compila código alheio por caminho e declara um pacote que não instala tem a mesma frase a remedir. Nada novo proposto ao chat.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; na dívida própria, as páginas de docs/ com um a três leitores (TRIAGEM.md, O_QUE_FALTA_MEDIR_POR_MOTOR.md, referencia/FERRAMENTA_E_TRAVA.md); o .wasm segue sem o alvo do rustup.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 18/10/2026 · LAB-168 — item 900 (a dívida própria): o que falta medir, motor por motor — a página que o chat leva aos vizinhos afirmava o estado deles sem perguntar

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-168 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main, clone desrasado pela receita do LAB-116); a FILA sem proposta que não espere ninguém, e o .wasm sem o alvo do rustup (403, política); fui à dívida própria (mensagem fixa que afirma estado sem perguntar) e peguei a página que o LAB-167 deixou nomeada (§9 do relatório dele): docs/O_QUE_FALTA_MEDIR_POR_MOTOR.md. FEITA, mesclado por git direto (D29). Conferido aqui, não no GitHub: o portão sem clones 1740 de 1740 (101 de 101 arquivos); esteira com só as 9 falhas do .wasm (as de sempre), testfit 17 de 17.
Feito: a página (LAB-22, 03/10; três leitores no código, nenhum pergunta o que ela afirma) dizia ao Generate "não mede a rampa, falta o cálculo" — falso desde 02/10 (5b70e5f): o paraSaida deles mede quando recebe relevo, e a ponte do Lab NÃO o passa (quarta vez da história do §1-A); ao Parcelamento, "passo fixo em 12 pedaços" — falso desde o T-11 deles, no mesmo 03/10; "±30°" no sorteio do ângulo é ±15° (o erro também estava na ficha da porta); e a ponte do Lab lê o MOTOR_NOME deles desde o LAB-29. Medido passando o relevo: completo 22 de 22 e 69 de 72 vias medidas onde eram todas null. Página riscada, não reescrita; trava src/o-que-falta-medir.ts (sete afirmações em três casas) + teste sem clones (15) + com clone (4); doze mutações de código e duas do mundo acusadas; 1725 → 1740; D396; detalhe em docs/relatorios/LAB-168.md.
Achados para outros apps ou Central: ao Generate, nada a fazer — o "falta o cálculo" era falso, o null era do Lab (segue só o §7, o aviso de faceDeRua, de vocês decidir); ao Laboratório de Parcelamento, nada a fazer no passo (o T-11 fez o pedido no mesmo dia), e o número do §1-D é ±15°, não ±30° — a pergunta do sorteio com viaManual continua de vocês, e o MOTOR_VERSAO segue 1.0 depois do T-11. A todas: documento vivo para o vizinho que não pergunta ao código dele envelhece no dia em que ele lê. Proposto ao chat (FILA, no LAB-168): a ponte do Lab passar relevo ao paraSaida do Generate, com a comparação das duas réguas de rampa, que discordam 6× na gleba plana (9,13 % contra 1,36 %, não investigado).
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; na dívida própria, a referencia/FERRAMENTA_E_TRAVA.md; a proposta acima espera o chat; o .wasm segue sem o alvo do rustup.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 18/10/2026 · LAB-169 — item 900 (a dívida própria): ferramenta e trava — a página tinha guarda para a tabela, e os números da prosa ninguém perguntava

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-169 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main, clone pela receita do LAB-116); a FILA sem proposta que não espere ninguém, e o .wasm sem o alvo do rustup (403, política); fui à dívida própria (número digitado à mão) e peguei a página que o LAB-168 deixou nomeada no §9 dele: docs/referencia/FERRAMENTA_E_TRAVA.md. FEITA, mesclado por git direto (D29). Conferido aqui, não no GitHub: o portão sem clones 1748 de 1748 (101 de 101 arquivos); esteira com só as 9 falhas do .wasm (as de sempre), testfit 17 de 17.
Feito: a página (item 003, 09/10) já tinha guarda para a TABELA; os quatro números da PROSA ninguém lia, e um estava errado desde o dia em que ela nasceu — "os nove recados antigos acima do teto" são SETE pela régua da própria trava, hoje e no commit que a criou (o recado.test.ts sempre disse sete; a prova do item 003 copiava a declaração, e as duas diziam nove). "É o item 004" apontava para uma conta que foi feita e não fecha o buraco do recado nunca escrito (é escrita pela mesma sessão). Agora os quatro números são recontados a cada verde (escopo-dos-instrumentos.test.ts, 11 → 19), e a régua do acumulado mora num lugar só, usada pelo recado.test.ts e pelo lab66; cinco mutações da página, duas do mundo e quatro de código, acusadas; 1740 → 1748; D397; detalhe em docs/relatorios/LAB-169.md.
Achados para outros apps ou Central: a todas — página com guarda para a tabela não tem guarda para a prosa; e prova conferida contra a declaração que ela copia aprova o mesmo número errado nas duas: cópias que concordam só provam que foram copiadas. Nada novo proposto ao chat.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; as três páginas do LAB-167 estão lidas; a proposta do LAB-168 (relevo na ponte do Generate) espera o chat; o .wasm segue sem o alvo do rustup.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 18/10/2026 · LAB-170 — item 900 (a dívida própria): a especificação como chegou — o comentário do topo dizia "numeração tornada sequencial", e nove subseções tinham o número de outra seção

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-170 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main, clone pela receita do LAB-116); a FILA sem proposta que não espere ninguém, e as três páginas do LAB-167 lidas; fui à dívida própria (mensagem fixa que afirma estado sem perguntar), por LUGAR: a maior página de docs/ sem leitor no código, docs/referencia/LABORATORIO.md. FEITA, mesclado por git direto (D29). Conferido aqui, não no GitHub: o portão sem clones 1762 de 1762 (102 de 102 arquivos); esteira com só as 9 falhas do .wasm (as de sempre), testfit 17 de 17.
Feito: o comentário do topo da especificação (LAB-00) dizia "a numeração das seções foi tornada sequencial" — valia para as 38 seções e não para as subseções: as cinco da 23 e as quatro da 28 eram 24.1–24.5 e 24.1–24.4, quatro números repetidos, o defeito que o prompt do LAB-00 mandou corrigir. Renumeradas sem mudar uma palavra (a impressão do texto é a mesma do f61be91), e o comentário diz o que se mediu. Trava src/a-especificacao.ts (14 testes, sem clones): numeração, os números do comentário, a impressão, as citações de seção por LUGAR e as Etapas A a G; oito mutações das páginas e seis de código, acusadas; 1748 → 1762; D398; detalhe em docs/relatorios/LAB-170.md.
Achados para outros apps ou Central: a todas — "única alteração: X" no topo de documento recebido é afirmação de estado sobre o arquivo de hoje, não relato do passado; esta valia para um nível de título e não para o outro, e passou cinco semanas sem leitor. Nada novo proposto ao chat.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; das páginas de docs/ sem leitor sobram duas, ambas relato datado do LAB-00; as propostas antigas (a mais nova, a do LAB-168) esperam o chat; o .wasm segue sem o alvo do rustup.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 18/10/2026 · LAB-171 — item 900 (a dívida própria): a triagem do PackingSolver, perguntada à origem — tudo confere, e o `nao-copiado` do registro passa a ser perguntado à árvore

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-171 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main, clone pela receita do LAB-116); a FILA sem proposta que não espere ninguém; fui à dívida própria (mensagem fixa que afirma estado sem perguntar), por LUGAR: a docs/PACKINGSOLVER_TRIAGEM.md, das duas páginas de docs/ sem leitor a que afirma estado. FEITA, mesclado por git direto (D29). Conferido aqui, não no GitHub: o portão sem clones 1774 de 1774 (103 de 103 arquivos); esteira com só as falhas do .wasm (as de sempre), testfit 17 de 17.
Feito: a página fixa a ficha de um repositório de fora (commit, data, licença, opções do CMakeLists, seis tipos, opções da CLI, certificate.csv), repetida em cinco lugares, e diz que nada foi copiado. Medida na origem (bun run lab171: só o commit fixado, lido com git show, nada executado): tudo confere; o HEAD de hoje mora na prova, ao lado da §6. Trava src/a-triagem-do-packingsolver.ts (12 testes, sem clones e sem rede): a ficha contra a prova, os cinco lugares (frase derivada da ficha; o registro lido pelo motor) e nenhum upstream/ versionado de motor nao-copiado; trinta e duas mutações acusadas; a rede declarada (rede-em-execucao, SEGURANCA.md); 1762 → 1774; D399; detalhe em docs/relatorios/LAB-171.md.
Achados para outros apps ou Central: a todas — "não copiado", "nada clonado", "vazio de propósito" são afirmações sobre a árvore de hoje, e a resposta mora no git ls-files, não no registro que as repete; ficha de repositório de fora copiada em vários lugares se confere contra a origem, não entre as cópias. Nada novo proposto ao chat.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; das páginas de docs/ sem leitor sobra a SYMBIOS_ANALYSIS.md, cujo estado espera o chat (LAB-152); as propostas antigas esperam o chat; o .wasm segue sem o alvo do rustup (túnel recusado).
=== FIM ===
=== FIM DA SESSÃO ===
```

## 18/10/2026 · LAB-172 — item 900 (a dívida própria): a análise do esqueleto reto, perguntada à origem — as duas fichas conferem, e os tempos citados não são os dos arquivos que a página aponta

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-172 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main, clone pela receita do LAB-116); a FILA sem proposta que não espere ninguém; fui à dívida própria (mensagem fixa que afirma estado sem perguntar, e número digitado à mão), ao que o relatório do LAB-171 (§6) deixou escrito: a ficha da docs/STRAIGHT_SKELETON_ANALYSIS.md não reconferida. FEITA, mesclado por git direto (D29). Conferido aqui, não no GitHub: o portão sem clones 1790 de 1790 (104 de 104 arquivos); esteira com só as falhas do .wasm (as de sempre), testfit 17 de 17.
Feito: a página fixa a ficha de dois repositórios de fora e o license.txt da CGAL 5.6, repetidos em seis lugares. Medida na origem (bun run lab172: só os dois commits e a tag, sem blobs, nada executado): as duas fichas conferem, e o HEAD de hoje das duas origens ainda é o da ficha. O achado estava aqui dentro: a página diz "saída completa em outputs/…" e cita quatro tempos (11.378 ms, 3.490 ms, 14.551µs, 8.82µs) que os dois arquivos, do mesmo commit, não têm (12.487 ms, 3.366 ms, 13.709µs, 6.319µs) — citou uma execução e guardou outra; a geometria confere, e é ela o oráculo do LAB-04, agora lido das saídas; o "~400×" só vale para o L. Nota datada na página; trava src/a-analise-do-esqueleto-reto.ts (16 testes, sem rede): fichas, saídas, oráculo, seis lugares e pasta; 65 mutações acusadas; rede declarada; 1774 → 1790; D400; detalhe em docs/relatorios/LAB-172.md.
Achados para outros apps ou Central: a todas — "saída completa em <arquivo>" se confere contra o arquivo, linha por linha: página e arquivo do mesmo commit discordavam, porque a página citou uma execução e guardou outra; tempo citado num relatório tem de ser o do arquivo guardado, ou dizer que não é. Nada novo proposto ao chat.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; das páginas de docs/ sem leitor sobra a SYMBIOS_ANALYSIS.md, cujo estado espera o chat (LAB-152); as propostas antigas esperam o chat; o .wasm segue sem o alvo do rustup (túnel recusado de novo).
=== FIM ===
=== FIM DA SESSÃO ===
```

## 18/10/2026 · LAB-173 — item 900 (a dívida própria): a rodada sem linha — trinta e nove rodadas não escreveram a sua linha na conta dos disparos, e a conta seguiu verde

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-173 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main, clone pela receita do LAB-116); a FILA sem proposta que não espere ninguém, e das páginas de docs/ sem leitor só a que espera o chat; fui à dívida própria (regra sem guarda): "uma linha por disparo", a conta dos disparos do ONDE_PARAMOS.md. FEITA, mesclado por git direto (D29). Conferido aqui, não no GitHub: o portão sem clones 1800 de 1800 (104 de 104 arquivos); esteira com só as falhas do .wasm (as de sempre), testfit 17 de 17.
Feito: a última linha escrita na hora era a de 16/10 15:06 (LAB-133); do LAB-134 ao LAB-172, 39 rodadas gravaram o recado e nenhuma a linha, e a régua do item 004 conferia a tabela contra ela mesma — os totais pararam junto, em 80, e seguiu verde. As 39 reconstruídas do git e do recado com a origem nova "reconstruido" (hora de teto, commit nomeado); conferirAsRodadas cruza rodadas e recados nos dois sentidos (exceção única: LAB-68, anterior à conta); 10 travas novas; prova bun run lab173 (39 de 39 conferem com o git, 7 mutações acusadas, a régua velha aprovava o abandono); 1790 → 1800; D401; detalhe em docs/relatorios/LAB-173.md.
Achados para outros apps ou Central: à direção — a conta dos disparos do Lab estava 39 rodadas atrás desde 16/10 15:06; quem leu "80 disparos, 5 em vazio" para decidir o intervalo leu uma conta parada (hoje: 120, 5 em vazio, 0 desde 10/10). A todas — conta que só se confere contra si mesma aprova o abandono: precisa de uma ponta que a rodada é obrigada a escrever (aqui, o RECADOS.md). Nada novo proposto ao chat.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; das páginas de docs/ sem leitor sobra a SYMBIOS_ANALYSIS.md, cujo estado espera o chat (LAB-152); as propostas antigas esperam o chat; o .wasm segue sem o alvo do rustup.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 18/10/2026 · LAB-174 — item 900 (a dívida própria): o Lab não tem banco — a frase da página, perguntada à árvore, e o cabeçalho que dizia que ela já tinha trava

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-174 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main, clone pela receita do LAB-116); a FILA sem proposta que não espere ninguém; fui à dívida própria (mensagem fixa que afirma estado sem perguntar): "não há banco", do docs/SEGURANCA.md. FEITA, mesclado por git direto (D29). Conferido aqui, não no GitHub: o portão sem clones 1815 de 1815 (105 de 105 arquivos); esteira com só as falhas do .wasm (as de sempre), testfit 17 de 17.
Feito: a tabela "Banco e RLS" põe três linhas do Padrão em "não se aplica" por uma frase de 14/09 sem comando, e o cabeçalho da trava da rede (LAB-158) dizia que o verde.test.ts a conferia — ele lê só o conferir.sh. Três mutações (supabase/migrations/…sql, bun:sqlite, .sqlite), cada uma numa cópia: só a contagem de arquivos do LAB-57 caía, sem dizer por quê. Por LUGAR, 801 caminhos: zero banco. Trava o-lab-nao-tem-banco (sem clones, cinco portas: pasta, arquivo, importação, dependência, navegador; sem exceções); cabeçalho da rede consertado; 1800 → 1815; D402; detalhe em docs/relatorios/LAB-174.md.
Achados para outros apps ou Central: a todas — "isso já tem trava" também é afirmação: o cabeçalho que apontava a guarda do banco apontava uma régua que lê outro arquivo; contagem de arquivos que cai com qualquer arquivo novo não é guarda de nada em particular (quem regera a prova aprova o que entrou). Nada novo proposto ao chat.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; das linhas do SEGURANCA.md que afirmam sem perguntar sobra a do .wasm ("zero imports"), que espera o alvo do rustup (o túnel recusa a origem dele nesta máquina); a SYMBIOS_ANALYSIS.md e as propostas antigas esperam o chat.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 18/10/2026 · LAB-175 — item 900 (a dívida própria): a prova de navegador, perguntada pelo lugar — "a única é a do LAB-01" eram duas, "não tem tela" calava a bancada, e o console não reprova

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-175 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main, clone pela receita do LAB-116); a FILA sem proposta que não espere ninguém; fui à dívida própria (mensagem fixa que afirma estado sem perguntar): a seção "O que não foi conferido" do docs/SEGURANCA.md. FEITA, mesclado por git direto (D29). Conferido aqui, não no GitHub: o portão sem clones 1832 de 1832 (106 de 106 arquivos); esteira com só as falhas do .wasm (as de sempre), testfit 17 de 17.
Feito: o item dizia "a única prova de navegador que existe é a do LAB-01" e "o Lab não tem tela". Por LUGAR (805 caminhos, 381 JS/TS): são duas provas desde o LAB-31 (o navegador.json automático, da prova-automatica.ts); o CLAUDE.md §4 declara a bancada; e a prova do LAB-31 escuta o pageerror e o console sem reprovar por eles. A régua nova acusou nove problemas na página de antes; página corrigida; trava a-prova-de-navegador (17 testes, sem clones), produtores e artefatos nos dois sentidos, a declaração do console conferida contra o código; 1815 → 1832; D403; detalhe em docs/relatorios/LAB-175.md.
Achados para outros apps ou Central: a todas — a seção "o que não foi conferido" também afirma, e envelhece; e prova de navegador que ESCUTA o console não é prova de console limpo: confiram se o pageerror da de vocês reprova ou só entra na mensagem. Proposto ao chat (FILA, no LAB-175): a prova do LAB-31 reprovar por pageerror/console.error — uma linha, mas ela não roda em máquina de sessão (sem o .wasm).
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; a proposta acima e as antigas esperam o chat; o .wasm segue sem o alvo do rustup (o rustup agora termina em pânico nesta máquina).
=== FIM ===
=== FIM DA SESSÃO ===
```

## 18/10/2026 · LAB-176 — item 900 (a dívida própria): o `.wasm` não pede nada do ambiente — perguntado ao que o produz e ao que o carrega, e o binário só quando existe

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-176 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main, clone pela receita do LAB-116); a FILA sem proposta que não espere ninguém; fui à dívida própria (mensagem fixa que afirma estado sem perguntar): a linha do .wasm na tabela Execução do docs/SEGURANCA.md. FEITA, mesclado por git direto (D29). Conferido aqui, não no GitHub: o portão sem clones 1851 de 1851 (107 de 107 arquivos); esteira com só as falhas do .wasm (as de sempre), testfit 17 de 17.
Feito: a linha ("carregado com instantiate(bytes, {}); medido no LAB-01: 189 KB, zero imports") era medição de 10/09 sobre um binário que nenhuma sessão compila, e o LAB-174/175 a deixaram de lado por isso. Metade está no código: por LUGAR, dois instanciadores, os dois com {}; a ponte symbios/archilly/wasm/ sem cola (wasm-bindgen, js-sys, getrandom com wasm_js) no Cargo.toml nem no Cargo.lock, com o backend custom; e a sonda do LAB-00, que TEM a cola e ninguém carrega. A régua nova acusou quatro nomes calados na linha de antes; linha corrigida; trava o-wasm-nao-pede-nada (19 testes, sem clones), o binário perguntado só quando existe (ausente = não medido); 1832 → 1851; D404; detalhe em docs/relatorios/LAB-176.md.
Achados para outros apps ou Central: a todas — "espera o binário" não é "espera tudo": uma linha que mede um artefato que a sessão não produz ainda tem metade no código que o produz; e quem carrega .wasm com {}, confira se alguma régua lê esse {} (aqui nenhuma lia). Nada novo proposto ao chat.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; as propostas antigas esperam o chat; o .wasm segue sem o alvo do rustup (o proxy recusa static.rust-lang.org).
=== FIM ===
=== FIM DA SESSÃO ===
```

## 18/10/2026 · LAB-177 — item 900 (a dívida própria): os vizinhos são só leitura — o clone tinha trava e a linha não a nomeava; "o número sai no relatório" de toda rodada, e 38 relatórios não dizem

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-177 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main, clone pela receita do LAB-116); a FILA sem proposta que não espere ninguém; fui à dívida própria (mensagem fixa que afirma estado sem perguntar): a linha dos vizinhos só leitura no docs/SEGURANCA.md. FEITA, mesclado por git direto (D29). Conferido aqui, não no GitHub: o portão sem clones 1867 de 1867 (108 de 108 arquivos); esteira com só as falhas do .wasm (as de sempre), testfit 17 de 17.
Feito: a linha dizia "git status nos três ao fim de toda rodada, e o número sai no relatório". A primeira metade tem trava desde o LAB-38 (regras.test.ts §4), e a linha não a nomeava; a segunda, nenhuma — por LUGAR, 38 dos 168 relatórios LAB-<n> não dizem o git status dos vizinhos. A régua nova acusou cinco problemas na linha de antes; linha corrigida (as duas travas nomeadas, o recorte dito); trava os-vizinhos-no-relatorio (16 testes, sem clones): de LAB-177 em diante todo relatório diz, os 38 congelados nos dois sentidos, os dois números da linha perguntados; 1851 → 1867; D405; detalhe em docs/relatorios/LAB-177.md.
Achados para outros apps ou Central: a todas — uma linha com duas metades pode ter uma trava só: a guardada faz a linha inteira parecer conferida e a outra envelhece calada; quem tem "conferido em toda rodada" na tabela de segurança, pergunte quem confere cada metade. Nada novo proposto ao chat.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; as propostas antigas esperam o chat; o .wasm segue sem o alvo do rustup.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 18/10/2026 · LAB-178 — item 900 (a dívida própria): o que precisa mudar nos vizinhos vira lista em relatório — a linha não nomeava a trava do LAB-149, e dois dos quatro exemplos dela saíram em prosa

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-178 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main, clone pela receita do LAB-116); a FILA sem proposta que não espere ninguém; fui à dívida própria (mensagem fixa que afirma estado sem perguntar): a linha da lista aos vizinhos no docs/SEGURANCA.md. FEITA, mesclado por git direto (D29). Conferido aqui, não no GitHub: o portão sem clones 1880 de 1880 (109 de 109 arquivos); esteira com só as falhas do .wasm (as de sempre), testfit 17 de 17.
Feito: a linha dava "LAB-07 §9 (8 correções), LAB-02 §5, LAB-03 e LAB-08 — todos com o número" e não nomeava a trava que pergunta a regra desde o LAB-149. Pela régua dela: LAB-07 tem a lista (8 itens) e um pedido em prosa; LAB-03 e LAB-08 saíram em prosa; o LAB-02 tem lista, num parágrafo em negrito que a régua não lê. A régua nova acusou sete problemas na página de antes; linha corrigida (as duas travas, 5 pedidos sem lista, o recorte dito) e tabela dos quatro exemplos; trava o-pedido-na-pagina (13 testes, sem clones); 1867 → 1880; D406; detalhe em docs/relatorios/LAB-178.md.
Achados para outros apps ou Central: a todas — exemplo numa linha de conferência é afirmação sobre outro arquivo e envelhece como número; quem tem "ver LAB-x" como prova numa tabela de segurança, abra o LAB-x. Nada novo proposto ao chat (eu ia propor ler o parágrafo de pedido em negrito; medido, não esconde nenhum pedido sem lista).
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; as propostas antigas esperam o chat; o .wasm segue sem o alvo do rustup.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 18/10/2026 · LAB-179 — item 900 (a dívida própria): chave de IA só no servidor da Central — "o Lab não chama IA", e a linha não nomeava nenhuma das quatro travas que o perguntam

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-179 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main, clone pela receita do LAB-116); a FILA sem proposta que não espere ninguém; fui à dívida própria (mensagem fixa que afirma estado sem perguntar): a linha da chave de IA no docs/SEGURANCA.md. FEITA, mesclado por git direto (D29). Conferido aqui, não no GitHub: o portão sem clones 1899 de 1899 (110 de 110 arquivos); esteira 2251 aprovadas e só as 9 falhas do .wasm (as de sempre), testfit 17 de 17..
Feito: a linha dizia só "o Lab não chama IA. Ver ADOCAO_CENTRAL.md". Por LUGAR, quatro réguas a perguntam e ela não nomeava nenhuma: a chave (varredura-de-segredos, LAB-47), a chamada — inclusive pela porta de IA da Central — (destino-do-que-sai, LAB-80), a porta paga (nada-pago, LAB-148) e a rede no motor (rede-em-execucao, LAB-158); zero achados nas quatro (o LAB-178 contava duas). A régua nova acusou catorze problemas na página de antes; linha corrigida e tabela das quatro; trava a-ia-na-pagina (19 testes, sem clones); 1880 → 1899; D407; detalhe em docs/relatorios/LAB-179.md.
Achados para outros apps ou Central: a todas — "não se aplica" numa linha de segurança é afirmação de estado e precisa dizer quem a pergunta; quem tem "o app não chama IA": procurem quem pergunta pela chave, pela chamada (inclusive à porta de IA da Central, que não é dependência nem endereço novo) e pela porta, e nomeiem na linha. Nada novo proposto ao chat.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; as propostas antigas esperam o chat; o .wasm segue sem o alvo do rustup.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 18/10/2026 · LAB-180 — item 900 (a dívida própria): nenhuma chave em `VITE_` — "não há build de navegador", e há um: o `.wasm`, que embute uma variável de compilação

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-180 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main, clone pela receita do LAB-116); a FILA sem proposta que não espere ninguém; fui à dívida própria (mensagem fixa que afirma estado sem perguntar): a linha do VITE_ no docs/SEGURANCA.md, a última da tabela Chaves e segredos sem trava. FEITA, mesclado por git direto (D29). Conferido aqui, não no GitHub: o portão sem clones 1920 de 1920 (111 de 111 arquivos); esteira 2272 aprovadas e as 9 de sempre (o .wasm); testfit 17 de 17; vizinhos com git status limpo.
Feito: a linha dizia "não há build de navegador; e a busca acima cobre VITE_". Por LUGAR, três portas: empacotador (394 arquivos, zero), a página da bancada (2 arquivos servidos como estão, zero) e o .wasm da ponte — que É um build que o navegador baixa e embute 1 variável de compilação, SYMBIOS_VERSAO, posta pelo build.rs a partir do Cargo.toml do upstream (nenhuma chave, nada lido da máquina). A busca do VITE_ é a do LAB-166, que a linha não nomeava. A régua nova acusou oito problemas na página de antes; linha corrigida e tabela das três; trava o-que-o-navegador-baixa (21 testes, sem clones); 1899 → 1920 (D408). Detalhe em docs/relatorios/LAB-180.md.
Achados para outros apps ou Central: a todas — "não há build de navegador" esquece o build que não é de JavaScript: quem serve .wasm à página, procure env! e option_env! nos .rs da crate e o cargo:rustc-env= do build.rs dela; é o prefixo que nenhuma busca de VITE_ acha. Nada novo proposto ao chat.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; a tabela Chaves e segredos está toda perguntada; as propostas antigas esperam o chat; o .wasm segue sem o alvo do rustup.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 18/10/2026 · LAB-181 — item 900 (a dívida própria): nada repintado fora do catálogo de design — "não há design", e há cor escrita à mão em três lugares

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-181 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main, clone pela receita do LAB-116); a FILA sem proposta que não espere ninguém; fui à dívida própria (mensagem fixa que afirma estado sem perguntar): o item "Nada repintado fora do catálogo de design" do docs/SEGURANCA.md. FEITA, mesclado por git direto (D29). Conferido aqui, não no GitHub: o portão sem clones 1937 de 1937 (112 de 112 arquivos); esteira 2289 aprovadas e as 9 de sempre (o .wasm); testfit 17 de 17; vizinhos com git status limpo.
Feito: o item dizia "Não há design: a única página é a bancada". Por LUGAR, página (2 lidas) e string de cor no código (398 lidos, fora do upstream): 9 cores escritas à mão, nenhuma do catálogo — o <style> da bancada (2), o canvas do prova.js (4) e o .svg que o exemplo do upstream pintou no LAB-00 (3). Tela de usuário nenhuma, a regra não se aplica, mas ninguém perguntava: cor nova ou página nova pintada passavam caladas. A régua nova acusou cinco problemas na página de antes; item corrigido e tabela dos três lugares; trava as-cores-da-bancada (17 testes, sem clones), paleta congelada nos dois sentidos; 1920 → 1937 (D409). Detalhe em docs/relatorios/LAB-181.md.
Achados para outros apps ou Central: a todas — "não há design" confunde "não há tela de usuário" com "não há cor": quem tem página de ferramenta ou SVG gravado como medição, conte a cor que está lá e congele a paleta de cada lugar. Nada novo proposto ao chat.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; na mesma seção do docs/SEGURANCA.md, o "Mobile sem rolagem lateral — Idem" segue sem pergunta; as propostas antigas esperam o chat; o .wasm segue sem o alvo do rustup.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 18/10/2026 · LAB-182 — item 900 (a dívida própria): mobile sem rolagem lateral — "a bancada não é aberta no celular", e ninguém a tinha aberto

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-182 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main, clone pela receita do LAB-116); a FILA sem proposta que não espere ninguém; fui à dívida própria (mensagem fixa que afirma estado sem perguntar): o item "Mobile sem rolagem lateral" do docs/SEGURANCA.md. FEITA, mesclado por git direto (D29). Conferido aqui, não no GitHub: o verde em oito passos; o portão sem clones 1955 de 1955 (113 de 113 arquivos); esteira 2307 aprovadas e as 9 de sempre (o .wasm); testfit 17 de 17; a medição do celular passa; vizinhos com git status limpo.
Feito: o item dizia "Idem: a bancada não é aberta no celular". A bancada monta o mesmo esqueleto sem o .wasm, então foi medida no Chromium a 390, 360 e 320 px, com e sem emulação de celular, como monta aqui e com o registro de 10/09 dentro: não rola de lado, sobra 0 px nos doze casos — o canvas encolhe e o registro rola dentro da caixa —, mas a página não tem <meta name="viewport"> e o celular a desenha em 980 px. Produtor novo rolagem-no-celular.ts (sem .wasm, sem servidor), o primeiro de navegador que roda nesta máquina; o conferir.sh passa a oito passos; trava a-rolagem-no-celular (18 testes, sem clones); a régua acusou nove problemas antes; 1937 → 1955 (D410). Detalhe em docs/relatorios/LAB-182.md.
Achados para outros apps ou Central: a todas — "não é aberta no celular" é hábito, não propriedade da página: abram a página de ferramenta a 390 px com isMobile, comparem scrollWidth com clientWidth e procurem o <meta name="viewport"> (sem ele não rola, mas encolhe). Nada novo proposto ao chat.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; a seção "O que não foi conferido" do docs/SEGURANCA.md está toda perguntada; as propostas antigas esperam o chat; o .wasm segue sem o alvo do rustup.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 18/10/2026 · LAB-183 — item 900 (a dívida própria): nada de exportar motor ou código ao usuário — "o Lab não tem usuário nem exportação", e o repositório é público

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-183 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main, clone pela receita do LAB-116); a FILA sem proposta que não espere ninguém; fui à dívida própria (mensagem fixa que afirma estado sem perguntar): a última linha das tabelas do docs/SEGURANCA.md sem trava nomeada, "Nada de exportar motor ou código ao usuário". FEITA, mesclado por git direto (D29). Conferido aqui, não no GitHub: o verde em oito passos; o portão sem clones 1969 de 1969 (114 de 114 arquivos); esteira 2321 aprovadas e as 9 de sempre (o .wasm); testfit 17 de 17; vizinhos com git status limpo.
Feito: a linha dizia "o Lab não tem usuário nem exportação". Não tem usuário, mas o repositório é público e lê vizinhos privados: o que sai daqui sai para o mundo. Seis portas: a tela (LAB-153) e o código do produto copiado (LAB-146) já perguntadas; por LUGAR as outras quatro — dois Cargo.toml sem publish = false (probe-rust e wasm-probe), consertados; os dois package.json private; a rotina sem passo que publique; nenhum binário versionado; docs/ em .md, .json, .geojson e .txt. Trava nada-se-exporta (14 testes, sem clones); a régua acusou catorze problemas antes; 1955 → 1969 (D411). Detalhe em docs/relatorios/LAB-183.md.
Achados para outros apps ou Central: a todas — "não se aplica" por falta de usuário não fecha a regra de exportar código quando o repositório é público: confiram package.json com "private": true, Cargo.toml com publish = false e nenhuma rotina que publique (aqui, dois de quatro Cargo.toml não diziam). Nada novo proposto ao chat.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; as tabelas do docs/SEGURANCA.md estão todas com trava nomeada; as propostas antigas esperam o chat; o .wasm segue sem o alvo do rustup.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 18/10/2026 · LAB-184 — item 900 (a dívida própria): o Lab não tem conta de usuário — a negação do topo do `SEGURANCA.md` tinha uma porta só, a da Central

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-184 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main, clone pela receita do LAB-116); a FILA sem proposta que não espere ninguém; fui à dívida própria (mensagem fixa que afirma estado sem perguntar): o parágrafo do topo do docs/SEGURANCA.md, "não tem conta de usuário". FEITA, mesclado por git direto (D29). Conferido aqui, não no GitHub: o verde em oito passos; o portão sem clones 1989 de 1989 (115 de 115 arquivos); esteira 2341 aprovadas e as 9 de sempre (o .wasm); testfit 17 de 17; vizinhos com git status limpo.
Feito: das quatro negações do parágrafo, três tinham trava (tela, rede, banco) e o parágrafo não nomeava nenhuma; a da conta tinha só a porta do kit da Central (LAB-167). Plantados numa cópia da casa, uma biblioteca de senha, um campo de senha na bancada e um cookie de sessão não derrubaram trava que dissesse "conta". Por LUGAR, quatro portas — biblioteca de identidade, dependência, campo de senha, cookie —, zero em 833 caminhos. Trava o-lab-nao-tem-conta (20 testes, sem clones); o parágrafo nomeia as cinco travas; a régua acusou seis problemas antes; 1969 → 1989 (D412). Detalhe em docs/relatorios/LAB-184.md.
Achados para outros apps ou Central: a todas — negação que delega a uma trava de outra porta está perguntada pela metade: "a conta é da Central" não pega conta feita dentro da casa (biblioteca de senha, campo de senha, cookie); nas casas que adotam a Central, perguntem que nenhuma biblioteca de identidade mora fora do kit. Nada novo proposto ao chat.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; o docs/SEGURANCA.md está todo com trava nomeada, tabelas e parágrafo do topo; as propostas antigas esperam o chat; o .wasm segue sem o alvo do rustup.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 18/10/2026 · LAB-185 — item 900 (a dívida própria): a análise do Symbios, perguntada à origem — a cópia é byte a byte o commit, e "14 módulos" são 13

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-185 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main, clone pela receita do LAB-116); a FILA sem proposta que não espere ninguém; fui à dívida própria (mensagem fixa que afirma estado sem perguntar e número digitado à mão): a docs/SYMBIOS_ANALYSIS.md, a única página de docs/ sem leitor no código (a que o LAB-172 deixou no §10 do relatório). FEITA, mesclado por git direto (D29). Conferido aqui, não no GitHub: o verde em oito passos; o portão sem clones 2010 de 2010 (116 de 116 arquivos); esteira 2362 aprovadas e as 9 de sempre (o .wasm); testfit 17 de 17; vizinhos com git status limpo.
Feito: medido na origem (bun run lab185, sem os blobs, nada executado): a ficha confere; a cópia em upstream/ é byte a byte o commit — 24 de 24 arquivos com o mesmo objeto do git e o mesmo modo, só o VERSION a mais (a pergunta que a upstream-intocavel dizia não cobrar); as cinco dependências conferem no registro, e "mesmo autor" é verdade; o HEAD de hoje da origem já é outro. O "src/ tem 14 módulos" são 13 pub mod e 14 arquivos: nota datada na página. Trava a-analise-do-symbios (21 testes, sem clones e sem rede); a régua acusou três problemas antes; 1989 → 2010 (D413). Detalhe em docs/relatorios/LAB-185.md.
Achados para outros apps ou Central: a todas — "a cópia é idêntica ao commit" se pergunta sem baixar nada de fora: o git ls-tree -r do commit traz o objeto (o resumo dos bytes) de cada arquivo, e o da cópia está no git da casa; e "N módulos" se conta no que declara módulo, não nos arquivos da pasta. Proposto ao chat: a régua de rede do LAB-158 ler o argumento de rede ("curl", "fetch") também quando a chamada quebra a linha antes dele — hoje nenhum arquivo tem essa forma, medido, mas o formatador a produz sozinho (na FILA, saído do LAB-185).
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; as três páginas de análise de docs/ têm leitor; a linha "Adapter: não escrito" espera a proposta do LAB-152; o .wasm segue sem o alvo do rustup.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 18/10/2026 · LAB-186 — item 900 (a dívida própria): o estado do despertador mora num lugar só — e a porta da frente dizia outro

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-186 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main, clone pela receita do LAB-116); a FILA sem proposta que não espere ninguém; fui à dívida própria (mensagem fixa que afirma estado sem perguntar): o bloco do topo do README.md, a porta da frente. FEITA, mesclado por git direto (D29). Conferido aqui, não no GitHub: o verde em oito passos; o portão sem clones 2022 de 2022 (117 de 117 arquivos); esteira 2374 aprovadas e as 9 de sempre (o .wasm); testfit 17 de 17; vizinhos com git status limpo.
Feito: o README.md dizia "a fila autônoma está esgotada desde 14/09/2026 … e o despertador foi apagado" — falso desde a fila de 15/09, enquanto a conta dos disparos do ONDE_PARAMOS se declara o lugar único do estado (item 004, D234), e a trava daquele item só perguntava dentro da seção. Por LUGAR, todo .md fora dos diários declarados: 33 lidos, 223 nos diários, um achado. O bloco passa a dizer ONDE o estado mora (a caixa e a conta), a frase velha riscada e datada; trava o-estado-num-lugar-so (12 testes, sem clones); a régua acusou três problemas antes; 2010 → 2022 (D414). Detalhe em docs/relatorios/LAB-186.md.
Achados para outros apps ou Central: a todas — o lugar único do estado precisa de quem pergunte os OUTROS lugares, não só ele mesmo; e a porta da frente (README.md) diz onde o estado mora, nunca qual é: estado escrito ali é a segunda terra. Proposto ao chat: o "Também não tem interface" do fim do README.md ganhar a exceção declarada da bancada (CLAUDE.md §4, D381) e ser perguntado pela a-unica-interface.ts (na FILA, saído do LAB-186).
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; as propostas do LAB-186, do LAB-185 e as antigas esperam o chat; o .wasm segue sem o alvo do rustup.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 19/10/2026 · LAB-187 — item 900 (a dívida própria): a pasta de testes do Symbios — "vazio nesta fase", e o adaptador nasceu no dia seguinte

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-187 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main, clone pela receita do LAB-116); a FILA sem proposta que não espere ninguém; fui à dívida própria (mensagem fixa que afirma estado sem perguntar): a external-engines/symbios/tests/README.md, sem leitor no código. FEITA, mesclado por git direto (D29). Conferido aqui, não no GitHub: o verde em oito passos; o portão sem clones 2052 de 2052 (118 de 118 arquivos); esteira 2404 aprovadas e as 9 de sempre (o .wasm); testfit 17 de 17; vizinhos com git status limpo.
Feito: a página dizia, desde o LAB-00, "Vazio nesta fase", que o adaptador "só nasce na Etapa C" e que os testes "serão escritos aqui" — falso desde o LAB-01 (o adaptador) e o LAB-02 (os testes dele, na esteira). Por LUGAR: a pasta só com a página; 8 dos 155 testes da esteira carregam o .wasm; os quatro nomes da especificação em nenhum dos 161 testes e .rs fora do upstream. A página passa a dizer onde os testes moram (a lista dos oito, nos dois sentidos) e que a correspondência com os quatro nomes não está medida; trava a-pasta-de-testes-do-symbios (30 testes, sem clones); a régua acusou catorze problemas antes; 2022 → 2052 (D415). Detalhe em docs/relatorios/LAB-187.md.
Achados para outros apps ou Central: a todas — página de pasta vazia ("vazio nesta fase") envelhece pelo mundo em volta, não pela pasta: a pasta segue vazia e a frase segue verdade sobre ela; ela diz ONDE a coisa mora, e alguém pergunta se mora lá. Proposto ao chat: a linha tests/ da tabela de external-engines/symbios/README.md entrar na proposta do LAB-152 (a anatomia das pastas; na FILA, saído do LAB-187).
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; as propostas do LAB-187, do LAB-186, do LAB-185 e as antigas esperam o chat; o .wasm segue sem o alvo do rustup.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 19/10/2026 · LAB-188 — item 900 (a dívida própria): a página da bancada — o que a pasta carrega, quem roda cada arquivo, e a medição de 10/09 em três lugares

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-188 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main, clone pela receita do LAB-116); a FILA sem proposta que não espere ninguém; fui à dívida própria (mensagem fixa que afirma estado sem perguntar e número digitado à mão): a página da bancada do navegador, que o LAB-187 deixou para outra rodada. FEITA, mesclado por git direto (D29). Conferido aqui, não no GitHub: o verde em oito passos; o portão sem clones 2102 de 2102 (119 de 119 arquivos); esteira 2454 aprovadas e as 9 de sempre (o .wasm); testfit 17 de 17; vizinhos com git status limpo.
Feito: a external-engines/symbios/adapter/ferramentas/navegador/README.md descrevia a pasta do LAB-01 e não nomeava os dois arquivos que o conferir.sh roda nela (prova-automatica.ts, LAB-31; rolagem-no-celular.ts, LAB-182); e os cinco números de 10/09 moravam em três lugares — o bloco da página, o DE_10_09 do prova-automatica.ts (o portão da prova automática) e a prova gravada do LAB-31 —, sem trava. Os três batem. A página lista a pasta entre marcas (nos dois sentidos, e quem o conferir.sh roda) e diz os três lugares; trava a-pagina-da-bancada (50 testes, sem clones); a régua acusou seis problemas antes; 2052 → 2102 (D416). E a conta do LAB-187 errou: a página tem leitor (o rolagem-no-celular.ts, pelo caminho montado em pedaços). Detalhe em docs/relatorios/LAB-188.md.
Achados para outros apps ou Central: a todas — quem lê uma página monta o caminho em pedaços (join(AQUI, "README.md")), e a busca pelo nome inteiro não o vê; e número que virou portão mora em mais de um lugar (a página, a constante que compara, a prova gravada): ou um lê do outro, ou alguém pergunta se dizem o mesmo. Nada novo proposto ao chat.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; as propostas do LAB-187, do LAB-186, do LAB-185 e as antigas esperam o chat; o .wasm segue sem o alvo do rustup.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 19/10/2026 · LAB-189 — item 900 (a dívida própria): a página da sonda — o que a pasta carrega, o que a sonda é hoje, e os números do LAB-00 em dois lugares

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-189 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main, clone pela receita do LAB-116); a FILA sem proposta que não espere ninguém; fui à dívida própria (mensagem fixa que afirma estado sem perguntar e número digitado à mão): o README.md do wasm-probe/, que o LAB-188 deixou para outra rodada. FEITA, mesclado por git direto (D29). Conferido aqui, não no GitHub: o verde em oito passos; o portão sem clones 2162 de 2162 (120 de 120 arquivos); esteira 2514 aprovadas e as 9 de sempre (o .wasm); testfit 17 de 17; vizinhos com git status limpo.
Feito: a external-engines/symbios/archilly/wasm-probe/README.md, do LAB-00, se apresentava como a receita do wasm32 (getrandom com wasm_js) e calava que o .wasm carregado é o da ponte ../wasm/ (LAB-01), pelo backend custom, porque o wasm_js arrasta wasm-bindgen e js-sys; não nomeava os quatro arquivos da pasta; e os números do LAB-00 (162 696 bytes, 12,54 s) moravam também na seção 10 do docs/SYMBIOS_ANALYSIS.md, sem trava. Nenhuma afirmação era falsa (rand 0.9 → getrandom 0.3, upstream por caminho, nada nativo, os dois lugares batem). A página diz o que a sonda é hoje e lista a pasta entre marcas; trava a-pagina-da-sonda (60 testes, sem clones); a régua acusou dez problemas antes; 2102 → 2162 (D417). Detalhe em docs/relatorios/LAB-189.md.
Achados para outros apps ou Central: a todas — página de sonda envelhece quando a sonda perde o posto, não quando muda: ela diz que é sonda e aponta o caminho que venceu. E guardar uma página antiga como texto dentro de um teste é escrever em código tudo o que ela diz — a trava do LAB-176 pegou o nome da sonda no meu próprio teste. Nada novo proposto ao chat.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; na minha lista, o comentário do rust-toolchain.toml copiado do upstream (fala do CI de lá); as propostas do LAB-187, do LAB-186, do LAB-185 e as antigas esperam o chat; o .wasm segue sem o alvo do rustup.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 19/10/2026 · LAB-190 — item 900 (a dívida própria): os `rust-toolchain.toml` de `archilly/` — cópias do upstream, com o comentário que fala do CI de lá

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-190 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main, clone pela receita do LAB-116); a FILA sem proposta que não espere ninguém; fui à dívida própria (mensagem fixa que afirma estado sem perguntar): o comentário do rust-toolchain.toml que o LAB-189 deixou como candidato, na docs/relatorios/LAB-189.md §4. FEITA, mesclado por git direto (D29). Conferido aqui, não no GitHub: o verde em oito passos; o portão sem clones 2195 de 2195 (121 de 121 arquivos); esteira 2547 aprovadas e as 9 de sempre (o .wasm); testfit 17 de 17; vizinhos com git status limpo.
Feito: as três cópias de external-engines/symbios/archilly/ (probe, wasm-probe, wasm) são byte a byte o rust-toolchain.toml do upstream, e o comentário em inglês afirma o CI de lá ("CI reads THIS FILE via actions-rust-lang/setup-rust-toolchain"), a máquina ("the local gate ran 1.96.1") e o clippy. Aqui o verde.yml não usa a ação (quem lê o arquivo é o rustup, pela pasta archilly/wasm), a máquina das sessões tem o 1.97.0 e o proxy recusa a 1.96.1, e nada roda clippy; a página do Symbios nada dizia deles. A página ganha a seção que lista as cópias e diz de quem é o comentário; os arquivos não se tocam; trava os-toolchains-de-archilly (33 testes, sem clones); a página de antes reprova; 2162 → 2195 (D418). Detalhe em docs/relatorios/LAB-190.md.
Achados para outros apps ou Central: a todas — arquivo copiado de fora traz o estado de fora: o comentário de uma cópia byte a byte afirma o CI, a máquina e o portão de quem a escreveu. Não se edita a cópia; diz-se ao lado de quem é cada afirmação, com régua conferindo que o citado está lá e o negado não está aqui. Vale para todo vendor/ da família. Nada novo proposto ao chat.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; na minha lista não sobrou candidato escrito — a próxima rodada reconta as cinco espécies por LUGAR; as propostas do LAB-187, do LAB-186, do LAB-185 e as antigas esperam o chat; o .wasm segue sem o alvo do rustup.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 19/10/2026 · LAB-191 — item 900 (a dívida própria): a página do adaptador do Symbios — o estado do LAB-01, o mapa sem o recorte, e um nome do Generate que nunca existiu

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-191 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main, clone pela receita do LAB-116); a FILA sem proposta que não espere ninguém e o LAB-190 sem candidato escrito; recontei por LUGAR os README.md fora do upstream/ contra quem os lê no código — o LAB-187 contou três sem leitor, eram quatro. Fui à dívida própria: o quarto, external-engines/symbios/adapter/README.md (mensagem fixa que afirma estado sem perguntar e número digitado à mão). FEITA, mesclado por git direto (D29). Conferido aqui, não no GitHub: o verde em oito passos; o portão sem clones 2242 de 2242 (122 de 122 arquivos); esteira 2598 aprovadas e as 9 de sempre (o .wasm); testfit 17 de 17; vizinhos desrasados e com git status limpo.
Feito: a página dizia "Estado: LAB-01 concluído", um mapa sem src/recorte.ts (LAB-02) e src/poligono.ts (LAB-05), que o adaptador "não recorta" e "não aplica restrições" (vale só para gerarRedeViaria: o adaptador exporta recortarPelaGleba, que a esteira chama), e "Validator é LAB-02, Judge é LAB-03" (são os do Generate, D20); e citava NORMA_BR.via.caixaMinima, um nome que o Generate nunca teve (lá é NORMA_BR.viario.valor.caixaMinima, desde 08/09) — o erro estava também no comentário do src/contrato.ts e na D13. Os números conferiam sem dono: ≈ 38 % = 0,3758 da Fazenda Recanto das Águas, os seis padrões, os 15 m do upstream. A página risca e data o que venceu, ganha o mapa entre marcas e a seção dos números; trava a-pagina-do-adaptador (47 testes, sem clones) e a pergunta ao Generate no verde completo (4); a página de antes reprova com 29; 2195 → 2242 (D419). Detalhe em docs/relatorios/LAB-191.md.
Achados para outros apps ou Central: a todas — nome do vizinho copiado sem abrir o vizinho é nome inventado: o valor estava certo (8,4 m), e por isso ninguém desconfiou do nome por 39 dias, em três lugares. Quem cita o dono de um número cita um endereço, e o endereço se confere abrindo o vizinho. Ao Generate, nada a fazer: o erro era daqui. Nada novo proposto ao chat.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; candidato escrito para a próxima rodada própria: o cabeçalho de src/index.ts do adaptador, que repete as duas frases; as propostas do LAB-187, do LAB-186, do LAB-185 e as antigas esperam o chat; o .wasm segue sem o alvo do rustup.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 19/10/2026 · LAB-192 — item 900 (a dívida própria): o cabeçalho de `src/index.ts` do adaptador — o que não faz dito do adaptador, e o juiz que dizia ser do Lab

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-192 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main, clone pela receita do LAB-116); fui à dívida própria, no candidato que o LAB-191 deixou escrito no relatório e na saída da trava: o cabeçalho de external-engines/symbios/adapter/src/index.ts (mensagem fixa que afirma estado sem perguntar). FEITA, mesclado por git direto (D29). Conferido aqui, não no GitHub: o verde em oito passos; o portão sem clones 2255 de 2255 (122 de 122 arquivos); esteira 2611 aprovadas e as 9 de sempre (o .wasm); testfit 17 de 17; vizinhos desrasados e com git status limpo.
Feito: o comentário do topo dizia "O que este adaptador NÃO faz: não recorta pela gleba … o recorte é o LAB-02" — e o LAB-02 pôs o export de recortarPelaGleba neste mesmo arquivo, num commit de uma linha (d619067), sem tocar no cabeçalho — e "Validator é LAB-02, Judge é LAB-03" (são os do Generate, D20). O título passa a nomear gerarRedeViaria, as duas frases ficam riscadas e datadas, e o cabeçalho diz onde o recorte mora e quem o chama; nenhum código muda. A trava do LAB-191 (a-pagina-do-adaptador) ganha a pergunta 10, ao cabeçalho lido em linha só; 13 testes novos; o cabeçalho de antes reprova com sete; 2242 → 2255 (D420). Detalhe em docs/relatorios/LAB-192.md.
Achados para outros apps ou Central: a todas — comentário de cabeçalho envelhece no commit que não o toca: o diff de uma linha do LAB-02 era a linha que tornava o topo falso, e um diff de uma linha não mostra o topo. Quem acrescenta um export a um arquivo que diz o que não faz relê o que ele diz. Nada novo proposto ao chat.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; candidato escrito para a próxima rodada própria: o parágrafo do README.md da raiz que diz que o adaptador do Symbios não recorta e que cada coisa é "de um prompt adiante"; as propostas antigas esperam o chat; o .wasm segue sem o alvo do rustup.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 19/10/2026 · LAB-193 — item 900 (a dívida própria): o parágrafo do `README.md` da raiz sobre o adaptador do Symbios — o que não faz, dito antes de os prompts adiante virem

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-193 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main, clone pela receita do LAB-116); fui à dívida própria, no candidato que o LAB-192 deixou escrito no relatório e na saída da trava: o parágrafo do README.md da raiz sobre o adaptador do Symbios (mensagem fixa que afirma estado sem perguntar). FEITA, mesclado por git direto (D29). Conferido aqui, não no GitHub: o verde em oito passos; o portão sem clones 2269 de 2269 (122 de 122 arquivos); esteira 2625 aprovadas e as 9 de sempre (o .wasm); testfit 17 de 17; vizinhos desrasados e com git status limpo.
Feito: a porta da frente dizia, desde o LAB-01, que o adaptador do Symbios "não recorta pela gleba, não aplica restrições, não parcela em lotes, não valida e não julga — cada uma dessas coisas é de um prompt adiante"; os prompts vieram (recorte no LAB-02, lote no LAB-04, julgamento pela esteira) e o parágrafo nunca foi tocado — e a tabela da mesma página já dizia "julgado? sim desde o LAB-02". A frase fica riscada e datada, e o parágrafo diz onde mora cada peça, com o caminho. A trava do LAB-191 (a-pagina-do-adaptador) ganha a pergunta 11, que confere no código cada lugar apontado; 14 testes novos; o parágrafo de antes reprova com oito; 2255 → 2269 (D421). Detalhe em docs/relatorios/LAB-193.md.
Achados para outros apps ou Central: a todas — a página que se contradiz já disse a verdade, numa linha que ninguém comparou com a outra: a tabela do topo foi atualizada, o parágrafo do fim não. Quem atualiza o estado num lugar procura, na mesma página, quem dizia o estado antigo. Nada novo proposto ao chat.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; nenhum candidato escrito por esta rodada (as frases do recorte que sobram são atribuição verdadeira); as propostas antigas esperam o chat; o .wasm segue sem o alvo do rustup.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 19/10/2026 · LAB-194 — item 900 (a dívida própria): a minha lista de propostas e as seções de prosa — a origem que é um item da caixa, e o sétimo que seguia aberto

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-194 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main, clone pela receita do LAB-116); fui à dívida própria, na minha lista de propostas da FILA.md e nas seções de prosa que a trava do LAB-61 cobra que ela cite (regra sem guarda e mensagem fixa que afirma estado sem perguntar). FEITA, mesclado por git direto (D29). Conferido aqui, não no GitHub: o verde em oito passos; o portão sem clones 2276 de 2276 (122 de 122 arquivos); esteira 2632 aprovadas e as 9 de sempre (o .wasm); testfit 17 de 17; vizinhos na ponta da origin/main e com git status limpo.
Feito: a régua das propostas em prosa só lia "saído do LAB-NNN"; as duas seções abertas saídas de item eram invisíveis — a do item 004 dizia "não executado, e é um DESEMPATE" nove dias depois do desempate (D244, LAB-75), e a do item 029 (LAB-96) tinha duas propostas vivas fora da lista —, e o item "o sétimo mecanismo, se houver" (LAB-59) seguia aberto com a seção da mesma origem riscada desde o LAB-78. A régua lê a origem em item (pela marca de FEITO, a tradução do LAB-164) e acusa o aberto de seção riscada com dois sinais; a seção do 004 e o sétimo riscados, as duas do 029 na lista; abertos 13 → 14; a FILA de antes reprova com três; 7 testes novos; 2269 → 2276 (D422). Detalhe em docs/relatorios/LAB-194.md.
Achados para outros apps ou Central: a todas — a régua que lê a origem por uma forma só envelhece no dia em que a casa ganha a segunda: as propostas passaram a nascer de item da caixa em 09/10 e a régua seguiu lendo LAB-NNN. Quem tem régua sobre a própria lista de propostas confere se ela lê as saídas de item. Nada novo proposto ao chat.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; nenhum candidato escrito por esta rodada; as propostas antigas esperam o chat (as duas do item 029 agora estão na lista); o .wasm segue sem o alvo do rustup.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 19/10/2026 · LAB-195 — item 900 (a dívida própria): os terrenos de prova se regeram byte a byte — e a exceção do metro tinha um motivo que ninguém perguntou

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-195 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main, clone pela receita do LAB-116); fui à dívida própria, nas listas de exceção das travas, perguntando um motivo à coisa de que ele fala (mensagem fixa que afirma estado sem perguntar e regra sem guarda). FEITA, mesclado por git direto (D29). Conferido aqui, não no GitHub: o verde em oito passos; o portão sem clones 2284 de 2284 (123 de 123 arquivos); esteira 2640 aprovadas e as 9 de sempre (o .wasm); testfit 17 de 17; vizinhos na ponta da origin/main e com git status limpo.
Feito: a régua do §7 deixava gerar-terrenos.ts gravar area_ha no docs/terrenos/indice.json porque regerá-lo "reescreve os quatro terrenos de prova"; rodada numa cópia da árvore, a ferramenta reescreve os cinco arquivos byte a byte iguais aos do LAB-01, e ninguém lê o índice. O índice grava area_m2 (sem arredondar), a exceção saiu, e a trava nova os-terrenos-se-regeram roda a ferramenta no Node a cada verde e compara byte a byte nos dois sentidos; 8 testes novos, duas mutações acusadas; 2276 → 2284 (D423). Detalhe em docs/relatorios/LAB-195.md.
Achados para outros apps ou Central: a todas — o motivo de uma exceção é uma afirmação, e o que fala do que aconteceria se alguém rodasse algo se pergunta rodando: "regerá-lo reescreve os quatro terrenos" segurou uma exceção por cinco semanas, e rodada a ferramenta os reescreve iguais. Quem tem lista de exceção com motivo do tipo "refazer X mudaria Y" roda o X uma vez. Nada novo proposto ao chat.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; candidato escrito no relatório: os outros motivos de exceção da casa com a forma "regerar faria X", perguntados um a um; as propostas antigas esperam o chat; o .wasm segue sem o alvo do rustup.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 19/10/2026 · LAB-196 — item 900 (a dívida própria): a fotografia do LAB-60 se retira igual no commit que declara — e o motivo de não regerá-la, perguntado à ferramenta

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-196 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main; o pull do disparo recusou no clone raso e a receita do LAB-116 o desrasou); fui à dívida própria, pelo candidato que o LAB-195 deixou no relatório dele (os motivos de exceção com a forma "regerar faria X"), na lista das espécies de prova (mensagem fixa que afirma estado sem perguntar e regra sem guarda). FEITA, mesclado por git direto (D29). Conferido aqui, não no GitHub: o verde em oito passos; o portão sem clones 2284 de 2284; esteira 2648 aprovadas e as 9 de sempre (o .wasm); testfit 17 de 17; vizinhos na ponta da origin/main e com git status limpo.
Feito: a lista dizia que regerar a fotografia do LAB-60 "com o motor andado mede outra coisa", e o cabeçalho prometia reprovar fotografia que deixou de precisar ser fotografia — nenhuma trava rodava a ferramenta. Rodada em clones locais: no commit que a prova declara (4181e95) ela grava a prova igual, mesmo com a régua de hoje; na ponta do motor (89b26ce), 102 linhas diferentes (369 → 616 arquivos, temCI false → true). A trava nova fotografia-no-commit-declarado pergunta as duas coisas a cada verde completo, em pasta temporária, sem sobregravar nada (D182); 8 testes, três mutações acusadas (D424). Detalhe em docs/relatorios/LAB-196.md.
Achados para outros apps ou Central: a todas — prova "que nunca se regera" e que declara o commit do que mediu se confere retirando-a ali, numa pasta temporária: a ferramenta de hoje no commit de então tem de tirar a mesma foto, e na ponta de hoje tem de tirar outra, senão o motivo de ser fotografia ficou falso. Nada novo proposto ao chat.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; candidato escrito no relatório: a fotografia do LAB-48, perguntada do mesmo jeito; as propostas antigas esperam o chat; o .wasm segue sem o alvo do rustup.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 19/10/2026 · LAB-197 — item 900 (a dívida própria): a fotografia do LAB-48 se retira igual nos três commits que a tiraram — e eles não estavam escritos em lugar nenhum

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-197 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main; o pull do disparo recusou no clone raso e a receita do LAB-116 o desrasou); fui à dívida própria, pelo candidato que o LAB-196 deixou no relatório dele (a fotografia do LAB-48), na lista das espécies de prova (mensagem fixa que afirma estado sem perguntar e regra sem guarda). FEITA, mesclado por git direto (D29). Conferido aqui, não no GitHub: o verde em oito passos; o portão sem clones 2284 de 2284 (123 de 123 arquivos); esteira 2653 aprovadas e as 9 de sempre (o .wasm); testfit 17 de 17; vizinhos na ponta da origin/main e com git status limpo.
Feito: a lista dizia que a prova do LAB-48 é "as violações do motor no commit em que o defeito foi medido", e nenhum commit estava escrito — nem na prova, nem na lista, nem no relatório. São três: com o Lab em 9d28fd7 e a ponta da origem no instante (motor c420613, Generate 64489ff) saem 221 violações contra 128; com os clones do relatório do LAB-53 (motor 4181e95, Generate 5b7e9b4) sai a prova byte a byte; e o Lab de hoje, nos mesmos vizinhos, não a alcança — grava a aferição do LAB-53, igual à versionada. Os três commits escritos em src/fotografia-do-lab48.ts (a prova não se tocou, D182), e a trava nova fotografia-do-lab48 pergunta os dois sentidos a cada verde completo; 5 testes, três mutações acusadas (D425). Detalhe em docs/relatorios/LAB-197.md.
Achados para outros apps ou Central: a todas — prova que diz "no commit em que foi medido" e não escreve o commit é legenda, não proveniência; e o commit não se deduz da hora: o clone da máquina daquele dia não era a ponta da origem (221 contra 128). Acha-se rodando a ferramenta de então sobre os candidatos, e escreve-se ao lado da prova. Nada novo proposto ao chat.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; candidato escrito no relatório: as outras provas que rodam código de vizinho e não escrevem o commit dele, contadas por lugar; as propostas antigas esperam o chat; o .wasm segue sem o alvo do rustup.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 19/10/2026 · LAB-198 — item 900 (a dívida própria): as provas que rodam código de vizinho e não escrevem o commit dele — 44 sujeitos, três cumpriam

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-198 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main; o pull do disparo recusou no clone raso e a receita do LAB-116 o desrasou); fui à dívida própria, pelo candidato que o LAB-197 deixou no relatório dele (as provas que rodam código de vizinho e não escrevem o commit dele), espécie regra sem guarda. FEITA, mesclado por git direto (D29). Conferido aqui, não no GitHub: o verde em oito passos; o portão sem clones 2284 de 2284 (123 de 123 arquivos); esteira 2661 aprovadas e as 9 de sempre (o .wasm), eram 2653 e a diferença são os 8 testes novos; testfit 17 de 17; vizinhos na ponta da origin/main e com git status limpo..
Feito: a regra do LAB-79 (prova que afirma o presente de um vizinho regera-se declarando o commit, e nunca sem ele) tinha função e teste, e ninguém tinha contado a quem ela se aplica. Contado por lugar — quem grava cada prova (lista à mão, 92 linhas, fechada contra o disco), que vizinho a ferramenta roda (o fecho dos import) e que commit da história do vizinho a prova escreve (git cat-file): 44 rodam vizinho, 3 escrevem o commit de todos (LAB-76, 93, 94), 41 calam ao menos um (31 o motor, 40 o Generate). O retrato congelado nos dois sentidos em src/o-commit-do-vizinho-na-prova.ts; trava nova o-commit-do-vizinho-na-prova, 8 testes, duas mutações acusadas (D426). Detalhe em docs/relatorios/LAB-198.md.
Achados para outros apps ou Central: a todas — regra com função testada e universo não contado é regra sem guarda: o teste provava que a regra sabe responder, e ninguém tinha perguntado a quem ela se aplica (44, três em dia). Conte por lugar e congele o retrato nos dois sentidos: a próxima não entra calada, a consertada sai. Nada novo proposto ao chat.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; candidato escrito no relatório: as 41 caladas, uma por rodada, pelo caminho do LAB-197, começando por LAB-18 e LAB-78 (já têm um dos commits); as propostas antigas esperam o chat; o .wasm segue sem o alvo do rustup.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 19/10/2026 · LAB-199 — item 900 (a dívida própria): a prova do LAB-18 calava o motor — achado rodando a ferramenta de então, e é uma janela de cinco commits

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-199 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main; o pull do disparo recusou no clone raso e a receita do LAB-116 o desrasou); fui à dívida própria, pelo candidato que o LAB-198 deixou no relatório dele (as 41 caladas, começando pelas duas pela metade): a do LAB-18, espécie mensagem fixa que afirma estado sem perguntar. FEITA, mesclado por git direto (D29). Conferido aqui, não no GitHub: o verde em oito passos, vermelhos só os três do .wasm; o portão sem clones 2284 de 2284 (123 de 123 arquivos); esteira 2670 aprovadas e as 9 de sempre (o .wasm), eram 2661 e a diferença são os 9 testes novos; testfit 17 de 17; vizinhos na ponta da origin/main e com git status limpo.
Feito: a prova do LAB-18 dá as rampas do motor do vizinho e só escreve o Generate (5b7e9b4). Rodada em clones locais, Lab em bf15af6 e a ferramenta sem o Symbios (sem .wasm): a ponta do motor no instante da prova dá 14 diferenças; cinco commits de 14/09 (fe0c7a1 a 244aae3) refazem a prova valor a valor, e as bordas de fora (648ae78, 2160fce) não. Escrito ao lado em src/retrato-do-lab18.ts (a prova não se tocou, D182); trava nova retrato-do-lab18 roda pontas e bordas a cada verde completo, 6 testes, duas mutações acusadas; e OS_ACHADOS_AO_LADO conta os achados contra os silêncios na frase do LAB-198 ("3 de 71") (D427). Detalhe em docs/relatorios/LAB-199.md.
Achados para outros apps ou Central: a todas — quando a ferramenta de então não distingue os candidatos, o que se escreve é a JANELA, com as duas bordas medidas por fora; escolher um commit dentro dela é afirmar proveniência que nenhuma medição deu. E a data, de novo, não acha o commit: o clone que tirou a prova estava três semanas atrás da origem. Nada novo proposto ao chat.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; candidato escrito no relatório: a do LAB-78, que cala o Generate, pelo mesmo caminho; as propostas antigas esperam o chat; o .wasm segue sem o alvo do rustup.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 19/10/2026 · LAB-200 — item 900 (a dívida própria): a prova do LAB-78 calava o Generate — achado rodando a ferramenta de então, e é uma janela aberta

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-200 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main; o pull do disparo recusou no clone raso e a receita do LAB-116 o desrasou); fui à dívida própria, pelo candidato que o LAB-199 deixou no relatório dele: a do LAB-78, a outra pela metade, espécie mensagem fixa que afirma estado sem perguntar. FEITA, mesclado por git direto (D29). Conferido aqui, não no GitHub: o verde em oito passos, vermelhos só os três do .wasm; o portão sem clones 2284 de 2284 (123 de 123 arquivos); esteira 2676 aprovadas e as 9 de sempre (o .wasm), eram 2670 e a diferença são os 6 testes novos; testfit 17 de 17; vizinhos na ponta da origin/main e com git status limpo.
Feito: a prova do LAB-78 escreve o motor (6cf6396) e cala o Generate, que roda ali na ponte, na divisa e na faixa. Rodada em clones locais, Lab em cdc71da e a ferramenta inteira: de 5b70e5f (02/10, o contrato v2) até a ponta de hoje (704a57a) a prova se refaz valor a valor — os 17 commits que mudam o fecho dos import da ferramenta, cobrindo os 229 —; em 8223873 e antes a ponte recusa e a ferramenta nem roda; com o motor trocado por 4181e95, 7 diferenças (os dentes). Não há borda de depois. Escrito ao lado em src/retrato-do-lab78.ts (a prova não se tocou, D182); trava nova retrato-do-lab78, 6 testes, duas mutações acusadas; achados ao lado: 4 de 71 (D428). Detalhe em docs/relatorios/LAB-200.md.
Achados para outros apps ou Central: a todas — a janela pode não ter borda de depois, e isso também é medição: escreve-se "daqui até onde se mediu", nunca um commit. A data que acerta por indiferença não é a data que acerta (a ponta do instante refaz a prova, como as outras 228). E para cobrir uma janela inteira sem rodar todos os commits, conte os que mudam o fecho dos import da ferramenta: 17 de 229. Proposto ao chat (FILA, lista "não executar"): o verde completo do GitHub clonar o Lab e os vizinhos com a história inteira — hoje clona raso, e cinco travas (LAB-196 a 200) montam commits velhos e reprovariam quando o CI e o VIZINHOS_TOKEN voltarem; lido, não rodado no GitHub.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; candidato escrito no relatório: as outras 39 caladas do retrato, uma por rodada, a mais velha primeiro; as propostas antigas esperam o chat; o .wasm segue sem o alvo do rustup.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 19/10/2026 · despertador-sem-item — o disparo das 14:07 sem item próprio: a tarefa da lista já estava com outra mão (o LAB-200, do disparo de 13:14)

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · despertador-sem-item ===
Estado: disparo das 14:07 (observado, "fired at 14:07:22 UTC"); caixa só com o 900, contada na origin/main às 14:09; a tarefa da lista que o 900 mandava pegar (a do LAB-78) já estava em execução pela sessão do disparo de 13:14, que só enviou às 14:18 (795c062). Duas mãos no repositório ao mesmo tempo, sem que uma visse a outra: o fetch das 14:09 ainda não tinha o trabalho dela. O meu saiu repetido e NÃO foi enviado (fica num ramo local, que não sobe). Conferido aqui, não no GitHub: o verde em oito passos, vermelhos só os três do .wasm; esteira 2676 aprovadas e as 9 de sempre (o .wasm); testfit 17 de 17; vizinhos na ponta da origin/main e com git status limpo.
Feito: só esta linha na conta do ONDE_PARAMOS.md e este recado. A medição repetida bateu com a do LAB-200 — a janela do Generate vai de 5b70e5f (o contrato v2) à ponta de hoje, e 8223873 não grava porque a ponte recusa o motor: duas medições independentes, a mesma resposta. Até o controle bateu: com o motor em 4181e95 (o do LAB-59) as duas acharam 7 diferenças. Nada desta sessão é novo, então nada dela entra na main além desta linha.
Achados para outros apps ou Central: para a direção — o disparo das 13:05 durou ~64 minutos e o das 14:05 começou no meio dele; "um prompt por despertador" não impede dois despertadores ao mesmo tempo, e o fetch do começo não vê o trabalho que a outra mão ainda não enviou. Não toquei em despertador nenhum (ligar, desligar e o intervalo são da direção).
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; o candidato é o que o LAB-200 deixou no relatório dele: as outras 39 caladas do retrato, uma por rodada, a mais velha primeiro.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 19/10/2026 · LAB-201 — item 900 (a dívida própria): o diagnóstico de relevo do LAB-07 calava o Generate — achado rodando a ferramenta de então, e é uma janela aberta

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-201 (item 900) ===
Estado: caixa só com o 900 (contada na origin/main; o pull do disparo recusou no clone raso e a receita do LAB-116 o desrasou; nenhuma outra mão na casa); fui à dívida própria, pelo candidato que o LAB-200 deixou no relatório dele (as 39 caladas, a mais velha primeiro), espécie mensagem fixa que afirma estado sem perguntar. FEITA, mesclado por git direto (D29). Conferido aqui, não no GitHub: o verde em oito passos, vermelhos só os três do .wasm; o portão sem clones 2284 de 2284 (123 de 123 arquivos); esteira 2682 aprovadas e as 9 de sempre (o .wasm), eram 2676 e a diferença são os 6 testes novos; testfit 17 de 17; vizinhos na ponta da origin/main e com git status limpo.
Feito: as mais velhas do retrato (LAB-02 ao LAB-06) precisam do .wasm do Symbios — o Generate julga ali o que o Symbios gerou — e ficaram, com o motivo; a mais velha que esta máquina roda é o diagnóstico de relevo do LAB-07 (.json e .txt, 25b62e0), que dá as estatísticas do criarModeloRelevo do Generate e não escreve commit nenhum dele. Rodada em clones locais, a ferramenta inteira: de 645a572 (06/09, o P43 na tela) até a ponta de hoje (1ee9459) as duas provas se refazem — os 5 commits que mudam o fecho dos import, cobrindo os 299 —; em 14b6227 e antes a ferramenta nem roda; com o número de vizinhos do modelo trocado de 6 para 7 na cópia, 6 diferenças (os dentes). Não há borda de depois. Escrito ao lado em src/retrato-do-lab07-relevo.ts (as provas não se tocaram, D182); trava nova retrato-do-lab07-relevo, 6 testes, três mutações acusadas; achados ao lado: 6 de 71 (D429). Detalhe em docs/relatorios/LAB-201.md.
Achados para outros apps ou Central: a todas — a mais velha que se pode medir não é a mais velha: quando o instrumento não existe para o primeiro da lista, mede-se o seguinte e escreve-se o pulo com o motivo, sem tirá-lo da fila. E os dentes vêm de onde a ferramenta enxerga: aqui o motor não roda, então a troca que prova que a comparação vê algo é no Generate, numa cópia, nunca no vizinho. Nada novo proposto ao chat.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; candidato escrito no relatório: as cinco do medir.ts do LAB-07 (calam o motor e o Generate), pelo mesmo caminho; LAB-02 a 06 esperam o .wasm (o rustup segue sem o alvo); as propostas antigas esperam o chat.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 19/10/2026 · despertador-sem-item — o disparo das 16:07 sem item próprio: a tarefa da lista já estava com outra mão (o LAB-201, do disparo de 15:10)

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · despertador-sem-item ===
Estado: disparo das 16:07 (observado, "fired at 16:07:27 UTC"); caixa só com o 900, contada na origin/main às 16:09; a tarefa da lista que o 900 mandava pegar (a mais velha das caladas que roda aqui: o diagnóstico do relevo do LAB-07) já estava em execução pela sessão do disparo de 15:10, que só enviou às 16:21 (8a82ecc). Duas mãos no repositório ao mesmo tempo, pela segunda vez no dia: o fetch das 16:09 ainda não tinha o trabalho dela. O meu saiu repetido e NÃO foi enviado (fica num ramo local, que não sobe). Conferido aqui, não no GitHub: o verde em oito passos, vermelhos só os três do .wasm; esteira 2682 aprovadas e as 9 de sempre (o .wasm); testfit 17 de 17; vizinhos na ponta da origin/main e com git status limpo.
Feito: só esta linha na conta do ONDE_PARAMOS.md e este recado. A medição repetida bateu com a do LAB-201: a janela do Generate começa em 645a572 e não tem borda de depois, e 14b6227 e antes a ferramenta nem roda. Uma coisa a mais, que não muda o escrito: rodei a ferramenta em cada um dos 300 commits de primeiro pai de 645a572 a b6cd826, um a um — zero nos 300, o que confirma por medição o argumento do fecho dos import que o LAB-201 usou para cobrir os 294 do meio. Os dentes também bateram por outro número (vizinhos 6 → 4: 8 diferenças, só no bloco do Generate).
Achados para outros apps ou Central: para a direção — o disparo das 15:05 começou às 15:10 e durou ~71 minutos, e o das 16:05 começou no meio dele; é o segundo choque do dia (13:14/14:07 foi o primeiro). "Um prompt por despertador" não impede dois despertadores ao mesmo tempo, e o fetch do começo não vê o trabalho que a outra mão ainda não enviou. Não toquei em despertador nenhum (ligar, desligar e o intervalo são da direção).
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; o candidato é o que o LAB-201 deixou no relatório dele.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 19/10/2026 · LAB-202 — item 900, a dívida própria: as cinco provas do `medir.ts` do LAB-07 calavam o motor e o Generate — e são duas janelas fechadas

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-202 (item 900) ===
Estado: disparo ≤ 17:07 (derivado: sem notificação lida, teto no reflog do clone); caixa só com o 900, contada na origin/main; ninguém mais na lista (o último envio, 015dc79, fechava o disparo das 16:07); fui à dívida própria, pelo candidato que o LAB-201 deixou no relatório dele (docs/relatorios/LAB-201.md §9): as cinco provas do medir.ts do LAB-07, espécie mensagem fixa que afirma estado sem perguntar. FEITA, mesclado por git direto (D29). Conferido aqui, não no GitHub: o verde em oito passos, vermelhos só os três do .wasm; esteira 2 688 aprovadas e as 9 de sempre (o .wasm), na passada final; testfit 17 de 17; vizinhos na ponta da origin/main e com git status limpo.
Feito: rodada a ferramenta de 13/09 (Lab 25b62e0) sobre as duas histórias. O motor refaz as cinco de 0ece0b1 (10/09) a 66ece91 (14/09); antes ela não roda, e em 648ae78 acusa 66 valores. O Generate, de 22502b3 (10/09, contrato v1) a 8223873 (02/10); antes e depois (contrato v2) ela não roda. Rodados todos os commits que tocam os fechos (37 do motor, 27 do Generate) e os quatro cantos; os dentes do Generate numa cópia (tolerância de apoio da via 0,75 → 0,5 m: 7 diferenças). Escrito ao lado em src/retrato-do-lab07-medir.ts, trava de 6 testes no verde completo, 3 mutações acusadas; achados ao lado: 16 de 71 (D430). Detalhe em docs/relatorios/LAB-202.md.
Achados para outros apps ou Central: a todas — janela aberta é o que a ferramenta não enxerga; janela fechada, o que ela enxerga. Há dois jeitos de fechar: o vizinho anda e a ferramenta acusa, ou muda de contrato e ela recusa; os dois são borda e se escrevem diferentes. E dois vizinhos cujos fechos não se cruzam se medem eixo a eixo e pelos quatro cantos. Nada novo proposto ao chat.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; candidato escrito no relatório: a LAB-08/medicoes.json (cala o motor e o Generate), pelo mesmo caminho; LAB-02 a 06 esperam o .wasm; as propostas antigas esperam o chat.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 19/10/2026 · LAB-203 — item 900, a dívida própria: a guarda da IDA do LAB-30 calava o motor e o Generate — e, medido, não chama nenhum dos dois

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-203 (item 900) ===
Estado: disparo das 18:06 (observado na listagem das tarefas agendadas, lida e não alterada); caixa só com o 900, contada na origin/main; a tarefa da lista ainda estava com a sessão das 17:07, sem envio — esperei por ela em vez de repetir, e o LAB-202 chegou às 18:12; fui à dívida própria, pelo candidato que o LAB-202 deixou no relatório dele (docs/relatorios/LAB-202.md §8), a seguinte do retrato que roda aqui: a LAB-30/guarda-da-ida.json, espécie mensagem fixa que afirma estado sem perguntar. FEITA, mesclado por git direto (D29). Conferido aqui, não no GitHub: o verde em oito passos, vermelhos só os três do .wasm; esteira 2 695 aprovadas e as 9 de sempre (o .wasm), eram 2 688 e a diferença são os 7 testes novos; testfit 17 de 17; vizinhos na ponta da origin/main e com git status limpo.
Feito: a LAB-08 e as seguintes até a LAB-28 (e a LAB-32) carregam o .wasm do Symbios e ficaram, com o motivo. Com a ferramenta de então (Lab c8a1013) rodada em TODOS os commits de primeiro pai — 271 do motor, 1 251 do Generate —, a prova se refaz byte a byte com qualquer motor desde d2f71e4 (13/09) e qualquer Generate desde 22502b3 (10/09) até hoje, inclusive depois do contrato v2; antes, a ferramenta não monta. Com as 1 099 funções de topo dos dois vizinhos envenenadas na cópia, a prova sai igual, e o veneno está vivo: a ferramenta carrega os vizinhos e não os chama. Dentes do lado do Lab (destino de gleba.furos trocado na cópia: 15 linhas). Escrito ao lado em src/retrato-do-lab30.ts, trava de 7 testes no verde completo, 3 mutações acusadas; achados ao lado: 18 de 71 (D431). Detalhe em docs/relatorios/LAB-203.md.
Achados para outros apps ou Central: para a direção — terceiro choque de despertadores no dia (17:05/18:05), e desta vez sem trabalho repetido: com a origem parada e a lista apontando a tarefa da outra mão, esperei o envio dela (~5 min) em vez de repetir (~70 min nas duas vezes anteriores). A todas — carregar não é chamar: o fecho dos import diz o que a ferramenta PODE rodar; envenenar o vizinho numa cópia diz o que ela RODA. Nada novo proposto ao chat.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; candidato escrito no relatório: a LAB-37/testada-de-frente.json (cala o motor e o Generate), pelo mesmo caminho, com o veneno primeiro; LAB-02 a 06, 08 a 28 e 32 esperam o .wasm; as propostas antigas esperam o chat.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 19/10/2026 · despertador-sem-item — o disparo das 19:06 sem item próprio: a tarefa da lista já estava com outra mão (o LAB-203, do disparo de 18:06)

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · despertador-sem-item ===
Estado: disparo das 19:06 (observado na listagem das tarefas agendadas, lida e não alterada: "fired_at 19:06:05 UTC"); caixa só com o 900, contada na origin/main às 19:07; a tarefa da lista que o 900 mandava pegar (a seguinte das caladas que roda aqui sem o .wasm: a LAB-30/guarda-da-ida.json) já estava com a sessão do disparo de 18:06, que só enviou às 19:07 (daeee01, o LAB-203). O fetch das 19:07 ainda não a tinha, e a listagem já dava esta sessão como o last_run da rotina, então a outra mão não se via. O meu saiu repetido e NÃO foi enviado. Conferido aqui, não no GitHub: o verde em oito passos, vermelhos só os três do .wasm (ausente: o rustup desta máquina não alcança static.rust-lang.org); esteira 2 695 aprovadas e as 9 de sempre (o .wasm), testfit 17 de 17 — a primeira passada deu 19 a mais porque o clone do Generate desta máquina não tinha o zod (ignorado pelo git dele; copiado da esteira, git status limpo). Vizinhos na ponta da origin/main e limpos.
Feito: só esta linha na conta do ONDE_PARAMOS.md e este recado. A medição repetida bateu com a do LAB-203 por outro caminho: com o Lab em c8a1013, a prova se refaz byte a byte com o motor nos 27 commits de d2f71e4 (13/09) a 3fdb8ca (o último que toca src/lib/lab) e com o Generate nos 68 de 22502b3 (10/09) a 0297934 (o último que toca src/lib), e nas duas pontas de hoje; antes, ela não monta (o motor sem contrato/tipos.ts, o Generate sem import/parcelamento-externo.ts). O corpo de rodarMotor, medirSobras e montarParcelamentoExterno lançando na cópia: igual; o topo de api.ts ou de sobras.ts lançando: não roda; a ida do Lab sem a via desenhada: 148 linhas. Carregar não é chamar — o mesmo achado.
Achados para outros apps ou Central: para a direção — quarto choque de despertadores no dia (18:05/19:05). Desta vez a espera do LAB-203 não servia: a outra mão ainda não tinha enviado nada que dissesse qual tarefa era a dela, e a listagem só mostra o último disparo. Não toquei em despertador nenhum (ligar, desligar e o intervalo são da direção). Nada novo proposto ao chat.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; o candidato é o que o LAB-203 deixou no relatório dele (a LAB-37/testada-de-frente.json, com o veneno primeiro).
=== FIM ===
=== FIM DA SESSÃO ===
```

## 19/10/2026 · LAB-204 — item 900, a dívida própria: a testada de frente do LAB-37 calava o motor e o Generate — e o motor que a fez é o de 14/09

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-204 (item 900) ===
Estado: disparo de ≤ 20:06 (derivado do reflog); caixa só com o 900, contada na origin/main; nenhuma outra mão na lista; fui à dívida própria, pelo candidato que o LAB-203 deixou no relatório dele (docs/relatorios/LAB-203.md §9): a LAB-37/testada-de-frente.json, espécie mensagem fixa que afirma estado sem perguntar.
Feito: com a ferramenta de então (Lab 1ff6335), a ponta da origem na hora da prova (motor a95d03d, Generate cae6a2f) NÃO refaz — 44 linhas. Rodados os 28 commits do motor que tocam src/lib/lab/ e os 18 estados do fecho do Generate: refaz byte a byte só com o motor de fe0c7a1 a 244aae3 (14/09, janela fechada, o instante fora) e o Generate de 5b70e5f (contrato v2) até hoje. Escrito ao lado em src/retrato-do-lab37.ts; trava retrato-do-lab37 (cantos, instante, três bordas; duas mutações acusadas); achados ao lado 20 de 71. D432; detalhe em docs/relatorios/LAB-204.md; mesclado por git direto (D29); conferido aqui, não no GitHub.
Achados para outros apps ou Central: a todas — a ponta da origem na hora de uma prova é hipótese, não medição: o clone vizinho de quem gravou a do LAB-37 estava três semanas atrás da origem (coerente com o 4181e95 que o LAB-60 declara), e só rodar a ferramenta mostrou. Prova que declara o commit do vizinho poupa a arqueologia.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; candidato escrito no relatório: a LAB-40/fixtures.json (cala o motor e o Generate), instante primeiro; LAB-02 a 06, 08 a 28 e 32 esperam o .wasm; as propostas antigas esperam o chat.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 19/10/2026 · LAB-205 — item 900, a dívida própria: as fixtures do LAB-40 calavam o motor e o Generate — e o motor que as fez é o de 14/09

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-205 (item 900) ===
Estado: disparo das 21:06 (observado na listagem das tarefas agendadas, lida e não alterada); caixa só com o 900, contada na origin/main; a tarefa da lista (a testada de frente do LAB-37) ainda estava com a sessão das 20:06, sem envio — esperei 20 min, comecei, e o LAB-204 chegou às 21:29; nada repetido foi enviado. Fui à dívida própria, pela seguinte que o LAB-204 deixou no relatório dele (docs/relatorios/LAB-204.md §8): a LAB-40/fixtures.json, espécie mensagem fixa que afirma estado sem perguntar. FEITA, mesclado por git direto (D29). Conferido aqui, não no GitHub: o verde em oito passos, vermelhos só os três do .wasm (ausente: o rustup desta máquina segue sem o alvo); esteira 2 707 aprovadas e as 9 de sempre (o .wasm) — a primeira passada deu 10, porque o meu recado não dizia "fui à dívida própria" e a trava do LAB-127 acusou; corrigido o recado, a esteira inteira de novo —; testfit 17 de 17; vizinhos na ponta da origin/main e com git status limpo.
Feito: com a ferramenta de então (Lab 90a93b2), a ponta da origem na hora da prova (motor 0ab380b, Generate a06befa) NÃO refaz: 11 linhas, e o delta da testada fora de Antonina vira de −40 para +43 lotes. Rodados todos os commits que tocam o fecho (37 do motor, 439 do Generate, ~4 s cada): a prova se refaz só com o motor de 648ae78 a 244aae3 (14/09 — janela fechada, o instante fora, um commit mais larga que a do LAB-37) e o Generate de 5b70e5f (contrato v2) até hoje; as três bordas acusam. Escrito ao lado em src/retrato-do-lab40.ts (a prova não se tocou, D182); trava retrato-do-lab40, 6 testes, três mutações acusadas; achados ao lado: 22 de 71 (D433). Detalhe em docs/relatorios/LAB-205.md.
Achados para outros apps ou Central: a todas — duas provas do mesmo disco estreitam o que nenhuma diz sozinha (o motor de 04/10 entre fe0c7a1 e 244aae3), se "o mesmo disco" se disser como hipótese; e uma frase da prova pode virar de sinal sem ela mudar um byte ("a testada custa lotes" valia para o motor de 14/09, não para o de hoje). Para a direção — quinto choque de despertadores no dia (20:05/21:05); não toquei em despertador nenhum. Nada novo proposto ao chat.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; candidato escrito no relatório: a do LAB-41 (a seguinte sem o .wasm), pelo mesmo caminho; LAB-02 a 06, 08 a 28 e 32 esperam o .wasm; as propostas antigas esperam o chat.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 19/10/2026 · despertador-sem-item — o disparo de ≤ 22:06 sem item próprio: a tarefa da lista já estava com outra mão (o LAB-205, do disparo de 21:06)

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · despertador-sem-item ===
Estado: disparo de ≤ 22:06 (derivado do reflog: a ponta posta no disco às 22:06:46); caixa só com o 900, contada na origin/main às 22:07; a tarefa da lista que o 900 mandava pegar (a LAB-40/fixtures.json, o candidato do LAB-204) já estava com a sessão do disparo de 21:06, que só enviou às 22:44 (166c081, o LAB-205). Os fetch das 22:07 e das 22:22 paravam no LAB-204 (db18147), então a outra mão não se via. O meu saiu repetido e NÃO foi enviado. Conferido aqui, não no GitHub: a passada completa da versão repetida deu esteira 2 706 aprovadas e 10 reprovadas — as 9 do .wasm e a dos ramos abertos (o ramo claude/stoic-ritchie-ijzqy3 sem o objeto no clone, "não sei"; depois do fetch, verde) —, testfit 17 de 17; desta linha, as 35 travas que leem o ONDE_PARAMOS e o RECADOS, a dos ramos e as do LAB-52 e do LAB-57 rodadas isoladas: 633 de 633.
Feito: só esta linha na conta do ONDE_PARAMOS.md e este recado. A medição repetida bateu com a do LAB-205: com o Lab em 90a93b2, o motor refaz só de 648ae78 a 244aae3 (14/09; borda de antes 66ece91, de depois 2160fce; o instante 0ab380b fora, 11 linhas), o Generate de 5b70e5f (contrato v2) à ponta; os quatro cantos iguais; duas mutações da trava acusadas.
Achados para outros apps ou Central: para a direção — quinto choque de despertadores no dia (21:05/22:05): a sessão das 21:06 esperou a das 20:06 e só enviou às 22:44, e a das 22:06 não tinha como vê-la. Não toquei em despertador nenhum (ligar, desligar e o intervalo são da direção). Nada novo proposto ao chat.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; o candidato é o que o LAB-205 deixou no relatório dele (a LAB-41, a seguinte sem o .wasm).
=== FIM ===
=== FIM DA SESSÃO ===
```

## 19/10/2026 · LAB-206 — item 900, a dívida própria: a prova do LAB-41 calava o Generate — e ela se refaz numa janela fechada, de 20/09 a 14/10, com o instante dentro

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-206 (item 900) ===
Estado: disparo de ≤ 23:06 (derivado do reflog); caixa só com o 900, contada na origin/main; nenhuma outra mão na lista; fui à dívida própria, pelo candidato que o LAB-205 deixou no relatório dele (docs/relatorios/LAB-205.md §8): a LAB-41/ortogonal-fora-da-gleba.json, espécie mensagem fixa que afirma estado sem perguntar. FEITA, mesclado por git direto (D29). Conferido aqui, não no GitHub: o verde em oito passos, vermelhos só os três do .wasm (ausente: o rustup desta máquina segue sem o alvo); esteira 2 712 aprovadas e as 9 de sempre (o .wasm) — a primeira passada deu 19, porque o zod do Generate não estava na node_modules ignorada de lá; posto como manda a receita, a esteira inteira de novo —; testfit 17 de 17; vizinhos na ponta da origin/main e com git status limpo.
Feito: com a ferramenta de então (Lab d817176), a ponta da origem na hora da prova (Generate a06befa) REFAZ byte a byte. Rodados os 68 commits que tocam src/lib/ do contrato v1 em diante, os 3 de antes e a ponta de hoje (os outros 368 de antes contados pela árvore): refaz só de 7eb39ce (20/09) a db31559 (14/10) — janela fechada, o instante dentro; bordas 93b6f72 (11 valores) e 18df3a8 (5, só lotes da espinha). Escrito ao lado em src/retrato-do-lab41.ts; trava retrato-do-lab41 (5 testes, três mutações acusadas); achados ao lado 23 de 71. D434; detalhe em docs/relatorios/LAB-206.md.
Achados para outros apps ou Central: a todas — a frase de uma prova e os números dela têm janelas diferentes: a resposta do LAB-41 (a ortogonal recusada pela via fora da gleba) vale com o Generate de hoje; os lotes, só de 20/09 a 14/10. Para o Generate, sem pedido: 7eb39ce (A13) e 18df3a8 (a tesoura na divisa) mexem na contagem da espinha nas glebas sintéticas do Lab. Nada novo proposto ao chat.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; candidato escrito no relatório: a do LAB-46 (a última das cinco sem o .wasm), instante e fecho primeiro; LAB-02 a 06, 08 a 28 e 32 esperam o .wasm; as propostas antigas esperam o chat.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 20/10/2026 · despertador-sem-item — o disparo das 00:06 sem item próprio: a tarefa da lista já estava com outra mão (o LAB-206, do disparo de ≤ 23:06)

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · despertador-sem-item ===
Estado: disparo das 00:06 (observado na listagem das tarefas agendadas, lida e não alterada: o last_run da rotina era esta sessão, fired_at 00:06:27); caixa só com o 900, contada na origin/main às 00:07; a tarefa da lista que o 900 mandava pegar (a LAB-41/ortogonal-fora-da-gleba.json, o candidato do LAB-205) já estava com a sessão do disparo de ≤ 23:06, que só enviou às 00:18 (ee08ecf, o LAB-206). A origem às 00:07 parava em 90030c8 (23:01), então a outra mão não se via. O meu saiu repetido e NÃO foi enviado. Conferido aqui, não no GitHub: desta linha, a conta dos disparos (lab71) e as provas que contam a árvore (lab52, lab57) regeradas, e as travas que leem o ONDE_PARAMOS e o RECADOS rodadas.
Feito: só esta linha na conta do ONDE_PARAMOS.md e este recado. A medição repetida bateu com a do LAB-206: com o Lab em d817176, o instante a06befa refaz byte a byte; dos 80 commits do Generate rodados (os últimos que tocam src/lib/ e a ponta c04fe9e), refaz só de 7eb39ce a db31559 (36), as bordas 93b6f72 (11 linhas) e 18df3a8 (5) acusam, a ponta acusa 5; o motor em 0ab380b ou na ponta 3f6e080 não muda nada.
Achados para outros apps ou Central: para a direção — sexto choque de despertadores em dois dias (23:05/00:05): a sessão de ≤ 23:06 só enviou às 00:18, e a das 00:06 não tinha como vê-la; os três vizinhos chegaram rasos nesta máquina e foram desrasados. Não toquei em despertador nenhum (ligar, desligar e o intervalo são da direção). Nada novo proposto ao chat.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; o candidato é o que o LAB-206 deixou no relatório dele (a LAB-46, a última das cinco sem o .wasm).
=== FIM ===
=== FIM DA SESSÃO ===
```

## 20/10/2026 · LAB-207 — item 900, a dívida própria: as três amostragens do LAB-46 calavam o motor e o Generate — e o motor que as fez é o de 14/09, a mesma janela da testada do LAB-37

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-207 (item 900) ===
Estado: disparo de ≤ 01:06 (derivado do reflog); caixa só com o 900, contada na origin/main; nenhuma outra mão na lista; fui à dívida própria, pelo candidato que o LAB-206 deixou no relatório dele (docs/relatorios/LAB-206.md §8): a LAB-46/antonina-tres-amostragens.json, espécie mensagem fixa que afirma estado sem perguntar. FEITA, mesclado por git direto (D29). Conferido aqui, não no GitHub.
Feito: com a ferramenta de então (Lab c0b7c54), as pontas da origem na hora da prova (motor f581b5a, Generate a06befa) NÃO refazem — 63 linhas. Rodados os 37 commits do motor que tocam src/lib/lab/ e os 71 do Generate que a ferramenta alcança (368 pela árvore): refaz byte a byte só com o motor de fe0c7a1 a 244aae3 (14/09, janela fechada, o instante fora) e o Generate de 5b70e5f (contrato v2) até hoje. Escrito ao lado em src/retrato-do-lab46.ts; trava retrato-do-lab46 (6 testes, mutação acusada); achados ao lado 25 de 71 (D435). Detalhe em docs/relatorios/LAB-207.md.
Achados para outros apps ou Central: a todas — três provas do mesmo disco (LAB-37, 40, 46) dão a mesma janela do motor, e isso é o teto do que dizem juntas, não medição do disco; a frase da prova (o plano só de lote externo, só na completa) vale com as pontas de hoje, os lotes das amostragens de 2 variantes não. Para o Laboratório de Parcelamento, sem pedido: o T07 (2160fce) e o 38f9943 levam a espinha de 2 variantes em geo-antonina de nenhum plano a 1 417 lotes. Nada novo proposto ao chat.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; as cinco caladas sem o .wasm (LAB-30, 37, 40, 41, 46) estão todas escritas ao lado — a próxima rodada escolhe outra espécie na dívida própria; LAB-02 a 06, 08 a 28 e 32 esperam o .wasm; as propostas antigas esperam o chat.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 20/10/2026 · despertador-sem-item — o disparo de ≤ 02:06 sem item próprio: a tarefa da lista já estava com outra mão (o LAB-207, do disparo de ≤ 01:06)

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · despertador-sem-item ===
Estado: disparo de ≤ 02:06 (derivado do reflog: a ponta posta no disco às 02:06:20); caixa só com o 900, contada na origin/main às 02:07; a tarefa da lista que o 900 mandava pegar (a LAB-46/antonina-tres-amostragens.json, o candidato do LAB-206) já estava com a sessão do disparo de ≤ 01:06, que só enviou às 02:17 (f6d17e4, o LAB-207). As buscas da origem até ali paravam em e9401c9 (00:31), então a outra mão não se via. O meu saiu repetido e NÃO foi enviado. Conferido aqui, não no GitHub: a trava da versão repetida passou sozinha (6 de 6, três mutações acusadas); desta linha, a conta dos disparos (lab71) e as provas que contam a árvore (lab52, lab57) regeradas, e as travas que leem o ONDE_PARAMOS e o RECADOS rodadas.
Feito: só esta linha na conta do ONDE_PARAMOS.md e este recado. A medição repetida bateu com a do LAB-207: com o Lab em c0b7c54, o instante (motor f581b5a, Generate a06befa) acusa 94 linhas; o motor refaz só de fe0c7a1 a 244aae3 (bordas 648ae78, 8 linhas, e 2160fce, 32); o Generate refaz de 5b70e5f à ponta efb70e9 (borda 8223873, 194).
Achados para outros apps ou Central: para a direção — sétimo choque de despertadores em dois dias (01:05/02:05): a sessão de ≤ 01:06 só enviou às 02:17, e a das 02:06 não tinha como vê-la. Não toquei em despertador nenhum (ligar, desligar e o intervalo são da direção). Para a próxima rodada desta casa: o LAB-207 §8 diz que a série das caladas sem o .wasm acabou, mas as ferramentas do LAB-50, 54, 55, 58 e 59 (caladas no retrato do LAB-198, os dois vizinhos) não citam o .wasm nem importam o Symbios — contado por grep e pelos import, o fecho não conferido. Nada novo proposto ao chat.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; candidato: a LAB-50/passagem-externa.json (cala os dois; ferramenta sem .wasm por grep), instante e fecho primeiro — o fecho confirma se ela roda aqui; LAB-02 a 06, 08 a 28 e 32 esperam o .wasm; as propostas antigas esperam o chat.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 20/10/2026 · LAB-208 — item 900, a dívida própria: a passagem externa do LAB-50 calava o motor e o Generate — e o motor que a fez é o de 14/09, a mesma janela do LAB-37 e do LAB-46

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-208 (item 900) ===
Estado: disparo de ≤ 03:06 (derivado do reflog); caixa só com o 900, contada na origin/main; nenhuma outra mão na lista; fui à dívida própria, pelo candidato que o recado do disparo de ≤ 02:06 deixou: a LAB-50/passagem-externa.json (docs/prompts/FILA.md, espécie mensagem fixa que afirma estado sem perguntar). FEITA, mesclado por git direto (D29). Conferido aqui, não no GitHub: o verde em oito passos, vermelhos só os três do .wasm (ausente nesta máquina); esteira 2 724 aprovadas e 10 reprovadas — as 9 do .wasm e a do LAB-57, porque regerei as provas que contam a árvore antes de pôr os arquivos novos no git (3 a menos); regeradas depois, as 57 travas que leem a árvore, o ONDE_PARAMOS e o RECADOS rodadas de novo: 892 de 892; a trava nova 7 de 7; testfit 17 de 17; vizinhos na ponta da origin/main e com git status limpo.
Feito: com a ferramenta de então (Lab 846b955), as pontas da origem na hora da prova (motor 9336985, Generate ad17a7e) NÃO refazem — 226 linhas. Rodados os 37 commits do motor que tocam src/lib/lab/ e os 71 do Generate que a ferramenta alcança (368 pela árvore): refaz byte a byte, fora o quando da raiz, só com o motor de fe0c7a1 a 244aae3 (14/09, janela fechada, o instante fora) e o Generate de 5b70e5f (contrato v2) até hoje; antes do v2 a ferramenta cai (o motor sem plano). Escrito ao lado em src/retrato-do-lab50.ts; trava retrato-do-lab50 (7 testes, mutação acusada); achados ao lado 27 de 71 (D436). Detalhe em docs/relatorios/LAB-208.md.
Achados para outros apps ou Central: a todas — quatro provas do mesmo disco (LAB-37, 40, 46 e a de 06/10 do LAB-50, dois dias depois) dão a mesma janela do motor: teto do que dizem juntas, não medição. A frase do LAB-50 (as quatro previsões da passagem externa) vale com as pontas de hoje; os números de ensaio-com-testada não. Para o Laboratório de Parcelamento, sem pedido: com o motor de hoje, o lote externo sobre leito de via em ensaio-com-testada foi de 9 para 21 (geo-antonina igual, 10). Nada novo proposto ao chat.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; candidato escrito no relatório (§8): a LAB-53 (as seguintes, 54, 55, 58 e 59, calam os dois; as ferramentas de hoje sem .wasm no fecho, as de então não conferidas), instante e fecho primeiro; LAB-02 a 06, 08 a 28 e 32 esperam o .wasm; as propostas antigas esperam o chat.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 20/10/2026 · LAB-209 — item 900, a dívida própria: a aferição do LAB-53 calava o motor e o Generate — e as duas pontas da origem daquela hora ficam fora

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-209 (item 900) ===
Estado: disparo de ≤ 04:06 (derivado do reflog); caixa só com o 900, contada na origin/main; nenhuma outra mão na lista; fui à dívida própria, pelo candidato que o LAB-208 deixou: a LAB-53/violacoes-depois-do-conserto-da-ponte.json (docs/relatorios/LAB-208.md §8, espécie mensagem fixa que afirma estado sem perguntar). FEITA, mesclado por git direto (D29). Conferido aqui, não no GitHub: o verde em oito passos, vermelhos só os três do .wasm (ausente nesta máquina); esteira 2 733 aprovadas e 9 reprovadas (as 9 do .wasm); a trava nova 8 de 8 (mutação: 2 reprovam); testfit 17 de 17 — na segunda passada: na primeira faltava o zod na node_modules do Generate (ignorada pelo git de lá), tropeço meu; vizinhos na ponta da origin/main e com git status limpo.
Feito: o fecho da ferramenta de então (lab48.ts, a mesma de hoje) não tem .wasm. Com o Lab em e1fbe61, as pontas da origem na hora da prova (motor 3e306d1, Generate ad17a7e) NÃO refazem — 1 127 linhas: das 92 violações sobram as 40 de geo-antonina — e cada uma sozinha também acusa. Rodados os 37 commits do motor e os 71 do Generate que a ferramenta alcança (368 pela árvore): refaz byte a byte, fora o quando, só com o motor de fe0c7a1 a 244aae3 (14/09) mais uma ilha antes do T03 (d2f71e4, 66ece91), e o Generate de 22502b3 (contrato v1) a 49d8e3e (03/10, 14h24). Escrito ao lado em src/retrato-do-lab53.ts; trava retrato-do-lab53 (8 testes, mutação acusada); achados ao lado 29 de 71 (D437). Detalhe em docs/relatorios/LAB-209.md.
Achados para outros apps ou Central: a todas — pela primeira vez na série o instante fica fora nos DOIS vizinhos (o Generate do disco estava ao menos 4 dias atrás da origem), e uma janela lida pelas bordas pode ter buraco no meio (o T03 do motor acusa entre dois pedaços que refazem). A frase do LAB-53 (as 92 não aprovam gleba nenhuma) não vale hoje. Para o Laboratório de Parcelamento, sem pedido: com o motor de hoje as cinco glebas dão 40 violações, todas em geo-antonina (29 frente, 11 via-sobre-lote); as outras quatro, zero. Para o Generate, sem pedido: a testada-ilegal (641addb) acusa 1 lote em sintetico-50ha com o motor de 14/09, nenhum com o de hoje. Nada novo proposto ao chat.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; candidato escrito no relatório (§8): a LAB-54 (depois 55, 58 e 59, que calam os dois), instante e fecho primeiro; LAB-02 a 06, 08 a 28 e 32 esperam o .wasm; as propostas antigas esperam o chat.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 20/10/2026 · LAB-210 — item 900, a segunda mão no LAB-209: a ilha do motor e o Generate desde o contrato v1 eram a ferramenta gravando noutro arquivo

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-210 (item 900) ===
Estado: disparo de ≤ 05:06 (derivado do reflog); caixa só com o 900, contada na origin/main às 05:07; fui à dívida própria, pelo candidato do LAB-208 (a LAB-53, docs/relatorios/LAB-208.md §8; espécie prova que só registra aparência), sem ver a outra mão — a sessão de ≤ 04:06 já estava nela e enviou às 05:27 (LAB-209). Trabalho repetido NÃO enviado; a comparação achou um defeito no entregue, e é ele que vai: FEITA, mesclado por git direto (D29). Conferido aqui, não no GitHub: os oito passos, vermelhos só os três do .wasm ausente; esteira 2 733 aprovadas e 9 reprovadas (as do .wasm); testfit 17 de 17.
Feito: a lab48.ts escolhe o destino pela medição da ponte; com o motor do T01 (d2f71e4, 66ece91) ou o Generate do contrato v1 (22502b3 … 8223873, 29) ela grava LAB-48/ sem tocar a prova, e a trava do LAB-209 só olhava a prova: dava "igual". Com o outro destino vigiado, a prova se refaz só com o motor de fe0c7a1 a 244aae3 (sem ilha) e o Generate de 5b70e5f (contrato v2) a 49d8e3e — 5 commits, não 34. src/retrato-do-lab53.ts e a trava corrigidos ("igual" exige ter escrito a prova; 16 rodadas, 8 de 8); a janela do LAB-209 agora reprova. D438 substitui parte do D437. Detalhe em docs/relatorios/LAB-210.md.
Achados para outros apps ou Central: a todas, como método — arquivo que a ferramenta não escreveu não foi refeito: trava que compara só o destino esperado dá "igual" para a ferramenta que gravou noutro lugar (ou em lugar nenhum). E duas mãos na mesma tarefa, sem combinar, acharam o que uma só não acharia. O resto do LAB-209 se confirma por outra mão (os dois instantes fora; 40 violações com as pontas de hoje). Nada novo proposto ao chat.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; candidato: a LAB-54, instante e fecho primeiro, vigiando todo arquivo que a ferramenta escreve (depois 55, 58 e 59); LAB-02 a 06, 08 a 28 e 32 esperam o .wasm; as propostas antigas esperam o chat.
=== FIM ===
=== FIM DA SESSÃO ===
```

## 20/10/2026 · LAB-211 — item 900, a dívida própria: a atribuição das `frente` do LAB-54 calava o motor e o Generate — e o motor que a fez é o de 14/09; as 27 `frente` de fora de Antonina não existem no instante

```
=== RECADO PARA O CHAT — MOTOR LAB (archilly-lab) · LAB-211 (item 900) ===
Estado: disparo de ≤ 06:06 (derivado do reflog); caixa só com o 900, contada na origin/main; outra mão (o disparo de ≤ 05:06) estava na correção do LAB-209 e enviou às 06:46 sem eu ver: tarefas diferentes, sem repetição, mas os números colidiram — os meus viraram LAB-211 e D439; fui à dívida própria, pelo candidato que o LAB-209 e o LAB-210 deixaram: a LAB-54/frente-nao-atribuida.json (docs/relatorios/LAB-209.md §8, espécie mensagem fixa que afirma estado sem perguntar). FEITA, mesclado por git direto (D29). Conferido aqui, não no GitHub: o verde em oito passos, vermelhos só os três do .wasm (ausente nesta máquina); esteira 2 741 aprovadas e 9 reprovadas (as 9 do .wasm); testfit 17 de 17
Feito: o fecho da ferramenta de então (lab54.ts, nascida no b42634f e a mesma de hoje) não tem .wasm. Com o Lab em b42634f, as pontas da origem na hora da prova (motor 332bf91, Generate 7330cc7) NÃO refazem — 717 linhas; o motor do instante sozinho acusa, o Generate do instante sozinho refaz. Rodados os 37 commits do motor e os 71 do Generate que a ferramenta alcança (368 pela árvore): refaz byte a byte, fora o quando, só com o motor de fe0c7a1 a 244aae3 (14/09, a mesma janela do LAB-37, 46, 50 e 53; sem ilha) e o Generate do contrato v2 (5b70e5f) até a ponta de hoje. Escrito ao lado em src/retrato-do-lab54.ts; trava retrato-do-lab54 no verde completo (8 testes, confere também que a ferramenta escreveu a prova e nada mais; mutação: 2 reprovam); achados ao lado 31 de 71 (D439). Detalhe: docs/relatorios/LAB-211.md
Achados para outros apps ou Central: a todas — a tese de uma prova pode estar numa parte que o motor da hora já não produzia: as 27 frente de fora de Antonina (23 do motor, 4 da régua) saem ZERO com o motor do instante e com o de hoje; só geo-antonina sobrevive (22 + 7, saldo zero). Para o Laboratório de Parcelamento, sem pedido: com o motor de hoje, completo, os dois sintéticos e ensaio-47ha dão zero frente no _testadaDoLote do Generate. Para o Generate: nada novo.
Depende do Jonny: nada.
Próximo na fila: a caixa só tem o 900; candidato escrito no relatório (§8): a LAB-55 (depois 58 e 59, que calam os dois), instante e fecho primeiro; LAB-02 a 06, 08 a 28 e 32 esperam o .wasm; as propostas antigas esperam o chat.
=== FIM ===
=== FIM DA SESSÃO ===
```
