# ONDE PARAMOS

> Para retomar numa nova sessão, diga:
>
> **"leia docs/ONDE_PARAMOS.md e me diga onde estamos"**

**Última atualização:** 09/09/2026 · **Prompt executado:** LAB-00
**Etapa concluída:** A (investigação) + prova mínima de execução

---

## Em uma frase

Investigamos quatro motores open source; **um sobreviveu** — o Symbios Tensor,
e só como gerador de rede viária e extrator de quadras. Nenhum Adapter foi
escrito, nenhum dado do Archilly foi convertido, e o repositório do Generate não
foi tocado.

## O que foi feito

1. Estrutura do laboratório criada, com a regra de ouro no `README.md`:
   `upstream/` intocado → `archilly/` modificável → `adapter/` como única ponte
   → o Generate nunca depende disto.
2. **Symbios Tensor**: Etapa A completa e prova mínima de execução. Clonado,
   compilado, executado, medido (determinismo, performance, separabilidade dos
   estágios, calibração, relevo) e compilado para WebAssembly.
3. **Straight skeleton**: as duas implementações indicadas foram investigadas e
   **executadas** (retângulo e polígono em L). Ambas se revelaram copyleft.
4. **PackingSolver**: triagem documental, sem execução (fora do escopo deste
   prompt).
5. **Referências**: tabela com link, licença, o que inviabiliza e a técnica que
   vale conhecer, em `docs/TRIAGEM.md`, seção 5.

## Vereditos

| Motor | Licença | Veredito |
|---|---|---|
| **Symbios Tensor** 0.4.1 (`c3f2875`) | MIT | **SEGUIR PARA ETAPA B/C** — Usos B (rede viária) e C (quadras) |
| straight-skeleton — StrandedKitty (CGAL/WASM) | **GPLv3+** | REFERÊNCIA APENAS |
| straight-skeleton — lizelive (Rust) | **GPLv2+** | REFERÊNCIA APENAS |
| PackingSolver | MIT | REFERÊNCIA APENAS |
| ProceduralCityGeneration / Terasology Cities / RoadNetworkTool / Complete Street Rule | várias | REFERÊNCIA APENAS |

Evidências completas em [`TRIAGEM.md`](TRIAGEM.md).

## Os cinco achados que mudam a decisão

1. **O Symbios compila para WebAssembly em 159 KB** (162 696 bytes), sem
   dependência nativa. Isso significa que ele roda **dentro do navegador**, com o
   Generate, sem servidor, sem contêiner. Foi preciso uma correção padrão do lado
   consumidor (`getrandom` com `wasm_js`); o upstream **não** foi alterado.

2. **Os estágios são chamáveis isoladamente — provado, não presumido.** Um
   `RoadGraph` construído à mão (9 nós, 12 arestas, sem nunca chamar
   `generate_roads`) passou direto por `extract_blocks` e `extract_lots` e
   produziu 4 quadras corretas de 60×60 m. Os Usos B e C são reais.

3. **`BuildingLot` não é lote.** É um retângulo rotacionado — pegada de
   edificação já recuada. Os polígonos das parcelas são calculados internamente
   por `subdivide_polygon` e **descartados**: a função é privada e nada na API
   pública os expõe. O parcelamento continua sendo do Archilly.

4. **O custo é da extensão da gleba, não da resolução do heightmap.** Com o
   mundo fixo em 512 × 512 m, as grades 128², 256² e 512² deram todas ~245 ms.
   Mas `rationalize_graph` é O(N²) na contagem de nós: 219 ms em 0,26 km²,
   6,8 s em 1 km², **128 s** em 4 km². Refinar é grátis; ampliar é caro.

5. **As duas implementações de esqueleto reto disponíveis para navegador são
   copyleft**, por caminhos independentes — CGAL `Straight_skeleton_2` é
   "GPL (v3 or later)", e o crate Rust declara `GPL-2.0-or-later`. Não há
   terceira opção pronta. A recomendação é **reimplementar em TypeScript** a
   partir da literatura (Felkel & Obdržálek 1998; Aichholzer et al. 1995/1996),
   o que não é obra derivada — e já temos um oráculo: as duas implementações
   concordaram exatamente nos dois casos de teste executados.

## O que ainda não sabemos — e é o que importa

