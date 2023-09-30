#  🫰 Projeto API Para Controle de Finanças

## Descrição do Projeto

Esta é uma API Rest para uma aplicação de controle de finanças Pessoais com integração ao banco de dados, criptografia e autenticação de usuário, desenvolvida com NodeJs, Express, banco de dados PostgreSQL e Insomnia para testar as rotas e funcionalidades. 

## Tecnologias utilizads neste projeto:
<img alt="logo da linguagem Javascript" src="https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E"> <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Logo nodejs">
<img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge" alt="Logo express"> <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="Logo posgtres">

## Como utilizar, testar ou modificar?

- [ ] Você pode baixar fazer o download deste repô para sua máquina ou ainda forkar ou clonar esse repositório para o seu GitHub
- [ ] Dentro da pasta do projeto(em sua máquina) execute o comando "npm install" para instalar as dependências("bcrypt", "express", "jsonwebtoken", "pg" e "nodemon") do projeto.
- [ ] Dentro da pasta do projeto em (dump.sql) estão os comandos necessários para criação de uma banco de dados local.
- [ ] Neste Readme estão as instruções para facilitar a criação deste banco de dados local.
- [ ] Abaixo estão informações para facilitar o entendimento do projeto.
- [ ] Se sinta livre para contribuir, testar e evoluir esse projeto!

**Features:**
- Cadastrar Usuário
- Fazer Login
- Detalhar Perfil do Usuário Logado
- Editar Perfil do Usuário Logado
- Listar categorias
- Listar transações
- Detalhar transação
- Cadastrar transação
- Editar transação
- Remover transação
- Obter extrato de transações

**Algumas regras de negócio**

**Cada usuário só pode ver e manipular seus próprios dados e suas próprias transações**

**Sempre que a validação de uma requisição falhar, é respondida com código de erro e mensagem adequada à situação.**

**Exemplo:**

```javascript
// Quando é informado um id de transação que não existe:
// HTTP Status 404
{
    "mensagem": "Transação não encontrada!"
}
```

## **Banco de dados**

- Para testar esta API, você precisa criar um Banco de dados local conforme os passos abaixo:
   - Copiar o código que está no arquivo "dump.sql".
   - Colar e executá-lo em um editor/gerenciador SQL de sua preferência (recomendo o Beekeeper Studio: https://www.beekeeperstudio.io) para criar um Banco de Dados PostgreSQL chamado `dindin`.
   - Seŕa criado um Banco de dados contendo as seguintes tabelas e colunas abaixo:
       
- usuarios
  - id
  - nome
  - email (campo único)
  - senha
- categorias
  - id
  - descricao
- transacoes
  - id
  - descricao
  - valor
  - data
  - categoria_id
  - usuario_id
  - tipo
    
**ATENÇÃO! Os nomes das tabelas e das colunas a serem criados devem seguir exatamente os nomes listados abaixo.**

## Também devem ser inseridas em seguida, as categorias para que sejam listadas no endpoint de listagem das categorias(já há o comando para isso no arquivo "dump.sql" bastando executá-lo).

## **Categorias**

- Alimentação
- Assinaturas e Serviços
- Casa
- Mercado
- Cuidados Pessoais
- Educação
- Família
- Lazer
- Pets
- Presentes
- Roupas
- Saúde
- Transporte
- Salário
- Vendas
- Outras receitas
- Outras despesas

## **Requisitos e informações deste Banco de Dados**

- A API acessará o banco de dados a ser criado "dindin" para persistir e manipular os dados de usuários, categorias e transações utilizados pela aplicação.
- O campo `id` das tabelas no banco de dados é do tipo auto incremento, chave primária e não permite edição uma vez criado.
- O código esta organizado, delimitando as responsabilidades de cada arquivo adequadamente.
- Qualquer valor monetário é representado em centavos (Ex.: R$ 10,00 reais = 1000)

## **Status Codes**

Abaixo, estão os possíveis **_status codes_** esperados como resposta da API.

```javascript
// 200 (OK) = requisição bem sucedida
// 201 (Created) = requisição bem sucedida e algo foi criado
// 204 (No Content) = requisição bem sucedida, sem conteúdo no corpo da resposta
// 400 (Bad Request) = o servidor não entendeu a requisição pois está com uma sintaxe/formato inválido
// 401 (Unauthorized) = o usuário não está autenticado (logado)
// 403 (Forbidden) = o usuário não tem permissão de acessar o recurso solicitado
// 404 (Not Found) = o servidor não pode encontrar o recurso solicitado
```

## **Endpoints**

### **Cadastrar usuário**

#### `POST` `/usuario`

Essa é a rota que será utilizada para cadastrar um novo usuario no sistema.

- **Requisição**  
  Sem parâmetros de rota ou de query.  
  O corpo (body) deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes):

  - nome
  - email
  - senha

