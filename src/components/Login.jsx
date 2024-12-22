import React, { useState } from "react";
import '../assets/Login.css';
import loginImage from "../assets/images/login.jpg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill out all fields.");
      return;
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

            <div className="forgot-password">
              <a href="/forgot-password">Forgot Password?</a>
            </div>

            <button type="submit" className="login-button">
              Login
            </button>
          </form>
        </div>
      
      </article>
    </div>
  );
};

export default Login;
