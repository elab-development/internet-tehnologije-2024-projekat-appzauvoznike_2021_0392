import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; 

import Navbar from './components/Navbar';
import Home from './pages/Home';
import AuthPage from './pages/AuthPage'; 
function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Navbar />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<AuthPage />} />

           
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
