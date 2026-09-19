# external-engines/esteira

**A esteira cruzada:** põe *qualquer* motor no contrato de motor v1 e o julga com
o **Validator e o Judge do Generate**.

```text
Archilly revision: LAB-14
Runtime:           Bun 1.3+
Status:            em uso — LAB-02 a LAB-05, LAB-08, LAB-13 e LAB-14 moram aqui
```

## Por que esta pasta existe

O julgamento não é propriedade de nenhum adaptador. Antes do LAB-02 o alias
`@generate` vivia dentro de `external-engines/testfit/`, o que teria posto a
comparação Symbios × Testfit do LAB-08 dentro da pasta de um dos dois. E não
podia ir para `external-engines/symbios/`, cujo adaptador é Node **sem nenhuma
dependência npm** por decisão (D14) — o julgamento precisa de `zod` e do Bun.

Então o que é de ninguém mora aqui. Ver `docs/DECISOES.md`, D31.

## O que tem dentro

| arquivo | o que faz |
|---|---|
| `src/gleba-v1.ts` | ENTRADA do contrato v1 → `Terreno` do Symbios, com as perdas declaradas |
| `src/gleba-do-lab.ts` | os terrenos de `docs/terrenos/` → ENTRADA v1 |
| `src/symbios-para-contrato.ts` | rede viária + quadras **e lotes** do Symbios → SAÍDA v1 |
| `src/esqueleto/esqueleto.ts` | o **esqueleto reto**, reimplementado da literatura (D50): uma face por aresta, e o recuo como frente de onda |
| `src/lotear.ts` | a quadra vira lotes, pelos parâmetros da gleba — o lote nasce no **meio-fio**, nunca no eixo (D52) |
| `src/motores/` | os três motores na mesma régua, e a régua: Validator, Judge e `medirSobras`, todos do Generate (LAB-13) |
| `src/porta/` | a **porta única** (LAB-14) — a forma executável do `docs/CONTRATO_MOTOR_UNIFICADO_v1.md`, e os quatro motores que a implementam |
| `src/relevo-k-vizinhos.ts` | o interpolador **defeituoso**, replicado para servir de controle (D37) — nunca em produção |
| `src/fixtures-com-relevo.ts` | as glebas-padrão do Generate + relevo sintético declarado |
| `ferramentas/lab02.ts` | a medição do LAB-02: antes e depois do recorte, nas três glebas |
| `ferramentas/lab03.ts` | a medição do LAB-03: a interpolação medida no traçado, e as fixtures |
| `ferramentas/lab04.ts` | a medição do LAB-04: lotes, área vendável e violações contra os outros dois motores |
| `ferramentas/lab05.ts` | a medição do LAB-05: antes e depois do recorte de quadra e do descarte de lasca, nas cinco glebas |
| `ferramentas/lab13.ts` | a medição do LAB-13: cinco glebas × quatro motores, uma tabela |
| `tests/` | 93 testes |

O recorte em si **não** mora aqui: ele é geometria pura e vive no adaptador do
Symbios, em `../symbios/adapter/src/recorte.ts` e `../symbios/adapter/src/poligono.ts`,
onde não precisa de Bun nem de dependência nenhuma.

## A porta única

O LAB-01 alimentava um motor com `archilly-terreno` e o LAB-07 alimentava o
outro com o contrato de motor v1 — duas portas, duas glebas, e nenhuma forma de
saber se uma diferença veio do motor ou do terreno. A partir daqui **todo
terreno vira ENTRADA v1 primeiro**, e é o contrato que alimenta os dois motores.

É o que torna verdadeira a exigência do LAB-08: *mesmas glebas, mesmas sementes*.

## Rodar

Requer os dois clones irmãos ao lado do repositório (`motor-testfit` e
`urban-create-hub-41d93a4d`, **somente leitura**) e o `.wasm` do Symbios
compilado — ver o `README.md` da raiz.

```shell
bun install
bun run lab02       # docs/provas/LAB-02/
bun run lab03       # docs/provas/LAB-03/ e docs/fixtures/glebas-padrao-com-relevo/
bun run lab04       # docs/provas/LAB-04/ e docs/contratos/saidas/
bun run lab05       # docs/provas/LAB-05/ e docs/contratos/saidas/
bun run lab13       # docs/provas/LAB-13/
bun test
bun run typecheck && bun run lint
```

`zod` precisa estar instalado **dentro do clone do Generate** para o Validator
rodar: `bun add --no-save zod@^3` lá dentro. O `node_modules` é ignorado pelo
git de lá, e o Lab não escreve naquele repositório.
