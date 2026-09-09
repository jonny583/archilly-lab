# TRIAGEM DE MOTORES EXTERNOS — LAB-00

**Data:** 09/09/2026 · **Etapa:** A (investigação) + prova mínima de execução
**Escopo:** nada aqui toca o Archilly Generate. Nenhum Adapter foi escrito.

---

## Como ler a coluna "avaliação preliminar"

A tabela da seção *Método de comparação* da especificação
(`docs/LABORATORIO.md`, seção 36) pede **Melhor / igual / pior / inviável** por
dimensão. Essa comparação exige rodar o motor no mesmo terreno, com os mesmos
parâmetros, contra o Geométrico e o Fishbone, e passar tudo pelo Validator e
pelo Judge — que é o conteúdo das Etapas D a F.

Nada disso foi feito neste prompt, e nenhum motor externo foi comparado com os
motores do Archilly. Portanto:

- **inviável** é afirmação medida ou de licença — está provada, com evidência.
- **não medido** significa exatamente isso: a Etapa A não responde, e fingir
  que responde seria inventar. Onde há um indício, ele vem anotado como indício.

Nenhuma célula abaixo diz "melhor" ou "pior". Não há base para dizer.

---

## 1. Symbios Tensor

`https://github.com/TheJanusStream/symbios-tensor` · commit
`c3f2875` (2026-09-06) · **MIT** · Rust 1.96.1 · análise completa em
[`SYMBIOS_ANALYSIS.md`](SYMBIOS_ANALYSIS.md)

| Avaliação | Resultado preliminar | Evidência |
|---|---|---|
| Motor completo | **não medido** — indício negativo | Roda de ponta a ponta (153 ms, exemplo do upstream), mas o estágio de lotes não entrega parcelamento (ver "Lotes") |
| Rede viária | **não medido** — indício positivo forte | `generate_roads` + `rationalize_graph` funcionam, são determinísticos e custam 21 ms + 219 ms num mundo de 512 m. Qualidade urbanística **não avaliada** |
| Quadras | **não medido** — indício positivo | `extract_blocks` produziu 4 quadras corretas de 60×60 m a partir de um grafo construído à mão, sem o tracer. Calibrado a 200/80 m, 24 quadras de área mediana 3 439 m² |
| Lotes | **inviável** | `BuildingLot` é retângulo rotacionado = pegada de edificação, não parcela. `subdivide_polygon` e `polygon_to_lot` são privadas: os polígonos das parcelas são calculados e **descartados** |
| Otimização | **inviável** | O motor não tem etapa de otimização |
| Geometria auxiliar | **não medido** — indício positivo | RDP, filetes de Bézier, suavização Laplaciana de cotas e clamp de rampa (`max_grade`) são públicos e reutilizáveis |
| Performance | **não medido** — caracterizada | Custo cresce com a **extensão**, não com a resolução: mundo fixo de 512 m dá ~245 ms em 128², 256² e 512². `rationalize_graph` é O(N²): 219 ms (0,26 km²) → 6,8 s (1 km²) → 128 s (4 km²) |
| Integração | **Fácil** | Compila para `wasm32-unknown-unknown` em **159 KB**, sem dependência nativa. Tudo é `serde`. Estágios separáveis e comprovados |
| Valor para Archilly | **Médio a alto, condicional** | Alto se a rede viária provar valor nas Etapas C-F; nulo no parcelamento |

### Veredito: **SEGUIR PARA ETAPA B/C** — escopo reduzido aos Usos B (rede viária) e C (quadras)

**A favor:** licença MIT limpa em todo o grafo de dependências, sem assets de
terceiros. Compilou e rodou de primeira (`cargo build --release --example
full_city`, 29 s; execução 153 ms). Determinístico byte a byte — duas execuções
com `seed: 42` deram `hash=d73908d6bc3b9af4` para o grafo e
`hash=703933f25be2fe3d` para os lotes; com `seed: 7`, hashes diferentes.
Compila para WebAssembly (159 KB) com uma correção padrão do lado consumidor
(`getrandom` com `wasm_js`), **sem alterar o upstream** — e é WebAssembly que o
Generate consegue usar. Upstream ativo (commit de três dias antes), com CI,
testes e benchmarks.

