// src/pages/supplier/SupplierProductForm.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createProduct, getMyProduct, updateProduct } from "../../api/supplier";

const EMPTY = {
  code: "",
  name: "",
  description: "",
  base_price: "",
  currency: "EUR",
  image_url: "",        // backend zahteva da postoji (kod tebe je required)
  length_mm: "",
  width_mm: "",
  height_mm: "",
  weight_g: "",
  category_id: "",
  characteristics: {},
  is_active: true,
};

export default function SupplierProductForm() {
  const { id } = useParams();        // /supplier/products/:id/edit
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [errors, setErrors] = useState({});

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
      } catch (e) {
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
      // minimalan payload koji backend očekuje
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

        <div className="grid grid-2">
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
