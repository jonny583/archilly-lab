> ✅ **FEITO no LAB-86**, em 10/10/2026, no despertador das 22:05. Relatório em
> [`../relatorios/LAB-86.md`](../relatorios/LAB-86.md), prova em
> `docs/provas/LAB-86/a-prova-velha.json`, decisões **D287 e D288**.
>
> **Remedi antes de consertar, e o defeito estava VIVO — pior do que a D204 descreveu.** Ela falava
> de *uma edição* de atraso; medido, são **semanas**: a prova commitada do LAB-57 dizia **364**
> arquivos que o git carrega, **128** de código e **36 157** linhas, e a mesma árvore dizia
> **498**, **187** e **50 714** — 26 a 32 % do número de hoje. E ela ainda carregava **dois
> caminhos mortos**, pastas de compilação que não existem mais.
>
> **Por que nada reprovava, e esta é a lição:** a trava conferia a prova com **LIMIAR** —
> `configuracoesEncontradas > 20`, `configuracoesVarridas > 5`, `linhasDeCodigoLidas > 10000`. Uma
> prova congelada em 36 157 linhas passa `> 10000` para sempre. *Régua que confere uma prova com
> `maior que` aceita qualquer prova velha que já fosse grande o bastante quando nasceu:* o limiar
> mede se o número é PLAUSÍVEL, só a recontagem mede se ele é VERDADE — e num repositório que
> cresce, **o limiar fica mais frouxo a cada commit sem ninguém mexer nele** (D287).
>
> **A forma escolhida é RECONTAR e comparar, e o carimbo foi recusado POR MEDIÇÃO** — exatamente
> pelo motivo que você avisou: *o carimbo do disco não é o do git*, numa sessão nova todo arquivo
> tem a data do checkout, e a comparação vira **vácuo** justamente no CI, que é onde ela mais
> precisaria valer. *Guarda que não acha o objeto não está aprovando: está sem medir nada* (D213).
>
> **E a sua exigência de UM LUGAR SÓ foi o que mais rendeu:** a conta estava dentro da ferramenta,
> e escrevê-la de novo na trava criaria duas implementações da mesma pergunta. Ela saiu para
> `src/escopo-da-varredura.ts`, e **a ferramenta e a trava chamam a mesma função** — com o universo
> começando no `git ls-files`, o LUGAR, como você exigiu: *lista à mão não vê o arquivo que nasceu
> depois dela*.
>
> **Os dois sentidos, demonstrados** — e o caso válido que quase parece inválido passa: duas
> recontagens na mesma árvore batem, então a prova que não mudou **porque nada que ela mede mudou**
> não reprova. **E o vigia acusou o trabalho de quem o escrevia:** ao registrar o script `lab86` no
> `package.json` — configuração que a varredura lê — a recontagem acusou na hora, `760 → 761`.
>
> **O alcance, porque você mandou a medição decidir o tamanho:** das **74** provas, **11** têm o
> universo dentro desta casa e **63 dependem de fora**. Uma foi recontada (a que a D204 nomeou); as
> outras dez foram para a `FILA.md`, porque são medição **por prova**. *Recontar o que depende de
> fora não é mais rigor: é outra medição com o nome da antiga* (D288). **E nenhuma segunda lista
> nasceu** — a fronteira do §7 foi reusada, como você pediu.
>
> **A armadilha que você previu apareceu, e no lugar que você apontou:** a pergunta *"quando este
> arquivo foi tocado?"* não é de texto nem de comentário. Aqui ela virou *"quanto este arquivo
> mede?"*, que é de **recontagem** — e foi por isso que o carimbo caiu.
>
> **E as suas duas correções estão recebidas:** a §11 na sua lista consolidada, e o registro do
> meu achado (5) contra você. *Quando eu disser que algo "já está na página dele", eu abro a
> página* — vale para mim igual.
>
> **O gatilho NÃO foi religado.** As três árvores vizinhas ficaram limpas e nos commits em que
> estavam.

---

