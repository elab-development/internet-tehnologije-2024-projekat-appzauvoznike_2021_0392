import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchMyProducts, deleteProduct } from "../../api/supplier";
import "./supplier.css";

const PER_PAGE_OPTIONS = [5, 10, 20, 50];

export default function SupplierProducts() {
  const [all, setAll] = useState([]);         // svi proizvodi (jednokratno učitani)
  const [q, setQ] = useState("");             // filter
  const [page, setPage] = useState(1);        // trenutna strana
  const [perPage, setPerPage] = useState(10); // broj po strani
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  // učitavanje svih proizvoda (jednom)
  const load = async () => {
    setLoading(true);
    setMsg(null);
    try {
      const { data } = await fetchMyProducts();
      setAll(data || []);
    } catch {
      setMsg("Greška pri učitavanju proizvoda.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // reset na prvu stranu kad se promene filter ili perPage
  useEffect(() => { setPage(1); }, [q, perPage]);

  // filtriranje (naziv ili šifra), case-insensitive
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return all;
    return all.filter(p =>
      (p.name || "").toLowerCase().includes(term) ||
      (p.code || "").toLowerCase().includes(term)
    );
  }, [all, q]);

  // paginacija
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * perPage;
  const pageItems = filtered.slice(start, start + perPage);

  const onDelete = async (id) => {
    if (!window.confirm("Obrisati proizvod?")) return;
    await deleteProduct(id);
    setAll(list => list.filter(p => p.id !== id)); // optimistički update
  };

  const Pager = () => (
    <div className="pager">
      <div className="pager-left">
        Prikaz {total ? Math.min(total, start + 1) : 0}–{Math.min(total, start + pageItems.length)} od {total}
      </div>
      <div className="pager-right">
        <button
          className="btn btn--ghost"
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={safePage <= 1}
        >
          ‹ Prethodna
        </button>
        <span className="pager-num">Strana {safePage} / {totalPages}</span>
        <button
          className="btn btn--ghost"
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={safePage >= totalPages}
        >
          Sledeća ›
        </button>
        <select
          className="select pager-select"
          value={perPage}
          onChange={(e) => setPerPage(Number(e.target.value))}
        >
          {PER_PAGE_OPTIONS.map(n => <option key={n} value={n}>{n} / str.</option>)}
        </select>
      </div>
    </div>
  );

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
          placeholder="Pretraga po nazivu ili šifri"
        />
      </div>

      {msg && <div className="alert">{msg}</div>}

      <Pager />

      <div className="table-responsive">
        <table className="table table--tight">
          <thead>
            <tr>
              <th>Šifra</th>
              <th>Naziv</th>
              <th>Cena</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((p) => (
              <tr key={p.id}>
                <td data-label="Šifra">{p.code}</td>
                <td data-label="Naziv">{p.name}</td>
                <td data-label="Cena">
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
            {!pageItems.length && !loading && (
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

      <Pager />
    </div>
  );
}
