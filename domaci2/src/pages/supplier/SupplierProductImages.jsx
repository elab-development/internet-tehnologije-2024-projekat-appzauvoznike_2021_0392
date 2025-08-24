import React, { useEffect, useState } from "react";
import { listImages, uploadImage, deleteImage } from "../../api/supplier";
import { useParams } from "react-router-dom";

export default function SupplierProductImages() {
  const { id } = useParams(); // product id
  const [items, setItems] = useState([]);
  const [file, setFile] = useState(null);
  const [alt, setAlt] = useState("");

  const load = async () => {
    const { data } = await listImages(id);
    setItems(data);
  };

  useEffect(() => { load(); /* eslint-disable-next-line*/ }, [id]);

  const onUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    const fd = new FormData();
    fd.append("image", file);
    fd.append("is_primary", 0); // uvek false
    if (alt) fd.append("alt", alt);
    await uploadImage(id, fd);
    setFile(null); setAlt("");
    load();
  };

  const onDelete = async (imageId) => {
    if (!window.confirm("Obrisati sliku?")) return;
    await deleteImage(id, imageId);
    // optimističko ažuriranje
    setItems((prev) => prev.filter((x) => x.id !== imageId));
  };

  return (
    <div className="container">
      <h2>Slike proizvoda #{id}</h2>

      <form onSubmit={onUpload} className="form" style={{ marginBottom: 16 }}>
        <div className="grid grid-2">
          <div className="field">
            <label>Fajl</label>
            <input type="file" onChange={(e)=>setFile(e.target.files?.[0] || null)} accept="image/*" />
          </div>
          <div className="field">
            <label>Alt tekst (opciono)</label>
            <input value={alt} onChange={(e)=>setAlt(e.target.value)} />
          </div>
        </div>
        <button className="btn">Otpremi</button>
      </form>

      <div className="cards grid" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))" }}>
        {items.map(img=>(
          <div key={img.id} className="card">
            <img 
              src={`http://localhost:8000${img.url}`} 
              alt={img.alt || ""} 
              style={{ width:"100%", height:160, objectFit:"cover", borderRadius:12 }} 
            />
            <div className="flex-between" style={{ marginTop:8, gap:8 }}>
              <button className="btn btn--ghost danger" onClick={()=>onDelete(img.id)}>Obriši</button>
            </div>
          </div>
        ))}
        {!items.length && <p>Nema slika.</p>}
      </div>
    </div>
  );
}
