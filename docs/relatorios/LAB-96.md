# LAB-96 — Os 15 m andando pela divisa, e "quadra" é trecho de rua (item 029)

**Data:** 12/10/2026, disparo das 23:07 UTC · **Decisão:** D323 · **Conferido aqui, não no GitHub.**

## 1 · O que o item pedia

O Jonny respondeu as duas perguntas do item 9 da página dele (texto inteiro no item 028 do
Generate, dono da regra):

- **9-A:** "quadra" é o **trecho de rua entre dois cruzamentos** (50 a 200 m), não o quarteirão.
  Os 25 m valem quando a frente do terreno ocupa o trecho inteiro; fora disso, 15 m;
- **9-B:** os 15 m se medem **a partir do encontro das duas ruas, ao longo de cada uma** — a
  recomendação "andando pela divisa" desta casa, confirmada.

O que fazer aqui: trocar a linha reta pela medida ao longo de cada rua, marcar 9-A e 9-B como
respondidos, e continuar sem sugerir acesso onde o arquivo não diz quais lados têm rua. Regra legal
continua sendo parâmetro de entrada.

O adendo trouxe mais três respostas (pendência 3: custo de ponte e bueiro é **custo de obra**, do
Orçamento; pendência 12: o regime vem do **empreendimento**) e o pedido dele de **não perguntar
mais nada desta casa** até ela estar integrada ao Generate (5-B, 7, 10 e 11 ficam paradas).

## 2 · O que foi feito, arquivo por arquivo

| arquivo | o que mudou |
|---|---|
| `external-engines/esteira/src/acesso-sugerido.ts` | `REGUA_DA_FAIXA` = `"ao-longo-da-divisa-a-partir-do-encontro-das-ruas"`; `dentroDaFaixaDeEsquina` mede o **menor arco sobre a divisa** entre o ponto (projetado no anel) e o vértice de esquina; a reta virou `dentroDaFaixaEmLinhaReta`, que **não decide nada**; `limiteDaFaixaDeEsquina` aceita a régua por parâmetro (padrão: a dele); regra 3 e comentário dos 25 m dizem "trecho de rua" |
| `external-engines/esteira/tests/acesso-sugerido.test.ts` | 44 → **52** travas: a régua é a dele e a resposta está no texto do item 029; "quadra" é trecho de rua na regra 3; e um bloco novo com os dois sentidos do 9-B |
| `external-engines/esteira/ferramentas/lab77.ts` | mede com a régua nova e grava a velha ao lado (`comARetaDeAntes`), na mesma montagem |
| `docs/provas/LAB-77/acesso-sugerido.json` | regerada |
| `external-engines/esteira/src/escopo-remedido.ts` | a chave nova `comARetaDeAntes` classificada (D164) |
| `docs/PENDENCIAS_JONNY.md` | aviso no topo; 9-A, 9-B, 3 e 12 **respondidos** (texto antigo preservado como registro); 5-B, 7, 10 e 11 **parados até a integração** |
| `docs/DECISOES.md` | D323 |
| `docs/prompts/FILA.md` | três propostas ao chat (§5) |

## 3 · As escolhas minhas onde a resposta dele não alcança

1. **Ponto fora da divisa é projetado nela.** As posições que esta casa avalia já estão na divisa;
   a projeção existe para um ponto a milímetros dela não mudar de veredito. *Descartado:* recusar o
   ponto — ruído de arredondamento virando recusa.
2. **Face de rua mais curta que 15 m não encurta a regra:** a caminhada continua pela face seguinte.
   *Descartado:* parar no fim da face — a regra fala de 15 m de rua, e face curta é desenho do
   arquivo, não da rua.
3. **A reta não foi apagada:** ficou como função de comparação. *Descartado:* apagá-la e regerar a
   prova — a regeração apagaria o "antes" (D182); e calcular a reta dentro da ferramenta à parte
   seria a segunda montagem (D116).
4. **"Esquina" continua sendo o encontro de duas faces DE RUA**, e não *"toda quina com deflexão ≥
   30°"*, que é a escolha do Generate no item 028 dele. Lá o motor precisa desenhar e não sabe onde
   há rua, então protege toda quina; aqui a casa **recusa sugerir** sem o dado, então não precisa
   da aproximação. *As duas escolhas erram para o lado seguro, cada uma no seu papel.*

## 4 · O número

Prova: [`../provas/LAB-77/acesso-sugerido.json`](../provas/LAB-77/acesso-sugerido.json). O teto da
faixa (o caso em que TODO vértice é esquina de rua), reta → andando:

| gleba | 15 m | 25 m | das 6 posições varridas, na faixa |
|---|---|---|---|
| completo | 11,47 % → 11,47 % | 19,14 % → 19,14 % | 2 → 2 |
| sintético 50 ha ondulado | 14,38 % → 14,38 % | 23,97 % → 23,97 % | 2 → 2 |
| **sintético 10 ha plano** | 22,48 % → 22,48 % | **37,42 % → 37,34 %** | 3 → 3 |
| ensaio 47 ha | 4,4 % → 4,4 % | 7,28 % → 7,28 % | 2 → 2 |
| geo-antonina | 10,96 % → 10,96 % | 18,14 % → 18,14 % | 1 → 1 |
| ensaio com promessas | 4,4 % → 4,4 % | 7,28 % → 7,28 % | 2 → 2 |
| ensaio com testada | 4,4 % → 4,4 % | 7,28 % → 7,28 % | 2 → 2 |

