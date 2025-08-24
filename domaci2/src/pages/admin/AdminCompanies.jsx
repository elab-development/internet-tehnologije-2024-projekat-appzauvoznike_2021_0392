// src/pages/admin/AdminCompanies.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import api from "../../api/axios";
import "../supplier/supplier.css";

const EMPTY = {
  name: "",
  type: "supplier",   // "supplier" | "importer" | "other"
  country: "",
  city: "",
  address: "",
  tax_id: "",
};

const PER_PAGE_OPTIONS = [10, 20, 50, 100];

export default function AdminCompanies() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  // create form
  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState(EMPTY);
  const [createErrors, setCreateErrors] = useState({});
  const chCreate = (e) =>
    setCreateForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  // edit state (inline)
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState(EMPTY);
  const chEdit = (e) =>
    setEditForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  // filter + paginacija (client-side)
  const [q, setQ] = useState("");       // debounced query
  const [qRaw, setQRaw] = useState(""); // immediate input
  const [fltType, setFltType] = useState("");       // "", "supplier", "importer", "other"
  const [fltCountry, setFltCountry] = useState(""); // npr. "RS"
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);

  // debounce za pretragu (250ms)
  useEffect(() => {
    const t = setTimeout(() => setQ(qRaw), 250);
    return () => clearTimeout(t);
  }, [qRaw]);

  // prečica "/" fokusira search
  const searchRef = useRef(null);
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "/" && !e.target.closest("input,select,textarea,button")) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const load = async () => {
    setLoading(true);
    setMsg(null);
    try {
      const { data } = await api.get("/admin/companies");
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setMsg(e?.response?.data?.message || "Greška pri učitavanju kompanija.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // resetuj stranu kad se promene filteri/perPage
  useEffect(() => { setPage(1); }, [q, fltType, fltCountry, perPage]);

  const onCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    setMsg(null);
    setCreateErrors({});
    try {
      const payload = {
        name: createForm.name,
        type: createForm.type || "other",
        country: createForm.country || null,
        city: createForm.city,
        address: createForm.address,
        tax_id: createForm.tax_id || null,
      };
      const { data } = await api.post("/admin/companies", payload);
      setItems((arr) => [data, ...arr]);
      setCreateForm(EMPTY);
    } catch (e) {
      const res = e?.response?.data;
      setMsg(res?.message || "Greška pri dodavanju kompanije.");
      if (res?.errors) setCreateErrors(res.errors);
    } finally {
      setCreating(false);
    }
  };

  const startEdit = (c) => {
    setEditId(c.id);
    setEditForm({
      name: c.name || "",
      type: c.type || "other",
      country: c.country || "",
      city: c.city || "",
      address: c.address || "",
      tax_id: c.tax_id || "",
    });
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditForm(EMPTY);
  };

  const saveEdit = async (id) => {
    setMsg(null);
    try {
      const payload = {
        name: editForm.name,
        type: editForm.type || "other",
        country: editForm.country || null,
        city: editForm.city,
        address: editForm.address,
        tax_id: editForm.tax_id || null,
      };
      const { data } = await api.put(`/admin/companies/${id}`, payload);
      setItems((arr) => arr.map((x) => (x.id === id ? data : x)));
      cancelEdit();
    } catch (e) {
      setMsg(e?.response?.data?.message || "Greška pri izmeni kompanije.");
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm("Obrisati kompaniju?")) return;
    setMsg(null);
    try {
      await api.delete(`/admin/companies/${id}`);
      setItems((arr) => arr.filter((x) => x.id !== id));
    } catch (e) {
      setMsg(e?.response?.data?.message || "Greška pri brisanju kompanije.");
    }
  };

  // ============ FILTER ============ //
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return items.filter((c) => {
      if (fltType && String(c.type || "").toLowerCase() !== fltType) return false;
      if (fltCountry && String(c.country || "").toUpperCase() !== fltCountry.toUpperCase()) return false;

      if (!term) return true;
      const inName = String(c.name || "").toLowerCase().includes(term);
      const inCity = String(c.city || "").toLowerCase().includes(term);
      const inAddr = String(c.address || "").toLowerCase().includes(term);
      const inTax  = String(c.tax_id || "").toLowerCase().includes(term);
      return inName || inCity || inAddr || inTax;
    });
  }, [items, q, fltType, fltCountry]);

  // ============ PAGINACIJA ============ //
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * perPage;
  const pageItems = filtered.slice(start, start + perPage);

  const Pager = () => (
    <div className="pager">
      <div className="pager-left">
        Prikaz {total ? Math.min(total, start + 1) : 0}–{Math.min(total, start + pageItems.length)} od {total}
      </div>
      <div className="pager-right">
        <button
          className="btn btn--ghost"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={safePage <= 1}
        >
          ‹ Prethodna
        </button>
        <span className="pager-num">Strana {safePage} / {totalPages}</span>
        <button
          className="btn btn--ghost"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={safePage >= totalPages}
        >
          Sledeća ›
        </button>
        <select
          className="select pager-select"
          value={perPage}
          onChange={(e) => setPerPage(Number(e.target.value))}
        >
          {PER_PAGE_OPTIONS.map((n) => (
            <option key={n} value={n}>{n} / str.</option>
          ))}
        </select>
      </div>
    </div>
  );

  return (
    <div>
      <h3>Kompanije</h3>
      {msg && <div className="alert">{msg}</div>}

      {/* Filteri */}
      <div className="tools" style={{ gap: 12, alignItems: "center" }}>
        {/* Lepši search sa ikonicom, clear i prečicom "/" */}
        <div className="search">
          <span className="search__icon" aria-hidden="true">🔍</span>
          <input
            ref={searchRef}
            type="search"
            className="search__input"
            placeholder="Pretraži: naziv, grad, adresa, PIB… "
            value={qRaw}
            onChange={(e) => setQRaw(e.target.value)}
          />
          {!!qRaw && (
            <button
              type="button"
              className="search__clear"
              onClick={() => { setQRaw(""); setQ(""); searchRef.current?.focus(); }}
              aria-label="Obriši pretragu"
            >
              ×
            </button>
          )}
        </div>

        <select
          className="select"
          value={fltType}
          onChange={(e)=>setFltType(e.target.value)}
          style={{ width: 180 }}
        >
          <option value="">Svi tipovi</option>
          <option value="supplier">supplier</option>
          <option value="importer">importer</option>
          <option value="other">other</option>
        </select>

        <input
          className="input"
          placeholder="Zemlja (npr. RS, CN)"
          value={fltCountry}
          onChange={(e)=>setFltCountry(e.target.value.toUpperCase())}
          style={{ width: 160 }}
        />
      </div>

      <Pager />

      {/* Create form */}
      <form onSubmit={onCreate} className="form" style={{ marginBottom: 16 }}>
        <div className="grid grid-4">
          <div className="field">
            <label>Naziv</label>
            <input name="name" value={createForm.name} onChange={chCreate} required />
            {createErrors.name && <small className="err">{createErrors.name[0]}</small>}
          </div>

          <div className="field">
            <label>Tip</label>
            <select name="type" value={createForm.type} onChange={chCreate} className="select">
              <option value="supplier">supplier</option>
              <option value="importer">importer</option>
              <option value="other">other</option>
            </select>
            {createErrors.type && <small className="err">{createErrors.type[0]}</small>}
          </div>

          <div className="field">
            <label>Zemlja</label>
            <input name="country" value={createForm.country} onChange={chCreate} placeholder="npr. RS, CN" />
            {createErrors.country && <small className="err">{createErrors.country[0]}</small>}
          </div>

          <div className="field">
            <label>PIB / Tax ID (opciono)</label>
            <input name="tax_id" value={createForm.tax_id} onChange={chCreate} />
            {createErrors.tax_id && <small className="err">{createErrors.tax_id[0]}</small>}
          </div>
        </div>

        <div className="grid grid-3">
          <div className="field">
            <label>Grad</label>
            <input name="city" value={createForm.city} onChange={chCreate} required />
            {createErrors.city && <small className="err">{createErrors.city[0]}</small>}
          </div>
          <div className="field">
            <label>Adresa</label>
            <input name="address" value={createForm.address} onChange={chCreate} required />
            {createErrors.address && <small className="err">{createErrors.address[0]}</small>}
          </div>
        </div>

        <button className="btn btn--primary" disabled={creating}>
          {creating ? "Dodajem..." : "Dodaj kompaniju"}
        </button>
      </form>

      {/* Tabela */}
      <div className="table-responsive">
        <table className="table table--tight">
          <thead>
            <tr>
              <th>#</th>
              <th>Naziv</th>
              <th>Tip</th>
              <th>Zemlja</th>
              <th>Grad</th>
              <th>Adresa</th>
              <th>PIB / Tax ID</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((c) => (
              <tr key={c.id}>
                <td data-label="#">{c.id}</td>

                <td data-label="Naziv">
                  {editId === c.id ? (
                    <input className="input w-100" name="name" value={editForm.name} onChange={chEdit} required />
                  ) : (c.name)}
                </td>

                <td data-label="Tip">
                  {editId === c.id ? (
                    <select className="select w-100" name="type" value={editForm.type} onChange={chEdit}>
                      <option value="supplier">supplier</option>
                      <option value="importer">importer</option>
                      <option value="other">other</option>
                    </select>
                  ) : (c.type || "-")}
                </td>

                <td data-label="Zemlja">
                  {editId === c.id ? (
                    <input className="input w-100" name="country" value={editForm.country} onChange={chEdit} placeholder="RS" />
                  ) : (c.country || "-")}
                </td>

                <td data-label="Grad">
                  {editId === c.id ? (
                    <input className="input w-100" name="city" value={editForm.city} onChange={chEdit} required />
                  ) : (c.city || "-")}
                </td>

                <td data-label="Adresa">
                  {editId === c.id ? (
                    <input className="input w-100" name="address" value={editForm.address} onChange={chEdit} required />
                  ) : (c.address || "-")}
                </td>

                <td data-label="PIB / Tax ID">
                  {editId === c.id ? (
                    <input className="input w-100" name="tax_id" value={editForm.tax_id} onChange={chEdit} />
                  ) : (c.tax_id || "-")}
                </td>

                <td className="actions">
                  {editId === c.id ? (
                    <>
                      <button className="btn btn--ghost" onClick={() => saveEdit(c.id)} type="button">Sačuvaj</button>{" "}
                      <button className="link" onClick={cancelEdit} type="button">Otkaži</button>
                    </>
                  ) : (
                    <>
                      <button className="btn btn--ghost" onClick={() => startEdit(c)} type="button">Izmeni</button>{" "}
                      <button className="link danger" onClick={() => onDelete(c.id)} type="button">Obriši</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {!pageItems.length && !loading && (
              <tr>
                <td colSpan={8}>
                  <div className="empty">Nema kompanija za zadate filtere.</div>
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
