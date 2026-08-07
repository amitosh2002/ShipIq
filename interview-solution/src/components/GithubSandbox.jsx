import React, { useState } from 'react';
import { Play, Loader2, AlertCircle } from 'lucide-react';

export default function GithubSandbox() {
  const [owner, setOwner] = useState('hora-hq');
  const [repo, setRepo] = useState('core-api');
  const [pullNumber, setPullNumber] = useState('101');
  const [token, setToken] = useState('mock-token-123');
  
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const fetchApi = async (url) => {
    setLoading(true);
    setError(null);
    setResponse(null);
    try {
      const res = await fetch(`http://localhost:3000${url}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(`HTTP Error ${res.status}: ${data.message || 'Unknown error'}`);
      }
      
      setResponse(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sandbox-container" style={{ backgroundColor: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <div className="form-group" style={{ flex: '1 1 200px' }}>
          <label>Owner</label>
          <input 
            type="text" 
            className="input-field" 
            value={owner} 
            onChange={(e) => setOwner(e.target.value)} 
          />
        </div>
        <div className="form-group" style={{ flex: '1 1 200px' }}>
          <label>Repo</label>
          <input 
            type="text" 
            className="input-field" 
            value={repo} 
            onChange={(e) => setRepo(e.target.value)} 
          />
        </div>
        <div className="form-group" style={{ flex: '1 1 100px' }}>
          <label>PR Number (Optional)</label>
          <input 
            type="text" 
            className="input-field" 
            value={pullNumber} 
            onChange={(e) => setPullNumber(e.target.value)} 
          />
        </div>
        <div className="form-group" style={{ flex: '1 1 150px' }}>
          <label>Auth Token</label>
          <input 
            type="text" 
            className="input-field" 
            value={token} 
            onChange={(e) => setToken(e.target.value)} 
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button 
          className="btn-primary" 
          onClick={() => fetchApi(`/repos/${owner}/${repo}`)}
          disabled={loading}
        >
          <Play size={16} /> Fetch Repo Summary
        </button>
        <button 
          className="btn-primary" 
          onClick={() => fetchApi(`/repos/${owner}/${repo}/pulls`)}
          disabled={loading}
        >
          <Play size={16} /> Fetch Pull Requests
        </button>
        <button 
          className="btn-primary" 
          onClick={() => fetchApi(`/repos/${owner}/${repo}/pulls/${pullNumber}`)}
          disabled={loading || !pullNumber}
        >
          <Play size={16} /> Fetch Single PR
        </button>
      </div>

      {loading && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
          <Loader2 size={16} className="spinner" /> 
          Waiting for Mock API (may take up to 20s if Chaos is triggered)...
        </div>
      )}

      {error && (
        <div className="error-banner" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {response && (
        <div className="response-viewer" style={{ marginTop: '1rem' }}>
          <h4>Response Payload (JSON)</h4>
          <pre style={{ backgroundColor: 'var(--bg-primary)', padding: '1rem', borderRadius: '8px', overflowX: 'auto', fontSize: '0.85rem' }}>
            <code>{JSON.stringify(response, null, 2)}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
