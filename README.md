# Asset Tree View

## Visão Geral

Este projeto implementa uma aplicação de visualização em árvore para ativos industriais, permitindo aos usuários explorar e filtrar uma hierarquia complexa de locais, ativos e componentes. A aplicação foi desenvolvida como parte de um desafio de engenharia de software front-end, focando em performance, usabilidade e design responsivo.

## Funcionalidades

1. **Visualização em Árvore**:

   - Exibe uma estrutura hierárquica de locais, ativos e componentes.
   - Utiliza ícones distintos para diferentes tipos de nós (locais, ativos, componentes).

2. **Filtragem Avançada**:

   - Busca por texto: Permite aos usuários procurar por nomes específicos de componentes, ativos ou locais.
   - Filtro de sensores de energia: Isola sensores de energia na árvore.
   - Filtro de status crítico: Identifica ativos com status de sensor crítico.

3. **Design Responsivo**:

   - A interface se adapta a diferentes tamanhos de tela.

4. **Acessibilidade**:

    - Implementa práticas de acessibilidade para garantir que a aplicação seja utilizável por pessoas com deficiências.
    - Suporte a navegação por teclado e leitores de tela.

5. **Otimização de Performance**:
   - Implementa renderização eficiente para grandes conjuntos de dados usando `react-window` `memoization` e `code splitting`.

## Tecnologias Utilizadas

- React
- TypeScript
- `react-window` para virtualização de lista
- Context API do React para gerenciamento de estado
- Tailwind CSS para estilização

## Estrutura do Projeto

O projeto é composto principalmente por dois componentes principais:

- `Home`: Componente principal onde está localizado a Árvore e o Layout do componente "geral"
- `Tree`: Componente responsável pela renderização da estrutura em árvore.

## Como Executar o Projeto

1. Clone o repositório:

   ```
   git clone [https://github.com/NiceColors/tractian-front-end-software-engineer-challenge.git]
   cd [tractian-front-end-software-engineer-challenge]
   ```

2. Instale as dependências:

   ```
   npm install
   ```

   ou

   ```
   pnpm install
   ```

   ou

   ```
   yarn install
   ```

3. Inicie o servidor de desenvolvimento:

   ```
   npm run dev
   ```

4. Abra o navegador e acesse `http://localhost:5173/`

## Melhorias Futuras

Algumas áreas que poderiam ser melhoradas com mais tempo / detalhes sobre o requisito:

1. Implementação de testes e-2-e e unitários.
2. Adição de mais opções de filtragem e ordenação.
3. Implementação de cache para melhorar o tempo de carregamento de dados frequentemente acessados.

## Demonstração

## Contato
