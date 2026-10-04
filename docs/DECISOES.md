# Decisões do Archilly Lab

**O que este arquivo é:** as decisões tomadas dentro do laboratório que alguém,
meses depois, vai querer saber por quê. Uma decisão sem motivo escrito é uma
decisão que será desfeita por engano.

Não entra aqui: o estado da fila (`docs/prompts/FILA.md`), o ponto de parada
(`docs/ONDE_PARAMOS.md`), nem os números das medições
(`docs/relatorios/`, `outputs/`).

---

## D01 · Este arquivo passa a existir · 10/09/2026

O prompt do LAB-01 pediu decisões numeradas "seguindo o padrão dos outros
repositórios da família". O padrão existe no Geo (`docs/DECISOES.md`, com
`D01`, `D02`… e data) e no Generate (um arquivo por decisão em `decisoes/`).

Adotado o do Geo: um arquivo só, decisões numeradas. O Lab é pequeno e as
decisões dele são quase todas de uma sessão — espalhá-las em arquivos separados
faria procurar em quatro lugares o que cabe numa rolagem.

---

## D02 · O contrato de entrada é o `archilly-terreno`, não o `archilly.geo.2` · 10/09/2026

**A decisão:** o adaptador lê **`archilly-terreno` 1.x**. O `archilly.geo.2` foi
investigado e descartado como entrada.

**Por quê.** O prompt nomeia o `archilly.geo.2` como "o contrato próprio" pelo
qual o Geo exporta para o Generate. Lendo os dois no repositório do Geo, eles
não são a mesma coisa e não têm o mesmo destino:

- **`archilly.geo.2`** (`src/lib/geo/contrato.ts`) é o pacote para o **Archilly
  Studio 2D/3D**. Leva o estudo salvo praticamente cru: `terrenos` como blob
  opaco (`unknown`), vistas salvas, camadas visíveis, opacidade, basemap
  escolhido, APPs que o usuário desligou. É estado de aplicativo.
- **`archilly-terreno`** (`src/lib/contratos/archilly-terreno.ts`, hoje na 1.1) é
  o contrato para o **Generate**, e é GeoJSON de verdade: poligonal oficial,
  testadas com papel, APP e restrições **já recortadas ao terreno**, curvas de
  nível com cota e equidistância, zoneamento com lote e testada mínimos, síntese
  com área bruta, líquida e parcelável.

Um motor de loteamento precisa de geometria recortada e cotada, não de estado de
tela. O Generate concorda: a ponte dele
(`src/lib/import/archilly-terreno-import.ts`) lê o `archilly-terreno`, e o
`archilly.geo.2` não aparece ali.

**O que isso custa:** nada hoje. Se um dia o Geo passar a exportar relevo só pelo
pacote do Studio, o leitor do Lab (`src/terreno-geo.ts`) é o único arquivo a
mudar.

---

## D03 · A projeção é a mesma do Generate, reimplementada · 10/09/2026

**A decisão:** plano tangente local equiretangular, centrado no centróide simples
da gleba, com **x para leste e y para o SUL** — exatamente a convenção de
`src/lib/import/geo-projecao.ts` do Generate. As fórmulas foram **reescritas** em
`src/geo.ts`, não importadas.

**Por que a mesma projeção.** Se o Lab escolhesse UTM e o Generate usasse plano
tangente, a geometria que sai daqui cairia deslocada da geometria que ele importa
do mesmo terreno. É o tipo de divergência que passa em todo teste — porque cada
lado está certo sozinho — e aparece no desenho, tarde.

**Por que reimplementar.** O Generate não pode depender do Lab (regra do
laboratório) e o Lab não pode depender do Generate (o Lab é descartável). As
fórmulas de metros por grau do WGS84 são de domínio público e cabem em dez
linhas. A cópia é registrada nos dois lados, com o caminho do original.

**O y para o sul é a parte que se erra.** O Symbios é motor de jogo: X/Z num
sistema Y-up, com Z crescendo para o norte visual. A inversão acontece uma vez
só, na escrita da grade de alturas (`alturas.ts`), e é desfeita uma vez só, na
leitura do resultado. A prova de ida e volta existe para vigiar isso — pior erro
medido: **2 × 10⁻¹⁰ m**, contra a meta de 0,01 m.

---

## D04 · Os estudos de prova do Geo não têm geometria; os terrenos foram construídos a partir dos números deles · 10/09/2026

**A decisão:** os terrenos `pequeno` e `completo` em `docs/terrenos/` usam os
**números reais** dos estudos de prova do Geo e **geometria construída** para
casar com eles. Cada arquivo diz isso no próprio bloco `archilly.procedencia`.

**Por quê.** O prompt manda "exportar os estudos de prova no contrato
`archilly.geo.2` (ou montar a partir deles)". Abrindo
`src/lib/geo/relatorio/__tests__/estudos-de-prova.ts`, eles são entradas de
**dossiê e prancha**: `SinteseTerreno` com área, perímetro, contagem de vértices,
restrições e relevo resumido — mas `vertices: []`, testadas com coordenadas de
exemplo (`[-48.71, -25.41]` para todas) e o mapa substituído por um PNG de 1×1.
O comentário no topo do arquivo é explícito: eles existem para comparar
~40 pontos de formatação, linha a linha. Provam a **formatação** dos entregáveis
pagos, não a geometria.

Exportar o que não existe não é possível. As alternativas eram inventar terreno e
chamá-lo de real, ou construir geometria que respeite os números publicados e
dizer exatamente o que veio de onde. A segunda.

**O que veio dos estudos, verificável:** área bruta (450 m² e 1 417 577,87 m²),
contagem de vértices (4 e 20), zona UTM, município/UF, matrícula 10123, SIGEF
7020130007283, área de documento 1 417 609 m², cotas 4,2 a 118,75 m,
equidistância de 5 m, zonas ZR-3 e ZR-2, e as três restrições com as áreas
exatas (APP hídrica 51 230,4 m², reserva legal do CAR 283 515,6 m², APP de
encosta 8 904,15 m²).

**O que é construção do Lab, e está dito:** a poligonal, as curvas de nível, a
posição das restrições, e — no `pequeno` — uma rampa de 1,5 %, porque o estudo
declara relevo nulo e terreno plano perfeito degenera o campo tensorial.

**O perímetro não bate, de propósito:** o estudo `completo` declara 5 842,4 m; a
poligonal construída dá o que a geometria dá, e é esse valor que vai no arquivo.
Escrever o perímetro declarado ao lado de uma geometria que tem outro seria
plantar a divergência que o próprio contrato manda tratar como aviso.

---

## D05 · O `.wasm` não usa `wasm-bindgen`, e o `getrandom` recusa entropia · 10/09/2026

**A decisão:** o módulo é carregado com `WebAssembly.instantiate(bytes, {})` —
**sem import nenhum**. O `getrandom` é compilado com o backend `custom`
(`--cfg getrandom_backend="custom"`), e a implementação **devolve erro**.

**Por quê.** O LAB-00 provou a compilação para `wasm32-unknown-unknown` com a
feature `wasm_js` do `getrandom`. Ela funciona, mas arrasta o `wasm-bindgen`, e
com ele um import `__wbindgen_placeholder__` que o módulo passa a exigir do
ambiente. Medido aqui, ao tentar carregar:

```text
TypeError: WebAssembly.instantiate(): Import #0 module="__wbindgen_placeholder__":
module is not an object or function
```

Um módulo com import de glue precisa do glue junto, versionado com ele, e some a
possibilidade de carregá-lo em qualquer runtime com uma linha. Com o backend
`custom`, o `.wasm` sai com **zero imports** e roda em Node, em navegador e em
Web Worker sem adaptação — que é o formato de "peça pronta" que a fila prevê para
a entrega ao Generate.

**Por que recusar entropia em vez de fornecê-la.** Todo o caminho do Symbios usa
`rand_pcg` semeado pela seed que o adaptador passa; entropia do sistema não é
usada. Preencher com bytes pseudo-aleatórios "por segurança" faria uma chamada a
`OsRng` — se algum dia aparecer no caminho — passar despercebida e introduzir
não-determinismo, que é exatamente o que o LAB-01 tem de garantir que não existe.
Devolver `Error::UNSUPPORTED` faz essa hipótese falhar alto.

---

## D06 · Um estágio por chamada, com sessão do lado Rust · 10/09/2026

**A decisão:** `archilly_gerar_vias`, `archilly_racionalizar` e
`archilly_extrair_quadras` são chamadas separadas sobre uma sessão que guarda o
grafo dentro do módulo.

**Por quê.** `std::time::Instant` não funciona em `wasm32-unknown-unknown` — não
há relógio. Como o LAB-01 exige o tempo de **cada** estágio, quem crona tem de ser
o JavaScript, e para isso cada estágio precisa ser uma travessia separada da
fronteira.

O efeito colateral é o que interessa a longo prazo: a separabilidade que o LAB-00
provou em Rust passa a ser utilizável de fora. Quem quiser só a rede viária
(Uso B) para nas duas primeiras chamadas; quem quiser quadras (Uso C) segue.
`archilly_quadras_de_grafo_externo` fecha o caso: o Archilly entrega os eixos e o
Symbios devolve as faces, sem o traçador. Medido: grade 3×3 de eixos com 120 m de
vão → **4 quadras de 14 400 m² cada**, exatas.

---

## D07 · Tudo atravessa a fronteira como bytes, não como `f32` · 10/09/2026

**A decisão:** `archilly_abrir` e `archilly_quadras_de_grafo_externo` recebem
ponteiro para **bytes** e comprimento **em bytes**, e desempacotam com
`f32::from_le_bytes`.

**Por quê.** Duas razões, e a primeira foi um defeito real. A primeira versão
passava o comprimento em bytes de um lado e esperava contagem de elementos do
outro; o módulo recusava toda sessão, com uma mensagem que não dizia isso.
Contrato em bytes nos dois lados elimina a ambiguidade de unidade.

A segunda: `archilly_alloc` devolve um bloco de `Vec<u8>`, alinhado a 1. Ler isso
como `*const f32` é comportamento indefinido que funciona por acidente na maioria
dos alocadores. `from_le_bytes` custa nada e não depende de sorte.

---

## D08 · O relevo é interpolado entre NÍVEIS, não entre vértices vizinhos · 10/09/2026

**A decisão:** `alturas.ts` interpola linearmente entre as duas **cotas** mais
próximas, não por inverso da distância sobre os k vértices mais próximos.

**Por quê.** A primeira versão usava k-vizinhos — o mesmo método do
`criarModeloRelevo` do Generate (`src/lib/engine/topografia.ts`), escolhido
justamente para os dois lados medirem a mesma coisa. Estava errada, e de um jeito
que não aparece olhando o desenho.

Os vértices ao longo de uma curva de nível são muito mais próximos entre si do
que a distância entre duas curvas. Para quase toda célula, os seis vizinhos mais
próximos estão **todos na mesma curva**, e a média deles é exatamente a cota
daquela curva. O terreno interpolado vira um bolo de casamento: terraços planos
com degraus entre eles. Medido no terreno de 50 ha, curvas de 2 m:

| | k-vizinhos (antes) | entre níveis (depois) |
|---|---|---|
| células a menos de 2 cm de um valor de curva | **85,0 %** | 0,2 % |
| células com gradiente exatamente zero | **73,3 %** | 0,0 % |
| declividade mediana da grade | 0,00 % | 6,28 % |

Um campo tensorial lido de uma grade assim não segue a topografia: segue a borda
dos degraus que a interpolação inventou. **Toda a premissa do motor — principais
na curva de nível, locais no gradiente — dependia de um relevo que não existia.**

O método correto para curvas de nível interpola entre cotas distintas:
`z = (z1·d2 + z2·d1) / (d1 + d2)`. Sobre uma curva devolve a cota dela, exata;
entre duas, varia linearmente.

**O que custou:** o estágio de alturas passou de 258 ms para 724 ms no terreno de
50 ha. Vale cada milissegundo — e continua sendo o estágio a otimizar, se algum
dia precisar (ver o relatório, seção de performance).

**Nota para o Generate:** se o `criarModeloRelevo` de lá for alimentado com
vértices de curva de nível, ele tem o mesmo problema. Não foi verificado se é o
caso — o Lab não mexe no Generate —, mas fica registrado.

---

## D09 · A conferência de rampa tem tolerância de meio ponto percentual · 10/09/2026

**A decisão:** `trechosAcimaDaRampa` conta trechos acima do pedido **mais 0,5
ponto percentual**. `rampaMaximaObtida_pct` sai ao lado, sem tolerância nenhuma.

**Por quê.** O clamp do motor pousa os trechos **exatamente sobre** o limite —
é o comportamento correto de um limitador de rampa, que transforma barranco em
rampa longa no máximo permitido. Aí metade dos trechos cai alguns centésimos
acima por aritmética de `f32`: numa cadeia, a pior rampa medida foi **10,04 %**
contra 10 % pedidos.

Contar isso como violação afogaria em ruído as violações de verdade, que são de
outra ordem — 49 %, 69 %, 365 % — e estão todas em outro lugar (ver D10). Meio
ponto percentual separa as duas populações sem esconder nada: o máximo bruto sai
sempre, no mesmo diagnóstico.

---

## D10 · O clamp de rampa do motor não cobre cruzamento; conferir rampa é do Validator · 10/09/2026

**A decisão:** o adaptador **não corrige** a rampa nos cruzamentos. Ele mede,
avisa, e passa adiante. A conferência é do Validator, no LAB-02.

**A evidência.** `ferramentas/diagnostico-rampa.ts` mede a rampa aresta por
aresta na saída crua do motor, separando por grau do nó. Terreno de 50 ha, rampa
pedida de 10 %, com racionalização ativa:

| grau do nó | arestas | acima do pedido | rampa máxima |
|---|---|---|---|
| 1 (ponta) | 4 | 0 | 10,00 % |
| **2 (ao longo da cadeia)** | 2 804 | **0** | **10,04 %** |
| 3 (cruzamento em T) | 194 | 7 | **69,93 %** |
| ≥ 4 (cruzamento) | 354 | 38 | 49,70 % |

**Ao longo de uma cadeia o clamp fecha, sem exceção.** Todas as violações estão
em nó de grau 3 ou mais.

Três hipóteses foram testadas e duas caíram. Não é o encadeamento do adaptador
inventando vizinhança — a medição é sobre arestas cruas do motor. Não é relevo
extrapolado fora da gleba — dentro da gleba o padrão é o mesmo. E **não é falta
de convergência**: 10 passes contra 1 000, tolerância `1e-2` contra `0`, dão
resultado idêntico (1 104 contra 1 103 arestas acima). O limite é estrutural.

A leitura é que o clamp opera por cadeia, e um nó compartilhado por várias
cadeias não pode ser movido sem quebrar as outras.

**Por que não corrigir aqui.** Corrigir cota de cruzamento é redesenhar o perfil
da via — decisão de projeto, não de tradução. O Adapter é ponte; se ele começar a
consertar geometria, o Judge do LAB-03 vai comparar o conserto do Adapter com o
motor Geométrico, não o Symbios. Fica registrado como recomendação para o LAB-02:
**a checagem de rampa do Validator tem de olhar o cruzamento**, e é ali que ela
vai reprovar.

---

## D11 · Nada é recortado pela gleba nem pelas restrições · 10/09/2026

**A decisão:** o adaptador devolve a geometria inteira, mede quanto caiu fora da
gleba, e não recorta. As restrições (APP, reserva legal, faixa de domínio) viajam
como **carga**: chegam, são contadas, saem no diagnóstico e no GeoJSON, e não
filtram nada.

**Por quê.** É o que o prompt manda ("o recorte por elas é LAB-02"), e a razão é
boa: recortar aqui misturaria duas perguntas — "o motor devolve geometria
utilizável?" e "o recorte funciona?" — numa medição só. Quando o LAB-02 acusar
geometria faltando, é preciso poder dizer se ela nunca foi gerada ou se o recorte
a comeu.

**O que se mede no lugar:** fração da grade fora da gleba (43 % a 48 % nos
terrenos reais), fração do **comprimento** de via fora (38 %) e fração da **área**
de quadra fora (23 % a 42 %). O GeoJSON de saída carrega a gleba e as restrições
junto, e um aviso escrito dentro do arquivo dizendo que o recorte não foi feito.

---

## D12 · Fora da gleba, o relevo é extrapolado — não rebaixado nem vazio · 10/09/2026

**A decisão:** a grade de alturas cobre a caixa envolvente da gleba mais uma
folga, e as células fora do polígono recebem relevo **extrapolado** pela mesma
interpolação. Uma máscara registra quais são.

**Por quê.** Três caminhos foram considerados:

1. **rebaixar para um valor sentinela** — cria um penhasco artificial exatamente
   sobre a divisa da gleba. Penhasco é o que o campo tensorial mais segue: as
   vias passariam a acompanhar o contorno da gleba por artefato numérico, e o
   resultado pareceria ótimo pelo motivo errado;
2. **deixar vazio** — o motor não tem conceito de célula sem dado, e `NaN`
   propaga para a normal, matando o traçado;
3. **extrapolar** — inventa relevo fora da gleba.

O 3 inventa, e inventar ali é inofensivo: aquela geometria vai ser descartada no
LAB-02. Os outros dois corrompem o que fica.

**A folga existe pelo mesmo motivo.** Sem margem em volta, todo traço morreria na
beirada do mundo e a rede chegaria truncada justamente na divisa — que é onde ela
precisa estar bem resolvida.

---

## D13 · Os defaults do upstream não aparecem na interface do adaptador · 10/09/2026

**A decisão:** os parâmetros são de urbanismo — espaçamento em metros, rampa em
porcento, caixa da via em metros. Os padrões são **200 m / 80 m / 10 % / 8,4 m**.
Os nomes do Symbios existem num arquivo só, `src/parametros.ts`.

**Por quê.** Os defaults do upstream põem uma via a cada 15 m; o LAB-00 mediu que
isso produz "quadras" de 97 m² medianos, que é tamanho de lote. São defaults de
cidade de jogo. Vazá-los para quem chama o adaptador seria entregar um motor que
só funciona para quem já sabe que precisa mudá-los.

Os números escolhidos não são invenção do Lab:

- **200 × 80 m** vêm da medição do LAB-00 — deram quadras de 3 439 m² medianos e
  rodaram 37× mais rápido que os defaults;
- **10 %** é o `LIMITES_TOPOGRAFIA.rampaMaxPct` do Generate. O adaptador não
  inventa limite próprio quando o produto já tem um;
- **8,4 m** é o `NORMA_BR.via.caixaMinima` do Generate (6 m de pista + 2 × 1,2 m).

O que o urbanista **não** deve ter de conhecer é derivado do espaçamento, não
fixado: passo de integração, raio de snap, filetes e tolerância de simplificação
escalam todos com o tamanho da quadra. Fixá-los faria o adaptador funcionar numa
escala e falhar nas outras.

---

## D14 · O adaptador é TypeScript sem dependência nenhuma · 10/09/2026

**A decisão:** zero pacotes npm. TypeScript rodado com
`node --experimental-strip-types`, e um SHA-256 escrito à mão em `src/hash.ts`.

**Por quê.** O adaptador tem de rodar igual no Node e no navegador — é o que o
LAB-05 vai cobrar. `node:crypto` só existe no Node; `crypto.subtle` do navegador
só tem API assíncrona, e tornar o hash assíncrono contaminaria a assinatura de
`gerarRedeViaria` por causa de um detalhe de diagnóstico. Quarenta linhas de FIPS
180-4 resolvem, custam alguns milissegundos contra centenas dos estágios do
motor, e mantêm um só caminho de código nos dois ambientes.

Zero dependências também significa que o Lab inteiro pode ser apagado sem
desinstalar nada, que é o critério de descarte da especificação.

**O que isso proíbe:** `enum`, `namespace` e propriedade de parâmetro em
construtor — o modo de remoção de tipos do Node não os suporta. Duas classes
tiveram de ser reescritas com campos explícitos.

---

## D15 · A prova no navegador é do `.wasm`, não do adaptador · 10/09/2026

**A decisão:** `ferramentas/navegador/` carrega o `.wasm` com JavaScript puro e
não importa o adaptador.

**Por quê.** O prompt diz que a prova no navegador não é obrigatória, "mas se for
barato". Ela é barata exatamente na parte que interessa: o que está em dúvida
para o LAB-05 é se o módulo **carrega e executa** num navegador de verdade, e
isso se responde sem o invólucro TypeScript. Trazer o adaptador inteiro exigiria
um empacotador — a complexidade que o LAB-01 não precisa assumir.

Medido no Chromium: `.wasm` instanciado em 19,7 ms, pipeline completo num mundo
de 1 024 × 1 024 m em **151 ms**, 275 quadras. Captura em
`outputs/lab01/navegador.png`.

---

## D16 · O motor do Testfit não é copiado para dentro do Lab · 13/09/2026

**A decisão:** `external-engines/testfit/` **não tem `upstream/`**. Só existe o
`adapter/`. O motor é lido de fora, por caminho, do clone irmão.

**Por quê.** A regra de ouro (`upstream/` intocado, congelado num commit,
verificado com `cmp`) foi escrita para motor de terceiro — código que se copia
porque o autor não nos deve nada e a versão pode sumir. O Testfit é da própria
família: tem repositório, tem fila de prompts, tem dono, e vai mudar por causa
deste relatório. Uma cópia congelada dentro do Lab começaria a envelhecer no dia
seguinte e ninguém repararia — que é exatamente o problema que o `VERSION` do
Symbios existe para impedir.

**O preço:** o Lab passa a depender de dois clones ao lado. Para que esse preço
fique em um lugar só, a **única** menção a caminho de repositório irmão está no
`tsconfig.json`, em `paths`. Nenhum arquivo de código escreve `../../motor-...`.

---

## D17 · Bun como runtime, e um `tsconfig` menos estrito do que eu queria · 13/09/2026

**A decisão:** a esteira roda em **Bun**, e o `tsconfig.json` do adaptador **não
liga** `noUncheckedIndexedAccess` nem `exactOptionalPropertyTypes`.

**Por quê o Bun.** O programa compila fonte TypeScript de três repositórios ao
mesmo tempo, e os arquivos do Generate usam import relativo sem extensão
(`from "./topografia"`). O `--experimental-strip-types` do Node — que é o que o
adaptador do Symbios usa (D14) — não resolve isso. O Bun resolve, sem
empacotador e sem etapa de build. Trocar de runtime entre dois adaptadores do
mesmo repositório é feio; montar um empacotador para o LAB-07 seria pior.

**Por que menos estrito.** Com as duas opções ligadas, o `tsc` acusa cerca de
vinte erros **dentro do repositório do Generate**, que o Lab não pode consertar
(só leitura). Um typecheck que acusa erro alheio e não tem como consertá-lo é um
typecheck que se aprende a ignorar — e aí ele deixa de pegar os erros que são
nossos. A omissão está justificada em comentário, na linha do arquivo.

