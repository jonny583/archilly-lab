# SYMBIOS TENSOR — ANÁLISE (LAB-00, Etapa A + prova mínima)

**Data:** 09/09/2026 · **Status:** investigação concluída · **Veredito:** SEGUIR PARA ETAPA B/C, com escopo reduzido

---

## 1. Identificação e versionamento

```text
Engine:            Symbios Tensor (crate `symbios-tensor`)
Upstream:          https://github.com/TheJanusStream/symbios-tensor
Versão upstream:   0.4.1
Commit:            c3f287556b98cc616d4263d163e6643ae32111ff
Data do commit:    2026-09-06 20:14:40 +0200
Cópia local:       external-engines/symbios/upstream/ (intocada, byte a byte)
Archilly revision: LAB-00 (investigação)
Licença:           MIT
Adapter:           não escrito (fase futura)
Status:            Experimental
```

A cópia em `upstream/` foi verificada arquivo a arquivo contra o `HEAD` do clone
(`cmp` em todos os arquivos versionados): **idêntica**. O manifesto está em
`external-engines/symbios/upstream/VERSION`.

## 2. Licença

`LICENSE` na raiz: **MIT**, `Copyright (c) 2026 TheJanusStream`. Permite uso
comercial, modificação e redistribuição, exigindo apenas a preservação do aviso
de copyright e da licença.

Dependências diretas e suas licenças (todas permissivas, sem copyleft):

| Crate | Versão | Licença | Papel |
|---|---|---|---|
| `symbios-ground` | 0.4.1 | MIT (mesmo autor) | tipo `HeightMap` |
| `glam` | 0.32.1 | MIT/Apache-2.0 | `Vec2`/`Vec3` |
| `rand` + `rand_pcg` | 0.9 | MIT/Apache-2.0 | RNG determinístico |
| `serde` | 1.0 | MIT/Apache-2.0 | serialização |

Não há assets, dados ou arquivos sob licença distinta. Nada impede a cópia no
GitHub do Archilly nem o uso comercial. **Sem dúvida de licença.**

## 3. Arquitetura encontrada

Crate único (não é workspace), sem binários: é **biblioteca**. Não existe CLI e
não existe API HTTP — o consumo é por chamada de função Rust. `src/` tem 14
módulos; o pipeline é uma sequência de funções livres que operam sobre um
`RoadGraph` compartilhado.

```text
HeightMap ──generate_roads()──────────> RoadGraph (bruto)
              ──rationalize_graph()───> RoadGraph (retificado)
              ──extract_blocks()──────> RoadGraph.blocks: Vec<CityBlock>
              ──extract_lots()────────> Vec<BuildingLot>
              ──carve_roads/lots()────> HeightMap mutado + máscara
              ──prune_unused_roads()──> RoadGraph podado
              ──generate_road_meshes()> RoadMeshes (hubs/ribbons/skirts)
```

Módulos: `tensor` (campo tensorial a partir das normais do heightmap), `tracer`
(traçado de streamlines com RK2, ramificação, snap), `graph` (arena de nós,
arestas e quadras), `spatial` (hash espacial), `geometry` (primitivas),
`rationalize` (RDP, filetes de Bézier, suavização Laplaciana de cotas, clamp de
rampa), `topology` (cadeias e artérias), `polygons` (extração de faces),
`lots` (subdivisão), `carve` (terraplenagem), `prune` (Steiner), `roads_3d`
(malhas), `streaming` (mundos grandes por tiles).

### 3.1 Entradas

`HeightMap` (de `symbios-ground`): grade **regular** `width × height` com
`cell_size` uniforme. Mais quatro structs de configuração, todas `Serialize` +
`Deserialize` e todas com `Default`: `TensorConfig`, `RationalizeConfig`,
`LotConfig`, `RoadMeshConfig`.

**A entrada não tem polígono de gleba.** Não há limite de terreno, APP, faixa
não edificável, curso d'água (apenas um `water_level` escalar) nem qualquer
noção de legislação. O motor gera sobre o retângulo inteiro do heightmap.

### 3.2 Saídas — formato exato, medido

