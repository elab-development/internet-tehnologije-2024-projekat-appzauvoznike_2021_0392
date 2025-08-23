// src/pages/supplier/SupplierProducts.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  fetchMyProducts,
  deleteProduct,
  searchMyProducts,
} from "../../api/supplier";
import "./supplier.css";

export default function SupplierProducts() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const load = async () => {
    setLoading(true);
    setMsg(null);
    try {
      const { data } = q
        ? await searchMyProducts({ name: q })
        : await fetchMyProducts();
      setItems(data);
    } catch {
      setMsg("Greška pri učitavanju proizvoda.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDelete = async (id) => {
    if (!window.confirm("Obrisati proizvod?")) return;
    await deleteProduct(id);
    load();
  };

  return (
    <div className="container page">
      <div className="page-head">
        <h2>Moji proizvodi</h2>
        <Link className="btn btn--primary" to="/supplier/products/new">
          + Novi proizvod
        </Link>
      </div>

      <div className="tools">
        <input
          className="input"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Pretraga po nazivu"
        />
        <button className="btn btn--ghost" onClick={load} disabled={loading}>
          Traži
        </button>
      </div>

      {msg && <div className="alert">{msg}</div>}

      <table className="table">
        <thead>
          <tr>
            <th>Šifra</th>
            <th>Naziv</th>
            <th>Cena</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((p) => (
            <tr key={p.id}>
              <td>{p.code}</td>
              <td>{p.name}</td>
              <td>
                {p.base_price} {p.currency}
              </td>
              <td className="actions">
                <Link to={`/supplier/products/${p.id}/edit`}>Izmeni</Link>{" "}
                |{" "}
                <Link to={`/supplier/products/${p.id}/images`}>Slike</Link>{" "}
                |{" "}
                <button className="link danger" onClick={() => onDelete(p.id)}>
                  Obriši
                </button>
              </td>
            </tr>
          ))}
          {!items.length && !loading && (
            <tr>
              <td colSpan={4}>
                <div className="empty">
                  Nema podataka. Klikni “+ Novi proizvod” da dodaš prvi.
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
