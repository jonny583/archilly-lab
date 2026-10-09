# COMO RELIGAR O CI — o lugar único

> **Este é o ÚNICO lugar onde está escrito como religar.** O `.github/workflows/verde.yml`
> aponta para cá, o `ONDE_PARAMOS.md` aponta para cá, e o recado ao chat aponta para cá. Se
> alguém escrever a receita noutro arquivo, ela envelhece numa das duas terras (D104).

## Por que ele está desligado

**08/10/2026 — o orçamento de GitHub Actions da família estourou.** Não é defeito de código:
todo trabalho falhava antes de executar um passo, com *"recent account payments have failed or
your spending limit needs to be increased"*. No painel de outubro: uso bruto **US$ 23,75**, cota
gratuita **US$ 13,75**, **US$ 10,00** a pagar — o teto que o Jonny havia posto. **Ele decidiu NÃO
comprar mais orçamento.** A cota zera em **1º de novembro de 2026**.

**A parte que é só deste repositório, e ela é uma boa notícia medida:** `archilly-lab` é
**público**, e Actions em runner padrão (`ubuntu-latest`) é **gratuito e não medido** em
repositório público. Medido: **136 execuções, 272 trabalhos, 272 minutos, 272 de 272 em
`ubuntu-latest`** — contribuição ao estouro: **US$ 0,00**. Se fosse privado, seriam US$ 2,18.
Desliguei assim mesmo, porque a ordem foi da família e porque **50 % desses minutos eram
desperdício puro** — ver o §3 abaixo.

## RELIGAR SÃO DOIS PASSOS. Quem fizer só o primeiro vai achar que o GitHub quebrou.

**Passo 1 — descomentar o gatilho**, em `.github/workflows/verde.yml`:

```yaml
on:
  push:                      # ← tirar o `#` destas quatro linhas
    branches: ["**"]
  pull_request:
  workflow_dispatch:
```

**Passo 2 — REABILITAR a rotina no GitHub**, que é a trava que de fato segura:

```sh
gh api -X PUT /repos/jonny583/archilly-lab/actions/workflows/374646435/enable
```

ou **Actions → `verde` → `Enable workflow`**. Enquanto a rotina estiver `disabled_manually`,
**descomentar o gatilho não faz nada** — e é por isso que este arquivo existe.

**Conferir que religou:**

```sh
gh api /repos/jonny583/archilly-lab/actions/workflows/374646435 --jq .state   # tem de dar: active
```

## Enquanto isso, o verde continua existindo — na mão

```sh
./external-engines/conferir.sh
```

**Toda entrega passa a declarar "conferido aqui, não no GitHub".** Verde na mão e verde na nuvem
são afirmações diferentes: no Render um teste já ficou verde na mão e vermelho na nuvem.

## A trava que impede o esquecimento

`external-engines/esteira/tests/gatilho-do-verde.test.ts`. Ela cobra os dois lados:

- **gatilho comentado** → exige que este arquivo exista e traga os **dois** passos, e **REPROVA a
  partir de 1º/11/2026**, que é quando a cota zera e o motivo de estar desligado acaba;
- **gatilho ativo** → exige que o aviso de desligado **saia** daqui e do `ONDE_PARAMOS.md`.

**Por que ela precisava existir, e o achado é do Render:** a régua que caça desligadores de
conferência procura regra em `"off"` e passo que ignora erro, e **não tem forma para "o gatilho
virou comentário"** — que é o desligamento mais completo que existe. *Régua desligada publica
verde.*
