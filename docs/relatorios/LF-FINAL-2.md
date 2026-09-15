# LF-FINAL-2 — A CONFERÊNCIA, SEGUNDA VOLTA

**Data:** 15/09/2026 · **Contra:** o **Padrão Archilly, Versão 1 · 13/09/2026**
**O que mudou desde a primeira:** os prompts **LAB-04** e **LAB-05** — dois
módulos de geometria novos, quatro decisões cada, e dois relatórios

---

## Veredito

> ### Conforme, com **um desvio consertado** e **um achado incômodo sobre mim mesmo**.

O desvio: um número que viaja saía arredondado **dentro do núcleo**, contra o
§9.3. Consertado neste prompt.

O achado: a regra mais visível do repositório — **o recado tem no máximo 12
linhas** — foi **quebrada em 7 dos 8 recados**. Ela estava escrita e nunca tinha
sido medida. Agora é teste.

---

## A primeira coisa a dizer, de novo: a versão 1.2 continua não existindo

Procurei outra vez nos quatro clones. Só existe a **Versão 1 · 13/09/2026**.

E há um fato novo, que a primeira conferência não tinha: a cópia que o Lab
guarda em `docs/referencia/PADRAO_ARCHILLY.md` é **byte a byte igual** à do
repositório do motor de parcelamento —

```shell
cmp -s docs/referencia/PADRAO_ARCHILLY.md \
       ../motor-testfit/docs/referencia/PADRAO_ARCHILLY.md   # iguais
```

— o que quer dizer que as duas cópias **não envelheceram em silêncio**, que era
o risco de guardar cópia. O `TF-FINAL` do repositório irmão segue travado pela
mesma razão que este: é documento que o chat ainda tem de publicar.

---

## 1 · §4 — os arquivos que todo repositório tem

| arquivo do Padrão | estado |
|---|---|
| `CLAUDE.md` | ✅ |
| `docs/ONDE_PARAMOS.md` | ✅ |
| `docs/DECISOES.md` | ✅ **58 decisões, D01 a D58, sem buraco e sem repetida** |
| `docs/INDEX.md` | ✅ e **cobre todo `.md` que existe em `docs/`** |
| `docs/PENDENCIAS_JONNY.md` | ✅ |
| `docs/ADOCAO_CENTRAL.md` | ✅ |
| `docs/SEGURANCA.md` | ✅ |
| `docs/prompts/FILA.md` | ✅ |
| `docs/relatorios/` | ✅ **um por prompt executado**, LAB-01 a LAB-08, LF-01, LF-FINAL |
| `docs/provas/` | ✅ seis, um por prompt que mediu |
| `docs/referencia/` | ✅ |
| `supabase/migrations/`, `dados/` | **não se aplica** — o Lab não tem banco nem base de domínio |

Conferido também o que costuma apodrecer sozinho:

- **links internos:** todos os links relativos de todo `.md` de `docs/` apontam
  para arquivo que existe. **Zero quebrados**, de 100 % conferidos por script;
- **a numeração das decisões:** contígua de D01 a D58, sem falta e sem repetição;
- **`docs/FILA.md`** tem duas linhas e é um **ponteiro** para
  `docs/prompts/FILA.md`, que é onde o Padrão manda a fila morar. É migalha de
  pão deixada de propósito, não duplicata.

---

## 2 · §8 e §9.4 — chaves

**Limpo**, pelo mesmo comando que o `SEGURANCA.md` publica ao lado de cada linha:

```shell
grep -rEn "\b(apiKey|api_key|API_KEY|SECRET|Bearer |Authorization|sk-[A-Za-z0-9]{20}|VITE_[A-Z_]+)\b" \
  --include=*.ts --include=*.js --include=*.json --include=*.rs .   # 0 ocorrências
find . -name ".env*" -o -name "*.pem" -o -name "*credential*"        # nada
```

Zero ocorrências, fora de `node_modules/` e de `upstream/`. Nenhum `.env`,
nenhum `.pem`, nenhum arquivo de credencial.

