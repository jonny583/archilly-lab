# adapter/ — a ponte Archilly ↔ Symbios Tensor

Estado: **LAB-01 concluído.** Escopo Uso B (rede viária) + Uso C (quadras).
Relatório com as medições: [`docs/relatorios/LAB01_ADAPTADOR.md`](../../../docs/relatorios/LAB01_ADAPTADOR.md).

O Generate **não depende disto**. Nada aqui é importado por ele; o que sair daqui
chega lá, um dia, como peça pronta (WebAssembly) atrás do contrato de motor.

## Instalar e executar

**Nenhuma dependência npm.** Requer `cargo` e Node 22+.

```shell
# o .wasm (uma vez, e a cada mudança na ponte Rust)
cd ../archilly/wasm
rustup target add wasm32-unknown-unknown
RUSTFLAGS='--cfg getrandom_backend="custom"' \
  cargo build --release --target wasm32-unknown-unknown

# os terrenos de prova
cd ../../adapter
node --experimental-strip-types ferramentas/gerar-terrenos.ts

# as medições
node --experimental-strip-types ferramentas/medir.ts
node --experimental-strip-types ferramentas/diagnostico-rampa.ts

# a prova no navegador
cd ferramentas/navegador && npx http-server -p 8099 .
```

## Contrato de entrada

```ts
import { readFileSync } from "node:fs";
import { Motor, lerTerrenoGeo, gerarRedeViaria, paraGeoJSON } from "./src/index.ts";

// Carregar o motor custa caro e não depende do terreno — reaproveite.
const motor = await Motor.carregar(readFileSync("…/archilly_symbios_wasm.wasm"));

// Um arquivo `archilly-terreno` 1.x do Archilly Geo.
const terreno = lerTerrenoGeo(JSON.parse(readFileSync("terreno.geojson", "utf8")), "de onde veio");

const { vias, quadras, diagnostico } = gerarRedeViaria(
  motor,
  terreno,
  {
    espacamentoPrincipal_m: 200,  // padrão
    espacamentoLocal_m: 80,       // padrão
    rampaMaxima_pct: 10,          // padrão — o LIMITES_TOPOGRAFIA.rampaMaxPct do Generate
    faixaDominio_m: 8.4,          // padrão — o NORMA_BR.via.caixaMinima do Generate
    passoGrade_m: 2,              // padrão
    extrairQuadras: true,         // padrão
  },
  42, // seed
);

const geojson = paraGeoJSON({ vias, quadras, diagnostico }, terreno); // WGS84
```

**Os parâmetros são de urbanismo — metros e porcento.** Os defaults do upstream
(via a cada 15 m) não aparecem aqui; a tradução para o vocabulário do motor mora
em `src/parametros.ts`, e é o único arquivo onde os nomes do Symbios existem.

## Contrato de saída

`vias` são polilinhas de eixo em **metros locais**, com `tipo`
(`"principal" | "local"`, o vocabulário do `TrechoViario` do Generate), cota por
ponto, comprimento, rampa média e máxima em porcento, e quantos metros caem fora
da gleba. `quadras` são polígonos anti-horários com área e perímetro.
`diagnostico` traz tempo por estágio, grade, frações fora da gleba, restrições
carregadas, avisos, e o **hash SHA-256 da geometria** — a prova de determinismo.

`paraGeoJSON` devolve tudo em **WGS84**, com a gleba e as restrições junto, e um
aviso escrito dentro do arquivo dizendo que o recorte não foi feito.

## O que este adaptador NÃO faz, de propósito

- **não recorta pela gleba** — mede quanto ficou fora (≈ 38 % do comprimento de
  via) e registra; o recorte é o LAB-02;
- **não aplica restrições** — APP, reserva legal e faixa não edificável viajam
  como carga no `Terreno` e aparecem no diagnóstico, prontas para o LAB-02 usar;
- **não parcela em lotes** — o LAB-00 estabeleceu que o `BuildingLot` do motor é
  pegada de edificação e que as parcelas são calculadas e descartadas por ele;
- **não corrige a rampa nos cruzamentos** — mede e avisa. Conferir rampa é do
  Validator, e é no cruzamento que ele vai reprovar (relatório, §5);
- **não valida nem julga** — Validator é LAB-02, Judge é LAB-03.

## Mapa dos arquivos

| Arquivo | O que faz |
|---|---|
| `src/index.ts` | `gerarRedeViaria` — a cadeia inteira |
| `src/contrato.ts` | os tipos: `Terreno`, `Parametros`, `Via`, `Quadra`, `Diagnostico` |
| `src/terreno-geo.ts` | lê o contrato `archilly-terreno` 1.x do Geo |
| `src/geo.ts` | a borda georreferenciada: graus ↔ metros locais, e geometria |
| `src/alturas.ts` | curvas de nível → grade regular (leia o topo: o bolo de casamento) |
| `src/parametros.ts` | urbanismo → vocabulário do motor. **O ponto de isolamento** |
| `src/motor.ts` | carga do `.wasm` e um estágio por chamada |
| `src/geojson.ts` | saída em WGS84 |
| `src/hash.ts` | SHA-256 em TypeScript puro, para rodar igual nos dois ambientes |
| `ferramentas/terrenos.ts` | biblioteca de geração de terreno de prova |
| `ferramentas/gerar-terrenos.ts` | CLI que grava `docs/terrenos/` |
| `ferramentas/medir.ts` | as medições obrigatórias do LAB-01 |
| `ferramentas/diagnostico-rampa.ts` | onde estão as violações de rampa, e por quê |
| `ferramentas/navegador/` | a prova no navegador |

A ponte Rust fica em [`../archilly/wasm/`](../archilly/wasm/) — área de trabalho,
depende do `upstream/` por caminho e **não o modifica**.

## Trocar o motor

Se um dia o Symbios sair, o que muda é `src/parametros.ts` (a tradução) e
`src/motor.ts` (a chamada). `contrato.ts`, `geo.ts`, `alturas.ts`,
`terreno-geo.ts` e `geojson.ts` não conhecem o Symbios.
