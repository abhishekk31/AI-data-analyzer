import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, ResponsiveContainer,
  AreaChart, Area, Legend
} from "recharts";

/* ─── Font Awesome CDN injected via useEffect ─────────────── */
const FA_CDN = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css";

/* ─── Design Tokens ──────────────────────────────────────── */
const COLORS = ["#6366F1","#0EA5E9","#10B981","#F59E0B","#EC4899","#8B5CF6","#14B8A6","#F97316"];

/* ─── Global CSS ─────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=JetBrains+Mono:wght@400;500&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

:root{
  --bg:#FAFAFA;
  --surface:#FFFFFF;
  --border:#EAECF0;
  --border-hover:#C7CDD9;
  --text:#0D0F1A;
  --text-secondary:#64748B;
  --text-muted:#94A3B8;
  --accent:#6366F1;
  --accent-2:#0EA5E9;
  --accent-3:#10B981;
  --font:'DM Sans',-apple-system,sans-serif;
  --font-display:'Syne',sans-serif;
  --font-mono:'JetBrains Mono',monospace;
  --radius:10px;
  --radius-lg:14px;
  --radius-xl:18px;
  --shadow:0 1px 3px rgba(0,0,0,0.06),0 1px 2px rgba(0,0,0,0.04);
  --shadow-md:0 4px 12px rgba(0,0,0,0.07),0 2px 4px rgba(0,0,0,0.04);
  --shadow-lg:0 12px 32px rgba(0,0,0,0.09),0 4px 8px rgba(0,0,0,0.05);
  --anim-bg-size:400% 400%;
}

html{scroll-behavior:smooth}

body{
  font-family:var(--font);
  background:var(--bg);
  color:var(--text);
  min-height:100vh;
  -webkit-font-smoothing:antialiased;
  padding-bottom:120px;
  position:relative;
  overflow-x:hidden;
}

/* ── Gemini-style animated gradient background ── */
body::before{
  content:'';
  position:fixed;
  inset:0;
  z-index:0;
  background:
    radial-gradient(ellipse 80% 60% at 20% -10%, rgba(99,102,241,0.07) 0%, transparent 55%),
    radial-gradient(ellipse 60% 50% at 80% 10%, rgba(14,165,233,0.06) 0%, transparent 50%),
    radial-gradient(ellipse 50% 40% at 50% 90%, rgba(16,185,129,0.05) 0%, transparent 50%),
    radial-gradient(ellipse 70% 50% at 90% 50%, rgba(139,92,246,0.04) 0%, transparent 55%);
  background-size:var(--anim-bg-size);
  animation:bgShift 18s ease infinite;
  pointer-events:none;
}

@keyframes bgShift{
  0%{background-position:0% 50%}
  25%{background-position:100% 0%}
  50%{background-position:100% 100%}
  75%{background-position:0% 100%}
  100%{background-position:0% 50%}
}

