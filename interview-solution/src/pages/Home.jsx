import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Code, Server, Database, Activity } from 'lucide-react';

const ASSIGNMENTS = [
  {
    id: 'api-explorer',
    title: 'API Explorer & Monitoring Tool',
    role: 'Full-Stack Engineer',
    time: '40 - 60 Minutes',
    difficulty: 'Advanced',
    icon: <Activity size={32} color="var(--accent)" />,
    description: 'Build a dynamic API client that handles real-world edge cases, timeouts, and logs execution history.'
  },
  {
    id: 'qa-testing',
    title: 'QA & Testing Challenge',
    role: 'QA Engineer / SDET',
    time: '45 Minutes',
    difficulty: 'Advanced',
    icon: <Database size={32} color="var(--warning)" />,
    description: 'Build a test suite to validate the chaos logic, timeouts, and data structures of a resilient API.'
  }
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="portal-container">
      <header className="portal-header">
        <h1><Code size={28} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '10px' }} />Hora Interview Portal</h1>
        <p>Select an assignment below to view the instructions and begin.</p>
      </header>

      <div className="assignment-grid">
        {ASSIGNMENTS.map((assignment) => (
          <div key={assignment.id} className="assignment-card" onClick={() => navigate(`/assessment/${assignment.id}`)}>
            <div className="card-icon">{assignment.icon}</div>
            <h2>{assignment.title}</h2>
            <p className="card-desc">{assignment.description}</p>
            <div className="card-meta">
              <span className="badge">{assignment.role}</span>
              <span className="badge badge-outline">{assignment.time}</span>
              <span className="badge badge-outline">{assignment.difficulty}</span>
            </div>
            <button className="btn-primary" style={{ width: '100%', marginTop: '1rem', justifyContent: 'center' }}>
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
