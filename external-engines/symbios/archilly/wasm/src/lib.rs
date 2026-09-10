//! Ponte WebAssembly entre o Archilly e o `symbios-tensor`.
//!
//! # O que esta camada é, e o que não é
//!
//! É a casca mais fina possível em volta do motor: recebe um mapa de alturas
//! já pronto, chama os estágios do Symbios **um a um**, e devolve o grafo
//! viário e as quadras como JSON. Nada de urbanismo mora aqui — metro, CRS,
//! rampa em porcento, gleba, APP e hierarquia viária são assunto do invólucro
//! TypeScript. Aqui dentro o vocabulário é o do motor.
//!
//! # Por que um estágio por chamada
//!
//! `std::time::Instant` não funciona em `wasm32-unknown-unknown` — não há
//! relógio. Como o LAB-01 exige o tempo de **cada** estágio, quem crona é o
//! JavaScript, e para isso cada estágio precisa ser uma chamada separada. A
//! sessão guarda o grafo entre as chamadas.
//!
//! Isso também expõe, na prática, a separabilidade que o LAB-00 provou: quem
//! quiser só a rede viária (Uso B) chama `archilly_gerar_vias` e
//! `archilly_racionalizar` e para ali; quem quiser quadras (Uso C) segue para
//! `archilly_extrair_quadras`.
//!
//! # Protocolo de memória
//!
//! Sem `wasm-bindgen`, de propósito: o módulo carrega com
//! `WebAssembly.instantiate` puro, no Node e no navegador, sem nenhuma
//! ferramenta além do `cargo`. O preço é marshalling à mão, e o contrato é:
//!
//! - `archilly_alloc(n)` devolve um ponteiro para `n` bytes;
//! - `archilly_free(ptr, n)` devolve esses bytes;
//! - toda saída de texto é um bloco `[u32 little-endian: tamanho][bytes UTF-8]`,
//!   liberado pelo chamador com `archilly_free(ptr, 4 + tamanho)`.

use std::cell::RefCell;
use std::collections::HashMap;

use serde::{Deserialize, Serialize};
use symbios_ground::HeightMap;
use symbios_tensor::{
    LotConfig, RationalizeConfig, RoadGraph, RoadType, TensorConfig, extract_blocks,
    generate_roads, rationalize_graph,
};

// ------------------------------------------------------------- entropia do SO

/// O backend `custom` do `getrandom`, que **recusa** entropia do sistema.
///
/// `rand 0.9` entra no grafo de dependências por causa do motor, e em wasm32 o
/// `getrandom` exige que alguém escolha de onde vem a aleatoriedade. A feature
/// `wasm_js` resolveria, mas arrasta `wasm-bindgen`: o módulo passaria a exigir
/// um import `__wbindgen_placeholder__` do ambiente, e deixaria de carregar com
/// `WebAssembly.instantiate(bytes, {})`. Com o backend `custom`, o `.wasm` sai
/// **sem import nenhum**.
///
/// A implementação devolve erro em vez de bytes. Isso é deliberado e é a parte que
/// importa: todo o caminho do Symbios usa `rand_pcg` semeado pela `seed` que o
/// adaptador passa — entropia do sistema não é usada, e **não pode** ser, porque
/// o LAB-01 exige saída idêntida para a mesma seed. Se algum dia uma chamada a
/// `OsRng` aparecer no caminho, ela falha aqui, alto e claro, em vez de
/// introduzir silenciosamente uma fonte de não-determinismo.
///
/// # Safety
///
/// Assinatura imposta pelo `getrandom`; `dest`/`len` descrevem o buffer que ele
/// quer preencher. Esta implementação não escreve nada nele.
#[unsafe(no_mangle)]
unsafe extern "Rust" fn __getrandom_v03_custom(
    _dest: *mut u8,
    _len: usize,
) -> Result<(), getrandom::Error> {
    Err(getrandom::Error::UNSUPPORTED)
}

// ---------------------------------------------------------------- protocolo

