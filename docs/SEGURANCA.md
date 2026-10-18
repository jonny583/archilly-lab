# SEGURANÇA — Archilly Lab

A lista do Padrão de Segurança da família, preenchida item a item. Conferida no
**LF-FINAL, 14/09/2026**, com o comando ao lado de cada linha, para que a
conferência possa ser refeita por quem quiser.

> **Leia primeiro o que este repositório é.** O Lab **não tem tela de usuário — só uma página de ferramenta, a bancada do navegador (`CLAUDE.md` §4) —, não tem
> banco, não tem conta de usuário e não faz chamada de rede em execução.** A
> maior parte da lista do Padrão trata de app com interface e Supabase; aqui ela
> se aplica por ausência, e isso está dito linha a linha em vez de marcado como
> "N/A" sem explicação. **Cada uma das quatro negações é perguntada a cada verde,
> e a trava de cada uma está nomeada aqui** (desde o LAB-184; até ele o parágrafo não
> nomeava nenhuma): a tela, por `a-unica-interface.ts` (LAB-153); o banco, por
> `o-lab-nao-tem-banco.ts` (LAB-174); a conta de usuário, por `o-lab-nao-tem-conta.ts`
> (LAB-184) e, a porta da família, por `a-adocao-da-central.ts` (LAB-167); a rede, por
> `rede-em-execucao.ts` (LAB-158) — todas em `external-engines/esteira/src/` (ver
> *Reconferido no LAB-184*, no fim).

---

## Chaves e segredos

| item | estado | como foi conferido |
|---|---|---|
| Nenhuma chave sensível no repositório | ✅ **limpo** | `grep -rE "\b(apiKey\|api_key\|API_KEY\|SECRET\|Bearer \|Authorization\|sk-[A-Za-z0-9]{20}\|VITE_[A-Z_]+)\b"` sobre todo `.ts`, `.js`, `.json` e `.rs` fora de `node_modules` e de `upstream/` — em 14/09, **zero ocorrências**; o "zero" ficou falso em 05/10 (LAB-47) e ninguém viu: **desde o LAB-166, a mesma busca é perguntada a cada verde** a tudo o que o `git` carrega — nas quatro extensões da página e em todo texto fora do `.md`, `upstream/` incluído —, e hoje dá **duas** ocorrências, nenhuma chave, as duas texto de teste de trava declarado um a um com o motivo (`external-engines/esteira/src/a-busca-das-chaves.ts`; ver *Reconferido no LAB-166*, abaixo) |
| Nenhuma chave em `VITE_` | ✅ **limpo** | não há empacotador de navegador — nenhuma dependência, `script`, configuração ou chamada dele, e a bancada lê o ambiente em lugar nenhum —, mas **há um build que o navegador baixa**: o `.wasm` da ponte `symbios/archilly/wasm/`, que embute **1** variável de compilação, `SYMBIOS_VERSAO`, posta pelo `build.rs` a partir do `Cargo.toml` do upstream (público) — nenhuma lida da máquina. Em 14/09 a linha negava que houvesse build, sem comando; **desde o LAB-180, perguntado a cada verde** (`external-engines/esteira/src/o-que-o-navegador-baixa.ts`; ver *Reconferido no LAB-180*, abaixo); e a busca da linha de cima cobre `VITE_` — perguntada a cada verde desde o LAB-166 (`external-engines/esteira/src/a-busca-das-chaves.ts`) |
| Nenhum `.env`, `.pem` ou arquivo de credencial | ✅ **limpo** | em 14/09, `find . -name ".env*" -o -name "*.pem" -o -name "*credential*"` — **nada**; **desde o LAB-160, perguntado a cada verde pelo NOME**, em dezessete formas, a tudo o que o `git` carrega e a todo nome que já entrou na história (`external-engines/esteira/src/arquivo-de-credencial.ts`; ver *Reconferido no LAB-160*, abaixo) |
| Chave de IA só no servidor da Central | ✅ **não se aplica** | o Lab não chama IA — nem direto, nem pela porta da Central — e não guarda chave de IA; **perguntado a cada verde por quatro travas**, cada uma um jeito de o Lab ter IA: a chave, nas **3** formas de chave de IA da varredura de segredos (`external-engines/esteira/src/varredura-de-segredos.ts`, LAB-47); a chamada, nas **6** formas do import e da chamada, do SDK do fornecedor à porta de IA da Central (`external-engines/esteira/src/destino-do-que-sai.ts`, LAB-80); a porta de serviço pago — dependência, variável de ambiente, endereço — (`external-engines/esteira/src/nada-pago.ts`, LAB-148); e a rede no caminho do motor (`external-engines/esteira/src/rede-em-execucao.ts`, LAB-158). Até o LAB-179 esta linha dizia só *"o Lab não chama IA"*, sem nomear nenhuma; a linha e a tabela dos achados são perguntadas por `external-engines/esteira/src/a-ia-na-pagina.ts` (ver *Reconferido no LAB-179*, abaixo). A adoção da Central: `ADOCAO_CENTRAL.md` |

## Banco e RLS

| item | estado | por quê |
|---|---|---|
| RLS em tudo, por conta | ✅ **não se aplica** | **não há banco.** Não existe `supabase/`, não existe migração, não existe tabela — em 14/09, uma frase, sem comando; **desde o LAB-174, perguntado a cada verde** a tudo o que o `git` carrega, por cinco portas: a pasta (`supabase/`, `migrations/`…), o arquivo (`.sql`, `.sqlite`…), a importação de um cliente de banco, a dependência num `package.json` ou `Cargo.toml` e o banco do navegador (`external-engines/esteira/src/o-lab-nao-tem-banco.ts`; ver *Reconferido no LAB-174*, abaixo) |
| Migrações versionadas | ✅ **não se aplica** | idem |
| Cuidado do `TRUNCATE` em tabela nova | ✅ **não se aplica** | idem |

