# LAB-79 · O alcance das provas — item 012

**10/10/2026.** O item 012 pediu, nesta ordem: **medir** quantas provas se conferem contra si
mesmas, e só então **construir** a trava. A ordem era o recado.

> **Lista que cresce é dívida visível. Trava que confere consigo mesma é dívida invisível — e ela
> sai VERDE.**

**Conferido aqui, não no GitHub** (execução automática desligada até 1º/11/2026).

---

## 1 · A medição, e ela é MECÂNICA

A lista de quem cita quem **sai da leitura dos arquivos de teste**, não da minha memória — por
isso não envelhece junto comigo. Antes deste prompt:

| quantas | como se confere | o que isso quer dizer |
|---|---|---|
| **2** | remedida da fonte, **com escopo publicado** | só as duas do LAB-49 |
| **18** | remedida em parte, **sem escopo declarado** | alguma trava confere algo, e **qual parte não está publicada** |
| **23** | **só a forma** | a §7 confere que as **chaves** existem. *Forma não é número* |
| **24** | **sem trava nenhuma** | não é "aprovada": é **não lida** |

2 + 18 + 23 + 24 = **67**, e a conta fecha por trava.

> **Sessenta e cinco de sessenta e sete provas não tinham escopo publicado.**

**Depois deste prompt: 7 / 17 / 21 / 23 de 68.** O universo ganhou uma prova — a deste prompt, que
**se inclui na contagem**. Fica dito, porque prova que mede provas conta a si mesma, e esconder
isso seria o começo de um número que ninguém refaz.

---

## 2 · A pergunta de projeto: a divisão de DUAS classes não cobriu todas

O item propôs duas — *estado de agora* (regerável) e *evento* (nunca) — e foi explícito: *"se essa
divisão não couber em alguma prova, **ela é o achado** — escreva qual e por quê, em vez de
forçá-la."*

**Não couberam, e o contra-exemplo é de um prompt atrás.** A prova do LAB-78 mede lotes de um
plano gerado pelo motor de um **vizinho**, num commit dele. Ela *parece* estado de agora — mede o
que existe. Mas regerá-la **muda o sujeito**: o LAB-59 mediu com `motor-testfit` em `4181e95`, o
LAB-78 rodou em `6cf6396`, e **dois dos quatro lotes deixaram de existir**.

> **PROVA MEDIDA CONTRA O CLONE DE UM VIZINHO NÃO É ESTADO DE AGORA NEM EVENTO: ela afirma o
> presente DE OUTRO REPOSITÓRIO, num commit dele.** Regerá-la em silêncio não atualiza a
> medição — **troca a pergunta** e some com a resposta antiga.

São **três** classes. `podeSerRegerada` diz **não por padrão**, e a terceira só passa **com o
commit do vizinho declarado** na prova. É a fronteira do D182 em código — e *o D182 não se
afrouxa de madrugada*.

---

## 3 · A trava nova pegou uma prova VELHA na primeira execução

**Não num teste sintético: no repositório.** Ao implementar a remedição do
`item-004/conta-dos-disparos.json`:

```
a prova dizia      5 disparos · 1 em vazio
a conta viva dizia 14 disparos · 4 em vazio
```

Estava velha **desde 09/10**, e **nada no verde reprovava isso** — o defeito que o item nomeou, na
forma exata do D195 (a prova do LAB-57 dizia 1, a ferramenta dizia 10, e saiu verde).

E a ironia mede o problema: **é a prova mais viva da casa.** A conta dos disparos cresce **a cada
hora**, por desenho.

> **Prova de ESTADO cujo número cresce sozinho precisa de remedição, não de revisão.** Revisão é
> alguém lembrar; remedição é o verde não deixar passar.

Ela é `estado-de-agora`, então a divisão permite regerá-la: `bun run lab71`, e passou a dizer 14 e
4. **Nenhuma prova de evento foi reescrita** (D256).

---

## 4 · O que ganhou escopo publicado, e o critério é declarado

Cinco provas, escolhidas **por critério e não por gosto**: as cujos números saem de **módulos
deste repositório**, sem clone vizinho e sem motor — portanto remedíveis dentro da trava, de
graça, a cada verde.

| prova | o que é remedido contra a fonte |
|---|---|
| `item-003/escopo-dos-instrumentos.json` | as 13 verificações, a interseção e os dois lados, de `VERIFICACOES`/`soDa`/`aIntersecao` |
| `item-004/conta-dos-disparos.json` | os **totais** da conta, relidos do `ONDE_PARAMOS.md` por `lerAConta` |
| `LAB-76/registro-de-motores.json` | o padrão (`PADRAO_DE_FABRICA`), o universo (`universoLido`), a `MOTORES_DE_LOTE` e a conferência refeita |
| `LAB-77/acesso-sugerido.json` | as cinco regras, a régua da faixa e a faixa em uso |
| `LAB-78/setimo-mecanismo.json` | o contato, os **veredictos refeitos** por `deQuemEhAViolacao` e a conta por `contarOsVereditos` |

