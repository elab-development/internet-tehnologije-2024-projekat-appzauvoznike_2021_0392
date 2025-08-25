
# Aplikacija za uvoznike 

Ovaj projekat je informacioni sistem namenjen uvoznicima i njihovim partnerima (dobavljačima). 
Aplikacija omogućava kreiranje i razmenu ponuda, upravljanje partnerstvima i formiranje kontejnera sa stavkama.

---

## Opis aplikacije
Aplikacija povezuje **uvoznike** i **dobavljače**. Uvoznici mogu da pretražuju dobavljače, pregledaju njihove ponude, 
kreiraju partnerstva i formiraju kontejnere sa artiklima. Dobavljači kreiraju i održavaju svoje ponude i proizvode, dok 
administrator ima pregled nad svim podacima i mogućnost intervencije.

## Glavne funkcionalnosti
- Registracija, prijava i odjava korisnika (uvoznici, dobavljači, admin).  
- Upravljanje proizvodima (CRUD).  
- Kreiranje i održavanje ponuda i stavki ponuda.  
- Upravljanje partnerstvima između uvoznika i dobavljača.  
- Kreiranje i uređivanje kontejnera i stavki kontejnera.  
- Različite uloge sa ograničenim pravima pristupa.  

## Tehnologije
- **Backend**: Laravel (PHP 8+), MySQL baza, Eloquent ORM.  
- **Frontend**: React, React Router, Axios.  
- **Autentikacija**: Laravel Sanctum (SPA token auth).  
- **Dizajn**: custom CSS.  

## Struktura direktorijuma
```
/domaci1 (Laravel)
  app/
    Http/Controllers/
      AuthController.php
      ProductController.php
      OfferController.php
      PartnershipController.php
      ContainerController.php
    Models/
      User.php
      Product.php
      Offer.php
      Partnership.php
      Container.php
      ContainerItem.php
  database/migrations/
  routes/api.php
  composer.json

/domaci2 (React)
  src/
    pages/
      HomePage.jsx
      Login.jsx
      Register.jsx
      supplier/
          SupplierDashboard.jsx
          SupplierOffer.jsx
          SuplierProducts.jsx
      importer/
        ImporterDashboard.jsx
        ImporterOffers.jsx
        ImporterPartnerships.jsx
        ImporterContainers.jsx
      admin/
        AdminCompanies.jsx
        AdminPartnerships.jsx
    components/
      Navbar.jsx
      Footer.jsx
    api/axios.js
    context/AuthContext.jsx
  public/
  package.json
```

## Instalacija i pokretanje
### Backend
1. Pređite u direktorijum `backend`:
   ```bash
   cd domaci1
   composer install
   cp .env.example .env
   php artisan key:generate
   ```
2. Podesite `.env` parametre za bazu.  
3. Pokrenite migracije:
   ```bash
   php artisan migrate
   ```
4. Startujte server:
   ```bash
   php artisan serve
   ```

### Frontend
1. U drugom terminalu:
   ```bash
   cd domaci2
   npm install
   npm run dev
   ```
2. Podesite `VITE_API_BASE_URL` u `.env` ili direktno u `axios.js`.  

## Uloge korisnika
- **Admin** – vidi sve kompanije, partnerstva i ponude.  
- **Importer** – upravlja sopstvenim kontejnerima, pretražuje i bira ponude, sklapa partnerstva.  
- **Supplier (Dobavljač)** – kreira i održava svoje proizvode i ponude.  

## API rute (primeri)
```
POST   /api/login
POST   /api/register
POST   /api/logout

GET    /api/products
POST   /api/products            (supplier)
PUT    /api/products/{id}       (supplier)
DELETE /api/products/{id}       (supplier)

GET    /api/offers
POST   /api/offers              (supplier)
PUT    /api/offers/{id}         (supplier)
DELETE /api/offers/{id}         (supplier)

GET    /api/partnerships        (importer, admin)
POST   /api/partnerships        (importer)
DELETE /api/partnerships/{id}   (importer, admin)

GET    /api/containers          (importer, admin)
POST   /api/containers          (importer)
PUT    /api/containers/{id}     (importer)
DELETE /api/containers/{id}     (importer)
```

## Frontend rute
- `/login`, `/register`  
- `/importer/dashboard`, `/importer/offers`, `/importer/partnerships`, `/importer/containers`  
- `/admin/companies`, `/admin/partnerships`  

## Promenljive okruženja
**Backend (`.env`):**
```
DB_DATABASE=importers_app
DB_USERNAME=root
DB_PASSWORD=
```

**Frontend (`.env`):**
```
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```


## Licenca
Ovaj projekat je razvijen za edukativne i istraživačke svrhe. Može se slobodno koristiti i prilagođavati.
