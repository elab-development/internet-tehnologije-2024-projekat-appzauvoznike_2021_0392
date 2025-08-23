
import React, { useEffect, useState } from "react";
import { createProduct, updateProduct, fetchMyProducts } from "../../api/supplier";
import { useNavigate, useParams } from "react-router-dom";

export default function SupplierProductForm() {
  const { id } = useParams(); // kada postoji → edit
  const navigate = useNavigate();
  const [form, setForm] = useState({
    category_id: "",
    code: "",
    name: "",
    description: "",
    image_url: "placeholder.jpg",
    length_mm: "", width_mm: "", height_mm: "", weight_g: "",
    base_price: "", currency: "EUR",
    characteristics: {},
    is_active: true,
  });

  useEffect(() => {
    // za demo: ako bi trebao fetch jednog proizvoda, napravi poseban endpoint show
    // ovde preskačemo i ostavljamo prazan form za "new"
  }, [id]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, characteristics: form.characteristics || {} };
    if (id) await updateProduct(id, payload);
    else await createProduct(payload);
    navigate("/supplier/products");
  };

  const ch = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className="container">
      <h2>{id ? "Izmena proizvoda" : "Novi proizvod"}</h2>
      <form onSubmit={onSubmit} className="form">
        <div className="grid grid-2">
          <div className="field">
            <label>Šifra</label>
            <input name="code" value={form.code} onChange={ch} required />
          </div>
          <div className="field">
            <label>Naziv</label>
            <input name="name" value={form.name} onChange={ch} required />
          </div>
        </div>

        <div className="grid grid-2">
          <div className="field">
            <label>Cena</label>
            <input name="base_price" type="number" step="0.01" value={form.base_price} onChange={ch} required />
          </div>
          <div className="field">
            <label>Valuta</label>
            <input name="currency" value={form.currency} onChange={ch} />
          </div>
        </div>

        <div className="field">
          <label>Opis</label>
          <textarea name="description" value={form.description} onChange={ch} rows={3} />
        </div>

        <button className="btn">{id ? "Sačuvaj izmene" : "Kreiraj"}</button>
      </form>
    </div>
  );
}
