import React, { useState } from "react";
import axios from "axios";
import '../../assets/Login.css';
import loginImage from "../../assets/images/login.jpg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
  
    // Basic field validation
    if (!email || !password) {
      setErrorMessage("Please fill out all fields.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/auth/login", {
        email,
        password,
      });
    
      if (response.status === 200) {
        alert("Login successful!");
        console.log("Token:", response.data.token);
        localStorage.setItem("authToken", response.data.token);
      }
    } catch (error) {
      console.error("Login error:", error);  // Log the full error for debugging
      
      if (error.response) {
        // If the error contains a response from the backend
        if (error.response.status === 401) {
          setErrorMessage("Invalid email or password.");
        } else {
          setErrorMessage("An error occurred. Please try again.");
        }
      } else if (error.request) {
        // If the request was made, but no response was received
        setErrorMessage("No response from the server. Please check your connection.");
      } else {
        // General error (e.g., issue with setting up the request)
        setErrorMessage("Network error. Please try again later.");
      }
    }
  };    
  

  return (
    <div className="Login_fullbackground">
      <article className="Login2div">
        <aside className="login-container">
          <img src={loginImage} alt="Login" />
        </aside>
        <div className="login-container">
          <h1>Login</h1>
          <form className="login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            {errorMessage && <p className="error-message">{errorMessage}</p>}

            <div className="forgot-password">
              <a href="/forgot-password">Forgot Password?</a>
            </div>

            <button type="submit" onClick={handleLogin} className="login-button">
              Login
            </button>
          </form>
        </div>
      </article>
    </div>
  );
};

export default Login;
