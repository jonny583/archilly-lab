# LAB-63 · O que eu aceitei e nunca reconferi

**08/10/2026** · fila de 08/10/2026, **item único — os quatro restantes somados** ·
`claude/stoic-ritchie-ijzqy3`

**O pedido:** o chat mandou duas vezes, e a segunda substituiu a primeira — *"some dos dois
prompts em 1 somente"* e, logo depois, ***"melhor os vários prompts em 1 somente"***. Então o
que era LAB-63, LAB-64, LAB-65 e LAB-66 é **um prompt**, e ele **fecha a fila**.

---

## 1 · A resposta, em cinco linhas

| | |
|---|---|
| **os três achados do chat** | são **o mesmo** visto de três lados: *afirmação que entrou na casa sem régua não sai mais* (D210) |
| **forma 1, achada** | **2 de 6** símbolos que eu declaro no clone do motor apontavam para o arquivo **errado** — numa acusação que já saiu (D211) |
| **forma 2, achada** | a `CLAUDE.md` §6 declarava **dezesseis** e classificava **catorze**; citava duas decisões que não são linha; e contava a mesma lista como *"quinze"* (D212) |
| **forma 3, medida e NEGATIVA** | nas `DECISOES.md`: régua crua **22 pares**, régua estreita **zero** — os 22 são todos falso positivo da família D142 |
| **o custo** | **quatro falso negativo** na régua nova, e os quatro eram **silêncio** (D213) |

**Sabotagens: quatro, e UMA passou** — e ela achou um buraco de verdade na guarda.

---

## 2 · Os três achados do chat são um só (D210)

| de quem | a frase |
|---|---|
| Pesquisa | **pedido que nomeia o artefato volta pela metade** |
| Render | **dívida aceita é acusação não revisada** — sete de vinte e oito nunca foram dívida |
| Central | **contraexemplo tratado como exceção é regra que continua errando** |

Os três dizem a mesma coisa: **afirmação que entrou na casa sem régua não sai mais.** Então a
pergunta operacional não é *"quantos itens aceitos existem"* — é **onde, nesta casa, mora
afirmação que ninguém reconfere**. Procurei em três lugares e achei em dois.

---

## 3 · Forma 1 · o endereço no repositório do vizinho (D211)

Cada um dos seis mecanismos do LAB-58 declara `ondeNoMotor`: arquivo e nome no clone do
`motor-testfit`. **São acusações contra o motor de um vizinho, e elas já saíram** — no
relatório, no recado e na lista que o chat leva. **Nada no verde conferia o endereço.**

Medido contra o clone:

| o que o endereço dizia | onde a coisa está de verdade |
|---|---|
| `motor.ts · reservarFacesExternas` | `motor.ts:643` ✅ |
| `motor.ts · apararRedeViaria` | **`aparo.ts:97`** — em `motor.ts` ele é só **chamado**, linha 247 ❌ |
| `motor.ts · aplicarCulDeSac` | **`formatos.ts:816`** — chamado em `motor.ts:209` ❌ |
| `formatos.ts · quadraRet` (três mecanismos) | `formatos.ts:114` ✅ |

**Dois de seis símbolos** apontavam para o arquivo errado, e os outros quatro estavam certos.

> **O endereço é exatamente o "artefato" que o LAB-62 mandou não nomear** (D208) — e quando ele
> é nomeado de todo jeito, tem de **resolver**. Endereço que leva à chamada manda quem recebe a
> acusação procurar no arquivo errado: é o *pedido pela metade* da Pesquisa, do lado de quem
> acusa.

**E o campo não cabia a verdade:** tinha um arquivo só, e o mecanismo mora em dois. *Campo que
não cabe a verdade força a mentira curta.* Agora aceita vários endereços separados por `;`.

**A régua cobra DEFINIDO e não MENCIONADO** — o nome depois de `function`, `const`, `class`,
`type` —, que é o D142 no coração dela: o arquivo errado era justamente um onde o nome
**aparece**. Descrição em português sai como descrição e não se cobra (D137). **Um mecanismo dos
seis é só prosa**, e esse número sai na prova: endereço sem símbolo é endereço não medido.

---

## 4 · Forma 2 · a regra da casa que ninguém somava (D212)

A §6 é a página que eu leio **antes de toda tarefa**, e a §1-B diz dela, por escrito: *"regra
que ninguém pode desmentir é slogan (D136), e esta pode."* **Até aqui ela não podia.**

