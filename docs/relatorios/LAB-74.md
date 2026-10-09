# LAB-74 · item 007 — o disco não é a origem, e por LUGAR em vez de por frase

**09/10/2026** · item 007 da caixa de entrada · `claude/stoic-ritchie-ijzqy3`

**O pedido:** duas ocorrências da mesma família na mesma tarde, em dois repositórios da família —
*"o que está no disco não é o que está na origem"* —, mais a correção da Central sobre varrer por
**lugar** e não por frase. E o aviso de que o item da RLS tem prioridade.

---

## 1 · A resposta, em quatro linhas

| | |
|---|---|
| **o defeito é meu também, medido** | publiquei o `HEAD` do **disco** como *"o estado do vizinho"* em **seis recados**, com os clones **18 a 25 commits atrás** (D241) |
| **o conserto** | o carimbo ganhou um **segundo eixo** — disco contra origem —, com quatro veredictos que **dizem** e **não puxam nada** |
| **por lugar** | **21** condições de retorno em **7** lugares; a varredura de frase alcançava **15**, e **zero** são conta (D242) |
| **o item da RLS** | **não existe nesta caixa** — conferido na `origin/main`, não no disco |

---

## 2 · O defeito do item aconteceu aqui, e seis vezes

Todo recado meu fecha com *"Clones: motor-testfit@6cf6396, urban-create-hub@72cfab0,
urban-scout-tool@550a438, os três com 0 alterações"*. Isso é `git -C <clone> rev-parse HEAD` — **o
disco**. Rodado `git fetch` nos três:

| clone | o disco diz | a `origin/main` diz | atrás por |
|---|---|---|---|
| `motor-testfit` | `6cf6396` | `e4db59d` | **25** |
| `urban-create-hub-41d93a4d` | `72cfab0` | `70ae70d` | **18** |
| `urban-scout-tool` | `550a438` | `b664a01` | **23** |

**O hash sempre esteve escrito** — ninguém foi enganado sobre *qual* commit. Mas **ninguém tinha
como saber que ele estava 25 atrás**, e a frase *"os três com 0 alterações"* parecia garantir que
estava tudo em ordem. *Árvore limpa quer dizer "eu não mexi", não "está atual".*

**E o motor andou durante esta rodada:** o primeiro `fetch`, minutos antes, deu **23**; o segundo,
**25**. *Hash de disco publicado como estado do vizinho envelhece enquanto o recado está sendo
escrito.*

---

## 3 · O conserto: um SEGUNDO EIXO, que diz e não puxa

O carimbo do item 001 comparava **a prova** com **o disco** (`igual`, `mudou`, `nao-gravado`,
`clone-ausente`). Faltava a outra pergunta. Agora há `conferirContraAOrigem`, com quatro
veredictos fechados:

| veredicto | quer dizer |
|---|---|
| `em-dia` | o disco é a `origin/main` — distância **zero** |
| `atras` | o disco está **N commits atrás**, e **o número vai na frase** |
| `a-frente` | há commit aqui que não está lá — estranho num clone só de leitura |
| `origem-desconhecida` | **sem `git fetch` não há origem** — e não medido **não é** em dia (D23) |

**O que ele deliberadamente NÃO faz:**

- **não reprova** — o vizinho andar não é defeito desta casa, a mesma razão do primeiro eixo;
- **não PUXA nada.** Atualizar os clones mudaria **toda** medição daqui, e isso é prompt, não
  conserto silencioso (D226);
- **o `fetch` é leitura:** mexe só nas referências locais do clone. Nenhum arquivo rastreado muda,
  o `git status` dos três continua **limpo**, e a §4 segue respeitada.

**Daqui em diante o recado publica os dois:** `repo@disco` **e** `origin/main@X, atrás N`.

---

## 4 · Por LUGAR: 21 condições em 7 lugares, e a frase alcançava 15 (D242)

No item 006, há uma hora, eu varri **por frase** e publiquei *"zero de quinze"*. As quinze eram as
etiquetas declaradas de **um** lugar. Lidos os **sete**:

| lugar | o que está parado | a condição | tipo | é conta? |
|---|---|---|---|---|
| `docs/COMO_RELIGAR_O_CI.md` | a execução automática do CI | a cota zera em **1º/11/2026** | data | não |
| `symbios/adapter/src/recorte.ts` | os consertos do LAB-05 | **desligados por padrão**, §4 | método | não |
| `docs/prompts/FILA.md` | as **15** propostas e itens abertos | pessoa, repositório, prompt, medição, MVP | pessoa | não |
| `docs/PENDENCIAS_JONNY.md` | a obra do recorte de fonte paga | *"quando houver a primeira fonte paga"* | evento | não |
| `docs/relatorios/BALANCOS.md` | a corda reta das vias curvas | **adiada para a V3** | marco | não |
| `CLAUDE.md` | o kit do Padrão Archilly | *"quando chegar, é outro item"* | evento | não |
| `caixa-de-entrada/COMO_FUNCIONA.md` | o que vai para ramo | o ramo espera **a pergunta** dele | pessoa | não |

```
condições que existem ....................... 21
a varredura de FRASE alcançava .............. 15   (um lugar)
só o LUGAR mostrou ..........................  6
são uma CONTA ............................... ZERO, as 21
```