- **Resposta**  
  Em caso de **sucesso**, será enviado no corpo (body) da resposta o conteúdo do usuário cadastrado, incluindo seu respectivo `id` e excluindo a senha criptografada.
  Em caso de **falha na validação**, a resposta possui **_status code_** apropriado, e em seu corpo (body) e um objeto com uma propriedade **mensagem** que possuir como valor um texto explicando o motivo da falha.

- **REQUISITOS E VALIDAÇÕES**
  - Valida os campos obrigatórios:
    - nome
    - email
    - senha
  - Valida se o e-mail informado já existe
  - Criptografa a senha antes de persistir no banco de dados
  - Cadastra o usuário no banco de dados

#### **Exemplo de requisição**

```javascript
// POST /usuario
{
    "nome": "José",
    "email": "jose@email.com",
    "senha": "123456"
}
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200 / 201 / 204
{
    "id": 1,
    "nome": "José",
    "email": "jose@email.com"
}
```

```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "Já existe usuário cadastrado com o e-mail informado."
}
```

### **Login do usuário**

#### `POST` `/login`

Essa é a rota que permite o usuario cadastrado realizar o login no sistema.

- **Requisição**  
  Sem parâmetros de rota ou de query.  
  O corpo (body) deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes):

  - email
  - senha

- **Resposta**  
  Em caso de **sucesso**, o corpo (body) da resposta possui um objeto com a propriedade **token** que possui como valor o token de autenticação gerado e uma propriedade **usuario** que possui as informações do usuário autenticado, exceto a senha do usuário.  
  Em caso de **falha na validação**, a resposta possui **_status code_** apropriado, e em seu corpo (body) possui um objeto com uma propriedade **mensagem** que possui como valor um texto explicando o motivo da falha.

- **REQUISITOS E VALIDAÇÕES**

  - Valida os campos obrigatórios:
    - email
    - senha
  - Verifica se o e-mail existe
  - Valida e-mail e senha
  - Cria um token de autenticação com id do usuário para uso interno do sistema

#### **Exemplo de requisição**

```javascript
// POST /login
{
    "email": "jose@email.com",
    "senha": "123456"
}
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200 / 201 / 204
{
    "usuario": {
        "id": 1,
        "nome": "José",
        "email": "jose@email.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjIzMjQ5NjIxLCJleHAiOjE2MjMyNzg0MjF9.KLR9t7m_JQJfpuRv9_8H2-XJ92TSjKhGPxJXVfX6wBI"
}
```

```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "Usuário e/ou senha inválido(s)."
}
```

---

## **ATENÇÃO**: Todas as funcionalidades (endpoints) a seguir, a partir desse ponto, exigirão o token de autenticação do usuário logado, recebendo no header com o formato Bearer Token. Portanto, em cada funcionalidade será necessário validar o token informado. 
## RECOMENDO O USO DO INSOMNIA (https://insomnia.rest/download) PARA FACILITAR OS TESTE. 
## LEMBRE-SE DE ADICIONAR O PARÂMETRO DE BEARER TOKEN  e colar neste o token que é gerado na rota de login. 
## COMO ASSIM, ADICIONAR O PARÂMETRO?
   - Cada vez que há um log no sistema, é gerado um token que pode ser acessado no body de resposta da rota de login, para conferir a autenticação deste usuário.
---

### **Validações do token**

- **REQUISITOS E VALIDAÇÕES**
  - Valida se o token foi enviado no header da requisição (Bearer Token)
  - Verifica se o token é válido
  - Consulta usuário no banco de dados pelo id contido no token informado

### **Detalhar usuário**

#### `GET` `/usuario`

Essa é a rota que será chamada quando o usuario quiser obter os dados do seu próprio perfil.  
**Atenção!:** O usuário é identificado através do ID presente no token de autenticação.

- **Requisição**  
  Sem parâmetros de rota ou de query.  
  Não deverá possuir conteúdo no corpo da requisição.

