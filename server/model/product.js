const { getDB } = require('../driver/mongodb');
const { ObjectId } = require('mongodb');

class Product {
  constructor(_id, name, image, quantity, price, category, description) {
    this._id = _id;
    this.name = name;
    this.image = image;
    this.quantity = Number(quantity);
    this.price = Number(price);
    this.category = category;
    this.description = description; 
  }
}

class InsertProduct {
  constructor(name, image, quantity, price, category, description) {
    this.name = name;
    this.image = image;
    this.quantity = Number(quantity);
    this.price = Number(price);
    this.category = category;
    this.description = description; 
  }
}

function getProductCollection() {
  const db = getDB();
  return db.collection('products');
}

async function getAllProducts() {
  const collection = getProductCollection();
  const products = await collection.find().toArray();
  return products.map((productDocument) => {
    const { _id, name, image, quantity, price, category, description } = productDocument;
    const product = new Product(_id, name, image, quantity, price, category, description);
    return product;
  });
}

async function getProductById(productId) {
  try {
    const collection = getProductCollection();
    const productDocument = await collection.findOne({ _id: new ObjectId(productId) });
    if (productDocument) {
      const { _id, name, image, quantity, price, category, description } = productDocument;
      const product = new Product(_id, name, image, Number(quantity), Number(price), category, description);
      return product;
    } else {
      return null;
    }
  } catch (e) {
    return null;
  }
}

async function addProduct(productData) {
  const collection = getProductCollection();
  const product = new InsertProduct(
    productData.name,
    productData.image,
    Number(productData.quantity),
    Number(productData.price),
    productData.category,
    productData.description 
  );
  return collection.insertOne(product);
}

async function editProduct(productId, updatedData) {
  let id;
  try {
    id = { _id: new ObjectId(productId) };
  } catch (e) {
    return null;
  }
  const collection = getProductCollection();
  const updatedProduct = {
    $set: {
      name: updatedData.name,
      image: updatedData.image,
      quantity: Number(updatedData.quantity),
      price: Number(updatedData.price),
      category: updatedData.category,
      description: updatedData.description, 
    },
  };
  return collection.updateOne(id, updatedProduct);
}

async function deleteProduct(productId) {
  let id;
  try {
    id = { _id: new ObjectId(productId) };
  } catch (e) {
    console.error(e);
    return null;
  }
  const collection = getProductCollection();
  return collection.deleteOne(id);
}

module.exports = {
  getProductCollection,
  getAllProducts,
  getProductById,
  addProduct,
  editProduct,
  deleteProduct,
  Product,
  InsertProduct,
};
