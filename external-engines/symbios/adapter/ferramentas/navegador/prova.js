/**
 * Prova mínima: o módulo WebAssembly do adaptador roda num navegador de verdade.
 *
 * Este arquivo é JavaScript puro e NÃO importa o adaptador. A razão é de escopo:
 * o que está em dúvida para o LAB-05 é se o `.wasm` carrega e executa no
 * navegador, e isso se responde sem o invólucro TypeScript. Trazer o adaptador
 * inteiro exigiria um empacotador, que é justamente a complexidade que o LAB-01
 * não precisa assumir.
 *
 * O marshalling aqui é o mesmo contrato de `src/motor.ts`: `archilly_alloc`,
 * `archilly_free`, e texto como `[u32 tamanho][UTF-8]`.
 */
const log = (t) => {
  document.getElementById("log").textContent += `${t}\n`;
};
document.getElementById("log").textContent = "";

const NX = 256;
const NY = 256;
const CELULA = 4;

// Relevo sintético: ondulado, com 45 m de desnível — o mesmo regime do terreno
// de 50 ha do laboratório.
const alturas = new Float32Array(NX * NY);
for (let iy = 0; iy < NY; iy++) {
  for (let ix = 0; ix < NX; ix++) {
    const x = (ix * CELULA) / 150;
    const y = (iy * CELULA) / 150;
    alturas[iy * NX + ix] =
      700 +
      22.5 *
        (0.55 * Math.sin(x * 1.6) * Math.cos(y * 1.1) +
          0.3 * Math.sin(x * 0.7 + y * 0.5) +
          0.15 * Math.cos(y * 2.3)) +
      y * 4;
  }
}

const t0 = performance.now();
const bytes = await (await fetch("./archilly_symbios_wasm.wasm")).arrayBuffer();
// Sem imports — é este `{}` que prova que o módulo não precisa de glue.
const { instance } = await WebAssembly.instantiate(bytes, {});
const ex = instance.exports;
log(`wasm: ${bytes.byteLength} bytes, instanciado em ${(performance.now() - t0).toFixed(1)} ms`);
log(`exports: ${Object.keys(ex).filter((k) => k.startsWith("archilly_")).join(", ")}`);

const escrever = (dados) => {
  const u8 = new Uint8Array(dados.buffer ?? dados, dados.byteOffset ?? 0, dados.byteLength);
  const ptr = ex.archilly_alloc(u8.byteLength);
  new Uint8Array(ex.memory.buffer, ptr, u8.byteLength).set(u8);
  return { ptr, len: u8.byteLength };
};
const lerTexto = (ptr) => {
  const n = new DataView(ex.memory.buffer).getUint32(ptr, true);
  const b = new Uint8Array(ex.memory.buffer, ptr + 4, n).slice();
  ex.archilly_free(ptr, 4 + n);
  return new TextDecoder().decode(b);
};

const pedido = {
  nx: NX, ny: NY, celula_m: CELULA, seed: 42,
  dist_principal_m: 200, dist_local_m: 80, passo_integracao_m: 4, raio_snap_m: 5.04,
  inercia_tracador: 0.8, max_passos_traco: 543, tolerancia_rdp_m: 0.84,
  raio_filete_principal_m: 20, raio_filete_local_m: 10, segmentos_filete: 6,
  passes_suavizacao_cota: 10, rampa_maxima: 0.1, tolerancia_convergencia: 0.01,
};

const p = escrever(new TextEncoder().encode(JSON.stringify(pedido)));
const a = escrever(alturas);
const id = ex.archilly_abrir(p.ptr, p.len, a.ptr, a.len);
ex.archilly_free(p.ptr, p.len);
ex.archilly_free(a.ptr, a.len);
if (id === 0) throw new Error("o motor recusou o pedido");
log(`sessão ${id} aberta (grade ${NX}×${NY}, mundo ${NX * CELULA}×${NY * CELULA} m)`);

for (const [nome, fn] of [
  ["vias", "archilly_gerar_vias"],
  ["racionalização", "archilly_racionalizar"],
  ["quadras", "archilly_extrair_quadras"],
]) {
  const t = performance.now();
  const codigo = ex[fn](id);
  log(`  ${nome.padEnd(16)} ${(performance.now() - t).toFixed(2).padStart(8)} ms  (código ${codigo})`);
}

const r = JSON.parse(lerTexto(ex.archilly_resultado(id)));
ex.archilly_fechar(id);
log(
  `resultado: ok=${r.ok} · motor ${r.versao_motor} · ${r.nos.length} nós · ` +
    `${r.arestas.length} arestas ativas · ${r.quadras.length} quadras`,
);
log(`estágios: ${r.estagios.join(" → ")}`);
log(`TOTAL no navegador: ${(performance.now() - t0).toFixed(1)} ms`);

// Desenho, para a prova ser visível e não só numérica.
const tela = document.getElementById("tela");
const ctx = tela.getContext("2d");
const k = tela.width / (NX * CELULA);
ctx.fillStyle = "#fafafa";
ctx.fillRect(0, 0, tela.width, tela.height);
ctx.lineWidth = 1;
ctx.strokeStyle = "#a1a1aa";
for (const perim of r.quadras) {
  ctx.beginPath();
  perim.forEach((i, j) => {
    const [x, z] = r.nos[i];
    const px = x * k;
    const py = tela.height - z * k;
    if (j === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  });
  ctx.closePath();
  ctx.stroke();
}
for (const [ia, ib, tipo] of r.arestas) {
  const [xa, za] = r.nos[ia];
  const [xb, zb] = r.nos[ib];
  ctx.strokeStyle = tipo === 0 ? "#1d4ed8" : "#dc2626";
  ctx.lineWidth = tipo === 0 ? 2 : 1;
  ctx.beginPath();
  ctx.moveTo(xa * k, tela.height - za * k);
  ctx.lineTo(xb * k, tela.height - zb * k);
  ctx.stroke();
}
log("desenho pronto: azul = via principal (contorno), vermelho = via local (gradiente)");
window.__provaConcluida = true;
