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
| Nada de rede em execução | ✅ | o adaptador do Symbios roda com **zero dependência npm**; os outros dois leem arquivo local e código dos clones irmãos. Nenhum `fetch`, nenhum `http` |
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
