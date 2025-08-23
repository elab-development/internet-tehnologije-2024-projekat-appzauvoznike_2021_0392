import React from "react";
import "./home.css";

export default function Home() {
  return (
    <div className="site">
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

      <main>
        {/* Hero */}
        <section className="hero">
          <div className="container hero__inner">
            <div className="hero__text">
              <h1>Centralizovan uvoz robe – ponude, proizvodi, partnerstva i kontejneri na jednom mestu.</h1>
              <p>
                Aplikacija za uvoznike i dobavljače: upravljajte proizvodima, kreirajte ponude,
                održavajte partnerstva i planirajte kontejnere u skladu sa ograničenjima i troškovima.
              </p>
              <div className="hero__cta">
                <a href="#cta" className="btn btn--primary">Započnite</a>
                <a href="#features" className="btn btn--secondary">Saznaj više</a>
              </div>
              <div className="hero__stats">
                <div className="stat">
                  <span className="stat__num">99.9%</span>
                  <span className="stat__label">Uptime</span>
                </div>
                <div className="stat">
                  <span className="stat__num">10k+</span>
                  <span className="stat__label">Proizvoda</span>
                </div>
                <div className="stat">
                  <span className="stat__num">3</span>
                  <span className="stat__label">Uloge</span>
                </div>
              </div>
            </div>

            <div className="hero__card">
              <div className="glass card--gradient">
                <h3>Brzi pregled</h3>
                <ul className="list">
                  <li>📦 Katalog proizvoda sa slikama i karakteristikama</li>
                  <li>💼 Ponude dobavljača sa stavkama i popustima</li>
                  <li>🤝 Partnerstva uvoznik–dobavljač (kontrolisan pristup)</li>
                  <li>🚛 Planiranje kontejnera (dimenzije, težina, trošak)</li>
                </ul>
                <div className="hero__mini-cta">
                  <button className="btn btn--primary w-100">Prijava</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="features">
          <div className="container">
            <h2>Ključne funkcionalnosti</h2>
            <div className="grid grid-3">
              <Feature
                title="Ponude dobavljača"
                text="Kreirajte i objavite ponude, dodajte stavke sa cenama, MOQ i popustima."
              />
              <Feature
                title="Pronalaženje dobavljača"
                text="Pretraga po zemlji i capability poljima – nađite relevantne partnere."
              />
              <Feature
                title="Kontejneri i troškovi"
                text="Planirajte kontejnere u skladu sa zapreminom, težinom i procenjenim troškovima."
              />
              <Feature
                title="Katalog proizvoda"
                text="Šifra, naziv, slika, dimenzije i karakteristike – sve strukturirano."
              />
              <Feature
                title="Kontrolisan pristup"
                text="Uvoznik vidi ponude samo partner dobavljača; admin vidi sve."
              />
              <Feature
                title="API & Integracije"
                text="Čist REST API sa role-based pristupom spreman za integracije."
              />
            </div>
          </div>
        </section>

        {/* Roles */}
        <section id="roles" className="roles">
          <div className="container">
            <h2>Uloge u sistemu</h2>
            <div className="grid grid-3">
              <Role
                badge="Admin"
                title="Administratori"
                points={[
                  "Upravljanje kompanijama i partnerstvima",
                  "Pregled svih proizvoda, ponuda i kontejnera",
                  "Audit i nadzor sistema",
                ]}
              />
              <Role
                badge="Supplier"
                title="Dobavljači"
                points={[
                  "Upravljanje sopstvenim proizvodima i slikama",
                  "Kreiranje i uređivanje ponuda i stavki",
                  "Analitika potražnje",
                ]}
              />
              <Role
                badge="Importer"
                title="Uvoznici"
                points={[
                  "Pretraga dobavljača i partnerstva",
                  "Pregled ponuda partnera",
                  "Kreiranje i planiranje kontejnera",
                ]}
              />
            </div>
          </div>
        </section>

        {/* Modules */}
        <section id="modules" className="modules">
          <div className="container">
            <h2>Moduli aplikacije</h2>
            <div className="grid grid-4">
              <Module title="Proizvodi" meta="CRUD / Slike / Kategorije" />
              <Module title="Ponude" meta="Stavke / Incoterms / Plaćanje" />
              <Module title="Kontejneri" meta="Dimenzije / Težina / Trošak" />
              <Module title="Partnerstva" meta="Importer ↔ Supplier" />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section id="cta" className="cta">
          <div className="container cta__inner">
            <div>
              <h2>Spremni da ubrzate svoj uvoz?</h2>
              <p>Napravite nalog i testirajte sve funkcionalnosti kroz demo podatke.</p>
            </div>
            <div className="cta__actions">
              <a className="btn btn--primary">Kreiraj nalog</a>
              <a className="btn btn--ghost">Kontakt prodaju</a>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer__inner">
          <div className="brand brand--muted">
            <span className="brand__logo">IM</span>
            <span className="brand__name">Import Manager</span>
          </div>
          <nav className="footer__nav">
            <a href="#features">Funkcionalnosti</a>
            <a href="#roles">Uloge</a>
            <a href="#modules">Moduli</a>
            <a href="#cta">Demo</a>
          </nav>
          <div className="footer__copy">© {new Date().getFullYear()} Import Manager</div>
        </div>
      </footer>
    </div>
  );
}

function Feature({ title, text }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

function Role({ badge, title, points }) {
  return (
    <div className="card card--role">
      <span className="badge">{badge}</span>
      <h3>{title}</h3>
      <ul className="list list--check">
        {points.map((p, i) => <li key={i}>{p}</li>)}
      </ul>
    </div>
  );
}

function Module({ title, meta }) {
  return (
    <div className="card card--module">
      <h4>{title}</h4>
      <span className="muted">{meta}</span>
    </div>
  );
}
