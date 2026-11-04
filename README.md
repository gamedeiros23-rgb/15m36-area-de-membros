# Desafio 15M36 · Área de membros

Protótipo navegável em React + Vite, baseado no PDF de especificação. A entrega oficial continua na Hotmart. Sem autenticação, pagamento, banco de dados ou coleta de informações pessoais.

## Arquivos disponíveis no GitHub

- [Baixar pacote para publicação](https://github.com/gamedeiros23-rgb/15m36-area-de-membros/raw/refs/heads/main/preview/15m36-site.zip)
- [Prévia HTML independente](preview/index.html): use o botão **Download raw file** no GitHub para baixar; depois abra no navegador.
- [Captura de computador](preview/desktop.png) e [captura de celular](preview/mobile.png).

A pasta `preview/` contém uma cópia da versão avaliada, incluída no Git para download. Para atualizá-la após alterações, execute `npm run export:preview`, copie `artifacts/15m36-prototipo.html` para `preview/index.html` e gere novamente o ZIP com esse HTML como `index.html` na raiz. O GitHub armazena os arquivos; um link público navegável exige uma publicação separada em GitHub Pages, Netlify ou Vercel. Acesso a repositório privado exige permissão no GitHub.

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

- Página inicial, cinco módulos na ordem oficial, seis treinos (dois por fase) e encerramento.
- Próxima aula pendente, conclusão reversível e progresso salvo por navegador.
- Calendário com as três fases, sem impor dias de treino ou frequência ainda não aprovada.
- Filtros por refeição e preparo, cinco fichas demonstrativas completas.
- Menu móvel, navegação por teclado, diálogo de receita com foco e fechamento por Escape.
- Vídeos ausentes sem reprodução fictícia; materiais ausentes sem downloads falsos.
- Adicionais separados, sem conteúdo liberado ou compra simulada.

O progresso contabiliza 14 aulas únicas (seis introdutórias, uma apresentação do bônus, seis treinos e encerramento). Não registra dias praticados. Fontes são servidas localmente, sem Google Fonts ou rastreamento.

## Conteúdos definitivos

`src/data.js` centraliza módulos, aulas, fases, programação, receitas, materiais e direitos de acesso. Os textos explicativos de aulas e a composição das telas ficam em `src/main.jsx`; estilos em `src/style.css`.

- Aulas: preencha `videoUrl` com caminho do vídeo aprovado; `coverUrl` opcional fornece o pôster. O player real só aparece quando há vídeo.
- Materiais alimentares: preencha `materials[].url` com um arquivo real em `public/materials/` ou URL válida.
- Vídeos e imagens: coloque os arquivos em `public/videos/` e `public/covers/` e use caminhos `/videos/arquivo.mp4`, por exemplo.
- Receitas: substitua os cinco exemplos em `recipes`. Atualize os avisos de conteúdo demonstrativo e a quantidade final somente após revisão do material real.
- Calendário: `schedule` reserva `workoutId: null` em todos os dias. A interface lista os dois vídeos da fase, sem inventar frequência. Após aprovação, implementar a apresentação da programação definitiva.
- Adicionais: `entitlements` mantém ambos como `false`; não controla autenticação ou autorização real. Prazo padrão indefinido (`null`).

Ainda são necessários vídeos e orientações aprovadas pelo Gabriel, exercícios e adaptações definitivos, mensagem de encerramento, folha de hábitos, e-book e demais PDFs, receitas revisadas/quantidade confirmada, frequência de treinos e recuperação, prazo de acesso e condições dos adicionais. Capas atuais são composições tipográficas; nenhuma foto ou resultado foi inventado.

## Validação

```sh
npm run build
npm test
```

Testes Playwright em 1440 × 1000 e 390 × 844 cobrem navegação, menu móvel, ausência de overflow horizontal nas principais telas, estrutura, persistência e reversão, calendário, treinos, filtros, fichas e materiais ausentes. Capturas são geradas em `artifacts/desktop.png` e `artifacts/mobile.png`.

O ambiente atual já possui Chromium em `/usr/bin/chromium`. Em outra máquina, instale o navegador com `npx playwright install chromium`; o arquivo de configuração usa o Chromium do sistema quando disponível, ou o navegador do Playwright.
