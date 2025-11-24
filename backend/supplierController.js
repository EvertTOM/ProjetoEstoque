const { v4: uuidv4 } = require('uuid');
const db = require('../db');

const createSupplier = (req, res) => {
  const { razaoSocial, cnpj, email, telefone, endereco, contatoPrincipal } = req.body;

  if (!razaoSocial || !cnpj || !email || !telefone) {
    res.status(400).json({ error: 'Campos obrigatórios: razaoSocial, cnpj, email, telefone' });
    return;
  }

  const id = uuidv4();

  db.run(
    `INSERT INTO suppliers (id, razaoSocial, cnpj, email, telefone, endereco, contatoPrincipal)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [id, razaoSocial, cnpj, email, telefone, endereco || '', contatoPrincipal || ''],
    (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({ id, razaoSocial, cnpj, email, telefone, endereco, contatoPrincipal });
    }
  );
};

const getAllSuppliers = (req, res) => {
  db.all('SELECT * FROM suppliers', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
};

const getSupplierById = (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM suppliers WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Fornecedor não encontrado' });
      return;
    }
    res.json(row);
  });
};

const updateSupplier = (req, res) => {
  const { id } = req.params;
  const { razaoSocial, cnpj, email, telefone, endereco, contatoPrincipal } = req.body;

  db.run(
    `UPDATE suppliers SET razaoSocial = ?, cnpj = ?, email = ?, telefone = ?, endereco = ?, contatoPrincipal = ?
     WHERE id = ?`,
    [razaoSocial, cnpj, email, telefone, endereco || '', contatoPrincipal || '', id],
    (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id, razaoSocial, cnpj, email, telefone, endereco, contatoPrincipal });
    }
  );
};

const deleteSupplier = (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM suppliers WHERE id = ?', [id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Fornecedor deletado com sucesso' });
  });
};

module.exports = {
  createSupplier,
  getAllSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
};