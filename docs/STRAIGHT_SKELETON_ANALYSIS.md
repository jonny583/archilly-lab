# STRAIGHT SKELETON (ESQUELETO RETO) — ANÁLISE (LAB-00, Etapa A + prova mínima)

**Data:** 09/09/2026 · **Status:** investigação concluída
**Veredito:** REFERÊNCIA APENAS para as duas implementações · **Recomendação: reimplementar em TypeScript**

---

## 1. Correção de premissa

O nome `grassfire4j` não corresponde a projeto existente — confirmado. A
linhagem real é o **grassfire** (Python, MIT, bmmeijers) e sua reescrita
`grassfire2`, que são implementações de pesquisa em Python e portanto fora de
alcance para um aplicativo de navegador em TypeScript. Foram avaliadas as duas
implementações indicadas no prompt.

## 2. Para que o Archilly quer isto

O esqueleto reto resolve dois problemas que o Generate tem hoje:

- **Offset consistente para dentro de um polígono.** Recuo de APP, faixa não
  edificável, recuo frontal — offsets que se comportam corretamente em cantos
  reflexos e que se auto-resolvem quando o polígono colapsa. Buffer ingênuo
  produz auto-interseção; esqueleto reto não.
- **Subdivisão de quadra.** O esqueleto dá o eixo medial e a partição da quadra
  em uma face por aresta de rua — a estrutura natural para dividir uma quadra em
  faixas de lotes com frente para cada via.

## 3. Candidato A — StrandedKitty/straight-skeleton (CGAL via WebAssembly)

```text
Repositório:  https://github.com/StrandedKitty/straight-skeleton
Versão:       3.0.0
Commit:       d68f08ad2da5eea7f58d451a94068d39cd2b3796 (2026-03-24)
Licença do invólucro: MIT (Copyright 2021-2023 StrandedKitty)
Licença efetiva:      GPL v3 ou posterior  ← ver 3.1
```

### 3.1 Licença — o achado que decide

O `LICENSE` do repositório diz MIT, e isso é verdade **apenas para o invólucro
TypeScript**. O que faz o trabalho é a CGAL, compilada para WebAssembly. O
`src/core/main.cpp` inclui:

```cpp
#include <CGAL/create_straight_skeleton_from_polygon_with_holes_2.h>
#include <CGAL/Straight_skeleton_2/IO/print.h>
```

A CGAL é dual-licenciada por pacote: o núcleo é LGPL, mas os pacotes
algorítmicos são GPL. Consultado o arquivo de licença do próprio pacote na
versão usada (`CGAL 5.6`, fixada em `src/core/install_libraries.sh`):

```text
https://raw.githubusercontent.com/CGAL/cgal/v5.6/Straight_skeleton_2/package_info/Straight_skeleton_2/license.txt
→ "GPL (v3 or later)"
```

O artefato distribuído (`src/core/build/main.js`, 1,05 MB com o `.wasm`
embutido em base64) é **obra derivada de código GPLv3**. Um invólucro MIT não
relicencia o que ele envolve. Distribuir o Archilly Generate com esse `.wasm`
sujeitaria a aplicação inteira à GPLv3 — código-fonte aberto para os usuários.

O `install_libraries.sh` ainda baixa **GMP 6.2.1** (LGPLv3/GPLv2, dual) e
**MPFR 4.2.0** (LGPLv3), além do Boost 1.81 (permissivo). GMP e MPFR são LGPL —
gerenciáveis isoladamente, mas irrelevantes: a GPL da CGAL já é terminal.

**Isto inviabiliza o uso comercial em produto proprietário. Resposta direta à
pergunta do prompt: sim, inviabiliza.**

### 3.2 Execução — prova mínima

O módulo é compilado com `-s ENVIRONMENT='web'`, então recusa Node:

```text
Error: not compiled for this environment (did you build to HTML and try to run
it not on the web, or set ENVIRONMENT to something - like node - ...)
```

