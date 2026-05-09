import React, { useState, useRef, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, ResponsiveContainer,
  LineChart, Line
} from "recharts";

/* ── Gemini brand tokens ─────────────────────────────── */
const G_BLUE   = "#4285F4";
const G_PURPLE = "#9B72CB";
const G_RED    = "#D96570";
const G_GREEN  = "#34A853";
const COLORS   = [G_BLUE, G_PURPLE, G_RED, G_GREEN, "#FBBC04", "#EA8600"];

/* ── Inline global styles (injected once) ────────────── */
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&family=Google+Sans+Mono&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: 'Google Sans', 'Segoe UI', sans-serif;
  background: #f8f9fc;
  min-height: 100vh;
  padding-bottom: 120px;
}

/* Mesh gradient corners */
body::before, body::after {
  content: '';
  position: fixed;
  width: 480px; height: 480px;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.18;
  pointer-events: none;
  z-index: 0;
}
body::before {
  top: -160px; left: -160px;
  background: radial-gradient(circle, ${G_BLUE} 0%, ${G_PURPLE} 60%, transparent 100%);
}
body::after {
  bottom: -160px; right: -160px;
  background: radial-gradient(circle, ${G_RED} 0%, ${G_PURPLE} 60%, transparent 100%);
}

/* ── Animated shimmer heading ── */
@keyframes shimmer {
  0%   { background-position: -400% center; }
  100% { background-position:  400% center; }
}
.gemini-heading {
  font-size: clamp(1.6rem, 4vw, 2.4rem);
  font-weight: 700;
  letter-spacing: -0.5px;
  background: linear-gradient(90deg, ${G_BLUE} 0%, ${G_PURPLE} 30%, ${G_RED} 50%, ${G_PURPLE} 70%, ${G_BLUE} 100%);
  background-size: 400% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmer 4s linear infinite;
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

/* ── Toast ── */
@keyframes toastIn  { from { transform: translateY(-80px) translateX(-50%); opacity:0; } to { transform: translateY(0) translateX(-50%); opacity:1; } }
@keyframes toastOut { from { opacity:1; } to { opacity:0; transform: translateY(-40px) translateX(-50%); } }

.toast {
  position: fixed;
  top: 20px; left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  padding: 12px 24px;
  border-radius: 100px;
  font-size: 14px;
  font-weight: 500;
  display: flex; align-items: center; gap: 8px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.12);
  animation: toastIn 0.35s cubic-bezier(.34,1.56,.64,1) forwards;
  white-space: nowrap;
  backdrop-filter: blur(16px);
}
.toast.success { background: rgba(52,168,83,0.92); color: #fff; }
.toast.error   { background: rgba(217,101,112,0.92); color: #fff; }
.toast.exit    { animation: toastOut 0.3s ease forwards; }

/* ── Glass card ── */
.glass-card {
  background: rgba(255,255,255,0.75);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.6);
  border-radius: 20px;
  box-shadow: 0 4px 32px rgba(66,133,244,0.06), 0 1px 4px rgba(0,0,0,0.04);
  position: relative;
  z-index: 1;
}

/* ── Multi-color spinner ── */
@keyframes spin { to { transform: rotate(360deg); } }
.gem-spinner {
  width: 40px; height: 40px;
  border-radius: 50%;
  border: 3.5px solid transparent;
  border-top-color: ${G_BLUE};
  border-right-color: ${G_PURPLE};
  border-bottom-color: ${G_RED};
  animation: spin 0.8s linear infinite;
  display: inline-block;
}

/* ── Typing dots ── */
@keyframes dotBounce {
  0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
  40%           { transform: translateY(-6px); opacity: 1; }
}
.typing-dot {
  display: inline-block;
  width: 8px; height: 8px;
  border-radius: 50%;
  animation: dotBounce 1.2s infinite;
}

/* ── Search expand ── */
.search-input {
  transition: all 0.3s cubic-bezier(.34,1.56,.64,1);
  width: 220px;
  border: 1px solid rgba(66,133,244,0.25);
  border-radius: 100px;
  padding: 9px 16px 9px 40px;
  font-family: inherit;
  font-size: 14px;
  background: rgba(255,255,255,0.8);
  backdrop-filter: blur(8px);
  outline: none;
  color: #202124;
}
.search-input:focus {
  width: 320px;
  border-color: ${G_BLUE};
  box-shadow: 0 0 0 3px rgba(66,133,244,0.15);
}

/* ── Modal ── */
@keyframes modalIn {
  from { transform: scale(0.9); opacity: 0; filter: blur(6px); }
  to   { transform: scale(1);   opacity: 1; filter: blur(0px); }
}
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(32,33,36,0.4);
  backdrop-filter: blur(4px);
  z-index: 500;
  display: flex; align-items: center; justify-content: center;
  padding: 16px;
}
.modal-box {
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(24px);
  border-radius: 24px;
  border: 1px solid rgba(255,255,255,0.8);
  box-shadow: 0 24px 80px rgba(0,0,0,0.16);
  animation: modalIn 0.3s cubic-bezier(.34,1.56,.64,1) forwards;
  width: 100%; max-width: 540px;
  max-height: 80vh; overflow-y: auto;
  padding: 28px;
}

