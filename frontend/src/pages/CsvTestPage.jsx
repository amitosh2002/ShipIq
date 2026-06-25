import { useState, useRef } from 'react';

function parseCSV(text) {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const vals = lines[i].split(',').map(v => v.trim());
    if (vals.length < headers.length) continue;
    const row = {};
    headers.forEach((h, idx) => {
      row[h] = vals[idx];
    });
    rows.push(row);
  }
  return rows;
}

export default function CsvTestPage() {
  const [cargoFile, setCargoFile] = useState(null);
  const [tankFile, setTankFile] = useState(null);
  const [cargos, setCargos] = useState([]);
  const [tanks, setTanks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [log, setLog] = useState([]);

  const cargoInputRef = useRef(null);
  const tankInputRef = useRef(null);

  const addLog = (msg, type = 'info') => {
    setLog(prev => [...prev, { msg, type, time: new Date().toLocaleTimeString() }]);
  };

  const handleCargoFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCargoFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const rows = parseCSV(ev.target.result);
      const parsed = rows.map(r => ({ id: r.id, volume: Number(r.volume) })).filter(r => r.id && !isNaN(r.volume));
      setCargos(parsed);
      addLog(`Loaded ${parsed.length} cargos from ${file.name}`, 'success');
    };
    reader.readAsText(file);
  };

  const handleTankFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setTankFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const rows = parseCSV(ev.target.result);
      const parsed = rows.map(r => ({ id: r.id, capacity: Number(r.capacity) })).filter(r => r.id && !isNaN(r.capacity));
      setTanks(parsed);
      addLog(`Loaded ${parsed.length} tanks from ${file.name}`, 'success');
    };
    reader.readAsText(file);
  };

  const runTest = async () => {
    setLoading(true);
    setError(null);
    setResults(null);
    addLog('Starting optimization test…');

    try {
      const API_URL = import.meta.env.VITE_API_URL || '';

      // Step 1: Submit input
      addLog('Sending cargo & tank data to API…');
      const inputRes = await fetch(`${API_URL}/input`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cargos, tanks })
      });
      const inputData = await inputRes.json();
      if (!inputRes.ok) throw new Error(inputData.message);
      addLog(`Session created: ${inputData.session_id}`, 'success');

      // Step 2: Optimize
      addLog('Running greedy optimizer…');
      const optRes = await fetch(`${API_URL}/optimize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: inputData.session_id })
      });
      const optData = await optRes.json();
      if (!optRes.ok) throw new Error(optData.message);
      addLog(`Optimization complete — ${optData.allocationCount} allocations made`, 'success');

      // Step 3: Fetch results
      addLog('Fetching allocation results…');
      const resRes = await fetch(`${API_URL}/results?session_id=${inputData.session_id}`);
      const resData = await resRes.json();
      if (!resRes.ok) throw new Error(resData.message);

      setResults(resData);
      addLog(`Test passed ✓ — ${resData.summary.utilizationPercent}% utilization`, 'success');
    } catch (err) {
      setError(err.message);
      addLog(`Error: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const resetAll = () => {
    setCargos([]);
    setTanks([]);
    setCargoFile(null);
    setTankFile(null);
    setResults(null);
    setError(null);
    setLog([]);
    if (cargoInputRef.current) cargoInputRef.current.value = '';
    if (tankInputRef.current) tankInputRef.current.value = '';
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'full_cargo':
        return <span className="badge badge-success">Full Cargo</span>;
      case 'split':
        return <span className="badge badge-warning">Split</span>;
      case 'partial_tank':
        return <span className="badge badge-info">Partial Tank</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  const totalCargoVol = cargos.reduce((s, c) => s + c.volume, 0);
  const totalTankCap = tanks.reduce((s, t) => s + t.capacity, 0);

  return (
    <div className="app-container">
      <div className="page-header">
        <h1>CSV Test Runner</h1>
        <p>Upload CSV files with cargo and tank data to test the optimization engine.</p>
      </div>

      {/* CSV Format Hint */}
      <div className="csv-hint card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-body">
          <div className="csv-hint-grid">
            <div>
              <strong style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Cargos CSV Format</strong>
              <pre className="csv-preview">id,volume{'\n'}C1,5000{'\n'}C2,3000{'\n'}C3,1200</pre>
            </div>
            <div>
              <strong style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Tanks CSV Format</strong>
              <pre className="csv-preview">id,capacity{'\n'}T1,6000{'\n'}T2,2500{'\n'}T3,1000</pre>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <div className="grid-2">
        {/* Cargo Upload */}
        <div className="card">
          <div className="card-header">
            <div className="card-header-left">
              <div className="card-icon cargo">📦</div>
              <span className="card-title">Cargos CSV</span>
            </div>
            {cargos.length > 0 && <span className="card-count">{cargos.length} loaded</span>}
          </div>
          <div className="card-body">
            <div
              className={`dropzone ${cargoFile ? 'dropzone-loaded' : ''}`}
              onClick={() => cargoInputRef.current?.click()}
            >
              <input
                ref={cargoInputRef}
                type="file"
                accept=".csv"
                onChange={handleCargoFile}
                style={{ display: 'none' }}
              />
              {cargoFile ? (
                <>
                  <div className="dropzone-icon">✅</div>
                  <div className="dropzone-name">{cargoFile.name}</div>
                  <div className="dropzone-meta">{cargos.length} cargos · {totalCargoVol.toLocaleString()} total volume</div>
                </>
              ) : (
                <>
                  <div className="dropzone-icon">📁</div>
                  <div className="dropzone-label">Click to upload cargos CSV</div>
                  <div className="dropzone-meta">Columns: id, volume</div>
                </>
              )}
            </div>

            {/* Preview Table */}
            {cargos.length > 0 && (
              <table className="alloc-table" style={{ marginTop: '1rem' }}>
                <thead>
                  <tr><th>ID</th><th>Volume</th></tr>
                </thead>
                <tbody>
                  {cargos.slice(0, 10).map((c, i) => (
                    <tr key={i}><td><strong>{c.id}</strong></td><td>{c.volume.toLocaleString()}</td></tr>
                  ))}
                  {cargos.length > 10 && (
                    <tr><td colSpan={2} style={{ textAlign: 'center', color: 'var(--text-tertiary)' }}>…and {cargos.length - 10} more</td></tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Tank Upload */}
        <div className="card">
          <div className="card-header">
            <div className="card-header-left">
              <div className="card-icon tank">🛢️</div>
              <span className="card-title">Tanks CSV</span>
            </div>
            {tanks.length > 0 && <span className="card-count">{tanks.length} loaded</span>}
          </div>
          <div className="card-body">
            <div
              className={`dropzone ${tankFile ? 'dropzone-loaded' : ''}`}
              onClick={() => tankInputRef.current?.click()}
            >
              <input
                ref={tankInputRef}
                type="file"
                accept=".csv"
                onChange={handleTankFile}
                style={{ display: 'none' }}
              />
              {tankFile ? (
                <>
                  <div className="dropzone-icon">✅</div>
                  <div className="dropzone-name">{tankFile.name}</div>
                  <div className="dropzone-meta">{tanks.length} tanks · {totalTankCap.toLocaleString()} total capacity</div>
                </>
              ) : (
                <>
                  <div className="dropzone-icon">📁</div>
                  <div className="dropzone-label">Click to upload tanks CSV</div>
                  <div className="dropzone-meta">Columns: id, capacity</div>
                </>
              )}
            </div>

            {/* Preview Table */}
            {tanks.length > 0 && (
              <table className="alloc-table" style={{ marginTop: '1rem' }}>
                <thead>
                  <tr><th>ID</th><th>Capacity</th></tr>
                </thead>
                <tbody>
                  {tanks.slice(0, 10).map((t, i) => (
                    <tr key={i}><td><strong>{t.id}</strong></td><td>{t.capacity.toLocaleString()}</td></tr>
                  ))}
                  {tanks.length > 10 && (
                    <tr><td colSpan={2} style={{ textAlign: 'center', color: 'var(--text-tertiary)' }}>…and {tanks.length - 10} more</td></tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="action-bar" style={{ gap: '1rem' }}>
        <button
          className="btn btn-optimize"
          onClick={runTest}
          disabled={loading || cargos.length === 0 || tanks.length === 0}
        >
          {loading ? (
            <><span className="spinner"></span> Running Test…</>
          ) : (
            '🧪 Run Test'
          )}
        </button>
        {(cargos.length > 0 || tanks.length > 0 || log.length > 0) && (
          <button className="btn btn-ghost" onClick={resetAll}>Reset All</button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="alert alert-error">
          <span className="alert-icon">⚠</span>
          <div>{error}</div>
        </div>
      )}

      {/* Log Console */}
      {log.length > 0 && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div className="card-header">
            <div className="card-header-left">
              <div className="card-icon" style={{ background: '#f5f3ff', color: '#7c3aed' }}>💻</div>
              <span className="card-title">Test Log</span>
            </div>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            <div className="test-log">
              {log.map((entry, i) => (
                <div key={i} className={`log-line log-${entry.type}`}>
                  <span className="log-time">{entry.time}</span>
                  <span className="log-msg">{entry.msg}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {results && (
        <div className="results-section">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value success">{results.summary.utilizationPercent}%</div>
              <div className="stat-label">Utilization</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{results.summary.totalLoaded.toLocaleString()}</div>
              <div className="stat-label">Total Loaded</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{results.summary.totalCapacity.toLocaleString()}</div>
              <div className="stat-label">Total Capacity</div>
            </div>
          </div>

          <div className="utilization-bar-container">
            <div className="utilization-header">
              <span className="utilization-label">Capacity Utilization</span>
              <span className="utilization-pct">{results.summary.utilizationPercent}%</span>
            </div>
            <div className="utilization-track">
              <div className="utilization-fill" style={{ width: `${Math.min(results.summary.utilizationPercent, 100)}%` }}></div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-header-left">
                <div className="card-icon cargo">📋</div>
                <span className="card-title">Allocation Breakdown</span>
              </div>
              <span className="card-count">{results.allocations.length} allocations</span>
            </div>
            <div className="card-body" style={{ padding: 0 }}>
              {results.allocations.length === 0 ? (
                <div className="empty-state">No allocations were made.</div>
              ) : (
                <table className="alloc-table">
                  <thead>
                    <tr><th>Tank</th><th>Cargo</th><th>Volume</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {results.allocations.map((a, i) => (
                      <tr key={i}>
                        <td><strong>{a.tankId}</strong></td>
                        <td>{a.cargoId}</td>
                        <td>{a.allocatedVolume.toLocaleString()}</td>
                        <td>{getStatusBadge(a.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
