import React, { useState } from "react";
import api from "../api/axios";
import useCompanies from "../hooks/useCompanies";
import "./auth.css";

export default function AuthPage() {
  const [mode, setMode] = useState("login"); // 'login' | 'register'
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [errors, setErrors] = useState({});

  // učitavanje firmi (podesi endpoint ako treba)
  const { companies, loading: loadingCompanies, error: companiesError } =
    useCompanies("/companies-public");

  // forme
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });

  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "importer", // importer | supplier
    company_id: ""    // bira se iz select-a (opciono)
  });

  const handleLoginChange = (e) =>
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });

  const handleRegisterChange = (e) =>
    setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });

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
    const payload = { ...registerForm };
    if (!payload.company_id) delete payload.company_id;

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
              : "Kreirajte nalog, odaberite ulogu i (opciono) povežite firmu."}
          </p>

          {msg && <div className="alert">{msg}</div>}
          {companiesError && mode === "register" && (
            <div className="alert">{companiesError}</div>
          )}

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
                    className="select"
                  >
                    <option value="importer">Importer</option>
                    <option value="supplier">Supplier</option>
                   
                  </select>
                  {errors.role && <small className="err">{errors.role[0]}</small>}
                </div>

                <div className="field">
                  <label>Kompanija (opciono)</label>
                  <select
                    name="company_id"
                    value={registerForm.company_id}
                    onChange={handleRegisterChange}
                    className="select"
                    disabled={loadingCompanies}
                  >
                    <option value="">— Odaberi kompaniju —</option>
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} {c.type ? `(${c.type})` : ""}
                      </option>
                    ))}
                  </select>
                  {loadingCompanies && <small className="muted">Učitavanje kompanija…</small>}
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
      </div>
    </div>
  );
}
