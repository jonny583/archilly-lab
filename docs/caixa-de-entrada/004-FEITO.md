> # ✅ FEITO — 09/10/2026, LAB-71
>
> **A conta mora em [`docs/ONDE_PARAMOS.md`](../ONDE_PARAMOS.md), na seção *A CONTA DOS DISPAROS
> DO DESPERTADOR*** — a primeira do arquivo, porque é também o único lugar que diz o estado dele
> agora. Relatório: [`docs/relatorios/LAB-71.md`](../relatorios/LAB-71.md). Prova:
> [`docs/provas/item-004/conta-dos-disparos.json`](../provas/item-004/conta-dos-disparos.json).
>
> | o que o item pediu | onde está |
> |---|---|
> | 1 · a conta dos disparos em vazio, uma linha por disparo, com data | `ONDE_PARAMOS.md` — a tabela da seção, mais a **origem** de cada hora, que o item não pediu e sem a qual duas das quatro seriam hora inventada |
> | 2 · conferir o id contra a conta antes de escrever | `ONDE_PARAMOS.md` — a tabela *"o que a conta disse"*, conferida às **18:06Z**. **O gravado estava certo**, e a conferência achou outra coisa: o **estado** em dois lugares do mesmo arquivo (D234) |
> | 3 · deixar escrito o que o número vai decidir | `ONDE_PARAMOS.md` — a seção *"O QUE ESTE NÚMERO VAI DECIDIR"*, **cobrada por trava** |
> | *"não religue nem mexa por iniciativa própria"* | **nada foi tocado**: `cron`, `enabled` e prompt guardado intactos; o CI segue desligado |
>
> **O primeiro dia mediu o CONTRÁRIO da suspeita (D235): ZERO em vazio, e DOIS disparos
> acumulados** — a caixa não ficou sem abastecimento, a **rodada** é mais longa que o intervalo. A
> rodada do item 003 levou 58 min contra 60 de intervalo. **Decidir o intervalo é do chat**, e
> está escrito na seção o que cada caso decide.
>
> **O precedente da FILA (três, em 03/10 e 05/10) é lido do `RECADOS.md` pela régua do item 002**,
> não digitado, e **não soma** com a conta da caixa. E o *"4 de 7 de 15/09"* da §1-A fica **fora
> das duas**, nomeado: era outro despertador, e aqueles quatro nunca tiveram recado um por um.
>
> **Guarda: 14 travas**, com os dois lados demonstrados — quatro casos ruins estragados de verdade
> no `ONDE_PARAMOS` (`exit 1` nos quatro), devolvido por hash. **Verde conferido aqui, não no
> GitHub.**

---

# 004 — o disparo em vazio é medição, e ninguém a estava guardando

**Vem de:** a família inteira, em 08/10. Mandei "apague o despertador" e você
desobedeceu com razão: apagar perde o id e perde o histórico de disparo. A regra
ratificada é **desligar, nunca apagar** (D62 + D112), e no Orçamento isso custou
uma medição — ele descobriu que **nunca teve despertador próprio**, depois de
procurar entre 19 rotinas da conta. Daí a regra nova da família:
**identificador não se supõe.**

## O que fazer

1. **Abra a conta dos disparos em vazio** no `docs/ONDE_PARAMOS.md`: uma linha por
   despertador que acordou e não achou item na caixa de entrada, com data.
   Uma linha, não um parágrafo — o valor está na série, não no texto.
2. **Confira o id antes de escrever qualquer coisa sobre despertador**, inclusive
   aqui: `trig_01XwSkTLT9zmyprNZcUiWy7f` é o que está gravado. Se o que a conta
   responder for outro, o gravado está errado e quem manda é a conta.
3. **Deixe escrito o que o número vai decidir.** Disparo em vazio não é fracasso:
   é a medida de quanto a caixa de entrada fica sem abastecimento, e é o que vai
   dizer se o intervalo do despertador está certo. Sem essa frase no arquivo, em
   duas semanas alguém apaga a lista por achar que é ruído.

## O que não serve

- Deduzir o id de outro aplicativo, do nome, ou deste arquivo.
- Religar ou mexer no despertador por iniciativa própria. Ligar e desligar é do
  chat; o seu trabalho é a conta.

## Como sei que deu certo

Depois do primeiro despertador que acordar com a caixa vazia, existe uma linha
datada no `ONDE_PARAMOS.md` e um recado de uma linha no `RECADOS.md` — e nenhuma
invenção de trabalho entre os dois.
