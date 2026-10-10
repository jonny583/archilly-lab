# LAB-84 · AS TRINTA E UMA, POR EXECUÇÃO — e o nome do trabalho volta a ser verdade

**Prompt:** item **017** da caixa de entrada. · **Rodada:** despertador das 20:05 de 10/10/2026. ·
**Conferido aqui, não no GitHub** (§7).

---

## 1 · O item é uma medição, e proibiu a resposta barata

O item 017 nasce do achado (5) do meu próprio LAB-83 e não acrescenta nada ao enunciado — ele
**cobra o número que eu me recusei a prometer** (D279). E dita o método:

> *"A medição é por EXECUÇÃO, não por leitura. Rodar a lista **sem os clones** e ver quem reprova
> é a resposta; ler o `import` é a hipótese."*

**Como foi feito:** cópia do repositório num diretório onde os três clones irmãos **não existem**
— que é exatamente o que o CI vê, porque lá eles são clonados ao lado e na cópia não há nada ao
lado —, e `bun test` em cada arquivo da lista, um a um, com o código de saída guardado. A
ferramenta **estoura se um clone aparecer** ao lado da cópia: *medição cuja precondição não é
conferida mede outra coisa.*

**Nada foi movido nem renomeado no vizinho.** Mover o clone seria a saída óbvia e seria escrever
nele, o que a §4 proíbe.

---

## 2 · A tabela, e ela é o que o item pediu: por arquivo, não o total

Dos **30** arquivos da lista, rodados sem os clones: **29 passam, UM reprova.**

| arquivo | sem os clones |
|---|---|
| `commit-dos-vizinhos.test.ts` | **exit 1 — 4 travas de 14** |
| os outros 29 | exit 0 |

A prova traz a linha de cada um:
[`docs/provas/LAB-84/as-trinta-por-execucao.json`](../provas/LAB-84/as-trinta-por-execucao.json).

### As quatro, nomeadas — e eu havia dito DUAS (D282)

1. `item 001 > O CASO BOM, contra o clone de verdade: carimbo igual ao HEAD → igual`
2. `item 001 > O CASO RUIM, contra o clone de verdade: carimbo de OUTRO commit do histórico → mudou`
3. `item 001 > prova SEM carimbo sai nao-gravado, e nunca igual`
4. `o carimbo de VERDADE desta máquina diz de onde saiu, e as duas linhas batem hoje`

| o que eu disse, lendo o fonte (D279) | o que a execução diz |
|---|---|
| **duas** travas | **quatro** |
| uma desde o LAB-68, uma minha | **três** desde o LAB-68, **uma** minha |

> **Contei pelo `expect` que eu reconhecia, não pelos que reprovam.** A leitura viu a trava com a
> mensagem *"o clone do motor tem de estar nesta máquina"* e a minha nova; não viu as outras duas
> do mesmo `describe`, que dependem da **variável** `cabeca` e não repetem a frase. *Régua de
> leitura acha o que ela reconhece; execução acha o que acontece* — e a diferença foi de **100 %**.

E é por isso que o D279 mandou o número para a `FILA.md` em vez de o prometer: *prometer o número
sem medir é a classe do D133*, e aqui o número prometido estaria pela metade.

---

## 3 · A decisão, com o que se perde escrito (D282)

**Movi as QUATRO travas para `tests/commit-dos-vizinhos-com-clone.test.ts`, e NÃO renomeei o
trabalho.** O item deu o critério: *"o nome é uma afirmação, então a pergunta é qual das duas
afirmações você quer poder desmentir."*

| conserto | o que se ganha | o que se perde |
|---|---|---|
| **mover as 4 travas** *(escolhido)* | o nome volta a ser verdade, e a lista roda em qualquer lugar sem preparo | nada: o verde completo roda todo arquivo de qualquer jeito |
| renomear o trabalho | nada a mexer no código | **o que o portão precisa deixa de ser sabível sem rodar** — e ele existe justamente porque o verde completo **não** roda sem segredo |
| tirar o arquivo inteiro | simples | as **10** travas limpas de clone daquele arquivo saem do portão que roda em todo push |

A terceira linha é o que a medição **por arquivo** comprou. O total não separa *"o arquivo inteiro
depende"* de *"4 travas de 14 dependem"*, e os consertos são diferentes:

> **Mover por ARQUIVO quando a dependência é de TRAVA paga a conta de quem não mediu.**

**Depois do conserto, remedido: 31 de 31 passam sem os clones** — os 30 de antes mais a trava
nova. A afirmação do nome é **verdadeira**, e agora por medição.

---

## 4 · A trava que faltava — e a régua estática acusou a si mesma, sétima da família

