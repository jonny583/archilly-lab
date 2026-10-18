# SEGURANÇA — Archilly Lab

A lista do Padrão de Segurança da família, preenchida item a item. Conferida no
**LF-FINAL, 14/09/2026**, com o comando ao lado de cada linha, para que a
conferência possa ser refeita por quem quiser.

> **Leia primeiro o que este repositório é.** O Lab **não tem tela, não tem
> banco, não tem conta de usuário e não faz chamada de rede em execução.** A
> maior parte da lista do Padrão trata de app com interface e Supabase; aqui ela
> se aplica por ausência, e isso está dito linha a linha em vez de marcado como
> "N/A" sem explicação.

---

## Chaves e segredos

| item | estado | como foi conferido |
|---|---|---|
| Nenhuma chave sensível no repositório | ✅ **limpo** | `grep -rE "\b(apiKey\|api_key\|API_KEY\|SECRET\|Bearer \|Authorization\|sk-[A-Za-z0-9]{20}\|VITE_[A-Z_]+)\b"` sobre todo `.ts`, `.js`, `.json` e `.rs` fora de `node_modules` e de `upstream/` — em 14/09, **zero ocorrências**; o "zero" ficou falso em 05/10 (LAB-47) e ninguém viu: **desde o LAB-166, a mesma busca é perguntada a cada verde** a tudo o que o `git` carrega — nas quatro extensões da página e em todo texto fora do `.md`, `upstream/` incluído —, e hoje dá **duas** ocorrências, nenhuma chave, as duas texto de teste de trava declarado um a um com o motivo (`external-engines/esteira/src/a-busca-das-chaves.ts`; ver *Reconferido no LAB-166*, abaixo) |
| Nenhuma chave em `VITE_` | ✅ **não se aplica, e está limpo** | não há build de navegador neste repositório; e a busca acima cobre `VITE_` |
| Nenhum `.env`, `.pem` ou arquivo de credencial | ✅ **limpo** | em 14/09, `find . -name ".env*" -o -name "*.pem" -o -name "*credential*"` — **nada**; **desde o LAB-160, perguntado a cada verde pelo NOME**, em dezessete formas, a tudo o que o `git` carrega e a todo nome que já entrou na história (`external-engines/esteira/src/arquivo-de-credencial.ts`; ver *Reconferido no LAB-160*, abaixo) |
| Chave de IA só no servidor da Central | ✅ **não se aplica** | o Lab não chama IA. Ver `ADOCAO_CENTRAL.md` |

## Banco e RLS

| item | estado | por quê |
|---|---|---|
| RLS em tudo, por conta | ✅ **não se aplica** | **não há banco.** Não existe `supabase/`, não existe migração, não existe tabela |
| Migrações versionadas | ✅ **não se aplica** | idem |
| Cuidado do `TRUNCATE` em tabela nova | ✅ **não se aplica** | idem |

**Se um dia houver banco aqui, esta seção deixa de ser "não se aplica" e o
`SEGURANCA.md` tem de ser refeito antes da primeira migração.**

## Execução

| item | estado | como foi conferido |
|---|---|---|
| Nada de rede em execução | ✅ | o adaptador do Symbios roda com **zero dependência npm**; os outros dois leem arquivo local e código dos clones irmãos. **No caminho do motor**, nenhum `fetch`, nenhum `http` — e, fora dele, sete redes declaradas uma a uma (ver *Reconferido no LAB-158*, abaixo) |
| O `.wasm` não pede nada do ambiente | ✅ | carregado com `WebAssembly.instantiate(bytes, {})` — **objeto de imports vazio**. Medido no LAB-01: 189 KB, zero imports |
| Nada de exportar motor ou código ao usuário | ✅ **não se aplica** | o Lab não tem usuário nem exportação. O que ele publica são relatórios e JSON de medição |
| Entrada validada antes de entrar no núcleo | ✅ | versão do contrato, unidade (metro) e anel com ao menos 3 pontos são recusados com mensagem legível — `ida.ts` e `gleba-v1.ts`, com teste; **e, desde o LAB-159, também na terceira porta, a do motor interno do Generate (`motores/generate.ts`), que não recusava nada** (ver *Reconferido no LAB-159*, abaixo) |

