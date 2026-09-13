# Pendências do Jonny — Archilly Lab

**Este arquivo é a fila única do que depende de uma pessoa.** Se precisa de
você, está aqui. Dívida técnica **do código** é minha e não entra nesta lista.

Quem escreve: o Claude, a cada rodada. **Quem risca: você.** Item resolvido é
marcado, nunca apagado — para a decisão não se perder.

Atualizado em **13/09/2026**, no fim do LAB-07 (o motor do Laboratório de
Parcelamento na esteira do Generate).

**Os endereços, prontos para clicar:**

- repositório: <https://github.com/jonny583/archilly-lab>
- o relatório desta rodada: [`docs/relatorios/LAB-07.md`](https://github.com/jonny583/archilly-lab/blob/main/docs/relatorios/LAB-07.md)
- os números crus: [`docs/provas/LAB-07/`](https://github.com/jonny583/archilly-lab/tree/main/docs/provas/LAB-07)
- onde paramos: [`docs/ONDE_PARAMOS.md`](https://github.com/jonny583/archilly-lab/blob/main/docs/ONDE_PARAMOS.md)
- a fila: [`docs/prompts/FILA.md`](https://github.com/jonny583/archilly-lab/blob/main/docs/prompts/FILA.md)

---

## Em dez minutos, nesta ordem

| # | o que | quanto custa | o que destrava |
|---|---|---|---|
| **1** | **A calçada: ela sai do lote ou sai da rua?** Uma frase de urbanismo | 5 min | a correção nº 2 do laboratório de parcelamento, e o desenho certo do leito |
| **2** | **Dois partidos de traçado estão quebrados.** Me dizer se você usa `cluster` e `organico` | 2 min | a ordem da fila de correções |
| **3** | **Colar dois recados**: a lista de correções no laboratório de parcelamento, o diagnóstico do relevo no Generate | 4 min | os dois consertos começarem sem esperar esta fila |
| **4** | Nada. **O LAB-02 já pode rodar** — ele não depende de você | 0 | — |

---

## 1 · A calçada: ela sai do lote ou sai da rua?

**Isto é decisão de urbanismo, não de programação, e por isso é sua.**

O motor de parcelamento declara duas medidas por rua: a **caixa** (de meio-fio a
meio-fio) e a **calçada** (a largura do passeio de cada lado). Parecia que a rua
inteira fosse a soma das duas.

**Medi, e não é.** O canto mais próximo de cada lote fica a exatamente metade da
caixa do eixo da rua — 5,00 m para uma rua de 10 m, em 223 dos 441 lotes
conferidos, com a mediana no mesmo valor. **O lote encosta no meio-fio. A
calçada que o motor promete não tem terra nenhuma reservada para ela.**

Não é detalhe de desenho: quando declarei a rua como caixa + calçadas, o leito
invadiu 3 m dentro de cada lote e o conferente reprovou **441 de 441 lotes por
falta de frente**. Declarando só a caixa — o corredor que existe de verdade — a
mesma opção caiu para 15 reprovações.

**O que eu preciso de você**, uma frase, e só há dois caminhos:

- **(a) o lote recua.** A calçada sai da terra do lote: a quadra encolhe
  `calcada_m` de cada lado. Lote menor, passeio garantido.
- **(b) a caixa passa a incluir a calçada.** O passeio sai da rua: a rua fica
  mais larga, a pista mais estreita, o lote fica como está.

O que **não** dá para continuar é declarar uma calçada que não existe no
desenho — hoje o Archilly desenharia um passeio em cima do quintal de alguém.

**O que eu NÃO vou fazer sem você:** escolher. As duas mudam quantos lotes cabem
na gleba, e isso é o produto.

Medições: [`docs/relatorios/LAB-07.md`](https://github.com/jonny583/archilly-lab/blob/main/docs/relatorios/LAB-07.md), §4.

---

## 2 · Dois partidos de traçado estão quebrados — você usa algum deles?

Rodei os **dez** partidos do motor (o padrão de fábrica roda só um), 20 opções
por gleba, 60 no total, e passei tudo pelo conferente do Generate. **Oito vão
bem; dois não.**

| partido | lotes | reprovações | leitura |
|---|---|---|---|
| `pente` | 3 394 | **2** | impecável |
| `diagonal`, `mioloVerde`, `ortogonal`, `espinha` | 17 239 | 335 | abaixo de 3 % |
| `loop` | 3 418 | 179 | 5 % |
| **`cluster`** | 3 976 | **3 092** | **78 % dos lotes com a frente fora da medida** |
| **`organico`** | 374 | **524** | **165 lotes desenhados em cima de outros lotes** |
| `radial` | — | — | **recusado nas 6 tentativas**: lote pisando fora da divisa |

Lote em cima de lote não é imperfeição de acabamento — é planta inválida.

**O que eu preciso de você:** você usa `cluster`, `organico` ou `radial` na tela?
Se usa, eles sobem na fila de correções do laboratório de parcelamento; se nunca
usou, descem, e talvez a resposta certa seja tirá-los do menu até estarem
prontos, em vez de deixar o cliente esbarrar neles.

**Relacionado, e já está anotado no outro repositório:** o partido `superquadra`
nasce **vazio**. Lá eu tinha medido 1 opção em 12; aqui, com 20 opções, deu
**20 de 20 sem um único lote** — e o plano vazio ainda lidera o ranking do motor.
Se você já respondeu aquele item, este está respondido junto.

---

## 3 · Dois recados para colar, quatro minutos

Os dois consertos abaixo são de **outros repositórios**, e eu não escrevo neles
— aqui é laboratório, e só leio os vizinhos. Os textos já estão prontos; falta
alguém abrir a sessão de lá e colar.

**(a) No laboratório de parcelamento** — a lista de 8 correções, em ordem de
impacto, com o número de cada uma. A primeira é a que mais dói: **a rede de ruas
não é cortada no limite do terreno**, e de 25 % a 40 % do asfalto nasce em terra
que não é do empreendimento. Enquanto isso não for feito, nenhum arquivo do
motor passa no contrato sem eu remendar por fora.
→ [`docs/relatorios/LAB-07.md`](https://github.com/jonny583/archilly-lab/blob/main/docs/relatorios/LAB-07.md), §9.

**(b) No Generate** — um defeito de **relevo**, medido. O Generate calcula a
altura do terreno pela média dos 6 pontos mais próximos. Como os pontos de uma
mesma curva de nível são muito mais próximos entre si do que a distância entre
duas curvas, quase sempre os 6 vizinhos estão **na mesma curva**, e a média deles
é a altura daquela curva. O morro vira bolo de casamento: terraços planos com
degraus. Medido: **metade das amostras cai exatamente sobre uma curva e 17 % do
terreno fica com inclinação zero** — e a inclinação máxima que o modelo enxerga é
16 %, quando o terreno tem 36 %.

A correção é pequena e eu já a apliquei aqui, no LAB-01: exigir que os vizinhos
usados na média venham de **pelo menos duas curvas diferentes**. O número cai de
50 % para 0,3 %.
→ [`docs/relatorios/LAB-07.md`](https://github.com/jonny583/archilly-lab/blob/main/docs/relatorios/LAB-07.md), §8.

**O motor do Laboratório de Parcelamento não tem esse defeito** — ele usa todos
os pontos, não os 6 mais próximos. Conferido no mesmo terreno, com a mesma
régua.

---

## 4 · O que **não** depende de você

- **O LAB-02 pode começar quando eu abrir a próxima sessão.** A condição era o
  LAB-01 devolver geometria utilizável, e ele devolveu.
- **O remendo das ruas que saem da gleba** já existe aqui, declarado, desligado
  por padrão, e cortando **só o eixo das ruas** — nunca um lote, porque aparar um
  lote mudaria a área e a frente dele, que são justamente o que o conferente
  mede. Toda medição do relatório sai nas duas versões, com e sem o remendo.
- **Nada foi escrito nos repositórios vizinhos.** O do Generate e o do
  laboratório de parcelamento foram clonados só para leitura e terminaram a
  rodada sem uma alteração sequer.

---

## Já resolvidos — não precisa fazer nada

Nenhum ainda: este arquivo nasce no LAB-07.
