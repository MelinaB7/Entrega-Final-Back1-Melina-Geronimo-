const express = require('express');
const router = express.Router();
const { 
    getProductos,
    addProduct,
    deleteProduct
 } = require('../controllers/product.controller');

// Ruta get producto by id
router.get('/:id', getProductos);

// Crear producto
router.post('/', addProduct);

// Eliminar producto
router.post('/:pid', deleteProduct);

// ruta get productos
router.get('/', getProductos);

module.exports = router;