**Se um dia houver banco aqui, esta seção deixa de ser "não se aplica" e o
`SEGURANCA.md` tem de ser refeito antes da primeira migração.**

## Execução

| item | estado | como foi conferido |
|---|---|---|
| Nada de rede em execução | ✅ | o adaptador do Symbios roda com **zero dependência npm**; os outros dois leem arquivo local e código dos clones irmãos. **No caminho do motor**, nenhum `fetch`, nenhum `http` — e, fora dele, as redes de ferramenta e de teste declaradas uma a uma, na tabela (ver *Reconferido no LAB-158*, abaixo) |
| O `.wasm` não pede nada do ambiente | ✅ | carregado com **objeto de imports vazio**, `{}`, nos dois lugares que o instanciam: o adaptador (`symbios/adapter/src/motor.ts`, `instantiate(modulo, {})`) e a bancada (`symbios/adapter/ferramentas/navegador/prova.js`, `instantiate(bytes, {})`). Medido no LAB-01 (10/09): 189 KB, zero imports — número da época: o binário não é versionado e **não é medido em máquina de sessão** desde o LAB-31 (o alvo do `rustup` não instala); **desde o LAB-176, perguntado a cada verde pelo que o produz e pelo que o carrega**: toda instanciação no código com `{}`; a ponte `symbios/archilly/wasm/` sem cola (`wasm-bindgen`, `js-sys`, `web-sys`, o `getrandom` com `wasm_js`) no `Cargo.toml` nem no `Cargo.lock`, com o backend `custom` do `getrandom` e sem import declarado à mão; a sonda do LAB-00, que TEM a cola, sem ninguém que a carregue; e o binário, quando existe no disco (`external-engines/esteira/src/o-wasm-nao-pede-nada.ts`; ver *Reconferido no LAB-176*, abaixo) |
| Nada de exportar motor ou código ao usuário | ✅ **não se aplica** | o Lab não tem usuário — mas o repositório é **público** e lê três vizinhos **privados**, então o que sai daqui sai para o mundo. **Desde o LAB-183, perguntado a cada verde por seis portas**: a tela, só a bancada (`external-engines/esteira/src/a-unica-interface.ts`, LAB-153); o código do produto da família copiado para cá (`external-engines/esteira/src/o-motor-da-familia-nao-se-copia.ts`, LAB-146, com os clones); e, em `external-engines/esteira/src/nada-se-exporta.ts`, o pacote publicável (todo `package.json` com `"private": true`, todo `Cargo.toml` fora do `upstream/` com `publish = false` — **dois não tinham**, consertados nesta rodada), a rotina que publica (nenhum passo de *release*, *pages*, *deploy* ou *upload* no `verde.yml`), o artefato compilado versionado (nenhum) e o que a pasta `docs/` carrega — só `.md`, `.json`, `.geojson` (os terrenos de entrada) e `.txt` (saídas de medição). Até o LAB-183 esta linha dizia só que *o Lab não tem usuário nem exportação*, sem comando (ver *Reconferido no LAB-183*, abaixo) |
| Entrada validada antes de entrar no núcleo | ✅ | versão do contrato, unidade (metro) e anel com ao menos 3 pontos são recusados com mensagem legível — `ida.ts` e `gleba-v1.ts`, com teste; **e, desde o LAB-159, também na terceira porta, a do motor interno do Generate (`motores/generate.ts`), que não recusava nada** (ver *Reconferido no LAB-159*, abaixo) |

## Os repositórios vizinhos

| item | estado | como foi conferido |
|---|---|---|
| Geo, Generate e o motor de parcelamento são **só leitura** | ✅ | o clone é perguntado a cada verde com clones: `git status --porcelain` vazio nos três (`external-engines/esteira/tests/regras.test.ts`, §4, desde o LAB-38 — D136, D143). Em 14/09, ao fim do LAB-08: **0 alterações** em cada. O relatório dizer o número **não** foi de toda rodada, como esta linha afirmava desde o LF-FINAL: **38** dos 168 relatórios `LAB-<n>` de antes do LAB-177 não dizem o `git status` dos vizinhos (medido em 18/10); de LAB-177 em diante todo relatório diz, perguntado a cada verde (`external-engines/esteira/src/os-vizinhos-no-relatorio.ts`; ver *Reconferido no LAB-177*, abaixo) |
| Nenhum commit, nenhum push nos vizinhos | ✅ | o histórico deles não tem commit desta sessão. O único toque foi `git merge --ff-only origin/main` no clone local do motor, para medir o T02 (D40); **desde o LAB-162, perguntado a cada verde pela SESSÃO** — o autor é o mesmo em toda a família —: nenhuma sessão que trabalhou nesta casa no rodapé de um commit da origem dos três vizinhos, e nenhum assunto `LAB-<n>` lá (`external-engines/esteira/src/nenhum-commit-nos-vizinhos.ts`; ver *Reconferido no LAB-162*, abaixo) |
| O que precisa mudar neles vira **lista em relatório** | ✅ | lista **numerada**, perguntada a cada verde desde o LAB-149 a todo relatório de `docs/relatorios/`, pelo título de seção e pelo marcador de pedido ao vizinho (`external-engines/esteira/src/pedido-ao-vizinho.ts`, D377): todo lugar de pedido tem item numerado, menos **5** pedidos sem lista, todos de antes da trava, congelados com o motivo. A régua lê a FORMA: o pedido em prosa, ou aberto num parágrafo em negrito, ela não vê. Até o LAB-178 esta linha dava, desde o LF-FINAL, quatro exemplos *"com o número"* — o número medido estava nos quatro, a lista em dois; os quatro são perguntados a cada verde, na tabela do *Reconferido no LAB-178*, abaixo (`external-engines/esteira/src/o-pedido-na-pagina.ts`). Que nada foi escrito lá é a linha de cima |

## Integridade do que foi copiado

