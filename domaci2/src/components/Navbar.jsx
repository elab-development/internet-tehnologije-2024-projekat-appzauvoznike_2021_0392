import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <div className="container header__inner">
        <div className="brand">
          <span className="brand__logo">IM</span>
          <span className="brand__name">Import Manager</span>
        </div>

        <nav className="nav">
          {!user && (
            <>
              <Link to="/">Početna</Link>
              <Link to="/auth" className="btn btn--ghost">Prijava / Registracija</Link>
            </>
          )}

          {user?.role === "admin" && (
            <>
              <Link to="/admin">Admin</Link>
              <button onClick={logout} className="btn btn--ghost">Odjava</button>
            </>
          )}

          {user?.role === "supplier" && (
            <>
              <Link to="/supplier">Supplier</Link>
              <button onClick={logout} className="btn btn--ghost">Odjava</button>
            </>
          )}

          {user?.role === "importer" && (
            <>
              <Link to="/importer">Importer</Link>
              <button onClick={logout} className="btn btn--ghost">Odjava</button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
