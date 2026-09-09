# external-engines/packingsolver

**Nada foi clonado para `upstream/`.** A triagem não recomendou seguir, e a
especificação manda criar a cópia `upstream` só depois de o motor ser aprovado
para experimentação.

```text
Repositório:  https://github.com/fontanf/packingsolver
Commit:       a7e533033d9c6ee3ff286513720afe6660b5989f  (2026-09-08)
Licença:      MIT — sem obstáculo
Veredito:     REFERÊNCIA APENAS
```

O que desqualifica agora: C++ com CLP/HiGHS e LAPACK, portanto **só servidor**,
contra a arquitetura de navegador do Generate; e o `rectangleguillotine` não
modela acesso à via, testada, esquina nem lote irregular — sendo que lote sem
frente para logradouro é solução *inválida*, não imperfeita.

Formulação candidata, o que falta, caminho de execução e condição para
reavaliar: [`../../docs/PACKINGSOLVER_TRIAGEM.md`](../../docs/PACKINGSOLVER_TRIAGEM.md)