Tudo é `serde`, então a fronteira JSON sai de graça. Trechos **literais** da
execução (`outputs/symbios_probe.txt`):

```json
{"nodes":[{"position":[20.157005,18.426653],"elevation":11.245286,"edges":[0,9]}, ...],
 "edges":[{"start":0,"end":1,"road_type":"Major","active":true}, ...],
 "blocks":[{"perimeter":[12,45,88,...]}, ...]}
```

```json
[{"position":[38.203724,197.74484],"frontage_center":[41.455524,190.19473],
  "rotation":-2.7349083,"width":11.725103,"depth":10.441235,"is_shoreline":false}, ...]
```

- **Coordenadas:** `f32`, world-space, X/Z num sistema Y-up. Origem no canto do
  heightmap, unidades = `cell_size`. **Não há CRS, datum ou georreferência.** É
  um espaço local; o adaptador terá de fazer a transformação afim para o CRS do
  Archilly.
- **Rede viária:** grafo (`nodes`/`edges`), não polilinhas. Arestas carregam
  `active: bool` — **arestas inativas permanecem no vetor** após splits; quem
  consome precisa filtrar por `active`.
- **Quadras:** `CityBlock { perimeter: Vec<NodeId> }` — polígono fechado por
  índices de nós, sempre em sentido horário. É geometria aproveitável.
- **Lotes:** ver 3.3 — **não é polígono de lote.**

### 3.3 Achado crítico: `BuildingLot` não é lote

`BuildingLot` é `{ position, frontage_center, rotation, width, depth,
is_shoreline }` — um **retângulo rotacionado**. A documentação do upstream é
explícita: `min_width` = "Minimum **building** width", `front_setback` =
"Distance from street edge to **building** front".

Ou seja: o estágio 4 produz **pegadas de edificação já recuadas**, não parcelas
de terreno. Pior, lendo `src/lots.rs`: `extract_lots` internamente subdivide a
quadra em sub-polígonos (`subdivide_polygon`) e depois inscreve um retângulo em
cada um (`polygon_to_lot` → `inscribed_box` → `apply_setbacks`). **Os polígonos
das parcelas são calculados e descartados** — ambas as funções são privadas
(`fn`, não `pub fn`), e nada na API pública os expõe.

Para o Archilly, que precisa de **lote como polígono de terreno** (com testada,
área, acesso à via, matrícula), o estágio 4 do Symbios não serve como está.

## 4. Requisitos e comandos — o que foi realmente executado

```text
Ambiente:      Linux x86_64, container do laboratório
Toolchain:     rust-toolchain.toml fixa channel = "1.96.1" (baixado pelo rustup
               automaticamente; o rustc do ambiente era 1.94.1)
Edition:       2024
```

```shell
# 1. Clone (commit registrado acima)
git clone https://github.com/TheJanusStream/symbios-tensor.git

# 2. Compilação do exemplo canônico — 29,23 s a frio
cargo build --release --example full_city

# 3. Execução — sem nenhuma entrada do Archilly
./target/release/examples/full_city
```

Saída real da execução (heightmap 96×96, mundo 384×384 m):

```text
[1] Heightmap: 96×96 cells, world 384×384 (402.909µs)
[2] Tracer: 9825 nodes, 11338 edges (19.396289ms)
[3] Rationalize: 3764 active edges after smoothing (110.948001ms)
[4] Blocks: 1016 (2.144461ms)
[5] Lots: 61 (1.507121ms)
[6] Prune: 472 active edges after pruning (13.665195ms)
[7] Carve: heightmap flattened under network (795.526µs)
[8] Meshes: 5502 verts / 4494 triangles (491.773µs)
[9] Outputs written (3.754214ms)
--- Done in 153.456036ms ---
```

Artefatos gravados: `full_city_graph.ppm`, `full_city_roads.obj`,
`full_city_lots.svg` — cópias em `outputs/`. **TESTE 01 (execução): passa.**

Além do exemplo do upstream, foi escrito um arranjo de medição próprio em
`external-engines/symbios/archilly/probe/` (área de trabalho; o upstream não foi
tocado). Ele não converte dado nenhum do Archilly — só instrumenta o motor.
Saída completa em `outputs/symbios_probe.txt`.

