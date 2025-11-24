Projeto de Controle de Estoque (ProjetoEstoque)

Sobre o Projeto

Este projeto foi desenvolvido seguindo as orientações da apostila fornecida para o Projeto Integrador – Sistema de Gerenciamento de Estoque, utilizando Node.js no backend, React no frontend e SQLite como banco de dados.
O objetivo é aplicar conceitos de programação web, APIs REST, integração entre front e back, documentação, versionamento e boas práticas de desenvolvimento.

Funcionalidades Principais

Fornecedores

Cadastro de fornecedores
Edição e exclusão
CNPJ único
Endereço e contatos
Validação de campos obrigatórios

Produtos

Cadastro de produtos
Edição e exclusão
Listagem com filtros
Validações obrigatórias
Código de barras único
Categoria, unidade e descrição

Associação Produto–Fornecedor

Associar fornecedores a produtos
Impedir associação duplicada
Remover associações
Listar fornecedores vinculados a cada produto

User Stories (Requisitos Funcionais)

1. Cadastro de Produto
Como funcionário, quero cadastrar produtos informando nome, categoria, valor e código de barras.
O sistema deve impedir:
código de barras duplicado
campos obrigatórios vazios

2. Cadastro de Fornecedor
Como funcionário, quero cadastrar fornecedores informando razão social, CNPJ, telefone e endereço.
O sistema deve impedir:
CNPJ duplicado
CNPJ inválido
campos obrigatórios vazios

3. Associação Produto–Fornecedor
Como funcionário, quero vincular produtos e fornecedores.
O sistema deve impedir:
associação repetida
fornecedor inexistente
produto inexistente

Tecnologias Utilizadas
Backend
Node.js
Express
SQLite3
Axios
Nodemon

Frontend
React
React Router
Axios
CSS/Bootstrap

Outras ferramentas
Insomnia / Postman
Git + GitHub
VS Code

Como Rodar o Backend
Acesse a pasta /backend
Instale dependências:
npm install
Execute:
npm start
API sobe em:
http://localhost:3001

Como Rodar o Frontend
Acesse a pasta /frontend
Instale dependências:
npm install
Execute:
npm start
Interface sobe em:
http://localhost:3000

Endpoints da API
📦 Produtos
GET /produtos POST /produtos PUT /produtos/:id DELETE /produtos/:id
🏭 Fornecedores
GET /fornecedores POST /fornecedores PUT /fornecedores/:id DELETE /fornecedores/:id
🔗 Associação Produto–Fornecedor
POST /associar DELETE /associar/:id GET /associar/produto/:id_produto

Autor
Projeto desenvolvido por Everton Ferreira Machado.


