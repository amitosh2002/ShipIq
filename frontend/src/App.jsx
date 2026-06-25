import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import ManualInputPage from './pages/ManualInputPage';
import CsvTestPage from './pages/CsvTestPage';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-brand">
          <div className="navbar-logo">⚓</div>
          <div>
            <div className="navbar-title">ShipIQ</div>
            <div className="navbar-subtitle">Cargo Optimization Engine</div>
          </div>
        </div>
        <div className="nav-links">
          <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}>
            ⚡ Manual Input
          </NavLink>
          <NavLink to="/csv-test" className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}>
            🧪 CSV Test
          </NavLink>
        </div>
        <div className="navbar-status">
          <span className="status-dot"></span>
          System Online
        </div>
      </nav>

      {/* Pages */}
      <Routes>
        <Route path="/" element={<ManualInputPage />} />
        <Route path="/csv-test" element={<CsvTestPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
