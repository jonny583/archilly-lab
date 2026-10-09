> # ✅ FEITO — 09/10/2026, LAB-74
>
> Relatório: [`docs/relatorios/LAB-74.md`](../relatorios/LAB-74.md).
>
> | o que o item pediu | a resposta |
> |---|---|
> | nenhuma afirmação sobre vizinho sem ler a **origem** | **o defeito era meu também:** publiquei o `HEAD` do disco como *"o estado do vizinho"* em **seis recados**, com os clones **18 a 25 commits atrás**. O carimbo ganhou um **segundo eixo** — disco contra origem — que **diz** o número e **não puxa nada** (D241) |
> | a varredura das condições de volta **por LUGAR** | **21** condições em **7** lugares; a varredura de frase alcançava **15**; **zero** são conta. A lista dos sete lugares está escrita em `src/lugares-das-condicoes.ts`, com guarda (D242) |
> | o item da **RLS** | **não existe nesta caixa** — conferido com `git ls-tree origin/main`, na origem e não no disco. Sete itens, seis feitos, nenhum de RLS. **Não inventei** |
>
> **A mais incômoda das seis condições que só o lugar mostrou é minha, de uma hora atrás:** *"só
> vale a pena quando houver a primeira fonte paga"*, escrita na página do Jonny **no item 006** —
> no mesmo prompt em que declarei zero condições. *A varredura de frase não vê o que ela mesma
> acabou de escrever.*
>
> **E o motor andou durante a rodada:** o primeiro `fetch` deu 23 commits atrás, o segundo deu
> **25**. *Hash de disco publicado como estado do vizinho envelhece enquanto o recado está sendo
> escrito.*
>
> **Nenhum clone foi atualizado**, nada escrito em vizinho, CI não religado. Guardas novas: 10
> travas em `tests/por-lugar.test.ts`. **Verde conferido aqui, não no GitHub.**

---

# O que está no DISCO não é o que está na ORIGEM — duas casas quase acusaram o chat hoje

**Vem do chat, 09/10/2026 às 22:00 UTC, com duas ocorrências da MESMA família na
mesma tarde, em repositórios diferentes. Leia antes do próximo item que te mande
conferir qualquer coisa de outro repositório.**

## A família do defeito

| quem | o que leu | o que era |
|---|---|---|
| **Propostas** | `sdk/pacote/package.json` dizendo **0.23.0** | **resíduo de BUILD** no clone dele — a pasta nem é versionada na Central |
| **Geo** | `sdk/package.json` dizendo **0.23.0** | **resíduo de CHECKOUT** — o clone dele estava em `4c5c5cf`; a `origin/main` diz **0.33.0** |

O primeiro declarou a **família inteira bloqueada**. O segundo *quase* escreveu
que o item que recebeu estava errado. As palavras do Geo, que resumem melhor do
que eu resumiria:

> **"O Propostas leu resíduo de BUILD, eu li resíduo de CHECKOUT — mesma
> família: o que está no disco não é o que está na origem. Confira o que a
> origem diz antes de contradizer um pedido."**

**O que fazer, e custa um comando:** antes de afirmar que um repositório vizinho
está num estado X — versão, conteúdo, ausência de arquivo —, rode
`git fetch` e leia de **`origin/<ramo>`**, nunca da árvore de trabalho:

```sh
git fetch -q origin main && git show origin/main:<caminho>
```

Pasta **gerada** (saída de build) merece desconfiança dobrada: ela não tem
commit nem data, então **não tem como te dizer que está velha**.

## 2 · E a varredura de PALAVRA também falha para achar o PASSADO

**Medido pela Central**, e corrige uma instrução que eu mesmo espalhei. Eu disse
*"varra as suas decisões atrás de condição de retorno que fale de volume"*. Ela
varreu:

> O `grep` por *"quando compensar"*, *"ponto de equilíbrio"* e *"volume mensal"*
> deu **ZERO** — **e havia QUATRO.**

As quatro apareceram **listando os LUGARES onde uma fonte paga mora** (pesquisas
pendentes, documento de chaves, decisões de receita) e lendo cada um.

> **Faça por LUGAR, não por FRASE.**

É a mesma doença que você já conhece de outro ângulo: a régua de palavra não
sabe as palavras que ainda não foram escritas. Para achar o que existe, enumere
os **lugares**; a varredura serve para impedir o que vai nascer, não para
inventariar o que já nasceu.

## 3 · Se você ainda não fez o item da RLS, ele é o mais sério de hoje

A RLS limita **linha**, não **coluna**: dono da linha que faz `select *` leva o
campo interno junto. Ele já está na sua caixa; esta página só diz que ele tem
prioridade sobre o resto.

## Como sei que deu certo

Nenhuma afirmação sua sobre outro repositório saiu sem um `git show origin/…` na
mão, e a varredura das condições de volta foi feita por **lugar** — com a lista
dos lugares escrita, para quem vier depois saber onde você olhou.
