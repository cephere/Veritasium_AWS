import React, { useState, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import "./Home.css";

const Home = () => {
  // States for popup and section navigation
  const [showPopup, setShowPopup] = useState(false);
  const hero1Ref = useRef(null);
  const hero41Ref = useRef(null);
  const hero5Ref = useRef(null);
  const hero6Ref = useRef(null);

  // Handles Benchmark button click
  const handleBenchmarkClick = () => {
    const isAuthenticated = sessionStorage.getItem("username"); // Check if user is logged in
    if (isAuthenticated) {
      window.location.href = "/Benchmark"; // Redirect directly if authenticated
    } else {
      setShowPopup(true); // Show login popup if not authenticated
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  // Handles section navigation
  const scrollToHero1 = () => hero1Ref.current.scrollIntoView({ behavior: 'smooth' });
  const scrollToHero4 = () => hero41Ref.current.scrollIntoView({ behavior: 'smooth' });
  const scrollToHero5 = () => hero5Ref.current.scrollIntoView({ behavior: 'smooth' });
  const scrollToHero6 = () => hero6Ref.current.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="App">
      <nav className="navbar">
        <div className="logo" onClick={() => window.location.href = '/'}>VERITASIUM</div>
        <div className="nav-buttons">
          <a onClick={scrollToHero1}>Home</a>
          <a onClick={scrollToHero4}>How It Works</a>
          <a onClick={scrollToHero5}>Developers</a>
          <a onClick={scrollToHero6}>Benchmark</a>
        </div>
      </nav>

      <section className="hero1" ref={hero1Ref}>
        <h1>Why Fake News Detection Matters</h1>
        <p>The detection of false news proves essential since deceptive information circulates quickly to alter public viewpoints and political choices and democratic operations...</p>
        <button onClick={handleBenchmarkClick}>Benchmark</button>
      </section>

      <section className="hero2">
        <h1>An alarming rise of <em className='orange'>fake news</em> is steadily undermining public trust...</h1>
      </section>

      <section className="hero3">
        <h1><em className='blue'>VERITASIUM</em> addresses this by considering both texts and images...</h1>
      </section>

      <section className="hero41" ref={hero41Ref}>
        <div className='div411'>
          <h1>Search and Extract</h1>
          <p><em>VERITASIUM</em> browses articles and extracts both text and image contents...</p>
        </div>
        <div className='div412'>
          <img src='/aaron.jpg' alt="Search and Extract" />
        </div>
      </section>

      <section className="hero42">
        <div className='div421'>
          <img src='/aaron.jpg' alt="Benchmarking" />
        </div>
        <div className='div422'>
          <h1>Benchmark</h1>
          <p>A customized machine learning model is developed and fine-tuned through numerous training and testing...</p>
        </div>
      </section>

      <section className="hero5" ref={hero5Ref}>
        <h1>Meet the developers</h1>
        <div className='developers'>
          <div className="developer1">
            <img src="/aaron.jpg" alt="Aaron Alimbon" />
            <h2>Aaron Alimbon</h2>
            <p>Specialist in Web Development and User Experience.</p>
          </div>
          <div className="developer2">
            <img src="/matthew.jpg" alt="Matthew Centeno" />
            <h2>Matthew Centeno</h2>
            <p>Expert in Machine Learning and Data Analysis.</p>
          </div>
        </div>
      </section>

      <section className="hero6" ref={hero6Ref}>
        <h1>Start Benchmarking Today!</h1>
        <p>Join us in the fight against fake news. Click below to begin.</p>
        <button onClick={handleBenchmarkClick}>Benchmark</button>
      </section>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <span className="close" onClick={closePopup}>&times;</span>
            <h2>Account Required</h2>
            <p>You need to create an account to ensure data security, privacy, and storage safety.</p>
            <NavLink to="/Login" className="navlink-button" onClick={closePopup}>Go to Login</NavLink>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
