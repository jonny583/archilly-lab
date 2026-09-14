# FILA DO ARCHILLY LAB

**Esta é a fila oficial deste repositório.** Escrita pelo Claude do chat
(diretor da família) em 14/09/2026 e gravada aqui como fila autônoma: o Lab
trabalha sozinho, em laço, sem esperar mensagem do chat.

**Ao acordar:** `docs/ONDE_PARAMOS.md` → `git log` → esta fila.

---

## Como esta fila funciona

- **Um despertador**, a cada 60 minutos, preso a este repositório
  (`trig_01DFdwqF4nUDLQAod5w4WH1m`, minuto :05). Regra de família: **um por
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

## O quadro

| # | prompt | estado | condição |
|---|---|---|---|
| **LF-01** | Casa em ordem | ✅ **concluído em 14/09/2026** | nenhuma |
| **LAB-02** | Recorte pela gleba e pelas restrições | ⬜ **pronto — é o próximo** | LF-01 mesclado ✅ (geometria utilizável já cumprida no LAB-01) |
| **LAB-03** | Relevo: interpolação corrigida e glebas-padrão com relevo | ⬜ | LAB-02 mesclado |
| **LAB-08** | Testfit × Symbios, lado a lado | ⏸ **aguardando** | LAB-03 mesclado **E** T02 mesclado na `main` de `jonny583/motor-testfit` |
| **LF-FINAL** | Conferência contra o Padrão 1.2 | ⬜ | LAB-08 mesclado |

---

## Os prompts, por extenso

### LF-01 · Casa em ordem — ✅ concluído em 14/09/2026

**Condição:** nenhuma.
**Escopo:** `RECADOS.md`; apagar o branch `claude/stoic-ritchie-ijzqy3` (diff
vazio); `PENDENCIAS_JONNY` reescrito com as decisões do chat (sobram só as
confirmações dele); `ONDE_PARAMOS` e `INDEX` reescritos.
**Prova:** testes intactos.
**Entregue:** [`../relatorios/LF-01.md`](../relatorios/LF-01.md).

### LAB-02 · Recorte pela gleba e pelas restrições — pronto

**Condição:** LF-01 mesclado (a condição de geometria utilizável já está
cumprida pelo LAB-01).
**Escopo:** aparar a rede viária do Symbios **pelo perímetro** (o aparo de eixo
já escrito em `external-engines/testfit/adapter/src/aparo.ts`) **e pelas
restrições** (APP como geometria real); rejulgar com o Validator e o Judge do
Generate; medir de novo os dois números do LAB-01 — comprimento de via fora da
gleba (**meta: 0 %**) e rampa nos cruzamentos — e as violações por partido.
**Sem inventar regra.**
**Prova:** antes/depois nas três glebas, tabela no relatório e JSON em
`docs/provas/LAB-02/`.

### LAB-03 · Relevo: interpolação corrigida e glebas-padrão com relevo

**Condição:** LAB-02 mesclado.
**Escopo:** aplicar no Lab a correção de interpolação (**exigir vizinhos de duas
cotas distintas**) e medir o efeito sobre a rampa; gerar, a partir de relevo
real de referência (o que o Geo já exporta ou uma superfície sintética
declarada), versões **com relevo** das duas glebas-padrão do Generate, como
**fixtures do Lab**. Não alterar o Generate: a proposta de adotá-las vai no
relatório, para o chat repassar.
**Prova:** rampa por trecho e por cruzamento antes e depois; JSON.

### LAB-08 · Testfit × Symbios, lado a lado — aguardando

**Condição:** LAB-03 mesclado **E** T02 do Testfit mesclado na `main` de
`jonny583/motor-testfit`. Verificar a cada despertador; enquanto não,
**"aguardando"**.
**Escopo:** rodar de novo a esteira com o motor do Testfit corrigido (T02) e o
Symbios recortado (LAB-02), **mesmas glebas, mesmas sementes**, e entregar UMA
tabela: lotes, área parcelada, via fora da gleba, violações por regra, rampa,
tempo, determinismo — com a **diferença de lotes contra o motor interno do
Generate** (o Testfit mediu 22 % a menos na gleba de 47 ha; explicar com número
de onde vem). Veredito por motor. **Nada de recomendação de produto:** o chat e
o Jonny decidem com a tabela.
**Prova:** JSON e tabela; arquivos das saídas em `docs/contratos/saidas/` para o
Generate julgar.

### LF-FINAL · Conferência contra o Padrão 1.2

**Condição:** LAB-08 mesclado.
**Escopo:** conferência — o Lab não tem tela, então vale o que se aplica:
chaves, formatação no núcleo, determinismo, docs. `INDEX` e `ONDE_PARAMOS`
reescritos; `PENDENCIAS_JONNY` do zero.

---

## Proposto ao chat — não executar

*(vazio)*

---

## Histórico — a fila anterior, LAB-00 a LAB-06

A fila original do laboratório, escrita na especificação
([`../LABORATORIO.md`](../LABORATORIO.md)) e gravada aqui no LAB-FILA. Ela
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
