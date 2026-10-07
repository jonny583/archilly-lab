# LAB-53 · As 36 violações eram a minha ponte — consertadas, com a guarda ao lado

**07/10/2026** · prompt da fila de 07/10, o primeiro, **caminho crítico do MVP**. O chat foi
literal: *"o conserto das 36 violações que são a sua ponte, com guarda ao lado"*.

**O número novo, antes de tudo:**

```
LAB-48 (diagnóstico) ...... 128 violações
LAB-53 (depois) ............ 92 violações     −36, exatamente as previstas
```

E a frase que mais importa não é essa: **as 81 violações que não são `testada` são os MESMOS
81 lotes, um por um**, e as 11 `testada` que sobram são **subconjunto** das 47. O conserto
tirou 36 e não tocou em mais nada — está medido no §2, não argumentado.

---

## 0 · O defeito, em cinco linhas

A ENTRADA declara `testadaMinLote_m = 10` m nas cinco glebas. A **minha ida** monta
`padroes["testada"] = faixa(10 , √(360/2))` e o motor sorteia o alvo da variante no meio dela:
**11,70820393249937** m. A **minha volta** escrevia esse alvo em
`parametrosUsados.testadaMinLote_m` — **o campo cujo nome é MÍNIMO** —, o tradutor do Generate
o lia como `params.testadaMin`, e o Validator passava a medir o motor **contra o próprio alvo
dele**, com 2 % de folga. Resultado: **47 lotes de 316 m² reprovados por um déficit mediano
de 1,94 cm**, dos quais **36 eram isto** (D166).

> **Campo cujo nome diz MÍNIMO e cujo valor é um ALVO não é um campo errado: é uma acusação
> automática.**

---

## 1 · O conserto — e eram TRÊS campos, não um

O LAB-48 nomeou um campo. **Lida a função inteira antes de tocá-la, a mesma forma aparecia em
três** (`external-engines/testfit/adapter/src/volta.ts`, `parametrosAplicados`):

| campo | o que ele recebia | o que ele recebe agora |
|---|---|---|
| `testadaMinLote_m` | `testada ?? doContrato…` — **o alvo sorteado** | `doContrato.testadaMinLote_m` |
| `caixaViariaMin_m` | `Math.min(caixaP, caixaS)` — **as caixas sorteadas** | `doContrato.caixaViariaMin_m` |
| `faceQuadraMax_m` | `comprimentoQuadra` — **o sorteado, sem nem fallback** | `doContrato.faceQuadraMax_m` |

**E a própria função escrevia, quatro linhas acima, a regra que as três linhas quebravam:**

> *"Mínimo e máximo continuam sendo os do contrato: o motor não os relaxa, ele mira dentro
> deles. **O que ele escolhe é o ALVO.**"*

### As três saídas possíveis para um campo de LIMITE, e nenhuma outra

Escrever a regra como *"vem do contrato"* deixaria passar o **erro simétrico**, e ele é tão
caro quanto este: publicar no campo de limite o número do contrato quando o motor **não honra
aquele limite** é *inventar obediência*. Então a regra tem três saídas:

1. **do contrato** — o valor idêntico ao declarado na ENTRADA. É o caso normal;
2. **`null`** — o motor não aplica aquele limite. É o caso do `rampaMaxima_pct`: o motor
   **mede** rampa (T03 dele) e **não a limita**, e `null` é "não aplicado" (D23);
3. **nunca o sorteado.** O que o motor sorteia é alvo — e alvo mora em campo de alvo, ou vira
   perda declarada.

### O que o sorteio perdeu, e a perda é medida — não declarada por regra

O contrato de motor v1 tem o trio MIN/ALVO/MAX **só para a área do lote**. Para a testada e
para a face de quadra ele tem um limite e nenhum alvo, então **o alvo da variante não tem
onde morar**. Isso não pode virar silêncio (§4): sai como perda declarada, com o número.

**E a perda só é declarada quando o alvo de fato DIFERE do limite.** Medido: o
`comprimentoQuadra` **não difere** — a ida o entrega como `faixa(200, 200)`, degenerada —,
então ali não há perda nenhuma e a lista fica calada. *Perda que grita onde não há perda
ensina a ignorar a lista.*

