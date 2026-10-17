/**
 * ════════════════════════════════════════════════════════════════════════════
 *  NENHUM `.env`, `.pem` OU ARQUIVO DE CREDENCIAL — perguntado ao `git`, pelo NOME. (LAB-160, item 900, D388)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * O `docs/SEGURANCA.md`, do LF-FINAL (14/09/2026), afirma na tabela *Chaves e segredos*:
 *
 * > Nenhum `.env`, `.pem` ou arquivo de credencial · ✅ **limpo** ·
 * > `find . -name ".env*" -o -name "*.pem" -o -name "*credential*"` — **nada**
 *
 * Um comando rodado uma vez, e nenhuma trava o perguntava de novo (espécie *mensagem fixa que afirma estado sem
 * perguntar*). A varredura de segredos (LAB-47) **não responde esta linha**: ela lê o CONTEÚDO, e o conteúdo de um
 * arquivo de credencial quase nunca tem a forma que ela procura. Medido em 17/10/2026, com o `varrerTexto` dela sobre
 * seis arquivos de credencial plantados:
 *
 * | arquivo | conteúdo plantado | a varredura de conteúdo |
 * |---|---|---|
 * | `.env` | `NOME_DA_CHAVE=valor` sem aspas | **nada** |
 * | `.env` | `DB_PASSWORD="…"` com aspas | **nada** (o `\b` não separa `DB_` de `PASSWORD`) |
 * | `.npmrc` | `//registry…/:_authToken=…` | **nada** |
 * | `.netrc` | `machine … login … password …` | **nada** |
 * | `.git-credentials` | `https://usuario:senha@github.com` | **nada** |
 * | `id_ed25519` | o cabeçalho de chave privada do OpenSSH, em texto | acusa (`chave-privada-em-pem`) |
 *
 * E o binário (`.p12`, `.pfx`, `.jks`, a chave em DER) ela põe em `deFora` — *"binário (tem byte nulo)"* — com o
 * nome e o motivo, e passa: é o jeito certo de uma varredura de texto dizer o que não leu, e por isso mesmo a pergunta
 * pelo NOME tem de existir noutro lugar. **Cinco de seis escapam ao conteúdo; o nome pega os seis.**
 *
 * # O universo
 *
 * O que o `git` carrega (`arquivosQueOGitCarrega`, o mesmo da varredura: o rastreado **e** o que entraria no próximo
 * `commit -a`) — é o que chega ao GitHub, e este repositório é **público**. O `find .` da página lia o disco inteiro,
 * `node_modules/` incluído, e só três formas de nome.
 *
 * E a **história**: chave que apareceu no lugar errado é chave vazada (regra da família), e um `.env` apagado no commit
 * seguinte continua no GitHub. Os nomes que entraram em qualquer commit do `HEAD` (`git log --diff-filter=A`) são
 * perguntados **só com a história inteira** — no clone raso o `git log` responde o corte (D293, LAB-89), e a leitura
 * recusa em vez de afirmar.
 *
 * # O que a medição de 17/10/2026 respondeu
 *
 * **A linha é verdadeira.** 753 caminhos que o `git` carregava antes desta rodada, zero com nome de credencial; 762
 * nomes que já entraram na história inteira do `HEAD` (456 commits, clone desrasado), zero. O `find` da página, refeito,
 * também dá zero. Regra verdadeira, guarda ausente — e um comando estreito: três formas de nome, das dezessete abaixo.
 * (Números de 17/10/2026, antes do commit desta rodada; os de hoje o teste imprime.)
 */
import { execFileSync } from "node:child_process";

import { arquivosQueOGitCarrega } from "./varredura-de-segredos.ts";

export const A_PAGINA = "docs/SEGURANCA.md";
/** O começo da linha da tabela, como está escrito na página. */
export const A_LINHA = "| Nenhum `.env`, `.pem` ou arquivo de credencial";

export interface FormaDeNome {
  nome: string;
  /** Casa contra o ÚLTIMO pedaço do caminho (o nome do arquivo), sem diferença de maiúscula. */
  padrao: RegExp;
  motivo: string;
}

/**
 * As formas de nome que são credencial. As três primeiras são as da página; as outras, o que a família usa ou pode
 * vir a usar (o Supabase, o Cloudflare, o npm, o GitHub, a chave de SSH).
 */
export const FORMAS: readonly FormaDeNome[] = [
  {
    nome: "env",
    padrao: /^\.env(\..+)?$/i,
    motivo:
      "variáveis de ambiente — onde a família guarda a chave do Supabase e de IA (da página)",
  },
  {
    nome: "pem",
    padrao: /\.pem$/i,
    motivo: "chave ou certificado em PEM (da página)",
  },
  {
    nome: "credential",
    padrao: /credential/i,
    motivo:
      "nome que se declara credencial — `credentials.json`, `.git-credentials` (da página)",
  },
  {
    nome: "key",
    padrao: /\.key$/i,
    motivo: "chave privada solta, a forma do `openssl genrsa -out x.key`",
  },
  {
    nome: "p12-pfx",
    padrao: /\.(p12|pfx)$/i,
    motivo:
      "certificado com a chave dentro, em binário — a varredura de conteúdo o põe de fora",
  },
  {
    nome: "jks-keystore",
    padrao: /\.(jks|keystore)$/i,
    motivo: "cofre de chaves Java/Android, binário",
  },
  {
    nome: "ppk",
    padrao: /\.ppk$/i,
    motivo: "chave privada do PuTTY, o SSH do Windows",
  },
  {
    nome: "ssh",
    padrao: /^id_(rsa|dsa|ecdsa|ed25519)$/i,
    motivo: "chave privada de SSH (a `.pub`, pública, não casa)",
  },
  {
    nome: "npmrc",
    padrao: /^\.npmrc$/i,
    motivo: "o `_authToken` do npm mora aqui",
  },
  {
    nome: "netrc",
    padrao: /^_?\.?netrc$/i,
    motivo: "usuário e senha por máquina, lido pelo `git` e pelo `curl`",
  },
  {
    nome: "pypirc",
    padrao: /^\.pypirc$/i,
    motivo: "a senha ou o token de publicação do PyPI",
  },
  {
    nome: "htpasswd",
    padrao: /^\.htpasswd$/i,
    motivo: "senhas de servidor web",
  },
  {
    nome: "dev-vars",
    padrao: /^\.dev\.vars$/i,
    motivo:
      "os segredos locais do `wrangler` (Cloudflare), que é onde a família publica",
  },
  {
    nome: "service-account",
    padrao: /service[-_]?account.*\.json$/i,
    motivo: "a chave de conta de serviço do Google, em JSON",
  },
  {
    nome: "secrets",
    padrao: /^\.?secrets?(\.[a-z]+)?$/i,
    motivo: "o arquivo que se chama segredo",
  },
  {
    nome: "tfvars",
    padrao: /\.tfvars$/i,
    motivo: "variáveis do Terraform, onde mora a chave do provedor",
  },
  { nome: "kdbx", padrao: /\.kdbx$/i, motivo: "cofre de senhas do KeePass" },
];