# 019 — A D204: a trava que regera a varredura de configuração. Você a nomeou como "o próximo natural"

**Da direção, 10/10/2026, 22h25 UTC. Rodada do chão.**

## Este item é a sua segunda escolha, porque a primeira é dele

Você fechou o LAB-85 nomeando **duas** candidatas, e a sua própria régua já
descartou uma:

> *"**Próximo na fila:** a **D226** (os quatro campos de `legais`), que **MUDA O
> DESENHO e espera o olho dele**; e **a trava que regera a varredura de
> configuração (D204)**, que você mesmo nomeou como 'o próximo natural' depois do
> LAB-84."*

**A D226 é dele e fica dele** — mudança de desenho espera o olho do Jonny, e a
fila autônoma não a escolhe. **Então é a D204**, e a escolha é sua: eu só estou
confirmando que a condição que você mesma pôs (não ser desenho) está satisfeita
nela e não na outra.

---

## O que a D204 mede, nas suas palavras

> **D204 · Prova gerada antes da última edição do que ela mede é prova velha**
>
> *"Medido ao abrir o LAB-60, no commit `4249027`, **sem mudar uma linha**: a
> prova commitada do LAB-57 dizia **1** e a ferramenta dizia **10**, na MESMA
> árvore. A causa não é defeito de régua: o último `bun run lab57` daquele prompt
> rodou **antes** das edições finais dele mesmo — as que escreveram `@ts-ignore`,
> `@ts-nocheck` e `eslint-disable` no texto dos declarados e na documentação da
> régua. **A prova ficou com o número de antes**, e `naoDeclarados: []` era
> verdade naquele instante."*

> **É a forma mais honesta de prova falsa que existe:** ninguém mentiu, ninguém
> errou a régua, e o número estava certo — **uma edição atrás**. A prova não
> envelheceu por descuido: ela envelheceu porque *o prompt que a gerou continuou
> trabalhando depois de gerá-la*, que é o que todo prompt faz.

E ela é irmã de um defeito que a sua casa já pagou nove vezes: **a régua
acusando o próprio fonte** (D155), que é por que a limpeza fácil não serve — *"a
única limpeza que resolveria — tirar comentários — cegaria essa regra por
completo, porque é dentro de comentário que os declarados vivem."*

---

## O que o item pede

1. **A trava**, e a forma dela é a pergunta: *a prova commitada foi gerada DEPOIS
   da última edição do que ela mede?* Duas maneiras de responder, e a escolha é
   sua — com o motivo escrito:
   - **regerar e comparar** na conferência (a prova do disco contra a prova de
     agora, na mesma árvore). É a mais forte e a mais cara;
   - **comparar carimbos** — o instante da prova contra o instante da última
     mudança dos arquivos que ela lê. Mais barata, e **só serve se o universo que
     ela lê for descoberto pelo LUGAR**, nunca por uma lista escrita à mão ao
     lado; senão o arquivo novo não entra no carimbo e a trava fica verde por não
     ter visto;

2. **O universo é o das provas de MEDIÇÃO, e você já tem a fronteira escrita.** O
   seu `CLAUDE.md` §7 separa prova de medição das que não medem gleba nenhuma, com
   **lista declarada de exceções e o motivo de cada uma**, e com a guarda que
   reprova exceção que *deixou de precisar* ser exceção. **Reuse essa fronteira;
   não invente uma segunda** — duas listas para a mesma pergunta divergem, e a
   sua casa chama isso de A409;

3. **Os dois sentidos, com a sabotagem.** A trava tem de **reprovar** uma prova
   gerada antes de uma edição (plante: regere a prova, edite o que ela mede, não
   regere) e **passar calada** na prova gerada depois. *O caso válido que quase
   parece inválido* é a prova que não mudou **porque nada que ela mede mudou** —
   régua que exigisse carimbo mais novo a cada commit reprovaria a árvore
   correta, e vigia que nasce vermelho vira ruído e morre;

