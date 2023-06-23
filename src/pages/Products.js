import React, { useState, useEffect  } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
/*this is for mock database test, used during no internet testing
const generateProducts = () => {
  const products = [];
  for (let i = 1; i <= 100; i++) {
    const product = {
      _id: i,
      name: `Product ${i}`,
      image: `path/to/image${i}.jpg`,
      quantity: Math.floor(Math.random() * 10) + 1,
      price: Math.floor(Math.random() * 100) + 1,
      category: `Category ${Math.floor(Math.random() * 5) + 1}`,
    };
    products.push(product);
  }
  return products;
};
*/

const ShoppingCart = ({ cartItems, addToCart, removeFromCart, refreshProductList , setCartItems }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [msg,setMsg] = useState('');
  const [err,setErr] = useState('');

  if(cartItems==null)cartItems = [];
  const totalPrice = cartItems.reduce((total, item) => total + item.quantity * item.price, 0);
  
  const checkOut = async () => {
    setIsProcessing(true);
    try {
      console.log("to checkout");
      const response = await axios.post(`/api/cart`);
      const receipt = response.data;
      console.log(receipt);
      let str = "checkout successfully!\nyou just spent: ₱"+receipt.total+"\nItems:";
      receipt.products.forEach(item => {
        str+="\n\t"+item.name+" x "+item.quantity+" = ₱"+(Number(item.quantity) * Number(item.price));
      });
      str+="\nsales invoice: "+receipt.sales_invoice.insertedId;
      str+="\nemail: "+receipt.email;
      setMsg(str);
    } catch (error) {
      console.error('Error checkout:', error);
      setErr('Error checkout: '+error);
    } finally{
      refreshProductList();
      console.log("product refresh");
      setIsProcessing(false);
    }
  };
  const handleQuantityChange = (item, quantity) => {
    if (quantity < 1) {
      removeFromCart(item);
    } else {
      const updatedItem = { ...item, quantity };
      const updatedCartItems = cartItems.map((cartItem) =>
        cartItem._id === item._id ? updatedItem : cartItem
      );
      setCartItems(updatedCartItems);
    }
  };
  const CheckOutMessage = () => {
    return (
        <div class="alert alert-secondary alert-dismissible fade show" role="alert">
            {msg}
            <button type="button" class="btn-close" onclick={() => setMsg('')} data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    );
  };

  const ErrorMessage = () => {
    return (
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            {err}
            <button type="button" class="btn-close" onclick={() => setErr('')} data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    );
  };

  return (
    <div>
      <h2>Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div>
          <ul>
            {cartItems.map((item) => (
              <li key={item._id} class="row p-0 pb-3">
                <span class="col">{item.name} x{' '}</span>
                <div class="input-group ms-1 me-1 col">
                  <button class="btn btn-outline-danger" type="button" onClick={(e) => {handleQuantityChange(item, item.quantity-1)}}> - </button>
                  <input
                  className='form-control'
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item, parseInt(e.target.value))}
                  />
                  <button class="btn btn-outline-primary" type="button" onClick={(e) => {handleQuantityChange(item, item.quantity+1)}}> + </button>
                </div>
                <span class="col">{' '}
                - ₱{item.quantity * item.price}
                {' '}
                <button class="btn btn-outline-danger" onClick={() => removeFromCart(item)}>Remove from Cart</button>
                </span>
              </li>
            ))}
          </ul>
          <p>Total: ${totalPrice}</p>
          <button className="btn btn-outline-primary" onClick={async () => {await checkOut()}} disabled={isProcessing}>
            Checkout
          </button>
        </div>
      )}
      {msg}<br/>
      {err}
      {(msg.length>0) ? <CheckOutMessage /> : ""}
      {(err.length>0) ? <ErrorMessage /> : ""}
    </div>
  );
};

