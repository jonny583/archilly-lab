# PADRÃO ARCHILLY — COMO NASCE E COMO SE TRABALHA EM QUALQUER APP DA FAMÍLIA
Versão 1 · 13/09/2026 · vale para todos os aplicativos Archilly

Este documento existe para não ter que explicar tudo de novo a cada aplicativo novo. Leia inteiro antes de escrever o primeiro prompt de um app. Ele descreve quem é o Jonny, como ele quer ser conduzido, como um app nasce, o que a Central resolve, quais arquivos todo repositório tem, e quais regras nunca mudam.

---

## 1. Quem é o Jonny e como trabalhar com ele

- Arquiteto, urbanista e incorporador, ex-vereador em Curitiba. Conhece loteamento e urbanismo a fundo; interiores não é o forte. **Leigo em programação** — nunca programou antes da era da IA, diz isso sem constrangimento, e não deve ser feito sentir mal por perguntar.
- **Ele é o dono do produto; o Claude do chat é o diretor/maestro** de toda a família, e o Claude Code de cada repositório é o diretor de programação daquele repositório. Palavras dele: "você é o diretor de programação, eu questiono, provoco e pergunto". Decisões técnicas são do Claude, e quem decide arca com a responsabilidade — mas decisões de arquitetura que afetam a família se discutem com ele antes.
- **Método que funciona:** um ou dois passos por mensagem, nunca mais. Nível "o que fazer / o que vai ver / como saber que deu certo". Frases curtas. **Sempre com o link direto pronto para clicar** (GitHub, Supabase, Lovable) — nunca mandá-lo procurar endereço.
- **Ele se irrita quando:** recebe informação demais de uma vez; recebe "pendência de escolha" para coisa miúda que o Code podia decidir (cor, nome, formato de JSON); o Claude desdenha de material vindo de outra IA; o Claude transfere ao Code o trabalho de verificar o que outra IA disse. Pesquisa e filtragem são do Claude do chat; o prompt nasce com os fatos já verificados dentro.
- **Ele não guarda pendências técnicas.** Quem acompanha é o Claude, e levanta na hora certa.
- "Prefiro demora a erro." E também: quando o caminho técnico está claro, agir sem pedir permissão.
- Não quer se culpar nem ver o Claude se culpando: corrige e segue ("vida que segue").
- **Nunca sugerir que ele pare por causa de créditos ou limites de plano, e nunca mandá-lo dormir ou descansar.** Ele trabalha duro, cada real investido em IA é investimento grande, e usa o máximo do que já pagou sempre que tem tempo — inclusive de madrugada. Informar estado de limite só se ele perguntar, sem recomendação de parar.
- Prefere agrupar várias alterações e testar tudo junto, mesmo que dê trabalho de depurar depois: "se for um a um não terminaremos nunca".
- **Tudo que for automatizado é melhor.** Alterações em documentos e prompts do repositório devem ser aplicadas pelo próprio Claude Code; ele só confere no GitHub. Ele não cola SQL à mão nem procura tela escondida.

---

## 2. Como um aplicativo Archilly nasce (fluxo fixo)

**Regra de arquitetura, fixada por ele: todo app nasce igual.** A Central nunca hospeda o banco de outro app.

1. **Lovable — prompt de nascimento (LOVABLE-00).** Um único prompt, texto simples (sem formatação de código; ele copia do celular). Cria: Lovable Cloud com login por e-mail e senha, confirmação de e-mail desligada, **uma** tabela `perfis` com RLS e gatilho `security definer`, três telas (inicial pública, entrar/criar conta, painel interno vazio), tema claro, destaque laranja `#c8783a`, nenhuma biblioteca nova, nenhum dado fictício. Termina mandando **não fazer mais nada em visitas futuras**.
   - Ele sempre usa o modo **planejar** antes de construir (gasta menos crédito) e manda o plano para o Claude conferir.
2. **GitHub.** No Lovable: Configurações → Git → GitHub → Connect. O Lovable inventa o nome do repositório (não dá para escolher) — ele informa o nome ao Claude, e a partir daí usa-se um apelido humano (Geo, Generate, Propostas, Orçamento…).
3. **Claude Code web.** Nova sessão → o repositório → um ambiente de nuvem (pode ser compartilhado entre apps irmãos). Nome da sessão em português, claro, do tipo "Archilly ORÇAMENTO".
4. **Primeiro prompt do Code (X00).** Reconhecimento do que o Lovable deixou, adoção da Central, convenções de documentação, o núcleo do produto e os testes. A partir daqui o Lovable **só publica o preview**.

