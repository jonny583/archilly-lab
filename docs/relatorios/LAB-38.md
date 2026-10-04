# LAB-38 · O CI do comando único — e o que ele diz que NÃO pode rodar

**04/10/2026 · `.github/workflows/verde.yml` · provas em
[`../provas/LAB-38/ci.json`](../provas/LAB-38/ci.json) · três disparos reais**

O chat mandou: *"CI para o comando único — não há workflow neste repositório, então nada
roda o verde sozinho; crie e prove quebrando um teste de propósito. É o mesmo buraco do
Orçamento e do Generate, e foi ele que deixou uma suíte vermelha duas semanas sem ninguém
ver."*

---

## 1 · O levantamento mudou o formato da resposta

O verde completo (`./external-engines/conferir.sh`) lê **dois clones vizinhos** por
caminho — a exceção medida do **D16**, que existe justamente para não haver segunda cópia
envelhecendo em silêncio:

| repositório | papel | visibilidade |
|---|---|---|
| `jonny583/archilly-lab` | este | **público** |
| `jonny583/motor-testfit` | o motor do Laboratório de Parcelamento | **privado** |
| `jonny583/urban-create-hub-41d93a4d` | o Generate, de onde vêm o Validator e o Judge | **privado** |

**O `GITHUB_TOKEN` que o Actions entrega a um workflow só alcança o próprio
repositório.** Então **o verde completo não roda sem um segredo que só o Jonny pode
criar** — e isso não é detalhe de configuração: é o fato que decide o desenho.

**As duas saídas erradas:**

| saída | por que não |
|---|---|
| um CI que roda *parte* da suíte e fica **verde** | **falso verde**, e é literalmente o defeito do D110 |
| vendorizar as fontes dos vizinhos | **segunda cópia envelhecendo**, que o D16 proíbe |

---

## 2 · O desenho: dois trabalhos, e os nomes não enganam (D141)

### `guardas que não precisam dos clones vizinhos (NÃO é o verde)`

Roda **hoje, sem segredo**. **64 travas em 5 arquivos** que não importam nada dos
vizinhos — medido, não suposto:

| arquivo | o que protege |
|---|---|
| `pagina.test.ts` | a página do Jonny estar atualizada com a medição |
| `recado.test.ts` | o formato do RECADO, e o teto de 12 linhas |
| `verde.test.ts` | a cobertura do próprio `conferir.sh` |
| `regras.test.ts` | as regras do `CLAUDE.md` que viraram guarda no LAB-36 |
| `esqueleto.test.ts` | a geometria pura do esqueleto reto |

**É pouco em número de testes e muito em tipo de apodrecimento:** é exatamente o que
ninguém nota à mão. E o nome diz **"NÃO é o verde"**, porque nome que engana é pior que
CI nenhum — alguém leria o check verde como *"o repositório está verde"*.

### `o verde completo (precisa do segredo VIZINHOS_TOKEN)`

Sem o segredo, **falha com a receita** (D124) — nunca "pula":

1. criar um token *fine-grained*;
2. dar-lhe acesso **apenas** aos dois repositórios, **apenas** `Contents: Read-only`;
3. colá-lo como `VIZINHOS_TOKEN` nos segredos do Actions.

Com a ressalva dita no próprio log: **segredo em repositório público é decisão de quem
configura** (o Actions não o entrega a *pull request* de fork, mas ele existe nas
configurações). A alternativa é tornar os dois vizinhos públicos, **e essa é do Jonny**.

> **Um CI vermelho por falta de configuração é honesto; um CI verde que não roda o verde
> é a mentira que o D110 custou duas semanas.**

### E a lista do trabalho 1 tem guarda

Lista é o que envelhece. `regras.test.ts` lê o YAML, extrai os arquivos de teste citados
e **reprova se algum deles importar** dos vizinhos — caso em que o trabalho passaria a
falhar por falta de clone, e alguém "consertaria" afrouxando. Mais as travas de que o
YAML roda o comando único, de que a precondição **sai com erro e traz a receita**, de que
não há `continue-on-error` nem `|| true`, e de que o nome diz *"NÃO é o verde"*.

---

## 3 · A prova: três disparos reais

