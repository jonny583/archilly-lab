# LAB-50 · Por que a passagem externa põe lote a 1,8 km da face entregue

**06/10/2026** · prompt da fila de 06/10, o terceiro. Saiu da minha lista de *"proposto ao
chat"*, escrita no LAB-46 (D161).

**É pergunta, não acusação** — o chat foi explícito, e o motivo é o D161: eu já classifiquei
esses mesmos lotes pelo **id** `-eN` e errei **19 de 33**.

---

## 0 · A resposta, em duas linhas

> **A faixa do lote externo é um SEMIPLANO, não um retângulo sobre a face.** O motor usa a
> face entregue para tirar dela uma **direção** e uma **origem**, corta a gleba inteira pela
> **RETA INFINITA** que passa por ela, e distribui os lotes pela **caixa envolvente** da
> faixa — cuja largura é a da faixa, não o comprimento da face.

**Numa gleba côncava, a reta de uma face de 180 m volta a entrar no terreno longe.** Os
lotes distantes não estão em outra face: estão **na mesma reta**, numa reentrância a 1,8 km.

**E nenhuma das duas hipóteses que o chat ofereceu era a resposta** — uma está parcialmente
certa, a outra foi **descartada por medição**. O §2 mostra as duas.

---

## 1 · O mecanismo, lido no motor (só leitura)

`motor-testfit` · `src/lib/lab/motor.ts` · `reservarFacesExternas`:

```ts
for (const idx of faces) {
  const p0 = perim[idx % perim.length];
  const p1 = perim[(idx + 1) % perim.length];
  …
  const ang   = Math.atan2(dy, dx);          // ← a DIREÇÃO vem da face
  const cBase = nx * p0.x + ny * p0.y;       // ← a ORIGEM vem da face
  const faixa = recortarSemiplano(restante,  nx,  ny,   cBase + prof);   // ← SEMIPLANO
  const sobra = recortarSemiplano(restante, -nx, -ny, -(cBase + prof));
  …
  const rect = caixa(local);                                   // ← CAIXA ENVOLVENTE
  const n    = Math.max(1, Math.round((rect.maxX - rect.minX) / a.testadaExterna));
}
```

**A linha que explica tudo é a penúltima.** `rect.maxX - rect.minX` é a largura da **faixa**,
e a faixa é um semiplano: ela não termina onde a face termina. `prof` é
`max(8, areaLoteExterna / testadaExterna)`.

**O que o motor promete, e ele não mente:** `facesLoteamento` são *"índices das faces do
perímetro que recebem lotes voltados para a rua"*. Ele lê o índice como **reta**; eu li como
**segmento**. Essa é a diferença inteira, e é a pergunta do D127 feita de novo — *"o que este
campo faz no motor?"*.

---

## 2 · As quatro previsões, e a gleba de controle que decide

Se o mecanismo é esse, ele **prevê** coisas mensuráveis. Previsão que não pode falhar não
vale nada, então as quatro são falsificáveis — e **a quarta falhou**, o que é o resultado
mais útil do prompt.

Duas glebas, e a segunda existe para a conclusão não valer para uma só (a lição do LAB-40).
**É também o controle perfeito, e por sorte:** `geo-antonina` tem **141,8 ha e 20 vértices**,
côncava; `ensaio-com-testada` tem **47 ha e 4 vértices**, **convexa**.

| | `geo-antonina` | `ensaio-com-testada` |
|---|---|---|
| face entregue | **1**, índice 0, **180,2 m** | **1**, índice 1, **587,5 m** |
| lotes externos | 33 | 51 |
| **P1 · perpendicular à RETA** | **✓ 20,1 m** (teto 32 m) | **✓ 0 m** |
| **P2 · ao longo da reta** | **✓ 1 805,6 m** | **✗ 0 m** |
| **P3 · corre o perímetro?** | **✓ não** — 1 face de 20 | **✓ não** — 1 face de 4 |
| **P4 · a faixa foi reservada?** | **✗ não** — 10 lotes sobre leito | **✗ não** — 9 lotes sobre leito |