**Contra:** o estágio de lotes não serve; `rationalize_graph` é O(N²) e fecha a
porta acima de ~1 km²; não há polígono de gleba, CRS nem qualquer noção de APP,
faixa não edificável ou testada mínima — tudo isso é papel do Adapter e do
Validator; e os defaults do upstream põem uma via a cada 15 m, gerando "quadras"
de 97 m² medianos, o que exige calibração (200/80 m dá 3 439 m² e ainda fica
37× mais rápido).

**Não provado:** se a rede viária gerada é melhor que a do Geométrico ou a do
Fishbone. É o objeto das Etapas C-F, e é a única pergunta que decide adoção.

---

## 2. Straight skeleton — StrandedKitty/straight-skeleton (CGAL via WASM)

`https://github.com/StrandedKitty/straight-skeleton` · commit `d68f08a`
(2026-03-24) · invólucro **MIT**, efetivo **GPLv3+** · análise em
[`STRAIGHT_SKELETON_ANALYSIS.md`](STRAIGHT_SKELETON_ANALYSIS.md)

| Avaliação | Resultado preliminar | Evidência |
|---|---|---|
| Motor completo | **inviável** | Não é motor de loteamento; é uma primitiva geométrica |
| Rede viária / Quadras / Lotes / Otimização | **inviável** | Fora do escopo da biblioteca |
| Geometria auxiliar | **inviável por licença** (tecnicamente correta) | Executou retângulo (3,5-11,4 ms) e L com geometria correta, mas ver veredito |
| Performance | **não medido** — suficiente | 11,4 ms na primeira chamada, 3,5 ms depois |
| Integração | **Difícil** | Bloqueio de licença; artefato de 1,05 MB; exige orientação de anéis e vértice duplicado no chamador |
| Valor para Archilly | **Nenhum como código; alto como referência** | Deu dois casos de teste verificados |

### Veredito: **REFERÊNCIA APENAS** — licença impeditiva

O `LICENSE` MIT cobre só o invólucro TypeScript. O trabalho é feito pela **CGAL**,
e o arquivo de licença do próprio pacote na versão usada (CGAL 5.6, fixada em
`src/core/install_libraries.sh`) diz textualmente:

```text
https://raw.githubusercontent.com/CGAL/cgal/v5.6/Straight_skeleton_2/package_info/Straight_skeleton_2/license.txt
→ "GPL (v3 or later)"
```

O `main.js` distribuído (1,05 MB, `.wasm` embutido) é obra derivada de GPLv3.
Distribuí-lo com o Generate sujeitaria a aplicação inteira à GPLv3.
**Sim — inviabiliza o uso comercial.** O script ainda baixa GMP (LGPLv3/GPLv2) e
MPFR (LGPLv3), irrelevantes diante da GPL da CGAL.

Executado mesmo assim, para registro (duas tentativas: a primeira falhou porque
o módulo foi compilado com `-s ENVIRONMENT='web'`; a segunda funcionou com
globais de navegador simulados). Retângulo 60×30 → nós internos em (15,15) e
(45,15), `time`=15. L → mais um nó em (15,45). Correto.

---

## 3. Straight skeleton — lizelive/straight-skeleton (crate Rust)

`https://github.com/lizelive/straight-skeleton` · commit `7ca4b0f`
(2026-07-17) · **GPL-2.0-or-later** · análise em
[`STRAIGHT_SKELETON_ANALYSIS.md`](STRAIGHT_SKELETON_ANALYSIS.md)

| Avaliação | Resultado preliminar | Evidência |
|---|---|---|
| Motor completo / Rede viária / Quadras / Lotes / Otimização | **inviável** | Primitiva geométrica, não motor |
| Geometria auxiliar | **inviável por licença** (tecnicamente excelente) | Offset interno de 5 u no L devolveu exatamente `[(5,5),(55,5),(55,25),(25,25),(25,55),(5,55)]` |
| Performance | **não medido** — excelente | 14,6 µs (retângulo) e 8,8 µs (L) — ~400× mais rápido que o caminho CGAL |
| Integração | **Difícil** | Licença GPLv2+; reticulado `i16` limitado a ±16 384 (inteiros) |
| Valor para Archilly | **Nenhum como código; alto como referência de projeto** | `docs/DESIGN.md` documenta onde o algoritmo quebra |

