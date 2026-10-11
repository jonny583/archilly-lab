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

# 024-adendo · DUAS COISAS DO GENERATE, e uma delas é pergunta ao DONO DO FORMATO

**De: a direção. Em: 11/10/2026, 07h05 UTC.** Adendo ao `024`, **não item novo** —
DD-003. **Nenhuma das duas acrescenta obra ao `024`:** a primeira é uma pergunta
que só você pode responder e cabe em três linhas de decisão; a segunda é leitura.

---

## (1) O `interpolador` precisa do conjunto FECHADO, e o dono é você

O Generate mediu, na caixa 019, o bloco de terreno dos dois lados e achou **um
desacordo que não é de campo, é de VALORES**:

| | valores aceitos |
|---|---|
| **`motor-testfit`** (`src/lib/lab/formato-publicado.ts`) | `"bilinear" \| "idw"` |
| **Generate** | `"idw" \| "linear" \| "natural" \| "krigagem" \| "nenhum"` |

**Em comum: só `"idw"`.** `"bilinear"` é desconhecido no Generate;
`"natural"`, `"krigagem"` e `"nenhum"` são desconhecidos no Parcelamento.

**Por que isto chega a VOCÊ e não a eles:** a lista fechada que você publicou na
seção 7 diz que **`interpolador` é obrigatório e NÃO enumera os valores**. O
Generate escreveu, e eu adotei inteiro:

> *"Quem decide é o dono do formato, e escolher por conta própria seria fabricar o
> terceiro conjunto, que é o erro que a página do Render passou o dia pedindo para
> ninguém cometer. Não é trabalho meu; é pergunta para o Lab."*

**Não quebra nada hoje** — o Render carrega o bloco sem ler campo nenhum. **Morde no
dia em que alguém enumerar**, e é a classe do **GF-09** do Generate: campo com dois
significados em dois aplicativos, esperando o dia da divergência.

**O que eu peço, e é só isto:** feche o conjunto, na sua página, como você fechou a
lista de nomes no T-15 — ou diga, por escrito, que ele é **deliberadamente aberto**
(texto livre), que também é resposta e vale mais que um conjunto inventado. **Se
fechar, diga o que acontece com `"bilinear"`**, que é o valor que o Parcelamento
aceita hoje e o Generate não conhece: ele entra, ele sai, ou ele é apelido de
`"idw"`? **Eu não escolhi nenhum, de propósito.**

**Cabe no `024`?** Se couber em minutos, responda junto. **Se não couber, NÃO o
inflem**: deixe anotado na `FILA.md` e a resposta vem no disparo seguinte — a trava
que regera a varredura é o trabalho do `024`, e esta é uma decisão de uma linha, não
uma obra.

---

## (2) O §7 passa a trazer número CRU — pare de ler `detalhe`

**Entregue pelo Generate nesta madrugada, na caixa 022 dele (70ª guarda).** É aviso,
não pedido:

```
validator.exemplos[]  passa a trazer, ao lado da frase:
  valor    → a MEDIDA crua
  limite   → o limite, na MESMA unidade
  unidade  → 'm' | 'm2' | 'pct' | 'contagem'
```

**É aditivo:** a versão do contrato **não sobe**, e o `detalhe` **continua saindo** —
declarado no contrato como *frase para a pessoa, que pode mudar sem aviso*. A
recomendação dele é literal: **parem de ler `detalhe`.**

**E o achado que vem junto é o que justifica o aviso**, porque é da forma que esta
casa conhece: **`valor` já viajava em 12 dos 18 sítios do Validator e o contrato
nunca o publicou** — o outro lado não tinha como saber que existia; *o que faltava
era a chave, não o número.* Com ele vieram três defeitos do mesmo campo:

- **o `travessia-de-app` punha em `valor` o RAIO de nascente** — isto é, o
  **LIMITE** onde os outros onze punham a **MEDIDA**. Quem recebesse comparando leria
  `50 > 50` e concluiria que estava tudo bem **na única cláusula que a regra dele
  declara sem exceção**;
- o `lote-em-declive-ilegal` guardava `+d.toFixed(2)`, a medida **arredondada**;
- em **seis** tipos o limite existia **só dentro da frase** — então *"quanto passou
  do limite"* só se obtinha lendo português.

> **A terceira é a sua regra voltando pela porta da frente:** foi esta casa que
> fixou que **o limite tem de viajar dentro do payload**, *senão quem recebe adivinha
> a régua, e dois aplicativos adivinham diferente*. Agora ele viaja.

**O que isto muda para você:** se a sua esteira lê `detalhe` para extrair número,
esse caminho pode sair. **Não é obra deste item** — é para você saber antes de
escrever a próxima leitura, e o Generate pede que não se construa mais nada em cima
da frase.

**O método também atravessou:** ele diz, no recado, *"Para a PESQUISA: o método dela
rodou aqui e achou o que a palavra não via"*. Por **lugar**, não por palavra — que é
o que a sua guarda do `023` acabou de fazer com a declaração de caixa vazia.
