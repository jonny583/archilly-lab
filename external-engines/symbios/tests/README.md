# tests/

**O que o `git` carrega nesta pasta: só este `README.md`.** Os testes do motor e
do adaptador moram em dois outros lugares, e esta página diz quais.

**Os do próprio motor** estão no upstream, em `../upstream/tests/integration.rs`,
e rodam com `cargo test` a partir de `../upstream/`.

**Os do adaptador** (`../adapter/`, escrito no LAB-01, 10/09/2026) nasceram do
LAB-02 em diante na suíte da esteira, `../../esteira/tests/`, e rodam no verde
(`./external-engines/conferir.sh`). São os arquivos de lá que carregam o `.wasm`
da ponte pela porta do adaptador (`Motor.carregar`) — sem o `.wasm` na máquina,
reprovam na carga:

<!-- os-testes-do-adaptador (LAB-187) -->
- `coluna-vertebral.test.ts`
- `contrato-v2.test.ts`
- `guarda-da-ponte.test.ts`
- `identidade.test.ts`
- `poligono.test.ts`
- `porta.test.ts`
- `recorte.test.ts`
- `relevo.test.ts`
<!-- /os-testes-do-adaptador -->

As medições do LAB-00 vivem em `../archilly/probe/`, que é um executável de
instrumentação, não uma suíte de testes.

**Os quatro nomes da especificação** (`docs/referencia/LABORATORIO.md` §22:
`test_minimal`, `test_coordinates`, `test_output_conversion`,
`test_validator_compatibility`) não existem como nome de teste em lugar nenhum
desta casa. Qual arquivo da lista acima responde a qual deles não está medido, e
esta página não o afirma.

> **Até 19/10/2026 esta página dizia** ~~"Vazio nesta fase. […] Os testes que a
> especificação exige […] pressupõem um Adapter, que só nasce na Etapa C. Serão
> escritos aqui quando houver o que testar."~~ — o texto do LAB-00 (09/09/2026),
> falso desde o LAB-01, que escreveu o adaptador, e o LAB-02, que pôs os testes
> dele na esteira. Quem pergunta esta página agora é
> `external-engines/esteira/src/a-pasta-de-testes-do-symbios.ts` (LAB-187, D415).
