# FILA DO ARCHILLY LAB

Regra: cada item só começa se o anterior disser que vale. O Generate nunca depende do Lab; o que for aprovado chega a ele como peça pronta (WebAssembly ou serviço) atrás do contrato de motor.

| Prompt | Entrega | Condição para começar |
|---|---|---|
| LAB-00 | Investigação dos candidatos e prova mínima de compilação (Symbios Tensor, straight skeleton, PackingSolver; Unreal/Terasology/CityEngine só como referência) | — |
| LAB-01 | Adaptador mínimo do Symbios: terreno do Archilly → mapa de alturas → Symbios → grafo viário de volta, em metros e georreferenciado | LAB-00 concluir "seguir" para o Symbios |
| LAB-02 | Recorte do resultado pelo limite da gleba e pelas restrições (APP, faixa não edificável, cursos d'água) e passagem pelo Validator do Generate | LAB-01 devolver geometria utilizável |
| LAB-03 | Comparação no Judge: Geométrico × Fishbone × Symbios, mesmo terreno e mesmos parâmetros; relatório por etapa (rede viária, quadras, lotes) com a tabela da seção "método de comparação" da especificação | LAB-02 passar no Validator |
| LAB-04 | Straight skeleton como componente de subdivisão de quadras, testado contra quadras reais do Generate; decisão entre implementação pronta e reimplementação em TypeScript | LAB-00 escolher a implementação e confirmar licença |
| LAB-05 | Motor vencedor compilado para WebAssembly (ou empacotado como serviço, se WASM for inviável) e provado rodando no navegador com um terreno do Generate | LAB-03 mostrar valor mensurável em pelo menos uma etapa |
| LAB-06 | Entrega ao Generate: peça pronta atrás do contrato de motor, registro de motores, botão liga/desliga por motor, e o teste de que apagar o Lab inteiro não quebra o Generate | LAB-05 |

## Estado

- **LAB-00 — concluído em 09/09/2026.** Symbios Tensor segue para a Etapa B/C,
  restrito aos Usos B (rede viária) e C (quadras). Straight skeleton e
  PackingSolver ficam como referência. Ver `docs/TRIAGEM.md`.
- **LAB-01 — concluído em 10/09/2026.** Adaptador mínimo de ida e volta, com
  veredito **"geometria utilizável: SIM COM RESSALVAS"**. Ver
  `docs/relatorios/LAB01_ADAPTADOR.md`.
- **LAB-02 — liberado.** A condição era "LAB-01 devolver geometria utilizável", e
  ele devolveu. Duas coisas já vão medidas e o esperam: 38 % do comprimento de via
  nasce fora da gleba, e a rampa estoura **nos cruzamentos** (nunca ao longo da
  via). As restrições já viajam carregadas no `Terreno`.
- **LAB-04 — liberado, e roda DEPOIS do LAB-02/03, nunca em paralelo.** A
  condição era "LAB-00 escolher a implementação e confirmar licença": a licença
  foi confirmada e as duas implementações são copyleft, então a decisão já tem
  resposta — **reimplementar em TypeScript** a partir da literatura
  (Felkel & Obdržálek 1998; Aichholzer et al. 1995/1996), com as duas
  implementações GPL como oráculo. Os dois casos de teste verificados estão em
  `docs/STRAIGHT_SKELETON_ANALYSIS.md`.
- **LAB-03, LAB-05, LAB-06 — aguardando**, em cadeia a partir do LAB-02.
