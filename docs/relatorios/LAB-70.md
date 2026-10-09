# LAB-70 · item 003 — ferramenta e trava não pegam a mesma coisa, e agora está escrito onde

**09/10/2026** · item 003 da caixa de entrada · `claude/stoic-ritchie-ijzqy3`

**O pedido:** o chat concordou com a frase do meu recado do LAB-66 e **recusou o lugar dela** —
*"recado não é contrato: amanhã alguém roda só uma das duas e conclui que está coberto."*

---

## 1 · A resposta, em cinco linhas

| | |
|---|---|
| **onde se lê agora** | [`docs/referencia/FERRAMENTA_E_TRAVA.md`](../referencia/FERRAMENTA_E_TRAVA.md) — treze verificações, duas na interseção, três só da ferramenta, oito só da trava |
| **o achado da conta** | **a ferramenta REPROVA exatamente a interseção**: tudo que é só dela mede e não reprova |
| **o que eu achei antes de começar** | a ferramenta acusava `LAB-68, LAB-69` de não terem recado, e os dois **têm** — o conserto do D228 entrou só na trava (D231) |
| **o que foi consertado** | os dois escapes de texto do D217, que salvavam **48 de 62** (D232). E **a nº 4 NÃO foi alinhada**, de propósito |
| **a linha que faltava** | o par confere **forma** e **presença**, nunca **verdade** nem **envio** (D233) |

**O nome do comando não se supõe:** o item chama a ferramenta de `npm run quebrar`, e **esse
script não existe** em nenhum dos dois `package.json`. Ela é `npm run lab66`. Há trava.

---

## 2 · O que eu achei antes de medir qualquer coisa (D231)

Primeiro comando do item, `bun run lab66`:

```
prompt(s) com relatório e SEM recado no arquivo: LAB-68, LAB-69
```

**Os dois têm recado**, nas linhas 1152 e 1166 do `RECADOS.md`. A Central mandou o `<app>` do
cabeçalho virar o nome do aplicativo; a **trava** aprendeu no mesmo dia (D228) e a **ferramenta**
não, porque ela **não roda no verde**.

| | antes | depois |
|---|---|---|
| cabeçalhos lidos | 72 | **74** (para 74 blocos) |
| relatórios sem recado | **2** (falsos) | **0** |

É a **décima oitava** ocorrência do ponto cego da §6 e a **nona** da sub-família da régua que
varre texto. A §6 foi atualizada: 18 linhas, 18 declarado, **9 + 4 + 2 + 2 + 1 = 18**, e a guarda
da aritmética confere a soma e cada linha.

> **Conserto de régua que não é aplicado em todos os instrumentos que leem a mesma coisa é meio
> conserto, e o que ficou de fora passa a mentir com a autoridade de quem conferia.**

E isto *é* o item 003 acontecendo sozinho: escopo que ninguém declara não fica parado, ele se
afasta.

---

## 3 · As quatro sabotagens, refeitas de verdade, com o instrumento nomeado

`npm run lab70`. No arquivo de verdade, os dois instrumentos em processo separado, o `RECADOS.md`
devolvido e o `sha256` conferido. **Linha de base: ferramenta `exit 0`, travas `exit 0`, 18
testes.**

| # | o que foi sabotado | a ferramenta | as travas | divergiu? |
|---|---|---|---|---|
| 1 | a lista **acima** do recado num bloco | **acusou** | **acusaram** (1 de 18) | não |
| 2 | o recado de **`LAB-69`** some (fora dos escapes) | **acusou** | **acusaram** (1 de 18) | não |
| 2' | o recado de **`LAB-66`** some (dentro dos escapes) | **acusou** | **calaram, 0 de 18** | **sim** |
| 3 | o cabeçalho composto perde um dos dois | **acusou** | **acusaram** (2 de 18) | não |
| 4 | `ACUMULADO` sem nomear quais | **calou** | **acusaram** (1 de 18) | **sim** |

**A nº 2 roda duas vezes, e é isso que estava faltando no meu recado do LAB-66.** Eu publiquei
*"em duas das quatro ferramenta e trava não pegaram a mesma coisa — a nº 2 só a ferramenta"*
**sem dizer qual prompt eu apaguei** — e o veredicto depende disso. *Número sem origem não vale*
(D232).

**A largura, medida em todos os relatórios de prompt** — apagando o bloco do recado de cada um,
um a um; **62 no dia da medição**, e o número cresce a cada prompt:

```
a trava deixava passar ..... 48 de 62
a trava deixa passar .......  0 de 62    depois do conserto
```

**A causa:** `!texto.includes(\`recados ${p}\`)` e `!texto.includes(\`${p},\`)`, dois escapes que o
conserto do D217 deu à trava e que casam o nome do prompt em **qualquer lugar do arquivo**.

---

## 4 · Uma divergência foi consertada e a outra NÃO — e a diferença entre as duas é a resposta

O item disse: *"não alinhe por padrão: você mesmo disse que a diferença é intencional."* Medido,
**das duas divergências uma era escopo e a outra era podridão.**

