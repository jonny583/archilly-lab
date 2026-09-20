# Registro de motores — peça pronta para o Generate

**O que é:** a parte não-visual da tela unificada de parcelamento. O registro dos
motores, o botão liga/desliga, a escolha do usuário, e a regra do ranking.

**Quem instala:** a **sessão do Generate, no GU-03**. O Laboratório escreveu a
peça e **não escreve no repositório de vocês**.

**O que ela implementa:** a decisão de família (D68) e o
[`CONTRATO_MOTOR_UNIFICADO_v1.md`](../../docs/CONTRATO_MOTOR_UNIFICADO_v1.md).

---

## Como instalar, em quatro passos

**1 · Copie a pasta.** `entrega/registro-de-motores/` inteira, para onde fizer
sentido no Generate. É **um arquivo de código**, sem dependência nenhuma — nem
npm, nem do Laboratório. Copiar é a instalação.

**2 · Registre os motores.** Todos nascem **ligados**, que é o que a D68 manda.

```ts
const registro = new RegistroDeMotores();
registro.registrar(motorInterno("ortogonal"));
registro.registrar(motorInterno("espinha"));
registro.registrar(motorDoParcelamento());   // id "parcelamento" — o padrão
registro.registrar(motorDoSymbios());
```

**3 · Devolva a escolha que o usuário tinha salvo.**

```ts
const salvo = await suasPreferencias.ler("parcelamento.motores");
if (salvo) {
  const { esquecidos } = registro.aplicarEstado(salvo);
  // `esquecidos` são motores que o estado citava e que não existem mais.
}
```

E depois de cada clique no liga/desliga:

```ts
await suasPreferencias.gravar("parcelamento.motores", registro.estadoDoUsuario());
```

**4 · Monte o ranking, ligando o SEU Validator.**

```ts
const ranking = montarRanking(registro, entrada, (resultado) => {
  const inv = verificarInvariantesPlano(/* … */);
  return {
    aprovada: inv.violacoes === 0,
    motivos: inv.exemplos.map((v) => rotuloDaViolacao(v)),   // para pessoa
    nota: judge.numLotes,
  };
});
```

A peça **não julga nada por conta própria**, e não poderia: o Laboratório não tem
Validator, por decisão. Quem julga é o de vocês, com a régua de vocês.

---

## O que a tela precisa fazer com o que volta

### `ranking.aprovadas`

Ordenadas pela nota do Judge, maior primeiro. Cada uma traz `resultado` (o
desenho), `indicadores` e `ressalvas`.

**As `ressalvas` merecem espaço na tela.** São o que aquele motor **não soube
fazer** — "não li o relevo", "ignorei a via que você desenhou". Sem elas, o
urbanista compara duas propostas achando que os dois motores receberam a mesma
coisa, e não receberam.

### `ranking.reprovadas`

**Aparecem com o motivo, e nunca com o resultado.** O desenho não vem junto — o
tipo não tem o campo. Não é questão de lembrar de não mostrar: não há o que
mostrar.

### `ranking.nenhumaAprovada`

**Quando for `true`, a tela tem de dizer isso**, e mostrar as reprovadas com os
motivos. Use `ranking.recado`, que já vem escrito para pessoa e distingue três
situações que não se parecem:

| situação | o que o recado diz |
|---|---|
| correram e todas reprovaram | *"Nenhuma das N propostas passou na conferência…"* |
| está tudo desligado | *"Todos os motores estão desligados. Ligue ao menos um…"* |
| não há motor instalado | *"Nenhum motor está instalado nesta tela."* |

**Uma lista vazia sem explicação é lida como "o sistema não achou nada"** —
quando o que houve foi "achou quatro e reprovou as quatro", que é informação, e
das boas.

---

## O que a peça garante, e o que ela não garante

**Garante:**

- motor que **estoura não derruba os outros**. O contrato proíbe estourar (§7),
  mas a peça não confia: ela envolve cada geração e transforma a exceção em
  reprovação com o motivo. Isso já aconteceu uma vez, com um motor que exigia
  relevo e recebeu gleba plana;
- **reprovada sem motivo não passa**: se o Validator reprovar sem dizer por quê,
  a peça põe um motivo genérico em vez de mostrar uma reprovação muda;
- **motor novo nasce ligado** sem apagar a escolha antiga do usuário. É por isso
  que o estado salvo guarda os **desligados**, e não os ligados — guardar os
  ligados não distingue "o usuário desligou" de "não existia quando salvei".

**Não garante, e é de propósito:**

- **nada de tela.** Ordem na página, cor, onde fica o botão: de vocês;
- **nada de persistência.** A peça devolve um objeto simples; guardá-lo é de
  vocês;
- **nada de julgamento.** Ver o passo 4.

---

## O teste de que apagar o Laboratório não quebra nada

Está em `external-engines/esteira/tests/entrega.test.ts`, e é feito de dois
jeitos porque um só não bastava:

- **por leitura:** nenhum arquivo desta pasta importa `external-engines/`,
  `@symbios`, `@testfit`, `@generate` ou a esteira — e nem npm. O teste lê os
  `import` e reprova se alguém acrescentar um;
- **por execução:** o registro roda com um motor **de mentira**, escrito dentro
  do próprio teste. Se a peça precisasse do Laboratório para funcionar, esse
  teste não compilaria.

**22 testes**, e o primeiro deles é esse.
