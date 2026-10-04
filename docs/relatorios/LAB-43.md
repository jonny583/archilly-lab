# LAB-43 · A etiqueta do contrato sai do medido — e as provas estavam velhas

**04/10/2026 · `bun run lab25 · lab26 · lab28 · lab30` ·
`external-engines/esteira/tests/contrato.test.ts`**

O chat aprovou, primeiro da ordem: *"LAB-43, as quatro provas que declaram contrato "2"
quando entrada nenhuma do repositório é "2"."* É o conserto que o **D146** havia proposto
ao achar o caso durante o LAB-39.

---

## 1 · O defeito, e por que a guarda do §7 não pegava

| arquivo | declarava | as glebas que ele mede declaram |
|---|---|---|
| `LAB-25/guarda-da-ponte.json` | `"2"` | `"1"` |
| `LAB-26/varredura.json` | `"2"` | `"1"` |
| `LAB-28/acesso.json` | `"2"` | `"1"` |
| `LAB-30/guarda-da-ida.json` | `"2"` | `"1"` |

**Varrido o repositório: nenhuma entrada é `"2"`.** As quatro fixtures e as quatro glebas
sintéticas declaram `archilly.versao: "1"`. A esteira **lê** `["2","1"]` (D87) — mas nada
que ela mede **é** `"2"`.

> A guarda do §7 confere que a chave `contrato` **existe**, nunca que ela **corresponde ao
> medido**. Chave presente com valor errado passa — é medir ortografia, não conteúdo.

---

## 2 · O conserto é de causa: a etiqueta vem da entrada

`contratoDasEntradas()` mora em `src/gleba-v1.ts`, num lugar só (D116), e tira a versão
**das entradas que a ferramenta de fato mede**. As quatro ferramentas chamam, e as quatro
provas foram regeradas: todas dizem **`"1"`**.

**Ela reprova em três casos, de propósito:**

- **conjunto misto** — duas glebas de contratos diferentes não têm uma versão só, e
  publicar uma esconderia a outra. *Prova misturada é outra prova;*
- **conjunto vazio** — não há contrato a declarar;
- **versão que a esteira não lê** — o `VERSOES_LIDAS` é a fronteira.

---

## 3 · A guarda é sobre a FERRAMENTA, e a lista se revalida

Conferir uma prova publicada contra as glebas que ela mediu exigiria saber **quais** glebas
cada prova mediu, e isso nem sempre está no arquivo. A **causa** é estática: nenhuma
ferramenta deve escrever o literal.

**Sete travas** em `tests/contrato.test.ts`, e a que faz o conjunto não apodrecer é a
quinta: **treze ferramentas antigas ainda escrevem o literal `"1"`**, com a prova não
regerada (D118 proíbe regerar prova congelada para consertar etiqueta) — e **cada literal
da lista tem de ser igual à versão que todas as entradas declaram**. No dia em que entrar
uma entrada `"2"`, a trava reprova e **cada caso vira decisão**, em vez de envelhecer.

---

## 4 · A régua errou primeiro, e é a DÉCIMA SEGUNDA vez (D155)

A primeira versão da trava casou `/contrato: "\d+"/` no texto cru e **reprovou
`lab25.ts` — o arquivo que eu acabara de consertar.** O comentário que explica o conserto
**cita** o defeito, e a régua leu a citação como código.

> **Comentário é onde um nome significa *"eu estou falando sobre"*, não *"eu faço"*.**

**Terceira vez desta sub-família**, e as três são a mesma frase: D137 (a chave `"gleba"`
literal), D142 (a menção de `@generate/` em vez do `import`) e esta. O conserto é
`semComentarios()`, e a função carrega a explicação — porque a próxima régua que varrer
código vai ter a mesma tentação.

---

## 5 · O achado que a regeração revelou: duas provas velhas e caladas (D156)

| prova | velha desde | o que mudou ao regerar |
|---|---|---|
| `LAB-30/guarda-da-ida.json` | **LAB-40** | inventário de **72 para 74** campos (os dois irmãos do `segmento`, D147); `traduzido` 29 → 31; promessas não exercitadas **123 → 137** |
| `LAB-25/guarda-da-ponte.json` | **LAB-37** | em `geo-antonina` a variante escolhida passou a ser a de **33 lotes** (D140), e o bloco do `faceDeRua` ainda trazia os números da antiga (**1 386** lotes) |

**Por que ninguém viu:** o LAB-33 deu **detector de prova velha** ao LAB-23 e ao LAB-28
(D131) — medem ao vivo e comparam com o arquivo. **O LAB-25 e o LAB-30 não têm detector.**

**E apareceu um número que eu NÃO atribuo sem medir** (§6). Na prova regerada, em
`geo-antonina`:

```
faceDeRua · lotes 33 · publicadosPelaPonte 0 · nulosNaPonte 33 · soOGenerateMediu 5
```

A ponte publica `faceDeRua: null` nos 33 lotes e a régua do Generate mede 5. **Tem a forma
do D104**, mas a guarda da ponte **não reprova** e a variante mudou entre as duas rodadas:
pode ser **propriedade da variante de 33 lotes**, pode ser **a ponte**. **Não medi, e não
acuso** — está proposto ao chat, junto do detector que falta às duas provas.

---

## 6 · Entrega

| o quê | onde |
|---|---|
| a conta única | `esteira/src/gleba-v1.ts` · `contratoDasEntradas()` |
| as quatro ferramentas consertadas | `ferramentas/lab25.ts`, `lab26.ts`, `lab28.ts`, `lab30.ts` |
| as quatro provas regeradas, dizendo `"1"` | `docs/provas/LAB-{25,26,28,30}/` |
| as sete travas, e a lista fechada que se revalida | `esteira/tests/contrato.test.ts` |
| a lista do CI, com o arquivo novo (**83 travas**) | `.github/workflows/verde.yml` |
| decisões | **D154**, **D155**, **D156** · `CLAUDE.md` §6 agora tem **doze** linhas |

**Verde:** `./external-engines/conferir.sh` — 7 passos, **400 travas** (eram 393), exit 0.

**Os clones vizinhos ficaram limpos** — `git status --porcelain` vazio nos três.

**Não há `docs/provas/LAB-43/`, e isso vai declarado:** a prova deste prompt **são as
quatro provas regeradas** e as travas. Criar um JSON novo só para cumprir formalidade
duplicaria o dado que já está nos quatro arquivos — e a §7 pede o oposto.