- **Resposta**  
  Em caso de **sucesso**, o corpo (body) da resposta possui um objeto que representa o usuário encontrado, com todas as suas propriedades (exceto a senha), conforme exemplo abaixo, acompanhado de **_status code_** apropriado.  
  Em caso de **falha na validação**, a resposta possui **_status code_** apropriado, e em seu corpo (body) possui um objeto com uma propriedade **mensagem** que possui como valor um texto explicando o motivo da falha.  
  **Dica:** neste endpoint podemos fazer uso do status code 401 (Unauthorized).

#### **Exemplo de requisição**

```javascript
// GET /usuario
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200 / 201 / 204
{
    "id": 1,
    "nome": "José",
    "email": "jose@email.com"
}
```

```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "Para acessar este recurso um token de autenticação válido deve ser enviado."
}
```

### **Atualizar usuário**

#### `PUT` `/usuario`

Essa é a rota que será chamada quando o usuário quiser realizar alterações no seu próprio usuário.  
**Atenção!:** O usuário será identificado através do ID presente no token de autenticação.

- **Requisição**  
  Sem parâmetros de rota ou de query.  
  O corpo (body) deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes):

  - nome
  - email
  - senha

- **Resposta**  
  Em caso de **sucesso**, não é enviado conteúdo no corpo (body) da resposta.  
  Em caso de **falha na validação**, a resposta possui **_status code_** apropriado, e em seu corpo (body) possui um objeto com uma propriedade **mensagem** que possui como valor um texto explicando o motivo da falha.

- **REQUISITOS E VALIDAÇÕES**
  - Valida os campos obrigatórios:
    - nome
    - email
    - senha
  - Valida se o novo e-mail já existe no banco de dados para outro usuário
    - Caso já exista o novo e-mail fornecido para outro usuário no banco de dados, a alteração não será permitida (o campo de email é único no banco de dados)
  - Criptografa a senha antes de salvar no banco de dados
  - Atualiza as informações do usuário no banco de dados

#### **Exemplo de requisição**

```javascript
// PUT /usuario
{
    "nome": "José de Abreu",
    "email": "jose_abreu@email.com",
    "senha": "j4321"
}
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200 / 201 / 204
// Sem conteúdo no corpo (body) da resposta
```

```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "O e-mail informado já está sendo utilizado por outro usuário."
}
```

### **Listar categorias**

#### `GET` `/categoria`

Essa é a rota que será chamada quando o usuario logado quiser listar todas as categorias cadastradas.

- **Requisição**  
  Sem parâmetros de rota ou de query.  
  Não deverá possuir conteúdo no corpo (body) da requisição.

- **Resposta**  
  Em caso de **sucesso**, o corpo (body) da resposta possui um array dos objetos (categorias) encontrados.  
  Em caso de **falha na validação**, a resposta possui **_status code_** apropriado, e em seu corpo (body) possui um objeto com uma propriedade **mensagem** que possui como valor um texto explicando o motivo da falha.

- **REQUISITOS E VALIDAÇÕES**
  - O endpoint responde com um array de todas as categorias cadastradas.

#### **Exemplo de requisição**

```javascript
// GET /categoria
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200 / 201 / 204
[
  {
    id: 1,
    descricao: "Roupas",
  },
  {
    id: 2,
    descricao: "Mercado",
  },
];
```

```javascript
// HTTP Status 200 / 201 / 204
[];
```

### **Listar transações do usuário logado**

#### `GET` `/transacao`

Essa é a rota que será chamada quando o usuario logado quiser listar todas as suas transações cadastradas.  
Serão retornadas **apenas** transações associadas ao usuário logado, que será identificado através do ID presente no token de validação.

- **Requisição**  
  Sem parâmetros de rota ou de query.  
  Não deverá possuir conteúdo no corpo (body) da requisição.

- **Resposta**  
  Em caso de **sucesso**, o corpo (body) da resposta possui um array dos objetos (transações) encontrados.  
  Em caso de **falha na validação**, a resposta possui **_status code_** apropriado, e em seu corpo (body) possui um objeto com uma propriedade **mensagem** que possui como valor um texto explicando o motivo da falha.

- **REQUISITOS E VALIDAÇÕES**
  - O usuário será identificado através do ID presente no token de validação
  - O endpoint responderá com um array de todas as transações associadas ao usuário. Caso não exista nenhuma transação associada ao usuário irá responder com array vazio.

#### **Exemplo de requisição**

