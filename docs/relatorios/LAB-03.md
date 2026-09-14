# LAB-03 — RELEVO: A INTERPOLAÇÃO MEDIDA NA RAMPA, E AS GLEBAS-PADRÃO COM RELEVO

**Data:** 14/09/2026 · **Motor:** Symbios Tensor 0.4.1 · **Semente:** 20260913
**Passo da grade:** 2 m · **Equidistância:** 2 m

---

## Veredito

> ### O defeito de interpolação não estraga a rampa. Ele estraga o **traçado**.

Era essa a pergunta: o LAB-01 corrigiu a interpolação do relevo e mediu o efeito
no **campo de alturas**; nunca se mediu o efeito no **desenho das ruas**. Medido
agora, com o mesmo motor, a mesma semente e a mesma gleba sobre dois mapas:

**A rampa quase não se mexe.** A máxima em cruzamento vai de 269,96 % para
161,38 % na pior gleba — melhora, mas as duas são absurdas —, e nas outras duas a
diferença é de ruído (64,10 contra 66,46; 15,44 contra 11,44, **com o defeituoso
saindo "melhor"**).

**O traçado se mexe muito.** Com o interpolador defeituoso, a fração do
comprimento de via alinhada a uma única direção salta de **12,6 % para 47,3 %** e
de **11,3 % para 41,5 %** nas duas glebas com relevo. **O motor para de seguir
topografia e cai em grade** — que é exatamente o que o cabeçalho do `alturas.ts`
avisa que acontece quando o campo tensorial não tem gradiente.

E a prova mais limpa está na gleba **plana**, onde o sinal se inverte: ali a
grade é a resposta certa, o interpolador corrigido produz 97,2 % de grade, e o
defeituoso produz **76,7 %** — ele **inventa sinuosidade** onde não há relevo,
porque o traçado passa a seguir a borda dos degraus do bolo de casamento.

**E as duas glebas-padrão do Generate agora têm relevo** — como fixtures do Lab,
com superfície sintética declarada. O Symbios, que as recusava, roda nas duas. O
LAB-08 deixou de ser impossível.

---

## Parte A · a interpolação, medida na rampa

### O experimento

Mesmo motor, mesma semente, mesma gleba, mesmo passo de grade, mesma folga,
mesma máscara. **Só o interpolador muda:**

| | como decide a cota de uma célula |
|---|---|
| **corrigido** (produção, desde o LAB-01) | interpola entre as **cotas distintas** mais próximas (`NIVEIS = 3`) |
| **k vizinhos** (o defeito, replicado) | média ponderada pelo inverso do quadrado da distância dos **6 vizinhos mais próximos** — o número do `criarModeloRelevo` do Generate |

O defeituoso vive em `external-engines/esteira/src/relevo-k-vizinhos.ts`, na
pasta de medição e com o nome dizendo o que é. Um interpolador errado dentro do
código de produção é armadilha; um teste trava que a réplica só difere no
interpolador — mesma grade, mesmo passo, mesma origem, mesma máscara (D37).

Para o motor poder comer dois mapas diferentes, `gerarRedeViaria` ganhou um
parâmetro opcional de mapa pronto (D36).

### O campo de alturas — o defeito reproduzido

| gleba | | células sobre um valor de curva | gradiente zero | declividade p10 |
|---|---|---|---|---|
| `completo` | corrigido | **1,74 %** | **0 %** | 3,65 % |
| | k = 6 | **35,79 %** | **67,76 %** | **0 %** |
| `sintetico-50ha-ondulado` | corrigido | **0,20 %** | **0 %** | 2,07 % |
| | k = 6 | **85,00 %** | **73,33 %** | **0 %** |
| `sintetico-10ha-plano` | corrigido | **1,87 %** | **0 %** | 1,12 % |
| | k = 6 | **49,81 %** | **95,49 %** | **0 %** |

Os 85 % e 73,33 % em `sintetico-50ha-ondulado` são **exatamente** os 85 % e 73 %
que o LAB-01 relatou. A réplica replica.

O `p10` da declividade é o retrato do terraço: **0 % em todas as três** com k = 6.
Um décimo do terreno é rigorosamente plano — os patamares do bolo.

### A rede

