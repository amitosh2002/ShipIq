import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Code, Database, Activity, Search,Clock } from 'lucide-react';

const ASSIGNMENTS = [
  {
    id: 'api-explorer',
    title: 'API Explorer',
    role: 'Full-Stack Engineer',
    time: '60 Mins',
    difficulty: 'Advanced',
    icon: <Activity size={24} color="var(--accent-blue)" />,
    description: 'Build a dynamic API client that handles real-world edge cases.'
  },
  {
    id: 'qa-testing',
    title: 'QA Challenge',
    role: 'SDET',
    time: '45 Mins',
    difficulty: 'Advanced',
    icon: <Database size={24} color="var(--warning)" />,
    description: 'Build a test suite to validate chaos logic and timeouts.'
  },
  {
    id: 'github-pr-explorer',
    title: 'GitHub PRs',
    role: 'Frontend Engineer',
    time: '40 Mins',
    difficulty: 'Intermediate',
    icon: <Code size={24} color="var(--success)" />,
    description: 'Fetch and explore GitHub Pull Requests with dynamic filters.'
  }
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      <div className="search-bar">
        <Search size={18} />
        <input type="text" placeholder="What do you want to build today?" />
      </div>

      <div className="hero-banner">
        <div className="hero-content">
          <h1>Your Profile</h1>
          <p>Welcome to your Interview Portal. Select an assessment below to begin your evaluation and demonstrate your skills.</p>
          <button className="btn-yellow">Start Assessment</button>
        </div>
        <div className="hero-illustration" style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '12px' }}>
          {/* Mocking the illustration from the image */}
          <div style={{ fontSize: '3rem' }}>👨‍💻</div>
        </div>
      </div>

      <div className="section-header">
        <h2>Your Assignments</h2>
        <a href="#">View More</a>
      </div>

      <div className="assignment-grid">
        {ASSIGNMENTS.map((assignment) => (
          <div key={assignment.id} className="assignment-card" onClick={() => navigate(`/assessment/${assignment.id}`)}>
            <div className="card-icon-container">{assignment.icon}</div>
            <div className="card-title">{assignment.title}</div>
            <div className="card-subtitle">{assignment.description}</div>
            <div className="card-meta">
              <span className="badge new">New</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Clock size={12} /> {assignment.time}
              </span>
            </div>
            {/* Mock progress bar */}
            <div style={{ width: '100%', height: '4px', backgroundColor: '#f1f5f9', marginTop: '1.5rem', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: assignment.id === 'api-explorer' ? '0%' : assignment.id === 'qa-testing' ? '100%' : '35%', height: '100%', background: 'linear-gradient(90deg, #6366f1, #a855f7)' }}></div>
            </div>
          </div>
        ))}
      </div>
{/* 
      <div className="section-header">
        <h2>Activities</h2>
        <a href="#">View More</a>
      </div>
       */}
      {/* <div className="activity-list">
        <div className="activity-item">
          <div className="activity-avatar">SJ</div>
          <div className="activity-content"><strong>Sara Joseph</strong> shared new assignment feedback for <strong>API Explorer</strong></div>
          <div className="activity-time">4 h</div>
        </div>
        <div className="activity-item">
          <div className="activity-avatar">M</div>
          <div className="activity-content"><strong>Mabel</strong> checked in to your assignment <strong>GitHub PRs V1.0</strong></div>
          <div className="activity-time">4 h</div>
        </div>
      </div> */}
    </>
  );
}
