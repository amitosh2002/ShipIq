import { useState } from 'react';

function ManualInputPage() {
  // --- State ---
  const [cargos, setCargos] = useState([]);
  const [tanks, setTanks] = useState([]);

  const [cargoId, setCargoId] = useState('');
  const [cargoVol, setCargoVol] = useState('');
  const [tankId, setTankId] = useState('');
  const [tankCap, setTankCap] = useState('');

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  // --- Helpers ---
  const currentStep = results ? 3 : loading ? 2 : 1;

  const addCargo = () => {
    if (!cargoId.trim() || !cargoVol) return;
    setCargos([...cargos, { id: cargoId.trim(), volume: Number(cargoVol) }]);
    setCargoId('');
    setCargoVol('');
  };

  const addTank = () => {
    if (!tankId.trim() || !tankCap) return;
    setTanks([...tanks, { id: tankId.trim(), capacity: Number(tankCap) }]);
    setTankId('');
    setTankCap('');
  };

  const removeCargo = (index) => setCargos(cargos.filter((_, i) => i !== index));
  const removeTank = (index) => setTanks(tanks.filter((_, i) => i !== index));

  const handleKeyDown = (e, action) => {
    if (e.key === 'Enter') action();
  };

  const resetAll = () => {
    setResults(null);
    setError(null);
  };

  const handleOptimize = async () => {
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      const API_URL = import.meta.env.VITE_API_URL || '';

      const inputRes = await fetch(`${API_URL}/input`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cargos, tanks })
      });
      const inputData = await inputRes.json();
      if (!inputRes.ok) throw new Error(inputData.message);

      const sessionId = inputData.session_id;

      const optRes = await fetch(`${API_URL}/optimize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId })
      });
      const optData = await optRes.json();
      if (!optRes.ok) throw new Error(optData.message);

      const resRes = await fetch(`${API_URL}/results?session_id=${sessionId}`);
      const resData = await resRes.json();
      if (!resRes.ok) throw new Error(resData.message);

      setResults(resData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="app-container">
      <div className="page-header">
        <h1>Cargo Allocation Optimizer</h1>
        <p>Enter your cargo and tank data, then run the optimization algorithm.</p>
      </div>

      {/* Stepper */}
      <div className="stepper">
        <div className={`step ${currentStep >= 1 ? (currentStep > 1 ? 'completed' : 'active') : ''}`}>
          <span className="step-number">{currentStep > 1 ? '✓' : '1'}</span>
          Input Data
        </div>
        <div className={`step-connector ${currentStep >= 2 ? 'active' : ''}`}></div>
        <div className={`step ${currentStep >= 2 ? (currentStep > 2 ? 'completed' : 'active') : ''}`}>
          <span className="step-number">{currentStep > 2 ? '✓' : '2'}</span>
          Optimize
        </div>
        <div className={`step-connector ${currentStep >= 3 ? 'active' : ''}`}></div>
        <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
          <span className="step-number">3</span>
          Results
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          <span className="alert-icon">⚠</span>
          <div>{error}</div>
        </div>
      )}

      <div className="grid-2">
        {/* Cargos */}
        <div className="card">
          <div className="card-header">
            <div className="card-header-left">
              <div className="card-icon cargo">📦</div>
              <span className="card-title">Cargos</span>
            </div>
            <span className="card-count">{cargos.length} items</span>
          </div>
          <div className="card-body">
            <div className="form-row">
              <input className="form-input" type="text" placeholder="ID (e.g. C1)" value={cargoId} onChange={e => setCargoId(e.target.value)} onKeyDown={e => handleKeyDown(e, addCargo)} />
              <input className="form-input" type="number" placeholder="Volume" value={cargoVol} onChange={e => setCargoVol(e.target.value)} onKeyDown={e => handleKeyDown(e, addCargo)} />
              <button className="btn btn-primary" onClick={addCargo}>Add</button>
            </div>
            {cargos.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📦</div>
                <div>No cargos added yet</div>
              </div>
            ) : (
              <ul className="item-list">
                {cargos.map((c, idx) => (
                  <li key={idx} className="item-row">
                    <div className="item-info">
                      <span className="item-id">{c.id}</span>
                      <span className="item-value">{c.volume.toLocaleString()} units</span>
                    </div>
                    <button className="btn-danger-ghost" onClick={() => removeCargo(idx)}>✕</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Tanks */}
        <div className="card">
          <div className="card-header">
            <div className="card-header-left">
              <div className="card-icon tank">🛢️</div>
              <span className="card-title">Tanks</span>
            </div>
            <span className="card-count">{tanks.length} items</span>
          </div>
          <div className="card-body">
            <div className="form-row">
              <input className="form-input" type="text" placeholder="ID (e.g. T1)" value={tankId} onChange={e => setTankId(e.target.value)} onKeyDown={e => handleKeyDown(e, addTank)} />
              <input className="form-input" type="number" placeholder="Capacity" value={tankCap} onChange={e => setTankCap(e.target.value)} onKeyDown={e => handleKeyDown(e, addTank)} />
              <button className="btn btn-primary" onClick={addTank}>Add</button>
            </div>
            {tanks.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">🛢️</div>
                <div>No tanks added yet</div>
              </div>
            ) : (
              <ul className="item-list">
                {tanks.map((t, idx) => (
                  <li key={idx} className="item-row">
                    <div className="item-info">
                      <span className="item-id">{t.id}</span>
                      <span className="item-value">{t.capacity.toLocaleString()} units</span>
                    </div>
                    <button className="btn-danger-ghost" onClick={() => removeTank(idx)}>✕</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="action-bar">
        {results ? (
          <button className="btn btn-ghost" onClick={resetAll}>↻ Run New Optimization</button>
        ) : (
          <button className="btn btn-optimize" onClick={handleOptimize} disabled={loading || cargos.length === 0 || tanks.length === 0}>
            {loading ? (<><span className="spinner"></span> Optimizing…</>) : '⚡ Run Optimization'}
          </button>
        )}
      </div>

      {/* Results */}
      {results && (
        <div className="results-section">
          <div className="stats-grid">
            <div className="stat-card"><div className="stat-value success">{results.summary.utilizationPercent}%</div><div className="stat-label">Utilization</div></div>
            <div className="stat-card"><div className="stat-value">{results.summary.totalLoaded.toLocaleString()}</div><div className="stat-label">Total Loaded</div></div>
            <div className="stat-card"><div className="stat-value">{results.summary.totalCapacity.toLocaleString()}</div><div className="stat-label">Total Capacity</div></div>
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
                  <thead><tr><th>Tank</th><th>Cargo</th><th>Volume</th><th>Status</th></tr></thead>
                  <tbody>
                    {results.allocations.map((alloc, idx) => (
                      <tr key={idx}>
                        <td><strong>{alloc.tankId}</strong></td>
                        <td>{alloc.cargoId}</td>
                        <td>{alloc.allocatedVolume.toLocaleString()}</td>
                        <td>{getStatusBadge(alloc.status)}</td>
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

export default ManualInputPage;
