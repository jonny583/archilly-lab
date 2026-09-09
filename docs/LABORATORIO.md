<!--
  Especificação do laboratório, gravada tal como recebida no prompt LAB-00.
  Única alteração: a numeração das seções foi tornada sequencial (o original
  repetia 24-28 e trazia a seção 23 fora de ordem no fim). Nenhum texto,
  título ou trecho de conteúdo foi alterado, removido ou reordenado.
-->

" é a especificação completa do laboratório. Grave-o em docs/LABORATORIO.md tal como está (corrija apenas a numeração duplicada de seções, sem mudar conteúdo). Ele descreve Etapas A a G. ESTE PROMPT EXECUTA SOMENTE A ETAPA A (investigação) MAIS UMA PROVA MÍNIMA DE EXECUÇÃO. Adapter, integração e comparação ficam para prompts futuros, só se a investigação disser que vale.

O Generate é um aplicativo de navegador (TypeScript). Um motor em Rust pode ser compilado para WebAssembly e rodar no navegador, ou rodar como serviço em servidor. Um motor em C++ com dependências nativas só como serviço. Para cada candidato viável, registre qual caminho é realista e o que ele custa.

CANDIDATOS — O QUE JÁ SE SABE E O QUE FALTA CONFIRMAR

1. Symbios Tensor — https://github.com/TheJanusStream/symbios-tensor — PRIORIDADE MÁXIMA.
   Sabido: biblioteca Rust (crate publicado em crates.io/lib.rs), licença MIT, commit mais recente em setembro de 2026, autor único, parte de um ecossistema de geração procedural para jogos (Bevy). Pipeline documentado: gera rede viária por campo tensorial sobre um mapa de alturas (vias principais seguem curvas de nível, secundárias descem o gradiente; em terreno plano vira grade ortogonal), racionaliza a geometria (traça artérias contínuas, simplifica, substitui quinas por arcos, suaviza perfis e limita rampa máxima), gera lotes e malhas 3D. Dependências leves (glam, rand, serde) — candidato natural a WebAssembly.
   Limitação já visível: a entrada é um HeightMap em grade regular, não um polígono de terreno. Ele não conhece limite de gleba, APP, faixa não edificável nem legislação. Isso é papel do adaptador (converter terreno em mapa de alturas e recortar o resultado pelo limite) e do Validator. Registre se o pipeline tem etapas separáveis (rede viária / racionalização / lotes) chamáveis isoladamente — é a pergunta que decide se vale usar só a rede viária.
   Falta confirmar: compila com Rust estável? qual versão? há exemplo executável? qual o formato exato de saída (grafo, polígonos, coordenadas)? é determinístico com seed? quanto tempo leva num heightmap 128x128 e num 512x512? compila para wasm32 sem alteração?

2. Straight skeleton (esqueleto reto) — PRIORIDADE ALTA como técnica, não como repositório.
   O nome "grassfire4j" não corresponde a um projeto existente; a linhagem real é o grassfire (Python, MIT, bmmeijers) e sua reescrita grassfire2. Para uso em navegador, avalie estas duas implementações: StrandedKitty/straight-skeleton (TypeScript, MIT no invólucro, mas envolve a CGAL via WebAssembly — verifique a licença do pacote de straight skeleton da CGAL, que pode ser GPL, e diga se isso inviabiliza uso comercial) e o crate Rust straight-skeleton (lizelive), com polígonos com furos e offsets. Uso previsto no Generate: subdivisão de quadras em lotes e offsets consistentes. Prova mínima: rodar o esqueleto num retângulo e num polígono em L e registrar a saída. Diga se a implementação própria em TypeScript é preferível (o algoritmo é conhecido na literatura: Felkel & Obdržálek 1998; Aichholzer et al.).

3. PackingSolver — https://github.com/fontanf/packingsolver — PRIORIDADE MÉDIA, otimização.
   Sabido: C++, MIT, ativo (atualizado em novembro de 2025), 252 estrelas, resolve empacotamento retangular, guilhotina, irregular e 3D; depende de CLP/LAPACK; roda só em servidor. O modo "guilhotina retangular" (cortes de lado a lado dentro de um retângulo) é o mais próximo de subdividir uma quadra em lotes. Limitação: não modela testada mínima, esquina, acesso à via, nem lote irregular. Investigue só o suficiente para dizer se uma formulação "quadra retangular → lotes com área e largura mínimas" é expressável nele e o que faltaria. Sem prova de execução neste prompt.

4. Referência de algoritmo apenas (não integráveis a um app de navegador): ProceduralCityGeneration (Grzybojad) e RoadNetworkTool dependem do Unreal Engine; Terasology Cities é módulo de um jogo em Java; Complete Street Rule exige CityEngine (pago). Para cada um, uma linha: link, licença, o que inviabiliza, e qual técnica vale conhecer (ex.: Voronoi para redes orgânicas; splines para vias curvas).

TAREFAS

