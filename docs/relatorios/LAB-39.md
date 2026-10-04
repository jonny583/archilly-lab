# LAB-39 · A trava que comparava duas provas — consertada para MEDIR

**04/10/2026 · `external-engines/esteira/tests/acesso.test.ts` ·
`external-engines/esteira/src/acesso.ts` · provas em
[`../provas/LAB-39/confronto-refeito.json`](../provas/LAB-39/confronto-refeito.json)**

O chat mandou: *"a última trava que se repete, o teste do D116 que compara duas provas
entre si — conserte para medir, não para comparar prova com prova."*

---

## 1 · O que estava errado, nas duas direções

A trava dizia *"a tabela do LAB-19 e a prova do LAB-28 trazem os MESMOS números"*, e
comparava `confrontoDoAcesso` de um arquivo com `confronto` do outro. Ela falha nos dois
sentidos possíveis:

| direção | o que acontece |
|---|---|
| **falso verde** | as duas provas saem da **mesma** fórmula. Erradas do mesmo jeito, erram **juntas** — e a comparação passa |
| **falso vermelho** | regerada **uma** e não a outra, ela fica vermelha **sem nada estar errado** |

O segundo é o que o chat chamou de *"trava que se repete"*: ela já tinha ficado vermelha
assim depois da mudança da ponte, e o conserto de cada vez era **regerar a outra prova**
— trabalho que não responde a pergunta nenhuma. É a forma do §6 pela avessa: a régua
acusando o medido.

**O D131 já havia dado o veredito**, na varredura das sete travas que leem
`docs/provas/`: esta era **a única reprovada**, e eu deliberadamente não a consertei lá
(§1-A, um prompt por despertador). O conserto estava proposto ao chat com o desenho que
veio executado aqui.

---

## 2 · O conserto: cada arquivo contra os crus DELE

Toda prova do acesso carrega as posições cruas — `porPosicao`, com o rendimento do motor
em cada um dos seis pontos. **O agregado publicado tem de SEGUIR desses números**, pela
fórmula que mora na régua. Isso é mensurável sem rodar motor nenhum: os números já estão
em disco.

**Quatro travas onde havia uma:**

| trava | o que ela falsifica |
|---|---|
| o **agregado** de cada motor segue das posições cruas | **40** agregados (2 arquivos × 5 glebas × 4 motores) |
| o **confronto** publicado segue dos crus | **10** confrontos |
| a régua **reprova** agregado que não segue | sabotagem **em memória**, sem tocar arquivo |
| a montagem é falsificável num **caso de cabeça** | dois motores inventados, números conferidos a mão |

Mais uma trava de arranque — *"as duas provas trazem as cinco glebas e os quatro
motores"* —, porque laço vazio passa verde dizendo que conferiu tudo.

**Custo:** 240 posições cruas conferidas em **menos de 10 ms**. Medir o confronto ao vivo
seriam **240 rodadas completas** do motor com o Validator e o Judge do Generate — a
conferência custaria mais que a medição original, e ninguém a rodaria (D123).

---

## 3 · Provado por sabotagem, não por confiança

Trocado, na prova do LAB-19, o `entreOsMotoresDeLote_pct` da gleba `completo` de
**29,12** para **70** — que é **exatamente o número errado que o D116 publicou**:

| | testes | falhas |
|---|---|---|
| antes | 30 | 0 |
| com a sabotagem | 30 | **3** |

A mensagem de falha sai com o que o leitor precisa:

```
LAB-19/tabela.json · completo: publicado {...,"entreOsMotoresDeLote_pct":70}
vs refeito dos crus {...,"entreOsMotoresDeLote_pct":29.12} (regere com `bun run lab19`)
```

Arquivo restaurado e conferido (`git diff` vazio). O registro está no campo `sabotagem`
da prova.

**O ponto que importa:** a trava antiga **não pegaria** essa sabotagem se as duas provas
a tivessem junto. Esta pega em qualquer uma das duas, **sozinha**.

---

## 4 · O que sobrou da trava antiga — e declarado pelo que é

