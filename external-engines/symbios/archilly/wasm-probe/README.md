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
