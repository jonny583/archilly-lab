> # ✅ FEITO em 09/10/2026 — LAB-68, verde `exit 0`, conferido aqui e não no GitHub
>
> **As duas pilhas, medidas rodando:** das 11 falhas, **UMA** muda com o commit do vizinho e
> **dez eram daqui**. A D223 acertou o veredicto e errou a causa (D224).
>
> | o que era | quantas | arquivo e linha do conserto |
> |---|---|---|
> | `.wasm` ausente (artefato de build DAQUI) | 9 | compilado com a receita do `conferir.sh`; nada a mudar no código |
> | campo novo do motor sem destino na ponte | 2 | `external-engines/esteira/src/inventario-das-pontes.ts:181-196` — `travessias` e `indicadores` como **perda declarada** |
> | a minha trava do LAB-67 casando consigo mesma | 1 | `external-engines/esteira/tests/vazamento-de-custo.test.ts:27-45` e `:178` |
> | prova publicada velha (rampa 17,92 → 21,63) | 1 | `docs/provas/LAB-23/coluna-vertebral.json`, regerada por `bun run lab23` |
> | **o motor ANDOU** — pico de rampa 109,51 % (19/09) → 175,51 % (05/10) | **1** | `external-engines/esteira/tests/contrato-v2.test.ts:116-137` — a trava passa a **DIZER**, com os três commits medidos |
>
> **O carimbo:** `external-engines/esteira/src/commit-dos-vizinhos.ts` grava o commit de cada
> clone **e o chão** (Bun 1.4.2 — a variável que me faltava), com quatro veredictos que **dizem**
> em vez de reprovar: `igual`, `mudou`, `nao-gravado`, `clone-ausente`. `nao-gravado` **não é**
> `igual`.
>
> **Os dois lados demonstrados, contra o clone de verdade** (não contra fixture), em
> `external-engines/esteira/tests/commit-dos-vizinhos.test.ts:50` (caso bom, carimbo = `HEAD`) e
> `:57` (caso ruim, carimbo de um commit que existe no histórico e não é o `HEAD`). 8 travas.
>
> **Defeito real daqui, consertado além dos acima:** `external-engines/testfit/adapter/src/ida.ts:435`
> — o `legais` do motor ganhou quatro campos. Saem `null` de propósito: **entregá-los MUDA o
> desenho** (medido), e isso é prompt, não conserto de typecheck (D226).
>
> **O que NÃO foi feito:** provas antigas não foram carimbadas retroativamente — carimbá-las
> exigiria regerá-las, e o D182 proíbe sobregravar prova *"antes"* com prova *"depois"*. Elas
> saem `nao-gravado`, que é a verdade sobre elas.
>
> **Prova:** `docs/provas/LAB-68/as-duas-pilhas.json` · **relatório:** `docs/relatorios/LAB-68.md`
> · **decisões:** D224 a D227.

# 001 — o verde que fica vermelho sem ninguém tocar aqui (D223)

**Vem de:** o seu próprio recado do LAB-67, última linha. Você propôs e eu ratifico.

## A afirmação a conferir

"O verde dá 10 falhas em 552 testes, e não é da entrega de hoje" — você mediu isso
com `git stash` e achou **3 de 17** falhando igual na `main` limpa. Faltam os outros
**14**: ninguém disse de onde vêm.

## O que fazer

1. **Separe as 10 falhas em duas pilhas, com prova de cada uma:** as que mudam de
   resultado quando o clone vizinho muda de commit, e as que não. Não deduza pelo
   nome do arquivo — rode.
2. **Grave o commit de cada clone vizinho dentro de toda prova que o use**, como
   você propôs. O caminho já está fixado; a versão não estava. Depois disso, uma
   prova que roda contra um commit diferente do gravado **diz isso** em vez de
   simplesmente reprovar.
3. **A régua nasce conferida dos dois lados:** demonstre que ela aprova o caso bom
   (clone no commit gravado) **e** reprova o caso ruim (clone noutro commit). As duas
   demonstrações no relatório, ou não é trava.
4. Se alguma das 10 falhas for defeito real **daqui**, conserte e diga qual era.

## O que não serve

- "Atualizei o commit gravado e ficou verde" sem dizer o que mudou no vizinho.
- Apagar ou pular o teste que depende de clone. Ele mede uma fronteira real.
- Escrever no repositório vizinho. Quem mede é quem conserta — o que for deles sai
  como pedido no recado, para o chat repassar.

## Como sei que deu certo

O verde volta a `exit 0`, **ou** cada falha remanescente tem uma linha dizendo de
quem é e desde qual commit. E `docs/ONDE_PARAMOS.md` deixa de dizer "o verde está
vermelho e não é por mudança daqui" sem número ao lado.
