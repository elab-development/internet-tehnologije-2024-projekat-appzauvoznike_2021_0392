import React, { useEffect, useState } from "react";
import { searchSuppliers } from "../../api/importer";
import "../supplier/supplier.css";

export default function ImporterSuppliers() {
  const [q, setQ] = useState("");
  const [country, setCountry] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const load = async () => {
    setLoading(true); setMsg(null);
    try {
      const { data } = await searchSuppliers({
        q: q || undefined,
        country: country || undefined,
      });
      setItems(data || []);
    } catch {
      setMsg("Greška pri pretrazi dobavljača.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line*/ }, []);

  return (
    <div className="container page">
      <div className="page-head">
        <h2>Pretraga dobavljača</h2>
      </div>

      <div className="tools">
        <input className="input" placeholder="Naziv ili šifra"
          value={q} onChange={(e)=>setQ(e.target.value)} />
        <input className="input" placeholder="Zemlja (npr. CN, RS)"
          value={country} onChange={(e)=>setCountry(e.target.value)} style={{width:120}} />
        <button className="btn btn--ghost" onClick={load} disabled={loading}>Traži</button>
      </div>

      {msg && <div className="alert">{msg}</div>}

      <div className="table-responsive">
        <table className="table table--tight">
          <thead>
            <tr>
              <th>Naziv</th>
              <th>Zemlja</th>
              <th>Tip</th>
            </tr>
          </thead>
          <tbody>
            {items.map(c => (
              <tr key={c.id}>
                <td data-label="Naziv">{c.name}</td>
                <td data-label="Zemlja">{c.country || "-"}</td>
                <td data-label="Tip">{c.type || "-"}</td>
              </tr>
            ))}
            {!items.length && !loading && (
              <tr><td colSpan={3}><div className="empty">Nema rezultata.</div></td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
