import React from "react";
import {
  FiUsers, FiList, FiFileText, FiBell, FiLayers, FiSearch,
  FiActivity, FiDatabase, FiSettings, FiDownloadCloud, FiBarChart2,
  FiClock, FiHeart, FiKey, FiLock, FiMapPin, FiCalendar, FiShare2,
  FiBookOpen, FiGrid, FiTerminal, FiCamera, FiCheckCircle, FiTruck
} from "react-icons/fi";
import { AiOutlineFileSearch, AiOutlineSafetyCertificate } from "react-icons/ai";
import { TbToggleRight, TbChecklist, TbReportAnalytics, TbBinaryTree2, TbWaveSawTool } from "react-icons/tb";
import { RiFileUploadLine, RiShieldKeyholeLine, RiCloudOffLine, RiComputerLine, RiDatabase2Line, RiStackLine, RiFileShieldLine } from "react-icons/ri";
import { MdPolicy } from "react-icons/md";

/**
 * BentoShowcase.jsx
 * Now with: fewer tiny tiles, optional images on larger cards, and tighter packing.
 */

const DATA = [
  // Access & Security
  { id: "roles", title: "Roles & Permissions", body: "Least-privilege, scoped actions.", icon: "FiUsers", size: "2x2", cat: "access", image: "https://images.unsplash.com/photo-1555949963-aa79dcee981d?q=80&w=1400&auto=format&fit=crop" },
  { id: "policy", title: "Policy Engine", body: "Guardrails & approvals.", icon: "MdPolicy", size: "2x1", cat: "access" },
  { id: "mfa", title: "MFA & SSO", body: "Okta / Azure AD.", icon: "RiShieldKeyholeLine", size: "1x2", cat: "access" },

  // Compliance & Audit
  { id: "compliance", title: "Compliance", body: "SOC2 / ISO mappings.", icon: "AiOutlineSafetyCertificate", size: "2x1", cat: "compliance", image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1400&auto=format&fit=crop" },
  { id: "audit", title: "Audit Logs", body: "Immutable, searchable events.", icon: "FiList", size: "2x2", cat: "compliance", image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1400&auto=format&fit=crop" },
  { id: "evidence", title: "Evidence Vault", body: "Attach proofs to controls.", icon: "FiFileText", size: "2x1", cat: "compliance" },

  // Reporting & Insights
  { id: "reports", title: "Reports", body: "Auditor-ready exports.", icon: "AiOutlineFileSearch", size: "2x1", cat: "reports", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1400&auto=format&fit=crop" },
  { id: "dash", title: "Dashboards", body: "KPIs & posture score.", icon: "TbReportAnalytics", size: "2x1", cat: "reports" },
  { id: "usage", title: "Usage & Cost", body: "Metering & costs.", icon: "FiBarChart2", size: "1x2", cat: "reports" },

  // Platform & Ops
  { id: "settings", title: "Settings", body: "Tenants, plans, flags.", icon: "FiSettings", size: "1x2", cat: "ops" },
  { id: "integrations", title: "Integrations", body: "Slack, Teams, S3, Stripe.", icon: "FiLayers", size: "2x1", cat: "ops" },
  { id: "backups", title: "Backups", body: "Snapshots & retention.", icon: "FiDatabase", size: "2x1", cat: "ops", image: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1400&auto=format&fit=crop" },
  { id: "dr", title: "Disaster Recovery", body: "RTO/RPO drills.", icon: "RiCloudOffLine", size: "1x2", cat: "ops" },

  // Data, Search & Observability
  { id: "search", title: "Search", body: "Full-text across data.", icon: "FiSearch", size: "2x1", cat: "data" },
  { id: "observability", title: "Observability", body: "Latency & error rate.", icon: "FiActivity", size: "2x2", cat: "data", image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1400&auto=format&fit=crop" },
  { id: "queue", title: "Queue Monitor", body: "Running • Queued • Fail.", icon: "FiTruck", size: "1x2", cat: "data" },

  // Go Microservices
  { id: "ingest", title: "Ingestion (Go)", body: "Stream XLS/CSV → DB.", icon: "RiFileUploadLine", size: "2x1", cat: "go", image: "https://images.unsplash.com/photo-1583778178932-c618c3d21467?q=80&w=1400&auto=format&fit=crop" },
  { id: "exports", title: "Exports (Go)", body: "Async CSV/PDF jobs.", icon: "FiDownloadCloud", size: "2x1", cat: "go" },
  { id: "notifier", title: "Notifier (Go)", body: "Slack/Email/Webhooks.", icon: "FiBell", size: "1x2", cat: "go" },

  // Electron Companion
  { id: "bulk", title: "Bulk Import", body: "Drag-and-drop batches.", icon: "RiComputerLine", size: "2x1", cat: "desktop" },
  { id: "offline", title: "Offline Cache", body: "Sync & conflicts.", icon: "RiDatabase2Line", size: "1x2", cat: "desktop" },
  { id: "ops", title: "Ops Console", body: "Tail logs (RO).", icon: "FiTerminal", size: "2x1", cat: "desktop" },

  // Governance & DX
  { id: "orgunits", title: "Org Units", body: "Departments & scopes.", icon: "FiGrid", size: "1x2", cat: "gov" },
  { id: "approvals", title: "Approvals", body: "Maker/checker.", icon: "FiCheckCircle", size: "2x1", cat: "gov" },
  { id: "sdk", title: "SDKs & Docs", body: "Quickstarts & examples.", icon: "FiBookOpen", size: "2x1", cat: "gov" },

  // a couple of tasteful 1x1 fillers to close small gaps if any appear
  { id: "filler-flag", title: "Feature Flags", body: "Toggle per tenant.", icon: "TbToggleRight", size: "1x1", cat: "gov" },
  { id: "filler-health", title: "Health & SLA", body: "Uptime & incidents.", icon: "FiHeart", size: "1x1", cat: "gov" },
];

// Map icon string -> Component
const ICONS = {
  FiUsers, FiList, FiFileText, FiBell, FiLayers, FiSearch,
  FiActivity, FiDatabase, FiSettings, FiDownloadCloud, FiBarChart2,
  FiClock, FiHeart, FiKey, FiLock, FiMapPin, FiCalendar, FiShare2,
  FiBookOpen, FiGrid, FiTerminal, FiCamera, FiCheckCircle, FiTruck,
  AiOutlineFileSearch, AiOutlineSafetyCertificate,
  TbToggleRight, TbChecklist, TbReportAnalytics, TbBinaryTree2, TbWaveSawTool,
  RiFileUploadLine, RiShieldKeyholeLine, RiCloudOffLine, RiComputerLine, RiDatabase2Line, RiStackLine, RiFileShieldLine,
};

// Category color tokens
const COLORS = {
  access: ["#4f46e5", "#6366f1"], // indigo
  compliance: ["#f59e0b", "#fbbf24"], // amber
  reports: ["#a855f7", "#c084fc"], // purple
  ops: ["#06b6d4", "#22d3ee"], // cyan
  data: ["#10b981", "#34d399"], // emerald
  go: ["#0ea5e9", "#38bdf8"], // sky
  desktop: ["#f97316", "#fb923c"], // orange
  gov: ["#64748b", "#94a3b8"], // slate
};

function cardStyle(cat) {
  const [c1, c2] = COLORS[cat] || ["#334155", "#475569"];
  return {
    background: `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)`,
  };
}

function sizeToSpans(size) {
  switch (size) {
    case "2x2": return { gridColumn: "span 2", gridRow: "span 2" };
    case "2x1": return { gridColumn: "span 2", gridRow: "span 1" };
    case "1x2": return { gridColumn: "span 1", gridRow: "span 2" };
    default: return { gridColumn: "span 1", gridRow: "span 1" };
  }
}

export default function BentoShowcase() {
  return (
    <section className="bento-wrap">
      <header className="bento-head">
        <h2>What we’re building</h2>
        <p className="muted">Packed grid, with imagery on large tiles.</p>
      </header>

      <div className="bento-grid">
        {DATA.map((item) => {
          const Icon = ICONS[item.icon] ?? FiSettings;
          const hasImg = item.image && item.size !== "1x1"; // show images only on larger sizes
          return (
            <article
              key={item.id}
              className={`card ${hasImg ? "card--hasimg" : ""}`}
              style={{ ...cardStyle(item.cat), ...sizeToSpans(item.size) }}
              role="region"
              aria-label={item.title}
            >
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

        .bento-grid{max-width:1200px;margin:0 auto;display:grid;gap:14px;grid-auto-rows:160px;grid-auto-flow:dense;
          grid-template-columns:repeat(12,minmax(0,1fr));}

        @media (max-width:1200px){.bento-grid{grid-template-columns:repeat(10,1fr)}}
        @media (max-width:980px){.bento-grid{grid-template-columns:repeat(8,1fr);grid-auto-rows:150px}}
        @media (max-width:760px){.bento-grid{grid-template-columns:repeat(4,1fr);grid-auto-rows:140px}}
        @media (max-width:520px){.bento-grid{grid-template-columns:repeat(2,1fr);grid-auto-rows:auto}}

        .card{position:relative;border-radius:16px;border:1px solid var(--line);box-shadow:0 8px 24px rgba(0,0,0,.22);
          padding:14px;display:flex;flex-direction:column;justify-content:space-between;min-height:0;overflow:hidden}
        .card:before{content:"";position:absolute;inset:0;background:radial-gradient(100% 100% at 0% 0%,rgba(255,255,255,.12),rgba(255,255,255,.05) 40%,transparent 70%);mix-blend:overlay;pointer-events:none}
        .card .card-top{position:relative;z-index:2;display:grid;grid-template-columns:auto 1fr;align-items:center;gap:10px}
        .card .icon{width:32px;height:32px;display:grid;place-items:center;background:rgba(255,255,255,.2);border:1px solid rgba(255,255,255,.25);border-radius:10px}
        .card .title{margin:0;font-size:15px}
        .card .body{position:relative;z-index:2;margin:8px 2px 0 2px;color:rgba(255,255,255,.95);font-size:13px}

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
