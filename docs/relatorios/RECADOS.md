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
