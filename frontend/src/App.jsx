import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/common/Layout';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Estimates from './pages/Estimates';
import Invoices from './pages/Invoices';
import Payments from './pages/Payments';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="clients" element={<Clients />} />
          <Route path="estimates" element={<Estimates />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="payments" element={<Payments />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