---

## D18 · `largura_m` da via é a caixa, e não a caixa mais as calçadas · 13/09/2026

**A decisão:** na volta, `Via.largura_m = plano.vias[i].caixa_m`. O `calcada_m`
que o motor declara **não** é somado.

**Por quê.** Não é interpretação, é medição. A distância do vértice mais próximo
de cada lote ao eixo mais próximo tem mediana **exatamente `caixa_m / 2`** (5,00 m
para vias de 10 m, 223 dos 441 lotes no valor exato): **o lote encosta no
meio-fio**. A calçada é declarada e não é reservada em geometria nenhuma.

A primeira versão somou, como a ajuda do motor sugeria, e o Validator devolveu o
retrato do erro: **441 de 441 lotes sem frente e 429 com leito de rua por cima**,
porque o leito declarado invadia 3 m dentro de cada lote. Com a caixa real:
**15 violações** na mesma variante.

**A lição, que vale para o próximo adaptador:** um adaptador declara a geometria
que existe, não a que o motor promete. Quando os dois discordam, mede-se.

---

## D19 · O aparo corta só eixo de via, vem desligado, e as duas passagens são publicadas · 13/09/2026

**A decisão:** `apararVias()` recorta o eixo das vias pelo perímetro da gleba.
Lote, quadra e área especial saem **intactos**. O aparo é opcional e vem
desligado; toda medição sai nas duas versões, `fiel` e `julgado`.

**Por quê cortar.** Sem isso o LAB-07 não mediria nada: 25 % a 40 % do
comprimento de via nasce fora da divisa e o esquema recusa **as 60 variantes**
antes de qualquer julgamento.

**Por que só as vias.** Aparar um lote muda a área e a testada dele — que são
justamente os números que o Validator vai medir. Um lote aparado passaria numa
régua que o lote original reprova, e o relatório mentiria sobre o motor.

**Por que declarado e desligado.** O conserto é do Lab, não do motor. Se ele
fosse silencioso, o LAB-03 compararia o conserto do Lab com os motores próprios
do Generate, e não o Testfit — o mesmo erro que o LAB-01 recusou cometer com a
rampa (D11).

---

## D20 · O julgamento é importado do Generate, nunca reimplementado · 13/09/2026

**A decisão:** `esteira.ts` importa `montarParcelamentoExterno` e
`montarRelatorio` do repositório do Generate. O Lab **não tem** Validator nem
Judge próprios.

**Por quê.** O valor de toda esta fila está em comparar motores na mesma régua.
Uma segunda implementação da régua — ainda que fiel no dia em que for escrita —
divergiria na primeira mudança de regra do Generate, e a divergência apareceria
como diferença entre motores. O contrato já diz isso com todas as letras: *o
mesmo Validator e o mesmo Judge, sem versão leve e sem limiar mais frouxo por
ser de fora*.

**O preço aceito:** o Lab só roda com o clone do Generate ao lado, e um erro lá
quebra a medição aqui. É o preço certo: a alternativa é medir com régua errada e
não saber.

---

## D21 · A terceira gleba é a do LAB-01, e quem a projeta é o leitor do próprio Lab · 13/09/2026

**A decisão:** a terceira gleba é `sintetico-50ha-ondulado`, e a conversão para o
contrato usa `lerTerrenoGeo` — o mesmo leitor que o adaptador do Symbios usa.

**Por quê esta gleba.** As duas glebas-padrão do Generate têm `relevo` com
`cotas: null`, `curvas: []` e `classesDeclividade: null`: **nenhuma das duas
carrega topografia**. Sem uma terceira com relevo de verdade (575 curvas de 2 em
2 m, 45 m de desnível), o §2.6 não teria o que medir e o campo `relevo` do
contrato atravessaria a esteira inteira sem nunca ser exercitado.

**Por que o mesmo leitor.** Não é economia de código: é o que garante que a
mesma gleba chegue ao Symbios e ao Testfit **no mesmo lugar**. Duas projeções
para o mesmo terreno seria uma divergência silenciosa entre os dois motores que
o LAB-03 vai comparar — e ela apareceria como diferença de qualidade.

---

## D22 · A medição roda os dez partidos, e não o padrão de fábrica · 13/09/2026

**A decisão:** `ferramentas/medir.ts` passa os **dez** `FormatoId` e 20
variantes por gleba (60 no total), em vez dos defaults do motor.

**Por quê.** O padrão de fábrica do motor é `formatos: ["ortogonal"]` — um
partido de dez. A primeira rodada saiu com 12 variantes **todas ortogonais**, e o
relatório teria dito "o motor vai bem" medindo um décimo dele. Foi o que revelou
os dois partidos quebrados (`cluster` a 78 % de violação de testada, `organico`
com 165 sobreposições), que o padrão de fábrica nunca teria exercitado.

**O que isso custa:** a média fica feia (14,55 %) e é preciso publicar a tabela
por partido para que ela não engane. Publicar só a média seria pior nas duas
direções: esconderia os quebrados e injustiçaria o `pente`, que faz 3 394 lotes
com **duas** violações.

---

## D23 · O que não atravessa a ponte vira perda declarada, não silêncio · 13/09/2026

**A decisão:** ida e volta devolvem, além do dado, uma lista de `Perda`
(`campo`, `oQueHavia`, `motivo`, `gravidade`). Um teste exige que todo motivo
tenha texto de verdade.

**Por quê.** Um adaptador entre dois contratos que não se sobrepõem perde coisa —
a atração em linha que o motor não aceita, o `comercio` que não tem tipo de área
correspondente, o greide que o motor não calcula. Perda em silêncio é como se
lê um relatório errado: o número fecha e ninguém sabe o que ficou de fora.

Pela mesma razão, `faceDeRua` e `rampaMedia_pct` saem **`null`** e não zero.
Zero é uma medição; `null` é "não medido". Inventar zero teria feito a rampa
passar em toda conferência do Validator sem que nada tivesse sido conferido.

---

## D24 · A fila muda para `docs/prompts/FILA.md` · 13/09/2026

**A decisão:** `docs/FILA.md` passa a ser uma linha apontando para
`docs/prompts/FILA.md`, que é onde ela vive nos outros repositórios da família.

**Por quê.** Quatro repositórios com a fila em quatro lugares diferentes custa
uma pergunta por sessão. A linha que fica para trás é barata e evita que todo
link antigo — relatórios, README, prompts já colados — morra.

---

## D25 · As pendências do Jonny ganham arquivo próprio · 13/09/2026

**A decisão:** `docs/PENDENCIAS_JONNY.md`, no padrão do Geo e do Testfit: só o
que depende de uma pessoa, escrito para leigo, com os endereços prontos para
clicar. Item resolvido é marcado, **nunca apagado**.

**Por quê.** O que depende do Jonny estava disperso no fim de cada relatório, e
relatório é longo por natureza. Dívida técnica do código não entra ali — essa é
minha. Apagar item resolvido perderia a decisão junto com a pendência, que é o
que mais dói meses depois.

---

# Decisões do chat — 14/09/2026

As quatro abaixo **não são minhas**. Vieram do Claude do chat, que dirige a
família, junto com a fila autônoma. Ficam registradas aqui porque é aqui que se
procura o porquê — e porque duas delas mudam o que o Lab mede.

---

## D26 · A calçada é da via, não do lote · 14/09/2026

**A decisão (do chat):** a calçada fica **dentro da caixa da rua** — faixa de
domínio —, **nunca descontada do lote**. O Jonny confirma ou muda; até lá vale.

**O que isso resolve.** O LAB-07 mediu que o lote encosta a `caixa_m / 2` do
eixo: a calçada é declarada e não é reservada (D18). Havia dois caminhos — o
lote recua, ou a caixa passa a incluir a calçada. **O chat escolheu o segundo.**

**O que muda no Lab.** Nada na medição do LAB-07, que já declarou `largura_m =
caixa_m`: essa é exatamente a leitura "a calçada está dentro da caixa". O que
muda é o destino do item — deixa de ser pergunta aberta e passa a ser
**confirmação** do Jonny, e a correção nº 2 da lista do T02 ganha resposta: o
motor deve **parar de declarar `calcada_m` como coisa fora da caixa**, não
recuar o lote.

---

## D27 · Na tela só entra partido que passa no Validator · 14/09/2026

**A decisão (do chat):** na tela de qualquer aplicativo da família só entra
partido de traçado que **passe no Validator**. Hoje, só o `pente` (0,06 % de
violações). `cluster` e `organico` ficam **fora** até o recorte e as correções
derrubarem as violações a um patamar medido e **aceito pelo chat**.

**Por quê.** Um partido com 78 % dos lotes violando testada não é "opção com
defeito", é opção que o cliente não pode ver. E a régua não é opinião: é o
Validator do Generate, que já roda na esteira.

**O que muda no Lab.** O LAB-02 e o LAB-08 passam a ter um **critério de
aprovação declarado**, em vez de só publicar a tabela: um partido sobe quando o
número dele cai, e quem aceita o patamar é o chat. O Lab continua **não
recomendando produto** — ele mede e publica.

---

## D28 · Superquadra vazia é defeito de pontuação, não decisão urbanística · 14/09/2026

**A decisão (do chat):** o plano vazio da `superquadra` é **variante inválida** —
defeito da nota do motor, não escolha de urbanismo. Já foi mandado ao Testfit
(T02).

**Por quê.** O LAB-07 mediu 20 de 20 variantes sem um único lote, e o plano
vazio **liderando** o ranking com nota 0,366: ele tira 1,0 em "regularidade" e
1,0 em "proximidade do acesso" porque não há lote para desviar do padrão nem
para ficar longe. Nota que premia o vazio é nota quebrada.

**O que muda no Lab.** O item sai da lista de pendências do Jonny: não há nada
para ele decidir. Vira item de conserto do motor, e o Lab só reconfere o número
quando o T02 estiver mesclado (é a condição do LAB-08).

---

## D29 · A fila vira autônoma, com um despertador de 60 minutos · 14/09/2026

**A decisão:** `docs/prompts/FILA.md` passa a ser a **fila oficial**, escrita
pelo chat, e o Lab a executa sozinho, em laço, acordado por **um** despertador
de hora em hora (`trig_01DFdwqF4nUDLQAod5w4WH1m`, minuto :05). Um prompt por
despertador. Prompt fora da fila não existe.

**Por quê o minuto :05.** Regra de família: **um despertador por aplicativo**, e
nunca se toca no de outro repositório. Os outros seis já ocupavam :11, :24, :34,
:37, :43 e :52; o :05 estava livre e espalha a carga.

**O que ficou registrado como limitação:** o despertador **nasceu sem conectores
do GitHub**. As sessões que ele acordar não terão `mcp__github__*`, então o
prompt dele manda mesclar **por git direto** (`git merge --no-ff` na `main`) e
declarar isso no relatório e no recado. Não é falha do Lab: é como o gatilho
pode ser criado de dentro de uma sessão. Se o chat quiser PR de verdade a cada
rodada, o despertador precisa ser recriado pela interface do claude.ai.

---

## D30 · O repositório ganha um `docs/INDEX.md` · 14/09/2026

**A decisão:** um índice dos documentos, no padrão do Laboratório de
Parcelamento — tabela por assunto, com "o que responde" em vez de "o que é".

**Por quê.** O Lab passou de 4 documentos para 14 em cinco dias, e o
`ONDE_PARAMOS.md` vinha inchando para fazer também o papel de índice. São dois
trabalhos diferentes: o `ONDE_PARAMOS` responde **"onde estamos hoje"** e
envelhece a cada rodada; o `INDEX` responde **"onde está a coisa"** e quase não
muda. Misturados, o primeiro fica longo demais para ser lido ao acordar.

---

# LAB-02 — o recorte · 14/09/2026

---

## D31 · A esteira cruzada ganha pasta própria · 14/09/2026

**A decisão:** `external-engines/esteira/` — um projeto Bun pequeno que conhece
os três caminhos (`@symbios`, `@testfit`, `@generate`) e guarda o que põe
**qualquer** motor na régua do Generate.

**Por quê.** O julgamento não é propriedade de nenhum dos dois adaptadores. Só
havia dois lugares possíveis, e os dois eram piores:

- **dentro de `testfit/`**, porque é lá que o alias `@generate` já existia — mas
  aí a comparação Symbios × Testfit do LAB-08 moraria dentro da pasta de um dos
  dois, arquivada errado desde o primeiro dia;
- **dentro de `symbios/`**, que quebraria a regra de zero dependência npm do
  adaptador dele (D14) — ele roda em Node sem pacote nenhum, e o julgamento
  precisa de `zod` e do Bun.

O custo é um `package.json` e um `tsconfig.json`. O benefício é que o LAB-08
nasce com endereço.

---

## D32 · Quem bloqueia a rua é o `desconta` do Geo, não uma lista do Lab · 14/09/2026

**A decisão:** o recorte barra a via nas restrições com `desconta: true`, e só
nelas. Nenhuma lista de categorias proibidas no código.

**Por quê.** O contrato do Geo já define o campo: *"esta área desconta da área
líquida"*. Terra que não entra na área líquida não recebe asfalto — a regra já
existe e já está no dado. Escrever aqui `["app_rio", "app_declividade", …]`
seria inventar regra urbanística, que é do Jonny, e criaria uma segunda verdade
que envelheceria em silêncio toda vez que o Geo ganhasse uma categoria nova.

Medido em `completo`: pegou `app_rio` (5,1 ha), `app_declividade` (0,9 ha) e
`reserva_legal` (28,4 ha), e levou a via dentro delas de 19,55 % para 0 %.

---

## D33 · Este recorte fica com TODOS os pedaços, e o do LAB-07 fica com o maior · 14/09/2026

**A decisão:** quando uma via sai e volta a entrar, aqui os dois trechos
sobrevivem, cada um com id próprio. O `apararVias` do LAB-07 fica com o maior e
descarta o resto.

**Por quê as duas coisas estão certas.** A diferença não é de gosto, é do que
cada motor devolve. O do Testfit devolve **segmento de dois pontos**: ficar com
dois pedaços dele inventaria uma via que o motor não desenhou. O Symbios devolve
**polilinha com dezenas de vértices cotados**, e quando ela atravessa a divisa e
volta, **os dois trechos de dentro são estrada que o motor desenhou** — ficar só
com o maior jogaria fora rua de verdade.

O preço é fragmentação, e ela é medida em vez de escondida: 10 vias partidas em
`completo`, 1 em `sintetico-50ha`, 0 em `sintetico-10ha`.

---

## D34 · A cota do ponto de corte é interpolada, nunca reamostrada · 14/09/2026

**A decisão:** a cota de um ponto de corte sai da reta entre as duas cotas
conhecidas daquele segmento. O mapa de alturas **não** é consultado de novo.

**Por quê.** Entre dois nós, a superfície que o motor assume é a reta — é assim
que ele calcula a própria rampa. Reamostrar o mapa daria ao ponto novo uma cota
fora dessa reta, criando um degrau e, com ele, uma rampa que o motor nunca
produziu. O corte passaria a **fabricar** violação de greide.

Um teste trava a propriedade: nenhum trecho cortado pode ter rampa maior que a
da via de origem.

---

## D35 · Lasca de corte não é descartada, é medida · 14/09/2026

**A decisão:** trechos curtos criados pelo corte ficam, e o relatório conta
quantos e quanto somam. Nenhum limiar de descarte.

**Por quê.** Descartar exige um número — "menos de 5 m não vale" —, e esse
número é regra. Regra nova é *proposto ao chat*, não escolha minha no meio de um
recorte geométrico.

Medido, o problema é pequeno: **3 trechos abaixo de 5 m em `completo`, somando
4,87 m**; zero nas outras duas glebas. Se algum dia doer, aí sim vira proposta,
com o número na mão.

---

# LAB-03 — o relevo · 14/09/2026

---

## D36 · `gerarRedeViaria` aceita um mapa de alturas pronto · 14/09/2026

**A decisão:** um quinto parâmetro opcional, `mapaPronto`. Quando vem, o
adaptador usa ele em vez de montar o próprio.

**Por quê.** Medir o que a **interpolação** muda no traçado exige rodar o mesmo
motor, com a mesma semente, sobre dois mapas diferentes. Sem essa porta, a única
alternativa seria pôr os dois interpoladores dentro de `alturas.ts` — um deles o
**defeituoso, de propósito** — e código de produção que carrega a versão errada
é armadilha esperando alguém ligar por engano.

**O que isso obriga:** quem passa um mapa assume a responsabilidade por ele. O
passo, a folga e a inversão de eixo têm de ser os de `montarAlturas`, senão o
resultado volta no lugar errado. O comentário na assinatura diz isso, e um teste
verifica que a réplica bate campo a campo com o mapa de produção.

---

## D37 · O interpolador defeituoso é replicado na pasta de medição, não em produção · 14/09/2026

**A decisão:** `external-engines/esteira/src/relevo-k-vizinhos.ts` — a versão
errada, viva o bastante para servir de controle, com o nome dizendo o que é.

**Por quê.** É o mesmo caminho que o LAB-07 seguiu ao replicar o `campoRelevo`
do outro motor para medi-lo sem escrever no repositório dele. Um controle
experimental precisa existir; ele só não pode morar onde alguém possa usá-lo
achando que é o bom.

**O cuidado que faz o controle valer:** a réplica copia `montarAlturas` linha a
linha — grade, passo, folga, inversão de eixo, máscara de dentro — e troca
**só** a função que decide a cota. Qualquer outra diferença faria a comparação
medir duas coisas ao mesmo tempo. Um teste trava as cinco igualdades.

E o `K = 6` não é um número qualquer: é o do `criarModeloRelevo` do Generate,
medido no LAB-07. Isso faz deste controle não "um interpolador ruim", mas **o
interpolador que o Generate usa hoje**.

---

## D38 · A escala do relevo da fixture sai do tamanho da gleba · 14/09/2026

**A decisão:** a escala da superfície sintética é o **raio equivalente da gleba
dividido por 3**, não um número em metros.

**Por quê.** Fixar, digamos, 150 m faria a mesma superfície virar uma planície
suave numa gleba de 140 ha e um sertão de penhascos numa de 10 ha — e as duas
fixtures deixariam de ser comparáveis entre si. Com o raio, saem sempre duas a
três ondulações na largura do terreno, que é densidade de morro e vale que um
loteamento de verdade encontra.

Medido: `ensaio-47ha` (47 ha) ficou com escala 128,93 m e 30,07 m de desnível;
`geo-antonina` (141,8 ha) com 223,91 m e 55,92 m.

---

## D39 · A fixture acrescenta relevo e não toca em mais nada · 14/09/2026

**A decisão:** poligonal, restrições, acessos e parâmetros das glebas-padrão
chegam **intactos** na fixture; só o campo `relevo` é preenchido, e o arquivo
declara em `archilly.origem` que ele é sintético.

**Por quê.** A fixture existe para destravar a comparação entre motores, não
para melhorar a gleba. Se ela também mexesse em parâmetro ou em restrição,
qualquer diferença medida depois teria duas explicações possíveis, e nenhuma
forma de separá-las. Um teste compara campo a campo com o original.

E a declaração não é formalidade: um arquivo com curvas de nível parece
levantamento. Quem o abrir daqui a três meses precisa saber, na primeira linha,
que aquele morro foi calculado, não medido.

---

# LAB-08 — os dois motores lado a lado · 14/09/2026

---

## D40 · O clone de leitura é atualizado quando o prompt exige a versão nova · 14/09/2026

**A decisão:** o clone de `motor-testfit` foi levado de `T00-A` para a `main`
com T02 (`git merge --ff-only`). Continua **somente leitura** — nenhum commit,
nenhum push, `git status` limpo no fim.

**Por quê.** O LAB-08 pede explicitamente *"a esteira com o motor do Testfit
corrigido (T02)"*. Medir o T00-A e chamá-lo de T02 seria mentir sobre o que está
na tabela. Atualizar o **meu** clone não é escrever no repositório deles — é ler
uma versão diferente do mesmo repositório.

**O que isso obriga:** dizer no relatório qual commit foi medido, porque a
tabela envelhece junto com o motor.

---

## D41 · Teste que fixa defeito consertado é reescrito, não apagado · 14/09/2026

**A decisão:** o teste do LAB-07 que exigia *"sem aparo o contrato recusa"*
passou a exigir só o que continua verdadeiro — que o resultado **com** aparo
passa no esquema. O comentário guarda o que ele fixava antes, o número velho
(60 de 60 recusadas), o número novo (0 de 20) e por que mudou.

**Por quê.** O T02 consertou o defeito, então a asserção antiga está errada e
tem de sair. Mas **apagar a linha perderia a memória de por que o `aparo.ts`
existe** — daqui a três meses alguém olharia aquele arquivo, veria que ele corta
0,3 %, e o removeria por inútil, sem saber que ele foi escrito quando o número
era 38 % e que é ele que garante que não volte a ser.

Um teste é também documento. Quando a verdade que ele guardava muda, o que muda
é a asserção; a história fica no comentário.

---

## D42 · A comparação com o Generate roda também na gleba SEM relevo · 14/09/2026

**A decisão:** o motor do Testfit foi medido duas vezes em cada gleba — na
fixture com relevo (para o confronto com o Symbios) e na gleba original sem
relevo (para o confronto com os números do Generate).

**Por quê.** Os 974 lotes do Generate foram medidos na gleba original. Comparar
com uma rodada feita sobre a fixture do LAB-03 misturaria duas mudanças — o
motor e o terreno — e nenhuma forma de separá-las.

**O que a terceira rodada revelou, e valeu o custo:** os dois resultados são
**idênticos**, lote a lote (599 e 599; 1 391 e 1 391). O traçado daquele motor
não usa relevo, o que a medição independente confirma e o T03 deles já dizia no
título. A comparação com o Generate está limpa — mas isso só se pôde afirmar
porque a terceira rodada existiu.

---

# LF-FINAL — a conferência · 14/09/2026

---

## D43 · A conferência foi feita contra o Padrão Versão 1, e a lacuna está declarada · 14/09/2026

**A decisão:** o LF-FINAL pede conferência contra o **Padrão 1.2**. Essa versão
não existe em nenhum repositório legível. Conferi contra a **Versão 1 ·
13/09/2026**, que é a única que há, e a primeira seção do relatório diz isso,
com a lista de onde procurei.

**Por quê não esperei.** A alternativa era marcar o prompt "aguardando" e não
entregar nada. Mas o escopo dele — chaves, formatação no núcleo, determinismo,
docs, `INDEX`, `ONDE_PARAMOS`, `PENDENCIAS_JONNY` — **não depende da versão**:
essas regras existem na Versão 1 e quase certamente na 1.2. Entregar a
conferência inteira contra o que existe, e declarar o delta como pendente, é
mais útil do que uma fila parada.

