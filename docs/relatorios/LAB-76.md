# LAB-76 · O registro de motores do Lab — item 009, a D68

**10/10/2026.** A D68 pede três coisas: **um registro de motores**, **liga/desliga por motor** e
**um motor padrão**. O item veio com a regra que o Jonny deu à direção em 09/10 — *nome novo para
coisa que já tem nome na casa é custo sem benefício; antes de criar estrutura nova, procure a que
já responde a pergunta* — e foi ela que decidiu o tamanho deste prompt.

**Conferido aqui, não no GitHub** (a execução automática do CI está desligada até 1º/11/2026).

---

## 1 · Procurei antes de escrever, e DUAS das três já existiam

| o que a D68 pede | já existia? | onde |
|---|---|---|
| o que um motor é, como tipo | **sim** | `CapacidadesDoMotor`, `MotorNaPorta` (LAB-06) |
| liga/desliga por motor | **sim, para o HOSPEDEIRO** | `RegistroDeMotores.ligar/desligar` |
| **motor padrão** | **sim** | `PADRAO_DE_FABRICA = "parcelamento"` |
| a procedência de um REPOSITÓRIO vizinho | **sim** | `commit-dos-vizinhos.ts` (LAB-74) |
| **a procedência de um MOTOR** | **NÃO** | nada ligava motor → repositório → commit |
| **o estado como DADO** | **NÃO** | `MOTORES_DE_LOTE` é tupla em código |
| **o tamanho do universo lido** | **NÃO** | nenhuma medição dizia quantos havia |

A peça do LAB-06 (`entrega/registro-de-motores/registro.ts`) é **para o Generate**, e já traz
registro, liga/desliga, escolha salva e a regra do ranking. O que ela **não** tem — porque não é
problema dela — é de onde cada motor vem e em que commit ele está.

**Então este prompt não criou um registro.** Ele criou o que faltava, e o padrão é **importado**,
não recopiado. Há trava que reprova se a palavra `padrao` aparecer como chave no dado: duas
respostas para a mesma pergunta é o D116.

---

## 2 · O universo é MAIOR do que eu esperava: seis, não quatro

```
6 motores conhecidos · 4 ligados · 0 desligados · 2 só-referência (triados e recusados)
```

Os quatro da porta eu conhecia. Os outros dois estavam em `external-engines/`, com README e
veredito escrito, **e em nenhuma lista**:

| motor | estado | por quê |
|---|---|---|
| `generate-ortogonal` | ligado | candidata do Generate |
| `generate-espinha` | ligado | candidata do Generate |
| `parcelamento` | ligado | o **padrão** |
| `symbios` | ligado | entrega **quadra** — fora da `MOTORES_DE_LOTE` por D50, e isso **não** é estar desligado |
| `packingsolver` | **só-referência** | C++ com CLP/HiGHS e LAPACK, portanto só servidor, contra a arquitetura de navegador do Generate; e o `rectangleguillotine` não modela acesso à via, testada, esquina nem lote irregular. **Nada clonado** |
| `straight-skeleton` | **só-referência** | impedimento de **licença**, não falha técnica: as duas implementações avaliadas são copyleft (GPLv3+ via CGAL, GPL-2.0-or-later). **Nada clonado** |

**É isto que a trava 3 queria:** *conferência que não publica o tamanho do universo que leu passa
lendo zero*. Lendo só a porta, eu teria dito "quatro motores" — e a casa conhece seis.

### `so-referencia` não é `desligado`, e o estado tem TRÊS valores por isso

`desligado` é *"está na casa e alguém o tirou da medição"*; `so-referencia` é *"foi triado e
recusado, nunca foi candidato"*. Um volta por decisão, o outro por uma triagem nova. Dois estados
onde há três inventa a informação que falta — é o D23.

**E a quarta distinção, que também não é liga/desliga:** o Symbios está ligado e fica fora da
comparação de lote porque entrega quadra. Ficar fora de uma comparação não é estar desligado, e o
relatório publica as **duas** contas: **3 de 4 ligados** entram no lote.

---

## 3 · A procedência, medida contra a ORIGEM e não contra o disco