/* ── Gemini button ── */
.gem-btn {
  padding: 10px 22px;
  border-radius: 100px;
  border: 1.5px solid transparent;
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex; align-items: center; gap: 7px;
  white-space: nowrap;
}
.gem-btn-primary {
  background: linear-gradient(135deg, ${G_BLUE}, ${G_PURPLE});
  color: #fff;
  box-shadow: 0 2px 16px rgba(66,133,244,0.3);
}
.gem-btn-primary:hover { opacity: 0.9; transform: translateY(-1px); box-shadow: 0 4px 24px rgba(66,133,244,0.4); }
.gem-btn-outline {
  background: rgba(255,255,255,0.8);
  border-color: rgba(66,133,244,0.3);
  color: ${G_BLUE};
  backdrop-filter: blur(8px);
}
.gem-btn-outline:hover { border-color: ${G_BLUE}; background: rgba(66,133,244,0.06); transform: translateY(-1px); }
.gem-btn:active { transform: scale(0.97); }

/* ── Chat bubbles ── */
.chat-bubble-user {
  background: linear-gradient(135deg, ${G_BLUE}, ${G_PURPLE});
  color: #fff;
  border-radius: 18px 18px 4px 18px;
  padding: 10px 15px;
  font-size: 14px;
  max-width: 80%;
  align-self: flex-end;
  line-height: 1.5;
}
.chat-bubble-ai {
  background: rgba(255,255,255,0.9);
  border: 1px solid rgba(66,133,244,0.15);
  border-radius: 18px 18px 18px 4px;
  padding: 10px 15px;
  font-size: 14px;
  max-width: 85%;
  align-self: flex-start;
  line-height: 1.5;
  color: #202124;
}

/* ── File input ── */
.file-drop {
  border: 2px dashed rgba(66,133,244,0.35);
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.25s ease;
  background: rgba(66,133,244,0.03);
}
.file-drop:hover { border-color: ${G_BLUE}; background: rgba(66,133,244,0.07); }

/* ── Table ── */
.gem-table-wrap {
  overflow-x: auto;
  max-height: 420px;
  overflow-y: auto;
  border-radius: 16px;
  border: 1px solid rgba(66,133,244,0.12);
}
.gem-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13.5px;
  min-width: 500px;
}
.gem-table thead th {
  position: sticky; top: 0;
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(8px);
  padding: 11px 16px;
  text-align: left;
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #5f6368;
  border-bottom: 1px solid rgba(66,133,244,0.15);
  white-space: nowrap;
}
.gem-table thead th:first-child {
  position: sticky; left: 0; z-index: 2;
  background: rgba(248,249,252,0.97);
}
.gem-table tbody td {
  padding: 10px 16px;
  border-bottom: 1px solid rgba(0,0,0,0.04);
  color: #202124;
  white-space: nowrap;
}
.gem-table tbody td:first-child {
  position: sticky; left: 0;
  background: rgba(248,249,252,0.97);
  font-weight: 500;
  color: ${G_BLUE};
  border-right: 1px solid rgba(66,133,244,0.1);
}
.gem-table tbody tr:hover td { background: rgba(66,133,244,0.04); }

/* ── Chat fixed panel ── */
.chat-panel {
  position: fixed;
  bottom: 24px; right: 24px;
  z-index: 50;
  width: min(380px, calc(100vw - 32px));
}
.chat-messages {
  max-height: min(360px, 45vh);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px;
}
.chat-messages::-webkit-scrollbar { width: 4px; }
.chat-messages::-webkit-scrollbar-thumb { background: rgba(66,133,244,0.25); border-radius: 4px; }