```javascript
// GET /transacao
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200 / 201 / 204
[
  {
    id: 1,
    tipo: "saida",
    descricao: "Sapato amarelo",
    valor: 15800,
    data: "2022-03-23T15:35:00.000Z",
    usuario_id: 5,
    categoria_id: 4,
    categoria_nome: "Roupas",
  },
  {
    id: 3,
    tipo: "entrada",
    descricao: "Salário",
    valor: 300000,
    data: "2022-03-24T15:30:00.000Z",
    usuario_id: 5,
    categoria_id: 6,
    categoria_nome: "Salários",
  },
];
```

```javascript
// HTTP Status 200 / 201 / 204
[];
```

### **Detalhar uma transação do usuário logado**

#### `GET` `/transacao/:id`

Essa é a rota que será chamada quando o usuario logado quiser obter uma das suas transações cadastradas.  
Ser retornado **apenas** transação associada ao usuário logado, que será identificado através do ID presente no token de validação.

- **Requisição**  
  Deverá ser enviado o ID da transação no parâmetro de rota do endpoint.  
  O corpo (body) da requisição não deverá possuir nenhum conteúdo.

- **Resposta**  
  Em caso de **sucesso**, o corpo (body) da resposta possui um objeto que representa a transação encontrada, com todas as suas propriedades, conforme exemplo abaixo, acompanhado de **_status code_** apropriado.  
  Em caso de **falha na validação**, a resposta possui **_status code_** apropriado, e em seu corpo (body) possui um objeto com uma propriedade **mensagem** que possuir como valor um texto explicando o motivo da falha.

- **REQUISITOS E VALIDAÇÕES**
  - Valida se existe transação para o id enviado como parâmetro na rota e se esta transação pertence ao usuário logado.

#### **Exemplo de requisição**

```javascript
// GET /transacao/2
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200 / 201 / 204
{
    "id": 3,
    "tipo": "entrada",
    "descricao": "Salário",
    "valor": 300000,
    "data": "2022-03-24T15:30:00.000Z",
    "usuario_id": 5,
    "categoria_id": 6,
    "categoria_nome": "Salários",
}
```

```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "Transação não encontrada."
}
```

### **Cadastrar transação para o usuário logado**

#### `POST` `/transacao`

Essa é a rota que será utilizada para cadastrar uma transação associada ao usuário logado.  
É possível cadastrar **apenas** transações associadas ao próprio usuário logado, que será identificado através do ID presente no token de validação.

- **Requisição**  
  Sem parâmetros de rota ou de query.  
  O corpo (body) da requisição deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes):

  - descricao
  - valor
  - data
  - categoria_id
  - tipo (campo que será informado se a transação corresponde a uma saída ou entrada de valores)

- **Resposta**
  Em caso de **sucesso**, é enviado, no corpo (body) da resposta, as informações da transação cadastrada, incluindo seu respectivo `id`.  
  Em caso de **falha na validação**, a resposta possui **_status code_** apropriado, e em seu corpo (body) possui um objeto com uma propriedade **mensagem** que possui como valor um texto explicando o motivo da falha.

- **REQUISITOS E VALIDAÇÕES**
  - Valida os campos obrigatórios:
    - descricao
    - valor
    - data
    - categoria_id
    - tipo
  - Valida se existe categoria para o id enviado no corpo (body) da requisição.
  - Valida se o tipo enviado no corpo (body) da requisição corresponde a palavra `entrada` ou `saida`, exatamente como descrito.
  - Cadastra a transação associada ao usuário logado.

#### **Exemplo de requisição**

```javascript
// POST /transacao
{
    "tipo": "entrada",
    "descricao": "Salário",
    "valor": 300000,
    "data": "2022-03-24T15:30:00.000Z",
    "categoria_id": 6
}
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200 / 201 / 204
{
    "id": 3,
    "tipo": "entrada",
    "descricao": "Salário",
    "valor": 300000,
    "data": "2022-03-24T15:30:00.000Z",
    "usuario_id": 5,
    "categoria_id": 6,
    "categoria_nome": "Salários",
}
```

```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "Todos os campos obrigatórios devem ser informados."
}
```

### **Atualizar transação do usuário logado**

#### `PUT` `/transacao/:id`

Essa é a rota que será chamada quando o usuario logado quiser atualizar uma das suas transações cadastradas.  
É possível atualizar **apenas** transações associadas ao próprio usuário logado, que será identificado através do ID presente no token de validação.

