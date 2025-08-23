
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteProduct, fetchMyProducts, searchMyProducts } from "../../api/supplier";
import './supplier.css';
export default function SupplierProducts() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");

  const load = async () => {
    const { data } = q
      ? await searchMyProducts({ name: q })
      : await fetchMyProducts();
    setItems(data);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const onDelete = async (id) => {
    if (!window.confirm("Obrisati proizvod?")) return;
    await deleteProduct(id);
    load();
  };

  return (
    <div className="container">
      <div className="flex-between">
        <h2>Moji proizvodi</h2>
        <Link className="btn" to="/supplier/products/new">+ Novi proizvod</Link>
      </div>

      <div style={{ margin: "10px 0" }}>
        <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Pretraga po nazivu" />
        <button className="btn btn--ghost" onClick={load}>Traži</button>
      </div>

      <table className="table">
        <thead><tr><th>Šifra</th><th>Naziv</th><th>Cena</th><th></th></tr></thead>
        <tbody>
          {items.map(p=>(
            <tr key={p.id}>
              <td>{p.code}</td>
              <td>{p.name}</td>
              <td>{p.base_price} {p.currency}</td>
              <td className="actions">
                <Link to={`/supplier/products/${p.id}/edit`}>Izmeni</Link>{" | "}
                <Link to={`/supplier/products/${p.id}/images`}>Slike</Link>{" | "}
                <button className="link danger" onClick={()=>onDelete(p.id)}>Obriši</button>
              </td>
            </tr>
          ))}
          {!items.length && <tr><td colSpan={4}>Nema podataka.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
