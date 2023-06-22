import React, { useEffect } from 'react';
import axios from 'axios';

export const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(localStorage.getItem(localStorage.getItem("isAuthenticated")|| false));

  const [isAdmin, setIsAdmin] = React.useState(localStorage.getItem(localStorage.getItem("isAdmin")|| false));

  const fetchIsAdmin = async () => {
    try {
      const response = await axios.get('/users/isAdmin');
      const data = response.data;
      setIsAdmin(data.message);
      localStorage.setItem("isAdmin",data.message);
    } catch (error) {
      localStorage.removeItem("isAdmin");
      console.error('Failed to fetch user status:', error);
    }
  };

  const fetchIsAuthenticated = async () => {
    try {
      const response = await axios.get('/users/isLoggedIn');
      const data = response.data;
      setIsAuthenticated(data.message);
      localStorage.setItem("isAuthenticated",data.message);
    } catch (error) {
      localStorage.removeItem("isAuthenticated");
      console.error('Failed to fetch user status:', error);
    }
  };
  
  useEffect(() => {
    fetchIsAuthenticated();
    fetchIsAdmin();
    const rootLocation = window.location.origin + '/';
    console.log('Root Location:', rootLocation);
    const currentLocation = window.location.href;
    //console.log('Current Location:', currentLocation);
    const loc = currentLocation.replace(rootLocation, '');
    console.log('Current Location:', loc);

    const anchorElement = document.querySelectorAll('a.nav-link[href="/' + loc + '"]');
    anchorElement.forEach((element) => {
      element.href = '#';
      element.classList.add('active');
      element.classList.add('rounded-5');
      element.setAttribute('aria-current', 'page');
    });
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const loginAnchor = document.querySelectorAll('a.nav-link[href="/Login"]');
      loginAnchor.forEach((element) => {
        element.href = '/Logout';
        element.textContent = 'Logout';
      });
    }else{//just in case page didn't change somehow
      const loginAnchor = document.querySelectorAll('a.nav-link[href="/Logout"]');
      loginAnchor.forEach((element) => {
        element.href = '/Login';
        element.textContent = 'Login';
      });
    }
  },[isAuthenticated]);

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          <img
            src="/brand-image/android-chrome-192x192.png"
            height="70"
            alt="Logo"
          />
          Penta-K
        </a>
        <div
          className="navbar-toggler text-dark"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#offcanvasRight"
          aria-controls="offcanvasRight"
        >
          <span className="navbar-toggler-icon"></span>
        </div>
        <div
          className="collapse navbar-collapse"
          tabIndex="-1"
          id="offcanvasRight"
          aria-labelledby="offcanvasRightLabel"
        >
          <ul className="navbar-nav mr-auto ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link" href="/">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/Products">
                Products
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/About">
                About Us
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/Contact">
                Contact
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/Login">
                Login
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};