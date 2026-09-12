import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Trains from './pages/Trains';
import Stations from './pages/Stations';
import RoutesPage from './pages/Routes';
import Schedules from './pages/Schedules';
import Passengers from './pages/Passengers';
import Tickets from './pages/Tickets';
import Delays from './pages/Delays';
import Reports from './pages/Reports';
import './App.css';

const navItems = [
  { path: '/', label: 'Dashboard' },
  { path: '/trains', label: 'Trains' },
  { path: '/stations', label: 'Stations' },
  { path: '/routes', label: 'Routes' },
  { path: '/schedules', label: 'Schedules' },
  { path: '/passengers', label: 'Passengers' },
  { path: '/tickets', label: 'Tickets' },
  { path: '/delays', label: 'Delays' },
  { path: '/reports', label: 'Reports' },
];

function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <nav className="sidebar">
          <h2 className="sidebar-title">Railway System</h2>
          <ul>
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink to={item.path} end={item.path === '/'}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <main className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/trains" element={<Trains />} />
            <Route path="/stations" element={<Stations />} />
            <Route path="/routes" element={<RoutesPage />} />
            <Route path="/schedules" element={<Schedules />} />
            <Route path="/passengers" element={<Passengers />} />
            <Route path="/tickets" element={<Tickets />} />
            <Route path="/delays" element={<Delays />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;