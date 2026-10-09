# LAB-67 · O orçamento de Actions, e o custo que não vaza

**08/10/2026** · pedido da família, fora de fila · `claude/stoic-ritchie-ijzqy3`
**Conferido AQUI, não no GitHub.**

---

## 1 · O que foi desligado, arquivo por arquivo

| | |
|---|---|
| workflows no repositório | **um**: `.github/workflows/verde.yml` (id **374646435**) |
| gatilho antes | `on: push (branches: ["**"])` + `pull_request` + `workflow_dispatch`, linhas 38-42 |
| gatilho agora | **`push` e `pull_request` comentados**, linhas 55-57; `workflow_dispatch` ativo, linha 58 |
| no GitHub | `state: disabled_manually` — desabilitado via `gh api -X PUT …/disable` |
| ramos com o gatilho antigo | **dois**, e só dois: `main` e `claude/stoic-ritchie-ijzqy3`. O problema dos 28 ramos do Render **não existe aqui** |
| receita de religar | **um lugar só**: [`../COMO_RELIGAR_O_CI.md`](../COMO_RELIGAR_O_CI.md) |

**A desabilitação foi feita ANTES da edição**, de propósito: editar e enviar primeiro gastaria
mais uma rodada paga com o próprio conserto.

### Antes de desligar, medi o que mais passa pela máquina paga — e é NADA

Varridos os dois trabalhos por padrão: `deploy|publish|vercel|netlify|render|fly.io|heroku|
migrat|prisma|drizzle|supabase|cron|schedule|backup|cobran`. **Zero linhas.**

- **sobe aplicativo para provedor de hospedagem?** NÃO. Não há passo de publicação;
- **aplica migração em banco de verdade?** NÃO. Este repositório não tem banco;
- **faz coisa com prazo (cobrança, aviso, backup)?** NÃO. Não há `schedule`.

Os dois trabalhos são **conferência**: `guardas-sem-clones` e `verde-completo`. Desligar aqui é
seguro, e isso foi **medido antes**, não suposto.

---

## 2 · A medição de outubro — (a) a (g), com origem

Medição **minha**, não a fatura: por trabalho, `started_at` a `completed_at`, **arredondado para
cima ao minuto por trabalho**. O endpoint oficial `/timing` devolveu zero no Render e eu não o
usei. Fonte: `gh api /repos/jonny583/archilly-lab/actions/runs` + `/jobs`, 136 execuções baixadas.

**(a)** **136 execuções** em outubro (04 a 08/10) · **272 trabalhos** · **272 minutos**
**(b)** **2,00 min** por execução. Por trabalho:

| trabalho | min | trabalhos | média | conclusões |
|---|---|---|---|---|
| `guardas que não precisam dos clones vizinhos` | 136 | 136 | 1,00 | 134 sucesso, 2 falha |
| **`o verde completo (precisa do segredo VIZINHOS_TOKEN)`** | **136** | 136 | 1,00 | **136 FALHA, 136 de 136** |

**(c)** **43 de 136 (32 %)** vieram de envio que tocou só `docs/` ou `.md` — **86 min**. *Isto
NÃO é desperdício puro aqui*: as minhas travas **conferem documento** — a página do Jonny, o
formato do recado, a aritmética da §6, a lista de propostas. Num envio de prosa elas têm o que
fazer. O que não tem o que fazer num envio de prosa é o trabalho 2.
**(d)** **92 SHAs distintos para 136 execuções** — **44 commits rodaram duas vezes**, porque
`push` **e** `pull_request` disparam no mesmo SHA. **Zero** re-execuções do mesmo evento.
Comparado por **árvore git**, não por mensagem de commit.
**(e)** **sem matriz, sem Windows, sem macOS**: **272 de 272 em `ubuntu-latest`**.
**(f)** sim: `actions/checkout@v4`, `oven-sh/setup-bun@v2`, `bun install --frozen-lockfile` nos
dois trabalhos, e `bunx playwright install --with-deps chromium` no trabalho 2 — **sem cache**.
Como o trabalho 2 morre em ~1 min, ele nem chega a baixar o Chromium: o desperdício aqui é o
trabalho inteiro, não o passo.
**(g)** processa imagem/vídeo? **Só o Chromium da prova no navegador**, e **só no trabalho 2**,
que nunca executou.

### HOUVE RODADA QUE NÃO PRECISAVA TER ACONTECIDO? 180 dos 272 minutos — 66 %

| o quê | min | por quê |
|---|---|---|
| `o verde completo`, 136 de 136 | **136** | **não podia passar**: depende do segredo `VIZINHOS_TOKEN`, que nunca existiu, e falha com a receita **por desenho** (D124) |
| duplicação de gatilho no trabalho 1 | **44** | 44 commits com `push` **e** `pull_request` |

> **Falhar com a receita é honesto na mão; agendado, é pagar para repetir um recado.**

### E A CONTA DESTE REPOSITÓRIO É ZERO

`archilly-lab` é **público** (`"visibility": "public"` pela API), e Actions em runner padrão é
**gratuito e não medido** em repositório público. **US$ 0,00.** Se fosse privado: 272 min ×
US$ 0,008 = **US$ 2,18**, dos quais **US$ 1,44 seriam desperdício**.