| gleba | trechos (corrigido / k=6) | comprimento |
|---|---|---|
| `completo` | 287 / 295 | 38 840 m / 40 282 m |
| `sintetico-50ha-ondulado` | 111 / 123 | 17 980 m / 18 505 m |
| `sintetico-10ha-plano` | **11 / 21** | **1 937 m / 3 062 m** |

Na gleba plana o defeituoso produz **quase o dobro de rede**. Não é generosidade:
é traçado seguindo degraus que não existem.

### A rampa — o número que quase não se mexe

Todas as medidas sobre a rede **já recortada** pelo LAB-02: medir a rede crua
misturaria o defeito de interpolação com a via que nasce fora da gleba.

| gleba | | máx ao longo | máx no cruzamento | arestas acima de 10 % (cruzamento) |
|---|---|---|---|---|
| `completo` | corrigido | 34,98 % | **161,38 %** | 238 de 1 282 |
| | k = 6 | 42,15 % | **269,96 %** | 252 de 1 257 |
| `sintetico-50ha` | corrigido | 10,07 % | **64,10 %** | 51 de 540 |
| | k = 6 | 12,47 % | **66,46 %** | 70 de 609 |
| `sintetico-10ha` | corrigido | 10,01 % | **15,44 %** | 1 de 27 |
| | k = 6 | 10,03 % | **11,44 %** | 1 de 94 |

**A leitura honesta:** a correção melhora a pior rampa numa gleba (−40 %),
melhora pouco noutra, e **piora** na terceira. Se a pergunta fosse só "a
interpolação conserta a rampa?", a resposta seria **não**.

Mas o número da gleba plana — o defeituoso com rampa de cruzamento **menor** —
não é vitória dele. Com 95,49 % da grade em gradiente zero, não há relevo para
produzir rampa nenhuma. **A rampa baixa é a rampa de um terreno que não existe.**

### A grade — onde o defeito realmente aparece

Fração do comprimento de via a menos de 5° da direção dominante (ou da
perpendicular). Numa grade perfeita, 100 %.

| gleba | corrigido | k = 6 | leitura |
|---|---|---|---|
| `completo` (141,8 ha, acidentada) | **12,6 %** | **47,3 %** | o defeito alinha **4×** mais rede |
| `sintetico-50ha-ondulado` | **11,3 %** | **41,5 %** | idem |
| `sintetico-10ha-plano` | **97,2 %** | **76,7 %** | **o sinal se inverte** |

As duas primeiras linhas são o dano: o campo tensorial precisa de gradiente para
ter direção, o terraço não tem, e o motor **degenera em grade ortogonal**. As
ruas deixam de acompanhar o morro.

A terceira linha é a prova mais limpa de todas. Num terreno **de verdade plano**,
a grade é o desenho correto, e o interpolador corrigido a produz (97,2 %). O
defeituoso produz **menos** grade — porque o bolo de casamento cria bordas de
degrau onde o terreno é liso, e o traçado vai atrás delas. **Ele não só apaga
topografia: ele inventa topografia onde não há.**

### O que isso muda para o Generate

O LAB-07 mandou pelo chat o diagnóstico do `criarModeloRelevo` (49,8 % das
amostras sobre um valor de curva, 17,3 % de gradiente zero) e a correção
sugerida. **O LAB-03 acrescenta a consequência**, que é o argumento que faltava:

> Não é uma imprecisão de cota. É o traçado deixando de seguir o terreno — e,
> em terreno plano, seguindo um terreno que não existe.

A correção continua sendo a mesma, e é pequena: exigir que os vizinhos ponderados
venham de **pelo menos duas cotas distintas**.

---

## Parte B · as glebas-padrão do Generate, com relevo

### O problema

`ensaio-47ha` e `geo-antonina` têm `relevo` com `curvas: []` e `cotas: null`.
O Symbios é um motor de campo tensorial sobre mapa de alturas: **sem cotas ele
nem monta a grade**, e o adaptador recusa em vez de fabricar um terreno plano e
fingir que mediu (LAB-02, §6). Enquanto isso durar, os dois motores não pisam na
mesma terra e o LAB-08 — *"mesmas glebas, mesmas sementes"* — é impossível.

### O que foi feito