**Nenhum motor externo foi comparado com o Geométrico ou o Fishbone.** Esta
etapa mediu apenas que o caminho técnico existe, é limpo e é barato. Não mediu
qualidade urbanística, não passou nada pelo Validator e não acionou o Judge.

A hipótese principal — *o Symbios gera redes mais orgânicas e sensíveis à
topografia que o motor geométrico atual* — **segue de pé e não testada**.

## A fila completa

O roteiro de LAB-00 a LAB-06, com a entrega e a condição de início de cada
prompt, está em [`FILA.md`](FILA.md). A regra que o governa: **cada item só
começa se o anterior disser que vale**, e o Generate nunca depende do Lab — o
que for aprovado chega a ele como peça pronta (WebAssembly ou serviço) atrás do
contrato de motor.

Estado real da fila após este prompt (o `FILA.md` está gravado tal como
recebido, com a data em que foi escrito):

| Prompt | Estado | Condição de início |
|---|---|---|
| **LAB-00** | **concluído em 09/09/2026** | — |
| **LAB-01** — Adaptador mínimo do Symbios | **liberado** | LAB-00 concluiu "seguir" para o Symbios ✅ |
| **LAB-04** — Straight skeleton na subdivisão de quadras | **liberado, com ressalva** | LAB-00 confirmou a licença ✅ — e as duas implementações são copyleft, então a decisão pedida pelo item já tem resposta: **reimplementar em TypeScript** |
| LAB-02 · LAB-03 · LAB-05 · LAB-06 | aguardando | dependem, em cadeia, de LAB-01 |

## Próximo passo sugerido (LAB-01)

Etapa C: **Adapter mínimo do Symbios, escopo Uso B (só rede viária).**

A proposta de arquitetura está pronta em
[`SYMBIOS_ANALYSIS.md`](SYMBIOS_ANALYSIS.md), seção 13. Em resumo: módulo
TypeScript carregando o `.wasm` num Web Worker; entrada = polígono de gleba +
elevação + três parâmetros; APP e faixas não edificáveis entram como **máscara
de exclusão** (rebaixadas abaixo do `water_level`, que é o único vocabulário de
restrição que o motor tem); saída = `RoadGraph` filtrado por `active`,
transformado de volta ao CRS do projeto e **recortado pelo limite da gleba** —
o motor gera sobre o retângulo inteiro e vai extrapolar.

Antes de escrever qualquer linha, a especificação exige inspecionar o modelo de
dados real do Archilly Generate (`jonny583/urban-create-hub-41d93a4d`, branch
`motor-v2`) e propor a **menor** estrutura necessária, sem inventar campos que
o Archilly ainda não tem. **Esse repositório não foi acessado neste prompt.**

LAB-04 também está liberado e é independente de LAB-01 — pode correr em
paralelo, se houver interesse.

Duas decisões de calibração já saem prontas do LAB-00: usar
`major_road_dist ≈ 200` e `minor_road_dist ≈ 80` (os defaults de 40/15 põem uma
via a cada 15 m e geram "quadras" de 97 m² medianos), e recusar ou avisar em
glebas acima de ~1 km².

## Como reproduzir tudo

```shell
cd external-engines/symbios/upstream       && cargo run --release --example full_city
cd external-engines/symbios/archilly/probe && cargo run --release

cd external-engines/symbios/archilly/wasm-probe
rustup target add wasm32-unknown-unknown
RUSTFLAGS='--cfg getrandom_backend="wasm_js"' cargo build --release --target wasm32-unknown-unknown
```

Saídas literais de referência, gravadas em `outputs/`:
`symbios_probe.txt`, `straight_skeleton_rust.txt`,
`straight_skeleton_cgal_wasm.txt`, mais os artefatos do exemplo do upstream
(`symbios_full_city_roads.obj`, `symbios_full_city_lots.svg`).

Os arranjos de medição do esqueleto reto estão em
`external-engines/straight-skeleton/archilly/` — código próprio; os motores GPL
**não** estão neste repositório e precisam de clone temporário.

## Integridade do upstream

`external-engines/symbios/upstream/` foi verificado arquivo a arquivo com `cmp`
contra o commit `c3f287556b98cc616d4263d163e6643ae32111ff`: **byte a byte
idêntico**. Nenhuma alteração do Archilly foi aplicada ao motor.
