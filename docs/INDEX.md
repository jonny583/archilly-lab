# ÍNDICE — Archilly Lab

Mapa dos documentos deste repositório. Se você não sabe por onde começar,
comece pela primeira linha da primeira tabela.

Reescrito no **LF-FINAL, 14/09/2026**.

---

## Começar por aqui

| documento | o que responde |
|---|---|
| [`ONDE_PARAMOS.md`](ONDE_PARAMOS.md) | **Onde estamos hoje**, o que a última rodada entregou e o que ficou esperando |
| [`../CLAUDE.md`](../CLAUDE.md) | As regras permanentes de quem trabalha aqui — e a regra do RECADO |
| [`referencia/LABORATORIO.md`](referencia/LABORATORIO.md) | **O que é este laboratório**: a especificação, Etapas A a G, como ela chegou |
| [`../README.md`](../README.md) | A regra de ouro (`upstream` → `archilly` → `adapter`) e a estrutura da casa |

## Decisão e fila

| documento | o que responde |
|---|---|
| [`prompts/FILA.md`](prompts/FILA.md) | **O que vem a seguir** — a fila de 19/09, a da tela unificada, esgotou |
| [`DECISOES.md`](DECISOES.md) | Por que a casa é assim. 72 decisões numeradas, com o que se perde em cada uma. A D61 é do Jonny: travessia sobre APP é exceção |
| [`PENDENCIAS_JONNY.md`](PENDENCIAS_JONNY.md) | O que depende de uma pessoa. Quem escreve sou eu; quem risca é ele. Hoje: **quanto é "desvio desproporcional"?** — o número que destrava a D61 |
| [`relatorios/RECADOS.md`](relatorios/RECADOS.md) | **Todos os recados para o chat**, em ordem, um por prompt |

## As medições — um relatório por prompt

