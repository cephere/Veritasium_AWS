import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa';

import './Login.css';

const Login = () => {
    // States to handle credentials and login validations
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [isValidUsername, setIsValidUsername] = useState(true);
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false); // State for password visibility
    const [showPopup, setShowPopup] = useState(false);
    const nav = useNavigate();

    // State to change between forms
    const [activeButton, setActiveButton] = useState('login');

    // Handles change between forms
    const handleButtonClick = (button) => {
        setActiveButton(button);
        setUsername('');
        setEmail('');
        setPassword('');
        setMessage('');
        setIsValidUsername(true);
    };

    // Handles prohibited characters in username
    const validateUsername = (username) => {
        // Regular expression to allow only alphanumeric characters
        const regex = /^[a-zA-Z0-9]+$/;
        return regex.test(username);
    };

    // Handles username change
    const handleUsernameChange = (e) => {
        const username = e.target.value;
        setUsername(username);
        setIsValidUsername(validateUsername(username));
    };

    // Handles the register function
    const handleRegister = async (e) => {
        e.preventDefault();
        if (!isValidUsername) {
            setMessage("Username can only contain letters and numbers.");
            return;
        }
        try {
            const response = await axios.post('https://bhelhdyj88.execute-api.ap-southeast-1.amazonaws.com/api/register', {
                username,
                email,
                password,
            });
            setShowPopup(true);
        } catch (error) {
            setMessage(error.response ? error.response.data.error : "An error occurred");
        }
    };

    // Handles the popup
    const closePopup = () => {
        setShowPopup(false);
        setUsername('');
        setEmail('');
        setPassword('');
        setMessage('');
        setIsValidUsername(true);
        setActiveButton('login');
    };

    // Handles the register function
    const handleLogin = async (e) => {
        e.preventDefault();
    
        try {
            const response = await axios.post('https://bhelhdyj88.execute-api.ap-southeast-1.amazonaws.com/api/login', {
                username,
                password,
                isAdmin: activeButton === 'admin'
            });
    
            // Set success message
            setMessage(response.data.message);
    
            // Store session information
            sessionStorage.setItem('username', username);
    
            // Redirect based on user type
            if (activeButton === 'admin') {
                nav('/Admin'); 
            } else {
                nav('/Benchmark');
            }
    
        } catch (error) {
            // Handle different error cases
            setMessage(error.response?.data?.error || "An unexpected error occurred. Please try again.");
        }
    };
    

    // Handles password visibility toggling
    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    return (
        <div className='bg'>
            <div className='login-container'>
                <div className='padding'>
                    <button className="back-button" onClick={() => nav('/')}>
                        <FaArrowLeft /> <p className='Home'>Back to Home</p>
                    </button>

                    <div className='login-toggle'>
                        <button 
                            className={`toggle-button ${activeButton === 'login' ? 'active' : ''}`} 
                            onClick={() => handleButtonClick('login')}
                            autoFocus
                        >
                            <h2>Login</h2>
                        </button>
                        <button 
                            className={`toggle-button ${activeButton === 'admin' ? 'active' : ''}`} 
                            onClick={() => handleButtonClick('admin')}
                        >
                            <h2>Admin Login</h2>
                        </button>
                        <button 
                            className={`toggle-button ${activeButton === 'register' ? 'active' : ''}`} 
                            onClick={() => handleButtonClick('register')}
                        >
                            <h2>Register</h2>
                        </button>
                    </div>

                    {activeButton === 'register' ? (
                        <form onSubmit={handleRegister} className="register-form">
                            <input className='input' type="email" placeholder="Input email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            <input className='input' type="text" placeholder="Input username" value={username} onChange={handleUsernameChange} required />
                            <div className='password-container'>
                                <input
                                    className='password' type={isPasswordVisible ? 'text' : 'password'}
                                    placeholder="Input password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button type="button" onClick={togglePasswordVisibility} className='eye-button'>
                                    {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            <button className='butt' type='submit'>Register</button>
                            {message && <p className='error'>{message}</p>}
                        </form>
                    ) : (
                        <form onSubmit={handleLogin}>
                            
                            <input
                                className='input'
                                type="text"
                                placeholder="Input username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                            <div className='password-container'>
                                <input
                                    className='password' type={isPasswordVisible ? 'text' : 'password'}
                                    placeholder="Input password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button type="button" onClick={togglePasswordVisibility} className='eye-button'>
                                    {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            <NavLink className="ResetPassword" to="/ResetPassword">Forgot Password?</NavLink>
                            <button className='butt' type='submit'>Login</button>
                            {message && <p className='error'>{message}</p>}
                        </form>
                    )}
                    {showPopup && (
                        <div className="popup">
                            <div className="popup-content">
                                <span className="close" onClick={closePopup}>&times;</span>
                                <h2>Account Creation Successful!</h2>
                                <p className='description'>You can now proceed to login.</p>
                                <NavLink to="/Login" className="navlink-button" onClick={closePopup}>Go to Login</NavLink>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;