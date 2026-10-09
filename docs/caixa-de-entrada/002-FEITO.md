> # ✅ FEITO em 09/10/2026 — LAB-69, verde `exit 0`, conferido aqui e não no GitHub
>
> **O número era meu e estava errado nos dois sentidos.** Você citou o meu *"nove"* de volta;
> são **dez**, porque a classe cresceu em 08/10 e eu não voltei para corrigir. E a primeira
> contagem de hoje deu **treze**, porque a régua chamou de órfãos o `LF-01`, o `LF-FINAL` e o
> `LF-FINAL-2` — prompts de verdade, de outra numeração (D230). **Você mandou lembrar desse
> precedente, por escrito, e eu repeti mesmo assim.**
>
> **1 · As dez, por data e classe** — `docs/relatorios/LAB-69.md` §2, e nenhuma precisava de
> relatório: quatro foram despertador sem item ou fila esgotada, três foram decisão registrada,
> uma foi fila recusada, uma foi recado recuperado, uma foi rodada fora de fila.
>
> **2 · A âncora, escolhida DEPOIS de medir as outras** (D229):
>
> | candidata | medida | veredicto |
> |---|---|---|
> | o **PR** | 42 mesclados, **4** citados em recado | reprovaria 38 legítimas |
> | o **commit** | rodada sem commit não tem nenhum | o mesmo buraco |
> | a **data** | 0 dias com commit e sem recado, mas **dois recados no mesmo dia são comuns** | não teria pego o PR #85 |
>
> A âncora é o **`<prompt>` do cabeçalho**, que sempre existe: ele é um prompt (`LAB-07`,
> `LF-FINAL`, `T-35` — a **forma**, não a sigla) **ou uma das seis classes de rodada**, de
> vocabulário fechado. `—` não ancorava nada: servia igualmente para *"não era prompt"* e para
> *"esqueci de dizer"*.
>
> **Sem reescrever o `RECADOS.md`:** as dez são classificadas pelo que o **título delas já diz**,
> texto que eu escrevi no dia. A régua **lê** o registro; não o corrige. E **não é lista de
> exceção** — não há nome de recado nenhum na régua, só classes.
>
> **3 · Os dois lados** (`external-engines/esteira/tests/classes-de-rodada.test.ts`, 9 travas):
> nenhum dos **73** recados do histórico fica órfão (`:48`), e um órfão plantado **no arquivo de
> verdade** é pego pela mesma trava (`:82`). Classe inventada fora do vocabulário também (`:91`).
>
> **4 · O precedente, honrado desta vez:** `:104` e `:108` cobram o cabeçalho composto
> `LAB-13 e LAB-14` **e** as outras numerações.
>
> **A §6 sai de "disciplina" para trava:** `CLAUDE.md` §1 agora declara as seis classes, e a frase
> *"o que resta é disciplina"* saiu.
>
> **Arquivo e linha:** `external-engines/esteira/src/classes-de-rodada.ts` ·
> `tests/classes-de-rodada.test.ts` · `CLAUDE.md:68-74` · decisões **D229** e **D230**.

# 002 — as 9 rodadas sem âncora: a trava do recado tem um buraco que você mesmo declarou

**Vem de:** o seu recado do LAB-66, achado (a). Você declarou o buraco em vez de
esconder, e isso é o motivo deste item existir.

## A afirmação a conferir

"Rodada sem relatório não tem âncora para a trava morder, e são 9 recados assim no
acumulado; para essas o que resta é disciplina."

**Disciplina não é guarda.** Regra sem guarda é a primeira das cinco espécies de
dívida própria. Enquanto essas 9 existirem sem âncora, a trava nova está medindo
o que é fácil de medir, não o que importa.

## O que fazer

1. **Liste as 9**, por data e prompt, com o motivo de cada uma não ter relatório.
   Pode ser que algumas simplesmente não precisassem — então diga isso, por nome.
2. **Decida a âncora e escreva por quê.** Candidatas: o commit da entrega, o número
   do PR, a data no `RECADOS.md`. Uma régua que depende de arquivo que pode não
   existir vai ter esse buraco de novo.
3. **Trava nova, conferida dos dois lados:** aprova as 9 legítimas e reprova um
   recado órfão plantado de propósito. As duas demonstrações no relatório.
4. **Lembre do precedente:** a trava anterior acusou LAB-13 e LAB-14 de não terem
   recado, e eles têm — um recado para os dois. Régua que casa por nome exato mede
   ortografia, não conteúdo (D137). A sua não pode repetir isso.

## O que não serve

- Reescrever o `RECADOS.md` para caber na régua nova. Registro não se maquia —
  você já disse isso e está certo.
- Marcar as 9 como exceção numa lista fixa. Lista de exceção cresce e ninguém a lê;
  se a âncora certa resolve, ela resolve sem lista.

## Como sei que deu certo

A trava roda sem acusar nenhum dos recados legítimos do histórico, e reprova o
órfão plantado. E a §6 do `CLAUDE.md` sai de "disciplina" para "trava", com o
número de ocorrências atualizado.