/// Pedido de abertura de sessão. Tudo já em unidades do motor (metros de mundo
/// e células de grade); a tradução do urbanismo é feita no TypeScript.
#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
struct Pedido {
    /// Colunas da grade (eixo X do mundo).
    nx: usize,
    /// Linhas da grade (eixo Z do mundo).
    ny: usize,
    /// Metros de mundo por célula.
    celula_m: f32,
    seed: u64,
    /// Espaçamento entre vias principais, em metros de mundo.
    dist_principal_m: f32,
    /// Espaçamento entre vias locais, em metros de mundo.
    dist_local_m: f32,
    passo_integracao_m: f32,
    raio_snap_m: f32,
    inercia_tracador: f32,
    max_passos_traco: u32,
    tolerancia_rdp_m: f32,
    raio_filete_principal_m: f32,
    raio_filete_local_m: f32,
    segmentos_filete: u32,
    passes_suavizacao_cota: u32,
    /// Rampa máxima como fração (0,10 = 10 %).
    rampa_maxima: f32,
    tolerancia_convergencia: f32,
}

/// Um nó do grafo: `[x, z, cota]`, em metros de mundo do motor.
type NoJson = [f32; 3];

/// Uma aresta ativa: `[no_inicial, no_final, tipo]`, tipo 0 = principal
/// (contorno), 1 = local (gradiente).
type ArestaJson = [u32; 3];

#[derive(Serialize, Default)]
struct Resposta {
    ok: bool,
    /// Preenchido só quando `ok` é falso.
    erro: Option<String>,
    nos: Vec<NoJson>,
    arestas: Vec<ArestaJson>,
    /// Perímetros das quadras, por índice de nó.
    quadras: Vec<Vec<u32>>,
    /// Contagens cruas do motor, para o diagnóstico.
    nos_totais: usize,
    arestas_totais: usize,
    arestas_ativas: usize,
    /// Estágios que efetivamente rodaram nesta sessão.
    estagios: Vec<String>,
    versao_motor: String,
}

// ------------------------------------------------------------------ sessão

struct Sessao {
    hm: HeightMap,
    cfg: TensorConfig,
    rat: RationalizeConfig,
    grafo: Option<RoadGraph>,
    erro: Option<String>,
    estagios: Vec<String>,
}

thread_local! {
    /// `wasm32-unknown-unknown` é monothread; um `thread_local` basta e evita
    /// `static mut`, que é `unsafe` e desnecessário aqui.
    static SESSOES: RefCell<HashMap<u32, Sessao>> = RefCell::new(HashMap::new());
    static PROXIMO_ID: RefCell<u32> = const { RefCell::new(1) };
}

// ------------------------------------------------------------- marshalling

/// Reserva `n` bytes e devolve o ponteiro. O chamador escreve neles.
#[unsafe(no_mangle)]
pub extern "C" fn archilly_alloc(n: usize) -> *mut u8 {
    let mut v = Vec::<u8>::with_capacity(n);
    let p = v.as_mut_ptr();
    std::mem::forget(v);
    p
}

/// Devolve `n` bytes reservados por [`archilly_alloc`] ou por um retorno de
/// texto (onde `n` é `4 + tamanho`).
///
/// # Safety
///
/// `ptr` tem de ter vindo de [`archilly_alloc`] (ou de um retorno de texto
/// desta biblioteca) com exatamente o mesmo `n`, e não pode ser liberado duas
/// vezes.
#[unsafe(no_mangle)]
pub unsafe extern "C" fn archilly_free(ptr: *mut u8, n: usize) {
    if ptr.is_null() {
        return;
    }
    drop(unsafe { Vec::from_raw_parts(ptr, 0, n) });
}

/// Empacota texto como `[u32 tamanho][UTF-8]` e entrega a posse ao chamador.
fn devolver_texto(s: String) -> *mut u8 {
    let bytes = s.into_bytes();
    let mut buf = Vec::<u8>::with_capacity(4 + bytes.len());
    buf.extend_from_slice(&(bytes.len() as u32).to_le_bytes());
    buf.extend_from_slice(&bytes);
    let p = buf.as_mut_ptr();
    std::mem::forget(buf);
    p
}

// -------------------------------------------------------------- ciclo de vida

