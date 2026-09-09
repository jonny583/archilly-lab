use straight_skeleton::{skeleton, skeleton_constrained, Point, Polygon};

fn dump(name: &str, pts: &[Point]) {
    println!("--- {name} ---");
    println!("  entrada: {} vértices {:?}", pts.len(),
        pts.iter().map(|p| (p.x, p.y)).collect::<Vec<_>>());
    let poly = match Polygon::from_outer(pts) {
        Ok(p) => p,
        Err(e) => { println!("  Polygon::from_outer ERRO: {e:?}"); return; }
    };
    let t = std::time::Instant::now();
    match skeleton(&poly) {
        Ok(s) => {
            println!("  skeleton OK em {:?}", t.elapsed());
            println!("  nós={} arcos={}", s.nodes().len(), s.arc_count());
            for (i, n) in s.nodes().iter().enumerate() {
                println!("    nó {i}: pos=({},{}) offset={:.3} boundary={}",
                    n.position.x, n.position.y, n.offset, n.is_boundary());
            }
            for (i, a) in s.arcs().iter().enumerate() {
                println!("    arco {i}: sources={:?}", a.sources);
            }
        }
        Err(e) => println!("  skeleton ERRO: {e:?}"),
    }
    // offset interno (uso Archilly: recuo/testada)
    let limits = vec![5.0f32; pts.len()];
    match skeleton_constrained(&poly, &limits) {
        Ok(s) => {
            println!("  offset interno 5 u: residual loops={}", s.residual().len());
            for (i, loo) in s.residual().iter().enumerate() {
                let c: Vec<(i16,i16)> = loo.nodes.iter()
                    .map(|&n| { let p = s.node(n).position; (p.x, p.y) }).collect();
                println!("    residual {i}: {c:?}");
            }
        }
        Err(e) => println!("  skeleton_constrained ERRO: {e:?}"),
    }
    println!();
}

fn main() {
    println!("=== straight-skeleton (lizelive, Rust, GPL-2.0-or-later) — prova mínima ===\n");
    println!("Nota: coordenadas são i16 no reticulado inteiro, limitadas a -16384..=16383.\n");

    // Retângulo 60 x 30 (metros, se 1 unidade = 1 m)
    dump("RETÂNGULO 60x30", &[
        Point::new(0, 0), Point::new(60, 0), Point::new(60, 30), Point::new(0, 30),
    ]);

    // Polígono em L
    dump("POLÍGONO EM L (60x60 com recorte 30x30)", &[
        Point::new(0, 0), Point::new(60, 0), Point::new(60, 30),
        Point::new(30, 30), Point::new(30, 60), Point::new(0, 60),
    ]);

    // Quadra realista com coordenadas maiores (teste de limite)
    println!("--- TESTE DE LIMITE DE COORDENADAS ---");
    match Polygon::from_outer(&[
        Point::new(0, 0), Point::new(16000, 0), Point::new(16000, 8000), Point::new(0, 8000),
    ]) {
        Ok(p) => println!("  16000x8000 aceito; skeleton: {:?}", skeleton(&p).map(|s| s.arc_count())),
        Err(e) => println!("  16000x8000 REJEITADO: {e:?}"),
    }
}