```shell
cd external-engines/symbios/archilly/probe && cargo run --release
```

## 5. Determinismo — TESTE 08: passa

Duas execuções com `seed: 42`, heightmap 128×128, pipeline completo, comparando
o JSON serializado do grafo **e** dos lotes:

```text
seed=42 run1: grafo hash=d73908d6bc3b9af4 lotes hash=703933f25be2fe3d (25823 nós, 133 lotes)
seed=42 run2: grafo hash=d73908d6bc3b9af4 lotes hash=703933f25be2fe3d (25823 nós, 133 lotes)
seed=7  run3: grafo hash=f1bd8b32b934d550 lotes hash=bfed872a1ec2801d (26805 nós, 131 lotes)
```

Saída **byte a byte idêntica** para a mesma seed, e diferente para seed
diferente. Reprodutibilidade é real e a seed tem efeito.

## 6. Performance — TESTE 09

### 6.1 Por tamanho de grade (cell_size 4,0 fixo — o mundo cresce junto)

| grade | mundo | nós | arestas ativas | quadras | lotes | vias | racionalização | quadras | lotes | **TOTAL** |
|---|---|---|---|---|---|---|---|---|---|---|
| 128×128 | 512 m | 25 823 | 5 306 | 1 563 | 133 | 21,7 ms | 183,2 ms | 3,1 ms | 2,0 ms | **210 ms** |
| 256×256 | 1 024 m | 113 216 | 26 688 | 8 882 | 518 | 101,2 ms | 6 827 ms | 15,7 ms | 9,1 ms | **6,95 s** |
| 512×512 | 2 048 m | 467 271 | 117 278 | 40 683 | 1 963 | 443,2 ms | **128 333 ms** | 108,1 ms | 42,1 ms | **128,9 s** |

### 6.2 O custo é da EXTENSÃO, não da resolução (mundo fixo em 512 × 512 m)

| grade | célula | nós | lotes | vias | racionalização | TOTAL |
|---|---|---|---|---|---|---|
| 128×128 | 4,0 m | 25 823 | 133 | 21,4 ms | 219,2 ms | 245,7 ms |
| 256×256 | 2,0 m | 25 822 | 133 | 20,6 ms | 219,3 ms | 244,8 ms |
| 512×512 | 1,0 m | 25 816 | 131 | 20,6 ms | 216,1 ms | 241,7 ms |

Este é o resultado mais importante da seção. **Refinar o heightmap é grátis;
ampliar o mundo é caro.** Quadruplicar a área multiplica os nós por ~4,3 e o
tempo de `rationalize_graph` por ~20-30 — comportamento de ordem **O(N²)** na
contagem de nós. `rationalize_graph` responde por 87 % a 99,5 % do tempo total.

Consequência prática para o Generate (que roda no navegador): uma gleba de
até ~500 × 500 m (25 ha) fica em ~250 ms — perfeitamente viável. Uma gleba de
1 km² leva ~7 s — limítrofe, exige Web Worker. Acima disso, inviável no
navegador sem intervenção no motor.

## 7. Calibração: os defaults são de cidade de jogo, não de loteamento

Os defaults (`major_road_dist: 40`, `minor_road_dist: 15`) põem uma rua a cada
15 metros. O resultado é que "quadra" não significa quadra:

**Distribuição de área das 1 563 quadras extraídas (mundo 512 m, defaults):**

```text
p10=25,6  p25=54,0  p50=97,2  p75=196,0  p90=342,8  p99=657,9  max=2061,7  (m²)
  < 1 m² (sliver degenerado)             6 ( 0,4%)
  1–50 m² (abaixo do min_lot_area)     357 (22,8%)
  50–400 m² (uma edificação)          1089 (69,7%)
  400–2000 m² (subdivisível)           110 ( 7,0%)
  > 2000 m² (quadra de verdade)          1 ( 0,1%)
```

A quadra mediana tem **97 m²** — o tamanho de um lote, não de uma quadra. Só
0,4 % são slivers degenerados; o problema não é degeneração geométrica, é
**calibração**. Corrigindo o espaçamento para valores brasileiros:

