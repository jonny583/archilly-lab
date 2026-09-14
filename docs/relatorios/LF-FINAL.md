# LF-FINAL — CONFERÊNCIA CONTRA O PADRÃO ARCHILLY

**Data:** 14/09/2026 · **Referência conferida:** `PADRAO_ARCHILLY.md`,
**Versão 1 · 13/09/2026** — cópia trazida para
[`../referencia/PADRAO_ARCHILLY.md`](../referencia/PADRAO_ARCHILLY.md)

---

## A primeira coisa a dizer: a versão 1.2 não existe

O prompt pede *"conferência contra o Padrão 1.2"*. **Não há Padrão 1.2 em
nenhum repositório que eu possa ler.** Procurei:

| onde | o que achei |
|---|---|
| `motor-testfit/docs/referencia/PADRAO_ARCHILLY.md` | **Versão 1 · 13/09/2026** — a única que existe |
| `urban-create-hub-41d93a4d/` | três documentos de padrão temáticos (Design Centralizado, Contas, Segurança), nenhum numerado 1.2 |
| `urban-scout-tool/` | nada |
| busca por `Padrão 1.2` / `Versão 1.2` em todo `.md` dos quatro clones | **só as menções na própria fila** — a deste repositório e a do `TF-FINAL` do motor de parcelamento, que está travado pela mesma razão |

**O que fiz:** a conferência inteira contra a **Versão 1**, que é o que existe, e
esta seção declarando a lacuna. Trocar a referência em silêncio seria pior do
que não conferir.

**O que fica pendente:** quando a 1.2 for publicada, o delta contra ela. É item
para o chat — o repositório irmão precisa da mesma coisa.

---

## Veredito

> ### Conforme, com **uma ressalva declarada** e **três arquivos que faltavam**.

Os três arquivos foram escritos nesta rodada. A ressalva é de interpretação e
fica para o chat decidir se aperta.

| seção do Padrão | estado |
|---|---|
| §4 · os arquivos que todo repositório tem | **era 8 de 13; ficou 11 de 13**, e os 2 restantes não se aplicam |
| §5 · formato dos prompts | **conforme** |
| §6 · cultura de prova | **conforme, e é o ponto mais forte** |
| §7 · UX da família | **não se aplica** — o Lab não tem tela, por regra |
| §8 · segurança e banco | **conforme** — ver `SEGURANCA.md`, com os comandos |
| §9 · o que nunca muda | **7 de 8 conformes, 1 com ressalva** (§9.3) |

---

## 1 · §4 — os arquivos que todo repositório tem

| arquivo | antes | agora |
|---|---|---|
| `CLAUDE.md` | ✅ | ✅ |
| `docs/ONDE_PARAMOS.md` | ✅ | ✅ reescrito |
| `docs/DECISOES.md` | ✅ 42 decisões | ✅ |
| `docs/INDEX.md` | ✅ | ✅ reescrito |
| `docs/PENDENCIAS_JONNY.md` | ✅ | ✅ **refeito do zero** |
| `docs/ADOCAO_CENTRAL.md` | ❌ **faltava** | ✅ **escrito** |
| `docs/SEGURANCA.md` | ❌ **faltava** | ✅ **escrito** |
| `docs/prompts/FILA.md` | ✅ | ✅ |
| `docs/relatorios/` | ✅ 8 relatórios | ✅ |
| `docs/provas/` | ✅ | ✅ |
| `docs/referencia/` | ❌ **faltava** | ✅ **criada** |
| `supabase/migrations/` | — | **não se aplica**: não há banco |
| `dados/` | — | **não se aplica**: não há base de domínio |

**`docs/referencia/`** recebeu o que já era material de origem e estava no lugar
errado: `LABORATORIO.md`, a especificação do laboratório como ela chegou, saiu
de `docs/` e foi para lá. Os cinco links que apontavam para o caminho antigo
foram corrigidos. Junto veio a cópia do Padrão contra o qual esta conferência
foi feita, para que ela seja auditável daqui a meses sem depender de outro
repositório estar por perto.

**`ADOCAO_CENTRAL.md`** responde "não adota, e por quê", item a item — não há
conta, não há tela, não há chamada de IA. É ausência por definição, não por
esquecimento, e o arquivo diz o que mudaria se um dia deixasse de ser.

