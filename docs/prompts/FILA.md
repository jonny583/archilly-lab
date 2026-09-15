# FILA DO ARCHILLY LAB

**Esta é a fila oficial deste repositório.** Escrita pelo Claude do chat
(diretor da família) em 14/09/2026 e gravada aqui como fila autônoma: o Lab
trabalha sozinho, em laço, sem esperar mensagem do chat.

**Ao acordar:** `docs/ONDE_PARAMOS.md` → `git log` → esta fila.

---

## Como esta fila funciona

- **Um despertador**, a cada 60 minutos, preso a este repositório
  (minuto :05 — o id fica em [`../ONDE_PARAMOS.md`](../ONDE_PARAMOS.md)). Regra de família: **um por
  aplicativo; nunca se toca no despertador de outro repositório.**
- A cada despertador: pegar o **primeiro** prompt "pronto" cuja condição esteja
  cumprida, executá-lo **inteiro** (testes verdes, PR mesclado na `main`,
  `ONDE_PARAMOS` e `INDEX` atualizados, relatório em `docs/relatorios/`),
  terminar com o RECADO PARA O CHAT e **acrescentá-lo a**
  [`../relatorios/RECADOS.md`](../relatorios/RECADOS.md). **Um prompt por
  despertador.**
- O que depende do Jonny ou de outro repositório fica **"aguardando"**: pular
  para o seguinte e reavaliar a cada despertador.
- **Prompt fora desta lista não existe.** O que faltar entra aqui como
  *"proposto ao chat"*, sem executar. Não ampliar escopo.
- **Nunca tocar em outro repositório** — clone só para leitura quando um prompt
  mandar. Os achados para o Generate e para o Laboratório de Parcelamento vão
  **pelo chat**, não por commit lá.
- Toda conferência confere também `INDEX` e `ONDE_PARAMOS`.
- Fila esgotada: gravar o recado acumulado, escrever em `ONDE_PARAMOS` *"fila
  esgotada, aguardando o chat"* e **apagar o despertador**.

**Regras que nunca mudam:** o Lab **não tem Validator próprio** — julga sempre
com o Validator e o Judge do Generate; medições **em metros** e **em dados**
(JSON em `docs/provas/`), com gleba, motor, semente e versão do contrato;
determinismo provado; **nada de regra urbanística inventada** — regra nova é
*"proposto ao chat"*.

---

## O quadro — a fila de 15/09/2026

Escrita pelo chat depois que a fila de 14/09 esgotou.

| # | prompt | estado | condição |
|---|---|---|---|
| **LAB-04** | Straight skeleton: subdividir as quadras do Symbios em lotes e disputar o Judge | ✅ **concluído em 15/09/2026** | nenhuma |
| **LAB-05** | Reconectar a rede, recortar quadra que atravessa, descartar lasca pela regra | ⬜ **pronto — é o próximo** | LAB-04 mesclado ✅ |
| **LF-FINAL-2** | Conferência e docs | ⬜ | LAB-05 mesclado |

---

## Os prompts da fila de 15/09, por extenso

### LAB-04 · Straight skeleton — ✅ concluído em 15/09/2026

**Condição:** nenhuma.
**Escopo:** subdividir **as quadras limpas do Symbios** em lotes, **pelos
parâmetros da gleba**, e disputar o **Judge do Generate** — medindo **lotes,
área vendável e violações** contra o motor do Testfit e contra o motor interno
do Generate.
**O que já está decidido desde o LAB-00:** a implementação é **reimplementação
em TypeScript** a partir da literatura (Felkel & Obdržálek 1998; Aichholzer,
Aurenhammer, Alberts & Gärtner 1995; Aichholzer & Aurenhammer 1996). As duas
implementações prontas são **copyleft** e não entram no produto.
**O oráculo já existe** ([`../STRAIGHT_SKELETON_ANALYSIS.md`](../STRAIGHT_SKELETON_ANALYSIS.md),
§4.4 — duas implementações independentes concordando): retângulo 60 × 30 → nós
internos em (15, 15) e (45, 15) com offset 15; o L → mais um nó em (15, 45).
**Prova:** os dois casos do oráculo como teste; lotes, área vendável e violações
por gleba; JSON em `docs/provas/LAB-04/`.
**Entregue:** [`../relatorios/LAB-04.md`](../relatorios/LAB-04.md). **O oráculo
bate ponto a ponto**, nós e frentes de onda, com fechamento 1,000. O Symbios sai
de **0 lotes** para **213** em `ensaio-47ha` com **zero violação** e **901** em
`geo-antonina` com **4** — 0,44 % dos lotes, contra 3,81 % do motor de
parcelamento. Quatro defeitos do Lab foram pegos pela régua do Generate, e o
maior deles é que **a borda da quadra do Symbios é o eixo da rua, não o
meio-fio** (D52).

