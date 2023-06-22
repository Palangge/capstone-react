const express = require('express');
const cartRouter = express.Router();
const cartHandler = require('../handler/cart');

// GET /api/cart/
cartRouter.get('/', cartHandler.getCart);

// PUT /api/cart/
cartRouter.put('/', cartHandler.updateCart);

// POST /api/cart/
cartRouter.post('/', cartHandler.checkOut);

module.exports = { cartRouter }; 