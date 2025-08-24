import React, { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";

/* util za yyyy-mm */
const monthKey = (iso) => {
  if (!iso) return null;
  const d = new Date(iso);
  if (isNaN(d)) return null;
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;
};

export default function AdminOverview() {
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);

  const [companies, setCompanies] = useState([]);
  const [partnerships, setPartnerships] = useState([]);
  const [products, setProducts] = useState([]);
  const [offers, setOffers] = useState([]);
  const [containers, setContainers] = useState([]);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true); setMsg(null);
      try {
        const [c, ptn, prd, off, ctr] = await Promise.all([
          api.get("/admin/companies"),
          api.get("/admin/partnerships"),
          api.get("/admin/products"),
          api.get("/admin/offers"),
          api.get("/admin/containers"),
        ]);
        if (!active) return;
        setCompanies(c.data || []);
        setPartnerships(ptn.data || []);
        setProducts(prd.data || []);
        setOffers(off.data || []);
        setContainers(ctr.data || []);
      } catch (e) {
        if (!active) return;
        setMsg(e?.response?.data?.message || "Greška pri učitavanju podataka.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  /* ====== 1) Ponude po mesecima (linija) ====== */
  const offersSeries = useMemo(() => {
    const map = new Map();
    (offers || []).forEach(o => {
      const k = monthKey(o.created_at) || "N/A";
      map.set(k, (map.get(k) || 0) + 1);
    });
    const now = new Date();
    const labels = [];
    for (let i=5; i>=0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth()-i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;
      labels.push(key);
    }
    return labels.map(k => ({ x: k, y: map.get(k) || 0 }));
  }, [offers]);

  /* ====== 2) Partnerstva po statusu (doughnut) ====== */
  const partnershipsByStatus = useMemo(() => {
    const tally = {};
    (partnerships || []).forEach(p => {
      const s = (p.status || "unknown").toLowerCase();
      tally[s] = (tally[s] || 0) + 1;
    });
    return Object.entries(tally).map(([label, value]) => ({ label, value }));
  }, [partnerships]);

  /* ====== 3) Kontejneri po statusu (doughnut) ====== */
  const containersByStatus = useMemo(() => {
    const tally = {};
    (containers || []).forEach(c => {
      const s = (c.status || "unknown").toLowerCase();
      tally[s] = (tally[s] || 0) + 1;
    });
    return Object.entries(tally).map(([label, value]) => ({ label, value }));
  }, [containers]);

  /* ====== 4) Kompanije po tipu (horizontal bar) ====== */
  const companiesByType = useMemo(() => {
    const tally = {};
    (companies || []).forEach(co => {
      const t = (co.type || "other").toLowerCase();
      tally[t] = (tally[t] || 0) + 1;
    });
    const arr = Object.entries(tally).map(([label, value]) => ({ label, value }));
    arr.sort((a,b)=>b.value-a.value);
    return arr;
  }, [companies]);

  /* ====== 5) Proizvodi po valuti (doughnut) – top 5 + Ostalo ====== */
  const productsByCurrency = useMemo(() => {
    const tally = {};
    (products || []).forEach(p => {
      const c = (p.currency || "N/A").toUpperCase();
      tally[c] = (tally[c] || 0) + 1;
    });
    const arr = Object.entries(tally).map(([label, value]) => ({ label, value }));
    arr.sort((a,b)=>b.value-a.value);
    const top = arr.slice(0,5);
    const rest = arr.slice(5).reduce((s,x)=>s+x.value,0);
    return rest ? [...top, { label:"Ostalo", value:rest }] : top;
  }, [products]);

  return (
    <>
      {msg && <div className="alert">{msg}</div>}

      {/* KPI */}
      <section className="kpi">
        <KpiCard title="Kompanije" value={companies.length} sub="ukupno registrovanih" />
        <KpiCard title="Partnerstva" value={partnerships.length} sub="importer ↔ supplier" />
        <KpiCard title="Proizvodi" value={products.length} sub="u katalogu" />
        <KpiCard title="Ponude" value={offers.length} sub="objavljeno" />
        <KpiCard title="Kontejneri" value={containers.length} sub="kreirano" />
      </section>

      {/* 1) Line chart */}
      <section className="panel">
        <div className="panel__head">
          <h3>Ponude po mesecima</h3>
          <span className="muted">poslednjih 6 meseci</span>
        </div>
        <SimpleLineChart data={offersSeries} height={220} />
      </section>

      {/* 2 + 3) Dva doughnut-a u mreži */}
      <section className="panel" style={{marginTop:14}}>
        <div className="panel__head">
          <h3>Struktura sistema</h3>
          <span className="muted">statusi i raspodela</span>
        </div>
        <div className="kpi" style={{gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))"}}>
          <div className="kpi__card">
            <div className="kpi__title" style={{marginBottom:8}}>Partnerstva po statusu</div>
            <SimpleDonutChart data={partnershipsByStatus} size={220} />
          </div>
          <div className="kpi__card">
            <div className="kpi__title" style={{marginBottom:8}}>Kontejneri po statusu</div>
            <SimpleDonutChart data={containersByStatus} size={220} />
          </div>
          <div className="kpi__card">
            <div className="kpi__title" style={{marginBottom:8}}>Proizvodi po valuti</div>
            <SimpleDonutChart data={productsByCurrency} size={220} />
          </div>
        </div>
      </section>

      {/* 4) Horizontal bar: kompanije po tipu */}
      <section className="panel">
        <div className="panel__head">
          <h3>Kompanije po tipu</h3>
          <span className="muted">rangirano</span>
        </div>
        <SimpleBarChart data={companiesByType} height={260} />
      </section>

      {loading && <div className="muted" style={{marginTop:12}}>Učitavam…</div>}
    </>
  );
}

/* === Cards === */
function KpiCard({ title, value, sub }) {
  return (
    <div className="kpi__card">
      <div className="kpi__value">{value}</div>
      <div className="kpi__title">{title}</div>
      <div className="kpi__sub">{sub}</div>
    </div>
  );
}

/* === Line chart (postojeći) === */
function SimpleLineChart({ data, height=220, padding=24 }) {
  const width = 680;
  const innerW = width - padding*2;
  const innerH = height - padding*2;

  const maxY = Math.max(1, ...data.map(d=>d.y||0));
  const stepX = innerW / Math.max(1, data.length-1);

  const points = data.map((d,i) => {
    const x = padding + i*stepX;
    const y = padding + innerH - (innerH * (d.y/maxY));
    return { x, y, label: d.x, value: d.y };
  });

  const poly = points.map(p => `${p.x},${p.y}`).join(" ");

  return (
    <div className="chart">
      <svg width="100%" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Line chart">
        <line x1={padding} y1={height-padding} x2={width-padding} y2={height-padding} className="ch-axis"/>
        <line x1={padding} y1={padding} x2={padding} y2={height-padding} className="ch-axis"/>
        <polyline fill="none" strokeWidth="2" className="ch-line" points={poly} />
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="3" className="ch-dot" />
            <text x={p.x} y={height-padding+14} textAnchor="middle" className="ch-xlbl">{p.label.slice(5)}</text>
            <text x={p.x} y={p.y-8} textAnchor="middle" className="ch-ylbl">{p.value}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

/* === Doughnut chart (generic) === */
function SimpleDonutChart({ data=[], size=220, stroke=18 }) {
  const total = Math.max(1, data.reduce((s,d)=>s+(d.value||0),0));
  const cx = size/2, cy = size/2, r = (size/2) - stroke/2;

  // jednostavna paleta (dark-friendly)
  const colors = [
    "hsl(228 100% 72%)", // accent
    "hsl(210 100% 66%)",
    "hsl(168 64% 56%)",
    "hsl(38 92% 60%)",
    "hsl(350 95% 66%)",
    "hsl(270 85% 72%)",
    "hsl(0 0% 70%)",
  ];

  let offset = 0;
  const arcs = data.map((d, i) => {
    const frac = (d.value || 0) / total;
    const length = frac * 2 * Math.PI * r;
    const dasharray = `${length} ${2 * Math.PI * r - length}`;
    const dashoffset = -offset * 2 * Math.PI * r;
    offset += frac;
    return { label: d.label, value: d.value, color: colors[i % colors.length], dasharray, dashoffset };
  });

  return (
    <div className="chart" style={{display:"grid", placeItems:"center"}}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Donut chart">
        {/* bg ring */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth={stroke} />
        {/* slices */}
        {arcs.map((a, i) => (
          <circle
            key={i}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={a.color}
            strokeWidth={stroke}
            strokeDasharray={a.dasharray}
            strokeDashoffset={a.dashoffset}
            className="ch-slice"
          />
        ))}
        {/* label in center */}
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" className="ch-ylbl">
          {total}
        </text>
      </svg>

      {/* legenda ispod */}
      <div style={{display:"grid", gap:6, marginTop:8}}>
        {arcs.map((a,i)=>(
          <div key={i} style={{display:"flex", alignItems:"center", gap:8, color:"var(--text-soft)"}}>
            <span style={{width:10,height:10,background:a.color,display:"inline-block",borderRadius:2}} />
            <span style={{fontSize:12}}>{a.label}</span>
            <span style={{marginLeft:"auto", fontSize:12, color:"var(--muted)"}}>{data[i].value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* === Horizontal bar chart === */
function SimpleBarChart({ data=[], height=260, padding=28 }) {
  // prikazujemo do 8 redova
  const rows = data.slice(0,8);
  const width = 680;
  const innerW = width - padding*2;
  const rowH = Math.max(22, (height - padding*2) / Math.max(1, rows.length));
  const maxV = Math.max(1, ...rows.map(r=>r.value||0));

  return (
    <div className="chart">
      <svg width="100%" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Bar chart">
        <line x1={padding} y1={padding} x2={padding} y2={height-padding} className="ch-axis"/>
        {rows.map((r, i) => {
          const y = padding + i*rowH + 4;
          const w = (r.value / maxV) * innerW;
          return (
            <g key={r.label}>
              <rect x={padding} y={y} width={w} height={rowH-8} rx="6" className="ch-bar"/>
              <text x={padding-8} y={y + (rowH-8)/2} dominantBaseline="middle" textAnchor="end" className="ch-xlbl">
                {r.label}
              </text>
              <text x={padding + w + 8} y={y + (rowH-8)/2} dominantBaseline="middle" className="ch-ylbl">
                {r.value}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
