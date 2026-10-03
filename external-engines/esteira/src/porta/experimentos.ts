/**
 * UM EXPERIMENTO PARA CADA CAPACIDADE — e a varredura que prova que não falta
 * nenhum. (LAB-26)
 *
 * # Por que este arquivo existe
 *
 * O LAB-14 escreveu, no alto do `porta.ts`:
 *
 * > *"Cada campo é falsificável, e o `tests/porta.test.ts` falsifica todos."*
 *
 * **A segunda metade da frase não era verdade, e ninguém tinha como saber.** A
 * varredura do LAB-26 contou: dos 15 campos de `Capacidades`, **três** não tinham
 * experimento nenhum — `respeitaAcesso`, `geometrias` e `versao` —, e foi
 * justamente num deles que a declaração estava **falsa**: o Laboratório de
 * Parcelamento dizia `respeitaAcesso: false` e muda de **703 para 603 lotes**
 * quando o acesso se move.
 *
 * Isto é o mesmo defeito que o LAB-25 consertou na ponte, uma camada acima:
 * **uma afirmação sobre o futuro morando em prosa**. Lá era um comentário
 * dizendo *"o motor não calcula greide"*; aqui era um parágrafo dizendo *"o teste
 * falsifica todos"*. Nenhum dos dois se revalida.
 *
 * # Como ele impede a repetição
 *
 * Cada campo de `Capacidades` aponta para o **nome do teste** que o desmente, e
 * `tests/porta.test.ts` confere duas coisas que a prosa não conferia:
 *
 * 1. **cobertura** — todo campo de um `Capacidades` de verdade está aqui.
 *    Campo novo na porta sem experimento fica **vermelho no mesmo dia**;
 * 2. **existência** — todo nome citado aqui existe de fato no arquivo de teste.
 *    Renomear ou apagar um teste e deixar o registro apontando para o vazio
 *    **reprova**.
 *
 * A segunda é a que dá peso à primeira: sem ela, este arquivo seria mais uma
 * lista afirmando coisas sobre um arquivo que ela não lê.
 *
 * # Os três campos que NÃO têm experimento, e por quê
 *
 * `id`, `nome` e `versao` não são capacidades — são identificação. Dois deles
 * ainda assim têm o que conferir, e o registro diz qual:
 *
 * - **`id`** é chave: a tela separa motores por ele. O que se confere é que não
 *   colide entre os motores, e isso é conferível;
 * - **`versao`** é afirmação sobre o motor, e **ganhou experimento neste prompt**:
 *   a versão que a porta declara tem de ser a que a SAÍDA carrega. Estava `"T02"`
 *   na porta e `"T00-A"` na esteira — duas respostas, nenhuma conferida;
 * - **`nome`** é rótulo **de tela**, escolhido pelo Lab para a lista de motores, e
 *   nisso não há o que medir. **O achado que estava aqui foi resolvido no LAB-29**:
 *   a SAÍDA escrevia `"motor-testfit"` — o nome do repositório — onde o motor
 *   publica `MOTOR_NOME = "laboratorio-de-parcelamento"`. A identidade do contrato
 *   agora é importada do motor, e `tests/identidade.test.ts` a trava (D117). O
 *   `nome` da porta continua sendo o rótulo de tela, de propósito: é ele que diz
 *   *"Symbios + subdivisão do Lab"*, que a versão do motor não pode dizer.
 */
import type { Capacidades } from "./porta.ts";

/** O que se faz com um campo: desmentir por medição, ou conferir de outra forma. */
export type Cobertura =
  /** Há um experimento que prova a declaração falsa. `teste` é o nome dele. */
  | { tipo: "falsificavel"; teste: string }
  /** Não é capacidade, mas há o que conferir. `teste` é o nome do que confere. */
  | { tipo: "conferido"; teste: string; porque: string }
  /** Não há o que medir, e a razão está escrita. */
  | { tipo: "sem-regua"; porque: string };

/**
 * O experimento de cada campo de `Capacidades`.
 *
 * As chaves são exatamente as de `Capacidades` — o tipo abaixo obriga, e o teste
 * de cobertura confere contra um objeto de verdade, porque o tipo só vale em
 * tempo de compilação e campo novo pode entrar por outro caminho.
 */
export const EXPERIMENTOS: Record<keyof Capacidades, Cobertura> = {
  id: {
    tipo: "conferido",
    teste: "todos declaram capacidades completas e coerentes",
    porque: "é chave de tela: o que importa é não colidir entre motores",
  },
  nome: {
    tipo: "sem-regua",
    porque:
      "rótulo de TELA, escolhido pelo Lab para a lista de motores — é ele que diz \"Symbios + " +
      "subdivisão do Lab\", que a versão do motor não pode dizer. O achado que estava aqui (a " +
      "SAÍDA escrevia o nome do repositório onde o motor publica o próprio) foi resolvido no " +
      "LAB-29, e `tests/identidade.test.ts` o trava",
  },
  versao: {
    tipo: "falsificavel",
    teste: "`versao`: a versão declarada é a que a SAÍDA carrega",
  },
  entrega: { tipo: "falsificavel", teste: "`entrega`: quem diz lote entrega lote" },
  leRelevo: {
    tipo: "falsificavel",
    teste: "`leRelevo`: com e sem curvas de nível, a saída muda se e só se ele lê",
  },
  relevoMudaOTracado: {
    tipo: "falsificavel",
    teste: "`relevoMudaOTracado`: a GEOMETRIA muda se e só se ele desvia pelo relevo",
  },
  respeitaViaDesenhada: {
    tipo: "falsificavel",
    teste: "`respeitaViaDesenhada`: com uma via no miolo, ele a segue se e só se declarou",
  },
  respeitaTestadaDeFrente: {
    tipo: "falsificavel",
    teste: "`respeitaTestadaDeFrente`: há lote com aresta na testada se e só se declarou",
  },
  respeitaAcesso: {
    tipo: "falsificavel",
    teste: "`respeitaAcesso`: mover o acesso muda o traçado se e só se ele o lê",
  },
  respeitaRestricao: {
    tipo: "falsificavel",
    teste: "`respeitaRestricao`: tirar a APP muda o resultado de quem a respeita",
  },
  aceitaSemente: {
    tipo: "falsificavel",
    teste: "`aceitaSemente`: duas sementes mudam a saída se e só se ele a lê",
  },
  determinista: {
    tipo: "falsificavel",
    teste: "`determinista`: a mesma entrada, a SAÍDA inteira igual",
  },
  calculaGreide: {
    tipo: "falsificavel",
    teste: "`calculaGreide`: a rampa vem em número ou vem null — nunca zero de mentira",
  },
  exigeRelevo: {
    tipo: "falsificavel",
    teste: "`exigeRelevo`: sem relevo ele RECUSA pela porta, e não estoura",
  },
  geometrias: {
    tipo: "falsificavel",
    teste: "`geometrias`: o partido que saiu é um dos que ele ofereceu",
  },
};

/** Quantos campos de cada tipo de cobertura. É o número que o relatório publica. */
export function contagem(): Record<Cobertura["tipo"], number> {
  const c = { falsificavel: 0, conferido: 0, "sem-regua": 0 };
  for (const v of Object.values(EXPERIMENTOS)) c[v.tipo]++;
  return c;
}

/** Os nomes de teste que este registro promete que existem. */
export function testesCitados(): string[] {
  return Object.values(EXPERIMENTOS)
    .filter((v): v is Extract<Cobertura, { teste: string }> => "teste" in v)
    .map((v) => v.teste);
}
