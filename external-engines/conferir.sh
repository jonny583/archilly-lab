#!/usr/bin/env bash
#
# ════════════════════════════════════════════════════════════════════════════
#  "VERDE" É ESTE COMANDO. Não há outro, e ele roda tudo. (LAB-31)
# ════════════════════════════════════════════════════════════════════════════
#
#   ./external-engines/conferir.sh
#
# # Por que ele existe, e por que ele DESCOBRE em vez de listar
#
# "Testes verdes" já foi meia verdade duas vezes neste repositório:
#
#   · D110 — a suíte do pacote `testfit` ficou VERMELHA 14 de 14 por duas
#     semanas, porque o `bun test` que eu rodava era só o do `esteira`. Dois
#     daqueles 14 testes eram as travas do D98 e do D104: a suíte invisível
#     calou os próprios alarmes.
#   · LAB-31 — a prova no navegador existia desde o LAB-01 e era INTEIRAMENTE
#     MANUAL (compilar, copiar, servir, abrir o Chromium e LER COM O OLHO).
#     Rodou uma vez, em 10/09/2026, e nunca mais.
#
# A primeira versão deste script listava os dois pacotes **à mão**, e por isso
# tinha o mesmo defeito em potência: o terceiro pacote nasceria fora. Agora ele
# **descobre** todo `package.json` do repositório e **reprova** se achar um que
# não esteja coberto aqui. O jeito de um pacote ficar de fora deixou de existir.
#
# # Regras deste script
#
#   1. roda TODOS os passos, mesmo depois de um falhar — quem conserta quer a
#      lista inteira, não o primeiro erro;
#   2. nada PULA. Precondição que falta é FALHA, com o comando exato para
#      resolvê-la. Pular é o que cala alarme;
#   3. sai com código 1 se qualquer passo falhar.
#
# # Quem roda isto, e o que o CI alcança (LAB-51)
#
# **Há CI desde o LAB-38**, em `.github/workflows/verde.yml`, com DOIS trabalhos e
# nomes que não enganam (D141):
#
#   · `guardas que não precisam dos clones vizinhos (NÃO é o verde)` roda em todo
#     push, sem segredo — as travas que leem arquivo do próprio repositório;
#   · `o verde completo` É este script, e precisa do segredo `VIZINHOS_TOKEN`,
#     porque o comando único lê DOIS CLONES PRIVADOS por caminho (D16) e este
#     repositório é público. Sem o segredo ele FALHA COM A RECEITA, e não pula
#     (D124).
#
# **Enquanto o segredo não existir, quem roda este script é uma pessoa — ou um
# despertador — antes do commit.**
#
# # Este bloco mentiu por 8 dias, e agora tem guarda (LAB-51)
#
# Até o LAB-51 ele dizia, por extenso: *"Não há CI neste repositório (não existe
# `.github/workflows`)"*. Era verdade quando o LAB-31 o escreveu, e **ficou falso no
# LAB-38**, que criou o workflow — e ninguém viu, porque **comentário não se
# revalida**. É a forma exata do D104, no alto do arquivo mais lido do repositório.
#
# A guarda está no `esteira/tests/verde.test.ts`: **toda afirmação deste script que
# diz "não existe" ou "não há" sobre um CAMINHO entre crases é conferida contra o
# disco**. Se o caminho existir, a trava reprova.
#
set -u
cd "$(dirname "$0")/.."
RAIZ="$(pwd)"

falhou=0
passos_ok=()
passos_ruins=()

passo() { # passo <nome> <diretório> <comando...>
  local nome="$1" dir="$2"; shift 2
  echo ""
  echo "══════════ $nome ══════════"
  if (cd "$dir" && "$@"); then
    passos_ok+=("$nome")
  else
    echo "✗ FALHOU: $nome"
    passos_ruins+=("$nome")
    falhou=1
  fi
}

# ── 0 · Os pacotes que este script cobre, e a guarda contra esquecer um ──────
COBERTOS=("external-engines/esteira" "external-engines/testfit")

echo "══════════ cobertura: todo pacote do repositório entra aqui ══════════"
achados=$(find "$RAIZ" -name package.json -not -path "*/node_modules/*" -printf "%h\n" \
  | sed "s|^$RAIZ/||" | sort)
for pacote in $achados; do
  coberto=0
  for c in "${COBERTOS[@]}"; do [ "$pacote" = "$c" ] && coberto=1; done
  if [ "$coberto" -eq 0 ]; then
    echo "✗ o pacote '$pacote' NÃO está coberto por este script."
    echo "  Acrescente-o a COBERTOS, em external-engines/conferir.sh."
    echo "  (Foi assim que a suíte do testfit ficou vermelha duas semanas — D110.)"
    falhou=1
    passos_ruins+=("cobertura: $pacote fora")
  else
    echo "  ✓ $pacote"
  fi
done

# ── 1 · A precondição do Symbios: o .wasm, que não é versionado ─────────────
WASM="$RAIZ/external-engines/symbios/archilly/wasm/target/wasm32-unknown-unknown/release/archilly_symbios_wasm.wasm"
echo ""
echo "══════════ precondição: o .wasm do Symbios ══════════"
if [ -f "$WASM" ]; then
  echo "  ✓ $(stat -c%s "$WASM") bytes"
else
  echo "✗ o .wasm do adaptador do Symbios NÃO existe nesta máquina."
  echo "  Ele é ARTEFATO DE BUILD e não é versionado de propósito (ver .gitignore)."
  echo "  Sem ele, tudo que carrega o Symbios falha — e falha por outro motivo,"
  echo "  o que manda quem conserta para o lugar errado. Para produzi-lo:"
  echo ""
  echo "    rustup target add wasm32-unknown-unknown"
  echo "    cd external-engines/symbios/archilly/wasm"
  echo "    RUSTFLAGS='--cfg getrandom_backend=\"custom\"' \\"
  echo "      cargo build --release --target wasm32-unknown-unknown"
  falhou=1
  passos_ruins+=("precondição: .wasm ausente")
fi

# ── 2 · Os dois pacotes, os três passos de cada ─────────────────────────────
for pacote in "${COBERTOS[@]}"; do
  nome="${pacote##*/}"
  passo "$nome · typecheck" "$RAIZ/$pacote" bun run typecheck
  passo "$nome · lint" "$RAIZ/$pacote" bun run lint
  passo "$nome · test" "$RAIZ/$pacote" bun test
done

# ── 3 · A prova no NAVEGADOR, que era manual até o LAB-31 ───────────────────
passo "prova no navegador (Chromium)" "$RAIZ/external-engines/esteira" \
  bun ../symbios/adapter/ferramentas/navegador/prova-automatica.ts

# ── O veredito ──────────────────────────────────────────────────────────────
echo ""
echo "════════════════════════════════════════════════════════════════"
if [ "$falhou" -ne 0 ]; then
  echo "  NÃO ESTÁ VERDE — ${#passos_ruins[@]} passo(s) falharam:"
  for p in "${passos_ruins[@]}"; do echo "    ✗ $p"; done
  echo "════════════════════════════════════════════════════════════════"
  exit 1
fi
echo "  VERDE — ${#passos_ok[@]} passos, e a cobertura conferida."
echo "════════════════════════════════════════════════════════════════"
# O verde roda as TRAVAS. As ferramentas de diagnóstico ficam fora dele, de propósito,
# e o que elas pegam e as travas não está escrito num lugar só (item 003).
echo "  o que este comando NÃO cobre: docs/referencia/FERRAMENTA_E_TRAVA.md"
