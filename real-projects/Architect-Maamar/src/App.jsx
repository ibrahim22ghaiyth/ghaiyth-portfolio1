import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Globe, Moon, Sun, Sparkles, ArrowRight, ArrowLeft, Check, X, HelpCircle,
  Wand2, Lightbulb, FileText, Database, Shield, Layers, Route, DollarSign,
  Clock, Rocket, Download, Printer, Copy, Save, BookOpen, Menu,
  Plus, Trash2, Send, Loader2, Gauge, Code2, User, Briefcase, GraduationCap,
  Settings2, ListChecks, PanelRight, Compass, CircleHelp, Hammer, RotateCcw
} from "lucide-react";

/* ============================================================
   مِعمار · Architect — "the workshop": plan before you build.
   Identity: emerald ink + warm coral, light-first, mobile-first.
   Real AI assistant via a server-side endpoint (Groq), so the API
   key never reaches the browser.
   ============================================================ */

const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,600;12..96,700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Cairo:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap');

:root{
  --bg:#eef2ee; --paper:#ffffff; --paper2:#f3f7f3; --raise:#ffffff;
  --ink:#0f241c; --muted:#5a7068; --faint:#90a59c;
  --line:#dfe7e1; --line2:#c7d4cb;
  --brand:#0b9b6e; --brand2:#077a56; --brandSoft:#dff3ea;
  --ai:#f26d3d; --ai2:#df5526; --aiSoft:#fde7dd;
  --ok:#0b9b6e; --warn:#e08a00; --bad:#e0526b;
  --shadow:0 1px 0 var(--line), 0 12px 30px -18px rgba(15,36,28,.35);
  --shadowUp:0 -8px 30px -16px rgba(15,36,28,.25);
  --fEn:'Bricolage Grotesque',sans-serif; --fBody:'Plus Jakarta Sans',sans-serif;
  --fMono:'Space Mono',monospace; --fAr:'Cairo',sans-serif;
  --r:16px; --rs:12px;
}
[data-theme="dark"]{
  --bg:#07120e; --paper:#0e1c16; --paper2:#11231b; --raise:#13271e;
  --ink:#e8f0ea; --muted:#93aaa0; --faint:#5f766c;
  --line:#1c3328; --line2:#27442f;
  --brand:#2ad59f; --brand2:#19b083; --brandSoft:#10362a;
  --ai:#fb8a52; --ai2:#f26d3d; --aiSoft:#3a2117;
  --ok:#2ad59f; --warn:#f0b13a; --bad:#fb7185;
  --shadow:0 1px 0 var(--line), 0 16px 36px -20px rgba(0,0,0,.6);
  --shadowUp:0 -10px 34px -16px rgba(0,0,0,.5);
}
*{box-sizing:border-box}
html,body{margin:0}
.pb{ min-height:100vh; background:var(--bg); color:var(--ink); font-family:var(--fBody);
  position:relative; overflow-x:hidden; -webkit-font-smoothing:antialiased; transition:background .3s,color .3s; }
.pb[dir="rtl"]{ font-family:var(--fAr); }
.disp{ font-family:var(--fEn); letter-spacing:-.02em; line-height:1.05; }
.pb[dir="rtl"] .disp{ font-family:var(--fAr); letter-spacing:0; line-height:1.25; font-weight:700; }
.mono{ font-family:var(--fMono); }
.eyebrow{ font-family:var(--fMono); font-size:11px; letter-spacing:.14em; text-transform:uppercase; color:var(--brand); }
button{ font-family:inherit; cursor:pointer; border:none; background:none; color:inherit; }

/* ---------- header ---------- */
.hd{ position:sticky; top:0; z-index:40; display:flex; align-items:center; gap:8px;
  padding:11px 14px; background:color-mix(in srgb,var(--bg) 82%,transparent);
  backdrop-filter:blur(12px); border-bottom:1px solid var(--line); }
.brand{ display:flex; align-items:center; gap:9px; font-family:var(--fEn); font-weight:700; font-size:16px; }
.pb[dir="rtl"] .brand{ font-family:var(--fAr); }
.brand .mk{ width:32px; height:32px; border-radius:10px; display:grid; place-items:center; color:#fff; flex:none;
  background:linear-gradient(135deg,var(--brand),var(--ai)); box-shadow:0 6px 16px -6px var(--brand); }
.brand .bname{ font-size:18px; font-weight:700; }
.pb[dir="rtl"] .brand .bname{ font-size:19px; }
.sp{ flex:1 }
.htbtn{ height:38px; padding:0 12px; border-radius:11px; display:inline-flex; align-items:center; gap:7px;
  background:var(--paper); border:1px solid var(--line); font-size:13px; font-weight:600; transition:.15s; }
.htbtn:hover{ border-color:var(--line2); }
.htico{ width:38px; padding:0; justify-content:center; }

.wrap{ max-width:760px; margin:0 auto; padding:18px 14px 130px; }
@media(min-width:640px){ .wrap{ padding:26px 22px 60px; } }

/* ---------- welcome ---------- */
.hero{ text-align:center; padding:24px 4px 6px; }
@media(min-width:640px){ .hero{ padding:40px 8px 6px; } }
.kick{ display:inline-flex; align-items:center; gap:7px; padding:6px 12px; border-radius:99px;
  background:var(--brandSoft); color:var(--brand2); font-size:12px; font-weight:700; }
[data-theme="dark"] .kick{ color:var(--brand); }
.hero h1{ font-family:var(--fEn); font-size:clamp(30px,8.5vw,56px); margin:16px 0 0; letter-spacing:-.03em; line-height:1.02; }
.pb[dir="rtl"] .hero h1{ font-family:var(--fAr); letter-spacing:0; line-height:1.22; }
.hero h1 .hl{ position:relative; white-space:nowrap; color:var(--brand2); }
[data-theme="dark"] .hero h1 .hl{ color:var(--brand); }
.hero h1 .hl::after{ content:""; position:absolute; left:-2%; right:-2%; bottom:6%; height:30%;
  background:var(--ai); opacity:.22; border-radius:6px; z-index:-1; transform:rotate(-1deg); }
.hero p{ color:var(--muted); max-width:540px; margin:16px auto 0; font-size:15px; line-height:1.7; }

.opts{ display:flex; flex-direction:column; gap:16px; margin-top:26px; }
@media(min-width:560px){ .opts{ flex-direction:row; justify-content:center; gap:26px; } }
.optblk{ text-align:center; }
.optlab{ font-family:var(--fMono); font-size:11px; letter-spacing:.12em; text-transform:uppercase; color:var(--faint); margin-bottom:9px; }
.seg{ display:inline-flex; gap:6px; flex-wrap:wrap; justify-content:center; }
.pill{ padding:9px 14px; border-radius:99px; background:var(--paper); border:1px solid var(--line);
  font-size:13px; font-weight:600; display:inline-flex; align-items:center; gap:7px; transition:.15s; min-height:40px; }
