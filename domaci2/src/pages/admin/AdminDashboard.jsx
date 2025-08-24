// src/pages/admin/AdminDashboard.jsx
import { Outlet, NavLink, Link } from "react-router-dom";
import "./admin.css";

export default function AdminDashboard() {
  return (
    <div className="container page admin">
      <header className="admin-hero">
        <div className="admin-hero__txt">
          <h1>Admin Dashboard</h1>
          <p>Centralno upravljanje kompanijama, partnerstvima, ponudama i kontejnerima.</p>
        </div>
        <div className="admin-hero__cta">
          <Link to="/admin/companies" className="btn btn--primary">+ Nova kompanija</Link>
        </div>
      </header>

      <nav className="tabs tabs--pill">
        <NavLink end to="/admin" className={({isActive}) => isActive ? "active" : ""}>Overview</NavLink>
        <NavLink to="/admin/companies" className={({isActive}) => isActive ? "active" : ""}>Kompanije</NavLink>
        <NavLink to="/admin/partnerships" className={({isActive}) => isActive ? "active" : ""}>Partnerstva</NavLink>
        <NavLink to="/admin/products" className={({isActive}) => isActive ? "active" : ""}>Proizvodi</NavLink>
        <NavLink to="/admin/offers" className={({isActive}) => isActive ? "active" : ""}>Ponude</NavLink>
        <NavLink to="/admin/containers" className={({isActive}) => isActive ? "active" : ""}>Kontejneri</NavLink>
      </nav>

      <div className="admin-body">
        <Outlet />
      </div>
    </div>
  );
}
