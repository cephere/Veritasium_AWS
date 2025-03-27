import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import axios from "axios";
import "./Benchmark.css";

const Benchmark = () => {
    const [imageResults, setImageResults] = useState([]);
    const [textResults, setTextResults] = useState([]);
    const [showResults_image, setShowResults_image] = useState(false);
    const [showResults_text, setShowResults_text] = useState(false);
    const [article_image, setArticle_image] = useState("");
    const [article_text, setArticle_text] = useState("");
    const username = localStorage.getItem('username');

    // Fetch API for image-based prediction
    const fetchapi_image = async () => {
        try {
            const response = await axios.get("https://inidczi2h2.execute-api.ap-southeast-1.amazonaws.com/api/load_model");
            setImageResults(response.data);  // Store image results separately
            setShowResults_image(true);
        } catch (error) {
            console.error("Error fetching image prediction data", error);
        }
    };

    // Fetch API for text-based prediction
    const fetchapi_text = async () => {
        try {
            const response = await axios.post(
                "https://k1jro7dagk.execute-api.ap-southeast-1.amazonaws.com/dev/load_model",
                { input_text: article_text },  // Send input text
                { headers: { "Content-Type": "application/json" } }
            );
            setTextResults(response.data);
            setShowResults_text(true);
        } catch (error) {
            console.error("Error fetching text prediction data", error);
        }
    };

    // Handle Image Prediction
    const handlePredict_image = async (event) => {
        event.preventDefault();
        await fetchapi_image(); 
    };

    // Handle Text Prediction
    const handlePredict_text = async (event) => {
        event.preventDefault();
        await fetchapi_text(); 
    };

    return (
        <div className="container">
            {/* Top Navigation */}
            <div className="topnav">
                <div className="nav-left">
                    <h2>VERITASIUM: FAKE NEWS DETECTION</h2>
                </div>
                <div className="nav-right">
                    <h2>Hello, {username}!</h2>
                    <img className="icon" src="icon.png" alt="User Icon" />
                    <h2>|</h2>
                    <h2>
                        <NavLink to="/">Logout</NavLink>
                    </h2>
                </div>
            </div>
            
            <div className="box">
                <form onSubmit={handlePredict_image}>    
                    <h2 className="box-text-header">Input News Article (Image-Based)</h2>
                    <input
                        type="text"
                        className="text-box"
                        value={article_image}
                        onChange={(e) => setArticle_image(e.target.value)}
                        placeholder="Enter your news article here..."
                    />
                    <div style={{ padding: "15px" }}>
                        <button className="butt" style={{ fontSize: '20px' }} type="submit">
                            PREDICT (IMAGE)
                        </button>
                    </div>
                </form>

                <form onSubmit={handlePredict_text}>    
                    <h2 className="box-text-header">Input News Article (Text-Based)</h2>
                    <input
                        type="text"
                        className="text-box"
                        value={article_text}
                        onChange={(e) => setArticle_text(e.target.value)}
                        placeholder="Enter your news article here..."
                    />
                    <div style={{ padding: "15px" }}>
                        <button className="butt" style={{ fontSize: '20px' }} type="submit">
                            PREDICT (TEXT)
                        </button>
                    </div>
                </form>
            </div>       

            {/* Image-Based Prediction Results */}
            {showResults_image && (
                <div className="container-vertical">
                    <h2 className="container-text">Image-Based Prediction Results:</h2>
                    {imageResults.length > 0 ? (
                        imageResults.map((algo, index) => (
                            <div className="container-horizontal" key={`${algo.model_name || 'image'}-${index}`}>
                                <h2 className="prediction-container">
                                    {algo.model_name}: {algo.prediction}
                                </h2>
                                <a className="prediction-container-a" href="https://www.geeksforgeeks.org/machine-learning-algorithms/" target="_blank" rel="noopener noreferrer">
                                    More Details
                                </a>
                            </div>
                        ))
                    ) : (
                        <h2 className="container-text">No image results found</h2>
                    )}
                </div>
            )}

            {/* Text-Based Prediction Results (Always Appears Below Image Results) */}
            {showResults_text && (
                <div className="container-vertical">
                    <h2 className="container-text">Text-Based Prediction Results:</h2>
                    {textResults.length > 0 ? (
                        textResults.map((algo, index) => (
                            <div className="container-horizontal" key={`${algo.model_name || 'text'}-${index}`}>
                                <h2 className="prediction-container">
                                    {algo.model}: {algo.prediction}
                                </h2>
                                <a className="prediction-container-a" href="https://www.geeksforgeeks.org/machine-learning-algorithms/" target="_blank" rel="noopener noreferrer">
                                    More Details
                                </a>
                            </div>
                        ))
                    ) : (
                        <h2 className="container-text">No text results found</h2>
                    )}
                </div>
            )}
        </div>
    );
};

export default Benchmark;