1. Estrutura. Crie a árvore mínima do laboratório conforme a especificação: external-engines/<motor>/{upstream, archilly, adapter, tests}, docs/, README.md com a regra de ouro (upstream intocado; trabalho na cópia archilly; o Generate nunca depende disto). A pasta adapter/ nasce vazia com um README "fase futura".

2. Symbios Tensor — Etapa A completa. Leia README, Cargo.toml, exemplos e testes. Registre licença (arquivo LICENSE), crates e workspace, binários, entradas e saídas com exemplo real, versão do Rust exigida, dependências, atividade (commits, issues, releases), limitações. Clone em external-engines/symbios/upstream/ registrando commit exato e data.

3. Symbios Tensor — prova mínima. Compile e rode o menor exemplo que o repositório oferecer, sem entrada do Archilly. Registre comandos, versão do Rust, tempo, e o que saiu (formato, tamanho, trecho). Tente também compilar para wasm32-unknown-unknown; registre o resultado. Se algo não compilar, registre o erro e até onde foi; no máximo duas tentativas de correção. Responda objetivamente: as etapas do pipeline são chamáveis isoladamente?

4. Straight skeleton — Etapa A e prova mínima nas duas implementações citadas (licença de verdade, atividade, entrada/saída, execução num retângulo e num L). Recomendação fundamentada: usar qual, ou reimplementar.

5. PackingSolver — triagem: licença, formulação candidata, o que falta, caminho de execução (servidor), veredito.

6. Referências — tabela do item 4.

7. Entregáveis. docs/SYMBIOS_ANALYSIS.md, docs/STRAIGHT_SKELETON_ANALYSIS.md, docs/PACKINGSOLVER_TRIAGEM.md (cada um com: arquitetura encontrada, licença, dependências, comandos, formatos, limitações, viabilidade WASM/servidor, proposta de Adapter em uma página, sem código). docs/TRIAGEM.md com a tabela da seção "método de comparação" da especificação preenchida na coluna "avaliação preliminar", e um veredito por candidato: SEGUIR PARA ETAPA B/C, REFERÊNCIA APENAS, ou DESCARTAR — com a evidência (links, datas, commits, saídas). docs/ONDE_PARAMOS.md com o estado e a frase "leia docs/ONDE_PARAMOS.md e me diga onde estamos".

8. Encerramento. Commit "LAB-00: investigação de motores externos", Pull Request, merge na main.

O QUE NÃO FAZER

- Não escrever Adapter, não converter dados do Archilly, não tocar no repositório do Generate.
- Não copiar código de motor para fora da pasta upstream/ nem modificar a upstream.
- "Não consegui compilar" é resultado válido e útil; registre-o em vez de contornar.
- Não otimizar nada.

===== LABORATÓRIO =====

# ARCHILLY --- LABORATÓRIO SYMBIOS TENSOR + ADAPTER

**Documento operacional para Claude Code / Cursor**\
**Versão:** 0.1\
**Data:** 08/09/2026\
**Status:** Especificação para investigação e prova de conceito

------------------------------------------------------------------------

## 1. OBJETIVO

Investigar, executar e testar o **Symbios Tensor** como motor externo do
Archilly.

O objetivo inicial **não é incorporar o Symbios ao código principal** e
**não é construir imediatamente uma integração definitiva**.

Primeiro precisamos provar, em ambiente isolado, que:

1.  o Symbios pode ser baixado, compilado e executado;
2.  conseguimos fornecer a ele dados provenientes do Archilly;
3.  conseguimos capturar sua saída;
4.  conseguimos converter essa saída para o formato geométrico interno
    do Archilly;
5.  o resultado pode passar pelo Archilly Validator;
6.  conseguimos comparar objetivamente o resultado com os motores
    atuais;
7.  a integração pode ser mantida com baixo acoplamento.

------------------------------------------------------------------------

## 2. REGRA FUNDAMENTAL

### NÃO ALTERAR O NÚCLEO DO ARCHILLY NESTA FASE.

O Symbios deve funcionar como um motor externo.

Arquitetura desejada:

``` text
ARCHILLY
   |
   | dados padronizados
   v
SYMBIOS ADAPTER
   |
   | formato exigido pelo Symbios
   v
SYMBIOS TENSOR
   |
   | resultado
   v
SYMBIOS ADAPTER
   |
   | formato padrão Archilly
   v
ARCHILLY
   |
   v
VALIDATOR
   |
   v
JUDGE
```

O Adapter é uma ponte.

O Symbios não deve conhecer as regras internas do Archilly.

O Archilly não deve depender da implementação interna do Symbios.

------------------------------------------------------------------------

## 3. REPOSITÓRIO DE REFERÊNCIA

**Regra de armazenamento:** após a validação inicial, a versão upstream será preservada intocada no GitHub do Archilly e uma segunda versão de trabalho será criada separadamente para modificações e integração.

Repositório:

`https://github.com/TheJanusStream/symbios-tensor`

Antes de escrever qualquer código de integração:

