 
import React, { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";

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

  // priprema podataka za grafikon “Ponude po mesecu”
  const offersSeries = useMemo(() => {
    const map = new Map();
    (offers || []).forEach(o => {
      const k = monthKey(o.created_at) || "N/A";
      map.set(k, (map.get(k) || 0) + 1);
    });
    // uzmi poslednjih 6 meseci, čak i ako neki nemaju vrednost
    const now = new Date();
    const labels = [];
    for (let i=5; i>=0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth()-i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;
      labels.push(key);
    }
    const points = labels.map(k => ({ x: k, y: map.get(k) || 0 }));
    return points;
  }, [offers]);

  return (
    <>
      {msg && <div className="alert">{msg}</div>}

      <section className="kpi">
        <KpiCard title="Kompanije" value={companies.length} sub="ukupno registrovanih" />
        <KpiCard title="Partnerstva" value={partnerships.length} sub="importer ↔ supplier" />
        <KpiCard title="Proizvodi" value={products.length} sub="u katalogu" />
        <KpiCard title="Ponude" value={offers.length} sub="objavljeno" />
        <KpiCard title="Kontejneri" value={containers.length} sub="kreirano" />
      </section>

      <section className="panel">
        <div className="panel__head">
          <h3>Ponude po mesecima</h3>
          <span className="muted">poslednjih 6 meseci</span>
        </div>
        <SimpleLineChart data={offersSeries} height={220} />
      </section>

      <section className="panel panel--features">
        <h3>Šta admin može?</h3>
        <p>
          Administrator ima potpun uvid u sve entitete sistema, kao i mogućnost upravljanja njima.
          Može da kreira, menja i briše kompanije, da nadgleda i uređuje partnerstva, pregleda
          proizvode i ponude kroz različite kriterijume, i prati tok kontejnera. Ovaj pregled služi
          kao centralno mesto za monitoring i brze akcije u vezi sa podacima i uspostavljenim
          odnosima između uvoznika i dobavljača.
        </p>
      </section>

      {loading && <div className="muted" style={{marginTop:12}}>Učitavam…</div>}
    </>
  );
}

function KpiCard({ title, value, sub }) {
  return (
    <div className="kpi__card">
      <div className="kpi__value">{value}</div>
      <div className="kpi__title">{title}</div>
      <div className="kpi__sub">{sub}</div>
    </div>
  );
}

// Jednostavan SVG line chart bez dodatnih biblioteka
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
        {/* axes */}
        <line x1={padding} y1={height-padding} x2={width-padding} y2={height-padding} className="ch-axis"/>
        <line x1={padding} y1={padding} x2={padding} y2={height-padding} className="ch-axis"/>
        {/* line */}
        <polyline fill="none" strokeWidth="2" className="ch-line" points={poly} />
        {/* dots + labels */}
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