### LAB-05 · Reconectar, recortar quadra, descartar lasca

**Condição:** LAB-04 mesclado.
**Escopo:** três coisas, e as três já têm o porquê medido:
1. **Reconectar a rede depois do corte** — `geo-antonina` com relevo fragmenta a
   **70,4 %** no maior componente (LAB-03, Parte B);
2. **Recortar a quadra que atravessa a divisa** — hoje a que atravessa fica,
   medida (73, 36 e 3 nas três glebas do LAB-02);
3. **Descartar lasca pela regra D48** — abaixo do lado do lote mínimo da gleba.
**E rejulgar as três glebas** com o Validator e o Judge do Generate.
**Prova:** antes e depois nas três, tabela e JSON em `docs/provas/LAB-05/`.
**O que o LAB-04 mediu e entrega a ele:** em `geo-antonina`, **119 das 698
quadras atravessam a divisa** e ficam sem lote nenhum; em `ensaio-47ha`, 3 de 94.
E a rede fragmentada faz trecho de via sobrar dentro de quadra — 65 lotes
descartados por isso.

### LF-FINAL-2 · Conferência e docs

**Condição:** LAB-05 mesclado.
**Escopo:** conferência contra o Padrão e os documentos em dia.

---

## Proposto ao chat — não executar

- **O delta contra o Padrão 1.2**, quando ele existir. A conferência do LF-FINAL
  foi feita contra a Versão 1, que é a única legível (D43). O `TF-FINAL` do
  repositório irmão espera o mesmo documento.
- **As 4 violações que sobraram em `geo-antonina`** (2 de sobreposição, de 0,56 e
  0,70 m², e 2 de frente) e o efeito de baixar a tolerância de simplificação de
  0,25 m. A suspeita está escrita no LAB-04, §6, e **não foi medida** — por isso
  não foi atribuída.
- **As 86 quadras de esqueleto não confiável** em `geo-antonina` (15 % das
  loteáveis): é forma degenerada da quadra ou limite da esteira? Hoje elas são
  puladas e contadas (D51), que é a resposta honesta, mas não é a resposta.

---

## Histórico — a fila autônoma de 14/09/2026, esgotada

Os cinco rodaram e foram mesclados no mesmo dia.

| # | prompt | entregue em |
|---|---|---|
| LF-01 | Casa em ordem | [`LF-01.md`](../relatorios/LF-01.md) |
| LAB-02 | Recorte pela gleba e pelas restrições — **0 % de via fora da divisa** | [`LAB-02.md`](../relatorios/LAB-02.md) |
| LAB-03 | Relevo: a interpolação medida no traçado, e as glebas-padrão com relevo | [`LAB-03.md`](../relatorios/LAB-03.md) |
| LAB-08 | Testfit × Symbios, lado a lado | [`LAB-08.md`](../relatorios/LAB-08.md) |
| LF-FINAL | Conferência contra o Padrão | [`LF-FINAL.md`](../relatorios/LF-FINAL.md) |

### As propostas daquela fila, e o que o chat decidiu em 15/09