**Por que não troquei a referência em silêncio.** Um relatório que diz
"conferido contra o Padrão" sem dizer qual versão é um relatório que envelhece
mentindo. O `TF-FINAL` do repositório irmão está travado pela mesma razão — é
sinal de que a 1.2 é documento que o chat ainda tem de publicar, não coisa que
eu deixei de achar.

---

## D44 · O núcleo formata prosa, e isso fica como ressalva em vez de conserto · 14/09/2026

**A decisão:** as 17 ocorrências de `toFixed` dentro do núcleo — todas em
mensagens de aviso, mensagens de erro e no campo `oQueHavia` das perdas — ficam
como estão, declaradas no relatório, e a pergunta vai para o chat.

**Por quê não consertei.** A regra do Padrão (§9.3) é *"núcleo em metros,
formatação só na borda"*, e o risco que ela existe para evitar **não corre
aqui**: nenhum número que viaja é formatado. Todo campo do contrato, toda
medição em JSON e toda coordenada saem crus, em metro. Os `toFixed` do
`geojson.ts` são `Number(x.toFixed(n))` — arredondamento numérico na borda —, e
o de `index.ts:477` é canonização para o hash de determinismo.

O que resta é prosa para pessoa. E tirar o `toFixed` da prosa **pioraria a
prosa**: *"a área difere 14.328571428571429 %"* não ajuda ninguém.

**Por que não decidi sozinho.** É interpretação da letra do Padrão, e
interpretação do Padrão é do chat, não minha. Se a resposta for "aperta", o
conserto é mecânico e cabe num prompt curto.

---

## D45 · `ADOCAO_CENTRAL.md` e `SEGURANCA.md` existem para responder, não para marcar presença · 14/09/2026

**A decisão:** os dois arquivos que o Padrão exige e faltavam foram escritos
**respondendo item a item**, e não com "não se aplica" no topo.

**Por quê.** Um arquivo obrigatório preenchido com "N/A" cumpre a letra e perde
a função. Quem abrir o `ADOCAO_CENTRAL.md` daqui a três meses quer saber **por
que** não adota — e a resposta é boa: não há conta, não há tela (é regra), não
há chamada de IA. A ausência é por definição, não por esquecimento, e o arquivo
diz o que mudaria se deixasse de ser.

No `SEGURANCA.md` a escolha foi mais forte: **o comando de conferência fica ao
lado de cada linha**. Uma lista de segurança que não diz como foi verificada é
uma lista que ninguém consegue refazer — e, na primeira tentativa, a minha
própria busca por chaves acusou quatro falsos positivos (a palavra
*de-**senha**-r*). Sem o comando escrito, esse erro teria virado "conferido".

---

## D46 · `docs/referencia/` passa a existir, e a especificação muda de lugar · 14/09/2026

**A decisão:** `docs/LABORATORIO.md` foi para `docs/referencia/LABORATORIO.md`,
e junto veio uma cópia do Padrão contra o qual a conferência foi feita.

**Por quê.** O Padrão define `docs/referencia/` como "material de origem", e a
especificação do laboratório é exatamente isso: chegou pronta, foi gravada tal
como estava, e não é documento que este repositório escreve. Estava em `docs/`
por não haver a pasta.

**Por que a cópia do Padrão.** Para a conferência ser auditável daqui a meses
sem depender de outro repositório estar clonado ao lado. É cópia declarada, com
versão e data no cabeçalho — e é o mesmo que o repositório irmão fez.

Os cinco links que apontavam para o caminho antigo foram corrigidos.

---

# Decisões do chat — 15/09/2026

---

## D47 · Prosa para pessoa é borda: os 17 `toFixed` do núcleo ficam · 15/09/2026

**A decisão (do chat):** a regra §9.3 do Padrão — *"núcleo em metros, formatação
só na borda"* — **não alcança texto escrito para pessoa ler**. Mensagem de
aviso, mensagem de erro e o campo `oQueHavia` das perdas **são borda**. As 17
ocorrências que o LF-FINAL levantou ficam como estão.

**O que isso fecha.** O LF-FINAL deixou a pergunta aberta de propósito (D44),
porque interpretar o Padrão é do chat. A resposta veio, e ela confirma a leitura
que o relatório já defendia: o risco que a regra existe para evitar — um número
perder precisão no caminho e a tela herdar o arredondamento — **não corria
aqui**, porque o dado e a prosa são campos diferentes e o dado está cru.

**O que continua proibido:** formatar o que **viaja**. Todo campo do contrato,
toda medição em JSON e toda coordenada seguem saindo como número em metro. A
fronteira agora é nítida: `Number(x.toFixed(n))` num campo de dado é
arredondamento e precisa de justificativa; `${x.toFixed(1)} %` dentro de uma
frase é borda e não precisa.

---

## D48 · Lasca de corte se descarta abaixo do lote mínimo da gleba · 15/09/2026

**A decisão (do chat):** um trecho criado pelo recorte é descartado quando for
**menor que o lote mínimo declarado nos parâmetros da gleba**
(`parametros.areaMinLote_m2`, pela raiz quadrada — o lado do lote mínimo
quadrado). Regra já existente, vinda do dado, não inventada.

**Por quê ela resolve o impasse.** O LAB-02 deixou as lascas todas no lugar
(D35) porque descartar exigia um limiar, e limiar é regra urbanística — minha de
inventar, não. O chat resolveu apontando para um número **que a própria gleba já
declara**: se um pedaço de rua é mais curto que o lado do menor lote admissível,
ele não serve a lote nenhum e não é rua, é resto de corte.

**O que muda, medido no LAB-02:** com `areaMinLote_m2 = 200`, o lado dá 14,14 m.
Os 3 trechos abaixo de 5 m de `completo` (4,87 m no total) passam a ser
descartados, e mais o que estiver entre 5 e 14,14 m. O LAB-05 mede o efeito nas
três glebas e publica o antes e o depois.

**O que a regra NÃO faz:** não descarta trecho curto que o motor desenhou
inteiro. Só lasca **criada pelo corte** — trecho que nasceu de um recorte, não
do traçado.

---

## D49 · A calçada dentro da caixa da via segue valendo · 15/09/2026

**A decisão (do chat):** confirmada a D26. A calçada fica **dentro da caixa da
rua**, nunca descontada do lote. Nada muda em medição nenhuma — é a leitura que
o LAB-07 já usava (`largura_m = caixa_m`).

Fica registrado porque o item estava aberto em `PENDENCIAS_JONNY.md` como
"confirmar", e agora está fechado. **Ele sai da lista do Jonny.**

---

## D50 · O esqueleto reto é reimplementado, e é ele que faz o lote · 15/09/2026

**A decisão:** a subdivisão de quadra em lotes é feita por **esqueleto reto**
(*straight skeleton*), reimplementado em TypeScript a partir da literatura
(Felkel & Obdržálek 1998; Aichholzer, Aurenhammer, Alberts & Gärtner 1995;
Aichholzer & Aurenhammer 1996), em
`external-engines/esteira/src/esqueleto/esqueleto.ts`.

**Por que reimplementar, e não usar pronto.** As duas implementações prontas para
navegador são **copyleft** — GPL-2.0-or-later e equivalente, sem exceção de
vinculação (`STRAIGHT_SKELETON_ANALYSIS.md`, §3 e §4.1). Compiladas e
distribuídas com o Generate, contaminam o produto. Não entram.

**Por que esqueleto reto, e não faixa por recuo.** Uma quadra faz frente para
mais de uma rua. Faixas independentes se atravessam no miolo, e sobreposição é a
violação mais grave que existe num parcelamento. O esqueleto parte a quadra em
**uma face por aresta**, e a face de uma aresta é a parte da quadra mais perto
dela do que de qualquer outra: lote plantado dentro da própria face **não pode**
invadir a vizinha. Em canto reflexo — onde recuo ingênuo se auto-intersecta — ele
reparte certo, e isso está provado contra o oráculo.

**Custo aceito:** o esqueleto reto é sensível a degenerescência. Por isso ele tem
orçamento de tempo duro (250 ms) e um campo `confiavel`, e quadra que não fecha é
**pulada e contada** — 86 das 579 loteáveis de `geo-antonina` (LAB-04, §5).

## D51 · Face aberta não vira lote: o esqueleto se declara não confiável · 15/09/2026

**A decisão:** `esqueletoReto` devolve `confiavel: false` e um `fechamento`
(a razão entre a soma das faces e a área do anel) quando a frente de onda para
antes de fechar — por orçamento de tempo, por limite de passos ou por empacar. O
`lotear.ts` **pula a quadra inteira** nesse caso, e o número de quadras puladas
sai no relatório.

**Por quê.** Uma face aberta não é uma face ruim: é um polígono absurdo. Medido
numa quadra real de `ensaio-47ha`, o erro de área de uma face aberta deu
**5×10¹⁰ %**. Lote plantado ali seria mentira medida, e o CLAUDE.md §4 proíbe
inventar dado. **Uma quadra a menos é perda declarada; um lote impossível é
medição falsa.** Vale a mesma regra do `null` (D23): o que não se sabe medir não
sai como número.

## D52 · A quadra do Symbios é delimitada pelo EIXO da via, e o lote começa no meio-fio · 15/09/2026

**A decisão:** ao lotear uma quadra do Symbios, o lote nasce a
`largura_m / 2 + 0,25 m` da borda da quadra — a meia caixa da via, mais a
tolerância de simplificação —, nunca encostado na borda.

**Como se descobriu.** Não por leitura de código: **pelo Validator do Generate.**
A primeira versão plantou o lote na borda e recebeu de volta
`via-sobre-lote em 369 de 369 lotes` e `frente` em 310. As quadras do Symbios são
**faces do grafo viário**: o que as delimita é a linha de centro da rua, e o leito
da rua cobre metade de cada lote plantado ali.

**É o mesmo erro do LAB-07 com a calçada (D18), e a mesma lição:** o adaptador
declara a geometria que existe, não a que parece. Um motor que entrega "quadra"
não entrega necessariamente a mesma coisa que o Generate chama de quadra, e a
única forma de saber é medir com a régua dele.

## D53 · O número de fatias de uma aresta é preso pelos parâmetros da gleba · 15/09/2026

**A decisão:** uma aresta de quadra é fatiada em `floor(comprimento / testadaAlvo)`
lotes, **preso entre dois limites que saem dos próprios parâmetros**: ao menos
`comprimento · profundidade / areaMaxLote_m2` fatias, e no máximo
`comprimento / testadaMinLote_m`.

**Por quê.** Só o `floor` produzia lote acima da área máxima: uma aresta de 26 m
com testada alvo de 13,4 m dá **uma** fatia de 26 m de testada — 700 m², contra o
máximo de 600 da gleba. O Validator devolveu isso como **8 violações
`faixa-legal`** em `geo-antonina`; com os dois limites, **zero**.

**O que isto não é:** regra urbanística inventada. `areaMaxLote_m2` e
`testadaMinLote_m` já vêm declarados nos parâmetros da gleba — o que faltava era
**usá-los**. Quando os dois limites se cruzam, não há número de fatias que sirva,
e a peça é descartada pelo máximo, contada.

## D54 · A pergunta "esta aresta tem rua?" é refeita em cada fatia · 15/09/2026

**A decisão:** além de perguntar se a **aresta** tem rua (no meio dela), pergunta-se
de novo, com a mesma régua, no meio de **cada fatia** — e a fatia sem rua na
frente dela não vira lote.

**Por quê.** A rua pode cobrir só um pedaço de uma aresta longa. O lote da ponta
saía sem frente, e o Validator do Generate o reprovava: **8 `frente`** em
`geo-antonina`, que caíram para 2 com a régua por fatia (16 fatias descartadas).

**Nenhum número novo entrou:** é a mesma régua do passo 1, aplicada onde o lote
de fato nasce. O defeito era da pergunta ter sido feita no lugar errado.

---

## D55 · A amostragem do "quanto está dentro da gleba" nunca chegava ao vértice · 15/09/2026

**A decisão:** `fracaoDentro`, em `external-engines/symbios/adapter/src/index.ts`,
passou a amostrar o raio do centróide ao vértice em `t = (k + 1) / 8` — de 0,125
a **1,0** — em vez de `t = (k + 0,5) / 8`, que ia de 0,0625 a **0,9375**.

**O defeito, e como apareceu.** O LAB-05 conferiu o recorte com régua
independente — *algum vértice de quadra passa da divisa?* — e achou **8 quadras**
nas duas glebas-padrão, a pior **1,49 m** fora, todas declarando
`fracaoDentroDaGleba` = **1,0000**. Não eram erro de arredondamento: o extremo da
amostra caía **antes** do extremo da coisa medida, e a ponta de fora da quadra
nunca era visitada.

**O que muda em número publicado, e fique dito:** com a régua consertada aparecem
mais quadras atravessando — `ensaio-47ha` 3 → 5, `geo-antonina` 119 → 128,
`completo` 73 → 74, `sintetico-50ha-ondulado` 36 → 37 — e `geo-antonina` passa de
698 para 701 quadras. Os **213 e 901 lotes do LAB-04** foram medidos com a régua
cega; pela mesma estratégia, com ela consertada, seriam 181 e 876.

**O que continua verdadeiro:** isto é **estimativa**, e continua sendo. Uma
quadra pode ter todo vértice dentro e ainda inchar para fora numa reentrância da
gleba, e amostra nenhuma pega isso. É por isso que existe a D56.

## D56 · Quem atravessa a divisa é a geometria que diz, não a amostragem · 15/09/2026

**A decisão:** o recorte de quadra do LAB-05 **não pergunta** a
`fracaoDentroDaGleba` quem atravessa. Ele recorta **todas** as quadras pela gleba
e deixa a interseção responder: a que já estava inteira dentro volta idêntica,
sem travessia nenhuma, e é devolvida sem cópia.

**Por quê.** A D55 conserta um ponto cego da amostragem, mas não muda a natureza
dela. Uma régua estatística serve para relatório — *"quanto vai ser recortado"* —
e não para decidir geometria. Decidir pela amostragem é deixar o recorte
depender de quantas amostras alguém escolheu.

**O que custa:** recortar 702 quadras em vez de 128. Medido: **126 ms** em
`geo-antonina`, contra 6,2 s do motor. Não é preço nenhum.

## D57 · O recorte de polígono é Greiner–Hormann reimplementado, e a degenerescência se declara · 15/09/2026

**A decisão:** `external-engines/symbios/adapter/src/poligono.ts` implementa
Greiner & Hormann (1998), *Efficient clipping of arbitrary polygons*, escrito a
partir da descrição.

**Por que não usar pronto, e por que não bastava o que já havia.** As
bibliotecas de recorte de polígono para JavaScript ou são copyleft ou trariam
**dependência npm** a um adaptador que não tem nenhuma por decisão (D14). E o
corte por semiplano que o `lotear.ts` usa não serve: a gleba **não é convexa**, e
uma quadra que sai e volta pela divisa devolve **duas peças** — semiplano não faz
nem uma coisa nem outra.

**A degenerescência, que é o buraco conhecido do algoritmo.** Ele pressupõe que
nenhuma travessia cai exatamente sobre um vértice; quando cai — e cai, porque
quadra e gleba compartilham vértice —, a alternância entra/sai quebra e o
resultado é lixo silencioso. Aqui ela é **detectada** e o recorte é refeito com o
anel deslocado de décimos de milímetro, numa sequência **fixa** (nada de
aleatório). O maior deslocamento, 0,2 mm, está três ordens de grandeza abaixo da
folga de divisa do contrato, que é 5 cm.

**E se não resolver:** a função devolve `null`, e a quadra é **perda declarada**.
Nunca peça torta. É a mesma regra do esqueleto não confiável (D51), pela mesma
razão: recortar errado é plantar lote fora da gleba, que foi o defeito que o
LAB-04 viu o Validator acusar — 97 peças fora, a pior a 32 m.

**Medido nas cinco glebas: zero deslocamentos e zero perdas.** A degenerescência
aparece nos casos sintéticos dos testes, onde ela é fabricada de propósito.

## D58 · Rua sobre APP não é decisão do Lab — e é por isso que `geo-antonina` fica em dois blocos · 15/09/2026

**A decisão:** a rede viária de `geo-antonina` **continua em dois blocos** depois
do recorte, e isso não é defeito a consertar aqui.

**O que foi medido.** O prompt do LAB-05 trazia *"reconectar a rede depois do
corte — `geo-antonina` fragmenta a 70,4 %"* como item de conserto. Medida a
anatomia da fragmentação, ela não é farelo: são **dois blocos**, de 42 899 m e
17 296 m, mais 739 m em 23 pedacinhos. Na rede crua, **17 vias** ligavam os dois;
delas, 10 037 m estavam **fora da gleba** e 1 682 m **dentro de APP**. O menor vão
entre os dois blocos tem **72,45 m**, e dele **200 de 201 pontos amostrados estão
dentro da APP hídrica de 14,4 ha**.

**Ou seja:** a gleba é cortada em duas por um curso d'água, e o recorte fez o que
tinha de fazer — tirou a rua de cima dele. Ligar os dois blocos é **lançar via
sobre APP**, uma travessia. Isso é regra urbanística, e o CLAUDE.md §4 diz que o
Lab não decide urbanismo.

**Onde a pergunta foi parar:** `docs/PENDENCIAS_JONNY.md`, escrita para leigo, e
na fila como proposto ao chat. **Os 70,4 % são a resposta certa.**

**O que sobra de fragmentação genuína** — os 23 pedacinhos — é lasca de corte, e
quem a trata é a D48: 17 saíram, e os componentes caíram de 25 para 19 sem que
uma via de verdade fosse tocada.

---

## D59 · `fechamento` sai cru do núcleo — a formatação é de quem publica · 15/09/2026

**A decisão:** `esqueletoReto` devolve `fechamento` sem arredondar. Ele saía com
`Number(fechamento.toFixed(4))`.

**Por quê.** O §9.3 do Padrão diz *núcleo em metros e moeda base; formatação só
na borda*. A D47 abriu uma exceção **medida**: prosa para pessoa — aviso, erro,
mensagem — **é** borda, e por isso os `toFixed` dentro de texto ficam.

`fechamento` **não é prosa**. É campo de dado do resultado do esqueleto, e viaja
para JSON de prova. Arredondá-lo no núcleo é decidir, dentro da geometria,
quantas casas o leitor merece — que é exatamente o que o §9.3 proíbe. Quem
publica é que decide, e as ferramentas já o faziam.

**Como apareceu:** a conferência do LF-FINAL-2, ao classificar **cada** `toFixed`
do núcleo em vez de contá-los juntos. Dos 32: 20 são prosa (D47), 10 são o
`geojson.ts`, que é formato de exportação, 1 é o hash de determinismo (declarado
no próprio arquivo), e **1 era dado que viaja**. Agora são zero.

## D60 · A regra do RECADO virou teste — e ela estava sendo quebrada · 15/09/2026

**A decisão:** `external-engines/esteira/tests/recado.test.ts` mede, a cada
`bun test`, se o **último** recado de `docs/relatorios/RECADOS.md` cabe nas 12
linhas do CLAUDE.md §1, abre e fecha com a marca certa, e responde às cinco
perguntas do formato.

**Por que foi preciso.** O LF-FINAL-2 mediu a regra pela primeira vez: **7 dos 8
recados passaram do teto** — 16, 21, 19, 19, 18, 19 e 16 linhas. Só o do LAB-05
cabia, e só porque o desvio foi pego antes do commit. A regra estava escrita,
era a mais visível do repositório, e ninguém a media. **O que não é medido volta
a acontecer** — é o §6 do Padrão aplicado contra mim.

**Por que o teste olha só o último.** `RECADOS.md` é registro **do que foi
enviado**. Encolher os sete antigos faria o arquivo mentir sobre o que o chat
recebeu; o desvio fica registrado na tabela do LF-FINAL-2, com nome e número. O
que o teste tem de impedir é o **próximo**, e olhando o último ele morde toda vez
que um recado novo é escrito, sem lista de exceções que envelhece.

**Por que ele mora na esteira:** `bun test` ali é o único corredor de teste do
repositório. A regra é de documento, o teste é de código, e o lugar do teste é
onde ele roda.

---

## D61 · Travessia sobre APP é exceção, não padrão · 15/09/2026

**A decisão é do Jonny**, em resposta à pergunta que o LAB-05 levantou (D58) e
que estava em `PENDENCIAS_JONNY.md`. **Regra urbanística; não é minha, e por isso
vai transcrita antes de interpretada:**

> Travessia sobre APP é **exceção, não padrão** — o motor tenta primeiro ligar os
> dois lados **por fora da APP** e só propõe travessia se o desvio for
> desproporcional; quando propuser, **a mais curta e perpendicular ao curso**,
> declarada na tela e lançada como **item de custo (ponte ou bueiro)**.

**O que ela fecha.** A D58 registrou que `geo-antonina` fica em dois blocos
porque uma APP hídrica de 14,4 ha corta a gleba, e que ligar os dois é decisão de
urbanismo. Está decidido: **pode**, mas por exceção e com ônus declarado. Os
70,4 % continuam sendo a resposta certa **enquanto houver caminho por fora**.

**Os cinco comandos, separados, porque cada um é uma coisa diferente de fazer:**

1. **Tentar primeiro por fora.** Antes de qualquer travessia, procurar caminho
   contornando a APP. Só quando ele não existir ou for desproporcional é que a
   travessia entra.