| motor | veredito | versão | distância até a origem |
|---|---|---|---|
| `generate-ortogonal` | `medida-contra-a-origem` | `1` (declarada) | **22 commits atrás** |
| `generate-espinha` | `medida-contra-a-origem` | `1` (declarada) | **22 commits atrás** |
| `parcelamento` | `medida-contra-a-origem` | `1.0` (**lida** do motor) | **30 commits atrás** |
| `symbios` | `carimbado-no-upstream` | `0.4.1` (**lida** do `upstream/VERSION`) | não há origem a consultar |
| `packingsolver` | `nao-copiado` | não medida | nada a medir |
| `straight-skeleton` | `nao-copiado` | não medida | nada a medir |

É o segundo eixo do carimbo do LAB-74: *árvore limpa quer dizer "eu não mexi", não "está atual"*.
Os três clones estão limpos (§4 conferida) **e 22 a 30 commits atrás**.

`nao-medida` **não** é `em-dia`, e `carimbado-no-upstream` **não** é `nao-medida`: o Symbios tem a
procedência num arquivo versionado e intocável (§3) — é uma resposta, não uma falta.

### Por que o commit NÃO está gravado no dado, e a prova apareceu sozinha

Commit gravado que ninguém revalida envelhece em silêncio (D104). **Medido neste prompt, sem
ninguém tocar em nada:** `motor-testfit` estava **28** commits atrás quando eu medi, e **30** meia
hora depois. Gravar aquele 28 teria criado a sexta vez que esta casa publica disco como origem
(D241).

Então o dado guarda **de onde se lê** a versão, e quem **mede** é a ferramenta, ao rodar. É o
desenho de `conferirContraAOrigem`: função pura, medição por parâmetro — e foi isso que permitiu
as travas rodarem **sem os clones vizinhos**.

---

## 4 · As três travas que a D68 pediu, e uma quarta que não estava na lista

1. **todo motor que a esteira roda está no registro** — e ela tem **duas metades**. A de
   `registro-do-lab.test.ts` roda sem clone e confere o dado contra uma lista **escrita**; a de
   `porta.test.ts` confere aquela lista contra os ids que as fábricas **de fato produzem**. É a
   segunda que impede a primeira de medir ortografia (§6). Medido: os 4 ids reais da porta são
   exatamente os 4 `ligados` do registro, e os nomes coincidem com `capacidades().nome`;
2. **todo motor do registro tem a procedência medida, com a distância até a origem** — a tabela
   do §3, com `nao-medida` separado de `em-dia`;
3. **motor desligado não entra em medição nenhuma, e o relatório diz quantos havia e quantos
   estavam ligados** — a conta **fecha por trava**: `conhecidos = ligados + desligados +
   só-referência`, e a frase do universo **diz os números**, porque o número é o aviso;
4. **(não pedida) o formato do dado é FECHADO.** O risco declarado do item era o registro virar
   cópia do inventário das pontes. Uma régua de palavra contra isso teria a doença de sempre, e a
   lição do item 006 é outra: *tire o campo onde a coisa caberia; campo que não existe não se
   esquece*. Então o dado tem **lista fechada de chaves**, na raiz, em cada motor e na
   procedência. A cópia campo a campo não é proibida por texto — **não tem onde caber**.

O campo `oQuePrometeMoraEm` é um **ponteiro** para as constantes do inventário, e há trava que
confere que cada nome apontado **existe lá** (e reprova um ponteiro inventado).

---

## 5 · O ponto cego bateu VINTE — e esta foi pega na primeira rodada da suíte

A trava do §4 nº 3 queria dizer *"nenhum sha gravado no dado"*, e eu a escrevi varrendo texto:
`/\b[0-9a-f]{7,}\b/`. **Ela reprovou o registro legítimo** — 28 passaram, 1 falhou, e a que
falhou era a régua.

O que casou foi **`41d93a4d`**: o fim do **nome** do repositório vizinho
`urban-create-hub-41d93a4d`. O `-` é fronteira de palavra para o regex, então o nome composto se
partiu e o pedaço passou por sha.

> **Fronteira de palavra num nome composto não é fronteira de valor.**

A saída fácil era uma exceção — *"menos `41d93a4d`"* —, que é a régua de palavra se remendando com
mais palavra. O conserto foi de **estrutura**: um commit só significa commit quando é o **valor
inteiro** de um campo, então a régua percorre o JSON e olha cada valor por inteiro
(`/^[0-9a-f]{7,40}$/`). E prova as duas direções: o dado de hoje passa, um commit plantado
reprova, e o nome do vizinho atravessa.