**O que não se perde:** os valores sorteados das caixas continuam saindo, em
`caixaPrincipal_m` e `caixaSecundaria_m` — os campos onde eles significam o que são. O
`caixaViariaMin_m` passar a vir do contrato não esconde nada.

### E o destino do `amostra` no inventário da ponte estava meio-verdadeiro

`esteira/src/inventario-das-pontes.ts` declarava o destino de `plano.amostra` como *"os
valores SORTEADOS para esta variante, que é o que o contrato pede em `parametrosUsados`"* — e
parava aí. O contrato pede o que o motor **de fato aplicou**, e um mínimo que o motor não
escolheu **não é coisa que ele aplicou**: é limite de quem o declarou. **A metade que faltava
valia 36 violações.** Reescrito, nomeando o que atravessa e o que é perda.

---

## 2 · A aferição — e a previsão do LAB-48 bateu nas cinco glebas

`bun run lab48` de novo, mesma semente, mesmas cinco glebas:

| gleba | LAB-48 | previsto | **medido** | bate? |
|---|---:|---:|---:|---|
| `completo` | 25 | 25 | **25** | ✓ |
| `sintetico-50ha-ondulado` | 18 | 17 | **17** | ✓ |
| `sintetico-10ha-plano` | 29 | 4 | **4** | ✓ |
| `ensaio-47ha` | 16 | 6 | **6** | ✓ |
| `geo-antonina` | 40 | 40¹ | **40** | ✓ |
| **total** | **128** | **92** | **92** | ✓ |

¹ o LAB-48 previu 29 para Antonina *"depois dos consertos que não são do motor"* — os 11 de lá
são o `faixaViaPublica` do **Generate**, que não é este prompt.

**A previsão era falsificável e não falhou.** Vale dizer por que isso não é trivial: o
contrafactual do LAB-48 era *"e se o mínimo fosse o declarado?"*, e agora ele **é**. O próprio
número do contrafactual foi a 0 — *"somem com o MÍNIMO DECLARADO: 0"* —, que é a forma de a
medição se conferir sozinha.

### O conserto é cirúrgico, e isto é o teste mais forte do prompt

| | |
|---|---|
| `frente`, `face-quadra`, `via-sobre-lote` | **81 → 81**, e são **os MESMOS 81 lotes**, id por id |
| `testada` | **47 → 11**, e as 11 são **subconjunto** das 47 |
| teto de face de quadra que chega ao Validator | **200 → 200** nas cinco (já era o declarado) |

As 11 que sobram têm testada de **3,56 · 6,39 · 6,81 · 7,75 · 8,14 · 8,41 · 8,41 · 8,45 ·
8,49 · 8,88 · 9,59 m** — abaixo dos **10 m declarados**. Essas são do motor, e continuam
sendo: **não foram consertadas aqui, e nem podiam ser.**

**Um efeito colateral, dito:** `caixaViariaMin_m` chegava ao Generate como **10** m (o mínimo
das caixas sorteadas) e agora chega como **8** m (o declarado). O tradutor dele o lê em
`params.larguraRua`, e **medido: nenhuma das 92 muda** — as larguras que o Validator usa vêm
de `vias[].largura_m`, uma por via. Digo *não mudou aqui*, não *não pode mudar*.

---

## 3 · A guarda ao lado — e ela mede DEPENDÊNCIA, não nome

`external-engines/testfit/tests/esteira.test.ts`, bloco **§LAB-53**, três travas:

1. **todo campo de LIMITE é o do contrato, ou `null`** — varredura por nome sobre as chaves
   **reais** do objeto (`/Min|Max/i`), não sobre lista escrita no teste: campo MIN/MAX novo
   no contrato entra na trava sozinho. Com piso de volume (`> 4` campos achados), porque
   varredura que para de olhar fica verde por não procurar (D164);
2. **dobrada a amostra, nenhum LIMITE se move — e o ALVO se move.** Roda a volta duas vezes,
   mesma ENTRADA, duas amostras, e compara. **As duas metades importam:** sem a segunda, a
   trava passaria com a ponte devolvendo a ENTRADA inteira de volta, e `parametrosUsados`
   perderia a única função que tem;