Como também usa `-s SINGLE_FILE` (o `.wasm` vai embutido, sem `fetch`), bastou
fornecer os globais de navegador (`window`, `self`, `document`, `location`).
**Segunda tentativa: sucesso.** Saída completa em
`outputs/straight_skeleton_cgal_wasm.txt`.

```text
--- RETANGULO 60x30 --- (11.378 ms)
  vertices [x, y, time]:
    0: [0, 0, 0]   1: [60, 0, 0]   2: [60, 30, 0]   3: [0, 30, 0]
    4: [15, 15, 15]                5: [45, 15, 15]
  polygons: [0,4,3] [1,5,4,0] [2,5,1] [3,4,5,2]

--- POLIGONO EM L (60x60 rec. 30x30) --- (3.490 ms)
  vertices: ... 6: [45, 15, 15]  7: [15, 15, 15]  8: [15, 45, 15]
  polygons: [0,7,8,5] [1,6,7,0] [2,6,1] [3,7,6,2] [4,8,7,3] [5,8,4]
```

Geometricamente correto nos dois casos.

### 3.3 Entrada e saída

- **Entrada:** anéis de pontos ou `GeoJSON.Polygon`. Exigências rígidas: anel
  externo em sentido anti-horário, furos em horário, todos fracamente simples,
  primeiro vértice repetido no fim. Coordenadas são serializadas como `f32`.
- **Saída:** `{ vertices: [x, y, time][], polygons: number[][] }`. O `time` é a
  distância de offset em que o vértice nasce — é ele que dá o offset paramétrico
  de graça. `polygons` é uma face por aresta de entrada, por índices.
- **Erro:** retorna `null` (sem diagnóstico).

### 3.4 Atividade

Último commit em 2026-03-24 (a release 3.0.0). Projeto estável, de autor único,
baixa movimentação — o que para um invólucro de biblioteca madura é aceitável.

## 4. Candidato B — lizelive/straight-skeleton (crate Rust)

```text
Repositório:  https://github.com/lizelive/straight-skeleton
Versão:       0.2.1
Commit:       7ca4b0f563e9d8bb9cc306dd81192a51a4243286 (2026-07-17)
Licença:      GPL-2.0-or-later   ← declarada no próprio Cargo.toml
```

### 4.1 Licença — também bloqueia

`Cargo.toml` traz `license = "GPL-2.0-or-later"` e o `LICENSE` é a GPLv2
completa. Sem exceção de vinculação. Compilado para WebAssembly e distribuído
com o Generate, contamina a aplicação. **Bloqueia uso comercial proprietário
tanto quanto o candidato A.**

Ironia útil de registrar: as duas implementações disponíveis para navegador são
copyleft, por caminhos independentes.

### 4.2 Qualidade técnica — a melhor coisa vista nesta investigação

Sem dependências obrigatórias, `no_std`, `unsafe_code = "forbid"`. Aritmética
inteira exata: entrada e saída em `i16`, tudo intermediário em `i32`/`f32`, sem
`f64`. Custa **um bit de alcance** — coordenadas travadas em `-16384..=16383`,
porque o determinante de orientação precisa de `2·d²` cabendo em `i32` — e
compra predicados geométricos **exatos**: sem epsilon, sem arredondamento, sem
overflow. O `docs/DESIGN.md` traz a análise completa, e os testes fixam um
triplo real dentro do limite onde `f32` chama uma curva genuína de colinear.

Recursos além do esqueleto básico: `skeleton_constrained` com limite de
distância **por aresta**; `residual()`, que devolve o contorno onde a frente de
onda parou — isto é, o polígono deslocado para dentro, que é exatamente o offset
que o Archilly quer; rastreabilidade nativa (`arc.sources` dá as duas arestas de
entrada que geraram cada arco, como campo, não como busca por proximidade);
furos sem caso especial; e um módulo `Roof` (irrelevante para o Archilly).

### 4.3 Execução — prova mínima

Saída completa em `outputs/straight_skeleton_rust.txt`.