| `major_road_dist` | `minor_road_dist` | quadras | área mediana | área p90 | TOTAL |
|---|---|---|---|---|---|
| 40 | 15 (default) | 1 563 | 97 m² | 343 m² | 224 ms |
| 120 | 50 | 150 | 778 m² | 2 976 m² | 16 ms |
| **200** | **80** | **24** | **3 439 m²** | **6 277 m²** | **6,0 ms** |
| 300 | 100 | 7 | 5 830 m² | 14 739 m² | 3,7 ms |

Com 200/80 saem 24 quadras de ~3 400 m² num terreno de 26 ha — geometria
plausível de loteamento, e **37× mais rápido** (6 ms). Isto reposiciona o
motor: bem calibrado, ele é rápido o suficiente para rodar interativamente.

Nesse regime a extração de lotes rende quase nada (1 a 4 "lotes" por rodada),
o que é coerente com o achado da seção 3.3 — `extract_lots` produz pegadas de
edificação, não parcelamento, e não é isso que o Archilly precisa.

## 8. Relevo — a limitação declarada pelo upstream, medida

O README do upstream avisa que terreno plano gera slivers degenerados. Medido
(128×128, mundo 512 m, amplitude vertical escalada):

| relevo | quadras | lotes | lotes/quadra |
|---|---|---|---|
| 0,00 (plano perfeito) | 485 | 506 | 1,04 |
| 0,25 | 1 569 | 136 | 0,09 |
| 1,00 | 1 563 | 133 | 0,09 |
| 4,00 | 1 561 | 133 | 0,09 |

O comportamento é **binário**, não gradual: qualquer relevo não trivial já leva
o traçador ao regime curvo, e a partir daí a amplitude não muda mais nada.
Também vale registrar o contrário do esperado: em terreno plano o motor entra
no *fallback* de grade ortogonal e produz **mais** lotes aproveitáveis. Ou seja,
a "limitação em terreno plano" não é fatal para o uso que interessa ao Archilly.

## 9. Separabilidade dos estágios — a pergunta que decide o escopo

**Resposta objetiva: sim, os estágios são chamáveis isoladamente.**

A evidência é estrutural e foi confirmada por execução. `RoadGraph` tem todos
os campos públicos (`nodes`, `edges`, `blocks`), implementa `Default`, e expõe
`add_node_with_elevation` e `add_edge`. Nenhum estágio depende de estado
guardado pelo tracer. Assinaturas:

```rust
generate_roads(&HeightMap, &TensorConfig) -> Result<RoadGraph, GenerationError>
rationalize_graph(&mut RoadGraph, &HeightMap, &RationalizeConfig)
extract_blocks(&mut RoadGraph)
extract_lots(&RoadGraph, &mut HeightMap, &LotConfig) -> Vec<BuildingLot>
prune_unused_roads(&mut RoadGraph, &[BuildingLot])
```

A prova executada: um `RoadGraph` construído **à mão** (grade 3×3, 9 nós, 12
arestas, sem nunca chamar `generate_roads`) foi passado direto para
`extract_blocks` e `extract_lots`:

```text
grafo externo: 9 nós, 12 arestas (construído à mão, sem generate_roads)
extract_blocks  -> 4 quadras
  quadra 0: (80,20) (20,20) (20,80) (80,80)
  quadra 1: (140,20) (80,20) (80,80) (140,80)
  quadra 2: (80,80) (20,80) (20,140) (80,140)
  quadra 3: (140,80) (80,80) (80,140) (140,140)
extract_lots    -> 64 lotes
  lote 0: centro=(42.5,72.0) w=12.0 d=10.0 rot=0.000rad frente=(42.5,80.0)
```

Quatro quadras corretas de 60 × 60 m a partir de eixos fornecidos de fora.
Mapeando para os usos previstos na especificação:

| Uso | Viável? | Observação |
|---|---|---|
| A — pipeline completo | Parcial | roda, mas o estágio de lotes não entrega parcelamento |
| **B — só rede viária** | **Sim** | `generate_roads` + `rationalize_graph`; é o uso de maior valor |
| **C — só quadras** | **Sim** | provado acima: Archilly dá os eixos, Symbios extrai as faces |
| D — só parcelamento | Não | `BuildingLot` é edificação, e as parcelas são descartadas |

