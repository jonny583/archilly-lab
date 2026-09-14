# ÍNDICE — Archilly Lab

Mapa dos documentos deste repositório. Se você não sabe por onde começar,
comece pela primeira linha da primeira tabela.

---

## Começar por aqui

| documento | o que responde |
|---|---|
| [`ONDE_PARAMOS.md`](ONDE_PARAMOS.md) | **Onde estamos hoje**, o que a última rodada entregou e o que ficou esperando |
| [`../CLAUDE.md`](../CLAUDE.md) | As regras permanentes de quem trabalha neste repositório — e a regra do RECADO |
| [`LABORATORIO.md`](LABORATORIO.md) | **O que é este laboratório**: a especificação, Etapas A a G, como chegou |
| [`../README.md`](../README.md) | A regra de ouro (`upstream` → `archilly` → `adapter`) e a estrutura da casa |

## Decisão e fila

| documento | o que responde |
|---|---|
| [`prompts/FILA.md`](prompts/FILA.md) | **O que vem a seguir** — LF-01, LAB-02, LAB-03, LAB-08, LF-FINAL — e como o laço autônomo funciona |
| [`DECISOES.md`](DECISOES.md) | Por que a casa é assim. Decisões numeradas, com o que se perde em cada uma |
| [`PENDENCIAS_JONNY.md`](PENDENCIAS_JONNY.md) | O que depende de uma pessoa. Quem escreve sou eu; quem risca é ele |
| [`relatorios/RECADOS.md`](relatorios/RECADOS.md) | **Todos os recados para o chat**, em ordem, um por prompt |

## As medições

| documento | o que responde |
|---|---|
| [`relatorios/LAB-07.md`](relatorios/LAB-07.md) | **O motor do Testfit na esteira**: veredito, violações por partido, perdas na ida e na volta, a lista para o T02, o diagnóstico do relevo |
| [`relatorios/LAB-08.md`](relatorios/LAB-08.md) | **Os dois motores lado a lado**: a tabela, o veredito por motor, e por que os "22 % a menos de lotes" não são comparáveis |
| [`relatorios/LAB-03.md`](relatorios/LAB-03.md) | **O relevo**: o que a interpolação faz com o traçado (não com a rampa), e as glebas-padrão do Generate com relevo |
| [`relatorios/LAB-02.md`](relatorios/LAB-02.md) | **O recorte pela gleba e pelas restrições**: 0 % de via fora da divisa, o custo em conectividade, e a descoberta de que ninguém confere a rampa |
| [`relatorios/LAB01_ADAPTADOR.md`](relatorios/LAB01_ADAPTADOR.md) | **O adaptador do Symbios**: ida e volta georreferenciada, determinismo, rampa, quadras, escala |
| [`relatorios/LF-01.md`](relatorios/LF-01.md) | A casa em ordem: a fila autônoma, o despertador, e o que o chat decidiu |
| [`provas/`](provas/) | **Os números crus**, em JSON, por prompt — gleba, motor, semente e versão do contrato em cada arquivo |
| [`terrenos/`](terrenos/) | Os 4 terrenos no contrato `archilly-terreno` 1.1, com procedência declarada |
| [`contratos/saidas/`](contratos/saidas/) | As SAÍDAS dos dois motores no contrato v1, prontas para o Generate julgar por conta própria (LAB-08) |
| [`fixtures/glebas-padrao-com-relevo/`](fixtures/glebas-padrao-com-relevo/) | As duas glebas-padrão do Generate **com relevo sintético declarado** (LAB-03) — poligonal e parâmetros dele, intocados |

## A triagem dos motores

| documento | o que responde |
|---|---|
| [`TRIAGEM.md`](TRIAGEM.md) | **Qual motor segue e qual não** — tabela comparativa e veredito, com evidência |
| [`SYMBIOS_ANALYSIS.md`](SYMBIOS_ANALYSIS.md) | Symbios Tensor: licença, desempenho, WASM, e o "não consegui compilar" registrado (§10) |
| [`STRAIGHT_SKELETON_ANALYSIS.md`](STRAIGHT_SKELETON_ANALYSIS.md) | As duas implementações, a licença copyleft que as impede, e os casos de teste para reimplementar |
| [`PACKINGSOLVER_TRIAGEM.md`](PACKINGSOLVER_TRIAGEM.md) | Por que ele fica como referência e não entra |

## O código

| onde | o que tem |
|---|---|
| [`../external-engines/symbios/`](../external-engines/symbios/) | `upstream/` intocado, a ponte Rust → WASM, e **o adaptador do LAB-01** |
| [`../external-engines/testfit/`](../external-engines/testfit/) | **O adaptador do LAB-07** — ida, volta, aparo, esteira — e as ferramentas de medição. Sem `upstream/`: o motor é da família (D16) |
| [`../external-engines/esteira/`](../external-engines/esteira/) | **A esteira cruzada** (LAB-02): põe qualquer motor no contrato v1 e o julga com a régua do Generate. Casa do LAB-08 (D31) |
| [`../outputs/`](../outputs/) | Saídas literais das execuções do LAB-01 |

## A família Archilly

O **Geo** (`urban-scout-tool`) capta o terreno · o **Generate**
(`urban-create-hub-41d93a4d`) gera, **valida e julga** · o **Laboratório de
Parcelamento** (`motor-testfit`) gera ao vivo na tela · **este Lab** testa
motores candidatos e os põe na esteira do Generate.

Os três vizinhos são clonados **somente para leitura**. O que precisa mudar
neles vira lista numerada em relatório e vai pelo chat — nunca por commit lá.
