# CLAUDE.md — Archilly Lab

Regras permanentes deste repositório. **Leia antes de qualquer tarefa e obedeça
em todas as sessões.**

Ao acordar: `docs/ONDE_PARAMOS.md` → `git log` → `docs/prompts/FILA.md` →
`docs/PENDENCIAS_JONNY.md`.

---

## 1 · A regra do RECADO — vale para TODA resposta

**O final de toda resposta sua para o chat é um resumo de no máximo 12 linhas,
escrito DENTRO de um bloco de código** (entre três crases), para aparecer como
caixa "Código" com botão de copiar. O formato é fixo:

```
=== RECADO PARA O CHAT — <app> · <prompt> ===
Estado: ...
Feito: ...
Achados para outros apps ou Central: ...
Depende do Jonny: ...
Próximo na fila: ...
=== FIM ===
```

**Nada depois do bloco.** Nem despedida, nem pergunta, nem link solto.

Vale para toda resposta, curta ou longa, boa notícia ou má — inclusive quando a
resposta é só "não deu". `<app>` é `Lab`; `<prompt>` é o prompt em execução
(`LAB-07`, `LAB-02`…) ou `—` quando não houver nenhum. Linha sem conteúdo leva
`—`, nunca some: o leitor precisa ver que a pergunta foi feita e a resposta foi
"nada". Doze linhas é teto, não meta.

**Por quê:** o recado é o que o Jonny cola no chat do outro app. Se ele precisar
caçar a informação na resposta longa, o recado não serve para nada.

**O mesmo recado é acrescentado a
[`docs/relatorios/RECADOS.md`](docs/relatorios/RECADOS.md)**, com a data, em
ordem cronológica. Assim "me dá tudo desde o dia tal" vira uma leitura de
arquivo, e não uma reconstrução a partir dos relatórios.

---

## 1-A · A fila é autônoma

`docs/prompts/FILA.md` é a **fila oficial**, escrita pelo chat. Este repositório
a executa **sozinho, em laço**, acordado por **um** despertador de 60 minutos
(minuto :05; o id vive em [`docs/ONDE_PARAMOS.md`](docs/ONDE_PARAMOS.md), não
aqui — id em duas terras envelhece numa delas). Regra de família: **um
despertador por aplicativo; nunca se toca no de outro repositório.**

- **Um prompt por despertador.** Se o anterior não fechou, termine-o antes de
  começar qualquer coisa nova.
- **Prompt fora da fila não existe.** O que faltar entra na fila como
  *"proposto ao chat"*, sem executar. Não ampliar escopo.
- O que depende do Jonny ou de outro repositório fica **"aguardando"**: pular
  para o seguinte e reavaliar a cada despertador.
- **Disparo sem item pronto: apagar o despertador** (D62). Vale tanto para a
  fila esgotada quanto para a fila que existe mas está toda *"aguardando"* — em
  qualquer dos dois casos, gravar o recado acumulado, escrever em `ONDE_PARAMOS`
  o motivo e **apagar o despertador**. O chat o recria quando destravar.
  Medido: dos 7 disparos do despertador de 15/09, **4 não tiveram o que fazer**.
- **O despertador nasceu sem conectores do GitHub.** Se ao acordar não houver
  `mcp__github__*`, mesclar por git direto (`git merge --no-ff` na `main`) e
  **declarar isso no relatório e no recado** (D29).

---

## 2 · O que é este repositório

Laboratório de motores de loteamento para o **Archilly Generate**. A hipótese:
motores externos podem alimentar o Generate, no todo ou em partes, atrás de um
adaptador isolado, **sempre passando pelo Validator e pelo Judge dele**.

| onde | o quê |
|---|---|
| `docs/INDEX.md` | o índice de tudo — onde está a coisa |
| `docs/ONDE_PARAMOS.md` | o estado do laboratório — comece por aqui |
| `docs/prompts/FILA.md` | o roteiro, LAB-00 em diante |
| `docs/PENDENCIAS_JONNY.md` | só o que depende de uma pessoa |
| `docs/DECISOES.md` | as decisões, numeradas, com o porquê |
| `docs/referencia/LABORATORIO.md` | a especificação (Etapas A a G) |
| `docs/relatorios/` | as medições, um arquivo por prompt |
| `docs/relatorios/RECADOS.md` | todos os recados para o chat, em ordem |
| `docs/provas/` | os números crus, em JSON |

A família: **Geo** (`urban-scout-tool`) capta o terreno · **Generate**
(`urban-create-hub-41d93a4d`) gera, valida e julga · **Laboratório de
Parcelamento** (`motor-testfit`) gera ao vivo na tela · **este Lab** testa
motores candidatos.

---

## 3 · A regra de ouro

```text
UPSTREAM              ARCHILLY               ADAPTER              ARCHILLY
(original,     ──>    (cópia de       ──>    (ponte)      ──>     GENERATE
 intocado)             trabalho)
```

1. **`upstream/` é intocável.** Cópia exata do motor original, commit e data em
   `VERSION`. Não se edita, não se aplica patch, não se "corrige".
2. **O trabalho acontece em `archilly/`**, documentado.
3. **`adapter/` é a única fronteira.** Só ele conhece detalhes do motor.
4. **O Generate nunca depende disto.** `external-engines/` inteiro pode ser
   apagado sem que ele sinta.

**Exceção medida (D16):** motor **da própria família** não ganha `upstream/`. Ele
é lido por caminho, do clone irmão, e o caminho vive num lugar só — os `paths`
do `tsconfig.json` do adaptador. Copiá-lo criaria uma segunda cópia envelhecendo
em silêncio.

