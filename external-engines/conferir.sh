#!/usr/bin/env bash
#
# CONFERIR OS DOIS PACOTES. (LAB-26)
#
# "Testes verdes" era meia verdade, e a medição é esta: a suíte do pacote
# `testfit` ficou **vermelha, 14 de 14, por duas semanas** — desde que as
# glebas-padrão do Generate viraram v2 — e nenhum relatório meu notou, porque o
# `bun test` que eu rodava era só o do pacote `esteira`.
#
# Duas pilhas convivem de propósito (D14, D17), e cada uma tem o seu
# `package.json`. O que não podia conviver é **uma delas nunca ser rodada**.
#
#   ./external-engines/conferir.sh
#
set -u
cd "$(dirname "$0")"

falhou=0
for pacote in esteira testfit; do
  echo "═══════════════════════ $pacote ═══════════════════════"
  for passo in typecheck lint; do
    if ! (cd "$pacote" && bun run "$passo"); then
      echo "✗ $pacote · $passo"
      falhou=1
    fi
  done
  if ! (cd "$pacote" && bun test); then
    echo "✗ $pacote · test"
    falhou=1
  fi
done

if [ "$falhou" -ne 0 ]; then
  echo "═══════════ NÃO está verde — ver os ✗ acima ═══════════"
  exit 1
fi
echo "═══════════ os dois pacotes verdes ═══════════"