| item | estado | como foi conferido |
|---|---|---|
| `external-engines/symbios/upstream/` byte a byte igual ao commit declarado | ✅ | `cmp` arquivo a arquivo contra `c3f287556b98cc616d4263d163e6643ae32111ff`, no LAB-00; **desde o LAB-132, a árvore do `git` da pasta é perguntada a cada verde** contra a registrada (`external-engines/esteira/src/upstream-intocavel.ts`); **e desde o LAB-185 ela é perguntada contra o commit DE VERDADE** — a árvore do commit na origem, gravada com o objeto de cada arquivo, comparada arquivo a arquivo com a da cópia, a cada verde e sem rede (`external-engines/esteira/src/a-analise-do-symbios.ts`): 24 de 24 iguais, e só o `VERSION` a mais |
| Licença do upstream preservada | ✅ | `upstream/LICENSE` (MIT, `Copyright (c) 2026 TheJanusStream`) intocado — e, desde o LAB-132, dentro da árvore perguntada na linha acima: um byte da licença mudado muda a árvore |
| Nenhum motor copiado para fora de `upstream/` | ✅ | em 14/09, `external-engines/testfit/` e `external-engines/esteira/` não contêm código de motor — só a ponte (D16); **desde o LAB-161, perguntado a cada verde** a todo arquivo de código que o `git` carrega fora de toda pasta `upstream/`, linha a linha contra o motor, e a todo `Cargo.toml` que depende dele — tem de apontar para o `upstream/` por `path` (`external-engines/esteira/src/o-upstream-nao-sai-do-upstream.ts`; ver *Reconferido no LAB-161*, abaixo) |

---

## O que **não** foi conferido, e por quê

- **Prova no navegador com console limpo.** O Lab não tem tela de usuário; tem UMA página de ferramenta, a bancada
  (`external-engines/symbios/adapter/ferramentas/navegador/index.html`), a exceção declarada no `CLAUDE.md` §4 (D381).
  As provas de navegador são **três**: duas do `.wasm` carregando no Chromium — a captura feita à mão no LAB-01
  (`outputs/lab01/navegador.png`, 10/09) e a prova automática do LAB-31 (`docs/provas/LAB-31/navegador.json`,
  escrita por `external-engines/symbios/adapter/ferramentas/navegador/prova-automatica.ts`, que o `conferir.sh` roda)
  — e a da bancada na largura de celular, do LAB-182 (`docs/provas/LAB-182/navegador-celular.json`, escrita por
  `external-engines/symbios/adapter/ferramentas/navegador/rolagem-no-celular.ts`, que o `conferir.sh` também roda e
  que não precisa do `.wasm`).
  **O console não reprova:** a prova do LAB-31 escuta o console e o `pageerror`, mas só os usa para explicar quando a
  página não publica o resultado — com o número certo e um erro no console, ela aprova. E ela não roda nesta máquina
  desde o LAB-31: o `.wasm` não é versionado e o alvo do `rustup` não instala. Perguntado a cada verde desde o LAB-175
  (`external-engines/esteira/src/a-prova-de-navegador.ts`; ver *Reconferido no LAB-175*, abaixo).
- **Nada repintado fora do catálogo de design.** Não se aplica: não há tela de usuário, só a bancada, que é ferramenta.
  Há, porém, **9** cores escritas à mão, nenhuma do catálogo da família, em três lugares — os dois arquivos da bancada
  (o `<style>` do `index.html` e o canvas do `prova.js`) e o `.svg` que o exemplo do upstream pintou no LAB-00. A paleta de cada
  lugar está congelada e é perguntada a cada verde desde o LAB-181, nos dois sentidos: cor nova, lugar novo pintado ou
  cor que sumiu reprovam (`external-engines/esteira/src/as-cores-da-bancada.ts`; ver *Reconferido no LAB-181*, abaixo).
- **Mobile sem rolagem lateral.** Não se aplica: não há tela de usuário, só a bancada, que é ferramenta. Mas a
  bancada foi medida no celular no LAB-182, no Chromium, a 390, 360 e 320 px, com e sem a emulação de celular, como
  monta nesta máquina (sem o `.wasm`) e com o registro de 10/09 dentro: não rola de lado: sobra **0** px nos
  doze casos. O `<canvas>` encolhe (`max-width: 100%`) e a linha larga do registro rola dentro da própria caixa
  (`overflow-x: auto`). A página não tem `<meta name="viewport">`: o celular de verdade a desenha em 980 px e a
  encolhe — não rola, mas a letra fica pequena. A medição é refeita a cada verde
  (`external-engines/symbios/adapter/ferramentas/navegador/rolagem-no-celular.ts`, que escreve
  `docs/provas/LAB-182/navegador-celular.json`) e perguntada contra a página por
  `external-engines/esteira/src/a-rolagem-no-celular.ts` (ver *Reconferido no LAB-182*, abaixo).

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
| `esteira/ferramentas/lab171.ts` | os dois `git fetch --depth 1` e o `git ls-remote` do PackingSolver, numa pasta temporária, lidos e nunca executados — acrescentada no LAB-171, 18/10 (3) | origem pública |
| `esteira/ferramentas/lab172.ts` | os três `git fetch --filter=blob:none --depth 1` (os dois commits do esqueleto reto e a tag da CGAL) e o `git ls-remote` e o `fetch` do `HEAD` de hoje, em pastas temporárias, lidos e nunca executados — acrescentada no LAB-172, 18/10 (5) | origem pública |
| `esteira/ferramentas/lab185.ts` | os dois `git fetch --filter=blob:none --depth 1` (o commit do Symbios que a análise fixa e o `HEAD` de hoje), o `git ls-remote` e o `curl` à API de leitura do registro público das crates (uma função só, chamada duas vezes por dependência), em pasta temporária, lidos e nunca executados — acrescentada no LAB-185, 18/10 (4) | origem pública |

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

---

## Reconferido no LAB-174 · 18/10/2026 — o banco, perguntado à árvore

