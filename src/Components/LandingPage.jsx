import React from "react";
import { useState } from "react";
import "./LandingPage.css";
import bgvideo from "../assets/bv.mp4.mp4"
import { useNavigate } from "react-router-dom";



const LandingPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <video autoPlay loop muted playsInline className="video-bg">
        <source src={bgvideo} type="video/mp4" />
      </video>

      <div className="overlay"></div>

      {/*nav*/}
      <nav className="navbar navbar-expand-lg navbar-dark custom-nav">
        <div className="container">

          <a className="navbar-brand logo" href="#">
            Analytica <span className="ai">AI</span>
          </a>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-center">

              

             
            </ul>
          </div>
        </div>
      </nav>

      {/*hero*/}
      <div className="hero-section">
        <h1 className="hero-title">AI Data Analyst</h1>

        <p className="hero-text">
          Upload your data and let AI analyze, visualize, and generate insights instantly.
          Transform raw data into powerful decisions with smart automation.
        </p>

        <button className="mbtn" onClick={() => navigate("/dashabord")}>
          Try Now
        </button>
      </div>

      {/*modal*/}
      <div className="modal fade" id="authModal" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content custom-modal">

            <div className="modal-header border-0">
              <h5 className="modal-title text-white">
                {isLogin ? "Login" : "Register"}
              </h5>
              <button className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>

            <div className="modal-body">

              {!isLogin && (
                <input type="text" placeholder="Full Name" className="form-control mb-3 input-modern" />
              )}

              <input type="email" placeholder="Email" className="form-control mb-3 input-modern" />
              <input type="password" placeholder="Password" className="form-control mb-3 input-modern" />

              <button className="btn modern-btn w-100">
                {isLogin ? "Login" : "Register"}
              </button>

              <p className="text-center mt-3 text-light">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <span
                  className="switch-link"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? " Register" : " Login"}
                </span>
              </p>

            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default LandingPage;