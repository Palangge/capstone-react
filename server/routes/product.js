const express = require('express');
const productRouter = express.Router();
const productHandler = require('../handler/product');
const path = require('path');
const multer = require("multer");
 
 const upload = multer({
    dest: path.join(__dirname, '../file_variables/products'),
    // you might also want to set some limits: https://github.com/expressjs/multer#limits
  }).single('image');

// [api] is added to route to avoid overlap with the react route
// GET /api/products
productRouter.get('/', productHandler.getProducts);

// POST /api/products
productRouter.post('/',upload, productHandler.addProduct);

// GET /api/products/:id
productRouter.get('/:id', productHandler.getProductById);

// PUT /api/products/:id
productRouter.put('/:id',upload, productHandler.editProductById);

// DELETE /api/products/:id
productRouter.delete('/:id', productHandler.deleteProductById);

module.exports = { productRouter }; 