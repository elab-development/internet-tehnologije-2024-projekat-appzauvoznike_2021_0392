import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listContainers, deleteContainer } from "../../api/importer";
import "../supplier/supplier.css";

export default function ImporterContainers() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const load = async () => {
    setLoading(true); setMsg(null);
    try {
      const { data } = await listContainers();
      setItems(data || []);
    } catch {
      setMsg("Greška pri učitavanju kontejnera.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onDelete = async (id) => {
    if (!window.confirm("Obrisati kontejner?")) return;
    await deleteContainer(id);
    setItems(xs => xs.filter(x => x.id !== id));
  };

  return (
    <div className="container page">
      <div className="page-head">
        <h2>Kontejneri</h2>
        <Link className="btn btn--primary" to="/importer/containers/new">+ Novi kontejner</Link>
      </div>

      {msg && <div className="alert">{msg}</div>}

      <div className="table-responsive">
        <table className="table table--tight">
          <thead>
            <tr>
              <th>#</th>
              <th>Tip</th>
              <th>Status</th>
              <th>Freight</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map(c => (
              <tr key={c.id}>
                <td data-label="#">{c.id}</td>
                <td data-label="Tip">{c.container_type}</td>
                <td data-label="Status"><span className={`badge badge--${c.status}`}>{c.status}</span></td>
                <td data-label="Freight">
                  {c.estimated_freight_cost ?? "-"} {c.currency}
                </td>
                <td className="actions">
                  <Link to={`/importer/containers/${c.id}/edit`}>Izmeni</Link>{" "}
                  |{" "}
                  <button className="link danger" onClick={()=>onDelete(c.id)}>Obriši</button>
                </td>
              </tr>
            ))}
            {!items.length && !loading && (
              <tr><td colSpan={5}><div className="empty">Nema kontejnera.</div></td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