| documento | o que responde |
|---|---|
| [`../entrega/registro-de-motores/`](../entrega/registro-de-motores/) | **A peça pronta para o Generate** (LAB-06): registro de motores, liga/desliga, escolha salva e a regra do ranking. Sem dependência nenhuma — quem instala é o GU-03 |
| [`relatorios/LAB-06.md`](relatorios/LAB-06.md) | **A entrega, e o teste de que apagar o Lab não quebra o Generate** |
| [`relatorios/LAB-34.md`](relatorios/LAB-34.md) | **O aviso vai onde a ordem aparece** (LAB-34): *"varia 108 %"* não era a pergunta de quem compara. Medido, **a ordem dos motores muda em 3 dos 5 terrenos e o primeiro lugar em 2** — e o aviso passou a nascer debaixo de cada quadro. A **sétima** vez do ponto cego (D132, D133) |
| [`relatorios/LAB-33.md`](relatorios/LAB-33.md) | **A trava que lia um arquivo passa a medir o motor** (LAB-33): no LAB-30 eu virei o sinal e chamei de conserto, e o teste continuou lendo um `JSON`. Agora os oito cenários rodam no teste, e a prova congelada virou **detector de prova velha** — com a regra geral e a varredura (D130, D131) |
| [`relatorios/LAB-32.md`](relatorios/LAB-32.md) | **A queda da aderência era o motor obedecendo** (LAB-32): metade da queda de 17,4 → 11,2 % foi o ranking do motor trocar de partido, e a outra metade foi a régua do Lab medir uma promessa que o campo `viaManual` nunca fez. A **sexta** vez do ponto cego da §6, pega dentro do prompt (D127 a D129) |
| [`relatorios/LAB-31.md`](relatorios/LAB-31.md) | **"Verde" é um comando só** (LAB-31): sete passos, duas guardas antes deles, e a prova de que ele **reprova** — sabotagem de propósito numa frente de cada vez. Achou a prova no navegador rodando **uma vez em 10/09** porque a última etapa dela era um olho (D122 a D126) |
| [`relatorios/LAB-30.md`](relatorios/LAB-30.md) | **A guarda da IDA** (LAB-30): a **quinta** vez do ponto cego da §6, e a primeira que já tinha saído para o chat — o motor tem `viaManual` e a ida do Lab nunca o preencheu (D119 a D121). Corrige o LAB-17, o LAB-23 e a D101 |
| [`relatorios/LAB-29.md`](relatorios/LAB-29.md) | **A identidade que viaja no contrato** (LAB-29): `motor-testfit` era o nome do repositório e `T00-A` o de um prompt meu — agora as duas são importadas do motor, e `archilly.origem` passa a ser o campo de quem RODOU (D117, D118) |
| [`provas/LEIA-ME.md`](provas/LEIA-ME.md) | **Como ler as provas**, e o aviso de que arquivos anteriores ao LAB-29 trazem etiqueta do Lab em `motor.versao` — com o que cada uma queria dizer |
| [`relatorios/LAB-28.md`](relatorios/LAB-28.md) | **A sensibilidade ao acesso** (LAB-28): o mesmo programa, no mesmo terreno, varia **até +108 % em lotes** só mudando por onde a rua entra — e a manchete *"a entrada pesa mais que o motor"*, que vale em 2 das 5 glebas e não em todas (D113 a D115) |
| [`relatorios/LAB-27.md`](relatorios/LAB-27.md) | **O documento vivo, 1ª atualização** (LAB-27): os dois achados do LAB-26 que são sobre o motor do vizinho — a ficha do Lab dizendo para fora que ele ignora o acesso, e a identidade que ele publica e a ponte ignora — mais a regra do contínuo (D111) |
| [`relatorios/LAB-26.md`](relatorios/LAB-26.md) | **A varredura das capacidades** (LAB-26): três campos sem experimento, a declaração falsa num deles (`respeitaAcesso`, 703 → 603 lotes) — e a suíte do pacote `testfit` **vermelha há duas semanas**, calando as travas do D98 e do D104 (D108 a D110) |
| [`relatorios/LAB-25.md`](relatorios/LAB-25.md) | **A guarda que impede a quarta vez** (LAB-25): o teste que reprova quando a ponte do Lab descarta campo que o motor publica — e que achou a quarta vez na primeira rodada, em 110 de 110 lotes (D104 a D107) |
| [`relatorios/LAB-23.md`](relatorios/LAB-23.md) | **A via desenhada como coluna vertebral**: provado por diferença que os quatro a ignoram, e uma reta geométrica cega para o relevo batendo os quatro no pior trecho do terreno real |
| [`O_QUE_FALTA_MEDIR_POR_MOTOR.md`](O_QUE_FALTA_MEDIR_POR_MOTOR.md) | **A lista, motor por motor, do que falta medir** (LAB-22) — escrita para o chat levar ao Generate e ao Laboratório de Parcelamento |
| [`relatorios/LAB-22.md`](relatorios/LAB-22.md) | **A lacuna que era minha**: o Parcelamento mede a rampa desde 14/09 e a minha ponte jogava fora. Mais os dois motores que reportam errado em direções opostas, e a capacidade que envelheceu sozinha |
| [`relatorios/LAB-24.md`](relatorios/LAB-24.md) | **O bloco de indicadores de terreno**: 30 % no lote reprova, 15 % na rua só avisa — e os dois indicadores ordenam os motores ao contrário. Mais o formato proposto ao Generate e ao Orçamento |
| [`relatorios/LAB-21.md`](relatorios/LAB-21.md) | **A rampa, trecho e cruzamento** — e a correção dos 161,38 %: o número do LAB-18 era a discretização do motor, não o greide da rua. Mais as duas réguas, os três defeitos da minha própria e a coluna na página do Jonny |
| [`relatorios/LAB-18.md`](relatorios/LAB-18.md) | **O contrato v2, revendorizado**: o pico de rampa que passou a viajar (161 % contra 24 % de média), os dois achados do Lab que o Generate consertou, e por que a área vendável que as candidatas dele "perderam" é melhoria |
| [`COMPARACAO_DOS_MOTORES.md`](COMPARACAO_DOS_MOTORES.md) | **A comparação numa página, para quem não programa** (LAB-20): quatro motores, cinco terrenos, lado a lado. **Gerada por medição**, com teste que reprova se envelhecer |
| [`relatorios/LAB-20.md`](relatorios/LAB-20.md) | **Por que a página é Markdown e não HTML**, por que é gerada, e o defeito de legibilidade que a primeira versão tinha |
| [`relatorios/LAB-19.md`](relatorios/LAB-19.md) | **A regra de forma do chat na tabela**: útil < 85 % é "a conferir", < 70 % é "ruim" — três motores sem problema de forma, e o Symbios com um terço dos lotes na faixa do meio |
| [`relatorios/LAB-16.md`](relatorios/LAB-16.md) | **A régua de forma**: o que já estava consertado desde o LAB-13, e os três defeitos que sobravam — o corte inventado, a palavra "irregular" que é veredito de urbanista, e o arco de testada curva achatado em reta |
| [`relatorios/LAB-17.md`](relatorios/LAB-17.md) | **A via desenhada à mão**: duas glebas de referência, os quatro motores contra o traçado imposto (10,1 % a 30,7 % de aderência), e a **D69 aplicada** — com as duas metades dela que o contrato v1 não deixa verificar |
| [`CONTRATO_MOTOR_UNIFICADO_v1.md`](CONTRATO_MOTOR_UNIFICADO_v1.md) | **A porta única**: o que qualquer motor precisa cumprir para rodar sob a tela comum. Vai ao Generate pelo chat |
| [`relatorios/LAB-14.md`](relatorios/LAB-14.md) | **A porta, provada**: os quatro motores a implementam, e cada capacidade declarada é desmentida por medição se for falsa |
| [`relatorios/LAB-13.md`](relatorios/LAB-13.md) | **Três motores, cinco glebas, uma régua só**: a tabela que serve de base para a tela unificada |
| [`relatorios/LF-FINAL-2.md`](relatorios/LF-FINAL-2.md) | **A conferência, segunda volta**: o desvio do §9.3 consertado, e a regra do RECADO que era quebrada em 7 de 8 |
| [`relatorios/LAB-05.md`](relatorios/LAB-05.md) | **Recortar a quadra e descartar a lasca**: zero quadra além da divisa, 1 014 lotes, e a APP que separa a gleba em duas |
| [`relatorios/LAB-04.md`](relatorios/LAB-04.md) | **O Symbios passa a fazer lote**: o esqueleto reto contra o oráculo, os 213 e os 901 lotes, e as quatro correções que o Validator cobrou |
| [`relatorios/LF-FINAL.md`](relatorios/LF-FINAL.md) | **A conferência contra o Padrão da família**: o que faltava, a ressalva do núcleo, e por que a 1.2 não pôde ser usada |
| [`relatorios/LAB-08.md`](relatorios/LAB-08.md) | **Os dois motores lado a lado**: a tabela, o veredito por motor, e por que os "22 % a menos de lotes" não são comparáveis |
| [`relatorios/LAB-03.md`](relatorios/LAB-03.md) | **O relevo**: o que a interpolação faz com o traçado (e não com a rampa), e as glebas-padrão com relevo |
| [`relatorios/LAB-02.md`](relatorios/LAB-02.md) | **O recorte** pela gleba e pelas restrições: 0 % de via fora da divisa, o custo em conectividade, e a descoberta de que ninguém confere a rampa |
| [`relatorios/LF-01.md`](relatorios/LF-01.md) | A casa em ordem, e a fila autônoma |
| [`relatorios/LAB-07.md`](relatorios/LAB-07.md) | **O motor de parcelamento na esteira**: veredito, violações por partido, perdas na ida e na volta |
| [`relatorios/LAB01_ADAPTADOR.md`](relatorios/LAB01_ADAPTADOR.md) | **O adaptador do Symbios**: ida e volta georreferenciada, determinismo, rampa, quadras, escala |
| [`provas/`](provas/) | **Os números crus**, em JSON, por prompt — gleba, motor, semente e versão do contrato em cada arquivo |
| [`contratos/saidas/`](contratos/saidas/) | As SAÍDAS dos dois motores no contrato v1, prontas para o Generate julgar por conta própria |

