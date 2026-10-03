# LAB-29 · A identidade que viaja no contrato

**03/10/2026 · sem ferramenta própria: este prompt não mede, ele para de inventar.
Provas: `tests/identidade.test.ts` (10 travas) e
[`../provas/LEIA-ME.md`](../provas/LEIA-ME.md)**

O chat mandou: *"a IDENTIDADE que viaja no contrato, lendo `MOTOR_NOME` e
`MOTOR_VERSAO` do próprio motor, para alcançar as provas congeladas do LAB-02 e do
LAB-07 e o rótulo na mesa do Generate."*

---

## 1 · O que estava escrito, e por que as duas etiquetas eram minhas

```json
"motor": { "nome": "motor-testfit", "versao": "T00-A+espinha" }
```

| campo | estava | o que é | o motor publica |
|---|---|---|---|
| `nome` | `motor-testfit` | o nome do **repositório** dele | `MOTOR_NOME = "laboratorio-de-parcelamento"` |
| `versao` | `T00-A` | o nome de um **prompt do Lab** | `MOTOR_VERSAO = "1.0"` |

E o motor não só publica a versão: ele **documenta para que ela serve** —
*"sobe quando o desenho muda de forma que o Generate veja"*. É exatamente o uso que o
Lab precisava dela, e estava ignorando.

**Mesma forma do D104, um nível acima**, com a consequência que o D108 mediu: a
etiqueta envelheceu no lugar — o motor foi do T00-A ao **T05** e o campo continuou
dizendo T00-A — e estava escrita em **dois arquivos** do Lab, com valores diferentes
(`"T00-A"` na esteira, `"T02"` na porta).

---

## 2 · O conserto, e a separação que é o coração dele (D117)

**Quem é** e **quem rodou** são campos diferentes, e misturá-los era a causa:

| campo | de quem é | o que traz agora |
|---|---|---|
| `motor.nome` | **do motor** | `laboratorio-de-parcelamento`, importado |
| `motor.versao` | **do motor** | `1.0+<partido>` — o `+<partido>` é a única coisa que o Lab acrescenta |
| `archilly.origem` | **do Lab** | `archilly-lab · esteira do LAB-07` |

**O `+<partido>` fica**, e por uma razão medida: a mesa do Generate mostra
`externo · <nome> v<versão>`, e sem o partido as **dez** variantes do motor viram dez
linhas idênticas na tela do urbanista.

**Três coisas foram apagadas, não ajustadas:** a constante `VERSAO_MOTOR_MEDIDA`, o
parâmetro `versaoMotor` de `voltaParaOContrato`, e o `+ subdivisão do Lab` de dentro
da versão do Symbios. **Apagar o parâmetro foi de propósito** — ele obrigou cada
chamador a ser revisitado, que é o que uma correção de raiz deve fazer. Foram sete
chamadas, incluindo seis testes do pacote `testfit`.

### O Symbios não tem o que importar, e aí a régua é outra

O motor dele é **WASM compilado de Rust**. Então o Lab guarda duas constantes **com a
fonte citada ao `upstream/VERSION`** — que diz *"Engine: Symbios Tensor
(symbios-tensor)"* e *"Upstream version: 0.4.1 (Cargo.toml)"* — e **um teste lê aquele
arquivo** e reprova se divergirem.

`upstream/` é intocável (CLAUDE.md §3), e **intocável não quer dizer ilegível**.
Copiar sem conferir é exatamente como o "T00-A" envelheceu.

**O rótulo na mesa do Generate**, que era a terceira coisa que o chat pediu:

| antes | agora |
|---|---|
| `externo · motor-testfit vT00-A+espinha` | `externo · laboratorio-de-parcelamento v1.0+espinha` |
| `externo · symbios-tensor v0.4.1 + subdivisão do Lab (LAB-13)` | `externo · symbios-tensor v0.4.1` |

---

## 3 · As provas congeladas: alcançadas, e não regeradas (D118)

Cinco arquivos carregam o rótulo antigo — as três SAÍDAS do LAB-07 e as duas do
LAB-08 em `docs/contratos/saidas/`. **Não foram regerados.**

Eles são o **registro de uma medição feita naquele dia, com o motor daquele dia**, e
os números deles são citados nos relatórios. Regerá-los **apagaria a medição para
consertar uma etiqueta** — e a D90 já decidiu que o passado se vira com a história
escrita, não se apaga.

**O que entra no lugar:** [`../provas/LEIA-ME.md`](../provas/LEIA-ME.md), listando os
cinco arquivos, dizendo o que cada etiqueta queria dizer, por que ficam como estão, e
onde está a identidade de verdade. **Há teste exigindo que ele exista e cite as três
coisas** — aviso que depende de alguém lembrar não é aviso.

**Uma exceção, com razão:** a prova do **LAB-26** foi regerada. Ela não é registro
congelado — é a leitura **ao vivo** das declarações da porta, e `versaoDeclarada` é
justamente o campo que mudou. Deixá-la velha seria publicar como declaração atual uma
que não é. As conclusões do LAB-26 não dependem do valor da etiqueta.

---

## 4 · O que este prompt NÃO fez

- **Não mediu nada de novo.** Nenhum número da tabela comparativa muda: ela usa os
  nomes de tela do Lab, não os do contrato. Conferido — `tabela.json` e a página do
  Jonny não contêm "T00-A" nem antes nem depois.
- **Não mexeu no `MOTOR_VERSAO` do vizinho.** A pergunta que o LAB-27 mandou a eles
  continua de pé: *a versão subiu no T02 e no T03?* Se não subiu, ela não serve para o
  Lab saber que precisa remedir — e agora o Lab **depende** dela, o que torna a
  pergunta mais urgente, não menos. Está no
  [`O_QUE_FALTA_MEDIR_POR_MOTOR.md`](../O_QUE_FALTA_MEDIR_POR_MOTOR.md), §1-C.

---

## 5 · Conferência

- **`./external-engines/conferir.sh` verde nos dois pacotes** — `esteira` com **265
  testes** (10 novos, todos de identidade) e `testfit` com 14 — **279 no total** —,
  `typecheck` e `lint` limpos em ambos.
- **Clones vizinhos limpos:** `git status` em `motor-testfit`,
  `urban-create-hub-41d93a4d` e `urban-scout-tool` — **sem nenhuma alteração**. A
  identidade é **lida** de lá, nunca escrita.
- **A página do Jonny não foi regerada:** nenhum número dela muda.
- **Mesclado por PR**; os conectores do GitHub estavam de pé.
- **Decisões:** D117 (a identidade é do motor, e quem rodou vai em `origem`), D118
  (prova congelada não se regera para consertar etiqueta).
