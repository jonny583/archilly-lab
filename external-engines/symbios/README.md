# external-engines/symbios

Motor: **Symbios Tensor** (`symbios-tensor`) — gerador procedural de traçado
urbano por campo tensorial sobre mapa de alturas.

```text
Upstream:          https://github.com/TheJanusStream/symbios-tensor
Versão upstream:   0.4.1
Commit:            c3f287556b98cc616d4263d163e6643ae32111ff  (2026-09-06)
Archilly revision: LAB-00 (investigação)
Licença:           MIT
Adapter:           não escrito
Status:            Experimental — SEGUIR PARA ETAPA B/C (Usos B e C)
```

Análise completa: [`../../docs/SYMBIOS_ANALYSIS.md`](../../docs/SYMBIOS_ANALYSIS.md)

## Pastas

| Pasta | Regra |
|---|---|
| `upstream/` | **Intocada.** Cópia byte a byte do commit acima, verificada com `cmp` arquivo a arquivo. Manifesto em `upstream/VERSION`. Não editar. |
| `archilly/` | Cópia de trabalho: o código **nosso** que chama o motor. Cada projeto **depende** do upstream por caminho e não o modifica. São três: `probe/`, o arranjo de medição do LAB-00; `wasm-probe/`, a prova de que o motor compila para `wasm32-unknown-unknown` (LAB-00, com `README.md` próprio); e `wasm/`, a ponte Rust que vira o `.wasm` que o `adapter/` carrega (LAB-01; como construir em `adapter/README.md`). *(Até 17/10/2026 esta linha dizia só `probe/`; `tests/o-trabalho-em-archilly.test.ts` confere que ela nomeia cada projeto que existe, e só eles.)* |
| `adapter/` | Vazia. Fase futura. |
| `tests/` | Testes do motor e da integração. |

## Alterações feitas pelo Archilly no upstream

**Nenhuma.** A correção necessária para compilar em `wasm32-unknown-unknown`
(o *flag* `getrandom_backend="wasm_js"`) é do lado consumidor: vive num crate de
fachada, não no motor. Ver `docs/SYMBIOS_ANALYSIS.md`, seção 10.

## Os `rust-toolchain.toml` de `archilly/` — cópias, com o comentário do upstream

Cada projeto de `archilly/` carrega um `rust-toolchain.toml`:

<!-- os-toolchains-de-archilly (LAB-190) -->
- `archilly/probe/rust-toolchain.toml`
- `archilly/wasm-probe/rust-toolchain.toml`
- `archilly/wasm/rust-toolchain.toml`
<!-- /os-toolchains-de-archilly -->

Os três são **byte a byte o `upstream/rust-toolchain.toml`**, de propósito: fixam
`channel = "1.96.1"`, a versão em que o autor conferiu o motor, e a cópia inteira
é o que impede a nossa versão de derivar da dele.

**O comentário em inglês dentro deles fala do CI do upstream, não do nosso.** A
frase *"CI reads THIS FILE via actions-rust-lang/setup-rust-toolchain"* é
verdade lá; o `.github/workflows/verde.yml` daqui **não usa essa ação**. Aqui
quem lê o arquivo é o próprio `rustup`, pela pasta: o passo que compila o `.wasm`
roda `rustup target add` e `cargo build` com `working-directory` em
`archilly/wasm`, e o `rustup` troca para a versão que o arquivo daquela pasta
fixa. Os outros dois projetos, `probe/` e `wasm-probe/`, nenhuma rotina compila.
E o *"local gate ran 1.96.1"* do comentário também é de lá: na máquina das
sessões, ao entrar em `archilly/wasm`, o `rustup` tenta baixar a 1.96.1 e o
proxy recusa o `static.rust-lang.org` (medido em 19/10/2026, no LAB-190; o
`rustc` que a máquina tem é o 1.97.0).

O comentário **não se edita**: mudar uma cópia por causa de um comentário a faz
divergir do upstream, e a cópia inteira é a garantia. Quem confere esta seção —
a lista nos dois sentidos, os bytes, a versão, a frase citada, a ação ausente e a
pasta do passo — é `external-engines/esteira/src/os-toolchains-de-archilly.ts`
(LAB-190, D418).

## Licença e obrigações

MIT. O arquivo `upstream/LICENSE` com o aviso de copyright original
(`Copyright (c) 2026 TheJanusStream`) está preservado e deve permanecer em
qualquer redistribuição. Todas as dependências transitivas são permissivas
(MIT/Apache-2.0); não há assets ou dados sob licença distinta.

## Rodar

```shell
cd upstream && cargo run --release --example full_city   # exemplo do autor
cd archilly/probe && cargo run --release                 # medições do LAB-00
```