/// Abre uma sessão com o mapa de alturas e a configuração.
///
/// Devolve o identificador da sessão, ou `0` se o pedido não puder ser lido —
/// que é o único erro possível antes de existir sessão onde guardar a mensagem.
///
/// As alturas entram como **bytes**, não como `f32` — `alturas_len` é o tamanho em
/// bytes, e tem de ser `nx * ny * 4`. É assim de propósito: `archilly_alloc`
/// devolve um bloco alinhado a 1, e ler isso como `*const f32` seria um
/// comportamento indefinido que funciona por acidente na maioria dos
/// alocadores. `f32::from_le_bytes` custa nada e não depende de sorte.
///
/// # Safety
///
/// `pedido_ptr`/`pedido_len` descrevem JSON UTF-8 válido e
/// `alturas_ptr`/`alturas_len` um bloco de `nx * ny * 4` bytes com `f32`
/// little-endian, ambos reservados por [`archilly_alloc`] e válidos durante a
/// chamada.
#[unsafe(no_mangle)]
pub unsafe extern "C" fn archilly_abrir(
    pedido_ptr: *const u8,
    pedido_len: usize,
    alturas_ptr: *const u8,
    alturas_len: usize,
) -> u32 {
    let bytes = unsafe { std::slice::from_raw_parts(pedido_ptr, pedido_len) };
    let Ok(p) = serde_json::from_slice::<Pedido>(bytes) else {
        return 0;
    };
    let Some(esperado) = p.nx.checked_mul(p.ny).and_then(|n| n.checked_mul(4)) else {
        return 0;
    };
    if p.nx < 2 || p.ny < 2 || alturas_len != esperado || !p.celula_m.is_finite() {
        return 0;
    }

    let mut hm = HeightMap::new(p.nx, p.ny, p.celula_m);
    let cru = unsafe { std::slice::from_raw_parts(alturas_ptr, alturas_len) };
    for (celula, quatro) in hm.data_mut().iter_mut().zip(cru.chunks_exact(4)) {
        *celula = f32::from_le_bytes([quatro[0], quatro[1], quatro[2], quatro[3]]);
    }

    let cfg = TensorConfig {
        seed: p.seed,
        step_size: p.passo_integracao_m,
        major_road_dist: p.dist_principal_m,
        minor_road_dist: p.dist_local_m,
        snap_radius: p.raio_snap_m,
        max_trace_steps: p.max_passos_traco,
        tracer_inertia: p.inercia_tracador,
        ..TensorConfig::default()
    };
    let rat = RationalizeConfig {
        enabled: true,
        rdp_tolerance: p.tolerancia_rdp_m,
        major_fillet_radius: p.raio_filete_principal_m,
        minor_fillet_radius: p.raio_filete_local_m,
        fillet_segments: p.segmentos_filete,
        elevation_smooth_passes: p.passes_suavizacao_cota,
        max_grade: p.rampa_maxima,
        convergence_tolerance: p.tolerancia_convergencia,
    };

    let id = PROXIMO_ID.with(|n| {
        let mut n = n.borrow_mut();
        let id = *n;
        *n += 1;
        id
    });
    SESSOES.with(|s| {
        s.borrow_mut().insert(
            id,
            Sessao {
                hm,
                cfg,
                rat,
                grafo: None,
                erro: None,
                estagios: Vec::new(),
            },
        )
    });
    id
}

/// Fecha a sessão e devolve a memória dela.
#[unsafe(no_mangle)]
pub extern "C" fn archilly_fechar(id: u32) {
    SESSOES.with(|s| s.borrow_mut().remove(&id));
}

/// Roda um estágio sobre a sessão. Devolve 0 em sucesso, -1 se a sessão não
/// existe, -2 se o estágio falhou (a mensagem fica na sessão).
fn com_sessao(id: u32, nome: &str, f: impl FnOnce(&mut Sessao) -> Result<(), String>) -> i32 {
    SESSOES.with(|s| {
        let mut mapa = s.borrow_mut();
        let Some(sessao) = mapa.get_mut(&id) else {
            return -1;
        };
        match f(sessao) {
            Ok(()) => {
                sessao.estagios.push(nome.to_string());
                0
            }
            Err(e) => {
                sessao.erro = Some(e);
                -2
            }
        }
    })
}

