import React from "react";


export default function Navbar() {
  return (
    <header className="header">
      <div className="container header__inner">
        <div className="brand">
          <span className="brand__logo">IM</span>
          <span className="brand__name">Import Manager</span>
        </div>

        <nav className="nav">
          <a href="#features">Funkcionalnosti</a>
          <a href="#roles">Uloge</a>
          <a href="#modules">Moduli</a>
          <a href="#cta" className="btn btn--ghost">Demo</a>
        </nav>
      </div>
    </header>
  );
}
