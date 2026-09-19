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