O que exige rede, clone ou motor sai **`naoMedida` com o motivo** — e o motivo é sempre custo ou
dependência, **nunca comodidade** (a régua do D164).

**E há trava de que cada `medida` seja implementada**: declaração que diz `medida` e não remede
nada seria a dívida invisível **com mais código** — o defeito, de novo.

---

## 5 · A guarda da guarda, nos DOIS sentidos

O item a fez obrigatória, e com uma exigência precisa: *"com a prova velha de propósito tem de
reprovar **pelo nome da prova**"*.

| sabotagem | o que acontece |
|---|---|
| prova **em dia** | **passa** — o sentido sem o qual isto não prova nada |
| **número velho** | reprova com `PROVA VELHA em \`<caminho>\``, a chave, o valor gravado e o da fonte |
| **chave nova** na prova sem classificação | reprova (`chave-da-prova-sem-escopo`) — D164 |
| **chave do escopo** que saiu da prova | reprova (`escopo-sem-chave`) — o escopo não envelhece calado |
| o caso do **D195** refeito | `1` contra `10` reprova **pelo nome do arquivo**, em vez de sair verde |

Toda reprovação carrega o **nome da prova**: uma que não diz qual arquivo está velho manda quem
conserta procurar.

---

## 6 · A trava que proibia escrever em disco ACUSOU A SI MESMA

A fronteira do item: *"pare se a trava nova quiser **escrever** dentro de `docs/provas/`"*. Escrevi
a trava disso lendo o próprio fonte e conferindo que `writeFileSync` não aparece.

**Ela reprovou.** O fonte contém a palavra **porque é ela que a proíbe** — o literal está no
`expect`.

**Terceira vez desta família:** D142 (a régua leu a menção, não o `import`), D155 (leu o comentário
que explicava o conserto), e esta. E o conserto já estava escrito na §6: *procure o nome no lugar
da gramática onde ele significa aquilo*.

Escrever em disco exige **importar** o escritor. A régua passou a casar a linha do `import` de
`node:fs` e a exigir exatamente `readFileSync`, `readdirSync`, `statSync` — nada mais.

> **Régua que lê o arquivo inteiro mede o que o código DIZ; régua que lê o `import` mede o que ele
> PODE FAZER** (D257).

É a **24ª** do §6, e a partição foi refeita: **14 + 4 + 2 + 3 + 1 = 24**.

---

## 7 · As duas linhas de encerramento que o item pediu

1. **O D236 já estava riscado e já apontava para a D244** — feito no LAB-75 (item 008). Não
   refiz; **conferi**. Mas a `FILA.md` ainda o **citava como vivo** em duas frases, e isso foi
   corrigido: as duas passaram a `~~D236~~ → D244`. *Regra revogada citada como viva volta por
   engano* — é a razão da própria §1-A;
2. **A D243 é o próximo item**, e está anotada como tal no topo da seção de propostas da
   `FILA.md`, com as palavras do chat sobre por que ela veio depois. **Não comecei**: é mudança de
   modelo de uma varredura de segurança, e isso não se faz na mesma rodada de outra coisa.

---

## 8 · As fronteiras, e nenhuma foi atravessada

- **a trava não escreve em `docs/provas/`** — e há trava disso **no `import`** dela;
- **nenhuma prova de evento foi regerada**: a única regerada é `estado-de-agora`, e a divisão o
  diz;
- **nada precisou de rede, serviço pago ou navegador**;
- **nenhuma pergunta ao Jonny** — a regra do chat até sábado às 15h. Nada deste prompt depende
  dele, e nada novo entrou na página dele.

**Os três clones vizinhos ficaram limpos** (§4).

---

## 9 · Entrega

| o quê | onde |
|---|---|
| a medição e as três classes | `external-engines/esteira/src/alcance-das-provas.ts` |
| o escopo publicado das cinco | `external-engines/esteira/src/escopo-remedido.ts` |
| as travas | `external-engines/esteira/tests/alcance-das-provas.test.ts` — **25** |
| a ferramenta | `external-engines/esteira/ferramentas/lab79.ts` · `bun run lab79` |
| a prova | `docs/provas/LAB-79/alcance-das-provas.json` |

**VERDE: 7 passos, `exit 0`. Conferido aqui, não no GitHub.** O `guardas-sem-clones` do CI vai de
**427 para 452**.

**Decisões: D255** (o alcance medido e a terceira classe), **D256** (a trava pegou uma prova velha
na primeira execução), **D257** (a trava acusou a si mesma, e a régua passou a ler o `import`).
