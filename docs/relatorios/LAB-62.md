# LAB-62 · As três listas que esperam pelo chat

**08/10/2026** · fila de 08/10/2026, item 1 de 5 · `claude/stoic-ritchie-ijzqy3`

**O pedido, nas palavras do chat:** *"mande AQUI, dentro do próprio recado, as três coisas que
esperam por mim, porque é só o recado que chega até o chat. Primeira, os ONZE itens abertos da
seção 'Proposto ao chat', um por linha, com o motivo declarado de cada um — eu respondo item a
item e isso vira fila. Segunda, a lista numerada dos seis mecanismos do motor, em ordem de
quantas glebas cada conserto destrava, que eu levo ao motor. Terceira, as três formas de
desligar conferência dele, com o 'não tem CI' em primeiro, que eu levo junto."*

E junto veio a regra do LAB-63, aplicada aqui por ordem dele: *"Aplique isso às duas listas
numeradas do LAB-62 antes de mandá-las: cada item diz o que precisa ficar verdadeiro, não qual
arquivo mexer."*

---

## 1 · A resposta, em quatro linhas

| | |
|---|---|
| **as três listas** | geradas por `bun run lab62` das provas que já mediram as coisas, **não digitadas** |
| **o achado** | o que eu ia chamar de achado **já era a D197, de ontem**. O que sobrou é novo e é outro: o campo da prova se chama `glebasQueEleBloqueia` e mede *"aparece em"*, e a lista publicada tem **três posições com desempate que ninguém reproduz** (D207) |
| **o conserto de régua** | a guarda das afirmações errava o **rótulo** da extensão acertando o veredicto — achado pelas minhas próprias travas, antes das sabotagens (D208) |
| **a tensão declarada** | *"um por linha"* × teto de 12 linhas do recado: resolvido em blocos próprios **acima** do recado (D209) |

**Sabotagens: quatro, e nenhuma passou** — a primeira vez em cinco prompts.

---

## 2 · Por que isto é ferramenta e não texto

As três listas já existiam **medidas** no repositório:

| lista | a fonte | a régua |
|---|---|---|
| os **onze** itens abertos | `docs/prompts/FILA.md` | `lerPropostas`, a régua do LAB-61 |
| os **seis** mecanismos | [`../provas/LAB-58/mecanismos-das-81.json`](../provas/LAB-58/mecanismos-das-81.json) | os campos `porGleba` e `oQueBloqueiaCadaGleba` |
| as formas de desligar conferência | [`../provas/LAB-60/configuracao-do-motor.json`](../provas/LAB-60/configuracao-do-motor.json) | `temCI`, `oLintDele`, `totalPorRegra`, `oTsconfigEnumerado` |

Digitá-las outra vez é a forma do **D185**, e ela já me custou uma frase publicada: eu escrevi
*"oito"* onde eram *"cinco"* contando de cabeça uma lista **impressa na linha de cima** do meu
próprio relatório. Então a ferramenta lê as três fontes, confere os números que as afirmações
citam contra a prova que os mede, e **reprova** quando a conta não fecha — onze abertos, seis
mecanismos com afirmação cada, as três formas cobertas uma vez cada, o *"não tem CI"* em
primeiro, nenhuma afirmação nomeando artefato.

A prova sai em [`../provas/LAB-62/as-tres-listas.json`](../provas/LAB-62/as-tres-listas.json) e
os blocos, do jeito exato que vão ao chat, em
[`../provas/LAB-62/os-tres-blocos.txt`](../provas/LAB-62/os-tres-blocos.txt).

---

## 3 · O que eu ia chamar de achado já era a D197 — e o que sobrou (D207)

Comecei a escrever esta seção assim: *"'destrava' e 'aparece em' são perguntas diferentes, e o
primeiro da lista muda."* **E isso já está decidido, por escrito, desde ontem.** A D197 diz:

> *"`ensaio-47ha` é bloqueada por UM mecanismo só… consertá-lo zera uma gleba inteira, sozinho, e
> é a única das cinco em que isso acontece"* — e fecha com *"contagem diz o tamanho do conserto;
> 'quantas glebas destrava' diz a ordem dele"*.

Eu ia publicar uma decisão de ontem com a data de hoje. **Achado que repete decisão registrada
não é achado: é a decisão sem a citação** — e ela daria ao chat a impressão de que a lista mudou
quando ela não mudou.

### O que é de fato novo, e é três coisas

**1 · O campo que a prova publica tem o nome errado.** Ele se chama `glebasQueEleBloqueia` e mede
**em quantas glebas o mecanismo aparece**. Por aquele nome, o valor do `face-de-quadra…` seria
**1** — a gleba que ele bloqueia sozinho — e a prova diz **2**. É a família do **D166**: nome que
diz uma coisa, valor que é outra. Quem lesse a prova sem ler a D197 ordenaria pelo campo achando
que ordenava por destrave.

**2 · A lista publicada tem desempate que ninguém reproduz.** A que está hoje no `ONDE_PARAMOS`
acerta o primeiro e os dois de alcance 3, e depois, nos **três de alcance 1**, sai assim:

| posição | mecanismo | alcance | violações | nº no módulo |
|---|---|---|---|---|
| 4 | `fileira-encosta-na-via-so-de-esguelha` | 1 | **4** | 6 |
| 5 | `faixa-externa-sem-limite-longitudinal` | 1 | **18** | 1 |
| 6 | `rede-viaria-aparada-so-pela-divisa` | 1 | **11** | 2 |

4 → 18 → 11 não é volume crescente, não é decrescente, e 6 → 1 → 2 não é a ordem do módulo.
**Lista que vai ao motor com três posições que ninguém sabe explicar é lista que volta com
pergunta.** A ordem agora é declarada: **destrave, depois alcance, depois violações** — e ela
diverge da publicada **a partir da posição 4**. A lista desta página foi corrigida.

