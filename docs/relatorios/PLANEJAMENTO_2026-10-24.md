# Planejamento de 24/10/2026 — a resposta do Lab (MOTOR LAB, `archilly-lab`)

**Pergunta da direção:** `archilly-direcao/docs/PERGUNTA_PLANEJAMENTO_2026-10-24.md` (lida na origem, commit `2f61527`).
**Rodada só de levantamento:** nenhum código mudou na `main`, nenhuma tarefa agendada foi tocada, nada contratado, nada publicado.
Conferido aqui, não no GitHub.

> **O que vale dizer antes de tudo: o Lab não tem cliente direto.** Ele é a bancada onde se testam motores de loteamento de
> fora (hoje o Symbios e o motor do Laboratório de Parcelamento) contra o juiz do Generate. O cliente founder nunca abre o Lab;
> ele, no máximo, vai ver um motor a mais dentro do Generate. **Para o beta, o Lab não está no caminho crítico.** As seções
> abaixo respondem o que se aplica com isso em mente.

## 1 · O que já funciona hoje (do ponto de vista de quem usa)

- Para o cliente: **nada visível** — o Lab não tem tela de cliente nem conta.
- Para o Jonny e as sessões: uma **comparação de motores** num mesmo terreno, sempre julgada pelo Validator e pelo Judge do Generate (`docs/COMPARACAO_DOS_MOTORES.md`).
- Uma **peça pronta para o Generate** (`entrega/registro-de-motores/`, desde o LAB-06): liga/desliga de motor externo, escolha salva e regra do ranking — **ainda não instalada lá** (medido hoje: nenhum `MotorNaPorta` no `src/` da `main` do Generate, `669f022`).
- As regras de urbanismo que o Jonny respondeu (travessia de rio como exceção, os 3× / 1,5 km, rampa de rua que só avisa, "quadra" = trecho de rua, os 15 m andando pela rua) estão **dentro do código e medidas** nos motores.

## 2 · O que falta para o BETA

### A — só do Claude Code desta casa

| item | rodadas |
|---|---|
| **Nada do Lab é necessário para o beta.** O que está abaixo é para o dia em que o Lab entrar no Generate como motor opcional | — |
| Mesclar o LAB-224 (as duas sabotagens do LAB-60 refeitas — feito hoje, no ramo `espera-o-novo-plano-para-mesclar-o-lab-224`, porque o verde completo foi interrompido por esta pergunta): um verde completo e a mescla | 1 |
| Quando o Generate abrir a porta: adaptar a peça `registro-de-motores` ao que ele tiver mudado desde 02/10 e medir o motor externo dentro dele | 2 a 3 |
| Reescrever a pergunta 5-B **com um desenho**, como prometido a ele, quando a integração existir | 1 |
| Dívida própria que **não** é beta (refazer as sabotagens registradas do LAB-61, 63 e 66; as `linhaNaFila` velhas de uma prova) | 4 |
| **Total para o beta: 0 rodadas.** Total para "o Lab dentro do Generate": **4 a 5**. Total se incluir a dívida própria: **8 a 9** | |

### B — do Jonny (do mais importante ao menos)

| o que é | tempo dele | bloqueia? |
|---|---|---|
| **Decidir se o Lab dorme até o beta.** Minha recomendação é sim (seção 5) | 1 min | não — mas define todo o resto desta casa |
| A decisão do **dia 1º/11**: a trava `gatilho-do-verde` deste repositório **reprova a partir de 1º/11/2026**, de propósito, para a conferência automática do GitHub não ficar esquecida desligada. Religar são dois passos (`docs/COMO_RELIGAR_O_CI.md`); este repositório é público e não paga | 2 min (a decisão) | não bloqueia o beta; bloqueia o "verde" do Lab a partir de 1º/11 |
| As quatro perguntas **paradas a pedido dele** até o Lab entrar no Generate — 5-B (régua de forma de lote), 7 (os 33 lotes de Antonina), 10 (os dois lotes de esquina sem rua), 11 (a senha `VIZINHOS_TOKEN`) | ~30 min, só quando voltarem | não, até a integração |
| A proposta do sétimo mecanismo (a fileira externa que passa da ponta da face, `docs/prompts/FILA.md`): é **desenho**, espera o olho dele — e talvez nem precise, se o Generate rodar o passo que já tem | 10 min, na integração | não |

### C — de outra casa ou da Central

- **Generate:** instalar a peça `registro-de-motores` (ou dizer que o desenho mudou) — é ele quem abre a porta; sem isso o Lab não aparece para cliente nenhum. **Não é pedido para o beta.**
- **Generate:** o arquivo de terreno trazer as ruas do entorno e os cruzamentos (pedido no LAB-77) — sem isso duas regras do acesso continuam esperando dado.
- **Central:** nada.

### D — do programador (infraestrutura)

- **O `.wasm` do Symbios não se compila nas máquinas da nuvem:** o `rustup target add wasm32-unknown-unknown` recebe 403 do proxy. Por isso **3 dos 8 passos do verde completo ficam vermelhos em toda rodada** (a precondição, a esteira do Symbios e a prova no navegador) e o Symbios não é conferido aqui desde que as sessões passaram para a nuvem. Para o beta não importa; para o Lab entrar no Generate, sim: alguém precisa compilar o `.wasm` (máquina local, ou o proxy liberar o alvo).
- Servidor, chaves, Supabase, pagamento, domínio, publicação: **não se aplicam** — o Lab não tem servidor, não guarda dado de pessoa, não usa fonte paga e não publica.

## 3 · Os números, medidos hoje