---

## 3 · §9.3 — núcleo em metros, formatação só na borda · **UM DESVIO, CONSERTADO**

O LF-FINAL deixou a ressalva dos 17 `toFixed`, e o chat decidiu (D47): **prosa
para pessoa é borda**. Com dois módulos novos, refiz a conta e **classifiquei
cada ocorrência**, em vez de contá-las todas juntas:

| onde | quantos | veredito |
|---|---|---|
| dentro de aviso ou erro — **prosa para pessoa** | 20 | ✅ borda, pela D47 |
| `geojson.ts` — **o formato de exportação** | 10 | ✅ borda por definição |
| o hash de determinismo (`toFixed(6)`) | 1 | ✅ declarado no próprio arquivo: `f32 → f64 → texto` varia no último bit entre plataformas |
| **dado que viaja, arredondado no núcleo** | **1** | ❌ **desvio** |

O desvio era meu, do LAB-04:

```ts
return { nos, faces, frente, avisos, confiavel, fechamento: Number(fechamento.toFixed(4)) };
```

`fechamento` **não é prosa**: é campo de dado do resultado do esqueleto, e vai
para JSON de prova. A D47 não o cobre — ela fala de texto para pessoa. Quem
publica um número é que decide com quantas casas, e o núcleo não publica.

**Consertado neste prompt:** ele sai cru, e quem o escreve arredonda. Agora são
**zero** números formatados no núcleo.

---

## 4 · §1 do CLAUDE.md — a regra do RECADO · **O ACHADO**

A regra é do chat, é permanente, e eu mesmo a escrevi no `CLAUDE.md`: **o recado
tem no máximo 12 linhas.** Nunca a tinha medido. Medida:

| recado | linhas | |
|---|---|---|
| LAB-07 | 16 | ❌ |
| LF-01 | **21** | ❌ |
| LAB-02 | 19 | ❌ |
| LAB-03 | 19 | ❌ |
| LAB-08 | 18 | ❌ |
| LF-FINAL | 19 | ❌ |
| LAB-04 | 16 | ❌ |
| **LAB-05** | **12** | ✅ |

**Sete de oito.** E nenhum por pouco — o pior, quase o dobro do teto.

O que fiz, e o que **não** fiz:

- **não reescrevi os sete.** `RECADOS.md` é o registro **do que foi enviado**.
  Encolhê-los agora faria o arquivo mentir sobre o que o chat recebeu. A tabela
  acima é o registro do desvio;
- **virou teste.** `tests/recado.test.ts` mede o **último** recado do acumulado a
  cada `bun test`. O último, e não todos, pelo mesmo motivo: o teste tem de
  impedir o próximo sem exigir lista de exceções que envelhece. O teste confere
  também que o recado abre e fecha com a marca certa e responde às cinco
  perguntas do formato.

O LAB-05 já passou porque o desvio foi pego antes do commit. É a diferença entre
uma regra escrita e uma regra medida — que é, palavra por palavra, o argumento
do §6 do Padrão aplicado contra mim.

---

## 5 · §6 — cultura de prova

A disciplina do CLAUDE.md §6 — *resultado suspeito se mede antes de ter culpado*
— rendeu mais **três** conclusões erradas desfeitas desde a primeira conferência,
somando **oito** no laboratório inteiro:

| o que parecia | o que era | onde |
|---|---|---|
| "441 de 441 lotes sem frente" — defeito grave do motor | bug do adaptador | LAB-07 (D18) |
| relevo em terraços — dado ruim | o interpolador do próprio Lab | LAB-01 |
| "o recorte destrói a conectividade" — 472 componentes | a **régua** unia só as pontas | LAB-02 |
| "a rampa piorou de 10 % para 35 % com o corte" | aquela aresta sempre teve 35 %; mudou de balde | LAB-02 |
| determinismo falhou | comparava 20 variantes com 3 | LAB-08 |
| "369 de 369 lotes com via por cima" | a borda da quadra é o **eixo**, não o meio-fio | LAB-04 (D52) |
| "`geo-antonina` fragmenta a 70,4 %" — defeito do corte | uma **APP hídrica** corta a gleba em duas | LAB-05 (D58) |
| 8 quadras fora da gleba depois do recorte | a **régua** do "atravessa" nunca amostrava o vértice | LAB-05 (D55) |

