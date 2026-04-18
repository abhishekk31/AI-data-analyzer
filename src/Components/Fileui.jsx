import React, { useState, useRef, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, ResponsiveContainer,
  LineChart, Line
} from "recharts";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Fileui.css";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28CFF", "#FF6699"];

function UploadComponent() {

  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [isUploaded, setIsUploaded] = useState(false);
  const [alert, setAlert] = useState(null);

  const [query, setQuery] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showTable, setShowTable] = useState(false);
  const [showBar, setShowBar] = useState(false);
  const [showPie, setShowPie] = useState(false);

  const chatBoxRef = useRef(null);
  const pieRef = useRef(null);


  const handleUpload = async () => {
    if (!file) {
      setAlert({ type: "custom-alert error", message: "Please select CSV file" });
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

    setAlert({ type: "custom-alert success", message: "File uploaded successfully!" });
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
        values: result.values,
        chartType: result.chartType
      }
    ]);

    setLoading(false);
    setQuery("");
  };


  const lastAI = chat.findLast(msg => msg.type === "ai");

  const aiChartData = (lastAI?.labels || []).map((label, i) => ({
    name: label,
    value: Number(lastAI?.values?.[i]) || 0
  }));


  const getNumericColumns = (row) =>
    Object.keys(row).filter(key => !isNaN(row[key]) && row[key] !== "");

  const fullChartData = data.map((item, index) => {
    const keys = Object.keys(item);
    const labelKey = keys[0];
    const numericKeys = getNumericColumns(item);
    const valueKey = numericKeys[0];

    return {
      name: item[labelKey] || `Item ${index + 1}`,
      value: Number(item[valueKey]) || 0
    };
  });


  const displayData = aiChartData.length > 0 ? aiChartData : fullChartData;

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chat]);

  return (
    <div className="container py-4">

      {/* ALERT */}
      {alert && (
        <div className={`custom-alert ${alert.type}`}>
          {alert.message}
        </div>
      )}
      {/* TITLE */}
      <h1 className="text-center mb-4">
        <i className="fa-solid fa-robot me-2" style={{ color: "blue" }}></i>
        <span style={{ color: "blue" }}>AI</span>Dashboard
      </h1>

      {/* UPLOAD */}
      <div className="card p-3 mb-3 shadow-sm">
        <input
          type="file"
          className="form-control mb-2"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button className="btn btn-info" onClick={handleUpload}>
          <i className="fa-solid fa-upload me-1"></i>
          Upload CSV
        </button>
      </div>

      {isUploaded && (
        <div className="row">

          {/* CHAT */}

          <div className="col-md-5">

            <div className="card shadow-sm">

              <div ref={chatBoxRef} className="p-2" style={{ height: "450px", overflowY: "auto" }}>
                {chat.map((msg, i) => (
                  <div key={i} className="mb-2">
                    <strong>{msg.type === "user" ? "You" : "AI"}:</strong>
                    <p>{msg.text}</p>
                    {msg.insight && <small>{msg.insight}</small>}
                    {msg.suggestion && (
                      <small className="text-success">
                        <br />
                        <i className="fa-regular fa-lightbulb me-1"></i>
                        {msg.suggestion}
                      </small>
                    )}
                  </div>
                ))}
                {loading && <p>Loading...</p>}

              </div>

              <div className="p-2 border-top d-flex">
                <input
                  className="form-control"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask anything..."
                />
                <button className="btn btn-primary ms-2" onClick={handleAskAI}>
                  <i className="fa-solid fa-paper-plane"></i>
                </button>
              </div>

            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="col-md-7">

            {/* AI CHART */}

            <div className="card p-3 mb-3 shadow-sm text-center">
              <h5><i className="fa-solid fa-chart-simple me-1" style={{ color: "blue" }}></i>AI Chart</h5>

              {displayData.length === 0 && <p>No chart data</p>}

              {displayData.length > 0 && (
                <div style={{ overflowX: "auto" }}>
                  <div style={{ width: Math.max(displayData.length * 120, 400) }}>

                    {/* BAR */}
                    {(!lastAI?.chartType || lastAI.chartType === "bar") && (
                      <BarChart width={Math.max(displayData.length * 120, 400)} height={300} data={displayData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="name"
                          interval={0}
                          angle={-30}
                          textAnchor="end"
                        />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#007bff" />
                      </BarChart>
                    )}

                    {/* PIE */}
                    {lastAI?.chartType === "pie" && (
                      <PieChart width={400} height={300}>
                        <Pie data={displayData} dataKey="value">
                          {displayData.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    )}

                    {/* LINE */}
                    {lastAI?.chartType === "line" && (
                      <LineChart width={Math.max(displayData.length * 120, 400)} height={300} data={displayData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" interval={0} angle={-30} textAnchor="end" />
                        <YAxis />
                        <Tooltip />
                        <Line dataKey="value" stroke="#007bff" strokeWidth={3} />
                      </LineChart>
                    )}

                  </div>
                </div>
              )}
            </div>

            {/* BUTTONS */}
            <div className="d-flex gap-2 mb-3">
              <button className="btn btn-info" onClick={() => setShowBar(!showBar)}>
                <i className="fa-solid fa-chart-simple me-1"></i> Show Bar
              </button>
              <button
                className="btn btn-info"
                onClick={() => {
                  setShowPie(true);

                  setTimeout(() => {
                    pieRef.current?.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }}
              ><i class="fa-solid fa-chart-pie me-1"></i>Show Pie</button>
              <button className="btn btn-info" onClick={() => setShowTable(!showTable)}>
                <i className="fa-solid fa-table me-1" ></i>Show Table
              </button>
            </div>

            {/* DYNAMIC BAR */}
            {showBar && (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={displayData}>
                  <XAxis
                    dataKey="name"
                    interval={Math.ceil(displayData.length / 10)} // 🔥 show only some labels
                    angle={-30}
                    textAnchor="end"
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis />
                  <Tooltip />

                  <Bar dataKey="value">
                    {displayData.map((_, i) => (
                      <Cell
                        key={i}
                        fill={
                          aiChartData.length > 0
                            ? "#007bff"
                            : COLORS[i % COLORS.length]
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}

            {/* DYNAMIC PIE */}
            {showPie && (
             
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={displayData} dataKey="value">
                    {displayData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
           
          </div>
        </div>
      )}

      {/* TABLE */}
      {showTable && data.length > 0 && (
        <div className="card p-3 mt-3">
          <h5><i className="fa-solid fa-table me-1"></i>Table</h5>
          <table className="table table-striped text-center">
            <thead>
              <tr>{Object.keys(data[0]).map(k => <th key={k}>{k}</th>)}</tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i}>
                  {Object.values(row).map((v, j) => <td key={j}>{v}</td>)}
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