# Ferramenta e trava não pegam a mesma coisa

**09/10/2026 · item 003 da caixa de entrada** · prova em
[`docs/provas/item-003/escopo-dos-instrumentos.json`](../provas/item-003/escopo-dos-instrumentos.json)
· declaração em `external-engines/esteira/src/escopo-dos-instrumentos.ts`

Duas coisas leem o `docs/relatorios/RECADOS.md` e dizem se ele está certo. **Elas não conferem a
mesma coisa**, e até este arquivo existir isso estava escrito num recado — e recado não é
contrato:

> *"Amanhã alguém roda só uma das duas e conclui que está coberto."* (o chat, item 003)

Este é o lugar onde se lê o que cada uma cobre. Se você rodou **uma só**, o que você **não** mediu
está na tabela abaixo.

---

## 0 · O nome, que não se supõe

O item 003 chama a ferramenta de **`npm run quebrar`**. **Esse script não existe neste
repositório** — conferidos os dois `package.json` (`external-engines/esteira` e
`external-engines/testfit`), nenhum o declara. Os nomes de verdade são:

| | o comando | mora em | roda no `conferir.sh`? |
|---|---|---|---|
| **a ferramenta** | `npm run lab66` | `external-engines/esteira/ferramentas/lab66.ts` | **não**, e é de propósito |
| **a trava** | `bun test` | `tests/recado.test.ts` + `tests/classes-de-rodada.test.ts` | **sim**, no passo `esteira · test` |
| **a sabotagem** | `npm run lab70` | `external-engines/esteira/ferramentas/lab70.ts` | não — ela escreve no `RECADOS.md` e desfaz |

*Identificador não se supõe* vale para id de despertador e vale para nome de comando.

---

## 1 · Os escopos, lado a lado

**Treze** verificações: **duas** na interseção, **três** só da ferramenta, **oito** só da trava — e 2 + 3 + 8 = 13, conferido pela guarda do §5.

| o que confere | ferramenta | trava | reprova? |
|---|---|---|---|
| todo bloco do arquivo **abre com o recado** (§1) | ✅ | ✅ | reprova |
| todo relatório `LAB-xx.md` **tem recado no arquivo** (D216) | ✅ | ✅ | reprova |
| quantos blocos, cabeçalhos, compostos e relatórios existem | ✅ | — | só mede |
| quantos recados têm `<prompt>` igual a `—` (o buraco do D216) | ✅ | — | só mede |
| gravar os números crus em JSON (§7) | ✅ | — | só mede |
| `--- O QUE VAI JUNTO ---` **nunca solto fora de um bloco** (§1) | — | ✅ | reprova |
| bloco `ACUMULADO` **nomeia** quais recados ele junta | — | ✅ | reprova |
| a régua do acumulado aceita rodada **sem número** e recusa lista vaga (D219) | — | ✅ | reprova |
| os **dois lados** da régua do recado ausente — inventado reprova, composto passa (D217) | — | ✅ | reprova |
| cada recado abre no formato `— <app> · <prompt> ===` e fecha com `=== FIM ===` (D228) | — | ✅ | reprova |
| o **último** recado tem no máximo **doze linhas** (§1) | — | ✅ | reprova |
| o último recado responde aos **cinco campos** do formato | — | ✅ | reprova |
| toda rodada tem **âncora** — prompt ou classe de vocabulário fechado (D229) | — | ✅ | reprova |

### O achado que a conta dá, e ele é o oposto do que o nome sugere

> **A ferramenta REPROVA exatamente a interseção.** Tudo o que é só dela — as duas contagens e o
> JSON — **mede** e não reprova.

Quem roda só `npm run lab66` **não ganha nenhuma verificação que a trava não tenha**: ganha dois
números e um arquivo de prova. Quem roda só o verde perde **esses dois números e a prova**, e
nada mais.

**Então por que a ferramenta existe?** Porque medição não é reprovação: o número de recados sem
prompt nomeado (hoje **10**) é o que dimensionou o buraco que o item 002 fechou, e nenhuma trava
teria produzido esse número — trava diz *passou* ou *não passou*, nunca *quanto*.

---

## 2 · A prova: as quatro sabotagens, com o instrumento nomeado

Refeitas de verdade por `npm run lab70`, no arquivo de verdade, com os dois instrumentos rodando
em processo separado e o `RECADOS.md` devolvido com `sha256` conferido.

**Linha de base, antes de qualquer sabotagem:** ferramenta `exit 0`, travas `exit 0`, **18
testes**.

| # | o que foi sabotado | a ferramenta | as travas | divergiu? |
|---|---|---|---|---|
| 1 | um bloco com a lista **acima** do recado | **acusou** (`exit 1`) | **acusaram** (1 de 18) | não |
| 2 | o recado de um prompt some do arquivo — o de **`LAB-69`**, **fora** dos escapes | **acusou** | **acusaram** (1 de 18) | não |
| 2' | o mesmo, o de **`LAB-66`**, **dentro** dos escapes | **acusou** | *(antes do conserto)* **calaram, 0 de 18** | **sim** |
| 3 | o cabeçalho composto perde um dos dois prompts | **acusou** | **acusaram** (2 de 18) | não |
| 4 | bloco `ACUMULADO` **sem nomear quais** recados ele junta | **calou** (`exit 0`) | **acusaram** (1 de 18) | **sim** |

