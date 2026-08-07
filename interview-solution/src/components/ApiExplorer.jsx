import React, { useState, useEffect, useRef } from 'react';
import { Send, AlertTriangle, CheckCircle, Clock, Server, Loader2, X } from 'lucide-react';

const API_BASE = 'http://localhost:3000';

export default function ApiExplorer({ onLogResponse }) {
  const [metadata, setMetadata] = useState(null);
  const [activeEndpointIndex, setActiveEndpointIndex] = useState(0);
  const [formValues, setFormValues] = useState({});
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [responseTime, setResponseTime] = useState(null);
  
  const abortControllerRef = useRef(null);

  // Fetch metadata on mount
  useEffect(() => {
    fetch(`${API_BASE}/metadata`)
      .then(res => res.json())
      .then(data => setMetadata(data))
      .catch(err => console.error("Failed to fetch metadata:", err));
  }, []);

  const activeEndpoint = metadata?.endpoints[activeEndpointIndex];
  const paramsSchema = activeEndpoint?.queryParams || activeEndpoint?.bodyParams || [];

  // Handle form changes
  const handleParamChange = (name, value) => {
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  // Reset form when switching endpoints
  useEffect(() => {
    setFormValues({});
    setResponse(null);
    setError(null);
  }, [activeEndpointIndex]);

  // Cancel Request
  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setLoading(false);
      setError("Request cancelled by user (Timeout aborted)");
    }
  };

  // Execute Request
  const handleExecute = async () => {
    if (!activeEndpoint) return;
    
    setLoading(true);
    setError(null);
    setResponse(null);
    
    abortControllerRef.current = new AbortController();
    const startTime = Date.now();
    let finalStatus = null;
    let responseData = null;

    try {
      let url = `${API_BASE}${activeEndpoint.path}`;
      let options = {
        method: activeEndpoint.method,
        signal: abortControllerRef.current.signal,
        headers: {}
      };

      // Handle Query params for GET/DELETE
      if (['GET', 'DELETE'].includes(activeEndpoint.method)) {
        const query = new URLSearchParams();
        Object.entries(formValues).forEach(([key, val]) => {
          if (val) query.append(key, val);
        });
        const queryString = query.toString();
        if (queryString) url += `?${queryString}`;
      } 
      // Handle Body params for POST/PUT
      else {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(formValues);
        
        // Handle path variable replacement (e.g., /projects/:id)
        if (url.includes(':id')) {
          const id = prompt("Enter ID for the URL path variable:");
          url = url.replace(':id', id || 'unknown_id');
        }
      }

      const res = await fetch(url, options);
      finalStatus = res.status;
      
      const text = await res.text();
      
      // Intentional JSON parsing wrapper to catch malformed JSON edge cases
      try {
        responseData = JSON.parse(text);
        setResponse(responseData);
      } catch (parseError) {
        throw new Error(`Malformed JSON response from server: ${text.substring(0, 50)}...`);
      }

      if (!res.ok) {
        throw new Error(responseData.message || `HTTP Error ${res.status}`);
      }

    } catch (err) {
      if (err.name === 'AbortError') {
        setError('Request timed out (Aborted)');
      } else {
        setError(err.message);
      }
    } finally {
      const duration = Date.now() - startTime;
      setResponseTime(duration);
      setLoading(false);
      
      // Log it to the parent history state
      onLogResponse({
        id: `REP-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        endpoint: activeEndpoint.path,
        method: activeEndpoint.method,
        params: { ...formValues },
        status: finalStatus || 500,
        response: responseData || { error: error || "Request Failed" },
        timeMs: duration,
        timestamp: new Date().toISOString()
      });
    }
  };

  if (!metadata) return (
    <div className="main-content loading-state">
      <Loader2 size={32} className="spinner" />
      <p>Loading API Schema...</p>
    </div>
  );

  return (
    <main className="main-content">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-header">Available Endpoints</div>
        <ul className="endpoint-list">
          {metadata.endpoints.map((ep, idx) => (
            <li 
              key={idx} 
              className={`endpoint-item ${activeEndpointIndex === idx ? 'active' : ''}`}
              onClick={() => setActiveEndpointIndex(idx)}
            >
              <span className={`method-badge method-${ep.method}`}>{ep.method}</span>
              <span style={{ fontSize: '0.9rem' }}>{ep.name}</span>
            </li>
          ))}
        </ul>
      </aside>

      {/* Explorer Workspace */}
      <section className="workspace">
        <div className="request-panel">
          <div className="url-bar">
            <input 
              type="text" 
              className="url-input" 
              readOnly 
              value={`${API_BASE}${activeEndpoint.path}`} 
            />
            {loading ? (
              <button className="btn-danger" onClick={handleCancel}>
                <X size={16} /> Cancel
              </button>
            ) : (
              <button className="btn-primary" onClick={handleExecute}>
                <Send size={16} /> Send
              </button>
            )}
          </div>

          {paramsSchema.length > 0 && (
            <div className="params-container">
              {paramsSchema.map((param) => (
                <div className="param-group" key={param.name}>
                  <label>{param.name} {param.required && '*'}</label>
                  {param.type === 'select' ? (
                    <select 
                      className="param-select"
                      value={formValues[param.name] || ''}
                      onChange={(e) => handleParamChange(param.name, e.target.value)}
                    >
                      <option value="">-- Select --</option>
                      {param.options.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input 
                      type="text" 
                      className="param-input"
                      placeholder={`Enter ${param.type}`}
                      value={formValues[param.name] || ''}
                      onChange={(e) => handleParamChange(param.name, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Response Panel */}
        <div className="response-panel">
          <div className="response-header">
            <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Response</span>
            {responseTime !== null && (
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <span className="status-badge status-2xx" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={14} /> {responseTime}ms
                </span>
                {response && !error && (
                  <span className="status-badge status-2xx">
                    <CheckCircle size={14} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '4px' }} />
                    200 OK
                  </span>
                )}
                {error && (
                  <span className="status-badge status-5xx">
                    <AlertTriangle size={14} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '4px' }} />
                    Failed
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="response-body">
            {loading && !response && !error && (
              <div className="loading-state">
                <Loader2 size={32} className="spinner" />
                <p>Waiting for server response...</p>
              </div>
            )}
            
            {error && (
              <div style={{ color: 'var(--error)', padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '6px', marginBottom: '1rem' }}>
                <h4 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertTriangle size={18} /> API Request Failed
                </h4>
                {error}
              </div>
            )}
            
            {response && (
              <pre className="json-viewer">
                {JSON.stringify(response, null, 2)}
              </pre>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
