import React from "react";
import { Link } from "react-router-dom";
import "./supplier.css";

export default function SupplierDashboard() {
  return (
    <div className="sup-wrap">
      <header className="sup-hero">
        <div className="sup-hero__text">
          <h1>Supplier Dashboard</h1>
          <p>Brzi pregled i pristup ključnim sekcijama.</p>
          <div className="sup-cta">
            <Link className="btn btn-primary" to="/supplier/products">
              <span aria-hidden="true">📦</span> Moji proizvodi
            </Link>
            <Link className="btn btn-ghost" to="/supplier/offers">
              <span aria-hidden="true">🧾</span> Moje ponude
            </Link>
          </div>
        </div>
        <div className="sup-hero__bg" aria-hidden="true" />
      </header>

      <section className="sup-quick">
        <h2>Brzi linkovi</h2>
        <div className="sup-grid">
          <Link to="/supplier/products" className="sup-card">
            <div className="sup-card__icon">📦</div>
            <div className="sup-card__body">
              <h3>Moji proizvodi</h3>
              <p>Pregled, dodavanje i uređivanje proizvoda.</p>
            </div>
            <span className="sup-card__chev" aria-hidden="true">→</span>
          </Link>

          <Link to="/supplier/offers" className="sup-card">
            <div className="sup-card__icon">🧾</div>
            <div className="sup-card__body">
              <h3>Moje ponude</h3>
              <p>Kreiraj i upravljaj ponudama kupcima.</p>
            </div>
            <span className="sup-card__chev" aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <section className="sup-stats">
        <h2>Statistika (primer)</h2>
        <div className="sup-stats__grid">
          <div className="sup-stat">
            <span className="sup-stat__label">Ukupno proizvoda</span>
            <span className="sup-stat__value">128</span>
            <span className="sup-trend up">+6% ovaj mesec</span>
          </div>
          <div className="sup-stat">
            <span className="sup-stat__label">Aktivne ponude</span>
            <span className="sup-stat__value">14</span>
            <span className="sup-trend flat">0% nedeljno</span>
          </div>
          <div className="sup-stat">
            <span className="sup-stat__label">Prosečna cena</span>
            <span className="sup-stat__value">€42.50</span>
            <span className="sup-trend down">−3% od juče</span>
          </div>
        </div>
        <p className="sup-note">
          * Ove brojke su mock primer — povezati sa backendom kad bude spremno.
        </p>
      </section>
    </div>
  );
}