## Os repositórios vizinhos

| item | estado | como foi conferido |
|---|---|---|
| Geo, Generate e o motor de parcelamento são **só leitura** | ✅ | `git status` nos três ao fim de **toda** rodada, e o número sai no relatório. Em 14/09, ao fim do LAB-08: **0 alterações** em cada |
| Nenhum commit, nenhum push nos vizinhos | ✅ | o histórico deles não tem commit desta sessão. O único toque foi `git merge --ff-only origin/main` no clone local do motor, para medir o T02 (D40); **desde o LAB-162, perguntado a cada verde pela SESSÃO** — o autor é o mesmo em toda a família —: nenhuma sessão que trabalhou nesta casa no rodapé de um commit da origem dos três vizinhos, e nenhum assunto `LAB-<n>` lá (`external-engines/esteira/src/nenhum-commit-nos-vizinhos.ts`; ver *Reconferido no LAB-162*, abaixo) |
| O que precisa mudar neles vira **lista em relatório** | ✅ | LAB-07 §9 (8 correções), LAB-02 §5, LAB-03 e LAB-08 — todos com o número e sem commit lá |

## Integridade do que foi copiado

| item | estado | como foi conferido |
|---|---|---|
| `external-engines/symbios/upstream/` byte a byte igual ao commit declarado | ✅ | `cmp` arquivo a arquivo contra `c3f287556b98cc616d4263d163e6643ae32111ff`, no LAB-00; **desde o LAB-132, a árvore do `git` da pasta é perguntada a cada verde** contra a registrada (`external-engines/esteira/src/upstream-intocavel.ts`) |
| Licença do upstream preservada | ✅ | `upstream/LICENSE` (MIT, `Copyright (c) 2026 TheJanusStream`) intocado — e, desde o LAB-132, dentro da árvore perguntada na linha acima: um byte da licença mudado muda a árvore |
| Nenhum motor copiado para fora de `upstream/` | ✅ | em 14/09, `external-engines/testfit/` e `external-engines/esteira/` não contêm código de motor — só a ponte (D16); **desde o LAB-161, perguntado a cada verde** a todo arquivo de código que o `git` carrega fora de toda pasta `upstream/`, linha a linha contra o motor, e a todo `Cargo.toml` que depende dele — tem de apontar para o `upstream/` por `path` (`external-engines/esteira/src/o-upstream-nao-sai-do-upstream.ts`; ver *Reconferido no LAB-161*, abaixo) |

---

## O que **não** foi conferido, e por quê

- **Prova no navegador com console limpo.** O Lab não tem tela (é regra dele, em
  `CLAUDE.md` §4). A única prova de navegador que existe é a do LAB-01 — o
  `.wasm` carregando no Chromium —, e está em `outputs/lab01/navegador.png`.
- **Nada repintado fora do catálogo de design.** Não há design: não há tela.
- **Mobile sem rolagem lateral.** Idem.

---

## Reconferido no LF-FINAL-2 · 15/09/2026

Todas as linhas acima foram refeitas com os mesmos comandos, depois do LAB-04 e
do LAB-05. **Nada mudou de estado.** Dois números novos, conferidos pela primeira
vez nesta volta:

| item | estado | como foi conferido |
|---|---|---|
| Os commits dos clones vizinhos são **deles**, não meus | ✅ | `git -C <clone> log --since=2026-09-13 --format="%an"` — os 14 commits de `motor-testfit` são da sessão dele, no branch `claude/upbeat-fermi-t1rp11`, mesclados pelo Jonny. **Nenhum desta sessão** — e o autor deixou de responder isto: hoje é `Claude` em toda casa da família; a pergunta passou à sessão no LAB-162 |
| `external-engines/symbios/upstream/` nunca foi tocado depois de criado | ✅ | `git log --oneline -- external-engines/symbios/upstream/` — **um commit**, o do LAB-00 que o criou; **desde o LAB-163, perguntado a cada verde completo à história inteira**, commit a commit, pela ÁRVORE da pasta — o `git log` de hoje mostraria dois (o `f61be91` e a mescla `baa3e07`, que leva a mesma árvore), e a trava do LAB-132 só olha o `HEAD`, onde um patch desfeito some (`external-engines/esteira/src/a-historia-do-upstream.ts`; ver *Reconferido no LAB-163*, abaixo) |

