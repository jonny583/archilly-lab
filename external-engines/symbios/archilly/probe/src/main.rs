//! LAB-00 / Etapa A — prova mínima de execução do symbios-tensor.
//!
//! Mede: determinismo por seed, tempo por estágio em 128x128 e 512x512,
//! e separabilidade dos estágios (blocos/lotes a partir de um grafo viário
//! construído externamente, sem passar pelo tracer).
//!
//! Não converte dado nenhum do Archilly. Não é Adapter.

use std::collections::hash_map::DefaultHasher;
use std::hash::{Hash, Hasher};
use std::time::Instant;

use glam::Vec2;
use symbios_ground::HeightMap;
use symbios_tensor::*;

/// Heightmap sintético com relevo (o tracer degenera em terreno plano).
fn terrain(n: usize, cell: f32) -> HeightMap {
    terrain_relief(n, cell, 1.0)
}

/// `relief` escala a amplitude vertical. 0.0 = plano perfeito.
fn terrain_relief(n: usize, cell: f32, relief: f32) -> HeightMap {
    let mut hm = HeightMap::new(n, n, cell);
    for y in 0..n {
        for x in 0..n {
            let fx = x as f32 / n as f32;
            let fy = y as f32 / n as f32;
            let h = relief
                * (30.0 * (fx * 6.0).sin() * (fy * 4.0).cos()
                    + 18.0 * (fx * 2.5 + fy * 1.7).sin()
                    + 40.0 * fy);
            hm.set(x, y, h);
        }
    }
    hm
}

fn hash_of(s: &str) -> u64 {
    let mut h = DefaultHasher::new();
    s.hash(&mut h);
    h.finish()
}

struct Run {
    graph_json: String,
    lots_json: String,
    nodes: usize,
    active_edges: usize,
    blocks: usize,
    lots: usize,
    t_roads_ms: f64,
    t_rat_ms: f64,
    t_blocks_ms: f64,
    t_lots_ms: f64,
    t_total_ms: f64,
}

fn full_pipeline(n: usize, seed: u64) -> Run {
    full_pipeline_cell(n, 4.0, seed)
}

fn full_pipeline_cell(n: usize, cell: f32, seed: u64) -> Run {
    full_pipeline_relief(n, cell, 1.0, seed)
}

fn full_pipeline_relief(n: usize, cell: f32, relief: f32, seed: u64) -> Run {
    let hm = terrain_relief(n, cell, relief);
    let cfg = TensorConfig {
        seed,
        ..TensorConfig::default()
    };
    let all = Instant::now();

    let t = Instant::now();
    let mut graph = generate_roads(&hm, &cfg).expect("config válida");
    let t_roads_ms = t.elapsed().as_secs_f64() * 1e3;

    let t = Instant::now();
    rationalize_graph(&mut graph, &hm, &RationalizeConfig::default());
    let t_rat_ms = t.elapsed().as_secs_f64() * 1e3;

    let t = Instant::now();
    extract_blocks(&mut graph);
    let t_blocks_ms = t.elapsed().as_secs_f64() * 1e3;

    let mut hm2 = hm;
    let t = Instant::now();
    let lots = extract_lots(&graph, &mut hm2, &LotConfig::default());
    let t_lots_ms = t.elapsed().as_secs_f64() * 1e3;

    let t_total_ms = all.elapsed().as_secs_f64() * 1e3;

    Run {
        graph_json: serde_json::to_string(&graph).unwrap(),
        lots_json: serde_json::to_string(&lots).unwrap(),
        nodes: graph.nodes.len(),
        active_edges: graph.edges.iter().filter(|e| e.active).count(),
        blocks: graph.blocks.len(),
        lots: lots.len(),
        t_roads_ms,
        t_rat_ms,
        t_blocks_ms,
        t_lots_ms,
        t_total_ms,
    }
}