A tabela *Banco e RLS* põe as três linhas do Padrão em *"não se aplica"* por uma frase — *"não há banco. Não existe
`supabase/`, não existe migração, não existe tabela"* —, escrita em 14/09 sem comando ao lado. O cabeçalho da trava da
rede (LAB-158) dizia que o banco já era perguntado *"pela ausência de `supabase/`, que o `verde.test.ts` confere contra o
disco"*; **não era** — aquela régua lê só as linhas do `conferir.sh`. Medido por mutação em 18/10, cada uma numa cópia
desta casa, adicionada ao `git`, com a esteira inteira rodando:

| o que se plantou | o que caiu além das 9 de sempre (o `.wasm`) |
|---|---|
| `supabase/migrations/0001_estudos.sql`, com um `create table` | só a contagem de arquivos do LAB-57, que cai com qualquer arquivo novo e não diz por quê |
| um arquivo da esteira abrindo um banco pelo `bun:sqlite` | a mesma contagem, e a das chamadas do LAB-52 |
| `dados/medicoes.sqlite` | só a contagem do LAB-57 |

**Desde o LAB-174 a linha é perguntada a cada verde**, por `external-engines/esteira/src/o-lab-nao-tem-banco.ts` e
`tests/o-lab-nao-tem-banco.test.ts` (sem clones), por cinco portas: a **pasta** de banco em qualquer altura do caminho
(`supabase`, `migrations`, `migracoes`, `drizzle`, `prisma`), o **arquivo** que é banco ou o descreve (`.sql`, `.db`,
`.sqlite`, `.sqlite3`, `.duckdb`, `.mdb`, `.prisma`, `drizzle.config.*`), a **importação** de um cliente de banco
(JavaScript e Rust, a string inteira em posição de importação, sem comentário), a **dependência** num `package.json` ou
num `Cargo.toml`, e o **banco do navegador** (`indexedDB`, `openDatabase`).

| universo | lido em 18/10/2026, antes do commit | banco |
|---|---|---|
| caminhos que o `git` carrega (`upstream/` incluído, `node_modules/` fora) | 801 | **zero** |
| arquivos JS/TS · Rust · `package.json` · `Cargo.toml` lidos | 378 · 23 · 2 · 5 | **zero** |

**A frase é verdadeira; faltava a pergunta.** Não há lista de exceções: um banco aqui é o dia em que esta seção tem de
ser refeita antes da primeira migração, como ela mesma diz, e a trava reprova até isso acontecer. O que ela não alcança
está dito no fim do módulo — entre outros, o banco de fora alcançado pela rede (é da trava da rede), o cliente que não
está na lista, e a **conta de usuário**, a outra negação da frase do topo: a conta da família é da Central, e quem pergunta
se o Lab importa a Central é a `a-adocao-da-central.ts` (LAB-167).

---
## Reconferido no LAB-175 · 18/10/2026 — a prova de navegador, perguntada pelo lugar

O item *Prova no navegador com console limpo*, da seção *O que **não** foi conferido*, dizia desde o LF-FINAL que *"o Lab
não tem tela"* (calando a bancada) e que *"a única prova de navegador que existe é a do LAB-01"*, e o topo dizia o
mesmo da tela. Nenhuma trava lia nenhuma das duas frases. Medido por LUGAR em 18/10:

| a frase | o que a árvore diz |
|---|---|
| *"a única prova de navegador é a do LAB-01"* | são **duas** — a do LAB-31 (`docs/provas/LAB-31/navegador.json`, automática) entrou em 04/10 e a página não mudou |
| *"o Lab não tem tela (é regra dele, em `CLAUDE.md` §4)"* | o §4 diz *"com UMA exceção, declarada: a bancada do navegador"* (D381) |
| *"console limpo"* (o que não foi conferido) | a prova do LAB-31 **escuta** o console e o `pageerror` e não reprova por eles: o erro só entra na mensagem quando a página não publica |

| universo | lido em 18/10/2026, antes do commit | achado |
|---|---|---|
| caminhos que o `git` carrega (`node_modules/` fora) | 805 | — |
| arquivos JS/TS lidos, procurando um condutor de navegador importado | 381 | **um** produtor: `prova-automatica.ts` |
| arquivos de `outputs/` e `docs/provas/` com `navegador` no nome | — | **dois** artefatos |
| a página de antes, conferida pela régua nova | — | **nove** problemas: quatro nomes que o item não dava, o *"única"*, o console calado e três linhas de *"não há tela"* sem a bancada |

**Desde o LAB-175 o item é perguntado a cada verde**, por `external-engines/esteira/src/a-prova-de-navegador.ts` e
`tests/a-prova-de-navegador.test.ts` (sem clones): os produtores e os artefatos nos dois sentidos; o item nomeia cada um,
a bancada e a trava; não diz *"única"*; diz que o console não reprova enquanto o código do produtor não testar o
`pageerror` num `if`; e toda linha da página que diz *"não tem tela"* nomeia a bancada. O que ela não alcança está dito no
fim do módulo — entre outros, **se a prova RODA**: esta régua pergunta quem ela é e o que diz, não se ela passa.

---

## Reconferido no LAB-176 · 18/10/2026 — o `.wasm`, perguntado ao que o produz e ao que o carrega

A linha *O `.wasm` não pede nada do ambiente*, da tabela *Execução*, era uma medição de 10/09 (LAB-01) sobre um binário
que não é versionado e que nenhuma máquina de sessão compila desde o LAB-31 — o alvo `wasm32-unknown-unknown` do `rustup`
não instala (nesta rodada: *"unsuccessful tunnel"* em `static.rust-lang.org`). As rodadas LAB-174 e LAB-175 a deixaram
de lado por isso. **Metade da linha espera o binário; a outra metade está no código**, e nenhuma trava a lia. Medido em
18/10:

