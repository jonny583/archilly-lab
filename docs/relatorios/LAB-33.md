# LAB-33 · A trava que lia um arquivo passa a medir o motor

**04/10/2026 · `bun test tests/coluna-vertebral.test.ts` · 12 travas, todas medindo**

O chat mandou: *"a trava do LAB-23 continua lendo prova congelada em vez de medir;
conserte de verdade, não vire o sinal."*

Era isso mesmo, e a palavra *"não vire o sinal"* acertou o alvo: no LAB-30 eu virei o
sinal e chamei de conserto. **O teste continuou lendo um `JSON`.**

---

## 1 · A história, porque ela é a melhor aula do repositório

| quando | o que o teste dizia | o que acontecia |
|---|---|---|
| **LAB-23** · 03/10 | *"NENHUM motor muda a saída quando a via sai do arquivo"* — e o comentário se orgulhava: *"se um dia um motor passar a respeitar a via, este teste morde antes de qualquer relatório sair errado"* | **o relatório saiu errado duas vezes** (LAB-17 e LAB-23) **e ele não mordeu** |
| **LAB-30** · 03/10 | virei o sinal: o Parcelamento passou a ser exigido **mudando** a saída | **continuou lendo `docs/provas/LAB-23/coluna-vertebral.json`** |

**Por que não mordeu:** a SAÍDA do Parcelamento era idêntica com e sem a via porque **a
ida do Lab nunca entregava a via ao motor** (D119). O campo `viaManual` existe no motor
desde sempre.

**E aqui está o defeito de projeto que virar o sinal não toca:**

> ***"Saída idêntica" significa DUAS coisas*** — *o motor ignora a linha* **ou** *a ponte
> não a entrega*. Sem separá-las, o teste passa nas duas, e foi a segunda que aconteceu
> por três semanas.

O teste media a conjunção e eu lia o resultado como se fosse uma das parcelas.

---

## 2 · O que mudou (D130)

### 2.1 · Os motores rodam no teste

As oito rodadas — **duas glebas × quatro motores × com e sem a via** — são medidas neste
processo, num memo para rodar uma vez cada. **Nenhuma asserção sai de arquivo.**

| trava | o que mede |
|---|---|
| o Parcelamento **muda** a saída com a via | `JSON.stringify` das duas SAÍDAS, medidas agora, nas duas glebas |
| os outros três **não** mudam | idem — prova, não declaração |
| a mesma régua mede a linha da mão e as vias dos motores | `perfilDeRampa` ao vivo, nenhuma saindo `null` |
| em `antonina-com-via` a linha da mão é **mais mansa** que as quatro | medido |
| em `ensaio-com-via` ela é **mais íngreme** que as quatro | medido — a resposta depende da gleba, e fixar as duas pontas impede que uma leitura cômoda sobreviva à medição |

### 2.2 · A ambiguidade fica travada à parte

Três travas medem **a ponte**, direto na `idaParaOMotor`, **sem motor no meio**:

1. no contrato **v2** a ida lê a `via_desenhada` sozinha e preenche `viaManual`;
2. sem via desenhada no arquivo, `viaManual` **não é inventada**;
3. quem já sabe separar via desenhada de testada de frente **passa pronto**, e a ida
   respeita o que recebeu (no v1 os dois têm o mesmo tipo, e a régua que os separa mora
   na esteira — D20, D116).

**É a trava que teria mordido em 13/09.**

### 2.3 · A prova congelada vira detector de prova velha (D131)

O último `describe` **mede e compara** com `docs/provas/LAB-23/coluna-vertebral.json`,
reprovando com *"regere com `bun run lab23`"*. Confere a semente primeiro, para não
acusar *"prova velha"* quando o que mudou foi a semente.

**O arquivo ganhou a função que é dele — avisar — e perdeu a que não era, responder.**
Medido agora: os números publicados **batem**, então a prova do LAB-30 está em dia.

---

## 3 · A regra geral, e a varredura que ela exige (D131)

> **Teste que LÊ prova congelada para responder à pergunta não falsifica: ele repete.**

Regra nova sem varredura é regra que só vale para o caso que a criou. As **sete** travas
que leem `docs/provas/`:

| trava | o que lê | veredito |
|---|---|---|
| `coluna-vertebral.test.ts` | prova **vs** medido agora | ✅ consertada neste prompt |
| `acesso.test.ts` · posições declaradas | constante do código **vs** prova | ✅ detector |
| `acesso.test.ts` · o confronto do D116 | prova do LAB-19 **vs** prova do LAB-28 | ⚠️ **repete** |
| `guarda-da-ida.test.ts` · a dívida publicada | o conteúdo da prova | ✅ a propriedade é *"foi publicado"*; as outras 19 travas do arquivo medem ao vivo |
| `identidade.test.ts` | o `LEIA-ME.md` que explica as provas antigas | ✅ é sobre o texto existir |
| `pagina.test.ts` | prova **vs** página gerada | ✅ detector de página velha |
| `verde.test.ts` · a sabotagem | o registro de um experimento manual | ✅ não é remensurável sem sabotar de novo, e está dito no próprio arquivo |

**Uma só repete, e eu não a consertei** — ver o §6.

---

## 4 · O preço, e ele vai dito

A suíte do `esteira` foi de **108 s para 176 s**. A rodada de `antonina-com-via` leva
~22 s por passagem, e são oito.

**Esse é o preço de o teste responder pelo motor em vez de responder por um `JSON`.**
Teste rápido que não falsifica nada é barato do jeito errado — e o LAB-23 custou dois
relatórios publicados com a conclusão trocada.

---

## 5 · Um defeito meu no caminho, pequeno e instrutivo

Eu memoizei o `.wasm` com `Motor.carregar` **sem `await`**, para não carregá-lo quando
nenhum teste do Symbios rodasse. O memo guardou a **promessa**, e o Symbios morreu com
`motor.comSessao is not a function` — cinco travas vermelhas de uma vez. Resolvido com
top-level await; custa o mesmo, porque o `.wasm` tem 193 KB. O comentário do tropeço
ficou no arquivo, onde quem for "otimizar" aquilo de novo vai ler.

---

## 6 · O que fica proposto ao chat

**A única trava que ainda repete: o teste do D116 em `acesso.test.ts`.** Ele confere que
a tabela do LAB-19 e a prova do LAB-28 trazem os mesmos números de confronto do acesso —
mas **se as duas forem regeradas erradas do mesmo jeito, ele passa**.

**O conserto é barato:** recalcular o agregado a partir dos números crus que a própria
prova já carrega, com `referenciaDe`/`amplitudePctDe` do `acesso.ts` — **sem rodar motor
nenhum**, portanto sem custo de suíte. Medir ao vivo o confronto inteiro custaria as 5
glebas × 4 motores × 6 posições de acesso do LAB-28, que é outra ordem de grandeza.

**Não executado:** é escopo novo e o §1-A proíbe ampliar por conta própria.

---

## 7 · O estado verde, e os vizinhos

```
./external-engines/conferir.sh
VERDE — 7 passos, e a cobertura conferida.   323 testes, exit 0
```

`git status` nos três clones somente-leitura: **limpos, nenhum arquivo alterado** — Geo
(`urban-scout-tool`), Generate (`urban-create-hub-41d93a4d`) e o motor do Laboratório de
Parcelamento (`motor-testfit`).

## 8 · Decisões

| | |
|---|---|
| **D130** | A trava do LAB-23 passa a **medir** — virar o sinal não tinha consertado nada |
| **D131** | Prova congelada tem **um** uso honesto: detectar prova velha — com a varredura nas outras seis |
