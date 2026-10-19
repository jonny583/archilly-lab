# wasm-probe — prova de compilação para WebAssembly

Crate de fachada que existe por um motivo só: provar que o `symbios-tensor`
compila para `wasm32-unknown-unknown`, que é o alvo do Archilly Generate.

Ele **não modifica o upstream**. A correção necessária é do lado consumidor:
`rand 0.9` puxa `getrandom 0.3`, que em wasm32 exige escolha explícita de
backend. Declarar `getrandom` com a feature `wasm_js` aqui e compilar com o
`--cfg` correspondente resolve, sem tocar no motor.

```shell
rustup target add wasm32-unknown-unknown
RUSTFLAGS='--cfg getrandom_backend="wasm_js"' \
  cargo build --release --target wasm32-unknown-unknown
```

Resultado medido no LAB-00: `symbios_wasm_probe.wasm`, **162 696 bytes**,
compilado em 12,54 s. Sem dependência nativa, sem C++, sem emscripten.

Sem esse `--cfg`, a compilação falha com
`error: The wasm32-unknown-unknown targets are not supported by default`.
Isso está registrado como a primeira tentativa em
`docs/SYMBIOS_ANALYSIS.md`, seção 10.

## O que esta sonda é hoje, e o que a pasta carrega (LAB-189)

O texto acima é do LAB-00 (09/09/2026) e diz a sonda daquele dia. **O `.wasm` que
o adaptador, a bancada e as ferramentas `labNN.ts` carregam não é o desta pasta**:
é o da ponte, [`../wasm/`](../wasm/), que nasceu no LAB-01. Ninguém carrega o
`symbios_wasm_probe.wasm`, e o `conferir.sh` não o compila.

**A ponte não usa a receita de cima.** O `getrandom` com a feature `wasm_js`
compila, mas arrasta a cola do JavaScript — o `Cargo.lock` desta pasta traz
`wasm-bindgen` e `js-sys` —, e o `.wasm` sai pedindo coisa ao ambiente. A ponte
sai pelo backend `custom` (`--cfg getrandom_backend="custom"`, a receita que o
`conferir.sh` imprime). A sonda fica **com a cola, de propósito**: é ela que
explica a escolha da ponte, e a trava do LAB-176
(`external-engines/esteira/src/o-wasm-nao-pede-nada.ts`) a declara como sonda.

O que o `git` carrega aqui, além desta página:

<!-- a-pasta-da-sonda (LAB-189) -->
- `Cargo.toml` — a fachada: o `symbios-tensor` por caminho (`../../upstream`),
  sem `[patch]` nem `[replace]`, e o `getrandom` com `wasm_js`.
- `Cargo.lock` — a cadeia que a página conta: `rand 0.9` → `rand_core` →
  `getrandom 0.3`; e a cola, `wasm-bindgen` e `js-sys`. Nenhum pacote de
  compilação nativa (`cc`, `cmake`, `pkg-config`, `bindgen`).
- `rust-toolchain.toml` — byte a byte o do `upstream/`: o comentário em inglês
  fala do CI de lá, não do daqui.
- `src/lib.rs` — `probe_lot_count`: a pipeline inteira num terreno plano, e
  devolve o número de lotes.
<!-- /a-pasta-da-sonda -->

O `.wasm` e a pasta `target/` não são versionados.

**Os números do LAB-00 moram em dois lugares**: esta página (162 696 bytes,
12,54 s) e a seção 10 de `docs/SYMBIOS_ANALYSIS.md` (que os dá também como
159 KB). `external-engines/esteira/src/a-pagina-da-sonda.ts` (LAB-189, D417)
confere que os dois dizem o mesmo — não que o binário de hoje dá aqueles
números: nada o compila, e nesta máquina falta o alvo do `rustup`.