-   ler README;
-   ler `Cargo.toml`;
-   identificar crates/workspaces;
-   identificar binários;
-   identificar exemplos;
-   identificar formatos de entrada;
-   identificar formatos de saída;
-   identificar comandos de execução;
-   identificar versão do Rust necessária;
-   identificar dependências;
-   identificar licença;
-   identificar limitações conhecidas;
-   identificar se o pipeline pode ser executado por linha de comando;
-   identificar se pode ser chamado como biblioteca;
-   identificar se existe uma forma determinística/reproduzível de
    execução.

**Não presumir que existe uma API HTTP pronta.**

Se não existir, o Adapter deverá criar a interface necessária.

------------------------------------------------------------------------

## 4. O QUE O SYMBIOS DEVE SER PARA O ARCHILLY

O Symbios deve ser tratado como um **motor algorítmico externo**.

Possíveis usos:

### Uso A --- pipeline completo

``` text
terreno
→ vias
→ quadras
→ lotes
```

### Uso B --- somente rede viária

``` text
terreno
→ eixos / vias
→ Archilly continua a partir daí
```

### Uso C --- somente quadras

``` text
rede viária
→ quadras
→ Archilly gera os lotes
```

### Uso D --- somente parcelamento

``` text
quadras
→ lotes
```

A primeira investigação deve descobrir se esses níveis podem ser
separados de forma tecnicamente limpa.

**Não assumir antecipadamente qual será a arquitetura final.**

------------------------------------------------------------------------

## 5. PRIMEIRO EXPERIMENTO: RODAR O SYMBIOS FORA DO ARCHILLY

Criar um ambiente de laboratório separado.

Exemplo conceitual:

``` text
/archilly-lab/
    /symbios/
    /adapter/
    /fixtures/
    /outputs/
    /tests/
    README.md
```

O laboratório não deve depender do frontend do Archilly para funcionar.

Precisamos conseguir executar o Symbios isoladamente.

### Resultado esperado

Um comando reproduzível que faça algo equivalente a:

``` text
entrada → Symbios → saída
```

A forma exata do comando deve ser descoberta pelo agente após analisar o
repositório.

------------------------------------------------------------------------

## 6. TERRENO DE TESTE

Usar inicialmente um terreno de referência conhecido pelo Archilly.

Preferencialmente um terreno que contenha:

-   limite claramente definido;
-   topografia;
-   declividade;
-   eventualmente cursos d'água;
-   áreas restritas;
-   dimensões suficientes para gerar várias quadras/lotes.

Não precisamos começar com todos os dados do Archilly Geo.

Primeiro queremos provar o caminho mínimo.

------------------------------------------------------------------------

## 7. CONTRATO DE DADOS DO ARCHILLY

Não criar um formato complexo sem necessidade.

Criar um pequeno contrato intermediário próprio do Archilly.

Conceitualmente:

``` json
{
  "project": {
    "id": "test-001"
  },
  "terrain": {
    "boundary": [],
    "elevation": {}
  },
  "constraints": {
    "water": [],
    "app": [],
    "non_buildable": []
  },
  "parameters": {
    "min_lot_area": 300,
    "min_frontage": 10,
    "road_width": 12
  }
}
```

**IMPORTANTE:**

Esse JSON é apenas conceitual.

O agente deve primeiro analisar o modelo de dados existente do Archilly
e propor a menor estrutura necessária para o Adapter.

Não inventar campos que o Archilly ainda não possui.

------------------------------------------------------------------------

## 8. O QUE O ADAPTER DEVE FAZER

O Adapter terá cinco responsabilidades principais.

### 8.1 INPUT

Receber os dados do Archilly.

### 8.2 TRANSLATION

Converter os dados para aquilo que o Symbios entende.

Exemplo:

``` text
Archilly Terrain
        ↓
Adapter
        ↓
Heightmap / parâmetros do Symbios
```

### 8.3 EXECUTION

Executar o Symbios.

Pode ser:

-   biblioteca;
-   CLI;
-   processo local;
-   container;

conforme o que for mais simples e robusto.

### 8.4 OUTPUT

Capturar o resultado.

### 8.5 TRANSLATION BACK

Converter o resultado para o modelo geométrico do Archilly.

------------------------------------------------------------------------

## 9. REGRA DE ISOLAMENTO

O Adapter deve ser o único ponto que conhece detalhes específicos do
Symbios.

Idealmente:

``` text
Archilly
   |
   | contrato próprio
   v
Adapter
   |
   | contrato Symbios
   v
Symbios
```

Se amanhã trocarmos:

``` text
Symbios
```

por:

``` text
OutroMotor
```

o restante do Archilly não deve precisar ser reescrito.

------------------------------------------------------------------------

## 10. SAÍDA PADRONIZADA DO ARCHILLY

O resultado convertido deve voltar para uma estrutura que o Archilly já
consiga compreender.

Conceitualmente:

``` text
Development
├── Boundary
├── Roads
│   ├── Axes
│   └── RoadAreas
├── Blocks
├── Lots
└── Metrics
```

Cada geometria deve manter:

-   coordenadas;
-   sistema de referência;
-   identificação;
-   tipo;
-   relação com seus elementos;
-   métricas disponíveis.

Não criar um novo padrão geométrico se o Archilly já possuir um.

