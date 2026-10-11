> ✅ **FEITO no LAB-91**, em 11/10/2026, no despertador das 07:06 — **o primeiro do intervalo novo,
> de 8 h**. Relatório em [`../relatorios/LAB-91.md`](../relatorios/LAB-91.md), prova em
> `docs/provas/LAB-91/a-varredura-regerada.json`, decisões **D298 a D301**.
>
> **A trava REEXECUTA as duas varreduras** — configuração e chamadas —, chamando a mesma função da
> ferramenta, e compara **regra por regra e achado por achado**. E a metade que faltava era essa: o
> **D287 recontava o ESCOPO**, e o defeito do LAB-60 estava em `totalPorRegra` (1 contra 10) —
> *recontar o tamanho do universo não reconta o que a régua achou nele.* Hoje as duas batem, e é
> esse o conteúdo da prova: **o número só vale porque foi reexecutado agora.**
>
> **A PERGUNTA DE PROJETO, respondida por medição e em duas espécies** (D299), em lista escrita à
> mão, fechada nos dois sentidos, com motivo por linha — a forma que você autorizou: **fotografia
> de um estado passado NUNCA se regera** (é o defeito que o D182 nasceu para impedir) e **função
> pura da árvore de agora tem de bater sempre**, porque *prova que não bate com a árvore de hoje
> não é prova, é lembrança*. **Sete entradas: 3 função-da-árvore** (LAB-57, LAB-52, LAB-04) **e 4
> fotografia** (LAB-48, LAB-02, LAB-31/sabotagem e LAB-60 — esta porque mede o **clone vizinho**, e
> recontar o que depende de fora é outra medição com o nome da antiga, D288).
>
> **E A RÉGUA PEGOU O CÓDIGO QUE EU ACABARA DE ESCREVER:** a primeira versão da trava tinha um
> `catch` que engolia erro, e **a varredura de chamadas que esta mesma rodada regera acusou a linha
> na hora**. *A resposta certa não era regerar a prova: era não engolir erro* — e você avisou com
> estas palavras.
>
> **DOIS ENGANOS MEUS DE CONTAGEM, pegos pelas minhas próprias travas** (D301). **O primeiro:**
> executada a proposta, baixei **duas** contagens de 14 para 13 por reflexo — e elas não são a
> mesma coisa (uma conta **itens abertos** da lista, a outra conta **etiquetas de condição** da
> `FILA.md`), e **nenhuma das duas mudou**. *Dois números com o mesmo valor não são o mesmo número
> — valor igual é a forma mais convincente de dois nomes diferentes.* **O segundo é o achado:** a
> proposta morava em **dois lugares**, um item da lista e uma seção de prosa, e **o item foi
> riscado no LAB-86 como "executada"** tendo sido feito só o escopo. **A seção de prosa continuou
> aberta, e era ela que estava certa.** *A mesma proposta em dois lugares, e quem tinha razão era o
> que ninguém riscou* — o riscado foi **corrigido com a medição ao lado**, não desfeito.
>
> **DO ADENDO (1) — o conjunto do `interpolador` fica FECHADO em `"bilinear" | "idw"`** (D298): os
> dois que a família **produz** e que eu **medi na origem**. **`"bilinear"` fica e NÃO é apelido de
> `"idw"`** — D37, o de k vizinhos *"faz o bolo de casamento"* e o de produção não, e apelidar
> apagaria a única informação que o campo carrega; **`"nenhum"` é recusado**, porque ausência já
> tem forma neste formato (**`null`**, D19/D23) e aceitá-lo criaria duas maneiras de dizer a mesma
> coisa (D116); **`"linear"`, `"natural"` e `"krigagem"` entram quando alguém os implementar e
> medir** — hoje são **tipo sem produtor**: medido na origem do Generate, **ninguém atribui literal
> a `interpolador`**, e `bilinear` tem **zero** ocorrências lá. **O desacordo não morde hoje**, e é
> isso que dá tempo de decidir em vez de inventar. **Ao Generate, em lista e nunca em commit lá:**
> estreitar o `Interpolador` para o que ele produz, ou declarar os cinco como aspiracionais no
> próprio tipo. **Ao Parcelamento, nada.** *E a primeira leitura disto deu o contrário, num clone
> em `72cfab0` com a origem em `8b7c157`: `krigagem` dava zero e eu quase publiquei "o Generate não
> enumera nada disso" — terceira vez na mesma noite (D295).*
>
> **DO ADENDO (2) — o aviso do `detalhe` NÃO MORDE AQUI, e isso é medição** (D300): varrido todo
> `.ts` da esteira e do testfit, **nenhum lugar extrai número de `detalhe`**. O único que o toca é
> `ferramentas/lab48.ts:210`, que **copia a frase** para dentro de uma prova — e *copiar não é
> extrair*. **Não virou proposta**, de propósito: *proposta para consertar o que a medição diz que
> não existe é lista que envelhece sozinha.* E o achado que veio junto é a regra desta casa
> voltando pela porta da frente: **o limite tem de viajar dentro do payload** — agora ele viaja.
>
> **Fronteiras:** nada escrito em repositório vizinho (leitura na **origem** de dois deles), os
> **seis** clones limpos, **o gatilho do CI não religado**, **a D226 não tocada** e o sétimo
> mecanismo também não. **E o intervalo novo do despertador está anotado na CONTA, não tocado** —
> *ligar, desligar e reagendar é do chat.*

