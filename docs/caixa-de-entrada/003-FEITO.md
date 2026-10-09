> # ✅ FEITO — 09/10/2026, LAB-70
>
> **Onde se lê:** [`docs/referencia/FERRAMENTA_E_TRAVA.md`](../referencia/FERRAMENTA_E_TRAVA.md)
> — **treze** verificações, **duas** na interseção, **três** só da ferramenta, **oito** só da
> trava. Relatório: [`docs/relatorios/LAB-70.md`](../relatorios/LAB-70.md). Prova:
> [`docs/provas/item-003/escopo-dos-instrumentos.json`](../provas/item-003/escopo-dos-instrumentos.json).
>
> | o que o item pediu | arquivo e linha |
> |---|---|
> | 1 · o escopo lado a lado, em documentação | `docs/referencia/FERRAMENTA_E_TRAVA.md` §1 — a tabela das treze, com a coluna *reprova?* |
> | 2 · as quatro sabotagens, com o instrumento nomeado | `FERRAMENTA_E_TRAVA.md` §2, refeitas de verdade por `external-engines/esteira/ferramentas/lab70.ts:216` |
> | 3 · o que ninguém pega | `FERRAMENTA_E_TRAVA.md` §4 — quatro buracos, e `src/escopo-dos-instrumentos.ts:O_QUE_NINGUEM_PEGA` |
> | 4 · o conserto, quando a diferença não era de propósito | `tests/recado.test.ts` — os dois escapes do D217 saíram (D232); a nº 4 **ficou**, e o §3 diz por quê |
> | *"quem rodar apenas um deles encontra escrito que não está coberto"* | `ferramentas/lab66.ts` (última linha da saída) e `external-engines/conferir.sh` (idem) |
>
> **O nome do comando não se supõe:** `npm run quebrar` **não existe** neste repositório —
> conferidos os dois `package.json`. A ferramenta é `npm run lab66`. **Há trava** para isso em
> `tests/escopo-dos-instrumentos.test.ts`.
>
> **Três decisões:** **D231** (o conserto do D228 entrou só na trava, e a ferramenta passou a
> acusar `LAB-68` e `LAB-69` falsamente — 18ª ocorrência do ponto cego da §6), **D232** (os dois
> escapes do D217 salvavam **48 de 62**; e o *"2 de 4"* do LAB-66 dependia de qual prompt eu
> apaguei, o que o recado não dizia), **D233** (o par confere **forma** e **presença**, nunca
> **verdade** nem **envio**).
>
> **Guarda: 11 travas**, e ela **reprova** — três casos ruins demonstrados, com o documento e a
> declaração devolvidos por hash. **Verde conferido aqui, não no GitHub.**

---

# 003 — ferramenta e trava não pegam a mesma coisa, e em duas sabotagens isso apareceu

**Vem de:** o seu recado do LAB-66, achado (b).

## A afirmação a conferir

"Em DUAS das quatro sabotagens, ferramenta e trava não pegaram a mesma coisa — a
nº 2 só a ferramenta, a nº 4 só a trava. Os escopos são diferentes de propósito, e
dizer isso vale mais que fingir que as duas cobrem tudo."

Concordo com a frase. O problema é que ela está **num recado**, e recado não é
contrato: amanhã alguém roda só uma das duas e conclui que está coberto.

## O que fazer

1. **Escreva o escopo de cada uma, lado a lado**, num arquivo de documentação (não
   num relatório de prompt): o que `npm run quebrar` pega e a trava não, o que a
   trava pega e ele não, e a interseção.
2. **Prove com as quatro sabotagens**, nomeando qual instrumento acusou cada uma.
   Número sem origem não vale: se a conta for 2 de 4, o relatório mostra as 4.
3. **Diga o que ninguém pega.** Se existe defeito que escapa dos dois, essa é a
   linha mais valiosa do arquivo — e é exatamente a que costuma faltar.
4. Se o conserto for alinhar os escopos em vez de documentá-los, faça o conserto e
   diga por que a diferença não era de propósito. Mas **não alinhe por padrão**:
   você mesmo disse que a diferença é intencional.

## O que não serve

- Um parágrafo dizendo "os escopos são diferentes" sem a tabela do que é de quem.
- Fazer a ferramenta chamar a trava (ou vice-versa) só para os números baterem.
  Isso esconde a diferença em vez de declará-la.

## Como sei que deu certo

Existe um lugar só onde eu leio o que cada instrumento cobre, com as quatro
sabotagens como prova, e com a linha do que escapa dos dois. E quem rodar apenas
um deles encontra escrito que não está coberto.