export const Products = () => {
  const [filter, setFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortCriteria, setSortCriteria] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [products,setProducts] = useState(/*generateProducts()*/[]);
  const [currentItems, setCurrentItems] = useState(products.length>itemsPerPage? products.slice(0, itemsPerPage):products);
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

  const categories = ['All', ...new Set(products.length>0 ? products.map((product) => product.category):[])];

  const filteredProducts = products.length>0 ? products.filter((product) => (selectedCategory === 'All' || product.category === selectedCategory) && product.name.toLowerCase().includes(filter.toLowerCase())) : [];
  useEffect(() => {
    // Load cart items from db on component mount
    fetchData();
    fetchIsAdmin();
    checkAuth();//checking auth
    setIsAuthenticated(localStorage.getItem("isAuthenticated"));//temporary only in case of server lag
    fetchCart();//update for db
  }, []);

  useEffect(() => {
    // Save cart items to localStorage whenever cartItems state changes
    //localStorage.setItem('cartItems', JSON.stringify(cartItems));
    //Save to DB if cartItems changes
    updateCart();
  }, [cartItems]);

  useEffect(() => {
    // Save cart items to localStorage whenever cartItems state changes
    //localStorage.setItem('cartItems', JSON.stringify(cartItems));
    //Save to DB if cartItems changes
    fetchCart();
  }, [isAuthenticated,isAdmin]);

  useEffect(() => {
    paginate(currentPage);
  }, [products]);

  const checkAuth = async () => {
    try {
      const response = await axios.get('/users/isLoggedIn');
      const data = response.data;
      console.log(data);
      console.log(data.message);
      // Update the products state with the fetched data
      localStorage.setItem("isAuthenticated",data.message);
      setIsAuthenticated(data.message);
    } catch (error) {
      console.error('Failed to fetch user state:', error);
    }
  }

  const updateCart = async () => {
    if (!isAuthenticated) return; // User is not logged in.
  
    try {
      console.log("to update");
      console.log(cartItems);
      const response = await axios.put(`/api/cart`, {items:cartItems});
      console.log(response.data);
      console.log("Cart updated successfully!");
    } catch (error) {
      console.error('Error updating user\'s cart details:', error);
    }
  };

  const fetchCart = async () => {
    if(!isAuthenticated) return;//user is not logged in.
    console.log("fetch cart");
    try {
      console.log("fetch cart 1");
      const response = await axios.get('/api/cart');
      console.log("fetch cart 2");
      const data = response.data;
      console.log(data);
      // Update the products state with the fetched data
      setCartItems(data);
      return data;
    } catch (error) {
      console.log("fetch cart 3");
      console.error('Failed to fetch user\'s cart:', error);
    }
    console.log("fetch cart 4");
    return null;
  };

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/products');
      const data = response.data;
      console.log(data);
      console.log(data.products);
      // Update the products state with the fetched data
      setProducts(data.products);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const sortedProducts = filteredProducts.length > 0
  ? filteredProducts.sort((a, b) => {
      let compareValue;
      //console.log(parseInt(a._id, 16));
      //console.log(parseInt(b._id, 16));
      if (sortCriteria === 'name') {
        compareValue = a.name.localeCompare(b.name);
      } else if (sortCriteria === 'price') {
        compareValue = a.price - b.price;
      } else if (sortCriteria === 'id' || sortCriteria === '' ) {//64844d26dd0bc4d3aa77bb89 64844e54eb04327330a68ba3
        compareValue = parseInt(a._id, 16) - parseInt(b._id, 16);
        //console.log("comp: "+compareValue);
      } else {
        compareValue = 0;
      }
      return sortOrder === 'asc' ? compareValue : -compareValue;
    })
  : [];
 
  useEffect(()=>{
    paginate(currentPage);
  },[filter, selectedCategory, sortCriteria, sortOrder]);

  // Change page
  const paginate = (pageNumber) => {
    //let pageNumber = pN;
    const lastPageNum = (Math.ceil(sortedProducts.length / itemsPerPage));
    if(pageNumber<=0){
      pageNumber = 1;
    }else
    if(pageNumber>lastPageNum){
      pageNumber=lastPageNum;
    }
    setCurrentPage(pageNumber);
    let tLI = pageNumber * itemsPerPage;
    const indexOfFirstItem = tLI - itemsPerPage;
    if(tLI>sortedProducts.length){//to prevent out of bounds of array change according to sortedProducts.length
      tLI = sortedProducts.length;
    }
    const indexOfLastItem = tLI;
    //don't use slice with if and else it somehow confuses react and always does strange things
    //only one line with one slice should work
    //no confusion here just some additional math up there
    setCurrentItems(()=>{return sortedProducts.slice(indexOfFirstItem, indexOfLastItem)});
  };

  // Function to add a product to the cart
  const addToCart = (product) => {
    // Check if the product already exists in the cart
    const existingItem = cartItems.find((item) => item._id === product._id);
  
    if (existingItem) {
      // If the product already exists, update the quantity
      const updatedCartItems = cartItems.map((item) => {
        if (item._id === product._id) {
          return {
            ...item,
            name: product.name,//update in case of manipulation but server will still handle checkout this is for user view only
            quantity: item.quantity + 1, // Increase the quantity
            price: Number(product.price),//update in case of manipulation but server will still handle checkout this is for user view only
          };
        }
        return item;
      });
  
      setCartItems(updatedCartItems);
    } else {
      // If the product doesn't exist, add it to the cart
      const newItem = {
        _id: product._id,
        name: product.name,
        quantity: 1, // Set the initial quantity as 1
        price: Number(product.price),
      };
      setCartItems([...cartItems, newItem]);
    }
  };
  
  const removeFromCart = (product) => {
    const updatedCartItems = cartItems.filter((item) => item._id !== product._id);
    setCartItems(updatedCartItems);
  };

  const toggleCartVisibility = () => {
    setShowCart(!showCart);
  };

  const deleteProduct = async (productId) => {
    try {
      await axios.delete(`/api/products/${productId}`);
      // Fetch updated product list after deletion
      fetchData();
      alert("Product Deleted");
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };
  
  return (
    <div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-4">
            <input
              className="form-control"
              type="text"
              placeholder="Filter by name"
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
              }}
            />
            <label htmlFor="filterCategory">Select Category:
              <select
                className="form-select"
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                }}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="col-4">
            <label htmlFor="sortCriteria">Sort by:</label>
            <select
              className="form-select"
              value={sortCriteria}
              onChange={(e) => {
                setSortCriteria(e.target.value);
              }}
            >
              <option value="id">Product Id</option>
              <option value="name">Name</option>
              <option value="price">Price</option>
            </select>
  
            <label htmlFor="sortOrder">Sort order:</label>
            <select
              className="form-select"
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value);
              }}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
          <div className="col-2">
            {isAdmin && (
              <a href="/Products/add" className="btn btn-primary">
                Add Product
              </a>
            )}
          </div>
        </div>
      </div>
  
      <div className="product-grid">
        {currentItems.length > 0 ? (
          currentItems.map((product) => (
            <div key={product._id} className="card">
              <div>
                {isAdmin && (
                  <button className="btn btn-danger" onClick={() => deleteProduct(product._id)}>
                    Delete
                  </button>
                )}
                <Link to={`/products/${product._id}`}>
                  <img className="card-img-top" src={product.image} alt={product.name} />
                  <h3 className="card-title">{product.name}</h3>
                </Link>
              </div>
              <div>
                <p>Stock: {product.quantity}</p>
                <p>Price: ₱{product.price}</p>
      {isAuthenticated && (
                <button className="btn btn-primary" onClick={() => addToCart(product)}>
                  Add to Cart
                </button>
      )}
              </div>
            </div>
          ))
        ) : (
          <p>No Products at the moment</p>
        )}
      </div>
  
      {/* Shopping cart */}
      {isAuthenticated && (
      <div>
        <button className="btn cart-toggle" onClick={toggleCartVisibility}>
          Toggle Cart
        </button>
        <div className={`shopping-cart ${showCart ? 'show' : ''}`}>
          <ShoppingCart cartItems={cartItems} addToCart={addToCart} removeFromCart={removeFromCart} refreshProductList={fetchData} setCartItems={setCartItems} />
        </div>
      </div>
      )}
      {/* Pagination */}
      <div className="container-fluid">
        <div className="row">
          <span className="pagination">
            {Array.from({ length: Math.ceil(sortedProducts.length / itemsPerPage) }).map((_, index) => (
              <button key={index} onClick={() => paginate(index + 1)} className="btn">
                {index + 1}
              </button>
            ))}
          </span>
        </div>
      </div>
    </div>
  );
  
};