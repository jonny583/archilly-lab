# O Padrão da família NÃO mora aqui — este arquivo é um PONTEIRO

> **Esta casa não vendoriza o kit e, desde 11/10/2026, não carrega cópia do Padrão Archilly.**
> O que havia neste caminho era uma cópia de **145 linhas**, congelada na **Versão 1 de
> 13/09/2026**, com o título de um documento normativo. O documento vigente tem **1.731
> linhas**: a cópia era **8,4 % das linhas e 11,8 % dos bytes dele.** Decidido no **LAB-88**
> (item 021), registrado em **D292**.
>
> **O arquivo ficou NESTE caminho de propósito:** é aqui que quem procura o Padrão chega, e é
> aqui que o aviso serve. Nenhum link de relatório morreu.

## Onde está a fonte

| campo | valor |
|---|---|
| repositório | **jonny583/archilly-central** (privado) |
| ramo | `main` |
| caminho | `docs/PADRAO_ARCHILLY.md` |
| versão | **3.0 · 10/10/2026** |
| **commit lido** | **`e48bff9`** · 2026-10-10T20:36:15Z |
| tamanho | **1.731 linhas · 107.395 bytes** |
| lido em | **2026-10-11** |

**Leia da ORIGEM, nunca de clone no disco:**

```sh
git show origin/main:docs/PADRAO_ARCHILLY.md
```

## O texto da Versão 1 não se perdeu — ele está no HISTÓRICO

```sh
git show 4081c27:docs/referencia/PADRAO_ARCHILLY.md
```

`4081c27` é de **14/09/2026**, PR #12 — **o commit da própria conferência do `LF-FINAL`**, e o
**único** que tocou aquele arquivo em toda a vida dele. *Arquivo que sai da árvore continua no
histórico; o que a saída tira é a autoridade de parecer vigente.*

## Por que a cópia saiu, e por que NÃO foi trocada pela 3.0

**A versão não identifica o conteúdo.** O rótulo *"Versão 3.0 · 10/10/2026"* cobre **dois textos
diferentes** na origem:

| commit | quando | linhas | bytes |
|---|---|---|---|
| `96dbc9b` | 10/10 03:35Z | 1.712 | 106.081 |
| `e48bff9` | 10/10 20:36Z | **1.731** | **107.395** |

**+19 linhas e +1.314 bytes com o mesmo número** — e a cópia vendorizada do Parcelamento é byte a
byte igual à **primeira**: ela já está atrás **sem que o número mude**. *Carimbar a versão numa
cópia é carimbar o rótulo, e rótulo não é identidade.*

**E a trava contra o commit da origem não é executável aqui, o que é medição e não preguiça:** a
fonte é **privada** e este repositório é **público**; o verde roda sem rede por desenho, e o
trabalho de CI que roda em todo envio **não tem segredo**. A trava ficaria **verde por não achar
o objeto** — *guarda que não acha o objeto não está aprovando, está sem medir nada* (D213).

> **Documento normativo que esta casa não pode manter atualizado não deve morar nela.** O que
> fica é **onde ele está, qual commit foi lido e quando.**

**As regras que esta casa obedece estão no [`CLAUDE.md`](../../CLAUDE.md)**, e é ele que vale
aqui. **Há guarda** (`external-engines/esteira/tests/padrao-da-familia.test.ts`): a procedência
mora num lugar só (`src/onde-esta-o-padrao.ts`), cada campo é cobrado neste arquivo — **o commit
inclusive** —, e se o título do Padrão voltar a abri-lo, a trava acusa: o ponteiro virou cópia
outra vez.
