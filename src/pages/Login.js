import React from "react";
import axios from 'axios';

export const Login = () => {
    const [error, setError] = React.useState(false);
    const [formData, setFormData] = React.useState({
        email: '',
        password: ''
      });
      const [isAuthenticated, setIsAuthenticated] = React.useState(false);
      //const [isAdmin, setIsAdmin] = useState(false);
      const fetchIsAdmin = async () => {
        try {
          const response = await axios.get('/users/isAdmin');
          const data = response.data;
          //setIsAdmin(data.message);
          localStorage.setItem("isAdmin",data.message);
        } catch (error) {
          //setIsAdmin(false);
          localStorage.removeItem("isAdmin");
          console.error('Failed to fetch user status:', error);
        }
      };
      
      const handleSubmit = async (e) => {
          e.preventDefault();
          setError(false);
          if(isAuthenticated){
            alert("Already Authenticated, logout first.");
            window.location.replace(window.location.origin);
          }
      
          /*// Form validation and other code
          if(!formData.email || !formData.password){
              setError("There is/are empty fields");
              return false;
          }*/
          // Make the API request to the server
          try {
            const response = await axios.post('/users/login', formData);

            if (response.status === 200) {
              // Login successful
              setIsAuthenticated(true);
              localStorage.setItem("isAuthenticated",true);
              fetchIsAdmin();
              setTimeout(() => {
                window.location.replace(window.location.origin);
              }, 3000);
            } else {
              setIsAuthenticated(false);
              localStorage.removeItem("isAuthenticated");
              const errorData = response.data;
              setError(errorData.message);
            }
          } catch (error) {
            // Handle any network or server error
            setError('An error occurred. Please try again later.');
          }
        };
      
        const handleChange = (e) => {
          setFormData({
            ...formData,
            [e.target.name]: e.target.value
          });
        };
  
        const AuthenticationModal = () => {
          return (
              <div class="alert alert-success alert-dismissible fade show" role="alert">
                  You have been successfully authenticated.
                  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
              </div>
          );
        };
        const ErrorModal = () => {
          return (
              <div class="alert alert-danger alert-dismissible fade show" role="alert">
                  {error}
                  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
              </div>
          );
        };
    return (
        <>
            <div class="container-fluid row row-cols-1 row-cols-sm-4 mb-3 g-1">

                <form id="login-form" class="container col-sm-4 pt-3 pb-3 mt-3 shadow border rounded-3" onSubmit={handleSubmit}>
                    <div class="card-body align-items-center">
                        {isAuthenticated && <AuthenticationModal />}
                        {/* Display the error message */}
                        {error && <ErrorModal />}
                        <h3 class="text-center text-body-secondary rounded-2">
                            Login
                        </h3>
                        {/* Email Address field */}
                        <div class="mb-3 text-start">
                            <label for="email" class="form-label">
                                Email address
                            </label>
                            <input type="email" name="email" class="form-control" id="email" placeholder="Enter your Email Address" required value={formData.email} onChange={handleChange} />
                            {error && !formData.email && <span class="error">Enter Valid Email</span>}
                        </div>
                        {/* Password field */}
                        <div class="mb-3 text-start">
                            <label for="password" class="form-label">
                                Password
                            </label>
                            <input type="password" name="password" class="form-control" id="password" placeholder="Password" required value={formData.password} onChange={handleChange} />
                            {error && !formData.password && <span class="error">Password cannot be empty</span>}
                        </div>

                        {/* Action Buttons */}
                        <button type="submit" class="btn btn-secondary">
                            Login
                        </button>

                        <a href={window.location.origin+"/Register"} class="btn btn-outline-secondary">
                            Register
                        </a>
                    </div>
                </form>

                <div id="loginToast" class="toast position-fixed top-0 start-50 translate-middle-x" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="toast-body">
                        <span id="loginToastMsg"></span>
                    </div>
                </div>

            </div>
        </>
    );
}