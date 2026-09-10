# Decisões do Archilly Lab

**O que este arquivo é:** as decisões tomadas dentro do laboratório que alguém,
meses depois, vai querer saber por quê. Uma decisão sem motivo escrito é uma
decisão que será desfeita por engano.

Não entra aqui: o estado da fila (`docs/FILA.md`), o ponto de parada
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