2. **O limiar de "desproporcional" não foi dado, e não invento.** É número de
   urbanismo — volta ao Jonny como pergunta (quantas vezes o caminho direto? um
   comprimento absoluto?), e fica em `PENDENCIAS_JONNY.md`. Sem ele, o motor não
   tem como decidir sozinho: **por ora, nenhuma travessia é proposta.**
   → **FECHADO em 02/10/2026 pela [D84](#d84): 3× a distância direta OU 1,5 km a
   mais de percurso, confirmado pelo Jonny.** A pergunta era exatamente esta, e
   as duas alternativas que ela listava eram as duas leituras possíveis; a
   resposta foi a relativa **e** a absoluta, em OU.
3. **A geometria da travessia:** a mais curta, e **perpendicular ao curso
   d'água** — não perpendicular à APP, nem alinhada à malha. São duas condições,
   e a segunda exige saber onde está o **eixo do curso**, que hoje o Lab não
   recebe: a restrição chega como **polígono de APP**, não como linha d'água.
   **Achado para o Geo**, e está na lista de achados.
4. **Declarada na tela.** É do Generate e do Laboratório de Parcelamento: quem
   desenha, mostra. O Lab **não tem tela** (CLAUDE.md §4) — aqui a travessia sai
   declarada no relatório e no JSON de medição, com comprimento e ângulo.
5. **Item de custo, ponte ou bueiro.** Vai para o aplicativo de orçamento da
   família. **A mensagem do chat cortou no nome dele** (“para o Or…”), então o
   destino fica registrado assim e **confirmado antes de qualquer integração** —
   é melhor registrar o corte do que adivinhar o destinatário.

**O que esta decisão NÃO autoriza:** escolher o limiar, escolher entre ponte e
bueiro (é hidráulica e custo, não geometria), ou lançar travessia sem que o
caminho por fora tenha sido medido primeiro.

## D62 · Despertador que acorda e não acha item pronto se apaga · 15/09/2026

**A decisão (do chat):** quando um disparo do despertador não encontrar item
**pronto** na fila, ele **se apaga**, em vez de acordar de novo. Antes, a regra
mandava apagar só quando a fila **esgotava**; agora vale também para a fila que
existe mas está toda "aguardando".

**Por que ela apareceu.** Medido no consolidado de 15/09: dos **7 disparos** do
despertador anterior, **4 não tiveram o que fazer** — a sessão estava ociosa das
02:05 às 06:06, os avisos ficaram enfileirados e chegaram os cinco juntos; um
prompt por despertador, então um prompt só rodou para o lote inteiro. Os outros
quatro foram disparo sem trabalho.

**O que muda na prática:** o laço deixa de bater à toa. Se o que restar na fila
depende do Jonny ou de outro repositório, o despertador morre ali e o chat o
recria quando destravar — em vez de o repositório acordar de hora em hora para
descobrir que continua travado.

**Gravada no CLAUDE.md §1-A**, que é onde a regra da fila mora.

---

## D63 · A régua de forma do lote é a caixa GIRADA, não a dos eixos · 19/09/2026

**A decisão:** a irregularidade de um lote é medida contra a **caixa de menor
área em qualquer orientação**, e não contra a caixa alinhada aos eixos.

**Por que foi preciso.** A fórmula do Generate é `1 − área / área da caixa`, com
caixa alinhada aos eixos — e ela **pune quem gira o lote pela rua**. Medido na
primeira passada do LAB-13: **754 de 776 lotes** da candidata espinha em
`ensaio-47ha` marcados "irregulares", mediana **0,657**. E eles são retângulos.

**Como:** teorema de Freeman & Shapira (1975) — a caixa mínima de um polígono
tem um lado colinear com uma aresta do fecho convexo, então basta testar as
arestas. Retângulo girado dá **zero**, em qualquer ângulo. Com ela, os mesmos 776
lotes dão **84 irregulares e mediana 0,000**.

**As duas saem no JSON**, de propósito: a dos eixos mantém continuidade com o que
o Generate já publicou; a girada é a que responde *"o lote tem forma boa?"*. A
tabela usa a girada, e o relatório diz isso.

## D64 · Testada de frente não é via desenhada à mão · 19/09/2026

**A decisão:** as duas são separadas **por medição** — a linha cujo ponto médio
está a menos de 1 m da divisa é **testada de frente**; a de dentro da gleba é
**via desenhada à mão**. E cada uma tem a sua pergunta.

| | o que o motor deve fazer | o que se mede |
|---|---|---|
| via desenhada à mão | **seguir** a linha | quanto do comprimento tem eixo a menos de meia caixa |
| testada de frente | dar **lote de frente**, nunca rua em cima | quantos lotes têm aresta na linha |

**Como apareceu.** O LAB-13 foi mandado medir "aderência a via desenhada à mão
quando aplicável". Medido: das cinco glebas, **quatro não têm atração nenhuma**,
e a quinta tem uma — *"Testada de frente L1"*, 180,2 m, com os **dois extremos a
0,00 m da divisa**.

**Por que a distinção importa:** perguntar *"o motor seguiu esta linha?"* a uma
testada de frente **premiaria o defeito** — um motor que pusesse rua exatamente
sobre a divisa marcaria 100 % de aderência estando errado.

**O contrato v1 não faz essa distinção:** as duas chegam como
`atracoes[].tipo = "via_existente"`. Enquanto ele não ganhar dois tipos, a
separação por medição é **remendo, declarado como tal**, e o pedido está no §3 do
`CONTRATO_MOTOR_UNIFICADO_v1.md`.

## D65 · A porta única: o motor declara o que sabe fazer, e a declaração é falsificável · 19/09/2026

**A decisão:** `external-engines/esteira/src/porta/porta.ts` é a forma executável
do `docs/CONTRATO_MOTOR_UNIFICADO_v1.md`, e **todo campo de `Capacidades` tem um
experimento que o desmente** (`tests/porta.test.ts`).

**Por quê.** Capacidade que não se pode desmentir é propaganda. Numa tela com
vários motores lado a lado, o urbanista compara duas propostas supondo que os
dois motores receberam a mesma coisa — e o LAB-13 mediu que **três dos quatro
ignoram o relevo**, **os quatro ignoram a atração**, **um não parcela em lote** e
**outro precisa de conserto do Lab** para o contrato aceitar o arquivo. Nenhuma
dessas faltas estava declarada; todas foram descobertas medindo.

**O que se ganha:** um motor que declarar errado **quebra o teste**. O que se
perde: o contrato pergunta só o que alguém já pensou em perguntar — a declaração
pode estar completa e ainda assim ser omissa. Está escrito no §10 do documento.

## D66 · Motor que estoura derruba a tela: a porta proíbe exceção · 19/09/2026

**A decisão:** `gerar` **nunca lança exceção**. O que o motor não consegue fazer
volta como `Resultado` com `postura: "recusei"` e a razão escrita.

**Como apareceu.** O experimento do `leRelevo` roda a mesma gleba com e sem
curvas de nível. Sem elas, o Symbios **estourou**: *"tem 0 vértices cotados; o
mapa de alturas pede pelo menos 3"*.

**Não é defeito dele: é exigência** — e exigência não declarada, numa tela com
vários motores, é tela em branco na frente do urbanista. Pior: numa tela comum,
**motor que estoura derruba os outros junto**.

Virou duas coisas: o campo **`exigeRelevo`**, e a proibição de estourar, com
teste que a trava.

**As três posturas legítimas** quando o motor não sabe fazer algo — `recusei`,
`ignorei`, `substitui` — e a quarta, **ignorar em silêncio, é a única proibida**.

## D67 · O indicador de rampa se chama `rampaMediaMaxima_pct`, e o nome feio é proposital · 19/09/2026

**A decisão:** o indicador de greide da porta é a **maior rampa média** entre as
vias, não a rampa máxima — e o nome diz isso.

**Por quê.** O contrato v1 carrega `vias[].rampaMedia_pct` e **nada mais**;
`rampaMaxima_pct` existe só na ENTRADA, como o limite que o usuário pede.
**Nenhum motor consegue reportar o pico por este contrato** — e o pico é o que
reprova: o LAB-02 mediu **161 % num cruzamento**, diluído numa média mansa.

Chamá-lo de `rampaMaxima_pct` seria mentir no nome do campo. O nome feio **lembra
a falta** toda vez que alguém o lê, e o pedido de `rampaMaxima_pct` por via na
SAÍDA está no §6 do documento, com o número ao lado.

**Como apareceu:** o experimento do `calculaGreide` reprovou o Symbios, que é o
único dos quatro que mede greide. Medido antes de atribuir, o defeito era do
indicador — ele lia um campo que a saída não tem.

---

## D68 · A tela do parcelamento é a da família, no repositório do Generate, com vários motores sob ela · 20/09/2026

**A decisão é da família**, trazida pelo chat em 19/09 e reafirmada em 20/09.
Transcrita antes de interpretada, porque decisão de produto não é minha:

> A tela do Laboratório de Parcelamento vira **a interface de parcelamento da
> família**, dentro do **repositório do Generate**, com **vários motores rodando
> sob ela** — motor interno (V2), Laboratório de Parcelamento, Symbios e os que
> vierem. **Todos visíveis e ligados por padrão; motor padrão = o do Laboratório
> de Parcelamento; escolha do usuário salva; e só entra no ranking candidata
> aprovada pelo Validator** — reprovada aparece **com o motivo**, não com o
> resultado.

**O que o Lab já entregou para ela**, e está mesclado:

| o que a decisão pede | onde está |
|---|---|
| vários motores sob a mesma tela | a **porta única**, `CONTRATO_MOTOR_UNIFICADO_v1.md`, com os quatro motores a implementando (LAB-14) |
| saber o que cada motor faz | `Capacidades`, **falsificável por medição** (D65) |
| só entra no ranking quem o Validator aprova | §8 do documento, e a régua única do LAB-13 |
| base para comparar os motores | a tabela do **LAB-13**, cinco glebas, uma régua |

**O que a decisão pede e o contrato NÃO cobre**, de propósito (§10.4 dele:
*"nada aqui fala de tela"*):

- **o registro de motores** — a lista, quem está ligado, quem é o padrão;
- **a escolha do usuário salva** — é estado de usuário, e o Lab não tem conta
  nem tela (`ADOCAO_CENTRAL.md`);
- **como a reprovada aparece com o motivo** — o motivo o contrato já carrega
  (`naoAtendido` e o veredito do Validator); **como mostrar é da tela**.

**Onde isso vira prompt:** o **LAB-06** da fila original — *"entrega ao Generate:
peça pronta atrás do contrato de motor, registro de motores, botão liga/desliga
por motor, e o teste de que apagar o Lab inteiro não quebra o Generate"* — é
palavra por palavra o prompt de entrega desta decisão. Ele **nunca foi
executado** e está na fila como **proposto ao chat**, não executado: prompt fora
da fila não existe (CLAUDE.md §1-A).

**E a regra de ouro continua valendo (§3):** o Generate **nunca depende** do Lab.
`external-engines/` inteiro pode ser apagado sem que ele sinta — e é justamente
isso que o LAB-06 manda testar.

---

## D69 · Via desenhada à mão é intenção explícita: atravessa a APP, menos nascente · 20/09/2026

**Complemento à D61**, trazido pelo chat. Regra urbanística; transcrita antes de
interpretada:

> **Via desenhada à mão pelo usuário é INTENÇÃO EXPLÍCITA e vale sempre como
> atração** — atravessa a APP mesmo sem cumprir o critério dos 3× / 1,5 km,
> inclusive quando desenhada sozinha sobre a APP.
>
> **Exceções que não caem:** **nascente nunca** (raio de 50 m intocável), e a
> travessia continua sendo **a mais curta e perpendicular possível ao curso
> naquele ponto**.
>
> Na tela, a travessia desenhada aparece marcada como **"desenhada por você —
> exige licença ambiental"** e entra como **item de custo (ponte ou bueiro)** na
> saída para o Orçamento.

**O que ela muda na D61.** A D61 fez a travessia depender de o contorno ser
desproporcional. Agora há **duas portas**, e a segunda não depende de número:

| como a travessia nasce | precisa do critério? |
|---|---|
| o motor a propõe | **sim** — só se o contorno for desproporcional |
| **o usuário a desenhou** | **não** — o desenho é a decisão, e ela já foi tomada |

**A nascente é o piso, e não se negocia:** raio de **50 m** intocável, inclusive
contra desenho do usuário. É a única coisa que o desenho não vence.

---

### Três coisas que este registro precisa dizer, e nenhuma é interpretação minha

**1 · O critério "3× / 1,5 km" chegou POR REFERÊNCIA, não por declaração.** A
D61 registrou que o limiar de "desproporcional" **não tinha sido dado** e o
mandou para `PENDENCIAS_JONNY.md`, onde está desde 15/09. Esta mensagem o cita
como coisa sabida — *"sem cumprir o critério dos 3× / 1,5 km"* — mas ele **nunca
chegou ao Lab como decisão**. Fica gravado com a leitura mais direta possível:

> o contorno é desproporcional quando passa de **3 vezes** a travessia direta
> **ou** de **1,5 km** em valor absoluto.

**Se a intenção era outra, é corrigir aqui.** O item segue visível na lista do
Jonny até alguém confirmar, porque registrar por dedução e depois tratar como
decidido é como se perde uma regra.

**2 · `LAB-17` não existe.** A fila deste repositório foi de LAB-00 a LAB-08 e
pulou para LAB-13 e LAB-14; não há LAB-15, LAB-16 nem LAB-17. É o mesmo vão da
numeração que o LAB-09 a LAB-12 já tinha. A regra aqui é `CLAUDE.md` §1-A —
**prompt fora da fila não existe** —, então esta decisão está **gravada** e o
LAB-17 está **proposto na fila, não executado**.

**3 · A regra da nascente NÃO É CUMPRÍVEL hoje, por motor nenhum.** Medido:

| onde | a nascente existe? |
|---|---|
| `archilly-terreno` (o formato do Geo) | **sim** — `"nascente"` é categoria própria |
| importador do Generate (`restricoes-geo.ts`) | **sim** — `app_nascente`, com rótulo e uso próprios |
| **contrato de motor v1** | **NÃO** — o enum tem `app_hidrica`, `app_relevo` e `app_outra`, e a nascente é achatada em `app_hidrica` |

Ou seja: **a nascente chega ao motor indistinguível de qualquer outra APP
hídrica**. Um motor que quisesse obedecer ao "nascente nunca" não teria como
saber qual polígono é nascente — nem onde está o ponto dela, para medir os 50 m.

**É pedido ao Generate**, com número: `app_nascente` como tipo próprio no enum de
`restricoes` do contrato v1, e a geometria do **ponto** da nascente, não só do
polígono da APP. Sem isso, a exceção que o Jonny declarou como a mais dura de
todas é a única que o contrato não deixa cumprir.

**E some-se ao pedido que já estava aberto:** a D61 pede travessia
**perpendicular ao curso**, e o curso chega como **polígono de APP**, não como
linha d'água (`ONDE_PARAMOS`, achado para o Geo). Os dois pedidos são a mesma
falta: **o contrato v1 perde a hidrografia pelo caminho.**

---

## D70 · A peça de entrega vive FORA de `external-engines/` · 20/09/2026

**A decisão:** o registro de motores mora em
[`entrega/registro-de-motores/`](../entrega/registro-de-motores/), na raiz do
repositório, e **não** dentro de `external-engines/`.

**Por quê.** A regra de ouro (CLAUDE.md §3) diz que `external-engines/` inteiro
pode ser apagado sem que o Generate sinta. Uma peça de entrega guardada lá dentro
**sumiria junto com a pasta que a regra manda poder apagar** — e o LAB-06 existe
justamente para provar que apagar o Lab não quebra o Generate.

**E ela não importa nada:** nem `external-engines/`, nem `@symbios`, nem
`@testfit`, nem `@generate`, nem npm. Os tipos do contrato são **declarados
nela**, não importados. Um teste lê os `import` de cada arquivo e reprova quem
acrescentar um.

## D71 · O estado salvo guarda os motores DESLIGADOS, não os ligados · 20/09/2026

**A decisão:** `EstadoDoUsuario` é `{ desligados: string[]; padrao: string }`.

**Por quê.** Guardar os **ligados** parece natural e **perde informação**: um
motor fora da lista pode ser *"o usuário desligou"* ou *"não existia quando isto
foi salvo"*, e as duas coisas pedem respostas **opostas** — a primeira tem de ser
respeitada, a segunda tem de nascer ligada, pela D68.

Guardando os **desligados** a ambiguidade some: quem está na lista fica
desligado, quem não está fica ligado. **Motor novo nasce ligado sem ninguém
decidir nada**, e a escolha do usuário sobrevive à chegada dele.

**O que se perde:** a distinção entre "desligou e depois o motor sumiu" e "nunca
soube dele". Quem precisar dela salva as duas listas — é mudança do hospedeiro,
não da peça, e o motor que sumiu já volta em `esquecidos`.

## D72 · Ranking vazio nunca é silêncio, e a reprovada não carrega o desenho · 20/09/2026

**A decisão**, em três regras, e a terceira é a que ninguém pensa antes de perder
o usuário:

1. **Só entra no ranking quem o Validator aprova** — a régua do Generate, sem
   versão leve (D20);
2. **A reprovada leva o MOTIVO e NÃO leva o resultado.** O tipo
   `CandidataReprovada` **não tem** o campo do desenho: não é questão de lembrar
   de não mostrar. Mostrar geometria reprovada é convidar alguém a usá-la "só
   para ver", e o que se vê vira o que se aprova;
3. **Nunca um ranking vazio em silêncio.** Quando ninguém passa, a tela **diz
   isso** e mostra os motivos — e o recado distingue *"correram e todas
   reprovaram"*, *"está tudo desligado"* e *"não há motor instalado"*, que são
   três situações que não se parecem.

**E a peça não confia no contrato:** ela envolve cada geração e transforma
exceção em reprovação com o motivo. O contrato proíbe estourar (§7), mas isso
**já aconteceu** — o Symbios em gleba sem relevo (D66) —, e numa tela com vários
motores um que caia leva os outros junto.

**Consequência medida, e ela não é pequena:** em `ensaio-47ha`, o motor que a
D68 põe como **padrão** é justamente o que o Validator **reprova** (16 violações),
enquanto os outros três entram no ranking. A peça trata o caso sem quebrar; **o
que fazer a respeito é do chat e do Jonny**, e está proposto na fila.

---

## D73 · O traçado imposto das glebas de referência é geométrico, e de propósito · 20/09/2026

**Contexto:** o LAB-17 precisou de gleba **com via desenhada à mão**, porque
nenhuma das cinco do LAB-13 tem (D64), e é justamente o que a tela unificada
existe para comparar.

**Decisão:** o traçado das duas glebas de referência é **geométrico** — a
principal pelo meio do lado maior da caixa envolvente, `n` secundárias
perpendiculares igualmente espaçadas, todas aparadas para dentro da divisa. Ele
**não é projeto de urbanismo** e não tenta ser.

**Por quê:** a fixture existe para ser uma **imposição conhecida** contra a qual
se mede aderência. Um traçado "bonito", desenhado por mim com critério de
partido, seria **regra urbanística disfarçada de fixture** — e regra urbanística
é do Jonny, nunca escolha minha (CLAUDE.md §4). Além disso, um traçado que já
concordasse com a malha de algum motor premiaria esse motor por coincidência.

**Consequência:** as duas glebas ficam gravadas em
`docs/fixtures/glebas-com-via-desenhada/`, e quem quiser refazer a medição
precisa só do JSON, não da ferramenta.

---

## D74 · A regra dos 50 m da nascente fica ESCRITA e marcada como não aplicável · 20/09/2026

**Contexto:** a D69 manda que a nascente nunca seja vencida — 50 m intocáveis,
nem por via desenhada à mão. Medido no LAB-17: **o contrato de motor v1 achata
`app_nascente` em `app_hidrica`**, e não carrega nem o ponto da nascente nem a
linha do curso d'água.

**Decisão:** a regra fica **escrita no código** (`RAIO_DA_NASCENTE_M = 50`, em
`src/travessia.ts`) e **marcada como "não aplicável até o contrato trazer a
nascente"**. Ela sai declarada em `naoVerificado` **em toda aplicação da D69**,
com ou sem travessia. **Nenhuma aproximação é inventada.**

**Por quê:** as duas saídas erradas eram apagar a regra — e aí ela some do
sistema e ninguém a reimplanta quando o dado chegar — ou aproximá-la: *"a APP
mais redonda deve ser a nascente"*, *"o eixo do curso é o esqueleto do
polígono"*. A aproximação é **pior que não fazer**: daria um número em que
alguém confiaria para decidir sobre APP. `null` é "não medido" (D23), e o mesmo
vale para uma regra: "não verificável" é uma resposta, "provavelmente ok" não é.

**Consequência:** **nenhum motor da família consegue hoje cumprir a regra dos
50 m** — nem o interno do Generate. Isso é um pedido ao contrato, não um defeito
de motor, e está no §10.5 do `CONTRATO_MOTOR_UNIFICADO_v1.md`.

**Nota:** o critério dos **3× / 1,5 km** segue como decisão **do chat**, não do
Jonny, e está assim em `docs/PENDENCIAS_JONNY.md` até ele confirmar.

---

## D75 · A régua que separa via desenhada de testada de frente AMOSTRA a linha · 20/09/2026

**Contexto:** o contrato v1 chama as duas de `via_existente` (D64), e o Lab as
separa **por medição**: a que corre rente à divisa é testada de frente, a que
não corre é via desenhada à mão. A régua olhava a **mediana da distância dos
VÉRTICES** à divisa.

**Medido no LAB-17:** das quatro vias desenhadas em `antonina-com-via`, **três
foram para o balde errado**, e a gleba de uma testada de frente apareceu com
quatro. Uma via que **atravessa** a gleba tem as duas pontas na divisa — e só
tem duas pontas. Mediana de dois zeros é zero.

**Decisão:** a régua **amostra a linha de 5 em 5 m** e tira a mediana das
amostras, não dos vértices.

**Por quê:** a distinção que interessa é *"corre rente à divisa do começo ao
fim"* contra *"tem o miolo longe dela"*, e essa é uma propriedade do **traçado**,
não das pontas. Com amostragem, a testada de frente continua testada de frente e
a via que atravessa deixa de se disfarçar de uma.

**O que isso contamina:** os números de aderência da **primeira** passada do
LAB-17 foram descartados. **O LAB-13 não é afetado** — lá as cinco glebas
devolveram `null` ou testada de frente, e continuam devolvendo, porque nenhuma
delas tem via que atravesse.

**Quinto defeito do Lab** que a disciplina "medir antes de atribuir"
(CLAUDE.md §6) pegou antes de virar acusação ao motor de outro repositório.

---

## D76 · A forma sai nos TRÊS cortes, nunca num só · 20/09/2026

**Contexto:** a régua de forma publicava uma contagem só — os lotes que perdem
mais de **1 %** da caixa de menor área. O corte de 1 % é meu; ninguém o
escolheu.

**Medido:** ele manda no resultado. O Laboratório de Parcelamento em
`geo-antonina` tem **34** lotes acima de 1 %, **15** acima de 5 % e **zero**
acima de 10 %. Três respostas para a mesma pergunta, e a tabela mostrava a de um
corte arbitrário.

**Decisão:** a régua publica a **distribuição inteira** (mediana, p90, p99,
máxima) e a contagem nos **três cortes declarados** — 1 %, 5 % e 10 %.

**Por quê:** um número só esconde que a resposta depende do corte, e quem lê a
tabela não tem como saber disso. Qual corte separa lote bom de lote ruim é
**decisão de urbanismo**, e foi para `docs/PENDENCIAS_JONNY.md`. Escolher um
sozinho seria decidir urbanismo por omissão — o jeito mais silencioso de fazer
isso.

---

## D77 · A régua descreve a forma; ela não diz se a forma é boa · 20/09/2026

**Contexto:** a contagem se chamava `naoRetangulares`, e a tabela do LAB-13 a
mostrava na coluna "irregulares".

**Medido:** o que ela marcava **não eram lotes deformados**. Em `geo-antonina`,
o Laboratório de Parcelamento tem 1 347 retângulos, **30 trapézios** e 9
pentágonos; o Symbios tem 422 pentágonos, 236 hexágonos e 154 trapézios. São
lote de esquina, lote na curva, lote encostado na APP.

**Decisão:** a régua publica a **composição por forma** — quantos retângulos,
trapézios, pentágonos, polígonos de N lados — e **nenhuma dessas palavras é um
juízo**. Há teste que reprova quem acrescentar "irregular" ou "ruim" ao
vocabulário.

**Por quê:** um trapézio numa rua curva é um lote normal, e um retângulo de 4 m
de testada é pior que um trapézio de 12 m. Dizer qual é bom é decidir urbanismo,
e isso é do Jonny (CLAUDE.md §4). A régua mede; quem lê decide.

**Consequência na leitura do LAB-13:** "814 de 932 irregulares" no Symbios, lido
como "faz lote deformado", **está errado**. O Symbios faz lote **não-ortogonal**,
que é o que um traçado por campo tensor produz. A tabela não tinha o direito de
já ter respondido se isso é bom.

---

## D78 · O arco é um lado, e sai contado — não alisado em silêncio · 20/09/2026

**Contexto:** ao classificar as formas apareceram lotes com irregularidade de
**0,099** cujos quatro cantos davam **90,0°** — impossível, porque um retângulo
preenche a própria caixa.

**Medido antes de atribuir** (CLAUDE.md §6): o polígono tinha **49 vértices**.
Era um lote de **testada curva**, e a tolerância de colinearidade da primeira
classificação tinha achatado o arco numa reta. **A régua não estava errada; a
classificação estava.**

**Decisão:** os lados são formados juntando arestas **vizinhas** que viram menos
de 2° — assim o arco vira **um lado**, e não quarenta de meio grau — e o lado que
soma mais de 5° de giro sai marcado como **curvo**.

**Por quê:** o critério ingênuo, comparar cada aresta com a primeira do lado,
parte o arco em dezenas de lados e transforma todo lote de testada curva em
"polígono de 49 lados". O critério que alisa tudo faz o contrário: esconde o
arco e mente sobre a forma. Contar o arco é a única saída que não inventa nem
apaga.

**Medido, e é informação nova:** **101 lotes com lado curvo** na candidata
espinha em `completo`, 41 em `50ha-ondulado`, 31 em `ensaio-47ha`, 28 em
`geo-antonina`. A candidata ortogonal tem 3; o Laboratório de Parcelamento e o
Symbios, **zero** — eles não fazem testada em arco.

---

## D79 · A regra de forma do lote: útil < 85 % é "a conferir", < 70 % é "ruim" · 02/10/2026

**Quem decidiu:** o **chat**, em 02/10/2026, respondendo à pergunta que a D76
abriu de propósito.

**A regra, literal:** *"área útil abaixo de 85 % do retângulo envolvente = 'a
conferir'; abaixo de 70 % = 'ruim'"*. "Útil" é a área do lote dividida pela área
da **caixa de menor área em qualquer orientação** (D63); 85 % e 70 % são
inclusivos no lado bom — *abaixo de* 85 % é que vira "a conferir".

**Por que ela estava faltando:** o corte de 1 % que a régua usava era **meu**, sem
critério, e mandava no resultado — 34 ou zero lotes conforme o corte, na mesma
gleba (D76). Um corte escolhido por mim é decisão de urbanismo tomada por
omissão, o jeito mais silencioso de fazer isso.

**Como ela fica registrada:** valendo e aplicada, **e à vista em
`docs/PENDENCIAS_JONNY.md`** até o Jonny confirmar — o mesmo tratamento do "3× /
1,5 km" (D61). Por ordem do chat, **não trava nada**: o veredito sai nas
medições, o Jonny confirma quando puder.

**Escrita em ÚTIL, não em irregularidade.** O código guarda `UTIL_A_CONFERIR =
0,85` e `UTIL_RUIM = 0,70`, e não "irregularidade > 0,15". Traduzir obrigaria quem
confere a fazer a conta de cabeça, e é assim que limiar troca de lado.

**O que ela mede, medido:** ela **absolve** o que o corte de 1 % condenava — o
trapézio de 1 m de recuo em 30 preenche 96,7 % e passa a ser "ok". Em
`geo-antonina`, o Laboratório de Parcelamento vai de **34 marcados a zero**.

---

## D80 · A coluna de forma informa; ela não aprova nem reprova · 02/10/2026

**Contexto:** a tabela comparativa passou a ter "ok · a conferir · ruim". A
tentação óbvia é ligar isso no ranking da tela.

**Decisão:** **não.** Quem aprova candidata é o **Validator do Generate** (D20), e
forma de lote **não é violação dele**.

**Por quê, com a medida que prova:** as duas réguas não se parecem. O Laboratório
de Parcelamento em `sintetico-10ha-plano` tem **29 violações do Validator e zero
lotes "ruim"**; a candidata ortogonal em `geo-antonina` tem **1 violação e zero
"ruim"**; o Symbios em `completo` tem **1 violação e 382 lotes fora do "ok"**.
Somar as duas faria a tela reprovar por motivo que o Validator não deu — e o Lab
não tem Validator próprio, por decisão.

**Consequência:** a coluna é informação para quem lê, do mesmo naipe das
ressalvas ("não li o relevo", "ignorei a via que você desenhou"). Ela entra na
tabela e na página do Jonny; ela não entra na conta do ranking.

**Achado que a coluna revelou, e que a contagem antiga escondia:** a candidata
**espinha é bimodal** — tem **mais lotes "ruim" que "a conferir"** (35 contra 1 em
`completo`). Ela não faz lote levemente fora de esquadro: faz retângulo perfeito
ou desastre. São 0,5 a 5 % dos lotes, e a faixa do meio, que apanharia um erro
gradual, fica vazia.

---

## D81 · A página do Jonny é MARKDOWN, e isso foi medido · 02/10/2026

**Contexto:** o LAB-20 pediu *"uma página de tabela gerada em `docs/`"* para o
Jonny olhar **sem abrir terminal**. A escolha óbvia seria HTML.

**Decisão:** **Markdown.**

**Por quê:** o GitHub **renderiza Markdown no navegador** e mostra **HTML como
código-fonte**. Uma página `.html` no repositório daria ao Jonny uma tela de
`<table>` e `<td>` — exatamente o contrário do que o prompt pediu. E Markdown é o
meio que ele **já usa**: `PENDENCIAS_JONNY.md` é lido por link desde 14/09.

**O que fica proposto, não feito:** servir HTML de verdade exige **ligar o GitHub
Pages**, que é configuração de repositório. Está **proposto ao chat** na
`FILA.md`. Ligar por minha conta seria mexer na configuração do repositório sem
mandato.

**E isto não é interface** (CLAUDE.md §4): é arquivo de texto gerado por medição,
no `docs/`, sem servidor, sem botão e sem estado.

---

## D82 · Página de medição é gerada, e um teste a prende à medição · 02/10/2026

**Decisão:** a página de comparação é **gerada** por `ferramentas/lab20.ts`, e
`tests/pagina.test.ts` a **regera e reprova se o arquivo do repositório estiver
diferente**.

**Por quê:** tabela copiada à mão **envelhece em silêncio** — a medição muda, o
texto fica, e quem lê não tem como saber. É o pior defeito possível numa página
cujo propósito é ser a única coisa que uma pessoa vai ler.

**O precedente que fecha o argumento:** a regra do RECADO era só um texto no
CLAUDE.md, e **sete de oito recados passaram do teto** antes de alguém medir
(LF-FINAL-2). O que não é medido volta a acontecer, e este repositório inteiro é
sobre isso.

**O teste fixa também o que a página não pode perder:** os cinco terrenos, os
quatro motores em cada quadro, os dois limiares da régua de forma, o aviso de que
ela não aprova nada, a semente e o arquivo de provas — mais duas regras de casa:
**"Testfit" não aparece** (§5) e **a página não recomenda motor**.

---

## D83 · Queixa repetida se AGRUPA; ela não se reescreve · 02/10/2026

**Contexto:** a primeira versão da página saiu com dez linhas na seção *"o que o
motor não soube fazer"* do Laboratório de Parcelamento, cinco delas a **mesma
queixa com números diferentes** — *"1 de 20 variantes"*, *"13 de 20 variantes"*,
*"o Lab aparou 237.1 m"*, *"o Lab aparou 505.5 m"*…

**Decisão:** queixas iguais a menos de número viram **uma linha**, com os números
trocados por reticências e **em quantos dos cinco terrenos** ela apareceu. **A
frase continua sendo a do motor**, e a página declara isso: *"as frases são do
próprio motor, não minhas"*.

**Por quê as duas metades:** uma lista que o leitor desiste de ler não informa
nada, e esta é a página de quem não programa — então agrupar é obrigatório.
Mas **melhorar a redação da declaração de outro motor é pôr palavra na boca
dele**: o que ele declara não ter feito é dado dele, não meu, e reescrever
apagaria a diferença entre o que ele disse e o que eu entendi.

**O defeito dentro do conserto, pego em seguida:** tirar os números comeu `D51` e
`LAB-08`, que são **identificadores**, não medidas — e são o único ponteiro que a
frase dá para o relatório técnico. A régua passou a poupar o número precedido de
letra, dígito ou hífen. Há teste para os dois lados: o agrupamento acontece **e**
o identificador sobrevive.

---

## D84 · O limiar de "desvio desproporcional": 3× a distância direta OU 1,5 km a mais de percurso · 02/10/2026

**A decisão é do JONNY**, confirmada por ele e repassada pelo chat em 02/10/2026.
Ela fecha o **item 2 da D61**, que estava aberto desde 15/09 com a anotação *"o
limiar de desproporcional não foi dado, e não invento"*.

**A regra, transcrita antes de interpretada:**

> O caminho por fora da APP é desproporcional quando passa de **3× a distância
> direta**, **ou** quando acrescenta **1,5 km a mais de percurso**. Atingido um
> dos dois, a travessia deixa de ser proibida e passa a ser proposta — sempre
> como exceção, sempre a mais curta e perpendicular ao curso (D61), sempre
> declarada e lançada como item de custo.

**A ambiguidade que isto desfaz, e ela era real.** O número tinha chegado em
15/09 **de passagem**, numa frase sobre outro assunto — *"sem cumprir o critério
dos 3× / 1,5 km"* —, e `1,5 km` podia querer dizer duas coisas muito diferentes:

| leitura possível | o que significaria |
|---|---|
| **1,5 km A MAIS de percurso** (a certa) | a diferença entre contornar e atravessar |
| 1,5 km de percurso total | um teto absoluto, que em gleba grande dispararia sempre |

**O Jonny confirmou a primeira.** As duas leituras dão resultados opostos em
terreno grande, e é por isso que ela ficou **à vista e não deduzida** por dezessete
dias: regra que eu deduzi e passei a tratar como decidida é regra que se perde.

**São dois gatilhos em OU, não em E.** Um critério relativo (3×) e um absoluto
(1,5 km a mais). O relativo pega o terreno pequeno, onde contornar triplica um
trajeto curto; o absoluto pega o grande, onde 2,5× de um trajeto longo já é
quilômetro de rua a mais. Exigir os dois juntos deixaria os dois casos de fora.

**O que ela destrava:** a D61 §2 dizia *"sem ele, o motor não tem como decidir
sozinho: por ora, nenhuma travessia é proposta"*. **Agora tem.**

**O que ela NÃO destrava, e continua medido como não aplicável:** a travessia
**perpendicular ao curso** (D74) — o curso chega como polígono de APP, não como
linha —, e o **raio de 50 m da nascente** (D74), porque o contrato v1 achata
`app_nascente` em `app_hidrica`. O limiar chegou; o dado geométrico, não. E a
**via desenhada à mão continua atravessando sem precisar de limiar nenhum**
(D69): o desenho é a decisão.

**Sai da lista do Jonny** — marcado como resolvido, nunca apagado (CLAUDE.md §5).

---

## D85 · Despertador que existe para VIGIAR condição externa não se apaga · 02/10/2026

**Contexto:** a D62 manda apagar o despertador quando um disparo não acha item
pronto, e foi assim que o despertador de 02/10 se apagou: só restava o LAB-18,
aguardando o contrato v2 na `main` do Generate. Em seguida o chat escreveu: *"O
LAB-18 continua aguardando o contrato v2 na main do Generate; **reavalie a cada
despertador** e siga adiante."*

**Decisão do chat:** quando o que resta da fila é um prompt cuja condição é
**externa e verificável** — um arquivo que vai aparecer no repositório de outro
aplicativo —, **vigiar é o trabalho do disparo**, e o despertador fica.

**Por quê a D62 não cobre este caso.** Ela foi escrita contra o disparo que acorda
e **não tem nada que fazer** — medido: dos 7 disparos de 15/09, **4 foram à
toa**. Um disparo que confere a `main` do vizinho e grava o sha conferido **fez
algo**: é a diferença entre esperar e vigiar. A prova de que vigiar não é
desperdício está nesta rodada — entre 13h40 e 14h06 a `main` do Generate **andou**
(`dfa2a61` → `8223873`), e sem conferir eu não saberia que andou sem o contrato.

**O limite, para isto não virar desculpa:** o despertador-vigia **só vale
enquanto houver a condição externa nomeada**. Se o LAB-18 for cancelado, ou
executado, e a fila ficar vazia, a D62 volta a valer e ele se apaga. E a vigia
**custa**: cada disparo gasta sessão para gravar um sha. É aceitável porque o
chat pediu, e fica registrado que foi escolha, não inércia.

---

## D86 · O Lab espelha o alias interno do Generate · 02/10/2026

**Medido no LAB-18:** ao revendorizar o contrato v2, o `tsc` acusou dois erros —
`empreendimentos/types.ts: Cannot find module '@/lib/apontar'` e `'@/lib/funil'`.

**Não é defeito deles.** A cadeia é `engine/lot-rules.ts` →
`empreendimentos/types.ts`, e esse arquivo usa `@/`, que é o **alias interno do
Generate**. Um repositório tem o direito de usar o próprio alias no próprio
código; **quem lê por caminho é que tem de espelhá-lo** (D16).

**Decisão:** `"@/*": ["../../../urban-create-hub-41d93a4d/src/*"]` nos `paths` do
`tsconfig.json` da esteira — o **único** lugar do Lab que sabe onde os irmãos
ficam.

**Por que não contornar de outro jeito:** copiar os dois arquivos criaria a
segunda cópia envelhecendo em silêncio que a D16 proíbe; e `skipLibCheck` ou um
`// @ts-expect-error` apagariam um erro real do caminho de leitura.

---

## D87 · A esteira lê o contrato "2" E "1" · 02/10/2026

**Medido no LAB-18:** com o v2, **cinco testes ficaram vermelhos** com *"esta
esteira lê o contrato "1"; chegou versão "2""*. O exportador do Generate passou a
emitir `"2"` e `glebaParaOSymbios` exigia **igualdade exata**. Não era o contrato
novo recusando o Lab: era **o Lab recusando o contrato novo**, e o defeito estava
ali desde o LAB-08.

**Decisão:** `VERSOES_LIDAS = ["2", "1"]`, da mais nova para a mais velha. Versão
fora da lista continua estourando, e a mensagem diz quais ela lê — aceitar duas
não é aceitar qualquer uma.

**Por quê:** é a regra que o próprio Generate escreveu no contrato deles — *"quem
lê tem de aguentar o outro lado evoluir; o Laboratório e o Testfit vendorizam
este contrato e não se atualizam no mesmo dia que nós"*. O Lab deve a cortesia na
direção contrária: as fixtures em `docs/fixtures/` declaram `"1"` e são **prova de
medição antiga**. Refazê-las para caber na versão nova **falsificaria a prova**.

**E a ausência fica declarada, não suposta:** `FALTA_NA_V1` lista os cinco campos
que a v1 não carrega, com teste. Uma entrada v1 e uma v2 **não fizeram a mesma
prova**, e quem lê a medição tem de poder saber disso.

---

## D88 · A nascente e o eixo do curso: o bloqueio mudou de lugar · 02/10/2026

**O v2 entregou os dois campos** que a D74 pedia: `app_nascente` como tipo
próprio com o **ponto**, e `eixoDoCurso`.

**Medido:** **zero das sete glebas** preenche qualquer um dos dois — incluindo as
duas glebas-padrão **v2 do próprio Generate**. As três APP hídricas de
`geo-antonina` seguem genéricas e sem eixo.

**Decisão:** a regra dos 50 m e a travessia perpendicular continuam **escritas e
marcadas como não verificáveis**, e **nenhuma aproximação é inventada** — a razão
da D74 não mudou. Mas o **motivo** mudou, e a mudança vai escrita:

| antes | agora |
|---|---|
| impossível **por falta de contrato** | possível por contrato, impossível **por falta de dado** |
| achado para o **Generate** | achado para o **Geo** |

**Por que a distinção importa:** enquanto era falta de contrato, ninguém na
família podia cumprir a regra do Jonny — nem o motor interno. Agora **qualquer
motor poderia**, e o que falta é o levantamento declarar a nascente e o eixo. O
pedido muda de endereço, e endereço errado é pedido que não chega.

**E o que já não é trabalho do Lab:** o Generate implementou a regra inteira da
travessia (`b4c33cc`), com o limiar que o Jonny confirmou (D84). O Lab não a
reimplementa.

---

## D89 · Os dois indicadores de rampa ficam lado a lado · 02/10/2026

**Contexto:** o v2 trouxe `rampaMaxima_pct` por via, a pedido do Lab. A tentação
é trocar o indicador antigo pelo novo e apagar o nome feio que a D67 criou.

**Decisão:** os dois ficam — `rampaMediaMaxima_pct` (o máximo de um conjunto de
médias) e `rampaPior_pct` (a pior rampa de verdade).

**Por quê, com a medida:** porque **motor que só fala v1 preenche apenas o
primeiro**, e a diferença entre os dois **é informação, não ruído**:

| gleba | maior rampa média | pior rampa | fator |
|---|---:|---:|---:|
| `completo` | 24,23 % | **161,38 %** | 6,7× |
| `geo-antonina` | 10,97 % | **113,54 %** | 10,4× |
| `sintetico-10ha-plano` | 1,17 % | **15,44 %** | 13,2× |

Trocar um pelo outro faria o histórico mentir: as medições de LAB-02 a LAB-19
foram feitas com o primeiro, e um relatório antigo passaria a ser lido com régua
nova. **O nome feio continua feio de propósito** (D67), e agora tem um vizinho
honesto ao lado.

**`rampaPior_pct` sai `null` quando o motor não reporta o pico — e `null` não quer
dizer terreno plano** (D23). Medido: **só o Symbios reporta.** As duas candidatas
do Generate trazem o campo e o deixam `null`; o Laboratório de Parcelamento ainda
escreve saída v1.

**Nota sobre quem já media:** o Symbios **calculava a rampa máxima desde o
LAB-02**, em `recorte.ts`. Nunca foi falta de medir — era falta de onde escrever.

---

## D90 · Teste que fixava defeito alheio NÃO se apaga quando o defeito morre · 02/10/2026

**Medido no LAB-18:** dois testes do LAB-08 ficaram vermelhos **porque o defeito
que eles fixavam deixou de existir.** Eram os dois achados que o Lab mandou ao
Generate pelo chat, e o Generate consertou (`8fd954b [quadro-areas] GF-11`):

| o achado, como o Lab o reportou | agora |
|---|---|
| *"o quadro não fecha: soma 15,8 % mais terra do que o terreno tem"* | **fecha ao centavo** |
| *"declara 7 ha de APP num terreno que declara nenhuma — eco do parâmetro"* | **18 537,16 m² medidos** |

**Decisão:** os testes **não se apagam**; eles **viram do lado contrário**. O que
era *"não fecha"* passou a ser *"fecha ao centavo"*, e o cabeçalho conta a
história — o que o teste fixava antes, quem consertou, em que commit.

**Por quê:** apagar perderia a guarda **justamente no lugar onde o bug já esteve
uma vez**, e é onde já esteve que ele volta. E o cabeçalho é o que impede alguém,
daqui a seis meses, de ler o teste virado e achar que o Lab nunca encontrou nada
ali.

**Consequência boa:** é a primeira vez que a esteira do Lab pega um **conserto**
do vizinho em vez de um defeito. O ciclo fechou: o Lab mediu, reportou pelo chat,
eles consertaram, e a esteira viu o conserto **sem ninguém avisar**.

---

## D91 · Limite de rampa de VIA não existe na família, e eu não o invento · 03/10/2026

**Contexto:** o LAB-21 foi mandado medir *"quantos trechos e cruzamentos passam
dos limites legais de rampa"*.

**Procurado antes de medir qualquer coisa:**

| o que existe | onde | o que é |
|---|---|---|
| declividade máxima parcelável **30 %** | `normas/br.ts` do Generate, **Lei 6.766/1979, art. 3º, § único, III** | limite do **TERRENO** |
| uso restrito 25°–45°, APP acima de 45° | idem, Código Florestal | **TERRENO**, e em **grau** |
| limite de rampa de **VIA** | **nada** | — |

**Decisão:** o LAB-21 publica a **distribuição** e a contagem em quatro **cortes
de leitura** — 8 %, 15 %, 20 %, 30 % — em **trechos, metros de rua e
cruzamentos**. O de 30 % sai **sempre com o significado dele dito**. *"Qual é a
inclinação máxima de uma rua"* virou item do Jonny.

**Por que não usar os 30 % da lei como limite de rua:** porque é **outra coisa**.
Uma rua pode ser cortada numa encosta de 40 % e ter greide de 8 %; uma encosta
mansa pode receber uma rua mal resolvida. O próprio comentário da norma avisa que
misturar as unidades *"é erro silencioso"*. Usar o número da lei fora do lugar
seria inventar regra urbanística **e pôr o nome do Jonny nela** — pior que
inventar, porque vem com crachá.

**Medido, e é o que dá ao item do Jonny um porquê concreto:** em
`sintetico-10ha-plano` nenhum motor passa de 2 % e **nenhum corte acusa nada**;
em `completo` os quatro passam dos 30 % em algum trecho. Sem a linha dele, os dois
casos saem iguais: "números publicados, nenhum veredito".

---

## D92 · Duas réguas de rampa, nunca somadas · 03/10/2026

**Contexto:** só o Symbios declara `rampaMaxima_pct`. Uma tabela de rampa com
três colunas vazias não mede nada.

**Decisão:** o Lab passa a **medir a rampa por conta própria** — o eixo de cada
via amostrado sobre o relevo da gleba — e as duas saem **lado a lado**:

| quem mede | o que significa |
|---|---|
| o **motor** | *"eu calculei o greide e ele é este"* |
| o **Lab** | *"passei o eixo dele pelo relevo da gleba e deu isto"* |

**Por que as duas, e nunca a soma:** são respostas diferentes à mesma pergunta.
Um motor que não calcula greide pode ter traçado uma rua que o relevo reprova
**sem saber** — e foi exatamente o que apareceu: o Lab mede piores trechos de
**34,71 %** e **46,70 %** nas candidatas do Generate, que declaram `null`.

**E a diferença entre as duas é informação, não ruído** — foi ela que achou o
defeito da D94.

---

## D93 · A régua caminha a via por comprimento de arco, atravessando vértice · 03/10/2026

**Medido no LAB-21:** a primeira passada deu **1053,55 %** de pico. Três passos
para achar o culpado, e nenhum deles foi palpite:

1. **o mapa não consegue dar aquilo:** célula de 5 m e degrau máximo de **3,666 m**
   entre células vizinhas — por construção, nada acima de **73,3 %** sai dele;
2. **o trecho culpado:** `via-324`, segmento de **0,15 m**, 1,576 m de desnível;
3. **não era caso isolado:** as vias do Symbios em `completo` têm **5 353 de
   7 436 segmentos abaixo de 1 m**, mediana de **0,47 m**.

**Decisão:** a régua **caminha a via inteira por comprimento de arco**, em passos
iguais de `max(10 m, célula do mapa)`, **atravessando vértice sem parar nele**.

**Por quê:** **a densidade de vértices é escolha de quem desenhou, não
propriedade da rua.** Amostrar dentro de cada segmento mede a discretização do
motor. É a mesma lição do LAB-17 (D75), onde olhar vértice em vez de amostrar pôs
três de quatro vias desenhadas no balde errado — **segunda vez que o mesmo erro
de forma apareceu em régua diferente**, e por isso virou teste: a mesma via, em
duas discretizações, tem de dar o mesmo resultado.

**E o limite de resolução sai dito, não suposto:** `cotaEm` não interpola, então
a régua **não vê detalhe mais fino que a célula do mapa**. Dizer que vê seria
inventar resolução.

**Cruzamento, no mesmo pacote:** a primeira passada procurava nós nas **pontas**
e deu **zero cruzamentos** em quinze vias — numa grade, as ruas se cruzam **no
meio**. Agora é **interseção de eixos**, com teste da malha 3 × 3 devolvendo nove.

---

## D94 · Os 161,38 % do LAB-18 são artefato, e a correção vai com nome · 03/10/2026

**O que foi medido:** com a régua consertada, o declarado e o medido divergem nas
**cinco** glebas, na mesma direção:

| gleba | o Symbios **declara** | o Lab **mede** | fator |
|---|---:|---:|---:|
| `completo` | **161,38 %** | **41,84 %** | 3,9× |
| `geo-antonina` | 113,54 % | 27,73 % | 4,1× |
| `sintetico-10ha-plano` | **15,44 %** | **1,96 %** | **7,9×** |

**A prova mais limpa é a última:** `sintetico-10ha-plano` é praticamente plana. Não
há 15 % de rampa num terreno plano; há 15 % entre dois pontos a 20 cm um do outro.

**A causa, nomeada:** `refazerMedidas`, em `recorte.ts` do adaptador do Symbios,
calcula `rampaMaxima_pct` como o máximo de `|Δcota| / d` **entre vértices
consecutivos**. Com mediana de 0,47 m, mede o degrau da grade de relevo.

**O que esta decisão corrige, e de quem é a culpa — minha:**

- o **LAB-02** mediu *"um pico de 161 % num cruzamento"*. O número existe; **como
  rampa de rua, não**;
- a **D67** fica **meio certa**: a metade sobre a média diluir o pico **continua
  verdadeira**, e a tabela do LAB-21 a prova (em `completo`, as quatro médias
  empatam entre 6,1 % e 7,7 % e os piores trechos vão de 34,7 % a 51,5 %). A
  metade que citava os 161 % como medida de rua **estava errada**;
- o **LAB-18** repassou os 161 % ao chat como conquista do v2. **O ganho do v2 é
  real** — ter onde carregar o pico —, mas **o primeiro valor que viajou é
  artefato**, e o chat agiu sobre ele.

**Por que a correção fica escrita assim, com nome:** porque o número saiu daqui,
foi para o chat e voltou como prompt. Corrigir em silêncio deixaria a família
decidindo sobre 161 % por mais uma rodada. A disciplina do §6 serve para o
motor do vizinho **e para o meu próprio número de ontem**.

**O que NÃO está corrigido, e também vai dito:** a régua do Lab anda de 10 em
10 m sobre grade de 5 m, então **não vê um trecho curtíssimo genuinamente
íngreme**. As duas réguas têm limite; a do motor mede numa escala onde a pergunta
não faz sentido, a do Lab mede na escala em que greide se define para
terraplenagem.

---

## D95 · 30 % é do LOTE e reprova; 15 % é da RUA e só avisa · 03/10/2026

**A decisão é do JONNY**, repassada pelo chat em 03/10/2026. Ela fecha a **D91**,
que deixara a pergunta aberta de propósito.

| o quê | limite | força | fonte |
|---|---|---|---|
| **LOTE** | **30 %** de declividade do terreno | **REPROVA** | Lei 6.766/1979, art. 3º — e ele confirmou que é do **lote** |
| **RUA** | **15 %** de rampa | **só AVISA** | prática dele |

**A razão da assimetria, nas palavras dele:** *"trecho acima pode ser resolvido
com terraplenagem ou com mudança de traçado, e isso é decisão de projeto com
custo, que o motor não toma"*.

**A precisão que isto acrescenta à D91:** eu havia registrado os 30 % como
limite "do TERRENO", de forma vaga, e usara essa vagueza para **não** aplicá-los.
Estava certo em não aplicar sem saber, e **errado na leitura**: são do **lote**,
e portanto aplicáveis — ao lote. O número da rua simplesmente não existia na
família, e agora existe, **de outra natureza**: um é lei, o outro é ofício.

**O que mudou no código, e é a parte que importa:** a régua da rua **não ganhou
veredito nenhum**. Há teste que reprova se alguém acrescentar `reprova`, `passa`
ou `aprovado` ao bloco da via. `lote.reprovaPelaLei` é o **único** veredito do
bloco inteiro.

**Medido com a regra nova:** **os quatro motores reprovam** em `completo` — 95,
113, 67 e 49 lotes com parte acima de 30 % —, e em nenhuma outra gleba.

---

## D96 · "Parte acima" e "principalmente acima" saem os dois · 03/10/2026

**Contexto:** a lei não tem faixa de tolerância — lote com **qualquer** parte
acima de 30 % reprova. Mas um lote que encosta num talude por 2 m² não é o mesmo
problema que um lote inteiro na encosta.

**Decisão:** saem **os dois** — `lotesComParteAcima` e
`lotesPrincipalmenteAcima` (mais de metade da área).

**Medido, e a diferença é enorme:** em `completo`, **95 contra 3**, **113 contra
3**, **67 contra 1**, **49 contra 2**. **Quase tudo é borda.**

**Por que os dois, e nunca um só:** publicar apenas o primeiro faria parecer que
há uma centena de lotes inviáveis onde há três; publicar apenas o segundo
**esconderia a reprovação legal**, que não liga para fração. O veredito segue o
primeiro, porque é o que a lei diz; a leitura de projeto precisa do segundo.

---

## D97 · O bloco entrega a ENTRADA do cálculo de terraplenagem, não o volume · 03/10/2026

**Contexto:** o chat pediu os números *"num formato que o Generate possa mostrar
na tela e o Orçamento possa ler como entrada de custo"*.

**Decisão:** o bloco entrega **metros lineares e metros quadrados sujeitos a
terraplenagem**, e **declara, no próprio formato proposto, que não é volume de
corte e aterro**.

**Por quê:** volume pede o **greide projetado** — a cota que a rua vai ter depois
da obra — e **nenhum motor da família entrega isso**. Com a cota natural e o eixo
só se sabe **onde** vai haver movimento de terra e **quanto de área**, não quantos
metros cúbicos.

**É o mal-entendido mais caro possível neste caminho:** um orçamento que lesse
`areaAcimaDoLimite_m2` como volume erraria por um fator que depende da altura de
corte — e ninguém notaria, porque o número tem a cara certa. Por isso a ressalva
não fica só no relatório: ela viaja **dentro do JSON**, em `regras`.

**E a proposta leva exemplo preenchido**, não só esquema: formato sem instância é
convite a interpretar errado, e quem for implementar do outro lado não tem como
perguntar.

---

## D98 · A ponte do Lab descartava uma medição do motor, e a frase que a justificava tinha vencido · 03/10/2026

**Medido no LAB-22, antes de escrever o relatório que acusaria o vizinho:**

| onde | o que está lá |
|---|---|
| `motor-testfit/src/lib/lab/relevo.ts` | `rampaDaVia` devolve **média e máxima**, desde o **T03 dele, de 14/09/2026** |
| `motor-testfit/.../motor.ts:245` | preenche **as duas** em cada via do `Plano` |
| `external-engines/testfit/adapter/src/volta.ts:131` | **`rampaMedia_pct: null`**, *"porque o motor não calcula greide"* |

**A frase do meu adaptador era verdadeira no LAB-07 e deixou de ser no dia
seguinte.** Ficou **três semanas**, e no LAB-18 eu a repassei ao chat como fato
sobre o vizinho: *"o Parcelamento ainda escreve v1 e não reporta o pico"*.

**Decisão:** a ponte lê `rampaMedia_pct` e `rampaMaxima_pct` do plano e escreve
saída **v2**. E a perda declarada **muda de dono**: onde dizia *"o motor não
calcula greide"*, agora diz *"sem cota na ENTRADA ele devolve `null`, que é a
resposta certa; a falta é da gleba, não do motor"*.

**Terceira vez que a disciplina do §6 me pega, e as três no mesmo ponto cego:**
D75 (vértices em vez de amostras), D93/D94 (o mesmo erro em régua diferente) e
esta. **Nas três eu estava a um passo de acusar o motor de outro repositório.**

**O que isto ensina sobre a forma, e não só sobre o caso:** uma justificativa
escrita num comentário **não se revalida sozinha**. Quando a razão de um `null`
é *"o outro lado não faz"*, ela é uma afirmação **sobre código que muda** — e
precisa de teste, não de comentário.

---

## D99 · Os dois motores que reportam rampa reportam errado, em direções opostas · 03/10/2026

**Medido, com a mesma régua, nos dois:**

| motor | método | passo efetivo | erro |
|---|---|---|---|
| **Symbios** (adaptador do Lab) | vértice a vértice | **0,47 m** de mediana | **superestima 2,5× a 7,9×** |
| **Parcelamento** (motor) | `AMOSTRAS_POR_VIA = 12`, fixo | **83 a 157 m** | **subestima ~3×** |

A célula do modelo de relevo é de **5 m**. Um mede **um décimo** dela; o outro,
**17 a 31 vezes** ela.

| gleba | Parcelamento declara | o Lab mede |
|---|---:|---:|
| `completo` | **16,84 %** | **51,54 %** |
| `sintetico-50ha-ondulado` | 10,15 % | 18,79 % |

**A regra que sai disso, e vale para os quatro:** o passo da rampa deve ser dado
**em metros** e **não exceder a célula do modelo de relevo** — nem contagem fixa
por via, que faz a média do morro, nem vértice a vértice, que mede a grade. E o
eixo deve ser **caminhado por comprimento de arco**, atravessando vértices.

**Por que isto é a melhor justificativa que a D92 podia receber:** **nenhum dos
dois erros é visível sem uma segunda régua**, e os dois têm a cara de um número
certo. Duas réguas lado a lado, nunca somadas, não é redundância — é a única
forma de pegar este tipo de erro.

---

## D100 · `leRelevo` partida em duas: ler o relevo e desviar por ele não são a mesma coisa · 03/10/2026

**Contexto:** ao consertar a declaração do Parcelamento, **três testes de
falsificação do LAB-14 ficaram vermelhos** — e isso é o teste funcionando. O
motor declarava `calculaGreide: false` e `leRelevo: false`; as duas eram verdade
em 13/09 e **passaram a ser mentira em 14/09, porque o motor melhorou**. Ninguém
mexeu na declaração: ela apodreceu no lugar.

**O conflito que o campo único escondia:**

| pergunta | o Parcelamento |
|---|---|
| o relevo muda a **SAÍDA**? | **sim** — mede a rampa de cada via |
| o relevo muda o **TRAÇADO**? | **não** — LAB-08, lote a lote: 599 e 599, 1 391 e 1 391 |

O doc do `leRelevo` perguntava *"o traçado muda?"* e o teste comparava **a saída
inteira**. **Até aqui isso nunca importou**, porque nos motores de antes as duas
coisas andavam juntas. O Parcelamento é o primeiro em que **não andam**, e com um
campo só **uma das duas verdades teria de virar mentira**.

**Decisão:** duas capacidades, **cada uma com o seu teste de falsificação**:

- **`leRelevo`** — o relevo muda a SAÍDA, qualquer parte dela;
- **`relevoMudaOTracado`** — o relevo muda a GEOMETRIA: eixos, quadras, lotes. O
  teste compara a saída **descartando os campos de rampa**.

**Por que a distinção importa ao urbanista, e não é burocracia:** um motor que
**mede** a rampa e **não desvia** por ela **informa**, mas **não projeta com o
terreno**. Quem escolhe motor precisa saber de qual dos dois se trata — e hoje,
dos quatro, só o Symbios desvia.

---

## D101 · Declaração de capacidade se prova por DIFERENÇA, não por palavra · 03/10/2026

> **⚠ CORRIGIDA EM 03/10/2026 PELO LAB-30 (ver D119).** O princípio desta decisão
> está certo e vale mais do que nunca — **declaração se prova por diferença**. A
> aplicação dela aqui estava errada: a SAÍDA do Laboratório de Parcelamento saía
> idêntica com e sem a via porque **a ida do Lab nunca entregava a via ao motor**.
> Prova verdadeira, conclusão falsa. **Leia "os quatro" como "três dos quatro".**
>
> E a lição que a correção acrescenta ao princípio: **prova por diferença só vale se
> a diferença chegou ao motor.** Comparar duas saídas de uma entrada que não mudou do
> lado de dentro mede a ponte, não o motor.

**Contexto:** o LAB-17 mediu que os quatro motores **declaram**
`respeitaViaDesenhada: false`. Declaração é promessa.

**Decisão:** a prova é **rodar a mesma gleba com e sem a via desenhada no
arquivo e comparar a SAÍDA byte a byte**. Medido: **idêntica nos oito casos** —
duas glebas, quatro motores. A declaração dos quatro é honesta.

**Por que o teste fica, e é o que importa:** se algum dia um motor passar a
respeitar a via, **este teste morde antes de qualquer relatório sair errado**. É
o mesmo princípio da D100 — a declaração que apodreceu no lugar só foi pega
porque havia experimento, não porque alguém releu o comentário.

**E o controle é cirúrgico, também testado:** tirar as vias desenhadas **não
tira a testada de frente** de `antonina-com-via`. Ela não é via desenhada (D64),
e apagá-la faria a comparação medir duas coisas ao mesmo tempo.

---

## D102 · Quando o resultado depende da gleba, as DUAS pontas vão para o teste · 03/10/2026

**Medido no LAB-23**, comparando a linha desenhada com as vias de cada motor pela
mesma régua de rampa:

| gleba | a linha desenhada | os quatro motores |
|---|---|---|
| `antonina-com-via` (real) | pior trecho **12,62 %**, **zero** metros acima de 15 % | 17,09 % a 27,73 % |
| `ensaio-com-via` (sintético) | pior trecho **30,91 %** | 17,56 % a 22,90 % |

**Ela ganha numa gleba e perde na outra.**

**Decisão:** **as duas pontas vão para teste**, não só a que confirma a leitura
do relatório. Um teste que fixasse só *"a linha desenhada é melhor"* deixaria a
conclusão sobreviver a uma medição que a contradiz — e a conclusão é o que o
leitor leva.

**É a forma geral do que a D90 fez num caso particular:** teste guarda o que foi
medido, inclusive o que incomoda. Resultado que depende do caso **tem de ter o
caso no teste.**

---

## D103 · A linha "desenhada à mão" das fixtures não é de urbanista, e a conclusão muda com isso · 03/10/2026

**Contexto:** o LAB-23 mediu que, em `antonina-com-via`, a linha desenhada fica
melhor assentada no terreno que as vias dos quatro motores. A leitura tentadora é
*"a mão do urbanista vence a máquina"*.

**Ela está errada**, e a razão está na **D73**: o traçado das duas glebas de
referência é **geométrico** — principal pelo meio do lado maior da caixa,
secundárias perpendiculares — e existe para ser **imposição conhecida**, não bom
partido. **Quem o desenhou fui eu.**

**Decisão:** a conclusão fica escrita na forma modesta e verdadeira:

> Em `antonina-com-via`, **uma reta escolhida pela geometria da gleba — sem olhar
> o relevo** — ficou melhor assentada que as vias dos quatro motores.

**E assim ela vale mais, não menos:** é um resultado **sobre os motores**. Se uma
reta geométrica cega bate os quatro no pior trecho, **os quatro não usam o relevo
para escolher por onde a rua passa** — o que a D100 mediu por outro caminho, ao
achar que **só o Symbios desvia pelo relevo**, e mesmo ele perde aqui.

**O que falta para fechar a pergunta de verdade:** uma via desenhada **por
pessoa**, numa gleba real. Vai à fila como proposto ao chat — **o Lab não inventa
partido urbanístico** (CLAUDE.md §4), e inventar um "bom traçado" para depois
elogiá-lo seria inventar duas vezes.

---

## D104 · A quarta vez do mesmo ponto cego, e quem a achou foi a guarda · 03/10/2026

**O LAB-25 pediu a guarda que impede a quarta vez.** Ela ficou pronta, rodou uma
vez, e **achou a quarta vez na mesma hora**: a ponte do Laboratório de
Parcelamento escrevia `faceDeRua: null` em **110 de 110 lotes**, com o comentário

> *"o motor sabe a testada mas não guarda de QUAL via ela é frente"*

O motor guarda **desde o T02 dele** (`face.ts`), e a tradução dele mesmo escreve
exatamente isto (`contrato/traducao.ts:453`). O comentário não envelheceu
sozinho: ele foi escrito **antes** do T02 e nunca mais foi conferido. É a mesma
forma do **D98**, e a quarta da família da §6:

| quando | o que eu ia dizer | o que era |
|---|---|---|
| D18 (LAB-07) | "441 de 441 lotes sem frente" | distância medida errado pelo adaptador |
| D75 (LAB-17) | "o motor erra a classe da via desenhada" | a régua media vértice, não linha |
| D93/D94 (LAB-21) | "o motor entrega rampa de 161 %" | a régua media dentro do segmento |
| D98 (LAB-22) | "o Parcelamento não reporta o pico" | a ponte do Lab jogava a medição fora |
| **D104 (LAB-25)** | *(nada — eu não vi)* | **a ponte jogava a via de frente fora** |

**Decisão:** a ponte traduz o índice do motor no id da via (`i` → `V<i+1>`, a
mesma numeração que ela escreve nas vias), e índice fora da lista sai `null` —
porque o esquema do Generate **recusa o arquivo inteiro** quando um lote faz
frente para via que não está nele, e um id inventado é pior que um campo
incompleto.

**O que ela comprou, medido — e é pouco, e está dito:** o Generate **não acredita**
no `faceDeRua` que recebe de fora. O `paraResultado` dele o descarta e o
`paraSaida` o recalcula com a régua do invariante. Regerando a tabela do LAB-19
inteira depois do conserto, **nenhum número medido mudou** — só o tempo de parede.
Então o conserto **não compra ponto no Judge**: ele conserta a honestidade do Lab
e serve quem lê o campo (tela, exportação, Orçamento). Dizer que melhorou a
comparação seria vender ganho que não houve.

**E o número descartado era bom:** posto contra a régua independente do Generate
nas cinco glebas, ele concorda em **91,5 % a 99,8 %** dos lotes. As duas réguas
são diferentes de propósito — a do motor é *um dos dois lados do comprimento da
testada*, a do Generate é *a faixa de leito mais perto de qualquer vértice* —, e
num lote de esquina as duas estão certas escolhendo ruas diferentes.

---

## D105 · A justificativa de uma perda sai do comentário e vira inventário conferido · 03/10/2026

**O problema não é o comentário errado; é que comentário não se revalida.** O do
D98 era verdadeiro no dia em que foi escrito. O do D104 também. Os dois ficaram
falsos por um movimento do vizinho, e nenhum teste podia saber.

**Decisão:** cada campo que um motor publica tem destino escrito em
`external-engines/esteira/src/inventario-das-pontes.ts` — **atravessa**,
**traduzido**, **perda declarada** ou **mecânica interna** —, e
`guarda-da-ponte.ts` confere o inventário **contra o motor rodando**, com três
regras:

| regra | o que pega | reprova? |
|---|---|---|
| `campo-vazio` | SAÍDA sai `null` e o motor publica valor na MESMA linha | **sim** |
| `campo-novo` | o motor publica campo que o inventário não conhece | **sim** |
| `mapa-velho` | inventário descreve campo que nenhuma amostra traz | não — avisa |

**A `campo-vazio` não acredita no inventário.** O casamento é por **nome**, lido
do objeto que o motor devolveu: uma ponte que declarasse a perda com motivo
bonito seria pega igual. Era literalmente o caso do D98, e o teste prova isso com
um inventário que mente de propósito.

**A `mapa-velho` avisa e não reprova, de propósito.** Campo opcional (`travado`,
`externo`, `conteudo`) falta legitimamente numa gleba e aparece noutra. Guarda que
grita por isso é guarda que se aprende a desligar — e a utilidade inteira desta
depende de ela nunca gritar sem razão.

**Regra escrita no `CLAUDE.md` §4**, que é onde moram as coisas que este
repositório nunca faz.

---

## D106 · A guarda prova que sabe ficar VERMELHA · 03/10/2026

Um teste que só ficou verde nunca provou nada. Três testes do andar 2 de
`tests/guarda-da-ponte.test.ts` **sabotam a ponte de propósito** e exigem o
achado: escrever `null` na rampa que o motor mede (o D98 reencenado), escrever
`null` no `faceDeRua` (o D104 reencenado) e **apagar uma entrada do inventário**
(que tem de virar `campo-novo`).

**Por que isto é decisão e não zelo:** a guarda inteira é uma afirmação sobre o
futuro — *"se a ponte descartar, isto reprova"*. Essa afirmação é tão falsificável
quanto as capacidades do LAB-14, e merece o mesmo tratamento que a D101 deu às
declarações de motor: **prova por diferença, não por palavra.**

---

## D107 · Encher `faceDeRua` obriga o aparo a apagar o que ficou órfão · 03/10/2026

Consequência que só existe **porque** o campo deixou de ser `null`: o aparo do Lab
(`aparo.ts`) descarta a via que cai inteiramente fora da gleba, e um lote podia
ficar apontando para via que **não está mais no arquivo** — o esquema do Generate
recusa o desenho inteiro nesse caso.

**Decisão:** o aparo volta esse `faceDeRua` para `null` e **conta** em
`facesApagadas`. As três saídas possíveis, e por que as outras duas são piores:

1. **apagar e contar** — perde informação, e a perda está medida. É esta;
2. **deixar o id morto** — o Generate recusa o arquivo inteiro. Pior;
3. **apontar para a via sobrevivente mais próxima** — o Lab inventando frente que
   o motor não mediu. Muito pior.

O cabeçalho do `aparo.ts` dizia *"só as vias são tocadas; lote, quadra e área
especial saem exatamente como o motor os desenhou"*. **Ficou falso com este
conserto, e foi corrigido no mesmo commit** — que é exatamente a disciplina que a
D105 criou. Medido: na gleba inteira, `facesApagadas = 0`; numa gleba minúscula de
teste, que descarta quase toda a rede, ele apaga e a conta aparece.

---

## D108 · A frase "o teste falsifica todos" era prosa, e três campos não tinham experimento · 03/10/2026

O `porta.ts` do LAB-14 afirma, no alto:

> *"Cada campo é falsificável, e o `tests/porta.test.ts` falsifica todos."*

**A segunda metade era falsa.** Dos 15 campos de `Capacidades`, **três não tinham
experimento nenhum**: `respeitaAcesso`, `geometrias` e `versao`. E a declaração
errada estava **justamente num deles** — ver a D109.

É o mesmo defeito que o LAB-25 tirou dos comentários da ponte, **uma camada
acima**: uma afirmação sobre o futuro morando em prosa. Lá era *"o motor não
calcula greide"*; aqui era *"o teste falsifica todos"*. Nenhuma das duas se
revalida.

**Decisão:** `src/porta/experimentos.ts` dá a cada campo de `Capacidades` uma
cobertura escrita — `falsificavel` (com o **nome do teste**), `conferido` ou
`sem-regua` (com a razão) —, e **dois testes de varredura** sustentam a frase:

| teste | o que ele impede |
|---|---|
| **cobertura** | campo novo na porta sem experimento — reprova no mesmo dia |
| **existência** | nome citado no registro que não existe no arquivo de teste |

A segunda é a que dá peso à primeira: sem ela, o registro seria mais uma lista
afirmando coisas sobre um arquivo que ela não lê. Contagem publicada e **testada**:
**13 falsificáveis, 1 conferido (`id`), 1 sem régua (`nome`)**.

**O que `sem-regua` não é:** porta de fuga. É para campo em que não há o que
medir, com a razão escrita — `nome` é rótulo de tela, escolhido pelo Lab. Pôr
capacidade de motor ali seria calar o teste, e o registro diz isso.

---

## D109 · `respeitaAcesso` não tinha experimento, e era onde a mentira estava · 03/10/2026

O Laboratório de Parcelamento declarava `respeitaAcesso: false`. **Medido, muda
tudo:** movendo o ponto de acesso entre os dois vértices mais distantes do anel,

| gleba | distância | lotes |
|---|---:|---|
| `ensaio-47ha` | 992,6 m | **703 → 603** (−14 %) |
| `geo-antonina` | 2 255,3 m | **1 454 → 1 393** |
| `sintetico-10ha-plano` | 504,5 m | **112 → 138** (+23 %) |

A ida deste adaptador **passa o acesso** ao motor (`Terreno.acesso`, `ida.ts`,
desde o LAB-07) e o motor parte dali. A declaração era do **Lab**, não do motor.

**Decisão:** `respeitaAcesso: true` para ele, e o experimento fica. O Symbios
continua `false`, e agora **provado**: geometria byte a byte idêntica, 214 lotes
nas duas posições — ele não recebe ponto de acesso, e a ida já declarava a perda.

**O que isto diz sobre a porta, e é o argumento dela inteiro numa linha:** dos
quinze campos, o único com declaração falsa era um dos três sem experimento. Não é
coincidência — **campo sem experimento é campo que ninguém conferiu.**

**E um achado de tamanho, para quem for ler a tabela comparativa:** mover o acesso
mexe no resultado mais do que qualquer outra entrada que o Lab mede — a candidata
ortogonal do Generate vai de **1 723 a 1 390 lotes** em `geo-antonina`, 19 % de
diferença. As glebas da tabela declaram **um** acesso, e nenhuma mede a
sensibilidade a ele. Vai à fila como **proposto ao chat**.

---

## D110 · "Testes verdes" era meia verdade: a segunda suíte estava vermelha há duas semanas · 03/10/2026

**O pior achado do LAB-26, e ele não é sobre capacidade nenhuma.** O repositório
tem **dois** pacotes, de propósito (D14, D17): `esteira` e `testfit`. Todo
relatório meu dizia *"testes verdes"* rodando **só o primeiro**.

A suíte do `testfit` estava **vermelha, 14 de 14**. A causa, medida e atribuída
corretamente: as glebas-padrão que ela carrega vêm do repositório do Generate, e
elas **viraram v2** quando ele publicou o contrato v2 (commit `5b70e5f`, *"as três
coisas que o Laboratório pediu"*). O `ida.ts` do adaptador gateava
`versao !== "1"` e passou a recusar a própria fixture.

**Não é defeito do vizinho** — eles são donos do contrato, e o leitor deles é
assimétrico de propósito. É o **gêmeo exato do D87**: o LAB-18 alargou este mesmo
portão em `esteira/src/gleba-v1.ts` e **não alargou o do `testfit`**. Portão em
duas terras envelhece numa delas, a frase que o `CLAUDE.md` §1-A já diz sobre o id
do despertador.

**E a parte que dói:** dois dos 14 testes vermelhos eram **as travas das minhas
próprias correções**. Um exigia `saida.archilly.versao === "1"` — o LAB-22 passou a
escrever v2. O outro chamava-se *"nada é inventado: faceDeRua e rampa saem nulos"*
e exigia os dois `null` — eram o D98 e o D104. **Se a suíte estivesse rodando, ela
teria mordido nas duas ocasiões.** A suíte invisível silenciou os próprios alarmes.

**Decisão, em três partes:**

1. **o portão alargado** para `["2","1"]`, com a razão escrita no código: os campos
   do v2 são **adições**, e o que a ida não conhece ela já declara como perda;
2. **os três testes virados, não apagados** (D90), com a história no cabeçalho de
   cada um — inclusive o *"nada é inventado"*, que **continua valendo** e passou a
   medir a coisa certa: o que a ponte publica tem de vir do motor, e o `null` do
   motor continua `null`;
3. **`external-engines/conferir.sh`** roda `typecheck`, `lint` e `test` dos **dois**
   pacotes e falha se qualquer um falhar. *"Testes verdes"* passa a significar
   isto, e o `CLAUDE.md` §7 diz qual é o comando.

**O `@/*` também faltava aqui** (gêmeo do D86): o `tsconfig.json` do `testfit` não
espelhava o alias interno do Generate, e o `tsc` dele acusava dois erros dentro do
repositório deles. Três coisas alargadas numa terra e não na outra, no mesmo
prompt.

---

## D111 · O LAB-27 é contínuo, e "contínuo" não é licença para o despertador viver para sempre · 03/10/2026

O LAB-27 — *"manter o `O_QUE_FALTA_MEDIR_POR_MOTOR.md` atualizado e avisar quando
mudar"* — é o único item que sobrou da fila de 03/10, e ele **não acaba**. Isso cria
um risco de leitura: um despertador que acorda, declara *"o LAB-27 está pronto"*,
não acha nada para fazer e se mantém vivo — exatamente o desperdício que a D62
mediu (4 dos 7 disparos de 15/09 sem o que fazer).

**Decisão, escrita na fila para o próximo que acordar:**

> **O LAB-27 só é item pronto quando há mudança para carregar.** Quando o
> documento não precisa mudar, **não há item pronto** — vale a D62: gravar o
> recado, escrever o motivo em `ONDE_PARAMOS` e **apagar o despertador**.

**Neste disparo havia mudança**, e é por isso que ele foi executado: o LAB-26
produziu dois achados que são **sobre o motor do vizinho**, e não sobre o Lab —

1. **§1-B** — a ficha de capacidades do Lab dizia, por escrito e para fora, que o
   motor do Parcelamento **ignora o ponto de acesso**. É falso (703 → 603 lotes), e
   o erro era do Lab. Uma ficha voltada para fora atribuindo ao motor de outro uma
   limitação que ele não tem é coisa que se avisa, não se conserta calado;
2. **§1-C** — eles **publicam** `MOTOR_NOME` e `MOTOR_VERSAO`, e a ponte do Lab
   escreve outros dois. Mesma forma do D104, um nível acima. Com uma pergunta de
   volta, que é a única coisa que o documento pede deles hoje: *a versão subiu no
   T02 e no T03?* Se não subiu, ela não serve para o Lab saber que precisa remedir
   — e é justamente para isso que o Lab quer usá-la.

**O que NÃO entrou:** o conserto da identidade. Ele muda o que viaja no contrato,
alcança provas congeladas do LAB-02 e do LAB-07 e o rótulo que o Generate mostra na
mesa. Está **proposto ao chat**, porque prompt fora da fila não existe.


---

## D112 · Desligar o despertador vale como apagar, e a diferença se declara · 03/10/2026

O `CLAUDE.md` §1-A manda, no disparo sem item pronto, **apagar o despertador** (D62).
No primeiro disparo em que isso aconteceu — 11:05 de 03/10 —, **ele foi desligado
(`enabled: false`) e não apagado.**

**Por quê:** apagar uma rotina **apaga também as sessões que ela iniciou**, e esta
rotina está presa (`persist_session`) à sessão onde o dia inteiro de trabalho está
registrado — LAB-21 a LAB-27, com as medições que não estão em nenhum outro lugar
além dos arquivos já mesclados. O risco de perder o histórico da conversa não valia a
letra da regra, e **o efeito que a regra quer é idêntico: ele não acorda mais.**

**Decisão:** *"apagar o despertador"*, na §1-A, cumpre-se por **desligar** quando a
rotina está presa à sessão em curso. E a diferença **vai declarada** — em
`ONDE_PARAMOS`, na fila e no recado —, porque quem for destravar precisa saber que
tem **duas** saídas e não uma:

| saída | o que ganha |
|---|---|
| **reabilitar este despertador** | preserva o histórico de disparos dele; é mais barato |
| **apagar e criar outro** | começa limpo, junto com a fila nova |

**Por que isto é decisão e não detalhe de ferramenta:** a §1-A existe para que
despertador sem trabalho **pare de queimar disparo** (4 de 7 em 15/09). Desligar
cumpre isso. Apagar cumpre isso **e mais uma coisa que ninguém pediu** — destruir o
registro. Entre cumprir a regra e cumprir a regra mais um estrago, a regra ganha.

---

## D113 · A sensibilidade ao acesso é medida em SEIS pontos, por arco, e a amplitude é um PISO · 03/10/2026

O LAB-26 achou de raspão que mover o ponto de acesso muda o resultado, e eu relatei
ao chat **19 %** — a diferença entre **dois** pontos escolhidos por serem os vértices
mais distantes. O LAB-28 mediu com método, e o número era muito maior: **108,26 %**
na candidata espinha do Generate, em `completo`.

**Dois pontos subestimam porque são dois.** A escolha "os vértices mais distantes"
não tem nada a ver com rendimento — é a maior distância geométrica, não o maior
contraste de resultado.

**Decisão, com os três pedaços que a tornam honesta:**

1. **seis pontos, igualmente espaçados por COMPRIMENTO DE ARCO.** Por arco e não
   por vértice: um anel de levantamento tem os vértices amontoados onde a divisa é
   recortada, e `anel[i * k]` poria quase todas as amostras no mesmo canto. É o
   terceiro lugar em que esse erro de forma aparece (D75, D93), e aqui ele entrou
   no teste antes de entrar na medição;
2. **seis, e não trinta, por custo declarado:** cada posição é uma rodada completa
   do motor **mais** o Validator e o Judge do Generate. Trinta posições poriam a
   tabela em meia hora e ninguém a regeraria;
3. **a amplitude é um PISO, e a ressalva viaja no objeto** (`amplitudeEhPiso: true`),
   não só na prosa: seis pontos não varrem o perímetro, e o melhor e o pior ponto
   reais podem cair entre duas amostras. A diferença verdadeira é **igual ou
   maior** que a publicada. O D82 puniu número cravado em prosa; ressalva só em
   prosa é o mesmo defeito do outro lado.

**`amplitudePct` é sobre o MÍNIMO**, de propósito: a frase que o número responde é
*"o melhor ponto rende quanto acima do pior"*. Sobre a média daria um número menor e
uma frase que ninguém faz.

---

## D114 · A manchete do LAB-28 estava errada, e a medição a derrubou antes de a página sair · 03/10/2026

A frase que eu ia publicar era: **"a entrada da rua pesa mais que a escolha do
motor"**. Medido nas cinco glebas, ela é **falsa como regra geral**:

| gleba | maior amplitude do acesso | entre os 3 motores de lote | o que pesa mais |
|---|---:|---:|---|
| `completo` | **+108,26 %** | +29,12 % | **a entrada** |
| `geo-antonina` | **+44,21 %** | +19,55 % | **a entrada** |
| `ensaio-47ha` | +53,16 % | +62,60 % | o programa |
| `sintetico-10ha-plano` | +27,68 % | +44,72 % | o programa |
| `sintetico-50ha-ondulado` | +16,86 % | +95,68 % | o programa |

**Duas de cinco.** E a primeira versão da conta era pior ainda: comparava a
amplitude com a diferença entre **os quatro** motores, o que dava **uma** de cinco —
porque incluir o Symbios infla a diferença até **355 %**, e essa não é uma escolha
que alguém faça entre dois loteamentos: ele entrega **quadra**, e os lotes dele vêm
da subdivisão do Lab (D50). É a distância entre duas **etapas**, não entre duas
opções.

**Decisão:** publicar **as duas contas**, com a razão de cada uma, e a manchete que
**não** depende de comparação:

> O **mesmo** programa, no **mesmo** terreno, com as **mesmas** regras, varia até
> **+108 %** em lotes só mudando por onde a rua entra.

Essa é incondicional e é a que serve a quem compra terreno. A outra — *"pesa mais
que o programa"* — sai com o número de 2 em 5 e sem adjetivo.

**Por que isto é decisão e não revisão de texto:** a manchete boa era *minha*, não
da medição, e a página do Jonny é lida por quem decide compra. **O ponto cego da §6
tem uma irmã**: ali eu ia atribuir ao vizinho um defeito meu; aqui eu ia atribuir à
medição uma conclusão minha. As duas se consertam do mesmo jeito — medindo antes.

---

## D115 · A coluna do acesso entra na tabela, e com ela a tabela admite o que ela é · 03/10/2026

Com o acesso fixo, a tabela comparativa responde *"qual motor é melhor NESTE ponto
de entrada"* e se apresenta como *"qual motor é melhor"*. Medido, isso não é detalhe:
em `completo`, a candidata espinha vai de **860 a 1 791 lotes** sem que nada além da
entrada mude — mais que o dobro.

**Decisão:** a coluna *"se a entrada da rua mudar"* entra na tabela comparativa e na
página do Jonny, em lotes e em área vendável, com **três cuidados escritos na página**
em linguagem de leigo:

1. **o melhor ponto pode não existir na vida real** — o Lab põe a entrada em seis
   pontos **sem perguntar se há rua ali fora**. A coluna continua útil: ela mostra
   quanto se perde por não poder usá-lo;
2. **a variação é o mínimo, não o máximo** (D113);
3. **o Lab não escolhe a entrada** — depende da rua de fora, da faixa de domínio e
   da licença. É decisão de projeto, e é do Jonny (CLAUDE.md §4).

**E o zero sai por extenso.** O Symbios dá amplitude **0 %** nas cinco glebas, e a
página escreve *"não muda nada"*: `+0 %` numa coluna de variação lê-se como erro de
medição, e aqui é medição — ele não recebe ponto de acesso, e isso já estava
declarado na ida (D109 confirmou por diferença).

---

## D116 · Duas réguas para a mesma grandeza, cometido por mim, na minha própria grandeza · 03/10/2026

O confronto do LAB-28 — *"a amplitude do acesso é maior que a diferença entre
programas?"* — nasceu **calculado em dois lugares**: na ferramenta `lab28.ts` e, de
novo, no gerador da página do Jonny. Os dois usavam referências diferentes para o
rendimento de cada motor:

| onde | referência quando a gleba NÃO declara acesso |
|---|---|
| `lab28.ts` | a **primeira posição amostrada** |
| `lab20.ts` (a página) | o número da **linha da tabela** — a gleba rodando como veio, sem acesso nenhum |

**Resultado:** `completo` saía com **+29,12 %** de diferença entre programas na
ferramenta e **+70 %** na página. Mesma gleba, mesma pergunta, dois números — e os
dois publicados, em arquivos que o Jonny lê lado a lado.

**É exatamente o defeito que o D20 proíbe no Validator**, e eu o cometi numa grandeza
**minha**, dois dias depois de escrever a guarda do LAB-25 contra a mesma família de
erro. O que o pegou foi ler a página gerada antes de mesclar — não um teste.

**Decisão:** a fórmula mora na régua. `referenciaDe()` e `amplitudePctDe()` ficam em
`src/acesso.ts`; `lab19.ts` calcula o confronto **uma vez** e o grava em
`tabela.json` (`confrontoDoAcesso`); a página **lê** e não recalcula; `lab28.ts`
importa as mesmas duas funções.

**A regra que isto deixa, e que vale além do acesso:** quando um número aparece em
dois arquivos de saída, ele tem de ser **calculado uma vez e copiado**, nunca
calculado duas. Página que recalcula é página que vai divergir — não "se", "quando".

---

## D117 · A identidade que viaja no contrato é a que o motor publica · 03/10/2026

A SAÍDA do Laboratório de Parcelamento dizia:

```json
"motor": { "nome": "motor-testfit", "versao": "T00-A+espinha" }
```

**As duas etiquetas eram minhas, e nenhuma era identidade de motor:**

| campo | o que estava escrito | o que é | onde o motor publica a dele |
|---|---|---|---|
| `nome` | `motor-testfit` | o nome do **repositório** | `MOTOR_NOME = "laboratorio-de-parcelamento"` |
| `versao` | `T00-A` | o nome de um **prompt do Lab** | `MOTOR_VERSAO`, com a nota *"sobe quando o desenho muda de forma que o Generate veja"* |

**Mesma forma do D104, um nível acima** — o Lab inventando onde o motor publica —, e
com a consequência que o D108 mediu: a etiqueta envelheceu no lugar (o motor foi do
T00-A ao T05 e o campo continuou dizendo T00-A) e estava escrita **em dois arquivos**
do Lab, com valores diferentes.

**Decisão, em quatro partes:**

1. **`motor.nome` e `motor.versao` são importados do motor.** Para o Parcelamento é
   literal: `import { MOTOR_NOME, MOTOR_VERSAO } from "@testfit/contrato/tipos.ts"`.
   Não há tradução a fazer — havia invenção a parar;
2. **`VERSAO_MOTOR_MEDIDA` foi apagada**, e o parâmetro `versaoMotor` de
   `voltaParaOContrato` **deixou de existir**. Apagar o parâmetro foi de propósito:
   ele obrigou cada chamador a ser revisitado, que é o que uma correção de raiz
   deve fazer;
3. **o `+<partido>` fica, e é a única coisa que o Lab acrescenta à versão.** A mesa
   do Generate mostra `externo · <nome> v<versão>`, e sem o partido as dez variantes
   do motor viram dez linhas idênticas;
4. **o rótulo da rodada do Lab vai em `archilly.origem`** — o campo de quem **rodou**,
   que é diferente de quem **é**. A separação é o coração da decisão: enquanto a
   etiqueta do Lab morava em `motor.versao`, ela **tinha** de envelhecer.

**O Symbios não tem o que importar** — o motor dele é WASM compilado de Rust. Então o
Lab guarda `VERSAO_DO_SYMBIOS = "0.4.1"` e `NOME_DO_SYMBIOS = "symbios-tensor"`, **com
a fonte citada ao `upstream/VERSION`** e um **teste que lê aquele arquivo** e reprova
se divergirem. `upstream/` é intocável (CLAUDE.md §3), e **intocável não quer dizer
ilegível** — copiar sem conferir é exatamente como o "T00-A" envelheceu.

**E o `+ subdivisão do Lab` saiu da versão dele.** `0.4.1` é do motor; a dupla é do
Lab. A informação não se perde: vive no **nome de tela** da porta (*"Symbios Tensor +
subdivisão do Lab"*, que é o que o urbanista lê) e no `archilly.origem` da SAÍDA.

---

## D118 · Prova congelada não se regera para consertar etiqueta · 03/10/2026

Cinco arquivos carregam o rótulo antigo: as três SAÍDAS do LAB-07 e as duas do LAB-08
em `docs/contratos/saidas/`. O conserto do D117 **alcança** esses arquivos, e havia
duas saídas.

**Decisão: não são regerados.** Eles são o **registro de uma medição feita naquele
dia, com o motor daquele dia**, e os números deles são citados nos relatórios do
LAB-07 e do LAB-08. Regerá-los **apagaria a medição para consertar uma etiqueta** —
e o Lab já decidiu, na D90, que o passado se vira com a história escrita, não se
apaga.

**O que entra no lugar:** [`docs/provas/LEIA-ME.md`](provas/LEIA-ME.md), que diz
quais arquivos trazem o rótulo antigo, **o que cada etiqueta queria dizer**, por que
não foram regerados, e onde está a identidade de verdade. Há **teste exigindo que
esse arquivo exista e cite as três coisas** — aviso que depende de alguém lembrar
não é aviso.

**A exceção, e ela tem razão:** a prova do **LAB-26** (`varredura.json`) **foi**
regerada. Ela não é registro de uma medição congelada — é a leitura ao vivo das
declarações da porta, e o campo `versaoDeclarada` é justamente o que mudou. Deixá-la
velha seria publicar como declaração atual uma que não é. As conclusões do LAB-26
não dependem do valor da etiqueta, e continuam idênticas.

---

## D119 · A quinta vez do ponto cego — e a primeira que já tinha saído para o chat · 03/10/2026

O motor do Laboratório de Parcelamento tem um campo de **entrada** chamado
`viaManual`: *"coluna vertebral desenhada à mão, quando houver"*. **A ida do Lab
nunca o preencheu.**

**Medido, preenchendo-o:** `antonina-com-via` vai de **25 para 32 vias**, e a SAÍDA
deixa de ser idêntica sem a via. Em `ensaio-com-via`, de 599 para 585 lotes.

**E o Lab publicou, duas vezes, que o MOTOR ignorava via desenhada:**

| onde | o que foi publicado | o que era |
|---|---|---|
| **LAB-17** | *"os quatro declaram que ignoram via desenhada, e os quatro ignoram"* | três ignoram; o quarto nunca a recebeu |
| **LAB-23** | *"provado por diferença: SAÍDA idêntica nos oito casos"* | a prova era verdadeira e a conclusão falsa — **a via nunca chegava ao motor** |

**A diferença entre esta e as quatro vezes anteriores** (D18, D75, D93/D94, D98,
D104) é a que importa: as outras foram pegas **antes** de sair. Esta **já tinha
saído**, em dois recados, e ficou publicada por duas semanas.

**E o pior detalhe:** o LAB-23 escreveu, com orgulho, que o teste dele *"morde antes
de qualquer relatório sair errado"* se um motor passar a respeitar a via. **Não
mordeu** — porque ele lia a **prova congelada**, não o motor rodando. Teste de
falsificação que lê prova velha não falsifica: repete.

**Decisão:** a ida entrega a via. O v2 tem tipo próprio (`via_desenhada`) e a ida o
lê sozinha; no v1 a linha chega como `via_existente`, indistinguível da testada de
frente, e **quem separa é o remendo do LAB-13, na esteira**, que passa a linha
pronta — reescrever o remendo dentro do adaptador seria a segunda régua que o D20
proíbe e que o D116 acabou de punir. **O motor tem uma coluna vertebral só**: entra a
mais longa, e isso vai dito como escolha do Lab.

**Corrigido o que estava publicado:** o relatório do LAB-17, o do LAB-23, a D101, a
prova dos dois, e a trava do LAB-23 — **virada, não apagada** (D90), exigindo agora o
que está medido: três dos quatro ignoram, e o Parcelamento muda.

---

## D120 · "Respeitar a via desenhada" eram duas perguntas, e só se viu depois de entregá-la · 03/10/2026

Entregue a via, a declaração `respeitaViaDesenhada` ficou impossível de responder com
honestidade num campo só:

| pergunta | o Parcelamento | como se mede |
|---|---|---|
| **lê** a via? (a SAÍDA muda?) | **sim** | mesma gleba com e sem a via, byte a byte |
| **assenta** o traçado nela? | **não** — aderência de 11 % | fração da linha com eixo gerado a menos de meia caixa |

**Mesmo caso do `leRelevo` (D100)**, e pela mesma razão: o Parcelamento é o primeiro
motor em que as duas respostas diferem. Com um campo só, uma das duas verdades teria
de virar mentira.

**Decisão:** `leViaDesenhada` nasce ao lado de `respeitaViaDesenhada`, cada uma com
o seu experimento, e a varredura do LAB-26 passa de **13 para 14 falsificáveis** — o
`Record<keyof Capacidades>` do registro acusou o campo que faltava no mesmo segundo
em que o campo nasceu, que é exatamente o que ele existe para fazer.

**E o `naoAtendido` mudou de postura:** quem lê a via e não assenta nela **não
"ignorou"** — ele **substituiu**. A distinção é para quem lê o resultado: *"a rua
desenhada não aparece"* e *"ela entrou como coluna vertebral e o traçado saiu por
perto"* são dois desenhos diferentes.

> **⚠ Ressalva do LAB-32 (D127): eram TRÊS perguntas, não duas.** A terceira é *"ele
> alinha o partido à direção da linha?"*, e a resposta é **sim** — o campo `viaManual`
> do motor dá à linha o ângulo base do traçado e transforma a faixa dela em área
> bloqueada. As duas são cumpridas, medidas. O que esta decisão chama de *"aderência de
> 11 %"* é a régua certa para a **segunda** pergunta e **cega para a terceira**: alinhar
> o partido gira a rede toda, e girar a rede tira eixos de cima das outras linhas
> desenhadas. Daí 17,4 % cair para 11,2 % quando o motor passou a OBEDECER.
>
> E o número 11,2 não é comparável com o 17,4: são **partidos diferentes** — o ranking
> do motor trocou `ortogonal` por `espinha`. No mesmo partido, 17,4 → 14,0 %.
>
> **O que esta decisão acertou e segue de pé:** partir uma declaração quando as
> respostas divergem. O que lhe faltou foi perguntar *"que mais este campo faz no
> motor?"* antes de eleger a régua.

---

## D121 · A dívida declarada: um destino para "o motor tem onde receber e eu não entrego" · 03/10/2026

A guarda da ida achou um segundo caso, e ele **não é limite do motor**: a **testada
de frente** chega ao contrato como linha, e o motor tem `facesLoteamento` —
*"faces do perímetro que recebem lotes virados para a rua existente"* — esperando por
ela. **A ida não entrega.**

As três saídas que não servem, e por quê:

| saída | por que não |
|---|---|
| declarar `perda` | **mentira**: `perda` quer dizer *"o motor não tem onde receber"*, e ele tem |
| declarar `entregue` | mentira maior |
| deixar fora do inventário | a guarda reprova, e **guarda vermelha por dívida conhecida vira guarda desligada** |

**Decisão:** um quinto destino, `divida`, que **não reprova e é publicado** — na
prova (`dividasDoLab`), no relatório e no recado ao chat —, nomeando o campo do motor
que espera (`onde`) e o que falta fazer (`proposto`). É o único destino que não é uma
resposta: é uma confissão com prazo.

**E ela custou alcance, o que vai dito:** com `atracoes` entrando como dívida, a
guarda **genérica** deixou de pegar o caso do D119 — porque a linha tem três destinos
possíveis e qual vale depende do tipo da atração, que no v1 só se descobre medindo.
Quem impede o D119 de voltar são **duas travas específicas**: a ida preenche
`viaManual`, e com ela o motor desenha diferente. **Guarda genérica tem alcance
genérico**; caso específico pede trava específica, e dizer isso é melhor que fingir
que uma cobre a outra.

**Consequência para a declaração da porta:** enquanto a dívida existir,
`respeitaTestadaDeFrente: false` no Parcelamento é **dívida do Lab, não limitação do
motor** — e está escrito assim no inventário, onde quem for pegar a dívida vai ler.

---

## D122 · "Verde" é um comando só, e ele DESCOBRE os pacotes em vez de listá-los · 04/10/2026

O `conferir.sh` nasceu no D110 para consertar o defeito que deixou a suíte do
`testfit` **vermelha, 14 de 14, por duas semanas**: eu rodava `bun test` num pacote e
chamava aquilo de "testes verdes". Mas ele nasceu **listando os dois pacotes à mão**, e
por isso carregava o mesmo defeito em potência: o terceiro pacote nasceria fora da
lista, ninguém notaria, e a história se repetiria com outro nome.

**Decisão:** o script **descobre** todo `package.json` do repositório
(`find … -name package.json -not -path "*/node_modules/*"`) e **reprova** quando acha
um que não esteja em `COBERTOS`. A mensagem de falha diz onde acrescentar e cita o
D110, para quem ler não achar que é burocracia.

O jeito de um pacote ficar de fora deixou de existir — não porque eu lembrei de todos,
mas porque **esquecer agora pinta vermelho**. E há um teste
(`esteira/tests/verde.test.ts`) que lê o próprio script, extrai o `COBERTOS=(…)` e
confere contra os pacotes reais: a guarda tem guarda.

## D123 · Prova que depende de olho humano é prova que roda uma vez · 04/10/2026

A prova no navegador existia desde o LAB-01, em
`symbios/adapter/ferramentas/navegador/`: compilar o `.wasm`, copiar, servir, abrir o
Chromium **e ler os números na tela**. Ela rodou **uma vez, em 10/09/2026**, e nunca
mais — e isso não é desleixo de ninguém, é o que acontece com toda prova cuja última
etapa é um olho.

**Decisão:** a página publica os números como **dado**
(`window.__prova = { ok, versao_motor, nos, arestas, quadras, bytesDoWasm, ms }`), e um
roteiro (`prova-automatica.ts`) sobe o servidor, abre o Chromium do Playwright, espera
o `window.__provaConcluida`, **compara com os números de 10/09** e sai 1 se divergir.
Entrou no `conferir.sh` como sétimo passo.

Medido agora, os cinco números bateram exatamente: `0.4.1` · 6 242 nós · 6 514 arestas
· 275 quadras · 193 174 bytes. **O `ms` não é conferido** e está dito no JSON: tempo de
parede varia por máquina, e trava que pisca por carga da máquina é trava que se
desliga.

**Um defeito pego no caminho, e ele é do §6:** a primeira versão da linha das arestas
era `r.arestas.filter(a => a.ativa).length`. As arestas são **tuplas**
`[ia, ib, tipo]`, não objetos — `.ativa` é `undefined` em todas, e a prova teria
publicado **0 arestas** em silêncio, para sempre, como se fosse medição. Pego porque o
número não bateu com o de 10/09; ou seja, **pela comparação que este prompt acabou de
criar**.

## D124 · Precondição que falta é FALHA, com a receita — nunca "pulado" · 04/10/2026

O `.wasm` do Symbios **não é versionado**, e de propósito: o próprio `.gitignore`
argumenta que binário velho no git é pior que binário ausente. Mas sem ele tudo que
carrega o Symbios falha **por outro motivo** — erro de carregamento, não de medição —,
e manda quem conserta para o lugar errado.

A saída cômoda seria `skip`. **Decisão: não.** `skip` é exatamente a forma de calar
alarme que o D110 custou duas semanas para ensinar. O script confere o arquivo, e se
ele não existir **reprova**, imprimindo a receita exata:

```
rustup target add wasm32-unknown-unknown
cd external-engines/symbios/archilly/wasm
RUSTFLAGS='--cfg getrandom_backend="custom"' cargo build --release --target wasm32-unknown-unknown
```

Vale para toda precondição que vier depois: **falta de precondição é vermelho com
receita**, nunca verde com ressalva.

## D125 · Não há CI neste repositório, e isso fica escrito em vez de suposto · 04/10/2026

O chat pediu *"um comando só que roda tudo"*. Ele existe e está provado. Mas a pergunta
seguinte — *quem o executa?* — tem uma resposta que convém não esconder: **não existe
`.github/workflows` neste repositório**. Nada roda o `conferir.sh` automaticamente. Em
PR aberto por mim, quem o roda sou eu, antes do commit; e se um dia eu esquecer,
**nada pinta vermelho**.

**Decisão:** está dito no alto do próprio script, no relatório e no recado, e a
proposta de criar o CI entra na fila como *"proposto ao chat"* — ampliar escopo por
conta própria é o que o §1-A proíbe. O que eu **não** faço é chamar de "verde
garantido" o que é "verde quando alguém lembra".

## D126 · A prova de que a trava morde é sabotagem de propósito, nos três lugares · 04/10/2026

O chat não pediu o comando: pediu *"prove quebrando de propósito um teste de cada
pacote e mostrando que o comando único reprova"*. A diferença importa — um comando que
roda tudo e **nunca reprova** é indistinguível, de fora, de um comando que não roda
nada. Foi literalmente o estado do `testfit` no D110.

Três sabotagens, uma por frente, todas revertidas e conferidas (`grep -c SABOTAGEM` = 0
nos três arquivos), com o antes e o depois em `docs/provas/LAB-31/sabotagem.json`:

| frente | sabotagem | resultado |
|---|---|---|
| pacote `esteira` | `motor.nome` → `"SABOTAGEM-LAB-31"` | `esteira · test` vermelho |
| pacote `testfit` | `archilly.versao` → `"SABOTAGEM-LAB-31"` | `testfit · test` vermelho |
| navegador | `quadras` → `999999` | prova no navegador vermelha |

`exit 0 → exit 1`, com os quatro passos nomeados. **Quatro, não três:** o
`esteira · lint` caiu junto, sem eu ter sabotado o lint — a sabotagem deixou o import
`MOTOR_NOME` sem uso. Dano colateral pego de graça, e um argumento a mais para os três
passos de cada pacote viverem no mesmo comando.

**Uma coisa a sabotagem NÃO prova:** que o comando rode. Ver D125.

---

## D127 · A queda que eu publiquei sem investigar era o motor OBEDECENDO · 04/10/2026

O chat cobrou com a palavra certa: *"a aderência do Parcelamento caiu de 17,4 para 11,2
por cento depois do conserto do LAB-30 e você publicou sem investigar."* Publiquei. E o
resultado era suspeito do jeito que o §6 descreve — *"entreguei a linha ao motor e ele
passou a segui-la MENOS"* é uma frase que pede medição antes de virar conclusão.

Medida, a queda de 6,2 pp tem **duas** parcelas, e nenhuma é desrespeito:

| parcela | quanto | o que é |
|---|---|---|
| troca de partido | **2,8 pp** | o ranking do próprio motor trocou `ortogonal` (nota 0,6176) por `espinha` (0,6318) |
| o efeito da via no mesmo partido | **3,4 pp** | ortogonal com a via: 17,4 → 14,0 % |

A primeira parcela diz que **eu comparei dois desenhos diferentes**: 17,4 % era o
ortogonal, 11,2 % é a espinha. A variante que representa o motor é a de melhor nota
*dele*, e trocar de ideia sobre qual partido vence é direito do motor — só não é
comparação.

E a segunda parcela não é desobediência, é a **minha régua medindo outra coisa**. Lido o
motor (só leitura, `motor-testfit/src/lib/lab/motor.ts`), `viaManual` faz exatamente
duas coisas, e nenhuma é assentar eixo na linha:

1. **`anguloBase()`** — a direção da linha passa a ser o **ângulo base do partido
   inteiro**, no lugar do ângulo da caixa envolvente da gleba;
2. **`faixaDaViaManual()`** — a caixa da linha mais as calçadas viram **área bloqueada
   antes de qualquer lote nascer**.

A régua da aderência pergunta *"há eixo gerado sobre este ponto da linha?"*. É a
pergunta certa para um motor que promete assentar a rua na linha — e **este não
promete**. Pior: alinhar o partido **gira a rede toda**, e girar a rede tira eixos de
cima das outras três linhas desenhadas. **A régua lê obediência como queda.**

**As duas promessas, medidas em `antonina-com-via`, são CUMPRIDAS:**

| promessa | medida | resultado |
|---|---|---|
| ângulo base da linha | fração do comprimento de eixo a menos de **10°** da linha | ortogonal **0,0 → 72,9 %**; pente 0,0 → 82,7 %; loop 0,0 → 72,4 %; mioloVerde 0,0 → 70,1 %; orgânico 0,0 → 27,2 % |
| faixa livre de lote | lotes com o **centro** dentro da faixa | **0 em 10 de 10 partidos**, nas duas glebas (vinham de 9, 17, 20, 16…) |

**Por que `ensaio-com-via` não se moveu e `antonina-com-via` se moveu inteira:** no
ensaio a principal desenhada corre pelo meio do lado maior, que **já é** a direção da
caixa envolvente — o ângulo base muda de quase nada para nada. Em Antonina, real e
irregular, a linha faz ângulo com ela, e alinhar o partido move a rede toda. A gleba
sintética não tinha como mostrar o efeito.

**Decisão:** nasce `alinhaOPartidoAViaDesenhada`, ao lado de `leViaDesenhada` e
`respeitaViaDesenhada`, com o seu experimento no registro — a varredura vai de 14 para
**15 falsificáveis**. `respeitaViaDesenhada: false` **continua**, porque é literalmente
verdade: ele não põe a rua sobre a linha. As três convivem porque as três respostas
diferem, e é o terceiro caso da mesma família (D100, D120).

**A ressalva que vai junto, porque sem ela o campo engana:** o ângulo base obedece à
linha, mas cada variante sorteia **±30°** em cima dele (`variacaoAngular`, no motor).
Então a obediência aparece em alguns partidos e some em outros — na variante que o
ranking dele escolhe em `antonina-com-via` o ganho é de **5,6 pp**, não de 72,9. Isso é
achado para o Laboratório de Parcelamento, numerado no relatório, **sem commit lá**.

## D128 · A SEXTA vez do ponto cego, e esta eu peguei dentro do próprio prompt · 04/10/2026

A régua da faixa, na primeira versão que eu escrevi hoje, contava **lotes com vértice
dentro da faixa** da via. Ela deu, no partido ortogonal de Antonina, **27 → 34 lotes** —
e eu estava a um passo de publicar *"o motor não cumpre a segunda promessa: dando-lhe a
linha, ele põe MAIS lote em cima dela"*.

**O lote que faz frente para a faixa encosta nela de direito.** A faixa é a caixa da rua
mais as calçadas: o lote defronte tem de tocá-la, é isso que "fazer frente" significa.
Medir invasão por vértice conta todo vizinho como invasor.

**Invasão é o CENTRO do lote dentro da faixa.** Medida assim: **0 invasores em 10 de 10
partidos, nas duas glebas**. A promessa é cumprida com folga, e a conclusão oposta estava
a um `git commit` de distância.

**Decisão:** a régua mede o centro, publica a vizinhança **ao lado e pelo nome**
(`soEncostam`), e as duas travas do teste são justamente o par — o lote em cima
(invasor) e o lote defronte (não). A sexta vez do ponto cego tem a forma das outras
cinco, com uma diferença que vai registrada: **das seis, três foram réguas minhas
acusando a si mesmas, e esta foi pega antes de sair** — não por disciplina nova, mas por
desconfiar de um número que caminhava para o lado que eu já queria.

## D129 · A guarda da existência lia um arquivo só, e reprovou o teste certo · 04/10/2026

O registro das capacidades (LAB-26) tem duas varreduras: **cobertura** (campo sem
experimento reprova) e **existência** (nome de teste citado que não existe reprova). A
segunda lia **apenas `tests/porta.test.ts`** — e hoje ela reprovou o teste novo do
`alinhaOPartidoAViaDesenhada` por ele morar em `tests/alinhamento.test.ts`.

Duas saídas: mudar o teste de arquivo, ou mudar a guarda. **A regra do registro é *"todo
campo tem quem o desminta"*, não *"todos os desmentidos moram num arquivo"*** — e a
primeira saída transformaria `porta.test.ts` em depósito, o que é como as suítes grandes
ficam ilegíveis.

**Decisão:** a guarda varre `tests/*.test.ts`. Ela continua lendo **o arquivo de
verdade**, que é a propriedade de que ela depende; só deixou de confundir *onde* a trava
mora com *se* ela existe. Guarda que obriga arquivo único é guarda ditando arquitetura.

---

## D130 · A trava do LAB-23 passa a MEDIR — virar o sinal não tinha consertado nada · 04/10/2026

O chat mandou: *"a trava do LAB-23 continua lendo prova congelada em vez de medir;
conserte de verdade, não vire o sinal."* Era exatamente isso, e a história inteira vale
mais que o conserto:

| quando | o que o teste dizia | por que não servia |
|---|---|---|
| **LAB-23** | *"NENHUM motor muda a saída quando a via sai do arquivo"*, com o comentário *"se um dia um motor passar a respeitar, este teste morde antes de o relatório sair errado"* | **o relatório saiu errado duas vezes e ele não mordeu** |
| **LAB-30** | virei o sinal: o Parcelamento passou a ser exigido **mudando** | **continuou lendo `coluna-vertebral.json`** — afirmação sobre arquivo, não sobre motor |

**Por que não mordeu, no LAB-23:** a SAÍDA do Parcelamento era idêntica com e sem a via
porque **a ida do Lab nunca entregava a via ao motor** (D119). E aqui está o defeito de
projeto do teste, que virar o sinal não toca: ***"saída idêntica" significa duas
coisas*** — *o motor ignora a linha* **ou** *a ponte não a entrega* — e sem separá-las o
teste passa nas duas. Ele estava medindo a conjunção e lendo como se fosse uma das
parcelas.

**Decisão, em três partes:**

1. **os motores RODAM no teste.** As oito rodadas (duas glebas × quatro motores × com e
   sem a via) vivem num memo e são medidas neste processo. Nenhuma asserção sai de
   arquivo;
2. **a ambiguidade fica travada à parte.** Três testes medem a **ponte**, direto na
   `idaParaOMotor`, sem motor no meio: no v2 ela lê a `via_desenhada` sozinha e preenche
   `viaManual`; sem via no arquivo não inventa; e respeita a linha que recebe pronta. É
   a trava que teria mordido em 13/09;
3. **a prova congelada vira detector de prova velha** (D131).

**O preço, e ele vai dito:** a suíte do `esteira` foi de **108 s para 176 s**. Medir de
verdade custa — a rodada de `antonina-com-via` leva ~22 s por passagem —, e esse é o
preço de o teste responder pelo motor em vez de responder por um `JSON`. Teste rápido
que não falsifica nada é barato do jeito errado.

**Um defeito meu no caminho, pequeno e instrutivo:** eu memoizei o `.wasm` com
`Motor.carregar` **sem `await`**. O memo guardou a *promessa*, e o Symbios morreu com
`motor.comSessao is not a function`. Resolvido com top-level await, e o comentário do
tropeço ficou no arquivo.

## D131 · Prova congelada tem UM uso honesto: detectar prova velha · 04/10/2026

Da D130 sai uma regra geral, porque o defeito não é do LAB-23 — é da forma.

> **Teste que LÊ prova congelada para responder à pergunta não falsifica: ele repete.**
> O único uso honesto de um arquivo de prova dentro de um teste é ser **comparado** com
> a medição feita ali, para acusar que o arquivo envelheceu.

É o que o último `describe` do `coluna-vertebral.test.ts` faz agora: mede e compara com
`docs/provas/LAB-23/coluna-vertebral.json`, reprovando com *"regere com `bun run
lab23`"*. O arquivo ganhou função — avisar — e perdeu a que não era dele, responder.

**Varredura nas outras seis travas que leem `docs/provas/`**, porque regra nova sem
varredura é regra que só vale para o caso que a criou:

| trava | o que ela lê | veredito |
|---|---|---|
| `acesso.test.ts` · posições declaradas | constante do código **vs** prova | ✅ detector de prova velha |
| `acesso.test.ts` · o confronto do D116 | prova do LAB-19 **vs** prova do LAB-28 | ⚠️ **repete** — duas provas comparadas entre si, nenhuma medida |
| `guarda-da-ida.test.ts` · a dívida publicada | o conteúdo da prova | ✅ a propriedade é *"foi publicado"*, e as outras 19 travas do arquivo medem ao vivo |
| `identidade.test.ts` · as provas congeladas do LAB-02/07 | o `LEIA-ME.md` que as explica | ✅ é sobre o texto existir |
| `pagina.test.ts` · a página contra a tabela | prova **vs** página gerada | ✅ detector de página velha |
| `verde.test.ts` · a sabotagem | o registro de um experimento manual | ✅ não é remensurável sem sabotar de novo, e está dito |

**Uma só repete, e eu NÃO a consertei aqui** (§1-A, não ampliar escopo): o teste do
D116 confere que a tabela do LAB-19 e a prova do LAB-28 trazem os mesmos números de
confronto — mas se as duas forem regeradas erradas do mesmo jeito, ele passa. **O
conserto é barato e está proposto ao chat:** recalcular o agregado a partir dos números
crus que a própria prova já carrega, com `referenciaDe`/`amplitudePctDe` do
`acesso.ts` — sem rodar motor nenhum, portanto sem custo de suíte. Medir ao vivo o
confronto inteiro custaria as 5 glebas × 4 motores × 6 posições de acesso do LAB-28, que
é outra ordem de grandeza.
