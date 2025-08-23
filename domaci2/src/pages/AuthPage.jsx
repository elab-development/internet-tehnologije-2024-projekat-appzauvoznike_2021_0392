import React, { useState } from "react";
import api from "../api/axios";
import "./auth.css";

export default function AuthPage() {
  const [mode, setMode] = useState("login"); // 'login' | 'register'
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [errors, setErrors] = useState({});

  // forme
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "importer",    // admin | importer | supplier
    company_id: ""       // opciono
  });

  const handleLoginChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e) => {
    setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });
  };

  const switchMode = () => {
    setMsg(null);
    setErrors({});
    setMode(mode === "login" ? "register" : "login");
  };

  const onLogin = async (e) => {
    e.preventDefault();
    setLoading(true); setMsg(null); setErrors({});
    try {
      const { data } = await api.post("/auth/login", loginForm);
      localStorage.setItem("token", data.token);
      setMsg("Uspešna prijava.");
      // TODO: redirect npr. na /dashboard
    } catch (err) {
      const res = err.response?.data;
      setMsg(res?.message || "Greška pri prijavi.");
      if (res?.errors) setErrors(res.errors);
    } finally {
      setLoading(false);
    }
  };

  const onRegister = async (e) => {
    e.preventDefault();
    setLoading(true); setMsg(null); setErrors({});
    // company_id može ostati prazan – backend ga ima kao nullable
    const payload = { ...registerForm };
    if (payload.company_id === "") delete payload.company_id;

    try {
      const { data } = await api.post("/auth/register", payload);
      localStorage.setItem("token", data.token);
      setMsg("Uspešna registracija.");
      setMode("login");
      setLoginForm({ email: registerForm.email, password: "" });
    } catch (err) {
      const res = err.response?.data;
      setMsg(res?.message || "Greška pri registraciji.");
      if (res?.errors) setErrors(res.errors);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="container auth__container">
        <div className="auth__panel">
          <div className="brand">
            <span className="brand__logo">IM</span>
            <span className="brand__name">Import Manager</span>
          </div>

          <h1 className="auth__title">
            {mode === "login" ? "Prijava" : "Registracija"}
          </h1>
          <p className="auth__subtitle">
            {mode === "login"
              ? "Unesite e-mail i lozinku da nastavite."
              : "Kreirajte nalog i odaberite ulogu."}
          </p>

          {msg && <div className="alert">{msg}</div>}

          {mode === "login" ? (
            <form onSubmit={onLogin} className="form">
              <div className="field">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={loginForm.email}
                  onChange={handleLoginChange}
                  placeholder="you@example.com"
                  required
                />
                {errors.email && <small className="err">{errors.email[0]}</small>}
              </div>

              <div className="field">
                <label>Lozinka</label>
                <input
                  type="password"
                  name="password"
                  value={loginForm.password}
                  onChange={handleLoginChange}
                  placeholder="••••••••"
                  required
                />
                {errors.password && <small className="err">{errors.password[0]}</small>}
              </div>

              <button type="submit" className="btn btn--primary w-100" disabled={loading}>
                {loading ? "Prijava..." : "Prijavi se"}
              </button>

              <div className="switch">
                Nemaš nalog?{" "}
                <button type="button" className="link" onClick={switchMode}>
                  Registruj se
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={onRegister} className="form">
              <div className="grid grid-2">
                <div className="field">
                  <label>Ime i prezime</label>
                  <input
                    type="text"
                    name="name"
                    value={registerForm.name}
                    onChange={handleRegisterChange}
                    placeholder="Ana Anić"
                    required
                  />
                  {errors.name && <small className="err">{errors.name[0]}</small>}
                </div>

                <div className="field">
                  <label>Telefon (opciono)</label>
                  <input
                    type="text"
                    name="phone"
                    value={registerForm.phone}
                    onChange={handleRegisterChange}
                    placeholder="+381 6x xxx xxxx"
                  />
                  {errors.phone && <small className="err">{errors.phone[0]}</small>}
                </div>
              </div>

              <div className="grid grid-2">
                <div className="field">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={registerForm.email}
                    onChange={handleRegisterChange}
                    placeholder="you@example.com"
                    required
                  />
                  {errors.email && <small className="err">{errors.email[0]}</small>}
                </div>

                <div className="field">
                  <label>Lozinka</label>
                  <input
                    type="password"
                    name="password"
                    value={registerForm.password}
                    onChange={handleRegisterChange}
                    placeholder="min 6 karaktera"
                    required
                  />
                  {errors.password && <small className="err">{errors.password[0]}</small>}
                </div>
              </div>

              <div className="grid grid-2">
                <div className="field">
                  <label>Uloga</label>
                  <select
                    name="role"
                    value={registerForm.role}
                    onChange={handleRegisterChange}
                    required
                  >
                    <option value="importer">Importer</option>
                    <option value="supplier">Supplier</option>
                    <option value="admin">Admin</option>
                  </select>
                  {errors.role && <small className="err">{errors.role[0]}</small>}
                </div>

                <div className="field">
                  <label>Company ID (opciono)</label>
                  <input
                    type="number"
                    name="company_id"
                    value={registerForm.company_id}
                    onChange={handleRegisterChange}
                    placeholder="npr. 1"
                  />
                  {errors.company_id && <small className="err">{errors.company_id[0]}</small>}
                </div>
              </div>

              <button type="submit" className="btn btn--primary w-100" disabled={loading}>
                {loading ? "Registracija..." : "Kreiraj nalog"}
              </button>

              <div className="switch">
                Već imaš nalog?{" "}
                <button type="button" className="link" onClick={switchMode}>
                  Prijavi se
                </button>
              </div>
            </form>
          )}
        </div>

        <aside className="auth__aside">
          <div className="aside__card">
            <h3>Dobrodošli!</h3>
            <p className="muted">
              Upravljajte proizvodima, ponudama, partnerstvima i kontejnerima uz kontrolisan pristup. 
              Koristite podatke iz demo baze ili kreirajte sopstveni nalog.
            </p>
            <ul className="list">
              <li>Role-based pristup (admin / importer / supplier)</li>
              <li>REST API sa Sanctum tokenima</li>
              <li>Moderna UI paleta i glačan UX</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