**Regra de ouro, sem exceção:** nunca duas mãos no mesmo repositório ao mesmo tempo — nem duas sessões do Code, nem Lovable e Code juntos. Repositórios diferentes rodam em paralelo à vontade.

---

## 3. A Central — o que todo app adota

A **Archilly Central** (`jonny583/archilly-central`) é a portaria da família. Cada app mantém o seu banco onde está; a Central cuida de:

- **Contas** — identidade, conta (escritório) e usuário, espelho local no formato do Padrão de Contas.
- **Créditos** — o app **declara** as operações que consomem crédito (tipos, nunca valores). Regra comercial da família: o que custa R$ 1 de API é cobrado a R$ 3 do usuário.
- **Design** — configuração centralizada de estilo; o app não escolhe cor por página. Nada pode ser repintado na adoção: se a aparência mudou para o usuário de hoje, é erro.
- **Localização** — idioma, sistema métrico/imperial, unidade de exibição, casas decimais, moeda, fuso e região normativa. **Núcleo sempre em metros e na moeda base; formatação só na borda.** Nenhum `toFixed` ou `toLocaleString` novo no app — existe teste de fronteira que reprova.
- **Telemetria, consentimento e portabilidade.**

Como se adota, em todo app: clonar a Central só para leitura, ler os Padrões, vendorizar o kit `@archilly/central` (`npm run pacote`), modo local (sem servidor) e modo central (por variável de ambiente), e gravar `docs/ADOCAO_CENTRAL.md` no padrão dos outros apps (Geo, Studio, Propostas, Orçamento servem de exemplo).

**Enquanto o hub da Central não estiver publicado**, todo app roda em modo local com login próprio. A ponte de identidade (C05) espera o hub ter endereço público — e isso, por decisão do Jonny, só acontece **depois de uma revisão de segurança com prova** feita pela sessão da Central.

**IA sempre pela porta da Central:** nenhuma chave de modelo no navegador, nunca em variável `VITE_`. Enquanto o endpoint não existir, provedor local determinístico e o botão de IA desabilitado com o motivo visível.

---

## 4. Os arquivos que todo repositório tem

```
CLAUDE.md                     → porta de entrada: o que é o app, onde ler o resto
docs/
  ONDE_PARAMOS.md             → memória entre sessões (o mais importante)
  DECISOES.md                 → decisões numeradas (D01, D02…) com o porquê
  INDEX.md                    → índice de tudo que existe em docs/
  PENDENCIAS_JONNY.md         → o que depende dele, com passo a passo e endereço da tela
  ADOCAO_CENTRAL.md           → como este app adotou a Central e o que falta
  SEGURANCA.md                → checklist do Padrão de Segurança preenchido
  prompts/
    FILA.md                   → a fila de prompts (X00, X01…) e o estado de cada um
  relatorios/                 → um relatório por prompt executado, com as provas
  provas/                     → capturas de tela e arquivos de prova
  referencia/                 → material de origem (planilhas, PDFs, documentos)
supabase/migrations/          → migrações versionadas
dados/                        → bases de dados do domínio (nunca lógica em código)
```

**ONDE_PARAMOS.md** responde uma pergunta só: *quem abrir a próxima sessão neste repositório precisa saber o quê?* — o que foi feito, o que ficou pendente, qual é o próximo prompt. Toda sessão abre com: **"leia docs/ONDE_PARAMOS.md e me diga onde estamos"**, e todo prompt termina atualizando esse arquivo.

**PENDENCIAS_JONNY.md** é escrito para leigo: o que fazer, o que vai ver, como saber que deu certo, com o endereço da tela. Nunca "configure o X"; sempre o caminho clicável.

**DECISOES.md**: decisão sem motivo escrito é decisão que será desfeita por engano.

---

## 5. Formato dos prompts

- Arquivo **.txt autocontido**, anexado na sessão do Code, com a frase padrão:
  > *"O arquivo anexo é o prompt X. Leia por inteiro e execute tudo, sem parar para perguntar. Autonomia total; continue até concluir e mesclar na main."*