**Primeiro descobrir o modelo existente.**

------------------------------------------------------------------------

## 11. ARCHILLY VALIDATOR

Depois que o resultado voltar do Symbios, ele deve passar pelo
Validator.

O Symbios não é responsável por garantir sozinho:

-   legislação municipal;
-   legislação brasileira;
-   APP;
-   faixas não edificáveis;
-   testada mínima;
-   área mínima;
-   largura de via;
-   acesso de cada lote;
-   demais invariantes do Archilly.

O fluxo é:

``` text
Symbios gera
      ↓
Adapter converte
      ↓
Archilly Validator verifica
      ↓
válido / inválido
      ↓
Archilly Judge
```

------------------------------------------------------------------------

## 12. ARCHILLY JUDGE

O resultado do Symbios deve ser comparado usando o mesmo mecanismo de
avaliação utilizado para os demais motores.

Não criar um critério especial para favorecer o Symbios.

Comparar, quando aplicável:

-   número de lotes válidos;
-   área média;
-   aproveitamento;
-   área viária;
-   área verde;
-   áreas institucionais;
-   quantidade de violações;
-   acessibilidade;
-   eficiência da rede;
-   comprimento de vias;
-   qualidade geométrica;
-   áreas residuais;
-   qualidade urbanística.

O objetivo é descobrir se o Symbios realmente produz soluções melhores.

------------------------------------------------------------------------

## 13. COMPARAÇÃO COM OS MOTORES EXISTENTES

Usar o mesmo terreno e os mesmos parâmetros.

Comparar:

### Motor 1

**Archilly Geométrico**

### Motor 2

**Archilly Fishbone**

### Motor 3

**Symbios**

Idealmente:

``` text
MESMO TERRENO
MESMAS RESTRIÇÕES
MESMOS PARÂMETROS
        |
        +--- Geométrico
        |
        +--- Fishbone
        |
        +--- Symbios
        |
        v
Validator
        |
        v
Judge
        |
        v
Ranking
```

Isso é fundamental.

Não queremos saber apenas se o Symbios "funciona".

Queremos saber se ele **agrega valor ao Archilly**.

------------------------------------------------------------------------

## 14. HIPÓTESE PRINCIPAL

A hipótese que queremos testar é:

> O Symbios pode gerar redes e layouts mais orgânicos e sensíveis à
> topografia do que o motor geométrico atual, produzindo soluções que o
> Archilly possa validar, comparar e eventualmente melhorar.

Hipóteses secundárias:

1.  O Symbios pode ser melhor em terrenos inclinados.
2.  O Symbios pode produzir redes menos repetitivas.
3.  O pipeline completo pode gerar soluções interessantes de quadras e
    lotes.
4.  Algumas partes do Symbios podem ser mais úteis que o pipeline
    completo.
5.  O Archilly pode combinar um motor externo com seus próprios motores
    internos.

------------------------------------------------------------------------

## 15. TESTES OBRIGATÓRIOS

### TESTE 01 --- EXECUÇÃO

O Symbios compila e executa de forma reproduzível?

### TESTE 02 --- TERRENO

Consegue receber o terreno de referência?

### TESTE 03 --- GERAÇÃO

Produz vias/quadras/lotes?

### TESTE 04 --- CONVERSÃO

O Adapter consegue recuperar as geometrias?

### TESTE 05 --- COORDENADAS

As geometrias retornam na escala e posição corretas?

### TESTE 06 --- VALIDAÇÃO

O resultado pode passar pelo Validator?

### TESTE 07 --- COMPARAÇÃO

O resultado pode ser avaliado pelo Judge?

### TESTE 08 --- REPETIBILIDADE

A mesma entrada produz resultados reproduzíveis quando configurada com a
mesma seed/parâmetros?

### TESTE 09 --- PERFORMANCE

Quanto tempo leva para gerar uma solução?

### TESTE 10 --- VALOR

A solução é melhor, diferente ou complementar aos motores atuais?

------------------------------------------------------------------------

## 16. O QUE NÃO FAZER

Nesta primeira fase:

-   não reescrever o Symbios;
-   não copiar o código para dentro do Archilly;
-   não modificar o motor sem necessidade;
-   não criar uma API HTTP complexa antes de provar a execução;
-   não alterar o Validator para acomodar o Symbios;
-   não criar dezenas de parâmetros novos;
-   não tentar integrar todos os motores simultaneamente;
-   não assumir que o Symbios será necessariamente adotado;
-   não otimizar performance antes de provar funcionamento;
-   não transformar o laboratório em parte do produto.

------------------------------------------------------------------------

## 17. CRITÉRIO DE APROVAÇÃO DO SYMBIOS

O Symbios passa para a próxima etapa somente se:

-   executar de forma confiável;
-   puder ser alimentado pelo Archilly;
-   puder devolver geometria utilizável;
-   respeitar o sistema de coordenadas necessário;
-   puder ser validado pelo Archilly;
-   produzir pelo menos algum tipo de solução que agregue valor;
-   o Adapter puder permanecer isolado;
-   a licença e dependências forem compatíveis com o uso pretendido.

