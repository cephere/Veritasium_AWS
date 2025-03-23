import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa';
import './ResetPassword.css';

const ResetPassword = () => {
    const nav = useNavigate();
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isNewPasswordVisible, setisNewPassword] = useState(false);
    const [isConfirmPasswordVisible, setisConfirmPassword] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState('');

    const handleSendOtp = async (e) => {
        e.preventDefault();
        // Call your backend API to send OTP
        // Example: await sendOtpToEmail(email);
        console.log('Sending OTP to:', email);
        setStep(2);
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        // Call your backend API to verify OTP
        // Example: const isValid = await verifyOtp(email, otp);
        console.log('Verifying OTP:', otp);
        const isValid = true;
        if (isValid) {
            setStep(3);
        } else {
            setMessage('Invalid OTP. Please try again.');
        }
    };

    // Handles password visibility toggling
    const toggleNewPasswordVisibility = () => {
        setisNewPassword(!isNewPasswordVisible);
    };
    const toggleConfirmPasswordVisibility = () => {
        setisConfirmPassword(!isConfirmPasswordVisible);
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage('Passwords do not match.');
            return;
        }
        // Call your backend API to reset the password
        // Example: await resetUser Password(email, newPassword);
        console.log('Resetting password for:', email);
        setShowPopup(true);
    };

    // Handles the pop up
    const closePopup = () => {
        setShowPopup(false);
    };

    return (
        <div className='login-container'>
            <div className='padding'>
                {step === 1 && (
                    <>
                        <button className="back-button" onClick={() => nav('/Login')}>
                        <FaArrowLeft /> <p className='login'>Back to Login</p>
                        </button>

                        <h2>Reset your password</h2>
                        <form className='emailform' onSubmit={handleSendOtp}>
                            <input
                                className='input'
                                type="email"
                                placeholder="Enter your email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <button className='butt' type='submit'>Send OTP</button>
                        </form>
                    </>
                    
                )}

                {step === 2 && (
                    <>
                        <button className="back-button" onClick={() => setStep(1)}>
                        <FaArrowLeft /> <p className='login'>Back</p>
                        </button>

                        <h2>Reset your password</h2>

                        <form className='emailform' onSubmit={handleVerifyOtp}>
                            <input
                                className='input'
                                type="text"
                                placeholder="Enter the OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                            />
                            <button className='butt' type='submit'>Verify OTP</button>
                        </form>
                    </>
                    
                )}

                {step === 3 && (
                    <>
                        <h2>Reset your password</h2>

                        <form className='emailform' onSubmit={handleResetPassword}>
                            <div className='password-container'>
                                <input
                                    className='password' type={isNewPasswordVisible ? 'text' : 'password'}
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required/>
                                <button type="button" onClick={toggleNewPasswordVisibility} className='eye-button'>
                                    {isNewPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            <div className='password-container'>
                                <input
                                    className='password' type={isConfirmPasswordVisible ? 'text' : 'password'}
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required/>
                                <button type="button" onClick={toggleConfirmPasswordVisibility} className='eye-button'>
                                {isConfirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            {message && <p className="passworderror">{message}</p>}
                            <button className='butt' type='submit'>Reset Password</button>
                        </form>
                    </>
                )}
                {showPopup && (
                    <div className="popup">
                        <div className="popup-content">
                            <h2>Password Reset Successful!</h2>
                            <p className='description'>You can now proceed to login.</p>
                            <NavLink to="/Login" className="navlink-button" onClick={closePopup}>Go to Login</NavLink>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;