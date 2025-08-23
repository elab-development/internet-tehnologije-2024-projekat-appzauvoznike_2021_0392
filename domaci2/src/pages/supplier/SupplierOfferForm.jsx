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

  // učitaj ponudu (za edit) + listu mojih proizvoda (za dodavanje stavki)
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
      } catch {
        setMsg("Greška pri učitavanju podataka.");
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
      const res = err.response?.data;
      setMsg(res?.message || "Greška pri snimanju ponude.");
      if (res?.errors) setErrors(res.errors);
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

  const addItemNow = async () => {
    if (!isEdit) { setMsg("Prvo sačuvaj ponudu, pa dodaj stavke."); return; }
    const payload = {
      product_id: +draftItem.product_id,
      unit_price: draftItem.unit_price,
      currency: draftItem.currency || "EUR",
      min_order_qty: draftItem.min_order_qty || 1,
      pack_qty: draftItem.pack_qty || null,
      import_cost_per_unit: draftItem.import_cost_per_unit || null,
      discount_percent: draftItem.discount_percent || null,
      notes: draftItem.notes || null,
    };
    const { data } = await addOfferItem(id, payload);
    setItems((arr) => [...arr, data]);
    setDraftItem(emptyItem);
  };

  const saveItem = async (it) => {
    const payload = {
      unit_price: it.unit_price,
      currency: it.currency,
      min_order_qty: it.min_order_qty,
      pack_qty: it.pack_qty,
      import_cost_per_unit: it.import_cost_per_unit,
      discount_percent: it.discount_percent,
      notes: it.notes,
    };
    const { data } = await updateOfferItem(id, it.id, payload);
    setItems((arr) => arr.map((x) => (x.id === it.id ? data : x)));
  };

  const removeItem = async (itemId) => {
    await deleteOfferItem(id, itemId);
    setItems((arr) => arr.filter((x) => x.id !== itemId));
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

        <button className="btn btn--primary" disabled={loading}>
          {isEdit ? "Sačuvaj" : "Kreiraj"}
        </button>
      </form>

      {/* STAVKE – prikaz i upravljanje (samo kad je ponuda već kreirana) */}
      {isEdit && (
        <>
          <h3 style={{ marginTop: 28 }}>Stavke</h3>

          <table className="table" style={{ marginTop: 8 }}>
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
                  <td>{it.product?.code} — {it.product?.name}</td>
                  <td><input value={it.unit_price ?? ""} onChange={(e)=>setItems(xs=>xs.map(x=>x.id===it.id?{...x,unit_price:e.target.value}:x))} className="input" style={{minWidth:90}}/></td>
                  <td><input value={it.currency ?? "EUR"} onChange={(e)=>setItems(xs=>xs.map(x=>x.id===it.id?{...x,currency:e.target.value}:x))} className="input" style={{minWidth:70}}/></td>
                  <td><input value={it.min_order_qty ?? ""} onChange={(e)=>setItems(xs=>xs.map(x=>x.id===it.id?{...x,min_order_qty:e.target.value}:x))} className="input" style={{minWidth:70}}/></td>
                  <td><input value={it.pack_qty ?? ""} onChange={(e)=>setItems(xs=>xs.map(x=>x.id===it.id?{...x,pack_qty:e.target.value}:x))} className="input" style={{minWidth:70}}/></td>
                  <td><input value={it.import_cost_per_unit ?? ""} onChange={(e)=>setItems(xs=>xs.map(x=>x.id===it.id?{...x,import_cost_per_unit:e.target.value}:x))} className="input" style={{minWidth:90}}/></td>
                  <td><input value={it.discount_percent ?? ""} onChange={(e)=>setItems(xs=>xs.map(x=>x.id===it.id?{...x,discount_percent:e.target.value}:x))} className="input" style={{minWidth:80}}/></td>
                  <td><input value={it.notes ?? ""} onChange={(e)=>setItems(xs=>xs.map(x=>x.id===it.id?{...x,notes:e.target.value}:x))} className="input"/></td>
                  <td className="actions">
                    <button className="btn btn--ghost" onClick={()=>saveItem(it)}>Snimi</button>{" "}
                    <button className="link danger" onClick={()=>removeItem(it.id)}>Obriši</button>
                  </td>
                </tr>
              ))}
              {!items.length && (
                <tr><td colSpan={9}><div className="empty">Još nema stavki.</div></td></tr>
              )}
            </tbody>
          </table>

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
              <input name="unit_price" value={draftItem.unit_price} onChange={chItem}/>
            </div>
            <div className="field">
              <label>Valuta</label>
              <input name="currency" value={draftItem.currency} onChange={chItem}/>
            </div>
            <div className="field">
              <label>MOQ</label>
              <input name="min_order_qty" type="number" value={draftItem.min_order_qty} onChange={chItem}/>
            </div>
            <div className="field">
              <label>Pak.</label>
              <input name="pack_qty" value={draftItem.pack_qty} onChange={chItem}/>
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