/// Estágios 3 e 4 alimentados por um grafo construído à mão — sem tracer.
/// Prova o "Uso C/D": Archilly fornece os eixos, Symbios extrai quadras/lotes.
fn separability_probe() {
    println!("== SEPARABILIDADE: extract_blocks + extract_lots sobre grafo externo ==");

    // Grade 3x3 de vias, 120 m x 120 m, espaçamento 60 m. Nenhum dado do tracer.
    let mut g = RoadGraph::default();
    let span = 3;
    let step = 60.0_f32;
    let mut ids = vec![vec![0u32; span]; span];
    for (iy, row) in ids.iter_mut().enumerate() {
        for (ix, slot) in row.iter_mut().enumerate() {
            let p = Vec2::new(ix as f32 * step + 20.0, iy as f32 * step + 20.0);
            *slot = g.add_node_with_elevation(p, 10.0);
        }
    }
    for y in 0..span {
        for x in 0..span {
            if x + 1 < span {
                g.add_edge(ids[y][x], ids[y][x + 1], RoadType::Major);
            }
            if y + 1 < span {
                g.add_edge(ids[y][x], ids[y + 1][x], RoadType::Minor);
            }
        }
    }
    println!(
        "   grafo externo: {} nós, {} arestas (construído à mão, sem generate_roads)",
        g.nodes.len(),
        g.edges.len()
    );

    extract_blocks(&mut g);
    println!("   extract_blocks  -> {} quadras", g.blocks.len());
    for (i, b) in g.blocks.iter().enumerate() {
        let pts: Vec<String> = b
            .perimeter
            .iter()
            .map(|&n| {
                let p = g.node_pos(n);
                format!("({:.0},{:.0})", p.x, p.y)
            })
            .collect();
        println!("     quadra {i}: {}", pts.join(" "));
    }

    let mut hm = HeightMap::new(64, 64, 4.0);
    for y in 0..64 {
        for x in 0..64 {
            hm.set(x, y, 10.0);
        }
    }
    let lots = extract_lots(&g, &mut hm, &LotConfig::default());
    println!("   extract_lots    -> {} lotes", lots.len());
    for (i, l) in lots.iter().take(4).enumerate() {
        println!(
            "     lote {i}: centro=({:.1},{:.1}) w={:.1} d={:.1} rot={:.3}rad frente=({:.1},{:.1})",
            l.position.x, l.position.y, l.width, l.depth, l.rotation,
            l.frontage_center.x, l.frontage_center.y
        );
    }
    println!(
        "   VEREDITO separabilidade: estágios 3 e 4 rodaram sobre um RoadGraph\n\
         \x20  externo, sem o tracer => Usos C e D são estruturalmente possíveis."
    );
    println!();
}

/// Por que 1563 quadras rendem só 133 lotes? Mede a área das quadras extraídas.
fn block_area_probe() {
    println!("== ÁREA DAS QUADRAS EXTRAÍDAS (128x128, mundo 512 m, relevo 1.0) ==");
    let hm = terrain_relief(128, 4.0, 1.0);
    let cfg = TensorConfig { seed: 42, ..TensorConfig::default() };
    let mut graph = generate_roads(&hm, &cfg).expect("config válida");
    rationalize_graph(&mut graph, &hm, &RationalizeConfig::default());
    extract_blocks(&mut graph);

    let mut areas: Vec<f32> = graph
        .blocks
        .iter()
        .map(|b| {
            let pts: Vec<Vec2> = b.perimeter.iter().map(|&n| graph.node_pos(n)).collect();
            let mut a = 0.0f32;
            for i in 0..pts.len() {
                let p = pts[i];
                let q = pts[(i + 1) % pts.len()];
                a += p.x * q.y - q.x * p.y;
            }
            (a * 0.5).abs()
        })
        .collect();
    areas.sort_by(|a, b| a.partial_cmp(b).unwrap());

    let n = areas.len();
    let total: f32 = areas.iter().sum();
    println!("   quadras={n}  área somada={total:.0} m²  (mundo = 262144 m²)");
    let pct = |q: f32| areas[((n as f32 - 1.0) * q) as usize];
    println!(
        "   percentis de área (m²): p10={:.1} p25={:.1} p50={:.1} p75={:.1} p90={:.1} p99={:.1} max={:.1}",
        pct(0.10), pct(0.25), pct(0.50), pct(0.75), pct(0.90), pct(0.99), areas[n - 1]
    );
    let buckets = [
        ("< 1 m² (sliver degenerado)", 0.0f32, 1.0f32),
        ("1–50 m² (abaixo do min_lot_area)", 1.0, 50.0),
        ("50–400 m² (1 lote)", 50.0, 400.0),
        ("400–2000 m² (subdivisível)", 400.0, 2000.0),
        ("> 2000 m² (quadra de verdade)", 2000.0, f32::INFINITY),
    ];
    for (label, lo, hi) in buckets {
        let c = areas.iter().filter(|&&a| a >= lo && a < hi).count();
        println!("     {label:<34} {c:>6} ({:>5.1}%)", 100.0 * c as f32 / n as f32);
    }
    println!(
        "   LEITURA: a contagem bruta de 'quadras' NÃO é contagem de quadras\n\
         \x20  urbanísticas — a maioria são faces degeneradas do grafo planar."
    );
    println!();
}

