const { v4: uuidv4 } = require('uuid');
const db = require('../db');

// GET - Listar todos os fornecedores
const getAllSuppliers = (req, res) => {
    db.all('SELECT * FROM suppliers ORDER BY dataCadastro DESC', (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
};

// GET - Buscar fornecedor por ID
const getSupplierById = (req, res) => {
    db.get('SELECT * FROM suppliers WHERE id = ?', [req.params.id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ message: 'Fornecedor não encontrado' });
        }
        res.json(row);
    });
};

// POST - Criar novo fornecedor (com validação de CNPJ duplicado)
const createSupplier = (req, res) => {
    const { razaoSocial, cnpj, endereco, telefone, email, contatoPrincipal } = req.body;

    if (!razaoSocial || !cnpj || !endereco || !telefone || !email || !contatoPrincipal) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    // 1. Verificar se o CNPJ já está cadastrado
    db.get('SELECT * FROM suppliers WHERE cnpj = ?', [cnpj], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (row) {
            return res.status(400).json({ message: 'Fornecedor com esse CNPJ já está cadastrado!' });
        }

        // 2. Se não existir — cadastrar normalmente
        const id = uuidv4();

        db.run(
            `INSERT INTO suppliers (id, razaoSocial, cnpj, endereco, telefone, email, contatoPrincipal)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [id, razaoSocial, cnpj, endereco, telefone, email, contatoPrincipal],
            (err) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                res.status(201).json({
                    id,
                    razaoSocial,
                    cnpj,
                    endereco,
                    telefone,
                    email,
                    contatoPrincipal
                });
            }
        );
    });
};

// PUT - Atualizar fornecedor
const updateSupplier = (req, res) => {
    const { razaoSocial, cnpj, endereco, telefone, email, contatoPrincipal } = req.body;

    db.run(
        `UPDATE suppliers 
         SET razaoSocial = ?, cnpj = ?, endereco = ?, telefone = ?, email = ?, contatoPrincipal = ?
         WHERE id = ?`,
        [razaoSocial, cnpj, endereco, telefone, email, contatoPrincipal, req.params.id],
        (err) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: 'Fornecedor atualizado com sucesso' });
        }
    );
};

// DELETE - Deletar fornecedor
const deleteSupplier = (req, res) => {
    db.run('DELETE FROM suppliers WHERE id = ?', [req.params.id], (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Fornecedor deletado com sucesso' });
    });
};

module.exports = {
    getAllSuppliers,
    getSupplierById,
    createSupplier,
    updateSupplier,
    deleteSupplier
};