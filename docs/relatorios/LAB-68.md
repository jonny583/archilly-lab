# LAB-68 · item 001 — o verde que fica vermelho, e de quem ele era

**09/10/2026** · item 001 da caixa de entrada · `claude/stoic-ritchie-ijzqy3`
**Conferido AQUI, não no GitHub** · verde `exit 0`, 658 + 17 travas.

---

## 1 · A resposta, em cinco linhas

| | |
|---|---|
| **as duas pilhas** | das 11 falhas, **UMA** muda com o commit do vizinho. **Dez eram daqui** |
| **a D223** | acertou o veredicto e **errou a causa** — e a causa é o que saiu no recado e no PR #90 (D224) |
| **o pior achado de método** | eu comparei uma **constante** em quatro commits do motor e chamei de medição (D225) |
| **o carimbo** | commit de cada clone **e o chão** (Bun), com quatro veredictos que **dizem** em vez de reprovar |
| **o verde** | `exit 0`, pela primeira vez desde o reinício do contêiner |

---

## 2 · As duas pilhas, separadas RODANDO

O item pedia: *"não deduza pelo nome do arquivo — rode."*

### Muda com o commit do vizinho: UMA de onze

`contrato-v2 · o Parcelamento REPORTA o pico`. Medido o valor **vivo**, com tudo o mais segurado:

```
motor@e793f79 (19/09) ... 109,51 %
motor@21e69c2 (05/10) ... 175,51 %
motor@6cf6396 (07/10) ... 175,51 %
```

**O motor andou entre 19/09 e 05/10.** A trava exigia `< 30 %`, afirmando que *"o Parcelamento
SUBESTIMA"* (D99) — e reprova nos **três**, o que quer dizer que o limiar é anterior a todos
eles. Afirmar 30 % é afirmar uma propriedade do vizinho que deixou de valer, e **quem mede é
quem conserta**: vai como pedido ao Parcelamento, não como conserto meu. A trava passa a
**dizer**, com os três números, e o piso que fica é o que não depende da calibração dele.

### Não muda: dez de onze, e todas daqui

| quantas | o que era | conserto |
|---|---|---|
| **9** | o **`.wasm` ausente** — artefato de build deste repositório, não versionado de propósito, apagado pelo reinício do contêiner | compilado, 14,23 s, com a receita que o próprio `conferir.sh` imprime |
| **2** | `plano[].travessias` e `plano[].indicadores`: **campo novo do motor sem destino escrito** na ponte, largados em silêncio — violação da §4 | destino escrito como **perda declarada**: procurado `travessia` e `indicador` no contrato do Generate, as únicas citações são da **ENTRADA**, nunca da saída |
| **1** | a minha trava do LAB-67 **casando consigo mesma**: o padrão procurava `PedidoIA`/`new OpenAI` no texto, e o fonte dela carrega esses nomes | passou a procurar no **import** e na **chamada** (D142); o fonte da régua saiu do escopo (D155) |
| **1** | prova publicada velha: rampa de `ensaio-com-via`, **17,92 % publicado contra 21,63 % medido** | `bun run lab23`, com o diff dos 11 campos registrado |

---

## 3 · A D223 errou a causa, e a causa é o que saiu (D224)

Eu publiquei *"os clones vizinhos foram recriados em commits mais novos e o verde ficou
vermelho"* — no recado do LAB-67, no PR #90 e no `ONDE_PARAMOS`. **Dez das onze eram daqui.**

**O que deixou passar:** eu rodei `bun test`, não `./external-engines/conferir.sh`. O comando
único tem a **precondição do `.wasm`** e teria dito, na primeira linha, que o artefato não
existe (D124).

> A regra do §7 — *"verde é UM comando"* — não é sobre conforto: **é sobre o comando saber
> coisas que o atalho não sabe.**

---

## 4 · O achado de método, e é o mais caro (D225)

Para separar as pilhas, movi o motor em quatro commits e reli o número. Em dois casos eu li a
linha `Received:` — e `Received:` era **o valor lido da prova publicada**, não a medição.

