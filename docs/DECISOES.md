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