---

## 4 · O que este repositório NUNCA faz

- **Não escreve em repositório vizinho.** Geo, Generate e o motor do Testfit são
  clonados **somente para leitura**. Conferir com `git status` neles ao fim de
  toda rodada, e dizer no relatório que ficou limpo.
- **O que precisa mudar no vizinho vira lista numerada em relatório**, nunca
  commit lá.
- **Não tem interface.** Prova aqui é teste, JSON e captura de plot quando
  ajudar.
- **Não reimplementa o Validator nem o Judge.** Eles são importados do Generate.
  Sem versão leve, sem limiar mais frouxo por ser de fora (D20).
- **Não conserta geometria em silêncio.** Conserto do Lab é declarado, vem
  desligado por padrão, e a medição sai nas duas passagens — com e sem.
- **Não inventa dado.** O que o motor não mede sai `null`, nunca zero. Zero é uma
  medição; `null` é "não medido" (D23).
- **Não descarta em silêncio campo que o motor publica.** Todo campo que um motor
  entrega tem destino escrito no inventário da ponte
  (`external-engines/esteira/src/inventario-das-pontes.ts`): *atravessa*,
  *traduzido*, *perda declarada* ou *mecânica interna*. A
  `guarda-da-ponte.ts` confere o inventário **contra o motor rodando**, e
  reprova em dois casos: campo da SAÍDA que sai `null` enquanto o motor publica
  valor, e campo novo do motor sem destino escrito. **O motivo de uma perda não
  mora em comentário** — comentário não se revalida, e foi assim que o Lab
  publicou `null` por três semanas e atribuiu a falta ao motor do vizinho (D98,
  D104).
- **Não decide urbanismo.** Regra urbanística é do Jonny: vira item em
  `docs/PENDENCIAS_JONNY.md`, não escolha minha.

---

## 5 · Nomes

**"Testfit" é nome interno** — repositório, código, sessão, relatório técnico.
Em texto voltado ao usuário (inclusive `docs/PENDENCIAS_JONNY.md`) ele se chama
**Laboratório de Parcelamento**.

`docs/PENDENCIAS_JONNY.md` é escrito **para leigo**: o Jonny é arquiteto e
urbanista, não programador. Item resolvido é marcado, **nunca apagado**. Dívida
técnica do código não entra ali — essa é minha.

---

## 6 · Medir antes de atribuir

A disciplina que mais rendeu até aqui, e a razão de duas conclusões erradas
terem sido desfeitas a tempo:

> **Resultado suspeito se mede antes de ter culpado.**

No LAB-07, "441 de 441 lotes sem frente" parecia defeito grave do motor; medida
a distância do lote ao eixo, era **bug do adaptador** (D18). No LAB-01, o relevo
em terraços parecia dado ruim; medido, era o **interpolador do próprio Lab**.
Nos dois casos a atribuição apressada teria virado item de conserto no
repositório errado.

Resultado desconfortável é resultado: "não consegui compilar" está registrado no
`SYMBIOS_ANALYSIS.md`, §10.

**O ponto cego tem forma, e ela se repetiu quatro vezes** — sempre *o Lab a um
passo de acusar o motor de um vizinho por um defeito do Lab*:

| quando | o que eu ia dizer | o que era |
|---|---|---|
| D18 (LAB-07) | "441 de 441 lotes sem frente" | distância medida errado pelo adaptador |
| D75 (LAB-17) | "o motor erra a classe da via desenhada" | a régua media **vértice**, não linha |
| D93/D94 (LAB-21) | "o motor entrega rampa de 161 %" | a régua media **dentro** do segmento |
| D98 (LAB-22) | "o Parcelamento não reporta o pico" | a **ponte do Lab** jogava a medição dele fora |

A quarta foi diferente das três primeiras: não houve erro de conta, houve um
**comentário envelhecendo em silêncio**. Daí a guarda do §4 — e a quarta vez
dessa forma, o `faceDeRua` do D104, **não fui eu que achei: foi ela**.

---

## 7 · Entrega

Todo prompt fecha com: relatório em `docs/relatorios/`, provas em
`docs/provas/`, decisões numeradas em `docs/DECISOES.md` com o porquê,
`docs/prompts/FILA.md`, `docs/ONDE_PARAMOS.md` e `docs/INDEX.md` atualizados,
testes verdes, e **PR mesclado na `main`**. Relatório não volta para o chat —
volta o RECADO, que também é acrescentado ao `RECADOS.md`.

Medição é **em metros** e **em dados**: JSON em `docs/provas/<prompt>/`, com
gleba, motor, semente e versão do contrato em cada arquivo, e determinismo
provado.

Duas pilhas convivem, de propósito (D14, D17): o adaptador do Symbios roda em
**Node 22+ sem dependência npm**; o do LAB-07 roda em **Bun**, porque compila
fonte TypeScript de três repositórios ao mesmo tempo.

**"Testes verdes" quer dizer os DOIS pacotes**, e o comando é um só:

```sh
./external-engines/conferir.sh
```

Ele roda `typecheck`, `lint` e `test` em `esteira` **e** em `testfit`, e falha se
qualquer um falhar. **Não é zelo:** rodando só o primeiro, a suíte do `testfit`
ficou **vermelha, 14 de 14, por duas semanas**, e dois daqueles testes eram as
travas das minhas próprias correções (D110). Suíte que ninguém roda não protege
nada — e ainda cala os alarmes que ela mesma tinha.