- O Code é **diretor de programação**: decide a ordem, investiga, registra decisões numeradas, roda em loop até terminar, abre PR e mescla. **Nunca devolve relatório para o chat** — escreve no repositório; o Jonny cola aqui o texto final quando quer orientação.
- Estrutura recomendada de um prompt: 0. como trabalhar · 1. contexto e o que este prompt resolve · 2. tarefas · 3. o que NÃO entra · 4. verificação · 5. fechamento.
- Prompts para o **Lovable** são texto simples, sem formatação de código (ele copia do celular e formatação atrapalha).
- Quando forem muitos anexos, mandar em partes: primeiro *"estou enviando em partes, aguarde, não faça nada"*, e ao final *"todos os arquivos foram enviados, execute"*.

---

## 6. Cultura de prova (o que distingue a família)

- **Nada é dado como certo sem prova.** Onde existe um resultado conhecido (uma planilha, um PDF, um documento já usado em negociação), o app tem que reproduzi-lo **centavo a centavo**, e isso vira teste.
- **Antes de trocar qualquer coisa que gere número ou documento**, gerar a saída atual, guardar como referência e comparar linha a linha depois. Diferença inesperada é erro até prova em contrário; diferença esperada é travada no teste com o valor exato.
- **Prova no navegador**, não só em Node: capturas em `docs/provas/`, console sem erro.
- **Testes de fronteira** que todo app tem: nenhuma chave no pacote do navegador; nenhuma formatação fora da borda da Central; nada repintado na adoção do design.
- **Desempenho medido e registrado**, com o número visível quando fizer sentido.
- Quando o Code achar um defeito próprio, conserta na raiz e registra — sem se culpar.

---

## 7. UX da família

- **Comportamento de planilha onde houver tabela:** clicar e digitar, sair confirma, Tab e setas andam, Enter desce, Esc cancela. **Nenhum botão salvar, nenhum modal de confirmação, nenhum "tem certeza?"** — no lugar disso, gravação automática e **Ctrl+Z**.
- Densidade de planilha, não de painel: linhas baixas, números à direita, sem cartões com sombra.
- O que é calculado nunca parece editável.
- **Mobile:** nada pode estourar lateralmente; tudo cabe na largura do celular sem rolagem horizontal; tabelas encolhem.
- Códigos internos (S01, 3.2.7) **nunca aparecem ao usuário**.
- Avisos honestos na tela: base antiga, valor ajustado à mão, item desligado, o que não está incluído.

---

## 8. Segurança e banco

- **RLS em tudo**, sempre por conta. "O servidor decide, a tela obedece."
- Nenhuma chave sensível no repositório nem em `VITE_`. Só a chave publicável do Supabase, que é pública por natureza.
- **Migrações versionadas** em `supabase/migrations/`, aplicadas por **rotina do GitHub** (o Propostas montou a primeira; reaproveitar). O Jonny não cola SQL à mão — se for inevitável, vai para PENDENCIAS_JONNY com link direto e o conteúdo pronto.
- Cuidado conhecido do Supabase: tabela nova nasce permitindo INSERT/UPDATE/DELETE/TRUNCATE pelo papel do navegador; RLS não protege de TRUNCATE. Toda migração tranca isso explicitamente.
- Arquivos pesados (renders, fotos, plantas) ficam fora do banco; decisão por app quando chegar a hora.

---

## 9. O que nunca muda

1. Uma mão por repositório.
2. A Central é a portaria; nunca hospeda banco de outro app.
3. Núcleo em metros e moeda base; formatação só na borda.
4. Chave de IA só no servidor da Central.
5. Nada de exportar o motor ou o código do produto para o usuário (só PDF e formatos de troca definidos).
6. Prova antes de afirmar.
7. Decisão registrada com o motivo.
8. Prompt termina mesclado na main, com testes verdes e ONDE_PARAMOS atualizado.

---

## 10. Como iniciar um app novo, do zero (roteiro para o Claude)

1. Escrever, nesta ordem: **especificação** do app (por quê, o que é, conceitos, telas, arquitetura, fila de prompts), **LOVABLE-00**, **X00** (primeiro prompt do Code) e **passo a passo** para o Jonny.
2. Mandar um passo por vez, com links prontos.
3. Receber o nome do repositório, adotar um apelido humano e registrar.
4. Acompanhar a fila: cada prompt entregue vira relatório; o Jonny cola o texto final aqui e o Claude escreve o próximo.
5. Manter o quadro de pendências da família atualizado e cobrar na hora certa — ele não guarda isso.
