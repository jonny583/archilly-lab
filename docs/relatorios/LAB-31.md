# LAB-31 · "Verde" é um comando só — e ele reprova, provado por sabotagem

**04/10/2026 · `./external-engines/conferir.sh` · provas em
[`../provas/LAB-31/sabotagem.json`](../provas/LAB-31/sabotagem.json) e
[`../provas/LAB-31/navegador.json`](../provas/LAB-31/navegador.json)**

O chat mandou: *"'verde' passa a ser UM comando só que roda tudo — os dois pacotes,
provas de navegador e o que mais existir; nada de suíte que fica fora e cala alarme.
Prove quebrando de propósito um teste de cada pacote e mostrando que o comando único
reprova."*

Duas metades, e a segunda é a que importa: um comando que roda tudo e **nunca reprova**
é indistinguível, de fora, de um comando que não roda nada. Foi literalmente o estado
do pacote `testfit` por duas semanas (D110).

---

## 1 · O levantamento — o que existe neste repositório, e o que ficava fora

Antes de escrever o comando, a pergunta do enunciado: *"e o que mais existir"*. O que
existe:

| frente | o que é | estava no "verde"? |
|---|---|---|
| pacote `esteira` | 292 testes, `typecheck`, `lint` | ✅ desde sempre |
| pacote `testfit` | 14 testes, `typecheck`, `lint` | ✅ **só desde o D110** — antes, não |
| **prova no navegador** | o `.wasm` do Symbios carregando em Chromium | ❌ **manual, rodou 1 vez** |
| Rust (`symbios/archilly/wasm`) | — | não há **nenhum** `#[test]` |
| CI | — | **não existe** `.github/workflows` |

Dois achados desse levantamento, e eles não eram o que eu fui procurar:

**(a) A prova no navegador era de olho humano.** Em
`symbios/adapter/ferramentas/navegador/` havia um roteiro de seis passos: compilar o
`.wasm`, copiá-lo, subir um servidor, abrir o Chromium, carregar a página **e ler os
números na tela**. Ela rodou **uma vez, em 10/09/2026**, e nunca mais. Não é desleixo
de ninguém: é o que acontece com toda prova cuja última etapa é um olho (D123).

**(b) Não há CI.** O comando único resolve *"o que roda"*; não resolve *"quem o
executa"*. Isso está dito no alto do script, aqui, no recado e na D125 — em vez de
chamar de "verde garantido" o que é "verde quando alguém lembra".

---

## 2 · O comando

```sh
./external-engines/conferir.sh
```

**Sete passos**, e duas guardas antes deles:

| ordem | passo |
|---|---|
| guarda | **cobertura** — descobre todo `package.json` e reprova se achar um fora da lista |
| guarda | **precondição** — o `.wasm` do Symbios, que não é versionado |
| 1–3 | `esteira` · `typecheck`, `lint`, `test` |
| 4–6 | `testfit` · `typecheck`, `lint`, `test` |
| 7 | **prova no navegador (Chromium)** |

Três regras escritas no alto do próprio script:

1. **roda TODOS os passos**, mesmo depois de um falhar — quem conserta quer a lista
   inteira, não o primeiro erro (daí `set -u`, e não `set -e`);
2. **nada PULA.** Precondição que falta é **falha, com o comando exato** para
   resolvê-la (D124). Pular é o que cala alarme;
3. sai com **código 1** se qualquer passo falhar, listando os que falharam.

### 2.1 · Por que ele DESCOBRE em vez de listar (D122)

A primeira versão, do D110, listava os dois pacotes **à mão**. Ela consertava o defeito
de ontem e carregava o mesmo defeito em potência: **o terceiro pacote nasceria fora da
lista**, ninguém notaria, e a história se repetiria com outro nome.

Agora o script roda `find … -name package.json -not -path "*/node_modules/*"` e reprova
se achar um pacote que não esteja em `COBERTOS`, dizendo onde acrescentá-lo e citando o
D110 — para quem ler não achar que é burocracia. **O jeito de um pacote ficar de fora
deixou de existir.**

E a guarda tem guarda: `esteira/tests/verde.test.ts` (6 travas) **lê o próprio script**,
extrai o `COBERTOS=(…)` do texto, confere contra os pacotes reais, e exige que os três
passos, o passo do navegador, a precondição do `.wasm` com a receita, a ausência de
`set -e` e a ausência de `skip` continuem lá. Travar o script por fora é o que impede
alguém — eu, em três semanas — de "simplificar" o script e desfazer este prompt sem
que nada acuse.

---

## 3 · A prova no navegador deixou de depender de olho (D123)

A página passou a publicar os números como **dado**, antes de sinalizar que terminou:

```js
window.__prova = {
  ok: r.ok, versao_motor: r.versao_motor, nos: r.nos.length,
  arestas: r.arestas.length, quadras: r.quadras.length,
  bytesDoWasm: bytes.byteLength, ms: Math.round(performance.now() - t0),
};
```

