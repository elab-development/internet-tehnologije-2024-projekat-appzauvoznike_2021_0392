import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; 

import Navbar from './components/Navbar';
import Home from './pages/Home';
import AuthPage from './pages/AuthPage'; 
import SupplierDashboard from './pages/supplier/SupplierDashboard';
import SupplierProducts from './pages/supplier/SupplierProducts';
import SupplierProductForm from './pages/supplier/SupplierProductForm';
import SupplierProductImages from './pages/supplier/SupplierProductImages';
import SupplierOffers from './pages/supplier/SupplierOffers';
import SupplierOfferForm from './pages/supplier/SupplierOfferForm';
import Breadcrumbs from './components/Breadcrumbs';
import ImporterDashboard from './pages/importer/ImporterDashboard';
import ImporterSuppliers from './pages/importer/ImporterSuppliers';
import ImporterPartnerships from './pages/importer/ImporterPartnerships';
import ImporterContainerForm from './pages/importer/ImporterContainerForm';
import ImporterContainers from './pages/importer/ImporterContainers';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCompanies from './pages/admin/AdminCompanies';
import AdminOverview from './pages/admin/AdminOverview';
function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Navbar />
          <Breadcrumbs />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<AuthPage />} />
             <Route path="/supplier" element={<SupplierDashboard />} />
             <Route path="/supplier/products" element={<SupplierProducts />} />
             <Route path="/supplier/products/new" element={<SupplierProductForm />} />
            <Route path="/supplier/products/:id/edit" element={<SupplierProductForm />} />
          
            {/* Slike proizvoda */}
            <Route path="/supplier/products/:id/images" element={<SupplierProductImages />} />

            {/* Ponude */}
            <Route path="/supplier/offers" element={<SupplierOffers />} />
            <Route path="/supplier/offers/new" element={<SupplierOfferForm />} />
            <Route path="/supplier/offers/:id/edit" element={<SupplierOfferForm />} />



            {/* za seminarski */}
           <Route path="/importer" element={<ImporterDashboard />} />
           <Route path="/importer/suppliers" element={<ImporterSuppliers />} />
            <Route path="/importer/partnerships" element={<ImporterPartnerships />} />
            <Route path="/importer/containers" element={<ImporterContainers />} />
              <Route path="/importer/containers/new" element={<ImporterContainerForm />} />
            <Route path="/importer/containers/:id/edit" element={<ImporterContainerForm />} />

            <Route path="/admin" element={<AdminDashboard />}>
              {/* OVDE je “Overview” kao index pod-ruta */}
              <Route index element={<AdminOverview />} />
              <Route path="companies" element={<AdminCompanies />} /> 
              {/* ostali tabovi ako ih imaš */}
              {/* */}
              {/* <Route path="partnerships" element={<AdminPartnerships />} /> */}
              {/* <Route path="products" element={<AdminProducts />} /> */}
              {/* <Route path="offers" element={<AdminOffers />} /> */}
              {/* <Route path="containers" element={<AdminContainers />} /> */}
            </Route>
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