| pergunta | lido | achado |
|---|---|---|
| quem instancia WebAssembly, e com que imports | 807 caminhos, 382 JS/TS (809 e 384 com os dois arquivos desta rodada) | **dois**, os dois com `{}`: `symbios/adapter/src/motor.ts` (`instantiate(modulo, {})`, depois de um `compile`) e a bancada, `prova.js` (`instantiate(bytes, {})`) — a página citava só a forma da bancada |
| quais crates viram `.wasm` (`crate-type = ["cdylib"]`) | 5 `Cargo.toml` | **duas**: a ponte `symbios/archilly/wasm/` (o artefato que o `conferir.sh` e as ferramentas `labNN.ts` carregam) e a sonda do LAB-00, `wasm-probe/` |
| a cola na ponte | `Cargo.toml` e `Cargo.lock` | **nenhuma**: o `getrandom` sem feature, e o lock sem `wasm-bindgen`, `js-sys` ou `web-sys` |
| a cola na sonda | idem | **tem**, de propósito: `getrandom` com `wasm_js`, e o lock traz `wasm-bindgen` e `js-sys` — foi ela que mostrou o problema, e ninguém carrega o artefato dela |
| o backend do `getrandom` | o `src/` da ponte e o `conferir.sh` | `__getrandom_v03_custom` definido no `lib.rs`; `getrandom_backend="custom"` na receita; nenhum `extern "C" { … }` |
| o binário | o caminho do `conferir.sh` | **ausente** — não medido (`null`), nunca zero |
| a linha de antes, conferida pela régua nova | — | **quatro** nomes que ela não dava: a trava, os dois instanciadores e a ponte |

**A linha era verdadeira; faltava a pergunta.** Sem a trava, trocar o `{}` do adaptador por `{ env: {} }`, ligar o
`wasm_js` no `getrandom` da ponte ou apagar o `__getrandom_v03_custom` passava a esteira inteira — o primeiro só quebraria
onde o binário existe (nenhuma máquina, hoje), e os outros dois só na compilação, que também não roda aqui.

**Desde o LAB-176 a linha é perguntada a cada verde**, por `external-engines/esteira/src/o-wasm-nao-pede-nada.ts` e
`tests/o-wasm-nao-pede-nada.test.ts` (sem clones): os instanciadores e as crates `cdylib` nos dois sentidos; o `{}` em
cada instanciação; a ponte sem cola e com o backend `custom`; a sonda sem quem a carregue; o binário, quando existe; e a
linha nomeando a trava, os instanciadores e a ponte. O que ela não alcança está dito no fim do módulo — entre outros,
**o binário em máquina sem ele**: ali a resposta é *não medido*.

---

## Reconferido no LAB-177 · 18/10/2026 — os vizinhos só leitura, perguntados ao relatório

A linha *"Geo, Generate e o motor de parcelamento são só leitura"*, do LF-FINAL, tinha duas metades: *"`git status` nos
três ao fim de toda rodada"* — que a `regras.test.ts` §4 pergunta desde o LAB-38, e a linha não a nomeava — e *"o número
sai no relatório"*, que ninguém perguntava. Medida por LUGAR, todo `docs/relatorios/LAB-<n>.md` que o `git` carrega:

| universo | lido em 18/10/2026, antes do relatório desta rodada | achado |
|---|---|---|
| relatórios `LAB-<n>` (os `LF-*`, o `LAB01_ADAPTADOR`, o `RECADOS` e o `BALANCOS` não são rodadas `LAB-<n>`) | 168 | **130** dizem o `git status` dos vizinhos e o resultado; **38** não |
| os 38 | LAB-02, 03, 07, 48 a 52, 57 a 61, 69, 75, 77 a 79, 85, 88 a 95, 116 a 125, 153 | congelados em `CALADOS`: relatório antigo não se reescreve para passar numa régua |

*"Dizer"* é ter `git status` e, a até 220 caracteres dele, os vizinhos (*"os três"*, *"vizinho"*, *"clone"*) **e** o
resultado (*"limpo"*, *"vazio"*, *"0 alterações"*, *"nenhuma alteração"*). Calado não é sujo: o LAB-153, por exemplo,
diz que os clones *"não foram precisos nesta rodada"*, e o LAB-48 que *"os três clones foram conferidos"* — sem a forma.
A régua pergunta a forma, de propósito, e o que o relatório afirma continua sendo perguntado ao clone pela `regras.test.ts`.

---

## Reconferido no LAB-178 · 18/10/2026 — a lista aos vizinhos, e os quatro exemplos da página

A linha *"O que precisa mudar neles vira lista em relatório"*, do LF-FINAL, dava quatro exemplos — *"LAB-07 §9 (8
correções), LAB-02 §5, LAB-03 e LAB-08 — todos com o número e sem commit lá"* — e não nomeava a trava que pergunta a
regra a todo relatório desde o LAB-149 (`pedido-ao-vizinho.ts`). Os quatro, perguntados à régua do LAB-149:

| exemplo | lugares de pedido | com lista | itens numerados | sem lista, congelados no LAB-149 | a leitura à mão |
|---|---|---|---|---|---|
| LAB-07 | 2 | 1 | 8 | 1 | o §9, *A lista para o T02 do Testfit*, é a lista; o pedido ao Generate do §8 (*diagnóstico para repassar*) saiu em prosa |
| LAB-02 | 0 | 0 | 0 | 0 | o pedido do §5 **tem** lista numerada, mas abre num parágrafo em negrito (*Para o chat repassar ao Generate*), forma que a régua não lê |
| LAB-03 | 1 | 0 | 0 | 1 | *O que isso muda para o Generate*: a correção das duas cotas, em prosa |
| LAB-08 | 0 | 0 | 0 | 0 | *uma pergunta, com número, para o Generate*, em prosa, no fim do §2.4 |

