# ONDE PARAMOS

> Para retomar numa nova sessão, diga:
>
> **"leia docs/ONDE_PARAMOS.md e me diga onde estamos"**

**Última atualização:** 13/09/2026 · **Último prompt executado:** LAB-07
**Concluído:** Etapa A (investigação), Etapa B (prova isolada) e Etapa C
(Adapter mínimo) para o Symbios; e a esteira completa — contrato de motor v1,
Validator e Judge — para o motor do Testfit.

---

## Em uma frase

**Dois motores atravessam o Lab de ponta a ponta**: o Symbios devolve rede
viária e quadras a partir de um terreno do Geo (LAB-01), e o motor do Testfit
devolve parcelamento completo já julgado pelo Validator e pelo Judge do Generate
(LAB-07) — os dois com o mesmo veredito, **"geometria utilizável: SIM COM
RESSALVAS"**, e os dois deixando cerca de um terço da rede viária fora da divisa,
que é o que o **LAB-02** vem consertar.

## A fila

Roteiro completo em [`prompts/FILA.md`](prompts/FILA.md). O que depende do Jonny
está em [`PENDENCIAS_JONNY.md`](PENDENCIAS_JONNY.md). Estado:

| Prompt | Estado |
|---|---|
| **LAB-00** — investigação dos candidatos | concluído em 09/09/2026 |
| **LAB-01** — adaptador mínimo do Symbios | concluído em 10/09/2026 |
| **LAB-07** — o motor do Testfit na esteira do contrato v1 | **concluído em 13/09/2026** |
| **LAB-02** — recorte pela gleba e restrições, Validator | **liberado — é o próximo** |
| **LAB-04** — straight skeleton na subdivisão de quadras | liberado; roda **depois** do LAB-02/03 |
| LAB-03 · LAB-05 · LAB-06 | aguardando, em cadeia a partir do LAB-02 |

---

# LAB-07 — o motor do Testfit na esteira

**Relatório completo:** [`relatorios/LAB-07.md`](relatorios/LAB-07.md) ·
**números crus:** [`provas/LAB-07/`](provas/LAB-07/)

Terreno no contrato `archilly-motor-entrada` v1 → `idaParaOMotor` → `rodarMotor`
do Testfit → `voltaParaOContrato` → `archilly-motor-saida` → **o Validator e o
Judge do próprio Generate**, importados, nunca reimplementados. Três glebas, dez
partidos de traçado, 20 variantes cada — 60 no total.

> ### Geometria utilizável: **SIM COM RESSALVAS**

**47 variantes julgadas, 28 401 lotes, 4 132 violações (14,55 %)** — e a média
engana, porque o resultado é muito desigual por partido: `pente` 0,06 %,
`diagonal` 1,26 %, `mioloVerde` 1,60 %, `ortogonal` 2,07 %, `espinha` 2,67 %,
`loop` 5,24 %, **`cluster` 77,77 %**, **`organico` 140,11 %**.

### As cinco ressalvas

1. **Nenhuma variante passa no contrato sem conserto** — 25 % a 40 % do
   comprimento de via nasce fora da divisa, e o esquema recusa antes de julgar.
   Todos os números vêm de uma passagem com **aparo feito pelo Lab**, que corta
   **só o eixo das vias** e vem desligado por padrão.
2. **A calçada é declarada e não é reservada.** Medido: o lote encosta a
   `caixa_m / 2` do eixo. Declarar `caixa + 2 × calçada` produziu 441 de 441
   lotes sem frente; declarar a caixa real levou a mesma variante a 15 violações.
3. **Dois partidos quebrados** — `cluster` (2 994 violações de testada) e
   `organico` (165 lotes sobrepostos). `radial` é recusado em 6 de 6.
4. **`superquadra` nasce vazia em 20 de 20**, e o plano vazio lidera o ranking do
   motor com nota 0,366 — pior do que os 11 de 12 que o próprio Testfit relatou.
5. **O motor não calcula greide**: `rampaMedia_pct` sai `null`, e a rampa fica
   inteiramente com o Validator.

