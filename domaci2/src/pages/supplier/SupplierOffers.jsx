// src/pages/supplier/offers/SupplierOffers.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchMyOffers, deleteOffer } from "../../../api/supplier";

export default function SupplierOffers() {
  const [items, setItems] = useState([]);

  const load = async () => {
    const { data } = await fetchMyOffers();
    setItems(data);
  };
  useEffect(()=>{ load(); }, []);

  const onDelete = async(id) => {
    if (!window.confirm("Obrisati ponudu?")) return;
    await deleteOffer(id); load();
  };

  return (
    <div className="container">
      <div className="flex-between">
        <h2>Moje ponude</h2>
        <Link to="/supplier/offers/new" className="btn">+ Nova ponuda</Link>
      </div>

      <table className="table">
        <thead><tr><th>Naslov</th><th>Status</th><th>Vazi od-do</th><th></th></tr></thead>
        <tbody>
          {items.map(o=>(
            <tr key={o.id}>
              <td>{o.title}</td>
              <td>{o.status}</td>
              <td>{o.valid_from || "-"} → {o.valid_to || "-"}</td>
              <td className="actions">
                <Link to={`/supplier/offers/${o.id}/edit`}>Izmeni</Link>{" | "}
                <button className="link danger" onClick={()=>onDelete(o.id)}>Obriši</button>
              </td>
            </tr>
          ))}
          {!items.length && <tr><td colSpan={4}>Nema podataka.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
