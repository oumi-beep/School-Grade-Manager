import React from 'react';
import '../../assets/appHeader.css';
import loginImage from '../../assets/images/logo.png';

const AppHeader = ({ toggleTheme, handleLoginClick }) => {
    return (
        <header className="headpage">


            <nav className="nav-links">
                <a href="/">Home</a>
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
                    <a href="/" > Logout </a>
                </div>
            </article>
        </header>
    );
};

export default AppHeader;
