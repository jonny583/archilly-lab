# Como ler as provas deste laboratório

**As provas são números crus, em JSON, um diretório por prompt.** Cada arquivo traz a
gleba, o motor, a semente e a versão do contrato, para poder ser conferido e refeito.

---

## ⚠ Uma etiqueta mudou de significado em 03/10/2026 (LAB-29)

**Provas geradas ANTES do LAB-29 trazem, em `motor.nome` e `motor.versao`, etiquetas
do Laboratório — não a identidade do motor.** Nos arquivos abaixo está escrito:

```json
"motor": { "nome": "motor-testfit", "versao": "T00-A+espinha" }
```

| arquivo | o que ele é |
|---|---|
| `LAB-07/ensaio-47ha.saida.json` | a SAÍDA medida no LAB-07, 13/09/2026 |
| `LAB-07/geo-antonina.saida.json` | idem |
| `LAB-07/lab01-50ha-ondulado.saida.json` | idem |
| `../contratos/saidas/ensaio-47ha.testfit.saida.json` | a SAÍDA entregue ao Generate no LAB-08 |
| `../contratos/saidas/geo-antonina.testfit.saida.json` | idem |

**Nenhuma das duas etiquetas era do motor:**

- **`motor-testfit`** é o nome do **repositório** dele. O motor se chama
  `laboratorio-de-parcelamento`, e publica esse nome em `MOTOR_NOME`;
- **`T00-A`** é o nome de um **prompt do Laboratório**. O motor publica a própria
  versão em `MOTOR_VERSAO`, com a nota *"sobe quando o desenho muda de forma que o
  Generate veja"*.

**A etiqueta envelheceu no lugar**, que é a razão de isto ter virado prompt: o motor
foi do T00-A ao T05 e o campo continuou dizendo `T00-A` — e o mesmo rótulo estava
escrito em **dois** arquivos do Lab, com valores diferentes (D108, D117).

### Por que estes arquivos NÃO foram regerados

**Eles são o registro de uma medição feita naquele dia, com o motor daquele dia.**
Regerá-los apagaria a medição para consertar uma etiqueta — e os números deles são
citados nos relatórios do LAB-07 e do LAB-08. Ficam como estão, com este aviso.

**Provas geradas a partir do LAB-29 trazem a identidade do motor**, importada dele:
`"nome": "laboratorio-de-parcelamento"`, `"versao": "1.0+<partido de traçado>"`. O
`+<partido>` é a **única** coisa que o Lab acrescenta, e existe para a opção não
virar anônima na mesa do Generate; o rótulo da rodada do Lab vai em
`archilly.origem`, que é o campo de quem **rodou**.

---

## O que mais é bom saber antes de comparar dois arquivos

- **A semente é a mesma em todos** (`20260913`), e o determinismo é provado: a mesma
  entrada, duas vezes, dá a mesma SAÍDA byte a byte;
- **`geradoEm` é carimbo fixo** nas provas, de propósito — carimbo de hora real
  quebraria a comparação byte a byte, que é justamente o que se quer comparar;
- **`null` é "não medido" e zero é uma medição** (D23). Um campo `null` nunca
  significa "deu zero";
- **a versão do contrato viaja em cada arquivo.** Provas da v1 e da v2 convivem: a v2
  trouxe `rampaMaxima_pct` por via, a nascente e a via desenhada separada da testada
  de frente.
