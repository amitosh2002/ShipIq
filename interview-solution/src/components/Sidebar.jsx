import React from 'react';
import { Home, BarChart2, FileText, PlayCircle, Settings, Globe } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'My Results', icon: BarChart2, path: '/dummy-results' },
    { name: 'Submissions', icon: FileText, path: '/dummy-submissions' },
    { name: 'Tutorials', icon: PlayCircle, path: '/dummy-tutorials' },
    { name: 'Settings', icon: Settings, path: '/dummy-settings' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <Globe size={24} />
        </div>
        Hora-Skool
      </div>
      <nav className="nav-menu">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <button 
              key={item.name} 
              className={`nav-link ${isActive ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <Icon size={20} />
              {item.name}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
