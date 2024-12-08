import React, { useState } from 'react';
import '../../assets/css/MainPage.css'; // Import CSS for styling

const MainPage = () => {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [nutritionMenu, setNutritionMenu] = useState(false); // State to manage nutrition menu visibility

  const toggleMobileMenu = () => setMobileMenu(!mobileMenu);
  const toggleNutritionMenu = () => setNutritionMenu(!nutritionMenu); // Toggle function for nutrition menu

  return (
    <div className="main-page">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-logo">
          <h1>GymFlex</h1>
        </div>
        <div className={`navbar-links ${mobileMenu ? 'active' : ''}`}>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/exercises">AI Workout Plan</a></li>
            <li><a href="/workouts">Workouts</a></li>
            <li 
              className="nutrition-link" 
              onMouseEnter={() => setNutritionMenu(true)} 
              onMouseLeave={() => setNutritionMenu(false)} 
              onClick={toggleNutritionMenu}
            >
              <a href="#">Nutrition</a>
              {nutritionMenu && (
                <ul className="dropdown-menu">
                  <li><a href="/nutrition-checker">Nutrition Checker</a></li>
                  <li><a href="/nutrition-plan">Nutrition Plan</a></li>
                  <li><a href="/nutrition-calculator">Calculator</a></li>
                </ul>
              )}
            </li>
            <li><a href="/login">Login</a></li>
            <li><a href="/register">Register</a></li>
          </ul>
        </div>
        <div className="mobile-menu-icon" onClick={toggleMobileMenu}>
          &#9776;
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h2>AI-Powered Custom Workout Plans</h2>
          <p>
            Achieve your fitness goals with personalized plans tailored by AI. 
            Unlock your potential with workouts and nutrition guidance designed just for you.
          </p>
          <a href="/register" className="cta-button">Get Your AI Plan</a>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="feature-item">
          <h3>AI-Generated Workout Plans</h3>
          <p>Receive personalized training routines based on your fitness level, goals, and preferences.</p>
        </div>
        <div className="feature-item">
          <h3>Nutrition Guidance</h3>
          <p>Get tailored meal plans and nutritional advice to complement your workout routine.</p>
        </div>
        <div className="feature-item">
          <h3>Progress Tracking</h3>
          <p>Monitor your progress with detailed reports on your workouts, calorie intake, and achievements.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2024 GymFlex. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default MainPage;
