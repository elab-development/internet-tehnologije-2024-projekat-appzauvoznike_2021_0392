// src/pages/supplier/SupplierProductForm.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createProduct, getMyProduct, updateProduct } from "../../api/supplier";
import "./supplier.css";

/* ================= FX helpers (robust) ================= */
const RATES_TTL_MS = 12 * 60 * 60 * 1000; // 12h

async function fetchRatesFromPrimary(base) {
  const res = await fetch(`https://api.exchangerate.host/latest?base=${encodeURIComponent(base)}`);
  if (!res.ok) throw new Error("exchangerate.host down");
  const j = await res.json();
  if (!j?.rates) throw new Error("bad payload");
  return j.rates;
}

async function fetchRatesFromFallback(base) {
  // frankfurter.app koristi parametar 'from'
  const res = await fetch(`https://api.frankfurter.app/latest?from=${encodeURIComponent(base)}`);
  if (!res.ok) throw new Error("frankfurter.app down");
  const j = await res.json();
  if (!j?.rates) throw new Error("bad payload");
  return j.rates;
}

function useFxRates(base = "EUR") {
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [fxBase, setFxBase] = useState(base);

  useEffect(() => {
    const key = `fx:${fxBase}`;
    const cached = localStorage.getItem(key);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.ts < RATES_TTL_MS) {
          setRates(parsed.rates);
          return;
        }
      } catch {}
    }

    (async () => {
      setLoading(true);
      setErr(null);
      try {
        let r = await fetchRatesFromPrimary(fxBase);
        // osiguraj da postoji i sama baza
        r = { [fxBase]: 1, ...r };
        setRates(r);
        localStorage.setItem(key, JSON.stringify({ ts: Date.now(), rates: r }));
      } catch {
        try {
          let r = await fetchRatesFromFallback(fxBase);
          r = { [fxBase]: 1, ...r };
          setRates(r);
          localStorage.setItem(key, JSON.stringify({ ts: Date.now(), rates: r }));
        } catch (e2) {
          setErr("Ne mogu da učitam kurseve.");
          setRates(null);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [fxBase]);

  return { rates, loading, err, base: fxBase, setBase: setFxBase };
}

function rateAB(rates, /*base not needed*/ _base, from, to) {
  if (!rates) return null;
  if (from === to) return 1;
  const rB = rates[to];
  const rA = rates[from];
  if (!rA || !rB) return null;      // nedostaje simbol
  return rB / rA;                   // A->B = (base->B)/(base->A)
}
/* =============== kraj FX ===================== */


const EMPTY = {
  code: "",
  name: "",
  description: "",
  base_price: "",
  currency: "EUR",
  image_url: "",
  length_mm: "",
  width_mm: "",
  height_mm: "",
  weight_g: "",
  category_id: "",
  characteristics: {},
  is_active: true,
};

export default function SupplierProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [errors, setErrors] = useState({});

  // FX state (ciljna valuta za preview i/ili prebacivanje)
  const [fxTo, setFxTo] = useState("USD");
  const { rates, loading: fxLoading, err: fxErr, base: fxBase, setBase: setFxBase } = useFxRates(form.currency || "EUR");

  useEffect(() => { setFxBase(form.currency || "EUR"); }, [form.currency, setFxBase]);

  // učitaj proizvod kod izmene
  useEffect(() => {
    const load = async () => {
      if (!isEdit) return;
      setLoading(true);
      setErrors({});
      setMsg(null);
      try {
        const { data } = await getMyProduct(id);
        setForm({
          code: data.code ?? "",
          name: data.name ?? "",
          description: data.description ?? "",
          base_price: data.base_price ?? "",
          currency: data.currency ?? "EUR",
          image_url: data.image_url ?? "",
          length_mm: data.length_mm ?? "",
          width_mm: data.width_mm ?? "",
          height_mm: data.height_mm ?? "",
          weight_g: data.weight_g ?? "",
          category_id: data.category_id ?? "",
          characteristics: data.characteristics ?? {},
          is_active: Boolean(data.is_active ?? true),
        });
      } catch {
        setMsg("Ne mogu da učitam proizvod.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, isEdit]);

  const ch = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    setErrors({});
    try {
      const payload = {
        category_id: form.category_id || null,
        code: form.code,
        name: form.name,
        description: form.description || null,
        image_url: form.image_url || "placeholder.jpg",
        length_mm: form.length_mm || null,
        width_mm: form.width_mm || null,
        height_mm: form.height_mm || null,
        weight_g: form.weight_g || null,
        base_price: form.base_price,
        currency: form.currency || "EUR",
        characteristics: form.characteristics || {},
        is_active: !!form.is_active,
      };

      if (isEdit) await updateProduct(id, payload);
      else await createProduct(payload);

      navigate("/supplier/products", { replace: true });
    } catch (err) {
      const res = err.response?.data;
      setMsg(res?.message || "Greška pri snimanju.");
      if (res?.errors) setErrors(res.errors);
    } finally {
      setLoading(false);
    }
  };

  // izračunaj preview konverziju
  const converted = useMemo(() => {
    const price = parseFloat(form.base_price);
    if (!rates || !form.currency || !fxTo || Number.isNaN(price)) return null;
    const r = rateAB(rates, fxBase, form.currency, fxTo);
    if (!r) return null;
    return price * r;
  }, [rates, fxBase, form.currency, fxTo, form.base_price]);

  const applyConversion = () => {
    if (converted == null) return;
    setForm(s => ({
      ...s,
      base_price: (Math.round(converted * 100) / 100).toFixed(2),
      currency: fxTo
    }));
  };

  const symbols = useMemo(() => {
    if (!rates) return ["EUR","USD","RSD","GBP","CHF"];
    const list = Object.keys(rates).sort();
    if (!list.includes(form.currency)) list.unshift(form.currency);
    return list;
  }, [rates, form.currency]);

  return (
    <div className="container">
      <h2>{isEdit ? "Izmena proizvoda" : "Novi proizvod"}</h2>
      {msg && <div className="alert">{msg}</div>}

      <form onSubmit={onSubmit} className="form">
        <div className="grid grid-2">
          <div className="field">
            <label>Šifra</label>
            <input name="code" value={form.code} onChange={ch} required />
            {errors.code && <small className="err">{errors.code[0]}</small>}
          </div>
          <div className="field">
            <label>Naziv</label>
            <input name="name" value={form.name} onChange={ch} required />
            {errors.name && <small className="err">{errors.name[0]}</small>}
          </div>
        </div>

        {/* Cena + Valuta + FX konvertor */}
        <div className="grid grid-3">
          <div className="field">
            <label>Cena</label>
            <input
              name="base_price"
              type="number"
              step="0.01"
              value={form.base_price}
              onChange={ch}
              required
            />
            {errors.base_price && <small className="err">{errors.base_price[0]}</small>}
          </div>

          <div className="field">
            <label>Valuta</label>
            <input name="currency" value={form.currency} onChange={ch} />
            {errors.currency && <small className="err">{errors.currency[0]}</small>}
          </div>

          <div className="field fx-inline">
            <label>Preračun u</label>
            <div className="fx-inline-row">
              <select className="select" value={fxTo} onChange={(e)=>setFxTo(e.target.value)}>
                {symbols.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <div className="fx-inline-value">
                {fxLoading ? "…" : fxErr ? "N/A" : (converted != null ? `${converted.toFixed(2)} ${fxTo}` : "—")}
              </div>
              <button type="button" className="btn btn--ghost" onClick={applyConversion} disabled={converted == null}>
                Postavi cenu u {fxTo}
              </button>
            </div>
            <small className="muted">
              Izvor kursa: exchangerate.host • baza {fxBase}
            </small>
          </div>
        </div>

        <div className="field">
          <label>Glavna slika (URL)</label>
          <input
            name="image_url"
            value={form.image_url}
            onChange={ch}
            placeholder="https://... ili placeholder.jpg"
            required
          />
          {errors.image_url && <small className="err">{errors.image_url[0]}</small>}
        </div>

        <div className="field">
          <label>Opis</label>
          <textarea
            name="description"
            value={form.description}
            onChange={ch}
            rows={3}
          />
          {errors.description && <small className="err">{errors.description[0]}</small>}
        </div>

        <button className="btn btn--primary" disabled={loading}>
          {loading ? "Snimam..." : isEdit ? "Sačuvaj izmene" : "Kreiraj"}
        </button>
      </form>
    </div>
  );
}