### Veredito: **REFERÊNCIA APENAS** — licença impeditiva

`Cargo.toml` declara `license = "GPL-2.0-or-later"`, sem exceção de vinculação.
Contamina tanto quanto o candidato anterior, por caminho independente.

Tecnicamente é a melhor peça de engenharia vista nesta investigação: sem
dependências obrigatórias, `no_std`, `unsafe_code = "forbid"`, predicados
geométricos **exatos** em aritmética inteira (`i32`/`f32`, sem `f64`), ao custo
de um bit de alcance. Traz offset por aresta, `residual()` (o polígono
deslocado para dentro — exatamente o que o Archilly quer para recuos) e
rastreabilidade nativa `arc.sources`.

**Validação cruzada:** as duas implementações concordam nos dois casos de teste.
Isso valida ambas e dá ao Archilly um **oráculo verificado** para qualquer
reimplementação.

### Recomendação para o Archilly: **reimplementar em TypeScript**

As duas implementações disponíveis para navegador são copyleft, por caminhos
independentes. Não há terceira opção pronta. O algoritmo, porém, é da
literatura, não dos repositórios: **Felkel & Obdržálek (1998)**; **Aichholzer,
Aurenhammer, Alberts & Gärtner (1995)**; **Aichholzer & Aurenhammer (1996)**
para furos. Implementar a partir dos artigos não cria obra derivada. O escopo do
Archilly é modesto (quadras de dezenas de vértices), já existe oráculo, e a
precisão passa a ser escolha nossa. O risco real são as degenerescências —
eventos simultâneos, arestas quase paralelas —, e o `docs/DESIGN.md` do
candidato B deve ser lido antes de começar.

---

## 4. PackingSolver

`https://github.com/fontanf/packingsolver` · commit `a7e5330` (2026-09-08) ·
**MIT** · C++ · triagem em [`PACKINGSOLVER_TRIAGEM.md`](PACKINGSOLVER_TRIAGEM.md)

| Avaliação | Resultado preliminar | Evidência |
|---|---|---|
| Motor completo / Rede viária / Quadras | **inviável** | Não gera geometria urbana; empacota retângulos |
| Lotes | **inviável na forma direta** | `rectangleguillotine` exige *bin* retangular e não modela acesso à via, testada, esquina nem lote irregular |
| Otimização | **não medido** — plausível em escopo estreito | Corte guilhotinado é a estrutura certa de um quarteirão; ver formulação abaixo |
| Geometria auxiliar | **inviável** | Não produz geometria |
| Performance | **não medido** | Sem prova de execução neste prompt (fora do escopo) |
| Integração | **Difícil** | C++ com CLP/HiGHS e LAPACK: **só servidor**, contra a arquitetura de navegador do Generate |
| Valor para Archilly | **Baixo por ora** | O subproblema que sobra é pequeno demais para a infraestrutura que exige |

### Veredito: **REFERÊNCIA APENAS**

**Formulação candidata:** *bin* = quadra retangular; itens = tipos de lote
(testada × profundidade) com `COPIES` alto; objetivo `knapsack`;
`number-of-stages 2` com primeiro corte perpendicular à via; `min1cut` = testada
mínima e `min2cut` = profundidade mínima. O formato de entrada é CSV simples
(`ID,WIDTH,HEIGHT,COPIES` e `ID,WIDTH,HEIGHT`).

**O que falta, e não é contornável por configuração:** quadra real não é
retângulo; **nenhum lote tem garantia de acesso à via** — o solver preenche o
miolo com prazer, e lote encravado é solução *inválida*, não imperfeita;
testada não tem semântica (o solver não distingue os lados do *bin*); lote de
esquina é inexprimível; lote irregular sai do tipo guilhotinado.

**Caminho de contorno:** aplicar o solver a **uma faixa de lotes por vez** (a
faixa entre a via e o eixo da quadra), o que resolve retângulo e acesso à via de
uma vez — mas aí o problema vira unidimensional, e programação dinâmica em
TypeScript resolve sem servidor nenhum.

