# adapter/ — a ponte Archilly ↔ Symbios Tensor

Estado: ~~**LAB-01 concluído.**~~ *(escrito no LAB-01, 10/09/2026, e falso desde o
LAB-02, 14/09/2026 — riscado no LAB-191, D419)*. **Nasceu no LAB-01** (Uso B, rede
viária, e Uso C, quadras), e cresceu depois dele: o **LAB-02** acrescentou o recorte
pela gleba e pelas restrições (`src/recorte.ts`) e o **LAB-05** o recorte da quadra
que atravessa a divisa (`src/poligono.ts`). Relatório com as medições do nascimento:
[`docs/relatorios/LAB01_ADAPTADOR.md`](../../../docs/relatorios/LAB01_ADAPTADOR.md).

O Generate **não depende disto**. Nada aqui é importado por ele; o que sair daqui
chega lá, um dia, como peça pronta (WebAssembly) atrás do contrato de motor.

## Instalar e executar

**Nenhuma dependência npm.** Requer `cargo` e Node 22+. Uma exceção, declarada: a
`ferramentas/navegador/prova-automatica.ts` é o passo do verde e roda no Bun, com o
`playwright` do pacote da esteira. A trava é `esteira/tests/node-sem-npm.test.ts`
(LAB-133, D361), que pergunta ao próprio Node.

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
    faixaDominio_m: 8.4,          // padrão — o NORMA_BR.viario.valor.caixaMinima do Generate
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

## O que `gerarRedeViaria` NÃO faz, de propósito

Até o LAB-191 esta seção se chamava *"O que este adaptador NÃO faz"*, e dois itens
dela deixaram de valer para o adaptador no LAB-02, quando o recorte nasceu aqui
dentro, noutra função. Valem para a função que gera:

- **não recorta pela gleba** — mede quanto ficou fora (≈ 38 % do comprimento de
  via na *Fazenda Recanto das Águas*, o terreno `completo` do LAB-01) e registra. O recorte é **outra função deste
  adaptador**, `recortarPelaGleba` (`src/recorte.ts`, LAB-02), que a esteira chama
  depois (`external-engines/esteira/src/motores/symbios.ts`);
- **não aplica restrições** — APP, reserva legal e faixa não edificável viajam
  como carga no `Terreno` e aparecem no diagnóstico; o motor não as recebe. Quem as
  usa é o `recortarPelaGleba`, pelo campo `desconta` que o Geo carimba;
- **não parcela em lotes** — o LAB-00 estabeleceu que o `BuildingLot` do motor é
  pegada de edificação e que as parcelas são calculadas e descartadas por ele;
- **não corrige a rampa nos cruzamentos** — mede e avisa. Conferir rampa é do
  Validator, e é no cruzamento que ele vai reprovar (relatório, §5);
- **não valida nem julga** — ~~Validator é LAB-02, Judge é LAB-03~~ *(escrito no
  LAB-01, riscado no LAB-191)*: o Validator e o Judge **são os do Generate**, e o
  Lab não os reimplementa (`CLAUDE.md` §4, D20). Quem os chama é a esteira.

## Mapa dos arquivos

O que o `git` carrega nesta pasta, além desta página — conferido nos dois sentidos
por `external-engines/esteira/src/a-pagina-do-adaptador.ts` (LAB-191). A bancada do
navegador entra como pasta, porque tem página própria.

<!-- o-mapa-do-adaptador (LAB-191) -->
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
| `src/recorte.ts` | `recortarPelaGleba` — a rede aparada pela gleba e pelas restrições que descontam (LAB-02) |
| `src/poligono.ts` | `recortarPoligono` — a quadra recortada pela divisa, em uma ou mais peças (LAB-05) |
| `ferramentas/terrenos.ts` | biblioteca de geração de terreno de prova |
| `ferramentas/gerar-terrenos.ts` | CLI que grava `docs/terrenos/` |
| `ferramentas/medir.ts` | as medições obrigatórias do LAB-01 |
| `ferramentas/diagnostico-rampa.ts` | onde estão as violações de rampa, e por quê |
| `ferramentas/navegador/` | a prova no navegador (página própria: [`ferramentas/navegador/README.md`](ferramentas/navegador/README.md)) |
<!-- /o-mapa-do-adaptador -->

A ponte Rust fica em [`../archilly/wasm/`](../archilly/wasm/) — área de trabalho,
depende do `upstream/` por caminho e **não o modifica**.

## Os números desta página, e de onde vêm

Nenhum é digitado sem dono; a régua do LAB-191 pergunta cada um ao lugar dele.

- **≈ 38 %** — `vias.fracaoForaDaGleba` do terreno *Fazenda Recanto das Águas* (o
  `completo`) em `outputs/lab01/medicoes.json` — 0,3758, medido no LAB-01,
  10/09/2026; as duas glebas sintéticas deram 0,3858 e 0,38. É história:
  a medição não se refaz sem o `.wasm`.
- **200, 80, 10, 8,4, 2 e `true`** do contrato de entrada — o `PARAMETROS_PADRAO` de
  `src/contrato.ts`. A página copia; quem manda é o arquivo.
- **10 %** e **8,4 m** do Generate — `LIMITES_TOPOGRAFIA.rampaMaxPct`
  (`src/lib/engine/topografia.ts` de lá) e `NORMA_BR.viario.valor.caixaMinima`
  (`src/lib/normas/br.ts`, `6 + 2 * 1.2`). Até o LAB-191 esta página e o
  `src/contrato.ts` diziam `NORMA_BR.via.caixaMinima`, um nome que o Generate nunca
  teve (D419). Perguntado ao clone do Generate no verde completo.
- **15 m** do upstream — o `minor_road_dist` do `Default` de `TensorConfig`
  (`upstream/src/tracer.rs`).

## Trocar o motor

Se um dia o Symbios sair, o que muda é `src/parametros.ts` (a tradução) e
`src/motor.ts` (a chamada). `contrato.ts`, `geo.ts`, `alturas.ts`,
`terreno-geo.ts` e `geojson.ts` não conhecem o Symbios.