### O que passou

- **Determinismo:** mesma semente → arquivo de contrato byte a byte idêntico
  (`2709e86fed2b7181` duas vezes); semente diferente → arquivo diferente.
- **Fechamento de áreas:** 0,00 % de erro nas 60 variantes.
- **Tempo:** 1,5 s (`ensaio-47ha`), 2,1 s (`lab01-50ha-ondulado`), 9,5 s
  (`geo-antonina`) para 20 variantes cada.
- **A régua do próprio Testfit** (`medirPlano`) sobre as 60: **zero** lote fora
  da área e **zero** fora da tolerância.

### Dois achados que atravessam repositórios

1. **O defeito de relevo do LAB-01 atinge o Generate, e não o Testfit.** Mesma
   nuvem, mesma régua: `criarModeloRelevo` do Generate deixa **49,8 %** das
   amostras sobre um valor de curva e **17,3 %** da grade com gradiente zero; o
   `campoRelevo` do Testfit, que pondera **todos** os pontos em vez dos k mais
   próximos, fica em 2,2 % e 0 %. Diagnóstico para repassar ao Generate, com a
   correção sugerida: exigir vizinhos de **pelo menos duas cotas distintas**.
   Só diagnóstico — o Lab não escreve no Generate.
2. **As duas glebas-padrão do Generate não têm relevo nenhum** (`curvas: []`,
   `cotas: null`). É por isso que a terceira gleba deste prompt é a do LAB-01 —
   sem ela, o campo `relevo` do contrato atravessaria a esteira sem nunca ser
   exercitado.

### Onde está o código

```text
external-engines/testfit/          (sem upstream/: o motor é da família — D16)
├── adapter/src/
│   ├── contrato-v1.ts   os tipos do contrato
│   ├── ida.ts           contrato → EntradaMotor, com as perdas declaradas
│   ├── volta.ts         plano → contrato, com as perdas declaradas
│   ├── aparo.ts         o conserto: corta SÓ eixo de via, desligado por padrão
│   └── esteira.ts       a esteira inteira, com o Validator e o Judge do Generate
├── ferramentas/         medir.ts · diagnostico-relevo.ts · gleba-lab01.ts
└── tests/               14 testes, verdes
```

Os caminhos dos dois repositórios irmãos estão **num lugar só**: os `paths` do
`external-engines/testfit/tsconfig.json`.

---

# LAB-01 — o adaptador do Symbios

## O que existe agora

```text
external-engines/symbios/
├── upstream/            symbios-tensor 0.4.1 (c3f2875) — INTOCADO, verificado com cmp
├── archilly/
│   ├── wasm/            ponte Rust → .wasm de 189 KB, ZERO imports
│   ├── probe/           medições do LAB-00
│   └── wasm-probe/      prova de compilação do LAB-00
└── adapter/             O ADAPTADOR (LAB-01)
    ├── src/             9 arquivos, zero dependências npm
    └── ferramentas/     geração de terrenos, medições, diagnóstico, navegador
docs/terrenos/           4 terrenos no contrato archilly-terreno 1.1
outputs/lab01/           medições cruas, GeoJSON por terreno, captura do navegador
```

Uma função: `gerarRedeViaria(motor, terreno, parametros, seed)`.

## O veredito do LAB-01

> **Geometria utilizável: SIM COM RESSALVAS**

Relatório completo com todas as medições:
[`relatorios/LAB01_ADAPTADOR.md`](relatorios/LAB01_ADAPTADOR.md).
Decisões numeradas e o porquê de cada uma: [`DECISOES.md`](DECISOES.md).

### O que passou, com folga

- **Ida e volta georreferenciada:** pior erro **2 × 10⁻¹⁰ m** contra a meta de
  0,01 m — oito ordens de grandeza de folga.
- **Determinismo:** mesma seed → mesmo SHA-256 da geometria; seed diferente →
  saída diferente.
- **Uso C:** eixos do Archilly entram, quadras saem. Grade 3×3 com vão de 120 m
  → 4 quadras de 14 400 m², exatas.
