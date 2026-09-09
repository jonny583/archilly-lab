# archilly/ — arranjos de medição do esqueleto reto

Código **próprio**, escrito para o LAB-00. Ele apenas chama a API pública de
cada implementação; não contém, não deriva e não redistribui código GPL.

**Os dois motores não estão neste repositório** — são GPL e a triagem os
classificou como REFERÊNCIA APENAS. Para reproduzir, clone-os num diretório
temporário, fora deste repositório, e ajuste os caminhos.

## `probe-rust/` — lizelive/straight-skeleton (GPL-2.0-or-later)

```shell
git clone https://github.com/lizelive/straight-skeleton.git /tmp/straight-skeleton
cd probe-rust && cargo run --release
```

Mede: esqueleto de um retângulo 60×30 e de um polígono em L, offset interno de
5 unidades (`skeleton_constrained` + `residual()`), e o limite de coordenadas do
reticulado `i16`. Saída de referência: `outputs/straight_skeleton_rust.txt`.

## `probe-cgal-wasm/` — StrandedKitty/straight-skeleton (GPLv3+ via CGAL)

```shell
git clone https://github.com/StrandedKitty/straight-skeleton.git /tmp/ss-ts
node probe.mjs      # ajuste o caminho do require() para /tmp/ss-ts
```

O `main.js` do upstream é compilado com `-s ENVIRONMENT='web'` e recusa rodar sob
Node. Como também usa `-s SINGLE_FILE` (o `.wasm` vai embutido em base64, sem
`fetch`), o probe simula os globais de navegador (`window`, `self`, `document`,
`location`) e o módulo inicializa normalmente.
Saída de referência: `outputs/straight_skeleton_cgal_wasm.txt`.

## Por que isto fica versionado

Os dois casos de teste — retângulo 60×30 e L de 60×60 com recorte 30×30 —
produziram geometria **idêntica** nas duas implementações, obtidas por
algoritmos e linguagens independentes. Isso é um oráculo verificado para a
reimplementação em TypeScript que a análise recomenda.
