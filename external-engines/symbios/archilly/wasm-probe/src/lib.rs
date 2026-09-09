use symbios_ground::HeightMap;
use symbios_tensor::*;

/// Minimal WASM-facing probe: runs the full pipeline and returns lot count.
#[unsafe(no_mangle)]
pub extern "C" fn probe_lot_count(size: u32) -> u32 {
    let hm = HeightMap::new(size as usize, size as usize, 4.0);
    let cfg = TensorConfig::default();
    let Ok(mut graph) = generate_roads(&hm, &cfg) else { return u32::MAX };
    rationalize_graph(&mut graph, &hm, &RationalizeConfig::default());
    extract_blocks(&mut graph);
    let mut hm2 = hm;
    let lots = extract_lots(&graph, &mut hm2, &LotConfig::default());
    lots.len() as u32
}
