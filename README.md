# archilly-lab

Laboratório de motores externos para o **Archilly Generate**.

> **Comece por aqui:** [`docs/ONDE_PARAMOS.md`](docs/ONDE_PARAMOS.md)
> · índice de tudo: [`docs/INDEX.md`](docs/INDEX.md)
> · roteiro: [`docs/prompts/FILA.md`](docs/prompts/FILA.md)
> · o que depende do Jonny: [`docs/PENDENCIAS_JONNY.md`](docs/PENDENCIAS_JONNY.md)
> · as regras permanentes deste repositório: [`CLAUDE.md`](CLAUDE.md)

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

## Estado atual — dois motores atravessam o Lab de ponta a ponta

| | LAB-01 · **Symbios Tensor** | LAB-07 · **motor do Testfit** |
|---|---|---|
| entra por | contrato `archilly-terreno` | contrato de motor v1 (`archilly-motor-entrada`) |
| devolve | eixos com hierarquia e rampa, e quadras | parcelamento completo: vias, quadras, lotes, áreas |
| julgado? | não — é o LAB-02 | **sim** — Validator e Judge do próprio Generate |
| veredito | **geometria utilizável: SIM COM RESSALVAS** | **geometria utilizável: SIM COM RESSALVAS** |
| relatório | [`LAB01_ADAPTADOR.md`](docs/relatorios/LAB01_ADAPTADOR.md) | [`LAB-07.md`](docs/relatorios/LAB-07.md) |

### LAB-01 — o Symbios

Um terreno do Geo entra pelo contrato `archilly-terreno`, vira mapa de alturas,
atravessa o Symbios num `.wasm` de 189 KB **sem import nenhum**, e volta como
eixos com hierarquia e rampa e quadras com área — em metros, georreferenciado,
determinístico por seed, 200 ha em 5,7 s.

As ressalvas: a rampa estoura **nos cruzamentos** (nunca ao longo da via), 38 %
do comprimento de via nasce fora da gleba, e o traçado é topograficamente
responsivo mas urbanisticamente cru.

### LAB-07 — o motor do Testfit, na esteira inteira

Contrato v1 → motor → contrato v1 → **o Validator (nove tipos de violação) e o
Judge do próprio Generate**, importados, nunca reimplementados. Três glebas, os
dez partidos de traçado, 20 variantes cada.

**47 variantes julgadas, 28 401 lotes, 4 132 violações** — e a média engana,
porque o resultado é muito desigual por partido: `pente` fica em **0,06 %** e
`cluster` em **78 %**. Cinco ressalvas, a primeira delas impeditiva sem conserto:
25 % a 40 % do comprimento de via nasce fora da divisa e o esquema recusa antes
de julgar; a calçada é declarada e não é reservada; dois partidos estão
quebrados; `superquadra` nasce vazia em 20 de 20 e o plano vazio lidera; e o
motor não calcula greide.

Dois achados atravessam repositórios: o defeito de interpolação de relevo que o
LAB-01 achou **atinge o Generate** (49,8 % das amostras sobre um valor de curva)
e **não atinge o Testfit**; e as duas glebas-padrão do Generate **não têm relevo
nenhum**, o que é a razão da terceira gleba.

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
│   ├── INDEX.md                      ← o índice de tudo
│   ├── ONDE_PARAMOS.md               ← estado do laboratório
│   ├── PENDENCIAS_JONNY.md           ← o que depende de uma pessoa
│   ├── DECISOES.md                   ← as decisões, numeradas, com o porquê
│   ├── LABORATORIO.md                ← especificação (Etapas A a G)
│   ├── TRIAGEM.md                    ← tabela comparativa e vereditos
│   ├── SYMBIOS_ANALYSIS.md
│   ├── STRAIGHT_SKELETON_ANALYSIS.md
│   ├── PACKINGSOLVER_TRIAGEM.md
│   ├── prompts/FILA.md               ← a fila oficial (autônoma), com o histórico
│   ├── relatorios/
│   │   ├── LAB01_ADAPTADOR.md        ← as medições do adaptador do Symbios
│   │   ├── LAB-07.md                 ← as medições do motor do Testfit na esteira
│   │   ├── LF-01.md                  ← a casa em ordem, e a fila autônoma
│   │   └── RECADOS.md                ← todos os recados para o chat, em ordem
│   ├── provas/LAB-07/                ← os números crus, em JSON
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
│   ├── testfit/                      ← sem upstream/: o motor é da família (D16)
│   │   ├── adapter/src/              ← ida, volta, aparo, esteira (LAB-07)
│   │   ├── ferramentas/              ← medições e diagnóstico do relevo
│   │   └── tests/
│   ├── straight-skeleton/            ← nada clonado: licença impeditiva
│   └── packingsolver/                ← nada clonado: triagem não recomendou
├── outputs/                          ← saídas literais das execuções
└── README.md
```

## Reproduzir

### LAB-00 e LAB-01 — requer `cargo` e Node 22+, **nenhuma dependência npm**

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

### LAB-07 — requer **Bun** e os dois clones irmãos ao lado deste repositório

Outra pilha, e o motivo está em `docs/DECISOES.md`, D17: o programa compila
fonte TypeScript de três repositórios ao mesmo tempo.

```shell
git clone https://github.com/jonny583/motor-testfit              ../motor-testfit
git clone https://github.com/jonny583/urban-create-hub-41d93a4d  ../urban-create-hub-41d93a4d

cd external-engines/testfit
bun install
bun run gleba && bun run medir && bun run relevo    # docs/provas/LAB-07/
bun test && bun run typecheck && bun run lint
```

O caminho dos repositórios irmãos está num lugar só: os `paths` do
`external-engines/testfit/tsconfig.json`.

## O que este laboratório não faz

Não toca no repositório do Generate, no do Geo nem no do motor do Testfit (os
três foram clonados **somente para leitura**, e terminaram as rodadas sem uma
alteração sequer), não copia código de motor para fora de `upstream/`, não
modifica `upstream/`, e não otimiza nada. Também não tem interface: prova aqui é
teste, JSON e medição.

O que precisa mudar nos vizinhos vira **lista numerada em relatório** — as oito
correções do motor do Testfit estão no §9 do `LAB-07.md`, e o diagnóstico do
relevo para o Generate, no §8.

O Adapter **do Symbios** existe desde o LAB-01, mas não recorta pela gleba, não
aplica restrições, não parcela em lotes, não valida e não julga — cada uma
dessas coisas é de um prompt adiante, e misturá-las agora tornaria impossível
saber qual delas quebrou. (O do LAB-07 já valida e julga, porque o motor dele
devolve parcelamento pronto e o contrato v1 já existia.)

Resultado desconfortável é resultado: "não consegui compilar" ficou registrado no
LAB-00 (`docs/SYMBIOS_ANALYSIS.md`, §10), e os cinco defeitos que o LAB-01 achou
**no próprio adaptador** estão no relatório dele, §11 — inclusive um que
invalidava silenciosamente a premissa do motor inteiro.
