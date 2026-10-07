# LAB-52 · As duas varreduras da Central — e o detector que estava MUDO

**07/10/2026** · prompt da fila de 06/10, o **quinto e último**. Achado da Central,
trazido pelo chat.

> **(a)** *erro de chamada NÃO CONFERIDO que degrada para número que PARECE certo* —
> retorno ignorado, `catch` que engole, `Number(...)`/`parseFloat` que viram `NaN` e
> seguem, `??` que esconde falha, promessa sem `await`.
> **(b)** *função que recebe IDENTIFICADOR DE CONTA como argumento* — furo de privacidade.

---

## 0 · A resposta, antes da conta

| | |
|---|---|
| **(a) promessa sem `await`** | **ZERO** — mas o detector dela estava **DESLIGADO**, e o zero só vale porque eu o liguei e provei por sabotagem |
| **(a) `catch` que engole** | **ZERO** em 113 arquivos |
| **(a) `?? 0` sobre chamada que falha** | **28 achados → 2, e os 2 são benignos**. Os 26 que saíram eram **falso positivo da minha régua** |
| **(a) `Number(...)` sem conferência** | **1**, e **não é a classe da Central**: ele **estoura**, não degrada |
| **(b) identificador de conta** | **ZERO**, em **4 891 parâmetros** e **4 316 campos** examinados, contra **25 nomes** procurados |

**O achado do prompt não é nenhum dos cinco: é que o detector da metade mais perigosa de
(a) estava muda** há tanto tempo quanto existe este repositório.

---

## 1 · O escopo, como número (D164)

```
113 arquivos .ts · 31 894 linhas · 1 346 430 bytes
6 regras de texto · 4 891 parâmetros e 4 316 campos de objeto examinados
25 nomes de identificador de conta procurados
```

**Dois motores, e o escopo de cada um é declarado**, porque a metade mais perigosa de (a)
**não se mede com regex**:

| o quê | quem mede |
|---|---|
| promessa sem `await`, `await` em não-promessa, `async` sem `await` | **o lint com TIPO** |
| `catch` que engole, `?? 0` sobre chamada, `Number(...)` sem conferência, nome de parâmetro e de campo | **a varredura de texto** |

**O que nenhum dos dois alcança, dito:** retorno ignorado de função de **biblioteca** — sem
tipo não há como saber se o valor importava — e qualquer coisa que dependa de fluxo entre
arquivos. Para isso o remédio é o lint tipado mais largo, não uma regex melhor.

---

## 2 · O achado: as três regras que precisam de tipo estavam MUDAS (D178)

Os **dois** `eslint.config.js` — `esteira` e `testfit` — traziam:

```js
languageOptions: { parserOptions: { projectService: false } },
```

**Sem serviço de projeto, TODA regra type-aware fica desligada.** Entre elas:

- `@typescript-eslint/no-floating-promises` — **a regra exata da classe (a)**;
- `@typescript-eslint/no-misused-promises`;
- `@typescript-eslint/require-await`.

**E ela não avisa.** Não há erro, não há aviso, não há contagem: o lint passa verde porque
**não rodou** a regra. *É a forma do D123 — a prova no navegador que ninguém rodava — num
lugar onde ninguém pensa em olhar: dentro da configuração do lint.*

> **Regra desligada em silêncio é pior que regra ausente, porque o verde continua verde e
> ninguém procura.**

### O zero é MEDIDO, e isso exigiu sabotagem

Ligadas as três e rodadas na árvore inteira: **zero achados**. Mas *zero de detector que eu
não provei é zero que não vale* — então plantei uma promessa sem `await` num arquivo
temporário:

```
6:3  error  Promises must be awaited, end with a call to .catch, …
             @typescript-eslint/no-floating-promises
```

**Ela acusou.** Só então o zero virou resultado.

### Ligar as três custa zero conserto. Ligar o resto não.

As três ficaram **ligadas nos dois pacotes**, porque hoje não custam conserto nenhum.

**O conjunto `recommendedTypeChecked` COMPLETO ficou de fora, e o motivo é número:**
**646 achados** — **487** de `no-unnecessary-type-assertion` e **~149** de `no-unsafe-*`,
que vêm das pontes `as unknown as` entre três repositórios. Isso é outro prompt, e está
**proposto ao chat**.