------------------------------------------------------------------------

## 18. POSSÍVEL EVOLUÇÃO

Se o teste for bem-sucedido:

``` text
FASE 1
Symbios isolado
        ↓
FASE 2
Adapter
        ↓
FASE 3
Validator
        ↓
FASE 4
Judge
        ↓
FASE 5
Comparação com Geométrico/Fishbone
        ↓
FASE 6
Gerenciador de múltiplos motores
        ↓
FASE 7
Combinação por níveis
        ↓
FASE 8
IA de refinamento
```

------------------------------------------------------------------------

## 19. ARQUITETURA FUTURA DE MÚLTIPLOS MOTORES

O objetivo final não é ter simplesmente vários programas.

É permitir composição.

Exemplo:

``` text
Terreno
   ↓
Motor A gera eixos
   ↓
Motor B gera quadras
   ↓
Motor C gera lotes
   ↓
PackingSolver otimiza
   ↓
Validator
   ↓
Judge
```

Ou:

``` text
Symbios completo
      ↓
Validator
      ↓
Judge
```

Ou:

``` text
Fishbone
   ↓
Archilly Blocks
   ↓
Archilly Lots
   ↓
PackingSolver
   ↓
Validator
```

Essa possibilidade é uma das principais razões para manter os motores
desacoplados.

------------------------------------------------------------------------

## 20. COMO CLAUDE CODE / CURSOR DEVEM TRABALHAR

O agente deve trabalhar em etapas.

### Etapa A --- INVESTIGAÇÃO

Não escrever integração ainda.

Entregar:

-   estrutura do repositório;
-   como compilar;
-   como executar;
-   entradas;
-   saídas;
-   dependências;
-   licença;
-   limitações;
-   possibilidade de automação;
-   proposta de arquitetura do Adapter.

### Etapa B --- PROVA ISOLADA

Executar o Symbios fora do Archilly com um exemplo mínimo.

### Etapa C --- ADAPTER MÍNIMO

Criar somente o necessário para:

``` text
Archilly input
→ Symbios
→ Archilly output
```

### Etapa D --- TESTE REAL

Rodar em terreno real do Archilly.

### Etapa E --- VALIDAÇÃO

Passar pelo Validator.

### Etapa F --- COMPARAÇÃO

Comparar com Geométrico e Fishbone.

### Etapa G --- DECISÃO

Somente depois decidir se vale aprofundar.

------------------------------------------------------------------------

## 21. PRINCÍPIO DE DESENVOLVIMENTO ASSISTIDO POR IA

O objetivo é que a maior parte do trabalho de integração possa ser
executada por Claude Code/Cursor.

Para isso, cada Adapter deve ter:

-   README;
-   comando de instalação;
-   comando de execução;
-   contrato de entrada;
-   contrato de saída;
-   testes;
-   exemplo mínimo;
-   exemplo real;
-   log de erros;
-   documentação das decisões.

Assim, o conhecimento não fica preso a um programador específico.

------------------------------------------------------------------------

## 22. ENTREGÁVEIS DESTA PRIMEIRA MISSÃO

O agente deve produzir, ao final da investigação:

### Documento 1

**SYMBIOS_ANALYSIS.md**

Contendo:

-   arquitetura encontrada;
-   licença;
-   dependências;
-   requisitos;
-   comandos;
-   formatos;
-   limitações;
-   proposta de Adapter.

### Documento 2

**SYMBIOS_ADAPTER_SPEC.md**

Contendo:

-   entrada Archilly;
-   tradução;
-   execução;
-   saída Symbios;
-   tradução de volta;
-   tratamento de erros.

### Código

Somente depois da aprovação da arquitetura:

``` text
/adapter/
```

com o mínimo necessário para executar a prova de conceito.

### Testes

Pelo menos:

``` text
test_minimal
test_coordinates
test_output_conversion
test_validator_compatibility
```

------------------------------------------------------------------------

## 23. POLÍTICA DE PRESERVAÇÃO DO MOTOR EXTERNO

Quando um motor for aprovado para teste, o Archilly deve manter **duas cópias lógicas** no GitHub do próprio projeto.

### 24.1 Cópia ORIGINAL — intocada

Esta é a cópia de referência exata do motor obtida do repositório oficial.

Exemplo:

```text
engines/
└── symbios/
    └── upstream/
        ├── source original
        ├── LICENSE
        └── VERSION / COMMIT
```

Regras:

- não editar o código;
- não aplicar alterações locais;
- registrar o commit/tag exato utilizado;
- preservar a licença e os avisos originais;
- manter documentação sobre a origem;
- esta pasta funciona como **backup técnico e referência de auditoria**.

O objetivo é garantir que sempre saibamos exatamente qual versão original foi utilizada.

### 24.2 Cópia de TRABALHO — modificável

A segunda cópia é a versão que poderá receber adaptações necessárias para o Archilly.

Exemplo:

```text
engines/
└── symbios/
    ├── upstream/
    ├── archilly/
    │   ├── source
    │   ├── patches
    │   └── config
    ├── adapter/
    ├── tests/
    ├── LICENSE
    └── README.md
```

