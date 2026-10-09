# LAB-71 · item 004 — a conta dos disparos, e o id conferido antes de escrever

**09/10/2026** · item 004 da caixa de entrada · `claude/stoic-ritchie-ijzqy3`

**O pedido:** *"apagar perde o id e perde o histórico de disparo… disparo em vazio não é fracasso:
é a medida de quanto a caixa de entrada fica sem abastecimento."* Com a regra da família por
cima: **identificador não se supõe.**

---

## 1 · A resposta, em quatro linhas

| | |
|---|---|
| **o id** | conferido **na conta** antes de escrever qualquer coisa: o gravado estava **certo** |
| **o que a conferência achou** | não foi o id — foi o **estado**, escrito em **dois lugares do mesmo arquivo**, um deles velho (D234) |
| **a conta** | aberta no `ONDE_PARAMOS`, uma linha por disparo, com a **origem de cada hora** |
| **o que o primeiro dia mediu** | **o contrário** do que a regra temia: zero em vazio, e **dois disparos acumulados** (D235) |

**Nada foi tocado no despertador.** *Ligar e desligar é do chat; o meu trabalho é a conta* — o
item diz isso, e o CI continua desligado.

---

## 2 · O id, conferido na conta (e foi a conferência que achou o defeito)

O que a conta respondeu em **09/10/2026, 18:06Z**: `trig_01XwSkTLT9zmyprNZcUiWy7f`, *Archilly Lab
— fila autônoma (60 min)*, `cron 5 * * * *`, **`enabled: true`**, criado 02/10 23:35Z, alterado
09/10 14:56Z, último disparo 18:06:10Z, próximo 19:05Z, preso a esta sessão. **O gravado estava
certo.**

**Mas o estado não.** Dentro do `ONDE_PARAMOS.md`:

| onde | o que dizia |
|---|---|
| a abertura do arquivo | *"🔴 O DESPERTADOR ESTÁ DESLIGADO · `enabled: false` em 08/10"* |
| a seção da caixa, 70 linhas abaixo | *"Despertador **RELIGADO**"* |
| **a conta** | **`enabled: true`**, disparo às 18:06:10Z |

A abertura era a **velha**: escrita ao esgotar a fila de 08/10, e **ninguém a apagou ao religar**
no item 001.

> A §1-A manda o id morar no `ONDE_PARAMOS` *"não aqui — id em duas terras envelhece numa
> delas"*. **Ele envelheceu DENTRO da terra certa: uma terra não é um arquivo, é um lugar** (D234).

Consertado: o estado mora **só** na conta dos disparos, a seção da caixa aponta para lá, e **a
trava reprova se a seção citar mais de um id**. O registro histórico não foi mexido.

---

## 3 · A conta, e a ORIGEM de cada hora

| data | hora UTC | origem | o que achou | a rodada |
|---|---|---|---|---|
| 09/10/2026 | 15:05 | derivado | item na caixa, o 001 em curso | acumulou |
| 09/10/2026 | 16:05 | derivado | item na caixa, o 001 em curso | acumulou → item 002 |
| 09/10/2026 | 17:05 | **observado** | item 003 pronto | item 003 |
| 09/10/2026 | 18:06 | **observado** | item 004 pronto | item 004 |

```
disparos observados: 4 · em vazio: 0
```

