> ✅ **FEITO no LAB-84**, em 10/10/2026, no despertador das 20:05. Relatório em
> [`../relatorios/LAB-84.md`](../relatorios/LAB-84.md), prova em
> `docs/provas/LAB-84/as-trinta-por-execucao.json`, decisões **D282 e D283** — e o **D279
> corrigido riscando**, com a medição ao lado.
>
> **A tabela está publicada, por execução: dos 30, vinte e nove passam sem os clones e UM
> reprova** — `commit-dos-vizinhos.test.ts`, com **4 travas de 14**. **E eu havia dito DUAS**, no
> recado que gerou este item: contei os `expect` cuja mensagem eu reconhecia e não vi as outras
> duas do mesmo `describe`, que dependem da variável `cabeca` e não repetem a frase. *Régua de
> leitura acha o que ela reconhece; execução acha o que acontece* — e a diferença foi de 100 %.
> **Você estava certo em não aceitar o número lido** (D282).
>
> **A decisão, com o que se perde escrito:** movi as **quatro** travas para
> `commit-dos-vizinhos-com-clone.test.ts` e **não** renomeei o trabalho. O nome é a única coisa
> que torna aquela lista rodável em qualquer lugar sem preparo, e ele existe justamente porque o
> verde completo **não** roda sem segredo. Tirar o arquivo inteiro — a saída simples — custaria as
> **10** travas dele que são limpas de clone: *mover por ARQUIVO quando a dependência é de TRAVA
> paga a conta de quem não mediu.* **Remedido: 31 de 31 passam sem os clones.**
>
> **A trava que faltava existe, e a primeira versão dela acusou a si mesma.** Eu escrevi a régua
> estática que você podia esperar — procurar `join(RAIZ, "..", "motor-testfit")` no fonte — e ela
> reprovou **a própria trava que a demonstra**, porque a fixture dela contém essa frase. Sétima da
> família do D142/D155/D257. E a cura da casa não serve: `soOCodigo()` esvazia strings e o alvo
> **é** uma string, então a régua fica cega; `semComentarios()` guarda strings e a fixture também
> é string. **Quando o que você procura e o que você quer ignorar são a mesma forma, não há régua
> estática que os separe** — então a trava passou a **ler a medição por execução**, que é o que o
> seu próprio item já tinha dito ser a resposta.
>
> **E ela está na lista que guarda, o que criou um PONTO FIXO:** a medição roda a trava, e a trava
> lê a medição anterior, então o primeiro vermelho dela se realimentava. Medido nas duas voltas. O
> conserto não foi afrouxar: foi **dizer que o arquivo dela está fora do próprio gate, e por quê**
> (D283), com a ferramenta medindo-o igual aos outros e a prova publicando a linha dele.
>
> **O CI não foi religado**, como você mandou: a medição rodou nesta máquina. **As três árvores
> vizinhas ficaram limpas e nos commits em que estavam**, e nada foi movido no vizinho — foi por
> isso que a medição usou uma CÓPIA do repositório em vez de tirar os clones do lugar.

---

# 017 — O NOME DO TRABALHO DE CI É UMA AFIRMAÇÃO: meça as 30, depois decida

**Da direção, 10/10/2026, 19h58 UTC. Rodada do chão.**

## De onde este item sai — do seu LAB-83, e você disse exatamente o que falta

O seu recado do LAB-83 fecha o achado (5) assim, e é a razão deste item:

> *"O trabalho `guardas que não precisam dos clones vizinhos (NÃO é o verde)`
> lista um arquivo com DUAS travas que exigem o clone do `motor-testfit` no disco
> — uma desde o LAB-68 e uma minha, desta rodada. Sem o clone as duas reprovam, e
> o trabalho que existe JUSTAMENTE para rodar sem segredo falharia por falta do
> que o nome dele promete não precisar. **O NOME DE UM TRABALHO DE CI É UMA
> AFIRMAÇÃO SOBRE O QUE ELE PRECISA, E NENHUMA TRAVA A CONFERE** — e ela mora num
> arquivo que ninguém executa hoje, porque a execução automática está desligada
> desde 08/10: **afirmação desligada não é afirmação falsa, é afirmação que
> ninguém vai desmentir.** NÃO CONSERTEI, de propósito: escolher entre tirar as
> travas do trabalho ou fazer o nome dizer a verdade precisa de **uma medição que
> eu não fiz** (quantas travas de cada um dos 30 arquivos da lista dependem do
> clone), e prometer o número sem medir é a classe do D133. Foi para a FILA como
> proposta."*

**Este item é essa medição, e só ela.** Você nomeou o trabalho, nomeou o
bloqueador e disse qual número falta. Não há nada meu a acrescentar ao enunciado.

## O que o item pede

1. **A medição, arquivo por arquivo:** dos **30** arquivos da lista do trabalho
   `guardas que não precisam dos clones vizinhos (NÃO é o verde)`, quantas travas
   de cada um **dependem de clone vizinho no disco**. Publique a tabela, não o
   total: o total não decide entre os dois consertos.

2. **A medição é por EXECUÇÃO, não por leitura.** Você já mediu, no próprio
   LAB-83, que isto é a diferença entre régua e decoração — e a Pesquisa mediu
   hoje a forma gêmea: *"a prova de que ele abriu é `--listFiles`, nunca a linha
   da configuração"*. Rodar a lista **sem os clones** e ver quem reprova é a
   resposta; ler o `import` é a hipótese.

3. **Só então decida**, e escreva a decisão numerada: tirar as travas que
   dependem de clone para o trabalho completo, **ou** fazer o nome dizer a
   verdade. A sua própria frase dá o critério — o nome é uma afirmação, então a
   pergunta é qual das duas afirmações você quer poder desmentir.

4. **E ponha a trava que faltava:** nenhuma régua confere hoje que o nome do
   trabalho corresponda ao que ele precisa. Depois da medição, ela é escrevível —
   e ela é a única coisa que impede isto de voltar, já que **o CI está desligado e
   não vai desmentir ninguém**.

## Por que este item e não a D226

A D226 (os quatro campos de `legais`) é o que você chamou de *"o seguinte"*, e o
seu próprio item 016 a pôs como *"primeira da próxima caixa"*. **Eu não a escolhi,
e o motivo é o seu:** ela **muda o desenho** e espera o olho dele. Numa fila
autônoma, a régua que mais decide não é a prioridade — é se o item precisa do olho
dele. A D226 precisa; esta medição não.

**Ela fica em primeiro lugar na caixa seguinte**, e eu a levo a ele junto com as
outras que esperam desenho.

## O que NÃO fazer

- **não escrever no clone vizinho.** Eles são lidos só para leitura, e o `git
  status` deles fica limpo no fim — a sua própria §4;
- **não prometer o número antes de medir.** É a classe do D133, e você já a citou
  ao recusar;
- **não religar o CI** para medir: ele está desligado por decisão de família
  (orçamento de Actions), e a medição roda na sua máquina. Se a medição mostrar
  que religar mudaria a resposta, isso é linha para o Jonny, não commit.

## Como se sabe que deu certo

A tabela das 30 está publicada por execução; a decisão está numerada com o que se
perde; a trava nova acusa um nome que deixou de ser verdade e **cala** quando ele
é verdade; e o verde roda inteiro — *conferido aqui, não no GitHub*.
