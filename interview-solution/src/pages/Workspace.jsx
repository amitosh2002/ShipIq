import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiExplorer from '../components/ApiExplorer';
import History from '../components/History';
import { Activity, Clock, ArrowLeft } from 'lucide-react';

export default function Workspace() {
  const [activeTab, setActiveTab] = useState('explorer');
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  const handleAddHistory = (log) => {
    setHistory((prev) => [log, ...prev]);
  };

  return (
    <>
      <header className="app-header">
        <div className="app-title">
          <button className="btn-icon" onClick={() => navigate('/assessment/api-explorer')} title="Back to Assessment">
            <ArrowLeft size={20} />
          </button>
          <Activity size={24} color="var(--accent)" />
          Workspace: API Explorer
        </div>
        <nav className="tabs">
          <button 
            className={`tab-btn ${activeTab === 'explorer' ? 'active' : ''}`}
            onClick={() => setActiveTab('explorer')}
          >
            <Activity size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }} />
            Explorer
          </button>
          <button 
            className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <Clock size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }} />
            History ({history.length})
          </button>
        </nav>
      </header>
      
      {activeTab === 'explorer' ? (
        <ApiExplorer onLogResponse={handleAddHistory} />
      ) : (
        <History logs={history} />
      )}
    </>
  );
}
