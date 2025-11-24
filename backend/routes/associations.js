const express = require('express');
const router = express.Router();
const associationController = require('../controllers/associationController');

// LISTAR TODAS as associações
router.get('/', associationController.getAllAssociations);

// Listar fornecedores associados a um produto específico
router.get('/produto/:productId', associationController.getAssociationsByProduct);

// Criar associação fornecedor ↔ produto
router.post('/', associationController.createAssociation);

// Remover associação
router.delete('/:id', associationController.deleteAssociation);

module.exports = router;