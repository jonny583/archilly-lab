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
