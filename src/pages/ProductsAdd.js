import axios from 'axios';
import React, { useState, useEffect } from 'react';

export const ProductsAdd = () => {
  // State variables for form inputs
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [name, setName] = useState(''); // Added name state variable
  const [imageName, setImageName] = useState('');
  const [isAdmin, setIsAdmin] = React.useState(false);
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
  useEffect(() => {
    fetchIsAdmin();
  }, []);

  // Form submission handler
  const submit = async (event) => {
    event.preventDefault();
    if(!isAdmin){
      alert("think again!");
      return;//error - how did you even get here?
    }

    // Create a new FormData object and append form data
    const formData = new FormData();
    formData.append('image', file);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('quantity', quantity);
    formData.append('price', price);
    formData.append('name', name); // Append name to form data

    try {
      // Send a POST request to the backend API endpoint
      const response = await axios.post('/api/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      console.log(response);
      alert("Product Added");
      window.location.replace(window.location.origin+"/Products");
      // Update the state variable with the image name received from the backend
      setImageName(response.data.imageName);
    } catch (error) {
      console.error('Failed to add product:', error);
    }
  };

  return (
    <div className="App">
      <form onSubmit={submit}>
        <div className="mb-3">
          <label htmlFor="image" className="input-group-text">Image:</label>
          <input
            readOnly={!isAdmin}
            id="image"
            name="image"
            filename={file}
            onChange={(e) => setFile(e.target.files[0])}
            type="file"
            accept="image/*"
            className="form-control hidden"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="name" className="input-group-text">Name:</label>
          <input
            readOnly={!isAdmin}
            id="name"
            name="name"
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Name"
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="input-group-text">Description:</label>
          <textarea
            readOnly={!isAdmin}
            id="description"
            name="description"
            onChange={(e) => setDescription(e.target.value)}
            type="text"
            placeholder="Description"
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="category" className="input-group-text">Category:</label>
          <input
            readOnly={!isAdmin}
            id="category"
            name="category"
            onChange={(e) => setCategory(e.target.value)}
            type="text"
            placeholder="Category"
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="quantity" className="input-group-text">Stock:</label>
          <input
            readOnly={!isAdmin}
            id="quantity"
            name="quantity"
            onChange={(e) => setQuantity(e.target.value)}
            type="number"
            placeholder="Quantity"
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="price" className="input-group-text">Price:</label>
          <input
            readOnly={!isAdmin}
            id="price"
            name="price"
            onChange={(e) => setPrice(e.target.value)}
            type="number"
            placeholder="Price"
            className="form-control"
          />
        </div>
        {isAdmin && <button type="submit" className="btn btn-primary">Add Product</button>}
      </form>
      {file && (
        <div>
          <img alt="not found" width="250px" src={URL.createObjectURL(file)} />
          <br />
          <button
            onClick={() => {
              const fileInput = document.querySelector('input[type="file"]');
              fileInput.value = null;
              setFile(null);
            }}
            className="btn btn-danger"
          >
            Remove
          </button>
        </div>
      )}
      {imageName && <p>{imageName}</p>}
    </div>
  );
  
  
};
