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

**Medido:** esse trabalho lista `tests/commit-dos-vizinhos.test.ts`, e **duas travas desse arquivo
exigem o clone do `motor-testfit` no disco** — uma **desde o LAB-68** (*"o clone do motor tem de
estar nesta máquina para esta demonstração"*, conferida em `git show HEAD:`, anterior a esta
rodada) e **uma minha, desta rodada**. Sem o clone as duas reprovam, e o trabalho que existe
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
