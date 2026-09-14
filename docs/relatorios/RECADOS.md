# RECADOS PARA O CHAT — o acumulado

Todo prompt termina com um RECADO PARA O CHAT (a regra está em
[`../../CLAUDE.md`](../../CLAUDE.md), §1). **O mesmo recado é acrescentado
aqui**, com a data, em ordem cronológica — o mais antigo primeiro.

Assim o pedido "me dá tudo desde o dia tal" vira uma leitura deste arquivo, e
não uma reconstrução a partir dos relatórios.

---

## 13/09/2026 · LAB-07 — o motor do Testfit na esteira

```
=== RECADO PARA O CHAT — Lab · LAB-07 ===
Estado: LAB-07 concluído e mesclado na main (PR #4). Testes 14/14, tsc e lint limpos.
Feito: motor do Laboratório de Parcelamento atravessa a esteira do contrato de motor v1
  (ida → motor → volta → Validator e Judge do próprio Generate), 3 glebas × 10 partidos ×
  20 variantes. Veredito: geometria utilizável SIM COM RESSALVAS. 47 julgadas, 28.401 lotes,
  4.132 violações — pente 0,06 %, cluster 78 %, organico 140 %. Relatório, provas, decisões
  D16–D25, PENDENCIAS_JONNY.md novo, fila movida para docs/prompts/FILA.md.
Achados para outros apps ou Central: (1) Generate — criarModeloRelevo tem o defeito de
  interpolação do LAB-01: 49,8 % das amostras sobre valor de curva, 17,3 % com gradiente
  zero; correção = exigir vizinhos de 2 cotas distintas. (2) Laboratório de Parcelamento —
  8 correções para o T02; a nº 1 é aparar a rede viária pelo perímetro (25–40 % fora da
  divisa). (3) As 2 glebas-padrão do Generate não têm relevo nenhum.
Depende do Jonny: a calçada sai do lote ou da rua?; usa cluster/organico/radial na tela?;
  colar os 2 recados nos repositórios vizinhos (eu não escrevo neles).
Próximo na fila: LAB-02 — recorte pela gleba e pelas restrições, e passagem pelo Validator.
=== FIM ===
```

> **Nota de procedência.** Este arquivo nasceu no LF-01, em 14/09/2026. A regra
> do RECADO nasceu no fim de 13/09, junto com o `CLAUDE.md`, então o recado do
> LAB-07 acima é **o primeiro que existiu** — LAB-00, LAB-FILA e LAB-01 são
> anteriores à regra e não têm recado. O que eles entregaram está nos
> relatórios deles e no histórico de [`../prompts/FILA.md`](../prompts/FILA.md).

---

## 14/09/2026 · LF-01 — casa em ordem

```
=== RECADO PARA O CHAT — Lab · LF-01 ===
Estado: LF-01 concluído e mesclado na main (PRs #6 e #7). Fila autônoma gravada e
  despertador de 60 min criado (minuto :05). Testes intactos: 14/14, tsc e lint limpos.
Feito: docs/prompts/FILA.md é a fila oficial (LF-01, LAB-02, LAB-03, LAB-08, LF-FINAL),
  histórico LAB-00..LAB-07 preservado; docs/relatorios/RECADOS.md e docs/INDEX.md criados;
  decisões do chat gravadas (D26 calçada é da via, D27 só partido aprovado vai à tela,
  D28 superquadra vazia é defeito de pontuação) mais D29 (laço autônomo) e D30 (INDEX);
  PENDENCIAS_JONNY reescrito — sobraram 2 confirmações; ONDE_PARAMOS reescrito.
Não saiu como pedido: apagar a branch. O proxy de git recusou 3 vezes (aceita atualizar
  ref, recusa apagar ref) e não há ferramenta para isso aqui. Ela foi reposta sobre a
  main — mesmo commit, zero conteúdo próprio — e precisa existir, é a branch de trabalho
  do despertador. Exclusão literal = um clique na interface do GitHub.
Achados para outros apps ou Central: nenhum novo. Os 3 do LAB-07 seguem sem repasse, e o
  repasse saiu da lista do Jonny — por decisão do chat, é do chat. Para o chat: o
  despertador nasceu SEM CONECTORES do GitHub; rodadas futuras mesclam por git direto, e
  para ter PR ele precisa ser recriado pela interface do claude.ai.
Depende do Jonny: 2 itens, ambos confirmação de decisão já tomada (calçada na caixa da
  via; cluster/organico/radial fora da tela até medirem melhor).
Próximo na fila: LAB-02 — aparar a rede do Symbios pelo perímetro e pelas restrições
  (APP como geometria real) e rejulgar com o Validator e o Judge do Generate. Meta: 0 %.
=== FIM ===
```
