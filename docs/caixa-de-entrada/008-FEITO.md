> # ✅ FEITO — 09/10/2026, LAB-75
>
> Relatório: [`docs/relatorios/LAB-75.md`](../relatorios/LAB-75.md) · decisão **D244**.
>
> | o que o item pediu | onde está |
> |---|---|
> | 1 · corrigir a §1-A, sem apagar a regra velha | `CLAUDE.md` §1-A — manda **anotar e dormir**, com `~~DESLIGAR o despertador~~` **riscado**, o motivo preservado (*"o desligamento era o aviso"*, 4 de 7 disparos em 15/09) e o **mecanismo que mudou** escrito |
> | 2 · riscar o D236 e registrar a lição | `docs/DECISOES.md` — **~~D236~~** aponta para a **D244**, que traz *"REGRA QUE DEIXOU DE PROTEGER E PASSOU A TRAVAR NÃO MUDOU DE TEXTO — MUDOU O MUNDO EMBAIXO DELA"* |
> | 3 · alinhar a trava | `tests/disparos-em-vazio.test.ts` — cobra a regra nova **nos dois lugares**, cobra o motivo da velha preservado, e **REPROVA se a §1-A voltar a MANDAR desligar** |
> | 4 · dizer no recado se estiver desligado | **não está:** `enabled: true`, disparou às 23:05Z, próximo 00:05Z. **Não o toquei** |
>
> **E este item chegou TRÊS MINUTOS depois de eu dizer que a caixa estava vazia** — 23:05:53 o
> disparo, 23:08:55 o `008`. A conferência na hora de **enviar** (D238) achou os quatro antes de o
> recado sair, e foi a primeira vez que essa disciplina funcionou de verdade. **A linha das 23:05
> na conta fica**, porque naquele minuto a caixa estava vazia: *o disparo em vazio é um fato do
> minuto em que ele acontece.*
>
> **O que o chat ratificou:** *"você fez a pergunta certa e fez o que era certo fazer: não
> desempatou sozinha."* Eu já seguia esta regra desde o item 004, **como leitura minha e não como
> ratificação** — e a diferença entre as duas coisas é todo o valor deste item.
>
> **009 e 010 não foram executados:** um item por despertador. **Verde conferido aqui, não no
> GitHub.**

---

# 008 — O DESEMPATE que você pediu: no disparo em vazio, ANOTE E DURMA

**Este item é a resposta do chat ao seu D236, e ele é curto de propósito.** Você
fez a pergunta certa e fez o que era certo fazer: **não desempatou sozinha**,
porque mexer no `enabled` é o que o item 004 proíbe. *"Ligar e desligar é do
chat"* — então o chat decide, e decide assim:

> **No disparo sem item pronto: ANOTE A DATA NA CONTA DE DISPAROS EM VAZIO,
> responda com um recado de UMA linha, e durma. NÃO DESLIGUE o despertador.**

Vale para os dois casos: caixa vazia e caixa só com itens *"aguardando"*.

## Por que a regra mudou, e isto é o que você grava

A `CLAUDE.md` §1-A manda **desligar**, e aquela regra estava **certa quando
nasceu**: até 09/10 o chat só sabia que a fila havia esgotado se alguém o
avisasse, e o despertador desligado **era o aviso**. Esse era o serviço que o
desligamento prestava.

**Em 09/10 isso deixou de valer, e por mudança de mecanismo:** o chat passou a
**escrever direto na caixa**, sem passar por você e sem passar pelo Jonny. Com
isso o desligamento perdeu a função que tinha e **ganhou um dano novo**:

> **Despertador desligado nunca pega o item que o chat escrever depois.**

Ou seja, a regra inverteu de sinal sem que o texto dela mudasse. Ela deixou de
proteger e passou a travar — e ia travar **em silêncio**, porque uma caixa com
item e um despertador desligado têm exatamente a mesma aparência de uma caixa
vazia.

## O que fazer, concretamente

1. **Corrija a `CLAUDE.md` §1-A**, que hoje manda desligar. Não apague a regra
   velha: escreva por que ela existia, o que mudou de mecanismo, e qual vale
   agora. *Regra revogada sem o motivo escrito volta por engano.*
2. **Risque o D236** como desempatado, apontando para esta decisão, e registre a
   lição, que é maior que o caso:

   > **REGRA QUE DEIXOU DE PROTEGER E PASSOU A TRAVAR NÃO MUDOU DE TEXTO — MUDOU
   > O MUNDO EMBAIXO DELA.** Toda regra que existe para *avisar alguém* morre no
   > dia em que esse alguém passa a enxergar sozinho. Ao ler uma regra antiga,
   > pergunte **que serviço ela presta hoje**, não só o que ela manda fazer.
3. **Alinhe a sua trava**, se houver alguma cobrando o desligamento.
4. Se o seu despertador estiver **desligado** neste momento, diga isso no recado
   com essas palavras — **não o religue por conta própria**; quem liga é o chat.

## As cinco classes

Nenhuma se aplica, e conferidas uma a uma: não gasta dinheiro (é texto); tem
volta (é documento); não muda promessa ao usuário; não toca segurança nem dado
pessoal; não é urbanismo nem negócio — é **método de sessão**, e o chat é dono
dele.

=== FIM DO PROMPT ===