### P1 e P2 confirmam o semiplano, e o controle é a prova

**Em Antonina, os 33 lotes estão a no máximo 20,1 m da RETA** da face — dentro da
profundidade da faixa — **e a até 1 805,6 m ao LONGO dela**. O 1 805,6 ao longo bate com o
1 805,7 ao segmento que o LAB-46 mediu: **a distância toda é longitudinal**.

**E na gleba convexa o mesmo mecanismo não produz nenhum lote distante:** perpendicular
**0 m**, ao longo **0 m**, e **os 51 lotes a ≤ 0,5 m** do segmento. Numa gleba convexa o
semiplano sobre a reta **é** a faixa sobre a face — então nada vai longe.

> **Não é o motor que erra a face. É a reta de uma face que, num contorno côncavo, volta a
> entrar no terreno — e a faixa vai com ela.**

A distribuição em Antonina mostra as duas coisas ao mesmo tempo: **14 lotes a ≤ 0,5 m** da
testada (a faixa sobre a face, correta), **4 entre 0,5 e 50 m**, e **15 a mais de 50 m** (as
reentrâncias da mesma reta).

### P3 descarta a segunda hipótese do chat, por medição

*"Pode ser que a passagem externa corra o perímetro inteiro."* **Não corre.** O laço é
`for (const idx of faces)` — só os índices entregues —, e medido: **1 face de 20 vértices**
em Antonina, **1 de 4** na outra. Descartada com número, não com leitura.

### P4 falhou — e matou DUAS explicações minhas

A faixa **não é de fato reservada**: há lote externo sobre o leito de via do próprio motor
em **as duas** glebas (10 e 9 lotes; o Validator mediu 68,5 a 157,4 m² no LAB-48).

**Primeira explicação minha: "corte de semiplano numa gleba CÔNCAVA não separa faixa de
sobra".** Boa, plausível, e **morta pelo controle**: acontece igual na gleba convexa de
4 vértices. **A concavidade não é a causa.**

**Segunda: "o leito é eixo ± meia-caixa, então a via logo dentro da sobra derrama de volta
para a faixa".** Também morta, e por medição: o eixo das vias culpadas está a **0,1 m**
(V2), **0,3 m** (V10) e **0,8 m** (V1) da **reta da face** — ou seja **dentro da faixa**, e
não na beira dela. Não é derrame: a via está lá.

**O que ficou medido, e é só isto:** *o eixo da via culpada corre praticamente sobre a reta
da face entregue — a via do plano e a faixa do lote externo ocupam o mesmo chão.*

**Por que o motor desenha via sobre a face que ele mesmo reservou: NÃO ATRIBUÍDO.** Tenho
candidatas (o `if (sobra.length >= 3) restante = sobra;` deixando `restante` inteiro num
corte degenerado; a via de acesso sendo posta na mesma face), **e não medi nenhuma**. Vai
como pergunta na lista numerada, não como acusação. *Hipótese descartada em silêncio volta
como hipótese nova no prompt seguinte, então as duas mortas ficam escritas na prova.*

---

## 3 · O preço, e o que isso muda na leitura do LAB-48

O LAB-48 atribuiu **18 `frente`** e **11 `via-sobre-lote`** a *"o motor"*, genericamente.
**Agora os dois têm mecanismo, e são o mesmo:**

| violação | n | o mecanismo, agora nomeado |
|---|---:|---|
| `frente` distantes | **18** | a faixa é semiplano: o lote nasce numa reentrância da reta, longe de qualquer rua |
| `via-sobre-lote` | **11** | a via do plano corre sobre a reta da face, no chão da faixa |

**29 das 40 violações de `geo-antonina` saem de `reservarFacesExternas`.** E a leitura muda
de qualidade: não é *"o motor põe lote em lugar errado"*, é **uma escolha de implementação —
semiplano em vez de retângulo — que é correta em gleba convexa e produz lote órfão em gleba
côncava.**