- **Navegador:** `.wasm` instancia em 19,7 ms e roda o pipeline completo em
  **151 ms** no Chromium, carregado com `WebAssembly.instantiate(bytes, {})` —
  objeto de imports vazio, sem `wasm-bindgen`, sem glue.
- **Quadras com tamanho de loteamento:** mediana entre 1 600 e 1 900 m².
- **Escala:** 200 ha em 5,7 s no total, dos quais só 631 ms são do motor.

### As três ressalvas

1. **A rampa não é respeitada nos cruzamentos.** Ao longo de uma via o clamp
   fecha sem exceção (pior caso: 10,04 % contra 10 % pedidos); em nó de grau 3 ou
   mais aparecem 49 %, 69 %, 365 %. Testado e descartado: não é o encadeamento do
   adaptador, não é relevo extrapolado, **e não é falta de convergência** (10 e
   1 000 passes dão resultado idêntico). É estrutural — o clamp opera por cadeia,
   e nó compartilhado por várias cadeias não pode ser movido sem quebrar as
   outras. **Decisão: o Adapter não corrige; a conferência é do Validator.**
2. **38 % do comprimento de via nasce fora da gleba.** O motor gera sobre um
   retângulo e a gleba é irregular. Recortar não é cosmético: pode deixar trecho
   isolado dentro da gleba, e o recorte precisa de verificação de conectividade
   depois.
3. **O traçado é cru.** As principais fecham anéis em torno dos morros — geometria
   de qualidade, o que um projetista faria numa encosta. As locais descem em leque
   a partir dos cumes, e nos cumes dezenas convergem num ponto. É o mesmo lugar
   onde a rampa estoura. Ver a captura em `outputs/lab01/navegador.png`.

## Três achados que mudam premissas anteriores

1. **O O(N²) do LAB-00 não é o problema que parecia.** Aquele relatório registrou
   128 s num mundo de 4 km². Medido agora em terreno real com espaçamento de
   loteamento: **631 ms em 200 ha**. A diferença é calibração — os 128 s foram
   com os defaults do upstream, que põem uma via a cada 15 m. **Nenhum contorno é
   necessário até 200 ha**, e processar por setores criaria costura visível (o
   mesmo defeito que o `CityStreamer` do upstream admite ter).

2. **O contrato de entrada não é o `archilly.geo.2`.** O prompt o nomeia, mas ele
   é o pacote para o **Archilly Studio 2D/3D** e leva estado de aplicativo. O
   contrato que alimenta um motor de loteamento é o **`archilly-terreno`** (1.1),
   que é GeoJSON com poligonal, restrições recortadas e curvas cotadas — e é o
   que o Generate consome.

3. **Os estudos de prova do Geo não têm geometria.** `estudos-de-prova.ts` é
   entrada de dossiê e prancha: `vertices: []`, testadas com coordenadas de
   exemplo, mapa substituído por um PNG de 1×1. Prova formatação, não geometria.
   Os terrenos em `docs/terrenos/` usam os **números** reais dos estudos com
   **geometria construída**, e cada arquivo declara isso na `procedencia`.

## Um defeito nosso que vale para o Generate

A interpolação de relevo do adaptador usava k-vizinhos — o mesmo método do
`criarModeloRelevo` do Generate. Como os vértices ao longo de uma curva de nível
são muito mais próximos entre si do que a distância entre curvas, **85 % das
células caíam exatamente sobre um valor de curva e 73 % da grade tinha gradiente
zero**. O terreno virava um bolo de casamento — terraços planos com degraus — e o
campo tensorial seguia a borda dos degraus, não a topografia.

Corrigido aqui (interpolação entre cotas distintas). **Se o `criarModeloRelevo`
do Generate for alimentado com vértices de curva de nível, tem o mesmo defeito.**

**O LAB-07 verificou, e a suspeita procede:** 49,8 % das amostras sobre um valor
de curva e 17,3 % da grade com gradiente zero, medidos com o próprio
`criarModeloRelevo` sobre a mesma nuvem. Continua sendo só diagnóstico — o Lab
não escreve no Generate. Números em `relatorios/LAB-07.md`, §8.

