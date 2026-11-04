# Desafio 15M36 · Área de membros

Protótipo navegável em React + Vite, baseado no PDF de especificação. A entrega oficial continua na Hotmart. Sem autenticação, pagamento, banco de dados ou coleta de informações pessoais.

## Prévia local e arquivos no GitHub

A reformulação preta e laranja e a prévia atual são versionadas na branch principal. O endereço público permanente e o processo de sincronização estão documentados no final deste arquivo.

- [Baixar pacote para publicação](https://github.com/gamedeiros23-rgb/15m36-area-de-membros/raw/refs/heads/main/preview/15m36-site.zip)
- [Prévia HTML independente](preview/index.html): use o botão **Download raw file** no GitHub para baixar; depois abra no navegador.
- [Captura de computador](preview/desktop.png) e [captura de celular](preview/mobile.png).

A pasta `preview/` contém uma cópia da versão avaliada, incluída no Git para download. Preserve os ajustes manuais em `preview/index.html`: nunca o substitua cegamente por uma nova exportação. Atualize a prévia incorporando esses ajustes e prepare o ZIP a partir dos bytes finais desse arquivo, com o nome `index.html` na raiz. O GitHub armazena os arquivos; um link público navegável exige uma publicação separada em GitHub Pages, Netlify ou Vercel. Acesso a repositório privado exige permissão no GitHub.

## Executar

Use Node.js 22+ (validado com 24.22.1) e npm.

```sh
cd /workspace/15m36-area-de-membros
npm ci --cache /workspace/.npm-cache
npm run dev -- --port 5173
```

Abra a rota `/area-de-membros` no servidor. A raiz também abre a demonstração. A navegação usa fragmentos (`#calendar`, `#module/3`, `#lesson/workout-1`), permitindo recarregar sem backend. O servidor está configurado para escutar em todas as interfaces; disponibilizar uma URL externa depende do ambiente de hospedagem.

## Prévia para baixar

```sh
npm run export:preview
```

Gera `artifacts/15m36-prototipo.html`, um HTML independente com JavaScript, CSS e fontes embutidos. Baixe e abra no navegador, sem instalação e sem conexão. O navegador precisa permitir JavaScript. O progresso é local; em arquivos `file://`, a persistência depende do navegador. Em ambiente servido por HTTP, usa `localStorage` normalmente. Arquivos e vídeos adicionados futuramente não são embutidos nessa exportação.

## Fluxos implementados

- Página inicial, cinco módulos na ordem oficial, nove treinos de 15 minutos (três por fase) e encerramento.
- Próximo treino acessível diretamente, sem bloquear pela introdução; aulas complementares com continuação própria.
- Conclusões reversíveis e progressos separados, preservados por navegador.
- Hidratação: meta individual informada pela aluna, registro manual de consumo e reversão; sem meta universal.
- Calendário com as três fases e três treinos por semana. Distribuição dos dias claramente demonstrativa, incluindo recuperação e continuidade de alimentação/hidratação.
- Filtros por refeição e preparo, cinco fichas demonstrativas completas.
- Menu móvel, navegação por teclado, diálogo de receita com foco e fechamento por Escape.
- Vídeos ausentes sem reprodução fictícia; materiais ausentes sem downloads falsos.
- Adicionais separados, sem conteúdo liberado ou compra simulada.

O progresso separa nove treinos de oito aulas complementares (seis introdutórias, uma apresentação do bônus e encerramento). Não registra dias praticados nem comprova reprodução dos vídeos. A fase e o próximo treino são calculados pela próxima conclusão pendente na sequência, sem simular acompanhamento por data. As conclusões dos seis treinos da versão anterior são preservadas pelos IDs, mesmo com a nova numeração exibida. Fontes são servidas localmente, sem Google Fonts ou rastreamento.

## Conteúdos definitivos

`src/data.js` centraliza módulos, aulas, fases, programação, receitas, materiais e direitos de acesso. Os textos explicativos de aulas e a composição das telas ficam em `src/main.jsx`; estilos base em `src/style.css` e nova identidade em `src/theme.css`. `src/Journey.jsx` apresenta treinos e progresso; `src/Hydration.jsx` mantém meta e consumo diário localmente. Não há sincronização entre aparelhos.

- Aulas: preencha `videoUrl` com caminho do vídeo aprovado; `coverUrl` opcional fornece o pôster. O player real só aparece quando há vídeo.
- Materiais alimentares: preencha `materials[].url` com um arquivo real em `public/materials/` ou URL válida.
- Vídeos e imagens: coloque os arquivos em `public/videos/` e `public/covers/` e use caminhos `/videos/arquivo.mp4`, por exemplo.
- Receitas: substitua os cinco exemplos em `recipes`. Atualize os avisos de conteúdo demonstrativo e a quantidade final somente após revisão do material real.
- Calendário: `schedule` contém nove dias de treino sugeridos (1, 3 e 5 de cada bloco de sete dias) e doze de recuperação. Essa distribuição é apenas demonstrativa; não foi aprovada pelo Gabriel. Ajuste os dados aos dias aprovados e altere `scheduleIsDemonstration` somente quando a programação estiver confirmada. Cada dia também lista os três treinos da fase; dia 21 inclui encerramento.
- Adicionais: `entitlements` mantém ambos como `false`; não controla autenticação ou autorização real. Prazo padrão indefinido (`null`).

Ainda são necessários vídeos e orientações aprovadas pelo Gabriel, exercícios e adaptações definitivos, mensagem de encerramento, folha de hábitos, e-book e demais PDFs, receitas revisadas/quantidade confirmada, dias exatos de treinos e recuperação, prazo de acesso e condições dos adicionais. Capas atuais são composições tipográficas; nenhuma foto ou resultado foi inventado.

## Validação

```sh
npm run build
npm test
```

28 testes Playwright aprovados em 1440 × 1000 e 390 × 844 cobrem navegação, menu móvel, ausência de overflow horizontal nas principais telas, estrutura, persistência e reversão, calendário, treinos, filtros, fichas e materiais ausentes. Capturas são geradas em `artifacts/desktop.png` e `artifacts/mobile.png`, além de capturas de treinos, calendário, alimentação e hidratação para as duas resoluções. `npm test` recompila e exporta a prévia antes dos testes. Os testes também validam a migração do progresso anterior, todas as páginas individuais, separação dos progressos e hidratação (registro, reversão, persistência e novo dia).

O ambiente atual já possui Chromium em `/usr/bin/chromium`. Em outra máquina, instale o navegador com `npx playwright install chromium`; o arquivo de configuração usa o Chromium do sistema quando disponível, ou o navegador do Playwright.

## Restauração e preservação

Antes da reformulação foi criada a tag local `restore/pre-reformulacao-15m36-20261104`, no commit `91a734c`, e um arquivo completo dos arquivos versionados em `/workspace/15m36-before-redesign.tar.gz`. Nenhum arquivo original foi excluído. A nova numeração dos treinos usa IDs estáveis para não associar conclusões antigas a outras fases. Receita alguma foi adicionada: os cinco exemplos anteriores permanecem demonstrativos. O envio desta versão à branch principal foi autorizado pelo usuário. Nas próximas alterações, mantenha a prévia atualizada no GitHub e informe o endereço público permanente.

A hidratação usa `15m36-hydration-v1` no localStorage: meta manual e registros do dia local do aparelho. No novo dia, mantém a meta e reinicia o consumo. As conclusões continuam em `15m36-progress-v1`. Não há histórico remoto, autenticação, prescrição de água ou acompanhamento individual. A entrega e os direitos de acesso reais dependem da futura configuração na Hotmart.
