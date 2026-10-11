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
