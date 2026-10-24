# Entrega — Listagem de Matrizes Curriculares

## Escopo confirmado nos quatro prints

Os quatro prints pertencem à tarefa pai **#338 — Listagem de Matrizes 2**. São quatro tarefas da mesma tela, e não quatro telas diferentes. A implementação reúne os requisitos em uma única página, sem adicionar cadastro, edição, exclusão, login ou outros módulos.

| Print | Tarefa | Implementação |
|---|---|---|
| 1 | #341 — Cabeçalho, botão + e filtro | Texto “GESTÃO ACADÊMICA”, título “Matrizes Curriculares”, botão +, seletor “Filtrar por curso”, opção “Todos os cursos”, três cursos e contador “Matrizes cadastradas”. |
| 2 | #342 — Filtro e lista vazia | Filtra os cards, atualiza a quantidade e exibe exatamente “Nenhuma matriz cadastrada” quando o resultado é vazio. |
| 3 | #339 — Tela e dados fixos | Cinco matrizes, cada uma com nome, curso e quantidade de disciplinas, além de três cursos fixos. |
| 4 | #340 — Cards | Um card por matriz; clicar ou acionar com Enter apenas registra o objeto da matriz no console. |

O print #339 cita `ListagemMatrizesScreen.js`. A implementação utiliza `ListagemMatrizesScreen.jsx`, mantendo o nome e usando a extensão JSX solicitada para a versão web.

O print #340 cita `FlatList`, componente de React Native. Como a instrução mais recente exige React web com JSX e CSS, a lista foi adaptada para `ul` e `map`, com chaves estáveis e o mesmo comportamento. Não foi introduzido React Native ou Expo nesta entrega.

## Base recebida e preservação

O ZIP recebido continha apenas o `README.md` e metadados do Git. Não havia `package.json`, telas, componentes, rotas, testes ou protótipo visual no conteúdo de trabalho.

O README original foi preservado byte a byte. Os demais arquivos desta entrega são novos. Não houve commit, push, reorganização de módulos da equipe ou execução de hooks do Git. A pasta original indicada estava bloqueada; o trabalho foi feito na cópia disponibilizada a partir do ZIP, dentro do espaço desta conversa.

Como referência obrigatória foi consultado o protótipo RiseUP anterior, disponível nesta mesma conversa, especialmente `Catalog.jsx`, `UI.jsx` e `mockData.js`. Foram reaproveitados como referência: azul `#2457E3`, fundo `#F4F6FB`, texto `#152846`, texto secundário `#738199`, bordas `#E5EAF2`, cards brancos arredondados, fonte do sistema, marca, cabeçalho e rodapé. Os componentes React Native não podem ser importados diretamente em React DOM; sua aparência foi adaptada para JSX e CSS.

## Arquivos criados

| Arquivo | Responsabilidade |
|---|---|
| `package.json` | Scripts e dependências mínimas: React, React DOM e Vite. |
| `package-lock.json` | Versões reproduzíveis das dependências. |
| `index.html` | Entrada HTML com o elemento raiz da aplicação. |
| `vite.config.js` | Configuração mínima do build, com caminhos relativos. |
| `.gitignore` | Ignora dependências, build e metadados do macOS. |
| `src/main.jsx` | Inicialização da aplicação React. |
| `src/App.jsx` | Cabeçalho e rodapé do protótipo, contendo apenas a página de matrizes. |
| `src/pages/ListagemMatrizesScreen.jsx` | Estado do curso selecionado, filtro, contador, lista e estado vazio. |
| `src/components/MatrizCard.jsx` | Card reutilizado nas cinco matrizes; clique gera apenas `console.log`. |
| `src/components/Icone.jsx` | Ícones SVG reutilizados na tela e no rodapé, sem depender de arquivos de fontes. |
| `src/data/matrizes.js` | Arrays fixos de três cursos e cinco matrizes. |
| `src/styles/global.css` | Tema, fonte, cabeçalho, marca e rodapé. |
| `src/styles/matrizes.css` | Estilos da página, filtro, cards, contador e estado vazio. |
| `ENTREGA_SPRINTS.md` | Mapeamento das tarefas, execução e validação. |

Nenhum comentário foi adicionado ao código-fonte. Não há CSS extenso dentro dos componentes, imports de bibliotecas de interface, imagens remotas ou servidor de aplicação.