Regras:

- pode receber modificações;
- toda alteração relevante deve ser documentada;
- nunca substituir a cópia `upstream`;
- manter referência ao commit original;
- registrar quais alterações foram feitas pelo Archilly;
- manter as obrigações de licença aplicáveis.

### 24.3 Regra de ouro

```text
UPSTREAM
(original, intocado)
        |
        | referência
        v
ARCHILLY VERSION
(modificável)
        |
        v
ADAPTER
        |
        v
ARCHILLY
```

**Nunca editar a cópia original para fazer uma integração.**

Se uma alteração for necessária, ela acontece na versão de trabalho.

### 24.4 Por que manter as duas

Isso nos dá quatro vantagens:

1. **Preservação** — se o repositório original desaparecer, temos a versão utilizada.
2. **Rastreabilidade** — conseguimos saber o que veio do autor e o que foi alterado pelo Archilly.
3. **Reversibilidade** — podemos voltar ao código original.
4. **Manutenção** — se uma nova versão do motor aparecer, podemos comparar com nossa versão modificada antes de atualizar.

### 24.5 Licenciamento

A existência de uma cópia no GitHub do Archilly não elimina as obrigações da licença.

Para cada motor, o agente deve verificar e registrar:

- licença principal;
- copyright/avisos exigidos;
- dependências relevantes;
- assets/dados que não sejam cobertos pela mesma licença;
- condições específicas de redistribuição;
- eventuais arquivos que não devam ser copiados.

A cópia original e a versão modificada devem manter os avisos de licença necessários.

---

## 24. POLÍTICA DE VERSIONAMENTO

Cada motor deve ser identificado por:

```text
Motor
Versão upstream
Commit/tag upstream
Versão Archilly
Data da incorporação
Status da licença
Status do Adapter
```

Exemplo conceitual:

```text
Engine: Symbios Tensor
Upstream: 0.x.x
Commit: abc123...
Archilly revision: 0.1
License: MIT
Adapter: PoC-01
Status: Experimental
```

Não usar apenas "última versão do GitHub".

O Archilly deve trabalhar com versões **fixadas e reproduzíveis**.

---

## 25. ESTRUTURA RECOMENDADA DO REPOSITÓRIO

A estrutura abaixo é uma referência inicial; o agente deve adaptá-la ao repositório real do Archilly sem reorganizar o projeto desnecessariamente.

```text
archilly/
│
├── core/
├── geo/
├── validator/
├── judge/
│
├── engines/
│   ├── symbios/
│   │   ├── upstream/
│   │   ├── archilly/
│   │   ├── adapter/
│   │   ├── tests/
│   │   ├── LICENSE
│   │   └── README.md
│   │
│   ├── packingsolver/
│   ├── grassfire4j/
│   └── ...
│
└── docs/
```

**Importante:** esta estrutura é uma proposta, não uma ordem para mover ou quebrar o projeto atual. Primeiro inspecionar a estrutura existente do Archilly.

---

## 26. INSTRUÇÃO ADICIONAL PARA CLAUDE CODE / CURSOR

Antes de clonar ou copiar qualquer motor para o repositório do Archilly:

1. verificar a licença;
2. verificar se a licença permite o uso pretendido;
3. verificar dependências;
4. verificar assets/dados;
5. registrar o repositório oficial;
6. registrar commit/tag;
7. criar a cópia `upstream` sem alterações;
8. somente depois criar a área `archilly`/`adapter` para experimentação.

Se houver dúvida de licença, **parar e reportar a dúvida antes de copiar/modificar**.

Não substituir a cópia original por uma versão modificada.

---

## 27. PRINCÍPIO DE REPRODUTIBILIDADE

Um terceiro desenvolvedor, ou uma nova sessão do Claude Code/Cursor, deve conseguir olhar o repositório do Archilly e responder:

> "Qual versão exata deste motor estamos usando, de onde veio, o que modificamos, como executar e como o Adapter conversa com ele?"

Se não for possível responder isso apenas pela documentação e pelos arquivos versionados, a integração ainda não está suficientemente organizada.


## 28. SANDBOX DESCARTÁVEL DE MOTORES EXTERNOS

Os motores externos e seus Adapters **não devem ser misturados ao Core do Archilly durante a fase experimental**.

A integração deve existir dentro de uma área modular e potencialmente descartável do repositório.

Estrutura conceitual:

```text
ARCHILLY/
│
├── core/
│   ├── geo/
│   ├── generate/
│   ├── validator/
│   └── judge/
│
├── external-engines/
│   ├── symbios/
│   │   ├── upstream/
│   │   ├── archilly/
│   │   ├── adapter/
│   │   └── tests/
│   │
│   ├── packingsolver/
│   ├── grassfire4j/
│   └── ...
│
└── docs/
```

### 24.1 Princípio de isolamento

O Core do Archilly não deve depender diretamente da implementação específica de Symbios, PackingSolver ou qualquer outro motor experimental.