/**
 * O caso válido que quase parece inválido: o MODELO do `.env`, sem valor nenhum, é o jeito certo de dizer quais
 * variáveis existem (a Central versiona `hub/.env.exemplo`). Casa a forma `env`, e é perdoado pelo nome.
 */
export const MODELOS_PERMITIDOS: readonly RegExp[] = [
  /^\.env\.(exemplo|example|sample|modelo|template)$/i,
];

export const nomeDoArquivo = (caminho: string): string =>
  caminho.split("/").pop() ?? caminho;

/** A forma de credencial que o caminho tem, ou `null`. O modelo do `.env` devolve `null`. */
export function formaDeCredencial(caminho: string): FormaDeNome | null {
  const nome = nomeDoArquivo(caminho);
  if (MODELOS_PERMITIDOS.some((r) => r.test(nome))) return null;
  return FORMAS.find((f) => f.padrao.test(nome)) ?? null;
}

export type TipoDeProblema =
  "credencial-no-git" | "credencial-na-historia" | "universo-vazio";

export interface Problema {
  tipo: TipoDeProblema;
  caminho: string;
  detalhe: string;
}

export interface Resultado {
  /** Quantos caminhos foram perguntados — publicado, porque `every` sobre lista vazia é verdade. */
  lidos: number;
  problemas: Problema[];
}

/**
 * Pergunta cada caminho pelo nome. `onde` diz de que universo a lista veio, para a mensagem e para o tipo.
 */
export function conferirOsNomes(
  caminhos: readonly string[],
  onde: "git" | "historia",
): Resultado {
  const problemas: Problema[] = [];
  if (caminhos.length === 0)
    problemas.push({
      tipo: "universo-vazio",
      caminho: "",
      detalhe: `nenhum caminho lido em ${onde === "git" ? "o que o git carrega" : "a história"} — verde sobre zero não é verde`,
    });
  for (const c of caminhos) {
    const f = formaDeCredencial(c);
    if (!f) continue;
    problemas.push({
      tipo: onde === "git" ? "credencial-no-git" : "credencial-na-historia",
      caminho: c,
      detalhe:
        onde === "git"
          ? `${c}: nome de credencial (${f.nome} — ${f.motivo}). Tire do git e ponha no .gitignore; se tinha chave, a chave está vazada e se troca`
          : `${c}: entrou na história com nome de credencial (${f.nome}). Apagar o arquivo não apaga o commit: se tinha chave, a chave está vazada e se troca`,
    });
  }
  return { lidos: caminhos.length, problemas };
}

/** A árvore de verdade: o que o `git` desta casa carrega hoje. */
export function conferirAArvore(raiz: string): Resultado {
  return conferirOsNomes(arquivosQueOGitCarrega(raiz), "git");
}

/** Todo caminho que já ENTROU num commit da história do `HEAD`. Só tem sentido com a história inteira. */
export function nomesQueJaEntraram(raiz: string): string[] {
  const saida = execFileSync(
    "git",
    [
      "-C",
      raiz,
      "log",
      "HEAD",
      "--diff-filter=A",
      "--name-only",
      "--format=",
      "-z",
    ],
    {
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024,
    },
  );
  return [...new Set(saida.split(/[\0\n]/).filter((s) => s.length > 0))].sort();
}

/** O que esta trava NÃO alcança — dito, porque guarda que não declara o próprio buraco mente pelo silêncio. */
export const O_QUE_ISTO_NAO_ALCANCA: readonly string[] = [
  "credencial com nome de outra coisa (`config.json`, `dados.txt`): a pergunta é pelo NOME; o conteúdo é da varredura de segredos (LAB-47), e o que ela não pega por forma também escapa daqui",
  "nome em português ou outra língua (`credenciais.json`, `senhas.txt`): a lista tem as formas que as ferramentas usam, e as ferramentas nomeiam em inglês",
  "o arquivo ignorado pelo `.gitignore` e deixado no disco: ele não sai daqui — e é o jeito certo de ter um `.env`; a trava não pergunta se o `.gitignore` o cobre",
  "a história num clone raso (o CI): a leitura recusa e diz por quê, e a pergunta só se responde na máquina da sessão, que desrasa no passo 0 (LAB-116)",
  "a história de ramo que não está no `HEAD`, e o que foi reescrito antes de chegar aqui: o `git log` responde o que este clone tem",
  "os repositórios vizinhos: são deles, e o Lab não escreve neles",
];