---

## Reconferido no LAB-158 · 17/10/2026 — a rede, perguntada à árvore

A frase do topo — o Lab *"não faz chamada de rede em execução"* — e a linha *"Nada de rede em execução"* não tinham
trava: foram um `grep` feito uma vez, em 14/09. **Desde o LAB-158 elas são perguntadas a cada verde**, por
`external-engines/esteira/src/rede-em-execucao.ts` e `tests/rede-em-execucao.test.ts` (sem clones), que leem todo o
código que o `git` carrega — `upstream/` incluído — por quatro portas: chamada (`fetch(`, `Bun.serve`, `createServer`,
`WebSocket`…), módulo (`node:http`, `node:net`…; no Rust, `std::net`, `reqwest`…), processo filho (`git fetch`,
`ls-remote`, `pull`, `push`, `clone`, `curl`, `wget`) e linha de script.

**O que a medição de 17/10 respondeu:** 370 arquivos de código lidos, 52 no caminho do motor (os adaptadores, a porta,
os motores e o esqueleto da esteira, o Rust do Lab e o `upstream/` do Symbios) — **zero rede no motor**. A frase do topo
é verdadeira. A linha da tabela dizia *"Nenhum `fetch`, nenhum `http`"* sem dizer onde, e **fora do motor há sete**,
todas de ferramenta ou de teste, nenhuma que escreva em lugar nenhum. Uma delas, o `fetch` da bancada, já existia
quando a linha foi escrita (LAB-01, 10/09) — e a linha era a única da tabela *Execução* sem comando ao lado:

| onde | o que | classe |
|---|---|---|
| `symbios/adapter/ferramentas/navegador/prova-automatica.ts` | o `Bun.serve` em 127.0.0.1 que abre a bancada, e o `fetch(req)` dele (2) | servidor local |
| `symbios/adapter/ferramentas/navegador/prova.js` | a bancada lê o `.wasm` desse servidor local | servidor local |
| `esteira/src/commit-dos-vizinhos.ts` | o `git fetch` do carimbo dos vizinhos — só referências, nada puxado (LAB-68) | origem pública |
| `esteira/tests/ramos-abertos-na-origem.test.ts` | o `git ls-remote` dos ramos abertos (LAB-121) | origem pública |
| `esteira/tests/a-rotina-no-github-na-origem.test.ts` | o `curl` à API pública do GitHub (LAB-122) | origem pública |
| `esteira/tests/clone-da-maquina.test.ts` | o `fetch` de um clone de teste, de origem `file://` | origem de teste |

A trava reprova rede no caminho do motor **mesmo declarada**, rede nova fora dele sem declaração (ou uma a mais num
arquivo declarado) e declaração cuja rede sumiu. O que ela não alcança está dito no fim do módulo — entre outros, o
`verde.yml` (a máquina do GitHub clona e instala; não é a execução do Lab) e o `bun install` de quem prepara a máquina.

---

## Reconferido no LAB-159 · 17/10/2026 — a entrada, perguntada porta a porta

A linha *"Entrada validada antes de entrar no núcleo"* nomeava duas portas e não tinha trava. **Desde o LAB-159 ela é
perguntada a cada verde**, por `external-engines/esteira/src/entrada-validada.ts` e `tests/entrada-validada.test.ts`
(sem clones), que leem toda função exportada de `esteira/src/motores/` que recebe a entrada e conferem, em cada porta,
que a conferência vem **antes** do motor.

**O que a medição de 17/10 respondeu:** sete funções recebem a entrada, e elas chegam ao núcleo por **três** portas, não
duas:

| porta | quem confere | antes do LAB-159 |
|---|---|---|
| Laboratório de Parcelamento | `idaParaOMotor` (`testfit/adapter/src/ida.ts`) | as três recusas, as três com teste |
| Symbios | `glebaParaOSymbios` (`esteira/src/gleba-v1.ts`) | as três recusas; só a da versão com teste |
| motor interno do Generate | `rodarGenerate` (`esteira/src/motores/generate.ts`) | **nenhuma recusa** |

