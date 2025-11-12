# Books App - Sua Estante de Livros Digital

O Books App é uma aplicação web completa que permite aos usuários gerenciar uma biblioteca de livros pessoal. Com ele, você pode pesquisar em um catálogo global, adicionar livros à sua estante, visualizar detalhes e organizar sua coleção.

## Funcionalidades

- **Autenticação de Usuários:** Sistema seguro de login e registro com tokens JWT.
- **Catálogo Global de Livros:** Busque livros por título, autor ou ISBN em um catálogo compartilhado.
- **Estante Pessoal:** Adicione e remova livros da sua biblioteca pessoal.
- **Visualização de Detalhes:** Clique em um livro para ver informações como capa, gênero, número de páginas e mais.
- **Filtro e Ordenação:** Organize sua estante por gênero ou ordene por título e autor.
- **Prevenção de Duplicatas:** O sistema impede que o mesmo livro (baseado no ISBN) seja cadastrado mais de uma vez no catálogo global.

## Tecnologias Utilizadas

### Frontend
- **React** com **Vite**
- **TypeScript**
- **React Router** para gerenciamento de rotas
- **Axios** para requisições HTTP
- **CSS** para estilização

### Backend
- **Node.js** com **Express**
- **MongoDB** com **Mongoose** para o banco de dados
- **JSON Web Tokens (JWT)** para autenticação
- **CORS** para gerenciamento de requisições cross-origin

---

## Configuração e Instalação

Para rodar este projeto localmente, você precisará ter o **Node.js** e o **MongoDB** instalados na sua máquina.

### 1. Configuração do Backend

Primeiro, vamos configurar o servidor.

a. **Navegue até a pasta do backend:**
```bash
cd backend
```

b. **Instale as dependências:**
```bash
npm install
```

c. **Crie o arquivo de ambiente:**
Crie um arquivo chamado `.env` dentro da pasta `backend` e adicione as seguintes variáveis. Você precisará fornecer seus próprios valores para a string de conexão do MongoDB e para o segredo JWT.

```env
# Porta em que o servidor vai rodar (pode manter 5000)
PORT=5000

# String de conexão do seu banco de dados MongoDB
MONGO_URI=<sua_string_de_conexao_do_mongodb>

# Chave secreta para gerar os tokens JWT (use um gerador de senhas fortes)
JWT_SECRET=<seu_segredo_jwt_aqui>
```

d. **Inicie o servidor backend:**
Para rodar o servidor em modo de desenvolvimento (com reinicialização automática), use:
```bash
npm run dev
```
O servidor estará disponível em `http://localhost:5000`.

### 2. Configuração do Frontend

Agora, vamos configurar a interface do usuário.

a. **Abra um novo terminal** e navegue até a pasta raiz do projeto (se você estiver dentro da pasta `backend`, volte um nível com `cd ..`).

b. **Instale as dependências do frontend:**
```bash
npm install
```

c. **Inicie a aplicação React:**
```bash
npm run dev
```
A aplicação estará disponível em `http://localhost:5173` (ou outra porta indicada pelo Vite).

---

## Uso

Após iniciar ambos os servidores, abra seu navegador e acesse o endereço do frontend. Você poderá se registrar, fazer login e começar a usar a sua estante de livros digital!