| proposta | destino |
|---|---|
| ressalva do §9.3 — prosa formatada no núcleo | **resolvida: prosa para pessoa é borda, os 17 ficam** (D47) |
| descartar lasca de corte | **resolvida: abaixo do lote mínimo da gleba** (D48) — executa no LAB-05 |
| LAB-04 · straight skeleton | **virou o primeiro da fila nova** |
| reconectar a rede depois do corte | **virou parte do LAB-05** |
| recortar a quadra que atravessa a divisa | **virou parte do LAB-05** |
| delta contra o Padrão 1.2 | **segue esperando** o documento existir |

---

## Histórico — a fila anterior, LAB-00 a LAB-06

A fila original do laboratório, escrita na especificação
([`../referencia/LABORATORIO.md`](../referencia/LABORATORIO.md)) e gravada aqui no LAB-FILA. Ela
**continua valendo como roteiro de longo prazo**; a fila autônoma acima é o que
se executa agora.

| Prompt | Entrega | Condição para começar |
|---|---|---|
| LAB-00 | Investigação dos candidatos e prova mínima de compilação (Symbios Tensor, straight skeleton, PackingSolver; Unreal/Terasology/CityEngine só como referência) | — |
| LAB-01 | Adaptador mínimo do Symbios: terreno do Archilly → mapa de alturas → Symbios → grafo viário de volta, em metros e georreferenciado | LAB-00 concluir "seguir" para o Symbios |
| LAB-02 | Recorte do resultado pelo limite da gleba e pelas restrições (APP, faixa não edificável, cursos d'água) e passagem pelo Validator do Generate | LAB-01 devolver geometria utilizável |
| LAB-03 | Comparação no Judge: Geométrico × Fishbone × Symbios, mesmo terreno e mesmos parâmetros; relatório por etapa (rede viária, quadras, lotes) | LAB-02 passar no Validator |
| LAB-04 | Straight skeleton como componente de subdivisão de quadras, testado contra quadras reais do Generate | LAB-00 escolher a implementação e confirmar licença |
| LAB-05 | Motor vencedor compilado para WebAssembly (ou empacotado como serviço) e provado rodando no navegador com um terreno do Generate | LAB-03 mostrar valor mensurável em pelo menos uma etapa |
| LAB-06 | Entrega ao Generate: peça pronta atrás do contrato de motor, registro de motores, botão liga/desliga por motor, e o teste de que apagar o Lab inteiro não quebra o Generate | LAB-05 |
| LAB-07 | O motor do laboratório de parcelamento na esteira: ida e volta pelo contrato de motor v1, julgado pelo Validator e pelo Judge do Generate | fora da cadeia acima — o motor é da família e o contrato v1 já existia |

**O que foi concluído dessa fila:**

- **LAB-00 — 09/09/2026.** Symbios Tensor segue para a Etapa B/C, restrito aos
  Usos B (rede viária) e C (quadras). Straight skeleton e PackingSolver ficam
  como referência. Ver [`../TRIAGEM.md`](../TRIAGEM.md).
- **LAB-01 — 10/09/2026.** Adaptador mínimo de ida e volta, veredito
  **"geometria utilizável: SIM COM RESSALVAS"**. Ver
  [`../relatorios/LAB01_ADAPTADOR.md`](../relatorios/LAB01_ADAPTADOR.md).
- **LAB-07 — 13/09/2026.** O motor do laboratório de parcelamento atravessa a
  esteira inteira pelo contrato de motor v1, com o mesmo veredito. 47 variantes
  julgadas, 28 401 lotes, 4 132 violações, muito desiguais entre os dez
  partidos. Ver [`../relatorios/LAB-07.md`](../relatorios/LAB-07.md).
- **LAB-04 — liberado, e roda DEPOIS do LAB-02/03, nunca em paralelo.** A
  licença foi confirmada e as duas implementações são copyleft, então a decisão
  já tem resposta: **reimplementar em TypeScript** a partir da literatura
  (Felkel & Obdržálek 1998; Aichholzer et al. 1995/1996), com as duas
  implementações GPL como oráculo. Casos de teste verificados em
  [`../STRAIGHT_SKELETON_ANALYSIS.md`](../STRAIGHT_SKELETON_ANALYSIS.md).
- **LAB-05 e LAB-06 — aguardando**, em cadeia a partir do LAB-03.