## Próximo passo — LAB-02

Recorte pela gleba e pelas restrições, e passagem pelo Validator. Em ordem:

1. **Recortar pela gleba** e **conferir conectividade depois** — é onde o recorte
   machuca, e 38 % do comprimento vai embora.
2. **Recortar pelas restrições** — APP, reserva legal e faixa não edificável já
   viajam carregadas no `Terreno`; falta usá-las.
3. **Passar pelo Validator**, com atenção à rampa **nos cruzamentos**. É a
   reprovação que já se pode antecipar.

**O LAB-07 adiantou três coisas para ele:** o caminho até o Validator e o Judge
do Generate está aberto e provado a partir do Lab; o recorte de eixo viário pelo
perímetro já está escrito em `external-engines/testfit/adapter/src/aparo.ts`, e
como **os dois motores** deixam cerca de um terço da rede fora da divisa, vale
escrever o recorte do LAB-02 pensando em servir aos dois; e o contrato de motor
v1 funciona como porta — 60 arquivos passaram pelo esquema, 47 chegaram ao
Validator, e o que recusou recusou pelo motivo certo.

**O que o LAB-02 não deve fazer:** consertar a rampa dentro do Adapter. Se o
Adapter consertar geometria, o LAB-03 compara o conserto do Adapter com o motor
Geométrico, não o Symbios.

Uma alternativa que vale medir no LAB-02: **rebaixar o relevo fora da gleba
abaixo do `water_level`** faz o motor evitar aquela área sozinho, e recortaria
antes em vez de depois. Não foi feito aqui porque o recorte é do LAB-02 e porque
criar um penhasco na divisa tem efeito colateral no campo tensorial (ver D12).

## Como reproduzir tudo

```shell
cd external-engines/symbios/archilly/wasm
rustup target add wasm32-unknown-unknown
RUSTFLAGS='--cfg getrandom_backend="custom"' cargo build --release --target wasm32-unknown-unknown

cd ../../adapter
node --experimental-strip-types ferramentas/gerar-terrenos.ts
node --experimental-strip-types ferramentas/medir.ts
node --experimental-strip-types ferramentas/diagnostico-rampa.ts
cd ferramentas/navegador && npx http-server -p 8099 .
```

Requer `cargo` e Node 22+. **Nenhuma dependência npm.**

O LAB-07 é outra pilha, porque compila fonte de três repositórios ao mesmo tempo
(D17). Requer **Bun** e os dois clones irmãos ao lado deste repositório:

```shell
git clone https://github.com/jonny583/motor-testfit              ../motor-testfit
git clone https://github.com/jonny583/urban-create-hub-41d93a4d  ../urban-create-hub-41d93a4d

cd external-engines/testfit
bun install
bun run gleba && bun run medir && bun run relevo
bun test && bun run typecheck && bun run lint
```

Uma dependência do Generate precisa estar instalada para o Validator rodar:
`bun add --no-save zod@^3` **dentro do clone dele** (`node_modules` é ignorado
pelo git de lá; o Lab não escreve naquele repositório).

## Integridade do upstream

`external-engines/symbios/upstream/` continua verificado arquivo a arquivo com
`cmp` contra o commit `c3f287556b98cc616d4263d163e6643ae32111ff`: **byte a byte
idêntico**. Toda a ponte do LAB-01 vive em `archilly/wasm/` e depende do upstream
por caminho, sem modificá-lo.

`external-engines/testfit/` **não tem `upstream/`**, de propósito: o motor é da
própria família e uma cópia congelada aqui envelheceria em silêncio (D16). Ele é
lido por caminho, e o caminho está num lugar só — os `paths` do `tsconfig.json`.

Os repositórios do Geo (`jonny583/urban-scout-tool`), do Generate
(`jonny583/urban-create-hub-41d93a4d`, `main`) e do motor do Testfit
(`jonny583/motor-testfit`) foram clonados **somente para leitura** e terminaram
as rodadas sem uma alteração sequer — conferido com `git status` nos três.