O *"com o número"* da linha antiga era o número medido, e esse está nos quatro; a *lista*, em dois. A régua nova acusou
**sete** problemas na linha de antes: quatro nomes calados (as duas travas, o LAB-149 e o LAB-178), o número dos pedidos
sem lista ausente, o *"todos com o número"* e a falta desta tabela.

**Desde o LAB-178 a linha e a tabela são perguntadas a cada verde**, por `external-engines/esteira/src/o-pedido-na-pagina.ts`
e `tests/o-pedido-na-pagina.test.ts` (sem clones): a linha nomeia as duas travas e as duas rodadas, escreve o número de
pedidos congelados que a lista do LAB-149 tem e não cita relatório fora desta tabela; a tabela tem os quatro exemplos, e
as quatro colunas de número são as que a régua do LAB-149 acha neles. A última coluna é texto e não é perguntada — dito no
fim do módulo, com o resto do que a trava não alcança.

## Reconferido no LAB-179 · 18/10/2026 — a chave de IA, e as quatro travas que a linha não nomeava

A linha *"Chave de IA só no servidor da Central"*, do LF-FINAL, dizia *"o Lab não chama IA. Ver `ADOCAO_CENTRAL.md`"* —
verdade, e perguntada, mas por quatro travas nascidas depois dela, que ela não nomeava. Por LUGAR, os quatro jeitos de o
Lab ter IA, cada um com a régua que o pergunta hoje, rodadas na árvore em 18/10:

| pergunta | trava | desde | achados |
|---|---|---|---|
| a chave de IA na árvore (as regras `chave-de-ia-*`) | `varredura-de-segredos.ts` | LAB-47 | 0 |
| a chamada de IA no código (`CHAMADA_PAGA_DE_IA`) | `destino-do-que-sai.ts` | LAB-80 | 0 |
| a porta de serviço pago (as portas pagas) | `nada-pago.ts` | LAB-148 | 0 |
| a rede no caminho do motor | `rede-em-execucao.ts` | LAB-158 | 0 |

A régua da chamada nasceu no LAB-68, no `vazamento-de-custo.test.ts`, e mora no `destino-do-que-sai.ts` desde o LAB-80;
a coluna dá a casa de hoje, que é a que o módulo nomeia. A régua nova acusou **catorze** problemas na linha de antes:
nenhuma trava nomeada, dez nomes calados (as quatro travas, as quatro rodadas, esta trava e o LAB-179), os dois números
ausentes e a falta desta tabela.

**Desde o LAB-179 a linha e a tabela são perguntadas a cada verde**, por `external-engines/esteira/src/a-ia-na-pagina.ts`
e `tests/a-ia-na-pagina.test.ts` (sem clones): a linha nomeia as quatro travas e as quatro rodadas, e os dois números
dela são o tamanho das duas listas de formas; a tabela tem as quatro travas, nem mais nem menos, a rodada de cada uma é a
que o módulo nomeia, e a coluna dos achados é a que as quatro réguas acham na árvore. O que ela não alcança — IA de
fornecedor que nenhuma régua conhece pelo nome, o cliente em Rust que só aparece pela porta — está dito no fim do módulo.

## Reconferido no LAB-180 · 18/10/2026 — o que o navegador baixa, e a variável que o `.wasm` embute

A linha *"Nenhuma chave em `VITE_`"*, do LF-FINAL, dizia *"não há build de navegador neste repositório; e a busca acima
cobre `VITE_`"*. A regra do Padrão existe porque o empacotador copia para dentro do arquivo que o navegador baixa toda
variável com o prefixo público. Por LUGAR, as três portas por onde uma variável de compilação chegaria ao navegador
desta casa — rodadas na árvore em 18/10:

| pergunta | onde | achados |
|---|---|---|
| `empacotador` | dependência de empacotador num `package.json`, o `script` que o chama, a configuração dele pelo nome, a chamada no código | 0 |
| `pagina` | os `.html` e `.js` da bancada (o servidor dela os devolve como estão): leitura de ambiente e nome com prefixo público | 0 |
| `wasm` | `env!` e `option_env!` nos `.rs` da ponte que o navegador carrega | **1** — `SYMBIOS_VERSAO`, posta pelo `build.rs` |

**A frase era falsa na letra e verdadeira no que importa.** Há um build que chega ao navegador — o `cargo build --target
wasm32-unknown-unknown` do `conferir.sh` — e ele embute uma variável; mas ela é o carimbo da versão do motor, que o
`build.rs` lê de um arquivo público, e não uma chave da máquina. Ninguém perguntava nem uma coisa nem outra: um
`env!` de uma chave no `lib.rs` da ponte só cairia na `nada-pago.ts` (LAB-148) como porta nova, e quem a declara escolhe
a classe. A régua nova acusou **oito** problemas na linha de antes: o *"não há build de navegador"*, quatro nomes
calados (esta trava, o LAB-180, a busca do LAB-166 e o LAB-166), o número, o nome embutido e a falta desta tabela.

**Desde o LAB-180 a linha e a tabela são perguntadas a cada verde**, por `external-engines/esteira/src/o-que-o-navegador-baixa.ts`
e `tests/o-que-o-navegador-baixa.test.ts` (sem clones): empacotador e leitura de ambiente na bancada em zero; todo nome
embutido no `.wasm` declarado e posto pelo `build.rs`, nos dois sentidos, e o `build.rs` sem ler a máquina; a busca do
LAB-166 ainda com o prefixo; a linha com as duas travas, as duas rodadas, o número e o nome; a tabela com as três
perguntas e os achados da árvore. O que ela não alcança — empacotador que a lista não conhece, a variável que entra por
macro de outra crate, o binário que nenhuma máquina compila hoje — está dito no fim do módulo.

---

## Reconferido no LAB-181 · 18/10/2026 — as cores, perguntadas pelo lugar