```text
--- RETÂNGULO 60x30 ---
  skeleton OK em 14.551µs   nós=6 arcos=5
    nó 4: pos=(45,15) offset=15.000 boundary=false
    nó 5: pos=(15,15) offset=15.000 boundary=false
    arco 0: sources=[EdgeId(0), EdgeId(1)] ...
  offset interno 5 u: residual loops=1
    residual 0: [(5, 5), (55, 5), (55, 25), (5, 25)]

--- POLÍGONO EM L (60x60 com recorte 30x30) ---
  skeleton OK em 8.82µs     nós=9 arcos=8
    nó 6: (45,15) nó 7: (15,15) nó 8: (15,45), todos offset=15.000
  offset interno 5 u: residual loops=1
    residual 0: [(5, 5), (55, 5), (55, 25), (25, 25), (25, 55), (5, 55)]

--- TESTE DE LIMITE DE COORDENADAS ---
  16000x8000 aceito; skeleton: Ok(5)
```

O offset interno de 5 unidades no L devolve **exatamente** o polígono esperado,
com o canto reflexo tratado corretamente — que é o caso em que buffer ingênuo
falha. É o comportamento que o Archilly precisa para recuos.

### 4.4 Validação cruzada

As duas implementações concordam: retângulo 60×30 → nós internos em (15,15) e
(45,15) com offset 15; L → mais um nó em (15,45). Geometria idêntica, obtida por
algoritmos e linguagens independentes. Isso valida os dois resultados e, mais
útil, **dá um caso de teste de referência verificado** para qualquer
reimplementação futura.

### 4.5 Desempenho

| | retângulo | L |
|---|---|---|
| Rust nativo (lizelive) | 14,6 µs | 8,8 µs |
| CGAL/WASM (StrandedKitty) | 11,4 ms* | 3,5 ms |

*primeira chamada, inclui aquecimento. A diferença de ~400× é esperada: o
caminho CGAL cruza a fronteira WASM e usa um kernel muito mais pesado. Ambos são
irrelevantemente rápidos para o volume do Archilly (dezenas a centenas de
quadras).

### 4.6 Limitação real, além da licença

O reticulado `i16` com teto de ±16 384 significa **coordenadas inteiras**. Num
loteamento em metros com origem local isso dá alcance de 32 km e resolução de
1 m — alcance de sobra, resolução insuficiente. Trabalhar em centímetros dá
resolução de 1 cm e alcance de 327 m — resolução boa, alcance curto demais para
uma gleba grande. Ou seja: seria preciso escolher a escala por projeto, ou
particionar. É um atrito genuíno de integração, não um impedimento.

## 5. Comparação e recomendação

| | StrandedKitty (CGAL/WASM) | lizelive (Rust) | Reimplementar em TS |
|---|---|---|---|
| Licença | **GPLv3+** (bloqueia) | **GPLv2+** (bloqueia) | **livre — nossa** |
| Roda no navegador | sim (WASM 1,05 MB) | sim (via WASM) | sim, nativo |
| Precisão | `f32`, kernel CGAL | inteira exata | escolha nossa |
| Alcance de coordenadas | irrestrito | ±16 384 inteiros | irrestrito |
| Offset por aresta | não | sim | a implementar |
| Furos | sim | sim | a implementar |
| Robustez | alta (CGAL) | alta (predicados exatos) | **o risco** |
| Esforço | baixo | baixo | médio-alto |

### Recomendação fundamentada: **reimplementar em TypeScript.**

O motivo é único e não é técnico: **as duas implementações disponíveis são
copyleft**, por caminhos independentes, e o Generate é um produto proprietário
de navegador. Não há terceira opção pronta que sirva. Adotar qualquer uma delas
significaria abrir o código do Generate.

O que torna a reimplementação razoável em vez de temerária:

1. **O algoritmo é da literatura, não de nenhum destes repositórios.** Felkel &
   Obdržálek (1998) para a construção por frente de onda; Aichholzer, Aurenhammer,
   Alberts & Gärtner (1995) para a definição e as propriedades; Aichholzer &
   Aurenhammer (1996) para o tratamento de polígonos com furos. Implementar a
   partir dos artigos não toca no código GPL e não cria obra derivada.
