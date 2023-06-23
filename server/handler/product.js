const validator = require('validator');
const products = require('../model/product');
const { ObjectId } = require('mongodb');
const fs = require('fs');
const path = require('path');
//const multer = require("multer");
const { v4: uuidv4 } = require('uuid');
// Function to generate a unique filename
const generateUniqueFilename = (originalFilename) => {
  const fileExtension = originalFilename.split('.').pop(); // Get the file extension
  const uniqueFilename = `${uuidv4()}${fileExtension ? '.' + fileExtension : ''}`; // Generate a unique filename with or without the original file extension
  return uniqueFilename;
};
const handleError = (err, res) => {
    res
      .status(500)
      .contentType("text/plain")
      .end(err.message);
  };
  
/*   const upload = multer({
    dest: path.join(__dirname, '../file_variables/products'),
    // you might also want to set some limits: https://github.com/expressjs/multer#limits
  }).single('image'); */
  
async function editProductById(req, res) {
  if(!req.session.isAdmin){//how you get here?
    return res.status(404);
  }
  const productId = req.params.id;
  let updatedProductData = req.body;

/*   // Validate product data
  if (!validateProductData(updatedProductData)) {
    return res.status(400).json({ success: false, message: 'Invalid product data' });
  } */

  if(!ObjectId.isValid(productId)){//check if id is valid, just say 'Product not found' if it isn't, so that people don't get ideas to ruin your day
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  // Check if the product exists
  const existingProduct = await products.getProductById(productId);
  if (!existingProduct) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  if (req.file) {//new image
    // Rename and move the uploaded file
    const tempPath = req.file.path;
    //existingProduct.image shoubl be [/uploaded/{filename}]
    const targetPath = path.join(__dirname, '../../public', existingProduct.image);//replace the existing image, there should be an image right?
    fs.rename(tempPath, targetPath, async (err) => {
      if (err) {
        return handleError(err, res);
      }
    });
  }//if no new image, no need to do extra thing
  updatedProductData.image = existingProduct.image;
  updatedProductData = data_correction_protocol(updatedProductData);//update from string to number non numbers are (trimmed maybe?)

  // Update the product
  const updatedProduct = {
    ...existingProduct,
    ...updatedProductData,
  };
  
  if(!(await products.editProduct(productId, updatedProduct))){
    return res.status(500).json({ success: false, message: 'Database Failure' });
  }

  res.json({ success: true, message: 'Product updated successfully' });
}

async function deleteProductById(req, res) {
  if(!req.session.isAdmin){//how you get here?
    return res.status(404);
  }
  const productId = req.params.id;

  if(!ObjectId.isValid(productId)){//check if id is valid, just say 'Product not found' if it isn't, so that people don't get ideas to ruin your day
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  // Check if the product exists
  const existingProduct = await products.getProductById(productId);
  if (!existingProduct) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  console.log(existingProduct);

  // Delete the product
  if(!(await products.deleteProduct(productId))){
    return res.status(500).json({ success: false, message: 'Database Failure' });
  }
  const targetPath = path.join(__dirname, '../../public', existingProduct.image);
  //delete the existing image, there should be an image right?
  fs.unlink(targetPath, (error) => {
    if (error) {
      console.error('Failed to delete the file', error);
      return;
    }
    console.log(`File[${targetPath}] deleted successfully`);
  });

  res.json({ success: true, message: 'Product deleted successfully' });
}

async function addProduct(req, res) {
  if(!req.session.isAdmin){//how you get here?
    return res.status(404);
  }
  // Validate product data
  let productData = req.body; // Retrieve product data from the request body

  // Validate product data
  
  /* if (!validateProductData(productData)) {
    return res.status(400).json({ success: false, message: 'Invalid product data' });
  } */
  // Check if a file was uploaded
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No image uploaded' });
  }

  // Rename and move the uploaded file
  const newFileNameMustBeUnique = generateUniqueFilename(req.file.filename);//deploy the uuid nenerator
  const tempPath = req.file.path;
  const targetPath = path.join(__dirname, '../../public/uploads', newFileNameMustBeUnique);
  fs.rename(tempPath, targetPath, async (err) => {
    if (err) {
      return handleError(err, res);
    }
    const targetPath1 = path.join('/uploads', newFileNameMustBeUnique);
    // Add the product with the updated file path
    productData.image = targetPath1;
  
    try {
      productData = data_correction_protocol(productData);
      const savedProduct = await products.addProduct(productData);
      console.log('Product saved successfully:', savedProduct);
      res.status(200).json({ success: true, message: 'Product added successfully' });
    } catch (error) {
      console.error('Error saving product:', error);
      res.status(500).json({ success: false, message: 'Failed to add product' });
    }
  });
}

async function getProductById(req, res) {
  const productId = req.params.id;

  if(!ObjectId.isValid(productId)){//check if id is valid, just say 'Product not found' if it isn't, so that people don't get ideas to ruin your day
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  // Get the product by ID
  const product = await products.getProductById(productId);

  if (product==null) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  return res.json({ success: true, product: product });
}

async function getProducts(req, res) {
  // Get all products
  const allProducts = await products.getAllProducts();

  res.json({ success: true, products: allProducts });
}

function data_correction_protocol(Product){
  Product.price = Number(Product.price);//number
  Product.quantity = Number(Product.quantity);//number
  return Product;
}

// this._id = _id;
// this.name = name;
// this.image = image;
// this.quantity = quantity;
// this.price = price;
// this.category = category;
// this.description = description; 

module.exports = {
  editProductById,
  addProduct,
  getProducts,
  getProductById,
  deleteProductById,
};