/* ── Responsive tweaks ── */
@media (max-width: 640px) {
  .search-input { width: 100%; }
  .search-input:focus { width: 100%; }
  .chat-panel { bottom: 0; right: 0; width: 100%; border-radius: 20px 20px 0 0; }
  .gem-btn { padding: 9px 16px; font-size: 13px; }
}

/* ── Chart toggle ── */
.chart-toggle {
  display: flex; gap: 6px;
  background: rgba(66,133,244,0.06);
  border-radius: 100px;
  padding: 4px;
}
.chart-toggle button {
  padding: 6px 14px;
  border-radius: 100px;
  border: none;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  background: transparent;
  color: #5f6368;
  font-family: inherit;
}
.chart-toggle button.active {
  background: #fff;
  color: ${G_BLUE};
  box-shadow: 0 1px 8px rgba(0,0,0,0.1);
}

/* Chat fab */
.chat-fab {
  width: 52px; height: 52px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  font-size: 22px;
  background: linear-gradient(135deg, ${G_BLUE}, ${G_PURPLE});
  box-shadow: 0 4px 20px rgba(66,133,244,0.4);
  transition: all 0.25s;
  margin-left: auto;
}
.chat-fab:hover { transform: scale(1.08); }
`;

/* ── Toast Component ─────────────────────────────────── */
function Toast({ message, type, onDone }) {
  const [exit, setExit] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setExit(true), 2400);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    if (exit) { const t = setTimeout(onDone, 320); return () => clearTimeout(t); }
  }, [exit, onDone]);
  return (
    <div className={`toast ${type} ${exit ? "exit" : ""}`}>
      {type === "success" ? "✓" : "✕"} {message}
    </div>
  );
}

/* ── Spinner ─────────────────────────────────────────── */
function Spinner() {
  return <span className="gem-spinner" />;
}

/* ── Typing dots ─────────────────────────────────────── */
function TypingDots() {
  const colors = [G_BLUE, G_RED, G_PURPLE, G_GREEN];
  return (
    <div style={{ display: "flex", gap: 5, padding: "4px 0", alignItems: "center" }}>
      {colors.map((c, i) => (
        <span key={i} className="typing-dot" style={{ background: c, animationDelay: `${i * 0.15}s` }} />
      ))}
    </div>
  );
}

/* ── Main Component ──────────────────────────────────── */
function UploadComponent() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [isUploaded, setIsUploaded] = useState(false);
  const [toast, setToast] = useState(null);

  const [query, setQuery] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const [showTable, setShowTable] = useState(false);
  const [showBar, setShowBar] = useState(false);
  const [showPie, setShowPie] = useState(false);
  const [tableSearch, setTableSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [activeChartTab, setActiveChartTab] = useState("bar");

  const chatBoxRef = useRef(null);
  const pieRef = useRef(null);
  const fileInputRef = useRef(null);

  /* ── unchanged logic ── */
  const handleUpload = async () => {
    if (!file) {
      setToast({ type: "error", message: "Please select a CSV file" });
      return;
    }
    setUploading(true);
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
    setUploading(false);
    setToast({ type: "success", message: "File uploaded successfully!" });
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
    setChat(prev => [...prev, {
      type: "ai",
      text: result.answer,
      insight: result.insight,
      suggestion: result.suggestion,
      labels: result.labels,
      values: result.values,
      chartType: result.chartType
    }]);
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
    return { name: item[labelKey] || `Item ${index + 1}`, value: Number(item[valueKey]) || 0 };
  });
  const displayData = aiChartData.length > 0 ? aiChartData : fullChartData;

  const chartType = lastAI?.chartType || activeChartTab;
  const filteredData = data.filter(row =>
    Object.values(row).some(v => String(v).toLowerCase().includes(tableSearch.toLowerCase()))
  );

  useEffect(() => {
    if (chatBoxRef.current) chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
  }, [chat]);

  const ChartContent = ({ type, data: d }) => {
    const w = Math.max(d.length * 100, 400);
    if (type === "pie") return (
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie data={d} dataKey="value" outerRadius={100}>
            {d.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
        </PieChart>
      </ResponsiveContainer>
    );
    if (type === "line") return (
      <div style={{ overflowX: "auto" }}>
        <LineChart width={w} height={260} data={d}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
          <XAxis dataKey="name" interval={0} angle={-30} textAnchor="end" tick={{ fontSize: 11 }} height={60} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
          <Line dataKey="value" stroke={G_BLUE} strokeWidth={3} dot={{ fill: G_PURPLE, r: 4 }} />
        </LineChart>
      </div>
    );
    return (
      <div style={{ overflowX: "auto" }}>
        <BarChart width={w} height={260} data={d}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
          <XAxis dataKey="name" interval={0} angle={-30} textAnchor="end" tick={{ fontSize: 11 }} height={60} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
            {d.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Bar>
        </BarChart>
      </div>
    );
  };

  return (
    <>
      <style>{GLOBAL_CSS}</style>

      {/* Toast */}
      {toast && <Toast key={Date.now()} {...toast} onDone={() => setToast(null)} />}

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto", padding: "clamp(16px, 4vw, 32px)" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <h1 className="gemini-heading" style={{ justifyContent: "center" }}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M16 4C16 4 20 12 28 16C20 20 16 28 16 28C16 28 12 20 4 16C12 12 16 4 16 4Z" fill="url(#gstar)"/>
              <defs><linearGradient id="gstar" x1="4" y1="4" x2="28" y2="28">
                <stop stopColor={G_BLUE}/><stop offset="0.5" stopColor={G_PURPLE}/><stop offset="1" stopColor={G_RED}/>
              </linearGradient></defs>
            </svg>
            AI Dashboard
          </h1>
          <p style={{ color: "#5f6368", fontSize: 15, marginTop: 8 }}>Upload a CSV and explore your data with AI</p>
        </div>

        {/* Upload Card */}
        <div className="glass-card" style={{ padding: "clamp(16px,3vw,28px)", marginBottom: 28 }}>
          <div
            className="file-drop"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])}
            />
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={G_BLUE} strokeWidth="1.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              <p style={{ color: file ? G_BLUE : "#5f6368", fontWeight: 500, fontSize: 15 }}>
                {file ? file.name : "Click to upload CSV"}
              </p>
              <p style={{ color: "#9aa0a6", fontSize: 13 }}>Supports .csv files</p>
            </div>
          </div>
          <button
            className="gem-btn gem-btn-primary"
            onClick={handleUpload}
            style={{ marginTop: 16, width: "100%", justifyContent: "center" }}
            disabled={uploading}
          >
            {uploading ? <><Spinner /> Uploading…</> : <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              Upload CSV
            </>}
          </button>
        </div>

        {isUploaded && (
          <>
            {/* Chart Card */}
            <div className="glass-card" style={{ padding: "clamp(16px,3vw,28px)", marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
                <h2 style={{ fontSize: 17, fontWeight: 600, color: "#202124", display: "flex", alignItems: "center", gap: 8 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill={G_BLUE}><rect x="3" y="12" width="4" height="9"/><rect x="10" y="7" width="4" height="14"/><rect x="17" y="3" width="4" height="18"/></svg>
                  AI Chart
                </h2>
                <div className="chart-toggle">
                  {["bar","line","pie"].map(t => (
                    <button key={t} className={activeChartTab === t ? "active" : ""} onClick={() => setActiveChartTab(t)}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              {displayData.length === 0
                ? <p style={{ textAlign: "center", color: "#9aa0a6", padding: "40px 0" }}>Ask AI a question to generate a chart</p>
                : <ChartContent type={chartType} data={displayData} />
              }
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 24 }}>
              <button className="gem-btn gem-btn-outline" onClick={() => setShowBar(!showBar)}>
                📊 {showBar ? "Hide" : "Show"} Bar Chart
              </button>
              <button className="gem-btn gem-btn-outline" onClick={() => { setShowPie(!showPie); setTimeout(() => pieRef.current?.scrollIntoView({ behavior: "smooth" }), 100); }}>
                🥧 {showPie ? "Hide" : "Show"} Pie Chart
              </button>
              <button className="gem-btn gem-btn-outline" onClick={() => setShowTable(!showTable)}>
                📋 {showTable ? "Hide" : "Show"} Table
              </button>
            </div>

            {/* Dynamic Bar */}
            {showBar && (
              <div className="glass-card" style={{ padding: "clamp(16px,3vw,24px)", marginBottom: 24 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: "#202124", marginBottom: 16 }}>Bar Chart</h3>
                <ChartContent type="bar" data={displayData} />
              </div>
            )}

            {/* Dynamic Pie */}
            {showPie && (
              <div ref={pieRef} className="glass-card" style={{ padding: "clamp(16px,3vw,24px)", marginBottom: 24 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: "#202124", marginBottom: 16 }}>Pie Chart</h3>
                <ChartContent type="pie" data={displayData} />
              </div>
            )}

            {/* Table */}
            {showTable && data.length > 0 && (
              <div className="glass-card" style={{ padding: "clamp(16px,3vw,24px)", marginBottom: 24 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: "#202124" }}>Data Table</h3>
                  <div style={{ position: "relative" }}>
                    <svg style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9aa0a6" strokeWidth="2">
                      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                    </svg>
                    <input
                      className="search-input"
                      type="text"
                      placeholder="Search…"
                      value={tableSearch}
                      onChange={e => setTableSearch(e.target.value)}
                    />
                  </div>
                </div>
                <div className="gem-table-wrap">
                  <table className="gem-table">
                    <thead>
                      <tr>{Object.keys(data[0]).map(k => <th key={k}>{k}</th>)}</tr>
                    </thead>
                    <tbody>
                      {filteredData.map((row, i) => (
                        <tr key={i}>
                          {Object.values(row).map((v, j) => <td key={j}>{v}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p style={{ fontSize: 12, color: "#9aa0a6", marginTop: 10 }}>{filteredData.length} of {data.length} rows</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Fixed Chat Panel */}
      {isUploaded && (
        <div className="chat-panel">
          {!chatOpen ? (
            <button className="chat-fab" onClick={() => setChatOpen(true)} title="Open AI Chat">
              ✦
            </button>
          ) : (
            <div className="glass-card" style={{ overflow: "hidden" }}>
              {/* Chat header */}
              <div style={{ padding: "14px 16px", borderBottom: "1px solid rgba(66,133,244,0.1)", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.9)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg, ${G_BLUE}, ${G_PURPLE})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 15 }}>✦</div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#202124" }}>Gemini AI</p>
                    <p style={{ fontSize: 11, color: G_GREEN }}>● Online</p>
                  </div>
                </div>
                <button onClick={() => setChatOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#5f6368", fontSize: 18, padding: 4 }}>✕</button>
              </div>

              {/* Messages */}
              <div ref={chatBoxRef} className="chat-messages" style={{ background: "rgba(248,249,252,0.8)" }}>
                {chat.length === 0 && (
                  <div style={{ textAlign: "center", color: "#9aa0a6", padding: "20px 0", fontSize: 13 }}>
                    Ask me anything about your data ✦
                  </div>
                )}
                {chat.map((msg, i) => (
                  <div key={i} style={{ display: "flex", flexDirection: "column" }}>
                    {msg.type === "user"
                      ? <div className="chat-bubble-user">{msg.text}</div>
                      : (
                        <div className="chat-bubble-ai">
                          <p>{msg.text}</p>
                          {msg.insight && <p style={{ marginTop: 6, fontSize: 13, color: "#5f6368" }}>{msg.insight}</p>}
                          {msg.suggestion && (
                            <p style={{ marginTop: 6, fontSize: 13, color: G_GREEN, display: "flex", alignItems: "center", gap: 5 }}>
                              💡 {msg.suggestion}
                            </p>
                          )}
                        </div>
                      )
                    }
                  </div>
                ))}
                {loading && (
                  <div className="chat-bubble-ai">
                    <TypingDots />
                  </div>
                )}
              </div>

              {/* Input */}
              <div style={{ padding: "12px", borderTop: "1px solid rgba(66,133,244,0.1)", background: "rgba(255,255,255,0.95)", display: "flex", gap: 8 }}>
                <input
                  style={{ flex: 1, padding: "10px 16px", borderRadius: 100, border: "1px solid rgba(66,133,244,0.2)", outline: "none", fontSize: 14, fontFamily: "inherit", background: "rgba(248,249,252,0.9)", color: "#202124" }}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAskAI()}
                  placeholder="Ask anything…"
                />
                <button
                  className="gem-btn gem-btn-primary"
                  onClick={handleAskAI}
                  disabled={loading}
                  style={{ padding: "10px 16px", borderRadius: "50%", width: 42, height: 42, justifyContent: "center" }}
                >
                  {loading ? <Spinner /> : "↑"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default UploadComponent;
