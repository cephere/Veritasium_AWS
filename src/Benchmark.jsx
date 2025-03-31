import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import axios from "axios";
import "./Benchmark.css";

const Benchmark = () => {
    const [img_model_results, set_img_model_results] = useState([]); // Model results for image-based prediction
    const [img_pred, set_img_pred] = useState([]); // Final prediction for image-based prediction

    const [showResults_image, setShowResults_image] = useState(false); // Toggle for image model results
    const [showPred_image, setShowPred_image] = useState(false); // Toggle for image prediction

    const [textResults, setTextResults] = useState([]); // Model results for text-based prediction
    const [text_pred, setText_pred] = useState([]); // Final prediction for text-based prediction

    const [showResults_text, setShowResults_text] = useState(false); // Toggle for text model results
    const [showPred_text, setShowPred_text] = useState(false); // Toggle for text prediction
    const [showEval_image, setEval_image] = useState(true); // Toggle for text prediction
    const [showEval_text, setEval_text] = useState(true); // Toggle for text prediction

    const [article_image, setArticle_image] = useState("");
    const [article_text, setArticle_text] = useState("");
    const username = sessionStorage.getItem('username');

    const [user_id_f, setUser_id_f] = useState("");
    const [news_type_f, setNews_type_f] = useState("");
    const [news_link_f, setNews_link_f] = useState("");
    const [news_prediction_f, setNews_prediction_f] = useState("");
    const [user_eval, setUser_eval] = useState("");

    // Fetch API for image-based prediction
    const fetchapi_image = async () => {
        try {
            console.log("Sending request with:", { user_id: username, news_link: article_image });
    
            const response = await axios.post(
                "https://inidczi2h2.execute-api.ap-southeast-1.amazonaws.com/api/load_model",
                { 
                    user_id: username, 
                    news_link: article_image 
                },
                { headers: { "Content-Type": "application/json" } }
            );
  
            set_img_model_results(response.data.results || []);
            set_img_pred(response.data.final_pred);

            setUser_id_f(response.data.used_id || username);
            setNews_type_f(response.data.news_type || "N/A");
            setNews_link_f(response.data.news_link || article_image);
            setNews_prediction_f(response.data.final_pred || "N/A");
            setShowPred_image(true);
    
        } catch (error) {
            alert("Failed to fetch image prediction data. For details, check the console.");
            console.error("Error fetching image prediction data", error);
            setShowPred_image(false);
        }
    };
    
    // Fetch API for text-based prediction
    const fetchapi_text = async () => {
        try {
            const response = await axios.post(
                "https://k1jro7dagk.execute-api.ap-southeast-1.amazonaws.com/dev/load_model",
                { input_text: article_text },
                { headers: { "Content-Type": "application/json" } }
            );
            setTextResults(response.data.results || []);
            setText_pred(response.data.final_prediction);
            setShowPred_text(true);
        } catch (error) {
            alert("Failed to fetch text prediction data. For details, check the console.");
            setShowPred_text(false);
            console.error("Error fetching text prediction data", error);
        }
    };

    const handleScrapeImage = async () => {
        if (!article_image || !article_image.startsWith("http")) {
            alert("Please enter a valid URL!");
            return null;
        }
    
        try {
            const response = await axios.post(
                "https://4c1nj83iyc.execute-api.ap-southeast-1.amazonaws.com/api",
                { 
                    url: article_image,
                    username: username 
                },
                { headers: { "Content-Type": "application/json" } }
            );
    
            console.log("Response from Lambda:", response.data);
    
            if (response.data.status === "success" && response.data.image_url) {
                set_img_model_results(response.data.image_url);
                console.log("Stored image URL:", response.data.image_url);  // Store image URL
                return response.data;  // Ensure function returns response data
            } else {
                console.warn("Image scraping succeeded but no image URL found.");
                return null;
            }
        } catch (error) {
            console.error("Error fetching image data", error);
            alert("Failed to fetch image. Check the console for details.");
            return null;
        }
    };

    const sendDb = async (x) => {
        try {
            const response = await axios.post(
                "https://bhelhdyj88.execute-api.ap-southeast-1.amazonaws.com/api/record",
                { 
                    user_id: Number(user_id_f),
                    news_type: String(news_type_f), 
                    news_link: String(news_link_f),
                    news_prediction: String(news_prediction_f),
                    user_evaluation: String(x)
                },
                { headers: { "Content-Type": "application/json" } }
            );
            console.log("Response from Lambda:", response.data);
        } catch (error) {
            console.error("Error sending data to the database", error);
        }
    }
    
    const image_more = async (event) => {
        event.preventDefault();
        try {
            if (showResults_image == false){
                setShowResults_image(true)
            }
            else{
                setShowResults_image(false)
            }
        } catch (error) {
            console.error("Error fetching text prediction data", error);
        }
    };

    const text_more = async (event) => {
        event.preventDefault();
        try {
            if (showResults_text == false){
                setShowResults_text(true)
            }
            else{
                setShowResults_text(false)
            }
        } catch (error) {
            console.error("Error fetching text prediction data", error);
        }
    }

    // Handle Image Prediction
    const handlePredict_image = async (event) => {
        event.preventDefault();
        await handleScrapeImage();
        alert("Please wait for a few seconds while we process your request...");
        try {
            const scrapeResult = await handleScrapeImage();
            console.log("Scrape Result:", scrapeResult);
    
            if (scrapeResult && scrapeResult.status === "success") {
                await fetchapi_image(scrapeResult.image_url);  // Pass image URL to fetchapi_image
                alert("Image prediction completed successfully! Closed the popup to see the results.");
                setEval_image(true); 
            } else {
                console.warn("Image scraping failed, fetchapi_image will not run.");
            }
        } catch (error) {
            console.error("Error in processing:", error);
        }
    };
    
    // Handle Text Prediction
    const handlePredict_text = async (event) => {
        event.preventDefault();
        alert("Please wait for a few seconds while we process your request...");
        try {
            if (!article_text) {
                alert("Please enter a valid text!");
                return;
            }
            await fetchapi_text(); 
            alert("Text prediction completed successfully!");
            setEval_image(true); 
        } catch (error) {
            console.error("Error in processing:", error);
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem("username");
        window.location.href = "/";
    };

    const handleUserEvaluation = (evalValue) => {
        setUser_eval(evalValue);
        console.log({
            "used_id" : user_id_f,
            "news_type" : news_type_f,
            "news_link" : news_link_f,
            "news_prediction" : news_prediction_f,
            "user_evaluation" : evalValue
        });
        sendDb(evalValue); 
        alert("Thank you for your evaluation!");
        setEval_image(false); 
    };
    
    
    return (
        <div className="container">
            <div className="topnav">
                <div className="nav-left">
                    <NavLink to="/"><h2>VERITASIUM: FAKE NEWS DETECTION</h2></NavLink>
                </div>
                <div className="nav-right">
                    <h3>Hello, {username}!</h3>
                    <img className="icon" src="icon.png" alt="User Icon" />
                    <h3>|</h3>
                    <NavLink to="/" onClick={handleLogout}>Logout</NavLink>
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
            {showPred_image && (
                <div className="container-vertical">
                    <h2 className="container-text">Image-Based Prediction Results:</h2>
                    <div className='container-horizontal'>
                        <h2 className="prediction-container">Final Prediction: {img_pred || "N/A"}</h2>
                    </div>

                    {showEval_image && (
                        <div className='container-horizontal'>
                            <h2 className="prediction-container">User Evaluation</h2>
                            <button className='butt2' onClick={() => handleUserEvaluation("REAL")}>REAL</button>
                            <button className='butt2' onClick={() => handleUserEvaluation("FAKE")}>FAKE</button>
                        </div>
                    )}
                    <button className='butt' onClick={image_more}>More Info</button>
                </div>
            )}

            {showResults_image && (
                <div className="container-vertical">
                    <h2 className="container-text">Image Models:</h2>
                    {img_model_results.length > 0 ? (
                        <>
                            {img_model_results.map((algo, index) => (
                                <div className="container-horizontal" key={`${algo.model_name}-${index}`}>
                                    <h2 className="prediction-container">
                                        {algo.model_name}: {algo.prediction}
                                    </h2>
                                    <a className="prediction-container-a" href="https://www.geeksforgeeks.org/machine-learning-algorithms/" target="_blank" rel="noopener noreferrer">
                                        More Details
                                    </a>
                                </div>
                            ))}
                        </>
                    ) : (
                        <h2 className="container-text">No image results found</h2>
                    )}
                </div>
                )}  

            {showPred_text && (
                <div className="container-vertical">
                    <h2 className="container-text">Text-Based Prediction Results:</h2>
                    <div className='container-horizontal'>
                        <h2 className="prediction-container">Final Prediction: {text_pred || "N/A"}</h2>
                    </div>

                    {showEval_text && (
                        <div className='container-horizontal'>
                            <h2 className="prediction-container">User Evaluation</h2>
                            <button className='butt2' onClick={() => handleUserEvaluation("TRUE")}>TRUE</button>
                            <button className='butt2' onClick={() => handleUserEvaluation("FALSE")}>FALSE</button>
                        </div>
                    )}

                    <button className='butt' onClick={text_more}>More Info</button>
                </div>
            )}


            {/* Text-Based Prediction Results (Always Appears Below Image Results) */}
            {showResults_text && (
                <div className="container-vertical">
                    <h2 className="container-text">Text Models:</h2>
                    {textResults.length > 0 ? (
                        <>
                            {textResults.map((text_algo, index) => (
                                <div className="container-horizontal" key={`${text_algo.model_name || 'text'}-${index}`}>
                                    <h2 className="prediction-container">
                                        {text_algo.model}: {text_algo.prediction}
                                    </h2>
                                    <a className="prediction-container-a" href="https://www.geeksforgeeks.org/machine-learning-algorithms/" target="_blank" rel="noopener noreferrer">
                                        More Details
                                    </a>
                                </div>                  
                            ))}
                        </>
                    ) : (
                        <h2 className="container-text">No text results found</h2>
                    )}
                </div>
            )}
        </div>
    );
};

export default Benchmark;
