# tests/

Vazio nesta fase.

O LAB-00 é investigação e prova mínima de execução: as medições vivem em
`../archilly/probe/`, que é um executável de instrumentação, não uma suíte de
testes.

Os testes que a especificação exige (`test_minimal`, `test_coordinates`,
`test_output_conversion`, `test_validator_compatibility`) pressupõem um Adapter,
que só nasce na Etapa C. Serão escritos aqui quando houver o que testar.

Os testes do próprio motor estão no upstream (`../upstream/tests/integration.rs`)
e rodam com `cargo test` a partir de `../upstream/`.
