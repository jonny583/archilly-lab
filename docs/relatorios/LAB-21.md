# LAB-21 — a rampa, trecho por trecho e cruzamento por cruzamento

**Data:** 03/10/2026 · **Semente:** 20260913 · **Contrato:** lido em `["2","1"]`
**Provas:** [`docs/provas/LAB-21/rampa.json`](../provas/LAB-21/rampa.json) · coluna em [`LAB-19/tabela.json`](../provas/LAB-19/tabela.json)
**Ferramenta:** `bun run lab21` · **Testes:** `tests/rampa.test.ts` — 14 · a esteira inteira, **180 verdes**

---

## Em uma frase, e ela é desconfortável

**Os 161,38 % que o LAB-18 celebrou não são a rampa de uma rua.** Eles são o
degrau do mapa de cotas dividido por um segmento de **15 cm** — e, medida como
rampa de rua, a mesma via dá **41,84 %**. O número que o chat chamou de "sério"
estava errado, e quem o reportou fui eu.

---

## 1 · Antes de tudo: o limite legal de rampa de via não existe

O prompt pediu *"quantos trechos e cruzamentos passam dos limites legais de
rampa"*. **Procurei o limite na família antes de medir qualquer coisa:**

| o que existe | onde | o que é |
|---|---|---|
| **declividade máxima parcelável: 30 %** | `normas/br.ts` do Generate, citando **Lei 6.766/1979, art. 3º, § único, III** | limite do **TERRENO** |
| uso restrito 25°–45°, APP acima de 45° | idem, Código Florestal | limite do **TERRENO**, e **em grau** |
| **limite de rampa de VIA** | **nada.** `grep "rampa\|greide"` em `normas/` não acha | — |

**E as duas coisas não são a mesma.** Uma rua pode ser cortada numa encosta de
40 % e ter greide de 8 %; uma encosta mansa pode receber uma rua mal resolvida.
O próprio comentário da norma avisa que misturar as unidades *"é erro
silencioso"*.

Então este prompt **publica a distribuição** e a contagem em **quatro cortes de
leitura** — 8 %, 15 %, 20 %, 30 % —, e o de 30 % sai **sempre com o significado
dele dito**. *"Qual é a inclinação máxima de uma rua"* virou item do Jonny
(**D91**). Usar os 30 % da lei como se fossem da rua seria inventar uma regra e
pôr o nome dele nela.

---

## 2 · Duas réguas, e por que as duas

Só o Symbios declara `rampaMaxima_pct`. Uma tabela de rampa com três colunas
vazias não mede nada — então **o Lab passou a medir por conta própria**: o eixo
de cada via, amostrado sobre o relevo da gleba.

| quem mede | o que significa |
|---|---|
| o **motor**, em `vias[].rampaMaxima_pct` | *"eu calculei o greide e ele é este"* |
| o **Lab** | *"passei o eixo dele pelo relevo da gleba e deu isto"* |

**A segunda não substitui a primeira**, e as duas nunca são somadas: um motor que
não calcula greide pode ter traçado uma rua que o relevo reprova **sem saber** —
e é isso que a régua do Lab torna visível (**D92**).

---

## 3 · Três defeitos da minha própria régua, pegos antes de publicar

A primeira passada deu **1053,55 %** de pico e **zero cruzamentos** numa malha
ortogonal de quinze vias. Os dois são impossíveis, e os dois eram meus.

### 3.1 · O pico de 1053 % era a discretização do motor

**Medido antes de atribuído** (CLAUDE.md §6), em três passos:

1. **o mapa não consegue dar aquilo.** O mapa de cotas de `completo` tem célula
   de **5 m** e degrau máximo de **3,666 m** entre células vizinhas — por
   construção, nada acima de **73,3 %** sai dele numa amostra de 5 m;
2. **então era a aritmética.** Achei o trecho culpado: `via-324`, segmento de
   **0,15 m**, com 1,576 m de desnível entre as duas pontas;
3. **e não era um caso isolado.** As vias do Symbios em `completo` têm
   **5 353 de 7 436 segmentos abaixo de 1 m**, mediana de **0,47 m**.

**O defeito conceitual:** amostrar *dentro de cada segmento* parece natural e
está errado, porque **a densidade de vértices é escolha de quem desenhou**, não
propriedade da rua. É a mesma lição do LAB-17, onde olhar vértice em vez de
amostrar pôs três de quatro vias desenhadas no balde errado.

