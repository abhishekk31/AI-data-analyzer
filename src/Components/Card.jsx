import React from 'react'
import img1 from '../assets/ai-use.jpg'
import img2 from '../assets/ai-bar-chart.jpg'
import img3 from '../assets/ai-chart.jpg'
import img4 from '../assets/pie-chart.jpg'
import './Card.css'

export default function Card() {
  return (
    <div className="container my-5">
      <div className="row g-4 justify-content-center">

        {/* CARD 1 */}
        <div className="col-12 col-sm-6">
          <div className="card modern-card h-100 text-center">
            <img src={img1} className="card-img-top card-img" alt="upload" />
            <div className="card-body">
              <h5 className="card-title">AI Chart Assistant</h5>
              <p className="card-text">
                Ask questions about your uploaded data and receive instant AI-powered insights. Generate charts, explore trends, and understand patterns effortlessly using intelligent analysis.
              </p>
            </div>
          </div>
        </div>

        {/* CARD 2 */}
        <div className="col-12 col-sm-6">
          <div className="card modern-card h-100 text-center">
            <img src={img2} className="card-img-top card-img" alt="ai" />
            <div className="card-body">
              <h5 className="card-title">Bar Charts</h5>
              <p className="card-text">
               Turn your data into simple bar charts instantly. Compare categories, spot differences, and understand your data at a glance.
              </p>
            </div>
          </div>
        </div>

        {/* CARD 3 */}
        <div className="col-12 col-sm-6">
          <div className="card modern-card h-100 text-center">
            <img src={img3} className="card-img-top card-img" alt="chart" />
            <div className="card-body">
              <h5 className="card-title">AI Dynamic Bar Charts</h5>
              <p className="card-text">
                Just ask a question and the bar chart changes automatically. Compare values, explore trends, and get answers visually without manual work.
              </p>
            </div>
          </div>
        </div>

        {/* CARD 4 */}
        <div className="col-12 col-sm-6">
          <div className="card modern-card h-100 text-center">
            <img src={img4} className="card-img-top card-img" alt="insight" />
            <div className="card-body">
              <h5 className="card-title">Smart Pie Visualization</h5>
              <p className="card-text">
                Use AI to generate pie charts that highlight proportions and patterns, helping you make faster and smarter decisions.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}