// ------------------------------------------------------------------ estágios

/// Estágio 1 — traça a rede viária pelo campo tensorial.
#[unsafe(no_mangle)]
pub extern "C" fn archilly_gerar_vias(id: u32) -> i32 {
    com_sessao(id, "vias", |s| {
        let g = generate_roads(&s.hm, &s.cfg).map_err(|e| e.to_string())?;
        s.grafo = Some(g);
        Ok(())
    })
}

/// Estágio 2 — racionaliza: endireita, filetа curvas, suaviza cotas e limita a
/// rampa. É o estágio caro: O(N²) na contagem de nós, medido no LAB-00.
#[unsafe(no_mangle)]
pub extern "C" fn archilly_racionalizar(id: u32) -> i32 {
    com_sessao(id, "racionalizacao", |s| {
        let Some(g) = s.grafo.as_mut() else {
            return Err("racionalizar sem rede viária gerada".into());
        };
        rationalize_graph(g, &s.hm, &s.rat);
        Ok(())
    })
}

/// Estágio 3 — extrai as quadras como faces do grafo planar.
#[unsafe(no_mangle)]
pub extern "C" fn archilly_extrair_quadras(id: u32) -> i32 {
    com_sessao(id, "quadras", |s| {
        let Some(g) = s.grafo.as_mut() else {
            return Err("extrair quadras sem rede viária gerada".into());
        };
        extract_blocks(g);
        Ok(())
    })
}

/// Injeta um grafo viário construído FORA do motor e extrai as quadras dele.
///
/// Existe para manter viva, em código, a prova do LAB-00 de que o Uso C é real:
/// o Archilly entrega os eixos e o Symbios devolve as faces. `nos` são `f32`
/// little-endian em triplas `[x, z, cota]` e `arestas` são `u32` little-endian em
/// triplas `[a, b, tipo]`; os dois comprimentos são em **bytes**, pela mesma razão
/// de alinhamento de [`archilly_abrir`].
///
/// # Safety
///
/// Os dois blocos têm de ser válidos durante a chamada, com tamanho múltiplo de
/// 12 bytes, e os índices de `arestas` dentro de `nos`.
#[unsafe(no_mangle)]
pub unsafe extern "C" fn archilly_quadras_de_grafo_externo(
    id: u32,
    nos_ptr: *const u8,
    nos_len: usize,
    arestas_ptr: *const u8,
    arestas_len: usize,
) -> i32 {
    let nos_cru = unsafe { std::slice::from_raw_parts(nos_ptr, nos_len) };
    let arestas_cru = unsafe { std::slice::from_raw_parts(arestas_ptr, arestas_len) };
    com_sessao(id, "quadras-de-grafo-externo", |s| {
        if nos_len % 12 != 0 || arestas_len % 12 != 0 {
            return Err("nós e arestas precisam vir em triplas de 4 bytes".into());
        }
        let ler_f32 = |b: &[u8]| f32::from_le_bytes([b[0], b[1], b[2], b[3]]);
        let ler_u32 = |b: &[u8]| u32::from_le_bytes([b[0], b[1], b[2], b[3]]);
        let nos: Vec<f32> = nos_cru.chunks_exact(4).map(ler_f32).collect();
        let arestas: Vec<u32> = arestas_cru.chunks_exact(4).map(ler_u32).collect();

        let total = nos.len() / 3;
        let mut g = RoadGraph::default();
        for t in nos.chunks_exact(3) {
            g.add_node_with_elevation(glam::Vec2::new(t[0], t[1]), t[2]);
        }
        for t in arestas.chunks_exact(3) {
            let (a, b) = (t[0], t[1]);
            if a as usize >= total || b as usize >= total {
                return Err("aresta aponta para nó inexistente".into());
            }
            let tipo = if t[2] == 0 {
                RoadType::Major
            } else {
                RoadType::Minor
            };
            g.add_edge(a, b, tipo);
        }
        extract_blocks(&mut g);
        s.grafo = Some(g);
        Ok(())
    })
}