O ponto de contato deve ser um **contrato/interface genérico de motor**, quando isso for necessário.

Conceitualmente:

```text
                 ARCHILLY CORE
                      |
              contrato de motor
                      |
                      v
              external-engines/
                /      |      \
               /       |       \
          Symbios   Packing   Outros
             |          |
          Adapter    Adapter
```

O Core conhece o **contrato**.

O Adapter conhece o **motor**.

O motor externo não precisa conhecer o Core.

### 24.2 Objetivo: poder apagar tudo

A área `external-engines/` deve ser concebida como um **sandbox de experimentação**.

Se nenhum motor externo demonstrar valor suficiente, deve ser possível remover toda essa pasta sem quebrar o núcleo do Archilly.

Resultado desejado:

```text
ANTES

Archilly
├── Core
└── external-engines
    ├── Symbios
    ├── PackingSolver
    └── outros


DEPOIS — SE NENHUM MOTOR FUNCIONAR

Archilly
└── Core
```

O Core deve continuar compilando e funcionando.

### 24.3 Regra de dependências

Durante a experimentação:

- Core não deve importar classes/módulos específicos dos motores externos;
- Core não deve depender de bibliotecas necessárias exclusivamente a um motor experimental;
- Adapter não deve espalhar dependências pelo restante do projeto;
- configurações de cada motor devem ficar isoladas;
- scripts de build/executação devem ficar dentro do respectivo motor ou de uma camada claramente externa;
- testes específicos devem ficar junto do motor;
- remover um motor não deve exigir refatoração do Core.

### 24.4 Quando um motor se tornar definitivo

Se um motor provar valor real e for escolhido para produção, **não incorporar automaticamente seu código ao Core**.

Primeiro avaliar:

1. se o Adapter atual é suficiente;
2. se a dependência pode continuar isolada;
3. se há vantagem real em incorporar alguma biblioteca;
4. impacto de manutenção;
5. impacto de licença;
6. impacto de performance;
7. impacto no deploy.

Somente após essa avaliação uma eventual promoção para uma arquitetura mais integrada deve ser considerada.

---

## 29. DUAS CÓPIAS + SANDBOX

Cada motor aprovado para experimentação deve seguir esta estrutura:

```text
external-engines/
└── symbios/
    │
    ├── upstream/
    │   └── versão original, intocada
    │
    ├── archilly/
    │   └── versão de trabalho/modificável
    │
    ├── adapter/
    │   └── ponte Archilly ↔ Symbios
    │
    ├── tests/
    │   └── testes do motor + integração
    │
    └── README.md
```

Isso cria três níveis de proteção:

**UPSTREAM**  
→ preserva o que recebemos do autor.

**ARCHILLY**  
→ permite experimentar alterações.

**ADAPTER**  
→ impede que os detalhes do motor vazem para o Core.

---

## 30. CRITÉRIO DE DESCARTE

Um motor experimental deve poder ser removido simplesmente apagando seu diretório dentro de `external-engines/` e removendo seu registro/configuração no gerenciador externo, sem alterar a lógica fundamental do Core.

Antes de considerar um Adapter "integrado", o agente deve testar:

```text
1. remover/desativar o motor;
2. compilar o Core;
3. executar Geométrico;
4. executar Fishbone;
5. executar Validator;
6. executar Judge;
7. confirmar que o Archilly continua funcionando normalmente.
```

Esse teste comprova que o motor realmente está isolado.

---

## 31. REGRA DE ARQUITETURA DEFINITIVA

Durante a fase de pesquisa:

> **Motores externos são plugins experimentais, não partes do Core.**

O Archilly deve ser capaz de existir sem nenhum deles.

O valor de um motor externo será demonstrado por seu resultado, e não pela quantidade de código que conseguimos incorporar.


## 32. AVALIAR MOTOR COMPLETO OU PARTES DO MOTOR

O Archilly **não deve assumir que um motor externo precisa ser adotado como um pacote completo**.

Cada motor deve ser testado tanto como solução completa quanto como fonte de componentes ou etapas algorítmicas.

### Nível 1 — Motor completo

O motor é capaz de gerar uma solução completa suficientemente boa para funcionar como uma alternativa ao motor atual.

Exemplo:

```text
Symbios
  ↓
vias
  ↓
quadras
  ↓
lotes
  ↓
Validator
  ↓
Judge
```

Se o resultado for bom, o Symbios pode permanecer como um **motor completo adicional**.

### Nível 2 — Pipeline parcial

O motor completo não é melhor que o Archilly, mas uma determinada etapa é superior.

Exemplo:

```text
Symbios
   ↓
REDE VIÁRIA
   ↓
Archilly
   ↓
QUADRAS
   ↓
Archilly
   ↓
LOTES
```

Nesse caso, o Adapter deve permitir utilizar somente a etapa que agrega valor.

### Nível 3 — Componente algorítmico

Uma técnica específica do motor pode ser útil mesmo que o restante do pipeline não seja.

Exemplo:

```text
Symbios Tensor Field
        ↓
gera eixos
        ↓
Archilly continua
```

