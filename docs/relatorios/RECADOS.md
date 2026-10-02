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
