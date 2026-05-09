import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, ResponsiveContainer,
  LineChart, Line, Legend
} from "recharts";

const COLORS = ["#4f8ef7", "#00c49f", "#ffbb28", "#ff6b6b", "#a78bfa", "#f472b6", "#34d399", "#fb923c"];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;600;700&family=Google+Sans+Mono&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0f0f11;
    --surface: #1a1a1f;
    --surface2: #22222a;
    --surface3: #2a2a35;
    --border: rgba(255,255,255,0.08);
    --border2: rgba(255,255,255,0.14);
    --text: #e8eaed;
    --text2: #9aa0ac;
    --text3: #5f6368;
    --accent: #4f8ef7;
    --accent2: #7c4dff;
    --green: #00c49f;
    --red: #ff6b6b;
    --amber: #ffbb28;
    --radius: 16px;
    --radius-sm: 10px;
    --radius-xs: 6px;
    --glow: 0 0 0 1px rgba(79,142,247,0.3), 0 4px 24px rgba(79,142,247,0.08);
  }

  body { background: var(--bg); color: var(--text); font-family: 'Google Sans', sans-serif; }

  .app {
    min-height: 100vh;
    background: var(--bg);
    background-image: radial-gradient(ellipse 80% 60% at 50% -10%, rgba(79,142,247,0.08) 0%, transparent 70%);
  }

  /* HEADER */
  .header {
    display: flex; align-items: center; gap: 12px;
    padding: 20px 28px 0;
  }
  .logo-wrap {
    display: flex; align-items: center; gap: 10px;
  }
  .logo-icon {
    width: 36px; height: 36px; border-radius: 50%;
    background: linear-gradient(135deg, #4f8ef7 0%, #7c4dff 100%);
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; flex-shrink: 0;
    box-shadow: 0 0 18px rgba(79,142,247,0.4);
    animation: pulse-logo 3s ease-in-out infinite;
  }
  @keyframes pulse-logo {
    0%,100% { box-shadow: 0 0 18px rgba(79,142,247,0.4); }
    50% { box-shadow: 0 0 28px rgba(124,77,255,0.6); }
  }
  .logo-text { font-size: 22px; font-weight: 700; letter-spacing: -0.5px; }
  .logo-text span { background: linear-gradient(135deg, #4f8ef7, #7c4dff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

  /* HERO */
  .hero {
    text-align: center; padding: 48px 24px 32px;
    animation: fadeUp 0.6s ease both;
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .hero h1 { font-size: clamp(28px, 5vw, 44px); font-weight: 700; letter-spacing: -1px; margin-bottom: 10px; }
  .hero h1 .grad { background: linear-gradient(135deg, #4f8ef7 0%, #a78bfa 50%, #f472b6 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .hero p { color: var(--text2); font-size: 16px; max-width: 480px; margin: 0 auto; line-height: 1.6; }

  /* UPLOAD ZONE */
  .upload-zone {
    max-width: 640px; margin: 0 auto 32px; padding: 0 20px;
    animation: fadeUp 0.6s 0.1s ease both;
  }
  .upload-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(79,142,247,0.04), rgba(124,77,255,0.04));
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;   /* ✅ ADD THIS LINE */
}
  .upload-card::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(79,142,247,0.04), rgba(124,77,255,0.04));
    opacity: 0; transition: opacity 0.3s;
  }
  .upload-card:hover::before { opacity: 1; }
  .upload-card:hover { border-color: var(--accent); box-shadow: var(--glow); }
  .upload-card.dragging { border-color: var(--accent); background: rgba(79,142,247,0.05); }
  .upload-icon { font-size: 36px; margin-bottom: 12px; display: block;
    animation: bounce-slow 2s ease-in-out infinite; }
  @keyframes bounce-slow {
    0%,100% { transform: translateY(0); }
    50% { transform: translateY(-4px); }
  }
  .upload-card h3 { font-size: 17px; font-weight: 600; margin-bottom: 6px; }
  .upload-card p { font-size: 13px; color: var(--text2); margin-bottom: 18px; }
  .file-input-wrap { display: flex; gap: 10px; align-items: center; justify-content: center; flex-wrap: wrap; }
  .file-chosen { font-size: 13px; color: var(--accent); font-weight: 500;
    background: rgba(79,142,247,0.1); padding: 4px 12px; border-radius: 20px; }

  /* BUTTONS */
  .btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 10px 20px; border-radius: 40px; font-size: 14px; font-weight: 600;
    cursor: pointer; border: none; transition: all 0.2s ease; font-family: inherit;
  }
  .btn:active { transform: scale(0.97); }
  .btn-primary {
    background: linear-gradient(135deg, #4f8ef7, #7c4dff);
    color: #fff;
    box-shadow: 0 4px 14px rgba(79,142,247,0.3);
  }
  .btn-primary:hover { box-shadow: 0 6px 20px rgba(79,142,247,0.5); transform: translateY(-1px); }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
  .btn-ghost {
    background: var(--surface2); color: var(--text); border: 1px solid var(--border2);
  }
  .btn-ghost:hover { background: var(--surface3); }
  .btn-ghost.active { border-color: var(--accent); color: var(--accent); background: rgba(79,142,247,0.08); }
  .btn-icon {
    width: 40px; height: 40px; padding: 0; justify-content: center;
    background: linear-gradient(135deg, #4f8ef7, #7c4dff);
    color: #fff; border-radius: 50%; flex-shrink: 0;
    box-shadow: 0 4px 14px rgba(79,142,247,0.3);
  }
  .btn-icon:hover { box-shadow: 0 6px 20px rgba(79,142,247,0.5); transform: translateY(-1px); }
  .btn-icon:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
  .btn-file {
    background: var(--surface2); color: var(--text); border: 1px solid var(--border2);
    padding: 8px 18px; border-radius: 40px; font-size: 14px; font-weight: 500;
    cursor: pointer; transition: all 0.2s;
  }
  .btn-file:hover { border-color: var(--accent); color: var(--accent); }

  /* MAIN LAYOUT */
  .dashboard {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px 40px;
    animation: fadeUp 0.5s 0.15s ease both;
  }
  @media (max-width: 900px) { .dashboard { grid-template-columns: 1fr; } }

  /* CARDS */
  .card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius); overflow: hidden;
    transition: border-color 0.2s;
  }
  .card:hover { border-color: var(--border2); }
  .card-header {
    display: flex; align-items: center; gap: 10px;
    padding: 18px 20px 14px; border-bottom: 1px solid var(--border);
  }
  .card-header-icon {
    width: 32px; height: 32px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center; font-size: 15px;
    background: linear-gradient(135deg, rgba(79,142,247,0.2), rgba(124,77,255,0.2));
  }
  .card-header h2 { font-size: 15px; font-weight: 600; }
  .card-header .badge {
    margin-left: auto; font-size: 11px; padding: 3px 10px;
    background: rgba(79,142,247,0.12); color: var(--accent);
    border-radius: 20px; font-weight: 600;
  }

  /* CHAT */
  .chat-col { display: flex; flex-direction: column; }
  .chat-messages {
    flex: 1; overflow-y: auto; padding: 16px 18px;
    height: 420px; scroll-behavior: smooth;
    display: flex; flex-direction: column; gap: 14px;
  }
  .chat-messages::-webkit-scrollbar { width: 4px; }
  .chat-messages::-webkit-scrollbar-thumb { background: var(--surface3); border-radius: 4px; }
  .chat-messages::-webkit-scrollbar-track { background: transparent; }

  .msg { display: flex; gap: 10px; animation: msgIn 0.3s ease both; }
  @keyframes msgIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .msg.user { flex-direction: row-reverse; }

  .msg-avatar {
    width: 30px; height: 30px; border-radius: 50%; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 600;
  }
  .msg.user .msg-avatar { background: linear-gradient(135deg, #4f8ef7, #7c4dff); color: #fff; }
  .msg.ai .msg-avatar {
    background: linear-gradient(135deg, #7c4dff, #f472b6); color: #fff;
    animation: glow-avatar 3s ease-in-out infinite;
  }
  @keyframes glow-avatar {
    0%,100% { box-shadow: 0 0 0 2px rgba(124,77,255,0.2); }
    50% { box-shadow: 0 0 0 4px rgba(244,114,182,0.2); }
  }

  .msg-bubble {
    max-width: 85%; padding: 11px 15px; border-radius: 16px;
    font-size: 14px; line-height: 1.6;
  }
  .msg.user .msg-bubble {
    background: linear-gradient(135deg, #4f8ef7, #7c4dff);
    color: #fff; border-bottom-right-radius: 4px;
  }
  .msg.ai .msg-bubble {
    background: var(--surface2); color: var(--text);
    border: 1px solid var(--border); border-bottom-left-radius: 4px;
  }
  .msg-extra { margin-top: 8px; font-size: 12px; }
  .msg-insight { color: var(--text2); }
  .msg-suggestion {
    display: flex; align-items: flex-start; gap: 6px; margin-top: 6px;
    color: var(--green); padding: 8px 10px;
    background: rgba(0,196,159,0.08); border-radius: var(--radius-xs);
    border: 1px solid rgba(0,196,159,0.2);
  }

  /* TYPING INDICATOR */
  .typing { display: flex; align-items: center; gap: 5px; padding: 10px 14px;
    background: var(--surface2); border-radius: 16px; border-bottom-left-radius: 4px;
    border: 1px solid var(--border); width: fit-content; }
  .typing span {
    width: 7px; height: 7px; border-radius: 50%; background: var(--text3);
    display: inline-block; animation: blink 1.2s ease-in-out infinite;
  }
  .typing span:nth-child(2) { animation-delay: 0.2s; }
  .typing span:nth-child(3) { animation-delay: 0.4s; }
  @keyframes blink { 0%,100% { opacity: 0.3; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.1); } }

  /* CHAT INPUT */
  .chat-input-wrap {
    padding: 14px 16px; border-top: 1px solid var(--border);
    display: flex; align-items: flex-end; gap: 10px;
  }
  .chat-textarea {
    flex: 1; background: var(--surface2); border: 1px solid var(--border2);
    border-radius: 24px; color: var(--text); font-family: inherit; font-size: 14px;
    padding: 10px 18px; outline: none; resize: none; min-height: 42px; max-height: 120px;
    transition: border-color 0.2s; line-height: 1.5;
  }
  .chat-textarea::placeholder { color: var(--text3); }
  .chat-textarea:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(79,142,247,0.15); }

  /* CHART PANEL */
  .chart-col { display: flex; flex-direction: column; gap: 16px; }
  .chart-body { padding: 16px 12px; }
  .chart-tabs {
    display: flex; gap: 8px; padding: 14px 16px; flex-wrap: wrap;
  }

  /* EMPTY STATE */
  .empty-state {
    display: flex; flex-direction: column; align-items: center; gap: 12px;
    padding: 40px 20px; color: var(--text3); text-align: center;
  }
  .empty-state .empty-icon { font-size: 40px; opacity: 0.4; }
  .empty-state p { font-size: 13px; max-width: 200px; line-height: 1.5; }

  /* TABLE */
  .table-wrap { overflow-x: auto; padding: 0 0 16px; }
  .data-table { width: 100%; border-collapse: collapse; font-size: 13px; }
  .data-table th {
    padding: 10px 14px; background: var(--surface2); color: var(--text2);
    font-weight: 600; text-align: left; border-bottom: 1px solid var(--border);
    white-space: nowrap; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;
  }
  .data-table td {
    padding: 10px 14px; border-bottom: 1px solid var(--border); color: var(--text);
    white-space: nowrap;
  }
  .data-table tr:last-child td { border-bottom: none; }
  .data-table tr:hover td { background: var(--surface2); }

  /* TOAST */
  .toast-area { position: fixed; top: 20px; right: 20px; z-index: 9999; display: flex; flex-direction: column; gap: 10px; }
  .toast {
    display: flex; align-items: center; gap: 10px;
    padding: 13px 18px; border-radius: var(--radius-sm);
    font-size: 14px; font-weight: 500; max-width: 340px;
    animation: toastIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  }
  .toast.exiting { animation: toastOut 0.25s ease both; }
  @keyframes toastIn { from { opacity: 0; transform: translateX(60px) scale(0.9); } to { opacity: 1; transform: translateX(0) scale(1); } }
  @keyframes toastOut { from { opacity: 1; transform: translateX(0); } to { opacity: 0; transform: translateX(60px); } }
  .toast.success { background: #0d2e22; border: 1px solid rgba(0,196,159,0.3); color: #00c49f; }
  .toast.error   { background: #2e0d0d; border: 1px solid rgba(255,107,107,0.3); color: #ff6b6b; }
  .toast.info    { background: #0d1a2e; border: 1px solid rgba(79,142,247,0.3); color: #4f8ef7; }

  /* MODAL */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 9998;
    display: flex; align-items: center; justify-content: center; padding: 20px;
    animation: fadeOverlay 0.25s ease both;
    backdrop-filter: blur(4px);
  }
  @keyframes fadeOverlay { from { opacity: 0; } to { opacity: 1; } }
  .modal {
    background: var(--surface); border: 1px solid var(--border2); border-radius: var(--radius);
    padding: 28px; max-width: 420px; width: 100%;
    animation: modalIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both;
    box-shadow: 0 24px 64px rgba(0,0,0,0.5);
  }
  @keyframes modalIn { from { opacity: 0; transform: scale(0.9) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }
  .modal-icon { font-size: 40px; text-align: center; margin-bottom: 14px; }
  .modal h3 { font-size: 18px; font-weight: 700; margin-bottom: 8px; text-align: center; }
  .modal p  { color: var(--text2); font-size: 14px; line-height: 1.6; text-align: center; margin-bottom: 22px; }
  .modal-actions { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }

  /* SPINNER */
  .spinner {
    width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.2);
    border-top-color: #fff; border-radius: 50%;
    animation: spin 0.6s linear infinite; display: inline-block;
  }
  .spinner-lg {
    width: 32px; height: 32px; border-width: 3px;
    border-color: var(--border2); border-top-color: var(--accent);
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* WELCOME */
  .welcome-chat {
    display: flex; flex-direction: column; align-items: center;
    gap: 10px; padding: 50px 20px; text-align: center; color: var(--text3);
    flex: 1; justify-content: center;
  }
  .welcome-chat .wai { font-size: 36px; margin-bottom: 4px;
    animation: float 3s ease-in-out infinite; }
  @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
  .welcome-chat h3 { font-size: 16px; font-weight: 600; color: var(--text2); }
  .welcome-chat p { font-size: 13px; max-width: 220px; line-height: 1.5; }

  /* UPLOAD SPINNER */
  .uploading-state {
    display: flex; flex-direction: column; align-items: center; gap: 14px;
    padding: 32px;
  }
  .upload-progress {
    font-size: 14px; color: var(--text2); text-align: center;
  }

  /* TOOLTIP CUSTOM */
  .recharts-tooltip-wrapper .recharts-default-tooltip {
    background: var(--surface2) !important; border: 1px solid var(--border2) !important;
    border-radius: var(--radius-xs) !important; color: var(--text) !important;
  }

  /* SECTION LABEL */
  .section-label {
    font-size: 11px; text-transform: uppercase; letter-spacing: 1px;
    color: var(--text3); font-weight: 600; padding: 12px 20px 4px;
  }

  /* STATS ROW */
  .stats-row { display: flex; gap: 10px; padding: 0 16px 12px; flex-wrap: wrap; }
  .stat-chip {
    flex: 1; min-width: 80px; background: var(--surface2);
    border: 1px solid var(--border); border-radius: var(--radius-sm);
    padding: 10px 14px;
  }
  .stat-chip .val { font-size: 20px; font-weight: 700; }
  .stat-chip .lbl { font-size: 11px; color: var(--text2); margin-top: 2px; }

  /* CHART TITLE */
  .chart-title {
    font-size: 13px; font-weight: 600; color: var(--text2); margin-bottom: 12px;
    display: flex; align-items: center; gap: 6px;
  }
  .chart-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }

  /* FLOURA ANIMATION */
  .floura-orb {
    width: 120px; height: 120px; margin: 0 auto 8px;
    border-radius: 50%; position: relative;
    background: radial-gradient(circle at 40% 35%, #7c4dff, #4f8ef7 50%, #f472b6 100%);
    animation: floura-pulse 2.5s ease-in-out infinite;
    display: flex; align-items: center; justify-content: center; font-size: 44px;
  }
  @keyframes floura-pulse {
    0%,100% {
      transform: scale(1);
      box-shadow: 0 0 0 0 rgba(79,142,247,0.4), 0 0 40px rgba(124,77,255,0.3);
    }
    50% {
      transform: scale(1.06);
      box-shadow: 0 0 0 14px rgba(79,142,247,0), 0 0 60px rgba(244,114,182,0.4);
    }
  }
  .floura-orb::before {
    content: '';
    position: absolute; inset: -8px; border-radius: 50%;
    border: 2px solid transparent;
    background: linear-gradient(135deg, rgba(79,142,247,0.5), rgba(244,114,182,0.5)) border-box;
    -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: destination-out; mask-composite: exclude;
    animation: spin 4s linear infinite;
  }

  /* NO DATA */
  .no-data-chart {
    height: 220px; display: flex; align-items: center; justify-content: center;
    color: var(--text3); font-size: 14px; flex-direction: column; gap: 8px;
  }

  @media (max-width: 600px) {
    .header { padding: 14px 14px 0; }
    .hero { padding: 28px 14px 18px; }
    .upload-zone { padding: 0 12px; }
    .dashboard { padding: 0 12px 30px; gap: 14px; }
    .chat-messages { height: 320px; }
    .floura-orb { width: 80px; height: 80px; font-size: 30px; }
  }
`;

// ── TOAST SYSTEM ──────────────────────────────────────────────────────────────
let toastId = 0;
function useToasts() {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((msg, type = "info", duration = 3500) => {
    const id = ++toastId;
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), duration);
  }, []);
  return { toasts, add };
}

// ── MODAL ─────────────────────────────────────────────────────────────────────
function Modal({ modal, onClose }) {
  if (!modal) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-icon">{modal.icon || "⚠️"}</div>
        <h3>{modal.title}</h3>
        <p>{modal.message}</p>
        <div className="modal-actions">
          {modal.actions ? modal.actions.map((a, i) => (
            <button key={i} className={`btn ${a.style || "btn-ghost"}`} onClick={() => { a.onClick?.(); onClose(); }}>
              {a.label}
            </button>
          )) : (
            <button className="btn btn-primary" onClick={onClose}>Got it</button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── CUSTOM TOOLTIP ─────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "var(--surface2)", border: "1px solid var(--border2)", borderRadius: 8, padding: "8px 12px", fontSize: 13 }}>
      <p style={{ color: "var(--text2)", marginBottom: 4 }}>{label}</p>
      <p style={{ color: "var(--accent)", fontWeight: 600 }}>{Number(payload[0]?.value).toLocaleString()}</p>
    </div>
  );
};

// ── MAIN COMPONENT ─────────────────────────────────────────────────────────────
export default function AIDashboard() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [isUploaded, setIsUploaded] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [query, setQuery] = useState("");
  const [chat, setChat] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [activeChart, setActiveChart] = useState("bar");
  const [showTable, setShowTable] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [modal, setModal] = useState(null);

  const { toasts, add: addToast } = useToasts();
  const chatRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [chat, aiLoading]);

  // ── FILE HANDLING ──
  const handleFileSelect = (f) => {
    if (!f) return;
    if (!f.name.endsWith(".csv")) {
      addToast("Please select a CSV file only.", "error");
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setModal({ icon: "📦", title: "File too large", message: "Please upload a CSV file smaller than 10 MB for best performance." });
      return;
    }
    setFile(f);
    addToast(`Selected: ${f.name}`, "info", 2000);
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0];
    handleFileSelect(f);
  };

  // ── UPLOAD ──
  const handleUpload = async () => {
    if (!file) {
      setModal({ icon: "📄", title: "No file selected", message: "Please select a CSV file first before uploading." });
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
        method: "POST", body: formData
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const result = await res.json();
      setData(result.data);
      setIsUploaded(true);
      setChat([]);
      setShowTable(false);
      addToast("✓ File uploaded successfully!", "success");
    } catch (err) {
      setModal({
        icon: "❌", title: "Upload Failed",
        message: `Could not upload your file. ${err.message}. Please check your connection and try again.`,
        actions: [{ label: "Try Again", style: "btn-primary", onClick: handleUpload }, { label: "Dismiss" }]
      });
    } finally {
      setUploading(false);
    }
  };

  // ── ASK AI ──
  const handleAsk = async () => {
    if (!query.trim() || aiLoading) return;
    const q = query.trim();
    setChat(prev => [...prev, { type: "user", text: q }]);
    setQuery("");
    setAiLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q, data })
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const result = await res.json();
      setChat(prev => [...prev, {
        type: "ai", text: result.answer,
        insight: result.insight, suggestion: result.suggestion,
        labels: result.labels, values: result.values,
        chartType: result.chartType
      }]);
      if (result.chartType) setActiveChart(result.chartType);
    } catch (err) {
      setChat(prev => [...prev, {
        type: "ai",
        text: `I encountered an error: ${err.message}. Please try again.`,
        isError: true
      }]);
      setModal({
        icon: "🤖", title: "AI Error",
        message: `The AI couldn't process your request: ${err.message}`,
        actions: [{ label: "Retry", style: "btn-primary", onClick: () => { setQuery(q); } }, { label: "Dismiss" }]
      });
    } finally {
      setAiLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAsk(); }
  };

  // ── CHART DATA ──
  const lastAI = [...chat].reverse().find(m => m.type === "ai");
  const aiChartData = (lastAI?.labels || []).map((label, i) => ({
    name: label, value: Number(lastAI?.values?.[i]) || 0
  }));
  const fullChartData = data.map((item, idx) => {
    const keys = Object.keys(item);
    const labelKey = keys[0];
    const numKey = keys.find(k => !isNaN(item[k]) && item[k] !== "" && k !== keys[0]) || keys[1];
    return { name: item[labelKey] || `Item ${idx + 1}`, value: Number(item[numKey]) || 0 };
  });
  const chartData = aiChartData.length > 0 ? aiChartData : fullChartData;

  // ── STATS ──
  const stats = (() => {
    if (!chartData.length) return null;
    const vals = chartData.map(d => d.value);
    return {
      count: data.length,
      max: Math.max(...vals).toLocaleString(),
      min: Math.min(...vals).toLocaleString(),
      avg: Math.round(vals.reduce((a, b) => a + b, 0) / vals.length).toLocaleString()
    };
  })();

  const renderChart = () => {
    if (!chartData.length) return (
      <div className="no-data-chart">
        <span style={{ fontSize: 28, opacity: 0.4 }}>📊</span>
        <span>Ask a question to see chart data</span>
      </div>
    );
    const h = 240;
    const w = Math.max(chartData.length * 80, 300);
    if (activeChart === "pie") return (
      <ResponsiveContainer width="100%" height={h}>
        <PieChart>
          <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
            {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    );
    if (activeChart === "line") return (
      <div style={{ overflowX: "auto" }}>
        <LineChart width={w} height={h} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="name" tick={{ fill: "var(--text3)", fontSize: 11 }} angle={-30} textAnchor="end" interval={Math.ceil(chartData.length / 8)} />
          <YAxis tick={{ fill: "var(--text3)", fontSize: 11 }} />
          <Tooltip content={<CustomTooltip />} />
          <Line type="monotone" dataKey="value" stroke="var(--accent)" strokeWidth={2.5} dot={{ r: 4, fill: "var(--accent)" }} activeDot={{ r: 6 }} />
        </LineChart>
      </div>
    );
    return (
      <div style={{ overflowX: "auto" }}>
        <BarChart width={w} height={h} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="name" tick={{ fill: "var(--text3)", fontSize: 11 }} angle={-30} textAnchor="end" interval={Math.ceil(chartData.length / 8)} />
          <YAxis tick={{ fill: "var(--text3)", fontSize: 11 }} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Bar>
        </BarChart>
      </div>
    );
  };

  return (
    <>
      <style>{css}</style>

      {/* TOASTS */}
      <div className="toast-area">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type}`}>
            <span>{t.type === "success" ? "✓" : t.type === "error" ? "✕" : "ℹ"}</span>
            {t.msg}
          </div>
        ))}
      </div>

      {/* MODAL */}
      <Modal modal={modal} onClose={() => setModal(null)} />

      <div className="app">
        {/* HEADER */}
        <div className="header">
          <div className="logo-wrap">
            <div className="logo-icon">✦</div>
            <div className="logo-text"><span>Floura</span> AI</div>
          </div>
        </div>

        {/* HERO */}
        <div className="hero">
          <div className="floura-orb">✦</div>
          <h1><span className="grad">Analyze. Visualize. Discover.</span></h1>
          <p>Upload your CSV and chat with your data using AI-powered insights.</p>
        </div>

        {/* UPLOAD ZONE */}
        {!isUploaded && (
          <div className="upload-zone">
            <div
              className={`upload-card ${dragging ? "dragging" : ""}`}
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
            >
              {uploading ? (
                <div className="uploading-state">
                  <div className="spinner spinner-lg" />
                  <div className="upload-progress">
                    <p style={{ color: "var(--accent)", fontWeight: 600 }}>Uploading your data…</p>
                    <p style={{ fontSize: 12, color: "var(--text3)", marginTop: 6 }}>Processing {file?.name}</p>
                  </div>
                </div>
              ) : (
                <>
                  <span className="upload-icon">☁</span>
                  <h3>Drop your CSV here</h3>
                  <p>Drag & drop or browse — max 10 MB</p>
                  <div className="file-input-wrap">
                    <input
                      ref={fileInputRef} type="file" accept=".csv"
                      style={{
                        opacity: 0,
                        position: "absolute",
                        pointerEvents: "none"
                      }}
                      onChange={e => handleFileSelect(e.target.files[0])}
                    />
                    <button
                      type="button"
                      className="btn-file"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log("clicked"); // 👈 check this in console
                        fileInputRef.current?.click();
                      }}
                    >
                      Browse files
                    </button>
                    {file && <span className="file-chosen">📄 {file.name}</span>}
                    <button className="btn btn-primary" onClick={handleUpload} disabled={!file || uploading}>
                      {uploading ? <span className="spinner" /> : "↑"}
                      Upload
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* DASHBOARD */}
        {isUploaded && (
          <div className="dashboard">

            {/* CHAT COLUMN */}
            <div className="card chat-col" style={{ display: "flex", flexDirection: "column" }}>
              <div className="card-header">
                <div className="card-header-icon">✦</div>
                <h2>Chat with Floura</h2>
                <span className="badge">AI Ready</span>
              </div>

              <div ref={chatRef} className="chat-messages">
                {chat.length === 0 && (
                  <div className="welcome-chat">
                    <div className="wai">✦</div>
                    <h3>Hello! I'm Floura</h3>
                    <p>Ask me anything about your data — trends, summaries, comparisons, and more.</p>
                  </div>
                )}
                {chat.map((msg, i) => (
                  <div key={i} className={`msg ${msg.type}`}>
                    <div className="msg-avatar">{msg.type === "user" ? "U" : "✦"}</div>
                    <div>
                      <div className="msg-bubble" style={msg.isError ? { borderColor: "rgba(255,107,107,0.3)" } : {}}>
                        {msg.text}
                      </div>
                      {(msg.insight || msg.suggestion) && (
                        <div className="msg-extra">
                          {msg.insight && <p className="msg-insight">💡 {msg.insight}</p>}
                          {msg.suggestion && (
                            <div className="msg-suggestion">
                              <span>⚡</span>
                              <span>{msg.suggestion}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {aiLoading && (
                  <div className="msg ai">
                    <div className="msg-avatar">✦</div>
                    <div className="typing"><span /><span /><span /></div>
                  </div>
                )}
              </div>

              <div className="chat-input-wrap">
                <textarea
                  ref={textareaRef}
                  className="chat-textarea"
                  value={query}
                  onChange={e => {
                    setQuery(e.target.value);
                    e.target.style.height = "auto";
                    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything about your data…"
                  rows={1}
                  disabled={aiLoading}
                />
                <button className="btn btn-icon" onClick={handleAsk} disabled={!query.trim() || aiLoading}>
                  {aiLoading ? <span className="spinner" style={{ borderTopColor: "#fff" }} /> : "▶"}
                </button>
              </div>
            </div>

            {/* CHART COLUMN */}
            <div className="chart-col">
              <div className="card">
                <div className="card-header">
                  <div className="card-header-icon">📊</div>
                  <h2>Visualization</h2>
                  {chartData.length > 0 && <span className="badge">{chartData.length} points</span>}
                </div>

                {stats && (
                  <div className="stats-row">
                    <div className="stat-chip"><div className="val" style={{ color: "var(--accent)" }}>{stats.count}</div><div className="lbl">Rows</div></div>
                    <div className="stat-chip"><div className="val" style={{ color: "var(--green)" }}>{stats.max}</div><div className="lbl">Max</div></div>
                    <div className="stat-chip"><div className="val" style={{ color: "var(--amber)" }}>{stats.avg}</div><div className="lbl">Avg</div></div>
                    <div className="stat-chip"><div className="val" style={{ color: "var(--red)" }}>{stats.min}</div><div className="lbl">Min</div></div>
                  </div>
                )}

                <div className="chart-tabs">
                  {["bar", "line", "pie"].map(t => (
                    <button key={t} className={`btn btn-ghost ${activeChart === t ? "active" : ""}`}
                      style={{ padding: "7px 16px", fontSize: 13 }}
                      onClick={() => setActiveChart(t)}>
                      {t === "bar" ? "▦ Bar" : t === "line" ? "↗ Line" : "◌ Pie"}
                    </button>
                  ))}
                </div>

                <div className="chart-body">{renderChart()}</div>
              </div>

              {/* TABLE TOGGLE */}
              <div className="card">
                <div className="card-header" style={{ cursor: "pointer" }} onClick={() => setShowTable(s => !s)}>
                  <div className="card-header-icon">📋</div>
                  <h2>Data Table</h2>
                  <span className="badge" style={{ marginLeft: "auto" }}>{showTable ? "▲ Hide" : "▼ Show"}</span>
                </div>
                {showTable && data.length > 0 && (
                  <div className="table-wrap">
                    <table className="data-table">
                      <thead>
                        <tr>{Object.keys(data[0]).map(k => <th key={k}>{k}</th>)}</tr>
                      </thead>
                      <tbody>
                        {data.slice(0, 100).map((row, i) => (
                          <tr key={i}>{Object.values(row).map((v, j) => <td key={j}>{v}</td>)}</tr>
                        ))}
                      </tbody>
                    </table>
                    {data.length > 100 && (
                      <p style={{ fontSize: 12, color: "var(--text3)", textAlign: "center", padding: "10px 0" }}>
                        Showing 100 of {data.length} rows
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* NEW UPLOAD */}
              <button className="btn btn-ghost" style={{ width: "100%", justifyContent: "center" }}
                onClick={() => {
                  setIsUploaded(false); setData([]); setChat([]); setFile(null); setShowTable(false);
                  addToast("Ready for a new file.", "info", 2000);
                }}>
                ↩ Upload a different file
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
