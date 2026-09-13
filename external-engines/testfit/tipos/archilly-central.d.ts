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
 * Esse pacote é **vendorizado** lá (`"@archilly/central": "file:vendor/archilly-central"`)
 * e a pasta, no clone, traz só `ALIASES.md` e `VERSAO.txt` — documentação, sem
 * `package.json` e sem código. Não há o que instalar.
 *
 * # Por que declarar, e não instalar nem ignorar
 *
 * - **Instalar** não é possível: o código não está no clone, e o Lab não escreve
 *   no repositório do Generate.
 * - **Ignorar** (desligar a checagem) apagaria o erro junto com todos os outros
 *   daquele caminho.
 * - **Declarar** resolve o nome e para por aí.
 *
 * O tipo é `unknown` de propósito: o Lab **não usa** este pacote. Ele nunca
 * aparece no caminho de execução — `bun test` passa sem ele —, só no programa de
 * tipos. Dar-lhe um tipo útil seria inventar a API de um pacote que não se tem.
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
