//const validator = require('validator');
const { ObjectId } = require('mongodb');
// handler/cart.js
const { getCartItems, dumpToCart, checkOutCart } = require('../model/cart');

// GET /api/cart
async function getCart(req, res) {
  try {
    const email = req.session.email;
    const id = req.session._id;
    if (!email) {
      res.status(400).send('Please login to use this feature');
      return;
    }
    const cartItems = await getCartItems(id);
    console.log(cartItems);
    res.json(cartItems);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}

// PUT /api/cart/
async function updateCart(req, res) {
  const { items } = req.body;
  try {
    const id = req.session._id;
    if (!id) {
      res.status(400).send('Please login to use this feature');
      return;
    }
    console.log(items);
    console.log(id);
    const insertedId = await dumpToCart(id, items);
    res.json({ insertedId });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}

// POST /api/cart/
async function checkOut(req, res) {
  try {
    const id = req.session._id;
    const isProcessing = Boolean(req.session.isProcessing);
    if (!id) {
      res.status(400).send('Please login to use this feature');
      return;
    }
    if(isProcessing){
      res.status(400).send('a checkout is in progress.');
      return;
    }
    req.session.isProcessing = true;//lock checkout
    console.log(id);
    const receipt = await checkOutCart(id);
    req.session.isProcessing = false;//unlock checkout
    return res.json({ ...receipt  });
  } catch (error) {
    console.error(error);
    req.session.isProcessing = false;//unlock checkout
    return res.status(500).send(error);
  }finally{
    req.session.isProcessing = false;//unlock checkout
  }
}

module.exports = { getCart, updateCart, checkOut };
