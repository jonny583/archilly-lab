> ## ✅ FEITO — **LAB-95**, em dois despertadores: 15:08 e 19:07 de 12/10/2026
>
> **A meta foi alcançada no segundo:** o `CLAUDE.md` tem **12 706** caracteres (meta: 15 000),
> com as **79 regras** e **zero linhas perdidas** — e as duas citações literais intactas.
>
> **E a D321 estava errada, e está escrita a correção (D322):** o primeiro despertador disse que
> baixar de 15 000 *"exige tirar regra ou editar citação literal"*. **Não exigia.** Os *"203
> caracteres por regra"* eram a **medida** da redação daquele dia, não um **chão** — eu tratei uma
> saída como restrição. Medido no segundo: as mesmas 79 regras cabem em **~130 por regra**, sem
> tirar nenhuma e sem tocar nas citações. *Afirmação sem teste é afirmação provavelmente falsa* —
> e esta foi uma afirmação minha sobre o que **não** dava, que é a mais fácil de não testar.
>
> **O que mudou no segundo despertador, com arquivo:**
>
> - `CLAUDE.md` — **18 527 → 12 706**; cada regra em uma frase, as listas da §6 e da §4 apertadas;
>   duas frases da casa voltaram porque as guardas acusaram (abaixo);
> - `docs/provas/LAB-95/nada-se-perdeu.json` — `chegouNaMeta: true`, inventário 0 problemas,
>   linhas perdidas 0;
> - `docs/provas/LAB-81/as-leituras.json` e `docs/provas/LAB-57/varredura-de-configuracao.json` —
>   regeradas (a do LAB-57 estava **vermelha na `main`** desde o commit `3088d9e`, que acrescentou o
>   `900.md` à árvore: 569 arquivos contra 568 na prova);
> - `docs/DECISOES.md` — **D322**; `docs/relatorios/LAB-95.md` — **§8**.
>
> **As guardas que acusaram o encurtamento, as três com razão:** `regras.test.ts` (a frase
> *"698 travas que leem arquivo do próprio repositório"* tem de estar numa linha só — a régua casa
> sem quebra), `custo-por-uso.test.ts` (*"fora da árvore"*, o buraco declarado da guarda) e o
> `lab95` (as duas linhas de abertura do texto antigo, que não estavam na história e iam se perder).

# 028 — ENXUGAR O CLAUDE.md: A REGRA FICA, A HISTÓRIA MUDA DE GAVETA

**De:** a direção · 11/10/2026, 22h50 · **pedido expresso do Jonny**

## Por quê

Este `CLAUDE.md` tem hoje **53437 caracteres**, e toda sessão desta casa o lê
inteiro antes de fazer qualquer coisa — inclusive a que acorda e acha a caixa
vazia. Medido na direção: os onze `CLAUDE.md` da família somam ~535 mil
caracteres, e **Generate e Geo sozinhos são 65 % disso**. O plano semanal do
Jonny passou da metade em um dia e meio, e esta é a maior alavanca de economia
que existe: ela vale em toda sessão, todos os dias.

A causa é de forma, não de conteúdo: o arquivo virou **diário**. Cada lição
entrou com a história inteira de como foi descoberta — números da época,
hipóteses descartadas, quem acusou quem. A história é valiosa e **não se perde**.
Ela só não precisa ser lida para trabalhar.

## O que fazer

1. **Antes de mexer, liste as guardas que leem o `CLAUDE.md`:**
   `git grep -l "CLAUDE.md" -- ':!vendor'` nos testes e scripts. Para cada uma,
   anote o que ela cobra. **O verde tem de ficar verde**: ou a frase guardada
   continua no `CLAUDE.md` (em forma curta), ou a guarda passa a ler o arquivo
   novo — e, se mudou de alvo, a sabotagem dela é refeita e continua mordendo.
2. **Crie `docs/HISTORIA_DAS_REGRAS.md`** e mova para lá, **literal, sem editar**,
   toda a história: medições datadas, números de outras builds, listas de
   ocorrências, hipóteses descartadas, "como isto nasceu", tabelas históricas,
   trechos riscados. Uma seção por regra, com título que dê para apontar.
3. **No `CLAUDE.md` fica só o que a sessão precisa para trabalhar HOJE:**
   - o que é o aplicativo, em poucas linhas;
   - cada regra em **uma ou duas frases**, no imperativo, seguida do ponteiro
     `(história: docs/HISTORIA_DAS_REGRAS.md §N)`;
   - comandos, onde mora cada coisa, o formato do recado e as marcas de fim;
   - os trechos que a família mandou gravar **LITERAIS** ficam literais (são curtos).
   **Nenhuma regra some.** Regra que vira uma frase continua sendo regra; o que
   sai é o relato.
4. **Meta: o `CLAUDE.md` com no máximo 15 mil caracteres.** Não chegou? Diga
   no recado quanto ficou e o que impediu — número, não adjetivo.
5. **Confira por contagem** que nada se perdeu: toda regra que existia antes
   existe depois (no `CLAUDE.md`) e toda frase de história existe no arquivo
   novo. Escreva a conta no relatório (regras antes × depois; caracteres antes ×
   depois nos dois arquivos).

## Se não couber num despertador só

Entregue em partes, com a `main` sempre verde, e **não marque como FEITO** até a
meta: o próximo despertador continua este mesmo item.

## O que NÃO fazer

- não mudar comportamento, código de produto, `vendor/` nem tarefa agendada;
- não reescrever regra "para melhorar" — encurtar, sim; mudar o sentido, não;
- não apagar história: mover. Apagar é a única forma de errar este item.

## As cinco classes, uma a uma

Gasta dinheiro: não. Não tem volta: não (o git guarda tudo, e nada é apagado).
Muda promessa ao usuário: não (nada de tela). Segurança, dado pessoal ou condição
comercial: não. Urbanismo ou negócio: não.

## Volta

Recado com: caracteres do `CLAUDE.md` antes e depois, quantas regras antes e
depois (têm de ser iguais), quantas guardas leem o arquivo e quantas mudaram de
alvo. **Um envio só.**
