// src/pages/importer/ImporterContainerForm.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createContainer, getContainer, updateContainer,
  addContainerItem, updateContainerItem, deleteContainerItem,
  listPartnerOffers, // ⟵ DODATO
} from "../../api/importer";
import api from "../../api/axios"; // ⟵ koristi se za dohvat detalja jedne ponude ako treba
import "../supplier/supplier.css";

export default function ImporterContainerForm() {
  const { id } = useParams(); // container id pri izmeni
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    container_type: "40HC",
    inner_length_mm: "",
    inner_width_mm: "",
    inner_height_mm: "",
    max_weight_kg: "",
    max_volume_m3: "",
    estimated_freight_cost: "",
    currency: "USD",
    status: "draft",
  });

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [errors, setErrors] = useState({});

  // ---------- Ponude & stavke ponuda (za dropdown) ----------
  const [offers, setOffers] = useState([]);            // osnovni spisak ponuda
  const [offersLoading, setOffersLoading] = useState(false);
  const [selectedOfferId, setSelectedOfferId] = useState("");
  const [offerItemsById, setOfferItemsById] = useState({}); // { [offerId]: items[] }

  // učitaj kontejner (za edit)
  useEffect(() => {
    const boot = async () => {
      if (!isEdit) return;
      setLoading(true);
      try {
        const { data } = await getContainer(id);
        setForm({
          container_type: data.container_type || "40HC",
          inner_length_mm: data.inner_length_mm ?? "",
          inner_width_mm: data.inner_width_mm ?? "",
          inner_height_mm: data.inner_height_mm ?? "",
          max_weight_kg: data.max_weight_kg ?? "",
          max_volume_m3: data.max_volume_m3 ?? "",
          estimated_freight_cost: data.estimated_freight_cost ?? "",
          currency: data.currency || "USD",
          status: data.status || "draft",
        });
        setItems(data.items || []);
      } catch {
        setMsg("Greška pri učitavanju podataka.");
      } finally {
        setLoading(false);
      }
    };
    boot();
  }, [id, isEdit]);

  // učitaj liste ponuda (samo za importera)
  useEffect(() => {
    const loadOffers = async () => {
      setOffersLoading(true);
      try {
        const { data } = await listPartnerOffers();
        setOffers(Array.isArray(data) ? data : []);
        // ako ponude već imaju items, ucache-uj ih
        const map = {};
        (data || []).forEach(o => {
          if (Array.isArray(o.items)) map[o.id] = o.items;
        });
        if (Object.keys(map).length) setOfferItemsById(prev => ({ ...prev, ...map }));
      } catch {
        // ništa – dropdown će biti prazan
      } finally {
        setOffersLoading(false);
      }
    };
    loadOffers();
  }, []);

  // pri izboru ponude – ako nemamo njene stavke, povuci detalje
  useEffect(() => {
    const needFetch =
      selectedOfferId &&
      !offerItemsById[selectedOfferId];

    if (!needFetch) return;

    const fetchDetails = async () => {
      try {
        const { data } = await api.get(`/importer/offers/${selectedOfferId}`);
        const its = Array.isArray(data?.items) ? data.items : [];
        setOfferItemsById(prev => ({ ...prev, [selectedOfferId]: its }));
      } catch {
        // ignoriši; dropdown za stavke će biti prazan
      }
    };
    fetchDetails();
  }, [selectedOfferId, offerItemsById]);

  const availableItems = useMemo(() => {
    if (!selectedOfferId) return [];
    return offerItemsById[selectedOfferId] || [];
  }, [selectedOfferId, offerItemsById]);

  const ch = (e) => setForm(s => ({ ...s, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setMsg(null); setErrors({});
    try {
      if (isEdit) await updateContainer(id, form);
      else await createContainer(form);
      navigate("/importer/containers", { replace: true });
    } catch (err) {
      const res = err?.response?.data;
      setMsg(res?.message || "Greška pri snimanju kontejnera.");
      if (res?.errors) setErrors(res.errors);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- STAVKE ---------- */
  const [draftItem, setDraftItem] = useState({
    offer_item_id: "",
    quantity: 1,
    item_length_mm: "",
    item_width_mm: "",
    item_height_mm: "",
    item_weight_g: "",
    unit_price: "",
    import_cost_per_unit: "",
    currency: "USD",
  });

  const chItem = (e) => setDraftItem(s => ({ ...s, [e.target.name]: e.target.value }));

  const normalizeNumber = (val, parser = parseFloat) => {
    if (val === "" || val === null || val === undefined) return null;
    const num = parser(val);
    return Number.isNaN(num) ? null : num;
    };

  const addItemNow = async () => {
    if (!isEdit) { setMsg("Prvo sačuvaj kontejner, pa dodaj stavke."); return; }
    try {
      setMsg(null);
      const payload = {
        offer_item_id: Number(draftItem.offer_item_id),
        quantity: normalizeNumber(draftItem.quantity, parseInt) ?? 1,
        item_length_mm: normalizeNumber(draftItem.item_length_mm, parseInt),
        item_width_mm: normalizeNumber(draftItem.item_width_mm, parseInt),
        item_height_mm: normalizeNumber(draftItem.item_height_mm, parseInt),
        item_weight_g: normalizeNumber(draftItem.item_weight_g, parseInt),
        unit_price: normalizeNumber(draftItem.unit_price, parseFloat),
        import_cost_per_unit: normalizeNumber(draftItem.import_cost_per_unit, parseFloat),
        currency: (draftItem.currency || "USD").toUpperCase(),
      };
      if (!payload.offer_item_id) {
        setMsg("Odaberi stavku iz ponude.");
        return;
      }
      const { data } = await addContainerItem(id, payload);
      setItems(arr => [...arr, data]);
      setDraftItem({
        offer_item_id: "",
        quantity: 1,
        item_length_mm: "",
        item_width_mm: "",
        item_height_mm: "",
        item_weight_g: "",
        unit_price: "",
        import_cost_per_unit: "",
        currency: "USD",
      });
    } catch (err) {
      const res = err?.response?.data;
      setMsg(res?.message || "Greška pri dodavanju stavke.");
    }
  };

  const saveItem = async (it) => {
    try {
      setMsg(null);
      const payload = {
        quantity: normalizeNumber(it.quantity, parseInt),
        item_length_mm: normalizeNumber(it.item_length_mm, parseInt),
        item_width_mm: normalizeNumber(it.item_width_mm, parseInt),
        item_height_mm: normalizeNumber(it.item_height_mm, parseInt),
        item_weight_g: normalizeNumber(it.item_weight_g, parseInt),
        unit_price: normalizeNumber(it.unit_price, parseFloat),
        import_cost_per_unit: normalizeNumber(it.import_cost_per_unit, parseFloat),
        currency: it.currency?.toUpperCase?.() || "USD",
      };
      const { data } = await updateContainerItem(id, it.id, payload);
      setItems(arr => arr.map(x => x.id === it.id ? data : x));
    } catch (err) {
      const res = err?.response?.data;
      setMsg(res?.message || "Greška pri snimanju stavke.");
    }
  };

  const removeItem = async (itemId) => {
    if (!window.confirm("Obrisati stavku?")) return;
    try {
      await deleteContainerItem(id, itemId);
      setItems(arr => arr.filter(x => x.id !== itemId));
    } catch (err) {
      const res = err?.response?.data;
      setMsg(res?.message || "Greška pri brisanju stavke.");
    }
  };

  return (
    <div className="container page">
      <h2>{isEdit ? "Izmena kontejnera" : "Novi kontejner"}</h2>
      {msg && <div className="alert">{msg}</div>}

      <form onSubmit={onSubmit} className="form">
        <div className="grid grid-3">
          <div className="field">
            <label>Tip</label>
            <input name="container_type" value={form.container_type} onChange={ch}/>
          </div>
          <div className="field">
            <label>Status</label>
            <select name="status" value={form.status} onChange={ch}>
              <option value="draft">draft</option>
              <option value="planned">planned</option>
              <option value="shipped">shipped</option>
              <option value="delivered">delivered</option>
              <option value="canceled">canceled</option>
            </select>
          </div>
          <div className="field">
            <label>Valuta</label>
            <input name="currency" value={form.currency} onChange={ch}/>
          </div>
        </div>

        <div className="grid grid-3">
          <div className="field"><label>Dužina (mm)</label><input name="inner_length_mm" value={form.inner_length_mm} onChange={ch}/></div>
          <div className="field"><label>Širina (mm)</label><input name="inner_width_mm" value={form.inner_width_mm} onChange={ch}/></div>
          <div className="field"><label>Visina (mm)</label><input name="inner_height_mm" value={form.inner_height_mm} onChange={ch}/></div>
        </div>

        <div className="grid grid-3">
          <div className="field"><label>Maks. težina (kg)</label><input name="max_weight_kg" value={form.max_weight_kg} onChange={ch}/></div>
          <div className="field"><label>Maks. zapremina (m³)</label><input name="max_volume_m3" value={form.max_volume_m3} onChange={ch}/></div>
          <div className="field"><label>Freight cost</label><input name="estimated_freight_cost" value={form.estimated_freight_cost} onChange={ch}/></div>
        </div>

        <button className="btn btn--primary" disabled={loading} type="submit">
          {isEdit ? "Sačuvaj" : "Kreiraj"}
        </button>
      </form>

      {isEdit && (
        <>
          <h3 style={{ marginTop: 28 }}>Stavke</h3>
          <div className="table-responsive">
            <table className="table table--tight">
              <thead>
                <tr>
                  <th>OfferItem</th>
                  <th>Količina</th>
                  <th>Dim. (mm)</th>
                  <th>Težina (g)</th>
                  <th>Cena</th>
                  <th>Uvozni trošak</th>
                  <th>Valuta</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map(it => (
                  <tr key={it.id}>
                    <td data-label="OfferItem">#{it.offer_item_id}</td>
                    <td data-label="Količina">
                      <input type="number" value={it.quantity ?? ""} onChange={(e)=>setItems(xs=>xs.map(x=>x.id===it.id?{...x, quantity:e.target.value}:x))} className="input w-100"/>
                    </td>
                    <td data-label="Dim. (mm)">
                      <div className="grid" style={{gridTemplateColumns:"repeat(3,1fr)", gap:6}}>
                        <input placeholder="L" value={it.item_length_mm ?? ""} onChange={(e)=>setItems(xs=>xs.map(x=>x.id===it.id?{...x,item_length_mm:e.target.value}:x))} className="input"/>
                        <input placeholder="W" value={it.item_width_mm ?? ""} onChange={(e)=>setItems(xs=>xs.map(x=>x.id===it.id?{...x,item_width_mm:e.target.value}:x))} className="input"/>
                        <input placeholder="H" value={it.item_height_mm ?? ""} onChange={(e)=>setItems(xs=>xs.map(x=>x.id===it.id?{...x,item_height_mm:e.target.value}:x))} className="input"/>
                      </div>
                    </td>
                    <td data-label="Težina">
                      <input type="number" value={it.item_weight_g ?? ""} onChange={(e)=>setItems(xs=>xs.map(x=>x.id===it.id?{...x,item_weight_g:e.target.value}:x))} className="input w-100"/>
                    </td>
                    <td data-label="Cena">
                      <input type="number" step="0.01" value={it.unit_price ?? ""} onChange={(e)=>setItems(xs=>xs.map(x=>x.id===it.id?{...x,unit_price:e.target.value}:x))} className="input w-100"/>
                    </td>
                    <td data-label="Uvozni trošak">
                      <input type="number" step="0.01" value={it.import_cost_per_unit ?? ""} onChange={(e)=>setItems(xs=>xs.map(x=>x.id===it.id?{...x,import_cost_per_unit:e.target.value}:x))} className="input w-100"/>
                    </td>
                    <td data-label="Valuta">
                      <input value={it.currency ?? "USD"} onChange={(e)=>setItems(xs=>xs.map(x=>x.id===it.id?{...x,currency:e.target.value}:x))} className="input w-100"/>
                    </td>
                    <td className="actions">
                      <button className="btn btn--ghost" type="button" onClick={()=>saveItem(it)}>Snimi</button>{" "}
                      <button className="link danger" type="button" onClick={()=>removeItem(it.id)}>Obriši</button>
                    </td>
                  </tr>
                ))}
                {!items.length && (
                  <tr><td colSpan={8}><div className="empty">Još nema stavki.</div></td></tr>
                )}
              </tbody>
            </table>
          </div>

          <h4 style={{ marginTop: 18 }}>Dodaj stavku</h4>
          <div className="grid grid-6" style={{ alignItems: "end", gap: 8 }}>
            <div className="field">
              <label>Ponuda</label>
              <select
                className="select"
                value={selectedOfferId}
                onChange={(e) => {
                  setSelectedOfferId(e.target.value);
                  // resetuj selekciju stavke
                  setDraftItem(s => ({ ...s, offer_item_id: "" }));
                }}
                disabled={offersLoading}
              >
                <option value="">{offersLoading ? "Učitavam…" : "— Odaberi ponudu —"}</option>
                {offers.map(o => (
                  <option key={o.id} value={o.id}>
                    #{o.id} — {o.title || "Ponuda"} {o.supplier?.name ? `• ${o.supplier?.name}` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Stavka (proizvod)</label>
              <select
                className="select"
                name="offer_item_id"
                value={draftItem.offer_item_id}
                onChange={chItem}
                disabled={!selectedOfferId || !availableItems.length}
              >
                <option value="">
                  {!selectedOfferId
                    ? "— Prvo odaberi ponudu —"
                    : availableItems.length
                      ? "— Odaberi stavku —"
                      : "Nema stavki u ovoj ponudi"}
                </option>
                {availableItems.map(it => (
                  <option key={it.id} value={it.id}>
                    #{it.id} • {it.product?.code || "-"} — {it.product?.name || "Proizvod"} • {it.unit_price ?? "-"} {it.currency || ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Količina</label>
              <input name="quantity" type="number" value={draftItem.quantity} onChange={chItem}/>
            </div>
            <div className="field">
              <label>Valuta</label>
              <input name="currency" value={draftItem.currency} onChange={chItem}/>
            </div>
            <div className="field">
              <label>Cena</label>
              <input name="unit_price" type="number" step="0.01" value={draftItem.unit_price} onChange={chItem}/>
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