O item *"Nada repintado fora do catálogo de design"*, do LF-FINAL, dizia *"Não há design: a única página é a bancada"*.
A regra do Padrão (nenhum valor visual em tela; tudo do catálogo da Central, pelas variáveis `--ar-*`) existe para que a
cor de uma tela tenha um dono só. Por LUGAR, os dois caminhos por onde cor entra na árvore — o arquivo de página (`.html`,
`.css`, `.svg`, componente de tela; 2 lidos em 18/10) e a string de cor no código que pinta (fora do `upstream/`; 398
lidos) —, rodados no que o `git` carrega:

| lugar | onde | cores |
|---|---|---|
| `bancada-html` | o `<style>` da bancada (`external-engines/symbios/adapter/ferramentas/navegador/index.html`): o fundo do `<pre>` e a borda do `<canvas>` | 2 |
| `bancada-js` | o canvas da bancada (`prova.js`, na mesma pasta): o fundo, as curvas e as duas cores das vias | 4 |
| `svg-do-upstream` | `outputs/symbios_full_city_lots.svg`, saída do exemplo `full_city.rs` do upstream, gravada no LAB-00 | 3 |

**A frase era falsa na letra e verdadeira no que importa.** Há design — nove cores escritas à mão, nenhuma do catálogo —,
mas todas numa página de ferramenta (a exceção declarada do `CLAUDE.md` §4) ou num artefato de medição que o upstream
pintou; tela de usuário, nenhuma. Ninguém perguntava: uma cor nova na bancada, ou uma página nova pintada, passariam a
esteira inteira. A régua nova acusou **cinco** problemas no item de antes: o *"não há design"*, dois nomes calados (esta
trava e o LAB-181), o número e a falta desta tabela.

**Desde o LAB-181 o item e a tabela são perguntados a cada verde**, por `external-engines/esteira/src/as-cores-da-bancada.ts`
e `tests/as-cores-da-bancada.test.ts` (sem clones): a paleta de cada lugar congelada, nos dois sentidos — cor nova, cor que
sumiu, lugar novo com cor e lugar declarado sem cor reprovam —; o item com a trava, a rodada e o número, e sem a frase de
antes; a tabela com os três lugares e as cores da árvore. Mudar uma cor de propósito é mudar a lista e esta página no
mesmo commit. O que ela não alcança — cor por nome, fonte e tamanho, cor montada em pedaços no código, o pixel da
captura — está dito no fim do módulo.

---

## Reconferido no LAB-182 · 18/10/2026 — o celular, perguntado ao navegador

O item *"Mobile sem rolagem lateral"*, do LF-FINAL, dizia *"Idem: a bancada não é aberta no celular"* — hábito de quem
usa, não propriedade da página. A regra da família (*nada estoura lateralmente no celular*) se responde com uma medição:
a largura do conteúdo do documento contra a largura da janela, na tela que o Laboratório de Parcelamento usa (390×844,
emulando celular). A bancada monta o mesmo esqueleto com ou sem o `.wasm` (ele só muda o que vai dentro do `<pre>` e do
`<canvas>`), então ela é medida nesta máquina: como monta aqui, e com o registro de 10/09 (lido do `README.md` da
bancada) dentro do `<pre>`. A coluna *desenhada em* é a largura em que o Chromium desenha a página; *sobra* é a maior
dos dois estados.

| tela | emulação | desenhada em (px) | sobra (px) |
|---|---|---|---|
| `390×844` | celular | 980 | 0 |
| `390×844` | janela | 390 | 0 |
| `360×740` | celular | 980 | 0 |
| `360×740` | janela | 360 | 0 |
| `320×568` | celular | 980 | 0 |
| `320×568` | janela | 320 | 0 |

**A frase era verdadeira no resultado e falsa no motivo.** A página não rola de lado, mas não porque ninguém a abre no
celular: o `<canvas>` de 700 px encolhe com a janela (`max-width: 100%`, 328 px a 390), a linha mais larga do registro
de 10/09 (698 px) rola dentro da própria caixa (`overflow-x: auto`, 326 px a 390) e o `body` não tem largura fixa. E a
página não tem `<meta name="viewport">`: emulando celular, o Chromium a desenha em 980 px e a encolhe para caber — não
rola, mas a letra fica com cerca de 40 % do tamanho. Como a bancada é ferramenta, isto se diz e não se conserta aqui.

**Desde o LAB-182 a medição é refeita a cada verde** — o `conferir.sh` roda
`external-engines/symbios/adapter/ferramentas/navegador/rolagem-no-celular.ts` antes dos pacotes, e ele reprova sozinho
com sobra acima de zero — **e perguntada contra a página** por `external-engines/esteira/src/a-rolagem-no-celular.ts` e
`tests/a-rolagem-no-celular.test.ts` (sem clones): o JSON leva o SHA-256 do `index.html` e do `prova.js` (página mudada
sem medição refeita reprova), o `<meta name="viewport">` que a medição viu tem de ser o da página, a tela da família tem
de estar lá, o item escreve a sobra e cala o viewport só se ele existir, e esta tabela tem os casos da medição, nem mais
nem menos. O que ela não alcança — a página com o `.wasm`, o tamanho da letra, outros navegadores — está dito no fim do
módulo.

## Reconferido no LAB-183 · 18/10/2026 — o que sai daqui, perguntado pela porta

A linha *Nada de exportar motor ou código ao usuário*, da tabela *Execução*, dizia desde o LF-FINAL (14/09) só que *"o
Lab não tem usuário nem exportação. O que ele publica são relatórios e JSON de medição"* — sem comando, e era a última
das tabelas desta página sem trava nomeada. A regra da família fala de produto com usuário; o Lab não tem usuário, mas
tem um repositório **público** que lê por caminho três vizinhos **privados** (D16, D141): o que sai daqui sai para o
mundo. Por LUGAR, seis portas por onde motor ou código sairiam — duas já perguntadas por outra régua, quatro por esta.
A coluna *achados* é o que a régua acha hoje, depois do conserto; os universos que ela leu o teste imprime.

