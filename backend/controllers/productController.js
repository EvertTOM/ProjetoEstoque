const { v4: uuidv4 } = require('uuid');
const db = require('../db');

// GET - Listar todos os produtos
const getAllProducts = (req, res) => {
    db.all('SELECT * FROM products ORDER BY dataCadastro DESC', (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
};

// GET - Buscar produto por ID
const getProductById = (req, res) => {
    db.get('SELECT * FROM products WHERE id = ?', [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ message: 'Produto não encontrado' });
        res.json(row);
    });
};

// POST - Criar novo produto
const createProduct = (req, res) => {
    const {
        nome,
        codigoBarras,
        descricao,
        preco,
        quantidade,
        categoria,
        dataValidade
    } = req.body;

    if (!nome || !codigoBarras || !preco || !quantidade || !categoria) {
        return res.status(400).json({ message: 'Todos os campos obrigatórios devem ser preenchidos.' });
    }

    // Verificar duplicidade
    db.get('SELECT * FROM products WHERE codigoBarras = ?', [codigoBarras], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });

        if (row) {
            return res.status(400).json({ message: 'Produto com este código de barras já está cadastrado!' });
        }

        const id = uuidv4();

        db.run(
            `INSERT INTO products (
              id, nome, codigoBarras, descricao, preco, quantidade, categoria, dataValidade
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                id,
                nome,
                codigoBarras,
                descricao || null,
                preco,
                quantidade,
                categoria,
                dataValidade || null
            ],
            (err) => {
                if (err) return res.status(500).json({ error: err.message });

                res.status(201).json({
                    id,
                    nome,
                    codigoBarras,
                    descricao,
                    preco,
                    quantidade,
                    categoria,
                    dataValidade
                });
            }
        );
    });
};

// PUT - Atualizar produto
const updateProduct = (req, res) => {
    const {
        nome,
        codigoBarras,
        descricao,
        preco,
        quantidade,
        categoria,
        dataValidade
    } = req.body;

    db.run(
        `UPDATE products SET
          nome = ?, codigoBarras = ?, descricao = ?, preco = ?, quantidade = ?, categoria = ?, dataValidade = ?
         WHERE id = ?`,
        [
            nome,
            codigoBarras,
            descricao || null,
            preco,
            quantidade,
            categoria,
            dataValidade || null,
            req.params.id
        ],
        (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Produto atualizado com sucesso' });
        }
    );
};

// DELETE - Deletar produto
const deleteProduct = (req, res) => {
    db.run('DELETE FROM products WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Produto deletado com sucesso' });
    });
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};