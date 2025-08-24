import React from "react";
import { Link } from "react-router-dom";
import "../supplier/supplier.css";

export default function ImporterDashboard() {
  return (
    <div className="sup-wrap">
      <header className="sup-hero">
        <div className="sup-hero__text">
          <h1>Importer Dashboard</h1>
          <p>Pretraga dobavljača, partnerstva i planiranje kontejnera.</p>
          <div className="sup-cta">
            <Link className="btn btn-primary" to="/importer/suppliers">🔎 Dobavljači</Link>
            <Link className="btn btn-ghost" to="/importer/partnerships">🤝 Partnerstva</Link>
            <Link className="btn btn-ghost" to="/importer/containers">🚛 Kontejneri</Link>
          </div>
        </div>
        <div className="sup-hero__bg" aria-hidden="true" />
      </header>
    </div>
  );
}