O item pediu a quarta coisa: *"nenhuma régua confere hoje que o nome do trabalho corresponda ao
que ele precisa… e ela é a única coisa que impede isto de voltar, já que o CI está desligado e não
vai desmentir ninguém."*

**A primeira versão que eu escrevi procurava no fonte a frase `join(RAIZ, "..", "motor-testfit")`
— e acusou a própria trava que a demonstra**, porque a fixture dela contém essa frase. Família do
D142 / D155 / D257. E a cura da casa, tentada nas **duas** formas, não serve aqui:

| limpeza | o que faz | por que não serve |
|---|---|---|
| `soOCodigo()` | esvazia o conteúdo das strings | o alvo **é** uma string: a régua fica **cega** |
| `semComentarios()` | tira comentário e regex, guarda strings | a fixture também é string: acusa de novo |

> **Quando o que você procura e o que você quer ignorar são a MESMA FORMA, não há régua estática
> que os separe.**

A saída não é uma régua mais esperta: é a **outra pergunta**, e o item já tinha dito qual. A trava
passa a **ler a medição por execução** em vez de reler o fonte — *ela confere o que aconteceu, não
o que parece*. Ela reprova em seis formas, cada uma demonstrada: arquivo que depende de clone na
lista; trabalho renomeado; lista que a régua não acha; arquivo listado que não existe; arquivo no
portão **sem linha na medição**; e arquivo que a medição viu **reprovando**. **11 travas, os dois
lados.**

**O buraco fica declarado:** a prova envelhece se ninguém rodar o `lab84`, e por isso a régua
cobra que a prova cubra **exatamente** a lista de hoje, com a receita na mensagem.

---

## 5 · E o ponto fixo: a trava está na lista que ela guarda (D283)

A trava nova entrou na lista do trabalho — ela é limpa de clone, então é o lugar dela. Mas a régua
cobra que **todo** arquivo da lista tenha saído verde na medição, e a medição **roda a trava**, que
lê a medição **anterior**.

**Medido, nas duas voltas:** na primeira execução a trava reprovou, a prova gravou esse vermelho, e
a execução seguinte leu o vermelho e **reprovou de novo pelo mesmo motivo** — não pelo defeito,
pelo registro do defeito.

> **Guarda que lê uma medição de si mesma não tem lado bom alcançável.** O ponto fixo existe, mas
> não se chega a ele por iteração: cada volta confirma a anterior.

O conserto não foi afrouxar a régua, foi **dizer que o arquivo dela está fora do próprio gate, e
por quê** — uma constante com nome (`A_TRAVA_DESTA_REGUA`) e o motivo ao lado, em vez de um
`filter` que o próximo leitor tomaria por descuido. **E o que fica garantido sem o gate está
dito:** a ferramenta mede esse arquivo igual aos outros, a prova publica a linha dele, e o verde
completo o roda.

---

## 6 · E a varredura da casa pegou o MEU instrumento de medir

A ferramenta nova escrevia `reprovam: n(/(\d+) fail/) ?? 0`, e a `varredura-de-chamadas` acusou:
*"`?? 0` sobre o resultado de uma CHAMADA: a falha vira um número que parece certo"*. **Com razão,
e é o D23:** num arquivo que estoura antes de rodar trava nenhuma, `0 reprovam` com `exit 1` é uma
contradição publicada. Virou `null`.

*A régua da casa achou no instrumento com que eu media — e instrumento de medir também é código
desta casa.*

---

## 7 · Entrega

- **prova:** [`docs/provas/LAB-84/as-trinta-por-execucao.json`](../provas/LAB-84/as-trinta-por-execucao.json)
  — na lista declarada de exceções do §7, porque o objeto é o conjunto de **arquivos de trava**;
- **decisões:** **D282** (a medição, a decisão e a régua que acusou a si mesma) e **D283** (o ponto
  fixo). E o **D279 foi corrigido riscando**, com a medição ao lado: *"duas"* → **quatro**;
- **o CI não foi religado**, como o item mandou: a medição rodou nesta máquina, e o gatilho
  continua comentado por decisão de família;
- **os três clones vizinhos:** `git status` limpo nos três e nos commits em que estavam — nada
  escrito em repositório vizinho (§4);
- **verde:** o comando único, **conferido aqui, não no GitHub** — **918** travas na esteira e
  **17** no `testfit`, 7 passos, `exit 0`. A lista do CI sem os clones vizinhos foi de 513 a
  **520**, em **31** arquivos;
- **conta dos itens abertos:** **17 → 16**, por entrega, nos **cinco** lugares que a contam
  mais a §4-A do `CLAUDE.md`.
