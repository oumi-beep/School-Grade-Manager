import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginImage from "../../assets/images/login.jpg";

import "../../assets/homePage.css";

const HomePage = () => {
    const navigate = useNavigate();
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleTheme = () => {
        setIsDarkMode((prevMode) => !prevMode);
        document.body.className = isDarkMode ? "light-mode" : "dark-mode";
    };

    const handleLoginClick = () => {
        navigate("/Login");
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
                        <div className="icon moon">🌙</div>
                        <div className="icon sun">☀️</div>
                    </aside>

                    <div className="button">
                        <a href="#" onClick={handleLoginClick}>
                            Login
                        </a>
                    </div>
                </article>
            </header>

            <main>
                <section className="hero">
                    <div className="hero-content">
                        <h1>Welcome to School</h1>
                        <p>Your journey to knowledge and adventure starts here.</p>
                        <button onClick={() => navigate("/explore")}>Explore More</button>
                    </div>
                </section>

                <section className="features">
                    <h2>What's Happening</h2>
                    <div className="feature-cards">
                        <div className="card">
                            <h3>Upcoming Events</h3>
                            <p>Stay updated with the latest school events and activities.</p>
                            <button>View Events</button>
                        </div>
                        <div className="card">
                            <h3>Join a Club</h3>
                            <p>Discover clubs that match your interests and passions.</p>
                            <button>Explore Clubs</button>
                        </div>
                        <div className="card">
                            <h3>Student Support</h3>
                            <p>Get answers to your questions and access helpful resources.</p>
                            <button>Learn More</button>
                        </div>
                    </div>
                </section>
            </main>

            <footer>
                <p className="footerright">&copy; 2024 School. All rights reserved.</p>
                <div className="footer-links">
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms of Service</a>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;