**`SEGURANCA.md`** traz a lista preenchida **com o comando ao lado de cada
linha**, para a conferência poder ser refeita por quem quiser.

---

## 2 · §8 e §9.4 — chaves

```sh
grep -rE "\b(apiKey|api_key|API_KEY|SECRET|Bearer |Authorization|sk-[A-Za-z0-9]{20}|VITE_[A-Z_]+)\b" \
  --include=*.ts --include=*.js --include=*.json --include=*.rs .
# → zero ocorrências (fora de node_modules e upstream/)

find . -name ".env*" -o -name "*.pem" -o -name "*credential*"
# → nada
```

**Limpo.** E é limpo pelo caminho curto: o Lab não chama IA, não chama rede e
não tem banco. Detalhe em `SEGURANCA.md`.

> Uma nota de método: a primeira busca que rodei usava `-i` e a palavra `senha`,
> e acusou quatro "ocorrências". Eram todas a palavra **de-senha-r**. Refiz com
> palavra inteira antes de escrever qualquer coisa aqui.

---

## 3 · §9.3 — núcleo em metros, formatação só na borda

**A ressalva desta conferência.**

### O que está certo

**Nenhum número que viaja é formatado.** Todo campo do contrato, toda medição em
JSON e toda coordenada saem como número em metro, sem arredondamento de
apresentação. Os `toFixed` do `geojson.ts` — que é a borda por definição — são
todos `Number(x.toFixed(n))`: **arredondamento numérico**, não texto.

E o `const n = (v: number) => v.toFixed(6)` de `index.ts` não é formatação: é a
canonização das coordenadas para o hash de determinismo, deliberada e
documentada no LAB-01.

### O que é a ressalva

**17 ocorrências de `toFixed` dentro do núcleo produzem texto** — todas em
**prosa para pessoa**: mensagens de aviso, mensagens de erro e o campo
`oQueHavia` das perdas declaradas. Exemplos:

```ts
// symbios/adapter/src/index.ts:120
`a área do polígono projetado (${areaGleba.toFixed(0)} m²) difere ` +
`${(erro * 100).toFixed(1)} % da declarada pelo Geo`

// testfit/adapter/src/volta.ts:137
oQueHavia: `calçadas declaradas que somam ${calcadaDeclarada.toFixed(0)} m² de terra`
```

| arquivo | ocorrências |
|---|---|
| `symbios/adapter/src/index.ts` | 8 (avisos e mensagens de erro) |
| `testfit/adapter/src/volta.ts` | 4 (`Perda.oQueHavia`) |
| `testfit/adapter/src/ida.ts` | 3 (`Perda.oQueHavia`) |
| `esteira/src/symbios-para-contrato.ts` | 1 (`Perda.oQueHavia`) |
| `symbios/adapter/src/index.ts:477` | 1 — **canonização de hash, não formatação** |

### A leitura, e o que ela não é

O risco que a regra existe para evitar — **um número perder precisão no caminho
e a tela herdar o arredondamento** — não corre aqui: o dado e a prosa são
campos diferentes, e o dado está cru.

Mas a letra da regra diz *"formatação só na borda"*, e o núcleo está compondo
texto. **Tirar o `toFixed` da prosa pioraria a prosa** — *"a área difere
14.328571428571429 %"* não ajuda ninguém.

**Não consertei, e não é omissão:** é pergunta de interpretação, e interpretação
do Padrão é do chat. Fica como **proposto ao chat** na fila. Se a resposta for
"aperta", o conserto é mecânico e cabe num prompt curto.

---

## 4 · §6 — cultura de prova

É onde o repositório está mais forte, e não por opinião:

| o que o Padrão pede | o que existe |
|---|---|
| nada dado como certo sem prova | 8 relatórios, cada um com JSON cru em `docs/provas/` |
| gerar a saída atual e comparar antes de trocar | o LAB-02 e o LAB-03 publicam **antes e depois** lado a lado; o LAB-08 compara T00-A com T02 |
| diferença inesperada é erro até prova em contrário | **cinco conclusões erradas desfeitas por medir o "antes"** — ver abaixo |
| testes de fronteira | chave: conferida (§2). Determinismo: 3 testes. Formatação: conferida (§3) |
| desempenho medido e registrado | tempo por gleba em todos os relatórios desde o LAB-01 |
| defeito próprio conserta na raiz e registra, sem se culpar | os cinco abaixo, todos registrados no relatório onde apareceram |

