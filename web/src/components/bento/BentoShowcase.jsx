import React from "react";
import {
  FiUsers, FiList, FiFileText, FiBell, FiLayers, FiSearch,
  FiActivity, FiDatabase, FiSettings, FiDownloadCloud, FiBarChart2,
  FiClock, FiHeart, FiKey, FiLock, FiMapPin, FiCalendar, FiShare2,
  FiBookOpen, FiGrid, FiTerminal, FiCamera, FiCheckCircle, FiTruck
} from "react-icons/fi";
import { AiOutlineFileSearch, AiOutlineSafetyCertificate } from "react-icons/ai";
import {
  TbToggleRight, TbChecklist, TbReportAnalytics, TbBinaryTree2, TbWaveSawTool,
  TbShieldCheck, TbBug, TbCloudLock, TbWorld, TbBrain, TbFileAnalytics, TbLockAccess, TbCalendarStats, TbActivityHeartbeat
} from "react-icons/tb";
import { RiFileUploadLine, RiShieldKeyholeLine, RiCloudOffLine, RiComputerLine, RiDatabase2Line, RiStackLine, RiFileShieldLine } from "react-icons/ri";
import { MdPolicy } from "react-icons/md";

/**
 * BentoShowcase.jsx — MEGA Variety Edition
 * - No 1‑column tiles.
 * - Sizes: 2x1, 2x2, 2x3, 3x1, 3x2, 3x3, 4x1, 4x2.
 * - More colors, more images, more icons. GROW VERTICALLY.
 */