> **A família assumiu que todo aplicativo paga. Este não paga.** Vale conferir a visibilidade dos
> outros oito antes de redesenhar rotina — o estouro pode ter menos culpados do que parece.

---

## 3 · A minha régua de desligadores ficaria VERDE com o CI parado (D222)

**NÃO reprovava** — nem gatilho comentado, nem rotina desabilitada no painel, nem arquivo
renomeado. A `varredura-de-configuracao.ts` procura regra em `"off"`, passo que ignora erro, lint
sem `--max-warnings 0` e chave de `tsconfig` que afrouxa. **O desligamento mais completo que
existe é justamente o que ela não vê.**

Consertado com trava própria (`tests/gatilho-do-verde.test.ts`, 7), que cobra os **dois** lados —
desligado exige a receita e o aviso; ligado exige que os dois **saiam** — e **REPROVA a partir de
1º/11/2026**. *Desligamento sem prazo vira desligamento permanente.*

---

## 4 · O desenho barato — PROPOSTO, não feito

A escolha do que volta em 1º/11 é do Jonny, comparando os nove. Daqui, em ordem de economia:

1. **tirar `o verde completo` do gatilho automático enquanto o segredo não existir** — 50 % dos
   minutos, e ele **não pode** passar. Continua à mão, pelo `workflow_dispatch`;
2. **um gatilho só, não dois** — `pull_request` basta, ou `push` basta; os dois no mesmo SHA
   custam 44 execuções a mais em 136;
3. **cache do `bun install` e do Chromium**, que hoje baixam a cada rodada;
4. **um envio por entrega**, e esta é a maior de todas — já está na `CLAUDE.md` §7.

Com (1) e (2), as mesmas 92 entregas custariam **92 minutos** em vez de 272: **−66 %**.

---

## 5 · O vazamento (2.1) — varrido, ZERO

Varrido **tudo que o git carrega** (o escopo certo: o que o git carrega é o que sai daqui).

| procurado | achado |
|---|---|
| `custoMedido`, `custo_medido` | **0** |
| `multiplicador` | **0** |
| `custo × N`, `custo x N` | **0** |
| `markup`, `precoCusto` | **0** |
| `margem` **junto de dinheiro** | **0** |

**`margem` aparece 9 vezes e é GEOMÉTRICA nas nove** — folga da caixa envolvente, em metros
(`alturas.ts`, `terrenos.ts`, `lab41.ts`) e *"sem margem para dúvida"* em prosa. Acusá-las seria
medir **ortografia**, que é o D137: a régua só conta `margem` quando a mesma linha traz lucro,
preço, custo, `R$` ou `US$`, e os dois lados estão na trava.

**Este repositório não tem tela de produto** (§4: o único HTML é a bancada da prova no navegador,
que imprime motor, nós, arestas, quadras, bytes e ms) e **não faz chamada paga de IA**: as únicas
menções a `anthropic`/`openai` são **nomes de regra da minha varredura de segredos**, que procura
chaves — não as usa. Sem `PedidoIA`, sem gateway, sem `new OpenAI`.

**A trava** (`tests/vazamento-de-custo.test.ts`, 6) reprova se qualquer um deles voltar, e reprova
o vazamento plantado.

---

## 6 · O esforço produzido (2.2)

**Este aplicativo não declara operação de IA** — nenhuma chamada paga, hoje nem antes. Então:

- **`relatorio.completo` (25 créditos)**: não uso;
- **`kit.lancamento` (50 créditos)**: não uso;
- **os três campos novos do `PedidoIA`**: nada a mandar daqui.

**Uma correção de unidade, do meu domínio, e é medida:** `ia.layout — ambientes ou zonas do
programa devolvido` não serve para loteamento. O que o usuário recebe de um estudo de
parcelamento são **lotes**, e o LAB-13 mediu exatamente isso por gleba e por motor: de **66 a
1 803 lotes**, e **2,35 ha a 69,91 ha** de área vendável. Se um dia nascer `ia.loteamento`, a
unidade é **lotes devolvidos**, com **área vendável em m²** como segunda — e nunca "zonas".

---

## 7 · O verde: CONFERIDO AQUI, NÃO NO GITHUB — e está VERMELHO, por motivo que não é meu

```
260 travas que não dependem de clone vizinho .... VERDES, 0 falhas
verde completo ................................. 10 falhas em 552
```

**Os três clones vizinhos sumiram** no reinício do contêiner; o comando único **falhou com a
receita**, 7 de 7 passos, sem pular nenhum — o D124 funcionou. Reclonados `--depth 1`, voltaram
em commits **mais novos** (`motor-testfit 6cf6396`, hub `72cfab0`) e o verde ficou vermelho.

**Medido antes de atribuir (§6):** com as minhas mudanças guardadas (`git stash`), três dos
arquivos que falham **falham igual na `main` limpa** — 3 de 17. **As falhas não são desta
entrega** (D223), e a proposta de gravar o commit do vizinho em toda prova entrou na fila.

**`git status` dos três vizinhos: 0 alterações.** O `bun.lock` do hub mudou ao instalar
dependência e foi **revertido** — nada escrito no vizinho (§4).
