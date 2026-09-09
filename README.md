# archilly-lab

Laboratório de motores externos para o **Archilly Generate**.

> **Comece por aqui:** [`docs/ONDE_PARAMOS.md`](docs/ONDE_PARAMOS.md)

---

## O que é isto

O Archilly Generate (`jonny583/urban-create-hub-41d93a4d`, branch `motor-v2`)
gera loteamentos com dois motores próprios — Geométrico e Fishbone — mais um
**Validator** (regras urbanísticas e invariantes) e um **Judge** (compara
soluções).

A hipótese deste laboratório: **motores open source podem alimentar o Generate**,
no todo ou em partes, por trás de um adaptador isolado, sempre passando pelo
Validator e pelo Judge.

## Regra de ouro

```text
UPSTREAM              ARCHILLY               ADAPTER              ARCHILLY
(original,     ──>    (cópia de       ──>    (ponte)      ──>     GENERATE
 intocado)             trabalho)
```

1. **`upstream/` é intocável.** Cópia exata do motor original, com commit e data
   registrados em `VERSION`. Não se edita, não se aplica patch, não se
   "corrige". É backup técnico e referência de auditoria.
2. **O trabalho acontece em `archilly/`.** Qualquer modificação, experimento ou
   arranjo de medição vive ali, documentado.
3. **`adapter/` é a única fronteira.** Só ele conhece detalhes do motor. Trocar
   o motor não deve exigir mexer em nada fora dessa pasta.
4. **O Generate nunca depende disto.** Nesta fase, nada daqui entra no produto.
   Se nenhum motor provar valor, `external-engines/` inteiro pode ser apagado
   sem que o Generate sinta.

## Estado atual — LAB-00 concluído

**Etapa A (investigação) + prova mínima de execução.** Nenhum Adapter foi
escrito, nenhum dado do Archilly foi convertido, o repositório do Generate não
foi tocado.

| Motor | Licença | Navegador? | Executou? | Veredito |
|---|---|---|---|---|
| [Symbios Tensor](docs/SYMBIOS_ANALYSIS.md) | MIT | **sim** — WASM 159 KB | **sim**, 153 ms | **SEGUIR PARA ETAPA B/C** (rede viária + quadras) |
| [straight-skeleton (CGAL/WASM)](docs/STRAIGHT_SKELETON_ANALYSIS.md) | **GPLv3+** | contamina | sim | REFERÊNCIA APENAS |
| [straight-skeleton (Rust)](docs/STRAIGHT_SKELETON_ANALYSIS.md) | **GPLv2+** | contamina | sim | REFERÊNCIA APENAS |
| [PackingSolver](docs/PACKINGSOLVER_TRIAGEM.md) | MIT | não (servidor) | não | REFERÊNCIA APENAS |

Triagem completa, com evidências: [`docs/TRIAGEM.md`](docs/TRIAGEM.md).

## Estrutura

```text
archilly-lab/
├── docs/
│   ├── ONDE_PARAMOS.md               ← estado do laboratório
│   ├── LABORATORIO.md                ← especificação (Etapas A a G)
│   ├── TRIAGEM.md                    ← tabela comparativa e vereditos
│   ├── SYMBIOS_ANALYSIS.md
│   ├── STRAIGHT_SKELETON_ANALYSIS.md
│   └── PACKINGSOLVER_TRIAGEM.md
├── external-engines/
│   ├── symbios/
│   │   ├── upstream/                 ← symbios-tensor 0.4.1, INTOCADO
│   │   ├── archilly/probe/           ← arranjo de medição (LAB-00)
│   │   ├── adapter/                  ← vazio: fase futura
│   │   └── tests/
│   ├── straight-skeleton/            ← nada clonado: licença impeditiva
│   └── packingsolver/                ← nada clonado: triagem não recomendou
├── outputs/                          ← saídas literais das execuções
└── README.md
```

## Reproduzir as medições

Requer `cargo` (o `rust-toolchain.toml` fixa a versão e o `rustup` a baixa).

```shell
# Prova mínima do upstream, sem nenhuma entrada do Archilly
cd external-engines/symbios/upstream
cargo run --release --example full_city

# Medições do laboratório: determinismo, performance, separabilidade, calibração
cd external-engines/symbios/archilly/probe
cargo run --release            # saída de referência em outputs/symbios_probe.txt
```

## O que este laboratório não faz

Não escreve Adapter, não converte dados do Archilly, não toca no repositório do
Generate, não copia código de motor para fora de `upstream/`, não modifica
`upstream/` e não otimiza nada. "Não consegui compilar" é resultado válido e
fica registrado — foi o que aconteceu com o WebAssembly na primeira tentativa
(ver `docs/SYMBIOS_ANALYSIS.md`, seção 10).
