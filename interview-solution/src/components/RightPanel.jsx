import React from 'react';
import { Mail, Bell, MoreVertical } from 'lucide-react';

export default function RightPanel() {
  const tasks = [
    { title: 'Upload Assignment', time: '10:00 am', color: '#f59e0b' }, // Yellow
    { title: 'Study for API Challenge', time: '10:00 am', color: '#10b981' }, // Green
    { title: 'Paragraph Corrections', time: '10:00 am', color: '#8b5cf6' }, // Purple
    { title: 'Spell Check README', time: '10:00 am', color: '#ef4444' }, // Red
  ];

  return (
    <aside className="right-panel">
      <div className="top-actions">
        <button className="icon-btn"><Mail size={20} /></button>
        <button className="icon-btn" style={{ position: 'relative' }}>
          <Bell size={20} />
          <span style={{ position: 'absolute', top: '-4px', right: '-4px', backgroundColor: '#ef4444', width: '12px', height: '12px', borderRadius: '50%', border: '2px solid white' }}></span>
        </button>
        <div className="profile-pic">A</div>
      </div>

      <div className="widget" style={{ textAlign: 'center', backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '12px' }}>
        <h3 style={{ fontSize: '1rem' }}>August 2026</h3>
        {/* Mocking the calendar visual */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem', fontSize: '0.75rem', marginTop: '1rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
          {[...Array(31)].map((_, i) => (
            <span key={i} style={i === 11 ? { backgroundColor: 'var(--accent-blue)', color: 'white', borderRadius: '50%', padding: '0.2rem' } : {}}>{i + 1}</span>
          ))}
        </div>
      </div>

      <div className="widget">
        <h3>Your Tasks Today</h3>
        <div className="task-list">
          {tasks.map((task, i) => (
            <div key={i} className="task-item">
              <div className="task-dot" style={{ backgroundColor: task.color }}></div>
              <span>{task.title}</span>
              <span className="task-time">{task.time}</span>
              <MoreVertical size={14} color="var(--text-secondary)" style={{ marginLeft: '0.5rem', cursor: 'pointer' }} />
            </div>
          ))}
          <button className="btn-yellow" style={{ backgroundColor: 'transparent', border: '1px solid var(--accent-blue)', color: 'var(--accent-blue)', marginTop: '1rem', width: '100%' }}>
            + Create New
          </button>
        </div>
      </div>
    </aside>
  );
}
