// src/pages/importer/ImporterPartnerships.jsx
import React, { useEffect, useState, useMemo } from "react";
import { listPartnerships, createPartnership, deletePartnership } from "../../api/importer";
import { useAuth } from "../../context/AuthContext";
import useCompanies from "../../hooks/useCompanies";         // ⟵ dodato
import "../supplier/supplier.css";

export default function ImporterPartnerships() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  // --- Companies (public) — koristimo samo SUPPLIER firme za dropdown
  const { companies, loading: loadingCompanies, error: companiesError } = useCompanies("/companies-public");
  const supplierOptions = useMemo(
    () =>
      (companies || []).filter(
        (c) => String(c.type || "").toLowerCase() === "supplier"
      ),
    [companies]
  );

  // forma za dodavanje
  const [supplierId, setSupplierId] = useState("");
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const load = async () => {
    setLoading(true);
    setMsg(null);
    try {
      const { data } = await listPartnerships();
      setItems(data || []);
    } catch (e) {
      setMsg(e?.response?.data?.message || "Greška pri učitavanju partnerstava.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onCreate = async (e) => {
    e.preventDefault();
    if (!user?.company?.id) { setMsg("Nedostaje ID kompanije importera."); return; }
    if (!supplierId) { setMsg("Odaberi dobavljača iz liste."); return; }

    setCreating(true);
    setMsg(null);
    try {
      await createPartnership({
        importer_company_id: user.company.id,
        supplier_company_id: Number(supplierId),
        status: "pending",
      });
      setSupplierId("");
      await load(); // povuci sveže iz baze
    } catch (e) {
      setMsg(e?.response?.data?.message || "Greška pri dodavanju partnerstva.");
    } finally {
      setCreating(false);
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm("Obrisati partnerstvo?")) return;
    setDeletingId(id);
    setMsg(null);
    try {
      await deletePartnership(id);                // brisanje u bazi
      setItems(arr => arr.filter(x => x.id !== id)); // pa ažuriramo UI
    } catch (e) {
      setMsg(e?.response?.data?.message || "Greška pri brisanju partnerstva.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="container page">
      <div className="page-head">
        <h2>Partnerstva</h2>
      </div>

      {msg && <div className="alert">{msg}</div>}
      {companiesError && <div className="alert">{companiesError}</div>}

      <form onSubmit={onCreate} className="form" style={{ marginBottom: 16 }}>
        <div className="grid grid-3">
          <div className="field">
            <label>Dobavljač</label>
            <select
              className="select"
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
              disabled={creating || loadingCompanies}
            >
              <option value="">
                {loadingCompanies ? "Učitavanje dobavljača…" : "— Odaberi dobavljača —"}
              </option>
              {supplierOptions.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} (#{c.id})
                </option>
              ))}
            </select>
          </div>

          <div className="field" style={{ display: "flex", alignItems: "flex-end" }}>
            <button className="btn btn--primary" disabled={creating || loadingCompanies || !supplierOptions.length}>
              {creating ? "Dodajem..." : "Dodaj partnerstvo"}
            </button>
          </div>
        </div>
      </form>

      <div className="table-responsive">
        <table className="table table--tight">
          <thead>
            <tr>
              <th>#</th>
              <th>Importer</th>
              <th>Supplier</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id}>
                <td data-label="#">{p.id}</td>
                <td data-label="Importer">
                  {p.importer?.name} (#{p.importer?.id})
                </td>
                <td data-label="Supplier">
                  {p.supplier?.name} (#{p.supplier?.id})
                </td>
                <td data-label="Status">
                  <span className={`badge badge--${p.status}`}>{p.status}</span>
                </td>
                <td className="actions">
                  <button
                    className="link danger"
                    onClick={() => onDelete(p.id)}
                    disabled={deletingId === p.id}
                  >
                    {deletingId === p.id ? "Brišem..." : "Obriši"}
                  </button>
                </td>
              </tr>
            ))}
            {!items.length && !loading && (
              <tr>
                <td colSpan={5}>
                  <div className="empty">Nema partnerstava.</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
