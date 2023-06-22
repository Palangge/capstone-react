import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const fetchIsAdmin = async () => {
    try {
      const response = await axios.get('/users/isAdmin');
      const data = response.data;
      setIsAdmin(data.message);
      localStorage.setItem("isAdmin",data.message);
    } catch (error) {
      setIsAdmin(false);
      localStorage.removeItem("isAdmin");
      console.error('Failed to fetch user status:', error);
    }
  };
  const fetchProductDetails = async () => {
    try {
      const response = await axios.get(`/api/products/${id}`);
      const { data } = response;
      setProduct(data.product);
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };
  useEffect(() => {
    fetchProductDetails();
    fetchIsAdmin();
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setProduct((prevProduct) => ({
      ...prevProduct,
      file,
    }));
  };

  const submit = async (event) => {
    event.preventDefault();
    if(!isAdmin){
      alert("think again!");
      return;//error - how did you even get here?
    }

    const formData = new FormData();
    formData.append('image', product.file);
    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('quantity', Number(product.quantity));
    formData.append('category', product.category);
    formData.append('price', Number(product.price));

    try {
      await axios.put(`/api/products/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Product Updated');
    } catch (error) {
      console.error('Error updating product details:', error);
      alert('Error updating product details: '+error);
    }
  };

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="App">
      <form onSubmit={submit}>
        {isAdmin && (<h1>Product ID: {id}</h1>)}
        {isAdmin && (
        <div className="mb-3 input-group flex-nowrap">
          <label htmlFor="image" className="input-group-text">Change Image:</label>
          <input
            id="image"
            name="image"
            onChange={handleFileChange}
            type="file"
            accept="image/*"
            className="form-control hidden"
          />
        </div>
        )}
        <div className="mb-3 input-group">
          <label htmlFor="name" className="input-group-text">Name:</label>
          <input
            readOnly={!isAdmin}
            id="name"
            name="name"
            value={product.name}
            onChange={(e) => setProduct((prevProduct) => ({
              ...prevProduct,
              name: e.target.value,
            }))}
            type="text"
            placeholder="Name"
            className="form-control"
          />
        </div>
        <div className="mb-3 input-group">
          <label htmlFor="description" className="input-group-text">Description:</label>
          <textarea
            readOnly={!isAdmin}
            id="description"
            name="description"
            value={product.description}
            onChange={(e) => setProduct((prevProduct) => ({
              ...prevProduct,
              description: e.target.value,
            }))}
            type="text"
            placeholder="Description"
            className="form-control"
          />
        </div>
        <div className="mb-3 input-group">
          <label htmlFor="category" className="input-group-text">Category:</label>
          <input
            readOnly={!isAdmin}
            id="category"
            name="category"
            value={product.category}
            onChange={(e) => setProduct((prevProduct) => ({
              ...prevProduct,
              category: e.target.value,
            }))}
            type="text"
            placeholder="Category"
            className="form-control"
          />
        </div>
        <div className="mb-3 input-group">
          <label htmlFor="quantity" className="input-group-text">Stock:</label>
          <input
            readOnly={!isAdmin}
            id="quantity"
            name="quantity"
            value={product.quantity}
            onChange={(e) => setProduct((prevProduct) => ({
              ...prevProduct,
              quantity: e.target.value,
            }))}
            type="number"
            placeholder="Quantity"
            className="form-control"
          />
        </div>
        <div className="mb-3 input-group">
          <label htmlFor="price" className="input-group-text">Price:</label>
          <input
            readOnly={!isAdmin}
            id="price"
            name="price"
            value={product.price}
            onChange={(e) => setProduct((prevProduct) => ({
              ...prevProduct,
              price: e.target.value,
            }))}
            type="number"
            placeholder="Price"
            className="form-control"
          />
        </div>
        {isAdmin && <button type="submit" className="btn btn-primary">Update Product</button>}
      </form>
      {product.file && (
        <div>
          <img alt="not found" width="250px" src={URL.createObjectURL(product.file)} />
          <br />
          <button
            onClick={() => {
              setProduct((prevProduct) => ({
                ...prevProduct,
                file: null,
              }));
            }}
            className="btn btn-danger"
          >
            Remove
          </button>
        </div>
      )}
      {product.image && !product.file && (
        <img alt="not found" width="250px" src={product.image} />
      )}
    </div>
  );  
};