**O conserto:** a régua **caminha a via inteira por comprimento de arco**, em
passos iguais, atravessando vértice sem ligar para ele. Há teste que passa a
**mesma** via em duas discretizações — de dois pontos e picada em 15 cm — e exige
o mesmo resultado (**D93**).

### 3.2 · O passo não pode descer abaixo da célula do mapa

`cotaEm` é consulta à célula mais próxima, **sem interpolar**. Pedir detalhe
menor que a célula é inventar resolução. O passo é `max(10 m, célula do mapa)`, e
**esta régua não vê detalhe mais fino que isso** — dito, não suposto.

### 3.3 · Cruzamento não é encontro de pontas

A primeira passada procurava nós nas **pontas** das vias, e devolveu **zero
cruzamentos** em quinze vias: numa grade, as ruas se cruzam **no meio**. Agora o
cruzamento é **interseção de eixos**, segmento contra segmento, com teste da
malha 3 × 3 devolvendo nove.

---

## 4 · A correção do número do LAB-18

Com a régua consertada, o declarado e o medido divergem **em todas as cinco
glebas, na mesma direção**:

| gleba | o Symbios **declara** | o Lab **mede** | fator |
|---|---:|---:|---:|
| `completo` | **161,38 %** | **41,84 %** | 3,9× |
| `geo-antonina` | 113,54 % | 27,73 % | 4,1× |
| `ensaio-47ha` | 77,43 % | 22,76 % | 3,4× |
| `sintetico-50ha-ondulado` | 64,10 % | 25,62 % | 2,5× |
| `sintetico-10ha-plano` | **15,44 %** | **1,96 %** | **7,9×** |

**A última linha é a prova mais limpa.** `sintetico-10ha-plano` é uma gleba
praticamente plana — o Lab mede **1,96 %** de pico, e o motor declara **15,44 %**.
Não há 15 % de rampa num terreno plano; há 15 % entre dois pontos a 20 cm um do
outro.

**A causa, no código do adaptador do Symbios:** `refazerMedidas`, em
`recorte.ts`, calcula `rampaMaxima_pct` como o máximo de `|Δcota| / d` **entre
vértices consecutivos** — e com mediana de 0,47 m, isso mede o degrau da grade de
relevo, não o greide.

**O que isto corrige, e é preciso dizer com nome:**

- o **LAB-02** mediu *"um pico de 161 % num cruzamento"*. O pico existe como
  número; **como rampa de rua, não**;
- a **D67** batizou o indicador `rampaMediaMaxima_pct` de propósito feio porque
  *"o pico é o que reprova: o LAB-02 mediu 161 % num cruzamento, diluído numa
  média mansa"*. **A metade sobre a média continua certa** — a média dilui, e a
  tabela prova. **A metade sobre os 161 % estava errada**;
- o **LAB-18** repassou os 161 % ao chat como conquista do contrato v2. O ganho
  do v2 é real — **ter onde carregar o pico** —, mas o valor que viajou primeiro
  é artefato (**D94**).

**O que NÃO está corrigido, e também vai dito:** a régua do Lab anda de 10 em
10 m sobre grade de 5 m, então **ela não vê um trecho curtíssimo genuinamente
íngreme**. As duas réguas têm limite de resolução; a diferença é que a do motor
mede numa escala onde a pergunta não faz sentido, e a do Lab mede na escala em
que greide de rua se define para terraplenagem.

---

## 5 · A tabela: quantos trechos e cruzamentos passam de cada corte

Medido pelo Lab, nas cinco glebas e nos quatro motores. **Nenhum corte é
veredito.**

| gleba | motor | média | pior trecho | m de rua > 8 % | cruzam. > 15 % |
|---|---|---:|---:|---:|---:|
| `completo` | ortogonal | 6,12 % | 34,71 % | 3 308 | 35 |
| `completo` | espinha | 6,99 % | 46,70 % | 6 859 | 78 |
| `completo` | Parcelamento | 7,72 % | **51,54 %** | **10 033** | 85 |
| `completo` | Symbios | 7,19 % | 41,84 % | 13 960 | **414** |
| `geo-antonina` | ortogonal | 3,00 % | 24,48 % | 454 | 3 |
| `geo-antonina` | espinha | 3,57 % | 23,03 % | 1 039 | 3 |
| `geo-antonina` | Parcelamento | 3,44 % | 17,09 % | 2 084 | 16 |
| `geo-antonina` | Symbios | 3,27 % | 27,73 % | 5 266 | 35 |
| `sintetico-10ha-plano` | todos | 0,70–0,91 % | 1,15–1,96 % | **0** | **0** |