Os dois arquivos continuam tendo de carregar os **mesmos números crus**: mesma semente,
mesmas glebas, mesmas posições. Isso é **detector de prova velha** (D131), não medição, e
está escrito assim no teste, com a mensagem *"regere com `bun run lab19 && bun run
lab28`"*. A diferença com a trava antiga é qual metade responde à pergunta: antes, a
comparação **era** a resposta; agora ela é só o aviso.

---

## 5 · O achado que o conserto trouxe: a montagem também morava em dois lugares (D145)

Para refazer o agregado eu precisava de **uma** conta. Não havia: o D116 trouxe as
**fórmulas** para a régua e eu declarei o caso encerrado, mas a **montagem** das três
contas continuou em dois arquivos — e com ela a lista dos motores que entregam lote,
**em duas grafias**:

| onde | como estava escrita |
|---|---|
| `lab28.ts` | os três nomes, declarados |
| `lab19.ts` | `MOTORES.filter((m) => m.id !== "symbios")` |

Hoje as duas dão o mesmo conjunto — **conferido: a montagem única reproduz os 10
confrontos publicados, número por número, sem regerar nada**. No dia em que entrar um
quinto motor que entregue quadra, uma inclui e a outra não.

**`MOTORES_DE_LOTE` e `confrontoDoAcesso()` passaram para `src/acesso.ts`.** A lição do
D116 ganha a metade que faltava: trazer a fórmula para um lugar só não basta — **a
montagem também é a conta**.

Fica dito, e não consertado: as chaves publicadas têm **nomes diferentes** nos dois
arquivos (`amplitudeDoAcesso_pct` × `maiorAmplitude_pct`). Unificá-las mexe na forma de
duas provas e da página do Jonny. **Dois nomes para um número é meio caminho para dois
números.**

---

## 6 · O achado que vai para a fila: quatro provas declaram contrato "2" (D146)

A precondição do detector era *"mesma semente e mesmo contrato"* — e as etiquetas não
batem, enquanto os números crus são **idênticos**:

| arquivo | `contrato` declarado |
|---|---|
| `LAB-19/tabela.json` | `"1"` |
| `LAB-28/acesso.json` | `"2"` |

**Medido antes de atribuir (§6):** as cinco glebas são as mesmas nas duas ferramentas, e
**todas as cinco declaram `archilly.versao: "1"`**. Varrido o repositório: **nenhuma
entrada declara `"2"`**, nem as de via desenhada. A esteira *lê* `"2"` e `"1"`, mas nada
que ela mede **é** `"2"`.

Quem erra é a etiqueta: `lab25.ts`, `lab26.ts`, `lab28.ts` e `lab30.ts` têm
`const CONTRATO = "2"` à mão. `lab19.ts` escreve `"1"` à mão e acerta por sorte;
**`lab23.ts` é a única honesta** — publica `entrada.archilly.versao`.

É a forma do **D137** um degrau acima: a guarda do §7 confere que a chave `contrato`
**existe**, nunca que ela **corresponde ao medido**. E a forma do **D104**: valor à mão
que ninguém revalida envelhece em silêncio — este envelheceu em quatro arquivos.

**Não consertado aqui** (§1-A): o código é uma linha por ferramenta, mas a etiqueta só
muda no arquivo quando a prova é **regerada**, e prova não se regera para consertar
etiqueta (D118). Está proposto ao chat como **LAB-43**, e o valor certo está nomeado no
D146 para não se perder.

---

## 7 · Entrega

| o quê | onde |
|---|---|
| a régua: `agregadosDasPosicoes`, `confrontoDoAcesso`, `MOTORES_DE_LOTE` | `external-engines/esteira/src/acesso.ts` |
| as cinco travas novas, a antiga demovida a detector | `external-engines/esteira/tests/acesso.test.ts` |
| a ferramenta da conferência (`bun run lab39`) | `external-engines/esteira/ferramentas/lab39.ts` |
| a prova: 40 agregados, 10 confrontos, 240 posições, **0 divergências** | [`../provas/LAB-39/confronto-refeito.json`](../provas/LAB-39/confronto-refeito.json) |
| as duas ferramentas chamando a montagem única | `ferramentas/lab19.ts`, `ferramentas/lab28.ts` |
| decisões | **D144**, **D145**, **D146** |

**Verde:** `./external-engines/conferir.sh` — 7 passos, **377 testes** (eram 372), exit 0.

**Os clones vizinhos ficaram limpos** — `git status --porcelain` vazio nos três
(`motor-testfit`, `urban-create-hub-41d93a4d`, `urban-scout-tool`), conferido ao fim da
rodada como manda o §4.

**Nenhum motor rodou neste prompt.** A equivalência da montagem única com o que estava
publicado foi provada **pelos próprios arquivos**: a conta nova, aplicada aos crus deles,
devolve os 10 confrontos e os 40 agregados idênticos. Prova mais forte que regerar — e
sem as horas de rodada.
