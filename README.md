# Asset Tree View

## Visão Geral

Aplicação de visualização em árvore para ativos industriais, permitindo aos usuários explorar e filtrar uma hierarquia complexa de locais, ativos e componentes 

## Demonstração
https://github.com/user-attachments/assets/d28ad805-9205-42a0-ac63-46a6967a266a

## Funcionalidades

1. **Visualização em Árvore**:

   - Exibe uma estrutura hierárquica de locais, componentes e ativos.
   - Ícones distintos para diferentes tipos de nós (locais, ativos, componentes).
   - Seleção de Ativos

2. **Filtragem**:

   - Busca por texto: Permite aos usuários procurar por nomes específicos de componentes, ativos ou locais.
   - Filtro de sensores de energia: Isola sensores de energia na árvore.
   - Filtro de status crítico: Identifica ativos com status de sensor crítico.

3. **Design Responsivo**:

   - A interface se adapta a diferentes tamanhos de tela.

4. **Acessibilidade**:

    - Implementa boas práticas de acessibilidade.
    - Suporte a navegação por teclado e leitores de tela.

5. **Otimização de Performance**:
   - Renderização eficiente para grandes conjuntos de dados usando técnicas como `virtualização` `memoization` e `code splitting`.

## Melhorias Futuras

Algumas áreas que poderiam ser melhoradas com mais tempo / detalhes sobre o requisito:

1. Implementação de testes e-2-e e unitários.
2. Adição de mais opções de filtragem e ordenação.
3. Implementação de cache para melhorar o tempo de carregamento de dados frequentemente acessados.

## Tecnologias Utilizadas

- React
- TypeScript
- `react-window` para virtualização de lista
- Context API do React para gerenciamento de estado

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

## Contato
Email: victorbtst77@gmail.com


