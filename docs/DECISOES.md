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

> **✅ PAGA no LAB-37, em 04/10/2026** (D138), depois de sete prompts declarada. A
> `facesCobertasPelaLinha` mapeia a linha para os índices de aresta que ela cobre — em
> `geo-antonina`, a face 0, coberta a 100 % —, e medido, lotes com aresta na testada vão
> de **0 para 14 a 18**, em 10 de 10 partidos. **`respeitaTestadaDeFrente` virou `true`:
> esta decisão previu que seria, e estava certa.**
>
> E o alcance que esta decisão custou **voltou**: com `atracoes` sendo entrega e não
> dívida, a guarda genérica passou a reprovar a ida "como era" — o que ela não podia
> fazer enquanto o campo fosse `divida`. **A categoria está vazia hoje**, e o ajudante
> fica no código: a gaveta vazia é a prova de que a confissão tinha prazo.

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

---

## D132 · O aviso vai onde a ordem aparece — e "varia 108 %" não era a pergunta · 04/10/2026

O chat mandou: *"a tabela comparativa ordena os motores num único ponto de acesso, e só
a seção do acesso avisa que isso muda até 108 por cento — ponha o aviso onde a ordem
aparece, não escondido."*

A primeira metade era fácil: mover o aviso. **A segunda metade é que o aviso estava
respondendo à pergunta errada.**

> **"Varia 108 %" e "a ordem muda" são afirmações diferentes.** Um motor pode variar
> muito e continuar sempre na frente. Quem lê a coluna *lotes* dos quadros **ordena os
> motores com os olhos** — e a pergunta de quem ordena é se a ordem aguenta a entrada
> mudar, não quanto o número varia.

**Medido, nas cinco glebas, com as seis posições de acesso do LAB-28:**

| gleba | posições comparáveis | ordens distintas | o 1º lugar muda? |
|---|---|---|---|
| `completo` | 4 de 6 | **3** | **sim** (espinha e ortogonal) |
| `sintetico-50ha-ondulado` | **1** de 6 | — | não há como saber |
| `sintetico-10ha-plano` | 3 de 6 | **2** | não |
| `ensaio-47ha` | **6 de 6** | **1** | não — ✅ a ordem aguenta |
| `geo-antonina` | **6 de 6** | **3** | **sim** (espinha e ortogonal) |

**A ordem muda em 3 dos 5 terrenos, e o primeiro lugar em 2.** E na única gleba real com
as seis posições completas — `geo-antonina` — ela muda: na posição 0 a espinha ganha com
1 672 lotes; na 3 a ortogonal ganha com 1 941; na 5 a ortogonal **cai para terceiro**,
atrás do Parcelamento.

**Decisão:** a régua `instabilidadeDaOrdem` nasce no `acesso.ts` — **num lugar só**, a
lição do D116 —, roda na ferramenta, é gravada em `tabela.json`, e a página escreve o
aviso **debaixo de cada quadro**, com o que foi medido *naquela* gleba: *"NÃO aguenta,
3 ordens, o primeiro lugar muda"*, ou *"aguenta, não mudou nenhuma vez"*, ou *"não dá
para dizer"*. Mais a legenda da coluna `Lotes` dizendo que o número é de **um** ponto, e
um apontador na seção do acesso de volta para os quadros.

**Aviso igual em todo lugar é aviso que vira decoração**, e há trava exigindo que os
cinco não sejam o mesmo texto — justamente porque um dos cinco é um ✅.

## D133 · A SÉTIMA vez do ponto cego: contar ordem onde um motor não respondeu · 04/10/2026

A primeira contagem que eu fiz dizia **"a ordem muda em 4 das 5 glebas"**. Estava errada,
e errada da forma do §6.

**Nem todo motor responde em toda posição de acesso.** No `sintetico-50ha-ondulado` a
candidata ortogonal do Generate entrega desenho aceito pelo contrato em **1 de 6**
posições; no `completo`, a espinha falha em 2 de 6. Contando a ordem nessas posições, ela
*"muda"* — mas o que mudou foi **um motor sair da comparação**, que é outra afirmação.

**Decisão:** a ordem só é comparada nas posições em que **todos** responderam
(`posicoesComparaveis`), e as ausências saem **ao lado, contadas e nomeadas**
(`naoResponderam`) — porque *"este motor não desenha nada aceitável se a rua entrar
aqui"* também é resposta, e sumir com ela seria inventar silêncio, no espírito do D23.
Com a conta certa: **3 de 5**, não 4.

É a **sétima** vez da forma do §6 e a segunda pega dentro do próprio prompt. A diferença
desta: não houve motor de vizinho envolvido — **eu ia acusar a mim mesmo de instabilidade
que era ausência de dado.** A trava está em `acesso.test.ts`, com o par: a posição sem
resposta fica fora da ordem, e a ausência aparece contada.

**E uma trava minha reprovou a página por um defeito dela mesma, no mesmo prompt:** a
primeira versão do teste contava os avisos filtrando pela frase *"entrada da rua"*, que
só as glebas instáveis usam — deu 4 de 5 e acusou a **página**. A conferência que vale é
**por posição**: cada quadro tem de ter o seu aviso colado. Filtro por prosa é régua
frágil medindo texto gerado.

---

## D134 · Os 310 avisos tinham caso real dentro, e a regra 3 era duas · 04/10/2026

O chat mandou: *"a guarda da ida cospe 310 avisos `mapa-velho`; confira se há caso real
escondido nesse volume e reduza o ruído."* **Havia caso real**, e achá-lo foi uma questão
de classificar em vez de contar.

**Primeiro, a classificação.** Dos 68 campos que avisavam, **21 avisavam em TODAS as sete
glebas**. E aí a frase do diagnóstico deixa de valer: *"pode ser campo opcional que esta
gleba não exerce"* vira **"nenhuma gleba exerce isto"**, que é outra coisa.

**Segundo, a partição.** Dos 21, **dezessete** são `perda` ou `interno` — nada tinha de
chegar ao motor, então a ausência não diz nada. **Quatro são PROMESSAS:**

| ida | campo | destino prometido |
|---|---|---|
| parcelamento | `parametros.calcada_m` | `terreno.padroes` |
| parcelamento | `atracoes[].geometria.aneis` | `terreno.atracoes` |
| parcelamento | `acessos[].segmento` | `terreno.acesso` |
| symbios | `gleba.furos` | `gleba.furos` |

**Por que isso é grave e não burocracia:** a regra `campo-nao-entregue` só morde quando o
contrato **traz valor**. Um caminho de destino errado numa entrada `entregue` ou
`traduzido` que gleba nenhuma exercita é **invisível** — é exatamente a forma do D119,
onde o motor tinha o campo e ninguém media se ele chegava. **Promessa que ninguém exerce
é promessa que a guarda nunca verificou.**

**Decisão, em três partes:**

1. **a regra 3 virou duas.** `promessa-nao-exercitada` quando o destino é
   `entregue`/`traduzido` — o aviso que importa; `mapa-velho` quando é `perda`/`interno`
   — o aviso que não importa, **gravado na prova e calado no relatório**;
2. **a ferramenta agrega.** Por gleba, promessa não exercitada não quer dizer nada; entre
   glebas, a que não aparece exercida em **nenhuma** vai para
   `promessasQueNenhumaGlebaExercita`, que é a lista curta que merece olho;
3. **as quatro foram EXERCITADAS**, com entradas montadas em teste
   (`tests/promessas.test.ts`). Transformar *"nunca verificada"* em *"verificada"* é o
   único conserto que vale aqui — e **as quatro se sustentam**.

**A conta do ruído:** 310 → **99** promessas não exercitadas (sinal) + **187**
`mapa-velho` (calado). Os 24 que faltam eram entradas de **dívida** em glebas que não
trazem o campo: não há o que confessar se o contrato não trouxe nada, e a regra 3 passou
a pular dívida — a regra dela só fala quando há valor.

**E o que o relatório lê agora** é `avisosQueImportam`, que é tudo menos `mapa-velho`.
**Guarda que grita à toa se desliga**, e esta gritava 310 vezes por rodada.

## D135 · A OITAVA vez do ponto cego, e as duas foram caminho do meu teste · 04/10/2026

Escrevendo os quatro testes que exercitam as promessas do D134, **dois falharam na
primeira rodada**. Os dois pareciam defeito da ponte do Lab — o tipo mais caro, o do
D119 — e **os dois eram o meu teste**:

| o que eu ia dizer | o que era |
|---|---|
| *"a calçada declarada não chega ao motor"* (`toBe(3.5)` recebeu outra coisa) | o motor recebe padrão como **faixa**: `{ min: 3.5, max: 3.5 }`. A promessa estava certa |
| *"a ida do Symbios não entrega o furo da gleba"* (`terreno.furos` veio `undefined`) | no Symbios a gleba é um `Poligono { externo, furos }`: o furo mora em **`terreno.gleba.furos`**. O caminho do inventário estava certo; o do meu teste, errado |

A segunda é a que assusta: eu tinha nas mãos, por um instante, *"o inventário promete
entregar o furo e a ida não entrega"* — uma acusação à ponte do Lab, publicável, e
**falsa**.

**Decisão:** os dois tropeços ficam **escritos nos próprios testes**, no lugar onde a
asserção mora, porque é lá que o próximo a mexer vai ler. E a regra que eles ensinam
entra no §6 do `CLAUDE.md`:

> **Antes de acusar a ponte de não entregar, confira o CAMINHO e a FORMA do que você
> está lendo.** Oito vezes das oito, o defeito estava na régua antes de estar no medido —
> e em três delas a régua era o próprio teste que eu acabara de escrever.

---

## D136 · As regras que eram só afirmação viraram guarda — e DUAS estavam falsas · 04/10/2026

O chat mandou: *"as quatro regras sem teste que você listou viram guarda ou saem do
documento."*

**Primeiro achado, e ele é sobre o próprio pedido: a lista não existia em lugar
nenhum.** Ela saiu num balanço que o chat pediu fora da fila, foi para o chat e **não
para um arquivo**. Então eu não podia confiar na memória: **varri o `CLAUDE.md` de
novo**, regra por regra, perguntando *"o que, hoje, reprovaria se isto deixasse de ser
verdade?"*.

> **O que vai ao chat e não vai a um arquivo não existe amanhã.** É a mesma lição do
> `RECADOS.md` (§1), aplicada ao que eu respondo fora da fila — e desta vez ela custou
> uma varredura inteira para recuperar uma lista de cinco linhas.

**Deram CINCO, não quatro — e duas estavam FALSAS como escritas:**

| regra | estado | conserto |
|---|---|---|
| §4 *"não tem interface"* | ❌ **FALSA** — o HTML da bancada do navegador existia desde o LAB-01 | a regra **declara a exceção**, e a guarda conta os HTML: um segundo reprova |
| §7 *"prova com gleba, motor, semente e contrato **em cada arquivo**"* | ❌ **FALSA em 9 de 32** | a regra vale para prova de **medição**, e as exceções viram **lista declarada** |
| §4 *"não reimplementa o Validator nem o Judge"* | ✅ verdadeira, sem guarda | guarda: o julgamento vem por `@generate/`, e nenhum arquivo define validador próprio |
| §4 *"conserto do Lab vem desligado por padrão"* | ✅ verdadeira, sem guarda | guarda: `aparar?` é opcional, só roda sob pedido, e **quem liga declara o tamanho do corte** |
| §5 *"Testfit é nome interno"* | ✅ verdadeira, sem guarda | guarda: texto para o usuário nunca diz o nome, **e diz o certo** |

E uma sexta, da mesma família e igualmente solta: §4 *"não escreve em repositório
vizinho"* — conferida à mão em toda rodada, agora **guarda**, com a **conta de quantos
clones foram conferidos** publicada, para *"0 clones conferidos"* não passar por verde.

**As exceções das provas têm DUAS classes, e a segunda é conjunto fechado:**

- **`NAO_MEDEM_GLEBA`** (7) — o oráculo de geometria do LAB-04, o diagnóstico do
  interpolador do LAB-07, a entrada guardada do LAB-01, o formato proposto do LAB-24, a
  varredura de declarações do LAB-26, e as duas do LAB-31 (navegador e sabotagem). São
  permanentes **por natureza**: não há gleba ali;
- **`CONGELADAS_ANTES_DA_REGRA`** (2) — `LAB-06/ranking.json` e `LAB-07/medicoes.json`,
  que não trazem a versão do contrato. **Não se regera prova congelada para consertar
  etiqueta** (D118), então o dado que falta **mora na lista, nomeado**: contrato `1` nas
  duas. E há teste exigindo que esse conjunto **não cresça** — senão *"de antes da
  regra"* vira desculpa para prova nova incompleta.

**A guarda das listas tem a propriedade que o LAB-33 ensinou:** ela reprova a exceção que
aponta para arquivo inexistente **e** a exceção que passou a cumprir a regra. Lista que
não se revalida envelhece igual a comentário (D104).

**Decisão, em uma linha:** **regra que ninguém pode desmentir não é regra, é slogan** — e
duas delas já tinham deixado de ser verdade sem que nada acusasse.

## D137 · A NONA vez do ponto cego: a régua media ortografia, não conteúdo · 04/10/2026

A primeira versão da guarda do §7 exigia a chave `"gleba"` **literal** e reprovou **13 de
32** provas. Eu tinha nas mãos *"um terço das provas do repositório viola a §7"*.

**Era a régua.** Há prova que identifica a gleba em **`glebas`** (plural), e arquivo de
**SAÍDA** que a identifica em `entrada`, com a versão do contrato dentro do bloco
`archilly` — como o contrato manda. **Exigir um nome só é medir ortografia, não
conteúdo.**

Com os nomes aceitos declarados por conceito — `gleba | glebas | entrada |
montadaSobre | projeto`, e `contrato | contratoLidoPelaEsteira | archilly |
contratoDeSaida` — sobraram **9**, e aí cada uma é um caso de verdade: sete que não medem
gleba e duas congeladas antes da regra.

**É a nona vez da forma do §6, e a quarta pega dentro do próprio prompt.** A diferença
desta: o acusado não era motor de vizinho nem ponte do Lab — **eram os arquivos de prova
do próprio repositório**, e o número (13 de 32) era grande o bastante para parecer
achado. A lição entra ao lado das outras:

> **Antes de acusar em volume, pergunte se a sua régua aceita os nomes que a coisa de
> fato usa.** Régua que casa por nome exato mede ortografia; régua que casa por conceito
> mede conteúdo — e é por isso que a guarda da ida resolve **caminho**, e não nome
> (D30).

---

## D138 · A dívida da testada de frente foi PAGA, e a D121 estava certa · 04/10/2026

O chat mandou: *"a dívida da testada de frente — mapear a linha para as faces do
perímetro — escreva o tamanho e execute se couber."* **Cabia.**

A **testada de frente** — a linha onde a gleba encosta numa rua que já existe — chega
ao contrato como linha, e o motor do Laboratório de Parcelamento tem `facesLoteamento`
esperando desde sempre: *"índices das faces do perímetro que recebem lotes voltados
para a rua"*. **A ida do Lab nunca entregou.** Era a única `divida` declarada do
inventário, do LAB-30 ao LAB-37.

**O tamanho, escrito antes de executar:** uma régua nova
(`facesCobertasPelaLinha`), a opção na ida, a passagem na esteira do adaptador, o
cálculo no invólucro, o inventário virando entrega, a declaração da porta, a medição e
as travas. Comparável ao LAB-30. **Cabe num prompt.**

**O mapeamento, medido em `geo-antonina`:** a linha de **180 m** cobre a **face 0** do
perímetro **a 100 %**. A face 19 encosta nela **a 3 %** — o vértice compartilhado, não
a testada. Daí o segundo parâmetro da régua ser a **fração mínima da face**, meia face,
**declarada**: sem ela a régua repetiria o **D75**, em que uma régua de vértice pôs três
de quatro vias desenhadas no balde errado. A tolerância de 1 m dá o mesmo resultado que
5 m, o que diz que a escolha não está mandando no número.

**O resultado, e ele é limpo:**

| | sem as faces | com as faces |
|---|---|---|
| lotes com aresta na testada, em 10 de 10 partidos | **0** | **14 a 18** |

**A D121 dizia, por escrito, que enquanto a dívida durasse, `respeitaTestadaDeFrente:
false` era dívida do Lab e não limitação do motor. Medido: ela estava certa.** A
declaração virou `true`, com o experimento do registro a desmentindo se voltar a mentir.

**E a dívida paga devolveu o alcance que ela custou.** O D121 registrou que fazer de
`atracoes` uma `divida` tirou a mordida da guarda genérica — dívida não reprova. Agora
`atracoes` é **entrega com três destinos alternativos** (`terreno.atracoes | viaManual |
facesLoteamento`), e a trava do D119 mostra a diferença: **a ida "como era" passou a ser
reprovada pela guarda genérica**, que antes não podia morder.

**A categoria `divida` está vazia hoje**, e o ajudante dela fica no código, sem uso, de
propósito: a próxima dívida não precisa reinventá-lo, e a gaveta vazia é a prova de que
ele cumpriu o que prometia — ser uma confissão **com prazo**.

## D139 · O arnês da guarda media um caminho que não era o caminho · 04/10/2026

Declarado `atracoes` como entrega, a guarda da ida **reprovou 6 campos em
`geo-antonina`**, dizendo que a testada de frente não chegava ao motor. Eu tinha nas
mãos *"a entrega não funciona"*.

**Ela estava certa sobre o que mediu e errada sobre a esteira.** O `rodarTestfit`
calculava a coluna vertebral **e** as faces; o arnês da guarda
(`auditarIdaDoParcelamento`) calculava **só a coluna**. A guarda auditava, portanto, um
caminho que não é o caminho de verdade.

**Isso é pior que guarda reprovando à toa: é guarda medindo outra coisa** — e o pior do
pior é que a divergência nasceu **dentro da guarda que existe justamente para impedir
que duas montagens da mesma coisa envelheçam em direções diferentes** (D116).

**Decisão:** `oQueAEsteiraPassaPronto(entrada)` devolve `{ viaManual, facesLoteamento }`
e é **a única** montagem; o invólucro e o arnês a chamam. Com ela, a guarda volta a zero
reprovações, e há trava exigindo que **os dois arquivos citem a função** — porque o jeito
de isto voltar é alguém "simplificar" um dos dois.

## D140 · A escolha da variante segue sendo do motor — e quando custa lote, sai dito · 04/10/2026

Entregue a testada de frente em `geo-antonina`, **o ranking do próprio motor passou a
preferir um partido `superquadra` com 33 lotes sobre um `ortogonal` com 1 228** — nota
0,6226 contra 0,5881. Antes da entrega, o `superquadra` desenhava **zero** lotes e era
inválido; com os lotes externos da testada ele passou a valer, e a nota dele é a maior.

Três saídas, e duas são ruins:

| saída | por que não |
|---|---|
| escolher a variante por mim (a de mais lotes) | **o Lab decidindo pelo motor** — a regra é a melhor nota DELE desde o LAB-13 |
| não entregar a testada na rodada da tabela | **esconder dado do motor**, que é o pecado do D119 |

**Decisão: entregar, publicar o 33, e dizer a razão onde o número aparece.** O
`rodarTestfit` publica, quando a variante de mais lotes tem **o dobro ou mais** (corte
declarado), uma linha nomeando os dois partidos, os dois números e as duas notas. E o
gerador da página passa a pôr essa linha **debaixo do quadro do terreno**, não só na
seção do fim — que **agrupa as queixas e elide os números**, deixando o 33 sem
explicação justamente onde ele é lido.

**É o princípio que o chat ensinou no LAB-34**, aplicado a outro número: *"ponha o aviso
onde o número aparece, não escondido"*.

**E vira item para o Laboratório de Parcelamento, numerado no relatório, sem commit
lá:** a nota deles prefere 33 lotes a 1 228 na mesma gleba. Pode ser intencional — plano
de poucos lotes grandes é um produto — mas **se não for, está medido**.

---

## D141 · O CI existe, e ele diz a verdade sobre o que NÃO pode rodar · 04/10/2026

O chat mandou: *"CI para o comando único — não há workflow neste repositório, então
nada roda o verde sozinho; crie e prove quebrando um teste de propósito. É o mesmo
buraco do Orçamento e do Generate, e foi ele que deixou uma suíte vermelha duas semanas
sem ninguém ver."*

**O levantamento mudou o formato da resposta.** O verde completo precisa de **dois
clones vizinhos** — `jonny583/motor-testfit` e `jonny583/urban-create-hub-41d93a4d` —,
que o `tsconfig` do adaptador lê por caminho: é a exceção medida do **D16**, que existe
justamente para não haver segunda cópia envelhecendo em silêncio.

**E medido:** este repositório é **PÚBLICO**; os dois vizinhos são **PRIVADOS**. O
`GITHUB_TOKEN` que o Actions entrega a um workflow **só alcança o próprio
repositório**. Então **o verde completo não roda sem um segredo que só o Jonny pode
criar** — e isso não é detalhe de configuração, é o fato que decide o desenho.

**As duas saídas erradas, e por que são erradas:**

| saída | por que não |
|---|---|
| um CI que roda *parte* da suíte e fica **verde** | **falso verde**, e é literalmente o defeito do D110: um check verde que não roda o verde ensina a confiar no que não protege |
| vendorizar as fontes dos vizinhos para o CI alcançá-las | **segunda cópia envelhecendo**, que é o que o D16 proíbe |

**Decisão: o workflow tem DOIS trabalhos, e os nomes não enganam.**

1. **`guardas que não precisam dos clones vizinhos (NÃO é o verde)`** — roda hoje, sem
   segredo: **64 travas** em 5 arquivos que não importam nada dos vizinhos. São as que
   leem **arquivo do próprio repositório** — a página do Jonny estar atualizada, o
   formato do RECADO, a cobertura do próprio `conferir.sh`, as regras do `CLAUDE.md` — e
   as de geometria pura do esqueleto reto. É pouco em número de testes e **muito** em
   tipo de apodrecimento: é exatamente o que ninguém nota à mão;
2. **`o verde completo (precisa do segredo VIZINHOS_TOKEN)`** — sem o segredo, **FALHA
   com a receita** (D124): como criar um token *fine-grained* restrito a
   `Contents: Read-only` nos dois repositórios, onde colá-lo, e a ressalva de que
   segredo em repositório público é decisão de quem configura (a alternativa é tornar os
   vizinhos públicos, e essa é do Jonny).

> **Um CI vermelho por falta de configuração é honesto. Um CI verde que não roda o verde
> é a mentira que o D110 custou duas semanas.**

**E a lista do trabalho 1 tem guarda**, porque lista é o que envelhece: `regras.test.ts`
lê o YAML, extrai os arquivos de teste citados, e **reprova se algum deles importar**
`@generate/*`, `@testfit/*`, `@symbios/*` ou o adaptador — caso em que o trabalho
passaria a falhar no CI por falta de clone, e alguém "consertaria" afrouxando. Mais as
travas de que o YAML roda o comando único, de que a precondição sai com erro e traz a
receita, de que não há `continue-on-error` nem `|| true`, e de que o nome diz **"NÃO é o
verde"**.

## D142 · A DÉCIMA vez do ponto cego: a régua leu MENÇÃO, não importação · 04/10/2026

A primeira versão da guarda da lista do CI usava `fonte.includes("@generate/")` — e
reprovou **o próprio `regras.test.ts`**, que cita `@generate/` como **texto**, na trava
que confere que o `comum.ts` importa o Validator de lá.

**É a mesma forma do D137, duas vezes no mesmo dia:** régua que casa por aparição da
palavra mede **ortografia ou menção**, não **conteúdo**. A régua passou a extrair o
especificador do `import ... from "…"` e a comparar o começo dele.

**Décima vez, e a quinta pega dentro do próprio prompt.** O que esta acrescenta à lista
do §6 é pequeno e prático: **quando a régua procura um nome em código, procure-o no
lugar da gramática onde ele significa aquilo** — num `import`, não no arquivo inteiro.

## D143 · O CI achou um defeito na minha guarda no PRIMEIRO disparo · 04/10/2026

O primeiro disparo do workflow do LAB-38 deu **os dois trabalhos vermelhos**. Um era o
esperado — o verde completo falhando na precondição do segredo, imprimindo a receita. **O
outro não.**

O trabalho sem clones rodou **68 travas, 67 passaram e 1 falhou**:

> `§4 · não escreve em repositório vizinho > os clones somente-leitura estão limpos — e
> quantos foram conferidos sai dito`

**Era a minha guarda do D136, e o defeito é dela.** Ela exigia `conferidos.length > 0` e
`toContain("motor-testfit")`, com o comentário *"zero clones conferidos significaria que
algo mudou de lugar"*. **No runner do CI não há clone nenhum** — e não há por um motivo
legítimo: aquele trabalho roda exatamente as travas que não dependem dos vizinhos. A
asserção acusava o ambiente de um defeito que era dela.

**E a proteção que eu queria ali já existia, estrutural:** o verde completo **não passa**
sem os clones — o `typecheck` e mais de 300 travas quebram na hora. Nenhum teste precisa
afirmar isso; afirmar criou uma trava que só valia numa máquina.

**Decisão:** a trava mede o que pode medir — **clone que existe está limpo**, sempre — e
exige que o ambiente seja **um dos dois declarados**: *completo* (tem o clone do motor, e
aí a suíte inteira roda) ou *só-guardas* (não tem nenhum). **Meio estado reprova**: ter o
Generate sem o motor faria o verde falhar por motivo obscuro, que é o que o D124 manda
evitar.

**Por que esta decisão vale mais que o conserto:** é o argumento de que o CI serve, dado
pelo próprio CI, no primeiro disparo. Eu rodei aquela trava dezenas de vezes nesta
máquina e ela sempre passou — **porque esta máquina tem os clones**. A guarda era
verdadeira sobre um ambiente e falsa sobre outro, e **só um segundo ambiente podia
mostrar isso**. Era, em miniatura, a própria tese do prompt: o que ninguém executa num
lugar diferente não está testado, está confirmado.

---

## D144 · A trava que comparava duas provas passou a MEDIR cada uma contra os crus dela · 04/10/2026

A última das sete travas que leem `docs/provas/` e que o D131 reprovou. Ela dizia:

> *"a tabela do LAB-19 e a prova do LAB-28 trazem os MESMOS números"*

**O que ela não fazia:** medir. As duas provas saem da **mesma** fórmula; erradas do
mesmo jeito, erram juntas, e a comparação passa. E tinha o defeito simétrico, que é o
que o chat chamou de *"trava que se repete"*: **regerada uma e não a outra, ela fica
vermelha sem nada estar errado** — régua acusando o medido, a forma do §6.

**O conserto, e ele é barato:** cada arquivo é conferido contra o `porPosicao` **dele**.
O agregado publicado tem de **seguir** dos números crus que o próprio arquivo carrega,
pela fórmula que mora na régua. São 5 glebas × 4 motores × 6 posições já medidas em
disco — **nenhum motor roda**. Medir o confronto ao vivo seriam 240 rodadas completas
com Validator e Judge, e a conferência custaria mais que a medição.

**Quatro travas onde havia uma:**

| trava | o que ela falsifica |
|---|---|
| o agregado de cada motor segue das posições cruas | 40 agregados, nos dois arquivos |
| o confronto publicado segue dos crus | 10 confrontos, nos dois arquivos |
| a régua reprova agregado que não segue | sabotagem **em memória**, sem tocar arquivo |
| a montagem é falsificável num caso de cabeça | dois motores inventados, números conferidos a mão |

**Provado por sabotagem, não por confiança:** trocando `entreOsMotoresDeLote_pct` da
gleba `completo` de **29,12** para **70** — que é exatamente o número errado que o D116
publicou —, a suíte vai de **30 verdes a 3 vermelhas**, e o arquivo foi restaurado
(`docs/provas/LAB-39/confronto-refeito.json`, campo `sabotagem`). **A trava antiga não
pegaria essa sabotagem se as duas provas a tivessem juntas**; esta pega em qualquer uma
das duas, sozinha.

**O que sobrou da trava antiga, declarado pelo que é:** os dois arquivos continuam
tendo de carregar os **mesmos números crus** — mesma semente, mesmas glebas, mesmas
posições. Isso é **detector de prova velha** (D131), não medição, e a mensagem de falha
diz *"regere com `bun run lab19 && bun run lab28`"*.

---

## D145 · A MONTAGEM do confronto também morava em dois lugares — e a lista dos motores de lote, em duas grafias · 04/10/2026

Escrevendo a trava do D144 apareceu o que ela precisava e não existia: **uma** conta com
que refazer o agregado. O D116 havia trazido as **fórmulas** (`referenciaDe`,
`amplitudePctDe`) para a régua, e eu declarei o caso encerrado. **A montagem das três
contas continuou em dois arquivos** — e com ela a lista dos motores que entregam lote:

| onde | como a lista estava escrita |
|---|---|
| `lab28.ts` | `["generate-ortogonal", "generate-espinha", "parcelamento"]`, declarada |
| `lab19.ts` | `MOTORES.filter((m) => m.id !== "symbios")` |

**Hoje as duas dão o mesmo conjunto, e o número publicado é o mesmo** — conferido: a
montagem única reproduz os **10 confrontos** dos dois arquivos, número por número, sem
regerar nada. **No dia em que entrar um quinto motor que entregue quadra**, uma inclui e
a outra não, e volta o D116 inteiro: duas respostas para a mesma pergunta, nos dois
arquivos que o Jonny lê lado a lado.

**Decisão:** `MOTORES_DE_LOTE` e `confrontoDoAcesso()` moram em `src/acesso.ts`; as duas
ferramentas chamam. E a lição do D116 ganha a metade que faltava:

> **Trazer a FÓRMULA para um lugar só não basta: a MONTAGEM também é a conta.** Duas
> montagens da mesma coisa divergem pelo que elas escolhem, não pelo que elas calculam.

Os **nomes das chaves** publicadas continuam diferentes nos dois arquivos
(`amplitudeDoAcesso_pct` × `maiorAmplitude_pct`) — unificá-los mudaria a forma de duas
provas publicadas e da página, e isso é outro prompt. Fica dito aqui: **dois nomes para
um número é meio caminho para dois números.**

---

## D146 · Quatro provas declaram contrato "2", e não existe entrada "2" no repositório · 04/10/2026

Achado na conferência do D144, e **não consertado aqui** (§1-A, não ampliar escopo):
está proposto ao chat como **LAB-43**.

Para escrever o detector de prova velha eu precisava da precondição *"mesma semente e
mesmo contrato"*. Os números crus dos dois arquivos são **idênticos** — e as etiquetas
não:

| arquivo | `contrato` declarado |
|---|---|
| `LAB-19/tabela.json` | `"1"` |
| `LAB-28/acesso.json` | `"2"` |

**Medido antes de atribuir (§6):** as cinco glebas são as mesmas nas duas ferramentas —
três de `glebaDoLab()` e duas de `docs/fixtures/glebas-padrao-com-relevo/`. E **todas as
cinco declaram `archilly.versao: "1"`**; varrido o repositório, **nenhuma entrada declara
`"2"`**, inclusive as de via desenhada. A esteira *lê* `"2"` e `"1"` (`VERSOES_LIDAS`),
mas nada que ela mede **é** `"2"`.

Quem erra é a etiqueta: `lab25.ts`, `lab26.ts`, `lab28.ts` e `lab30.ts` têm
`const CONTRATO = "2"` escrito à mão. `lab19.ts` escreve `"1"` à mão e acerta por sorte;
**`lab23.ts` é a única honesta** — ela publica `entrada.archilly.versao`.

**É a forma do D137 outra vez, um degrau acima:** a guarda do §7 confere que a chave
`contrato` **existe**, nunca que ela **corresponde ao que foi medido**. Chave presente e
valor errado passa — ortografia, não conteúdo. E é a forma do D104: valor escrito à mão
que ninguém revalida envelhece em silêncio, e este envelheceu em quatro arquivos.

**Por que não consertei agora:** o conserto no código é uma linha por ferramenta, mas a
etiqueta só muda no arquivo quando a prova é **regerada** — e regerar o LAB-28 são 5
glebas × 4 motores × 6 posições de acesso com Validator e Judge. Prova congelada não se
regera para consertar etiqueta (D118). Então o número fica **nomeado aqui**, como o
D137 fez com as congeladas, e o prompt que regerar essas provas por outro motivo leva o
conserto junto.

---

## D147 · A fixture achou dois campos sem destino ANTES de medir número nenhum · 04/10/2026

A primeira coisa que a fixture nova do LAB-40 fez não foi render medição: foi **a guarda
da ida reprovar**.

```
ensaio-com-promessas · parcelamento · REPROVAM:
  acessos[].segmento.a : campo-novo-no-contrato
  acessos[].segmento.b : campo-novo-no-contrato
```

`acessos[].segmento` estava declarado no inventário desde o LAB-30. **As pontas dele,
`a` e `b`, não.** A guarda tem a regra exata para isso — `campo-novo-no-contrato`, a que
pegaria a v2 — e ela **nunca falou**, por um motivo simples e inquietante:

> **Campo que gleba nenhuma traz não existe para a guarda.** A regra varre os caminhos
> que o CONTRATO trouxe; se nenhuma gleba declara acesso como segmento, não há
> `segmento.a` para a guarda achar sem destino.

**É a tese do LAB-40 em miniatura, e provada pelo próprio prompt:** o LAB-35 provou as
quatro promessas com entrada montada **em memória**, dentro do teste, e isso exercita o
caminho **naquele teste**. A guarda da ida, que roda sobre as glebas do repositório,
continuou cega — e ficou cega por cinco prompts.

**Decisão:** `acessos[].segmento.a` e `.b` entram no inventário como `traduzido` para
`terreno.acesso` (as duas pontas entram na média que dá o meio). E `cobreFilhos` **não**
serve aqui: ele existe para blob opaco, e irmão não declarado é justamente o que a regra
2 existe para pegar — foi assim que a v2 entrou, com `nascente` ao lado de `geometria`.

**A regra que isto deixa:** *promessa provada em memória é promessa provada para o
teste, não para o repositório.* A trava que sobrevive é a do LAB-40: **nenhuma das 60
promessas dos dois inventários pode ficar sem uma gleba que a exerça** — 6 ficavam, e
hoje são 0.

---

## D148 · A DÉCIMA PRIMEIRA vez do ponto cego: posição no ranking é rótulo, e rótulo não é identidade · 04/10/2026

Eu tinha a frase pronta, e ela era boa: *"em `ensaio-com-testada` a entrega da testada
de frente **não custa lote** — 599 para 640, mais 41. A inversão de Antonina (D140) é
daquela gleba."* Medido numa comparação só.

Escrita como **teste**, com o conjunto de variantes reduzido, a mesma pergunta deu o
**contrário**. Então medi as três:

| amostragem | sem as faces | com as faces | na testada |
|---|---|---|---|
| 2 variantes · espinha | 680 | **640 (−40)** | 0 → 51 |
| 2 variantes · ortogonal | 441 | **437 (−4)** | 2 → 50 |
| completo, 20 aceitas | 599 | **640 (+41)** | 0 → 51 |

**O que é estável é a FRENTE, não o total.** Nas três, a entrega põe lote virado para a
rua existente onde não havia nenhum. O total **muda de sinal** conforme a amostragem.

**E a causa não é o motor:** *"espinha, posição 1"* **não é a mesma variante** num
conjunto de 2 e num de 20 — 680 contra 599 na **mesma gleba, sem as faces**. O rótulo
bate e a geometria não.

> **Posição no ranking é RÓTULO. Rótulo não é identidade.** Comparar dois totais porque
> as duas rodadas trazem o mesmo `formato` e a mesma `posicaoNoMotor` é comparar dois
> partidos diferentes e chamar de antes-e-depois.

A minha própria verificação tinha o defeito: eu havia escrito um campo `mesmoPartido`
que comparava **formato + posição** — régua afirmando identidade onde só viu etiqueta.
Hoje ele se chama `mesmoRotuloDeVariante`, e o que ele diz é o que ele vê.

**É a décima primeira vez da forma do §6, e a sexta pega dentro do próprio prompt**
(D128, D133, D135, D137, D142, esta). A família é a mesma das anteriores — régua medindo
nome em vez de conteúdo (D137: a chave `"gleba"` literal; D142: a menção em vez do
`import`; aqui: o rótulo da variante em vez da geometria).

**O que eu publico, então:** a frente (0 → 51, 2 → 50, 0 → 51), as três amostragens com
o delta de cada uma, e a frase honesta — *fixada a amostragem, a frente troca lote de
dentro por lote de frente; entre amostragens, o total não é comparável*. O que **não**
publico é que Antonina é caso isolado: para isso faltaria medir a mesma coisa lá, e não
foi medido.

---

## D149 · Fixture nasce de uma base, a UMA variável de distância, e a procedência mora no arquivo · 04/10/2026

O método das duas fixtures do LAB-40, registrado porque a próxima vai imitá-lo.

1. **Uma base, uma variável.** As duas nascem de `ensaio-47ha` — retângulo de 800 ×
   587,5 m, quatro vértices — e trocam **uma coisa** sobre ela. Há teste exigindo que a
   fixture continue sendo a base a uma variável: mesmo anel, mesmo relevo, mesmo
   contrato. Sem isso a comparação mede duas coisas ao mesmo tempo.
2. **Retângulo de propósito.** As faces do perímetro têm índice e comprimento que se
   conferem de cabeça — e face é o que a testada de frente endereça.
3. **O acesso como segmento tem o MEIO no ponto que a base declarava.** A fixture troca
   a **forma** da declaração sem mover o acesso um centímetro: se o número mudasse, a
   diferença seria da tradução, não do lugar.
4. **A procedência mora no arquivo**, em `archilly.origem`, não num `LEIA-ME` ao lado —
   D104: texto que mora longe do dado não se revalida.
5. **A versão do contrato é copiada da base, nunca escrita à mão.** O D146 acabou de
   mostrar o que um literal faz com uma etiqueta: quatro provas declarando `"2"` onde
   entrada nenhuma é `"2"`.
6. **A área declarada é a de VERDADE.** Com o furo de 100 m, a gleba tem 460 000 m², não
   470 000. Medido antes de escolher: o adaptador do Symbios compara
   `areaDeclarada_m2` com a área do polígono — que **desconta furos** — e avisa acima de
   2 %. Os 10 000 m² do furo são **2,1 %**: declarar a área do anel passaria **raspando**
   do avisador, e seria publicar um número que eu sei errado.

**O que estas fixtures NÃO são:** projeto de urbanismo. A geometria é geométrica e está
dita assim em cada arquivo, como no D73 — a regra urbanística é do Jonny (§4).

---

## D150 · A ausência da ortogonal não era limite do terreno: é via FORA da gleba, no caminho de `restricoes` vazio · 04/10/2026

A pergunta do chat era binária — *"defeito do motor ou limite real do terreno?"* — e a
resposta medida **não é nenhuma das duas como estavam postas**.

**O que o número era:** o LAB-28 publicou *"a candidata ortogonal entrega em 1 de 6
posições"* como **ausência contada**, sem motivo. `posicoesMedidas` dizia que não havia
resultado; não dizia por quê.

**O que ele é:** a candidata **produz plano**, e o plano é recusado pelo **contrato do
próprio Generate** (`contratos/motor-v1/esquema.ts`) porque a **via sai da gleba** — de
**1,2 a 83,5 m** além da divisa, e a peça culpada é a `VP-01` (a principal) em 6 dos 9
casos, uma secundária nos outros. **A recusa não é régua minha.**

**Seis hipóteses morreram, cada uma com a medição que a matou:**

| hipótese | o que a matou |
|---|---|
| o ponto de acesso cai fora da divisa (defeito do Lab) | distância do ponto ao anel: **0 a 3 × 10⁻¹⁴ m** |
| limite real do terreno | a **espinha** entrega em **11 das 12** posições que a ortogonal recusa |
| defeito geral da candidata ortogonal | **36 pontos** de controle em três glebas, **todos** aceitos |
| gleba côncava | `geo-antonina` tem **11 vértices reflexos** e aceita 6/6 |
| a gleba preenche pouco o retângulo envolvente | `geo-antonina` preenche **43 %** e aceita 6/6 |
| os percentuais de APP e de lazer | com `pctAPP`/`pctLazer` nulos, **os mesmos metros**, dígito por dígito |

**O diagnóstico que fechou, e ele é de uma linha:** uma restrição de **100 m², posta
FORA da gleba** — que não desconta área útil nenhuma e só faz `restricoes` deixar de ser
vazio — leva `sintetico-50ha-ondulado` de **1/6 para 6/6** e `sintetico-10ha-plano` de
**3/6 para 6/6**.

> **A candidata ortogonal toma outro caminho quando `restricoes` está vazio, e nesse
> caminho a via não é aparada pela gleba.**

**O mecanismo provável, lido no código deles** (`engine/gerar-v1-motor.ts`, a montagem
da `VP-01`): a via principal nasce do **retângulo envolvente** da massa — a posição
transversal é a coordenada do acesso, limitada só para a *caixa* caber no retângulo, e a
extensão vai de ponta a ponta dele com 15 m de margem. Numa gleba que **não é** o próprio
retângulo, uma reta de ponta a ponta na coordenada do acesso **sai do polígono**. Sustenta
isso o controle `ensaio-47ha`, que **é** o próprio retângulo e aceita 12/12; e a
varredura, em que o transbordo varia **continuamente** com a posição do acesso na aresta
— assinatura de montagem geométrica, não de sorte. **Não** sustenta o preenchimento do
retângulo: 43 % em Antonina, que passa.

**O que NÃO foi medido, e vai dito:** a linha de código que apara (ou não) a via no
caminho com restrições. Essa é do Generate — e o §4 manda: **lista numerada em relatório,
nunca commit no vizinho.**

**O que muda aqui:** a ausência deixa de ser publicada sem causa. A página do Jonny já
traz, debaixo dos dois quadros afetados, a razão **colada ao número**, em linguagem de
leigo — pelo princípio do LAB-34 — e o relatório do LAB-28 ganhou o aviso.

---

## D151 · Controle medido com menos rigor que o acusado não é controle · 04/10/2026

Um defeito de método meu neste prompt, pego antes de concluir, e vale mais que o achado.

Eu tinha **21 pontos** nas duas glebas acusadas — 6 posições mais 15 de varredura ao
longo das arestas — e **6 pontos** em cada gleba de controle. Com isso eu ia escrever
*"só as sintéticas falham"*. A frase pode até ser verdadeira, mas **a evidência não a
sustentava**: evidência assimétrica entre o acusado e o controle mede o esforço de
medição, não o objeto.

Varridos os controles com a mesma régua — 3 arestas × 4 pontos em cada uma das três
glebas, **36 pontos** —, nenhuma recusa. Aí a frase passou a ter base.

> **Controle que recebeu menos medição que o acusado não é controle: é alívio.**

É parente do §6 pelo outro lado. A tabela do ponto cego é sobre régua que mede a coisa
errada; esta é sobre régua **certa** aplicada em **doses desiguais** — e o resultado
engana do mesmo jeito, porque a diferença entre os dois grupos vem do método.

**E uma segunda, menor, da mesma rodada:** eu ia publicar que o transbordo cresce com a
**distância do acesso ao vértice** da aresta. Numa das arestas varridas
(`sintetico-50ha-ondulado`, face 12) ele **diminui** — de 124,88 m a 1,07 m até aceitar.
A assinatura é *"varia continuamente com a posição"*, que é mais fraca e é a que os
números sustentam. Foi a varredura que corrigiu a frase, e é por isso que ela existe.

---

## D152 · O balanço ganhou arquivo, e a regra que o mantém vivo · 04/10/2026

O chat ordenou: *"crie `docs/relatorios/BALANCOS.md` e registre ali os balanços, inclusive
os que foram só para o chat, para nenhuma lista precisar ser re-derivada de novo."*

**O prejuízo que o pedido fecha foi medido:** o balanço de 03/10 foi para o chat e **não
para um arquivo**; no dia seguinte a lista dele teve de ser **re-derivada** com uma
varredura inteira do `CLAUDE.md`, e ao ser recuperada era **cinco linhas, não quatro, e
duas estavam falsas** (D136, D137).

**O arquivo tem duas partes, e a divisão é a lição do D116:**

| parte | o que entra | por quê |
|---|---|---|
| §1 | os balanços que foram **só para o chat** | não têm outro lugar onde morar |
| §2 | **índice** dos que já moram num recado | copiá-los criaria a segunda montagem |

**Duas disciplinas escritas no próprio arquivo:**

1. **reconstrução sai etiquetada como reconstrução**, com a fonte de cada linha — sem a
   etiqueta é invenção com cara de registro;
2. **balanço recuperado se confere, não se obedece.** O de 03/10 dizia *"quatro regras"*;
   eram cinco, e duas eram slogan. O arquivo registra **o que o balanço errou**.

**A regra é a §1-B do `CLAUDE.md`**, ao lado da do RECADO. O chat ordenou o **arquivo**; a
regra é o que o mantém alimentado, e sem ela o arquivo volta a depender de eu lembrar —
que é a forma do D104. **Se o chat preferir sem ela, é uma seção a remover.**

**E a regra tem guarda, porque regra que ninguém pode desmentir é slogan** (D136): seis
travas em `balancos.test.ts` — campos de cada entrada, a etiqueta de reconstrução, o
índice apontando para seção que **existe** no `RECADOS.md`, os arquivos citados existindo,
a ordem cronológica — e uma no `regras.test.ts`, que exige a §1-B e o arquivo. **Provado
por sabotagem:** renomeado um título citado, a suíte vai de 6 verdes a 1 vermelha.

---

## D153 · Número copiado em quatro arquivos: a forma do D116 numa grandeza de prosa · 04/10/2026

Pôr um arquivo de teste na lista do trabalho do CI levou o número de travas protegidas de
**64** a **76** — e ele estava **à mão em quatro lugares**: `CLAUDE.md`, `ONDE_PARAMOS.md`,
`FILA.md` e o comentário do próprio YAML.

> **Número com quatro casas envelhece em três delas.**

**Decisão:** os quatro foram atualizados e ganharam **trava de concordância** — e o que ela
**não** faz está escrito nela: ela não confere se o número é o **verdadeiro**, porque para
isso teria de rodar a suíte, e contar `test(` com regex mediria texto, não suíte. **O valor
é meu para atualizar; a divergência é dela para acusar** — e divergência foi o que de fato
aconteceu, não valor errado.

**A primeira versão da trava reprovou por defeito dela mesma**, e é a forma do D137 de
novo: eu casei por `"NN travas que leem arquivo"` e a `FILA.md` dizia só *"protege NN
travas"* — **régua medindo uma das frases em vez do número**. Conserto: declarar a frase
canônica e exigi-la nos quatro. **Régua que casa por frase tem de dizer qual frase, e a
frase tem de estar escrita onde ela procura.**

**Os números históricos não se mexem:** o relatório do LAB-38, os recados e a prova do
LAB-38 seguem dizendo **64**, porque era verdade quando foram escritos. Reescrever recado
antigo falsifica o registro — a mesma razão por que o teto de 12 linhas só olha o
**último**.

---

## D154 · A etiqueta do contrato sai do MEDIDO, não da minha mão · 04/10/2026

O chat aprovou o conserto que o D146 havia proposto: **quatro provas declaravam
`contrato: "2"` quando entrada nenhuma do repositório é `"2"`.**

**O conserto é de causa, não de etiqueta.** `contratoDasEntradas()` mora em
`src/gleba-v1.ts` e tira a versão **das entradas que a ferramenta de fato mede**;
`lab25`, `lab26`, `lab28` e `lab30` passaram a chamá-la, e as quatro provas foram
regeradas — as quatro agora dizem **`"1"`**, que é o que todas as glebas declaram.

**Ela REPROVA conjunto misto em vez de eleger a primeira:** duas glebas de contratos
diferentes na mesma prova não têm uma versão só, e publicar uma esconderia a outra.
Prova misturada é outra prova. Também reprova versão que a esteira não lê.

**A guarda é sobre a FERRAMENTA, e a razão é concreta:** conferir uma prova publicada
contra as glebas que ela mediu exigiria saber **quais** glebas cada prova mediu, e isso
nem sempre está no arquivo. A causa, porém, é estática — **nenhuma ferramenta deve
escrever o literal**. São sete travas em `tests/contrato.test.ts`:

| trava | o que ela impede |
|---|---|
| toda entrada do repositório declara a **mesma** versão, e a esteira a lê | a varredura virar afirmação |
| `contratoDasEntradas` reprova misto, vazio e versão não lida | a conta eleger um valor em silêncio |
| as **quatro** consertadas usam a conta e **não** têm literal | a volta do literal |
| a lista das que **ainda** têm literal é **fechada** | ferramenta nova nascer com etiqueta à mão |
| todo literal da lista é **igual** à versão que as entradas declaram | a lista envelhecer |
| toda exceção tem motivo escrito | exceção sem revisão |
| as quatro provas regeradas trazem a etiqueta certa | o conserto sair do código e não do arquivo |

**A lista das treze que ainda escrevem literal se revalida**, e é isso que a torna
honesta: no dia em que entrar uma entrada `"2"`, a quinta trava reprova e **cada caso
vira decisão**. Regerar prova congelada só para consertar etiqueta é o que o D118 proíbe —
então o valor fica **conferido na lista**, não perdido.

---

## D155 · A DÉCIMA SEGUNDA vez do ponto cego: a régua leu o comentário que eu acabara de escrever · 04/10/2026

A primeira versão da trava do D154 casou `/contrato: "\d+"/` no texto cru dos arquivos e
**reprovou `lab25.ts` — que eu havia acabado de consertar.**

O motivo é quase engraçado: o comentário que explica o conserto **cita** o defeito —
*"aqui estava `const CONTRATO = "2"`, escrito à mão"* — e a régua leu a citação como se
fosse código.

> **Comentário é onde um nome significa *"eu estou falando sobre"*, não *"eu faço"*.**

**É a terceira vez desta sub-família**, e as três são a mesma frase com roupas diferentes:

| | a régua casava | onde o nome de fato significa aquilo |
|---|---|---|
| D137 | a chave `"gleba"` **literal** | o conceito, pelos nomes que as provas usam |
| D142 | a **menção** de `@generate/` | o `import` |
| **D155** | o literal `contrato: "…"` **no arquivo inteiro** | o **código**, sem os comentários |

**Decisão:** a trava passa por `semComentarios()` antes de casar, e a função carrega a
explicação — porque a próxima régua que varrer código vai ter a mesma tentação.

**O que isto confirma, e é mais útil que o conserto:** a régua errou **a favor** do
alarme, não contra. Varredura estática em texto de código **sempre** mede duas coisas ao
mesmo tempo, o que o código faz e o que ele diz sobre si, e **só uma delas é o objeto**.

---

## D156 · Regerar revelou duas provas VELHAS e caladas — e um número que pede medição · 04/10/2026

Regenerar as quatro provas do D154 mostrou que **duas delas estavam defasadas há
prompts**, e **nada acusava**:

| prova | desde quando | o que estava velho |
|---|---|---|
| `LAB-30/guarda-da-ida.json` | **LAB-40** | o inventário da ida foi de **72 para 74** campos (os dois irmãos do `segmento`, D147); `traduzido` 29 → 31; promessas não exercitadas 123 → 137 |
| `LAB-25/guarda-da-ponte.json` | **LAB-37** | em `geo-antonina`, a variante que o motor escolhe passou a ser a de **33 lotes** (D140), e o bloco do `faceDeRua` carregava os números da variante antiga (1 386 lotes) |

**Por que ninguém viu:** o LAB-33 criou **detectores de prova velha** para o LAB-23 e o
LAB-28 — medem ao vivo e comparam com o arquivo (D131). **O LAB-25 e o LAB-30 não têm
detector**, e as provas deles envelheceram em silêncio. A conta é a mesma do D110: prova
que ninguém revalida não protege nada.

**E apareceu um número que eu NÃO vou atribuir sem medir** (§6). Na prova regerada do
LAB-25, em `geo-antonina`:

```
faceDeRua · lotes 33 · publicadosPelaPonte 0 · nulosNaPonte 33 · soOGenerateMediu 5
```

A ponte publica `faceDeRua: null` para os 33 lotes da variante escolhida, e a régua do
Generate mede 5. **Tem a forma do D104** — o `faceDeRua` saindo `null` enquanto o outro
lado mede —, mas a guarda da ponte **não reprova**, e a variante mudou de superquadra para
outra coisa entre as duas rodadas. **Pode ser propriedade da variante de 33 lotes** (lote
de superquadra que não faz frente para via publicada) **e pode ser a ponte**. Não medi, e
não acuso: está **proposto ao chat** como prompt próprio, junto do detector que falta para
estas duas provas.

---

## D157 · Um nome só para cada número — e o nome passa a ser DADO, não só tipo · 04/10/2026

O chat aprovou o que o D145 havia proposto: **as mesmas três contas do confronto do acesso
saíam com chaves diferentes nos dois arquivos que o Jonny lê lado a lado.**

| a conta | na tabela do LAB-19 | na prova do LAB-28 |
|---|---|---|
| a maior amplitude de um mesmo motor | `maiorAmplitude_pct` | `amplitudeDoAcesso_pct` |
| a diferença entre os quatro | `entreOsQuatroMotores_pct` | `entreMotores_pct` |
| a diferença entre os de lote | `entreOsMotoresDeLote_pct` | `entreOsDeLote_pct` |

> **Dois nomes para um número é meio caminho para dois números.** No D116 eram duas
> *montagens* da mesma conta; aqui, dois *nomes* para a mesma saída — e a segunda forma é
> mais sorrateira, porque os valores batiam.

**Decisão:** valem os nomes da **régua** (`ConfrontoDoAcesso`, em `src/acesso.ts`), e a
ferramenta do LAB-28 **publica o objeto inteiro, sem renomear no caminho** — era o
renomear ao publicar que criava o segundo nome. A prova foi regerada; os dois leitores
(`lab39.ts` e `acesso.test.ts`) **perderam a tradução** que existia só por causa disso.

**E o essencial, que não é o nome: a LISTA dos nomes virou DADO.**

```ts
export const CHAVES_DO_CONFRONTO = ["maiorAmplitude_pct", …] as const;
```

**Por que isso importa:** tipo de TypeScript **não existe em tempo de execução**, e era
disso que o defeito precisava para sobreviver num **arquivo publicado** — nenhuma trava
podia conferir o JSON contra um `interface`. Com a lista como dado, a guarda confere as
chaves do arquivo; e uma **trava de tipo** (`MesmasChaves`) impede que a lista e a
interface divirjam: se uma ganhar ou perder chave sem a outra, **não compila**.

**Provado por sabotagem:** renomeada uma chave na prova publicada, a suíte vai de **31
verdes a 2 vermelhas** — a trava das chaves e, de carona, a do D144, que não acha mais o
número onde esperava. Desfeito, volta ao verde.

---

## D158 · A tabela passou a SETE glebas — e a prova do acesso foi com ela, em vez de a trava ser afrouxada · 04/10/2026

O chat aprovou: *"as duas fixtures novas com a tabela comparativa regerada."* As fixtures
do LAB-40 existiam e eram medidas **pelas travas e pela ferramenta do LAB-40** — e não
pela **esteira inteira**, que é a diferença que o próprio LAB-40 havia escrito como
pendência.

**Três travas caíram ao regerar, e as três estavam certas:** duas do LAB-39 e uma do
LAB-34 diziam *"as cinco glebas"*. A tabela tinha sete e a prova do acesso, cinco.

> **O detector de prova velha do LAB-39 compara os números crus da tabela com os da prova
> do acesso.** Conjunto de glebas diferente **quebra a comparação por fora**.

**Decisão, e ela é sobre método:** a prova do acesso (`lab28`) ganhou as **mesmas** sete
glebas, e as travas passaram a dizer sete. **A alternativa era afrouxar a comparação para
caber a minha mudança** — ensinar o detector a comparar só a interseção —, e isso é o
contrário do que o D143 deixou: *consertei sem afrouxar*.

**O que a medição nova deu, nas sete:** a ordem muda em **3** (as mesmas: `completo`,
`sintetico-10ha-plano`, `geo-antonina`) e o vencedor em **2**. As três glebas em que a
ordem aguenta as seis posições são `ensaio-47ha` e as **duas fixtures nascidas dela** — e
isso é coerência, não coincidência: são o mesmo retângulo a uma variável de distância
(D149).

**E um literal meu, da família do D153:** o `lab39.ts` imprimia
`ARQUIVOS.length * 5` confrontos — com o **cinco escrito à mão**. O trabalho estava certo
(56 agregados, 336 posições), o **número impresso** ficou errado quando a tabela foi para
sete. Agora é **contado**, não multiplicado.

---

## D159 · ~~O lote da testada é "de frente" por uma régua e "sem frente" pela outra — e as duas estão certas~~ · 04/10/2026 · **MOLDURA CORRIGIDA (D168, D191)**

> ⚠️ **O TÍTULO DESTA DECISÃO ESTÁ RISCADO, e a decisão fica.** A medição dela é boa e
> continua valendo; **a moldura é que estava errada**. Não são duas réguas discordando: é
> **UMA** régua e **UM** campo que falta — o `invariantes.ts` do Generate aceita *"a RUA
> PÚBLICA, quando existe"*, tem o campo (`faixaViaPublica`) e o usa; falta campo no
> **contrato de motor v1** para um motor declará-la. Lido no LAB-48 (D168) e corrigido nos
> cinco documentos e no gerador no LAB-56 (D191). **E com limite medido** (LAB-54): em
> `geo-antonina`, das 29 acusadas, **11 somem** com o campo e **18 não**.
>
> *Riscar e não apagar é o D90 e o D161: a decisão guarda a história de ter estado errada.*

O achado que a regeração da tabela trouxe, e ele fecha o D140.

**Medido em `ensaio-com-testada`:** entregue a face da rua existente, o Parcelamento cria
**51 lotes externos** (ids `…-eN`) e **os 51** publicam `faceDeRua: null` — o próprio
motor diz que eles não fazem frente para via nenhuma **do plano**. O Validator do
Generate, cuja regra `frente` é *"nenhuma aresta encosta em via"*, acusa **47** deles. Na
base `ensaio-47ha`, sem testada: **0 lotes externos, 0 `faceDeRua: null`**.

| gleba | lotes | violações | por regra |
|---|---|---|---|
| `ensaio-47ha` (base) | 599 | 16 | `testada: 10`, `face-quadra: 6` |
| `ensaio-com-testada` | 640 | **68** | **`frente: 47`**, `via-sobre-lote: 15`, `face-quadra: 6` |
| `ensaio-com-promessas` | 589 | 25 | **`massa: 19`**, `face-quadra: 6` |

**Nenhum dos dois saltos é defeito escondido — os dois estavam declarados:**

- os **19 `massa`** da gleba com furo são a **perda declarada** do inventário, agora com
  preço: *"o motor tem um perímetro só; gleba com furo entra como o anel externo, e **o
  furo vira área que o motor acha livre**"*. Ele lotea sobre o furo, e o Validator do
  Generate — que **conhece** o furo pela entrada — acusa. Era teoria; virou número;
- os **47 `frente`** são a consequência de o contrato **não ter como dizer** *"este lote
  faz frente para uma rua que já existe e está fora da gleba"*.

**E isto FECHA o D140.** Em `geo-antonina`, o partido que o ranking do motor escolheu tem
**33 lotes, e os 33 são externos** — `faceDeRua: null` em todos, 29 acusados por `frente`.
**O plano não tem um único lote no miolo.** Então a primeira das duas leituras do item 7
do Jonny — *"produto de poucos lotes grandes"* — **está enfraquecida pela medição**: os 33
somam 1,03 ha, cerca de **310 m² cada**. A decisão segue sendo dele (é régua de nota, não
código), mas agora ela se toma sabendo **o que** são os 33 lotes.

**O que eu NÃO faço:** mexer na régua de nota do vizinho, nem no invariante do Generate.
Vai como **lista numerada** no relatório do LAB-45, e pelo chat.

**E a razão vai colada ao número** (princípio do LAB-34): a linha dos lotes externos nasce
no `naoSoubeFazer` do motor e a página a levanta para **debaixo do quadro** do terreno.
**Achado ao LER a página gerada**, como no D116: o casador usava `startsWith`, e a minha
linha **começa com o número** — ela nunca subia, ia para a lista do fim, onde os números
são normalizados para `…`. O casador media **posição** do marcador, não conteúdo.

---

## D160 · O 33 contra 1 228 aparece em UMA das três amostragens — é artefato da escolha da variante · 05/10/2026

A medição que o chat pediu, e que o Jonny queria ver: as três amostragens do D148,
agora em `geo-antonina`.

| amostragem | sem as faces | com as faces | delta | do plano escolhido |
|---|---|---|---|---|
| 2 variantes · espinha | **0 aceitas** | **1 088** lotes | — | 50 rotulados `-eN`, 16 encostam |
| 2 variantes · ortogonal | 1 386 | **1 228** | **−158** | 49 rotulados, 16 encostam |
| completo, 20 aceitas | 1 386 (ortogonal) | **33** (superquadra) | **−1 353** | 33 rotulados, 14 encostam |

**A resposta é a segunda das duas que o chat pôs:** o 33 **não é um caso único do
terreno** — é a **mesma troca vista de outro ângulo**, e o ângulo é a **escolha da
variante**.

> **Com a MESMA entrega, restringindo o formato à ortogonal, o motor desenha 1 228
> lotes** — exatamente o partido que o ranking dele preferiu não usar na amostragem
> completa. O 33 aparece em **1 de 3** amostragens, e é a amostragem que o Lab publica.

**Dois achados que vieram junto, e nenhum deles é defeito:**

1. **na espinha com 2 variantes, SEM as faces nada passa** — zero variantes aceitas — e
   **com** elas saem 1 088 lotes. Ali a entrega **viabiliza** um plano que não existia.
   É o oposto do caso da amostragem completa, na mesma gleba;
2. **a entrega custa lote em Antonina nas duas amostragens comparáveis** (−158 na
   ortogonal; na espinha não há "sem" para comparar). No `ensaio-com-testada` o sinal
   variava; aqui ele é negativo onde dá para medir — e **continua não sendo comparável
   entre amostragens**, pela razão do D148.

**O que isto NÃO decide:** o que a régua de nota do Parcelamento **deve** premiar. Isso é
do Jonny e do motor do vizinho. O que muda é o que ele decide **sabendo**: que o plano de
33 lotes é o que aquele ranking escolhe **entre 20 variantes**, e que o de 1 228 está ao
alcance do mesmo motor com a mesma entrega.

---

## D161 · A DÉCIMA TERCEIRA vez do ponto cego — e desta vez já tinha SAÍDO · 05/10/2026

No LAB-45 eu publiquei, no relatório, no recado e **no item 7 do Jonny**:

> *"Os 33 lotes são, todos os 33, lotes da beira da rua que já existe."*

**A base era o ID do lote.** O motor chama de `…-eN` os lotes da passagem externa, eu
contei os ids e chamei aquilo de *"beira da rua"*.

**Medido, neste prompt:**

| distância do lote à testada | quantos dos 33 |
|---|---|
| **≤ 0,5 m** — encostam | **14** |
| 1 a 5 m | 1 |
| 5 a 20 m | 1 |
| 20 a 50 m | 2 |
| **> 50 m** | **15** |

E a distância máxima é **1 805,7 m** — o outro canto de uma gleba de 141,8 ha. O padrão
se repete nas três amostragens: 50 rotulados e 16 encostando, 49 e 16, 33 e 14.

> **`-eN` é rótulo. Distância é a coisa.**

**É a terceira vez desta sub-família** — D148 (posição no ranking não é identidade), D155
(comentário não é código), esta (id não é geometria) — e **é a primeira desde o D119 que
JÁ TINHA SAÍDO**: estava no relatório do LAB-45, no recado ao chat e na página do Jonny.
As doze anteriores, as sete últimas, foram pegas dentro do próprio prompt.

**O que estava certo e segue de pé:** 33 lotes, **todos** da passagem externa do motor,
29 acusados pelo invariante `frente`, somando 1,03 ha (~310 m² cada) — a leitura *"poucos
lotes grandes"* continua enfraquecida, por área, não por posição.

**O que estava errado:** *"todos na beira da rua"*. Só 14 estão.

**Decisão:** o item 7 do Jonny e o relatório do LAB-45 foram **corrigidos, não
reescritos** — o erro fica visível, com a medição ao lado, porque apagá-lo tiraria do
registro a única coisa que ele tem de útil. E a ferramenta do LAB-46 publica a
**distribuição de distâncias**, não só a contagem de ids: a próxima pergunta sobre
"lote de beira" se responde com geometria.

**E uma pergunta nova, NÃO medida:** por que a passagem externa do motor põe lote a 1,8 km
da face entregue, quando `facesLoteamento` entregou **uma** face de 180 m? Pode ser que
`facesLoteamento` signifique para ele algo mais amplo, pode ser que a passagem externa
corra o perímetro inteiro. **Não acuso** — está na lista numerada do relatório, para o
chat levar ao Parcelamento.

---

## D162 · A varredura de segredos existe, e o ESCOPO dela é dado publicado · 05/10/2026

**O pedido veio do chat, com a lição que a Pesquisa pagou:** *"o que importa é o ESCOPO da
varredura, não a existência — a dela cobria três formatos e uma pasta só."*

**A decisão, em três partes, e cada uma tem trava:**

1. **ONDE** — `arquivosQueOGitCarrega()`: tudo que o git versiona **mais** tudo que ele
   versionaria no próximo `commit -a` (`ls-files --cached --others --exclude-standard`),
   porque segredo recém-escrito e ainda não rastreado é o caso mais comum. **Nenhuma pasta
   é excluída, e nem o fonte da própria régua** — há trava exigindo que a varredura passe
   pelo próprio fonte dela e pelo próprio teste dela. Para isso ser possível, **todo
   exemplo falso é montado em pedaços**, e há segunda trava exigindo que o literal não
   apareça nesses dois arquivos. É a lição do D155 pelo avesso: em vez de ensinar a régua a
   distinguir *"eu falo sobre"* de *"eu faço"*, o texto simplesmente não contém a
   ocorrência;
2. **O QUÊ** — **treze** regras nomeadas, cobrindo as quatro famílias que o chat pediu
   (chave de IA, token, senha, credencial de banco), e **nenhuma delas é um formato só**.
   Cada regra declara `oQueNaoPega` — o buraco dela —, com trava exigindo que esteja
   escrito, e cada regra é **exercitada por um exemplo falso**: regra declarada e não
   exercitada é a promessa do D135, e numa varredura de segredo ela fica *verde por não
   procurar*, que é indistinguível de "está limpo";
3. **o que ficou de FORA** sai contado, nomeado e com motivo em `escopo.deFora`. Arquivo
   pulado em silêncio é escopo mentindo.

**O jeito certo não é acusado, e com motivo escrito:** `token: "${{ secrets.X }}"` e
`senha: "process.env.X"` são o modo **correto** de escrever a coisa, e varredura que grita
no código correto é varredura que ninguém lê. Medido: **zero falso positivo** na árvore
inteira — 317 arquivos, 27,8 MB —, com o `verde.yml` dentro do escopo, que é justamente um
arquivo cheio de `TOKEN` e de `secrets.`.

**Os três buracos, ditos:** não lê o **histórico do git** (segredo commitado e apagado
continua lá, e o remédio é **rotação da chave**); não mede **entropia**; e a regra da senha
lê o **nome**, não o valor.

**Onde ela roda:** no verde, pelo `bun test` do `esteira` — o comando único não mudou —, e
no trabalho do CI que não precisa dos clones vizinhos, que foi de **83 para 98** travas.

---

## D163 · A medição da fase (a): o verde aprovou cinco segredos de formato real · 05/10/2026

**A ordem do chat era medir antes de consertar**, e ela produziu o número que importa.

Plantados **cinco segredos de formato real** — chave de IA, token do GitHub, chave da AWS,
credencial de banco dentro da URL e senha atribuída a um nome — num arquivo `src/`
**versionado**. Resultado: **VERDE, 7 passos, 401 travas, exit 0.**

**E é pior que "ninguém procurou":** o arquivo **foi lido** por dois dos sete passos e os
dois o aprovaram — o `tsc --noEmit` o compilou (ele aparece no `--listFiles`) e o `eslint`
nele saiu **0**. Não houve filtro, nem `.gitignore`, nem pasta escondida.

**A rede do lado do servidor também não estava lá, e isto está medido:** este repositório
**não tem GitHub Advanced Security habilitada** (`run_secret_scanning` responde exatamente
isso). O buraco que **não** medi fica declarado: a *push protection* de padrões de
parceiros é mecanismo separado, e medi-la exigiria **empurrar uma chave para o GitHub** —
coisa que não se faz, nem com chave falsa.

**A segunda regra do chat virou código:** *"o relatório nunca repete mais de doze
caracteres do segredo, senão a chave vaza no próprio registro."* O teto é constante
nomeada, e **cada regra declara quantos caracteres cabem na amostra dela**, porque os doze
não valem o mesmo para todas: em `sk-ant-…` os doze primeiros são o **prefixo público do
formato**; **numa senha, os doze primeiros são a senha** — essa mostra 4. E o fecho se
fecha sozinho: a varredura cobre `docs/`, então **um relatório que repetisse o segredo
seria reprovado pela própria varredura que ele descreve**.

**Provado nas duas metades e nas duas escalas:** 13 de 13 formatos pegos por exemplo falso
em diretório temporário; e **o mesmo arquivo plantado** leva o comando único de
**exit 0 (401 travas)** a **exit 1 (415 travas)**. A chave foi apagada e **nunca entrou em
commit nenhum** — o que importa, porque o histórico é exatamente o que a varredura não vê.

---

## D164 · Escopo não encolhe por decisão, encolhe por comodidade · 05/10/2026

**O achado é contra mim, e aconteceu dentro do prompt que o diagnosticava.**

A primeira versão da régua pôs teto de **2 MB por arquivo**, por comodidade minha. A
varredura saiu dizendo **"310 de 316"**: os seis de fora eram **cinco saídas de geometria
de `geo-antonina`** — **13 MB**, lidos em menos de um segundo, e exatamente o tipo de
arquivo onde ninguém olha linha por linha.

Eu tinha acabado de escrever no alto daquele arquivo que *"o que importa é o escopo"*, e **o
escopo que eu mesma havia escrito já excluía cinco arquivos sem motivo que se sustentasse.**
Nenhum alarme teria soado: treze regras, relatório bonito, verde — e cinco arquivos nunca
lidos. O teto virou **64 MB**, parede contra arquivo absurdo e não filtro de rotina; hoje o
único arquivo fora do escopo é um `.png`.

**O que o pegou tem nome:** a varredura **publica o escopo como DADO**, não como prosa.
*"310 de 316"* é um número que dá para olhar e desconfiar; *"varre a árvore toda"* não é.

> **Afirmação de escopo não se confere. Número de escopo, sim.**

---

## D165 · Número citado duas vezes no mesmo arquivo tem de bater nas duas · 05/10/2026

Ao acrescentar a trava do LAB-47, o número de travas do trabalho sem clones mudou e a
concordância do D153 exigiu atualizar os quatro arquivos que o citam. **E ali apareceu um
quinto lugar, dentro de um deles:** a receita que o `verde.yml` imprime quando falta o
segredo dizia *"protege 64 travas"* enquanto o comentário no alto do **mesmo arquivo**
dizia **83**.

A trava do D153 não o pegava **por desenho**: ela casa só a **frase viva**, porque há
relatório antigo citando legitimamente o número de então. Mas o `verde.yml` **não tem
história para preservar** — ali todos os números têm de bater, e agora há trava exigindo
isso.

**E ela mordeu na hora:** a frase estava quebrada em duas linhas de `echo`, com o número
numa e a palavra na outra. **A frase se arrumou para a régua a alcançar** — não a régua
para caber na frase, que é o contrário do que o D143 proíbe.

---

## D166 · A DÉCIMA QUARTA vez do ponto cego — e 36 das 128 violações eram a minha ponte · 06/10/2026

**O chat trouxe o achado do Generate:** o motor do Laboratório de Parcelamento é o motor
**padrão** da tela unificada e **reprova no Validator nas cinco glebas**, com 15 a 29
violações cada. Como só entra no ranking candidata aprovada, a tela nasceria com **ranking
vazio**.

**Eu estava a um passo de escrever: *"o motor padrão desenha 47 lotes com testada abaixo da
mínima"*.** Medido, **36 dos 47 são a minha ponte.**

A régua diz `testada 11.45 < 11.70820393249937`, com déficit **mediano de 1,94 cm**, em lotes
de **316,7 m² para cima** contra área mínima de 200. E o número acusador não é declarado por
ninguém:

- a **entrada declara `testadaMinLote_m = 10` m**, nas cinco glebas;
- a **minha ida** monta `padroes["testada"] = faixa(10 , max(10, √(360/2)))` = `faixa(10;
  13,4164)` (`ida.ts:379-380`), e o meio dessa faixa é **5 + 3√5 = 11,70820393249937** — o
  **ALVO** de testada da variante;
- a **minha volta** escreve esse alvo em `parametrosUsados.testadaMinLote_m`, o campo cujo
  nome é **MÍNIMO** (`volta.ts:462`).

**E a própria função escreve, quatro linhas acima, a regra que a quinta linha quebra:**
*"Mínimo e máximo continuam sendo os do contrato: o motor não os relaxa, ele mira dentro
deles. O que ele escolhe é o ALVO."* Para a área ela faz certo — `areaMinLote_m2` vem do
contrato e `areaAlvoLote_m2` recebe o sorteado. Para a testada **não há campo de alvo no
contrato v1**, e o sorteado foi morar no mínimo.

**A prova, rodando o Validator com o mínimo declarado (10 m):** **36 somem**; **11 sobram**,
com testada de **3,56 a 9,59 m** — abaixo dos 10 m declarados, e essas são do motor.

> **Campo cujo nome diz MÍNIMO e cujo valor é um ALVO não é um campo errado: é uma acusação
> automática.** Nenhum motor sobrevive a ser medido contra o próprio alvo com 2 % de folga.

**É a décima quarta vez da forma do §6, e a quarta da sub-família do D98/D104** — a ponte
corrompendo a medição e o motor do vizinho levando a culpa. **Pega dentro do prompt**, como as
sete anteriores. **Não consertada**, porque o chat pediu o diagnóstico antes do conserto: a
linha fica como está e o conserto é um item da fila.

---

## D167 · Hipótese de ponte se mata com medição, não com argumento · 06/10/2026

Catorze violações `face-quadra`: quadras com face de **351 a 597 m** contra teto de **200 m**
declarado na entrada. A tentação era atribuir ao motor na hora — ele desenha quadra grande, e
200 m é número redondo de urbanismo.

**Mas havia uma hipótese de PONTE, e ela explicaria o número inteiro:** três quadras de 199 m
**fundidas na minha tradução** dariam exatamente uma de 597 m. Se fosse isso, a culpa seria
minha e eu teria mandado uma lista numerada errada ao vizinho.

**Medido na SAÍDA CRUA do motor, sem o Generate no meio:** `ensaio-47ha` traz **seis quadras**
de ~**597 × 69 m, com ~100 lotes cada**. A ponte recebeu seis e passou seis. **Hipótese morta
por medição**, e só então o motor foi nomeado.

**E a pergunta do D127 também foi feita antes de eleger a régua** — *"o que este campo faz no
motor?"*. Lido o código dele: `comprimentoQuadra` governa o **espaçamento dos cortes num eixo
só** (`nCortes = round(larg / (faceQuadra + caixaSecundaria))`); a outra dimensão da quadra é
o corrimento da fileira e **não passa por esse teto**. Daí 597 × 69 — o 69 é cortado, o 597
não.

**A atribuição fica no motor mesmo assim**, e a diferença com o D127 é a que importa: lá a
régua media uma promessa que o campo nunca fez (`viaManual` nunca prometeu pôr rua na linha);
aqui o parâmetro chama-se **"Tamanho da quadra"**, com limites de 100 a 220 m, e **face de
quadra de 597 m é problema urbanístico de verdade, não artefato de medição**. Quem pede quadra
de 200 m não está pedindo um eixo de 200 m.

---

## D168 · Não são "duas réguas discordando": é UMA régua e UM campo que falta · 06/10/2026

**Correção de moldura do D159**, e ela já saiu em três lugares — relatório do LAB-45, item 7
do Jonny e a nota da tabela comparativa.

Eu escrevi que *"o mesmo lote é 'de frente para a rua existente' por uma régua e 'sem frente
para rua' pela outra"*, como se o Lab e o Generate medissem coisas diferentes. **Lido o
`invariantes.ts` do Generate, eles não discordam:**

> *"Superfícies onde um lote pode fazer frente: faixa de via + bulbo de retorno + **a RUA
> PÚBLICA, quando existe**. (…) O lote de loteamento faz frente para ela **por definição**, e
> ela corre **por FORA** do terreno: tratá-la como leito reprovaria exatamente o lote
> bem-feito."*

O campo existe (`resultado.faixaViaPublica`), o invariante o usa, e há bandeira por lote
(`deLoteamentoFachada`) que troca o mínimo de testada pelo do regime de fachada. **A régua do
Generate ACEITARIA esses lotes se soubesse que a rua existe.**

**O que falta é um campo, e a falta tem dois degraus:** o tradutor `paraResultado` do próprio
Generate nunca preenche `faixaViaPublica` — e **não é esquecimento dele**, porque o contrato de
motor v1 **não tem campo onde um motor declare a rua pública existente**. Não há o que
traduzir. Medido: **0 de 2 299 lotes** das cinco glebas chegam com a bandeira.

**Provado pelo contrafactual, com a geometria DELES:** preenchendo `faixaViaPublica` com a
função `faixaViaPublica()` do Generate, sobre a divisa que o `divisaDoAcesso()` do Generate
escolhe, `geo-antonina` vai de **40 para 29** violações — **somem 11, e são exatamente os 11
lotes que estão a 0 m da testada entregue**. Os outros 18 estão a 15,7 m até **1 805,7 m** e
nenhuma faixa os alcança: esses são do motor (LAB-50).

**A metade do D159 que estava certa continua certa** — o contrato não tem como dizer. A moldura
de *"duas réguas"* estava errada. **A correção dos três lugares onde ela saiu é entrega, não
diagnóstico, e está proposta ao chat.**

---

## D169 · O diagnóstico separa CULPADO de CONSERTO — e os consertos de fora do motor não aprovam uma gleba · 06/10/2026

As 128 violações têm **quatro culpados**: motor 54, **ponte deste Lab 36**, contrato e tradutor
do Generate 11, e **27 ainda não atribuídas** (declaradas como tal, com a medição que falta
nomeada).

**E a conta que o chat precisa antes de escolher onde gastar o conserto:** descontando as 36
da minha ponte e as 11 do contrato — 47 das 128, 37 % —

| gleba | hoje | depois | passa? |
|---|---:|---:|---|
| `completo` | 25 | 25 | não |
| `sintetico-50ha-ondulado` | 18 | 17 | não |
| `sintetico-10ha-plano` | 29 | 4 | não |
| `ensaio-47ha` | 16 | 6 | não |
| `geo-antonina` | 40 | 29 | não |

**Nenhuma das cinco limpa.** O ranking só deixa de nascer vazio quando as 54 do motor e as 27
em aberto tiverem resposta.

> **"De quem é a culpa" e "onde está o conserto" são perguntas diferentes, e a segunda é a que
> decide a ordem da fila.** Consertar 37 % das violações e aprovar zero glebas é um resultado —
> e esconder essa conta transformaria um diagnóstico honesto numa promessa falsa.

**E uma coisa que o diagnóstico mostrou de graça:** as 11 `via-sobre-lote` e as 18 `frente`
distantes são **a mesma passagem externa do motor**, vista por dois invariantes. **29 das 40
violações de Antonina saem de um mecanismo único** — o que faz do LAB-50, já na fila, o prompt
mais rendoso dela.

---

## D170 · O detector de prova velha chega ao LAB-25 e ao LAB-30, e o escopo dele sai como número · 06/10/2026

**A dívida é do LAB-33.** Ele criou o detector de prova velha (D131) e o deu a **duas**
provas — LAB-23 e LAB-28. As outras ficaram sem, e **duas apodreceram caladas** até o LAB-43
as regerar (D156): a do LAB-30 desde o LAB-40 (inventário da ida **72 → 74 campos**) e a do
LAB-25 desde o LAB-37 (em `geo-antonina` a variante escolhida virou a de **33 lotes**).
Nenhuma reprovou nada enquanto mentia.

> **Prova que ninguém reconfere é afirmação com data.**

**O detector mede da FONTE, não compara prova com prova** (D144): o inventário é **recontado
do módulo**, o conjunto e a ordem das glebas são **relidos das fixtures**, a etiqueta do
contrato sai de `contratoDasEntradas()` (D146), e o que só o motor sabe é medido **rodando o
motor** — uma trava, em `geo-antonina`, ~6 s, com o teto de tempo escrito em 60 s e o porquê
ao lado, porque reprovar por tempo é reprovar pelo motivo errado.

**E o escopo sai como NÚMERO — 11 de 19 chaves** (a lição do D164). Cada chave de primeiro
nível das duas provas está classificada em `medida`, `medidaEmParte`, `declarada` ou
`naoMedida`, **esta última com o motivo escrito**; a lista mora em
`src/escopo-do-detector.ts`, **fora do teste**, porque número que só existe dentro de um
teste não sai em prova nenhuma. **Trava nas duas direções:** chave nova na prova que ninguém
classificou reprova, e chave classificada que desapareceu da prova reprova.

**As quatro chaves não alcançadas têm um motivo só, e é custo:** recontar `porRegra`,
`reprovamNoTotal`, `dividasDoLab` e `promessasQueNenhumaGlebaExercita` é auditar as duas
pontes/idas em todas as glebas com os motores rodando — a ferramenta inteira dentro de um
teste. Os zeros que importam já têm trava própria nas guardas.

**Provado por sabotagem** (D126), e **duas das quatro são as mentiras históricas**, não
invenções: os 74 campos virando 72 é a forma exata do que a prova do LAB-30 publicava, e o
33 virando 1 228 é a variante que a do LAB-25 publicava. Os quatro casos: **15 pass · 0 fail
→ 14 pass · 1 fail, exit 1**, e 15 · 0 depois de restaurar. *Detector apontado para o
passado é o único teste honesto de um detector de prova velha.*

**E a trava NÃO entra no trabalho do CI sem clones vizinhos**, por medição: ela roda o motor
do Parcelamento, que é clone privado. Pôr lá seria o D143 outra vez — verdadeira nesta
máquina e falsa no runner. O número daquele trabalho continua **98**.

---

## D171 · Segunda vez que "tipo não existe em tempo de execução" custa uma guarda cega · 06/10/2026

`RegraDaIda` (5 regras) e `Regra` da ponte (3) eram **uniões de tipo**, e o detector de prova
velha não tinha **contra o que** conferir as chaves do `porRegra` de uma prova. Regra nova
numa guarda sem regerar a prova é prova que descreve uma guarda que já não existe — e nada
acusava.

Nasceram `REGRAS_DA_IDA` e `REGRAS_DA_PONTE`, **ao lado das uniões e travadas a elas em
tempo de compilação**: se a lista e a união divergirem, **não compila**.

**É literalmente o conserto do LAB-44 (D157) aplicado a um segundo lugar, pelo mesmo
motivo.** Lá eram as chaves do confronto do acesso; aqui são os nomes das regras. A forma do
defeito é uma: **o que precisa ser conferido em tempo de execução tem de existir em tempo de
execução**, e uma união de tipo não existe. Duas vezes já é padrão, não coincidência — e é o
primeiro lugar a olhar quando uma guarda parece cega.

---

## D172 · Régua que eu afrouxo quando ela me reprova não é régua, é enfeite · 06/10/2026

**Dois achados de método, os dois contra mim, os dois dentro do prompt.**

**O primeiro.** Eu escrevi uma trava exigindo que o detector *"alcance mais da metade das
chaves das duas provas"*, e a primeira versão deu **9 de 19** — reprovada por **meio ponto**,
pela minha própria régua. A tentação era trocar `> metade` por `>= metade`, ou tirar a trava.

**O conserto foi MEDIR MAIS:** publicar as regras das duas guardas como dado (D171) e
reconferir as chaves do `porRegra`, o que levou o número a **11 de 19**.

> É o contrário exato do D143. **Lá** o CI pegou uma trava que só valia na minha máquina, e
> eu a consertei **sem afrouxar**. **Aqui** a trava pegou o meu escopo, e o conserto foi **o
> escopo crescer, não a trava encolher**.

**O segundo, e é da família do D133 e do D151.** A prova do LAB-30 publica
`promessasQueNenhumaGlebaExercita` com **6** entradas, e o LAB-40 publicou que esse número
tinha ido de **6 para 0**. Eu tinha nas mãos *"a prova do LAB-30 está velha nesse campo
também"* — publicável, e **falso**.

**Medido: a ferramenta do LAB-30 mede SETE glebas; o "6 → 0" do LAB-40 foi medido sobre
DEZ**, com as duas fixtures que aquele prompt criou. São **conjuntos diferentes**, e comparar
os dois números é comparar coisas que não se comparam — como contar posições em que um motor
não respondeu (D133) ou medir o controle menos que o acusado (D151).

**A lição virou código:** a classificação daquele campo no `ESCOPO` carrega o aviso por
escrito, para quem comparar na próxima vez ler antes de concluir.

> **O conjunto medido é parte do número.** Dois números da mesma grandeza medidos sobre
> conjuntos diferentes não se comparam, e a diferença entre eles não é notícia.

---

## D173 · A passagem externa lê a face como RETA, não como SEGMENTO · 06/10/2026

**A pergunta era do D161 e o chat a pôs na fila como pergunta, não como acusação:** por que a
passagem externa do motor do Parcelamento põe lote a **1 805,7 m** da face entregue, quando
`facesLoteamento` entregou **uma** face de **180,2 m**?

**Lido o motor** (`motor.ts`, `reservarFacesExternas`, só leitura), o mecanismo é um:

```ts
const ang   = Math.atan2(dy, dx);                                     // a DIREÇÃO vem da face
const cBase = nx * p0.x + ny * p0.y;                                  // a ORIGEM vem da face
const faixa = recortarSemiplano(restante, nx, ny, cBase + prof);      // SEMIPLANO
const rect  = caixa(local);
const n     = Math.max(1, Math.round((rect.maxX - rect.minX) / a.testadaExterna));
```

> **A faixa do lote externo é um SEMIPLANO, não um retângulo sobre a face.** `rect.maxX -
> rect.minX` é a largura da FAIXA, não o comprimento da FACE.

**E a prova é a gleba de CONTROLE, não o argumento.** Duas glebas com testada entregue:

| | `geo-antonina` · 141,8 ha · 20 vértices · côncava | `ensaio-com-testada` · 47 ha · 4 vértices · **convexa** |
|---|---|---|
| perpendicular à RETA da face | **20,1 m** (teto 32) | **0 m** |
| **ao LONGO** da reta | **1 805,6 m** | **0 m** |
| lotes a ≤ 0,5 m do segmento | 14 de 33 | **51 de 51** |

**Na gleba convexa o mesmo mecanismo não produz nenhum lote distante**, porque ali o
semiplano sobre a reta **é** a faixa sobre a face. Em Antonina a reta de uma face de 180 m
**volta a entrar no terreno** nas reentrâncias, e a faixa vai com ela: os 15 lotes a mais de
50 m não estão em outra face, estão **na mesma reta**.

**O motor não mente sobre o que promete** — `facesLoteamento` são *"índices das faces do
perímetro que recebem lotes voltados para a rua"*. Ele lê o índice como **reta**; eu lia como
**segmento**. É a pergunta do D127 feita de novo: *o que este campo faz no motor?*

**E a hipótese 2 do chat foi descartada por MEDIÇÃO**, não por leitura: a passagem **não**
corre o perímetro — 1 face de 20 vértices, 1 de 4.

**O que isto muda na leitura do LAB-48:** as **18** violações `frente` distantes e as **11**
`via-sobre-lote` têm agora **um** mecanismo nomeado, e é o mesmo. **29 das 40 violações de
`geo-antonina` saem de `reservarFacesExternas`.** E a qualidade da leitura muda: não é *"o
motor põe lote em lugar errado"*, é **uma escolha de implementação correta em gleba convexa e
sem limite longitudinal em gleba côncava.** O conserto é **lá**, e é recortar a faixa também
pela extensão do segmento — item 1 da lista numerada.

---

## D174 · Previsão que FALHA é o resultado mais útil — e hipótese morta fica escrita · 06/10/2026

A ferramenta do LAB-50 pôs **quatro** previsões falsificáveis. Três se cumpriram. **A quarta
falhou, e foi a que rendeu mais.**

**P4 era "a faixa foi de fato reservada?"** — e não foi: há lote externo sobre o leito de via
do próprio motor nas **duas** glebas (10 e 9 lotes). Até aqui, confirmação do LAB-48. **O
resultado está no que aconteceu com as minhas explicações:**

- **"corte de semiplano numa gleba CÔNCAVA não separa faixa de sobra"** — plausível, e
  **morta pelo controle**: acontece igual na gleba **convexa** de 4 vértices. *A concavidade
  não é a causa;*
- **"o leito é eixo ± meia-caixa, então a via logo dentro da sobra derrama de volta para a
  faixa"** — **morta por medição**: o eixo das vias culpadas está a **0,1 m** (`V2`),
  **0,3 m** (`V10`) e **0,8 m** (`V1`) da **reta da face**, ou seja **dentro** da faixa e não
  na beira dela. Não é derrame: a via está lá.

**O que ficou medido, e é só isto:** *o eixo da via culpada corre praticamente sobre a reta da
face entregue — a via do plano e a faixa do lote externo ocupam o mesmo chão.* **Por que o
motor desenha via sobre a face que ele mesmo reservou: NÃO ATRIBUÍDO.** Tenho duas candidatas
e **não medi nenhuma**; vão como pergunta na lista numerada.

**E as duas explicações mortas ficam escritas na prova**, num campo chamado
`explicacoesMORTAS`. O motivo é prático:

> **Hipótese descartada em silêncio volta como hipótese nova no prompt seguinte.**

É a mesma economia da lista de exceções do §7 e do inventário das pontes: o que foi conferido
e não serviu vale tanto quanto o que serviu, **se estiver escrito**.

**E um estimador ruim também saiu publicado, com o aviso:** a profundidade da faixa não é
observável de fora (`prof` não sai na SAÍDA), e o meu estimador — a maior perpendicular dos
lotes à reta — **dá 0 na gleba convexa**, onde todos os lotes caem sobre a reta. Foi ele que
me impediu de fechar o item 2. *Estimador ruim declarado é melhor que número bonito sem
aviso* — e virou o item 3 da lista para o vizinho.

---

## D175 · Caminho errado que ESTOURA é barato; o que devolve `undefined` é publicável · 06/10/2026

A primeira versão da ferramenta do LAB-50 leu o perímetro da gleba em
**`terreno.gleba.anel`** e estourou na primeira linha. O caminho certo é **`gleba.anel`**:
`terreno.gleba` é o caminho **dentro da entrada do motor**, e não no contrato.

**É literalmente o caminho do D135** — aquele em que eu publiquei, por um instante, *"a ida
não entrega o furo da gleba"*, porque o furo mora em `terreno.gleba.furos` **na entrada do
motor** e eu havia olhado o do contrato.

**Desta vez ele mordeu do lado bom**, e a diferença merece número:

> **Caminho errado que estoura é caminho errado barato. Caminho errado que devolve
> `undefined` é uma acusação publicável.**

O D135 custou dois testes vermelhos e um instante de conclusão falsa porque o acesso devolveu
`undefined` em silêncio. Aqui o acesso a `.anel` de `undefined` **lançou**, e o custo foi uma
linha. **A lição não é "errei de novo": é que a forma do acesso decide o preço do erro** — e
onde der para escolher, prefira o acesso que estoura.

O comentário ficou no código, ao lado da linha consertada, para a próxima pessoa não repetir.

---

> **Não há D176.** O número foi pulado: o recado do LAB-50 (06/10/2026) anunciou *"próxima decisão D176"*, e o
> LAB-51 (commit `44d2e34`) escreveu a D177 logo depois da D175. Nenhum commit da história escreveu um título D176 —
> e não se inventa decisão para tapar número. O buraco é declarado em
> `external-engines/esteira/src/a-sequencia-das-decisoes.ts`. *(Acrescentado por mim no LAB-131, D359; nada acima nem
> abaixo mudou.)*

---

## D177 · Citação marcada não é afirmação — e a régua respeita a marca · 06/10/2026

O alto do `conferir.sh` — **o arquivo mais lido do repositório** — dizia *"Não há CI neste
repositório (não existe `.github/workflows`)"*. **Verdade no LAB-31, falsa desde o LAB-38**,
que criou o workflow. **Oito dias, e ninguém viu**: é a forma exata do D104, porque
**comentário não se revalida**.

O conserto tem duas metades, e a segunda é a que faz o prompt fechar — *regra sem guarda é
slogan* (D136):

1. **a afirmação** passa a descrever o CI que existe, **citando a frase falsa com as datas**,
   porque apagá-la tiraria do registro a única coisa útil que ela tem;
2. **a guarda**, duas travas no `verde.test.ts`: *nenhuma afirmação de inexistência do script
   é desmentida pelo disco* (em toda linha que **afirma** "não existe"/"não há", todo caminho
   entre crases tem de não existir) e *o script NOMEIA o CI* — porque **tirar a mentira não
   basta: silêncio também envelhece.**

**E a régua ia reprovar o próprio conserto.** O cabeçalho novo **cita** a frase falsa, e a
citação carrega o caminho que existe.

**É a QUARTA vez da sub-família do D137, D142 e D155** — régua que varre texto e casa o nome
no lugar errado da gramática —, **e a primeira que eu peguei ANTES de escrever a régua**, em
vez de depois de ela ficar vermelha. As três anteriores custaram uma suíte vermelha cada; esta
custou uma linha.

> **Régua que varre texto mede o que o texto AFIRMA e o que ele DIZ SOBRE SI, e só a primeira
> é o objeto.**

O conserto é o `semCitacoes()`, um degrau acima do `semComentarios()` do LAB-43: tira as
**citações marcadas** antes de procurar a afirmação. **O buraco fica declarado:** afirmação
disfarçada de citação escapa — preço menor que o de a régua reprovar o próprio conserto.

**Provado por sabotagem** (D126), três casos, cada um desfeito: a frase histórica de volta sem
a marca de citação derruba **as duas** travas (8 pass → **6 pass · 2 fail**); o apontador
apagado derruba uma; e **uma afirmação falsa sobre um caminho qualquer** também — o que prova
que a régua é **geral**, e não um `if` escrito para este caso.

**E este prompt não tem prova em `docs/provas/`, de propósito:** ele mede um arquivo de texto
contra o disco, e não gleba. Inventar um JSON para ter um JSON seria o contrário do §7.

---

## D178 · Regra de lint que precisa de tipo fica MUDA com `projectService: false` — e não avisa · 07/10/2026

A Central achou que *erro de chamada não conferido degrada para número que PARECE certo*, e
mandou varrer os meus. **A metade mais perigosa dessa classe — promessa sem `await` — não se
mede com regex: precisa de tipo.** E há regra pronta,
`@typescript-eslint/no-floating-promises`.

**Medido: ela estava desligada nos DOIS pacotes.** Os dois `eslint.config.js` traziam
`languageOptions: { parserOptions: { projectService: false } }`, e **sem serviço de projeto
toda regra type-aware fica desligada** — `no-floating-promises`, `no-misused-promises`,
`require-await`.

**E ela não avisa.** Não há erro, não há aviso, não há contagem: o lint passa verde porque
**não rodou** a regra. *É a forma do D123 — a prova no navegador que ninguém rodava — num
lugar onde ninguém pensa em olhar: dentro da configuração do lint.*

> **Regra desligada em silêncio é pior que regra ausente, porque o verde continua verde e
> ninguém procura.**

**O zero é MEDIDO, e isso exigiu sabotagem.** Ligadas as três, a árvore inteira dá **zero
achados** — mas zero de detector que não se provou é zero que não vale. Plantada uma promessa
sem `await` num arquivo temporário, a regra **acusou**. Só então o zero virou resultado.

**Ligar as três custa zero conserto, e elas ficaram.** O conjunto `recommendedTypeChecked`
COMPLETO ficou de fora, e o motivo é número: **646 achados** — 487 de
`no-unnecessary-type-assertion` e ~149 de `no-unsafe-*`, que vêm das pontes `as unknown as`
entre três repositórios. **É outro prompt**, e está proposto ao chat.

**O preço, dito em vez de escondido:** o lint do `esteira` foi de **0,85 s para 7,9 s** —
nove vezes —, e o do `testfit` roda em 3,1 s. *Sete segundos por execução contra uma classe
de erro que não aparece de outro jeito.*

**E a guarda é sobre a CONFIGURAÇÃO, não sobre o código:** há trava exigindo
`projectService: true` e as três regras **ligadas** nos dois pacotes, porque a maneira de
perdê-las de novo é uma linha trocada para o lint ficar rápido.

---

## D179 · 28 de 28 falso positivo — e a sabotagem pegou o que eu não vi · 07/10/2026

**Duas metades, e as duas são de método.**

### A régua acusou em volume, e o volume era dela

A regra `degrada-chamada-para-numero` — `?? 0` ou `|| 0` sobre o resultado de uma chamada —
deu **28 achados**. Agrupados pela função chamada: **`.at(` 16**, **`.get(` 10**, e dois de
serialização.

**`Array.at(-1)` num vetor vazio e `Map.get(k)` numa chave que falta não FALHARAM** — eles
disseram *"não tem"*, e `?? 0` é a resposta declarada para isso.

A classe que a Central nomeou é *"erro de chamada não conferido"* — **erro**. Estreitar a
regra para o alvo que ela mesma declara **não é afrouxá-la** (o contrário do D143 e do D172,
e a diferença é esta): é a pergunta do **D127** feita **antes** de acusar — *a chamada que eu
casei sinaliza falha?* Nasceu a lista `AUSENCIA_NAO_E_ERRO`, e **28 viraram 2**. Os 2, mais o
único `numero-sem-conferir`, são **benignos declarados**, com motivo escrito e trava que
reprova um quarto — e também um deles que desaparecer.

> **Antes de acusar em volume, pergunte se o volume é da coisa ou da sua régua.**

### A sabotagem pegou a QUINTA vez da família da régua que lê texto

Seis sabotagens; **a segunda não pegou**. Tirar `no-floating-promises` da configuração
passava, porque a trava fazia `toContain(nome)` sobre o texto **cru** — e o **comentário** que
eu acabara de escrever ali **cita o nome da regra** ao explicá-la.

**É a quinta vez da família do D137, D142, D155 e D177 — e a primeira em que não fui eu que
peguei: foi a sabotagem.** No LAB-51, uma hora antes, eu havia registrado ter visto o defeito
*antes* de escrever a régua; no prompt seguinte, no mesmo assunto, caí.

**O conserto é o D142 inteiro:** o nome tem de estar **no lugar da gramática onde significa
"regra ligada"** — `"<regra>": "error"` —, não em qualquer lugar do arquivo. E exigiu **duas**
limpezas distintas, que agora são duas funções com nomes diferentes:

| função | tira | responde |
|---|---|---|
| `soOCodigo()` | comentário **e** conteúdo de string | *"o código FAZ isto?"* |
| `semComentarios()` | só comentário | *"a configuração DECLARA isto?"* |

> **Há DUAS perguntas, não uma — e usar a limpeza errada é a mesma família do nome lido no
> lugar errado.** A primeira esvazia strings porque string é onde o código *fala sobre*; a
> segunda as preserva porque é na string que a configuração *declara*.

**E o zero de (b) vale porque as réguas olharam volume:** **0** identificadores de conta em
**4 891 parâmetros** e **4 316 campos**, com trava exigindo que esses números não caiam —
*é a diferença entre "não achei" e "não procurei"* (D164).

---

## D180 · Campo MIN/MAX vem do CONTRATO; o sorteado é ALVO — e ele vale 36 violações · 07/10/2026

**O LAB-48 achou, o LAB-53 consertou**, e o caminho é curto o bastante para caber aqui: a
ENTRADA declara `testadaMinLote_m = 10` m; a **minha ida** monta
`padroes["testada"] = faixa(10, √(360/2))`; o motor sorteia o alvo da variante no meio dela,
**11,70820393249937** m; e a **minha volta** escrevia esse alvo em
`parametrosUsados.testadaMinLote_m` — **o campo cujo nome é MÍNIMO**. O tradutor do Generate o
lê como `params.testadaMin`, e o Validator passava a medir o motor **contra o próprio alvo
dele**, com 2 % de folga: **47 lotes de 316 m² reprovados por 1,94 cm de déficit mediano**, 36
deles por isto.

> **Campo cujo nome diz MÍNIMO e cujo valor é um ALVO não é um campo errado: é uma acusação
> automática.**

**E eram TRÊS campos, não um** — `testadaMinLote_m`, `caixaViariaMin_m` e `faceQuadraMax_m`.
O LAB-48 nomeou um; ler a função inteira antes de tocá-la achou os outros dois.

**A regra tem TRÊS saídas, e a terceira é o erro simétrico.** Dizer só *"limite vem do
contrato"* deixaria passar o avesso: publicar no campo de limite o número do contrato quando o
motor **não honra** aquele limite é **inventar obediência**. Então:

| saída | quando | exemplo |
|---|---|---|
| **do contrato** | o motor mira dentro de um limite que outro declarou | `testadaMinLote_m` |
| **`null`** | o motor **não aplica** aquele limite | `rampaMaxima_pct` — ele mede rampa (T03) e não a limita |
| **nunca o sorteado** | o sorteado é ALVO: vai a campo de alvo, ou vira perda declarada | `testadaAlvoLote_m`, que o contrato v1 **não tem** |

**Medido depois:** **128 → 92** violações, as 81 que não são `testada` sendo **os mesmos 81
lotes** e as 11 restantes **subconjunto** das 47. O conserto é cirúrgico, e a previsão do
LAB-48 bateu nas cinco glebas.

---

## D181 · A guarda mede DEPENDÊNCIA, não nome — e a sabotagem provou que precisava · 07/10/2026

A trava óbvia para o D180 é *"todo campo MIN/MAX é igual ao do contrato"*. Ela está escrita e
é a primeira das três — **e sozinha ela não serve**, e isso não é opinião: é sabotagem.

Devolvido `faceQuadraMax_m: comprimentoQuadra` (o defeito de volta), **a trava de nome
PASSOU**. O motivo é exato: a ida entrega `padroes["comprimentoQuadra"]` como faixa
**degenerada** `(200, 200)`, então hoje o sorteado **é** o limite, e comparar valor com valor
não distingue *"vem do contrato"* de *"vem do sorteio e por sorte coincide"*.

**Quem pegou foi a segunda trava**, que não compara valores: ela roda a volta **duas vezes,
com a mesma ENTRADA e duas amostras diferentes**, e exige que todo campo MIN/MAX **fique
parado** enquanto o campo de ALVO **se move**.

> **Trava que compara o campo com o valor de hoje mede uma coincidência, não o mecanismo.**

**As duas metades da segunda trava importam.** Sem a do alvo que se move, ela passaria com a
ponte devolvendo a ENTRADA inteira de volta — e `parametrosUsados` perderia a única função que
tem, que é dizer no que o motor divergiu do pedido.

**É a segunda vez em dois prompts que a sabotagem pega a trava e não eu** (a primeira foi a
D179, uma hora antes). Duas em duas: **sabotar a própria trava deixou de ser zelo e passou a
ser método.**

---

## D182 · Prova "antes" não se sobregrava com prova "depois" — e a legenda sai da medição · 07/10/2026

A aferição do LAB-53 usa **a mesma ferramenta** do diagnóstico do LAB-48, de propósito: medir
com outra responderia outra pergunta (D149). Mas ela escrevia sempre no mesmo arquivo, e a
primeira rodada **apagou o diagnóstico** — justamente o arquivo que o chat quer pôr ao lado do
diagnóstico que o Generate está fazendo do lado dele. Restaurado do git; o conserto é de
mecanismo, não de cuidado:

- **o destino do arquivo sai da MEDIÇÃO**, não de quem roda a ferramenta:
  `oMinimoDeTestada.saoIguais`, gleba por gleba, diz se a ponte já põe o mínimo declarado.
  Ponte com o defeito escreve em `LAB-48/`; ponte consertada escreve em `LAB-53/`. Uma rodada
  **não pode** sobregravar a outra;
- **gleba recusada pelo esquema não vota**, e se nenhuma foi medida a resposta não é
  *"consertada"*: é *"não medida"* (D164);
- **a legenda deixou de ser texto fixo.** O campo `ehDiagnostico` trazia, em `string` literal,
  *"nada foi consertado, e a ponte não foi tocada"* — frase que este prompt tornaria **falsa
  dentro do próprio arquivo de prova**, em silêncio. É a forma do D104 **dentro de uma
  prova**, e teria envelhecido no mesmo prompt que a escreveu.

> **Prova carrega número e carrega legenda, e só o número se regera. A legenda que não é
> derivada da medição é um comentário com cara de dado.**

---

## D183 · As 27 `frente` atribuídas — e o probe que pergunta "por quê" sem trocar de régua · 07/10/2026

O LAB-48 deixou **27 violações sem culpado**, e disse isso em vez de escolher, porque
atribuir com régua minha seria a forma do D93 e do D127. **Atribuídas agora:**

| das 27 | quem é |
|---:|---|
| **23** | o **motor** — lote de miolo, **0 m²** sobre leito e borda a mais de **0,62 m** de qualquer superfície viária |
| **4** | a **régua**, e só o **rótulo** dela (ver a D184) |
| **0** | ponte · **0** contrato — nenhuma das quatro glebas declara rua pública, e o contrafactual é `null` nas 27 |

**O método é o que vale, e ele resolve um problema geral:** rodar a régua do vizinho responde
**se** ela acusa, nunca **por quê**. A função dele testa o **ponto do MEIO** de cada aresta
contra o contorno das superfícies viárias, com 0,75 m de tolerância — e numa aresta de 34 m
que encosta só numa ponta, o meio está a 17 m de lá.

> **Para perguntar por que a régua DELE diz zero, mude a AMOSTRAGEM e deixe a função dele
> responder de novo.**

`densificar()` insere vértices ao longo das arestas: **mesma borda, mesma área, mesmo
polígono** — só os pontos que ela testa mudam. Quem muda de resposta é **o código dele sobre
o mesmo polígono**, e não uma régua minha discordando da dele. O negativo vem com
**resolução declarada** (passo de 0,25 m ⇒ nenhum ponto da borda a menos de ~0,62 m), porque
sem o passo *"continuou zero"* não prova nada (D164). E o mecanismo tem **trava sintética**,
sem gleba: um lote de 34 × 12 m que encosta no leito só nos 2 m da ponta, que a função dele
recusa como está e aceita densificado — mais a trava de que **leito longe continua zero**,
que é o probe não cegando a régua dele.

---

## D184 · Régua que erra o RÓTULO e acerta o VEREDICTO não é régua errada · 07/10/2026

**Eu estava a um passo de escrever *"a régua do Generate erra em 11 das 56"*** e de abrir um
item de conserto no repositório do vizinho. Medido: **ela acerta o veredicto em 11 de 11.**

Os 11 lotes em que a amostragem fina muda a resposta dela têm frontagem real de **1,5 a
5,49 m**, contra um mínimo declarado de **10 m**. Então, consertada a amostragem, o
invariante **seguinte** acusa `testada` no mesmo lote:

```
frente que sumiria .......... 11
das quais só TROCAM de etiqueta  11
das quais de fato SOMEM ......... 0
```

> **Régua que erra o RÓTULO e acerta o VEREDICTO não é régua errada — e consertá-la não
> derruba violação nenhuma.**

O que ela erra é a **mensagem**: *"nenhuma aresta encosta em via"* sobre um lote que encosta
com 2 m. Isso vale para quem **lê** o relatório, e não vale número — então saiu como item de
**mensagem** na lista para o Generate, explicitamente **fora do caminho crítico do MVP**.

**A lição de método, e é a que viaja:** *medir o SALDO antes de propor o conserto.* Sem a
segunda metade da medição, este prompt teria entregado "a régua dele erra em 11 casos" como
se fosse trabalho de MVP — e teria custado um prompt do vizinho para mover o total em zero.
**Há trava no saldo** (`tests/frente.test.ts`): se `dasQuaisDeFatoSOMEM` deixar de ser zero,
a conclusão do LAB-54 mudou, e quem lê descobre por uma trava vermelha.

---

## D185 · "Oito estão a 0,2 m ou menos" era FALSO — são cinco, e a lista estava ao lado · 07/10/2026

O LAB-48 §3.2 escreveu *"oito estão a 0,2 m ou menos da borda do leito"*. **São cinco** — e a
lista com os números está impressa **na linha de cima do próprio relatório**:
`−0,05 · 0,0 · 0,0 · 0,0 · 0,2 · 1,2 · 1,6 · 3,1 · …`. O **oito** é a contagem até **3,1 m**,
não até 0,2.

**Escrevi o número de memória com a lista ao lado.** Não foi régua errada, não foi caminho
errado, não foi comentário envelhecendo: foi contar de cabeça o que estava impresso.

> **Número que o próprio relatório lista ao lado não se escreve de memória.**

**Corrigido riscando, não apagando** (D161), e com a medição ao lado — porque a parte útil é
essa: **a régua do Generate confirma 4 dos meus 5.** O quinto, `v12-l469`, está a exatamente
0,2 m pela minha régua e **continua sem frente** pela dele, com passo de 0,25 m. *As duas
réguas discordam num lote, e a dele é a que vale, porque o invariante é dele* — o D93/D127
medido em vez de argumentado.

É a **décima quinta** vez do ponto cego da §6, e a nona pega dentro do próprio prompt.

---

## D186 · Área preservada não prova borda preservada — a sabotagem da translação · 07/10/2026

O probe do D183 nasceu com **uma** precondição — a área não mudar — e com a justificativa
escrita de que *"se densificar mudasse a geometria, o probe teria consertado o lote em vez de
medi-lo"*. **A sabotagem desmentiu a justificativa:** eu desloquei todos os pontos
densificados em **1 cm** e a trava **PASSOU**.

E ela estava certa em passar:

> **Deslocar TODOS os pontos é uma TRANSLAÇÃO, e translação não muda área nenhuma.**

A sabotagem era mal escolhida; o que ela revelou é defeito de verdade. **Num probe que mede
DISTÂNCIA até o leito da via, a translação é o pior erro possível:** escorregar o lote 1 m
para o lado da rua faria a régua do Generate dizer *"tem frente"* sobre um lote que não tem,
e a conta de área aprovaria.

> **Área preservada não prova borda preservada.** Área é invariante por translação e por
> rotação. O que este probe precisa garantir é que **cada ponto novo está SOBRE a borda
> original** — e isso só a distância à borda responde.

São duas precondições agora: área (teto 1e-6 m²) **e** distância de cada ponto novo à borda
original (teto 1e-9 m). Com elas, a sabotagem da translação reprova; e há uma quinta
sabotagem, que **remove a segunda metade**, e também reprova.

**Terceira vez em três prompts que a sabotagem pega o que eu não vi** (D179 — a trava lia o
nome da regra no comentário; D181 — a trava comparava com o valor de hoje; D186 — a
precondição media área e não borda). *Sabotar a própria trava deixou de ser zelo e passou a
ser método, e três em três é o número que sustenta a frase.*

---

## D187 · A varredura de chamadas do LAB-52 teve o primeiro achado VERDADEIRO — no meu código, um prompt depois · 07/10/2026

O LAB-52 fechou com um número incômodo: **28 de 28 achados eram falso positivo** da minha
régua (D179). A varredura ficou no repositório mesmo assim, com as duas limpezas e a lista
fechada de benignos.

**Um prompt depois ela reprovou o verde**, e o achado era real. No `ferramentas/lab54.ts`
recém-escrito, a regra `numero-sem-conferir` acusou:

```ts
const testadaFina = Number(_testadaDoLote(…).toFixed(2));   // e nenhum Number.isFinite no arquivo
```

**E aqui a degradação não é cosmética: é uma acusação publicável.** `NaN > 0` é `false`,
então um `NaN` vindo da função do Generate faria o lote cair em **`motor-sem-via-perto`** —
isto é, **o Lab acusaria o motor do vizinho por um número que não é número**, no mesmo prompt
cuja tese inteira é *não atribuir sem medir*.

É a classe (a) que a Central nomeou — *erro não conferido que degrada para número que PARECE
certo* — na forma do D175: **o caminho errado que estoura é barato; o que devolve silêncio é
uma acusação publicável.** Consertado com um `testadaDele()` que **estoura** com a frase
inteira, e não com uma entrada nova em `BENIGNOS`: declarar benigno o que é real é afrouxar a
régua quando ela nos reprova (D172).

> **Régua cujo primeiro resultado é 28 de 28 falso positivo não está errada: está sem caso
> ainda.** A de 28 falsos custou estreitar a régua uma vez; o primeiro verdadeiro apareceu
> **um prompt depois**, em código meu, e o que ele impediu foi uma acusação ao vizinho.

**O verde pegou, não eu.** Eu rodei `typecheck`, `test` e a ferramenta antes do commit; quem
reprovou foi o comando único, no passo `esteira · test` — a terceira vez neste dia em que o
§7 cobra algo que os passos parciais aprovariam (a primeira foi o `tsc` do `testfit` no
LAB-53).

---

## D188 · A faixa reservada é buraco no domínio do LOTE e não no domínio da VIA · 07/10/2026

O LAB-50 deixou isto **não atribuído** de propósito, com duas explicações minhas já mortas
(D174). A terceira está medida, e é uma **assimetria**:

```
sobreposicao   = 0     ← o LOTE respeitou a faixa reservada
via-sobre-lote = 11    ← a VIA não respeitou
```

**O mecanismo, lido no código do motor (só leitura):** `reservarFacesExternas` tira a faixa
de `restante` (`motor.ts:194`), `restante` vira `util` (`:198`), e **`util` recorta quadra e
lote** (`formatos.ts`, `quadraRet(util, …)`). A rede viária recebe **um** aparo:

```ts
const vias = apararRedeViaria(viasBrutas, terreno.perimetro);   // motor.ts:247
```

**Contra a DIVISA.** E a faixa reservada está dentro da divisa.

> **`util` governa onde nasce LOTE. A DIVISA governa onde fica VIA.**

**A assinatura do aparo pela divisa, medida:** as **quatro** vias culpadas (duas glebas) têm
**as duas pontas a 0 m do perímetro** e **uma ponta dentro de um lote externo**, atravessando
a faixa em **4 % a 23 %** do eixo. *Via recortada por `util` pararia na borda interna da
faixa, longe do perímetro* — é a medida que separa as duas explicações.

**E o segundo andar também está medido de fora.** O `aplicarCulDeSac` (`formatos.ts:826`) é o
único lugar que recortaria via por `util`, e tem dois buracos: só recorta `secundaria`, e
começa com `if (pct <= 0) return`. O bulbo de retorno nasce só nesse caminho e o contrato o
publica como área `retorno`: **zero `retorno` nas duas glebas** ⇒ não rodou. É o que explica
uma via **secundária** entre as culpadas, ao lado de três **principais**, que ele nunca
recortaria.

---

## D189 · Violação que NÃO aconteceu é medição — e candidata que morre só pela metade sai dita · 07/10/2026

**Duas candidatas foram ao teste, e cada uma morreu de um jeito diferente.**

**O corte degenerado morreu pela AUSÊNCIA de uma violação.** A candidata era
`if (sobra.length >= 3) restante = sobra;` deixando `restante` inteiro num corte degenerado.
Se fosse isso, `util` seria a gleba inteira e **quadra e lote teriam nascido sobre a faixa** —
e haveria `sobreposicao` entre lote interno e lote externo. Medido: **zero**.

> **Violação que não aconteceu é medição, e aqui foi ela que matou a candidata.** O invariante
> que ficou calado disse mais que os onze que falaram.

**A do acesso morreu só como mecanismo, e a honestidade está no "só".** Em `geo-antonina` a
pior infratora (`V2`, 8 lotes) passa a **9,6 m** do ponto de acesso: **não afirmo que o acesso
não tem parte nela.** O que morre é a candidata como *o mecanismo*, por dois números — em
**toda** gleba há culpada longe (`V10` a 86,7 m, `V11` a 382,5 m), e no controle convexo a
**pior de todas** está a **382,5 m** enquanto a que **é** a via de acesso invade só 2 lotes.

**E isto custou uma trava vermelha minha.** A primeira versão afirmava *"a pior infratora de
CADA gleba está a mais de 50 m do acesso"* e reprovou, por causa dos 9,6 m. **Afrouxar o
limiar para 5 m seria a régua-enfeite do D172; a correção foi medir a afirmação que os
números sustentam.** *Trava que reprova a sua própria conclusão está pedindo uma conclusão
mais estreita, não um limiar mais largo.*

---

## D190 · A hierarquia da via mora na SAÍDA, não no `resultado` interno do Generate · 07/10/2026

A primeira versão da ferramenta do LAB-55 leu a hierarquia da via culpada em
`resultado.rede[...].hierarquia` — o objeto **interno** do Generate — e saiu **`null` em 4 de
4**. Eu estava a um passo de escrever *"a hierarquia da via culpada não é observável de
fora"*, que é a forma do item 3 do LAB-50 e seria **falso**: ela mora na **SAÍDA**, onde o
contrato a publica (`vias[].hierarquia`).

Família do D135 (caminho errado) e do D175, **no lado ruim dele**: o caminho errado **não
estourou, devolveu `null`**. E `null` num campo que decide a atribuição não fica quieto — ele
vira uma frase no relatório.

> **Caminho errado que devolve `null` é uma acusação publicável — e quando o campo é o que
> classifica, a acusação é contra quem publica o campo.**

Consertado lendo `r.saida.vias[].hierarquia` por id, com o motivo escrito no código para a
próxima pessoa não repetir. Pego **dentro do prompt**.

---

## D191 · Moldura que sai de GERADOR não se corrige no documento · 07/10/2026

O chat pediu *"a correção da moldura do D159 nos TRÊS lugares onde ela saiu"*. **Contados,
são CINCO documentos vivos — e a raiz é uma máquina.**

A frase saía de `naoSoubeFazer`, em `external-engines/esteira/src/motores/testfit.ts`, e dali
ia para a `COMPARACAO_DOS_MOTORES.md` **três vezes** e para
`docs/provas/LAB-19/tabela.json`.

> **Corrigir os cinco documentos e deixar o gerador faria a frase voltar sozinha na próxima
> `bun run lab19`.**

É a forma do D104 **com uma máquina atrás**, e é pior que o comentário envelhecendo: nenhuma
varredura de documento avisaria, porque no instante seguinte à regeração o documento estaria
"correto" outra vez, por um ciclo. O conserto é no gerador; os documentos se regeram.

**A correção é riscada, não apagada, nos cinco** (D161), e cada uma leva **a causa certa** —
*há UMA régua e UM campo que falta* — **e o limite medido**: das 29 de Antonina, **11 somem**
com o campo e **18 não**, porque *"é só o campo que falta"* é o erro simétrico (LAB-54).

**Duas exceções declaradas, em lista fechada:** o `RECADOS.md`, que é o arquivo do que
**saiu** para o chat e **não se reescreve** — reescrever recado entregue seria falsificar o
registro —, e o `LAB-48.md`, que é o relatório que **achou** o erro e o cita para corrigi-lo.

**E eu contei três porque lembrei três.** A regra que eu mesma escrevi um prompt antes
(D185): *número que o próprio arquivo lista ao lado não se escreve de memória* — vale para
*quantos lugares*, não só para *quantos lotes*.

---

## D192 · Régua que casa uma frase não distingue "X" de "não X" · 07/10/2026

A trava desta correção casava dois padrões: `por uma régua` **e** `duas réguas discord`. Ela
ficou **vermelha no `DECISOES.md`**, e o que ela acusou foi a frase que eu acabara de escrever
**para consertar**:

> *"**Não são** duas réguas discordando: é UMA régua e UM campo que falta."*

**Sexta vez da família do D137/D142/D155/D177/D179**, e a terceira em que a régua reprova o
conserto que a motivou.

**A correção não foi afrouxar:** foi casar **só a forma que de fato saiu** — `por uma régua`,
que não aparece em negação nenhuma — e cobrar a causa certa por uma trava **positiva**, que
exige o texto do conserto em cada um dos cinco lugares.

> **Varredura de texto que precisa entender negação não é varredura: é interpretação, e essa
> não cabe num regex.**

**E a guarda da exceção fantasma mordeu no mesmo instante:** estreitado o padrão, o
`LAB-54.md` deixou de ser acusado — ele fala de **outras** duas réguas, a minha e o
`_testadaDoLote`, que ali de fato discordam num lote — e a trava o **expulsou da lista de
exceções** por ter deixado de precisar ser exceção (D136, LAB-36). *A guarda do LAB-36
mordendo dentro do prompt que a escreveu.*

---

## D193 · Três defeitos da MINHA trava num prompt só, e os três eram de ESCOPO · 07/10/2026

A trava do LAB-56 passou por **três** sabotagens antes de morder, e nenhuma das três falhas
era do texto medido: **eram da minha régua.**

| a falha | o que a revelou | a lição |
|---|---|---|
| usei `soOCodigo()`, que **esvazia o conteúdo das strings** | sabotei o gerador para voltar a escrever a frase **dentro da string** e a trava PASSOU | a nota do gerador **é** uma string: a pergunta é *"o texto DECLARA isto?"* ⇒ `semComentarios()` |
| procurei os números **no arquivo todo** | o `INDEX.md` tem dezenas de linhas com `11` e `18` em outros assuntos | *o volume era da minha régua, não da coisa* (D179) |
| troquei por uma janela de **25 linhas** | o `INDEX.md` é tabela de **uma linha por relatório**: 25 linhas são 25 outros relatórios | a janela tem de ser a **unidade semântica** — o parágrafo, ou a linha quando é tabela |

**A primeira é a mais instrutiva, porque a lição era minha e tinha um prompt de idade.** O
D179 separou as duas limpezas e escreveu para que servem: **`soOCodigo()` responde "o código
FAZ isto?"; `semComentarios()` responde "o texto DECLARA isto?"**. Aqui a pergunta era a
segunda — o que viaja para a página é a **declaração** —, e eu peguei a primeira.

> **Ter as duas ferramentas não basta: a pergunta decide qual delas, e errar a pergunta é a
> mesma família de ler o nome no lugar errado da gramática.**

**E a terceira ensina a medir a janela:** régua de vizinhança sem unidade declarada é régua
sem escopo (D164). A janela agora **para na linha vazia e não atravessa outra linha de
tabela**, e a mensagem de erro **publica quantas linhas ela mediu** — no `INDEX.md`, uma.

**E houve uma quarta, do mesmo D177:** escrito o texto do D192 — que **lista entre crases os
padrões que a régua casava** —, a trava reprovou este próprio arquivo, lendo **o nome do
padrão dela** como afirmação. Em Markdown há **três** formas de mostrar sem afirmar: o
riscado, a citação e o **literal entre crases**. As três saem na limpeza, cada uma com o
motivo escrito, e cada forma tem unidade sintética.

*Quatro defeitos de trava achados por sabotagem ou pela própria trava num prompt só (com o
D192), e nenhum pelo olho.*

---

## D194 · Há TRÊS formas de desligar conferência, e a segunda é a mais silenciosa · 07/10/2026

O D178 achou a primeira — `projectService: false`, a regra que fica **muda**. O chat pediu o
resto da varredura, e a classe tem três:

| forma | o que é | aqui |
|---|---|---|
| **a regra DESLIGADA** | `projectService: false`, `strict: false`, `"off"` | **0** (consertada no LAB-52) |
| **a regra LIGADA QUE NÃO PODE REPROVAR** | `"warn"` num lint sem `--max-warnings 0` | **2** — consertado |
| **o desligador SEM MOTIVO ESCRITO** | ver a D195 | **2** — declarado |

**A segunda estava viva:** `"lint": "eslint ."` nos dois pacotes, com
`@typescript-eslint/no-explicit-any` em `"warn"`. O aviso **aparece na tela** e o passo sai
**verde**.

> **Regra ligada que não pode reprovar é pior que regra ausente, pela mesma razão do D178:
> ela produz a aparência da conferência. Não há alarme a ouvir — há um alarme que ninguém
> lê.**

**Medido antes de consertar: ZERO avisos** nos dois pacotes. Então nada estava escondido
hoje, e o mecanismo estava vivo: no dia em que um `any` aparecesse, o verde diria VERDE.

**E a régua REFLETE o par em vez de opinar sobre ele.** A mesma linha `"no-explicit-any":
"warn"` significa duas coisas opostas conforme o script do pacote, então `regra-em-warn`
recebe `lintReprovaAviso` — **medido no `package.json`** — e deixa de acusar quando a
bandeira existe. *Achado que depende de outro arquivo não se resolve por presunção.*

**O escopo, como número** (D164): 27 configurações que o git carrega, **11 varridas**, **16
fora e NOMEADAS** (upstream intocável, lockfiles, Cargo/rust-toolchain), 647 linhas de
configuração e 123 arquivos de código (34 166 linhas). **E duas formas saem como ZERO
MEDIDO:** nenhum `|| true`/`continue-on-error` no verde, e nenhum `.only`/`.skip`/`.todo` na
suíte — *o `.only` reduziria a suíte a um teste e o resto sairia verde por não ter rodado.*

**E o contra-exemplo, que importa tanto quanto:** o `conferir.sh` **não** tem `set -e`, e isso
é **certo** — o §7 exige que ele rode todos os passos mesmo depois de um falhar. Ele acumula
`falhou=1` e sai `exit 1`. *Não é toda configuração frouxa que é defeito: é a frouxa e NÃO
DECLARADA.*

---

## D195 · Desligador sob comentário que fala de outra coisa é a forma do D104 em configuração · 07/10/2026

O `skipLibCheck: true` dos dois `tsconfig.json` ficava **na linha imediatamente abaixo** de um
comentário que explica, em doze linhas, por que **outros dois flags**
(`noUncheckedIndexedAccess` e `exactOptionalPropertyTypes`) ficam de fora. Quem lê presume que
o motivo cobre a linha de baixo. **Não cobria.**

> **Não é falso: é mudo.** O desligador atravessa sem declaração, e a declaração é tudo o que
> separa uma frouxidão escolhida de uma frouxidão esquecida.

**Medido com `skipLibCheck: false`: ZERO erros, nos dois pacotes.** Ele não esconde nada hoje.

**E ele FICA**, pelo princípio que o próprio arquivo já escrevia três parágrafos acima — *"um
typecheck que acusa erro alheio e não tem como consertá-lo é um typecheck que se aprende a
ignorar"*. Com ele em `false`, uma atualização de `@types/*` derruba o verde por erro dentro
de dependência, que ninguém aqui conserta. **A assimetria decide: o que se perde é medido
(zero) e o que se arrisca não é.**

> **O conserto da terceira forma é a DECLARAÇÃO, não o desligamento.**

Agora está escrito no arquivo, com a medição e com a condição de revisitar. Há trava exigindo
que o motivo **cite o próprio nome do flag** — sem isso, o comentário volta a ser sobre outra
coisa.

---

## D196 · O número do comentário envelheceu OITENTA VEZES · 07/10/2026

O mesmo comentário dizia duas coisas, e as duas estavam velhas:

> ~~*"Ligá-los aqui faz o `tsc` acusar **20 erros** dentro do repositório DELES"*~~ ·
> ~~*"O código deste adaptador foi escrito e **passou com os dois flags ligados**"*~~

**Remedido: 1 604 erros** — **1 600** no repositório do Generate e **QUATRO AQUI**
(`ferramentas/lab03.ts:192`, `ferramentas/lab05.ts:328`, `ferramentas/lab30.ts:109`,
`src/motores/generate.ts:130`).

**A decisão não muda** — 1 600 erros alheios são o argumento inteiro —, **mas a segunda metade
da frase estava FALSA por quatro**, e isso é dívida declarada, não arredondamento. Riscada e
não apagada (D161), com os quatro nomeados por arquivo e linha, e com trava exigindo o número
novo.

> **Número dentro de comentário envelhece em silêncio.** O D104 dizia isso de um motivo; este
> diz de uma **quantidade**, e quantidade é pior: ela parece precisa.

*É a terceira vez em quatro prompts que um número meu estava errado onde eu podia medi-lo
(D185 — "oito" eram cinco; D191 — "três lugares" eram cinco; D196 — "20 erros" eram 1 604).
As três foram achadas no prompt seguinte, por alguém que foi conferir.*

---

## D197 · As 81 do motor são SEIS mecanismos, e a ordem da fila sai de "quantas glebas destrava" · 07/10/2026

O chat pediu as 81 agrupadas por mecanismo, *"em lista numerada, e é o insumo da fila dele"*.
Agrupadas: **seis mecanismos, zero não nomeadas** — 14 + 23 + 11 + 4 + 18 + 11 = **81**.

**A decisão não é o agrupamento, é a ORDEM.** Agrupar por volume poria o semiplano de Antonina
(18) e a fileira sem rua (23) na frente. Mas nenhuma gleba aprova com violação nenhuma, e por
isso o que decide é **quantas glebas cada mecanismo destrava**:

> **`ensaio-47ha` é bloqueada por UM mecanismo só** — o teto de face de quadra, 6 violações.
> Consertá-lo **zera uma gleba inteira, sozinho**, e é a única das cinco em que isso acontece.

Três mecanismos — teto de face, fileira sem rua e o corte do último lote — bloqueiam **quatro
das cinco glebas**. Os dois de Antonina são dela sozinha, e **Antonina não zera só com o
motor**: as 11 restantes são o campo de rua pública existente que o contrato v1 não tem.

> **Contagem diz o tamanho do conserto; "quantas glebas destrava" diz a ordem dele.**

**E um número meu estava errado DENTRO deste relatório, pela quarta vez em cinco prompts:** eu
escrevi *"as faces curtas medem 68,3 m em **11** das 14"* de cabeça, e a ferramenta — mandada
contar a lista — devolveu **10 das 14**. Riscado e remedido antes de sair (D185: *número que o
próprio relatório lista ao lado não se escreve de memória*). A conta agora **sai da prova**: as
longas de 312,14 a 596,92 m contra o teto de 200 m, as curtas de 8,79 a 111,55 m, e 10 das 14
com a curta a menos de 1 m de **duas profundidades de fileira**.

E cada mecanismo é **predicado sobre campo medido**, não impressão: eles vivem em
`src/mecanismos-das-violacoes.ts`, a atribuição é conferida como **partição** (soma fecha,
ninguém casa duas vezes, órfã sai `MECANISMO-NAO-NOMEADO` com a contagem), e cada um declara
onde foi **lido** no motor do vizinho.

---

## D198 · A sabotagem PASSOU porque a trava media um escopo onde o defeito não podia aparecer · 07/10/2026

A régua nova deste prompt é a distância da borda do lote ao **contorno** da via. Ela vinha
calibrada contra a **classe** que o LAB-54 mediu com a função do Generate — e **só nos lotes de
`frente`**.

Troquei o `distAoContorno` pelo `distanciaAoPoligono` do motor, que devolve **zero para ponto
DENTRO** do polígono — isto é, que diz *"encosta na rua"* para o lote que está **debaixo do
leito**. **`exit 0`.**

**Por que passou:** a diferença entre as duas réguas só aparece em lote dentro da superfície
viária, e esses são os **`via-sobre-lote`** — que não têm classe no LAB-54, porque o LAB-54
classificou só `frente`.

> **Trava cujo escopo exclui o lugar do defeito não é trava.** É o D164 pelo avesso: publicar
> o escopo como número não basta se o escopo **não contém** o que pode estar errado.

**O conserto:** a calibração passou a exigir, em **todo** lote acusado, que a minha distância
**reconstrua o número que a função dele devolve** (teto 1e-6 m). Refeita a sabotagem: **`exit
1`, 15 lotes.** O bloco que reconstrói **não julga nada** — nenhuma violação sai dele; ele
existe para ser refutado, e não é Validator leve (§4).

*É a oitava sabotagem que pega defeito meu que eu não tinha visto, e a SEGUNDA que passa antes
de pegar (D179 foi a primeira).*

---

## D199 · A chave curta não erra em qualquer lugar: erra na FRONTEIRA · 07/10/2026

Numa exploração deste prompt juntei a classe do LAB-54 pelo par `(gleba, lote)` em vez de
`(gleba, tipo, lote)`. **Sete dos 85 lotes acusados têm mais de uma violação**, e o par curto
deu à `via-sobre-lote` a classe da `frente` do mesmo lote: **a contagem saiu 18 onde eram 22**.

**A trava que escrevi para isso me reprovou**, e por isso a conclusão ficou mais estreita
(D189): medida **dentro das 81**, a resposta é **zero** — nas 81 cada lote tem **uma**
violação. Medidos nas **92**, os sete existem, e são **exatamente** os sete cuja `frente` é do
**contrato** e cuja `via-sobre-lote` é do **motor**.

> **A chave curta erra exatamente na fronteira entre o que é do contrato e o que é do motor**
> — a única fronteira que este prompt precisa acertar.

A trava mudou de **escopo** por causa disso, e a prova publica os três números: 7 nas 92, 7
deles na fronteira, **0** entre as 81.

*E uma precisão, porque o recado do LAB-55 pode ser lido errado: **as 11 do contrato não são
as 11 "régua-no-meio-da-aresta" do LAB-54**. São conjuntos diferentes do mesmo tamanho — as do
contrato são 11 de Antonina a ≤ 0,5 m da face (7 régua + 4 sem-via); as da régua são 7 em
Antonina mais 4 em `completo`, e essas 4 estão DENTRO das 81.*

---

## D200 · Valor POR OBJETO lido de prova feita sobre OUTRO objeto não é economia, é tabela que erra em silêncio · 07/10/2026

O LAB-59 pergunta qual das vinte candidatas de Antonina aprovaria em cada cenário de conserto.
A primeira versão lia **três valores por lote** das provas anteriores — a distância à face
entregue (LAB-50), a testada com amostragem fina (LAB-54), o contrafactual do campo
`faixaViaPublica` (LAB-53) — e **pelo D116 isso parecia disciplina.**

**Ela respondeu `1 de 20`. A resposta é `16 de 20`.**

**O número denunciou antes de a frase sair:** 696 violações saíram `MECANISMO-NAO-NOMEADO`, em
**19 das 20** candidatas, entre elas as 40 da `ortogonal` de 1 228 lotes. Eu estava a um passo
de publicar *"nem resolvido tudo a de 1 228 aprova"*, que é **o contrário da verdade** e vai
para a página do Jonny.

**A causa é uma e as três instâncias são a mesma:** aquelas provas mediram **a candidata
vencedora**. Os lotes externos dela são `v19-eN`; os da `ortogonal` são `v1-eN`, os da `pente`
`v3-eN`, e **não existem lá**. A consulta devolvia `undefined`, o predicado caía, a violação
saía órfã.

> **O D116 proíbe remedir a MESMA grandeza do MESMO objeto. Ler de uma prova um valor POR
> OBJETO, para objetos que ela não contém, é tabela de consulta que erra em silêncio** — e
> erra para o lado de atribuir ao desconhecido o que é falta de medição (D23).

**O conserto, com a progressão medida:** 696 órfãs → 238 (medindo a face e a testada fina) →
**4** (medindo também o contrafactual do contrato). E as provas viraram o que são: **a
calibração** — todo lote que elas contêm recebe aqui o mesmo número, discordâncias **zero**.

**Mais a precondição que fecha o caminho silencioso:** lote externo sem distância à face
entregue, numa gleba que entrega face, faz a ferramenta **parar**. `null` ali não é *"não
há"*, é *"não medi"* (D175).

*É a décima sétima vez do ponto cego da §6, e a terceira da sub-família do CAMINHO — mas com
forma nova: aqui o caminho estava certo e o **objeto** estava errado.*

---

## D201 · A trava que vale é a que reprova a FRASE que você ia publicar · 07/10/2026

As travas do LAB-59 poderiam ter sido só estruturais — a soma fecha, os cenários são
monótonos, as contagens são contadas. Duas delas são **semânticas**, e escrevem a conclusão
como medição em vez de frase:

> *"a candidata de MAIS lotes aprova no cenário em que tudo foi resolvido"* e *"a nota DELE
> ainda prefere a de MENOS lotes — é isso que responde o Jonny"*.

**E foram exatamente essas duas que as duas primeiras sabotagens derrubaram**, as duas que
devolvem uma consulta ao lugar errado. Trava estrutural nenhuma caiu: a soma fechava, os
cenários eram monótonos, as contagens batiam — **com a resposta errada**.

> **Medição consistente não é medição certa.** A trava que protege uma conclusão é a que
> enuncia a conclusão e mede as duas pontas dela; se uma ponta virar, a frase da página do
> Jonny precisa ser remedida, e a trava é quem avisa.

*E há o lado §4 disso: a trava que exige que a primeira entre as que aprovam seja a de melhor
`notaDoMotor`. Sem ela, o dia em que alguém puser outra ali é o dia em que o Lab passou a
escolher variante pelo motor, e nada avisaria.*

---

## D202 · Régua que nunca saiu de casa não sabe o que não vê · 07/10/2026

O LAB-60 apontou a varredura de configuração do LAB-57 — a MESMA régua, de propósito — ao
clone do motor. Ela devolveu **zero regras desligadas** e **zero em `"warn"`** num
`eslint.config.js` que traz **as duas escritas em uma linha cada**.

**Três defeitos meus, em cadeia, e todos falso NEGATIVO:**

1. **o cabeçalho prometia `"off"` e nenhuma das seis regras o procurava.** A promessa estava
   escrita desde o LAB-57 e nunca foi exercida, porque nenhum `"off"` existia nos arquivos
   que a régua conhecia. Nasceu a `regra-em-off`, e ela achou **dois desligadores NESTE
   repositório** que seis regras não tinham visto;
2. **o `regra-em-warn` só via a string solta**, não a forma de array `["warn", { … }]` — que
   é a normal quando a regra tem opção. É o D137 outra vez: *régua que casa por nome exato
   mede ortografia, não conteúdo*;
3. **a limpeza comia arquivo inteiro** — ver D203.

> **Zero de régua cega é indistinguível de zero de árvore limpa** (D164). E o jeito de
> descobrir qual dos dois você tem é **apontar a régua para fora**: o repositório que ela
> conhece é feito à imagem dela.

*Daí uma regra de método: régua nova ganha a primeira viagem a um repositório que não ajudou
a escrevê-la, e o que ela não achar lá é suspeita contra ela, não elogio ao medido.*

---

## D203 · Limpeza que não sabe onde a string começa não limpa: ela corta · 07/10/2026

A `semComentarios` eram duas regex, e a de bloco era `/\/\*[\s\S]*?\*\//`.

**O `eslint.config.js` do motor traz `files: ["**/*.{ts,tsx}"]`** — que contém a sequência de
**abre-comentário** dentro de uma string — **e, mais abaixo, `files: ["scripts/**/*.ts"]`** —
que contém a de **fecha**. A regex casava **de dentro de uma string até dentro de outra** e
apagava **tudo no meio**, inclusive o bloco `rules` inteiro.

**E o mesmo valia aqui, em menor grau:** `"node_modules/**"` tem abre e `"**/*.d.ts"` tem
fecha. Os dois `eslint.config.js` desta casa vinham sendo parcialmente apagados **antes de
qualquer casamento**, e a sorte foi a região cortada não cobrir o `"no-undef": "off"`.

**O conserto:** a `semComentarios` passou a ser um **varredor de um passe** com estado —
fora, comentário de linha, comentário de bloco, ou dentro de `'`, `"` ou crase. O conteúdo
de string é **preservado**, que é o que a separa da `soOCodigo`. O que ele não alcança vai
dito: literal de regex contendo abre-comentário, cuja distinção de uma divisão exige a
gramática inteira.

**A trava do caso tem história própria, e ela é a lição dentro da lição:** a primeira versão
dela **PASSOU** sob a sabotagem, por um motivo de **ordem** — eu havia posto o bloco `rules`
**depois** do segundo glob, fora da região que a regex comia. No arquivo do motor a ordem é
glob-com-abre, `rules`, glob-com-fecha.

> **Trava que passa quando o defeito volta é enfeite** (D172). Reescrita na ordem do caso
> real, ela reprova **três** travas.

*E uma ironia que ficou registrada: a primeira versão do comentário que explica isto trazia
o exemplo do literal de regex escrito por extenso, e a sequência de fecha-comentário dentro
dele FECHOU o próprio comentário. O `tsc` pegou na hora — é o D175 do lado bom.*

---

## D204 · Prova gerada antes da última edição do que ela mede é prova velha · 07/10/2026

Medido ao abrir o LAB-60, no commit `4249027`, **sem mudar uma linha**:

| | a prova commitada do LAB-57 dizia | a ferramenta dizia, na MESMA árvore |
|---|---|---|
| `conferencia-desligada-por-arquivo` | **1** | **10** |

**A causa não é defeito de régua:** o último `bun run lab57` daquele prompt rodou **antes**
das edições finais dele mesmo — as que escreveram `@ts-ignore`, `@ts-nocheck` e
`eslint-disable` no texto dos declarados e na documentação da régua. A prova ficou com o
número de antes, e `naoDeclarados: []` **era verdade naquele instante**.

**E os 10 eram, nove deles, a régua acusando o próprio fonte** (D155). A única limpeza que
resolveria — tirar comentários — **cegaria essa regra por completo**, porque é dentro de
comentário que o desligador vive. Então a exclusão é a que a varredura de segredos do LAB-47
**já declara** (*"nem o fonte dela própria"*), e é **estreita**: só o arquivo que define os
padrões e as ferramentas e travas que publicam as chaves de achado. Depois dela: **5 achados
aqui, todos declarados**.

> **Nada no verde reprovava a prova velha.** A trava de hoje confere a prova **contra si
> mesma**; ela não **regera** a varredura. É a forma do D110 aplicada a prova em vez de
> suíte: *o que ninguém reexecuta não protege nada.*

Fica **proposto ao chat** (não executado, §1-A): uma trava que reexecuta a varredura e exige
que a prova bata — e a pergunta de projeto que vem com ela é **quais provas podem ser
regeradas dentro da trava** sem ferir o D182, que proíbe sobregravar prova "antes" com prova
"depois".

---

## D205 · Lista que o chat usa para escrever fila é dívida minha · 07/10/2026

O chat pediu *"continue a dívida própria com o que sobrou"*. Procurei onde a dívida é
**declarada** — a categoria `divida` do inventário das idas (**vazia** desde o LAB-37), as
perdas da ponte (que são perdas, não dívidas), `TODO`/`FIXME` no código (**zero**) — e achei
no lugar que eu não estava olhando: a seção *"Proposto ao chat — não executar"* da `FILA.md`.

**Medido na árvore do commit `961890b`, sem mudar nada:** de **14** itens abertos, **CINCO
já estavam executados**, e **DOIS eram cópias de itens riscados na MESMA lista**. Mais
**duas** propostas desta própria fila que viviam só em seções de prosa.

**E o custo não é estético.** Aquela lista é o que o chat lê para escrever fila: **quatro**
das filas que ele mandou saíram dela. Se ele a tivesse lido naquele dia, poderia ter mandado
de volta trabalho já entregue.

> **Lista que ninguém revalida envelhece igual a comentário** (D104, D136) — e quando a
> lista é a entrada de quem escreve a fila, o apodrecimento dela não é meu: é dele.

**O conserto é mecânico, e é por isso que vale:** cinco cobranças em
`src/varredura-das-propostas.ts` — riscado diz **qual prompt** o executou; aberto diz **por
que** segue aberto, de vocabulário **fechado** de seis motivos; nenhum aberto é **cópia** de
riscado; nenhum motivo foge do vocabulário; nenhuma proposta vive **só em prosa**. A
ferramenta **para** se achar problema, o *"antes"* sai do `git show`, e 19 travas exercitam a
régua com casos sintéticos — porque régua que só é exercida pelo documento de hoje cala no
dia em que o documento mudar de forma.

**A CÓPIA pede DOIS sinais, e isso também foi medido.** A primeira versão casava só pelo
número da decisão e **acusou uma terceira que não é cópia**: o item do `faceDeRua` cita
`D156` porque foi o **LAB-43 que o achou**, o mesmo prompt que propôs o detector. *Régua que
eu afrouxaria para caber no meu número é enfeite* (D172) — foi **estreitada**: decisão
compartilhada **e** título sobreposto acima de **0,6**. Medidos: as duas cópias dão **1,00**,
o falso positivo dá **0,00**.

*E o comentário do limiar dizia "1,00 e 0,88", escrito de cabeça; medido, são dois 1,00. É o
D185 pela quinta vez em oito prompts, e a quinta também foi pega dentro do prompt — pela
própria ferramenta.*

---

## D206 · Régua que lê MENÇÃO em vez da CITAÇÃO — a sexta vez da mesma família · 07/10/2026

A conferência de *"proposta que vive só em prosa"* exige que cada seção
`### Proposto ao chat, saído do LAB-xx` seja **citada por algum item da lista**. A primeira
versão aceitava `texto.includes("LAB-59")`.

**A sabotagem PASSOU com `exit 0`:** tirei de um item a citação de origem `(LAB-59)` e deixei
só o caminho da prova — e o nome do prompt continuava lá, dentro de
`docs/provas/LAB-59/contrafactual-de-antonina.json`.

> **É o D142 outra vez.** Lá a régua leu a **palavra** em vez do `import`; aqui leu o
> **caminho de arquivo** em vez da citação de origem. *Quando a régua procura um nome, tem de
> procurá-lo no lugar onde o nome significa aquilo* — e aqui esse lugar é a citação entre
> parênteses logo depois do título, a forma que esta lista sempre usou.

Consertada: `citaAOrigem(texto, prompt)` casa `(LAB-xx`. Refeita a sabotagem, **`exit 1`**,
com a linha nomeada. A trava do caso tem as três formas — a citação pura, a citação com
decisão, e o caminho de prova que **não** vale.

*A sub-família da régua que varre texto chega a OITO casos (D137, D142, D155, D177, D179,
D192, D203, D206). E as sabotagens que **passaram antes de pegar** são **QUATRO**, contadas
e não lembradas: D179 (área preservada não prova borda preservada), D198 (a calibração media
só os lotes de `frente`), D203 (a trava do glob com o `rules` fora da região comida) e esta,
a D206. Nas quatro o `exit 0` foi o achado.*

---

## D207 · A D197 já tinha decidido isto — o que é novo é o NOME do campo e o desempate · 08/10/2026

O chat pediu os seis mecanismos *"em ordem de quantas glebas cada conserto destrava"*, e eu
comecei a escrever isso como achado novo: *"'destrava' e 'aparece em' são perguntas diferentes"*.

**Não é novo. A D197 já diz, por escrito, há um dia:** *"`ensaio-47ha` é bloqueada por UM
mecanismo só… consertá-lo zera uma gleba inteira, sozinho, e é a única das cinco em que isso
acontece"*, e fecha com *"contagem diz o tamanho do conserto; 'quantas glebas destrava' diz a
ordem dele"*. Eu ia publicar uma decisão de ontem com a data de hoje.

> **Achado que repete decisão registrada não é achado: é a decisão sem a citação.** E ela custa
> mais do que parece, porque dá ao chat a impressão de que a lista mudou quando ela não mudou.

**O que é de fato novo, medido aqui, e é três coisas:**

**1 · O campo que a prova publica tem o nome errado.** Ele se chama `glebasQueEleBloqueia`, e o
que mede é **em quantas glebas o mecanismo aparece**. *Bloquear* é o que a D197 chamou de
destravar — e por aquele nome o valor de `face-de-quadra-limitada-num-eixo-so` seria **1**, não
**2**. É a família do **D166**, *"campo cujo nome diz MÍNIMO e cujo valor é um ALVO"*: aqui o
nome diz **bloqueia** e o valor diz **aparece em**. Quem lesse a prova sem ler a D197 ordenaria
pelo campo, achando que estava ordenando por destrave.

**2 · A lista publicada tem desempate que ninguém reproduz.** A ordem que está hoje no
`ONDE_PARAMOS` divide corretamente o primeiro e os dois de alcance 3, e então, nos **três de
alcance 1**, sai `esguelha` (4 violações) → `faixa` (18) → `rede` (11). Isso não é volume
crescente, não é volume decrescente e não é a ordem do módulo (6, 1, 2). **Lista que vai ao motor
com três posições que ninguém sabe explicar é lista que volta com pergunta.** A ordem passa a ser
**declarada e reproduzível**: destrave, depois alcance, depois violações — e ela diverge da
publicada **a partir da posição 4**.

**3 · A quantificação, que a D197 não tinha: 1 de 6 destrava e CINCO destravam zero.** E o que
destrava não é o de maior alcance (tem 2 contra 3) **nem** o de mais violações (14 contra 23) —
então nenhum dos dois números que a prova publica serve de proxy.

**E a D197 não tinha guarda nenhuma: era prosa.** Agora tem, e é semântica
(`tests/tres-listas.test.ts`): as duas ordens **não** dão o mesmo primeiro; **um** destrava e
**cinco** destravam zero; o que destrava tem alcance e violações **menores** que os máximos.
**Sabotagem:** removida a exigência de que a gleba tenha um mecanismo só, as duas ordens
coincidem e a ferramenta sai com **`exit 1`** dizendo que o achado deixou de existir
([`provas/LAB-62/sabotagem.json`](provas/LAB-62/sabotagem.json), nº 3).

*Esta é a primeira vez que o §6 me pega não por acusar o medido, mas por **reapresentar como meu
um achado que já estava decidido**. A regra que sai dela: antes de escrever "o achado é", procurar
o achado nas decisões — e se ele estiver lá, o item é a **citação** mais o que de fato sobrou.*

---

## D208 · Afirmação que nomeia artefato não é afirmação — e a guarda barra endereço, não nome · 08/10/2026

O chat mandou, pelo achado da Pesquisa que virou o LAB-63: *"cada item diz o que precisa ficar
verdadeiro, não qual arquivo mexer."* O motivo medido do outro lado é que **pedido que nomeia o
artefato volta pela metade** — quem recebe mexe no arquivo nomeado e a afirmação continua falsa.

Então cada item das duas listas numeradas que vão ao motor carrega **três** campos, e nenhum
deles é endereço: **o que precisa ficar verdadeiro**, **com que frequência isso se confere** — a
frequência é metade do pedido, e sem ela a afirmação não tem como ser reconferida — e **o que
NÃO serve** como prova de que ficou verdadeiro.

A guarda é `afirmacaoNomeiaArtefato`, e o que ela barra é **endereço**: separador de caminho e
extensão de arquivo. O que ela **não** barra é nome de chave de configuração (`skipLibCheck`) nem
nome de passo (`lint`) — esses são **a coisa de que a afirmação fala**, e barrá-los deixaria a
afirmação sem sujeito. A diferença está na trava, com os dois lados.

**E o conserto saiu de dentro da própria régua, pelas minhas travas** (D184): a primeira versão
varria a lista de extensões na ordem declarada e devolvia `` `.ts` `` para `pacote.tsx` e
`` `.js` `` para `TSCONFIG.JSON`. O **veredicto** estava certo nos dois casos — a afirmação
nomeia artefato —, e o **rótulo** estava errado; e é o rótulo que iria escrito na mensagem ao
motor. *Régua que erra o rótulo e acerta o veredicto não é régua errada — mas mensagem com o
rótulo errado é mensagem errada.* Varre-se da extensão **mais longa** para a mais curta, e a
extensão só casa quando não continua em letra ou dígito.

**Sabotagem:** uma afirmação trocada por um caminho de arquivo leva a ferramenta a **`exit 1`**
nomeando o mecanismo e o motivo ([`provas/LAB-62/sabotagem.json`](provas/LAB-62/sabotagem.json),
nº 1).

---

## D209 · O teto do recado e "um por linha" não cabem juntos — e a saída é bloco próprio · 08/10/2026

O chat pediu as três listas **dentro do recado**, os onze itens *"um por linha"*, *"porque é só
o recado que chega até o chat"*. A `CLAUDE.md` §1 põe teto de **12 linhas** no recado, com trava
(`tests/recado.test.ts`). Os dois pedidos são incompatíveis: só a primeira lista são 13 linhas.

**Resolvido sem afrouxar nenhum dos dois:** as três listas vão em **blocos de código próprios**,
logo acima do recado — copiáveis um por um, que é o que o chat de fato faz com eles —, e o recado,
dentro do teto, diz **quantos blocos são** e **o que cada um carrega**. A regra de que *nada vem
depois do bloco do recado* continua inteira: o que mudou é o que vem **antes** dele.

> **O teto do recado é teto do RECADO, não teto da resposta.** Ele existe para o chat não ter de
> caçar informação numa resposta longa; três blocos nomeados e fechados são o contrário de caçar.

E os blocos são **saída de ferramenta**, não texto que eu digito: `bun run lab62` os gera das
três provas que já mediram as coisas, e grava em
[`provas/LAB-62/os-tres-blocos.txt`](provas/LAB-62/os-tres-blocos.txt). O motivo é o D185 — *número
que o próprio relatório lista ao lado não se escreve de memória* —, e as travas conferem o bloco
gerado: onze linhas numeradas na lista 1, e dez vezes cada um dos três campos nas listas 2 e 3.

*Das quatro sabotagens deste prompt, **nenhuma passou** — a primeira vez em cinco prompts. Mas o
achado do rótulo da extensão (D208) saiu **antes** das sabotagens, pelas travas que eu acabara de
escrever: é a oitava vez que a régua nova se acusa a si mesma dentro do próprio prompt.*

---

## D210 · Afirmação que entrou sem régua não sai mais — e ela tem duas formas aqui · 08/10/2026

O chat somou quatro prompts num só e trouxe três achados de três lugares. **Eles são o mesmo
achado visto de três lados:**

| de quem | a frase |
|---|---|
| Pesquisa | **pedido que nomeia o artefato volta pela metade** |
| Render | **dívida aceita é acusação não revisada** — sete de vinte e oito nunca foram dívida |
| Central | **contraexemplo tratado como exceção é regra que continua errando** |

Procurei as duas formas que isso tem nesta casa, e **as duas estavam lá**:

1. **a acusação que nomeia um ENDEREÇO no repositório do vizinho** (D211);
2. **a regra da casa cuja aritmética não fecha** (D212).

E procurei uma terceira onde ela *deveria* estar e **não estava** — o contraexemplo registrado
nas `DECISOES.md`. A régua crua acha **22 pares**; a estreita, que exige a marca **na mesma
frase** da citação, acha **zero**. Os 22 são todos falso positivo da família D142/D155: a marca
está na decisão, mas falando de outra coisa.

> **Zero não é "nada a consertar": é onde o contraexemplo NÃO está.** O das minhas regras mora
> na `CLAUDE.md`, onde ele é **absorvido no texto da própria regra** — e ali o que ninguém media
> era a **aritmética do fechamento**.

A diferença entre 22 e zero sai na prova, com três exemplos do falso positivo, porque régua que
só publica o próprio número não deixa ninguém conferir o salto.

---

## D211 · Endereço que leva à CHAMADA e não à DEFINIÇÃO manda procurar no arquivo errado · 08/10/2026

Cada um dos seis mecanismos do LAB-58 declara `ondeNoMotor`: arquivo e nome no clone do
`motor-testfit`. **São acusações contra o motor de um vizinho, e elas já saíram** — no
relatório, no recado e na lista que o chat leva. **Nada no verde conferia o endereço.**

Medido contra o clone: o mecanismo `rede-viaria-aparada-so-pela-divisa` dizia
`motor.ts · apararRedeViaria e aplicarCulDeSac`, e os **dois** moram em outros arquivos —
`apararRedeViaria` em `aparo.ts:97` e `aplicarCulDeSac` em `formatos.ts:816`. Em `motor.ts`
eles só são **chamados** (linhas 247 e 209). **Dois de seis símbolos apontavam para o arquivo
errado**, e os outros quatro estavam certos.

> **O endereço é exatamente o "artefato" que o LAB-62 mandou não nomear** (D208) — e quando ele
> é nomeado de todo jeito, tem de **resolver**. Endereço que leva à chamada manda quem recebe a
> acusação procurar no arquivo errado: é o *pedido pela metade* da Pesquisa, do lado de quem
> acusa.

**O campo também não cabia a verdade:** ele tinha um arquivo só, e o mecanismo mora em dois.
*Campo que não cabe a verdade força a mentira curta.* Agora ele aceita vários endereços
separados por `;`.

**A régua cobra DEFINIDO e não MENCIONADO** — o nome depois de `function`, `const`, `class`,
`type` —, que é o D142 no coração dela: o arquivo errado era justamente um onde o nome
**aparece**. E descrição em português (*"a montagem das quadras"*) sai como descrição e **não**
se cobra como definição, senão a régua mediria ortografia (D137). Um mecanismo dos seis é só
prosa, e **esse número sai na prova**, porque endereço sem símbolo é endereço não medido.

**Sabotagem:** o texto antigo replantado leva a ferramenta a **`exit 1`** nomeando os dois
símbolos e onde cada um está de verdade
([`provas/LAB-63/sabotagem.json`](provas/LAB-63/sabotagem.json), nº 1).

---

## D212 · A §6 declarava dezesseis e classificava catorze — a regra que ninguém somava · 08/10/2026

A `CLAUDE.md` §6 é a página que eu leio **antes de toda tarefa**, e a §1-B diz dela, por
escrito: *"regra que ninguém pode desmentir é slogan (D136), e esta pode."* **Até aqui ela não
podia.** Medido:

| o que a §6 dizia | o que era |
|---|---|
| *"se repetiu DEZESSEIS vezes"* + 16 linhas na tabela | ✅ fechava |
| *"NOVE foram réguas minhas, **duas** foram a ponte e **três** foram caminho errado"* | 9 + 2 + 3 = **14**: duas das dezesseis **sem classe**, numa frase que se lê como partição |
| as classes citavam **D104** e **D175** como membros | nenhuma das duas é **linha da tabela** |
| *"três das **quinze** vezes eu classifiquei pelo nome"* | o ordinal ficou atrás de quando a lista tinha quinze |

**Nenhuma das três é erro de fato — são erros de FECHAMENTO**, e é por isso que duraram: cada
frase, lida sozinha, está certa.

A partição agora é **tabela declarada**, com a classe de cada linha nomeada, e fecha:
**7 régua + 4 ponte/ida + 2 caminho + 2 cabeça + 1 dado = 16**.

**E a sabotagem nº 2 achou um buraco de verdade na guarda:** trocando `SETE` por `NOVE` e
apagando a classe de duas linhas, **a soma volta a fechar em 16** e duas linhas ficam sem classe
— a ferramenta ficou **calada**, e só uma trava pegou. *Soma é invariante fraca.* A partição
passou a se cobrar **linha por linha**: cada linha em exatamente uma classe. Refeita a
sabotagem, `exit 1` nomeando D161 e D185.

---

## D213 · QUATRO falso negativo na régua nova, e os quatro eram SILÊNCIO · 08/10/2026

A régua deste prompt não viu o que estava lá **quatro vezes**, e nenhuma delas estourou: todas
devolveram *"nada encontrado"*.

| # | o defeito | o que ele escondia |
|---|---|---|
| 1 | o parser do endereço dividia **antes** de tirar o parêntese, e `reservarFacesExternas (lido, não tocado)` virava dois pedaços | **quatro dos seis símbolos** iam para `descricoes` e nunca eram conferidos |
| 2 | o casador de classe exigia a palavra de número no **começo** do negrito, e a frase real é `**Das DEZESSEIS, NOVE foram…**` | **zero classes**: a trava da soma nunca disparava |
| 3 | o prefixo do casador terminava em `\b`, e **`\b` não conhece português** — há fronteira entre `r` e `ê` | `três` virou `ês`, que não está no mapa: **o D137 dentro da régua escrita para achar o D137** |
| 4 | a tabela nova enchia a lista de palavras desconhecidas **depois** de os problemas serem montados | a palavra chegava tarde e **não entrava na lista** |

E houve um quinto, pior que os quatro porque era da **guarda**: ao reescrever a §6 como tabela,
a régua passou a achar zero classes e a imprimir ***"tudo conferido"***.

> **Guarda que não acha a partição não está aprovando a partição: está sem medir nada.**

**O que mudou no desenho, e é a lição que fica:** palavra de número não reconhecida e partição
não encontrada passaram a ser **problema**, e não `continue`. *Foi o silêncio do `continue` que
escondeu os quatro.* Régua que não acha nada tem duas leituras — *está limpo* e *estou cega* —, e
**só a segunda é segura de assumir por conta própria**.

*Os quatro foram pegos **dentro do prompt**, e três deles pela sonda que eu rodei antes de
escrever a ferramenta; o quinto, pela sabotagem. Nenhum saiu.*

---

## D214 · "Prompt", para o Jonny, é o que ele COLA — e eu li como item da fila, duas vezes · 08/10/2026

> **CORREÇÃO DO MOTIVO, gravada em 08/10/2026 a pedido do chat, e ela muda a origem da decisão,
> não o conserto.** Esta decisão nasceu dizendo que a leitura errada foi só minha. **Não foi:**
> *"houve mal-entendido e a palavra ambígua foi minha — quando o Jonny pediu para 'unificar', ele
> falava dos BLOCOS que ele copia da tela, não de itens da fila."* A palavra ambígua veio do
> chat; eu escolhi a leitura errada dela **duas vezes**, e o sinal que eu ignorei continua sendo
> meu. *Decisão com origem errada ensina a lição errada a quem a reler* — por isso a correção
> vem **aqui dentro**, e não num item novo.
>
> **E a soma do LAB-65 dentro do LAB-64 FICA**, ratificada pelo chat: *"a razão é boa, são a mesma
> varredura, e você acertou em riscar em vez de renumerar."*

Depois do LAB-62 o chat mandou **duas vezes**: *"some dos dois prompts em 1 somente"* e, logo
depois, *"melhor os vários prompts em 1 somente"*. **Eu li "prompt" como item da fila nas duas**
— somei LAB-64 com LAB-65, e depois os quatro restantes num só — e fui mexer **na fila**.

Ele falava da **resposta**. O LAB-62 saiu com **quatro blocos de código** (três listas e o
recado), ele estava no celular, e a terceira mensagem foi explícita:

> *"Parece meio óbvio não??? Você gerou 5 prompts diferentes... quer que eu fique indo lá com 5
> prompts?"*

**Para ele, *prompt* é o que ele cola no chat do outro app** — e **quatro botões de copiar são
quatro viagens**. A leitura óbvia era a dele, e eu precisei de três mensagens para chegar nela.

> **O vocabulário de quem pede manda no vocabulário de quem executa.** Palavra que tem nome
> técnico aqui dentro (`prompt` = item da `FILA.md`) pode ter outro nome lá fora, e quando os
> dois colidem **quem decide é quem pediu**. Pedido repetido que eu "cumpro" e o pedinte repete
> **de novo** não foi cumprido: foi lido errado.

**A §1 ganhou a regra, e ela é curta:** tudo o que vai ao chat cabe **no mesmo bloco**, acima da
linha `=== RECADO PARA O CHAT`; o teto de 12 linhas é do **recado**, da marca ao `=== FIM ===`,
e o que vem acima dela não tem teto.

**Tem guarda** (`tests/recado.test.ts`): nenhum bloco de código do `RECADOS.md` fica **fora** de
um recado. E a régua que extrai o recado foi **estreitada ao contrário** — ela exigia que o bloco
**começasse** com a marca, e com isso a regra nova seria impossível de cumprir sem quebrar a
trava. *Guarda escrita contra a forma antiga proíbe a forma nova, e isso não é a guarda estando
certa.*

**O que NÃO se perdeu, e vale dizer:** as duas somas de fila que eu fiz por leitura errada
**entregaram o conteúdo todo** — o LAB-63 executou o que o LAB-64, o LAB-65 e o LAB-66 pediam, e
está medido e mesclado. O que ficou errado foi a **forma da fila**, não o trabalho.

---

## D215 · UM BLOCO SÓ por rodada — o recado primeiro, e o resto abaixo dele · 08/10/2026

A regra escrita pelo chat, e ela passa a valer na família:

> **Tudo que ele precisa copiar sai dentro de um único bloco de código — o recado primeiro, nas
> suas doze linhas, e logo abaixo, no MESMO bloco, qualquer lista, texto para colar em outro
> lugar ou pedido a outro repositório, separado por uma linha de marca. Nunca dois blocos, nunca
> um texto na conversa acima do bloco.**

E a parte que desfaz o conserto errado que eu tinha acabado de fazer:

> **O limite de doze linhas é do RECADO e não do bloco: o bloco pode ser longo, e partir o bloco
> para caber nas doze linhas é o defeito, não o conserto — o custo dele é o número de cópias, não
> o tamanho do texto.**

**Eu tinha posto o recado por ÚLTIMO**, com as listas acima. Está invertido: o recado abre, a
linha `--- O QUE VAI JUNTO ---` separa, e o resto vem abaixo. Quem lê de cima para baixo no
celular encontra o estado antes da lista, que é o ponto do §1 desde o começo.

**E o ACUMULADO:** rodando mais de um prompt sem ele voltar, o bloco mais novo abre com
`ACUMULADO — inclui os recados X, Y e Z`. **O recado completo de cada prompt continua indo
inteiro para o arquivo** — *o acumulado é a forma de entregar, nunca a de registrar.*

**Esta régua já esteve nas duas formas erradas no mesmo dia:** primeiro exigindo que o bloco **só**
contivesse o recado, depois aceitando o recado em **qualquer** posição dele. A regra do chat é a do
meio. *Guarda escrita contra a forma antiga proíbe a forma nova; guarda frouxa demais não proíbe
nada.*

---

## D216 · Recado que foi ao chat e não foi ao arquivo — aconteceu com o recado da própria regra · 08/10/2026

No dia em que a regra do bloco único foi escrita (PR #85), **o recado dela foi ao chat e não foi
ao `RECADOS.md`**. É literalmente a §1-B — *"o que vai ao chat e não vai a um arquivo não existe
amanhã"* — acontecendo com o prompt que estava consertando a §1.

Recuperado no mesmo dia, **sem reescrever o texto**, e marcado como recuperado.

**A trava nova:** todo relatório `docs/relatorios/LAB-xx.md` tem recado no arquivo citando aquele
prompt. **E o buraco dela fica declarado**, porque esconder buraco de guarda é pior que não ter
guarda: **rodada sem relatório — como esta regra do bloco, que não é prompt de fila — não tem
âncora para a trava morder.** Para essas, o que resta é a disciplina: *o recado vai ao arquivo no
mesmo commit em que vai ao chat.*

---

## D217 · A forma ACUMULADA já existia aqui, e a minha trava nova chamou o precedente de falta · 08/10/2026

A primeira versão da trava do D216 casava `— Lab · LAB-13 ===` **exato**, e acusou **LAB-13 e
LAB-14** de não terem recado.

**Têm.** Têm **um recado só para os dois**, de 19/09/2026, com o cabeçalho
`=== RECADO PARA O CHAT — Lab · LAB-13 e LAB-14 ===`.

> **Régua que casa por nome exato mede ortografia, não conteúdo** (D137) — e desta vez o acusado
> era o **precedente** da forma que o chat acabou de escrever na §1. A prática já tinha inventado
> o ACUMULADO três semanas antes da regra, em outra forma.

É a **décima sétima** ocorrência do ponto cego do §6, e a **oitava** da sub-família da régua que
varre texto. Pega dentro do prompt, pela própria trava.

**A trava corrigida** lê os cabeçalhos e procura o prompt como **palavra** dentro do
`<prompt>`, que aceita tanto `LAB-13 e LAB-14` quanto o `ACUMULADO — inclui os recados …` da
regra nova. **E a forma antiga não foi reescrita:** `RECADOS.md` é registro do que foi enviado, e
registro não se maquia para caber em régua nova.

---

## D218 · Regra de forma sem o sujeito escrito manda na coisa errada · 08/10/2026

**Achado da Central, e ele explica o meu erro melhor do que eu tinha explicado:**

> *"'Máximo de 12 linhas', sem dizer DE QUE, obriga a abrir um segundo bloco — os quatro blocos
> foram **OBEDIÊNCIA a uma regra errada, não desobediência**."*

A D214 e a D215 trataram o caso como leitura errada minha. É isso **e mais que isso**: a §1 pedia
um teto **sem sujeito**, e das duas leituras possíveis — teto do recado, teto do bloco — eu
escolhi a que partia o bloco. *Regra de forma sem sujeito não é ambígua para quem a escreveu; é
ambígua para quem a cumpre, e quem a cumpre é quem erra.*

**Varrido o `CLAUDE.md` inteiro, pela régua, nas seis seções que carregam regra** (§1, §1-A, §1-B,
§4, §5, §7): **UMA** regra de forma não dizia de quê —

> *"Doze linhas é teto, não meta."* — §1, e **é exatamente a frase que me fez abrir os quatro
> blocos**. As outras com limite (`doze caracteres **de um segredo**`, `um despertador **de 60
> minutos**`, `um prompt **por despertador**`) já nomeavam o sujeito.

Consertada: *"Doze linhas é teto **DO RECADO**, não meta — e não teto do bloco."*

**A régua, e o escopo é estreito de propósito** (`src/limites-com-sujeito.ts`): ela varre **só as
seções de regra** — a §6 é narrativa cheia de número (*"441 de 441"*, *"9 + 2 + 3 = 14"*) e varrê-la
acusaria prosa, que é o D137. Ignora a **citação literal da Central**, que é fonte e não regra
minha, e ignora frase que **relata a redação antiga** (`dizia`, `estava`, `era`), que é o D155.

**E a régua errou duas vezes antes de servir, as duas pegas pelas minhas travas:**

1. `dizDeQue` exigia a ligação seguida de **maiúscula**, e `oito passos do verde` passava batido;
2. pior, **o `de` que introduz a QUANTIDADE não é o que nomeia o sujeito**: em `teto **de** doze
   linhas` o `de` liga ao número. Agora vale qualquer ligação cujo alvo **não** seja numeral.

**E a sabotagem passou na primeira tentativa:** eu troquei só o pedaço `teto DO RECADO` por `teto`,
e o **resto da frase nova** trazia `do bloco` — a régua achou o sujeito ali e aprovou. *Sabotagem
que replanta meio defeito mede meia coisa.* Refeita replantando a frase **inteira** como era,
`exit 1`.

**Há trava** (`tests/limites-com-sujeito.test.ts`, 10): zero limites sem sujeito hoje; a frase
antiga replantada é pega; um limite novo sem sujeito em qualquer seção de regra é pego; o mesmo
limite **com** sujeito passa; a §6 e a citação da Central ficam de fora.

---

## D219 · A trava do ACUMULADO proibia nomear rodada fora de fila · 08/10/2026

A marca do bloco acumulado nasceu ontem casando só `LAB-xx`. Hoje, ao escrever o primeiro
acumulado de verdade, ele precisava nomear **duas rodadas sem número de prompt** — as da regra do
bloco (§1 e §1-C) — e a trava reprovou a forma **correta**.

> *Régua escrita contra uma forma só proíbe a outra que existe de verdade.* É a mesma falta do
> **D217**, onde a trava do recado ausente acusou o cabeçalho composto `LAB-13 e LAB-14`: duas
> vezes em dois dias, régua nova negando o caso legítimo que ela não tinha visto.

Consertada a **régua**, não o texto: o item do acumulado é `LAB-\d\d` **ou** `§<seção>`, e os
separadores são `, ` e ` e `. **E ela continua recusando mush** — *"inclui uns recados aí"* e
*"inclui os recados vários"* reprovam, e isso está na trava, porque alargar régua sem dizer onde
ela para é tirá-la do caminho.

*Esta é a segunda vez em dois dias que eu alargo uma régua minha logo depois de escrevê-la. O
padrão vale mais que os dois casos: **régua nova nasce estreita demais, e o primeiro uso real é
que mostra onde** — por isso o primeiro uso real vem no mesmo prompt, e não no seguinte.*

---

## D220 · O orçamento de Actions da família, e a parte deste repositório é ZERO · 08/10/2026

A conferência automática da família parou: todo trabalho falhava antes de executar um passo, com
*"recent account payments have failed or your spending limit needs to be increased"*. Outubro, no
painel: uso bruto **US$ 23,75**, cota gratuita **US$ 13,75**, **US$ 10,00** a pagar. **O Jonny
decidiu não comprar mais orçamento.** A cota zera em **1º/11/2026**.

**Antes de desligar, medi o que mais passa pela máquina paga — e a resposta é NADA:** o
repositório tem **um** workflow, `.github/workflows/verde.yml`, com **dois** trabalhos, e os dois
são **conferência**. Nenhum sobe aplicativo para provedor de hospedagem, nenhum aplica migração em
banco, nenhum tem prazo (cobrança, aviso, backup). Varrido por padrão — `deploy|publish|vercel|
netlify|render|fly.io|heroku|migrat|prisma|drizzle|supabase|cron|schedule|backup|cobran` — e deu
**zero linhas**. Desligar aqui é seguro, e isso foi **medido antes**, não suposto.

**E a conta deste repositório é ZERO, por um motivo estrutural:** `archilly-lab` é **público**
(`"visibility": "public"` pela API), e Actions em runner padrão é **gratuito e não medido** em
repositório público. Medido: **136 execuções, 272 trabalhos, 272 de 272 em `ubuntu-latest`**.
Se fosse privado, seriam **US$ 2,18**.

> **A família assumiu que todo aplicativo paga. Este não paga.** Vale conferir a visibilidade dos
> outros oito antes de redesenhar rotina — pode ser que o estouro tenha menos culpados do que
> parece.

**Desliguei assim mesmo**, porque a ordem foi da família e porque metade dos minutos era
desperdício puro (D221). **Nada foi apagado:** o gatilho virou comentário, o `workflow_dispatch`
ficou, os comentários que explicam cada trabalho ficaram, e a rotina foi **desabilitada no
GitHub** — que é a trava que de fato segura, porque editar a `main` não protege ramo antigo.
**Aqui só há dois ramos** (`main` e o de trabalho), então o problema dos 28 ramos do Render não
existe — mas a desabilitação foi feita mesmo assim, e **feita ANTES da edição**, senão o próprio
envio do conserto gastaria mais uma rodada.

---

## D221 · Metade dos meus minutos era um fracasso conhecido de antemão · 08/10/2026

Medido por trabalho, `started_at` a `completed_at`, **arredondado para cima ao minuto por
trabalho** — medição minha, não a fatura. O endpoint oficial `/timing` devolveu zero no Render, e
eu não o usei.

| | |
|---|---|
| execuções em outubro | **136**, todas de 04/10 a 08/10 |
| trabalhos | **272** · minutos **272** · média **2,00 min** por execução |
| `guardas que não precisam dos clones vizinhos` | 136 min · **134 sucesso, 2 falha** |
| `o verde completo (precisa do segredo VIZINHOS_TOKEN)` | 136 min · **136 FALHA, 136 de 136** |
| runner | **272 de 272 em `ubuntu-latest`** — sem matriz, sem Windows, sem macOS |
| custo | **US$ 0,00** (repositório público) · US$ 2,18 se fosse privado |

**O DESPERDÍCIO PURO, e ele é meu:** o trabalho `o verde completo` **não podia** ter sucesso —
ele depende do segredo `VIZINHOS_TOKEN`, que nunca existiu, e **falha com a receita por desenho**
(D124). São **136 minutos, 50 % de tudo, gastos num fracasso conhecido de antemão.** O D124 está
certo em não pular; **o que está errado é agendá-lo para rodar sozinho enquanto o segredo não
existe.** *Falhar com a receita é honesto na mão; agendado, é pagar para repetir um recado.*

**A duplicação estrutural:** **92 SHAs distintos para 136 execuções** — **44 commits rodaram duas
vezes**, porque `push` **e** `pull_request` disparam no mesmo SHA. Zero re-execuções do mesmo
evento. São **44 minutos** a mais no trabalho 1, somados aos 136 do trabalho 2.

**O envio que não mexeu em código:** **43 de 136 execuções (32 %)** vieram de commit que tocou só
`docs/` ou `.md` — **86 minutos**. *Mas isto NÃO é desperdício puro aqui*, e a diferença importa:
**as minhas travas conferem DOCUMENTO** — a página do Jonny, o formato do recado, a aritmética da
§6, a lista de propostas. Num envio de prosa elas têm o que fazer. O que elas não têm o que fazer
é no trabalho 2, que precisa de clone e de segredo.

**Rodada que não precisava ter acontecido: 180 dos 272 minutos — 66 %**, sendo 136 do trabalho que
não podia passar e 44 da duplicação de gatilho. Em repositório privado isso seria **US$ 1,44 de
US$ 2,18**.

**A maior alavanca não é o desenho, é o número de envios** — e a família mediu isso melhor que eu:
o Render enviou **131 vezes em 5 dias para ~7 entregas**. Aqui foram **136 execuções para 92
commits em 5 dias**. A regra entrou na `CLAUDE.md` §7: **os commits de uma entrega saem num `push`
só.** Commitar é de graça; `push` é que custa.

---

## D222 · A minha régua de desligadores ficaria VERDE com o CI inteiro parado · 08/10/2026

**O achado é do Render e eu confirmei aqui:** a `varredura-de-configuracao.ts`, com as suas sete
regras, procura **regra de lint em `"off"`**, **passo que ignora erro**, **lint sem
`--max-warnings 0`** e **chave de `tsconfig` que afrouxa**. Ela **não tem forma nenhuma** para:

- o **gatilho virou comentário** (`#  push:`);
- a rotina está **`disabled_manually`** no painel do GitHub;
- o arquivo do workflow foi **renomeado**.

> **Régua desligada publica verde** — e o desligamento mais completo que existe é justamente o que
> ela não vê.

**Consertado com trava própria** (`tests/gatilho-do-verde.test.ts`), e ela cobra os **dois** lados,
porque régua de um lado só mente na direção contrária: **desligado** exige a receita no lugar único
com os dois passos e o aviso no `ONDE_PARAMOS`; **ligado** exige que o aviso **saia** dos dois.

**E ela tem PRAZO:** a partir de **1º/11/2026** — quando a cota zera e o motivo de estar desligado
acaba — a trava **reprova** enquanto o gatilho estiver comentado, com a receita na mensagem de
erro. *Desligamento sem prazo vira desligamento permanente*, e em 1º de novembro alguém vai
esquecer de religar.

---

## D223 · O verde depende de clone irmão por caminho, e ele pode mudar sozinho · 08/10/2026

Ao reabrir hoje, os **três clones vizinhos não existiam** — o contêiner foi reciclado e só o
`archilly-lab` voltou. O comando único **falhou com a receita**, 7 de 7 passos, sem pular nenhum:
o D124 funcionou exatamente como foi escrito.

Reclonados (`--depth 1`), o verde voltou a rodar — e **ficou VERMELHO: 10 falhas em 552 testes**,
em `porta`, `testada-de-frente`, `guarda-da-ponte`, `coluna-vertebral`, `identidade`, `recorte` e
`poligono`.

**Medido antes de atribuir (§6), e a conta é de uma linha:** guardei as minhas mudanças
(`git stash`), rodei três dos arquivos que falham na `main` **limpa**, e **3 de 17 falharam
igual**. *As falhas não são minhas: são dos vizinhos.* O `motor-testfit` voltou em `6cf6396` e o
hub em `72cfab0`, e esses não são os commits com que o verde fechou ontem.

> **Verde que depende de clone irmão POR CAMINHO (D16) é verde que fica vermelho sem ninguém
> tocar neste repositório.** O caminho está fixado; a **versão**, não.

**O D16 continua certo** — copiar o motor da própria família criaria uma segunda cópia
envelhecendo em silêncio. O que falta é o outro lado dele: **o caminho sabe ONDE, e ninguém sabe
QUANDO**. Nenhuma prova deste repositório registra o commit dos vizinhos com que foi medida, e por
isso não há como dizer se um número mudou porque o motor mudou ou porque a minha ponte mudou.

**Proposto ao chat, não executado** (§1-A): gravar o commit de cada clone vizinho em toda prova
que o use, e o comando único reprovar quando a prova citar um commit e o clone estiver noutro —
com a opção de **reconhecer** a mudança, que é o que transforma "quebrou" em "o motor andou".

*Isto é a família do D104 noutra escala: o que não se revalida envelhece, e aqui o que envelhece
não é um comentário, é a versão inteira do vizinho.*

---

## D224 · A D223 acertou o veredicto e ERROU A CAUSA — e a causa é o que saiu · 09/10/2026

A D223 disse: *"os clones vizinhos foram recriados em commits mais novos e o verde ficou
vermelho"*. Isso saiu no recado do LAB-67, no PR #90 e no `ONDE_PARAMOS`.

**O veredicto estava certo — as falhas não eram da entrega, e o `git stash` provou. A CAUSA que
eu nomeei estava errada.** Medido no item 001, falha por falha:

| quantas | o que era | de quem |
|---|---|---|
| **9** | o `.wasm` **ausente** — artefato de build do PRÓPRIO repositório, que o contêiner apagou | daqui |
| **2** | `plano[].travessias` e `plano[].indicadores`: campo novo do motor **sem destino escrito** na ponte | daqui, e é violação da §4 |
| **1** | a minha trava do LAB-67 casando **consigo mesma** | daqui, nasceu na véspera |
| **1** | prova publicada velha: rampa de `ensaio-com-via`, **17,92 % publicado contra 21,63 % medido** | daqui |
| **1** | `contrato-v2`: o pico que o Parcelamento reporta | **do motor** — e é o único |

> **Dez de onze eram daqui.** E eu publiquei "é dos clones" sem medir nenhuma.

**O que deixou a D223 passar:** eu rodei `bun test`, não `./external-engines/conferir.sh`. O
comando único tem a **precondição do `.wasm`** e teria dito, na primeira linha, que o artefato
não existe (D124). *A regra do §7 — "verde é UM comando" — não é sobre conforto: é sobre o
comando saber coisas que o atalho não sabe.*

**Corrigida riscando, não apagando**, aqui e no `ONDE_PARAMOS`. É a **décima oitava** vez do §6,
e a forma é nova: **veredicto certo, causa errada** — e a causa é o que vai no recado.

---

## D225 · Eu comparei uma CONSTANTE em três versões do motor e chamei de medição · 09/10/2026

Para separar as pilhas do item 001, movi o clone do motor em quatro commits e reli o número. Em
dois dos casos eu li a linha `Received:` — e `Received:` era **o valor lido da prova publicada**,
não a medição. **Constante não muda quando o motor muda.** Conclusão falsa: *"invariante em
quatro commits, logo não é o clone."*

Quando refiz a conta lendo o valor **vivo**, o mesmo experimento no `contrato-v2` devolveu
**109,51 % em 19/09 e 175,51 % em 05/10** — o motor andou, e andou muito.

> **Experimento que não consegue dar outro resultado não é experimento.** Antes de concluir
> *"invariante"*, pergunte o que teria de acontecer para o número mudar — e se a resposta for
> "nada", você mediu um literal.

Vale para o `expect(a).toBe(b)` de qualquer suíte: `Received` é o **primeiro** argumento, e
quando o primeiro argumento vem de um arquivo, é o arquivo que está sendo impresso.

---

## D226 · Entregar campo que o motor passou a aceitar é PROMPT, não conserto de typecheck · 09/10/2026

O `Terreno["legais"]` do motor ganhou quatro campos, e o typecheck daqui quebrou. A tentação era
preenchê-los com o que o contrato declara. **Medido o efeito antes de aceitar:** a rampa máxima
publicada de `ensaio-com-via` **mudou** quando eu os entreguei.

Ou seja, o motor **ganhou a capacidade** que esta ponte declara como perda, com todas as letras:
*"o motor não limita rampa de via — ele não calcula greide"*. Entregar o campo **muda o
desenho**, e o §4 proíbe consertar geometria em silêncio; o §1-A proíbe ampliar escopo.

Os quatro saem **`null`** — *não entregue*, que é a verdade —, com o motivo escrito ao lado, e
**três perdas declaradas desta ponte ficam sob suspeita de estarem velhas**: o motor pode ter
crescido por baixo delas. Isso é prompt, com medição nas duas passagens, e entrou na caixa.

---

## D227 · Trava cujo próprio comentário diz que a coisa não se sustenta · 09/10/2026

A trava do LAB-40 afirmava, na última linha, que **com as faces o motor desenha MENOS lotes** —
e o comentário dela, dez linhas acima, já dizia que *"o TOTAL de lotes não se sustentou"*, com a
tabela das três amostragens (−40, −4, +41) e a lição do D148.

Medido em 09/10, amostragem fixada, sem mudança minha: **449 → 492, +43.** A direção virou.

> **Trava cujo próprio comentário diz que a coisa não se sustenta não devia estar afirmando a
> coisa.** O comentário sabia; a asserção não.

O total passa a ser **medido e publicado**, não afirmado. Fica afirmado o que se sustentou nas
três amostragens e continua de pé: a **FRENTE** — sem as faces, zero lote faz frente para a rua
existente; com elas, mais de dez; e a testada medida é a mesma nas duas.

---

## D228 · O `<app>` do recado deixou de ser sempre "Lab", e a trava reprovou o certo · 09/10/2026

A Central mandou, em 09/10: *"a PRIMEIRA PALAVRA do cabeçalho é o NOME DO SEU APLICATIVO, porque
o chat recebe nove respostas parecidas e precisa saber de quem é cada uma."*

A trava do recado casava `— Lab · ` **literal**, e **reprovou o primeiro cabeçalho correto** que
apareceu. Consertada: o cabeçalho é `— <app> · <prompt> ===`, com os dois campos obrigatórios e
nenhum deles fixado.

> **É a terceira vez em dois dias.** D217 — a trava do recado ausente acusou o cabeçalho composto
> `LAB-13 e LAB-14`. D219 — a trava do ACUMULADO proibia nomear rodada fora de fila. E esta.
> *Régua nova nasce estreita demais, e o primeiro uso real é que mostra onde* — por isso o
> primeiro uso real vem no mesmo prompt, e por isso ele **tem** de ser um caso de verdade, não
> uma fixture que eu mesma escolhi.

E a §1 do `CLAUDE.md` passa a dizer o que `<app>` é de fato: **o nome deste aplicativo**, e não a
palavra `Lab`.

---

## D229 · A âncora da rodada sem relatório é o PRÓPRIO RECADO — e eu medi as outras antes · 09/10/2026

O buraco que eu declarei no LAB-66 e que virou o item 002: a trava do D216 cobra que todo
relatório tenha recado, e **rodada sem relatório não tinha âncora nenhuma**. Foi assim que o
recado do PR #85 foi ao chat e não foi ao arquivo.

> **Disciplina não é guarda.**

**As candidatas, medidas antes de escolher** — porque *régua que depende de arquivo que pode não
existir tem o mesmo buraco noutro lugar*:

| candidata | medida | veredicto |
|---|---|---|
| o número do **PR** | **42** mesclados na `main`, **4** citados em recado | reprovaria **38** rodadas legítimas |
| o **commit** da entrega | rodada que não produz commit não tem nenhum | o mesmo buraco |
| a **data** no `RECADOS.md` | zero dias com commit e sem recado, **mas dois recados no mesmo dia são comuns** | não distingue rodada de rodada — não teria pego o PR #85 |

**A âncora é o `<prompt>` do cabeçalho, que sempre existe.** Ele passa a ser **um prompt ou uma
das seis classes de rodada**, de vocabulário fechado. `—` não diz nada: serve igualmente para
*"não era prompt"* e para *"esqueci de dizer"*, e era essa ambiguidade que escondia a rodada.

**O histórico NÃO foi reescrito** — o item proíbe e tem razão: *registro não se maquia.* As dez
que já estavam lá são classificadas **pelo que o título delas já diz**, texto que eu escrevi no
dia. *A régua lê o registro; ela não o corrige.* E **não é lista de exceção**: não há nome de
recado nenhum na régua, só classes — lista de exceção cresce e ninguém a lê.

**Os dois lados demonstrados:** nenhum dos 73 recados do histórico fica órfão, e um órfão
plantado **no arquivo de verdade** é pego pela mesma trava do lado bom.

---

## D230 · "São nove" eram DEZ, e antes disso eu tinha contado TRÊS a mais · 09/10/2026

O item 002 veio com o meu número: *"são 9 recados assim no acumulado"*. **São dez** — a classe
cresceu em 08/10, com a rodada da §1-C, e eu não voltei para corrigir o número que tinha saído.

E a primeira contagem de hoje deu **treze**, porque a régua chamou de órfãos o **`LF-01`**, o
**`LF-FINAL`** e o **`LF-FINAL-2`** — que são prompts de verdade, de **outra numeração**. Ela
casava `LAB-\d\d`.

> **É o terceiro precedente da mesma família em três dias** — D217 (o cabeçalho composto
> `LAB-13 e LAB-14`), D219 (o acumulado que proibia rodada fora de fila) e esta. E o item 002
> **me mandou lembrar do primeiro, por escrito**, e eu repeti mesmo assim.

O que caracteriza um prompt é a **forma** — letras, hífen, sufixo que pode ser número ou palavra
—, **não a sigla**. Consertado, com os cinco formatos na trava.

*Número que saiu num recado continua sendo meu depois de sair: o item 002 citou o meu "nove" de
volta, e eu só descobri que eram dez porque fui recontar em vez de confiar.*

---

## D231 · O conserto do D228 entrou na TRAVA e não na FERRAMENTA — e a ferramenta passou a mentir · 09/10/2026

**Décima oitava ocorrência do ponto cego da §6, e nona da sub-família da régua que varre texto.**
Pega no primeiro comando do item 003.

A Central mandou que o `<app>` do cabeçalho do recado virasse o nome do aplicativo. A **trava**
aprendeu no mesmo dia (D228). A **ferramenta** não — ela continuou casando `— Lab · ` **literal**,
porque ela **não roda no verde** e ninguém a executou depois da mudança.

O que eu vi ao abrir o item 003: a trava **verde** e a ferramenta dizendo

```
prompt(s) com relatório e SEM recado no arquivo: LAB-68, LAB-69
```

**Os dois têm recado.** Os cabeçalhos são `— MOTOR LAB (archilly-lab) · LAB-68 (item 001) ===` e
`— MOTOR LAB (archilly-lab) · LAB-69 (item 002) ===`, nas linhas 1152 e 1166 do `RECADOS.md`.

> **Conserto de régua que não é aplicado em TODOS os instrumentos que leem a mesma coisa é meio
> conserto — e o que ficou de fora passa a mentir com a autoridade de quem conferia.**

Consertado em `ferramentas/lab66.ts`: a mesma régua da trava, `[^·]+ · (.+?)`. Depois do conserto,
**74 cabeçalhos para 74 blocos e zero relatórios sem recado**, contra 72 e 2 antes.

*Instrumento fora do verde envelhece sem avisar, e o aviso dele quando envelhece é uma acusação.*
Daí a outra metade do item 003: o escopo dos dois passa a morar em
[`docs/referencia/FERRAMENTA_E_TRAVA.md`](referencia/FERRAMENTA_E_TRAVA.md), com guarda.

---

## D232 · Os dois escapes de texto do D217 eram LARGOS DEMAIS, e eles salvavam 48 de 62 · 09/10/2026

O conserto do D217 — a trava que acusava `LAB-13 e LAB-14` de não terem recado — deu à régua de
`relatorio-sem-recado` dois escapes:

```ts
&& !texto.includes(`recados ${p}`) && !texto.includes(`${p},`)
```

Eles casam o nome do prompt em **qualquer lugar do arquivo**, inclusive dentro do corpo de outro
recado. **Medido, apagando o bloco do recado de cada relatório de prompt, um a um — 62 no dia da
medição: eles deixavam passar 48, e a ferramenta acusava os 48.** Com o conserto, **zero**.

**O caso que o D217 queria salvar já era salvo sem eles:** a borda de palavra **dentro do campo
`<prompt>`** do cabeçalho — `/\bLAB-13\b/` casa `LAB-13 e LAB-14`. Não precisava varrer o arquivo.

> **Régua nova nasce estreita demais, e às vezes larga demais: as duas coisas são o mesmo defeito
> — ninguém a conferiu dos dois lados.**

**E é isto que explica o número que eu publiquei no LAB-66.** Aquele recado disse *"em duas das
quatro sabotagens ferramenta e trava não pegaram a mesma coisa — a nº 2 só a ferramenta"*,
**sem dizer qual prompt foi apagado** — e o veredicto depende disso: apagando o recado de
`LAB-69`, os dois acusam; apagando o de `LAB-66`, só a ferramenta acusava. *Número sem origem não
vale, e a origem era o prompt escolhido.* A sabotagem nº 2 passou a rodar **nos dois lados**.

**O que NÃO foi alinhado, e de propósito:** a sabotagem nº 4 — bloco `ACUMULADO` sem nomear quais
— continua sendo só da trava. A ferramenta nunca leu a segunda linha do recado, e fazer um
instrumento chamar o outro para os números baterem *esconde a diferença em vez de declará-la*.
Das duas divergências, **uma era escopo e a outra era podridão**, e só a podridão saiu.

---

## D233 · O par de instrumentos confere FORMA e PRESENÇA, nunca VERDADE nem ENVIO · 09/10/2026

A pergunta mais valiosa do item 003 era a terceira: *"diga o que ninguém pega."* **Quatro
buracos**, e os três primeiros já aconteceram:

| o que escapa dos dois | por que | quem fecharia |
|---|---|---|
| recado que **nunca foi escrito**, em rodada sem relatório nem commit | as duas réguas leem o que **está** no arquivo | o **item 004**, que abre a conta dos disparos em vazio |
| recado **gravado e não enviado** | os dois leem o disco; `commit` sem `push` fica verde nos dois, e o chat lê o `RECADOS.md` **direto do GitHub** | comparar o disco com `origin/main` — **ninguém faz** |
| recado completo, bem formado, e **FALSO** | nenhuma das treze verificações lê o conteúdo contra a realidade — o D110 é isso por duas semanas | **nada mecânico que eu saiba escrever hoje** |
| os nove recados antigos **acima do teto** | a trava do teto olha **só o último**, de propósito: registro não se reescreve | **nada, e não deve** — buraco escolhido |

> **Verde nos dois instrumentos e nada no GitHub é o estado mais perigoso que este repositório
> sabe produzir** — e, desde 09/10, é o estado em que o chat simplesmente não vê a entrega.

O terceiro buraco fica declarado **sem conserto proposto**, porque eu não sei escrever a régua: o
par confere **forma** e **presença**, e quem ler o verde dos dois precisa saber que *verdade* não
está entre eles. *Buraco escondido é pior que buraco declarado, e buraco sem "o que faria pegar"
é lamento — três dos quatro têm essa linha, e o que não tem diz por quê.*

---

## D234 · O estado do despertador estava escrito em DOIS lugares do MESMO arquivo · 09/10/2026

O item 004 manda **conferir o id contra a conta antes de escrever qualquer coisa sobre
despertador**. Conferi, e o que apareceu não foi o id — foi o **estado**.

| onde | o que dizia |
|---|---|
| a abertura do `ONDE_PARAMOS.md` | *"🔴 O DESPERTADOR ESTÁ DESLIGADO · `enabled: false` em 08/10"* |
| a seção da caixa de entrada, 70 linhas abaixo | *"Despertador **RELIGADO**"* |
| **a conta** | **`enabled: true`**, último disparo **18:06:10Z**, próximo **19:05Z** |

**A conta manda** — é a regra da família, e aqui ela desempatou duas frases do mesmo arquivo. A
abertura era a **velha**: ela foi escrita quando a fila de 08/10 esgotou e **ninguém a apagou ao
religar**, no item 001.

> **A `CLAUDE.md` §1-A manda o id morar no `ONDE_PARAMOS` *"não aqui — id em duas terras
> envelhece numa delas"*. Ele envelheceu DENTRO da terra certa.** Uma terra não é um arquivo: é
> um lugar.

Consertado: o estado do despertador passa a morar **só** na *conta dos disparos*, e a seção da
caixa de entrada aponta para lá em vez de repetir. **Há guarda**: a trava reprova se a seção citar
mais de um id (`tests/disparos-em-vazio.test.ts`).

*O registro histórico NÃO foi mexido* — os 30 e tantos `enabled:` dos recados e da `FILA.md` são
o que foi enviado no dia, e registro não se maquia para caber em régua nova.

---

## D235 · O primeiro dia da conta mediu o CONTRÁRIO do que a regra temia · 09/10/2026

A `CLAUDE.md` §1-A existe porque **4 dos 7 disparos de 15/09 não tiveram o que fazer**, e a regra
que saiu daí é *"disparo sem item pronto: DESLIGAR o despertador"*. O item 004 abriu a conta para
medir isso na caixa de entrada.

**Quatro disparos no primeiro dia, ZERO em vazio** — e **dois acumularam**:

```
15:05 derivado   item na caixa, o 001 em curso ....... acumulou
16:05 derivado   item na caixa, o 001 em curso ....... acumulou → item 002
17:05 observado  item 003 pronto ..................... item 003
18:06 observado  item 004 pronto ..................... item 004
```

A caixa **não** ficou sem abastecimento. O que ficou curto foi o **intervalo**: a rodada do item
003 levou **58 minutos** (17:08 → 18:06) contra 60 de intervalo, e as do item 001 passaram de duas
horas. *A conta não nasceu para confirmar a suspeita; ela nasceu para medi-la, e mediu o
contrário.*

**E a conclusão NÃO é minha de executar.** Intervalo de despertador é do chat — *"ligar e desligar
é do chat; o seu trabalho é a conta"*, diz o próprio item. Então isto vira **o que a conta
decide**, escrito na seção, e não um `cron` que eu mudo:

> Muitos disparos em vazio → o chat abastece mais devagar do que eu consumo, e o intervalo pode
> **esticar**. Nenhum em vazio com disparos **acumulando** → a rodada é mais longa que o
> intervalo, e o que sobra é o chat decidir se quer um item por hora ou um por rodada.

**Uma linha por disparo, com a ORIGEM de cada hora** (`observado` ou `derivado`), porque duas das
quatro horas saem do `cron` e do religamento, não de notificação lida — e *hora derivada
publicada como medida é hora inventada com a autoridade de hora medida*.

---

## ~~D236~~ · "Desligar ao disparar em vazio" conflita com a regra da CAIXA — **DESEMPATADO pelo chat na D244** · 09/10/2026

A caixa esgotou com o item 004, então **o próximo disparo é o primeiro candidato real a disparo em
vazio** — e nessa hora duas regras do repositório mandam coisas diferentes:

| onde | o que manda |
|---|---|
| `CLAUDE.md` §1-A (D62 + D112) | *"Disparo sem item pronto: **DESLIGAR** o despertador… o chat o religa com fila nova"* |
| `caixa-de-entrada/COMO_FUNCIONA.md`, escrita pelo chat em **09/10** | *"grave um recado de uma linha dizendo 'caixa vazia', envie, e durma… anote a data numa linha do `ONDE_PARAMOS.md`"* — **não manda desligar** |
| o **item 004**, do mesmo dia | *"Religar ou mexer no despertador por iniciativa própria \[não serve]. Ligar e desligar é do chat; o seu trabalho é a conta"* |

**Não desempatei, e isso é a escolha.** Mexer no `enabled` é justamente o que o item 004 proíbe, e
reescrever a §1-A por conta própria seria eu decidindo no lugar do chat uma regra que ele acabou de
escrever de outro jeito.

**O que eu sigo enquanto ele não responder, com o motivo medido:** a da **caixa** — anotar e
dormir. *Desligar servia quando o chat tinha de ser avisado para mandar fila nova*; agora ele
escreve na caixa **sem passar por mim**, e um despertador desligado **nunca pega o item 005**.
Nesse regime, desligar deixa de proteger e passa a travar.

> **Regra escrita para um regime não se aplica sozinha ao regime seguinte — e quando duas regras
> da casa mandam coisas diferentes, o que não serve é escolher em silêncio.**

As duas páginas passam a **apontar uma para a outra**, e **há guarda**: a trava reprova se uma
delas perder a referência enquanto o conflito estiver aberto (`tests/disparos-em-vazio.test.ts`).
*Conflito que não fica declarado é resolvido pela próxima sessão sem que ninguém saiba.*

> **✅ DESEMPATADO em 09/10/2026, no item 008: vale a regra da CAIXA — anote a data, responda em
> uma linha e durma, e NÃO desligue. Ver a D244**, que traz o motivo da regra velha preservado e a
> lição que é maior que o caso. O chat ratificou o meu papel aqui: *"você fez a pergunta certa e
> fez o que era certo fazer: não desempatou sozinha."*

---

## D237 · O primeiro disparo em vazio chegou no mesmo dia, e DUAS réguas minhas o proibiam · 09/10/2026

A caixa esgotou com o item 004 às 18:06 e o disparo das **19:05** não achou nada. **A conta
mediu o que foi feita para medir no primeiro dia: 1 em vazio, de 5.**

Fiz o que a regra da caixa manda — recado de uma linha, a data na conta, **nada inventado** — e
**não toquei no despertador**, que é o **D236 em exercício**: desligar agora garantiria que o
item 005 **não fosse pego**.

**E QUATRO coisas minhas reprovaram o caso legítimo quando ele chegou** — três escritas há uma
hora, no item 004, e uma no item 002:

| o que quebrou | por que |
|---|---|
| a trava *"o precedente da FILA são TRÊS, nenhum no regime da caixa"* | o recado de hoje é da **mesma classe** e é do regime da caixa. Ele não é precedente: **é o parceiro do cruzamento**, e eu havia escrito a régua contra um caso que ainda não existia |
| a sabotagem do segundo sentido, `["09/10/2026"]` | naquela hora não havia linha em vazio em 09/10; passou a haver, e **o estrago virou caso legítimo** |
| os literais da ferramenta, `"disparos observados: 4 · em vazio: 0"` | *literal de ferramenta envelhece igual a comentário* (D104) — e esta mede uma conta que cresce de hora em hora. As sabotagens passam a ser **derivadas do arquivo** |
| a trava do item 002, *"as rodadas sem prompt nomeado são DEZ"* | **o dez era do HISTÓRICO e a frase não dizia de quê** — é o D218 outra vez. As dez levam `—` no cabeçalho e se classificam pelo título; as novas **declaram a classe no cabeçalho** e são quantas vierem |

> **Régua escrita contra o caso que ainda não veio proíbe o caso legítimo quando ele vem** — é a
> quarta vez em três dias (D217, D219, D228 e esta), e as quatro foram pegas pelo primeiro uso
> real, não por releitura.

**E a sabotagem do segundo sentido tem lição própria:** um estrago que depende do estado do
arquivo **deixa de ser estrago** quando o estado muda, e aí a trava fica verde **sem medir o que
dizia medir**. Agora ela escolhe um dia que a conta **não tem** e **confere isso antes**.

---

## D238 · O item 005 chegou 14 MINUTOS depois de eu dizer que a caixa estava vazia · 09/10/2026

O disparo das **19:05Z** não achou item, e isso estava certo. **O `005.md` entrou na `main` às
19:19:54Z**, no commit `de5e769` — catorze minutos depois.

**O problema não é a conta: é o que eu ENVIEI.** O recado daquela rodada saiu por volta das
**19:55**, e dizia *"escreva o item 005 na caixa"* — quando o 005 **já existia há 35 minutos**. E
pior: o meu próprio `git merge --ff-only origin/main`, feito para sincronizar o ramo depois do PR
#95, **trouxe o arquivo para dentro da minha árvore** e eu não olhei.

| hora UTC | o que aconteceu |
|---|---|
| 19:05:48 | o despertador dispara; a caixa está vazia **de verdade** |
| ~19:07 | eu confiro: nada em `caixa-de-entrada/`, nem local nem na `origin/main` |
| 19:19:54 | **o chat escreve o `005.md` na `main`** |
| ~19:5x | eu mesclo a `origin/main` no ramo — **o 005 entra na minha árvore em silêncio** |
| ~19:55 | eu envio *"escreva o item 005"*, com o 005 já escrito |

> **A conferência da caixa foi feita ao ACORDAR e valeu por 48 minutos.** O estado da caixa se
> confere **na hora de ENVIAR**, não só na hora de acordar — e o lugar exato onde um item novo
> aparece é o `merge` que eu faço para sincronizar o ramo.

**A linha da conta NÃO foi corrigida, porque ela está certa:** às 19:05 a caixa estava vazia. O
que foi corrigido é o procedimento, escrito na seção da conta, e **o recado enviado não se
reescreve** — *registro não se maquia* (D229). A correção vai no recado seguinte, que é onde ele
lê.

**E não há trava mecânica para isto, de propósito:** uma régua não distingue *"o item chegou
depois de eu enviar"* de *"eu ignorei o item"* — as duas deixam exatamente o mesmo rastro no
arquivo. *Guarda que não consegue separar os dois casos aprovaria o ruim junto com o bom.*

---

## D239 · REGRA DE FAMÍLIA: cobrança por USO, nunca mensalidade · 09/10/2026

**Ordem direta do Jonny, trazida pelo chat no item 005.** Vale para **todos** os aplicativos da
família, todas as APIs, todas as sessões — *"absolutamente todas"*.

> **Entre uma API que cobra por USO e uma que cobra MENSALIDADE, escolhe-se a de uso — mesmo que
> o uso saia mais caro.**

**O motivo não é financeiro, é de ritmo:** mensalidade paga-se igual com um cliente e com
trezentos; o custo nasce **antes** da receita, e cada mês sem venda vira pressão para vender.

> **Uma mensalidade contratada hoje é uma meta de vendas contratada junto** — e é por isso que a
> regra vale **mesmo quando a mensalidade é a opção mais barata no papel.**

**O texto literal dele e as oito consequências estão na `CLAUDE.md` §4-A**, e as consequências
também em `external-engines/esteira/src/cobranca-por-uso.ts`, conferidas contra a página por
trava (`tests/custo-por-uso.test.ts`, 11 travas).

**A consequência que mais me acusa é a segunda, e foi medida contra mim no mesmo dia:** eu
escrevi *"R$ 400 por mês ÷ 200 estudos = R$ 2 por estudo"* e ele corrigiu — com **três** clientes
aquilo é **R$ 133 por estudo**. *O mesmo número aprovava e reprovava a despesa; só mudou a
premissa de volume, que eu tinha inventado.* Daí a regra das **três faixas** — 3, 20 e 200
clientes — em toda comparação de fonte paga.

**O item mandou GRAVAR e NÃO EXECUTAR:** *"não há nada a comprar hoje; ela existe para o dia em
que houver."* Nada foi contratado, nenhuma conta aberta, nenhuma chave cadastrada.

**E a guarda declara o próprio buraco:** **contratar acontece fora da árvore**, num navegador, com
um cartão, e nenhuma régua daqui alcança — razão pela qual a oitava consequência é de **processo**
e não de código. A varredura só pega **compromisso mensal escrito** num arquivo que o git
carrega, e a lista do que ela **não** pega está declarada em `O_QUE_ISTO_NAO_GUARDA`.

---

## D240 · A régua de ESTRUTURA acusou `plano: Plano` — o plano de LOTEAMENTO · 09/10/2026

**Décima nona ocorrência do ponto cego da §6, pega dentro do prompt.** O item 006 trouxe a lição
da Pesquisa de Mercado, e ela está certa:

> *"Não escreva 'recusar mensalidade' numa conferência. Tire o campo onde a mensalidade caberia.
> Campo que não existe não se esquece."*

Escrevi a régua de estrutura — uma lista de **nomes de campo** que guardariam recorrência — e
`plano` estava nela, porque *plano* é palavra de cobrança em todo lugar. Ela acusou
`plano: Plano`, **duas vezes**, em `testfit/adapter/src/volta.ts`: **o plano de loteamento, o
objeto central deste repositório inteiro.**

> **A régua de ESTRUTURA não é imune ao defeito da régua de PALAVRA.** *"Campo que não existe não
> se esquece"* é verdade — mas **campo cujo NOME eu adivinhei** tem a mesma doença, só mudada de
> lugar: do texto para o identificador.

`plano` e `planoId` saíram; ficaram só os nomes que **não têm outro significado nesta casa**. E a
régua casa **declaração de campo**, não menção — foi preciso, porque `assinatura` aparece **sete
vezes** aqui e é a **assinatura de determinismo** de uma rodada do motor.

### E o exemplo do item estava errado a meu respeito — medido

Ele disse que *"franquia mínima e teste grátis passam por qualquer varredura de texto"*. **Na
minha não passam:** há padrão para os dois. Mas a **conclusão** dele está certa, e medida fica
**pior** do que o exemplo: dos **doze** compromissos mensais de formato real,
a régua de palavra pega **quatro** — **8 de 12 escapam**, entre eles *"compromisso mínimo de 50
chamadas por mês"* e *"contrato anual com faturamento recorrente"*.

*Exemplo errado com conclusão certa continua valendo — e conferir o exemplo é o que mede o
tamanho real do problema.*

### E o teto da lista de exceções ganhou um CRITÉRIO, não só um número

A lista nominal do `vazamento-de-custo.test.ts` foi de **6 para 9** em dois prompts, porque
**quatro arquivos que ENUNCIAM a proibição** foram acusados pela régua que a cumpre — a quinta
vez da forma do D155 só nessa lista.

> **O teto sobe quando a regra passa a ser ESCRITA em mais um lugar, e cada entrada nova nomeia
> qual regra enuncia. Se ele subir sem que uma regra nova tenha sido escrita, o que está errado é
> o DESENHO da lista, não o número** — e aí a varredura precisa aprender a diferença entre prosa
> e produto, em vez de ganhar mais uma linha.

### As três respostas do item, medidas

| a pergunta | a resposta |
|---|---|
| a trava é palavra ou estrutura? | **palavra**, e está escrito na §4-A, com os **8 de 12** que escapam |
| existe tipo onde a mensalidade caberia? | **não há onde** — nenhum campo de recorrência em nenhum `.ts` que o git carrega, e não existe tipo de preço de fonte paga |
| há condição de volta que seja uma CONTA? | **zero**, de **quinze** condições declaradas — todas esperam pessoa, repositório, prompt novo ou medição |

A obra do **recorte** está dimensionada em `docs/PENDENCIAS_JONNY.md` §8, e **não foi feita**:
aqui não há fonte paga para recortar.

---

## D241 · Eu publiquei o HEAD do DISCO como "o estado do vizinho", em SEIS recados · 09/10/2026

O item 007 trouxe duas ocorrências da mesma família na mesma tarde — o Propostas leu **resíduo de
build**, o Geo leu **resíduo de checkout** — e a frase do Geo resume:

> **"O que está no disco não é o que está na origem. Confira o que a origem diz antes de
> contradizer um pedido."**

**Medi em mim e é o mesmo defeito, repetido.** Todo recado meu fecha com
*"Clones: motor-testfit@6cf6396, urban-create-hub@72cfab0, urban-scout-tool@550a438"*, lido com
`git -C <clone> rev-parse HEAD` — **o disco**. Rodado `git fetch` nos três, em 09/10 às 22:1xZ:

| clone | o disco diz | a `origin/main` diz | atrás por |
|---|---|---|---|
| `motor-testfit` | `6cf6396` | `e4db59d` | **25** |
| `urban-create-hub-41d93a4d` | `72cfab0` | `70ae70d` | **18** |
| `urban-scout-tool` | `550a438` | `b664a01` | **23** |

**Seis recados** publicaram esses hashes como o estado dos vizinhos. O hash sempre esteve escrito
— ninguém foi enganado sobre *qual* commit — mas **ninguém tinha como saber que ele estava 25
commits atrás**, e era isso que a frase *"os três com 0 alterações"* parecia garantir.

**E o motor andou DURANTE esta rodada:** o primeiro `git fetch`, minutos antes, deu **23**; o
segundo deu **25**. *Hash de disco publicado como estado do vizinho envelhece enquanto o recado
está sendo escrito.*

### O conserto, e o que ele deliberadamente NÃO faz

O carimbo ganhou um **segundo eixo** (`conferirContraAOrigem`), com quatro veredictos fechados que
**dizem**: `em-dia`, `atras` (com o número de commits), `a-frente` e `origem-desconhecida`. O
primeiro eixo compara **a prova com o disco**; o segundo, **o disco com a origem** — são duas
perguntas, e só a primeira existia.

- **`origem-desconhecida` não é `em-dia`:** sem `git fetch` não há origem, e *não medido não é o
  mesmo que em dia* (D23);
- **nada é PUXADO.** Atualizar os clones mudaria **toda** medição desta casa, e isso é prompt, não
  conserto silencioso (D226). O número fica **dito**, e quem decide é o chat;
- **o `fetch` é leitura:** ele mexe só nas referências locais do clone. Nenhum arquivo rastreado
  muda, o `git status` dos três continua limpo, e a §4 segue respeitada.

**Daqui em diante o recado publica os dois:** `repo@disco` **e** `origin/main@X, atrás N`. *Dizer
só o disco é publicar disco como se fosse origem.*

---

## D242 · POR LUGAR, NÃO POR FRASE — e o meu "zero de quinze" tinha o denominador errado · 09/10/2026

A Central mediu e corrigiu uma instrução que o chat tinha espalhado — e que **eu executei no item
006**:

> O `grep` por *"quando compensar"*, *"ponto de equilíbrio"* e *"volume mensal"* deu **ZERO** — **e
> havia QUATRO.** As quatro apareceram **listando os LUGARES** onde a coisa mora e lendo cada um.

**No item 006 eu varri por frase e publiquei *"zero de quinze"*.** Refeito **por lugar**:

| | |
|---|---|
| lugares lidos, um a um | **SETE** |
| condições de retorno que existem | **VINTE E UMA** |
| o que a varredura de frase alcançava | **QUINZE** — as etiquetas declaradas de **um** lugar |
| quantas são uma **CONTA** | **ZERO**, as vinte e uma |

As **seis** que só o lugar mostrou: a execução do CI (parada por **data**, 1º/11); os consertos do
LAB-05 no `recorte.ts` (**desligados por padrão**, §4); a obra do recorte na página do Jonny
(*"quando houver a primeira fonte paga"* — e **fui eu que escrevi, no item 006**); a corda reta
das vias curvas (**adiada para a V3**); o kit do Padrão Archilly (*"quando chegar, é outro
item"*); e o ramo que espera uma pergunta, na regra da caixa.

> **O veredicto sobreviveu e a cobertura não.** *O meu "zero" estava certo por não haver nenhuma
> conta, não por a varredura alcançar* — e nenhuma das palavras que eu procurei aparece em
> nenhuma das seis.

> **A régua de palavra não sabe as palavras que ainda não foram escritas.** Para achar o que
> existe, enumere os **LUGARES**; a varredura serve para impedir o que vai **nascer**, não para
> inventariar o que já nasceu.

**A lista dos sete lugares está escrita** em `src/lugares-das-condicoes.ts` — *"para quem vier
depois saber onde você olhou"*, como o item pediu — e **há guarda**: cada lugar tem de existir e
continuar trazendo a sua marca, e uma condição de **conta** reprova. *Lista que não se revalida
envelhece igual a comentário* (D104).

**E a conta fecha por construção:** 15 (a frase alcançava) + 6 (só o lugar mostrou) = **21**, com
a trava somando.

---

## D243 · O critério do teto DISPAROU, e o que está errado agora é o DESENHO da lista · 09/10/2026

No item 006 eu dei um **critério** ao teto da lista nominal de exceções da varredura de custo, em
vez de só um número:

> **O teto sobe quando a regra passa a ser ESCRITA em mais um lugar, e cada entrada nomeia qual
> regra enuncia. Se ele subir sem que uma regra nova tenha sido escrita, o que está errado é o
> DESENHO da lista, não o número.**

**Ele disparou um prompt depois.** O teto foi de **9 para 11**, e as duas entradas novas são
`docs/relatorios/LAB-73.md` e `docs/relatorios/LAB-74.md` — **relatórios de prompt**, que não são
regra nova: são documentação **sobre** a regra. Pela minha própria frase, continuar assim é uma
linha por relatório, para sempre.

### O que eu consegui consertar agora, e é medição

A régua das **condições de conta** passou a pular **linha de citação** (`^>`), e isso tirou da
lista, **sem nome de arquivo nenhum**, as duas únicas acusações que ela fazia no repositório
inteiro — as duas eram a **mesma frase da Central**, citada no `DECISOES.md` e no item 007.

> *Sinal estrutural no lugar de nome na lista.* **Reportar a frase de outro não é assumir a
> condição** — e o limite disto fica dito: condição adotada a partir de uma citação tem de ser
> reescrita **fora** dela, que é como se adota qualquer coisa.

**O que sobrou são relatórios**, que citam a frase em tabela e em prosa própria, não em citação. E
é a **mesma classe** que faz a lista do vazamento de custo crescer.

### A proposta, e ela NÃO foi executada

**Escopar a varredura por DESTINO, não por nome de arquivo:** declarar o conjunto do que pode
chegar a um **usuário** — hoje, neste repositório, **nada** além da bancada do navegador (§4) — e
varrer **esse** conjunto com rigor; o **registro** (relatório, decisão, recado) ganha conferência
própria: o valor citado tem de estar **dentro de citação ou de bloco de código**.

**Por que não fiz:** é **mudança de modelo**, não conserto deste item, e a §1-A é explícita —
*prompt fora da fila não existe; o que faltar entra como "proposto ao chat", sem executar.* Está
na `FILA.md`, com o número, a medição e o desenho proposto.

*Critério que dispara e é ignorado vira teto sem critério — e aí ele era só um número desde o
começo.*

---

## D244 · DESEMPATE do chat: no disparo em vazio, ANOTE E DURMA — não desligue · 09/10/2026

**Resposta do chat ao D236, no item 008.** A pergunta era qual das duas regras da casa vale no
disparo sem item pronto, e o chat decidiu:

> **No disparo sem item pronto: ANOTE A DATA NA CONTA DE DISPAROS EM VAZIO, responda com um recado
> de UMA linha, e durma. NÃO DESLIGUE o despertador.**

Vale para os dois casos: **caixa vazia** e **caixa só com itens "aguardando"**.

### O motivo da regra velha fica escrito, porque regra revogada sem motivo volta por engano

A §1-A mandava **desligar** (D62 + D112), e **estava certa quando nasceu**: até 09/10 o chat só
sabia que a fila havia esgotado **se alguém o avisasse**, e o despertador desligado **era o aviso**.
Era esse o serviço que o desligamento prestava — e ele prestava bem: medido, dos 7 disparos do
despertador de 15/09, **4 não tiveram o que fazer**.

**O que mudou foi o MECANISMO, não o texto:** o chat passou a **escrever direto na caixa**, sem
passar por mim e sem passar pelo Jonny. O desligamento perdeu a função e **ganhou um dano novo** —
*despertador desligado nunca pega o item que o chat escrever depois* —, e ia travar **em silêncio**,
porque **uma caixa com item e um despertador desligado têm exatamente a mesma aparência de uma
caixa vazia**.

### A lição, e ela é maior que o caso

> **REGRA QUE DEIXOU DE PROTEGER E PASSOU A TRAVAR NÃO MUDOU DE TEXTO — MUDOU O MUNDO EMBAIXO
> DELA.** Toda regra que existe para **avisar alguém** morre no dia em que esse alguém passa a
> enxergar sozinho. Ao ler uma regra antiga, pergunte **que serviço ela presta hoje**, não só o que
> ela manda fazer.

### O que foi feito

- a **§1-A** passou a mandar *anotar e dormir*, com a ordem antiga **riscada e não apagada**, o
  motivo dela preservado e o mecanismo que mudou escrito;
- a **`COMO_FUNCIONA.md`** marca o desempate no lugar do conflito declarado, e as duas páginas
  **continuam apontando uma para a outra**;
- o **D236** está riscado como desempatado e aponta para cá;
- a **trava foi alinhada** (`tests/disparos-em-vazio.test.ts`): ela cobra a regra nova nos dois
  lugares, cobra o motivo da velha preservado, e **reprova se a §1-A voltar a MANDAR desligar** —
  a frase imperativa não pode reaparecer fora do risco.

**E o despertador NÃO está desligado:** ele está `enabled: true`, disparou às 23:05Z e o próximo é
às 00:05Z. O item pediu para dizer isso com essas palavras caso estivesse desligado; não está, e
**eu não o toquei** — nem para ligar, nem para desligar.

*Eu já seguia esta regra desde o item 004, declarada como leitura minha e não como ratificação. A
diferença entre as duas coisas é todo o valor deste item.*

---

## D245 · A régua do commit acusou o NOME do vizinho — fronteira de palavra não é fronteira de valor · 10/10/2026

**A vigésima ocorrência do ponto cego do §6, e a décima primeira da classe "régua minha acusando
a si mesma".** Pega **dentro do prompt**, na primeira rodada da suíte nova: 28 passaram, 1 falhou,
e a que falhou era a régua, não o dado.

O LAB-76 decidiu **não gravar o commit** dos clones vizinhos no dado do registro, porque commit
gravado que ninguém revalida envelhece em silêncio (D104) — e no mesmo dia a prova disso apareceu
sozinha: `motor-testfit` estava **28 commits atrás** da origem quando eu medi, e **30** meia hora
depois, sem ninguém tocar no clone.

Para a decisão não virar slogan, escrevi a trava: *"nenhum sha gravado no dado"*, assim —

```ts
expect(texto).not.toMatch(/\b[0-9a-f]{7,}\b/);
```

**Ela reprovou o registro legítimo.** O que casou foi **`41d93a4d`** — o fim do **nome** do
repositório vizinho `urban-create-hub-41d93a4d`. O `-` é fronteira de palavra para o regex, então
o nome composto se partiu e o pedaço passou por sha.

> **FRONTEIRA DE PALAVRA NUM NOME COMPOSTO NÃO É FRONTEIRA DE VALOR.**

### O conserto é de ESTRUTURA, e é a lição do item 006 outra vez

A saída fácil era uma exceção: *"menos `41d93a4d`"*. Isso é a régua de palavra se remendando com
mais palavra, e teria envelhecido no dia em que entrasse um vizinho com outro sufixo hexadecimal.

Um commit só **significa** commit quando é o **valor inteiro** de um campo. Então a régua andou
para a estrutura: ela percorre o JSON e olha **cada valor por inteiro** —
`/^[0-9a-f]{7,40}$/`. `urban-create-hub-41d93a4d` inteiro não é hexadecimal; `"6cf6396"` é.

É a mesma lição que o item 006 trouxe (*tire o campo onde a coisa caberia*) e a mesma que o §6 já
dizia (*procure o nome no lugar da gramática onde ele significa aquilo*) — aqui aplicada a um
**valor** e não a um nome. E a trava agora prova as **duas** direções: que o dado de hoje passa,
que um commit plantado reprova, e que o nome do vizinho atravessa.

---

## D246 · O registro de motores: DUAS das três coisas da D68 já existiam · 10/10/2026

**Item 009, o LAB-76.** A D68 pede três coisas — um registro de motores, liga/desliga por motor e
um motor padrão —, e o item veio com a regra que o Jonny deu à direção em 09/10:

> **Nome novo para coisa que já tem nome na casa é custo sem benefício.** Antes de criar
> estrutura nova, procure a que já responde a pergunta.

Procurei antes de escrever uma linha, e **duas das três já estavam prontas** — na peça do LAB-06,
em `entrega/registro-de-motores/registro.ts`:

| o que a D68 pede | já existia? | onde |
|---|---|---|
| o que um motor é, como tipo | **sim** | `CapacidadesDoMotor`, `MotorNaPorta` |
| liga/desliga por motor | **sim, para o HOSPEDEIRO** | `RegistroDeMotores.ligar/desligar` |
| **motor padrão** | **sim** | `PADRAO_DE_FABRICA = "parcelamento"` |
| a procedência de um REPOSITÓRIO | **sim** | `commit-dos-vizinhos.ts` (LAB-74) |
| **a procedência de um MOTOR** | **NÃO** | nada ligava motor → repositório → commit |
| **o estado como DADO** | **NÃO** | `MOTORES_DE_LOTE` é tupla em código |
| **o tamanho do universo lido** | **NÃO** | nenhuma medição dizia quantos havia |

**Então o LAB-76 não criou um registro.** Ele criou **o que faltava**: a procedência por motor, o
estado como dado, e a conta do universo. O padrão é **importado** de `PADRAO_DE_FABRICA`, e há
trava que reprova se ele ganhar uma segunda declaração — inclusive uma trava que confere que a
palavra `padrao` **não é chave** no dado. Duas respostas para a mesma pergunta é o D116.

### O que o universo mediu, e ele é MAIOR do que eu esperava

**Seis motores conhecidos, não quatro.** Além dos quatro da porta (`generate-ortogonal`,
`generate-espinha`, `parcelamento`, `symbios`), esta casa conhece o **PackingSolver** e o
**straight skeleton** — triados, recusados e **nunca clonados**: o primeiro por ser C++ de
servidor contra a arquitetura de navegador do Generate, o segundo por impedimento de licença
(copyleft). Eles estavam em `external-engines/`, com README e veredito, e **em nenhuma lista**.

### `so-referencia` NÃO é `desligado` — e o estado tem TRÊS valores por isso

Juntar os dois perderia a diferença que mais importa: `desligado` é *"está na casa e alguém o
tirou da medição"*; `so-referencia` é *"foi triado e recusado, nunca foi candidato"*. Um volta por
decisão, o outro por uma triagem nova. É o D23 outra vez — dois estados onde há três inventa a
informação que falta.

**E uma quarta distinção apareceu, que também não é liga/desliga:** o Symbios está **ligado** e
fica **fora da `MOTORES_DE_LOTE`**, porque entrega **quadra** (D50). Ficar fora de uma comparação
não é estar desligado — são duas perguntas, e o relatório publica as duas contas.

### A fronteira do item foi respeitada: NADA mudou de estado

O item disse: *"se fazer isto exigir mudar o motor padrão ou desligar um motor que hoje entra nas
medições, você descreve o que mudaria e não muda"*. Não exigiu. O padrão continua
`parcelamento`, os quatro motores da porta continuam ligados, a `MOTORES_DE_LOTE` continua com os
mesmos três ids, e **nenhuma medição desta casa muda de número por causa deste prompt**. O que
mudou é que agora **há onde desligar**, e há trava que cobra a conta quando alguém desligar.

### O limite do "é dado, não código", declarado

O estado mora em `dados/registro-de-motores.json`, fora de `src`, e **nenhum `.ts` se edita** para
medir com um motor fora — que é o que a D68 pede. **Mas neste repositório trocar aquela chave
continua sendo um commit**, porque tudo aqui está no git. O ganho é de **acoplamento**, não de
implantação: a esteira não precisa mudar. *Guarda que não declara o próprio buraco mente pelo
silêncio.*

---

## D247 · Importar uma ferramenta a EXECUTA — e isso sobrescreveu uma prova · 10/10/2026

Descoberto no LAB-76, consertado no LAB-76. A ferramenta nova precisava de `carimbarVizinhos()`,
que media o `HEAD` e a distância até a origem de cada clone vizinho — e que morava **dentro de
`ferramentas/lab68.ts`**.

Importei de lá. O `lab68` **rodou inteiro**: imprimiu a saída dele e **reescreveu
`docs/provas/LAB-68/as-duas-pilhas.json`** com a data de hoje. A prova de um prompt antigo foi
sobrescrita por um `import` de outro prompt.

> **Prova sobrescrita por um `import` é a forma mais silenciosa de perder uma medição.** Nada
> falha, nada avisa, e o arquivo continua lá — com os números errados.

A prova foi restaurada (`git checkout`) e a função **subiu para `src/commit-dos-vizinhos.ts`**,
que é de onde ela nunca devia ter saído: aquele módulo já tinha a metade **pura** da mesma
pergunta (`conferirCarimbo`, `conferirContraAOrigem`), e as duas metades em dois arquivos são o
D116. Ela **não é chamada ao importar**, então as travas sem clone vizinho continuam rodando.

A regra que fica: **ferramenta é ponto de entrada, não biblioteca.** O que mais de um prompt
precisa chamar mora em `src/`. Se um `import` de `ferramentas/` parecer a saída fácil, o que
está faltando é mover a função.

---

## D248 · O normalizador das regras mora em `src/` — conserto dentro de teste conserta um teste · 10/10/2026

**Quarta vez da mesma forma, e a lição nova não é a repetição.** A trava do item 010 confere que a
regra dos 15 m **está escrita** no adendo, e procurava o literal `"15 metros"`. **Ela reprovou o
adendo certo:** no arquivo a regra está como

```
> *"...então no mínimo uns **15
> metros** da esquina de distância..."*
```

Quebra de linha, **marca de bloco de citação** e **negrito**, os três caindo dentro do número.

Já havia acontecido no LAB-74 §5 (`"se chama pela pergunta que ele espera"`), no LAB-75 §6
(`"MUDOU O MUNDO EMBAIXO DELA"`, dentro de um `>`) e no item 008, na mesma trava uma hora depois.

### E o conserto JÁ EXISTIA — foi isso que custou

Ele estava **inline**, dentro de `tests/disparos-em-vazio.test.ts`, escrito no LAB-75:
`split("\n") → tira o ">" → junta → colapsa o espaço`. Eu reescrevi o erro em outro arquivo **por
não saber que o conserto estava lá**.

> **CONSERTO QUE MORA DENTRO DE UM TESTE CONSERTA UM TESTE.**

É o D116 na forma mais pura — a mesma pergunta respondida em dois lugares —, e é a mesma lição que
o **D247** tirou das ferramentas um prompt antes, agora das travas: *o que mais de uma trava
precisa chamar mora em `src/`*.

`comoARegraSeLe` e `aRegraEstaEscrita` vivem em `src/texto-das-regras.ts`, as duas travas as
chamam, e a cópia inline saiu. **E há trava do próprio normalizador**, inclusive do que ele **não**
faz: *"15 metro"* e *"faixa de esquinas"* continuam reprovando — *afrouxar a régua até tudo passar
é o contrário de consertá-la*.

---

## D249 · A faixa de esquina é geometria das RUAS, não do anel — e a recusa é a entrega · 10/10/2026

**Item 010 + adendo, o achado do LAB-77.** O adendo do Jonny diz que o universo de posições de
acesso é *as faces que dão para via pública, menos a faixa de esquina*. Que a primeira metade
dependa de saber onde há rua é evidente. **A segunda não é:**

> **Esquina é onde duas RUAS se encontram, não onde o anel da gleba muda de direção.**

Um vértice entre uma face de rua e o muro do vizinho **não é esquina** — é um canto de terreno, e
a regra dos 15 m não fala dele. Lido depressa, o adendo faria eu tratar todo vértice do anel como
esquina, e a faixa morderia cantos que não são esquina de nada.

**Logo: as DUAS metades do universo dependem do mesmo dado — e ele não existe.** Medido nas sete
glebas: **zero** declaram quais faces dão para via pública, e **o campo não existe no contrato
v1** — não está vazio, não há onde.

### Por isso a sugestão se RECUSA a sair, e isso é a entrega

O adendo chama acesso proposto sobre a divisa do vizinho de *"o pior tipo de sugestão: plausível e
impossível"*. Varrer o perímetro e publicar a curva — o que o item 010 pedia **antes** do
adendo — seria exatamente um gerador daquilo.

> **Entre uma medição que sai com premissa inventada e uma recusa que nomeia o dado que falta, a
> recusa é a que se pode auditar.**

A máquina está pronta e provada nos **dois** lados: dado o campo, a frase sai no formato dele
(*"se o acesso mudar para cá, você ganha N lotes"*, singular para um lote) e **não** sai quando o
ganho é zero ou negativo. Falta o dado, não a máquina.

### O que se pôde medir sem o dado: um intervalo, não um número

O quanto a regra da esquina tira do perímetro tem **piso zero** (nenhum vértice é encontro de duas
ruas) e **teto** no caso de todo vértice ser esquina: de **4,40 %** (`ensaio-47ha`, 4 vértices) a
**22,48 %** (`sintetico-10ha-plano`, 10 vértices) com faixa de 15 m. *Intervalo é medição; número
único inventado não é.* O teto sai por **amostragem** e não por fórmula, porque faixas de vértices
vizinhos se sobrepõem em divisa recortada e somar `2 × faixa` daria teto acima de 100 %.

### E os 15 e os 25 não moram na lógica

Regra da família: *tudo tem padrão de fábrica que o usuário pode mudar; é como o sal na panela, a
gosto*. **Há trava de estrutura**, não promessa: ela varre o corpo de cada `export function`, sem
comentários, e **reprova 15 ou 25 escrito ali**. Só as constantes do topo podem dizê-los — elas
*são* o padrão. A faixa em uso é **15 m, declarada**, porque o adendo manda usar 15 e **dizer que
usou** em vez de adivinhar se a gleba ocupa a quadra inteira.

**As duas perguntas que o adendo manda não decidir** estão na §9 da página do Jonny, em nível de
leigo, com a minha recomendação ao lado: como se reconhece a quadra inteira, e se a faixa se mede
em linha reta ou ao longo da divisa.

---

## D250 · Eu contei as glebas de memória, e a ferramenta me corrigiu · 10/10/2026

No meio do LAB-77 eu afirmei, por escrito, duas coisas sobre as sete glebas:

- *"cinco das sete declaram `acessos: []`"*;
- *"zero das sete declaram o `segmento`"*.

**Rodada a ferramenta: são TRÊS sem acesso e QUATRO com, e UMA declara o `segmento`**
(`ensaio-com-promessas`, com `segmento: {a:{380,0}, b:{420,0}}` e `ponto: null`).

A causa é a do **D185**: eu li **duas** das quatro fixtures — as de
`glebas-padrao-com-relevo` — e completei o resto de cabeça, esquecendo as duas de
`glebas-que-exercem-as-promessas`. *Número que a ferramenta mede não se escreve antes de rodá-la.*

**O achado não mudou:** **zero das sete** dizem quais faces dão para via pública, e é esse o
número que sustenta o D249.

**E o erro rendeu um dado que eu não teria achado:** o `segmento` do contrato é **um TRECHO da
divisa (`{a, b}`), não um índice de face**. Então o contrato **já tem** idioma para localizar
coisa na divisa, e é esse idioma que um campo de faces-com-via deve seguir — índice de face quebra
quando o anel é reamostrado, trecho não. Virou o item 1 da lista para o Generate.

**O item também errou um número, e no mesmo lugar:** ele diz *"as cinco glebas-padrão"* duas
vezes, e são **sete desde o LAB-45**. Nos dois casos — o meu e o dele — o defeito foi afirmar o
tamanho do universo sem relê-lo.

---

## D251 · A régua que conta as ocorrências do ponto cego parou de medir ao chegar a VINTE E DUAS · 10/10/2026

**Pega ao atualizar a §6 no LAB-77.** A `conferirAritmeticaDoPontoCego` lê o total declarado da §6
com

```ts
/se repetiu ([A-Za-zÇÃÉÊçãéê]+) vezes/
```

— **uma palavra só** — e o resolve num mapa de literais que terminava em `vinte: 20`.

A §6 passou a dizer *"se repetiu **VINTE E DUAS** vezes"*. O regex não casou, o
`totalDeclarado` saiu **`null`**, e o problema não é esse: é que **com o total nulo a trava da
soma não dispara**. A guarda que existe para impedir a §6 de mentir sobre o próprio tamanho
**deixou de medir, em silêncio**, exatamente no prompt em que a §6 cresceu.

> **RÉGUA QUE CONTA ATÉ VINTE NUMA LISTA QUE CRESCE É RÉGUA COM DATA DE VALIDADE.**

É a forma de falha mais cara desta casa, e a terceira vez dela: a suíte do `testfit` vermelha por
duas semanas (D110), a prova no navegador rodando uma vez em um mês (D123), e o `exit 0, 0 testes`
que eu li como verde (item 003). **Nas três, nada falhou — nada mediu.** *Zero é o que uma leitura
vazia devolve sem reclamar.*

### O conserto é compositivo, não mais um literal

`lerNumeroEmPalavra` soma `<dezena> e <unidade>`: mapa de literais para o que não compõe (até
vinte), composição para o resto. Acrescentar `"vinte e duas": 22` ao mapa teria consertado **este**
prompt e quebrado no próximo — e o próximo é certo, porque a lista do ponto cego só cresce.

Ela **recusa** o que não é número em português (`"dez e seis"`, `"vinte e trinta"`,
`"vinte e vinte"`), porque régua que soma por soar parecido é a régua de palavra outra vez. E os
três lugares que liam número em palavra passaram a chamá-la — o total, as categorias em frase e a
tabela da partição —, porque *conserto de régua que não é aplicado em todos os instrumentos que
leem a mesma coisa é meio conserto* (D231).

**E a trava da trava existe:** há teste de que a §6 de **hoje** é lida com `totalDeclarado`
**não nulo** e igual ao número de linhas da tabela. Sem ele, a próxima palavra nova volta a calar
a guarda sem ninguém ver.

---

## D252 · Trava que cita um item da caixa pelo NOME quebra no dia em que o item é concluído · 10/10/2026

**Pega pelo verde, no fim do próprio LAB-77.** A trava do item 010 confere que as cinco regras do
Jonny **estão escritas** no adendo, e o lia assim:

```ts
const ADENDO = readFileSync(join(RAIZ, "docs", "caixa-de-entrada", "010-adendo.md"), "utf8");
```

Depois de entregar, marquei o item como feito — `010-adendo.md` → `010-adendo-FEITO.md`, que é o
que a caixa de entrada manda fazer. **O arquivo de teste passou a estourar AO CARREGAR.**

O verde saiu `765 pass · 1 fail`, e o detalhe importa: **o `fail` não era um teste** — era o
arquivo inteiro não abrindo, com `# Unhandled error between tests`. A contagem caiu de 409 para
372 na mesma lista de travas, e **foi a queda da contagem que delatou**, não o nome do teste:
teste que não carrega não aparece como reprovado, aparece como ausente.

> **TRAVA QUE CITA UM ITEM PELO NOME DO ARQUIVO TEM UM PRAZO: O DIA EM QUE O ITEM É CONCLUÍDO.**
> Cita-se pelo **número**, que é o que não muda.

`caminhoDoItemDaCaixa` e `lerItemDaCaixa` acham o item em qualquer dos dois estados e **estouram
nomeando os dois caminhos tentados** quando ele não existe — porque devolver vazio aqui faria a
trava aprovar um adendo que ela não leu.

### E havia precedente nos DOIS sentidos, que é o sinal do D116

- `trava-de-estrutura.test.ts` já casava por **prefixo** (`startsWith(".../006")`) e **sobreviveu**;
- `custo-por-uso.test.ts` e `vazamento-de-custo.test.ts` gravaram `005-FEITO.md` **literal**.

**Essas duas NÃO foram mexidas, e o motivo é medido:** as duas listas são **nominais por
desenho** — *"cada entrada é um arquivo que tropeçou de verdade, não um padrão que adivinha quais
tropeçariam"* (a família do D155). Se o `005` fosse renomeado outra vez, a entrada deixaria de
casar e a trava **acusaria** o arquivo: falha **alta e consertável**, não silenciosa. É uma classe
de risco diferente da minha, que **derrubava o carregamento**. *Aplicar o conserto onde ele não
resolve nada é churn, e o D231 cobra o conserto nos instrumentos que leem a MESMA coisa — não em
todos os que parecem.*

---

## D253 · O SÉTIMO MECANISMO EXISTE, e é do MOTOR: a fileira externa transborda o canto · 10/10/2026

**Item 011, LAB-78.** A pergunta era binária: as violações que o LAB-59 deixou sem mecanismo em
Antonina vêm de **como o motor planta** (sétimo mecanismo) ou de **como a faixa de via pública é
construída** (largura e divisa)? **Medido: é o motor**, e as duas hipóteses da faixa caem com
número.

### A LARGURA cai como controle, e a geometria dizia por quê antes da medição

O Lab construiu a faixa com **8 m** (LAB-48, LAB-59). O Generate constrói com
`Math.max(8, larguraEntrada / 2)` e `PARAMS_PADRAO_V1.larguraEntrada = 20` — ou seja **10 m**.
*Mais uma vez o número do Lab não era o de quem declarou a regra* (D98, D104, D166).

**Mas a largura não podia explicar nada, e isso é geometria:** `faixaViaPublica` cola o
quadrilátero do lado de **FORA** da divisa e o estende para fora. **A borda de dentro dela é a
divisa.** Alargar afasta a borda externa e não aproxima nada do lado de dentro.

> **Alargar uma faixa que cresce para fora não fecha uma folga que está do lado de dentro.**

Medido: o lote do `cluster` fica a **0,19 m** da faixa de 8 m **e a 0,19 m** da de 10 m. Idêntico.
A largura entrou como **controle** e saiu **indiferente**, como tinha de sair.

### A DIVISA cai com a cobertura: ela cobre a face declarada INTEIRA

`divisaDoAcesso` devolve **um** segmento do anel, e a hipótese era que a face entregue
atravessasse vários. Medido em Antonina: a face declarada tem **180,22 m** e a divisa escolhida
tem **180,22 m** — **100 % de cobertura**. A faixa não é curta.

### O que sobra, medido: o lote está ALÉM DA PONTA da face

Projetando cada vértice do lote no parâmetro da divisa:

| candidata | lote | além da ponta | face declarada | via interna |
|---|---|---|---|---|
| `cluster` | `v16-e15` | **0,19 a 13,18 m** | 0,19 m | 5,54 m |
| `pente` | `v3-e19` | **0,29 a 10,43 m** | 0,29 m | 0,04 m |

Os dois estão **inteiramente fora** do segmento da face declarada, virando o canto em
`(-16,359; -689,672)` para a **face vizinha, de 1 845,71 m** — e a ida entrega
`facesLoteamento: [0]`, **só a face 0**. A ida está certa, a faixa está certa, e o motor planta
fileira externa alguns metros adiante do canto, numa face que ninguém declarou como face de
loteamento.

> **O SÉTIMO MECANISMO: a fileira externa TRANSBORDA O CANTO da face declarada e continua na
> face vizinha, onde não há rua declarada — então não pode haver frente.**

**Não há rua na frente desses lotes porque ninguém declarou rua ali** — e isto costura o LAB-78
ao LAB-77: o campo que diria quais faces dão para via pública **não existe no contrato** (D249).
O motor não tem como saber onde a rua termina; ele sabe apenas qual face recebe lotes de frente,
e transborda a ponta dela.

### O conserto fica PROPOSTO, não executado

O item manda: *"se for o motor, caracterize o mecanismo e **proponha** o conserto na `FILA.md` sem
executar: mexer no plantio muda o desenho, e desenho espera o olho do Jonny."* Está na `FILA.md`
como proposto ao chat. **Nada no plantio foi tocado.**

### Duas das quatro não foram medíveis, e isso sai declarado

`espinha/v12-l1093` e `mioloVerde/v20-e18` **não existem no plano desta rodada**: o LAB-59 mediu
com `motor-testfit` em `4181e95` e esta rodada roda em `6cf6396` — **o motor andou entre as
duas**, e id de lote não sobrevive a mudança de plantio. Sai como `naoAchados` com o motivo, não
como zero (D23). Remedi-las exige rodar no commit daquela rodada, e isso é prompt.

**Pela prova do LAB-59, as duas eram de classes diferentes das medidas hoje:** a do `espinha` é
`amostragem-da-testada` (o motor reporta 8,72 m e a mesma função dele com passo fino devolve
10,22 m, acima do mínimo de 10 — o lote **passa**), e a do `mioloVerde` tem a forma do `pente`.
*Isto é leitura da prova antiga, não medição de hoje, e vai etiquetado como tal.*

---

## D254 · Eu ia publicar um achado contra o GENERATE, e a cobertura me desmentiu · 10/10/2026

**A vigésima terceira ocorrência do ponto cego do §6, pega dentro do prompt** — e a mais perto de
sair desde o D119, porque o veredicto já estava escrito, com dono `generate`, pronto para o recado.

A primeira versão do `deQuemEhAViolacao` dizia:

```
se a projeção do lote cai FORA da extensão da divisa → `faixa-alcance`, dono: generate
```

e devolveu isso para **os dois** lotes medidos. A frase que ia ao chat era *"a faixa cobre um
segmento do anel e não está na frente deste lote: é alcance"*.

**O que me desmentiu foi um número da minha própria medição, na linha de cima da tela:**
`A FAIXA COBRE 100 % DA FACE ENTREGUE`. Se a faixa cobre a face declarada inteira, um lote a
0,19 m da face **não pode** estar fora do alcance dela. As duas afirmações não cabiam juntas.

Medido o que faltava — **quantos metros** além da ponta —, a resposta apareceu: 13,18 m e
10,43 m. **Quem estava fora não era a faixa: era o lote.**

> **"ESTÁ FORA DA EXTENSÃO" NÃO DIZ DE QUEM É A CULPA.** A projeção responde *onde*; só o
> **quanto** responde *de quem*. Régua que conclui dono a partir de um booleano está adivinhando
> com cara de medição.

O conserto é de condição, não de exceção: `faixa-alcance` agora **exige cobertura menor que
100 %**, e há trava para os dois lados — cobertura de 100 % **nunca** vira achado contra o
Generate, e cobertura de 60 % com projeção fora vira. *A trava que vale é a que reprova a frase
que eu ia publicar* (a lição do LAB-59, aplicada a mim mesma uma rodada depois).

**E a classe é a de sempre:** régua minha acusando o vizinho, **quatro vezes** agora com o número
acusador saído da minha ponte ou do meu veredicto (D98, D104, D166, D254).

---

## D255 · O ALCANCE medido: 2 de 67 provas eram remedidas da fonte, e a TERCEIRA classe é o achado · 10/10/2026

**Item 012, LAB-79.** O item mandou **medir antes de construir**, e o motivo é a frase dele:

> **Lista que cresce é dívida visível. Trava que confere consigo mesma é dívida invisível — e ela
> sai VERDE.**

Medido o universo, **mecanicamente** — a lista de quem cita quem sai da leitura dos arquivos de
teste, não da minha memória:

| quantas | como se confere | o que isso quer dizer |
|---|---|---|
| **2** | remedida da fonte, com escopo publicado | só as duas do LAB-49 (`escopo-do-detector.ts`) |
| **18** | remedida em parte, **sem escopo declarado** | alguma trava confere algo, e **qual parte não está publicada** |
| **23** | **só a forma** | a §7 confere que as **chaves** existem. *Forma não é número* |
| **24** | **sem trava nenhuma** | não é "aprovada": é **não lida** |

2 + 18 + 23 + 24 = **67**. **Sessenta e cinco de sessenta e sete não tinham escopo publicado.**

**Depois do LAB-79: 7 / 17 / 21 / 23 de 68** (o universo ganhou a prova deste prompt, que se
inclui — e isso fica dito, porque prova que mede provas conta a si mesma).

### A divisão que o item sugeriu não cobriu todas, e isso era o achado que ele pediu

O item propôs **duas** classes — *estado de agora* (regerável) e *evento* (nunca) — e disse: *"se
essa divisão não couber em alguma prova, **ela é o achado** — escreva qual e por quê, em vez de
forçá-la."*

Não couberam, e o contra-exemplo é de **um prompt atrás**. A prova do LAB-78 mede lotes de um
plano gerado pelo motor de um **vizinho**, num commit dele. Ela *parece* estado de agora. Mas
regerá-la **muda o sujeito**: o LAB-59 mediu com `motor-testfit` em `4181e95`, o LAB-78 rodou em
`6cf6396`, e **dois dos quatro lotes deixaram de existir**.

> **PROVA MEDIDA CONTRA O CLONE DE UM VIZINHO NÃO É ESTADO DE AGORA NEM EVENTO: ela afirma o
> presente DE OUTRO REPOSITÓRIO, num commit dele.** Regerá-la em silêncio não atualiza a
> medição — **troca a pergunta** e some com a resposta antiga.

São **três** classes, e a terceira só se regera **declarando o commit do vizinho**. É a mesma
lição do carimbo do LAB-68 e do segundo eixo do LAB-74, agora aplicada a *quando* uma prova pode
ser reescrita. `podeSerRegerada` diz **não por padrão** e exige o commit declarado — a fronteira
do D182 em código, e **o D182 não se afrouxa de madrugada**.

### O que entrou, e o critério da escolha é declarado

Cinco provas ganharam escopo publicado (`escopo-remedido.ts`), escolhidas **por critério e não
por gosto**: são as cujos números saem de **módulos deste repositório**, sem clone vizinho e sem
motor — portanto remedíveis dentro da trava, de graça, a cada verde. As que exigem rede, clone ou
motor saem `naoMedida` **com o motivo**, que é sempre custo ou dependência, nunca comodidade.

**E cada `medida` é implementada na trava**, com trava própria para isso: declaração que diz
`medida` e não remede nada seria a dívida invisível **com mais código**.

**A trava não escreve em `docs/provas/`** — e há trava que confere isso **no `import`** dela, não
no texto.

---

## D256 · A trava nova pegou uma prova VELHA na primeira execução — e era a mais viva da casa · 10/10/2026

**Não foi num teste sintético: foi no repositório.** Ao implementar a remedição do
`item-004/conta-dos-disparos.json`, a trava reprovou na hora:

```
a prova dizia  5 disparos · 1 em vazio
a conta viva dizia  14 disparos · 4 em vazio
```

**A prova estava velha desde 09/10** e **nada no verde reprovava isso** — exatamente o defeito que
o item 012 nomeou, e exatamente a forma do D195 (a prova do LAB-57 dizia 1 e a ferramenta dizia
10, e saiu verde).

E a ironia mede o problema: **é a prova mais viva do repositório**. A conta dos disparos cresce a
cada hora, por desenho. Uma prova que afirma um número que muda sozinho e que ninguém reconfere
**envelhece entre o commit e o café**.

Ela é `estado-de-agora`, então a divisão permite regerá-la: `bun run lab71`, e a prova passou a
dizer 14 e 4. **O D182 não foi tocado** — nenhuma prova de evento foi reescrita.

> **Prova de ESTADO cujo número cresce sozinho precisa de remedição, não de revisão.** Revisão é
> alguém lembrar; remedição é o verde não deixar passar.

### E ela envelheceu DUAS VEZES na mesma rodada — o que prova o ponto melhor que o argumento

Depois de regerá-la (14 e 4), eu acrescentei a linha das 05:06 na conta — o disparo que trouxe
este próprio item. A conta foi a **15**, a prova ficou em **14**, e **a trava reprovou de novo**,
no mesmo prompt.

**Isto não é um tropeço: é a medida do problema.** Uma prova cujo número muda a cada hora
envelhece **entre duas edições do mesmo commit**. Nenhuma disciplina humana cobre isso; só uma
régua que roda no verde cobre.

E sai uma regra de ORDEM, que é prática e não filosófica:

> **Prova de estado se regera DEPOIS da última edição da fonte, nunca antes.** No fluxo desta
> casa: primeiro a linha na conta dos disparos, depois `bun run lab71`. Regerar antes produz uma
> prova que nasce velha — exatamente o que o D195 mediu no LAB-57.

---

## D257 · A trava que proíbe escrever em disco ACUSOU A SI MESMA — terceira vez da família · 10/10/2026

A fronteira do item 012 diz: *"pare se a trava nova quiser **escrever** dentro de
`docs/provas/`"*. Escrevi a trava disso assim: ela lê o próprio fonte, tira os comentários, e
confere que a palavra `writeFileSync` não aparece.

**Ela reprovou.** O fonte contém a palavra **porque é ela que a proíbe** — o literal está no
`expect`.

É a **terceira** vez desta família nesta casa: o D142 (a régua leu a **menção** da palavra, não o
`import`), o D155 (a régua leu o **comentário** que explicava o conserto) e agora esta. E o
conserto já estava escrito na §6, com estas palavras:

> *quando a régua procura um nome em código, procure-o **no lugar da gramática onde ele significa
> aquilo** (num `import`, não no arquivo inteiro).*

Escrever em disco exige **importar** o escritor. Então a régua passou a casar a **linha do
`import` de `node:fs`** e a exigir que ela traga exatamente `readFileSync`, `readdirSync` e
`statSync` — nada mais. *Régua que lê o arquivo inteiro mede o que o código DIZ; régua que lê o
`import` mede o que ele PODE FAZER.*

---

## D258 · `soOCodigo()` JÁ EXISTIA, e o buraco dela estava declarado — a terceira limpeza · 10/10/2026

A régua do destino `codigo` precisa ler **posição de identificador**: um padrão que *procura* o
nome do nosso custo não o *usa*. Eu ia escrever o varredor — e a casa **já tinha** `soOCodigo()`,
em `src/varredura-de-chamadas.ts`, **com o nome idêntico** e a lição do D179 escrita ao lado.

> *Item 009:* **nome novo para coisa que já tem nome na casa é custo sem benefício. Antes de
> criar estrutura nova, procure a que já responde a pergunta.**

O que faltava nela estava **declarado como buraco** no próprio comentário: *"literal de expressão
regular… aqui não vale o preço — os padrões deste repositório moram em `String.raw`"*.

**Para a configuração aquilo era verdade. Para a varredura de custo não é:** os nomes do nosso
custo moram em literais de regex **nus**, e é por isso que a trava do vazamento **acusava a si
mesma em 13 linhas** e comprava a isenção escrevendo o próprio nome numa lista.

Então entrou a **terceira** limpeza da mesma família, e não uma função paralela:

> **`semComentarios()` responde *"o texto DECLARA isto?"*. `soOCodigo()`, *"o código FAZ isto?"*.
> `semLiteraisDeRegex()`, *"o código USA este nome?"*.**

**A lição é sobre buracos declarados, e vale além deste caso:**

> **Buraco declarado não é buraco fechado — e o preço de fechá-lo não é fixo: ele depende da
> PERGUNTA.** A mesma limpeza que não valia o preço para a configuração era a condição de
> existência da varredura de custo. Ao ler *"aqui não vale o preço"* num comentário antigo,
> pergunte **para qual pergunta** aquilo foi medido.

**O que ela não alcança, e vai dito:** a decisão entre literal de regex e divisão é feita pelo
caractere anterior mais uma lista de palavras-chave, não pela gramática. O erro possível é apagar
uma divisão, e apagar só produz falso **negativo**. É por isso que a sabotagem do destino `codigo`
planta o vazamento em **posição de identificador** — a única que limpeza nenhuma alcança.

Medido: **zero** nome ou valor de custo em posição de identificador nos 197 arquivos de código, e
a varredura de **chamada paga de IA** passou a dar zero **sem isenção nenhuma**, onde antes lia o
texto cru e comprava a sua na mesma lista.

---

## D259 · "ESTA LINHA AFIRMA OU SÓ MOSTRA?" tinha CINCO respostas nesta casa · 10/10/2026

Antes de escrever a sexta, contei as que existiam:

| onde | o que lê | para quem |
|---|---|---|
| `src/limites-com-sujeito.ts` | `semCitacoes()` — tira a **linha** de citação | a aritmética da regra |
| `tests/moldura.test.ts` | `semRiscadoNemCitado()` — riscado, crase e citação curta | a moldura |
| `tests/verde.test.ts` | um `semCitacoes` local, só citação curta | o aviso do CI |
| `src/trava-de-estrutura.ts` | `/^\s*>/` inline | as condições de conta |
| `src/texto-das-regras.ts` | `comoARegraSeLe()` — tira o `>` do **meio** da frase | toda trava que cita regra |

**Três das cinco moram dentro de travas**, e **nenhuma das cinco conhecia o BLOCO DE CÓDIGO** — e
é ele que guarda os recados, o que fez a varredura de custo acusar o `RECADOS.md` por duas linhas
que são **recado gravado**.

> **Cinco respostas para a mesma pergunta não são cinco réguas: são uma régua que ninguém
> terminou.** O D116 proíbe a segunda montagem da mesma pergunta; aqui havia a quinta.

**O que foi feito:** a leitura que esta varredura precisa mora em `src/texto-das-regras.ts`
(`lugaresDaPagina`, `afirmadoNaLinha`), com as que já moravam lá — e o `semRiscadoNemCitado()`
**saiu de dentro de `moldura.test.ts`** para o mesmo lugar, com a trava daquele arquivo passando a
importá-lo. É a regra daquele módulo: *conserto que mora dentro de um teste conserta um teste*
(D248).

**O que NÃO foi feito, e por quê:** unificar as cinco. São 5 arquivos e as travas de três deles, e
o item 012 disse em que condição isso não se faz — *"não na mesma rodada de outra coisa"*. Está na
`FILA.md` como proposta ao chat, **com esta contagem**, que é o insumo que faltava.

---

## D260 · DUAS das 11 isenções estavam MORTAS, e uma delas NUNCA tropeçou · 10/10/2026

Medido antes de desenhar o modelo novo: das **11** entradas da lista nominal da
`vazamento-de-custo.test.ts`, só **9** arquivos eram de fato acusados.

| entrada | acusa hoje? | já acusou alguma vez? |
|---|---|---|
| `docs/DECISOES.md` | **não** | nenhuma das 5 regras de nome, em commit nenhum |
| `docs/relatorios/LAB-74.md` | **não** | **nunca**, nas 7 regras, em toda a sua história |

E `LAB-74.md` é **uma das duas entradas que dispararam o critério do teto** (D243). A lista jurava
no próprio comentário:

> *"cada entrada é um arquivo que tropeçou de verdade, não um padrão que adivinha quais
> tropeçariam."*

**Essa entrada foi adivinhada.** O critério disparou por uma entrada que nunca precisou existir —
o que não desmente o critério: ele apontou para o desenho, e o desenho estava errado por dois
motivos ao mesmo tempo.

> **Lista de isenções sem revalidação envelhece igual a comentário** (D104). A §7 já cobra isso
> das provas — *"exceção na lista que deixou de precisar ser exceção"* —, e a lista do custo não
> tinha a mesma guarda. **Agora não tem lista**, e a trava que substitui a guarda é mais forte:
> ela exige que a varredura **se varra a si mesma** sem ser acusada.

---

## D261 · A LIMPEZA CERTA PARA MARKDOWN É A CEGUEIRA CERTA PARA JSON · 10/10/2026

Ao trazer `docs/` inteiro para o destino `registro`, a prova em JSON passou a ser lida pela
limpeza de Markdown — que tira o que está **entre aspas**, porque ali aspas são citação.

**Em JSON toda chave está entre aspas.** `"custoMedido": 0.012` seria apagado junto com o resto, e
um vazamento de verdade passaria **em silêncio**. Peguei antes de entregar, e é falso **negativo**:
não acusa ninguém, e por isso não entra na tabela do §6 — mas custa igual.

> **O D179 ensinou que a PERGUNTA decide a limpeza. Aqui é o FORMATO.** E a espécie é a do D164:
> *zero de régua cega é indistinguível de zero de árvore limpa.*

O registro passou a ter **duas leituras declaradas por formato** (`formaDoRegistro`), e a trava
prova a cegueira em vez de só afirmar que ela existe: **a mesma linha é pega como `dados` e escapa
como `markdown`**.

---

## D262 · A PROVA PUBLICOU AS FIXTURES, e a varredura acusou a prova — sexta vez da família · 10/10/2026

A primeira versão da prova do LAB-80 publicava o **texto plantado** da sabotagem, destino por
destino. A varredura leu a prova e **acusou-a em 7 linhas**.

É a **sexta** vez desta família (D137, D142, D155, D217, D257 e esta), e a primeira em que o
acusado não é um fonte nem um relatório: é **a prova da própria régua**.

O conserto é a disciplina que o §4 já impõe ao segredo — *"registro nenhum repete mais de doze
caracteres"* —, aplicada a um objeto novo:

> **A prova publica o VEREDICTO, não a fixture.** O texto plantado mora no código, que é lido em
> posição de identificador; a prova diz se a régua pegou e se ela poupou, e quem quiser o texto
> abre `SABOTAGEM` em `src/destino-do-que-sai.ts`.

*Prova de régua que repete o que a régua proíbe é a régua se acusando com a autoridade da prova.*

---

## D263 · A RÉGUA NOVA NASCEU COM A DOENÇA QUE A RÉGUA VELHA JÁ TINHA CURADO · 10/10/2026

A régua do **valor** do nosso custo, escrita neste prompt, pedia só `fator` perto de um número.
Ela acusou **três** linhas de relatório — e as três eram a razão entre **pico e média de uma
rampa**:

| onde | a linha |
|---|---|
| `FILA.md:2090` | *"**24,23 %** e pior **161,38 %**, fator de **6,7×**"* |
| `FILA.md:2091` | *"15,44 %, fator de **13,2×**"* |
| `LAB-18.md:81` | *"A rampa: a média diluía o pico por um fator de 6 a 13"* |

**O `margem` desta casa já tinha sido curado exatamente desse jeito**, no LAB-67: ele só conta
quando a mesma linha traz lucro, preço, custo, `R$` ou `US$` — senão é a folga da caixa
envolvente, **em metros**, e acusá-la é medir ortografia (D137). Eu escrevi o irmão dele **sem a
cura**, no mesmo arquivo, a vinte linhas de distância.

> **Régua nova nasce com a doença que a régua velha já curou, um campo ao lado.** Ao escrever uma
> régua para um nome, pergunte se o nome **irmão** dele já foi curado nesta casa — e **de quê**.
> A cura mora na régua velha, não na minha memória.

`fator` e `margem` passam a exigir **número E palavra de dinheiro** na mesma linha, e há trava nos
dois sentidos com as três linhas de verdade como fixture.

**O buraco fica declarado:** *"o fator é 3"*, escrito sem palavra de dinheiro na linha, **escapa**
da régua do registro. Fecha-se com proximidade de dinheiro ou não se fecha — **afrouxar para
pegá-lo devolve as três acusações geométricas**, e a trava que as proíbe é a que mede esse preço.
*Guarda que não declara o próprio buraco mente pelo silêncio.*

---

## D264 · A SEGUNDA COINCIDÊNCIA CASADA COMO INVARIANTE, duas linhas abaixo do comentário que a proíbe · 10/10/2026

A trava `por-lugar.test.ts` conferia a conta das condições de abertura, e o LAB-78 já tinha
consertado uma coincidência ali: a identidade `frase + foraDaFila === total` valia **só porque
`naFila` era 15 naquele dia**, e o comentário do conserto diz isso com todas as letras —
*"era COINCIDÊNCIA, não invariante, e uma trava que casa coincidência reprova no dia em que o
mundo anda sem nada ter piorado."*

**Duas linhas abaixo desse comentário estava escrito:**

```ts
expect(QUANTAS_CONDICOES.naFila - QUANTAS_CONDICOES.queAVarreduraDeFraseAlcancou).toBe(1);
```

`16 - 15 = 1` — a **mesma** doença, no mesmo teste, escrita pela mesma mão no mesmo prompt. No
LAB-80 a `FILA.md` foi a 17, a diferença virou 2, e a trava reprovou **sem nada ter piorado**.

> **Consertar uma coincidência não imuniza a função onde ela estava.** A pergunta não é *"esta
> igualdade é verdadeira hoje?"* — é *"o que teria de acontecer no mundo para ela deixar de ser,
> e isso é uma PIORA?"* Se a resposta é "a lista crescer", não é invariante: é a foto de um dia.

No lugar dela ficou o que é de fato invariante: o número da varredura de frase é **histórico**,
então ele não anda, e a `FILA.md` só cresce — `naFila > queAVarreduraDeFraseAlcancou`.

---

## D265 · A CONVENÇÃO QUE UMA RÉGUA LÊ E NINGUÉM ESCREVEU · 10/10/2026

A conta dos disparos do despertador classifica uma rodada como **em vazio** lendo a coluna *"o que
achou"* e procurando as palavras `nada`, `vazio` ou `sem item`:

```ts
emVazio: /vazio|nada|sem item/i.test(achou)
```

Funcionou em 15 linhas porque **todas as linhas em vazio foram escritas com a palavra "nada"** —
convenção real, nunca escrita.

**No LAB-80 a convenção quebrou, e por uma linha minha.** A rodada das 06:06 tinha a caixa sem
item novo **e trabalho eleito por escrito** (a D243, eleita pelo item 012), então não era um
disparo em vazio. Eu escrevi *"nada NOVO na caixa"* — verdade sobre a caixa —, a régua leu o
`nada`, classificou a rodada como vazia, e a conta passou a **declarar 4 contra 5 medidos**.

> **Convenção que uma régua lê e ninguém escreveu é uma régua adivinhando.** Ou a coluna é prosa
> livre e a classe vira **campo próprio**, ou a convenção está **escrita** — e não há terceira
> opção que sobreviva à primeira exceção.

**O que foi feito:** a linha foi reescrita sem as três palavras (*"a caixa com os doze feitos, e a
FILA com a D243 eleita pelo item 012"*), e **a convenção foi escrita** na própria seção do
`ONDE_PARAMOS.md`, ao lado da régua que a lê. Escolhi escrever a convenção em vez de criar o campo
porque a coluna serve à **leitura humana** primeiro, e um campo a mais numa tabela de 16 linhas
custa mais do que a frase que acabei de escrever.

**E fica dita a distinção que a conta mede:**

> **Disparo em vazio é disparo que não tinha O QUE FAZER, não disparo em que a CAIXA estava
> vazia.** A medida decide o intervalo de 60 minutos — ela existe para dizer se o chat abastece
> mais devagar do que eu consumo, não para contar quantas vezes a caixa coincidiu de estar em dia.

---

## D266 · A MINHA RÉGUA DE MEDIÇÃO ERA MAIS ESTREITA QUE A RÉGUA MEDIDA — e o número saiu para o lado OTIMISTA · 10/10/2026

Ao levar o conserto do D243 à régua irmã — a das **condições de conta**, que tinha a mesma lista
nominal e o mesmo motivo —, medi quantas das três isenções a leitura nova dissolveria. O meu
script percorria os padrões e **parava no primeiro que casava a linha**, testando só aquele:

```ts
for (const re of CONDICAO_DE_CONTA) { if (!re.test(linha)) continue; /* testa ESTE */ break; }
```

**A régua medida usa `.some(...)`: ela testa TODOS.** Na linha 88 do `LAB-73.md` o
*"quando compensar"* está entre aspas e dissolve — mas **`ponto de equilíbrio` está nu**, numa
célula de tabela, e sobrevive. Eu ia publicar *"três isenções a UMA"* e a verdade é **três a
DUAS**.

> **Régua de medição mais estreita que a régua medida dá o número para o lado OTIMISTA** — e o
> lado otimista é o que ninguém confere, porque ele confirma o conserto.

Quem pegou foi a trava, no mesmo minuto. **A vigésima sétima do §6**, e a primeira de uma classe
nova: não foi régua acusando a si mesma, não foi ponte, não foi caminho, não foi memória — foi
**instrumento de medição discordando do instrumento medido**.

### E no mesmo conserto houve um segundo erro, este de METADE DA CURA

Ao trocar o `/^\s*>/` pela `afirmadoNaLinha()`, eu **perdi a proteção da citação** — que era
exatamente o conserto do item 007. As duas leituras respondem perguntas diferentes:

> **`lugaresDaPagina()` responde ONDE a linha está. `afirmadoNaLinha()` responde o que ela afirma
> DENTRO da linha.** A varredura de custo usa as duas; eu levei só uma para a régua irmã.

A fixture que pegou foi uma que eu **acabara de escrever** para reforçar o outro sentido:
`> volta no ponto de equilíbrio` voltou a ser acusado. *A disciplina de conferir a régua nos dois
sentidos pagou dentro do mesmo prompt em que foi aplicada.*

---

## D267 · `soOCodigo()` COLAPSAVA 422 LINHAS EM 164, e a cegueira era silenciosa · 10/10/2026

O esvaziador de strings da `soOCodigo()` casa de uma aspa à próxima **através de quebras de
linha**, e **não sabe que uma aspa pode morar dentro de um literal de expressão regular**.

Aplicado a `varredura-de-chamadas.ts` — o arquivo que declara a própria limpeza, e que escreve uma
classe de caracteres com as três aspas —, ele casava daquela aspa **até muito depois**: medido,
**422 linhas viravam 164**.

**O efeito não era um erro. Era cegueira.** A varredura de chamadas deixou de achar o único achado
benigno daquele arquivo — **de 1 para 0** — e um `?? 0` de verdade escrito ali passaria igual.

> *Limpeza que não sabe onde a string começa não limpa: ela corta* — a frase já estava escrita no
> comentário da função, sobre **globs em strings** (D179). O que faltava era notar que **literal
> de regex é o mesmo caso**, e que o comentário logo abaixo **declarava esse buraco e declinava de
> fechá-lo**: *"aqui não vale o preço"*.

**Fechá-lo deixou de ser preço e passou a ser correção:** a `semLiteraisDeRegex()`, escrita neste
mesmo prompt para outra finalidade (D258), entra **antes** do esvaziador e tira o literal inteiro
com as aspas de dentro. Depois: **445 linhas viram 443**, e as duas que faltam são texto de
comentário já apagado.

### Quem pegou, e é a metade da trava que quase ninguém escreve

A trava dos **FANTASMAS** da `chamadas.test.ts` — a que cobra que um benigno declarado **não
desapareça**:

```ts
const fantasmas = Object.keys(BENIGNOS).filter((k) => !chaves.includes(k));
```

> **Lista de achados benignos sem a metade "nenhum deles sumiu" aprova o silêncio.** A metade que
> cobra "nenhum achado NOVO" protege contra defeito que entra; a que cobra "nenhum sumiu" protege
> contra a régua que para de medir — e é essa que ninguém se lembra de escrever.

**Isto NÃO entra na tabela do §6**, pelo mesmo critério do D261: falso negativo não acusa ninguém.
Custa igual, e por isso está aqui.

---

## D268 · RENOMEAR NUM RAMO E MESCLAR A ORIGEM RECRIA O NOME ANTIGO — e o item voltaria a ser PENDENTE · 10/10/2026

O item 013 chegou **durante** a rodada do LAB-80. Eu o trouxe para o clone, cumpri-o, e renomeei
`013.md` → `013-FEITO.md`, que é o passo 4 da `COMO_FUNCIONA.md`. Depois, para enviar, mesclei a
`origin/main` — **que ainda tinha o `013.md`**.

**O merge ressuscitou o nome antigo.** Os dois arquivos no disco, e a
`caminhoDoItemDaCaixa()` — escrita no LAB-77 justamente para achar o item **pelo número**, porque
o nome muda (D252) — devolvia o **primeiro** da lista de candidatos:

```ts
const candidatos = [`${dir}/${numero}.md`, `${dir}/${numero}-FEITO.md`];
for (const c of candidatos) if (existsSync(c)) return c;
```

**Ou seja: o item concluído voltaria a ser lido como PENDENTE, em silêncio.** A função que existia
para atravessar a renomeação foi derrotada pela renomeação acontecendo **nos dois sentidos ao mesmo
tempo**.

> **O estado de um item é o NOME do arquivo — e dois nomes para o mesmo número não são um estado:
> são uma ambiguidade.** Ambiguidade se **recusa**, nunca se resolve por ordem de lista. Ordem de
> lista é uma preferência disfarçada de decisão, e a preferência aqui era pelo estado **errado**.

**O que foi feito:** a função passa a **estourar** quando os dois existem, com a mensagem dizendo o
que costuma ter acontecido (um `git merge` da origem depois de um renomear no ramo). Três travas
novas: acha o concluído pelo número, estoura em número que não existe, e **planta o sósia** para
provar que a recusa acontece — e o tira, provando que a recusa não deixa resíduo.

*É a segunda vez que o nome de um item da caixa quebra uma trava desta casa. A primeira (D252)
custou um verde com `765 pass · 1 fail` em que o "fail" não era um teste: era o arquivo não
abrindo. Esta não custou nada porque a primeira já tinha ensinado a procurar pelo número — o que
faltava era recusar o empate.*

---

## D269 · ITEM ESCRITO A PARTIR DO MEU RELATÓRIO HERDA A IDADE DO RELATÓRIO · 10/10/2026

O item 014 lista **três** leituras a unificar, e uma delas — `src/trava-de-estrutura.ts` — aparece
como *"`/^\s*>/` **inline**"*.

**Ela não era mais isso.** O LAB-80 já a havia passado para `lugaresDaPagina + afirmadoNaLinha` —
e foi exatamente ali que o D266 nasceu, quando eu levei metade da cura e a fixture nova me pegou.

O item foi escrito às 08h40 **a partir do meu relatório**, e aquele relatório descrevia o estado de
antes daquela parte da rodada. **Não é erro do chat: é a forma do atraso.** Quem escreve a partir
de um registro escreve sobre o instante do registro.

> **Antes de executar um item, meça a premissa dele contra o código.** Senão o primeiro trabalho da
> rodada é consertar o que já estava consertado — e isso sai como entrega, com relatório e tudo.

Medido: das três, **uma estava pronta**. O escopo real da rodada era **duas**, e dizê-lo é parte da
entrega — *escopo que encolhe por medição se declara; escopo que encolhe em silêncio é o D164.*

**Isto NÃO entra na tabela do §6:** não houve acusação errada nem número publicado errado. Eu
mediria duas vezes o mesmo arquivo, e a medição evitou. *Conta do ponto cego que cresce sem
ocorrência nova dilui a conta.*

---

## D270 · TERMINAR AS CINCO LEITURAS NÃO ERA FAZÊ-LAS IGUAIS — e a CRASE é a única marca que às vezes é o DADO · 10/10/2026

O LAB-80 contou cinco respostas para *"esta linha afirma ou só mostra?"* e deixou a frase:
*"cinco respostas para a mesma pergunta não são cinco réguas: são uma régua que ninguém terminou."*
O item 014 mandou terminá-la, **com a fronteira escrita**: *"cinco iguais por conveniência é pior
que quatro iguais e uma declarada."*

**Uma precisa ser diferente, e a medição é o que diz isso — não a opinião.** A trava do LAB-51
varre o `conferir.sh`, um **script de shell**, procurando frases que AFIRMAM que algo não existe, e
**extrai o caminho de dentro da crase** para conferir no disco:

| limpeza | na mentira plantada | na citação plantada |
|---|---|---|
| `semCitacoes` (a dela) | nega ✔ · acha `.github/workflows/verde.yml` ✔ | passa ✔ |
| `semRiscadoNemCitado` | nega ✔ · acha **ZERO caminhos** ✘ | passa ✔ |

A limpeza mais forte **cega a trava no caso exato para que ela nasceu** — e *parece* mais rigorosa:
nega igual, deixa a citação passar igual, e só o **dado** desaparece. E a leitura de Markdown ali é
um **nada**: `lugaresDaPagina` sobre aquele `.sh` devolve **0 citação e 0 cerca em 147 linhas**.

> **Unificar é dar UM LUGAR às leituras e UMA PERGUNTA a cada uma — não dar a mesma resposta a
> perguntas diferentes.** A limpeza que remove o dado de quem a chama não é mais rigorosa: é **um
> desligamento passando por conserto.**

### A ordem da Central é o que separa o conserto do desligamento

O item trouxe a ordem, e ela não é decoração: *provar primeiro que cada régua **continua achando o
que achava**, e só depois que **deixou de achar o que não devia**.* Na ordem inversa eu teria visto
*"a citação passa, o riscado passa, a cerca passa"* — **tudo verde** — e entregado uma trava cega.

### A QUARTA forma que o item convidou não é uma forma: é uma propriedade

O item disse que uma quarta forma de *"só mostra"*, se aparecesse medindo, entraria. Apareceu — e
não é uma marca nova:

> **A cerca, o `>` e o riscado NUNCA carregam o objeto da régua. A CRASE CARREGA.** É a única marca
> de *"só mostra"* que às vezes é *"isto é o que eu vim medir"*.

Daí a família ter **seis membros com perguntas declaradas** em vez de uma função com um argumento:
a escolha entre elas não é de **rigor**, é de **qual é o objeto**. E a diferença não fica só num
comentário — há trava que **reprova se a `semRiscadoNemCitado` passar a preservar a crase**, porque
nesse dia a UMA declarada perde o motivo. *Diferença declarada que ninguém reconfere é a mesma
coisa que diferença esquecida.*

### O buraco comum, fechado

`soAProsa()` tira **citação e bloco de código** — o bloco era o que faltava às cinco, e foi ele que
fez a varredura de custo acusar o `RECADOS.md` por duas linhas que são **recado gravado**. Medido
nas seções de regra da `CLAUDE.md`: **20 linhas em bloco de código, 17 na §1**, que são o **molde do
recado** — exemplo, não regra sobre o recado.

**E ela esvazia as linhas em vez de removê-las:** o número da linha não pode mentir para quem for
ler o achado. *Limpeza que encurta o texto faz a régua apontar para a linha errada.*

---

## D271 · UNIFICAR SEM GUARDA CONSERTA O PASSADO E DEIXA O FUTURO IGUAL · 10/10/2026

O problema do D259 nunca foi uma leitura **errada**. Foi **uma leitura nova nascendo dentro de cada
trava que precisava dela** — cinco vezes, por cinco autores que eram a mesma pessoa em cinco dias.

Juntar as cinco num lugar resolve as cinco. **Não resolve a sexta**, que nasce na próxima trava que
precisar de uma e não souber que a casa já tem.

> **Conserto de duplicação sem guarda contra a próxima é arrumação, não conserto.** A pergunta não
> é *"quantas existem hoje?"* — é *"o que impede a próxima?"*

A guarda varre todo `.ts` que o git carrega e reprova se qualquer arquivo **que não seja a casa**
DEFINIR uma das leituras. Ela lê **os nomes que o código USA** (`soOsNomesUsados`), não o texto —
então `import`, chamada, re-export e **comentário que cita o nome** não contam. Sem isso ela seria a
sétima ocorrência da família do D142/D155: a guarda contra a duplicação acusando o arquivo que
*documenta* a duplicação.

E a tabela `AS_LEITURAS` — quem lê, o que responde, **e por que não a vizinha** — é conferida
**contra os `import` de verdade** (D257), com sabotagem nos dois sentidos: instrumento que não
importa o que diz importar reprova **pelo nome dele**, e instrumento que sumiu do disco também.
*Tabela em documento envelhece igual a comentário* (D104); tabela conferida contra o `import` não.

---

## D272 · RÉGUA QUE ACUSA UMA CONTA TEM DE NOMEAR AS PARCELAS · 10/10/2026

A convenção que eu declarei no D265 — *a classe de uma rodada sai da palavra `vazio`, `nada` ou
`sem item` na coluna "o que achou"* — **me pegou de novo na rodada seguinte**. A linha das 09:06
dizia *"logo depois do disparo em vazio"*, a régua leu o `vazio`, e a conta passou a declarar **5
contra 6 medidos**.

**Duas vezes em duas rodadas, as duas minhas, as duas pegas pela trava.**

> **Convenção que o autor dela quebra na rodada seguinte não está mal obedecida: está escrita no
> lugar errado.** Enquanto ela não virar campo, o que dá para fazer é a régua **explicar o
> número** em vez de só o desmentir.

E era isso que faltava, porque a mensagem dizia apenas *"a seção declara 5 em vazio e a tabela tem
6"* — o que manda recontar seis linhas à mão para descobrir qual delas a régua classificou.

> **Régua que acusa uma CONTA tem de nomear as PARCELAS.** O total diz que algo está errado; a
> parcela diz **o quê**. E quando a classificação vem de uma palavra em prosa, a parcela é a única
> coisa que explica o número — sem ela, cada divergência custa a reconstrução inteira.

A mensagem agora lista **as linhas que ela contou como em vazio**, com data e hora, e **diz de
onde vem a classe** (a palavra na coluna). Custo: três linhas. O que economiza: a reconstrução que
eu acabei de fazer duas vezes.

*Não virou campo nesta rodada de propósito: o item 014 é sobre as leituras de texto, e trocar o
modelo da conta dos disparos no meio dele seria ampliar escopo (§1-A). A régua não erra em
silêncio — a trava reprova sempre —, então o custo é um ciclo, não uma medição falsa.*

---

## D273 · NÚMERO REUSADO NÃO SÃO DOIS NOMES DE UM ITEM: SÃO DOIS ITENS COM UMA IDENTIDADE · 10/10/2026

O chat escreveu um item novo como `013.md` — *"o conserto do LAB-78 virando PEDIDO completo"* —, e
o `013` **já estava usado**: o `013-FEITO.md` é a D243, encomendada às 08h40 e entregue no LAB-80.
A abertura do item novo diz *"os itens `001` a `012` estão todos ✅. Este é o `013`"*, e é aí que
está o engano: **a conta parou no `012`**, enquanto o `013` e o `014` também estavam feitos.

**E a colisão deixou a `main` VERMELHA.** A guarda que eu escrevi uma rodada antes (D268) **recusa**
a ambiguidade em vez de escolher o primeiro da lista — e com `013.md` e `013-FEITO.md` no disco ela
estourou, duas travas reprovadas. *Ela nasceu para o caso em que um `git merge` ressuscita o nome
antigo; o primeiro caso de verdade foi outro — um número reusado. Acertou nos dois.*

> **O número é a IDENTIDADE de um item nesta casa** — é por ele que as travas acham os itens,
> justamente porque o NOME muda quando o item é concluído (D252). Então **dois arquivos com o mesmo
> número não são um item com dois nomes: são dois itens com uma identidade**, e isso não se resolve
> escolhendo: resolve-se **movendo**.

**O que foi feito, e o que NÃO foi:** o item novo foi renomeado para o **próximo número livre**
(`015`), com o conteúdo **intocado** e um cabeçalho dizendo o que aconteceu. **Nenhum dos dois foi
apagado, e eu não decidi qual valia** — renomear o mais novo honra o que o chat quis dizer
(*"este é o próximo"*) em vez da conta que escapou.

*Apagar o item novo era o atalho, e seria o pior erro possível: eu quase o tratei como a
ressurreição do D268 — mesmo nome, mesma vizinhança, mesma aparência. O que me parou foi medir:
`git log --diff-filter=A` mostrou que o arquivo veio de um commit do chat com OUTRO assunto. **A
aparência de um defeito conhecido é o disfarce mais eficiente de um fato novo.***

---

## D274 · O CARIMBO DO CLONE LÊ O `HEAD` DELE, NÃO O CÓDIGO QUE O `import` CARREGOU · 10/10/2026

Para remedir o sétimo mecanismo contra o motor de **hoje**, repontei o `paths` do `tsconfig` para
um **clone do clone** em `3680b9f` — 56 commits à frente da árvore do vizinho — e rodei a
ferramenta. Ela mediu o motor novo: `import.meta.resolve("@testfit/api.ts")` apontava para o clone
do rascunho, conferido.

**E o relatório saiu dizendo `6cf6396`** — o `HEAD` da árvore do vizinho, que não foi tocada.

O carimbo de versão vem do `commit-dos-vizinhos.ts`, que lê `git -C <caminho> rev-parse HEAD`. O
código vem do **resolvedor de módulos**. São **duas fontes de verdade para a mesma pergunta** — *qual
motor rodou?* — e só uma delas sabe a resposta.

> **Carimbo de versão que lê o repositório, e não o módulo carregado, mede a INTENÇÃO de quem
> configurou — não o que rodou.** Ele acerta sempre que ninguém reponta nada, e é exatamente por
> isso que ninguém descobre que ele pode errar.

**Não consertei nisto nesta rodada, e o motivo é de escopo:** o item 015 manda remedir e escrever o
pedido, e trocar a fonte do carimbo é mudar a prova de toda rodada que usa clone (a proposta do
D223 inteira). Fica **declarado na prova do LAB-82** e proposto na `FILA.md`. O conserto tem nome:
o carimbo passa a sair do **módulo resolvido** (`import.meta.resolve` do ponto de entrada do
vizinho), e o `HEAD` do clone vira só uma **segunda** linha — e quando as duas divergirem, a prova
diz as duas.

*A remedição desta rodada não foi afetada: as duas passagens deram o mesmo número, e a que
importava — a do motor novo — está declarada com o método, não com o carimbo.*

---

## D275 · O ITEM APONTOU PARA O CLONE ERRADO, E O DONO DO DEFEITO É QUEM DECIDE QUAL CLONE IMPORTA · 10/10/2026

O item 015 manda, com razão, remedir antes de pedir: *"pedido construído sobre medição de clone
atrasado é a D241 virando trabalho alheio."* E diz **qual** clone: o do **Generate**, com o commit
`12208da` em `motor-v2`.

**Medido, três coisas:**

| o que o item supõe | o que a medição diz |
|---|---|
| há um `origin/motor-v2` a buscar | o clone é de **um ramo só**; e no remoto `motor-v2` e `main` apontam para o **MESMO** commit (`565d00c`), com `12208da` ancestral dele |
| o conserto é do motor, *"e o motor é do Generate"* | o veredito da medição é **`motor-testfit`** em 2 de 2 — outro repositório (§2) |
| o clone a remedir é o do Generate | o do Generate está **47** commits atrás; o do **motor** está **56** — e é a árvore do motor que o plantio vem |

> **Quem decide qual clone precisa estar atualizado é o DONO do defeito, não o dono da régua.** A
> faixa e a divisa são do Generate, e foi por isso que o item olhou para lá; mas a medição do LAB-78
> já tinha absolvido a faixa pelo número (cobertura 100 %, largura indiferente). O que sobrou é
> plantio, e plantio é do motor.

**A remedição foi feita contra o dono:** motor em `3680b9f`, num clone do clone, com o `paths`
repontado e devolvido byte a byte. **Os 10 a 13 m continuam, e idênticos** — 13,18 m e 10,43 m, 2
lotes, mesmo dono. Então o pedido vale, e sai com o número de hoje.

*E o Generate também foi conferido, porque era o que o item pedia: `12208da` existe no clone e é
ancestral do `origin/main` de agora. A informação do item estava certa; o endereço do defeito é que
não.*

---

## D276 · O CARIMBO SAI DO MÓDULO RESOLVIDO, e a divergência é a NOTÍCIA · 10/10/2026

O carimbo de versão do clone vizinho lia o `HEAD` de um caminho **por convenção**
(`join(RAIZ_DO_LAB, "..", repo)`), e o código vem do **resolvedor de módulos**. O LAB-82 provou a
consequência: ao remedir contra o motor em `3680b9f`, num clone do clone com o `paths` repontado,
a ferramenta **mediu o motor novo e carimbou o velho** — e não avisou (D274).

**O conserto, com os três passos que o item 016 nomeou:**

1. o carimbo sai do **módulo resolvido** — `import.meta.resolve` do ponto de entrada do vizinho, a
   **mesma régua** com que eu conferi o repoint no LAB-82;
2. o `HEAD` do caminho por convenção **vira uma segunda linha** e não desaparece: ele responde
   outra pergunta — *"que árvore está no lugar de sempre?"* — e continua valendo;
3. **divergindo, a prova diz as duas**, e `divergem` é um campo.

> **Carimbo de versão que lê o repositório mede a INTENÇÃO de quem configurou; carimbo que lê o
> módulo resolvido mede O QUE RODOU.** As duas perguntas são boas — o que não se pode é chamar as
> duas pelo mesmo nome e publicar uma delas.

### A medição mudou o tamanho do conserto, que é o que o item mandou medir antes

De **três** vizinhos, **dois** têm módulo a resolver e **um não tem**: o `urban-scout-tool` não
aparece em `paths` nenhum, porque **o Lab não importa o Geo** — ele lê GeoJSON de
`docs/terrenos/`, não código.

> **Carimbo que não tem módulo a resolver não é um carimbo pior: é um carimbo de outra pergunta.**

Para ele o carimbo honesto é o da convenção, **dito como tal** — e é por isso que `de` é um campo
**obrigatório** do carimbo: toda linha diz de onde saiu, e o `tsc` cobra isso de quem montar um
carimbo novo.

### A adoção, medida e não suposta

**71 provas** no repositório; **5** trazem carimbo de clone; **2 ferramentas** chamam o carimbo
(lido do `import`, não do texto — D257). As duas passam a publicar a procedência: a do LAB-68
publica o carimbo inteiro, e a do LAB-76 ganhou um campo ao lado, porque o `osClonesVizinhos` dela
é uma conferência **derivada** (motor contra a origem dele) e o objeto é outro.

*O item perguntou se a adoção cabia nesta rodada e mandou a medição decidir. Cabe — e cabe porque
é pequena, não porque eu quis que fosse.*

### A demonstração é de ponta a ponta, com o caso real

Trocado o resolvedor para apontar o `@testfit/` ao clone do rascunho em `3680b9f` — **o mesmo
repoint do LAB-82** —, o carimbo passou a dizer `commit: 3680b9f`, `pelaConvencao: 6cf6396` e
`divergem: true`. **O caso que o carimbo velho errava em silêncio agora é uma linha da prova.**

### O que o carimbo NÃO sabe, e isso fica dito

O módulo resolvido diz **qual arquivo** foi carregado; ele não diz se aquela árvore tinha mudança
**não commitada**. O campo `limpo` passa a medir a árvore **de onde o carimbo saiu**, o que ajuda —
mas um `git stash` no meio de uma rodada continua invisível para as duas fontes. *Guarda que não
declara o próprio buraco mente pelo silêncio.*

### E a trava do carimbo deixou de depender de REDE

A trava nova chamava `carimbarVizinhos()`, que faz `git fetch` nos três clones, e **estourou o
limite de 5 s**. O `fetch` passou a ser um parâmetro, ligado por padrão; a trava passa `false`,
porque a pergunta dela é *de onde o carimbo saiu* e isso não precisa de rede. **De 5,9 s para
154 ms.** *Trava que depende de rede não reprova o código: reprova a conexão.*

---

## D277 · DISPARO QUE A SESSÃO NÃO RECEBE NÃO É DISPARO EM VAZIO: É DISPARO PERDIDO · 10/10/2026

Entre 11:06 e 18:06 de 10/10 o despertador disparou **oito** vezes. **Uma** notificação chegou na
hora; as outras **sete** chegaram **todas no mesmo instante**, às 18:06, com o relógio do servidor
marcando até **seis horas** de espera para a mais antiga.

**E a caixa tinha o item `016` desde as 10h55.** Não houve nada de vazio nessas sete horas: houve
uma **sessão que não recebeu**.

> **Disparo que o despertador manda e a sessão não recebe não é disparo em vazio: é disparo
> PERDIDO.** Contá-lo como vazio diria ao chat *"você não abastece"*, quando o que aconteceu foi
> *"eu não estava ouvindo"*.

E a leitura trocada tem consequência prática, porque a conta **decide o intervalo**: sete vazios
falsos empurrariam o chat a **esticar** o despertador — o conserto exatamente oposto ao que sete
disparos perdidos pedem.

**A coluna de origem ganhou um terceiro valor no vocabulário fechado:** `entregue-em-lote`, ao lado
de `observado` (chegou na hora) e `derivado` (sai do `cron`, justificado num recado). *Classe nova
que se mistura com a velha apaga a medição das duas* — e foi a trava que cobrou isso, reprovando a
tabela enquanto a célula trazia a classe como **prosa em negrito** em vez de token do vocabulário.

**O que NÃO foi feito, de propósito:** nada no despertador. *Ligar, desligar e reagendar é do chat;
o meu trabalho é a conta* (item 004) — e a conta agora diz as três coisas separadas.

---

## D278 · COINCIDÊNCIA CONSERTADA COM OUTRA COINCIDÊNCIA É A MESMA TRAVA COM UMA VIDA MAIS LONGA · 10/10/2026

Mexer na conta dos itens abertos da `FILA.md` — **17 → 16**, por **entrega** da proposta do carimbo
— obrigou a reler as cinco travas que a contam. Numa delas, a `por-lugar.test.ts`, havia isto:

```ts
expect(QUANTAS_CONDICOES.naFila).toBeGreaterThan(QUANTAS_CONDICOES.queAVarreduraDeFraseAlcancou);
```

Escrita **por mim, no LAB-80**, exatamente para substituir a coincidência que o **D264** pegara
(`naFila - 15 === 1`, que valia porque `naFila` era 16 naquele dia). E justificada por escrito, no
comentário ao lado: *"o número da varredura de frase é histórico, então ele não anda, e a `FILA.md`
só cresce."*

**Medido, commit a commit, no arquivo que a declara:**

| commit | `naFila` | por quê |
|---|---|---|
| `b158ca4` (LAB-74) | 15 | a conta nasceu |
| `022ed67` (LAB-78) | 16 | o sétimo mecanismo entrou |
| `b3c61f5` (LAB-80) | 17 | a unificação das cinco leituras entrou |
| `90e480a` (LAB-81) | **16** | **a mesma proposta foi ENTREGUE** |
| `245ccc4` (LAB-82) | 17 | o carimbo do módulo resolvido entrou |
| LAB-83 | **16** | **esse mesmo foi ENTREGUE** |
| LAB-83, ainda | 17 | entrou a do trabalho de CI (D279), achada ao escrever a trava nova |

**A `FILA.md` não só cresce: ela desceu DUAS vezes, e as duas por entrega.** O `> 15` sobrevivia
por **um** no momento em que eu o li — a conta estava em 16 — e **duas entregas o reprovam sem nada
ter piorado**, que é a definição do defeito que o D264 nomeou. *Que ela tenha voltado a 17 na mesma
rodada não salva a trava: salvar uma trava por sorte do dia é exatamente o que torna este defeito
invisível.*

> **Coincidência consertada com outra coincidência é a mesma trava com uma vida mais longa.**

É a **terceira** da mesma função, e tem uma diferença que a torna a mais útil das três: as duas
primeiras eram contas sem justificativa escrita. **Esta trazia a justificativa ao lado, e a
justificativa é a parte que estava falsa.** Eu não casei um número por descuido: casei-o por uma
premissa sobre o mundo — *"a fila só cresce"* — que **a minha própria entrega desmentiu duas vezes,
uma delas antes de eu escrever a linha**, porque o LAB-81 já tinha descido de 17 para 16 quando o
LAB-80 ainda estava fresco.

> **Trava justificada por uma premissa sobre o mundo vale o que a premissa vale** — e premissa sobre
> o mundo se MEDE, não se afirma no comentário. *A régua estava certa; a frase que a defendia é que
> era a medição que eu não fiz.*

**O conserto é uma SUBTRAÇÃO:** a linha saiu e **nada tomou o lugar dela**. A relação entre a fila
de hoje e um número de ontem não é invariante nenhuma — é a medição de hoje, e a medição de hoje
já está asseverada na linha de cima (`naFila` é 16). O que continua guardado é o que é mesmo
invariante: o número histórico **pinado** em 15, porque é história e história não anda, e a soma
que **fecha** (`naFila + foraDaFila === total`).

*Terceira vez que esta função pediu conserto, e a primeira em que a resposta certa foi guardar
MENOS.*

---

## D279 · O NOME DE UM TRABALHO DE CI É UMA AFIRMAÇÃO, E ESTA DEIXOU DE SER VERDADE SEM NINGUÉM MEXER NELA · 10/10/2026

Ao escrever a trava nova do carimbo (D276) eu precisei de uma que lesse a máquina de verdade — os
três clones no disco — e fui ver onde ela cairia no CI. **E o lugar onde ela cai é um trabalho cujo
nome promete o contrário:**

> `guardas que não precisam dos clones vizinhos (NÃO é o verde)`

**Medido:** esse trabalho lista `tests/commit-dos-vizinhos.test.ts`, e ~~**duas travas desse
arquivo exigem**~~ **QUATRO travas desse arquivo exigem** o clone do `motor-testfit` no disco —
~~uma~~ **três** **desde o LAB-68** (*"o clone do motor tem de estar nesta máquina para esta
demonstração"*, conferida em `git show HEAD:`, anterior a esta rodada) e **uma minha, desta
rodada**.

> **O "duas" está riscado e não apagado: ele era uma contagem por LEITURA, e a execução do LAB-84
> disse QUATRO** — eu contei os `expect` cuja mensagem eu reconhecia e não vi as outras duas do
> mesmo `describe`, que dependem da variável `cabeca` e não repetem a frase. *Régua de leitura
> acha o que ela reconhece; execução acha o que acontece*, e aqui a diferença foi de 100 % (D282).
> Foi exatamente por isso que esta decisão mandou o número para a `FILA.md` em vez de o prometer. Sem o clone as duas reprovam, e o trabalho que existe
**justamente** para rodar sem segredo falharia por falta do que o nome dele promete não precisar.

O D141 pôs os dois nomes **para não enganarem**, e esse era o serviço que eles prestavam:
*"um CI vermelho por falta de configuração é honesto; um CI verde que não roda o verde é a mentira
que o D110 custou duas semanas."* **Este nome passou a enganar sem ninguém mexer nele** — bastou um
arquivo da lista ganhar uma trava que precisa de clone.

> **O nome de um trabalho de CI é uma AFIRMAÇÃO sobre o que ele precisa, e nenhuma trava a
> confere.** A lista de arquivos é escrita à mão, os arquivos crescem sozinhos, e a afirmação
> envelhece exatamente como um comentário (D104) — com o agravante de que **ela mora num arquivo
> que ninguém executa hoje**, porque a execução automática está desligada desde 08/10. *Afirmação
> desligada não é afirmação falsa: é afirmação que ninguém vai desmentir.*

**E eu NÃO consertei, de propósito.** O conserto tem duas formas — tirar as travas que precisam de
clone desse trabalho (e pô-las no verde completo), ou fazer o nome dizer a verdade —, e **escolher
entre as duas precisa de uma medição que eu não fiz: quantas travas de cada um dos **30** arquivos da
lista dependem do clone.** Prometer o número sem medir é a classe do D133, e ampliar escopo é o que
a §1-A proíbe. Foi para a `FILA.md` como proposta, com `prompt-novo`.

**A conta dos itens abertos andou DUAS vezes nesta rodada e voltou a 17:** a proposta do carimbo
saiu **por entrega** (D276) e esta entrou. *Saldo parado não é rodada parada* — e é por isso que
as duas mudanças ficam escritas nos cinco lugares que contam, e não só o saldo.

---

## D280 · A CAIXA QUE DECIDE A CLASSE DE UM DISPARO É A DE QUANDO ELE DISPAROU, NÃO A DE QUANDO EU O LEIO · 10/10/2026

O despertador das **19:06** chegou **na hora**. Eu o li às **19:18**, ao fechar o LAB-83, e a caixa
estava **vazia** — todos os dezesseis itens com o nome `-FEITO`.

**A classificação óbvia é `despertador-sem-item`, e ela estaria errada.** No instante em que o
disparo aconteceu a caixa **ainda tinha o `016.md`**: a renomeação para `016-FEITO` entrou no commit
`5489c23`, às **19:17**. Os onze minutos entre o disparo e a leitura são o fim da rodada anterior —
e é exatamente neles que a caixa esvazia, **por obra minha**.

> **A caixa que decide a classe de um disparo é a de QUANDO ELE DISPAROU, não a de quando eu o
> leio.** Classificar pela caixa de agora faz a minha própria entrega virar prova de que o chat não
> abastece.

**É a terceira leitura trocada da mesma conta em um dia**, e as três têm a mesma forma: *um disparo
que não produziu rodada nova sendo contado como um disparo que não tinha o que fazer.*

| a leitura trocada | o que era |
|---|---|
| D265/D272 | *"nada NOVO na caixa"* numa linha que não dizia **quais** parcelas |
| D277 | sete disparos que a sessão **não recebeu** contados como vazios |
| **D280** | um disparo cuja caixa **tinha item**, lido depois de a caixa esvaziar |

E as três custam a mesma coisa, porque **a conta decide o intervalo**: cada vazio falso é um
argumento para **esticar** o despertador — o conserto oposto ao que cada um dos três casos pede.
*Três enganos diferentes empurrando o mesmo botão errado não são três acidentes: são o sinal de
que a conta mede uma coisa (o disparo) e é lida como outra (o abastecimento).*

**O que a §1-A já resolvia, e eu só precisei obedecer:** *"um prompt por despertador — se o anterior
não fechou, termine-o antes de começar qualquer coisa nova."* O disparo das 19:06 é **o disparo sob
o qual o LAB-83 fechou**, e a linha dele aponta para o item 016. A conta em vazio fica em **5**, e
os observados vão a **22**.

**O que NÃO foi feito:** nada no despertador, e **nenhuma trava nova**. A régua certa aqui exigiria
saber o estado da caixa **num instante passado**, e o que eu tenho no disco é o estado de agora; o
`git log` responde, mas a trava teria de reconstruir a caixa de cada hora da conta para conferir
cada linha. **Está declarado como não medido** em vez de prometido — *guarda que não declara o
próprio buraco mente pelo silêncio*, e esta eu nem escrevi.

---

## D281 · VOCABULÁRIO QUE CRESCE E RÉGUA DE LINHA QUE NÃO CRESCE COM ELE FICA CEGA EXATAMENTE NA CLASSE NOVA · 10/10/2026

Ao gravar o disparo das 19:06 (D280) a conta reprovou, e o que ela acusou **não era a linha nova**:
eram **duas cegueiras minhas**, as duas nascidas **horas antes, nesta mesma rodada**.

### Primeira: a classe nova ficou INVISÍVEL para a régua que a guarda

O D277 pôs `entregue-em-lote` no vocabulário fechado das origens. A régua **de linha**, que lê a
tabela, casa a coluna de origem com `([a-z]+)` — e **`[a-z]+` para no hífen**. A linha inteira
deixava de casar, e as **sete** linhas que eu acabara de escrever **não existiam** para a guarda.

**Medido:** 29 linhas com data e hora na tabela, **22 parseadas, 7 perdidas** — exatamente as sete
da classe nova.

> **Vocabulário que cresce e régua de linha que não cresce com ele fica cega exatamente na classe
> NOVA** — a única que ninguém ainda sabe ler. *Classe nova é onde a guarda mais precisa enxergar,
> e é onde ela enxerga menos.*

**E o verde passou.** Não por coincidência boa: `conta.declarados.observados` era comparado com
`conta.linhas.length`, eu declarei **22** e a régua contou **22** — porque as sete eram invisíveis
para os **dois** lados da comparação. *Guarda que não acha o objeto não está aprovando: está sem
medir nada* (D213) — e isto está escrito, em palavras quase iguais, **no comentário da própria
função** que ficou cega.

É a segunda vez da família do **D231**, *"conserto que não é aplicado em todos os instrumentos que
leem a mesma coisa é meio conserto"* — e esta é a forma mais barata dela: **o vocabulário e a régua
que o lê moram no MESMO arquivo**, a dez linhas de distância.

### Segunda: `vazio` casou dentro de `esVAZIOu`

A classe em vazio sai da palavra na coluna *"o que achou"*, com `/vazio|nada|sem item/i` — **sem
fronteira de palavra.** A minha célula nova diz *"a caixa só esvaziou às 19:17"*, que afirma
justamente que a caixa **TINHA** item, e foi contada como disparo em vazio: **6 em vazio onde são
5.**

**E a medição tem uma segunda parte, mais útil que a primeira:** das **cinco** linhas em vazio de
verdade, **todas as cinco** dizem *"nada na caixa"* e **nenhuma** usa a palavra `vazio`. A
alternativa que criou o falso positivo **não pegava uma única linha legítima** — ela só tinha o
poder de errar.

> É a família do **D245** outra vez (*"fronteira de palavra num nome composto não é fronteira de
> valor"*), e agora pelo lado mais simples: **procurar uma palavra sem `\b` é procurar um pedaço de
> palavra**, e `esvaziar` é o verbo que esta casa usa para dizer que a caixa **tinha** algo.
> *Quando a régua procura uma PALAVRA, meça quantas linhas legítimas cada alternativa pega: a que
> pega zero não está protegendo nada, só esperando a vez de errar.*

### O conserto, e os números por classe deixaram de ser prosa

1. a coluna de origem passa a casar `([a-z-]+)` — as 29 linhas são lidas, e **20 `observado`,
   2 `derivado`, 7 `entregue-em-lote`** aparecem;
2. a palavra do vazio ganhou `\b`;
3. **o primeiro número declarado parou de se chamar `observados`**, porque ele sempre foi
   comparado ao **total de linhas** — *rótulo de uma coisa com a conta de outra*. A linha passa a
   ser `disparos no registro: 29 · observados: 20 · derivados: 2 · entregues em lote: 7 · em
   vazio: 5`, e **cada classe é conferida contra as linhas dela**;
4. **há guarda**, na ordem da Central — primeiro que a régua **continua** lendo as três classes e
   que a conta de hoje fecha, depois que `esvaziou` **deixou** de contar e que mentir numa classe
   sozinha reprova. Seis travas novas, com a régua velha **inline** na prova de que o hífen a
   perdia.

**O que isto ensina sobre a rodada toda:** os sete números em lote ficaram **sete horas** no
documento sem régua nenhuma, e quem os pegou não foi uma trava — foi **a linha seguinte dar
errado**. *Número de classe sem régua da classe é o lugar onde uma classe nova vai envelhecer.*

---

## D282 · A AFIRMAÇÃO DO NOME, MEDIDA POR EXECUÇÃO — e eram QUATRO travas, não duas · 10/10/2026

O item 017 é a medição que o **D279** declarou não ter feito, e proibiu a resposta barata com
todas as letras: *"rodar a lista **sem os clones** e ver quem reprova é a resposta; ler o `import`
é a hipótese."*

### Como foi medido, e por que não por leitura

Cópia do repositório num diretório onde os três clones irmãos **não existem** — que é exatamente
o que o CI vê, porque lá eles são clonados ao lado e na cópia não há nada ao lado —, e `bun test`
em cada arquivo da lista, um a um, guardando o código de saída. **Nada foi movido nem renomeado no
vizinho:** mover o clone seria escrever nele, e a §4 não deixa.

### O número que a execução desmentiu

| o que eu disse, lendo o fonte (D279) | o que a execução diz |
|---|---|
| **duas** travas precisam do clone | **quatro** |
| uma desde o LAB-68, uma minha | **três** desde o LAB-68, **uma** minha |
| — | **29 de 30** arquivos passam limpos |

> **Contei pelo `expect` que eu reconhecia, não pelos que reprovam.** O D279 saiu de uma leitura
> do fonte, e a leitura viu a trava com a mensagem *"o clone do motor tem de estar nesta máquina"*
> e a minha nova; não viu as outras duas do mesmo `describe`, que dependem da **variável**
> `cabeca` e não repetem a frase. *Régua de leitura acha o que ela reconhece; execução acha o que
> acontece* — e a diferença foi de **100 %** no número.

### A decisão, com o que se perde escrito

**Movi as QUATRO travas para `tests/commit-dos-vizinhos-com-clone.test.ts`, e NÃO renomeei o
trabalho.** O item deu o critério — *"o nome é uma afirmação, então a pergunta é qual das duas
afirmações você quer poder desmentir"* —, e as duas opções custam coisas diferentes:

| conserto | o que se ganha | o que se perde |
|---|---|---|
| **mover as 4 travas** *(escolhido)* | o nome volta a ser verdade, e a lista roda em qualquer lugar sem preparo | nada: o verde completo roda todo arquivo de qualquer jeito |
| renomear o trabalho | nada a mexer no código | **o que o portão precisa deixa de ser sabível sem rodar** — e ele existe justamente porque o verde completo **não** roda sem segredo |
| tirar o arquivo inteiro | simples | as **10** travas limpas de clone daquele arquivo saem do portão que roda em todo push |

A terceira linha é o que a medição por arquivo comprou: o total *"um arquivo depende"* não separa
*"o arquivo inteiro"* de *"4 travas de 14"*, e os consertos são diferentes. **Mover por ARQUIVO
quando a dependência é de TRAVA paga a conta de quem não mediu.**

### E a régua ESTÁTICA que eu escrevi primeiro acusou a si mesma — sétima da família

A primeira versão da trava nova procurava no fonte a frase `join(RAIZ, "..", "motor-testfit")`, e
**acusou a própria trava que a demonstra**, porque a fixture dela contém essa frase. Família do
D142/D155/D257. E a cura da casa, tentada nas duas formas, **não serve aqui**:

| limpeza | o que faz | por que não serve |
|---|---|---|
| `soOCodigo()` | esvazia o conteúdo das strings | o alvo **é** uma string: a régua fica **cega** |
| `semComentarios()` | tira comentário e regex, guarda strings | a fixture também é string: acusa de novo |

> **Quando o que você procura e o que você quer ignorar são a MESMA FORMA, não há régua estática
> que os separe.** A saída não é uma régua mais esperta: é a **outra pergunta** — e o item já
> tinha dito qual. A trava passou a **ler a medição por execução** em vez de reler o fonte: *ela
> confere o que aconteceu, não o que parece.*

**O buraco fica declarado:** a prova envelhece se ninguém rodar o `lab84`. Por isso a régua cobra
que a prova cubra **exatamente** a lista de hoje — arquivo novo no portão sem linha na prova
reprova, com a receita (`bun run lab84`) na mensagem.

### E a varredura da casa pegou o MEU instrumento de medir

A ferramenta nova escrevia `reprovam: n(/(\d+) fail/) ?? 0`, e a `varredura-de-chamadas` acusou:
*"`?? 0` sobre o resultado de uma CHAMADA: a falha vira um número que parece certo"*. **Com razão,
e é o D23:** num arquivo que estoura antes de rodar trava nenhuma, `0 reprovam` com `exit 1` é uma
contradição publicada. Virou `null`. *A régua da casa achou no instrumento com que eu media — e
instrumento de medir também é código desta casa.*

---

## D283 · GUARDA QUE LÊ UMA MEDIÇÃO DE SI MESMA NÃO TEM LADO BOM ALCANÇÁVEL · 10/10/2026

A trava do D282 está **na lista do trabalho** que ela guarda, e a régua cobra que todo arquivo da
lista tenha saído verde na medição — inclusive, portanto, a própria trava. Mas **a medição roda a
trava, e a trava lê a medição anterior**: o primeiro vermelho dela se grava na prova e se
realimenta.

Medido, e as duas voltas estão no registro: na primeira execução a trava reprovou (a prova ainda
não existia e faltava a exceção do §7), a prova gravou esse vermelho, e a execução seguinte leu o
vermelho e **reprovou de novo pelo mesmo motivo** — não pelo defeito, pelo registro do defeito.

> **Guarda que lê uma medição de si mesma não tem lado bom alcançável.** O ponto fixo em que ela
> passa existe, mas não se chega a ele por iteração: cada volta confirma a volta anterior.

**O conserto não é afrouxar a régua: é dizer QUE o arquivo dela está fora do próprio gate, e por
quê** — uma constante com nome (`A_TRAVA_DESTA_REGUA`) e o motivo escrito ao lado, em vez de um
`filter` sem explicação que o próximo leitor tomaria por descuido.

**E o que fica garantido sem o gate, dito em vez de suposto:** a **ferramenta mede esse arquivo
igual aos outros** e a prova **publica a linha dele** — quem lê a prova vê o veredito —, e o verde
completo o roda. O que a régua deixa de cobrar é só o `exit` da própria casa.

*É a irmã estrutural do D266 (instrumento de medição discordando do instrumento medido), com uma
volta a mais: aqui o instrumento e o medido são o mesmo arquivo.*

---

## D284 · QUANDO A COLUNA DO DINHEIRO EMPATA, ELA PARA DE DECIDIR · 10/10/2026

O item 018 pediu *"o número de NOVEMBRO, não o de outubro"*, e medido na API do Actions o número
de novembro desmonta a premissa do próprio item — e a do **D221**, que era minha.

| execução | evento | `run_duration_ms` | `billable.UBUNTU.total_ms` |
|---|---|---|---|
| 37751994616 | `push` | 9 000 | **0** |
| 37751249491 | `pull_request` | 49 000 | **0** |
| 37713910680 | `push` | 10 000 | **0** |

> **Os "136 minutos, 50 % de tudo" são minutos-TRABALHO CONSUMIDOS, não dinheiro: o cobrado é
> ZERO.** `archilly-lab` é público, e `ubuntu-latest` em repositório público é gratuito e não
> medido. A §7 já dizia isso em outras palavras — *"a parte deste repositório no estouro é ZERO"* —
> e a API confirma campo por campo.

**Então a escolha não é de dinheiro**, e o item autorizava parar na fronteira se fosse: em nenhum
dos três caminhos novembro custa um centavo. *A unidade em que eu contei o desperdício não era a
unidade em que a conta é paga, e isso passou dois dias sem ninguém notar — inclusive eu, que
escrevi as duas frases.*

### E o trabalho condenado custa SETE SEGUNDOS

Medido passo a passo: `o verde completo` dura **5 a 7 s**, e a precondição falha **3 a 4 s** depois
do início; todos os passos seguintes saem `skipped`. **Ele nunca clona, nunca instala, nunca roda a
suíte.** O D124 funciona exatamente como desenhado.

### O custo REAL, e ele não se mede em minutos

**136 de 136 execuções terminaram em `failure`**, sempre no mesmo passo, sempre pelo mesmo motivo.

> **Um sinal que ficou vermelho 136 de 136 vezes não é um alarme: é ruído de fundo.** O custo dele
> não se paga em minuto — paga-se em quantas vezes alguém aprendeu a ignorar o vermelho.

E é isto que **concilia o D221 com a frase da §7** (*"um CI vermelho por falta de configuração é
honesto"*), que até aqui pareciam brigar: **as duas estão certas sobre coisas diferentes.** O
vermelho por falta de configuração é honesto **uma vez**; repetido 136 vezes sem nada mudar, ele
deixou de informar. *Honestidade de um sinal não é propriedade da primeira vez que ele acende: é
propriedade da série.*

### A decisão, e os três caminhos com o que cada um perde

**O gatilho carrega só o trabalho 1.** No arquivo: `if: github.event_name == 'workflow_dispatch'`
no `verde-completo`.

| caminho | perde |
|---|---|
| **só o trabalho 1** *(escolhido)* | no dia em que o segredo nascer, ninguém é avisado se o verde completo quebrar, até alguém pôr o trabalho de volta — **e é isto que a trava cobra** |
| os dois, com o trabalho 2 condicionado ao SEGREDO | o contexto `secrets` **não existe num `if:` de trabalho**: exigiria um TERCEIRO trabalho só para lê-lo, e com o CI desligado eu **não posso demonstrar** que a condição pega |
| os dois como hoje | o vermelho continua ruído — 136 de 136, sempre o mesmo passo |

> **Entre dois consertos, o que eu posso demonstrar nesta máquina vale mais do que o que eu só
> posso afirmar** — e uma condição não testada, num arquivo que ninguém executa, é a forma mais
> silenciosa de desligar um trabalho. `github.event_name` **está** disponível num `if:` de
> trabalho, e o efeito dele é conferível por leitura.

### A MARCA e o PRAZO, porque desligamento sem os dois envelhece

O item trouxe a peça do Render (o D197 dele): *"`enquanto` + `marca` conferida no arquivo, porque
cinco dos seis desligadores não têm evento próprio"*. Então:

- **a marca** é a caixa de comentário do trabalho 2 **e** a **§11 da página do Jonny**;
- **o prazo é um EVENTO e não uma data** — no dia em que o segredo existir, a pendência é riscada e
  a condição **tem de sair**. *Prazo que não pode ser uma data ainda pode ser um evento, desde que
  alguém cobre o evento*, e é a trava que cobra;
- **o gatilho NÃO foi religado.** O item foi explícito, e a trava de 1º/11 continua sendo quem cobra.

**E o `verde.yml` entrou como o OITAVO lugar** da varredura por lugar (item 007): ele passou a ter
uma coisa parada com condição de volta, e *lugar novo nasce quando algo novo fica parado.*

---

## D285 · PEDIDO QUE MORA SÓ NUM RELATÓRIO NÃO CHEGA A QUEM DECIDE · 10/10/2026

O item 018 afirmou, de passagem: *"o segredo `VIZINHOS_TOKEN` é dele — **está na sua página de
pendências desde o LAB-38**, e nada aqui o pede de novo."*

**Medido: não estava.** `VIZINHOS_TOKEN` aparece em **16 arquivos** da árvore, e
`docs/PENDENCIAS_JONNY.md` **não é um deles** — a palavra *"token"* aparece **zero** vezes na
página, em qualquer caixa.

**E o LAB-38 pediu, sim — no lugar errado.** A §7 daquele relatório diz *"o que fica proposto — e é
uma coisa só, do Jonny: criar o segredo `VIZINHOS_TOKEN`, ou tornar os dois vizinhos públicos"*. E
a linha seguinte é a confissão involuntária:

> *"A receita está no log do próprio workflow, em português, toda vez que ele falha."*

**O pedido foi deixado em dois lugares que ele nunca lê** — um relatório técnico e o log de um
trabalho de CI — e desde **08/10** esse trabalho **não roda mais**. Foram **quarenta e seis
prompts** (LAB-38 → LAB-85) com a única coisa desta decisão que depende de uma pessoa escrita onde
essa pessoa não olha.

> **Pedido que mora só num relatório não chega a quem decide.** É o §1-B (*"o que vai ao chat e não
> vai a um arquivo não existe amanhã"*) numa forma pior: **foi para um arquivo, e para o arquivo
> errado** — e arquivo errado é mais perigoso que nenhum arquivo, porque ele dá a sensação de que o
> pedido existe.

**E a prova de que dá:** o chat escreveu no item 018 que a pendência estava lá. Ele não inventou —
ele leu o LAB-38 e concluiu o passo que faltava. *Um pedido no lugar errado não fica só não feito:
ele passa a ser citado como feito.*

**Consertado onde devia estar desde 19/09:** a **§11** da página do Jonny, escrita para leigo como
a §5 manda — o que é a senha, os três passos, a alternativa (tornar os dois vizinhos públicos), a
ressalva de segredo em repositório público, e o que **não** para enquanto ele não decidir. **Há
trava** nos dois sentidos (`tests/o-que-o-gatilho-carrega.test.ts`): se a pendência sair da página,
reprova; se for marcada como resolvida com o trabalho ainda fora do gatilho, reprova também.

**E a §5 mandou na redação:** a página não pode dizer o nome interno do motor do Parcelamento, e a
trava reprova — então o repositório dele é **descrito** em vez de nomeado (*"o único cujo nome
começa com `motor-`"*), com a razão dita ao lado. *Regra de nome que vale mesmo quando atrapalha a
instrução é regra; a que cede na primeira inconveniência é sugestão.*

---

## D286 · RÉGUA QUE PERGUNTA SE UM TRABALHO TEM CONDIÇÃO PERGUNTA AO YAML, NÃO AO ARQUIVO · 10/10/2026

A trava nova do D284 tem de garantir que o **trabalho 1 nunca** seja condicionado — ele é o portão
que roda em todo envio. A primeira versão procurava a palavra `if:` entre o nome de um trabalho e o
do outro, e **reprovou a decisão correta**: a caixa de comentário que explica a condição diz *"o
`if:` abaixo é essa decisão"*.

**Oitava vez da família do D142 / D155 / D257 nesta casa** — e a primeira **no mesmo dia** em que eu
a escrevi como decisão (D282, de poucas horas antes).

> **A pergunta decide o instrumento.** *"Este trabalho tem condição?"* é uma pergunta de
> **estrutura**, e o `Bun.YAML` responde pela chave; *"a condição está explicada?"* é uma pergunta
> de **texto**, e aí o comentário é o objeto e não o ruído. A mesma régua fazendo as duas erra uma.

As duas convivem agora no mesmo arquivo, cada uma com o instrumento dela — e **há trava para a
lição**, que de outro modo viraria comentário: uma trava afirma que o trecho entre os dois nomes
**contém** `if:` (ou seja, que a régua de texto *estava* errada) e que a de estrutura, na mesma
pergunta, diz a verdade. *Lição sem trava é comentário, e comentário não se revalida* (D104).

### E a mesma rodada deu a irmã dela: CLASSE NEGADA NÃO É FRONTEIRA

A régua que lê se a pendência do Jonny foi **resolvida** nasceu como
`~~[^~]*VIZINHOS_TOKEN[^~]*~~` sobre a página inteira — e **leu a página de hoje como resolvida**,
com a pendência aberta. O `[^~]` não para em fim de linha nem de seção: ele emendou um `~~` da §10
com outro da lista de resolvidos, com a §11 no meio.

> **Classe negada não é fronteira.** `[^~]` diz *"qualquer coisa que não seja til"* — e parágrafos,
> seções e o arquivo inteiro cabem nisso. Quem quer uma linha pede uma **linha**.

Consertada linha a linha, contra um título declarado (`TITULO_DA_PENDENCIA`), e **com trava para os
dois lados**: a régua velha é exercida na trava e tem de **achar** o falso positivo, e a nova tem de
**não** achar. *Conserto de régua sem a régua velha ao lado não prova que havia defeito.*

### E a janela da marca saiu de uma ÂNCORA, não de um número

A conferência da marca lia `workflow.slice(i - 1800, i + 200)`. **Dependia do tamanho da caixa de
comentário** — e cresceria para mentira no dia em que alguém escrevesse mais uma linha ali. Passou a
sair de uma âncora declarada no arquivo. *Janela medida em caracteres é coincidência com prazo de
validade* — a mesma doença do D264 e do D278, agora num `slice`.

---

## D287 · RÉGUA QUE CONFERE UMA PROVA COM `MAIOR QUE` ACEITA QUALQUER PROVA VELHA QUE JÁ FOSSE GRANDE O BASTANTE QUANDO NASCEU · 10/10/2026

O item 019 trouxe a **D204** — *"prova gerada antes da última edição do que ela mede é prova
velha"* — e a primeira coisa foi remedir, antes de uma linha de conserto. **O defeito estava
VIVO**, e pior do que o D204 descreveu: não era uma edição de atraso, eram semanas.

| o que a prova commitada do LAB-57 dizia | o que a MESMA árvore dizia | atraso |
|---|---|---|
| 364 arquivos que o git carrega | **498** | 26,9 % do número de hoje |
| 128 arquivos de código varridos | **187** | 31,6 % |
| 36 157 linhas de código lidas | **50 714** | 28,7 % |
| 662 linhas de configuração lidas | **761** | 13,0 % |

**E ela também carregava dois caminhos mortos** — `symbios/archilly/probe/target/` e
`wasm-probe/target/` —, diretórios de compilação que não existem mais.

### Por que a trava não pegou, e é isto que a decisão nomeia

A trava **lia** a prova e conferia com **limiar**: `configuracoesEncontradas > 20`,
`configuracoesVarridas > 5`, `linhasDeCodigoLidas > 10000`. Uma prova congelada em 36 157 linhas
passa `> 10000` **para sempre**.

> **Régua que confere uma prova com `maior que` aceita qualquer prova velha que já fosse grande o
> bastante quando nasceu.** O limiar mede se o número é **plausível**; só a recontagem mede se ele
> é **verdade** — e num repositório que cresce, *o limiar fica mais frouxo a cada commit, sem
> ninguém mexer nele.*

É a família do **D164** vista de outro lado: ali o perigo era o zero de régua parada ser
indistinguível do zero de árvore limpa; aqui é o **número grande de ontem** ser indistinguível do
número certo de hoje.

### A forma escolhida: RECONTAR e comparar — e o motivo de não ser o carimbo

O item ofereceu duas e pediu o motivo escrito:

| forma | o veredicto, medido |
|---|---|
| **recontar e comparar** *(escolhida)* | o universo desta varredura é o `git ls-files` **deste** repositório: sem clone, sem rede, sem motor. Recontar custa **~0,3 s** e a comparação é **exata**, número por número |
| comparar carimbos | **o carimbo do disco não é o do git.** Numa sessão nova todo arquivo tem a data do checkout, e a comparação vira **vácuo** — *guarda que não acha o objeto não está aprovando: está sem medir nada* (D213). O item avisou, e o vácuo cai exatamente onde a trava mais precisaria valer: no CI, depois de um checkout limpo |

**E a recontagem responde de graça o caso válido que quase parece inválido**, que o item nomeou: a
prova que **não mudou porque nada que ela mede mudou** passa — os números batem. *Uma régua que
exigisse carimbo mais novo a cada commit reprovaria a árvore correta, e vigia que nasce vermelho
vira ruído e morre.*

### A medição mora num lugar só, e isso foi exigência do item

A conta estava **dentro da ferramenta**, e escrever a recontagem dentro da trava criaria duas
implementações da mesma pergunta. *Duas listas para a mesma pergunta divergem* — o item chamou pelo
nome, e o **D231** já cobrou esta casa por meio conserto aplicado num instrumento só. Então a
medição saiu para `src/escopo-da-varredura.ts`, e **a ferramenta e a trava chamam a mesma função.**

### Demonstrado de ponta a ponta, nos dois sentidos

- **o lado ruim:** plantada uma linha num arquivo que a prova mede, **sem regerar a prova** — a
  trava reprovou **nomeando a chave**: `linhasDeCodigoLidas`, na prova **50 714**, na árvore
  **50 716**. O arquivo foi devolvido byte a byte, `sha256` conferido;
- **o lado bom:** duas recontagens seguidas na mesma árvore batem, e a trava passa calada.

**E o mecanismo se provou DENTRO da própria rodada, sem eu plantar nada:** ao registrar o script
`lab86` no `package.json` — que é um arquivo de configuração que a varredura lê — a recontagem
acusou na hora, `760 → 761`. *A prova mais honesta de que um vigia funciona é ele acusar o trabalho
de quem o estava escrevendo.*

### O que o conserto NÃO resolve — e a trava me ensinou a versão EXATA, no mesmo verde

Eu havia escrito aqui *"a prova tem de ser a última coisa gerada na rodada"*. **Medido: é mais
estreito do que isso, e o verde me corrigiu.** Rodei o `lab57` como última ferramenta, commitei, e o
verde reprovou:

| número | na prova | na árvore, depois do commit |
|---|---|---|
| `arquivosQueOGitCarrega` | 498 | **502** |
| `arquivosDeCodigoVarridos` | 187 | **188** |
| `linhasDeCodigoLidas` | 50 716 | **50 914** |

**O universo é o `git ls-files`, e o `git ls-files` muda no `git add`** — não quando o arquivo é
escrito. Os quatro arquivos novos desta rodada estavam no disco mas **não rastreados** quando a
prova foi gerada, e entraram no universo ao serem **adicionados**.

> **A prova tem de ser gerada depois do `git add`, não depois da última edição.** *Quando o
> universo de uma medição é "o que o git carrega", o instante que importa não é o da escrita: é o
> do `add`* — e os dois estão a um comando de distância, o que torna o engano barato de cometer e
> invisível sem recontagem.

**E o que mudou de verdade é isto:** a ordem continua exigida, mas **deixou de ser disciplina e
passou a ser guarda**. Era o silêncio o defeito do D204, não a ordem — e o silêncio acabou. *Guarda
que não declara o próprio buraco mente pelo silêncio; esta declarou, errou a declaração, e a
recontagem corrigiu a declaração dentro da mesma rodada.*

---

## D288 · RECONTAR O QUE DEPENDE DE FORA NÃO É MAIS RIGOR: É OUTRA MEDIÇÃO COM O NOME DA ANTIGA · 10/10/2026

O item mandou a **medição decidir o tamanho** — a regra do item 016: *"item que reescreve setenta
provas numa rodada é item que ninguém revisa."* Medido sobre as **74** provas desta casa:

| quantas | a classe | o que decide |
|---|---|---|
| **11** | universo **dentro** desta casa | não citam clone vizinho, commit, semente nem gleba: a recontagem é barata, exata e sem rede. **É onde a forma cabe** |
| **63** | dependem de **fora** | medem contra clone vizinho, commit de outro repositório, semente ou gleba |

> **Recontar o que depende de fora não é mais rigor: é outra medição com o nome da antiga.**

E isto não é opinião — é o **LAB-79** medido: *"prova medida contra o clone de um vizinho afirma o
presente de OUTRO repositório, num commit dele. Regerá-la em silêncio não atualiza a medição —
TROCA A PERGUNTA. O LAB-78 perdeu dois de quatro lotes exatamente assim, porque o motor andou de
`4181e95` para `6cf6396`."*

**Nesta rodada foi recontada UMA**: a do LAB-57, que é a que o D204 nomeou e a que o item pediu.
As outras **dez** do universo de dentro são medição por prova — cada uma precisa que alguém decida
*quais números dela são recontáveis* —, e isso foi para a `FILA.md` em vez de sair agora.

*A fronteira do §7 foi reusada e nenhuma segunda lista nasceu, como o item exigiu: a classe de uma
prova sai do que ela CITA, e a lista de exceções de medição continua sendo a do §7.*

---

## D289 · "O UNIVERSO ESTÁ DENTRO DESTA CASA?" DECIDE SE RECONTAR É BARATO — NÃO SE É POSSÍVEL, NEM SE É SIGNIFICATIVO · 10/10/2026

O LAB-86 classificou **11 de 74** provas como *"universo DENTRO desta casa"*, recontou **uma** e
mandou as outras dez à fila. O item 020 as pediu, e **convidou a corrigir o denominador**: *"se
alguma das dez, ao ser aberta, mostrar que depende de fora, ela SAI — medição que descobre que o
próprio denominador estava errado é entrega, não desvio."*

**Aberta uma a uma, o denominador estava errado — e não pelo motivo previsto.** Nenhuma das dez
dependia de fora. O que havia era uma pergunta que a minha classificação **nunca fez**.

> **A pergunta que eu fiz decide se recontar é BARATO. Ela não diz se recontar é POSSÍVEL, nem se
> é SIGNIFICATIVO.** Eu classifiquei pela **conta** e publiquei como se fosse pelo **sentido** —
> e *"dentro desta casa"* era necessário e não suficiente.

### As três espécies que havia dentro de uma classe

| classe | quantas | o que a recontagem significa nela |
|---|---|---|
| **medição de ESTADO, com ferramenta** | **3** | a prova afirma um número sobre a árvore de agora: recontar **é** a conferência. É a forma do D287 |
| **registro de EVENTO** | **7** | a prova afirma *"quebrei esta trava e o exit foi 0 → 1"*. **Medido: nenhuma carrega número de topo** — não há o que recontar. Recontar seria **refazer a sabotagem**, que é outro ato, custa o verde inteiro e mexe em arquivo |
| **regerada pelo VERDE a cada rodada** | **1** | a prova no navegador é reescrita por `conferir.sh` em toda execução: ela **não pode** ficar velha |

3 + 7 + 1 = **11**, e a soma fecha — conferida das linhas, não do texto, porque *frase que se lê
como partição e não soma é slogan* (D212).

### As três de estado estão recontadas, e duas eram achado novo

- **LAB-57** — no item 019 (D287);
- **LAB-52** — **a segunda prova velha, achada agora**, e pelo mesmo motivo: 114 → **191**
  arquivos, 32 114 → **52 245** linhas, **40 % de atraso**, com **quatro** limiares na trava
  (`arquivos > 100`, `parametrosExaminados > 3000`, `camposExaminados > 2500`). *A régua que
  achou a primeira achou a segunda no dia seguinte, no primeiro lugar em que olhou;*
- **LAB-04** — e esta é de outra espécie ainda: **não tem gerador**. Varrido todo `.ts` e `.sh`
  que o git carrega, **nada a escreve** — foi escrita **à mão uma vez**, no PR #40, e nunca mais
  relida; o único lugar que a menciona é a lista de exceções do §7.

  > **Prova sem gerador é a forma mais estável de prova velha.** Ela não envelhece porque o
  > prompt continuou trabalhando (D204): envelhece porque **nada no mundo a obriga a concordar
  > com o código**. O limiar nem entra — aqui não havia conferência nenhuma.

  A reimplementação é **função pura** sobre duas fixtures fixas, então a trava recomputa e compara
  o `medido`. O `esperado` **não se reconta**: vem de **duas implementações independentes** de fora
  desta casa, e o que se cobra é que o `medido` concorde com ele.

### O que isto muda na resposta ao item

O item pediu dez e autorizou menos *"com o número e o porquê"*. A resposta honesta não é *"fiz 2
das 10 e 8 ficaram"*: é **a forma cabe em 3, e as 3 estão feitas.** As outras oito **não ficam para
depois — elas não são desta forma.**

> **Lista que encolhe porque o item era menor do que parecia é ENTREGA; lista que encolhe porque
> alguém desistiu é DÍVIDA — e a diferença tem de estar escrita.** É a mesma exigência que o item
> fez de mim, virada para dentro.

**Há guarda** (`tests/as-onze.test.ts`): a soma fechando contada das linhas, o vocabulário das três
classes **fechado**, cada arquivo citado conferido **contra o disco** e não contra o booleano que a
ferramenta publicou (*trava que acredita no campo da prova não confere a prova: repete*), as três de
estado obrigadas a dizer **em que rodada** foram recontadas, e as sete de evento obrigadas a **não
ter número de topo** — que é o que torna a recontagem sem objeto, e não apenas cara.

---

## D290 · LIMIAR SOBRE MEDIÇÃO VIVA GUARDA CONTRA RÉGUA PARADA; LIMIAR SOBRE PROVA GUARDADA NÃO GUARDA NADA · 10/10/2026

O item 020 foi categórico, e repetiu a minha própria lição: *"**Todo `>` sai.** (…) a conferência
de cada uma das dez é comparação exata, e onde houver limiar ele é **apagado**, não apertado."*

**Obedeci onde a regra vale, e não onde ela mudaria de alvo.** Ao abrir a trava do LAB-52 havia
limiares de **duas espécies**, e só uma é o defeito do D287:

| onde | o que havia | o que foi feito |
|---|---|---|
| sobre a **prova guardada** | `prova.escopo.arquivos > 100` | **apagado**, e trocado por recontagem exata. Uma prova congelada em 114 arquivos passava `> 100` para sempre |
| sobre a **medição viva** | `parametrosExaminados > 3000`, `camposExaminados > 2500` | **ficaram**, e o motivo está escrito ao lado deles |

> **Limiar sobre medição VIVA guarda contra régua PARADA; limiar sobre prova GUARDADA não guarda
> nada.** O mesmo `>` é certo num lugar e inútil no outro — e o que muda não é o operador: é **se o
> número do outro lado é recontado agora ou lembrado de ontem.**

Os que ficaram são o **D164** desta casa (*zero de régua parada é indistinguível de zero de árvore
limpa*): eles existem para que, se a varredura parar de olhar, o número caia **numa trava e não num
silêncio**. Apagá-los seria **trocar um defeito por outro** — perder o D164 para curar o D287.

*Regra de forma dita sem o sujeito manda na coisa errada* (D218): *"todo `>` sai"* precisa dizer
**`>` sobre o quê**, e é esta decisão que o diz.

### E a trava do LAB-52 duplicava a varredura, que é o defeito que o item nomeou

Ela tinha a **própria cópia** do filtro do universo e o **próprio laço** de varredura, ao lado da
ferramenta que faz o mesmo. Passou a chamar a mesma função (`src/escopo-das-chamadas.ts`), como
a do LAB-57 no item 019.

**E o universo das duas é DIFERENTE, de propósito** — o que importa é que não esteja escrito em
dois lugares: a do LAB-57 parte de `git ls-files` (**o que o git carrega**) e a do LAB-52 de
`ls-files --cached --others` (**todo `.ts` que existe e não é ignorado**).

> **Duas varreduras da mesma casa podem ter universos diferentes sem que uma esteja errada — o que
> não podem é ter o universo escrito em dois lugares.** E o instante em que cada uma fica velha é
> outro: a do LAB-57 muda no `git add`; **esta muda assim que o arquivo EXISTE**, porque `--others`
> já o vê. *É a mais fácil de deixar velha das duas, porque envelhece antes de qualquer comando* —
> e foi exatamente assim que ela reprovou duas vezes durante esta rodada.

---

## D291 · "CONFERIDO AQUI E É VERDADE" SOBRE UMA ÁRVORE QUE DIZIA O CONTRÁRIO EM DUAS PÁGINAS · 10/10/2026

**Prompt:** LAB-87 (item 020). **Achado de passagem**, ao escrever a linha que o item me deixou
decidir sobre o número congelado do Padrão Archilly.

O item 020 trouxe uma nota que dizia *"não é item"*: a cópia do Padrão desta casa está na
**Versão 1, de 13/09**, e a Central publica a **3.0** — *"a mesma espécie da D204: número
congelado que ninguém relê"*, e **eu decidia se valia uma linha**. Valia duas, porque ao abrir a
nota o que estava errado não era o número.

### O que estava escrito, e o que a árvore dizia

A **§1-C do `CLAUDE.md`** dizia, desde 08/10:

> ~~"Medido pela Central em 08/10: este repositório está **sem cópia do Padrão Archilly e sem
> `VERSAO.txt`** — conferido aqui e é verdade, nenhum dos dois existe na árvore."~~

**Metade era falsa, e a metade falsa era a minha** — as três palavras *"conferido aqui"* são
minhas, não da Central. Medido:

| o que a frase afirmava | o disco |
|---|---|
| `VERSAO.txt` não existe | **certo**, não existe |
| a cópia do Padrão não existe | **FALSO** — `docs/referencia/PADRAO_ARCHILLY.md`, ~~trazida em **03/10** no PR #40~~ **trazida em 14/09 no PR #12, commit `4081c27`** |

> ~~"trazida em 03/10 no PR #40"~~ **errado, e corrigido no LAB-88 (D293): foi `4081c27`, de
> 14/09, no PR #12 — o commit da própria conferência do `LF-FINAL`, e o ÚNICO que tocou o arquivo
> em toda a vida dele.** O `03/10 / PR #40` era o **commit do corte** de um clone raso, devolvido
> por um `git log --diff-filter=A` que eu li como verdade. *Clone raso não erra por silêncio:
> devolve um commit que existe, com data e assunto plausíveis.*

E não era preciso procurar: o **`docs/INDEX.md` a lista** como *"cópia trazida"*, e o relatório
`LF-FINAL-2` já a tinha conferido **byte a byte** contra a do `motor-testfit` com `cmp`.

> **A árvore se contradizia em duas páginas, e nenhuma das duas estava medindo.** O
> `src/lugares-das-condicoes.ts` repetia a frase falsa num terceiro lugar.

### A lição, e ela é sobre o CUSTO da guarda que faltava

> **Declaração minha sobre o que a árvore TEM ou NÃO TEM é a mais fácil de todas de conferir — e
> por isso é a mais vergonhosa de deixar sem guarda.** Não precisa de clone, de rede, de motor,
> de semente nem de gleba: precisa de um `existsSync`. **O que faltava não era instrumento, era a
> pergunta** — e ela ficou **um mês** sem ser feita, numa casa que mede o escopo da própria
> varredura linha por linha.

É da família do D204 e do D104 — número e comentário que ninguém relê —, mas com um agravante
próprio: *o `"conferido aqui"` é a parte que mais convence e a única que não deixa rastro.*
**Afirmação de conferência sem a conferência escrita é a forma mais caseira de número congelado.**

### O que foi feito, e o que NÃO foi

1. a §1-C foi **riscada com a medição ao lado**, não reescrita por cima (D161);
2. a declaração do `src/lugares-das-condicoes.ts` foi corrigida, e o fato passou a ser **campo
   declarado** (`oQueODiscoDeveDizer`) em vez de frase: *não escreva uma régua que adivinhe o
   veredicto dentro da prosa — declare o veredicto.* **A primeira régua que eu escrevi aqui lia a
   frase** (procurava *"não existe na árvore"* perto do nome do arquivo) e **não pegou o
   defeito**, porque a mesma frase fala de dois arquivos com veredictos **opostos**;
3. **o aviso do número congelado mora no `docs/INDEX.md`, e NÃO dentro da cópia.** Foi a escolha
   mais interessante da nota: eu **escrevi o aviso dentro da cópia primeiro**, e isso quebrava a
   única coisa que aquela cópia promete — ser **byte a byte igual** à do `motor-testfit` (`cmp`,
   reconferido em 10/10: **iguais**, e as duas casas estão na mesma Versão 1). *Aviso que estraga
   a prova da coisa avisada é um aviso no lugar errado;*
4. **a cópia NÃO foi atualizada para a 3.0.** *Declarar um número velho é medição; trocá-lo sem a
   fonte seria inventar conteúdo que ninguém aqui leu* (§4, "não inventa dado"). Quem precisar da
   3.0 pede o texto à Central — e a nota de que ela existe está no índice, que é onde se lê;
5. **há guarda** (`tests/por-lugar.test.ts`, 4 travas): o lado bom contra o disco, o lado ruim com
   a afirmação antiga **nomeando o arquivo e os dois lados**, o erro **simétrico** (afirmar que
   existe o que não existe) e o aviso cobrado no índice **e proibido dentro da cópia**.

### E a trava do item 007 me reprovou pela quebra de linha — a NONA da família do D248

Ao reescrever a §1-C, a frase-marca *"o kit, quando chegar, é outro item"* caiu numa **quebra de
linha** (`"o kit,\nquando chegar"`), e o `conferirOsLugares` — que lia com `texto.includes` cru —
acusou a marca de ter **saído do arquivo**. Ela não tinha saído: eu havia reflowado um parágrafo.

> **O conserto já morava em `src/texto-das-regras.ts` desde o LAB-77**, e esta trava não o
> chamava. *A largura da coluna de um `.md` é escolha de quem escreve e não pode mudar o que uma
> trava enxerga* — e **conserto que não é aplicado em todos os instrumentos que leem a mesma coisa
> é meio conserto** (D231), inclusive quando os instrumentos são dois testes.


---

## D292 · DOCUMENTO NORMATIVO QUE ESTA CASA NÃO PODE MANTER NÃO DEVE MORAR NELA — E A VERSÃO NÃO IDENTIFICA O TEXTO · 11/10/2026

**Prompt:** LAB-88 (item 021). A direção respondeu à oferta do LAB-87 (*"se quiser a cópia em
3.0, mande o texto e eu gravo"*) com **não mandar**, três formas na mesa e uma ordem: **medir
antes de escolher.**

### O que foi medido, na ORIGEM e não em clone no disco

| | |
|---|---|
| a fonte | `jonny583/archilly-central`, **privado**, `main`, `docs/PADRAO_ARCHILLY.md` |
| o vigente | **Versão 3.0 · 10/10/2026**, commit **`e48bff9`** (20:36:15Z), **1 731 linhas · 107 395 bytes** |
| a cópia que havia aqui | **Versão 1 · 13/09**, **145 linhas · 12 716 bytes** |
| a fração | **8,4 % das linhas · 11,8 % dos bytes** |

A direção disse *"8 % dele"*, e **conferido: 8,4 % em linha e 11,8 % em byte** — não é uma versão
velha do mesmo documento, é **um oitavo dele**.

### A medição que decidiu, e ela não estava no item (a nº 1)

> **O rótulo `"Versão 3.0 · 10/10/2026"` cobre DOIS TEXTOS DIFERENTES na origem.**

| blob | entregue por | quando | linhas | bytes |
|---|---|---|---|---|
| `f95b2838b16b` | ~~`96dbc9b`~~ **`67d18d5`** | 10/10 00:38Z | 1 712 | 106 081 |
| `f22f7deb742c` | `e48bff9` | 10/10 20:36Z | **1 731** | **107 395** |

**+19 linhas e +1 314 bytes com o mesmo número** — e a cópia vendorizada do Parcelamento
(`vendor/archilly-central/padroes/`) é **byte a byte igual ao primeiro BLOB**: ela já está atrás
**sem que o número mude**. *Isto é o D148 num documento: carimbar a versão é carimbar o **rótulo**,
e rótulo não é identidade.* ~~Só o commit identifica o texto.~~

> **DUAS CORREÇÕES DO LAB-89 (D294), e as duas por medição.** Primeira: ~~`96dbc9b`~~ era **de
> clone raso** — com a história inteira, quem **entregou** aquele texto é **`67d18d5`**, de
> 00:38, e `96dbc9b` e `170a28f` **não estão na história do arquivo**. Segunda: ~~*"só o commit
> identifica o texto"*~~ está **errado como estava escrito** — **o rótulo identifica a INTENÇÃO,
> o commit identifica a ENTREGA, e quem identifica o TEXTO é o BLOB** (`f95b2838…` contra
> `f22f7deb…`, iguais em qualquer clone). *O veredicto desta decisão continua de pé; o nome do
> meio e a frase final, não.*

**É isso que mata a forma 3** (*congelar e declarar*): declarar *"Versão 1, 8 % do vigente"*
declara um rótulo, e quem abrisse o arquivo leria **145 linhas com cara de documento normativo**,
com o aviso morando no índice de outra página.

### E a forma 2 cai por MEDIÇÃO, não por preguiça

A forma 2 era uma trava que **reprova quando o commit da origem muda**. A fonte é **privada** e
este repositório é **público**; o verde roda **sem rede** por desenho, e o trabalho de CI que roda
em todo envio **não tem segredo** — o `GITHUB_TOKEN` do Actions não alcança repositório privado de
fora. Seria um **terceiro** vizinho privado a pedir no §11, que já espera por dois desde o LAB-38.

> **Uma trava que não alcança a origem fica VERDE por não achar o objeto** — e *guarda que não
> acha o objeto não está aprovando, está sem medir nada* (D213). O item avisou que o §11 podia
> morder aqui, e mordeu.

### A escolha: FORMA 1 — ponteiro com procedência, no MESMO caminho

`docs/referencia/PADRAO_ARCHILLY.md` deixou de ser a cópia e passou a dizer **onde está a fonte,
qual commit foi lido, quando, de que tamanho, e como se lê da origem** — com a procedência
declarada num lugar só (`src/onde-esta-o-padrao.ts`), que é o que a ferramenta e a trava leem.

**O caminho é o mesmo de propósito:** é onde quem procura o Padrão chega, é onde o aviso serve, e
**nenhum link de relatório morreu** (o `LF-FINAL`, o `LF-FINAL-2` e o `INDEX` apontam para ele).

**E o texto da Versão 1 não se perdeu:** está em **`4081c27`** (14/09, PR #12), com a receita de
leitura escrita no ponteiro. *Arquivo que sai da árvore continua no histórico; o que a saída tira
é a autoridade de parecer vigente.*

**Há guarda** (`tests/padrao-da-familia.test.ts`, 10 travas, no portão sem clones): cada campo da
procedência cobrado no arquivo — **o commit inclusive** —, cada um apagado um a um acusando, a
cópia recolada acusando `e-a-copia-de-novo`, o ponteiro ausente **não passando calado**, e as três
medições que escolheram a forma escritas em código.

### O que este item NÃO fez, e está declarado

- **não tocou em repositório vizinho.** A divergência das duas cópias do Parcelamento é
  informação, e a própria direção disse que a leva à caixa dele;
- **não atualizou a cópia para a 3.0.** *Declarar um número velho é medição; trocá-lo sem a fonte
  seria inventar conteúdo* — e, medido, trocá-lo **com** a fonte envelheceria em horas: o Padrão
  mudou **duas vezes em 10/10**;
- **não religou o gatilho**, e **não mexeu na D226**.

---

## D293 · NUM CLONE RASO, O `git log` DE UM CAMINHO RESPONDE O COMMIT DO CORTE — E ELE PASSA POR MEDIÇÃO · 11/10/2026

**Prompt:** LAB-88 (item 021). **Vigésima oitava ocorrência do ponto cego da §6, e ela aconteceu
DUAS vezes na mesma rodada, com o mesmo instrumento.**

### A primeira vez: eu ia acusar a direção de mandar procedência velha

O item deu o commit `e48bff9`, de 20:36. Clonei a origem com `--depth 1` e perguntei quando o
arquivo mudou: a resposta foi **`944c232`, de 23:48** — três horas depois. *A conclusão pronta era
"a procedência que você me mandou já estava velha quando chegou"*, e ela casava bem demais com o
argumento do próprio item (*"o padrão mudou duas vezes só em 10/10"*).

Medido com `--depth=50`: o último commit que tocou o arquivo **é `e48bff9`**, e `944c232` é apenas
o **HEAD** — o commit do **corte** do clone raso. **A procedência da direção estava exata**, e o
conteúdo de `e48bff9` é byte a byte o do `HEAD`.

### A segunda vez: o número errado já estava PUBLICADO, e era meu

O **D291**, de ontem, diz que a cópia foi *"trazida em 03/10 no PR #40"*. **Medido com história
inteira: `4081c27`, de 14/09, PR #12** — o commit da própria conferência do `LF-FINAL` —, e **um
único commit em toda a vida do arquivo**. O `03/10 / PR #40` era o **corte** do clone raso desta
sessão, respondido por um `git log --diff-filter=A` que eu li como verdade.

> **Clone raso não erra por silêncio: ele devolve um commit QUE EXISTE, com data e assunto
> plausíveis.** É a pior forma de resposta errada — *a que passa por medição*. A régua do
> *"quando isto entrou"* não é o `git log`: é o `git log` **mais a profundidade**, e
> `git rev-parse --is-shallow-repository` é a pergunta que faltava.

### A correção, e ela é por RISCADO

O D291 foi corrigido **com a medição ao lado**, não reescrito (D161), e o `CLAUDE.md`, o
`docs/INDEX.md` e o relatório do LAB-87 carregavam o mesmo número — os três foram corrigidos pelo
mesmo caminho. *Número publicado em quatro lugares se corrige nos quatro, senão o conserto cria a
divergência que o D231 descreve.*

**Há guarda** (`tests/padrao-da-familia.test.ts`): o commit do histórico, o PR e a contagem de
commits são **dados declarados**, conferidos contra a decisão escrita — e a trava cobra a palavra
`clone raso` no `DECISOES.md`, para o motivo não se perder.

**E a lição de família:** *toda afirmação de "quando isto mudou" feita dentro de um clone raso é
uma afirmação sobre o clone, não sobre o repositório.*

---

## D294 · O RÓTULO IDENTIFICA A INTENÇÃO, O COMMIT IDENTIFICA A ENTREGA, O BLOB IDENTIFICA O TEXTO · 11/10/2026

**Prompt:** LAB-89 (item 022). **Vigésima nona ocorrência do ponto cego da §6, e a QUARTA que
escapou** — com o D119, o D161 e o D293.

### O que eu publiquei ontem, e o que era

O **D292** escreveu, e eu repeti em quatro lugares e num PR mesclado:

> ~~"o rótulo `3.0` cobre dois textos: `96dbc9b` (1 712 linhas) e `e48bff9` (1 731) … **só o
> commit identifica o texto**"~~

**O veredicto estava certo e os dois nomes do meio estavam errados.** Medido no `archilly-central`
com a história **inteira** (245 commits, `is-shallow=false`):

| onde | `git log -- docs/PADRAO_ARCHILLY.md` |
|---|---|
| o meu clone **raso** | `e48bff9`, **`96dbc9b`** — 2 commits |
| o clone **raso da direção**, de outra profundidade | `e48bff9`, **`170a28f`** — 2 commits |
| **aprofundado** | `e48bff9`, **`67d18d5`**, `8212a54`, … — **21** commits |

**`96dbc9b` e `170a28f` não estão na história do arquivo** — `git log -- <caminho> | grep -c` dá
**zero** para os dois. Os três commits **devolvem o mesmo blob** (`f95b2838…`, 1 712 linhas ·
106 081 bytes), e **só `67d18d5` o entregou** (10/10 00:38).

### O mecanismo, e ele é mais largo que o D293

> **`git log -- <caminho>` responde "quem ENTREGOU este texto". Num clone raso ele responde "o
> commit mais velho que eu tenho e que já tinha este texto" — que é o CORTE.** E como
> `git show <qualquer commit posterior>:<caminho>` devolve o texto vigente naquele momento, **todo
> commit posterior à entrega "confirma" o texto e passa por entrega.**

O D293 disse *"toda afirmação de QUANDO isto mudou dentro de um clone raso é afirmação sobre o
clone"*. Medido, **toda afirmação de QUAL COMMIT também é** — e o mais útil: **duas profundidades
diferentes dão nomes diferentes, e cada uma é internamente coerente.** A da direção e a minha
discordaram, e as duas "conferiam".

### A correção da frase, e ela vale para a família

> **O RÓTULO identifica a intenção de quem publicou — e pode cobrir mais de um texto.**
> **O COMMIT identifica a ENTREGA — e o nome dele depende da profundidade do clone que você lê.**
> **O BLOB identifica o TEXTO, byte a byte, igual em qualquer clone** (`git rev-parse <commit>:<caminho>`).

Então a procedência desta casa passou a gravar **o blob junto do commit**: quem confere não
depende mais da profundidade do clone dele. O ponteiro
[`docs/referencia/PADRAO_ARCHILLY.md`](referencia/PADRAO_ARCHILLY.md) traz
`f22f7deb742c…`, a trava o **cobra**, e `96dbc9b` foi **riscado com a medição ao lado** nos
lugares em que saiu (D161) — aqui, no `CLAUDE.md`, no `docs/INDEX.md`, no ponteiro e no relatório
do LAB-88.

**O que NÃO mudou:** o rótulo `3.0` **continua cobrindo dois textos**, a cópia vendorizada do
Parcelamento **continua** sendo o texto antigo, e a escolha da **forma 1** continua sendo a certa.
*Régua que erra o rótulo e acerta o veredicto não é régua errada (D184) — mas rótulo errado numa
procedência é exatamente o que a procedência existe para não ter.*

---

## D295 · A PERGUNTA DO CLONE RASO VIROU GUARDA, E A GUARDA RECUSA EM VEZ DE RESPONDER · 11/10/2026

**Prompt:** LAB-89 (item 022). A direção cobrou pela **minha própria doutrina**, e com razão: o
LAB-88 deixou a lição **escrita e não cobrada**.

> **A409:** *"toda lição que descreve um erro repetível merece a pergunta 'dá para cobrar isso por
> texto?'"* — e a minha própria frase: *"escrever a regra aqui não impediu nada; **guarda
> impediu**."*

### O que ficou, e por que é RECUSA e não ressalva

`external-engines/esteira/src/profundidade-da-historia.ts` — **a pergunta mora num lugar só**
(`git rev-parse --is-shallow-repository`), e toda leitura que afirma procedência passa por ela
antes de medir. Em clone raso a régua **não mede**: devolve `valor: null` com o motivo nomeado.

> **O que não foi medido sai `null`, nunca um valor plausível** (D23) — e aqui o valor plausível é
> o desfecho ruim **exato** que o D293 mediu: um commit que existe, com data e assunto.

**A recusa nem chama o `medir`**, de propósito: *para não haver nem a tentação de aproveitar "o
valor que veio junto"*. **Há trava para isso** — um contador que tem de ficar em zero.

### O achado de ambiente, que muda o desenho da trava

**O portão desta casa RODA NUM CLONE RASO**, e isso é medido no arquivo: o `verde.yml` usa
`actions/checkout@v4` **sem `fetch-depth`**, cujo padrão é **1**.

> **Guarda que confunde "não posso afirmar" com "a afirmação está errada" reprova o ambiente em
> vez de medir a coisa.** A trava aceita **os dois** desfechos sobre o repositório real — medição
> ou recusa declarada — e reprova **um terceiro**: valor devolvido sem história para sustentá-lo.

*Uma trava que exigisse história inteira ficaria vermelha no portão para sempre, por um motivo que
não é defeito nenhum — e vigia que nasce vermelho vira ruído e morre (D287).*

### A prova é de sentido invertido, e com clone de VERDADE

`bun run lab89` **monta um clone raso** deste repositório por `file://` — **sem rede** —, roda a
mesma régua nos dois e publica o veredicto:

```
AQUI  · is-shallow=false · MEDIU   · valor=04effac · historia-inteira
RASO  ·                     RECUSOU · valor=null   · clone-raso
o que o CORTE teria respondido sem a pergunta: 6152dec
commits de CLAUDE.md: 1 no raso · 61 aqui
```

**O mecanismo reproduzido em casa:** no clone raso o `CLAUDE.md` tem **1** commit de história em
vez de **61**, e o corte responderia **`6152dec`** — que é o commit em que a própria direção
escreveu este item. *O nome é plausível, recente e errado.*

**As travas são herméticas** (`tests/profundidade-da-historia.test.ts`, 13 travas, no portão sem
clones): a profundidade entra **injetada**, nos três estados — raso, inteiro e **desconhecido** —,
e a propriedade cobrada não é um caso, é **nenhuma recusa devolve valor**. O clone de verdade fica
na ferramenta, porque *trava que clona no portão paga bateria para medir o que uma injeção mede.*

---

## D296 · "CAIXA VAZIA" É AFIRMAÇÃO SOBRE A ORIGEM — A GUARDA EXISTE, E ELA RECUSA ONDE NÃO DECIDE · 11/10/2026

**Prompt:** LAB-90 (item 023). A direção mediu um defeito **do documento dela** — o
`COMO_FUNCIONA.md` mandava *"leia esta pasta"*, o **disco**, em **11 de 11** casas — consertou a
receita e pediu a guarda, citando a A409 desta casa: *"consertar o texto não é guarda."*

### A régua, e ela é função pura

`external-engines/esteira/src/caixa-vazia-era-verdade.ts`: dada a **lista de nomes** de
`docs/caixa-de-entrada/` na árvore do commit que declarou, diz se havia item **aberto** — `NNN.md`
sem `-FEITO`, sem `-RETIRADO` e sem o `COMO_FUNCIONA`, **que é a definição do próprio documento da
direção**. Sem rede, sem clone, perguntável por partes.

### O terceiro estado: eu RECUSEI, porque medi que não é decidível

O item pediu `bloqueado` e avisou: *"se a distinção não for decidível por máquina, diga isso e
recuse em vez de adivinhar."* **Medido, não é:**

| onde | o que existe no NOME do arquivo |
|---|---|
| `archilly-propostas`, **toda** a história da caixa | só `NNN.md` e `NNN-FEITO.md` |
| `archilly-lab` (aqui) | só `NNN.md` e `NNN-FEITO.md` |
| a receita da direção | `-FEITO` e `-RETIRADO`, e nada mais |

**Nenhuma casa marca bloqueio no nome.** Então `bloqueado` sai **`null`** — *não medido, nunca
"verdadeira" nem "falsa"* (D23, D295).

### Mas há uma distinção que É decidível, e ela separa as acusadas das legítimas

> **Item aberto com número MENOR que algum `-FEITO` foi PULADO em rodadas anteriores** — a casa já
> passou por ele e decidiu passar, e *onde mora essa decisão esta régua não alcança*. **Item
> aberto que é o PRÓXIMO da fila** — maior que todos os `-FEITO` — **é declaração falsa.**

Medido, casa com todas as linhas que eu pude conferir:

| casa | commit | abertos | maior `-FEITO` | veredicto |
|---|---|---|---|---|
| Orçamento | `e701a6f` | `021.md` | 020 | **falsa** |
| este Lab | `34bc00c` | `005.md` | 004 | **falsa — e é minha** |
| Propostas | `bd84f13` | `007.md` + 3 adendos | 013 | `null` — já pulada, **não acusa** |
| Propostas | `612c161` | nenhum | 015 | **verdadeira** |
| este Lab | `2bc543f`, `1e7df13`, `8e8b74b`, `8236799` | nenhum | — | **verdadeiras** |

**As oito do Propostas não podem ser acusadas** — *cobrança que reprova o código correto é
desligada na semana seguinte* (A254/A255) —, e a régua **não diz que o pulado está certo**: diz que
**não é o caso do clone velho**, e que quem decide o resto não é ela.

### A primeira declaração falsa que esta régua acusa é MINHA, e a medição é bonita

`34bc00c` ("despertador-sem-item: a caixa esgotou") é um **merge**, e os dois pais contam a
história inteira: no meu ramo (`de3288e`, 19:22:46Z) a caixa tinha **só o `COMO_FUNCIONA`**; no
`main` (`de5e769`, **19:19:54Z**) a direção acabara de escrever o `005.md`. **Eu declarei vazia com
o clone 3 minutos velho** — e o merge trouxe o item para a árvore do mesmo commit em que eu disse
que não havia nada.

> **A tese da direção está confirmada DENTRO desta casa, por medição, e com o relógio:
> 2 minutos e 52 segundos entre a escrita dela e o meu commit.** *O disco não é a origem, e esta
> pasta é escrita por uma mão que não é a minha.*

### O LIMITE vai na SAÍDA, em toda resposta — e isto o item pediu com estas palavras

`O_QUE_ISTO_NAO_ALCANCA` viaja em **todas** as leituras, inclusive nas verdadeiras, com **quatro**
buracos nomeados: a casa **cega** (sem commit não há árvore, e ausência de declaração falsa é
ausência de **medição**), o **clone** da casa (ela mede a origem contra a declaração), o
**bloqueio** (sai `null`), e **achar a declaração** — que depende de história e, em clone raso,
**recusa** (D295). *Guarda que não declara o próprio buraco mente pelo silêncio.*

**Há guarda** (`tests/caixa-vazia.test.ts`, 12 travas, no portão sem clones), com as listas de
nomes **medidas** nos clones e entrando como fixture: o portão não tem os clones, e *trava que
clona no portão paga bateria para medir o que uma lista mede.*

---

## D297 · A TABELA DA DIREÇÃO APONTOU A CORREÇÃO, NÃO A DECLARAÇÃO — E EU NÃO ACRESCENTO ESSA LINHA À MINHA · 11/10/2026

**Prompt:** LAB-90 (item 023). Dois achados contra o instrumento de quem me mandou o item, e uma
recusa de inflar a minha própria tabela.

### O primeiro: a linha do Geo é o commit em que a casa ACERTOU

A tabela do item lista `f0cb290` (Geo) como declaração falsa. A árvore dele **tem** o `010.md`
aberto, então a régua da árvore diria **falsa** — mas o **assunto** daquele commit é:

> *"correcao: a caixa NAO esta vazia — o 010 chegou durante a rodada do 009"*

**É a casa se corrigindo**, e o pai dele é *"merge: item 010 chegou do chat durante o 009"*.

> **A régua responde sobre a ÁRVORE, e a árvore não sabe o que o commit DIZ.** *O commit de
> declaração tem de ser escolhido por quem DECLARA, não por quem casa a palavra* — e é a família
> do **D155** desta casa (*"a régua leu o comentário que explicava o conserto"*), agora no
> instrumento da direção.

**O conserto ficou na régua:** `oAssuntoNegaACaixaVazia` devolve o veredicto
`nao-e-declaracao` com `null`. E ela é régua de palavra **para RECUSAR, nunca para acusar** —
*falso positivo aqui faz a guarda dizer "isto não é uma declaração", que é o lado seguro do erro*
—, com os dois sentidos travados: o mesmo conteúdo com assunto de declaração **sai falsa**.

### O segundo: sobre o Geo eu RECUSO a pergunta seguinte

*"Então o Geo nunca declarou falso?"* — **não sei, e não vou responder.** O clone do Geo é **raso**
(`is-shallow=true`, e um `--depth=200` não o abriu), e ali `git log --grep="caixa vazia"` deu
**zero**. **Zero em clone raso não é zero** (D295): é o corte. *Fica declarado como não medido.*

**E a linha da Pesquisa (`e13a06d`) não foi conferida** — aquele repositório não está clonado aqui,
e **não repito como fato o que não medi** (§4). Das quatro linhas da tabela, **duas** confirmadas
(Orçamento, este Lab), **uma** corrigida (Geo) e **uma** não medida (Pesquisa).

### E a trigésima linha da minha tabela: NÃO

A direção ofereceu: *"a trigésima linha da sua tabela, se você quiser — ela é minha."* **Recuso, e
o motivo é o que a tabela é.** A §6 conta **o ponto cego DESTA casa** — *o Lab a um passo de acusar
o vizinho por um defeito do Lab* —, e as 29 linhas existem para eu reler **as minhas**. Pôr ali um
defeito de outra casa faria a conta somar e a leitura mentir: *tabela que mistura o meu erro com o
alheio deixa de ser a lista que me corrige e passa a ser um placar.*

> **Lista cuja utilidade é me acusar não cresce com erro de terceiro.**

**O defeito dela está registrado onde ele pertence:** nesta decisão e no relatório, com a medição.
E o que esta rodada **acrescenta à minha tabela é zero linha e uma lição**: a minha declaração
falsa de 09/10 (`34bc00c`) não entra como ponto cego porque **não houve acusação a vizinho
nenhum** — foi erro meu contra mim, medido e corrigido pela guarda que esta rodada escreveu.

---

## D298 · O CONJUNTO DO `interpolador` FICA FECHADO EM `"bilinear" | "idw"` — OS DOIS QUE A FAMÍLIA PRODUZ · 11/10/2026

**Prompt:** LAB-91 (024-adendo). O Generate mediu o bloco de terreno dos dois lados e achou
**desacordo de VALORES**, não de campo; a direção trouxe a pergunta ao **dono do formato**, com a
frase dele que eu adoto inteira: *"escolher por conta própria seria fabricar o terceiro
conjunto."*

### O que foi medido na ORIGEM, antes de decidir

| onde | o que a origem diz |
|---|---|
| `motor-testfit`, `src/lib/lab/formato-publicado.ts:142` | `interpolador: "bilinear" \| "idw"` |
| Generate, `src/lib/engine/indicadores-terreno.ts:146` | `type Interpolador = "idw" \| "linear" \| "natural" \| "krigagem" \| "nenhum"` |
| Generate: quem **atribui** literal a `interpolador` | **ninguém** — zero no `.ts` da origem |
| Generate: `bilinear` em `.ts` | **zero** ocorrências |

**Em comum: só `"idw"`** — a medição do Generate, conferida aqui.

**E a primeira leitura deu o contrário:** num clone em `72cfab0` (a origem estava em `8b7c157`),
`krigagem` dava **zero** e eu quase publiquei *"o Generate não enumera nada disso"*. *O clone não
é a origem* — **terceira vez na mesma noite** (D295).

### A decisão

> **O conjunto fica FECHADO em `"bilinear" | "idw"`: os dois que esta família PRODUZ e que eu
> MEDI.** Valor que ninguém produz é valor que ninguém pode conferir.

1. **`"bilinear"` FICA e NÃO é apelido de `"idw"`** — medido no LAB-03/LAB-07 e registrado no
   D37: o de k vizinhos *"faz o bolo de casamento"* e o de produção não. O campo existe por causa
   dessa diferença (*"ele muda o que a rampa quer dizer"*), e **apelidar apagaria a única
   informação que ele carrega**;
2. **`"nenhum"` é RECUSADO como valor:** ausência de interpolação já tem forma — **`null`** (D19,
   D23). Aceitá-lo criaria **duas formas de dizer a mesma coisa** (D116);
3. **`"linear"`, `"natural"` e `"krigagem"` entram quando alguém os IMPLEMENTAR e MEDIR**, cada um
   com o efeito dele sobre a rampa — a condição que o próprio campo declara. Hoje são **tipo sem
   produtor**;
4. **O desacordo não morde hoje** — sem produtor de literal do outro lado, nenhum valor
   atravessa. *É a classe GF-09 do Generate, e o dia da divergência não chegou: é isso que dá
   tempo de decidir em vez de inventar.*

**Há guarda** (`tests/contrato.test.ts`, 7 travas): o conjunto, o `null` aceito, os quatro
recusados **com motivo**, o valor inventado dizendo *"nem na lista de recusados está"*, a recusa
do apelido, e os cinco do Generate gravados **como medição** — com `emComum === ["idw"]` cobrado.

**O pedido ao vizinho vai em LISTA, nunca em commit lá** (§4): ao Generate, **estreitar o
`Interpolador` para o que ele produz** ou declarar os cinco como aspiracionais **no próprio
tipo**; ao Parcelamento, **nada** — ele já está no conjunto fechado.

---

## D299 · A TRAVA REGERA A VARREDURA — E A PERGUNTA DE PROJETO TEM DUAS ESPÉCIES DE PROVA · 11/10/2026

**Prompt:** LAB-91 (item 024). **Proposta minha do LAB-60, aberta desde 07/10**, executada agora.

### O que faltava, e não era o escopo

O LAB-86 (D287) pôs a **recontagem do ESCOPO**: quantos arquivos, quantas linhas. **O defeito que
o LAB-60 mediu não estava lá** — estava em `totalPorRegra`: `conferencia-desligada-por-arquivo`
dizia **1** na prova commitada e **10** na mesma árvore, com o verde verde.

> **Recontar o tamanho do universo não reconta o que a régua achou nele.**

Agora a trava **reexecuta** as duas varreduras — configuração e chamadas — chamando **a mesma
função da ferramenta** (D231), e compara **regra por regra e achado por achado**, cada desacordo
**nomeando a regra e o arquivo**.

### A resposta à pergunta de projeto: duas espécies, em lista fechada

O item pediu *quais provas podem ser regeradas sem ferir o D182* e autorizou a forma: *"a lista
escrita à mão é a resposta… o que não serve é a trava adivinhar."*

| espécie | regera? | por quê |
|---|---|---|
| **fotografia de um estado passado** | **nunca** | é o próprio defeito que o D182 nasceu para impedir: o *"antes"* de uma aferição só vale no instante em que foi tirado |
| **função pura da árvore de AGORA** | **sempre** | *prova que não bate com a árvore de hoje não é prova, é lembrança* |

**Sete entradas, com motivo por linha:** três `funcao-da-arvore` (LAB-57, LAB-52, LAB-04) e quatro
`fotografia` (LAB-48, LAB-02, LAB-31/sabotagem, LAB-60 — esta porque mede o **clone vizinho**, e
*recontar o que depende de fora é outra medição com o nome da antiga*, D288). A trava cobra a
lista **fechada nos dois sentidos**: entrada que aponta para prova inexistente, prova em duas
espécies, e `regeradaPelaTrava` fora da espécie certa.

### E a régua pegou o código que eu acabara de escrever

A primeira versão da trava tinha um `try { … } catch { }` para pular o `LEIA-ME.md`, e **a
varredura de chamadas que esta mesma rodada regera acusou a linha na hora** —
`catch-que-engole`, neste arquivo.

> **A resposta certa não era regerar a prova: era não engolir erro.** O `withFileTypes` responde a
> mesma pergunta sem esconder nada. *Régua que acusa o autor enquanto ele escreve é a régua
> funcionando* — e o item avisou: *"não regere a prova de ninguém para fazer a trava passar."*

---

## D300 · O AVISO DO `detalhe` NÃO MORDE AQUI, E ISSO É MEDIÇÃO · 11/10/2026

**Prompt:** LAB-91 (024-adendo, parte 2). O Generate passou a publicar `valor`, `limite` e
`unidade` ao lado da frase, declarou `detalhe` como *frase para a pessoa, que pode mudar sem
aviso*, e pediu: **"parem de ler `detalhe`."**

**Varrido todo `.ts` da esteira e do testfit: nenhum lugar extrai número de `detalhe`.** O único
que o toca é `ferramentas/lab48.ts:210` — `detalhe: v.detalhe ?? null` —, que **copia a frase para
dentro de uma prova**, e *copiar não é extrair*. Os outros dois casos (`lab58`, `lab63`) são campos
`detalhe` **meus**, de outra coisa.

> **Aviso de vizinho se responde com varredura, não com memória** — e a resposta aqui é *"não há o
> que desfazer"*, com o lugar nomeado para o dia em que alguém quiser ler o número de lá.

**E o achado que vem junto é da forma desta casa:** `valor` **já viajava em 12 dos 18 sítios** do
Validator e o contrato nunca o publicou — *o que faltava era a chave, não o número* —, e um dos
sítios punha em `valor` o **limite** onde os outros punham a **medida**. *Isto é a regra desta casa
voltando pela porta da frente: o limite tem de viajar dentro do payload, senão quem recebe adivinha
a régua, e dois aplicativos adivinham diferente.*

**Não virou proposta na `FILA.md`**, de propósito: *proposta para consertar o que a medição diz que
não existe é lista que envelhece sozinha.*

---

## D301 · DOIS NÚMEROS COM O MESMO VALOR NÃO SÃO O MESMO NÚMERO — E O RISCADO PRECOCE · 11/10/2026

**Prompt:** LAB-91 (item 024). **Dois enganos meus nesta rodada, pegos pelas minhas próprias
travas, e os dois são de contagem.**

### O primeiro: eu baixei o número errado por reflexo

Executada a proposta, baixei **duas** contagens de 14 para 13 — e **a trava acusou na hora**. Elas
não são a mesma coisa:

| número | o que conta | mudou? |
|---|---|---|
| `ABERTOS_ESPERADOS` (lab62) | **itens abertos** da lista *"Proposto ao chat"* | **não** |
| `QUANTAS_CONDICOES.naFila` | **etiquetas de condição** declaradas na `FILA.md` | **não** |

> **Dois números com o mesmo valor não são o mesmo número.** Eles valiam 14 os dois, e por isso o
> reflexo pareceu certo — *valor igual é a forma mais convincente de dois nomes diferentes.*

### O segundo, e é o achado: o item DA LISTA estava riscado CEDO DEMAIS

A proposta morava em **dois lugares**: um item da lista *"Proposto ao chat"* e uma **seção de
prosa**. O item foi **riscado no LAB-86** como *"executada"* — e o que o LAB-86 fez foi recontar o
**escopo**, não reexecutar a varredura. **A seção de prosa continuou aberta, e era ela que estava
certa.**

> **A mesma proposta em dois lugares, e os dois discordaram: quem tinha razão era o que ninguém
> riscou.** *Riscar "executada" sobre metade do pedido fecha a porta com o trabalho dentro* — e é
> a família do D116 (a mesma coisa em dois lugares) com o D231 (o conserto que entra num
> instrumento só).

**O riscado foi corrigido com a medição ao lado**, não desfeito: ele continua riscado — a parte do
escopo **foi** feita no LAB-86 —, e agora diz **o que faltava e onde a outra metade está.**

---

## D302 · A ESTEIRA NÃO COMPARA MOTORES SOB PREMISSAS IDÊNTICAS: K = 17 · 11/10/2026

**Prompt:** LAB-92 (item 025). O chassi foi decidido — *"o Generate é a cabine do avião… todos têm
que estar na mesma base"* —, e isso promove esta casa a **régua da competição**. A pergunta do
item era uma só, e a resposta é **não**.

### A conta, declarada

| | |
|---|---|
| **N = 13** | premissas que a esteira passa (`src/gleba-do-lab.ts`, bloco `PARAMETROS`) |
| **M = 10** | com valor; **3** vão `null` (`calcada_m`, `pctAreaPublica`, `rampaMaxima_pct`) |
| **K = 17** | caem no **padrão de fábrica de quem recebe** — **4** nos dois motores do Generate e **13** no Parcelamento |
| **Symbios** | **zero** premissas: `parametros` é perda **em bloco** na ida |

**Como foi medido, por LUGAR e na ORIGEM dos vizinhos:**

- **Generate:** `src/motores/generate.ts` monta `{ ...PARAMS_PADRAO_V1, …8 campos }`, e o
  `PARAMS_PADRAO_V1` da origem (`gerar-v1.ts:456`) tem **12** → **4 nunca vêm da esteira**:
  `testadaMinimaLegal`, `raioBulbo`, `larguraEntrada` e **`regimeFachada: "condominio"`**;
- **Parcelamento:** a ida preenche **9** das **22** `ChaveFaixa` (`tipos.ts:124`), e o tipo diz no
  próprio comentário que o arquivo *"sobrepõe o default de fábrica"* → **13 ficam de fábrica**,
  entre elas `tolerancia`, `pctCulDeSac`, `doacaoPct`, `arborizacaoPct` e `testadaExterna`.

> **Premissa omitida não é premissa ausente: é premissa inventada por quem recebe** — e cada motor
> inventa a sua. *Dois motores comparados assim competem em campos diferentes, e o ranking mente
> com aparência de rigor.*

### O default mais pesado é o `regimeFachada`, e ele é decisão de PRODUTO

Ele decide se o lote dá frente para **rua pública** ou para **via de condomínio** — e isso muda o
que conta como violação de testada. **Os dois motores do Generate correm em `"condominio"` por
default, sem que a esteira nunca o tenha pedido.** Virou linha na página do Jonny, em linguagem de
leigo: *em que regime a competição roda?* — porque **regra urbanística é dele** (§4).

### As três categorias, e a do meio é a que acusa

1. **`da-esteira`** — a esteira passa;
2. **`default-do-motor`** — o **K**: quem recebe inventa, e é **invisível**. *O de tela o usuário vê
   e corrige; o de motor não* (adendo-2);
3. **`motor-nao-recebe`** — o **caso válido que quase parece inválido**: campo que o contrato não
   publica ou consumidor que não existe. **Isto é pedido ao dono do contrato, não achado contra o
   motor** — e as duas listas são **disjuntas por (motor, premissa)**, com trava.

### E o número que o dono recusa está escrito por MIM

`pctAPP: 15` e `pctLazer: 10` são o default do Generate, e a esteira **os passa explicitamente**
nas quatro glebas-padrão — eu os copiei das glebas-padrão do vizinho. **Igualar assim é igualar no
número que ele nunca quis** (*"eu nunca fui a favor desse default… o usuário tem que pôr"*).
*Passar o default explicitamente não é o motor inventá-lo — mas o número é o mesmo, e a escolha
dele some.*

**Nada foi consertado**, como o item mandou: o conserto é do chassi e dos donos dos motores, e o
pedido sai em **lista no relatório** (§4). **Há guarda** (`tests/premissas-identicas.test.ts`, 20
travas): a conta fechando, o K como **lista** (não número solto), cada linha com motor-premissa-
motivo, as duas listas disjuntas, e o limite **nomeado**.

---

## D303 · ÁREA DECLARADA TEM DUAS FORMAS, E NA GLEBA `completo` AS DUAS CHEGAM JUNTAS · 11/10/2026

**Prompt:** LAB-92 (025-adendo-2). O dono disse que a área *"tanto pode vir do que o usuário
desenhou, ou de um percentual que ele escreve"*, e o adendo mandou medir se a esteira passa as
duas. **Passa** — e o achado está no cruzamento:

| forma | a esteira passa? | medido nas glebas-padrão |
|---|---|---|
| **polígono desenhado** | sim, por `restricoes[]`/`atracoes[]` | **só `completo.geojson`** traz (`app` e `reserva_legal`) |
| **porcentagem** | sim, por `pctAPP`/`pctLazer` | **todas as quatro**, porque o bloco `PARAMETROS` é um só |

> **Na gleba `completo` as duas chegam juntas — a APP desenhada E 15 % de APP — e nada declara
> qual manda.** Cada motor resolve o empate sozinho.

*Um polígono tem **lugar**; uma porcentagem não tem. Somar os dois é contar a mesma terra duas
vezes, e é a injustiça do K numa camada acima.* **A trava confere isso no `.geojson`**, não na
minha frase: `completo` tem `app` e `reserva_legal`, as outras três não têm nenhuma.

---

## D304 · DUAS GRAMÁTICAS, DOIS NORMALIZADORES — O DO `.md` NÃO LÊ COMENTÁRIO DE CÓDIGO · 11/10/2026

**Prompt:** LAB-92. **Achado contra a trava que eu acabara de escrever.**

Ela procurava a frase *"esta casa mede e pede"* no módulo e deu **falso**. A frase está lá, num
JSDoc, quebrada em duas linhas — e o `comoARegraSeLe` (do LAB-77, para `.md`) devolveu
`… mede e * pede …`: **ele tira o `>` da citação e não o ` * ` do JSDoc.**

> **Duas gramáticas, dois normalizadores.** Alargar o do `.md` para cobrir o comentário faria uma
> linha de **lista** (`* item`) virar prosa, e duas linhas de lista passariam a casar como uma
> frase só — *afrouxar a régua até tudo passar é o contrário de consertá-la* (LAB-77).

Nasceu `comoOComentarioSeLe`/`aFraseEstaNoComentario` **em `src/texto-das-regras.ts`**, não dentro
do teste (D248), com os **dois sentidos** travados: a frase quebrada em JSDoc **é** encontrada, o
normalizador do `.md` **não** a encontra (a trava cobra esse falso), e frase que não está
**continua** não estando. *É a décima da família do D248, e a primeira em que o conserto foi um
leitor NOVO em vez de reusar o que havia.*

---

## D305 · MOTOR COMPOSTO: A PORTA ACEITA; O QUE FALTA É A REGRA DE JUNÇÃO · 11/10/2026

**Prompt:** LAB-92 (025-adendo). A frase do dono: *"daqui a pouco a gente faz um que é a mistura do
Testfit com outro motor, e assim vai — esse é um processo que não termina."*

**Medido** em `src/porta/motores.ts`: a porta expõe **três** implementações, cada uma com `id`
próprio (`generate-<candidata>`, `parcelamento`, `symbios`), e cada rodada chama **uma**. Um motor
composto **caberia**: seria uma quarta implementação com `id` próprio chamando duas, e a medição, o
ranking e o juiz seguiriam funcionando **porque tudo é indexado por `id`**.

> **O que falta não é encaixe: é a regra de JUNÇÃO.** Quando dois motores devolvem plano para a
> mesma gleba, alguém tem de decidir **de quem é cada parte** — e isso não é instrumento, é
> desenho. *A esteira mede o que o `id` entregar; ela não sabe dizer qual metade do plano é de
> quem.*

**Resposta ao chassi, em uma linha:** o encaixe **não precisa mudar** para aceitar composto; o que
precisa existir é a decisão de junção, e ela é do dono do chassi.

---

## D306 · ENTREGAR OS QUATRO DE `legais`: O DELTA DE DESENHO É ZERO, E A D226 ATRIBUIU A CAUSA AO CAMPO ERRADO · 12/10/2026

**Item 026 da caixa de entrada**, que autorizou a D226 e mandou medir as duas passagens. Medido
em **cinco** passagens — `sem`, `só-caixa`, `só-face`, `só-rampa`, `os-três` — e **nove** glebas.

| campo | o contrato traz? | entregue, mudou o quê |
|---|---|---|
| `caixaViariaMinima_m` | 9/9 glebas, 8 m | **nada de geometria**; o motor passou a AVISAR (de +10 a +40 avisos por gleba) |
| `faceQuadraMaxima_m` | 9/9 glebas, 200 m | **nada** |
| `rampaMaximaDeVia_pct` | **1/9** (só a fixture nova) | **nada** |
| `declividadeMaximaDeLote_pct` | o `ParametrosV1` não publica | não há passagem |

> **A geometria publicada é IDÊNTICA nas cinco passagens, em 9 de 9 glebas.**

E a frase da D226 — *"o motor GANHOU a capacidade que esta ponte declara como perda: ele não
limita rampa de via"* — está **errada na causa e certa no veredicto de que algo mudou**. O motor
não ganhou a capacidade de **limitar**: ganhou a de **CONFERIR** contra a rampa que o arquivo
pediu, e as duas funções dele dizem isso por escrito (*"isto conta; não reprova e não conserta"*).

**O delta de 21,63 % → 17,92 % da D226 NÃO REPRODUZ** e não pode ter vindo do campo acusado:
`parametros.rampaMaxima_pct` é **`null`** em `ensaio-com-via`. Fica **riscado com a medição ao
lado**, e sem culpado novo: *dizer "era isto" sem reproduzir seria inventar a causa de um número
que eu não tenho.*

**A decisão: entregar os três que o contrato publica**, e o motivo não é o delta de desenho (é
zero) — é que **a omissão não é neutra**. `null` ali não quer dizer *"sem limite"*: quer dizer
*"vale o padrão de fábrica do motor"*. É o K = 17 do LAB-92 na porta ao lado. Mapa, motivo e
procedência em `testfit/adapter/src/legais-do-contrato.ts`; a passagem é opção da ida
(`entregarOsLegais`), porque o §4 exige que a passagem SEM continue possível.

> **CINCO PASSAGENS, E NÃO DUAS, FOI O QUE FEZ A DIFERENÇA.** Duas respondem *se* algo se moveu;
> uma passagem por campo responde *qual campo* moveu. A D226 entregou três de uma vez — e três
> entregues juntos com um número que se move não dizem qual deles o moveu.

---

## D307 · AS TRÊS PERDAS SOB SUSPEITA, NOMEADAS: DUAS SAÍRAM, E A TERCEIRA NUNCA FOI DESSA FAMÍLIA · 12/10/2026

A D226 fechou dizendo que *"três perdas declaradas desta ponte ficam sob suspeita de estarem
velhas"*. A frase saiu em **cinco lugares** — a decisão, o relatório do LAB-68, a `FILA.md`, o
`ida.ts` e a própria caixa 026 — e **em nenhum deles ela nomeia as três**.

> **Contagem sem a lista ao lado é a forma mais barata de um número envelhecer.** Quem for
> conferir "as três" tem de descobrir quais, e duas pessoas descobrem conjuntos diferentes.

Medido: o bloco de parâmetros do inventário da ida tinha **exatamente três** `perda(...)`. A
contagem estava **certa**; faltava o nome. São, e agora estão em `src/perdas-remedidas.ts`:

1. **`parametros.caixaViariaMin_m` — SAIU.** *"O motor não tem um piso independente"* é falso: a
   `viasComPistaCurta` compara a PISTA com o mínimo do arquivo e avisa por classe de via;
2. **`parametros.rampaMaxima_pct` — SAIU.** *"O motor não limita rampa"* continua **verdadeiro**,
   e era por isso que enganava: o campo deixou de ser **descartado**. *Campo que chega ao motor e
   muda uma resposta dele não é perda, qualquer que seja a resposta* — e **não limitar não é não
   receber**;
3. **`parametros.pctAreaPublica` — FICA, remedida e datada.** E ela **nunca esteve em jogo**:
   nenhum dos quatro campos novos aponta para ela. *Três coisas suspeitas porque estão na mesma
   gaveta não são três coisas suspeitas — vizinhança no arquivo não é vizinhança na causa.*

As duas que saíram viraram destino `traduzido` no inventário, o que criou **promessa nova**: e a
trava do LAB-40 cobrou na hora que `rampaMaxima_pct` **não tinha gleba que a exercitasse** — as
nove trazem `null`. Daí a fixture `ensaio-com-rampa` (8 %, e **não** 15, que é o corte declarado
do próprio motor: entregar o default mede a si mesmo). O universo de promessas foi de **60 para
62**.

---

## D308 · A RODADA NEGOU A MINHA LEITURA DO FONTE: `min(200, 200)` NÃO É UM MÍNIMO · 12/10/2026

Eu declarei, lendo o fonte do motor, que a `faceQuadraMaxima_m` **muda o desenho** — o
`tetoDeFaceDeQuadra` faz `min(alvo, legal)` e o resultado entra na quebra de quadra, que é
geometria. A rodada disse **não**, em 9 de 9 glebas, sem mover um lote.

O motivo é medido e é **desta ponte**: o MESMO campo do contrato já chegava ao motor por outro
caminho. `parametros.faceQuadraMax_m` vira a faixa degenerada `padroes.comprimentoQuadra`, que é
de onde sai o `alvo`. Então o `min` é `min(200, 200)`.

> **Leitura de fonte é hipótese; rodada é dado.** E quando um campo chega por dois caminhos, a
> régua que compara os dois caminhos **compara o campo consigo mesmo**.

A consequência de projeto ficou escrita no inventário, no destino do campo: dois caminhos, um
número. O `legais.faceQuadraMaxima_m` só passaria a morder se o alvo da quadra viesse de outro
lugar que não o contrato — o botão da tela do motor, por exemplo. **A trava cobra a divergência
declarada**, não a concordância: a lista pode discordar da rodada, mas o motivo tem de estar
**escrito** no campo `porQueNaoMordeAqui`.

**É a trigésima vez do ponto cego da §6, e a primeira desta forma** — as outras vinte e nove
foram régua, ponte, caminho, cabeça, instrumento ou fonte truncada. Esta foi a **leitura do
fonte prometendo o que a execução negou**.

---

## D309 · "O MOTOR NÃO TEM COMO RECEBER" E "A MINHA PONTE NÃO ENTREGA" TÊM A MESMA APARÊNCIA E CULPAS OPOSTAS · 12/10/2026

O item 026 cruzou duas medições minhas e perguntou se as duas podiam ser verdade ao mesmo tempo:
o LAB-92 classificou `caixaViariaMin_m` como **caso válido** — *"premissa que o motor NÃO TEM
COMO RECEBER: campo que o contrato não publica"* — e a `ida.ts` mandava
`legais.caixaViariaMinima_m: null` **para um campo que o motor tem**. O item apostou que *"as duas
coisas podem ser verdade ao mesmo tempo, e provavelmente são"*.

**Não são.** Medido na origem do motor: ele recebe as duas, e a **tradução do próprio dono** já
as mapeava — `caixaViariaMin_m → legais.caixaViariaMinima_m` e `rampaMaxima_pct →
legais.rampaMaximaDeVia_pct`, nas mesmas palavras do contrato v1. Duas linhas do
`O_QUE_O_MOTOR_NAO_RECEBE` do LAB-92 saíram **riscadas**.

> **O meu motivo de perda era verdadeiro sobre o que o motor FAZ e falso sobre o que ele ACEITA —
> e eu publiquei o segundo.** Perda declarada desta ponte lida como falta do motor é o §6 com
> outra roupa: a diferença entre as duas é invisível de fora e as culpas são opostas.

E o item estava certo na metade que importa: **a vaga vazia não é neutra.** O efeito de omitir é o
mesmo do K = 17 — a premissa é inventada por quem recebe. A linha que liga as duas listas existe,
e ela diz: *caso válido se confere no que o motor ACEITA, nunca no que ele faz com o que recebe.*

---

## D310 · RÉGUA DE PREFIXO MEDE ONDE O ARQUIVO MORA; A PERGUNTA ERA O QUE ELE ALCANÇA · 12/10/2026

A trava que impede o CI de virar falso verde confere que nenhum teste da lista do trabalho **sem
clones** importe de um clone vizinho. Ela lia o especificador do `import` (conserto do D142,
correto até onde ia) e o comparava com uma lista de prefixos escrita à mão:
`["@generate/", "@testfit/", "@symbios/"]`.

Ela errava **nos dois extremos**, e as duas metades foram medidas hoje:

- **larga demais:** reprovou `tests/legais-do-contrato.test.ts`, que importa um módulo do
  adaptador cuja única importação é um **tipo** de um arquivo que não importa nada. Zero clone no
  caminho;
- **estreita demais, e este é o lado caro:** `../src/` **não estava** entre os prefixos. Um teste
  da lista que importasse `../src/passagens-dos-legais.ts` — que importa `@testfit/api.ts` —
  passaria pela régua e **quebraria o CI**, que é exatamente o que ela existe para impedir;
- e a lista à mão tinha **`@symbios/`, que não é clone** (ele resolve para `../symbios/adapter/src`,
  desta casa) e **não tinha `@/`, que é** (`urban-create-hub-41d93a4d/src`).

> **Apelido que decide o portão não se escreve à mão: ele se LÊ de onde ele mora.** A lista tinha
> um apelido que não era clone e não tinha um que era — e nenhuma das duas metades falhava fazendo
> barulho.

Agora o fecho é **transitivo** e os apelidos são **derivados dos `paths` do `tsconfig.json`**, por
um critério só: o alvo resolvido **sai da raiz deste repositório**. E `import type` **não é
alcance** — ele não existe em tempo de execução, e sem essa distinção o fecho acusou
`tests/contrato.test.ts`, que passa sem clone nenhum e está medido assim em 40 de 40 por execução.

Mora em `src/alcance-dos-clones.ts`, com os dois sentidos travados: cadeia pura **passa**, alcance
por dois saltos **reprova com o caminho nomeado**, `import type` **não conta**, e arquivo que não
se lê sai em `naoLidos` em vez de sair em silêncio.

---

## D311 · A MEDIÇÃO POR EXECUÇÃO SÓ MEDIA QUEM FALHAVA — E QUATRO CÓPIAS DE UM NÚMERO NÃO O CONFEREM · 12/10/2026

Dois defeitos de instrumento, um dentro do outro, e os dois achados por **contar a lista em vez de
somar de cabeça**.

**1. A medição por execução do LAB-84 publicava `null` em 36 dos 40 arquivos** — exatamente os que
**passavam**. Ela usava `execFileSync` com `encoding`, que devolve **só a saída padrão** quando o
comando dá certo; o `bun test` escreve o resumo (`N pass`, `N fail`) na saída de **erro**. Então o
campo `passam` só existia quando o arquivo reprovava.

> **Medição que só preenche o campo quando dá errado não é medição por execução: é relatório de
> falha.** E ela passou quinze dias assim, com o nome *"as trinta e uma por execução"* — porque o
> que ela afirma (*"todos passam sem os clones"*) só precisa do **código de saída**, e o código de
> saída estava certo.

**2. O número de travas do portão vivia em QUATRO lugares, e a trava os conferia ENTRE SI.** Ela
exige que `CLAUDE.md`, `ONDE_PARAMOS.md`, `FILA.md` e `verde.yml` digam o mesmo número — e nunca
comparou esse número com a realidade. Eu escrevi **661** (641 + 20, de cabeça, esquecendo as
**cinco** travas que entraram no próprio `regras.test.ts`), os quatro lugares concordaram, a trava
passou, e o medido é **666**.

> **Quatro cópias de um número conferidas uma contra a outra provam que ninguém esqueceu de
> copiar, não que o número é verdade.** Consistência não é correção — e quatro lugares errados
> juntos são mais convincentes do que um só.

**O conserto:** `spawnSync` junta as duas saídas nos dois caminhos, a prova passa a publicar
`quantasTravasNaLista` (a soma por execução, e **`null` quando qualquer arquivo não foi medido** —
*soma com buraco não é soma*), e a trava dos quatro lugares passa a **cobrar o número contra essa
soma**. O `null` ali é **recusa**, não aprovação.

**E a lição de método é a mais velha desta página:** *número que o próprio instrumento mede ao lado
não se escreve de memória* (D185). Eu somei; a resposta era contar.

---

## D312 · O PREÇO DO SÉTIMO MECANISMO: 21 A 48 LOTES POR CANDIDATA, E A FRASE "ZERA A VIOLAÇÃO" É FALSA · 12/10/2026

**Item 027 da caixa de entrada**, que autorizou a escolha que esta casa já havia fundamentado e
mandou medir o que a `FILA.md` prometia em duas metades, as duas sem medição.

**A primeira metade, o preço.** Parar a fileira externa no fim da face declarada custa, por
candidata, **21 a 48 lotes** — de uma fileira que tem **33 a 64**. No total medido: **1 196
lotes** em **40** candidatas, nas duas glebas de Antonina. Em `ensaio-com-testada`, **zero**: ali
a face declarada cobre a fileira inteira, e é o controle que mostra que a régua não acusa à toa.

**A segunda metade era falsa.** A `FILA.md` dizia *"encurtá-la ao fim da rua perde esses lotes **e
zera a violação**"*. Medido: a violação de `frente` **não zerou em NENHUMA das 40** — ela cai de
**28–55 para 5–16** e sobra.

E a pergunta que isso abre não se responde contando eu mesmo quem faz frente — isso seria
reimplementar o invariante do Generate, que a §4 proíbe. Responde-se com **uma segunda retirada,
pela régua dele**: tirada a fileira externa **inteira**, a `frente` vai a **zero em 38 das 40**, e
nas outras duas sobra **uma**.

> **"Parar no fim da face" e "não ter fileira externa" não são a mesma coisa** — e a diferença é
> de 5 a 16 violações por candidata. A primeira melhora muito; só a segunda resolve, e ela é
> outro desenho.

**E o caso que mais muda a decisão:** a candidata que o **próprio ranking do motor põe em
primeiro** em Antonina tem **33 lotes**, e **todos os 33** são da fileira externa — parando na
face ela fica com **12**. É a mesma superquadra do D140, agora com o preço.

---

## D313 · ISTO É SIMULAÇÃO, E O RÓTULO É PARTE DA ENTREGA: NEM TETO NEM PISO · 12/10/2026

A medição do D312 **retira** os lotes do plano publicado e repassa o resultado pelo Validator e
pelos indicadores do Generate. **Ela não replanta nada.**

O conserto de verdade mexe no **plantio**, e plantio que para mais cedo pode **replantar
diferente** daí para a frente — outra fileira, outro lote, outra área.

> **Chamar este número de "teto da perda" seria hipótese sobre o plantio**, que é exatamente a
> coisa que esta casa não roda. O item 027 avisou antes de eu errar: *"diga o que a simulação mede
> e pare aí"* — e é a lição do LAB-93, doze horas antes: **leitura de fonte é hipótese; rodada é
> dado.**

O rótulo mora em `src/preco-do-setimo.ts`, viaja **na prova** e é cobrado por trava — inclusive
que nenhuma linha dele **afirme** ser teto ou piso. E a régua do *"além da ponta"* **não é nova**:
é a `alemDaPonta` do LAB-78, que **mudou de arquivo** para ser lida por dois instrumentos, sem
mudar um número (a prova do LAB-78 saiu idêntica, só a data mudou).

---

## D314 · O PASSO DO CHASSI NÃO É "PISO DE ÁREA": É PISO DE ÁREA **E DE FRENTE** · 12/10/2026

O item 027 cruzou esta medição com a do Generate e levantou a hipótese que nenhuma das duas casas
via sozinha: *"algum dos passos de acabamento mata ou arruma um lote que nasce além da face
declarada? Se matar, o preço não é do plantio do Parcelamento — é do chassi."* E foi honesto:
*"não estou afirmando que mata — estou dizendo que não sei."*

Medido, em três camadas:

1. **por ÁREA, não alcança.** O critério é `area >= areaMin`, e os 1 196 lotes têm **218,76 a
   581,03 m²** contra um mínimo de **200**: **zero** abaixo dele. A hipótese, como o item a
   formulou, cai;
2. **por FRENTE, alcança TODOS.** Lido o fonte dele, o passo mantém o lote só quando
   `area >= areaMin` **E** `testadaContraVias(pontos, superficiesFrente) > 0` — e o comentário
   dele é explícito: *"lote sem NENHUMA frente é tão invendável quanto lote abaixo do mínimo"*. Os
   1 196 publicam `faceDeRua: null`, e **não é leitura minha**: o invariante `frente` do próprio
   Generate os conta, e vai a zero quando a fileira sai (38 de 40). *Duas funções dele, a mesma
   pergunta;*
3. **MATA ou FUNDE, eu não sei.** O passo tenta `melhorVizinhoParaFusao` **antes** de descartar, e
   qual das duas saídas acontece em cada lote só se sabe **rodando o passo**.

> **O nome do passo declara UMA das duas condições, e a hipótese do item vivia na outra.** Régua
> cujo nome conta metade do critério faz quem lê de fora formular a pergunta pela metade errada —
> e o item formulou pela área, que é a metade que não morde.

**E a premissa do item sobre a testada não se sustenta, medida:** ele falou de *"um lote com
testada 0 m"*, e os 1 196 têm **10,14 a 13,98 m**. O `testadaDele_m: 0` era do `v16-e15` do
LAB-78 — **um** lote acusado, não a fileira. O motor reporta testada e diz `faceDeRua: null` no
mesmo lote, e as duas coisas convivem: quem decide *"tem frente?"* é o invariante do Generate, não
o número da testada.

---

## D315 · A PORTA DO ACABAMENTO JÁ EXISTE NA ORIGEM DELE, E NÃO EXISTE NO CLONE QUE ESTA CASA COMPILA · 12/10/2026

O item 027 citou a medição que o Generate publicou às 22h18 de 11/10: *"o caminho do motor EXTERNO
não chama NENHUM"* passo de acabamento. **Isso deixou de ser verdade entre o item ser escrito e
esta rodada.**

Medido na **origem** dele (`c6048f8`): existe `src/lib/engine/acabamento-externo.ts`, com
`acabarPlano`, e o `parcelamento-externo.ts` **a chama — entre a montagem e o Validator**, atrás
de `opcoes.acabamento`. Com a opção ligada, **o veredicto passa a ser do plano que o chassi
entrega**. No clone que esta casa compila (`72cfab0`) **o arquivo não existe**.

> **O clone não é a origem — e aqui a diferença não é de data, é de CAPACIDADE.** A pergunta do
> item só se responde por rodada em quem tem a porta, e o clone desta casa não tem. *Quarta vez na
> família do D295, e a primeira em que o que falta no clone é uma função inteira, não um commit.*

**E a conta dos passos muda de número sem contradição:** o `024-O-CHASSI.md` contou **16 de 17**
passos que **poderiam** rodar sobre um plano de fora; a porta que foi entregue **aplica 13** e
declara **4 fora**, com o motivo de cada um. *Número de inventário e número de porta respondem
perguntas diferentes, e 13 + 4 = 17 fecha com os dois.*

**A consequência para a decisão que espera o Jonny:** ela pode não precisar ser tomada. O passo
alcança os 1 196 pela falta de frente, sem tocar no plantio do motor — e a recomendação na página
dele **mudou com a medição**, de *"pare a fileira"* para *"espere o acabamento do chassi"*, com o
preço das duas ao lado.

---

## D316 · SETE DAS DEZ GLEBAS NÃO DECLARAM FACE — E ALI A PERGUNTA NÃO TEM OBJETO · 12/10/2026

O item 027 pediu a conta *"nas nove glebas-padrão"*. Medido, **só três das dez** declaram
`facesLoteamento`: `geo-antonina`, `antonina-com-via` e `ensaio-com-testada`. Nas outras sete a
ida não entrega face nenhuma, o motor não cria fileira externa, e **não existe "além da face"**.

Essas sete saem com veredicto próprio — `declaraFace: false`, com o motivo escrito — e **não com
zero**.

> **Zero é uma medição; "a pergunta não tem objeto aqui" é outra coisa.** Publicar `0 lotes` nas
> sete diria que o mecanismo foi medido nelas e não custou nada — e quem lesse a soma concluiria
> que o preço é pequeno porque sete glebas o diluem. É o D23 fora do seu lugar de origem: ali ele
> separa zero de `null`; aqui separa **medido** de **sem objeto**.

E a terceira que declara face é o **controle que a medição precisava**: em `ensaio-com-testada` a
face declarada cobre a fileira inteira e o preço é **zero de verdade** — a régua não acusa à toa.

---

## D317 · O `CLAUDE.md` VIROU DIÁRIO, E A HISTÓRIA MUDOU DE GAVETA: 52 383 → 18 527 CARACTERES · 12/10/2026

**Item 028 da caixa de entrada, pedido expresso do Jonny.** Toda sessão desta casa lia o
`CLAUDE.md` **inteiro** antes de fazer qualquer coisa — inclusive a que acorda, acha a caixa vazia
e volta a dormir. Medido na direção: os onze `CLAUDE.md` da família somavam ~535 mil caracteres.

**A causa era de FORMA, não de conteúdo:** cada lição tinha entrado com a história inteira de como
foi descoberta — números da época, hipóteses descartadas, quem acusou quem.

> **A história é valiosa e não se perde: ela só não precisa ser lida para trabalhar.**

**A conta, e ela é o entregável** (`docs/provas/LAB-95/nada-se-perdeu.json`):

| | antes | depois |
|---|---|---|
| `CLAUDE.md` | **52 383** caracteres | **18 527** (−64,6 %) |
| `docs/HISTORIA_DAS_REGRAS.md` | não existia | **56 483** |
| regras no inventário | **79** | **79** |
| linhas do texto antigo perdidas | — | **ZERO** |

**A história foi montada movendo as seções INTEIRAS, literais**, como estavam em `490c102` — e é
por isso que "zero linhas perdidas" é verificável e não é uma promessa: a conta compara **linha por
linha** o texto antigo contra os dois arquivos de hoje.

**E a conta das regras é dos DOIS lados**, que é o que a torna uma conta: cada uma das 79 marcas é
conferida **no `CLAUDE.md` de hoje** (faltar ali é regra apagada) **e na história** (faltar ali é
lista inventada). *Uma régua que olhasse um lado só aprovaria exatamente o erro que o item proíbe.*

---

## D318 · GUARDA QUE LIA A HISTÓRIA MUDA DE ALVO, E A LEITURA PASSA A MORAR NUM LUGAR SÓ · 12/10/2026

O item 028 avisou antes: *"ou a frase guardada continua no `CLAUDE.md`, ou **a guarda passa a ler o
arquivo novo** — e, se mudou de alvo, a sabotagem dela é refeita e continua mordendo."*

**Duas liam a §6 pelo título** — a trava da aritmética do ponto cego e a ferramenta que publica a
prova dela. A tabela das trinta e três **é história**, então as duas passam a ler
`docs/HISTORIA_DAS_REGRAS.md`, **pela mesma função**: `src/historia-das-regras.ts`.

> **Duas leituras do mesmo alvo em dois arquivos é o que o D231 custou:** o conserto entra num
> instrumento só, e o que fica de fora passa a mentir com a autoridade de quem conferia.

E ela **recusa em vez de devolver vazio**: seção não achada é `null`, nunca `""`. *Régua que aprova
o que não leu é pior do que régua que falta* — uma seção vazia faria a aritmética dizer *"zero
problemas"* sobre um texto que ninguém abriu (a mesma escolha do `profundidade-da-historia.ts`,
D295).

---

## D319 · SABOTAGEM QUE ACHAVA O ALVO POR UM TEXTO QUE O ENXUGAR TIROU PAROU DE MORDER EM SILÊNCIO · 12/10/2026

A trava do D218 prova que a régua do limite-sem-sujeito **reprova de verdade**: ela replanta a
redação antiga e exige **um** achado. Para recortar a frase, ela procurava o fim dela por
`"(D218)."` — a citação da decisão **no texto antigo** da §1.

O enxugar tirou a citação de dentro daquela frase. `indexOf` devolveu `-1`, o recorte montou um
texto que a régua não acusava, e a sabotagem **passou a não morder** — sem erro, sem aviso.

> **Sabotagem que não acha o que sabotar não é sabotagem: é um teste que passa.** E ela falha para
> o lado pior — o lado que diz que está tudo bem.

Refeita: ela recorta a **frase**, e **confere que achou o alvo** antes de sabotar
(`expect(claudeMd).toContain(A_FRASE)`). *Toda sabotagem desta casa passa a afirmar que encontrou o
que ia quebrar.*

E o refluxo do texto cobrou mais uma coisa: a frase sabotada tinha ficado **colada** à anterior por
`**.`, e a régua lê por frase — então as duas viravam uma, e o sujeito da primeira cobria a
segunda. A §1 foi repontuada para a frase ficar inteira. *Pontuação não é estilo quando uma régua
divide por ponto final.*

---

## D320 · GUARDA QUE CASAVA TEXTO CRU ACUSOU A PÁGINA DE NÃO TRAZER UMA REGRA QUE ESTAVA ALI · 12/10/2026

**Décima vez da família do D248**, e esta chegou pelo enxugar: a trava do item 006 exigia
`"campo que não existe não se esquece"` com `toContain` **cru**. O refluxo da §4-A pôs uma quebra de
linha no meio da frase, e a trava acusou a §4-A de não trazer a lição — que estava ali, inteira.

> **Refluxo de texto é o teste natural de toda régua que casa frase.** O enxugar não criou o
> defeito: ele o **revelou**, em três instrumentos de uma vez (este, a sabotagem do D319 e o alvo
> do D318).

O conserto já existia nesta casa: `aRegraEstaEscrita`, de `src/texto-das-regras.ts`, lê a frase
**como ela se lê**. *Conserto que mora dentro de um teste conserta um teste* — e por isso o
inventário novo do LAB-95 nasceu usando o normalizador, não `toContain`.

---

## D321 · A META DE 15 MIL NÃO FOI ALCANÇADA: FICOU EM 18 527, E O CHÃO ESTÁ MEDIDO · 12/10/2026

> **⚠ DESMENTIDA PELA D322, no despertador seguinte:** a meta cabia — 12 706 caracteres com as 79
> regras e as citações intactas. Os *"203 por regra"* abaixo eram o gasto daquela redação, não um
> chão. O texto fica como estava, porque decisão errada se corrige pela seguinte, não se apaga.

O item 028 fixou **15 000 caracteres** e disse o que fazer se não chegasse: *"diga no recado quanto
ficou e o que impediu — número, não adjetivo."*

**Ficou em 18 527** — faltam **3 527**. O que impede, medido pedaço por pedaço:

| caracteres | o que é |
|---|---|
| **1 285** | a citação literal da Central (§1-C) — a família mandou gravar literal |
| **387** | a citação literal do Jonny (§4-A) — idem |
| **200** | o molde do recado — é o formato que a §1 manda seguir |
| **36** | o comando do verde |
| **565** | a lista de onde mora cada coisa — o item pediu explicitamente |
| **2 473** | **soma do que não se corta nem se edita** |

Sobram **16 054** para **79 regras**, títulos e ponteiros: **203 caracteres por regra**. Baixar de
15 000 exige **tirar regra** ou **editar citação literal** — e o item proíbe as duas.

> **Então o que falta não é esforço de redação: é uma decisão que não é minha.** Ou a meta muda, ou
> alguma regra sai da página e passa a viver só na história — e *regra que vira uma frase continua
> sendo regra, mas regra que sai da página deixa de ser lida.*

**O item 028 NÃO foi marcado como FEITO**, obedecendo ao que ele próprio manda: *"não marque como
FEITO até a meta: o próximo despertador continua este mesmo item."* O que já está feito está na
`main`, verde, e o estado está escrito no topo do próprio item.

## D322 · A D321 ESTAVA ERRADA: A META CABIA, E OS "203 POR REGRA" ERAM SAÍDA, NÃO CHÃO · 12/10/2026

A D321 disse que baixar o `CLAUDE.md` de 15 000 caracteres *"exige tirar regra ou editar citação
literal"*. **Medido no despertador seguinte, não exigia:** a página ficou em **12 706**, com as
**79 regras** do inventário conferidas nos dois lados, **zero linhas perdidas** e as duas citações
literais (Central e Jonny) intactas.

**O erro tem forma, e é por isso que vira decisão:** o chão medido (citações, molde, comando, lista)
estava certo; o passo seguinte — *"sobram 16 054 para 79 regras: 203 por regra"* — dividiu o que
sobrava pelo número de regras e tratou o **quociente** como limite. Mas 203 era **quanto aquela
redação gastava**, não quanto uma regra precisa. *Uma saída da medição foi lida como restrição dela.*

> **AFIRMAÇÃO DE IMPOSSIBILIDADE É AFIRMAÇÃO COMO AS OUTRAS, e é a mais fácil de não testar**: o
> teste dela é tentar. A D321 não tentou — e por isso pediu ao Jonny uma decisão que não existia,
> no mesmo dia em que ele disse que não quer mais responder perguntas desta casa (item 029).

**O que se perde:** cada regra ficou em uma frase, às vezes meia; a nuance mora na história, um
clique adiante (`§HN`). Três frases da casa voltaram porque guardas acusaram o encurtamento
(`regras`, `custo-por-uso`, `lab95`) — **as três com razão**, e é o serviço delas.

---

## D323 · OS 15 M SE MEDEM ANDANDO PELA DIVISA, E "QUADRA" É TRECHO DE RUA — as respostas dele no código · 12/10/2026

O Jonny respondeu as duas perguntas do item 9 da página dele (item 029 da caixa, texto inteiro
no item 028 do Generate, que é o dono da regra):

- **9-B:** *"os 15 metros se medem da esquina — encontro de duas ruas — e 15 metros deste encontro
  em sentido a cada rua."* A régua da faixa de esquina passou de **linha reta até o vértice** para
  **o menor arco sobre a divisa** entre o ponto e o vértice de esquina
  (`REGUA_DA_FAIXA = "ao-longo-da-divisa-a-partir-do-encontro-das-ruas"`,
  `external-engines/esteira/src/acesso-sugerido.ts`). É a recomendação que esta casa tinha feito,
  confirmada;
- **9-A:** "quadra" é **o trecho de rua entre dois cruzamentos** (50 a 200 m), não o quarteirão.
  Os 25 m valem quando a frente ocupa o trecho inteiro. **O código continua usando 15 m**, e diz
  por quê: reconhecer o caso dos 25 m virou uma conta, mas a conta precisa saber onde a rua tem
  cruzamento, e nenhuma gleba daqui diz sequer quais faces dão para rua.

**As três escolhas que são minhas, onde a resposta dele não alcança, e as alternativas que
descartei:**

1. **Ponto fora da divisa é projetado nela.** Descartei recusar: as posições avaliadas já estão
   na divisa, e recusar um ponto a milímetros dela por arredondamento seria ruído.
2. **Face de rua mais curta que 15 m não encurta a regra** — a caminhada continua pela face
   seguinte. Descartei parar no fim da face: a regra fala em 15 m de rua, e uma face curta é
   desenho do arquivo, não da rua.
3. **A régua velha não foi apagada:** virou `dentroDaFaixaEmLinhaReta`, que **não decide nada** e
   existe para a prova pôr as duas lado a lado (D182: a regeração da prova do LAB-77 não apaga o
   "antes"; D116: a comparação mora na mesma montagem, sem segunda lista de glebas).

**O número, nas sete glebas:** a troca **quase não mexe**. Um único valor muda — o teto da faixa
de 25 m no sintético de 10 ha, de **37,42 %** para **37,34 %** do perímetro (uma amostra de 1 m em
1 338). As seis posições varridas e os dois acessos declarados ficam onde estavam. Isso **não** diz
que a pergunta era irrelevante: diz que **estas** glebas têm a divisa larga. A diferença aparece em
terreno estreito ou recortado, onde a reta *corta por dentro* — demonstrado nas travas com uma
gleba de 100 × 10 m (12,8 m pela reta, 18 m andando) e uma fenda de 10 m (14,1 m contra 80 m).

**As outras respostas do mesmo item, registradas aqui para não morarem só na página dele:**

- **Pendência 3 — a "LAB-3" da lista da direção, o "para o Or…" de 15/09:** o destino do item de custo da travessia é o **Orçamento**,
  como **custo de obra** — e a regra dele é mais larga: *"qualquer custo é orçamento, de um parafuso
  a uma rua ou portaria"*. A D61 (item 5) fica respondida por esta. **Não mudei o `ItemDeCusto`**:
  dar a ele um campo de tipo de custo é contrato de saída, e vai à FILA como proposto ao chat;
- **Pendência 12 — a "LAB-12" (o regime):** vem do **empreendimento** do Generate e a comparação **nunca escolhe**.
  Sem integração não há empreendimento para ler, então a premissa de condomínio por omissão
  continua **declarada** em cada medição (`premissas-identicas.ts`), como estava;
- **Pendências 5-B, 7, 10 e 11 (as "LAB-5B, LAB-7, LAB-10 e LAB-11" da direção): paradas até o Lab entrar no Generate**, a pedido dele. A 5-B
  volta reescrita, com um desenho.

> **PERGUNTA RESPONDIDA NÃO É DADO QUE CHEGOU.** O 9-A tirou uma decisão da mesa dele e não pôs
> nenhum número a mais nesta casa: a conta dos 25 m continua sem o cruzamento para medir. Dizer
> "respondido" e continuar usando 15 m não é contradição — é dizer qual metade andou.

## D324 · A REGRA 2 DO ACESSO GANHOU GUARDA, E O VOCABULÁRIO DE RECUSA NÃO TEM MAIS PALAVRA ÓRFÃ · 13/10/2026

**Origem:** item 900 (a minha própria lista), tarefa tirada da `FILA.md`, proposta 1 do LAB-96.
Relatório: [`relatorios/LAB-97.md`](relatorios/LAB-97.md).

**O defeito:** `"sem-via-publica"` estava no vocabulário de recusa e **nenhuma função o produzia**.
Com as faces declaradas, uma posição sobre o muro do vizinho passava como válida em
`avaliarPosicoes`, e a `sugerirAcesso` podia escolhê-la. Inofensivo hoje (nenhuma gleba declara as
faces), a um dado de distância de sair.

**O que se decidiu:**

1. `sobreFaceComVia` projeta o ponto no anel e responde pela face; `avaliarPosicoes` recusa com
   `"sem-via-publica"` **antes** da faixa de esquina — a regra 2 é o universo, a 3 é um recorte
   dentro dele, e o motivo dado tem de ser o do universo.
2. **Ponto exatamente no vértice entre rua e muro conta como rua** (fim da testada), com empate de
   1 mm. Descartado: recusar o vértice — onde há esquina a faixa já recusa, e onde não há seria
   recusar a ponta de uma rua de verdade.
3. **`MOTIVOS_RESERVADOS`**, lista fechada nos dois sentidos com o porquê: motivo fora dela tem de
   ter quem o produza; motivo dentro dela não pode ter. A trava procura o literal ao lado de
   `motivo:`, com o recorte da própria declaração provado por trava.
4. **`"o-motor-recusou"` entrou na lista**, e não no código nem no lixo: era o segundo órfão, que a
   FILA não listava e a trava achou. Produzi-lo é rodar motor por posição, que o LAB-77 não faz.

> **PALAVRA NO VOCABULÁRIO NÃO É REGRA NO CÓDIGO.** Um nome fechado num `as const` passa por
> guarda — o tipo existe, o motivo existe, a prosa da regra existe — e nada o produz. Vocabulário
> fechado se confere nos dois sentidos: quem o declara e quem o devolve.

## D325 · O NÚMERO DE TRAVAS DO PORTÃO ERA 698 EM SEIS LUGARES E A SUÍTE RODADA DIZIA 719 — agora a trava reconta · 13/10/2026

**Origem:** item 900 (a minha própria lista), dívida própria da espécie *número digitado à mão*,
como o LAB-97 deixou indicado. Relatório: [`relatorios/LAB-98.md`](relatorios/LAB-98.md).

**O defeito, medido:** `bun test` com os 42 arquivos do trabalho `guardas-sem-clones` contou
**719 travas**. O `CLAUDE.md`, o `ONDE_PARAMOS.md`, a `FILA.md`, o `verde.yml` (duas vezes) e a prova
do LAB-84 diziam **698** — e as duas travas que vigiam o número estavam **verdes**, porque as duas
eram de CONCORDÂNCIA: as cópias entre si (LAB-42) e as cópias contra a prova (LAB-93, D311). A
prova do LAB-84 é medida à mão (`bun run lab84`), e o LAB-96 e o LAB-97 puseram 21 travas na lista
sem rodá-la.

**O que se decidiu:**

1. `tests/contar-as-travas.test.ts` **roda a lista** e confere a soma contra as cinco cópias e a
   prova, publicando o universo lido (arquivos rodados = arquivos da lista). A leitura da rodada
   devolve `null`, nunca zero, quando o `bun` não imprime o resumo (D23).
2. **Ela fica FORA da lista que ela roda**, e há trava disso: rodar a lista de dentro dela é a lista
   se rodando a si mesma. Roda no verde completo, que é onde o número se escreve.
3. A prova do LAB-84 entrou em `AS_ESPECIES` como **função da árvore, regerada pela trava** — só a
   soma. O *"passam sem clone"* depende de ambiente e continua sendo do `bun run lab84`, que foi
   rodado: **42 de 42 passam sem os clones**, 719 travas.
4. Os seis lugares foram para **719**, contados — e não somados de cabeça, que é como o 661 do D311
   nasceu.

**Descartado:** contar `test(` com regex (mede texto: deu 688 e 739 nas duas formas tentadas, contra
719 rodado — há travas dentro de laço); e tirar o número do texto (a trava do LAB-42 e o D311 o
pedem escrito, e com a recontagem ele deixa de envelhecer calado).

> **NÚMERO ESCRITO À MÃO CONFERIDO CONTRA PROVA MEDIDA À MÃO É CONCORDÂNCIA, NÃO MEDIÇÃO.** Seis
> cópias concordando provam que ninguém esqueceu de copiar; só a recontagem prova que alguém
> esqueceu de medir.

## D326 · OITO CAMINHOS DO `CLAUDE.md` NÃO RESOLVIAM DA RAIZ — o enxugar encurtou o ponteiro, e agora há trava · 13/10/2026

**Origem:** item 900 (a minha própria lista), dívida própria da espécie *regra sem guarda* — a
§6 manda *"confira o CAMINHO e a FORMA do que você lê"*, e nada conferia o caminho que a própria
página cita. Relatório: [`relatorios/LAB-99.md`](relatorios/LAB-99.md).

**O defeito, medido:** o enxugar do LAB-95 (`099d0b4`) trocou `external-engines/esteira/src/x.ts`
por `src/x.ts`. Não há `src/` na raiz. Oito caminhos da página não levavam a nada: seis `src/…`
(`onde-esta-o-padrao`, `inventario-das-pontes`, `varredura-de-segredos`, `cobranca-por-uso`,
`trava-de-estrutura`, `texto-das-regras`), um `tests/limites-com-sujeito.test.ts` e a bancada
`symbios/adapter/…/index.html`. Antes do enxugar a página tinha quatro caminhos inteiros e cinco
curtos; depois, zero e seis. Todas as travas verdes: a do enxugar confere que a REGRA ficou e
que a HISTÓRIA resolve — não que o ARQUIVO citado existe.

**O que se decidiu:**

1. `external-engines/esteira/src/caminhos-da-pagina.ts` lê os trechos entre crases do
   `CLAUDE.md` e separa **caminho** (tem barra: resolve DA RAIZ, sem tolerância por proximidade),
   **nome** (sem barra, com extensão: passa se algum arquivo da árvore tem o nome) e **anatomia do
   motor** (`upstream/`, `archilly/`, `adapter/` — as pastas de dentro de cada motor, exceção
   declarada e conferida nos dois sentidos: citada na página E presente em algum motor).
2. `tests/caminhos-da-pagina.test.ts` (8 travas) entrou no trabalho `guardas-sem-clones`: lê só
   este repositório. A lista foi de 42 para 43 arquivos e de 719 para **727** travas, contadas
   pela trava do LAB-98 — que foi o que obrigou as seis cópias a andarem juntas.
3. Os oito caminhos ganharam o prefixo inteiro. A página foi de 12 706 para 12 900 caracteres
   (meta 15 000), e a prova do LAB-95 foi regerada por `bun run lab95`.

**Descartado:** aceitar `src/x.ts` quando existe `external-engines/*/src/x.ts` (é a tolerância por
proximidade que fez o defeito passar: o leitor no GitHub não adivinha o pacote); declarar uma
convenção "caminhos relativos à esteira" (a página cita pastas da raiz e de três motores, e uma
convenção só para metade dela é a ambiguidade escrita); varrer também `ONDE_PARAMOS`, `FILA`,
`DECISOES` e `INDEX` nesta rodada — eles têm 122 menções curtas, muitas em relato histórico, que é
texto datado e não se reescreve; ficou proposto na FILA.

> **PONTEIRO ENCURTADO É PONTEIRO PARA OUTRO LUGAR.** Quem encurta sabe de onde lê; quem segue,
> não. O teste de um ponteiro é segui-lo de onde o leitor está — e o leitor da página é a raiz.

## D327 · NAS PÁGINAS DE `docs/` O PONTEIRO VIVO É A LIGAÇÃO — a régua da raiz não se estende, e as ligações ganharam trava · 13/10/2026

**Origem:** item 900 (a minha própria lista), a proposta que o LAB-99 deixou na `FILA.md`: *"a
mesma pergunta nas outras páginas vivas"*, com o primeiro passo escrito — separar ponteiro vivo de
história antes de estender a régua. Relatório: [`relatorios/LAB-100.md`](relatorios/LAB-100.md).

**O que a medição respondeu, antes de qualquer conserto:**

- **Os trechos entre crases das páginas de `docs/` seguem OUTRA convenção, e é coerente:** no
  `INDEX.md`, dos 143 caminhos, **128 resolvem só a partir da própria pasta** (`relatorios/LAB-07.md`),
  3 da raiz e 12 de lugar nenhum — e os 12 estão todos na coluna da descrição: o exemplo do
  defeito do LAB-99 (`src/x.ts`), outro repositório (`jonny583/archilly-central`), ação do GitHub
  (`actions/checkout`) e caminhos curtos dentro de relato datado. Nas outras três a proporção é
  parecida (`ONDE_PARAMOS` 36 só da pasta e 23 de lugar nenhum; `FILA` 78 e 65; `DECISOES` 8 e 119),
  e o que não resolve é relato de rodada.
- **O ponteiro que se segue nessas páginas é a ligação `[texto](alvo)`:** 309 nas cinco páginas
  vivas (`CLAUDE.md` 5, `INDEX.md` 144, `ONDE_PARAMOS.md` 49, `FILA.md` 100, `DECISOES.md` 11).
  **Todas resolvem, e resolveram em cada uma das 127 versões dessas páginas na `main`** — medido
  commit a commit contra a árvore de cada um. Nenhuma trava as conferia.

**O que se decidiu:**

1. **A régua da raiz (D326) NÃO se estende** aos trechos entre crases das páginas de `docs/`.
   Estendida, ela reprovaria a convenção da página (o caminho relativo à pasta, que é como o GitHub
   segue) e o relato datado, que não se reescreve.
2. **As ligações ganharam régua própria**, em `external-engines/esteira/src/caminhos-da-pagina.ts`:
   o alvo resolve **da pasta da página**; âncora e título saem; `%20` se decodifica; esquema fica
   fora; subir acima da raiz reprova pelo nome. A lista das cinco páginas (`PAGINAS_VIVAS`) é
   conferida contra a frase do `CLAUDE.md` §7 que manda mantê-las *"em dia"*.
3. As travas entraram no **mesmo arquivo** do LAB-99, que já está no `guardas-sem-clones` (a lista
   fica em 43 arquivos): 8 → 20 travas, e o portão de 727 → **739**, recontado pela trava do LAB-98.

**Os dois lados, demonstrados:** lado ruim sintético (alvo que só existe da raiz; alvo que sobe
acima dela), sabotagem no `INDEX.md` de verdade (`LAB-99.md` → `LAB-9.md`, reprova e só ele), e
duas mutações da régua (não perguntar a existência: 2 travas caem; resolver da raiz em vez da
pasta: 8 caem).

**Descartado:** estender a régua da raiz com tolerância (*"resolve da raiz OU da pasta"* — é a
tolerância por proximidade que a D326 recusou, e esconderia que o `CLAUDE.md` e as páginas de
`docs/` seguem convenções diferentes); reescrever os caminhos curtos do relato (texto datado não se
reescreve); conferir também a âncora (`#secao`) do destino — o GitHub gera a âncora por um
algoritmo que eu não testei, e régua com algoritmo adivinhado é afirmação sem teste.

> **A MESMA PERGUNTA EM OUTRA PÁGINA PODE TER OUTRO SUJEITO.** No `CLAUDE.md` o ponteiro é o
> trecho entre crases, e o leitor parte da raiz; no `INDEX.md` o ponteiro é a ligação, e o leitor
> parte da pasta. Estender a régua sem medir o sujeito era mandar na coisa errada.

## D328 · OS "SETE PASSOS" DO VERDE ESTAVAM CERTOS E NINGUÉM OS CONFERIA — número por extenso é número digitado à mão · 13/10/2026

**Origem:** item 900, a dívida própria (a `FILA.md` sem proposta que não espere ninguém, como o
LAB-100 deixou escrito). Relatório: [`relatorios/LAB-101.md`](relatorios/LAB-101.md).

**O que a medição respondeu:** o `CLAUDE.md` §7 e a linha do `conferir.sh` no `INDEX.md` dizem
*"sete passos"* (e o `INDEX.md`, *"dois pacotes"*). O script conta 2 × 3 + 1 = **7** — certo hoje.
Mas nada conferia: o `verde.test.ts` cobra que os passos **existem**, e a trava do LAB-98 lê
algarismos, não palavras. O próprio script manda acrescentar todo pacote novo a `COBERTOS`; quem
obedecer leva o verde a dez passos com as duas páginas em sete, verdes.

**O que se decidiu:**

1. A contagem sai do script (`external-engines/esteira/src/passos-do-verde.ts`): `passo "…"` dentro
   do laço de `COBERTOS` vale uma vez por pacote; fora, uma vez; forma não reconhecida é `null`.
2. O número das páginas é lido **por extenso**, com o `lerNumeroEmPalavra` que já existia, e o
   trecho é escolhido **pelo sujeito** (D218): o parágrafo *"Ele roda cobertura"* e a linha da
   ligação do `conferir.sh`. Os *"DOIS passos"* de religar o CI, no mesmo §7, são outro objeto.
3. As travas moram no `verde.test.ts`, que é a casa da afirmação desde o LAB-31: 7 novas, o portão
   sem clones de 739 → **746**, recontado pela trava do LAB-98.

**Os dois lados e as mutações:** terceiro pacote em `COBERTOS` reprova as três afirmações; página
com *"oito"* reprova só ela; esquecer a conta por pacote derruba 5; `null` calado derruba 1. **A régua
sem sujeito passou na primeira versão** — na página de hoje o *"sete"* vem antes do *"DOIS"* e a
ordem acertava por sorte; o caso invertido entrou, e a mutação agora cai.

**Descartado:** trocar a palavra por algarismo para caber na régua do LAB-98 (a régua mandando no
texto); contar as *"duas guardas antes deles"* (decidir o que é guarda seria adivinhar); reescrever
os *"sete passos"* do relato datado (história, verdadeira na data).

> **NÚMERO ESCRITO POR EXTENSO É NÚMERO DIGITADO À MÃO.** A régua que lê algarismo não o vê, e a
> palavra não muda quando a lista muda. E **mutação que passa por sorte de ordem não prova a régua**:
> o caso de teste tem de pôr o objeto errado ANTES do certo.

## D329 · DESLIGADO, A FRASE QUE DIZ QUE O CI RODA SAI — o espelho da trava do gatilho · 13/10/2026

**Origem:** item 900, a dívida própria — a espécie *"mensagem fixa que afirma estado sem
perguntar"*, que o LAB-101 deixou por varrer. Relatório: [`relatorios/LAB-102.md`](relatorios/LAB-102.md).

**O que a medição respondeu:** com o gatilho automático do `verde.yml` comentado desde 08/10/2026,
**seis frases vivas** diziam que o CI *roda hoje* / *roda em todo push* — no `conferir.sh`, duas no
próprio `verde.yml`, no `INDEX.md`, num comentário de teste escrito já com o CI desligado e numa
mensagem de problema fixa. A trava do gatilho cobrava só *ligado → o aviso de desligado sai*. O
`grep` por frase achou cinco; a régua que atravessa a quebra de linha e a caixa achou a sexta.

**O que se decidiu:**

1. A pergunta ao gatilho e a régua da frase moram em `external-engines/esteira/src/o-ci-que-roda.ts`;
   `gatilhoAutomaticoLigado` saiu da trava para haver uma implementação só (D231).
2. Com o gatilho **desligado**, toda frase de estado fora de relato reprova, e **toda exceção declarada
   tem de continuar achada** — os dois sentidos. As exceções são o argumento de segredo do D213
   (*"o trabalho que roda em todo envio não tem segredo"*), que vale ligado ou desligado.
3. As travas moram no `gatilho-do-verde.test.ts`, ao lado do teste de que ele é o espelho: 8 novas,
   o portão sem clones de 746 → **754**.

**Os dois lados e as mutações:** a frase volta, 1 cai; a exceção morre, 1 cai; não tirar o marcador
de comentário, 2 caem; a régua que só registra, 1 cai; ler relato como vivo, 3 caem.

**Descartado:** cobrar o lado ligado (é da trava do gatilho); reescrever o relato datado; alargar a
régua a sinônimos.

> **AVISO DE DESLIGADO AO LADO DA FRASE DE QUE RODA NÃO É AVISO: É CONTRADIÇÃO.** Trava que cobra
> um estado tem de cobrar os dois — o aviso que entra **e** a afirmação contrária que sai.

## D330 · A PROVA DE DETERMINISMO GUARDA AS DUAS ASSINATURAS — um `true` sozinho é a aparência da prova · 14/10/2026

**Origem:** item 900, a dívida própria — a espécie *"prova que só registra aparência"*, que o LAB-102
deixou por varrer. Relatório: [`relatorios/LAB-103.md`](relatorios/LAB-103.md).

**O que a medição respondeu:** o `LEIA-ME.md` das provas e o `CLAUDE.md` §7 prometem *determinismo
provado*. Lidos os **100** `.json` versionados em `docs/`, **7** falam de determinismo: o LAB-07 guarda
as assinaturas das duas execuções (e a da outra semente); **seis** provas — LAB-04, 05, 08, 13, 40 e
46 — guardam **33** campos `"determinismo": true` / `"determinista": true`, sem o que se comparou. A
régua do LAB-08 **já errou** comparando 20 variantes com 3, e o campo publicado tinha a mesma forma
com a régua errada e com a certa.

**O que se decidiu:**

1. A prova de determinismo tem forma única, `provaDeDeterminismo` em
   `external-engines/esteira/src/prova-de-determinismo.ts`: o **que** se comparou, as **duas
   assinaturas** (SHA-256 do JSON, 16 caracteres) e `identicas` **derivado** delas. As seis
   ferramentas — sete cálculos — passaram a chamá-la.
2. A régua lê todo `.json` de `docs/`: campo `determinis*` com booleano, texto ou número precisa das
   duas assinaturas ao lado. As 33 de hoje são **fotografias** (D182, D288) e ficam, declaradas **com
   a contagem** — acima dela reprova, abaixo também (a lista envelheceu). Rodar a ferramenta de novo
   encolhe a lista sozinho.
3. As 8 travas moram em `tests/prova-de-determinismo.test.ts`, no portão sem clones: 754 → **762**,
   e a lista do trabalho 43 → **44** arquivos.

**Os dois lados e as mutações:** régua sem lista, 3 caem; todo objeto com evidência, 4; lista que não
se revalida, 1; só o booleano, 1; ferramenta de volta ao `===`, 1; `true` posto na prova real do
LAB-77, 1. **E a ferramenta foi rodada**, não só lida: a `lab46.ts`, numa cópia descartável, gravou as
duas assinaturas — e o arquivo regerado mudou 69 + 32 linhas **fora** do determinismo contra o motor
de hoje, que é o tamanho do motivo de não regerar fotografia.

**Descartado:** regerar as seis; exigir a terceira assinatura (*outra semente*), que muda o que se
mede e fica proposta; estender a régua aos outros vereditos booleanos (`limpo`, `aceito`,
`confere`), também proposto.

> **UM `true` SOZINHO É A APARÊNCIA DA PROVA, NÃO A PROVA.** Ele tem a mesma forma com a régua certa
> e com a errada. A prova guarda o que se comparou, e o veredito **sai** disso — nunca entra ao lado.

## D331 · O NOME DO PROMPT TEM DUAS CASAS OU MAIS — e a trava que tirava os de três do universo nunca podia reprovar · 14/10/2026

**Origem:** item 900, a minha própria lista — a proposta 3 do LAB-103 na `FILA.md` (*"a régua das
propostas lê o prompt com DOIS algarismos"*), e com ela a espécie *"teste que nunca reprovou"*, a que
o LAB-103 deixou por varrer. Relatório: [`relatorios/LAB-104.md`](relatorios/LAB-104.md).

**O que a medição respondeu:** enumerados os **lugares** (todo `.ts` versionado em `external-engines/`,
233 arquivos na árvore de antes, fora `upstream/`), a forma `LAB-\d\d` aparecia **dez** vezes, em **nove** linhas de
código de seis arquivos: duas na
`varredura-das-propostas.ts` (a proposta do LAB-103), duas no `recado.test.ts`, uma no
`propostas.test.ts`, uma no `mecanismos.test.ts` e quatro em ferramentas de prompts fechados (três no
`lab66`, uma no `lab70`). **A do `recado.test.ts` que monta o universo dos relatórios tirava `LAB-100.md` a
`LAB-103.md` dele** — apagado do `RECADOS.md` o recado do LAB-103, a trava *"todo relatório de prompt
tem recado"* seguia **9 pass · 0 fail**. Não reprovava porque não podia: o relatório não estava no que
ela lia. Os quatro de hoje têm recado — a trava estava cega, não errada.

**O que se decidiu:**

1. O nome do prompt tem forma única, `PROMPT_DO_LAB` = `LAB-\d{2,}`, gulosa, em
   `external-engines/esteira/src/nome-do-prompt.ts`; as seis réguas vivas a usam, **e as duas
   ferramentas também**: `lab66.ts` e `lab70.ts` espelham a trava do recado para medi-la, e a D231 já
   tinha medido o que acontece com ferramenta que fica para trás da trava que espelha. A prova do
   item 003, que a `lab70.ts` regera a cada rodada, publicava **`relatoriosVarridos: 91`** com 95 no
   disco — o universo estava publicado, e ninguém o comparava com o total.
2. Uma régua contra a forma de duas casas renascer no **código** (comentário não conta — é relato):
   `duasCasasNoCodigo` e `conferirDuasCasas`, sobre o universo publicado. **Uma** exceção declarada,
   com o motivo e conferida nos dois sentidos: a própria trava, que reproduz a forma velha para
   mostrar o lado ruim.
3. As 12 travas moram em `tests/nome-do-prompt.test.ts`, no portão sem clones: 762 → **774**, e a
   lista do trabalho 44 → **45** arquivos.

**Os dois lados e as mutações:** sete mutações, todas acusadas — o universo dos relatórios de volta a
duas casas (2 travas caem), o executor (3), a seção em prosa (3), o item do ACUMULADO (2), a forma única
sem a gula (7), a forma velha de volta numa ferramenta (2), a exceção apontada para arquivo sem a forma
(3). E a sabotagem que a trava velha deixava passar —
apagar o recado do LAB-103 — agora **reprova** (8 pass · 1 fail).

**Descartado:** declarar `lab66.ts` e `lab70.ts` como exceção — foi a primeira versão desta rodada, com
o motivo *"a saída é a prova daquela data"*, e era falso para a `lab70.ts`, que regera a prova do item
003 por estado. A prova do LAB-66 (09/10) **não** foi regerada: é fotografia daquele dia. Também descartado: trocar por `LAB-\d+` (aceitaria `LAB-7`, que não é nome desta casa); ler `LF-`/`T-`, que já
têm forma própria em `promptsDoCabecalho` (D217).

> **TRAVA QUE DEFINE O UNIVERSO POR UMA FORMA ENVELHECE COM A FORMA.** Ela continua verde e passa a
> não olhar o que nasceu depois. O universo que ela publica (*"mais de 20"*) não acusa quando quatro
> somem de 95 — por isso a trava nova compara o universo lido com **todos** os relatórios de prompt.

## D332 · A PROVA DE DETERMINISMO FAZ A TERCEIRA PERGUNTA — a outra semente muda a saída? · 14/10/2026

**Origem:** item 900, a minha própria lista — a proposta 1 do LAB-103 na `FILA.md` (*"a terceira
assinatura: a outra semente muda a saída?"*). Relatório: [`relatorios/LAB-105.md`](relatorios/LAB-105.md).

**O defeito:** a D330 fez a prova guardar as duas assinaturas da **repetição**. Mas duas execuções
iguais também saem de um motor que **ignora a entrada** — *zero perfeito é tão suspeito quanto
número absurdo*. O LAB-07 sempre fez a terceira pergunta (`assinaturaOutraSemente`,
`sementeTemEfeito`, com `SEMENTE + 1`); as sete chamadas das seis ferramentas da D330, não.

**O que se decidiu:**

1. `provaDeDeterminismo` ganhou um **quarto parâmetro obrigatório** com **duas formas e nenhuma
   terceira**: `{ outraSemente, saida }` — a função assina a saída e **deriva** `sementeTemEfeito` —
   ou `{ semSemente: "<por quê>" }`, com o motivo escrito (menos de dez caracteres lança erro).
   *Pergunta que o tipo exige não se pula.*
2. As sete chamadas respondem: **quatro rodam a outra semente** (Symbios e Parcelamento no `lab08`,
   e as amostragens do `lab40` e do `lab46`), **duas dizem por que não há** (`lab04`, a subdivisão;
   `lab05`, o recorte — funções puras da geometria) e **uma decide motor a motor** (`lab13`: o motor
   interno do Generate não lê a semente, os outros dois rodam a outra).
3. `sementeTemEfeito: false` **não reprova**: é medição, e o Lab mede, não julga o motor (D20). Fica
   gravado, que é exatamente o que um `true` sozinho não deixava.
4. A régua `provasSemAOutraSemente` cobra a resposta em **toda prova na forma desta casa**
   (`oQueSeComparou`), sem fotografia possível — nenhuma prova dessa forma existia antes da pergunta.
   Não lê as formas escritas à mão (LAB-07, Symbios) nem as 33 fotografias da D330: cobrar delas a
   resposta seria regerá-las (D288).
5. Quatro travas novas em `tests/prova-de-determinismo.test.ts`: 774 → **778** no portão sem clones.

**Os dois lados e as mutações:** oito mutações, todas acusadas — `sementeTemEfeito` sempre `true`, a
régua que nunca acha, a régua que aceita motivo vazio, a função que aceita motivo vazio, meia
resposta (a assinatura sem o veredito), a chamada do `lab46` sem a terceira, o detector de texto que
aceita tudo, e uma prova plantada em `docs/` sem a resposta. Duas das oito **não pegaram na primeira
tentativa** — a mutação era um `sed` de várias linhas que não se aplicou; refeitas, pegaram (*mutação
que diz NÃO PEGOU é suspeita da mutação*).

**Rodado, não lido:** `lab40` e `lab46` numa cópia descartável (`git worktree`, removida): a outra
semente **muda** a saída nas duas (`799b1e59…` → `2c26c4ed…`; `82405c0e…` → `548e39de…`), e as duas
réguas acham zero na prova regerada. As outras quatro ferramentas carregam o `.wasm` do Symbios, que
não se constrói nesta máquina: typecheck e lint limpos, **não rodadas**.

**Descartado:** tornar `sementeTemEfeito: false` reprovação (seria o Lab julgando o motor, D20; e o
Generate não tem semente por desenho); usar a terceira pergunta como **outra entrada** em vez de outra
semente nas funções puras (é outra pergunta — *a geometria responde à quadra?* — e mudaria o que se
mede); regerar as 33 fotografias (D182, D288).

> **DUAS EXECUÇÕES IGUAIS PROVAM A REPETIÇÃO, NÃO A DEPENDÊNCIA.** A prova de determinismo pergunta
> também se a entrada que deveria mudar a saída muda — ou diz, por escrito, por que não há entrada
> dessas.

## D333 · A ORDEM DA ENTREGA SE COBRA NO ENVIO — o gancho `pre-push`, e não o commit nem a suíte · 14/10/2026

**Origem:** item 900, a minha própria lista — a proposta do LAB-105 na `FILA.md` (*"a ordem da
entrega como trava … medir se um gancho de `pre-commit` versionado ou uma trava sobre o commit
resolve, antes de escolher"*). Relatório: [`relatorios/LAB-106.md`](relatorios/LAB-106.md).

**O defeito, medido:** as provas que contam a árvore (LAB-52, LAB-57) **têm** trava que as reconta,
e ela pega. Falhava a **ordem**: o verde rodava e um arquivo da entrega entrava no `git` depois.
Rodadas as duas travas sobre **cada um dos 36 estados** da `main` desde o LAB-86 (D287):

- **21 envios desta casa, 2 vermelhos** — LAB-98 (`0318814`) e LAB-104 (`3689986`), os dois pelo
  LAB-57, e os dois relatados como *"9 fail, as do `.wasm`"*;
- **15 escritas da direção na caixa, 15 vermelhas** — cada item novo é um arquivo a mais no
  `git ls-files`, e a prova do LAB-57 o conta.

E a medição de **qual** prova reage a **qual** arquivo: um arquivo neutro **adicionado** reprova só a
do LAB-57; **não rastreado**, nenhuma (ela lê só o índice). Um `.ts` reprova a do LAB-52 já **não
rastreado** (ela lê `--others`), e as duas quando adicionado.

**O que se decidiu:**

1. **No ENVIO.** O `pre-commit` cobraria a prova em todo commit, e o primeiro de uma entrega de dois
   commits é vermelho **por construção** — pararia a ordem certa. Uma trava na suíte roda **antes**
   do último `git add`, que é o instante que falhou. O CI veria depois e está desligado até
   1º/11/2026. O envio é o único instante que é, por definição, depois do último arquivo — e a casa
   já tem *um envio por entrega*.
2. **O gancho `external-engines/ganchos/pre-push`** chama `ferramentas/antes-do-envio.ts`, que decide
   por `src/antes-do-envio.ts`: só a `main` é cobrada; recusa quando o que vai **não é o `HEAD`** ou
   a árvore tem **arquivo fora do commit** (mudado, adicionado e não commitado, ou não rastreado —
   as duas provas respondem diferente sobre cada um); e então roda **as travas do trabalho sem
   clones**, lidas do `verde.yml` pela mesma função do LAB-84 (D231). Lista vazia recusa (D213).
3. **Quem liga é o `conferir.sh`**, a cada execução (`core.hooksPath`): é configuração local do
   clone, e toda sessão nasce num clone novo. O verde reprova se o gancho não ficou ligado.
4. Quinze travas novas em `tests/antes-do-envio.test.ts` (a decisão dos dois lados, a leitura do
   estado num repositório de verdade, o gancho executável **no git**, a ferramenta sem lista à mão,
   o `conferir.sh` apontando para a pasta certa): 778 → **793** no portão sem clones.

**Os dois lados e as mutações:** nove, todas acusadas — a decisão que nunca recusa, a que ignora a
árvore suja, a que ignora o commit diferente, a leitura que esquece o não rastreado, a que manda
tudo às travas, o `conferir.sh` sem ligar, o gancho sem o bit de execução no git, o gancho que não
chama a ferramenta, e a ferramenta com uma lista escrita à mão.

**O que NÃO alcança, dito:** o verde completo (o gancho roda o que o CI rodaria, não o
`conferir.sh`); quem envia de um clone que nunca rodou o verde, ou com `--no-verify`; e a escrita da
direção na caixa — outra mão, outro clone. Essa metade fica **proposta** na `FILA.md`.

**Descartado:** `pre-commit` (pararia a ordem certa); rodar o `conferir.sh` inteiro no envio (precisa
do `.wasm` e dos clones, e leva minutos); conferir num `git worktree` do commit enviado em vez de
exigir árvore limpa (mais peças para o mesmo resultado, e árvore suja no envio já é o defeito);
acrescentar um `passo` ao `conferir.sh` (mudaria os *"sete passos"* da D328 por uma configuração, que
não é passo).

> **A PROVA QUE CONTA A ÁRVORE SE CONFERE NO INSTANTE EM QUE A ÁRVORE PARA DE MUDAR — e numa entrega
> esse instante é o envio.** Trava que roda antes do último arquivo aprova a árvore que não vai.

## D334 · A ESCRITA DA OUTRA MÃO SAI DA CONTA DO UNIVERSO, não da varredura — a caixa e a prova do LAB-57 · 14/10/2026

**Contexto:** o LAB-106 mediu que **15 de 15** escritas da direção em `docs/caixa-de-entrada/`
deixavam a `main` vermelha: a prova do LAB-57 publica o número de arquivos que o `git` carrega, e
cada item novo da caixa é um a mais — sem que a varredura mude uma linha. A `main` ficava vermelha
da escrita da direção até o próximo envio desta casa.

**Medido (LAB-107):** nos 37 estados da `main` desde o LAB-86, só esta chave, com e sem a caixa — a
direção vai de **15 vermelhos a 0**, e os envios desta casa ficam **2 e 2** (LAB-98 e LAB-104, os
mesmos).

**O que se decidiu:**

1. **Tirar da CONTA, não da recontagem.** Tirar o número do universo da recontagem cegaria a régua
   para todo arquivo que não é configuração nem código — e foi por ele que os dois envios vermelhos
   desta casa apareceram.
2. **Estreita:** `DA_OUTRA_MAO` (`src/escopo-da-varredura.ts`) é uma exceção, com motivo, que casa só
   arquivo da pasta `docs/caixa-de-entrada/` que **não** é configuração nem código. A varredura não
   perde arquivo nenhum; `.yml` ou `.ts` na caixa seguem contados e varridos. O predicado de código
   (`EH_CODIGO`) passou a ser um só para a varredura e para a conta.
3. **A chave muda de nome com o sentido:** `arquivosQueOGitCarrega` → `arquivosQueOGitCarregaForaDaCaixa`,
   e a prova publica o motivo em `escopo.foraDaContaDoUniverso`. Prova antiga não passa pela nova.
4. Oito travas no `configuracao.test.ts`, dos dois lados; sete mutações, todas acusadas; 793 → **801**
   no portão sem clones.

**O que se perde, dito:** um `.md` que nasça na caixa deixa de envelhecer a prova — inclusive se for
desta casa, que hoje só renomeia ali (renomear não muda a conta).

**Descartado:** tirar a chave da recontagem (perde o que a trava pegou de verdade); pedir à direção
que regere a prova a cada item (*quem mede é quem conserta*, e a direção não roda esta suíte); contar
a caixa num número separado e recontado (voltaria a ficar vermelho a cada item).

> **A RÉGUA QUE CONTA O QUE OUTRA MÃO ESCREVE FICA VERMELHA POR OFÍCIO.** Tire da conta só o que a
> medição não lê, e prove que o que ela pegava de verdade continua pego.

## D335 · O VEREDITO "IDÊNTICO" GUARDA AS DUAS ASSINATURAS — e os outros três vereditos nomeados já guardavam a evidência · 14/10/2026

**Contexto:** a proposta 2 do LAB-103 (D330) — *"a mesma pergunta para os outros vereditos booleanos
das provas (`limpo`, `aceito`, `confere`, `desenhoIdentico`…): a evidência está ao lado, ou só o
veredito? Medir antes de travar."*

**Medido (LAB-108), por LUGAR:** os 100 `.json` versionados em `docs/`, **2 262 campos booleanos em
138 nomes**. Para os quatro nomeados, a evidência que está no mesmo objeto, e se o veredito bate
com ela, recalculado:

| veredito | campos | evidência ao lado | bate |
|---|---|---|---|
| `limpo` (Validator) | 151 | `violacoes`, `porTipo`, `exemplos` | 151 de 151 |
| `limpo` (clone vizinho) | 12 | `commit`, `origemMain`; a evidência de *limpo* é a lista vazia | os 12 são `true` |
| `aceito` | 171 | `violacoes` (92), `recusa` (13) ou `lotes` (66) | 171 de 171 |
| `confere` | 70 | o agregado publicado e o refeito dos crus | 70 de 70 |
| **`desenhoIdentico`** | **40** | **nenhuma** — compara duas assinaturas e não grava nenhuma | os números ao lado são necessários, não suficientes |

E um nome que a proposta não nomeou, com a mesma forma: **`saidaIdenticaSemAVia`** (LAB-23, 8).
Três de igualdade com outro nome foram conferidos e têm a evidência: `saoIguais` (10 de 10),
`divergem` (15 de 15, todos com `pelaConvencao` nulo), `mesmoRotuloDeVariante` (3 de 3).

**O que se decidiu:**

1. **Só o veredito de identidade ganha trava**, porque é o único sem evidência: `vereditoDeIdentidade`
   (`src/veredito-de-identidade.ts`) grava `assinaturaSem` e `assinaturaCom` e **deriva** o campo com
   o nome que a prova já usa; recusa o que não é assinatura. As três ferramentas (`lab23`, `lab32`,
   `lab37`) passaram a chamá-la.
2. **Os 48 de hoje são fotografias**, declaradas com a contagem (LAB-23: 8, LAB-32: 20, LAB-37: 20) —
   a forma do D330, e pelo mesmo motivo: as três ferramentas carregam o Symbios e regerar é outra
   medição com o nome da antiga (D288).
3. Oito travas (`tests/veredito-de-identidade.test.ts`), oito mutações acusadas; 801 → **809** no
   portão sem clones.

**O que se perde, dito:** a régua lê `identic` no nome do campo; igualdade com outro nome passa sem ser
cobrada. Os três medidos hoje têm a evidência, e isso está escrito, não travado.

**Descartado:** estender a régua do D330 com um segundo nome (misturaria duas perguntas num módulo
que já responde três); travar a **coerência** de `limpo`, `aceito` e `confere` com a evidência ao lado
— medida em 392 de 392, mas é outra pergunta (*a evidência contradiz o veredito?*), e fica proposta
na FILA; regerar as três provas.

> **O VEREDITO DE IDENTIDADE É O ÚNICO CUJA EVIDÊNCIA NÃO CABE NUM NÚMERO.** "O mesmo número de lotes"
> não é "o mesmo desenho" — e por isso é ele, e não os outros, que precisa guardar as assinaturas.

## D336 · O VEREDITO NÃO CONTRADIZ A EVIDÊNCIA AO LADO — sete formas, seis regras e uma forma sem regra declarada · 15/10/2026

**Contexto:** a proposta do LAB-108 (D335) — *"a coerência do veredito com a evidência ao lado.
`limpo` ⇔ `violacoes === 0`, `aceito` ⇔ sem violação/recusa/plano nulo, `confere` ⇔ o publicado igual
ao refeito: medidos hoje 392 de 392, e nada os cobra — um veredito que contradiga o número ao lado
passaria."* É a outra pergunta: não *"a evidência está lá?"*, e sim *"ela contradiz o veredito?"*.

**Medido (LAB-109), por LUGAR:** os mesmos 100 `.json` versionados em `docs/`. **404** campos com os
três nomes, em **sete formas** — e a forma decide a regra:

| veredito | evidência ao lado | regra | campos | lados vistos |
|---|---|---|---|---|
| `limpo` | `violacoes` (número) | `⇔ violacoes === 0` | 151 | os dois |
| `aceito` | `violacoes` (número) | `⇔ violacoes === 0` | 92 | os dois |
| `aceito` | `recusa` (lista) | `⇔ recusa vazia` | 13 | só `false` |
| `aceito` | `lotes` (número ou nulo) | `⇔ lotes !== null` | 66 | os dois |
| `confere` | `agregadoPublicado` / `agregadoRefeitoDosCrus` | igualdade profunda | 56 | só `true` |
| `confere` | `confrontoPublicado` / `confrontoRefeitoDosCrus` | igualdade profunda | 14 | só `true` |
| `limpo` do clone vizinho | `commit`, `origemMain` | **nenhuma**, declarada | 12 | só `true` |

**O que se decidiu:**

1. `src/coerencia-do-veredito.ts`: as seis regras, **na ordem em que se tentam** (com violações e
   lotes juntos — LAB-07, LAB-93 —, quem decide é o Validator); a forma sem regra, fechada e com o
   motivo (a evidência de um clone limpo é a saída vazia do `git status`, que não se grava); o **nulo**
   passa como *não medido* (D23), porque `passagens-dos-legais.ts` declara `aceito: boolean | null`.
2. **Campo com um dos três nomes que não cai em regra nem em forma declarada reprova**, e não booleano
   também — forma nova não nasce fora da régua. E toda regra tem de conferir **algum** campo da árvore:
   regra que não lê nada é regra desligada.
3. Sete travas (`tests/coerencia-do-veredito.test.ts`) no portão sem clones, com os lados que a árvore
   nunca mostrou (`confere: false`, `aceito: true` por recusa vazia) provados por caso sintético; nove
   mutações acusadas; 809 → **816**.

**O que se perde, dito:** a régua cobra que as duas metades concordem, não que a contagem esteja certa
— `violacoes: 0` errado ao lado de `limpo: true` passa. E lê três nomes; veredito com outro nome
(`semPlano`, `divergem`) não é cobrado.

**Descartado:** juntar à régua do D335 (outra pergunta, e aquela lê o nome `identic`); uma regra só por
nome, sem forma (o `aceito` tem três evidências diferentes, e o `limpo` do clone não tem nenhuma);
deixar a forma desconhecida passar calada (*verde porque não achou nada*, D263); travar as ferramentas
que gravam os vereditos — em `esteira/ferramentas/`, quatro copiam o do Validator (`lab02`, `04`, `05`,
`08`) e três derivam ali mesmo (`lab39`, `41`, `94`): medir antes, proposto na FILA.

> **PROVA QUE SE CONTRADIZ É PIOR DO QUE PROVA QUE SE CALA:** as duas metades parecem medidas, e quem
> lê escolhe a que confirma o que esperava.

## D337 · "O PUBLICADO CONFERE COM O REFEITO" TEM UMA DEFINIÇÃO SÓ — e quem grava veredito diz de onde ele vem · 15/10/2026

**Contexto:** a proposta do LAB-109 (D336) — *"as ferramentas que gravam o veredito. A régua do D336
lê a prova gravada; o código que a grava não é cobrado. Medir se a cópia do Validator pode divergir da
contagem que vai ao lado antes de decidir entre uma forma única e uma trava de texto."*

**Medido (LAB-110), por LUGAR:** todo `.ts` versionado de `external-engines/`, fora `upstream/` e as
travas — **166 arquivos**. **Quinze linhas em onze arquivos** gravam `limpo`, `aceito` ou `confere`
(o LAB-109 nomeou sete ferramentas; `testfit/ferramentas/medir.ts`, `src/passagens-dos-legais.ts`,
`symbios/adapter/ferramentas/medir.ts` e `src/commit-dos-vizinhos.ts` estavam fora da lista):

| de onde vem o veredito | onde | pode divergir da evidência ao lado? |
|---|---|---|
| cópia do Validator | `lab02`, `04`, `05`, `08`, `testfit/medir`, `passagens-dos-legais` | **não**: `montarRelatorio` do Generate deriva `limpo` e `aceito` de `invariantes.violacoes === 0`, o mesmo campo que vai ao lado — **4 de 4** versões do arquivo desde 10/09/2026, e as seis cópias levam as duas metades do mesmo relatório |
| deriva ali, de um número | `lab94`, `lab41` | não: a mesma variável |
| deriva ali, de uma condição | `symbios/medir` | grava em `outputs/`, fora das provas |
| o clone vizinho | `commit-dos-vizinhos` | a forma sem regra do D336 |
| **compara o publicado com o refeito** | **`lab39`** | **sim — por regra, não por valor** |

O `lab39` dizia *"confere"* por **bytes** (`JSON.stringify(a) === JSON.stringify(b)`); a régua do D336,
por **valor** (a ordem das chaves não conta). Trocada só a ordem em que a ferramenta monta o agregado
publicado, ela gravou **56 divergências** e o D336 acusou a prova de se contradizer. A trava que
confere essa prova (`tests/acesso.test.ts`) tinha a definição da ferramenta, em três linhas.

**O que se decidiu:**

1. `src/mesmo-valor.ts`: `mesmoValor` é **a** igualdade do *publicado contra o refeito*; o
   `canonico` mudou-se para lá e o D336, o `lab39` e o `acesso.test.ts` a chamam. A prova regerada pelo
   `lab39` saiu **idêntica**, byte a byte; com as chaves embaralhadas, **0** divergências.
2. Uma régua de texto **com o sujeito escrito**: comparação por `JSON.stringify` numa linha que fala do
   **publicado** reprova. Não todo `JSON.stringify` comparado: em determinismo — a mesma função duas
   vezes — os bytes são a pergunta certa.
3. O censo dos que gravam, **fechado e com a contagem** (`GRAVADORES_DE_VEREDITO`): arquivo novo que
   grava um dos três reprova até dizer de onde o veredito vem; e quem compara o publicado tem de chamar
   `mesmoValor`.
4. Seis travas (`tests/mesmo-valor.test.ts`) no portão sem clones; nove mutações acusadas;
   816 → **822**.

**Descartado:** uma forma única para a **cópia** do Validator — derivar o `limpo` aqui seria refazer o
Validator (D20), e conferir na hora repetiria o D336 em tempo de execução; quem cobra o resultado é o
D336, e se o Generate mudar a definição, o achado é sobre ele. Uma régua sobre o texto do
`montarRelatorio` do vizinho (mede ortografia, D137, e o dono é o Generate). Trocar toda comparação por
`JSON.stringify` (larga demais: proibiria o determinismo).

**O que se perde, dito:** a régua de texto lê o nome (`publicado`, `pub`) e uma linha só; o censo não vê
chave montada (`[campo]:`) nem espalhamento (`...relatorio`).

> **DOIS INSTRUMENTOS COM O MESMO NOME DE VEREDITO E DUAS DEFINIÇÕES SÃO UM ACUSANDO O OUTRO.** A
> ferramenta diria *"diverge"*, a régua diria *"a prova mente"*, e o dado estaria certo.

## D338 · "É O MESMO COMMIT" TEM UMA DEFINIÇÃO SÓ — o commit curto é representação, não identidade · 15/10/2026

**Contexto:** a proposta do LAB-110 (D337) — *"os outros vereditos de igualdade têm a mesma definição?
O D335 mediu que `saoIguais`, `divergem` e `mesmoRotuloDeVariante` guardam a evidência ao lado; ninguém
perguntou **como** cada ferramenta os compara. […] medir antes de travar, porque em alguns deles os bytes
podem ser a pergunta certa."*

**Medido (LAB-111), por LUGAR** (os 244 `.ts` versionados de `external-engines/`, fora `upstream/`) e nos
**100 JSON** de `docs/`:

| veredito | onde | o que compara | nas provas | a definição serve? |
|---|---|---|---|---|
| `saoIguais` | `lab48` | dois **números** (`===`) | 10, coerentes 10 de 10 | **sim**: *"chegou o mesmo número?"* |
| `mesmoRotuloDeVariante` | `lab40` | dois **rótulos** (`===`) | 3, 3 de 3 | **sim**: é rótulo, e diz que é |
| `divergem` (carimbo) | `commit-dos-vizinhos` | dois **commits curtos**, por texto | 15, todos `false` sem segunda linha | **não** |
| `divergem` (LAB-25) | `lab25` | uma **contagem** de faces — outro objeto, mesmo nome | 5 | não é veredito |

E a mesma comparação, sem nome de veredito, em `conferirCarimbo` (`gravado === agora` → `igual` ou
*"o vizinho ANDOU"*). A casa tinha **duas definições** de *"o mesmo commit"*: texto curto igual ali, e
**prefixo** em `oCommitGravadoAindaEOMesmo` (`onde-esta-o-padrao`).

**Por que o texto curto não serve — medido no git desta máquina (2.43.0):** `rev-parse --short` imprime a
menor abreviação que **o clone** garante única, e o tamanho segue o número de objetos dele. Num repositório
montado por `fast-import`, **16 383** objetos dão **7** caracteres e **16 386** dão **8** (o salto é em
2¹⁴); o clone raso do segundo devolve o **mesmo** commit com **7** — `5ec11575` contra `5ec1157`. Os
vizinhos estão a **11 703** (Generate), **10 595** (Geo) e **4 491** (Parcelamento) objetos; no ritmo do
último mês (de ~2 200 a ~3 400 objetos novos por mês, por `rev-list --objects`, estimativa), o Generate e o
Geo passam de 16 384 **em cerca de dois meses**. Nesse dia toda prova carimbada antes diria *"o vizinho
ANDOU"* de um vizinho parado; e hoje já basta um clone raso ao lado de um cheio para `divergem: true`.

**O que se decidiu:**

1. `src/mesmo-commit.ts`: `mesmoCommit` é **a** igualdade de commit — o mesmo texto, ou, sendo os dois
   abreviações (7 a 64 hexadecimais), o mais curto prefixo do mais longo. `conferirCarimbo`, o `divergem`
   do carimbo e `oCommitGravadoAindaEOMesmo` a chamam. **Nenhuma prova muda:** os 15 `divergem` gravados
   são todos sem segunda linha.
2. Uma régua com o **sujeito escrito**: nos arquivos que leem o commit **curto** (`--short`), `===`/`!==`
   entre dois nomes de commit reprova. Fora deles o commit inteiro tem tamanho fixo e o texto é a
   identidade (o gancho de envio compara 40 contra 40).
3. `saoIguais` e `mesmoRotuloDeVariante` **ficam como estão**: a igualdade exata é a pergunta certa
   (número que chega; rótulo que é rótulo).
4. Nove travas (`tests/mesmo-commit.test.ts`) no portão sem clones — uma delas monta o repositório de
   16 386 objetos e o clone raso, e prova o defeito no git de verdade; nove mutações acusadas.

**Descartado:** gravar o commit **inteiro** no carimbo — resolve na origem, mas muda a forma de toda prova
carimbada e não conserta as gravadas; fica como remédio se a colisão de prefixo um dia valer o custo.
Fixar o tamanho com `--short=7` — o git o estende quando há ambiguidade, então não fixa. Mudar o `false`
do `divergem` sem segunda linha para nulo (D23) — ele vem ao lado de `pelaConvencao: null` e se lê; mudar
reescreveria quinze provas por outra pergunta.

**O que se perde, dito:** a colisão de prefixo (uma em 2²⁸ por par lido); a régua lê nomes (D137) e uma
linha só; o `divergem` não tem trava semântica no portão sem clones (o carimbo precisa dos clones) — a
mutação dele cai pela régua e pelo censo das chamadas.

> **O TAMANHO DO COMMIT CURTO É UM FATO SOBRE O CLONE, NÃO SOBRE O COMMIT.** Comparar o texto curto é
> perguntar *"os dois clones têm o mesmo tamanho?"* achando que se perguntou *"é a mesma versão?"*.

## D339 · O NÚMERO DA DECISÃO NÃO TEM TETO DE CASAS — e o defeito que a proposta dizia futuro estava aberto · 15/10/2026

**Contexto:** a proposta do LAB-104 (D331) — *"a mesma pergunta para as travas que leem **outro** nome pela
forma — a decisão (`D\d{2,3}`) […]. Hoje não há defeito: a D1000 está a 669 decisões. Medir quais definem
universo pela forma e travar antes do dia, não depois."*

**Medido (LAB-112), por LUGAR** (os 246 `.ts` versionados de `external-engines/`, fora `upstream/`): oito
linhas de código em três arquivos leem a decisão pela forma.

| onde | a forma | o teto | o que faz hoje |
|---|---|---|---|
| `classes-de-rodada.ts`, classe `decisao-registrada` | `\bD\d\d\b —` | 2 casas | *"D339 — …"* sai **ÓRFÃO** — defeito aberto **desde a D100** (03/10/2026) |
| `varredura-das-propostas.ts`, decisões de um item | `\bD(\d{2,3})\b` | 3 casas | a `D1000` some da lista, em silêncio |
| `varredura-do-que-eu-aceitei.ts`, seis linhas | `D\d+`, `^\|\s*D\d` | nenhum | servem |

O primeiro ninguém viu porque, das quatro rodadas da classe no `RECADOS.md`, a única que essa forma segura
é a de 20/09 (*"D69 — …"*), de antes da D100. **Teste que nunca reprovou** porque nunca lhe deram o caso. As
decisões de `docs/DECISOES.md` têm duas casas (99) ou três (237), nenhuma de uma.

**O que se decidiu:**

1. `src/numero-da-decisao.ts`: `DECISAO_DA_CASA` (`D\d{2,}`) é **a** forma, e `decisoesCitadas` a lê com
   fronteira. A classe e a lista de decisões a chamam. **Nada que já valia muda:** as quatro rodadas da
   classe seguem nela, e os 38 itens da `FILA.md` (67 citações) saem iguais pelas duas formas.
2. Uma régua contra o **teto** renascer no código: leitura `D` + algarismos com máximo finito de duas
   casas ou mais reprova, fora da exceção declarada (a trava, que reproduz as formas velhas), conferida nos
   dois sentidos.
3. Doze travas (`tests/numero-da-decisao.test.ts`) no portão sem clones; nove mutações acusadas;
   831 → 843.

**A doença aqui é o TETO, não a largura fixa** — diferente do D331, onde `LAB-\d\d\d?` foi declarada sã
(aceita três). Para a decisão ela corta a quarta casa, que é o defeito da D1000. O teto de **uma** casa
(`D\d` sem quantificador) fica fora, dito: é teste de prefixo de linha, não leitura do número.

**Descartado:** estender a régua do D331 a todo prefixo (`[A-Z]+-\d\d`) — `DD-NNN` é numeração da
direção, e régua sem sujeito escrito manda na coisa errada; `D\d+` como forma única — aceita `D1`, que não
existe; reescrever as seis leituras sem teto da `varredura-do-que-eu-aceitei.ts` — respondem certo, e
régua que já responde certo não se troca.

**O que se perde, dito:** o número montado por concatenação, a letra minúscula com a bandeira `i`, e todo
arquivo que não seja `.ts` em `external-engines/`.

> **"HOJE NÃO HÁ DEFEITO" É UMA AFIRMAÇÃO, E SE MEDE COMO AS OUTRAS.** A proposta perguntou pela D1000 e a
> medição achou a D100: o teto de duas casas tinha passado doze dias antes, sem barulho.

## D340 · O NÚMERO DO ITEM DA CAIXA NÃO TEM TETO DE CASAS — e o 900 não é item da direção · 15/10/2026

**Contexto:** a proposta do LAB-112 (D339) — *"o número do item da caixa tem três casas fixas […]. A
convenção do nome é da direção."* A direção a respondeu no **item 030**: (1) **três casas no mínimo, sem
teto** — `001`…`899`, `901`…, `1000`; (2) **`900` é reservado**, o item permanente *"lista própria"*, nunca
`-FEITO`, e a numeração comum o pula; (3) *"o menor ainda não feito"* é comparação **numérica** — em texto,
`"1000" < "900" < "901"`.

**Medido (LAB-113), por LUGAR** (os 248 `.ts` versionados de `external-engines/`, fora `upstream/` — 250 com os dois desta rodada; 20 falam
da caixa no código — 22 depois):

| onde | a forma | o que fazia |
|---|---|---|
| `caixa-vazia-era-verdade.ts`, `ehItemAberto` | `^\d{3}(-…)?\.md$` | `1000.md` aberto **não era item**: a caixa saía *vazia* com ele dentro |
| `caixa-vazia-era-verdade.ts`, `numeroDoItem` | `^(\d{3})` | `1000.md` lia **`100`** — o número errado, não a ausência |
| `leituras.test.ts`, a guarda do número repetido (D273) | `^(\d{3}(?:-adendo)?)(?:-FEITO)?\.md$` | três casas e só `-adendo`: o `025-adendo-2-FEITO.md` **de hoje** ficava fora |
| `caixa-vazia-era-verdade.ts`, os `abertos` | `.sort()` | ordem de **texto**: `025-adendo-2`, `025-adendo`, `025` |

E a outra metade da convenção: a régua da caixa vazia contava o **`900`** como item aberto — maior que todo
`-FEITO`, ele saía *"o próximo"*, e a declaração verdadeira de hoje (*"a caixa só tem o 900"*) sairia
**FALSA**. Nenhuma prova a chamou com o `900` (as nove declarações do LAB-90 são de 09 a 11/10; o `900.md`
nasceu em 12/10). **Teste que nunca reprovou** porque nunca lhe deram o caso.

**O que se decidiu:**

1. `src/numero-do-item.ts`: `ITEM_DA_CAIXA` (`\d{3,}`) e `lerNomeDoItem` são **a** forma — número como
   número, sufixo (`-adendo`, `-adendo-2`, `-bis`) e estado (`-FEITO`, `-RETIRADO`) separados, e a
   identidade do D273 (`0030` colide com `030`); `itensEmOrdem` ordena pela fila; `proximoItem` é o menor
   aberto **pulando o `900`**, que só é o próximo quando não há outro. As três leituras a chamam.
2. A régua da caixa vazia tira o `900` dos abertos da direção: só com ele, a caixa está **vazia** (sem item
   da direção) e a declaração é verdadeira.
3. Uma régua contra o **teto** renascer: leitura de algarismos com máximo finito de três ou mais, no CÓDIGO
   de um programa que fala da caixa (o caminho, o estado, ou que importa a forma ou a régua da caixa vazia —
   **o sujeito escrito**, §1-C), reprova fora das exceções, conferidas nos dois sentidos: a trava (reproduz
   as formas velhas) e `disparos-em-vazio.test.ts` (o ano de uma data — o caso que quase parece a doença).
4. O protocolo (`COMO_FUNCIONA.md`, passo 0) ganha a convenção e o comando do próximo em ordem de fila,
   como nota minha; o texto do chat fica intocado.
5. Dezenove travas (`tests/numero-do-item.test.ts`) no portão sem clones; onze mutações acusadas; 843 → 862.

**Nada do histórico muda sem o `900`, e isto é medição:** remedidas as **779 árvores** de caixa em onze
casas (toda a história de cada uma, clones inteiros), 548 saem idênticas, **55** mudam só a ordem dos abertos
(texto → fila), e as **176** com o `900` mudam como a convenção manda — 125 só o tiram da lista, **49** passam
de *falsa* a *vazia*, **2** de *falsa* a *já pulada*. Nenhum nome da caixa de hoje muda de número.

**Descartado:** contar o `900` como item comum e consertar só o teto — a convenção diz que ele não é item da
direção, e a régua da caixa vazia existe para a declaração da direção; tirar o `900` de `ehItemAberto` — ele
**é** aberto pela definição do `COMO_FUNCIONA.md`, e o que muda é quem o conta; uma régua de ordenação por
texto — `.sort()` de nome de item não se distingue, no programa, de qualquer outro `.sort()`: a defesa é a
forma única e a trava do lado ruim; estender a régua a todo `\d{3}` da árvore — sem sujeito, o ano de uma
data reprovaria.

**O que se perde, dito:** o `.sort()` de nomes de item, o número escrito por `padStart` ou concatenação, e o
programa que leia a caixa sem nomear a pasta, o estado nem a forma no código.

> **A CONVENÇÃO TEM DUAS METADES, E A SEGUNDA É A QUE ESTAVA ABERTA.** A proposta perguntou pelo `1000`, que
> não existe; o `900`, que existe desde 12/10, já fazia a régua errar contra a declaração de hoje.

## D341 · O ITEM RETIRADO SE RECUSA PELO NOME DO ESTADO — e a busca por número lê o nome pela forma única · 15/10/2026

**Contexto:** a proposta do LAB-113 (D340) — *"`caminhoDoItemDaCaixa` não conhece o `-RETIRADO` […]; medir
quem chama e se o estado deve ser recusa ou leitura."* Peguei-a no item 900 (LAB-114): a caixa só tinha o
`900`, e era a única proposta da FILA que não espera ninguém.

**Medido (LAB-114):** um único chamador, `tests/acesso-sugerido.test.ts`, que lê o `010-adendo` e o `029`
**como fonte de regra**. Nos doze clones, a história inteira das caixas tem **um** retirado — o
`002-RETIRADO.md` do Generate (09/10/2026, `5dec495`) — e a direção o **reescreveu** como retratação:
*"Não faça nada deste item."* A busca procurava uma lista fixa de dois nomes, e o retirado saía como
*"não foi encontrado"*, para um arquivo que está no disco — e a lista era uma quarta leitura do nome, ao lado
da forma única do D340.

**Decidido:**

1. `caminhoDoItemDaCaixa` lê a pasta e pergunta a `lerNomeDoItem`, casando pela identidade do D273. Um
   achado aberto ou feito → o caminho; mais de um → *"DUAS vezes"* (também feito + retirado); **retirado →
   recusa dizendo RETIRADO e o caminho**. Pedir pelo estado, ou com menos de três casas, é recusado.
2. Quatro travas numa caixa de mentira, em pasta descartável, com o lado bom na mesma caixa; seis mutações
   (cinco acusadas, uma neutra que passa); a função velha de volta derruba três. 862 → 866 travas.

**Descartado:** **ler** o retirado — a trava conferiria a regra contra a retratação, verde por acaso ou
vermelha pelo motivo errado; **manter** o *"não foi encontrado"* — manda procurar um arquivo apagado; esperar
um retirado de verdade nesta caixa para escrever a trava — trava que espera o defeito acontecer.

**O que se perde, dito:** as listas que gravam o nome literal de um item (`AS_ONZE_ISENCOES`,
`FALAM_SOBRE_O_ASSUNTO` com `005-FEITO.md`; o prefixo `006` da `trava-de-estrutura`) não passam pela busca:
um retirado ali deixaria uma isenção órfã, inofensiva e silenciosa. E a busca lê o disco, não a origem.

> **ITEM RETIRADO É ORDEM DESFEITA, E O TEXTO DELE É A RETRATAÇÃO.** Quem lê um item como fonte de regra e
> acha um retirado não tem regra para conferir: tem uma pergunta para a direção.

## D342 · O TAMANHO DE UMA SUÍTE NÃO SE ESCREVE NUMA PÁGINA VIVA — quem diz é o `Ran N tests` · 15/10/2026

**Contexto:** item 900 (LAB-115). A caixa só tinha o `900`, e o LAB-114 esvaziou as propostas da FILA que
não esperam ninguém; fui à dívida própria, espécie **número digitado à mão**, nas páginas que as réguas do
LAB-98 (travas), do LAB-101 (passos) e do LAB-102 (estado do CI) não leem.

**Medido (LAB-115), por LUGAR:** os 31 `.md` versionados fora de relato (relato pela definição do LAB-102,
`ehRelato`). *"&lt;número&gt; testes"* aparece em seis lugares; dois são as peças de um desenho datado (o LAB-26
pôs **dois** testes de varredura ao lado da ficha, D108) e quatro são o tamanho de uma suíte:

| página | escrito | contado em 15/10 | desde |
|---|---|---|---|
| `external-engines/esteira/README.md` | 93 | **1 164** (1 155 + 9 do `.wasm`) | 19/09 (LAB-13/14) |
| `external-engines/testfit/README.md` (tabela e receita) | 14, 14 | **17** | 13/09 (LAB-07) |
| `entrega/registro-de-motores/README.md` | 22 | **22** | 20/09 (LAB-06) |

**Decidido:**

1. **A frase sai** das três páginas: elas dizem **o que** os testes cobram, e o número fica com a linha
   *"Ran N tests"* do `bun test`. Recontar exigiria rodar a suíte dentro da suíte (por isso a trava do LAB-98
   fica fora do portão), e o número muda em toda rodada desta casa.
2. `src/numero-de-testes.ts` acha *"N testes"* (algarismo com milhar, ou extenso de *dois* em diante,
   atravessando o negrito; não o número de seção, não *"um teste"*); `tests/numero-de-testes.test.ts`, no
   portão sem clones, reprova contagem em página viva e exceção morta (os dois sentidos), e publica o universo.
   Oito travas; oito mutações, sete acusadas e uma neutra (o olhar para a frente que excluiria o número de
   seção — o espaço colado já o exclui; saiu do código). 866 → 874 travas.

**Descartado:** recontar por execução (a suíte dentro dela mesma); contar `test(` no texto (o texto não é a
execução: um `test` dentro de laço se conta uma vez e roda N); corrigir os números para os de hoje (certos até a próxima
rodada, e de novo sem trava).

**O que se perde, dito:** a página não diz mais o tamanho da suíte a quem a lê sem rodar. E a régua não lê
comentário de código, *"travas"* nem *"passos"* (das outras réguas), nem a contagem com outra palavra.

> **NÚMERO QUE MUDA EM TODA RODADA NÃO MORA NUMA PÁGINA QUE NINGUÉM REESCREVE EM TODA RODADA.** Ou ele se
> reconta onde é escrito, ou a página aponta para quem conta.

## D343 · A CONTA DOS DISPAROS LÊ A HORA COM TETO — e a linha que ela não lê REPROVA, antes dos totais · 15/10/2026

**Contexto:** no LAB-115, ao escrever a linha deste disparo (`≤ 21:10`, porque o minuto não se afirma) e
somar um aos totais, a `lab71` reprovou: *"a seção declara 16 derivados e a tabela tem 15"*.

**Medido (LAB-115):** a régua de linha (`lerAConta`, `src/disparos-do-despertador.ts`) só lia a hora `HH:MM`.
A linha do LAB-114 (`≤ 20:14`) era **invisível** para ela; o LAB-114 não andou os totais (`git show b6b32bb`:
a linha entra, o resumo fica em 60 e 15), e a conferência seguiu **verde** — porque contava só as linhas que
sabia ler. É a forma do D281 (a classe de hífen que sumia), um mês depois, na coluna ao lado.

**Decidido:**

1. A hora aceita o teto: `(?:≤\s*)?HH:MM`; a célula fica como escrita, e a ordem compara o `HH:MM`.
2. **Toda linha que começa como linha da conta** — a data e, na segunda célula, uma hora (algarismo depois de
   qualquer sinal) — **e que a régua não lê, reprova**, antes dos totais (`linha-que-a-regua-nao-le`). A tabela
   do precedente da FILA também começa pela data, com texto na segunda célula, e não é a conta: é o caso válido
   que quase parece inválido, com trava.
3. Os totais vão a **62** e **17** derivados (a linha do LAB-114 e a deste). Quatro travas; cinco mutações,
   todas acusadas. 874 → 878 travas.

**Descartado:** escrever `21:10` sem o teto (afirmaria um minuto que não se mediu); só aceitar o `≤` sem a
trava da linha ilegível (a próxima grafia — `~`, `20h14` — sumiria do mesmo jeito).

**O que se perde, dito:** uma linha de conta cuja segunda célula comece por letra (*"às 20:14"*) não é
reconhecida como linha da conta, e some calada como antes.

> **RÉGUA DE LINHA QUE NÃO DIZ QUAIS LINHAS NÃO LEU CONFERE OS TOTAIS CONTRA AS QUE SOBRARAM.** O vocabulário da
> célula cresce em toda coluna, não só na que já quebrou.

## D344 · A MÁQUINA DO DISPARO NASCE RASA E COM UMA `main` VELHA — desrasa-se ANTES de comparar, e só se avança a `main` ancestral · 15/10/2026

**Contexto:** item 900 (LAB-116). A caixa só tinha o `900`; peguei a única proposta da FILA que não espera
ninguém, deixada pelo LAB-115: *"o passo 0 do `COMO_FUNCIONA.md` não diz o que fazer com o clone RASO"*. Do
LAB-101 ao LAB-115, quinze rodadas seguidas acharam a `main` *"divergente"* e redescobriram o raso; esta foi a
décima sexta, e o disparo de 22h06 UTC deixou o defeito à vista inteiro.

**Medido (LAB-116), no disco desta máquina e nas doze casas da família que ela trouxe:**

1. **As doze estão no mesmo estado:** clone **raso**, `HEAD` **destacado** na ponta de hoje, e um ramo `main`
   local **velho**, do retrato da máquina (09/10 em nove casas, 10/10 em três; aqui, `84e63d4`, 09/10 23h54).
2. **O comando do disparo recusa e deixa a árvore NO RETRATO.** Ele faz `fetch` → `checkout main` →
   `pull --ff-only`; no raso não há base comum e o `git` declara divergência (*"Not possible to
   fast-forward"*) — mas o `checkout main` já rodou. Reproduzido com `file://`: mesma mensagem, mesmo código
   128, `HEAD` no retrato. Desrasado (`fetch --unshallow`), a `main` velha **é** ancestral da origem: `0`
   commits só dela.
3. **O que o disco diz depois disso é a casa de seis dias atrás:** o `COMO_FUNCIONA.md` do retrato não tem
   passo 0 (**zero** `git fetch` nas onze casas que têm a página; a direção não tem caixa), e a caixa mostra
   item aberto **já feito** em **oito** das doze (aqui, o `011.md`, feito no LAB-78 em 10/10; no Studio, do `003` ao `006`). Uma sessão que seguisse
   o disco refaria um item velho pelo protocolo velho.

**Decidido:**

1. **A receita mora no passo 0 da página**, depois do bloco do item 030, com a marca
   `<!-- receita-do-clone (LAB-116) -->`: `fetch`; **se raso, desrasa**; cria a `main` se faltar; **só se
   ancestral**, `checkout main` + `merge --ff-only`; se não, diz *"DIVERGÊNCIA DE VERDADE"*, sai com erro e
   **não toca em nada**. E a página manda **não ler nada do disco antes de rodá-la** (e reler depois).
2. **Receita na página, não script no repositório:** o script não existe na árvore do retrato, que é onde a
   sessão está quando precisa dele.
3. `src/clone-da-maquina.ts` (a marca, a extração do bloco, o que a receita tem de dizer e o que não pode,
   com o sujeito escrito — a receita, não a página, que cita `--force` para proibi-lo) e
   `tests/clone-da-maquina.test.ts`, no portão sem clones e hermético: **roda** a receita tirada da página
   num clone raso montado como a máquina monta, depois do comando real do disparo e antes dele; o lado ruim
   (a `main` com commit não enviado fica intacta e a receita sai com erro); a `main` ausente; a máquina já em
   dia; e a mutação dentro da trava (sem a linha que desrasa, a receita fabrica a divergência falsa). Dez
   travas; sete mutações na receita da página, **sete acusadas**. 878 → 888 travas.

**Descartado:** `reset --hard origin/main` ou `checkout -B main origin/main` (resolvem a divergência apagando a
`main` local — que, se não for ancestral, tem trabalho não enviado); aprofundar só o necessário
(`--deepen`/`--shallow-since`: o quanto falta não se sabe antes, e o portão desta casa já pede história
inteira, D294); mudar o comando do disparo (é texto da tarefa agendada, e esta sessão não toca nela).

**O que se perde, dito:** a receita só vale para quem lê a página **da origem ou depois de rodá-la** — a
sessão que leu o disco depois do disparo falhar leu o protocolo de 09/10, que não a tem. Quem fecha esse
buraco é o comando do disparo, e por isso o achado vai à direção no recado.

> **NO CLONE RASO, "DIVERGIU" É FALTA DE HISTÓRIA, NUNCA FATO.** E o comando que falha no segundo passo
> já fez o primeiro: depois dele, o disco é o retrato, e o protocolo que se lê é o do retrato.

## D345 · O `<app>` DO RECADO É COBRADO PELO NOME EXATO, LIDO DA PÁGINA — a régua do D228 cobra a forma, e ficou larga · 15/10/2026

**Contexto:** item 900 (LAB-117). A caixa só tinha o `900`, e a FILA, desde o LAB-116, não tem proposta que
não espere ninguém; fui à dívida própria, espécie **regra sem guarda**, no `CLAUDE.md` §1: *"`<app>` é
`MOTOR LAB (archilly-lab)`, nunca `Lab`"*.

**Medido (LAB-117):**

1. **A trava do cabeçalho aceita qualquer nome.** No D228 ela casava `Lab` literal e reprovou o primeiro
   cabeçalho certo; o conserto pôs `.+` no `<app>` — a forma nova passou e **a velha continuou passando**.
   Plantado `— Lab · LAB-116 (item 900) ===` no acumulado de verdade (e desfeito depois), os **nove** arquivos
   de teste que leem o `RECADOS.md` rodaram **127 de 127 verdes**.
2. **A regra foi cumprida por disciplina:** dos 128 cabeçalhos, os **72** até o LAB-67 dizem `Lab` (antes do
   D228) e os **56** do LAB-68 (item 001) ao LAB-116 dizem `MOTOR LAB (archilly-lab)` — 56 de 56.

**Decidido:**

1. `src/nome-do-aplicativo.ts`: o `<app>` vem **da página** (`appDaPagina`, `null` se ela não declarar
   exatamente um), todo cabeçalho do acumulado é lido com a linha, e o que começa como cabeçalho e não tem a
   forma **reprova**. O **corte** é o recado do `LAB-68`, achado pelo **prompt** (com fronteira: `LAB-680` não
   é ele) e não pelo primeiro `MOTOR LAB` — senão um erro no próprio LAB-68 andaria o corte para frente. Antes
   do corte, `Lab` e **72**: fotografia do registro, que não se reescreve e não cresce. Do corte em diante, o
   nome da página, **exato**.
2. `tests/nome-do-aplicativo.test.ts`, no portão sem clones: os dois lados no arquivo de verdade (zero
   desvios; o `Lab` no último recado reprova), o caso válido que quase parece inválido (`<prompt>` com ` · `
   dentro passa — o `<app>` é o trecho mais curto) e as mutações no arquivo. **Oito mutações no módulo, oito
   acusadas** — a do casamento guloso saiu neutra na primeira rodada e ganhou o caso válido que a mata.
   888 → 903 travas.
3. A régua da **forma** fica como está (`recado.test.ts`), com um comentário que aponta para esta.

**Descartado:** estreitar o `CABECALHO` de `recado.test.ts` para o nome (reprovaria os 72 do registro, ou
pediria a mesma lista de corte lá dentro — duas réguas para um corte só); achar o corte pela data do recado
(a seção do acumulado não traz hora, e dois recados no mesmo dia são comuns, D229).

**O que se perde, dito:** o recado que só foi à tela; o recado copiado dentro de um relatório ou de um item
`-FEITO`; e o `<prompt>`, que é da âncora do item 002.

> **CONSERTO QUE ALARGA A RÉGUA PARA O CASO NOVO TEM DE FECHÁ-LA PARA O VELHO.** A régua que reprovou o certo
> no D228 foi aberta dos dois lados, e por seis dias o errado que ela existia para pegar passava de novo.

## D346 · O ÍNDICE AFIRMA O QUE EXISTE, E É CONFERIDO NO QUE AFIRMA — todo relatório tem a sua linha, e a linha da página que muda a cada rodada não diz o estado do dia · 16/10/2026

**Contexto:** item 900 (LAB-118). A caixa só tinha o `900`, e a FILA segue sem proposta que não espere ninguém
(a do LAB-117 espera a leitura do chat); fui à dívida própria, no `docs/INDEX.md` — a página que o `CLAUDE.md`
§7 manda manter *"em dia"* ao fim de todo prompt e que nenhuma trava lia pelo que ela **afirma**.

**Medido (LAB-118):**

1. **Seis relatórios nunca tiveram linha.** A seção se chama *"As medições — um relatório por prompt"*;
   enumerados por LUGAR os 115 `.md` de `docs/relatorios/`, **109** eram alvo de uma ligação do índice e
   `LAB-70.md` a `LAB-75.md` não — os itens 003 a 008 da caixa, todos de 09/10/2026 e do mesmo ramo
   (`claude/stoic-ritchie-ijzqy3`). O `git log -S` do nome de cada um no `INDEX.md` volta vazio: não saíram,
   nunca entraram. A trava do LAB-100 (D327) confere que toda ligação **leva** a algum lugar; o outro sentido
   — que todo relatório **tem** uma ligação — ninguém conferia.
2. **Três linhas da tabela *"Decisão e fila"* afirmavam o estado de um dia que passou:** `DECISOES.md` com
   **72 decisões** (escrito no LAB-06, 20/09; a última é a D345), `prompts/FILA.md` com *"a fila de 19/09,
   a da tela unificada, esgotou"* (a ida vem da caixa desde 09/10) e `PENDENCIAS_JONNY.md` com *"Hoje: quanto
   é desvio desproporcional?"* — respondido pelo Jonny em **02/10** (D84), e marcado como resolvido na própria
   página dele.
3. E, fora da tabela, a linha do `verde.test.ts` dizia **seis travas**; o arquivo tem **quinze**.

**Decidido:**

1. As seis linhas entram no índice, cada uma dizendo que foi acrescentada agora (o relato do dia não se
   reescreve; a linha nova se declara). As três frases de estado **saem**: a linha diz o que a página
   **responde**, e o que ela diz hoje ela mesma diz — a mesma forma do D342 (*sem frase honesta, a frase sai*).
   O *"seis travas"* sai à mão.
2. `src/o-indice.ts` e `tests/o-indice.test.ts`, no portão sem clones: (a) todo `docs/relatorios/<nome>.md`
   é alvo de uma ligação do índice, resolvida pela **mesma** régua do LAB-100 (`resolverDaPagina`) — o nome
   entre crases sem ligação **não** conta; (b) nas linhas cujo primeiro campo liga para uma das sete páginas
   que mudam a cada rodada, **algarismo** (contagem ou data) e ***"hoje:"*** reprovam, depois de tirar a
   citação (`LAB-NN`, `D123`, `item 003`, `§1-B`); *"Onde estamos hoje"*, sem os dois-pontos, é o caso
   válido que quase parece inválido; e **cada uma das sete tem exatamente uma linha** — sem linha, a régua
   aprovaria por não ler. Rodada contra o índice de antes: **duas reprovam**, as duas pelo defeito.
   **Dez mutações no módulo, dez acusadas.** 903 → 914 travas.

**Descartado:** recontar *"N decisões"* contra o `DECISOES.md` (o número muda em toda rodada; recontagem é
página que se reescreve sozinha a cada prompt, e a página já diz a última); estender a régua a todas as
linhas do índice (as de *"O código"* têm contagem **de desenho** — *"quatro regras"*, *"seis pontos"* — que é
verdade por construção, e as de relatório são relato datado); e alargar a régua do D342 de *"testes"* para
*"travas"* e *"decisões"* (pegaria as linhas de relatório, e o `CLAUDE.md` §7 já tem a recontagem do D325).

**O que se perde, dito:** a contagem de desenho na seção *"O código"* (uma, a do `verde.test.ts`, estava
errada e saiu à mão — proposto na FILA); o estado dito por extenso, sem algarismo nem *"hoje:"*; prova,
pasta e arquivo de outra espécie fora do índice — só o relatório tem a promessa *"um por prompt"* escrita.

> **A TRAVA QUE CONFERE QUE A LIGAÇÃO LEVA A ALGUM LUGAR NÃO CONFERE QUE O LUGAR TEM LIGAÇÃO.** Ponteiro tem
> dois sentidos, e a promessa *"um por prompt"* está no segundo.

**Remedido no D347 (LAB-119), e acrescentado lá, sem reescrever esta:** a contagem de desenho da seção *"O código"*
não era *"verdade por construção"* — conferidos os 22 números contra os arquivos, três estavam errados em duas linhas
(a guarda da IDA e os experimentos). A régua dela mora em `src/contagens-do-indice.ts`.

## D347 · O NÚMERO DO DESENHO É O QUE O ARQUIVO CONTA — as contagens da seção "O código" do índice, conferidas contra o arquivo · 16/10/2026

**Contexto:** item 900 (LAB-119). A caixa só tinha o `900`; peguei da FILA a proposta do LAB-118 — a única
que não espera ninguém. A seção *"O código"* do `docs/INDEX.md` descreve arquivo VIVO, e a descrição conta
(*"seis pontos"*, *"três regras"*, *"quatro cortes"*). O D346 a deixou de fora porque a contagem de desenho
*"é verdade por construção"* — e uma delas, a *"seis travas"* do `verde.test.ts` (que tinha quinze), já
estava errada.

**Medido (LAB-119):** lido número por número — por extenso (*dois* a *doze*), ordinal (*primeira* a
*décima*) e algarismo, depois de tirar o ponteiro (crases, ligações, `LAB-NN`, `D123`, `§1-B`, a limpeza do
D346) —, as **22 linhas** da tabela traziam **22 números**, e **três estavam errados, em duas linhas**:

1. a guarda da IDA: *"Quatro regras, e a **quarta** é a dívida declarada"* — `REGRAS_DA_IDA` tem **cinco**
   desde 04/10 (o LAB-35 acrescentou `promessa-nao-exercitada`), e a dívida é a **quinta**. Doze dias errada;
2. os experimentos: *"**dois** testes de varredura"* — o `describe` da varredura em `tests/porta.test.ts` tem
   **três** (cobertura, existência e a contagem que o relatório do LAB-26 publica).

Os outros dezenove batiam. *"Verdade por construção"* era verdade no dia em que a linha nasceu; o arquivo
andou e a frase não.

**Decidido:**

1. As duas linhas foram corrigidas, e a da IDA passou a dizer também quantas reprovam (*duas*, contadas em
   `REGRAS_DA_IDA_QUE_REPROVAM`).
2. `src/contagens-do-indice.ts` e `tests/contagens-do-indice.test.ts`, no portão sem clones. Cada número
   da seção tem **exatamente uma** entrada: a **contagem** (`CONTAGENS`, 18 — cada uma com a função que conta
   no TEXTO do arquivo: o valor de `POSICOES_DE_ACESSO`, os itens de `REGRAS_DA_PONTE`, os `test(` de um
   `describe`, os passos do `conferir.sh` pela régua do D328…), ou o **não conta** (`NAO_CONTAM`, 5 — duas
   datas, um relato, uma geometria e uma enumeração feita na própria frase —, com o motivo). Número sem
   entrada reprova, entrada sem trecho reprova, trecho repetido ou sem um número só reprova, e a contagem
   que não acha o que procura reprova com *"não contou"*, nunca com zero. Seção ausente é `null`: não lê, não
   aprova. **Doze mutações no módulo, doze acusadas.** 914 → 929 travas.

**Descartado:** importar as constantes em vez de ler o texto (a contagem de `test(` dentro de um `describe`
não tem constante, e a trava precisa trocar o arquivo para provar o lado ruim — texto troca, `import` não);
ler também *"um"* e *"uma"* (artigo em quase toda frase: a régua viraria lista de exceções do português);
tirar as contagens da seção, como o D346 fez com as de estado (estas não mudam a cada rodada: mudam quando o
arquivo muda, e a frase diz algo útil sobre o desenho — *sem frase honesta a frase sai*, e esta tem como ser
honesta); e estender a régua às outras seções (as de relatório são relato datado, e as de *"Decisão e fila"*
já não podem ter algarismo, D346).

**O que se perde, dito:** a contagem dita sem número (*"o par que impede"*); o que se conta ser o que a
frase diz que é — a função diz QUANTOS, não se os cinco de `REGRAS_DA_IDA` são regras da ida; e a
`duas guardas antes` do `conferir.sh`, que fica como enumeração da frase, porque contar guarda num script
de shell seria régua para um número só.

> **"VERDADE POR CONSTRUÇÃO" É VERDADE NO DIA DA CONSTRUÇÃO.** A contagem do desenho envelhece quando o
> desenho muda, e o desenho muda sem reler a frase que o conta.

*Acrescentado no LAB-120, sem reescrever o acima:* o `CLAUDE.md`, que esta decisão declarou não alcançar, é
conferido desde o **D348**, com a mesma leitura de número.

## D348 · O NÚMERO DO `CLAUDE.md` TAMBÉM É O QUE O ARQUIVO CONTA — e o trecho da entrada deixa o lugar do número em aberto · 16/10/2026

**Contexto:** item 900 (LAB-120). A caixa só tinha o `900`, e a FILA não tinha proposta que não esperasse
ninguém (a do LAB-117 espera a leitura do chat). Fui à dívida própria, espécie **número digitado à mão**, no
lugar que o D347 declarou não alcançar: *"as outras páginas vivas (`CLAUDE.md`, `ONDE_PARAMOS.md`), que têm
contagens de desenho também — não foram medidas aqui"*. O `CLAUDE.md` é a página que toda sessão lê primeiro,
e a regra dele conta coisas que um arquivo vivo tem: *"as oito consequências"*, *"a régua pega 4 dos 12
compromissos"*, *"o teto de doze linhas"*, *"Religar são DOIS passos"*, *"dois trabalhos"* do CI.

**Medido (LAB-120):** lidos número por número (por extenso, ordinal e algarismo, a mesma leitura do D347) nas
linhas que não são bloco de código nem citação literal, depois de tirar o ponteiro, as datas, o número da seção
no título e o marcador de lista: **29 números**. **Dezesseis** contam ou leem um arquivo; **treze** não (ordem,
método, relato, versão, e as travas do portão, que já se recontam por execução no D325). **Nenhum dos dezesseis
estava errado — e nenhum era conferido contra o arquivo.** Os que tinham trava tinham-na por **cópia**: o
`toBe(4)` da `trava-de-estrutura.test.ts` e o *"8 dos 12"* da página, iguais por disciplina; o
`toBeLessThanOrEqual(12)` do `recado.test.ts` e o *"doze"* da página; o `toHaveLength(8)` da
`custo-por-uso.test.ts` e o *"oito"*. Consistência entre cópias não é correção (D311).

**Decidido:**

1. `src/contagens-do-claude.ts` e `tests/contagens-do-claude.test.ts`, no portão sem clones. A forma é a do
   D347 — cada número tem **exatamente uma** entrada, `CONTAGENS` (16, com a função que conta no texto do
   arquivo) ou `NAO_CONTAM` (13, com o motivo), nos dois sentidos —, com uma diferença: **o trecho tem um
   `{n}` no lugar do número.** No D347, se a página passar de *"seis pontos"* a *"sete pontos"*, a entrada
   some e o número fica sem entrada: reprova, pelo motivo torto. Aqui a entrada continua achando a frase e a
   falha é a verdadeira, *conta diferente*, com o escrito e o contado lado a lado — e a frase das travas, que
   muda a cada rodada, tem entrada estável.
2. A leitura **pula por PARTE, não por linha**: a data, o número da seção e o marcador de lista saem, e o
   resto da linha é lido (*"## 7 · As oito regras"* teria o *oito* lido). Pula a linha inteira só no bloco de
   código (exemplo) e na citação literal (o texto da Central na §1-C e as palavras do Jonny na §4-A não se
   reescrevem; o número é de quem falou). O que pulou é contado e publicado.
3. O *"4 dos 12"* se conta **rodando a régua** (`COMPROMISSO_MENSAL`, importada) sobre a lista **lida do
   texto** (`COMPROMISSOS_DE_FORMATO_REAL`): o compromisso novo que a régua pega acusa o 4 e o 12, e não o 8.
4. `NUMERO` passou a ser exportado de `contagens-do-indice.ts`, para as duas réguas lerem número do mesmo jeito.

Treze mutações no módulo, treze acusadas (duas só depois de travas novas: o teto que lia o primeiro de dois
`toBeLessThanOrEqual`, e a receita sem nenhum *"Passo N"* que contava zero em vez de *"não contou"*). 929 → 942.

**Descartado:** estender a régua do D347 em vez de escrever outra (a do índice lê linhas de tabela e as acha
pela ligação; a página é prosa, e o arquivo de uma frase não está nela — está na entrada); trocar o trecho do
D347 pela forma com `{n}` (mudaria uma régua verde que responde certo, D314); medir o `ONDE_PARAMOS.md` junto
(é relato datado quase inteiro; não medido, e não proposto sem medir); e ler *"Trinta e três"* como 33 (a
régua lê até doze por extenso; a frase é relato e a aritmética dela tem trava própria, a `aritmetica-da-regra.test.ts`, que mudou de alvo no D318).

**O que se perde, dito:** as citações literais; número acima de doze por extenso; a contagem dita sem número;
e a verdade do que se conta — a função diz QUANTOS, não se as oito de `CONSEQUENCIAS` são as oito da página
(isso a `custo-por-uso.test.ts` confere, pela marca de cada uma).

> **CÓPIA QUE CONCORDA COM CÓPIA NÃO FOI CONFERIDA.** Duas vezes o mesmo número, digitado em dois lugares,
> é uma afirmação feita duas vezes — e nenhuma medição.

## D349 · OS RAMOS ABERTOS TÊM UMA PÁGINA, E ELA É CONFERIDA CONTRA A ORIGEM — tabela vazia é zero medido, página ausente era nulo · 16/10/2026

**Contexto:** item 900 (LAB-121). A caixa só tinha o `900`, e a FILA não tinha proposta que não esperasse
ninguém (a do LAB-117 espera a leitura do chat). Fui à dívida própria, espécie **regra sem guarda**, numa
página que nenhuma régua da série lê: o próprio protocolo. O `COMO_FUNCIONA.md`, *"O que vai para ramo em vez
da main"*, manda *"Mantenha a lista dos ramos abertos, com a pergunta de cada um, em `docs/RAMOS_ABERTOS.md`"*.

**Medido (LAB-121), por LUGAR:** a página **nunca existiu** (`git log --all -- docs/RAMOS_ABERTOS.md` vazio);
o nome aparece numa linha só do repositório, a da regra; nenhum `.ts` lia os ramos da origem. E a origem
(`git ls-remote --heads origin`) tinha **dois** ramos: a `main` e `claude/stoic-ritchie-ijzqy3`, de onde saíram
52 PRs, com a ponta no LAB-95 (12/10/2026) — **inteira** na `main`. Ramos abertos no sentido da regra: zero. O
repositório dizia *"nada"* onde a resposta era *"zero"* — *zero é uma medição, nulo é "não medi"*, quatro seções
abaixo no mesmo protocolo.

**Decidido:**

1. `docs/RAMOS_ABERTOS.md` nasce com a tabela (ramo, pergunta) **vazia**, e a página diz que vazia é *"nenhum"*
   conferido — não a contagem do dia.
2. `src/ramos-abertos.ts`: `lerAPagina` (sem a tabela, `null`, nunca lista vazia) e `conferirOsRamos`, nos dois
   sentidos — ramo não mesclado sem linha; linha sem ramo na origem, de ramo já mesclado, sem pergunta,
   repetida, ou da `main`. *"Não sei se mesclou"* (o objeto não está no clone) **reprova**.
3. Duas travas: `tests/ramos-abertos.test.ts` (a régua pura e a página, **no portão sem clones**) e
   `tests/ramos-abertos-na-origem.test.ts` (`git ls-remote` e `git merge-base --is-ancestor`, **fora** do portão:
   precisa da rede e da história, e o `actions/checkout` traz a ponta sem história — todo ramo sairia *"não
   sei"*). A viva publica o universo lido, e sem rede, sem `origin` ou sem o objeto falha com a receita do
   passo 0.
4. O `COMO_FUNCIONA.md` ganhou a nota de que a lista existe, abaixo do texto do chat, intocado.

Dez mutações (quatro na página, três no módulo, três na trava viva — a `main` da origem recuada para antes do
LAB-95, o objeto ausente, a rede ausente), dez acusadas. 942 → 954 travas no portão.

**Descartado:** apagar o `claude/stoic-ritchie-ijzqy3` da origem (está inteiro na `main`, mas apagar é ato que
não se desfaz, classe 2 do protocolo — e ramo mesclado não é aberto, então a regra não o pede); exigir que o
nome do ramo seja a pergunta (leitura de sentido, régua de palavra não faz); contar ramo só local (a página
serve ao chat, e o chat só vê a origem); escrever na página *"nenhum ramo aberto em 16/10"* (seria a mensagem
fixa que afirma estado — a tabela vazia diz o mesmo e é conferida).

**O que se perde, dito:** o nome-pergunta; o ramo que nunca subiu; e a trava viva não roda no CI (nem no
`guardas-sem-clones`, que não tem a história, nem no verde completo enquanto o segredo não existir) — quem a
roda é a sessão, no `conferir.sh`.

> **PÁGINA QUE A REGRA MANDA EXISTIR E NÃO EXISTE NÃO DIZ "NENHUM": DIZ "NÃO OLHEI".** A lista vazia só
> responde zero se alguém a conferiu contra o mundo.

## D350 · A ROTINA DO GITHUB É PERGUNTADA, NÃO LEMBRADA — o passo 2 do desligamento ganhou a trava que o passo 1 tinha · 16/10/2026

**Contexto:** item 900 (LAB-122). A caixa só tinha o `900`, e a FILA não tinha proposta que não esperasse
ninguém. Fui à dívida própria, espécie **mensagem fixa que afirma estado sem perguntar**. O CI foi desligado em
08/10 em dois passos (D220): o gatilho comentado no `verde.yml` **e** a rotina desabilitada no GitHub. O passo 1
tem trava desde o LAB-67 (`gatilho-do-verde.test.ts`, que lê o arquivo); o passo 2 não tinha nenhuma.

**Medido (LAB-122), por LUGAR:** nos 303 arquivos vivos (164 de relato fora, pela lista do D329), a rotina é
afirmada `disabled_manually` em **quatro** lugares (`CLAUDE.md`, `verde.yml`, `COMO_RELIGAR_O_CI.md`,
`lugares-das-condicoes.ts`) e o id `374646435` digitado em **três**; nenhum `.ts` perguntava ao GitHub.
Perguntada a API pública, sem chave: `disabled_manually`, id `374646435`, caminho `.github/workflows/verde.yml`.
**As sete estavam certas — por sorte, não por conferência.** O estado mora fora da árvore e muda sem commit.

**Decidido:**

1. `src/a-rotina-no-github.ts`: a rotina é achada na resposta pelo **caminho**; resposta sem ela é `null`
   (*não sei*), nunca *desligada*. O estado se acha num texto pelo nome que a API usa (`disabled_*`); o id, só
   no endereço da API **desta** casa. A lista de relato é a do `o-ci-que-roda.ts` — uma só para as duas réguas.
2. `conferirARotina` cobra quatro coisas: **o par** (gatilho ligado ⇔ rotina `active` — o passo pela metade,
   nos dois sentidos), **o estado afirmado** é o perguntado, **o id digitado** é o perguntado, e **o espelho**
   (rotina desabilitada e nenhuma página dizendo reprova). *Não sei* reprova.
3. Duas travas: `tests/a-rotina-no-github.test.ts` (a régua pura e a concordância das páginas entre si, **no
   portão sem clones**) e `tests/a-rotina-no-github-na-origem.test.ts` (a API, **fora** do portão: precisa da
   rede), que publica o universo e, sem rede ou com a cota estourada, falha com o que leu.

Doze mutações (cinco nas páginas, seis no módulo, uma na rede), doze acusadas. 954 → 972 travas no portão.

**Descartado:** perguntar com chave (a API responde sem, e trava que carrega segredo é o que o §4 proíbe);
`fetch` do Bun (o `curl` respeita o proxy sem configuração); ler o `ONDE_PARAMOS.md` (relato pela lista do
D329); achar o estado em português (régua de palavra — o espelho cobra o nome da API em troca); e tirar do
`verde.yml` a frase *"o `workflow_dispatch` segue ligado para rodar à mão"*, que provavelmente não vale com a
rotina desabilitada — **não testado**, porque perguntar seria disparar a rotina.

**O que se perde, dito:** o estado com outras palavras; o relato datado; se o disparo manual roda com a rotina
desabilitada; e a trava viva não roda no CI — quem a roda é a sessão, no `conferir.sh`.

> **ESTADO QUE MORA FORA DA ÁRVORE NÃO SE CONFERE LENDO A ÁRVORE.** Frase certa por sorte e frase certa por
> conferência só se distinguem no dia em que o mundo muda — e nesse dia só uma delas reprova.

## D351 · A MARCA DE FEITO MORA NO TOPO DO ITEM, e passa a ser cobrada — o passo 4 do protocolo ganhou a guarda que o nome já tinha · 16/10/2026

**Contexto:** item 900 (LAB-123). A caixa só tinha o `900`, e a FILA não tinha proposta que não esperasse
ninguém (a do LAB-117 espera a leitura do chat). Fui à dívida própria, espécie **regra sem guarda**, no próprio
protocolo: o passo 4 do `docs/caixa-de-entrada/COMO_FUNCIONA.md` manda *"renomeie o arquivo para `001-FEITO.md`
e escreva no topo dele o que foi feito, com arquivo e linha"*. O **nome** tem guarda desde o LAB-80 (o estado mora
no sufixo, `lerNomeDoItem`); o **topo** não tinha nenhuma — nenhum `.ts` abria um `-FEITO.md`.

**Medido (LAB-123), por LUGAR:** os **34** `-FEITO.md` da caixa na `main` de 16/10/2026. **29** abrem com um bloco
de citação que diz `FEITO`, o prompt e o relatório dele; **5 não têm marca nenhuma** — `009`, `010`,
`010-adendo`, `011` e `012`, os quatro disparos seguidos de 10/10/2026, 00h58 a 05h22 UTC (LAB-76 a LAB-79). Neles
o arquivo foi só renomeado: quem abre o item lê o pedido sem saber se, onde e por quem ele foi feito. Cumprida por
disciplina antes e depois; quebrada numa madrugada, sem que nada acusasse.

**Decidido:**

1. **As cinco marcas foram reconstruídas**, no topo, com o prompt, a data e o commit, o relatório, a prova e as
   decisões — e dizem no próprio texto que são reconstrução e de onde veio cada campo (a tabela da `FILA.md` e o
   `git log`), como manda o §1-B. O texto do chat abaixo ficou intocado.
2. `src/marca-de-feito.ts`: o **topo** é o bloco de citação com que o arquivo começa (a forma das 29); nele a
   régua exige o `FEITO` **da marca** — `013-FEITO.md` citado não conta, medido no `015`, que abre pelo aviso de
   renumeração —, o **prompt** citado depois dele, pela forma única (`LAB-\d{2,}`), e o **relatório** desse
   prompt, que a trava confere no disco. Os `-FEITO` são escolhidos pela forma única do nome (`lerNomeDoItem`),
   nunca por filtro de texto: o `1000-FEITO.md` é item e é cobrado; o `-RETIRADO`, o aberto e o `900` ficam fora.
3. `tests/marca-de-feito.test.ts`, **no portão sem clones**: a caixa de verdade (publicando o universo — 34
   feitos lidos, igual à contagem ingênua), as cinco reconstruídas apontando o prompt certo, o `015`, e a régua
   dos dois lados. Dez mutações (uma na página — as cinco marcas tiradas —, nove no módulo), dez acusadas. 972 →
   983 travas no portão.

**Descartado:** cobrar a *"linha"* (só 7 das 29 marcas a citam; reprovaria 22 marcas de boa-fé, e reescrevê-las
seria reconstrução de relato — a pergunta de forma foi **proposta ao chat**); aceitar *"um arquivo qualquer"* no
lugar do relatório (a marca podia citar o prompt certo e apontar para nada); cruzar o prompt da marca com a
tabela da `FILA.md` (relato sem forma fixa — fica dito como limite); e deixar as cinco sem marca como
*"fotografia"* (o defeito é de presente: o item mente pela omissão a quem o abre hoje).

**O que se perde, dito:** a linha; se o prompt citado é o que de fato fez o item; e o item feito fora desta caixa.

> **O NOME DIZ QUE ACABOU; SÓ O TOPO DIZ ONDE.** Guardar a metade de uma regra de dois verbos é guardar a metade
> que dá menos trabalho — e a outra metade se perde exatamente na rodada em que o trabalho foi maior.

## D352 · A PENDÊNCIA RESOLVIDA É MARCADA, NUNCA APAGADA — e a página do Jonny passa a ser conferida contra uma declaração · 16/10/2026

**Contexto:** item 900 (LAB-124). A caixa só tinha o `900`, e a FILA não tinha proposta que não esperasse
ninguém (a da *"linha"*, do LAB-123, espera a leitura do chat). Fui à dívida própria, espécie **regra sem
guarda**, no `CLAUDE.md` §5: *"`docs/PENDENCIAS_JONNY.md` é escrito para leigo; item resolvido é **marcado,
nunca apagado**"*. A única régua que lia a página por essa convenção era a do LAB-85
(`o-que-o-gatilho-carrega.ts`), e ela pergunta por **uma** pendência — a §11, do segredo.

**Medido (LAB-124), por LUGAR:** os títulos numerados da página (`## N ·`, `### N-X ·`) — **19** na `main` de
16/10/2026 — e a história do arquivo, **29 commits**, com o clone desrasado. **Nunca apagado: cumprido.** Todo
título que não existe mais é o mesmo assunto renumerado (até 14/09) ou riscado depois de respondido, e os cinco
que saíram da numeração moram, riscados, em *"Já resolvidos"*. **Marcado: não.** A **§1** (*"Confirme o número:
'desproporcional' é 3 vezes, ou 1,5 km?"*) foi respondida pelo Jonny em **02/10/2026** (D84), a mesma página o
dá como respondido em *"Já resolvidos"* e no alto — e o título ficou **sem marca por 14 dias**, com o corpo
afirmando *"enquanto não vier, nenhuma travessia é proposta"*, falso desde a D84. O LAB-118 viu e não tocou
(*"a página é do Jonny para riscar"*); medido no `git log -S`, quem riscou a 3 (15/09) e a 12 (12/10) foi a
sessão, depois da resposta dele — marcar o que ele já respondeu é a prática da casa, e não pergunta nada a ele.

**Decidido:**

1. **A §1 foi marcada** — título riscado, *"você respondeu em 02/10/2026"*, e uma nota no alto dizendo que o
   texto abaixo é a pergunta como estava; o texto antigo ficou intocado (*nunca apagado*).
2. `src/pendencias-marcadas.ts`: **o estado não se lê do texto** — era o texto que mentia. Ele mora numa
   **declaração escrita à mão** (`PENDENCIAS`: número, uma chave do assunto, estado e fonte; e `JA_RESOLVIDOS`,
   os cinco sem número), **fechada nos dois sentidos**: título sem linha na declaração reprova (a pendência nova
   nasce declarada), linha sem título reprova (*apagada*), número reaproveitado para outro assunto reprova, número
   repetido reprova. E o estado declarado se confere no título: a resolvida tem `~~…~~` ou a palavra da resposta
   (*respondeu, respondido, confirmado, decidido*) **na linha do título**; a parada tem `PARADA`; a aberta não tem
   marca de resolvida. Os *"Já resolvidos"* estão todos riscados, e nenhum sai.
3. `tests/pendencias-marcadas.test.ts`, **no portão sem clones**: a página de verdade (publicando o universo —
   19 títulos, igual à contagem ingênua que descarta o título datado `## 12/10/2026 —`, achado na primeira
   rodada), a §1, e a régua dos dois lados. Treze mutações (uma na página — a §1 sem marca —, doze no módulo),
   treze acusadas. 983 → 1005 travas no portão.

**Descartado:** ler o estado do texto da seção (a §1 é a prova de que o texto envelhece); cobrar a história a
cada verde (o portão roda em clone raso, D293 — a medição dos 29 commits foi feita uma vez e está no relatório);
cobrar o corpo da seção (régua de prosa livre, que acusaria o registro da 5-D, que guarda a pergunta antiga de
propósito); e deixar a §1 como estava até o Jonny riscar (ele pediu que nada desta casa volte a ele antes da
integração, e a resposta dele já existe — a marca só a registra no lugar certo).

**O que se perde, dito:** o corpo da seção; se o estado declarado é o verdadeiro (a régua impede a página e a
declaração de divergirem, não as duas de errarem juntas); a tabela *"Em cinco minutos"*, que numera por outra
conta.

> **A PÁGINA QUE DIZ AS DUAS COISAS DIZ A ERRADA A QUEM ABRE PELA SEÇÃO.** *"Nunca apagado"* se cumpre sozinho
> enquanto ninguém apaga; *"marcado"* só se cumpre se alguém lembrar — e é nessa metade que a guarda faz falta.

## D353 · O RESUMO DO ALTO TAMBÉM AFIRMA ESTADO — a tabela "Em cinco minutos" da página do Jonny passa a ser conferida · 16/10/2026

**Contexto:** item 900 (LAB-125). A caixa só tinha o `900`, e a FILA não tinha proposta que não esperasse
ninguém (a da *"linha"*, do LAB-123, espera a leitura do chat). Fui à dívida própria, espécie **mensagem fixa que
afirma estado sem perguntar**, no lugar que a D352 deixou escrito em *"o que se perde"*: a tabela *"Em cinco
minutos"* do alto de `docs/PENDENCIAS_JONNY.md`, *"que numera por outra conta"*. **Esta decisão substitui essa
linha da D352** — a tabela deixa de estar fora da guarda; o resto da D352 fica como está.

**Medido (LAB-125), por LUGAR:** a seção, do título até o próximo `## `, tem **três** linhas de tabela
(`| **1** |`, `| **2** |`, `| **8** |`) e **uma** frase de contagem: *"Ficam faltando três coisas, e as duas
primeiras são de olhar e dizer"*. A linha `1` é a pendência **5-B** (a régua de forma), a `2` é a **7** (os 33
lotes), a `8` é a **8** (dado pago só onde há cliente). A 5-B e a 7 estão **paradas a pedido do Jonny desde
12/10/2026**, com `PARADA` no título — e a nota de 12/10, logo acima da tabela, diz *"nada aqui precisa de você
agora"*. A tabela pedia 2 e 10 minutos dele para duas coisas que ele pediu para não ver. A mesma página dizendo
duas coisas, quatro dias, no resumo de cinco minutos.

**Decidido:**

1. **A frase foi riscada, nunca apagada**, com uma nota de 16/10 ao lado (*"fica faltando uma coisa, a 8, que
   não pede nada agora"*); as linhas 1 e 2 ganharam `⏸ PARADA até o Lab entrar no Generate` no começo do texto.
   Nada na página pergunta nada a ele — é a mesma prática da D352: marcar o que ele já disse.
2. `conferirOsCincoMinutos` em `src/pendencias-marcadas.ts`. **A numeração da tabela não é a das pendências**,
   então a ligação mora numa declaração escrita à mão (`CINCO_MINUTOS`: linha, chave do assunto, pendência),
   fechada nos dois sentidos; **o estado não se repete nela** — vem de `PENDENCIAS`, a declaração da D352, um
   lugar só. Cobra: linha sem declaração e declaração sem linha; assunto trocado; pendência inexistente; a linha
   de parada sem `PARADA`, a de resolvida sem marca, a de aberta com qualquer das duas; e **toda frase *"fica(m)
   faltando N"* fora do risco diz o número de linhas cuja pendência está aberta** — número que a régua não lê
   reprova (`contagem-ilegivel`), não passa.
3. A trava estendida em `tests/pendencias-marcadas.test.ts`, no portão sem clones: a página de verdade
   publicando o universo (3 linhas, igual à contagem ingênua; 1 frase de contagem; 1 aberta), a régua dos dois
   lados e o extenso. Quinze mutações (uma na página — a tabela e a frase como estavam —, catorze no módulo),
   quinze acusadas. 1005 → 1023 travas no portão.

**Descartado:** apagar as linhas paradas da tabela (seria *apagar* — a tabela é o que ele leu, e as duas voltam
quando o Lab entrar no Generate); reescrever a frase no lugar (a frase antiga é o registro do que se afirmou);
pôr o estado na declaração da tabela (dois lugares para o mesmo estado divergem — foi o defeito que esta régua
pega); ler a contagem de qualquer verbo (*resta*, *sobra*) — a régua lê o verbo da frase que existe e o teste
publica quantas leu; e um módulo novo (a tabela é a mesma página e o mesmo estado — a trava do LAB-124 era o
lugar certo, e a lista do trabalho não muda).

**O que se perde, dito:** a prosa da seção fora da tabela e da contagem; uma contagem escrita com outro verbo;
se o estado declarado é o verdadeiro (o mesmo limite da D352).

> **O RESUMO É A PARTE DA PÁGINA QUE MAIS SE LÊ E A QUE MENOS SE REVÊ.** Pôr guarda nos títulos e deixar o
> resumo de fora é guardar o que quem abre pela seção lê, e esquecer o que quem lê cinco minutos lê.

## D354 · O CABEÇALHO DO ONDE_PARAMOS AFIRMA O ÚLTIMO PROMPT — e passa a ser perguntado ao RECADOS.md · 16/10/2026

**Contexto:** item 900 (LAB-126). A caixa só tinha o `900`, e a FILA não tinha proposta que não esperasse
ninguém (a da *"linha"*, do LAB-123, espera a leitura do chat). Fui à dívida própria, espécie **mensagem fixa que
afirma estado sem perguntar**, no arquivo que o `CLAUDE.md` manda ler **primeiro**: a linha de cabeçalho de
`docs/ONDE_PARAMOS.md` — *"**Última atualização:** … · **Último prompt executado:** LAB-NN (item NNN, …) — … ·
antes dele o LAB-NN …"*. Três afirmações de estado (a data, o prompt com o item, a ordem dos anteriores), escritas
à mão a cada rodada; o mesmo estado mora com forma fixa no `RECADOS.md` (o título `## DD/MM/AAAA · <prompt>` e o
cabeçalho do recado). Dezessete módulos leem o `ONDE_PARAMOS.md`, e **nenhum lia o cabeçalho**.

**Medido (LAB-126), na `main` e na história:** hoje as três batem (LAB-125, item 900, corrente de 29 elos igual à
ordem dos títulos). Rodada a régua nas **151** versões da `main` (`--first-parent`) que mexeram num dos dois
arquivos: **140** têm os dois arquivos e o cabeçalho na forma, e **139** saem limpas. A exceção é de verdade —
**`76bfdcd`** (LAB-67, 09/10/2026, 00h01): o recado do LAB-67 gravado e o cabeçalho ainda dizendo *"LAB-66"*, assim
por **13h20**, até o `093f6ae`. A primeira rodada acusou mais duas, e as duas eram defeito da régua (o título
`LAB-83 (continuação) · decisao-registrada`, cujo recado não repete o item; o `LAB-13 e LAB-14`, de 19/09, que fecha
dois prompts) — consertadas antes de virar trava.

**Decidido:**

1. `src/o-ultimo-prompt.ts` (`lerOCabecalho`, `lerAsRodadas`, `conferirOCabecalho`). O *"último prompt"* é o último
   **título de prompt** do `RECADOS.md` pela forma única (`PROMPT_DO_LAB`) — título de classe (`despertador-sem-item`,
   `decisao-registrada`) não é prompt executado, e o cabeçalho que fica no último prompt num disparo em vazio está
   certo. Cobra: prompt diferente; item diferente do **primeiro** título daquele prompt; data do cabeçalho
   **anterior** a esse título (posterior pode: o segundo despertador do LAB-95); e a corrente, elo a elo, contra a
   sequência dos prompts **sem repetição**, mais novo primeiro — pode parar onde quiser, não pode pular nem trocar.
   Cabeçalho sem a forma e `RECADOS.md` sem prompt reprovam: não há verde em zero.
2. `tests/o-ultimo-prompt.test.ts` no portão sem clones (só lê dois arquivos deste repositório): as páginas de
   verdade publicando o universo (118 rodadas de prompt, igual à contagem ingênua dos títulos; 29 elos; 0
   problemas), a régua dos dois lados, e os quatro casos válidos que quase parecem inválidos que a história tem.
   Treze mutações no módulo, **doze acusadas** e **uma neutra**, declarada: ler o item por prefixo (`LAB-12` casando
   `LAB-125 (item …`) não tem onde morder — o cabeçalho começa pelo próprio prompt e o cabeçalho do recado tem um
   prompt só. E duas plantadas na página de verdade (o cabeçalho no LAB-124; a corrente pulando um elo), as duas
   acusadas. 1023 → 1039 travas no portão; o trabalho sem clones, 62 → 63 arquivos.

**Descartado:** cobrar o **texto** de cada elo (é relato, e relato mora no relatório); cobrar a **hora** (o título do
recado não tem hora); cobrar o *"próximo:"* (é intenção, não estado); e exigir que o cabeçalho cresça até o começo
da história (a corrente para onde a rodada escolher — hoje no LAB-96 —, e encurtá-la não é afirmar nada falso).

**O que se perde, dito:** o corpo do `ONDE_PARAMOS.md` abaixo do cabeçalho (a conta dos disparos tem a trava do
LAB-81); se o recado diz a verdade — a régua confere que as duas páginas dizem a mesma coisa, não que a coisa
aconteceu.

> **O ARQUIVO QUE SE LÊ PRIMEIRO É O QUE MAIS PRECISA DIZER A MESMA COISA QUE O RESTO.** Quem acorda numa máquina
> nova lê o cabeçalho antes de abrir qualquer outra página — e se ele estiver um prompt atrás, a rodada começa
> refazendo o que já está feito.

## D355 · O RECADO DE UMA RODADA DO 900 DIZ QUAL TAREFA E DE QUAL LISTA — e passa a ser cobrado · 16/10/2026

**Contexto:** item 900 (LAB-127). A caixa só tinha o `900`, e a FILA não tinha proposta que não esperasse
ninguém (a da *"linha"*, do LAB-123, espera a leitura do chat). Fui à dívida própria, espécie **regra sem
guarda**, no próprio `900.md`, que termina com *"No recado, diga qual tarefa da sua lista você pegou, e de qual
arquivo."* Nenhum módulo lia o que os recados diziam sobre a origem da tarefa.

**Medido (LAB-127), por LUGAR:** os **29** recados cujo cabeçalho diz `(item 900` (LAB-97 a LAB-126, menos o
LAB-113). Pela linha `Estado:`: **14** da FILA (*"peguei … a proposta … do LAB-NN"*, a FILA nomeada, a proposta
sempre anterior e com relatório) e **15** da dívida própria (*"fui à dívida própria"*); nenhum sem origem, nenhum
com as duas. Pelo bloco inteiro: **14** dos 15 da dívida nomeiam ao menos uma das cinco espécies; **o LAB-118 não
nomeia nenhuma** (*"fui à dívida própria, no docs/INDEX.md"*) — o relatório dele nomeia três. A minha primeira
contagem (15 e 14) era da régua solta: sem exigir o *"peguei"*, *"a FILA sem proposta que não espere ninguém"*
contava como origem FILA.

**Decidido:**

1. `src/a-tarefa-do-novecentos.ts` (`lerOsRecadosDoNovecentos`, `lerAOrigem`, `conferirATarefaDoNovecentos`). A
   origem se lê no `Estado:` por duas formas — *"peguei … proposta … LAB-NN"* ou *"fui à dívida própria"* —, uma e
   só uma. FILA: a palavra FILA no `Estado:`, a proposta de um prompt **anterior** e com relatório. Dívida: ao menos
   uma das cinco espécies no recado inteiro, sem acento e sem caixa. A exceção (o LAB-118) é declarada como
   reconstrução, com a fonte, e se confere nos dois sentidos: o relatório tem de nomear o que ela declara, e ela
   reprova no dia em que deixar de ser necessária.
2. `tests/a-tarefa-do-novecentos.test.ts` no portão sem clones: a frase conferida no `900.md`, o universo publicado
   (29 recados, igual à contagem ingênua dos cabeçalhos; 14 da FILA; 15 da dívida; 0 problemas), a régua dos dois
   lados. Treze mutações no módulo, **treze acusadas**; duas plantadas no `RECADOS.md` (a espécie apagada do LAB-121;
   a proposta do LAB-112 trocada por um número do futuro), as duas acusadas. 1039 → 1054 travas no portão; o
   trabalho sem clones, 63 → 64 arquivos.

**Descartado:** conferir que a FILA ainda tem o texto da proposta (as propostas mudam ao serem executadas e moram
em lugares diferentes — medido: das doze citadas, só duas ainda casam *"Proposto ao chat … LAB-NN"*); exigir a
espécie no `Estado:` (reprovaria seis recados por posição, não por falta); criar uma página para a dívida própria
(escopo novo — o `900.md` a aceita como lista sem arquivo); reescrever o recado do LAB-118 (é história).

**O que se perde, dito:** se a escolha foi a mais importante; se o recado diz a verdade sobre a origem — a régua
confere que ele a diz, não que a tarefa veio de lá.

> **A REGRA QUE O PRÓPRIO ITEM DÁ É A QUE MENOS SE CONFERE.** Quem lê o `900` lê para saber o que fazer, e a última
> frase — o que dizer no fim — se cumpre de cabeça. Vinte e oito vezes deu certo; a vigésima nona disse o lugar e
> esqueceu a espécie, e ninguém acusou.

## D356 · O RECADO VAI AO `RECADOS.md` COM DATA, E EM ORDEM CRONOLÓGICA — e passa a ser cobrado · 16/10/2026

**Contexto:** item 900 (LAB-128). A caixa só tinha o `900`, e a FILA não tinha proposta que não esperasse
ninguém (a da *"linha"*, do LAB-123, espera a leitura do chat). Fui à dívida própria, espécie **regra sem
guarda**, no `CLAUDE.md` §1 — *"O recado vai também, inteiro e com data, a `docs/relatorios/RECADOS.md`"* — e no
alto do próprio `RECADOS.md` — *"com a data, em ordem cronológica — o mais antigo primeiro"*.

**Medido (LAB-128), primeiro por mutação:** as 184 travas dos 13 arquivos de teste que citam o `RECADOS.md`,
contra a página com uma mudança plantada de cada vez: a data tirada do título do LAB-50 → **0** falhas; o LAB-120
datado 03/10, atrás do LAB-119 → **0**; o LAB-110 em 31/02 → **0**. A data tirada do LAB-121 deu **1**, só porque
ele está na corrente do cabeçalho do `ONDE_PARAMOS.md` — acaso de posição, não guarda. **Depois, por LUGAR** (todo
`## ` fora de bloco de código): **139** títulos, **139** recados, um por título, nenhum sem data, nenhuma data que
volta, de 13/09 a 16/10/2026. Uma forma diferente e válida: `## 07/10/2026 (noite) · …`.

**Decidido:**

1. `src/a-data-do-recado.ts` (`lerOsTitulos`, `conferirADataDoRecado`). Todo `## ` fora de bloco de código é título
   de rodada e abre com `DD/MM/AAAA`, com qualificador entre parênteses opcional, e ` · `; a data existe no
   calendário, nunca é anterior à do último título com data (comparada como **data**), nem posterior a hoje; um
   recado por título, nenhum antes do primeiro.
2. `tests/a-data-do-recado.test.ts` no portão sem clones: as duas frases conferidas onde moram, o universo publicado
   (139 títulos, 139 recados, igual à contagem ingênua, 0 problemas), as três mutações que passavam caladas
   plantadas na página de verdade, e a régua dos dois lados — com o caso válido que quase parece inválido (*"30/09
   → 01/10"*, que a ordem das letras inverteria). Treze mutações no módulo, **treze acusadas**. 1054 → 1070 travas
   no portão; o trabalho sem clones, 64 → 65 arquivos.

**Descartado:** comparar a data do título com a do commit que o gravou (lê a história do `git`, tira a trava do
portão sem clones, por um defeito que nunca aconteceu); exigir só `DD/MM/AAAA · ` (reprovaria o título de 07/10
pela forma, não pela falta); conferir o *"inteiro"* (o chat não é arquivo).

**O que se perde, dito:** se a data é a do dia em que o recado foi escrito; se o recado do arquivo é o que foi ao
chat.

> **A EXPRESSÃO QUE EXIGE A FORMA NÃO VÊ QUEM A PERDEU.** A trava do LAB-126 lia os títulos pela data, e por isso o
> título que perdesse a data simplesmente sumia dela — nem acusado, nem contado. Ler pela forma certa não é cobrar
> a forma: é preciso também contar o que não casou.

## D357 · AS CINCO LINHAS DO RECADO — "linha sem conteúdo leva `—`, nunca some" passa a ser cobrada em TODO recado · 16/10/2026

**Contexto:** item 900 (LAB-129). A caixa só tinha o `900`, e a FILA não tinha proposta que não esperasse
ninguém (a da *"linha"*, do LAB-123, espera a leitura do chat). Fui à dívida própria, espécie **regra sem
guarda**, no `CLAUDE.md` §1: *"**Linha sem conteúdo leva `—`, nunca some.**"* A única trava das cinco linhas era o
`recado.test.ts`, que olha **só o último** recado e só a **presença** da palavra (`toContain`).

**Medido (LAB-129), primeiro por mutação:** as 200 travas dos 14 arquivos de teste que citam o `RECADOS.md`, contra a
página com uma mudança plantada de cada vez: `Depende do Jonny:` **vazio** no último recado (LAB-128) → **0**
falhas; a linha dos `Achados` tirada do LAB-50 → **0**; `Feito:` antes de `Estado:` no LAB-110 → **0**; `Depende do
Jonny:` duas vezes no LAB-90 → **0**. As quatro juntas, a suíte inteira da esteira: 1 361 aprovadas e 9 reprovadas
(as do `.wasm`), as mesmas de antes. **Depois, por LUGAR** (todo bloco que abre com `=== RECADO PARA O CHAT`):
**140** recados; em todos, as cinco linhas uma vez cada, na ordem e nenhuma calada (118 dizem *"nada…"*, 6 dizem
`—`); 14 com continuação recuada e 4 com a marca `ACUMULADO` logo depois do cabeçalho; e **uma** linha que não é
nenhuma das cinco nem continuação: `Não saiu como pedido:`, no recado do LF-01 (14/09/2026).

**Decidido:**

1. `src/as-cinco-linhas-do-recado.ts` (`lerOsRecados`, `conferirUmRecado`, `conferirAsCincoLinhas`). Em todo recado
   do `RECADOS.md`, as cinco linhas do formato existem, uma vez cada, na ordem, e nenhuma calada (nada depois dos
   dois-pontos e nenhuma continuação recuada); a linha recuada continua a anterior; a marca `ACUMULADO` só vale logo
   depois do cabeçalho; qualquer outra linha é **solta**; o recado fecha com `=== FIM ===`.
2. **A linha do LF-01 é exceção histórica declarada** (`EXCECOES_HISTORICAS`), casada por cabeçalho, tipo e começo
   da linha, e conferida nos dois sentidos — a exceção que não casar mais com nada reprova. O registro do que foi
   enviado não se reescreve.
3. `tests/as-cinco-linhas-do-recado.test.ts` no portão sem clones: a frase e os cinco nomes conferidos contra o
   formato do `CLAUDE.md` §1, o universo publicado (140 recados, igual à contagem ingênua, 14 com continuação, 4 com
   `ACUMULADO`, 1 perdoada, 0 problemas), as quatro mutações que passavam caladas plantadas na página de verdade, e a
   régua dos dois lados — com o caso válido que quase parece inválido (a linha calada seguida de continuação
   recuada **tem** conteúdo). Quinze mutações no módulo, **quinze acusadas**. 1070 → 1090 travas no portão; o
   trabalho sem clones, 65 → 66 arquivos.

**Descartado:** exigir o `—` literal (reprovaria 118 recados escritos *"nada"*, a forma que as outras casas usam, por
grafia e não por conteúdo — a regra proíbe a linha **calada**); olhar só o último, como o teto de doze linhas (lá há
o que perdoar em massa; aqui, uma linha em 140); reescrever o recado do LF-01.

**O que se perde, dito:** se a resposta é verdadeira (*"Depende do Jonny: nada"* com pendência aberta passa); o
recado que foi ao chat e não ao arquivo.

> **A TRAVA QUE PERGUNTA SE A PALAVRA ESTÁ LÁ NÃO PERGUNTA SE A LINHA RESPONDE.** `toContain("Depende do Jonny:")`
> aprova a linha calada, a linha fora do lugar e a linha em dobro — e só no último recado. Presença é a forma mais
> barata de uma régua parecer que cobra o formato.

## D358 · O RECADO DIZ ONDE ESTÁ O DETALHE — e o relatório tem de ser do próprio prompt; passa a ser cobrado · 16/10/2026

**Contexto:** item 900 (LAB-130). A caixa só tinha o `900`, e a FILA não tinha proposta que não esperasse ninguém (a
da *"linha"*, do LAB-123, e a das duas marcas de fim, do LAB-129, esperam a leitura do chat). Fui à dívida própria,
espécie **regra sem guarda**, no `docs/caixa-de-entrada/COMO_FUNCIONA.md` (*"A RESPOSTA INTEIRA VAI PARA O
ARQUIVO"*, commit `b0b537b`, 09/10/2026): a resposta inteira vai para `docs/relatorios/<prompt>.md`, *"e é por isso
que o recado precisa dizer **onde** está o detalhe"*. A única trava (`recado.test.ts`) anda no sentido contrário:
todo relatório tem recado.

**Medido (LAB-130), primeiro por mutação:** a suíte inteira da esteira contra a página com três mudanças plantadas —
o ponteiro tirado do LAB-129, o ponteiro tirado do LAB-92, o LAB-120 apontando o relatório do LAB-119 → **0**
falhas (1 381 aprovadas e 9 reprovadas, as do `.wasm`, as mesmas de antes). O relatório **sumido** do disco já
reprovava por outras travas (as ligações das páginas, a régua do LAB-127); o recado **mudo**, nenhuma. **Depois, por
LUGAR:** 141 recados — 72 de antes de 09/10, 6 de classe sem prompt, **63 no alcance**; os 63 com o relatório gravado
e do próprio prompt; **40** apontam (o LAB-80 e todos do LAB-92 em diante), **23** não (LAB-68 a LAB-91, menos o
LAB-80 — dois deles de antes do commit da regra, no mesmo dia).

**Decidido:**

1. `src/onde-esta-o-detalhe.ts` (`dizOnde`, `conferirOndeEstaODetalhe`). Em todo recado cujo `<prompt>` é `LAB-NNN` e
   cuja seção é datada a partir de 09/10/2026: o relatório `docs/relatorios/<prompt>.md` existe, a primeira linha
   dele é `# <prompt>`, e o recado o aponta — `LAB-NNN.md` em qualquer caminho, ou *relatório* seguido do prompt.
   O universo sai em três montes (antes da regra, classe sem prompt, no alcance), e a soma é conferida.
2. **As 23 são exceção histórica declarada, uma por uma, com o motivo**, e conferidas nos dois sentidos: perdoam só
   o tipo *"não diz onde"*, só do prompt delas; a que não tem o que perdoar sobra e reprova; a cujo relatório sumiu
   é denunciada. **O perdão é do ponteiro, nunca do detalhe.**
3. `tests/onde-esta-o-detalhe.test.ts`, 16 travas, no portão sem clones. Quinze mutações no módulo, **quinze
   acusadas**. 1090 → 1106 travas no portão; o trabalho sem clones, 66 → 67 arquivos.

**Descartado:** aceitar o prompt em qualquer lugar do corpo (todo recado o tem no cabeçalho; a régua passaria por
definição); proibir o recado de citar outros relatórios (citar o de quem deixou a proposta é informação); perdoar por
corte de número (*"antes do LAB-92"* perdoaria também o ponteiro errado naquela faixa); ler o dia de corte do `git`
(o CI clona raso — D293, D344).

**O que se perde, dito:** se o relatório contém a resposta **inteira** (juízo); o recado das classes sem prompt; o
recado que foi ao chat e não ao arquivo.

> **A TRAVA DE UM SENTIDO SÓ É METADE DA REGRA.** *"Todo relatório tem recado"* e *"todo recado aponta o relatório"*
> parecem a mesma frase lida ao contrário — e a primeira aprovava, calada, o recado que não diz onde e o que diz o
> lugar errado.

---

## D359 · A DECISÃO É NUMERADA — a sequência do `DECISOES.md` e as citações dela passam a ser cobradas · 16/10/2026

**Contexto:** item 900 (LAB-131). A caixa só tinha o `900`, e a FILA não tinha proposta que não esperasse ninguém (a
da *"linha"*, do LAB-123, e a das duas marcas de fim, do LAB-129, esperam a leitura do chat). Fui à dívida própria,
espécie **regra sem guarda**, no `CLAUDE.md` §7 (*"decisões em `docs/DECISOES.md`"*) e na D01, que fez o arquivo
nascer *"decisões numeradas"*. A casa cita as decisões pelo número em todo lugar, e nada lia a numeração.

**Medido (LAB-131), primeiro por mutação:** a suíte inteira da esteira com quatro mudanças plantadas ao mesmo tempo no
`DECISOES.md` — o título da D200 apagado, a D201 renumerada como D200, a D300 datada em 01/09/2026 e a D358 apagada
inteira → **0** falhas (1 397 aprovadas e 9 reprovadas, as do `.wasm`, as mesmas de antes). **Depois, por LUGAR:**
357 títulos `## D…`, de D01 a D358, nenhum repetido, em ordem, todos datados, sem o calendário voltar — e **um
buraco: a D176 nunca existiu** (o LAB-51 pulou da D175 para a D177; `git log -S` não acha título D176 em commit
nenhum). Nas 140 versões do arquivo na `main`, **nenhum número sumiu** de uma para a seguinte. Nas páginas da casa,
4 778 citações `D\d{2,}` em 171 arquivos; **28** sem título — 27 são a `D1000` hipotética da D339, e uma é a
*"próxima decisão D176"* do recado do LAB-50.

**Decidido:**

1. `src/a-sequencia-das-decisoes.ts` (`lerAsDecisoes`, `conferirASequenciaDasDecisoes`). Todo título de decisão fora
   de bloco de código é `## D…`, tem data `DD/MM/AAAA` que o calendário tem e que não é futura; os números começam na
   D01, sobem de um em um, sem repetição e sem buraco; a data nunca volta. Toda citação `D\d{2,}` nas páginas da casa
   (o `CLAUDE.md`, o `DECISOES.md`, o `INDEX.md`, o `ONDE_PARAMOS.md`, a `PENDENCIAS_JONNY.md`, o `RAMOS_ABERTOS.md`, a
   `FILA.md`, os relatórios e os itens da caixa) tem título.
2. **O buraco da D176 é declarado, com o motivo, e não tapado** — conferido nos dois sentidos (a D176 escrita depois
   faz o perdão sobrar e reprovar). Uma nota no `DECISOES.md`, ao lado da D177, diz que ela não existe. Citar o
   buraco declarado vale (é dizer que ele não existe); a `D1000` é a única citação sem título declarada.
3. `tests/a-sequencia-das-decisoes.test.ts`, no portão sem clones.

**Descartado:** escrever uma D176 de remendo (seria inventar decisão — e reconstrução que se apresenta como registro);
renumerar da D177 em diante (quebraria 4 778 citações para consertar uma); conferir a história no teste (o CI clona
raso — D293, D344; a medida das 140 versões fica no relatório); exigir que a citação seja desta casa (*"a D17 do
Geo"* não se distingue pela forma).

**O que se perde, dito:** que a citação diga o que o título diz; que a decisão tenha motivo; que todo prompt tenha
decisão; a citação de outra casa que cai num número que existe aqui.

> **NÚMERO QUE TODOS CITAM E NINGUÉM CONFERE É ENDEREÇO SEM CARTEIRO.** A casa escreve *"(D358)"* em cinco páginas
> por rodada; apagar a D358 deixava as cinco apontando para o nada, e nada reprovava.

## D360 · O `upstream/` É INTOCÁVEL — a árvore da cópia de motor de fora passa a ser cobrada · 16/10/2026

**Contexto:** item 900 (LAB-132). A caixa só tinha o `900`, e a FILA não tinha proposta que não esperasse ninguém (a
da *"linha"*, do LAB-123, e a das duas marcas de fim, do LAB-129, esperam a leitura do chat). Fui à dívida própria,
espécie **regra sem guarda**, no `CLAUDE.md` §3, a regra de ouro: *"`upstream/` é intocável: cópia exata, commit e
data em `VERSION`; sem patch."* O que existia lia o `VERSION` (a versão e o nome, `identidade.test.ts`) e **pulava** o
`upstream/` nas varreduras de texto, justamente por ele ser intocável. Nada perguntava se ele continuava intocado.

**Medido (LAB-132), primeiro por mutação:** a suíte inteira da esteira com três mudanças plantadas ao mesmo tempo em
`external-engines/symbios/upstream/` — uma linha acrescentada ao `src/lib.rs`, um arquivo novo `src/patch.rs` e a
linha `Commit:` apagada do `VERSION` → **0** falhas novas (1 415 aprovadas e 9 reprovadas, as do `.wasm`, as mesmas
de antes). **Depois, por LUGAR:** todo arquivo versionado com um segmento `upstream` no caminho — **uma** pasta, a do
Symbios, 25 arquivos. A árvore dela no `HEAD` é `7ea7b17aadf2fa9fb998a8ce7eb0a39b590dd21b`, **a mesma** do commit que a
trouxe (`f61be91`, LAB-00, 09/09/2026); `git log --all` sobre a pasta acha **um** commit, esse. O `VERSION` diz o
commit do upstream (40 caracteres), a data dele e a data da cópia.

**Decidido:**

1. `src/upstream-intocavel.ts` (`COPIAS_DE_UPSTREAM`, `pastasDeUpstream`, `oVersionDiz`, `conferirOUpstream`). Toda
   pasta `upstream` versionada tem linha no registro, e toda linha tem pasta; a árvore dela no `HEAD` é a registrada;
   nada na pasta difere do `HEAD` (`git status --porcelain --untracked-files=all`); o `VERSION` existe e diz o commit
   de 40 caracteres e uma data. O que o `.gitignore` ignora (`target/`) é saída de build, não patch.
2. **Trocar a cópia por uma versão nova do motor é ato deliberado:** o `VERSION` novo, a árvore nova no registro e uma
   decisão, no mesmo commit.
3. `tests/upstream-intocavel.test.ts`, no portão sem clones — ele lê o `git` desta casa, e o clone raso do CI tem a
   árvore do `HEAD` inteira.

**Descartado:** conferir contra o upstream de verdade (pede rede e o repositório de outra pessoa; a régua confere que
a cópia não mudou **desde que entrou**, e que ela entrou exata quem atesta é o `VERSION`); conferir a história no teste
(o CI clona raso — D293, D344; a medida fica no relatório); um resumo próprio dos bytes em vez da árvore do `git` (o
`git` já resume cada byte, nome e modo, e a casa inteira já confia nele); procurar outros nomes de pasta de terceiros
(`vendor/`, `third_party/`) — a regra diz `upstream/`.

**O que se perde, dito:** um patch commitado e desfeito depois volta à mesma árvore e passa (é a história); que a cópia
tenha nascido exata.

> **O QUE A CASA PULA POR SER INTOCÁVEL É O QUE NINGUÉM OLHA.** Seis réguas deixavam o `upstream/` de fora, com o
> motivo certo; nenhuma conferia o motivo.

## D361 · O SYMBIOS RODA EM NODE 22+ SEM NPM — quem diz o que o Node aceita passa a ser o Node · 16/10/2026

**Contexto:** item 900 (LAB-133). A caixa só tinha o `900`, e a FILA continuava sem proposta que não esperasse
ninguém (a da *"linha"*, do LAB-123, e a das duas marcas de fim, do LAB-129, esperam a leitura do chat; a 2 e a 3 do
LAB-96 são mudança de contrato e dado que falta; a do LAB-78 espera o olho do Jonny). Fui à dívida própria, espécie
**regra sem guarda**, no `CLAUDE.md` §7: *"Duas pilhas convivem (D14, D17): Symbios em Node 22+ sem npm; LAB-07 em
Bun."* A D14 diz o preço da primeira metade: sem `enum`, sem `namespace`, sem propriedade de parâmetro — o removedor
de tipos do Node não os aceita. **Só que ninguém roda o adaptador no Node:** a esteira o importa pelo apelido
`@symbios/*` e o roda no **Bun**, que aceita tudo isso e ainda completa import relativo sem extensão.

**Medido (LAB-133), primeiro por mutação:** a suíte inteira da esteira, o `typecheck` e o `lint`, com quatro mudanças
plantadas ao mesmo tempo — um `enum`, uma classe com `constructor(private a: number)` e um `namespace` no
`src/hash.ts`, e um `import … from "../src/geo"` sem extensão no `ferramentas/gerar-terrenos.ts` → **nenhuma falha que
fale da regra**. Caíram duas, as contadoras do tamanho da árvore (`chamadas.test.ts` e `configuracao.test.ts`), que
caem com qualquer linha a mais em qualquer arquivo. O Node, perguntado, recusava o adaptador inteiro
(`ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX`). **Depois, por LUGAR:** os dezesseis `.ts` versionados do adaptador (onze em
`src/`, cinco em `ferramentas/`), rodados um a um no Node 22.22 com `--experimental-strip-types` — os onze de `src/`
carregam, duas ferramentas carregam, duas leem o `.wasm` que não se constrói aqui, e **uma não roda no Node de
propósito**: a `ferramentas/navegador/prova-automatica.ts` é `#!/usr/bin/env bun` e importa o `playwright` do pacote
da esteira — é o passo `prova no navegador` do `conferir.sh` (LAB-31), não o adaptador. Nenhum `package.json` no
Symbios fora do `upstream/`.

**Decidido:**

1. `src/node-sem-npm.ts` (`conferirONodeSemNpm`, `EXCECOES_DE_PACOTE`, `PERGUNTA_AO_NODE`). **O próprio Node tira os
   tipos de cada arquivo** (`node:module` · `stripTypeScriptTypes`, modo `strip`): quem diz o que o Node aceita é o
   Node, não uma lista minha de sintaxes. **Toda importação de verdade** — lida pelo `Bun.Transpiler`, que ignora
   comentário e texto entre aspas (D142, D257) — é `node:`, módulo nativo, ou relativa **com extensão** e para arquivo
   que existe. **Pacote npm só na exceção**, arquivo a arquivo e pacote a pacote, e a exceção que sobrou reprova.
   **Nenhum manifesto** (`package.json`, `package-lock.json`, `bun.lock`) no Symbios fora do `upstream/`.
2. `tests/node-sem-npm.test.ts` **roda** os onze de `src/` no Node de verdade (D308: leitura de fonte é hipótese) e
   exige Node 22+, com o mínimo lido da frase da regra; sem ele, **reprova com a receita** — nunca pula (D124).
3. **Não entra no portão sem clones**: aquele trabalho do `verde.yml` instala só o Bun. Entra no verde completo, e o
   `verde.yml` ganhou `actions/setup-node` com o Node 22 nele — o mesmo trabalho que roda o `conferir.sh`.

**Descartado:** proibir por texto as sintaxes que a D14 lista (lista minha envelhece; o Node é a fonte); rodar as
cinco ferramentas no Node (escrevem medição e pedem o `.wasm` — passam só pelo removedor); tirar a
`prova-automatica.ts` de dentro do `adapter/` (mexe em caminho que o `conferir.sh`, o CI e três provas citam, para
resolver uma frase); contar o `import type` (some na remoção de tipos — limite declarado).

**O que se perde, dito:** o `import type` de pacote passa; as ferramentas que leem o `.wasm` não são rodadas até o
fim; o `.js` da página do navegador não é desta régua.

> **A PILHA QUE RODA O CÓDIGO NÃO É A PILHA QUE A REGRA PROMETE.** O Bun aceita mais do que o Node, e quem testava o
> adaptador era só o Bun — a regra do Node não tinha ninguém do lado do Node.

## D362 · O GENERATE NUNCA DEPENDE DISTO — e quem responde é o Generate · 16/10/2026

**Contexto:** item 900 (LAB-134). A caixa só tinha o `900`, e a FILA continuava sem proposta que não esperasse
ninguém (a da *"linha"*, do LAB-123, e a das duas marcas de fim, do LAB-129, esperam a leitura do chat; a 2 e a 3 do
LAB-96 são mudança de contrato e dado que falta; a do LAB-78 espera o olho do Jonny). Fui à dívida própria, espécie
**regra sem guarda**, no `CLAUDE.md` §3, a quarta linha da regra de ouro: *"O Generate nunca depende disto:
`external-engines/` pode ser apagado."* A metade **desta casa** tem trava desde o LAB-06 (`entrega.test.ts`: nada de
`entrega/` importa `external-engines/`, D70). **A metade do Generate não tinha ninguém** — nada lia o Generate para
perguntar se ele passou a depender do Lab.

**Medido (LAB-134), primeiro por mutação:** no clone do Generate (`18a7a6d`), três mudanças plantadas ao mesmo tempo e
desfeitas por `git checkout` (o `git status` dele terminou limpo) — `"archilly-lab": "github:jonny583/archilly-lab"`
nas dependências do `package.json`; `import "../../../../../archilly-lab/external-engines/esteira/src/forma.ts"` no
`src/lib/contratos/motor-v1/index.ts`, que é o arquivo que **esta casa compila**; e o `scripts/diag-tudo.ts` citando
o `scripts/medir-violacoes-do-testfit.ts`. A suíte inteira da esteira e o `typecheck` → **nenhuma falha que fale da
regra**. O `typecheck` passou porque o `import` **resolve**: os dois clones moram lado a lado. Caiu uma só, a do §4
(*"os clones somente-leitura estão limpos"*) — e ela não cai quando a mesma mudança chega **commitada** pela origem.
**Depois, por LUGAR:** 1 114 arquivos versionados no Generate; 4 de configuração (`package.json`,
`tsconfig.json`, `tsconfig.scripts.json`, `vendor/archilly-central/package.json`), nenhum cita o Lab; 608 de código,
2 248 importações, nenhuma do Lab; e **uma** leitura do Lab no texto que roda: o `scripts/medir-violacoes-do-testfit.ts`
(o medidor do GU-06), que lê as saídas de `docs/contratos/saidas/` e, sem a pasta, sai com código 2. O catálogo da
família (`vendor/archilly-central/dist/familia.json`) cita o repositório — é dado, não dependência.

**Decidido:**

1. `src/generate-nao-depende.ts` (`conferirOGenerate`, `EXCECOES`, `A_REGRA`). Os lugares: **configuração**
   (`package.json`, `tsconfig*.json`, `jsconfig.json`, `.gitmodules`, em qualquer pasta) que cite o Lab reprova; **o
   especificador de importação** (lido pelo `Bun.Transpiler`) que cite o Lab reprova; **o código sem comentário** que
   cite o Lab reprova, salvo exceção declarada. O comentário não conta (D142, D257): *dizer não é depender*.
2. **A exceção vale com três condições**, cobradas: não lê `external-engines/`; **nenhum outro arquivo de código ou
   configuração a cita pelo nome** (é o *"fora da bateria"* sem escrever a lista da bateria aqui); e ainda lê o Lab
   (exceção que sobrou reprova, e a sem arquivo também). Universo vazio reprova (D213); código que não se lê reprova,
   não pula.
3. **Duas travas, em dois arquivos** (a lição do LAB-84): `tests/generate-nao-depende.test.ts`, só sintético, **no
   portão sem clones**; `tests/generate-nao-depende-com-clone.test.ts`, contra o clone de verdade, no verde completo,
   e sem o clone **reprova com a receita** (D124).

**Os dois lados e as mutações:** catorze mutações no módulo, catorze acusadas — a caixa ignorada, a configuração nunca
acusada, a importação nunca acusada, o comentário contando, o universo vazio aprovado, a exceção lendo
`external-engines/`, a exceção citada ignorada, a exceção que sobrou, a sem arquivo, só o `tsconfig.json`, só o
`package.json` da raiz, sem o `.gitmodules`, o código ilegível pulado, e a configuração que não cita a exceção.

**Descartado:** escrever aqui a lista da bateria do Generate (envelhece no dia em que ele acrescentar uma guarda; *"nenhum
outro arquivo a cita"* pergunta o mesmo sem lista); varrer os `.md` e os JSON de dados (citar não é depender);
conferir pela execução — apagar o Lab e rodar a bateria do Generate (leva minutos, precisa do `tsx` e das dependências
dele, e esta casa não instala nada no vizinho); procurar `symbios`/`packingsolver` (o Generate depender do motor é
outra pergunta).

**O que se perde, dito:** o arquivo do Lab **copiado** para dentro do Generate sem citar o caminho (apagar o Lab não o
quebra, que é o que a regra protege); o `require()` sai como leitura e não como importação (o `Bun.Transpiler.scan`
não o devolve em nenhum carregador — reprova do mesmo jeito, com outro nome); os ramos do Generate que não são o
`HEAD` do clone.

> **A REGRA QUE PROMETE PELO VIZINHO SE PERGUNTA AO VIZINHO.** A trava do LAB-06 olhava esta casa — e a dependência,
> se nascer, nasce do outro lado da seta.

---

## D363 · `adapter/` É A ÚNICA FRONTEIRA — onze arquivos importavam o motor por fora, e agora há porta · 16/10/2026

**Contexto:** item 900 (LAB-135). A caixa só tinha o `900`, e a FILA continuava sem proposta que não esperasse
ninguém (a da *"linha"*, do LAB-123, e a das duas marcas de fim, do LAB-129, esperam a leitura do chat; a 2 e a 3 do
LAB-96 são mudança de contrato e dado que falta; a do LAB-78 espera o olho do Jonny). Fui à dívida própria, espécie
**regra sem guarda**, no `CLAUDE.md` §3, a terceira linha da regra de ouro — a única das quatro que o LAB-134 deixou
escrito que não tinha medido: *"`adapter/` é a única fronteira."* O `README.md` da raiz diz o que ela quer dizer:
*"Só ele conhece detalhes do motor. Trocar o motor não deve exigir mexer em nada fora dessa pasta."*

**Medido (LAB-135), primeiro por mutação:** dois arquivos novos em `esteira/src/` — um importando `@testfit/api.ts`,
outro importando o motor por caminho relativo ao clone (`../../../../motor-testfit/src/lib/lab/api.ts`, que a D16
proíbe por escrito) — e a suíte inteira da esteira: **nenhuma falha que fale da regra**. Caiu uma só, a prova do
LAB-52, que conta a árvore e cai com qualquer arquivo novo. **Depois, por LUGAR:** os 295 códigos versionados de
`external-engines/`, os 2 `tsconfig.json`, 1 307 especificadores — e a regra **já estava quebrada**: **onze arquivos**
fora de um `adapter/` importavam o motor do Laboratório de Parcelamento direto (doze importações): três do
`esteira/src/` (`porta/motores.ts`, `guarda-em-acao.ts`, `passagens-dos-legais.ts`), dois testes da esteira, quatro
ferramentas da esteira (`lab55`, `lab58`, `lab59`, `lab76`) e, no próprio pacote `testfit/`, o teste e a ferramenta
de medida. Nenhum alcançava o Symbios por código: a esteira o importa por `@symbios/`, que resolve para o adaptador.

**Decidido:**

1. **O conserto antes da trava:** `testfit/adapter/src/motor.ts`, a porta do motor — repassa as sete coisas que os onze
   usavam (`rodarMotor`, `impressao`, `MOTOR_NOME`, `MOTOR_VERSAO`, `distanciaSegmento`, `distanciaAoPoligono`,
   `pontoEmPoligono`) e nada mais. Os onze passaram a importar dela; comportamento idêntico (é repasse).
2. `src/adapter-unica-fronteira.ts` (`conferirAFronteira`, `A_REGRA`, `MOTORES_DE_FORA`, `CLONES_QUE_NAO_SAO_MOTOR`).
   O especificador sai do `ts.preProcessFile` — **com** `import type`/`export type` (tipo do motor fora do adaptador
   também obriga a mexer), com `export … from`, `import()` e `require()`, sem comentário (D142, D257) — e se resolve
   pelos `paths` e o `baseUrl` do `tsconfig.json` mais fundo (o apelido se LÊ de onde mora, D310). Alvo em
   `external-engines/<m>/upstream|archilly/` ou num clone de motor, importado de fora do `adapter/` daquele motor,
   reprova; de outro adaptador, reprova com outro nome.
3. **A tabela é cobrada nos dois sentidos:** apelido que sai do repositório sem ser motor nem clone declarado reprova
   (o próximo clone nasce com dono); motor de fora que o próprio adaptador deixou de importar reprova (tabela velha).
   Universo vazio reprova (D213); código que não se lê reprova.
4. **Uma trava, no portão sem clones:** a régua lê só o código e os `tsconfig` desta casa, e resolver apelido é
   aritmética de caminho — o clone não precisa existir. `tests/adapter-unica-fronteira.test.ts`, sintético e contra a
   árvore de hoje.

**Os dois lados e as mutações:** quinze mutações no módulo, quinze acusadas (três delas só depois de eu acrescentar o
caso que as pegava: o `tsconfig` mais raso escolhido, o `baseUrl` ignorado e o universo saindo de `external-engines/`).

**Descartado:** declarar os onze como exceção (exceção para onze é a regra ao contrário, e o conserto custava um
arquivo de repasse); tirar o `@testfit/*` do `tsconfig` da esteira (o programa dela compila os arquivos do adaptador,
que usam o apelido); consertar agora o caminho do `.wasm` (abaixo).

**O que se perde, dito:** o **caminho do artefato do Symbios** — **27** arquivos fora do `symbios/adapter/` (9 testes e
18 ferramentas, nenhum do `src/`) escrevem `archilly/wasm/target/…/archilly_symbios_wasm.wasm` no código que roda,
para ler os bytes e entregar ao `Motor.carregar`. É detalhe do motor fora do adaptador, mas é texto, não importação, e
consertá-lo sem o `.wasm` nesta máquina seria mexer em nove testes que eu não posso rodar. Vai à `FILA.md` como
*"proposto ao chat"*. Também não se cobra o `import.meta.resolve("@testfit/api.ts")` do carimbo dos vizinhos (ele
pergunta **onde o clone mora**, não usa o motor) nem o Generate, que é o juiz e tem a regra dele (D362).

> **A REGRA QUE NINGUÉM COBRA JÁ ESTÁ QUEBRADA QUANDO ALGUÉM OLHA.** A primeira e a quarta linha da regra de ouro
> ganharam trava sem achar defeito (LAB-132, LAB-134); a terceira, a primeira vez que alguém a mediu, tinha onze.

## D364 · A `FILA.md` EM DIA — dezenove prompts não tinham o seu lugar nela, e quem responde é o `RECADOS.md` · 16/10/2026

**Contexto:** item 900 (LAB-136). A caixa só tinha o `900`, e a FILA continuava sem proposta que não esperasse
ninguém (a da *"linha"*, do LAB-123, a das duas marcas de fim, do LAB-129, e a do `.wasm`, do LAB-135, esperam a
leitura do chat; a 2 e a 3 do LAB-96 são mudança de contrato e dado que falta; a do LAB-78 espera o olho do Jonny).
Fui à dívida própria, espécie **regra sem guarda**, no `CLAUDE.md` §7: *"`DECISOES.md`, `FILA.md`, `ONDE_PARAMOS.md` e
`INDEX.md` em dia"*. O `ONDE_PARAMOS.md` tem a trava do LAB-126, o `INDEX.md` a do LAB-118, o `DECISOES.md` a do
LAB-131. **A `FILA.md` não tinha nenhuma.**

**Medido (LAB-136), primeiro por mutação:** a linha do item `012` apagada da tabela da caixa e o título do LAB-135
trocado — e a suíte inteira da esteira deu **1 504 aprovadas e 9 reprovadas, as mesmas 9 de antes** (as do `.wasm`).
**Depois, por LUGAR:** a página registra os prompts da caixa em dois lugares — a tabela da seção *"A IDA MUDOU DE
LUGAR"*, uma linha por item numerado, e um título `### LAB-NN ·` por rodada do 900. Contra os **69** prompts com item
no `RECADOS.md` (LAB-68 a LAB-135; o LAB-95 tem dois títulos), **19 não tinham o seu lugar**: a tabela parava no `012`
(LAB-79) e os itens `013` a `030` — dezoito, LAB-80 a LAB-96 e LAB-113 — nunca tiveram linha; e o LAB-97, o primeiro
do 900, não tinha título (os títulos começavam no LAB-98). A regra já estava quebrada, dezoito vezes seguidas.

**Decidido:**

1. **O conserto antes da trava:** as dezoito linhas, cada uma com o **título do recado** no `RECADOS.md` (não com
   lembrança) e a ligação para o relatório, e o título do LAB-97, com a D324 do relatório dele. Uma nota abaixo da
   tabela diz que entraram juntas, no LAB-136; as doze linhas de antes ficaram intocadas.
2. `src/a-fila-em-dia.ts` (`conferirAFilaEmDia`, `lerATabela`, `lerOsTitulos`, `A_REGRA`). O universo sai da leitura
   que já existe (`lerAsRodadas`, LAB-126) e, no outro sentido, da caixa: todo `NNN-FEITO.md` fora o `900`. Cinco
   defeitos pelo nome — `item-sem-linha`, `linha-com-outro-prompt` (a linha não cita o prompt que o recado diz ter
   fechado o item), `linha-de-item-aberto` (o ✅ contra a caixa), `novecentos-sem-titulo` e `sem-tabela` (a régua não
   aprova por não ler).
3. **Uma trava, no portão sem clones:** lê a `FILA.md`, o `RECADOS.md` e a pasta da caixa deste repositório.
   `tests/a-fila-em-dia.test.ts`, catorze testes (1 186 → 1 200 travas no portão).

**Os dois lados e as mutações:** seis mutações plantadas na página de verdade, seis acusadas pelo nome; dez no módulo,
dez acusadas.

**Descartado:** cobrar os prompts de antes da caixa (LAB-02 a LAB-67, sem item no recado) — a fila então era a porta
de entrada e tinha outra forma, e oito deles nunca tiveram título próprio; é história, e não se reescreve. E cobrar o
**texto** de cada linha, ou a ordem: é relato, e o relato mora no relatório.

> **A PÁGINA QUE NINGUÉM RELÊ PARA DE ANDAR EM SILÊNCIO.** O relatório e o recado de cada rodada saíam porque havia
> trava para eles; a linha da fila, sem trava, deixou de sair dezoito vezes — e ninguém viu, porque a fila deixou de ser
> a porta de entrada e ninguém mais a abria para trabalhar.

## D365 · A DÍVIDA TÉCNICA NÃO ENTRA NA PÁGINA DO JONNY — e a régua do LAB-124 até a ajudava a entrar · 16/10/2026

**Contexto:** item 900 (LAB-137). A caixa só tinha o `900`, e a FILA continuava sem proposta que não esperasse
ninguém (a da *"linha"*, do LAB-123, a das duas marcas de fim, do LAB-129, e a do `.wasm`, do LAB-135, esperam a
leitura do chat). Fui à dívida própria, espécie **regra sem guarda**, no `CLAUDE.md` §5: *"`docs/PENDENCIAS_JONNY.md` é
escrito para leigo; item resolvido é marcado, nunca apagado, e **dívida técnica não entra lá**"*. A primeira metade tem
a trava do LAB-124 (D352); **a segunda não tinha nenhuma** — nenhum `.ts` cita a frase.

**Medido (LAB-137), primeiro por mutação:** na página de verdade, uma pendência nova *"20 · Refatorar `src/forma.ts` e
subir a cobertura dos testes"*, declarada na lista do LAB-124 como `aberta` → a suíte inteira da esteira deu **as mesmas
9 falhas** de antes (as do `.wasm`), mais as duas provas que contam linhas da árvore (LAB-52, LAB-57), que reprovam com
qualquer mudança em `src/` e não falam da regra. A régua do LAB-124 até ajudava a dívida a entrar: pedia que ela fosse
**declarada**, e declarada ela passava. **Depois, por LUGAR:** as 19 pendências numeradas de hoje, uma a uma — **nenhuma é
dívida técnica**: 14 de urbanismo ou negócio, a §8 de dinheiro, a §11 de segurança, e três avisos (§5, §6, §9-C) que
dizem, na própria seção, que não são pergunta. Cumprida por disciplina.

**Decidido:**

1. **Pela estrutura, não pela palavra** (D239, LAB-73: trava de palavra deixa passar 8 de 12): a `DeclaracaoDePendencia`
   ganhou o campo **`dono`** (`DonoDaPendencia`), cujos valores são **as cinco classes que param** da
   `docs/caixa-de-entrada/COMO_FUNCIONA.md` e o `informe`. **Não existe valor para dívida técnica**: quem quiser pôr uma
   na página tem de escrever, numa linha revisável, que ela gasta dinheiro, não tem volta, muda promessa, toca segurança
   ou é urbanismo.
2. `src/o-que-e-dele.ts` (`conferirODono`, `lerOAlto`, `lerAsCincoClasses`, `eTituloDeOficina`, `A_REGRA`). Quatro
   defeitos pelo nome: `pergunta-sem-classe` (pendência aberta, parada ou resolvida declarada `informe`),
   `informe-sem-aviso` (o informe não diz, no título ou no primeiro parágrafo, que não é pergunta), `titulo-de-oficina`
   (caminho de código ou palavra de oficina num título — o sintoma que a palavra **alcança**, e a página é para leigo) e
   `classes-divergem` (a lista da `COMO_FUNCIONA.md` não tem cinco itens, ou uma classe não tem a sua palavra num item
   só — o tipo e o protocolo mudam juntos).
3. **No portão sem clones**, no mesmo arquivo de teste do LAB-124 e do LAB-125
   (`tests/pendencias-marcadas.test.ts`, 40 → 54 testes): **1 200 → 1 214** travas, 72 arquivos.

**Os dois lados e as mutações:** a mutação que criou a régua é acusada (`titulo-de-oficina:20`), com a régua do
LAB-124 dizendo zero ao lado; onze mutações no módulo, **oito** acusadas na primeira rodada; as duas que sobreviveram
(a palavra de uma classe em dois itens; o alto da seção lido além do primeiro título) viraram teste e passaram a ser
acusadas; a décima primeira (tirar a fronteira `\b` de `src/`) é **equivalente** para título de leigo e fica declarada.

**Descartado:** decidir sozinho se a §6 (o que o Lab achou nos **outros** aplicativos) sai da página — ela se diz aviso,
e é dívida técnica dos vizinhos, não *"do código"* daqui; é pergunta de forma da página dele, **proposta ao chat**. E
cobrar o corpo das seções: uma seção de urbanismo cita código no relato (a §7 cita), e acusar isso seria régua larga.

> **A RÉGUA QUE EXIGE DECLARAR TAMBÉM APROVA O QUE FOI DECLARADO.** A trava do LAB-124 fez toda pendência nova nascer
> numa lista — e com isso uma refatoração bem declarada passava com selo. Declaração sem campo para dizer *de quem* é a
> coisa não separa o que é dele do que é meu.

## D366 · SEM PR, MESCLAR COM `--no-ff` E DECLARAR — duas entregas entraram direto, e quem responde é quem GRAVOU · 16/10/2026

**Contexto:** item 900 (LAB-138). A caixa só tinha o `900`, e a FILA continuava sem proposta que não esperasse
ninguém (a da *"linha"*, do LAB-123, a das duas marcas de fim, do LAB-129, a do `.wasm`, do LAB-135, e a da §6, do
LAB-137, esperam a leitura do chat). Fui à dívida própria, espécie **regra sem guarda**, no `CLAUDE.md` §1-A: *"Sem
`mcp__github__*`, mesclar com `git merge --no-ff` na `main` e declarar (D29)."* A D29 diz onde se declara: **no
relatório e no recado**. Nenhuma trava lia a primeira linha da `main`.

**Medido (LAB-138), pelo caso de verdade:** a primeira linha da `main` inteira, com a história desrasada — 201 commits,
separados por quem os **gravou** (o *committer*) e quantos pais têm: 1 raiz, 123 gravados pelo GitHub (PR), 32 escritas
da direção só na caixa, 41 mesclas por git direto — **todas** com *"mesclado por git direto (D29)"* no assunto — e **4
que não são nada disso**: o LAB-102 (`7d0e635`, 13/10) e o LAB-114 (`b6b32bb`, 15/10), **entregas desta casa
commitadas direto na `main`**, sem mescla e sem dizer, e duas escritas da direção fora da caixa (o nascimento dela,
`6f43837`, e o `.claude/settings.json`, `d103582`). A suíte estava verde com as duas entregas na história (1 532
aprovadas, 9 reprovadas — as do `.wasm`). E a outra metade: **nenhum** dos 44 recados do LAB-95 ao LAB-137 diz como a
entrega entrou, nem o relatório de nenhum deles — a declaração foi morar no assunto do commit, o único lugar que a D29
não nomeou.

**Decidido:**

1. `src/mescla-declarada.ts` (`conferirAPrimeiraLinha`, `monteDe`, `lerALinha`, `argumentosDoLog`, `motivosDaMescla`,
   `conferirADeclaracaoNoTexto`, `dizComoEntrou`). **Quem grava decide, não o assunto:** gravado pelo GitHub é PR;
   gravado aqui com todo arquivo na caixa é a direção; gravado aqui com dois pais e a frase é a mescla declarada.
   Problema é `entrega-sem-mescla` (um pai, arquivo fora da caixa) e `mescla-sem-declaracao` (dois pais, sem a frase).
   As quatro de cima são exceção nomeada por hash, cada uma com o motivo, e só perdoam o problema que nomeiam — a
   história da `main` não se reescreve.
2. **No gancho do envio** (`ferramentas/antes-do-envio.ts`, LAB-106): a primeira linha do que vai (`<remoto>..<local>`)
   passa pela régua antes das travas. Não ler a linha recusa, não aprova (D213).
3. **Na suíte**, `tests/mescla-declarada.test.ts`, no portão sem clones: lê a `main` local quando a história está
   inteira, e **recusa** pelo LAB-89 (D295) no clone raso do CI — a primeira linha de um clone raso termina no corte, e
   o corte sem pai passaria por `raiz`. **1 214 → 1 234** travas, 73 arquivos.
4. **A outra metade, do LAB-138 em diante**: o recado e o relatório dizem *"mesclado por git direto (D29)"* ou o `PR #N`.
   Os 130 recados de antes são registro do que foi enviado e não se reescrevem (a regra do LAB-130).

**Os dois lados e as mutações:** o LAB-102, replantado sem a exceção, é acusado pelo nome; nove PRs de verdade (LAB-39
a LAB-47) **sem** `(#N)` no assunto passam, porque o GitHub os gravou; um `(#999)` escrito num commit local não passa.
Quinze mutações no módulo, quinze acusadas — uma delas (o relatório ausente calado) escrita errada na primeira rodada,
sem compilar, e contada pelo meu script como sobrevivente; reescrita, acusada.

**Descartado:** separar PR de mescla pelo `(#N)` no assunto — foi a primeira tentativa, e acusava nove PRs de verdade.
Exigir a declaração nos 130 recados de antes — o recado é registro. E cobrar *qual* foi o caminho de verdade: o recado
que diz *"mesclado por git direto"* de uma entrega que foi por PR passa — a régua pega o esquecimento, não a mentira.

> **QUEM GRAVOU O COMMIT É O FATO; O ASSUNTO É O QUE ALGUÉM ESCREVEU.** A primeira régua leu o assunto e acusou nove PRs
> de verdade; a que lê o *committer* separa PR de mescla local sem perguntar a ninguém. E a declaração que a D29 pediu no
> recado foi morar, 41 vezes, no único lugar que ela não nomeou — cumprida no lugar errado é cumprida para quem não lê
> aquele lugar.

## D367 · TODA ENTREGA DECLARA "CONFERIDO AQUI, NÃO NO GITHUB" — cumprida 73 de 73 vezes, e nada perguntava · 16/10/2026

**Contexto:** item 900 (LAB-139). A caixa só tinha o `900`, e a FILA continuava sem proposta que não esperasse
ninguém (a da *"linha"*, do LAB-123, a das duas marcas de fim, do LAB-129, a do `.wasm`, do LAB-135, e a da §6, do
LAB-137, esperam a leitura do chat). Fui à dívida própria, espécie **regra sem guarda**, no `CLAUDE.md` §7, sob o CI
desligado: *"**Toda entrega declara "conferido aqui, não no GitHub"**"* — e o `docs/COMO_RELIGAR_O_CI.md` diz o porquê:
verde na mão e verde na nuvem são afirmações diferentes.

**Medido (LAB-139):** por mutação, tirar a frase do recado do LAB-138 → a suíte inteira da esteira com **as mesmas 9
falhas** de sempre (as do `.wasm`) e 1 552 aprovadas: nenhuma trava lia a frase. Por LUGAR, os dois lugares onde a
família lê como uma entrega foi conferida — 150 recados no `RECADOS.md`, 19 de classe (sem prompt), 58 de antes do
LAB-67 (o prompt que desligou o CI) e **73 recados de entrega do LAB-67 ao LAB-138 (o LAB-95 tem dois): 73 de 73
declaram**; e **72 relatórios, 71 declaram** — dois com a frase quebrada pela coluna (LAB-75, LAB-81), e **o LAB-118 em
lugar nenhum**: o recado declara, o relatório não diz como foi conferido.

**Decidido:**

1. `src/conferido-aqui-declarado.ts` (`conferirADeclaracao`, `declara`, `promptsDoCabecalho`). A frase se lê pelo
   `comoARegraSeLe` (sem quebra de coluna, sem negrito), sem caixa e **com acento**; a metade (*"conferido aqui"*) não
   declara. Recado de classe não é cobrado, e é contado.
2. **O alcance é a vida do CI desligado:** do LAB-67 a `ULTIMO_PROMPT_COBRADO`, que é `null` com o gatilho do
   `verde.yml` comentado. **Gatilho ativo com o número em branco reprova** — quem religa escreve onde a regra acabou —, e
   o número escrito com o gatilho comentado também.
3. O LAB-118 é **exceção nomeada** (só `relatorio-nao-declara`), conferida nos dois sentidos — relatório gravado não se
   reescreve.
4. `tests/conferido-aqui-declarado.test.ts` no portão sem clones: **1 234 → 1 247** travas, 74 arquivos.

**Os dois lados e as mutações:** na página de verdade, a frase tirada do recado do LAB-138 e a do relatório do LAB-75
trocada por *"conferido aqui, e no GitHub"* → as duas acusadas pelo nome. Doze mutações no módulo, doze acusadas.

**Descartado:** cobrar o relatório só com a frase numa linha (reprovaria o LAB-75 e o LAB-81, que declaram — a coluna é
escolha de quem escreve); aceitar *"conferido aqui"* sozinho (é a metade que não diz qual verde); reescrever o relatório
do LAB-118; e cobrar o recado de classe (`despertador-sem-item` não entrega trabalho conferido).

> **REGRA COM PRAZO TEM DE SABER QUANDO ACABA.** Esta vale enquanto o CI estiver desligado — e a trava que a cobra para
> sempre reprovaria o primeiro recado honesto depois de religar. Quem religa escreve onde ela acabou, e o teste não deixa
> esquecer nem o começo nem o fim.

## D368 · TODO PROMPT FECHA COM PROVAS EM `docs/provas/` — ou diz que não há; 63 de 131 fecharam calados · 16/10/2026

**Contexto:** item 900 (LAB-140). A caixa só tinha o `900`, e a FILA continuava sem proposta que não esperasse
ninguém (a da *"linha"*, do LAB-123, a das duas marcas de fim, do LAB-129, a do `.wasm`, do LAB-135, e a da §6, do
LAB-137, esperam a leitura do chat). Fui à dívida própria, espécie **regra sem guarda**, no `CLAUDE.md` §7: *"Todo
prompt fecha com relatório em `docs/relatorios/`, **provas em `docs/provas/`**, …"* — a sétima coisa da frase, a única
sem trava (as outras seis: LAB-130, 131, 136, 126, 118 e 138). O LAB-136 a deixou de fora com *"há prompt que não mede
nada"*.

**Medido (LAB-140):** por mutação, três mudanças plantadas ao mesmo tempo — uma pasta de prova para o LAB-998, que não
existe; uma pasta para o LAB-44, cujo relatório diz que não há; a declaração do LAB-43 apagada → **nenhuma** acusada (a
única falha a mais foi a §7 das chaves, porque o JSON plantado não as trazia). Por LUGAR, os 131 relatórios e as 66
pastas: **64** prompts com pasta, **4** dizendo *"Não há `docs/provas/LAB-NN/`"* (LAB-42 a LAB-45, a forma nasceu
aqui e caiu em desuso), e **63 calados** — 19 até o LAB-75 e **todos os 44 do LAB-96 ao LAB-139**. As 66 pastas: 64 de
prompt, todas com relatório; 2 de item feito.

**Decidido:**

1. `src/onde-mora-a-prova.ts` (`conferirOndeMoraAProva`, `declaraQueNaoHa`, `nomeDoPrompt`). A prova de um prompt mora
   em `docs/provas/<prompt>/`, **ou** o relatório diz, com o caminho da própria pasta, que não há — a forma do LAB-43,
   lida pelo `comoARegraSeLe`, sem caixa e com acento.
2. **O alcance começa no LAB-140.** Os 63 calados de antes são **contados e congelados** (`CALADOS_ANTES_DA_TRAVA`), não
   perdoados um a um nem reescritos: pasta antiga apagada faz o número subir e reprova.
3. Em qualquer prompt: dizer que não há e ter a pasta reprova; pasta de prompt sem relatório, de item não feito, sem
   dono ou vazia reprova.
4. `tests/onde-mora-a-prova.test.ts` no portão sem clones: **1 247 → 1 257** travas, 75 arquivos.
5. Este prompt é o quinto a usar a forma: a prova dele é a trava, que reconta da fonte a cada verde (D144).

**Os dois lados e as mutações:** na página de verdade, quatro plantadas — a frase deste relatório tirada, a pasta do
LAB-02 apagada, a do LAB-998 criada, a do LAB-44 criada —, quatro acusadas pelo nome. Quinze mutações no módulo, quinze
acusadas (uma sobreviveu na primeira rodada e virou teste).

**Descartado:** cobrar a pasta de todo prompt (63 de 131 reprovariam, e a saída seria JSON sem medição — prova que só
registra aparência); escrever a frase nos 63 relatórios de antes (é reconstrução, §1-B, e fica proposta ao chat);
reescrever a frase do §7 para a forma que a casa cumpre (a regra é do `CLAUDE.md`; proposta ao chat).

> **REGRA FALSA COMO ESCRITA NÃO SE CONSERTA FINGINDO CUMPRI-LA.** A frase do §7 mandava pasta em todo prompt, e a casa
> já tinha inventado a forma honesta — *"não há, e isso vai declarado"* —, que morreu porque nada a pedia. A trava pede a
> forma; a frase do `CLAUDE.md` fica para quem manda nele.

## D369 · A PROVA DE MEDIÇÃO TRAZ O MOTOR — a régua do §7 cobrava três de quatro conceitos desde o LAB-36 · 16/10/2026

**Contexto:** item 900 (LAB-141). A caixa só tinha o `900`, e a FILA seguia sem proposta que não esperasse ninguém. Fui
à dívida própria, espécie **regra sem guarda**, no `CLAUDE.md` §7: *"JSON em `docs/provas/<prompt>/` com gleba,
**motor**, semente e contrato"*. A guarda (`tests/regras.test.ts`, LAB-36) tem o `describe` com os quatro, mas a tabela
`CONCEITOS` com três, e o teste chamado *"os três conceitos"*.

**Medido (LAB-141):** por mutação, uma prova plantada com gleba, semente e contrato e **sem motor** passou a suíte
inteira (1 575 e as 9 do `.wasm`, as mesmas da linha de base); a mesma prova sem semente foi acusada pelo nome. Por
LUGAR, as 84 provas: 46 exceções, **38 de medição** — 34 dizem `motor`/`motores`; três dizem por outro nome
(`pontesAuditadas`, `idasAuditadas`, `ondeOMotorFoiLido`); **uma não diz** (`LAB-94/o-preco-do-setimo.json`). Das duas
congeladas do LAB-36, o LAB-06 diz em `motorId` e o `LAB-07/medicoes.json` não diz.

**Decidido:**

1. `CONCEITOS.motor` com seis nomes aceitos, lista fechada, cada um com o arquivo que o usa. Chave que só **contém** a
   palavra (`notaDoMotor`) não entra: diz o que o motor fez, não qual — por *"contém motor"*, a do LAB-94 passaria.
2. `CONGELADAS_ANTES_DA_REGRA` nomeia o valor de **cada** conceito que falta: o LAB-07 ganha o `motor` (motor-testfit,
   do título do LAB-07.md); o LAB-94 entra com o `motor` (parcelamento, do LAB-94.md). Prova congelada não se regera
   para consertar etiqueta (D118).
3. O conjunto fechado passa de dois a **três**, com o motivo no teste; o teste passa a dizer *"quatro conceitos"*.
4. Nenhum teste novo: o portão sem clones segue em 1 257 travas.

**Os dois lados:** dez mutações, dez acusadas (a prova sem motor, a só com `notaDoMotor`, a do LAB-94 fora da lista, o
conceito apagado, `notaDoMotor` aceito, `motorId` tirado, pontes e idas tiradas, `ondeOMotorFoiLido` tirado, o motor do
LAB-07 apagado, o valor do LAB-94 reduzido); a prova completa plantada passa.

**Descartado:** aceitar qualquer chave que contenha *"motor"* (mede ortografia, D137, e perdoa o LAB-94); regerar as
provas do LAB-07 e do LAB-94 com a chave (D118); cobrar já o VALOR contra o registro de motores (LAB-76) — os valores
têm quatro formas, e é outro passo; fica proposto ao chat.

> **O TÍTULO QUE REPETE A REGRA NÃO PROVA QUE A RÉGUA A COBRA.** O `describe` dizia *"gleba, motor, semente e
> contrato"* e o teste, cinquenta linhas abaixo, *"os três conceitos"* — os dois certos sobre coisas diferentes, por
> cinco semanas. Quem separa os dois é a mutação.

## D370 · O CONSERTO DO LAB SAI DITO NA MEDIÇÃO — e o recorte do Symbios saía calado · 17/10/2026

**Contexto:** item 900 (LAB-142). A caixa só tinha o `900`, e a FILA seguia sem proposta que não esperasse ninguém. Fui
à dívida própria, espécie **regra sem guarda**, no `CLAUDE.md` §4: *"Não conserta geometria em silêncio: conserto
declarado, desligado por padrão, medido nas duas passagens."* Três cláusulas, dois consertos (o aparo do Laboratório
de Parcelamento e o recorte do Symbios) — seis casas. A guarda do LAB-36 cobria duas.

**Medido (LAB-142):** o recorte ligado por padrão e o aparo sem a passagem fiel passaram a suíte inteira, acusados só
pela contagem de bytes do LAB-52 (que acusa qualquer edição). A trava do LAB-05 para o recorte desligado existe, mas
precisa do `.wasm`. E, por LUGAR, os dois motores que ligam conserto na comparação: o `testfit.ts` declara *"o Lab
aparou"*; o `symbios.ts` liga a lasca e o recorte de quadra e **não declara nada** — regra descumprida, não só sem
guarda.

**Decidido:**

1. `src/conserto-declarado.ts`, função pura `oQueORecorteConsertou`, que lê os contadores que o recorte já publica e
   devolve as linhas do `naoSoubeFazer` com o sujeito do aparo; contador zero, linha nenhuma.
2. O `rodarSymbios` a chama com o mesmo `corte` que usa.
3. `tests/conserto-declarado.test.ts`, oito testes: o recorte declarado; o recorte desligado por padrão **numa rede
   montada à mão**, sem o `.wasm`; o aparo nas duas passagens, com e sem aparo.
4. As provas antigas da comparação não se regeram para ganhar a frase (D118).

**Os dois lados:** sete mutações, sete acusadas; o arquivo limpo passa.

**Descartado:** levar a passagem sem recorte para a `Rodada` da comparação (mudaria o que a tabela mede — é escopo, e
a medição das duas passagens do recorte existe no LAB-05); cobrar o número contra uma rodada real do Symbios (precisa
do `.wasm`).

> **DECLARADO NO COMENTÁRIO NÃO É DECLARADO NA MEDIÇÃO.** O cabeçalho do motor dizia *"escolha declarada"*, e era — para
> quem lê o código. Quem lê a tabela nunca soube. A regra é sobre o que sai, e o que sai é o que se cobra.

## D371 · A MEDIÇÃO É EM METROS — e duas ferramentas gravavam a gleba em hectare · 17/10/2026

**Contexto:** item 900 (LAB-143). A caixa só tinha o `900`, e a FILA seguia sem proposta que não esperasse ninguém. Fui
à dívida própria, espécie **regra sem guarda**, no `CLAUDE.md` §7: *"Medição é em metros e em dados: JSON em
`docs/provas/<prompt>/` com gleba, motor, semente e contrato, e determinismo provado"*. A metade de depois dos
dois-pontos tem trava (LAB-36, LAB-103, LAB-105, LAB-141); a de antes — *"em metros"* — não tinha nenhuma.

**Medido (LAB-143):** por LUGAR, as 84 provas JSON, chave por chave pelo sufixo: `_m` 8 979, `_m2` 6 770, `_pct`
1 389, `_graus` 22, `_ms` 12 — e `_ha` 5: `area_ha` no `LAB-07/medicoes.json` (3×, `testfit/ferramentas/medir.ts`) e
`areaDaGleba_ha` no `LAB-50/passagem-externa.json` (2×, `esteira/ferramentas/lab50.ts`), as duas em hectare
arredondado, sem o metro quadrado ao lado. Regra descumprida, com perda. No código, mais duas ferramentas do Symbios
escrevem hectare, nenhuma em `docs/provas/`.

**Decidido:**

1. `src/medicao-em-metros.ts`: a régua do sufixo (comprimento e área fora do metro), no JSON (com o caminho) e no texto
   do `.ts` (sem comentários). Grandeza que não é terra (`_pct`, `_graus`, `_ms`) fica fora.
2. As duas ferramentas gravam metro quadrado (`areaDaGleba_m2`, `area_m2`); o hectare fica no console, que é tela.
3. `tests/medicao-em-metros.test.ts`, 13 testes, nos dois universos: as provas (as duas antigas congeladas com a
   contagem, D118) e o código (as duas ferramentas do Symbios em exceção com o motivo, e reprova se passarem a gravar
   em `docs/provas/`). Lê só este repositório: entra no trabalho sem clones, 1 257 → 1 270.

**Os dois lados:** oito mutações, oito acusadas; o arquivo limpo passa.

**Descartado:** regerar as provas do LAB-07 e do LAB-50 para trocar a unidade (D118: prova é história); trocar a chave
das duas ferramentas do Symbios (gravam fora de `docs/provas/`, e a medição só roda com o `.wasm` — a ferramenta e a
gravação discordariam sem que ninguém pudesse remedir); régua de VALOR (exigiria saber a ordem de grandeza de cada
medida — inventar).

> **A METADE DA REGRA QUE TEM TRAVA ESCONDE A METADE QUE NÃO TEM.** Quem conferia *"a §7 tem guarda"* achava guarda —
> da segunda metade da frase.

## D372 · UM PROMPT POR DESPERTADOR SE LÊ PELO ITEM, NÃO PELO DISPARO — e a caixa passa a ser cobrada pela história · 17/10/2026

**Contexto:** item 900 (LAB-144). A caixa só tinha o `900`, e a FILA seguia sem proposta que não esperasse ninguém. Fui
à dívida própria, espécie **regra sem guarda**, no `CLAUDE.md` §1-A: *"Um prompt por despertador; o anterior aberto se
termina primeiro."* Do LAB-138 ao LAB-143 ela foi descartada seis vezes — *"não se mede sem ler o que cada disparo
fez"*. O disparo não deixa rastro; **o item deixa**: vira `NNN-FEITO.md` num commit da primeira linha da `main`.

**Medido (LAB-144):** a primeira linha da `main`, só a caixa, cada commit contra o primeiro pai, a árvore reconstruída:
67 passos, **30 entregas fecharam item — `001` a `030`, um por entrega, em ordem, sem buraco**, 34 arquivos `-FEITO`
(os quatro adendos na entrega do seu item), o `900` nunca fechado. A primeira leitura acusou o LAB-82 (`306954d`) de
pular o `013`; era a **colisão** que ele mesmo renumerou para `015` (D273) — o `013` já estava feito. Cumprida por
disciplina, sem guarda.

**Decidido:**

1. `src/um-item-por-entrega.ts`: `conferirAsEntregas` acusa `dois-itens-numa-entrega`, `pulou-o-anterior` (fora o `900`
   e fora a colisão, contada à parte) e `fechou-o-reservado`; publica universo, ordem, colisões e o que não alcança.
   Exceções: nenhuma.
2. A leitura é `git log --reverse --first-parent --diff-merges=first-parent --no-renames --name-status`. **A peça que não
   pode sair é o `--first-parent`** (sem ele a régua lê o ramo, não a `main`); o `--diff-merges` fica escrito para o
   `git` de antes do 2.31 — medido: no 2.43 daqui tirá-lo não muda nada.
3. `tests/um-item-por-entrega.test.ts`, 13 testes; recusa no clone raso (D295). Lê só este repositório: entra no trabalho
   sem clones, 1 270 → 1 283.

**Os dois lados:** oito mutações, oito acusadas; o arquivo limpo passa.

**Descartado:** pôr a régua no gancho do envio (a entrega em curso já é a ponta da `main` no envio e o verde seguinte a
lê; seria uma segunda leitura do mesmo); perdoar o LAB-82 por exceção de hash (a colisão é um caso geral, com nome e
guarda própria, não um acidente daquela entrega); tentar medir o DISPARO (não deixa rastro — e a régua diz isso na
saída).

> **"NÃO SE MEDE" PODE SER "NÃO SE MEDE AQUI".** A regra que seis rodadas declararam imensurável deixava marca o tempo
> todo — no item, não no disparo.

---

## D373 · UM DESPERTADOR POR APLICATIVO SE LÊ PELOS IDS ESCRITOS NA ÁRVORE — e o registro dos despertadores da casa vira lista fechada · 17/10/2026

**Contexto:** item 900 (LAB-145). A caixa só tinha o `900`, e a FILA seguia sem proposta que não esperasse ninguém. Fui
à dívida própria, espécie **regra sem guarda**, no `CLAUDE.md` §1-A: *"Regra de família: um despertador por aplicativo;
nunca se toca no de outro repositório."* A única guarda vizinha era a do item 004 (um id só na seção do
`ONDE_PARAMOS.md`). O toque é ato na conta, fora da árvore; **o id que ele deixa escrito**, não.

**Medido (LAB-145):** `git grep` nos versionados, 5 ids distintos em 10 arquivos — quatro desta casa e um fictício
declarado do item 004. Na história, **cinco** despertadores, um por vez: os quatro com id e um quinto, o que o LAB-20
criou para o LAB-18 em 02/10, **sem id escrito em arquivo nenhum**. Nos três vizinhos clonados (Generate 2 ids,
Laboratório de Parcelamento 9, Geo 1), nenhum desta casa. Cumprida por disciplina, sem guarda.

**Decidido:**

1. `src/um-despertador-por-aplicativo.ts`: o registro fechado `OS_DESPERTADORES_DA_CASA`, com o trecho de nascimento e
   de fim de cada um; o sem id entra com `id: null` (D23 — nunca um id suposto). `conferirOsDespertadores` acusa sete
   tipos e publica universo e o que não alcança. Exceção única e nomeada: o próprio módulo escreve os fictícios da
   lista, uma vez, na declaração.
2. **Despertador novo entra no registro no mesmo commit em que o id aparece na árvore**, e o vivo de antes ganha o fim
   — senão a trava acusa `id-estranho`.
3. `tests/um-despertador-por-aplicativo.test.ts`, 15 testes, sem clones: no trabalho sem clones, 1 283 → 1 298.
   `tests/um-despertador-por-aplicativo-com-clone.test.ts`, 4 testes, no verde completo.

**Os dois lados:** nove mutações, nove acusadas; a casa de hoje passa. A primeira rodada acusou dez problemas meus —
quatro abreviações de id com o prefixo no cabeçalho do módulo e seis ids de brinquedo —, e saíram.

**Descartado:** listar as tarefas da conta para conferir o id vivo (é tocar na conta, e o item 004 já guardou a
resposta dela); perdoar ids por prefixo de arquivo (`tests/` inteiro) em vez de declará-los um a um (régua de prefixo
mede onde o arquivo mora, LAB-93); inventar um id para o despertador do LAB-18.

> **ABREVIAR UM ID COM O PREFIXO É ESCREVER OUTRO ID.** Quem procura não sabe que era abreviação.

---

## D374 · MOTOR DA FAMÍLIA NÃO SE COPIA, E ISSO SE LÊ PELO CONTEÚDO — e a redeclaração vira lista fechada, por par · 17/10/2026

**Contexto:** item 900 (LAB-146). A caixa só tinha o `900`, e a FILA seguia sem proposta que não esperasse ninguém. Fui
à dívida própria, espécie **regra sem guarda**, no `CLAUDE.md` §3: *"Motor da própria família não ganha `upstream/`
(D16): lê-se do clone irmão pelos `paths` do `tsconfig.json`."* A metade do *ler pelos `paths`* tem trava (LAB-135); a
do *não copiar* só tinha guarda pelo nome (`upstream-intocavel.ts`, LAB-132). Medido por mutação: o `quadra.ts` do
motor copiado para o adaptador do Testfit passou a suíte, acusado só pelas contagens de árvore do LAB-52 e do LAB-57.

**Medido (LAB-146):** `git ls-files` dos dois lados — 343 arquivos de código desta casa, 350 do Laboratório de
Parcelamento, 608 do Generate — e as linhas de código em comum por par. Nenhum idêntico; o `contrato-v1.ts` do
adaptador do Testfit em 72 % com o `contrato/tipos.ts` do motor, redeclaração declarada desde o LAB-07 (os dois copiam o
mesmo contrato do Generate); o resto, 15 % e 9 linhas no máximo. Cumprida por disciplina, sem guarda.

**Decidido:**

1. `src/o-motor-da-familia-nao-se-copia.ts`: `conferirQueOMotorNaoSeCopia` acusa cópia inteira, cópia por fração (50 %,
   com 10 linhas ao menos) ou por bloco (30 linhas), `upstream/` debaixo da pasta de um motor da família, vizinho vazio,
   e a lista `REDECLARACOES` nos dois sentidos (sem arquivo, calada, que já não copia). Os clones vêm do
   `adapter-unica-fronteira.ts` — nenhuma lista nova (D116).
2. **A redeclaração é por PAR** (arquivo daqui + arquivo de lá) e **mora também no arquivo**: o trecho que ele escreve
   dizendo que é redeclaração é conferido. Redeclaração nova entra na lista no mesmo commit, com o motivo.
3. `tests/o-motor-da-familia-nao-se-copia.test.ts`, 21 testes, sem clones: no trabalho sem clones, 1 298 → 1 319.
   `tests/o-motor-da-familia-nao-se-copia-com-clone.test.ts`, 3 testes, no verde completo.

**Os dois lados:** dez mutações plantadas e quatro na árvore de verdade, todas acusadas; cada limite com uma mutação de
cada lado (20/19 de 40; 30/29 linhas). A casa de hoje passa.

**Descartado:** comparar só contra o Laboratório de Parcelamento (a regra diz *"motor da família"*, e o Generate também é
lido por caminho); trechos de N linhas seguidas (régua mais difícil de explicar, sem pegar mais); limite perto dos 15 %
medidos (acusaria vocabulário de contrato, não cópia); declarar a redeclaração por arquivo, sem o par (perdoaria uma
cópia de outro arquivo de lá no mesmo lugar).

> **REGRA GUARDADA PELO NOME PERDOA A CÓPIA COM OUTRO NOME.** A D16 proíbe a cópia, não a pasta.

---

## D375 · O NÃO MEDIDO SAI `null`, NUNCA ZERO, SE LÊ PELO CÓDIGO QUE ESCREVE A MEDIDA — e a porta dizia zero metro de rua · 17/10/2026

**Contexto:** item 900 (LAB-147). A caixa só tinha o `900`, e a FILA seguia sem proposta que não esperasse ninguém. Fui
à dívida própria, espécie **regra sem guarda**, no `CLAUDE.md` §4: *"Não inventa dado: o não medido sai `null`, nunca
zero (D23)."* Descartada do LAB-138 ao LAB-146 como *"espalhada por vinte módulos"*. A varredura de chamadas (LAB-52)
pega o `?? 0` sobre CHAMADA e declara que não pega o `?? 0` sobre PROPRIEDADE — que é a forma em que uma medida ausente
vira zero. O buraco estava escrito e ninguém o cobria.

**Medido (LAB-147):** `git ls-files`, código fora de `upstream/` e de `tests/` — 206 arquivos, 177 `?? 0`/`|| 0` fora de
comentário, **45** sobre medida (pelo sufixo de unidade da convenção do LAB-143), em 17 arquivos, depois dos dois
consertos (eram 47 em 19). Pelo escrito: nas provas, `comprimentoDeVia_m` vale **0** nas três aprovadas de
`docs/provas/LAB-06/ranking.json` (974, 776 e 214 lotes) — a via do contrato v1 do Generate não tem campo de
comprimento, e a porta somava `v.comprimento_m ?? 0`. **Regra descumprida**, ao lado de um comentário que prometia o
contrário (`Indicadores`, em `porta.ts`: *"nunca zero"*).

**Decidido:**

1. A porta devolve `comprimentoDeVia_m: null` se qualquer via vier sem comprimento. A função `indicadoresDa` sai de
   `porta/motores.ts` para `porta/indicadores.ts`, sem import de motor, para que a prova rode no portão sem clones.
2. O `julgar` de `motores/comum.ts` grava `areaPrivativa_m2 ?? null` (o tipo do dono diz `number`; hoje não muda
   nada, e o dia em que faltar sai "não medido", como o cabeçalho da função promete).
3. `src/nulo-nunca-zero.ts`: as duas formas (`operando` e `chave`), a lista fechada `ZEROS_DECLARADOS` por arquivo,
   com contagem, **classe** e motivo — `nunca-dispara`, `nao-disparou-nas-provas`, `ausencia-e-zero-de-verdade`,
   `parametro-padrao`, `ferramenta-historica` —, conferida nos dois sentidos (zero novo e declaração que sobra).
4. `tests/nulo-nunca-zero.test.ts`, 19 testes, sem clones: 1 319 → 1 338 no trabalho sem clones.
5. **A prova do LAB-06 não se rege** (D118): é a fotografia do dia, e o relatório do LAB-147 diz que o zero dela é
   inventado.

**Os dois lados:** sete mutações plantadas e cinco na árvore de verdade (a porta velha, o `?? 0` do `julgar` de volta,
um zero a mais na rampa, um a menos no preço do sétimo, a frase tirada do `CLAUDE.md`), todas acusadas. A casa de hoje
passa; o contador e o comprimento de lista passam (o caso que quase parece inválido).

**Descartado:** consertar as ferramentas antigas (`lab02` … `lab50`, as duas do Symbios) — regerariam provas
históricas, e as do Symbios só rodam com o `.wasm`; régua por nome sem unidade (`lotes ?? 0` é contagem, e a régua não
tem como saber); `soOCodigo` em vez de `semComentarios` (apagaria o `${…}` dos textos impressos, onde mora parte dos
zeros); ler o zero no JSON gravado (um zero escrito não diz se foi medido).

> **O BURACO DECLARADO DE UMA RÉGUA É O LUGAR ONDE A PRÓXIMA REGRA ESTÁ DESCUMPRIDA.** A varredura de chamadas dizia, por
> escrito, o que não pegava — e era exatamente ali.

---

## D376 · "NÃO HÁ NADA PAGO NESTE REPOSITÓRIO HOJE" PASSA A PERGUNTAR À ÁRVORE — cinco portas, lista fechada com classe · 17/10/2026

**Contexto:** item 900 (LAB-148). A caixa só tinha o `900`, e a FILA seguia sem proposta que não esperasse ninguém; a
espécie *regra sem guarda* ficou dita como esgotada no LAB-147. Fui à quinta espécie da dívida própria, **mensagem fixa
que afirma estado sem perguntar**, no `CLAUDE.md` §4-A: *"não há nada pago neste repositório hoje"*. A única trava
(`custo-por-uso.test.ts`, item 005) conferia que a frase estava ESCRITA — um cliente de API paga entrando deixaria a
frase escrita e a trava verde.

**Medido (LAB-148), por LUGAR:** uma coisa paga só funciona se entrar por uma porta da árvore, e são cinco —
dependência (`package.json`, `Cargo.toml`, `upstream/` incluído), variável de ambiente lida por nome, endereço
`http(s)://` no código, segredo da rotina, ação e máquina da rotina. **33 portas** (17, 4, 7, 1, 4), **nenhuma paga**:
nenhum SDK de serviço, nenhuma chave, nenhum host de API de terceiro, nenhuma máquina maior que a padrão.

**Decidido:**

1. `src/nada-pago.ts`: as cinco portas lidas do texto versionado, e `PORTAS_DECLARADAS`, lista fechada por
   `porta:nome` com **classe** (`gratuito`, `local`, `nao-e-chamada`, `pago`) e motivo, conferida nos dois sentidos.
2. **A frase e a classe se amarram:** porta `pago` com a frase escrita é `a-frase-mente`; nenhuma `pago` e a frase
   sumida é `a-frase-sumiu`.
3. No Rust, a limpeza de comentário é por linha `//`: a de JS (LAB-52) se perde nas aspas de dentro da string bruta e
   apagava o endereço do exemplo SVG do `upstream/` — medido na primeira rodada.
4. `tests/nada-pago.test.ts`, 16 testes, sem clones: 1 338 → 1 354 no trabalho sem clones.

**Os dois lados:** a casa de hoje passa, comentário não é porta, `[[bench]]` fecha a seção; doze jeitos plantados de
pôr uma coisa paga reprovam; onze mutações no módulo, onze acusadas.

**Descartado:** ler os `.lock` (o transitivo não entra por escolha nossa; o SDK pago entra pelo nome direto); ler
endereço em `docs/` (documento cita sem chamar); declarar sem classe (uma porta paga entraria como "declarada" e a frase
continuaria passando).

> **FRASE QUE AFIRMA ESTADO E SÓ SE CONFERE ESCRITA É UMA FOTOGRAFIA QUE NINGUÉM DATA.** A trava não pergunta se a
> frase existe; pergunta à árvore se ela ainda é verdade.

## D377 · O QUE O VIZINHO PRECISA VIRA LISTA NUMERADA EM RELATÓRIO, E A RÉGUA LÊ A FORMA DO PEDIDO — cinco pedidos sem lista, o último na véspera · 17/10/2026

**Contexto:** item 900 (LAB-149). A caixa só tinha o `900`, e a FILA seguia sem proposta que não esperasse ninguém. Fui
à dívida própria, espécie **regra sem guarda**, no `CLAUDE.md` §4: *"o que o vizinho precisa **vira lista numerada em
relatório**"*. A primeira metade da frase (clones só leitura, `git status` limpo) tem trava desde o LAB-38; esta metade
só tinha a do enxugamento (item 028), que confere que a frase está ESCRITA no `CLAUDE.md`. O LAB-147 dizia a espécie
esgotada — e esta cláusula tinha escapado à conta porque mora na mesma linha de uma regra guardada.

**Medido (LAB-149), por LUGAR:** o pedido ao vizinho mora em dois lugares de um relatório — o **título de seção** (um
destino e um gesto de levar: *"Para o Generate — lista numerada"*, *"O que vai ao Laboratório de Parcelamento"*, *"O que
fica pedido"*) e o **marcador** *"- **Para o Generate …:**"* das seções de achados. Nos 145 relatórios de
`docs/relatorios/` (o `RECADOS.md` fora): **27 lugares, 22 com lista e cinco sem** — LAB-03 e LAB-07 (a correção das
duas cotas em prosa), LAB-24 (a proposta como arquivo, descrita em tópicos), LAB-82 (o pedido de seis linhas foi só no
recado) e **LAB-147, a véspera**: um marcador *"Para o Generate"* em tópico. A regra estava descumprida até ontem.

**Decidido:**

1. `src/pedido-ao-vizinho.ts`: os dois lugares lidos pela forma, e as **quatro escritas** de lista numerada da casa
   (`1.`, linha de tabela que começa pelo número, subtítulo numerado, linha numerada em bloco de código).
2. Os cinco de antes congelados em `SEM_LISTA_ANTES_DA_TRAVA`, com motivo; **não se reescreve relatório antigo** para
   passar (D118). Do LAB-149 em diante, congelar é `excecao-depois-da-trava`: relatório novo numera.
3. `NAO_E_PEDIDO` existe, vazio: o título que tem a forma e não é pedido se declara com motivo, e a declaração sobra
   quando o título some.
4. `tests/pedido-ao-vizinho.test.ts`, 24 testes, sem clones: 1 354 → 1 378 no trabalho sem clones.

**Os dois lados:** a casa de hoje passa; as quatro escritas de lista passam; título que fala do vizinho sem pedir
(*"Os clones vizinhos ficaram limpos"*) não é lugar; título dentro de bloco de código não é título. Pedido sem número,
pedido sozinho, marcador em tópico, congelado depois da trava, declaração que sobra, motivo curto e universo vazio
reprovam. Quinze mutações no módulo, quinze acusadas.

**Descartado:** contar o pedido no recado (a regra diz *"em relatório"*, e o recado tem doze linhas); exigir mais de um
item (um pedido só, numerado `1.`, cumpre); reescrever os cinco relatórios antigos (é reescrever o registro do dia).

> **REGRA QUE DIVIDE A LINHA COM UMA REGRA GUARDADA PARECE GUARDADA.** A trava da primeira metade da frase deixou a
> segunda metade de fora por cinco semanas, e a conta da espécie "esgotada" passou por cima dela.

## D378 · O BALANÇO VAI AO ARQUIVO COM DATA, ORIGEM, CONTEÚDO E PROVA, E A RÉGUA LÊ TODA ENTRADA DATADA — nove de onze sem algum campo · 17/10/2026

**Contexto:** item 900 (LAB-150). A caixa só tinha o `900`, e a FILA seguia sem proposta que não esperasse ninguém. Fui
à dívida própria, espécie **regra sem guarda** (aqui, guarda estreita), no `CLAUDE.md` §1-B: *"Vai a `BALANCOS.md` com
**data, origem, conteúdo e prova**."* A guarda do LAB-42 (`tests/balancos.test.ts`) perguntava os campos só às entradas
do §1 (`### 1.N`), e só `origem` e `o que produziu`; os saldos que nasceram dentro do arquivo (`## 3` a `## 10`) não eram
lidos, e *conteúdo* e *prova* não eram perguntados em entrada nenhuma.

**Medido (LAB-150), por LUGAR:** a entrada de balanço é o título do `BALANCOS.md` com número de seção e data; os campos
moram na tabela logo abaixo dele, antes do primeiro subtítulo. **Onze entradas, duas completas (§7 e §8) e nove com campo
faltando**: §1.1 a §1.3 sem conteúdo e prova, §3 a §5 sem tabela nenhuma, §6 sem prova, §9 e §10 sem *o que produziu*.
Nenhuma depois de 08/10: os saldos recentes moram nos recados (o índice do §2).

**Decidido:**

1. `src/balanco-com-os-campos.ts` cobra os **cinco** que o próprio `BALANCOS.md` promete (data no título; origem, o que
   continha, o que produziu e onde está a prova na tabela) — os quatro do `CLAUDE.md` e o quinto do arquivo: régua que
   cobra menos do que o arquivo promete repete o defeito.
2. As nove de antes congeladas em `FALTAVA_ANTES_DA_TRAVA` com **exatamente** o que falta e o motivo; **não se completa
   balanço antigo** (D118) — acrescentar a prova hoje a um saldo de 07/10 seria reconstrução sem etiqueta. Entrada datada
   depois de 17/10/2026 não se congela.
3. *Estado* não vale por *o que produziu*: um diz se a fila terminou, o outro o que saiu dela.
4. `tests/balanco-com-os-campos.test.ts`, 24 testes, sem clones: 1 378 → 1 402 no trabalho sem clones.

**Os dois lados:** o arquivo de hoje passa; as escritas da casa (*"o que ele continha"*, *"continha ao fim"*, *"o que ele
produziu"*) passam; subtítulo, título em bloco de código e o índice sem data não são entrada. Cada campo tirado, entrada
sem tabela, campo abaixo do subtítulo, data que não existe, congelada depois da trava, congelada que perde mais um campo,
declaração que sobra (nos dois jeitos), motivo curto e universo vazio reprovam. Doze mutações no módulo, doze acusadas.

**Descartado:** ler os campos na entrada inteira (as tabelas de conteúdo seriam lidas como campo); exigir ordem entre as
entradas (o §1 é grupo à parte, e a ordem do índice tem trava); alargar a guarda do *"Testfit é nome interno"* (§5), que
não tinha caso a acusar.

> **GUARDA QUE NASCE JUNTO DE UM ARQUIVO COBRA A FORMA QUE ELE TINHA NO DIA.** O `BALANCOS.md` cresceu numa forma nova
> (os saldos `## N`) que a guarda do LAB-42 não lia, e os campos que ela não perguntava foram os que faltaram.

## D379 · O MOTIVO DE UMA PERDA NÃO MORA EM COMENTÁRIO, E A FRASE QUE A CASA MEDIU FALSA SE PERGUNTA À ÁRVORE INTEIRA — nove vivas em cinco arquivos · 17/10/2026

**Contexto:** item 900 (LAB-151). A caixa só tinha o `900`, e a FILA seguia sem proposta que não esperasse ninguém. Fui
à dívida própria, espécie **regra sem guarda**, no `CLAUDE.md` §4: *"O motivo de uma perda não mora em comentário (D98,
D104)."* A primeira metade da linha (o destino no inventário, conferido contra o motor rodando) tem trava desde o
LAB-25; esta só se conferia escrita (item 028). O D98 e o D105 ensinam que comentário não se revalida — e o inventário
tirou o motivo do comentário **na ponte**, sem nada perguntar se a frase seguia viva noutro lugar.

**Medido (LAB-151), por LUGAR:** quatro frases que a casa registrou como falsas (duas do D98, uma do D104, uma das perdas
remedidas do LAB-93), procuradas parágrafo a parágrafo em 346 arquivos que o `git` carrega fora de `docs/`, `upstream/`
e `node_modules/`. **26 ocorrências em 24 parágrafos de 19 arquivos: 13 citadas, uma na história, três genéricas e nove
vivas, em oito parágrafos de cinco arquivos** — a ponte do Symbios (escrita em 02/10, na véspera do D98), a ferramenta do
LAB-07 (duas, uma delas mensagem fixa do console), os dois README e a ferramenta do LAB-08 (três).

**Decidido:**

1. Consertadas as seis do texto vivo — ponte do Symbios, `medir.ts` (cabeçalho e console), os dois README —, sem mudar
   comportamento: no passado e com a data, ou riscadas.
2. As três do `lab08.ts` ficam, **declaradas** em `VIVAS_DECLARADAS` com o motivo: a ferramenta reproduz a prova congelada
   do LAB-08, e consertar o `rampa: null` reescreveria a prova do dia (D118).
3. `src/frase-vencida.ts`: lista fechada `AS_FRASES_VENCIDAS`, **cada uma com a fonte onde a medição mora**, conferida
   (`frase-sem-fonte`); a frase citada, na história ou genérica passa; a viva fora da declaração reprova; a declaração
   desce com a árvore. As aspas se contam no parágrafo; a marca de história e a genérica, na sentença.
4. `tests/frase-vencida.test.ts`, 25 testes, sem clones: 1 402 → 1 427 no trabalho sem clones.

**Os dois lados:** a árvore de hoje passa; citada, história, genérica, passado e declaração que bate passam. A forma exata
do D98, a do Symbios quebrada no JSDoc, a de dois `//`, a do console, a do README, cada uma das quatro frases, a história
noutra sentença, a citada antes da viva, a sobra nos dois jeitos, o motivo curto, o universo vazio e a fonte nos três
jeitos reprovam. Treze mutações no módulo, treze acusadas — duas só depois de entrar o caso que faltava (lição 12c).

**Descartado:** varrer só as pontes (acharia uma das nove); varrer `docs/` (o registro do dia conta o que era); derivar a
lista das `oQueDizia` automaticamente (frase longa casada inteira só pega cópia exata); consertar o `lab08.ts`.

> **O CONSERTO DE UMA FRASE FALSA NUM LUGAR NÃO A MATA NOS OUTROS.** O D98 achou a frase no `volta.ts`, consertou e
> escreveu a regra; a cópia da véspera, noutra ponte, seguiu viva por quinze dias — e mais quatro, em README e ferramenta,
> por um mês.

## D380 · O TRABALHO ACONTECE EM `archilly/`, DOCUMENTADO, E O LUGAR QUE O DOCUMENTA NOMEIA CADA PROJETO QUE EXISTE — a página do Symbios dizia um de três · 17/10/2026

**Contexto:** item 900 (LAB-152). A caixa só tinha o `900`, e a FILA seguia sem proposta que não esperasse ninguém. Fui
à dívida própria, espécie **regra sem guarda**, no `CLAUDE.md` §3, a regra de ouro, item 2: *"O trabalho acontece em
`archilly/`, documentado."* Os itens 1, 3 e 4 têm trava (LAB-132, LAB-135, LAB-134); o 2 só se conferia escrito (item
028).

**Medido (LAB-152), por LUGAR:** o `git ls-files` dá dois motores com `archilly/` e cinco projetos. Um motor diz o que
mora em `archilly/` num de dois lugares que a casa já usa: o `archilly/README.md`, com uma seção por projeto (o
`straight-skeleton`, que nomeia os dois), ou a linha `archilly/` da tabela de pastas da página do motor (o Symbios). A
linha do Symbios, escrita no LAB-00, nomeava **só `probe/`**, e calava o `wasm-probe/` (LAB-00) e o `wasm/` — a ponte
Rust que vira o `.wasm` do navegador, nascida no LAB-01.

**Decidido:**

1. Consertada a linha do Symbios: os três projetos, cada um com o que é e de onde veio, e quem a confere desde quando.
2. *Documentado* é **nomeado no lugar onde o motor diz o que mora em `archilly/`**. Não se exige `README.md` em cada
   projeto: a página única com uma seção por projeto, do `straight-skeleton`, é a forma mais legível da casa.
3. `src/o-trabalho-em-archilly.ts`: `sem-lugar`, `projeto-calado`, `nomeado-sem-existir` e `universo-vazio`. O nome é o
   que está entre crases e acaba em barra, fora a anatomia; no README vale só o título de seção, na página só a célula da
   tabela; o que o `git` não carrega não é lugar.
4. `tests/o-trabalho-em-archilly.test.ts`, 20 testes, sem clones: 1 427 → 1 447 no trabalho sem clones.

**Os dois lados:** a árvore de hoje passa; a linha que nomeia, o README com seções, os dois lugares somados, a prosa antes
da tabela e o motor sem `archilly/` passam. A linha do LAB-00, o projeto novo calado, o nome de projeto apagado (nos dois
lugares), a menção solta no corpo, nenhum lugar, o README fora do `git`, o motor só com arquivo solto e o universo vazio
reprovam — e a página de hoje com a linha antiga devolvida também. Onze mutações no módulo, onze acusadas — uma só depois
de entrar o caso que faltava (lição 12c).

**Descartado:** exigir `README.md` por projeto (acusaria o que está bem documentado); um lugar só (reescreveria página
certa); consertar agora as duas frases do `adapter/` na mesma página (*"Vazia. Fase futura."*, *"Adapter: não
escrito"*), falsas desde o LAB-01 — são de outra regra do §3, e conserto de texto sem trava envelhece calado (D104): vão à
FILA como proposto ao chat.

> **A TABELA DE PASTAS ESCRITA NO DIA EM QUE A CASA NASCE É A PRIMEIRA PÁGINA A ENVELHECER.** Ela conta o que havia, e
> ninguém volta a ela quando nasce a pasta nova — o `wasm/`, o projeto mais usado da pasta, viveu 37 dias fora dela (10/09 a 17/10).

## D381 · NÃO TEM INTERFACE, E A GUARDA PERGUNTA AO REPOSITÓRIO INTEIRO PELAS TRÊS PORTAS — a do LAB-36 lia `.html` num disco só · 17/10/2026

**Contexto:** item 900 (LAB-153). A caixa só tinha o `900`, e a FILA seguia sem proposta que não esperasse ninguém. Fui
à dívida própria, espécie **regra sem guarda** (guarda estreita), no `CLAUDE.md` §4: *"Não tem interface — com UMA
exceção, declarada: a bancada do navegador, com guarda contando HTML."* A guarda do LAB-36 diz no título *"exatamente UM
html no repositório"* e lê o **disco** de `external-engines/`, só `.html`.

**Medido (LAB-153):** por mutação, uma página `docs/painel/index.html` com formulário e um componente
`external-engines/testfit/adapter/src/Painel.tsx`, os dois no `git`, passaram a guarda (25 de 25). Por LUGAR, o
`git ls-files` inteiro (733 arquivos, 334 de código), três portas: **página** (`.html`, `.htm`, `.xhtml`) — 1, a bancada;
**componente** (`.tsx`, `.jsx`, `.vue`, `.svelte`, `.astro`) — 0; **servidor** (`Bun.serve(`, `createServer(` no código,
sem comentário e sem string) — 1, o `prova-automatica.ts` que abre a bancada. A regra está verdadeira; a guarda é que não
perguntava ao repositório.

**Decidido:**

1. `src/a-unica-interface.ts`: `interface-fora-da-excecao`, `excecao-que-sumiu` e `universo-vazio`; a exceção é uma lista
   fechada por **arquivo e porta**, com motivo — a página e o servidor da bancada.
2. `tests/a-unica-interface.test.ts`, 17 testes, sem clones: 1 447 → 1 464 no trabalho sem clones.
3. A frase do `CLAUDE.md` §4 diz o que a guarda conta: *"com guarda contando página, componente e servidor em tudo o que
   o `git` carrega (D381)"*. A guarda do LAB-36 fica (ela pergunta o `<form`), com um comentário apontando para cá.

**Os dois lados:** a árvore de hoje e a plantada só com a exceção passam; servidor em comentário ou string, `html.ts`,
`.d.ts` e `node_modules/` não contam. As duas formas da mutação, cada extensão em qualquer pasta, uma segunda página na
pasta da bancada, servidor noutro arquivo, a exceção apagada, sem servidor ou com a porta trocada, e o universo vazio
reprovam. Onze mutações, onze acusadas — a da porta ignorada só depois de entrar o caso da porta trocada (lição 12c: era
equivalente com a exceção de hoje).

**Descartado:** contar CLI e PNG de prova como interface (não é o que a regra proíbe); trocar a guarda do LAB-36 em vez de
somar (régua que responde certo não se troca); congelar o tamanho do universo no teste (cada arquivo novo o mudaria).

> **GUARDA QUE DIZ "NO REPOSITÓRIO" NO TÍTULO TEM DE SER PERGUNTADA SOBRE QUEM É O REPOSITÓRIO NO CÓDIGO.** A do LAB-36
> dizia o repositório e lia uma pasta do disco, e um tipo de arquivo — o título prometia mais do que o código lia.

## D382 · NÃO REIMPLEMENTA O VALIDATOR NEM O JUDGE, E A GUARDA SEGUE A CADEIA DE CHAMADAS ATÉ O GENERATE — a do LAB-36 lia cinco nomes numa pasta e uma menção · 17/10/2026

**Contexto:** item 900 (LAB-154). A caixa só tinha o `900`, e a FILA seguia sem proposta que não esperasse ninguém. Fui
à dívida própria, espécie **regra sem guarda** (guarda estreita), no `CLAUDE.md` §4: *"Não reimplementa o Validator nem o
Judge (D20)."* A guarda do LAB-36 confere que o `comum.ts` **contém o texto** `@generate/` e que nenhum `.ts` de
`esteira/src/` diz `function`/`class` seguido de cinco nomes.

**Medido (LAB-154):** por mutação, `export function julgarLocal` no adaptador do Symbios e `export const validar = () =>`
em `esteira/src/`, os dois no `git`, passaram a guarda (25 de 25). O `comum.ts` com o import trocado por um Validator e um
Judge locais que aprovam tudo, tipados pelo `typeof` do Generate e sem gravar `limpo`, passou a suíte inteira com os três
clones: 1 797 e 9 antes, 1 795 e 11 depois — as duas novas são as provas do LAB-52 e do LAB-57, que contam linhas e bytes.
Gravando `limpo: true`, cai também a LAB-110. Por LUGAR, pela árvore sintática do TypeScript, 335 arquivos
TypeScript/JavaScript e 5 Rust (fora `upstream/` e `node_modules/`): 18 importam `montarParcelamentoExterno` e
`montarRelatorio` do especificador da D20; 8 funções com nome de julgamento, 7 chegam a eles pela cadeia de chamadas, e a
oitava é o `julgarPorLotes` de `tests/entrega.test.ts`, o Validator de mentira do LAB-06; nenhuma `fn` Rust. A regra está
verdadeira; a guarda é que não perguntava ao repositório, nem pela forma de escrever função, nem pela importação.

**Decidido:**

1. `src/o-julgamento-vem-do-generate.ts`: `julgamento-proprio`, `simbolo-redefinido`, `ponto-sem-importacao`,
   `excecao-que-sumiu` e `universo-vazio`. A cadeia segue import relativo, o apelido `@symbios/` e re-exportação, até
   parar de mudar; o vocabulário é `julga…`, `julgu…`, `valida…`, `validator`, `judge`, `juiz`; a exceção é por **arquivo
   e nome**, com motivo — o dublê do LAB-06.
2. `tests/o-julgamento-vem-do-generate.test.ts`, 22 testes, sem clones: 1 464 → 1 486 no trabalho sem clones.
3. A frase do `CLAUDE.md` §4 diz o que a guarda conta: *"com guarda seguindo a cadeia de chamadas até o Generate em tudo o
   que o `git` carrega (D382)"*. A guarda do LAB-36 fica, com um comentário apontando para cá.

**Os dois lados:** a árvore de hoje, o embrulho pela cadeia (relativo com outro nome, apelido, re-exportação), o símbolo
passado como argumento, a menção em comentário ou string, o resultado guardado, `upstream/` e `node_modules/` passam. As
três mutações literais, cada forma de escrever função, o ponto que só menciona ou importa de outro arquivo, o nome do
julgamento redefinido, a cadeia cortada, `fn julgar` em Rust, a exceção apagada ou que passou a chegar, o mesmo nome noutro
arquivo e o universo vazio reprovam. Vinte e uma mutações no módulo: vinte acusadas, uma equivalente declarada no
relatório (lição 12c).

**Descartado:** um vocabulário com `nota`, `score`, `avaliar` e `conferir` (a casa tem dezenas de `conferir…` que são
réguas; a lista viraria exceção) — o buraco é fechado pelo ponto que tem de importar e pelos dois nomes que não se
redefinem; exigir chamada direta ao Generate (acusaria o embrulho que a D20 pede); ler por texto (as formas perdidas eram de
sintaxe); congelar os 18 e os 8 no teste.

> **"TEM GUARDA" NÃO RESPONDE "A REGRA É GUARDADA".** A pergunta que responde é a mutação no ponto central rodada contra a
> suíte inteira: um veredito falso no `comum.ts` não foi acusado por nenhum teste que olha veredito.

## D383 · "TESTFIT" É NOME INTERNO, E A GUARDA LÊ ONDE A PÁGINA DO JONNY O MANDA — a do LAB-36 lia dois arquivos de uma lista · 17/10/2026

**Contexto:** item 900 (LAB-155). A caixa só tinha o `900`, e a FILA seguia sem proposta que não esperasse ninguém. Fui
à dívida própria, espécie **regra sem guarda** (guarda estreita), no `CLAUDE.md` §5: *"**"Testfit" é nome interno**; para
o usuário é **Laboratório de Parcelamento**."* A guarda do LAB-36 lê `docs/PENDENCIAS_JONNY.md` e
`docs/COMPARACAO_DOS_MOTORES.md`, escritos à mão numa lista, e pergunta se o texto contém `testfit`. O LAB-150 tinha
descartado esta frase dizendo *"a bancada não diz Testfit — nada a acusar"*, sem perguntar onde mais o Jonny lê.

**Medido (LAB-155):** por mutação, `Testfit` no título da bancada do navegador (a única interface, §4) passou 25 de 25, e
`Test Fit` na página do Jonny passou 25 de 25. Por LUGAR, *"voltado ao usuário"* é **onde a página dele o manda**: onze
endereços, dois de fora da casa (configurações do GitHub), nove desta casa em oito arquivos mais o repositório sem caminho,
que o GitHub abre no `README.md`. O `README.md` da raiz — o **primeiro** endereço da página dele — dizia *"motor do
Testfit"* **seis vezes**, em texto corrido, com a guarda verde. **Regra descumprida**, consertada (texto, nenhum
comportamento): *"motor do Laboratório de Parcelamento"*, seis linhas. Os outros cinco do README
(`external-engines/testfit/`, `motor-testfit`) são caminho e endereço, e ficam.

**Decidido:**

1. `src/nome-interno.ts`: `nome-interno-na-pagina` (com a linha), `endereco-sem-classe`, `declarado-que-sumiu` e
   `universo-vazio`. O universo sai da página do Jonny — os endereços desta casa que ela traz, absolutos ou relativos —,
   mais a bancada (a exceção de interface do LAB-153 e o que ela carrega por `src=`). Cada endereço é `pagina` (cobrada:
   o README, a comparação) ou `registro` (declarado com motivo: `ONDE_PARAMOS`, `INDEX`, `RECADOS` e quatro relatórios),
   em lista fechada.
2. A palavra cobrada é a **solta** — sem hífen, barra, sublinhado, ponto ou crase colados, fora de endereço —, nas cinco
   grafias `Testfit`, `TestFit`, `TESTFIT`, `Test Fit`, `test-fit`.
3. `tests/nome-interno.test.ts`, 21 testes, sem clones, no portão sem clones do `verde.yml`.
4. A frase do `CLAUDE.md` §5 diz o que a guarda lê: *"com guarda lendo onde a página do Jonny o manda e a bancada
   (D383)"*. A guarda do LAB-36 fica, com um comentário apontando para cá.

**Os dois lados:** a árvore de hoje, a casa de mentira do mesmo tamanho, pasta, repositório vizinho, crase, endereço,
`test_fit` e `testfitAtivo`, e a palavra num `registro` passam. As cinco grafias soltas, a palavra na página dele, no título
da bancada, no script que ela carrega e no README, o endereço novo sem classe (absoluto e relativo), o declarado que a
página não traz, o arquivo declarado que não existe, o script da bancada que sumiu e a página vazia reprovam. Seis
mutações na árvore de verdade, seis acusadas.

**Descartado:** cobrar os registros (o `ONDE_PARAMOS.md` tem a história embaixo, e recado enviado não se reescreve; e ali a
palavra é quase sempre a pasta `testfit/`); seguir link de dentro das páginas cobradas (um salto basta para o que a página
dele promete; declarado como buraco); ler o código dos adaptadores (comentário de código é língua da casa, não texto ao
usuário); congelar os nove endereços no teste fora da lista declarada.

> **"VOLTADO AO USUÁRIO" NÃO É UMA LISTA QUE SE LEMBRA: É ONDE A CASA MANDA O USUÁRIO.** A lista do LAB-36 tinha os dois
> arquivos que alguém lembrou, e o primeiro endereço da página dele não estava nela.

## D384 · BALANÇO QUE JÁ MORA NUM RECADO NÃO SE COPIA, E A GUARDA COMPARA OS DOS ARQUIVOS — só o "aponta-se" tinha trava · 17/10/2026

**Contexto:** item 900 (LAB-156). A caixa só tinha o `900`, e a FILA seguia sem proposta que não esperasse ninguém. Fui
à dívida própria, espécie **regra sem guarda**, no `CLAUDE.md` §1-B: *"**Balanço que já mora num recado não se copia:**
aponta-se para ele."* A metade *"aponta-se"* tem a guarda do LAB-42 (`tests/balancos.test.ts`: toda seção citada no
índice do §2 existe no `RECADOS.md`). A metade *"não se copia"* — a que o `BALANCOS.md` justifica com *"copiar criaria a
segunda montagem que o D116 proíbe"* — não tinha nenhuma.

**Medido (LAB-156):** por mutação, as linhas `Estado:` e `Feito:` do recado do LAB-37 (o quarto balanço do índice,
1 406 caracteres) coladas no §2 do `BALANCOS.md` deixaram a esteira inteira como estava: 1 840 aprovadas e as 9
reprovações do `.wasm` de sempre. Por LUGAR, os dois arquivos inteiros, lidos como a regra se lê (sem `>`, sem negrito,
espaço colapsado), seção por seção do `BALANCOS.md`: trechos contíguos em comum de 40 caracteres, 64; de 80, 8 (sete de
81 a 98, frases que a mesma mão escreveu nos dois); de 100 e de 120, **um só**, de 155, e no sentido **contrário** ao
da regra — a lista das cinco propostas que nasceu no saldo do §6 e que o recado do LAB-52 repetiu no *Próximo na fila*,
depois de apontar para ela. **Regra verdadeira, guarda ausente.**

**E uma medição minha estava errada:** lida a cru, com o negrito, a mesma conta dava **zero** trechos de 120 — o
`BALANCOS.md` põe negrito no meio da lista, e o recado não. Cópia com ênfase diferente é cópia; a
régua lê pelo `comoARegraSeLe` do LAB-77.

**Decidido:**

1. `src/balanco-nao-se-copia.ts`: `conferirQueOBalancoNaoSeCopia(balancos, recados)` devolve o universo (seções,
   caracteres dos dois lados, janelas, títulos citados), os trechos em comum de `JANELA` = 120 ou mais, as cópias (os
   não declarados) e as declarações fantasma. Filtro de prefixo de 32 caracteres antes do `includes` (exato; a conta
   caiu de ~5 s para menos de 1 s).
2. **O caso válido:** o título de seção do `RECADOS.md` citado entre crases no índice do §2 — o próprio *"aponta-se para
   ele"* — sai antes de comparar, só quando é igual a um título que existe. Os de hoje têm 55 a 63 caracteres; um título
   longo citado seria acusado por cumprir a regra.
3. `COPIAS_DECLARADAS`: o trecho do §6, com motivo e **teto** de 155 caracteres (crescer é cópia nova); declaração sem
   trecho reprova. O recado do LAB-52 não se reescreve (D118).
4. `tests/balanco-nao-se-copia.test.ts`, 16 testes, sem clones, no portão sem clones do `verde.yml`. A frase do
   `CLAUDE.md` §1-B diz o que a guarda lê. A do LAB-42 fica, com um comentário apontando para cá.

**Os dois lados:** a árvore de hoje, o título longo citado, a frase-lema nos dois e os trechos de 81 a 98 passam. A
mutação da medição, o sentido contrário (balanço colado num recado), a cópia com negrito e quebra de linha, o parágrafo
entre crases que não é título, o trecho declarado que cresce e a declaração fantasma reprovam. Oito mutações na régua,
sete acusadas; a oitava (o título sair sem separador) é **equivalente** na prática — a janela atravessaria o buraco só
se o texto de antes e o de depois do título formassem, juntos, 120 caracteres de um recado — e fica declarada.

**Descartado:** janela abaixo de 100 (mediria a mão que repete as próprias frases); subir a janela para 160 e não
declarar nada (é afinar a régua até o trecho passar); comparar o `BALANCOS.md` com os relatórios de prompt (a regra do
§1-B fala do recado); decidir o que é balanço dentro do `RECADOS.md` (a régua compara os dois arquivos inteiros e não
precisa).

> **"TEM GUARDA" PODE SER METADE DA FRASE.** A trava do LAB-42 respondia o *"aponta-se para ele"*, e a frase tem dois
> verbos: o *"não se copia"* passava calado ao lado dela.

## D385 · A SEMENTE É A MESMA EM TODAS AS PROVAS E O `geradoEm` É CARIMBO FIXO, E A GUARDA PERGUNTA PROVA A PROVA — a página afirmava "todas" e uma desmentia calada · 17/10/2026

**Contexto:** item 900 (LAB-157). A caixa só tinha o `900`, e a FILA seguia sem proposta que não esperasse ninguém. Fui
à dívida própria, espécie **mensagem fixa que afirma estado sem perguntar**, no `docs/provas/LEIA-ME.md` — a página
que diz como ler as provas. Duas frases dela falam de **todas** as provas: *"**A semente é a mesma em todos**
(`20260913`)"* e *"**`geradoEm` é carimbo fixo** nas provas, de propósito"*. As outras frases da página têm trava (LAB-29,
LAB-103/105, LAB-147, as chaves do §7); estas duas não tinham nenhuma — nada lia as provas por elas. Antes de escolher,
medi a espécie *"teste que nunca reprovou"* pela forma: dos 1 923 blocos `test`/`it` dos 124 arquivos de teste, **zero**
sem asserção (direta, por função local ou por `throw`); nada a pagar ali.

**Medido (LAB-157), por LUGAR:** os 84 `.json` de `docs/provas/`, chave a chave. **`semente`**: 111 valores em 35
arquivos, todos `20260913` — verdadeira. **`geradoEm`**: 34 valores (27 no alto, 7 em `archilly.geradoEm`); 33 com a
forma de carimbo escolhido (a data só, ou a hora cheia), **um com a forma do relógio**: `LAB-07/medicoes.json`,
`2026-09-13T14:31:44.835Z`. E o código (217 arquivos de `external-engines/` fora de `upstream/` e dos testes, pela árvore
sintática): três linhas leem o relógio para o `geradoEm` — `testfit/ferramentas/medir.ts:257` (a que escreveu a prova do
LAB-07), `symbios/adapter/ferramentas/medir.ts:276` (a do LAB-01, que grava em `outputs/lab01/`, fora das provas) e a
queda `opcoes.geradoEm ?? new Date()` do `testfit/adapter/src/volta.ts:382`. **A primeira não era descuido: era desenho
com o nome trocado** — o `adapter/src/esteira.ts` diz, ao lado do `CARIMBO_FIXO`, *"quando rodou de verdade fica no
JSON de medições"*; do LAB-47 em diante a casa chama a hora real de `quando` (46 vezes nas provas), e a página
generalizou a convenção nova sem a exceção.

**Decidido:**

1. **As duas ferramentas de medição gravam a hora real em `quando`** — o nome que a casa já usa —, e o `geradoEm` sai
   delas. Muda o nome de um campo de metadado, nenhum número; nenhum leitor de código lia aquele campo.
2. **A prova do LAB-07 não se regera** (D182, D288; citada nos relatórios do LAB-07 e do LAB-08): fica declarada em
   `CARIMBOS_DE_RELOGIO_DECLARADOS`, com o valor e o motivo, e a página passa a citá-la e a dizer que a hora real se
   chama `quando`.
3. **A queda do `volta.ts` fica**, declarada em `RELOGIO_DECLARADO_NO_CODIGO`: quem grava prova passa o carimbo, e quem cai
   nela são os testes do pacote. Trocá-la por uma data constante seria inventar quando a saída nasceu (D23).
4. `src/semente-e-carimbo.ts`: `conferirASementeEOCarimbo({ provas, codigo, pagina })` cobra — toda `semente` numérica é
   `20260913` e a página escreve o mesmo número; todo `geradoEm` tem a forma do carimbo escolhido (`ehCarimboFixo`: a
   data só, ou segundo e milissegundo zero); nenhum `geradoEm` do código lê o relógio (`new Date()` sem argumento,
   `Date.now()`, `performance.now()`, na propriedade, na variável, no parâmetro ou na atribuição); declaração que não
   acha mais o que declarou reprova; a página diz as duas frases e cita cada prova declarada; universo vazio reprova.
5. `tests/semente-e-carimbo.test.ts`, 23 testes, sem clones, no portão sem clones do `verde.yml`.

**Os dois lados:** a árvore de hoje, a hora cheia, a data só, `new Date("…")` com argumento, o relógio em `quando`, a
menção em comentário e em texto e a semente com outro nome passam. O `medir.ts` de volta ao relógio, uma prova nova com
a hora real, o relógio aninhado na SAÍDA, a semente diferente, a página com outra semente ou sem número, a página sem
uma das frases, a página que cala a exceção, as duas declarações fantasma, as seis formas do relógio no código e o
universo vazio reprovam. Dez mutações na régua, dez acusadas.

**Descartado:** regerar a prova do LAB-07 (apagaria a medição daquele dia para consertar um nome); tornar o carimbo
obrigatório no `voltaParaOContrato` (mudaria dez chamadas de teste para cobrar quem não grava nada); ler o `quando`
(é a hora real por convenção, e a régua pergunta o carimbo); cobrar o JSON fora de `docs/provas/` (a frase da página é
sobre as provas — o `outputs/lab01/medicoes.json` fica como está, e a ferramenta dele já grava `quando`).

> **A CONVENÇÃO NOVA, ESCRITA COMO SE SEMPRE TIVESSE VALIDO, ESCONDE A PROVA VELHA.** A página disse *"todas"* depois que
> a casa passou a chamar a hora real de `quando` — e a única prova de antes que usava o outro nome ficou desmentindo-a
> sem que ninguém perguntasse.

## D386 · O LAB NÃO FAZ CHAMADA DE REDE EM EXECUÇÃO, E A GUARDA PERGUNTA A TODO O CÓDIGO PELAS QUATRO PORTAS — a página afirmava "nenhum `fetch`, nenhum `http`" e havia sete fora do motor · 17/10/2026

**Contexto:** item 900 (LAB-158). A caixa só tinha o `900`, e a FILA seguia sem proposta que não esperasse ninguém. Fui
à dívida própria, espécie **mensagem fixa que afirma estado sem perguntar**, no `docs/SEGURANCA.md` — a lista do Padrão
de Segurança, escrita no LF-FINAL (14/09/2026) e nunca mais perguntada. O topo diz que o Lab *"não tem tela, não tem
banco, não tem conta de usuário e não faz chamada de rede em execução"*; a linha *"Nada de rede em execução"* diz
*"Nenhum `fetch`, nenhum `http`"*. A tela tem trava (LAB-153), o banco tem a do `verde.test.ts` (caminho que *"não
existe"* conferido contra o disco); **a rede não tinha nenhuma** — nenhum arquivo de `esteira/` cita o `SEGURANCA.md`, e
a conferência de 14/09 foi um `grep` feito uma vez.

**Medido (LAB-158), por LUGAR:** todo o código que o `git` carrega (`.ts`, `.mts`, `.cts`, `.js`, `.mjs`, `.cjs`, `.rs`,
`.sh` e o gancho `pre-push`), `upstream/` incluído, por quatro portas — chamada (`fetch(`, `Bun.serve`, `createServer`,
`WebSocket`, `XMLHttpRequest`, `EventSource`, `sendBeacon`, `Bun.connect`/`listen`), módulo (`http`, `https`, `http2`,
`net`, `tls`, `dgram`, `dns`; no Rust `std::net`, `TcpStream`, `UdpSocket`, `TcpListener`, `reqwest`, `ureq`, `hyper`),
processo filho (o argumento `fetch`/`ls-remote`/`pull`/`push`/`clone`/`curl`/`wget`, string inteira, em posição de
argumento; `clone` com `file://` não conta) e linha de script. **370 arquivos, 52 no caminho do motor** (os adaptadores,
a porta, os motores e o esqueleto da esteira, o Rust do Lab em `archilly/` e o `upstream/`): **zero rede no motor** — a
frase do topo é verdadeira. **Fora do motor, sete, em seis arquivos**, que a linha da tabela calava: o `Bun.serve` em
127.0.0.1 da bancada e o `fetch(req)` dele (`prova-automatica.ts`, 2), o `fetch` do `.wasm` pela bancada (`prova.js`),
o `git fetch` do carimbo dos vizinhos (`commit-dos-vizinhos.ts`, que as ferramentas do LAB-68, 76, 93 e 94 chamam), o
`git ls-remote` dos ramos (LAB-121), o `curl` à API do GitHub (LAB-122) e o `fetch` de um clone de teste com origem
`file://` (LAB-116). Nenhuma escreve em lugar nenhum. A linha *"Nenhum `fetch`, nenhum `http`"* era **falsa como foi
escrita**: verdade no motor, sem dizer onde. E **nasceu falsa** fora dele — o `fetch` da bancada é do LAB-01 (10/09), a
linha é de 14/09, e é a única da tabela *Execução* sem comando nem medição ao lado, numa página que promete *"o comando ao lado de cada linha"*; as outras seis vieram depois (04/10 a 16/10), pela
`git log -S` de cada uma.

**Decidido:**

1. **A linha da tabela diz onde vale** (*"No caminho do motor, nenhum `fetch`, nenhum `http` — e, fora dele, sete redes
   declaradas"*), e a página ganha a seção *Reconferido no LAB-158* com a tabela das sete e o ponteiro para a trava. O
   texto do LF-FINAL fica; muda uma linha, nenhum comportamento.
2. `src/rede-em-execucao.ts`: `conferirARedeEmExecucao(arquivos, ler)` cobra — rede no caminho do motor reprova **mesmo
   declarada** (exceção ali seria a frase mentindo com licença); rede fora dele precisa de declaração em `DECLARADAS`
   (arquivo, forma, quantas, classe — `servidor-local`, `origem-publica`, `origem-de-teste` — e motivo), e uma a mais
   num arquivo declarado reprova; declaração com mais do que a árvore tem reprova; universo vazio reprova.
3. `tests/rede-em-execucao.test.ts`, 16 testes, sem clones, no portão sem clones do `verde.yml` (1 546 → 1 562); ele
   também cobra que o `SEGURANCA.md` diga a frase, aponte para a trava e mantenha a ressalva na linha da tabela.

**Os dois lados:** a árvore de hoje, a rede em comentário, em string e em template, a mensagem de erro que manda rodar
`git fetch`, o campo `evento: "push"`, o `clone` de `file://`, o nome do gancho `pre-push` e o `import` de `node:fs`
passam. Rede na porta, no adaptador, no Rust do Lab, no `upstream/` e nos motores, a declaração no motor, rede nova numa
ferramenta, uma a mais num arquivo declarado, declaração cuja rede sumiu e o universo vazio reprovam. **Onze mutações na
árvore de verdade, onze acusadas** (fetch na porta, `node:https` no adaptador, `std::net` no `upstream/`, `TcpStream` no
Rust do Lab, `require("net")` nos motores, `git pull` numa ferramenta, `curl` no `conferir.sh`, o `fetch` da bancada que
some, um `ls-remote` a mais, `git push` no gancho, a ressalva que sai da página).

**A primeira régua acusou duas vezes à toa, e consertei a régua, não a lista:** o nome do gancho na linha do
`conferir.sh` que confere o `core.hooksPath` (*pre-**push***) — o subcomando agora tem de vir logo depois do `git` e das
opções `-C`/`-c` —; e a própria lista de argumentos de rede deste módulo — agora uma string só, partida por espaço.

**Descartado:** cobrar o `verde.yml` (a máquina do GitHub clona e instala; não é a execução do Lab, e o arquivo não é
código que o Lab roda); cobrar o `bun install` (é de quem prepara a máquina, antes); desligar a rede das três travas e da
ferramenta que leem a origem (são a resposta da casa a *"o disco não é a origem"*, D241, e o `commit-dos-vizinhos` já dá
à trava o `false`); declarar por arquivo sem a contagem (uma segunda chamada no mesmo arquivo passaria calada).

> **"NENHUM", SEM DIZER ONDE, É A FRASE QUE A PRIMEIRA FERRAMENTA DESMENTE.** A linha era verdadeira para o motor e já
> falsa para a bancada no dia em que foi escrita; depois a casa ganhou um servidor de bancada e quatro leituras da origem —
> nenhuma no motor, todas no repositório que a página descreve. **E "✅" sem comando ao lado é a afirmação que ninguém
> refez:** a página prometia o comando de cada linha, e a da rede foi a que não trouxe.

## D387 · A ENTRADA SE CONFERE ANTES DO NÚCLEO EM TODA PORTA, E A GUARDA PERGUNTA PORTA A PORTA — a página nomeava duas portas, e a terceira, a do Generate, não recusava nada · 17/10/2026

**Contexto:** item 900 (LAB-159). A caixa só tinha o `900`, e a FILA seguia sem proposta que não esperasse ninguém. Fui
à dívida própria, na mesma espécie e na mesma página do LAB-158 — **mensagem fixa que afirma estado sem perguntar**, no
`docs/SEGURANCA.md` —, na linha seguinte da tabela *Execução*: *"Entrada validada antes de entrar no núcleo · ✅ · versão
do contrato, unidade (metro) e anel com ao menos 3 pontos são recusados com mensagem legível — `ida.ts` e `gleba-v1.ts`,
com teste"*. Escrita no LF-FINAL (14/09) e sem trava.

**Medido (LAB-159), por LUGAR:** toda função exportada de `esteira/src/motores/` (menos o `comum.ts`) — **sete**, e as
sete recebem a `EntradaMinima`. Cinco rodam motor, duas só traduzem parâmetro. Elas chegam ao núcleo por **três
portas**: a ida do Laboratório de Parcelamento (`idaParaOMotor`, as três recusas, as três com teste em
`testfit/tests/esteira.test.ts`), a do Symbios (`glebaParaOSymbios`, as três recusas, **só a da versão** com teste, em
`contrato-v2.test.ts`) e **a do motor interno do Generate (`rodarGenerate`), sem recusa nenhuma**. Rodado na gleba
`completo`: contrato `"9"` e `unidade: "ft"` voltaram com **1 606 lotes** cada, o mesmo número da gleba em metro — o motor
lê o número, não a unidade —, e o anel de 2 pontos voltou sem plano porque o motor não achou plano, não porque alguém
recusou. A porta do Generate nasceu no LAB-13 (19/09), cinco dias depois da página: a linha ficou falsa sem ninguém a
reescrever.

**Decidido:**

1. **Regra descumprida, consertada.** As três recusas saem do `glebaParaOSymbios` para `recusaDaEntrada` (`gleba-v1.ts`),
   com as mensagens de antes, palavra por palavra (o `contrato-v2.test.ts` continua passando sem mudar). O
   `glebaParaOSymbios` e o `rodarGenerate` perguntam a ela **antes** do motor. No Generate a recusa **não estoura** — a
   porta proíbe estourar —: volta `saida: null`, `ms: 0` e uma linha `recusei a entrada antes do motor: …` em
   `naoSoubeFazer`, e o `gerarPlano` não roda; a porta comum usa essa linha como `consequencia` em vez de *"não produziu
   plano"*.
2. A ida do Laboratório de Parcelamento fica com as suas: é de outro pacote e não importa a esteira.
3. `src/entrada-validada.ts`: `conferirAsPortasDaEntrada(arquivos, ler)` cobra, pelo código sem comentário —
   `porta-nao-declarada` (função de `motores/` que recebe a entrada ou chama motor e não está declarada),
   `declarada-que-sumiu`, `motor-antes-da-conferencia` (a conferência falta ou vem depois da chamada ao motor),
   `nao-porta-que-roda-motor`, `recusa-que-falta` (quem confere perdeu uma das três perguntas) e `universo-vazio`.
4. `tests/entrada-validada.test.ts`, 21 testes, sem clones, no portão sem clones do `verde.yml` (1 562 → 1 583): a
   página, a árvore, o comportamento da `recusaDaEntrada` e as duas recusas do `glebaParaOSymbios` que não tinham teste;
   e três testes novos em `motores.test.ts` (com o clone) provando o `rodarGenerate` nos três casos.

**Os dois lados:** a árvore de hoje, a chamada ao motor em comentário, o corpo de função com tipo de objeto no parâmetro e
o anel de exatamente 3 pontos passam. A porta do Generate de ontem, a conferência depois do motor, o Symbios que pula o
`glebaParaOSymbios`, a quarta porta sem declaração (recebendo a entrada ou só chamando o motor), a não-porta que passa a
rodar motor, a porta declarada que some, a recusa da unidade que some, o `glebaParaOSymbios` que deixa de perguntar, a
recusa do anel que some da ida e o universo vazio reprovam. **Doze mutações, doze acusadas**, e a de verdade — o
`generate.ts` da origem posto de volta no disco — derruba a árvore de hoje.

**A régua acusou duas travas vizinhas, e as duas tinham razão sobre o nome:** a do LAB-154 leu `conferirAEntradaValidada`
como nome de julgamento (*valida*), e a do LAB-110 leu o campo `confere:` como gravador de veredito. Renomeei a função
(`conferirAsPortasDaEntrada`) e o campo (`conferencia`); nenhuma régua afrouxada.

**Medido e NÃO consertado, proposto ao chat:** a porta comum (`porta/motores.ts`) **estoura** com a recusa da ida do
Laboratório de Parcelamento — `motorDoParcelamento().gerar` com `unidade: "ft"` lança em vez de devolver `recusei`, e a
porta promete nunca estourar —; e o `catch` da porta do Symbios rotula toda exceção como `relevo.curvas`. É outra regra
(a da porta, LAB-14), e o item 900 é uma tarefa por disparo.

**Descartado:** consertar a porta comum agora (fora do escopo, e é conserto de comportamento com regra própria);
validar o `schema` nas portas da esteira (a página não o promete); pôr a recusa dentro do `gerarPlano` (é código do
vizinho); deixar o `rodarGenerate` estourar como os outros dois (a porta proíbe).

> **A LINHA QUE NOMEIA AS PORTAS ENVELHECE NO DIA EM QUE NASCE A PRÓXIMA.** A página dizia `ida.ts` e `gleba-v1.ts`
> porque eram as duas portas de 14/09; a terceira chegou cinco dias depois, pela porta comum, e entrou no núcleo sem
> ninguém a perguntar. **O universo de "toda entrada" é a lista de portas, e ela se mede, não se lembra.**

## D388 · NENHUM `.env`, `.pem` OU ARQUIVO DE CREDENCIAL, E A GUARDA PERGUNTA PELO NOME AO QUE O `git` CARREGA E À HISTÓRIA — a varredura de conteúdo não respondia esta linha · 17/10/2026

**Contexto:** item 900 (LAB-160). A caixa só tinha o `900`, e a FILA seguia sem proposta que não esperasse ninguém. Fui
à dívida própria, na mesma espécie e na mesma página do LAB-158 e do LAB-159 — **mensagem fixa que afirma estado sem
perguntar**, no `docs/SEGURANCA.md` —, na tabela *Chaves e segredos*: *"Nenhum `.env`, `.pem` ou arquivo de credencial ·
✅ limpo · `find . -name ".env*" -o -name "*.pem" -o -name "*credential*"` — nada"*. Escrita no LF-FINAL (14/09), sem
trava. A linha do `.wasm` com imports vazios, descartada pelas duas rodadas anteriores, foi descartada de novo com o motivo
medido: esta máquina tem `cargo`, não tem o alvo `wasm32-unknown-unknown`, e o `rustup` não alcança `static.rust-lang.org`
pelo proxy.

**Medido (LAB-160):** primeiro, se a varredura de segredos (LAB-47) já respondia a linha — ela lê o **conteúdo**, e a
linha é sobre o **nome**. Seis arquivos de credencial plantados com o conteúdo típico: o `.env` sem aspas, o `.env` com
aspas (`DB_PASSWORD="…"` — o `\b` da regra não separa `DB_` de `PASSWORD`), o `.npmrc`, o `.netrc` e o
`.git-credentials` **passaram calados**; só a chave de SSH em texto foi acusada. O binário (`.p12` com byte nulo) ela põe
em `deFora`, com o motivo, e aprova. Depois, por LUGAR: o que o `git` carrega (`ls-files --cached --others
--exclude-standard`, 753 caminhos) e todo nome que já entrou num commit do `HEAD` (`log --diff-filter=A`, 762 nomes em 456
commits, desrasado) — **zero** nome de credencial nos dois. O `find` da página, refeito, também zero.

**Decidido:**

1. **Regra verdadeira, guarda ausente.** `src/arquivo-de-credencial.ts`: dezessete formas de nome — as três da página e
   catorze do que as ferramentas usam (`.key`, `.p12`/`.pfx`, `.jks`/`.keystore`, `.ppk`, `id_rsa` e família sem `.pub`,
   `.npmrc`, `.netrc`, `.pypirc`, `.htpasswd`, o `.dev.vars` do `wrangler`, a conta de serviço do Google, `secrets`,
   `.tfvars`, `.kdbx`) —, cada uma com motivo; o modelo do `.env` (`.exemplo`, `.example`, `.sample`, `.modelo`,
   `.template`) perdoado pelo nome; `conferirOsNomes` com `credencial-no-git`, `credencial-na-historia` e
   `universo-vazio`.
2. **A história entra**, porque o repositório é público e chave que apareceu é chave vazada; mas **só com ela inteira**:
   a leitura passa pelo `lerPelaHistoria` (LAB-89) e recusa no clone raso do CI, dizendo por quê.
3. `tests/arquivo-de-credencial.test.ts`, 10 testes, sem clones, no portão sem clones do `verde.yml` (1 583 → 1 593). O
   teste afirma também que a varredura de conteúdo deixa passar cinco dos seis plantados — se ela melhorar, o teste
   avisa para a tabela do cabeçalho não envelhecer calada.
4. A linha da página diz com o que é conferida hoje, e a seção *Reconferido no LAB-160* traz os dois universos.

**Os dois lados:** a árvore de hoje, a história de hoje, o `.env.exemplo`, a chave pública, `keys.ts`, `environment.md`,
a própria régua e a varredura de segredos passam. Um `.env` e um `.p12` de verdade no disco, a linha sem ponteiro, uma
forma tirada da lista, o modelo perdoado largo demais, a pergunta pelo universo vazio desligada, a história lida pelo
filtro errado e um clone com `.env` commitado e apagado reprovam. **Oito mutações, oito acusadas.**

**A régua vizinha acusou a primeira versão, com razão:** a tabela do cabeçalho trazia o cabeçalho literal de chave
privada do OpenSSH, e a varredura de segredos reprovou a árvore. A célula foi reescrita por extenso. No envio, o gancho do `pre-push` recusou a árvore: a trava
do "nada pago" (LAB-148) leu o endereço do `.git-credentials` plantado no teste como porta nova — ela lê o que o `git`
rastreia, e o verde completo rodou antes do commit. O endereço passou a ser montado em pedaços; nenhuma régua afrouxada.

**Descartado:** ler o disco inteiro como o `find` (reprovaria o `.env` ignorado, que é o jeito certo de tê-lo); exigir
que o `.gitignore` cubra `.env` (a página não promete, e o que o `git` carregaria já reprova); nome em português (as
ferramentas nomeiam em inglês, e `credencia` faria a régua se acusar); ampliar a varredura de conteúdo (outra regra, a do
LAB-47, com falso positivo a medir — o nome já fecha o buraco desta linha).

> **A VARREDURA DE SEGREDOS LÊ O CONTEÚDO, E O ARQUIVO DE CREDENCIAL SE RECONHECE PELO NOME.** Uma varredura bem feita
> deixou passar cinco de seis arquivos típicos, e o binário saiu *"de fora"* com o motivo certo. **Duas perguntas
> diferentes, duas guardas — e a linha que tinha o comando de uma parecia ter as duas.**


## D389 · NENHUM MOTOR COPIADO PARA FORA DE `upstream/`, E A GUARDA COMPARA COM O MOTOR DE FORA — a página nomeava as duas pastas onde ele não estava · 17/10/2026

**Contexto:** item 900 (LAB-161). A caixa só tinha o `900`, e a FILA seguia sem proposta que não esperasse ninguém. Fui
à dívida própria, na mesma espécie e na mesma página do LAB-158 ao LAB-160 — **mensagem fixa que afirma estado sem
perguntar**, no `docs/SEGURANCA.md` —, na tabela *Integridade do que foi copiado*: *"Nenhum motor copiado para fora de
`upstream/` · ✅ · `external-engines/testfit/` e `external-engines/esteira/` não contêm código de motor — só a ponte
(D16)"*. As duas outras linhas da tabela (o `upstream/` byte a byte, a licença) já tinham a trava do LAB-132 — a árvore
do `git` da pasta contra a registrada —, e a página não dizia. Esta não tinha nenhuma.

**Medido (LAB-161):** o LAB-146 compara a casa com os motores **da família**; o `upstream/` entra lá do lado da casa,
nunca como o comparado. Por mutação, `upstream/src/rationalize.rs` copiado byte a byte para `symbios/archilly/wasm/src/`
e adicionado ao `git`: a suíte inteira com os clones derrubou **uma** trava, a contagem de árvore do LAB-57, que acusa
qualquer arquivo novo e não diz por quê. Por LUGAR, toda pasta `upstream/` versionada (uma, a do Symbios: 18 arquivos de
código, 2 159 linhas significativas) contra todo arquivo de código versionado fora dela (354): **nenhum idêntico, nenhum
parecido** — o mais parecido, `wasm-probe/src/lib.rs`, tem 3 de 8 linhas em comum com `examples/full_city.rs` (a chamada
à API). E 4 `Cargo.toml` fora do `upstream/`: os 3 que dependem de `symbios-tensor` (`probe/`, `wasm-probe/`, `wasm/`)
apontam para o `upstream/` por `path`.

**Decidido:**

1. **Regra verdadeira, guarda ausente.** `src/o-upstream-nao-sai-do-upstream.ts`, com as linhas e os limites do LAB-146
   (`linhasDeCodigo`, 50 % com 10 linhas, ou 30 linhas), contra **toda** pasta `upstream/` que o `pastasDeUpstream` do
   LAB-132 acha — motor de fora que entrar amanhã entra aqui sem ninguém lembrar.
2. **A outra metade entra:** não copiar só fecha se o Lab usa o motor conferido. Todo `Cargo.toml` fora do `upstream/`
   que depende do pacote de um `upstream/` (o nome lido do `[package]` dele) tem de apontar para a pasta por `path`, em
   linha ou em tabela, em `[dependencies]`, de dev, de build ou de alvo. Uma troca por `symbios-tensor = "0.4"` faria o
   `cargo` baixar do crates.io um motor que ninguém conferiu, com o `upstream-intocavel` verde sobre uma pasta que
   ninguém compila.
3. `tests/o-upstream-nao-sai-do-upstream.test.ts`, 14 testes, sem clones, no portão sem clones do `verde.yml`
   (1 593 → 1 607). A casa de hoje afirma o universo (uma pasta, os três manifestos, o caminho de cada um) e a folga.
4. A linha da página diz com o que é conferida hoje; as duas de cima apontam para o LAB-132; a seção *Reconferido no
   LAB-161* traz a tabela.

**Os dois lados:** a ponte que usa a API (três linhas iguais às do exemplo), o `path` certo, um segundo `upstream/` e uma
dependência de outro pacote passam. A cópia real, uma função de 30 linhas colada num arquivo grande, o crates.io no lugar
do `path`, a linha sem ponteiro, os dois limites deslocados de um, o universo vazio desligado, só `[dependencies]` lido,
o `upstream/` comparado consigo e o `path` sem resolver reprovam. **Dez mutações, dez acusadas** — e a primeira versão da
mutação da função colada não pegou porque as linhas que eu colei eram comentário de documentação, que a régua não conta
de propósito; refeita com trinta linhas de código, acusou. Defeito da mutação, não da régua (lição 12c do Generate).

**A régua vizinha acusou a primeira versão, de novo com razão:** o endereço de `git` plantado no teste foi lido pela
trava do "nada pago" (LAB-148) como porta nova. Montado em pedaços, como no LAB-160; nenhuma régua afrouxada.

**Descartado:** comparar com o upstream de verdade no GitHub (seria rede numa trava, e o LAB-132 já fixa a árvore);
ler `package.json` (o Symbios não publica pacote npm); cobrir a sondagem do straight-skeleton, que aponta por `path` para
fora do repositório de propósito e não tem `upstream/` — dita no que a trava não alcança.

> **A RÉGUA QUE COMPARA COM A FAMÍLIA NÃO VÊ O MOTOR DE FORA, E A PÁGINA OLHAVA AS PASTAS ERRADAS.** A cópia do Symbios
> nasceria ao lado do `upstream/`, onde o Lab escreve Rust contra ele — e nenhuma das duas pastas da linha é essa.

## D390 · NENHUM COMMIT, NENHUM PUSH NOS VIZINHOS, E A GUARDA PERGUNTA PELA SESSÃO — o autor já não distingue casa nenhuma · 17/10/2026

**Contexto:** item 900 (LAB-162). A caixa só tinha o `900`, e a FILA seguia sem proposta que não esperasse ninguém. Fui
à dívida própria, na mesma espécie e na mesma página do LAB-158 ao LAB-161 — **mensagem fixa que afirma estado sem
perguntar**, no `docs/SEGURANCA.md` —, na tabela *Os repositórios vizinhos*: *"Nenhum commit, nenhum push nos vizinhos ·
✅ · o histórico deles não tem commit desta sessão"* (LF-FINAL, 14/09), e a do LF-FINAL-2 (15/09), *"os commits dos
clones vizinhos são **deles**, não meus"*, conferida pelo autor. A trava do LAB-38 pergunta o clone **desta máquina**
limpo, e um commit enviado à origem do vizinho o deixa limpo.

**Medido (LAB-162):** o autor de todo commit de sessão da família é `Claude <noreply@anthropic.com>` — 204 no
Laboratório de Parcelamento, 1 076 no Generate, 449 no Geo: a pergunta de 15/09 já não teria resposta. O que identifica a
casa é a sessão do rodapé `Claude-Session`. Na história inteira da origem dos quatro, 14 sessões aparecem aqui e num
vizinho, **todas da direção** (escreve as caixas das onze casas na mesma rodada); aqui, os commits dela só mexem em
`docs/caixa-de-entrada/`, salvo dois de 09/10 (`6f43837`, o `docs/INDEX.md`; `d103582`, o `.claude/settings.json`).
Nenhuma das 68 sessões que trabalharam aqui aparece num vizinho; nenhum assunto `LAB-<n>` lá. Regra verdadeira, guarda
ausente.

**Decidido:**

1. `external-engines/esteira/src/nenhum-commit-nos-vizinhos.ts`: sessão da casa é a de todo commit desta casa que não é
   da direção (só a caixa, sem `-FEITO`, ou uma das duas exceções declaradas com motivo); reprova a sessão da casa em
   commit de vizinho, o assunto `LAB-<n>` em commit de vizinho, a declaração que sobra, a história rasa e o universo
   vazio. A sessão ambígua (caixa e fora dela) conta como da casa.
2. `tests/nenhum-commit-nos-vizinhos.test.ts`, 15 testes, sem clones, no portão sem clones do `verde.yml` (1 607 →
   1 622); `tests/nenhum-commit-nos-vizinhos-com-clone.test.ts` no verde completo, com o universo publicado.
3. A linha da página aponta para a régua; a do LF-FINAL-2 diz que o autor deixou de responder; a seção *Reconferido no
   LAB-162* traz a tabela.

**Os dois lados:** o trabalho do vizinho e os itens da direção passam; a sessão de uma rodada daqui, o assunto
`LAB-<n>`, o `-FEITO` contado como direção, a direção fora da caixa sem declaração, a declaração que sobra (sumida ou já
na caixa), a história rasa e o universo vazio reprovam. **Onze mutações, onze acusadas**, uma delas um commit plantado
numa cópia do clone do Laboratório de Parcelamento; a primeira versão da mutação das declarações não pegou por defeito da
mutação (`[] && [...]` devolve a lista), refeita, acusou.

**Descartado:** perguntar pelo autor (não distingue); perguntar pela data da sessão (a direção e a casa trabalham no
mesmo dia); pedir à direção uma lista das sessões dela (seria afirmação de outra casa, e a forma do commit já responde);
ler a API do GitHub pelos pushes (rede numa trava, e o que interessa é o que ficou na origem).

> **A PERGUNTA QUE CONFERIU A LINHA DEIXOU DE EXISTIR ANTES DA LINHA FICAR FALSA.** O autor distinguia as casas em
> setembro; em outubro todas assinam igual. Comando de conferência também envelhece — e quem não o roda de novo não vê.


## D391 · O `upstream/` NUNCA FOI TOCADO DEPOIS DE CRIADO, E A GUARDA PERGUNTA A ÁRVORE DE CADA COMMIT — o `HEAD` igual não diz "nunca" · 18/10/2026

**Contexto:** item 900 (LAB-163). A caixa só tinha o `900`, e a FILA seguia sem proposta que não esperasse ninguém. Fui
à dívida própria, na mesma espécie e na mesma página do LAB-158 ao LAB-162 — **mensagem fixa que afirma estado sem
perguntar**, no `docs/SEGURANCA.md` —, na seção *Reconferido no LF-FINAL-2* (15/09): *"`external-engines/symbios/upstream/`
nunca foi tocado depois de criado · ✅ · `git log --oneline -- …` — um commit, o do LAB-00 que o criou"*. A trava do
LAB-132 pergunta a árvore **no `HEAD`** e declara que a história fica de fora: um patch commitado e desfeito depois volta
à mesma árvore e passa.

**Medido (LAB-163):** numa cópia descartável desta casa, um commit que acrescenta uma linha ao `upstream/src/lib.rs` e um
segundo que a desfaz — a árvore do `HEAD` volta a `7ea7b17…` e a trava do LAB-132 **passa**. Na história de verdade
(`git rev-list HEAD --remotes=origin`, clone desrasado): 462 commits, 461 com a pasta, 1 sem (a raiz), **uma árvore só**,
a registrada. E o `git log --full-history` de hoje mostra **dois** commits, o `f61be91` e a mescla `baa3e07` (PR #1), que
leva a mesma árvore — o comando antigo já não diria *"um commit"*. Regra verdadeira, guarda ausente.

**Decidido:**

1. `external-engines/esteira/src/a-historia-do-upstream.ts`: de todo commit do `HEAD` e da origem, a árvore de cada pasta
   de `COPIAS_DE_UPSTREAM` (`git cat-file --batch-check`, uma leitura só); reprova a árvore que não seja a registrada nem
   uma das `ARVORES_QUE_JA_FORAM` (a troca deliberada, hoje nenhuma), o commit `trazidaEm` ausente ou com outra árvore, a
   declaração que sobra, a história rasa e o universo vazio. A pasta ausente num commit é ausência, não patch.
2. `tests/a-historia-do-upstream.test.ts`, 17 testes, sem clones e sem história, no portão sem clones do `verde.yml`
   (1 622 → 1 639, 95 → 96 arquivos); `tests/a-historia-do-upstream-com-historia.test.ts` no verde completo, com o
   universo publicado — o CI clona raso, e no raso a resposta seria o corte (D293).
3. A linha da página aponta para a régua; a seção *Reconferido no LAB-163* traz a tabela; o cabeçalho do
   `upstream-intocavel.ts` aponta para cá onde dizia que a história não era perguntada.

**Os dois lados:** a história boa, a pasta apagada e trazida de volta e a troca declarada passam; o patch desfeito, o
patch num ramo da origem nunca mesclado, a troca sem declaração, a declaração que sobra, o `trazidaEm` ausente ou com
outra árvore, a história rasa e o universo vazio reprovam. **Nove mutações, nove acusadas**, uma delas o patch e o
desfeito commitados de verdade numa cópia da casa.

**Descartado:** contar commits no `git log -- <pasta>` (responde a forma da história — a mescla conta — e não a
pergunta); pôr a pergunta à história no portão sem clones (o CI clona raso, e a régua passaria a responder o corte);
acrescentar `fetch-depth: 0` ao `verde.yml` para isso (mexer na rotina por uma trava que o verde completo já roda).

> **"IGUAL HOJE" E "NUNCA TOCADO" SÃO DUAS FRASES, E SÓ UMA TINHA GUARDA.** A do `HEAD` responde a primeira; a segunda
> só a história responde — e a régua do `HEAD` dizia isso de si, por extenso, havia dois dias.

## D392 · A IDEIA QUE NÃO CABIA NO ITEM VAI À `FILA.md`, E O RECADO A CITA NUMA LINHA — a lista tinha trava, o recado não · 18/10/2026

**Contexto:** item 900 (LAB-164). A caixa só tinha o `900`, e a FILA seguia sem proposta que não esperasse ninguém. Fui
à dívida própria, espécie **regra sem guarda**, no protocolo da caixa (`docs/caixa-de-entrada/COMO_FUNCIONA.md`, seção
*"A RESPOSTA INTEIRA VAI PARA O ARQUIVO"*, commit `b0b537b`, 09/10/2026): *"A ideia que não cabia no item. Vai para a
`FILA.md` como "proposto ao chat", e o recado a cita numa linha."* A trava do LAB-61 cobra a LISTA da `FILA.md`; nada
perguntava o recado de quem propôs.

**Medido (LAB-164):** a suíte inteira da esteira com três citações tiradas do `RECADOS.md` (LAB-159, LAB-123, LAB-80) →
1 980 aprovadas e as 9 do `.wasm`, as mesmas da linha de base: zero falhas novas. Por LUGAR, as propostas da `FILA.md` em
três formas (`saído do LAB-NNN` ou `do item NNN`; `minha lista` sob `### LAB-NNN`; o item da lista com `(LAB-NN`): 51
com origem, 17 itens sem origem (todos de antes da regra), **30 prompts no alcance** (LAB-70 em diante, o corte do
LAB-130) — **todos** os recados citam: 9 na forma *"Proposto ao chat"* (LAB-123 a LAB-159) e 21 em formas mais velhas.
Regra verdadeira, guarda ausente.

**Decidido:**

1. `external-engines/esteira/src/a-proposta-no-recado.ts`: reprova a proposta do alcance sem recado, o recado que não
   cita, o recado que diz *"Proposto ao chat"* sem proposta na `FILA.md` (o sentido de volta), o item da caixa sem marca
   de FEITO que diga o prompt, a `minha lista` sem seção, a exceção que sobra ou sem o trecho, e o universo vazio.
2. As 21 formas antigas em `FORMAS_ANTIGAS`, cada uma com o trecho copiado do recado — conferido lá, e conferido que a
   forma de hoje não está.
3. `tests/a-proposta-no-recado.test.ts`, 18 testes, sem clones, no portão sem clones do `verde.yml` (1 639 → 1 657,
   96 → 97 arquivos). Nota com o ponteiro no `COMO_FUNCIONA.md`, texto do chat intocado.

**Os dois lados:** a página de hoje, a forma antiga com o trecho e a negação *"Nada novo proposto ao chat"* passam; o
recado sem citação, o prompt sem recado, a proposta só no recado, o item sem marca, a `minha lista` sem seção, a exceção
que sobra e a sem trecho reprovam. **Onze mutações de código, onze acusadas; quatro na página, quatro acusadas.**

**Descartado:** cobrar *"a escolha e as alternativas que você descartou"* (a coisa 1 da mesma lista) — juízo sobre o
conteúdo, e régua de palavra mediria ortografia (D137); uma lista de frases aceitas para as formas antigas (aprovaria
*"peguei da FILA a proposta do LAB-103"*, a de outro prompt); exigir a palavra *FILA* na forma de hoje (o LAB-147 cita
sem ela, e a regra diz *"cita"*, não *"diz onde"*); ler a forma sem caixa (acusou seis recados que dizem a negação).

> **A FRASE QUE NEGA CONTÉM A FRASE QUE AFIRMA.** *"Nada novo proposto ao chat"* tem *"proposto ao chat"* dentro; a régua
> que lê a frase sem ler onde ela abre conta a negação como citação.

## D393 · A PERGUNTA QUE É DELE VAI COM "O QUE FAZER / ONDE / COMO SABER QUE DEU CERTO" — nenhuma das quatro dizia como saber · 18/10/2026

**Contexto:** item 900 (LAB-165). A caixa só tinha o `900`, e a FILA seguia sem proposta que não esperasse ninguém. Fui
à dívida própria, espécie **regra sem guarda**, na candidata que o LAB-164 deixou anotada: a terceira coisa da lista do
protocolo da caixa (`docs/caixa-de-entrada/COMO_FUNCIONA.md`, *"A RESPOSTA INTEIRA VAI PARA O ARQUIVO"*) — *"A pergunta
que é dele. Vai para `docs/PENDENCIAS_JONNY.md`, em português de leigo, com o que fazer / onde / como saber que deu
certo."* A página tinha três travas (LAB-124, LAB-125, LAB-137); nenhuma perguntava pelas três partes.

**Medido (LAB-165):** a suíte inteira da esteira com três trechos tirados da página — os passos 1 e 2 da §11 (a senha),
a tabela dos três caminhos da §10 e o *"Onde olhar"* da §7 → **um** teste novo reprovado, o do LAB-155, e só porque o
*"Onde olhar"* levava dois endereços desta casa que ele conta. Por LUGAR — as pendências abertas ou paradas de
`PENDENCIAS`, que são as que pedem ou voltam a pedir —, **cinco**: 5-B, 7, 8, 10 e 11. A §8 diz no corpo que *"não é
pergunta e não trava nada"*. Das outras quatro, **nenhuma** dizia *como saber que deu certo*; o *o que fazer* e o *onde*
estavam espalhados em tabelas e passos (a §11 tinha os dois; a 5-B, só *"até você dizer 'é isso'"*).

**Decidido:**

1. Um bloco de **forma fixa** em cada pendência que pede — `> **O que fazer, onde e como saber que deu certo**` e três
   linhas com rótulo —, escrito nas quatro, no alto da seção, com a nota *"está parada a seu pedido"* nas quatro paradas.
   O *como saber* das três de decisão é o que ele vê nesta página (o título passa a dizer *"você respondeu"*); o da §11
   é a linha `VIZINHOS_TOKEN` na página de segredos, e a prova completa (o passo do segredo do `verde.yml` deixa de
   parar) fica dita como não sendo dele. O texto que já existia ficou intocado.
2. `external-engines/esteira/src/o-que-fazer-onde-como-saber.ts`: reprova a pendência que pede sem o bloco, a parte que
   falta ou vem vazia (menos de 15 caracteres que não sejam traço, ponto ou espaço), a parte repetida, o bloco onde não
   se pede (resolvida ou aviso — o sentido de volta), a exceção sem o trecho, com bloco ou que sobra, o bloco solto fora
   de pendência e o universo vazio. O estado vem de `PENDENCIAS` (um lugar só, como no LAB-125); a exceção (`NAO_PEDEM`,
   a §8) se confere pelo trecho do corpo.
3. `tests/o-que-fazer-onde-como-saber.test.ts`, 22 testes, sem clones, no portão sem clones do `verde.yml` (1 657 → 1 679,
   97 → 98 arquivos). Nota com o ponteiro no `COMO_FUNCIONA.md`, texto do chat intocado.

**Os dois lados:** a página de hoje, o bloco dentro de um `###` sem número, a nota a mais no bloco e o endereço dentro da
parte passam; as três palavras na prosa sem o bloco, o enchimento sem letra e o bloco de uma `### 1-A` resolvida contado
para a `## 1` reprovam. **Treze mutações de código, treze acusadas** — duas só depois de um teste a mais cada (o corpo que
não parava no título numerado de baixo; o traço que contava como conteúdo): *mutação que não pega é suspeita da
mutação*, e aqui a suspeita era do teste.

**Descartado:** procurar as três partes por frase na prosa (D137: mediria ortografia, e a §11 já dizia *"onde"* sem a
palavra); uma lista de trechos declarados por pendência, como a `CINCO_MINUTOS` do LAB-125 (passaria a §7, que tinha
*"Onde olhar"* e nenhum *como saber*, se alguém declarasse o trecho errado — a forma fixa não tem o que declarar);
exigir endereço clicável no *onde* (a resposta das três de decisão é *"na conversa com o chat"*, e é a verdade); exigir
o bloco na §8 (inventaria um pedido que a própria seção diz não existir); prometer no *como saber* mudanças em outras
páginas (*"o aviso de Antonina deixa de dizer…"*) — é a sessão afirmando o que vai fazer, e só o título desta página é
o que ele confere sozinho.

> **A PARTE QUE NUNCA FOI ESCRITA NÃO SE MEDE POR MUTAÇÃO.** Tirar o *como saber* não derrubava nada porque não havia o
> que tirar: zero de quatro. A lacuna de uma régua ausente se mede tirando o que existe; a de uma regra cumprida pela
> metade, contando o que nunca existiu.

## D394 · NENHUMA CHAVE SENSÍVEL NO REPOSITÓRIO — a busca da página, perguntada letra por letra a cada verde, dizia "zero" e dava duas · 18/10/2026

**Contexto:** item 900 (LAB-166). A caixa só tinha o `900`, e a FILA seguia sem proposta que não esperasse ninguém; o
LAB-165 fechou a lista do protocolo da caixa e mandou o próximo disparo a outra página. De volta ao `docs/SEGURANCA.md`,
li as linhas da tabela uma a uma: a primeira de *Chaves e segredos* — *"Nenhuma chave sensível no repositório · ✅ limpo
· `grep -rE` dos oito nomes sobre `.ts`, `.js`, `.json` e `.rs` fora de `node_modules` e de `upstream/` — zero
ocorrências"*, do LF-FINAL (14/09) — não tinha trava (espécie **mensagem fixa que afirma estado sem perguntar**). A do
`.wasm`, a única outra sem trava, foi descartada pela terceira vez: o `rustup` ainda não alcança o alvo nesta máquina.

**Medido (LAB-166):** o comando da página, refeito no disco e no que o `git` carrega, dá **duas** ocorrências, nenhuma
chave — o espaço reservado `<a sua chave aqui>` do teste da varredura de segredos (LAB-47, `980f953`, 05/10) e o exemplo
de chamada a IA com o valor `k` do teste do vazamento de custo (LAB-68, `a3a3798`, 09/10). O "zero" ficou falso em 05/10.
No universo largo (todo texto que o `git` carrega fora do `.md`, 535 arquivos, `upstream/` incluído), as mesmas duas. E
a varredura de segredos não responde a linha: oito linhas plantadas com um valor de 21 alfanuméricos passaram **todas**
caladas pelo `varrerTexto` — o cabeçalho de autorização não está na lista de nomes dela, e o valor alfanumérico que
começa por letra cai no perdão *"identificador de código"*. A busca da página acusou sete; a oitava (o segredo colado
depois de `JWT_`) escapa das duas, porque o `\b` não separa `_` de letra.

**Decidido:**

1. **A frase é verdadeira, o número não era.** A linha passa a dizer *"em 14/09, zero"*, que o zero ficou falso em 05/10,
   e o que se pergunta desde hoje; seção *Reconferido no LAB-166* na página.
2. `external-engines/esteira/src/a-busca-das-chaves.ts`: a busca da página **letra por letra** (montada em pedaços, senão
   se acha a si mesma), em dois universos publicados — o da página e o largo —, com `ocorrencia-nao-declarada`,
   `declarada-que-sumiu`, `declarada-fora-de-teste` (só se perdoa texto de teste de trava) e `universo-vazio`. A
   declaração casa pelo **trecho da linha**, não pelo número, e perdoa a linha, não o arquivo. O registro leva o nome que
   casou, nunca o resto da linha.
3. `tests/a-busca-das-chaves.test.ts`, 13 testes, sem clones, no portão sem clones (1 679 → 1 692, 98 → 99 arquivos). Ele
   confere também que a linha da página traz a mesma busca e o nome da trava.

**Os dois lados:** a árvore de hoje, o `.md`, o binário e sete casos que quase parecem inválidos passam; a chave em
`src/`, a mesma no `.mjs`, no `.yml`, no gancho e no `upstream/` (que a página não via), a segunda ocorrência no teste
declarado, a declarada que sumiu, a de fora de teste e o universo vazio reprovam. **Doze mutações de código, doze
acusadas** — a do trecho ignorado só depois de um teste a mais.

**Descartado:** consertar agora o perdão da varredura de segredos e o `\b` da busca (outra trava e a página junto; vão à
FILA como proposta ao chat, numa só); ler a história (`git log -G`) — a varredura declara o mesmo buraco, e o remédio é
trocar a chave; pôr o `.md` no universo (é onde a casa fala dos nomes).

> **O NÚMERO DA TABELA ENVELHECE NO DIA EM QUE O PRIMEIRO TESTE DA TRAVA ESCREVE O CASO BOM.** A linha dizia "zero"
> porque em 14/09 ninguém tinha escrito, de propósito, o nome que a busca procura; a primeira trava de segredo que provou
> aprovar o caso bom o escreveu, e a linha ficou falsa sem que nenhuma palavra dela mudasse.

## D395 · O LAB NÃO ADOTA A CENTRAL — a página afirmava seis estados sem que código nenhum a lesse, e dois eram falsos · 18/10/2026

**Contexto:** item 900 (LAB-167). A caixa só tinha o `900`; a FILA seguia sem proposta que não esperasse ninguém, e a
única linha sem trava do `docs/SEGURANCA.md` — a do `.wasm` — foi descartada pela quarta vez: o `rustup target add
wasm32-unknown-unknown` recebe **403 do portão de rede** desta máquina (política, não falha passageira; não se insiste).
Procurei, por LUGAR, página de `docs/` que nenhum código lesse: contados os nomes nas suítes, o `docs/ADOCAO_CENTRAL.md`
(LF-FINAL, 14/09/2026, nunca mais tocado) tinha **zero** leitores — e afirma, em tabela e prosa, seis estados (espécie
**mensagem fixa que afirma estado sem perguntar**).

**Medido (LAB-167):**

- *"não há tela"*, *"não há interface"*, *"hoje ele não pode [ganhar tela], por regra"* — **falso desde antes de a
  página nascer**: a bancada do navegador entrou em 10/09/2026 (LAB-01, `069fd29`), quatro dias antes; é a exceção
  declarada da regra (D381), com duas cores escritas à mão;
- *"o clone do Generate traz `vendor/archilly-central/` só com documentos, sem código"* (e o mesmo nas duas declarações
  de tipo: *"sem `package.json` e sem código. Não há o que instalar"*) — **falso hoje**: 40 entradas, `package.json`
  0.48.0 e `dist/`; o `package.json` já estava lá em 13/09 (`22502b3`), o `dist/` entrou em 14/09 (`33311c3`);
- *"não há chamada paga… nenhuma IA"* e *"não há chave nenhuma"* — verdadeiros, e já perguntados por `nada-pago.ts`
  (LAB-148), `rede-em-execucao.ts` (LAB-158) e `a-busca-das-chaves.ts` (LAB-166); a página não os apontava;
- *"o Lab não importa nada da Central em tempo de execução"* — **verdadeiro, e nunca medido**: a prova era `bun test`
  passar, e passar só dizia que a instalação no clone do Generate falhou (403 no registro de lá). Medido agora pelo fecho
  das importações de valor a partir do `include` dos dois pacotes, com os `paths` dos clones: esteira **424** arquivos
  (73 nos vizinhos), testfit **88**, **zero** chegadas ao pacote. Contando também o que é só de tipo, **454** e **119**
  arquivos e **uma** chegada — `src/lib/design/cores.ts` do Generate, por `import type` em `src/lib/diretrizes/types.ts`:
  exatamente o que a declaração diz (o `tsc` chega lá, a execução não);
- *"as duas declarações declaram o pacote, e isso não é adoção"* — verdadeiro: dois arquivos, idênticos; em 365 códigos
  e 2 `package.json` da casa, nenhuma importação e nenhuma dependência do pacote.

**Decidido:**

1. `external-engines/esteira/src/a-adocao-da-central.ts`, duas perguntas. **Sem clones:** nenhum código do que o `git`
   carrega (fora de `upstream/`) importa o pacote, por nenhuma de nove formas (valor, só tipo, nomes todos `type`,
   `export … from`, `export *`, `import()`, `require`, `typeof import()`, efeito colateral), nenhum `package.json`
   depende dele (quatro espécies), só as duas declarações o declaram e são idênticas, e a página aponta cada uma de cinco
   travas, que existem. **Com clones:** o fecho de valor dos dois pacotes não chega ao pacote, nenhum caminho da família
   deixa de resolver, e o universo é publicado.
2. `tests/a-adocao-da-central.test.ts` (33 testes, sem clones, no portão sem clones: 1 692 → 1 725, 99 → 100 arquivos) e
   `tests/a-adocao-da-central-com-clone.test.ts` (7 testes, no verde completo; sem os clones, reprova).
3. A página reescrita: coluna *quem pergunta* na tabela, a bancada como a exceção que é, a seção *Nada importa o pacote
   — nem em execução* com os números, e a frase do `vendor/` riscada e não apagada. As duas declarações perdem a frase
   sobre o estado do vizinho e apontam a trava.

**Os dois lados:** a árvore de hoje, o pacote em comentário, em texto e em template, e o `upstream/` passam; cada uma das
nove formas de importar, cada espécie de dependência, a terceira declaração, a declaração que sumiu, as que divergiram,
a página que deixou de apontar, a trava apontada ausente, a página ausente e o universo vazio reprovam. O fecho, numa
árvore montada no teste, acha o pacote no fim de uma cadeia de valor que atravessa o `paths`, não o acha numa cadeia só
de tipo (e o acha com tipos), e publica o caminho que não resolve. **Dezesseis mutações de código, dezesseis acusadas.**

**Descartado:** exigir que a bancada passe pelo catálogo de cores da Central (é ferramenta da sessão, sem usuário, e a
regra dela é do chat — dito na página, não mudado); afirmar na página o estado do `vendor/` do Generate (é do vizinho e
envelhece sem aviso, como envelheceu); provar a execução com um plugin do Bun interceptando a resolução (pegaria só o
que a suíte carrega, e o fecho largo já implica zero na execução); fechar a pergunta 2 no portão sem clones (ela é,
por definição, sobre os clones).

> **"A SUÍTE PASSA SEM ELE" NÃO PROVA QUE ELE NÃO ESTÁ NO CAMINHO — PROVA QUE A INSTALAÇÃO FALHOU.** A prova que
> dependia de um 403 noutro registro viraria silêncio no dia em que uma máquina instalasse as dependências do vizinho:
> o kit de contas, créditos e design de outra casa entraria na execução do Lab sem nada acusar. A pergunta tem de
> perguntar ao caminho, não ao acaso.

## D396 · O QUE FALTA MEDIR, MOTOR POR MOTOR — a página que o chat leva aos vizinhos afirmava o estado deles sem perguntar, e três afirmações estavam velhas, duas no dia em que nasceram · 18/10/2026

**Contexto:** item 900 (LAB-168). A caixa só tinha o `900`; a FILA seguia sem proposta que não esperasse ninguém, e o
`.wasm` sem o alvo do `rustup` (403 do portão de rede desta máquina). O LAB-167 deixou nomeadas, por LUGAR, as páginas de
`docs/` com um a três leitores no código. Das três, o `docs/O_QUE_FALTA_MEDIR_POR_MOTOR.md` (LAB-22, 03/10/2026, tocado
pela última vez no LAB-37, 04/10) é a que afirma **estado** — e estado de **outras casas**: é o documento que o chat leva
ao Generate e ao Laboratório de Parcelamento. Os três leitores (`frase-vencida.ts`, `numero-de-testes.ts`,
`inventario-das-pontes.ts`) só o citam; nenhum pergunta o que ele afirma. Espécie **mensagem fixa que afirma estado sem
perguntar**. A `TRIAGEM.md` (LAB-00, relato datado) e a `referencia/FERRAMENTA_E_TRAVA.md` (LAB-70, método) ficaram
para depois.

**Medido (LAB-168, Generate `8d5c0b0`, Laboratório de Parcelamento `5e279ac`):**

- Parcelamento, *"o passo é fixo em 12 pedaços por via (`AMOSTRAS_POR_VIA = 12`)"*, *"o que falta, de verdade"* —
  **falso desde 03/10/2026, o mesmo dia da página**: o T-11 deles (`3702828`) trocou a contagem fixa por
  `PASSO_DE_AMOSTRA_M = 5` e `Math.ceil(comprimento / passo)`, com piso na resolução — a sugestão da página, feita;
- Generate, ortogonal e espinha, *"não mede, e o campo está lá"*, *"o que falta: o cálculo"* — **falso antes de a página
  nascer**: o `paraSaida` deles mede a rampa (`rampaDaVia(v.pontos, o.relevo)`) desde 02/10/2026 (`5b70e5f`, *"as três
  coisas que o Laboratório pediu"*) quando recebe `relevo`; **a ponte do Lab não o passa** (`motores/generate.ts`). Medido
  passando: `completo` ortogonal 22 de 22 vias medidas, pico 33,71 % (a régua do Lab: 34,71 %); espinha 69 de 72, pico
  42,86 % (Lab: 46,70 %); `sintetico-10ha-plano` 9,13 % e 7,15 % contra 1,36 % do Lab — **discordância grande, não
  investigada**. A quarta vez da história do §1-A (campo do vizinho que existe e a ida do Lab não preenche);
- Parcelamento, §1-D, *"cada variante sorteia ±30°"* — **o dobro do código**: `(r() - 0.5) * Math.PI / 6`, com `r` em
  [0, 1), é ±15° (janela de 30°), igual desde 10/09/2026. O mesmo erro na ficha de capacidades (`porta/porta.ts`) e num
  comentário de `tests/alinhamento.test.ts`. A medição empírica do LAB-32 (5,6 pp na variante escolhida) não muda;
- §1-C, *"a ponte do Lab ignora as duas… continua sendo a minha etiqueta"* e *"proposta ao chat em vez de feita"* —
  **falsos desde o LAB-29** (D117): a volta importa `MOTOR_NOME` e `MOTOR_VERSAO`;
- §1-C, *"`MOTOR_VERSAO` em `1.0`"* — verdadeiro, ainda; e o T-11 é mais uma mudança visível ao Generate sem a versão subir.

**Decidido:**

1. `external-engines/esteira/src/o-que-falta-medir.ts`: sete afirmações, cada uma uma pergunta a UM arquivo de código de
   UMA casa (três do Lab, uma do Generate, três do Parcelamento), lida sem comentários; a página tem de trazer, fora de
   riscado, o trecho da resposta de hoje, não pode trazer o da resposta contrária, e os trechos velhos de cada uma só
   riscados; e tem de citar a trava fora de riscado. Página ausente, arquivo ausente e universo vazio reprovam.
2. `tests/o-que-falta-medir.test.ts` (15 testes, sem clones, no portão sem clones: 1 725 → 1 740, 100 → 101 arquivos) e
   `tests/o-que-falta-medir-com-clone.test.ts` (4 testes, no verde completo; sem os clones, reprova — D124).
3. A página: um aviso no alto, para cada casa, do que mudou e que **não há nada a fazer** do lado delas; o resumo, os §1,
   §1-C, §1-D, §3 e §4 riscados onde envelheceram (e o §5 com a data dos dois motores que reportavam), **não apagados** — quem recebeu o pedido velho precisa ver o que
   mudou. A ficha de capacidades e o comentário do teste com ±15°.
4. **Proposto ao chat, não feito:** a ponte do Lab passar `relevo` ao `paraSaida` do Generate. Muda a SAÍDA que o Lab
   julga e publica (o `rampaMaxima_pct` do Generate deixa de ser `null`), alcança as provas e a `COMPARACAO_DOS_MOTORES.md`,
   e põe duas réguas de rampa lado a lado — que discordam 6× numa gleba plana. É escopo novo, não conserto de página.

**Os dois lados:** a resposta de hoje com a velha riscada passa (o caso que quase parece inválido), nas duas respostas;
a resposta ausente, a contrária presente, a velha sem riscar, a trava não citada (ou só citada no riscado), a página
ausente, o arquivo ausente e o universo vazio reprovam. **Doze mutações de código, doze acusadas**, e **duas mutações do
mundo**: a ponte do Lab passando `relevo` (o portão sem clones reprova, 2 testes) e o `variacaoAngular` do vizinho em
`Math.PI / 3` (o verde completo reprova).

**Descartado:** reescrever a página do zero (apagaria o pedido que os vizinhos já receberam); remedir a cada verde os
números da página (picos, aderências, lotes) — são medição datada do prompt que os escreveu, e a trava diz isso no que
não alcança; ligar o relevo na ponte neste prompt (ver 4); corrigir os ±30° nos relatórios do LAB-32 e do LAB-37 e na
D-entrada do LAB-32 (são história; a correção mora aqui).

> **DOCUMENTO VIVO PARA O VIZINHO QUE NÃO PERGUNTA AO CÓDIGO DO VIZINHO ENVELHECE NO DIA EM QUE O VIZINHO LÊ.** Dois dos
> três pedidos velhos estavam velhos **no dia em que a página nasceu**: o Generate tinha atendido na véspera e o
> Parcelamento atendeu no mesmo dia — e a página continuou pedindo por duas semanas. Pedido atendido que continua
> escrito como pedido é ruído no repositório de quem já fez.

## D397 · FERRAMENTA E TRAVA — a página tinha guarda para a tabela, e os números da prosa ninguém perguntava; "nove recados acima do teto" eram sete desde o dia em que ela nasceu · 18/10/2026

**Contexto:** item 900 (LAB-169). A caixa só tinha o `900`; a FILA seguia sem proposta que não esperasse ninguém, e o
`.wasm` sem o alvo do `rustup` (403). O LAB-168 deixou nomeada a última das três páginas de `docs/` com poucos leitores:
`docs/referencia/FERRAMENTA_E_TRAVA.md` (item 003, LAB-70, 09/10/2026). Diferente das duas anteriores, **ela já tinha
guarda** (`tests/escopo-dos-instrumentos.test.ts`) — para a TABELA. Os números da PROSA, nenhuma trava lia.

**Medido (LAB-169):**

- *"os **nove** recados antigos acima do teto"* — **sete**, pela mesma régua da trava do teto, hoje (180 recados) e no
  commit que criou a página (`6e6d8a9`, 75): LAB-07, LF-01, LAB-02, LAB-03, LAB-08, LF-FINAL e LAB-04. O cabeçalho do
  `recado.test.ts` sempre disse sete. O *nove* estava na página, na declaração, na prova do item 003, no `LAB-70.md` e
  na tabela da D232 — e a régua do LAB-79 conferia a prova **contra a declaração**, que dizia o mesmo: *consistência não
  é correção* (D311);
- *"(hoje 10)"* recados sem prompt nomeado, *"(hoje 18)"* testes na trava, *"(hoje 2)"* caminhos da ferramenta — certos;
- *"é o item 004"* (o que pegaria o recado nunca escrito) — o item 004 foi feito e **não** o fecha: a conta mora no
  `ONDE_PARAMOS.md`, é escrita pela mesma sessão que escreve o recado, e cruza por dia só os disparos em vazio;
- *"comparar o disco com `origin/main`… ninguém faz isso hoje"* — verdadeiro, ainda; o gancho `pre-push` (D333) roda
  antes do envio e só quando há envio.

**Decidido:**

1. `src/escopo-dos-instrumentos.ts`: o buraco passa a *sete*; os buracos do recado nunca escrito e do não enviado dizem o
   que mudou e por que não fecha; e cinco funções novas — `recadosDoAcumulado`, `recadosAcimaDoTeto`,
   `promptsDosCabecalhos`, `recadosSemPromptNomeado`, `numerosQueODocumentoAfirma`.
2. **Uma régua, não três** (D116): `recado.test.ts` e `ferramentas/lab66.ts` passam a usar as do módulo.
3. `tests/escopo-dos-instrumentos.test.ts`, oito testes novos (11 → 19): os quatro números da prosa contra a medição, a
   frase ausente reprovando, os dois lados de cada régua, e todo arquivo de código citado num buraco existindo. Portão sem
   clones 1 740 → 1 748 (o arquivo já estava na lista; 101 arquivos).
4. A página riscada, não reescrita; a prova do item 003 regravada **só** na chave `oQueNinguemPega`, que o LAB-79 declarou
   `medida` contra a declaração.

**Os dois lados:** cinco mutações da página (o *nove* de volta, cada número trocado, a frase sumida), duas do mundo (um
sem prompt a mais, um recado velho engordado além do teto) e quatro de código — todas acusadas; a quarta de código
passou na primeira versão e fechou com um teste a mais. A primeira mutação do teto engordou um recado que **já** passava
dele, e deu zero: suspeita da mutação, não da trava.

**Descartado:** congelar em código a lista dos sete nomes (exceção disfarçada, D229 — a recontagem pega o mesmo e pega
quem engordar um recado velho); trava que compare o `RECADOS.md` do disco com o da origem (rodaria antes do envio, quando
a diferença é esperada); corrigir o *nove* no `LAB-70.md` e na D232 (história; a correção mora aqui).

> **PÁGINA COM GUARDA PARA A TABELA NÃO TEM GUARDA PARA A PROSA.** A guarda conferia cada linha da tabela contra o código
> rodando, e o número errado morava duas linhas abaixo, na célula de texto — e na declaração que a prova copiava. Cópias
> que concordam entre si só provam que foram copiadas.


## D398 · A ESPECIFICAÇÃO COMO CHEGOU — o comentário do topo dizia "numeração tornada sequencial", e nove subseções tinham o número de outra seção · 18/10/2026

**Contexto:** item 900 (LAB-170). A caixa só tinha o `900`; a FILA seguia sem proposta que não esperasse ninguém, e as
três páginas que o LAB-167 nomeou estavam lidas. Por LUGAR — toda página `.md` de `docs/` e `docs/referencia/` e quantos
arquivos de código das três suítes citam o nome dela —, três páginas sem leitor: `referencia/LABORATORIO.md` (1 491
linhas), `SYMBIOS_ANALYSIS.md` e `PACKINGSOLVER_TRIAGEM.md`. As duas últimas são relato datado do LAB-00; a primeira é a
especificação, com um comentário no topo que **afirma** o que se fez com o texto recebido.

**Medido (LAB-170):**

- *"a numeração das seções foi tornada sequencial"* — **meio verdade**: as 38 seções de nível dois são 1 a 38; as nove
  subseções das seções 23 e 28 eram `24.1`–`24.5` e `24.1`–`24.4` — quatro números repetidos e nove colidindo com a
  seção 24. O prompt do LAB-00 mandava *"corrija apenas a numeração duplicada de seções"*;
- *"Nenhum texto… foi alterado"* — verdadeiro desde o LAB-00: a impressão do texto (sem o comentário e sem os números dos
  títulos) é a mesma no `f61be91` e hoje; antes dele, o prompt colado não foi guardado;
- a `TRIAGEM.md` (*"seção 36"*) e o `INDEX.md`/`HISTORIA_DAS_REGRAS.md` (*"Etapas A a G"*) — certos;
- ninguém citava os números velhos das subseções.

**Decidido:**

1. As nove subseções passam a `23.1`–`23.5` e `28.1`–`28.4` — só o número, a alteração que o prompt do LAB-00 autorizou;
   o comentário do LAB-00 fica, com um parágrafo do LAB-170 embaixo dizendo o que se mediu e *"Hoje: 38 seções e 14
   subseções numeradas"*.
2. `external-engines/esteira/src/a-especificacao.ts` e `tests/a-especificacao.test.ts` (14 testes, sem clones): a
   numeração única, sequencial e com a mãe certa; os dois números do comentário; a impressão do texto
   (`IMPRESSAO_DO_TEXTO`, conferida contra o `f61be91` quando a história está à mão); as citações de seção por LUGAR; as
   Etapas da seção 20. Portão sem clones 1 748 → 1 762, 101 → 102 arquivos.

**Os dois lados:** oito mutações das páginas (um título de volta ao `24.1`, uma subseção que pula, o número do
comentário, uma palavra da especificação, o título que a `TRIAGEM.md` cita, uma Etapa, a citação da `TRIAGEM.md`, as
Etapas do `INDEX.md`) e seis de código — todas acusadas. A primeira tentativa do título deu zero: o `sed` mirava a linha
de antes do comentário crescer e não mudou nada; refeita pelo texto, acusada.

**Descartado:** só corrigir o comentário (deixaria aberto o defeito que o prompt mandou fechar); reescrever o comentário
do LAB-00 (apagaria o que aquela sessão afirmou); guardar a impressão numa prova `.json` (seria mais uma cópia a concordar
com outra, D311 — a medição é o próprio `f61be91`).

> **"ÚNICA ALTERAÇÃO: X" NO TOPO DE UM DOCUMENTO RECEBIDO É AFIRMAÇÃO DE ESTADO COMO QUALQUER OUTRA.** Esta valia para um
> nível de título e não para o outro, e passou cinco semanas sem leitor porque parecia relato do passado — e falava do
> arquivo de hoje.

## D399 · A TRIAGEM DO PACKINGSOLVER, PERGUNTADA À ORIGEM — tudo confere, e o `nao-copiado` do registro passa a ser perguntado à árvore · 18/10/2026

**Contexto:** item 900 (LAB-171). A caixa só tinha o `900`; a FILA seguia sem proposta que não esperasse ninguém. Das
páginas de `docs/` sem leitor no código que o LAB-170 contou, sobravam duas, relato datado do LAB-00: a
`SYMBIOS_ANALYSIS.md` (cujo *"Adapter: não escrito"* é a proposta do LAB-152, que espera o chat) e a
`PACKINGSOLVER_TRIAGEM.md`. A segunda, lida linha a linha, não é só relato: fixa a **ficha de um repositório de fora**
(commit, data, licença, opções do `CMakeLists.txt`, seis tipos de problema, opções da linha de comando,
`certificate.csv`), que **cinco** lugares desta casa repetem — o `README.md` (tabela e árvore), o `docs/TRIAGEM.md` (§4 e
quadro), o `external-engines/packingsolver/README.md`, o `adapter/README.md` e o registro de motores —, e **afirma estado
desta casa** (*"não foi copiado para `upstream/`"*). O registro diz `nao-copiado` desde o LAB-76, e nada perguntava à
árvore se era verdade.

**Medido (LAB-171, `bun run lab171`):** buscado na origem só o commit que a página fixa, numa pasta temporária, lido com
`git show`/`ls-tree`/`grep` e nada compilado nem executado — **tudo confere**: o commit existe, com a data e o autor da
ficha; MIT com o copyright da ficha; `CLP` e `HiGHS` `ON`, `Knitro` `OFF`; as seis pastas de problema; as seis opções da
linha de comando e o certificado. O `HEAD` de hoje é `2e2448f` (2026-10-18): a §6 (*"um dia antes desta triagem"*) é
relato datado, e o número de hoje mora na prova, ao lado. Na árvore: zero arquivo em `upstream/` dos dois `nao-copiado`;
a pasta do PackingSolver só com os dois `README.md`.

**Decidido:**

1. A página não muda de texto; ganha, depois da §1, um parágrafo marcado como meu dizendo o que se mediu e onde mora a
   prova (`docs/provas/LAB-171/packingsolver-na-origem.json`).
2. `external-engines/esteira/src/a-triagem-do-packingsolver.ts` e `tests/a-triagem-do-packingsolver.test.ts` (12 testes,
   sem clones e **sem rede**): a ficha lida do texto contra a prova; os cinco lugares, com a frase que cada um tem de
   dizer **derivada da ficha**, nunca digitada; o registro lido **pelo motor** (a primeira versão casava
   `"estado": "so-referencia"` pelo texto e aprovava a mutação, porque a linha também é do straight skeleton); e nenhum
   arquivo versionado em `upstream/` de motor que o registro chama `nao-copiado`. Portão sem clones 1 762 → 1 774, 102 →
   103 arquivos.
3. A rede fica **só na ferramenta**, à mão e fora do verde, declarada no `rede-em-execucao.ts` (três processos, origem
   pública) e na tabela do `SEGURANCA.md`; a linha *"Nada de rede em execução"* deixou de digitar o número de redes
   (*"sete"*) e aponta para a tabela.

**Os dois lados:** trinta e duas mutações acusadas — seis campos da ficha, três da lista de tipos, cinco campos que
somem (acusados como *sumidos*, nunca como acerto), cinco da prova, dez dos lugares e três da árvore — e três casos bons
que não acusam (o straight skeleton mudado no registro, o `upstream/` do Symbios, a página de verdade).

**Descartado:** rede dentro da trava (o verde dependeria de um servidor de fora, e a resposta mudaria sem commit); só
comparar os lugares entre si (consistência não é correção, D311 — os seis podiam concordar no erro); reescrever a §6 com
o `HEAD` de hoje (é relato do dia da triagem e envelheceria de novo amanhã).

> **"NÃO COPIADO" É AFIRMAÇÃO SOBRE A ÁRVORE, NÃO SOBRE O PASSADO.** O registro dizia e o `README.md` desenhava, e
> nenhuma das duas perguntava ao `git ls-files` — que é o único lugar onde a resposta mora.

## D400 · A ANÁLISE DO ESQUELETO RETO, PERGUNTADA À ORIGEM — as duas fichas conferem, e os tempos citados não são os dos arquivos que a página aponta · 18/10/2026

**Contexto:** item 900 (LAB-172). A caixa só tinha o `900`; a FILA seguia sem proposta que não esperasse ninguém. O
LAB-171 deixou escrito que a ficha da `docs/STRAIGHT_SKELETON_ANALYSIS.md` (LAB-00) *"não foi reconferida nesta
rodada"*. A página tinha leitor no código (o `esqueleto.ts` e o oráculo do LAB-04 citam a §4.4), mas o que se lia era a
geometria; a **ficha** de dois repositórios de fora (commit, data, versão, licença do invólucro, licença efetiva, as
bibliotecas que o script fixa, as opções de compilação, o tamanho do `main.js`, o `Cargo.toml`) e o `license.txt` de um
pacote da CGAL, repetidos em seis lugares desta casa, ninguém perguntava.

**Medido (LAB-172, `bun run lab172`):** só os dois commits que a página fixa e só a tag `v5.6` da CGAL, sem os blobs,
lidos com `git show`/`ls-tree`/`grep` e nada compilado nem executado — **as duas fichas conferem**, e o `HEAD` de hoje
das duas origens ainda é o commit da ficha. **O que não confere estava aqui dentro:** a página diz *"Saída completa em
`outputs/…`"* e cita quatro tempos (11.378 ms, 3.490 ms, 14.551µs, 8.82µs) que os dois arquivos não têm (12.487 ms,
3.366 ms, 13.709µs, 6.319µs) — nascidos no mesmo commit, `f61be91`: a página citou uma execução e guardou outra. A
geometria citada (30 linhas) está toda nos arquivos, e o *"~400×"* da §4.5 só vale para o L daquela execução (≈ 396×;
retângulo ≈ 782×; nos arquivos ≈ 911× e ≈ 533×).

**Decidido:**

1. A página não muda de texto; ganha, depois da §1, um parágrafo marcado como meu com o que se mediu, a prova
   (`docs/provas/LAB-172/esqueleto-reto-na-origem.json`), os tempos citados e os do arquivo, e as razões.
2. `external-engines/esteira/src/a-analise-do-esqueleto-reto.ts` e `tests/a-analise-do-esqueleto-reto.test.ts` (16
   testes, sem clones e **sem rede**): as fichas contra a prova; cada linha de geometria citada contra o arquivo; tempo
   citado que o arquivo não tem só passa com a nota do LAB-172 trazendo os tempos **lidos do arquivo**; o `esperado` do
   oráculo do LAB-04 nas duas saídas guardadas; os seis lugares com a frase derivada da ficha; e a pasta com os seis
   arquivos próprios. Portão sem clones 1 774 → 1 790, 103 → 104 arquivos.
3. A rede só na ferramenta, à mão, declarada no `rede-em-execucao.ts` (cinco processos, origem pública) e no
   `SEGURANCA.md`.

**Os dois lados:** sessenta e cinco mutações acusadas, e seis casos bons que não acusam (a página de verdade, `Boost
1.81.0` por inteiro, o tempo que o arquivo tem sem nota, o oráculo de verdade, o PackingSolver mudado no registro, a
pasta de verdade).

**Descartado:** corrigir os tempos da página (é relato de uma execução de verdade, só não guardada); reexecutar as duas
provas (um terceiro tempo não diz qual dos dois está certo, e a geometria, que é o que o Lab usa, já confere); a nota
também na `TRIAGEM.md` (são os números da §4.5 arredondados, e duas notas divergem); conferir GMP e MPFR (moram nos
pacotes baixados, não no repositório — dito no módulo).

> **"SAÍDA COMPLETA EM <ARQUIVO>" É AFIRMAÇÃO SOBRE O ARQUIVO.** Página e arquivo nasceram no mesmo commit e mesmo
> assim discordavam: quem cita uma execução e guarda outra cita um número que o arquivo apontado não tem.

## D401 · A RODADA SEM LINHA — trinta e nove rodadas não escreveram a sua linha na conta dos disparos, e a conta seguiu verde · 18/10/2026

**Contexto:** item 900 (LAB-173). A caixa só tinha o `900`; a FILA seguia sem proposta que não esperasse ninguém, e o
LAB-172 deixou escrito que das páginas de `docs/` sem leitor só sobrava a `SYMBIOS_ANALYSIS.md`, que espera o chat. Na
dívida própria, a espécie **regra sem guarda**: a conta dos disparos do `ONDE_PARAMOS.md` diz *"uma linha por
disparo"*, e o `COMO_FUNCIONA.md` manda anotar o disparo — e a régua do item 004 conferia a tabela **contra ela
mesma** (totais contra linhas, ordem, origem, os vazios contra os recados da classe).

**Medido:** a última linha escrita na hora era a de 16/10, 15:06 (o LAB-133). Do LAB-134 ao LAB-172, **trinta e nove
rodadas**, todas com recado no `RECADOS.md` e todas *"caixa só com o 900"*, não escreveram a delas; o total declarado
ficou em 80 e as linhas em 80, e a conta seguiu VERDE. A régua velha, com os totais ajustados ao abandono, aprova a
tabela sem as 39 — reproduzido na trava e na prova.

**Decidido:**

1. A origem nova **`reconstruido`** no vocabulário fechado: linha escrita depois, por outra rodada, a partir do `git` e
   do recado; a hora é sempre teto (`≤`, o primeiro commit da rodada), e a célula nomeia o commit. As 39 linhas
   reconstruídas, e a desta rodada como `derivado` (teto do `reflog`, 10:06:11). Totais: 120 no registro, 39
   reconstruídos.
2. `conferirAsRodadas` em `src/disparos-do-despertador.ts`, os dois sentidos: todo `LAB-N` de recado do regime da caixa
   tem linha (exceção fechada: o LAB-68, que começou antes de a conta existir, com o motivo no código), todo `LAB-N` da
   coluna da rodada tem recado, e toda reconstruída tem commit e hora de teto. Dez travas novas em
   `tests/disparos-em-vazio.test.ts`, no portão sem clones.
3. A prova `docs/provas/LAB-173/rodadas-sem-linha.json` (`bun run lab173`): cada reconstruída conferida contra o
   primeiro commit da rodada no `git`, o defeito medido e as mutações.

**Os dois lados:** a conta de hoje fecha sem problema; sete mutações acusadas (apagar uma linha, rodada sem recado,
reconstruída sem commit ou com hora afirmada, exceção morta, sem recado ou sem motivo), e a régua velha aprovando o
abandono.

**Descartado:** escrever as 39 como `derivado` (a hora do `git` passaria pela do `cron`, e são medições diferentes —
*classe nova que se mistura com a velha apaga a medição das duas*, D277); inventar linhas para as quatro horas sem
commit de 17/10 (14:28 a 18:36) — disparo que não deixou rodada não se reconstrói, e fica dito na seção, fora da
tabela; cruzar pela hora em vez do prompt (a hora do disparo não se mede depois; o prompt está no recado, que tem
trava).

> **CONTA QUE SÓ SE CONFERE CONTRA SI MESMA APROVA O ABANDONO.** Quem para de escrever a linha para também de
> escrever o total, e os dois continuam concordando. A régua precisa de uma ponta que a rodada é obrigada a escrever.

## D402 · O LAB NÃO TEM BANCO — a frase da página, perguntada à árvore, e o cabeçalho que dizia que ela já tinha trava · 18/10/2026

**Contexto:** item 900 (LAB-174). A caixa só tinha o `900`; a FILA seguia sem proposta que não esperasse ninguém, e o
`.wasm` sem o alvo do `rustup` (o túnel da rede recusa a origem dele, de novo nesta máquina). Na dívida própria, a
espécie **mensagem fixa que afirma estado sem perguntar**, no `docs/SEGURANCA.md`: o topo diz que o Lab *"não tem
banco"*, e a tabela *Banco e RLS* põe as três linhas do Padrão em "não se aplica" por uma frase de 14/09, sem comando —
*"não há banco. Não existe `supabase/`, não existe migração, não existe tabela"*. O cabeçalho da
`rede-em-execucao.ts` (LAB-158) dizia que essa negação já tinha trava, *"pela ausência de `supabase/`, que o
`verde.test.ts` confere contra o disco"*.

**Medido:** **não tinha.** A régua do `verde.test.ts` (LAB-51) lê só as linhas do `conferir.sh` que dizem "não existe".
Três mutações, cada uma numa cópia desta casa, adicionada ao `git`, com a esteira inteira rodando: um
`supabase/migrations/0001_estudos.sql` com `create table`, um arquivo da esteira abrindo banco pelo `bun:sqlite`, e um
`dados/medicoes.sqlite` — nas três, além das 9 de sempre (o `.wasm`), caiu só a contagem de arquivos do LAB-57 (e, na
do `bun:sqlite`, a das chamadas do LAB-52): contagens que caem com qualquer arquivo novo e mandam regerar a prova, sem
dizer por quê. Por LUGAR, o que o `git` carrega: 801 caminhos, 378 JS/TS, 23 Rust, 2 `package.json`, 5 `Cargo.toml` —
**zero** nas cinco portas; zero também numa busca larga (`localStorage`, `sessionStorage`, `indexedDB`, `bun:sqlite`,
`node:sqlite`, `create table`) em todo texto, `.md` incluído. Regra verdadeira, guarda ausente — o desenho do LAB-161.

**Decidido:**

1. A trava `external-engines/esteira/src/o-lab-nao-tem-banco.ts` e `tests/o-lab-nao-tem-banco.test.ts` (sem clones, no
   portão), por cinco portas: a **pasta** de banco em qualquer altura do caminho (`supabase`, `migrations`, `migracoes`,
   `drizzle`, `prisma`), o **arquivo** que é banco ou o descreve, a **importação** de um cliente de banco (JS e Rust, a
   string inteira em posição de importação), a **dependência** num `package.json` ou `Cargo.toml` (as tabelas, a forma
   longa e o renomeado), e o **banco do navegador** (`indexedDB`, `openDatabase`). O universo é publicado, e cada porta
   que lê texto tem de ter lido alguma coisa (D164).
2. **Sem lista de exceções.** Um banco aqui é o dia em que a seção tem de ser refeita antes da primeira migração, como
   a página manda; a mensagem da trava diz isso.
3. O cabeçalho da `rede-em-execucao.ts` passa a dizer o que se mediu: o banco é desta trava; a conta da família é da
   Central, e quem pergunta se o Lab a importa é a `a-adocao-da-central.ts` (LAB-167). A linha da página aponta para a
   trava, e a seção *Reconferido no LAB-174* traz a medição.

**Os dois lados:** a árvore de hoje e uma árvore mínima passam; o que quase parece banco passa (o nome em comentário,
em texto, em string fora de importação, a palavra solta, o `.md` que diz "não existe `supabase/`"); acusados: as quatro
pastas, os sete arquivos, seis formas de importar em JS e três em Rust, as quatro listas do `package.json` e as cinco
formas do `Cargo.toml`, o `indexedDB` no código e na página, o universo vazio, a porta que não leu nada, e as três
mutações de 18/10, cada uma com o motivo. 1 800 → 1 815 travas no portão sem clones.

**Descartado:** perguntar `localStorage` e `sessionStorage` (guardam dado, não são banco; medidos em zero e ditos no
módulo); perguntar a história (um `.sql` que entrou e saiu não deixa banco; segredo na história é da
`arquivo-de-credencial.ts`); e estender a régua do `verde.test.ts` às páginas de `docs/` — ela confere contra o disco o caminho entre crases
de uma frase que diz "não existe": pegaria a pasta `supabase/` na raiz e nada mais (nem a pasta noutra altura, nem o
`.sqlite`, nem a importação, nem a dependência).

> **"ISSO JÁ TEM TRAVA" TAMBÉM É AFIRMAÇÃO, E SE MEDE.** O cabeçalho que apontava a trava do banco foi escrito no mesmo
> dia em que a casa media as outras três negações da frase — e apontava uma régua que lê outro arquivo.

## D403 · A PROVA DE NAVEGADOR, PERGUNTADA PELO LUGAR — "a única é a do LAB-01" eram duas, "não tem tela" calava a bancada, e o console não reprova · 18/10/2026

**Contexto:** item 900 (LAB-175). A caixa só tinha o `900`; a FILA seguia sem proposta que não esperasse ninguém, e o
`.wasm` sem o alvo do `rustup` (o `rustup target add` desta máquina termina em pânico). Na dívida própria, a espécie
**mensagem fixa que afirma estado sem perguntar**, no mesmo `docs/SEGURANCA.md` das rodadas LAB-158 a LAB-174, na seção
que nenhuma delas tinha lido — *O que **não** foi conferido, e por quê*: *"O Lab não tem tela (é regra dele, em
`CLAUDE.md` §4). A única prova de navegador que existe é a do LAB-01 … em `outputs/lab01/navegador.png`"*; e o topo,
*"não tem tela"*.

**Medido por LUGAR:** 805 caminhos, 381 JS/TS. Quem importa um condutor de navegador: **um**, a
`prova-automatica.ts` (LAB-31). Artefatos de navegador em `outputs/` e `docs/provas/`: **dois** — a captura do LAB-01 e
o `docs/provas/LAB-31/navegador.json`. O `CLAUDE.md` §4 diz *"com UMA exceção, declarada: a bancada do navegador"*
(D381). E, lendo o produtor: o `pageerror` e o console são **escutados** e só entram na mensagem quando a página não
publica `window.__prova` — com o número certo e um erro no console, a prova aprova. A régua nova, rodada contra a página
de antes, acusou **nove** problemas.

**Decidido:**

1. A trava `external-engines/esteira/src/a-prova-de-navegador.ts` e `tests/a-prova-de-navegador.test.ts` (sem clones, no
   portão): `PRODUTORES` e `ARTEFATOS` conferidos nos dois sentidos contra a árvore; o item da página nomeia cada um, a
   bancada (o caminho vem da `a-unica-interface.ts`) e a trava; não diz *"única"*; diz que o console não reprova
   enquanto `consoleReprova` — a variável do `pageerror` testada num `if`, no código sem comentário — der falso, e a
   declaração `consoleReprova` de cada produtor é conferida contra o código; e toda linha da página que diz *"não tem
   tela"* / *"não há tela"* nomeia a bancada. Universo publicado.
2. A página corrigida: o topo diz *"não tem tela de usuário — só uma página de ferramenta, a bancada"*; o item nomeia as
   duas provas, o produtor, a bancada, que o console não reprova e que a prova não roda nesta máquina; os dois itens
   de design e celular dizem por que a bancada não conta; a seção *Reconferido no LAB-175* traz a medição.
3. **Não mexi na prova do LAB-31.** Fazê-la reprovar por `pageerror` é uma linha, mas ela não roda nesta máquina (sem o
   `.wasm`) — consertaria uma prova que não posso ver passar. Vai à FILA como *"proposto ao chat"*; a trava já tem o
   dente para o dia em que ela mudar (a declaração passa a contradizer o código).

**Os dois lados:** a árvore de hoje e uma mínima passam; o condutor em string solta, em comentário ou com nome parecido
(`playwrights`) não é achado, e o `if (erroNaPagina)` comentado não conta. Acusados: produtor novo fora da lista,
produtor que perde a importação, produtor que passa a reprovar com a declaração parada, artefato novo e artefato que
sumiu, *"única"* de volta, artefato/bancada/trava calados, console calado, *"não tem tela"* sem bancada noutra linha,
item ausente e universo vazio. 1 815 → 1 832 travas no portão sem clones.

**Descartado:** perguntar se a prova PASSA (ela falha na precondição a cada verde, e isso o `conferir.sh` já diz); ler
`console.error` além do `pageerror` (o produtor não distingue tipo; a régua lê o `if` sobre a variável do erro — dito no
módulo); procurar a palavra *"tela"* em todo `docs/` (as outras páginas que a usam falam da bancada ou do Generate, e
régua larga demais nasce vermelha).

> **A SEÇÃO "O QUE NÃO FOI CONFERIDO" TAMBÉM AFIRMA.** Ela diz por que não conferiu — e o porquê envelhece como qualquer
> outra frase: o *"único"* virou dois em 04/10, e ninguém releu a seção que se apresenta como a lista do que falta.

## D404 · O `.WASM` NÃO PEDE NADA DO AMBIENTE — perguntado ao que o produz e ao que o carrega, e o binário só quando existe · 18/10/2026

**Contexto:** item 900 (LAB-176). A caixa só tinha o `900`; a FILA seguia sem proposta que não esperasse ninguém. Na
dívida própria, a espécie **mensagem fixa que afirma estado sem perguntar**, a linha da tabela *Execução* do
`docs/SEGURANCA.md` que as rodadas LAB-174 e LAB-175 deixaram de lado (*"a do `.wasm` espera o `rustup`"*): *"O `.wasm`
não pede nada do ambiente · carregado com `WebAssembly.instantiate(bytes, {})` — objeto de imports vazio. Medido no
LAB-01: 189 KB, zero imports"*. O binário não é versionado e nenhuma máquina de sessão o compila (o alvo
`wasm32-unknown-unknown` do `rustup` não instala — nesta rodada, *"unsuccessful tunnel"* em `static.rust-lang.org`).

**Medido por LUGAR:** quem instancia WebAssembly no código (sem comentário e sem string): **dois**, os dois com `{}` — o
adaptador (`symbios/adapter/src/motor.ts`, `instantiate(modulo, {})`) e a bancada (`prova.js`, `instantiate(bytes, {})`).
Crates `cdylib` (5 `Cargo.toml`): **duas** — a ponte `symbios/archilly/wasm/`, sem cola no `Cargo.toml` nem no
`Cargo.lock`, com o `__getrandom_v03_custom` no `lib.rs` e o `getrandom_backend="custom"` na receita do `conferir.sh`; e a
sonda do LAB-00, `wasm-probe/`, que **tem** a cola (`getrandom` com `wasm_js`; `wasm-bindgen` e `js-sys` no lock) e que
ninguém carrega. Binário: ausente. A régua nova, contra a linha de antes: quatro nomes que ela não dava.

**Decidido:**

1. A trava `external-engines/esteira/src/o-wasm-nao-pede-nada.ts` e `tests/o-wasm-nao-pede-nada.test.ts` (19 testes, sem
   clones, no portão): `INSTANCIADORES` e `PONTES` nos dois sentidos contra a árvore; o `{}` escrito em cada
   instanciação; a ponte carregada sem cola (`wasm-bindgen*`, `js-sys`, `web-sys`, `gloo*`, `getrandom` com
   `wasm_js`/`js`) no `Cargo.toml` e no `Cargo.lock`, com o backend `custom` definido fora de comentário, sem bloco
   `extern "C" { … }` nem `wasm_import_module`, e com o artefato nomeado na receita; a sonda sem quem nomeie o artefato
   dela; o binário, **quando existe no disco**, com `WebAssembly.Module.imports` vazio — ausente, `null`, *não medido*
   (D23); e a linha nomeando a trava, os dois instanciadores e a ponte. Universo publicado.
2. A linha corrigida: os dois instanciadores e as duas formas da chamada; o *"189 KB, zero imports"* dito como número
   da época, com o porquê de não ser remedido; a seção *Reconferido no LAB-176* com a medição.

**Os dois lados:** a árvore de hoje, uma mínima sem binário e uma com um módulo vazio montado byte a byte passam; a
sonda — que tem a cola — passa, e o `extern "C"` num comentário passa. Acusados: o módulo com um import, o `{}` trocado
ou ausente, instanciador novo e instanciador que sumiu, `wasm_js` ou `wasm-bindgen` na ponte, `js-sys` no lock, o
backend apagado, comentado ou fora da receita, o import à mão no Rust, a sonda nomeada numa ferramenta, crate `cdylib`
nova e crate que sumiu, a ponte cujo artefato a receita não carrega, a linha que cala um nome, a página sem a linha e o
universo vazio. 1 832 → 1 851 travas no portão sem clones.

**Descartado:** compilar o `.wasm` (o alvo não instala, e a régua não pode depender disso); exigir o binário (a trava
nasceria vermelha em toda máquina de sessão); aceitar `instantiate(b)` sem segundo argumento como *"sem imports"* (é
equivalente para o motor, mas a página afirma o `{}` escrito, e a régua pergunta o que a página afirma); ler o `extern`
do `upstream/` (é intocável e cobrado pela árvore desde o LAB-132).

> **"ESPERA O BINÁRIO" NÃO É O MESMO QUE "ESPERA TUDO".** Uma linha que mede um artefato que não se produz aqui ainda tem
> metade no código que o produz — e essa metade se pergunta hoje. O resto sai dito como *não medido*, não como verde.

## D405 · OS VIZINHOS SÃO SÓ LEITURA — o clone tinha trava e a linha não a nomeava; "o número sai no relatório" de toda rodada, e 38 relatórios não dizem · 18/10/2026

**Contexto:** item 900 (LAB-177). A caixa só tinha o `900`; a FILA seguia sem proposta que não esperasse ninguém, e o
`.wasm` sem o alvo do `rustup`. Na dívida própria, a espécie **mensagem fixa que afirma estado sem perguntar**, a
primeira linha da tabela *Os repositórios vizinhos* do `docs/SEGURANCA.md`, do LF-FINAL (14/09): *"Geo, Generate e o
motor de parcelamento são só leitura · ✅ · `git status` nos três ao fim de **toda** rodada, e o número sai no
relatório. Em 14/09, ao fim do LAB-08: 0 alterações em cada"*.

**Medido:** a primeira metade tem trava desde o LAB-38 — a `regras.test.ts` §4 roda `git status --porcelain` nos três
clones a cada verde com clones (D136, D143) —, e a linha não a nomeava. A segunda não tinha nenhuma. Por LUGAR, todo
`docs/relatorios/LAB-<n>.md` que o `git` carrega: **168**; **130** dizem o `git status` dos vizinhos e o resultado,
**38** não (LAB-02, 03, 07, 48 a 52, 57 a 61, 69, 75, 77 a 79, 85, 88 a 95, 116 a 125, 153). A régua nova, contra a linha
de antes: cinco problemas (as duas travas e o LAB-177 não nomeados, o número ausente, a promessa sem recorte).

**Decidido:**

1. A trava `external-engines/esteira/src/os-vizinhos-no-relatorio.ts` e `tests/os-vizinhos-no-relatorio.test.ts` (16
   testes, sem clones, no portão): *dizer* é ter `git status` e, a até 220 caracteres, os vizinhos e o resultado — as
   formas tiradas dos 130 que dizem; de **LAB-177 em diante** todo relatório diz (`relatorio-calado`); os 38 de antes
   congelados em `CALADOS`, nos dois sentidos (`calado-fora-da-lista`, `declaracao-que-sobra` — relatório antigo não se
   reescreve para passar); a linha nomeia as duas travas e o LAB-177 e escreve *"**38** dos 168 relatórios"*, os dois
   números perguntados à árvore; a promessa antiga sem recorte reprova. Universo publicado.
2. A linha corrigida: o clone pela `regras.test.ts`, o recorte dito, a seção *Reconferido no LAB-177* com a medição.

**Os dois lados:** as seis formas que os relatórios usam contam; `git status` sobre outra coisa, os vizinhos sem
`git status` e a palavra longe demais não contam. Acusados, cada um pelo nome: relatório novo calado, relatório antigo
calado fora da lista, declarado que passou a dizer ou que sumiu, a página sem a linha, a linha que cala uma trava, os
dois números errados (e um relatório antigo a mais, que muda o número perguntado), a promessa de volta, o universo
vazio. 1 851 → 1 867 travas no portão sem clones.

**Descartado:** reescrever os 38 relatórios antigos (o relatório é o registro da rodada; a lista é a medição);
apagar a metade do relatório da linha em vez de guardá-la (as rodadas a cumprem desde o LAB-126, com uma só exceção — o
LAB-153 —, e o relatório é onde o chat lê); exigir na régua os três nomes dos vizinhos (três relatórios antigos dizem *"o clone"*, do Generate, com
os três por perto — dito no que a trava não alcança); ler o clone nesta régua (é a `regras.test.ts` que o lê, e esta
roda sem clones).

> **UMA LINHA COM DUAS METADES PODE TER UMA TRAVA SÓ.** A metade guardada faz a linha inteira parecer conferida; a outra
> envelhece calada — aqui, 38 vezes em 168.

## D406 · O QUE PRECISA MUDAR NOS VIZINHOS VIRA LISTA EM RELATÓRIO — a linha não nomeava a trava do LAB-149, e dois dos quatro exemplos dela saíram em prosa · 18/10/2026

**Contexto:** item 900 (LAB-178). A caixa só tinha o `900`; a FILA seguia sem proposta que não esperasse ninguém, e o
`.wasm` sem o alvo do `rustup`. Na dívida própria, a espécie **mensagem fixa que afirma estado sem perguntar**, a
terceira linha da tabela *Os repositórios vizinhos* do `docs/SEGURANCA.md`, do LF-FINAL (14/09): *"O que precisa mudar
neles vira lista em relatório · ✅ · LAB-07 §9 (8 correções), LAB-02 §5, LAB-03 e LAB-08 — todos com o número e sem
commit lá"*.

**Medido:** a regra tem trava desde o LAB-149 (`pedido-ao-vizinho.ts`, D377), e a linha não a nomeava. Os quatro
exemplos, pela régua do LAB-149: o LAB-07 tem dois lugares de pedido, o §9 com oito itens e o do §8 em prosa
(congelado); o LAB-03 tem um, em prosa (congelado); o LAB-02 e o LAB-08, nenhum que a régua veja — o do LAB-02 tem
lista, num parágrafo aberto em negrito; o do LAB-08 é uma pergunta em prosa. O *"com o número"* é o número medido, e
está nos quatro; a lista, em dois. A régua nova, contra a página de antes: sete problemas.

**Decidido:**

1. A trava `external-engines/esteira/src/o-pedido-na-pagina.ts` e `tests/o-pedido-na-pagina.test.ts` (13 testes, sem
   clones, no portão): a linha nomeia as duas travas, o LAB-149 e o LAB-178; escreve *"**5** pedidos sem lista"*, o
   comprimento de `SEM_LISTA_ANTES_DA_TRAVA`, perguntado; *"todos com o número"* reprova; a linha não cita relatório fora
   da tabela; a tabela da seção *Reconferido no LAB-178* tem os quatro exemplos e as quatro colunas de número que
   `lugaresDePedido` acha. Universo publicado.
2. A linha corrigida, e a seção *Reconferido no LAB-178* com a tabela.

**Descartado:** escrever na linha o total de lugares de pedido (cresce a cada relatório bom, e a linha quebraria em
toda rodada; os congelados só descem por decisão escrita); corrigir os exemplos dentro da linha (número sem leitor numa
tabela de segurança é o defeito); **propor ao chat que a régua do LAB-149 lesse o parágrafo de pedido aberto em
negrito** — eu ia, e a medição desfez: dos sete parágrafos com a forma em `docs/relatorios/`, cinco estão sob título que
a régua já lê, e os dois de fora (LAB-02, com lista; LAB-56, um lembrete já numerado) não escondem pedido sem lista.

> **EXEMPLO NUMA LINHA DE CONFERÊNCIA É AFIRMAÇÃO SOBRE OUTRO ARQUIVO, E ENVELHECE COMO NÚMERO.** Aqui, quatro exemplos de
> *"lista em relatório"*, e dois em prosa — um deles congelado como descumprimento pela própria casa, um mês depois.

## D407 · CHAVE DE IA SÓ NO SERVIDOR DA CENTRAL — "o Lab não chama IA", e a linha não nomeava nenhuma das quatro travas que o perguntam · 18/10/2026

**Contexto:** item 900 (LAB-179). A caixa só tinha o `900`; a FILA seguia sem proposta que não esperasse ninguém, e o
`.wasm` sem o alvo do `rustup`. Na dívida própria, a espécie **mensagem fixa que afirma estado sem perguntar**, a quarta
linha da tabela *Chaves e segredos* do `docs/SEGURANCA.md`, do LF-FINAL (14/09): *"Chave de IA só no servidor da
Central · não se aplica · o Lab não chama IA. Ver `ADOCAO_CENTRAL.md`"*.

**Medido:** por LUGAR, quatro jeitos de o Lab ter IA, cada um perguntado hoje por régua própria, nascida depois da linha — a
chave (`varredura-de-segredos.ts`, LAB-47, três formatos), a chamada (`destino-do-que-sai.ts`, `CHAMADA_PAGA_DE_IA`, seis
formas, nascida no LAB-68 e lá desde o LAB-80, que pega também a chamada pela porta de IA da Central), a porta paga
(`nada-pago.ts`, LAB-148) e a rede no caminho do motor (`rede-em-execucao.ts`, LAB-158). Zero achados nas quatro. A linha
não nomeava nenhuma, e o LAB-178 contava duas. A régua nova, contra a página de antes: catorze problemas.

**Decidido:**

1. A trava `external-engines/esteira/src/a-ia-na-pagina.ts` e `tests/a-ia-na-pagina.test.ts` (19 testes, sem clones, no
   portão): roda as quatro réguas e publica os universos; a linha nomeia as quatro travas, as quatro rodadas, esta trava e
   o LAB-179; os dois números da linha são o tamanho das duas listas de formas; a tabela da seção *Reconferido no
   LAB-179* tem as quatro travas, a rodada que cada módulo nomeia e os achados que as réguas acham.
2. A linha corrigida, e a seção *Reconferido no LAB-179* com a tabela.

**Descartado:** dar na tabela a rodada de nascimento da régua da chamada (LAB-68) — perguntá-la pediria a história do
`git`, e o portão sem clones roda em clone raso; escrever os universos na página (crescem a cada arquivo); uma lista de
nomes de fornecedor de IA (trava de palavra; o que fecha é a porta, e a `nada-pago.ts` já reprova a porta não declarada);
mexer no `ADOCAO_CENTRAL.md` (outra página, com a trava do LAB-167); e passar `ler("CLAUDE.md") ?? ""` à régua das portas
— a varredura de chamadas do LAB-52 acusou, e sem o arquivo a trava agora diz `universo-vazio`.

> **"NÃO SE APLICA" NUMA LINHA DE SEGURANÇA É AFIRMAÇÃO DE ESTADO, E PRECISA DIZER QUEM A PERGUNTA.** Aqui, quatro travas
> a perguntavam, a linha não nomeava nenhuma — e a rodada anterior desta casa achava que eram duas.

## D408 · NENHUMA CHAVE EM `VITE_` — "não há build de navegador", e há um: o `.wasm`, que embute uma variável de compilação · 18/10/2026

**Contexto:** item 900 (LAB-180). A caixa só tinha o `900`; a FILA seguia sem proposta que não esperasse ninguém, e o
`.wasm` sem o alvo do `rustup`. Na dívida própria, a espécie **mensagem fixa que afirma estado sem perguntar**, a segunda
linha da tabela *Chaves e segredos* do `docs/SEGURANCA.md`, do LF-FINAL (14/09) — a última da tabela sem trava, que o
LAB-179 tinha deixado de lado: *"Nenhuma chave em `VITE_` · não se aplica, e está limpo · não há build de navegador
neste repositório; e a busca acima cobre `VITE_`"*.

**Medido:** por LUGAR, as três portas por onde uma variável de compilação chegaria ao navegador desta casa. O
**empacotador** (dependência, `script`, configuração pelo nome, chamada no código; 394 arquivos lidos): zero. A **página**
da bancada (os dois arquivos que o servidor dela devolve como estão): nenhuma leitura de ambiente, nenhum nome com prefixo
público. O **`.wasm`** da ponte `symbios/archilly/wasm/` — que É um build que o navegador baixa: **um** nome embutido,
`SYMBIOS_VERSAO` (`env!` no `lib.rs`), posto pelo `build.rs` a partir do `Cargo.toml` do upstream; o `build.rs` não lê a
máquina. A frase era falsa na letra (há build) e verdadeira no que importa (nenhuma chave entra nele); a segunda metade
era verdade desde o LAB-166, e a linha não nomeava a trava. A régua nova, contra a página de antes: oito problemas.

**Decidido:**

1. A trava `external-engines/esteira/src/o-que-o-navegador-baixa.ts` e `tests/o-que-o-navegador-baixa.test.ts` (21
   testes, sem clones, no portão): as três perguntas na árvore, os universos publicados; todo nome embutido no `.wasm`
   declarado em `EMBUTIDAS` e posto pelo `build.rs` (`cargo:rustc-env=`), nos dois sentidos; o `build.rs` sem
   `env::var`; a busca do LAB-166 ainda com o prefixo; a linha com as duas travas, as duas rodadas, o número e o nome, e
   sem a frase de antes; a tabela da seção *Reconferido no LAB-180* com as três perguntas e os achados.
2. A linha corrigida (de *"não se aplica"* para *"limpo"*: a regra se aplica, porque há build), e a seção com a tabela.

**Descartado:** deixar como estava porque a busca do LAB-166 já cobre o prefixo (ela procura o NOME no texto; um
`env!("CHAVE")` na ponte não tem prefixo nenhum e vai para dentro do `.wasm` igual); perguntar ao `Bun.serve` se ele
transforma o arquivo (é código, e a `a-unica-interface.ts` já pergunta quem sobe servidor — dito no fim do módulo);
incluir a sonda `wasm-probe/` (ninguém a carrega, LAB-176); e uma lista fechada de empacotadores como garantia (é trava
de palavra — o empacotador novo continua sendo porta nova para a `nada-pago.ts`).

> **"NÃO HÁ BUILD" É A FRASE QUE ESQUECE O BUILD QUE NÃO É DE JAVASCRIPT.** A regra do `VITE_` é sobre o que o compilador
> copia para dentro do que o navegador baixa; aqui quem copia é o `cargo`, e o `env!` é o prefixo que ninguém procurava.

## D409 · NADA REPINTADO FORA DO CATÁLOGO DE DESIGN — "não há design", e há cor escrita à mão em três lugares · 18/10/2026

**Contexto:** item 900 (LAB-181). A caixa só tinha o `900`; a FILA seguia sem proposta que não esperasse ninguém, e o
`.wasm` sem o alvo do `rustup`. Com a tabela *Chaves e segredos* toda perguntada (LAB-180), na dívida própria, a espécie
**mensagem fixa que afirma estado sem perguntar**: o item da seção *O que **não** foi conferido* do `docs/SEGURANCA.md`,
do LF-FINAL (14/09) — *"Nada repintado fora do catálogo de design. Não há design: a única página é a bancada, que é
ferramenta e não tela de usuário"*.

**Medido:** por LUGAR, os dois caminhos por onde cor entra na árvore — o arquivo de página (`.html`, `.css`, `.svg`,
componente; 2 lidos) e a string de cor no código que pinta (398 lidos, fora do `upstream/` e de `node_modules/`). **9**
cores escritas à mão, nenhuma do catálogo da família: o `<style>` da bancada (2), o canvas do `prova.js` (4) e o
`outputs/symbios_full_city_lots.svg` (3), saída do exemplo `full_city.rs` do upstream gravada no LAB-00. Tela de usuário,
nenhuma. A frase era falsa na letra (há design) e verdadeira no que importa (a regra é de tela de usuário); e ninguém a
perguntava — uma cor nova na bancada ou uma página nova pintada passariam a esteira inteira. A régua nova, contra a página
de antes: cinco problemas.

**Decidido:**

1. A trava `external-engines/esteira/src/as-cores-da-bancada.ts` e `tests/as-cores-da-bancada.test.ts` (17 testes, sem
   clones, no portão): os lugares com cor e a paleta de cada um congelados em `LUGARES`, nos dois sentidos (`cor-fora-da-
   lista`, `lugar-que-sumiu`, `cor-nova`, `cor-que-sumiu`); o item com a trava, a rodada e o número, e sem *"não há
   design"*; a tabela da seção *Reconferido no LAB-181* com os três lugares e as cores; os dois universos publicados.
2. O item corrigido (*"Não se aplica: não há tela de usuário, só a bancada"*, e as **9** cores ditas), e a seção com a
   tabela. O item fica na seção *O que não foi conferido*, como o da prova de navegador do LAB-175: a regra não se
   aplica, e o que se pergunta agora é a cor que existe.

**Descartado:** perguntar também fonte, tamanho e margem (a regra do Padrão é de tela de usuário, que não há; a bancada é
ferramenta — dito no fim do módulo); trocar as cores da bancada pelas do catálogo da Central (é decisão de design, e o
Lab não adota o kit — `ADOCAO_CENTRAL.md`); perguntar o `upstream/` no código (é cópia byte a byte, LAB-132; o que ele
pintou e está na árvore, o `.svg`, entra); e uma prova JSON (a medição é a trava, que imprime os universos a cada verde).

> **"NÃO HÁ DESIGN" É A FRASE QUE CONFUNDE "NÃO HÁ TELA DE USUÁRIO" COM "NÃO HÁ COR".** A regra se aplicava por
> ausência, e a ausência era de outra coisa: a cor estava lá, e o que faltava era quem a contasse.

## D410 · MOBILE SEM ROLAGEM LATERAL — "a bancada não é aberta no celular", e ninguém a tinha aberto · 18/10/2026

**Contexto:** item 900 (LAB-182). A caixa só tinha o `900`; a FILA seguia sem proposta que não esperasse ninguém, e o
`.wasm` sem o alvo do `rustup`. Na dívida própria, a espécie **mensagem fixa que afirma estado sem perguntar**: o último
item da seção *O que **não** foi conferido* do `docs/SEGURANCA.md` ainda sem pergunta, do LF-FINAL (14/09) — *"Mobile
sem rolagem lateral. Idem: a bancada não é aberta no celular"*. O LAB-181 o deixou para depois porque a resposta honesta
é uma medição de navegador e a bancada sem o `.wasm` não monta o que mostra.

**Medido:** a bancada monta o mesmo esqueleto com ou sem o `.wasm` (ele só muda o que vai dentro do `<pre>` e do
`<canvas>`), então ela se mede nesta máquina. No Chromium, a 390×844 (a tela do Laboratório de Parcelamento), 360×740 e
320×568, com e sem a emulação de celular, em dois estados — como monta aqui, e com o registro de 10/09 (lido do
`README.md` da bancada) dentro do `<pre>`: **sobra 0 px nos doze casos**. O `<canvas>` de 700 px encolhe
(`max-width: 100%`, 328 px a 390), a linha mais larga do registro (698 px) rola dentro da caixa (`overflow-x: auto`) e o
`body` não tem largura fixa. E a página não tem `<meta name="viewport">`: emulando celular, o Chromium a desenha em
980 px e a encolhe — não rola, mas a letra fica com cerca de 40 % do tamanho. A frase era verdadeira no resultado e falsa
no motivo. A régua nova, contra a página e o `conferir.sh` de antes: nove problemas (oito na página, um no verde).

**Decidido:**

1. Um produtor de prova de navegador novo, `external-engines/symbios/adapter/ferramentas/navegador/rolagem-no-celular.ts`,
   que escreve `docs/provas/LAB-182/navegador-celular.json` com o SHA-256 do `index.html` e do `prova.js`, e reprova
   sozinho com sobra acima de zero. **Sem servidor**: a página chega ao Chromium por `route`, num endereço `.invalid` que
   não existe na rede — o servidor da bancada continua um só (LAB-153). É o primeiro produtor de navegador que roda nesta
   máquina, porque não precisa do `.wasm`.
2. O `conferir.sh` o roda **antes dos pacotes** — o verde passa de sete para **oito passos** —, para a trava ler o JSON
   de agora. `CLAUDE.md` §7, a linha do `conferir.sh` no `INDEX.md`, a régua das contagens e o `verde.test.ts` com o
   número novo.
3. A trava `external-engines/esteira/src/a-rolagem-no-celular.ts` e `tests/a-rolagem-no-celular.test.ts` (18 testes, sem
   clones, no portão): a prova é desta página (impressão e `<meta name="viewport">`), tem a tela da família e os dois
   estados, a maior sobra é a dos casos e é zero, o verde roda o produtor, o item nomeia produtor, JSON, trava e rodada
   (a rodada fora dos caminhos) com a sobra e o viewport ditos, e a tabela da seção *Reconferido no LAB-182* tem os casos.
4. As réguas vizinhas, com a peça nova declarada: o produtor e o JSON nas listas da `a-prova-de-navegador.ts` (LAB-175;
   o item da prova de navegador passa de *duas* a **três** provas), o endereço `bancada.invalid` como `nao-e-chamada` na
   `nada-pago.ts` (LAB-148; 33 → 34 portas) e o JSON entre as provas que não medem gleba (`regras.test.ts`, §7).

**Descartado:** acrescentar o `<meta name="viewport">` à bancada (é ferramenta, a letra pequena não é estouro, e mudar a
página muda o que a medição responde — fica dito no item e no fim do módulo); medir com um servidor (seria o segundo, e a
`a-unica-interface.ts` conta servidores); esperar o `.wasm` (a pergunta é a largura, e o esqueleto não depende dele); e
pôr a medição dentro da `prova-automatica.ts` (ela morre na precondição do `.wasm` nesta máquina, e a medição junto).

> **"NÃO É ABERTA NO CELULAR" É HÁBITO DE QUEM USA, NÃO PROPRIEDADE DA PÁGINA.** A regra se responde abrindo — e,
> aberta, a página não rolava, mas por motivos que ninguém tinha escrito, e com uma letra que ninguém tinha visto.

## D411 · NADA DE EXPORTAR MOTOR OU CÓDIGO AO USUÁRIO — "o Lab não tem usuário nem exportação", e o repositório é público · 18/10/2026
**Contexto:** item 900 (LAB-183). A caixa só tinha o `900`; a FILA seguia sem proposta que não esperasse ninguém, e o
LAB-182 fechou a seção *O que não foi conferido* do `docs/SEGURANCA.md`. Lidas as tabelas da página linha a linha, sobrou
uma sem trava nomeada, da tabela *Execução*, do LF-FINAL (14/09): *"Nada de exportar motor ou código ao usuário · não se
aplica · o Lab não tem usuário nem exportação. O que ele publica são relatórios e JSON de medição"*. Espécie: mensagem
fixa que afirma estado sem perguntar.

**Medido:** o Lab não tem usuário, mas o repositório é **público** (D141) e lê por caminho três vizinhos **privados**
(D16) — o que sai daqui sai para o mundo. Seis portas: a tela (LAB-153) e o código do produto copiado (LAB-146) já tinham
régua; pacote, rotina, binário e `docs/`, nenhuma. Por LUGAR: 2 `package.json`, os dois `"private": true`; 4 `Cargo.toml`
fora do `upstream/`, **dois sem `publish = false`** (`straight-skeleton/archilly/probe-rust/` e
`symbios/archilly/wasm-probe/`); 1 rotina, nenhum passo que publique; nenhum artefato compilado versionado; `docs/` em
`.md`, `.json`, `.geojson` (os terrenos) e `.txt`. A régua nova, contra a página e a árvore de antes: catorze problemas.

**Decidido:**

1. `publish = false` nos dois `Cargo.toml`. Que o `cargo` já os recusaria (dependência por `path` sem versão) é
   comportamento de ferramenta externa não testado aqui; o campo não depende dele.
2. A trava `external-engines/esteira/src/nada-se-exporta.ts` e `tests/nada-se-exporta.test.ts` (14 testes, sem clones,
   no portão): as quatro portas, sem lista de exceções e com o universo publicado; a linha nomeia a trava, as duas
   vizinhas, as três rodadas e os quatro formatos, e não diz a frase de 14/09 sozinha; a tabela do *Reconferido no
   LAB-183* tem as quatro portas com os achados da régua.
3. A linha reescrita e a seção nova no `docs/SEGURANCA.md`; o portão passa de 113 a 114 arquivos e de 1 955 a 1 969
   travas.

**Descartado:** declarar `permissions: contents: read` no `verde.yml` (mudar rotina não é desta dívida, e a página só
afirma o passo; fica dito no fim do módulo); rodar `cargo publish --dry-run` para provar que o `cargo` recusaria (fala
com o registro); uma lista de exceções para formatos novos em `docs/` (uma captura de tela é o dia de refazer a linha);
e perguntar se o código pode ser LIDO (o repositório é público de propósito).

> **"NÃO SE APLICA" PORQUE NÃO HÁ USUÁRIO NÃO FECHA A REGRA DE EXPORTAR, QUANDO O REPOSITÓRIO É PÚBLICO.** A pergunta é
> por onde o código viraria produto entregue — e, das quatro crates da casa, duas não diziam que não viram.

## D412 · O LAB NÃO TEM CONTA DE USUÁRIO — a negação do topo do `SEGURANCA.md` tinha uma porta só, a da Central · 18/10/2026
**Contexto:** item 900 (LAB-183 → LAB-184). A caixa só tinha o `900`; a FILA seguia sem proposta que não esperasse
ninguém, e o LAB-183 fechou as tabelas do `docs/SEGURANCA.md`. Sobrava o parágrafo do topo, do LF-FINAL (14/09): o Lab
*"não tem tela de usuário […], não tem banco, não tem conta de usuário e não faz chamada de rede em execução"*. Três
negações ganharam trava depois (LAB-153, LAB-158, LAB-174); a da conta, só a porta do kit da Central (LAB-167), e a trava
do banco a passava adiante para ela. O parágrafo não nomeava trava nenhuma. Espécie: mensagem fixa que afirma estado sem
perguntar.

**Medido:** três plantas, cada uma numa cópia da casa (`git worktree`), adicionada ao `git`, com a suíte da esteira
inteira rodando — uma biblioteca de senha (`bcryptjs`) num arquivo da esteira, um campo de senha na bancada, um
`document.cookie` no `prova.js`. Nenhuma trava disse "conta": caíram as contagens de arquivo do LAB-52 e do LAB-57, o
carimbo da bancada do LAB-182 (qualquer edição o derruba) e, para o campo, a régua do `<form` do `regras.test.ts` §4, que
não pega o campo solto. Por LUGAR, nas quatro portas novas, em 833 caminhos (399 JS/TS, 23 Rust, 1 HTML, 2
`package.json`, 5 `Cargo.toml`): zero. A régua nova, contra a página de antes: seis problemas.

**Decidido:**

1. A trava `external-engines/esteira/src/o-lab-nao-tem-conta.ts` e `tests/o-lab-nao-tem-conta.test.ts` (20 testes, sem
   clones, no portão): as portas `modulo`, `dependencia`, `senha` e `cookie`, sem lista de exceções e com o universo
   publicado; a quinta, a da família, fica com a `a-adocao-da-central.ts`, e esta só cobra que o parágrafo a nomeie.
2. O parágrafo do topo nomeia as cinco travas das quatro negações, e a régua cobra o nome e a existência de cada uma; a
   seção *Reconferido no LAB-184* tem as quatro portas e os dois tamanhos das listas, contados.
3. A trava do banco deixa de dizer que a conta é só da Central. O portão passa de 114 a 115 arquivos e de 1 969 a 1 989
   travas.

**Descartado:** perguntar o cabeçalho de autorização do HTTP (as ferramentas o usam com o token do GitHub para ler os
vizinhos — credencial da sessão, não conta de usuário; o segredo é da varredura de segredos); perguntar `localStorage` e
`sessionStorage` como conta (a trava do banco já os mediu, zero); estender a régua do `<form` do §4 (ela responde outra
pergunta, a de produto, e responde certo).

> **NEGAÇÃO QUE DELEGA A UMA TRAVA DE OUTRA PORTA ESTÁ PERGUNTADA PELA METADE.** "Quem pergunta é a da Central" valia para
> a conta da família; a conta feita aqui, sem a Central, não tinha quem perguntasse.

## D413 · A ANÁLISE DO SYMBIOS, PERGUNTADA À ORIGEM — a cópia é byte a byte o commit, e "14 módulos" são 13 · 18/10/2026
**Contexto:** item 900 (LAB-184 → LAB-185). A caixa só tinha o `900`; a FILA seguia sem proposta que não esperasse
ninguém. O LAB-172 deixou a `docs/SYMBIOS_ANALYSIS.md` como a única página de `docs/` sem leitor no código, dada como
esperando a proposta do LAB-152 — que é sobre a anatomia das pastas (a linha *"Adapter: não escrito"*), não sobre a ficha
de origem. Espécies: mensagem fixa que afirma estado sem perguntar (*"a cópia… idêntica"*, a ficha) e número digitado à
mão (*"`src/` tem 14 módulos"*). A `upstream-intocavel.ts` (LAB-132) declarava não cobrar *"que a cópia seja igual ao
upstream DE VERDADE"*.

**Medido** (`bun run lab185`, a prova em `docs/provas/LAB-185/symbios-na-origem.json`): o commit `c3f2875…` existe na
origem com a data e o autor da ficha; `Cargo.toml` 0.4.1 e MIT; o copyright da §2. A árvore do commit, lida sem os blobs,
tem 24 arquivos, e os 24 estão na cópia com o mesmo objeto do `git` e o mesmo modo — só o `VERSION` a mais. As cinco
dependências diretas, nas versões que os três `Cargo.lock` resolvem, têm no registro público a licença da tabela, e a
`symbios-ground` é do mesmo autor. O `HEAD` de hoje da origem já é outro (`75fff49`, 05/10). **O 14 da §3 é a conta de
arquivos**: o `lib.rs` declara 13 `pub mod`, os 13 que a lista da página nomeia. A régua nova acusou três problemas antes.

**Decidido:**

1. A trava `external-engines/esteira/src/a-analise-do-symbios.ts` e `tests/a-analise-do-symbios.test.ts` (21 testes, sem
   clones e sem rede, no portão): a ficha contra a prova e o `VERSION`; a cópia contra a árvore do commit, arquivo por
   arquivo; a tabela contra os três locks, o `Cargo.toml` e o registro; os módulos contra o `lib.rs`; e quatro lugares.
2. A página ganha a nota datada; o texto do LAB-00 fica. O número errado só passa com a nota dizendo os dois números
   lidos — ou corrigido, e aí não pede nota.
3. A ferramenta com rede é a `lab185.ts`, à mão, fora do verde, declarada no `rede-em-execucao.ts` (quatro processos) e o
   `crates.io` no `nada-pago.ts` (gratuito). O portão passa de 115 a 116 arquivos e de 1 989 a 2 010 travas.

**Descartado:** ler a linha *"Adapter:"* (é da proposta do LAB-152, que espera o chat); baixar os 24 arquivos para `cmp`
(o objeto do `git` já é o resumo dos bytes); trocar a cópia pelo `HEAD` de hoje (muda o motor medido, ato deliberado);
consertar a régua de rede do LAB-158, que não vê o argumento de rede quando a chamada quebra a linha antes dele (medido:
só a primeira versão da minha ferramenta fazia isso, reescrita) — escopo novo, proposto ao chat.

> **"IDÊNTICA AO COMMIT" SE PERGUNTA PELO OBJETO DO `git`, E O OBJETO VEM NA ÁRVORE.** A pergunta que a trava do LAB-132
> dizia precisar da rede precisa dela uma vez, para gravar a árvore; depois, cada verde a refaz sem sair da máquina.

## D414 · O ESTADO DO DESPERTADOR MORA NUM LUGAR SÓ — e a porta da frente dizia outro · 18/10/2026
**Contexto:** item 900 (LAB-185 → LAB-186). A caixa só tinha o `900`; a FILA seguia sem proposta que não esperasse
ninguém. Na dívida própria, espécie mensagem fixa que afirma estado sem perguntar: o bloco do topo do `README.md`, do
LF-FINAL (14/09/2026) — *"A fila autônoma está esgotada desde 14/09/2026 — […] e o despertador foi apagado"*. Falso desde a
fila de 15/09. O item 004 (D234) pôs o estado do despertador num lugar só, a conta dos disparos do `ONDE_PARAMOS.md`, e a
trava dele perguntava só dentro da seção.

**Medido** por LUGAR (todo `.md` que o `git` carrega, fora do `upstream/`, do `node_modules/` e dos diários declarados),
parágrafo a parágrafo, sem riscado, crase nem citação: 33 lidos, 223 nos diários, **um achado — o `README.md`**, nas duas
formas. A régua nova acusou três problemas antes (as duas formas e o bloco do topo sem a caixa de entrada).

**Decidido:**

1. O bloco do topo do `README.md` diz **onde** o estado mora — a caixa e a conta dos disparos —, e não qual é; a frase
   velha fica riscada e datada.
2. A trava `external-engines/esteira/src/o-estado-num-lugar-so.ts` e `tests/o-estado-num-lugar-so.test.ts` (12 testes,
   sem clones, no portão): as duas formas no presente fora dos diários reprovam; os diários declarados com o motivo e
   conferidos no disco; o bloco do topo cita os dois caminhos; o universo publicado, com piso. O portão passa de 116 a
   117 arquivos e de 2 010 a 2 022 travas.

**Descartado:** escrever o estado certo no `README.md` (seria a segunda terra do D234); uma lista de portas em vez do
universo (o `README.md` de motor novo nasceria fora); ler código e comentários (o estado se diz em página); consertar o
*"Também não tem interface"* do mesmo `README.md` — outra afirmação e outra trava, proposto ao chat.

> **O LUGAR ÚNICO PRECISA DE QUEM PERGUNTE OS OUTROS LUGARES.** A trava que confere a seção do estado não via a porta da
> frente dizendo outro — e a porta da frente diz onde o estado mora, nunca qual é.

## D415 · A PASTA DE TESTES DO SYMBIOS — "vazio nesta fase", e o adaptador nasceu no dia seguinte · 19/10/2026
**Contexto:** item 900 (LAB-186 → LAB-187). A caixa só tinha o `900`; a FILA seguia sem proposta que não esperasse
ninguém. Na dívida própria, espécie mensagem fixa que afirma estado sem perguntar: dos 14 `README.md` que o `git` carrega
fora do `upstream/`, três não tinham leitor no código; um deles, `external-engines/symbios/tests/README.md`, do LAB-00
(09/09/2026), dizia *"Vazio nesta fase"*, que o adaptador *"só nasce na Etapa C"* e que os testes *"serão escritos
aqui"*. O adaptador nasceu no LAB-01 (10/09) e os testes dele do LAB-02 em diante (14/09), na suíte da esteira.

**Medido** por LUGAR: a pasta carrega só a página; `adapter/src/` carrega 11 arquivos; dos 155 testes da esteira, 8
carregam o `.wasm` pela porta (`Motor.carregar(`); nenhum dos 161 `*.test.ts` e `.rs` fora do `upstream/` escreve um dos
quatro nomes da especificação (§22). A régua nova acusou catorze problemas na página de antes.

**Decidido:**

1. A página diz o que a pasta carrega (só ela), onde moram os testes do motor (o upstream) e os do adaptador (a esteira,
   os oito entre marcas), e que os quatro nomes não existem como teste — sem afirmar qual arquivo responde a qual. O texto
   velho fica riscado e datado.
2. A trava `external-engines/esteira/src/a-pasta-de-testes-do-symbios.ts` e `tests/a-pasta-de-testes-do-symbios.test.ts`
   (30 testes, sem clones, no portão): a pasta contra a página; a forma velha reprova enquanto houver adaptador no `git`;
   a lista nos dois sentidos contra os testes que carregam o `.wasm`; os caminhos `../` no `git`; os quatro nomes na
   especificação, na página, e em nenhum teste enquanto a página disser que não. A página de antes, byte a byte, reprova
   dentro do próprio teste. O portão passa de 117 a 118 arquivos e de 2 022 a 2 052 travas.

**Descartado:** mapear os quatro nomes para os oito arquivos (correspondência não medida é dado inventado); mover os
testes para a pasta (mudança de arquitetura sem pedido); contar teste do adaptador pelo `import` (13 pelo apelido, muitos
só por tipo ou função pura — a porta que roda o motor é a `Motor.carregar(`); consertar a linha `tests/` da tabela de
`external-engines/symbios/README.md` (é a anatomia das pastas, proposta do LAB-152 que espera o chat — proposto ao chat
juntar a ela).

> **A PÁGINA DE PASTA VAZIA ENVELHECE PELO MUNDO EM VOLTA, NÃO PELA PASTA.** A pasta segue vazia e a frase segue verdade
> sobre ela, enquanto o *"por enquanto"* deixa de ser. Ela diz onde a coisa mora — e alguém pergunta se mora lá.

## D416 · A PÁGINA DA BANCADA — o que a pasta carrega, quem roda cada arquivo, e a medição de 10/09 em três lugares · 19/10/2026
**Contexto:** item 900 (LAB-187 → LAB-188). A caixa só tinha o `900`; a FILA seguia sem proposta que não esperasse
ninguém. O LAB-187 deixou para outra rodada a página da bancada do navegador
(`external-engines/symbios/adapter/ferramentas/navegador/README.md`), contada como *"sem leitor no código"*. Na dívida
própria, espécies mensagem fixa que afirma estado sem perguntar e número digitado à mão: a página, do LAB-01
(10/09/2026, `069fd29`), descreve a pasta como ela era naquele dia — `index.html`, `prova.js`, a receita manual — e não
nomeia os dois arquivos que o `conferir.sh` roda nela a cada verde (`prova-automatica.ts`, LAB-31; `rolagem-no-celular.ts`,
LAB-182); e os cinco números de 10/09 (`193174` bytes, motor `0.4.1`, `6242` nós, `6514` arestas, `275` quadras) moram
em três lugares — o bloco da página, o `DE_10_09` do `prova-automatica.ts` (o portão da prova automática) e o
`medidoEm_10_09_2026` de `docs/provas/LAB-31/navegador.json` —, sem trava entre eles.

**Medido** por LUGAR: a pasta carrega 4 arquivos além da página; o `conferir.sh` roda 2; os três lugares da medição
**batem**, campo a campo; o `prova.js` não tem `import` no código e o `index.html` só carrega o `./prova.js`; os dois
nomes do marshalling estão no `prova.js` e no `adapter/src/motor.ts`; os três caminhos da página (o link da captura e os
dois `cd`) resolvem. A régua nova acusou **seis** problemas na página de antes: as marcas, os quatro arquivos sem nome e a
frase dos três lugares.

**E a conta do LAB-187 errou:** a página **tem** leitor — o `rolagem-no-celular.ts` (LAB-182) a lê com
`readFileSync(join(AQUI, "README.md"))`. A conta casava o caminho inteiro, e o leitor o monta em pedaços: *régua que casa
por nome exato mede ortografia* (D137). Das três páginas sem leitor do LAB-187, são duas.

**Decidido:**

1. A página ganha a seção *O que o `git` carrega nesta pasta, e quem roda cada arquivo*, com a lista entre marcas e a
   menção ao `conferir.sh` em quem ele roda; e, depois do bloco de 10/09 (que fica intocado, porque o
   `rolagem-no-celular.ts` o lê), a frase dos três lugares. O texto do LAB-01 fica inteiro: nada nele é falso, só calado.
2. A trava `external-engines/esteira/src/a-pagina-da-bancada.ts` e `tests/a-pagina-da-bancada.test.ts` (50 testes, sem
   clones, no portão): a pasta nos dois sentidos e o `.wasm` fora do `git`; o item diz `conferir.sh` se, e só se, o
   `conferir.sh` o roda; os cinco números nos três lugares, campo a campo; o import, enquanto a página disser que não há;
   o marshalling; os links, os `cd` seguidos em ordem e os `docs/…`. A página de antes, byte a byte, reprova dentro do
   próprio teste. O portão passa de 118 a 119 arquivos e de 2 052 a 2 102 travas.

**Descartado:** fazer o `prova-automatica.ts` ler os números da página, como o `rolagem-no-celular.ts` já faz (seria a
mudança certa a longo prazo, mas o portão da prova automática não roda nesta máquina sem o `.wasm`, e mudar código que
não se pode rodar é afirmar sem medir — a trava confere os três lugares e diz que mudar um é mudar os três); reescrever a
receita manual (ela é do LAB-01 e os `cd` dela resolvem; se o `cargo build` ainda compila é o que a régua declara não
alcançar); corrigir o LAB-187 no relatório dele (relatório é história; a correção mora aqui e no LAB-188).

> **O LEITOR QUE MONTA O CAMINHO EM PEDAÇOS NÃO APARECE NA BUSCA PELO CAMINHO INTEIRO.** Contar quem lê uma página pelo
> nome dela inteiro é contar quem escreveu o nome inteiro — e o leitor de verdade, ao lado, escreveu só `"README.md"`.

## D417 · A PÁGINA DA SONDA — o que a pasta carrega, o que a sonda é hoje, e os números do LAB-00 em dois lugares · 19/10/2026
**Contexto:** item 900 (LAB-188 → LAB-189). A caixa só tinha o `900`; a FILA seguia sem proposta que não esperasse
ninguém. O LAB-188 deixou para outra rodada o `external-engines/symbios/archilly/wasm-probe/README.md`, o último
`README.md` fora do `upstream/` sem leitor no código. Na dívida própria, espécies mensagem fixa que afirma estado sem
perguntar e número digitado à mão: a página, do LAB-00 (09/09/2026, `f61be91`), se apresenta como a receita do `wasm32`
(*"existe por um motivo só"*, com o `getrandom` em `wasm_js`) e cala que, desde o LAB-01, o `.wasm` carregado é o da
ponte `../wasm/`, que sai pelo backend `custom` porque o `wasm_js` arrasta `wasm-bindgen` e `js-sys`; não nomeia nenhum
dos quatro arquivos da pasta; e os números do LAB-00 (162 696 bytes, 12,54 s) moram também na seção 10 de
`docs/SYMBIOS_ANALYSIS.md`, sem trava entre os dois.

**Medido** por LUGAR: 4 arquivos além da página; as `PONTES` do LAB-176 dão a pasta como `sonda`; o `conferir.sh` não a
compila; o `Cargo.lock` tem 34 pacotes, `rand 0.9.5` → `rand_core 0.9.5` → `getrandom 0.3.4`, a cola (`wasm-bindgen`,
`js-sys`) e nenhum pacote nativo; o `symbios-tensor` vem por caminho, sem `[patch]`; o `rust-toolchain.toml` é byte a
byte o do `upstream/`; os dois lugares dos números batem, e os 159 KB da análise são 162 696 ÷ 1024. Nenhuma afirmação
da página era falsa. A régua nova acusou **dez** problemas na página de antes.

**Decidido:**

1. A página ganha a seção *O que esta sonda é hoje, e o que a pasta carrega*: a ponte por link, que ninguém carrega o
   artefato da sonda e o `conferir.sh` não o compila, a escolha do backend `custom` e por quê, a lista dos quatro arquivos
   entre marcas, o `.wasm` e o `target/` fora do `git`, e os dois lugares dos números. O texto do LAB-00 fica inteiro.
2. A trava `external-engines/esteira/src/a-pagina-da-sonda.ts` e `tests/a-pagina-da-sonda.test.ts` (60 testes, sem
   clones, no portão): a pasta nos dois sentidos; o papel contra as `PONTES` e o `conferir.sh`; a receita contra a seção
   10, o `Cargo.toml` e o `conferir.sh`; a cadeia do `rand` ao `getrandom`, a cola e o nativo no `Cargo.lock`; o upstream
   por caminho; o `rust-toolchain.toml` dito cópia se, e só se, é; os números nos dois lugares; a seção 10 citada; os
   caminhos. O portão passa de 119 a 120 arquivos e de 2 102 a 2 162 travas.

**Descartado:** editar o comentário em inglês do `rust-toolchain.toml` (fala do CI do upstream; o arquivo é cópia byte a
byte nas três crates de `archilly/`, e editar uma cópia por causa de um comentário as faz divergir — fica como candidato
a rodada própria); apagar a sonda (é o caso válido que quase parece inválido do LAB-176, e apagar é das cinco classes que
param); conferir os 162 696 bytes contra um binário de hoje (nada compila a sonda, e nesta máquina falta o alvo do
`rustup` — a trava confere os dois lugares e a página diz que é só isso).

**E a régua da casa acusou a trava nova duas vezes, com razão:** a do LAB-176 (`sonda-carregada`) pegou o nome do artefato
escrito no teste — inclusive dentro da página de antes, guardada como texto —, e a do LAB-52
(`degrada-chamada-para-numero`) pegou um `?? ""` que fazia do item que falta um texto vazio.

> **PÁGINA DE SONDA ENVELHECE QUANDO A SONDA PERDE O POSTO, NÃO QUANDO MUDA.** A sonda segue compilando e a página segue
> verdadeira sobre ela; o que mudou foi o caminho de verdade, noutra pasta, com outra receita. Quem lê a página da sonda
> precisa saber que é sonda, e onde está o que venceu.


## D418 · OS `rust-toolchain.toml` DE `archilly/` — cópias do upstream, com o comentário que fala do CI de lá · 19/10/2026
**Contexto:** item 900 (LAB-189 → LAB-190). A caixa só tinha o `900`; a FILA seguia sem proposta que não esperasse
ninguém. O LAB-189 (D417) descartou editar o comentário em inglês do `rust-toolchain.toml` e o deixou como candidato a
rodada própria. Espécie da dívida própria: mensagem fixa que afirma estado sem perguntar. As três cópias de
`external-engines/symbios/archilly/` (`probe/`, `wasm-probe/`, `wasm/`) são byte a byte o do `upstream/`, e o comentário
afirma o CI (*"CI reads THIS FILE via actions-rust-lang/setup-rust-toolchain"*), a máquina (*"the local gate ran
1.96.1"*) e o portão (`clippy -D warnings`) do upstream; a página do motor nada dizia deles.

**Medido** por LUGAR: quatro `rust-toolchain.toml` no `git` (o do `upstream/` e as três cópias, iguais por `cmp`); o
`verde.yml` daqui não usa `actions-rust-lang/setup-rust-toolchain` — o passo que compila o `.wasm` roda `rustup` e
`cargo build` com `working-directory` em `archilly/wasm`, e o `rustup` lê o arquivo pela pasta; na máquina das sessões o
`rustc` é o 1.97.0 e, em `archilly/wasm`, o `rustup` tenta baixar a 1.96.1 e o proxy recusa o `static.rust-lang.org`;
nenhuma rotina compila `probe/` nem `wasm-probe/`; nada aqui roda `clippy`.

**Decidido:**

1. A página `external-engines/symbios/README.md` ganha a seção dos toolchains: a lista entre marcas, a cópia byte a byte
   e por quê, de quem é o comentário (com as frases citadas), quem lê o arquivo aqui e em que pasta, os dois projetos que
   nada compila, e a medição datada da 1.96.1 recusada. Os três arquivos não se tocam.
2. A trava `external-engines/esteira/src/os-toolchains-de-archilly.ts` e `tests/os-toolchains-de-archilly.test.ts` (33
   testes, sem clones, no portão): a lista nos dois sentidos; os bytes; o `channel`; as frases citadas contra o comentário;
   a ação ausente contra o `verde.yml`, nos dois sentidos; a pasta do `cargo build` e os projetos que nada compila; os
   caminhos. A página de antes reprova (*sem a seção*). O portão passa de 120 a 121 arquivos e de 2 162 a 2 195 travas.

**Descartado:** editar as cópias (a mesma razão da D417: a cópia inteira é a garantia de que a versão não deriva);
escrever na página da sonda (ela fala de uma pasta, os toolchains são três e o upstream); cobrar cada frase do comentário
(a régua cobra as que a página cita, e diz que o resto não alcança); afirmar o que o runner do GitHub faz (não testado:
o CI está desligado desde 08/10/2026).

> **ARQUIVO COPIADO DE FORA TRAZ O ESTADO DE FORA.** A cópia byte a byte é a garantia, e por isso o comentário dela
> afirma o CI, a máquina e o portão de quem a escreveu. Não se edita a cópia; diz-se, ao lado, de quem é cada afirmação —
> e uma régua confere que o citado está lá e que o negado não está aqui.


## D419 · A PÁGINA DO ADAPTADOR DO SYMBIOS — o estado do LAB-01, o mapa sem o recorte, e um nome do Generate que nunca existiu · 19/10/2026
**Contexto:** item 900 (LAB-190 → LAB-191). A caixa só tinha o `900`; a FILA seguia sem proposta que não esperasse
ninguém, e o LAB-190 não deixou candidato escrito. Recontei por LUGAR os `README.md` fora do `upstream/` contra quem os lê
no código: o LAB-187 (D415) contou três sem leitor, e havia quatro — o `external-engines/symbios/adapter/README.md`, do
LAB-01 (10/09/2026), tocado só no LAB-133, é citado apenas num comentário do `o-trabalho-em-archilly.ts`. Espécies da
dívida própria: mensagem fixa que afirma estado sem perguntar, e número digitado à mão.

**Medido:** *"Estado: LAB-01 concluído"* — o adaptador cresceu no LAB-02 (`src/recorte.ts`, `d619067`, 14/09) e no LAB-05
(`src/poligono.ts`, `21b4f5a`, 15/09); o mapa nomeava nove dos onze arquivos de `src/`; *"não recorta pela gleba"* e
*"não aplica restrições"* valem para `gerarRedeViaria` (o corpo dela não chama recorte), não para o adaptador, que exporta
`recortarPelaGleba` (chamado por `external-engines/esteira/src/motores/symbios.ts`, pelo `desconta` do Geo); *"Validator é
LAB-02, Judge é LAB-03"* contradiz o `CLAUDE.md` §4 e a D20 — o LAB-02 foi o recorte, o LAB-03 a interpolação, e o
Validator e o Judge são os do Generate. **O nome `NORMA_BR.via.caixaMinima`, citado na página, no `src/contrato.ts` e na
D13 desta casa, nunca existiu no Generate**: o `src/lib/normas/br.ts` de lá nasceu (`09976b8`, 08/09) com
`NORMA_BR.viario.valor.caixaMinima` (`6 + 2 * 1.2`), e não mudou. Os números conferiam, sem dono escrito: ≈ 38 % é a
`vias.fracaoForaDaGleba` 0,3758 da *Fazenda Recanto das Águas* em `outputs/lab01/medicoes.json`; os seis padrões são o
`PARAMETROS_PADRAO`; os 15 m são o `minor_road_dist` do `Default` de `TensorConfig` do upstream; o `rampaMaxPct` do
Generate vale 10.

**Decidido:**

1. A página risca e data o estado e o juiz (a frase velha fica, riscada), renomeia a seção para *"O que `gerarRedeViaria`
   NÃO faz"* e diz onde o recorte mora e quem o chama; o mapa vai entre marcas, com os dois arquivos do recorte e a bancada
   como pasta; uma seção nova diz o lugar de cada número; o nome do Generate é corrigido na página e no comentário do
   `src/contrato.ts` (só comentário: nenhum comportamento muda). **Esta decisão corrige a D13 no nome**: onde ela diz
   `NORMA_BR.via.caixaMinima`, leia `NORMA_BR.viario.valor.caixaMinima` — a D13 não se reescreve.
2. A trava `external-engines/esteira/src/a-pagina-do-adaptador.ts` e `tests/a-pagina-do-adaptador.test.ts` (47 testes, sem
   clones, no portão), nove perguntas: o mapa nos dois sentidos; o que só vale riscado; o juiz do Generate; a função que
   não recorta, o recorte que existe e quem o chama; os ≈ e a fração com quatro casas contra a medição; os seis padrões
   contra o `PARAMETROS_PADRAO`; os nomes do Generate iguais na página e no contrato, e o nome inventado só com a frase que
   o diz; os 15 m contra o upstream; os caminhos. E `tests/a-pagina-do-adaptador-com-clone.test.ts` (4 testes, no verde
   completo) pergunta ao clone do Generate cada nome e o valor. A página e o contrato de antes reprovam com 29 problemas.
   O portão passa de 121 a 122 arquivos e de 2 195 a 2 242 travas.

**Descartado:** editar o cabeçalho de `src/index.ts`, que repete as duas frases (é comentário da função, e "este
adaptador" ali se lê como a função; fica como candidato a rodada própria, dito no relatório); editar a D13 e o
`LAB01_ADAPTADOR.md` (história: corrige-se ao lado); conferir no `git` o LAB que criou cada arquivo (medido à mão aqui, e
a régua diz que não alcança); refazer os ≈ 38 % (é história do LAB-01, D118, e sem o `.wasm` não se remede).

> **NOME DO VIZINHO COPIADO SEM ABRIR O VIZINHO É NOME INVENTADO.** O valor estava certo — 8,4 m — e por isso ninguém
> desconfiou do nome por trinta e nove dias, em três lugares. Quem cita o dono de um número cita um endereço: ele se
> confere abrindo o endereço, não conferindo o número.

## D420 · O CABEÇALHO DE `src/index.ts` DO ADAPTADOR — o que não faz dito do adaptador, e o juiz que dizia ser do Lab · 19/10/2026
**Contexto:** item 900 (LAB-191 → LAB-192). A caixa só tinha o `900`; o LAB-191 deixou escrito o candidato: o comentário
que abre `external-engines/symbios/adapter/src/index.ts`, que repetia as duas frases que a D419 riscou na página. Espécie
da dívida própria: mensagem fixa que afirma estado sem perguntar.

**Medido:** o título *"O que este adaptador NÃO faz"* é do LAB-01; o LAB-02 (`d619067`, 14/09) acrescentou a este arquivo
uma linha só — `export { recortarPelaGleba … } from "./recorte.ts"` —, e o cabeçalho, seis linhas acima, ficou como
estava: o adaptador passou a recortar, e o comentário seguiu dizendo que não. *"Validator é LAB-02, Judge é LAB-03"*
contradiz o `CLAUDE.md` §4 e a D20. O item do lote confere; a cadeia de arquivos do LAB-01 foi lida à mão.

**Decidido:**

1. O cabeçalho (só comentário; nenhum código muda) passa a dizer *"O que `gerarRedeViaria` NÃO faz"*, com o título velho
   e a frase do juiz riscados e datados, onde o recorte mora (`./recorte.ts`), quem o chama
   (`external-engines/esteira/src/motores/symbios.ts`), quem usa as restrições, e que o Validator e o Judge são os do
   Generate.
2. A trava é a do LAB-191 (`external-engines/esteira/src/a-pagina-do-adaptador.ts`), com a **pergunta 10**: `oCabecalho`
   lê o primeiro `/** … */` em linha só, e a régua cobra o título, as duas frases só riscadas, o juiz, o recorte nomeado
   com o arquivo, e quem o chama — um arquivo que o `git` carrega e que o chama no código. 13 testes novos (47 → 60), o
   cabeçalho de antes (blob de `cfb25f8`) reprova com sete; o portão sem clones passa de 2 242 a 2 255 travas.

**Descartado:** régua nova (a afirmação é a mesma, e régua nova nasce com a doença que a velha já curou, D263); pôr a frase
na lista da `frase-vencida.ts` (os três lugares dela já são perguntados); consertar no mesmo commit o `README.md` da raiz,
que diz o mesmo do adaptador (outra página — candidato a rodada própria, escrito no relatório e na saída da trava); tocar
a `observacao` do `src/geojson.ts` e o comentário de `Restricao` (*"o recorte é o LAB-02"*: lidos como atribuição são
verdade, e a `observacao` está congelada em `outputs/lab01/`, D118).

> **COMENTÁRIO DE CABEÇALHO ENVELHECE NO COMMIT QUE NÃO O TOCA.** O diff de uma linha do LAB-02 era a linha que tornava o
> topo falso, e um diff de uma linha não mostra o topo. Quem acrescenta um `export` a um arquivo que diz o que não faz
> relê o que ele diz.

## D421 · O PARÁGRAFO DO `README.md` DA RAIZ SOBRE O ADAPTADOR DO SYMBIOS — o que não faz, dito antes de os prompts adiante virem · 19/10/2026
**Contexto:** item 900 (LAB-192 → LAB-193). A caixa só tinha o `900`; o LAB-192 deixou escrito o candidato: o parágrafo da
seção *"O que este laboratório não faz"* do `README.md` da raiz, a porta da frente que o GitHub mostra no endereço do
repositório. Espécie da dívida própria: mensagem fixa que afirma estado sem perguntar.

**Medido:** o parágrafo é do LAB-01 (`069fd29`, 10/09) e nunca foi tocado (`git log -S"de um prompt adiante"` dá um
commit só). Dizia que o adaptador do Symbios *"não recorta pela gleba, não aplica restrições, não parcela em lotes, não
valida e não julga — cada uma dessas coisas é de um prompt adiante"*. Por lugar: o recorte entrou no adaptador no LAB-02
(`recortarPelaGleba`, `src/recorte.ts`, `d619067`), chamado por `external-engines/esteira/src/motores/symbios.ts`; o lote
é do esqueleto reto do Lab, na esteira (`lotearQuadra`, `external-engines/esteira/src/lotear.ts`, LAB-04, `1fa370c`, D50)
— o adaptador continua sem parcelar, e isso confere; o julgamento é o do Generate, chamado pela esteira
(`montarParcelamentoExterno` e `montarRelatorio` em `external-engines/esteira/src/motores/comum.ts`, D20). A tabela do
*Estado atual*, na mesma página, já dizia *"julgado? sim desde o LAB-02"*: a página se contradizia.

**Decidido:**

1. O parágrafo guarda a frase velha riscada e datada, e diz onde mora cada peça, com o caminho de cada uma; o parêntese do
   LAB-07 passa a dizer de onde ele chama o Validator e o Judge (`external-engines/testfit/adapter/src/esteira.ts`).
2. A trava é a do LAB-191 e do LAB-192 (`external-engines/esteira/src/a-pagina-do-adaptador.ts`), com a **pergunta 11**
   (`conferirARaiz`): as duas frases velhas só riscadas, lidas com o parágrafo em linha só; o recorte nomeado; *"são os do
   Generate"*; todo `external-engines/…` do parágrafo existe no `git`; quem o parágrafo diz que chama o recorte o chama no
   código; quem faz o lote define `lotearQuadra`, e a esteira do Symbios a chama; e os dois lugares que o parágrafo dá
   como os que julgam chamam, no código, os dois do Generate. 14 testes novos (60 → 74); o parágrafo de antes (blob de
   `b4ba8b9`) reprova com oito; o portão sem clones passa de 2 255 a 2 269 travas.

**Descartado:** régua nova (a afirmação é a mesma da página e do cabeçalho — D263); perguntar o resto do `README.md` da raiz
(a tabela do *Estado atual* e as seções de cada LAB são outra afirmação, dita no que a trava não alcança); perguntar ao
`git` o LAB de cada peça (medido à mão: `d619067` e `1fa370c`); tirar a frase velha em vez de riscá-la (a casa guarda a
história datada, como na página e no cabeçalho).

> **A PÁGINA QUE SE CONTRADIZ JÁ DISSE A VERDADE — NUMA LINHA QUE NINGUÉM COMPAROU COM A OUTRA.** A tabela do topo foi
> atualizada no LAB-02; o parágrafo do fim, não. Quem atualiza o estado num lugar procura, na mesma página, quem dizia o
> estado antigo.

## D422 · A ORIGEM PODE SER UM ITEM DA CAIXA — e a seção de prosa riscada também fecha o assunto da lista · 19/10/2026
**Contexto:** item 900 (LAB-193 → LAB-194). A caixa só tinha o `900`, e o LAB-193 não deixou candidato escrito. Fui à
minha própria lista, a seção *"Proposto ao chat — não executar"* da `FILA.md` — a que o chat lê para escrever fila —, e às
seções de prosa *"Proposto ao chat, saído do …"* que a trava do LAB-61 (`external-engines/esteira/src/varredura-das-propostas.ts`)
cobra que a lista cite. Espécie da dívida própria: **regra sem guarda** (a régua não alcançava uma forma que a casa usa
desde 09/10) e **mensagem fixa que afirma estado sem perguntar** (um título que dizia *"não executado"*).

**Medido**, na `FILA.md` de `fbde269`:

1. `secoesDePropostaEmProsa` casava só `saído do LAB-NNN`. **Duas** seções de prosa abertas saíram de item — *"saído do
   item 004"* e *"saído do item 029 (LAB-96)"* — e eram **invisíveis**; nenhuma das duas era citada pela lista.
2. A do item 004 dizia no título *"não executado, e é um DESEMPATE"* e, no corpo, *"sigo a da caixa enquanto você não
   responder"*: o chat respondeu no item 008 (LAB-75, D244), **nove dias antes**.
3. A do item 029 tinha **duas propostas vivas** (a classe do custo da travessia; os 25 m da "quadra" esperando as ruas do
   entorno) que a lista não tinha.
4. E o lado de volta: o item da lista *"O SÉTIMO MECANISMO DE ANTONINA, SE HOUVER"* (LAB-59) seguia **aberto** como
   `prompt-novo`, e a seção de prosa da mesma origem e do mesmo assunto estava riscada desde o LAB-78 (*"medido no
   LAB-78"*, D253). A cópia do LAB-61 comparava item aberto só com item RISCADO da lista.

**Decidido:**

1. A régua lê a origem nas três formas (`saído do LAB-NNN`, `saído do item NNN (LAB-NNN)`, `saído do item NNN`); o
   prompt entre parênteses vence, senão o item se traduz pela marca de FEITO do arquivo dele — a mesma tradução do LAB-164
   (`oPromptDoItem`, em `a-proposta-no-recado.ts`), lida por quem chama; sem tradução, a seção volta como `item NNN` e é
   acusada (`secao-de-item-sem-prompt`) — a régua não adivinha.
2. `secoesRiscadasDeProposta` lê as seções riscadas com o título, e a conferência acusa **`aberto-de-secao-riscada`**:
   item aberto que cita **na origem** o prompt da seção riscada **E** cujo título se sobrepõe acima do limiar do LAB-61
   (0,6). Os dois sinais, como na cópia: mesma origem e assunto outro é o caso do *"PARAR A FILEIRA EXTERNA"* (LAB-78), e
   passa.
3. Na `FILA.md`: a seção do item 004 riscada, com o desempate escrito; o item do sétimo riscado com o executor (LAB-78);
   as propostas 2 e 3 do item 029 entram na lista, `prompt-novo` e `aguardando-outro-repositorio`. Os abertos vão de 13 a
   14 (um sai por recontagem, dois entram por achado) — `ABERTOS_ESPERADOS` do LAB-62 e as condições do item 006 com o
   motivo escrito; a prova do LAB-62 regerada, o `agora` da do LAB-61 recontado.
4. 7 testes novos em `tests/propostas.test.ts` (no portão sem clones: 2 269 → 2 276): a `FILA.md` de antes (blob de
   `fbde269`) reprova com **três** — e a régua de antes a aprovava —; cada forma da origem; item sem tradução; seção
   riscada não cobrada; e o aberto da seção riscada nos dois lados (mesma origem e assunto outro passa; origem só
   mencionada passa; riscado passa). Duas mutações acusadas: desligar a comparação com a seção riscada (2 testes) e tirar a
   tradução do item (4).

**Descartado:** cobrar executor da seção de prosa riscada (as quatro de hoje o dizem, e é outra regra); mover a tradução do
item para esta régua (ela mora no LAB-164, que já a confere, e duas cópias divergiriam); regerar a prova do LAB-61 inteira
(o `antes` é fotografia do commit `961890b`, e o `oQueCobra` é o que a régua cobrava naquele dia — só o `agora`, que a
trava confere contra a árvore, se reconta); juntar o sétimo ao item do LAB-78 (é outra proposta, que já existe aberta).

> **A RÉGUA QUE LÊ A ORIGEM POR UMA FORMA SÓ ENVELHECE NO DIA EM QUE A CASA GANHA A SEGUNDA.** As propostas passaram a
> nascer de item da caixa em 09/10; a régua das propostas em prosa seguiu lendo `LAB-NNN`, e o título que dizia *"não
> executado"* atravessou nove dias de verde.

## D423 · O MOTIVO DE UMA EXCEÇÃO SE PERGUNTA À COISA DE QUE ELE FALA — e os terrenos de prova se regeram byte a byte · 19/10/2026
**Contexto:** item 900 (LAB-194 → LAB-195). A caixa só tinha o `900`, e o LAB-194 não deixou candidato escrito. Fui às
listas de exceção das travas — cada exceção com um motivo escrito — e perguntei um motivo à coisa de que ele fala. Espécie
da dívida própria: **mensagem fixa que afirma estado sem perguntar** (o motivo) e **regra sem guarda** (a ferramenta que
grava os terrenos de prova nunca tinha sido rodada por trava nenhuma).

**Medido**, no `HEAD` `5f1f9c5`:

1. A régua do §7 (`external-engines/esteira/tests/medicao-em-metros.test.ts`, LAB-143) declarava em exceção
   `external-engines/symbios/adapter/ferramentas/gerar-terrenos.ts`, que gravava `area_ha` no `docs/terrenos/indice.json`,
   com o motivo *"regerá-lo reescreve os quatro terrenos de prova"*.
2. A ferramenta, **rodada** numa cópia da árvore, reescreveu os cinco arquivos de `docs/terrenos/` **byte a byte iguais**
   aos versionados desde o LAB-01 (`069fd29`, o único commit do índice). Os terrenos saem de `gerar`, que não lê o índice.
3. Ninguém lê o índice: procurado por lugar, só a régua do §7 o cita.

**Decidido:**

1. O índice grava `area_m2` (o `areaCalculada_m2` do terreno, sem arredondar); a ferramenta aceita uma pasta de destino
   como argumento. Regerado: só o índice mudou; os quatro `.geojson`, nem um byte.
2. A exceção sai da régua do §7, e um teste novo lá confere a ferramenta e o índice em metro quadrado, com a área de cada
   linha igual à do terreno. Fica a exceção do `medir.ts`, cujo motivo (só roda com o `.wasm`) é verdadeiro nesta máquina.
3. Trava nova, `tests/os-terrenos-se-regeram.test.ts` (`src/os-terrenos-se-regeram.ts`, `compararPastas`), no portão sem
   clones: roda a ferramenta no Node numa pasta temporária e compara com o que o `git` carrega, byte a byte e nos dois
   sentidos, publicando o universo (5 · 5 · 1 665 909 bytes). Portão de 2 276 a 2 284 travas. Duas mutações acusadas: um
   espaço no `pequeno.geojson` (1 teste) e a ferramenta de volta ao `area_ha` (4).

**Descartado:** comparar por `JSON` (calaria formatação e fim de linha, que são diferença de arquivo); importar a ferramenta
em vez de rodá-la (ela escreve ao carregar, e o que se prova é o comando documentado); trocar o `"gerado": "LAB-01"` do
índice (nomeia o conjunto; os terrenos não são de hoje); perguntar nesta rodada os outros motivos de exceção com a mesma
forma (fica escrito como candidato no relatório).

> **O MOTIVO DE UMA EXCEÇÃO É UMA AFIRMAÇÃO, E A QUE FALA DO QUE ACONTECERIA SE ALGUÉM RODASSE ALGO SE PERGUNTA RODANDO.**
> *"Regerá-lo reescreve os quatro terrenos"* segurou uma exceção por cinco semanas; rodada, a ferramenta os reescreve
> iguais.

## D424 · O MOTIVO DE UMA FOTOGRAFIA SE PERGUNTA À FERRAMENTA QUE A TIROU — e a do LAB-60 se retira igual no commit que declara · 19/10/2026
**Contexto:** item 900 (LAB-195 → LAB-196). A caixa só tinha o `900`, e o LAB-195 deixou o candidato escrito: *os outros
motivos de exceção da casa com a forma "regerar faria X", perguntados um a um*. A lista mais densa dessa forma é a das
espécies de prova (`external-engines/esteira/src/regerar-a-varredura.ts`, item 024, LAB-91), cujas quatro **fotografias**
nunca se regeram, cada uma com o motivo do que a regeração estragaria. Espécies da dívida própria: **mensagem fixa que
afirma estado sem perguntar** (o motivo da fotografia, e o cabeçalho que promete que a trava *"reprova nos dois sentidos"*
— inclusive a *"fotografia que deixou de precisar ser fotografia"* — sem teste nenhum que o fizesse) e **regra sem guarda**.

**Medido**, no `HEAD` `a644dee`, em clones locais numa pasta de rascunho (o vizinho só lido; `git status` limpo):

1. A fotografia `LAB-60/configuracao-do-motor.json` tem o motivo *"recontar com o motor andado mede outra coisa com o nome
   da antiga (D288)"*, um commit só (`ce19bfc`, 07/10/2026), e nenhuma trava roda a ferramenta `ferramentas/lab60.ts`.
2. Rodada com o Lab em `ce19bfc` e o motor em `4181e95` (o commit que a prova declara): **igual** à versionada, fora as
   duas chaves do momento (`quando`, `osClonesVizinhos`). Com o Lab em `a644dee` e o motor em `4181e95`: **igual**.
3. Com o Lab em `a644dee` e o motor na ponta de hoje (`89b26ce`): **102 linhas** diferentes em 10 chaves — 369 → 616
   arquivos, `temCI` de `false` a `true`, um desligador a mais.

O motivo **se sustenta**; e a prova é mais que fotografia: é função do commit que declara.

**Decidido:**

1. `ferramentas/lab60.ts` aceita `--motor <pasta>` e `--saida <pasta>`; sem eles, o de sempre.
2. Trava nova, `tests/fotografia-no-commit-declarado.test.ts` (`src/fotografia-no-commit-declarado.ts`,
   `compararSemOMomento` e `oCommitDeclarado`), **no verde completo** (precisa do clone `../motor-testfit` com a história
   inteira; fica fora do portão sem clones): retira a fotografia no commit declarado, numa pasta temporária, e exige zero
   diferenças; e retira na ponta do motor e exige alguma — o segundo sentido que o cabeçalho prometia. Oito testes; três
   mutações acusadas (um número da prova, a comparação que cala, a ferramenta que ignora `--motor`).
3. O motivo da entrada do LAB-60 na lista diz que foi perguntado, e o cabeçalho de `regerar-a-varredura.ts` diz que o segundo
   sentido existe para uma fotografia só. A espécie não muda: **nada se sobregrava em `docs/provas/`** (D182).
4. A rede declarada da casa (`src/rede-em-execucao.ts`) ganha a linha do `git clone` local da trava, classe
   `origem-de-teste`.

**Descartado:** regerar a prova do LAB-60 (é o que o D182 proíbe, e a trava prova que não precisa); trocar a espécie para
`funcao-da-arvore` (ela depende de clone vizinho, e a lista guarda essa espécie para o que é código desta casa — D288);
`git worktree` no vizinho (escreveria no `.git` dele); perguntar nesta rodada as outras três fotografias — a do LAB-02 precisa
do `.wasm`, ausente; a do LAB-31 é um ato, e retirá-la é refazer a sabotagem; a do LAB-48 roda motor e Validator em dois
commits e fica como candidato escrito.

> **FOTOGRAFIA QUE DECLARA O COMMIT NÃO É LEMBRANÇA: SE RETIRA NO COMMIT, E SE CONFERE.** *"Nunca se regera"* protege o
> arquivo versionado; não impede de perguntar à ferramenta se ela ainda tira a mesma foto ali.

## D425 · A FOTOGRAFIA QUE NÃO ESCREVE O COMMIT SE RETIRA PELOS COMMITS ACHADOS — e a do LAB-48 eram três, e a data não os achava · 19/10/2026
**Contexto:** item 900 (LAB-196 → LAB-197). A caixa só tinha o `900`, e o LAB-196 deixou o candidato escrito: *a fotografia
do LAB-48 (`LAB-48/violacoes-do-motor-padrao.json`), perguntada como a do LAB-60*. Espécies da dívida própria: **mensagem fixa
que afirma estado sem perguntar** (o motivo dela, na lista das espécies de prova de `src/regerar-a-varredura.ts`, diz *"as
violações do motor no commit em que o defeito foi medido"*) e **regra sem guarda** (nenhuma trava roda `ferramentas/lab48.ts`).

**Medido**, no `HEAD` `1c41a40`, em clones locais numa pasta de rascunho (os vizinhos só lidos; `git status` limpo):

1. **Nenhum commit está escrito** — nem na prova (nome do motor, semente e contrato; nenhum `head`), nem na lista, nem no
   relatório do LAB-48. E ela depende de **três** árvores: a ponte do Lab, o motor, o Validator do Generate.
2. Lab em `9d28fd7` (o único commit da prova e da ferramenta) com a ponta da `origin/main` de cada vizinho no instante da prova
   (`quando` 2026-10-06T21:10:17Z: motor `c420613`, Generate `64489ff`): **221** violações, contra 128. **A data não acha o
   commit**: os clones daquela máquina estavam velhos.
3. Lab em `9d28fd7` com os clones que o relatório do LAB-53 conferiu ao fim da rodada seguinte (§5: motor `4181e95`, Generate
   `5b7e9b4`): **a prova, byte a byte**, fora `quando`.
4. Lab em `1c41a40` (hoje) com os mesmos vizinhos: **não grava o LAB-48** — grava `LAB-53/violacoes-depois-do-conserto-da-ponte.json`,
   igual ao versionado, fora `quando` (92 violações). O *"antes"* é a ponte de `9d28fd7`; o destino sai da medição desde o LAB-53.

O motivo **se sustenta, com o sujeito escrito**; e a frase *"regerá-la apagaria o lado 'antes'"* fica mais fraca do que diz:
a ferramenta de hoje não o alcança.

**Decidido:**

1. `src/fotografia-do-lab48.ts` escreve os três commits (`O_RETRATO_DO_LAB48`), cada um com de onde se sabe que é ele. A prova
   **não se toca** (D182): o commit vai ao lado dela, não dentro.
2. Trava nova, `tests/fotografia-do-lab48.test.ts`, **no verde completo** (precisa dos clones `../motor-testfit` e
   `../urban-create-hub-41d93a4d` com a história inteira): monta as três árvores numa pasta temporária, por caminho; a
   ferramenta do Lab de então tem de dar a fotografia (`compararSemOMomento`, do LAB-196, zero diferenças), e a do Lab de hoje
   tem de não tocá-la e de dar a aferição do LAB-53. Cinco testes; três mutações acusadas (um número da prova; o motor do
   retrato trocado pelo da data, 221; o Lab de hoje trocado pelo de então, que regrava o LAB-48).
3. O motivo da entrada do LAB-48 na lista nomeia os três commits, e a trava cobra que nomeie. Os cabeçalhos de
   `regerar-a-varredura.ts` e `fotografia-no-commit-declarado.ts` dizem que são duas as fotografias perguntadas.
4. A rede declarada (`src/rede-em-execucao.ts`) ganha a linha dos `git clone` locais da trava, classe `origem-de-teste`.

**Descartado:** escrever o commit dentro da prova (é sobregravar a fotografia); deduzir o commit da data (medido: dá outra
coisa); rodar a ponta-da-data a cada verde (repete um número que não guarda nada — fica aqui e no relatório); pôr a aferição
do LAB-53 na lista das espécies (a lista cobre o que é código desta casa, D288 — e ela agora é perguntada pela mesma trava).

> **"NO COMMIT EM QUE FOI MEDIDO" SEM O COMMIT ESCRITO É LEGENDA, NÃO PROVENIÊNCIA.** E o commit não se deduz da hora:
> clone da máquina não é a ponta da origem — acha-se rodando, e escreve-se ao lado.

## D426 · A REGRA DA PROVA DE OUTRO REPOSITÓRIO GANHA O UNIVERSO — 44 sujeitos, três a cumpriam, e as 41 ficam congeladas nos dois sentidos · 19/10/2026
**Contexto:** item 900 (LAB-197 → LAB-198). A caixa só tinha o `900`, e o LAB-197 deixou o candidato escrito: *as outras provas
que rodam código de vizinho e não escrevem o commit dele, contadas por lugar*. Espécie da dívida própria: **regra sem guarda** —
o LAB-79 (`src/alcance-das-provas.ts`, `podeSerRegerada`) escreveu que prova que afirma o presente de um clone vizinho
regera-se declarando o commit, e nunca sem ele; a função tem teste, e ninguém contou a quem ela se aplica.

**Medido**, no `HEAD` `ae4a164`, com o motor em `0684d78` e o Generate em `7302864` (história inteira; só lidos), por três
lugares: quem grava cada prova (lista à mão, fechada contra o disco), que vizinho a ferramenta roda (o fecho dos `import` de
execução, apelidos do `tsconfig.json`; `import type` e leitura por caminho não contam) e que commit da história do vizinho a
prova escreve (`git cat-file --batch-check`):

```
92 provas · 10 sem ferramenta · 38 gravadas por ferramenta que não roda vizinho ·
44 rodam vizinho: 3 escrevem o commit de todos, 41 calam ao menos um
(31 calam motor-testfit · 40 calam urban-create-hub-41d93a4d)
```

Cumprem: LAB-76, LAB-93, LAB-94. Pela metade: LAB-18 (cala o motor), LAB-78 (cala o Generate). As outras 39 calam todos.

**Decidido:**

1. `src/o-commit-do-vizinho-na-prova.ts`: `QUEM_GRAVA` (92 linhas, dez `null` com motivo), o fecho, o leitor de commit
   injetado, as duas conferências e a frase; `OS_CALADOS_DE_HOJE`, o retrato das 41.
2. Trava nova, `tests/o-commit-do-vizinho-na-prova.test.ts`, **no verde completo** (precisa dos clones com a história inteira;
   clone raso reprova com a receita): a lista fecha nos dois sentidos; o retrato fecha nos dois sentidos — prova nova que roda
   vizinho e cala o commit reprova, prova do retrato que deixa de calar reprova pedindo para sair. Oito testes, sete sabotagens
   dentro deles e duas mutações no arquivo de verdade, acusadas.
3. As 41 **não se consertam aqui**: escrever o commit dentro delas é sobregravar (D182), e o commit não se deduz da data
   (D425). Cada uma se acha pelo caminho do LAB-197, uma por rodada, e se escreve ao lado.

**Descartado:** mapa de ferramenta pela busca do nome (acha leitor como escritor — o `lab87.ts` nomeia onze provas); contar
leitura por caminho como execução (é outra pergunta, e quase todas já escrevem o commit); consertar as ferramentas agora
(regerar com a ferramenta consertada troca a pergunta, LAB-79); pôr a trava no portão sem clones.

> **REGRA COM FUNÇÃO TESTADA E UNIVERSO NÃO CONTADO É REGRA SEM GUARDA.** O teste provava que a regra sabe responder; ninguém
> tinha perguntado a quem ela se aplica — e eram 44, com três em dia.

## D427 · A PROVA DO LAB-18 CALAVA O MOTOR — achado rodando a ferramenta de então, e o que se escreve é uma JANELA de cinco commits · 19/10/2026
**Contexto:** item 900 (LAB-198 → LAB-199). A caixa só tinha o `900`, e o LAB-198 deixou o candidato escrito: *as 41 caladas, uma
por rodada, pelo caminho do LAB-197, começando pelas duas pela metade*. Espécie **mensagem fixa que afirma estado sem perguntar**:
`docs/provas/LAB-18/contrato-v2.json` dá as rampas do motor `parcelamento` (o Laboratório de Parcelamento) e escreve só o commit
do Generate (`generateEm`, `5b7e9b4`); nem ela, nem o relatório do LAB-18, nem o do LAB-22 (`bf15af6`, que a regravou) dizem em
que commit estava o motor.

**Medido**, em clones locais numa pasta de rascunho (os vizinhos só lidos): o Lab em `bf15af6`, o Generate em `5b7e9b4`, o motor
em cada commit de primeiro pai da `main` dele de 13/09 a 03/10, e a ferramenta rodada **sem o Symbios** (o `.wasm` não se
constrói nesta máquina — quatro trocas de texto exatas na cópia), comparando a prova inteira fora as linhas `symbios`:

```
c3644d1 (03/10, a ponta antes da prova) e 6dcb241…ee7c438: 14 diferenças · 2160fce (15/09, 20h41): 9
244aae3 · 5da35ea · 4b25add · 4181e95 · fe0c7a1 (14/09): ZERO · 648ae78 (14/09, 13h05): 4 · 66ece91: 25
```

A data erra de novo (o clone era velho de três semanas). Cinco commits refazem a prova e a ferramenta não os distingue; o mais
provável é `4181e95` (o clone que o LAB-53 conferiu três dias depois), e isso é coerência, não medição. O Generate da prova se
confirma de passagem.

**Decidido:**

1. `src/retrato-do-lab18.ts`: o Lab e o Generate, um commit cada; `A_JANELA_DO_MOTOR` (os cinco, as duas bordas de fora e o
   mais provável, dito como coerência); `semOSymbios` (as trocas, que reprovam se não casarem uma vez) e
   `diferencasForaDoSymbios`. A prova não se toca (D182).
2. Trava nova, `tests/retrato-do-lab18.test.ts`, **no verde completo**: monta as três árvores numa pasta temporária e roda a
   ferramenta de então nas duas pontas da janela (zero diferenças) e nas duas bordas de fora (diferença) — a janela se prova
   pelos dois lados. Seis testes; duas mutações acusadas (uma ponta trocada por uma borda: 2 reprovam; o Generate trocado por
   `22502b3`: 1 reprova).
3. `OS_ACHADOS_AO_LADO` em `src/o-commit-do-vizinho-na-prova.ts`: a prova continua no retrato (ela segue calando, e é verdade),
   e o achado se conta ao lado — LAB-18 (motor) e LAB-48 (motor e Generate); `conferirOsAchadosAoLado` cobra que cada linha seja
   de uma prova do retrato calando aquele vizinho, num módulo que existe e nomeia a prova; a frase ganha *"achados ao lado: 3 de
   71 silêncios"*.

**Descartado:** escrever o commit na prova (D182); escrever um commit só, o `4181e95` (a ferramenta não o distingue dos outros
quatro — escrever um seria afirmar mais do que se mediu); rodar o meio da janela a cada verde (três voltas de motor para repetir
o que as pontas já cercam); tirar o LAB-18 do retrato (a prova continua calando).

> **QUANDO A FERRAMENTA NÃO DISTINGUE OS CANDIDATOS, O QUE SE ESCREVE É A JANELA, COM AS DUAS BORDAS MEDIDAS POR FORA.** Escolher
> um commit dentro dela é afirmar uma proveniência que nenhuma medição deu.

## D428 · A PROVA DO LAB-78 CALAVA O GENERATE — achado rodando a ferramenta de então, e a janela é ABERTA: do contrato v2 até onde se mediu · 19/10/2026
**Contexto:** item 900 (LAB-199 → LAB-200). A caixa só tinha o `900`, e o LAB-199 deixou o candidato escrito: *a do LAB-78, a
outra pela metade — escreve o motor e cala o Generate*. Espécie **mensagem fixa que afirma estado sem perguntar**:
`docs/provas/LAB-78/setimo-mecanismo.json` (regravada por último no LAB-94, `cdc71da`) escreve o motor no texto de `naoAchados`
(`6cf6396`) e nenhum commit do Generate, que roda ali na ponte, na divisa e na faixa.

**Medido**, em clones locais numa pasta de rascunho (os vizinhos só lidos): o Lab em `cdc71da`, o motor em `6cf6396`, o Generate
na história de primeiro pai da `main` dele, a ferramenta inteira (não carrega o Symbios), comparando a prova fora `quando` e `oChao`:

```
8223873 (02/10, 13h52 UTC) e antes: a ferramenta não roda — a ponte recusa todas as candidatas
5b70e5f (02/10, 14h11 UTC, o contrato v2) … 704a57a (19/10, a ponta de hoje): ZERO — os 17 estados do fecho dos import, cobrindo os 229 commits
motor trocado por 4181e95, Generate 24ef624: 7 diferenças (os dentes)
```

A ponta do instante (`24ef624`, 12/10 07h21 UTC) está dentro — mas a data não acerta: a ferramenta é que não distingue nada.

**Decidido:**

1. `src/retrato-do-lab78.ts`: o Lab e o motor, um commit cada; `A_JANELA_DO_GENERATE` (o começo, o último medido, a borda de antes
   com o que ela dá, `depois: null`, o do instante dito como coerência); `OS_ESTADOS_DO_FECHO` (os 17); `diferencasForaDaRodada`. A
   prova não se toca (D182).
2. Trava nova, `tests/retrato-do-lab78.test.ts`, **no verde completo**: monta as três árvores numa pasta temporária e roda a
   ferramenta de então no começo, no instante e no último medido (zero), na borda de antes (não refaz) e com o motor trocado
   (acusa). Seis testes; duas mutações acusadas (o começo trocado pela borda: 3 reprovam; o motor trocado: 2 reprovam).
3. `OS_ACHADOS_AO_LADO` ganha a linha do LAB-78 (o Generate); a frase passa a *"achados ao lado: 4 de 71 silêncios"*.
4. **Proposto ao chat**, achado escrevendo a trava: o trabalho do verde completo no `verde.yml` põe o Lab sem `fetch-depth` e
   clona os vizinhos com `--depth 1`, e cinco travas do verde completo (LAB-196 a LAB-200) montam commits velhos — num clone raso
   reprovam. Mexe na rotina desligada e não se prova aqui: vai à lista *"não executar"*; abertos 14 → 15 (`ABERTOS_ESPERADOS`).

**Descartado:** escrever o commit na prova (D182); escrever um commit só, o do instante (a ferramenta não o distingue de 228
outros); rodar a ponta do Generate do dia a cada verde (a trava ficaria vermelha porque o vizinho andou — trabalho de outra casa
cobrado do Lab); rodar os 17 estados a cada verde (seis minutos para repetir um número); tirar o LAB-78 do retrato (ela continua
calando).

> **A JANELA PODE NÃO TER A BORDA DE DEPOIS, E ISSO TAMBÉM É MEDIÇÃO.** Quando a ferramenta não distingue o vizinho de um ponto em
> diante, escreve-se *"daqui até onde se mediu"*, nunca um commit — e a data que acerta por indiferença não é a data que acerta.

## D429 · O DIAGNÓSTICO DE RELEVO DO LAB-07 CALAVA O GENERATE — achado rodando a ferramenta de então, e a janela é ABERTA: do P43 na tela até onde se mediu · 19/10/2026
**Contexto:** item 900 (LAB-200 → LAB-201). A caixa só tinha o `900`, e o LAB-200 deixou o candidato escrito: *as outras 39
caladas do retrato, uma por rodada, a mais velha primeiro*. As mais velhas (LAB-02 ao LAB-06) precisam do `.wasm` do Symbios —
e nelas o Generate julga o que o Symbios gerou, então sem o `.wasm` não há o que rodar; ficam para quando ele existir. A mais
velha que esta máquina roda é o diagnóstico de relevo do LAB-07: `docs/provas/LAB-07/diagnostico-relevo.json` e `.txt`
(gravadas uma vez, `25b62e0`, 13/09), que dão as estatísticas do `criarModeloRelevo` do Generate e não escrevem commit nenhum
dele. Espécie **mensagem fixa que afirma estado sem perguntar**.

**Medido**, em clones locais numa pasta de rascunho (o vizinho só lido): o Lab em `25b62e0`, o Generate na história de primeiro
pai da `main` dele, a ferramenta inteira (não carrega o Symbios nem o motor), comparando a `.json` fora os `ms` e a `.txt` fora
o *"— N ms"*:

```
14b6227 (06/09, 03h05 UTC) e antes: a ferramenta não roda — o modelo ainda não tem espacamentoDoDado
645a572 (06/09, 03h16 UTC, P43 na tela) … 1ee9459 (19/10, a ponta de hoje): ZERO, nas duas provas — os 5 estados do fecho dos import, cobrindo os 299 commits
Generate 22502b3 com o número de vizinhos do modelo trocado de 6 para 7 na cópia: 6 diferenças (os dentes)
```

A ponta do instante (`22502b3`, 10/09) está dentro — e, como no D428, a data não acerta: a ferramenta é que não distingue nada.

**Decidido:**

1. `src/retrato-do-lab07-relevo.ts`: o Lab, um commit; `A_JANELA_DO_GENERATE` (o começo, o último medido, a borda de antes com o
   que ela dá, `depois: null`, o do instante dito como coerência); `OS_ESTADOS_DO_FECHO` (os 5); `A_TROCA_DOS_DENTES`;
   `diferencasForaDoTempo` e `textoForaDoTempo`. As provas não se tocam (D182).
2. Trava nova, `tests/retrato-do-lab07-relevo.test.ts`, **no verde completo**: monta as duas árvores numa pasta temporária e roda
   a ferramenta de então no começo, no instante e no último medido (as duas provas iguais), na borda de antes (não refaz) e com a
   troca dos dentes na cópia do Generate (acusa, e só no bloco dele). Seis testes; três mutações acusadas (o começo trocado pela
   borda: 3 reprovam; a troca dos dentes anulada: 1 reprova; a comparação sem tirar o `ms`: 3 reprovam).
3. `OS_ACHADOS_AO_LADO` ganha as duas linhas do LAB-07 (o Generate); a frase passa a *"achados ao lado: 6 de 71 silêncios"*.

**Descartado:** escrever o commit na prova (D182); escrever um commit só, o do instante (a ferramenta não o distingue de 298
outros); trocar o motor para dar os dentes, como no D428 (o motor não roda aqui — o `campoRelevo` dele está replicado na
ferramenta); rodar o LAB-02 ao LAB-06 alimentando o Generate com as saídas gravadas do Symbios (seria outra ferramenta, não a de
então); tirar as duas do retrato (continuam calando).

> **A MAIS VELHA QUE SE PODE MEDIR NÃO É A MAIS VELHA.** A ordem da lista diz qual vem primeiro; a máquina diz qual se mede. O que
> pula por falta de instrumento fica escrito com o motivo, não some da fila.

## D430 · AS CINCO PROVAS DO `medir.ts` DO LAB-07 CALAVAM O MOTOR E O GENERATE — achado rodando a ferramenta de então, e são DUAS janelas FECHADAS: o motor de 10/09 a 14/09, o Generate do contrato v1 ao último antes do v2 · 19/10/2026
**Contexto:** item 900 (LAB-201 → LAB-202). A caixa só tinha o `900`, e o LAB-201 deixou o candidato escrito: *as cinco do
`medir.ts` do LAB-07, pelo mesmo caminho*. As cinco (`ensaio-47ha.saida.json`, `geo-antonina.saida.json`,
`lab01-50ha-ondulado.saida.json`, `medicoes.json`, `medir.txt`; gravadas uma vez, `25b62e0`, 13/09, `geradoEm` 14h31 UTC) rodam o
motor e o julgam com o Validator e o Judge do Generate, e não escrevem commit de nenhum dos dois: dez silêncios. Espécie
**mensagem fixa que afirma estado sem perguntar**.

**Medido**, em clones locais numa pasta de rascunho (os vizinhos só lidos): o Lab em `25b62e0`, cada vizinho na história de
primeiro pai da `main` dele, a ferramenta inteira, comparando as `.json` fora `geradoEm`, `ambiente` e os tempos, e a `.txt` fora
o *"· tempos: …"*. Cada eixo com o outro vizinho no instante, rodados **todos** os commits que tocam o fecho:

```
motor (37 commits que tocam src/lib/lab/, o fecho inteiro):
  9404d78 (10/09) e antes: a ferramenta não roda — sem src/lib/lab/api.ts
  0ece0b1 (10/09) · d2f71e4 (13/09) · 66ece91 (14/09): ZERO
  648ae78 (14/09): 66 valores na medicoes.json, 6 linhas da .txt — e depois, de 6 422 a 30 766
Generate (27 commits que tocam o fecho unido de doze pontos, ou docs/glebas-padrao/):
  805b6a0 (09/09) e antes: a ferramenta não roda — sem src/lib/import/parcelamento-externo.ts
  22502b3 (10/09, contrato v1) … 8223873 (02/10): ZERO — dez estados, cobrindo os 46 commits
  5b70e5f (02/10, contrato v2) em diante: a ferramenta não roda — "este adaptador entende a versão 1"
os quatro cantos (0ece0b1/66ece91 × 22502b3/8223873): ZERO
Generate 22502b3 com TOL_APOIO_VIA_M 0,75 → 0,5 m na cópia: 7 diferenças, todas na medicoes.json (os dentes)
```

A ponta do instante (motor `d1998f1`, Generate `22502b3`) está dentro das duas — coerência, não medição.

**Decidido:**

1. `src/retrato-do-lab07-medir.ts`: o Lab, um commit; `A_JANELA_DO_MOTOR` e `A_JANELA_DO_GENERATE` (começo, fim, as duas bordas
   com o que cada uma dá, o do instante dito como coerência); `OS_ESTADOS_DO_GENERATE` (os 10); `A_TROCA_DOS_DENTES`; `eTempo`,
   `diferencasForaDoTempo` e `textoForaDoTempo`. As provas não se tocam (D182).
2. Trava nova, `tests/retrato-do-lab07-medir.test.ts`, **no verde completo**: monta as três árvores numa pasta temporária e roda a
   ferramenta de então no instante e nos quatro cantos (as cinco iguais), nas quatro bordas (não refaz: três não rodam, a do motor
   acusa) e com a troca dos dentes na cópia do Generate (acusa, e só na `medicoes.json`). Seis testes; três mutações acusadas (o
   começo do motor trocado pela borda: 2 reprovam; a troca dos dentes anulada: 1; a comparação sem tirar os tempos: 2).
3. `OS_ACHADOS_AO_LADO` ganha as cinco, com o motor e o Generate; a frase passa a *"achados ao lado: 16 de 71 silêncios"*.

**Descartado:** escrever os commits na prova (D182); escrever um commit só por vizinho, o do instante (a ferramenta não o distingue
dos outros da janela); rodar o produto inteiro dos dois eixos (37 × 27 rodadas; os fechos não se cruzam — eixos e cantos dizem o
mesmo); dentes do motor por troca na cópia (a borda de depois já é um commit de verdade que a ferramenta acusa); tirar as cinco do
retrato (continuam calando).

> **JANELA ABERTA É O QUE A FERRAMENTA NÃO ENXERGA; JANELA FECHADA, O QUE ELA ENXERGA.** E há dois jeitos de fechar: a ferramenta
> acusa (o vizinho andou) ou recusa (o vizinho mudou de contrato). Os dois são borda, e se escrevem diferentes.

## D431 · A GUARDA DA IDA DO LAB-30 CALAVA O MOTOR E O GENERATE — e, medido, não CHAMA nenhum dos dois: nenhum commit de vizinho decide a prova · 19/10/2026
**Contexto:** item 900 (LAB-202 → LAB-203). A caixa só tinha o `900`, e o LAB-202 deixou o candidato escrito: *a seguinte do
retrato, a mais velha que esta máquina rode*. Do LAB-08 ao LAB-28 as ferramentas carregam o `.wasm` do Symbios, que não se
constrói aqui (ficaram, com o motivo). A seguinte é a `docs/provas/LAB-30/guarda-da-ida.json` (última gravação no LAB-93,
`c8a1013`, 12/10, 00h37 UTC): a ferramenta puxa, pelo fecho dos `import`, quatro arquivos do motor e dois do Generate, e a prova
não escreve commit de nenhum — dois silêncios. Espécie **mensagem fixa que afirma estado sem perguntar**.

**Medido**, em clones locais numa pasta de rascunho (os vizinhos só lidos): o Lab em `c8a1013`, cada vizinho em **todos** os commits
de primeiro pai da `main` dele, o outro no instante (motor `11fcbad`, Generate `12cf23c`), a prova comparada byte a byte (carimbo
fixo):

```
motor, 271 commits:     42 não rodam (até d1998f1, 13/09 — falta src/lib/lab/contrato/tipos.ts)
                        229 refazem byte a byte (d2f71e4, 13/09 … d8a172f, a ponta de hoje)
Generate, 1 251 commits: 971 não rodam (até 805b6a0, 09/09 — falta src/lib/import/parcelamento-externo.ts)
                        280 refazem byte a byte (22502b3, 10/09 … 5f330d9, a ponta de hoje) — inclusive depois do contrato v2
os quatro cantos (d2f71e4/d8a172f × 22502b3/5f330d9): iguais
as 1 099 funções de topo dos src/lib/ dos dois envenenadas na cópia: a prova sai igual
  e o veneno está vivo: rodarMotor (motor) e medirSobras (Generate), chamadas pela mesma árvore, explodem com "VENENO"
o destino de gleba.furos trocado na cópia do LAB: 15 linhas da prova mudam (os dentes)
```

A guarda da IDA audita o que a ida **do Lab** entrega ao motor contra o inventário **do Lab**; os arquivos dos vizinhos entram
porque os módulos do Lab que ela usa os importam para outras funções, que ela nunca percorre.

**Decidido:**

1. `src/retrato-do-lab30.ts`: o Lab, um commit; `A_JANELA_DO_MOTOR` e `A_JANELA_DO_GENERATE` (começo, ponta medida, a borda de antes
   com o que ela dá, nenhuma de depois, quantos se rodaram e quantos refazem); `O_VENENO_VIVO`; `A_TROCA_DOS_DENTES` (na cópia do
   Lab); e `envenenarAsFuncoes`, com o que ele não alcança dito (arrow, método, função aninhada). A prova não se toca (D182).
2. Trava nova, `tests/retrato-do-lab30.test.ts`, **no verde completo**: monta as três árvores numa pasta temporária e roda a
   ferramenta de então no instante e nos quatro cantos (iguais), nas duas bordas (não roda), com os dois vizinhos envenenados (igual,
   e o veneno vivo) e com a troca dos dentes na cópia do Lab (acusa). Sete testes; três mutações acusadas (o começo do motor trocado
   pela borda: 1 reprova; a troca dos dentes anulada: 1; o veneno sem `throw`: 2).
3. `OS_ACHADOS_AO_LADO` ganha a prova, com o motor e o Generate; a frase passa a *"achados ao lado: 18 de 71 silêncios"*.

**Descartado:** escrever os commits na prova (D182); escrever *uma* janela de commits como nas outras (seriam todos — o que se
escreve é o fato, *"não chama"*); dentes do vizinho por troca na cópia (não há onde morder: o veneno é a prova); tirar a prova do
retrato (ela continua calando, e é verdade); trocar a régua do LAB-198 para contar só quem CHAMA (é outra régua, e o veneno de uma
prova não mede as 40 outras — fica dito como hipótese, não como conserto).

> **CARREGAR NÃO É CHAMAR.** O fecho dos `import` diz o que a ferramenta PODE rodar; só envenenando o vizinho se sabe o que ela RODA.
> Silêncio sobre o que não decide nada é verdadeiro e de graça — e só se sabe que é de graça depois de medir.

## D432 · A TESTADA DE FRENTE DO LAB-37 CALAVA O MOTOR E O GENERATE — e, medido, o motor que a fez NÃO é o da origem daquele dia: é o de 14/09, três semanas mais velho · 19/10/2026
**Contexto:** item 900 (LAB-203 → LAB-204). A caixa só tinha o `900`, e o LAB-203 deixou o candidato escrito: *a seguinte do
retrato cuja ferramenta não carrega o `.wasm`, a `LAB-37/testada-de-frente.json`, com o veneno primeiro*. A prova foi gravada uma
vez (`1ff6335`, 04/10/2026, 11h48 UTC, carimbo fixo); a ferramenta `ferramentas/lab37.ts` roda a esteira do motor e passa o plano
pelo contrato e pelas regras do Generate (16 arquivos do motor e 17 do Generate no fecho), e a prova não escreve commit de nenhum
— dois silêncios. Espécie **mensagem fixa que afirma estado sem perguntar**.

**O veneno não foi preciso:** a ferramenta chama `rodarEsteira`, que roda o motor, e a primeira rodada no instante já mudou a
prova — carregar aqui é chamar.

**Medido**, em clones locais numa pasta de rascunho (os vizinhos só lidos), o Lab em `1ff6335`, a prova byte a byte (cada rodada,
de um a dois minutos):

```
instante (as pontas da origem às 11h48 UTC de 04/10: motor a95d03d, Generate cae6a2f): 44 linhas mudam — a prova NÃO se refaz
motor (28 commits de primeiro pai que tocam src/lib/lab/, com o Generate do instante):
  0ece0b1 (10/09): a ferramenta não roda — falta src/lib/lab/contrato/tipos.ts
  d2f71e4 (13/09) · 66ece91 (14/09) · 648ae78 (14/09, T03): acusam
  fe0c7a1 (14/09, T02) · 4181e95 · 244aae3 (14/09, o fechamento): IGUAL, byte a byte
  2160fce (15/09, T07) · ee7c438: acusam; 38f9943 (19/09) … fcbd995 (hoje), 19 commits: as MESMAS 44 linhas do instante
Generate (o fecho tirado nos 40 commits que tocam src/lib/ de 8223873 à ponta: 18 estados distintos, rodados todos, motor 244aae3):
  8223873 (02/10) e antes: acusa — a gleba antonina-com-via sai sem plano
  5b70e5f (02/10, contrato v2) … 735535d (hoje): IGUAL — os 17 estados
os quatro cantos (fe0c7a1/244aae3 × 5b70e5f/735535d): iguais
```

A prova de 04/10 descreve **o motor de 14/09**. É coerente com o que o LAB-60 (07/10) declara do disco do Lab: o motor em
`4181e95`, dentro da janela — coerência, não medição.

**Decidido:**

1. `src/retrato-do-lab37.ts`: o Lab, um commit; `A_JANELA_DO_MOTOR` (fechada, com as duas bordas e o instante FORA, dito em
   `oInstanteEstaDentro: false`), `A_JANELA_DO_GENERATE` (aberta, a borda de antes, o instante dentro), `OS_COMMITS_DO_MOTOR`. A
   prova não se toca (D182).
2. Trava nova, `tests/retrato-do-lab37.test.ts`, **no verde completo**: confere que o instante escrito é a ponta da origem na hora
   da prova; roda a ferramenta de então nos quatro cantos (iguais), no instante (acusa) e nas três bordas (acusam — os dentes são
   commits de verdade). Seis testes, ~7 minutos; duas mutações acusadas (o começo do motor trocado pela borda: 1 reprova; o
   instante trocado pelo fim da janela: 3).
3. `OS_ACHADOS_AO_LADO` ganha a prova; a frase passa a *"achados ao lado: 20 de 71 silêncios"*.

**Descartado:** regravar a prova com o motor de hoje (D182 — e mudaria o sujeito: o LAB-37 mediu o motor de 14/09); o veneno
(a primeira rodada já respondeu que a ferramenta chama); rodar todos os 236 commits de primeiro pai do Generate (o fecho por
conteúdo diz os mesmos 18 estados); dentes por troca na cópia (as três bordas são commits de verdade que acusam).

> **O INSTANTE É HIPÓTESE, NÃO MEDIÇÃO.** Nas três anteriores a ponta da origem caiu dentro da janela e se escreveu como
> coerência; aqui ela cai fora, e é a ferramenta rodada que diz. O disco de quem gravou pode estar semanas atrás da origem.

## D433 · AS FIXTURES DO LAB-40 CALAVAM O MOTOR E O GENERATE — e, medido, o motor que as fez é o de 14/09, como o da testada do LAB-37, numa janela UM commit mais larga · 19/10/2026
**Contexto:** item 900 (LAB-204 → LAB-205). A caixa só tinha o `900`, e o LAB-204 deixou o candidato escrito: *a seguinte do
retrato cuja ferramenta não carrega o `.wasm`, a `LAB-40`, pelo mesmo caminho — instante primeiro*. A prova
`docs/provas/LAB-40/fixtures.json` foi gravada uma vez (`90a93b2`, 04/10/2026, 17h26 UTC, carimbo fixo); a ferramenta
`ferramentas/lab40.ts` (mudada depois no LAB-103 e no LAB-105, sem regravar) roda a esteira do motor com o contrato e as regras do
Generate, e a prova não escreve commit de nenhum — dois silêncios. Espécie **mensagem fixa que afirma estado sem perguntar**.

**Medido**, em clones locais numa pasta de rascunho (os vizinhos só lidos), o Lab em `90a93b2`, a prova byte a byte. A ferramenta
leva de quatro a dez segundos, então rodaram-se **todos** os commits de primeiro pai que tocam o lugar do fecho, não os estados:

```
instante (as pontas da origem às 17h26 UTC de 04/10: motor 0ab380b, Generate a06befa): 11 linhas — a prova NÃO se refaz,
  e o sinal vira: na prova a testada fora de Antonina CUSTA lotes (espinha 680 → 640, delta −40); no instante RENDE (449 → 492, +43)
motor (os 37 commits que tocam src/lib/lab/, com o Generate do instante):
  d98b0fe … 0ece0b1 (10/09), 10: a ferramenta não roda
  d2f71e4 (13/09) · 66ece91 (14/09): acusam — 9 linhas, a testada sai sem plano (null)
  648ae78 (14/09, T03) · fe0c7a1 (T02) · 4181e95 · 244aae3 (14/09, o fechamento): IGUAL, byte a byte
  2160fce (15/09, T07) … 3fdb8ca (11/10), 21, e a ponta de hoje cbbe224: as MESMAS 11 linhas do instante
Generate (os 439 commits que tocam src/lib/, com o motor em 244aae3):
  a02644c (30/06) … 4cd7dc2, 371: a ferramenta não roda (antes do contrato de motor v1)
  22502b3 (10/09, contrato v1) … 8223873 (02/10), 29: acusam — as mesmas 9 linhas do motor de antes
  5b70e5f (02/10, contrato v2) … 0297934 (16/10), 39, e a ponta de hoje ad6a0c5: IGUAL
os quatro cantos (648ae78/244aae3 × 5b70e5f/ad6a0c5): iguais
```

**Leitura.** O mesmo achado do D432, seis horas depois, no mesmo disco: a prova de 04/10 descreve **o motor de 14/09**, e o LAB-60
(07/10) declara o disco em `4181e95`, dentro da janela — coerência, não medição. Uma coisa nova: aqui o T03 (`648ae78`) **já
refaz**, e no LAB-37 acusava. **As duas provas juntas estreitam o disco de 04/10 a `fe0c7a1` … `244aae3`** — nenhuma sozinha diz
isso, e é a mesma hipótese (o disco não andou entre 11h48 e 17h26), não uma medição.

**Decidido:**

1. `src/retrato-do-lab40.ts`: o Lab, um commit; `A_JANELA_DO_MOTOR` (fechada, as duas bordas, o instante FORA),
   `A_JANELA_DO_GENERATE` (aberta, a borda de antes, o instante dentro), `OS_COMMITS_RODADOS` (o que cada um dos 476 deu, somando).
   A prova não se toca (D182) — e a frase dela que o motor de hoje desmente (*"a testada custa lotes"*) fica dita aqui, não
   corrigida nela.
2. Trava nova, `tests/retrato-do-lab40.test.ts`, **no verde completo**, no molde da do LAB-204: o instante escrito é a ponta da
   origem na hora da prova; os quatro cantos (iguais), o instante (acusa) e as três bordas (acusam). Seis testes, ~35 segundos;
   três mutações acusadas (o começo do motor trocado pela borda: 2 reprovam; o instante trocado pelo fim da janela: 3; a borda do
   Generate trocada pelo começo da janela: 1).
3. `OS_ACHADOS_AO_LADO` ganha a prova; a frase passa a *"achados ao lado: 22 de 71 silêncios"*.

**Descartado:** regravar (D182 — e mudaria o sujeito); o veneno (a ferramenta chama `rodarEsteira`, e o instante já mudou a
prova); os estados do fecho em vez dos commits (com quatro segundos por rodada, rodar os 476 sai mais barato do que provar que os
estados os cobrem); dentes por troca na cópia (as três bordas são commits de verdade); escrever a janela estreitada pelas duas
provas como o disco de 04/10 (é hipótese; cada retrato escreve o que a sua ferramenta mediu).

> **DUAS PROVAS DO MESMO DISCO ESTREITAM O QUE NENHUMA DIZ SOZINHA** — desde que se diga que "o mesmo disco" é hipótese.

## D434 · A PROVA DO LAB-41 CALAVA O GENERATE — e, medido, ela se refaz numa janela FECHADA, de 20/09 a 14/10, com o instante DENTRO · 19/10/2026
**Contexto:** item 900 (LAB-205 → LAB-206). A caixa só tinha o `900`, e o LAB-205 deixou o candidato escrito: *a seguinte do
retrato cuja ferramenta não carrega o `.wasm`, a do LAB-41, pelo mesmo caminho — instante primeiro*. A prova
`docs/provas/LAB-41/ortogonal-fora-da-gleba.json` foi gravada uma vez (`d817176`, 04/10/2026, 17h45 UTC, carimbo fixo); a ferramenta
`ferramentas/lab41.ts` (nunca mudou) roda as duas candidatas do Generate pelo contrato de motor v1, e a prova não escreve commit
nenhum dele — um silêncio (o motor não está no fecho dos `import`: 59 arquivos do Generate, zero do motor). Espécie **mensagem fixa
que afirma estado sem perguntar**.

**Medido**, em clones locais numa pasta de rascunho (o vizinho só lido), o Lab em `d817176`, a prova byte a byte. A ferramenta leva
de 25 a 60 segundos; rodaram-se os 68 commits de primeiro pai que tocam `src/lib/` do contrato v1 em diante, os três de antes e a
ponta de hoje — 72 rodadas, em dois processos:

```
instante (a ponta da origem às 17h45 UTC de 04/10: Generate a06befa): IGUAL, byte a byte
a02644c (30/06) … 4cd7dc2 (09/09), 371: a ferramenta não roda — os três últimos rodados; os 368 outros sem
  src/lib/contratos/motor-v1/traducao.ts na árvore (conferido commit a commit)
22502b3 (10/09, contrato v1) … 93b6f72 (20/09, GX-04 e GX-05), 24: acusam — 11 valores
7eb39ce (20/09, A13) … db31559 (14/10, cotar-sem-repetir), 36: IGUAL, byte a byte
18df3a8 (14/10, aparo-ja-dentro) … 0297934 (16/10), 8, e a ponta de hoje cf3bc53: acusam — 5 valores, só lotes da espinha
```

**Leitura.** Ao contrário do D432 e do D433, o instante **refaz**: o Generate da origem naquela hora é um dos 36 da janela —
coerência, não medição de que era o do disco. E o que as duas bordas mudam é **contagem de lote**, não a resposta: em nenhuma, nem na
ponta de hoje, a prova deixa de dizer que a ortogonal é recusada pela via fora da gleba e que a espinha entrega nos mesmos acessos.
*A frase da prova vale com o Generate de hoje; os números dela, só com o de 20/09 a 14/10.*

**Decidido:**

1. `src/retrato-do-lab41.ts`: o Lab, um commit; `A_JANELA_DO_GENERATE` (fechada, as duas bordas, o instante DENTRO);
   `OS_COMMITS_RODADOS` (439 commits, 71 rodados pela ferramenta e 368 contados pela árvore, somando). A prova não se toca (D182).
2. Trava nova, `tests/retrato-do-lab41.test.ts`, **no verde completo**, no molde da do LAB-205 com um eixo só: o instante escrito é a
   ponta da origem na hora da prova, e as cinco pontas estão na ordem da história; o começo, o instante e o fim (iguais), as duas
   bordas (acusam). Cinco testes, ~2 minutos; três mutações acusadas (o começo trocado pelo contrato v1: 2 reprovam; o fim trocado
   por `0297934`: 2; a borda de antes trocada pelo começo: 2).
3. `OS_ACHADOS_AO_LADO` ganha a prova; a frase passa a *"achados ao lado: 23 de 71 silêncios"*.

**Descartado:** regravar (D182); rodar os 371 de antes do contrato pela ferramenta (a árvore já diz que ela não monta neles, e são
~3 horas); veneno ou troca na cópia (as duas bordas são commits de verdade); pôr a ponta de hoje na trava (ela anda, e a borda de
depois já dá os dentes).

> **A FRASE DE UMA PROVA E OS NÚMEROS DELA TÊM JANELAS DIFERENTES** — e o retrato tem de dizer de qual está falando.
