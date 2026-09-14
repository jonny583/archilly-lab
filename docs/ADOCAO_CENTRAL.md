# ADOÇÃO DA CENTRAL — Archilly Lab

**Estado: o Lab NÃO adota a Archilly Central, e a decisão é deliberada.**
Conferido no LF-FINAL, 14/09/2026.

O Padrão da família manda todo repositório ter este arquivo. Ele existe aqui
para responder a pergunta de frente em vez de deixar a ausência parecer
esquecimento.

---

## Por que não adota

A Central é a portaria da família: contas, créditos, design, unidades, textos,
registro de erro e aceite de termos. **O Lab não tem nada disso, e não por
falta de tempo — por definição.**

| o que a Central resolve | o Lab tem? | por quê |
|---|---|---|
| contas e login | **não** | não há usuário. O Lab roda em linha de comando, por um prompt |
| créditos e cobrança | **não** | não há chamada paga. Nenhuma IA, nenhuma API |
| design e catálogo de cores | **não** | **não há tela** — é regra do repositório (`CLAUDE.md` §4) |
| unidades e formatação | **não** | o núcleo é em metro e a saída é JSON de medição, não texto para pessoa |
| textos da interface | **não** | não há interface |
| registro de erro | **não** | erro aqui aparece no terminal e no relatório do prompt |
| aceite de termos | **não** | não há usuário para aceitar |
| gateway de IA | **não** | **o Lab não chama IA em nenhum lugar** |

## A regra que isso não quebra

O Padrão diz: *"Chave de IA só no servidor da Central"*. O Lab cumpre pelo
caminho mais curto — **não há chave nenhuma aqui**, porque não há chamada
nenhuma. Conferido em `SEGURANCA.md`, com o comando.

## O que mudaria se um dia adotasse

Se o Lab ganhar tela — hoje ele não pode, por regra —, ou se algum prompt
precisar de IA, esta página deixa de valer e a adoção passa a ser obrigatória,
na ordem: kit `@archilly/central` como dependência, design pelo catálogo,
`central.ia` para qualquer chamada paga, e `SEGURANCA.md` refeito antes.

**Enquanto isso não acontecer, adotar a Central seria acrescentar uma
dependência que nada usaria** — e `external-engines/` inteiro precisa continuar
podendo ser apagado sem que o resto da família sinta (`README.md`, regra 4).

## Uma nota sobre o vizinho vendorizado

`external-engines/testfit/tipos/archilly-central.d.ts` e o mesmo arquivo em
`external-engines/esteira/` **declaram** o pacote `@archilly/central` — mas isso
não é adoção. É uma declaração ambiente de uma linha, escrita porque o clone de
leitura do Generate traz a pasta `vendor/archilly-central/` só com documentos,
sem código, e o `tsc` não achava o módulo ao compilar a fonte dele. O Lab não
importa nada da Central em tempo de execução.