.pill:hover{ border-color:var(--line2); }
.pill.on{ background:var(--brand); border-color:var(--brand); color:#fff; }
.pill.ai.on{ background:var(--ai); border-color:var(--ai); }

.askq{ text-align:center; margin:34px 0 16px; }
.askq h2{ font-family:var(--fEn); font-size:clamp(20px,5vw,28px); margin:8px 0 0; letter-spacing:-.02em; }
.pb[dir="rtl"] .askq h2{ font-family:var(--fAr); letter-spacing:0; }

.grid{ display:grid; grid-template-columns:repeat(2,1fr); gap:11px; }
@media(min-width:560px){ .grid{ grid-template-columns:repeat(3,1fr); gap:13px; } }
@media(min-width:880px){ .grid{ grid-template-columns:repeat(4,1fr); } }
.card{ position:relative; text-align:start; padding:16px 14px; border-radius:var(--r);
  background:var(--paper); border:1px solid var(--line); box-shadow:var(--shadow); transition:.18s; }
.card:hover,.card:active{ border-color:var(--brand); transform:translateY(-2px); }
.card .ic{ width:42px; height:42px; border-radius:12px; display:grid; place-items:center;
  background:var(--brandSoft); color:var(--brand2); margin-bottom:12px; }
[data-theme="dark"] .card .ic{ color:var(--brand); }
.card h3{ margin:0; font-size:14.5px; font-weight:700; line-height:1.25; }
.card small{ display:block; color:var(--muted); font-size:12px; line-height:1.45; margin-top:5px; }
.card .n{ position:absolute; top:13px; inset-inline-end:14px; font-family:var(--fMono); font-size:11px; color:var(--faint); }

/* ---------- studio (builder) ---------- */
.strip{ position:sticky; top:61px; z-index:30; margin:0 -14px 14px; padding:10px 14px;
  background:color-mix(in srgb,var(--bg) 86%,transparent); backdrop-filter:blur(10px);
  border-bottom:1px solid var(--line); }
@media(min-width:640px){ .strip{ margin:0 0 18px; border:1px solid var(--line); border-radius:14px; top:74px; padding:12px 14px; } }
.blocks{ display:flex; gap:4px; }
.blocks i{ flex:1; height:6px; border-radius:99px; background:var(--line); transition:.4s; }
.blocks i.done{ background:var(--brand); }
.blocks i.now{ background:var(--ai); box-shadow:0 0 0 3px var(--aiSoft); }
.striprow{ display:flex; align-items:center; gap:10px; margin-top:10px; }
.stepmenu{ display:inline-flex; align-items:center; gap:8px; font-weight:700; font-size:14px; }
.stepmenu .c{ font-family:var(--fMono); font-size:11px; color:var(--ai); background:var(--aiSoft);
  border-radius:7px; padding:3px 7px; }
.jump{ margin-inline-start:auto; height:36px; padding:0 12px; border-radius:10px; display:inline-flex;
  align-items:center; gap:7px; background:var(--paper); border:1px solid var(--line); font-size:12.5px; font-weight:600; }

.panel{ background:var(--paper); border:1px solid var(--line); border-radius:var(--r); padding:18px 16px; box-shadow:var(--shadow); }
@media(min-width:640px){ .panel{ padding:26px 24px; } }
.sechead{ display:flex; gap:13px; align-items:flex-start; }
.sechead .ic{ width:46px; height:46px; border-radius:13px; flex:none; display:grid; place-items:center;
  background:var(--brandSoft); color:var(--brand2); }
[data-theme="dark"] .sechead .ic{ color:var(--brand); }
.sechead h2{ font-family:var(--fEn); font-size:clamp(19px,5vw,24px); margin:3px 0 0; letter-spacing:-.01em; }
.pb[dir="rtl"] .sechead h2{ font-family:var(--fAr); letter-spacing:0; }
.sechead .eyebrow{ font-size:10.5px; }
.sechead p{ margin:5px 0 0; color:var(--muted); font-size:13px; line-height:1.55; }
.reviewbtn{ flex:none; }

.field{ margin-top:22px; }
.flab{ display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
.flab b{ font-weight:700; font-size:14.5px; }
.tip{ display:inline-flex; align-items:center; gap:4px; font-size:11px; color:var(--faint);
  background:var(--paper2); border:1px solid var(--line); border-radius:99px; padding:3px 9px; cursor:help; }
.aibtns{ display:flex; flex-wrap:wrap; gap:6px; margin-top:10px; }
.aibtn{ display:inline-flex; align-items:center; gap:6px; font-size:12px; font-weight:600; padding:7px 11px;
  border-radius:99px; background:var(--aiSoft); color:var(--ai2); border:1px solid transparent; transition:.15s; min-height:34px; }
[data-theme="dark"] .aibtn{ color:var(--ai); }
.aibtn:hover{ border-color:var(--ai); }

.in{ width:100%; background:var(--paper2); border:1.5px solid var(--line); border-radius:var(--rs);
  padding:13px 14px; color:var(--ink); font-size:15px; font-family:inherit; outline:none; transition:.15s; margin-top:10px; }
.in:focus{ border-color:var(--brand); background:var(--paper); box-shadow:0 0 0 4px var(--brandSoft); }
textarea.in{ resize:vertical; min-height:96px; line-height:1.6; }

.choices{ display:flex; flex-wrap:wrap; gap:8px; margin-top:10px; }
.ch{ padding:10px 14px; border-radius:99px; background:var(--paper2); border:1.5px solid var(--line);
  font-size:13.5px; font-weight:600; display:inline-flex; align-items:center; gap:7px; transition:.15s; min-height:42px; }
.ch:hover{ border-color:var(--line2); }
.ch.on{ background:var(--brandSoft); border-color:var(--brand); color:var(--brand2); }
[data-theme="dark"] .ch.on{ color:var(--brand); }

.lrow{ display:flex; gap:8px; margin-top:8px; align-items:center; }
.lrow .in{ margin-top:0; flex:1; }
.del{ width:46px; height:46px; flex:none; border-radius:var(--rs); background:var(--paper2);
  border:1.5px solid var(--line); color:var(--faint); display:grid; place-items:center; transition:.15s; }
.del:hover{ color:var(--bad); border-color:var(--bad); }
.add{ display:inline-flex; align-items:center; gap:7px; font-size:13.5px; font-weight:600; color:var(--brand2);
  background:var(--brandSoft); border:1.5px dashed var(--brand); border-radius:var(--rs); padding:11px 16px; margin-top:10px; min-height:44px; }
[data-theme="dark"] .add{ color:var(--brand); }

.stk{ display:flex; flex-direction:column; gap:9px; margin-top:10px; }
.stkrow{ padding:13px 14px; border-radius:var(--rs); background:var(--paper2); border:1px solid var(--line); }
.stkrow .lay{ font-family:var(--fMono); font-size:11px; color:var(--brand2); text-transform:uppercase; letter-spacing:.05em; }
[data-theme="dark"] .stkrow .lay{ color:var(--brand); }
.stkrow .in{ margin-top:7px; background:var(--paper); }
.stkrow .why{ color:var(--muted); font-size:12px; line-height:1.5; margin-top:7px; }

.cost{ display:flex; flex-direction:column; gap:9px; margin-top:10px; }
.costopt{ display:flex; align-items:center; justify-content:space-between; gap:10px; padding:14px;
  border-radius:var(--rs); background:var(--paper2); border:1.5px solid var(--line); text-align:start; transition:.15s; }
.costopt.on{ background:var(--brandSoft); border-color:var(--brand); }
.costopt b{ font-size:14px; } .costopt small{ display:block; color:var(--muted); font-weight:400; margin-top:2px; }
.costopt .rng{ font-family:var(--fMono); font-size:13px; color:var(--brand2); white-space:nowrap; }
[data-theme="dark"] .costopt .rng{ color:var(--brand); }

/* ---------- action bar ---------- */
.acts{ display:flex; gap:9px; align-items:center; margin-top:24px; }
@media(max-width:639px){
  .acts{ position:fixed; left:0; right:0; bottom:0; z-index:35; margin:0; padding:10px 14px calc(10px + env(safe-area-inset-bottom));
    background:color-mix(in srgb,var(--bg) 92%,transparent); backdrop-filter:blur(12px);
    border-top:1px solid var(--line); box-shadow:var(--shadowUp); }
}
.btn{ display:inline-flex; align-items:center; justify-content:center; gap:8px; padding:13px 18px;
  border-radius:var(--rs); font-size:14px; font-weight:700; background:var(--paper2); border:1.5px solid var(--line);
  transition:.15s; min-height:48px; }
.btn:hover{ border-color:var(--line2); }
.btn.primary{ background:var(--brand); border-color:var(--brand); color:#fff; box-shadow:0 8px 20px -10px var(--brand); flex:1; }
@media(min-width:640px){ .btn.primary{ flex:none; } }
.btn.primary:hover{ background:var(--brand2); }
.btn.ai{ background:var(--ai); border-color:var(--ai); color:#fff; }
.btn.ghost{ background:transparent; }
.btn:disabled{ opacity:.4; pointer-events:none; }
.btn.icon{ padding:0; width:48px; flex:none; }

.only-d{ display:none; } @media(min-width:640px){ .only-d{ display:inline-flex; } }
.only-m{ display:inline-flex; } @media(min-width:640px){ .only-m{ display:none; } }

/* ---------- AI assistant ---------- */
.fab{ position:fixed; inset-inline-end:18px; bottom:18px; z-index:38; display:inline-flex; align-items:center; gap:9px;
  padding:14px 18px; border-radius:99px; color:#fff; font-weight:700; font-size:14px;
  background:linear-gradient(135deg,var(--ai),var(--ai2)); box-shadow:0 14px 30px -10px var(--ai2); }
.ov{ position:fixed; inset:0; z-index:60; background:rgba(8,20,15,.45); backdrop-filter:blur(3px);
  display:flex; justify-content:flex-end; animation:f .2s; }
@keyframes f{ from{opacity:0} }
.sheet{ width:min(420px,100%); height:100%; background:var(--paper); display:flex; flex-direction:column;
  border-inline-start:1px solid var(--line); animation:sx .25s cubic-bezier(.2,.7,.3,1); }
@keyframes sx{ from{transform:translateX(40px);opacity:0} }
@media(max-width:560px){
  .ov{ align-items:flex-end; }
  .sheet{ width:100%; height:90vh; border-radius:22px 22px 0 0; border:none; border-top:1px solid var(--line);
    animation:su .26s cubic-bezier(.2,.7,.3,1); }
  @keyframes su{ from{transform:translateY(60px);opacity:0} }
}
.grab{ width:38px; height:4px; border-radius:99px; background:var(--line2); margin:8px auto 0; }
@media(min-width:561px){ .grab{ display:none; } }
.shead{ display:flex; align-items:center; gap:11px; padding:14px 16px; border-bottom:1px solid var(--line); }
.shead .mk{ width:34px; height:34px; border-radius:11px; display:grid; place-items:center; color:#fff;
  background:linear-gradient(135deg,var(--ai),var(--ai2)); }
.shead b{ font-size:15px; } .shead small{ display:block; color:var(--muted); font-size:11px; }
.sbody{ flex:1; overflow-y:auto; padding:16px; display:flex; flex-direction:column; gap:12px; }
.msg{ max-width:90%; padding:12px 14px; border-radius:15px; font-size:14px; line-height:1.6; white-space:pre-wrap; }
.msg.u{ align-self:flex-end; background:var(--brandSoft); border-end-end-radius:5px; }
.msg.a{ align-self:flex-start; background:var(--paper2); border:1px solid var(--line); border-end-start-radius:5px; }
.msg .ins{ display:inline-flex; align-items:center; gap:6px; margin-top:9px; font-size:12px; font-weight:700; color:#fff;
  background:var(--brand); border-radius:99px; padding:6px 12px; }
.msg .mactions{ display:flex; gap:6px; margin-top:9px; }
.msg .iconbtn{ display:inline-flex; align-items:center; gap:5px; font-size:11px; font-weight:600;
  color:var(--muted); background:var(--paper); border:1px solid var(--line); border-radius:99px; padding:5px 10px; transition:.15s; }
.msg .iconbtn:hover{ border-color:var(--ai); color:var(--ink); }
.qstart{ margin:auto 0; text-align:center; color:var(--muted); }
.qstart .q{ display:block; width:100%; text-align:start; margin-top:8px; padding:12px 14px; border-radius:13px;
  background:var(--paper2); border:1px solid var(--line); font-size:13.5px; font-weight:600; color:var(--ink); transition:.15s; }
.qstart .q:hover{ border-color:var(--ai); }
.sfoot{ padding:12px; border-top:1px solid var(--line); display:flex; gap:8px; }
.sfoot input{ flex:1; background:var(--paper2); border:1.5px solid var(--line); border-radius:13px;
  padding:12px 14px; font-size:14px; color:var(--ink); outline:none; }
.sfoot input:focus{ border-color:var(--ai); }
.snd{ width:48px; flex:none; border-radius:13px; color:#fff; display:grid; place-items:center;
  background:linear-gradient(135deg,var(--ai),var(--ai2)); }
.spin{ animation:sp 1s linear infinite } @keyframes sp{ to{transform:rotate(360deg)} }

/* ---------- modal / glossary / saved ---------- */
.modal{ position:fixed; inset:0; z-index:70; background:rgba(8,20,15,.5); display:grid; place-items:end center; animation:f .2s; }
@media(min-width:561px){ .modal{ place-items:center; padding:18px; } }
.mbox{ width:100%; max-height:86vh; overflow-y:auto; background:var(--paper); border-radius:22px 22px 0 0; padding:22px; }
@media(min-width:561px){ .mbox{ width:min(620px,100%); border-radius:var(--r); padding:26px; box-shadow:var(--shadow); } }
.gl{ display:grid; gap:10px; }
.gli{ padding:14px; border-radius:13px; background:var(--paper2); border:1px solid var(--line); }
.gli b{ font-size:14.5px; } .gli .tm{ font-family:var(--fMono); color:var(--brand2); font-size:11.5px; }
[data-theme="dark"] .gli .tm{ color:var(--brand); }
.gli p{ margin:6px 0 0; color:var(--muted); font-size:13px; line-height:1.55; }
.saved{ display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:12px; }
.scard{ padding:16px; border-radius:var(--r); background:var(--paper); border:1px solid var(--line); text-align:start; box-shadow:var(--shadow); transition:.15s; }
.scard:hover{ border-color:var(--brand); transform:translateY(-2px); }

/* ---------- report ---------- */
.expbar{ display:flex; flex-wrap:wrap; gap:8px; margin-bottom:14px; }
.expbar .btn{ min-height:42px; padding:9px 14px; font-size:13px; }
.rep{ background:var(--paper); border:1px solid var(--line); border-radius:var(--r); overflow:hidden; box-shadow:var(--shadow); }
.cover{ padding:30px 20px; background:linear-gradient(140deg,var(--brandSoft),var(--paper)); border-bottom:1px solid var(--line); position:relative; }
@media(min-width:640px){ .cover{ padding:42px 36px; } }
[data-theme="dark"] .cover{ background:linear-gradient(140deg,var(--brandSoft),var(--paper)); }
.cover h1{ font-family:var(--fEn); font-size:clamp(26px,6vw,42px); margin:8px 0 0; letter-spacing:-.02em; }
.pb[dir="rtl"] .cover h1{ font-family:var(--fAr); }
.cover .meta{ display:flex; flex-wrap:wrap; gap:7px; margin-top:16px; }
.cover .meta span{ font-size:12px; background:var(--paper); border:1px solid var(--line); border-radius:99px; padding:6px 11px; }
.cover .meta b{ color:var(--brand2); } [data-theme="dark"] .cover .meta b{ color:var(--brand); }
.rbody{ padding:20px; } @media(min-width:640px){ .rbody{ padding:30px 36px; } }
.rsec{ padding:18px 0; border-bottom:1px solid var(--line); } .rsec:last-child{ border-bottom:none; }
.rsec h3{ font-family:var(--fEn); font-size:17px; margin:0 0 11px; display:flex; align-items:center; gap:9px; flex-wrap:wrap; }
.pb[dir="rtl"] .rsec h3{ font-family:var(--fAr); }
.rsec h3 .n{ font-family:var(--fMono); font-size:11px; color:var(--brand2); border:1px solid var(--line); border-radius:7px; padding:2px 7px; }
[data-theme="dark"] .rsec h3 .n{ color:var(--brand); }
.rsec ul{ margin:0; padding-inline-start:18px; } .rsec li{ margin:5px 0; line-height:1.55; font-size:14px; }
.rsec p{ font-size:14px; line-height:1.65; margin:5px 0; }
.kv{ display:grid; grid-template-columns:auto 1fr; gap:5px 14px; font-size:14px; }
.kv dt{ color:var(--muted); } .kv dd{ margin:0; }
.scroll{ overflow-x:auto; -webkit-overflow-scrolling:touch; }
.tbl{ width:100%; border-collapse:collapse; font-size:13px; min-width:320px; }
.tbl th,.tbl td{ text-align:start; padding:9px 11px; border:1px solid var(--line); }
.tbl th{ background:var(--paper2); font-family:var(--fMono); font-size:11px; color:var(--brand2); font-weight:400; }
[data-theme="dark"] .tbl th{ color:var(--brand); }

/* score */
.gw{ display:flex; flex-direction:column; gap:18px; align-items:center; }
@media(min-width:520px){ .gw{ flex-direction:row; gap:24px; } }
.gauge{ position:relative; width:150px; height:150px; flex:none; }
.gauge .l{ position:absolute; inset:0; display:grid; place-items:center; text-align:center; }
.gauge .l b{ font-family:var(--fEn); font-size:36px; line-height:1; display:inline-flex; align-items:baseline; gap:2px; }
.gauge .l b .pct{ font-family:var(--fEn); }
.gauge .l .lbl{ display:block; margin-top:6px; font-family:var(--fMono); font-size:10px; color:var(--muted); letter-spacing:.1em; white-space:nowrap; text-transform:uppercase; }
.pb[dir="rtl"] .gauge .l .lbl{ font-family:var(--fAr); font-size:11px; letter-spacing:0; text-transform:none; }
.bars{ flex:1; width:100%; min-width:0; }
.bar{ margin-bottom:12px; } .bar .t{ display:flex; justify-content:space-between; font-size:13px; margin-bottom:5px; }
.bar .tr{ height:9px; border-radius:99px; background:var(--paper2); border:1px solid var(--line); overflow:hidden; }
.bar .tr i{ display:block; height:100%; border-radius:99px; transition:width .8s cubic-bezier(.2,.8,.2,1); }
.notes{ margin-top:18px; display:grid; gap:8px; }
.note{ display:flex; gap:10px; align-items:flex-start; font-size:13.5px; line-height:1.5; padding:11px 13px; border-radius:13px; background:var(--paper2); border:1px solid var(--line); }
.note .d{ width:8px; height:8px; border-radius:99px; margin-top:6px; flex:none; }

/* ---------- footer ---------- */
.foot{ max-width:760px; margin:26px auto 0; padding:16px 14px calc(16px + env(safe-area-inset-bottom));
  text-align:center; color:var(--faint); font-size:12px; line-height:1.8; border-top:1px solid var(--line); }
.foot b{ color:var(--muted); font-weight:700; }
.foot .hrt{ display:inline-flex; vertical-align:-2px; color:var(--ai); }
@media(max-width:639px){ .foot{ padding-bottom:calc(86px + env(safe-area-inset-bottom)); } }

@media print{ .foot{ display:none; } .noprint{ display:none !important; } .pb{ background:#fff; color:#000; } .rep{ border:none; box-shadow:none; } }
`;

/* ---------------- data ---------------- */
const L = (lang, en, ar) => (lang === "ar" ? ar : en);

const TYPES = [
  { id:"website", icon:Globe, en:"Website", ar:"موقع إلكتروني", be:"Marketing or content site", ba:"موقع تعريفي أو محتوى" },
  { id:"mobile", icon:Rocket, en:"Mobile App", ar:"تطبيق موبايل", be:"iOS / Android app", ba:"تطبيق آيفون / أندرويد" },
  { id:"dashboard", icon:Settings2, en:"Dashboard / Admin", ar:"لوحة تحكم", be:"Internal admin panel", ba:"لوحة إدارة داخلية" },
  { id:"ecommerce", icon:DollarSign, en:"E-commerce Store", ar:"متجر إلكتروني", be:"Sell products online", ba:"بيع المنتجات أونلاين" },
  { id:"restaurant", icon:ListChecks, en:"Restaurant / Ordering", ar:"مطعم / طلبات", be:"Menu & order system", ba:"قائمة طعام ونظام طلب" },
  { id:"booking", icon:Clock, en:"Booking System", ar:"نظام حجوزات", be:"Appointments & reservations", ba:"مواعيد وحجوزات" },
  { id:"education", icon:GraduationCap, en:"Educational Platform", ar:"منصة تعليمية", be:"Courses & learning", ba:"دورات وتعلّم" },
  { id:"delivery", icon:Route, en:"Delivery App", ar:"تطبيق توصيل", be:"Orders & drivers", ba:"طلبات وسائقون" },
  { id:"saas", icon:Layers, en:"SaaS Product", ar:"منتج SaaS", be:"Subscription software", ba:"برنامج بالاشتراك" },
  { id:"custom", icon:Compass, en:"Custom Idea", ar:"فكرة خاصة", be:"Something else entirely", ba:"شيء مختلف تماماً" },
];
const LEVELS = [
  { id:"beginner", icon:User, en:"Beginner", ar:"مبتدئ" },
  { id:"intermediate", icon:Compass, en:"Intermediate", ar:"متوسط" },
  { id:"developer", icon:Code2, en:"Developer", ar:"مطوّر" },
  { id:"business", icon:Briefcase, en:"Business Owner", ar:"صاحب عمل" },
];
const GLOSSARY = [
  { term:"Frontend", en:"Frontend", ar:"الواجهة الأمامية", de:"Everything the user sees and clicks — screens, buttons, layout.", da:"كل ما يراه المستخدم ويضغط عليه — الشاشات والأزرار والتصميم." },
  { term:"Backend", en:"Backend", ar:"الخلفية", de:"The hidden engine that runs logic, saves data, answers requests.", da:"المحرّك المخفي الذي ينفّذ المنطق ويحفظ البيانات." },
  { term:"Database", en:"Database", ar:"قاعدة البيانات", de:"Where the project stores its info: users, orders, products.", da:"المكان الذي نخزّن فيه معلومات المشروع: المستخدمين والطلبات والمنتجات." },
  { term:"API", en:"API", ar:"واجهة برمجية (API)", de:"A messenger that lets two programs talk to each other.", da:"وسيط يسمح لبرنامجين بالتحدّث ببعضهما." },
  { term:"MVP", en:"MVP", ar:"النسخة الأولى (MVP)", de:"The smallest useful version worth launching first.", da:"أصغر نسخة مفيدة تستحق الإطلاق أولاً." },
  { term:"Hosting", en:"Hosting", ar:"الاستضافة", de:"The online space where your project lives 24/7.", da:"المساحة على الإنترنت التي يعيش فيها مشروعك دائماً." },
  { term:"Domain", en:"Domain", ar:"النطاق", de:"Your website's address, like myproject.com.", da:"عنوان موقعك، مثل myproject.com." },
  { term:"Authentication", en:"Authentication", ar:"تسجيل الدخول", de:"Checking who a user is — login, passwords, accounts.", da:"التحقق من هوية المستخدم — الدخول وكلمات المرور." },
  { term:"Deployment", en:"Deployment", ar:"النشر", de:"Publishing your project so it goes live for real users.", da:"رفع المشروع ليصبح متاحاً للمستخدمين الحقيقيين." },
  { term:"Responsive", en:"Responsive Design", ar:"تصميم متجاوب", de:"A layout that looks good on phone, tablet and desktop.", da:"تصميم يظهر جيداً على الهاتف والتابلت والكمبيوتر." },
  { term:"UI / UX", en:"UI / UX", ar:"واجهة وتجربة المستخدم", de:"UI is how it looks; UX is how it feels to use.", da:"الـUI هو الشكل، والـUX هو سهولة الاستخدام." },
  { term:"Admin Panel", en:"Admin Panel", ar:"لوحة الإدارة", de:"A private screen where owners manage content and users.", da:"شاشة خاصة بالمالك لإدارة المحتوى والمستخدمين." },
];

function suggestStack(type){
  const base=[
    {layer:"Frontend",val:"Next.js + TypeScript",we:"Fast, great for SEO, powerful UI.",wa:"سريع، ممتاز للظهور في جوجل، وقوي للواجهات."},
    {layer:"Styling",val:"Tailwind CSS + shadcn/ui",we:"Clean modern components, quick to build.",wa:"مكوّنات حديثة وسريعة البناء."},
    {layer:"Backend",val:"Next.js API / Server Actions",we:"One codebase for frontend & backend.",wa:"كود واحد للواجهة والخلفية."},
    {layer:"Database",val:"PostgreSQL + Prisma",we:"Reliable database with easy modeling.",wa:"قاعدة بيانات موثوقة وسهلة التنظيم."},
    {layer:"Auth",val:"Auth.js (NextAuth)",we:"Secure login with many providers.",wa:"تسجيل دخول آمن بعدة طرق."},
    {layer:"Hosting",val:"Vercel + Neon/Supabase",we:"Deploy in minutes, scales automatically.",wa:"نشر بدقائق ويتوسّع تلقائياً."},
  ];
  const extra={
    ecommerce:[{layer:"Payments",val:"Stripe",we:"Trusted global payments.",wa:"مدفوعات عالمية موثوقة."}],
    restaurant:[{layer:"Payments",val:"Stripe / local gateway",we:"Accept online orders.",wa:"قبول الدفع للطلبات."},{layer:"Realtime",val:"WebSockets / Pusher",we:"Live order status.",wa:"حالة الطلب لحظياً."}],
    delivery:[{layer:"Maps",val:"Mapbox / Google Maps",we:"Tracking & routing.",wa:"تتبّع وتحديد المسارات."},{layer:"Realtime",val:"WebSockets",we:"Live driver location.",wa:"موقع السائق لحظياً."}],
    saas:[{layer:"Payments",val:"Stripe Billing",we:"Subscriptions & invoices.",wa:"اشتراكات وفواتير."}],
    booking:[{layer:"Notifications",val:"Email + SMS",we:"Reminders for bookings.",wa:"تذكير بالمواعيد."}],
    education:[{layer:"Media",val:"Video hosting (Mux)",we:"Stream lessons smoothly.",wa:"بثّ الدروس بسلاسة."}],
    mobile:[{layer:"Mobile",val:"React Native / Expo",we:"One code for iOS & Android.",wa:"كود واحد لآيفون وأندرويد."}],
  };
  return [...base,...(extra[type]||[])];
}
function suggestTables(type){
  const base=["users","projects","sessions","notifications"];
  const m={ecommerce:["products","orders","cart_items","payments","reviews"],restaurant:["menu_items","orders","tables","payments"],
    booking:["services","bookings","availability","payments"],education:["courses","lessons","enrollments","progress"],
    delivery:["orders","drivers","addresses","tracking"],saas:["subscriptions","plans","invoices","teams"],
    dashboard:["roles","permissions","logs","reports"],website:["pages","posts","contacts"],mobile:["devices","push_tokens"],custom:["items","records"]};
  return [...base,...(m[type]||[])];
}

const SECTIONS = [
  { id:"basics", icon:FileText, en:"Project Basics", ar:"أساسيات المشروع", de:"The core idea in plain words.", da:"الفكرة الأساسية بكلمات بسيطة.",
    fields:[
      {key:"name",type:"text",en:"Project name",ar:"اسم المشروع",he:"What you'll call it.",ha:"الاسم الذي ستطلقه."},
      {key:"desc",type:"textarea",en:"Short description",ar:"وصف قصير",he:"One or two sentences about what it does.",ha:"جملة أو جملتان عن وظيفته."},
      {key:"audience",type:"text",en:"Target audience",ar:"الجمهور المستهدف",he:"Who will use it?",ha:"من سيستخدمه؟"},
      {key:"goal",type:"text",en:"Main goal",ar:"الهدف الرئيسي",he:"The one thing it must achieve.",ha:"الشيء الأساسي الذي يجب تحقيقه."},
      {key:"problem",type:"textarea",en:"Problem it solves",ar:"المشكلة التي يحلّها",he:"What pain does it remove?",ha:"ما الصعوبة التي يُنهيها؟"},
    ]},
  { id:"features", icon:Lightbulb, en:"Features", ar:"الميزات", de:"What people can actually do.", da:"ما يستطيع الناس فعله.",
    fields:[
      {key:"user",type:"list",en:"User features",ar:"ميزات المستخدم",he:"Things users can do.",ha:"الأشياء التي يفعلها المستخدمون."},
      {key:"admin",type:"list",en:"Admin features",ar:"ميزات الإدارة",he:"Things the owner manages.",ha:"الأشياء التي يديرها المالك."},
      {key:"optional",type:"list",en:"Optional / later",ar:"اختيارية لاحقاً",he:"Nice-to-have for later.",ha:"أفكار للمستقبل."},
    ]},
  { id:"pages", icon:Layers, en:"Pages / Screens", ar:"الصفحات / الشاشات", de:"Every screen and its purpose.", da:"كل شاشة ووظيفتها.",
    fields:[{key:"list",type:"list",en:"Pages / screens",ar:"الصفحات / الشاشات",he:"Home, Login, Profile, Settings…",ha:"الرئيسية، تسجيل الدخول، الملف، الإعدادات…"}]},
  { id:"flow", icon:Route, en:"User Flow", ar:"رحلة المستخدم", de:"The journey from arrival to result.", da:"رحلة المستخدم من الدخول للنتيجة.",
    fields:[{key:"steps",type:"list",en:"Journey steps (in order)",ar:"خطوات الرحلة (بالترتيب)",he:"Arrive → sign up → pick → submit → track.",ha:"يدخل ← يسجّل ← يختار ← يرسل ← يتابع."}]},
  { id:"stack", icon:Code2, en:"Technical Stack", ar:"التقنيات", de:"The tools chosen for the build.", da:"الأدوات المختارة للتنفيذ.",
    fields:[{key:"stack",type:"stack",en:"Recommended stack",ar:"التقنيات المقترحة",he:"Auto-filled by type; tap AI to re-suggest.",ha:"تُعبّأ حسب النوع؛ اضغط AI لاقتراح آخر."}]},
  { id:"database", icon:Database, en:"Database Plan", ar:"قاعدة البيانات", de:"Tables that store the project's data.", da:"الجداول التي تخزّن البيانات.",
    fields:[{key:"tables",type:"list",en:"Tables",ar:"الجداول",he:"Each table holds one kind of data.",ha:"كل جدول يحفظ نوعاً من البيانات."}]},
  { id:"apis", icon:PanelRight, en:"API Requirements", ar:"الـ APIs المطلوبة", de:"Connections the app needs.", da:"الاتصالات التي يحتاجها التطبيق.",
    fields:[{key:"list",type:"list",en:"APIs",ar:"الـ APIs",he:"Auth API, Project API, Export API…",ha:"API الدخول، API المشاريع، API التصدير…"}]},
  { id:"security", icon:Shield, en:"Security", ar:"الأمان", de:"How users and data stay safe.", da:"كيف نحمي المستخدمين والبيانات.",
    fields:[{key:"items",type:"multi",en:"Security measures",ar:"إجراءات الأمان",he:"Pick what your project needs.",ha:"اختر ما يحتاجه مشروعك.",
      options:[{id:"login",en:"Login protection",ar:"حماية الدخول"},{id:"hash",en:"Password hashing",ar:"تشفير كلمات المرور"},
        {id:"validation",en:"Input validation",ar:"التحقق من المدخلات"},{id:"rate",en:"Rate limiting",ar:"تحديد الطلبات"},
        {id:"privacy",en:"Data privacy",ar:"خصوصية البيانات"},{id:"roles",en:"Role-based access",ar:"صلاحيات حسب الدور"},
        {id:"exports",en:"Secure exports",ar:"تصدير آمن"}]}]},
  { id:"mvp", icon:Rocket, en:"MVP Plan", ar:"خطة MVP", de:"What launches first vs later.", da:"ما يُطلق أولاً وما يأتي لاحقاً.",
    fields:[
      {key:"mvp",type:"list",en:"MVP (launch first)",ar:"MVP (أول إطلاق)",he:"Only the essentials.",ha:"الأساسيات فقط."},
      {key:"v2",type:"list",en:"Version 2",ar:"النسخة الثانية",he:"Next batch of features.",ha:"الدفعة التالية."},
      {key:"advanced",type:"list",en:"Future ideas",ar:"أفكار مستقبلية",he:"Long-term dreams.",ha:"أحلام بعيدة."},
    ]},
  { id:"timeline", icon:Clock, en:"Timeline", ar:"الجدول الزمني", de:"A rough plan of phases.", da:"خطة تقديرية للمراحل.",
    fields:[{key:"phases",type:"phases",en:"Phases & duration",ar:"المراحل والمدة",he:"Estimated weeks per phase.",ha:"عدد الأسابيع لكل مرحلة."}]},
  { id:"cost", icon:DollarSign, en:"Cost Estimation", ar:"تقدير التكلفة", de:"A ballpark budget range.", da:"نطاق تقديري للميزانية.",
    fields:[{key:"size",type:"costsize",en:"Project size",ar:"حجم المشروع",he:"Rough estimate, not a final price.",ha:"تقدير تقريبي وليس سعراً نهائياً."}]},
];
const COST={
  small:{en:"Small",ar:"صغير",range:"$500 – $2,000",we:"Simple site or MVP.",wa:"موقع بسيط أو نسخة أولى."},
  medium:{en:"Medium",ar:"متوسط",range:"$2,000 – $8,000",we:"Full app with accounts & dashboard.",wa:"تطبيق كامل بحسابات ولوحة تحكم."},
  advanced:{en:"Advanced",ar:"متقدم",range:"$8,000 – $25,000+",we:"Complex system, payments, scale.",wa:"نظام معقّد بمدفوعات وقابلية توسّع."},
};
const DEFAULT_PHASES=[{en:"Planning",ar:"التخطيط",w:1},{en:"UI Design",ar:"تصميم الواجهة",w:2},{en:"Frontend",ar:"الواجهة",w:3},
  {en:"Backend",ar:"الخلفية",w:3},{en:"Database",ar:"قاعدة البيانات",w:1},{en:"AI Integration",ar:"دمج الذكاء الاصطناعي",w:1},
  {en:"Testing",ar:"الاختبار",w:1},{en:"Deployment",ar:"النشر",w:1}];

/* ---------------- Real AI ---------------- */
async function callAI(system, userMsg, history=[]) {
  const messages=[...history.slice(-6).map(m=>({role:m.role==="a"?"assistant":"user",content:m.content})),{role:"user",content:userMsg}];
  // Calls our own server endpoint (/api/chat) so the Groq API key stays on the server.
  const endpoint = import.meta.env.VITE_AI_ENDPOINT || "/api/chat";
  const res=await fetch(endpoint,{method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({max_tokens:1000,system,messages})});
  if(!res.ok) throw new Error("HTTP "+res.status);
  const data=await res.json();
  return (data.content||[]).map(b=>b.type==="text"?b.text:"").join("\n").trim();
}

/* ---------------- App ---------------- */
export default function App(){
  const [lang,setLang]=useState("ar");
  const [theme,setTheme]=useState("light");
  const [mode,setMode]=useState("ai");
  const [viewer,setViewer]=useState("client");
  const [level,setLevel]=useState("beginner");
  const [screen,setScreen]=useState("welcome");
  const [type,setType]=useState(null);
  const [step,setStep]=useState(0);
  const [plan,setPlan]=useState({});
  const [saved,setSaved]=useState([]);
  const [showGloss,setShowGloss]=useState(false);
  const [showJump,setShowJump]=useState(false);

  const [aiOpen,setAiOpen]=useState(false);
  const [aiMsgs,setAiMsgs]=useState([]);
  const [aiInput,setAiInput]=useState("");
  const [aiBusy,setAiBusy]=useState(false);

  const dir=lang==="ar"?"rtl":"ltr";
  const t=(en,ar)=>L(lang,en,ar);
  const typeObj=TYPES.find(x=>x.id===type);
  const getF=(s,k)=>plan?.[s]?.[k];
  const setF=(s,k,v)=>setPlan(p=>({...p,[s]:{...(p[s]||{}),[k]:v}}));

  // Keep <html> in sync so the scrollbar side, native form controls and
  // screen readers match the chosen language, not just the inner <div>.
  useEffect(()=>{
    document.documentElement.lang=lang;
    document.documentElement.dir=dir;
  },[lang,dir]);

  function startType(id){
    setType(id);
    setPlan({stack:{stack:suggestStack(id)},database:{tables:suggestTables(id)},timeline:{phases:DEFAULT_PHASES.map(p=>({...p}))},cost:{size:"medium"}});
    setStep(0); setScreen("builder");
  }

  function sysPrompt(){
    const lt=level==="beginner"?"The user is a complete beginner with no technical background. Explain everything in very simple words, avoid jargon, use small real-life examples."
      :level==="business"?"The user is a non-technical business owner. Focus on outcomes, clarity and value."
      :level==="developer"?"The user is a developer. Be precise and technical."
      :"The user has intermediate knowledge.";
    const stage=screen==="builder"
      ? `They are on step ${step+1} of ${total}, currently filling in the "${sec.en}" section (${sec.de}).`
      : screen==="report"
      ? `They are viewing the final report. Overall readiness score: ${scores.overall}%.`
      : "They have not chosen a project type yet.";
    return `You are the built-in AI assistant of "مِعمار (Architect)", a studio that helps people turn an idea into a clear, structured plan — features, screens, tech stack, database, user flow, security, MVP, timeline and budget — before building it.
${lt}
${stage}
${planCtx()}
Always answer in ${lang==="ar"?"Arabic":"English"}, even if the user writes in another language. Keep replies short (a few sentences, or up to 5 short lines), warm and practical.
No markdown headers or bold text. For lists, write one short item per line starting with "-", no numbering.
Be specific to this project type and build on what's already filled in — avoid generic advice.`;
  }
  function planCtx(){const b=plan.basics||{};return `Project: ${b.name||"(unnamed)"} | Type: ${typeObj?.en||"?"} | Goal: ${b.goal||"?"} | Audience: ${b.audience||"?"} | Desc: ${b.desc||"?"}.`;}

  const aiErrMsg=()=>t("I couldn't reach the AI service right now. Please try again in a moment.","تعذّر الوصول لخدمة الذكاء الاصطناعي الآن. حاول مرة أخرى بعد لحظات.");

  async function runAI(userMsg,target=null,displayUser=null){
    setAiOpen(true);
    setAiMsgs(m=>[...m,{role:"u",content:displayUser||userMsg}]);
    setAiBusy(true);
    try{ const r=await callAI(sysPrompt(),userMsg,aiMsgs); setAiMsgs(m=>[...m,{role:"a",content:r,target}]); }
    catch(e){ setAiMsgs(m=>[...m,{role:"a",content:aiErrMsg()}]); }
    setAiBusy(false);
  }
  function copyMsg(content){ navigator.clipboard?.writeText(content); }
  async function regenerate(){
    const idx=aiMsgs.map(m=>m.role).lastIndexOf("u");
    if(idx===-1||aiBusy) return;
    const userMsg=aiMsgs[idx].content;
    const history=aiMsgs.slice(0,idx);
    setAiMsgs(aiMsgs.slice(0,idx+1));
    setAiBusy(true);
    try{ const r=await callAI(sysPrompt(),userMsg,history); setAiMsgs(m=>[...m,{role:"a",content:r}]); }
    catch(e){ setAiMsgs(m=>[...m,{role:"a",content:aiErrMsg()}]); }
    setAiBusy(false);
  }
  function fieldAction(kind,sec,field){
    const ctx=planCtx(); const fn=field.en;
    const prompts={
      explain:`Explain in simple terms what "${fn}" means in a project plan, and why it matters. ${ctx}`,
      write:`${ctx}\nWrite a short ready-to-use draft for the "${fn}" section. Concise result the user can paste directly. ${field.type==="list"?"Return 4-6 items, one per line, no numbering.":""}`,
      suggest:`${ctx}\nSuggest 4-5 concrete examples for "${fn}" for this kind of project. One per line.`,
      simplify:`Rewrite what I wrote for "${fn}" in much simpler, clearer words: """${JSON.stringify(getF(sec,field.key))||"(empty)"}"""`,
    };
    const disp={explain:t(`Explain "${fn}"`,`اشرح "${field.ar}"`),write:t(`Help me write "${fn}"`,`اكتب لي "${field.ar}"`),
      suggest:t(`Examples for "${fn}"`,`أمثلة لـ "${field.ar}"`),simplify:t(`Simplify "${fn}"`,`بسّط "${field.ar}"`)};
    runAI(prompts[kind],(kind==="write"||kind==="suggest")?{sec,key:field.key,type:field.type}:null,disp[kind]);
  }
  function reviewSection(s){const x=SECTIONS.find(z=>z.id===s);
    runAI(`${planCtx()}\nReview section "${x.en}" and point out what's missing or unclear in 2-4 short bullets. Data: ${JSON.stringify(plan[s]||{})}`,null,t(`Review "${x.en}"`,`راجع قسم "${x.ar}"`));}
  function insertAI(target,content){
    if(target.type==="list"||target.type==="stack"){
      const items=content.split("\n").map(x=>x.replace(/^[-*•\d.)\s]+/,"").trim()).filter(Boolean);
      const cur=getF(target.sec,target.key)||[];
      if(target.type==="stack") setF(target.sec,target.key,[...cur,...items.map(v=>({layer:"AI",val:v,we:"",wa:""}))]);
      else setF(target.sec,target.key,[...(Array.isArray(cur)?cur:[]),...items]);
    } else setF(target.sec,target.key,content.trim());
  }

  const scores=useMemo(()=>computeScores(plan),[plan]);

  function planText(){const b=plan.basics||{};let o=`${b.name||"Untitled"} — Project Blueprint\n${"=".repeat(40)}\n\n`;
    SECTIONS.forEach((s,i)=>{o+=`${i+1}. ${s.en} / ${s.ar}\n`;const d=plan[s.id]||{};
      Object.entries(d).forEach(([k,v])=>{if(Array.isArray(v))o+="   - "+v.map(x=>typeof x==="object"?`${x.layer}: ${x.val}`:x).join("\n   - ")+"\n";else o+=`   ${k}: ${v}\n`;});o+="\n";});
    o+=`Overall readiness: ${scores.overall}%\n`;return o;}
  function copyText(){navigator.clipboard?.writeText(planText());}
  function exportHTML(){const html=buildReportHTML(plan,scores,typeObj,lang);const blob=new Blob([html],{type:"text/html"});
    const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=`${(plan.basics?.name||"blueprint").replace(/\s+/g,"-")}.html`;a.click();}
  function saveProject(){setSaved(s=>[{id:Date.now(),name:plan.basics?.name||t("Untitled","بدون اسم"),type,plan:JSON.parse(JSON.stringify(plan)),score:scores.overall,date:new Date().toLocaleDateString()},...s]);}

  const sec=SECTIONS[step];
  const total=SECTIONS.length;
  const quick=screen==="builder"
    ? [
        {label:t("Help with this section","ساعدني في هذا القسم"),msg:`${planCtx()} Give me 3-4 concrete, specific suggestions for the "${sec.en}" section I'm currently filling in.`},
        {label:t("Suggest features for me","اقترح لي ميزات"),msg:`${planCtx()} Suggest the most important features for this kind of project, one per line.`},
        {label:t("Explain the tech stack","اشرح لي التقنيات"),msg:"Explain in very simple terms what a tech stack is and its main parts."},
      ]
    : screen==="report"
    ? [
        {label:t("How can I raise my score?","كيف أرفع نسبة الجاهزية؟"),msg:`${planCtx()} My overall readiness score is ${scores.overall}%. What are the top 2-3 things I should improve first?`},
        {label:t("Biggest risk in my plan","أكبر خطر في خطتي"),msg:`${planCtx()} What's the single biggest risk or gap in this plan right now?`},
        {label:t("Explain the tech stack","اشرح لي التقنيات"),msg:"Explain in very simple terms what a tech stack is and its main parts."},
      ]
    : [
        {label:t("What can you do?","ماذا تستطيع أن تفعل؟"),msg:"Briefly explain how you can help me plan my project."},
        {label:t("Suggest features for me","اقترح لي ميزات"),msg:`${planCtx()} Suggest the most important features for this kind of project, one per line.`},
        {label:t("Explain the tech stack","اشرح لي التقنيات"),msg:"Explain in very simple terms what a tech stack is and its main parts."},
      ];

  return (
    <div className="pb" dir={dir} data-theme={theme}>
      <style>{STYLE}</style>

      <header className="hd noprint">
        <button className="brand" onClick={()=>setScreen("welcome")}>
          <span className="mk"><Compass size={18}/></span><span className="bname">{t("Architect","مِعمار")}</span>
        </button>
        <span className="sp"/>
        {saved.length>0 && <button className="htbtn htico" onClick={()=>setScreen("saved")} title={t("Saved","المحفوظة")}><Save size={16}/></button>}
        <button className="htbtn htico" onClick={()=>setShowGloss(true)} title={t("Glossary","المصطلحات")}><BookOpen size={16}/></button>
        <button className="htbtn" onClick={()=>setLang(l=>l==="ar"?"en":"ar")}><Globe size={15}/>{lang==="ar"?"EN":"ع"}</button>
        <button className="htbtn htico" onClick={()=>setTheme(th=>th==="dark"?"light":"dark")}>{theme==="dark"?<Sun size={16}/>:<Moon size={16}/>}</button>
      </header>

      <main className="wrap">
        {screen==="welcome" && <Welcome t={t} lang={lang} mode={mode} setMode={setMode} level={level} setLevel={setLevel} onPick={startType}/>}

        {screen==="saved" && (
          <SavedView t={t} saved={saved} onOpen={s=>{setType(s.type);setPlan(s.plan);setStep(0);setScreen("builder");}} onNew={()=>setScreen("welcome")}/>
        )}

        {screen==="builder" && (
          <div>
            <div className="strip noprint">
              <div className="blocks">
                {SECTIONS.map((s,i)=>{const done=plan[s.id]&&Object.values(plan[s.id]).some(v=>Array.isArray(v)?v.length:v);
                  return <i key={s.id} className={i===step?"now":(done?"done":"")}/>;})}
              </div>
              <div className="striprow">
                <span className="stepmenu"><span className="c">{step+1}/{total}</span>{L(lang,sec.en,sec.ar)}</span>
                <button className="jump" onClick={()=>setShowJump(true)}><Menu size={14}/>{t("Sections","الأقسام")}</button>
              </div>
            </div>

            <div className="panel">
              <div className="sechead">
                <span className="ic"><sec.icon size={22}/></span>
                <div style={{flex:1,minWidth:0}}>
                  <span className="eyebrow">STEP {String(step+1).padStart(2,"0")}</span>
                  <h2 className="disp">{L(lang,sec.en,sec.ar)}</h2>
                  <p>{L(lang,sec.de,sec.da)}</p>
                </div>
                <button className="aibtn reviewbtn noprint" onClick={()=>reviewSection(sec.id)}><Sparkles size={13}/>{t("Review","راجع")}</button>
              </div>

              {sec.fields.map(f=>(
                <FieldRender key={f.key} f={f} sec={sec.id} lang={lang} mode={mode}
                  value={getF(sec.id,f.key)} setValue={v=>setF(sec.id,f.key,v)} onAI={k=>fieldAction(k,sec.id,f)} t={t}/>
              ))}
              {sec.id==="cost" && <p style={{marginTop:12,fontSize:12,color:"var(--muted)"}}>{t("Estimates are indicative and depend on team, region and scope.","الأسعار تقديرية وتعتمد على الفريق والمنطقة وحجم العمل.")}</p>}
            </div>

            <div className="acts noprint">
              <button className="btn ghost icon only-m" disabled={step===0} onClick={()=>setStep(s=>s-1)}>{dir==="rtl"?<ArrowRight size={18}/>:<ArrowLeft size={18}/>}</button>
              <button className="btn ghost only-d" disabled={step===0} onClick={()=>setStep(s=>s-1)}>{dir==="rtl"?<ArrowRight size={16}/>:<ArrowLeft size={16}/>}{t("Back","السابق")}</button>
              <span className="sp only-d"/>
              <button className="btn only-d" onClick={saveProject}><Save size={15}/>{t("Save","حفظ")}</button>
              <button className="btn ai icon only-m" onClick={()=>setAiOpen(true)}><Sparkles size={18}/></button>
              {step<total-1
                ? <button className="btn primary" onClick={()=>setStep(s=>s+1)}>{t("Next","التالي")}{dir==="rtl"?<ArrowLeft size={16}/>:<ArrowRight size={16}/>}</button>
                : <button className="btn primary" onClick={()=>setScreen("report")}><Gauge size={16}/>{t("Build report","التقرير")}</button>}
            </div>
          </div>
        )}

        {screen==="report" && (
          <ReportView t={t} lang={lang} plan={plan} scores={scores} typeObj={typeObj} viewer={viewer} setViewer={setViewer}
            onBack={()=>setScreen("builder")} onPrint={()=>window.print()} onHTML={exportHTML} onCopy={copyText} onSave={saveProject}
            onAIReview={()=>runAI(`${planCtx()}\nGive an overall expert review in 3-4 short points: strengths, risks, one priority next step. Summary: features=${(plan.features?.user||[]).length}, mvp=${(plan.mvp?.mvp||[]).length}, tables=${(plan.database?.tables||[]).length}.`,null,t("Review my whole plan","راجع خطتي كاملة"))}/>
        )}
      </main>

      <Footer t={t}/>

      {screen==="builder" && !aiOpen && <button className="fab noprint only-d" onClick={()=>setAiOpen(true)}><Sparkles size={17}/>{t("AI Assistant","مساعد AI")}</button>}
      {screen==="report" && !aiOpen && <button className="fab noprint" onClick={()=>setAiOpen(true)}><Sparkles size={17}/>{t("AI Assistant","مساعد AI")}</button>}

      {aiOpen && <AIPanel t={t} msgs={aiMsgs} busy={aiBusy} input={aiInput} setInput={setAiInput} quick={quick}
        onClose={()=>setAiOpen(false)} onSend={txt=>{if(txt.trim()){runAI(txt);setAiInput("");}}} onInsert={insertAI}
        onCopy={copyMsg} onRegenerate={regenerate}/>}

      {showGloss && <GlossaryModal t={t} lang={lang} onClose={()=>setShowGloss(false)}/>}
      {showJump && (
        <div className="modal noprint" onClick={()=>setShowJump(false)}>
          <div className="mbox" onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
              <Menu size={18} style={{color:"var(--brand)"}}/><b className="disp" style={{fontSize:18}}>{t("Jump to section","الانتقال لقسم")}</b>
              <span className="sp"/><button className="htbtn htico" onClick={()=>setShowJump(false)}><X size={16}/></button>
            </div>
            <div style={{display:"grid",gap:7}}>
              {SECTIONS.map((s,i)=>{const done=plan[s.id]&&Object.values(plan[s.id]).some(v=>Array.isArray(v)?v.length:v);
                return <button key={s.id} className="ch" style={{justifyContent:"flex-start",width:"100%"}} onClick={()=>{setStep(i);setShowJump(false);}}>
                  <span className="mono" style={{color:"var(--faint)",width:24}}>{i+1}</span><s.icon size={16}/>{L(lang,s.en,s.ar)}{done&&<Check size={15} style={{marginInlineStart:"auto",color:"var(--brand)"}}/>}</button>;})}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- Footer ---------------- */
function Footer({t}){
  return (
    <footer className="foot noprint">
      <Hammer size={12} className="hrt"/>{" "}
      {t("Designed & built by","تصميم وتطوير")} <b>Ibrahim Ghaiyth</b> · {t("© 2026 Architect — All rights reserved.","© 2026 معمار — جميع الحقوق محفوظة.")}
    </footer>
  );
}

/* ---------------- Welcome ---------------- */
function Welcome({t,lang,mode,setMode,level,setLevel,onPick}){
  return (
    <>
      <div className="hero">
        <span className="kick"><Sparkles size={13}/>{t("plan before you build","خطّط قبل أن تبني")}</span>
        <h1>{t("Turn an idea into a","حوّل فكرتك إلى")} <span className="hl">{t("real blueprint","مخطّط حقيقي")}</span></h1>
        <p>{t("Features, screens, tech, database, timeline, budget — and an exportable report. A real AI helps you in every step.",
          "الميزات، الشاشات، التقنيات، قاعدة البيانات، الوقت، الميزانية — وتقرير قابل للتصدير. مساعد ذكاء اصطناعي حقيقي يرافقك في كل خطوة.")}</p>
      </div>

      <div className="opts">
        <div className="optblk">
          <div className="optlab">{t("Mode","الوضع")}</div>
          <div className="seg">
            <button className={`pill ${mode==="manual"?"on":""}`} onClick={()=>setMode("manual")}><FileText size={14}/>{t("Manual","يدوي")}</button>
            <button className={`pill ai ${mode==="ai"?"on":""}`} onClick={()=>setMode("ai")}><Sparkles size={14}/>{t("AI Assistant","بمساعدة AI")}</button>
          </div>
        </div>
        <div className="optblk">
          <div className="optlab">{t("Your level","مستواك")}</div>
          <div className="seg">
            {LEVELS.map(l=><button key={l.id} className={`pill ${level===l.id?"on":""}`} onClick={()=>setLevel(l.id)}><l.icon size={14}/>{L(lang,l.en,l.ar)}</button>)}
          </div>
        </div>
      </div>

      <div className="askq"><span className="eyebrow">{t("step 01","الخطوة ٠١")}</span><h2>{t("What do you want to plan?","ماذا تريد أن تخطّط؟")}</h2></div>
      <div className="grid">
        {TYPES.map((ty,i)=>(
          <button key={ty.id} className="card" onClick={()=>onPick(ty.id)}>
            <span className="n">{String(i+1).padStart(2,"0")}</span>
            <span className="ic"><ty.icon size={20}/></span>
            <h3>{L(lang,ty.en,ty.ar)}</h3><small>{L(lang,ty.be,ty.ba)}</small>
          </button>
        ))}
      </div>
    </>
  );
}

/* ---------------- Field ---------------- */
function FieldRender({f,sec,lang,value,setValue,onAI,t,mode}){
  return (
    <div className="field">
      <div className="flab">
        <b>{L(lang,f.en,f.ar)}</b>
        <span className="tip" title={L(lang,f.he,f.ha)}><HelpCircle size={11}/>{t("what's this?","ما هذا؟")}</span>
      </div>
      <div className="aibtns noprint">
        <button className="aibtn" onClick={()=>onAI("explain")}><CircleHelp size={12}/>{t("Explain","اشرح")}</button>
        {mode==="ai"&&f.type!=="multi"&&f.type!=="costsize"&&f.type!=="phases"&&<button className="aibtn" onClick={()=>onAI("write")}><Wand2 size={12}/>{t("Write for me","اكتب لي")}</button>}
        {(f.type==="list"||f.type==="stack")&&<button className="aibtn" onClick={()=>onAI("suggest")}><Lightbulb size={12}/>{t("Examples","أمثلة")}</button>}
        {(f.type==="text"||f.type==="textarea")&&<button className="aibtn" onClick={()=>onAI("simplify")}><Sparkles size={12}/>{t("Simplify","بسّط")}</button>}
      </div>

      {f.type==="text"&&<input className="in" value={value||""} onChange={e=>setValue(e.target.value)} placeholder={L(lang,f.he,f.ha)}/>}
      {f.type==="textarea"&&<textarea className="in" value={value||""} onChange={e=>setValue(e.target.value)} placeholder={L(lang,f.he,f.ha)}/>}
      {f.type==="list"&&<ListField items={value||[]} setItems={setValue} t={t}/>}
      {f.type==="multi"&&(
        <div className="choices">{f.options.map(o=>{const arr=value||[];const on=arr.includes(o.id);
          return <button key={o.id} className={`ch ${on?"on":""}`} onClick={()=>setValue(on?arr.filter(x=>x!==o.id):[...arr,o.id])}>{on&&<Check size={14}/>}{L(lang,o.en,o.ar)}</button>;})}</div>
      )}
      {f.type==="stack"&&<StackField items={value||[]} setItems={setValue} lang={lang}/>}
      {f.type==="phases"&&<PhasesField items={value||[]} setItems={setValue} lang={lang} t={t}/>}
      {f.type==="costsize"&&<CostField value={value} setValue={setValue} lang={lang}/>}
    </div>
  );
}
function ListField({items,setItems,t}){
  return (<div>
    {items.map((it,i)=>(<div className="lrow" key={i}>
      <input className="in" value={it} onChange={e=>{const c=[...items];c[i]=e.target.value;setItems(c);}}/>
      <button className="del noprint" onClick={()=>setItems(items.filter((_,j)=>j!==i))}><Trash2 size={16}/></button></div>))}
    <button className="add noprint" onClick={()=>setItems([...items,""])}><Plus size={16}/>{t("Add item","إضافة عنصر")}</button>
  </div>);
}
function StackField({items,setItems,lang}){
  return (<div className="stk">{items.map((s,i)=>(<div className="stkrow" key={i}>
    <span className="lay">{s.layer}</span>
    <input className="in" value={s.val} onChange={e=>{const c=[...items];c[i]={...s,val:e.target.value};setItems(c);}}/>
    {(s.we||s.wa)&&<div className="why">{L(lang,s.we,s.wa)}</div>}</div>))}</div>);
}
function PhasesField({items,setItems,lang,t}){
  const total=items.reduce((a,b)=>a+(+b.w||0),0);
  return (<div>{items.map((p,i)=>(<div className="lrow" key={i}>
    <span style={{flex:1,fontSize:14,fontWeight:600}}>{L(lang,p.en,p.ar)}</span>
    <input className="in" type="number" min="0" style={{width:84,flex:"none"}} value={p.w} onChange={e=>{const c=[...items];c[i]={...p,w:e.target.value};setItems(c);}}/>
    <span style={{fontSize:12,color:"var(--muted)"}}>{t("wk","أسبوع")}</span></div>))}
    <p style={{marginTop:10,fontSize:13,fontWeight:700,color:"var(--brand)"}}>{t("Total","الإجمالي")}: {total} {t("weeks","أسبوع")}</p></div>);
}
function CostField({value,setValue,lang}){
  return (<div className="cost">{Object.entries(COST).map(([k,c])=>(
    <button key={k} className={`costopt ${value===k?"on":""}`} onClick={()=>setValue(k)}>
      <span><b>{L(lang,c.en,c.ar)}</b><small>{L(lang,c.we,c.wa)}</small></span>
      <span className="rng">{c.range}</span></button>))}</div>);
}

/* ---------------- AI Panel ---------------- */
function AIPanel({t,msgs,busy,input,setInput,onClose,onSend,onInsert,onCopy,onRegenerate,quick}){
  const ref=useRef(null);
  useEffect(()=>{if(ref.current)ref.current.scrollTop=ref.current.scrollHeight;},[msgs,busy]);
  return (
    <div className="ov noprint" onClick={onClose}>
      <div className="sheet" onClick={e=>e.stopPropagation()}>
        <div className="grab"/>
        <div className="shead">
          <span className="mk"><Sparkles size={18}/></span>
          <div style={{flex:1}}><b>{t("AI Assistant","مساعد الذكاء الاصطناعي")}</b><small>{t("AI-powered · real answers","مدعوم بالذكاء الاصطناعي · إجابات حقيقية")}</small></div>
          <button className="htbtn htico" onClick={onClose}><X size={16}/></button>
        </div>
        <div className="sbody" ref={ref}>
          {msgs.length===0 && (<div className="qstart"><p>{t("Ask me anything about your plan, or start here:","اسألني أي شيء عن خطتك، أو ابدأ من هنا:")}</p>
            {quick.map((q,i)=><button key={i} className="q" onClick={()=>onSend(q.msg)}>{q.label}</button>)}</div>)}
          {msgs.map((m,i)=>(<div key={i} className={`msg ${m.role}`}>{m.content}
            {m.target&&<button className="ins" onClick={()=>onInsert(m.target,m.content)}><Plus size={12}/>{t("Insert into plan","إدراج في الخطة")}</button>}
            {m.role==="a"&&!busy&&(<div className="mactions">
              <button className="iconbtn" onClick={()=>onCopy(m.content)}><Copy size={12}/>{t("Copy","نسخ")}</button>
              {i===msgs.length-1 && <button className="iconbtn" onClick={onRegenerate}><RotateCcw size={12}/>{t("Regenerate","إعادة الصياغة")}</button>}
            </div>)}</div>))}
          {busy&&<div className="msg a"><Loader2 size={16} className="spin"/></div>}
        </div>
        <div className="sfoot">
          <input value={input} onChange={e=>setInput(e.target.value)} placeholder={t("Type a message…","اكتب رسالة…")} onKeyDown={e=>{if(e.key==="Enter")onSend(input);}}/>
          <button className="snd" onClick={()=>onSend(input)} disabled={busy}>{busy?<Loader2 size={17} className="spin"/>:<Send size={17}/>}</button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Glossary / Saved ---------------- */
function GlossaryModal({t,lang,onClose}){
  return (<div className="modal noprint" onClick={onClose}><div className="mbox" onClick={e=>e.stopPropagation()}>
    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
      <BookOpen size={18} style={{color:"var(--brand)"}}/><b className="disp" style={{fontSize:18}}>{t("Glossary","قاموس المصطلحات")}</b>
      <span className="sp"/><button className="htbtn htico" onClick={onClose}><X size={16}/></button></div>
    <div className="gl">{GLOSSARY.map(g=>(<div className="gli" key={g.term}><b>{L(lang,g.en,g.ar)}</b> <span className="tm">{g.term}</span><p>{L(lang,g.de,g.da)}</p></div>))}</div>
  </div></div>);
}
function SavedView({t,saved,onOpen,onNew}){
  return (<div>
    <div style={{display:"flex",alignItems:"center",marginBottom:16}}>
      <div><span className="eyebrow">{t("your drafts","مسوّداتك")}</span><h2 className="disp" style={{margin:"6px 0 0",fontSize:26}}>{t("Saved projects","المشاريع المحفوظة")}</h2></div>
      <span className="sp"/><button className="btn primary" onClick={onNew}><Plus size={16}/>{t("New","جديد")}</button></div>
    <div className="saved">{saved.map(s=>(<button key={s.id} className="scard" onClick={()=>onOpen(s)}>
      <span className="eyebrow">{s.type}</span><h3 style={{margin:"8px 0 4px",fontSize:16}}>{s.name}</h3>
      <p style={{margin:0,fontSize:12.5,color:"var(--muted)"}}>{s.date} · {t("Readiness","الجاهزية")} {s.score}%</p></button>))}</div>
  </div>);
}

/* ---------------- Report ---------------- */
function ReportView({t,lang,plan,scores,typeObj,viewer,setViewer,onBack,onPrint,onHTML,onCopy,onSave,onAIReview}){
  const b=plan.basics||{};const dev=viewer==="developer";
  const phases=plan.timeline?.phases||[];const totalW=phases.reduce((a,p)=>a+(+p.w||0),0);
  const cost=COST[plan.cost?.size||"medium"];
  const list=arr=>arr&&arr.length?<ul>{arr.map((x,i)=><li key={i}>{typeof x==="object"?`${x.layer}: ${x.val}`:x}</li>)}</ul>:<p style={{color:"var(--muted)"}}>{t("Not specified.","غير محدّد.")}</p>;
  const Row=({n,icon:Ic,title,children})=>(<div className="rsec"><h3><span className="n">{n}</span>{Ic&&<Ic size={16} style={{color:"var(--brand)"}}/>}{title}</h3>{children}</div>);
  return (<div>
    <div className="expbar noprint">
      <button className="btn ghost" onClick={onBack}>{lang==="ar"?<ArrowRight size={15}/>:<ArrowLeft size={15}/>}{t("Builder","البناء")}</button>
      <span className="sp"/>
      <button className={`btn ${viewer==="client"?"primary":""}`} onClick={()=>setViewer("client")}><User size={14}/>{t("Client","عميل")}</button>
      <button className={`btn ${viewer==="developer"?"primary":""}`} onClick={()=>setViewer("developer")}><Code2 size={14}/>{t("Developer","مطوّر")}</button>
    </div>
    <div className="expbar noprint">
      <button className="btn" onClick={onPrint}><Printer size={14}/>{t("Print / PDF","طباعة / PDF")}</button>
      <button className="btn" onClick={onHTML}><Download size={14}/>HTML</button>
      <button className="btn" onClick={onCopy}><Copy size={14}/>{t("Copy","نسخ")}</button>
      <button className="btn" onClick={onSave}><Save size={14}/>{t("Save","حفظ")}</button>
      <button className="btn ai" onClick={onAIReview}><Sparkles size={14}/>{t("AI review","مراجعة AI")}</button>
    </div>

    <div className="rep">
      <div className="cover">
        <span className="eyebrow">{t("project blueprint","مخطط المشروع")} · {typeObj&&L(lang,typeObj.en,typeObj.ar)}</span>
        <h1>{b.name||t("Untitled Project","مشروع بدون اسم")}</h1>
        <div className="meta">
          <span>{t("Audience","الجمهور")}: <b>{b.audience||"—"}</b></span>
          <span>{t("Timeline","المدة")}: <b>{totalW} {t("wk","أسبوع")}</b></span>
          <span>{t("Budget","الميزانية")}: <b>{cost?.range}</b></span>
          <span>{t("Readiness","الجاهزية")}: <b style={{color:scoreColor(scores.overall)}}>{scores.overall}%</b></span>
        </div>
      </div>
      <div className="rbody">
        <Row n="00" icon={Gauge} title={t("Project Readiness","جاهزية المشروع")}>
          <div className="gw">
            <Gauge2 value={scores.overall} label={t("READY","الجاهزية")}/>
            <div className="bars">{scores.bars.map(bar=>(<div className="bar" key={bar.key}>
              <div className="t"><span>{L(lang,bar.en,bar.ar)}</span><span className="mono" style={{color:scoreColor(bar.v)}}>{bar.v}%</span></div>
              <div className="tr"><i style={{width:bar.v+"%",background:scoreColor(bar.v)}}/></div></div>))}</div>
          </div>
          <div className="notes">{scores.notes.map((nt,i)=>(<div className="note" key={i}><span className="d" style={{background:nt.ok?"var(--ok)":"var(--warn)"}}/>{L(lang,nt.en,nt.ar)}</div>))}</div>
        </Row>
        <Row n="01" icon={FileText} title={t("Overview","نظرة عامة")}>
          <dl className="kv"><dt>{t("Description","الوصف")}</dt><dd>{b.desc||"—"}</dd>
            <dt>{t("Main goal","الهدف")}</dt><dd>{b.goal||"—"}</dd>
            <dt>{t("Problem solved","المشكلة")}</dt><dd>{b.problem||"—"}</dd></dl>
        </Row>
        <Row n="02" icon={Lightbulb} title={t("Features","الميزات")}>
          <p style={{color:"var(--muted)",fontSize:13}}>{t("User features","ميزات المستخدم")}</p>{list(plan.features?.user)}
          <p style={{color:"var(--muted)",fontSize:13,marginTop:10}}>{t("Admin features","ميزات الإدارة")}</p>{list(plan.features?.admin)}
        </Row>
        <Row n="03" icon={Layers} title={t("Pages / Screens","الصفحات / الشاشات")}>{list(plan.pages?.list)}</Row>
        <Row n="04" icon={Route} title={t("User Flow","رحلة المستخدم")}>{list(plan.flow?.steps)}</Row>
        <Row n="05" icon={Code2} title={t("Technical Stack","التقنيات")}>
          <div className="scroll"><table className="tbl"><thead><tr><th>{t("Layer","الطبقة")}</th><th>{t("Choice","الاختيار")}</th>{dev&&<th>{t("Why","لماذا")}</th>}</tr></thead>
            <tbody>{(plan.stack?.stack||[]).map((s,i)=><tr key={i}><td className="mono">{s.layer}</td><td>{s.val}</td>{dev&&<td style={{color:"var(--muted)"}}>{L(lang,s.we,s.wa)}</td>}</tr>)}</tbody></table></div>
        </Row>
        <Row n="06" icon={Database} title={t("Database Plan","قاعدة البيانات")}>
          {dev?<div className="scroll"><table className="tbl"><thead><tr><th>{t("Table","الجدول")}</th><th>{t("Stores","يخزّن")}</th></tr></thead>
            <tbody>{(plan.database?.tables||[]).map((tb,i)=><tr key={i}><td className="mono">{tb}</td><td style={{color:"var(--muted)"}}>{t("Records for","سجلات")} {tb}</td></tr>)}</tbody></table></div>
            :list(plan.database?.tables)}
        </Row>
        {dev&&<Row n="07" icon={PanelRight} title={t("API Requirements","الـ APIs")}>{list(plan.apis?.list)}</Row>}
        <Row n="08" icon={Shield} title={t("Security","الأمان")}>
          {list((plan.security?.items||[]).map(id=>{const o=SECTIONS.find(s=>s.id==="security").fields[0].options.find(x=>x.id===id);return o?L(lang,o.en,o.ar):id;}))}
        </Row>
        <Row n="09" icon={Rocket} title={t("MVP Plan","خطة MVP")}>
          <p style={{color:"var(--muted)",fontSize:13}}>MVP</p>{list(plan.mvp?.mvp)}
          <p style={{color:"var(--muted)",fontSize:13,marginTop:10}}>{t("Version 2","النسخة الثانية")}</p>{list(plan.mvp?.v2)}
        </Row>
        <Row n="10" icon={Clock} title={t("Timeline","الجدول الزمني")}>
          <div className="scroll"><table className="tbl"><thead><tr><th>{t("Phase","المرحلة")}</th><th>{t("Weeks","الأسابيع")}</th></tr></thead>
            <tbody>{phases.map((p,i)=><tr key={i}><td>{L(lang,p.en,p.ar)}</td><td className="mono">{p.w}</td></tr>)}
              <tr><td><b>{t("Total","الإجمالي")}</b></td><td className="mono"><b>{totalW}</b></td></tr></tbody></table></div>
        </Row>
        <Row n="11" icon={DollarSign} title={t("Cost Estimation","تقدير التكلفة")}>
          <p><b>{cost&&L(lang,cost.en,cost.ar)}</b> — <span style={{color:"var(--brand)"}}>{cost?.range}</span></p>
          <p style={{color:"var(--muted)",fontSize:12}}>{t("Indicative only — depends on team, region and scope.","نطاق تقديري فقط — يعتمد على الفريق والمنطقة وحجم العمل.")}</p>
        </Row>
      </div>
    </div>
  </div>);
}
function Gauge2({value,label}){
  const r=62,c=2*Math.PI*r,off=c-(value/100)*c;
  return (<div className="gauge"><svg width="150" height="150" viewBox="0 0 150 150">
    <circle cx="75" cy="75" r={r} fill="none" stroke="var(--paper2)" strokeWidth="12"/>
    <circle cx="75" cy="75" r={r} fill="none" stroke={scoreColor(value)} strokeWidth="12" strokeLinecap="round"
      strokeDasharray={c} strokeDashoffset={off} transform="rotate(-90 75 75)" style={{transition:"stroke-dashoffset 1s cubic-bezier(.2,.8,.2,1)"}}/></svg>
    <div className="l"><b style={{color:scoreColor(value)}}>{value}<span className="pct" style={{fontSize:16}}>%</span></b><span className="lbl">{label}</span></div></div>);
}

/* ---------------- scoring ---------------- */
function scoreColor(v){return v>=75?"var(--ok)":v>=50?"var(--warn)":"var(--bad)";}
function pct(arr){return Math.round((arr.filter(Boolean).length/arr.length)*100);}
function computeScores(plan){
  const b=plan.basics||{};const has=v=>Array.isArray(v)?v.length>0:!!(v&&String(v).trim());
  const clarity=pct([has(b.name),has(b.desc)&&(b.desc||"").length>15,has(b.audience),has(b.goal),has(b.problem)]);
  const featCount=(plan.features?.user||[]).filter(Boolean).length;
  const technical=pct([has(plan.stack?.stack),(plan.database?.tables||[]).length>=3,has(plan.apis?.list),(plan.security?.items||[]).length>=2]);
  const mvpCount=(plan.mvp?.mvp||[]).filter(Boolean).length;
  const mvp=mvpCount===0?30:mvpCount<=6?90:mvpCount<=9?70:50;
  const budget=plan.cost?.size?((plan.timeline?.phases||[]).reduce((a,p)=>a+(+p.w||0),0)>0?90:65):30;
  const complexity=featCount===0?40:featCount<=5?85:featCount<=9?65:45;
  const overall=Math.round(clarity*.25+technical*.25+mvp*.2+budget*.15+complexity*.15);
  const bars=[{key:"clarity",en:"Clarity",ar:"وضوح الفكرة",v:clarity},{key:"tech",en:"Technical readiness",ar:"الجاهزية التقنية",v:technical},
    {key:"mvp",en:"MVP readiness",ar:"جاهزية MVP",v:mvp},{key:"budget",en:"Budget clarity",ar:"وضوح الميزانية",v:budget},
    {key:"complex",en:"Feature scope",ar:"نطاق الميزات",v:complexity}];
  const notes=[];
  notes.push(clarity>=75?{ok:1,en:"The core idea is clear and well described.",ar:"الفكرة الأساسية واضحة وموصوفة جيداً."}:{ok:0,en:"Add more detail to the basics (goal, audience, problem).",ar:"أضف تفاصيل أكثر للأساسيات (الهدف، الجمهور، المشكلة)."});
  if(mvpCount>9)notes.push({ok:0,en:"Your MVP has many features — trim it to launch faster.",ar:"نسخة MVP فيها ميزات كثيرة — قلّلها لإطلاق أسرع."});
  if(featCount>9)notes.push({ok:0,en:"Feature list is large; consider phasing some to v2.",ar:"قائمة الميزات كبيرة؛ أجّل بعضها للنسخة الثانية."});
  notes.push(technical>=70?{ok:1,en:"Technical plan (stack, database, security) looks solid.",ar:"الخطة التقنية (التقنيات، قاعدة البيانات، الأمان) قوية."}:{ok:0,en:"Define the database tables and security measures.",ar:"حدّد جداول قاعدة البيانات وإجراءات الأمان."});
  if(budget<70)notes.push({ok:0,en:"Set a project size and timeline to clarify budget.",ar:"حدّد حجم المشروع والجدول الزمني لتوضيح الميزانية."});
  return {overall,bars,notes};
}

/* ---------------- HTML export ---------------- */
function buildReportHTML(plan,scores,typeObj,lang){
  const b=plan.basics||{};const esc=s=>String(s??"").replace(/[<>&]/g,c=>({"<":"&lt;",">":"&gt;","&":"&amp;"}[c]));
  const ul=arr=>arr&&arr.length?"<ul>"+arr.map(x=>`<li>${esc(typeof x==="object"?x.layer+": "+x.val:x)}</li>`).join("")+"</ul>":"<p style='color:#889'>—</p>";
  const cost=COST[plan.cost?.size||"medium"];const phases=plan.timeline?.phases||[];const dir=lang==="ar"?"rtl":"ltr";
  const col=scores.overall>=75?"#0b9b6e":scores.overall>=50?"#e08a00":"#e0526b";
  return `<!doctype html><html dir="${dir}" lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(b.name||"Blueprint")}</title>
<style>body{font-family:${lang==="ar"?"'Segoe UI',Tahoma":"system-ui,Arial"},sans-serif;background:#eef2ee;color:#0f241c;margin:0;padding:28px;line-height:1.7}
.box{max-width:780px;margin:0 auto;background:#fff;border:1px solid #dfe7e1;border-radius:16px;overflow:hidden}
.cv{padding:34px;background:linear-gradient(140deg,#dff3ea,#fff)}h1{margin:8px 0;font-size:30px}
.eb{font-family:monospace;letter-spacing:.14em;text-transform:uppercase;color:#0b9b6e;font-size:12px}
.bd{padding:26px 34px}h3{font-size:17px;border-top:1px solid #dfe7e1;padding-top:18px;margin-top:18px}
table{width:100%;border-collapse:collapse;font-size:13px}td,th{border:1px solid #dfe7e1;padding:8px;text-align:start}th{background:#f3f7f3;color:#0b9b6e;font-family:monospace}
.sc{font-size:38px;color:${col};font-weight:700}
.ft{padding:14px 34px;border-top:1px solid #dfe7e1;text-align:center;font-size:11px;color:#90a59c}</style></head>
<body><div class="box"><div class="cv"><div class="eb">${esc(typeObj?L(lang,typeObj.en,typeObj.ar):"")}</div>
<h1>${esc(b.name||"Untitled")}</h1><p>${esc(b.desc||"")}</p><div class="sc">${scores.overall}% <span style="font-size:14px;color:#5a7068">${L(lang,"readiness","جاهزية")}</span></div></div>
<div class="bd">
<h3>${L(lang,"Overview","نظرة عامة")}</h3><p><b>${L(lang,"Goal","الهدف")}:</b> ${esc(b.goal)}<br><b>${L(lang,"Audience","الجمهور")}:</b> ${esc(b.audience)}<br><b>${L(lang,"Problem","المشكلة")}:</b> ${esc(b.problem)}</p>
<h3>${L(lang,"Features","الميزات")}</h3>${ul(plan.features?.user)}
<h3>${L(lang,"Pages / Screens","الصفحات")}</h3>${ul(plan.pages?.list)}
<h3>${L(lang,"User Flow","رحلة المستخدم")}</h3>${ul(plan.flow?.steps)}
<h3>${L(lang,"Technical Stack","التقنيات")}</h3><table><tr><th>${L(lang,"Layer","الطبقة")}</th><th>${L(lang,"Choice","الاختيار")}</th></tr>${(plan.stack?.stack||[]).map(s=>`<tr><td>${esc(s.layer)}</td><td>${esc(s.val)}</td></tr>`).join("")}</table>
<h3>${L(lang,"Database","قاعدة البيانات")}</h3>${ul(plan.database?.tables)}
<h3>MVP</h3>${ul(plan.mvp?.mvp)}
<h3>${L(lang,"Timeline","الجدول الزمني")}</h3><table><tr><th>${L(lang,"Phase","المرحلة")}</th><th>${L(lang,"Weeks","الأسابيع")}</th></tr>${phases.map(p=>`<tr><td>${L(lang,p.en,p.ar)}</td><td>${esc(p.w)}</td></tr>`).join("")}</table>
<h3>${L(lang,"Cost","التكلفة")}</h3><p>${cost?L(lang,cost.en,cost.ar)+" — "+cost.range:"—"}</p>
</div><div class="ft">${L(lang,"Designed &amp; built by","تصميم وتطوير")} <b>Ibrahim Ghaiyth</b> · ${L(lang,"© 2026 Architect — All rights reserved.","© 2026 معمار — جميع الحقوق محفوظة.")}</div></div></body></html>`;
}
