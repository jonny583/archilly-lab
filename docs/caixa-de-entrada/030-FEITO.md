> ## ✅ FEITO EM 15/10/2026 — disparo das 19:05 UTC · LAB-113 · D340
>
> **A forma única:** `external-engines/esteira/src/numero-do-item.ts` — `ITEM_DA_CAIXA` (`\d{3,}`, três
> casas no mínimo, sem teto), `lerNomeDoItem` (número como número, sufixo e estado), `itensEmOrdem` (ordem
> de fila, nunca de texto) e `proximoItem` (o menor aberto, **pulando o `900`**, que só é o próximo quando
> não há outro).
>
> **As leituras que a chamam:** `src/caixa-vazia-era-verdade.ts` — `ehItemAberto` (era `^\d{3}…`: o
> `1000.md` não era item) e `numeroDoItem` (era `^(\d{3})`: lia `100`), e os abertos da direção sem o `900`
> e em ordem de fila (só o `900` aberto → caixa **vazia**, declaração verdadeira); `tests/leituras.test.ts`,
> a guarda do número repetido (era só `-adendo`: o `025-adendo-2-FEITO.md` ficava fora).
>
> **Nada do histórico muda sem o `900`:** 779 árvores de caixa em onze casas, remedidas pelas duas
> réguas; 0 veredictos mudam sem ele, 55 mudam só a ordem, e com ele 49 passam de *falsa* a *vazia*.
>
> **A prova:** `external-engines/esteira/tests/numero-do-item.test.ts`, 19 travas — os três casos (`1000.md`
> ao lado do `030.md` → o `030`; `900.md` sozinho → sem item da direção; `09.md` → recusa), nos dois
> sentidos; a régua contra o teto, com o sujeito escrito. Com a forma antiga de volta (`\d{3}`), caem **7**
> (M1), e onze mutações, todas acusadas. O protocolo ganhou a convenção no passo 0 do `COMO_FUNCIONA.md`.
>
> **De passagem (só leitura):** Pesquisa `scripts/rodadas-no-livro.mjs` 117, 151 e 155 (teto de três e
> `localeCompare`); Parcelamento `tests/despertador.test.ts:118` (teto de três); Propostas
> `ferramentas/despertador.mjs:148` (conta o `900` como aberto). Relatório:
> [`../relatorios/LAB-113.md`](../relatorios/LAB-113.md).

# 030 — LAB-113 · o número do item da caixa não tem teto: a convenção, respondida pela direção

**Passo 0:** `git fetch -q origin` e conte a caixa na **origem**.

**Da direção (chão), 15/10/2026, 18h50 UTC.** A proposta é **sua** (fim do LAB-112): *"o número do item
da caixa tem três casas fixas — `caixa-vazia-era-verdade.ts` (`^\d{3}`) e `leituras.test.ts` leem o nome
com exatamente três algarismos; um `1000.md` cairia fora da régua que existe para impedir a caixa vazia
falsa. A convenção do nome é da direção."* **A direção responde a convenção, para você travar aqui:**

1. **Três casas no MÍNIMO, sem teto.** `001`…`899`, e depois `901`, …, `999`, `1000`, `1001`. Nenhuma
   casa da família passa de `050` hoje; não há pressa — é o mesmo defeito que o LAB-112 achou na
   decisão, antes do dia.
2. **`900` é reservado:** é o item permanente *"lista própria"* das onze casas e nunca é renomeado para
   `-FEITO`. A numeração comum **pula o `900`** quando chegar lá.
3. **"O menor número ainda não feito" é comparação NUMÉRICA**, nunca de texto. Em ordem de texto
   `"1000" < "900" < "901"`: uma régua que ordena o nome como texto pegaria o `1000` antes do `030`.
   A forma do nome é `^\d{3,}` seguido de `.md`, `-FEITO.md`, `-RETIRADO.md`, ou de um sufixo como
   `-adendo` / `-bis` (existem, e são legítimos).

## O que fazer

Por LUGAR, como no LAB-112: liste toda leitura do nome de item da caixa nesta casa (as duas que você já
achou e o que mais houver — `sort`, `localeCompare`, `<` entre strings). Cada uma passa a chamar **uma**
forma única (no molde do `src/numero-da-decisao.ts`): `\d{3,}` e ordem numérica. Nada do histórico muda
— confira, como no LAB-112, que as leituras dos itens que existem dão o mesmo resultado antes e depois.

## Prova

Os três casos que mais quase parecem válidos, nos dois sentidos: `1000.md` aberto ao lado do `030.md`
(o menor é o `030`); `900.md` sozinho (caixa *sem item da direção*, como hoje); `09.md` (duas casas,
fora da forma — recusa). Com a forma antiga de volta, as provas do `1000` reprovam (anote a quebra).
`./external-engines/conferir.sh` verde.

**Não depende do Jonny.** Não muda nada que a tela afirme — esta casa não tem tela.

**De passagem, para o recado:** se você achar outra casa que ordene a caixa como texto, diga qual e onde
— a direção carrega. *Não escreva no repositório vizinho.*

Recado de sempre, `RECADOS.md`, um envio só.
