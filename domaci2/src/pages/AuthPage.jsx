// src/pages/AuthPage.jsx
import React, { useState } from "react";
import api from "../api/axios";
import useCompanies from "../hooks/useCompanies";
import { useAuth } from "../context/AuthContext";
import "./auth.css";
 
import FormField from "../components/FormField";
import Input from "../components/Input";
import Select from "../components/Select";
import Button from "../components/Button";

export default function AuthPage() {
  const { login } = useAuth();

  const [mode, setMode] = useState("login"); // 'login' | 'register'
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [errors, setErrors] = useState({});

  const {
    companies,
    loading: loadingCompanies,
    error: companiesError,
  } = useCompanies("/companies-public");

  const [loginForm, setLoginForm] = useState({
    email: "ana@gmail.com",
    password: "password",
  });

  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "importer",
    company_id: "",
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
    setLoading(true);
    setMsg(null);
    setErrors({});
    try {
      const { data } = await api.post("/auth/login", loginForm);
      login(data.user, data.token);
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
    setLoading(true);
    setMsg(null);
    setErrors({});
    const payload = { ...registerForm };
    if (!payload.company_id) delete payload.company_id;

    try {
      const { data } = await api.post("/auth/register", payload);
      login(data.user, data.token);
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
              <FormField label="Email" error={errors.email?.[0]}>
                <Input
                  type="email"
                  name="email"
                  value={loginForm.email}
                  onChange={handleLoginChange}
                  placeholder="you@example.com"
                  required
                />
              </FormField>

              <FormField label="Lozinka" error={errors.password?.[0]}>
                <Input
                  type="password"
                  name="password"
                  value={loginForm.password}
                  onChange={handleLoginChange}
                  placeholder="••••••••"
                  required
                />
              </FormField>

              <Button
                as="button"
                type="submit"
                variant="primary"
                className="w-100"
                disabled={loading}
              >
                {loading ? "Prijava..." : "Prijavi se"}
              </Button>

              <div className="switch">
                Nemaš nalog?{" "}
                <Button as="button" type="button" variant="link" onClick={switchMode}>
                  Registruj se
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={onRegister} className="form">
              <div className="grid grid-2">
                <FormField label="Ime i prezime" error={errors.name?.[0]}>
                  <Input
                    name="name"
                    value={registerForm.name}
                    onChange={handleRegisterChange}
                    placeholder="Ana Anić"
                    required
                  />
                </FormField>

                <FormField label="Telefon (opciono)" error={errors.phone?.[0]}>
                  <Input
                    name="phone"
                    value={registerForm.phone}
                    onChange={handleRegisterChange}
                    placeholder="+381 6x xxx xxxx"
                  />
                </FormField>
              </div>

              <div className="grid grid-2">
                <FormField label="Email" error={errors.email?.[0]}>
                  <Input
                    type="email"
                    name="email"
                    value={registerForm.email}
                    onChange={handleRegisterChange}
                    placeholder="you@example.com"
                    required
                  />
                </FormField>

                <FormField label="Lozinka" error={errors.password?.[0]}>
                  <Input
                    type="password"
                    name="password"
                    value={registerForm.password}
                    onChange={handleRegisterChange}
                    placeholder="min 6 karaktera"
                    required
                  />
                </FormField>
              </div>

              <div className="grid grid-2">
                <FormField label="Uloga" error={errors.role?.[0]}>
                  <Select
                    name="role"
                    value={registerForm.role}
                    onChange={handleRegisterChange}
                    required
                  >
                    <option value="importer">Importer</option>
                    <option value="supplier">Supplier</option>
                  </Select>
                </FormField>

                <FormField
                  label="Kompanija (opciono)"
                  error={errors.company_id?.[0]}
                  help={loadingCompanies ? "Učitavanje kompanija…" : undefined}
                >
                  <Select
                    name="company_id"
                    value={registerForm.company_id}
                    onChange={handleRegisterChange}
                    disabled={loadingCompanies}
                  >
                    <option value="">— Odaberi kompaniju —</option>
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} {c.type ? `(${c.type})` : ""}
                      </option>
                    ))}
                  </Select>
                </FormField>
              </div>

              <Button
                as="button"
                type="submit"
                variant="primary"
                className="w-100"
                disabled={loading}
              >
                {loading ? "Registracija..." : "Kreiraj nalog"}
              </Button>

              <div className="switch">
                Već imaš nalog?{" "}
                <Button as="button" type="button" variant="link" onClick={switchMode}>
                  Prijavi se
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