### As cinco conclusões erradas que a disciplina pegou

1. **LAB-01** — o relevo em terraços parecia dado ruim; medido, era o
   interpolador do próprio Lab.
2. **LAB-07** — "441 de 441 lotes sem frente" parecia defeito grave do motor;
   medida a distância do lote ao eixo, era bug do adaptador (D18).
3. **LAB-02** — "o recorte destrói a conectividade" (290 componentes); a rede
   **crua** dava 472 pela mesma régua, que estava errada.
4. **LAB-02** — "a rampa ao longo da via piorou de 10,01 % para 34,98 %"; a
   aresta sempre teve 34,98 % e só mudou de balde.
5. **LAB-08** — "determinismo FALHOU"; eu comparava uma rodada de 20 variantes
   com uma de 3.

**Nenhuma das cinco foi corrigida em silêncio.** Todas estão no relatório onde
apareceram, com o número errado, o certo e a causa.

---

## 5 · §5 e §9.8 — formato e fechamento dos prompts

| o que o Padrão pede | estado |
|---|---|
| prompt `.txt` autocontido, com a frase padrão | ✅ — foi assim que LAB-00, LAB-01, LAB-07 e a fila autônoma chegaram |
| o Code decide a ordem, investiga, registra decisões numeradas, roda em laço, abre PR e mescla | ✅ — 11 PRs, todos mesclados |
| **nunca devolve relatório para o chat** | ✅ — volta o RECADO (`CLAUDE.md` §1), e o relatório fica no repositório |
| termina mesclado na `main`, testes verdes, `ONDE_PARAMOS` atualizado | ✅ — em todos |

---

## 6 · §9 — o que nunca muda

| # | regra | estado |
|---|---|---|
| 1 | uma mão por repositório | ✅ — um despertador, uma sessão |
| 2 | a Central é a portaria, nunca hospeda banco de outro app | ✅ não se aplica — sem banco (`ADOCAO_CENTRAL.md`) |
| 3 | núcleo em metros, formatação só na borda | ⚠️ **ressalva declarada** — §3 |
| 4 | chave de IA só no servidor da Central | ✅ — não há chave nenhuma (§2) |
| 5 | nada de exportar o motor ou o código ao usuário | ✅ não se aplica — não há usuário |
| 6 | prova antes de afirmar | ✅ — §4 |
| 7 | decisão registrada com o motivo | ✅ — 42 decisões, D01 a D42 |
| 8 | prompt termina mesclado, verde, com `ONDE_PARAMOS` atualizado | ✅ — 11 PRs |

---

## 7 · O que esta rodada mexeu

- **Escreveu:** `docs/SEGURANCA.md`, `docs/ADOCAO_CENTRAL.md`,
  `docs/referencia/` (com a especificação movida e a cópia do Padrão).
- **Reescreveu:** `docs/INDEX.md`, `docs/ONDE_PARAMOS.md`, e
  `docs/PENDENCIAS_JONNY.md` **do zero**.
- **Não mexeu em código.** Nenhum arquivo `.ts` mudou; os testes rodam para
  provar isso.

```
esteira:  bun test  27 pass · 0 fail
testfit:  bun test  14 pass · 0 fail
tsc --noEmit  limpo nos dois · eslint .  limpo nos dois
```

---

## 8 · A fila acabou

O LF-FINAL era o último item. Com ele mesclado, **a fila autônoma está
esgotada** e o despertador de 60 minutos é apagado, como a própria fila manda.

O que fica esperando o chat, e está em `prompts/FILA.md` como *proposto*:

1. **O delta contra o Padrão 1.2**, quando ele existir.
2. **A ressalva do §9.3** — prosa formatada no núcleo conta como violação?
3. **LAB-04 · straight skeleton** — o LAB-08 mostrou que virou o próximo passo
   óbvio do Symbios: ele entrega 94 e 698 quadras limpas, e o que falta para
   disputar o Judge é subdividir quadra em lote.
4. **Reconectar a rede depois do corte** — `geo-antonina` fragmenta a 70,4 %.
5. **Recortar a quadra que atravessa a divisa**, e **descartar lasca de corte**.