> **O veredicto sobreviveu e a cobertura não.** *O meu "zero" estava certo por não haver nenhuma
> conta, não por a varredura alcançar* — e **nenhuma** das palavras que eu procurei aparece em
> **nenhuma** das seis que faltavam.

**E a mais incômoda das seis é minha, de uma hora atrás:** *"só vale a pena quando houver a
primeira fonte paga"*, que eu escrevi na página do Jonny **no item 006**, no mesmo prompt em que
declarei zero condições. *A varredura de frase não vê o que ela mesma acabou de escrever.*

**A lista dos sete lugares está escrita** em `src/lugares-das-condicoes.ts`, *"para quem vier
depois saber onde você olhou"*, com guarda: cada lugar tem de existir e continuar trazendo a sua
marca, e condição de **conta** reprova.

---

## 5 · E a marca de um lugar quebrou na primeira execução — por quebra de linha

A marca do `COMO_FUNCIONA.md` era *"se chama pela pergunta que ele espera"*, e o arquivo quebra a
linha entre `se` e `chama`. A régua acusou *"a lista envelheceu"* quando o que mudou foi a
**largura da coluna**.

> *Marca literal escolhida de um texto formatado mede a quebra de linha junto com o conteúdo* —
> a mesma família do D137, e a razão de a marca ser agora um pedaço que cabe numa linha só.

---

## 6 · O item da RLS NÃO existe nesta caixa — conferido na origem

O item 007 diz: *"se você ainda não fez o item da RLS, ele é o mais sério de hoje… ele já está na
sua caixa"*. **Não está.** Conferido com `git ls-tree origin/main docs/caixa-de-entrada/` — **na
origem, não no disco**, que é exatamente a disciplina que o item veio ensinar:

```
001-FEITO · 002-FEITO · 003-FEITO · 004-FEITO · 005-FEITO · 006-FEITO · 007 · COMO_FUNCIONA
```

Sete itens, seis feitos, e **nenhum de RLS**. Pode ser item de outro aplicativo da família, ou
pode ter faltado escrever — e **eu não invento item que não está na caixa** (§1-A). Se ele era
para cá, basta escrever o `008`.

## 7 · O critério do teto DISPAROU, e eu consertei metade (D243)

No item 006 eu dei um **critério** ao teto da lista nominal da varredura de custo: *"se ele subir
sem que uma regra nova tenha sido escrita, o que está errado é o DESENHO da lista, não o número."*

**Ele disparou um prompt depois.** O teto foi de **9 para 11**, e as duas entradas novas são os
relatórios `LAB-73.md` e `LAB-74.md` — **documentação sobre a regra, não regra nova**.

**O que consertei, por sinal estrutural:** a régua das *condições de conta* passou a pular **linha
de citação** (`^>`), e isso dispensou **duas** entradas de lista **sem nome de arquivo nenhum** —
as duas eram a **mesma frase da Central**, citada no `DECISOES.md` e no item 007.

> *Sinal estrutural no lugar de nome na lista.* **Reportar a frase de outro não é assumir a
> condição.**

**O que sobrou** são relatórios que citam a frase em **tabela e prosa própria**, não em citação — a
mesma classe que faz a lista do custo crescer. **O conserto disso é mudança de modelo** (escopar
por **destino**: varrer com rigor o que pode chegar a um usuário, e dar ao registro uma
conferência própria), **e não foi feito**: a §1-A proíbe ampliar escopo, e está na `FILA.md` como
proposta ao chat, com a medição.

*Critério que dispara e é ignorado vira teto sem critério — e aí ele era só um número desde o
começo.*

## 8 · O que NÃO foi feito

- **nenhum clone foi atualizado** — o número fica dito; puxar mudaria toda medição e é decisão do
  chat;
- **nada foi escrito em repositório vizinho.** O `git fetch` mexe só nas referências locais, e os
  três seguem com **0 alterações**;
- **nenhum item foi inventado** para a RLS;
- **o CI não foi religado**, segue `disabled_manually` até 1º/11. **Verde conferido aqui, não no
  GitHub;**
- **não há prova nova em `docs/provas/`**: a medição deste item entrou no carimbo do
  `docs/provas/LAB-68/as-duas-pilhas.json`, que é onde o carimbo mora, e o resto é suíte.

## 9 · O verde

**`./external-engines/conferir.sh` · `exit 0` · 7 passos · 725 travas na esteira + 17 no
testfit.** A trava nova entrou também no `guardas-sem-clones` do CI, que vai de **325 para 336**.
**Conferido aqui, não no GitHub** — e agora com a ressalva que faltava: *o verde é contra os
commits do DISCO dos vizinhos, que estão 18 a 25 atrás da origem.*

## 10 · Os clones vizinhos ficaram limpos — e agora com os DOIS números

| clone | disco | origem | estado |
|---|---|---|---|
| `motor-testfit` | `6cf6396` | `e4db59d` | **25 atrás** · 0 alterações |
| `urban-create-hub-41d93a4d` | `72cfab0` | `70ae70d` | **18 atrás** · 0 alterações |
| `urban-scout-tool` | `550a438` | `b664a01` | **23 atrás** · 0 alterações |