**A origem é um campo, e não enfeite:** duas das quatro horas saem do `cron` `:05` com o
religamento às 14:56Z e do recado do LAB-69 (*"dois disparos tinham acumulado enquanto eu
trabalhava no 001"*) — **não** de notificação lida. *Hora derivada publicada como medida é hora
inventada com a autoridade de hora medida.* O vocabulário é fechado e a trava reprova um terceiro.

---

## 4 · O que o primeiro dia mediu, e é o contrário da suspeita (D235)

A §1-A nasceu de **4 dos 7 disparos de 15/09 sem o que fazer**. Na caixa de entrada: **zero em
vazio**, e **dois acumulados** — a rodada do item 003 levou **58 minutos** contra 60 de intervalo,
e as do item 001 passaram de duas horas.

> *A conta não nasceu para confirmar a suspeita; ela nasceu para medi-la, e mediu o contrário.*

**E a conclusão não é minha de executar.** O que a conta decide está escrito na seção: muitos
disparos em vazio → o intervalo pode **esticar**; nenhum em vazio **com disparos acumulando** → a
rodada é mais longa que o intervalo, e **cabe ao chat** decidir se quer um item por hora ou um por
rodada. Eu não mexo no `cron`.

---

## 5 · O precedente, etiquetado como reconstrução — e o quarto número que fica FORA

As três rodadas da classe `despertador-sem-item` são **lidas do `RECADOS.md` pela régua do item
002**, não digitadas: **03/10**, **05/10** e **05/10**. São do regime da **FILA**, e **não somam**
com a conta da caixa — *somar duas séries diferentes é o erro da §6*.

**E há um quarto número que não entra em nenhuma das duas:** a §1-A diz *"dos 7 disparos do
despertador de 15/09, 4 não tiveram o que fazer"*. Era **outro** despertador e outro regime, e
aqueles quatro **nunca tiveram recado um por um** — existe a contagem, não a série.

> **Número que não pode ser refeito a partir do registro fica nomeado e fora da soma.**

---

## 6 · A guarda, e ela reprova — os dois lados demonstrados

`tests/disparos-em-vazio.test.ts`, **14 travas**. O lado bom é a conta real fechando sem um
problema. Os lados ruins, estragados de verdade no `ONDE_PARAMOS.md` por `npm run lab71` e
devolvidos com `sha256` conferido:

| o caso ruim | a guarda |
|---|---|
| o total declarado deixa de bater com as linhas | **`exit 1`** |
| a frase do que o número decide sai da seção | **`exit 1`** |
| uma linha ganha origem fora do vocabulário | **`exit 1`** |
| um disparo em vazio aparece **sem** recado da classe | **`exit 1`** |

Mais, em processo: ordem das datas invertida, recado da classe **sem** linha na conta (o segundo
sentido), a seção ausente — que é **problema e não aprovação** —, e um segundo id na seção.

**A seção é achada pelo TÍTULO, não por número:** seção numerada muda de número quando alguém
insere outra acima, e a régua passa a ler o vazio (D213).

---

## 7 · E uma régua minha acertava por acidente

A trava do precedente comparava datas **como texto**, em `DD/MM/AAAA`: `"03/10/2026" <
"09/10/2026"` dá o resultado certo — e **dá errado no mês seguinte**, porque dia primeiro não
ordena. Trocado pelo dia normalizado antes de sair. *Régua que acerta por acidente é régua errada
esperando a data virar.*

## 8 · O conflito que eu NÃO desempatei (D236)

A caixa esgotou, então **o próximo disparo é o primeiro candidato real a disparo em vazio** — e
nessa hora duas regras da casa mandam coisas diferentes:

| onde | o que manda |
|---|---|
| `CLAUDE.md` §1-A (D62 + D112) | **DESLIGAR** o despertador; *"o chat o religa com fila nova"* |
| `caixa-de-entrada/COMO_FUNCIONA.md`, do chat, **09/10** | **anotar a data e dormir** — não fala em desligar |
| o **item 004**, do mesmo dia | *"ligar e desligar é do chat; o seu trabalho é a conta"* |

**Não desempatei, e isso é a escolha:** mexer no `enabled` é o que o item proíbe, e reescrever a
§1-A sozinha seria eu decidindo no lugar do chat uma regra que ele acabou de escrever de outro
jeito. **Sigo a da caixa até ele responder**, com o motivo medido: desligar servia quando o chat
tinha de ser avisado para mandar fila nova; agora ele escreve na caixa **sem passar por mim**, e
despertador desligado **nunca pega o item 005**.

As duas páginas passam a **apontar uma para a outra**, e **há trava** reprovando se uma perder a
referência. *Conflito que não fica declarado é resolvido pela próxima sessão sem que ninguém
saiba.* Está em `FILA.md` como *"Proposto ao chat, saído do item 004"* e no recado.

## 9 · O que NÃO foi feito

- **nada foi tocado no despertador** — nem o `cron`, nem o `enabled`, nem o prompt guardado;
- **o CI não foi religado**, e segue `disabled_manually` até 1º/11. **Verde conferido aqui, não no
  GitHub;**
- **o registro histórico não foi reescrito**: os `enabled:` dos recados e da `FILA.md` são o que
  foi enviado no dia;
- **nada foi escrito em repositório vizinho.**

## 10 · O verde

**`./external-engines/conferir.sh` · `exit 0` · 7 passos · 692 travas na esteira + 17 no
testfit.** A trava nova entrou também no trabalho `guardas-sem-clones` do CI — ela só lê arquivo
deste repositório —, que vai de **289 para 303**. **Conferido aqui, não no GitHub.**

## 11 · Os clones vizinhos ficaram limpos

`git status` nos três: **0 alterações** em `urban-scout-tool`, `urban-create-hub-41d93a4d` e
`motor-testfit`.