4. **E a armadilha que vai aparecer, porque é a sua família de defeito mais
   repetida.** Você acabou de escrever a oitava ocorrência dela, no mesmo dia em
   que a registrou como decisão:

   > *"a régua de texto achou a palavra `if:` DENTRO do comentário que explica a
   > condição. (...) **A PERGUNTA DECIDE O INSTRUMENTO.**"*

   Aqui a pergunta é *"quando este arquivo foi tocado?"* — e ela não é de texto
   nem de comentário: é de **git**. Pergunte ao histórico, não ao conteúdo. E
   cuidado com o inverso: **o carimbo do disco não é o do git**, e uma sessão nova
   herda arquivos com data de checkout. *O que está no disco não é o que está na
   origem*, inclusive em mtime.

---

## E DUAS COISAS SUAS QUE JÁ ESTÃO NO MEU LADO — a segunda é uma correção a mim

**1 · A §11 da página dele entrou na minha lista consolidada.** A senha de
leitura (`VIZINHOS_TOKEN`) ou tornar os dois vizinhos públicos: eu a levei para
`docs/PENDENCIAS_JONNY.md` da direção, ordenada pelo que destrava mais — e ela
destrava o verde completo na nuvem, que é o maior desbloqueio aberto da sua casa.
**Você não precisa pedir de novo.**

**2 · O seu achado (5) é contra mim, e está certo.** Eu escrevi que o segredo
*"está na página de pendências desde o LAB-38"*, e **não estava**:

> *"`VIZINHOS_TOKEN` aparece em 16 arquivos da árvore e a página do Jonny **não é
> um deles**; a palavra 'token' aparece **ZERO** vezes nela. (...) **PEDIDO QUE
> MORA SÓ NUM RELATÓRIO NÃO CHEGA A QUEM DECIDE** — é o §1-B numa forma pior,
> porque foi para um arquivo, e **arquivo errado é mais perigoso que nenhum**:
> ele dá a sensação de que o pedido existe. **E A PROVA DE QUE DÁ É VOCÊ:** você o
> citou como feito, lendo o LAB-38 e concluindo o passo que faltava."*

**Registrado na minha página de decisões como correção da direção**, e com a
consequência que ela impõe ao meu trabalho: **quando eu disser que algo "já está
na página dele", eu abro a página** — é a sua própria régua (*para afirmar que
algo existe, abra o arquivo*) aplicada a mim, e foi a vigésima oitava vez que o
defeito estava do lado de quem media.

**E o achado (1) da mesma rodada vale para a família toda, e eu o carrego:** os
*"136 minutos, 50% de tudo"* são **minutos-trabalho**, não dinheiro —
`billable.UBUNTU.total_ms` **zero em 3 de 3**, porque repositório público em
`ubuntu-latest` é gratuito e não medido. *A unidade em que se conta o desperdício
não era a unidade em que a conta é paga.* Isso muda como eu leio o estouro de
Actions da família, e não só a sua linha.

---

## As cinco classes — conferidas uma a uma

1. **gasta dinheiro?** Não. Nenhuma execução na nuvem — **e o gatilho NÃO se
   religa**, como você escreveu três vezes hoje: *a régua cobra, não liga*. A
   trava de 1º/11 continua sendo quem cobra;
2. **não tem volta?** Não. Nenhuma migração, nada apagado. Prova regerada é
   reversível e o commit diz o delta;
3. **muda promessa ao usuário?** Não — e **este repositório não tem interface**,
   com a exceção declarada da bancada do navegador. Nada aqui a toca;
4. **segurança, dado pessoal ou condição comercial?** Não. **E nada se escreve em
   repositório vizinho** — os dois clones são só leitura, e a conferência de que
   ficaram limpos entra na entrega, como sempre;
5. **urbanismo ou negócio?** Não. **A D226 é**, e é por isso que ela não está
   aqui.

**Verde conferido aqui, não no GitHub**, e **um envio por entrega**. O recado
inteiro no `RECADOS.md`, e **um bloco só**.

=== FIM DO PROMPT ===
