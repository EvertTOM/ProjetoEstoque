const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const db = require('./db');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// ============ ROTAS DE FORNECEDORES ============

// GET - Listar todos os fornecedores
app.get('/api/suppliers', (req, res) => {
  db.all('SELECT * FROM suppliers ORDER BY dataCadastro DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// GET - Buscar fornecedor por ID
app.get('/api/suppliers/:id', (req, res) => {
  db.get('SELECT * FROM suppliers WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ message: 'Fornecedor não encontrado' });
      return;
    }
    res.json(row);
  });
});

// POST - Criar novo fornecedor
app.post('/api/suppliers', (req, res) => {
  const { razaoSocial, cnpj, endereco, telefone, email, contatoPrincipal } = req.body;

  if (!razaoSocial || !cnpj || !endereco || !telefone || !email || !contatoPrincipal) {
    res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    return;
  }

  const id = uuidv4();
  db.run(
    `INSERT INTO suppliers (id, razaoSocial, cnpj, endereco, telefone, email, contatoPrincipal)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [id, razaoSocial, cnpj, endereco, telefone, email, contatoPrincipal],
    (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({ id, razaoSocial, cnpj, endereco, telefone, email, contatoPrincipal });
    }
  );
});

// PUT - Atualizar fornecedor
app.put('/api/suppliers/:id', (req, res) => {
  const { razaoSocial, cnpj, endereco, telefone, email, contatoPrincipal } = req.body;

  db.run(
    `UPDATE suppliers SET razaoSocial = ?, cnpj = ?, endereco = ?, telefone = ?, email = ?, contatoPrincipal = ?
     WHERE id = ?`,
    [razaoSocial, cnpj, endereco, telefone, email, contatoPrincipal, req.params.id],
    (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Fornecedor atualizado com sucesso' });
    }
  );
});

// DELETE - Deletar fornecedor
app.delete('/api/suppliers/:id', (req, res) => {
  db.run('DELETE FROM suppliers WHERE id = ?', [req.params.id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Fornecedor deletado com sucesso' });
  });
});

// ============ ROTAS DE PRODUTOS ============

// GET - Listar todos os produtos
app.get('/api/products', (req, res) => {
  db.all('SELECT * FROM products ORDER BY dataCadastro DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// GET - Buscar produto por ID
app.get('/api/products/:id', (req, res) => {
  db.get('SELECT * FROM products WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ message: 'Produto não encontrado' });
      return;
    }
    res.json(row);
  });
});

// POST - Criar novo produto
app.post('/api/products', (req, res) => {
  const { nome, codigoBarras, descricao, quantidade, categoria, dataValidade } = req.body;

  if (!nome || !codigoBarras || quantidade == null || !categoria) {
    res.status(400).json({ error: 'Campos obrigatórios: nome, codigoBarras, quantidade, categoria' });
    return;
  }

  const id = uuidv4();
  db.run(
    `INSERT INTO products (id, nome, codigoBarras, descricao, quantidade, categoria, dataValidade)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [id, nome, codigoBarras, descricao, quantidade, categoria, dataValidade],
    (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({ id, nome, codigoBarras, descricao, quantidade, categoria, dataValidade });
    }
  );
});

// PUT - Atualizar produto
app.put('/api/products/:id', (req, res) => {
  const { nome, codigoBarras, descricao, quantidade, categoria, dataValidade } = req.body;

  db.run(
    `UPDATE products SET nome = ?, codigoBarras = ?, descricao = ?, quantidade = ?, categoria = ?, dataValidade = ?
     WHERE id = ?`,
    [nome, codigoBarras, descricao, quantidade, categoria, dataValidade, req.params.id],
    (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Produto atualizado com sucesso' });
    }
  );
});

// DELETE - Deletar produto
app.delete('/api/products/:id', (req, res) => {
  db.run('DELETE FROM products WHERE id = ?', [req.params.id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Produto deletado com sucesso' });
  });
});

// ============ ROTAS DE ASSOCIAÇÕES ============

// GET - Listar todas as associações
app.get('/api/supplier-products', (req, res) => {
  const query = `
    SELECT 
      sp.id,
      sp.supplierId,
      sp.productId,
      s.razaoSocial as supplierName,
      p.nome as productName,
      sp.dataCadastro
    FROM supplier_product sp
    JOIN suppliers s ON sp.supplierId = s.id
    JOIN products p ON sp.productId = p.id
    ORDER BY sp.dataCadastro DESC
  `;

  db.all(query, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// POST - Criar nova associação
app.post('/api/supplier-products', (req, res) => {
  const { supplierId, productId } = req.body;

  if (!supplierId || !productId) {
    res.status(400).json({ error: 'supplierId e productId são obrigatórios' });
    return;
  }

  const id = uuidv4();
  db.run(
    `INSERT INTO supplier_product (id, supplierId, productId)
     VALUES (?, ?, ?)`,
    [id, supplierId, productId],
    (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({ id, supplierId, productId });
    }
  );
});

// DELETE - Deletar associação
app.delete('/api/supplier-products/:id', (req, res) => {
  db.run('DELETE FROM supplier_product WHERE id = ?', [req.params.id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Associação deletada com sucesso' });
  });
});

// Rota de teste
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend está funcionando!' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor Backend rodando em http://localhost:${PORT}`);
});
