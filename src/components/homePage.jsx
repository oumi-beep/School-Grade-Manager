import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginImage from "../assets/images/login.jpg";

import "../assets/homePage.css";

const HomePage = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
    document.body.className = isDarkMode ? "light-mode" : "dark-mode"; 
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <div>
      <header>
        <div className="logo">
          <img src={loginImage} alt="Logo" />
          <span>School</span>
        </div>

        <nav className="nav-links">
          <a href="#">Events</a>
          <a href="#">Clubs</a>
          <a href="#">FAQ</a>
          <a href="#">Contacts</a>
        
        </nav>

        <article className="right-section">
          <aside className="theme-toggle" onClick={toggleTheme}>
            <div className="icon moon">
              🌙 
            </div>
            <div className="icon sun">
              ☀️ 
            </div>
          </aside>

          <div className="Botton">
            <a href="#" onClick={handleLoginClick}>
              Login
            </a>
          </div>
        </article>
      </header>

      <main>
        <section className="hero">
          <h1>School Management </h1>
          <p>
          students are dedicated to achieving excellence in their studies. Join us to experience a supportive and enriching educational environment that fosters growth and success.
          </p>
          <div className="reviews">
            <div className="review-item">
              <span>4.5</span>
            </div>
            <div className="review-item">
              <span>4.7</span>
            </div>
            <div className="review-item">
              <span>4.9</span>
            </div>
            <div className="review-item">
              <span>5.0</span>
            </div>
            <div className="review-item">
              <span>4.8</span>
            </div>
          </div>
        </section>

        <section className="featured-collection">
          <h2>New collection</h2>
          <div className="collection-items">
            <div className="item">dddddddddddd</div>
            <div className="item">ddddddddddd</div>
            <div className="item">dddddddddddddddd</div>
          </div>
          <div className="collection-info">
            <h3> Light </h3>
            <p>fiiiiiiii</p>
            <a href="#" className="btn">
              readMore
            </a>
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-content">
          <div className="footer-section">
            <h4>About</h4>
            <ul>
              <li>
                <a href="#">Our Story</a>
              </li>
              <li>
                <a href="#">Careers</a>
              </li>
              <li>
                <a href="#">Press</a>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Support</h4>
            <ul>
              <li>
                <a href="#">FAQ</a>
              </li>
              <li>
                <a href="#">Shipping</a>
              </li>
              <li>
                <a href="#">Returns</a>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Connect</h4>
            <ul>
              <li>
                <a href="#">Instagram</a>
              </li>
              <li>
                <a href="#">Facebook</a>
              </li>
              <li>
                <a href="#">Twitter</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="copyright">&copy; 2024 Grace. All rights reserved.</div>
      </footer>
    </div>
  );
};

export default HomePage;