Rodado na gleba `completo`, a porta do Generate aceitou contrato `"9"` e `unidade: "ft"` e devolveu **1 606 lotes** nas
duas — o mesmo número da gleba em metro: o motor lê o número, não a unidade. Ela existe desde o LAB-13 (19/09), cinco dias depois
desta página. As três recusas passaram a morar em `recusaDaEntrada` (`gleba-v1.ts`), com as mensagens de antes, e as duas
portas da esteira perguntam a ela antes do motor; no Generate a recusa volta sem SAÍDA, com o motivo, e o motor não roda.
O que a trava não alcança está dito no fim do módulo — entre outros, que a porta comum ainda **estoura** com a recusa da
ida do Laboratório de Parcelamento, em vez de devolver `recusei` (proposto ao chat).

---

## Reconferido no LAB-160 · 17/10/2026 — o arquivo de credencial, perguntado pelo nome

A linha *"Nenhum `.env`, `.pem` ou arquivo de credencial"* era um `find` rodado uma vez, com três formas de nome, e
nenhuma trava a perguntava. A varredura de segredos (LAB-47) não a responde: ela lê o **conteúdo**, e medido em 17/10,
de seis arquivos de credencial plantados, **cinco passaram por ela calados** — o `.env` sem aspas e com aspas, o
`.npmrc`, o `.netrc` e o `.git-credentials`; só a chave de SSH em texto foi acusada. E o binário (`.p12`, `.pfx`,
`.jks`) ela declara *"de fora"*, com o nome, e passa.

**Desde o LAB-160 a linha é perguntada a cada verde**, por `external-engines/esteira/src/arquivo-de-credencial.ts` e
`tests/arquivo-de-credencial.test.ts` (sem clones), pelo **nome**, em dezessete formas (as três da página, mais a chave
solta, o certificado binário, o cofre Java, o PuTTY, a chave de SSH, o `.npmrc`, o `.netrc`, o `.pypirc`, o
`.htpasswd`, o `.dev.vars` do Cloudflare, a conta de serviço do Google, o arquivo `secrets`, o `.tfvars` e o KeePass),
e em dois universos:

| universo | lido em 17/10/2026 | nome de credencial |
|---|---|---|
| o que o `git` carrega (rastreado e o que entraria no próximo `commit -a`) | 753 caminhos | **zero** |
| todo nome que já entrou num commit do `HEAD` — chave que apareceu é chave vazada, mesmo apagada | 762 nomes, 456 commits | **zero** |

**A linha é verdadeira**, nos dois. O modelo do `.env` (`.env.exemplo`, sem valor) é o caso válido que quase parece
inválido, e passa; a chave pública (`.pub`) também. A história só se pergunta com ela inteira: no clone raso do CI a
leitura recusa e diz por quê (LAB-89). O que a trava não alcança está dito no fim do módulo — entre outros, credencial
com nome de outra coisa, que é da varredura de conteúdo, e o `.env` ignorado no disco, que é o jeito certo de tê-lo.

---

## Reconferido no LAB-161 · 17/10/2026 — o motor de fora, perguntado fora do `upstream/`

A linha *"Nenhum motor copiado para fora de `upstream/`"* era uma frase sobre duas pastas — `testfit/` e `esteira/` —, e
nenhuma trava a perguntava. As duas linhas de cima têm trava desde o LAB-132 (a árvore do `git` do `upstream/`), e o
LAB-146 compara esta casa com os motores **da família**; o motor de **fora**, o Symbios, nunca era o comparado. Medido
por mutação em 17/10: o `upstream/src/rationalize.rs` copiado byte a byte para `symbios/archilly/wasm/src/` e
adicionado ao `git` fez cair **uma** trava, a de contagem de árvore do LAB-57, que acusa qualquer arquivo novo e não diz
por quê.

**Desde o LAB-161 a linha é perguntada a cada verde**, por `external-engines/esteira/src/o-upstream-nao-sai-do-upstream.ts`
e `tests/o-upstream-nao-sai-do-upstream.test.ts` (sem clones), em duas metades:

