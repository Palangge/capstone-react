import React from "react";
import axios from 'axios';


export const Logout = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(localStorage.getItem(localStorage.getItem("isAuthenticated")|| false));
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [message,setMessage] = React.useState(''); 
  const [error,setError] = React.useState(''); 
  React.useEffect(() => {
    const lout = async () => {
      //setIsAuthenticated(false);
      // Make the API request to the server
      try {
        const response = await axios.get('/users/logout');

        if (response.status === 200) {
          // Logout successful
          setIsAdmin(false);
          setIsAuthenticated(false);
          localStorage.setItem("isAdmin",false);
          localStorage.removeItem("isAuthenticated");
          localStorage.removeItem("isAdmin");
          console.log(response);
          setMessage(response.data.message);
          setTimeout(() => {
            window.location.replace(window.location.origin+"/login");
          }, 100);
        } else {
          const errorData = response.data;
          console.log(response);
          console.log(response.data.message);
          setError(errorData.message);
        }
      } catch (error) {
        // Handle any network or server error
        setError('An error occurred. Please try again later.');
      }
    };
    lout();
  }, []);
  if(message!=""){
    return (
      <>{message}</>
    )
  }
  if(error!=""){
    return (
      <>Error: {error}</>
    )
  }
  return (
      <>
          Logging out
      </>
  );
}