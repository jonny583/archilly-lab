# A prova no navegador

Mostra o `.wasm` do adaptador carregando e rodando num navegador de verdade —
com `WebAssembly.instantiate(bytes, {})`, objeto de imports **vazio**.

```shell
# 1. compilar a ponte (uma vez)
cd ../../../archilly/wasm
RUSTFLAGS='--cfg getrandom_backend="custom"' \
  cargo build --release --target wasm32-unknown-unknown

# 2. copiar o artefato para cá
cp target/wasm32-unknown-unknown/release/archilly_symbios_wasm.wasm \
   ../../adapter/ferramentas/navegador/

# 3. servir (um `file://` não serve: `fetch` de wasm exige HTTP)
cd ../../adapter/ferramentas/navegador && npx http-server -p 8099 .
```

O `.wasm` **não é versionado**: é artefato de build, e um binário no git que já
não corresponde ao fonte ao lado dele é a divergência silenciosa que o `build.rs`
da ponte existe para impedir.

## O que o `git` carrega nesta pasta, e quem roda cada arquivo (LAB-188)

A receita acima é a **manual**, do LAB-01. Desde o LAB-31 a mesma página também roda
sozinha, a cada verde. Além desta página, a pasta tem:

<!-- a-pasta-da-bancada (LAB-188) -->
- `index.html` — a página: o registro, o `<canvas>` e a chamada ao `prova.js`.
- `prova.js` — o JavaScript da página: carrega o `.wasm` com `{}` e roda o
  pipeline num relevo sintético.
- `prova-automatica.ts` — a mesma página no Chromium, lida como dado
  (`window.__prova`) e conferida contra a medição de 10/09 abaixo; o
  `conferir.sh` a roda (LAB-31) e ela escreve `docs/provas/LAB-31/navegador.json`.
  Sem o `.wasm` ela falha com a receita, e não pula.
- `rolagem-no-celular.ts` — a página no celular do Chromium, sem precisar do
  `.wasm`, com o registro de 10/09 **lido desta página**; o `conferir.sh` a roda
  (LAB-182) e ela escreve `docs/provas/LAB-182/navegador-celular.json`.
<!-- /a-pasta-da-bancada -->

A lista é conferida nos dois sentidos contra o `git` e contra o `conferir.sh` por
`external-engines/esteira/src/a-pagina-da-bancada.ts` (LAB-188, D416).

## O que esta página é, e o que não é

Ela é JavaScript puro e **não importa o adaptador**. O que está em dúvida para o
LAB-05 é se o módulo carrega e executa no navegador, e isso se responde sem o
invólucro TypeScript — trazer o adaptador inteiro exigiria um empacotador, que é
a complexidade que o LAB-01 não precisa assumir. O relevo aqui é sintético,
construído na própria página; terreno do Generate é o LAB-05.

O marshalling segue o mesmo contrato de `src/motor.ts`: `archilly_alloc`,
`archilly_free`, e texto como `[u32 tamanho][UTF-8]`.

## Medido em 10/09/2026 (Chromium)

```text
wasm: 193174 bytes, instanciado em 19.7 ms
  vias                19.70 ms
  racionalização      88.00 ms
  quadras              9.10 ms
resultado: ok=true · motor 0.4.1 · 6242 nós · 6514 arestas ativas · 275 quadras
TOTAL no navegador: 151.0 ms
```

**Estes números são o portão da prova automática, e a mesma medição mora em três
lugares:** este bloco (que o `rolagem-no-celular.ts` lê), o `DE_10_09` do
`prova-automatica.ts` (com que ela compara o que a página dá) e o
`medidoEm_10_09_2026` de `docs/provas/LAB-31/navegador.json`. Desde o LAB-188 a
`a-pagina-da-bancada.ts` confere que os três dizem o mesmo, campo a campo; mudar
um é mudar os três.

Captura em [`outputs/lab01/navegador.png`](../../../../../outputs/lab01/navegador.png).
No desenho: **azul** são vias principais (seguem a curva de nível, fechando anéis
em torno dos morros) e **vermelho** são locais (descem o gradiente, em leque a
partir dos cumes). As duas coisas que o relatório aponta estão visíveis ali.