2. **O escopo do Archilly é modesto.** Quadras de loteamento são polígonos de
   dezenas de vértices, quase sempre convexos ou com poucos cantos reflexos.
   Não é preciso a robustez industrial da CGAL para polígonos patológicos.
3. **Já existe um oráculo.** A seção 4.4 deu dois casos verificados por duas
   implementações independentes. A reimplementação nasce com teste de aceitação.
4. **A precisão é escolha nossa.** Sem herdar nem o teto de `i16` do candidato B
   nem o peso de 1 MB do candidato A.

**O risco honesto:** o esqueleto reto é notoriamente sensível a degenerescências
— eventos simultâneos, vértices quase colineares, arestas quase paralelas. Uma
implementação ingênua funciona nos testes e falha em produção. O candidato B
gastou seu projeto inteiro nesse problema, e o `docs/DESIGN.md` dele é leitura
obrigatória antes de começar (ler documentação de projeto GPL não contamina
nada). Se a reimplementação se mostrar cara demais, a alternativa é isolar o
esqueleto reto num **serviço de servidor** — onde a GPL só obriga a abrir o
serviço, não o Generate — mas isso contradiz a arquitetura de navegador e só
deve ser considerado como último recurso.

**Ambos os repositórios: REFERÊNCIA APENAS.** Nenhum entra no produto. O valor
que eles entregaram a este laboratório foi o diagnóstico de licença, dois casos
de teste verificados e, no caso do candidato B, um documento de projeto que
explica onde o algoritmo quebra.

## 6. Proposta de Adapter (uma página, sem código)

Não haverá Adapter para motor externo aqui — não há motor externo a adaptar. O
que haverá, se a Etapa B/C for aprovada, é um **módulo geométrico interno** do
Archilly. Registrado aqui porque o contrato é o mesmo, e é isto que um prompt
futuro deve implementar.

**Entrada.** Polígono da quadra no CRS do projeto: anel externo mais furos,
coordenadas em `number` (ponto flutuante, sem reticulado). Orientação
normalizada pelo próprio módulo — externo anti-horário, furos horário — em vez
de exigida do chamador, que é onde o candidato A erra a ergonomia.
Opcionalmente, um limite de offset por aresta, para o caso "recuo frontal de
5 m na via, 3 m nas divisas".

**Saída.** Um grafo: nós com `{ posição, offset }` e arcos com
`{ nós, arestas_de_origem }` — a rastreabilidade do candidato B é o detalhe de
projeto que mais vale copiar (como ideia, não como código): saber de qual via
cada face do esqueleto veio é o que permite atribuir testada a lote. Mais
`residual(limite)`, devolvendo o polígono deslocado para dentro, que é o que
90 % dos usos do Archilly de fato querem.

**Erros.** Polígono não simples, área nula, menos de três vértices, e
não-convergência da frente de onda. Nunca devolver geometria plausível e errada
— o candidato B acerta em recusar `RoofError::UnevenLimits` em vez de chutar, e
essa é a postura correta para um módulo que alimenta o Validator.

**Uso no Generate.** Duas frentes independentes: offsets de recuo e APP
(substituindo buffer ingênuo, que auto-intersecta), e subdivisão de quadra em
faixas de lotes com frente para cada via. A primeira é de baixo risco e valor
imediato; a segunda é a que compete com o parcelamento atual e precisa passar
pelo Judge antes de qualquer adoção.

**Testes obrigatórios de partida** — os dois casos já verificados nesta
investigação: retângulo 60×30 (nós internos em (15,15) e (45,15), offset 15) e
o L de 60×60 com recorte 30×30 (mais um nó em (15,45)), com o offset interno de
5 unidades devolvendo `[(5,5),(55,5),(55,25),(25,25),(25,55),(5,55)]`.