## 10. Viabilidade WebAssembly — provado

Alvo `wasm32-unknown-unknown`, compilando **a biblioteca** (não o exemplo, que
escreve arquivos).

**Tentativa 1 — falhou:**

```text
error: The wasm32-unknown-unknown targets are not supported by default;
you may need to enable the "wasm_js" configuration flag.
   --> getrandom-0.3.4/src/backends.rs:194:17
```

Causa: `rand 0.9` puxa `getrandom 0.3`, que em wasm32 exige uma escolha
explícita de backend. Não é defeito do Symbios.

**Tentativa 2 — sucesso.** A correção é do lado consumidor, padrão e
documentada; **o upstream não foi alterado**. Um crate de fachada declara
`getrandom = { version = "0.3", features = ["wasm_js"] }` e compila com
`RUSTFLAGS='--cfg getrandom_backend="wasm_js"'`:

```shell
RUSTFLAGS='--cfg getrandom_backend="wasm_js"' \
  cargo build --release --target wasm32-unknown-unknown
#   Finished `release` profile [optimized] target(s) in 12.54s
#   symbios_wasm_probe.wasm — 162 696 bytes
```

**159 KB de `.wasm`**, sem dependência nativa, sem C++, sem `emscripten`.
Nenhum código do motor toca sistema de arquivos, rede ou threads no caminho do
pipeline. É um candidato genuinamente bom a WebAssembly no navegador — que é
exatamente onde o Generate roda. **Não é preciso serviço de servidor.**

## 11. Limitações — consolidado

| # | Limitação | Gravidade | De quem é o problema |
|---|---|---|---|
| 1 | Entrada é heightmap retangular; não existe polígono de gleba | Alta | Adapter (recortar entrada e saída) |
| 2 | `BuildingLot` é pegada de edificação; parcelas são calculadas e **descartadas** (`subdivide_polygon` é privada) | Alta | Cópia de trabalho `archilly/` (tornar público) ou não usar o estágio |
| 3 | `rationalize_graph` é O(N²) — 128 s num mundo de 2 km² | Alta | Motor; contornável limitando a extensão |
| 4 | Sem CRS/georreferência; espaço local em `f32` | Média | Adapter (transformação afim) |
| 5 | Defaults geram via a cada 15 m (quadra mediana de 97 m²) | Média | Configuração |
| 6 | Nenhuma noção de APP, faixa não edificável, testada mínima, área mínima, legislação | Média | Por projeto: é papel do Validator |
| 7 | Arestas inativas permanecem no vetor após split | Baixa | Adapter (filtrar `active`) |
| 8 | Sem CLI e sem API HTTP — só biblioteca | Baixa | Irrelevante: em WASM o consumo é por função |
| 9 | `CityStreamer` não costura tiles (emendas visíveis) | Baixa | Não usar streaming |
| 10 | Autor único, projeto jovem (0.4.1) | Média | Risco de manutenção; mitigado pela cópia `upstream/` |

## 12. Atividade e risco de manutenção

Commit mais recente **2026-09-06**, três dias antes desta investigação — o
projeto está vivo. Há CI no GitHub Actions (`.github/workflows/rust.yml`) com
`clippy -D warnings`, toolchain fixada deliberadamente em `1.96.1` com um
comentário explicando por quê, testes de integração (`tests/integration.rs`) e
benchmarks com `criterion`. A documentação interna é acima da média: cada
módulo tem doc-comment, cada campo de config está tabelado no README, e as
limitações conhecidas estão declaradas pelo próprio autor.

O risco é **autor único**. Mitigação: a cópia em `upstream/` com commit fixado
já garante que a versão usada não desaparece.

## 13. Proposta de Adapter (uma página, sem código)

**Escopo recomendado: Uso B (rede viária) + Uso C (quadras). O estágio de lotes
fica com o Archilly.**

**Forma.** Um módulo TypeScript em `external-engines/symbios/adapter/` que
carrega um `.wasm` de ~159 KB num Web Worker. Sem servidor, sem container, sem
processo. O Core do Generate não importa nada dele: fala com um contrato de
motor genérico, e apagar a pasta não quebra nada.

