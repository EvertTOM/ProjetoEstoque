const express = require('express');
const cors = require('cors');
const app = express();
const productRoutes = require('./routes/products');
const supplierRoutes = require('./routes/suppliers');
const associationRoutes = require('./routes/associations');

app.use(cors());
app.use(express.json());

// ROTAS CORRETAS
app.use('/api/products', productRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/associations', associationRoutes);

app.listen(3001, () => {
    console.log("Servidor Backend rodando em http://localhost:3001");
});