Outro exemplo poderia ser utilizar uma técnica geométrica do `grassfire4j` dentro de uma etapa de subdivisão, ou utilizar o PackingSolver somente na etapa de otimização.

**Importante:** isso não significa copiar automaticamente código externo para o Core. Primeiro avaliar a possibilidade de integração, licença, dependências e manutenção. A versão `upstream` permanece intocada e qualquer experimentação ocorre na área de trabalho isolada.

### Nível 4 — Inspiração / benchmark

O motor não entra na arquitetura do Archilly, mas seus resultados e algoritmos servem como referência para:

- entender novas estratégias;
- comparar resultados;
- identificar técnicas interessantes;
- orientar desenvolvimento futuro do próprio Archilly.

Nesse caso, não incorporamos código sem uma análise específica de licença e engenharia.

---

## 33. REGRA DE SUCESSO DOS MOTORES EXTERNOS

Um motor externo **não precisa vencer como solução completa para ser considerado um sucesso**.

O teste deve perguntar:

> **“Existe alguma etapa, técnica ou componente deste motor que melhore de forma mensurável o resultado do Archilly?”**

Assim, um motor pode ser aprovado mesmo que:

```text
Motor completo = ruim
```

mas:

```text
Rede viária = excelente
```

ou:

```text
Parcelamento = excelente
```

ou:

```text
Otimização = excelente
```

Nesse caso, somente a parte de valor deve ser aproveitada.

---

## 34. COMPOSIÇÃO DE MOTORES

A arquitetura deve permitir combinar diferentes motores por níveis.

Exemplo:

```text
                 TERRENO
                    ↓
             ARCHILLY GEO
                    ↓
          ┌─────────┴─────────┐
          ↓                   ↓
       Symbios             Fishbone
          ↓                   ↓
      alternativas de rede viária
          ↓
       melhor rede
          ↓
       Archilly Blocks
          ↓
     Archilly / Symbios
       Parcelamento
          ↓
      PackingSolver
          ↓
       otimização
          ↓
     ARCHILLY VALIDATOR
          ↓
       ARCHILLY JUDGE
```

Outro cenário possível:

```text
Symbios → vias
    ↓
Archilly → quadras
    ↓
grassfire4j → subdivisão
    ↓
PackingSolver → otimização
    ↓
Validator
    ↓
Judge
```

Ou simplesmente:

```text
Symbios completo
      ↓
Validator
      ↓
Judge
```

O sistema deve conseguir comparar essas estratégias sem transformar nenhuma delas em dependência obrigatória do Core.

---

## 35. IMPLICAÇÃO PARA O ADAPTER

O Adapter não deve ser pensado somente como:

```text
Archilly → Symbios completo
```

Quando tecnicamente possível, sua arquitetura deve permitir:

```text
Archilly → Symbios / etapa específica → Archilly
```

Por isso, durante a investigação do repositório, o agente deve identificar:

- quais módulos existem;
- quais etapas do pipeline são independentes;
- quais dados entram e saem de cada etapa;
- quais etapas podem ser chamadas isoladamente;
- quais etapas dependem obrigatoriamente de outras;
- quais resultados intermediários podem ser capturados.

**Não implementar separação artificial de módulos se o motor não suportar isso de maneira razoável.**

Primeiro entender a arquitetura real do motor.

---

## 36. MÉTODO DE COMPARAÇÃO

Para cada motor, registrar separadamente:

| Avaliação | Resultado |
|---|---|
| Motor completo | Melhor / igual / pior / inviável |
| Rede viária | Melhor / igual / pior / inviável |
| Quadras | Melhor / igual / pior / inviável |
| Lotes | Melhor / igual / pior / inviável |
| Otimização | Melhor / igual / pior / inviável |
| Geometria auxiliar | Melhor / igual / pior / inviável |
| Performance | Melhor / igual / pior / inviável |
| Integração | Fácil / média / difícil |
| Valor para Archilly | Alto / médio / baixo / nenhum |

A avaliação deve ser baseada em testes, e não apenas em impressão visual.

---

## 37. DECISÃO FINAL POR MOTOR

Depois dos testes, cada motor poderá terminar em uma destas situações:

### A — ADOTADO COMPLETO

O motor inteiro agrega valor.

### B — ADOTADO PARCIALMENTE

Somente determinadas etapas são utilizadas.

### C — COMPONENTE APROVEITADO

Uma técnica específica é integrada por meio de uma solução isolada e compatível com a licença.

### D — BENCHMARK / REFERÊNCIA

Não entra no produto, mas gera conhecimento útil.

### E — DESCARTADO

Não agrega valor suficiente.

Em todos os casos, o Core do Archilly permanece independente.


## 38. REGRA FINAL PARA O AGENTE

**Não implemente o que você ainda não entendeu.**

Primeiro investigue o Symbios real.

Depois explique o que encontrou.

Depois proponha o Adapter.

Depois execute o teste mínimo.

Somente então escreva a integração.

A prioridade é:

**entender → provar → integrar → validar → comparar → decidir.**

Não é:

**codar → torcer para funcionar.**
