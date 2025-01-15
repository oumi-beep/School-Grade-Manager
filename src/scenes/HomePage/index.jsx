import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginImage from "../../assets/images/logo.jpg";

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
                    <span className="School">Ensa Kh</span>
                </div>

                <nav className="nav-links">
                    <a href="#">Events</a>
                    <a href="#">Clubs</a>
                    <a href="#">FAQ</a>
                    <a href="#">Contacts</a>
                </nav>

                <article className="right-section">
                    

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
                        <p >Your journey to knowledge and adventure starts here.</p>
                        <button >View More</button>
                    </div>
                </section>

                <section className="features">
                    <h2>What's Happening</h2>
                    <div className="feature-cards">
                        <div className="cardd">
                            <h3 className="H3HomePage">Upcoming Events</h3>
                            <p className="buttonHomePage">Stay updated with the latest school events and activities.</p>
                            <button className="buttonHomePage">View Events</button>
                        </div>
                        <div className="cardd">
                            <h3 className="H3HomePage">Join a Club</h3>
                            <p className="buttonHomePage">Discover clubs that match your interests and passions.</p>
                            <button className="buttonHomePage">Explore Clubs</button>
                        </div>
                        <div className="cardd">
                            <h3 className="H3HomePage">Student Support</h3>
                            <p className="buttonHomePage">Get answers to your questions and access helpful resources.</p>
                            <button className="buttonHomePage">Learn More</button>
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
