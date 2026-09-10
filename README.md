# archilly-lab

Laboratório de motores externos para o **Archilly Generate**.

> **Comece por aqui:** [`docs/ONDE_PARAMOS.md`](docs/ONDE_PARAMOS.md)
> · roteiro completo: [`docs/FILA.md`](docs/FILA.md)

---

## O que é isto

O Archilly Generate (`jonny583/urban-create-hub-41d93a4d`, branch `main` — a
`motor-v2` foi promovida a `main` em 08/09/2026)
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

## Estado atual — LAB-01 concluído

**Etapas A, B e C**, no escopo Usos B (rede viária) e C (quadras). O Adapter
existe e vai de ponta a ponta. Nada é recortado pela gleba nem validado — isso é
o LAB-02. O repositório do Generate não foi tocado.

> ### Geometria utilizável: **SIM COM RESSALVAS**
>
> Um terreno do Geo entra pelo contrato `archilly-terreno`, vira mapa de alturas,
> atravessa o Symbios num `.wasm` de 189 KB **sem import nenhum**, e volta como
> eixos com hierarquia e rampa e quadras com área — em metros, georreferenciado,
> determinístico por seed, 200 ha em 5,7 s.
>
> As ressalvas: a rampa estoura **nos cruzamentos** (nunca ao longo da via),
> 38 % do comprimento de via nasce fora da gleba, e o traçado é topograficamente
> responsivo mas urbanisticamente cru.

Relatório com todas as medições:
[`docs/relatorios/LAB01_ADAPTADOR.md`](docs/relatorios/LAB01_ADAPTADOR.md).
Decisões e o porquê de cada uma: [`docs/DECISOES.md`](docs/DECISOES.md).

### Os motores, depois da triagem do LAB-00

| Motor | Licença | Navegador? | Veredito |
|---|---|---|---|
| [Symbios Tensor](docs/SYMBIOS_ANALYSIS.md) | MIT | **sim** — WASM 189 KB | **EM USO** — Adapter no LAB-01 |
| [straight-skeleton (CGAL/WASM)](docs/STRAIGHT_SKELETON_ANALYSIS.md) | **GPLv3+** | contamina | REFERÊNCIA APENAS |
| [straight-skeleton (Rust)](docs/STRAIGHT_SKELETON_ANALYSIS.md) | **GPLv2+** | contamina | REFERÊNCIA APENAS |
| [PackingSolver](docs/PACKINGSOLVER_TRIAGEM.md) | MIT | não (servidor) | REFERÊNCIA APENAS |

Triagem completa, com evidências: [`docs/TRIAGEM.md`](docs/TRIAGEM.md).

## Estrutura

```text
archilly-lab/
├── docs/
│   ├── ONDE_PARAMOS.md               ← estado do laboratório
│   ├── FILA.md                       ← roteiro LAB-00 a LAB-06
│   ├── DECISOES.md                   ← as decisões, numeradas, com o porquê
│   ├── LABORATORIO.md                ← especificação (Etapas A a G)
│   ├── TRIAGEM.md                    ← tabela comparativa e vereditos
│   ├── SYMBIOS_ANALYSIS.md
│   ├── STRAIGHT_SKELETON_ANALYSIS.md
│   ├── PACKINGSOLVER_TRIAGEM.md
│   ├── relatorios/
│   │   └── LAB01_ADAPTADOR.md        ← as medições do adaptador
│   └── terrenos/                     ← 4 terrenos no contrato archilly-terreno
├── external-engines/
│   ├── symbios/
│   │   ├── upstream/                 ← symbios-tensor 0.4.1, INTOCADO
│   │   ├── archilly/
│   │   │   ├── wasm/                 ← ponte Rust → .wasm, zero imports
│   │   │   ├── probe/                ← medições do LAB-00
│   │   │   └── wasm-probe/           ← prova de compilação do LAB-00
│   │   ├── adapter/                  ← O ADAPTADOR (LAB-01)
│   │   └── tests/
│   ├── straight-skeleton/            ← nada clonado: licença impeditiva
│   └── packingsolver/                ← nada clonado: triagem não recomendou
├── outputs/                          ← saídas literais das execuções
└── README.md
```

## Reproduzir

Requer `cargo` e Node 22+. **Nenhuma dependência npm.**

```shell
# --- LAB-01: o adaptador ---
cd external-engines/symbios/archilly/wasm
rustup target add wasm32-unknown-unknown
RUSTFLAGS='--cfg getrandom_backend="custom"' \
  cargo build --release --target wasm32-unknown-unknown

cd ../../adapter
node --experimental-strip-types ferramentas/gerar-terrenos.ts     # docs/terrenos/
node --experimental-strip-types ferramentas/medir.ts              # outputs/lab01/
node --experimental-strip-types ferramentas/diagnostico-rampa.ts
cd ferramentas/navegador && npx http-server -p 8099 .             # a prova no navegador

# --- LAB-00: a investigação ---
cd external-engines/symbios/upstream       && cargo run --release --example full_city
cd external-engines/symbios/archilly/probe && cargo run --release
```

## O que este laboratório não faz

Não toca no repositório do Generate nem no do Geo (os dois foram clonados
**somente para leitura**), não copia código de motor para fora de `upstream/`,
não modifica `upstream/`, e não otimiza nada.

O Adapter existe desde o LAB-01, mas **não recorta pela gleba, não aplica
restrições, não parcela em lotes, não valida e não julga** — cada uma dessas
coisas é de um prompt adiante, e misturá-las agora tornaria impossível saber
qual delas quebrou.

Resultado desconfortável é resultado: "não consegui compilar" ficou registrado no
LAB-00 (`docs/SYMBIOS_ANALYSIS.md`, §10), e os cinco defeitos que o LAB-01 achou
**no próprio adaptador** estão no relatório dele, §11 — inclusive um que
invalidava silenciosamente a premissa do motor inteiro.