## A casa em ordem (Padrão Archilly)

| documento | o que responde |
|---|---|
| [`relatorios/LF-FINAL.md`](relatorios/LF-FINAL.md) | **Estamos seguindo as regras da família?** Seção por seção, com o comando de prova |
| [`SEGURANCA.md`](SEGURANCA.md) | A lista do Padrão de Segurança, preenchida **com o comando ao lado de cada linha** |
| [`ADOCAO_CENTRAL.md`](ADOCAO_CENTRAL.md) | Por que o Lab **não** adota a Central, item a item — e o que mudaria se adotasse |
| [`referencia/PADRAO_ARCHILLY.md`](referencia/PADRAO_ARCHILLY.md) | O Padrão contra o qual a conferência foi feita (Versão 1, cópia trazida) |

## A triagem dos motores

| documento | o que responde |
|---|---|
| [`TRIAGEM.md`](TRIAGEM.md) | **Qual motor segue e qual não** — tabela comparativa e veredito, com evidência |
| [`SYMBIOS_ANALYSIS.md`](SYMBIOS_ANALYSIS.md) | Symbios Tensor: licença, desempenho, WASM, e o "não consegui compilar" registrado (§10) |
| [`STRAIGHT_SKELETON_ANALYSIS.md`](STRAIGHT_SKELETON_ANALYSIS.md) | As duas implementações, a licença copyleft que as impede, e o **oráculo** com que o LAB-04 provou a reimplementação |
| [`PACKINGSOLVER_TRIAGEM.md`](PACKINGSOLVER_TRIAGEM.md) | Por que ele fica como referência e não entra |

