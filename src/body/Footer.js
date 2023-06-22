import React, { useEffect } from 'react';

export const Footer = () => {

  return [
      <foot-top key={1} class="navbar navbar-expand-sm text-white">
        <ul className="navbar-nav mb-2 mb-lg-0 ms-5">
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
      </foot-top>,
      <foot-bot key={2} class="row align-items-center text-center col-12 row m-0">
        <div>
          <i className="fa fa-hand-o-right"></i>
          <a className="navbar-brand" href="#">
            Go back to top
          </a>
          <i className="fa fa-hand-o-left"></i>
        </div>
        <div>
          <a className="navbar-brand" href="#">
            <img src="/brand-image/android-chrome-192x192.png" height="50" alt="Back to Top" />
          </a>
        </div>
        <p>© 2023 Penta-K Sari-Sari Store</p>
      </foot-bot>
  ];
};