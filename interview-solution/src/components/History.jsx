import React from 'react';
import { Database, AlertCircle, CheckCircle } from 'lucide-react';

export default function History({ logs }) {
  if (logs.length === 0) {
    return (
      <div className="history-page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)' }}>
        <Database size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
        <h2>No History Yet</h2>
        <p>Make some API requests in the Explorer to see them logged here.</p>
      </div>
    );
  }

  return (
    <div className="history-page">
      <div className="history-header">
        <h2 className="history-title">Stored API Reports</h2>
        <p className="history-subtitle">Showing a history of all executions against the Hora Interview API</p>
      </div>

      <table className="history-table">
        <thead>
          <tr>
            <th>Report ID</th>
            <th>Method</th>
            <th>Endpoint</th>
            <th>Status</th>
            <th>Time (ms)</th>
            <th>Executed At</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{log.id}</td>
              <td>
                <span className={`method-badge method-${log.method}`}>
                  {log.method}
                </span>
              </td>
              <td style={{ fontFamily: 'monospace' }}>{log.endpoint}</td>
              <td>
                {log.status === 200 ? (
                  <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle size={14} /> 200 OK
                  </span>
                ) : (
                  <span style={{ color: 'var(--error)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <AlertCircle size={14} /> {log.status} Failed
                  </span>
                )}
              </td>
              <td>{log.timeMs}ms</td>
              <td>{new Date(log.timestamp).toLocaleTimeString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