| o que a §6 dizia | o que era |
|---|---|
| *"se repetiu DEZESSEIS vezes"* + 16 linhas | ✅ fechava |
| *"NOVE réguas, **duas** ponte, **três** caminho"* | 9 + 2 + 3 = **14** — duas das dezesseis **sem classe** |
| as classes citavam **D104** e **D175** | nenhuma das duas é **linha da tabela** |
| *"três das **quinze** vezes"* | ordinal de quando a lista tinha quinze |

**Nenhuma é erro de fato — são erros de FECHAMENTO**, e é por isso que duraram: cada frase, lida
sozinha, está certa. A partição agora é **tabela declarada**, classe por linha, e fecha:
**7 + 4 + 2 + 2 + 1 = 16**.

---

## 5 · Forma 3 · onde o contraexemplo NÃO está, e o número negativo sai publicado

Varri as `DECISOES.md` atrás de regra minha desmentida por decisão posterior:

| a régua | o que ela acha |
|---|---|
| **crua** — a marca em qualquer lugar da decisão que cita a anterior | **22 pares** |
| **estreita** — a marca **na mesma frase** da citação | **zero** |

Os 22 são **todos falso positivo da família D142/D155**: a marca está na decisão, mas falando de
outra coisa, e a citação é de apoio e não de desmentido. Três exemplos vão na prova, para
ninguém ter de confiar no salto.

> **Zero não é "nada a consertar": é onde o contraexemplo NÃO está.** O das minhas regras mora na
> `CLAUDE.md`, absorvido no texto da própria regra — e ali o que ninguém media era a aritmética.

---

## 6 · O custo: quatro falso negativo, e os quatro eram silêncio (D213)

| # | o defeito | o que escondia |
|---|---|---|
| 1 | o parser dividia **antes** de tirar o parêntese | **4 dos 6** símbolos nunca eram conferidos |
| 2 | o casador exigia a palavra de número no **começo** do negrito | **zero classes**: a trava da soma nunca disparava |
| 3 | o prefixo terminava em `\b`, e **`\b` não conhece português** | `três` virou `ês` — **o D137 dentro da régua escrita para achar o D137** |
| 4 | a tabela enchia a lista de palavras desconhecidas **depois** dos problemas | a palavra chegava tarde e não entrava |

E um quinto, pior porque era da **guarda**: ao reescrever a §6 como tabela, a régua passou a achar
zero classes e a imprimir ***"tudo conferido"***.

> **Guarda que não acha a partição não está aprovando a partição: está sem medir nada.**

**O que mudou no desenho:** palavra de número não reconhecida e partição não encontrada passaram
a ser **problema**, e não `continue`. *Foi o silêncio do `continue` que escondeu os quatro.*

---

## 7 · A sabotagem — e a que PASSOU

| # | o que foi sabotado | ferramenta | travas |
|---|---|---|---|
| 1 | o endereço volta a dizer `motor.ts` para os dois nomes | `exit 1`, 2 problemas | 1 de 15 cai |
| 2 | a partição volta a somar 14: `SETE`→`NOVE` e duas linhas sem classe | **`exit 0` — PASSOU** | 2 de 17 caem |
| 3 | a tabela da partição é apagada | `exit 1` | 4 de 17 caem |
| 4 | o *"quinze"* volta | `exit 1` | 1 de 17 cai |

**A nº 2 passou, e o motivo é instrutivo:** 9 + 4 + 2 + 1 = **16**, então a **soma volta a
fechar** com duas linhas sem classe. *Soma é invariante fraca.* A partição passou a se cobrar
**linha por linha**; refeita a sabotagem, `exit 1` nomeando D161 e D185.

---

## 8 · O que NÃO foi feito

- **nada foi escrito no clone do motor.** O endereço foi consertado **aqui**, no meu campo; o
  que muda lá continua sendo lista numerada que o chat leva (§4);
- **a proposta nova do chat para a nota** — somar VGV com curva de preço por tamanho — **não foi
  medida**: é decisão de urbanismo e de negócio (§4). Entrou em
  [`../PENDENCIAS_JONNY.md`](../PENDENCIAS_JONNY.md) em palavra de pessoa, com **as três coisas
  que eu preciso dele** para que a conta não seja número inventado;
- **nenhum item da lista "Proposto ao chat" foi executado** — prompt fora da fila não existe.

## 9 · Os clones vizinhos ficaram limpos

`git status` nos três: **0 alterações** em `urban-scout-tool`, `urban-create-hub-41d93a4d` e
`motor-testfit`. O clone do motor foi **lido** — é o que este prompt faz — e não tocado.
