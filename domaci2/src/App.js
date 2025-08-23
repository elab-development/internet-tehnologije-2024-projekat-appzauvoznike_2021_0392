import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; 

import Navbar from './components/Navbar';
import Home from './pages/Home';
import AuthPage from './pages/AuthPage'; 
import SupplierDashboard from './pages/supplier/SupplierDashboard';
import SupplierProducts from './pages/supplier/SupplierProducts';
import SupplierProductForm from './pages/supplier/SupplierProductForm';
function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Navbar />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<AuthPage />} />
             <Route path="/supplier" element={<SupplierDashboard />} />
             <Route path="/supplier/products" element={<SupplierProducts />} />
             <Route path="/supplier/products/new" element={<SupplierProductForm />} />
            <Route path="/supplier/products/:id/edit" element={<SupplierProductForm />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
