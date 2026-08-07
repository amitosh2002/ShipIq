import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, Terminal } from 'lucide-react';
import { API_EXPLORER_ASSIGNMENT, QA_TESTING_ASSIGNMENT, GITHUB_PR_ASSIGNMENT } from '../data/assignmentText';
import GithubSandbox from '../components/GithubSandbox';

export default function Assessment() {
  const { id } = useParams();
  const navigate = useNavigate();

  let markdownContent = `# ${id} \n\nThis is a placeholder for the ${id} assignment prompt.`;
  if (id === 'api-explorer') {
    markdownContent = API_EXPLORER_ASSIGNMENT;
  } else if (id === 'qa-testing') {
    markdownContent = QA_TESTING_ASSIGNMENT;
  } else if (id === 'github-pr-explorer') {
    markdownContent = GITHUB_PR_ASSIGNMENT;
  }

  return (
    <div className="portal-container">
      <button className="btn-back" onClick={() => navigate('/')}>
        <ArrowLeft size={16} /> Back to Assignments
      </button>

      <div className="assessment-content">
        <div className="markdown-body">
          <ReactMarkdown>{markdownContent}</ReactMarkdown>
        </div>
      </div>

      {id === 'github-pr-explorer' && (
        <div style={{ marginTop: '2rem' }}>
          <h2>API Sandbox</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Use this interactive sandbox to test the mock GitHub endpoints. The required mock token will be automatically injected into your headers.
          </p>
          <GithubSandbox />
        </div>
      )}

      {id === 'api-explorer' && (
        <div className="launch-bar">
          <p>Ready to begin?</p>
          <button className="btn-primary" onClick={() => navigate('/workspace')}>
            <Terminal size={18} /> Launch Workspace
          </button>
        </div>
      )}
    </div>
  );
}
