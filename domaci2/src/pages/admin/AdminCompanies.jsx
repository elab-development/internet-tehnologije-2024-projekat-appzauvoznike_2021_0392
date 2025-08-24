import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import "../supplier/supplier.css";

export default function AdminCompanies() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const load = async () => {
    setLoading(true); setMsg(null);
    try {
      const { data } = await api.get("/admin/companies");
      setItems(data || []);
    } catch {
      setMsg("Greška pri učitavanju kompanija.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <h3>Kompanije</h3>
      {msg && <div className="alert">{msg}</div>}

      <div className="table-responsive">
        <table className="table table--tight">
          <thead>
            <tr>
              <th>#</th>
              <th>Naziv</th>
              <th>Tip</th>
              <th>Zemlja</th>
            </tr>
          </thead>
          <tbody>
            {items.map(c => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.name}</td>
                <td>{c.type}</td>
                <td>{c.country}</td>
              </tr>
            ))}
            {!items.length && !loading && (
              <tr><td colSpan={4}><div className="empty">Nema kompanija.</div></td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