Os três últimos são dos dois prompts novos. Nos três, a atribuição apressada
teria virado item de conserto no repositório errado — ou, no caso da APP, numa
regra de urbanismo inventada por mim.

---

## 6 · §9.8 — todo prompt fecha mesclado na main

✅ **Os quatorze PR estão na `main`.** LAB-00 (#1, #2), LAB-01 (#3), LAB-07 (#4),
a regra do recado (#5), LF-01 (#6, #7, #8), LAB-02 (#9), LAB-03 (#10), LAB-08
(#11), LF-FINAL (#12), LAB-04 (#13), LAB-05 (#14).

Testes verdes e `ONDE_PARAMOS` atualizado em todos — é o que o despertador da
fila exige a cada rodada, e o que o relatório de cada prompt registra.

---

## 7 · §9.1 e §9.2 — uma mão por repositório, e nada de escrever no vizinho

✅ **Zero alterações** em `motor-testfit`, `urban-create-hub-41d93a4d` e
`urban-scout-tool`, conferido com `git status` nos três.

E uma conferência que a primeira volta não fez: **de quem são os commits dos
vizinhos**. `motor-testfit` tem 14 commits desde 13/09 — todos da **própria
sessão dele**, no branch `claude/upbeat-fermi-t1rp11`, mesclados pelo Jonny.
**Nenhum desta sessão.** O único toque foi o `git merge --ff-only origin/main` no
clone local, para medir o T02 (D40).

✅ **`external-engines/symbios/upstream/` intocado:** um único commit na história
o tocou, o do LAB-00 que o criou.

---

## 8 · O que esta rodada mexeu

| arquivo | o quê |
|---|---|
| `external-engines/esteira/src/esqueleto/esqueleto.ts` | `fechamento` sai cru — o desvio do §9.3 |
| `external-engines/esteira/tests/recado.test.ts` | **novo** — a regra do recado virou teste (a esteira vai a 67) |
| `docs/relatorios/LF-FINAL-2.md` | este relatório |
| `docs/DECISOES.md` | D59 e D60 |
| `docs/prompts/FILA.md`, `docs/ONDE_PARAMOS.md`, `docs/INDEX.md` | a fila esgotada |
| `docs/SEGURANCA.md` | a reconferência, e duas linhas novas |

**Testes:** 67 verdes na esteira (3 novos) e 14 no adaptador do motor de
parcelamento; `tsc --noEmit` e `eslint` limpos nos dois.

**Nenhuma medição foi refeita** e nenhum número publicado mudou: o conserto do
§9.3 tira casas decimais de um campo que só as ferramentas publicavam, e elas já
o arredondavam por conta.

---

## 9 · A fila acabou — de novo

Os três prompts da fila de 15/09 — LAB-04, LAB-05 e este — estão mesclados. O
despertador é apagado, como a própria fila manda.

**O que fica esperando o chat**, tudo em [`../prompts/FILA.md`](../prompts/FILA.md):

1. **o delta contra o Padrão 1.2**, quando ele existir;
2. **as 4 violações** que sobraram em `geo-antonina` — suspeita escrita, **não
   medida**;
3. **as 96 quadras de esqueleto não confiável** — forma degenerada ou limite da
   esteira?
4. **a quadra dentro de APP** — o recorte do LAB-05 é pela divisa.

**E um item do Jonny, novo:** a gleba de Antonina é cortada em duas por um curso
d'água. **Pode haver travessia?** Está em
[`../PENDENCIAS_JONNY.md`](../PENDENCIAS_JONNY.md), escrito para leigo.
