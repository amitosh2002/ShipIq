import React, { useState } from 'react';
import ApiExplorer from './ApiExplorer';
import History from './History';
import { Activity, Clock } from 'lucide-react';

export default function ApiSandbox() {
  const [activeTab, setActiveTab] = useState('explorer');
  const [history, setHistory] = useState([]);
  const handleAddHistory = (log) => {
    setHistory((prev) => [log, ...prev]);
  };

  return (
    <div className="sandbox-container">
      <header className="sandbox-header">
        <div className="sandbox-title">
          <Activity size={24} color="#6366f1" />
          API Sandbox
        </div>
        <nav className="sandbox-tabs">
          <button 
            className={`sandbox-tab ${activeTab === 'explorer' ? 'active' : ''}`}
            onClick={() => setActiveTab('explorer')}
          >
            <Activity size={16} />
            Explorer
          </button>
          <button 
            className={`sandbox-tab ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <Clock size={16} />
            History ({history.length})
          </button>
        </nav>
      </header>
      <div className="sandbox-content-padding">
        {activeTab === 'explorer' ? (
          <ApiExplorer onLogResponse={handleAddHistory} />
        ) : (
          <History logs={history} />
        )}
      </div>
    </div>
  );
}