**O preço do tipo, medido e dito:**

| pacote | lint sem tipo | lint com tipo |
|---|---:|---:|
| `esteira` | **0,85 s** | **7,9 s** |
| `testfit` | — | **3,1 s** |

Nove vezes mais lento no `esteira`. *É a conta que faz valer: sete segundos por execução
contra uma classe de erro que não aparece de outro jeito.*

---

## 3 · A régua acusou 28 e 28 eram falso positivo (D179)

A regra `degrada-chamada-para-numero` — `?? 0` ou `|| 0` sobre o resultado de uma chamada —
deu **28 achados**. Agrupados pela função chamada:

| chamada | n | o que era |
|---|---:|---|
| `.at(` | **16** | `v.at(-1) ?? 0` num vetor que pode estar vazio |
| `.get(` | **10** | `m.get(k) ?? 0` numa chave que pode faltar |
| outros | 2 | serialização de "não há padrão" e uma cadeia opcional |

**`Array.at(-1)` num vetor vazio e `Map.get(k)` numa chave que falta NÃO falharam** — eles
disseram *"não tem"*, e `?? 0` é a resposta declarada para isso.

**A classe que a Central nomeou é "erro de chamada não conferido" — ERRO.** Estreitar a
regra para o alvo que ela mesma declara **não é afrouxá-la** (o contrário do D143 e do
D172): é a pergunta do D127 feita **antes** de acusar — *a chamada que eu casei sinaliza
falha?*

Nasceu a lista `AUSENCIA_NAO_E_ERRO` (`at`, `get`, `pop`, `shift`, `find`, `findLast`,
`match`, `shiftOut`), e **28 → 2**. **O buraco fica declarado:** uma função **própria**
chamada `get…`/`at…` que falhe de verdade escapa — preço menor que o de 28 acusações falsas.

### Os 3 achados que restaram, um a um, e nenhum é caso real

| achado | veredito |
|---|---|
| `varredura-de-chamadas.ts` · `?? ""` | **benigno** — é sobre cadeia opcional dentro da própria varredura; ausência de parâmetro é normal |
| `registro-de-motores/registro.ts:267` · `this.padrao() ?? ""` | **benigno** — serializa *"não há motor padrão"* como string vazia, para o hospedeiro salvar. Valor declarado, não erro engolido |
| `symbios/…/medir.ts:377` · `Number(…match(…)![1])` | **não é a classe da Central** — se o `match` falhasse, o `!` **ESTOURA**; não degrada. É a distinção do D175, e o id é literal, montado no mesmo arquivo |

Os três estão numa **lista fechada de benignos**, cada um com o motivo, e a trava reprova
**um quarto** — e também um destes que **desaparecer**.

---

## 4 · (b) — o zero vale porque as réguas olharam volume

A Central chama de furo de privacidade **função que recebe identificador de conta como
argumento**. Resposta: **zero**. E o zero é medido em **duas** réguas, porque a primeira
tinha um buraco que a segunda fecha:

| régua | examinou | achou |
|---|---:|---:|
| nome de **parâmetro** de função | **4 891** | 0 |
| nome de **campo** de objeto/interface | **4 316** | 0 |

A segunda nasceu porque a primeira declarava o buraco *"identificador que viaja dentro de um
objeto"* — e **buraco declarado que dá para fechar se fecha**. O caso que me fez olhar foi
`EstadoDoUsuario`, em `entrega/registro-de-motores/registro.ts`: o nome fala em usuário, e
medido ele carrega **só ids de motor** (`desligados`, `padrao`).

**E há trava exigindo que as duas réguas continuem examinando volume** (> 3 000 parâmetros,
> 2 500 campos): *é a diferença entre "não achei" e "não procurei"*.

**O enunciado honesto:** este repositório **não tem contas, nem usuários, nem autenticação**
— ele mede terreno. A regra da Central **não deixa de valer por isso**; ela passa a ser uma
trava que morde se um dia um identificador entrar. Hoje, mordendo o vazio, ela custa 3 ms.

---

## 5 · A SABOTAGEM pegou um defeito meu que eu não vi — a QUINTA vez da família (D179)

