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
| Nenhuma chave sensível no repositório | ✅ **limpo** | `grep -rE "\b(apiKey\|api_key\|API_KEY\|SECRET\|Bearer \|Authorization\|sk-[A-Za-z0-9]{20}\|VITE_[A-Z_]+)\b"` sobre todo `.ts`, `.js`, `.json` e `.rs` fora de `node_modules` e de `upstream/` — **zero ocorrências** |
| Nenhuma chave em `VITE_` | ✅ **não se aplica, e está limpo** | não há build de navegador neste repositório; e a busca acima cobre `VITE_` |
| Nenhum `.env`, `.pem` ou arquivo de credencial | ✅ **limpo** | `find . -name ".env*" -o -name "*.pem" -o -name "*credential*"` — **nada** |
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
| Entrada validada antes de entrar no núcleo | ✅ | versão do contrato, unidade (metro) e anel com ao menos 3 pontos são recusados com mensagem legível — `ida.ts` e `gleba-v1.ts`, com teste |

## Os repositórios vizinhos

| item | estado | como foi conferido |
|---|---|---|
| Geo, Generate e o motor de parcelamento são **só leitura** | ✅ | `git status` nos três ao fim de **toda** rodada, e o número sai no relatório. Em 14/09, ao fim do LAB-08: **0 alterações** em cada |
| Nenhum commit, nenhum push nos vizinhos | ✅ | o histórico deles não tem commit desta sessão. O único toque foi `git merge --ff-only origin/main` no clone local do motor, para medir o T02 (D40) |
| O que precisa mudar neles vira **lista em relatório** | ✅ | LAB-07 §9 (8 correções), LAB-02 §5, LAB-03 e LAB-08 — todos com o número e sem commit lá |

## Integridade do que foi copiado

| item | estado | como foi conferido |
|---|---|---|
| `external-engines/symbios/upstream/` byte a byte igual ao commit declarado | ✅ | `cmp` arquivo a arquivo contra `c3f287556b98cc616d4263d163e6643ae32111ff`, no LAB-00 |
| Licença do upstream preservada | ✅ | `upstream/LICENSE` (MIT, `Copyright (c) 2026 TheJanusStream`) intocado |
| Nenhum motor copiado para fora de `upstream/` | ✅ | `external-engines/testfit/` e `external-engines/esteira/` não contêm código de motor — só a ponte (D16) |

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
| Os commits dos clones vizinhos são **deles**, não meus | ✅ | `git -C <clone> log --since=2026-09-13 --format="%an"` — os 14 commits de `motor-testfit` são da sessão dele, no branch `claude/upbeat-fermi-t1rp11`, mesclados pelo Jonny. **Nenhum desta sessão** |
| `external-engines/symbios/upstream/` nunca foi tocado depois de criado | ✅ | `git log --oneline -- external-engines/symbios/upstream/` — **um commit**, o do LAB-00 que o criou |

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
