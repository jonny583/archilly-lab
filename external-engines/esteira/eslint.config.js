// Lint mínimo do laboratório: só o que pega erro de verdade.
//
// O Lab não tem UI nem React; as regras de estilo ficam com o `prettier` dos
// outros repositórios da família. O que interessa aqui é variável não usada,
// import quebrado e `any` solto — o resto o `tsc` já cobra.
//
// ── E AS TRÊS REGRAS QUE PRECISAM DE TIPO (LAB-52, D178) ───────────────────
//
// A Central achou que *erro de chamada não conferido degrada para número que
// PARECE certo*, e a metade mais perigosa dessa classe — **promessa sem
// `await`** — NÃO se mede com regex: precisa de tipo. Há regra pronta para ela,
// `@typescript-eslint/no-floating-promises`.
//
// **Medido: ela estava MUDA aqui.** Este arquivo trazia `projectService: false`,
// e sem serviço de projeto **toda** regra type-aware fica desligada em silêncio
// — não avisa, não reclama, simplesmente não roda. É a forma do D123 (a prova
// no navegador que ninguém rodava) num lugar onde ninguém pensa em olhar.
//
// Ligadas as três e medido: **ZERO achados** na árvore inteira. Então elas não
// custam conserto nenhum e passam a morder a partir de agora. O conjunto
// `recommendedTypeChecked` COMPLETO ficou de fora, e o motivo é número: 646
// achados, 487 deles `no-unnecessary-type-assertion` e ~149 `no-unsafe-*` que
// vêm das pontes `as unknown as` entre três repositórios. Ligar aquilo seria
// outro prompt, e está proposto ao chat.
//
// **O preço, dito:** o serviço de projeto torna o `lint` mais lento, porque ele
// passa a carregar o programa do TypeScript. Medido no §4 do relatório LAB-52.
import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["node_modules/**", "**/*.d.ts"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // Só os `.ts`: o serviço de projeto não conhece este próprio arquivo de
    // configuração, e pedir-lhe tipo para ele reprova com erro de parsing.
    files: ["**/*.ts"],
    languageOptions: { parserOptions: { projectService: true } },
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "warn",
      // DESLIGADA COM MOTIVO ESCRITO, e o motivo é o compilador (LAB-60): em TypeScript
      // o `tsc` já acusa nome não definido, e o `no-undef` do eslint NÃO conhece os
      // tipos — ele dá falso positivo em `globalThis`, em tipo só-de-tipo e em
      // declaração de ambiente. É o que o próprio `typescript-eslint` recomenda
      // desligar. Revisitar se um dia o lint deixar de rodar junto do typecheck.
      "no-undef": "off",
      // As três que o LAB-52 ligou, e as três precisam de tipo.
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": "error",
      "@typescript-eslint/require-await": "error",
    },
  },
);
