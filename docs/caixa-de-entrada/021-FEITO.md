> ✅ **FEITO no LAB-88**, em 11/10/2026, no despertador das 00:05. Relatório em
> [`../relatorios/LAB-88.md`](../relatorios/LAB-88.md), prova em
> `docs/provas/LAB-88/onde-esta-o-padrao.json`, decisões **D292 e D293**.
>
> **Escolhida a FORMA 1 — ponteiro com procedência, no MESMO caminho** — e a medição que decidiu
> **não estava no item**: o rótulo *"Versão 3.0 · 10/10/2026"* cobre **DOIS textos diferentes na
> origem**, `96dbc9b` (1 712 linhas · 106 081 bytes) e `e48bff9` (1 731 · 107 395) — **+19 linhas e
> +1 314 bytes com o mesmo número** —, e a cópia vendorizada do Parcelamento é **byte a byte igual
> à PRIMEIRA**: ela já está atrás **sem que o número mude**. *É o D148 num documento: carimbar a
> versão numa cópia é carimbar o rótulo, e rótulo não é identidade — só o commit identifica o
> texto.* **É isso que mata a forma 3**, porque declarar *"Versão 1, 8 % do vigente"* é declarar um
> rótulo.
>
> **A forma 2 cai por MEDIÇÃO, e a §11 mordeu como você previu:** `jonny583/archilly-central` é
> **privado** e este repositório é **público**; o verde roda sem rede por desenho e o trabalho de
> CI que roda em todo envio **não tem segredo** — a trava ficaria **verde por não achar o objeto**
> (D213), e seria um **terceiro** vizinho privado a pedir na §11, que já espera por dois desde o
> LAB-38. Está registrado na página dele, para leigo, com o *"não escolhi essa forma exatamente
> para não te pedir uma terceira senha"*.
>
> **A sua medida conferida, na origem e com `git show`:** a fonte é `main:docs/PADRAO_ARCHILLY.md`,
> **Versão 3.0**, commit **`e48bff9`** (20:36:15Z), **1 731 linhas · 107 395 bytes**; a cópia que
> havia aqui tinha **145 linhas · 12 716 bytes** = **8,4 % das linhas e 11,8 % dos bytes**. Você
> disse *"8 % dele"* e está certo nas duas unidades. **O conteúdo de `e48bff9` é byte a byte o do
> `HEAD` de agora.**
>
> **O ponteiro ficou no MESMO caminho de propósito:** é onde quem procura o Padrão chega, e
> **nenhum link morreu** — o `LF-FINAL`, o `LF-FINAL-2` e o `INDEX` apontam para ele. **O texto da
> Versão 1 está no histórico**, em `4081c27`, com a receita de leitura escrita no ponteiro:
> *arquivo que sai da árvore continua no histórico; o que a saída tira é a autoridade de parecer
> vigente.*
>
> **E O PONTO CEGO DA §6 BATEU DUAS VEZES NESTA RODADA, COM O MESMO INSTRUMENTO** (D293, a **28ª**,
> e a **terceira que escapou**). **Primeira:** eu ia te acusar de mandar procedência velha — clonei
> a origem com `--depth 1`, perguntei quando o arquivo mudou e ouvi **`944c232`, de 23:48**, três
> horas depois do commit que você mandou. Medido com profundidade, o último commit do arquivo **é
> `e48bff9`**: `944c232` é só o **HEAD**, o commit do **corte**. **A sua procedência estava exata.**
> **Segunda, e essa já estava publicada:** o **D291** de ontem diz *"trazida em 03/10 no PR #40"*, e
> a verdade é **`4081c27`, 14/09, PR #12** — o commit da própria conferência do `LF-FINAL` —, com
> **um único commit** em toda a vida do arquivo. *Clone raso não erra por silêncio: devolve um
> commit QUE EXISTE, com data e assunto plausíveis — a pior forma de resposta errada, a que passa
> por medição.* Corrigido **por riscado** nos quatro lugares em que o número saiu, e
> `git rev-parse --is-shallow-repository` é a pergunta que faltava.
>
> **E uma trava minha mudou de objeto, com o motivo escrito:** a do LAB-87 exigia a frase
> *"congelada na Versão 1"* no índice e a proibia dentro da cópia; com a cópia fora, mantê-la
> obrigaria a casa a **repetir para sempre um número que ela acabou de tirar do caminho**. *Trava
> cuja coisa cobrada deixou de existir não fica "passando": passa a cobrar uma frase que ficou
> falsa.*
>
> **O que este item não pediu e não foi feito:** a **D226** não foi tocada, **nada foi escrito em
> repositório vizinho** (a divergência das duas cópias do Parcelamento é sua para levar à caixa
> dele), o **gatilho não foi religado**, e **nenhum texto foi inventado** — a cópia não foi
> atualizada para a 3.0.

---

# 021 — a cópia do Padrão: eu NÃO vou mandar o texto, e o motivo é um número

**De:** a direção · 11/10/2026, 00h20 UTC
**Por que este, e não outro:** você fechou o LAB-87 com uma oferta — *"Se você
quiser a cópia em 3.0, mande o texto e eu gravo"* — e a sua própria linha de
*Próximo na fila* (a D226) **muda o desenho e espera o olho dele**. Então respondo
a oferta, e a resposta é **não mandar**, com a medida que a sustenta.

---

## 1 · Você estava certo em não trocar, e por um motivo maior do que supôs

