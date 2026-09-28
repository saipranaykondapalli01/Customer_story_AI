import React from 'react';
import { Brain, Sparkles, RefreshCw } from 'lucide-react';

interface HeaderProps {
  isBackendConnected: boolean;
  isCheckingHealth: boolean;
  onRetryConnection: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isBackendConnected,
  isCheckingHealth,
  onRetryConnection,
}) => {
  return (
    <header className="app-header">
      <div className="brand-wrapper">
        <div className="brand-icon-wrapper">
          <Brain size={26} />
        </div>
        <div className="brand-title-group">
          <h1>
            CustomerStory AI <span className="badge-ai"><Sparkles size={11} style={{ display: 'inline', marginRight: 2 }} /> Memory AGENT</span>
          </h1>
          <p>
            AI-powered support memory agent — Never ask customers to repeat their story
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div className="status-pill">
          <span className={`status-dot ${isBackendConnected ? 'online' : 'offline'}`}></span>
          <span>{isBackendConnected ? 'FastAPI Connected' : 'Backend Offline'}</span>
        </div>

        {!isBackendConnected && (
          <button
            onClick={onRetryConnection}
            disabled={isCheckingHealth}
            className="chip-btn"
            title="Retry connecting to http://127.0.0.1:8000"
          >
            {isCheckingHealth ? <div className="spinner" style={{ width: 12, height: 12 }} /> : <RefreshCw size={13} />}
            <span>Retry</span>
          </button>
        )}
      </div>
    </header>
  );
};
