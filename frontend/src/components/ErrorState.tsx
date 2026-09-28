import React from 'react';
import { RefreshCw, ServerOff } from 'lucide-react';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  return (
    <div className="error-banner">
      <ServerOff size={24} style={{ color: '#f87171', flexShrink: 0, marginTop: 2 }} />
      <div className="error-content" style={{ flex: 1 }}>
        <h4>Backend API Connection Error</h4>
        <p style={{ marginBottom: '0.5rem' }}>{message}</p>
        <p style={{ fontSize: '0.8rem', color: '#fca5a5' }}>
          <strong>Troubleshooting Step:</strong> Make sure your FastAPI backend is running on <code>http://127.0.0.1:8000</code>.
          <br />
          Command to start backend: <code>cd backend &amp;&amp; uvicorn main:app --reload</code>
        </p>
        <button
          onClick={onRetry}
          className="chip-btn"
          style={{ marginTop: '0.75rem', background: 'rgba(244, 63, 94, 0.2)', borderColor: 'rgba(244, 63, 94, 0.4)', color: '#fff' }}
        >
          <RefreshCw size={13} /> Retry Connection
        </button>
      </div>
    </div>
  );
};
