# PACKINGSOLVER — TRIAGEM (LAB-00)

**Data:** 09/09/2026 · **Status:** triagem documental, sem prova de execução
(fora do escopo deste prompt) · **Veredito:** REFERÊNCIA APENAS por ora

---

## 1. Identificação

```text
Repositório:   https://github.com/fontanf/packingsolver
Commit:        a7e533033d9c6ee3ff286513720afe6660b5989f
Data:          2026-09-08 02:45:18 +0200  (um dia antes desta triagem)
Licença:       MIT, Copyright (c) 2020 Florian Fontan
Linguagem:     C++ (CMake)
Autor:         Florian Fontan (pesquisador da área de packing)
```

Clonado apenas para inspeção; **não foi copiado para `upstream/`**, porque a
triagem não recomenda seguir. Se um prompt futuro aprovar a Etapa B, a cópia
deve ser feita então, com o commit fixado como acima.

## 2. Licença — sem obstáculo

MIT, limpa. O atrito está nas **dependências de solver**, não na licença do
projeto. O `CMakeLists.txt` traz `PACKINGSOLVER_USE_CLP=ON` e
`PACKINGSOLVER_USE_HIGHS=ON` por padrão (Knitro, comercial, fica `OFF`). CLP é
EPL-2.0 e HiGHS é MIT — ambos aceitáveis, mas são **bibliotecas nativas C++**,
com LAPACK por baixo. Nenhuma delas roda no navegador.

## 3. O que ele resolve

Seis tipos de problema: `rectangleguillotine`, `rectangle`, `box`, `boxstacks`,
`onedimensional`, `irregular`. O relevante para o Archilly é o primeiro.

**`rectangleguillotine`** empacota retângulos dentro de um retângulo (*bin*)
usando apenas **cortes guilhotinados** — cortes que atravessam a peça de lado a
lado. É exatamente a estrutura de uma quadra retangular dividida em lotes por
divisas retas contínuas. Recursos que importam:

- Objetivos: *knapsack*, *bin packing*, dimensão aberta em X ou Y.
- Número de estágios (2, 3 ou ilimitado) e orientação do primeiro corte
  (horizontal, vertical ou livre).
- `min1cut` / `max1cut` / `min2cut` / `max2cut`: distância mínima e máxima entre
  cortes consecutivos de primeiro e segundo nível.
- Espessura de corte, aparas (*trims*), defeitos no *bin*, rotação de itens
  opcional, precedência entre pilhas.

## 4. Formulação candidata para o Archilly

**"Quadra retangular → lotes com área e largura mínimas" é expressável? Em
parte, e a parte que falta é a que importa.**

O formato de entrada é CSV, direto:

```csv
items.csv:  ID,WIDTH,HEIGHT,COPIES
            0,363,190,1
bins.csv:   ID,WIDTH,HEIGHT
            0,960,649
```

A tradução natural seria: *bin* = a quadra; itens = tipos de lote (12×30,
10×25, …) com `COPIES` alto; objetivo `knapsack` maximizando área ocupada;
`number-of-stages 2` com primeiro corte perpendicular à via, o que produz
exatamente a estrutura de um quarteirão brasileiro — uma faixa de lotes de cada
lado, divisas contínuas. `min1cut` daria a testada mínima e `min2cut` a
profundidade mínima. Até aqui, o encaixe é bom.

**O que falta, e não é contornável por configuração:**

| Requisito do Archilly | Situação no PackingSolver |
|---|---|
| Quadra é polígono qualquer, não retângulo | `rectangleguillotine` exige *bin* retangular. Quadra real tem lados não paralelos, esquinas chanfradas, fundo irregular. |
| Todo lote precisa de acesso à via | Nenhuma noção de adjacência a borda. O solver empacota o miolo com prazer, gerando lotes encravados. |
| Testada é o lado que dá para a rua | O solver não distingue lados do *bin*. `WIDTH`/`HEIGHT` não carregam semântica de frente. |
| Lote de esquina tem regra própria | Inexprimível. |
| Lote irregular / trapezoidal | Fora do `rectangleguillotine`. O tipo `irregular` aceita polígonos, mas perde a estrutura guilhotinada, que é justamente o que faz o resultado parecer um loteamento. |
| Área **mínima** por lote | Indireto: só via dimensões dos tipos de item pré-definidos. |