**A nº 2 roda duas vezes, e é isso que estava faltando no LAB-66.** Aquele recado disse *"a nº 2
só a ferramenta"* **sem dizer qual prompt foi apagado** — e o veredicto depende disso. Apagando o
recado de `LAB-69`, os dois acusam; apagando o de `LAB-66`, só a ferramenta acusava. *Número sem
origem não vale*, e a origem era o prompt escolhido.

### A largura disso, medida em TODOS os relatórios de prompt

Apagando o bloco do recado de **cada um** deles, um a um — **62 no dia da medição**, e o número
vivo está na prova, porque ele cresce a cada prompt:

```
a trava deixava passar ..... 48 de 62   que a ferramenta acusa
a trava deixa passar .......  0 de 62   depois do conserto do item 003
```

**A causa:** o conserto do D217 — que salvou o cabeçalho composto `LAB-13 e LAB-14` — deu à trava
dois escapes de texto, `recados LAB-xx` e `LAB-xx,`, que casam o nome do prompt em **qualquer
lugar do arquivo**, inclusive dentro do corpo de outro recado.

---

## 3 · O que foi CONSERTADO, e por que não era de propósito

Das duas divergências, **uma era escopo e a outra era podridão.**

**A nº 4 é escopo, e fica:** a ferramenta varre o acumulado inteiro e conta; a trava confere a
forma do recado. A segunda linha de um bloco `ACUMULADO` é forma, e a ferramenta nunca a leu.
Alinhar isso seria fazer um instrumento chamar o outro só para os números baterem — o item 003
proíbe, e com razão: *isso esconde a diferença em vez de declará-la.*

**A nº 2' era podridão, e saiu (D232):** os dois escapes de texto não eram escolha, eram um
conserto largo demais. O caso que o D217 queria salvar **já é salvo** pela borda de palavra
**dentro do campo `<prompt>`** do cabeçalho — `/\bLAB-13\b/` casa `LAB-13 e LAB-14` sem precisar
varrer o arquivo inteiro. O teste *«a trava do recado ausente REPROVA de verdade»* prova os dois
lados, e continua verde com a régua estreita.

> **Régua nova nasce estreita demais, e às vezes larga demais: as duas coisas são o mesmo
> defeito — ninguém a conferiu dos dois lados.**

**E havia uma terceira divergência, que ninguém tinha olhado:** a Central mandou o `<app>` do
cabeçalho virar o nome do aplicativo, e a **trava** aprendeu no mesmo dia (D228) enquanto a
**ferramenta** continuava casando `— Lab · ` **literal** — porque ela não roda no verde.
Resultado medido ao começar o item 003: **a trava verde e a ferramenta acusando `LAB-68, LAB-69`
de não terem recado, com os dois tendo** (D231). *Escopo que ninguém declara não fica parado:
ele se afasta.*

---

## 4 · O que NINGUÉM pega — a linha mais valiosa deste arquivo

Nenhuma das quatro é hipótese; as três primeiras já aconteceram.

| o que escapa dos dois | por que | o que faria pegar |
|---|---|---|
| **recado que nunca foi escrito**, em rodada que não gera relatório nem commit | as duas réguas leem o que **está** no arquivo; rodada sem rastro não pode ser cobrada por falta — foi assim que o recado do PR #85 se perdeu (D216) | a conta dos disparos do despertador, confrontada com os recados do dia: é o **item 004** |
| **recado gravado e NÃO enviado** ao GitHub | os dois rodam na minha máquina e leem o disco. `commit` sem `push` fica verde nos dois, e o chat — que lê o `RECADOS.md` **direto do GitHub** — não vê nada | comparar o arquivo do disco com o de `origin/main` antes de fechar a entrega. **Ninguém faz isso hoje, e é o buraco de maior consequência** |
| **recado completo, bem formado, e FALSO** | nenhuma das treze verificações lê o conteúdo contra a realidade: um `Estado:` dizendo verde com a suíte vermelha passa pelos dois — o D110 é isso por duas semanas | **nada mecânico que eu saiba escrever hoje.** Está aqui por honestidade: o par confere **forma** e **presença**, nunca **verdade** |
| os **nove recados antigos** acima do teto de doze linhas | a trava do teto olha **só o último**, de propósito: `RECADOS.md` é registro do que foi enviado, e reescrevê-lo falsificaria o registro | **nada, e não deve.** Este buraco é **escolhido**, não esquecido |

> **O par confere FORMA e PRESENÇA. Ele não confere VERDADE, e não confere ENVIO.**
> Verde nos dois e nada no GitHub é o estado mais perigoso que este repositório sabe produzir.

---

## 5 · Há guarda, e ela confere isto contra os instrumentos rodando

`tests/escopo-dos-instrumentos.test.ts`. Ela reprova quando:

- a soma dos testes declarados aqui **não é** o número de testes que os arquivos de trava têm
  (hoje **18**, contados neles);
- a ferramenta ganha ou perde um caminho de reprovação sem a declaração mudar (hoje **2**, e eles
  são exatamente a interseção);
- uma verificação fica **sem instrumento nenhum**, ou dois ids se repetem;
- este arquivo **deixa de citar** uma verificação, uma das sabotagens ou um dos buracos;
- um dos dois instrumentos **para de apontar para este arquivo** na saída — é o que faz quem
  rodou um só encontrar escrito que não está coberto.

*Lista que não se revalida envelhece igual a comentário* (D104), e esta pode ser desmentida.
