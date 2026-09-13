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
    languageOptions: { parserOptions: { projectService: false } },
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "warn",
      "no-undef": "off",
    },
  },
);
