# external-engines/testfit

Motor: **Testfit** (`motor-testfit`) — gerador de parcelamento por partido de
traçado, dez partidos, plano completo (vias, quadras, lotes, áreas especiais).

```text
Upstream:          https://github.com/jonny583/motor-testfit   (repositório da família)
Versão medida:     T00-A  (13/09/2026)
Archilly revision: LAB-07
Adapter:           adapter/src/ — ida, volta, aparo e esteira
Status:            Experimental — geometria utilizável SIM COM RESSALVAS
```

Relatório completo, com todas as medições:
[`../../docs/relatorios/LAB-07.md`](../../docs/relatorios/LAB-07.md).

## Por que aqui não há `upstream/`

A regra de ouro do Lab (`upstream/` intocado, `archilly/` para trabalho,
`adapter/` como fronteira) nasceu para motor **de terceiro**, que se copia e se
congela num commit. O Testfit é da própria família: ele tem repositório, fila de
prompts e dono. Copiá-lo para dentro do Lab criaria uma segunda cópia que
envelhece em silêncio — exatamente o que `upstream/VERSION` existe para evitar.

Então aqui só existe o `adapter/`. O motor é lido **de fora, por caminho**, do
clone irmão, e o único lugar do Lab que sabe onde ele mora é o `tsconfig.json`:

```jsonc
"paths": {
  "@testfit/*":  ["../../../motor-testfit/src/lib/lab/*"],
  "@generate/*": ["../../../urban-create-hub-41d93a4d/src/lib/*"]
}
```

Mudar de máquina é mudar duas linhas. **Nenhum dos dois repositórios irmãos é
escrito** — são clones de leitura, e o `git status` deles ficou em zero
alterações do começo ao fim do LAB-07.

## A esteira

```text
archilly-motor-entrada  (contrato v1, do Generate)
        │  idaParaOMotor()            adapter/src/ida.ts
        ▼
   EntradaMotor  →  rodarMotor()      motor-testfit, src/lib/lab/api.ts
        ▼
   SaidaMotor
        │  voltaParaOContrato()       adapter/src/volta.ts
        ▼
archilly-motor-saida
        │  apararVias()               adapter/src/aparo.ts   (o conserto, opcional)
        ▼
   esquema → Validator (9 tipos) → Judge          ← do GENERATE, importados
```

**O julgamento não é do Lab.** `montarParcelamentoExterno` e `montarRelatorio`
vêm do Generate, importados pelo `esteira.ts`. O Lab não tem Validator próprio,
não tem limiar mais frouxo, e não reimplementa nota.

## Pastas

| Pasta | O que tem |
|---|---|
| `adapter/src/` | A ponte: `contrato-v1.ts` (tipos), `ida.ts`, `volta.ts`, `aparo.ts`, `esteira.ts` |
| `ferramentas/` | `medir.ts` (as medições do §2.4), `diagnostico-relevo.ts` (§2.6), `gleba-lab01.ts` (a terceira gleba) |
| `tests/` | 14 testes: ida e volta nas três glebas, determinismo, perdas declaradas, recusas, superquadra vazia |
| `tipos/` | Uma declaração ambiente para o pacote privado vendorizado do Generate, que o clone não traz com código |

## Rodar

Requer **Bun** (1.3+) e os dois clones irmãos ao lado deste repositório:

```shell
git clone https://github.com/jonny583/motor-testfit             ../../../motor-testfit
git clone https://github.com/jonny583/urban-create-hub-41d93a4d ../../../urban-create-hub-41d93a4d

bun install
bun test                                # 14 testes, ~3 s
bun ferramentas/gleba-lab01.ts          # a terceira gleba → docs/provas/LAB-07/
bun ferramentas/medir.ts                # 60 variantes → docs/provas/LAB-07/medicoes.json
bun ferramentas/diagnostico-relevo.ts   # §2.6 → docs/provas/LAB-07/diagnostico-relevo.json
bunx tsc --noEmit && bunx eslint .
```

**Por que Bun e não Node.** O programa compila fonte TypeScript de três
repositórios ao mesmo tempo, e os do Generate usam import relativo sem extensão
(`from "./topografia"`). O `--experimental-strip-types` do Node não resolve isso;
o Bun resolve, sem empacotador e sem etapa de build. É a mesma razão pela qual o
`tsconfig.json` aqui **não** liga `noUncheckedIndexedAccess` nem
`exactOptionalPropertyTypes`: ligá-los faz o `tsc` acusar ~20 erros dentro do
repositório do Generate, que o Lab não pode consertar — e um typecheck que acusa
erro alheio é um typecheck que se aprende a ignorar. O arquivo explica isso em
comentário, na linha.

## O que este adaptador não faz

Não altera o motor do Testfit nem o Generate (o que precisa mudar virou lista
numerada no §9 do relatório). Não conserta geometria dentro da ponte: o único
conserto é o `apararVias`, ele **só corta eixo de via**, nunca lote, quadra ou
área especial, vem **desligado por padrão**, e toda medição é publicada nas duas
passagens — fiel e aparada. Não tem tela: prova aqui é teste, JSON e medição.

## As ressalvas, em uma linha cada

1. Nenhuma variante passa no contrato sem o aparo — 25 % a 40 % do comprimento
   de via nasce fora da divisa.
2. A calçada é declarada e não é reservada: o lote encosta a `caixa_m / 2` do
   eixo, medido.
3. Dois partidos quebrados: `cluster` (78 % de violação de testada) e `organico`
   (165 sobreposições).
4. `superquadra` nasce vazia em **20 de 20**, e o plano vazio lidera o ranking.
5. O motor não calcula greide: `rampaMedia_pct` sai `null`, e a rampa fica com o
   Validator.