3. **o alvo sem campo no contrato sai como perda declarada**, com o número — e **não** sai
   onde não há perda (o `comprimentoQuadra`, medido igual ao limite).

### A sabotagem, e ela achou um defeito na minha primeira trava

Quatro sabotagens, quatro reprovações — e a segunda é a interessante:

| sabotagem | trava 1 (nome) | trava 2 (diferencial) |
|---|---|---|
| 1 · o alvo volta a `testadaMinLote_m` (o D166 exato) | **reprova** | **reprova** |
| 2 · `faceQuadraMax_m` volta ao sorteio | **PASSA** 🔴 | **reprova** |
| 3 · a ponte vira cópia da ENTRADA (erro simétrico) | passa (correto) | **reprova** |
| 4 · o alvo sem campo some em silêncio | — | **reprova** (trava 3) |

**A sabotagem 2 passou pela trava de nome**, e o motivo é exato: a ida entrega
`comprimentoQuadra` como faixa **degenerada** `(200, 200)`, então hoje o sorteado **é** o
limite, e comparar valor com valor não distingue uma coisa da outra. **Só a trava diferencial
a pegou.**

> **Trava que compara o campo com o valor de hoje não mede o mecanismo: mede uma coincidência
> que amanhã pode acabar.** Se algum dia a ida deixar de fixar aquela faixa, o defeito
> voltaria inteiro e silencioso — e com a trava diferencial no lugar, não volta.

É a **segunda vez** que a sabotagem pega a trava e não eu (a primeira foi o D179, há um
prompt). **Sabotar a própria trava já rendeu duas vezes em dois prompts: isso deixou de ser
zelo e passou a ser método.**

**E a prova de que a prova não envelheceu:** `17 pass` no pacote `testfit`, contra 14 antes — a
suíte inteira vai a **450 travas** (433 no `esteira` + 17 no `testfit`).

---

## 4 · O arquivo de prova que ia se sobregravar (e a legenda que ia virar falsa)

A ferramenta é a **mesma** do LAB-48, de propósito: medir com outra ferramenta responderia
outra pergunta. Mas ela escrevia sempre em `docs/provas/LAB-48/violacoes-do-motor-padrao.json`
— e a primeira rodada deste prompt **apagou o diagnóstico**, que é justamente o arquivo que o
chat quer pôr ao lado do diagnóstico do Generate. Restaurado do git, e o conserto é de
mecanismo:

- **o destino sai da MEDIÇÃO**, não de quem roda: `oMinimoDeTestada.saoIguais`, gleba por
  gleba, diz se a ponte já põe o mínimo declarado. Ponte com o defeito → a prova é o
  diagnóstico do LAB-48; ponte consertada → é a aferição do LAB-53. **Uma rodada não pode
  sobregravar a outra**, e a comparação antes × depois sobrevive;
- **gleba recusada pelo esquema não vota**, e se **nenhuma** foi medida a resposta não é
  *"consertada"*: é *"não medida"* (D164);
- **a legenda `ehDiagnostico` deixou de ser texto fixo.** Ela dizia, em `string` literal,
  *"nada foi consertado, e a ponte não foi tocada"* — frase que este prompt tornaria **falsa
  dentro do próprio arquivo**, em silêncio. É a forma do D104, dentro de uma prova. Agora ela
  é derivada da medição, e o arquivo carrega `comoSeiDisso`.

---

## 5 · Para o Generate — lista numerada, nada escrito lá

**Nada foi escrito no vizinho.** Os três clones foram conferidos ao fim da rodada e estão
limpos (§4): `motor-testfit` em `4181e95`, `urban-create-hub-41d93a4d` em `5b7e9b4`,
`urban-scout-tool` em `f38dc0c`, `git status` vazio nos três.

1. **O contrato de motor v1 precisa de `testadaAlvoLote_m`.** Hoje ele tem o trio
   MIN/ALVO/MAX só para a área do lote; para a testada tem só o mínimo, e **foi essa falta que
   criou o defeito**: o alvo da variante não tinha onde morar e foi morar no mínimo. Enquanto
   não houver campo, este Lab publica o alvo como **perda declarada**, e o Generate não vê o
   número que o motor de fato mirou (11,708 m contra os 10 declarados). Um `faceQuadraAlvo_m`
   resolveria o mesmo para a quadra, e é menos urgente — a ida fixa a faixa ali.