**Reavaliar se:** as Etapas C-F mostrarem que o parcelamento do Archilly perde
aproveitamento de área mensurável para uma solução ótima. Antes disso, é
resolver um problema ainda não demonstrado. Licença MIT limpa e projeto muito
ativo (commit de um dia antes desta triagem) — vale voltar a olhar se a
condição se cumprir.

---

## 5. Referências de algoritmo — não integráveis a um aplicativo de navegador

| Projeto | Link | Licença | O que inviabiliza | Técnica que vale conhecer |
|---|---|---|---|---|
| ProceduralCityGeneration (Grzybojad) | `github.com/Grzybojad/ProceduralCityGeneration` | **MIT** (verificado: "Copyright (c) 2023 Adam Brol") | C++ acoplado ao **Unreal Engine**; não há biblioteca destacável nem alvo WebAssembly | **Voronoi para redes orgânicas** — o README declara "Voronoi based roads" e um "custom road expansion algorithm"; também *plot extrusion* e *shrinking layer stacking* para volumetria |
| Terasology Cities | `github.com/Terasology/Cities` | **Apache-2.0** (verificado) | Módulo **Java** de um jogo, dependente do motor Terasology; sem alvo de navegador | Geração de assentamentos e vias a partir de semente aleatória, com hierarquia viária por importância de povoado |
| RoadNetworkTool | não resolvido nesta sessão | não verificado | Depende do **Unreal Engine** — mesmo impedimento estrutural do primeiro item | **Splines para vias curvas**: representar eixo viário por curva paramétrica em vez de polilinha, e derivar a área de rolamento por extrusão ao longo da spline |
| Complete Street Rule (Esri) | não resolvido nesta sessão | proprietária (Esri) | Exige o **CityEngine**, produto pago; regras em CGA, linguagem própria e fechada | Modelagem de seção transversal viária por *regra* — faixa de rolamento, ciclofaixa, calçada, canteiro como camadas paramétricas de uma mesma via |

**Nota de honestidade:** os dois primeiros foram verificados nesta sessão
buscando o arquivo `LICENSE` e o `README` diretamente no repositório. Os dois
últimos **não puderam ser resolvidos** — a API do GitHub está restrita ao escopo
desta sessão e os caminhos tentados retornaram 404. O fator que os desqualifica
(dependência de Unreal Engine e de CityEngine pago) é conhecido de antemão e não
depende da licença, mas a licença e o commit deles **não foram confirmados**.

Todos: **REFERÊNCIA APENAS.** Nenhum entra no Generate. O valor é a técnica.

---

## 6. Quadro-resumo

| Motor | Licença | Roda no navegador? | Executou? | Veredito |
|---|---|---|---|---|
| **Symbios Tensor** | MIT | **Sim** — WASM 159 KB | **Sim**, 153 ms | **SEGUIR PARA ETAPA B/C** (Usos B e C) |
| straight-skeleton (CGAL/WASM) | **GPLv3+** | sim, mas contamina | Sim, 3,5 ms | REFERÊNCIA APENAS |
| straight-skeleton (Rust) | **GPLv2+** | sim, mas contamina | Sim, 8,8 µs | REFERÊNCIA APENAS |
| PackingSolver | MIT | não (servidor) | não executado | REFERÊNCIA APENAS |
| ProceduralCityGeneration | MIT | não (Unreal) | não | REFERÊNCIA APENAS |
| Terasology Cities | Apache-2.0 | não (Java/jogo) | não | REFERÊNCIA APENAS |
| RoadNetworkTool | não verificada | não (Unreal) | não | REFERÊNCIA APENAS |
| Complete Street Rule | proprietária | não (CityEngine) | não | REFERÊNCIA APENAS |

**Um motor sobrevive à Etapa A: o Symbios Tensor, e só como rede viária e
extração de quadras.** O esqueleto reto sobrevive como *técnica* — a
recomendação é reimplementá-lo, não importá-lo. Todo o resto é conhecimento.

Conforme a especificação (seção 33, *Regra de sucesso dos motores externos*),
isso já é sucesso: um motor não precisa vencer como solução completa. O que a
Etapa A estabeleceu é que existe **um** caminho técnico limpo, barato e
licenciado. Se ele agrega valor de fato, só as Etapas C-F respondem.
