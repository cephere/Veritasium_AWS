import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import axios from "axios";
import "./Benchmark.css";
import Loading from 'react-loading';

const Benchmark = () => {
    const [img_model_results, set_img_model_results] = useState([]); // Model results for image-based prediction
    const [img_pred, set_img_pred] = useState([]); // Final prediction for image-based prediction

    const [showResults_image, setShowResults_image] = useState(false); // Toggle for image model results
    const [showPred_image, setShowPred_image] = useState(false); // Toggle for image prediction

    const [text_model_results, set_text_model_results] = useState([]); // Model results for text-based prediction
    const [text_pred, set_text_pred] = useState([]); // Final prediction for text-based prediction

    const [showResults_text, setShowResults_text] = useState(false); // Toggle for text model results
    const [showPred_text, setShowPred_text] = useState(false); // Toggle for text prediction
    const [showEval_image, setEval_image] = useState(true); // Toggle for text prediction
    const [showEval_text, setEval_text] = useState(true); // Toggle for text prediction

    const [article_image, setArticle_image] = useState(""); // Stores user input used for prediction
    const [article_text, setArticle_text] = useState(""); // Stores user input used for prediction
    
    const username = sessionStorage.getItem('username'); // Gets username of current user

    const [user_id_f_image, setUser_id_f_image] = useState(""); // Stores userid for db
    const [news_type_f_image, setNews_type_f_image] = useState(""); // Stores news type for db
    const [news_link_f_image, setNews_link_f_image] = useState(""); // Store news link for db
    const [news_prediction_f_image, setNews_prediction_f_image] = useState(""); // Stores final prediction for db

    const [user_id_f_text, setUser_id_f_text] = useState(""); // Stores used id for db
    const [news_type_f_text, setNews_type_f_text] = useState(""); // Stores news tyoe for db
    const [news_link_f_text, setNews_link_f_text] = useState(""); // Stores news link for db
    const [news_prediction_f_text, setNews_prediction_f_text] = useState(""); // Stores final prediction for db

    const [user_eval_image, setUser_eval_image] = useState(""); // Stores user evaluation for db
    const [user_eval_text, setUser_eval_text] = useState(""); // Stores user evaluation for db

    const [isLoadingImage, setIsLoadingImage] = useState(false); // Loading screen for image
    const [isLoadingText, setIsLoadingText] = useState(false); // Loading screen for text

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

            setUser_id_f_image(response.data.used_id || username);
            setNews_type_f_image(response.data.news_type || "N/A");
            setNews_link_f_image(response.data.news_link || article_image);
            setNews_prediction_f_image(response.data.final_pred || "N/A");
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
                {   
                    user_id: username, 
                    news_link: article_text 
                },
                { headers: { "Content-Type": "application/json" } }
            );
            set_text_model_results(response.data.results || []);
            set_text_pred(response.data.final_prediction);

            setUser_id_f_text(response.data.used_id || username);
            setNews_type_f_text(response.data.news_type || "N/A");
            setNews_link_f_text(response.data.news_link || article_image);
            setNews_prediction_f_text(response.data.final_prediction || "N/A");
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

    const handleScrapeText = async () => {
        if (!article_text || !article_text.startsWith("http")) {
            alert("Please enter a valid URL!");
            return null;
        }
    
        try {
            const response = await axios.post(
                "https://6ui0ain2tf.execute-api.ap-southeast-1.amazonaws.com/api",
                { 
                    url: article_text,
                    username: username 
                },
                { headers: { "Content-Type": "application/json" } }
            );
    
            console.log("Response from Lambda:", response.data);
    
            if (response.data.status === "success" && response.data.article_text) {
                set_text_model_results(response.data.article_text);
                console.log("Stored image URL:", response.data.article_text);  
                return response.data;
            } else {
                console.warn("Text scraping succeeded but no text URL found.");
                return null;
            }
        } catch (error) {
            console.error("Error fetching text data", error);
            alert("Failed to fetch text. Check the console for details.");
            return null;
        }
    };

    const sendDbImage = async (x) => {
        try {
            const response = await axios.post(
                "https://bhelhdyj88.execute-api.ap-southeast-1.amazonaws.com/api/record",
                { 
                    user_id: Number(user_id_f_image),
                    news_type: String(news_type_f_image), 
                    news_link: String(news_link_f_image),
                    news_prediction: String(news_prediction_f_image),
                    user_evaluation: String(x)
                },
                { headers: { "Content-Type": "application/json" } }
            );
            console.log("Response from Lambda:", response.data);
        } catch (error) {
            console.error("Error sending data to the database", error);
        }
    };

    const sendDbText = async (x) => {
        try {
            const response = await axios.post(
                "https://bhelhdyj88.execute-api.ap-southeast-1.amazonaws.com/api/record-1",
                { 
                    user_id: Number(user_id_f_text),
                    news_type: String(news_type_f_text), 
                    news_link: String(news_link_f_text),
                    news_prediction: String(news_prediction_f_text),
                    user_evaluation: String(x)
                },
                { headers: { "Content-Type": "application/json" } }
            );
            console.log("Response from Lambda:", response.data);
        } catch (error) {
            console.error("Error sending data to the database", error);
        }
    };
    
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

    const image_close = async (event) => {
        event.preventDefault();
        try {
            setShowResults_image(false);
            setShowPred_image(false);

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
    };

    const text_close = async (event) => {
        event.preventDefault();
        try {
                setShowResults_text(false);
                setShowPred_text(false);
        } catch (error) {
            console.error("Error fetching text prediction data", error);
        }
    };

    const handlePredict_image = async (event) => {
        event.preventDefault();
        setShowResults_image(false);
        setShowPred_image(false);
        setIsLoadingImage(true); 
        await handleScrapeImage();
        try {
            const scrapeResult = await handleScrapeImage();
            console.log("Scrape Result:", scrapeResult);
    
            if (scrapeResult && scrapeResult.status === "success") {
                await fetchapi_image(scrapeResult.image_url);  // Pass image URL to fetchapi_image
                setEval_image(true); 
            } else {
                console.warn("Image scraping failed, fetchapi_image will not run.");
            }
        } catch (error) {
            console.error("Error in processing:", error);
        }
        setIsLoadingImage(false);
    };
    
    const handlePredict_text = async (event) => {
        event.preventDefault();
        setShowResults_text(false);
        setShowPred_text(false);
        setIsLoadingText(true);
        try {
            const scrapeResult = await handleScrapeText();
            console.log("Scrape Result:", scrapeResult);

            if (scrapeResult && scrapeResult.status === "success"){
                await fetchapi_text(scrapeResult.article_text); 
                setEval_text(true); 
            }else{
                alert("Text scraping failed.", error)
                console.warn("Text scraping failed, fetchapi_text will not run.");
            }
        } catch (error) {
            alert("Error in processing:", error);
        }
        setIsLoadingText(false)
    };

    const handleLogout = () => {
        sessionStorage.removeItem("username");
        window.location.href = "/";
    };

    const handleUserEvaluationImage = (evalValue) => {
        setUser_eval_image(evalValue);
        console.log({
            "used_id" : user_id_f_image,
            "news_type" : news_type_f_image,
            "news_link" : news_link_f_image,
            "news_prediction" : news_prediction_f_image,
            "user_evaluation" : evalValue
        });
        sendDbImage(evalValue); 
        alert("Thank you for your evaluation!");
        setEval_image(false); 
    };

    const handleUserEvaluationText = (evalValue) => {
        setUser_eval_text(evalValue);
        console.log({
            "used_id" : user_id_f_text,
            "news_type" : news_type_f_text,
            "news_link" : news_link_f_text,
            "news_prediction" : news_prediction_f_text,
            "user_evaluation" : evalValue
        });
        sendDbText(evalValue); 
        alert("Thank you for your evaluation!");
        setEval_text(false); 
    };
    
    return (
        <div className="container">
            <div className="topnav">
                <div className="nav-left">
                    <NavLink to="/"><h2>VERITASIUM: FAKE NEWS DETECTION</h2></NavLink>
                </div>
                <div className="nav-right">
                    <h3>Hello, {username}!</h3>
                    <img className="icon" src="/icon.png" alt="User Icon" />
                    <h3>|</h3>
                    <NavLink to="/" onClick={handleLogout}>Logout</NavLink>
                </div>
            </div>
            
            <div className="box">
                <form onSubmit={handlePredict_image}>    
                    <h2 className="box-text-header">Fake News Prediction (Image-Content)</h2>
                    <input
                        type="text"
                        className="text-box"
                        value={article_image}
                        onChange={(e) => setArticle_image(e.target.value)}
                        placeholder="Enter your news link (url) here..."
                    />
                    <div style={{ padding: "15px" }}>
                        <button className="butt" style={{ fontSize: '20px' }} type="submit">
                            PREDICT (IMAGE)
                        </button>
                    </div>
                </form>

                <form onSubmit={handlePredict_text}>    
                    <h2 className="box-text-header">Fake News Prediction (Text-Content)</h2>
                    <input
                        type="text"
                        className="text-box"
                        value={article_text}
                        onChange={(e) => setArticle_text(e.target.value)}
                        placeholder="Enter your news link (url) here..."
                    />
                    <div style={{ padding: "15px" }}>
                        <button className="butt" style={{ fontSize: '20px' }} type="submit">
                            PREDICT (TEXT)
                        </button>
                    </div>
                </form>

            {isLoadingImage && (
                <div className="loading-container">
                    <Loading type="spin" color="#000" height={50} width={50} />
                    <p>Processing Image-Based Prediction...</p>
                </div>
            )}

            {isLoadingText && (
                <div className="loading-container">
                    <Loading type="spin" color="#000" height={50} width={50} />
                    <p>Processing Text-Based Prediction...</p>
                </div>
            )}
            </div>  

            {showPred_image && (
                <div className="container-vertical">
                    <h2 className="container-text">Image-Based Prediction Results:</h2>
                    <div className='container-horizontal'>
                        <h2 className="prediction-container">Final Prediction: {img_pred || "N/A"}</h2>
                    </div>

                    {showEval_image && (
                        <div className='container-horizontal'>
                            <h2 className="prediction-container">User Evaluation</h2>
                            <button className='butt2' onClick={() => handleUserEvaluationImage("REAL")}>REAL</button>
                            <button className='butt2' onClick={() => handleUserEvaluationImage("FAKE")}>FAKE</button>
                        </div>
                    )}
                    <div className='container-vertical-2'>
                        <button className='butt' onClick={image_more}>More Info</button>
                        <button className='butt' onClick={image_close}>Close</button>
                    </div>
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
                            <button className='butt2' onClick={() => handleUserEvaluationText("REAL")}>REAL</button>
                            <button className='butt2' onClick={() => handleUserEvaluationText("FAKE")}>FAKE</button>
                        </div>
                    )}
                    <div className='container-vertical-2'>
                        <button className='butt' onClick={text_more}>More Info</button>
                        <button className='butt' onClick={text_close}>Close</button>
                    </div>
                </div>
            )}


            {/* Text-Based Prediction Results (Always Appears Below Image Results) */}
            {showResults_text && (
                <div className="container-vertical">
                    <h2 className="container-text">Text Models:</h2>
                    {text_model_results.length > 0 ? (
                        <>
                            {text_model_results.map((text_algo, index) => (
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
