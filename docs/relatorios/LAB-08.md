# LAB-08 — OS DOIS MOTORES LADO A LADO

**Data:** 14/09/2026 · **Semente:** 20260913 · **Contrato:** motor v1
**Régua:** o Validator e o Judge do **Generate** · **Glebas:** as duas
glebas-padrão do Generate, com o relevo que o LAB-03 lhes deu

---

## A tabela

Mesma gleba, mesma semente, mesmo Validator, mesmo Judge.

### `ensaio-47ha` — 47,0 ha, retângulo sintético, **zero restrições**

| | **Symbios 0.4.1** (recortado, LAB-02) | **Testfit T02** | Generate `ortogonal` | Generate `espinha` |
|---|---|---|---|---|
| **lotes** | **0** — não parcela | **599** (`espinha`) | **974** | 776 |
| área privativa | — | 238 190 m² (50,7 %) | 353 307 m² (75,2 %) | 302 654 m² (64,4 %) |
| lote médio | — | **397,65 m²** | 362,74 m² | 390,02 m² |
| quadras | **94** (27,4 ha) | — | — | — |
| via | 16 773 m | — | 64 028 m² de leito | 95 132 m² |
| **via fora da gleba** | 5,21 % → **0 %** | **0 %** | — | — |
| **violações** | **0** | **16** (testada 10, face-quadra 6) | 0 | 0 |
| **rampa** (cruzamento, máx) | **77,43 %** | **`null`** — não calcula greide | — | — |
| **quadro de áreas fecha?** | sim | **sim** (470 000 = 470 000) | **NÃO — +15,8 %** | **NÃO — +9,6 %** |
| tempo | 593 ms | 1 604 ms (20 variantes) | — | — |
| **determinismo** | **OK** | **OK** | — | — |

### `geo-antonina` — 141,8 ha, terreno real, 3 APP

| | **Symbios 0.4.1** | **Testfit T02** | Generate `ortogonal` | Generate `espinha` |
|---|---|---|---|---|
| **lotes** | **0** | **1 391** (`espinha`) | 1 389 | **1 656** |
| área privativa | — | 555 573 m² | 508 581 m² | 617 219 m² |
| lote médio | — | **399,41 m²** | 366,15 m² | 372,72 m² |
| quadras | **698** (160,6 ha) | — | — | — |
| via | 60 934 m | — | 161 131 m² de leito | 136 481 m² |
| **via fora da gleba** | 54,57 % → **0 %** | **0 %** | — | — |
| **violações** | **0** | **53** (testada 42, face-quadra 11) | 1 | 0 |
| conectividade | **70,4 %** no maior | — | — | — |
| **rampa** (cruzamento, máx) | **113,54 %** | **`null`** | — | — |
| **quadro fecha?** | sim | sim | sim | sim |
| tempo | 5 440 ms | 6 038 ms (20 variantes) | — | — |
| **determinismo** | **OK** | **OK** | — | — |

---

## Veredito por motor

### Symbios Tensor 0.4.1 — **entrega a etapa anterior, e entrega limpa**

Rede viária e quadras, **zero violações** nas duas glebas, zero metro de via fora
da divisa, determinístico, e **é o único dos três que calcula greide**. Mas ele
**não faz lote**, e por isso não disputa o Judge: `numLotes: 0`.

Enquanto não houver subdivisão de quadra — o **LAB-04**, o straight skeleton —,
ele não é um concorrente do outro motor: é um fornecedor de rede viária e
quadras para quem vai parcelar. As 94 e 698 quadras que ele entrega são o insumo
exato daquele prompt.

**A ressalva dele é a conectividade em terreno irregular:** 70,4 % do
comprimento no maior componente em `geo-antonina`. O recorte é necessário, e
custa caro numa gleba de contorno recortado.

### Testfit T02 — **o conserto funcionou, e sobrou o que já se sabia**

O item 1 da lista do LAB-07 era *"aparar a rede viária pelo perímetro"*. Medido:

| | LAB-07 (T00-A) | **LAB-08 (T02)** |
|---|---|---|
| variantes recusadas pelo esquema **sem** o aparo do Lab | **60 de 60** | **0 de 20** (`ensaio`) · **2 de 20** (`antonina`) |
| quanto o aparo do Lab ainda corta | **25 % a 40 %** | **0,32 %** · **0,17 %** |