`docs/fixtures/glebas-padrao-com-relevo/` — **fixtures do Lab**. A poligonal, as
restrições, os acessos e os parâmetros são **os do Generate, intocados** (um
teste trava isso, campo a campo). O que o Lab acrescenta é só o `relevo`, e ele
é **sintético e declarado**: a superfície analítica `ondulado` do gerador do
LAB-01, a mesma que produziu `sintetico-50ha-ondulado`. Cada arquivo diz isso em
`archilly.origem`.

**A escala não é escolhida no olho** (D38): sai do raio equivalente da própria
gleba, dividido por 3 — duas a três ondulações na largura do terreno. Fixar um
número em metros faria a mesma superfície virar planície numa gleba de 140 ha e
sertão de penhascos numa de 10 ha.

| gleba | área | curvas | vértices cotados | desnível | escala |
|---|---|---|---|---|---|
| `ensaio-47ha` | 47,0 ha | 0 → **163** | 5 121 | 30,07 m | 128,93 m |
| `geo-antonina` | 141,8 ha | 0 → **250** | 7 322 | 55,92 m | 223,91 m |

### A prova: o motor roda

| gleba | trechos (antes do corte → depois) | comprimento | quadras | fora da gleba | conectividade |
|---|---|---|---|---|---|
| `ensaio-47ha` | 92 → **96** | 16 773 m | 94 | **0 %** | 4 componentes, 99,8 % no maior |
| `geo-antonina` | 839 → **472** | 60 934 m | 698 | **0 %** | 25 componentes, **70,4 % no maior** |

A rampa nas duas, para o LAB-08 ter o antes:

| gleba | máx ao longo | máx no cruzamento |
|---|---|---|
| `ensaio-47ha` | 10,00 % | 77,43 % |
| `geo-antonina` | 25,13 % | 113,54 % |

### A ressalva, e ela é do recorte, não da fixture

**`geo-antonina` fragmenta muito mais que qualquer gleba medida até agora:** 25
componentes, e só **70,4 %** do comprimento no maior. Nas glebas do LAB-02 o pior
caso tinha sido 94,7 %.

A causa não é o relevo sintético: é a forma da gleba. São 141,8 ha com contorno
muito recortado e três APP hídricas atravessando o meio — o recorte encontra
muito mais fronteira por metro de rua. É um dado para o LAB-08 e um argumento a
favor de reconectar a rede depois do corte, que **não é deste prompt** e entra na
fila como proposta ao chat.

### O Generate não foi alterado

As fixtures vivem no Lab. **A proposta de adotá-las no Generate vai neste
relatório, para o chat repassar** — e ela é simples de enunciar:

> As duas glebas-padrão não carregam topografia, e isso as torna inúteis para
> qualquer motor que leia relevo — o do Lab e, no futuro, qualquer outro.
> `docs/fixtures/glebas-padrao-com-relevo/` do archilly-lab tem as duas com
> curvas de nível sintéticas declaradas, prontas para copiar. O ideal é relevo
> **real**, do Geo; o sintético declarado é melhor que nenhum.

---

## O que não foi feito

- **A correção de interpolação não foi "aplicada"** porque **já estava**, desde o
  LAB-01 (D08). O que faltava era medir o efeito dela na rampa, e é isso que a
  Parte A faz. Dizer que apliquei seria inventar trabalho.
- **A rede não é reconectada depois do corte.** `geo-antonina` mostra que isso
  vai fazer falta, mas reconectar é desenhar via que o motor não desenhou — vai
  à fila como proposta ao chat.
- **Nada foi escrito no Generate.**

---

## Reproduzir

```sh
cd external-engines/esteira
bun install
bun run lab03     # docs/provas/LAB-03/ e docs/fixtures/glebas-padrao-com-relevo/
bun test          # 23 testes
bun run typecheck && bun run lint
```

---

## O que o LAB-08 recebe

1. **As duas glebas-padrão rodando nos dois motores.** Era a condição que faltava
   para *"mesmas glebas, mesmas sementes"* ser verdade.
2. **O antes da rampa** nas fixtures: 77,43 % e 113,54 % no cruzamento.
3. **Um aviso:** `geo-antonina` fragmenta a 70,4 %. Se a tabela do LAB-08 comparar
   comprimento de rede útil, esse número precisa aparecer ao lado.