É a **vigésima** ocorrência do §6 e a **décima primeira** da classe *régua minha acusando a si
mesma* (D245). A partição foi refeita: **11 + 4 + 2 + 2 + 1 = 20**.

---

## 6 · E um defeito que não era de régua: um `import` sobrescreveu uma prova

A ferramenta precisava de `carimbarVizinhos()`, que morava **dentro de `ferramentas/lab68.ts`**.
Importei de lá, e o `lab68` **rodou inteiro** — reescrevendo
`docs/provas/LAB-68/as-duas-pilhas.json` com a data de hoje.

> **Prova sobrescrita por um `import` é a forma mais silenciosa de perder uma medição.** Nada
> falha, nada avisa, e o arquivo continua lá — com os números errados.

A prova foi restaurada e a função **subiu para `src/commit-dos-vizinhos.ts`**, onde já morava a
metade pura da mesma pergunta (as duas metades em dois arquivos são o D116). Ela não é chamada ao
importar, então as travas sem clone continuam rodando. A regra que fica: **ferramenta é ponto de
entrada, não biblioteca** (D247).

---

## 7 · A fronteira do item: NADA mudou de estado

O item disse: *"se fazer isto exigir mudar o motor padrão ou desligar um motor que hoje entra nas
medições, você descreve o que mudaria e não muda"*. **Não exigiu.**

- o padrão continua `parcelamento`, e agora é **importado** do `PADRAO_DE_FABRICA`;
- os quatro motores da porta continuam **ligados**; `desligados` = **0**;
- a `MOTORES_DE_LOTE` continua com os **mesmos três ids**;
- **nenhuma medição desta casa muda de número por causa deste prompt.**

O que mudou é que **agora há onde desligar**, e há trava que cobra a conta quando alguém
desligar — inclusive uma que reprova desligar um motor da `MOTORES_DE_LOTE`.

### O limite do "é dado, não código", declarado

O estado mora em `dados/registro-de-motores.json`, fora de `src`, e **nenhum `.ts` se edita** para
medir com um motor fora — que é o que a D68 pede. **Mas neste repositório trocar aquela chave
continua sendo um commit**, porque tudo aqui está no git. O ganho é de **acoplamento**, não de
implantação. *Guarda que não declara o próprio buraco mente pelo silêncio.*

### O que ficaria para um prompt do chat, descrito e não feito

**Derivar a `MOTORES_DE_LOTE` do registro** (os `ligados` com `entrega: "lote"`) daria hoje
exatamente os mesmos três ids, e fecharia o buraco que o próprio comentário dela antecipa: *"no
dia em que entrar um quinto motor que entrega quadra, uma inclui e a outra não"*. Não foi feito
porque mexeria no código que decide o que entra nas medições, e a fronteira do item é clara. Hoje
há **trava** que cobra que as duas respostas coincidam.

---

## 8 · Entrega

| o quê | onde |
|---|---|
| o dado | `external-engines/esteira/dados/registro-de-motores.json` |
| o leitor e as contas | `external-engines/esteira/src/registro-do-lab.ts` |
| as travas (sem clone) | `external-engines/esteira/tests/registro-do-lab.test.ts` — **29** |
| as travas (com clone) | `external-engines/esteira/tests/porta.test.ts` — **5** novas |
| a ferramenta | `external-engines/esteira/ferramentas/lab76.ts` · `bun run lab76` |
| a prova | `docs/provas/LAB-76/registro-de-motores.json` |
| a função que subiu | `src/commit-dos-vizinhos.ts` · `carimbarVizinhos()` |

**VERDE: 760 travas na esteira + 17 no testfit, 7 passos, `exit 0`** (726 → 760). O
`guardas-sem-clones` do CI vai de **337 para 366**. **Conferido aqui, não no GitHub.**

**Os três clones vizinhos ficaram limpos** (`git status` sem alteração nos três) — o `git fetch`
mexe só nas referências locais, e nada foi puxado: atualizar um clone mudaria toda medição desta
casa, e isso é prompt, não conserto silencioso (D226).

**Decisões: D245** (fronteira de palavra não é fronteira de valor), **D246** (o registro: duas das
três já existiam), **D247** (importar uma ferramenta a executa).
