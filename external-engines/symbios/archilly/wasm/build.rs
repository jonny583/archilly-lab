//! Lê a versão do motor no `Cargo.toml` do upstream, em tempo de compilação.
//!
//! Sem isto, `versao_motor` no diagnóstico reportava a versão da PONTE (0.1.0) em
//! vez da do motor (0.4.1) — número errado num campo cuja única razão de existir é
//! rastreabilidade. Escrever "0.4.1" à mão resolveria hoje e mentiria no dia em que
//! o upstream subisse de versão; ler do arquivo não tem esse defeito.
use std::path::Path;

fn main() {
    let manifesto = Path::new("../../upstream/Cargo.toml");
    println!("cargo:rerun-if-changed={}", manifesto.display());

    let texto = std::fs::read_to_string(manifesto)
        .unwrap_or_else(|e| panic!("não consegui ler {}: {e}", manifesto.display()));

    // A primeira linha `version = "..."` do arquivo é a do `[package]`; as
    // dependências vêm depois e usam `version = ` dentro de chaves.
    let versao = texto
        .lines()
        .find_map(|l| l.strip_prefix("version = "))
        .map(|v| v.trim().trim_matches('"'))
        .unwrap_or_else(|| panic!("não achei `version` em {}", manifesto.display()));

    println!("cargo:rustc-env=SYMBIOS_VERSAO={versao}");
}
