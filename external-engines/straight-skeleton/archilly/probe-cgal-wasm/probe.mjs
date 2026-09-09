// Tentativa 2: o main.js foi compilado com -s ENVIRONMENT='web', então exige
// `window` / `importScripts`. Como também usa -s SINGLE_FILE (wasm embutido em
// base64), basta fornecer os globais de navegador para rodá-lo sob Node.
globalThis.window = globalThis;
globalThis.self = globalThis;
globalThis.document = { currentScript: null };
globalThis.location = { href: 'http://localhost/' };

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const Module = require('/tmp/claude-0/-home-user-archilly-lab/85cd5c0b-d7c7-5e26-afbb-903128fda18d/scratchpad/ss-ts/src/core/build/main.js');

function serialize(rings) {
  let size = 1;
  for (const r of rings) size += 1 + (r.length - 1) * 2;
  const u32 = new Uint32Array(size); const f32 = new Float32Array(u32.buffer);
  let o = 0;
  for (const r of rings) { u32[o++] = r.length - 1; for (let i=0;i<r.length-1;i++){ f32[o++]=r[i][0]; f32[o++]=r[i][1]; } }
  u32[o++] = 0; return f32.buffer;
}
function build(m, rings) {
  const buf = serialize(rings);
  const ip = m._malloc(buf.byteLength);
  m.HEAPU8.set(new Uint8Array(buf), ip);
  const ptr = m._create_straight_skeleton(ip);
  if (ptr === 0) return null;
  let off = ptr/4; const U=m.HEAPU32, F=m.HEAPF32;
  const vertices=[], polygons=[];
  const vc = U[off++];
  for (let i=0;i<vc;i++) vertices.push([F[off++],F[off++],F[off++]]);
  let pc = U[off++];
  while (pc>0){ const p=[]; for(let i=0;i<pc;i++) p.push(U[off++]); polygons.push(p); pc=U[off++]; }
  m._free(ptr); m._free(ip);
  return {vertices, polygons};
}
Module().then(m => {
  console.log('=== StrandedKitty/straight-skeleton 3.0.0 (CGAL via WASM) — prova mínima ===');
  console.log('Módulo WASM inicializado OK sob Node com shim de globais de navegador.\n');
  // Anel externo CCW, primeiro vértice repetido no fim (exigência do README).
  const rect = [[[0,0],[60,0],[60,30],[0,30],[0,0]]];
  const L = [[[0,0],[60,0],[60,30],[30,30],[30,60],[0,60],[0,0]]];
  for (const [name, poly] of [['RETANGULO 60x30', rect], ['POLIGONO EM L (60x60 rec. 30x30)', L]]) {
    const t=process.hrtime.bigint(); const r = build(m, poly); const dt=Number(process.hrtime.bigint()-t)/1e6;
    console.log(`--- ${name} --- (${dt.toFixed(3)} ms)`);
    if (!r) { console.log('  retornou null'); continue; }
    console.log('  vertices [x, y, time]:');
    r.vertices.forEach((v,i)=>console.log(`    ${i}: [${v.map(n=>+n.toFixed(3)).join(', ')}]`));
    console.log('  polygons (índices de vértices, uma face por aresta de entrada):');
    r.polygons.forEach((p,i)=>console.log(`    ${i}: [${p.join(', ')}]`));
    console.log();
  }
}).catch(e => { console.error('FALHA init:', e.message); process.exit(1); });