- **Requisição**  
  Deverá ser enviado o ID da transação no parâmetro de rota do endpoint.  
  O corpo (body) da requisição deverá possuir um objeto com as seguintes propriedades (respeitando estes nomes):

  - descricao
  - valor
  - data
  - categoria_id
  - tipo (campo que será informado se a transação corresponde a uma saída ou entrada de valores)

- **Resposta**  
  Em caso de **sucesso**, não é enviado conteúdo no corpo (body) da resposta.  
  Em caso de **falha na validação**, a resposta possui **_status code_** apropriado, e em seu corpo (body) possui um objeto com uma propriedade **mensagem** que possui como valor um texto explicando o motivo da falha.

- **REQUISITOS E VALIDAÇÕES**
  - Valida se existe transação para o id enviado como parâmetro na rota e se esta transação pertence ao usuário logado.
  - Valida os campos obrigatórios:
    - descricao
    - valor
    - data
    - categoria_id
    - tipo
  - Valida se existe categoria para o id enviado no corpo (body) da requisição.
  - Valida se o tipo enviado no corpo (body) da requisição corresponde a palavra `entrada` ou `saida`, exatamente como descrito.
  - Atualiza a transação no banco de dados

#### **Exemplo de requisição**

```javascript
// PUT /transacao/2
{
	"descricao": "Sapato amarelo",
	"valor": 15800,
	"data": "2022-03-23 12:35:00",
	"categoria_id": 4,
	"tipo": "saida"
}
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200 / 201 / 204
// Sem conteúdo no corpo (body) da resposta
```

```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "Todos os campos obrigatórios devem ser informados."
}
```

### **Excluir transação do usuário logado**

#### `DELETE` `/transacao/:id`

Essa é a rota que será chamada quando o usuario logado quiser excluir uma das suas transações cadastradas.  
É possível excluir **apenas** transações associadas ao próprio usuário logado, que será identificado através do ID presente no token de validação.

- **Requisição**  
  Deverá ser enviado o ID da transação no parâmetro de rota do endpoint.  
  O corpo (body) da requisição não deverá possuir nenhum conteúdo.

- **Resposta**  
  Em caso de **sucesso**, não é enviado conteúdo no corpo (body) da resposta.  
  Em caso de **falha na validação**, a resposta possui **_status code_** apropriado, e em seu corpo (body) possui um objeto com uma propriedade **mensagem** que possui como valor um texto explicando o motivo da falha.

- **REQUISITOS E VALIDAÇÕES**:
  - Valida se existe transação para o id enviado como parâmetro na rota e se esta transação pertence ao usuário logado.
  - Exclui a transação no banco de dados.

#### **Exemplo de requisição**

```javascript
// DELETE /transacao/2
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200 / 201 / 204
// Sem conteúdo no corpo (body) da resposta
```

```javascript
// HTTP Status 400 / 401 / 403 / 404
{
    "mensagem": "Transação não encontrada."
}
```

### **Obter extrato de transações**

#### `GET` `/transacao/extrato`

Essa é a rota que será chamada quando o usuario logado quiser obter o extrato de todas as suas transações cadastradas.
É possível atualizar **apenas** transações associadas ao próprio usuário logado, que será identificado através do ID presente no token de validação.

- **Requisição**  
  Sem parâmetros de rota ou de query.  
  O corpo (body) da requisição não deverá possuir nenhum conteúdo.

- **Resposta**  
  Em caso de **sucesso**, é enviado no corpo (body) da resposta um objeto contendo a soma de todas as transações do tipo `entrada` e a soma de todas as transações do tipo `saida`.  
  Em caso de **falha na validação**, a resposta possui **_status code_** apropriado, e em seu corpo (body) possui um objeto com uma propriedade **mensagem** que possui como valor um texto explicando o motivo da falha.

- **REQUISITOS E VALIDAÇÕES**:
  - Em caso de não existir transações do tipo `entrada` cadastradas para o usuário logado, o valor retornado no corpo (body) da resposta é 0.
  - Em caso de não existir transações do tipo `saida` cadastradas para o usuário logado, o valor retornado no corpo (body) da resposta é 0.

#### **Exemplo de requisição**

```javascript
// DELETE /transacao/extrato
// Sem conteúdo no corpo (body) da requisição
```

#### **Exemplos de resposta**

```javascript
// HTTP Status 200 / 201 / 204
{
	"entrada": 300000,
	"saida": 15800
}
```

---

###### tags: `back-end` `nodeJS` `PostgreSQL` `API REST` 