**Três leituras que a tabela permite, e nenhuma é recomendação:**

1. **a média não separa os motores; o pior trecho separa.** Em `completo` as
   quatro médias ficam entre 6,1 % e 7,7 % — praticamente empatadas —, e os
   piores trechos vão de 34,7 % a 51,5 %. **Quem olhasse só a média não veria
   diferença nenhuma entre os quatro;**
2. **o Laboratório de Parcelamento tem o pior trecho de `completo`** (51,54 %), e
   é também o que menos deixa sobra. São duas colunas diferentes e as duas valem;
3. **o Symbios tem muito mais cruzamento acima de 15 %** — 414 contra 35 a 85 —,
   e isso é consequência da malha dele ter 508 cruzamentos contra 35–85 dos
   outros. **Contagem absoluta de cruzamento favorece malha esparsa**, e a tabela
   publica o total ao lado para quem for ler.

**E a gleba plana é o controle que valida a régua:** zero metros acima de 8 % e
zero cruzamentos acima de qualquer corte, nos quatro motores. Régua que acusasse
rampa em terreno plano estaria medindo a si mesma.

---

## 6 · Na tabela e na página do Jonny

**A coluna entrou nas duas, com média e pico separados**, como o chat pediu. A
página ganhou uma seção, *"A rampa das ruas: a média esconde o pior trecho"*, que:

- manda **ler a segunda coluna primeiro**;
- mostra **o caso em que as duas mais discordam**, escolhido **pela medição** —
  hoje o Symbios em Antonina, com 3,3 % de média e 27,7 % de pico, **8,5 vezes**
  mais. Escrever esses números à mão seria o defeito da D82, e pior aqui, porque
  o exemplo é o que o leitor acredita;
- **não dá veredito**, e diz por que: a inclinação máxima de rua é decisão do
  Jonny, e os 30 % da lei são **do terreno**.

Há teste que reprova se a página perder a seção, as duas colunas, o aviso ou a
ressalva sobre a lei.

---

## 7 · Os vizinhos ficaram limpos

`git status` nos três clones de leitura: `urban-create-hub-41d93a4d`,
`motor-testfit` e `urban-scout-tool` — **nenhuma alteração**.

---

## 8 · O que vai para outro repositório — pelo chat, nunca por commit

**Para o Laboratório de Parcelamento** (`motor-testfit`) e **para o Generate**,
porque o defeito é de régua e pode estar nos dois:

1. **`rampaMaxima_pct` calculada vértice a vértice mede a grade de relevo, não o
   greide.** O adaptador do Symbios do Lab fazia isso e dava 15,44 % numa gleba
   plana. Quem for preencher o campo do v2 deve **caminhar o eixo por
   comprimento de arco**, com passo não menor que a célula do modelo de relevo.
   O Lab já consertou o próprio; o aviso é para ninguém repetir;
2. **as duas candidatas do Generate trazem `rampaMaxima_pct` e a deixam `null`** —
   e o Lab mediu, para elas, piores trechos de **34,71 %** e **46,70 %** em
   `completo`. O campo existe, o dado existe no relevo, e o número não está
   sendo preenchido. É o conteúdo do **LAB-22**.

---

## 9 · O que fica pronto

- `src/rampa.ts` — `caminhar`, `perfilDeRampa`, os quatro cortes e a ressalva da
  Lei 6.766 escrita no código;
- `ferramentas/lab21.ts` e `docs/provas/LAB-21/rampa.json`;
- `tests/rampa.test.ts` — 14 testes, inclusive o da independência de
  discretização;
- a coluna da rampa no `lab19.ts` (tabela) e no `lab20.ts` (página do Jonny), com
  duas colunas e a seção nova;
- um item novo em `docs/PENDENCIAS_JONNY.md`: **a inclinação máxima de uma rua**.