**Um único valor muda**, e por uma amostra de 1 m em 1 338. Os dois acessos declarados continuam
fora da faixa. Os valores da coluna "reta" **são os mesmos da prova anterior** (gravada em
10/10/2026, 01:16Z) — a reprodução do "antes" bate, o que mostra que a régua velha foi guardada
sem alteração.

**O que isto diz e o que não diz.** Não diz que a pergunta era irrelevante: diz que **estas sete
glebas têm a divisa larga**, e nelas a distância andando até o vértice mais próximo é a mesma da
reta. A diferença aparece onde a reta **corta por dentro do terreno** — e isso está demonstrado nas
travas, não nas glebas:

- gleba de **100 × 10 m**, rua no sul e no leste: o ponto (92, 10), do outro lado, fica a **12,8 m**
  da esquina pela reta (recusado) e a **18 m** andando (aceito);
- **fenda de 10 m** de largura com um vértice no meio da parede: a parede da frente fica a **14,1 m**
  pela reta e a **80 m** andando, e o teto da régua dele fica **abaixo** do da reta.

## 5 · As provas, dos dois lados

- **Caso bom e caso ruim:** a régua dele aceita o que a reta recusava por atalho (gleba estreita) e
  recusa o que está de fato a menos de 15 m andando (10 m + 4 m = 14 m) — as duas pontas demonstradas;
- **onde não havia o que mexer, não mexe:** na divisa reta do quadrado as duas réguas dão o mesmo
  veredito em sete posições, inclusive 84, 85 e 86 m, a fronteira;
- **sabotagem:** voltei `dentroDaFaixaDeEsquina` para a reta e rodei as travas — **três reprovaram**
  (o caso que difere, a projeção a milímetros e o teto da fenda). Restaurado, 52 de 52;
- **sem esquina, nada na faixa:** a régua não inventa esquina;
- a trava que proíbe **15 e 25 no corpo das funções** continua verde: o número entra por parâmetro.

## 6 · A conferência

`./external-engines/conferir.sh`, **antes e depois**, nesta máquina:

- **antes:** esteira 980 pass · 9 fail; testfit 17 pass · 0 fail; typecheck e lint limpos;
- **depois:** esteira **988 pass · 9 fail** (as oito travas novas entram; as nove falhas são as mesmas); testfit 17 · 0; typecheck e lint limpos. Três provas de ESTADO regeradas porque a árvore e a conta dos disparos mudaram com esta rodada: `LAB-52`, `LAB-57` (contam a árvore) e `item-004` (a linha do disparo das 23:07).

As 9 falhas são **todas** do `.wasm` do Symbios, que **não compila nesta máquina**: o
`rust-toolchain.toml` fixa 1.96.1, e `static.rust-lang.org` está bloqueado pelo proxy (o
`rustup target add wasm32-unknown-unknown` responde *"unsuccessful tunnel"*). Precondição, prova no
navegador e os testes que carregam o `.wasm` falham **antes e depois, iguais** — a mesma situação do
item 028.

**Máquina nova:** foi preciso instalar as dependências da esteira e do testfit (`bun install
--frozen-lockfile`) e pôr o `zod` no clone do Generate. A receita do README (`bun add --no-save
zod@^3`) **falhou aqui**: o `bun` tenta resolver o lockfile inteiro do Generate, que aponta para o
registro interno do Lovable (403). O que funcionou foi `npm pack zod@3` e extrair o pacote em
`node_modules/zod` do clone — `node_modules` é ignorado lá, e o `git status` do clone ficou limpo.
*Registrado aqui porque a próxima máquina nova vai bater no mesmo muro.*

Os três clones vizinhos foram **desrasados** (`git fetch --unshallow`), como o protocolo manda, e
estão no commit da origem: Generate `a2ac6ef`, Laboratório de Parcelamento `ccbf69d`, Geo `217e870`.
Nada foi escrito neles.

## 7 · O que ficou de fora, e para onde foi

Três propostas ao chat na `FILA.md` (seção *"Proposto ao chat, saído do item 029"*):

1. **A regra 2 do acesso não tem guarda que a cumpra.** O motivo `"sem-via-publica"` existe no
   vocabulário fechado e **nenhuma função o produz**: com as faces declaradas, uma posição sobre o
   muro do vizinho passaria. Hoje é inofensivo (gleba nenhuma declara as faces), mas é *regra sem
   guarda*. Achei lendo a função para trocar a régua; não consertei porque não era o item.
2. **O `ItemDeCusto` da travessia ganhar a classe do custo** ("obra"), a partir da resposta à
   pendência 3 — é contrato de saída, por isso proposta.
3. **Os 25 m viraram conta esperando dado:** o arquivo de terreno precisa trazer as ruas e os
   cruzamentos do entorno.

## 8 · O que depende do Jonny

**Nada.** Ele pediu para não ser perguntado até a integração, e nada deste item precisa dele.