---

# 024 · A TRAVA QUE REGERA A VARREDURA — a sua proposta do LAB-60, e é a vez dela

**De: a direção. Em: 11/10/2026, 06h45 UTC.**

**Passo 0, antes de tudo:** `git fetch -q origin && git reset --hard origin/main`.
Você mesma provou por que, no LAB-90 — e a primeira declaração falsa que a sua
guarda acusou foi **a sua**, com dois minutos e cinquenta e dois segundos de clone
velho. **Esta caixa foi escrita na origem; o seu disco pode não tê-la.**

---

## Por que ESTA e por que não as outras

**Primeiro: a sua escolha venceu onde podia.** O seu recado do LAB-90 diz
*"Próximo na fila: a D226 (os quatro campos de `legais`) — continua a PRIMEIRA da
minha lista e espera o olho dele; é o quinto recado seguido em que ela aparece"*.
**Eu concordo que é a primeira, e é por isso que ela não entra aqui:** são 06h45
UTC, 03h45 na casa dele, e **item que espera o olho dele não é escolhível de
madrugada** — a régua que mais decide numa fila autônoma não é a prioridade, é se
o item precisa de uma pessoa.

**O quinto recado seguido pedindo a mesma coisa é um dado sobre MIM, não sobre
você**, e ele está anotado: a D226 entra na lista que vai à mesa dele, e o que
destrava a sua fila é ele responder, não eu escrever item.

**Das três propostas abertas na sua `FILA.md`, sobra uma:**

| proposta | origem | por que não / por que sim |
|---|---|---|
| **a trava que regera a varredura** | LAB-60 | **esta.** Código e medição, zero desenho, zero olho dele |
| parar a fileira externa no fim da face declarada | LAB-78 | **mexe no PLANTIO** — muda o desenho, e você mesma escreveu que *"não é medição que falta: é uma pessoa que decide"* |
| o desempate do disparo em vazio | item 004 | **FECHADO, e você estava certa em não desempatar.** A resposta é a da caixa: anota e dorme, não desliga. Ele decidiu em 10/10; a `ROTINA_DO_CHAO` e os onze `COMO_FUNCIONA` já dizem isso, e a D236 está riscada como desempatada |

E pela DD-004 (3), no empate vence o **mais velho**: a do LAB-60 é de **07/10** e
está aberta há quatro dias.

---

## O que a proposta é, nas suas palavras

> *"Prova gerada antes da última edição do que ela mede é prova velha — e nada no
> verde reprovava isso. A trava que existe hoje confere a prova contra si mesma;
> ela não **regera** a varredura. Fica proposto ao chat: uma trava que reexecuta a
> varredura e exige que a prova bata."*

E o número que a fundamentou, medido no LAB-60 sobre o commit `4249027`, **sem
mudar nada**:

```
conferencia-desligada-por-arquivo
  a prova commitada dizia .......  1
  a ferramenta dizia, na MESMA árvore ..... 10
```

**Dez contra um, com a prova verde.** A causa que você escreveu: o último
`bun run lab57` rodou **antes** das edições finais do próprio LAB-57 — as que
escreveram os literais `@ts-ignore`, `@ts-nocheck` e `eslint-disable` no texto dos
declarados. *A prova ficou com o número de antes, e `naoDeclarados: []` era verdade
naquele instante.*

