import React from "react";

export const Register = () => {
    const [error, setError] = React.useState(false);
    const [formData, setFormData] = React.useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
      });
    const [isRegistered, setIsRegistered] = React.useState(false);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(false);
        setIsRegistered(false);
    
        // Form validation and other code
        if(!formData.firstName || !formData.lastName || !formData.email || !formData.password){
            setError("There is/are empty fields");
            return false;
        }
        // Make the API request to the server
        try {
            console.log('fetch start');
          const response = await fetch('/users/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
          });
          console.log('fetch end');
          console.log(response);
    
          if (response.ok) {
            // Registration successful
            setIsRegistered(true);
            setTimeout(() => {
                window.location.replace(window.location.origin+"/Login");
              }, 3000);
          } else {
            const errorData = await response.json();
            setError(errorData.message);
          }
        } catch (error) {
          // Handle any network or server error
          setError('An error occurred. Please try again.');
        }
      };
    
      const handleChange = (e) => {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value
        });
      };

      const RegistrationModal = () => {
        return (
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                You have been successfully registered.
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
    
                <div class="card-body align-items-center">
                    
                    <form id="registration-form" class="container col-sm-4 pt-3 pb-3 mt-3 shadow border rounded-3" onSubmit={handleSubmit}>    
                        {isRegistered && <RegistrationModal />}
                        {/* Display the error message */}
                        {error && <ErrorModal />}
                        <h3 class="text-center text-body-secondary rounded-2">
                            Register
                        </h3>
                        {/*First Name field */}
                        <div class="field-container text-start">
                            <label for="firstName">First Name:</label>
                            <input name="firstName" type="text" id="firstName" value={formData.firstName} onChange={handleChange}/>
                            {error && !formData.firstName && <span class="error">Enter Valid First Name</span>}
                        </div>
                        {/* Last Name field */}
                        <div class="field-container text-start">
                            <label for="lastName">Last Name:</label>
                            <input name="lastName" type="text" id="lastName"  value={formData.lastName} onChange={handleChange} />
                            {error && !formData.lastName && <span class="error">Enter Valid Last Name</span>}
                        </div>
                        {/* Email Address field */}
                        <div class="field-container text-start">
                            <label for="email">Email:</label>
                            <input name="email" type="email" id="email" required value={formData.email} onChange={handleChange} />
                            {error && !formData.email && <span class="error">Enter Valid Email</span>}
                        </div>
                        {/* Password field */}
                        <div class="field-container text-start">
                            <label for="password">Password:</label>
                            <input name="password" type="password" id="password" value={formData.password} onChange={handleChange} />
                            {error && !formData.password && <span class="error">Enter Valid Password</span>}
                        </div>
                        {/* Action Buttons */}
                        <button type="submit" class="btn btn-secondary">
                            Register
                        </button>

                        <a href={window.location.origin+"/Login"} class="btn btn-outline-secondary">
                            Login
                        </a>

                        <div id="registerToast" class="toast position-fixed top-0 start-50 translate-middle-x" role="alert" aria-live="assertive" aria-atomic="true">
                            <div class="toast-body">
                            <span id="registerToastMsg"></span>
                            </div>
                        </div>

                    </form>

                </div>

            </div>
        </>
    );
}