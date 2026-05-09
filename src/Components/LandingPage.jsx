import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cpu,
  ArrowRight,
  Sparkles,
  FileSpreadsheet,
  MessageSquareQuote,
  PieChart,
  BarChart3,
  TrendingUp,
  Table,
  Zap,
  DownloadCloud,
  Mail,
  Globe,
  Code,
  Send,
  UserCheck
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const [chatText, setChatText] = useState("");
  const fullText = "I've analyzed your database. I found a 14% increase in user retention. Should I generate the visual charts for the dashboard?";
  const navigate = useNavigate();


  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setChatText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  const features = [
    { title: "CSV Intelligence", desc: "Upload raw CSV files and let AI structure the logic automatically.", icon: <FileSpreadsheet className="text-blue-500" /> },
    { title: "AI Chat Assistant", desc: "Ask anything about your data in plain English. No SQL required.", icon: <MessageSquareQuote className="text-purple-500" /> },
    { title: "Dynamic Pie Charts", desc: "Instant distribution analysis with interactive segmenting.", icon: <PieChart className="text-rose-500" /> },
    { title: "Predictive Bar Charts", desc: "Compare metrics and identify growth trends effortlessly.", icon: <BarChart3 className="text-amber-500" /> },
    { title: "Trend Line Analysis", desc: "Visualize progress over time with high-precision line charts.", icon: <TrendingUp className="text-emerald-500" /> },
    { title: "Smart Data Tables", desc: "Search, filter, and sort through thousands of rows instantly.", icon: <Table className="text-indigo-500" /> },
    { title: "AI-Powered Insights", desc: "Deep-learning models detect anomalies and opportunities.", icon: <Zap className="text-yellow-500" /> },
    { title: "Secure Export", desc: "Download your analyzed reports in professional PDF or Excel formats.", icon: <DownloadCloud className="text-cyan-500" /> }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-100 overflow-x-hidden relative">

      {/* --- BACKGROUND BLOBS --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] -left-[10%] w-[600px] h-[600px] bg-blue-50/40 rounded-full blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] -right-[10%] w-[600px] h-[600px] bg-purple-50/40 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      {/* --- NAVBAR --- */}
      <nav className="relative z-50 w-full backdrop-blur-md bg-white/30 border-b border-slate-100">
        <div className="container h-16 d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-lg d-flex align-items-center justify-center shadow-md">
              <Cpu className="text-white animate-pulse" size={18} />
            </div>
            <span className="h5 fw-bold mb-0 tracking-tighter">
              Analytica<span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">AI</span>
            </span>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <main className="relative z-10 container py-5 text-center">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              {/* Resized Heading - Now more balanced */}
              <h1 className="fw-black tracking-tighter leading-tight mb-4 mt-4" style={{ fontSize: 'clamp(2.5rem, 8vw, 5.5rem)', fontWeight: 900 }}>
                Insights, <br />
                <span className="animate-gradient-flow bg-gradient-to-r from-blue-600 via-purple-500 via-rose-500 via-emerald-500 to-blue-600 bg-[length:200%_auto] bg-clip-text text-transparent">
                  reimagined.
                </span>
              </h1>

              <p className="fs-5 text-slate-500 max-w-2xl mx-auto mb-4 leading-relaxed">
                The ultimate AI analyst for your business. Transform complex CSV data into
                stunning visualizations and actionable intelligence instantly.
              </p>

              <button
                className="group relative px-4 py-2.5 bg-black text-white rounded-3 fw-bold transition-all hover:scale-105 shadow-xl border-0"
                onClick={() => navigate("/dashabord")}

              >Generate Insights</button>
            </motion.div>
          </div>
        </div>

        {/* --- AI PREVIEW CARD (Resized) --- */}
        <div className="row justify-content-center mt-5">
          <div className="col-md-9 col-lg-7">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}
              className="p-1 bg-gradient-to-b from-slate-200 to-transparent rounded-4 shadow-sm"
            >
              <div className="bg-white/90 rounded-4 p-4 md:p-5">
                <div className="d-flex align-items-center gap-4 text-start">
                  <div className="w-12 h-12 bg-slate-900 rounded-3 d-flex align-items-center justify-center text-blue-400 shrink-0 shadow-lg">
                    <Sparkles size={24} className="animate-spin-slow" />
                  </div>
                  <p className="h4 text-slate-800 fw-bold mb-0 leading-snug">
                    "{chatText}"
                    <span className="d-inline-block w-1 h-5 bg-blue-600 ms-2 animate-pulse" />
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* --- FEATURE CARDS --- */}
        <div className="row g-3 mt-5">
          <div className="col-12 mb-2">
            <h2 className="fw-bold h3">Core Capabilities</h2>
            <div className="w-16 h-1 bg-primary mx-auto rounded-pill opacity-20"></div>
          </div>
          {features.map((f, idx) => (
            <div key={idx} className="col-sm-6 col-md-4 col-lg-3">
              <motion.div
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="h-100 p-4 bg-white border border-slate-100 rounded-4 text-start shadow-sm hover:shadow-md transition-all group"
              >
                <div className="w-10 h-10 bg-slate-50 rounded-3 d-flex align-items-center justify-center mb-3 group-hover:bg-blue-50">
                  {React.cloneElement(f.icon, { size: 20 })}
                </div>
                <h3 className="h6 fw-bold mb-2">{f.title}</h3>
                <p className="text-slate-500 extra-small mb-0" style={{ fontSize: '0.85rem' }}>{f.desc}</p>
              </motion.div>
            </div>
          ))}
        </div>
      </main>

      {/* --- FOOTER (Compact) --- */}
      <footer className="relative z-10 bg-slate-50 border-top mt-5 py-5">
        <div className="container">
          <div className="row gy-4">
            <div className="col-lg-4">
              <div className="h5 fw-black mb-3">AnalyticaAI</div>
              <p className="text-slate-500 small">Developed by Abhishek Sasane. Precision data analysis meets next-gen AI automation.</p>
            </div>
            <div className="col-lg-4">
              <h6 className="fw-bold mb-3">Support</h6>
              <div className="d-flex align-items-center gap-2 mb-2 text-slate-600 small">
                <Mail size={16} /> abhisheksasane212@gmail.com
              </div>
              <div className="d-flex align-items-center gap-2 text-slate-600 small">
                <Globe size={16} /> support.analytica.ai
              </div>
            </div>
            <div className="col-lg-4 text-lg-end">
              <h6 className="fw-bold mb-3">Legal</h6>
              <p className="text-slate-500 small mb-1 cursor-pointer">Terms & Conditions</p>
              <p className="text-slate-500 small cursor-pointer">Privacy Policy</p>
            </div>
          </div>
          <div className="border-top mt-4 pt-4 d-flex flex-column flex-md-row align-items-center justify-content-between">
            <p className="text-slate-400 extra-small">© 2026 Crafted by Abhishek Sasane</p>
            <div className="d-flex gap-3">
              <Code className="text-slate-400 hover:text-black cursor-pointer" size={18} />
              <Send className="text-slate-400 hover:text-primary cursor-pointer" size={18} />
              <UserCheck className="text-slate-400 hover:text-blue-700 cursor-pointer" size={18} />
            </div>
          </div>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes gradient-flow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-flow {
          animation: gradient-flow 8s ease infinite;
        }
        .animate-pulse-slow {
          animation: pulse 10s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animate-spin-slow {
          animation: spin 6s linear infinite;
        }
        .fw-black { font-weight: 900 !important; }
        .rounded-4 { border-radius: 1.25rem !important; }
        .extra-small { font-size: 0.75rem; }
      `}} />
    </div>
  );
}