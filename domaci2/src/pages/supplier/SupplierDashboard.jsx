
import React from "react";
import { Link } from "react-router-dom";
import './supplier.css';
export default function SupplierDashboard() {
  return (
    <div className="container">
      <h1>Supplier Dashboard</h1>
      <p>Brzi linkovi:</p>
      <ul>
        <li><Link to="/supplier/products">Moji proizvodi</Link></li>
        <li><Link to="/supplier/offers">Moje ponude</Link></li>
      </ul>
    </div>
  );
}
