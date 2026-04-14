import React, { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, ResponsiveContainer
} from "recharts";
import "./Fileui.css";
import { useRef, useEffect } from "react";
import '../App.css'

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#A28CFF",
  "#FF6699"
];

function UploadComponent() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [isUploaded, setIsUploaded] = useState(false);
  const chatEndRef = useRef(null);
  const [alert, setAlert] = useState(null);

  const [query, setQuery] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showTable, setShowTable] = useState(false);
  const [showBar, setShowBar] = useState(false);
  const [showPie, setShowPie] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      setAlert({ type: "error", message: "Please select CSV file" });
      setTimeout(() => setAlert(null), 3000);
      return;
    }

    if (!file.name.endsWith(".csv")) {
      setAlert({ type: "error", message: "Please upload a valid CSV file" });

      // auto hide after 3 sec
      setTimeout(() => setAlert(null), 3000);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
      method: "POST",
      body: formData
    });

    const result = await res.json();
    setData(result.data);
    setIsUploaded(true);
    setChat([]);

    setAlert({ type: "success", message: "File uploaded successfully!" });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleAskAI = async () => {
    if (!query) return;

    setChat(prev => [...prev, { type: "user", text: query }]);
    setLoading(true);

    const res = await fetch(`${import.meta.env.VITE_API_URL}/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, data })
    });

    const result = await res.json();

    setChat(prev => [
      ...prev,
      {
        type: "ai",
        text: result.answer,
        insight: result.insight,
        suggestion: result.suggestion,
        labels: result.labels,
        values: result.values
      }
    ]);

    setLoading(false);
    setQuery("");
  };

  const lastAI = chat.findLast(msg => msg.type === "ai");

  const aiChartData = lastAI?.labels?.map((label, i) => ({
    name: label,
    value: lastAI.values[i]
  })) || [];

  const fullChartData = data.map(item => ({
    name: item.product || item.name || "Item",
    value: (Number(item.price) || 0) * (Number(item.quantity) || 1)
  }));
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });
  }, [chat]);

  return (

    <div className="container py-4 " >
      {alert && (
        <div className={`custom-alert ${alert.type}`}>
          {alert.message}
        </div>
      )}

      <h1 className="text-center mb-4"><i className="fa-brands fa-bots" style={{ color: "blue", marginRight: "18px" }}></i><span className="Ai">AI</span>Dashboard</h1>

      {/* Upload */}
      <div className="card p-3 mb-3 shadow-sm ">
        <input
          type="file"
          className="form-control mb-2"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button className="btn btn-info" onClick={handleUpload}>
          Upload CSV
        </button>
      </div>

      {isUploaded && (
        <div className="row">

          {/*ai-chat*/}
          <div className="col-md-5 ai-chart">
            <div className="card shadow-sm chat-box">

              <div className="chat-messages">
                {chat.map((msg, i) => (
                  <div key={i} className={`bubble ${msg.type}`}>
                    <p>{msg.text}</p>
                    {msg.insight && <small>{msg.insight}</small>}
                    {msg.suggestion && (
                      <small> <br/><i class="fa-regular fa-lightbulb idea"></i>{msg.suggestion}</small>
                    )}
                  </div>
                ))}

                {loading && (
                  <div className="bubble ai">
                    <div className="spinner-border text-primary"></div>
                  </div>
                )}
                <div ref={chatEndRef}></div>
              </div>

              <div className="p-2 border-top d-flex">
                <input
                  className="form-control"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask anything..."
                />
                <button
                  className="btn btn-primary"
                  onClick={handleAskAI}
                >
                  <i class="fa-solid fa-paper-plane"></i>
                  Send
                </button>
              </div>

            </div>
          </div>

          {/*right side*/}
          <div className="col-md-7 right-panel">

            {/*AI-chart*/}
            <div className="card p-3 mb-3 shadow-sm text-center">
              <h5><span className="Ai"> AI</span> Chart</h5>

              <div>
                <div style={{ width: `${aiChartData.length * 80}px`, height: "400px" }}>

                  <BarChart
                    width={aiChartData.length * 80}
                    height={400}
                    data={aiChartData}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#121212" />
                  </BarChart>

                </div>
              </div>
            </div>
            {/*btn*/}
            <div className="d-flex justify-content-center gap-2 mb-3">
              <button className="btn btn-info" onClick={() => setShowBar(!showBar)}>
                <span className="show">Show</span>Bar Chart
              </button>
              <button className="btn btn-info" onClick={() => setShowPie(!showPie)}>
                 <span className="show">Show</span>Pie Chart
              </button>
              <button className="btn btn-info" onClick={() => setShowTable(!showTable)}>
                 <span className="show">Show</span>Table
              </button>
            </div>

            {/*bar*/}
            {showBar && (
              <div className="card p-3 mb-3 shadow-sm text-center">
                <h5><i class="fa-solid fa-chart-simple" style={{ color: "blue" }}></i>Bar chart</h5>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={fullChartData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />

                    <Bar dataKey="value">
                      {fullChartData.map((entry, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>

                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/*pie*/}
            {showPie && (
              <div className="card p-3 mb-3 shadow-sm text-center">
                <h5><i class="fa-solid fa-chart-pie" style={{ color: "blue" }}></i>Pie Chart</h5>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={fullChartData} dataKey="value" nameKey="name">
                      {fullChartData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

          </div>
        </div>
      )}

      {/* TABLE */}
      {showTable && (
        <div className="card p-3 mt-4 shadow-sm">
          <h5 className="table"><i class="fa-solid fa-table" style={{ color: "blue" }}></i>Table</h5>
          <table className="table table-striped text-center">
            <thead>
              <tr>
                {Object.keys(data[0]).map((k) => (
                  <th key={k}>{k}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i}>
                  {Object.values(row).map((v, j) => (
                    <td key={j}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}

export default UploadComponent;