/// Os defaults (via a cada 15 m) produzem "quadras" do tamanho de um lote.
/// Com espaçamento de loteamento brasileiro, o que sai?
fn spacing_probe() {
    println!("== CALIBRAÇÃO DO ESPAÇAMENTO VIÁRIO (128x128, mundo 512 m) ==");
    println!(
        "   {:>6} {:>6} | {:>7} | {:>9} | {:>9} | {:>6} | {:>9} | {:>9}",
        "maior", "menor", "quadras", "área med", "área p90", "lotes", "lotes/qd", "TOTAL ms"
    );
    let lot_cfg = LotConfig {
        max_lot_area: 450.0,
        min_lot_area: 200.0,
        min_width: 10.0,   // testada mínima usual no Brasil
        min_depth: 20.0,
        ..LotConfig::default()
    };
    for (major, minor) in [
        (40.0f32, 15.0f32),   // default upstream
        (120.0, 50.0),
        (200.0, 80.0),        // quadra ~80 x 200 m — loteamento brasileiro típico
        (300.0, 100.0),
    ] {
        let hm = terrain_relief(128, 4.0, 1.0);
        let cfg = TensorConfig {
            seed: 42,
            major_road_dist: major,
            minor_road_dist: minor,
            ..TensorConfig::default()
        };
        let t = Instant::now();
        let mut graph = match generate_roads(&hm, &cfg) {
            Ok(g) => g,
            Err(e) => { println!("   {major:>6.0} {minor:>6.0} | ERRO: {e}"); continue; }
        };
        rationalize_graph(&mut graph, &hm, &RationalizeConfig::default());
        extract_blocks(&mut graph);
        let mut hm2 = hm;
        let lots = extract_lots(&graph, &mut hm2, &lot_cfg);
        let ms = t.elapsed().as_secs_f64() * 1e3;

        let mut areas: Vec<f32> = graph.blocks.iter().map(|b| {
            let pts: Vec<Vec2> = b.perimeter.iter().map(|&n| graph.node_pos(n)).collect();
            let mut a = 0.0f32;
            for i in 0..pts.len() {
                let p = pts[i]; let q = pts[(i + 1) % pts.len()];
                a += p.x * q.y - q.x * p.y;
            }
            (a * 0.5).abs()
        }).collect();
        areas.sort_by(|a, b| a.partial_cmp(b).unwrap());
        let nb = areas.len().max(1);
        let med = areas[nb / 2];
        let p90 = areas[((nb as f32 - 1.0) * 0.9) as usize];
        println!(
            "   {major:>6.0} {minor:>6.0} | {:>7} | {med:>8.0}m² | {p90:>8.0}m² | {:>6} | {:>9.2} | {ms:>9.2}",
            graph.blocks.len(), lots.len(), lots.len() as f32 / nb as f32
        );
    }
    println!(
        "   LEITURA: o espaçamento viário é o parâmetro que governa se a saída\n\
         \x20  são quadras urbanísticas ou retalhos. Os defaults do upstream são\n\
         \x20  de cidade de jogo, não de loteamento."
    );
    println!();
}

