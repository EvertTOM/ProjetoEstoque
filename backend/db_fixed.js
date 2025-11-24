const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'estoque.db');
const db = new sqlite3.Database(dbPath);

// Criar tabelas se não existirem
db.serialize(() => {
  // Tabela de Fornecedores
  db.run(`
    CREATE TABLE IF NOT EXISTS suppliers (
      id TEXT PRIMARY KEY,
      razaoSocial TEXT NOT NULL,
      cnpj TEXT NOT NULL,
      endereco TEXT NOT NULL,
      telefone TEXT NOT NULL,
      email TEXT NOT NULL,
      contatoPrincipal TEXT NOT NULL,
      dataCadastro TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabela de Produtos
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      nome TEXT NOT NULL,
      codigoBarras TEXT NOT NULL,
      descricao TEXT,
      quantidade INTEGER NOT NULL,
      categoria TEXT NOT NULL,
      dataValidade TEXT,
      dataCadastro TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Tabela de Associações (Fornecedor-Produto)
  db.run(`
    CREATE TABLE IF NOT EXISTS supplier_product (
      id TEXT PRIMARY KEY,
      supplierId TEXT NOT NULL,
      productId TEXT NOT NULL,
      dataCadastro TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (supplierId) REFERENCES suppliers(id),
      FOREIGN KEY (productId) REFERENCES products(id)
    )
  `);
});

module.exports = db;