**3 · A quantificação, que a D197 não tinha: 1 de 6 destrava, e cinco destravam zero.** Porque
uma gleba só zera quando o **último** mecanismo dela cai:

| gleba | mecanismos que a bloqueiam | do contrato do Generate | zera com um conserto? |
|---|---|---|---|
| `ensaio-47ha` | **1** · `face-de-quadra-limitada-num-eixo-so` | 0 | **sim** |
| `sintetico-10ha-plano` | 2 | 0 | não |
| `sintetico-50ha-ondulado` | 3 | 0 | não |
| `completo` | 3 | 0 | não |
| `geo-antonina` | 2 | **11** | não |

E o que destrava **não** é o de maior alcance (2 contra 3) **nem** o de mais violações (14 contra
23): nenhum dos dois números que a prova publica serve de proxy.

**E a D197 não tinha guarda nenhuma — era prosa.** Agora tem, e é semântica: as duas ordens não
dão o mesmo primeiro; um destrava e cinco destravam zero; o que destrava tem alcance e violações
menores que os máximos. A sabotagem nº 3 a exercita: tirada a exigência de que a gleba tenha um
mecanismo só, as duas ordens coincidem e a ferramenta sai com `exit 1` dizendo que *o achado
deixou de existir*.

---

## 4 · A regra das afirmações, e o que a guarda barra (D208)

Cada item das duas listas numeradas carrega **três** campos, e nenhum é endereço de arquivo:

1. **o que precisa ficar verdadeiro** — o estado do mundo, que é a negação do predicado medido;
2. **com que frequência isso se confere** — metade do pedido: sem ela a afirmação não tem como
   ser reconferida, e volta a ser promessa;
3. **o que NÃO serve** como prova de que ficou verdadeiro — e esta é a que mais rende, porque
   quase toda linha tem um atalho que parece conserto. Três exemplos medidos aqui: baixar o teto
   declarado para caber na tira que sai hoje; medir a distância do lote à **reta** da face, que
   dá zero para todos os 18; e consertar o rótulo da régua nos 4 de esguelha, que derruba
   **ZERO** violações (D184).

`afirmacaoNomeiaArtefato` barra **endereço** — separador de caminho e extensão de arquivo — e
**não** barra nome de chave (`skipLibCheck`) nem de passo (`lint`): esses são a coisa de que a
afirmação fala, e barrá-los deixaria a afirmação sem sujeito. Os dois lados estão na trava.

**O conserto que saiu de dentro da régua, antes das sabotagens:** ela varria a lista de extensões
na ordem declarada e devolvia `` `.ts` `` para `pacote.tsx` e `` `.js` `` para `TSCONFIG.JSON`.
Veredicto certo, **rótulo errado** — e é o rótulo que iria escrito na mensagem ao motor.
Consertada varrendo da extensão mais longa para a mais curta, com a extensão casando só quando
não continua em letra ou dígito. **É a oitava vez que a régua nova se acusa a si mesma dentro do
próprio prompt.**

---

## 5 · A tensão do recado, declarada e resolvida (D209)

O chat pediu os onze itens *"um por linha"* **dentro do recado**; a `CLAUDE.md` §1 põe teto de
**12 linhas**, com trava. Só a primeira lista são 13 linhas.

**As três listas vão em blocos de código próprios, logo acima do recado** — copiáveis um por um —
e o recado, dentro do teto, diz quantos blocos são e o que cada um carrega. *Nada depois do bloco
do recado* continua inteiro: o que mudou é o que vem **antes** dele.

---

## 6 · A sabotagem

Quatro, e **nenhuma passou** ([`../provas/LAB-62/sabotagem.json`](../provas/LAB-62/sabotagem.json)):

| # | o que foi sabotado | ferramenta | travas |
|---|---|---|---|
| 1 | uma afirmação passa a nomear caminho de arquivo | `exit 1` | 2 de 20 caem |
| 2 | um mecanismo fica sem afirmação escrita | `exit 1` | 3 de 20 caem |
| 3 | `destrava` passa a ser medido como `aparece em` | `exit 1` | 4 de 20 caem |
| 4 | o *"não tem CI"* deixa de ser o primeiro | `exit 1` | 3 de 20 caem |

Nas quatro filas anteriores, **quatro** sabotagens passaram no primeiro corte (D179, D198, D203,
D206) e cada uma virou conserto de régua. Esta é a primeira rodada em que nenhuma passou — e vale
dizer **por que**, sem crédito indevido: as duas travas que falharam aqui falharam **antes** das
sabotagens, e o defeito que elas acharam era meu.

---

## 7 · O que NÃO foi feito

- **nada foi consertado no motor**, e nada foi escrito no clone dele (§4). As duas listas
  numeradas são **mensagem**, e quem as leva é o chat;
- **a proposta nova do chat para a nota** — somar VGV com curva de preço por tamanho em vez de
  preferência declarada — **não** foi medida aqui: é decisão de urbanismo e de negócio (§4), e
  entra em `PENDENCIAS_JONNY.md` no LAB-66, que é o item onde o chat a pôs;
- **nenhum item da lista 1 foi executado.** Prompt fora da fila não existe (§1-A): a lista vai ao
  chat para ele responder item a item.

## 8 · Os clones vizinhos ficaram limpos

`git status` nos três: **0 alterações** em `urban-scout-tool`, `urban-create-hub-41d93a4d` e
`motor-testfit`. Nenhum deles foi tocado neste prompt — a lista 3 saiu da prova do LAB-60, que já
os havia lido.