| # | disparo | `guardas-sem-clones` | `verde-completo` |
|---|---|---|---|
| 1 | [37209442979](https://github.com/jonny583/archilly-lab/actions/runs/37209442979) | ❌ **failure** — e não devia (§4) | ❌ failure, na precondição, com a receita |
| 2 | [37209625506](https://github.com/jonny583/archilly-lab/actions/runs/37209625506) | ✅ **success** — 64 travas protegidas | ❌ failure, na precondição |
| 3 | [37209732926](https://github.com/jonny583/archilly-lab/actions/runs/37209732926) | ❌ **failure** — **sabotagem de propósito** | ❌ failure, na precondição |

**A sabotagem do disparo 3**, que é a metade que o chat pediu:
`expect(script()).toContain("prova-automatica.ts")` virou `toContain("SABOTAGEM-LAB-38")`
em `tests/verde.test.ts`. O CI pintou **vermelho**. **Revertida e conferida**
(`grep -c SABOTAGEM` = 0, e a suíte volta a 6 pass / 0 fail).

**O que os três disparos provam:** o workflow **existe e roda**; **passa** quando a suíte
passa; **reprova** quando um teste é quebrado de propósito; e **não finge** sobre o que
não pode rodar.

---

## 4 · O CI achou um defeito MEU no primeiro disparo (D143)

O disparo 1 deu os **dois** trabalhos vermelhos. Um era o esperado. **O outro não:** o
trabalho sem clones rodou 68 travas, 67 passaram, e **1 falhou** —

> `§4 · não escreve em repositório vizinho > os clones somente-leitura estão limpos — e
> quantos foram conferidos sai dito`

**Era a minha guarda do D136, e o defeito era dela.** Ela exigia *"pelo menos um clone
conferido"*, com o comentário *"zero clones conferidos significaria que algo mudou de
lugar"*. **No runner não há clone nenhum** — e não há por um motivo legítimo: aquele
trabalho roda exatamente as travas que não dependem dos vizinhos.

**E a proteção que eu queria ali já existia, estrutural:** o verde completo **não passa**
sem os clones — o `typecheck` e mais de 300 travas quebram na hora.

**Consertado sem afrouxar:** a trava exige, **sempre**, que clone que existe esteja
limpo; e que o ambiente seja **um dos dois declarados** — *completo* (tem o clone do
motor) ou *só-guardas* (não tem nenhum). **Meio estado reprova**, porque aí o verde
falharia por motivo obscuro (D124).

**Por que isso vale mais que o conserto:** é o argumento de que o CI serve, dado pelo
próprio CI, no primeiro disparo. **Eu rodei aquela trava dezenas de vezes nesta máquina e
ela sempre passou — porque esta máquina tem os clones.** Era verdadeira sobre um ambiente
e falsa sobre outro, e **só um segundo ambiente podia mostrar**. É, em miniatura, a tese
do prompt: *o que ninguém executa num lugar diferente não está testado, está confirmado.*

---

## 5 · A décima vez do ponto cego (D142)

A primeira versão da guarda da lista do CI usava `fonte.includes("@generate/")` — e
reprovou **o próprio `regras.test.ts`**, que cita `@generate/` como **texto**, na trava
que confere que o `comum.ts` importa o Validator de lá.

**Mesma forma do D137, duas vezes no mesmo dia:** régua que casa por aparição da palavra
mede **menção**, não **conteúdo**. A régua passou a extrair o especificador do
`import ... from "…"`.

A lição entrou no `CLAUDE.md` §6: **quando a régua procura um nome em código, procure-o
no lugar da gramática onde ele significa aquilo** — num `import`, não no arquivo inteiro.

---

## 6 · O que mudou

| onde | o quê |
|---|---|
| `.github/workflows/verde.yml` | **novo** — os dois trabalhos, com o porquê escrito no alto |
| `esteira/tests/regras.test.ts` | 4 travas do CI, e a guarda dos clones consertada (D143) |
| `CLAUDE.md` §7 | *"não há CI"* virou a descrição do que há, e do que falta para o verde completo rodar |
| `CLAUDE.md` §6 | a décima linha da tabela do ponto cego |
| `docs/PENDENCIAS_JONNY.md` | **item 7**, a decisão do chat sobre os 33 lotes |

---

## 7 · O que fica proposto — e é uma coisa só, do Jonny

**Criar o segredo `VIZINHOS_TOKEN`, ou tornar os dois vizinhos públicos.** Enquanto não
houver um dos dois, o verde completo **não roda no CI** e continua sendo rodado à mão
antes de cada commit, como o `CLAUDE.md` §7 diz. A receita está no log do próprio
workflow, em português, toda vez que ele falha.

## 8 · O estado verde, e os vizinhos

```
./external-engines/conferir.sh
VERDE — 7 passos, e a cobertura conferida.   exit 0
```

`git status` nos três clones somente-leitura: **limpos** — e isso é teste desde o D136,
agora com a correção do D143.

## 9 · Decisões

| | |
|---|---|
| **D141** | O CI existe, e ele **diz a verdade** sobre o que não pode rodar |
| **D142** | A **décima** vez do ponto cego: a régua leu **menção**, não importação |
| **D143** | O CI achou um defeito na minha guarda **no primeiro disparo** |