A sua frase era: *"reescrever uma cópia que não é minha para igualar um número
seria inventar conteúdo que eu não li. **Declarar um número velho é medição;
trocá-lo sem a fonte seria o contrário.**"*

**Medido agora, nas duas origens:**

```
archilly-central  docs/PADRAO_ARCHILLY.md       1.731 linhas · 107.395 bytes
                  "Versão 3.0 · 10/10/2026"     commit e48bff9, 20:36 UTC

archilly-lab      docs/referencia/…              145 linhas ·  12.716 bytes
                  "Versão 1 · 13/09/2026"
```

**A sua cópia não é uma versão velha do mesmo documento: é 8% dele.** O padrão
cresceu **12×** entre a Versão 1 e a 3.0. Não há "atualizar o número" — há
substituir um documento de 145 linhas por um de 1.731.

## 2 · Por que mandar o texto seria a resposta errada

Se eu colar 1.731 linhas num item, você grava e **amanhã ela está velha outra
vez** — o padrão mudou **duas vezes só em 10/10**. E o que nasce daí é
exatamente o que esta casa mais persegue: **uma segunda lista**, mantida à mão,
que ninguém revalida, com a autoridade de um documento normativo.

**É o D104 da sua casa, aplicado a um `.md`:** *lista que não se revalida
envelhece igual a comentário.* E o seu próprio LAB-87 mediu o preço disso em duas
provas no mesmo dia.

## 3 · E o seu ÂNCORA deixou de argumentar — isto é medição nova, da direção

Você garante que a cópia é **byte a byte igual à do Parcelamento** (`cmp` →
IGUAIS, as duas na Versão 1). **Confirmado.** Mas medi o resto, e a âncora tem
duas pontas:

| onde | versão |
|---|---|
| `motor-testfit` · `docs/referencia/PADRAO_ARCHILLY.md` | **Versão 1 · 13/09** — a que você espelha |
| `motor-testfit` · `vendor/archilly-central/padroes/PADRAO_ARCHILLY.md` | **Versão 3.0 · 10/10** |

**O Parcelamento tem DUAS cópias do mesmo documento normativo, em versões
diferentes — e o `CLAUDE.md` dele aponta para a de 13/09** (*"As regras da
família inteira: `docs/referencia/PADRAO_ARCHILLY.md`"*), enquanto a 3.0 está na
pasta ao lado, dentro do `vendor/`.

**Então "sou byte a byte igual ao Parcelamento" não é mais um argumento para
ficar na Versão 1:** é a prova de que você espelha **a mais velha de duas cópias
que já divergem na casa vizinha.** (Isso é problema do Parcelamento, e vai para a
caixa dele por conta própria — **não é seu para consertar.**)

## 4 · O pedido — e a decisão é sua, com três formas na mesa

**Você é a única casa da família que não vendoriza o kit**, e o kit é justamente
quem carrega `padroes/` para dentro das outras. Então a pergunta não é *"qual
versão copiar"*, é **se a cópia deve existir**. Meça e decida entre:

1. **PONTEIRO COM PROCEDÊNCIA** — a cópia sai e fica um arquivo curto que diz
   **onde** está a fonte (repositório, ramo, caminho), **qual versão e qual
   commit** foram lidos por último, e **quando**. Perde-se ler o padrão sem rede;
   ganha-se não ter nunca mais um documento normativo velho em casa;
2. **CÓPIA COM CARIMBO E GUARDA** — a cópia fica, com a procedência no topo, e
   uma trava que **reprova quando o commit da origem muda** — isto é, ela não
   mente, ela **avisa**. Pede alcançar `jonny583/archilly-central` do seu verde,
   e é aqui que o seu §11 (os vizinhos privados, o seu repositório público) pode
   morder: **se não alcançar, diga, e a forma 2 cai**;
3. **CONGELADA E DECLARADA, como está hoje** — com o número e agora **o tamanho**
   declarados: *"8% do documento vigente"*, que é mais informativo que a versão.

**Eu não escolho por você**, e a razão é a sua: *o universo está dentro desta
casa?* — aqui não está, e por isso quem mede o custo de cada forma é quem roda o
verde.

## 5 · A procedência, para qualquer das três

```
repositório  jonny583/archilly-central
ramo         main
caminho      docs/PADRAO_ARCHILLY.md
versão       3.0 · 10/10/2026
commit       e48bff9  (2026-10-10T20:36:15Z)
tamanho      1.731 linhas · 107.395 bytes
```

**Leia da ORIGEM, nunca de clone no disco** (`git show origin/main:<caminho>`) —
é o disco-não-é-origem, que três casas pagaram no mesmo dia.

## 6 · O que este item NÃO pede

- **não pede a D226.** Ela muda o desenho e espera o olho dele — você classificou
  certo;
- **não pede tocar em repositório vizinho.** A divergência do Parcelamento é
  informação para você decidir, e **vai à caixa dele por mim**;
- **não pede inventar conteúdo.** Se nenhuma das três formas for executável sem
  ler o texto, **a resposta é a forma 3 mais um recado dizendo isso** — e aí eu
  mando o texto na rodada seguinte, por partes.

## 7 · Como eu saberei que foi atendido

Está escrito qual das três formas você escolheu **e por quê**; a procedência
acima está gravada onde a forma escolhida pede; e, se tiver ficado trava, ela
reprova pelos dois lados (commit igual → cala; commit diferente → acusa).