body::after{
  content:'';
  position:fixed;
  inset:0;
  z-index:0;
  background-image:
    linear-gradient(rgba(99,102,241,0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(99,102,241,0.025) 1px, transparent 1px);
  background-size:48px 48px;
  pointer-events:none;
}

.page{
  position:relative;
  z-index:1;
  max-width:1180px;
  margin:0 auto;
  padding:clamp(16px,4vw,36px) clamp(12px,3vw,24px);
  animation:pageFade 0.5s ease forwards;
}

@keyframes pageFade{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}

/* ── Cards ── */
.card{
  background:var(--surface);
  border:1px solid var(--border);
  border-radius:var(--radius-lg);
  box-shadow:var(--shadow);
  transition:box-shadow .2s,border-color .2s;
}
.card:hover{box-shadow:var(--shadow-md);border-color:var(--border-hover)}

/* ── Header ── */
.header{
  display:flex;align-items:center;justify-content:space-between;
  padding:16px 24px;
  margin-bottom:24px;
  background:rgba(255,255,255,0.85);
  backdrop-filter:blur(12px);
  -webkit-backdrop-filter:blur(12px);
  border:1px solid rgba(234,236,240,0.8);
  border-radius:var(--radius-xl);
  box-shadow:var(--shadow);
  flex-wrap:wrap;gap:12px;
}
.brand{display:flex;align-items:center;gap:12px}
.brand-icon{
  width:38px;height:38px;
  border-radius:10px;
  background:linear-gradient(135deg,#6366F1,#8B5CF6);
  display:flex;align-items:center;justify-content:center;
  color:#fff;font-size:16px;
  box-shadow:0 4px 12px rgba(99,102,241,0.35);
}
.brand-name{
  font-family:var(--font-display);
  font-size:19px;font-weight:800;
  color:var(--text);letter-spacing:-.4px;
}
.brand-name span{color:#6366F1}
.brand-tagline{font-size:11px;color:var(--text-muted);font-weight:400;margin-top:1px}
.header-right{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.badge{
  display:inline-flex;align-items:center;gap:6px;
  padding:5px 11px;
  background:rgba(16,185,129,0.08);
  border:1px solid rgba(16,185,129,0.2);
  border-radius:100px;
  font-size:11.5px;font-weight:600;color:#059669;
}
.badge-dot{width:6px;height:6px;border-radius:50%;background:#10B981;animation:pulse 2s infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
.pill{
  display:inline-flex;align-items:center;gap:5px;
  padding:4px 10px;
  background:#EEF2FF;border:1px solid #C7D2FE;
  border-radius:100px;
  font-size:11px;font-weight:600;color:#4F46E5;
}

/* ── Buttons ── */
.btn{
  display:inline-flex;align-items:center;justify-content:center;gap:8px;
  padding:9px 18px;border-radius:var(--radius);
  border:1.5px solid transparent;
  font-family:var(--font);font-size:13.5px;font-weight:500;
  cursor:pointer;transition:all .18s;white-space:nowrap;
}
.btn-primary{
  background:#6366F1;color:#fff;border-color:#6366F1;
  box-shadow:0 1px 3px rgba(99,102,241,0.4),0 4px 12px rgba(99,102,241,0.2);
}
.btn-primary:hover:not(:disabled){background:#4F46E5;transform:translateY(-1px);box-shadow:0 2px 8px rgba(99,102,241,0.5),0 8px 24px rgba(99,102,241,0.25)}
.btn-primary:disabled{opacity:.65;cursor:not-allowed}
.btn-outline{background:var(--surface);color:var(--text-secondary);border-color:var(--border);box-shadow:var(--shadow)}
.btn-outline:hover{border-color:#6366F1;color:#6366F1;background:#F8F8FF;transform:translateY(-1px)}
.btn-outline.active{background:#EEF2FF;border-color:#6366F1;color:#4F46E5}
.btn-ghost{background:transparent;color:var(--text-secondary);border-color:transparent}
.btn-ghost:hover{background:#F1F5F9;color:var(--text)}
.btn:active{transform:scale(0.97)!important}

/* ── Upload Zone ── */
.upload-zone{
  border:2px dashed rgba(99,102,241,0.3);
  border-radius:var(--radius-lg);
  padding:clamp(28px,5vw,52px) 24px;
  text-align:center;cursor:pointer;
  transition:all .25s;
  background:linear-gradient(135deg,rgba(99,102,241,0.02),rgba(139,92,246,0.02));
  position:relative;overflow:hidden;
}
.upload-zone:hover,.upload-zone.drag{
  border-color:#6366F1;
  background:rgba(99,102,241,0.04);
  transform:translateY(-2px);
  box-shadow:var(--shadow-md);
}
.upload-zone.drag{animation:borderAnim 1.5s ease infinite}
@keyframes borderAnim{0%,100%{border-color:rgba(99,102,241,0.4)}50%{border-color:rgba(99,102,241,0.85)}}
.upload-icon-box{
  width:60px;height:60px;
  background:linear-gradient(135deg,#EEF2FF,#E0E7FF);
  border-radius:16px;
  display:flex;align-items:center;justify-content:center;
  margin:0 auto 16px;
  transition:transform .25s;
}
.upload-zone:hover .upload-icon-box{transform:scale(1.08) rotate(-4deg)}

/* ── Spinner ── */
@keyframes spin{to{transform:rotate(360deg)}}
.spin{display:inline-block;width:16px;height:16px;border-radius:50%;border:2px solid transparent;border-top-color:currentColor;border-right-color:currentColor;animation:spin .65s linear infinite;flex-shrink:0}
.spin-lg{width:38px;height:38px;border-width:3px;color:#6366F1}

/* ── Toasts ── */
.toast-stack{position:fixed;top:20px;right:20px;z-index:9999;display:flex;flex-direction:column;gap:8px;pointer-events:none}
.toast{
  display:flex;align-items:center;gap:10px;
  padding:13px 16px;border-radius:12px;
  font-size:13.5px;font-weight:500;
  pointer-events:all;min-width:270px;max-width:340px;
  animation:toastIn .35s cubic-bezier(.34,1.56,.64,1) forwards;
  box-shadow:var(--shadow-lg);border:1px solid;
}
.toast.out{animation:toastOut .28s ease forwards}
.toast.success{background:#F0FDF4;color:#166534;border-color:#BBF7D0}
.toast.error{background:#FEF2F2;color:#991B1B;border-color:#FECACA}
.toast.info{background:#EFF6FF;color:#1D4ED8;border-color:#BFDBFE}
@keyframes toastIn{from{transform:translateX(calc(100% + 20px));opacity:0}to{transform:translateX(0);opacity:1}}
@keyframes toastOut{from{transform:translateX(0);opacity:1}to{transform:translateX(calc(100% + 20px));opacity:0}}

/* ── Stat cards ── */
.stat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:22px}
.stat-card{padding:20px;position:relative;overflow:hidden}
.stat-icon{
  width:36px;height:36px;border-radius:10px;
  display:flex;align-items:center;justify-content:center;
  font-size:15px;margin-bottom:14px;flex-shrink:0;
}
.stat-icon.ind{background:#EEF2FF;color:#6366F1}
.stat-icon.sky{background:#F0F9FF;color:#0284C7}
.stat-icon.grn{background:#F0FDF4;color:#059669}
.stat-icon.amb{background:#FFFBEB;color:#D97706}
.stat-value{font-family:var(--font-display);font-size:clamp(18px,2.4vw,24px);font-weight:700;color:var(--text);letter-spacing:-.5px}
.stat-label{font-size:11.5px;font-weight:500;color:var(--text-muted);margin-top:3px;text-transform:uppercase;letter-spacing:.5px}

/* ── Section heading ── */
.sec-title{font-family:var(--font-display);font-size:14.5px;font-weight:700;color:var(--text);display:flex;align-items:center;gap:8px;letter-spacing:-.2px}
.sec-badge{display:inline-flex;align-items:center;padding:2px 8px;background:#F1F5F9;border-radius:100px;font-size:11px;font-weight:500;color:var(--text-secondary);font-family:var(--font)}

/* ── Chart toggle tabs ── */
.tab-group{display:flex;gap:2px;background:#F1F5F9;border-radius:10px;padding:4px}
.tab{padding:6px 13px;border-radius:8px;border:none;font-size:12.5px;font-weight:500;cursor:pointer;transition:all .15s;background:transparent;color:var(--text-secondary);font-family:var(--font)}
.tab.active{background:var(--surface);color:#6366F1;box-shadow:var(--shadow)}

/* ── Chart tooltip ── */
.ct{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:10px 14px;box-shadow:var(--shadow-lg);font-size:13px;font-family:var(--font)}
.ct .name{font-weight:600;color:var(--text);margin-bottom:3px;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ct .val{font-weight:500;color:#6366F1;font-family:var(--font-mono)}

/* ── Progress rows ── */
.prog-row{display:flex;align-items:center;gap:10px;margin-bottom:10px}
.prog-rank{width:24px;height:24px;border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff;flex-shrink:0}
.prog-label{font-size:12.5px;font-weight:500;color:var(--text);width:clamp(80px,20%,130px);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex-shrink:0}
.prog-track{flex:1;height:6px;background:#F1F5F9;border-radius:4px;overflow:hidden;min-width:40px}
.prog-fill{height:100%;border-radius:4px;animation:fillAnim .8s cubic-bezier(.34,1.56,.64,1) forwards}
@keyframes fillAnim{from{width:0}to{width:var(--w)}}
.prog-val{font-size:12px;font-weight:600;color:var(--text-secondary);min-width:50px;text-align:right;font-family:var(--font-mono)}

/* ── Data table ── */
.tbl-wrap{overflow-x:auto;max-height:380px;overflow-y:auto;border-radius:10px;border:1px solid var(--border)}
.tbl-wrap::-webkit-scrollbar{width:5px;height:5px}
.tbl-wrap::-webkit-scrollbar-thumb{background:#E2E8F0;border-radius:3px}
.dtable{width:100%;border-collapse:collapse;font-size:13px}
.dtable thead th{position:sticky;top:0;background:#F8FAFC;padding:9px 14px;text-align:left;font-weight:600;font-size:11px;text-transform:uppercase;letter-spacing:.5px;color:var(--text-muted);border-bottom:1px solid var(--border);white-space:nowrap;z-index:2}
.dtable tbody td{padding:9px 14px;border-bottom:1px solid rgba(0,0,0,0.035);color:var(--text-secondary);white-space:nowrap}
.dtable tbody td:first-child{font-weight:500;color:var(--text)}
.dtable tbody tr:hover td{background:rgba(99,102,241,0.025)}
.dtable tbody tr:last-child td{border-bottom:none}

/* ── Search ── */
.search-wrap{position:relative;display:inline-flex;align-items:center}
.search-icon{position:absolute;left:10px;pointer-events:none;color:var(--text-muted);font-size:13px}
.search-input{padding:8px 12px 8px 32px;border-radius:8px;border:1.5px solid var(--border);font-family:var(--font);font-size:13px;width:clamp(150px,28vw,220px);background:var(--surface);color:var(--text);outline:none;transition:all .2s}
.search-input:focus{border-color:#6366F1;box-shadow:0 0 0 3px rgba(99,102,241,0.1);width:clamp(190px,34vw,280px)}

/* ── Chat ── */
.chat-panel{position:fixed;bottom:22px;right:22px;z-index:100;width:min(380px,calc(100vw - 28px));display:flex;flex-direction:column;align-items:flex-end;gap:0}
.chat-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-xl);box-shadow:var(--shadow-lg);overflow:hidden;animation:chatUp .3s ease}
@keyframes chatUp{from{transform:translateY(16px);opacity:0}to{transform:translateY(0);opacity:1}}
.chat-hdr{
  padding:13px 16px;border-bottom:1px solid var(--border);
  display:flex;align-items:center;justify-content:space-between;
  background:linear-gradient(135deg,rgba(238,242,255,.7),rgba(237,233,254,.7));
  backdrop-filter:blur(8px);
}
.chat-av{
  width:34px;height:34px;border-radius:10px;
  background:linear-gradient(135deg,#6366F1,#8B5CF6);
  display:flex;align-items:center;justify-content:center;
  color:#fff;font-size:16px;flex-shrink:0;
}
.chat-msgs{max-height:310px;overflow-y:auto;display:flex;flex-direction:column;gap:11px;padding:15px;background:#F8FAFC}
.chat-msgs::-webkit-scrollbar{width:4px}
.chat-msgs::-webkit-scrollbar-thumb{background:#E2E8F0;border-radius:2px}
.bubble-u{background:linear-gradient(135deg,#6366F1,#7C3AED);color:#fff;border-radius:13px 13px 3px 13px;padding:9px 13px;font-size:13.5px;max-width:82%;align-self:flex-end;line-height:1.5;animation:msgIn .22s ease;box-shadow:0 2px 10px rgba(99,102,241,0.3)}
.bubble-a{background:var(--surface);border:1px solid var(--border);border-radius:13px 13px 13px 3px;padding:9px 13px;font-size:13.5px;max-width:88%;align-self:flex-start;line-height:1.6;color:var(--text);animation:msgIn .22s ease;box-shadow:var(--shadow)}
@keyframes msgIn{from{opacity:0;transform:translateY(5px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}
.insight{margin-top:8px;padding:7px 10px;background:#F0FDF4;border:1px solid #BBF7D0;border-radius:8px;font-size:12px;color:#15803D;line-height:1.5}
.suggest{margin-top:6px;padding:7px 10px;background:#EFF6FF;border:1px solid #BFDBFE;border-radius:8px;font-size:12px;color:#2563EB;line-height:1.5}
.chat-foot{padding:11px;border-top:1px solid var(--border);background:var(--surface);display:flex;gap:8px}
.chat-input{flex:1;padding:9px 13px;border-radius:9px;border:1.5px solid var(--border);outline:none;font-size:13.5px;font-family:var(--font);color:var(--text);background:#F8FAFC;transition:border-color .2s}
.chat-input:focus{border-color:#6366F1;background:var(--surface)}
.chat-send{width:36px;height:36px;border-radius:9px;border:none;background:#6366F1;color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .2s;flex-shrink:0}
.chat-send:hover:not(:disabled){background:#4F46E5;transform:scale(1.05)}
.chat-send:disabled{opacity:.55;cursor:not-allowed}

/* ── FAB ── */
.fab-wrap{display:flex;flex-direction:column;align-items:flex-end;gap:10px;margin-left:auto}
.fab-tooltip{
  background:var(--surface);
  border:1px solid var(--border);
  border-radius:14px;
  padding:11px 16px;
  box-shadow:var(--shadow-lg);
  font-size:13px;font-weight:500;color:var(--text-secondary);
  white-space:nowrap;position:relative;
  display:flex;align-items:center;gap:8px;
}
.fab-tooltip::after{
  content:'';position:absolute;bottom:-7px;right:24px;
  width:13px;height:13px;
  background:var(--surface);
  border-right:1px solid var(--border);
  border-bottom:1px solid var(--border);
  transform:rotate(45deg);
}
.fab{
  width:64px;height:64px;border-radius:20px;border:none;
  background:linear-gradient(135deg,#6366F1,#8B5CF6);
  color:#fff;cursor:pointer;
  display:flex;align-items:center;justify-content:center;
  box-shadow:0 6px 24px rgba(99,102,241,0.5),0 2px 8px rgba(139,92,246,0.3);
  animation:fabGlow 2.5s ease infinite;
  transition:transform .2s,box-shadow .2s;
  position:relative;flex-shrink:0;
}
@keyframes fabGlow{0%,100%{box-shadow:0 6px 24px rgba(99,102,241,0.45)}50%{box-shadow:0 8px 36px rgba(99,102,241,0.7)}}
.fab:hover{transform:translateY(-3px) scale(1.06)}
.fab-dot{position:absolute;top:-3px;right:-3px;width:14px;height:14px;border-radius:50%;background:#10B981;border:3px solid #F8FAFC;animation:pulse 2s infinite}

/* ── Typing ── */
@keyframes dotB{0%,80%,100%{transform:translateY(0);opacity:.3}40%{transform:translateY(-5px);opacity:1}}
.dot{display:inline-block;width:7px;height:7px;border-radius:50%;animation:dotB 1.2s ease infinite}

/* ── Loading overlay ── */
.overlay{position:absolute;inset:0;background:rgba(255,255,255,.82);backdrop-filter:blur(4px);border-radius:inherit;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:11px;z-index:10}
.overlay-text{font-size:13px;font-weight:600;color:#6366F1}

/* ── Empty state ── */
.empty{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:52px 24px;color:var(--text-muted)}
.empty i{font-size:34px;opacity:.45}

/* ── Actions row ── */
.actions{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:20px}

/* ── Instruction cards ── */
.instr-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:26px}
.instr-card{
  padding:20px;
  background:rgba(255,255,255,.7);
  backdrop-filter:blur(8px);
  border:1px solid rgba(234,236,240,.9);
  border-radius:var(--radius-lg);
  transition:all .2s;
}
.instr-card:hover{background:rgba(255,255,255,.95);box-shadow:var(--shadow-md);transform:translateY(-2px)}
.instr-num{font-family:var(--font-display);font-size:28px;font-weight:800;color:rgba(99,102,241,.15);margin-bottom:8px;line-height:1}
.instr-icon{font-size:22px;margin-bottom:12px;display:block}
.instr-title{font-family:var(--font-display);font-size:14px;font-weight:700;color:var(--text);margin-bottom:4px}
.instr-desc{font-size:12.5px;color:var(--text-secondary);line-height:1.55}

/* ── Hero section ── */
.hero{text-align:center;padding:clamp(32px,5vw,52px) 16px clamp(24px,4vw,40px);position:relative}
.hero-chip{
  display:inline-flex;align-items:center;gap:7px;
  padding:6px 14px;border-radius:100px;
  background:rgba(99,102,241,.08);border:1px solid rgba(99,102,241,.2);
  font-size:12px;font-weight:600;color:#6366F1;
  margin-bottom:20px;
}
.hero-title{
  font-family:var(--font-display);
  font-size:clamp(28px,5vw,48px);
  font-weight:800;color:var(--text);
  letter-spacing:-1.5px;line-height:1.1;
  margin-bottom:14px;
}
.hero-title span{
  background:linear-gradient(135deg,#6366F1,#8B5CF6,#0EA5E9);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
  background-clip:text;
}
.hero-sub{font-size:clamp(14px,2vw,16.5px);color:var(--text-secondary);max-width:520px;margin:0 auto 32px;line-height:1.65}

/* ── Divider ── */
.divider{height:1px;background:var(--border);margin:24px 0}

/* ── Responsive ── */
@media(max-width:900px){.stat-grid{grid-template-columns:repeat(2,1fr)}.instr-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:640px){
  .stat-grid{grid-template-columns:repeat(2,1fr)}
  .instr-grid{grid-template-columns:1fr}
  .chat-panel{bottom:0;right:0;width:100%}
  .chat-card{border-bottom-left-radius:0!important;border-bottom-right-radius:0!important}
  .header{flex-direction:column;align-items:flex-start}
  .hero-title{letter-spacing:-.8px}
}
@media(max-width:420px){.stat-grid{grid-template-columns:1fr}}

/* ── Animation stagger ── */
@keyframes slideUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
.s1{animation:slideUp .4s ease .04s both}.s2{animation:slideUp .4s ease .10s both}
.s3{animation:slideUp .4s ease .16s both}.s4{animation:slideUp .4s ease .22s both}
.s5{animation:slideUp .4s ease .28s both}.s6{animation:slideUp .4s ease .34s both}
.s7{animation:slideUp .4s ease .40s both}.s8{animation:slideUp .4s ease .46s both}

/* skeleton */
@keyframes shimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}
.skel{background:linear-gradient(90deg,#F1F5F9 25%,#F8FAFC 50%,#F1F5F9 75%);background-size:800px 100%;animation:shimmer 1.4s ease infinite;border-radius:8px}
`;

/* ─── Helpers ────────────────────────────────────────────── */
const pickKeys = (rows) => {
  if (!rows?.length) return { labelKey: null, valueKey: null };
  const keys = Object.keys(rows[0]);

  const SKIP_LABEL = ["id","sr","srno","sr_no","no","index","row","#","num","number","sno"];
  const SKIP_VALUE = ["id","sr","srno","sr_no","no","index","row","year","month","day","date","age","rank","#","num","number","sno","serial","code","pin","zip"];

  const isNumericCol = (k) => {
    const samples = rows.slice(0, 15).map(r => String(r[k] ?? "").replace(/,/g,"").trim()).filter(Boolean);
    return samples.length > 0 && samples.filter(v => !isNaN(v) && v !== "").length / samples.length > 0.85;
  };

  const isDateLike = (k) => {
    const samples = rows.slice(0, 5).map(r => String(r[k] ?? ""));
    return samples.every(v => !isNaN(Date.parse(v)) && v.length > 4);
  };

  const labelCandidates = keys.filter(k => {
    const lk = k.toLowerCase();
    if (SKIP_LABEL.some(b => lk === b)) return false;
    if (isNumericCol(k) && !isDateLike(k)) return false;
    return true;
  });

  const valueCandidates = keys.filter(k => {
    const lk = k.toLowerCase();
    if (SKIP_VALUE.some(b => lk === b || lk.includes("_id"))) return false;
    return isNumericCol(k);
  });

  const PREF = ["profit","revenue","sales","amount","price","total","income","earning","value","qty","quantity","count","cost","score","rating","turnover"];
  const labelKey = labelCandidates[0] || null;
  const valueKey = valueCandidates.find(k => PREF.some(p => k.toLowerCase().includes(p))) || valueCandidates[0] || null;

  return { labelKey, valueKey };
};

const fmt = (v) => {
  if (typeof v !== "number") return v;
  if (v >= 1_000_000) return `${(v/1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${(v/1_000).toFixed(1)}K`;
  return v.toLocaleString(undefined, { maximumFractionDigits: 1 });
};

/* ─── Custom Tooltip ─────────────────────────────────────── */
const CTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="ct">
      <div className="name">{label}</div>
      <div className="val">{typeof payload[0].value === "number" ? fmt(payload[0].value) : payload[0].value}</div>
    </div>
  );
};

/* ─── Toast system ───────────────────────────────────────── */
let tid = 0;
function Toasts({ toasts, remove }) {
  return <div className="toast-stack">{toasts.map(t => <Toast key={t.id} {...t} onDone={() => remove(t.id)} />)}</div>;
}
function Toast({ message, type, onDone }) {
  const [out, setOut] = useState(false);
  useEffect(() => { const t = setTimeout(() => setOut(true), 2800); return () => clearTimeout(t); }, []);
  useEffect(() => { if (out) { const t = setTimeout(onDone, 280); return () => clearTimeout(t); } }, [out]);
  const ico = { success: "fa-circle-check", error: "fa-circle-xmark", info: "fa-circle-info" };
  return (
    <div className={`toast ${type} ${out ? "out" : ""}`}>
      <i className={`fa-solid ${ico[type] || ico.info}`} style={{ fontSize: 16 }} />
      <span style={{ flex: 1 }}>{message}</span>
    </div>
  );
}

/* ─── Typing indicator ───────────────────────────────────── */
const Typing = () => (
  <div style={{ display: "flex", gap: 5, alignItems: "center", padding: "3px 0" }}>
    {["#6366F1","#8B5CF6","#0EA5E9"].map((c, i) => (
      <span key={i} className="dot" style={{ background: c, animationDelay: `${i * 0.18}s` }} />
    ))}
  </div>
);

/* ─── Pie Legend (custom, only top-N) ────────────────────── */
const PieLegend = ({ data }) => {
  const show = data.slice(0, 8);
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 14px", justifyContent: "center", marginTop: 12 }}>
      {show.map((d, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS[i % COLORS.length], flexShrink: 0 }} />
          <span style={{ color: "var(--text-secondary)", maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.name}</span>
        </div>
      ))}
      {data.length > 8 && <span style={{ fontSize: 11.5, color: "var(--text-muted)" }}>+{data.length - 8} more</span>}
    </div>
  );
};

/* ─── Chart renderer ─────────────────────────────────────── */
const Chart = ({ type, data: raw, height = 270 }) => {
  // For pie: collapse tail into "Others" when > 12 items
  const pieData = useMemo(() => {
    if (raw.length <= 10) return raw;
    const sorted = [...raw].sort((a, b) => b.value - a.value);
    const top = sorted.slice(0, 9);
    const rest = sorted.slice(9).reduce((s, d) => s + d.value, 0);
    return [...top, { name: "Others", value: rest }];
  }, [raw]);

  const barData = useMemo(() => {
    if (raw.length <= 30) return raw;
    return [...raw].sort((a, b) => b.value - a.value).slice(0, 30);
  }, [raw]);

  const scrollW = Math.max(barData.length * 88, 420);

  if (type === "pie") {
    const showLegend = pieData.length <= 10;
    return (
      <div>
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie data={pieData} dataKey="value" nameKey="name"
              outerRadius={Math.min(height * 0.4, 108)}
              innerRadius={Math.min(height * 0.2, 54)}
              paddingAngle={2}
              label={false}
            >
              {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip content={<CTip />} />
          </PieChart>
        </ResponsiveContainer>
        <PieLegend data={pieData} />
      </div>
    );
  }

  if (type === "line") {
    return (
      <div style={{ overflowX: "auto" }}>
        <AreaChart width={scrollW} height={height} data={raw} style={{ fontFamily: "var(--font)" }}>
          <defs>
            <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366F1" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
          <XAxis dataKey="name" interval={0} angle={-28} textAnchor="end" tick={{ fontSize: 11, fontFamily: "var(--font)" }} height={58} />
          <YAxis tick={{ fontSize: 11 }} tickFormatter={fmt} />
          <Tooltip content={<CTip />} />
          <Area type="monotone" dataKey="value" stroke="#6366F1" strokeWidth={2.5} fill="url(#ag)" dot={{ fill: "#8B5CF6", r: 3.5, strokeWidth: 0 }} />
        </AreaChart>
      </div>
    );
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <BarChart width={scrollW} height={height} data={barData} style={{ fontFamily: "var(--font)" }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
        <XAxis dataKey="name" interval={0} angle={-28} textAnchor="end" tick={{ fontSize: 11, fontFamily: "var(--font)" }} height={58} />
        <YAxis tick={{ fontSize: 11 }} tickFormatter={fmt} />
        <Tooltip content={<CTip />} />
        <Bar dataKey="value" radius={[5, 5, 0, 0]} maxBarSize={48}>
          {barData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Bar>
      </BarChart>
    </div>
  );
};

/* ─── Main App ───────────────────────────────────────────── */
export default function App() {
  /* ── state ── */
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);

  const [toasts, setToasts] = useState([]);
  const toast = useCallback((msg, type = "info") => {
    const id = ++tid;
    setToasts(p => [...p, { id, message: msg, type }]);
  }, []);
  const rmToast = useCallback((id) => setToasts(p => p.filter(t => t.id !== id)), []);

  const [chat, setChat] = useState([]);
  const [query, setQuery] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const [chartTab, setChartTab] = useState("bar");
  const [chartLoading, setChartLoading] = useState(false);

  const [showBar, setShowBar] = useState(false);
  const [showPie, setShowPie] = useState(false);
  const [showTop5, setShowTop5] = useState(false);
  const [showBot5, setShowBot5] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [search, setSearch] = useState("");

  const chatRef = useRef(null);
  const fileRef = useRef(null);
  const top5Ref = useRef(null);
  const bot5Ref = useRef(null);

  /* ── inject FA ── */
  useEffect(() => {
    if (!document.querySelector(`link[href="${FA_CDN}"]`)) {
      const l = document.createElement("link");
      l.rel = "stylesheet"; l.href = FA_CDN;
      document.head.appendChild(l);
    }
  }, []);

  /* ── scroll chat ── */
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [chat, chatLoading]);

  /* ── upload ── */
  const handleUpload = async () => {
    if (!file) { toast("Please select a CSV file first", "error"); return; }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/upload`, { method: "POST", body: fd });
      if (!res.ok) throw new Error();
      const result = await res.json();
      setData(result.data);
      setLoaded(true);
      setChat([]);
      toast(`Loaded ${result.data.length.toLocaleString()} rows successfully`, "success");
    } catch {
      toast("Upload failed — check your server connection.", "error");
    } finally {
      setUploading(false);
    }
  };

  /* ── ask AI ── */
  const askAI = async () => {
    const q = query.trim();
    if (!q) return;
    setChat(p => [...p, { type: "user", text: q }]);
    setQuery("");
    setChatLoading(true);
    setChartLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q, data })
      });
      if (!res.ok) throw new Error();
      const r = await res.json();
      setChat(p => [...p, { type: "ai", text: r.answer, insight: r.insight, suggestion: r.suggestion, labels: r.labels, values: r.values, chartType: r.chartType }]);
    } catch {
      setChat(p => [...p, { type: "ai", text: "Sorry, something went wrong. Please try again." }]);
    } finally {
      setChatLoading(false);
      setChartLoading(false);
    }
  };

  /* ── derived data ── */
  const { labelKey, valueKey } = useMemo(() => pickKeys(data), [data]);

  const fullChart = useMemo(() => data.map((row, i) => ({
    name: (labelKey ? String(row[labelKey] ?? "") : `Item ${i + 1}`).slice(0, 26),
    value: Number(String(row[valueKey] ?? 0).replace(/,/g, "")) || 0
  })), [data, labelKey, valueKey]);

  const lastAI = useMemo(() => [...chat].reverse().find(m => m.type === "ai"), [chat]);
  const aiChart = useMemo(() => (lastAI?.labels || []).map((l, i) => ({
    name: String(l).slice(0, 26),
    value: Number(lastAI.values?.[i]) || 0
  })), [lastAI]);

  const displayChart = aiChart.length > 0 ? aiChart : fullChart;
  const activeType = lastAI?.chartType || chartTab;

  const top5 = useMemo(() => [...fullChart].sort((a, b) => b.value - a.value).slice(0, 5), [fullChart]);
  const bot5 = useMemo(() => [...fullChart].sort((a, b) => a.value - b.value).slice(0, 5), [fullChart]);
  const maxVal = useMemo(() => Math.max(...fullChart.map(d => d.value), 1), [fullChart]);
  const totalVal = useMemo(() => fullChart.reduce((s, d) => s + d.value, 0), [fullChart]);

  const stats = [
    { label: "Total Rows", value: data.length.toLocaleString(), icon: "fa-table-rows", cls: "ind" },
    { label: "Columns", value: data[0] ? Object.keys(data[0]).length : 0, icon: "fa-table-columns", cls: "sky" },
    { label: "Total Value", value: totalVal > 0 ? fmt(totalVal) : "—", icon: "fa-coins", cls: "grn" },
    { label: "Value Field", value: valueKey || "—", icon: "fa-key", cls: "amb" },
  ];

  const filtered = useMemo(() => data.filter(row =>
    Object.values(row).some(v => String(v).toLowerCase().includes(search.toLowerCase()))
  ), [data, search]);

  const instructions = [
    { num: "01", icon: "fa-file-csv", iconColor: "#6366F1", title: "Upload your CSV", desc: "Drag & drop or click to browse. Supports files up to 50MB with any column structure." },
    { num: "02", icon: "fa-chart-column", iconColor: "#0EA5E9", title: "Explore visuals", desc: "Instant bar, line, and pie charts. View top & bottom performers with animated progress bars." },
    { num: "03", icon: "fa-sparkles", iconColor: "#10B981", title: "Chat with AI", desc: "Ask natural language questions — get insights, trends, and AI-generated chart annotations." },
  ];

  return (
    <>
      <style>{CSS}</style>
      <Toasts toasts={toasts} remove={rmToast} />

      <div className="page">
        {/* ── Header ── */}
        <header className="header s1">
          <div className="brand">
            <div className="brand-icon"><i className="fa-solid fa-chart-line" /></div>
            <div>
              <div className="brand-name">Analytica<span>AI</span></div>
              <div className="brand-tagline">Intelligent Data Platform</div>
            </div>
          </div>
          <div className="header-right">
            <div className="badge"><span className="badge-dot" />All systems operational</div>
            {loaded && <div className="pill"><i className="fa-solid fa-database" style={{ fontSize: 10 }} />{data.length.toLocaleString()} rows</div>}
          </div>
        </header>

        {/* ── Hero (before upload) ── */}
        {!loaded && (
          <>
            <div className="hero s2">
              <div className="hero-chip">
                <i className="fa-solid fa-bolt" />
                Powered by Claude AI
              </div>
              <h1 className="hero-title">Turn raw data into<br /><span>intelligent insights</span></h1>
              <p className="hero-sub">Upload any CSV file and instantly explore interactive charts, AI-driven analysis, and natural-language insights — no coding required.</p>
            </div>

            {/* Instructions */}
            <div className="instr-grid s3">
              {instructions.map((c, i) => (
                <div className="instr-card" key={i}>
                  <div className="instr-num">{c.num}</div>
                  <i className={`fa-solid ${c.icon} instr-icon`} style={{ color: c.iconColor }} aria-hidden="true" />
                  <div className="instr-title">{c.title}</div>
                  <div className="instr-desc">{c.desc}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── Upload Card ── */}
        <div className="card s4" style={{ padding: "clamp(16px,3vw,26px)", marginBottom: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <span className="sec-title">
              <i className="fa-solid fa-upload" style={{ color: "#6366F1", fontSize: 14 }} />
              Upload Data
            </span>
          </div>
          <div
            className={`upload-zone ${dragging ? "drag" : ""}`}
            onClick={() => fileRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files?.[0]; if (f?.name.endsWith(".csv")) setFile(f); else toast("Only .csv files supported", "error"); }}
          >
            <input ref={fileRef} type="file" accept=".csv" style={{ display: "none" }} onChange={e => { const f = e.target.files?.[0]; if (f) setFile(f); }} />
            <div className="upload-icon-box">
              <i className="fa-solid fa-file-csv" style={{ fontSize: 26, color: "#6366F1" }} />
            </div>
            <p style={{ fontWeight: 600, fontSize: 15, color: file ? "#6366F1" : "var(--text)", marginBottom: 5 }}>
              {file ? <><i className="fa-solid fa-circle-check" style={{ color: "#10B981" }} /> {file.name}</> : "Drop your CSV here, or click to browse"}
            </p>
            <p style={{ fontSize: 12.5, color: "var(--text-muted)" }}>
              {file ? `${(file.size / 1024).toFixed(1)} KB — Ready to upload` : "Supports .csv files up to 50MB"}
            </p>
          </div>
          <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="btn btn-primary" onClick={handleUpload} disabled={uploading} style={{ flex: "1 1 160px" }}>
              {uploading ? <><span className="spin" /> Uploading…</> : <><i className="fa-solid fa-rocket" /> Upload & Analyze</>}
            </button>
            {file && (
              <button className="btn btn-outline" onClick={() => { setFile(null); if (fileRef.current) fileRef.current.value = ""; }}>
                <i className="fa-solid fa-xmark" /> Clear
              </button>
            )}
          </div>
        </div>

        {/* ── Post-upload ── */}
        {loaded && (
          <>
            {/* Stats */}
            <div className="stat-grid">
              {stats.map((s, i) => (
                <div key={i} className={`card stat-card s${i + 2}`}>
                  <div className={`stat-icon ${s.cls}`}><i className={`fa-solid ${s.icon}`} /></div>
                  <div className="stat-value">{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Main AI Chart */}
            <div className="card s6" style={{ padding: "clamp(14px,2.5vw,22px)", marginBottom: 20, position: "relative" }}>
              {chartLoading && (
                <div className="overlay">
                  <span className="spin spin-lg" />
                  <div className="overlay-text">Generating chart…</div>
                </div>
              )}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 18 }}>
                <span className="sec-title">
                  <i className="fa-solid fa-chart-column" style={{ color: "#6366F1", fontSize: 15 }} />
                  AI Chart
                  {aiChart.length > 0 && <span className="sec-badge"><i className="fa-solid fa-sparkles" style={{ fontSize: 10, color: "#F59E0B" }} /> AI Generated</span>}
                </span>
                <div className="tab-group">
                  {[["bar","fa-chart-bar"],["line","fa-chart-line"],["pie","fa-chart-pie"]].map(([t, ic]) => (
                    <button key={t} className={`tab ${chartTab === t ? "active" : ""}`} onClick={() => setChartTab(t)}>
                      <i className={`fa-solid ${ic}`} style={{ marginRight: 5, fontSize: 12 }} />
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              {displayChart.length === 0 ? (
                <div className="empty">
                  <i className="fa-solid fa-comment-dots" />
                  <p style={{ fontWeight: 600, fontSize: 14, color: "var(--text-secondary)" }}>No chart yet</p>
                  <p style={{ fontSize: 13 }}>Ask AI a question to generate a chart</p>
                </div>
              ) : <Chart type={activeType} data={displayChart} />}
            </div>

            {/* Action row */}
            <div className="actions s7">
              {[
                { label: "Bar Chart", icon: "fa-chart-bar", st: showBar, set: setShowBar },
                { label: "Pie Chart", icon: "fa-chart-pie", st: showPie, set: setShowPie },
                { label: "Top 5", icon: "fa-trophy", st: showTop5, set: (v) => { setShowTop5(v); if (v) setTimeout(() => top5Ref.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 120); } },
                { label: "Bottom 5", icon: "fa-arrow-trend-down", st: showBot5, set: (v) => { setShowBot5(v); if (v) setTimeout(() => bot5Ref.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 120); } },
                { label: "Data Table", icon: "fa-table", st: showTable, set: setShowTable },
              ].map(({ label, icon, st, set }) => (
                <button key={label} className={`btn btn-outline ${st ? "active" : ""}`} onClick={() => set(!st)} style={{ fontSize: 13 }}>
                  <i className={`fa-solid ${icon}`} style={{ fontSize: 12 }} />
                  {st ? `Hide ${label}` : `Show ${label}`}
                </button>
              ))}
            </div>

            {/* Bar */}
            {showBar && (
              <div className="card s1" style={{ padding: "clamp(14px,2.5vw,22px)", marginBottom: 18 }}>
                <div style={{ marginBottom: 16 }}>
                  <span className="sec-title"><i className="fa-solid fa-chart-bar" style={{ color: "#6366F1", fontSize: 14 }} /> Bar Chart — {valueKey || "Value"} by {labelKey || "Item"}</span>
                </div>
                <Chart type="bar" data={displayChart} />
              </div>
            )}

            {/* Pie */}
            {showPie && (
              <div className="card s1" style={{ padding: "clamp(14px,2.5vw,22px)", marginBottom: 18 }}>
                <div style={{ marginBottom: 16 }}>
                  <span className="sec-title"><i className="fa-solid fa-chart-pie" style={{ color: "#0EA5E9", fontSize: 14 }} /> Pie Chart — Distribution</span>
                  {fullChart.length > 10 && <span className="sec-badge" style={{ marginLeft: 8 }}>Top 9 + Others shown</span>}
                </div>
                <Chart type="pie" data={displayChart} />
              </div>
            )}

            {/* Top 5 */}
            {showTop5 && (
              <div ref={top5Ref} className="card s1" style={{ padding: "clamp(14px,2.5vw,22px)", marginBottom: 18 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
                  <span className="sec-title"><i className="fa-solid fa-trophy" style={{ color: "#F59E0B", fontSize: 14 }} /> Top 5 Highest — {valueKey || "Value"}</span>
                  <span className="pill" style={{ background: "#F0FDF4", borderColor: "#BBF7D0", color: "#15803D" }}><i className="fa-solid fa-arrow-up" style={{ fontSize: 10 }} /> Best</span>
                </div>
                {top5.map((item, i) => {
                  const pct = maxVal > 0 ? (item.value / maxVal) * 100 : 0;
                  return (
                    <div key={i} className="prog-row">
                      <span className="prog-rank" style={{ background: COLORS[i] }}>{i + 1}</span>
                      <span className="prog-label">{item.name}</span>
                      <div className="prog-track">
                        <div className="prog-fill" style={{ "--w": `${pct}%`, background: COLORS[i] }} />
                      </div>
                      <span className="prog-val">{fmt(item.value)}</span>
                    </div>
                  );
                })}
                <div style={{ marginTop: 16 }}><Chart type="bar" data={top5} height={200} /></div>
              </div>
            )}

            {/* Bottom 5 */}
            {showBot5 && (
              <div ref={bot5Ref} className="card s1" style={{ padding: "clamp(14px,2.5vw,22px)", marginBottom: 18 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
                  <span className="sec-title"><i className="fa-solid fa-arrow-trend-down" style={{ color: "#EC4899", fontSize: 14 }} /> Bottom 5 Lowest — {valueKey || "Value"}</span>
                  <span className="pill" style={{ background: "#FEF2F2", borderColor: "#FECACA", color: "#991B1B" }}><i className="fa-solid fa-triangle-exclamation" style={{ fontSize: 10 }} /> Needs attention</span>
                </div>
                {bot5.map((item, i) => {
                  const pct = maxVal > 0 ? (item.value / maxVal) * 100 : 0;
                  return (
                    <div key={i} className="prog-row">
                      <span className="prog-rank" style={{ background: "#EC4899" }}>{i + 1}</span>
                      <span className="prog-label">{item.name}</span>
                      <div className="prog-track">
                        <div className="prog-fill" style={{ "--w": `${pct}%`, background: "#EC4899", opacity: 0.75 - i * 0.08 }} />
                      </div>
                      <span className="prog-val">{fmt(item.value)}</span>
                    </div>
                  );
                })}
                <div style={{ marginTop: 16 }}><Chart type="bar" data={bot5} height={200} /></div>
              </div>
            )}

            {/* Table */}
            {showTable && data.length > 0 && (
              <div className="card s1" style={{ padding: "clamp(14px,2.5vw,22px)", marginBottom: 18 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 14 }}>
                  <span className="sec-title"><i className="fa-solid fa-table" style={{ color: "#6366F1", fontSize: 14 }} /> Data Table</span>
                  <div className="search-wrap">
                    <i className="fa-solid fa-magnifying-glass search-icon" />
                    <input className="search-input" type="text" placeholder="Search rows…" value={search} onChange={e => setSearch(e.target.value)} />
                  </div>
                </div>
                <div className="tbl-wrap">
                  <table className="dtable">
                    <thead><tr>{Object.keys(data[0]).map(k => <th key={k}>{k}</th>)}</tr></thead>
                    <tbody>
                      {filtered.slice(0, 200).map((row, i) => (
                        <tr key={i}>{Object.values(row).map((v, j) => <td key={j}>{String(v)}</td>)}</tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 10, fontFamily: "var(--font-mono)" }}>
                  Showing {Math.min(filtered.length, 200)} of {filtered.length} rows{filtered.length < data.length ? ` (filtered from ${data.length})` : ""}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Chat Panel ── */}
      {loaded && (
        <div className="chat-panel">
          {!chatOpen ? (
            <div className="fab-wrap">
              <div className="fab-tooltip">
                <i className="fa-solid fa-circle" style={{ fontSize: 8, color: "#10B981" }} />
                <span>Ask me anything about your data</span>
              </div>
              <button className="fab" onClick={() => setChatOpen(true)} title="Open AI Chat">
                <span className="fab-dot" />
                <i className="fa-solid fa-comments" style={{ fontSize: 28 }} />
              </button>
            </div>
          ) : (
            <div className="chat-card">
              <div className="chat-hdr">
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div className="chat-av"><i className="fa-solid fa-chart-simple" /></div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>Analytica AI</p>
                    <p style={{ fontSize: 11, color: "#059669", fontWeight: 500 }}>
                      <i className="fa-solid fa-circle" style={{ fontSize: 7, marginRight: 4 }} />Ready to analyze
                    </p>
                  </div>
                </div>
                <button className="btn btn-ghost" onClick={() => setChatOpen(false)} style={{ padding: "6px 10px" }}>
                  <i className="fa-solid fa-xmark" />
                </button>
              </div>

              <div ref={chatRef} className="chat-msgs">
                {chat.length === 0 && (
                  <div style={{ textAlign: "center", padding: "14px 0" }}>
                    <i className="fa-solid fa-chart-line" style={{ fontSize: 26, color: "#6366F1", marginBottom: 10, display: "block" }} />
                    <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>Ask me anything about your data</p>
                    <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>e.g. "What is the top product by sales?"</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12, justifyContent: "center" }}>
                      {["Show top products", "What's the average?", "Any trends?"].map(s => (
                        <button key={s} onClick={() => setQuery(s)} style={{
                          padding: "5px 10px", borderRadius: 8, border: "1.5px solid var(--border)",
                          background: "var(--surface)", fontSize: 11.5, fontWeight: 500,
                          color: "var(--text-secondary)", cursor: "pointer", fontFamily: "var(--font)"
                        }}>{s}</button>
                      ))}
                    </div>
                  </div>
                )}
                {chat.map((msg, i) => (
                  <div key={i} style={{ display: "flex", flexDirection: "column" }}>
                    {msg.type === "user"
                      ? <div className="bubble-u">{msg.text}</div>
                      : <div className="bubble-a">
                          <p style={{ lineHeight: 1.6 }}>{msg.text}</p>
                          {msg.insight && <div className="insight"><i className="fa-solid fa-lightbulb" style={{ marginRight: 5 }} />{msg.insight}</div>}
                          {msg.suggestion && <div className="suggest"><i className="fa-solid fa-arrow-right" style={{ marginRight: 5 }} />{msg.suggestion}</div>}
                        </div>
                    }
                  </div>
                ))}
                {chatLoading && <div className="bubble-a"><Typing /></div>}
              </div>

              <div className="chat-foot">
                <input
                  className="chat-input"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && !e.shiftKey && askAI()}
                  placeholder="Ask about your data…"
                  disabled={chatLoading}
                />
                <button className="chat-send" onClick={askAI} disabled={chatLoading || !query.trim()}>
                  {chatLoading
                    ? <span className="spin" />
                    : <i className="fa-solid fa-paper-plane" style={{ fontSize: 13 }} />
                  }
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