const DATA = [
  // ===== Access & Security =====
  { id: "roles", title: "Roles & Permissions", body: "Least‑privilege, scoped actions.", icon: "FiUsers", size: "3x2", cat: "access", image: "https://images.unsplash.com/photo-1555949963-aa79dcee981d?q=80&w=1600&auto=format&fit=crop" },
  { id: "policy3", title: "Policy Engine", body: "Guardrails & approvals.", icon: "MdPolicy", size: "2x1", cat: "access" },
  { id: "mfa", title: "MFA & SSO", body: "Okta / Azure AD.", icon: "RiShieldKeyholeLine", size: "2x1", cat: "access" },
  { id: "kms", title: "Key Mgmt", body: "Encrypt, rotate, attest.", icon: "TbLockAccess", size: "2x2", cat: "privacy", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop" },
  { id: "zerotrust3", title: "Zero Trust", body: "Verify every request.", icon: "TbShieldCheck", size: "3x1", cat: "network" },
  { id: "zerotrust2", title: "Zero Trust", body: "Verify every request.", icon: "TbShieldCheck", size: "4x1", cat: "network" },  
  { id: "zerotrust", title: "Zero Trust", body: "Verify every request.", icon: "TbShieldCheck", size: "3x1", cat: "network" },

  // ===== Compliance & Audit =====
  { id: "compliance", title: "Compliance", body: "SOC2 / ISO mappings.", icon: "AiOutlineSafetyCertificate", size: "4x1", cat: "compliance", image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1600&auto=format&fit=crop" },
  
  { id: "audit", title: "Audit Logs", body: "Immutable, searchable events.", icon: "FiList", size: "3x3", cat: "compliance", image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1600&auto=format&fit=crop" },
  { id: "evidence", title: "Evidence Vault", body: "Attach proofs to controls.", icon: "FiFileText", size: "3x1", cat: "compliance" },
  { id: "calendar", title: "Compliance Calendar", body: "Audits & reviews.", icon: "TbCalendarStats", size: "2x1", cat: "gov" },
  { id: "grc", title: "GRC Workflows", body: "Risks • Issues • Tasks.", icon: "TbFileAnalytics", size: "4x2", cat: "gov", image: "https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?q=80&w=1600&auto=format&fit=crop" },
  { id: "policy", title: "Policy Engine", body: "Guardrails & approvals.", icon: "MdPolicy", size: "2x1", cat: "access" },
  { id: "policy2", title: "Policy Engine2", body: "Guardrails & approvals.2", icon: "MdPolicy2", size: "3x1", cat: "access" },

  // ===== Reporting & Insights =====
  { id: "reports", title: "Reports", body: "Auditor‑ready exports.", icon: "AiOutlineFileSearch", size: "3x1", cat: "reports", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600&auto=format&fit=crop" },
  { id: "reports3", title: "Reports", body: "Auditor‑ready exports.", icon: "AiOutlineFileSearch", size: "2x1", cat: "reports", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600&auto=format&fit=crop" },
  { id: "dash", title: "Dashboards", body: "KPIs & posture score.", icon: "TbReportAnalytics", size: "3x1", cat: "reports" },
  { id: "posture", title: "Posture Score", body: "Controls coverage.", icon: "TbActivityHeartbeat", size: "2x2", cat: "reports", image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop" },
  { id: "usage", title: "Usage & Cost", body: "Metering & costs.", icon: "FiBarChart2", size: "2x2", cat: "reports" },

  // ===== Platform & Ops =====
  { id: "settings", title: "Settings", body: "Tenants, plans, flags.", icon: "FiSettings", size: "2x1", cat: "ops" },
  { id: "integrations", title: "Integrations", body: "Slack, Teams, S3, Stripe.", icon: "FiLayers", size: "3x3", cat: "ops" },
  { id: "backups", title: "Backups", body: "Snapshots & retention.", icon: "FiDatabase", size: "3x1", cat: "ops", image: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1600&auto=format&fit=crop" },
  { id: "dr", title: "Disaster Recovery", body: "RTO/RPO drills.", icon: "RiCloudOffLine", size: "2x2", cat: "ops" },
  { id: "infra", title: "Infra Health", body: "SLOs • Incidents.", icon: "FiHeart", size: "3x1", cat: "infra" },

  // ===== Data, Search & Observability =====
  { id: "search", title: "Search", body: "Full‑text across data.", icon: "FiSearch", size: "2x1", cat: "data" },
  { id: "queue2", title: "Queue Monitor", body: "Running • Queued • Fail.", icon: "FiTruck", size: "2x1", cat: "data" },
  { id: "observability", title: "Observability", body: "Latency & error rate.", icon: "FiActivity", size: "3x2", cat: "data", image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1600&auto=format&fit=crop" },
  { id: "lineage", title: "Data Lineage", body: "Trace flows & access.", icon: "TbWorld", size: "3x2", cat: "datagov", image: "https://images.unsplash.com/photo-1497493292307-31c376b6e479?q=80&w=1600&auto=format&fit=crop" },
  { id: "queue", title: "Queue Monitor", body: "Running • Queued • Fail.", icon: "FiTruck", size: "3x1", cat: "data" },
  { id: "anomaly", title: "Anomaly Detect", body: "Baselines & spikes.", icon: "TbWaveSawTool", size: "3x2", cat: "ai", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop" },

  // ===== Go Microservices =====
  { id: "ingest", title: "Ingestion (Go)", body: "Stream XLS/CSV → DB.", icon: "RiFileUploadLine", size: "3x1", cat: "go", image: "https://images.unsplash.com/photo-1583778178932-c618c3d21467?q=80&w=1600&auto=format&fit=crop" },
  { id: "indexer", title: "Indexer (Go)", body: "Incremental search.", icon: "TbBinaryTree2", size: "2x1", cat: "go" },
  { id: "exports", title: "Exports (Go)", body: "Async CSV/PDF jobs.", icon: "FiDownloadCloud", size: "2x1", cat: "go" },
  { id: "notifier", title: "Notifier (Go)", body: "Slack/Email/Webhooks.", icon: "FiBell", size: "2x1", cat: "go" },

  // ===== Electron Companion =====
  { id: "bulk", title: "Bulk Import", body: "Drag‑and‑drop batches.", icon: "RiComputerLine", size: "3x1", cat: "desktop" },
  { id: "offline", title: "Offline Cache", body: "Sync & conflicts.", icon: "RiDatabase2Line", size: "3x2", cat: "desktop", image: "https://images.unsplash.com/photo-1537498425277-c283d32ef9db?q=80&w=1600&auto=format&fit=crop" },
  { id: "ops", title: "Ops Console", body: "Tail logs (RO).", icon: "FiTerminal", size: "2x1", cat: "desktop" },

  // ===== Threat & Identity (extra spice) =====
  { id: "threat", title: "Threat Intel", body: "Feeds & enrichment.", icon: "TbBug", size: "4x2", cat: "threat", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop" },
  { id: "identity", title: "Identity Gov", body: "Joiners • Movers • Leavers.", icon: "TbBrain", size: "3x2", cat: "identity", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop" },
  { id: "secrets", title: "Secrets Vault", body: "Scan • Rotate • Seal.", icon: "TbCloudLock", size: "2x2", cat: "privacy", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop" },
  { id: "incident", title: "Incident Resp.", body: "Runbooks & RCA.", icon: "TbShieldCheck", size: "3x1", cat: "threat" },
  { id: "market", title: "Marketplace", body: "Add‑ons & partners.", icon: "FiLayers", size: "2x1", cat: "market", image: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1600&auto=format&fit=crop" },
  { id: "market2", title: "Marketplace", body: "Add‑ons & partners.", icon: "FiLayers", size: "4x1", cat: "market", image: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1600&auto=format&fit=crop" },
   { id: "notifier4", title: "Notifier (Go)", body: "Slack/Email/Webhooks.", icon: "FiBell", size: "2x1", cat: "go" },
   { id: "notifier5", title: "Notifier (Go)", body: "Slack/Email/Webhooks.", icon: "FiBell", size: "2x1", cat: "go" },
];

// Map icon string -> Component
const ICONS = {
  FiUsers, FiList, FiFileText, FiBell, FiLayers, FiSearch,
  FiActivity, FiDatabase, FiSettings, FiDownloadCloud, FiBarChart2,
  FiClock, FiHeart, FiKey, FiLock, FiMapPin, FiCalendar, FiShare2,
  FiBookOpen, FiGrid, FiTerminal, FiCamera, FiCheckCircle, FiTruck,
  AiOutlineFileSearch, AiOutlineSafetyCertificate,
  TbToggleRight, TbChecklist, TbReportAnalytics, TbBinaryTree2, TbWaveSawTool,
  TbShieldCheck, TbBug, TbCloudLock, TbWorld, TbBrain, TbFileAnalytics, TbLockAccess, TbCalendarStats, TbActivityHeartbeat,
  RiFileUploadLine, RiShieldKeyholeLine, RiCloudOffLine, RiComputerLine, RiDatabase2Line, RiStackLine, RiFileShieldLine,
};

// Category color tokens — MORE COLORS 💥
const COLORS = {
  access: ["#4f46e5", "#6366f1"],      // indigo
  compliance: ["#f59e0b", "#fbbf24"],  // amber
  reports: ["#a855f7", "#c084fc"],     // purple
  ops: ["#06b6d4", "#22d3ee"],         // cyan
  data: ["#10b981", "#34d399"],        // emerald
  go: ["#0ea5e9", "#38bdf8"],          // sky
  desktop: ["#f97316", "#fb923c"],     // orange
  gov: ["#64748b", "#94a3b8"],         // slate
  threat: ["#ef4444", "#f87171"],      // red
  identity: ["#7c3aed", "#a78bfa"],    // violet
  privacy: ["#ec4899", "#f472b6"],     // pink
  ai: ["#d946ef", "#f0abfc"],          // fuchsia
  network: ["#2563eb", "#60a5fa"],      // blue
  infra: ["#0f766e", "#14b8a6"],       // teal
  datagov: ["#84cc16", "#a3e635"],     // lime
  market: ["#eab308", "#fde047"],      // yellow
};

function cardStyle(cat) {
  const [c1, c2] = COLORS[cat] || ["#334155", "#475569"];
  return {
    background: `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)`,
  };
}

function sizeToClass(size) { return `s-${size}`; }

export default function BentoShowcase() {
  const [cols, setCols] = React.useState(12);
  const [layout, setLayout] = React.useState({}); // id -> {c,r,w,h}

  const items = React.useMemo(() => {
    // sort big → small to minimize gaps
    const area = s => {
      const [w,h] = s.split('x').map(Number); return w*h;
    };
    return [...DATA].sort((a,b)=> area(b.size)-area(a.size) || b.size.split('x')[1]-a.size.split('x')[1]);
  }, []);

  const dims = React.useCallback((size) => size.split('x').map(Number), []);

  const computeCols = React.useCallback(() => {
    const w = window.innerWidth;
    if (w <= 520) return 2;
    if (w <= 760) return 4;
    if (w <= 980) return 8;
    if (w <= 1200) return 10;
    return 12;
  }, []);

  const pack = React.useCallback((items, cols) => {
    const heights = Array(cols).fill(0); // next free row per col
    const placed = {};
    items.forEach(it => {
      const [w,h] = dims(it.size);
      const span = Math.min(w, cols); // clamp overly-wide on small screens
      let bestCol = 1, bestRow = Infinity;
      for (let c=1; c<=cols - span + 1; c++) {
        let row = 0;
        for (let k=c; k<c+span; k++) row = Math.max(row, heights[k-1]);
        if (row < bestRow) { bestRow = row; bestCol = c; }
      }
      const rStart = bestRow + 1;
      for (let k=bestCol; k<bestCol+span; k++) heights[k-1] = rStart + h - 1;
      placed[it.id] = { c: bestCol, r: rStart, w: span, h };
    });
    return placed;
  }, [dims]);

  React.useEffect(() => {
    const recalc = () => {
      const c = computeCols();
      setCols(c);
      const p = pack(items, c);
      setLayout(p);
      // flag to fade-in
      document.documentElement.style.setProperty('--grid-ready','1');
    };
    recalc();
    const onResize = () => { clearTimeout(onResize._t); onResize._t = setTimeout(recalc, 80); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [items, pack, computeCols]);

  return (
    <section className="bento-wrap">
      <header className="bento-head">
        <h2>What we’re building</h2>
        <p className="muted">Bigger heroes, more colors, more images — let’s conquer the world ⚔️</p>
      </header>

      <div className="bento-grid">
        {DATA.map((item) => {
          const Icon = ICONS[item.icon] ?? FiSettings;
          const hasImg = !!item.image;
          return (
            <article key={item.id} className={`card ${sizeToClass(item.size)} ${hasImg ? "card--hasimg" : ""}`} style={{ ...cardStyle(item.cat) }}>
              {hasImg && (
                <div className="media" aria-hidden="true">
                  <img src={item.image} alt="" />
                  <i className="shade" />
                </div>
              )}
              <div className="card-top">
                <div className="icon"><Icon size={22} /></div>
                <h3 className="title">{item.title}</h3>
              </div>
              <p className="body">{item.body}</p>
            </article>
          );
        })}
      </div>

      <style>{`
        :root{ --bg:#0b0c10; --text:#e7e9ee; --muted:#b8bfca; --line:rgba(255,255,255,.12); }
        .bento-wrap{width:100%;padding:32px 20px;background:var(--bg);color:var(--text);box-sizing:border-box}
        .bento-head{max-width:1200px;margin:0 auto 16px auto;padding:0 8px}
        .bento-head h2{margin:0 0 6px;font-size:clamp(20px,3vw,32px)}
        .bento-head .muted{color:var(--muted)}

        .bento-grid{max-width:1400px;margin:0 auto;display:grid;gap:14px;grid-auto-rows:170px;
          grid-template-columns:repeat(12,minmax(0,1fr));}

        /* Size classes */
        .card.s-2x1{ grid-column: span 2; grid-row: span 1; }
        .card.s-2x2{ grid-column: span 2; grid-row: span 2; }
        .card.s-2x3{ grid-column: span 2; grid-row: span 3; }
        .card.s-3x1{ grid-column: span 3; grid-row: span 1; }
        .card.s-3x2{ grid-column: span 3; grid-row: span 2; }
        .card.s-3x3{ grid-column: span 3; grid-row: span 3; }
        .card.s-4x1{ grid-column: span 4; grid-row: span 1; }
        .card.s-4x2{ grid-column: span 4; grid-row: span 2; }

        /* fade-in once layout computed */
        .bento-grid{opacity:var(--grid-ready,0); transition:opacity .18s ease;}

        @media (max-width:1200px){.bento-grid{grid-template-columns:repeat(10,1fr)}}
        @media (max-width:980px){.bento-grid{grid-template-columns:repeat(8,1fr);grid-auto-rows:160px}}
        @media (max-width:760px){.bento-grid{grid-template-columns:repeat(4,1fr);grid-auto-rows:150px}}
        @media (max-width:520px){
          .bento-grid{grid-template-columns:repeat(2,1fr);grid-auto-rows:auto}
          .card[class*="s-3x"], .card.s-4x1, .card.s-4x2{ grid-column: span 2; }
        }

        .card{position:relative;border-radius:16px;border:1px solid var(--line);box-shadow:0 8px 24px rgba(0,0,0,.22);
          padding:16px;display:flex;flex-direction:column;justify-content:space-between;min-height:0;overflow:hidden}
        .card:before{content:"";position:absolute;inset:0;background:radial-gradient(100% 100% at 0% 0%,rgba(255,255,255,.12),rgba(255,255,255,.05) 40%,transparent 70%);mix-blend:overlay;pointer-events:none}
        .card .card-top{position:relative;z-index:2;display:grid;grid-template-columns:auto 1fr;align-items:center;gap:10px}
        .card .icon{width:34px;height:34px;display:grid;place-items:center;background:rgba(255,255,255,.22);border:1px solid rgba(255,255,255,.28);border-radius:10px}
        .card .title{margin:0;font-size:16px}
        .card .body{position:relative;z-index:2;margin:10px 2px 0 2px;color:rgba(255,255,255,.96);font-size:13px}

        .card{transform:translateZ(0);transition:transform .18s ease, box-shadow .18s ease}
        .card:hover{transform:translateY(-2px);box-shadow:0 14px 30px rgba(0,0,0,.28)}

        /* media image for large tiles */
        .card--hasimg .media{position:absolute;inset:0;z-index:1}
        .card--hasimg .media img{width:100%;height:100%;object-fit:cover;object-position:center}
        .card--hasimg .media .shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.25),rgba(0,0,0,.55));}
      `}</style>
    </section>
  );
}
