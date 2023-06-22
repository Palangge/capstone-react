// model/cart.js
const { getDB } = require('../driver/mongodb');
const { ObjectId } = require('mongodb');
const {getProductCollection,editProduct} = require('../model/product');


// Get the MongoDB collection instance
function getCartCollection() {
  const db = getDB();
  return db.collection('cart');
}

// Get cart items for a specific user
async function getCartItems(email) {
  try {
    const collection = getCartCollection();
    const cartItems = await collection.findOne({ email: email });
    if(cartItems)
      return cartItems.cart;
    else
      return [];
  } catch (error) {
    console.error(error);
    throw new Error('Failed to get cart items');
  }
}

// Add an item to the cart for a specific user
async function dumpToCart(email, cart) {
  try {
    const collection = getCartCollection();
    const cartItems = await collection.findOne({ email: email });//.find({ email }).toArray();
    if(cartItems){
        const cartItem = {$set: {cart: cart,},};
        //console.log(cartItem);
        const result = await collection.updateOne({ email: email},cartItem);
        return result;
    }else{
        const cartItem = { email: email, cart: cart };
        //console.log(cartItem);
        const result = await collection.insertOne(cartItem);
        return result.insertedId;
    }
  } catch (error) {
    console.error(error);
    throw new Error('Failed to add item to cart');
  }
}

// Checkout for a specific user
async function checkOutCart(email) {
  let cartItems;
  try {
    const collection = getCartCollection();
    cartItems = await collection.findOne({ email: email });
  } catch (error) {
    console.error(error);
    throw new Error('Failed to check out:'+error);
  }
  if(cartItems){//cart exist
    console.log(cartItems.cart);
    class Order{
      constructor(_id,quantity){
        this._id = new ObjectId(_id);
        this.quantity = Number(quantity);
      }
    }
    const orderList = [];
    const productIds = [];//for latest product detail lookup
    cartItems.cart.forEach(order => {
      const SchemedOrder = new Order(order._id,order.quantity);
      orderList.push(SchemedOrder);
      productIds.push(new ObjectId(order._id));
    });
    const products = await getProductCollection().find({ _id: { $in: productIds } }).toArray();
    const orderFinal = orderList.map((order) => {
      const product = products.find(item => {
        console.log("VVV (new ObjectId(item._id)).equals(new ObjectId(order._id)) VVV");
        console.log((new ObjectId(item._id)).equals(new ObjectId(order._id)));
        console.log("^^^ (new ObjectId(item._id)).equals(new ObjectId(order._id)) ^^^");
        return (new ObjectId(item._id)).equals(new ObjectId(order._id));
      });
      return {
        _id: order._id,
        name: product ? product.name : null,
        quantity: Number(order.quantity),
        price: product ? Number(product.price) : null,//update price from database
        stock: product ? Number(product.quantity) : null,//check stock from database
      };
    });
    let total = 0;
    orderFinal.forEach(order => {//validation
/*       console.log("VVVOrder DetailVVV");
      console.log(order);
      console.log("^^^Order Detail^^^"); */
      if(order.quantity==null||order.price==null||order.stock==null)
        throw new Error("Invalid cart detail/or a product no longer exist");
      if(order.quantity>order.stock){
        throw new Error("Insufficient stock for some products");
      }
      total+=(order.quantity*order.price);
    });
    function getCheckoutCollection() {
      const db = getDB();
      return db.collection('checkout');
    }
    class Receipt{
      constructor(email,orderFinal,total){
        this.email = email;
        this.products = orderFinal;
        this.total = Number(total);
      }
    }
    orderFinal.forEach(async (order) => {
      const product = products.find(item => (new ObjectId(item._id)).equals(new ObjectId(order._id)));
      product.quantity -= order.quantity;
      await editProduct(order._id, product);
    });
    
    const receipt = new Receipt(email, orderFinal, total);
    try {
      const checkoutCollection = getCheckoutCollection();
      const insertId = await checkoutCollection.insertOne(receipt);
      console.log('Checkout completed successfully');
      return {...receipt, sales_invoice:insertId};
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  }else{//cart doesn't exist
    throw new Error("User doesn't have a cart");
  }
}

module.exports = {
  getCartItems,
  dumpToCart,
  checkOutCart
};