- **a nº 4 FICA.** A ferramenta varre o acumulado e **conta**; a trava confere a **forma**. A
  segunda linha de um bloco `ACUMULADO` é forma. Fazer um instrumento chamar o outro só para os
  números baterem *esconde a diferença em vez de declará-la* — o item proíbe, e com razão;
- **a nº 2' SAIU** (D232). Os escapes não eram escolha, eram conserto largo demais: o caso do
  D217 já era salvo pela borda de palavra **dentro do campo `<prompt>`**. O teste dos dois lados
  continua verde com a régua estreita.

---

## 5 · O que ninguém pega — a linha que o item disse que costuma faltar (D233)

| o que escapa dos dois | quem fecharia |
|---|---|
| recado que **nunca foi escrito**, em rodada sem relatório nem commit | o **item 004**, que abre a conta dos disparos em vazio |
| recado **gravado e não enviado** ao GitHub | comparar o disco com `origin/main` — **ninguém faz isso hoje** |
| recado completo, bem formado, e **FALSO** | **nada mecânico que eu saiba escrever hoje** |
| os nove recados antigos **acima do teto** | **nada, e não deve** — buraco escolhido, não esquecido |

> **O par confere FORMA e PRESENÇA. Não confere VERDADE, e não confere ENVIO.**

O terceiro fica **sem conserto proposto**, porque eu não sei escrever a régua. *Buraco sem "o que
faria pegar" é lamento — três dos quatro têm essa linha, e o que não tem diz por quê.*

---

## 6 · A guarda, e ela reprova — os dois lados demonstrados

`tests/escopo-dos-instrumentos.test.ts`, **11 travas**. O caso bom é a suíte verde. Os casos
ruins, estragados de verdade por `npm run lab70` e desfeitos com hash conferido:

| o caso ruim | a guarda |
|---|---|
| o documento deixa de citar uma das treze verificações | **`exit 1`** |
| a declaração conta um teste de menos na âncora da rodada | **`exit 1`** |
| o documento fica com o total **velho** de verificações | **`exit 1`** |

Ela confere a declaração **contra os instrumentos rodando**: a soma dos testes declarados contra
os `test(` dos arquivos de trava (**18**), os `problemas.push` da ferramenta contra a interseção
(**2**), o script que o item supôs **não** existindo e o de verdade existindo, e — o critério de
"deu certo" do item — **os dois instrumentos apontando para o documento na saída**, para quem
rodou um só encontrar escrito que não está coberto.

**E a marca de cada verificação no documento é DECLARADA, não adivinhada.** A primeira versão
desta trava escolhia a palavra por heurística e **reprovou o documento** por dizer *"bloco do
arquivo"* onde a declaração diz *"bloco de código"*. *Régua que casa por palavra que ninguém
escolheu mede ortografia* (D137) — pega dentro do prompt, pela própria trava.

---

## 7 · E a minha própria conta saiu errada, pega aqui

Eu escrevi **"doze verificações"** no documento e na declaração. **São treze** — 2 + 3 + 8 = 13,
e eu contei de cabeça uma lista que estava ao lado. Consertado antes de sair, e **a trava agora
cobra o total por extenso e recusa o total velho largado em outra frase**, que foi exatamente o
defeito da §6 no D212.

*Número que a própria página lista ao lado não se escreve de memória* (D185).

---

## 8 · O que NÃO foi feito

- **o `RECADOS.md` não foi reescrito** — ele foi sabotado e devolvido, com `sha256` conferido;
- **a nº 4 não foi alinhada**, e o §4 diz por quê;
- **nada foi escrito em repositório vizinho**;
- **o CI continua desligado** (`disabled_manually`, gatilho comentado), conforme o item. **Verde
  conferido aqui, não no GitHub.**

## 9 · O verde, e o que a própria suíte me cobrou no caminho

**`./external-engines/conferir.sh` · `exit 0` · 7 passos · 678 travas na esteira + 17 no
testfit.** A trava nova entrou também no trabalho `guardas-sem-clones` do CI — ela só lê arquivo
deste repositório —, que vai de **278 para 289 travas**. **Conferido aqui, não no GitHub:** a
execução automática continua desligada até 1º/11.

Três coisas a suíte cobrou de mim neste prompt, e as três eram minhas:

| o que ela acusou | o que era |
|---|---|
| `esteira · lint` — `no-control-regex` em `lab70.ts` | o `\u001b` literal na régua que tira a cor do terminal; passou a vir de `String.fromCharCode(27)` |
| `chamadas.test.ts` — `numero-sem-conferir` | `Number(… ?? 0)` ao ler o resumo `N pass`. **Era o mesmo defeito que já tinha me dado `exit 0, 0 testes`**: agora ele **estoura** em vez de inventar zero |
| `regras.test.ts` — o número de travas do CI divergindo entre arquivos | eu atualizei **três** dos quatro lugares que citam o número, e a `FILA.md` ficou em 278. *Número em quatro terras envelhece em uma delas* |

A primeira prova nova precisou entrar na **lista declarada de exceções** da §7
(`regras.test.ts`): ela mede instrumentos, não gleba — e o motivo está escrito, como a lista
exige.

## 10 · Os clones vizinhos ficaram limpos

`git status` nos três: **0 alterações** em `urban-scout-tool`, `urban-create-hub-41d93a4d` e
`motor-testfit`.
