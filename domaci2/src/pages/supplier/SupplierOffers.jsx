import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchMyOffers, deleteOffer } from "../../api/supplier";

export default function SupplierOffers() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const load = async () => {
    setLoading(true); setMsg(null);
    try {
      const { data } = await fetchMyOffers();
      setItems(data);
    } catch {
      setMsg("Greška pri učitavanju ponuda.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onDelete = async (id) => {
    if (!window.confirm("Obrisati ponudu?")) return;
    await deleteOffer(id);
    load();
  };

  return (
    <div className="container page">
      <div className="page-head">
        <h2>Moje ponude</h2>
        <Link to="/supplier/offers/new" className="btn btn--primary">+ Nova ponuda</Link>
      </div>

      {msg && <div className="alert">{msg}</div>}

      <table className="table">
        <thead>
          <tr>
            <th>Naslov</th>
            <th>Status</th>
            <th>Važi</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map(o => (
            <tr key={o.id}>
              <td>{o.title}</td>
              <td>{o.status}</td>
              <td>{(o.valid_from || "-")} → {(o.valid_to || "-")}</td>
              <td className="actions">
                <Link to={`/supplier/offers/${o.id}/edit`}>Izmeni</Link>{" "}
                |{" "}
                <button className="link danger" onClick={() => onDelete(o.id)}>Obriši</button>
              </td>
            </tr>
          ))}
          {!items.length && !loading && (
            <tr><td colSpan={4}><div className="empty">Nema ponuda.</div></td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