E `prova-automatica.ts` sobe o servidor na porta 8099, abre o **Chromium do Playwright**
(`executablePath` em `$PLAYWRIGHT_BROWSERS_PATH/chromium`, que já existe nesta máquina —
nada de `playwright install`), espera o `window.__provaConcluida`, lê o `window.__prova`
e **compara com os números de 10/09/2026**.

**Medido agora, os cinco bateram exatamente:**

| | 10/09/2026 | 04/10/2026 |
|---|---|---|
| versão do motor | 0.4.1 | **0.4.1** |
| nós | 6 242 | **6 242** |
| arestas | 6 514 | **6 514** |
| quadras | 275 | **275** |
| bytes do `.wasm` | 193 174 | **193 174** |

**O `ms` NÃO é conferido**, e está escrito no JSON: tempo de parede varia por máquina,
e trava que pisca por carga da máquina é trava que se desliga.

### 3.1 · Um defeito pego no caminho, e ele é do §6

A primeira versão da linha das arestas que eu escrevi foi
`r.arestas.filter(a => a.ativa).length`. **As arestas são tuplas** `[ia, ib, tipo]`, não
objetos: `.ativa` é `undefined` em todas, e a prova teria publicado **0 arestas**, em
silêncio, para sempre, como se fosse medição — exatamente o que a D23 proíbe.

Pego porque o número não bateu com o de 10/09. Ou seja: **pela comparação que este
prompt acabou de criar**, no primeiro uso dela. O comentário do defeito ficou no
`prova.js`, onde quem reescrever a linha vai ler.

---

## 4 · A sabotagem — a metade que o chat pediu (D126)

Três sabotagens, uma por frente:

| frente | o que foi quebrado |
|---|---|
| pacote `esteira` | `expect(saida.motor.nome).toBe(MOTOR_NOME)` → `toBe("SABOTAGEM-LAB-31")` |
| pacote `testfit` | `expect(saida.archilly.versao).toBe("2")` → `toBe("SABOTAGEM-LAB-31")` |
| navegador | `quadras: r.quadras.length` → `999999` |

**Antes:** `exit 0` · `VERDE — 7 passos, e a cobertura conferida.`

**Com a sabotagem:** `exit 1` ·

```
  NÃO ESTÁ VERDE — 4 passo(s) falharam:
    ✗ esteira · lint
    ✗ esteira · test
    ✗ testfit · test
    ✗ prova no navegador (Chromium)
```

**Quatro, não três.** O `esteira · lint` caiu junto **sem eu ter sabotado o lint**: a
troca deixou o import `MOTOR_NOME` sem uso. Dano colateral pego de graça — e um
argumento a mais para os três passos de cada pacote viverem no mesmo comando, em vez de
um `bun test` solto.

Os três arquivos foram **restaurados e conferidos** (`grep -c SABOTAGEM` = 0 em cada), e
o antes-e-depois está em
[`../provas/LAB-31/sabotagem.json`](../provas/LAB-31/sabotagem.json).

**Uma coisa a sabotagem não prova:** que o comando rode. Ver §1(b) e D125.

---

## 5 · O estado verde, medido ao fechar

```
cobertura: 2 pacotes, os 2 cobertos
precondição: .wasm 193 174 bytes ✓
esteira  · typecheck ✓ · lint ✓ · test ✓   292 pass, 0 fail (108,07 s)
testfit  · typecheck ✓ · lint ✓ · test ✓    14 pass, 0 fail (1,52 s)
navegador · ok=true · 0.4.1 · 6242 nós · 6514 arestas · 275 quadras · 193174 bytes
VERDE — 7 passos, e a cobertura conferida.   exit 0
```

**Os 292 do `esteira`** incluem as 6 travas novas do `verde.test.ts`.

---

## 6 · Os vizinhos ficaram limpos

`git status` nos três clones somente-leitura ao fim da rodada: **limpos, nenhum
arquivo alterado** — Geo (`urban-scout-tool`), Generate (`urban-create-hub-41d93a4d`) e
o motor do Laboratório de Parcelamento (`motor-testfit`).

---

## 7 · Decisões

| | |
|---|---|
| **D122** | "Verde" é um comando só, e ele **descobre** os pacotes em vez de listá-los |
| **D123** | Prova que depende de olho humano é prova que roda **uma vez** |
| **D124** | Precondição que falta é **falha com a receita** — nunca "pulado" |
| **D125** | **Não há CI** neste repositório, e isso fica escrito em vez de suposto |
| **D126** | A prova de que a trava morde é **sabotagem de propósito**, nos três lugares |

## 8 · O que fica proposto ao chat

**O CI.** Um workflow de uma página rodaria o `conferir.sh` em cada push; ele
precisaria do `rustup target add wasm32-unknown-unknown` e do Chromium do Playwright no
executor. **Não executado** — é escopo novo, e o §1-A proíbe ampliar por conta própria.
