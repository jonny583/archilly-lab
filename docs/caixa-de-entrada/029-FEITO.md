> ## ✅ FEITO EM 12/10/2026 — disparo das 23:07 UTC · LAB-96 · D323
>
> **A régua do 9-B trocada:** `external-engines/esteira/src/acesso-sugerido.ts` — `REGUA_DA_FAIXA`
> passou de `"linha-reta-ate-o-vertice"` para `"ao-longo-da-divisa-a-partir-do-encontro-das-ruas"`,
> e `dentroDaFaixaDeEsquina` mede o **menor arco sobre a divisa** até o vértice de esquina, nos
> dois sentidos. A reta ficou como `dentroDaFaixaEmLinhaReta`, **sem decidir nada**, só para a
> prova pôr as duas lado a lado.
>
> **O 9-A no texto:** a regra 3 (`REGRAS_DO_ACESSO`) e o comentário de
> `FAIXA_QUANDO_OCUPA_A_QUADRA_m` dizem que "quadra" é o **trecho de rua entre dois cruzamentos**.
> **O código continua com 15 m**: reconhecer os 25 m virou conta, mas a conta precisa de saber onde
> a rua tem cruzamento, e nenhuma gleba daqui diz nem quais faces dão para rua. **Continua sem
> sugerir acesso** onde o arquivo não diz quais lados têm rua (`sugerirAcesso(null, …)` recusa).
> Regra legal continua entrando por **parâmetro** (`faixa_m`), e a trava que proíbe 15 e 25 no corpo
> das funções continua verde.
>
> **O número, nas sete glebas:** **um** valor muda — teto da faixa de 25 m no sintético de 10 ha,
> 37,42 % → 37,34 %. Prova regerada: `docs/provas/LAB-77/acesso-sugerido.json`, com a régua velha ao
> lado na chave `comARetaDeAntes`. A diferença real aparece em divisa estreita ou recortada:
> **oito travas novas** (44 → 52) em `external-engines/esteira/tests/acesso-sugerido.test.ts` (gleba de
> 100 × 10 m: 12,8 m pela reta, 18 m andando; fenda de 10 m: 14,1 m contra 80 m), e a sabotagem
> (voltar à reta) **reprova três delas**.
>
> **O adendo:** pendências 3 (Orçamento, custo de obra) e 12 (regime vem do empreendimento)
> marcadas **respondidas**; 5-B, 7, 10 e 11 marcadas **paradas até a integração** em
> `docs/PENDENCIAS_JONNY.md`, com um aviso no topo. Nada perguntado a ele.
>
> **Relatório inteiro:** `docs/relatorios/LAB-96.md`. **Conferido aqui, não no GitHub.**

# 029 — Itens 9-A e 9-B da página do Jonny: respondidos

**Passo 0:** `git fetch -q origin` e conte a caixa na **origem**. Se o 028 (enxugamento)
ainda estiver aberto, ele vem primeiro.

Ele respondeu por escrito em 12/10/2026 às 11h23. **O texto inteiro da resposta, e o que
ela decide, estão no item 028 da caixa do Generate**, que é o dono da regra:
`git show origin/motor-v2:docs/caixa-de-entrada/028.md` no clone do Generate. Em resumo:

- **9-A:** "quadra" é **trecho de rua entre dois cruzamentos** (50 a 200 m), não
  quarteirão. A recomendação "rua em todos os lados" cai. Os 25 m valem quando a frente do
  terreno ocupa o trecho inteiro, e fora disso valem os 15 m;
- **9-B:** os 15 m se medem **a partir do encontro das duas ruas, ao longo de cada uma**.
  É "andando pela divisa", a recomendação desta casa, confirmada;
- o motivo: prefeitura nenhuma aceita acesso na esquina.

**O que fazer aqui:** trocar a linha reta pela medida ao longo de cada rua, marcar 9-A e
9-B como respondidos, e continuar sem sugerir acesso onde o arquivo não diz quais lados
têm rua. **Regra legal continua sendo parâmetro de entrada, não lei escrita aqui** (a
§2 da casa irmã).

---

## Adendo — mais três respostas dele (12/10/2026, 11h52), e um pedido de não perguntar mais nada aqui

**LAB-3 (para onde vai o custo de ponte e bueiro): A, o Orçamento.** E a regra é mais larga
que a pergunta: *"qualquer custo é orçamento, de um parafuso a uma rua ou portaria."* No
Orçamento há **dois tipos** de custo. O **custo de obra** junta tudo o que se gasta para
construir: ponte, bueiro, asfalto, calçada, redes, grama, paisagismo, portaria. Os **custos
separados** são administração, marketing, pró-labore da incorporação, cartório, taxas,
comissão de venda e impostos. **Ponte e bueiro são custo de obra.**

**LAB-12 (a comparação roda como loteamento ou como condomínio): depende do empreendimento.**
Nenhum cálculo acontece fora de um **"novo empreendimento" do Generate**, e é lá que o
usuário escolhe condomínio ou loteamento e os parâmetros de lote mínimo, meta e máximo.
**Dentro de condomínio** ainda se escolhe com ou sem testada dos lotes para a rua: a mistura
de condomínio com loteamento fica sob "condomínio", porque a parte de condomínio predomina.
A comparação dos motores lê isso do empreendimento e **nunca escolhe por conta própria**.

**LAB-5B, LAB-10, LAB-11 e LAB-7: NÃO respondidas, e não se perguntam mais por enquanto.**
Palavras dele: *"nunca entrei no Lab, não sei como funciona este motor. Não quero responder
mais nada do Generate, do Laboratório de Parcelamento e do Lab enquanto eles não estiverem
integrados na mesma tela."* A partir de hoje, **pergunta desta casa que dependa de ele
conhecer o Lab fica parada até a integração com o Generate**. Ele vai conhecer o Lab como um
motor dentro do Generate, não como aplicativo à parte. Continue pelo caminho conservador,
dizendo o que assumiu, como já faz.

Sobre a LAB-5B ele disse que **não entendeu a pergunta**. Quando ela voltar, volta
reescrita, com um desenho. A resposta dele sobre a forma das sobras foi para o Generate, que
é o dono da regra.
