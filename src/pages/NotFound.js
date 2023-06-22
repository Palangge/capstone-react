import React, { useEffect, useState } from 'react';
import {Navigate} from 'react-router-dom';

export const NotFound = () => {
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
      const timeout = setTimeout(() => {
        setRedirect(true);
      }, 5000); // (in milliseconds)
  
      return () => {
        clearTimeout(timeout);
      };
    }, []);
  
    if (redirect) {
      return <Navigate to="/" />; // Redirect to the desired page
    }
  
    return (
        <>
            <h1>Error 404 - Page not found.</h1>
            <p>Redirecting to front page after 5 seconds...</p>
        </>
    );
}