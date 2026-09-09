# external-engines/straight-skeleton

**Nada foi clonado para `upstream/`. Por decisão, não por falha.**

As duas implementações avaliadas são **copyleft**, por caminhos independentes:

| Implementação | Licença efetiva | Situação |
|---|---|---|
| `StrandedKitty/straight-skeleton` (CGAL via WASM) | **GPLv3+** — o invólucro é MIT, mas a CGAL `Straight_skeleton_2` é GPL | REFERÊNCIA APENAS |
| `lizelive/straight-skeleton` (crate Rust) | **GPL-2.0-or-later**, declarada no `Cargo.toml` | REFERÊNCIA APENAS |

O Archilly Generate é produto proprietário de navegador. Distribuir qualquer uma
das duas sujeitaria a aplicação inteira à GPL. A especificação manda **parar e
reportar** diante de dúvida de licença antes de copiar — aqui não houve dúvida,
houve impedimento, então nada foi copiado.

**As duas foram executadas** (retângulo e polígono em L) a partir de clones
temporários fora deste repositório, apenas para registro. Saídas literais em
`outputs/straight_skeleton_rust.txt` e `outputs/straight_skeleton_cgal_wasm.txt`.

**Recomendação: reimplementar em TypeScript**, a partir da literatura
(Felkel & Obdržálek 1998; Aichholzer et al. 1995/1996), que não é obra derivada
de nenhum dos dois repositórios. Fundamentação, casos de teste verificados e
proposta de contrato:
[`../../docs/STRAIGHT_SKELETON_ANALYSIS.md`](../../docs/STRAIGHT_SKELETON_ANALYSIS.md)