## Os terrenos

| onde | o que tem |
|---|---|
| [`terrenos/`](terrenos/) | Os 4 terrenos no contrato `archilly-terreno` 1.1, com procedência declarada |
| [`fixtures/glebas-padrao-com-relevo/`](fixtures/glebas-padrao-com-relevo/) | As duas glebas-padrão do Generate **com relevo sintético declarado** (LAB-03) — poligonal e parâmetros dele, intocados |
| [`fixtures/glebas-com-via-desenhada/`](fixtures/glebas-com-via-desenhada/) | As duas glebas de referência **com via principal e secundárias desenhadas à mão** (LAB-17). O traçado é geométrico, **não é projeto de urbanismo** (D73) |

## O código

| onde | o que tem |
|---|---|
| [`../external-engines/symbios/`](../external-engines/symbios/) | `upstream/` intocado, a ponte Rust → WASM, o adaptador do LAB-01, o recorte do LAB-02 e o **recortador de polígono** do LAB-05 (D57) |
| [`../external-engines/esteira/src/acesso.ts`](../external-engines/esteira/src/acesso.ts) | **A régua do acesso** (LAB-28): seis pontos por **comprimento de arco** no perímetro, a amplitude sobre o mínimo, e a ressalva de que ela é um **piso** viajando no próprio objeto (D113) |
| [`../external-engines/conferir.sh`](../external-engines/conferir.sh) | **O ÚNICO "verde"** (LAB-31): `typecheck`, `lint` e `test` nos dois pacotes **mais a prova no navegador** — sete passos, e duas guardas antes: ele **descobre** todo `package.json` e reprova se achar um fora da lista (D122), e precondição que falta é **falha com a receita**, nunca "pulado" (D124) |
| [`../external-engines/esteira/tests/coluna-vertebral.test.ts`](../external-engines/esteira/tests/coluna-vertebral.test.ts) | **A trava da via desenhada, refeita** (LAB-33): os motores rodam aqui, três travas medem **a ponte** sem motor no meio, e o `JSON` da prova só serve para acusar que envelheceu |
| [`../external-engines/esteira/tests/alinhamento.test.ts`](../external-engines/esteira/tests/alinhamento.test.ts) | **As travas do alinhamento** (LAB-32): as duas réguas novas, a queda decomposta no mesmo partido, e o par que impede a sexta repetição — o lote **em cima** da faixa (invasor) e o lote **defronte** (não) |
| [`../external-engines/esteira/tests/verde.test.ts`](../external-engines/esteira/tests/verde.test.ts) | **A guarda da guarda**: seis travas que leem o próprio `conferir.sh` — para que ninguém "simplifique" o script e desfaça o LAB-31 sem que nada acuse |
| [`../external-engines/symbios/adapter/ferramentas/navegador/prova-automatica.ts`](../external-engines/symbios/adapter/ferramentas/navegador/prova-automatica.ts) | **A prova no navegador, sem olho humano** (LAB-31): Chromium do Playwright, `window.__prova` como dado, comparada com os números de 10/09/2026 (D123) |
| [`../external-engines/esteira/src/guarda-da-ida.ts`](../external-engines/esteira/src/guarda-da-ida.ts) | **A guarda da IDA** (LAB-30): contrato → motor. Quatro regras, e a quarta é a **dívida declarada** — *"o motor tem onde receber e eu ainda não entrego"*, que não reprova e é publicada (D121) |
| [`../external-engines/esteira/src/porta/experimentos.ts`](../external-engines/esteira/src/porta/experimentos.ts) | **Um experimento por capacidade** (LAB-26): a cobertura de cada campo de `Capacidades`, com o nome do teste que o desmente — e dois testes de varredura que exigem cobertura e existência (D108) |
| [`../external-engines/esteira/src/guarda-da-ponte.ts`](../external-engines/esteira/src/guarda-da-ponte.ts) | **A guarda da ponte** (LAB-25): três regras conferidas contra o motor rodando — `campo-vazio` e `campo-novo` reprovam, `mapa-velho` avisa. A primeira **não acredita no inventário**, casa por nome (D105) |
| [`../external-engines/esteira/src/inventario-das-pontes.ts`](../external-engines/esteira/src/inventario-das-pontes.ts) | **O destino de cada campo que os motores publicam** (LAB-25): `atravessa`, `traduzido`, `perda` com motivo, ou `interno`. É a justificativa que antes morava em comentário — e comentário não se revalida |
| [`../external-engines/esteira/src/terreno-indicadores.ts`](../external-engines/esteira/src/terreno-indicadores.ts) | **O bloco de terreno** (LAB-24): os dois limites do Jonny com as fontes, a declividade medida nas duas direções, e **nenhum veredito na via** — só no lote, porque lá é lei (D95) |
| [`../external-engines/esteira/src/rampa.ts`](../external-engines/esteira/src/rampa.ts) | **A régua de rampa** (LAB-21): caminha a via por comprimento de arco, acha cruzamento por interseção de eixos, e publica quatro cortes de leitura — nenhum deles limite legal, porque esse limite não existe (D91) |
| [`../external-engines/esteira/src/forma.ts`](../external-engines/esteira/src/forma.ts) | **A régua de forma do lote** (LAB-16): perfil por lote, lados, arco, classe, e a distribuição nos três cortes declarados. Ela mede; quem lê decide (D76, D77) |
| [`../external-engines/testfit/`](../external-engines/testfit/) | O adaptador do LAB-07 — ida, volta, aparo, esteira. Sem `upstream/`: o motor é da família (D16) |
| [`../external-engines/esteira/`](../external-engines/esteira/) | **A esteira cruzada**: põe qualquer motor no contrato v1 e o julga com a régua do Generate (D31). Desde o LAB-04, também o **esqueleto reto** que faz a quadra virar lote (D50) |
| [`../outputs/`](../outputs/) | Saídas literais das execuções do LAB-01 |

## A família Archilly

O **Geo** (`urban-scout-tool`) capta o terreno · o **Generate**
(`urban-create-hub-41d93a4d`) gera, **valida e julga** · o **Laboratório de
Parcelamento** (`motor-testfit`) gera ao vivo na tela · **este Lab** testa
motores candidatos e os põe na esteira do Generate.

Os três vizinhos são clonados **somente para leitura**. O que precisa mudar
neles vira lista numerada em relatório e vai pelo chat — nunca por commit lá.