> **Constante não muda quando o motor muda.** Conclusão falsa: *"invariante em quatro commits,
> logo não é o clone."*

Refeita a conta lendo o valor **vivo**, o mesmo experimento devolveu 109,51 % contra 175,51 %.

> **Experimento que não consegue dar outro resultado não é experimento.** Antes de concluir
> *"invariante"*, pergunte o que teria de acontecer para o número mudar — e se a resposta for
> "nada", você mediu um literal.

---

## 5 · O carimbo, e ele DIZ em vez de reprovar

`external-engines/esteira/src/commit-dos-vizinhos.ts`. Quatro veredictos fechados:

| veredicto | quer dizer |
|---|---|
| `igual` | a prova foi medida contra este commit; o número vale |
| `mudou` | o vizinho andou — informação, **não** falha desta casa |
| `nao-gravado` | prova anterior ao carimbo: **não medido**, e não "igual" |
| `clone-ausente` | o clone não está nesta máquina |

**Reprovar trataria *"o motor andou"* como defeito meu**, que é a confusão que o item veio
desfazer. E **`nao-gravado` não é `igual`**: zero é uma medição, nulo é "não medi" (D23).

**E o carimbo ganhou o CHÃO**, que é a variável que me faltou o dia inteiro: o contêiner trocou
o **Bun de 1.3.11 para 1.4.2** ao reiniciar. Carimbar só os clones responderia *"o motor
andou?"* e continuaria sem responder *"e o chão?"*.

### Os dois lados, demonstrados contra o clone de verdade

| lado | como | resultado |
|---|---|---|
| **o caso bom** | carimbo igual ao `HEAD` do `motor-testfit` nesta máquina | `igual` |
| **o caso ruim** | carimbo de `HEAD~1` — um commit que **existe** no histórico e não é o `HEAD` | `mudou`, nomeando os dois |

`tests/commit-dos-vizinhos.test.ts`, **8 travas**, contra o clone real e **não** contra fixture —
inventar um sha seria demonstrar contra um caso que não acontece.

---

## 6 · Os dois consertos que não estavam na conta

**`ida.ts:435` — o `legais` do motor ganhou quatro campos** e o typecheck quebrou. Eu cheguei a
entregar os três que o contrato declara e **medi o efeito**: a rampa publicada **mudou**. O motor
**ganhou a capacidade** que esta ponte declara como perda (*"o motor não limita rampa de via — ele
não calcula greide"*). Entregar muda o desenho, e isso é **prompt**, não conserto de typecheck
(D226). Os quatro saem `null` — *não entregue* —, e **três perdas declaradas desta ponte ficam
sob suspeita de estarem velhas**.

**A trava do LAB-40 afirmava o que o próprio comentário dela nega** (D227): o total de lotes.
Medido, 449 → 492, +43: a direção virou. O total passa a ser **medido**, não afirmado; fica
afirmado o que se sustentou nas três amostragens — a **FRENTE**.

---

## 7 · O que NÃO foi feito

- **provas antigas não foram carimbadas retroativamente** — carimbá-las exigiria regerá-las, e o
  **D182** proíbe sobregravar prova *"antes"* com prova *"depois"*. Elas saem `nao-gravado`;
- **nada foi escrito em repositório vizinho.** Os clones foram movidos em `git checkout` para a
  medição e **devolvidos ao `HEAD`**; `git status` nos três: **0 alterações**;
- **o CI continua desligado**, gatilho comentado e rotina `disabled_manually`, até 1º/11.

## 8 · O verde

```
VERDE — 7 passos · exit 0 · 658 (esteira) + 17 (testfit) travas
conferido AQUI, não no GitHub
clones: motor-testfit@6cf6396 · urban-create-hub@72cfab0 · urban-scout-tool@550a438
chão:   Bun 1.4.2 (era 1.3.11 antes do reinício)
vizinhos: 0 alterações nos três
```