2. **As 11 `testada` que sobram são do motor, e a lista está na prova nova.** Testadas de
   3,56 a 9,59 m contra 10 m declarados, em `completo` (2), `sintetico-50ha-ondulado` (6) e
   `sintetico-10ha-plano` (3). **Não são régua**: o limite agora é o que a entrada declara.
3. **As 92 continuam não aprovando gleba nenhuma**, e a conta do LAB-48 segue valendo: o
   ranking da tela unificada só deixa de nascer vazio quando as **54 do motor** e as **27 em
   aberto** tiverem resposta — o LAB-54 e o LAB-55 desta fila.

---

## 6 · Entrega

| o quê | onde |
|---|---|
| o conserto | [`adapter/src/volta.ts`](../../external-engines/testfit/adapter/src/volta.ts) · `parametrosAplicados` |
| o destino reescrito | [`esteira/src/inventario-das-pontes.ts`](../../external-engines/esteira/src/inventario-das-pontes.ts) |
| a guarda (3 travas) | [`testfit/tests/esteira.test.ts`](../../external-engines/testfit/tests/esteira.test.ts) · §LAB-53 |
| a aferição | [`docs/provas/LAB-53/violacoes-depois-do-conserto-da-ponte.json`](../provas/LAB-53/violacoes-depois-do-conserto-da-ponte.json) |
| o diagnóstico, intacto | [`docs/provas/LAB-48/violacoes-do-motor-padrao.json`](../provas/LAB-48/violacoes-do-motor-padrao.json) |

A prova nova **mede gleba**, e traz gleba, motor, semente e contrato — sem exceção a declarar.

**E uma correção de texto que é a mesma regra em segundo lugar:** a `FILA.md` ainda dizia
*"fila esgotada: … e apagar o despertador"*, que o chat tornou falso em 07/10 (*"pode
DESLIGAR ao esgotar em vez de apagar; você está certa, e passa a ser assim daqui em diante"*).
A `CLAUDE.md` §1-A foi corrigida ao abrir esta fila; **a cópia da `FILA.md` ficou**, e regra
que vive em duas terras envelhece numa delas.

**E o comando único mordeu, o que é o §7 funcionando.** O `tsc` do pacote `testfit` reprovou
a trava nova — um `number | null` passado a `toBe` — **depois** de eu já ter rodado o
typecheck: eu o rodei ao acabar o conserto e **não de novo** ao acabar o teste. Nenhum dos
dois passos parciais pegaria; quem pegou foi `./external-engines/conferir.sh`. *Suíte que
ninguém roda não protege nada — e typecheck que se roda uma vez só protege o estado de uma
vez.*

## 7 · As decisões

- **D180** — **todo campo MIN/MAX de `parametrosUsados` vem do CONTRATO**, e o sorteado é
  ALVO: mora em campo de alvo ou vira perda declarada. A terceira saída é `null`, para o
  limite que o motor **não honra** — publicar ali o número do contrato seria *inventar
  obediência*, que é o erro simétrico deste. Custo medido do defeito: **36 de 128 violações**;
- **D181** — **a guarda mede DEPENDÊNCIA, não nome**: duas amostras, o limite parado e o alvo
  em movimento. Provado necessário por sabotagem: `faceQuadraMax_m` de volta ao sorteio
  **passou** pela trava que compara com o valor do contrato, porque na faixa degenerada o
  sorteado é igual ao limite. *Trava que compara o campo com o valor de hoje mede uma
  coincidência, não o mecanismo* — e é a **segunda vez em dois prompts** que a sabotagem pega
  a trava e não eu (a primeira foi a D179);
- **D182** — **prova "antes" não se sobregrava com prova "depois"**: o destino do arquivo sai
  da **medição** do estado da ponte, e a legenda que dizia *"nada foi consertado"* deixou de
  ser texto fixo. Legenda em `string` literal dentro de uma prova envelhece igual a comentário
  (D104) — e aqui ela teria envelhecido **no mesmo prompt**.