Seis sabotagens, cada uma desfeita. **A segunda foi a que ensinou:**

| sabotagem | antes | depois |
|---|---|---|
| `projectService: false` de volta | 14 · 0 | **12 · 2** · exit 1 |
| **`no-floating-promises` TIRADA da configuração** | 14 · 0 | **primeiro: 14 · 0 — NÃO PEGOU** · depois do conserto: **13 · 1** |
| `no-misused-promises` posta em `off` | 14 · 0 | **13 · 1** · exit 1 |
| `catch` que engole, plantado | 14 · 0 | **13 · 1** · exit 1 |
| identificador de conta em **argumento** | 14 · 0 | **12 · 2** · exit 1 |
| identificador de conta em **campo** | 14 · 0 | **12 · 2** · exit 1 |

**Por que a segunda passou:** a trava fazia `expect(cfg).toContain(regra)` sobre o texto
**cru** da configuração — e o **comentário** que eu acabara de escrever ali **cita o nome da
regra** ao explicá-la. Tirar a regra deixava o comentário, e a trava passava.

**É a QUINTA vez da família do D137, D142, D155 e D177** — e a primeira em que **não fui eu
que peguei: foi a sabotagem**. No LAB-51 eu me gabei de ter visto antes de escrever a régua;
uma hora depois, no mesmo assunto, caí.

**O conserto é a lição do D142 inteira:** o nome tem de estar **no lugar da gramática onde
significa "regra ligada"** — `"<regra>": "error"` —, não em qualquer lugar do arquivo. E
exigiu **duas** limpezas distintas, que agora são duas funções:

| função | tira | serve para a pergunta |
|---|---|---|
| `soOCodigo()` | comentário **e** conteúdo de string | *"o código FAZ isto?"* |
| `semComentarios()` | só comentário | *"a configuração DECLARA isto?"* |

> **Usar a limpeza errada é a mesma família do nome lido no lugar errado — e há duas
> perguntas, não uma.**

---

## 6 · Entrega

| o quê | onde |
|---|---|
| a régua | [`src/varredura-de-chamadas.ts`](../../external-engines/esteira/src/varredura-de-chamadas.ts) — 6 regras, `soOCodigo`, `semComentarios`, `AUSENCIA_NAO_E_ERRO` |
| a ferramenta | [`ferramentas/lab52.ts`](../../external-engines/esteira/ferramentas/lab52.ts) · `bun run lab52` |
| as travas | [`tests/chamadas.test.ts`](../../external-engines/esteira/tests/chamadas.test.ts) — 14 travas |
| as três regras ligadas | `eslint.config.js` dos **dois** pacotes |
| a prova | [`docs/provas/LAB-52/varredura-de-chamadas.json`](../provas/LAB-52/varredura-de-chamadas.json) |

A prova **mede código, não gleba** — entrou na **lista declarada de exceções** do §7, com o
motivo.

**As travas entram no trabalho do CI sem clones vizinhos**: elas leem arquivo do próprio
repositório e não importam `@generate/*` nem `@testfit/*`. O número daquele trabalho foi de
**100 para 114**, nos **quatro** lugares que o citam (D153, D165). A suíte foi de **433 para
447**.

**Nada escrito em repositório vizinho**; os três clones conferidos e limpos.

## 7 · As decisões

- **D178** — **regra de lint que precisa de tipo fica MUDA com `projectService: false`, e
  não avisa.** As três da classe da Central estavam desligadas nos dois pacotes; ligadas,
  dão **zero**, e o zero foi **provado por sabotagem**. O preço é **0,85 s → 7,9 s** de
  lint, dito em vez de escondido; o `recommendedTypeChecked` completo ficou fora porque são
  **646** achados, e isso é outro prompt;
- **D179** — **28 de 28 falso positivo, e a sabotagem pegou o que eu não vi.** `at(-1) ?? 0`
  e `get(k) ?? 0` não são erro engolido: ausência declarada não é falha. E a QUINTA vez da
  família da régua que lê texto — desta vez dentro do teste escrito para honrar a quarta —,
  com a lição nova de que há **duas** limpezas porque há **duas** perguntas.