**O aparo do Lab deixou de ser necessário.** Ele continua ligado por segurança e
por honestidade de comparação, mas o que ele corta agora é resíduo.

`pente` chegou a **zero violações** nas duas glebas. E os três partidos quebrados
continuam quebrados: `cluster` 77,9 %, `organico` 82,9 %, e `radial` — que agora
produz lote, mas **100 % deles violam**. `superquadra` continua nascendo vazia.

**A ressalva que não se mexeu:** o motor não calcula greide. `rampaMedia_pct`
sai `null`, e isso importa mais agora que o LAB-02 mostrou que **o Validator
também não confere rampa** — ninguém olha.

### O motor interno do Generate — **os números dele não são comparáveis em `ensaio-47ha`**

E isso não é opinião: é aritmética, e está no §2.

---

## 2 · Os "22 % a menos de lotes" — a causa, com número

O prompt pedia para explicar a diferença. A diferença **mudou** desde que foi
enunciada, e a explicação é outra.

### 2.1 O número de hoje

| gleba | Testfit T02 | melhor do Generate | diferença |
|---|---|---|---|
| `ensaio-47ha` | 599 | 974 (`ortogonal`) | **−38,5 %** |
| `geo-antonina` | 1 391 | 1 656 (`espinha`) | **−16,0 %** |
| `geo-antonina` | 1 391 | 1 389 (`ortogonal`) | **+0,1 % — empate** |

**Primeira correção ao enunciado:** os 22 % eram 761 contra 974, medidos no T01.
Com o T02 o número é 599 contra 974 — a diferença **aumentou**, não diminuiu.

**Segunda:** ela não é uma constante do motor. Em `geo-antonina`, que é terreno
real, ele **empata com a ortogonal do Generate** (1 391 contra 1 389).

### 2.2 Onde foram os lotes, em metros quadrados

O lote do Testfit é **maior**, não menor: 397,65 m² contra 362,74 m² (+9,6 %). Ele
não empacota pior — ele empacota em **menos terra**.

| | Testfit T02 | Generate `ortogonal` |
|---|---|---|
| **área privativa** | 238 190 m² — **50,7 %** da gleba | 353 307 m² — **75,2 %** |
| área viária | 64 028 m² — 13,6 % | 73 691 m² — 15,7 % |
| lazer | 47 246 m² — 10,1 % | 47 000 m² — 10,0 % |
| **APP** | **100 833 m² — 21,5 %** | **70 500 m² — 15,0 %** |
| não aproveitada | 19 704 m² — 4,2 % | 0 m² — 0,0 % |
| **soma** | **470 000 m² = 100,0 %** | **544 498 m² = 115,8 %** |

A diferença de 375 lotes decompõe-se assim:

- **−115 117 m² de área privativa**, que a 397,65 m² por lote valem **≈ 290
  lotes**;
- **lote 9,6 % maior**, que sobre os 238 190 m² dele valem **≈ 58 lotes**;
- soma: **≈ 348 dos 375**. O resto é borda e arredondamento.

### 2.3 E a última linha da tabela é o problema

**O quadro do Generate soma 544 498 m² numa gleba de 470 000 m² — 74 498 m² a
mais do que a terra existe.** Conferido por mim, com o arquivo dele:

```
areaPrivativa 353 306,70 + areaViaria 73 690,97 + areaLazer 47 000,00
            + areaAPP 70 500,00 + areaNaoAproveitada 0,00   =  544 497,67
areaTotal                                                    =  470 000,00
                                                     excesso =  +15,85 %
```

Privativa e viária **sozinhas** já ocupam 426 998 m², 90,9 % da gleba. Sobram
43 002 m². O quadro reivindica, para lazer e APP, **117 500 m²** — quase três
vezes o que resta.

**De onde vêm esses dois números? Do parâmetro, não do desenho:**

| | valor no quadro | % da gleba | parâmetro da ENTRADA |
|---|---|---|---|
| `areaAPP_m2` | 70 500,00 | **exatamente 15,0 %** | `pctAPP: 15` |
| `areaLazer_m2` | 47 000,00 | **exatamente 10,0 %** | `pctLazer: 10` |

