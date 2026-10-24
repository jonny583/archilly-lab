# Os ramos abertos — cada um com a pergunta que ele espera

O protocolo da caixa de entrada (`caixa-de-entrada/COMO_FUNCIONA.md`, *"O que vai para ramo em vez
da main"*) manda: **o que eu não tenho certeza não entra na `main`** — vai para um ramo, e o ramo se
chama pela pergunta que ele espera. Esta página é a lista que o protocolo pede: um ramo por linha, e
a pergunta de cada um.

**Tabela vazia quer dizer "nenhum ramo esperando pergunta"**, e isso é conferido, não afirmado: a
trava `external-engines/esteira/tests/ramos-abertos-na-origem.test.ts` lê os ramos da origem a cada
verde e reprova nos dois sentidos — ramo não mesclado sem linha aqui, e linha aqui de ramo que não
existe na origem ou que já entrou na `main` (D349). Ramo que já entrou inteiro na `main` não espera
nada, e não tem linha.

| ramo | a pergunta que ele espera |
|---|---|
| `espera-o-novo-plano-para-mesclar-o-lab-224` | o LAB-224 (as duas sabotagens do LAB-60 refeitas, 24/10) ficou pronto, mas o verde completo foi interrompido pela pergunta de planejamento: entra na `main` quando o novo plano disser que esta casa volta a rodar, depois de um verde completo |

Quando um ramo nascer: uma linha, com o nome entre crases e a pergunta em português de leigo. Quando
ele entrar na `main` ou for abandonado, a linha sai — a história fica no `git log` desta página.