**E há um número que isto NÃO muda:** os 14 lotes a ≤ 0,5 m da testada em Antonina e os 51
de `ensaio-com-testada` são a entrega **funcionando**. O mecanismo não está errado por
inteiro; ele não tem limite longitudinal.

---

## 4 · Para o Laboratório de Parcelamento — lista numerada, nada escrito lá

**Nada foi escrito no vizinho.** Os três clones foram conferidos e estão limpos (§4).

1. **A faixa do lote externo precisa de limite LONGITUDINAL.** Em
   `reservarFacesExternas`, a `faixa` é um semiplano e os lotes saem da **caixa envolvente**
   dela (`n = round((rect.maxX - rect.minX) / testadaExterna)`). Recortá-la também pela
   extensão do **segmento** da face — ou, mais generoso, pela projeção do segmento mais uma
   folga declarada — resolveria. **Custo medido: 18 violações `frente` em `geo-antonina`, com
   lote a 1 805,6 m da face de 180,2 m.** Em gleba convexa o defeito não aparece, e é por
   isso que ele sobreviveu: `ensaio-com-testada` (47 ha, 4 vértices) dá **0 m** de desvio.
2. **A via do plano é desenhada sobre a faixa reservada.** Eixo a **0,1 m** (`V2`), **0,3 m**
   (`V10`) e **0,8 m** (`V1`) da reta da face entregue. **Custo medido: 11
   `via-sobre-lote`**, 68,5 a 157,4 m² cada. **Isto é pergunta, não diagnóstico** — eu matei
   duas explicações minhas e não tenho a terceira. Duas candidatas que vocês conferem mais
   rápido que eu: o `if (sobra.length >= 3) restante = sobra;`, que deixa `restante` inteiro
   quando o corte sai degenerado; e a via de acesso caindo na mesma face.
3. **`prof` não é observável de fora.** `max(8, areaLoteExterna / testadaExterna)` não sai na
   SAÍDA, e sem ele quem mede por fora precisa estimá-lo pela geometria dos lotes — **o meu
   estimador deu 0 na gleba convexa** e foi justamente o que me impediu de fechar o item 2.
   Publicá-lo em `parametrosUsados` custa uma linha.

---

## 5 · O achado contra mim, e ele é de caminho (D135 outra vez)

A primeira versão da ferramenta leu o perímetro em **`terreno.gleba.anel`** e estourou na
primeira linha. O caminho certo é **`gleba.anel`**: `terreno.gleba` é o caminho **dentro da
entrada do motor**, não no contrato — e foi exatamente o que o D135 ensinou, quando eu
publiquei por um instante *"a ida não entrega o furo da gleba"* por ter olhado o caminho
errado.

**Desta vez ele mordeu do lado bom:** estourou em vez de devolver vazio. *Caminho errado que
estoura é caminho errado barato; caminho errado que devolve `undefined` é uma acusação
publicável.* O comentário no código diz isso, para a próxima pessoa não repetir.

---

## 6 · Entrega

| o quê | onde |
|---|---|
| a ferramenta | [`ferramentas/lab50.ts`](../../external-engines/esteira/ferramentas/lab50.ts) · `bun run lab50` |
| a prova | [`docs/provas/LAB-50/passagem-externa.json`](../provas/LAB-50/passagem-externa.json) |

A prova **mede gleba**, então traz gleba, motor, semente e contrato — sem exceção a declarar.

## 7 · As decisões

- **D173** — a passagem externa usa a face entregue como **RETA, não como SEGMENTO**: a
  faixa é um semiplano e os lotes saem da caixa envolvente dela. **Correto em gleba convexa,
  órfão em gleba côncava** — e a prova é o controle, não o argumento;
- **D174** — **previsão que falha é o resultado mais útil**: o P4 matou duas explicações
  minhas, e as duas ficam escritas na prova. *Hipótese descartada em silêncio volta como
  hipótese nova no prompt seguinte;*
- **D175** — **caminho errado que estoura é barato; caminho errado que devolve `undefined` é
  uma acusação publicável** (a forma do D135, mordendo do lado bom).
