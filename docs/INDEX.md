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
| [`prompts/FILA.md`](prompts/FILA.md) | **O que vem a seguir** — e, hoje, por que a fila acabou |
| [`DECISOES.md`](DECISOES.md) | Por que a casa é assim. 60 decisões numeradas, com o que se perde em cada uma |
| [`PENDENCIAS_JONNY.md`](PENDENCIAS_JONNY.md) | O que depende de uma pessoa. Quem escreve sou eu; quem risca é ele. Hoje: **pode haver travessia sobre a APP de Antonina?** |
| [`relatorios/RECADOS.md`](relatorios/RECADOS.md) | **Todos os recados para o chat**, em ordem, um por prompt |

## As medições — um relatório por prompt

| documento | o que responde |
|---|---|
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

## O código

| onde | o que tem |
|---|---|
| [`../external-engines/symbios/`](../external-engines/symbios/) | `upstream/` intocado, a ponte Rust → WASM, o adaptador do LAB-01, o recorte do LAB-02 e o **recortador de polígono** do LAB-05 (D57) |
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