- **Percentual de pronto para o beta: não se aplica** — o Lab não entra no beta. Para "o Lab como motor dentro do Generate", uma **conta de peças, não uma medição**: das cinco peças (registro, adaptador do Symbios, `.wasm` compilado, instalação no Generate, as quatro perguntas respondidas na tela) existem duas → **≈ 40 %**.
- **Testes:**
  - o trabalho sem clones (o mesmo da rotina do GitHub): **2 284 de 2 284 verdes**, em 123 arquivos, na `main` de hoje (`ca29874`), 51 s;
  - o pacote do testfit: **17 de 17 verdes**;
  - o verde completo (`./external-engines/conferir.sh`, com os vizinhos): último medido inteiro no LAB-223 (21/10): **2 822 testes, 12 reprovados antes do conserto — 9 deles do `.wasm` ausente**. Hoje ele rodou pela metade sobre o LAB-224 e foi interrompido por esta pergunta; até ali, só as do `.wasm` e três do próprio LAB-224, consertadas. **Verde completo, nunca nesta máquina** — os três passos do `.wasm` ficam vermelhos sempre.
- **Dívidas abertas** (esta casa não tem `DIVIDAS.md`; a dívida mora na `FILA.md` e nos relatórios):
  - dívida própria escrita: **4 rodadas** (LAB-61, 63, 66 e as `linhaNaFila`) — paradas só porque os despertadores foram desligados;
  - as provas "caladas" que esperam o `.wasm` (contadas no LAB-216: 34 silêncios em 20 provas) — paradas pelo item D acima;
  - **propostas ao chat abertas: 2** — a do LAB-78 (desenho, espera o Jonny na integração) e a do LAB-96 (itens 2 e 3: a classe do custo da travessia, que muda o contrato de saída, e os 25 m, que esperam dado do Generate);
  - **pendências do Jonny abertas: 4, todas paradas a pedido dele** (5-B, 7, 10, 11) e **1 aviso** sem pedido (a 8, ligar fonte paga por pedaço — "nada agora");
  - ramo esperando pergunta: **1**, o do LAB-224 (`docs/RAMOS_ABERTOS.md`).
- **Itens da caixa de entrada não feitos: zero.** Só o `900`, que é permanente ("trabalhe a sua própria lista") e nunca vira `-FEITO`.
- **Disparos em vazio desde 17/10/2026: 12 de 94** registrados na conta (`docs/ONDE_PARAMOS.md`) até 21/10, **mais o de hoje (≤ 18:06), que não foi em vazio**. **Os 12 não foram fila vazia:** em todos, a tarefa da lista já estava com outra sessão que ainda não tinha enviado — duas sessões no mesmo trabalho. De 21/10 01:32 a 24/10 18:06 **não houve disparo registrado** (os despertadores desligados).
- **A fila real está vazia? Não.** A caixa está vazia (só o 900), mas a lista própria tem 4 rodadas escritas. **Nenhuma delas é do beta.**

## 4 · Riscos do lançamento

- **Com usuário de verdade, nada do Lab quebra** — ele não roda para o cliente.
- **Item de segurança reprovado: nenhum.** O Lab não tem conta de usuário nem dado de pessoa; a revisão é `docs/SEGURANCA.md`.
- **Risco real é de RITMO, não de produto:** com despertador de hora em hora, uma rodada que demora mais de uma hora (o verde completo leva ~63 min) faz a sessão seguinte nascer sem ver a anterior e pegar o mesmo trabalho — foram 12 colisões em quatro dias.
- **1º/11/2026:** a trava do gatilho do CI passa a reprovar de propósito; se ninguém decidir, o Lab amanhece vermelho e toda rodada passa a ser "conserto do verde".
- **O que só se descobre publicado:** o comportamento do motor externo **dentro** do Generate, com a tela dele. Nada disso foi medido, porque a porta não foi instalada.

## 5 · Recomendação de ritmo

**Dormir até o Generate abrir a integração dos motores externos** (depois do beta, ou quando o Jonny quiser ver o Lab dentro da tela). Para o beta esta casa precisa de **zero rodadas por dia**. Se a direção quiser aproveitar o plano, **no máximo uma rodada por dia, com intervalo maior que a duração do verde** (nunca de hora em hora, pelo risco da seção 4).

Os próximos cinco, nesta ordem:

1. Um verde completo sobre o ramo do LAB-224 e a mescla na `main` (1 rodada).
2. A decisão do 1º/11 sobre o gatilho do CI — do Jonny; eu executo os dois passos se ele disser sim (1 rodada).
3. Quando o Generate disser que abre a porta: adaptar e medir a peça `registro-de-motores` lá dentro (2 a 3 rodadas).
4. Reescrever a 5-B com desenho e devolver as 7, 10 e 11 **dentro da tela do Generate** (1 rodada).
5. Só então, se ainda fizer sentido, a dívida própria (LAB-61, 63, 66).

## 6 · O que a direção esqueceu de perguntar

- **Se o Lab deve continuar trabalhando a dívida própria antes do beta.** As últimas ~50 rodadas desta casa foram conferência de provas antigas (refazer sabotagens, perguntar quem gravou cada número). É trabalho honesto, mas **não aproxima o beta em nada** — e gasta plano.
- **A duração da rodada contra o intervalo do despertador.** A conta das colisões existe (`docs/ONDE_PARAMOS.md`) e mostra o defeito; nenhuma pergunta mediu isso.
- **O `.wasm` do Symbios:** sem compilar nas máquinas da nuvem, um dos dois motores externos não é conferido de verdade. Vale perguntar se o Symbios ainda é motor candidato, ou se o Lab passa a ser só a casa do motor do Laboratório de Parcelamento.
- **O dia 1º/11** (seção 2-B): a única coisa com data marcada nesta casa.