São **ecos do parâmetro**, ao centavo. E o detalhe que fecha o caso: **a gleba
`ensaio-47ha` declara `restricoes: []` — zero restrições, nenhuma APP.** O
quadro anuncia 7,05 ha de área de preservação permanente numa gleba que não tem
nenhuma.

**Não é um defeito geral de contabilidade.** Em `geo-antonina` o mesmo quadro
fecha ao centavo nos dois motores (−0,0 %). Quatro testes fixam as quatro
afirmações acima.

### 2.4 A leitura, e o que ela não é

A comparação 599 × 974 **não é entre dois parcelamentos da mesma terra**. O
Testfit reserva 31,6 % da gleba (APP + lazer) antes de parcelar e o quadro dele
fecha; o Generate reporta 25 % reservados **e** desenha lotes em 75,2 % — e as
duas coisas não cabem juntas.

Ou os lotes do Generate estão por cima da APP e do lazer que ele declara, ou os
7,05 ha de APP e os 4,7 ha de lazer **não existem no desenho**. Daqui não dá para
saber qual das duas, e por isso **não há conclusão aqui: há uma pergunta, com
número, para o Generate.**

**O que o Lab não faz:** dizer qual motor é melhor. A tabela está posta; a
decisão é do chat, com o Jonny.

---

## 3 · Um número que corrigi antes de publicar

A primeira versão desta medição acusou **"determinismo FALHOU"** para o Testfit.
Fui olhar: eu comparava a assinatura de uma rodada de **20 variantes** com a de
uma rodada de **3**. A régua estava errada, não o motor. Com a mesma rodada dos
dois lados, e comparando também o arquivo de contrato de cada variante, o
determinismo **passa** nos dois motores.

---

## 4 · Dois achados novos

### O Testfit não usa o relevo no traçado

Rodei o motor na gleba **com** relevo (a fixture do LAB-03) e na **sem** (a
original do Generate), mesma semente:

| gleba | com relevo | sem relevo |
|---|---|---|
| `ensaio-47ha` | 599 lotes, lote médio 397,65 m² | **599 lotes, lote médio 397,65 m²** |
| `geo-antonina` | 1 391 lotes, 399,41 m² | **1 391 lotes, 399,41 m²** |

**Idêntico.** O T03 daquele repositório diz isso no próprio título — *"o relevo
real, medido; o traçado, intocado"* —, e a medição independente confirma.

Isso é **bom para esta comparação**: significa que usar a fixture com relevo não
contaminou o confronto com os números do Generate, que foram medidos sem ela.

### O Symbios é o único dos três que entrega greide

`rampaMedia_pct` preenchida em todas as vias, e a rampa de cruzamento medida:
77,43 % e 113,54 %. Os outros dois não têm o campo. Somado ao achado do LAB-02 —
**o Validator não confere rampa, e o contrato só carrega a média** —, o quadro é
que a única informação de greide que existe na família vem do motor que ainda
não faz lote.

---

## 5 · Reproduzir

```sh
cd external-engines/esteira
bun install
bun run lab08     # docs/provas/LAB-08/ e docs/contratos/saidas/
bun test          # 27 testes
bun run typecheck && bun run lint
```

As SAÍDAS dos dois motores, no contrato v1, estão em `docs/contratos/saidas/`,
prontas para o Generate julgar por conta própria.

**O clone de `motor-testfit` foi atualizado para a `main` (T02) — só leitura**, e
terminou a rodada com `git status` limpo, como o do Generate.

---

## 6 · O que muda na fila

- **O LAB-04 (straight skeleton) ficou o próximo passo óbvio do Symbios.** Ele
  entrega 94 e 698 quadras limpas; o que falta para ele disputar o Judge é
  subdividir quadra em lote.
- **Um teste do LAB-07 foi reescrito**, não apagado: ele exigia que o contrato
  recusasse a saída sem o aparo, e o T02 consertou isso. O comentário guarda o
  que ele fixava antes e por que mudou — apagar perderia a memória de por que o
  aparo existe.
