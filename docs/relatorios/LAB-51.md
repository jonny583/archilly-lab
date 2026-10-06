# LAB-51 · O cabeçalho que dizia não haver CI — e a guarda que faltava

**06/10/2026** · prompt da fila de 06/10, o quarto. Saiu da minha lista de *"proposto ao
chat"*, escrita no LAB-47 ao ler o script para medir a fase (a).

## 1 · A mentira, e onde ela morava

O alto do `external-engines/conferir.sh` — **o arquivo mais lido do repositório** — dizia,
por extenso:

> *"**Não há CI neste repositório** (não existe `.github/workflows`). Então nada roda isto
> automaticamente: 'verde' continua sendo alguém — ou um despertador — executando este
> comando. Proposto ao chat no LAB-31."*

**Era verdade quando o LAB-31 a escreveu, e ficou falsa no LAB-38**, que criou
`.github/workflows/verde.yml` com os dois trabalhos. **Oito dias**, e ninguém viu.

**É a forma exata do D104**, e ela já tinha custado caro aqui: o `faceDeRua` publicou `null`
por três semanas porque o motivo da perda morava num comentário, e **comentário não se
revalida**. Foi dali que saiu a guarda do §4. Este caso é o mesmo defeito **no documento que
mais gente lê**.

## 2 · O conserto, e ele tem duas metades

**A primeira é a afirmação.** O bloco agora descreve o CI que existe — os dois trabalhos,
o que cada um alcança, e por que o verde completo depende do `VIZINHOS_TOKEN` (D16, D124).
E **guarda a história**: a frase falsa fica citada, com as datas, porque apagá-la tiraria do
registro a única coisa útil que ela tem.

**A segunda é a guarda, e sem ela isto seria só um `sed`.** *Regra sem guarda é slogan*
(D136), e o LAB-51 só fecha porque a mentira **não pode voltar em silêncio**. Duas travas
novas no `tests/verde.test.ts` — que já lia o próprio script:

| trava | o que ela faz |
|---|---|
| **nenhuma afirmação de inexistência é desmentida pelo disco** | em toda linha que **afirma** *"não existe"* ou *"não há"*, todo caminho entre crases tem de, de fato, **não existir** |
| **o script NOMEIA o CI** | o cabeçalho tem de citar `.github/workflows/verde.yml`, e **não** pode afirmar *"não há CI"* |

A segunda existe porque **tirar a mentira não basta: silêncio também envelhece.** Um
cabeçalho que simplesmente deixasse de falar do CI voltaria a não dizer nada quando o
workflow mudasse.

## 3 · A régua ia reprovar o próprio conserto — e eu a vi antes de escrevê-la (D177)

O cabeçalho novo **cita** a frase falsa, e a citação carrega o caminho `.github/workflows`,
**que existe**. Uma régua ingênua reprovaria o arquivo que eu acabara de consertar.

**É a QUARTA vez da sub-família do D137, D142 e D155** — régua que varre texto e casa o nome
no lugar errado da gramática. **E é a primeira que eu peguei ANTES de escrever a régua**, não
depois de ela ficar vermelha:

| | |
|---|---|
| D137 | a régua exigia a chave `"gleba"` **literal** e media ortografia |
| D142 | a régua leu **menção** da palavra, não o `import` |
| D155 | a régua leu o **comentário** que explicava o conserto, e reprovou o arquivo consertado |
| **D177** | a régua ia ler a **citação** da frase falsa como se fosse a afirmação dela |

**O conserto é o `semCitacoes()`**, um degrau acima do `semComentarios()` do LAB-43: ele
tira as **citações marcadas** (`*"…"*` e `"…"`) antes de procurar a afirmação.

> **Régua que varre texto mede o que o texto AFIRMA e o que ele DIZ SOBRE SI, e só a
> primeira é o objeto.**

**O buraco, declarado:** afirmação disfarçada de citação escapa. É o preço de a régua
respeitar a marca, e é **menor** que o preço de ela reprovar o próprio conserto.

## 4 · Provado por sabotagem (D126)

Três sabotagens, cada uma desfeita em seguida:

| sabotagem | antes | depois |
|---|---|---|
| **a frase falsa de volta, sem marca de citação** | 8 pass · 0 fail | **6 pass · 2 FAIL** · exit 1 |
| o apontador para o workflow apagado | 8 · 0 | **7 · 1** · exit 1 |
| afirmação nova e falsa sobre outro caminho (`esteira/package.json`) | 8 · 0 | **7 · 1** · exit 1 |

**Restaurado: 8 pass · 0 fail · exit 0.**

**A primeira é a mentira histórica, e ela derruba AS DUAS travas** — é o teste honesto:
a régua apontada para o passado morde o que já aconteceu. **A terceira prova que a régua é
geral**, e não um `if` escrito para este caso: uma afirmação falsa sobre um caminho
**qualquer** reprova.

## 5 · Entrega

| o quê | onde |
|---|---|
| a afirmação consertada, com a história citada | `external-engines/conferir.sh`, cabeçalho |
| as duas travas + o `semCitacoes()` | [`tests/verde.test.ts`](../../external-engines/esteira/tests/verde.test.ts) |

**Sem prova em `docs/provas/`, e o motivo é declarado:** este prompt não mede gleba nem
produz número que viaje — mede **um arquivo de texto contra o disco**, e o registro da
sabotagem cabe neste relatório. Inventar um JSON para ter um JSON seria o contrário do §7.

**As travas entram no trabalho do CI sem clones vizinhos** — elas leem arquivo do próprio
repositório e não importam `@generate/*` nem `@testfit/*`. O número daquele trabalho foi de
**98 para 100**, e a trava de concordância do LAB-42/D165 obrigou a atualizar os **quatro**
lugares que o citam. A suíte inteira foi de **431 para 433**.

**Nada foi escrito em repositório vizinho**; os três clones conferidos e limpos.

## 6 · A decisão

- **D177** — **a quarta vez da sub-família da régua que lê texto, e a primeira pega antes de
  escrever a régua.** Citação marcada não é afirmação: o `semCitacoes()` a remove, como o
  `semComentarios()` do LAB-43 remove o comentário. E a guarda que nasceu é geral — *toda*
  afirmação de inexistência sobre caminho é conferida contra o disco, não só a que motivou o
  prompt.