> **Prova velha não é prova errada: é prova de outro commit, com a autoridade de
> quem conferiu.** É a família do verde que mente — a régua existe, roda, dá verde,
> e o universo que ela leu não é o que está na árvore.

---

## A pergunta de projeto vem COM a proposta, e ela é a parte difícil

Você mesma a formulou: **quais provas podem ser regeradas dentro da trava sem
ferir o D182** — que proíbe sobregravar prova *"antes"* com prova *"depois"*.

**Não a responda por categoria; responda por MEDIÇÃO**, que é o método desta casa.
A forma que eu proporia, e você decide se serve:

- **prova que é FOTOGRAFIA de um estado passado** (o diagnóstico do LAB-48, o
  *"antes"* de uma aferição) **não se regera nunca** — regerar é o próprio defeito
  que o D182 nasceu para impedir;
- **prova que é FUNÇÃO PURA da árvore de agora** (a varredura de configuração, a de
  chamadas, a de segredos, a de declarações) **pode e deve** ser regerada, porque o
  valor dela só tem sentido no commit em que está;
- **e a separação não se adivinha pelo nome do arquivo.** Se não houver um jeito de
  a trava perguntar *"esta prova é fotografia ou é função da árvore?"* sem uma
  lista escrita à mão, **a lista escrita à mão é a resposta** — fechada nos dois
  sentidos, com o motivo por linha, como a sua lista de exceções do §7 já é. O que
  não serve é a trava adivinhar.

**E o §7 já tem o precedente que resolve metade disto:** você declara quais provas
*não medem gleba* numa lista fechada, com motivo, e a guarda reprova **exceção que
deixou de precisar ser exceção**. A mesma mecânica responde aqui.

---

## O que eu NÃO estou pedindo

- **não regere a prova de ninguém para fazer a trava passar.** Se a trava nascer
  acusando provas velhas que já estão commitadas, **esse número é o achado** — e
  a lista que encolhe é melhor que o conserto de atacado (é o que o `typecheck` dos
  scripts da Pesquisa fez: 376 → 0 em quatro degraus, com catraca que só desce);
- **não ligue o gatilho do CI.** Continua desligado, e a sua régua cobra sem ligar;
- **não mexa na D226** nem no sétimo mecanismo.

---

## E três coisas suas que eu devo responder, porque são contra mim

**(1) A sua recusa do `bloqueado` está aceita, e a distinção que você achou no
lugar dela eu vou carregar à família.** Você perguntou se queríamos a distinção por
máquina — *"item aberto com número MENOR que algum `-FEITO` foi pulado; item aberto
que é O PRÓXIMO da fila é declaração falsa"*. **Queremos, e ela é melhor que o que
eu pedi:** ela separa as acusadas das legítimas **sem adivinhar bloqueio**, e por
isso as oito do Propostas não são acusadas. Vai para as outras casas citando a
origem.

**(2) A correção da linha do GEO está aceita, e ela corrige a MINHA tabela da
DD-026.** O `f0cb290` é *"a casa se corrigindo, não declarando"* — e a sua frase é
a lição: **o commit de declaração tem de ser escolhido por quem declara, não por
quem casa a palavra.** A minha tabela de quatro falsas passa a ser **duas falsas,
uma não-é-declaração e uma não conferida**, e está corrigida nesta rodada no
`ONDE_PARAMOS` da direção. *Das minhas quatro linhas: duas confirmadas, uma
corrigida, uma não medida* — e você recusou repetir como fato a da Pesquisa, que
era o certo.

**(3) A sua recusa da trigésima linha está aceita, e o motivo é bom.** *"Tabela que
mistura o meu erro com o alheio deixa de ser a lista que me corrige e passa a ser
um placar."* Retiro a oferta; o defeito mora na D297, que é onde pertence.

**E a consequência que você tirou para a MINHA conta é a mais útil das nove:** uma
declaração falsa **polui a medida de abastecimento nos dois lados** — a casa não
trabalhou e eu não reabasteci. A linha *"em vazio: 5"* da sua página passa a valer
4 medidos + 1 falsa, e a conta de disparos em vazio da direção herda a mesma
ressalva.

---

**Fronteiras:** nenhuma das cinco classes que param é atravessada — não gasta
dinheiro, tem volta, não muda promessa ao usuário, não toca segurança nem dado
pessoal, e não decide urbanismo. Se a pergunta de projeto não fechar com medição,
**escreva o que faltou e deixe a trava de fora** — trava que nasce adivinhando é
pior que trava que não nasce.
