/**
 * Declaração de fronteira para `@archilly/central`.
 *
 * # Por que isto existe
 *
 * O `tsc` deste laboratório compila também o código do Generate — o Validator e
 * o Judge entram por `import`, não por cópia, para que a régua seja a do dono.
 * Ao seguir os imports, o compilador chega a `src/lib/design/cores.ts` daquele
 * repositório, que importa `@archilly/central`.
 *
 * Esse pacote é **vendorizado** lá (`"@archilly/central": "file:vendor/archilly-central"`).
 * ~~A pasta, no clone, traz só `ALIASES.md` e `VERSAO.txt`, sem código~~ — saiu no
 * LAB-167 (18/10/2026): hoje ela traz `package.json` e `dist/`. É estado do vizinho,
 * e este comentário deixou de afirmá-lo.
 *
 * # Por que declarar, e não instalar nem ignorar
 *
 * - **Instalar** seria escrever o `node_modules` do Generate para o Lab usar um
 *   pacote que ele não adota (`docs/ADOCAO_CENTRAL.md`).
 * - **Ignorar** (desligar a checagem) apagaria o erro junto com todos os outros
 *   daquele caminho.
 * - **Declarar** resolve o nome e para por aí.
 *
 * O tipo é `unknown` de propósito: o Lab **não usa** este pacote. Ele nunca
 * aparece no caminho de execução, só no programa de tipos — perguntado a cada
 * verde pelo fecho das importações de valor (`esteira/src/a-adocao-da-central.ts`,
 * LAB-167), e não mais por `bun test` passar sem ele, que só dizia que a
 * instalação lá falhou. Dar-lhe um tipo útil seria inventar a API de um pacote
 * que o Lab não adota.
 */
declare module "@archilly/central" {
  /**
   * A paleta canônica da família, por nome de domínio.
   *
   * O valor é `string` porque é assim que o Generate a consome — ele lê uma cor
   * e cai num padrão local quando ela não existe. Não é a assinatura real do
   * pacote (que o Lab não tem); é a mínima que faz o programa de tipos fechar
   * sem inventar comportamento.
   */
  export function coresDeDominio(): Record<string, string | undefined>;
  const qualquerOutraCoisa: unknown;
  export default qualquerOutraCoisa;
}