/// Roda o estágio de lotes do motor e devolve quantos saíram.
///
/// **Não faz parte da cadeia do LAB-01** e não é usado pelo adaptador: o LAB-00
/// estabeleceu que `BuildingLot` é pegada de edificação, não parcela, e que o
/// parcelamento continua sendo do Archilly. Está aqui só para que o LAB-03
/// possa medir o que o motor produziria, sem reabrir o `wasm`.
///
/// Devolve a contagem, ou -1 se a sessão não existe, ou -2 sem grafo.
#[unsafe(no_mangle)]
pub extern "C" fn archilly_contar_edificacoes(id: u32) -> i32 {
    SESSOES.with(|s| {
        let mut mapa = s.borrow_mut();
        let Some(sessao) = mapa.get_mut(&id) else {
            return -1;
        };
        let Some(g) = sessao.grafo.as_ref() else {
            return -2;
        };
        let lots = symbios_tensor::extract_lots(g, &mut sessao.hm, &LotConfig::default());
        lots.len() as i32
    })
}

// ------------------------------------------------------------------ resultado

/// Serializa o estado da sessão como JSON e entrega o texto ao chamador.
///
/// Só arestas **ativas** saem: o motor deixa as inativas no vetor depois de
/// dividir uma aresta, e quem consumir sem filtrar conta rua que não existe.
#[unsafe(no_mangle)]
pub extern "C" fn archilly_resultado(id: u32) -> *mut u8 {
    let json = SESSOES.with(|s| {
        let mapa = s.borrow();
        let Some(sessao) = mapa.get(&id) else {
            return serde_json::to_string(&Resposta {
                ok: false,
                erro: Some(format!("sessão {id} não existe")),
                ..Default::default()
            })
            .unwrap_or_default();
        };

        let mut r = Resposta {
            ok: sessao.erro.is_none(),
            erro: sessao.erro.clone(),
            estagios: sessao.estagios.clone(),
            // A versão do MOTOR, lida do Cargo.toml do upstream pelo build.rs —
            // não a desta ponte. Ver build.rs.
            versao_motor: env!("SYMBIOS_VERSAO").to_string(),
            ..Default::default()
        };

        if let Some(g) = sessao.grafo.as_ref() {
            r.nos_totais = g.nodes.len();
            r.arestas_totais = g.edges.len();

            // Só os nós realmente usados por aresta ativa viajam, e os índices
            // são renumerados. Sem isso, 80 % do JSON seria nó órfão de aresta
            // desativada por split — peso puro na fronteira wasm→JS.
            let mut novo_indice = vec![u32::MAX; g.nodes.len()];
            for e in g.edges.iter().filter(|e| e.active) {
                for antigo in [e.start, e.end] {
                    if novo_indice[antigo as usize] == u32::MAX {
                        novo_indice[antigo as usize] = r.nos.len() as u32;
                        let n = &g.nodes[antigo as usize];
                        r.nos.push([n.position.x, n.position.y, n.elevation]);
                    }
                }
            }
            for e in g.edges.iter().filter(|e| e.active) {
                r.arestas.push([
                    novo_indice[e.start as usize],
                    novo_indice[e.end as usize],
                    match e.road_type {
                        RoadType::Major => 0,
                        RoadType::Minor => 1,
                    },
                ]);
            }
            r.arestas_ativas = r.arestas.len();

            // Uma quadra pode citar nó que nenhuma aresta ativa usa. Em vez de
            // descartar a quadra, o nó entra na lista — perder a face por um
            // vértice seria perder geometria boa.
            let mut nos = r.nos;
            let mut indice = novo_indice;
            for b in &g.blocks {
                let mut perimetro = Vec::with_capacity(b.perimeter.len());
                for &antigo in &b.perimeter {
                    if indice[antigo as usize] == u32::MAX {
                        indice[antigo as usize] = nos.len() as u32;
                        let n = &g.nodes[antigo as usize];
                        nos.push([n.position.x, n.position.y, n.elevation]);
                    }
                    perimetro.push(indice[antigo as usize]);
                }
                r.quadras.push(perimetro);
            }
            r.nos = nos;
        }

        serde_json::to_string(&r).unwrap_or_else(|e| {
            format!(r#"{{"ok":false,"erro":"falha ao serializar: {e}"}}"#)
        })
    });
    devolver_texto(json)
}