| pergunta | universo lido em 17/10 | resposta |
|---|---|---|
| algum arquivo de código fora de `upstream/` copia o motor? (as linhas e os limites do LAB-146) | 18 arquivos de código do `upstream/` do Symbios contra 354 da casa | **nenhum**; o mais parecido tem 3 de 8 linhas em comum (`wasm-probe/src/lib.rs` com `examples/full_city.rs`: a chamada à API) |
| o Lab usa **este** motor, o conferido? (todo `Cargo.toml` fora de `upstream/` que depende de `symbios-tensor`) | 4 `Cargo.toml` lidos, 3 dependem do motor | **os três** (`probe/`, `wasm-probe/`, `wasm/`) por `path = "../../upstream"` |

A linha é verdadeira; faltava a pergunta. Uma dependência trocada por `symbios-tensor = "0.4"` faria o `cargo` baixar do
crates.io um motor que ninguém conferiu, com o `upstream-intocavel` verde sobre uma pasta que ninguém compila — e agora
reprova. O que a trava não alcança está dito no fim do módulo: a cópia reescrita (outra linguagem, outros nomes), o que
não é código, e a sondagem do straight-skeleton, que aponta para fora do repositório de propósito e não tem `upstream/`.

---

## Reconferido no LAB-162 · 17/10/2026 — os commits nos vizinhos, perguntados pela sessão

A linha *"Nenhum commit, nenhum push nos vizinhos"* e a do LF-FINAL-2, *"os commits dos clones vizinhos são **deles**"*,
eram um comando rodado duas vezes, sem trava. A trava do LAB-38 (`regras.test.ts`, §4) pergunta outra coisa — o clone
**desta máquina** limpo —, e um commit enviado à origem do vizinho deixa o clone limpo. E o comando do LF-FINAL-2 lia o
**autor**, que hoje não distingue casa nenhuma: `Claude <noreply@anthropic.com>` é o autor de 204 commits no Laboratório
de Parcelamento, 1 076 no Generate e 449 no Geo.

**Desde o LAB-162 a linha é perguntada a cada verde**, por `external-engines/esteira/src/nenhum-commit-nos-vizinhos.ts`,
`tests/nenhum-commit-nos-vizinhos.test.ts` (sem clones, histórias plantadas) e
`tests/nenhum-commit-nos-vizinhos-com-clone.test.ts` (verde completo, a história inteira da origem dos quatro). O que
identifica a casa é a **sessão** do rodapé `Claude-Session`.

**O que a medição de 17/10 respondeu**, clones desrasados, todas as referências da origem:

| repositório | commits | com rodapé de sessão | sessões em comum com esta casa |
|---|---|---|---|
| esta casa | 460 | 339 | — (82 sessões: 68 que trabalharam aqui, 14 da direção) |
| Laboratório de Parcelamento | 479 | 199 | 10, todas da direção |
| Generate | 1 356 | 651 | 10, todas da direção |
| Geo | 1 135 | 472 | 10, todas da direção |

As sessões em comum são **da direção** — a sessão do chat, que escreve nas caixas de entrada das onze casas na mesma
rodada. Aqui, os commits dela só mexem em `docs/caixa-de-entrada/`, com duas exceções de 09/10, o dia em que ela montou a
caixa (`6f43837`, o `docs/INDEX.md`; `d103582`, o `.claude/settings.json`), declaradas com o motivo. **Nenhuma sessão que
trabalhou nesta casa aparece num vizinho, e nenhum commit de vizinho tem assunto `LAB-<n>`** — a linha é verdadeira.

A trava reprova a sessão da casa num vizinho, o assunto `LAB-<n>` num vizinho, a declaração que sobra, a história rasa e
o universo vazio. O que ela não alcança está dito no fim do módulo — entre outros, o commit sem rodapé e sem o assunto
desta casa, e o que nunca chegou à origem.

---

## Reconferido no LAB-163 · 18/10/2026 — o `upstream/`, perguntado à história

A linha do LF-FINAL-2 (*"nunca foi tocado depois de criado"*) era um `git log` rodado em 15/09 e nunca mais. A trava do
LAB-132 pergunta a árvore da pasta **no `HEAD`** e diz o que deixa de fora: um patch commitado e desfeito depois volta à
mesma árvore e passa. Medido por mutação, numa cópia descartável desta casa, com o patch e o desfeito commitados: a do
LAB-132 **passou**; a nova **acusou**.