fn main() {
    println!("=== SYMBIOS-TENSOR — PROVA MÍNIMA (LAB-00 Etapa A) ===\n");

    // --- Determinismo -----------------------------------------------------
    println!("== DETERMINISMO (mesma seed, duas execuções) ==");
    let a = full_pipeline(128, 42);
    let b = full_pipeline(128, 42);
    let c = full_pipeline(128, 7);
    println!(
        "   seed=42 run1: grafo hash={:016x} lotes hash={:016x} ({} nós, {} lotes)",
        hash_of(&a.graph_json), hash_of(&a.lots_json), a.nodes, a.lots
    );
    println!(
        "   seed=42 run2: grafo hash={:016x} lotes hash={:016x} ({} nós, {} lotes)",
        hash_of(&b.graph_json), hash_of(&b.lots_json), b.nodes, b.lots
    );
    println!(
        "   seed=7  run3: grafo hash={:016x} lotes hash={:016x} ({} nós, {} lotes)",
        hash_of(&c.graph_json), hash_of(&c.lots_json), c.nodes, c.lots
    );
    println!(
        "   RESULTADO: seed igual -> saída {}; seed diferente -> saída {}",
        if a.graph_json == b.graph_json && a.lots_json == b.lots_json {
            "IDÊNTICA (determinístico)"
        } else {
            "DIVERGENTE (NÃO determinístico)"
        },
        if a.graph_json != c.graph_json { "diferente (seed tem efeito)" } else { "igual (seed sem efeito!)" }
    );
    println!();

    // --- Performance ------------------------------------------------------
    println!("== PERFORMANCE por tamanho de heightmap (release) ==");
    println!(
        "   {:>9} | {:>6} | {:>7} | {:>6} | {:>5} | {:>9} | {:>9} | {:>9} | {:>8} | {:>9}",
        "grade", "nós", "arestas", "quadras", "lotes",
        "vias ms", "racion ms", "quadras ms", "lotes ms", "TOTAL ms"
    );
    for n in [128usize, 256, 512] {
        let r = full_pipeline(n, 42);
        println!(
            "   {:>9} | {:>6} | {:>7} | {:>7} | {:>5} | {:>9.2} | {:>9.2} | {:>10.2} | {:>8.2} | {:>9.2}",
            format!("{n}x{n}"), r.nodes, r.active_edges, r.blocks, r.lots,
            r.t_roads_ms, r.t_rat_ms, r.t_blocks_ms, r.t_lots_ms, r.t_total_ms
        );
    }
    println!();

    // --- Extensão vs resolução -------------------------------------------
    // O custo cresce com a EXTENSÃO do mundo (nº de vias) ou com a RESOLUÇÃO
    // do heightmap? Mundo fixo de 512x512 m, três resoluções.
    println!("== EXTENSÃO vs RESOLUÇÃO (mundo fixo 512x512 m) ==");
    println!(
        "   {:>9} | {:>6} | {:>9} | {:>6} | {:>5} | {:>9} | {:>11} | {:>9}",
        "grade", "célula", "mundo m", "nós", "lotes", "vias ms", "racion ms", "TOTAL ms"
    );
    for (n, cell) in [(128usize, 4.0f32), (256, 2.0), (512, 1.0)] {
        let r = full_pipeline_cell(n, cell, 42);
        println!(
            "   {:>9} | {:>6.1} | {:>9.0} | {:>6} | {:>5} | {:>9.2} | {:>11.2} | {:>9.2}",
            format!("{n}x{n}"), cell, n as f32 * cell, r.nodes, r.lots,
            r.t_roads_ms, r.t_rat_ms, r.t_total_ms
        );
    }
    println!();

    // --- Calibração de espaçamento viário ---------------------------------
    spacing_probe();

    // --- Distribuição de área das quadras ---------------------------------
    block_area_probe();

    // --- Relevo vs aproveitamento ----------------------------------------
    // A limitação declarada pelo upstream: terreno plano gera quadras
    // degeneradas. Quanto o relevo muda o aproveitamento quadras -> lotes?
    println!("== RELEVO vs APROVEITAMENTO (128x128, mundo 512 m) ==");
    println!(
        "   {:>7} | {:>8} | {:>7} | {:>5} | {:>13}",
        "relevo", "quadras", "lotes", "%", "lotes/quadra"
    );
    for relief in [0.0f32, 0.25, 0.5, 1.0, 2.0, 4.0] {
        let r = full_pipeline_relief(128, 4.0, relief, 42);
        let pct = if r.blocks > 0 { 100.0 * r.lots as f32 / r.blocks as f32 } else { 0.0 };
        println!(
            "   {:>7.2} | {:>8} | {:>7} | {:>4.1}% | {:>13.3}",
            relief, r.blocks, r.lots, pct, r.lots as f32 / r.blocks.max(1) as f32
        );
    }
    println!();

    // --- Separabilidade ---------------------------------------------------
    separability_probe();

    // --- Formato de saída -------------------------------------------------
    println!("== FORMATO DE SAÍDA (serde_json, trecho literal) ==");
    let r = full_pipeline(128, 42);
    println!("   RoadGraph JSON: {} bytes", r.graph_json.len());
    println!("   trecho: {}...", &r.graph_json[..r.graph_json.len().min(420)]);
    println!();
    println!("   BuildingLot[] JSON: {} bytes", r.lots_json.len());
    println!("   trecho: {}...", &r.lots_json[..r.lots_json.len().min(420)]);
}