**Entrada (contrato Archilly → Adapter).** O menor conjunto que o motor
realmente consome: polígono de gleba (anel externo + furos, no CRS do
projeto), amostras de elevação, e três parâmetros de calibração
(`major_road_dist`, `minor_road_dist`, `seed`). Restrições — APP, faixas não
edificáveis, cursos d'água — entram como **máscara de exclusão**, não como
configuração do motor: o Symbios não sabe o que são, e não deve saber.

**Tradução de ida.** Quatro operações, nenhuma delas negociável:
1. **Transformação afim** do CRS do projeto para o espaço local do motor —
   translada a origem para o canto do *bounding box* da gleba e guarda a
   inversa. Sem isso o TESTE 05 (coordenadas) falha.
2. **Rasterização** da elevação para `HeightMap` regular. A resolução pode ser
   grosseira: a seção 6.2 mostrou que refinar não custa nada, mas também não
   ajuda. `cell_size` de 4 m é suficiente.
3. **Rebaixamento das áreas excluídas** — APP e faixas não edificáveis
   recebem cota abaixo do `water_level`, e o motor as evita por conta própria.
   É o único jeito de expressar restrição no vocabulário atual do motor.
4. **Calibração**: converter "quadra alvo de X × Y metros" nos parâmetros de
   espaçamento, usando a tabela da seção 7 como ponto de partida.

**Execução.** Chamar `generate_roads` e `rationalize_graph`; opcionalmente
`extract_blocks`. **Não** chamar `extract_lots`, `carve_*` nem
`generate_road_meshes` — o Archilly já tem parcelamento, terraplenagem e
geometria própria. Guarda de extensão: recusar (ou avisar) glebas acima de
~1 km², pela seção 6.1.

**Saída e tradução de volta.** Ler `RoadGraph` via `serde_json`,
**filtrando `active`**, aplicar a transformação afim inversa, e recortar tudo
pelo limite da gleba — o motor gera sobre o retângulo inteiro e vai extrapolar.
Eixos viram `Roads.Axes`; `road_type` mapeia para a hierarquia viária do
Archilly; `CityBlock.perimeter` vira `Blocks`. `RoadAreas` são geradas pelo
Archilly a partir dos eixos, não pelo motor.

**Erros.** `GenerationError` tem três variantes (`InvalidConfig`,
`DegenerateInput`, `Numerical`), todas com `stage` e mensagem — mapear direto
para o log do laboratório. Falha do motor nunca deve derrubar a geração: o
Adapter devolve "sem solução" e o Judge simplesmente não recebe esse candidato.

**Isolamento.** O Adapter é o único ponto que conhece `RoadGraph`, `TensorConfig`
ou o layout do `.wasm`. Trocar o Symbios por outro motor de rede viária não
deve tocar em nada fora dessa pasta.

## 14. Veredito

**SEGUIR PARA ETAPA B/C — como motor de rede viária e extração de quadras
(Usos B e C), não como pipeline completo.**

O que sustenta a decisão: licença MIT limpa em todo o grafo de dependências;
compila e roda de primeira; determinístico byte a byte por seed; compila para
WebAssembly em 159 KB sem dependência nativa, que é exatamente o alvo do
Generate; estágios comprovadamente separáveis, com quadras corretas extraídas
de eixos fornecidos de fora; e, bem calibrado, 6 ms para uma gleba de 26 ha.

O que limita o escopo: o estágio de lotes entrega pegadas de edificação e
descarta os polígonos das parcelas, então não substitui o parcelamento do
Archilly; e `rationalize_graph` é O(N²), o que fecha a porta para glebas acima
de ~1 km² sem intervenção no motor.

Fica **por provar** — e é exatamente o conteúdo das Etapas C a F — se a rede
viária gerada é *melhor* que a do Geométrico e a do Fishbone. Nada nesta
investigação mede qualidade urbanística; ela mede apenas que o caminho técnico
existe, é limpo e é barato. A hipótese principal (redes mais orgânicas e
sensíveis à topografia) segue de pé e ainda não testada.