## Como executar no Mac e no VS Code

Instale Node.js 20.19+ ou 22.12+ compatível com as dependências. Abra a pasta `EduGestaoPublica-squad-56`, que contém o `package.json`, no VS Code. No terminal dessa pasta:

```bash
npm ci
npm run dev
```

Abra o endereço exibido no terminal, normalmente **http://127.0.0.1:5173**. Mantenha o terminal aberto durante a demonstração. Não abra `index.html` diretamente pelo Finder.

Para gerar a versão de produção:

```bash
npm run build
```

Para conferir essa versão localmente:

```bash
npm run preview
```

Use a URL impressa pelo Vite. O servidor do Vite atende somente ao desenvolvimento e à prévia do front-end; não existe Back-End Node.js/Express nesta entrega.

Referências oficiais utilizadas para preparar a base: [Vite](https://vite.dev/guide/) e [React createRoot](https://react.dev/reference/react-dom/client/createRoot).

## Roteiro curto de demonstração

1. A página abre diretamente em Matrizes Curriculares, sem login ou telas adicionais.
2. A opção “Todos os cursos” exibe cinco cards e contador 5.
3. Escolha Ensino Médio Integral: duas matrizes e contador 2.
4. Escolha Ensino Médio Regular: três matrizes e contador 3.
5. Escolha Educação de Jovens e Adultos: contador 0 e “Nenhuma matriz cadastrada”.
6. Volte a Todos os cursos para restaurar a lista completa.
7. Abra o console do navegador e clique em um card. O objeto da matriz aparece com a mensagem “Matriz selecionada:”. O clique não abre outra tela nem altera dados.
8. Navegue por Tab e acione um card com Enter para demonstrar o acesso por teclado.

## Limitações intencionais

- As cinco matrizes e os três cursos são dados fictícios fixos. Não há API, banco, Python, autenticação, cadastro ou persistência externa.
- O filtro usa somente `useState` e `filter`. Recarregar a página volta para Todos os cursos. Não foi adicionado LocalStorage porque não há registros sendo criados ou alterados neste escopo.
- EJA está sem matrizes de exemplo para permitir demonstrar o estado vazio. Isso é uma escolha dos dados de demonstração, não uma regra que proíba matrizes nesse curso.
- O botão + está visível e desabilitado com uma descrição, pois o cadastro não foi atribuído nos prints. Ele não abre um formulário fora do escopo.
- O rodapé preserva a aparência do protótipo, mas os atalhos para outros módulos estão desabilitados. Não foram criadas páginas extras para habilitá-los.
- Não foi possível comparar com outro protótipo de desktop da equipe porque ele não estava no ZIP. A fidelidade visual é em relação ao protótipo RiseUP anterior desta conversa.

## Validação realizada

| Verificação | Resultado |
|---|---|
| Instalação com `npm install` | Concluída; lockfile gerado. |
| `npm run build` | Passou, sem erros de compilação ou imports. |
| Inicialização com `npm run dev` | Funcionou localmente. |
| Todos os cursos | 5 cards, contador 5. |
| Ensino Médio Integral | 2 cards, contador 2. |
| Ensino Médio Regular | 3 cards, contador 3. |
| EJA | 0 cards, contador 0 e mensagem vazia exata. |
| Retorno a Todos os cursos | Restaurou os 5 cards. |
| Clique do card | Gerou apenas `console.log`; não navegou nem alterou registros. |
| Enter no card | Acionou o mesmo comportamento. |
| Console durante os fluxos verificados | Nenhum erro ou aviso capturado. |
| Layout desktop de 1365 px | Sem rolagem horizontal. |
| Layout mobile de 390 px | Sem rolagem horizontal. |
| README original | Preservado byte a byte. |
| Comentários no código | Nenhum encontrado. |

O repositório recebido não tinha uma suíte de testes automatizados. Não foi adicionada uma biblioteca de testes apenas para esta tela; as interações foram verificadas no navegador e o build foi executado. A ausência de testes automatizados não é apresentada como uma suíte aprovada.

A tela está pronta para demonstração acadêmica do escopo #339 a #342. Para integrar no repositório da equipe, copie os arquivos novos mantendo o `.git` original. Se a equipe acrescentou código após a criação do ZIP, integre a página e os estilos de forma pontual; não substitua arquivos compartilhados novos sem comparar.