| o que se leu | quanto |
|---|---|
| commits do `HEAD` e da origem (`git rev-list HEAD --remotes=origin`, clone desrasado) | 462 |
| com a pasta `external-engines/symbios/upstream` | 461 |
| sem a pasta | 1 (a raiz, de antes do LAB-00) |
| árvores diferentes que a pasta já teve | **1** — `7ea7b17…`, a registrada no `COPIAS_DE_UPSTREAM` |
| commits que o `git log --full-history` mostra na pasta | 2: `f61be91` (LAB-00) e a mescla `baa3e07` (PR #1), com a mesma árvore |

O número sai a cada verde completo, publicado por `tests/a-historia-do-upstream-com-historia.test.ts`; com o clone raso,
reprova com a receita.

---

## Reconferido no LAB-166 · 18/10/2026 — a busca das chaves, refeita a cada verde

A primeira linha da tabela *Chaves e segredos* era um `grep` de oito nomes rodado em 14/09, com *"zero ocorrências"*, e
nenhuma trava o perguntava. **Refeito em 18/10, o comando da página dá duas:**

| onde | o nome | desde | o que é |
|---|---|---|---|
| `external-engines/esteira/tests/segredos.test.ts` | o campo de chave, com o valor `<a sua chave aqui>` | 05/10, LAB-47 | o caso válido que a varredura de segredos tem de perdoar: espaço reservado de documentação |
| `external-engines/esteira/tests/vazamento-de-custo.test.ts` | o campo de chave, com o valor `k` | 09/10, LAB-68 | o exemplo de chamada a provedor de IA que a trava do vazamento de custo tem de reprovar |

**Nenhuma é chave** — a frase *"nenhuma chave sensível"* é verdadeira; o *"zero"* não era, havia treze dias.

**A varredura de segredos (LAB-47) não responde esta linha.** Ela lê o formato e o nome que se declara com um valor; a
busca da página lê o nome. Medido em 18/10, com oito linhas plantadas (a constante de chave, o campo de chave do cliente,
o cabeçalho de autorização com o portador, a constante de segredo, a variável do Vite num JSON…, todas com um valor de 21
alfanuméricos): **a varredura passou calada pelas oito**, e a busca da página acusou **sete** — a oitava, o segredo
do JWT colado depois de `JWT_`, escapa das duas, porque o `\b` não separa `_` do nome (a mesma doença que o LAB-160 achou
na varredura com o `DB_` da senha). Duas razões para a varredura calar, as duas dela: o cabeçalho de autorização não está
na lista de nomes, e o valor alfanumérico que começa por letra cai no perdão *"identificador de código, não valor"* — que
é a forma de muita chave de verdade. Esse buraco é da varredura e foi à `FILA.md` como proposta ao chat (LAB-166).

**Desde o LAB-166 a linha é perguntada a cada verde**, por `external-engines/esteira/src/a-busca-das-chaves.ts` e
`tests/a-busca-das-chaves.test.ts` (sem clones), com a busca da página letra por letra, em dois universos:

| universo | lido em 18/10/2026, antes do commit | ocorrências |
|---|---|---|
| o da página: `.ts`, `.js`, `.json`, `.rs` que o `git` carrega, fora de `node_modules/` e de `upstream/` | 473 arquivos | 2, as declaradas |
| o largo: todo texto que o `git` carrega fora do `.md` (o `.mjs`, o `.html`, o `.yml`, o `.sh`, o gancho do envio, o `.toml`, e o `upstream/`) | 535 arquivos | as mesmas 2 |

O `.md` sai, contado (237), porque é onde a casa fala destes nomes — esta página escreve a busca —; o `.png`, contado,
porque é binário. Toda ocorrência tem de estar declarada com arquivo, trecho e motivo, e **só se declara texto de teste
de trava**; a declarada que sumiu também reprova. O registro diz o arquivo, a linha e o nome — nunca o resto da linha,
onde estaria o valor. O que a trava não alcança está dito no fim do módulo: a chave num nome que não é da busca (é da
varredura), o `.md` (também é da varredura, que cobre `docs/`), o nome colado depois de `_` (é a busca da página, perguntada letra por letra; mudá-la
é mudar a página, e foi proposto junto) e a história.
