const db = require('../db');
const { v4: uuidv4 } = require('uuid');

// GET - Listar TODAS as associações
const getAllAssociations = (req, res) => {
    db.all(
        `
        SELECT 
            a.id,
            s.razaoSocial,
            s.cnpj,
            p.nome,
            p.codigoBarras
        FROM supplier_product a
        JOIN suppliers s ON a.supplierId = s.id
        JOIN products p ON a.productId = p.id
        ORDER BY s.razaoSocial ASC
        `,
        [],
        (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        }
    );
};

// GET - Listar fornecedores associados a um produto específico
const getAssociationsByProduct = (req, res) => {
    const productId = req.params.productId;

    db.all(
        `
        SELECT 
            a.id,
            s.razaoSocial,
            s.cnpj
        FROM supplier_product a
        JOIN suppliers s ON a.supplierId = s.id
        WHERE a.productId = ?
        ORDER BY s.razaoSocial ASC
        `,
        [productId],
        (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        }
    );
};

// POST - Associar fornecedor ao produto
const createAssociation = (req, res) => {
    const { supplierId, productId } = req.body;

    if (!supplierId || !productId) {
        return res.status(400).json({ message: 'Fornecedor e Produto são obrigatórios.' });
    }

    db.get(
        `
        SELECT 1 FROM supplier_product
        WHERE supplierId = ? AND productId = ?
        `,
        [supplierId, productId],
        (err, row) => {
            if (err) return res.status(500).json({ error: err.message });

            if (row) {
                return res.status(400).json({
                    message: 'Fornecedor já está associado a este produto!'
                });
            }

            const id = uuidv4();

            db.run(
                `
                INSERT INTO supplier_product (id, supplierId, productId)
                VALUES (?, ?, ?)
                `,
                [id, supplierId, productId],
                (err) => {
                    if (err) return res.status(500).json({ error: err.message });

                    res.status(201).json({
                        id,
                        message: 'Fornecedor associado com sucesso ao produto!'
                    });
                }
            );
        }
    );
};

// DELETE - Desassociar fornecedor do produto
const deleteAssociation = (req, res) => {
    db.run(
        `DELETE FROM supplier_product WHERE id = ?`,
        [req.params.id],
        (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Fornecedor desassociado com sucesso!' });
        }
    );
};

module.exports = {
    getAllAssociations,
    getAssociationsByProduct,
    createAssociation,
    deleteAssociation
};