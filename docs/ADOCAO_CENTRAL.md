# ADOÇÃO DA CENTRAL — Archilly Lab

**Estado: o Lab NÃO adota a Archilly Central, e a decisão é deliberada.**
Escrito no LF-FINAL, 14/09/2026; **remedido e posto sob trava no LAB-167, 18/10/2026** (D395).

O Padrão da família manda todo repositório ter este arquivo. Ele existe aqui
para responder a pergunta de frente em vez de deixar a ausência parecer
esquecimento.

> **Cada linha desta página tem quem a pergunte a cada verde.** Até o LAB-167
> ela afirmava seis estados e nenhum código a lia; dois estavam falsos —
> *"não há tela"*, falso desde **antes** de a página nascer (a bancada é de
> 10/09/2026), e *"o vendor do Generate não tem código"*, falso depois. As travas
> estão na última coluna; quem apagar uma da página reprova a do LAB-167.

---

## Por que não adota

A Central é a portaria da família: contas, créditos, design, unidades, textos,
registro de erro e aceite de termos. **O Lab não tem nada disso, e não por
falta de tempo — por definição.**

| o que a Central resolve | o Lab tem? | por quê | quem pergunta |
|---|---|---|---|
| contas e login | **não** | não há usuário. O Lab roda em linha de comando, por um prompt | — é definição, não estado |
| créditos e cobrança | **não** | não há chamada paga | `external-engines/esteira/src/nada-pago.ts` (LAB-148) |
| design e catálogo de cores | **não** | **uma** página, e é ferramenta da sessão, não tela de usuário: a bancada do navegador (`external-engines/symbios/adapter/ferramentas/navegador/index.html`, desde 10/09/2026), que abre o `.wasm` do Symbios e publica números. É a exceção declarada da regra *"não tem interface"* (`CLAUDE.md` §4, D381) e tem duas cores escritas nela, à mão — não passa pelo catálogo, e não tem quem a veja além da sessão | `external-engines/esteira/src/a-unica-interface.ts` (LAB-153) |
| unidades e formatação | **não** | o núcleo é em metro e a saída é JSON de medição, não texto para pessoa | — |
| textos da interface | **não** | a bancada publica números, sem formulário e sem texto para usuário | a mesma do design |
| registro de erro | **não** | erro aqui aparece no terminal e no relatório do prompt | — |
| aceite de termos | **não** | não há usuário para aceitar | — |
| gateway de IA | **não** | **o Lab não chama IA em nenhum lugar**, nem rede nenhuma em execução | `external-engines/esteira/src/rede-em-execucao.ts` (LAB-158) |

## A regra que isso não quebra

O Padrão diz: *"Chave de IA só no servidor da Central"*. O Lab cumpre pelo
caminho mais curto — **não há chave nenhuma aqui**, porque não há chamada
nenhuma. A busca da `SEGURANCA.md` dizia *"zero ocorrências"* e dava duas
(texto de teste, nenhuma chave); desde o LAB-166 ela é perguntada a cada verde:
`external-engines/esteira/src/a-busca-das-chaves.ts`.

## Nada importa o pacote — nem em execução

Perguntado por `external-engines/esteira/src/a-adocao-da-central.ts` (LAB-167),
em duas partes:

1. **sem clones** — em tudo o que o `git` desta casa carrega, fora de
   `upstream/`, nenhum arquivo de código importa `@archilly/central` (de nenhuma
   das nove formas, nem só o tipo), nenhum `package.json` depende dele, e só as
   duas declarações abaixo o declaram, idênticas;
2. **com os clones** — o fecho das importações de valor, a partir de tudo o que
   o `tsconfig.json` da esteira e do testfit incluem, atravessando o Generate e
   o Laboratório de Parcelamento pelos `paths`, **nunca chega ao pacote**.
   Medido em 18/10/2026: 424 e 88 arquivos, 73 deles nos dois vizinhos, zero
   chegadas. Contando também o que é só de tipo, chega uma vez — o
   `src/lib/design/cores.ts` do Generate, por um `import type` —, e é por isso
   que o `tsc` precisa da declaração e a execução não.

## O que mudaria se um dia adotasse

Se o Lab ganhar tela de usuário — hoje a regra só admite a bancada —, ou se
algum prompt precisar de IA, esta página deixa de valer e a adoção passa a ser
obrigatória, na ordem: kit `@archilly/central` como dependência, design pelo
catálogo, `central.ia` para qualquer chamada paga, e `SEGURANCA.md` refeito
antes. **A trava do LAB-167 reprova no primeiro import, de propósito**: mudar de
ideia é do chat, e a trava muda junto.

**Enquanto isso não acontecer, adotar a Central seria acrescentar uma
dependência que nada usaria** — e `external-engines/` inteiro precisa continuar
podendo ser apagado sem que o resto da família sinta (`README.md`, regra 4).

## Uma nota sobre as duas declarações

`external-engines/testfit/tipos/archilly-central.d.ts` e o mesmo arquivo em
`external-engines/esteira/` **declaram** o pacote `@archilly/central` — mas isso
não é adoção. É uma declaração ambiente, escrita porque o `tsc` deste
laboratório compila também o código do Generate e, seguindo os imports **de
tipo**, chega a um arquivo de lá que importa o pacote. O Lab não instala o kit
no clone do vizinho (não escreve nele) e não o carrega em execução.

~~*"o clone de leitura do Generate traz a pasta `vendor/archilly-central/` só com
documentos, sem código"*~~ — **saiu no LAB-167**: hoje ela traz o `package.json`
(0.48.0) e o `dist/` com o código do kit. É estado do vizinho, que esta página
não tem como manter verdadeiro; o que importa ao Lab é o que a trava pergunta.