O item "acesso à via" é fatal sozinho. Um parcelamento em que qualquer lote não
tem frente para logradouro é reprovado pelo Validator e pela legislação —
não é uma imperfeição a corrigir depois, é solução inválida. Modelar isso
exigiria restrição de adjacência à borda, que o `rectangleguillotine` não tem.

Há um caminho de contorno: usar o solver apenas para **uma faixa de lotes por
vez** — *bin* = a faixa entre a via e o eixo da quadra, com todos os itens
necessariamente tocando a borda da via por construção da faixa. Isso resolve o
acesso e o retângulo de uma vez, ao custo de o Archilly ter de fazer antes a
parte difícil (decompor a quadra em faixas). Nesse desenho o PackingSolver
otimiza a **distribuição de testadas ao longo de uma faixa** — um problema
unidimensional, para o qual o tipo `onedimensional` provavelmente basta, e para
o qual um solver de programação dinâmica de trinta linhas em TypeScript também
basta.

## 5. Caminho de execução — servidor, obrigatoriamente

C++ com CLP/HiGHS e LAPACK. Não compila para WebAssembly de forma prática. O
consumo teria de ser:

```text
Generate (navegador)
   → HTTP → serviço em contêiner
              → escreve items.csv / bins.csv
              → packingsolver_rectangleguillotine --time-limit N
              → lê certificate.csv
   → HTTP ← geometria
```

Isso significa: infraestrutura de servidor, contêiner, latência de rede, e uma
dependência operacional que o Generate hoje não tem. A especificação do
laboratório (seção "não criar uma API HTTP complexa antes de provar a execução")
é explícita contra construir isso agora — e nada nesta triagem justifica.

## 6. Atividade

Excelente: commit mais recente em 2026-09-08, um dia antes desta triagem.
Projeto maduro, com dados de *benchmark* versionados (`data/`), testes, e autor
que publica na área. Se algum dia a otimização de empacotamento virar gargalo
real do Archilly, este é o projeto certo para voltar a olhar.

## 7. Proposta de Adapter (uma página, sem código)

Registrada para o caso de a Etapa B ser aprovada no futuro; **não implementar
agora**.

**Forma.** Serviço HTTP em contêiner, fora do navegador. O Adapter em TypeScript
seria um cliente fino: serializa, chama, desserializa, e trata indisponibilidade
do serviço como "sem solução" — nunca como erro fatal da geração.

**Entrada.** Não a quadra: a **faixa** (seção 4). Retângulo com um lado marcado
como via, mais o catálogo de tipos de lote admissíveis (testada × profundidade)
e os mínimos legais do projeto.

**Tradução de ida.** Faixa → `bins.csv` de uma linha. Catálogo de lotes →
`items.csv` com `COPIES` generoso. Mínimos legais → `min1cut`/`min2cut`.
Orientação do primeiro corte fixada como perpendicular à via.

**Execução.** Processo CLI com `--time-limit` obrigatório — é um solver
*anytime*, devolve a melhor solução encontrada até o prazo, então o prazo é o
parâmetro que governa custo e qualidade.

**Tradução de volta.** `certificate.csv` traz posições e dimensões dos itens
colocados; converter para polígonos de lote, aplicar a transformação afim da
faixa para o CRS do projeto, e **verificar que todo lote toca a via** antes de
devolver — o solver não garante isso, o Adapter tem de garantir.

**Erros.** Tempo esgotado sem solução, solução parcial (nem todos os itens
colocados), serviço indisponível. Nenhum deles deve derrubar a geração.

## 8. Veredito

**REFERÊNCIA APENAS.**

Licença limpa, projeto ativo e de qualidade, e a formulação guilhotinada é
genuinamente a estrutura certa para um quarteirão. O que o desqualifica agora
não é a qualidade do solver, são três coisas somadas: (1) só roda em servidor,
contra a arquitetura de navegador do Generate; (2) não modela acesso à via,
testada, esquina nem lote irregular, e o acesso à via é requisito de validade,
não de qualidade; (3) o subproblema que sobra depois de contornar (1) e (2) — a
distribuição de testadas ao longo de uma faixa — é pequeno o bastante para não
justificar a infraestrutura.

**Condição para reavaliar:** se as Etapas C-F mostrarem que o parcelamento do
Archilly perde mensuravelmente aproveitamento de área para uma solução ótima,
então vale medir o quanto. Antes disso, adotar um solver de otimização é
resolver um problema que ainda não foi demonstrado existir.