| porta | o que se pergunta | achados |
|---|---|---|
| `pacote` | todo `package.json` com `"private": true`; todo `Cargo.toml` fora do `upstream/` com `publish = false` no `[package]` | 0 |
| `rotina` | nenhum passo de *release*, *pages*, *deploy* ou *upload*, nem `publish`, `gh release`, `wrangler`, `vercel`, `netlify`, `docker push` ou `git push`, nas rotinas de `.github/workflows/` | 0 |
| `binario` | nenhum artefato compilado versionado fora do `upstream/`: pela extensão, pelo `\0asm` no começo do arquivo e pelo `.wasm` em base64 dentro de texto | 0 |
| `docs` | a pasta `docs/` só em `.md`, `.json`, `.geojson` e `.txt` | 0 |

As outras duas portas: a **tela** é a `a-unica-interface.ts` (LAB-153) — só a bancada, que é ferramenta — e o **código do
produto** da família copiado para cá é a `o-motor-da-familia-nao-se-copia.ts` (LAB-146), que só roda com os clones.

**Antes do conserto, a porta `pacote` achava dois:** o `external-engines/straight-skeleton/archilly/probe-rust/Cargo.toml`
(a sonda que depende de um crate GPL clonado num `/tmp`) e o `external-engines/symbios/archilly/wasm-probe/Cargo.toml` (a
sonda do LAB-00) não diziam `publish = false`. O `cargo` provavelmente já recusaria publicá-los — dependência por `path`
sem versão —, mas isso é comportamento de ferramenta externa **não testado** aqui; o campo escrito não depende dele, e os
dois o ganharam nesta rodada. A régua nova, contra a página e a árvore de antes, acusou **catorze** problemas: os dois pacotes, os seis
nomes que a linha calava (esta trava, as duas vizinhas e as três rodadas), os quatro formatos de `docs/`, a frase de 14/09
sozinha e a seção que não existia — e um décimo quinto, nela mesma, que o conserto tirou antes do commit: o prefixo do
`.wasm` em base64 escrito por inteiro num comentário do próprio módulo.

**Desde o LAB-183, perguntado a cada verde** por `external-engines/esteira/src/nada-se-exporta.ts` e
`tests/nada-se-exporta.test.ts` (sem clones, no portão): as quatro portas na árvore, cada uma com o universo que leu
publicado, sem lista de exceções; a linha nomeia esta trava, as duas vizinhas e os quatro formatos; esta tabela tem as
quatro portas, com os achados que a régua dá. O que ela não alcança — a permissão do `GITHUB_TOKEN`, que o `verde.yml` não
declara; ação de publicar que a lista não conhece pelo nome; publicar pelo painel do GitHub, fora da árvore — está dito no
fim do módulo.

---

## Reconferido no LAB-184 · 18/10/2026 — a conta de usuário, perguntada pela porta

O parágrafo do topo diz, desde o LF-FINAL (14/09), que o Lab *"não tem conta de usuário"*. Das quatro negações dele,
três ganharam trava depois (a tela, a rede e o banco); a da conta tinha uma porta só — a do kit da Central, que é quem
tem contas na família, perguntada pela `a-adocao-da-central.ts` (LAB-167). A trava do banco a passava adiante para ela.
Mas conta de usuário pode nascer **sem** a Central, e sem banco: uma biblioteca de senha ou de sessão, um campo de senha
na bancada, um cookie que lembra quem entrou. Plantados um a um numa cópia da casa, com a suíte da esteira inteira
rodando, **nenhuma trava disse "conta"**: a biblioteca derrubou só as contagens de arquivo do LAB-52 e do LAB-57; o
cookie no `prova.js`, a do LAB-57 e o carimbo da bancada do LAB-182 (que cai com qualquer edição da página); o campo de
senha, o mesmo carimbo e a régua do `<form` do `regras.test.ts` §4 — que não pega o campo solto, sem formulário.

Por LUGAR, quatro portas, em tudo o que o `git` carrega (`upstream/` incluído, `node_modules/` fora). A coluna
*achados* é o que a régua acha hoje; os universos que ela leu o teste imprime.

| porta | o que se pergunta | achados |
|---|---|---|
| `modulo` | importar uma biblioteca de identidade — sessão, senha, token, login de terceiro (34 nomes de JavaScript, 13 crates de Rust) —, em `from`, `require(`, `import(`, `use` e `extern crate` | 0 |
| `dependencia` | a mesma biblioteca num `package.json` (as quatro listas) ou num `Cargo.toml` (as tabelas e a forma longa) | 0 |
| `senha` | o campo de senha: `type="password"` e o `autocomplete` de senha, no `.html` e dentro das strings do código, e o `type` posto à mão | 0 |
| `cookie` | o lembrete de sessão: `document.cookie` e `cookieStore` no código e no `.html`, e o cabeçalho que grava cookie | 0 |

A quinta porta, a da família, segue com a `a-adocao-da-central.ts`: esta trava não a pergunta de novo, só cobra que o
parágrafo a nomeie.

**Desde o LAB-184, perguntado a cada verde** por `external-engines/esteira/src/o-lab-nao-tem-conta.ts` e
`tests/o-lab-nao-tem-conta.test.ts` (sem clones, no portão): as quatro portas na árvore, cada uma com o universo que leu
publicado, sem lista de exceções; o parágrafo do topo com as quatro negações e as cinco travas nomeadas, cada uma
existindo no disco; esta tabela com as quatro portas. A régua nova, contra a página de antes, acusou **seis** problemas:
os cinco nomes que o parágrafo calava e a seção que não existia. O que ela não alcança — a conta de fora, pela rede (é a
trava da rede); a biblioteca que a lista não conhece; a conta feita à mão, sem biblioteca; o cabeçalho `Authorization`
que as ferramentas usam com o token do GitHub para ler os vizinhos, que é credencial da sessão e não conta de usuário —
está dito no fim do módulo.
