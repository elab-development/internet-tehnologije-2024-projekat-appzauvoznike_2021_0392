import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getOffer, createOffer, updateOffer,
  addOfferItem, updateOfferItem, deleteOfferItem,
  fetchMyProducts,
} from "../../api/supplier";

const toDateInput = (d) => (d ? String(d).slice(0, 10) : "");

export default function SupplierOfferForm() {
  const { id } = useParams();               // offer id kod izmene
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "", description: "",
    valid_from: "", valid_to: "",
    incoterm: "", payment_terms: "",
    lead_time_days: "", status: "draft",
  });

  const [items, setItems] = useState([]);   // stavke u formi
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [errors, setErrors] = useState({});

  // učitaj ponudu (za edit) + listu mojih proizvoda
  useEffect(() => {
    const boot = async () => {
      setLoading(true); setMsg(null);
      try {
        const prods = await fetchMyProducts();
        setProducts(prods.data || []);
        if (isEdit) {
          const { data } = await getOffer(id);
          setForm({
            title: data.title || "",
            description: data.description || "",
            valid_from: toDateInput(data.valid_from),
            valid_to: toDateInput(data.valid_to),
            incoterm: data.incoterm || "",
            payment_terms: data.payment_terms || "",
            lead_time_days: data.lead_time_days || "",
            status: data.status || "draft",
          });
          setItems(data.items || []);
        }
      } catch (e) {
        setMsg("Greška pri učitavanju podataka.");
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    boot();
  }, [id, isEdit]);

  const ch = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setMsg(null); setErrors({});
    try {
      if (isEdit) await updateOffer(id, form);
      else await createOffer(form);
      navigate("/supplier/offers", { replace: true });
    } catch (err) {
      const res = err?.response?.data;
      setMsg(res?.message || "Greška pri snimanju ponude.");
      if (res?.errors) setErrors(res.errors);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- STAVKE ---------- */
  const emptyItem = useMemo(() => ({
    id: null,
    product_id: products[0]?.id || "",
    unit_price: "",
    currency: "EUR",
    min_order_qty: 1,
    pack_qty: "",
    import_cost_per_unit: "",
    discount_percent: "",
    notes: "",
  }), [products]);

  const [draftItem, setDraftItem] = useState(emptyItem);
  useEffect(() => setDraftItem(emptyItem), [emptyItem]);

  const chItem = (e) =>
    setDraftItem((s) => ({ ...s, [e.target.name]: e.target.value }));

  const normalizeNumber = (val, parser = parseFloat) => {
    if (val === "" || val === null || val === undefined) return null;
    const num = parser(val);
    return Number.isNaN(num) ? null : num;
  };

  const addItemNow = async () => {
    if (!isEdit) { setMsg("Prvo sačuvaj ponudu, pa dodaj stavke."); return; }
    try {
      setMsg(null);
      const payload = {
        product_id: +draftItem.product_id,
        unit_price: normalizeNumber(draftItem.unit_price, parseFloat), // obavezno
        currency: (draftItem.currency || "EUR").toUpperCase(),
        min_order_qty: normalizeNumber(draftItem.min_order_qty, parseInt) ?? 1,
        pack_qty: normalizeNumber(draftItem.pack_qty, parseInt),
        import_cost_per_unit: normalizeNumber(draftItem.import_cost_per_unit, parseFloat),
        discount_percent: normalizeNumber(draftItem.discount_percent, parseFloat),
        notes: draftItem.notes || null,
      };
      if (payload.unit_price === null) {
        setMsg("Cena je obavezna.");
        return;
      }
      const { data } = await addOfferItem(id, payload);
      setItems((arr) => [...arr, data]);
      setDraftItem(emptyItem);
    } catch (err) {
      const res = err?.response?.data;
      setMsg(res?.message || "Greška pri dodavanju stavke.");
      console.error(err);
    }
  };

  const saveItem = async (it) => {
    try {
      setMsg(null);
      const payload = {
        unit_price: normalizeNumber(it.unit_price, parseFloat),
        currency: it.currency?.toUpperCase?.() || "EUR",
        min_order_qty: normalizeNumber(it.min_order_qty, parseInt),
        pack_qty: normalizeNumber(it.pack_qty, parseInt),
        import_cost_per_unit: normalizeNumber(it.import_cost_per_unit, parseFloat),
        discount_percent: normalizeNumber(it.discount_percent, parseFloat),
        notes: it.notes || null,
      };
      if (payload.unit_price === null) {
        setMsg("Cena je obavezna.");
        return;
      }
      const { data } = await updateOfferItem(id, it.id, payload);
      setItems((arr) => arr.map((x) => (x.id === it.id ? data : x)));
    } catch (err) {
      const res = err?.response?.data;
      setMsg(res?.message || "Greška pri snimanju stavke.");
      console.error(err);
    }
  };

  const removeItem = async (itemId) => {
    if (!window.confirm("Obrisati stavku?")) return;
    try {
      setMsg(null);
      await deleteOfferItem(id, itemId);
      setItems((arr) => arr.filter((x) => x.id !== itemId));
    } catch (err) {
      const res = err?.response?.data;
      setMsg(res?.message || "Greška pri brisanju stavke.");
      console.error(err);
    }
  };

  return (
    <div className="container page">
      <h2>{isEdit ? "Izmena ponude" : "Nova ponuda"}</h2>
      {msg && <div className="alert">{msg}</div>}

      <form onSubmit={onSubmit} className="form">
        <div className="field">
          <label>Naslov</label>
          <input name="title" value={form.title} onChange={ch} required />
          {errors.title && <small className="err">{errors.title[0]}</small>}
        </div>

        <div className="field">
          <label>Opis</label>
          <textarea name="description" value={form.description} onChange={ch} rows={3} />
        </div>

        <div className="grid grid-3">
          <div className="field">
            <label>Važi od</label>
            <input type="date" name="valid_from" value={form.valid_from} onChange={ch} />
          </div>
          <div className="field">
            <label>Važi do</label>
            <input type="date" name="valid_to" value={form.valid_to} onChange={ch} />
          </div>
          <div className="field">
            <label>Status</label>
            <select name="status" value={form.status} onChange={ch}>
              <option value="draft">draft</option>
              <option value="published">published</option>
              <option value="archived">archived</option>
            </select>
          </div>
        </div>

        <div className="grid grid-3">
          <div className="field"><label>Incoterm</label>
            <input name="incoterm" value={form.incoterm} onChange={ch} />
          </div>
          <div className="field"><label>Payment terms</label>
            <input name="payment_terms" value={form.payment_terms} onChange={ch} />
          </div>
          <div className="field"><label>Lead time (dani)</label>
            <input type="number" name="lead_time_days" value={form.lead_time_days} onChange={ch} />
          </div>
        </div>

        <button className="btn btn--primary" disabled={loading} type="submit">
          {isEdit ? "Sačuvaj" : "Kreiraj"}
        </button>
      </form>

      {/* STAVKE */}
      {isEdit && (
        <>
          <h3 style={{ marginTop: 28 }}>Stavke</h3>

          <div className="table-responsive">
            <table className="table table--tight">
              <thead>
                <tr>
                  <th>Proizvod</th>
                  <th>Cena</th>
                  <th>Valuta</th>
                  <th>MOQ</th>
                  <th>Pak.</th>
                  <th>Uvozni trošak</th>
                  <th>Popust %</th>
                  <th>Napomena</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((it) => (
                  <tr key={it.id}>
                    <td data-label="Proizvod">{it.product?.code} — {it.product?.name}</td>
                    <td data-label="Cena">
                      <input type="number" step="0.01"
                        value={it.unit_price ?? ""}
                        onChange={(e)=>setItems(xs=>xs.map(x=>x.id===it.id?{...x,unit_price:e.target.value}:x))}
                        className="input w-100"/>
                    </td>
                    <td data-label="Valuta">
                      <input
                        value={it.currency ?? "EUR"}
                        onChange={(e)=>setItems(xs=>xs.map(x=>x.id===it.id?{...x,currency:e.target.value}:x))}
                        className="input w-100"/>
                    </td>
                    <td data-label="MOQ">
                      <input type="number"
                        value={it.min_order_qty ?? ""}
                        onChange={(e)=>setItems(xs=>xs.map(x=>x.id===it.id?{...x,min_order_qty:e.target.value}:x))}
                        className="input w-100"/>
                    </td>
                    <td data-label="Pak.">
                      <input type="number"
                        value={it.pack_qty ?? ""}
                        onChange={(e)=>setItems(xs=>xs.map(x=>x.id===it.id?{...x,pack_qty:e.target.value}:x))}
                        className="input w-100"/>
                    </td>
                    <td data-label="Uvozni trošak">
                      <input type="number" step="0.01"
                        value={it.import_cost_per_unit ?? ""}
                        onChange={(e)=>setItems(xs=>xs.map(x=>x.id===it.id?{...x,import_cost_per_unit:e.target.value}:x))}
                        className="input w-100"/>
                    </td>
                    <td data-label="Popust %">
                      <input type="number" step="0.01"
                        value={it.discount_percent ?? ""}
                        onChange={(e)=>setItems(xs=>xs.map(x=>x.id===it.id?{...x,discount_percent:e.target.value}:x))}
                        className="input w-100"/>
                    </td>
                    <td data-label="Napomena">
                      <input
                        value={it.notes ?? ""}
                        onChange={(e)=>setItems(xs=>xs.map(x=>x.id===it.id?{...x,notes:e.target.value}:x))}
                        className="input w-100"/>
                    </td>
                    <td className="actions">
                      <button className="btn btn--ghost" type="button" onClick={()=>saveItem(it)}>Snimi</button>{" "}
                      <button className="link danger" type="button" onClick={()=>removeItem(it.id)}>Obriši</button>
                    </td>
                  </tr>
                ))}
                {!items.length && (
                  <tr><td colSpan={9}><div className="empty">Još nema stavki.</div></td></tr>
                )}
              </tbody>
            </table>
          </div>

          <h4 style={{ marginTop: 18 }}>Dodaj stavku</h4>
          <div className="grid grid-6" style={{ alignItems: "end", gap: 8 }}>
            <div className="field">
              <label>Proizvod</label>
              <select name="product_id" value={draftItem.product_id} onChange={chItem} className="select">
                {products.map(p => <option key={p.id} value={p.id}>{p.code} — {p.name}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Cena</label>
              <input name="unit_price" type="number" step="0.01"
                value={draftItem.unit_price} onChange={chItem}/>
            </div>
            <div className="field">
              <label>Valuta</label>
              <input name="currency" value={draftItem.currency} onChange={chItem}/>
            </div>
            <div className="field">
              <label>MOQ</label>
              <input name="min_order_qty" type="number"
                value={draftItem.min_order_qty} onChange={chItem}/>
            </div>
            <div className="field">
              <label>Pak.</label>
              <input name="pack_qty" type="number"
                value={draftItem.pack_qty} onChange={chItem}/>
            </div>
            <div className="field">
              <button className="btn btn--primary" onClick={addItemNow} type="button">Dodaj</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
