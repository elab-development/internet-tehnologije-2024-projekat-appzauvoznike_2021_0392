// src/pages/admin/AdminPartnerships.jsx
import React, { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";
import useCompanies from "../../hooks/useCompanies";
import "../supplier/supplier.css";

const STATUS_OPTS = ["pending", "active", "blocked"];

const EMPTY_CREATE = {
  importer_company_id: "",
  supplier_company_id: "",
  status: "pending",
  started_at: "",
  ended_at: "",
  notes: "",
};

export default function AdminPartnerships() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  // create
  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState(EMPTY_CREATE);
  const [createErrors, setCreateErrors] = useState({});
  const chCreate = (e) =>
    setCreateForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  // edit inline
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    status: "pending",
    started_at: "",
    ended_at: "",
    notes: "",
  });
  const chEdit = (e) =>
    setEditForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  // companies for selects
  const {
    companies,
    loading: companiesLoading,
    error: companiesError,
  } = useCompanies("/companies-public");

  const importers = useMemo(
    () => companies.filter((c) => c.type === "importer"),
    [companies]
  );
  const suppliers = useMemo(
    () => companies.filter((c) => c.type === "supplier"),
    [companies]
  );

  const load = async () => {
    setLoading(true);
    setMsg(null);
    try {
      const { data } = await api.get("/admin/partnerships");
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setMsg(e?.response?.data?.message || "Greška pri učitavanju partnerstava.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // ---------- create ----------
  const onCreate = async (e) => {
    e.preventDefault();
    if (!createForm.importer_company_id || !createForm.supplier_company_id) {
      setMsg("Odaberi i importera i dobavljača.");
      return;
    }
    setCreating(true);
    setMsg(null);
    setCreateErrors({});
    try {
      const payload = {
        importer_company_id: Number(createForm.importer_company_id),
        supplier_company_id: Number(createForm.supplier_company_id),
        status: createForm.status,
        started_at: createForm.started_at || null,
        ended_at: createForm.ended_at || null,
        notes: createForm.notes || null,
      };
      const { data } = await api.post("/admin/partnerships", payload);
      setItems((arr) => [data, ...arr]);
      setCreateForm(EMPTY_CREATE);
    } catch (e) {
      const res = e?.response?.data;
      setMsg(res?.message || "Greška pri dodavanju partnerstva.");
      if (res?.errors) setCreateErrors(res.errors);
    } finally {
      setCreating(false);
    }
  };

  // ---------- edit ----------
  const beginEdit = (p) => {
    setEditId(p.id);
    setEditForm({
      status: p.status || "pending",
      started_at: (p.started_at || "").slice(0, 10), // yyyy-mm-dd
      ended_at: (p.ended_at || "").slice(0, 10),
      notes: p.notes || "",
    });
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditForm({
      status: "pending",
      started_at: "",
      ended_at: "",
      notes: "",
    });
  };

  const saveEdit = async (id) => {
    setMsg(null);
    try {
      const payload = {
        status: editForm.status,
        started_at: editForm.started_at || null,
        ended_at: editForm.ended_at || null,
        notes: editForm.notes || null,
      };
      const { data } = await api.put(`/admin/partnerships/${id}`, payload);
      setItems((arr) => arr.map((x) => (x.id === id ? data : x)));
      cancelEdit();
    } catch (e) {
      setMsg(e?.response?.data?.message || "Greška pri izmeni partnerstva.");
    }
  };

  // quick status actions
  const setStatus = async (p, newStatus) => {
    try {
      const { data } = await api.put(`/admin/partnerships/${p.id}`, {
        status: newStatus,
      });
      setItems((arr) => arr.map((x) => (x.id === p.id ? data : x)));
    } catch (e) {
      setMsg(e?.response?.data?.message || "Greška pri promeni statusa.");
    }
  };

  // ---------- delete ----------
  const onDelete = async (id) => {
    if (!window.confirm("Obrisati partnerstvo?")) return;
    setMsg(null);
    try {
      await api.delete(`/admin/partnerships/${id}`);
      setItems((arr) => arr.filter((x) => x.id !== id));
    } catch (e) {
      setMsg(e?.response?.data?.message || "Greška pri brisanju partnerstva.");
    }
  };

  return (
    <div className="container page">
      <div className="page-head">
        <h3>Partnerstva</h3>
      </div>

      {msg && <div className="alert">{msg}</div>}
      {companiesError && <div className="alert">{companiesError}</div>}

      {/* CREATE */}
      <form onSubmit={onCreate} className="form" style={{ marginBottom: 16 }}>
        <div className="grid grid-5">
          <div className="field">
            <label>Importer</label>
            <select
              name="importer_company_id"
              className="select"
              value={createForm.importer_company_id}
              onChange={chCreate}
              disabled={companiesLoading}
              required
            >
              <option value="">— Odaberi importera —</option>
              {importers.map((c) => (
                <option key={c.id} value={c.id}>
                  #{c.id} • {c.name}
                </option>
              ))}
            </select>
            {createErrors.importer_company_id && (
              <small className="err">{createErrors.importer_company_id[0]}</small>
            )}
          </div>

          <div className="field">
            <label>Supplier</label>
            <select
              name="supplier_company_id"
              className="select"
              value={createForm.supplier_company_id}
              onChange={chCreate}
              disabled={companiesLoading}
              required
            >
              <option value="">— Odaberi dobavljača —</option>
              {suppliers.map((c) => (
                <option key={c.id} value={c.id}>
                  #{c.id} • {c.name}
                </option>
              ))}
            </select>
            {createErrors.supplier_company_id && (
              <small className="err">{createErrors.supplier_company_id[0]}</small>
            )}
          </div>

          <div className="field">
            <label>Status</label>
            <select
              name="status"
              className="select"
              value={createForm.status}
              onChange={chCreate}
            >
              {STATUS_OPTS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Početak</label>
            <input
              type="date"
              name="started_at"
              value={createForm.started_at}
              onChange={chCreate}
            />
          </div>

          <div className="field">
            <label>Kraj</label>
            <input
              type="date"
              name="ended_at"
              value={createForm.ended_at}
              onChange={chCreate}
            />
          </div>
        </div>

        <div className="field" style={{ marginTop: 8 }}>
          <label>Beleška (opciono)</label>
          <input
            name="notes"
            value={createForm.notes}
            onChange={chCreate}
            placeholder="npr. specijalni uslovi, napomena…"
          />
        </div>

        <button className="btn btn--primary" disabled={creating}>
          {creating ? "Dodajem..." : "Dodaj partnerstvo"}
        </button>
      </form>

      {/* TABLE */}
      <div className="table-responsive">
        <table className="table table--tight">
          <thead>
            <tr>
              <th>#</th>
              <th>Importer</th>
              <th>Supplier</th>
              <th>Status</th>
              <th>Početak</th>
              <th>Kraj</th>
              <th>Beleška</th>
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
                  {editId === p.id ? (
                    <select
                      className="select w-100"
                      name="status"
                      value={editForm.status}
                      onChange={chEdit}
                    >
                      {STATUS_OPTS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  ) : (
                    <span className={`badge badge--${p.status}`}>{p.status}</span>
                  )}
                </td>

                <td data-label="Početak">
                  {editId === p.id ? (
                    <input
                      type="date"
                      className="input w-100"
                      name="started_at"
                      value={editForm.started_at}
                      onChange={chEdit}
                    />
                  ) : (
                    p.started_at ? p.started_at.slice(0,10) : "-"
                  )}
                </td>

                <td data-label="Kraj">
                  {editId === p.id ? (
                    <input
                      type="date"
                      className="input w-100"
                      name="ended_at"
                      value={editForm.ended_at}
                      onChange={chEdit}
                    />
                  ) : (
                    p.ended_at ? p.ended_at.slice(0,10) : "-"
                  )}
                </td>

                <td data-label="Beleška" style={{minWidth:180}}>
                  {editId === p.id ? (
                    <input
                      className="input w-100"
                      name="notes"
                      value={editForm.notes}
                      onChange={chEdit}
                      placeholder="napomena…"
                    />
                  ) : (
                    p.notes || "—"
                  )}
                </td>

                <td className="actions">
                  {editId === p.id ? (
                    <>
                      <button className="btn btn--ghost" onClick={() => saveEdit(p.id)} type="button">Sačuvaj</button>{" "}
                      <button className="link" onClick={cancelEdit} type="button">Otkaži</button>
                    </>
                  ) : (
                    <>
                      <button className="btn btn--ghost" onClick={() => beginEdit(p)} type="button">Izmeni</button>{" "}
                      <button className="btn btn--ghost" onClick={() => setStatus(p, "active")} type="button">Aktiviraj</button>{" "}
                      <button className="btn btn--ghost" onClick={() => setStatus(p, "blocked")} type="button">Blokiraj</button>{" "}
                      <button className="link danger" onClick={() => onDelete(p.id)} type="button">Obriši</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {!items.length && !loading && (
              <tr>
                <td colSpan={8}><div className="empty">Nema partnerstava.</div></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
