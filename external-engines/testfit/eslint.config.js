// Lint mínimo do laboratório: só o que pega erro de verdade.
//
// O Lab não tem UI nem React; as regras de estilo ficam com o `prettier` dos
// outros repositórios da família. O que interessa aqui é variável não usada,
// import quebrado e `any` solto — o resto o `tsc` já cobra.
import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["node_modules/**", "**/*.d.ts"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // ── As três regras que precisam de TIPO (LAB-52, D178) ─────────────────
    //
    // Este arquivo trazia `projectService: false`, e sem serviço de projeto TODA
    // regra type-aware fica desligada EM SILÊNCIO — entre elas a
    // `no-floating-promises`, que é a metade mais perigosa da classe que a
    // Central nomeou: promessa sem `await`, cujo erro nunca aparece.
    //
    // Ligadas e medido: ZERO achados nos dois pacotes. Ver o relatório LAB-52.
    files: ["**/*.ts"],
    languageOptions: { parserOptions: { projectService: true } },
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "warn",
      "no-undef": "off",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": "error",
      "@typescript-eslint/require-await": "error",
    },
  },
);
