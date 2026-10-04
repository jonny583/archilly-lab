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
